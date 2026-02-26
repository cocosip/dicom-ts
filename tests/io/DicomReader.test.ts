import { describe, it, expect } from "vitest";
import { ByteBufferByteSource } from "../../src/io/ByteBufferByteSource.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomReader } from "../../src/io/reader/DicomReader.js";
import { DicomDatasetReaderObserver } from "../../src/io/reader/DicomDatasetReaderObserver.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import * as DicomTags from "../../src/core/DicomTag.generated.js";

function makeSource(bytes: Uint8Array): ByteBufferByteSource {
  return new ByteBufferByteSource([new MemoryByteBuffer(bytes)]);
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
});
