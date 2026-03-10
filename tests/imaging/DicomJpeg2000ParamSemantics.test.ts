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
  it("enforces allowMct/updatePhotometricInterpretation semantics table on .90/.91/.92/.93", () => {
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
        name: ".92 allowMct=true updatePI=true",
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
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
        name: ".92 allowMct=false updatePI=true",
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
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
        name: ".93 allowMct=true updatePI=true",
        syntax: DicomTransferSyntax.JPEG2000MC,
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
        name: ".93 allowMct=false updatePI=true",
        syntax: DicomTransferSyntax.JPEG2000MC,
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
      {
        name: ".93 mono source should stay MONOCHROME2",
        syntax: DicomTransferSyntax.JPEG2000MC,
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

  it("normalizes decode PI/planar semantics on end-to-end transcode for .90/.91/.92/.93", () => {
    const rgb = new Uint8Array([
      10, 30, 50,
      20, 40, 60,
      70, 90, 110,
      80, 100, 120,
    ]);

    const source = buildDataset(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      8,
      8,
      2,
      2,
      3,
      "RGB",
      rgb,
    );

    const table = [
      {
        name: ".90",
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        params: Object.assign(DicomJpeg2000Params.createLosslessDefaults(), {
          allowMct: true,
          updatePhotometricInterpretation: true,
          numLevels: 1,
          numLayers: 1,
        }),
        expectedEncodedPi: PhotometricInterpretation.YBR_RCT,
      },
      {
        name: ".91",
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        params: Object.assign(new DicomJpeg2000Params(), {
          irreversible: true,
          allowMct: true,
          updatePhotometricInterpretation: true,
          numLevels: 1,
          numLayers: 1,
        }),
        expectedEncodedPi: PhotometricInterpretation.YBR_ICT,
      },
      {
        name: ".92",
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        params: Object.assign(DicomJpeg2000Params.createLosslessDefaults(), {
          allowMct: true,
          updatePhotometricInterpretation: true,
          numLevels: 1,
          numLayers: 1,
        }),
        expectedEncodedPi: PhotometricInterpretation.YBR_RCT,
      },
      {
        name: ".93",
        syntax: DicomTransferSyntax.JPEG2000MC,
        params: Object.assign(new DicomJpeg2000Params(), {
          irreversible: true,
          allowMct: true,
          updatePhotometricInterpretation: true,
          numLevels: 1,
          numLayers: 1,
        }),
        expectedEncodedPi: PhotometricInterpretation.YBR_ICT,
      },
    ] as const;

    for (const row of table) {
      const encoded = new DicomTranscoder(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        row.syntax,
        null,
        row.params,
      ).transcode(source);
      const encodedPixelData = DicomPixelData.create(encoded);
      expect(encodedPixelData.photometricInterpretation, `${row.name} encoded PI`).toBe(row.expectedEncodedPi);
      expect(encodedPixelData.planarConfiguration, `${row.name} encoded planar`).toBe(0);

      const decoded = new DicomTranscoder(
        row.syntax,
        DicomTransferSyntax.ExplicitVRLittleEndian,
      ).transcode(encoded);
      const decodedPixelData = DicomPixelData.create(decoded);
      expect(decodedPixelData.photometricInterpretation, `${row.name} decoded PI`).toBe(PhotometricInterpretation.RGB);
      expect(decodedPixelData.planarConfiguration, `${row.name} decoded planar`).toBe(0);
    }
  });

  it("appends JPEG2000 lossy metadata for .91/.93 on real encode path", () => {
    const rgb = new Uint8Array([
      10, 30, 50,
      20, 40, 60,
      70, 90, 110,
      80, 100, 120,
    ]);

    const table = [
      {
        name: ".91",
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        expectedMethod: "ISO_15444_1",
      },
      {
        name: ".93",
        syntax: DicomTransferSyntax.JPEG2000MC,
        expectedMethod: "ISO_15444_2",
      },
    ] as const;

    for (const row of table) {
      const source = buildDataset(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        8,
        8,
        2,
        2,
        3,
        "RGB",
        rgb,
      );
      source.addOrUpdateElement(DicomVR.CS, Tags.LossyImageCompressionMethod, "EXISTING_METHOD");
      source.addOrUpdateElement(DicomVR.DS, Tags.LossyImageCompressionRatio, "1.500");

      const params = new DicomJpeg2000Params();
      params.irreversible = true;
      params.numLevels = 1;
      params.numLayers = 1;

      const encoded = new DicomTranscoder(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        row.syntax,
        null,
        params,
      ).transcode(source);

      expect(encoded.getSingleValue<string>(Tags.LossyImageCompression), `${row.name} 2110`).toBe("01");
      expect(encoded.getValues<string>(Tags.LossyImageCompressionMethod), `${row.name} 2112`).toEqual([
        "EXISTING_METHOD",
        row.expectedMethod,
      ]);

      const ratios = encoded.getValues<string>(Tags.LossyImageCompressionRatio);
      expect(ratios.length, `${row.name} 2114 length`).toBe(2);
      expect(ratios[0], `${row.name} 2114 keep existing`).toBe("1.500");
      expect(Number.isFinite(Number(ratios[1])) && Number(ratios[1]) > 0, `${row.name} 2114 appended numeric`).toBe(true);
    }
  });

  it("aligns .92/.93 fallback behavior when mctBindings are not provided", () => {
    const rgb = new Uint8Array([
      10, 30, 50,
      20, 40, 60,
      70, 90, 110,
      80, 100, 120,
    ]);

    const source = buildDataset(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      8,
      8,
      2,
      2,
      3,
      "RGB",
      rgb,
    );

    const syntaxes = [
      DicomTransferSyntax.JPEG2000MCLossless,
      DicomTransferSyntax.JPEG2000MC,
    ];

    const scenarios = [
      {
        name: "no mctBindings + no fallback matrix",
        configure: (_params: DicomJpeg2000Params) => {
          // no-op
        },
        expectPart2Markers: false,
      },
      {
        name: "no mctBindings + mctMatrix/mctOffsets fallback",
        configure: (params: DicomJpeg2000Params) => {
          params.mctMatrix = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
          ];
          params.mctOffsets = [5, -3, 2];
        },
        expectPart2Markers: true,
      },
      {
        name: "no mctBindings + invalid fallback matrix dimensions",
        configure: (params: DicomJpeg2000Params) => {
          params.mctMatrix = [
            [1, 0],
            [0, 1],
          ];
          params.mctOffsets = [5, -3, 2];
        },
        expectPart2Markers: false,
      },
    ] as const;

    for (const syntax of syntaxes) {
      for (const scenario of scenarios) {
        const params = syntax === DicomTransferSyntax.JPEG2000MCLossless
          ? DicomJpeg2000Params.createLosslessDefaults()
          : new DicomJpeg2000Params();
        params.allowMct = true;
        params.numLevels = 1;
        params.numLayers = 1;
        params.mctBindings = [];
        scenario.configure(params);

        const encoded = new DicomTranscoder(
          DicomTransferSyntax.ExplicitVRLittleEndian,
          syntax,
          null,
          params,
        ).transcode(source);

        const codestream = DicomPixelData.create(encoded).getFrame(0).data;
        const parsed = parseJpeg2000Codestream(codestream);
        expect(parsed.cod?.multipleComponentTransform ?? 0, `${syntax.uid.uid} ${scenario.name} COD MCT`).toBe(1);

        if (scenario.expectPart2Markers) {
          expect(parsed.mct.length, `${syntax.uid.uid} ${scenario.name} MCT`).toBeGreaterThan(0);
          expect(parsed.mcc.length, `${syntax.uid.uid} ${scenario.name} MCC`).toBeGreaterThan(0);
          expect(parsed.mco.length, `${syntax.uid.uid} ${scenario.name} MCO`).toBeGreaterThan(0);
        } else {
          expect(parsed.mct.length, `${syntax.uid.uid} ${scenario.name} MCT`).toBe(0);
          expect(parsed.mcc.length, `${syntax.uid.uid} ${scenario.name} MCC`).toBe(0);
          expect(parsed.mco.length, `${syntax.uid.uid} ${scenario.name} MCO`).toBe(0);
        }
      }
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
