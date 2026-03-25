import { createHash } from "node:crypto";
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
import { DicomJpeg2000Params } from "../../src/imaging/codec/jpeg2000/DicomJpeg2000Params.js";
import {
  DicomJpeg2000LosslessCodec,
  DicomJpeg2000LossyCodec,
  DicomJpeg2000Part2MCLosslessCodec,
  DicomJpeg2000Part2MCCodec,
} from "../../src/imaging/codec/jpeg2000/index.js";
import {
  Jpeg2000ProgressionOrder,
  parseJpeg2000Codestream,
} from "../../src/imaging/codec/jpeg2000/core/index.js";

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

function sha256(data: Uint8Array): string {
  return createHash("sha256").update(data).digest("hex");
}

function buildRgbFrame(width: number, height: number, seed: number): Uint8Array {
  const frame = new Uint8Array(width * height * 3);
  for (let i = 0; i < frame.length; i += 3) {
    const pixel = Math.floor(i / 3);
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    frame[i] = (x * 11 + y * 7 + seed) & 0xff;
    frame[i + 1] = (x * 5 + y * 13 + seed * 3) & 0xff;
    frame[i + 2] = (x * 17 + y * 3 + seed * 5) & 0xff;
  }
  return frame;
}

function buildPart2LosslessParams(): DicomJpeg2000Params {
  const parameters = DicomJpeg2000Params.createLosslessDefaults();
  parameters.numLevels = 3;
  parameters.numLayers = 1;
  parameters.allowMct = true;
  parameters.mctBindings = [
    {
      assocType: 1,
      componentIds: [0, 1, 2],
      matrix: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      inverse: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      offsets: [3, -2, 1],
      elementType: 1,
      mcoPrecision: 0,
    },
  ];
  return parameters;
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

  it("routes .90/.91/.92/.93 through their concrete default codecs", () => {
    TranscoderManager.loadCodecs();

    expect(TranscoderManager.getCodec(DicomTransferSyntax.JPEG2000Lossless)).toBeInstanceOf(DicomJpeg2000LosslessCodec);
    expect(TranscoderManager.getCodec(DicomTransferSyntax.JPEG2000Lossy)).toBeInstanceOf(DicomJpeg2000LossyCodec);
    expect(TranscoderManager.getCodec(DicomTransferSyntax.JPEG2000MCLossless)).toBeInstanceOf(DicomJpeg2000Part2MCLosslessCodec);
    expect(TranscoderManager.getCodec(DicomTransferSyntax.JPEG2000MC)).toBeInstanceOf(DicomJpeg2000Part2MCCodec);
  });

  it("encodes baseline JPEG2000 for .90/.91/.92/.93", () => {
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
        expectEncodeImplemented: true,
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        expectEncodeImplemented: true,
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

      DicomPixelData.create(decodeInputDataset, true).addFrame(new MemoryByteBuffer(buildSingleTileMinimalJ2kCodestream()));
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

  it("roundtrips four-component Part 2 lossless data without rewriting ARGB photometric interpretation", () => {
    const raw = new Uint8Array([
      255, 10, 20, 30,
      128, 40, 50, 60,
      64, 70, 80, 90,
      32, 15, 25, 35,
      16, 45, 55, 65,
      8, 75, 85, 95,
    ]);
    const source = buildDataset(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      8,
      8,
      3,
      2,
      4,
      "ARGB",
      raw,
    );

    const parameters = buildPart2LosslessParams();
    parameters.allowMct = false;

    const encoded = new DicomTranscoder(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      DicomTransferSyntax.JPEG2000MCLossless,
      null,
      parameters,
    ).transcode(source);

    expect(encoded.internalTransferSyntax).toBe(DicomTransferSyntax.JPEG2000MCLossless);
    const encodedPixelData = DicomPixelData.create(encoded);
    expect(encodedPixelData.getFrame(0).data.length).toBeGreaterThan(0);
    expect(encodedPixelData.photometricInterpretation).toBe("ARGB");
    expect(encoded.tryGetString(Tags.PhotometricInterpretation)).toBe("ARGB");

    const restored = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000MCLossless,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(encoded);

    const restoredPixelData = DicomPixelData.create(restored);
    expect(restoredPixelData.photometricInterpretation).toBe("ARGB");
    expect(restored.tryGetString(Tags.PhotometricInterpretation)).toBe("ARGB");
    expect([...restoredPixelData.getFrame(0).data]).toEqual([...raw]);
  });

  it("roundtrips four-component Part 2 lossy data within bounded error without rewriting ARGB photometric interpretation", () => {
    const raw = new Uint8Array([
      255, 10, 20, 30,
      128, 40, 50, 60,
      64, 70, 80, 90,
      32, 15, 25, 35,
      16, 45, 55, 65,
      8, 75, 85, 95,
    ]);
    const source = buildDataset(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      8,
      8,
      3,
      2,
      4,
      "ARGB",
      raw,
    );

    const parameters = new DicomJpeg2000Params();
    parameters.irreversible = true;
    parameters.targetRatio = 20;
    parameters.numLevels = 3;
    parameters.numLayers = 1;
    parameters.allowMct = false;

    const encoded = new DicomTranscoder(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      DicomTransferSyntax.JPEG2000MC,
      null,
      parameters,
    ).transcode(source);

    expect(encoded.internalTransferSyntax).toBe(DicomTransferSyntax.JPEG2000MC);
    const encodedPixelData = DicomPixelData.create(encoded);
    expect(encodedPixelData.getFrame(0).data.length).toBeGreaterThan(0);
    expect(encodedPixelData.photometricInterpretation).toBe("ARGB");
    expect(encoded.tryGetString(Tags.PhotometricInterpretation)).toBe("ARGB");

    const restored = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000MC,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(encoded);

    const restoredPixelData = DicomPixelData.create(restored);
    const decoded = restoredPixelData.getFrame(0).data;
    expect(restoredPixelData.photometricInterpretation).toBe("ARGB");
    expect(restored.tryGetString(Tags.PhotometricInterpretation)).toBe("ARGB");
    expect(decoded.length).toBe(raw.length);

    for (let i = 0; i < raw.length; i++) {
      expect(Math.abs((decoded[i] ?? 0) - raw[i]!)).toBeLessThanOrEqual(32);
    }
  });

  it("produces deterministic lossless codestream bytes for repeated .90/.92 single-frame encodes", () => {
    const width = 16;
    const height = 16;
    const frame = buildRgbFrame(width, height, 19);

    const matrix = [
      {
        name: ".90-lossless-singleframe-deterministic",
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        parameters: DicomJpeg2000Params.createLosslessDefaults(),
      },
      {
        name: ".92-lossless-singleframe-deterministic",
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        parameters: buildPart2LosslessParams(),
      },
    ];

    for (const entry of matrix) {
      const sourceA = buildDataset(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        8,
        8,
        width,
        height,
        3,
        "RGB",
        frame,
      );
      const sourceB = buildDataset(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        8,
        8,
        width,
        height,
        3,
        "RGB",
        frame,
      );

      const encodedA = new DicomTranscoder(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        entry.syntax,
        null,
        entry.parameters,
      ).transcode(sourceA);
      const encodedB = new DicomTranscoder(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        entry.syntax,
        null,
        entry.parameters,
      ).transcode(sourceB);

      const frameA = DicomPixelData.create(encodedA).getFrame(0).data;
      const frameB = DicomPixelData.create(encodedB).getFrame(0).data;

      expect(frameA.length, `${entry.name} encoded size`).toBeGreaterThan(0);
      expect(sha256(frameA), `${entry.name} hash parity`).toBe(sha256(frameB));
      expect([...frameA], `${entry.name} byte parity`).toEqual([...frameB]);
    }
  });

  it("produces deterministic lossless codestream bytes for repeated .90/.92 multi-frame encodes", () => {
    const width = 16;
    const height = 16;
    const frameA = buildRgbFrame(width, height, 11);
    const frameB = buildRgbFrame(width, height, 37);

    const matrix = [
      {
        name: ".90-lossless-multiframe-deterministic",
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        parameters: DicomJpeg2000Params.createLosslessDefaults(),
      },
      {
        name: ".92-lossless-multiframe-deterministic",
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        parameters: buildPart2LosslessParams(),
      },
    ];

    for (const entry of matrix) {
      const sourceA = buildDataset(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        8,
        8,
        width,
        height,
        3,
        "RGB",
      );
      const sourceB = buildDataset(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        8,
        8,
        width,
        height,
        3,
        "RGB",
      );
      const sourcePixelDataA = DicomPixelData.create(sourceA, true);
      sourcePixelDataA.addFrame(new MemoryByteBuffer(frameA));
      sourcePixelDataA.addFrame(new MemoryByteBuffer(frameB));
      const sourcePixelDataB = DicomPixelData.create(sourceB, true);
      sourcePixelDataB.addFrame(new MemoryByteBuffer(frameA));
      sourcePixelDataB.addFrame(new MemoryByteBuffer(frameB));

      const encodedA = new DicomTranscoder(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        entry.syntax,
        null,
        entry.parameters,
      ).transcode(sourceA);
      const encodedB = new DicomTranscoder(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        entry.syntax,
        null,
        entry.parameters,
      ).transcode(sourceB);

      const encodedPixelDataA = DicomPixelData.create(encodedA);
      const encodedPixelDataB = DicomPixelData.create(encodedB);
      expect(encodedPixelDataA.numberOfFrames, `${entry.name} frame count A`).toBe(2);
      expect(encodedPixelDataB.numberOfFrames, `${entry.name} frame count B`).toBe(2);

      for (let frameIndex = 0; frameIndex < 2; frameIndex++) {
        const encodedFrameA = encodedPixelDataA.getFrame(frameIndex).data;
        const encodedFrameB = encodedPixelDataB.getFrame(frameIndex).data;

        expect(encodedFrameA.length, `${entry.name} frame ${frameIndex} encoded size`).toBeGreaterThan(0);
        expect(sha256(encodedFrameA), `${entry.name} frame ${frameIndex} hash parity`).toBe(sha256(encodedFrameB));
        expect([...encodedFrameA], `${entry.name} frame ${frameIndex} byte parity`).toEqual([...encodedFrameB]);
      }
    }
  });

  it("decodes multi-frame loops for .90/.91/.92/.93 codec classes", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    for (const entry of codecEntries) {
      const encodedDataset = buildDataset(
        entry.syntax,
        8,
        8,
        2,
        2,
        1,
        "MONOCHROME2",
      );
      const encodedPixelData = DicomPixelData.create(encodedDataset, true);
      encodedPixelData.addFrame(new MemoryByteBuffer(buildSingleTileMinimalJ2kCodestream()));
      encodedPixelData.addFrame(new MemoryByteBuffer(buildSingleTileMinimalJ2kCodestream()));

      const decodedDataset = buildDataset(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        8,
        8,
        2,
        2,
        1,
        "MONOCHROME2",
      );

      entry.codec.decode(
        DicomPixelData.create(encodedDataset),
        DicomPixelData.create(decodedDataset, true),
        null,
      );

      const decodedPixelData = DicomPixelData.create(decodedDataset);
      expect(decodedPixelData.numberOfFrames).toBe(2);
      expect(decodedPixelData.getFrame(0).data.length).toBe(4);
      expect(decodedPixelData.getFrame(1).data.length).toBe(4);
    }
  });

  it("keeps DicomTranscoder decode output aligned across LRCP and spatial non-LRCP packet orders", () => {
    const lrcp = buildTwoComponentMultiPrecinctCodestream(
      Jpeg2000ProgressionOrder.LRCP,
      ["c0p0", "c0p1", "c0p2", "c1p0", "c1p1"],
    );
    const rpcl = buildTwoComponentMultiPrecinctCodestream(
      Jpeg2000ProgressionOrder.RPCL,
      ["c0p0", "c1p0", "c0p1", "c0p2", "c1p1"],
    );
    const pcrl = buildTwoComponentMultiPrecinctCodestream(
      Jpeg2000ProgressionOrder.PCRL,
      ["c0p0", "c1p0", "c0p1", "c0p2", "c1p1"],
    );

    const syntaxes = [
      DicomTransferSyntax.JPEG2000Lossless,
      DicomTransferSyntax.JPEG2000Lossy,
      DicomTransferSyntax.JPEG2000MCLossless,
      DicomTransferSyntax.JPEG2000MC,
    ];

    for (const syntax of syntaxes) {
      const lrcpDecoded = decodeSingleFrameViaTranscoder(syntax, lrcp);
      const rpclDecoded = decodeSingleFrameViaTranscoder(syntax, rpcl);
      const pcrlDecoded = decodeSingleFrameViaTranscoder(syntax, pcrl);

      expect(lrcpDecoded.length, `${syntax.uid.uid} decoded size`).toBe(96 * 32 * 2);
      expect([...rpclDecoded], `${syntax.uid.uid} RPCL parity`).toEqual([...lrcpDecoded]);
      expect([...pcrlDecoded], `${syntax.uid.uid} PCRL parity`).toEqual([...lrcpDecoded]);
      expect(new Set(lrcpDecoded).size, `${syntax.uid.uid} non-constant output`).toBeGreaterThan(1);
    }
  });

  it("throws decode metadata validation errors with syntax/frame context", () => {
    const encodedDataset = buildDataset(
      DicomTransferSyntax.JPEG2000Lossless,
      8,
      8,
      3,
      2,
      1,
      "MONOCHROME2",
    );

    DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(buildSingleTileMinimalJ2kCodestream()));

    let thrown: unknown;
    try {
      new DicomJpeg2000LosslessCodec().decode(DicomPixelData.create(encodedDataset), 0);
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(Error);
    const message = (thrown as Error).message;
    expect(message).toContain("JPEG2000 decode failed [class=metadata-mismatch]");
    expect(message).toContain("JPEG2000 decoded frame length mismatch");
    expect(message).toContain("syntax=1.2.840.10008.1.2.4.90");
    expect(message).toContain("frame=0");
  });

  it("classifies malformed decode input as marker-corruption for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    for (const entry of codecEntries) {
      const encodedDataset = buildDataset(
        entry.syntax,
        8,
        8,
        2,
        2,
        1,
        "MONOCHROME2",
      );
      DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(new Uint8Array([0xff, 0xff])));

      let thrown: unknown;
      try {
        entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toBeInstanceOf(Error);
      const message = (thrown as Error).message;
      expect(message).toContain("JPEG2000 decode failed [class=marker-corruption]");
      expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
      expect(message).toContain("frame=0");
    }
  });

  it("classifies truncated decode input as truncation for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    for (const entry of codecEntries) {
      const encodedDataset = buildDataset(
        entry.syntax,
        8,
        8,
        2,
        2,
        1,
        "MONOCHROME2",
      );
      DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(buildTruncatedCodestream()));

      let thrown: unknown;
      try {
        entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toBeInstanceOf(Error);
      const message = (thrown as Error).message;
      expect(message).toContain("JPEG2000 decode failed [class=truncation]");
      expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
      expect(message).toContain("frame=0");
    }
  });

  it("classifies invalid segment length as marker-corruption for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    for (const entry of codecEntries) {
      const encodedDataset = buildDataset(
        entry.syntax,
        8,
        8,
        2,
        2,
        1,
        "MONOCHROME2",
      );
      DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(buildInvalidSegmentLengthCodestream()));

      let thrown: unknown;
      try {
        entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toBeInstanceOf(Error);
      const message = (thrown as Error).message;
      expect(message).toContain("JPEG2000 decode failed [class=marker-corruption]");
      expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
      expect(message).toContain("frame=0");
    }
  });

  it("classifies tile marker sequence errors as marker-corruption for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    for (const entry of codecEntries) {
      const encodedDataset = buildDataset(
        entry.syntax,
        8,
        8,
        2,
        2,
        1,
        "MONOCHROME2",
      );
      DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(buildTileHeaderOrderErrorCodestream()));

      let thrown: unknown;
      try {
        entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toBeInstanceOf(Error);
      const message = (thrown as Error).message;
      expect(message).toContain("JPEG2000 decode failed [class=marker-corruption]");
      expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
      expect(message).toContain("frame=0");
    }
  });

  it("classifies missing SIZ codestream as marker-corruption for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    for (const entry of codecEntries) {
      const encodedDataset = buildDataset(
        entry.syntax,
        8,
        8,
        2,
        2,
        1,
        "MONOCHROME2",
      );
      DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(buildCodestreamMissingSiz()));

      let thrown: unknown;
      try {
        entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toBeInstanceOf(Error);
      const message = (thrown as Error).message;
      expect(message).toContain("JPEG2000 decode failed [class=marker-corruption]");
      expect(message).toContain("missing required SIZ segment");
      expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
      expect(message).toContain("frame=0");
    }
  });

  it("classifies JP2 without jp2c codestream box as marker-corruption for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    for (const entry of codecEntries) {
      const encodedDataset = buildDataset(
        entry.syntax,
        8,
        8,
        2,
        2,
        1,
        "MONOCHROME2",
      );
      DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(buildJp2WithoutCodestreamBox()));

      let thrown: unknown;
      try {
        entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toBeInstanceOf(Error);
      const message = (thrown as Error).message;
      expect(message).toContain("JPEG2000 decode failed [class=marker-corruption]");
      expect(message).toContain("JP2 stream does not contain a jp2c codestream box");
      expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
      expect(message).toContain("frame=0");
    }
  });

  it("classifies invalid SOT Psot (tile-part exceeds codestream) as marker-corruption for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    for (const entry of codecEntries) {
      const encodedDataset = buildDataset(
        entry.syntax,
        8,
        8,
        2,
        2,
        1,
        "MONOCHROME2",
      );
      DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(buildInvalidSotPsotExceedsCodestream()));

      let thrown: unknown;
      try {
        entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toBeInstanceOf(Error);
      const message = (thrown as Error).message;
      expect(message).toContain("JPEG2000 decode failed [class=marker-corruption]");
      expect(message).toContain("Invalid SOT Psot: tile-part exceeds codestream");
      expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
      expect(message).toContain("frame=0");
    }
  });

  it("classifies invalid SOT Psot (tile-part end precedes SOD data) as marker-corruption for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    for (const entry of codecEntries) {
      const encodedDataset = buildDataset(
        entry.syntax,
        8,
        8,
        2,
        2,
        1,
        "MONOCHROME2",
      );
      DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(buildInvalidSotPsotPrecedesSodData()));

      let thrown: unknown;
      try {
        entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toBeInstanceOf(Error);
      const message = (thrown as Error).message;
      expect(message).toContain("JPEG2000 decode failed [class=marker-corruption]");
      expect(message).toContain("Invalid SOT Psot: tile-part end precedes SOD data");
      expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
      expect(message).toContain("frame=0");
    }
  });

  it("classifies missing COD/QCD required main-header segments as marker-corruption for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    const malformedMatrix = [
      {
        name: "missing COD",
        codestream: buildCodestreamMissingCod(),
        detail: "missing required COD segment",
      },
      {
        name: "missing QCD",
        codestream: buildCodestreamMissingQcd(),
        detail: "missing required QCD segment",
      },
    ] as const;

    for (const malformed of malformedMatrix) {
      for (const entry of codecEntries) {
        const encodedDataset = buildDataset(
          entry.syntax,
          8,
          8,
          2,
          2,
          1,
          "MONOCHROME2",
        );
        DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(malformed.codestream));

        let thrown: unknown;
        try {
          entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
        } catch (error) {
          thrown = error;
        }

        expect(thrown).toBeInstanceOf(Error);
        const message = (thrown as Error).message;
        expect(message).toContain("JPEG2000 decode failed [class=marker-corruption]");
        expect(message).toContain(malformed.detail);
        expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
        expect(message).toContain("frame=0");
      }
    }
  });

  it("classifies malformed SIZ/COD/QCD main-header payloads as marker-corruption for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    const malformedMatrix = [
      {
        name: "invalid SIZ payload",
        codestream: buildInvalidSizPayloadLengthCodestream(),
        detail: "Invalid SIZ segment payload length",
      },
      {
        name: "invalid COD payload",
        codestream: buildInvalidCodPayloadLengthCodestream(),
        detail: "Invalid COD segment payload length",
      },
      {
        name: "invalid COD precinct payload",
        codestream: buildInvalidCodPrecinctPayloadLengthCodestream(),
        detail: "Invalid COD precinct payload length",
      },
      {
        name: "invalid QCD payload",
        codestream: buildInvalidQcdPayloadLengthCodestream(),
        detail: "Invalid QCD segment payload length",
      },
    ] as const;

    for (const malformed of malformedMatrix) {
      for (const entry of codecEntries) {
        const encodedDataset = buildDataset(
          entry.syntax,
          8,
          8,
          2,
          2,
          1,
          "MONOCHROME2",
        );
        DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(malformed.codestream));

        let thrown: unknown;
        try {
          entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
        } catch (error) {
          thrown = error;
        }

        expect(thrown).toBeInstanceOf(Error);
        const message = (thrown as Error).message;
        expect(message, malformed.name).toContain("JPEG2000 decode failed [class=marker-corruption]");
        expect(message, malformed.name).toContain(malformed.detail);
        expect(message, malformed.name).toContain(`syntax=${entry.syntax.uid.uid}`);
        expect(message, malformed.name).toContain("frame=0");
      }
    }
  });

  it("classifies JP2 truncated XLBox as truncation for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    for (const entry of codecEntries) {
      const encodedDataset = buildDataset(
        entry.syntax,
        8,
        8,
        2,
        2,
        1,
        "MONOCHROME2",
      );
      DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(buildJp2TruncatedXlbox()));

      let thrown: unknown;
      try {
        entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toBeInstanceOf(Error);
      const message = (thrown as Error).message;
      expect(message).toContain("JPEG2000 decode failed [class=truncation]");
      expect(message).toContain("truncated XLBox");
      expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
      expect(message).toContain("frame=0");
    }
  });

  it("classifies missing EOC marker as truncation for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    for (const entry of codecEntries) {
      const encodedDataset = buildDataset(
        entry.syntax,
        8,
        8,
        2,
        2,
        1,
        "MONOCHROME2",
      );
      DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(buildCodestreamMissingEoc()));

      let thrown: unknown;
      try {
        entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toBeInstanceOf(Error);
      const message = (thrown as Error).message;
      expect(message).toContain("JPEG2000 decode failed [class=truncation]");
      expect(message).toContain("Unexpected end of codestream while peeking marker");
      expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
      expect(message).toContain("frame=0");
    }
  });

  it("classifies duplicate SIZ segment in main header as marker-corruption for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    for (const entry of codecEntries) {
      const encodedDataset = buildDataset(
        entry.syntax,
        8,
        8,
        2,
        2,
        1,
        "MONOCHROME2",
      );
      DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(buildDuplicateSizMainHeaderCodestream()));

      let thrown: unknown;
      try {
        entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toBeInstanceOf(Error);
      const message = (thrown as Error).message;
      expect(message).toContain("JPEG2000 decode failed [class=marker-corruption]");
      expect(message).toContain("Duplicate SIZ segment in main header");
      expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
      expect(message).toContain("frame=0");
    }
  });

  it("classifies duplicate COD segment in main header as marker-corruption for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    for (const entry of codecEntries) {
      const encodedDataset = buildDataset(
        entry.syntax,
        8,
        8,
        2,
        2,
        1,
        "MONOCHROME2",
      );
      DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(buildDuplicateCodMainHeaderCodestream()));

      let thrown: unknown;
      try {
        entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toBeInstanceOf(Error);
      const message = (thrown as Error).message;
      expect(message).toContain("JPEG2000 decode failed [class=marker-corruption]");
      expect(message).toContain("Duplicate COD segment in main header");
      expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
      expect(message).toContain("frame=0");
    }
  });

  it("classifies duplicate QCD segment in main header as marker-corruption for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    for (const entry of codecEntries) {
      const encodedDataset = buildDataset(
        entry.syntax,
        8,
        8,
        2,
        2,
        1,
        "MONOCHROME2",
      );
      DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(buildDuplicateQcdMainHeaderCodestream()));

      let thrown: unknown;
      try {
        entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toBeInstanceOf(Error);
      const message = (thrown as Error).message;
      expect(message).toContain("JPEG2000 decode failed [class=marker-corruption]");
      expect(message).toContain("Duplicate QCD segment in main header");
      expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
      expect(message).toContain("frame=0");
    }
  });

  it("classifies malformed Part2 segment markers as marker-corruption for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    const malformedMatrix = [
      {
        name: "unsupported MCT Zmct",
        codestream: buildUnsupportedMctZmctCodestream(),
        detail: "Unsupported MCT Zmct value",
      },
      {
        name: "unsupported MCT Ymct",
        codestream: buildUnsupportedMctYmctCodestream(),
        detail: "Unsupported MCT Ymct value",
      },
      {
        name: "unsupported MCC Zmcc",
        codestream: buildUnsupportedMccZmccCodestream(),
        detail: "Unsupported MCC Zmcc value",
      },
      {
        name: "unsupported MCC Ymcc",
        codestream: buildUnsupportedMccYmccCodestream(),
        detail: "Unsupported MCC Ymcc value",
      },
      {
        name: "invalid MCT payload length",
        codestream: buildInvalidMctPayloadLengthCodestream(),
        detail: "Invalid MCT segment payload length",
      },
      {
        name: "invalid MCC payload length",
        codestream: buildInvalidMccPayloadLengthCodestream(),
        detail: "Invalid MCC segment payload length",
      },
      {
        name: "invalid MCO payload length",
        codestream: buildInvalidMcoPayloadLengthCodestream(),
        detail: "Invalid MCO segment payload length",
      },
      {
        name: "invalid MCC no collections",
        codestream: buildInvalidMccNoCollectionsCodestream(),
        detail: "Invalid MCC payload: no collections",
      },
    ] as const;

    for (const malformed of malformedMatrix) {
      for (const entry of codecEntries) {
        const encodedDataset = buildDataset(
          entry.syntax,
          8,
          8,
          2,
          2,
          1,
          "MONOCHROME2",
        );
        DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(malformed.codestream));

        let thrown: unknown;
        try {
          entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
        } catch (error) {
          thrown = error;
        }

        expect(thrown).toBeInstanceOf(Error);
        const message = (thrown as Error).message;
        expect(message).toContain("JPEG2000 decode failed [class=marker-corruption]");
        expect(message).toContain(malformed.detail);
        expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
        expect(message).toContain("frame=0");
      }
    }
  });

  it("classifies malformed COC/QCC/POC segment markers as marker-corruption for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    const malformedMatrix = [
      {
        name: "invalid COC payload length",
        codestream: buildInvalidCocPayloadLengthCodestream(),
        detail: "Invalid COC segment payload length",
      },
      {
        name: "invalid COC precinct payload length",
        codestream: buildInvalidCocPrecinctPayloadLengthCodestream(),
        detail: "Invalid COC precinct payload length",
      },
      {
        name: "invalid QCC payload length",
        codestream: buildInvalidQccPayloadLengthCodestream(),
        detail: "Invalid QCC segment payload length",
      },
      {
        name: "invalid POC payload length",
        codestream: buildInvalidPocPayloadLengthCodestream(),
        detail: "Invalid POC segment payload length",
      },
    ] as const;

    for (const malformed of malformedMatrix) {
      for (const entry of codecEntries) {
        const encodedDataset = buildDataset(
          entry.syntax,
          8,
          8,
          2,
          2,
          1,
          "MONOCHROME2",
        );
        DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(malformed.codestream));

        let thrown: unknown;
        try {
          entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
        } catch (error) {
          thrown = error;
        }

        expect(thrown).toBeInstanceOf(Error);
        const message = (thrown as Error).message;
        expect(message).toContain("JPEG2000 decode failed [class=marker-corruption]");
        expect(message).toContain(malformed.detail);
        expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
        expect(message).toContain("frame=0");
      }
    }
  });

  it("classifies main-header marker ordering and duplicate component marker conflicts as marker-corruption for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    const malformedMatrix = [
      {
        name: "COD before SIZ",
        codestream: buildCodecMainHeaderOrderingCodestream("cod-before-siz"),
        detail: "COD encountered before SIZ",
      },
      {
        name: "QCD before SIZ",
        codestream: buildCodecMainHeaderOrderingCodestream("qcd-before-siz"),
        detail: "QCD encountered before SIZ",
      },
      {
        name: "COC before COD",
        codestream: buildCodecMainHeaderOrderingCodestream("coc-before-cod"),
        detail: "COC encountered before COD",
      },
      {
        name: "QCC before QCD",
        codestream: buildCodecMainHeaderOrderingCodestream("qcc-before-qcd"),
        detail: "QCC encountered before QCD",
      },
      {
        name: "POC before COD",
        codestream: buildCodecMainHeaderOrderingCodestream("poc-before-cod"),
        detail: "POC encountered before COD",
      },
      {
        name: "RGN before SIZ",
        codestream: buildCodecMainHeaderOrderingCodestream("rgn-before-siz"),
        detail: "RGN encountered before SIZ",
      },
      {
        name: "MCT before SIZ",
        codestream: buildCodecMainHeaderOrderingCodestream("mct-before-siz"),
        detail: "MCT encountered before SIZ",
      },
      {
        name: "MCC before SIZ",
        codestream: buildCodecMainHeaderOrderingCodestream("mcc-before-siz"),
        detail: "MCC encountered before SIZ",
      },
      {
        name: "MCO before SIZ",
        codestream: buildCodecMainHeaderOrderingCodestream("mco-before-siz"),
        detail: "MCO encountered before SIZ",
      },
      {
        name: "unknown marker before SIZ",
        codestream: buildCodecMainHeaderOrderingCodestream("unknown-before-siz"),
        detail: "Unexpected marker before SIZ",
      },
      {
        name: "duplicate COC for component",
        codestream: buildDuplicateCodecMainHeaderComponentSegmentCodestream("coc"),
        detail: "Duplicate COC for component 0",
      },
      {
        name: "duplicate QCC for component",
        codestream: buildDuplicateCodecMainHeaderComponentSegmentCodestream("qcc"),
        detail: "Duplicate QCC for component 0",
      },
    ] as const;

    for (const malformed of malformedMatrix) {
      for (const entry of codecEntries) {
        const encodedDataset = buildDataset(
          entry.syntax,
          8,
          8,
          2,
          2,
          1,
          "MONOCHROME2",
        );
        DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(malformed.codestream));

        let thrown: unknown;
        try {
          entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
        } catch (error) {
          thrown = error;
        }

        expect(thrown).toBeInstanceOf(Error);
        const message = (thrown as Error).message;
        expect(message).toContain("JPEG2000 decode failed [class=marker-corruption]");
        expect(message).toContain(malformed.detail);
        expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
        expect(message).toContain("frame=0");
      }
    }
  });

  it("classifies conflicting duplicate tile-header COC/QCC segments as marker-corruption for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    const malformedMatrix = [
      {
        name: "duplicate tile COC",
        codestream: buildDuplicateTileHeaderComponentConflictCodestream("coc"),
        detail: "duplicate tile COC for component 0",
      },
      {
        name: "duplicate tile QCC",
        codestream: buildDuplicateTileHeaderComponentConflictCodestream("qcc"),
        detail: "duplicate tile QCC for component 0",
      },
    ] as const;

    for (const malformed of malformedMatrix) {
      for (const entry of codecEntries) {
        const encodedDataset = buildDataset(
          entry.syntax,
          8,
          8,
          2,
          2,
          1,
          "MONOCHROME2",
        );
        DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(malformed.codestream));

        let thrown: unknown;
        try {
          entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
        } catch (error) {
          thrown = error;
        }

        expect(thrown).toBeInstanceOf(Error);
        const message = (thrown as Error).message;
        expect(message).toContain("JPEG2000 decode failed [class=marker-corruption]");
        expect(message).toContain(malformed.detail);
        expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
        expect(message).toContain("frame=0");
      }
    }
  });

  it("accepts duplicate tile-header COD/QCD segments and keeps decoding with the final values for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    const codestreams = [
      buildDuplicateTileHeaderCodCodestream(),
      buildDuplicateTileHeaderQcdCodestream(),
    ];

    for (const codestream of codestreams) {
      for (const entry of codecEntries) {
        const encodedDataset = buildDataset(
          entry.syntax,
          8,
          8,
          2,
          2,
          1,
          "MONOCHROME2",
        );
        DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(codestream));

        const decoded = entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
        expect(decoded.data.length).toBe(4);
      }
    }
  });

  it("classifies strict decoder tile-state failures as marker-corruption for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    const malformedMatrix = [
      {
        name: "no tiles found",
        codestream: buildMinimalJ2kCodestream(),
        detail: "no tiles found in codestream",
      },
      {
        name: "unsupported progression order",
        codestream: buildUnsupportedProgressionOrderTileCodestream(),
        detail: "unsupported progression order: 99",
      },
    ] as const;

    for (const malformed of malformedMatrix) {
      for (const entry of codecEntries) {
        const encodedDataset = buildDataset(
          entry.syntax,
          8,
          8,
          2,
          2,
          1,
          "MONOCHROME2",
        );
        DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(malformed.codestream));

        let thrown: unknown;
        try {
          entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
        } catch (error) {
          thrown = error;
        }

        expect(thrown).toBeInstanceOf(Error);
        const message = (thrown as Error).message;
        expect(message).toContain("JPEG2000 decode failed [class=marker-corruption]");
        expect(message).toContain(malformed.detail);
        expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
        expect(message).toContain("frame=0");
      }
    }
  });

  it("classifies malformed COM marker usage as marker-corruption for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    const malformedMatrix = [
      {
        name: "invalid COM payload length",
        codestream: buildInvalidComPayloadLengthCodestream(),
        detail: "Invalid COM segment payload length",
      },
      {
        name: "COM before SIZ",
        codestream: buildComBeforeSizCodestream(),
        detail: "COM encountered before SIZ",
      },
    ] as const;

    for (const malformed of malformedMatrix) {
      for (const entry of codecEntries) {
        const encodedDataset = buildDataset(
          entry.syntax,
          8,
          8,
          2,
          2,
          1,
          "MONOCHROME2",
        );
        DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(malformed.codestream));

        let thrown: unknown;
        try {
          entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
        } catch (error) {
          thrown = error;
        }

        expect(thrown).toBeInstanceOf(Error);
        const message = (thrown as Error).message;
        expect(message).toContain("JPEG2000 decode failed [class=marker-corruption]");
        expect(message).toContain(malformed.detail);
        expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
        expect(message).toContain("frame=0");
      }
    }
  });

  it("classifies malformed/conflicting RGN markers as marker-corruption for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    const malformedMatrix = [
      {
        name: "invalid RGN payload length",
        codestream: buildInvalidRgnPayloadLengthCodestream(),
        detail: "Invalid RGN segment payload length",
      },
      {
        name: "conflicting tile-part RGN",
        codestream: buildConflictingTileRgnCodestream(),
        detail: "RGN differs between tile-parts",
      },
    ] as const;

    for (const malformed of malformedMatrix) {
      for (const entry of codecEntries) {
        const encodedDataset = buildDataset(
          entry.syntax,
          8,
          8,
          2,
          2,
          1,
          "MONOCHROME2",
        );
        DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(malformed.codestream));

        let thrown: unknown;
        try {
          entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
        } catch (error) {
          thrown = error;
        }

        expect(thrown).toBeInstanceOf(Error);
        const message = (thrown as Error).message;
        expect(message).toContain("JPEG2000 decode failed [class=marker-corruption]");
        expect(message).toContain(malformed.detail);
        expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
        expect(message).toContain("frame=0");
      }
    }
  });

  it("classifies invalid tile-part ordering and TNsot mismatches as marker-corruption for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    const malformedMatrix = [
      {
        name: "first tile-part index is not zero",
        codestream: buildTilePartSequenceCodestream([
          { tilePartIndex: 1, totalTileParts: 2, payload: [0x01] },
        ]),
        detail: "first tile-part index is 1",
      },
      {
        name: "unexpected tile-part index gap",
        codestream: buildTilePartSequenceCodestream([
          { tilePartIndex: 0, totalTileParts: 3, payload: [0x01] },
          { tilePartIndex: 2, totalTileParts: 3, payload: [0x02] },
        ]),
        detail: "unexpected tile-part index 2 (expected 1)",
      },
      {
        name: "mismatched TNsot",
        codestream: buildTilePartSequenceCodestream([
          { tilePartIndex: 0, totalTileParts: 2, payload: [0x01] },
          { tilePartIndex: 1, totalTileParts: 3, payload: [0x02] },
        ]),
        detail: "mismatched TNsot 3 (expected 2)",
      },
      {
        name: "tile-part count exceeded",
        codestream: buildTilePartSequenceCodestream([
          { tilePartIndex: 0, totalTileParts: 2, payload: [0x01] },
          { tilePartIndex: 1, totalTileParts: 2, payload: [0x02] },
          { tilePartIndex: 2, totalTileParts: 2, payload: [0x03] },
        ]),
        detail: "tile-part count exceeded (TNsot=2)",
      },
    ] as const;

    for (const malformed of malformedMatrix) {
      for (const entry of codecEntries) {
        const encodedDataset = buildDataset(
          entry.syntax,
          8,
          8,
          2,
          2,
          1,
          "MONOCHROME2",
        );
        DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(malformed.codestream));

        let thrown: unknown;
        try {
          entry.codec.decode(DicomPixelData.create(encodedDataset), 0);
        } catch (error) {
          thrown = error;
        }

        expect(thrown).toBeInstanceOf(Error);
        const message = (thrown as Error).message;
        expect(message).toContain("JPEG2000 decode failed [class=marker-corruption]");
        expect(message).toContain(malformed.detail);
        expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
        expect(message).toContain("frame=0");
      }
    }
  });

  it("wraps encode validation errors with syntax/frame context for .90/.91/.92/.93", () => {
    const codecEntries = [
      {
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        codec: new DicomJpeg2000LosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        codec: new DicomJpeg2000LossyCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        codec: new DicomJpeg2000Part2MCLosslessCodec(),
      },
      {
        syntax: DicomTransferSyntax.JPEG2000MC,
        codec: new DicomJpeg2000Part2MCCodec(),
      },
    ];

    for (const entry of codecEntries) {
      const sourceDataset = buildDataset(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        12,
        12,
        2,
        2,
        1,
        "MONOCHROME2",
        new Uint16Array([1, 2, 3, 4]),
      );
      const encodedDataset = buildDataset(
        entry.syntax,
        12,
        12,
        2,
        2,
        1,
        "MONOCHROME2",
      );

      let thrown: unknown;
      try {
        entry.codec.encode(
          DicomPixelData.create(sourceDataset),
          DicomPixelData.create(encodedDataset, true),
          null,
        );
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toBeInstanceOf(Error);
      const message = (thrown as Error).message;
      expect(message).toContain("JPEG2000 encode failed [class=validation]");
      expect(message).toContain("JPEG2000 supports BitsAllocated 8 or 16");
      expect(message).toContain(`syntax=${entry.syntax.uid.uid}`);
      expect(message).toContain("frame=0");
    }
  });

  it("derives lossless layering from rate/rateLevels when targetRatio is unset", () => {
    const raw = new Uint8Array([
      5, 15, 25, 35,
      45, 55, 65, 75,
      85, 95, 105, 115,
      125, 135, 145, 155,
    ]);
    const source = buildDataset(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      8,
      8,
      4,
      4,
      1,
      "MONOCHROME2",
      raw,
    );

    const parameters = DicomJpeg2000Params.createLosslessDefaults();
    parameters.rate = 32;
    parameters.rateLevels = [128, 64, 32, 16];
    parameters.targetRatio = 0;
    parameters.numLayers = 1;

    const transcoded = new DicomTranscoder(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      DicomTransferSyntax.JPEG2000Lossless,
      null,
      parameters,
    ).transcode(source);

    const codestream = DicomPixelData.create(transcoded).getFrame(0).data;
    const parsed = parseJpeg2000Codestream(codestream);

    expect(parsed.cod?.numberOfLayers).toBe(3);
    expect((parsed.cod?.codeBlockStyle ?? 0) & 0x04).toBe(0x04);
  });

  it("falls back invalid lossless parameter values during encode", () => {
    const raw = new Uint8Array([
      1, 2, 3, 4,
      5, 6, 7, 8,
      9, 10, 11, 12,
      13, 14, 15, 16,
    ]);
    const source = buildDataset(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      8,
      8,
      4,
      4,
      1,
      "MONOCHROME2",
      raw,
    );

    const parameters = DicomJpeg2000Params.createLosslessDefaults();
    (parameters as { progressionOrder: number }).progressionOrder = 99;
    parameters.numLayers = 0;
    parameters.targetRatio = -2;
    parameters.rate = 0;

    const transcoded = new DicomTranscoder(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      DicomTransferSyntax.JPEG2000Lossless,
      null,
      parameters,
    ).transcode(source);

    const codestream = DicomPixelData.create(transcoded).getFrame(0).data;
    const parsed = parseJpeg2000Codestream(codestream);

    expect(parsed.cod?.progressionOrder).toBe(0);
    expect(parsed.cod?.numberOfLayers).toBe(1);
    expect((parsed.cod?.codeBlockStyle ?? 0) & 0x04).toBe(0);
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

function buildSingleTileMinimalJ2kCodestream(): Uint8Array {
  const bytes = Array.from(buildMinimalJ2kCodestream().subarray(0, buildMinimalJ2kCodestream().length - 2));
  pushU16(bytes, 0xff90); // SOT
  pushU16(bytes, 10);
  pushU16(bytes, 0);
  pushU32(bytes, 14);
  bytes.push(0, 1);
  pushU16(bytes, 0xff93); // SOD
  pushU16(bytes, 0xffd9); // EOC
  return new Uint8Array(bytes);
}

function decodeSingleFrameViaTranscoder(
  syntax: DicomTransferSyntax,
  codestream: Uint8Array,
): Uint8Array {
  const encodedDataset = buildDataset(
    syntax,
    8,
    8,
    96,
    32,
    2,
    "MONOCHROME2",
  );
  DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(codestream));

  const decodedDataset = new DicomTranscoder(
    syntax,
    DicomTransferSyntax.ExplicitVRLittleEndian,
  ).transcode(encodedDataset);

  expect(decodedDataset.internalTransferSyntax).toBe(DicomTransferSyntax.ExplicitVRLittleEndian);
  const decodedPixelData = DicomPixelData.create(decodedDataset);
  expect(decodedPixelData.numberOfFrames).toBe(1);

  return decodedPixelData.getFrame(0).data;
}

function buildTwoComponentMultiPrecinctCodestream(
  progressionOrder: Jpeg2000ProgressionOrder,
  packetOrder: readonly PacketOrderKey[],
): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, 0xff4f); // SOC
  pushU16(bytes, 0xff51); // SIZ
  pushU16(bytes, 44);
  pushU16(bytes, 0);
  pushU32(bytes, 96);
  pushU32(bytes, 32);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU32(bytes, 96);
  pushU32(bytes, 32);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU16(bytes, 2);
  bytes.push(7, 1, 1);
  bytes.push(7, 2, 1);

  pushU16(bytes, 0xff52); // COD
  pushU16(bytes, 13);
  bytes.push(0x01, progressionOrder & 0xff);
  pushU16(bytes, 1);
  bytes.push(0, 0, 3, 3, 0, 1, 0x55);

  pushU16(bytes, 0xff5c); // QCD
  pushU16(bytes, 5);
  bytes.push(0, 0, 0);

  const packetPayload = packetOrder.flatMap((key) => buildSingleCodeBlockPacketBytes(PACKET_BODIES[key]));
  pushU16(bytes, 0xff90); // SOT
  pushU16(bytes, 10);
  pushU16(bytes, 0);
  pushU32(bytes, 14 + packetPayload.length);
  bytes.push(0, 1);
  pushU16(bytes, 0xff93); // SOD
  bytes.push(...packetPayload);

  pushU16(bytes, 0xffd9); // EOC
  return new Uint8Array(bytes);
}

