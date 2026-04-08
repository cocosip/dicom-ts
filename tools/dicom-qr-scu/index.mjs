#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import {
  allocateOutputPath,
  applyValidationMode,
  formatDicomStatus,
  levelToString,
  loadDicomTs,
  normalizeAe,
  parseKeyValueSpec,
  parseQueryRetrieveLevel,
  parseTagSpec,
  validateAeTitle,
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

if (!validateAeTitle(dicom, options.callingAE, "--calling-ae")) {
  process.exit(1);
}
if (!validateAeTitle(dicom, options.calledAE, "--called-ae")) {
  process.exit(1);
}
if (options.moveDestinationAe && !validateAeTitle(dicom, options.moveDestinationAe, "--move-destination-ae")) {
  process.exit(1);
}

applyValidationMode(dicom, options.validation);

const level = parseQueryRetrieveLevel(dicom, options.levelRaw);
const keySpecs = options.keySpecsRaw.map((spec) => parseKeyValueSpec(dicom, spec));
const returnTags = resolveReturnTags(dicom, options.returnSpecsRaw, level);
const queryDataset = buildQueryDataset(dicom, keySpecs, returnTags, level);

if (options.operation === "get") {
  const studyUid = getRequiredStudyInstanceUid(dicom, queryDataset);
  const receiveDir = path.resolve(options.receiveDir);
  await fs.mkdir(receiveDir, { recursive: true });

  const sopClasses = await discoverRetrieveSopClasses(dicom, options, keySpecs);
  const extraAccepted = options.acceptStorageRaw.map((spec) => resolveUidSpec(dicom, spec));
  const acceptedSopClasses = dedupeUids([
    ...sopClasses,
    ...extraAccepted,
    ...getDefaultAcceptedStorageSopClasses(dicom),
  ]);

  await runGet(dicom, options, {
    level,
    queryDataset,
    studyUid,
    seriesUid: queryDataset.tryGetString(dicom.DicomTags.SeriesInstanceUID) ?? null,
    sopInstanceUid: queryDataset.tryGetString(dicom.DicomTags.SOPInstanceUID) ?? null,
    receiveDir,
    acceptedSopClasses,
  });
} else if (options.operation === "move") {
  const studyUid = getRequiredStudyInstanceUid(dicom, queryDataset);
  await runMove(dicom, options, {
    level,
    queryDataset,
    studyUid,
    seriesUid: queryDataset.tryGetString(dicom.DicomTags.SeriesInstanceUID) ?? null,
    sopInstanceUid: queryDataset.tryGetString(dicom.DicomTags.SOPInstanceUID) ?? null,
  });
} else {
  await runFind(dicom, options, {
    level,
    queryDataset,
  });
}

async function runFind(dicom, options, context) {
  const request = new dicom.DicomCFindRequest(context.level);
  request.dataset = context.queryDataset;

  const results = [];
  const statuses = [];
  request.onResponseReceived = (_rq, rsp) => {
    statuses.push(rsp.status);
    if (rsp.status === dicom.DicomStatus.Pending.code && rsp.dataset) {
      results.push(rsp.dataset);
    }
  };

  const client = new dicom.DicomClient({
    requestTimeoutMs: options.timeoutMs,
  });
  client.addRequest(request);

  console.error(
    `[qr-scu] C-FIND level=${levelToString(dicom, context.level)} `
    + `to ${options.host}:${options.port} (calling=${options.callingAE}, called=${options.calledAE})`,
  );
  await client.sendAsync(options.host, options.port, options.callingAE, options.calledAE);

  emitFindReport(dicom, results);

  const failed = statuses.some((status) => {
    const state = dicom.DicomStatus.lookup(status).state;
    return state === dicom.DicomState.Failure || state === dicom.DicomState.Cancel;
  });
  if (failed) {
    process.exitCode = 2;
  }
}

