import { ILUT } from "./ILUT.js";

export class InvertLUT implements ILUT {
  map(value: number): number {
    const v = clamp8(value);
    return 255 - v;
  }
}

function clamp8(v: number): number {
  if (v <= 0) return 0;
  if (v >= 255) return 255;
  return v & 0xFF;
}