function buildSingleCodeBlockPacketBytes(body: readonly number[]): number[] {
  return [0xe3, ...body];
}

type PacketOrderKey = "c0p0" | "c0p1" | "c0p2" | "c1p0" | "c1p1";

const PACKET_BODIES: Record<PacketOrderKey, readonly number[]> = {
  c0p0: [0x11, 0x22, 0x33],
  c0p1: [0x44, 0x55, 0x66],
  c0p2: [0x77, 0x88, 0x99],
  c1p0: [0xaa, 0xbb, 0xcc],
  c1p1: [0xdd, 0xee, 0xff],
};

function pushU16(target: number[], value: number): void {
  target.push((value >>> 8) & 0xff, value & 0xff);
}

function pushU32(target: number[], value: number): void {
  target.push((value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff);
}

function buildTruncatedCodestream(): Uint8Array {
  return buildMinimalJ2kCodestream().subarray(0, 8);
}

function buildInvalidSegmentLengthCodestream(): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, 0xff4f); // SOC
  pushU16(bytes, 0xff51); // SIZ
  pushU16(bytes, 1); // invalid (<2)
  pushU16(bytes, 0xffd9); // EOC
  return new Uint8Array(bytes);
}

function buildTileHeaderOrderErrorCodestream(): Uint8Array {
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

  // Tile sequence with wrong order: SOT followed directly by EOC (missing SOD)
  pushU16(bytes, 0xff90); // SOT
  pushU16(bytes, 10);
  pushU16(bytes, 0);
  pushU32(bytes, 14);
  bytes.push(0, 1);
  pushU16(bytes, 0xffd9); // EOC
  return new Uint8Array(bytes);
}

