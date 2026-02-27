import { describe, it, expect } from "vitest";
import { ByteBufferByteSource } from "../../src/io/ByteBufferByteSource.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import { MemoryByteTarget } from "../../src/io/MemoryByteTarget.js";
import { DicomWriter } from "../../src/io/writer/DicomWriter.js";
import { DicomWriteOptions } from "../../src/io/writer/DicomWriteOptions.js";
import { DicomWriteLengthCalculator } from "../../src/io/writer/DicomWriteLengthCalculator.js";
import { DicomReader } from "../../src/io/reader/DicomReader.js";
import { DicomDatasetReaderObserver } from "../../src/io/reader/DicomDatasetReaderObserver.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomSequence } from "../../src/dataset/DicomSequence.js";
import {
  DicomLongString,
  DicomOtherByte,
  DicomPersonName,
  DicomUnsignedLong,
  DicomUnsignedShort,
} from "../../src/dataset/DicomElement.js";
import { DicomOtherByteFragment } from "../../src/dataset/DicomFragmentSequence.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { DicomTag } from "../../src/core/DicomTag.js";
import * as DicomTags from "../../src/core/DicomTag.generated.js";

function indexOfPattern(bytes: Uint8Array, pattern: number[]): number {
  const limit = bytes.length - pattern.length;
  for (let i = 0; i <= limit; i++) {
    let matched = true;
    for (let j = 0; j < pattern.length; j++) {
      if (bytes[i + j] !== pattern[j]) {
        matched = false;
        break;
      }
    }
    if (matched) return i;
  }
  return -1;
}

function readUInt32LE(bytes: Uint8Array, offset: number): number {
  return (
    bytes[offset]!
    | (bytes[offset + 1]! << 8)
    | (bytes[offset + 2]! << 16)
    | (bytes[offset + 3]! << 24)
  ) >>> 0;
}

describe("DicomWriteOptions", () => {
  it("defaults match expected values", () => {
    const options = new DicomWriteOptions();
    expect(options.explicitLengthSequences).toBe(false);
    expect(options.explicitLengthSequenceItems).toBe(false);
    expect(options.keepGroupLengths).toBe(false);
    expect(options.largeObjectSize).toBe(1024 * 1024);
  });

  it("copy constructor clones values", () => {
    const base = new DicomWriteOptions();
    base.explicitLengthSequences = true;
    base.explicitLengthSequenceItems = true;
    base.keepGroupLengths = true;
    base.largeObjectSize = 1234;
    const copy = new DicomWriteOptions(base);
    expect(copy.explicitLengthSequences).toBe(true);
    expect(copy.explicitLengthSequenceItems).toBe(true);
    expect(copy.keepGroupLengths).toBe(true);
    expect(copy.largeObjectSize).toBe(1234);
  });
});

describe("DicomWriteLengthCalculator", () => {
  it("calculates explicit vs implicit header sizes for OB", () => {
    const element = new DicomOtherByte(DicomTags.PixelData, Uint8Array.from([1, 2, 3, 4]));
    const explicitCalc = new DicomWriteLengthCalculator(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      new DicomWriteOptions()
    );
    const implicitCalc = new DicomWriteLengthCalculator(
      DicomTransferSyntax.ImplicitVRLittleEndian,
      new DicomWriteOptions()
    );
    expect(explicitCalc.calculateItem(element)).toBe(16);
    expect(implicitCalc.calculateItem(element)).toBe(12);
  });

  it("calculates sequence lengths with explicit lengths", () => {
    const inner = new DicomDataset([new DicomUnsignedShort(DicomTags.Rows, 1)]);
    const seq = new DicomSequence(DicomTags.ReferencedStudySequence, inner);
    const options = new DicomWriteOptions();
    options.explicitLengthSequences = true;
    options.explicitLengthSequenceItems = true;
    const calc = new DicomWriteLengthCalculator(DicomTransferSyntax.ExplicitVRLittleEndian, options);
    expect(calc.calculateSequence(seq)).toBe(18);
  });

  it("calculates sequence lengths with delimiters", () => {
    const inner = new DicomDataset([new DicomUnsignedShort(DicomTags.Rows, 1)]);
    const seq = new DicomSequence(DicomTags.ReferencedStudySequence, inner);
    const options = new DicomWriteOptions();
    options.explicitLengthSequences = false;
    options.explicitLengthSequenceItems = false;
    const calc = new DicomWriteLengthCalculator(DicomTransferSyntax.ExplicitVRLittleEndian, options);
    expect(calc.calculateSequence(seq)).toBe(34);
  });
});

