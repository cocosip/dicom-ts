import type { ILUT } from "./ILUT.js";

/**
 * Invert LUT — inverts grayscale values over [minValue, maxValue].
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/LUT/InvertLUT.cs
 */
export class InvertLUT implements ILUT {
  readonly minimumOutputValue: number;
  readonly maximumOutputValue: number;

  constructor(minValue: number, maxValue: number) {
    this.minimumOutputValue = minValue;
    this.maximumOutputValue = maxValue;
  }

  get isValid(): boolean {
    return true;
  }

  apply(value: number): number {
    return this.maximumOutputValue - value;
  }

  recalculate(): void {}
}
