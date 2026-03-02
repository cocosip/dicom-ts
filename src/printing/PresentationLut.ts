
import * as DicomTags from "../core/DicomTag.generated.js";
import * as DicomUIDs from "../core/DicomUID.generated.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomTransferSyntax } from "../core/DicomTransferSyntax.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomSequence } from "../dataset/DicomSequence.js";
import { DicomUniqueIdentifier, DicomUnsignedShort } from "../dataset/DicomElement.js";

/**
 * Convenience wrapper of a Presentation LUT information object.
 */
export class PresentationLut extends DicomDataset {
  static readonly SopClassUid: DicomUID = DicomUIDs.PresentationLUT;

  readonly sopInstanceUID: DicomUID;

  constructor();
  constructor(sopInstance: DicomUID | null);
  constructor(sopInstance: DicomUID | null, dataset: DicomDataset);
  constructor(sopInstance: DicomUID | null = null, dataset?: DicomDataset) {
    super(DicomTransferSyntax.ExplicitVRLittleEndian);
    if (dataset) {
      dataset.copyTo(this);
      this.internalTransferSyntax = dataset.internalTransferSyntax;
    }

    if (!this.tryGetSequence(DicomTags.PresentationLUTSequence)) {
      this.createLutSequence();
    }

    this.sopInstanceUID = sopInstance ?? DicomUID.generate();
    this.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPClassUID, PresentationLut.SopClassUid));
    this.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPInstanceUID, this.sopInstanceUID));
  }

  get lutSequence(): DicomDataset {
    const sequence = this.getSequence(DicomTags.PresentationLUTSequence);
    const first = sequence.items[0];
    if (!first) {
      throw new Error("Presentation LUT Sequence does not contain any item.");
    }
    return first;
  }

  get lutDescriptor(): number[] {
    return this.lutSequence.getDicomItem<DicomUnsignedShort>(DicomTags.LUTDescriptor)?.values ?? [];
  }

  set lutDescriptor(value: readonly number[]) {
    this.lutSequence.addOrUpdate(new DicomUnsignedShort(DicomTags.LUTDescriptor, ...value.map((v) => v & 0xffff)));
  }

  get lutExplanation(): string {
    return this.lutSequence.getSingleValueOrDefault<string>(DicomTags.LUTExplanation, "");
  }

  set lutExplanation(value: string) {
    this.lutSequence.addOrUpdateValue(DicomTags.LUTExplanation, value);
  }

  get lutData(): number[] {
    return this.lutSequence.getDicomItem<DicomUnsignedShort>(DicomTags.LUTData)?.values ?? [];
  }

  set lutData(value: readonly number[]) {
    this.lutSequence.addOrUpdate(new DicomUnsignedShort(DicomTags.LUTData, ...value.map((v) => v & 0xffff)));
  }

  get presentationLutShape(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.PresentationLUTShape, "");
  }

  set presentationLutShape(value: string) {
    this.addOrUpdateValue(DicomTags.PresentationLUTShape, value);
  }

  private createLutSequence(): void {
    this.addOrUpdate(new DicomSequence(DicomTags.PresentationLUTSequence, new DicomDataset()));
  }
}