describe("DicomWriter", () => {
  it("writes and round-trips explicit VR dataset", () => {
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    dataset.addOrUpdate(new DicomPersonName(DicomTags.PatientName, "Doe^John"));
    dataset.addOrUpdate(new DicomLongString(DicomTags.PatientID, "P001"));

    const target = new MemoryByteTarget();
    const writer = new DicomWriter(DicomTransferSyntax.ExplicitVRLittleEndian, undefined, target);
    writer.write(dataset);

    const source = new ByteBufferByteSource([new MemoryByteBuffer(target.toBuffer())]);
    const out = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(out);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });

    expect(out.getString(DicomTags.PatientName)).toBe("Doe^John");
    expect(out.getString(DicomTags.PatientID)).toBe("P001");
  });

  it("writes and round-trips implicit VR dataset", () => {
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    dataset.addOrUpdate(new DicomPersonName(DicomTags.PatientName, "Doe^Jane"));
    dataset.addOrUpdate(new DicomLongString(DicomTags.PatientID, "P002"));

    const target = new MemoryByteTarget();
    const writer = new DicomWriter(DicomTransferSyntax.ImplicitVRLittleEndian, undefined, target);
    writer.write(dataset);

    const source = new ByteBufferByteSource([new MemoryByteBuffer(target.toBuffer())]);
    const out = new DicomDataset(DicomTransferSyntax.ImplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(out);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ImplicitVRLittleEndian });

    expect(out.getString(DicomTags.PatientName)).toBe("Doe^Jane");
    expect(out.getString(DicomTags.PatientID)).toBe("P002");
  });

  it("writes and round-trips explicit VR big endian dataset", () => {
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRBigEndian);
    dataset.addOrUpdate(new DicomUnsignedShort(DicomTags.Rows, 0x1234));
    dataset.addOrUpdate(new DicomPersonName(DicomTags.PatientName, "Big^Endian"));

    const target = new MemoryByteTarget();
    const writer = new DicomWriter(DicomTransferSyntax.ExplicitVRBigEndian, undefined, target);
    writer.write(dataset);

    const source = new ByteBufferByteSource([new MemoryByteBuffer(target.toBuffer())]);
    const out = new DicomDataset(DicomTransferSyntax.ExplicitVRBigEndian);
    const observer = new DicomDatasetReaderObserver(out);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRBigEndian });

    expect(out.getValue<number>(DicomTags.Rows)).toBe(0x1234);
    expect(out.getString(DicomTags.PatientName)).toBe("Big^Endian");
  });

  it("skips group length elements when KeepGroupLengths is false", () => {
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const groupLengthTag = new DicomTag(0x0008, 0x0000);
    dataset.addOrUpdate(new DicomUnsignedLong(groupLengthTag, 123));
    dataset.addOrUpdate(new DicomLongString(DicomTags.PatientID, "P001"));

    const target = new MemoryByteTarget();
    const writer = new DicomWriter(DicomTransferSyntax.ExplicitVRLittleEndian, undefined, target);
    writer.write(dataset);

    const source = new ByteBufferByteSource([new MemoryByteBuffer(target.toBuffer())]);
    const out = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(out);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });

    expect(out.contains(groupLengthTag)).toBe(false);
    expect(out.getString(DicomTags.PatientID)).toBe("P001");
  });

  it("writes explicit-length sequences", () => {
    const inner = new DicomDataset([new DicomUnsignedShort(DicomTags.Rows, 512)]);
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    dataset.addOrUpdate(new DicomSequence(DicomTags.ReferencedStudySequence, inner));

    const options = new DicomWriteOptions();
    options.explicitLengthSequences = true;
    options.explicitLengthSequenceItems = true;

    const target = new MemoryByteTarget();
    const writer = new DicomWriter(DicomTransferSyntax.ExplicitVRLittleEndian, options, target);
    writer.write(dataset);

    const source = new ByteBufferByteSource([new MemoryByteBuffer(target.toBuffer())]);
    const out = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(out);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });

    const seq = out.getSequence(DicomTags.ReferencedStudySequence);
    expect(seq.items.length).toBe(1);
    expect(seq.items[0]!.getValue<number>(DicomTags.Rows)).toBe(512);
  });

  it("writes private sequences with explicit length even when options disable it", () => {
    const inner = new DicomDataset([new DicomUnsignedShort(DicomTags.Rows, 3)]);
    const privateTag = new DicomTag(0x0011, 0x1001);
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    dataset.addOrUpdate(new DicomSequence(privateTag, inner));

    const options = new DicomWriteOptions();
    options.explicitLengthSequences = false;
    options.explicitLengthSequenceItems = false;

    const target = new MemoryByteTarget();
    const writer = new DicomWriter(DicomTransferSyntax.ExplicitVRLittleEndian, options, target);
    writer.write(dataset);

    const bytes = target.toBuffer();
    const header = [0x11, 0x00, 0x01, 0x10, 0x53, 0x51, 0x00, 0x00]; // (0011,1001) SQ
    const headerIndex = indexOfPattern(bytes, header);
    expect(headerIndex).toBeGreaterThan(-1);
    const length = readUInt32LE(bytes, headerIndex + header.length);
    expect(length).not.toBe(0xffffffff);

    const seqDelim = [0xfe, 0xff, 0xdd, 0xe0];
    expect(indexOfPattern(bytes, seqDelim)).toBe(-1);
  });

  it("writes nested sequences and preserves inner values", () => {
    const innerMost = new DicomDataset([new DicomUnsignedShort(DicomTags.Columns, 7)]);
    const innerSeq = new DicomSequence(DicomTags.ReferencedSeriesSequence, innerMost);
    const inner = new DicomDataset([innerSeq]);
    const outerSeq = new DicomSequence(DicomTags.ReferencedStudySequence, inner);
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    dataset.addOrUpdate(outerSeq);

    const options = new DicomWriteOptions();
    options.explicitLengthSequences = false;
    options.explicitLengthSequenceItems = true;

    const target = new MemoryByteTarget();
    const writer = new DicomWriter(DicomTransferSyntax.ExplicitVRLittleEndian, options, target);
    writer.write(dataset);

    const source = new ByteBufferByteSource([new MemoryByteBuffer(target.toBuffer())]);
    const out = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(out);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });

    const outer = out.getSequence(DicomTags.ReferencedStudySequence);
    const innerOut = outer.items[0]!.getSequence(DicomTags.ReferencedSeriesSequence);
    expect(innerOut.items[0]!.getValue<number>(DicomTags.Columns)).toBe(7);
  });

  it("writes undefined-length sequences with delimiters by default", () => {
    const inner = new DicomDataset([new DicomUnsignedShort(DicomTags.Rows, 1)]);
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    dataset.addOrUpdate(new DicomSequence(DicomTags.ReferencedStudySequence, inner));

    const target = new MemoryByteTarget();
    const writer = new DicomWriter(DicomTransferSyntax.ExplicitVRLittleEndian, undefined, target);
    writer.write(dataset);

    const bytes = target.toBuffer();
    const header = [0x08, 0x00, 0x10, 0x11, 0x53, 0x51, 0x00, 0x00]; // (0008,1110) SQ
    const headerIndex = indexOfPattern(bytes, header);
    expect(headerIndex).toBeGreaterThan(-1);
    const length = readUInt32LE(bytes, headerIndex + header.length);
    expect(length).toBe(0xffffffff);

    const itemDelim = [0xfe, 0xff, 0x0d, 0xe0];
    const seqDelim = [0xfe, 0xff, 0xdd, 0xe0];
    expect(indexOfPattern(bytes, itemDelim)).toBeGreaterThan(-1);
    expect(indexOfPattern(bytes, seqDelim)).toBeGreaterThan(-1);
  });

  it("writes explicit-length sequences without delimiters", () => {
    const inner = new DicomDataset([new DicomUnsignedShort(DicomTags.Rows, 2)]);
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    dataset.addOrUpdate(new DicomSequence(DicomTags.ReferencedStudySequence, inner));

    const options = new DicomWriteOptions();
    options.explicitLengthSequences = true;
    options.explicitLengthSequenceItems = true;

    const target = new MemoryByteTarget();
    const writer = new DicomWriter(DicomTransferSyntax.ExplicitVRLittleEndian, options, target);
    writer.write(dataset);

    const bytes = target.toBuffer();
    const header = [0x08, 0x00, 0x10, 0x11, 0x53, 0x51, 0x00, 0x00]; // (0008,1110) SQ
    const headerIndex = indexOfPattern(bytes, header);
    expect(headerIndex).toBeGreaterThan(-1);
    const length = readUInt32LE(bytes, headerIndex + header.length);
    expect(length).not.toBe(0xffffffff);

    const itemDelim = [0xfe, 0xff, 0x0d, 0xe0];
    const seqDelim = [0xfe, 0xff, 0xdd, 0xe0];
    expect(indexOfPattern(bytes, itemDelim)).toBe(-1);
    expect(indexOfPattern(bytes, seqDelim)).toBe(-1);
  });

  it("writes fragment sequences with offset table", () => {
    const fragment = new DicomOtherByteFragment(DicomTags.PixelData);
    fragment.offsetTable.push(0);
    fragment.fragments.push(new MemoryByteBuffer(Uint8Array.from([1, 2, 3, 4])));

    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    dataset.addOrUpdate(fragment);

    const target = new MemoryByteTarget();
    const writer = new DicomWriter(DicomTransferSyntax.ExplicitVRLittleEndian, undefined, target);
    writer.write(dataset);

    const source = new ByteBufferByteSource([new MemoryByteBuffer(target.toBuffer())]);
    const out = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(out);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });

    const readFragment = out.getDicomItem(DicomTags.PixelData);
    expect(readFragment).toBeDefined();
    const frag = readFragment as DicomOtherByteFragment;
    expect(frag.offsetTable.length).toBe(1);
    expect(frag.offsetTable[0]).toBe(0);
    expect(frag.fragments.length).toBe(1);
    expect(Array.from(frag.fragments[0]!.data)).toEqual([1, 2, 3, 4]);
  });

  it("writes fragment sequences with empty offset table and multiple fragments", () => {
    const fragment = new DicomOtherByteFragment(DicomTags.PixelData);
    fragment.fragments.push(new MemoryByteBuffer(Uint8Array.from([1, 2])));
    fragment.fragments.push(new MemoryByteBuffer(Uint8Array.from([3, 4, 5])));

    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    dataset.addOrUpdate(fragment);

    const target = new MemoryByteTarget();
    const writer = new DicomWriter(DicomTransferSyntax.ExplicitVRLittleEndian, undefined, target);
    writer.write(dataset);

    const source = new ByteBufferByteSource([new MemoryByteBuffer(target.toBuffer())]);
    const out = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(out);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });

    const readFragment = out.getDicomItem(DicomTags.PixelData);
    const frag = readFragment as DicomOtherByteFragment;
    expect(frag.offsetTable.length).toBe(0);
    expect(frag.fragments.length).toBe(2);
    expect(Array.from(frag.fragments[0]!.data)).toEqual([1, 2]);
    expect(Array.from(frag.fragments[1]!.data)).toEqual([3, 4, 5]);
  });

  it("writes fragment sequences with offset table and multiple fragments", () => {
    const fragment = new DicomOtherByteFragment(DicomTags.PixelData);
    fragment.offsetTable.push(0);
    fragment.offsetTable.push(2);
    fragment.fragments.push(new MemoryByteBuffer(Uint8Array.from([10, 11])));
    fragment.fragments.push(new MemoryByteBuffer(Uint8Array.from([12, 13, 14])));

    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    dataset.addOrUpdate(fragment);

    const target = new MemoryByteTarget();
    const writer = new DicomWriter(DicomTransferSyntax.ExplicitVRLittleEndian, undefined, target);
    writer.write(dataset);

    const source = new ByteBufferByteSource([new MemoryByteBuffer(target.toBuffer())]);
    const out = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(out);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });

    const readFragment = out.getDicomItem(DicomTags.PixelData);
    const frag = readFragment as DicomOtherByteFragment;
    expect(frag.offsetTable).toEqual([0, 2]);
    expect(frag.fragments.length).toBe(2);
    expect(Array.from(frag.fragments[0]!.data)).toEqual([10, 11]);
    expect(Array.from(frag.fragments[1]!.data)).toEqual([12, 13, 14]);
  });

  it("writes large OB values with correct 32-bit length", () => {
    const data = new Uint8Array(70000);
    data.fill(0x5a);
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    dataset.addOrUpdate(new DicomOtherByte(DicomTags.PixelData, data));

    const target = new MemoryByteTarget();
    const writer = new DicomWriter(DicomTransferSyntax.ExplicitVRLittleEndian, undefined, target);
    writer.write(dataset);

    const bytes = target.toBuffer();
    const header = [0xe0, 0x7f, 0x10, 0x00, 0x4f, 0x42, 0x00, 0x00]; // (7fe0,0010) OB
    const headerIndex = indexOfPattern(bytes, header);
    expect(headerIndex).toBeGreaterThan(-1);
    const length = readUInt32LE(bytes, headerIndex + header.length);
    expect(length).toBe(data.length);

    const source = new ByteBufferByteSource([new MemoryByteBuffer(bytes)]);
    const out = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const observer = new DicomDatasetReaderObserver(out);
    DicomReader.read(source, observer, { transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian });
    expect(out.getDicomItem(DicomTags.PixelData)!.buffer.size).toBe(data.length);
  });

  it("writes UN VR when explicit 16-bit VR length exceeds limit", () => {
    const longValue = "A".repeat(70000);
    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    dataset.validateItems = false;
    dataset.addOrUpdate(new DicomLongString(DicomTags.PatientID, longValue));

    const target = new MemoryByteTarget();
    const writer = new DicomWriter(DicomTransferSyntax.ExplicitVRLittleEndian, undefined, target);
    writer.write(dataset);

    const bytes = target.toBuffer();
    const header = [0x10, 0x00, 0x20, 0x00, 0x55, 0x4e, 0x00, 0x00]; // (0010,0020) UN
    const headerIndex = indexOfPattern(bytes, header);
    expect(headerIndex).toBeGreaterThan(-1);
    const length = readUInt32LE(bytes, headerIndex + header.length);
    expect(length).toBeGreaterThan(0xfffe);
  });
});
