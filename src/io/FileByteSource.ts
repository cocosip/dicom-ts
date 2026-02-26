import { createReadStream, fstatSync, openSync, closeSync, readSync } from "node:fs";
import { Endian } from "../core/DicomTransferSyntax.js";
import { LocalEndian } from "./buffer/byteSwap.js";
import type { IByteSource, ByteSourceCallback } from "./IByteSource.js";
import { FileReadOption, normalizeReadOption } from "./FileReadOption.js";
import type { IByteBuffer } from "./buffer/IByteBuffer.js";
import { EmptyBuffer } from "./buffer/EmptyBuffer.js";
import { MemoryByteBuffer } from "./buffer/MemoryByteBuffer.js";
import { CompositeByteBuffer } from "./buffer/CompositeByteBuffer.js";
import { FileByteBuffer } from "./buffer/FileByteBuffer.js";
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

const DEFAULT_LARGE_OBJECT_SIZE = 64 * 1024;
const MAX_BUFFER_LENGTH = 0x7fffffff;

/**
 * File-backed byte source for sequential reading.
 * Reference: fo-dicom/FO-DICOM.Core/IO/FileByteSource.cs
 */
export class FileByteSource implements IByteSource {
  private readonly fd: number;
  private readonly length: number;
  private _position = 0;
  private _mark: number | null = null;
  private _endian: Endian = LocalEndian;
  private readonly readOption: FileReadOption;
  largeObjectSize: number;

  constructor(
    readonly filePath: string,
    readOption: FileReadOption = FileReadOption.Default,
    largeObjectSize = 0
  ) {
    this.fd = openSync(filePath, "r");
    this.length = fstatSync(this.fd).size;
    this.readOption = normalizeReadOption(readOption);
    this.largeObjectSize = largeObjectSize <= 0 ? DEFAULT_LARGE_OBJECT_SIZE : largeObjectSize;
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

  get isEOF(): boolean {
    return this._position >= this.length;
  }

  getUInt8(): number {
    return this.readBytes(1)[0]!;
  }

  getInt16(): number {
    return readInt16(this.readBytes(2), this._endian);
  }

  getUInt16(): number {
    return readUInt16(this.readBytes(2), this._endian);
  }

  getInt32(): number {
    return readInt32(this.readBytes(4), this._endian);
  }

  getUInt32(): number {
    return readUInt32(this.readBytes(4), this._endian);
  }

  getInt64(): bigint {
    return readInt64(this.readBytes(8), this._endian);
  }

  getUInt64(): bigint {
    return readUInt64(this.readBytes(8), this._endian);
  }

  getSingle(): number {
    return readSingle(this.readBytes(4), this._endian);
  }

  getDouble(): number {
    return readDouble(this.readBytes(8), this._endian);
  }

  getBytes(count: number): Uint8Array;
  getBytes(buffer: Uint8Array, index: number, count: number): number;
  getBytes(arg0: number | Uint8Array, index = 0, count = 0): Uint8Array | number {
    if (typeof arg0 === "number") {
      const out = new Uint8Array(arg0);
      const read = this.getBytes(out, 0, arg0) as number;
      if (read !== arg0) throw new Error(`Failed to read ${arg0} bytes from file`);
      return out;
    }

    const buffer = arg0;
    if (buffer.length - index < count) {
      throw new RangeError(`Buffer too small for ${count} bytes at index ${index}`);
    }
    const view = Buffer.from(buffer.buffer, buffer.byteOffset + index, count);
    readFully(this.fd, view, this._position);
    this._position += count;
    return count;
  }

  getBuffer(count: number): IByteBuffer | null {
    if (count === 0) return EmptyBuffer;
    if (count >= this.largeObjectSize && this.readOption === FileReadOption.ReadLargeOnDemand) {
      const buffer = new FileByteBuffer(this.filePath, this._position, count);
      this._position += count;
      return buffer;
    }
    if (count >= this.largeObjectSize && this.readOption === FileReadOption.SkipLargeTags) {
      this.skip(count);
      return null;
    }
    return this.readIntoMemory(count);
  }

  getBufferAsync(count: number): Promise<IByteBuffer | null> {
    return Promise.resolve(this.getBuffer(count));
  }

  goTo(position: number): void {
    this._position = Math.max(0, position);
  }

  skip(count: number): void {
    this._position += count;
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
  require(count: number, _callback: ByteSourceCallback | null, _state: unknown): boolean;
  require(count: number, _callback: ByteSourceCallback | null = null, _state: unknown = null): boolean {
    return this.length - this._position >= count;
  }

  getStream(): NodeJS.ReadableStream {
    return createReadStream(this.filePath, { start: this._position });
  }

  close(): void {
    closeSync(this.fd);
  }

  private readBytes(count: number): Uint8Array {
    const out = Buffer.allocUnsafe(count);
    readFully(this.fd, out, this._position);
    this._position += count;
    return out;
  }

  private readIntoMemory(count: number): IByteBuffer {
    if (count <= MAX_BUFFER_LENGTH) {
      return new MemoryByteBuffer(this.readBytes(count));
    }
    const buffers: IByteBuffer[] = [];
    let remaining = count;
    while (remaining > 0) {
      const chunk = Math.min(remaining, MAX_BUFFER_LENGTH);
      buffers.push(new MemoryByteBuffer(this.readBytes(chunk)));
      remaining -= chunk;
    }
    return new CompositeByteBuffer(buffers);
  }
}

function readFully(fd: number, target: Buffer, position: number): void {
  let read = 0;
  while (read < target.length) {
    const n = readSync(fd, target, read, target.length - read, position + read);
    if (n === 0) break;
    read += n;
  }
  if (read < target.length) {
    throw new Error(`Unexpected end of file while reading ${target.length} bytes`);
  }
}
