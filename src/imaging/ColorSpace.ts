import { Color32 } from "./Color32.js";

/**
 * Color space conversions used by DICOM imaging.
 */
export class ColorSpace {
  static ybrFullToRgb(y: number, cb: number, cr: number): Color32 {
    const yf = y;
    const cbf = cb - 128;
    const crf = cr - 128;
    const r = yf + 1.402 * crf;
    const g = yf - 0.344136 * cbf - 0.714136 * crf;
    const b = yf + 1.772 * cbf;
    return new Color32(r, g, b, 255);
  }

  static rgbToYbrFull(r: number, g: number, b: number): [number, number, number] {
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
    const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
    return [clamp8(y), clamp8(cb), clamp8(cr)];
  }

  static ybrFullToRgbBytes(data: Uint8Array, out?: Uint8Array): Uint8Array {
    const count = Math.floor(data.length / 3);
    const dest = out ?? new Uint8Array(count * 3);
    for (let i = 0; i < count; i++) {
      const y = data[i * 3] ?? 0;
      const cb = data[i * 3 + 1] ?? 0;
      const cr = data[i * 3 + 2] ?? 0;
      const c = ColorSpace.ybrFullToRgb(y, cb, cr);
      dest[i * 3] = c.r;
      dest[i * 3 + 1] = c.g;
      dest[i * 3 + 2] = c.b;
    }
    return dest;
  }

  /**
   * Convert YBR_FULL_422 data to RGB (assumes byte order Y1 Y2 Cb Cr per pair).
   */
  static ybrFull422ToRgbBytes(data: Uint8Array, out?: Uint8Array): Uint8Array {
    const pairCount = Math.floor(data.length / 4);
    const dest = out ?? new Uint8Array(pairCount * 6);
    for (let i = 0; i < pairCount; i++) {
      const y1 = data[i * 4] ?? 0;
      const y2 = data[i * 4 + 1] ?? 0;
      const cb = data[i * 4 + 2] ?? 0;
      const cr = data[i * 4 + 3] ?? 0;
      const c1 = ColorSpace.ybrFullToRgb(y1, cb, cr);
      const c2 = ColorSpace.ybrFullToRgb(y2, cb, cr);
      dest[i * 6] = c1.r;
      dest[i * 6 + 1] = c1.g;
      dest[i * 6 + 2] = c1.b;
      dest[i * 6 + 3] = c2.r;
      dest[i * 6 + 4] = c2.g;
      dest[i * 6 + 5] = c2.b;
    }
    return dest;
  }
}

function clamp8(v: number): number {
  if (v <= 0) return 0;
  if (v >= 255) return 255;
  return v & 0xFF;
}
