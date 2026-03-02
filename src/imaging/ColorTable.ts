import { Color32 } from "./Color32.js";
import { readFile, writeFile } from "node:fs/promises";

/**
 * Convenience class for managing color look-up tables with 256 color items.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/ColorTable.cs
 */
export class ColorTable {
  /** Look-up table representing MONOCHROME1 grayscale scheme (inverted: white→black). */
  static readonly Monochrome1: Color32[] = initGrayscaleLut(true);

  /** Look-up table representing MONOCHROME2 grayscale scheme (normal: black→white). */
  static readonly Monochrome2: Color32[] = initGrayscaleLut(false);

  /** Returns the reverse of an existing color table. */
  static reverse(lut: Color32[]): Color32[] {
    const clone = [...lut];
    clone.reverse();
    return clone;
  }

  /**
   * Load color look-up table from file.
   * File must be exactly 256*3 bytes in planar RGB format (R plane, G plane, B plane).
   */
  static async loadLut(path: string): Promise<Color32[] | null> {
    try {
      const data = await readFile(path);
      if (data.length !== 256 * 3) return null;
      const lut: Color32[] = new Array(256);
      for (let i = 0; i < 256; i++) {
        lut[i] = new Color32(data[i]!, data[i + 256]!, data[i + 512]!, 255);
      }
      return lut;
    } catch {
      return null;
    }
  }

  /**
   * Save color look-up table to file.
   * Written as planar RGB (R plane, G plane, B plane), 256*3 bytes.
   */
  static async saveLut(path: string, lut: Color32[]): Promise<void> {
    if (lut.length !== 256) return;
    const data = new Uint8Array(256 * 3);
    for (let i = 0; i < 256; i++) {
      data[i] = lut[i]!.r;
      data[i + 256] = lut[i]!.g;
      data[i + 512] = lut[i]!.b;
    }
    await writeFile(path, data);
  }
}

function initGrayscaleLut(reverse: boolean): Color32[] {
  const lut = new Array<Color32>(256);
  for (let i = 0; i < 256; i++) {
    const b = reverse ? (255 - i) : i;
    lut[i] = new Color32(b, b, b, 255);
  }
  return lut;
}
