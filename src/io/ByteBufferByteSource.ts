import { Endian } from "../core/DicomTransferSyntax.js";
import { Readable } from "node:stream";
import type { IByteBuffer } from "./buffer/IByteBuffer.js";
import { MemoryByteBuffer } from "./buffer/MemoryByteBuffer.js";
import type { IByteSource, ByteSourceCallback } from "./IByteSource.js";
import {
  readInt16,
  readUInt16,
  readInt32,
  readUInt32,
  readInt64,
  readUInt64,
  readSingle,
  readDouble,
} from "./internal/byteReaders.js";
import { LocalEndian } from "./buffer/byteSwap.js";

/**
 * Byte source backed by one or more in-memory byte buffers.
 * Reference: fo-dicom/FO-DICOM.Core/IO/Buffer/ByteBufferByteSource.cs
 */
export class ByteBufferByteSource implements IByteSource {
  private readonly buffers: IByteBuffer[];
  private fixed: boolean;
  private currentIndex = -1;
  private currentPos = 0;
  private currentData: Uint8Array | null = null;
  private required = 0;
  private callback: ByteSourceCallback | null = null;
  private callbackState: unknown = null;

  private _endian: Endian = LocalEndian;
  private _position = 0;
  private _length = 0;
  private _mark: number | null = null;

  constructor(buffers?: IByteBuffer[]) {
    this.buffers = buffers ? [...buffers] : [];
    this.fixed = !!buffers;
    for (const b of this.buffers) this._length += b.size;
  }

  get endian(): Endian {
    return this._endian;
  }

  set endian(value: Endian) {
    if (this._endian !== value) {
      this._endian = value;
      this.swapBuffers();
    }
  }

  get position(): number {
    return this._position;
  }

  get isEOF(): boolean {
    return this.fixed && this._position >= this._length;
  }

  getUInt8(): number {
    return this.nextByte();
  }

  getInt16(): number {
    return readInt16(this.getBytes(2), this._endian);
  }

  getUInt16(): number {
    return readUInt16(this.getBytes(2), this._endian);
  }

  getInt32(): number {
    return readInt32(this.getBytes(4), this._endian);
  }

  getUInt32(): number {
    return readUInt32(this.getBytes(4), this._endian);
  }

  getInt64(): bigint {
    return readInt64(this.getBytes(8), this._endian);
  }

  getUInt64(): bigint {
    return readUInt64(this.getBytes(8), this._endian);
  }

  getSingle(): number {
    return readSingle(this.getBytes(4), this._endian);
  }

  getDouble(): number {
    return readDouble(this.getBytes(8), this._endian);
  }

  getBytes(count: number): Uint8Array;
  getBytes(buffer: Uint8Array, index: number, count: number): number;
  getBytes(arg0: number | Uint8Array, index = 0, count = 0): Uint8Array | number {
    if (typeof arg0 === "number") {
      const total = arg0;
      const buffer = new Uint8Array(total);
      const read = this.getBytes(buffer, 0, total) as number;
      if (read !== total) throw new Error(`Failed to read ${total} bytes from source`);
      return buffer;
    }

    const buffer = arg0;
    if (buffer.length - index < count) {
      throw new RangeError(`Buffer too small for ${count} bytes at index ${index}`);
    }

    let remaining = count;
    let writePos = index;
    while (remaining > 0) {
      if (this.currentIndex === -1 || this.currentData === null || this.currentPos >= this.currentData.length) {
        if (!this.swapBuffers()) throw new Error("Tried to read past end of byte source.");
      }
      const data = this.currentData;
      if (!data) throw new Error("Byte source buffer unavailable.");
      const available = data.length - this.currentPos;
      const take = Math.min(available, remaining);
      buffer.set(data.subarray(this.currentPos, this.currentPos + take), writePos);
      this.currentPos += take;
      this._position += take;
      writePos += take;
      remaining -= take;
    }
    return count;
  }

  getBuffer(count: number): IByteBuffer | null {
    if (count <= 0) return new MemoryByteBuffer(new Uint8Array(0));
    return new MemoryByteBuffer(this.getBytes(count));
  }

  getBufferAsync(count: number): Promise<IByteBuffer | null> {
    return Promise.resolve(this.getBuffer(count));
  }

  goTo(position: number): void {
    this._position = Math.max(0, position);
    this.swapBuffers();
  }

  skip(count: number): void {
    this._position += count;
    this.currentPos += count;
    this.swapBuffers();
  }

  mark(): void {
    this._mark = this._position;
  }

  rewind(): void {
    if (this._mark !== null) {
      this.goTo(this._mark);
    }
  }

  require(count: number): boolean;
  require(count: number, callback: ByteSourceCallback | null, state: unknown): boolean;
  require(count: number, callback: ByteSourceCallback | null = null, state: unknown = null): boolean {
    if (this._position + count <= this._length) return true;
    if (this.fixed) {
      throw new Error(`Requested ${count} bytes past end of byte source.`);
    }
    if (!callback) {
      throw new Error(`Requested ${count} bytes past end of byte source without callback.`);
    }
    this.required = count;
    this.callback = callback;
    this.callbackState = state;
    return false;
  }

  add(buffer: IByteBuffer, last: boolean): void {
    if (this.fixed) {
      throw new Error("Cannot extend fixed length byte source.");
    }
    if (buffer && buffer.size > 0) {
      this.buffers.push(buffer);
      this._length += buffer.size;
      if (this.callback && this._length - this._position >= this.required) {
        const cb = this.callback;
        const st = this.callbackState;
        this.callback = null;
        this.callbackState = null;
        this.required = 0;
        cb(this, st);
      }
    }
    if (last) {
      this.fixed = true;
    }
  }

  getStream(): NodeJS.ReadableStream {
    const data = this.buffers.map((b) => b.data);
    return Readable.from(data);
  }

  private swapBuffers(): boolean {
    let pos = this._position;
    for (let i = 0; i < this.buffers.length; i++) {
      const buf = this.buffers[i]!;
      if (pos < buf.size) {
        this.currentIndex = i;
        this.currentPos = pos;
        this.currentData = buf.data;
        return true;
      }
      pos -= buf.size;
    }
    return false;
  }

  private nextByte(): number {
    if (this.currentIndex === -1 || this.currentData === null || this.currentPos >= this.currentData.length) {
      if (!this.swapBuffers()) throw new Error("Tried to read past end of byte source.");
    }
    this._position += 1;
    return this.currentData![this.currentPos++]!;
  }
}
