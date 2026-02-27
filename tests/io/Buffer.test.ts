import { describe, it, expect } from "vitest";
import { randomBytes } from "node:crypto";
import { closeSync, existsSync, openSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import { EmptyBuffer } from "../../src/io/buffer/EmptyBuffer.js";
import { LazyByteBuffer } from "../../src/io/buffer/LazyByteBuffer.js";
import { CompositeByteBuffer } from "../../src/io/buffer/CompositeByteBuffer.js";
import { RangeByteBuffer } from "../../src/io/buffer/RangeByteBuffer.js";
import { EndianByteBuffer } from "../../src/io/buffer/EndianByteBuffer.js";
import { EvenLengthBuffer } from "../../src/io/buffer/EvenLengthBuffer.js";
import { SwapByteBuffer } from "../../src/io/buffer/SwapByteBuffer.js";
import { FileByteBuffer } from "../../src/io/buffer/FileByteBuffer.js";
import { StreamByteBuffer } from "../../src/io/buffer/StreamByteBuffer.js";
import { TempFileBuffer } from "../../src/io/buffer/TempFileBuffer.js";
import { BulkDataUriByteBuffer } from "../../src/io/buffer/BulkDataUriByteBuffer.js";
import { swapBytes } from "../../src/io/buffer/byteSwap.js";
import { Endian } from "../../src/core/DicomTransferSyntax.js";
import { LocalEndian } from "../../src/io/buffer/byteSwap.js";

function tempPath(): string {
  return join(tmpdir(), `dicom-ts-${randomBytes(8).toString("hex")}.bin`);
}

describe("MemoryByteBuffer and EmptyBuffer", () => {
  it("MemoryByteBuffer exposes data and ranges", () => {
    const buffer = new MemoryByteBuffer([1, 2, 3, 4]);
    expect(buffer.isMemory).toBe(true);
    expect(buffer.size).toBe(4);
    expect(Array.from(buffer.data)).toEqual([1, 2, 3, 4]);
    expect(Array.from(buffer.getByteRange(1, 2))).toEqual([2, 3]);
  });

  it("EmptyBuffer returns empty ranges", () => {
    expect(EmptyBuffer.isMemory).toBe(true);
    expect(EmptyBuffer.size).toBe(0);
    expect(EmptyBuffer.data.length).toBe(0);
    expect(EmptyBuffer.getByteRange(0, 10).length).toBe(0);
  });
});

describe("LazyByteBuffer", () => {
  it("materializes data lazily and caches the result", () => {
    let calls = 0;
    const buffer = new LazyByteBuffer(() => {
      calls += 1;
      return Uint8Array.from([9, 8, 7]);
    });
    expect(calls).toBe(0);
    expect(buffer.size).toBe(3);
    expect(calls).toBe(1);
    const first = buffer.data;
    const second = buffer.data;
    expect(first).toBe(second);
    expect(calls).toBe(1);
    expect(Array.from(buffer.getByteRange(1, 2))).toEqual([8, 7]);
  });
});

describe("CompositeByteBuffer", () => {
  it("concatenates buffers and reads across boundaries", () => {
    const buffer = new CompositeByteBuffer(
      new MemoryByteBuffer([1, 2]),
      new MemoryByteBuffer([3, 4, 5]),
    );
    expect(buffer.isMemory).toBe(true);
    expect(buffer.size).toBe(5);
    expect(Array.from(buffer.data)).toEqual([1, 2, 3, 4, 5]);
    expect(Array.from(buffer.getByteRange(1, 3))).toEqual([2, 3, 4]);
    expect(Array.from(buffer.getByteRange(4, 10))).toEqual([5]);
    expect(Array.from(buffer.getByteRange(5, 1))).toEqual([]);
    expect(() => buffer.getByteRange(-1, 1)).toThrow(RangeError);
  });

  it("reports non-memory when any child is non-memory", () => {
    const path = tempPath();
    writeFileSync(path, Uint8Array.from([1, 2, 3]));
    try {
      const composite = new CompositeByteBuffer(
        new MemoryByteBuffer([9]),
        new FileByteBuffer(path, 0, 2),
      );
      expect(composite.isMemory).toBe(false);
    } finally {
      unlinkSync(path);
    }
  });
});

describe("RangeByteBuffer", () => {
  it("reads a sub-range of another buffer", () => {
    const base = new MemoryByteBuffer([10, 20, 30, 40, 50]);
    const range = new RangeByteBuffer(base, 1, 3);
    expect(range.size).toBe(3);
    expect(Array.from(range.data)).toEqual([20, 30, 40]);
    expect(Array.from(range.getByteRange(1, 2))).toEqual([30, 40]);
    expect(Array.from(range.getByteRange(3, 1))).toEqual([]);
    expect(() => range.getByteRange(-1, 1)).toThrow(RangeError);
  });

  it("clamps negative constructor values to zero", () => {
    const base = new MemoryByteBuffer([1, 2, 3]);
    const range = new RangeByteBuffer(base, -5, -1);
    expect(range.size).toBe(0);
    expect(Array.from(range.data)).toEqual([]);
  });
});

describe("EndianByteBuffer and SwapByteBuffer", () => {
  it("Endianness wrapper swaps bytes when needed", () => {
    const base = new MemoryByteBuffer([0x01, 0x02, 0x03, 0x04]);
    const otherEndian = LocalEndian === Endian.Little ? Endian.Big : Endian.Little;
    const swapped = EndianByteBuffer.create(base, otherEndian, 2);
    expect(swapped).not.toBe(base);
    expect(Array.from(swapped.data)).toEqual([0x02, 0x01, 0x04, 0x03]);
    expect(Array.from(swapped.getByteRange(0, 2))).toEqual([0x02, 0x01]);

    const sameEndian = EndianByteBuffer.create(base, LocalEndian, 2);
    expect(sameEndian).toBe(base);
    const unitOne = EndianByteBuffer.create(base, otherEndian, 1);
    expect(unitOne).toBe(base);
  });

  it("SwapByteBuffer always swaps by unit size", () => {
    const base = new MemoryByteBuffer([0x10, 0x11, 0x20, 0x21]);
    const swapped = new SwapByteBuffer(base, 2);
    expect(Array.from(swapped.data)).toEqual([0x11, 0x10, 0x21, 0x20]);
    expect(Array.from(swapped.getByteRange(0, 2))).toEqual([0x11, 0x10]);
  });
});

describe("EvenLengthBuffer", () => {
  it("pads odd-length buffers with a zero byte", () => {
    const base = new MemoryByteBuffer([1, 2, 3]);
    const even = EvenLengthBuffer.create(base);
    expect(even).not.toBe(base);
    expect(even.size).toBe(4);
    expect(Array.from(even.data)).toEqual([1, 2, 3, 0]);
    expect(Array.from(even.getByteRange(2, 2))).toEqual([3, 0]);
    expect(Array.from(even.getByteRange(4, 1))).toEqual([]);
    expect(() => even.getByteRange(-1, 1)).toThrow(RangeError);
  });

  it("returns the original buffer when already even length", () => {
    const base = new MemoryByteBuffer([1, 2, 3, 4]);
    const even = EvenLengthBuffer.create(base);
    expect(even).toBe(base);
  });
});

describe("FileByteBuffer", () => {
  it("reads a specified file range", () => {
    const path = tempPath();
    writeFileSync(path, Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]));
    try {
      const buffer = new FileByteBuffer(path, 2, 4);
      expect(buffer.isMemory).toBe(false);
      expect(buffer.size).toBe(4);
      expect(Array.from(buffer.data)).toEqual([3, 4, 5, 6]);
      expect(Array.from(buffer.getByteRange(1, 2))).toEqual([4, 5]);
      expect(Array.from(buffer.getByteRange(4, 1))).toEqual([]);
      expect(() => buffer.getByteRange(-1, 1)).toThrow(RangeError);
    } finally {
      unlinkSync(path);
    }
  });

  it("pads with zeros when reading beyond end of file", () => {
    const path = tempPath();
    writeFileSync(path, Uint8Array.from([9, 8, 7]));
    try {
      const buffer = new FileByteBuffer(path, 1, 5);
      expect(buffer.size).toBe(5);
      expect(Array.from(buffer.data)).toEqual([8, 7, 0, 0, 0]);
    } finally {
      unlinkSync(path);
    }
  });
});

