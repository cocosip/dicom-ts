import { createHash } from "node:crypto";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DicomFile } from "../../src/DicomFile.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import { DicomTranscoder } from "../../src/imaging/codec/DicomTranscoder.js";

const ACCEPTANCE_DIR = "source-code/fo-dicom.Codecs/Tests/Acceptance";

function sha256(data: Uint8Array): string {
  return createHash("sha256").update(data).digest("hex");
}

describe("DicomJpeg2000GoParity", () => {
  it("matches go-dicom-codec output hash for .91 lossy50 fixture", async () => {
    const compressed = await DicomFile.open(join(ACCEPTANCE_DIR, "PM5644-960x540_JPEG2000-Lossy50.dcm"));
    const decoded = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000Lossy,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(compressed.dataset);

    const frame = DicomPixelData.create(decoded).getFrame(0).data;
    expect(frame.length).toBe(960 * 540 * 3);
    expect(sha256(frame)).toBe("eabdf3f2a4fa593ae7a6293b45c2e69ad3e6abddfeeae04cec55119999caab71");
  });

  it("matches go-dicom-codec output hash for .90 lossless fixture", async () => {
    const compressed = await DicomFile.open(join(ACCEPTANCE_DIR, "PM5644-960x540_JPEG2000-Lossless.dcm"));
    const decoded = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000Lossless,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(compressed.dataset);

    const frame = DicomPixelData.create(decoded).getFrame(0).data;
    expect(frame.length).toBe(960 * 540 * 3);
    expect(sha256(frame)).toBe("1d80804ce3bf58f9b2b2171b071c9426469197ec0b772aaa17b7c44d42994224");
  });

  it("matches go-dicom-codec output hash for .91 lossy fixture", async () => {
    const compressed = await DicomFile.open(join(ACCEPTANCE_DIR, "PM5644-960x540_JPEG2000-Lossy.dcm"));
    const decoded = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000Lossy,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(compressed.dataset);

    const frame = DicomPixelData.create(decoded).getFrame(0).data;
    expect(frame.length).toBe(960 * 540 * 3);
    expect(sha256(frame)).toBe("56dcbb912c849252677e4ab44592fe7ff4b43d3b807bc8052480fe9922b65136");
  });
});
