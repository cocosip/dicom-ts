/**
 * Bit-packed list backed by a byte array.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Mathematics/BitList.cs
 */
export class BitList {
  /** Internal byte storage. */
  readonly list: number[] = [];

  /** Number of bits this list can currently hold. */
  get capacity(): number {
    return this.list.length * 8;
  }

  set capacity(value: number) {
    let count = value >> 3; // value / 8
    if ((value & 7) > 0) count++;
    while (this.list.length < count) {
      this.list.push(0);
    }
  }

  /** Returns a Uint8Array copy of the internal byte storage. */
  get array(): Uint8Array {
    return new Uint8Array(this.list);
  }

  /** Get the bit at position `pos`. Returns false if out of range. */
  get(pos: number): boolean {
    const p = (pos / 8) | 0;
    const m = pos % 8;
    if (p >= this.list.length) return false;
    return (this.list[p]! & (1 << m)) !== 0;
  }

  /** Set or clear the bit at position `pos`. Expands capacity as needed. */
  set(pos: number, value: boolean): void {
    const p = (pos / 8) | 0;
    const m = pos % 8;
    if (p >= this.list.length) {
      this.capacity = pos + 1;
    }
    if (value) {
      this.list[p]! |= (1 << m);
    } else {
      this.list[p]! &= ~(1 << m);
    }
  }
}
