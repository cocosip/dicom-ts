import { DicomTransferSyntax } from "../../../../core/DicomTransferSyntax.js";
import type { IByteBuffer } from "../../../../io/buffer/IByteBuffer.js";
import { MemoryByteBuffer } from "../../../../io/buffer/MemoryByteBuffer.js";
import type { DicomPixelData } from "../../../DicomPixelData.js";
import { DicomCodecParams } from "../../DicomCodecParams.js";
import type { IDicomCodec } from "../../IDicomCodec.js";
import { decodeJpegLs, encodeJpegLs } from "../common/JpegLsCore.js";
import { DicomJpegLsParams } from "../common/DicomJpegLsParams.js";

/**
 * JPEG-LS Near-Lossless codec (1.2.840.10008.1.2.4.81).
 */
export class DicomJpegLsNearLosslessCodec implements IDicomCodec {
  readonly name = "JPEG-LS Near-Lossless";
  readonly transferSyntax = DicomTransferSyntax.JPEGLSNearLossless;

  constructor(private readonly defaultAllowedError = 2) {}

  getDefaultParameters(): DicomJpegLsParams {
    const parameters = new DicomJpegLsParams();
    parameters.allowedError = normalizeAllowedError(this.defaultAllowedError, 2);
    return parameters;
  }

  decode(pixelData: DicomPixelData, frameIndex: number): IByteBuffer;
  decode(oldPixelData: DicomPixelData, newPixelData: DicomPixelData, parameters: DicomCodecParams | null): void;
  decode(
    arg1: DicomPixelData,
    arg2: number | DicomPixelData,
    arg3?: DicomCodecParams | null,
  ): IByteBuffer | void {
    if (typeof arg2 === "number") {
      return this.decodeFrame(arg1, arg2, this.resolveParams(null));
    }

    const parameters = this.resolveParams(arg3 ?? null);
    for (let i = 0; i < arg1.numberOfFrames; i++) {
      arg2.addFrame(this.decodeFrame(arg1, i, parameters));
    }
  }

  encode(pixelData: DicomPixelData, frameIndex: number, rawFrame: IByteBuffer): IByteBuffer;
  encode(oldPixelData: DicomPixelData, newPixelData: DicomPixelData, parameters: DicomCodecParams | null): void;
  encode(
    arg1: DicomPixelData,
    arg2: number | DicomPixelData,
    arg3?: IByteBuffer | DicomCodecParams | null,
  ): IByteBuffer | void {
    if (typeof arg2 === "number") {
      return this.encodeFrame(arg1, arg2, arg3 as IByteBuffer, this.resolveParams(null));
    }

    const parameters = this.resolveParams((arg3 as DicomCodecParams | null | undefined) ?? null);
    for (let i = 0; i < arg1.numberOfFrames; i++) {
      const rawFrame = arg1.getFrame(i);
      arg2.addFrame(this.encodeFrame(arg1, i, rawFrame, parameters));
    }
  }

  private decodeFrame(pixelData: DicomPixelData, frameIndex: number, parameters: DicomJpegLsParams): IByteBuffer {
    validatePixelData(pixelData, frameIndex, this.transferSyntax.uid.uid);

    const decoded = decodeJpegLs(pixelData.getFrame(frameIndex).data);
    validateDecodedMetadata(decoded.width, decoded.height, decoded.components, pixelData, frameIndex, this.transferSyntax.uid.uid);

    if (parameters.interleaveMode !== 0 && parameters.interleaveMode !== decoded.interleaveMode) {
      throw new Error(
        `JPEG-LS Near-Lossless decode interleave mismatch: expected=${parameters.interleaveMode}, actual=${decoded.interleaveMode} [frame=${frameIndex}, syntax=${this.transferSyntax.uid.uid}]`,
      );
    }

    return new MemoryByteBuffer(decoded.pixelData);
  }

  private encodeFrame(
    pixelData: DicomPixelData,
    frameIndex: number,
    rawFrame: IByteBuffer,
    parameters: DicomJpegLsParams,
  ): IByteBuffer {
    validatePixelData(pixelData, frameIndex, this.transferSyntax.uid.uid);

    const raw = stripPaddingByte(rawFrame.data, pixelData);
    const encoded = encodeJpegLs(raw, {
      width: pixelData.columns,
      height: pixelData.rows,
      components: pixelData.samplesPerPixel,
      bitDepth: pixelData.bitsStored,
      near: parameters.allowedError,
      interleaveMode: parameters.interleaveMode,
      reset: parameters.resetInterval,
    });

    return new MemoryByteBuffer(encoded);
  }

  private resolveParams(parameters: DicomCodecParams | null): DicomJpegLsParams {
    const source = parameters instanceof DicomJpegLsParams ? parameters : this.getDefaultParameters();

    const resolved = new DicomJpegLsParams();
    resolved.allowedError = normalizeAllowedError(source.allowedError, normalizeAllowedError(this.defaultAllowedError, 2));
    resolved.interleaveMode = normalizeInterleaveMode(source.interleaveMode);
    resolved.colorTransform = source.colorTransform;
    resolved.convertColorspaceToRgb = source.convertColorspaceToRgb;
    resolved.resetInterval = source.resetInterval;

    return resolved;
  }
}

function normalizeAllowedError(value: number, fallback: number): number {
  if (!Number.isInteger(value) || value < 0 || value > 255) {
    return fallback;
  }
  return value;
}

function normalizeInterleaveMode(value: number): number {
  if (!Number.isInteger(value) || (value !== 0 && value !== 1)) {
    throw new Error(`JPEG-LS Near-Lossless supports interleaveMode 0 or 1; got ${value}`);
  }
  return value;
}

function validatePixelData(pixelData: DicomPixelData, frameIndex: number, syntaxUid: string): void {
  if (pixelData.bitsStored < 2 || pixelData.bitsStored > 16) {
    throw new Error(
      `JPEG-LS supports 2-16-bit samples; got bitsStored=${pixelData.bitsStored} [frame=${frameIndex}, syntax=${syntaxUid}]`,
    );
  }

  if (pixelData.samplesPerPixel !== 1 && pixelData.samplesPerPixel !== 3) {
    throw new Error(
      `JPEG-LS currently supports SamplesPerPixel 1 or 3; got ${pixelData.samplesPerPixel} [frame=${frameIndex}, syntax=${syntaxUid}]`,
    );
  }
}

function validateDecodedMetadata(
  width: number,
  height: number,
  components: number,
  pixelData: DicomPixelData,
  frameIndex: number,
  syntaxUid: string,
): void {
  if (width !== pixelData.columns || height !== pixelData.rows || components !== pixelData.samplesPerPixel) {
    throw new Error(
      `JPEG-LS decoded frame metadata mismatch [decoded=${width}x${height}x${components}, expected=${pixelData.columns}x${pixelData.rows}x${pixelData.samplesPerPixel}, frame=${frameIndex}, syntax=${syntaxUid}]`,
    );
  }
}

function stripPaddingByte(data: Uint8Array, pixelData: DicomPixelData): Uint8Array {
  const bytesPerSample = Math.ceil(pixelData.bitsAllocated / 8);
  const expectedLength = pixelData.rows * pixelData.columns * pixelData.samplesPerPixel * bytesPerSample;
  return expectedLength > 0 && data.length > expectedLength ? data.subarray(0, expectedLength) : data;
}