async function runGet(dicom, options, context) {
  const connection = await dicom.AdvancedDicomClientConnection.open({
    host: options.host,
    port: options.port,
    callingAE: options.callingAE,
    calledAE: options.calledAE,
    clientOptions: {
      requestTimeoutMs: options.timeoutMs,
    },
  });

  const savedFiles = [];
  const cGetStatuses = [];

  try {
    for (const sopClass of context.acceptedSopClasses) {
      connection.association.presentationContexts.addPresentationContext(
        sopClass,
        getPreferredTransferSyntaxes(dicom),
        false,
        true,
      );
    }

    connection.connection.cStoreRequestHandler = async (request) => {
      if (!request.dataset) {
        return new dicom.DicomCStoreResponse(request, dicom.DicomStatus.StorageCannotUnderstand.code);
      }

      const file = new dicom.DicomFile(request.dataset);
      const sopInstanceUid = request.sopInstanceUID?.uid
        ?? request.dataset.tryGetString(dicom.DicomTags.SOPInstanceUID)
        ?? "";
      const outputPath = await allocateOutputPath(context.receiveDir, sopInstanceUid || `cget-${Date.now()}`);
      await file.save(outputPath);
      savedFiles.push(outputPath);
      console.error(`[qr-scu] C-GET received: ${outputPath}`);
      return new dicom.DicomCStoreResponse(request, dicom.DicomStatus.Success.code);
    };

    const request = new dicom.DicomCGetRequest(
      context.studyUid,
      context.seriesUid ?? undefined,
      context.sopInstanceUid ?? undefined,
    );
    request.dataset = context.queryDataset;
    request.level = context.level;
    request.onResponseReceived = (_rq, rsp) => {
      cGetStatuses.push({
        status: rsp.status,
        remaining: rsp.remaining,
        completed: rsp.completed,
        warnings: rsp.warnings,
        failures: rsp.failures,
      });
      console.error(
        `[qr-scu] C-GET response: status=${formatDicomStatus(dicom, rsp.status)} `
        + `remaining=${rsp.remaining} completed=${rsp.completed} warnings=${rsp.warnings} failures=${rsp.failures}`,
      );
    };

    connection.connection.prepareRequest(request);
    await connection.requestAssociation(options.timeoutMs);
    await connection.sendRequest(request, options.timeoutMs);
    await connection.releaseAssociation(options.timeoutMs);
  } finally {
    await connection.close();
  }

  emitRetrieveReport(dicom, "C-GET", savedFiles, cGetStatuses);
  if (cGetStatuses.some((status) => isFailedRetrieveState(dicom, status.status))) {
    process.exitCode = 2;
  }
}

async function runMove(dicom, options, context) {
  if (!options.moveDestinationAe) {
    throw new Error("C-MOVE requires --move-destination-ae.");
  }

  let receiverServer = null;
  let savedFiles = [];
  const receiveDir = path.resolve(options.receiveDir);

  if (options.moveListenPort !== null) {
    await fs.mkdir(receiveDir, { recursive: true });
    const serviceCtor = createMoveReceiverServiceCtor(dicom, {
      expectedCalledAE: normalizeAe(options.moveDestinationAe),
      outputDir: receiveDir,
      savedFiles,
    });
    receiverServer = dicom.DicomServerFactory.create(
      (_socket, association, serviceOptions) => new serviceCtor(association, serviceOptions),
      {
        host: options.moveListenHost,
        port: options.moveListenPort,
      },
    );
    await receiverServer.start();
    console.error(`[qr-scu] Local move receiver listening on ${receiverServer.host}:${receiverServer.port}`);
  }

  const statuses = [];
  try {
    const request = new dicom.DicomCMoveRequest(
      options.moveDestinationAe,
      context.studyUid,
      context.seriesUid ?? undefined,
      context.sopInstanceUid ?? undefined,
    );
    request.dataset = context.queryDataset;
    request.level = context.level;
    request.onResponseReceived = (_rq, rsp) => {
      statuses.push({
        status: rsp.status,
        remaining: rsp.remaining,
        completed: rsp.completed,
        warnings: rsp.warnings,
        failures: rsp.failures,
      });
      console.error(
        `[qr-scu] C-MOVE response: status=${formatDicomStatus(dicom, rsp.status)} `
        + `remaining=${rsp.remaining} completed=${rsp.completed} warnings=${rsp.warnings} failures=${rsp.failures}`,
      );
    };

    const client = new dicom.DicomClient({
      requestTimeoutMs: options.timeoutMs,
    });
    client.addRequest(request);
    await client.sendAsync(options.host, options.port, options.callingAE, options.calledAE);
  } finally {
    if (receiverServer) {
      await receiverServer.stop();
    }
  }

  emitRetrieveReport(dicom, "C-MOVE", savedFiles, statuses);
  if (statuses.some((status) => isFailedRetrieveState(dicom, status.status))) {
    process.exitCode = 2;
  }
}

