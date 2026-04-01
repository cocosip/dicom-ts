import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import { DicomOtherByte } from "../../src/dataset/DicomElement.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import { DicomTranscoder } from "../../src/imaging/codec/DicomTranscoder.js";
import { DicomJpeg2000Params } from "../../src/imaging/codec/jpeg2000/DicomJpeg2000Params.js";
import * as Tags from "../../src/core/DicomTag.generated.js";

function buildMonoDataset(width: number, height: number, bitsAllocated: number): DicomDataset {
  const ds = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
  ds.addOrUpdateElement(DicomVR.US, Tags.Rows, height);
  ds.addOrUpdateElement(DicomVR.US, Tags.Columns, width);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, bitsAllocated);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, bitsAllocated);
  ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, bitsAllocated - 1);
  ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 1);
  ds.addOrUpdateElement(DicomVR.US, Tags.PixelRepresentation, 0);
  ds.addOrUpdateElement(DicomVR.CS, Tags.PhotometricInterpretation, "MONOCHROME2");

  const pixelCount = width * height * (bitsAllocated / 8);
  const pixels = new Uint8Array(pixelCount);
  for (let i = 0; i < pixels.length; i++) {
    pixels[i] = (i * 7 + 13) & 0xff;
  }
  ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, pixels));

  return ds;
}

function buildRgbDataset(width: number, height: number): DicomDataset {
  const ds = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
  ds.addOrUpdateElement(DicomVR.US, Tags.Rows, height);
  ds.addOrUpdateElement(DicomVR.US, Tags.Columns, width);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 8);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, 8);
  ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, 7);
  ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 3);
  ds.addOrUpdateElement(DicomVR.US, Tags.PixelRepresentation, 0);
  ds.addOrUpdateElement(DicomVR.CS, Tags.PhotometricInterpretation, "RGB");
  ds.addOrUpdateElement(DicomVR.US, Tags.PlanarConfiguration, 0);

  const pixelCount = width * height * 3;
  const pixels = new Uint8Array(pixelCount);
  for (let i = 0; i < pixels.length; i++) {
    pixels[i] = (i * 11 + 17) & 0xff;
  }
  ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, pixels));

  return ds;
}

function sha256(data: Uint8Array): string {
  return createHash("sha256").update(data).digest("hex");
}

