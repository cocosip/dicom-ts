import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DicomFile } from "../../src/DicomFile.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import { DicomTranscoder } from "../../src/imaging/codec/DicomTranscoder.js";
import { decodeJpegLs } from "../../src/imaging/codec/jpeg-ls/common/JpegLsCore.js";

const ACCEPTANCE_DIR = "source-code/fo-dicom.Codecs/Tests/Acceptance";
const JPEG_LS_LOSSLESS_FILE = "PM5644-960x540_JPEG-LS_Lossless.dcm";
const RGB_FILE = "PM5644-960x540_RGB.dcm";

describe("DicomJpegLsAcceptance", () => {
  it("decodes the JPEG-LS lossless acceptance fixture", async () => {
    const compressed = await DicomFile.open(join(ACCEPTANCE_DIR, JPEG_LS_LOSSLESS_FILE));
    const reference = await DicomFile.open(join(ACCEPTANCE_DIR, RGB_FILE));
    const compressedFrame = DicomPixelData.create(compressed.dataset).getFrame(0).data;
    const coreDecoded = decodeJpegLs(compressedFrame);
    const referencePixelData = DicomPixelData.create(reference.dataset);

    const decoded = new DicomTranscoder(
      DicomTransferSyntax.JPEGLSLossless,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(compressed.dataset);

    const actual = DicomPixelData.create(decoded).getFrame(0).data;
    const expected = referencePixelData.getFrame(0).data;

    expect(coreDecoded.interleaveMode).toBe(1);
    expect(coreDecoded.width).toBe(referencePixelData.columns);
    expect(coreDecoded.height).toBe(referencePixelData.rows);
    expect(coreDecoded.components).toBe(referencePixelData.samplesPerPixel);
    expect(coreDecoded.pixelData.length).toBe(expected.length);
    expect(actual.length).toBe(expected.length);
  }, 20000);
});
