import { Writable } from "node:stream";
import { Endian } from "../core/DicomTransferSyntax.js";
import { LocalEndian } from "./buffer/byteSwap.js";
import type { IByteTarget } from "./IByteTarget.js";
import {
  writeInt16,
  writeUInt16,
  writeInt32,
  writeUInt32,
  writeInt64,
  writeUInt64,
  writeSingle,
  writeDouble,
} from "./internal/byteWriters.js";

/**
 * In-memory byte target for sequential writing.
 */
export class MemoryByteTarget implements IByteTarget {
  private _endian: Endian = LocalEndian;
  private _position = 0;
  private chunks: Uint8Array[] = [];

  get endian(): Endian {
    return this._endian;
  }

  set endian(value: Endian) {
    this._endian = value;
  }

  get position(): number {
    return this._position;
  }

  writeUInt8(value: number): void {
    this.writeBytes(Uint8Array.of(value & 0xff));
  }

  writeInt16(value: number): void {
    this.writeBytes(writeInt16(value, this._endian));
  }

  writeUInt16(value: number): void {
    this.writeBytes(writeUInt16(value, this._endian));
  }

  writeInt32(value: number): void {
    this.writeBytes(writeInt32(value, this._endian));
  }

  writeUInt32(value: number): void {
    this.writeBytes(writeUInt32(value, this._endian));
  }

  writeInt64(value: bigint): void {
    this.writeBytes(writeInt64(value, this._endian));
  }

  writeUInt64(value: bigint): void {
    this.writeBytes(writeUInt64(value, this._endian));
  }

  writeSingle(value: number): void {
    this.writeBytes(writeSingle(value, this._endian));
  }

  writeDouble(value: number): void {
    this.writeBytes(writeDouble(value, this._endian));
  }

  writeBytes(buffer: Uint8Array, offset = 0, count = buffer.length - offset): void {
    const chunk = buffer.subarray(offset, offset + count);
    const copy = new Uint8Array(chunk);
    this.chunks.push(copy);
    this._position += copy.length;
  }

  writeBytesAsync(buffer: Uint8Array, offset = 0, count = buffer.length - offset): Promise<void> {
    this.writeBytes(buffer, offset, count);
    return Promise.resolve();
  }

  asWritableStream(): NodeJS.WritableStream {
    return new Writable({
      write: (chunk, _encoding, callback) => {
        this.writeBytes(chunk as Uint8Array);
        callback();
      },
    });
  }

  toBuffer(): Uint8Array {
    const out = new Uint8Array(this._position);
    let offset = 0;
    for (const chunk of this.chunks) {
      out.set(chunk, offset);
      offset += chunk.length;
    }
    return out;
  }
}