function buildCodestreamMissingSiz(): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, 0xff4f); // SOC
  pushU16(bytes, 0xffd9); // EOC
  return new Uint8Array(bytes);
}

function buildJp2WithoutCodestreamBox(): Uint8Array {
  const bytes: number[] = [];

  // JP2 Signature box
  pushU32(bytes, 12);
  pushU32(bytes, 0x6a502020); // "jP  "
  bytes.push(0x0d, 0x0a, 0x87, 0x0a);

  // JP2 File Type box
  pushU32(bytes, 20);
  pushU32(bytes, 0x66747970); // "ftyp"
  pushU32(bytes, 0x6a703220); // "jp2 "
  pushU32(bytes, 0); // minor version
  pushU32(bytes, 0x6a703220); // compatibility list: "jp2 "

  return new Uint8Array(bytes);
}

function buildInvalidSotPsotExceedsCodestream(): Uint8Array {
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

  // SOT declares tile-part end beyond codestream length.
  pushU16(bytes, 0xff90); // SOT
  pushU16(bytes, 10);
  pushU16(bytes, 0);
  pushU32(bytes, 4096); // invalid oversized psot
  bytes.push(0, 1);
  pushU16(bytes, 0xff93); // SOD
  bytes.push(0x00);
  pushU16(bytes, 0xffd9); // EOC

  return new Uint8Array(bytes);
}

