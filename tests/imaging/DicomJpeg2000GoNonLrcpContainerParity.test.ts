import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import { DicomTranscoder } from "../../src/imaging/codec/DicomTranscoder.js";
import { parseJpeg2000Codestream } from "../../src/imaging/codec/jpeg2000/core/index.js";

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

interface GoEncodeConfig {
  width: number;
  height: number;
  lossless: boolean;
  progressionOrder: number;
  numLevels: number;
  numLayers: number;
  precinctWidth: number;
  precinctHeight: number;
  quality?: number;
  targetRatio?: number;
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

function peakSignalToNoiseRatio(original: Uint8Array, compressed: Uint8Array): number {
  const length = Math.min(original.length, compressed.length);
  if (length === 0) {
    return Infinity;
  }

  let mse = 0;
  for (let i = 0; i < length; i++) {
    const diff = (original[i] ?? 0) - (compressed[i] ?? 0);
    mse += diff * diff;
  }
  mse /= length;

  if (mse === 0) {
    return Infinity;
  }

  const maxPixel = 255;
  return 10 * Math.log10((maxPixel * maxPixel) / mse);
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

function encodeCodestreamWithGo(config: GoEncodeConfig): Uint8Array {
  const goCodecDir = join(process.cwd(), GO_CODEC_DIR);
  const tempDir = mkdtempSync(join(goCodecDir, "tmp-go-j2k-encode-"));
  const mainPath = join(tempDir, "main.go");
  const outputPath = join(tempDir, "encoded.j2k");

  const source = `
package main

import (
  "os"

  "github.com/cocosip/go-dicom-codec/jpeg2000"
)

func main() {
  width := ${config.width}
  height := ${config.height}
  componentData := make([][]int32, 1)
  componentData[0] = make([]int32, width*height)

  for y := 0; y < height; y++ {
    for x := 0; x < width; x++ {
      idx := y*width + x
      componentData[0][idx] = int32((x*5 + y*9 + (x*y)%17) % 256)
    }
  }

  params := jpeg2000.DefaultEncodeParams(width, height, 1, 8, false)
  params.Lossless = ${config.lossless ? "true" : "false"}
  params.NumLevels = ${config.numLevels}
  params.NumLayers = ${config.numLayers}
  params.ProgressionOrder = ${config.progressionOrder}
  params.PrecinctWidth = ${config.precinctWidth}
  params.PrecinctHeight = ${config.precinctHeight}
  params.Quality = ${config.quality ?? 80}
  params.TargetRatio = ${config.targetRatio ?? 0}

  encoded, err := jpeg2000.NewEncoder(params).EncodeComponents(componentData)
  if err != nil {
    panic(err)
  }

  if err := os.WriteFile(${JSON.stringify(outputPath)}, encoded, 0644); err != nil {
    panic(err)
  }
}
`;

  try {
    writeFileSync(mainPath, source);
    const relativeToolDir = tempDir.substring(goCodecDir.length + 1).replace(/\\/g, "/");
    const run = spawnSync(
      "go",
      ["run", `./${relativeToolDir}`],
      { cwd: goCodecDir, encoding: "utf8" },
    );

    if (run.status !== 0) {
      throw new Error(
        `go encode failed (status=${run.status}): ${run.stderr || run.stdout || "unknown error"}`,
      );
    }

    return new Uint8Array(readFileSync(outputPath));
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function createMonochromeGradientFrame(width: number, height: number): Uint8Array {
  const frame = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      frame[y * width + x] = (x * 5 + y * 9 + ((x * y) % 17)) & 0xff;
    }
  }
  return frame;
}

function buildSingleFrameMonochromeDataset(
  syntax: DicomTransferSyntax,
  width: number,
  height: number,
  codestream: Uint8Array,
): DicomDataset {
  const dataset = new DicomDataset(syntax);
  dataset.addOrUpdateElement(DicomVR.US, Tags.Rows, height);
  dataset.addOrUpdateElement(DicomVR.US, Tags.Columns, width);
  dataset.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 8);
  dataset.addOrUpdateElement(DicomVR.US, Tags.BitsStored, 8);
  dataset.addOrUpdateElement(DicomVR.US, Tags.HighBit, 7);
  dataset.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 1);
  dataset.addOrUpdateElement(DicomVR.US, Tags.PixelRepresentation, 0);
  dataset.addOrUpdateElement(DicomVR.CS, Tags.PhotometricInterpretation, "MONOCHROME2");
  dataset.addOrUpdateElement(DicomVR.IS, Tags.NumberOfFrames, "1");

