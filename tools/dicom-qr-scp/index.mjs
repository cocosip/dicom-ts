#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import {
  allocateOutputPath,
  formatDicomStatus,
  levelToString,
  listFiles,
  loadDicomTs,
  normalizeAe,
  parseQueryRetrieveLevel,
  validateAeTitle,
  waitForShutdownSignal,
} from "../tool-common.mjs";

const args = process.argv.slice(2);
const options = parseArgs(args);

if (options.help) {
  printHelp();
  process.exit(0);
}

if (options.error) {
  console.error(`[tool] ${options.error}`);
  printHelp();
  process.exit(1);
}

const dicom = await loadDicomTs();
if (!dicom) {
  process.exit(1);
}

if (!validateAeTitle(dicom, options.aeTitle, "--ae")) {
  process.exit(1);
}

const allowedCallingAEs = parseAllowCallingAes(options.allowCallingAesRaw);
if (!validateAllowCallingAes(dicom, allowedCallingAEs)) {
  process.exit(1);
}

const moveDestinations = parseMoveDestinations(options.moveDestinationsRaw);
for (const destinationAe of moveDestinations.keys()) {
  if (!validateAeTitle(dicom, destinationAe, "--move-destination")) {
    process.exit(1);
  }
}

const archiveDir = path.resolve(options.archiveDir);
await fs.mkdir(archiveDir, { recursive: true });

const runtime = {
  expectedCalledAE: normalizeAe(options.aeTitle),
  archiveDir,
  allowedCallingAEs: allowedCallingAEs ? new Set(allowedCallingAEs.map((ae) => normalizeAe(ae))) : null,
  moveDestinations,
  requestTimeoutMs: options.timeoutMs,
};

const serviceCtor = createQrScpServiceCtor(dicom, runtime);
const server = dicom.DicomServerFactory.create(
  (_socket, association, serviceOptions) => new serviceCtor(association, serviceOptions),
  {
    host: options.host,
    port: options.port,
  },
);

