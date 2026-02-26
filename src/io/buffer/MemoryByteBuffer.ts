import type { IByteBuffer } from "./IByteBuffer.js";

/**
 * In-memory byte buffer backed by a `Uint8Array`.
 * Reference: fo-dicom/FO-DICOM.Core/IO/Buffer/MemoryByteBuffer.cs
 */
export class MemoryByteBuffer implements IByteBuffer {
  readonly isMemory = true as const;
  readonly data: Uint8Array;

  constructor(data: Uint8Array | ArrayBuffer | number[]) {
    this.data =
      data instanceof Uint8Array
        ? data
        : new Uint8Array(data);
  }

  get size(): number {
    return this.data.byteLength;
  }

  getByteRange(offset: number, count: number): Uint8Array {
    return this.data.subarray(offset, offset + count);
  }
}