describe("JPEG2000 roundtrip tests", () => {
  describe(".90 lossless", () => {
    it("roundtrips mono 8-bit", () => {
      const source = buildMonoDataset(64, 64, 8);
      const encoded = new DicomTranscoder(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        DicomTransferSyntax.JPEG2000Lossless,
      ).transcode(source);

      const decoded = new DicomTranscoder(
        DicomTransferSyntax.JPEG2000Lossless,
        DicomTransferSyntax.ExplicitVRLittleEndian,
      ).transcode(encoded);

      const sourcePixel = DicomPixelData.create(source).getFrame(0).data;
      const decodedPixel = DicomPixelData.create(decoded).getFrame(0).data;

      expect(decodedPixel.length).toBe(sourcePixel.length);
      expect(sha256(decodedPixel)).toBe(sha256(sourcePixel));
    });

    it("roundtrips mono 16-bit", () => {
      const source = buildMonoDataset(64, 64, 16);
      const encoded = new DicomTranscoder(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        DicomTransferSyntax.JPEG2000Lossless,
      ).transcode(source);

      const decoded = new DicomTranscoder(
        DicomTransferSyntax.JPEG2000Lossless,
        DicomTransferSyntax.ExplicitVRLittleEndian,
      ).transcode(encoded);

      const sourcePixel = DicomPixelData.create(source).getFrame(0).data;
      const decodedPixel = DicomPixelData.create(decoded).getFrame(0).data;

      expect(decodedPixel.length).toBe(sourcePixel.length);
      expect(sha256(decodedPixel)).toBe(sha256(sourcePixel));
    });

    it("roundtrips RGB 8-bit", () => {
      const source = buildRgbDataset(64, 64);
      const encoded = new DicomTranscoder(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        DicomTransferSyntax.JPEG2000Lossless,
      ).transcode(source);

      const decoded = new DicomTranscoder(
        DicomTransferSyntax.JPEG2000Lossless,
        DicomTransferSyntax.ExplicitVRLittleEndian,
      ).transcode(encoded);

      const sourcePixel = DicomPixelData.create(source).getFrame(0).data;
      const decodedPixel = DicomPixelData.create(decoded).getFrame(0).data;

      expect(decodedPixel.length).toBe(sourcePixel.length);
      expect(sha256(decodedPixel)).toBe(sha256(sourcePixel));
    });

    it("roundtrips RGB with MCT disabled", () => {
      const source = buildRgbDataset(64, 64);
      const params = DicomJpeg2000Params.createLosslessDefaults();
      params.allowMct = false;

      const encoded = new DicomTranscoder(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        DicomTransferSyntax.JPEG2000Lossless,
        null,
        params,
      ).transcode(source);

      const decoded = new DicomTranscoder(
        DicomTransferSyntax.JPEG2000Lossless,
        DicomTransferSyntax.ExplicitVRLittleEndian,
      ).transcode(encoded);

      const sourcePixel = DicomPixelData.create(source).getFrame(0).data;
      const decodedPixel = DicomPixelData.create(decoded).getFrame(0).data;

      expect(decodedPixel.length).toBe(sourcePixel.length);
      expect(sha256(decodedPixel)).toBe(sha256(sourcePixel));
    });
  });

  describe(".91 lossy", () => {
    it("roundtrips mono 8-bit with bounded error", () => {
      const source = buildMonoDataset(64, 64, 8);
      const params = new DicomJpeg2000Params();
      params.irreversible = true;
      params.targetRatio = 10;

      const encoded = new DicomTranscoder(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        DicomTransferSyntax.JPEG2000Lossy,
        null,
        params,
      ).transcode(source);

      const decoded = new DicomTranscoder(
        DicomTransferSyntax.JPEG2000Lossy,
        DicomTransferSyntax.ExplicitVRLittleEndian,
      ).transcode(encoded);

      const sourcePixel = DicomPixelData.create(source).getFrame(0).data;
      const decodedPixel = DicomPixelData.create(decoded).getFrame(0).data;

      expect(decodedPixel.length).toBe(sourcePixel.length);

      let maxDelta = 0;
      for (let i = 0; i < sourcePixel.length; i++) {
        const delta = Math.abs((decodedPixel[i] ?? 0) - sourcePixel[i]!);
        if (delta > maxDelta) maxDelta = delta;
      }
      expect(maxDelta).toBeLessThan(10);
    });

    it("roundtrips RGB 8-bit with bounded error", () => {
      const source = buildRgbDataset(64, 64);
      const params = new DicomJpeg2000Params();
      params.irreversible = true;
      params.targetRatio = 10;
      params.allowMct = false;

      const encoded = new DicomTranscoder(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        DicomTransferSyntax.JPEG2000Lossy,
        null,
        params,
      ).transcode(source);

      const decoded = new DicomTranscoder(
        DicomTransferSyntax.JPEG2000Lossy,
        DicomTransferSyntax.ExplicitVRLittleEndian,
      ).transcode(encoded);

      const sourcePixel = DicomPixelData.create(source).getFrame(0).data;
      const decodedPixel = DicomPixelData.create(decoded).getFrame(0).data;

      expect(decodedPixel.length).toBe(sourcePixel.length);

      let maxDelta = 0;
      for (let i = 0; i < sourcePixel.length; i++) {
        const delta = Math.abs((decodedPixel[i] ?? 0) - sourcePixel[i]!);
        if (delta > maxDelta) maxDelta = delta;
      }
      expect(maxDelta).toBeLessThan(10);
    });
  });

  describe("multi-frame roundtrip", () => {
    it("roundtrips 3-frame mono sequence with .90", () => {
      const ds = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
      ds.addOrUpdateElement(DicomVR.US, Tags.Rows, 32);
      ds.addOrUpdateElement(DicomVR.US, Tags.Columns, 32);
      ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 8);
      ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, 8);
      ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, 7);
      ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 1);
      ds.addOrUpdateElement(DicomVR.US, Tags.PixelRepresentation, 0);
      ds.addOrUpdateElement(DicomVR.CS, Tags.PhotometricInterpretation, "MONOCHROME2");
      ds.addOrUpdateElement(DicomVR.IS, Tags.NumberOfFrames, "3");

      const frameSize = 32 * 32;
      const pixels = new Uint8Array(frameSize * 3);
      for (let i = 0; i < pixels.length; i++) {
        pixels[i] = (i * 13 + 7) & 0xff;
      }
      ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, pixels));

      const encoded = new DicomTranscoder(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        DicomTransferSyntax.JPEG2000Lossless,
      ).transcode(ds);

      const decoded = new DicomTranscoder(
        DicomTransferSyntax.JPEG2000Lossless,
        DicomTransferSyntax.ExplicitVRLittleEndian,
      ).transcode(encoded);

      const sourcePixelData = DicomPixelData.create(ds);
      const decodedPixelData = DicomPixelData.create(decoded);

      expect(decodedPixelData.numberOfFrames).toBe(3);
      for (let i = 0; i < 3; i++) {
        const sourceFrame = sourcePixelData.getFrame(i).data;
        const decodedFrame = decodedPixelData.getFrame(i).data;
        expect(decodedFrame.length).toBe(sourceFrame.length);
        expect(sha256(decodedFrame)).toBe(sha256(sourceFrame));
      }
    });

    it("roundtrips 3-frame RGB sequence with .90", () => {
      const ds = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
      ds.addOrUpdateElement(DicomVR.US, Tags.Rows, 32);
      ds.addOrUpdateElement(DicomVR.US, Tags.Columns, 32);
      ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 8);
      ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, 8);
      ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, 7);
      ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 3);
      ds.addOrUpdateElement(DicomVR.US, Tags.PixelRepresentation, 0);
      ds.addOrUpdateElement(DicomVR.CS, Tags.PhotometricInterpretation, "RGB");
      ds.addOrUpdateElement(DicomVR.US, Tags.PlanarConfiguration, 0);
      ds.addOrUpdateElement(DicomVR.IS, Tags.NumberOfFrames, "3");

      const frameSize = 32 * 32 * 3;
      const pixels = new Uint8Array(frameSize * 3);
      for (let i = 0; i < pixels.length; i++) {
        pixels[i] = (i * 17 + 11) & 0xff;
      }
      ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, pixels));

      const encoded = new DicomTranscoder(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        DicomTransferSyntax.JPEG2000Lossless,
      ).transcode(ds);

      const decoded = new DicomTranscoder(
        DicomTransferSyntax.JPEG2000Lossless,
        DicomTransferSyntax.ExplicitVRLittleEndian,
      ).transcode(encoded);

      const sourcePixelData = DicomPixelData.create(ds);
      const decodedPixelData = DicomPixelData.create(decoded);

      expect(decodedPixelData.numberOfFrames).toBe(3);
      for (let i = 0; i < 3; i++) {
        const sourceFrame = sourcePixelData.getFrame(i).data;
        const decodedFrame = decodedPixelData.getFrame(i).data;
        expect(decodedFrame.length).toBe(sourceFrame.length);
        expect(sha256(decodedFrame)).toBe(sha256(sourceFrame));
      }
    });
  });
});