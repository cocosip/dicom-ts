import { describe, it, expect } from "vitest";
import { ByteBufferByteSource } from "../../src/io/ByteBufferByteSource.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import { DicomFileReader } from "../../src/io/reader/DicomFileReader.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import * as DicomTags from "../../src/core/DicomTag.generated.js";

function pushUInt16LE(out: number[], value: number): void {
  out.push(value & 0xff, (value >> 8) & 0xff);
}

function pushUInt32LE(out: number[], value: number): void {
  out.push(value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >> 24) & 0xff);
}

function pushTag(out: number[], group: number, element: number): void {
  pushUInt16LE(out, group);
  pushUInt16LE(out, element);
}

function pushVR(out: number[], vr: string): void {
  out.push(vr.charCodeAt(0), vr.charCodeAt(1));
}

function pushElementExplicit16(out: number[], group: number, element: number, vr: string, value: Uint8Array): void {
  pushTag(out, group, element);
  pushVR(out, vr);
  pushUInt16LE(out, value.length);
  out.push(...value);
}

function padEven(value: Uint8Array): Uint8Array {
  if (value.length % 2 === 0) return value;
  const padded = new Uint8Array(value.length + 1);
  padded.set(value);
  padded[value.length] = 0x00;
  return padded;
}

describe("DicomFileReader", () => {
  it("reads preamble, meta info, and dataset", () => {
    const bytes: number[] = [];
    bytes.push(...new Array(128).fill(0));
    bytes.push(0x44, 0x49, 0x43, 0x4d); // DICM

    const tsUid = "1.2.840.10008.1.2.1";
    const tsValue = padEven(Buffer.from(tsUid, "ascii"));
    pushElementExplicit16(bytes, 0x0002, 0x0010, "UI", tsValue);

    const pnValue = Buffer.from("Doe^John", "ascii");
    pushElementExplicit16(bytes, 0x0010, 0x0010, "PN", pnValue);

    const source = new ByteBufferByteSource([new MemoryByteBuffer(Uint8Array.from(bytes))]);
    const result = DicomFileReader.read(source);

    expect(result.preamble).not.toBeNull();
    expect(result.preamble!.length).toBe(128);
    expect(result.transferSyntax).toBe(DicomTransferSyntax.ExplicitVRLittleEndian);
    expect(result.metaInfo.getString(DicomTags.TransferSyntaxUID)).toBe(tsUid);
    expect(result.dataset.getString(DicomTags.PatientName)).toBe("Doe^John");
  });
});

