import type { ILUT } from "./ILUT.js";

/**
 * Padding LUT — remaps pixel padding value to minValue.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/LUT/PaddingLUT.cs
 */
export class PaddingLUT implements ILUT {
  private readonly _paddingValue: number;
  private readonly _minValue: number;
  private readonly _maxValue: number;

  constructor(minValue: number, maxValue: number, paddingValue: number) {
    this._paddingValue = paddingValue;
    this._minValue = minValue;
    this._maxValue = maxValue;
  }

  get pixelPaddingValue(): number {
    return this._paddingValue;
  }

  get minimumOutputValue(): number {
    return this._minValue;
  }

  get maximumOutputValue(): number {
    return this._maxValue;
  }

  get isValid(): boolean {
    return true;
  }

  apply(value: number): number {
    if (value === this._paddingValue) return this._minValue;
    return value;
  }

  recalculate(): void {}
}
