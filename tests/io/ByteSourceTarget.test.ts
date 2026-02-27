import { describe, it, expect } from "vitest";
import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync, unlinkSync, openSync, closeSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PassThrough, Readable } from "node:stream";
import { once } from "node:events";

import { Endian, FileReadOption } from "../../src/io/index.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import { FileByteBuffer } from "../../src/io/buffer/FileByteBuffer.js";
import { StreamByteBuffer } from "../../src/io/buffer/StreamByteBuffer.js";
import { ByteBufferByteSource } from "../../src/io/ByteBufferByteSource.js";
import { FileByteSource } from "../../src/io/FileByteSource.js";
import { StreamByteSource } from "../../src/io/StreamByteSource.js";
import { MemoryByteTarget } from "../../src/io/MemoryByteTarget.js";
import { StreamByteTarget } from "../../src/io/StreamByteTarget.js";
import { FileByteTarget } from "../../src/io/FileByteTarget.js";

function tempPath(): string {
  return join(tmpdir(), `dicom-ts-${randomBytes(8).toString("hex")}.bin`);
}

describe("IByteSource implementations", () => {
  it("ByteBufferByteSource reads primitives and supports mark/rewind", () => {
    const buffers = [
      new MemoryByteBuffer(Uint8Array.from([0x01, 0x02, 0x03, 0x04])),
      new MemoryByteBuffer(Uint8Array.from([0x05, 0x06, 0x07, 0x08])),
    ];
    const source = new ByteBufferByteSource(buffers);
    source.endian = Endian.Little;

    expect(source.getUInt16()).toBe(0x0201);
    source.mark();
    expect(source.getUInt16()).toBe(0x0403);
    source.rewind();
    expect(source.getUInt16()).toBe(0x0403);
    expect(source.getUInt32()).toBe(0x08070605);
  });

  it("ByteBufferByteSource require callback fires when data arrives", () => {
    const source = new ByteBufferByteSource();
    let fired = false;
    const ok = source.require(4, () => { fired = true; }, null);
    expect(ok).toBe(false);
    source.add(new MemoryByteBuffer(Uint8Array.from([1, 2, 3, 4])), true);
    expect(fired).toBe(true);
    expect(source.require(4)).toBe(true);
  });

  it("ByteBufferByteSource throws when requiring beyond fixed length", () => {
    const source = new ByteBufferByteSource([new MemoryByteBuffer(Uint8Array.from([1, 2]))]);
    expect(() => source.require(4)).toThrow(Error);
  });

  it("ByteBufferByteSource getBytes buffer too small throws", () => {
    const source = new ByteBufferByteSource([new MemoryByteBuffer(Uint8Array.from([1, 2, 3]))]);
    const target = new Uint8Array(2);
    expect(() => source.getBytes(target, 0, 3)).toThrow(RangeError);
  });

  it("ByteBufferByteSource getStream yields concatenated data", async () => {
    const source = new ByteBufferByteSource([
      new MemoryByteBuffer(Uint8Array.from([1, 2])),
      new MemoryByteBuffer(Uint8Array.from([3, 4])),
    ]);
    const stream = source.getStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream as Readable) {
      chunks.push(Buffer.from(chunk as Uint8Array));
    }
    expect(Array.from(Buffer.concat(chunks))).toEqual([1, 2, 3, 4]);
  });

  it("FileByteSource handles read options and buffers", () => {
    const path = tempPath();
    const data = Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]);
    writeFileSync(path, data);
    try {
      const readAll = new FileByteSource(path, FileReadOption.ReadAll, 4);
      readAll.endian = Endian.Big;
      expect(readAll.getUInt16()).toBe(0x0102);
      readAll.mark();
      const v = readAll.getUInt32();
      readAll.rewind();
      expect(readAll.getUInt32()).toBe(v);
      readAll.goTo(0);
      const buf = readAll.getBuffer(4);
      expect(buf).toBeInstanceOf(MemoryByteBuffer);
      readAll.close();

      const onDemand = new FileByteSource(path, FileReadOption.ReadLargeOnDemand, 4);
      const buf2 = onDemand.getBuffer(4);
      expect(buf2).toBeInstanceOf(FileByteBuffer);
      expect(onDemand.position).toBe(4);
      onDemand.close();

      const skip = new FileByteSource(path, FileReadOption.SkipLargeTags, 4);
      const buf3 = skip.getBuffer(4);
      expect(buf3).toBeNull();
      expect(skip.position).toBe(4);
      skip.close();
    } finally {
      unlinkSync(path);
    }
  });

  it("StreamByteSource reads from fd and returns StreamByteBuffer on demand", () => {
    const path = tempPath();
    const data = Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]);
    writeFileSync(path, data);
    const fd = openSync(path, "r");
    try {
      const source = new StreamByteSource(fd, FileReadOption.ReadLargeOnDemand, 4, data.length);
      source.endian = Endian.Little;
      expect(source.getUInt16()).toBe(0x0201);
      const buf = source.getBuffer(4);
      expect(buf).toBeInstanceOf(StreamByteBuffer);
    } finally {
      closeSync(fd);
      unlinkSync(path);
    }
  });
});

describe("IByteTarget implementations", () => {
  it("MemoryByteTarget writes primitives with endian", () => {
    const target = new MemoryByteTarget();
    target.endian = Endian.Big;
    target.writeUInt16(0x1234);
    target.writeUInt32(0x01020304);
    target.writeBytes(Uint8Array.from([0xff]));
    const out = target.toBuffer();
    expect(Array.from(out)).toEqual([0x12, 0x34, 0x01, 0x02, 0x03, 0x04, 0xff]);
  });

  it("StreamByteTarget writes to stream", async () => {
    const stream = new PassThrough();
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    const target = new StreamByteTarget(stream);
    target.endian = Endian.Big;
    target.writeUInt16(0x1234);
    await target.writeBytesAsync(Uint8Array.from([0x55, 0x66]));
    stream.end();
    await once(stream, "finish");
    const out = Buffer.concat(chunks);
    expect(Array.from(out)).toEqual([0x12, 0x34, 0x55, 0x66]);
  });

  it("FileByteTarget writes to file", async () => {
    const path = tempPath();
    const target = new FileByteTarget(path);
    const stream = target.asWritableStream();
    const done = once(stream, "finish");
    target.endian = Endian.Little;
    target.writeUInt16(0x1234);
    await target.writeBytesAsync(Uint8Array.from([0xaa, 0xbb]));
    target.close();
    await done;
    const out = readFileSync(path);
    expect(Array.from(out)).toEqual([0x34, 0x12, 0xaa, 0xbb]);
    unlinkSync(path);
  });
});
