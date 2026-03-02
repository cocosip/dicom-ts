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

if (!options.inputPath) {
  console.error("[tool] Missing input DICOM path.");
  printHelp();
  process.exit(1);
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

try {
  const lines = [];
  const absolutePath = path.resolve(options.inputPath);
  const stat = await fs.stat(absolutePath);
  const hasHeader = await dicom.DicomFile.hasValidHeader(absolutePath);
  const file = await dicom.DicomFile.open(absolutePath);

  printFileSection(lines, file, absolutePath, stat.size, hasHeader);
  printPatientSection(lines, file.dataset, dicom);
  printStudySection(lines, file.dataset, dicom);
  printSeriesSection(lines, file.dataset, dicom);
  printUidSection(lines, file, dicom);
  printMetaSection(lines, file.fileMetaInfo);
  await emitOutput(lines, options.outputPath);
} catch (error) {
  console.error(`[tool] Failed to inspect DICOM: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}

function printFileSection(lines, file, filePath, sizeBytes, hasHeader) {
  const syntax = file.dataset.internalTransferSyntax;
  printSection(lines, "File");
  printField(lines, "Path", filePath);
  printField(lines, "Size", `${sizeBytes} bytes`);
  printField(lines, "Has DICM Header", hasHeader ? "yes" : "no");
  printField(lines, "Format", String(file.format));
  printField(lines, "Is Partial", file.isPartial ? "yes" : "no");
  printField(lines, "Transfer Syntax", syntax ? `${syntax.uid.uid} (${syntax.uid.name})` : "-");
  printField(lines, "Top-level Elements", String(file.dataset.count));
}

function printPatientSection(lines, dataset, dicom) {
  const T = dicom.DicomTags;
  printSection(lines, "Patient");
  printField(lines, "Patient Name", valueOrDash(dataset.tryGetString(T.PatientName)));
  printField(lines, "Patient ID", valueOrDash(dataset.tryGetString(T.PatientID)));
  printField(lines, "Patient Birth Date", valueOrDash(dataset.tryGetString(T.PatientBirthDate)));
  printField(lines, "Patient Sex", valueOrDash(dataset.tryGetString(T.PatientSex)));
}

function printStudySection(lines, dataset, dicom) {
  const T = dicom.DicomTags;
  printSection(lines, "Study");
  printField(lines, "Study Date", valueOrDash(dataset.tryGetString(T.StudyDate)));
  printField(lines, "Study Time", valueOrDash(dataset.tryGetString(T.StudyTime)));
  printField(lines, "Study ID", valueOrDash(dataset.tryGetString(T.StudyID)));
  printField(lines, "Accession Number", valueOrDash(dataset.tryGetString(T.AccessionNumber)));
  printField(lines, "Study Description", valueOrDash(dataset.tryGetString(T.StudyDescription)));
  printField(lines, "Study Instance UID", formatUidFromDataset(dataset, T.StudyInstanceUID, dicom));
}

function printSeriesSection(lines, dataset, dicom) {
  const T = dicom.DicomTags;
  printSection(lines, "Series");
  printField(lines, "Modality", valueOrDash(dataset.tryGetString(T.Modality)));
  printField(lines, "Series Number", valueOrDash(dataset.tryGetString(T.SeriesNumber)));
  printField(lines, "Series Description", valueOrDash(dataset.tryGetString(T.SeriesDescription)));
  printField(lines, "Series Instance UID", formatUidFromDataset(dataset, T.SeriesInstanceUID, dicom));
}

function printUidSection(lines, file, dicom) {
  const T = dicom.DicomTags;
  const ds = file.dataset;
  printSection(lines, "SOP / UID");
  printField(lines, "SOP Class UID", formatUidFromDataset(ds, T.SOPClassUID, dicom));
  printField(lines, "SOP Instance UID", formatUidFromDataset(ds, T.SOPInstanceUID, dicom));
  printField(lines, "Media Storage SOP Class UID", formatUid(file.fileMetaInfo.mediaStorageSOPClassUID));
  printField(lines, "Media Storage SOP Instance UID", formatUid(file.fileMetaInfo.mediaStorageSOPInstanceUID));
}

function printMetaSection(lines, meta) {
  printSection(lines, "File Meta");
  printField(lines, "Transfer Syntax UID", meta.transferSyntaxUID ? `${meta.transferSyntaxUID.uid.uid} (${meta.transferSyntaxUID.uid.name})` : "-");
  printField(lines, "Implementation Class UID", formatUid(meta.implementationClassUID));
  printField(lines, "Implementation Version Name", valueOrDash(meta.implementationVersionName));

  const sourceAet = meta.sourceApplicationEntityTitle;
  const sendingAet = meta.sendingApplicationEntityTitle;
  const receivingAet = meta.receivingApplicationEntityTitle;
  printField(lines, "Source AET", valueOrDash(sourceAet));
  printField(lines, "Sending AET", valueOrDash(sendingAet));
  printField(lines, "Receiving AET", valueOrDash(receivingAet));

  const privateCreator = meta.privateInformationCreatorUID;
  printField(lines, "Private Info Creator UID", formatUid(privateCreator));
  printField(lines, "Private Info Bytes", meta.privateInformation ? String(meta.privateInformation.byteLength) : "-");
}

function formatUidFromDataset(dataset, tag, dicom) {
  const raw = dataset.tryGetString(tag);
  if (!raw) return "-";
  const parsed = dicom.DicomUID.parse(raw);
  return parsed.name && parsed.name !== "Unknown" ? `${parsed.uid} (${parsed.name})` : parsed.uid;
}

function formatUid(uid) {
  if (!uid) return "-";
  return uid.name && uid.name !== "Unknown" ? `${uid.uid} (${uid.name})` : uid.uid;
}

function valueOrDash(value) {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

function printSection(lines, title) {
  lines.push("");
  lines.push(`=== ${title} ===`);
}

function printField(lines, name, value) {
  lines.push(`${name}: ${value}`);
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
    help: false,
    error: null,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") {
      result.help = true;
      continue;
    }
    if (arg === "-o" || arg === "--out") {
      const value = argv[i + 1] ?? "";
      if (!value || value.startsWith("-")) {
        result.error = "Option -o/--out requires an output file path.";
      } else {
        result.outputPath = value;
        i++;
      }
      continue;
    }
    if (!arg.startsWith("-") && !result.inputPath) {
      result.inputPath = arg;
    }
  }

  return result;
}

function printHelp() {
  console.log(`dicom-ts tool: print basic DICOM file information

Usage:
  node tools/dicom-info/index.mjs <input.dcm> [-o output.txt]

Options:
  -o, --out       Write output to file (default is stdout)
  -h, --help      Show help
`);
}

async function emitOutput(lines, outputPath) {
  const text = `${lines.join("\n")}\n`;
  if (!outputPath) {
    process.stdout.write(text);
    return;
  }

  await ensureOutputDirectory(outputPath);
  await fs.writeFile(outputPath, text, "utf8");
  console.error(`[tool] Info exported to: ${outputPath}`);
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
