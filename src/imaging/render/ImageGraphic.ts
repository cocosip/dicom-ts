import { DicomPixelData } from "../DicomPixelData.js";
import type { IImage } from "../IImage.js";
import type { ColorTable } from "../ColorTable.js";
import type { IPipeline } from "./IPipeline.js";
import type { IGraphic } from "./IGraphic.js";

export class ImageGraphic implements IGraphic {
  readonly pixelData: DicomPixelData;
  readonly palette: ColorTable | null;

  constructor(pixelData: DicomPixelData, palette: ColorTable | null = null) {
    this.pixelData = pixelData;
    this.palette = palette;
  }

  render(pipeline: IPipeline, frame: number): IImage {
    return pipeline.render(this, frame);
  }
}
