import type { Readable, Writable } from "node:stream";
import {
  DicomStructuredReport as CoreDicomStructuredReport,
  createStructuredReportWriteOptions,
} from "../../structured-report/DicomStructuredReport.js";
import type { DicomCodeItem } from "../../structured-report/DicomCodeItem.js";
import type { DicomContentItem } from "../../structured-report/DicomContentItem.js";
import type { DicomDataset } from "../../dataset/DicomDataset.js";
import type { BlobLike } from "../../DicomFile.js";
import { DicomFile, type BrowserDicomFileSaveTarget } from "../DicomFile.js";
import type { DicomWriteOptions } from "../../io/writer/DicomWriteOptions.js";

export class DicomStructuredReport extends CoreDicomStructuredReport {
  constructor(dataset: DicomDataset);
  constructor(code: DicomCodeItem, ...items: DicomContentItem[]);
  constructor(arg0: DicomDataset | DicomCodeItem, ...items: DicomContentItem[]) {
    super(arg0 as any, ...items);
  }

  static override async open(source: Uint8Array): Promise<DicomStructuredReport>;
  static override async open(source: ArrayBuffer): Promise<DicomStructuredReport>;
  static override async open(source: ArrayBufferView): Promise<DicomStructuredReport>;
  static override async open(source: BlobLike): Promise<DicomStructuredReport>;
  static override async open(path: string): Promise<DicomStructuredReport>;
  static override async open(stream: Readable): Promise<DicomStructuredReport>;
  static override async open(source: unknown): Promise<DicomStructuredReport> {
    const file = await DicomFile.open(source);
    return new DicomStructuredReport(file.dataset);
  }

  static override async openAsync(source: Uint8Array): Promise<DicomStructuredReport>;
  static override async openAsync(source: ArrayBuffer): Promise<DicomStructuredReport>;
  static override async openAsync(source: ArrayBufferView): Promise<DicomStructuredReport>;
  static override async openAsync(source: BlobLike): Promise<DicomStructuredReport>;
  static override async openAsync(path: string): Promise<DicomStructuredReport>;
  static override async openAsync(stream: Readable): Promise<DicomStructuredReport>;
  static override async openAsync(source: unknown): Promise<DicomStructuredReport> {
    return this.open(source as any);
  }

  override async save(path: string, options?: DicomWriteOptions): Promise<void>;
  override async save(stream: Writable, options?: DicomWriteOptions): Promise<void>;
  override async save(options?: DicomWriteOptions): Promise<Uint8Array>;
  override async save(target: BrowserDicomFileSaveTarget, options?: DicomWriteOptions): Promise<void>;
  override async save(
    targetOrOptions?: string | Writable | BrowserDicomFileSaveTarget | DicomWriteOptions,
    options?: DicomWriteOptions,
  ): Promise<Uint8Array | void> {
    const writeOptions = createStructuredReportWriteOptions(options);
    const file = new DicomFile(this.dataset);
    if (typeof targetOrOptions === "string" || isNodeWritableLike(targetOrOptions)) {
      await (file.save as (target: string | Writable, options?: DicomWriteOptions) => Promise<void>)(
        targetOrOptions,
        writeOptions,
      );
      return;
    }

    return await (super.save as (
      targetOrOptions?: BrowserDicomFileSaveTarget | DicomWriteOptions,
      options?: DicomWriteOptions,
    ) => Promise<Uint8Array | void>)(targetOrOptions as BrowserDicomFileSaveTarget | DicomWriteOptions | undefined, options);
  }

  override async saveAsync(path: string, options?: DicomWriteOptions): Promise<void>;
  override async saveAsync(stream: Writable, options?: DicomWriteOptions): Promise<void>;
  override async saveAsync(options?: DicomWriteOptions): Promise<Uint8Array>;
  override async saveAsync(target: BrowserDicomFileSaveTarget, options?: DicomWriteOptions): Promise<void>;
  override async saveAsync(
    targetOrOptions?: string | Writable | BrowserDicomFileSaveTarget | DicomWriteOptions,
    options?: DicomWriteOptions,
  ): Promise<Uint8Array | void> {
    return this.save(targetOrOptions as any, options);
  }
}

function isNodeWritableLike(value: unknown): value is Writable {
  return !!value
    && typeof value === "object"
    && typeof (value as { write?: unknown }).write === "function"
    && (
      typeof (value as { end?: unknown }).end === "function"
      || typeof (value as { on?: unknown }).on === "function"
    );
}
