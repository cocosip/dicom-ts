import { IImage } from "./IImage.js";

/**
 * Raw RGBA image representation.
 */
export class RawImage implements IImage {
  readonly width: number;
  readonly height: number;
  readonly bytesPerPixel: number;
  readonly pixels: Uint8Array;

  constructor(width: number, height: number, pixels: Uint8Array, bytesPerPixel: number = 4) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
    this.bytesPerPixel = bytesPerPixel;
  }
}