function buildInvalidSotPsotPrecedesSodData(): Uint8Array {
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

  // SOT with tiny Psot so tile-part end is before SOD payload start.
  pushU16(bytes, 0xff90); // SOT
  pushU16(bytes, 10);
  pushU16(bytes, 0);
  pushU32(bytes, 11); // invalid undersized psot
  bytes.push(0, 1);
  pushU16(bytes, 0xff93); // SOD
  bytes.push(0x00);
  pushU16(bytes, 0xffd9); // EOC

  return new Uint8Array(bytes);
}

function buildJp2TruncatedXlbox(): Uint8Array {
  const bytes: number[] = [];

  // Valid JP2 signature box.
  pushU32(bytes, 12);
  pushU32(bytes, 0x6a502020); // "jP  "
  bytes.push(0x0d, 0x0a, 0x87, 0x0a);

  // Next box declares XLBox but payload is truncated (< 8 bytes of XLBox field).
  pushU32(bytes, 1);
  pushU32(bytes, 0x66747970); // "ftyp"
  bytes.push(0x00, 0x00, 0x00, 0x00);

  return new Uint8Array(bytes);
}

function buildCodestreamMissingEoc(): Uint8Array {
  const codestream = buildMinimalJ2kCodestream();
  return codestream.subarray(0, codestream.length - 2);
}

