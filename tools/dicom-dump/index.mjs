#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const version = "0.1.0";

const args = process.argv.slice(2);
const options = parseArgs(args);

if (options.version) {
  process.stdout.write(`dicomdump version ${version}\n`);
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

try {
  const filePath = path.resolve(options.inputPath);
  const file = await dicom.DicomFile.open(filePath);

  const lines = [];
  if (file.fileMetaInfo && file.fileMetaInfo.count > 0) {
    lines.push("# File Meta Information");
    dumpDataset(file.fileMetaInfo, 0, options.maxDepth, options.showValues, options.compact, lines, dicom);
    lines.push("");
  }

  lines.push("# Main Dataset");
  dumpDataset(file.dataset, 0, options.maxDepth, options.showValues, options.compact, lines, dicom);

  await emitOutput(lines, options.outputPath);
} catch (error) {
  console.error(`[tool] Failed to parse DICOM file: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}

function dumpDataset(ds, depth, maxDepth, showValues, compact, lines, dicom) {
  if (maxDepth >= 0 && depth > maxDepth) {
    return;
  }

  const indent = "  ".repeat(depth);
  for (const item of ds) {
    const tagText = item.tag.toString();
    const vrCode = item.valueRepresentation?.code ?? "UN";
    const keyword = getKeyword(dicom, item.tag);

    if (item instanceof dicom.DicomSequence) {
      const seqText = `(Sequence with ${item.items.length} item(s))`;
      lines.push(formatLine(indent, tagText, vrCode, keyword, seqText, compact));

      if (maxDepth < 0 || depth < maxDepth) {
        for (let i = 0; i < item.items.length; i++) {
          const title = compact ? `Item #${i + 1}:` : `--- Item #${i + 1} ---`;
          lines.push(`${indent}  ${title}`);
          dumpDataset(item.items[i], depth + 1, maxDepth, showValues, compact, lines, dicom);
        }
      }
      continue;
    }

    if (item instanceof dicom.DicomFragmentSequence) {
      const fragmentText = `(Fragment sequence with ${item.fragments.length} fragment(s), ${item.offsetTable.length} offsets)`;
      lines.push(formatLine(indent, tagText, vrCode, keyword, fragmentText, compact));
      continue;
    }

    if (!showValues) {
      lines.push(formatLine(indent, tagText, vrCode, keyword, "", compact));
      continue;
    }

    const value = formatElementValue(item, compact, dicom);
    lines.push(formatLine(indent, tagText, vrCode, keyword, value, compact));
  }
}

function formatElementValue(item, compact, dicom) {
  try {
    const vrCode = item.valueRepresentation?.code ?? "UN";
    if (isBinaryVr(vrCode) && item.buffer) {
      const size = Number.isFinite(item.buffer.size) ? item.buffer.size : 0;
      return size > 0 ? `(Binary data, ${size} bytes)` : "(Binary data)";
    }

    if (item instanceof dicom.DicomAttributeTag) {
      return formatArray(item.tagValues.map((t) => t.toString("J")), compact);
    }

    if (item instanceof dicom.DicomMultiStringElement) {
      return formatArray(item.values, compact);
    }

    if (item instanceof dicom.DicomStringElement) {
      return formatStringValue(item.value, compact);
    }

    if (item instanceof dicom.DicomValueElement) {
      const values = item.values.map((v) => typeof v === "bigint" ? v.toString() : v);
      return formatArray(values, compact);
    }

    if (item.buffer && item.buffer.size > 0) {
      return `(Binary data, ${item.buffer.size} bytes)`;
    }
  } catch {
    return "(unable to decode value)";
  }

  return "(empty)";
}

function formatArray(values, compact) {
  if (!Array.isArray(values) || values.length === 0) {
    return "(empty)";
  }
  if (values.length === 1) {
    return formatStringValue(String(values[0]), compact);
  }
  if (compact && values.length > 5) {
    return `[${values[0]}, ${values[1]}, ${values[2]}, ... (${values.length} values)]`;
  }
  return `[${values.map((v) => String(v)).join(", ")}]`;
}

function formatStringValue(value, compact) {
  const text = value === undefined || value === null || value === "" ? "(empty)" : String(value);
  if (compact && text.length > 60) {
    return `${text.slice(0, 60)}...`;
  }
  return text;
}

function formatLine(indent, tag, vr, keyword, value, compact) {
  if (compact) {
    return `${indent}${tag} ${vr}${value ? ` ${value}` : ""}`;
  }
  const tagCol = padRight(tag, 14);
  const vrCol = padRight(vr, 4);
  const keywordCol = padRight(keyword, 32);
  return `${indent}${tagCol} ${vrCol} ${keywordCol}${value ?? ""}`.trimEnd();
}

function getKeyword(dicom, tag) {
  const entry = dicom.DicomDictionary.default.lookup(tag);
  if (!entry || entry === dicom.UnknownTag) {
    return "-";
  }
  return entry.keyword || entry.name || "-";
}

function isBinaryVr(vrCode) {
  return (
    vrCode === "OB"
    || vrCode === "OW"
    || vrCode === "OF"
    || vrCode === "OD"
    || vrCode === "OL"
    || vrCode === "OV"
    || vrCode === "UN"
  );
}

function padRight(text, width) {
  const s = String(text ?? "");
  return s.length >= width ? s : `${s}${" ".repeat(width - s.length)}`;
}

async function emitOutput(lines, outputPath) {
  const text = `${lines.join("\n")}\n`;
  if (!outputPath) {
    process.stdout.write(text);
    return;
  }

  await ensureOutputDirectory(outputPath);
  await fs.writeFile(outputPath, text, "utf8");
  console.error(`[tool] Dump exported to: ${outputPath}`);
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
    maxDepth: -1,
    showValues: true,
    compact: false,
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

    if (arg === "-compact" || arg === "--compact") {
      result.compact = true;
      continue;
    }

    if (arg === "-values" || arg === "--values") {
      result.showValues = true;
      continue;
    }

    if (arg === "-no-values" || arg === "--no-values") {
      result.showValues = false;
      continue;
    }

    if (arg === "-depth" || arg === "--depth") {
      const raw = argv[i + 1];
      const depth = raw !== undefined ? Number(raw) : Number.NaN;
      if (!Number.isInteger(depth) || depth < -1) {
        result.error = "Option -depth/--depth requires an integer >= -1.";
      } else {
        result.maxDepth = depth;
        i++;
      }
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
      continue;
    }

    if (arg.startsWith("-")) {
      result.error = `Unknown option: ${arg}`;
    }
  }

  return result;
}

function printUsage() {
  console.log("Usage: dicomdump [options] <dicom-file>");
  console.log("");
  console.log("Dump all DICOM tags in a file");
  console.log("");
  console.log("Options:");
  console.log("  -version, --version    Show version information");
  console.log("  -help, --help          Show this help message");
  console.log("  -depth N               Maximum depth for nested sequences (-1 for unlimited, default: -1)");
  console.log("  -values                Show element values (default: true)");
  console.log("  -no-values             Hide element values");
  console.log("  -compact               Compact output, one line per element");
  console.log("  -o, --out <file>       Write dump output to file");
  console.log("");
  console.log("Examples:");
  console.log("  node tools/dicom-dump/index.mjs image.dcm");
  console.log("  node tools/dicom-dump/index.mjs -depth 2 -compact image.dcm");
}
