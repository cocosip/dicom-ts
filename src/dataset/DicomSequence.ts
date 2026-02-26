/**
 * DICOM Sequence (SQ) — a nested list of DicomDataset items.
 *
 * Reference: fo-dicom/FO-DICOM.Core/DicomSequence.cs
 */
import { DicomTag } from "../core/DicomTag.js";
import { DicomVR } from "../core/DicomVR.js";
import { DicomItem } from "./DicomItem.js";
import type { DicomDataset } from "./DicomDataset.js";

/**
 * A DICOM Sequence item — contains an ordered list of `DicomDataset` objects.
 */
export class DicomSequence extends DicomItem implements Iterable<DicomDataset> {
  readonly items: DicomDataset[];

  constructor(tag: DicomTag, ...items: DicomDataset[]) {
    super(tag);
    this.items = [...items];
  }

  override get valueRepresentation(): DicomVR {
    return DicomVR.SQ;
  }

  override validate(): void {
    for (const ds of this.items) {
      if (typeof ds?.validate === "function") ds.validate();
    }
  }

  [Symbol.iterator](): Iterator<DicomDataset> {
    return this.items[Symbol.iterator]();
  }
}
