import { PixelRepresentation } from "./PixelRepresentation.js";

/**
 * Bit depth information for pixel data.
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

  get minValue(): number {
    if (!this.isSigned) return 0;
    return -(1 << (this.bitsStored - 1));
  }

  get maxValue(): number {
    if (!this.isSigned) return (1 << this.bitsStored) - 1;
    return (1 << (this.bitsStored - 1)) - 1;
  }

  toString(): string {
    return `BitDepth(${this.bitsAllocated}/${this.bitsStored}, high=${this.highBit}, signed=${this.isSigned})`;
  }
}
