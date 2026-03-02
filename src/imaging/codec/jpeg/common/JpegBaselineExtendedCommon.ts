import { DicomTransferSyntax } from "../../../../core/DicomTransferSyntax.js";
import type { IByteBuffer } from "../../../../io/buffer/IByteBuffer.js";
import type { DicomPixelData } from "../../../DicomPixelData.js";

export type DicomJpegSampleFactor = "444" | "422" | "unknown";

export interface DicomJpegCodecParameters {
  readonly quality?: number;
  readonly smoothingFactor?: number;
  readonly convertColorspaceToRgb?: boolean;
  readonly sampleFactor?: DicomJpegSampleFactor;
}

export interface DicomJpegBaselineParameters extends DicomJpegCodecParameters {}
export interface DicomJpegExtendedParameters extends DicomJpegCodecParameters {}

export interface DicomJpegFrameContext {
  readonly transferSyntax: DicomTransferSyntax;
  readonly frame: number;
  readonly rows: number;
  readonly columns: number;
  readonly samplesPerPixel: number;
  readonly bitsAllocated: number;
  readonly bitsStored: number;
  readonly highBit: number;
  readonly planarConfiguration: DicomPixelData["planarConfiguration"];
  readonly pixelRepresentation: DicomPixelData["pixelRepresentation"];
  readonly photometricInterpretation: DicomPixelData["photometricInterpretation"];
  readonly parameters: Readonly<Required<DicomJpegCodecParameters>>;
}

export function buildFrameContext(
  transferSyntax: DicomTransferSyntax,
  parameters: Readonly<Required<DicomJpegCodecParameters>>,
  pixelData: DicomPixelData,
  frame: number,
): DicomJpegFrameContext {
  return {
    transferSyntax,
    frame,
    rows: pixelData.rows,
    columns: pixelData.columns,
    samplesPerPixel: pixelData.samplesPerPixel,
    bitsAllocated: pixelData.bitsAllocated,
    bitsStored: pixelData.bitsStored,
    highBit: pixelData.highBit,
    planarConfiguration: pixelData.planarConfiguration,
    pixelRepresentation: pixelData.pixelRepresentation,
    photometricInterpretation: pixelData.photometricInterpretation,
    parameters,
  };
}

export function buildParameters(parameters: DicomJpegCodecParameters): Readonly<Required<DicomJpegCodecParameters>> {
  return Object.freeze({
    quality: parameters.quality ?? 90,
    smoothingFactor: parameters.smoothingFactor ?? 0,
    convertColorspaceToRgb: parameters.convertColorspaceToRgb ?? true,
    sampleFactor: parameters.sampleFactor ?? "444",
  });
}

export function expectedNativeFrameSize(pixelData: DicomPixelData, prefix: string): number {
  if (pixelData.rows <= 0 || pixelData.columns <= 0 || pixelData.samplesPerPixel <= 0) {
    throw new Error(
      `${prefix} invalid image geometry (rows=${pixelData.rows}, columns=${pixelData.columns}, samples=${pixelData.samplesPerPixel})`,
    );
  }
  const bytesPerSample = Math.max(1, Math.ceil(pixelData.bitsAllocated / 8));
  return pixelData.rows * pixelData.columns * pixelData.samplesPerPixel * bytesPerSample;
}

export function normalizeFrameSize(
  frameData: Uint8Array,
  expectedSize: number,
  prefix: string,
  description: "decoded" | "raw",
): Uint8Array {
  if (frameData.length === expectedSize) return frameData;
  if (frameData.length === expectedSize + 1 && (expectedSize & 1) === 1 && frameData[frameData.length - 1] === 0) {
    return frameData.subarray(0, expectedSize);
  }
  throw new Error(`${prefix} ${description} frame size mismatch (expected ${expectedSize}, got ${frameData.length})`);
}

export function coerceAdapterResult(
  value: Uint8Array | IByteBuffer,
  prefix: string,
  operation: "decode" | "encode",
): Uint8Array {
  if (value instanceof Uint8Array) return value;
  if (isByteBuffer(value)) return value.data;
  throw new Error(`${prefix} adapter ${operation} result must be Uint8Array or IByteBuffer`);
}

function isByteBuffer(value: unknown): value is IByteBuffer {
  return typeof value === "object"
    && value !== null
    && "data" in value
    && (value as { data: unknown }).data instanceof Uint8Array;
}
