import type { IByteBuffer } from "./IByteBuffer.js";

/**
 * Wrapper for uneven length buffers that need to be represented as even length.
 * Reference: fo-dicom/FO-DICOM.Core/IO/Buffer/EvenLengthBuffer.cs
 */
export class EvenLengthBuffer implements IByteBuffer {
  readonly buffer: IByteBuffer;

  private constructor(buffer: IByteBuffer) {
    this.buffer = buffer;
  }

  get isMemory(): boolean {
    return this.buffer.isMemory;
  }

  get size(): number {
    return this.buffer.size + 1;
  }

  get data(): Uint8Array {
    const out = new Uint8Array(this.size);
    out.set(this.buffer.data, 0);
    return out;
  }

  getByteRange(offset: number, count: number): Uint8Array {
    if (count <= 0) return new Uint8Array(0);
    if (offset < 0) throw new RangeError(`Offset ${offset} must be >= 0`);
    if (offset >= this.size) return new Uint8Array(0);

    const available = Math.min(count, this.size - offset);
    const out = new Uint8Array(available);

    const fromBuffer = Math.max(0, Math.min(this.buffer.size - offset, available));
    if (fromBuffer > 0) {
      out.set(this.buffer.getByteRange(offset, fromBuffer), 0);
    }
    // Remaining bytes (if any) are already zero padding.
    return out;
  }

  static create(buffer: IByteBuffer): IByteBuffer {
    return (buffer.size & 1) === 1 ? new EvenLengthBuffer(buffer) : buffer;
  }
}
