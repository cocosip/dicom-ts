import type { IByteBuffer } from "./IByteBuffer.js";

/**
 * Byte buffer representing a Bulk Data URI reference.
 * Reference: fo-dicom/FO-DICOM.Core/IO/Buffer/BulkDataUriByteBuffer.cs
 */
export class BulkDataUriByteBuffer implements IByteBuffer {
  private _buffer: Uint8Array | null = null;
  readonly bulkDataUri: string;

  constructor(bulkDataUri: string) {
    this.bulkDataUri = bulkDataUri;
  }

  get isMemory(): boolean {
    return this._buffer !== null;
  }

  get size(): number {
    if (this._buffer === null) {
      throw new Error("BulkDataUriByteBuffer size is unavailable until data is set.");
    }
    return this._buffer.byteLength;
  }

  get data(): Uint8Array {
    if (this._buffer === null) {
      throw new Error("BulkDataUriByteBuffer data is unavailable until data is set.");
    }
    return this._buffer;
  }

  set data(value: Uint8Array) {
    this._buffer = value;
  }

  getByteRange(offset: number, count: number): Uint8Array {
    if (this._buffer === null) {
      throw new Error("BulkDataUriByteBuffer cannot provide data until data is set.");
    }
    return this._buffer.subarray(offset, offset + count);
  }
}
