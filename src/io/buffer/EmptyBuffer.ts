import type { IByteBuffer } from "./IByteBuffer.js";

const _empty = new Uint8Array(0);

class _EmptyBuffer implements IByteBuffer {
  readonly isMemory = true as const;
  readonly size      = 0;
  readonly data      = _empty;

  getByteRange(_offset: number, _count: number): Uint8Array {
    return _empty;
  }
}

/** Singleton empty buffer — analogous to fo-dicom's `EmptyBuffer.Value`. */
export const EmptyBuffer: IByteBuffer = new _EmptyBuffer();
