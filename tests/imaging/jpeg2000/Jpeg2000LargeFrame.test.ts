import { describe, expect, it } from "vitest";
import { DicomTransferSyntax } from "../../../src/core/DicomTransferSyntax.js";
import { DicomDataset } from "../../../src/dataset/DicomDataset.js";
import { DicomVR } from "../../../src/core/DicomVR.js";
import { DicomOtherByte } from "../../../src/dataset/DicomElement.js";
import { DicomPixelData } from "../../../src/imaging/DicomPixelData.js";
import { DicomTranscoder } from "../../../src/imaging/codec/DicomTranscoder.js";
import * as Tags from "../../../src/core/DicomTag.generated.js";

function buildLargeDataset(
  columns: number,
  rows: number,
  samplesPerPixel: number,
  bitsAllocated: number,
): DicomDataset {
  const ds = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
  ds.addOrUpdateElement(DicomVR.US, Tags.Rows, rows);
  ds.addOrUpdateElement(DicomVR.US, Tags.Columns, columns);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, bitsAllocated);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, bitsAllocated);
  ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, bitsAllocated - 1);
  ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, samplesPerPixel);
  ds.addOrUpdateElement(DicomVR.US, Tags.PixelRepresentation, 0);
  ds.addOrUpdateElement(DicomVR.CS, Tags.PhotometricInterpretation, samplesPerPixel === 1 ? "MONOCHROME2" : "RGB");
  ds.addOrUpdateElement(DicomVR.US, Tags.PlanarConfiguration, 0);
  ds.addOrUpdateElement(DicomVR.IS, Tags.NumberOfFrames, "1");

  const pixelCount = columns * rows * samplesPerPixel * (bitsAllocated / 8);
  const pixels = new Uint8Array(pixelCount);
  for (let i = 0; i < pixels.length; i++) {
    pixels[i] = (i * 7) & 0xff;
  }
  ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, pixels));

  return ds;
}

function buildMultiFrameDataset(
  columns: number,
  rows: number,
  samplesPerPixel: number,
  bitsAllocated: number,
  numFrames: number,
): DicomDataset {
  const ds = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
  ds.addOrUpdateElement(DicomVR.US, Tags.Rows, rows);
  ds.addOrUpdateElement(DicomVR.US, Tags.Columns, columns);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, bitsAllocated);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, bitsAllocated);
  ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, bitsAllocated - 1);
  ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, samplesPerPixel);
  ds.addOrUpdateElement(DicomVR.US, Tags.PixelRepresentation, 0);
  ds.addOrUpdateElement(DicomVR.CS, Tags.PhotometricInterpretation, samplesPerPixel === 1 ? "MONOCHROME2" : "RGB");
  ds.addOrUpdateElement(DicomVR.US, Tags.PlanarConfiguration, 0);
  ds.addOrUpdateElement(DicomVR.IS, Tags.NumberOfFrames, numFrames.toString());

  const frameSize = columns * rows * samplesPerPixel * (bitsAllocated / 8);
  const totalPixels = frameSize * numFrames;
  const pixels = new Uint8Array(totalPixels);
  for (let i = 0; i < pixels.length; i++) {
    pixels[i] = (i * 7) & 0xff;
  }
  ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, pixels));

  return ds;
}

