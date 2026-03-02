
import * as DicomTags from "../core/DicomTag.generated.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomTransferSyntax } from "../core/DicomTransferSyntax.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomUniqueIdentifier } from "../dataset/DicomElement.js";
import { FilmBox } from "./FilmBox.js";
import { ImageBox } from "./ImageBox.js";
import { PresentationLut } from "./PresentationLut.js";

/**
 * Basic film session.
 */
export class FilmSession extends DicomDataset {
  readonly sopClassUID: DicomUID;
  readonly sopInstanceUID: DicomUID;
  readonly basicFilmBoxes: FilmBox[] = [];
  readonly presentationLuts: PresentationLut[] = [];
  isColor: boolean;

  constructor(sopClassUID: DicomUID, sopInstance?: DicomUID | null, isColor?: boolean);
  constructor(sopClassUID: DicomUID, sopInstance: DicomUID | null, dataset: DicomDataset, isColor?: boolean);
  constructor(
    sopClassUID: DicomUID,
    sopInstance: DicomUID | null = null,
    datasetOrIsColor: DicomDataset | boolean = false,
    isColor = false,
  ) {
    super(DicomTransferSyntax.ExplicitVRLittleEndian);
    this.sopClassUID = sopClassUID;
    this.sopInstanceUID = sopInstance ?? DicomUID.generate();

    this.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPClassUID, this.sopClassUID));
    this.addOrUpdate(new DicomUniqueIdentifier(DicomTags.SOPInstanceUID, this.sopInstanceUID));

    const dataset = datasetOrIsColor instanceof DicomDataset ? datasetOrIsColor : null;
    this.isColor = typeof datasetOrIsColor === "boolean" ? datasetOrIsColor : isColor;

    if (dataset) {
      dataset.copyTo(this);
      this.internalTransferSyntax = dataset.internalTransferSyntax;
    }
  }

  get filmDestination(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.FilmDestination, "");
  }

  set filmDestination(value: string) {
    this.addOrUpdateValue(DicomTags.FilmDestination, value);
  }

  get filmSessionLabel(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.FilmSessionLabel, "");
  }

  set filmSessionLabel(value: string) {
    this.addOrUpdateValue(DicomTags.FilmSessionLabel, value);
  }

  get memoryAllocation(): number {
    return this.getSingleValueOrDefault<number>(DicomTags.MemoryAllocation, 0);
  }

  set memoryAllocation(value: number) {
    this.addOrUpdateValue(DicomTags.MemoryAllocation, value);
  }

  get mediumType(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.MediumType, "");
  }

  set mediumType(value: string) {
    this.addOrUpdateValue(DicomTags.MediumType, value);
  }

  get printPriority(): string {
    return this.getSingleValueOrDefault<string>(DicomTags.PrintPriority, "");
  }

  set printPriority(value: string) {
    this.addOrUpdateValue(DicomTags.PrintPriority, value);
  }

  get numberOfCopies(): number {
    return this.getSingleValueOrDefault<number>(DicomTags.NumberOfCopies, 1);
  }

  set numberOfCopies(value: number) {
    this.addOrUpdateValue(DicomTags.NumberOfCopies, value);
  }

  createFilmBox(sopInstance: DicomUID | null = null, dataset?: DicomDataset): FilmBox {
    const uid = sopInstance ?? DicomUID.generate();
    const filmBox = new FilmBox(
      this,
      uid,
      dataset?.internalTransferSyntax ?? this.internalTransferSyntax,
      dataset,
    );
    this.basicFilmBoxes.push(filmBox);
    return filmBox;
  }

  deleteFilmBox(sopInstance: DicomUID): boolean {
    const index = this.basicFilmBoxes.findIndex((box) => box.sopInstanceUID.uid === sopInstance.uid);
    if (index < 0) return false;
    this.basicFilmBoxes.splice(index, 1);
    return true;
  }

  findFilmBox(sopInstance: DicomUID): FilmBox | null {
    return this.basicFilmBoxes.find((box) => box.sopInstanceUID.uid === sopInstance.uid) ?? null;
  }

  findImageBox(sopInstance: DicomUID): ImageBox | null {
    for (const filmBox of this.basicFilmBoxes) {
      const image = filmBox.findImageBox(sopInstance);
      if (image) return image;
    }
    return null;
  }

  createPresentationLut(sopInstance: DicomUID | null = null, dataset?: DicomDataset): PresentationLut {
    const uid = sopInstance ?? DicomUID.generate();
    const lut = dataset ? new PresentationLut(uid, dataset) : new PresentationLut(uid);
    this.presentationLuts.push(lut);
    return lut;
  }

  findPresentationLut(sopInstance: DicomUID): PresentationLut | null {
    return this.presentationLuts.find((lut) => lut.sopInstanceUID.uid === sopInstance.uid) ?? null;
  }

  deletePresentationLut(sopInstance: DicomUID): boolean {
    const index = this.presentationLuts.findIndex((lut) => lut.sopInstanceUID.uid === sopInstance.uid);
    if (index < 0) return false;
    this.presentationLuts.splice(index, 1);
    return true;
  }

  cloneFilmSession(): FilmSession {
    return new FilmSession(this.sopClassUID, this.sopInstanceUID, this, this.isColor);
  }
}
