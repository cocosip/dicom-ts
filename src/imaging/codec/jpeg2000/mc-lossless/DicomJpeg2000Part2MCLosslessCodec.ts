import { DicomTransferSyntax } from "../../../../core/DicomTransferSyntax.js";
import type { IByteBuffer } from "../../../../io/buffer/IByteBuffer.js";
import { MemoryByteBuffer } from "../../../../io/buffer/MemoryByteBuffer.js";
import type { DicomPixelData } from "../../../DicomPixelData.js";
import type { DicomCodecParams } from "../../DicomCodecParams.js";
import type { IDicomCodec } from "../../IDicomCodec.js";
import { DicomJpeg2000Params } from "../DicomJpeg2000Params.js";
import { decodeJpeg2000 } from "../common/Jpeg2000Core.js";
import { Jpeg2000Encoder } from "../core/index.js";
import {
  applyJpeg2000DecodePixelMetadata,
  applyJpeg2000EncodePixelMetadata,
  normalizeLosslessRateControlParams,
  resolveLosslessJpeg2000Params,
  stripFramePaddingByte,
  validateDecodedFrame,
  validateJpeg2000EncodeInput,
  validateDecodedFrameResult,
} from "../common/Jpeg2000CodecCommon.js";

/**
 * JPEG 2000 Part 2 Multi-component Lossless codec (1.2.840.10008.1.2.4.92).
 */
export class DicomJpeg2000Part2MCLosslessCodec implements IDicomCodec {
  readonly name = "JPEG 2000 Part 2 Multi-component Lossless";
  readonly transferSyntax = DicomTransferSyntax.JPEG2000MCLossless;

  private readonly encoder = new Jpeg2000Encoder();

  getDefaultParameters(): DicomJpeg2000Params {
    return DicomJpeg2000Params.createLosslessDefaults();
  }

  decode(pixelData: DicomPixelData, frameIndex: number): IByteBuffer;
  decode(oldPixelData: DicomPixelData, newPixelData: DicomPixelData, parameters: DicomCodecParams | null): void;
  decode(
    arg1: DicomPixelData,
    arg2: number | DicomPixelData,
    _arg3?: DicomCodecParams | null,
  ): IByteBuffer | void {
    if (typeof arg2 === "number") {
      return this.decodeFrame(arg1, arg2);
    }

    for (let i = 0; i < arg1.numberOfFrames; i++) {
      arg2.addFrame(this.decodeFrame(arg1, i));
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
      const parameters = normalizeLosslessRateControlParams(
        resolveLosslessJpeg2000Params(null, this.getDefaultParameters()),
        arg1.bitsStored,
        arg1.bitsAllocated,
      );
      return this.encodeFrame(arg1, arg2, arg3 as IByteBuffer, parameters);
    }

    const parameters = normalizeLosslessRateControlParams(
      resolveLosslessJpeg2000Params((arg3 as DicomCodecParams | null | undefined) ?? null, this.getDefaultParameters()),
      arg1.bitsStored,
      arg1.bitsAllocated,
    );

    for (let i = 0; i < arg1.numberOfFrames; i++) {
      const rawFrame = arg1.getFrame(i);
      arg2.addFrame(this.encodeFrame(arg1, i, rawFrame, parameters));
    }

    applyJpeg2000EncodePixelMetadata(arg2, this.transferSyntax, parameters);
  }

  private decodeFrame(pixelData: DicomPixelData, frameIndex: number): IByteBuffer {
    const decoded = decodeJpeg2000(pixelData.getFrame(frameIndex).data);
    const normalized = validateDecodedFrameResult(
      decoded,
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
    validateJpeg2000EncodeInput(pixelData, frameIndex, this.transferSyntax.uid.uid, "multicomponent");
    const stripped = stripFramePaddingByte(rawFrame.data, pixelData);
    const encoded = this.encoder.encodeFrame({
      frameData: stripped,
      width: pixelData.columns,
      height: pixelData.rows,
      components: pixelData.samplesPerPixel,
      bitsAllocated: pixelData.bitsAllocated,
      bitsStored: pixelData.bitsStored,
      pixelRepresentation: pixelData.pixelRepresentation,
      parameters,
      isPart2: true,
    });

    if (!(encoded instanceof Uint8Array) || encoded.length === 0) {
      throw new Error(
        `JPEG2000 encode produced empty frame [frame=${frameIndex}, syntax=${this.transferSyntax.uid.uid}]`,
      );
    }

    return new MemoryByteBuffer(encoded);
  }
}
