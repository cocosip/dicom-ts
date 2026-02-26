import { Endian } from "../core/DicomTransferSyntax.js";
import { LocalEndian, swapBytes } from "./buffer/byteSwap.js";

export { Endian };

export const LocalMachine: Endian = LocalEndian;
export const Network: Endian = Endian.Big;

export function swap(unitSize: number, bytes: Uint8Array, count = bytes.length): void {
  swapBytes(unitSize, bytes, count);
}

export function isLittle(endian: Endian): boolean {
  return endian === Endian.Little;
}

export function isBig(endian: Endian): boolean {
  return endian === Endian.Big;
}
