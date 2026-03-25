import type { ILUT } from "../lut/ILUT.js";
import type { IPixelData, PixelDataRange } from "./IPixelData.js";
import type { IByteBuffer } from "../../io/buffer/IByteBuffer.js";
import { Histogram } from "../math/Histogram.js";
import { BilinearInterpolation } from "../math/BilinearInterpolation.js";
import { NearestNeighborInterpolation } from "../math/NearestNeighborInterpolation.js";
import { DicomPixelData } from "../DicomPixelData.js";
import { DicomOverlayData } from "../DicomOverlayData.js";
import { PhotometricInterpretation } from "../PhotometricInterpretation.js";
import { PixelRepresentation } from "../PixelRepresentation.js";
import { PlanarConfiguration } from "../PlanarConfiguration.js";
import { PixelDataConverter } from "../PixelDataConverter.js";

// ---------------------------------------------------------------------------
// GrayscalePixelDataU8
// ---------------------------------------------------------------------------

/**
 * Grayscale unsigned 8-bit IPixelData implementation.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Render/PixelData.cs → GrayscalePixelDataU8
 */
export class GrayscalePixelDataU8 implements IPixelData {
  readonly width: number;
  readonly height: number;
  readonly components = 1;
  readonly data: Uint8Array;

  constructor(width: number, height: number, data: Uint8Array) {
    this.width = width;
    this.height = height;
    this.data = data;
  }

  getMinMax(padding?: number): PixelDataRange {
    const d = this.data;
    if (d.length === 0) return { minimum: 0, maximum: 0 };
    let min = Number.MAX_VALUE;
    let max = -Number.MAX_VALUE;
    for (let i = 0; i < d.length; i++) {
      const v = d[i]!;
      if (padding !== undefined && v === padding) continue;
      if (v < min) min = v;
      if (v > max) max = v;
    }
    if (min > max) return { minimum: 0, maximum: 0 };
    return { minimum: min, maximum: max };
  }

  getPixel(x: number, y: number): number {
    return this.data[y * this.width + x] ?? 0;
  }

  rescale(scale: number): IPixelData {
    const w = (this.width * scale) | 0;
    const h = (this.height * scale) | 0;
    if (w === this.width && h === this.height) return this;
    const scaled = BilinearInterpolation.rescaleGrayscaleU8(this.data, this.width, this.height, w, h);
    return new GrayscalePixelDataU8(w, h, scaled);
  }

  render(lut: ILUT | null, output: Int32Array): void {
    const d = this.data;
    if (lut == null) {
      for (let i = 0; i < d.length; i++) output[i] = d[i]!;
    } else {
      for (let i = 0; i < d.length; i++) output[i] = lut.apply(d[i]!) | 0;
    }
  }

  getHistogram(channel: number): Histogram {
    if (channel !== 0) throw new RangeError(`Expected channel 0 for grayscale image, got ${channel}.`);
    const h = new Histogram(0, 255);
    const d = this.data;
    for (let i = 0; i < d.length; i++) h.add(d[i]!);
    return h;
  }
}

// ---------------------------------------------------------------------------
// SingleBitPixelData
// ---------------------------------------------------------------------------

/**
 * Single-bit pixel data — usually used for DICOM overlay data.
 * Expands bit-packed bytes to one byte-per-pixel (0 or 1).
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Render/PixelData.cs → SingleBitPixelData
 */
export class SingleBitPixelData extends GrayscalePixelDataU8 {
  constructor(width: number, height: number, packed: Uint8Array) {
    super(width, height, SingleBitPixelData._expandBits(width, height, packed));
  }

  private static _expandBits(width: number, height: number, input: Uint8Array): Uint8Array {
    const total = width * height;
    const output = new Uint8Array(total);
    for (let i = 0; i < total; i++) {
      const byteIndex = i >> 3;
      const bitIndex = i & 7;
      output[i] = ((input[byteIndex] ?? 0) >> bitIndex) & 1;
    }
    return output;
  }

  override rescale(scale: number): IPixelData {
    const w = (this.width * scale) | 0;
    const h = (this.height * scale) | 0;
    if (w === this.width && h === this.height) return this;
    const scaled = NearestNeighborInterpolation.rescaleGrayscale(this.data, this.width, this.height, w, h);
    return new GrayscalePixelDataU8(w, h, scaled);
  }

