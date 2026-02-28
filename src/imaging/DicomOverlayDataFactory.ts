import { DicomDataset } from "../dataset/DicomDataset.js";
import type { IImage } from "./IImage.js";
import { Color32 } from "./Color32.js";
import { DicomOverlayData, DicomOverlayType } from "./DicomOverlayData.js";
import { DicomTag } from "../core/DicomTag.js";
import { MemoryByteBuffer } from "../io/buffer/MemoryByteBuffer.js";
import { EvenLengthBuffer } from "../io/buffer/EvenLengthBuffer.js";

export class DicomOverlayDataFactory {
  static fromDataset(dataset: DicomDataset): DicomOverlayData[] {
    return DicomOverlayData.fromDataset(dataset);
  }

  static fromBitmap(dataset: DicomDataset, bitmap: IImage, mask: Color32): DicomOverlayData {
    let group = 0x6000;
    while (dataset.contains(new DicomTag(group, 0x0102))) {
      group += 2;
    }

    const overlay = new DicomOverlayData(dataset, group);
    overlay.type = DicomOverlayType.Graphics;
    overlay.rows = bitmap.height;
    overlay.columns = bitmap.width;
    overlay.originX = 1;
    overlay.originY = 1;
    overlay.bitsAllocated = 1;
    overlay.bitPosition = 1;

    const maskBits = new Uint8Array(bitmap.width * bitmap.height);
    const bytesPerPixel = bitmap.bytesPerPixel;
    const pixels = bitmap.pixels;
    const matchR = mask.r & 0xFF;
    const matchG = mask.g & 0xFF;
    const matchB = mask.b & 0xFF;
    const matchA = mask.a & 0xFF;

    for (let y = 0; y < bitmap.height; y++) {
      for (let x = 0; x < bitmap.width; x++) {
        const idx = (y * bitmap.width + x) * bytesPerPixel;
        const r = pixels[idx] ?? 0;
        const g = pixels[idx + 1] ?? 0;
        const b = pixels[idx + 2] ?? 0;
        const a = bytesPerPixel >= 4 ? (pixels[idx + 3] ?? 255) : 255;
        if (r === matchR && g === matchG && b === matchB && a === matchA) {
          maskBits[y * bitmap.width + x] = 1;
        }
      }
    }

    const packed = packBits(maskBits);
    overlay.data = EvenLengthBuffer.create(new MemoryByteBuffer(packed));
    return overlay;
  }
}

function packBits(mask: Uint8Array): Uint8Array {
  const out = new Uint8Array(Math.ceil(mask.length / 8));
  for (let i = 0; i < mask.length; i++) {
    if (mask[i] === 0) continue;
    const byteIndex = i >> 3;
    const bitIndex = i & 7;
    out[byteIndex] = (out[byteIndex] ?? 0) | (1 << bitIndex);
  }
  return out;
}
