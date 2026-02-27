import { DicomTransferSyntax } from "../../core/DicomTransferSyntax.js";
import { MemoryByteBuffer } from "../../io/buffer/MemoryByteBuffer.js";
import type { IByteBuffer } from "../../io/buffer/IByteBuffer.js";
import type { IDicomCodec } from "./IDicomCodec.js";
import type { DicomPixelData } from "../DicomPixelData.js";

/**
 * DICOM RLE Lossless codec (decode only).
 */
export class DicomRleCodec implements IDicomCodec {
  readonly transferSyntax: DicomTransferSyntax = DicomTransferSyntax.RLELossless;

  decode(pixelData: DicomPixelData, frame: number): IByteBuffer {
    const data = pixelData.getFrame(frame).data;
    if (data.length < 64) throw new Error("Invalid RLE frame: header too small");
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const segmentCount = view.getUint32(0, true);
    if (segmentCount <= 0 || segmentCount > 15) {
      throw new Error(`Invalid RLE segment count: ${segmentCount}`);
    }

    const offsets: number[] = [];
    for (let i = 0; i < 15; i++) {
      offsets.push(view.getUint32(4 + i * 4, true));
    }

    const bytesPerSample = Math.max(1, Math.ceil(pixelData.bitsAllocated / 8));
    const expectedSegments = pixelData.samplesPerPixel * bytesPerSample;
    const pixelCount = pixelData.rows * pixelData.columns;
    if (pixelCount <= 0) throw new Error("Invalid image size for RLE decoding");

    const segments: Uint8Array[] = [];
    for (let i = 0; i < segmentCount; i++) {
      const start = offsets[i] ?? 0;
      const next = offsets[i + 1] ?? data.length;
      const end = (next > start) ? next : data.length;
      const segmentData = data.subarray(start, end);
      segments.push(decodePackBits(segmentData, pixelCount));
    }

    if (segments.length < expectedSegments) {
      throw new Error(`RLE segments (${segments.length}) < expected (${expectedSegments})`);
    }

    const out = new Uint8Array(pixelCount * pixelData.samplesPerPixel * bytesPerSample);
    for (let s = 0; s < pixelData.samplesPerPixel; s++) {
      for (let b = 0; b < bytesPerSample; b++) {
        const segIndex = s * bytesPerSample + b;
        const seg = segments[segIndex]!;
        for (let i = 0; i < pixelCount; i++) {
          const dst = ((i * pixelData.samplesPerPixel) + s) * bytesPerSample + b;
          out[dst] = seg[i] ?? 0;
        }
      }
    }

    return new MemoryByteBuffer(out);
  }
}

function decodePackBits(data: Uint8Array, expected: number): Uint8Array {
  const out = new Uint8Array(expected);
  let outPos = 0;
  let i = 0;
  while (i < data.length && outPos < expected) {
    const n = (data[i]! << 24) >> 24; // signed int8
    i++;
    if (n >= 0) {
      const count = n + 1;
      for (let j = 0; j < count && i < data.length && outPos < expected; j++, i++) {
        out[outPos++] = data[i]!;
      }
    } else if (n >= -127) {
      const count = 1 - n;
      const value = data[i] ?? 0;
      i++;
      for (let j = 0; j < count && outPos < expected; j++) {
        out[outPos++] = value;
      }
    } else {
      // n == -128: no-op
    }
  }
  return out;
}
