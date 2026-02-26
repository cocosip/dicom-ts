/**
 * Abstract base class for all DICOM items.
 *
 * Reference: fo-dicom/FO-DICOM.Core/DicomItem.cs
 */
import { DicomTag } from "../core/DicomTag.js";
import type { DicomVR } from "../core/DicomVR.js";

export abstract class DicomItem {
  readonly tag: DicomTag;

  protected constructor(tag: DicomTag) {
    this.tag = tag;
  }

  /** The Value Representation of this item. */
  abstract get valueRepresentation(): DicomVR;

  /** Compare by tag (for sorted-container ordering). */
  compareTo(other: DicomItem): number {
    return this.tag.compareTo(other.tag);
  }

  toString(): string {
    return `${this.tag} ${this.valueRepresentation}`;
  }

  /** Validate this item; throws on invalid data when validation is enabled. */
  validate(): void {
    // overridden in DicomElement and DicomSequence
  }
}
