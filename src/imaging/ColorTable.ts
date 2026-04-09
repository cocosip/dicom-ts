import { Color32 } from "./Color32.js";
import { createRuntimeCapabilityError } from "../runtime/RuntimeCapabilityError.js";

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

  static async loadLut(path: string): Promise<Color32[] | null> {
    if (!_fileIo) {
      throw createRuntimeCapabilityError(
        "COLORTABLE_FILE_IO_UNSUPPORTED",
        "ColorTable file I/O is not available in this runtime. Register a ColorTable file adapter first."
      );
    }
    return _fileIo.load(path);
  }

  static async saveLut(path: string, lut: Color32[]): Promise<void> {
    if (!_fileIo) {
      throw createRuntimeCapabilityError(
        "COLORTABLE_FILE_IO_UNSUPPORTED",
        "ColorTable file I/O is not available in this runtime. Register a ColorTable file adapter first."
      );
    }
    await _fileIo.save(path, lut);
  }
}

export interface ColorTableFileIo {
  load(path: string): Promise<Color32[] | null>;
  save(path: string, lut: Color32[]): Promise<void>;
}

let _fileIo: ColorTableFileIo | null = null;

export function registerColorTableFileIo(adapter: ColorTableFileIo): void {
  _fileIo = adapter;
}

function initGrayscaleLut(reverse: boolean): Color32[] {
  const lut = new Array<Color32>(256);
  for (let i = 0; i < 256; i++) {
    const b = reverse ? (255 - i) : i;
    lut[i] = new Color32(b, b, b, 255);
  }
  return lut;
}
