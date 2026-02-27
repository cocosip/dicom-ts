import { RawImage } from "./RawImage.js";

export class RawImageManager {
  static create(width: number, height: number, pixels: Uint8Array, bytesPerPixel: number = 4): RawImage {
    return new RawImage(width, height, pixels, bytesPerPixel);
  }

  static createBlank(width: number, height: number, color: [number, number, number, number] = [0, 0, 0, 255]): RawImage {
    const pixels = new Uint8Array(width * height * 4);
    for (let i = 0; i < width * height; i++) {
      pixels[i * 4] = color[0] & 0xFF;
      pixels[i * 4 + 1] = color[1] & 0xFF;
      pixels[i * 4 + 2] = color[2] & 0xFF;
      pixels[i * 4 + 3] = color[3] & 0xFF;
    }
    return new RawImage(width, height, pixels, 4);
  }
}
