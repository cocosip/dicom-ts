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
import { parseJpeg2000Codestream } from "../../src/imaging/codec/jpeg2000/core/index.js";

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
      encodedPixelData.addFrame(new MemoryByteBuffer(buildMinimalJ2kCodestream()));
      encodedPixelData.addFrame(new MemoryByteBuffer(buildMinimalJ2kCodestream()));

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

    DicomPixelData.create(encodedDataset, true).addFrame(new MemoryByteBuffer(buildMinimalJ2kCodestream()));

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
