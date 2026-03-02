import { DicomTransferSyntax } from "../../../../core/DicomTransferSyntax.js";
import { MemoryByteBuffer } from "../../../../io/buffer/MemoryByteBuffer.js";
import type { IByteBuffer } from "../../../../io/buffer/IByteBuffer.js";
import type { DicomPixelData } from "../../../DicomPixelData.js";
import type { IDicomCodec } from "../../IDicomCodec.js";
import {
  type DicomJpegBaselineParameters,
  type DicomJpegCodecParameters,
  type DicomJpegFrameContext,
  buildFrameContext,
  buildParameters,
  coerceAdapterResult,
  expectedNativeFrameSize,
  normalizeFrameSize,
} from "../common/JpegBaselineExtendedCommon.js";

export interface IDicomJpegBaselineAdapter {
  decode(frameData: Uint8Array, context: DicomJpegFrameContext): Uint8Array | IByteBuffer;
  encode(frameData: Uint8Array, context: DicomJpegFrameContext): Uint8Array | IByteBuffer;
}

export class DicomJpegProcess1Codec implements IDicomCodec {
  readonly transferSyntax: DicomTransferSyntax = DicomTransferSyntax.JPEGProcess1;
  readonly parameters: Readonly<Required<DicomJpegCodecParameters>>;
  private readonly adapter: IDicomJpegBaselineAdapter;

  constructor(adapter: IDicomJpegBaselineAdapter, parameters: DicomJpegBaselineParameters = {}) {
    this.adapter = adapter;
    this.parameters = buildParameters(parameters);
  }

  decode(pixelData: DicomPixelData, frame: number): IByteBuffer {
    this.validateBitDepth(pixelData, frame);
    const context = buildFrameContext(this.transferSyntax, this.parameters, pixelData, frame);
    const encodedFrame = pixelData.getFrame(frame).data;
    const decodedFrame = coerceAdapterResult(
      this.adapter.decode(encodedFrame, context),
      this.errorPrefix(frame, pixelData),
      "decode",
    );
    const expectedSize = expectedNativeFrameSize(pixelData, this.errorPrefix(frame, pixelData));
    const normalized = normalizeFrameSize(decodedFrame, expectedSize, this.errorPrefix(frame, pixelData), "decoded");
    return new MemoryByteBuffer(normalized);
  }

  encode(pixelData: DicomPixelData, frame: number, buffer: IByteBuffer): IByteBuffer {
    this.validateBitDepth(pixelData, frame);
    const context = buildFrameContext(this.transferSyntax, this.parameters, pixelData, frame);
    const expectedSize = expectedNativeFrameSize(pixelData, this.errorPrefix(frame, pixelData));
    const nativeFrame = normalizeFrameSize(buffer.data, expectedSize, this.errorPrefix(frame, pixelData), "raw");
    const encodedFrame = coerceAdapterResult(
      this.adapter.encode(nativeFrame, context),
      this.errorPrefix(frame, pixelData),
      "encode",
    );
    if (encodedFrame.length === 0) {
      throw new Error(`${this.errorPrefix(frame, pixelData)} adapter returned empty encoded frame`);
    }
    return new MemoryByteBuffer(encodedFrame);
  }

  private validateBitDepth(pixelData: DicomPixelData, frame: number): void {
    const prefix = this.errorPrefix(frame, pixelData);
    if (pixelData.bitsAllocated <= 0 || pixelData.bitsStored <= 0) {
      throw new Error(
        `${prefix} invalid bit depth values (bitsAllocated=${pixelData.bitsAllocated}, bitsStored=${pixelData.bitsStored})`,
      );
    }
    if (pixelData.bitsStored > pixelData.bitsAllocated) {
      throw new Error(
        `${prefix} invalid bit depth values (bitsStored=${pixelData.bitsStored} > bitsAllocated=${pixelData.bitsAllocated})`,
      );
    }
    if (pixelData.bitsStored > 8 || pixelData.bitsAllocated > 8) {
      throw new Error(`${prefix} JPEG Baseline (Process 1) supports up to 8-bit samples`);
    }
  }

  private errorPrefix(frame: number, pixelData: DicomPixelData): string {
    return `[JPEG Baseline uid=${this.transferSyntax.uid.uid} frame=${frame} bitsStored=${pixelData.bitsStored}]`;
  }
}
