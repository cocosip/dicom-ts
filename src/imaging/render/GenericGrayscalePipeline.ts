import type { IPipeline } from "./IPipeline.js";
import type { IImage } from "../IImage.js";
import { RawImage } from "../RawImage.js";
import { PixelDataConverter } from "../PixelDataConverter.js";
import type { ILUT } from "../lut/ILUT.js";
import { ImageGraphic } from "./ImageGraphic.js";

export class GenericGrayscalePipeline implements IPipeline {
  readonly lut: ILUT;

  constructor(lut: ILUT) {
    this.lut = lut;
  }

  render(graphic: ImageGraphic, frame: number): IImage {
    const pixels = PixelDataConverter.convertMonochrome(graphic.pixelData, frame, this.lut);
    return new RawImage(graphic.pixelData.columns, graphic.pixelData.rows, pixels, 4);
  }
}
