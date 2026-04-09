#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import { loadDicomTs } from "../tool-common.mjs";

const args = process.argv.slice(2);
const options = parseArgs(args);

if (options.help) {
  printHelp();
  process.exit(0);
}

if (!options.inputPath || options.error) {
  if (options.error) {
    console.error(`[tool] ${options.error}`);
  }
  printHelp();
  process.exit(1);
}

const dicom = await loadDicomTs();
if (!dicom) {
  process.exit(1);
}

try {
  const inputPath = path.resolve(options.inputPath);
  const file = await dicom.DicomFile.open(inputPath);
  const image = new dicom.DicomImage(file.dataset);

  if (options.frame < 0 || options.frame >= image.numberOfFrames) {
    throw new RangeError(`Frame index ${options.frame} is out of range (count=${image.numberOfFrames})`);
  }

  image.showOverlays = options.showOverlays;
  if (options.windowCenter !== null) {
    image.windowCenter = options.windowCenter;
  }
  if (options.windowWidth !== null) {
    image.windowWidth = options.windowWidth;
  }

  const rendered = image.renderImage(options.frame);
  const jpegBytes = typeof dicom.encodeImageSurfaceAsync === "function"
    ? await dicom.encodeImageSurfaceAsync({
      width: rendered.width,
      height: rendered.height,
      pixelFormat: "rgba8",
      pixels: rendered.pixels,
    }, "jpeg", { quality: options.quality })
    : dicom.encodeJpegImage(rendered, { quality: options.quality });
  const outputPath = path.resolve(options.outputPath || defaultOutputPath(inputPath, options.frame));

  await ensureDirectory(path.dirname(outputPath));
  await fs.writeFile(outputPath, jpegBytes);

  console.log(`[tool] Input:  ${inputPath}`);
  console.log(`[tool] Frame:  ${options.frame}`);
  console.log(`[tool] Size:   ${rendered.width}x${rendered.height}`);
  console.log(`[tool] Output: ${outputPath}`);
} catch (error) {
  console.error(`[tool] Failed to export JPEG: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}

function defaultOutputPath(inputPath, frame) {
  const ext = path.extname(inputPath);
  const name = path.basename(inputPath, ext);
  const suffix = frame === 0 ? "" : `.frame-${frame}`;
  return path.join(path.dirname(inputPath), `${name}${suffix}.jpg`);
}

async function ensureDirectory(dirPath) {
  await fs.mkdir(path.resolve(dirPath), { recursive: true });
}

function parseArgs(argv) {
  const result = {
    inputPath: null,
    outputPath: null,
    frame: 0,
    quality: 90,
    windowCenter: null,
    windowWidth: null,
    showOverlays: true,
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

    if (arg === "-f" || arg === "--frame") {
      const value = Number(argv[i + 1]);
      if (!Number.isInteger(value) || value < 0) {
        result.error = "Option -f/--frame requires a zero-based frame index.";
      } else {
        result.frame = value;
        i++;
      }
      continue;
    }

    if (arg === "-q" || arg === "--quality") {
      const value = Number(argv[i + 1]);
      if (!Number.isFinite(value)) {
        result.error = "Option -q/--quality requires a numeric value between 1 and 100.";
      } else {
        result.quality = Math.max(1, Math.min(100, Math.round(value)));
        i++;
      }
      continue;
    }

    if (arg === "--window-center") {
      const value = Number(argv[i + 1]);
      if (!Number.isFinite(value)) {
        result.error = "Option --window-center requires a numeric value.";
      } else {
        result.windowCenter = value;
        i++;
      }
      continue;
    }

    if (arg === "--window-width") {
      const value = Number(argv[i + 1]);
      if (!Number.isFinite(value) || value <= 0) {
        result.error = "Option --window-width requires a positive numeric value.";
      } else {
        result.windowWidth = value;
        i++;
      }
      continue;
    }

    if (arg === "--no-overlays") {
      result.showOverlays = false;
      continue;
    }

    if (!arg.startsWith("-") && !result.inputPath) {
      result.inputPath = arg;
      continue;
    }

    result.error = `Unknown option or argument: ${arg}`;
  }

  return result;
}

function printHelp() {
  console.log(`dicom-ts tool: render a DICOM image frame and save it as a JPEG file

Usage:
  node tools/dicom-to-jpeg/index.mjs <input.dcm> [options]

Options:
  -o, --out <file>          Output JPEG path
  -f, --frame <index>       Zero-based frame index (default: 0)
  -q, --quality <1-100>     JPEG quality (default: 90)
  --window-center <value>   Override render window center
  --window-width <value>    Override render window width
  --no-overlays             Disable DICOM graphics overlays
  -h, --help                Show help
`);
}