  override getHistogram(channel: number): Histogram {
    if (channel !== 0) throw new RangeError(`Expected channel 0 for single-bit image, got ${channel}.`);
    const h = new Histogram(0, 1);
    const d = this.data;
    for (let i = 0; i < d.length; i++) h.add(d[i]!);
    return h;
  }
}

// ---------------------------------------------------------------------------
// GrayscalePixelDataS16
// ---------------------------------------------------------------------------

/**
 * Grayscale signed 16-bit IPixelData implementation.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Render/PixelData.cs → GrayscalePixelDataS16
 */
export class GrayscalePixelDataS16 implements IPixelData {
  readonly width: number;
  readonly height: number;
  readonly components = 1;
  readonly data: Int16Array;
  private readonly _bits: { minimumValue: number; maximumValue: number };

  constructor(
    width: number,
    height: number,
    bitDepth: { bitsAllocated: number; bitsStored: number; highBit: number; minimumValue: number; maximumValue: number },
    raw: IByteBuffer,
  );
  constructor(width: number, height: number, data: Int16Array);
  constructor(
    width: number,
    height: number,
    arg: { bitsAllocated: number; bitsStored: number; highBit: number; minimumValue: number; maximumValue: number } | Int16Array,
    raw?: IByteBuffer,
  ) {
    this.width = width;
    this.height = height;
    if (arg instanceof Int16Array) {
      this.data = arg;
      this._bits = { minimumValue: -32768, maximumValue: 32767 };
    } else {
      const bd = arg;
      this._bits = { minimumValue: bd.minimumValue, maximumValue: bd.maximumValue };
      const bytes = raw!.data;
      const d = new Int16Array(bytes.buffer, bytes.byteOffset, bytes.byteLength >> 1);
      const data = new Int16Array(d);
      if (bd.bitsStored !== 16) {
        const shiftLeft = bd.bitsAllocated - bd.highBit - 1;
        const shiftRight = bd.bitsAllocated - bd.bitsStored;
        for (let i = 0; i < data.length; i++) {
          data[i] = ((data[i]! << shiftLeft) >> shiftRight);
        }
      }
      this.data = data;
    }
  }

  getMinMax(padding?: number): PixelDataRange {
    const d = this.data;
    if (d.length === 0) return { minimum: 0, maximum: 0 };
    let min = Number.MAX_VALUE;
    let max = -Number.MAX_VALUE;
    for (let i = 0; i < d.length; i++) {
      const v = d[i]!;
      if (padding !== undefined && v === padding) continue;
      if (v < min) min = v;
      if (v > max) max = v;
    }
    if (min > max) return { minimum: 0, maximum: 0 };
    return { minimum: min, maximum: max };
  }

  getPixel(x: number, y: number): number {
    return this.data[y * this.width + x] ?? 0;
  }

  rescale(scale: number): IPixelData {
    const w = (this.width * scale) | 0;
    const h = (this.height * scale) | 0;
    if (w === this.width && h === this.height) return this;
    const scaled = BilinearInterpolation.rescaleGrayscaleS16(this.data, this.width, this.height, w, h);
    return new GrayscalePixelDataS16(w, h, scaled);
  }

  render(lut: ILUT | null, output: Int32Array): void {
    const d = this.data;
    if (lut == null) {
      for (let i = 0; i < d.length; i++) output[i] = d[i]!;
    } else {
      for (let i = 0; i < d.length; i++) output[i] = lut.apply(d[i]!) | 0;
    }
  }

  getHistogram(channel: number): Histogram {
    if (channel !== 0) throw new RangeError(`Expected channel 0 for grayscale image, got ${channel}.`);
    const h = new Histogram(this._bits.minimumValue, this._bits.maximumValue);
    const d = this.data;
    for (let i = 0; i < d.length; i++) h.add(d[i]!);
    return h;
  }
}

// ---------------------------------------------------------------------------
// GrayscalePixelDataU16
// ---------------------------------------------------------------------------

/**
 * Grayscale unsigned 16-bit IPixelData implementation.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Render/PixelData.cs → GrayscalePixelDataU16
 */
export class GrayscalePixelDataU16 implements IPixelData {
  readonly width: number;
  readonly height: number;
  readonly components = 1;
  readonly data: Uint16Array;
  private readonly _bits: { minimumValue: number; maximumValue: number };

