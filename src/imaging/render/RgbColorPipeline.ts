import type { IPipeline } from "./IPipeline.js";
import type { IImage } from "../IImage.js";
import { RawImage } from "../RawImage.js";
import { PixelDataConverter } from "../PixelDataConverter.js";
import { ImageGraphic } from "./ImageGraphic.js";

export class RgbColorPipeline implements IPipeline {
  render(graphic: ImageGraphic, frame: number): IImage {
    const pixels = PixelDataConverter.toRgba(graphic.pixelData, frame, { palette: graphic.palette });
    return new RawImage(graphic.pixelData.columns, graphic.pixelData.rows, pixels, 4);
  }
}
