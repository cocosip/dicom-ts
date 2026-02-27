import type { IGraphic } from "./IGraphic.js";
import type { IPipeline } from "./IPipeline.js";
import type { IImage } from "../IImage.js";
import { RawImage } from "../RawImage.js";
import { OverlayGraphic } from "./OverlayGraphic.js";

export class CompositeGraphic implements IGraphic {
  readonly base: IGraphic;
  readonly overlays: OverlayGraphic[];

  constructor(base: IGraphic, overlays: OverlayGraphic[] = []) {
    this.base = base;
    this.overlays = overlays;
  }

  render(pipeline: IPipeline, frame: number): IImage {
    const image = this.base.render(pipeline, frame);
    if (!(image instanceof RawImage)) return image;
    let current = image;
    for (const overlay of this.overlays) {
      current = overlay.apply(current);
    }
    return current;
  }
}