  constructor(
    width: number,
    height: number,
    bitDepth: { bitsAllocated: number; bitsStored: number; highBit: number; minimumValue: number; maximumValue: number },
    raw: IByteBuffer,
  );
  constructor(width: number, height: number, data: Uint16Array);
  constructor(
    width: number,
    height: number,
    arg: { bitsAllocated: number; bitsStored: number; highBit: number; minimumValue: number; maximumValue: number } | Uint16Array,
    raw?: IByteBuffer,
  ) {
    this.width = width;
    this.height = height;
    if (arg instanceof Uint16Array) {
      this.data = arg;
      this._bits = { minimumValue: 0, maximumValue: 65535 };
    } else {
      const bd = arg;
      this._bits = { minimumValue: bd.minimumValue, maximumValue: bd.maximumValue };
      const bytes = raw!.data;
      const d = new Uint16Array(bytes.buffer, bytes.byteOffset, bytes.byteLength >> 1);
      const data = new Uint16Array(d);
      if (bd.bitsStored !== 16) {
        const shiftLeft = bd.bitsAllocated - bd.highBit - 1;
        const shiftRight = bd.bitsAllocated - bd.bitsStored;
        for (let i = 0; i < data.length; i++) {
          data[i] = (((data[i]! << shiftLeft) & 0xffff) >>> shiftRight) & 0xffff;
        }
      }
      this.data = data;
    }
  }

  getMinMax(padding?: number): PixelDataRange {
    const d = this.data;
    if (d.length === 0) return { minimum: 0, maximum: 0 };
    let min = Number.MAX_VALUE;
    let max = -Number.MAX_VALUE;
    for (let i = 0; i < d.length; i++) {
      const v = d[i]!;
      if (padding !== undefined && v === padding) continue;
      if (v < min) min = v;
      if (v > max) max = v;
    }
    if (min > max) return { minimum: 0, maximum: 0 };
    return { minimum: min, maximum: max };
  }

  getPixel(x: number, y: number): number {
    return this.data[y * this.width + x] ?? 0;
  }

  rescale(scale: number): IPixelData {
    const w = (this.width * scale) | 0;
    const h = (this.height * scale) | 0;
    if (w === this.width && h === this.height) return this;
    const scaled = BilinearInterpolation.rescaleGrayscaleU16(this.data, this.width, this.height, w, h);
    return new GrayscalePixelDataU16(w, h, scaled);
  }

  render(lut: ILUT | null, output: Int32Array): void {
    const d = this.data;
    if (lut == null) {
      for (let i = 0; i < d.length; i++) output[i] = d[i]!;
    } else {
      for (let i = 0; i < d.length; i++) output[i] = lut.apply(d[i]!) | 0;
    }
  }

  getHistogram(channel: number): Histogram {
    if (channel !== 0) throw new RangeError(`Expected channel 0 for grayscale image, got ${channel}.`);
    const h = new Histogram(this._bits.minimumValue, this._bits.maximumValue);
    const d = this.data;
    for (let i = 0; i < d.length; i++) h.add(d[i]!);
    return h;
  }
}

// ---------------------------------------------------------------------------
// GrayscalePixelDataS32
// ---------------------------------------------------------------------------

/**
 * Grayscale signed 32-bit IPixelData implementation.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Render/PixelData.cs → GrayscalePixelDataS32
 */
export class GrayscalePixelDataS32 implements IPixelData {
  readonly width: number;
  readonly height: number;
  readonly components = 1;
  readonly data: Int32Array;

  constructor(
    width: number,
    height: number,
    bitDepth: { bitsAllocated: number; bitsStored: number; highBit: number },
    raw: IByteBuffer,
  );
  constructor(width: number, height: number, data: Int32Array);
  constructor(
    width: number,
    height: number,
    arg: { bitsAllocated: number; bitsStored: number; highBit: number } | Int32Array,
    raw?: IByteBuffer,
  ) {
    this.width = width;
    this.height = height;
    if (arg instanceof Int32Array) {
      this.data = arg;
    } else {
      const bd = arg;
      const bytes = raw!.data;
      const d = new Int32Array(bytes.buffer, bytes.byteOffset, bytes.byteLength >> 2);
      const data = new Int32Array(d);
      const shiftLeft = bd.bitsAllocated - bd.highBit - 1;
      const shiftRight = bd.bitsAllocated - bd.bitsStored;
      for (let i = 0; i < data.length; i++) {
        data[i] = (data[i]! << shiftLeft) >> shiftRight;
      }
      this.data = data;
    }
  }

