#!/usr/bin/env node

import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const options = parseArgs(args);

if (options.help) {
  printHelp();
  process.exit(0);
}

const dicom = await loadDicomTs();
if (!dicom) {
  process.exit(1);
}

let inputPath = options.inputPath;
let tempDemoFile = null;

if (!inputPath) {
  tempDemoFile = path.join(os.tmpdir(), "dicom-ts-sample-json-export.dcm");
  await createDemoDicomFile(tempDemoFile, dicom);
  inputPath = tempDemoFile;
  console.error(`[tool] No input file provided. Generated demo DICOM: ${inputPath}`);
}

try {
  const file = await dicom.DicomFile.open(inputPath);
  const converter = new dicom.DicomJsonConverter({
    writeTagsAsKeywords: options.useKeywords,
  });

  const json = converter.toJson(file.dataset, options.pretty);

  if (options.outputPath) {
    await ensureOutputDirectory(options.outputPath);
    await fs.writeFile(options.outputPath, json, "utf8");
    console.error(`[tool] JSON exported to: ${options.outputPath}`);
  } else {
    process.stdout.write(`${json}\n`);
  }
} catch (error) {
  console.error(`[tool] Export failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  if (tempDemoFile && options.cleanupDemo !== false) {
    await fs.rm(tempDemoFile, { force: true });
  }
}

async function createDemoDicomFile(filePath, dicom) {
  const ds = new dicom.DicomDataset(dicom.DicomTransferSyntax.ExplicitVRLittleEndian);
  ds.addOrUpdate(new dicom.DicomUniqueIdentifier(dicom.DicomTags.SOPClassUID, dicom.DicomUIDs.BasicTextSRStorage));
  ds.addOrUpdate(new dicom.DicomUniqueIdentifier(dicom.DicomTags.SOPInstanceUID, dicom.DicomUID.generate()));
  ds.addOrUpdate(new dicom.DicomCodeString(dicom.DicomTags.SpecificCharacterSet, "ISO_IR 192"));
  ds.addOrUpdate(new dicom.DicomPersonName(dicom.DicomTags.PatientName, "DOE^JSON"));
  ds.addOrUpdate(new dicom.DicomLongString(dicom.DicomTags.PatientID, "SAMPLE-001"));

  const file = new dicom.DicomFile(ds);
  await file.save(filePath);
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
    inputPath: null,
    outputPath: null,
    useKeywords: false,
    pretty: true,
    help: false,
    cleanupDemo: true,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") {
      result.help = true;
    } else if (arg === "--keywords") {
      result.useKeywords = true;
    } else if (arg === "--compact") {
      result.pretty = false;
    } else if (arg === "--keep-demo") {
      result.cleanupDemo = false;
    } else if (arg === "-o" || arg === "--out") {
      result.outputPath = argv[i + 1] ?? null;
      i++;
    } else if (!arg.startsWith("-") && !result.inputPath) {
      result.inputPath = arg;
    }
  }

  return result;
}

function printHelp() {
  console.log(`dicom-ts tool: export DICOM file as JSON

Usage:
  node tools/dicom-to-json/index.mjs [input.dcm] [--keywords] [--compact] [-o output.json]

Options:
  input.dcm       Optional input DICOM file path; when omitted, a demo file is generated
  --keywords      Use DICOM keywords as JSON keys (default is 8-hex tags)
  --compact       Output compact JSON (default is pretty JSON)
  -o, --out       Write output to file (default is stdout)
  --keep-demo     Keep the auto-generated demo DICOM file
  -h, --help      Show help
`);
}

async function ensureOutputDirectory(filePath) {
  const dir = path.dirname(filePath);
  try {
    const stat = await fs.stat(dir);
    if (stat.isDirectory()) {
      return;
    }
  } catch {
    // Directory does not exist; create it below.
  }

  await fs.mkdir(dir, { recursive: true });
}
