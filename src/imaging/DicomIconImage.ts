import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomSequence } from "../dataset/DicomSequence.js";
import { cloneDataset } from "../dataset/DicomDatasetExtensions.js";
import * as Tags from "../core/DicomTag.generated.js";
import { DicomPixelData } from "./DicomPixelData.js";
import { PhotometricInterpretation } from "./PhotometricInterpretation.js";
import { PaletteColorLUT } from "./lut/PaletteColorLUT.js";
import { ImageGraphic } from "./render/ImageGraphic.js";
import { PaletteColorPipeline } from "./render/PaletteColorPipeline.js";
import { GenericGrayscalePipeline } from "./render/GenericGrayscalePipeline.js";
import { GrayscaleRenderOptions } from "./GrayscaleRenderOptions.js";
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

    if (pi === PhotometricInterpretation.PALETTE_COLOR) {
      const pipeline = new PaletteColorPipeline(this.pixelData);
      const lut = pipeline.lut;
      const palette = lut instanceof PaletteColorLUT ? lut : null;
      const graphic = new ImageGraphic(this.pixelData, 0, palette);
      return graphic.renderImage(null);
    }

    const invert = pi === PhotometricInterpretation.MONOCHROME1;
    const options = GrayscaleRenderOptions.fromDataset(this.dataset, 0);
    options.invert = invert;
    const pipeline = new GenericGrayscalePipeline(options);
    const graphic = new ImageGraphic(this.pixelData, 0);
    return graphic.renderImage(pipeline.lut);
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