try {
  await server.start();
  console.log(`[qr-scp] Listening on ${server.host}:${server.port}`);
  console.log(`[qr-scp] Called AE: ${runtime.expectedCalledAE}`);
  console.log(`[qr-scp] Archive dir: ${runtime.archiveDir}`);
  if (runtime.allowedCallingAEs) {
    console.log(`[qr-scp] Allowed Calling AEs: ${Array.from(runtime.allowedCallingAEs).join(", ")}`);
  } else {
    console.log("[qr-scp] Allowed Calling AEs: *");
  }
  if (runtime.moveDestinations.size > 0) {
    for (const [ae, destination] of runtime.moveDestinations.entries()) {
      console.log(`[qr-scp] Move destination: ${ae} -> ${destination.host}:${destination.port}`);
    }
  } else {
    console.log("[qr-scp] Move destinations: none configured");
  }
  console.log("[qr-scp] Press Ctrl+C to stop.");

  await waitForShutdownSignal(server, "qr-scp");
} catch (error) {
  console.error(`[qr-scp] Failed to start or run SCP: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}

function createQrScpServiceCtor(dicom, runtime) {
  return class QrScpService extends dicom.DicomCEchoProvider {
    constructor(association, serviceOptions = {}) {
      super(association, {
        ...serviceOptions,
        autoSendAssociationAccept: false,
      });
    }

    async onReceiveAssociationRequest(association) {
      const calledAE = normalizeAe(association.calledAE);
      const callingAE = normalizeAe(association.callingAE);

      if (calledAE !== runtime.expectedCalledAE) {
        console.error(`[qr-scp] Reject association: called AE mismatch (expected=${runtime.expectedCalledAE}, got=${calledAE || "-"})`);
        await this.rejectAssociation(dicom.DicomRejectReason.CalledAENotRecognized);
        return;
      }

      if (runtime.allowedCallingAEs && !runtime.allowedCallingAEs.has(callingAE)) {
        console.error(`[qr-scp] Reject association: calling AE not allowed (got=${callingAE || "-"})`);
        await this.rejectAssociation(dicom.DicomRejectReason.CallingAENotRecognized);
        return;
      }

      acceptPresentationContexts(dicom, association);
      await this.sendPDU(new dicom.AAssociateAC(association));
      console.error(
        `[qr-scp] Association accepted: calling=${callingAE || "-"} called=${calledAE || "-"} `
        + `from ${association.remoteHost || "-"}:${association.remotePort || 0}`,
      );
    }

    async *onCFindRequest(request) {
      const level = request.level;
      const records = await loadArchiveRecords(dicom, runtime.archiveDir);
      const matches = findGroupedMatches(dicom, records, request.dataset, level);

      console.error(
        `[qr-scp] C-FIND level=${levelToString(dicom, level) || "-"} matches=${matches.length}`,
      );

      for (const match of matches) {
        const response = new dicom.DicomCFindResponse(request, dicom.DicomStatus.Pending.code);
        response.dataset = buildFindResponseDataset(dicom, match.dataset, request.dataset, level);
        yield response;
      }

      yield new dicom.DicomCFindResponse(request, dicom.DicomStatus.Success.code);
    }

    async *onCGetRequest(request) {
      const level = request.level;
      const records = await loadArchiveRecords(dicom, runtime.archiveDir);
      const matches = findRetrieveMatches(dicom, records, request.dataset);

      console.error(
        `[qr-scp] C-GET level=${levelToString(dicom, level) || "-"} matches=${matches.length}`,
      );

      let remaining = matches.length;
      let completed = 0;
      let warnings = 0;
      let failures = 0;

      for (const match of matches) {
        const pending = new dicom.DicomCGetResponse(request, dicom.DicomStatus.Pending.code);
        pending.remaining = remaining;
        pending.completed = completed;
        pending.warnings = warnings;
        pending.failures = failures;
        yield pending;

        try {
          const file = await dicom.DicomFile.open(match.path);
          const storeResponse = await sendStoreSubOperation(this, dicom, new dicom.DicomCStoreRequest(file));
          const state = dicom.DicomStatus.lookup(storeResponse.status).state;
          if (state === dicom.DicomState.Success) {
            completed += 1;
          } else if (state === dicom.DicomState.Warning) {
            warnings += 1;
          } else {
            failures += 1;
          }
          console.error(
            `[qr-scp] C-GET store result: ${path.basename(match.path)} ${formatDicomStatus(dicom, storeResponse.status)}`,
          );
        } catch (error) {
          failures += 1;
          console.error(
            `[qr-scp] C-GET sub-operation failed for ${match.path}: ${error instanceof Error ? error.message : String(error)}`,
          );
        }

        remaining -= 1;
      }

      yield buildFinalRetrieveResponse(dicom, "get", request, remaining, completed, warnings, failures);
    }

    async *onCMoveRequest(request) {
      const level = request.level;
      const destinationAe = normalizeAe(request.destinationAE);
      const destination = runtime.moveDestinations.get(destinationAe);
      if (!destination) {
        console.error(`[qr-scp] C-MOVE unknown destination AE: ${destinationAe || "-"}`);
        yield new dicom.DicomCMoveResponse(request, dicom.DicomStatus.QueryRetrieveMoveDestinationUnknown.code);
        return;
      }

      const records = await loadArchiveRecords(dicom, runtime.archiveDir);
      const matches = findRetrieveMatches(dicom, records, request.dataset);
      console.error(
        `[qr-scp] C-MOVE level=${levelToString(dicom, level) || "-"} destination=${destinationAe || "-"} matches=${matches.length}`,
      );

      let completed = 0;
      let warnings = 0;
      let failures = 0;

      const pending = new dicom.DicomCMoveResponse(request, dicom.DicomStatus.Pending.code);
      pending.remaining = matches.length;
      pending.completed = completed;
      pending.warnings = warnings;
      pending.failures = failures;
      yield pending;

      try {
        const client = new dicom.DicomClient({
          requestTimeoutMs: runtime.requestTimeoutMs,
          maxConcurrentRequests: 1,
        });

        for (const match of matches) {
          const file = await dicom.DicomFile.open(match.path);
          const storeRequest = new dicom.DicomCStoreRequest(file);
          storeRequest.onResponseReceived = (_rq, rsp) => {
            const state = dicom.DicomStatus.lookup(rsp.status).state;
            if (state === dicom.DicomState.Success) {
              completed += 1;
            } else if (state === dicom.DicomState.Warning) {
              warnings += 1;
            } else {
              failures += 1;
            }
            console.error(
              `[qr-scp] C-MOVE store result: ${path.basename(match.path)} ${formatDicomStatus(dicom, rsp.status)}`,
            );
          };
          client.addRequest(storeRequest);
        }

        if (matches.length > 0) {
          await client.sendAsync(destination.host, destination.port, runtime.expectedCalledAE, destinationAe);
        }
      } catch (error) {
        failures = Math.max(failures, matches.length - completed - warnings);
        console.error(`[qr-scp] C-MOVE failed: ${error instanceof Error ? error.message : String(error)}`);
      }

      const remaining = Math.max(0, matches.length - completed - warnings - failures);
      yield buildFinalRetrieveResponse(dicom, "move", request, remaining, completed, warnings, failures);
    }

    async onReceiveAssociationReleaseRequest() {
      console.error("[qr-scp] Association release requested.");
    }

    onReceiveAbort(source, reason) {
      console.error(`[qr-scp] Association aborted: source=${String(source)} reason=${String(reason)}`);
    }

    onConnectionClosed(error) {
      if (error) {
        console.error(`[qr-scp] Connection closed with error: ${error.message}`);
      } else {
        console.error("[qr-scp] Connection closed.");
      }
    }

    async rejectAssociation(reason) {
      await this.sendPDU(
        new dicom.AAssociateRJ(
          dicom.DicomRejectResult.Permanent,
          dicom.DicomRejectSource.ServiceUser,
          reason,
        ),
      );
      this.disconnect();
    }
  };
}

function parseAllowCallingAes(raw) {
  if (raw === null) {
    return null;
  }
  const values = raw.split(",").map((v) => v.trim()).filter(Boolean);
  if (values.length === 0) {
    return null;
  }
  return values;
}

function validateAllowCallingAes(dicom, allowList) {
  if (!allowList) {
    return true;
  }
  for (const ae of allowList) {
    if (!validateAeTitle(dicom, ae, "--allow-calling-ae")) {
      return false;
    }
  }
  return true;
}

function parseMoveDestinations(values) {
  const destinations = new Map();
  for (const value of values) {
    const separator = value.indexOf("=");
    if (separator < 0) {
      throw new Error(`Invalid --move-destination value "${value}". Expected AE=host:port.`);
    }
    const ae = normalizeAe(value.slice(0, separator));
    const target = value.slice(separator + 1);
    const hostSeparator = target.lastIndexOf(":");
    if (!ae || hostSeparator < 0) {
      throw new Error(`Invalid --move-destination value "${value}". Expected AE=host:port.`);
    }
    const host = target.slice(0, hostSeparator).trim();
    const port = Number(target.slice(hostSeparator + 1));
    if (!host || !Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error(`Invalid --move-destination value "${value}". Expected AE=host:port.`);
    }
    destinations.set(ae, { host, port });
  }
  return destinations;
}

function acceptPresentationContexts(dicom, association) {
  for (const context of association.presentationContexts) {
    if (context.result !== dicom.DicomPresentationContextResult.Proposed) {
      continue;
    }
    const syntax = context.getTransferSyntaxes()[0] ?? dicom.DicomTransferSyntax.ImplicitVRLittleEndian;
    context.setResult(dicom.DicomPresentationContextResult.Accept, syntax);
  }
}

async function loadArchiveRecords(dicom, archiveDir) {
  const filePaths = await listFiles(archiveDir, true);
  const records = [];
  for (const absolutePath of filePaths) {
    try {
      const file = await dicom.DicomFile.open(absolutePath, {
        readOption: dicom.FileReadOption?.SkipLargeTags ?? 3,
      });
      records.push({
        path: absolutePath,
        dataset: file.dataset,
      });
    } catch (error) {
      console.error(
        `[qr-scp] Skip unreadable archive file: ${absolutePath} `
        + `(${error instanceof Error ? error.message : String(error)})`,
      );
    }
  }
  return records;
}

function extractQueryKeys(dicom, dataset) {
  if (!dataset) {
    return [];
  }

  const keys = [];
  for (const item of dataset) {
    if (item.tag.equals(dicom.DicomTags.QueryRetrieveLevel)) {
      continue;
    }
    const value = dataset.tryGetString(item.tag);
    if (value === undefined) {
      continue;
    }
    const entry = dicom.DicomDictionary.default.lookup(item.tag);
    keys.push({
      tag: item.tag,
      keyword: entry.keyword || item.tag.toString(),
      value: String(value).trim(),
    });
  }
  return keys;
}

function findGroupedMatches(dicom, records, requestDataset, level) {
  const keys = extractQueryKeys(dicom, requestDataset);
  const matches = records.filter((record) => matchesAllKeys(record.dataset, keys));
  const grouped = new Map();
  for (const record of matches) {
    const key = groupKeyForLevel(dicom, record.dataset, level, record.path);
    if (!grouped.has(key)) {
      grouped.set(key, record);
    }
  }
  return Array.from(grouped.values());
}

function findRetrieveMatches(dicom, records, requestDataset) {
  const keys = extractQueryKeys(dicom, requestDataset).filter((key) => key.value !== "");
  return records.filter((record) => matchesAllKeys(record.dataset, keys));
}

function matchesAllKeys(dataset, keys) {
  for (const key of keys) {
    if (key.value === "") {
      continue;
    }
    const candidate = String(dataset.tryGetString(key.tag) ?? "").trim();
    if (!matchesQueryValue(candidate, key.value)) {
      return false;
    }
  }
  return true;
}

function matchesQueryValue(candidate, expected) {
  const parts = String(candidate).split("\\").map((value) => value.trim()).filter(Boolean);
  const values = parts.length > 0 ? parts : [String(candidate).trim()];
  const normalizedExpected = String(expected).trim();
  if (normalizedExpected.includes("*") || normalizedExpected.includes("?")) {
    const pattern = new RegExp(`^${escapeRegex(normalizedExpected).replace(/\\\*/g, ".*").replace(/\\\?/g, ".")}$`, "i");
    return values.some((value) => pattern.test(value));
  }
  return values.some((value) => value.localeCompare(normalizedExpected, undefined, { sensitivity: "accent" }) === 0);
}

function buildFindResponseDataset(dicom, sourceDataset, requestDataset, level) {
  const response = new dicom.DicomDataset();
  response.addOrUpdateValue(dicom.DicomTags.QueryRetrieveLevel, levelToString(dicom, level));

  for (const key of extractQueryKeys(dicom, requestDataset)) {
    copyItemIfPresent(response, sourceDataset, key.tag);
  }

  if (level === dicom.DicomQueryRetrieveLevel.Patient) {
    copyItemIfPresent(response, sourceDataset, dicom.DicomTags.PatientID);
    copyItemIfPresent(response, sourceDataset, dicom.DicomTags.PatientName);
  } else if (level === dicom.DicomQueryRetrieveLevel.Study) {
    copyItemIfPresent(response, sourceDataset, dicom.DicomTags.StudyInstanceUID);
  } else if (level === dicom.DicomQueryRetrieveLevel.Series) {
    copyItemIfPresent(response, sourceDataset, dicom.DicomTags.StudyInstanceUID);
    copyItemIfPresent(response, sourceDataset, dicom.DicomTags.SeriesInstanceUID);
  } else {
    copyItemIfPresent(response, sourceDataset, dicom.DicomTags.StudyInstanceUID);
    copyItemIfPresent(response, sourceDataset, dicom.DicomTags.SeriesInstanceUID);
    copyItemIfPresent(response, sourceDataset, dicom.DicomTags.SOPInstanceUID);
    copyItemIfPresent(response, sourceDataset, dicom.DicomTags.SOPClassUID);
  }

  return response;
}

function copyItemIfPresent(targetDataset, sourceDataset, tag) {
  const item = sourceDataset.getDicomItem(tag);
  if (item) {
    targetDataset.addOrUpdate(item);
  }
}

function groupKeyForLevel(dicom, dataset, level, fallback) {
  if (level === dicom.DicomQueryRetrieveLevel.Patient) {
    return dataset.tryGetString(dicom.DicomTags.PatientID)
      ?? dataset.tryGetString(dicom.DicomTags.PatientName)
      ?? fallback;
  }
  if (level === dicom.DicomQueryRetrieveLevel.Study) {
    return dataset.tryGetString(dicom.DicomTags.StudyInstanceUID) ?? fallback;
  }
  if (level === dicom.DicomQueryRetrieveLevel.Series) {
    return [
      dataset.tryGetString(dicom.DicomTags.StudyInstanceUID) ?? "",
      dataset.tryGetString(dicom.DicomTags.SeriesInstanceUID) ?? "",
    ].join("::") || fallback;
  }
  return [
    dataset.tryGetString(dicom.DicomTags.StudyInstanceUID) ?? "",
    dataset.tryGetString(dicom.DicomTags.SeriesInstanceUID) ?? "",
    dataset.tryGetString(dicom.DicomTags.SOPInstanceUID) ?? "",
  ].join("::") || fallback;
}

function buildFinalRetrieveResponse(dicom, operation, request, remaining, completed, warnings, failures) {
  const response = operation === "move"
    ? new dicom.DicomCMoveResponse(request, dicom.DicomStatus.Success.code)
    : new dicom.DicomCGetResponse(request, dicom.DicomStatus.Success.code);

  response.remaining = remaining;
  response.completed = completed;
  response.warnings = warnings;
  response.failures = failures;

  if (failures > 0 || warnings > 0) {
    response.status = failures === completed + warnings + failures
      ? dicom.DicomStatus.QueryRetrieveUnableToPerformSuboperations.code
      : dicom.DicomStatus.QueryRetrieveSubOpsOneOrMoreFailures.code;
  }

  return response;
}

async function sendStoreSubOperation(service, dicom, request) {
  return await new Promise((resolve, reject) => {
    let settled = false;
    request.onResponseReceived = (_rq, rsp) => {
      if (settled) {
        return;
      }
      settled = true;
      resolve(rsp);
    };

    void service.sendRequest(request).catch((error) => {
      if (settled) {
        return;
      }
      settled = true;
      reject(error instanceof Error ? error : new Error(String(error)));
    });
  });
}

function escapeRegex(value) {
  return value.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}

function parseArgs(argv) {
  const result = {
    host: "0.0.0.0",
    port: 104,
    aeTitle: "DICOMTS_QR_SCP",
    allowCallingAesRaw: null,
    archiveDir: "./archive",
    moveDestinationsRaw: [],
    timeoutMs: 30_000,
    help: false,
    error: null,
  };

  try {
    for (let i = 0; i < argv.length; i++) {
      const arg = argv[i];
      if (arg === "-h" || arg === "--help") {
        result.help = true;
        continue;
      }
      if (arg === "--host") {
        const value = argv[i + 1] ?? "";
        if (!value || value.startsWith("-")) {
          result.error = "Option --host requires a value.";
        } else {
          result.host = value;
          i++;
        }
        continue;
      }
      if (arg === "--port") {
        const value = Number(argv[i + 1] ?? "");
        if (!Number.isInteger(value) || value < 1 || value > 65535) {
          result.error = "Option --port requires an integer between 1 and 65535.";
        } else {
          result.port = value;
          i++;
        }
        continue;
      }
      if (arg === "--ae") {
        const value = argv[i + 1] ?? "";
        if (!value || value.startsWith("-")) {
          result.error = "Option --ae requires a value.";
        } else {
          result.aeTitle = value;
          i++;
        }
        continue;
      }
      if (arg === "--allow-calling-ae") {
        const value = argv[i + 1] ?? "";
        if (!value || value.startsWith("-")) {
          result.error = "Option --allow-calling-ae requires a comma-separated value.";
        } else {
          result.allowCallingAesRaw = value;
          i++;
        }
        continue;
      }
      if (arg === "--archive-dir") {
        const value = argv[i + 1] ?? "";
        if (!value || value.startsWith("-")) {
          result.error = "Option --archive-dir requires a path.";
        } else {
          result.archiveDir = value;
          i++;
        }
        continue;
      }
      if (arg === "--move-destination") {
        const value = argv[i + 1] ?? "";
        if (!value || value.startsWith("-")) {
          result.error = "Option --move-destination requires AE=host:port.";
        } else {
          result.moveDestinationsRaw.push(value);
          i++;
        }
        continue;
      }
      if (arg === "--timeout") {
        const value = Number(argv[i + 1] ?? "");
        if (!Number.isInteger(value) || value <= 0) {
          result.error = "Option --timeout requires an integer greater than 0 (milliseconds).";
        } else {
          result.timeoutMs = value;
          i++;
        }
        continue;
      }
      if (arg.startsWith("-")) {
        result.error = `Unknown option: ${arg}`;
      } else {
        result.error = `Unexpected argument: ${arg}`;
      }
    }

    if (!result.error) {
      parseMoveDestinations(result.moveDestinationsRaw);
    }
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
  }

  return result;
}

function printHelp() {
  console.log(`dicom-ts tool: QR SCP

Usage:
  node tools/dicom-qr-scp/index.mjs [options]

Options:
  --host <host>                    Bind host (default: 0.0.0.0)
  --port <port>                    Bind port (default: 104)
  --ae <ae>                        Local called AE title (default: DICOMTS_QR_SCP)
  --allow-calling-ae <list>        Comma-separated allowed calling AEs (default: allow all)
  --archive-dir <dir>              Directory containing DICOM files to query/retrieve (default: ./archive)
  --move-destination <AE=host:port>
                                   Register one C-MOVE destination; repeatable
  --timeout <ms>                   Sub-operation timeout in ms (default: 30000)
  -h, --help                       Show help

Notes:
  - C-FIND is file-backed and scans the archive directory recursively.
  - C-GET returns matching instances over the same association.
  - C-MOVE sends matching instances to configured move destinations.

Example:
  node tools/dicom-qr-scp/index.mjs --port 11112 --ae MY_QR --archive-dir ./archive --move-destination MOVE_SCU=127.0.0.1:11113
`);
}
