import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { DicomFile } from "../../src/DicomFile.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import { DicomTranscoder } from "../../src/imaging/codec/DicomTranscoder.js";
import { DicomJpeg2000Params } from "../../src/imaging/codec/jpeg2000/DicomJpeg2000Params.js";

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
});
