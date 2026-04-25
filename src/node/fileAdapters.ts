import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { DicomFile, type DicomFileOpenOptions } from "./DicomFile.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import type { DicomWriteOptions } from "../io/writer/DicomWriteOptions.js";

export async function readDicomFromPath(path: string, options?: DicomFileOpenOptions): Promise<DicomFile> {
  return DicomFile.open(path, options);
}

export async function writeDicomToPath(
  path: string,
  input: DicomFile | DicomDataset,
  options?: DicomWriteOptions,
): Promise<void> {
  if (input instanceof DicomFile) {
    await input.save(path, options);
    return;
  }

  const file = new DicomFile(input);
  await file.save(path, options);
}

export interface ScanDicomDirectoryOptions {
  recursive?: boolean;
  includePattern?: RegExp;
  checkHeader?: boolean;
}

export async function scanDicomDirectory(
  rootPath: string,
  options: ScanDicomDirectoryOptions = {},
): Promise<string[]> {
  const recursive = options.recursive ?? true;
  const pattern = options.includePattern ?? null;
  const checkHeader = options.checkHeader ?? false;

  const out: string[] = [];
  await scan(rootPath, recursive, pattern, checkHeader, out);
  return out;
}

async function scan(
  current: string,
  recursive: boolean,
  pattern: RegExp | null,
  checkHeader: boolean,
  out: string[],
): Promise<void> {
  let entries;
  try {
    entries = await readdir(current, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const name = String(entry.name);
    const fullPath = join(current, name);
    if (entry.isDirectory()) {
      if (recursive) {
        await scan(fullPath, recursive, pattern, checkHeader, out);
      }
      continue;
    }
    if (!entry.isFile()) {
      continue;
    }
    if (pattern && !pattern.test(name)) {
      continue;
    }
    if (checkHeader && !(await DicomFile.hasValidHeader(fullPath))) {
      continue;
    }
    out.push(fullPath);
  }
}
