import type { ILUT } from "./ILUT.js";

/**
 * Composite LUT — chains multiple ILUTs in sequence.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/LUT/CompositeLUT.cs
 */
export class CompositeLUT implements ILUT {
  private readonly _luts: ILUT[] = [];

  constructor() {}

  get finalLut(): ILUT | undefined {
    return this._luts[this._luts.length - 1];
  }

  add(lut: ILUT): void {
    this._luts.push(lut);
  }

  get minimumOutputValue(): number {
    return this.finalLut?.minimumOutputValue ?? 0;
  }

  get maximumOutputValue(): number {
    return this.finalLut?.maximumOutputValue ?? 0;
  }

  get isValid(): boolean {
    return this._luts.every((l) => l.isValid);
  }

  apply(value: number): number {
    let v = value;
    for (const lut of this._luts) {
      v = lut.apply(v);
    }
    return v;
  }

  recalculate(): void {
    for (const lut of this._luts) {
      lut.recalculate();
    }
  }
}
