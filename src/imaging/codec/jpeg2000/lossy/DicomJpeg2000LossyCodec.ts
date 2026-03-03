import { DicomTransferSyntax } from "../../../../core/DicomTransferSyntax.js";
import type { IByteBuffer } from "../../../../io/buffer/IByteBuffer.js";
import { MemoryByteBuffer } from "../../../../io/buffer/MemoryByteBuffer.js";
import type { DicomPixelData } from "../../../DicomPixelData.js";
import type { DicomCodecParams } from "../../DicomCodecParams.js";
import type { IDicomCodec } from "../../IDicomCodec.js";
import { DicomJpeg2000Params } from "../DicomJpeg2000Params.js";
import type { DicomJpeg2000Adapter } from "../common/DicomJpeg2000Adapter.js";
import { createMissingJpeg2000Adapter } from "../common/DicomJpeg2000Adapter.js";
import {
  applyJpeg2000DecodePixelMetadata,
  applyJpeg2000EncodePixelMetadata,
  buildJpeg2000FrameContext,
  normalizeDecodeResult,
  resolveJpeg2000Params,
  stripFramePaddingByte,
  validateDecodedFrame,
  validateJpeg2000EncodeInput,
} from "../common/Jpeg2000CodecCommon.js";

/**
 * JPEG 2000 codec (1.2.840.10008.1.2.4.91).
 */
export class DicomJpeg2000LossyCodec implements IDicomCodec {
  readonly name = "JPEG 2000";
  readonly transferSyntax = DicomTransferSyntax.JPEG2000Lossy;

  private readonly adapter: DicomJpeg2000Adapter;

  constructor(adapter: DicomJpeg2000Adapter = createMissingJpeg2000Adapter("JPEG 2000")) {
    this.adapter = adapter;
  }

  getDefaultParameters(): DicomJpeg2000Params {
    return new DicomJpeg2000Params();
  }

  decode(pixelData: DicomPixelData, frameIndex: number): IByteBuffer;
  decode(oldPixelData: DicomPixelData, newPixelData: DicomPixelData, parameters: DicomCodecParams | null): void;
  decode(
    arg1: DicomPixelData,
    arg2: number | DicomPixelData,
    arg3?: DicomCodecParams | null,
  ): IByteBuffer | void {
    const parameters = resolveJpeg2000Params(arg3 ?? null, this.getDefaultParameters());

    if (typeof arg2 === "number") {
      return this.decodeFrame(arg1, arg2, parameters);
    }

    for (let i = 0; i < arg1.numberOfFrames; i++) {
      arg2.addFrame(this.decodeFrame(arg1, i, parameters));
    }

    applyJpeg2000DecodePixelMetadata(arg2);
  }

  encode(pixelData: DicomPixelData, frameIndex: number, rawFrame: IByteBuffer): IByteBuffer;
  encode(oldPixelData: DicomPixelData, newPixelData: DicomPixelData, parameters: DicomCodecParams | null): void;
  encode(
    arg1: DicomPixelData,
    arg2: number | DicomPixelData,
    arg3?: IByteBuffer | DicomCodecParams | null,
  ): IByteBuffer | void {
    if (typeof arg2 === "number") {
      const parameters = resolveJpeg2000Params(null, this.getDefaultParameters());
      return this.encodeFrame(arg1, arg2, arg3 as IByteBuffer, parameters);
    }

    const parameters = resolveJpeg2000Params((arg3 as DicomCodecParams | null | undefined) ?? null, this.getDefaultParameters());

    for (let i = 0; i < arg1.numberOfFrames; i++) {
      const rawFrame = arg1.getFrame(i);
      arg2.addFrame(this.encodeFrame(arg1, i, rawFrame, parameters));
    }

    applyJpeg2000EncodePixelMetadata(arg2, this.transferSyntax, parameters);
  }

  private decodeFrame(pixelData: DicomPixelData, frameIndex: number, parameters: DicomJpeg2000Params): IByteBuffer {
    const context = buildJpeg2000FrameContext(this.transferSyntax, pixelData, parameters, frameIndex);
    const decoded = normalizeDecodeResult(this.adapter.decode(pixelData.getFrame(frameIndex).data, context));
    const normalized = validateDecodedFrame(
      decoded.pixelData,
      decoded.metadata,
      pixelData,
      frameIndex,
      this.transferSyntax.uid.uid,
    );
    return new MemoryByteBuffer(normalized);
  }

  private encodeFrame(
    pixelData: DicomPixelData,
    frameIndex: number,
    rawFrame: IByteBuffer,
    parameters: DicomJpeg2000Params,
  ): IByteBuffer {
    validateJpeg2000EncodeInput(pixelData, frameIndex, this.transferSyntax.uid.uid, "part1");
    const context = buildJpeg2000FrameContext(this.transferSyntax, pixelData, parameters, frameIndex);
    const stripped = stripFramePaddingByte(rawFrame.data, pixelData);
    const encoded = this.adapter.encode(stripped, context);

    if (!(encoded instanceof Uint8Array) || encoded.length === 0) {
      throw new Error(
        `JPEG2000 encode produced empty frame [frame=${frameIndex}, syntax=${this.transferSyntax.uid.uid}]`,
      );
    }

    return new MemoryByteBuffer(encoded);
  }
}
