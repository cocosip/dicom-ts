#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const version = "0.1.0";
const COMPRESSED_SYNTAX_ENTRIES = [
  { alias: "rle", key: "RLELossless" },
  { alias: "jpeg-baseline", key: "JPEGProcess1" },
  { alias: "jpeg-extended", key: "JPEGProcess2_4" },
  { alias: "jpeg-lossless", key: "JPEGProcess14" },
  { alias: "jpeg-lossless-sv1", key: "JPEGProcess14SV1" },
  { alias: "jpegls", key: "JPEGLSLossless" },
  { alias: "jpegls-near", key: "JPEGLSNearLossless" },
  { alias: "jpeg2000-lossless", key: "JPEG2000Lossless" },
  { alias: "jpeg2000", key: "JPEG2000Lossy" },
  { alias: "htj2k-lossless", key: "HTJ2KLossless" },
  { alias: "htj2k-lossless-rpcl", key: "HTJ2KLosslessRPCL" },
  { alias: "htj2k", key: "HTJ2K" },
];

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

if (options.error || !options.inputPath) {
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
  const sourceSyntax = file.dataset.internalTransferSyntax;

  console.log(`[tool] Transcoding ${filePath}`);
  console.log(`[tool] From: ${sourceSyntax.uid.name} (${sourceSyntax.uid.uid})`);

  if (options.targetSyntax) {
    const targetSyntax = resolveTransferSyntax(dicom, options.targetSyntax);
    if (!targetSyntax) {
      console.error(`[tool] Unknown transfer syntax: ${options.targetSyntax}`);
      process.exit(1);
    }

    console.log(`[tool] To:   ${targetSyntax.uid.name} (${targetSyntax.uid.uid})`);

    const outputPath = path.resolve(options.outputPath || generateOutputPath(filePath, targetSyntax));
    if (targetSyntax.uid.uid === sourceSyntax.uid.uid) {
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      if (outputPath !== filePath) {
        await fs.copyFile(filePath, outputPath);
        console.log(`[tool] Source and target syntax are the same. Copied to: ${outputPath}`);
      } else {
        console.log("[tool] Source and target syntax are the same. Nothing to do.");
      }
      process.exit(0);
    }

    const validation = validateTranscode(dicom, sourceSyntax, targetSyntax);
    if (!validation.ok) {
      console.error(`[tool] Cannot transcode: ${validation.reason}`);
      process.exit(1);
    }

    await saveTranscodedFile(dicom, file.dataset, sourceSyntax, targetSyntax, outputPath);
    console.log(`[tool] Saved to: ${outputPath}`);
  } else {
    const outputDir = path.resolve(options.outputDir || path.dirname(filePath));
    const allTargets = getAllCompressedTargets(dicom);
    if (allTargets.length === 0) {
      console.error("[tool] No compressed transfer syntax targets are available.");
      process.exit(1);
    }

    await fs.mkdir(outputDir, { recursive: true });
    console.log(`[tool] Output directory: ${outputDir}`);
    console.log(`[tool] Target count: ${allTargets.length}`);

    const results = {
      success: 0,
      skipped: 0,
      failed: 0,
    };

    for (const target of allTargets) {
      const targetSyntax = target.syntax;
      if (targetSyntax.uid.uid === sourceSyntax.uid.uid) {
        console.log(`[tool] [skip] ${target.alias}: already in source transfer syntax`);
        results.skipped++;
        continue;
      }

      const validation = validateTranscode(dicom, sourceSyntax, targetSyntax);
      if (!validation.ok) {
        console.log(`[tool] [skip] ${target.alias}: ${validation.reason}`);
        results.skipped++;
        continue;
      }

      const outputPath = generateOutputPath(filePath, targetSyntax, target.alias, outputDir);
      try {
        await saveTranscodedFile(dicom, file.dataset, sourceSyntax, targetSyntax, outputPath);
        console.log(`[tool] [ok]   ${target.alias}: ${outputPath}`);
        results.success++;
      } catch (error) {
        console.error(`[tool] [fail] ${target.alias}: ${error instanceof Error ? error.message : String(error)}`);
        results.failed++;
      }
    }

    console.log(`[tool] Done. success=${results.success}, skipped=${results.skipped}, failed=${results.failed}`);
    if (results.failed > 0) {
      process.exitCode = 1;
    }
  }

} catch (error) {
  console.error(`[tool] Failed to transcode DICOM file: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}

function getAllCompressedTargets(dicom) {
  const seen = new Set();
  const targets = [];

  for (const entry of COMPRESSED_SYNTAX_ENTRIES) {
    const syntax = dicom.DicomTransferSyntax?.[entry.key];
    if (!syntax || seen.has(syntax.uid.uid)) {
      continue;
    }
    seen.add(syntax.uid.uid);
    targets.push({
      alias: entry.alias,
      syntax,
    });
  }

  return targets;
}

async function saveTranscodedFile(dicom, dataset, sourceSyntax, targetSyntax, outputPath) {
  const transcoder = new dicom.DicomTranscoder(sourceSyntax, targetSyntax);
  const newDataset = transcoder.transcode(dataset);
  const newFile = new dicom.DicomFile(newDataset);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await newFile.save(outputPath);
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
    "htj2k-lossless-rpcl": dicom.DicomTransferSyntax.HTJ2KLosslessRPCL,
    "htj2k": dicom.DicomTransferSyntax.HTJ2K,
  };

  return aliases[syntax.toLowerCase()] || null;
}

function generateOutputPath(inputPath, syntax, alias = null, outDir = null) {
  const dir = outDir || path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const name = path.basename(inputPath, ext);

  let suffix = alias;
  if (!suffix) {
    suffix = syntax.uid.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    if (suffix.includes("jpeg-lossless-non-hierarchical-first-order-prediction")) suffix = "jpeg-lossless-sv1";
    else if (suffix.includes("jpeg-lossless-non-hierarchical")) suffix = "jpeg-lossless";
    else if (suffix.includes("jpeg-baseline")) suffix = "jpeg-baseline";
    else if (suffix.includes("rle-lossless")) suffix = "rle";
  }

  return path.join(dir, `${name}.${suffix}.dcm`);
}

function validateTranscode(dicom, sourceSyntax, targetSyntax) {
  if (dicom.TranscoderManager.canTranscode(sourceSyntax, targetSyntax)) {
    return { ok: true, reason: null };
  }

  const missing = [];
  if (sourceSyntax.isEncapsulated && !dicom.TranscoderManager.hasCodec(sourceSyntax)) {
    missing.push(`source codec missing (${sourceSyntax.uid.uid})`);
  }
  if (targetSyntax.isEncapsulated && !dicom.TranscoderManager.hasCodec(targetSyntax)) {
    missing.push(`target codec missing (${targetSyntax.uid.uid})`);
  }

  if (missing.length > 0) {
    return { ok: false, reason: missing.join(", ") };
  }
  return { ok: false, reason: "transcoder manager rejected this conversion" };
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
    outputDir: null,
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

    if (arg === "--out-dir") {
      const value = argv[i + 1] ?? "";
      if (!value || value.startsWith("-")) {
        result.error = "Option --out-dir requires a directory path.";
      } else {
        result.outputDir = value;
        i++;
      }
      continue;
    }

    if (!arg.startsWith("-")) {
      if (!result.inputPath) {
        result.inputPath = arg;
      } else if (!result.targetSyntax) {
        result.targetSyntax = arg;
      } else {
        result.error = `Unexpected argument: ${arg}`;
      }
      continue;
    }

    if (arg.startsWith("-")) {
      result.error = `Unknown option: ${arg}`;
    }
  }

  if (result.targetSyntax && result.outputDir) {
    result.error = "Option --out-dir can only be used when target-syntax is omitted.";
  }
  if (!result.targetSyntax && result.outputPath) {
    result.error = "Option -o/--out can only be used with a specific target-syntax.";
  }

  return result;
}

function printUsage() {
  console.log("Usage: dicom-transcode [options] <input-file> [target-syntax]");
  console.log("");
  console.log("Transcode a DICOM file:");
  console.log("  - If [target-syntax] is provided: transcode once.");
  console.log("  - If [target-syntax] is omitted: transcode to all known compressed transfer syntaxes.");
  console.log("");
  console.log("Arguments:");
  console.log("  <input-file>      Path to the input DICOM file");
  console.log("  [target-syntax]   Target Transfer Syntax UID or alias (optional)");
  console.log("");
  console.log("Options:");
  console.log("  -version, --version    Show version information");
  console.log("  -help, --help          Show this help message");
  console.log("  -o, --out <file>       Output file path for single-target mode");
  console.log("  --out-dir <dir>        Output directory for all-target mode");
  console.log("");
  console.log("Supported Syntax Aliases:");
  console.log("  rle");
  console.log("  jpeg-baseline, jpeg-extended, jpeg-lossless, jpeg-lossless-sv1");
  console.log("  jpegls, jpegls-near");
  console.log("  jpeg2000-lossless, jpeg2000");
  console.log("  htj2k-lossless, htj2k-lossless-rpcl, htj2k");
  console.log("");
  console.log("Examples:");
  console.log("  node tools/dicom-transcode/index.mjs image.dcm");
  console.log("  node tools/dicom-transcode/index.mjs image.dcm --out-dir out");
  console.log("  node tools/dicom-transcode/index.mjs image.dcm rle --out image.rle.dcm");
  console.log("  node tools/dicom-transcode/index.mjs image.dcm 1.2.840.10008.1.2.5");
}