function buildCodestreamMissingCod(): Uint8Array {
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
  pushU16(bytes, 0xff5c); // QCD
  pushU16(bytes, 5);
  bytes.push(0, 0, 0);
  pushU16(bytes, 0xffd9); // EOC
  return new Uint8Array(bytes);
}

function buildCodestreamMissingQcd(): Uint8Array {
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
  pushU16(bytes, 0xffd9); // EOC
  return new Uint8Array(bytes);
}

function buildInvalidSizPayloadLengthCodestream(): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, 0xff4f); // SOC
  pushU16(bytes, 0xff51); // SIZ
  pushU16(bytes, 10); // payload=8, invalid (<36)
  pushU16(bytes, 0);
  pushU32(bytes, 2);
  pushU16(bytes, 0xffd9); // EOC
  return new Uint8Array(bytes);
}

function buildInvalidCodPayloadLengthCodestream(): Uint8Array {
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
  pushU16(bytes, 8); // payload=6, invalid (<10)
  bytes.push(0, 0, 0, 1, 0, 0);
  pushU16(bytes, 0xffd9); // EOC
  return new Uint8Array(bytes);
}

function buildInvalidCodPrecinctPayloadLengthCodestream(): Uint8Array {
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
  pushU16(bytes, 12); // payload=10 but Scod says precincts => should be 11
  bytes.push(0x01, 0x00);
  pushU16(bytes, 1);
  bytes.push(0, 0, 2, 2, 0, 1);
  pushU16(bytes, 0xffd9); // EOC
  return new Uint8Array(bytes);
}

