import { describe, expect, it } from "vitest";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomOtherByte, DicomOtherWord } from "../../src/dataset/DicomElement.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import { DicomTranscoder } from "../../src/imaging/codec/DicomTranscoder.js";
import {
  DicomJpegLsLosslessCodec,
  DicomJpegLsNearLosslessCodec,
  DicomJpegLsParams,
} from "../../src/imaging/codec/jpeg-ls/index.js";

function buildDataset(
  syntax: DicomTransferSyntax,
  bitsAllocated: number,
  bitsStored: number,
  columns: number,
  rows: number,
  samplesPerPixel: number,
  rawPixelData?: Uint8Array | Uint16Array,
): DicomDataset {
  const ds = new DicomDataset(syntax);
  ds.addOrUpdateElement(DicomVR.US, Tags.Rows, rows);
  ds.addOrUpdateElement(DicomVR.US, Tags.Columns, columns);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, bitsAllocated);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, bitsStored);
  ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, bitsStored - 1);
  ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, samplesPerPixel);
  ds.addOrUpdateElement(DicomVR.US, Tags.PixelRepresentation, 0);
  ds.addOrUpdateElement(DicomVR.CS, Tags.PhotometricInterpretation, samplesPerPixel === 1 ? "MONOCHROME2" : "RGB");
  ds.addOrUpdateElement(DicomVR.IS, Tags.NumberOfFrames, "1");

  if (rawPixelData) {
    if (bitsAllocated > 8) {
      const words = rawPixelData instanceof Uint16Array
        ? rawPixelData
        : new Uint16Array(rawPixelData.buffer, rawPixelData.byteOffset, Math.floor(rawPixelData.byteLength / 2));
      ds.addOrUpdate(new DicomOtherWord(Tags.PixelData, words));
    } else {
      const bytes = rawPixelData instanceof Uint8Array
        ? rawPixelData
        : new Uint8Array(rawPixelData.buffer, rawPixelData.byteOffset, rawPixelData.byteLength);
      ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, bytes));
    }
  }

  return ds;
}

describe("DicomJpegLsCodec", () => {
  it("encodes and decodes JPEG-LS lossless frame", () => {
    const raw = new Uint8Array([10, 20, 30, 40, 50, 60, 70, 80]);
    const source = buildDataset(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      8,
      8,
      4,
      2,
      1,
      raw,
    );

    const sourcePixelData = DicomPixelData.create(source);
    const encodedDataset = buildDataset(
      DicomTransferSyntax.JPEGLSLossless,
      8,
      8,
      4,
      2,
      1,
    );
    const encodedPixelData = DicomPixelData.create(encodedDataset, true);

    const codec = new DicomJpegLsLosslessCodec();
    codec.encode(sourcePixelData, encodedPixelData, null);

    const encodedFrame = DicomPixelData.create(encodedDataset).getFrame(0).data;
    expect(encodedFrame[0]).toBe(0xff);
    expect(encodedFrame[1]).toBe(0xd8);

    const decodedDataset = buildDataset(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      8,
      8,
      4,
      2,
      1,
    );
    const decodedPixelData = DicomPixelData.create(decodedDataset, true);
    codec.decode(DicomPixelData.create(encodedDataset), decodedPixelData, null);

    expect([...DicomPixelData.create(decodedDataset).getFrame(0).data]).toEqual([...raw]);
  });

  it("encodes and decodes JPEG-LS near-lossless with bounded error", () => {
    const raw = new Uint8Array([0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 168, 180]);
    const source = buildDataset(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      8,
      8,
      8,
      2,
      1,
      raw,
    );

    const sourcePixelData = DicomPixelData.create(source);
    const encodedDataset = buildDataset(
      DicomTransferSyntax.JPEGLSNearLossless,
      8,
      8,
      8,
      2,
      1,
    );
    const encodedPixelData = DicomPixelData.create(encodedDataset, true);

    const codec = new DicomJpegLsNearLosslessCodec();
    const parameters = new DicomJpegLsParams();
    parameters.allowedError = 2;

    codec.encode(sourcePixelData, encodedPixelData, parameters);

    const decodedDataset = buildDataset(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      8,
      8,
      8,
      2,
      1,
    );
    const decodedPixelData = DicomPixelData.create(decodedDataset, true);

    codec.decode(DicomPixelData.create(encodedDataset), decodedPixelData, null);

    const decoded = DicomPixelData.create(decodedDataset).getFrame(0).data;
    expect(decoded.length).toBe(raw.length);
    for (let i = 0; i < raw.length; i++) {
      expect(Math.abs(decoded[i]! - raw[i]!)).toBeLessThanOrEqual(2);
    }
  });

  it("rejects non-zero allowedError for JPEG-LS lossless", () => {
    const raw = new Uint8Array([1, 2, 3, 4]);
    const source = buildDataset(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      8,
      8,
      2,
      2,
      1,
      raw,
    );

    const sourcePixelData = DicomPixelData.create(source);
    const encodedDataset = buildDataset(
      DicomTransferSyntax.JPEGLSLossless,
      8,
      8,
      2,
      2,
      1,
    );
    const encodedPixelData = DicomPixelData.create(encodedDataset, true);

    const codec = new DicomJpegLsLosslessCodec();
    const parameters = new DicomJpegLsParams();
    parameters.allowedError = 1;

    expect(() => codec.encode(sourcePixelData, encodedPixelData, parameters)).toThrow(/allowedError=0/);
  });

  it("integrates with DicomTranscoder for JPEG-LS lossless roundtrip", () => {
    const raw = new Uint8Array([5, 15, 25, 35, 45, 55, 65, 75]);
    const source = buildDataset(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      8,
      8,
      4,
      2,
      1,
      raw,
    );

    const compressed = new DicomTranscoder(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      DicomTransferSyntax.JPEGLSLossless,
    ).transcode(source);

    const restored = new DicomTranscoder(
      DicomTransferSyntax.JPEGLSLossless,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(compressed);

    expect(restored.internalTransferSyntax).toBe(DicomTransferSyntax.ExplicitVRLittleEndian);
    expect([...DicomPixelData.create(restored).getFrame(0).data]).toEqual([...raw]);
  });
});
