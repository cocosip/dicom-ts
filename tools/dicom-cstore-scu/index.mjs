#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const options = parseArgs(args);

if (options.help) {
  printHelp();
  process.exit(0);
}

if (options.error || options.inputPaths.length === 0) {
  if (options.error) {
    console.error(`[tool] ${options.error}`);
  } else {
    console.error("[tool] Missing input path(s). Provide DICOM file(s) or directory path(s).");
  }
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

try {
  const candidateFiles = await expandInputPaths(options.inputPaths, options.recursive);
  if (candidateFiles.length === 0) {
    throw new Error("No input files found from the provided path(s).");
  }

  const requests = [];
  const reportItems = [];
  let skippedCount = 0;

  for (const absolutePath of candidateFiles) {
    let file;
    try {
      file = await dicom.DicomFile.open(absolutePath);
    } catch (error) {
      skippedCount += 1;
      console.error(
        `[scu] Skip non-DICOM or unreadable file: ${absolutePath} `
        + `(${error instanceof Error ? error.message : String(error)})`,
      );
      continue;
    }

    const reportItem = {
      inputPath: absolutePath,
      sopClassUID: file.dataset.tryGetString(dicom.DicomTags.SOPClassUID) ?? "-",
      sopInstanceUID: file.dataset.tryGetString(dicom.DicomTags.SOPInstanceUID) ?? "-",
      statusCode: null,
      statusState: "NoResponse",
      statusDescription: "No C-STORE response received",
    };
    reportItems.push(reportItem);

    const request = new dicom.DicomCStoreRequest(file);
    request.onResponseReceived = (_rq, rsp) => {
      const resolved = dicom.DicomStatus.lookup(rsp.status);
      reportItem.statusCode = rsp.status;
      reportItem.statusState = resolved.state;
      reportItem.statusDescription = resolved.description || resolved.toString();
      console.error(
        `[scu] Response: file=${path.basename(reportItem.inputPath)} status=${formatStatusHex(rsp.status)} `
        + `state=${resolved.state} desc=${reportItem.statusDescription}`,
      );
    };
    requests.push(request);
  }

  if (requests.length === 0) {
    throw new Error("No valid DICOM files to send.");
  }

  console.error(
    `[scu] Sending ${requests.length} C-STORE request(s) to ${options.host}:${options.port} `
    + `(calling=${options.callingAE}, called=${options.calledAE}, skipped=${skippedCount}, validation=${options.validation})`,
  );

  const client = new dicom.DicomClient({
    requestTimeoutMs: options.timeoutMs,
  });
  for (const request of requests) {
    client.addRequest(request);
  }

  await client.sendAsync(options.host, options.port, options.callingAE, options.calledAE);

  emitReport(reportItems);

  const failed = reportItems.filter((item) => isFailedState(item.statusState));
  if (failed.length > 0) {
    console.error(`[scu] Completed with ${failed.length} failed request(s).`);
    process.exitCode = 2;
  } else {
    console.error("[scu] Completed successfully.");
  }
} catch (error) {
  console.error(`[scu] Failed to send C-STORE: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}

function emitReport(items) {
  const lines = [];
  lines.push("# C-STORE SCU Result");
  lines.push("");
  for (const item of items) {
    lines.push(`- File: ${item.inputPath}`);
    lines.push(`  SOP Class UID: ${item.sopClassUID}`);
    lines.push(`  SOP Instance UID: ${item.sopInstanceUID}`);
    lines.push(`  Status: ${formatStatus(item)}`);
    lines.push("");
  }
  process.stdout.write(`${lines.join("\n")}\n`);
}

function formatStatus(item) {
  if (item.statusCode === null) {
    return item.statusDescription;
  }
  return `${formatStatusHex(item.statusCode)} ${item.statusState} (${item.statusDescription})`;
}

function formatStatusHex(value) {
  return `0x${(value & 0xffff).toString(16).toUpperCase().padStart(4, "0")}`;
}

function isFailedState(state) {
  return state === "Failure" || state === "Cancel" || state === "NoResponse";
}

function validateAeTitle(dicom, value, optionName) {
  try {
    dicom.DicomValidation.validateAE(value);
    return true;
  } catch (error) {
    console.error(`[tool] Invalid AE title for ${optionName}: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

function applyValidationMode(dicom, mode) {
  if (typeof dicom.setValidationLevel !== "function" || !dicom.DicomValidationLevel) {
    return;
  }

  if (mode === "ignore") {
    dicom.setValidationLevel(dicom.DicomValidationLevel.Ignore);
    return;
  }
  if (mode === "warning") {
    dicom.setValidationLevel(dicom.DicomValidationLevel.Warning);
    return;
  }
  dicom.setValidationLevel(dicom.DicomValidationLevel.Error);
}

async function expandInputPaths(inputPaths, recursive) {
  const output = [];
  for (const inputPath of inputPaths) {
    const absolutePath = path.resolve(inputPath);
    const stat = await fs.stat(absolutePath);
    if (stat.isFile()) {
      output.push(absolutePath);
      continue;
    }
    if (stat.isDirectory()) {
      await collectFilesFromDirectory(absolutePath, recursive, output);
      continue;
    }
    throw new Error(`Unsupported input path type: ${absolutePath}`);
  }

  output.sort((a, b) => a.localeCompare(b));
  return output;
}

async function collectFilesFromDirectory(dirPath, recursive, output) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isFile()) {
      output.push(fullPath);
      continue;
    }
    if (recursive && entry.isDirectory()) {
      await collectFilesFromDirectory(fullPath, recursive, output);
    }
  }
}

async function loadDicomTs() {
  try {
    return await import("../../dist/esm/index.js");
  } catch {
    console.error("[tool] dist/esm not found. Building automatically...");
    const buildResult = spawnSync("npm", ["run", "build:esm"], {
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    if (buildResult.status !== 0) {
      console.error("[tool] Auto build failed. Run: npm run build");
      return null;
    }

    try {
      return await import("../../dist/esm/index.js");
    } catch {
      console.error("[tool] Build succeeded but dist/esm still cannot be loaded.");
      return null;
    }
  }
}

function parseArgs(argv) {
  const result = {
    inputPaths: [],
    host: "127.0.0.1",
    port: 104,
    callingAE: "DICOMTS_SCU",
    calledAE: "DICOMTS_SCP",
    timeoutMs: 30_000,
    recursive: false,
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
    if (arg === "-r" || arg === "--recursive") {
      result.recursive = true;
      continue;
    }
    if (arg.startsWith("-")) {
      result.error = `Unknown option: ${arg}`;
      continue;
    }
    result.inputPaths.push(arg);
  }

  return result;
}

function printHelp() {
  console.log(`dicom-ts tool: C-STORE SCU

Usage:
  node tools/dicom-cstore-scu/index.mjs [options] <file-or-dir> [file-or-dir ...]

Options:
  --host <host>          Remote SCP host (default: 127.0.0.1)
  --port <port>          Remote SCP port (default: 104)
  --calling-ae <ae>      Calling AE title (default: DICOMTS_SCU)
  --called-ae <ae>       Called AE title (default: DICOMTS_SCP)
  --timeout <ms>         DIMSE request timeout in ms (default: 30000)
  --validation <mode>    DICOM value validation mode: error|warning|ignore (default: warning)
  -r, --recursive        Recursively scan subdirectories when input path is a directory
  -h, --help             Show help

Example:
  node tools/dicom-cstore-scu/index.mjs --host 127.0.0.1 --port 11112 --calling-ae MY_SCU --called-ae MY_SCP ./dicom-dir
`);
}