function buildInvalidQcdPayloadLengthCodestream(): Uint8Array {
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
  pushU16(bytes, 2); // payload=0, invalid
  pushU16(bytes, 0xffd9); // EOC
  return new Uint8Array(bytes);
}

function buildDuplicateSizMainHeaderCodestream(): Uint8Array {
  const bytes = Array.from(buildMinimalJ2kCodestream());
  bytes.splice(bytes.length - 2, 0,
    0xff, 0x51, // duplicate SIZ marker
    0x00, 0x29, // length=41
    0x00, 0x00, // Rsiz
    0x00, 0x00, 0x00, 0x02, // Xsiz
    0x00, 0x00, 0x00, 0x02, // Ysiz
    0x00, 0x00, 0x00, 0x00, // XOsiz
    0x00, 0x00, 0x00, 0x00, // YOsiz
    0x00, 0x00, 0x00, 0x02, // XTsiz
    0x00, 0x00, 0x00, 0x02, // YTsiz
    0x00, 0x00, 0x00, 0x00, // XTOsiz
    0x00, 0x00, 0x00, 0x00, // YTOsiz
    0x00, 0x01, // Csiz
    0x07, 0x01, 0x01,
  );
  return new Uint8Array(bytes);
}

function buildDuplicateCodMainHeaderCodestream(): Uint8Array {
  const bytes = Array.from(buildMinimalJ2kCodestream());
  bytes.splice(bytes.length - 2, 0,
    0xff, 0x52, // duplicate COD marker
    0x00, 0x0c, // length=12
    0x00, 0x00,
    0x00, 0x01,
    0x00, 0x00, 0x02, 0x02, 0x00, 0x01,
  );
  return new Uint8Array(bytes);
}

function buildDuplicateQcdMainHeaderCodestream(): Uint8Array {
  const bytes = Array.from(buildMinimalJ2kCodestream());
  bytes.splice(bytes.length - 2, 0,
    0xff, 0x5c, // duplicate QCD marker
    0x00, 0x05, // length=5
    0x00, 0x00, 0x00,
  );
  return new Uint8Array(bytes);
}

