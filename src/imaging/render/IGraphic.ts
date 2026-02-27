import type { IImage } from "../IImage.js";
import type { IPipeline } from "./IPipeline.js";

export interface IGraphic {
  render(pipeline: IPipeline, frame: number): IImage;
}
