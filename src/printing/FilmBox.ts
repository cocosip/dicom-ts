
import * as DicomTags from "../core/DicomTag.generated.js";
import * as DicomUIDs from "../core/DicomUID.generated.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomTransferSyntax } from "../core/DicomTransferSyntax.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomSequence } from "../dataset/DicomSequence.js";
import { DicomUniqueIdentifier } from "../dataset/DicomElement.js";
import type { FilmSession } from "./FilmSession.js";
import { ImageBox } from "./ImageBox.js";
import { PresentationLut } from "./PresentationLut.js";

/**
 * Basic film box.
 */
export class FilmBox extends DicomDataset {
  static readonly SOPClassUID: DicomUID = DicomUIDs.BasicFilmBox;

  readonly filmSession: FilmSession;
  readonly sopInstanceUID: DicomUID;
  readonly basicImageBoxes: ImageBox[] = [];

  constructor(
    filmSession: FilmSession,
    sopInstance: DicomUID | null = null,
    transferSyntax: DicomTransferSyntax = DicomTransferSyntax.ExplicitVRLittleEndian,
    dataset?: DicomDataset,
  ) {
    super(transferSyntax);
    this.filmSession = filmSession;
    this.sopInstanceUID = sopInstance ?? DicomUID.generate();

    this.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPClassUID, FilmBox.SOPClassUID));
    this.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPInstanceUID, this.sopInstanceUID));
    this.addOrUpdate(
      new DicomSequence(
        DicomTags.ReferencedFilmSessionSequence,
        new DicomDataset().add(
          new DicomUniqueIdentifier(DicomTags.ReferencedSOPClassUID, filmSession.sopClassUID),
          new DicomUniqueIdentifier(DicomTags.ReferencedSOPInstanceUID, filmSession.sopInstanceUID),
        ),
      ),
    );

    if (dataset) {
      dataset.copyTo(this);
      this.internalTransferSyntax = dataset.internalTransferSyntax;
    }
  }

  get imageDisplayFormat(): string {
    return this.getSingleValue<string>(DicomTags.ImageDisplayFormat);
  }

  set imageDisplayFormat(value: string) {
    this.addOrUpdateValue(DicomTags.ImageDisplayFormat, value);
  }

  get filmOrientation(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.FilmOrientation, "PORTRAIT");
  }

  set filmOrientation(value: string) {
    this.addOrUpdateValue(DicomTags.FilmOrientation, value);
  }

  get filmSizeID(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.FilmSizeID, "A4");
  }

  set filmSizeID(value: string) {
    this.addOrUpdateValue(DicomTags.FilmSizeID, value);
  }

  get magnificationType(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.MagnificationType, "BILINEAR");
  }

  set magnificationType(value: string) {
    this.addOrUpdateValue(DicomTags.MagnificationType, value);
  }

  get maxDensity(): number {
    return this.getSingleValueOrDefault<number>(DicomTags.MaxDensity, 0);
  }

  set maxDensity(value: number) {
    this.addOrUpdateValue(DicomTags.MaxDensity, value);
  }

  get minDensity(): number {
    return this.getSingleValueOrDefault<number>(DicomTags.MinDensity, 0);
  }

  set minDensity(value: number) {
    this.addOrUpdateValue(DicomTags.MinDensity, value);
  }

  get configurationInformation(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.ConfigurationInformation, "");
  }

  set configurationInformation(value: string) {
    this.addOrUpdateValue(DicomTags.ConfigurationInformation, value);
  }

  get annotationDisplayFormatID(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.AnnotationDisplayFormatID, "");
  }

  set annotationDisplayFormatID(value: string) {
    this.addOrUpdateValue(DicomTags.AnnotationDisplayFormatID, value);
  }

  get smoothingType(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.SmoothingType, "");
  }

  set smoothingType(value: string) {
    this.addOrUpdateValue(DicomTags.SmoothingType, value);
  }

  get borderDensity(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.BorderDensity, "BLACK");
  }

  set borderDensity(value: string) {
    this.addOrUpdateValue(DicomTags.BorderDensity, value);
  }

  get emptyImageDensity(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.EmptyImageDensity, "BLACK");
  }

  set emptyImageDensity(value: string) {
    this.addOrUpdateValue(DicomTags.EmptyImageDensity, value);
  }

  get trim(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.Trim, "NO");
  }

  set trim(value: string) {
    this.addOrUpdateValue(DicomTags.Trim, value);
  }

  get illumination(): number {
    return this.getSingleValueOrDefault<number>(DicomTags.Illumination, 0);
  }

  set illumination(value: number) {
    this.addOrUpdateValue(DicomTags.Illumination, value);
  }

  get reflectedAmbientLight(): number {
    return this.getSingleValueOrDefault<number>(DicomTags.ReflectedAmbientLight, 0);
  }

  set reflectedAmbientLight(value: number) {
    this.addOrUpdateValue(DicomTags.ReflectedAmbientLight, value);
  }

  get requestedResolutionID(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.RequestedResolutionID, "STANDARD");
  }

  set requestedResolutionID(value: string) {
    this.addOrUpdateValue(DicomTags.RequestedResolutionID, value);
  }

  get referencedPresentationLutSequence(): DicomSequence | null {
    return this.tryGetSequence(DicomTags.ReferencedPresentationLUTSequence);
  }

  set referencedPresentationLutSequence(value: DicomSequence | null) {
    if (!value) {
      this.remove(DicomTags.ReferencedPresentationLUTSequence);
      return;
    }
    if (!value.tag.equals(DicomTags.ReferencedPresentationLUTSequence)) {
      throw new Error(`Added sequence must be Referenced Presentation LUT Sequence, is: ${value.tag}`);
    }
    this.addOrUpdate(value);
  }

  get presentationLut(): PresentationLut | null {
    const sequence = this.referencedPresentationLutSequence;
    const item = sequence?.items[0];
    if (!item) return null;
    const uid = item.getSingleValue<string>(DicomTags.ReferencedSOPInstanceUID);
    return this.filmSession.findPresentationLut(DicomUID.parse(uid));
  }

  initialize(): boolean {
    if (!this.contains(DicomTags.ReferencedImageBoxSequence)) {
      this.addOrUpdate(new DicomSequence(DicomTags.ReferencedImageBoxSequence));
    }
    if (!this.contains(DicomTags.FilmOrientation)) this.filmOrientation = "PORTRAIT";
    if (!this.contains(DicomTags.FilmSizeID)) this.filmSizeID = "A4";
    if (!this.contains(DicomTags.MagnificationType)) this.magnificationType = "BILINEAR";
    if (!this.contains(DicomTags.MaxDensity)) this.maxDensity = 0;
    if (!this.contains(DicomTags.MinDensity)) this.minDensity = 0;
    if (!this.contains(DicomTags.BorderDensity)) this.borderDensity = "BLACK";
    if (!this.contains(DicomTags.EmptyImageDensity)) this.emptyImageDensity = "BLACK";
    if (!this.contains(DicomTags.Trim)) this.trim = "NO";
    if (!this.contains(DicomTags.RequestedResolutionID)) this.requestedResolutionID = "STANDARD";

    const displayFormat = this.tryGetString(DicomTags.ImageDisplayFormat);
    if (!displayFormat) return false;

    const parts = displayFormat.split("\\");
    try {
      if (parts[0] === "STANDARD" && parts.length === 2) {
        const [rowsRaw, colsRaw] = parts[1]!.split(",");
        const rows = parseInt(rowsRaw!, 10);
        const cols = parseInt(colsRaw!, 10);
        if (!Number.isFinite(rows) || !Number.isFinite(cols) || rows <= 0 || cols <= 0) return false;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            this.createImageBox();
          }
        }
        return true;
      }

      if ((parts[0] === "ROW" || parts[0] === "COL") && parts.length === 2) {
        const counts = parts[1]!.split(",").map((p) => parseInt(p, 10));
        if (counts.some((n) => !Number.isFinite(n) || n <= 0)) return false;
        for (const count of counts) {
          for (let i = 0; i < count; i++) {
            this.createImageBox();
          }
        }
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }

  clone(): FilmBox {
    const cloned = new FilmBox(this.filmSession.cloneFilmSession(), this.sopInstanceUID, this.internalTransferSyntax, this);
    for (const imageBox of this.basicImageBoxes) {
      cloned.basicImageBoxes.push(imageBox.clone(cloned));
    }
    return cloned;
  }

  findImageBox(sopInstance: DicomUID): ImageBox | null {
    return this.basicImageBoxes.find((image) => image.sopInstanceUID.uid === sopInstance.uid) ?? null;
  }

  isColor(): boolean {
    return this.basicImageBoxes.some((image) => image.sopClassUID.uid === ImageBox.ColorSOPClassUID.uid);
  }

  private createImageBox(): void {
    const classUid = this.filmSession.isColor ? DicomUIDs.BasicColorImageBox : DicomUIDs.BasicGrayscaleImageBox;
    const sopInstance = DicomUID.generate();
    const imageBox = new ImageBox(this, classUid, sopInstance);
    imageBox.imageBoxPosition = this.basicImageBoxes.length + 1;
    this.basicImageBoxes.push(imageBox);

    const referenced = new DicomDataset().add(
      new DicomUniqueIdentifier(DicomTags.ReferencedSOPClassUID, classUid),
      new DicomUniqueIdentifier(DicomTags.ReferencedSOPInstanceUID, sopInstance),
    );
    let sequence = this.tryGetSequence(DicomTags.ReferencedImageBoxSequence);
    if (!sequence) {
      sequence = new DicomSequence(DicomTags.ReferencedImageBoxSequence);
      this.addOrUpdate(sequence);
    }
    sequence.items.push(referenced);
  }
}
