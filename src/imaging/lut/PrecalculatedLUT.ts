import { ILUT } from "./ILUT.js";

export class PrecalculatedLUT implements ILUT {
  readonly min: number;
  readonly max: number;
  readonly table: Uint8Array;

  constructor(lut: ILUT, min: number, max: number) {
    this.min = min;
    this.max = max;
    const size = Math.max(0, max - min + 1);
    this.table = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
      const v = lut.map(min + i);
      this.table[i] = clamp8(v);
    }
  }

  map(value: number): number {
    if (value <= this.min) return this.table[0] ?? 0;
    if (value >= this.max) return this.table[this.table.length - 1] ?? 0;
    return this.table[value - this.min] ?? 0;
  }
}

function clamp8(v: number): number {
  if (v <= 0) return 0;
  if (v >= 255) return 255;
  return v & 0xFF;
}
