import { describe, it, expect } from "vitest";
import { ByteBufferByteSource } from "../../src/io/ByteBufferByteSource.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import { DicomReader } from "../../src/io/reader/DicomReader.js";
import { DicomDatasetReaderObserver } from "../../src/io/reader/DicomDatasetReaderObserver.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomOtherWordFragment } from "../../src/dataset/DicomFragmentSequence.js";
import * as DicomTags from "../../src/core/DicomTag.generated.js";

function makeSource(bytes: Uint8Array): ByteBufferByteSource {
  return new ByteBufferByteSource([new MemoryByteBuffer(bytes)]);
}

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

describe("DicomDatasetReaderObserver", () => {
  it("updates fallback encodings on SpecificCharacterSet", () => {
    const bytes: number[] = [];
    const charset = "ISO_IR 192";
    pushTag(bytes, 0x0008, 0x0005); // SpecificCharacterSet
    pushVR(bytes, "CS");
    pushUInt16LE(bytes, charset.length);
    bytes.push(...Buffer.from(charset, "ascii"));

    pushTag(bytes, 0x0010, 0x0010); // PatientName
    pushVR(bytes, "PN");
    pushUInt16LE(bytes, 8);
    bytes.push(...Buffer.from("Doe^John", "ascii"));

    const source = makeSource(Uint8Array.from(bytes));
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(dataset);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });

    expect(dataset.fallbackEncodings).toEqual([charset]);
    expect(dataset.getString(DicomTags.PatientName)).toBe("Doe^John");
  });

  it("creates word fragment sequence when BitsAllocated > 8", () => {
    const bytes: number[] = [];
    pushTag(bytes, 0x0028, 0x0100); // BitsAllocated
    pushVR(bytes, "US");
    pushUInt16LE(bytes, 2);
    pushUInt16LE(bytes, 16);

    pushTag(bytes, 0x7fe0, 0x0010); // PixelData
    pushVR(bytes, "OB");
    bytes.push(0x00, 0x00);
    pushUInt32LE(bytes, 0xffffffff);
    pushTag(bytes, 0xfffe, 0xe000); // Item (offset table)
    pushUInt32LE(bytes, 0);
    pushTag(bytes, 0xfffe, 0xe000); // Item (fragment)
    pushUInt32LE(bytes, 2);
    bytes.push(0x01, 0x02);
    pushTag(bytes, 0xfffe, 0xe0dd); // Sequence Delimitation
    pushUInt32LE(bytes, 0);

    const source = makeSource(Uint8Array.from(bytes));
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(dataset);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });

    const fragment = dataset.getDicomItem(DicomTags.PixelData);
    expect(fragment).toBeInstanceOf(DicomOtherWordFragment);
    const frag = fragment as DicomOtherWordFragment;
    expect(frag.offsetTable.length).toBe(0);
    expect(frag.fragments.length).toBe(1);
    expect(Array.from(frag.fragments[0]!.data)).toEqual([0x01, 0x02]);
  });
});
