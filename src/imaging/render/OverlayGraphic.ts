import type { IGraphic } from "./IGraphic.js";
import type { IPipeline } from "./IPipeline.js";
import type { IImage } from "../IImage.js";
import { RawImage } from "../RawImage.js";
import { Color32 } from "../Color32.js";

/**
 * Simple overlay graphic (1-bit mask + color).
 */
export class OverlayGraphic implements IGraphic {
  readonly width: number;
  readonly height: number;
  readonly mask: Uint8Array;
  readonly color: Color32;

  constructor(width: number, height: number, mask: Uint8Array, color: Color32) {
    this.width = width;
    this.height = height;
    this.mask = mask;
    this.color = color;
  }

  render(_pipeline: IPipeline, _frame: number): IImage {
    throw new Error("OverlayGraphic cannot render without a base image");
  }

  apply(image: RawImage): RawImage {
    const pixels = new Uint8Array(image.pixels);
    const count = Math.min(this.mask.length, this.width * this.height);
    for (let i = 0; i < count; i++) {
      if ((this.mask[i] ?? 0) === 0) continue;
      const o = i * 4;
      pixels[o] = this.color.r;
      pixels[o + 1] = this.color.g;
      pixels[o + 2] = this.color.b;
      pixels[o + 3] = this.color.a;
    }
    return new RawImage(image.width, image.height, pixels, image.bytesPerPixel);
  }
}
