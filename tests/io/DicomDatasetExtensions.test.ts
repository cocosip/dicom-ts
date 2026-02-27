import { describe, it, expect } from "vitest";
import { inflateRawSync } from "node:zlib";
import { ByteBufferByteSource } from "../../src/io/ByteBufferByteSource.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import { MemoryByteTarget } from "../../src/io/MemoryByteTarget.js";
import { DicomReader } from "../../src/io/reader/DicomReader.js";
import { DicomDatasetReaderObserver } from "../../src/io/reader/DicomDatasetReaderObserver.js";
import {
  recalculateGroupLength,
  removeGroupLengths,
  write as writeDataset,
} from "../../src/io/writer/DicomDatasetExtensions.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { DicomTag } from "../../src/core/DicomTag.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import {
  DicomLongString,
  DicomPersonName,
  DicomUnsignedLong,
} from "../../src/dataset/DicomElement.js";
import { DicomSequence } from "../../src/dataset/DicomSequence.js";
import * as DicomTags from "../../src/core/DicomTag.generated.js";

describe("DicomDatasetExtensions (writer)", () => {
  it("recalculates group length for a specific group", () => {
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    dataset.addOrUpdate(new DicomPersonName(DicomTags.PatientName, "Doe^John"));
    dataset.addOrUpdate(new DicomLongString(DicomTags.PatientID, "P001"));

    recalculateGroupLength(dataset, 0x0010, true);

    const groupLengthTag = new DicomTag(0x0010, 0x0000);
    expect(dataset.getValue<number>(groupLengthTag)).toBe(28);
  });

  it("removes group lengths recursively", () => {
    const groupLengthTag = new DicomTag(0x0010, 0x0000);
    const inner = new DicomDataset([
      new DicomUnsignedLong(groupLengthTag, 12),
      new DicomLongString(DicomTags.PatientID, "P1"),
    ]);
    const dataset = new DicomDataset([
      new DicomUnsignedLong(groupLengthTag, 34),
      new DicomPersonName(DicomTags.PatientName, "Doe^John"),
      new DicomSequence(DicomTags.ReferencedStudySequence, inner),
    ]);

    removeGroupLengths(dataset, false);

    expect(dataset.contains(groupLengthTag)).toBe(false);
    expect(inner.contains(groupLengthTag)).toBe(false);
  });

  it("writes dataset content to a byte target", () => {
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    dataset.addOrUpdate(new DicomPersonName(DicomTags.PatientName, "Doe^Jane"));
    dataset.addOrUpdate(new DicomLongString(DicomTags.PatientID, "P002"));

    const target = new MemoryByteTarget();
    writeDataset(dataset, target, DicomTransferSyntax.ExplicitVRLittleEndian);

    const source = new ByteBufferByteSource([new MemoryByteBuffer(target.toBuffer())]);
    const out = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(out);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });

    expect(out.getString(DicomTags.PatientName)).toBe("Doe^Jane");
    expect(out.getString(DicomTags.PatientID)).toBe("P002");
  });

  it("writes deflated dataset bytes that round-trip after inflate", () => {
    const dataset = new DicomDataset(DicomTransferSyntax.DeflatedExplicitVRLittleEndian);
    dataset.addOrUpdate(new DicomPersonName(DicomTags.PatientName, "Deflate^Test"));
    dataset.addOrUpdate(new DicomLongString(DicomTags.PatientID, "D001"));

    const target = new MemoryByteTarget();
    writeDataset(dataset, target, DicomTransferSyntax.DeflatedExplicitVRLittleEndian);

    const inflated = inflateRawSync(target.toBuffer());
    const source = new ByteBufferByteSource([new MemoryByteBuffer(inflated)]);
    const out = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(out);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });

    expect(out.getString(DicomTags.PatientName)).toBe("Deflate^Test");
    expect(out.getString(DicomTags.PatientID)).toBe("D001");
  });
});
