import { describe, it, expect } from "vitest";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ByteBufferByteSource } from "../../src/io/ByteBufferByteSource.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import { FileByteSource } from "../../src/io/FileByteSource.js";
import { MemoryByteTarget } from "../../src/io/MemoryByteTarget.js";
import { DicomFileReader } from "../../src/io/reader/DicomFileReader.js";
import { DicomFileWriter } from "../../src/io/writer/DicomFileWriter.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomSequence } from "../../src/dataset/DicomSequence.js";
import {
  DicomPersonName,
  DicomUniqueIdentifier,
  DicomUnsignedShort,
} from "../../src/dataset/DicomElement.js";
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

  it("reads deflated file with sequence from file-backed source", () => {
    const metaInfo = new DicomDataset();
    metaInfo.addOrUpdate(
      new DicomUniqueIdentifier(DicomTags.TransferSyntaxUID, DicomTransferSyntax.DeflatedExplicitVRLittleEndian)
    );

    const inner = new DicomDataset([new DicomUnsignedShort(DicomTags.Rows, 5)]);
    const dataset = new DicomDataset(DicomTransferSyntax.DeflatedExplicitVRLittleEndian);
    dataset.addOrUpdate(new DicomPersonName(DicomTags.PatientName, "Deflate^Seq"));
    dataset.addOrUpdate(new DicomSequence(DicomTags.ReferencedStudySequence, inner));

    const target = new MemoryByteTarget();
    const writer = new DicomFileWriter();
    writer.write(target, metaInfo, dataset);

    const dir = mkdtempSync(join(tmpdir(), "dicom-ts-"));
    const filePath = join(dir, "deflated-seq.dcm");
    writeFileSync(filePath, Buffer.from(target.toBuffer()));

    const source = new FileByteSource(filePath);
    try {
      const result = DicomFileReader.read(source);
      expect(result.transferSyntax).toBe(DicomTransferSyntax.DeflatedExplicitVRLittleEndian);
      expect(result.dataset.getString(DicomTags.PatientName)).toBe("Deflate^Seq");
      const seq = result.dataset.getSequence(DicomTags.ReferencedStudySequence);
      expect(seq.items.length).toBe(1);
      expect(seq.items[0]!.getValue<number>(DicomTags.Rows)).toBe(5);
    } finally {
      source.close();
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("reads dataset without preamble or meta info", () => {
    const bytes: number[] = [];
    const pnValue = Buffer.from("NoMeta^File", "ascii");
    pushElementExplicit16(bytes, 0x0010, 0x0010, "PN", pnValue);

    const source = new ByteBufferByteSource([new MemoryByteBuffer(Uint8Array.from(bytes))]);
    const result = DicomFileReader.read(source);

    expect(result.preamble).toBeNull();
    expect(result.metaInfo.count).toBe(0);
    expect(result.transferSyntax).toBe(DicomTransferSyntax.ExplicitVRLittleEndian);
    expect(result.dataset.getString(DicomTags.PatientName)).toBe("NoMeta^File");
  });
});
