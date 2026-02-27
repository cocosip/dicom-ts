import { describe, it, expect } from "vitest";
import { ByteBufferByteSource } from "../../src/io/ByteBufferByteSource.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomReader } from "../../src/io/reader/DicomReader.js";
import { DicomDatasetReaderObserver } from "../../src/io/reader/DicomDatasetReaderObserver.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { DicomTag } from "../../src/core/DicomTag.js";
import { DicomOtherByteFragment } from "../../src/dataset/DicomFragmentSequence.js";
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

function pushElementExplicit16(out: number[], group: number, element: number, vr: string, value: Uint8Array): void {
  pushTag(out, group, element);
  pushVR(out, vr);
  pushUInt16LE(out, value.length);
  out.push(...value);
}

function pushElementExplicit32(out: number[], group: number, element: number, vr: string, value: Uint8Array): void {
  pushTag(out, group, element);
  pushVR(out, vr);
  out.push(0x00, 0x00);
  pushUInt32LE(out, value.length);
  out.push(...value);
}

describe("DicomReader", () => {
  it("reads explicit VR little endian elements", () => {
    const value = Buffer.from("Doe^John", "ascii");
    const bytes = Uint8Array.from([
      0x10, 0x00, 0x10, 0x00, // (0010,0010) PatientName
      0x50, 0x4e,             // VR = PN
      0x08, 0x00,             // length = 8
      ...value,
    ]);
    const source = makeSource(bytes);
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(dataset);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });

    expect(dataset.getString(DicomTags.PatientName)).toBe("Doe^John");
  });

  it("reads implicit VR little endian elements", () => {
    const value = Buffer.from("12345 ", "ascii");
    const bytes = Uint8Array.from([
      0x10, 0x00, 0x20, 0x00, // (0010,0020) PatientID
      0x06, 0x00, 0x00, 0x00, // length = 6
      ...value,
    ]);
    const source = makeSource(bytes);
    const dataset = new DicomDataset(DicomTransferSyntax.ImplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(dataset);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ImplicitVRLittleEndian });

    expect(dataset.getString(DicomTags.PatientID)).toBe("12345");
  });

  it("reads sequences with defined length", () => {
    const pnValue = Buffer.from("Doe^John", "ascii");
    const pnElement = Uint8Array.from([
      0x10, 0x00, 0x10, 0x00, // (0010,0010) PatientName
      0x50, 0x4e,             // VR = PN
      0x08, 0x00,             // length = 8
      ...pnValue,
    ]);

    const sequence = Uint8Array.from([
      0x08, 0x00, 0x10, 0x11, // (0008,1110) ReferencedStudySequence
      0x53, 0x51,             // VR = SQ
      0x00, 0x00,             // reserved
      0x18, 0x00, 0x00, 0x00, // length = 24
      0xfe, 0xff, 0x00, 0xe0, // Item tag
      0x10, 0x00, 0x00, 0x00, // item length = 16
      ...pnElement,
    ]);

    const source = makeSource(sequence);
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(dataset);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });

    const seq = dataset.getSequence(DicomTags.ReferencedStudySequence);
    expect(seq.items.length).toBe(1);
    expect(seq.items[0]!.getString(DicomTags.PatientName)).toBe("Doe^John");
  });

  it("reads explicit VR sequence regression bytes (defined length)", () => {
    const bytes = Uint8Array.from([
      0x54, 0x00, 0x63, 0x00, 0x53, 0x51, 0x00, 0x00, 0x24, 0x00, 0x00, 0x00,
      0xfe, 0xff, 0x00, 0xe0, 0x1c, 0x00, 0x00, 0x00,
      0x08, 0x00, 0x16, 0x00, 0x55, 0x49, 0x06, 0x00, 0x31, 0x2e, 0x32, 0x2e, 0x38, 0x34,
      0x08, 0x00, 0x18, 0x00, 0x55, 0x49, 0x06, 0x00, 0x31, 0x2e, 0x33, 0x2e, 0x34, 0x00,
    ]);
    const source = makeSource(bytes);
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(dataset);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });

    const seq = dataset.getSequence(new DicomTag(0x0054, 0x0063));
    expect(seq.items.length).toBe(1);
    expect(seq.items[0]!.getString(DicomTags.SOPClassUID)).toBe("1.2.84");
    expect(seq.items[0]!.getString(DicomTags.SOPInstanceUID)).toBe("1.3.4");
  });

  it("reads explicit VR sequence regression bytes (undefined length)", () => {
    const bytes = Uint8Array.from([
      0x0b, 0x20, 0x9f, 0x70, 0xff, 0xff, 0xff, 0xff,
      0xfe, 0xff, 0x00, 0xe0, 0xff, 0xff, 0xff, 0xff,
      0x08, 0x00, 0x16, 0x00, 0x06, 0x00, 0x00, 0x00, 0x31, 0x2e, 0x32, 0x2e, 0x38, 0x34,
      0x08, 0x00, 0x18, 0x00, 0x06, 0x00, 0x00, 0x00, 0x31, 0x2e, 0x33, 0x2e, 0x34, 0x00,
      0xfe, 0xff, 0x0d, 0xe0, 0x00, 0x00, 0x00, 0x00,
      0xfe, 0xff, 0xdd, 0xe0, 0x00, 0x00, 0x00, 0x00,
    ]);
    const source = makeSource(bytes);
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(dataset);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });

    const seq = dataset.getSequence(new DicomTag(0x200b, 0x709f));
    expect(seq.items.length).toBe(1);
    expect(seq.items[0]!.getString(DicomTags.SOPClassUID)).toBe("1.2.84");
    expect(seq.items[0]!.getString(DicomTags.SOPInstanceUID)).toBe("1.3.4");
  });

  it("reads explicit VR with 32-bit length (OB)", () => {
    const bytes: number[] = [];
    pushElementExplicit32(bytes, 0x7fe0, 0x0010, "OB", Uint8Array.from([1, 2, 3, 4]));
    const source = makeSource(Uint8Array.from(bytes));
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(dataset);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });

    const element = dataset.getDicomItem(DicomTags.PixelData);
    expect(element?.buffer.size).toBe(4);
    expect(Array.from(element!.buffer.data)).toEqual([1, 2, 3, 4]);
  });

  it("reads explicit VR with missing VR bytes and 32-bit length", () => {
    const bytes: number[] = [];
    pushTag(bytes, 0x300a, 0x0084); // BeamDose (DS)
    pushUInt32LE(bytes, 6);
    bytes.push(...Buffer.from("2.015 ", "ascii"));

    const source = makeSource(Uint8Array.from(bytes));
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(dataset);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });

    expect(dataset.getString(DicomTags.BeamDose)).toBe("2.015");
  });

  it("reads undefined-length sequences with delimiters", () => {
    const pnValue = Buffer.from("Doe^John", "ascii");
    const bytes: number[] = [];
    pushTag(bytes, 0x0008, 0x1110); // ReferencedStudySequence
    pushVR(bytes, "SQ");
    bytes.push(0x00, 0x00);
    pushUInt32LE(bytes, 0xffffffff);
    pushTag(bytes, 0xfffe, 0xe000); // Item
    pushUInt32LE(bytes, 0xffffffff);
    pushElementExplicit16(bytes, 0x0010, 0x0010, "PN", pnValue);
    pushTag(bytes, 0xfffe, 0xe00d); // Item Delimitation
    pushUInt32LE(bytes, 0);
    pushTag(bytes, 0xfffe, 0xe0dd); // Sequence Delimitation
    pushUInt32LE(bytes, 0);

    const source = makeSource(Uint8Array.from(bytes));
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(dataset);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });

    const seq = dataset.getSequence(DicomTags.ReferencedStudySequence);
    expect(seq.items.length).toBe(1);
    expect(seq.items[0]!.getString(DicomTags.PatientName)).toBe("Doe^John");
  });

  it("reads sequence with zero-length item", () => {
    const bytes: number[] = [];
    pushTag(bytes, 0x0008, 0x1110); // ReferencedStudySequence
    pushVR(bytes, "SQ");
    bytes.push(0x00, 0x00);
    pushUInt32LE(bytes, 8);
    pushTag(bytes, 0xfffe, 0xe000); // Item
    pushUInt32LE(bytes, 0);

    const source = makeSource(Uint8Array.from(bytes));
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(dataset);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });

    const seq = dataset.getSequence(DicomTags.ReferencedStudySequence);
    expect(seq.items.length).toBe(1);
    expect(seq.items[0]!.count).toBe(0);
  });

  it("reads encapsulated pixel data inside a sequence item", () => {
    const bytes: number[] = [];
    pushTag(bytes, 0x0008, 0x1110); // ReferencedStudySequence
    pushVR(bytes, "SQ");
    bytes.push(0x00, 0x00);
    pushUInt32LE(bytes, 0xffffffff);
    pushTag(bytes, 0xfffe, 0xe000); // Item
    pushUInt32LE(bytes, 0xffffffff);

    pushTag(bytes, 0x7fe0, 0x0010); // PixelData
    pushVR(bytes, "OB");
    bytes.push(0x00, 0x00);
    pushUInt32LE(bytes, 0xffffffff);
    pushTag(bytes, 0xfffe, 0xe000); // Offset table
    pushUInt32LE(bytes, 0);
    pushTag(bytes, 0xfffe, 0xe000); // Fragment
    pushUInt32LE(bytes, 2);
    bytes.push(0x01, 0x02);
    pushTag(bytes, 0xfffe, 0xe0dd); // Sequence Delimitation
    pushUInt32LE(bytes, 0);

    pushTag(bytes, 0xfffe, 0xe00d); // Item Delimitation
    pushUInt32LE(bytes, 0);
    pushTag(bytes, 0xfffe, 0xe0dd); // Sequence Delimitation
    pushUInt32LE(bytes, 0);

    const source = makeSource(Uint8Array.from(bytes));
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(dataset);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });

    const seq = dataset.getSequence(DicomTags.ReferencedStudySequence);
    const item = seq.items[0]!;
    const frag = item.getDicomItem(DicomTags.PixelData) as DicomOtherByteFragment;
    expect(frag.fragments.length).toBe(1);
    expect(Array.from(frag.fragments[0]!.data)).toEqual([0x01, 0x02]);
  });

  it("honors stop condition and leaves position at tag", () => {
    const bytes: number[] = [];
    pushElementExplicit16(bytes, 0x0010, 0x0010, "PN", Buffer.from("Doe^John", "ascii"));
    const stopPos = bytes.length;
    pushElementExplicit16(bytes, 0x0010, 0x0020, "LO", Buffer.from("P001", "ascii"));

    const source = makeSource(Uint8Array.from(bytes));
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(dataset);

    DicomReader.read(source, observer, {
      transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian,
      stop: (tag) => tag.equals(DicomTags.PatientID),
    });

    expect(dataset.tryGetString(DicomTags.PatientName)).toBe("Doe^John");
    expect(dataset.tryGetString(DicomTags.PatientID)).toBeUndefined();
    expect(source.position).toBe(stopPos);
  });

  it("skips remaining bytes when observer consumes part of a value", () => {
    const bytes: number[] = [];
    pushElementExplicit16(bytes, 0x0010, 0x0020, "LO", Buffer.from("P001", "ascii"));
    pushElementExplicit16(bytes, 0x0010, 0x0010, "PN", Buffer.from("Doe^John", "ascii"));

    const source = makeSource(Uint8Array.from(bytes));
    const tags: string[] = [];
    const observer = {
      onBeginSequence: () => {},
      onEndSequence: () => {},
      onBeginSequenceItem: () => {},
      onEndSequenceItem: () => {},
      onBeginTag: (src: ByteBufferByteSource, tag: { toString: () => string }, _vr: unknown, length: number) => {
        tags.push(tag.toString());
        if (length >= 2) src.getBytes(2);
      },
      onEndTag: () => {},
    };

    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });
    expect(tags.length).toBe(2);
    expect(tags[0]).toContain("(0010,0020)");
    expect(tags[1]).toContain("(0010,0010)");
  });
});
