import { describe, it, expect } from "vitest";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import * as ByteConverter from "../../src/io/ByteConverter.js";

describe("ByteConverter", () => {
  it("converts string to byte buffer with padding", () => {
    const buffer = ByteConverter.toByteBuffer("ABC", undefined, 0x20);
    expect(buffer.size).toBe(4);
    const data = buffer.data;
    expect(String.fromCharCode(...data.subarray(0, 3))).toBe("ABC");
    expect(data[3]).toBe(0x20);
  });

  it("converts typed array to byte buffer and back", () => {
    const values = new Int16Array([1, 513]);
    const buffer = ByteConverter.toByteBufferFromArray(values);
    const back = ByteConverter.toArray(buffer, Int16Array);
    expect(Array.from(back)).toEqual(Array.from(values));
  });

  it("toArray ignores trailing padding bytes", () => {
    const buffer = new MemoryByteBuffer(Uint8Array.from([1, 0, 2, 0, 255]));
    const back = ByteConverter.toArray(buffer, Uint16Array);
    expect(Array.from(back)).toEqual([1, 2]);
  });

  it("toArray supports bitsAllocated < bitsRequested", () => {
    const buffer = new MemoryByteBuffer(Uint8Array.from([0b10101010]));
    const back = ByteConverter.toArray(buffer, Uint8Array, 1);
    expect(Array.from(back)).toEqual([0, 1, 0, 1, 0, 1, 0, 1]);
  });

  it("getValue returns indexed element", () => {
    const buffer = ByteConverter.toByteBufferFromArray(new Int32Array([10, 20, 30]));
    const v = ByteConverter.getValue(buffer, Int32Array, 1);
    expect(v).toBe(20);
  });

  it("unpacks low/high 16 bytes", () => {
    const buffer = new MemoryByteBuffer(Uint8Array.from([0x11, 0x22, 0x33, 0x44]));
    const low = ByteConverter.unpackLow16(buffer);
    const high = ByteConverter.unpackHigh16(buffer);
    expect(Array.from(low.data)).toEqual([0x11, 0x33]);
    expect(Array.from(high.data)).toEqual([0x22, 0x44]);
  });
});
