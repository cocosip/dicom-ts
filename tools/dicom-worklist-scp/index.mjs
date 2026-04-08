#!/usr/bin/env node

import path from "node:path";
import { promises as fs } from "node:fs";
import {
  listFiles,
  loadDicomTs,
  normalizeAe,
  parseTagSpec,
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

const worklistDir = path.resolve(options.worklistDir);
await fs.mkdir(worklistDir, { recursive: true });

const runtime = {
  expectedCalledAE: normalizeAe(options.aeTitle),
  allowedCallingAEs: allowedCallingAEs ? new Set(allowedCallingAEs.map((ae) => normalizeAe(ae))) : null,
  worklistDir,
  strictCalledAe: options.strictCalledAe,
};

const serviceCtor = createWorklistScpServiceCtor(dicom, runtime);
const server = dicom.DicomServerFactory.create(
  (_socket, association, serviceOptions) => new serviceCtor(association, serviceOptions),
  {
    host: options.host,
    port: options.port,
  },
);

try {
  await server.start();
  console.log(`[worklist-scp] Listening on ${server.host}:${server.port}`);
  console.log(`[worklist-scp] Called AE: ${runtime.expectedCalledAE}`);
  console.log(`[worklist-scp] Worklist dir: ${runtime.worklistDir}`);
  console.log(`[worklist-scp] Strict called AE: ${runtime.strictCalledAe ? "yes" : "no"}`);
  if (runtime.allowedCallingAEs) {
    console.log(`[worklist-scp] Allowed Calling AEs: ${Array.from(runtime.allowedCallingAEs).join(", ")}`);
  } else {
    console.log("[worklist-scp] Allowed Calling AEs: *");
  }
  console.log("[worklist-scp] Press Ctrl+C to stop.");
  await waitForShutdownSignal(server, "worklist-scp");
} catch (error) {
  console.error(`[worklist-scp] Failed to start or run SCP: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}

function createWorklistScpServiceCtor(dicom, runtime) {
  return class WorklistScpService extends dicom.DicomCEchoProvider {
    constructor(association, serviceOptions = {}) {
      super(association, {
        ...serviceOptions,
        autoSendAssociationAccept: false,
      });
    }

    async onReceiveAssociationRequest(association) {
      const calledAE = normalizeAe(association.calledAE);
      const callingAE = normalizeAe(association.callingAE);

      if (runtime.strictCalledAe && calledAE !== runtime.expectedCalledAE) {
        console.error(`[worklist-scp] Reject association: called AE mismatch (expected=${runtime.expectedCalledAE}, got=${calledAE || "-"})`);
        await this.rejectAssociation(dicom.DicomRejectReason.CalledAENotRecognized);
        return;
      }

      if (runtime.allowedCallingAEs && !runtime.allowedCallingAEs.has(callingAE)) {
        console.error(`[worklist-scp] Reject association: calling AE not allowed (got=${callingAE || "-"})`);
        await this.rejectAssociation(dicom.DicomRejectReason.CallingAENotRecognized);
        return;
      }

      acceptPresentationContexts(dicom, association);
      await this.sendPDU(new dicom.AAssociateAC(association));
      console.error(
        `[worklist-scp] Association accepted: calling=${callingAE || "-"} called=${calledAE || "-"} `
        + `from ${association.remoteHost || "-"}:${association.remotePort || 0}`,
      );
    }

    async *onCFindRequest(request) {
      const sopClassUid = request.sopClassUID?.uid ?? "";
      if (sopClassUid !== dicom.DicomUIDs.ModalityWorklistInformationModelFind.uid) {
        console.error(`[worklist-scp] Reject unsupported C-FIND SOP class: ${sopClassUid || "-"}`);
        yield new dicom.DicomCFindResponse(request, dicom.DicomStatus.SOPClassNotSupported.code);
        return;
      }

      const records = await loadWorklistRecords(dicom, runtime.worklistDir);
      const matches = findWorklistMatches(dicom, records, request.dataset);
      console.error(`[worklist-scp] MWL C-FIND matches=${matches.length}`);

      for (const match of matches) {
        const response = new dicom.DicomCFindResponse(request, dicom.DicomStatus.Pending.code);
        response.dataset = buildWorklistResponseDataset(dicom, match.record, match.spsItem, request.dataset);
        yield response;
      }

      yield new dicom.DicomCFindResponse(request, dicom.DicomStatus.Success.code);
    }

    async onReceiveAssociationReleaseRequest() {
      console.error("[worklist-scp] Association release requested.");
    }

    onReceiveAbort(source, reason) {
      console.error(`[worklist-scp] Association aborted: source=${String(source)} reason=${String(reason)}`);
    }

    onConnectionClosed(error) {
      if (error) {
        console.error(`[worklist-scp] Connection closed with error: ${error.message}`);
      } else {
        console.error("[worklist-scp] Connection closed.");
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

async function loadWorklistRecords(dicom, worklistDir) {
  const filePaths = await listFiles(worklistDir, true);
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
        `[worklist-scp] Skip unreadable worklist file: ${absolutePath} `
        + `(${error instanceof Error ? error.message : String(error)})`,
      );
    }
  }
  return records;
}

function findWorklistMatches(dicom, records, queryDataset) {
  const rootKeys = extractFlatKeys(dicom, queryDataset, new Set([dicom.DicomTags.ScheduledProcedureStepSequence.toUint32()]));
  const spsKeys = extractSequenceKeys(dicom, queryDataset, dicom.DicomTags.ScheduledProcedureStepSequence);
  const matches = [];

  for (const record of records) {
    if (!matchesAllKeys(record.dataset, rootKeys)) {
      continue;
    }

    const sequence = record.dataset.tryGetSequence(dicom.DicomTags.ScheduledProcedureStepSequence);
    const items = sequence?.items ?? [];
    if (items.length === 0) {
      continue;
    }

    for (const spsItem of items) {
      if (matchesAllKeys(spsItem, spsKeys)) {
        matches.push({ record, spsItem });
      }
    }
  }

  return matches;
}

function buildWorklistResponseDataset(dicom, record, spsItem, queryDataset) {
  const response = new dicom.DicomDataset();
  const rootKeys = extractFlatKeys(dicom, queryDataset, new Set([dicom.DicomTags.ScheduledProcedureStepSequence.toUint32()]));
  const spsKeys = extractSequenceKeys(dicom, queryDataset, dicom.DicomTags.ScheduledProcedureStepSequence);

  const rootTags = rootKeys.length > 0
    ? rootKeys.map((key) => key.tag)
    : getDefaultWorklistRootTags(dicom);
  const spsTags = spsKeys.length > 0
    ? spsKeys.map((key) => key.tag)
    : getDefaultWorklistSpsTags(dicom);

  for (const tag of rootTags) {
    copyItemIfPresent(response, record.dataset, tag);
  }

  const spsResponseItem = new dicom.DicomDataset();
  for (const tag of spsTags) {
    copyItemIfPresent(spsResponseItem, spsItem, tag);
  }
  response.addOrUpdate(new dicom.DicomSequence(dicom.DicomTags.ScheduledProcedureStepSequence, spsResponseItem));

  return response;
}

function extractFlatKeys(dicom, dataset, excludedTagIds = new Set()) {
  if (!dataset) {
    return [];
  }

  const keys = [];
  for (const item of dataset) {
    if (excludedTagIds.has(item.tag.toUint32())) {
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

function extractSequenceKeys(dicom, dataset, sequenceTag) {
  if (!dataset) {
    return [];
  }
  const sequence = dataset.tryGetSequence(sequenceTag);
  if (!sequence || sequence.items.length === 0) {
    return [];
  }
  return extractFlatKeys(dicom, sequence.items[0]);
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

function escapeRegex(value) {
  return value.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}

function copyItemIfPresent(targetDataset, sourceDataset, tag) {
  const item = sourceDataset.getDicomItem(tag);
  if (item) {
    targetDataset.addOrUpdate(item);
  }
}

function getDefaultWorklistRootTags(dicom) {
  return [
    dicom.DicomTags.PatientID,
    dicom.DicomTags.PatientName,
    dicom.DicomTags.PatientBirthDate,
    dicom.DicomTags.PatientSex,
    dicom.DicomTags.AccessionNumber,
    dicom.DicomTags.RequestedProcedureID,
    dicom.DicomTags.RequestedProcedureDescription,
    dicom.DicomTags.StudyInstanceUID,
  ];
}

function getDefaultWorklistSpsTags(dicom) {
  return [
    dicom.DicomTags.ScheduledStationAETitle,
    dicom.DicomTags.ScheduledProcedureStepStartDate,
    dicom.DicomTags.ScheduledProcedureStepStartTime,
    dicom.DicomTags.Modality,
    dicom.DicomTags.ScheduledPerformingPhysicianName,
    dicom.DicomTags.ScheduledProcedureStepDescription,
    dicom.DicomTags.ScheduledProcedureStepID,
  ];
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

function parseArgs(argv) {
  const result = {
    host: "0.0.0.0",
    port: 104,
    aeTitle: "DICOMTS_WL_SCP",
    allowCallingAesRaw: null,
    worklistDir: "./worklist",
    strictCalledAe: true,
    help: false,
    error: null,
  };

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
    if (arg === "--worklist-dir") {
      const value = argv[i + 1] ?? "";
      if (!value || value.startsWith("-")) {
        result.error = "Option --worklist-dir requires a path.";
      } else {
        result.worklistDir = value;
        i++;
      }
      continue;
    }
    if (arg === "--no-strict-called-ae") {
      result.strictCalledAe = false;
      continue;
    }
    if (arg.startsWith("-")) {
      result.error = `Unknown option: ${arg}`;
    } else {
      result.error = `Unexpected argument: ${arg}`;
    }
  }

  return result;
}

function printHelp() {
  console.log(`dicom-ts tool: Worklist SCP

Usage:
  node tools/dicom-worklist-scp/index.mjs [options]

Options:
  --host <host>                 Bind host (default: 0.0.0.0)
  --port <port>                 Bind port (default: 104)
  --ae <ae>                     Local called AE title (default: DICOMTS_WL_SCP)
  --allow-calling-ae <list>     Comma-separated allowed calling AEs (default: allow all)
  --worklist-dir <dir>          Directory containing DICOM worklist records (default: ./worklist)
  --no-strict-called-ae         Do not reject associations with a different called AE
  -h, --help                    Show help

Notes:
  - The SCP serves Modality Worklist Information Model - FIND.
  - The worklist source is file-backed and scans the directory recursively on each query.
  - Each worklist file should contain a Scheduled Procedure Step Sequence item.

Example:
  node tools/dicom-worklist-scp/index.mjs --port 11112 --ae MY_WL --worklist-dir ./worklist
`);
}
