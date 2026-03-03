import { describe, expect, it } from "vitest";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomOtherByte, DicomOtherWord } from "../../src/dataset/DicomElement.js";
import { DicomOtherByteFragment } from "../../src/dataset/DicomFragmentSequence.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import { PhotometricInterpretation } from "../../src/imaging/PhotometricInterpretation.js";
import { PlanarConfiguration } from "../../src/imaging/PlanarConfiguration.js";
import { DicomTranscoder } from "../../src/imaging/codec/DicomTranscoder.js";
import { TranscoderManager } from "../../src/imaging/codec/TranscoderManager.js";
import type { IDicomCodec } from "../../src/imaging/codec/IDicomCodec.js";
import {
  DicomJpeg2000LosslessCodec,
  DicomJpeg2000LossyCodec,
  DicomJpeg2000Part2MCLosslessCodec,
  DicomJpeg2000Part2MCCodec,
  DicomJpeg2000Params,
  type DicomJpeg2000Adapter,
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

function addEncapsulatedFrame(dataset: DicomDataset, data: Uint8Array): void {
  const fragments = new DicomOtherByteFragment(Tags.PixelData);
  fragments.addRaw(new MemoryByteBuffer(new Uint8Array(0)));
  fragments.addRaw(new MemoryByteBuffer(data));
  dataset.addOrUpdate(fragments);
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

  it("encodes and decodes all JPEG2000 UID codecs through adapter", () => {
    const sourceRaw = new Uint8Array([10, 20, 30, 40]);
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
      },
    ];

    for (const entry of codecEntries) {
      let seenSyntax = "";
      const adapter: DicomJpeg2000Adapter = {
        encode: (_frameData, context) => {
          seenSyntax = context.transferSyntax.uid.uid;
          return new Uint8Array([0xff, 0x4f, context.frameIndex]);
        },
        decode: () => ({
          pixelData: sourceRaw,
          metadata: {
            width: 2,
            height: 2,
            components: 1,
            bitsStored: 8,
          },
        }),
      };

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

      const codec = entry.syntax === DicomTransferSyntax.JPEG2000Lossless
        ? new DicomJpeg2000LosslessCodec(adapter)
        : entry.syntax === DicomTransferSyntax.JPEG2000Lossy
          ? new DicomJpeg2000LossyCodec(adapter)
          : entry.syntax === DicomTransferSyntax.JPEG2000MCLossless
            ? new DicomJpeg2000Part2MCLosslessCodec(adapter)
            : new DicomJpeg2000Part2MCCodec(adapter);

      codec.encode(
        DicomPixelData.create(sourceDataset),
        DicomPixelData.create(encodedDataset, true),
        null,
      );

      expect(seenSyntax).toBe(entry.syntax.uid.uid);
      expect(DicomPixelData.create(encodedDataset).getFrame(0).data[0]).toBe(0xff);

      codec.decode(
        DicomPixelData.create(encodedDataset),
        DicomPixelData.create(decodedDataset, true),
        null,
      );

      expect([...DicomPixelData.create(decodedDataset).getFrame(0).data]).toEqual([...sourceRaw]);
    }
  });

  it("updates photometric interpretation on encode like go-dicom-codec", () => {
    const rgbRaw = new Uint8Array([10, 20, 30, 40, 50, 60]);
    const source = buildDataset(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      8,
      8,
      2,
      1,
      3,
      "RGB",
      rgbRaw,
    );

    const lossyOut = buildDataset(
      DicomTransferSyntax.JPEG2000Lossy,
      8,
      8,
      2,
      1,
      3,
      "RGB",
    );
    const lossyCodec = new DicomJpeg2000LossyCodec({
      encode: () => new Uint8Array([1, 2, 3]),
      decode: () => new Uint8Array(rgbRaw),
    });

    lossyCodec.encode(DicomPixelData.create(source), DicomPixelData.create(lossyOut, true), null);

    const lossyPixel = DicomPixelData.create(lossyOut);
    expect(lossyPixel.photometricInterpretation).toBe(PhotometricInterpretation.YBR_ICT);
    expect(lossyPixel.planarConfiguration).toBe(PlanarConfiguration.Interleaved);

    const losslessOut = buildDataset(
      DicomTransferSyntax.JPEG2000Lossless,
      8,
      8,
      2,
      1,
      3,
      "RGB",
    );
    const losslessCodec = new DicomJpeg2000LosslessCodec({
      encode: () => new Uint8Array([4, 5, 6]),
      decode: () => new Uint8Array(rgbRaw),
    });

    const params = DicomJpeg2000Params.createLosslessDefaults();
    losslessCodec.encode(DicomPixelData.create(source), DicomPixelData.create(losslessOut, true), params);

    const losslessPixel = DicomPixelData.create(losslessOut);
    expect(losslessPixel.photometricInterpretation).toBe(PhotometricInterpretation.YBR_RCT);
    expect(losslessPixel.planarConfiguration).toBe(PlanarConfiguration.Interleaved);
  });

  it("normalizes YBR photometric interpretation to RGB on decode", () => {
    const compressed = buildDataset(
      DicomTransferSyntax.JPEG2000Lossless,
      8,
      8,
      2,
      1,
      3,
      "YBR_RCT",
    );
    addEncapsulatedFrame(compressed, new Uint8Array([0xff, 0x4f, 0xff, 0x51]));

    const decoded = buildDataset(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      8,
      8,
      2,
      1,
      3,
      "YBR_RCT",
    );

    const codec = new DicomJpeg2000LosslessCodec({
      encode: () => new Uint8Array([1]),
      decode: () => new Uint8Array([10, 20, 30, 40, 50, 60]),
    });

    codec.decode(DicomPixelData.create(compressed), DicomPixelData.create(decoded, true), null);

    const pixelData = DicomPixelData.create(decoded);
    expect(pixelData.photometricInterpretation).toBe(PhotometricInterpretation.RGB);
    expect(pixelData.planarConfiguration).toBe(PlanarConfiguration.Interleaved);
  });

  it("integrates with DicomTranscoder for JPEG2000 codec path", () => {
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

    const codec = new DicomJpeg2000LossyCodec({
      encode: (frameData) => {
        const encoded = new Uint8Array(frameData.length + 2);
        encoded[0] = 0xff;
        encoded[1] = 0x4f;
        encoded.set(frameData, 2);
        return encoded;
      },
      decode: (frameData) => frameData.subarray(2),
    });

    const syntax = DicomTransferSyntax.JPEG2000Lossy;
    const original = TranscoderManager.tryGetCodec(syntax);

    TranscoderManager.register(codec);
    try {
      const compressed = new DicomTranscoder(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        DicomTransferSyntax.JPEG2000Lossy,
      ).transcode(source);

      const restored = new DicomTranscoder(
        DicomTransferSyntax.JPEG2000Lossy,
        DicomTransferSyntax.ExplicitVRLittleEndian,
      ).transcode(compressed);

      expect(restored.internalTransferSyntax).toBe(DicomTransferSyntax.ExplicitVRLittleEndian);
      expect([...DicomPixelData.create(restored).getFrame(0).data]).toEqual([...raw]);
    } finally {
      if (original) {
        TranscoderManager.register(original as IDicomCodec);
      } else {
        TranscoderManager.unregister(syntax);
      }
    }
  });
});
