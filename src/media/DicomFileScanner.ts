/**
 * DICOM file scanner for directory trees.
 *
 * Ported from fo-dicom/FO-DICOM.Core/Media/DicomFileScanner.cs
 */
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { DicomFile } from "../DicomFile.js";

export type DicomScanProgressCallback = (scanner: DicomFileScanner, directory: string, count: number) => void;
export type DicomScanFileFoundCallback = (scanner: DicomFileScanner, file: DicomFile, fileName: string) => void;
export type DicomScanCompleteCallback = (scanner: DicomFileScanner) => void;

export class DicomFileScanner {
  private readonly pattern: RegExp | null;
  private readonly recursive: boolean;
  private stopFlag = false;
  private count = 0;

  progressOnDirectoryChange = true;
  progressFilesCount = 10;
  checkForValidHeader = false;

  onProgress?: DicomScanProgressCallback;
  onFileFound?: DicomScanFileFoundCallback;
  onComplete?: DicomScanCompleteCallback;

  constructor(pattern: RegExp | string | null = null, recursive = true) {
    this.pattern = typeof pattern === "string" ? globToRegExp(pattern) : pattern;
    this.recursive = recursive;
  }

  start(directory: string): void {
    this.stopFlag = false;
    this.count = 0;
    void this.scanProc(directory);
  }

  stop(): void {
    this.stopFlag = true;
  }

  private async scanProc(directory: string): Promise<void> {
    await this.scanDirectory(directory);
    this.onComplete?.(this);
  }

  private async scanDirectory(path: string): Promise<void> {
    if (this.stopFlag) return;

    if (this.progressOnDirectoryChange) {
      this.onProgress?.(this, path, this.count);
    }

    let entries;
    try {
      entries = await readdir(path, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (this.stopFlag) return;
      const fullPath = join(path, entry.name);

      if (entry.isDirectory()) {
        if (this.recursive) {
          await this.scanDirectory(fullPath);
        }
        continue;
      }

      if (!entry.isFile()) continue;
      if (this.pattern && !this.pattern.test(entry.name)) continue;

      await this.scanFile(fullPath);
      this.count += 1;

      if (this.progressFilesCount > 0 && (this.count % this.progressFilesCount) === 0) {
        this.onProgress?.(this, path, this.count);
      }
    }
  }

  private async scanFile(filePath: string): Promise<void> {
    try {
      if (this.checkForValidHeader) {
        const hasHeader = await DicomFile.hasValidHeader(filePath);
        if (!hasHeader) return;
      }
      const file = await DicomFile.open(filePath);
      this.onFileFound?.(this, file, filePath);
    } catch {
      // ignore
    }
  }
}

function globToRegExp(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  const regex = escaped.replace(/\*/g, ".*").replace(/\?/g, ".");
  return new RegExp(`^${regex}$`, "i");
}
