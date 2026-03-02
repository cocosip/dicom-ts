import { Endian } from "../core/DicomTransferSyntax.js";
import { MemoryByteBuffer } from "../io/buffer/MemoryByteBuffer.js";
import type { IByteBuffer } from "../io/buffer/IByteBuffer.js";
import { DicomPixelData } from "./DicomPixelData.js";
import { PhotometricInterpretation, isMonochrome } from "./PhotometricInterpretation.js";
import { PlanarConfiguration } from "./PlanarConfiguration.js";
import { PaletteColorLUT } from "./lut/PaletteColorLUT.js";
import type { ILUT } from "./lut/ILUT.js";
import { PixelRepresentation } from "./PixelRepresentation.js";

export interface RgbaConversionOptions {
  lut?: ILUT;
  palette?: PaletteColorLUT | null;
}

/**
 * Pixel data conversion helpers — interleaved/planar, YBR color space, and bit reversal.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/PixelDataConverter.cs
 */
export class PixelDataConverter {

  // ---------------------------------------------------------------------------
  // C#-aligned buffer conversion methods (IByteBuffer in → IByteBuffer out)
  // ---------------------------------------------------------------------------

  /**
   * Convert 24-bit pixels from interleaved (RGB…) to planar (RRR…GGG…BBB…).
   * Reference: PixelDataConverter.InterleavedToPlanar24
   */
  static interleavedToPlanar24(data: IByteBuffer): IByteBuffer {
    const src = data.data;
    const dst = new Uint8Array(src.length);
    const pixelCount = Math.floor(src.length / 3);
    for (let n = 0; n < pixelCount; n++) {
      dst[n] = src[n * 3]!;
      dst[n + pixelCount] = src[n * 3 + 1]!;
      dst[n + pixelCount * 2] = src[n * 3 + 2]!;
    }
    return new MemoryByteBuffer(dst);
  }

  /**
   * Convert 24-bit pixels from planar (RRR…GGG…BBB…) to interleaved (RGB…).
   * Reference: PixelDataConverter.PlanarToInterleaved24
   */
  static planarToInterleaved24(data: IByteBuffer): IByteBuffer {
    const src = data.data;
    const dst = new Uint8Array(src.length);
    const pixelCount = Math.floor(src.length / 3);
    for (let n = 0; n < pixelCount; n++) {
      dst[n * 3] = src[n]!;
      dst[n * 3 + 1] = src[n + pixelCount]!;
      dst[n * 3 + 2] = src[n + pixelCount * 2]!;
    }
    return new MemoryByteBuffer(dst);
  }

  /**
   * Convert YBR_FULL photometric interpretation pixels to RGB (buffer form).
   * Reference: PixelDataConverter.YbrFullToRgb
   */
  static ybrFullToRgb(data: IByteBuffer): IByteBuffer {
    const src = data.data;
    const dst = new Uint8Array(src.length);
    for (let n = 0; n < src.length; n += 3) {
      const y = src[n]!;
      const cb = src[n + 1]!;
      const cr = src[n + 2]!;
      dst[n] = toByte(y + 1.4020 * (cr - 128) + 0.5);
      dst[n + 1] = toByte(y - 0.3441 * (cb - 128) - 0.7141 * (cr - 128) + 0.5);
      dst[n + 2] = toByte(y + 1.7720 * (cb - 128) + 0.5);
    }
    return new MemoryByteBuffer(dst);
  }

  /**
   * Convert YBR_FULL_422 photometric interpretation pixels to RGB (buffer form).
   * Handles uneven-width images (Issue #471).
   * Reference: PixelDataConverter.YbrFull422ToRgb
   */
  static ybrFull422ToRgb(data: IByteBuffer, width: number): IByteBuffer {
    const src = data.data;
    const dst = new Uint8Array(Math.floor(src.length / 4) * 2 * 3);
    let n = 0;
    let p = 0;
    let col = 0;
    while (n < src.length) {
      const y1 = src[n++]!;
      const y2 = src[n++]!;
      const cb = src[n++]!;
      const cr = src[n++]!;
      dst[p++] = toByte(y1 + 1.4020 * (cr - 128) + 0.5);
      dst[p++] = toByte(y1 - 0.3441 * (cb - 128) - 0.7141 * (cr - 128) + 0.5);
      dst[p++] = toByte(y1 + 1.7720 * (cb - 128) + 0.5);
      if (++col === width) { col = 0; continue; }
      dst[p++] = toByte(y2 + 1.4020 * (cr - 128) + 0.5);
      dst[p++] = toByte(y2 - 0.3441 * (cb - 128) - 0.7141 * (cr - 128) + 0.5);
      dst[p++] = toByte(y2 + 1.7720 * (cb - 128) + 0.5);
      if (++col === width) col = 0;
    }
    return new MemoryByteBuffer(dst);
  }

