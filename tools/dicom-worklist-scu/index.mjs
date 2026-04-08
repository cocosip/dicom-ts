#!/usr/bin/env node

import {
  applyValidationMode,
  formatDicomStatus,
  loadDicomTs,
  parseKeyValueSpec,
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

applyValidationMode(dicom, options.validation);

const rootKeys = options.keySpecsRaw.map((spec) => parseKeyValueSpec(dicom, spec));
const spsKeys = options.spsKeySpecsRaw.map((spec) => parseKeyValueSpec(dicom, spec));
const returnTags = resolveReturnTags(dicom, options.returnSpecsRaw);
const spsReturnTags = resolveSpsReturnTags(dicom, options.spsReturnSpecsRaw);
const requestDataset = buildWorklistQueryDataset(dicom, rootKeys, spsKeys, returnTags, spsReturnTags);

const request = new dicom.DicomCFindRequest(dicom.DicomUIDs.ModalityWorklistInformationModelFind);
request.dataset = requestDataset;

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
  `[worklist-scu] MWL C-FIND to ${options.host}:${options.port} `
  + `(calling=${options.callingAE}, called=${options.calledAE})`,
);

await client.sendAsync(options.host, options.port, options.callingAE, options.calledAE);

emitWorklistReport(dicom, results);
emitStatusSummary(dicom, statuses);

const failed = statuses.some((status) => {
  const state = dicom.DicomStatus.lookup(status).state;
  return state === dicom.DicomState.Failure || state === dicom.DicomState.Cancel;
});
if (failed) {
  process.exitCode = 2;
}

function buildWorklistQueryDataset(dicom, rootKeys, spsKeys, returnTags, spsReturnTags) {
  const dataset = new dicom.DicomDataset();

  for (const key of rootKeys) {
    dataset.addOrUpdateValue(key.tag, key.value);
  }

  for (const tag of returnTags) {
    if (!dataset.contains(tag)) {
      dataset.addOrUpdateValue(tag, "");
    }
  }

  const spsItem = new dicom.DicomDataset();
  for (const key of spsKeys) {
    spsItem.addOrUpdateValue(key.tag, key.value);
  }
  for (const tag of spsReturnTags) {
    if (!spsItem.contains(tag)) {
      spsItem.addOrUpdateValue(tag, "");
    }
  }

  if (spsItem.count > 0) {
    dataset.addOrUpdate(new dicom.DicomSequence(dicom.DicomTags.ScheduledProcedureStepSequence, spsItem));
  }

  return dataset;
}

function resolveReturnTags(dicom, specs) {
  if (specs.length > 0) {
    return specs.map((spec) => parseTagSpec(dicom, spec));
  }
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

function resolveSpsReturnTags(dicom, specs) {
  if (specs.length > 0) {
    return specs.map((spec) => parseTagSpec(dicom, spec));
  }
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

function emitWorklistReport(dicom, datasets) {
  const lines = [];
  lines.push("# Worklist SCU Result");
  lines.push("");
  lines.push(`- Matches: ${datasets.length}`);
  lines.push("");

  datasets.forEach((dataset, index) => {
    lines.push(`## Match ${index + 1}`);

    for (const item of dataset) {
      if (item.tag.equals(dicom.DicomTags.ScheduledProcedureStepSequence)) {
        continue;
      }
      const entry = dicom.DicomDictionary.default.lookup(item.tag);
      const keyword = entry.keyword || item.tag.toString();
      const value = dataset.tryGetString(item.tag);
      if (value !== undefined) {
        lines.push(`- ${keyword}: ${value}`);
      }
    }

    const spsSequence = dataset.tryGetSequence(dicom.DicomTags.ScheduledProcedureStepSequence);
    const spsItem = spsSequence?.items?.[0];
    if (spsItem) {
      lines.push("- ScheduledProcedureStepSequence:");
      for (const item of spsItem) {
        const entry = dicom.DicomDictionary.default.lookup(item.tag);
        const keyword = entry.keyword || item.tag.toString();
        const value = spsItem.tryGetString(item.tag);
        if (value !== undefined) {
          lines.push(`  ${keyword}: ${value}`);
        }
      }
    }

    lines.push("");
  });

  process.stdout.write(`${lines.join("\n")}\n`);
}

function emitStatusSummary(dicom, statuses) {
  if (statuses.length === 0) {
    return;
  }
  const last = statuses[statuses.length - 1];
  console.error(`[worklist-scu] Final status: ${formatDicomStatus(dicom, last)}`);
}

function parseArgs(argv) {
  const result = {
    host: "127.0.0.1",
    port: 104,
    callingAE: "DICOMTS_WL_SCU",
    calledAE: "DICOMTS_WL_SCP",
    keySpecsRaw: [],
    spsKeySpecsRaw: [],
    returnSpecsRaw: [],
    spsReturnSpecsRaw: [],
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
    if (arg === "--sps-key") {
      const value = argv[i + 1] ?? "";
      if (!value || value.startsWith("-")) {
        result.error = "Option --sps-key requires Keyword=value.";
      } else {
        result.spsKeySpecsRaw.push(value);
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
    if (arg === "--sps-return") {
      const value = argv[i + 1] ?? "";
      if (!value || value.startsWith("-")) {
        result.error = "Option --sps-return requires a DICOM keyword or tag.";
      } else {
        result.spsReturnSpecsRaw.push(value);
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
  console.log(`dicom-ts tool: Worklist SCU

Usage:
  node tools/dicom-worklist-scu/index.mjs [options]

Options:
  --host <host>                Remote MWL SCP host (default: 127.0.0.1)
  --port <port>                Remote MWL SCP port (default: 104)
  --calling-ae <ae>            Calling AE title (default: DICOMTS_WL_SCU)
  --called-ae <ae>             Called AE title (default: DICOMTS_WL_SCP)
  --key <Keyword=value>        Root-level matching key; repeatable
  --sps-key <Keyword=value>    Scheduled Procedure Step item matching key; repeatable
  --return <Keyword|tag>       Root-level return key; repeatable
  --sps-return <Keyword|tag>   Scheduled Procedure Step return key; repeatable
  --timeout <ms>               DIMSE timeout in ms (default: 30000)
  --validation <mode>          Validation mode: error|warning|ignore (default: warning)
  -h, --help                   Show help

Notes:
  - The tool sends Modality Worklist Information Model - FIND.
  - \`--sps-key\` and \`--sps-return\` target the first item in ScheduledProcedureStepSequence.

Examples:
  node tools/dicom-worklist-scu/index.mjs --key PatientName=DOE* --sps-key Modality=CT
  node tools/dicom-worklist-scu/index.mjs --sps-key ScheduledStationAETitle=CT01 --sps-return ScheduledProcedureStepStartDate
`);
}
