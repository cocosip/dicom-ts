import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomOverlayData } from "./DicomOverlayData.js";
import { DicomTag } from "../core/DicomTag.js";
import { DicomVR } from "../core/DicomVR.js";
import { DicomOtherWord } from "../dataset/DicomElement.js";
import { DicomOtherByte } from "../dataset/DicomElement.js";
import { MemoryByteBuffer } from "../io/buffer/MemoryByteBuffer.js";
import { EvenLengthBuffer } from "../io/buffer/EvenLengthBuffer.js";
import { DicomPixelData } from "./DicomPixelData.js";

export class DicomTranscoder {
  static extractOverlays(dataset: DicomDataset): DicomDataset {
    if (!DicomOverlayData.hasEmbeddedOverlays(dataset)) return dataset;

    // clone dataset shallowly by copying items
    const output = new DicomDataset(dataset.internalTransferSyntax);
    for (const item of dataset) output.addOrUpdate(item);

    DicomTranscoder.processOverlays(dataset, output);
    return output;
  }

  private static processOverlays(input: DicomDataset, output: DicomDataset): void {
    const source = input.internalTransferSyntax.isEncapsulated ? output : input;
    const overlays = DicomOverlayData.fromDataset(source);
    const pixelData = DicomPixelData.create(source);

    for (const overlay of overlays) {
      const dataTag = new DicomTag(overlay.group, 0x3000);
      if (source.contains(dataTag)) continue;

      const bitsAlloc = pixelData.bitsAllocated;
      output.addOrUpdateElement(DicomVR.US, new DicomTag(overlay.group, 0x0100), bitsAlloc);

      // Sanity check: do not extract overlay if within used pixel range.
      if (overlay.bitPosition <= pixelData.highBit && overlay.bitPosition > pixelData.highBit - pixelData.bitsStored) {
        continue;
      }

      const buffer = overlay.data;
      const even = EvenLengthBuffer.create(buffer);
      if (bitsAlloc > 8) {
        output.addOrUpdate(new DicomOtherWord(dataTag, even));
      } else {
        output.addOrUpdate(new DicomOtherByte(dataTag, even));
      }
    }
  }
}
