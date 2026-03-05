import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { DicomFile } from "../../src/DicomFile.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import { DicomTranscoder } from "../../src/imaging/codec/DicomTranscoder.js";
import { DicomJpeg2000Params } from "../../src/imaging/codec/jpeg2000/DicomJpeg2000Params.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";

const ACCEPTANCE_DIR = "source-code/fo-dicom.Codecs/Tests/Acceptance";
const GO_CODEC_DIR = "source-code/go-dicom-codec";
const GO_DECODER_TOOL = "./tools/decode_codestream";

const hasGo = spawnSync("go", ["version"], { encoding: "utf8" }).status === 0;
const describeGo = hasGo ? describe : describe.skip;

interface GoDecodeResult {
  width: number;
  height: number;
  components: number;
  bitDepth: number;
  isSigned: boolean;
  pixelBytes: number;
  sha256: string;
}

function sha256(data: Uint8Array): string {
  return createHash("sha256").update(data).digest("hex");
}

function meanAbsoluteError(a: Uint8Array, b: Uint8Array): number {
  const length = Math.min(a.length, b.length);
  if (length === 0) {
    return 0;
  }

  let total = 0;
  for (let i = 0; i < length; i++) {
    total += Math.abs((a[i] ?? 0) - (b[i] ?? 0));
  }
  return total / length;
}

function decodeCodestreamWithGo(codestream: Uint8Array): { metadata: GoDecodeResult; pixelData: Uint8Array } {
  const tempDir = mkdtempSync(join(tmpdir(), "dicom-ts-j2k-go-"));
  const inputPath = join(tempDir, "encoded.j2k");
  const outputPath = join(tempDir, "decoded.raw");

  try {
    writeFileSync(inputPath, codestream);
    const run = spawnSync(
      "go",
      ["run", GO_DECODER_TOOL, inputPath, outputPath],
      { cwd: GO_CODEC_DIR, encoding: "utf8" },
    );

    if (run.status !== 0) {
      throw new Error(
        `go decode failed (status=${run.status}): ${run.stderr || run.stdout || "unknown error"}`,
      );
    }

    const metadata = JSON.parse(run.stdout) as GoDecodeResult;
    const pixelData = new Uint8Array(readFileSync(outputPath));
    return { metadata, pixelData };
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function createTwoFrameRgbDataset(width: number, height: number, frameA: Uint8Array, frameB: Uint8Array): DicomDataset {
  const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
  dataset.addOrUpdateElement(DicomVR.US, Tags.Rows, height);
  dataset.addOrUpdateElement(DicomVR.US, Tags.Columns, width);
  dataset.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 8);
  dataset.addOrUpdateElement(DicomVR.US, Tags.BitsStored, 8);
  dataset.addOrUpdateElement(DicomVR.US, Tags.HighBit, 7);
  dataset.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 3);
  dataset.addOrUpdateElement(DicomVR.US, Tags.PixelRepresentation, 0);
  dataset.addOrUpdateElement(DicomVR.CS, Tags.PhotometricInterpretation, "RGB");
  dataset.addOrUpdateElement(DicomVR.US, Tags.PlanarConfiguration, 0);
  dataset.addOrUpdateElement(DicomVR.IS, Tags.NumberOfFrames, "0");

  const pixelData = DicomPixelData.create(dataset, true);
  pixelData.addFrame(new MemoryByteBuffer(frameA));
  pixelData.addFrame(new MemoryByteBuffer(frameB));
  return dataset;
}

function createFrameVariant(frame: Uint8Array): Uint8Array {
  const output = new Uint8Array(frame.length);
  for (let i = 0; i < frame.length; i++) {
    const value = frame[i] ?? 0;
    output[i] = (value + ((i % 7) - 3)) & 0xff;
  }
  return output;
}

