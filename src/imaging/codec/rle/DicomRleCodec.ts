import { DicomTransferSyntax } from "../../../core/DicomTransferSyntax.js";
import { MemoryByteBuffer } from "../../../io/buffer/MemoryByteBuffer.js";
import type { IByteBuffer } from "../../../io/buffer/IByteBuffer.js";
import type { IDicomCodec } from "../IDicomCodec.js";
import type { DicomCodecParams } from "../DicomCodecParams.js";
import type { DicomPixelData } from "../../DicomPixelData.js";
import { PlanarConfiguration } from "../../PlanarConfiguration.js";

/**
 * DICOM RLE Lossless codec (encode + decode).
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Codec/DicomRleCodecImpl.Mono.cs
 */
export class DicomRleCodec implements IDicomCodec {
  readonly name = DicomTransferSyntax.RLELossless.uid.name;
  readonly transferSyntax: DicomTransferSyntax = DicomTransferSyntax.RLELossless;

  getDefaultParameters(): DicomCodecParams | null {
    return null;
  }

  encode(oldPixelData: DicomPixelData, newPixelData: DicomPixelData, _parameters: DicomCodecParams | null): void {
    const pixelCount = oldPixelData.rows * oldPixelData.columns;
    const numberOfSegments = oldPixelData.bytesAllocated * oldPixelData.samplesPerPixel;

    for (let frame = 0; frame < oldPixelData.numberOfFrames; frame++) {
      const frameData = oldPixelData.getFrame(frame).data;
      const encoder = new RLEEncoder();

      for (let s = 0; s < numberOfSegments; s++) {
        encoder.nextSegment();

        const sample = Math.floor(s / oldPixelData.bytesAllocated);
        const sabyte = s % oldPixelData.bytesAllocated;

        let pos: number;
        let offset: number;

        if (newPixelData.planarConfiguration === PlanarConfiguration.Interleaved) {
          pos = sample * oldPixelData.bytesAllocated;
          offset = numberOfSegments;
        } else {
          pos = sample * oldPixelData.bytesAllocated * pixelCount;
          offset = oldPixelData.bytesAllocated;
        }

        // Big-endian byte order within each sample (MSB first per RLE spec)
        pos += oldPixelData.bytesAllocated - sabyte - 1;

        for (let p = 0; p < pixelCount; p++) {
          if (pos >= frameData.length) {
            throw new Error("Read position is past end of frame buffer");
          }
          encoder.encode(frameData[pos]!);
          pos += offset;
        }
        encoder.flush();
      }

      encoder.makeEvenLength();
      newPixelData.addFrame(encoder.getBuffer());
    }
  }

  decode(oldPixelData: DicomPixelData, newPixelData: DicomPixelData, _parameters: DicomCodecParams | null): void {
    for (let i = 0; i < oldPixelData.numberOfFrames; i++) {
      newPixelData.addFrame(this.decodeFrame(oldPixelData, i));
    }
  }

  private decodeFrame(pixelData: DicomPixelData, frame: number): IByteBuffer {
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

// =============================================================================
// RLEEncoder — PackBits encoder matching fo-dicom's RLEEncoder
// Reference: DicomRleCodecImpl.Mono.cs RLEEncoder inner class
// =============================================================================

class RLEEncoder {
  private _count = 0;
  private readonly _offsets = new Uint32Array(15);
  // _length tracks total stream position from byte 0 (header pre-accounted at 64)
  private _length: number;
  private readonly _dataBytes: number[] = [];
  // Literal run buffer (max 132 bytes per C# reference)
  private readonly _litBuffer = new Uint8Array(132);
  private _prevByte = -1;
  private _repeatCount = 0;
  private _litPos = 0;

  constructor() {
    this._length = 64; // 4 (count) + 15*4 (offsets) = 64 byte header pre-accounted
  }

  nextSegment(): void {
    this.flush();
    if ((this._length & 1) === 1) {
      this._appendByte(0x00);
    }
    this._offsets[this._count++] = this._length;
  }

  encode(b: number): void {
    if (b === this._prevByte) {
      this._repeatCount++;

      if (this._repeatCount > 2 && this._litPos > 0) {
        // Transitioning from literal to run — flush the literal buffer first
        while (this._litPos > 0) {
          const count = Math.min(128, this._litPos);
          this._appendByte(count - 1);
          this._moveLitBuffer(count);
        }
      } else if (this._repeatCount > 128) {
        const count = Math.min(this._repeatCount, 128);
        this._appendByte(257 - count); // PackBits run header: -(count-1) as unsigned byte
        this._appendByte(this._prevByte);
        this._repeatCount -= count;
      }
    } else {
      // Byte changed — emit whatever was accumulated for prevByte
      switch (this._repeatCount) {
        case 0:
          break;
        case 1:
          this._litBuffer[this._litPos++] = this._prevByte;
          break;
        case 2:
          this._litBuffer[this._litPos++] = this._prevByte;
          this._litBuffer[this._litPos++] = this._prevByte;
          break;
        default: {
          let rc = this._repeatCount;
          while (rc > 0) {
            const count = Math.min(rc, 128);
            this._appendByte(257 - count);
            this._appendByte(this._prevByte);
            rc -= count;
          }
          break;
        }
      }

      while (this._litPos > 128) {
        const count = Math.min(128, this._litPos);
        this._appendByte(count - 1);
        this._moveLitBuffer(count);
      }

      this._prevByte = b;
      this._repeatCount = 1;
    }
  }

  flush(): void {
    if (this._repeatCount < 2) {
      while (this._repeatCount > 0) {
        this._litBuffer[this._litPos++] = this._prevByte;
        this._repeatCount--;
      }
    }

    while (this._litPos > 0) {
      const count = Math.min(128, this._litPos);
      this._appendByte(count - 1);
      this._moveLitBuffer(count);
    }

    if (this._repeatCount >= 2) {
      let rc = this._repeatCount;
      while (rc > 0) {
        const count = Math.min(rc, 128);
        this._appendByte(257 - count);
        this._appendByte(this._prevByte);
        rc -= count;
      }
    }

    this._prevByte = -1;
    this._repeatCount = 0;
    this._litPos = 0;
  }

  makeEvenLength(): void {
    if ((this._length & 1) === 1) this._appendByte(0x00);
  }

  getBuffer(): IByteBuffer {
    const out = new Uint8Array(this._length);
    // Write header: segment count + 15 offsets (all LE uint32)
    const view = new DataView(out.buffer);
    view.setUint32(0, this._count, true);
    for (let i = 0; i < 15; i++) {
      view.setUint32(4 + i * 4, this._offsets[i]!, true);
    }
    // Write encoded data after header
    for (let i = 0; i < this._dataBytes.length; i++) {
      out[64 + i] = this._dataBytes[i]!;
    }
    return new MemoryByteBuffer(out);
  }

  private _appendByte(value: number): void {
    this._dataBytes.push(value & 0xff);
    this._length++;
  }

  private _moveLitBuffer(count: number): void {
    for (let i = 0; i < count; i++) {
      this._dataBytes.push(this._litBuffer[i]!);
    }
    this._length += count;
    // Shift remaining bytes to front
    this._litBuffer.copyWithin(0, count, this._litPos);
    this._litPos -= count;
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
