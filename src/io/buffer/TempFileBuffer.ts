import { randomBytes } from "node:crypto";
import { openSync, closeSync, readSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type { IByteBuffer } from "./IByteBuffer.js";

/**
 * Temporary file-backed byte buffer.
 * Reference: fo-dicom/FO-DICOM.Core/IO/Buffer/TempFileBuffer.cs
 */
export class TempFileBuffer implements IByteBuffer {
  readonly isMemory = false as const;
  readonly path: string;
  readonly size: number;

  constructor(data: Uint8Array | ArrayBuffer | number[]) {
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    this.size = bytes.byteLength;
    this.path = join(tmpdir(), `dicom-ts-${randomBytes(16).toString("hex")}.tmp`);
    writeFileSync(this.path, bytes);
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
    const fd = openSync(this.path, "r");
    try {
      readFully(fd, buffer, offset);
    } finally {
      closeSync(fd);
    }
    return buffer;
  }

  cleanup(): void {
    try {
      unlinkSync(this.path);
    } catch {
      // ignore
    }
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
