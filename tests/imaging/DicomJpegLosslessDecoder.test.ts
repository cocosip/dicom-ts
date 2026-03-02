import { join } from "node:path";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { DicomFile } from "../../src/DicomFile.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { cloneDataset } from "../../src/dataset/DicomDatasetExtensions.js";
import { DicomOtherByteFragment } from "../../src/dataset/DicomFragmentSequence.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import {
  DicomJpegProcess14Codec,
  DicomJpegProcess14SV1Codec,
} from "../../src/imaging/codec/jpeg/index.js";
import { DicomTranscoder } from "../../src/imaging/codec/DicomTranscoder.js";
import { TranscoderManager } from "../../src/imaging/codec/TranscoderManager.js";

const ACCEPTANCE_DIR = "source-code/fo-dicom.Codecs/Tests/Acceptance";
const JPEG_LOSSLESS_RGB_FILE = "PM5644-960x540_JPEG-Lossless_RGB.dcm";
const RGB_FILE = "PM5644-960x540_RGB.dcm";
const JPEG_LOSSLESS_RGB_SHA256 = "71dcb969ff651919dd660128675415ca219a450a40325706cad491b9f643c61f";

describe("DicomJpegLosslessDecoder", () => {
  it("decodes JPEG Lossless SV1 frame to fo-dicom-compatible pixel bytes", async () => {
    const compressed = await DicomFile.open(join(ACCEPTANCE_DIR, JPEG_LOSSLESS_RGB_FILE));
    const reference = await DicomFile.open(join(ACCEPTANCE_DIR, RGB_FILE));
    const codec = new DicomJpegProcess14SV1Codec();
    TranscoderManager.register(codec);

    try {
      const transcoder = new DicomTranscoder(
        DicomTransferSyntax.JPEGProcess14SV1,
        DicomTransferSyntax.ExplicitVRLittleEndian,
      );
      const decoded = transcoder.transcode(compressed.dataset);
      const actual = DicomPixelData.create(decoded).getFrame(0).data;
      const expected = DicomPixelData.create(reference.dataset).getFrame(0).data;
      expect(actual.length).toBe(expected.length);
      expect(sha256(actual)).toBe(JPEG_LOSSLESS_RGB_SHA256);
    } finally {
      TranscoderManager.unregister(DicomTransferSyntax.JPEGProcess14SV1);
    }
  });

  it("allows SV1 codestream when decoder is configured as Process 14", async () => {
    const compressed = await DicomFile.open(join(ACCEPTANCE_DIR, JPEG_LOSSLESS_RGB_FILE));
    const reference = await DicomFile.open(join(ACCEPTANCE_DIR, RGB_FILE));
    const codec = new DicomJpegProcess14Codec();
    const decoded = codec.decode(DicomPixelData.create(compressed.dataset), 0).data;
    const expected = DicomPixelData.create(reference.dataset).getFrame(0).data;
    expect(decoded.length).toBe(expected.length);
    expect(sha256(decoded)).toBe(JPEG_LOSSLESS_RGB_SHA256);
  });

  it("enforces predictor selection 1 for SV1", async () => {
    const compressed = await DicomFile.open(join(ACCEPTANCE_DIR, JPEG_LOSSLESS_RGB_FILE));
    const source = compressed.dataset;
    const mutated = cloneDataset(source);
    const frame = DicomPixelData.create(source).getFrame(0).data;
    const altered = patchSelectionValue(frame, 3);
    const seq = new DicomOtherByteFragment(Tags.PixelData);
    seq.addRaw(new MemoryByteBuffer(new Uint8Array(0)));
    seq.addRaw(new MemoryByteBuffer(altered));
    mutated.addOrUpdate(seq);

    const codec = new DicomJpegProcess14SV1Codec();
    expect(() => codec.decode(DicomPixelData.create(mutated), 0)).toThrow(/SV1 requires predictor selection value 1/);
  });
});

function patchSelectionValue(frame: Uint8Array, selection: number): Uint8Array {
  const out = frame.slice();
  for (let i = 0; i + 5 < out.length; i++) {
    if (out[i] !== 0xff || out[i + 1] !== 0xda) continue;
    const length = (out[i + 2]! << 8) | out[i + 3]!;
    const components = out[i + 4]!;
    const selectionOffset = i + 5 + (components * 2);
    const segmentEnd = i + 2 + length;
    if (selectionOffset >= segmentEnd || selectionOffset >= out.length) {
      throw new Error("Invalid JPEG SOS header while patching predictor selection");
    }
    out[selectionOffset] = selection & 0xff;
    return out;
  }
  throw new Error("JPEG SOS marker not found");
}

function sha256(data: Uint8Array): string {
  return createHash("sha256").update(data).digest("hex");
}
