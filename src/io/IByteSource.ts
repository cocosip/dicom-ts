import type { IByteBuffer } from "./buffer/IByteBuffer.js";
import { Endian } from "../core/DicomTransferSyntax.js";

export type ByteSourceCallback = (source: IByteSource, state: unknown) => void;

/**
 * Byte source interface for sequential read operations.
 */
export interface IByteSource {
  endian: Endian;
  readonly position: number;
  readonly isEOF: boolean;

  getUInt8(): number;
  getInt16(): number;
  getUInt16(): number;
  getInt32(): number;
  getUInt32(): number;
  getInt64(): bigint;
  getUInt64(): bigint;
  getSingle(): number;
  getDouble(): number;

  getBytes(count: number): Uint8Array;
  getBytes(buffer: Uint8Array, index: number, count: number): number;

  getBuffer(count: number): IByteBuffer | null;
  getBufferAsync(count: number): Promise<IByteBuffer | null>;

  goTo(position: number): void;
  skip(count: number): void;
  mark(): void;
  rewind(): void;

  require(count: number): boolean;
  require(count: number, callback: ByteSourceCallback | null, state: unknown): boolean;

  getStream(): NodeJS.ReadableStream;
}
