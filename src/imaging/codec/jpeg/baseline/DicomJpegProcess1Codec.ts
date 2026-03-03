/**
 * DICOM JPEG Baseline (Process 1) codec.
 *
 * Transfer syntax: 1.2.840.10008.1.2.4.50
 *
 * Supports 8-bit grayscale and RGB images.
 *
 * A built-in pure-TypeScript DCT encoder/decoder is used by default.
 * Pass a custom DicomJpegAdapter to the constructor to substitute a native library.
 *
 * Reference: go-dicom-codec/jpeg/baseline/
 *            FO-DICOM.Core/Imaging/Codec/DicomJpegCodec.cs
 */

import { DicomTransferSyntax } from "../../../../core/DicomTransferSyntax.js";
import { MemoryByteBuffer } from "../../../../io/buffer/MemoryByteBuffer.js";
import type { IByteBuffer } from "../../../../io/buffer/IByteBuffer.js";
import type { IDicomCodec } from "../../IDicomCodec.js";
import type { DicomCodecParams } from "../../DicomCodecParams.js";
import type { DicomPixelData } from "../../../DicomPixelData.js";
import { DicomJpegParams } from "../DicomJpegParams.js";
import { encodeDctJpeg, decodeDctJpeg } from "../common/JpegBaselineCommon.js";
import { SOF0 } from "../common/JpegMarkers.js";
import type { DicomJpegAdapter, DicomJpegFrameContext } from "../common/DicomJpegAdapter.js";

// ─────────────────────────────────────────────────────────────
// Built-in adapter — pure-TypeScript DCT engine
// ─────────────────────────────────────────────────────────────

const builtIn: DicomJpegAdapter = {
  decode(frameData: Uint8Array): Uint8Array {
    return decodeDctJpeg(frameData).pixels;
  },
  encode(frameData: Uint8Array, ctx: DicomJpegFrameContext): Uint8Array {
    return encodeDctJpeg(
      frameData,
      ctx.columns,
      ctx.rows,
      ctx.samplesPerPixel,
      ctx.parameters.quality,
      SOF0,
    );
  },
};

// ─────────────────────────────────────────────────────────────
// Codec
// ─────────────────────────────────────────────────────────────

export class DicomJpegProcess1Codec implements IDicomCodec {
  readonly name = "JPEG Baseline (Process 1)";
  readonly transferSyntax = DicomTransferSyntax.JPEGProcess1;
  private readonly adapter: DicomJpegAdapter;

  constructor(adapter: DicomJpegAdapter = builtIn) {
    this.adapter = adapter;
  }

  getDefaultParameters(): DicomJpegParams {
    return new DicomJpegParams();
  }

  // ── Single-frame convenience API ──────────────────────────────────────────

  decode(pixelData: DicomPixelData, frameIndex: number): IByteBuffer;

  // ── IDicomCodec multi-frame API (used by TranscoderManager) ───────────────

  decode(oldPixelData: DicomPixelData, newPixelData: DicomPixelData, parameters: DicomCodecParams | null): void;

  decode(
    arg1: DicomPixelData,
    arg2: number | DicomPixelData,
    arg3?: DicomCodecParams | null,
  ): IByteBuffer | void {
    if (typeof arg2 === "number") {
      return this._decodeFrame(arg1, arg2, this._makeContext(arg1, arg2, true));
    }
    const params = arg3 instanceof DicomJpegParams ? arg3 : new DicomJpegParams();
    for (let i = 0; i < arg1.numberOfFrames; i++) {
      arg2.addFrame(this._decodeFrame(arg1, i, this._makeContext(arg1, i, params.convertColorspaceToRgb)));
    }
  }

  // ── Single-frame convenience API ──────────────────────────────────────────

  encode(pixelData: DicomPixelData, frameIndex: number, rawFrame: IByteBuffer): IByteBuffer;

  // ── IDicomCodec multi-frame API (used by TranscoderManager) ───────────────

  encode(oldPixelData: DicomPixelData, newPixelData: DicomPixelData, parameters: DicomCodecParams | null): void;

  encode(
    arg1: DicomPixelData,
    arg2: number | DicomPixelData,
    arg3?: IByteBuffer | DicomCodecParams | null,
  ): IByteBuffer | void {
    if (typeof arg2 === "number") {
      return this._encodeFrame(arg1, arg2, arg3 as IByteBuffer, this._makeContext(arg1, arg2, true));
    }
    const params = arg3 instanceof DicomJpegParams ? arg3 : new DicomJpegParams();
    for (let i = 0; i < arg1.numberOfFrames; i++) {
      const raw = arg1.getFrame(i);
      (arg2 as DicomPixelData).addFrame(
        this._encodeFrame(arg1, i, raw, this._makeContext(arg1, i, params.convertColorspaceToRgb)),
      );
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────────────────────────

  private _makeContext(
    pixelData: DicomPixelData,
    frameIndex: number,
    convertColorspaceToRgb: boolean,
  ): DicomJpegFrameContext {
    const params = new DicomJpegParams();
    params.convertColorspaceToRgb = convertColorspaceToRgb;
    return {
      transferSyntax: this.transferSyntax,
      parameters: params,
      samplesPerPixel: pixelData.samplesPerPixel,
      columns: pixelData.columns,
      rows: pixelData.rows,
      bitsStored: pixelData.bitsStored,
      frameIndex,
    };
  }

  private _decodeFrame(
    pixelData: DicomPixelData,
    frameIndex: number,
    ctx: DicomJpegFrameContext,
  ): IByteBuffer {
    if (pixelData.bitsStored > 8) {
      throw new Error(
        `JPEG Baseline (Process 1) supports up to 8-bit samples; got bitsStored=${pixelData.bitsStored} [frame=${frameIndex}, syntax=${this.transferSyntax.uid.uid}]`,
      );
    }
    const pixels = this.adapter.decode(pixelData.getFrame(frameIndex).data, ctx);
    return new MemoryByteBuffer(pixels);
  }

  private _encodeFrame(
    pixelData: DicomPixelData,
    frameIndex: number,
    rawFrame: IByteBuffer,
    ctx: DicomJpegFrameContext,
  ): IByteBuffer {
    if (pixelData.bitsStored > 8) {
      throw new Error(
        `JPEG Baseline (Process 1) supports up to 8-bit samples; got bitsStored=${pixelData.bitsStored} [frame=${frameIndex}, syntax=${this.transferSyntax.uid.uid}]`,
      );
    }
    const stripped = stripPaddingByte(rawFrame.data, pixelData);
    return new MemoryByteBuffer(this.adapter.encode(stripped, ctx));
  }
}

function stripPaddingByte(data: Uint8Array, pixelData: DicomPixelData): Uint8Array {
  const bytesPerSample = Math.ceil(pixelData.bitsAllocated / 8);
  const unpadded = pixelData.rows * pixelData.columns * pixelData.samplesPerPixel * bytesPerSample;
  return unpadded > 0 && data.length > unpadded ? data.subarray(0, unpadded) : data;
}