describeGo("DicomJpeg2000TsEncodeGoDecode", () => {
  it("validates TS encode -> Go decode matrix on .90/.91 fixture corpus", async () => {
    const source = await DicomFile.open(join(ACCEPTANCE_DIR, "PM5644-960x540_RGB.dcm"));
    const sourceFrame = DicomPixelData.create(source.dataset).getFrame(0).data;
    const sourceHash = sha256(sourceFrame);

    const losslessMultiLayer = DicomJpeg2000Params.createLosslessDefaults();
    losslessMultiLayer.numLayers = 3;
    losslessMultiLayer.numLevels = 5;
    losslessMultiLayer.allowMct = true;

    const losslessRateDerived = DicomJpeg2000Params.createLosslessDefaults();
    losslessRateDerived.targetRatio = 6;
    losslessRateDerived.rate = 20;
    losslessRateDerived.rateLevels = [80, 40, 20, 10];
    losslessRateDerived.numLayers = 1;
    losslessRateDerived.numLevels = 5;
    losslessRateDerived.allowMct = true;

    const lossySingleLayer = new DicomJpeg2000Params();
    lossySingleLayer.irreversible = true;
    lossySingleLayer.numLayers = 1;
    lossySingleLayer.numLevels = 5;
    lossySingleLayer.allowMct = true;

    const lossyMultiLayer = new DicomJpeg2000Params();
    lossyMultiLayer.irreversible = true;
    lossyMultiLayer.numLayers = 3;
    lossyMultiLayer.numLevels = 5;
    lossyMultiLayer.allowMct = true;

    const matrix = [
      {
        name: ".90-lossless-multilayer",
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        params: losslessMultiLayer,
        expectLossless: true,
      },
      {
        name: ".90-lossless-rate-derived-layers",
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        params: losslessRateDerived,
        expectLossless: true,
      },
      {
        name: ".91-lossy-single-layer",
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        params: lossySingleLayer,
        expectLossless: false,
      },
      {
        name: ".91-lossy-multilayer",
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        params: lossyMultiLayer,
        expectLossless: false,
      },
    ];

    for (const entry of matrix) {
      const encoded = new DicomTranscoder(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        entry.syntax,
        null,
        entry.params,
      ).transcode(source.dataset);

      const encodedFrame = DicomPixelData.create(encoded).getFrame(0).data;
      expect(encodedFrame.length, `${entry.name} encoded size`).toBeGreaterThan(0);

      const goDecoded = decodeCodestreamWithGo(encodedFrame);
      const tsDecoded = new DicomTranscoder(
        entry.syntax,
        DicomTransferSyntax.ExplicitVRLittleEndian,
      ).transcode(encoded);
      const tsFrame = DicomPixelData.create(tsDecoded).getFrame(0).data;

      expect(goDecoded.metadata.width, `${entry.name} width`).toBe(960);
      expect(goDecoded.metadata.height, `${entry.name} height`).toBe(540);
      expect(goDecoded.metadata.components, `${entry.name} components`).toBe(3);
      expect(goDecoded.pixelData.length, `${entry.name} decoded length`).toBe(sourceFrame.length);
      expect(goDecoded.metadata.sha256, `${entry.name} Go vs TS hash`).toBe(sha256(tsFrame));

      if (entry.expectLossless) {
        expect(goDecoded.metadata.sha256, `${entry.name} lossless hash`).toBe(sourceHash);
      } else {
        const mae = meanAbsoluteError(goDecoded.pixelData, sourceFrame);
        expect(mae, `${entry.name} lossy MAE`).toBeLessThan(25);
      }
    }
  }, 180000);

  it("validates TS encode -> Go decode parity for multi-frame .90/.91", async () => {
    const source = await DicomFile.open(join(ACCEPTANCE_DIR, "PM5644-960x540_RGB.dcm"));
    const sourcePixelData = DicomPixelData.create(source.dataset);
    const frameA = sourcePixelData.getFrame(0).data;
    const frameB = createFrameVariant(frameA);
    const sourceFrames = [frameA, frameB];
    const multiFrameSource = createTwoFrameRgbDataset(960, 540, frameA, frameB);

    const losslessParams = DicomJpeg2000Params.createLosslessDefaults();
    losslessParams.numLevels = 5;
    losslessParams.allowMct = true;
    losslessParams.numLayers = 1;

    const lossyParams = new DicomJpeg2000Params();
    lossyParams.irreversible = true;
    lossyParams.numLevels = 5;
    lossyParams.allowMct = true;
    lossyParams.numLayers = 1;

    const matrix = [
      {
        name: ".90-lossless-multiframe",
        syntax: DicomTransferSyntax.JPEG2000Lossless,
        params: losslessParams,
        expectLossless: true,
      },
      {
        name: ".91-lossy-multiframe",
        syntax: DicomTransferSyntax.JPEG2000Lossy,
        params: lossyParams,
        expectLossless: false,
      },
    ];

    for (const entry of matrix) {
      const encoded = new DicomTranscoder(
        DicomTransferSyntax.ExplicitVRLittleEndian,
        entry.syntax,
        null,
        entry.params,
      ).transcode(multiFrameSource);

      const encodedPixelData = DicomPixelData.create(encoded);
      expect(encodedPixelData.numberOfFrames, `${entry.name} encoded frames`).toBe(2);

      const tsDecoded = new DicomTranscoder(
        entry.syntax,
        DicomTransferSyntax.ExplicitVRLittleEndian,
      ).transcode(encoded);
      const tsDecodedPixelData = DicomPixelData.create(tsDecoded);
      expect(tsDecodedPixelData.numberOfFrames, `${entry.name} decoded frames`).toBe(2);

      for (let frameIndex = 0; frameIndex < sourceFrames.length; frameIndex++) {
        const encodedFrame = encodedPixelData.getFrame(frameIndex).data;
        const goDecoded = decodeCodestreamWithGo(encodedFrame);
        const tsFrame = tsDecodedPixelData.getFrame(frameIndex).data;
        const sourceFrame = sourceFrames[frameIndex]!;

        expect(goDecoded.metadata.width, `${entry.name} frame ${frameIndex} width`).toBe(960);
        expect(goDecoded.metadata.height, `${entry.name} frame ${frameIndex} height`).toBe(540);
        expect(goDecoded.metadata.components, `${entry.name} frame ${frameIndex} components`).toBe(3);
        expect(goDecoded.pixelData.length, `${entry.name} frame ${frameIndex} decoded length`).toBe(sourceFrame.length);
        expect(goDecoded.metadata.sha256, `${entry.name} frame ${frameIndex} Go vs TS hash`).toBe(sha256(tsFrame));

        if (entry.expectLossless) {
          expect(goDecoded.metadata.sha256, `${entry.name} frame ${frameIndex} source hash`).toBe(sha256(sourceFrame));
        } else {
          const mae = meanAbsoluteError(goDecoded.pixelData, sourceFrame);
          expect(mae, `${entry.name} frame ${frameIndex} lossy MAE`).toBeLessThan(25);
        }
      }
    }
  }, 240000);
});
