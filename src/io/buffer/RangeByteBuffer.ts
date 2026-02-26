import type { IByteBuffer } from "./IByteBuffer.js";

/**
 * Byte buffer representing a sub-range of another buffer.
 * Reference: fo-dicom/FO-DICOM.Core/IO/Buffer/RangeByteBuffer.cs
 */
export class RangeByteBuffer implements IByteBuffer {
  readonly internal: IByteBuffer;
  readonly offset: number;
  readonly length: number;

  constructor(buffer: IByteBuffer, offset: number, length: number) {
    this.internal = buffer;
    this.offset = Math.max(0, offset);
    this.length = Math.max(0, length);
  }

  get isMemory(): boolean {
    return this.internal.isMemory;
  }

  get size(): number {
    return this.length;
  }

  get data(): Uint8Array {
    return this.getByteRange(0, this.length);
  }

  getByteRange(offset: number, count: number): Uint8Array {
    if (count <= 0) return new Uint8Array(0);
    if (offset < 0) throw new RangeError(`Offset ${offset} must be >= 0`);
    if (offset >= this.length) return new Uint8Array(0);
    const available = Math.min(count, this.length - offset);
    return this.internal.getByteRange(this.offset + offset, available);
  }
}
