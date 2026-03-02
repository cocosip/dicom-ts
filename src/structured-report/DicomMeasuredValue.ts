import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomDecimalString } from "../dataset/DicomElement.js";
import { DicomSequence } from "../dataset/DicomSequence.js";
import * as DicomTags from "../core/DicomTag.generated.js";
import { DicomCodeItem } from "./DicomCodeItem.js";
import { DicomStructuredReportException } from "./DicomStructuredReportException.js";

export class DicomMeasuredValue extends DicomDataset {
  constructor(dataset: DicomDataset);
  constructor(sequence: DicomSequence);
  constructor(value: number, units: DicomCodeItem);
  constructor(arg0: DicomDataset | DicomSequence | number, units?: DicomCodeItem) {
    if (arg0 instanceof DicomSequence) {
      const first = arg0.items[0];
      if (!first) {
        throw new DicomStructuredReportException("No measurement item found in sequence.");
      }
      super(first);
      return;
    }

    if (arg0 instanceof DicomDataset) {
      super(arg0);
      return;
    }

    super();
    if (!units) {
      throw new DicomStructuredReportException("Measurement units code is required.");
    }
    this.addOrUpdate(new DicomDecimalString(DicomTags.NumericValue, arg0));
    this.addOrUpdate(new DicomSequence(DicomTags.MeasurementUnitsCodeSequence, units));
  }

  get code(): DicomCodeItem | null {
    return getCodeItem(this, DicomTags.MeasurementUnitsCodeSequence);
  }

  get value(): number {
    const numeric = this.getDicomItem<DicomDecimalString>(DicomTags.NumericValue);
    return numeric?.numericValue ?? 0;
  }

  override toString(): string {
    return `${this.value} ${this.code?.value ?? ""}`.trimEnd();
  }
}

function getCodeItem(dataset: DicomDataset, tag: typeof DicomTags.MeasurementUnitsCodeSequence): DicomCodeItem | null {
  const sequence = dataset.tryGetSequence(tag);
  const first = sequence?.items[0];
  return first ? new DicomCodeItem(first) : null;
}