  getMinMax(padding?: number): PixelDataRange {
    const d = this.data;
    if (d.length === 0) return { minimum: 0, maximum: 0 };
    let min = Number.MAX_VALUE;
    let max = -Number.MAX_VALUE;
    for (let i = 0; i < d.length; i++) {
      const v = d[i]!;
      if (padding !== undefined && v === padding) continue;
      if (v < min) min = v;
      if (v > max) max = v;
    }
    if (min > max) return { minimum: 0, maximum: 0 };
    return { minimum: min, maximum: max };
  }

  getPixel(x: number, y: number): number {
    return this.data[y * this.width + x] ?? 0;
  }

  rescale(scale: number): IPixelData {
    const w = (this.width * scale) | 0;
    const h = (this.height * scale) | 0;
    if (w === this.width && h === this.height) return this;
    const scaled = BilinearInterpolation.rescaleGrayscaleS32(this.data, this.width, this.height, w, h);
    return new GrayscalePixelDataS32(w, h, scaled);
  }

  render(lut: ILUT | null, output: Int32Array): void {
    const d = this.data;
    if (lut == null) {
      for (let i = 0; i < d.length; i++) output[i] = d[i]!;
    } else {
      for (let i = 0; i < d.length; i++) output[i] = lut.apply(d[i]!) | 0;
    }
  }

  getHistogram(_channel: number): Histogram {
    throw new Error("Histograms are not supported for signed 32-bit images.");
  }
}

// ---------------------------------------------------------------------------
// GrayscalePixelDataU32
// ---------------------------------------------------------------------------

/**
 * Grayscale unsigned 32-bit IPixelData implementation.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Render/PixelData.cs → GrayscalePixelDataU32
 */
export class GrayscalePixelDataU32 implements IPixelData {
  readonly width: number;
  readonly height: number;
  readonly components = 1;
  readonly data: Uint32Array;

  constructor(
    width: number,
    height: number,
    bitDepth: { bitsAllocated: number; bitsStored: number; highBit: number },
    raw: IByteBuffer,
  );
  constructor(width: number, height: number, data: Uint32Array);
  constructor(
    width: number,
    height: number,
    arg: { bitsAllocated: number; bitsStored: number; highBit: number } | Uint32Array,
    raw?: IByteBuffer,
  ) {
    this.width = width;
    this.height = height;
    if (arg instanceof Uint32Array) {
      this.data = arg;
    } else {
      const bd = arg;
      const bytes = raw!.data;
      const d = new Uint32Array(bytes.buffer, bytes.byteOffset, bytes.byteLength >> 2);
      const data = new Uint32Array(d);
      if (bd.bitsStored !== 32) {
        const shiftLeft = bd.bitsAllocated - bd.highBit - 1;
        const shiftRight = bd.bitsAllocated - bd.bitsStored;
        for (let i = 0; i < data.length; i++) {
          data[i] = (data[i]! << shiftLeft) >>> shiftRight;
        }
      }
      this.data = data;
    }
  }

  getMinMax(padding?: number): PixelDataRange {
    const d = this.data;
    if (d.length === 0) return { minimum: 0, maximum: 0 };
    let min = Number.MAX_VALUE;
    let max = -Number.MAX_VALUE;
    for (let i = 0; i < d.length; i++) {
      const v = d[i]!;
      if (padding !== undefined && v === padding) continue;
      if (v < min) min = v;
      if (v > max) max = v;
    }
    if (min > max) return { minimum: 0, maximum: 0 };
    return { minimum: min, maximum: max };
  }

  getPixel(x: number, y: number): number {
    return this.data[y * this.width + x] ?? 0;
  }

  rescale(scale: number): IPixelData {
    const w = (this.width * scale) | 0;
    const h = (this.height * scale) | 0;
    if (w === this.width && h === this.height) return this;
    const scaled = BilinearInterpolation.rescaleGrayscaleU32(this.data, this.width, this.height, w, h);
    return new GrayscalePixelDataU32(w, h, scaled);
  }

  render(lut: ILUT | null, output: Int32Array): void {
    const d = this.data;
    if (lut == null) {
      for (let i = 0; i < d.length; i++) output[i] = d[i]! | 0;
    } else {
      for (let i = 0; i < d.length; i++) output[i] = lut.apply(d[i]!) | 0;
    }
  }

  getHistogram(_channel: number): Histogram {
    throw new Error("Histograms are not supported for unsigned 32-bit images.");
  }
}

