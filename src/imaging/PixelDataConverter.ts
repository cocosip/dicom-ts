import { Endian } from "../core/DicomTransferSyntax.js";
import { DicomPixelData } from "./DicomPixelData.js";
import { PhotometricInterpretation, isMonochrome } from "./PhotometricInterpretation.js";
import { PlanarConfiguration } from "./PlanarConfiguration.js";
import { ColorSpace } from "./ColorSpace.js";
import { ColorTable } from "./ColorTable.js";
import type { ILUT } from "./lut/ILUT.js";
import { PixelRepresentation } from "./PixelRepresentation.js";

export interface RgbaConversionOptions {
  lut?: ILUT;
  palette?: ColorTable | null;
}

/**
 * Pixel data conversion helpers.
 */
export class PixelDataConverter {
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
      const mapped = lut ? lut.map(values[i]!) : clamp8(values[i]!);
      const v = clamp8(mapped);
      const o = i * 4;
      out[o] = v;
      out[o + 1] = v;
      out[o + 2] = v;
      out[o + 3] = 255;
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
        const r = bytes[i] ?? 0;
        const g = bytes[i + planeSize] ?? 0;
        const b = bytes[i + planeSize * 2] ?? 0;
        const o = i * 4;
        out[o] = r;
        out[o + 1] = g;
        out[o + 2] = b;
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
      const c = ColorSpace.ybrFullToRgb(y, cb, cr);
      const o = i * 4;
      out[o] = c.r;
      out[o + 1] = c.g;
      out[o + 2] = c.b;
      out[o + 3] = 255;
    }
    return out;
  }

  static convertYbrFull422(pixelData: DicomPixelData, frame: number): Uint8Array {
    const bytes = pixelData.getFrame(frame).data;
    const count = pixelData.rows * pixelData.columns;
    const out = new Uint8Array(count * 4);
    // assume Y1 Y2 Cb Cr ordering
    let outIndex = 0;
    for (let i = 0; i < bytes.length; i += 4) {
      const y1 = bytes[i] ?? 0;
      const y2 = bytes[i + 1] ?? 0;
      const cb = bytes[i + 2] ?? 0;
      const cr = bytes[i + 3] ?? 0;
      const c1 = ColorSpace.ybrFullToRgb(y1, cb, cr);
      out[outIndex++] = c1.r;
      out[outIndex++] = c1.g;
      out[outIndex++] = c1.b;
      out[outIndex++] = 255;
      if (outIndex >= out.length) break;
      const c2 = ColorSpace.ybrFullToRgb(y2, cb, cr);
      out[outIndex++] = c2.r;
      out[outIndex++] = c2.g;
      out[outIndex++] = c2.b;
      out[outIndex++] = 255;
      if (outIndex >= out.length) break;
    }
    return out;
  }

  static convertPalette(pixelData: DicomPixelData, frame: number, palette: ColorTable): Uint8Array {
    const values = readSamples(pixelData, frame);
    const out = new Uint8Array(values.length * 4);
    for (let i = 0; i < values.length; i++) {
      const c = palette.getColor(values[i]!);
      const o = i * 4;
      out[o] = c.r;
      out[o + 1] = c.g;
      out[o + 2] = c.b;
      out[o + 3] = 255;
    }
    return out;
  }
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

function clamp8(v: number): number {
  if (v <= 0) return 0;
  if (v >= 255) return 255;
  return v & 0xFF;
}
