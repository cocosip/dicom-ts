import { describe, expect, it } from "vitest";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomOtherByte, DicomOtherWord } from "../../src/dataset/DicomElement.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import { DicomTranscoder } from "../../src/imaging/codec/DicomTranscoder.js";
import { TranscoderManager } from "../../src/imaging/codec/TranscoderManager.js";
import {
  DicomJpeg2000LosslessCodec,
  DicomJpeg2000LossyCodec,
  DicomJpeg2000Part2MCLosslessCodec,
  DicomJpeg2000Part2MCCodec,
} from "../../src/imaging/codec/jpeg2000/index.js";

function buildDataset(
  syntax: DicomTransferSyntax,
  bitsAllocated: number,
  bitsStored: number,
  columns: number,
  rows: number,
  samplesPerPixel: number,
  photometricInterpretation: string,
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
  ds.addOrUpdateElement(DicomVR.CS, Tags.PhotometricInterpretation, photometricInterpretation);
  ds.addOrUpdateElement(DicomVR.US, Tags.PlanarConfiguration, 0);
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

describe("DicomJpeg2000Codec", () => {
  it("exposes JPEG2000 Part 2 transfer syntaxes", () => {
    expect(DicomTransferSyntax.JPEG2000MCLossless.uid.uid).toBe("1.2.840.10008.1.2.4.92");
    expect(DicomTransferSyntax.JPEG2000MC.uid.uid).toBe("1.2.840.10008.1.2.4.93");
    expect(DicomTransferSyntax.lookup("1.2.840.10008.1.2.4.92")).toBe(DicomTransferSyntax.JPEG2000MCLossless);
    expect(DicomTransferSyntax.lookup("1.2.840.10008.1.2.4.93")).toBe(DicomTransferSyntax.JPEG2000MC);
  });

  it("registers all JPEG2000 codecs in the default manager", () => {
    TranscoderManager.loadCodecs();

    expect(TranscoderManager.hasCodec(DicomTransferSyntax.JPEG2000Lossless)).toBe(true);
    expect(TranscoderManager.hasCodec(DicomTransferSyntax.JPEG2000Lossy)).toBe(true);
    expect(TranscoderManager.hasCodec(DicomTransferSyntax.JPEG2000MCLossless)).toBe(true);
    expect(TranscoderManager.hasCodec(DicomTransferSyntax.JPEG2000MC)).toBe(true);
  });

  it("encodes baseline JPEG2000 for .90/.91 and keeps .92/.93 encode gated", () => {
    const sourceRaw = new Uint8Array([10, 20, 30, 40]);
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        expectEncodeImplemented: true,
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        expectEncodeImplemented: true,
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        expectEncodeImplemented: false,
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        expectEncodeImplemented: false,
      },
    ];

    for (const entry of codecEntries) {
      const sourceDataset = buildDataset(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        8,
        8,
        2,
        2,
        1,
        "MONOCHROME2",
        sourceRaw,
      );
      const encodedDataset = buildDataset(
        entry.syntax,
        8,
        8,
        2,
        2,
        1,
        "MONOCHROME2",
      );
      const decodedDataset = buildDataset(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        8,
        8,
        2,
        2,
        1,
        "MONOCHROME2",
      );
      const decodeInputDataset = buildDataset(
        entry.syntax,
        8,
        8,
        2,
        2,
        1,
        "MONOCHROME2",
      );

      const codec = entry.syntax === DicomTransferSyntax.JPEG2000Lossless
        ? new DicomJpeg2000LosslessCodec()
        : entry.syntax === DicomTransferSyntax.JPEG2000Lossy
          ? new DicomJpeg2000LossyCodec()
          : entry.syntax === DicomTransferSyntax.JPEG2000MCLossless
            ? new DicomJpeg2000Part2MCLosslessCodec()
            : new DicomJpeg2000Part2MCCodec();

      if (entry.expectEncodeImplemented) {
        codec.encode(
          DicomPixelData.create(sourceDataset),
          DicomPixelData.create(encodedDataset, true),
          null,
        );
        const encodedPixelData = DicomPixelData.create(encodedDataset);
        expect(encodedPixelData.numberOfFrames).toBe(1);
        expect(encodedPixelData.getFrame(0).data.length).toBeGreaterThan(0);
      } else {
        expect(() => codec.encode(
          DicomPixelData.create(sourceDataset),
          DicomPixelData.create(encodedDataset, true),
          null,
        )).toThrow(/Part2 encode is not implemented yet/i);
      }

      DicomPixelData.create(decodeInputDataset, true).addFrame(new MemoryByteBuffer(buildMinimalJ2kCodestream()));
      const decoded = codec.decode(
        DicomPixelData.create(decodeInputDataset),
        0,
      );
      expect(decoded.data.length).toBe(4);

      expect(decodedDataset.internalTransferSyntax).toBe(DicomTransferSyntax.ExplicitVRLittleEndian);
      expect(sourceRaw.length).toBe(4);
    }
  });

  it("works through DicomTranscoder path for baseline .91 encode", () => {
    const raw = new Uint8Array([5, 15, 25, 35]);
    const source = buildDataset(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      8,
      8,
      2,
      2,
      1,
      "MONOCHROME2",
      raw,
    );

    const transcoded = new DicomTranscoder(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      DicomTransferSyntax.JPEG2000Lossy,
    ).transcode(source);
    expect(transcoded.internalTransferSyntax).toBe(DicomTransferSyntax.JPEG2000Lossy);
    expect(DicomPixelData.create(transcoded).numberOfFrames).toBe(1);
  });
});

function buildMinimalJ2kCodestream(): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, 0xff4f); // SOC
  pushU16(bytes, 0xff51); // SIZ
  pushU16(bytes, 41);
  pushU16(bytes, 0);
  pushU32(bytes, 2);
  pushU32(bytes, 2);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU32(bytes, 2);
  pushU32(bytes, 2);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU16(bytes, 1);
  bytes.push(7, 1, 1);
  pushU16(bytes, 0xff52); // COD
  pushU16(bytes, 12);
  bytes.push(0, 0);
  pushU16(bytes, 1);
  bytes.push(0, 0, 2, 2, 0, 1);
  pushU16(bytes, 0xff5c); // QCD
  pushU16(bytes, 5);
  bytes.push(0, 0, 0);
  pushU16(bytes, 0xffd9); // EOC
  return new Uint8Array(bytes);
}

function pushU16(target: number[], value: number): void {
  target.push((value >>> 8) & 0xff, value & 0xff);
}

function pushU32(target: number[], value: number): void {
  target.push((value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff);
}
