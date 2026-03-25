import { DicomPixelData } from "../DicomPixelData.js";
import { PixelDataConverter } from "../PixelDataConverter.js";
import { RawImage } from "../RawImage.js";
import { PhotometricInterpretation } from "../PhotometricInterpretation.js";
import type { PaletteColorLUT } from "../lut/PaletteColorLUT.js";
import type { ILUT } from "../lut/ILUT.js";
import type { IImage } from "../IImage.js";
import type { IGraphic } from "./IGraphic.js";
import { OverlayGraphic } from "./OverlayGraphic.js";

/**
 * The Image Graphic implementation of IGraphic.
 * Manages transformation state (scale / rotation / flip) and renders via PixelDataConverter.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Render/ImageGraphic.cs
 */
export class ImageGraphic implements IGraphic {
  readonly pixelData: DicomPixelData;
  readonly frame: number;

  protected _scaleFactor: number = 1.0;
  protected _rotation: number = 0;
  protected _flipX: boolean = false;
  protected _flipY: boolean = false;
  protected _offsetX: number = 0;
  protected _offsetY: number = 0;
  protected _zOrder: number = 255;
  protected _overlays: OverlayGraphic[] = [];

  private readonly _palette: PaletteColorLUT | null;

  constructor(pixelData: DicomPixelData, frame: number = 0, palette: PaletteColorLUT | null = null) {
    this.pixelData = pixelData;
    this.frame = frame;
    this._palette = palette;
    this.scale(1.0);
  }

  /** Number of pixel components: 1 for grayscale/palette, 3 for RGB-like, 4 for ARGB. */
  get components(): number {
    const pi = this.pixelData.photometricInterpretation;
    if (pi === PhotometricInterpretation.ARGB) {
      return 4;
    }
    if (
      pi === PhotometricInterpretation.RGB
      || pi === PhotometricInterpretation.YBR_FULL
      || pi === PhotometricInterpretation.YBR_FULL_422
      || pi === PhotometricInterpretation.YBR_ICT
      || pi === PhotometricInterpretation.YBR_RCT
    ) {
      return 3;
    }
    return 1;
  }

  // ---------------------------------------------------------------------------
  // IGraphic properties
  // ---------------------------------------------------------------------------

  get originalWidth(): number { return this.pixelData.columns; }
  get originalHeight(): number { return this.pixelData.rows; }
  get originalOffsetX(): number { return this._offsetX; }
  get originalOffsetY(): number { return this._offsetY; }

  get scaleFactor(): number { return this._scaleFactor; }

  get scaledWidth(): number { return Math.round(this.originalWidth * this._scaleFactor); }
  get scaledHeight(): number { return Math.round(this.originalHeight * this._scaleFactor); }
  get scaledOffsetX(): number { return (this._offsetX * this._scaleFactor) | 0; }
  get scaledOffsetY(): number { return (this._offsetY * this._scaleFactor) | 0; }

  get zOrder(): number { return this._zOrder; }
  set zOrder(value: number) { this._zOrder = value; }

  // ---------------------------------------------------------------------------
  // IGraphic transformation methods
  // ---------------------------------------------------------------------------

  reset(): void {
    this.scale(1.0);
    this._rotation = 0;
    this._flipX = false;
    this._flipY = false;
  }

  scale(factor: number): void {
    if (Math.abs(factor - this._scaleFactor) < 1e-9) return;
    this._scaleFactor = factor;
    for (const overlay of this._overlays) overlay.scale(factor);
  }

  bestFit(width: number, height: number): void {
    const xF = width / this.originalWidth;
    const yF = height / this.originalHeight;
    this.scale(Math.min(xF, yF));
  }

  rotate(angle: number): void {
    if (angle > 0) {
      if (angle <= 90) this._rotation += 90;
      else if (angle <= 180) this._rotation += 180;
      else if (angle <= 270) this._rotation += 270;
    } else if (angle < 0) {
      if (angle >= -90) this._rotation -= 90;
      else if (angle >= -180) this._rotation -= 180;
      else if (angle >= -270) this._rotation -= 270;
    }
    this._rotation = this._rotation % 360;
  }

  flipX(): void { this._flipX = !this._flipX; }

  flipY(): void { this._flipY = !this._flipY; }

  transform(factor: number, rotation: number, flipX: boolean, flipY: boolean): void {
    this.scale(factor);
    this.rotate(rotation);
    this._flipX = flipX;
    this._flipY = flipY;
  }

  // ---------------------------------------------------------------------------
  // Overlay management
  // ---------------------------------------------------------------------------

  addOverlay(overlay: OverlayGraphic): void {
    this._overlays.push(overlay);
    overlay.scale(this._scaleFactor);
  }

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------

  renderImage(lut: ILUT | null): IImage {
    // Ensure LUT is calculated before use (matches C# ImageGraphic.RenderImage)
    if (lut != null && !lut.isValid) lut.recalculate();

    // 1. Convert pixel data to RGBA for this frame
    let rgba: Uint8Array;
    if (this._palette != null) {
      rgba = PixelDataConverter.convertPalette(this.pixelData, this.frame, this._palette);
    } else if (lut != null) {
      rgba = PixelDataConverter.convertMonochrome(this.pixelData, this.frame, lut);
    } else {
      rgba = PixelDataConverter.toRgba(this.pixelData, this.frame, {});
    }

    // 2. Scale if needed
    let image = new RawImage(this.originalWidth, this.originalHeight, rgba, 4);
    if (Math.abs(this._scaleFactor - 1.0) > 1e-9) {
      image = scaleNearest(image, this._scaleFactor);
    }

    // 3. Apply overlays
    if (this._overlays.length > 0) {
      const pixels = image.pixels;
      for (const overlay of this._overlays) {
        overlay.render(pixels, image.width, image.height);
      }
    }

    // 4. Apply flip / rotation
    image.render(this.components, this._flipX, this._flipY, this._rotation);

    return image;
  }
}

// ---------------------------------------------------------------------------
// Nearest-neighbour scale helper
// ---------------------------------------------------------------------------

function scaleNearest(image: RawImage, scale: number): RawImage {
  const factor = Math.max(0.01, scale);
  const newWidth = Math.max(1, Math.round(image.width * factor));
  const newHeight = Math.max(1, Math.round(image.height * factor));
  const out = new Uint8Array(newWidth * newHeight * 4);
  for (let y = 0; y < newHeight; y++) {
    const srcY = Math.min(image.height - 1, Math.floor(y / factor));
    for (let x = 0; x < newWidth; x++) {
      const srcX = Math.min(image.width - 1, Math.floor(x / factor));
      const srcIdx = (srcY * image.width + srcX) * 4;
      const dstIdx = (y * newWidth + x) * 4;
      out[dstIdx] = image.pixels[srcIdx] ?? 0;
      out[dstIdx + 1] = image.pixels[srcIdx + 1] ?? 0;
      out[dstIdx + 2] = image.pixels[srcIdx + 2] ?? 0;
      out[dstIdx + 3] = image.pixels[srcIdx + 3] ?? 255;
    }
  }
  return new RawImage(newWidth, newHeight, out, 4);
}
