import type { IByteBuffer } from "./IByteBuffer.js";
import { Endian } from "../../core/DicomTransferSyntax.js";
import { LocalEndian, swapBytes } from "./byteSwap.js";

/**
 * Byte buffer wrapper that swaps based on requested endianness.
 * Reference: fo-dicom/FO-DICOM.Core/IO/Buffer/EndianByteBuffer.cs
 */
export class EndianByteBuffer implements IByteBuffer {
  readonly internal: IByteBuffer;
  readonly endian: Endian;
  readonly unitSize: number;

  private constructor(buffer: IByteBuffer, endian: Endian, unitSize: number) {
    this.internal = buffer;
    this.endian = endian;
    this.unitSize = unitSize;
  }

  get isMemory(): boolean {
    return this.internal.isMemory;
  }

  get size(): number {
    return this.internal.size;
  }

  get data(): Uint8Array {
    const out = new Uint8Array(this.internal.data);
    if (this.unitSize > 1 && this.endian !== LocalEndian) {
      swapBytes(this.unitSize, out);
    }
    return out;
  }

  getByteRange(offset: number, count: number): Uint8Array {
    const chunk = this.internal.getByteRange(offset, count);
    const out = new Uint8Array(chunk);
    if (this.unitSize > 1 && this.endian !== LocalEndian) {
      swapBytes(this.unitSize, out);
    }
    return out;
  }

  static create(buffer: IByteBuffer, endian: Endian, unitSize: number): IByteBuffer {
    return endian === LocalEndian || unitSize <= 1
      ? buffer
      : new EndianByteBuffer(buffer, endian, unitSize);
  }
}
