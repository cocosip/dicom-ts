import type { Readable, Writable } from "node:stream";
import {
  DicomFile as CoreDicomFile,
  type BrowserDicomFileSaveTarget,
  type DicomFileOpenOptions,
} from "../DicomFile.js";
import type { DicomWriteOptions } from "../io/writer/DicomWriteOptions.js";
import {
  hasValidHeaderNode,
  openNodeDicomFile,
  saveNodeDicomFile,
} from "./DicomFileNodeAdapter.js";

export type { BrowserDicomFileSaveTarget, DicomFileOpenOptions } from "../DicomFile.js";

export class DicomFile extends CoreDicomFile {
  static override async open(source: unknown, options: DicomFileOpenOptions = {}): Promise<DicomFile> {
    if (typeof source === "string" || isNodeReadableLike(source)) {
      return await openNodeDicomFile(source, options, this as typeof CoreDicomFile) as DicomFile;
    }

    const opened = await CoreDicomFile.open(source, options);
    return this.fromCore(opened);
  }

  static override async openAsync(source: unknown, options: DicomFileOpenOptions = {}): Promise<DicomFile> {
    return this.open(source, options);
  }

  static override async openFromFile(file: { arrayBuffer(): Promise<ArrayBuffer> }, options: DicomFileOpenOptions = {}): Promise<DicomFile> {
    const opened = await CoreDicomFile.openFromFile(file, options);
    return this.fromCore(opened);
  }

  static override async openFromBlob(source: { arrayBuffer(): Promise<ArrayBuffer> }, options: DicomFileOpenOptions = {}): Promise<DicomFile> {
    const opened = await CoreDicomFile.openFromBlob(source, options);
    return this.fromCore(opened);
  }

  static override async openFromArrayBuffer(source: ArrayBuffer, options: DicomFileOpenOptions = {}): Promise<DicomFile> {
    const opened = await CoreDicomFile.openFromArrayBuffer(source, options);
    return this.fromCore(opened);
  }

  static override openFromBytes(source: Uint8Array, options: DicomFileOpenOptions = {}): DicomFile {
    const opened = CoreDicomFile.openFromBytes(source, options);
    return this.fromCore(opened);
  }

  static override async hasValidHeader(path: string): Promise<boolean> {
    return hasValidHeaderNode(path);
  }

  static fromCore(file: CoreDicomFile): DicomFile {
    const nodeFile = new this();
    nodeFile.dataset = file.dataset;
    nodeFile.fileMetaInfo = file.fileMetaInfo;
    nodeFile.format = file.format;
    nodeFile.isPartial = file.isPartial;
    return nodeFile;
  }

  override async save(path: string, options?: DicomWriteOptions): Promise<void>;
  override async save(stream: Writable, options?: DicomWriteOptions): Promise<void>;
  override async save(options?: DicomWriteOptions): Promise<Uint8Array>;
  override async save(target: BrowserDicomFileSaveTarget, options?: DicomWriteOptions): Promise<void>;
  override async save(
    targetOrOptions?: string | Writable | BrowserDicomFileSaveTarget | DicomWriteOptions,
    options?: DicomWriteOptions,
  ): Promise<Uint8Array | void> {
    if (typeof targetOrOptions === "string" || isNodeWritableLike(targetOrOptions)) {
      await saveNodeDicomFile(this, targetOrOptions, options);
      return;
    }

    return (super.save as (
      targetOrOptions?: BrowserDicomFileSaveTarget | DicomWriteOptions,
      options?: DicomWriteOptions,
    ) => Promise<Uint8Array | void>)(targetOrOptions as BrowserDicomFileSaveTarget | DicomWriteOptions | undefined, options);
  }
}

function isNodeReadableLike(value: unknown): value is Readable {
  return !!value
    && typeof value === "object"
    && typeof (value as { read?: unknown }).read === "function";
}

function isNodeWritableLike(value: unknown): value is Writable {
  return !!value
    && typeof value === "object"
    && typeof (value as { write?: unknown }).write === "function";
}
