import type { IByteBuffer } from "./IByteBuffer.js";

/**
 * A byte buffer that computes its content on first access via a factory function.
 * Used to defer string-to-bytes encoding until the bytes are actually needed.
 *
 * Reference: fo-dicom/FO-DICOM.Core/IO/Buffer/LazyByteBuffer.cs
 */
export class LazyByteBuffer implements IByteBuffer {
  readonly isMemory = true as const;

  private _data: Uint8Array | null = null;
  private readonly _factory: () => Uint8Array;

  constructor(factory: () => Uint8Array) {
    this._factory = factory;
  }

  get data(): Uint8Array {
    if (this._data === null) {
      this._data = this._factory();
    }
    return this._data;
  }

  get size(): number {
    return this.data.byteLength;
  }

  getByteRange(offset: number, count: number): Uint8Array {
    return this.data.subarray(offset, offset + count);
  }
}