async function discoverRetrieveSopClasses(dicom, options, keySpecs) {
  const request = new dicom.DicomCFindRequest(dicom.DicomQueryRetrieveLevel.Image);
  request.dataset = buildQueryDataset(
    dicom,
    keySpecs,
    [dicom.DicomTags.SOPClassUID, dicom.DicomTags.SOPInstanceUID],
    dicom.DicomQueryRetrieveLevel.Image,
  );

  const discovered = new Set();
  request.onResponseReceived = (_rq, rsp) => {
    if (rsp.status !== dicom.DicomStatus.Pending.code || !rsp.dataset) {
      return;
    }
    const sopClassUid = rsp.dataset.tryGetString(dicom.DicomTags.SOPClassUID);
    if (sopClassUid) {
      discovered.add(sopClassUid);
    }
  };

  const client = new dicom.DicomClient({
    requestTimeoutMs: options.timeoutMs,
  });
  client.addRequest(request);
  await client.sendAsync(options.host, options.port, options.callingAE, options.calledAE);

  return Array.from(discovered.values()).map((uid) => dicom.DicomUID.parse(uid, "Retrieved SOP Class", dicom.DicomUidType.SOPClass));
}

function buildQueryDataset(dicom, keySpecs, returnTags, level) {
  const dataset = new dicom.DicomDataset();
  dataset.addOrUpdateValue(dicom.DicomTags.QueryRetrieveLevel, levelToString(dicom, level));

  for (const key of keySpecs) {
    dataset.addOrUpdateValue(key.tag, key.value);
  }

  for (const tag of returnTags) {
    if (!dataset.contains(tag)) {
      dataset.addOrUpdateValue(tag, "");
    }
  }

  return dataset;
}

function resolveReturnTags(dicom, specs, level) {
  if (specs.length > 0) {
    return specs.map((spec) => parseTagSpec(dicom, spec));
  }

  if (level === dicom.DicomQueryRetrieveLevel.Patient) {
    return [dicom.DicomTags.PatientID, dicom.DicomTags.PatientName];
  }
  if (level === dicom.DicomQueryRetrieveLevel.Study) {
    return [
      dicom.DicomTags.PatientID,
      dicom.DicomTags.PatientName,
      dicom.DicomTags.StudyInstanceUID,
      dicom.DicomTags.StudyDate,
      dicom.DicomTags.StudyDescription,
    ];
  }
  if (level === dicom.DicomQueryRetrieveLevel.Series) {
    return [
      dicom.DicomTags.StudyInstanceUID,
      dicom.DicomTags.SeriesInstanceUID,
      dicom.DicomTags.Modality,
      dicom.DicomTags.SeriesDescription,
    ];
  }
  return [
    dicom.DicomTags.StudyInstanceUID,
    dicom.DicomTags.SeriesInstanceUID,
    dicom.DicomTags.SOPInstanceUID,
    dicom.DicomTags.SOPClassUID,
  ];
}

function resolveUidSpec(dicom, spec) {
  if (spec.includes(".")) {
    return dicom.DicomUID.parse(spec, "Configured SOP Class", dicom.DicomUidType.SOPClass);
  }
  const exported = dicom.DicomUIDs?.[spec];
  if (!exported) {
    throw new Error(`Unknown SOP class keyword: ${spec}`);
  }
  return exported;
}

