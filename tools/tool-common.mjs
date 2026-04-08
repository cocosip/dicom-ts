import { promises as fs } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

export async function loadDicomTs() {
  try {
    return await import("../dist/esm/index.js");
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
      return await import("../dist/esm/index.js");
    } catch {
      console.error("[tool] Build succeeded but dist/esm still cannot be loaded.");
      return null;
    }
  }
}

export function normalizeAe(value) {
  return String(value ?? "").trim();
}

export function validateAeTitle(dicom, value, optionName) {
  try {
    dicom.DicomValidation.validateAE(value);
    return true;
  } catch (error) {
    console.error(`[tool] Invalid AE title for ${optionName}: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

export function applyValidationMode(dicom, mode) {
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

export function formatStatusHex(value) {
  return `0x${(value & 0xffff).toString(16).toUpperCase().padStart(4, "0")}`;
}

export function formatDicomStatus(dicom, code) {
  const resolved = dicom.DicomStatus.lookup(code);
  return formatResolvedStatus(code, resolved.state, resolved.description || resolved.toString());
}

export function formatResolvedStatus(code, state, description) {
  const hex = formatStatusHex(code);
  const normalizedState = state || "Unknown";
  const normalizedDescription = String(description || "").trim();
  if (!normalizedDescription) {
    return `${hex} ${normalizedState}`;
  }
  if (normalizedDescription.localeCompare(String(normalizedState), undefined, { sensitivity: "accent" }) === 0) {
    return `${hex} ${normalizedState}`;
  }
  return `${hex} ${normalizedState} (${normalizedDescription})`;
}

export function sanitizeFilename(value) {
  return String(value ?? "").replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 180) || "received";
}

export async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function allocateOutputPath(outputDir, baseName) {
  const base = sanitizeFilename(baseName || `received-${Date.now()}`);
  const initial = path.join(outputDir, `${base}.dcm`);
  if (!(await pathExists(initial))) {
    return initial;
  }

  let index = 1;
  while (true) {
    const candidate = path.join(outputDir, `${base}-${index}.dcm`);
    if (!(await pathExists(candidate))) {
      return candidate;
    }
    index += 1;
  }
}

export async function listFiles(rootDir, recursive = true) {
  const output = [];
  await collectFiles(rootDir, recursive, output);
  output.sort((a, b) => a.localeCompare(b));
  return output;
}

async function collectFiles(dirPath, recursive, output) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isFile()) {
      output.push(fullPath);
      continue;
    }
    if (recursive && entry.isDirectory()) {
      await collectFiles(fullPath, recursive, output);
    }
  }
}

export function parseQueryRetrieveLevel(dicom, rawLevel) {
  const value = String(rawLevel ?? "").trim().toLowerCase();
  switch (value) {
    case "patient":
      return dicom.DicomQueryRetrieveLevel.Patient;
    case "study":
      return dicom.DicomQueryRetrieveLevel.Study;
    case "series":
      return dicom.DicomQueryRetrieveLevel.Series;
    case "image":
    case "instance":
      return dicom.DicomQueryRetrieveLevel.Image;
    default:
      throw new Error(`Unsupported query/retrieve level: ${rawLevel}`);
  }
}

export function levelToString(dicom, level) {
  return dicom.queryRetrieveLevelToString(level) ?? "";
}

export function parseTagSpec(dicom, spec) {
  const trimmed = String(spec ?? "").trim();
  const explicit = trimmed.match(/^\(?([0-9a-fA-F]{4}),([0-9a-fA-F]{4})\)?$/);
  if (explicit) {
    return new dicom.DicomTag(parseInt(explicit[1], 16), parseInt(explicit[2], 16));
  }

  const keyword = dicom.DicomDictionary.default.lookupKeyword(trimmed);
  if (!keyword) {
    throw new Error(`Unknown DICOM keyword or tag: ${spec}`);
  }
  return keyword;
}

export function parseKeyValueSpec(dicom, spec) {
  const separator = String(spec).indexOf("=");
  if (separator < 0) {
    throw new Error(`Invalid --key value "${spec}". Expected Keyword=value.`);
  }

  const tagText = spec.slice(0, separator).trim();
  const value = spec.slice(separator + 1);
  const tag = parseTagSpec(dicom, tagText);
  const entry = dicom.DicomDictionary.default.lookup(tag);
  return {
    tag,
    keyword: entry.keyword || tag.toString(),
    value,
  };
}

export async function waitForShutdownSignal(server, label = "scp") {
  await new Promise((resolve) => {
    let stopping = false;

    const shutdown = async (signal) => {
      if (stopping) {
        return;
      }
      stopping = true;
      console.error(`[${label}] ${signal} received, stopping server...`);
      await server.stop();
      console.error(`[${label}] Server stopped.`);
      resolve(undefined);
    };

    process.once("SIGINT", () => {
      void shutdown("SIGINT");
    });
    process.once("SIGTERM", () => {
      void shutdown("SIGTERM");
    });
  });
}
