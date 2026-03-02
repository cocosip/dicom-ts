import type { Readable, Writable } from "node:stream";
import { DicomFile } from "../DicomFile.js";
import { DicomWriteOptions } from "../io/writer/DicomWriteOptions.js";
import * as DicomTags from "../core/DicomTag.generated.js";
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

  static async open(path: string): Promise<DicomStructuredReport>;
  static async open(stream: Readable): Promise<DicomStructuredReport>;
  static async open(source: string | Readable): Promise<DicomStructuredReport> {
    const file = typeof source === "string"
      ? await DicomFile.open(source)
      : await DicomFile.open(source);
    return new DicomStructuredReport(file.dataset);
  }

  static async openAsync(path: string): Promise<DicomStructuredReport>;
  static async openAsync(stream: Readable): Promise<DicomStructuredReport>;
  static async openAsync(source: string | Readable): Promise<DicomStructuredReport> {
    if (typeof source === "string") {
      return this.open(source);
    }
    return this.open(source);
  }

  async save(path: string): Promise<void>;
  async save(stream: Writable): Promise<void>;
  async save(target: string | Writable): Promise<void> {
    const file = new DicomFile(this.dataset);
    const options = createStructuredReportWriteOptions();
    if (typeof target === "string") {
      await file.save(target, options);
      return;
    }
    await file.save(target, options);
  }

  async saveAsync(path: string): Promise<void>;
  async saveAsync(stream: Writable): Promise<void>;
  async saveAsync(target: string | Writable): Promise<void> {
    if (typeof target === "string") {
      return this.save(target);
    }
    return this.save(target);
  }
}

function createStructuredReportWriteOptions(): DicomWriteOptions {
  const options = new DicomWriteOptions(DicomWriteOptions.Default);
  options.explicitLengthSequenceItems = true;
  options.explicitLengthSequences = true;
  return options;
}
