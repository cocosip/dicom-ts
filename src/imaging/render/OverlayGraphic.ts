/**
 * Overlay graphic — blends a 1-bit mask (one byte per pixel) over an RGBA image buffer.
 *
 * In C# this class is NOT IGraphic; it is owned by ImageGraphic and called from
 * ImageGraphic.RenderImage().  The TypeScript port follows the same pattern.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Render/OverlayGraphic.cs
 */
export class OverlayGraphic {
  private readonly _originalMask: Uint8Array;
  private readonly _originalWidth: number;
  private readonly _originalHeight: number;
  private readonly _offsetX: number;
  private readonly _offsetY: number;
  /** Packed ARGB color (matches C# `int _color`). */
  private readonly _color: number;

  private _scale: number = 1.0;
  private _scaledMask: Uint8Array | null = null;
  private _scaledWidth: number;
  private _scaledHeight: number;

  /**
   * @param mask       1-byte-per-pixel mask (> 0 = active)
   * @param width      Overlay width in pixels
   * @param height     Overlay height in pixels
   * @param offsetX    0-based column offset in the image
   * @param offsetY    0-based row offset in the image
   * @param color      Packed ARGB color (e.g. 0xFFFF0000 = opaque red)
   */
  constructor(
    mask: Uint8Array,
    width: number,
    height: number,
    offsetX: number,
    offsetY: number,
    color: number,
  ) {
    this._originalMask = mask;
    this._originalWidth = width;
    this._originalHeight = height;
    this._scaledWidth = width;
    this._scaledHeight = height;
    this._offsetX = offsetX;
    this._offsetY = offsetY;
    this._color = color;
    this._scaledMask = mask; // scale=1 → same as original
  }

  /** Update the scale factor; clears the cached scaled mask. */
  scale(factor: number): void {
    if (Math.abs(factor - this._scale) < 1e-9) return;
    this._scale = factor;
    this._scaledMask = null;
  }

  /**
   * Blend the overlay into an RGBA pixel buffer (Uint8Array, 4 bytes per pixel).
   * Matches C# `void Render(int[] pixels, int width, int height)`.
   */
  render(pixels: Uint8Array, imageWidth: number, imageHeight: number): void {
    if (this._scaledMask == null) {
      const result = rescaleMask(
        this._originalMask,
        this._originalWidth,
        this._originalHeight,
        this._scale,
      );
      this._scaledMask = result.mask;
      this._scaledWidth = result.width;
      this._scaledHeight = result.height;
    }

    const mask = this._scaledMask;
    const ox = (this._offsetX * this._scale) | 0;
    const oy = (this._offsetY * this._scale) | 0;

    // Unpack ARGB color
    const cr = (this._color >>> 16) & 0xff;
    const cg = (this._color >>> 8) & 0xff;
    const cb = this._color & 0xff;
    const ca = (this._color >>> 24) & 0xff;

    for (let y = 0; y < this._scaledHeight; y++) {
      if (oy + y >= imageHeight) break;
      for (let x = 0; x < this._scaledWidth; x++) {
        if ((mask[y * this._scaledWidth + x] ?? 0) === 0) continue;
        if (ox + x >= imageWidth) break;
        const p = ((oy + y) * imageWidth + (ox + x)) * 4;
        if (p < 0 || p + 3 >= pixels.length) continue;
        // OR the color channels (matching C#: pixels[p] |= _color)
        pixels[p] = (pixels[p] ?? 0) | cr;
        pixels[p + 1] = (pixels[p + 1] ?? 0) | cg;
        pixels[p + 2] = (pixels[p + 2] ?? 0) | cb;
        pixels[p + 3] = Math.max(pixels[p + 3] ?? 0, ca);
      }
    }
  }
}

// ---------------------------------------------------------------------------

function rescaleMask(
  mask: Uint8Array,
  width: number,
  height: number,
  scale: number,
): { mask: Uint8Array; width: number; height: number } {
  if (Math.abs(scale - 1.0) < 1e-9) return { mask, width, height };
  const newWidth = Math.max(1, Math.round(width * scale));
  const newHeight = Math.max(1, Math.round(height * scale));
  const out = new Uint8Array(newWidth * newHeight);
  for (let y = 0; y < newHeight; y++) {
    const srcY = Math.min(height - 1, Math.floor(y / scale));
    for (let x = 0; x < newWidth; x++) {
      const srcX = Math.min(width - 1, Math.floor(x / scale));
      out[y * newWidth + x] = mask[srcY * width + srcX] ?? 0;
    }
  }
  return { mask: out, width: newWidth, height: newHeight };
}
