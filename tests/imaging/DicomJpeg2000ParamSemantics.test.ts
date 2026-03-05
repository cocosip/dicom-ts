import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomOtherByte, DicomOtherWord } from "../../src/dataset/DicomElement.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import { PhotometricInterpretation } from "../../src/imaging/PhotometricInterpretation.js";
import { DicomTranscoder } from "../../src/imaging/codec/DicomTranscoder.js";
import { DicomJpeg2000Params } from "../../src/imaging/codec/jpeg2000/DicomJpeg2000Params.js";
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
  pixelRepresentation = 0,
): DicomDataset {
  const ds = new DicomDataset(syntax);
  ds.addOrUpdateElement(DicomVR.US, Tags.Rows, rows);
  ds.addOrUpdateElement(DicomVR.US, Tags.Columns, columns);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, bitsAllocated);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, bitsStored);
  ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, bitsStored - 1);
  ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, samplesPerPixel);
  ds.addOrUpdateElement(DicomVR.US, Tags.PixelRepresentation, pixelRepresentation);
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

describe("DicomJpeg2000ParamSemantics", () => {
  it("enforces allowMct/updatePhotometricInterpretation semantics table on .90/.91", () => {
    const rgb = new Uint8Array([
      10, 30, 50,
      20, 40, 60,
      70, 90, 110,
      80, 100, 120,
    ]);

    const table = [
      {
        name: ".90 allowMct=true updatePI=true",
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        sourcePi: "RGB",
        params: Object.assign(DicomJpeg2000Params.createLosslessDefaults(), {
          allowMct: true,
          updatePhotometricInterpretation: true,
          numLevels: 1,
          numLayers: 1,
        }),
        expectedPi: PhotometricInterpretation.YBR_RCT,
        expectedMctFlag: 1,
      },
      {
        name: ".90 allowMct=false updatePI=true",
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        sourcePi: "RGB",
        params: Object.assign(DicomJpeg2000Params.createLosslessDefaults(), {
          allowMct: false,
          updatePhotometricInterpretation: true,
          numLevels: 1,
          numLayers: 1,
        }),
        expectedPi: PhotometricInterpretation.RGB,
        expectedMctFlag: 0,
      },
      {
        name: ".90 allowMct=true updatePI=false",
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        sourcePi: "RGB",
        params: Object.assign(DicomJpeg2000Params.createLosslessDefaults(), {
          allowMct: true,
          updatePhotometricInterpretation: false,
          numLevels: 1,
          numLayers: 1,
        }),
        expectedPi: PhotometricInterpretation.RGB,
        expectedMctFlag: 1,
      },
      {
        name: ".91 allowMct=true updatePI=true",
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        sourcePi: "RGB",
        params: Object.assign(new DicomJpeg2000Params(), {
          irreversible: true,
          allowMct: true,
          updatePhotometricInterpretation: true,
          numLevels: 1,
          numLayers: 1,
        }),
        expectedPi: PhotometricInterpretation.YBR_ICT,
        expectedMctFlag: 1,
      },
      {
        name: ".91 allowMct=true updatePI=false",
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        sourcePi: "RGB",
        params: Object.assign(new DicomJpeg2000Params(), {
          irreversible: true,
          allowMct: true,
          updatePhotometricInterpretation: false,
          numLevels: 1,
          numLayers: 1,
        }),
        expectedPi: PhotometricInterpretation.RGB,
        expectedMctFlag: 1,
      },
      {
        name: ".91 allowMct=false updatePI=true",
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        sourcePi: "RGB",
        params: Object.assign(new DicomJpeg2000Params(), {
          irreversible: true,
          allowMct: false,
          updatePhotometricInterpretation: true,
          numLevels: 1,
          numLayers: 1,
        }),
        expectedPi: PhotometricInterpretation.RGB,
        expectedMctFlag: 0,
      },
      {
        name: ".91 mono source should stay MONOCHROME2",
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        sourcePi: "MONOCHROME2",
        params: Object.assign(new DicomJpeg2000Params(), {
          irreversible: true,
          allowMct: true,
          updatePhotometricInterpretation: true,
          numLevels: 1,
          numLayers: 1,
        }),
        expectedPi: PhotometricInterpretation.MONOCHROME2,
        expectedMctFlag: 0,
      },
    ] as const;

    for (const row of table) {
      const source = row.sourcePi === "MONOCHROME2"
        ? buildDataset(
          DicomTransferSyntax.ExplicitVRLittleEndian,
          8,
          8,
          4,
          4,
          1,
          row.sourcePi,
          new Uint8Array([
            10, 20, 30, 40,
            50, 60, 70, 80,
            90, 100, 110, 120,
            130, 140, 150, 160,
          ]),
        )
        : buildDataset(
          DicomTransferSyntax.ExplicitVRLittleEndian,
          8,
          8,
          2,
          2,
          3,
          row.sourcePi,
          rgb,
        );

      const encoded = new DicomTranscoder(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        row.syntax,
        null,
        row.params,
      ).transcode(source);

      const encodedPixelData = DicomPixelData.create(encoded);
      expect(encodedPixelData.photometricInterpretation, `${row.name} photometric`).toBe(row.expectedPi);
      expect(encodedPixelData.planarConfiguration, `${row.name} planar`).toBe(0);

      const codestream = encodedPixelData.getFrame(0).data;
      const parsed = parseJpeg2000Codestream(codestream);
      expect(parsed.cod?.multipleComponentTransform ?? 0, `${row.name} cod MCT`).toBe(row.expectedMctFlag);
    }
  });

  it("keeps encodeSignedPixelValuesAsUnsigned behavior stable (compat/no-op)", () => {
    const signedValues = Int16Array.from([-1024, -300, -1, 0, 1, 511, 777, -512]);
    const words = new Uint16Array(signedValues.length);
    for (let i = 0; i < signedValues.length; i++) {
      words[i] = signedValues[i]! & 0xffff;
    }

    const source = buildDataset(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      16,
      12,
      4,
      2,
      1,
      "MONOCHROME2",
      words,
      1,
    );
    const paramsOff = DicomJpeg2000Params.createLosslessDefaults();
    paramsOff.numLevels = 1;
    paramsOff.encodeSignedPixelValuesAsUnsigned = false;

    const paramsOn = DicomJpeg2000Params.createLosslessDefaults();
    paramsOn.numLevels = 1;
    paramsOn.encodeSignedPixelValuesAsUnsigned = true;

    const encodedOff = new DicomTranscoder(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      DicomTransferSyntax.JPEG2000Lossless,
      null,
      paramsOff,
    ).transcode(source);
    const encodedOn = new DicomTranscoder(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      DicomTransferSyntax.JPEG2000Lossless,
      null,
      paramsOn,
    ).transcode(source);

    const frameOff = DicomPixelData.create(encodedOff).getFrame(0).data;
    const frameOn = DicomPixelData.create(encodedOn).getFrame(0).data;
    expect(sha256(frameOn)).toBe(sha256(frameOff));

    const decodedOff = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000Lossless,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(encodedOff);
    const decodedOn = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000Lossless,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(encodedOn);

    const decodedFrameOff = DicomPixelData.create(decodedOff).getFrame(0).data;
    const decodedFrameOn = DicomPixelData.create(decodedOn).getFrame(0).data;
    expect(sha256(decodedFrameOn)).toBe(sha256(decodedFrameOff));
    expect(decodedFrameOn.length).toBe(decodedFrameOff.length);
  });
});
