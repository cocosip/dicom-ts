import {
  DicomFile,
  type BlobLike,
  type BrowserDicomFileSaveTarget,
} from "../DicomFile.js";
import { DicomWriteOptions } from "../io/writer/DicomWriteOptions.js";
import * as DicomTags from "../core/DicomTag.generated.js";
import { createRuntimeCapabilityError } from "../runtime/RuntimeCapabilityError.js";
import { DicomContentItem, DicomContinuity, DicomRelationship } from "./DicomContentItem.js";
import { DicomCodeItem } from "./DicomCodeItem.js";

export class DicomStructuredReport extends DicomContentItem {
  constructor(dataset: import("../dataset/DicomDataset.js").DicomDataset);
  constructor(code: DicomCodeItem, ...items: DicomContentItem[]);
  constructor(
    arg0: import("../dataset/DicomDataset.js").DicomDataset | DicomCodeItem,
    ...items: DicomContentItem[]
  ) {
    if (arg0 instanceof DicomCodeItem) {
      super(arg0, DicomRelationship.Contains, DicomContinuity.Separate, ...items);
      this.dataset.remove(DicomTags.RelationshipType);
      return;
    }
    super(arg0);
  }

  static async open(source: Uint8Array): Promise<DicomStructuredReport>;
  static async open(source: ArrayBuffer): Promise<DicomStructuredReport>;
  static async open(source: ArrayBufferView): Promise<DicomStructuredReport>;
  static async open(source: BlobLike): Promise<DicomStructuredReport>;
  static async open(source: unknown): Promise<DicomStructuredReport> {
    if (typeof source === "string" || isNodeReadableLike(source)) {
      throw createRuntimeCapabilityError(
        "DICOMSR_NODE_IO_UNSUPPORTED",
        "Node file/stream structured-report open is only available from the dicom-ts-node entrypoint."
      );
    }
    const file = await DicomFile.open(source);
    return new DicomStructuredReport(file.dataset);
  }

  static async openAsync(source: Uint8Array): Promise<DicomStructuredReport>;
  static async openAsync(source: ArrayBuffer): Promise<DicomStructuredReport>;
  static async openAsync(source: ArrayBufferView): Promise<DicomStructuredReport>;
  static async openAsync(source: BlobLike): Promise<DicomStructuredReport>;
  static async openAsync(source: unknown): Promise<DicomStructuredReport> {
    return this.open(source as any);
  }

  async save(options?: DicomWriteOptions): Promise<Uint8Array>;
  async save(target: BrowserDicomFileSaveTarget, options?: DicomWriteOptions): Promise<void>;
  async save(
    targetOrOptions?: BrowserDicomFileSaveTarget | DicomWriteOptions,
    options?: DicomWriteOptions,
  ): Promise<Uint8Array | void> {
    if (typeof targetOrOptions === "string" || isNodeWritableLike(targetOrOptions)) {
      throw createRuntimeCapabilityError(
        "DICOMSR_NODE_IO_UNSUPPORTED",
        "Node file/stream structured-report save is only available from the dicom-ts-node entrypoint."
      );
    }

    const file = new DicomFile(this.dataset);
    const writeOptions = createStructuredReportWriteOptions(options);
    if (isBrowserSaveTarget(targetOrOptions)) {
      await file.save(targetOrOptions, writeOptions);
      return;
    }
    return await file.save(writeOptions);
  }

  async saveAsync(options?: DicomWriteOptions): Promise<Uint8Array>;
  async saveAsync(target: BrowserDicomFileSaveTarget, options?: DicomWriteOptions): Promise<void>;
  async saveAsync(
    targetOrOptions?: BrowserDicomFileSaveTarget | DicomWriteOptions,
    options?: DicomWriteOptions,
  ): Promise<Uint8Array | void> {
    return this.save(targetOrOptions as any, options);
  }
}

export function createStructuredReportWriteOptions(base?: DicomWriteOptions): DicomWriteOptions {
  const options = new DicomWriteOptions(base ?? DicomWriteOptions.Default);
  options.explicitLengthSequenceItems = true;
  options.explicitLengthSequences = true;
  return options;
}

function isBrowserSaveTarget(value: unknown): value is BrowserDicomFileSaveTarget {
  return !!value
    && typeof value === "object"
    && typeof (value as BrowserDicomFileSaveTarget).write === "function";
}

function isNodeReadableLike(value: unknown): boolean {
  return !!value
    && typeof value === "object"
    && typeof (value as { read?: unknown }).read === "function";
}

function isNodeWritableLike(value: unknown): boolean {
  return !!value
    && typeof value === "object"
    && typeof (value as { write?: unknown }).write === "function"
    && !isBrowserSaveTarget(value);
}
