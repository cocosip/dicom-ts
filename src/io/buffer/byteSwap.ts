import { Endian } from "../../core/DicomTransferSyntax.js";

const LITTLE_ENDIAN =
  new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;

export const LocalEndian: Endian = LITTLE_ENDIAN ? Endian.Little : Endian.Big;

export function swapBytes(unitSize: number, bytes: Uint8Array, count = bytes.length): void {
  if (count <= 1 || unitSize <= 1) return;
  if (count > bytes.length) {
    throw new RangeError(`Cannot swap ${count} bytes of an array with ${bytes.length} bytes`);
  }

  const limit = count - (count % unitSize);

  if (unitSize === 2) {
    for (let i = 0; i < limit; i += 2) {
      const b0 = bytes[i];
      bytes[i] = bytes[i + 1]!;
      bytes[i + 1] = b0!;
    }
    return;
  }

  if (unitSize === 4) {
    for (let i = 0; i < limit; i += 4) {
      const b0 = bytes[i];
      const b1 = bytes[i + 1];
      bytes[i] = bytes[i + 3]!;
      bytes[i + 1] = bytes[i + 2]!;
      bytes[i + 2] = b1!;
      bytes[i + 3] = b0!;
    }
    return;
  }

  for (let i = 0; i < limit; i += unitSize) {
    for (let j = 0; j < unitSize / 2; j++) {
      const a = i + j;
      const b = i + unitSize - 1 - j;
      const tmp = bytes[a]!;
      bytes[a] = bytes[b]!;
      bytes[b] = tmp;
    }
  }
}
