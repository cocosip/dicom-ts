/**
 * DICOM Dictionary Entry — metadata for a single DICOM tag.
 *
 * Reference: fo-dicom/FO-DICOM.Core/DicomDictionaryEntry.cs
 */
import { DicomTag, DicomMaskedTag } from "./DicomTag.js";
import { DicomVR } from "./DicomVR.js";
import { DicomVM } from "./DicomVM.js";

export class DicomDictionaryEntry {
  /** The canonical tag (masked bits zeroed). */
  readonly tag: DicomTag;
  /** Non-null when this entry matches a range of tags (e.g. (60xx,3000)). */
  readonly maskTag: DicomMaskedTag | null;
  /** Human-readable name (e.g. "Patient Name"). */
  readonly name: string;
  /** DICOM keyword / identifier (e.g. "PatientName"). */
  readonly keyword: string;
  /** Allowed value representations, in priority order. */
  readonly valueRepresentations: readonly DicomVR[];
  /** Value multiplicity constraint. */
  readonly valueMultiplicity: DicomVM;
  /** True if the tag is retired in the current DICOM standard. */
  readonly isRetired: boolean;

  constructor(
    tag: DicomTag | DicomMaskedTag,
    name: string,
    keyword: string,
    vm: DicomVM,
    retired: boolean,
    ...vrs: DicomVR[]
  ) {
    if (tag instanceof DicomMaskedTag) {
      this.tag = tag.tag;
      this.maskTag = tag;
    } else {
      this.tag = tag;
      this.maskTag = null;
    }

    this.name = name?.trim() || this.tag.toString();
    this.keyword = keyword?.trim() || this.name;
    this.valueMultiplicity = vm;
    this.valueRepresentations = vrs;
    this.isRetired = retired;
  }

  /** First (primary) VR for this entry, or UN if none registered. */
  get vr(): DicomVR {
    return this.valueRepresentations[0] ?? DicomVR.UN;
  }

  /** True if this entry represents a masked (range) tag. */
  get isMasked(): boolean {
    return this.maskTag !== null;
  }

  /** Test whether the given tag matches this entry (masked or exact). */
  matches(tag: DicomTag): boolean {
    if (this.maskTag !== null) return this.maskTag.isMatch(tag);
    return this.tag.equals(tag);
  }
}
