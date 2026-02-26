import { TextEncoder } from "node:util";
import type { IByteBuffer } from "./buffer/IByteBuffer.js";
import { MemoryByteBuffer } from "./buffer/MemoryByteBuffer.js";
import { EmptyBuffer } from "./buffer/EmptyBuffer.js";
import * as DicomEncoding from "../core/DicomEncoding.js";

export type TypedArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

export interface TypedArrayConstructor<T extends TypedArray> {
  readonly BYTES_PER_ELEMENT: number;
  new (buffer: ArrayBuffer, byteOffset?: number, length?: number): T;
}

export function toByteBuffer(
  value: string,
  encoding?: string | TextEncoder,
  padding?: number
): IByteBuffer {
  if (value.length === 0) return EmptyBuffer;
  let bytes: Uint8Array;
  if (typeof encoding === "string") {
    bytes = DicomEncoding.encodeString(value, [encoding]);
  } else if (encoding && typeof encoding.encode === "function") {
    bytes = encoding.encode(value);
  } else {
    bytes = new TextEncoder().encode(value);
  }

  if (padding !== undefined && (bytes.length & 1) === 1) {
    const out = new Uint8Array(bytes.length + 1);
    out.set(bytes);
    out[out.length - 1] = padding & 0xff;
    bytes = out;
  }

  return new MemoryByteBuffer(bytes);
}

export function toByteBufferFromArray(values: ArrayBufferView): IByteBuffer {
  const bytes = new Uint8Array(values.buffer, values.byteOffset, values.byteLength);
  return new MemoryByteBuffer(new Uint8Array(bytes));
}

export function toArray<T extends TypedArray>(
  buffer: IByteBuffer,
  ctor: TypedArrayConstructor<T>,
  bitsAllocated?: number
): T {
  const bytesPerElement = ctor.BYTES_PER_ELEMENT;
  const bitsRequested = bytesPerElement * 8;

  if (bitsAllocated !== undefined && bitsAllocated > bitsRequested) {
    throw new RangeError("Bits allocated too large for array type");
  }

  if (bitsAllocated !== undefined && bitsAllocated !== bitsRequested) {
    const count = Math.floor((8 * buffer.size) / bitsAllocated);
    const dst = new Uint8Array(bytesPerElement * count);
    const src = buffer.data;

    for (let j = 0, srcBit = 0; j < count; ++j) {
      for (let i = 0, dstBit = j * bitsRequested; i < bitsAllocated; ++i, ++srcBit, ++dstBit) {
        if ((src[(srcBit / 8) | 0]! & (1 << (srcBit % 8))) !== 0) {
          dst[(dstBit / 8) | 0] |= 1 << (dstBit % 8);
        }
      }
    }

    return new ctor(dst.buffer) as T;
  }

  const count = Math.floor(buffer.size / bytesPerElement);
  const totalBytes = count * bytesPerElement;
  const out = new Uint8Array(totalBytes);
  out.set(buffer.data.subarray(0, totalBytes));
  return new ctor(out.buffer) as T;
}

export function getValue<T extends TypedArray>(
  buffer: IByteBuffer,
  ctor: TypedArrayConstructor<T>,
  index: number
): T[number] {
  const array = toArray(buffer, ctor);
  return array[index];
}

export function unpackLow16(buffer: IByteBuffer): IByteBuffer {
  const src = buffer.data;
  const out = new Uint8Array(Math.floor(src.length / 2));
  for (let i = 0; i < out.length && i * 2 < src.length; i++) {
    out[i] = src[i * 2]!;
  }
  return new MemoryByteBuffer(out);
}

export function unpackHigh16(buffer: IByteBuffer): IByteBuffer {
  const src = buffer.data;
  const out = new Uint8Array(Math.floor(src.length / 2));
  for (let i = 0; i < out.length && (i * 2 + 1) < src.length; i++) {
    out[i] = src[i * 2 + 1]!;
  }
  return new MemoryByteBuffer(out);
}
