import { Endian } from "../../core/DicomTransferSyntax.js";

export function readInt16(bytes: Uint8Array, endian: Endian): number {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getInt16(0, endian === Endian.Little);
}

export function readUInt16(bytes: Uint8Array, endian: Endian): number {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint16(0, endian === Endian.Little);
}

export function readInt32(bytes: Uint8Array, endian: Endian): number {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getInt32(0, endian === Endian.Little);
}

export function readUInt32(bytes: Uint8Array, endian: Endian): number {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(0, endian === Endian.Little);
}

export function readInt64(bytes: Uint8Array, endian: Endian): bigint {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getBigInt64(0, endian === Endian.Little);
}

export function readUInt64(bytes: Uint8Array, endian: Endian): bigint {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getBigUint64(0, endian === Endian.Little);
}

export function readSingle(bytes: Uint8Array, endian: Endian): number {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getFloat32(0, endian === Endian.Little);
}

export function readDouble(bytes: Uint8Array, endian: Endian): number {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getFloat64(0, endian === Endian.Little);
}