describe("StreamByteBuffer", () => {
  it("reads a specified stream range", () => {
    const path = tempPath();
    writeFileSync(path, Uint8Array.from([1, 2, 3, 4, 5, 6]));
    const fd = openSync(path, "r");
    try {
      const buffer = new StreamByteBuffer(fd, 1, 3);
      expect(buffer.isMemory).toBe(false);
      expect(buffer.size).toBe(3);
      expect(Array.from(buffer.data)).toEqual([2, 3, 4]);

      const streamLike = new StreamByteBuffer({ fd }, 0, 2);
      expect(Array.from(streamLike.data)).toEqual([1, 2]);
    } finally {
      closeSync(fd);
      unlinkSync(path);
    }
  });

  it("throws when stream has no file descriptor", () => {
    expect(() => new StreamByteBuffer({}, 0, 1)).toThrow(Error);
  });

  it("pads with zeros when reading beyond end of stream", () => {
    const path = tempPath();
    writeFileSync(path, Uint8Array.from([1, 2, 3]));
    const fd = openSync(path, "r");
    try {
      const buffer = new StreamByteBuffer(fd, 1, 5);
      expect(buffer.size).toBe(5);
      expect(Array.from(buffer.data)).toEqual([2, 3, 0, 0, 0]);
    } finally {
      closeSync(fd);
      unlinkSync(path);
    }
  });
});

