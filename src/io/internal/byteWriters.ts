import { Endian } from "../../core/DicomTransferSyntax.js";

export function writeInt16(value: number, endian: Endian): Uint8Array {
  const buf = new ArrayBuffer(2);
  new DataView(buf).setInt16(0, value, endian === Endian.Little);
  return new Uint8Array(buf);
}

export function writeUInt16(value: number, endian: Endian): Uint8Array {
  const buf = new ArrayBuffer(2);
  new DataView(buf).setUint16(0, value, endian === Endian.Little);
  return new Uint8Array(buf);
}

export function writeInt32(value: number, endian: Endian): Uint8Array {
  const buf = new ArrayBuffer(4);
  new DataView(buf).setInt32(0, value, endian === Endian.Little);
  return new Uint8Array(buf);
}

export function writeUInt32(value: number, endian: Endian): Uint8Array {
  const buf = new ArrayBuffer(4);
  new DataView(buf).setUint32(0, value, endian === Endian.Little);
  return new Uint8Array(buf);
}

export function writeInt64(value: bigint, endian: Endian): Uint8Array {
  const buf = new ArrayBuffer(8);
  new DataView(buf).setBigInt64(0, value, endian === Endian.Little);
  return new Uint8Array(buf);
}

export function writeUInt64(value: bigint, endian: Endian): Uint8Array {
  const buf = new ArrayBuffer(8);
  new DataView(buf).setBigUint64(0, value, endian === Endian.Little);
  return new Uint8Array(buf);
}

export function writeSingle(value: number, endian: Endian): Uint8Array {
  const buf = new ArrayBuffer(4);
  new DataView(buf).setFloat32(0, value, endian === Endian.Little);
  return new Uint8Array(buf);
}

export function writeDouble(value: number, endian: Endian): Uint8Array {
  const buf = new ArrayBuffer(8);
  new DataView(buf).setFloat64(0, value, endian === Endian.Little);
  return new Uint8Array(buf);
}
