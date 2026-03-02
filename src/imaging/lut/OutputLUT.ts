import type { ILUT } from "./ILUT.js";
import type { GrayscaleRenderOptions } from "../GrayscaleRenderOptions.js";

/**
 * Output LUT — maps 0-255 grayscale index to packed ARGB Color32.value via a 256-entry color map.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/LUT/OutputLUT.cs
 */
export class OutputLUT implements ILUT {
  private readonly _options: GrayscaleRenderOptions;

  constructor(options: GrayscaleRenderOptions) {
    this._options = options;
  }

  /** The 256-entry Color32 color map. */
  get colorMap() {
    return this._options.colorMap;
  }

  get minimumOutputValue(): number {
    return -2147483648; // int.MinValue
  }

  get maximumOutputValue(): number {
    return 2147483647; // int.MaxValue
  }

  get isValid(): boolean {
    return this._options != null;
  }

  /** Returns the packed ARGB Color32.value for the given 0-255 input. */
  apply(value: number): number {
    if (value < 0) return this._options.colorMap[0]!.value;
    if (value > 255) return this._options.colorMap[255]!.value;
    return this._options.colorMap[value | 0]!.value;
  }

  recalculate(): void {}
}
