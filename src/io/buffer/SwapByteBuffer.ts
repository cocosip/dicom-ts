import type { IByteBuffer } from "./IByteBuffer.js";
import { swapBytes } from "./byteSwap.js";

/**
 * Byte buffer wrapper that swaps byte order in fixed-size units.
 * Reference: fo-dicom/FO-DICOM.Core/IO/Buffer/SwapByteBuffer.cs
 */
export class SwapByteBuffer implements IByteBuffer {
  readonly internal: IByteBuffer;
  readonly unitSize: number;

  constructor(buffer: IByteBuffer, unitSize: number) {
    this.internal = buffer;
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
    swapBytes(this.unitSize, out);
    return out;
  }

  getByteRange(offset: number, count: number): Uint8Array {
    const chunk = this.internal.getByteRange(offset, count);
    const out = new Uint8Array(chunk);
    swapBytes(this.unitSize, out);
    return out;
  }
}
