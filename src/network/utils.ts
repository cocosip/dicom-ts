import { DicomTag } from "../core/DicomTag.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomUniqueIdentifier } from "../dataset/DicomElement.js";

export function getUid(dataset: DicomDataset, tag: DicomTag): DicomUID | null {
  return dataset.getDicomItem<DicomUniqueIdentifier>(tag)?.uidValue ?? null;
}

export function setUid(dataset: DicomDataset, tag: DicomTag, uid: DicomUID | null): void {
  if (!uid) {
    dataset.remove(tag);
    return;
  }
  dataset.addOrUpdate(new DicomUniqueIdentifier(tag, uid));
}