  /**
   * Convert YBR_PARTIAL_422 photometric interpretation pixels to RGB (buffer form).
   * Handles uneven-width images (Issue #471).
   * Reference: PixelDataConverter.YbrPartial422ToRgb
   */
  static ybrPartial422ToRgb(data: IByteBuffer, width: number): IByteBuffer {
    const src = data.data;
    const dst = new Uint8Array(Math.floor(src.length / 4) * 2 * 3);
    let n = 0;
    let p = 0;
    let col = 0;
    while (n < src.length) {
      const y1 = src[n++]!;
      const y2 = src[n++]!;
      const cb = src[n++]!;
      const cr = src[n++]!;
      dst[p++] = toByte(1.1644 * (y1 - 16) + 1.5960 * (cr - 128) + 0.5);
      dst[p++] = toByte(1.1644 * (y1 - 16) - 0.3917 * (cb - 128) - 0.8130 * (cr - 128) + 0.5);
      dst[p++] = toByte(1.1644 * (y1 - 16) + 2.0173 * (cb - 128) + 0.5);
      if (++col === width) { col = 0; continue; }
      dst[p++] = toByte(1.1644 * (y2 - 16) + 1.5960 * (cr - 128) + 0.5);
      dst[p++] = toByte(1.1644 * (y2 - 16) - 0.3917 * (cb - 128) - 0.8130 * (cr - 128) + 0.5);
      dst[p++] = toByte(1.1644 * (y2 - 16) + 2.0173 * (cb - 128) + 0.5);
      if (++col === width) col = 0;
    }
    return new MemoryByteBuffer(dst);
  }

  /**
   * Reverse bits for each byte in the buffer.
   * Reference: PixelDataConverter.ReverseBits
   */
  static reverseBits(data: IByteBuffer): IByteBuffer {
    const src = data.data;
    const dst = new Uint8Array(src.length);
    for (let n = 0; n < src.length; n++) {
      dst[n] = BIT_REVERSE_TABLE[src[n]!]!;
    }
    return new MemoryByteBuffer(dst);
  }

  // ---------------------------------------------------------------------------
  // TypeScript-specific helpers: DicomPixelData → RGBA Uint8Array
  // ---------------------------------------------------------------------------

  static toRgba(pixelData: DicomPixelData, frame: number, options: RgbaConversionOptions = {}): Uint8Array {
    const pi = pixelData.photometricInterpretation ?? PhotometricInterpretation.MONOCHROME2;
    if (isMonochrome(pi)) {
      return PixelDataConverter.convertMonochrome(pixelData, frame, options.lut);
    }
    if (pi === PhotometricInterpretation.RGB) {
      return PixelDataConverter.convertRgb(pixelData, frame);
    }
    if (pi === PhotometricInterpretation.YBR_FULL) {
      return PixelDataConverter.convertYbrFull(pixelData, frame);
    }
    if (pi === PhotometricInterpretation.YBR_FULL_422) {
      return PixelDataConverter.convertYbrFull422(pixelData, frame);
    }
    if (pi === PhotometricInterpretation.PALETTE_COLOR) {
      if (!options.palette) throw new Error("Palette color LUT not provided");
      return PixelDataConverter.convertPalette(pixelData, frame, options.palette);
    }
    throw new Error(`Unsupported photometric interpretation: ${pi}`);
  }

  static convertMonochrome(pixelData: DicomPixelData, frame: number, lut?: ILUT): Uint8Array {
    const values = readSamples(pixelData, frame);
    const out = new Uint8Array(values.length * 4);
    for (let i = 0; i < values.length; i++) {
      const o = i * 4;
      if (lut) {
        // LUT pipeline ends with OutputLUT which returns packed ARGB Color32.value
        const packed = lut.apply(values[i]!) >>> 0;
        out[o]     = (packed >>> 16) & 0xff; // R
        out[o + 1] = (packed >>>  8) & 0xff; // G
        out[o + 2] =  packed         & 0xff; // B
        out[o + 3] = (packed >>> 24) & 0xff; // A
      } else {
        const v = clamp8(values[i]!);
        out[o] = v;
        out[o + 1] = v;
        out[o + 2] = v;
        out[o + 3] = 255;
      }
    }
    return out;
  }

