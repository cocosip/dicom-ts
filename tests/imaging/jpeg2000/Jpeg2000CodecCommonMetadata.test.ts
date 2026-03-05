import { describe, expect, it } from "vitest";
import { DicomTransferSyntax } from "../../../src/core/DicomTransferSyntax.js";
import * as Tags from "../../../src/core/DicomTag.generated.js";
import { DicomVR } from "../../../src/core/DicomVR.js";
import { DicomDataset } from "../../../src/dataset/DicomDataset.js";
import { DicomPixelData } from "../../../src/imaging/DicomPixelData.js";
import { PhotometricInterpretation } from "../../../src/imaging/PhotometricInterpretation.js";
import { PlanarConfiguration } from "../../../src/imaging/PlanarConfiguration.js";
import { DicomJpeg2000Params } from "../../../src/imaging/codec/jpeg2000/DicomJpeg2000Params.js";
import {
  applyJpeg2000DecodePixelMetadata,
  applyJpeg2000EncodePixelMetadata,
} from "../../../src/imaging/codec/jpeg2000/common/Jpeg2000CodecCommon.js";

function createPixelData(
  syntax: DicomTransferSyntax,
  samplesPerPixel: number,
  photometricInterpretation: string,
): DicomPixelData {
  const ds = new DicomDataset(syntax);
  ds.addOrUpdateElement(DicomVR.US, Tags.Rows, 2);
  ds.addOrUpdateElement(DicomVR.US, Tags.Columns, 2);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 8);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, 8);
  ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, 7);
  ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, samplesPerPixel);
  ds.addOrUpdateElement(DicomVR.US, Tags.PixelRepresentation, 0);
  ds.addOrUpdateElement(DicomVR.CS, Tags.PhotometricInterpretation, photometricInterpretation);
  ds.addOrUpdateElement(DicomVR.US, Tags.PlanarConfiguration, PlanarConfiguration.Planar);
  ds.addOrUpdateElement(DicomVR.IS, Tags.NumberOfFrames, "0");
  return DicomPixelData.create(ds, true);
}

describe("Jpeg2000CodecCommon metadata", () => {
  it("applies encode metadata semantics across .90/.91/.92/.93", () => {
    const table = [
      {
        name: ".90 RGB -> YBR_RCT",
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        params: Object.assign(DicomJpeg2000Params.createLosslessDefaults(), {
          allowMct: true,
          updatePhotometricInterpretation: true,
          irreversible: false,
        }),
        sourcePi: "RGB",
        expectedPi: PhotometricInterpretation.YBR_RCT,
      },
      {
        name: ".91 RGB -> YBR_ICT",
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        params: Object.assign(new DicomJpeg2000Params(), {
          allowMct: true,
          updatePhotometricInterpretation: true,
          irreversible: true,
        }),
        sourcePi: "RGB",
        expectedPi: PhotometricInterpretation.YBR_ICT,
      },
      {
        name: ".92 RGB -> YBR_RCT",
        syntax: DicomTransferSyntax.JPEG2000MCLossless,
        params: Object.assign(DicomJpeg2000Params.createLosslessDefaults(), {
          allowMct: true,
          updatePhotometricInterpretation: true,
          irreversible: false,
        }),
        sourcePi: "RGB",
        expectedPi: PhotometricInterpretation.YBR_RCT,
      },
      {
        name: ".93 RGB -> YBR_ICT",
        syntax: DicomTransferSyntax.JPEG2000MC,
        params: Object.assign(new DicomJpeg2000Params(), {
          allowMct: true,
          updatePhotometricInterpretation: true,
          irreversible: true,
        }),
        sourcePi: "RGB",
        expectedPi: PhotometricInterpretation.YBR_ICT,
      },
      {
        name: "allowMct=false keeps RGB",
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        params: Object.assign(DicomJpeg2000Params.createLosslessDefaults(), {
          allowMct: false,
          updatePhotometricInterpretation: true,
          irreversible: false,
        }),
        sourcePi: "RGB",
        expectedPi: PhotometricInterpretation.RGB,
      },
      {
        name: "updatePI=false keeps RGB",
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        params: Object.assign(new DicomJpeg2000Params(), {
          allowMct: true,
          updatePhotometricInterpretation: false,
          irreversible: true,
        }),
        sourcePi: "RGB",
        expectedPi: PhotometricInterpretation.RGB,
      },
      {
        name: "non-color PI keeps MONOCHROME2",
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        params: Object.assign(new DicomJpeg2000Params(), {
          allowMct: true,
          updatePhotometricInterpretation: true,
          irreversible: true,
        }),
        sourcePi: "MONOCHROME2",
        expectedPi: PhotometricInterpretation.MONOCHROME2,
      },
    ] as const;

    for (const row of table) {
      const samplesPerPixel = row.sourcePi === "MONOCHROME2" ? 1 : 3;
      const pixelData = createPixelData(row.syntax, samplesPerPixel, row.sourcePi);
      applyJpeg2000EncodePixelMetadata(pixelData, row.syntax, row.params);
      if (samplesPerPixel > 1) {
        expect(pixelData.planarConfiguration, `${row.name} planar`).toBe(PlanarConfiguration.Interleaved);
      }
      expect(pixelData.photometricInterpretation, `${row.name} PI`).toBe(row.expectedPi);
    }
  });

  it("applies decode metadata normalization for YBR variants", () => {
    const ybrPis = [
      "YBR_ICT",
      "YBR_RCT",
      "YBR_FULL",
      "YBR_FULL_422",
      "YBR_PARTIAL_422",
      "YBR_PARTIAL_420",
    ];

    for (const pi of ybrPis) {
      const pixelData = createPixelData(DicomTransferSyntax.JPEG2000Lossy, 3, pi);
      applyJpeg2000DecodePixelMetadata(pixelData);
      expect(pixelData.planarConfiguration, `${pi} planar`).toBe(PlanarConfiguration.Interleaved);
      expect(pixelData.photometricInterpretation, `${pi} PI`).toBe(PhotometricInterpretation.RGB);
    }

    const mono = createPixelData(DicomTransferSyntax.JPEG2000Lossless, 1, "MONOCHROME2");
    applyJpeg2000DecodePixelMetadata(mono);
    expect(mono.photometricInterpretation).toBe(PhotometricInterpretation.MONOCHROME2);
  });
});
