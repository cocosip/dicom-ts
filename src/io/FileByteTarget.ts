import { createWriteStream } from "node:fs";
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
 * File-backed byte target for sequential writing.
 */
export class FileByteTarget implements IByteTarget {
  private _endian: Endian = LocalEndian;
  private _position = 0;
  private readonly stream: NodeJS.WritableStream;

  constructor(readonly filePath: string) {
    this.stream = createWriteStream(filePath, { flags: "w" });
  }

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
    const data = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
    this.stream.write(data);
    this._position += count;
  }

  writeBytesAsync(buffer: Uint8Array, offset = 0, count = buffer.length - offset): Promise<void> {
    const chunk = buffer.subarray(offset, offset + count);
    const data = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
    return new Promise((resolve, reject) => {
      this.stream.write(data, (err) => {
        if (err) {
          reject(err);
          return;
        }
        this._position += count;
        resolve();
      });
    });
  }

  asWritableStream(): NodeJS.WritableStream {
    return this.stream;
  }

  close(): void {
    this.stream.end();
  }
}
