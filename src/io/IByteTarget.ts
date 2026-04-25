import { Endian } from "../core/DicomTransferSyntax.js";

export type ByteTargetCallback = (target: IByteTarget, state: unknown) => void;

export interface WritableByteStreamLike {
  write(chunk: Uint8Array): unknown;
  end?: () => unknown;
  once?: (event: string, listener: (...args: unknown[]) => void) => unknown;
  on?: (event: string, listener: (...args: unknown[]) => void) => unknown;
}

/**
 * Byte target interface for sequential write operations.
 */
export interface IByteTarget {
  endian: Endian;
  readonly position: number;

  writeUInt8(value: number): void;
  writeInt16(value: number): void;
  writeUInt16(value: number): void;
  writeInt32(value: number): void;
  writeUInt32(value: number): void;
  writeInt64(value: bigint): void;
  writeUInt64(value: bigint): void;
  writeSingle(value: number): void;
  writeDouble(value: number): void;

  writeBytes(buffer: Uint8Array, offset?: number, count?: number): void;
  writeBytesAsync(buffer: Uint8Array, offset?: number, count?: number): Promise<void>;

  asWritableStream(): WritableByteStreamLike;
}
