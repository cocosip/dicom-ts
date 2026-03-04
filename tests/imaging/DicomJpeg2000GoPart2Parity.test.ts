import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import { DicomTranscoder } from "../../src/imaging/codec/DicomTranscoder.js";
import { parseJpeg2000Codestream } from "../../src/imaging/codec/jpeg2000/core/index.js";

const FIXTURE_DIR = "tests/imaging/jpeg2000/fixtures";

function sha256(data: Uint8Array): string {
  return createHash("sha256").update(data).digest("hex");
}

describe("DicomJpeg2000GoPart2Parity", () => {
  it("decodes go-generated Part2 lossless codestream (.92) with hash parity", () => {
    const codestream = readFixture("go-part2-lossless.j2k");
    const parsed = parseJpeg2000Codestream(codestream);
    expect(parsed.mct.length).toBeGreaterThan(0);
    expect(parsed.mcc.length).toBeGreaterThan(0);

    const dataset = buildPart2Dataset(DicomTransferSyntax.JPEG2000MCLossless, codestream);
    const decoded = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000MCLossless,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(dataset);

    const frame = DicomPixelData.create(decoded).getFrame(0).data;
    expect(frame.length).toBe(16 * 16 * 3);
    expect(sha256(frame)).toBe("16467ce85c08bf2b9472eaf996585c1eddb739ba87f98c94db6de51d1e1d3366");
  });

  it("decodes go-generated Part2 lossy codestream (.93) with hash parity", () => {
    const codestream = readFixture("go-part2-lossy.j2k");
    const parsed = parseJpeg2000Codestream(codestream);
    expect(parsed.mct.length).toBeGreaterThan(0);
    expect(parsed.mcc.length).toBeGreaterThan(0);

    const dataset = buildPart2Dataset(DicomTransferSyntax.JPEG2000MC, codestream);
    const decoded = new DicomTranscoder(
      DicomTransferSyntax.JPEG2000MC,
      DicomTransferSyntax.ExplicitVRLittleEndian,
    ).transcode(dataset);

    const frame = DicomPixelData.create(decoded).getFrame(0).data;
    expect(frame.length).toBe(16 * 16 * 3);
    expect(sha256(frame)).toBe("56f74db68f68a40464cc152bc35c9ce49151dbb41802acc805e926050af3a1cc");
  });
});

function readFixture(name: string): Uint8Array {
  return new Uint8Array(readFileSync(join(FIXTURE_DIR, name)));
}

function buildPart2Dataset(syntax: DicomTransferSyntax, codestream: Uint8Array): DicomDataset {
  const dataset = new DicomDataset(syntax);
  dataset.addOrUpdateElement(DicomVR.US, Tags.Rows, 16);
  dataset.addOrUpdateElement(DicomVR.US, Tags.Columns, 16);
  dataset.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 8);
  dataset.addOrUpdateElement(DicomVR.US, Tags.BitsStored, 8);
  dataset.addOrUpdateElement(DicomVR.US, Tags.HighBit, 7);
  dataset.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 3);
  dataset.addOrUpdateElement(DicomVR.US, Tags.PixelRepresentation, 0);
  dataset.addOrUpdateElement(DicomVR.US, Tags.PlanarConfiguration, 0);
  dataset.addOrUpdateElement(DicomVR.CS, Tags.PhotometricInterpretation, "RGB");
  dataset.addOrUpdateElement(DicomVR.IS, Tags.NumberOfFrames, "1");

  const pixelData = DicomPixelData.create(dataset, true);
  pixelData.addFrame(new MemoryByteBuffer(codestream));
  return dataset;
}
