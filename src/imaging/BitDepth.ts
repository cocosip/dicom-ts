import { DicomDataset } from "../dataset/DicomDataset.js";
import * as Tags from "../core/DicomTag.generated.js";
import { PixelRepresentation, parsePixelRepresentation } from "./PixelRepresentation.js";

/**
 * Bit depth information for pixel data.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/BitDepth.cs
 */
export class BitDepth {
  readonly bitsAllocated: number;
  readonly bitsStored: number;
  readonly highBit: number;
  readonly pixelRepresentation: PixelRepresentation;

  constructor(
    bitsAllocated: number,
    bitsStored: number,
    highBit: number,
    pixelRepresentation: PixelRepresentation
  ) {
    this.bitsAllocated = bitsAllocated;
    this.bitsStored = bitsStored;
    this.highBit = highBit;
    this.pixelRepresentation = pixelRepresentation;
  }

  get bytesAllocated(): number {
    return Math.max(1, Math.ceil(this.bitsAllocated / 8));
  }

  get isSigned(): boolean {
    return this.pixelRepresentation === PixelRepresentation.Signed;
  }

  get isValid(): boolean {
    if (this.bitsAllocated <= 0 || this.bitsStored <= 0) return false;
    if (this.bitsStored > this.bitsAllocated) return false;
    if (this.highBit !== this.bitsStored - 1) return false;
    return true;
  }

  /** Maximum possible pixel value from stored bits. */
  get maximumValue(): number {
    return BitDepth.getMaximumValue(this.bitsStored, this.isSigned);
  }

  /** Minimum possible pixel value from stored bits. */
  get minimumValue(): number {
    return BitDepth.getMinimumValue(this.bitsStored, this.isSigned);
  }

  /** @deprecated Use maximumValue */
  get maxValue(): number { return this.maximumValue; }
  /** @deprecated Use minimumValue */
  get minValue(): number { return this.minimumValue; }

  toString(): string {
    return [
      "Bits: {",
      `    Allocated: ${this.bitsAllocated}`,
      `       Stored: ${this.bitsStored}`,
      `     High Bit: ${this.highBit}`,
      `       Signed: ${this.isSigned}`,
      "}",
    ].join("\n");
  }

  // ---------------------------------------------------------------------------
  // Static utilities (matching fo-dicom BitDepth static methods)
  // ---------------------------------------------------------------------------

  /** Rounds up to the next power of 2. */
  static getNextPowerOf2(value: number): number {
    value--;
    value |= value >> 1;
    value |= value >> 2;
    value |= value >> 4;
    value |= value >> 8;
    value |= value >> 16;
    return value + 1;
  }

  /** Calculate the minimum pixel value for the given bit width and sign. */
  static getMinimumValue(bitsStored: number, isSigned: boolean): number {
    return isSigned ? -(1 << (bitsStored - 1)) : 0;
  }

  /** Calculate the maximum pixel value for the given bit width and sign. */
  static getMaximumValue(bitsStored: number, isSigned: boolean): number {
    return isSigned ? (1 << (bitsStored - 1)) - 1 : (1 << bitsStored) - 1;
  }

  /**
   * Return the high data bit index (excluding the sign bit for signed data).
   * Matches fo-dicom BitDepth.GetHighBit.
   */
  static getHighBit(bitsStored: number, isSigned: boolean): number {
    return isSigned ? bitsStored - 1 : bitsStored;
  }

  /** Create a BitDepth from a DICOM dataset. */
  static fromDataset(dataset: DicomDataset): BitDepth {
    const allocated = dataset.getSingleValueOrDefault<number>(Tags.BitsAllocated, 8);
    const stored = dataset.getSingleValueOrDefault<number>(Tags.BitsStored, allocated);
    const pr = parsePixelRepresentation(
      dataset.getSingleValueOrDefault<number>(Tags.PixelRepresentation, 0)
    );
    const isSigned = pr === PixelRepresentation.Signed;
    return new BitDepth(allocated, stored, BitDepth.getHighBit(stored, isSigned), pr);
  }
}
