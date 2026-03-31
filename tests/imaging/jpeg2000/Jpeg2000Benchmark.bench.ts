import { join } from "node:path";
import { describe, bench } from "vitest";
import { DicomFile } from "../../../src/DicomFile.js";
import { DicomTransferSyntax } from "../../../src/core/DicomTransferSyntax.js";
import { DicomPixelData } from "../../../src/imaging/DicomPixelData.js";
import { DicomTranscoder } from "../../../src/imaging/codec/DicomTranscoder.js";
import { DicomJpeg2000LosslessCodec } from "../../../src/imaging/codec/jpeg2000/index.js";
import { forwardMultilevel53WithParity } from "../../../src/imaging/codec/jpeg2000/core/wavelet/index.js";

const ACCEPTANCE_DIR = "source-code/fo-dicom.Codecs/Tests/Acceptance";

let cachedLosslessPixelData: DicomPixelData | null = null;
let cachedRgbDataset: Awaited<ReturnType<typeof DicomFile.open>>["dataset"] | null = null;

async function getLosslessPixelData(): Promise<DicomPixelData> {
  if (!cachedLosslessPixelData) {
    const dataset = await DicomFile.open(join(ACCEPTANCE_DIR, "PM5644-960x540_JPEG2000-Lossless.dcm"));
    cachedLosslessPixelData = DicomPixelData.create(dataset.dataset);
  }
  return cachedLosslessPixelData;
}

async function getRgbDataset(): Promise<Awaited<ReturnType<typeof DicomFile.open>>["dataset"]> {
  if (!cachedRgbDataset) {
    const rgb = await DicomFile.open(join(ACCEPTANCE_DIR, "PM5644-960x540_RGB.dcm"));
    cachedRgbDataset = rgb.dataset;
  }
  return cachedRgbDataset;
}

describe("JPEG2000 decode benchmarks", () => {
  bench(
    "decode .90 lossless 960x540 RGB",
    async () => {
      const pixelData = await getLosslessPixelData();
      new DicomJpeg2000LosslessCodec().decode(pixelData, 0);
    },
    { time: 10000 },
  );
});

describe("JPEG2000 encode benchmarks", () => {
  bench(
    "encode RGB -> .90 lossless 960x540",
    async () => {
      const rgbDataset = await getRgbDataset();
      new DicomTranscoder(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        DicomTransferSyntax.JPEG2000Lossless,
      ).transcode(rgbDataset);
    },
    { time: 10000 },
  );
});

describe("JPEG2000 roundtrip benchmarks", () => {
  bench(
    "roundtrip RGB -> .90 lossless -> RGB 960x540",
    async () => {
      const rgbDataset = await getRgbDataset();
      const encoded = new DicomTranscoder(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        DicomTransferSyntax.JPEG2000Lossless,
      ).transcode(rgbDataset);
      new DicomTranscoder(
        DicomTransferSyntax.JPEG2000Lossless,
        DicomTransferSyntax.ExplicitVRLittleEndian,
      ).transcode(encoded);
    },
    { time: 10000 },
  );
});

describe("JPEG2000 wavelet benchmarks", () => {
  bench(
    "forward 5/3 wavelet 512x512",
    () => {
      const samples = new Int32Array(512 * 512);
      for (let i = 0; i < samples.length; i++) {
        samples[i] = (i * 7) & 0xff;
      }
      forwardMultilevel53WithParity(samples, 512, 512, 5, 0, 0);
    },
    { time: 10000 },
  );

  bench(
    "forward 5/3 wavelet 256x256",
    () => {
      const samples = new Int32Array(256 * 256);
      for (let i = 0; i < samples.length; i++) {
        samples[i] = (i * 7) & 0xff;
      }
      forwardMultilevel53WithParity(samples, 256, 256, 5, 0, 0);
    },
    { time: 10000 },
  );
});