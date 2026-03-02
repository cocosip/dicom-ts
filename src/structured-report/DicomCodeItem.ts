import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomSequence } from "../dataset/DicomSequence.js";
import * as DicomTags from "../core/DicomTag.generated.js";
import { DicomStructuredReportException } from "./DicomStructuredReportException.js";

export class DicomCodeItem extends DicomDataset {
  constructor(dataset: DicomDataset);
  constructor(sequence: DicomSequence);
  constructor(value: string, scheme: string, meaning: string, version?: string);
  constructor(
    arg0: DicomDataset | DicomSequence | string,
    scheme?: string,
    meaning?: string,
    version?: string,
  ) {
    if (arg0 instanceof DicomSequence) {
      const first = arg0.items[0];
      if (!first) {
        throw new DicomStructuredReportException("No code item found in sequence.");
      }
      super(first);
      return;
    }

    if (arg0 instanceof DicomDataset) {
      super(arg0);
      return;
    }

    super();
    this.addOrUpdateValue(DicomTags.CodeValue, arg0);
    this.addOrUpdateValue(DicomTags.CodingSchemeDesignator, scheme ?? "");
    this.addOrUpdateValue(DicomTags.CodeMeaning, meaning ?? "");
    if (version !== undefined && version !== null) {
      this.addOrUpdateValue(DicomTags.CodingSchemeVersion, version);
    }
  }

  get value(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.CodeValue, "");
  }

  get scheme(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.CodingSchemeDesignator, "");
  }

  get meaning(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.CodeMeaning, "");
  }

  get version(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.CodingSchemeVersion, "");
  }

  override equals(other: unknown): boolean {
    if (this === other) return true;
    if (!(other instanceof DicomCodeItem)) return false;
    return this.value === other.value && this.scheme === other.scheme && this.version === other.version;
  }

  override toString(): string {
    if (this.version) {
      return `(${this.value},${this.scheme}:${this.version},"${this.meaning}")`;
    }
    return `(${this.value},${this.scheme},"${this.meaning}")`;
  }
}
