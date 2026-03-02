import * as DicomTags from "../core/DicomTag.generated.js";
import * as DicomUIDs from "../core/DicomUID.generated.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomTransferSyntax } from "../core/DicomTransferSyntax.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomSequence } from "../dataset/DicomSequence.js";
import { DicomUniqueIdentifier } from "../dataset/DicomElement.js";
import type { FilmBox } from "./FilmBox.js";

/**
 * Basic color or grayscale image box.
 */
export class ImageBox extends DicomDataset {
  static readonly ColorSOPClassUID: DicomUID = DicomUIDs.BasicColorImageBox;
  static readonly GraySOPClassUID: DicomUID = DicomUIDs.BasicGrayscaleImageBox;

  readonly filmBox: FilmBox;
  readonly sopClassUID: DicomUID;
  readonly sopInstanceUID: DicomUID;

  constructor(filmBox: FilmBox, sopClass: DicomUID, sopInstance: DicomUID | null = null, dataset?: DicomDataset) {
    super(DicomTransferSyntax.ExplicitVRLittleEndian);
    this.filmBox = filmBox;
    this.sopClassUID = sopClass;
    this.sopInstanceUID = sopInstance ?? DicomUID.generate();

    this.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPClassUID, this.sopClassUID));
    this.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPInstanceUID, this.sopInstanceUID));

    if (dataset) {
      dataset.copyTo(this);
      this.internalTransferSyntax = dataset.internalTransferSyntax;
    }
  }

  get imageSequence(): DicomDataset | null {
    let sequence: DicomSequence | null = null;
    if (this.sopClassUID.equals(ImageBox.ColorSOPClassUID) || this.contains(DicomTags.BasicColorImageSequence)) {
      sequence = this.tryGetSequence(DicomTags.BasicColorImageSequence);
    }
    if (!sequence) {
      sequence = this.tryGetSequence(DicomTags.BasicGrayscaleImageSequence);
    }
    return sequence?.items[0] ?? null;
  }

  set imageSequence(value: DicomDataset | null) {
    if (!value) {
      return;
    }
    if (this.sopClassUID.equals(ImageBox.ColorSOPClassUID)) {
      this.addOrUpdate(new DicomSequence(DicomTags.BasicColorImageSequence, value));
    } else {
      this.addOrUpdate(new DicomSequence(DicomTags.BasicGrayscaleImageSequence, value));
    }
  }

  get imageBoxPosition(): number {
    return this.getSingleValueOrDefault<number>(DicomTags.ImageBoxPosition, 1);
  }

  set imageBoxPosition(value: number) {
    this.addOrUpdateValue(DicomTags.ImageBoxPosition, value);
  }

  get polarity(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.Polarity, "NORMAL");
  }

  set polarity(value: string) {
    this.addOrUpdateValue(DicomTags.Polarity, value);
  }

  get magnificationType(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.MagnificationType, this.filmBox.magnificationType);
  }

  set magnificationType(value: string) {
    this.addOrUpdateValue(DicomTags.MagnificationType, value);
  }

  get smoothingType(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.SmoothingType, this.filmBox.smoothingType);
  }

  set smoothingType(value: string) {
    this.addOrUpdateValue(DicomTags.SmoothingType, value);
  }

  get maxDensity(): number {
    return this.getSingleValueOrDefault<number>(DicomTags.MaxDensity, this.filmBox.maxDensity);
  }

  set maxDensity(value: number) {
    this.addOrUpdateValue(DicomTags.MaxDensity, value);
  }

  get minDensity(): number {
    return this.getSingleValueOrDefault<number>(DicomTags.MinDensity, this.filmBox.minDensity);
  }

  set minDensity(value: number) {
    this.addOrUpdateValue(DicomTags.MinDensity, value);
  }

  get configurationInformation(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.ConfigurationInformation, this.filmBox.configurationInformation);
  }

  set configurationInformation(value: string) {
    this.addOrUpdateValue(DicomTags.ConfigurationInformation, value);
  }

  get requestedImageSize(): number {
    return this.getSingleValueOrDefault<number>(DicomTags.RequestedImageSize, 0);
  }

  set requestedImageSize(value: number) {
    this.addOrUpdateValue(DicomTags.RequestedImageSize, value);
  }

  get requestedDecimateCropBehavior(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.RequestedDecimateCropBehavior, "DECIMATE");
  }

  set requestedDecimateCropBehavior(value: string) {
    this.addOrUpdateValue(DicomTags.RequestedDecimateCropBehavior, value);
  }

  clone(filmBox: FilmBox): ImageBox {
    return new ImageBox(filmBox, this.sopClassUID, this.sopInstanceUID, this);
  }
}