  static convertRgb(pixelData: DicomPixelData, frame: number): Uint8Array {
    const bytes = pixelData.getFrame(frame).data;
    const count = pixelData.rows * pixelData.columns;
    const out = new Uint8Array(count * 4);
    if (pixelData.planarConfiguration === PlanarConfiguration.Planar) {
      const planeSize = count;
      for (let i = 0; i < count; i++) {
        const o = i * 4;
        out[o] = bytes[i] ?? 0;
        out[o + 1] = bytes[i + planeSize] ?? 0;
        out[o + 2] = bytes[i + planeSize * 2] ?? 0;
        out[o + 3] = 255;
      }
      return out;
    }
    for (let i = 0; i < count; i++) {
      const o = i * 4;
      out[o] = bytes[i * 3] ?? 0;
      out[o + 1] = bytes[i * 3 + 1] ?? 0;
      out[o + 2] = bytes[i * 3 + 2] ?? 0;
      out[o + 3] = 255;
    }
    return out;
  }

  static convertYbrFull(pixelData: DicomPixelData, frame: number): Uint8Array {
    const bytes = pixelData.getFrame(frame).data;
    const count = pixelData.rows * pixelData.columns;
    const out = new Uint8Array(count * 4);
    for (let i = 0; i < count; i++) {
      const y = bytes[i * 3] ?? 0;
      const cb = bytes[i * 3 + 1] ?? 0;
      const cr = bytes[i * 3 + 2] ?? 0;
      const o = i * 4;
      out[o] = toByte(y + 1.4020 * (cr - 128) + 0.5);
      out[o + 1] = toByte(y - 0.3441 * (cb - 128) - 0.7141 * (cr - 128) + 0.5);
      out[o + 2] = toByte(y + 1.7720 * (cb - 128) + 0.5);
      out[o + 3] = 255;
    }
    return out;
  }

  static convertYbrFull422(pixelData: DicomPixelData, frame: number): Uint8Array {
    const bytes = pixelData.getFrame(frame).data;
    const width = pixelData.columns;
    const count = pixelData.rows * width;
    const out = new Uint8Array(count * 4);
    let outIndex = 0;
    let col = 0;
    for (let i = 0; i < bytes.length; i += 4) {
      const y1 = bytes[i] ?? 0;
      const y2 = bytes[i + 1] ?? 0;
      const cb = bytes[i + 2] ?? 0;
      const cr = bytes[i + 3] ?? 0;
      if (outIndex + 3 < out.length) {
        out[outIndex++] = toByte(y1 + 1.4020 * (cr - 128) + 0.5);
        out[outIndex++] = toByte(y1 - 0.3441 * (cb - 128) - 0.7141 * (cr - 128) + 0.5);
        out[outIndex++] = toByte(y1 + 1.7720 * (cb - 128) + 0.5);
        out[outIndex++] = 255;
      }
      if (++col === width) { col = 0; continue; }
      if (outIndex + 3 < out.length) {
        out[outIndex++] = toByte(y2 + 1.4020 * (cr - 128) + 0.5);
        out[outIndex++] = toByte(y2 - 0.3441 * (cb - 128) - 0.7141 * (cr - 128) + 0.5);
        out[outIndex++] = toByte(y2 + 1.7720 * (cb - 128) + 0.5);
        out[outIndex++] = 255;
      }
      if (++col === width) col = 0;
    }
    return out;
  }

  static convertPalette(pixelData: DicomPixelData, frame: number, palette: PaletteColorLUT): Uint8Array {
    const values = readSamples(pixelData, frame);
    const out = new Uint8Array(values.length * 4);
    for (let i = 0; i < values.length; i++) {
      // palette.apply() returns packed ARGB Color32.value
      const packed = palette.apply(values[i]!) >>> 0;
      const o = i * 4;
      out[o]     = (packed >>> 16) & 0xff; // R
      out[o + 1] = (packed >>>  8) & 0xff; // G
      out[o + 2] =  packed         & 0xff; // B
      out[o + 3] = (packed >>> 24) & 0xff; // A
    }
    return out;
  }
}

// =============================================================================
// Module-level helpers
// =============================================================================

function toByte(x: number): number {
  return x < 0 ? 0 : x > 255 ? 255 : x & 0xff;
}

function clamp8(v: number): number {
  if (v <= 0) return 0;
  if (v >= 255) return 255;
  return v & 0xff;
}

