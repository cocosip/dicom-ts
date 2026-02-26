import { openSync, closeSync, readSync, statSync } from "node:fs";
import type { IByteBuffer } from "./IByteBuffer.js";

/**
 * Byte buffer backed by a file range.
 * Reference: fo-dicom/FO-DICOM.Core/IO/Buffer/FileByteBuffer.cs
 */
export class FileByteBuffer implements IByteBuffer {
  readonly isMemory = false as const;
  readonly filePath: string;
  readonly position: number;
  readonly size: number;

  constructor(filePath: string, position: number, length?: number) {
    this.filePath = filePath;
    this.position = Math.max(0, position);
    if (length === undefined) {
      const stat = statSync(filePath);
      this.size = Math.max(0, stat.size - this.position);
    } else {
      this.size = Math.max(0, length);
    }
  }

  get data(): Uint8Array {
    return this.getByteRange(0, this.size);
  }

  getByteRange(offset: number, count: number): Uint8Array {
    if (count <= 0) return new Uint8Array(0);
    if (offset < 0) throw new RangeError(`Offset ${offset} must be >= 0`);
    if (offset >= this.size) return new Uint8Array(0);

    const available = Math.min(count, this.size - offset);
    const buffer = Buffer.allocUnsafe(available);
    const fd = openSync(this.filePath, "r");
    try {
      readFully(fd, buffer, this.position + offset);
    } finally {
      closeSync(fd);
    }
    return buffer;
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
    target.subarray(read).fill(0);
  }
}
