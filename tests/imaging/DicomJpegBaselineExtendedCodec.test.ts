import { describe, expect, it } from "vitest";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomOtherByte, DicomOtherWord } from "../../src/dataset/DicomElement.js";
import { DicomOtherByteFragment } from "../../src/dataset/DicomFragmentSequence.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import {
  DicomJpegProcess1Codec,
  DicomJpegProcess2_4Codec,
  type DicomJpegFrameContext,
} from "../../src/imaging/codec/jpeg/index.js";
import { DicomTranscoder } from "../../src/imaging/codec/DicomTranscoder.js";
import { TranscoderManager } from "../../src/imaging/codec/TranscoderManager.js";

function buildDataset(
  syntax: DicomTransferSyntax,
  bitsAllocated: number,
  bitsStored: number,
  columns: number = 2,
  rawPixelData?: Uint8Array | Uint16Array,
): DicomDataset {
  const ds = new DicomDataset(syntax);
  ds.addOrUpdateElement(DicomVR.US, Tags.Rows, 1);
  ds.addOrUpdateElement(DicomVR.US, Tags.Columns, columns);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, bitsAllocated);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, bitsStored);
  ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, bitsStored - 1);
  ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 1);
  ds.addOrUpdateElement(DicomVR.CS, Tags.PhotometricInterpretation, "MONOCHROME2");
  ds.addOrUpdateElement(DicomVR.IS, Tags.NumberOfFrames, "1");

  if (rawPixelData) {
    if (bitsAllocated > 8) {
      const word = rawPixelData instanceof Uint16Array
        ? rawPixelData
        : new Uint16Array(rawPixelData.buffer, rawPixelData.byteOffset, Math.floor(rawPixelData.byteLength / 2));
      ds.addOrUpdate(new DicomOtherWord(Tags.PixelData, word));
    } else {
      ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, rawPixelData instanceof Uint8Array ? rawPixelData : new Uint8Array(rawPixelData.buffer)));
    }
  }

  return ds;
}

function addEncapsulatedFrame(ds: DicomDataset, data: Uint8Array): void {
  const seq = new DicomOtherByteFragment(Tags.PixelData);
  seq.addRaw(new MemoryByteBuffer(new Uint8Array(0)));
  seq.addRaw(new MemoryByteBuffer(data));
  ds.addOrUpdate(seq);
}

describe("DicomJpegBaselineExtendedCodec", () => {
  it("decodes JPEG Baseline via adapter and passes context metadata", () => {
    const ds = buildDataset(DicomTransferSyntax.JPEGProcess1, 8, 8);
    addEncapsulatedFrame(ds, new Uint8Array([0xff, 0xd8, 0xff, 0xd9]));
    const pixelData = DicomPixelData.create(ds);

    let seen: DicomJpegFrameContext | null = null;
    const codec = new DicomJpegProcess1Codec({
      decode: (_frameData, context) => {
        seen = context;
        return new Uint8Array([7, 9]);
      },
      encode: () => new Uint8Array([0x01]),
    });

    const decoded = codec.decode(pixelData, 0);
    expect([...decoded.data]).toEqual([7, 9]);
    expect(seen?.transferSyntax).toBe(DicomTransferSyntax.JPEGProcess1);
    expect(seen?.parameters.convertColorspaceToRgb).toBe(true);
    expect(seen?.samplesPerPixel).toBe(1);
  });

  it("encodes using padded native frame input from single-frame pixel data", () => {
    const ds = buildDataset(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      8,
      8,
      1,
      new Uint8Array([0x2a, 0x00]),
    );
    const pixelData = DicomPixelData.create(ds);
    const raw = pixelData.getFrame(0);

    let seenFrameData: Uint8Array | null = null;
    const codec = new DicomJpegProcess1Codec({
      decode: () => new Uint8Array([0x00, 0x00]),
      encode: (frameData) => {
        seenFrameData = frameData;
        return new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
      },
    });

    const encoded = codec.encode(pixelData, 0, raw);
    expect([...seenFrameData ?? []]).toEqual([0x2a]);
    expect([...encoded.data]).toEqual([0xff, 0xd8, 0xff, 0xd9]);
  });

  it("rejects invalid bit depth for JPEG Baseline", () => {
    const ds = buildDataset(DicomTransferSyntax.JPEGProcess1, 16, 12);
    addEncapsulatedFrame(ds, new Uint8Array([0x01]));
    const pixelData = DicomPixelData.create(ds);
    const codec = new DicomJpegProcess1Codec({
      decode: () => new Uint8Array([0, 0, 0, 0]),
      encode: () => new Uint8Array([0x01]),
    });

    expect(() => codec.decode(pixelData, 0)).toThrow(/supports up to 8-bit samples/);
    expect(() => codec.decode(pixelData, 0)).toThrow(/frame=0/);
    expect(() => codec.decode(pixelData, 0)).toThrow(new RegExp(DicomTransferSyntax.JPEGProcess1.uid.uid));
  });

  it("supports 12-bit JPEG Extended frame sizing", () => {
    const ds = buildDataset(DicomTransferSyntax.JPEGProcess2_4, 16, 12);
    addEncapsulatedFrame(ds, new Uint8Array([0x01, 0x02]));
    const pixelData = DicomPixelData.create(ds);
    const codec = new DicomJpegProcess2_4Codec({
      decode: () => new Uint8Array([1, 0, 2, 0]),
      encode: () => new Uint8Array([0x01]),
    });

    const decoded = codec.decode(pixelData, 0);
    expect([...decoded.data]).toEqual([1, 0, 2, 0]);
  });

  it("integrates with DicomTranscoder for JPEG Baseline decode", () => {
    const ds = buildDataset(DicomTransferSyntax.JPEGProcess1, 8, 8);
    addEncapsulatedFrame(ds, new Uint8Array([0x01, 0x02]));
    const codec = new DicomJpegProcess1Codec({
      decode: () => new Uint8Array([4, 5]),
      encode: () => new Uint8Array([0x00]),
    });
    TranscoderManager.register(codec);
    try {
      const transcoder = new DicomTranscoder(
        DicomTransferSyntax.JPEGProcess1,
        DicomTransferSyntax.ExplicitVRLittleEndian,
      );
      const out = transcoder.transcode(ds);
      expect(out.internalTransferSyntax).toBe(DicomTransferSyntax.ExplicitVRLittleEndian);
      expect([...DicomPixelData.create(out).getFrame(0).data]).toEqual([4, 5]);
    } finally {
      TranscoderManager.unregister(DicomTransferSyntax.JPEGProcess1);
    }
  });

  it("integrates with DicomTranscoder for JPEG Extended encode", () => {
    const ds = buildDataset(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      16,
      12,
      2,
      new Uint16Array([1, 2]),
    );
    const codec = new DicomJpegProcess2_4Codec({
      decode: () => new Uint8Array([1, 0, 2, 0]),
      encode: () => new Uint8Array([0xaa, 0xbb]),
    });
    TranscoderManager.register(codec);
    try {
      const transcoder = new DicomTranscoder(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        DicomTransferSyntax.JPEGProcess2_4,
      );
      const out = transcoder.transcode(ds);
      expect(out.internalTransferSyntax).toBe(DicomTransferSyntax.JPEGProcess2_4);
      expect([...DicomPixelData.create(out).getFrame(0).data]).toEqual([0xaa, 0xbb]);
    } finally {
      TranscoderManager.unregister(DicomTransferSyntax.JPEGProcess2_4);
    }
  });
});