// ---------------------------------------------------------------------------
// ColorPixelData24
// ---------------------------------------------------------------------------

/**
 * Color 24-bit (RGB, 3 bytes per pixel) IPixelData implementation.
 *
 * `render()` writes packed ARGB ints (0xFF_RR_GG_BB) to the output array.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Render/PixelData.cs → ColorPixelData24
 */
export class ColorPixelData24 implements IPixelData {
  readonly width: number;
  readonly height: number;
  readonly components = 3;
  readonly data: Uint8Array;

  constructor(width: number, height: number, data: Uint8Array) {
    this.width = width;
    this.height = height;
    this.data = data;
  }

  getMinMax(_padding?: number): PixelDataRange {
    throw new Error("Calculation of min/max pixel values is not supported for 24-bit color pixel data.");
  }

  getPixel(x: number, y: number): number {
    const d = this.data;
    const p = (y * this.width + x) * 3;
    return ((d[p] ?? 0) << 16) | ((d[p + 1] ?? 0) << 8) | (d[p + 2] ?? 0);
  }

  rescale(scale: number): IPixelData {
    const w = (this.width * scale) | 0;
    const h = (this.height * scale) | 0;
    if (w === this.width && h === this.height) return this;
    const scaled = BilinearInterpolation.rescaleColor24(this.data, this.width, this.height, w, h);
    return new ColorPixelData24(w, h, scaled);
  }

  render(lut: ILUT | null, output: Int32Array): void {
    const d = this.data;
    const alphaFF = 0xff000000 | 0;
    if (lut == null) {
      for (let i = 0, p = 0; i < output.length; i++) {
        output[i] = alphaFF | ((d[p++]! & 0xff) << 16) | ((d[p++]! & 0xff) << 8) | (d[p++]! & 0xff);
      }
    } else {
      for (let i = 0, p = 0; i < output.length; i++) {
        output[i] = alphaFF
          | ((lut.apply(d[p++]!) & 0xff) << 16)
          | ((lut.apply(d[p++]!) & 0xff) << 8)
          | (lut.apply(d[p++]!) & 0xff);
      }
    }
  }

  getHistogram(channel: number): Histogram {
    if (channel < 0 || channel > 2) {
      throw new RangeError(`Expected channel between 0 and 2 for 24-bit color image, got ${channel}.`);
    }
    const h = new Histogram(0, 255);
    const d = this.data;
    for (let i = channel; i < d.length; i += 3) h.add(d[i]!);
    return h;
  }
}

// ---------------------------------------------------------------------------
// ColorPixelData32
// ---------------------------------------------------------------------------

/**
 * Color 32-bit (RGBA, 4 bytes per pixel) IPixelData implementation.
 *
 * `render()` writes packed ARGB ints (0xAA_RR_GG_BB) to the output array.
 */
export class ColorPixelData32 implements IPixelData {
  readonly width: number;
  readonly height: number;
  readonly components = 4;
  readonly data: Uint8Array;

  constructor(width: number, height: number, data: Uint8Array) {
    this.width = width;
    this.height = height;
    this.data = data;
  }

  getMinMax(_padding?: number): PixelDataRange {
    throw new Error("Calculation of min/max pixel values is not supported for 32-bit color pixel data.");
  }

  getPixel(x: number, y: number): number {
    const d = this.data;
    const p = (y * this.width + x) * 4;
    return (
      ((d[p + 3] ?? 0) << 24)
      | ((d[p] ?? 0) << 16)
      | ((d[p + 1] ?? 0) << 8)
      | (d[p + 2] ?? 0)
    ) >>> 0;
  }

  rescale(scale: number): IPixelData {
    const w = (this.width * scale) | 0;
    const h = (this.height * scale) | 0;
    if (w === this.width && h === this.height) return this;
    const scaled = BilinearInterpolation.rescaleColor32(this.data, this.width, this.height, w, h);
    return new ColorPixelData32(w, h, scaled);
  }

