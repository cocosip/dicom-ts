/**
 * Representation of one DICOM file.
 *
 * Ported from fo-dicom/FO-DICOM.Core/DicomFile.cs
 */
import { open as openFs } from "node:fs/promises";
import type { Readable } from "node:stream";
import type { Writable } from "node:stream";
import { DicomTransferSyntax } from "./core/DicomTransferSyntax.js";
import { DicomFileMetaInformation } from "./DicomFileMetaInformation.js";
import { DicomDataset } from "./dataset/DicomDataset.js";
import { FileByteSource } from "./io/FileByteSource.js";
import { StreamByteSource } from "./io/StreamByteSource.js";
import { FileByteTarget } from "./io/FileByteTarget.js";
import { StreamByteTarget } from "./io/StreamByteTarget.js";
import { DicomFileReader } from "./io/reader/DicomFileReader.js";
import { DicomFileWriter } from "./io/writer/DicomFileWriter.js";
import { FileReadOption } from "./io/FileReadOption.js";
import { DicomFileFormat } from "./DicomFileFormat.js";
import type { DicomWriteOptions } from "./io/writer/DicomWriteOptions.js";

export interface DicomFileOpenOptions {
  readOption?: FileReadOption;
  largeObjectSize?: number;
}

/**
 * DICOM file container.
 */
export class DicomFile {
  fileMetaInfo: DicomFileMetaInformation;
  dataset: DicomDataset;
  format: DicomFileFormat;
  isPartial: boolean;

  constructor();
  constructor(dataset: DicomDataset);
  constructor(arg?: DicomDataset) {
    if (arg) {
      this.dataset = arg;
      this.fileMetaInfo = new DicomFileMetaInformation(arg);
    } else {
      this.dataset = new DicomDataset();
      this.fileMetaInfo = new DicomFileMetaInformation();
    }
    this.format = DicomFileFormat.DICOM3;
    this.isPartial = false;
  }

  static async open(path: string, options?: DicomFileOpenOptions): Promise<DicomFile>;
  static async open(stream: Readable, options?: DicomFileOpenOptions): Promise<DicomFile>;
  static async open(source: string | Readable, options: DicomFileOpenOptions = {}): Promise<DicomFile> {
    if (typeof source === "string") {
      const fileSource = new FileByteSource(source, options.readOption, options.largeObjectSize ?? 0);
      try {
        const result = DicomFileReader.read(fileSource);
        const file = DicomFile.fromReadResult(result);
        file.format = inferFormat(result);
        return file;
      } finally {
        fileSource.close();
      }
    }

    const streamSource = new StreamByteSource(source, options.readOption, options.largeObjectSize ?? 0);
    const result = DicomFileReader.read(streamSource);
    const file = DicomFile.fromReadResult(result);
    file.format = inferFormat(result);
    return file;
  }

  static async openAsync(path: string, options?: DicomFileOpenOptions): Promise<DicomFile>;
  static async openAsync(stream: Readable, options?: DicomFileOpenOptions): Promise<DicomFile>;
  static async openAsync(source: string | Readable, options: DicomFileOpenOptions = {}): Promise<DicomFile> {
    return this.open(source as any, options);
  }

  async save(path: string, options?: DicomWriteOptions): Promise<void>;
  async save(stream: Writable, options?: DicomWriteOptions): Promise<void>;
  async save(target: string | Writable, options?: DicomWriteOptions): Promise<void> {
    this.preprocessFileMetaInformation();
    this.onSave();
    if (typeof target === "string") {
      const fileTarget = new FileByteTarget(target);
      try {
        const writer = new DicomFileWriter(options);
        writer.write(fileTarget, this.fileMetaInfo, this.dataset);
      } finally {
        const stream = fileTarget.asWritableStream();
        const finished = waitForFinish(stream);
        if ("close" in fileTarget && typeof (fileTarget as { close: () => void }).close === "function") {
          (fileTarget as { close: () => void }).close();
        } else {
          stream.end();
        }
        await finished;
      }
      return;
    }

    const streamTarget = new StreamByteTarget(target);
    const writer = new DicomFileWriter(options);
    writer.write(streamTarget, this.fileMetaInfo, this.dataset);
  }

  static async hasValidHeader(path: string): Promise<boolean> {
    try {
      const handle = await openFs(path, "r");
      try {
        const buffer = Buffer.alloc(4);
        const { bytesRead } = await handle.read(buffer, 0, 4, 128);
        if (bytesRead < 4) return false;
        return buffer[0] === 0x44 && buffer[1] === 0x49 && buffer[2] === 0x43 && buffer[3] === 0x4d;
      } finally {
        await handle.close();
      }
    } catch {
      return false;
    }
  }

  toString(): string {
    return `DICOM File [${this.format}]`;
  }

  protected preprocessFileMetaInformation(): void {
    if (this.format === DicomFileFormat.ACRNEMA1 || this.format === DicomFileFormat.ACRNEMA2) {
      throw new Error("Unable to save ACR-NEMA file");
    }

    if (this.format === DicomFileFormat.DICOM3NoFileMetaInfo) {
      this.fileMetaInfo = new DicomFileMetaInformation(this.dataset);
    } else {
      this.fileMetaInfo = new DicomFileMetaInformation(this.fileMetaInfo);
    }

    if (!this.fileMetaInfo.transferSyntaxUID) {
      this.fileMetaInfo.transferSyntaxUID = this.dataset.internalTransferSyntax
        ?? DicomTransferSyntax.ExplicitVRLittleEndian;
    }
  }

  protected onSave(): void {
    // subclasses may override
  }

  private static fromReadResult(result: ReturnType<typeof DicomFileReader.read>): DicomFile {
    const file = new DicomFile();
    file.dataset = result.dataset;
    file.dataset.internalTransferSyntax = result.transferSyntax;
    file.fileMetaInfo = new DicomFileMetaInformation(result.metaInfo);
    return file;
  }
}

function inferFormat(result: ReturnType<typeof DicomFileReader.read>): DicomFileFormat {
  if (result.preamble) return DicomFileFormat.DICOM3;
  if (result.metaInfo.count > 0) return DicomFileFormat.DICOM3NoPreamble;
  return DicomFileFormat.DICOM3NoFileMetaInfo;
}

function waitForFinish(stream: NodeJS.WritableStream): Promise<void> {
  return new Promise((resolve, reject) => {
    stream.once("finish", () => resolve());
    stream.once("error", (err) => reject(err));
  });
}
