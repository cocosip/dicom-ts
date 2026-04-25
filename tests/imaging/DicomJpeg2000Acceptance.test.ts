import { createHash } from "node:crypto";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DicomFile } from "../../src/node/DicomFile.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import { DicomTranscoder } from "../../src/imaging/codec/DicomTranscoder.js";

const ACCEPTANCE_DIR = "source-code/fo-dicom.Codecs/Tests/Acceptance";
const JPEG2000_LOSSLESS_FILE = "PM5644-960x540_JPEG2000-Lossless.dcm";
const JPEG2000_LOSSY_FILE = "PM5644-960x540_JPEG2000-Lossy.dcm";
const JPEG2000_LOSSY50_FILE = "PM5644-960x540_JPEG2000-Lossy50.dcm";
const RGB_FILE = "PM5644-960x540_RGB.dcm";

const EXPECTED_LOSSLESS_HASH = "1d80804ce3bf58f9b2b2171b071c9426469197ec0b772aaa17b7c44d42994224";
const EXPECTED_LOSSY_HASH = "56dcbb912c849252677e4ab44592fe7ff4b43d3b807bc8052480fe9922b65136";
const EXPECTED_LOSSY50_HASH = "eabdf3f2a4fa593ae7a6293b45c2e69ad3e6abddfeeae04cec55119999caab71";

function sha256(data: Uint8Array): string {
  return createHash("sha256").update(data).digest("hex");
}

describe("DicomJpeg2000Acceptance", () => {
  it("matches Go decoder hash for .90 lossless acceptance fixture", async () => {
    const compressed = await DicomFile.open(join(ACCEPTANCE_DIR, JPEG2000_LOSSLESS_FILE));
    const decoded = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000Lossless,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(compressed.dataset);

    const frame = DicomPixelData.create(decoded).getFrame(0).data;
    expect(frame.length).toBe(960 * 540 * 3);
    expect(sha256(frame)).toBe(EXPECTED_LOSSLESS_HASH);
  });

  it("matches Go decoder hash for .91 lossy acceptance fixture", async () => {
    const compressed = await DicomFile.open(join(ACCEPTANCE_DIR, JPEG2000_LOSSY_FILE));
    const decoded = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000Lossy,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(compressed.dataset);

    const frame = DicomPixelData.create(decoded).getFrame(0).data;
    expect(frame.length).toBe(960 * 540 * 3);
    expect(sha256(frame)).toBe(EXPECTED_LOSSY_HASH);
  });

  it("matches Go decoder hash for .91 lossy50 acceptance fixture", async () => {
    const compressed = await DicomFile.open(join(ACCEPTANCE_DIR, JPEG2000_LOSSY50_FILE));
    const decoded = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000Lossy,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(compressed.dataset);

    const frame = DicomPixelData.create(decoded).getFrame(0).data;
    expect(frame.length).toBe(960 * 540 * 3);
    expect(sha256(frame)).toBe(EXPECTED_LOSSY50_HASH);
  });

  it("roundtrips RGB acceptance fixture through .90 lossless encode/decode", async () => {
    const source = await DicomFile.open(join(ACCEPTANCE_DIR, RGB_FILE));
    const sourceHash = sha256(DicomPixelData.create(source.dataset).getFrame(0).data);

    const encoded = new DicomTranscoder(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      DicomTransferSyntax.JPEG2000Lossless,
    ).transcode(source.dataset);

    const restored = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000Lossless,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(encoded);

    const restoredFrame = DicomPixelData.create(restored).getFrame(0).data;
    expect(sha256(restoredFrame)).toBe(sourceHash);
  });
});

describe("DicomJpeg2000AcceptanceGap - Known Fixture Inconsistency", () => {
  it.fails("decode matches RGB reference directly (fixture files are inconsistent)", async () => {
    const compressed = await DicomFile.open(join(ACCEPTANCE_DIR, JPEG2000_LOSSLESS_FILE));
    const decoded = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000Lossless,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(compressed.dataset);

    const reference = await DicomFile.open(join(ACCEPTANCE_DIR, RGB_FILE));
    const expected = DicomPixelData.create(reference.dataset).getFrame(0).data;
    const actual = DicomPixelData.create(decoded).getFrame(0).data;

    expect([...actual]).toEqual([...expected]);
  });
});