function getDefaultAcceptedStorageSopClasses(dicom) {
  return [
    dicom.DicomUIDs.CTImageStorage,
    dicom.DicomUIDs.EnhancedCTImageStorage,
    dicom.DicomUIDs.MRImageStorage,
    dicom.DicomUIDs.EnhancedMRImageStorage,
    dicom.DicomUIDs.SecondaryCaptureImageStorage,
    dicom.DicomUIDs.ComputedRadiographyImageStorage,
    dicom.DicomUIDs.DigitalXRayImageStorageForPresentation,
    dicom.DicomUIDs.DigitalXRayImageStorageForProcessing,
    dicom.DicomUIDs.UltrasoundImageStorage,
    dicom.DicomUIDs.UltrasoundMultiFrameImageStorage,
    dicom.DicomUIDs.PositronEmissionTomographyImageStorage,
    dicom.DicomUIDs.EncapsulatedPDFStorage,
  ].filter(Boolean);
}

function getPreferredTransferSyntaxes(dicom) {
  return [
    dicom.DicomTransferSyntax.ExplicitVRLittleEndian,
    dicom.DicomTransferSyntax.ImplicitVRLittleEndian,
    dicom.DicomTransferSyntax.JPEGProcess1,
    dicom.DicomTransferSyntax.JPEGProcess2_4,
    dicom.DicomTransferSyntax.JPEGProcess14,
    dicom.DicomTransferSyntax.JPEGProcess14SV1,
    dicom.DicomTransferSyntax.JPEGLSLossless,
    dicom.DicomTransferSyntax.JPEGLSNearLossless,
    dicom.DicomTransferSyntax.JPEG2000Lossless,
    dicom.DicomTransferSyntax.JPEG2000Lossy,
  ].filter(Boolean);
}

function getRequiredStudyInstanceUid(dicom, dataset) {
  const studyUid = dataset.tryGetString(dicom.DicomTags.StudyInstanceUID) ?? "";
  if (!studyUid) {
    throw new Error("Study-level retrieve requires --key StudyInstanceUID=<uid>.");
  }
  return studyUid;
}

function dedupeUids(values) {
  const seen = new Set();
  const deduped = [];
  for (const value of values) {
    if (!value || seen.has(value.uid)) {
      continue;
    }
    seen.add(value.uid);
    deduped.push(value);
  }
  return deduped;
}

function emitFindReport(dicom, datasets) {
  const lines = [];
  lines.push("# QR SCU C-FIND Result");
  lines.push("");
  lines.push(`- Matches: ${datasets.length}`);
  lines.push("");

  datasets.forEach((dataset, index) => {
    lines.push(`## Match ${index + 1}`);
    for (const item of dataset) {
      const entry = dicom.DicomDictionary.default.lookup(item.tag);
      const keyword = entry.keyword || item.tag.toString();
      const value = dataset.tryGetString(item.tag);
      if (value !== undefined) {
        lines.push(`- ${keyword}: ${value}`);
      }
    }
    lines.push("");
  });

  process.stdout.write(`${lines.join("\n")}\n`);
}

function emitRetrieveReport(dicom, label, savedFiles, statuses) {
  const lines = [];
  lines.push(`# QR SCU ${label} Result`);
  lines.push("");
  lines.push(`- Responses: ${statuses.length}`);
  lines.push(`- Saved files: ${savedFiles.length}`);
  for (const savedFile of savedFiles) {
    lines.push(`- File: ${savedFile}`);
  }
  if (statuses.length > 0) {
    const last = statuses[statuses.length - 1];
    lines.push(`- Final status: ${formatDicomStatus(dicom, last.status)} remaining=${last.remaining} completed=${last.completed} warnings=${last.warnings} failures=${last.failures}`);
  }
  lines.push("");
  process.stdout.write(`${lines.join("\n")}\n`);
}

function isFailedRetrieveState(dicom, statusCode) {
  const state = dicom.DicomStatus.lookup(statusCode).state;
  return state === dicom.DicomState.Failure || state === dicom.DicomState.Cancel;
}

