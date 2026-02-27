/**
 * 32-bit RGBA color.
 */
export class Color32 {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;

  constructor(r: number, g: number, b: number, a: number = 255) {
    this.r = clamp8(r);
    this.g = clamp8(g);
    this.b = clamp8(b);
    this.a = clamp8(a);
  }

  toRgba(): Uint8Array {
    return new Uint8Array([this.r, this.g, this.b, this.a]);
  }

  static fromRgb(r: number, g: number, b: number): Color32 {
    return new Color32(r, g, b, 255);
  }
}

function clamp8(v: number): number {
  if (v <= 0) return 0;
  if (v >= 255) return 255;
  return v & 0xFF;
}
