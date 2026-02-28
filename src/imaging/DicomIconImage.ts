import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomSequence } from "../dataset/DicomSequence.js";
import { cloneDataset } from "../dataset/DicomDatasetExtensions.js";
import * as Tags from "../core/DicomTag.generated.js";
import { DicomPixelData } from "./DicomPixelData.js";
import { PhotometricInterpretation } from "./PhotometricInterpretation.js";
import { ColorTable } from "./ColorTable.js";
import { ImageGraphic } from "./render/ImageGraphic.js";
import { PaletteColorPipeline } from "./render/PaletteColorPipeline.js";
import { GenericGrayscalePipeline } from "./render/GenericGrayscalePipeline.js";
import { ModalityRescaleLUT } from "./lut/ModalityRescaleLUT.js";
import { ModalitySequenceLUT } from "./lut/ModalitySequenceLUT.js";
import { VOILUT } from "./lut/VOILUT.js";
import { CompositeLUT } from "./lut/CompositeLUT.js";
import { OutputLUT } from "./lut/OutputLUT.js";
import type { IImage } from "./IImage.js";

/**
 * DICOM icon image renderer (for Icon Image Sequence).
 */
export class DicomIconImage {
  readonly dataset: DicomDataset;
  readonly pixelData: DicomPixelData;

  constructor(iconImageSequenceItem: DicomDataset) {
    // Keep icon rendering isolated from caller-side dataset mutations.
    this.dataset = cloneDataset(iconImageSequenceItem);
    this.pixelData = DicomPixelData.create(this.dataset);

    const pi = this.pixelData.photometricInterpretation;
    const valid = pi === PhotometricInterpretation.PALETTE_COLOR
      || pi === PhotometricInterpretation.MONOCHROME1
      || pi === PhotometricInterpretation.MONOCHROME2;
    if (!valid) {
      throw new Error(
        "Photometric Interpretation for Icon Image Sequence must be MONOCHROME1, MONOCHROME2 or PALETTE COLOR",
      );
    }
  }

  get width(): number {
    return this.pixelData.columns;
  }

  get height(): number {
    return this.pixelData.rows;
  }

  renderImage(): IImage {
    const pi = this.pixelData.photometricInterpretation ?? PhotometricInterpretation.MONOCHROME2;
    const graphic = new ImageGraphic(
      this.pixelData,
      pi === PhotometricInterpretation.PALETTE_COLOR ? ColorTable.fromDataset(this.dataset) : null,
    );

    if (pi === PhotometricInterpretation.PALETTE_COLOR) {
      const palette = ColorTable.fromDataset(this.dataset);
      if (!palette) throw new Error("Palette color LUT not found for icon image");
      return graphic.render(new PaletteColorPipeline(palette), 0);
    }

    const modality = ModalitySequenceLUT.fromDataset(this.dataset)
      ?? ModalityRescaleLUT.fromDataset(this.dataset);
    const min = modality.map(this.pixelData.bitDepth.minValue);
    const max = modality.map(this.pixelData.bitDepth.maxValue);
    const center = (min + max) / 2;
    const width = Math.max(1, max - min);
    const invert = pi === PhotometricInterpretation.MONOCHROME1;
    const lut = new CompositeLUT(modality, new VOILUT(center, width, invert), new OutputLUT());
    return graphic.render(new GenericGrayscalePipeline(lut), 0);
  }

  static tryCreate(dataset: DicomDataset): DicomIconImage | null {
    const iconSequence = dataset.tryGetSequence(Tags.IconImageSequence);
    if (!(iconSequence instanceof DicomSequence) || iconSequence.items.length !== 1) {
      return null;
    }

    try {
      return new DicomIconImage(iconSequence.items[0]!);
    } catch {
      return null;
    }
  }
}
