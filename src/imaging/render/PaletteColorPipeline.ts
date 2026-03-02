import type { IPipeline } from "./IPipeline.js";
import type { ILUT } from "../lut/ILUT.js";
import { DicomPixelData } from "../DicomPixelData.js";
import { PaletteColorLUT } from "../lut/PaletteColorLUT.js";

/**
 * Palette color pipeline — lazily extracts the PaletteColorLUT from the pixel data.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Render/PaletteColorPipeline.cs
 */
export class PaletteColorPipeline implements IPipeline {
  private readonly _pixelData: DicomPixelData;
  private _cachedLUT: ILUT | null = null;

  constructor(pixelData: DicomPixelData) {
    this._pixelData = pixelData;
  }

  get lut(): ILUT | null {
    if (this._cachedLUT == null) {
      this._cachedLUT = PaletteColorLUT.fromDataset(this._pixelData.dataset) ?? null;
    }
    return this._cachedLUT;
  }

  clearCache(): void {
    this._cachedLUT = null;
  }
}