  const pixelData = DicomPixelData.create(dataset, true);
  pixelData.addFrame(new MemoryByteBuffer(codestream));
  return dataset;
}

describeGo("DicomJpeg2000GoNonLrcpContainerParity", () => {
  it("decodes Go-generated non-LRCP .90 precinct codestreams through DICOM container path", () => {
    const width = 96;
    const height = 96;
    const sourceFrame = createMonochromeGradientFrame(width, height);
    const progressionOrders = [
      { name: "RLCP", order: 1 },
      { name: "RPCL", order: 2 },
      { name: "PCRL", order: 3 },
      { name: "CPRL", order: 4 },
    ] as const;

    for (const progression of progressionOrders) {
      const codestream = encodeCodestreamWithGo({
        width,
        height,
        lossless: true,
        progressionOrder: progression.order,
        numLevels: 2,
        numLayers: 2,
        precinctWidth: 64,
        precinctHeight: 64,
      });
      const parsed = parseJpeg2000Codestream(codestream);
      expect(parsed.cod?.progressionOrder, `${progression.name} COD`).toBe(progression.order);

      const goDecoded = decodeCodestreamWithGo(codestream);
      const dataset = buildSingleFrameMonochromeDataset(
        DicomTransferSyntax.JPEG2000Lossless,
        width,
        height,
        codestream,
      );
      const tsDecoded = new DicomTranscoder(
        DicomTransferSyntax.JPEG2000Lossless,
        DicomTransferSyntax.ExplicitVRLittleEndian,
      ).transcode(dataset);
      const tsFrame = DicomPixelData.create(tsDecoded).getFrame(0).data;

      expect(goDecoded.metadata.width, `${progression.name} width`).toBe(width);
      expect(goDecoded.metadata.height, `${progression.name} height`).toBe(height);
      expect(goDecoded.metadata.components, `${progression.name} components`).toBe(1);
      expect(goDecoded.pixelData.length, `${progression.name} decoded length`).toBe(sourceFrame.length);
      expect(goDecoded.metadata.sha256, `${progression.name} Go vs TS hash`).toBe(sha256(tsFrame));
      expect(goDecoded.metadata.sha256, `${progression.name} lossless source hash`).toBe(sha256(sourceFrame));
    }
  }, 180000);

  it("decodes Go-generated non-LRCP .91 precinct codestreams through DICOM container path", () => {
    const width = 96;
    const height = 96;
    const sourceFrame = createMonochromeGradientFrame(width, height);
    const progressionOrders = [
      { name: "RLCP", order: 1 },
      { name: "RPCL", order: 2 },
      { name: "PCRL", order: 3 },
      { name: "CPRL", order: 4 },
    ] as const;

    for (const progression of progressionOrders) {
      const codestream = encodeCodestreamWithGo({
        width,
        height,
        lossless: false,
        progressionOrder: progression.order,
        numLevels: 2,
        numLayers: 2,
        precinctWidth: 64,
        precinctHeight: 64,
        quality: 85,
        targetRatio: 8,
      });
      const parsed = parseJpeg2000Codestream(codestream);
      expect(parsed.cod?.progressionOrder, `${progression.name} COD`).toBe(progression.order);

      const goDecoded = decodeCodestreamWithGo(codestream);
      const dataset = buildSingleFrameMonochromeDataset(
        DicomTransferSyntax.JPEG2000Lossy,
        width,
        height,
        codestream,
      );
      const tsDecoded = new DicomTranscoder(
        DicomTransferSyntax.JPEG2000Lossy,
        DicomTransferSyntax.ExplicitVRLittleEndian,
      ).transcode(dataset);
      const tsFrame = DicomPixelData.create(tsDecoded).getFrame(0).data;

      const mae = meanAbsoluteError(goDecoded.pixelData, sourceFrame);
      const psnr = peakSignalToNoiseRatio(sourceFrame, goDecoded.pixelData);

      expect(goDecoded.metadata.width, `${progression.name} width`).toBe(width);
      expect(goDecoded.metadata.height, `${progression.name} height`).toBe(height);
      expect(goDecoded.metadata.components, `${progression.name} components`).toBe(1);
      expect(goDecoded.pixelData.length, `${progression.name} decoded length`).toBe(sourceFrame.length);
      expect(goDecoded.metadata.sha256, `${progression.name} Go vs TS hash`).toBe(sha256(tsFrame));
      expect(mae, `${progression.name} lossy MAE`).toBeLessThanOrEqual(30);
      expect(psnr, `${progression.name} lossy PSNR`).toBeGreaterThanOrEqual(15);
    }
  }, 180000);
});
