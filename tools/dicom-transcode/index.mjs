#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const version = "0.1.0";

const args = process.argv.slice(2);
const options = parseArgs(args);

if (options.version) {
  process.stdout.write(`dicom-transcode version ${version}\n`);
  process.exit(0);
}

if (options.help) {
  printUsage();
  process.exit(0);
}

if (options.error || !options.inputPath || !options.targetSyntax) {
  if (options.error) {
    console.error(`[tool] ${options.error}`);
  }
  printUsage();
  process.exit(1);
}

const dicom = await loadDicomTs();
if (!dicom) {
  process.exit(1);
}

// Register codecs
registerCodecs(dicom);

try {
  const filePath = path.resolve(options.inputPath);
  const file = await dicom.DicomFile.open(filePath);

  const targetSyntax = resolveTransferSyntax(dicom, options.targetSyntax);
  if (!targetSyntax) {
    console.error(`[tool] Unknown transfer syntax: ${options.targetSyntax}`);
    process.exit(1);
  }

  console.log(`[tool] Transcoding ${filePath}`);
  console.log(`[tool] From: ${file.dataset.internalTransferSyntax.name} (${file.dataset.internalTransferSyntax.uid.uid})`);
  console.log(`[tool] To:   ${targetSyntax.name} (${targetSyntax.uid.uid})`);

  const transcoder = new dicom.DicomTranscoder(
    file.dataset.internalTransferSyntax,
    targetSyntax
  );

  const newDataset = transcoder.transcode(file.dataset);

  const outputPath = options.outputPath || generateOutputPath(filePath, targetSyntax);
  
  const newFile = new dicom.DicomFile(newDataset);
  await newFile.save(outputPath);

  console.log(`[tool] Saved to: ${outputPath}`);

} catch (error) {
  console.error(`[tool] Failed to transcode DICOM file: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}

function registerCodecs(dicom) {
  if (dicom.DicomCodecSetup) {
    dicom.DicomCodecSetup.initialize();
    return;
  }

  // Fallback for older versions or if DicomCodecSetup is missing
  // Register RLE
  if (dicom.DicomRleCodec) {
    dicom.TranscoderManager.register(new dicom.DicomRleCodec());
  }
  
  // Register JPEG Process 14
  if (dicom.DicomJpegProcess14Codec) {
    dicom.TranscoderManager.register(new dicom.DicomJpegProcess14Codec());
  }

  // Register JPEG Process 14 SV1
  if (dicom.DicomJpegProcess14SV1Codec) {
    dicom.TranscoderManager.register(new dicom.DicomJpegProcess14SV1Codec());
  }
}

function resolveTransferSyntax(dicom, syntax) {
  // Try by UID first
  let ts = dicom.DicomTransferSyntax.lookup(syntax);
  if (ts) return ts;

  // Try by alias
  const aliases = {
    "rle": dicom.DicomTransferSyntax.RLELossless,
    "jpeg-baseline": dicom.DicomTransferSyntax.JPEGProcess1,
    "jpeg-extended": dicom.DicomTransferSyntax.JPEGProcess2_4,
    "jpeg-lossless": dicom.DicomTransferSyntax.JPEGProcess14,
    "jpeg-lossless-sv1": dicom.DicomTransferSyntax.JPEGProcess14SV1,
    "jpegls": dicom.DicomTransferSyntax.JPEGLSLossless,
    "jpegls-near": dicom.DicomTransferSyntax.JPEGLSNearLossless,
    "jpeg2000-lossless": dicom.DicomTransferSyntax.JPEG2000Lossless,
    "jpeg2000": dicom.DicomTransferSyntax.JPEG2000Lossy,
    "htj2k-lossless": dicom.DicomTransferSyntax.HTJ2KLossless,
    "htj2k": dicom.DicomTransferSyntax.HTJ2K,
  };

  return aliases[syntax.toLowerCase()] || null;
}

function generateOutputPath(inputPath, syntax) {
  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const name = path.basename(inputPath, ext);
  
  // Create a suffix from the syntax name or UID
  let suffix = syntax.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  // shorten common names
  if (suffix.includes("jpeg-lossless-non-hierarchical-first-order-prediction")) suffix = "jpeg-lossless-sv1";
  else if (suffix.includes("jpeg-lossless-non-hierarchical")) suffix = "jpeg-lossless";
  else if (suffix.includes("jpeg-baseline")) suffix = "jpeg-baseline";
  else if (suffix.includes("rle-lossless")) suffix = "rle";

  return path.join(dir, `${name}.${suffix}.dcm`);
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
    targetSyntax: null,
    version: false,
    help: false,
    error: null,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "-version" || arg === "--version" || arg === "-v") {
      result.version = true;
      continue;
    }

    if (arg === "-help" || arg === "--help" || arg === "-h") {
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

    if (!arg.startsWith("-")) {
      if (!result.inputPath) {
        result.inputPath = arg;
      } else if (!result.targetSyntax) {
        result.targetSyntax = arg;
      }
      continue;
    }

    if (arg.startsWith("-")) {
      result.error = `Unknown option: ${arg}`;
    }
  }

  return result;
}

function printUsage() {
  console.log("Usage: dicom-transcode [options] <input-file> <target-syntax>");
  console.log("");
  console.log("Transcode a DICOM file to a different transfer syntax.");
  console.log("");
  console.log("Arguments:");
  console.log("  <input-file>      Path to the input DICOM file");
  console.log("  <target-syntax>   Target Transfer Syntax UID or alias");
  console.log("");
  console.log("Options:");
  console.log("  -version, --version    Show version information");
  console.log("  -help, --help          Show this help message");
  console.log("  -o, --out <file>       Output file path (default: input.<syntax>.dcm)");
  console.log("");
  console.log("Supported Syntax Aliases:");
  console.log("  rle");
  console.log("  jpeg-baseline, jpeg-extended, jpeg-lossless, jpeg-lossless-sv1");
  console.log("  jpegls, jpegls-near");
  console.log("  jpeg2000-lossless, jpeg2000");
  console.log("  htj2k-lossless, htj2k");
  console.log("");
  console.log("Examples:");
  console.log("  node tools/dicom-transcode/index.mjs image.dcm rle");
  console.log("  node tools/dicom-transcode/index.mjs image.dcm 1.2.840.10008.1.2.5");
}
