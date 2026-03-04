import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DicomFile } from "../../src/DicomFile.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import { DicomTranscoder } from "../../src/imaging/codec/DicomTranscoder.js";

const ACCEPTANCE_DIR = "source-code/fo-dicom.Codecs/Tests/Acceptance";
const JPEG2000_LOSSLESS_FILE = "PM5644-960x540_JPEG2000-Lossless.dcm";
const JPEG2000_LOSSY_FILE = "PM5644-960x540_JPEG2000-Lossy.dcm";
const RGB_FILE = "PM5644-960x540_RGB.dcm";

describe("DicomJpeg2000AlignmentBaseline", () => {
  it.fails("decodes JPEG2000 lossless acceptance fixture to reference RGB bytes (red baseline)", async () => {
    const compressed = await DicomFile.open(join(ACCEPTANCE_DIR, JPEG2000_LOSSLESS_FILE));
    const reference = await DicomFile.open(join(ACCEPTANCE_DIR, RGB_FILE));

    const decoded = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000Lossless,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(compressed.dataset);

    const actual = DicomPixelData.create(decoded).getFrame(0).data;
    const expected = DicomPixelData.create(reference.dataset).getFrame(0).data;
    const stats = computePixelDiffStats(actual, expected);
    expect(stats.mismatchPixels).toBe(0);
    expect(stats.mae).toBe(0);
    expect(stats.maxAbsDiff).toBe(0);
    expect([...actual]).toEqual([...expected]);
  });

  it.fails("decodes JPEG2000 lossy acceptance fixture within RGB quality threshold (red baseline)", async () => {
    const compressed = await DicomFile.open(join(ACCEPTANCE_DIR, JPEG2000_LOSSY_FILE));
    const reference = await DicomFile.open(join(ACCEPTANCE_DIR, RGB_FILE));

    const decoded = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000Lossy,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(compressed.dataset);

    const actual = DicomPixelData.create(decoded).getFrame(0).data;
    const expected = DicomPixelData.create(reference.dataset).getFrame(0).data;
    const stats = computePixelDiffStats(actual, expected);

    expect(actual.length).toBe(expected.length);
    expect(stats.mae).toBeLessThanOrEqual(6);
    expect(stats.maxAbsDiff).toBeLessThanOrEqual(48);
    expect(stats.psnr).toBeGreaterThanOrEqual(32);
  });

  it("encodes RGB acceptance fixture into JPEG2000 Lossless and decodes back", async () => {
    const source = await DicomFile.open(join(ACCEPTANCE_DIR, RGB_FILE));

    const encoded = new DicomTranscoder(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      DicomTransferSyntax.JPEG2000Lossless,
    ).transcode(source.dataset);

    const restored = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000Lossless,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(encoded);

    const actual = DicomPixelData.create(restored).getFrame(0).data;
    const expected = DicomPixelData.create(source.dataset).getFrame(0).data;
    expect([...actual]).toEqual([...expected]);
  });
});

interface PixelDiffStats {
  mismatchPixels: number;
  mae: number;
  maxAbsDiff: number;
  rmse: number;
  psnr: number;
}

function computePixelDiffStats(actual: Uint8Array, expected: Uint8Array): PixelDiffStats {
  const length = Math.min(actual.length, expected.length);
  if (length === 0) {
    return {
      mismatchPixels: 0,
      mae: 0,
      maxAbsDiff: 0,
      rmse: 0,
      psnr: Number.POSITIVE_INFINITY,
    };
  }

  let mismatchPixels = 0;
  let sumAbs = 0;
  let sumSquared = 0;
  let maxAbsDiff = 0;

  for (let i = 0; i < length; i++) {
    const diff = Math.abs((actual[i] ?? 0) - (expected[i] ?? 0));
    if (diff !== 0) {
      mismatchPixels++;
    }
    sumAbs += diff;
    sumSquared += diff * diff;
    if (diff > maxAbsDiff) {
      maxAbsDiff = diff;
    }
  }

  const mae = sumAbs / length;
  const rmse = Math.sqrt(sumSquared / length);
  const psnr = rmse === 0 ? Number.POSITIVE_INFINITY : (20 * Math.log10(255 / rmse));

  return {
    mismatchPixels,
    mae,
    maxAbsDiff,
    rmse,
    psnr,
  };
}
