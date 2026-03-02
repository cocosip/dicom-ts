/**
 * 32-bit ARGB color, matching fo-dicom's Color32 struct.
 *
 * NOTE: fo-dicom constructor order is (a, r, g, b).  This TypeScript
 * adaptation keeps (r, g, b, a) to stay consistent with the rest of the
 * imaging pipeline that uses RGBA ordering.  Use `Color32.fromArgb` or
 * `Color32.fromValue` when ARGB semantics are required.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Color32.cs
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

  /**
   * Packed ARGB int32 value (alpha in the high byte, matching fo-dicom Color32.Value).
   * Bit layout: AARRGGBB
   */
  get value(): number {
    return ((this.a << 24) | (this.r << 16) | (this.g << 8) | this.b) >>> 0;
  }

  toRgba(): Uint8Array {
    return new Uint8Array([this.r, this.g, this.b, this.a]);
  }

  /** Create from RGBA components (same as constructor). */
  static fromRgb(r: number, g: number, b: number): Color32 {
    return new Color32(r, g, b, 255);
  }

  /** Create from fo-dicom constructor order (a, r, g, b). */
  static fromArgb(a: number, r: number, g: number, b: number): Color32 {
    return new Color32(r, g, b, a);
  }

  /** Create from a packed ARGB int32 (matches fo-dicom Color32(int c) constructor). */
  static fromValue(value: number): Color32 {
    const v = value >>> 0;
    const a = (v >>> 24) & 0xff;
    const r = (v >>> 16) & 0xff;
    const g = (v >>> 8) & 0xff;
    const b = v & 0xff;
    return new Color32(r, g, b, a);
  }

  static readonly Black: Color32 = new Color32(0, 0, 0, 255);
  static readonly White: Color32 = new Color32(255, 255, 255, 255);
}

function clamp8(v: number): number {
  if (v <= 0) return 0;
  if (v >= 255) return 255;
  return v & 0xff;
}
