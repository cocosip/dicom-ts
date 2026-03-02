
import { ImageBase } from "./ImageBase.js";
import { IGraphic } from "./render/IGraphic.js";
import { Color32 } from "./Color32.js";

/**
 * Raw RGBA image representation.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/RawImage.cs
 */
export class RawImage extends ImageBase<Uint8Array> {
  private readonly _bytesPerPixel: number;

  constructor(width: number, height: number, pixels: Uint8Array, bytesPerPixel: number = 4) {
    super(width, height, pixels, null);
    this._bytesPerPixel = bytesPerPixel;
  }

  override get bytesPerPixel(): number {
    return this._bytesPerPixel;
  }

  override render(components: number, flipX: boolean, flipY: boolean, rotation: number): void {
    // Use ImageBase.toBytes helper which handles rotation/flip
    // Note: toBytes treats input as Int32Array (ARGB/RGBA 4-byte pixels)
    // We assume pixels are 32-bit (4 bytes) here as per ImageBase assumption
    if (this.bytesPerPixel !== 4) {
      throw new Error("RawImage render only supports 4 bytes per pixel.");
    }

    const w = this._width;
    const h = this._height;
    
    this._image = ImageBase.toBytes(w, h, components, flipX, flipY, rotation, this._pixels);
    
    // In TypeScript implementation, we update the main pixels buffer to reflect the rendered state
    // so that 'pixels' property returns the transformed image.
    this._pixels = this._image;
    
    // Update dimensions if rotated 90 or 270 degrees
    if (rotation % 180 !== 0) {
       (this as any)._width = h;
       (this as any)._height = w;
    }
  }

  override drawGraphics(_graphics: Iterable<IGraphic>): void {
    // No-op: in the TypeScript adaptation, overlays are applied via OverlayGraphic.apply()
    // rather than through the IGraphic pipeline render path.
    // This matches the previous implementation of RawImage.ts
  }

  override clone(): RawImage {
    // Clone current pixels
    const newPixels = new Uint8Array(this._pixels);
    return new RawImage(this._width, this._height, newPixels, this.bytesPerPixel);
  }

  // Override getPixel to use the current _pixels (which might be transformed)
  override getPixel(x: number, y: number): Color32 {
    const bpp = this.bytesPerPixel;
    if (x >= 0 && x < this._width && y >= 0 && y < this._height) {
      const i = (y * this._width + x) * bpp;
      return new Color32(
        this._pixels[i] ?? 0,
        this._pixels[i + 1] ?? 0,
        this._pixels[i + 2] ?? 0,
        bpp >= 4 ? (this._pixels[i + 3] ?? 255) : 255,
      );
    }
    return Color32.Black;
  }
}
