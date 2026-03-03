import { DicomTransferSyntax } from "../../../core/DicomTransferSyntax.js";
import { PixelRepresentation } from "../../PixelRepresentation.js";
import { MemoryByteBuffer } from "../../../io/buffer/MemoryByteBuffer.js";
import type { IByteBuffer } from "../../../io/buffer/IByteBuffer.js";
import type { DicomPixelData } from "../../DicomPixelData.js";
import { DicomCodecParams } from "../DicomCodecParams.js";
import type { IDicomCodec } from "../IDicomCodec.js";

/**
 * JPEG-LS interleave mode.
 *
 * Reference: fo-dicom.Codecs DicomJpegLsCodec.
 */
export enum DicomJpegLsInterleaveMode {
  None = 0,
  Line = 1,
  Sample = 2,
}

/**
 * JPEG-LS color transform selector.
 *
 * Reference: fo-dicom.Codecs DicomJpegLsCodec.
 */
export enum DicomJpegLsColorTransform {
  None = 0,
  HP1 = 1,
  HP2 = 2,
  HP3 = 3,
}

/**
 * Parameters shared by JPEG-LS Lossless and Near-Lossless codecs.
 */
export class DicomJpegLsParams extends DicomCodecParams {
  /**
   * NEAR parameter (allowed absolute reconstruction error per sample).
   *
   * - `0`   = lossless
   * - `1+`  = near-lossless
   */
  allowedError = 0;

  /**
   * Interleave mode hint for external adapters.
   */
  interleaveMode = DicomJpegLsInterleaveMode.Line;

  /**
   * Color transform hint for external adapters.
   */
  colorTransform = DicomJpegLsColorTransform.HP1;

  /**
   * Ask the adapter to return RGB pixels when possible.
   */
  convertColorspaceToRgb = true;
}

/**
 * Per-frame context passed to JPEG-LS adapters.
 */
export interface DicomJpegLsFrameContext {
  transferSyntax: DicomTransferSyntax;
  parameters: DicomJpegLsParams;
  samplesPerPixel: number;
  columns: number;
  rows: number;
  bitsAllocated: number;
  bitsStored: number;
  isSigned: boolean;
  frameIndex: number;
}

/**
 * Plug-in interface for JPEG-LS encode/decode implementations.
 */
export interface DicomJpegLsAdapter {
  decode(frameData: Uint8Array, context: DicomJpegLsFrameContext): Uint8Array;
  encode(frameData: Uint8Array, context: DicomJpegLsFrameContext): Uint8Array;
}

function failMissingAdapter(operation: "encode" | "decode", context: DicomJpegLsFrameContext): never {
  throw new Error(
    `JPEG-LS ${operation} requires an external adapter [frame=${context.frameIndex}, syntax=${context.transferSyntax.uid.uid}]`,
  );
}

const builtInAdapter: DicomJpegLsAdapter = {
  decode(_frameData: Uint8Array, context: DicomJpegLsFrameContext): Uint8Array {
    return failMissingAdapter("decode", context);
  },
  encode(_frameData: Uint8Array, context: DicomJpegLsFrameContext): Uint8Array {
    return failMissingAdapter("encode", context);
  },
};

abstract class DicomJpegLsCodecBase implements IDicomCodec {
  readonly name: string;
  readonly transferSyntax: DicomTransferSyntax;

  private readonly adapter: DicomJpegLsAdapter;
  private readonly defaultAllowedError: number;

  protected constructor(
    name: string,
    transferSyntax: DicomTransferSyntax,
    defaultAllowedError: number,
    adapter: DicomJpegLsAdapter,
  ) {
    this.name = name;
    this.transferSyntax = transferSyntax;
    this.defaultAllowedError = normalizeAllowedError(defaultAllowedError, 0);
    this.adapter = adapter;
  }

  getDefaultParameters(): DicomJpegLsParams {
    const parameters = new DicomJpegLsParams();
    parameters.allowedError = this.defaultAllowedError;
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
      const parameters = this.resolveParams(null);
      return this.decodeFrame(arg1, arg2, this.makeContext(arg1, arg2, parameters));
    }

    const parameters = this.resolveParams(arg3 ?? null);
    for (let i = 0; i < arg1.numberOfFrames; i++) {
      arg2.addFrame(this.decodeFrame(arg1, i, this.makeContext(arg1, i, parameters)));
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
      const parameters = this.resolveParams(null);
      return this.encodeFrame(arg1, arg2, arg3 as IByteBuffer, this.makeContext(arg1, arg2, parameters));
    }

