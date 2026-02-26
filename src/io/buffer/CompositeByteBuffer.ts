import type { IByteBuffer } from "./IByteBuffer.js";

/**
 * Byte buffer composed of multiple child buffers.
 * Reference: fo-dicom/FO-DICOM.Core/IO/Buffer/CompositeByteBuffer.cs
 */
export class CompositeByteBuffer implements IByteBuffer {
  readonly buffers: IByteBuffer[];

  constructor(buffers?: Iterable<IByteBuffer> | IByteBuffer, ...rest: IByteBuffer[]) {
    if (rest.length > 0) {
      const first = buffers as IByteBuffer | undefined;
      this.buffers = first ? [first, ...rest] : [...rest];
    } else if (!buffers) {
      this.buffers = [];
    } else if (isIterable(buffers)) {
      this.buffers = [...buffers];
    } else {
      this.buffers = [buffers];
    }
  }

  get isMemory(): boolean {
    return this.buffers.every((b) => b.isMemory);
  }

  get size(): number {
    return this.buffers.reduce((sum, b) => sum + b.size, 0);
  }

  get data(): Uint8Array {
    const total = this.size;
    const out = new Uint8Array(total);
    let offset = 0;
    for (const buffer of this.buffers) {
      out.set(buffer.data, offset);
      offset += buffer.size;
    }
    return out;
  }

  getByteRange(offset: number, count: number): Uint8Array {
    if (count <= 0) return new Uint8Array(0);
    if (offset < 0) throw new RangeError(`Offset ${offset} must be >= 0`);
    const total = this.size;
    if (offset >= total) return new Uint8Array(0);

    const available = Math.max(0, Math.min(count, total - offset));
    const out = new Uint8Array(available);

    let remaining = available;
    let outPos = 0;
    let localOffset = offset;

    for (const buffer of this.buffers) {
      if (remaining <= 0) break;
      if (localOffset >= buffer.size) {
        localOffset -= buffer.size;
        continue;
      }
      const take = Math.min(buffer.size - localOffset, remaining);
      if (take > 0) {
        out.set(buffer.getByteRange(localOffset, take), outPos);
        outPos += take;
        remaining -= take;
      }
      localOffset = 0;
    }

    return out;
  }
}

function isIterable(value: unknown): value is Iterable<IByteBuffer> {
  return typeof value === "object" && value !== null && Symbol.iterator in (value as object);
}