function createMoveReceiverServiceCtor(dicom, runtime) {
  return class MoveReceiverService extends dicom.DicomCEchoProvider {
    constructor(association, serviceOptions = {}) {
      super(association, {
        ...serviceOptions,
        autoSendAssociationAccept: false,
      });
    }

    async onReceiveAssociationRequest(association) {
      const calledAE = normalizeAe(association.calledAE);
      if (calledAE !== runtime.expectedCalledAE) {
        await this.sendPDU(new dicom.AAssociateRJ(
          dicom.DicomRejectResult.Permanent,
          dicom.DicomRejectSource.ServiceUser,
          dicom.DicomRejectReason.CalledAENotRecognized,
        ));
        this.disconnect();
        return;
      }

      for (const context of association.presentationContexts) {
        if (context.result !== dicom.DicomPresentationContextResult.Proposed) {
          continue;
        }
        const syntax = context.getTransferSyntaxes()[0] ?? dicom.DicomTransferSyntax.ImplicitVRLittleEndian;
        context.setResult(dicom.DicomPresentationContextResult.Accept, syntax);
      }

      await this.sendPDU(new dicom.AAssociateAC(association));
    }

    async onCStoreRequest(request) {
      if (!request.dataset) {
        return new dicom.DicomCStoreResponse(request, dicom.DicomStatus.StorageCannotUnderstand.code);
      }

      const file = new dicom.DicomFile(request.dataset);
      const sopInstanceUid = request.sopInstanceUID?.uid
        ?? request.dataset.tryGetString(dicom.DicomTags.SOPInstanceUID)
        ?? "";
      const outputPath = await allocateOutputPath(runtime.outputDir, sopInstanceUid || `cmove-${Date.now()}`);
      await file.save(outputPath);
      runtime.savedFiles.push(outputPath);
      console.error(`[qr-scu] C-MOVE received: ${outputPath}`);
      return new dicom.DicomCStoreResponse(request, dicom.DicomStatus.Success.code);
    }

    async onCStoreRequestException(_tempFileName, error) {
      console.error(`[qr-scu] Move receiver store exception: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
}

function parseArgs(argv) {
  const result = {
    operation: "find",
    host: "127.0.0.1",
    port: 104,
    callingAE: "DICOMTS_QR_SCU",
    calledAE: "DICOMTS_QR_SCP",
    levelRaw: "study",
    keySpecsRaw: [],
    returnSpecsRaw: [],
    acceptStorageRaw: [],
    moveDestinationAe: "",
    moveListenHost: "0.0.0.0",
    moveListenPort: null,
    receiveDir: "./received",
    timeoutMs: 30_000,
    validation: "warning",
    help: false,
    error: null,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") {
      result.help = true;
      continue;
    }
    if (arg === "--operation") {
      const value = String(argv[i + 1] ?? "").toLowerCase();
      if (value !== "find" && value !== "get" && value !== "move") {
        result.error = "Option --operation must be one of: find, get, move.";
      } else {
        result.operation = value;
        i++;
      }
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
    if (arg === "--calling-ae") {
      const value = argv[i + 1] ?? "";
      if (!value || value.startsWith("-")) {
        result.error = "Option --calling-ae requires a value.";
      } else {
        result.callingAE = value;
        i++;
      }
      continue;
    }
    if (arg === "--called-ae") {
      const value = argv[i + 1] ?? "";
      if (!value || value.startsWith("-")) {
        result.error = "Option --called-ae requires a value.";
      } else {
        result.calledAE = value;
        i++;
      }
      continue;
    }
    if (arg === "--level") {
      const value = argv[i + 1] ?? "";
      if (!value || value.startsWith("-")) {
        result.error = "Option --level requires a value.";
      } else {
        result.levelRaw = value;
        i++;
      }
      continue;
    }
    if (arg === "--key") {
      const value = argv[i + 1] ?? "";
      if (!value || value.startsWith("-")) {
        result.error = "Option --key requires Keyword=value.";
      } else {
        result.keySpecsRaw.push(value);
        i++;
      }
      continue;
    }
    if (arg === "--return") {
      const value = argv[i + 1] ?? "";
      if (!value || value.startsWith("-")) {
        result.error = "Option --return requires a DICOM keyword or tag.";
      } else {
        result.returnSpecsRaw.push(value);
        i++;
      }
      continue;
    }
    if (arg === "--accept-storage") {
      const value = argv[i + 1] ?? "";
      if (!value || value.startsWith("-")) {
        result.error = "Option --accept-storage requires a UID or DicomUIDs keyword.";
      } else {
        result.acceptStorageRaw.push(value);
        i++;
      }
      continue;
    }
    if (arg === "--move-destination-ae") {
      const value = argv[i + 1] ?? "";
      if (!value || value.startsWith("-")) {
        result.error = "Option --move-destination-ae requires a value.";
      } else {
        result.moveDestinationAe = value;
        i++;
      }
      continue;
    }
    if (arg === "--move-listen-host") {
      const value = argv[i + 1] ?? "";
      if (!value || value.startsWith("-")) {
        result.error = "Option --move-listen-host requires a value.";
      } else {
        result.moveListenHost = value;
        i++;
      }
      continue;
    }
    if (arg === "--move-listen-port") {
      const value = Number(argv[i + 1] ?? "");
      if (!Number.isInteger(value) || value < 1 || value > 65535) {
        result.error = "Option --move-listen-port requires an integer between 1 and 65535.";
      } else {
        result.moveListenPort = value;
        i++;
      }
      continue;
    }
    if (arg === "--receive-dir") {
      const value = argv[i + 1] ?? "";
      if (!value || value.startsWith("-")) {
        result.error = "Option --receive-dir requires a path.";
      } else {
        result.receiveDir = value;
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
    if (arg === "--validation") {
      const value = String(argv[i + 1] ?? "").toLowerCase();
      if (value !== "error" && value !== "warning" && value !== "ignore") {
        result.error = "Option --validation must be one of: error, warning, ignore.";
      } else {
        result.validation = value;
        i++;
      }
      continue;
    }
    result.error = `Unknown option: ${arg}`;
  }

  return result;
}

function printHelp() {
  console.log(`dicom-ts tool: QR SCU

Usage:
  node tools/dicom-qr-scu/index.mjs [options]

Options:
  --operation <find|get|move>       Operation mode (default: find)
  --host <host>                     Remote QR SCP host (default: 127.0.0.1)
  --port <port>                     Remote QR SCP port (default: 104)
  --calling-ae <ae>                 Calling AE title (default: DICOMTS_QR_SCU)
  --called-ae <ae>                  Called AE title (default: DICOMTS_QR_SCP)
  --level <patient|study|series|image>
                                     Query/Retrieve level (default: study)
  --key <Keyword=value>             Matching key; repeatable
  --return <Keyword|tag>            Requested return key for C-FIND; repeatable
  --accept-storage <uid|keyword>    Additional accepted SOP classes for C-GET receive; repeatable
  --move-destination-ae <ae>        Move destination AE for C-MOVE
  --move-listen-host <host>         Local C-STORE receiver bind host for C-MOVE (default: 0.0.0.0)
  --move-listen-port <port>         Start a local C-STORE receiver for C-MOVE
  --receive-dir <dir>               Output directory for received instances (default: ./received)
  --timeout <ms>                    DIMSE timeout in ms (default: 30000)
  --validation <mode>               Validation mode: error|warning|ignore (default: warning)
  -h, --help                        Show help

Notes:
  - C-GET requires StudyInstanceUID and saves received instances into --receive-dir.
  - C-MOVE requires --move-destination-ae. If --move-listen-port is provided, the tool also runs a local C-STORE SCP.
  - For C-GET, the tool performs an internal image-level C-FIND to discover SOP classes before retrieve.

Examples:
  node tools/dicom-qr-scu/index.mjs --operation find --level study --key PatientName=DOE*
  node tools/dicom-qr-scu/index.mjs --operation get --level study --key StudyInstanceUID=1.2.3 --receive-dir ./received
  node tools/dicom-qr-scu/index.mjs --operation move --level study --key StudyInstanceUID=1.2.3 --move-destination-ae MOVE_SCU --move-listen-port 11113
`);
}