    const parameters = this.resolveParams((arg3 as DicomCodecParams | null | undefined) ?? null);
    for (let i = 0; i < arg1.numberOfFrames; i++) {
      const rawFrame = arg1.getFrame(i);
      arg2.addFrame(this.encodeFrame(arg1, i, rawFrame, this.makeContext(arg1, i, parameters)));
    }
  }

  private makeContext(
    pixelData: DicomPixelData,
    frameIndex: number,
    parameters: DicomJpegLsParams,
  ): DicomJpegLsFrameContext {
    return {
      transferSyntax: this.transferSyntax,
      parameters,
      samplesPerPixel: pixelData.samplesPerPixel,
      columns: pixelData.columns,
      rows: pixelData.rows,
      bitsAllocated: pixelData.bitsAllocated,
      bitsStored: pixelData.bitsStored,
      isSigned: pixelData.pixelRepresentation === PixelRepresentation.Signed,
      frameIndex,
    };
  }

  private decodeFrame(
    pixelData: DicomPixelData,
    frameIndex: number,
    context: DicomJpegLsFrameContext,
  ): IByteBuffer {
    this.validateBitDepth(pixelData, frameIndex);
    const decoded = this.adapter.decode(pixelData.getFrame(frameIndex).data, context);
    return new MemoryByteBuffer(decoded);
  }

  private encodeFrame(
    pixelData: DicomPixelData,
    frameIndex: number,
    rawFrame: IByteBuffer,
    context: DicomJpegLsFrameContext,
  ): IByteBuffer {
    this.validateBitDepth(pixelData, frameIndex);
    const stripped = stripPaddingByte(rawFrame.data, pixelData);
    const encoded = this.adapter.encode(stripped, context);
    return new MemoryByteBuffer(encoded);
  }

  private validateBitDepth(pixelData: DicomPixelData, frameIndex: number): void {
    if (pixelData.bitsStored < 2 || pixelData.bitsStored > 16) {
      throw new Error(
        `JPEG-LS supports 2-16-bit samples; got bitsStored=${pixelData.bitsStored} [frame=${frameIndex}, syntax=${this.transferSyntax.uid.uid}]`,
      );
    }
  }

  private resolveParams(parameters: DicomCodecParams | null): DicomJpegLsParams {
    const source = parameters instanceof DicomJpegLsParams
      ? parameters
      : this.getDefaultParameters();

    const resolved = new DicomJpegLsParams();
    resolved.allowedError = normalizeAllowedError(source.allowedError, this.defaultAllowedError);
    resolved.interleaveMode = source.interleaveMode;
    resolved.colorTransform = source.colorTransform;
    resolved.convertColorspaceToRgb = source.convertColorspaceToRgb;

    if (this.transferSyntax.uid.uid === DicomTransferSyntax.JPEGLSLossless.uid.uid) {
      if (resolved.allowedError !== 0) {
        throw new Error(
          `JPEG-LS Lossless requires allowedError=0; got ${resolved.allowedError} [syntax=${this.transferSyntax.uid.uid}]`,
        );
      }
    }

    return resolved;
  }
}

/**
 * JPEG-LS Lossless codec (1.2.840.10008.1.2.4.80).
 *
 * This codec is adapter-only in dicom-ts Phase 10.5.
 */
export class DicomJpegLsLosslessCodec extends DicomJpegLsCodecBase {
  constructor(adapter: DicomJpegLsAdapter = builtInAdapter) {
    super("JPEG-LS Lossless", DicomTransferSyntax.JPEGLSLossless, 0, adapter);
  }
}

/**
 * JPEG-LS Near-Lossless codec (1.2.840.10008.1.2.4.81).
 *
 * This codec is adapter-only in dicom-ts Phase 10.5.
 */
export class DicomJpegLsNearLosslessCodec extends DicomJpegLsCodecBase {
  constructor(adapter: DicomJpegLsAdapter = builtInAdapter, defaultAllowedError = 2) {
    super(
      "JPEG-LS Near-Lossless",
      DicomTransferSyntax.JPEGLSNearLossless,
      normalizeAllowedError(defaultAllowedError, 2),
      adapter,
    );
  }
}

function normalizeAllowedError(value: number, fallback: number): number {
  if (!Number.isInteger(value) || value < 0 || value > 255) {
    return fallback;
  }
  return value;
}

function stripPaddingByte(data: Uint8Array, pixelData: DicomPixelData): Uint8Array {
  const bytesPerSample = Math.ceil(pixelData.bitsAllocated / 8);
  const unpaddedLength = pixelData.rows * pixelData.columns * pixelData.samplesPerPixel * bytesPerSample;
  return unpaddedLength > 0 && data.length > unpaddedLength
    ? data.subarray(0, unpaddedLength)
    : data;
}