function readSamples(pixelData: DicomPixelData, frame: number): number[] {
  const bytes = pixelData.getFrame(frame).data;
  const bits = pixelData.bitsAllocated;
  const signed = pixelData.pixelRepresentation === PixelRepresentation.Signed;
  const endian = pixelData.dataset.internalTransferSyntax.swapPixelData
    ? Endian.Big
    : pixelData.dataset.internalTransferSyntax.endian;
  const little = endian === Endian.Little;

  if (bits === 8) {
    const out = new Array<number>(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      const v = bytes[i] ?? 0;
      out[i] = signed ? (v << 24) >> 24 : v;
    }
    return out;
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const count = Math.floor(bytes.length / (bits / 8));
  const out = new Array<number>(count);
  for (let i = 0; i < count; i++) {
    const offset = i * (bits / 8);
    let v = 0;
    if (bits === 16) {
      v = signed ? view.getInt16(offset, little) : view.getUint16(offset, little);
    } else if (bits === 32) {
      v = pixelData.isFloat
        ? view.getFloat32(offset, little)
        : (signed ? view.getInt32(offset, little) : view.getUint32(offset, little));
    } else if (bits === 64) {
      v = pixelData.isFloat
        ? view.getFloat64(offset, little)
        : Number(view.getBigInt64(offset, little));
    } else {
      v = view.getUint16(offset, little);
    }
    out[i] = v;
  }
  return out;
}

// Lookup table for bit reversal (256 entries)
const BIT_REVERSE_TABLE = new Uint8Array([
  0x00, 0x80, 0x40, 0xc0, 0x20, 0xa0, 0x60, 0xe0, 0x10, 0x90, 0x50, 0xd0, 0x30, 0xb0, 0x70, 0xf0,
  0x08, 0x88, 0x48, 0xc8, 0x28, 0xa8, 0x68, 0xe8, 0x18, 0x98, 0x58, 0xd8, 0x38, 0xb8, 0x78, 0xf8,
  0x04, 0x84, 0x44, 0xc4, 0x24, 0xa4, 0x64, 0xe4, 0x14, 0x94, 0x54, 0xd4, 0x34, 0xb4, 0x74, 0xf4,
  0x0c, 0x8c, 0x4c, 0xcc, 0x2c, 0xac, 0x6c, 0xec, 0x1c, 0x9c, 0x5c, 0xdc, 0x3c, 0xbc, 0x7c, 0xfc,
  0x02, 0x82, 0x42, 0xc2, 0x22, 0xa2, 0x62, 0xe2, 0x12, 0x92, 0x52, 0xd2, 0x32, 0xb2, 0x72, 0xf2,
  0x0a, 0x8a, 0x4a, 0xca, 0x2a, 0xaa, 0x6a, 0xea, 0x1a, 0x9a, 0x5a, 0xda, 0x3a, 0xba, 0x7a, 0xfa,
  0x06, 0x86, 0x46, 0xc6, 0x26, 0xa6, 0x66, 0xe6, 0x16, 0x96, 0x56, 0xd6, 0x36, 0xb6, 0x76, 0xf6,
  0x0e, 0x8e, 0x4e, 0xce, 0x2e, 0xae, 0x6e, 0xee, 0x1e, 0x9e, 0x5e, 0xde, 0x3e, 0xbe, 0x7e, 0xfe,
  0x01, 0x81, 0x41, 0xc1, 0x21, 0xa1, 0x61, 0xe1, 0x11, 0x91, 0x51, 0xd1, 0x31, 0xb1, 0x71, 0xf1,
  0x09, 0x89, 0x49, 0xc9, 0x29, 0xa9, 0x69, 0xe9, 0x19, 0x99, 0x59, 0xd9, 0x39, 0xb9, 0x79, 0xf9,
  0x05, 0x85, 0x45, 0xc5, 0x25, 0xa5, 0x65, 0xe5, 0x15, 0x95, 0x55, 0xd5, 0x35, 0xb5, 0x75, 0xf5,
  0x0d, 0x8d, 0x4d, 0xcd, 0x2d, 0xad, 0x6d, 0xed, 0x1d, 0x9d, 0x5d, 0xdd, 0x3d, 0xbd, 0x7d, 0xfd,
  0x03, 0x83, 0x43, 0xc3, 0x23, 0xa3, 0x63, 0xe3, 0x13, 0x93, 0x53, 0xd3, 0x33, 0xb3, 0x73, 0xf3,
  0x0b, 0x8b, 0x4b, 0xcb, 0x2b, 0xab, 0x6b, 0xeb, 0x1b, 0x9b, 0x5b, 0xdb, 0x3b, 0xbb, 0x7b, 0xfb,
  0x07, 0x87, 0x47, 0xc7, 0x27, 0xa7, 0x67, 0xe7, 0x17, 0x97, 0x57, 0xd7, 0x37, 0xb7, 0x77, 0xf7,
  0x0f, 0x8f, 0x4f, 0xcf, 0x2f, 0xaf, 0x6f, 0xef, 0x1f, 0x9f, 0x5f, 0xdf, 0x3f, 0xbf, 0x7f, 0xff,
]);