function insertMainHeaderSegment(codestream: Uint8Array, segmentBytes: number[]): Uint8Array {
  const bytes = Array.from(codestream);
  bytes.splice(bytes.length - 2, 0, ...segmentBytes);
  return new Uint8Array(bytes);
}

function buildUnsupportedMctZmctCodestream(): Uint8Array {
  return insertMainHeaderSegment(buildMinimalJ2kCodestream(), [
    0xff, 0x74, // MCT
    0x00, 0x08, // length=8 (payload=6)
    0x00, 0x01, // Zmct=1 (unsupported)
    0x00, 0x00, // Imct
    0x00, 0x00, // Ymct
  ]);
}

function buildUnsupportedMctYmctCodestream(): Uint8Array {
  return insertMainHeaderSegment(buildMinimalJ2kCodestream(), [
    0xff, 0x74, // MCT
    0x00, 0x08, // length=8 (payload=6)
    0x00, 0x00, // Zmct
    0x00, 0x00, // Imct
    0x00, 0x01, // Ymct=1 (unsupported)
  ]);
}

function buildUnsupportedMccZmccCodestream(): Uint8Array {
  return insertMainHeaderSegment(buildMinimalJ2kCodestream(), [
    0xff, 0x75, // MCC
    0x00, 0x09, // length=9 (payload=7)
    0x00, 0x01, // Zmcc=1 (unsupported)
    0x00, // Imcc
    0x00, 0x00, // Ymcc
    0x00, 0x01, // Qmcc
  ]);
}

function buildUnsupportedMccYmccCodestream(): Uint8Array {
  return insertMainHeaderSegment(buildMinimalJ2kCodestream(), [
    0xff, 0x75, // MCC
    0x00, 0x09, // length=9 (payload=7)
    0x00, 0x00, // Zmcc
    0x00, // Imcc
    0x00, 0x01, // Ymcc=1 (unsupported)
    0x00, 0x01, // Qmcc
  ]);
}

function buildInvalidMctPayloadLengthCodestream(): Uint8Array {
  return insertMainHeaderSegment(buildMinimalJ2kCodestream(), [
    0xff, 0x74, // MCT
    0x00, 0x07, // length=7 (payload=5, invalid)
    0x00, 0x00,
    0x00, 0x00,
    0x00,
  ]);
}

function buildInvalidMccPayloadLengthCodestream(): Uint8Array {
  return insertMainHeaderSegment(buildMinimalJ2kCodestream(), [
    0xff, 0x75, // MCC
    0x00, 0x08, // length=8 (payload=6, invalid)
    0x00, 0x00,
    0x00,
    0x00, 0x00,
    0x00,
  ]);
}

function buildInvalidMcoPayloadLengthCodestream(): Uint8Array {
  return insertMainHeaderSegment(buildMinimalJ2kCodestream(), [
    0xff, 0x77, // MCO
    0x00, 0x02, // length=2 (payload=0, invalid)
  ]);
}

function buildInvalidMccNoCollectionsCodestream(): Uint8Array {
  return insertMainHeaderSegment(buildMinimalJ2kCodestream(), [
    0xff, 0x75, // MCC
    0x00, 0x09, // length=9 (payload=7)
    0x00, 0x00, // Zmcc
    0x00, // Imcc
    0x00, 0x00, // Ymcc
    0x00, 0x00, // Qmcc=0 (invalid)
  ]);
}

function buildInvalidCocPayloadLengthCodestream(): Uint8Array {
  return insertMainHeaderSegment(buildMinimalJ2kCodestream(), [
    0xff, 0x53, // COC
    0x00, 0x06, // length=6 (payload=4, invalid)
    0x00, // component
    0x00, // Scoc
    0x02, // levels
    0x03, // cb width
  ]);
}

function buildInvalidCocPrecinctPayloadLengthCodestream(): Uint8Array {
  return insertMainHeaderSegment(buildMinimalJ2kCodestream(), [
    0xff, 0x53, // COC
    0x00, 0x09, // length=9 (payload=7, missing 3 precinct bytes for 2 levels)
    0x00, // component
    0x01, // Scoc with precincts present
    0x02, // levels
    0x03, // cb width
    0x03, // cb height
    0x00, // cb style
    0x01, // transform
  ]);
}

function buildInvalidQccPayloadLengthCodestream(): Uint8Array {
  return insertMainHeaderSegment(buildMinimalJ2kCodestream(), [
    0xff, 0x5d, // QCC
    0x00, 0x03, // length=3 (payload=1, invalid)
    0x00, // truncated component only
  ]);
}

function buildInvalidPocPayloadLengthCodestream(): Uint8Array {
  return insertMainHeaderSegment(buildMinimalJ2kCodestream(), [
    0xff, 0x5f, // POC
    0x00, 0x08, // length=8 (payload=6, invalid for 1-byte component case)
    0x00, // RSpoc
    0x00, // CSpoc
    0x00, 0x01, // LYEpoc
    0x01, // REpoc
    0x02, // CEpoc
  ]);
}

function buildInvalidComPayloadLengthCodestream(): Uint8Array {
  return insertMainHeaderSegment(buildMinimalJ2kCodestream(), [
    0xff, 0x64, // COM
    0x00, 0x03, // length=3 (payload=1, invalid)
    0x00,
  ]);
}

function buildInvalidRgnPayloadLengthCodestream(): Uint8Array {
  return insertMainHeaderSegment(buildMinimalJ2kCodestream(), [
    0xff, 0x5e, // RGN
    0x00, 0x04, // length=4 (payload=2, invalid for 1-byte component case)
    0x00,
    0x00,
  ]);
}

function buildComBeforeSizCodestream(): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, 0xff4f); // SOC
  pushU16(bytes, 0xff64); // COM
  pushU16(bytes, 0x0004); // length=4 (payload=2)
  pushU16(bytes, 0x0000); // Rcom
  pushU16(bytes, 0xffd9); // EOC
  return new Uint8Array(bytes);
}

function buildDuplicateTileHeaderComponentConflictCodestream(kind: "coc" | "qcc"): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, 0xff4f); // SOC
  bytes.push(...buildMinimalJ2kCodestream().subarray(2, buildMinimalJ2kCodestream().length - 2));

  const header = kind === "coc"
    ? [
        0xff, 0x53, 0x00, 0x09, 0x00, 0x00, 0x02, 0x03, 0x04, 0x00, 0x01,
        0xff, 0x53, 0x00, 0x09, 0x00, 0x00, 0x02, 0x04, 0x04, 0x00, 0x01,
      ]
    : [
        0xff, 0x5d, 0x00, 0x06, 0x00, 0x02, 0x12, 0x34,
        0xff, 0x5d, 0x00, 0x06, 0x00, 0x02, 0x12, 0x35,
      ];

  pushU16(bytes, 0xff90); // SOT
  pushU16(bytes, 10);
  pushU16(bytes, 0);
  pushU32(bytes, 14 + header.length + 1);
  bytes.push(0, 1);
  bytes.push(...header);
  pushU16(bytes, 0xff93); // SOD
  bytes.push(0x00);

  pushU16(bytes, 0xffd9); // EOC
  return new Uint8Array(bytes);
}

function buildDuplicateTileHeaderCodCodestream(): Uint8Array {
  const bytes = Array.from(buildMinimalJ2kCodestream().subarray(0, buildMinimalJ2kCodestream().length - 2));
  const header = [
    0xff, 0x52, 0x00, 0x0c, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x02, 0x02, 0x00, 0x01,
    0xff, 0x52, 0x00, 0x0c, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x00, 0x01,
  ];

  pushU16(bytes, 0xff90); // SOT
  pushU16(bytes, 10);
  pushU16(bytes, 0);
  pushU32(bytes, 14 + header.length);
  bytes.push(0, 1);
  bytes.push(...header);
  pushU16(bytes, 0xff93); // SOD
  pushU16(bytes, 0xffd9); // EOC
  return new Uint8Array(bytes);
}

function buildDuplicateTileHeaderQcdCodestream(): Uint8Array {
  const bytes = Array.from(buildMinimalJ2kCodestream().subarray(0, buildMinimalJ2kCodestream().length - 2));
  const header = [
    0xff, 0x5c, 0x00, 0x05, 0x00, 0x00, 0x01,
    0xff, 0x5c, 0x00, 0x05, 0x00, 0x00, 0x00,
  ];

  pushU16(bytes, 0xff90); // SOT
  pushU16(bytes, 10);
  pushU16(bytes, 0);
  pushU32(bytes, 14 + header.length);
  bytes.push(0, 1);
  bytes.push(...header);
  pushU16(bytes, 0xff93); // SOD
  pushU16(bytes, 0xffd9); // EOC
  return new Uint8Array(bytes);
}