describe("TempFileBuffer", () => {
  it("creates a temp file and reads ranges", () => {
    const buffer = new TempFileBuffer([9, 8, 7]);
    try {
      expect(buffer.isMemory).toBe(false);
      expect(buffer.size).toBe(3);
      expect(Array.from(buffer.data)).toEqual([9, 8, 7]);
      expect(Array.from(buffer.getByteRange(1, 10))).toEqual([8, 7]);
      expect(existsSync(buffer.path)).toBe(true);
    } finally {
      buffer.cleanup();
      expect(existsSync(buffer.path)).toBe(false);
    }
  });
});

describe("BulkDataUriByteBuffer", () => {
  it("requires data to be set before access", () => {
    const buffer = new BulkDataUriByteBuffer("dicom://bulk/data");
    expect(buffer.isMemory).toBe(false);
    expect(() => buffer.size).toThrow(Error);
    expect(() => buffer.data).toThrow(Error);
    expect(() => buffer.getByteRange(0, 1)).toThrow(Error);

    buffer.data = Uint8Array.from([4, 5, 6]);
    expect(buffer.isMemory).toBe(true);
    expect(buffer.size).toBe(3);
    expect(Array.from(buffer.data)).toEqual([4, 5, 6]);
    expect(Array.from(buffer.getByteRange(1, 2))).toEqual([5, 6]);
  });
});

describe("byteSwap", () => {
  it("swaps 8-byte units and respects count", () => {
    const bytes = Uint8Array.from([
      1, 2, 3, 4, 5, 6, 7, 8,
      9, 10, 11, 12, 13, 14, 15, 16,
    ]);
    swapBytes(8, bytes, 8);
    expect(Array.from(bytes)).toEqual([
      8, 7, 6, 5, 4, 3, 2, 1,
      9, 10, 11, 12, 13, 14, 15, 16,
    ]);
  });

  it("throws when count exceeds buffer length", () => {
    const bytes = Uint8Array.from([1, 2, 3, 4]);
    expect(() => swapBytes(2, bytes, 6)).toThrow(RangeError);
  });

  it("is a no-op for unit size 1 or count <= 1", () => {
    const bytes = Uint8Array.from([1, 2, 3, 4]);
    swapBytes(1, bytes);
    expect(Array.from(bytes)).toEqual([1, 2, 3, 4]);
    swapBytes(4, bytes, 1);
    expect(Array.from(bytes)).toEqual([1, 2, 3, 4]);
  });
});