  render(lut: ILUT | null, output: Int32Array): void {
    const d = this.data;
    if (lut == null) {
      for (let i = 0, p = 0; i < output.length; i++) {
        output[i] =
          (((d[p + 3] ?? 0) & 0xff) << 24)
          | (((d[p] ?? 0) & 0xff) << 16)
          | (((d[p + 1] ?? 0) & 0xff) << 8)
          | ((d[p + 2] ?? 0) & 0xff);
        p += 4;
      }
    } else {
      for (let i = 0, p = 0; i < output.length; i++) {
        output[i] =
          (((d[p + 3] ?? 0) & 0xff) << 24)
          | ((lut.apply(d[p] ?? 0) & 0xff) << 16)
          | ((lut.apply(d[p + 1] ?? 0) & 0xff) << 8)
          | (lut.apply(d[p + 2] ?? 0) & 0xff);
        p += 4;
      }
    }
  }

  getHistogram(channel: number): Histogram {
    if (channel < 0 || channel > 3) {
      throw new RangeError(`Expected channel between 0 and 3 for 32-bit color image, got ${channel}.`);
    }
    const h = new Histogram(0, 255);
    const d = this.data;
    for (let i = channel; i < d.length; i += 4) h.add(d[i]!);
    return h;
  }
}

// ---------------------------------------------------------------------------
// PixelDataFactory
// ---------------------------------------------------------------------------

/**
 * Factory for creating IPixelData from DicomPixelData or DicomOverlayData.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Render/PixelData.cs → PixelDataFactory
 */
export class PixelDataFactory {
  /**
   * Create an IPixelData from a DicomPixelData frame.
   */
  static create(pixelData: DicomPixelData, frame: number): IPixelData {
    let pi = pixelData.photometricInterpretation;
    const w = pixelData.columns;
    const h = pixelData.rows;

    if (pi == null) {
      const samples = pixelData.samplesPerPixel;
      if (samples === 0 || samples === 1) {
        pi = PhotometricInterpretation.MONOCHROME2;
      } else {
        pi = PhotometricInterpretation.RGB;
      }
    }

    const rawFrame = pixelData.getFrame(frame);

    if (pixelData.bitsStored === 1) {
      return new SingleBitPixelData(w, h, rawFrame.data);
    }

    if (
      pi === PhotometricInterpretation.MONOCHROME1
      || pi === PhotometricInterpretation.MONOCHROME2
      || pi === PhotometricInterpretation.PALETTE_COLOR
    ) {
      const bd = pixelData.bitDepth;
      if (pixelData.bitsAllocated === 8 && pixelData.highBit === 7 && pixelData.bitsStored === 8) {
        return new GrayscalePixelDataU8(w, h, rawFrame.data);
      } else if (pixelData.bitsAllocated <= 16) {
        return pixelData.pixelRepresentation === PixelRepresentation.Signed
          ? new GrayscalePixelDataS16(w, h, bd, rawFrame)
          : new GrayscalePixelDataU16(w, h, bd, rawFrame);
      } else if (pixelData.bitsAllocated <= 32) {
        return pixelData.pixelRepresentation === PixelRepresentation.Signed
          ? new GrayscalePixelDataS32(w, h, bd, rawFrame)
          : new GrayscalePixelDataU32(w, h, bd, rawFrame);
      } else {
        throw new Error(`Unsupported pixel data bits stored: ${pixelData.bitsStored}`);
      }
    }

    if (
      pi === PhotometricInterpretation.ARGB
    ) {
      return new ColorPixelData32(w, h, PixelDataConverter.convertArgb(pixelData, frame));
    }

    if (
      pi === PhotometricInterpretation.RGB
      || pi === PhotometricInterpretation.YBR_FULL
      || pi === PhotometricInterpretation.YBR_FULL_422
      || pi === PhotometricInterpretation.YBR_ICT
      || pi === PhotometricInterpretation.YBR_RCT
    ) {
      let buf = rawFrame;
      if (pixelData.planarConfiguration === PlanarConfiguration.Planar) {
        buf = PixelDataConverter.planarToInterleaved24(buf);
      }
      if (pi === PhotometricInterpretation.YBR_FULL) {
        buf = PixelDataConverter.ybrFullToRgb(buf);
      } else if (pi === PhotometricInterpretation.YBR_FULL_422) {
        buf = PixelDataConverter.ybrFull422ToRgb(buf, w);
      }
      return new ColorPixelData24(w, h, buf.data);
    }

    throw new Error(`Unsupported pixel data photometric interpretation: ${pi}`);
  }

  /**
   * Create a SingleBitPixelData from overlay data.
   */
  static createFromOverlay(overlay: DicomOverlayData): SingleBitPixelData {
    return new SingleBitPixelData(overlay.columns, overlay.rows, overlay.data.data);
  }
}