function buildUnsupportedProgressionOrderTileCodestream(): Uint8Array {
  const bytes = Array.from(buildMinimalJ2kCodestream().subarray(0, buildMinimalJ2kCodestream().length - 2));
  bytes[50] = 99;

  pushU16(bytes, 0xff90); // SOT
  pushU16(bytes, 10);
  pushU16(bytes, 0);
  pushU32(bytes, 14);
  bytes.push(0, 1);
  pushU16(bytes, 0xff93); // SOD

  pushU16(bytes, 0xffd9); // EOC
  return new Uint8Array(bytes);
}

function buildCodecMainHeaderOrderingCodestream(
  kind:
    | "cod-before-siz"
    | "qcd-before-siz"
    | "coc-before-cod"
    | "qcc-before-qcd"
    | "poc-before-cod"
    | "rgn-before-siz"
    | "mct-before-siz"
    | "mcc-before-siz"
    | "mco-before-siz"
    | "unknown-before-siz",
): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, 0xff4f); // SOC

  switch (kind) {
    case "cod-before-siz":
      appendCodecCodSegment(bytes);
      appendCodecSizSegment(bytes);
      appendCodecQcdSegment(bytes);
      break;
    case "qcd-before-siz":
      appendCodecQcdSegment(bytes);
      appendCodecSizSegment(bytes);
      appendCodecCodSegment(bytes);
      break;
    case "coc-before-cod":
      appendCodecSizSegment(bytes);
      appendCodecCocSegment(bytes, false);
      appendCodecCodSegment(bytes);
      appendCodecQcdSegment(bytes);
      break;
    case "qcc-before-qcd":
      appendCodecSizSegment(bytes);
      appendCodecCodSegment(bytes);
      appendCodecQccSegment(bytes, false);
      appendCodecQcdSegment(bytes);
      break;
    case "poc-before-cod":
      appendCodecSizSegment(bytes);
      appendCodecPocSegment(bytes);
      appendCodecCodSegment(bytes);
      appendCodecQcdSegment(bytes);
      break;
    case "rgn-before-siz":
      appendCodecRgnSegment(bytes);
      appendCodecSizSegment(bytes);
      appendCodecCodSegment(bytes);
      appendCodecQcdSegment(bytes);
      break;
    case "mct-before-siz":
      appendCodecMctSegment(bytes);
      appendCodecSizSegment(bytes);
      appendCodecCodSegment(bytes);
      appendCodecQcdSegment(bytes);
      break;
    case "mcc-before-siz":
      appendCodecMccSegment(bytes);
      appendCodecSizSegment(bytes);
      appendCodecCodSegment(bytes);
      appendCodecQcdSegment(bytes);
      break;
    case "mco-before-siz":
      appendCodecMcoSegment(bytes);
      appendCodecSizSegment(bytes);
      appendCodecCodSegment(bytes);
      appendCodecQcdSegment(bytes);
      break;
    case "unknown-before-siz":
      appendCodecUnknownMainHeaderSegment(bytes);
      appendCodecSizSegment(bytes);
      appendCodecCodSegment(bytes);
      appendCodecQcdSegment(bytes);
      break;
  }

  pushU16(bytes, 0xffd9); // EOC
  return new Uint8Array(bytes);
}

function buildDuplicateCodecMainHeaderComponentSegmentCodestream(kind: "coc" | "qcc"): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, 0xff4f); // SOC
  appendCodecSizSegment(bytes);
  appendCodecCodSegment(bytes);
  appendCodecQcdSegment(bytes);

  if (kind === "coc") {
    appendCodecCocSegment(bytes, false);
    appendCodecCocSegment(bytes, true);
  } else {
    appendCodecQccSegment(bytes, false);
    appendCodecQccSegment(bytes, true);
  }

  pushU16(bytes, 0xffd9); // EOC
  return new Uint8Array(bytes);
}

function appendCodecSizSegment(target: number[]): void {
  pushU16(target, 0xff51); // SIZ
  pushU16(target, 41);
  pushU16(target, 0);
  pushU32(target, 2);
  pushU32(target, 2);
  pushU32(target, 0);
  pushU32(target, 0);
  pushU32(target, 2);
  pushU32(target, 2);
  pushU32(target, 0);
  pushU32(target, 0);
  pushU16(target, 1);
  target.push(7, 1, 1);
}

function appendCodecCodSegment(target: number[]): void {
  pushU16(target, 0xff52); // COD
  pushU16(target, 12);
  target.push(0, 0);
  pushU16(target, 1);
  target.push(0, 0, 2, 2, 0, 1);
}

function appendCodecQcdSegment(target: number[]): void {
  pushU16(target, 0xff5c); // QCD
  pushU16(target, 5);
  target.push(0, 0, 0);
}

function appendCodecCocSegment(target: number[], conflicting: boolean): void {
  pushU16(target, 0xff53); // COC
  pushU16(target, 9);
  target.push(
    0,
    0,
    2,
    conflicting ? 4 : 3,
    4,
    0,
    1,
  );
}

function appendCodecQccSegment(target: number[], conflicting: boolean): void {
  pushU16(target, 0xff5d); // QCC
  pushU16(target, 6);
  target.push(
    0,
    2,
    0x12,
    conflicting ? 0x35 : 0x34,
  );
}

function appendCodecPocSegment(target: number[]): void {
  pushU16(target, 0xff5f); // POC
  pushU16(target, 9);
  target.push(
    0,
    0,
    0x00, 0x01,
    1,
    1,
    0,
  );
}

function appendCodecRgnSegment(target: number[]): void {
  pushU16(target, 0xff5e); // RGN
  pushU16(target, 5);
  target.push(0, 0, 3);
}

function appendCodecMctSegment(target: number[]): void {
  pushU16(target, 0xff74); // MCT
  pushU16(target, 12);
  pushU16(target, 0);
  pushU16(target, 0x0501);
  pushU16(target, 0);
  target.push(0x00, 0x00, 0x00, 0x01);
}

function appendCodecMccSegment(target: number[]): void {
  pushU16(target, 0xff75); // MCC
  pushU16(target, 17);
  pushU16(target, 0);
  target.push(1);
  pushU16(target, 0);
  pushU16(target, 1);
  target.push(0);
  pushU16(target, 1);
  target.push(0);
  pushU16(target, 1);
  target.push(0);
  target.push(0x01, 0x00, 0x00);
}

function appendCodecMcoSegment(target: number[]): void {
  pushU16(target, 0xff77); // MCO
  pushU16(target, 4);
  target.push(1, 1);
}

function appendCodecUnknownMainHeaderSegment(target: number[]): void {
  pushU16(target, 0xff55); // TLM
  pushU16(target, 4);
  target.push(0, 0);
}

function buildConflictingTileRgnCodestream(): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, 0xff4f); // SOC
  bytes.push(...buildMinimalJ2kCodestream().subarray(2, buildMinimalJ2kCodestream().length - 2));

  const header1 = [0xff, 0x5e, 0x00, 0x05, 0x00, 0x00, 0x03];
  const header2 = [0xff, 0x5e, 0x00, 0x05, 0x00, 0x00, 0x04];

  pushU16(bytes, 0xff90); // SOT
  pushU16(bytes, 10);
  pushU16(bytes, 0);
  pushU32(bytes, 14 + header1.length + 1);
  bytes.push(0, 2);
  bytes.push(...header1);
  pushU16(bytes, 0xff93); // SOD
  bytes.push(0x01);

  pushU16(bytes, 0xff90); // SOT
  pushU16(bytes, 10);
  pushU16(bytes, 0);
  pushU32(bytes, 14 + header2.length + 1);
  bytes.push(1, 2);
  bytes.push(...header2);
  pushU16(bytes, 0xff93); // SOD
  bytes.push(0x02);

  pushU16(bytes, 0xffd9); // EOC
  return new Uint8Array(bytes);
}

function buildTilePartSequenceCodestream(
  parts: readonly { tilePartIndex: number; totalTileParts: number; payload: readonly number[] }[],
): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, 0xff4f); // SOC
  bytes.push(...buildMinimalJ2kCodestream().subarray(2, buildMinimalJ2kCodestream().length - 2));

  for (const part of parts) {
    pushU16(bytes, 0xff90); // SOT
    pushU16(bytes, 10);
    pushU16(bytes, 0);
    pushU32(bytes, 14 + part.payload.length);
    bytes.push(part.tilePartIndex & 0xff, part.totalTileParts & 0xff);
    pushU16(bytes, 0xff93); // SOD
    bytes.push(...part.payload);
  }

  pushU16(bytes, 0xffd9); // EOC
  return new Uint8Array(bytes);
}