describe("JPEG2000 large frame memory behavior", () => {
  it("encodes and decodes 512x512 mono 8-bit frame", () => {
    const source = buildLargeDataset(512, 512, 1, 8);
    const encoded = new DicomTranscoder(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      DicomTransferSyntax.JPEG2000Lossless,
    ).transcode(source);

    const encodedPixelData = DicomPixelData.create(encoded);
    expect(encodedPixelData.numberOfFrames).toBe(1);
    expect(encodedPixelData.columns).toBe(512);
    expect(encodedPixelData.rows).toBe(512);

    const decoded = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000Lossless,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(encoded);

    const decodedPixelData = DicomPixelData.create(decoded);
    const sourcePixelData = DicomPixelData.create(source);

    expect(decodedPixelData.numberOfFrames).toBe(1);
    const decodedFrame = decodedPixelData.getFrame(0).data;
    const sourceFrame = sourcePixelData.getFrame(0).data;
    expect(decodedFrame.length).toBe(sourceFrame.length);
    expect(decodedFrame).toEqual(sourceFrame);
  });

  it("encodes and decodes 256x256 RGB 8-bit frame", () => {
    const source = buildLargeDataset(256, 256, 3, 8);
    const encoded = new DicomTranscoder(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      DicomTransferSyntax.JPEG2000Lossless,
    ).transcode(source);

    const encodedPixelData = DicomPixelData.create(encoded);
    expect(encodedPixelData.numberOfFrames).toBe(1);

    const decoded = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000Lossless,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(encoded);

    const decodedPixelData = DicomPixelData.create(decoded);
    const sourcePixelData = DicomPixelData.create(source);

    const decodedFrame = decodedPixelData.getFrame(0).data;
    const sourceFrame = sourcePixelData.getFrame(0).data;
    expect(decodedFrame.length).toBe(sourceFrame.length);
    expect(decodedFrame).toEqual(sourceFrame);
  });

  it("encodes and decodes 256x256 mono 16-bit frame", () => {
    const source = buildLargeDataset(256, 256, 1, 16);
    const encoded = new DicomTranscoder(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      DicomTransferSyntax.JPEG2000Lossless,
    ).transcode(source);

    const decoded = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000Lossless,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(encoded);

    const decodedPixelData = DicomPixelData.create(decoded);
    const sourcePixelData = DicomPixelData.create(source);

    const decodedFrame = decodedPixelData.getFrame(0).data;
    const sourceFrame = sourcePixelData.getFrame(0).data;
    expect(decodedFrame.length).toBe(sourceFrame.length);
    expect(decodedFrame).toEqual(sourceFrame);
  });
});

describe("JPEG2000 multi-frame memory behavior", () => {
  it("encodes and decodes 5-frame 256x256 mono sequence", () => {
    const source = buildMultiFrameDataset(256, 256, 1, 8, 5);
    const encoded = new DicomTranscoder(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      DicomTransferSyntax.JPEG2000Lossless,
    ).transcode(source);

    const encodedPixelData = DicomPixelData.create(encoded);
    expect(encodedPixelData.numberOfFrames).toBe(5);

    const decoded = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000Lossless,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(encoded);

    const decodedPixelData = DicomPixelData.create(decoded);
    const sourcePixelData = DicomPixelData.create(source);

    expect(decodedPixelData.numberOfFrames).toBe(5);
    for (let i = 0; i < 5; i++) {
      const decodedFrame = decodedPixelData.getFrame(i).data;
      const sourceFrame = sourcePixelData.getFrame(i).data;
      expect(decodedFrame.length).toBe(sourceFrame.length);
      expect(decodedFrame).toEqual(sourceFrame);
    }
  });

  it("encodes and decodes 10-frame 128x128 RGB sequence", () => {
    const source = buildMultiFrameDataset(128, 128, 3, 8, 10);
    const encoded = new DicomTranscoder(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      DicomTransferSyntax.JPEG2000Lossless,
    ).transcode(source);

    const decoded = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000Lossless,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(encoded);

    const decodedPixelData = DicomPixelData.create(decoded);
    const sourcePixelData = DicomPixelData.create(source);

    expect(decodedPixelData.numberOfFrames).toBe(10);
    for (let i = 0; i < 10; i++) {
      const decodedFrame = decodedPixelData.getFrame(i).data;
      const sourceFrame = sourcePixelData.getFrame(i).data;
      expect(decodedFrame.length).toBe(sourceFrame.length);
      expect(decodedFrame).toEqual(sourceFrame);
    }
  });
});

describe("JPEG2000 lossy large frame behavior", () => {
  it("encodes and decodes 256x256 RGB with .91 lossy", () => {
    const source = buildLargeDataset(256, 256, 3, 8);
    const encoded = new DicomTranscoder(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      DicomTransferSyntax.JPEG2000Lossy,
    ).transcode(source);

    const decoded = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000Lossy,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(encoded);

    const decodedPixelData = DicomPixelData.create(decoded);
    const sourcePixelData = DicomPixelData.create(source);

    expect(decodedPixelData.numberOfFrames).toBe(1);
    expect(decodedPixelData.getFrame(0).data.length).toBe(sourcePixelData.getFrame(0).data.length);

    const sourceFrame = sourcePixelData.getFrame(0).data;
    const decodedFrame = decodedPixelData.getFrame(0).data;

    let sumDiff = 0;
    for (let i = 0; i < sourceFrame.length; i++) {
      sumDiff += Math.abs(decodedFrame[i]! - sourceFrame[i]!);
    }
    const mae = sumDiff / sourceFrame.length;
    expect(mae).toBeLessThan(10);
  });
});