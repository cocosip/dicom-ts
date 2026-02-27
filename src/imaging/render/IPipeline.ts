import type { IImage } from "../IImage.js";
import type { ImageGraphic } from "./ImageGraphic.js";

export interface IPipeline {
  render(graphic: ImageGraphic, frame: number): IImage;
}
