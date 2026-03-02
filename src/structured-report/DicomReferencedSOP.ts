
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomUniqueIdentifier } from "../dataset/DicomElement.js";
import { DicomSequence } from "../dataset/DicomSequence.js";
import { DicomUID } from "../core/DicomUID.js";
import * as DicomTags from "../core/DicomTag.generated.js";
import { DicomStructuredReportException } from "./DicomStructuredReportException.js";

export class DicomReferencedSOP extends DicomDataset {
  constructor(dataset: DicomDataset);
  constructor(sequence: DicomSequence);
  constructor(instance: DicomUID, sopClass: DicomUID);
  constructor(arg0: DicomDataset | DicomSequence | DicomUID, sopClass?: DicomUID) {
    if (arg0 instanceof DicomSequence) {
      const first = arg0.items[0];
      if (!first) {
        throw new DicomStructuredReportException("No referenced SOP pair item found in sequence.");
      }
      super(first);
      return;
    }

    if (arg0 instanceof DicomDataset) {
      super(arg0);
      return;
    }

    if (!sopClass) {
      throw new DicomStructuredReportException("Referenced SOP Class UID is required.");
    }

    super();
    this.addOrUpdate(new DicomUniqueIdentifier(DicomTags.ReferencedSOPInstanceUID, arg0));
    this.addOrUpdate(new DicomUniqueIdentifier(DicomTags.ReferencedSOPClassUID, sopClass));
  }

  get instance(): DicomUID | null {
    return this.getDicomItem<DicomUniqueIdentifier>(DicomTags.ReferencedSOPInstanceUID)?.uidValue ?? null;
  }

  get sopClass(): DicomUID | null {
    return this.getDicomItem<DicomUniqueIdentifier>(DicomTags.ReferencedSOPClassUID)?.uidValue ?? null;
  }
}
