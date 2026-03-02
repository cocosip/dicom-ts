import type { IImage } from "./IImage.js";
import type { IGraphic } from "./render/IGraphic.js";
import { Color32 } from "./Color32.js";

/**
 * Raw RGBA image representation.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/IImage.cs (RawImage concrete type)
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

  render(components: number, flipX: boolean, flipY: boolean, rotation: number): void {
    if (flipX) this._flipX();
    if (flipY) this._flipY();
    const norm = ((rotation % 360) + 360) % 360;
    if (norm === 90) this._rotate90CW();
    else if (norm === 180) this._rotate180();
    else if (norm === 270) this._rotate270CW();
    void components; // component selection is handled upstream by rendering pipelines
  }

  drawGraphics(_graphics: Iterable<IGraphic>): void {
    // No-op: in the TypeScript adaptation, overlays are applied via OverlayGraphic.apply()
    // rather than through the IGraphic pipeline render path.
  }

  clone(): IImage {
    return new RawImage(this.width, this.height, new Uint8Array(this.pixels), this.bytesPerPixel);
  }

  getPixel(x: number, y: number): Color32 {
    const bpp = this.bytesPerPixel;
    const i = (y * this.width + x) * bpp;
    return new Color32(
      this.pixels[i] ?? 0,
      this.pixels[i + 1] ?? 0,
      this.pixels[i + 2] ?? 0,
      bpp >= 4 ? (this.pixels[i + 3] ?? 255) : 255,
    );
  }

  as<T>(): T {
    return this as unknown as T;
  }

  // ---------------------------------------------------------------------------
  // Private transform helpers (operate on the RGBA pixel buffer in-place)
  // ---------------------------------------------------------------------------

  private _flipX(): void {
    const { width, height, bytesPerPixel: bpp, pixels } = this;
    const tmp = new Uint8Array(bpp);
    for (let y = 0; y < height; y++) {
      let lo = y * width;
      let hi = lo + width - 1;
      while (lo < hi) {
        const loOff = lo * bpp;
        const hiOff = hi * bpp;
        tmp.set(pixels.subarray(loOff, loOff + bpp));
        pixels.copyWithin(loOff, hiOff, hiOff + bpp);
        pixels.set(tmp, hiOff);
        lo++;
        hi--;
      }
    }
  }

  private _flipY(): void {
    const { width, height, bytesPerPixel: bpp, pixels } = this;
    const rowBytes = width * bpp;
    const tmp = new Uint8Array(rowBytes);
    for (let top = 0, bot = height - 1; top < bot; top++, bot--) {
      const topOff = top * rowBytes;
      const botOff = bot * rowBytes;
      tmp.set(pixels.subarray(topOff, topOff + rowBytes));
      pixels.copyWithin(topOff, botOff, botOff + rowBytes);
      pixels.set(tmp, botOff);
    }
  }

  private _rotate90CW(): void {
    const { width, height, bytesPerPixel: bpp, pixels } = this;
    const out = new Uint8Array(width * height * bpp);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const src = (y * width + x) * bpp;
        const dst = (x * height + (height - 1 - y)) * bpp;
        out.set(pixels.subarray(src, src + bpp), dst);
      }
    }
    pixels.set(out);
    (this as { width: number }).width = height;
    (this as { height: number }).height = width;
  }

  private _rotate180(): void {
    const { width, height, bytesPerPixel: bpp, pixels } = this;
    const total = width * height;
    const tmp = new Uint8Array(bpp);
    for (let i = 0, j = total - 1; i < j; i++, j--) {
      const a = i * bpp;
      const b = j * bpp;
      tmp.set(pixels.subarray(a, a + bpp));
      pixels.copyWithin(a, b, b + bpp);
      pixels.set(tmp, b);
    }
  }

  private _rotate270CW(): void {
    const { width, height, bytesPerPixel: bpp, pixels } = this;
    const out = new Uint8Array(width * height * bpp);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const src = (y * width + x) * bpp;
        const dst = ((width - 1 - x) * height + y) * bpp;
        out.set(pixels.subarray(src, src + bpp), dst);
      }
    }
    pixels.set(out);
    (this as { width: number }).width = height;
    (this as { height: number }).height = width;
  }
}
