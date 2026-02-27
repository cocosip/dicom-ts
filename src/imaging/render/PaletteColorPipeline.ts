import type { IPipeline } from "./IPipeline.js";
import type { IImage } from "../IImage.js";
import { RawImage } from "../RawImage.js";
import { PixelDataConverter } from "../PixelDataConverter.js";
import { ColorTable } from "../ColorTable.js";
import { ImageGraphic } from "./ImageGraphic.js";

export class PaletteColorPipeline implements IPipeline {
  readonly palette: ColorTable;

  constructor(palette: ColorTable) {
    this.palette = palette;
  }

  render(graphic: ImageGraphic, frame: number): IImage {
    const pixels = PixelDataConverter.convertPalette(graphic.pixelData, frame, this.palette);
    return new RawImage(graphic.pixelData.columns, graphic.pixelData.rows, pixels, 4);
  }
}
