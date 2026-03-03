/**
 * DICOM JPEG Extended (Process 2 & 4) codec.
 *
 * Transfer syntax: 1.2.840.10008.1.2.4.51
 *
 * Supports 8-bit and 12-bit samples.  For 12-bit data the encode path
 * scales samples to 8-bit, encodes as JPEG with SOF1 marker, and patches
 * the precision byte to 12.  The decode path detects 12-bit data from the
 * SOF precision field and scales the decoded 8-bit output back to 12-bit.
 *
 * A built-in pure-TypeScript DCT encoder/decoder is used by default.
 * Pass a custom DicomJpegAdapter to the constructor to substitute a native library.
 *
 * Reference: go-dicom-codec/jpeg/extended/encoder_simple.go + decoder.go
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
import { SOF1 } from "../common/JpegMarkers.js";
import type { DicomJpegAdapter, DicomJpegFrameContext } from "../common/DicomJpegAdapter.js";

// ─────────────────────────────────────────────────────────────
// 12-bit ↔ 8-bit scaling helpers
// ─────────────────────────────────────────────────────────────

function detectPrecision(data: Uint8Array): number {
  for (let i = 0; i < data.length - 5; i++) {
    if (data[i] === 0xff) {
      const marker = data[i + 1]!;
      // SOF0, SOF1, SOF2, SOF3
      if (marker >= 0xc0 && marker <= 0xc3) {
        // precision byte is at offset i+4 (after 0xFF marker 2B + length 2B)
        const precision = data[i + 4]!;
        if (precision === 12) return 12;
        return 8;
      }
    }
  }
  return 8;
}

function patchPrecision(data: Uint8Array, bitDepth: number): Uint8Array {
  const result = new Uint8Array(data);
  for (let i = 0; i < result.length - 5; i++) {
    if (result[i] === 0xff) {
      const marker = result[i + 1]!;
      if (marker >= 0xc0 && marker <= 0xc3) {
        result[i + 4] = bitDepth;
        break;
      }
    }
  }
  return result;
}

function scaleTo8Bit(data: Uint8Array, _spp: number): Uint8Array {
  const numSamples = Math.floor(data.length / 2);
  const out = new Uint8Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const val16 = data[i * 2]! | (data[i * 2 + 1]! << 8);
    out[i] = Math.min(255, Math.round((val16 * 255) / 4095));
  }
  return out;
}

function scaleTo12Bit(data: Uint8Array): Uint8Array {
  const out = new Uint8Array(data.length * 2);
  for (let i = 0; i < data.length; i++) {
    const val12 = Math.round((data[i]! * 4095) / 255);
    out[i * 2]     = val12 & 0xff;
    out[i * 2 + 1] = (val12 >> 8) & 0xff;
  }
  return out;
}

// ─────────────────────────────────────────────────────────────
// Built-in adapter — pure-TypeScript DCT engine
// ─────────────────────────────────────────────────────────────

const builtIn: DicomJpegAdapter = {
  decode(frameData: Uint8Array): Uint8Array {
    const bitDepth = detectPrecision(frameData);
    let pixels = decodeDctJpeg(frameData).pixels;
    if (bitDepth === 12) pixels = scaleTo12Bit(pixels);
    return pixels;
  },
  encode(frameData: Uint8Array, ctx: DicomJpegFrameContext): Uint8Array {
    const is12bit = ctx.bitsStored > 8;
    const pixels8 = is12bit ? scaleTo8Bit(frameData, ctx.samplesPerPixel) : frameData;
    let encoded = encodeDctJpeg(
      pixels8,
      ctx.columns,
      ctx.rows,
      ctx.samplesPerPixel,
      ctx.parameters.quality,
      SOF1,
    );
    if (is12bit) encoded = patchPrecision(encoded, ctx.bitsStored);
    return encoded;
  },
};

// ─────────────────────────────────────────────────────────────
// Codec
// ─────────────────────────────────────────────────────────────

export class DicomJpegProcess2_4Codec implements IDicomCodec {
  readonly name = "JPEG Extended (Process 2 & 4)";
  readonly transferSyntax = DicomTransferSyntax.JPEGProcess2_4;
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
    if (pixelData.bitsStored > 12) {
      throw new Error(
        `JPEG Extended (Process 2 & 4) supports up to 12-bit samples; got bitsStored=${pixelData.bitsStored} [frame=${frameIndex}, syntax=${this.transferSyntax.uid.uid}]`,
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
    if (pixelData.bitsStored > 12) {
      throw new Error(
        `JPEG Extended (Process 2 & 4) supports up to 12-bit samples; got bitsStored=${pixelData.bitsStored} [frame=${frameIndex}, syntax=${this.transferSyntax.uid.uid}]`,
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
