import type { ILUT } from "./ILUT.js";

/**
 * Pre-calculated LUT — caches an inner LUT's output over [minValue, maxValue].
 * The table is lazily built on first Recalculate() call (when !isValid).
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/LUT/PrecalculatedLUT.cs
 */
export class PrecalculatedLUT implements ILUT {
  private readonly _lut: ILUT;
  private readonly _minValue: number;
  private readonly _maxValue: number;
  private readonly _offset: number;
  private readonly _table: Int32Array;

  constructor(lut: ILUT, minValue: number, maxValue: number) {
    this._lut = lut;
    this._minValue = minValue;
    this._maxValue = maxValue;
    this._offset = -minValue;
    this._table = new Int32Array(maxValue - minValue + 1);
  }

  get isValid(): boolean {
    return this._lut.isValid;
  }

  get minimumOutputValue(): number {
    return this._lut.minimumOutputValue;
  }

  get maximumOutputValue(): number {
    return this._lut.maximumOutputValue;
  }

  apply(value: number): number {
    const p = (value | 0) + this._offset;
    if (p < 0) return this._table[0]!;
    if (p >= this._table.length) return this._table[this._table.length - 1]!;
    return this._table[p]!;
  }

  recalculate(): void {
    // Force recalculate if needed, but here we assume if we call this, we want to update.
    // If isValid is true, it might mean the inner LUT parameters haven't changed, but we still need to populate our table initially.
    // However, tracking "isPopulated" is better. Or just remove the early return if we want explicit recalculation.
    // But ILUT interface says "Forces recalculation". So it should force it.
    
    this._lut.recalculate();

    for (let i = this._minValue; i <= this._maxValue; i++) {
      this._table[i + this._offset] = this._lut.apply(i) | 0;
    }
  }
}
