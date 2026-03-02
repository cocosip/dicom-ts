/**
 * DICOM JPEG Baseline (Process 1) codec — plugin-path adapter pattern.
 *
 * Transfer syntax: 1.2.840.10008.1.2.4.50
 *
 * Callers supply a `DicomJpegAdapter` that performs the actual JPEG encode/
 * decode using an external library (e.g. libjpeg-turbo).  The codec wrapper
 * handles DICOM framing, validates bit depth, and assembles pixel buffers.
 */

import { DicomTransferSyntax } from "../../../../core/DicomTransferSyntax.js";
import { MemoryByteBuffer } from "../../../../io/buffer/MemoryByteBuffer.js";
import type { IByteBuffer } from "../../../../io/buffer/IByteBuffer.js";
import type { IDicomCodec } from "../../IDicomCodec.js";
import type { DicomCodecParams } from "../../DicomCodecParams.js";
import type { DicomPixelData } from "../../../DicomPixelData.js";
import { DicomJpegParams } from "../DicomJpegParams.js";
import type { DicomJpegAdapter, DicomJpegFrameContext } from "../common/JpegBaselineExtendedCommon.js";

export type { DicomJpegAdapter, DicomJpegFrameContext } from "../common/JpegBaselineExtendedCommon.js";

export class DicomJpegProcess1Codec implements IDicomCodec {
  readonly name = "JPEG Baseline (Process 1)";
  readonly transferSyntax = DicomTransferSyntax.JPEGProcess1;

  constructor(private readonly adapter: DicomJpegAdapter) {}

  getDefaultParameters(): DicomJpegParams {
    return new DicomJpegParams();
  }

  // ----- Convenience single-frame decode -----

  decode(pixelData: DicomPixelData, frame: number): IByteBuffer;
  decode(oldPixelData: DicomPixelData, newPixelData: DicomPixelData, parameters: DicomCodecParams | null): void;
  decode(
    pixelData: DicomPixelData,
    frameOrNewPixelData: number | DicomPixelData,
    parameters?: DicomCodecParams | null,
  ): IByteBuffer | void {
    if (typeof frameOrNewPixelData === "number") {
      return this.decodeSingleFrame(pixelData, frameOrNewPixelData, defaultContext());
    }
    const newPixelData = frameOrNewPixelData;
    const params = toJpegParams(parameters);
    for (let i = 0; i < pixelData.numberOfFrames; i++) {
      newPixelData.addFrame(this.decodeSingleFrame(pixelData, i, params));
    }
  }

  private decodeSingleFrame(pixelData: DicomPixelData, frame: number, params: DicomJpegParams): IByteBuffer {
    if (pixelData.bitsStored > 8) {
      throw new Error(
        `JPEG Baseline (Process 1) supports up to 8-bit samples; ` +
        `got bitsStored=${pixelData.bitsStored} [syntax=${this.transferSyntax.uid.uid}, frame=${frame}]`,
      );
    }
    const frameData = pixelData.getFrame(frame).data;
    const ctx = buildContext(pixelData, this.transferSyntax, params);
    return new MemoryByteBuffer(this.adapter.decode(frameData, ctx));
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
      return this.encodeSingleFrame(pixelData, frameOrNewPixelData, rawFrameOrParams as IByteBuffer, defaultContext());
    }
    const newPixelData = frameOrNewPixelData;
    const params = toJpegParams(rawFrameOrParams as DicomCodecParams | null);
    for (let i = 0; i < pixelData.numberOfFrames; i++) {
      const rawFrame = pixelData.getFrame(i);
      newPixelData.addFrame(this.encodeSingleFrame(pixelData, i, rawFrame, params));
    }
  }

  private encodeSingleFrame(
    pixelData: DicomPixelData,
    _frame: number,
    rawFrame: IByteBuffer,
    params: DicomJpegParams,
  ): IByteBuffer {
    const frameBytes = stripPaddingByte(rawFrame.data, pixelData);
    const ctx = buildContext(pixelData, this.transferSyntax, params);
    return new MemoryByteBuffer(this.adapter.encode(frameBytes, ctx));
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convenience-API context: convertColorspaceToRgb overridden to true. */
function defaultContext(): DicomJpegParams {
  const p = new DicomJpegParams();
  p.convertColorspaceToRgb = true;
  return p;
}

function toJpegParams(params: DicomCodecParams | null | undefined): DicomJpegParams {
  return params instanceof DicomJpegParams ? params : new DicomJpegParams();
}

function buildContext(
  pixelData: DicomPixelData,
  transferSyntax: DicomTransferSyntax,
  params: DicomJpegParams,
): DicomJpegFrameContext {
  return {
    transferSyntax,
    parameters: params,
    samplesPerPixel: pixelData.samplesPerPixel,
    bitsStored: pixelData.bitsStored,
    columns: pixelData.columns,
    rows: pixelData.rows,
  };
}

function stripPaddingByte(data: Uint8Array, pixelData: DicomPixelData): Uint8Array {
  const bytesPerSample = Math.ceil(pixelData.bitsAllocated / 8);
  const unpadded = pixelData.rows * pixelData.columns * pixelData.samplesPerPixel * bytesPerSample;
  return (unpadded > 0 && data.length > unpadded) ? data.subarray(0, unpadded) : data;
}
