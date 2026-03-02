import type { IImageManager } from "./IImageManager.js";
import { RawImage } from "./RawImage.js";

/**
 * RGBA byte-array implementation of IImageManager.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/RawImageManager.cs
 */
export class RawImageManager implements IImageManager {
  /** Create a blank (zeroed) RGBA image of the given dimensions. */
  createImage(width: number, height: number): RawImage {
    return new RawImage(width, height, new Uint8Array(width * height * 4));
  }

  /** Create a RawImage from an existing pixel buffer (TypeScript extension). */
  static create(width: number, height: number, pixels: Uint8Array, bytesPerPixel: number = 4): RawImage {
    return new RawImage(width, height, pixels, bytesPerPixel);
  }

  /** Create a blank image filled with the given RGBA color (TypeScript extension). */
  static createBlank(width: number, height: number, color: [number, number, number, number] = [0, 0, 0, 255]): RawImage {
    const pixels = new Uint8Array(width * height * 4);
    for (let i = 0; i < width * height; i++) {
      pixels[i * 4] = color[0] & 0xff;
      pixels[i * 4 + 1] = color[1] & 0xff;
      pixels[i * 4 + 2] = color[2] & 0xff;
      pixels[i * 4 + 3] = color[3] & 0xff;
    }
    return new RawImage(width, height, pixels, 4);
  }

  /** Singleton instance. */
  static readonly instance: RawImageManager = new RawImageManager();
}
