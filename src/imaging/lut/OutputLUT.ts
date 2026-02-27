import { ILUT } from "./ILUT.js";

/**
 * Output LUT clamps values to 8-bit range.
 */
export class OutputLUT implements ILUT {
  map(value: number): number {
    return clamp8(value);
  }
}

function clamp8(v: number): number {
  if (v <= 0) return 0;
  if (v >= 255) return 255;
  return v & 0xFF;
}
