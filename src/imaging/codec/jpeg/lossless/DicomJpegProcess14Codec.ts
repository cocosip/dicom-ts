/**
 * DICOM JPEG Lossless Process 14 codec — built-in pure TypeScript.
 *
 * Transfer syntax: 1.2.840.10008.1.2.4.57
 *
 * Supports all 7 predictors, 8 / 12 / 16-bit, 1 or 3 components.
 * Both encode and decode are available without any external dependency.
 */

import { DicomTransferSyntax } from "../../../../core/DicomTransferSyntax.js";
import { MemoryByteBuffer } from "../../../../io/buffer/MemoryByteBuffer.js";
import type { IByteBuffer } from "../../../../io/buffer/IByteBuffer.js";
import type { IDicomCodec } from "../../IDicomCodec.js";
import type { DicomCodecParams } from "../../DicomCodecParams.js";
import type { DicomPixelData } from "../../../DicomPixelData.js";
import { DicomJpegParams } from "../DicomJpegParams.js";
import { decodeLosslessJpeg, encodeLosslessJpeg } from "../common/JpegProcess14Common.js";

export class DicomJpegProcess14Codec implements IDicomCodec {
  readonly name = "JPEG Lossless Process 14";
  readonly transferSyntax = DicomTransferSyntax.JPEGProcess14;

  getDefaultParameters(): DicomJpegParams {
    return new DicomJpegParams();
  }

  // ----- Convenience single-frame decode -----

  decode(pixelData: DicomPixelData, frame: number): IByteBuffer;
  decode(oldPixelData: DicomPixelData, newPixelData: DicomPixelData, parameters: DicomCodecParams | null): void;
  decode(
    pixelData: DicomPixelData,
    frameOrNewPixelData: number | DicomPixelData,
    _parameters?: DicomCodecParams | null,
  ): IByteBuffer | void {
    if (typeof frameOrNewPixelData === "number") {
      return this.decodeSingleFrame(pixelData, frameOrNewPixelData);
    }
    const newPixelData = frameOrNewPixelData;
    for (let i = 0; i < pixelData.numberOfFrames; i++) {
      newPixelData.addFrame(this.decodeSingleFrame(pixelData, i));
    }
  }

  private decodeSingleFrame(pixelData: DicomPixelData, frame: number): IByteBuffer {
    try {
      const result = decodeLosslessJpeg(pixelData.getFrame(frame).data, false);
      return new MemoryByteBuffer(result.pixels);
    } catch (err) {
      throw new Error(
        `JPEG Lossless Process 14 decode failed [syntax=${this.transferSyntax.uid.uid}, frame=${frame}]: ${err}`,
      );
    }
  }

  // ----- Convenience single-frame encode -----

  encode(pixelData: DicomPixelData, frame: number, rawFrame: IByteBuffer): IByteBuffer;
  encode(oldPixelData: DicomPixelData, newPixelData: DicomPixelData, parameters: DicomCodecParams | null): void;
  encode(
    pixelData: DicomPixelData,
    frameOrNewPixelData: number | DicomPixelData,
    rawFrameOrParams?: IByteBuffer | DicomCodecParams | null,
  ): IByteBuffer | void {
    if (typeof frameOrNewPixelData === "number") {
      return this.encodeSingleFrame(pixelData, frameOrNewPixelData, rawFrameOrParams as IByteBuffer, new DicomJpegParams());
    }
    const newPixelData = frameOrNewPixelData;
    const params = toJpegParams(rawFrameOrParams as DicomCodecParams | null);
    for (let i = 0; i < pixelData.numberOfFrames; i++) {
      newPixelData.addFrame(this.encodeSingleFrame(pixelData, i, pixelData.getFrame(i), params));
    }
  }

  private encodeSingleFrame(
    pixelData: DicomPixelData,
    frame: number,
    rawFrame: IByteBuffer,
    params: DicomJpegParams,
  ): IByteBuffer {
    try {
      const encoded = encodeLosslessJpeg(
        rawFrame.data,
        pixelData.columns,
        pixelData.rows,
        pixelData.samplesPerPixel,
        pixelData.bitsStored || pixelData.bitsAllocated,
        { predictor: params.predictor, pointTransform: params.pointTransform },
      );
      return new MemoryByteBuffer(encoded);
    } catch (err) {
      throw new Error(
        `JPEG Lossless Process 14 encode failed [syntax=${this.transferSyntax.uid.uid}, frame=${frame}]: ${err}`,
      );
    }
  }
}

function toJpegParams(params: DicomCodecParams | null | undefined): DicomJpegParams {
  return params instanceof DicomJpegParams ? params : new DicomJpegParams();
}
