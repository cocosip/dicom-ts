/**
 * DICOM JPEG Lossless SV1 (Process 14, First-Order Prediction) codec.
 *
 * Transfer syntax: 1.2.840.10008.1.2.4.70
 *
 * Same as Process 14 but hard-codes predictor 1 (left pixel) and rejects
 * any encoded stream that uses a different predictor.
 * The `predictor` field in `DicomJpegParams` is ignored for this codec.
 */

import { DicomTransferSyntax } from "../../../../core/DicomTransferSyntax.js";
import { MemoryByteBuffer } from "../../../../io/buffer/MemoryByteBuffer.js";
import type { IByteBuffer } from "../../../../io/buffer/IByteBuffer.js";
import type { IDicomCodec } from "../../IDicomCodec.js";
import type { DicomCodecParams } from "../../DicomCodecParams.js";
import type { DicomPixelData } from "../../../DicomPixelData.js";
import { DicomJpegParams } from "../DicomJpegParams.js";
import { decodeLosslessJpeg, encodeLosslessSV1Jpeg } from "../common/JpegProcess14Common.js";

export class DicomJpegProcess14SV1Codec implements IDicomCodec {
  readonly name = "JPEG Lossless SV1 (Process 14, Predictor 1)";
  readonly transferSyntax = DicomTransferSyntax.JPEGProcess14SV1;

  getDefaultParameters(): DicomJpegParams {
    const p = new DicomJpegParams();
    p.predictor = 1; // always 1 for SV1
    return p;
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
    // sv1 = true → decodeLosslessJpeg enforces predictor === 1
    const result = decodeLosslessJpeg(pixelData.getFrame(frame).data, true);
    return new MemoryByteBuffer(result.pixels);
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
      return this.encodeSingleFrame(pixelData, frameOrNewPixelData, rawFrameOrParams as IByteBuffer, this.getDefaultParameters());
    }
    const newPixelData = frameOrNewPixelData;
    const params = toJpegParams(rawFrameOrParams as DicomCodecParams | null);
    for (let i = 0; i < pixelData.numberOfFrames; i++) {
      newPixelData.addFrame(this.encodeSingleFrame(pixelData, i, pixelData.getFrame(i), params));
    }
  }

  private encodeSingleFrame(pixelData: DicomPixelData, frame: number, rawFrame: IByteBuffer, params: DicomJpegParams): IByteBuffer {
    try {
      const encoded = encodeLosslessSV1Jpeg(
        rawFrame.data,
        pixelData.columns,
        pixelData.rows,
        pixelData.samplesPerPixel,
        pixelData.bitsStored || pixelData.bitsAllocated,
        params.pointTransform,
      );
      return new MemoryByteBuffer(encoded);
    } catch (err) {
      throw new Error(
        `JPEG Lossless SV1 encode failed [syntax=${this.transferSyntax.uid.uid}, frame=${frame}]: ${err}`,
      );
    }
  }
}

function toJpegParams(params: DicomCodecParams | null | undefined): DicomJpegParams {
  return params instanceof DicomJpegParams ? params : new DicomJpegParams();
}
