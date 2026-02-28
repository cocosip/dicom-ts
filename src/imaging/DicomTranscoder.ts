import { DicomDataset } from "../dataset/DicomDataset.js";
import { cloneDataset } from "../dataset/DicomDatasetExtensions.js";
import { DicomOverlayData } from "./DicomOverlayData.js";
import { DicomTag } from "../core/DicomTag.js";
import * as Tags from "../core/DicomTag.generated.js";
import { DicomVR } from "../core/DicomVR.js";
import { DicomTransferSyntax } from "../core/DicomTransferSyntax.js";
import { DicomOtherWord } from "../dataset/DicomElement.js";
import { DicomOtherByte } from "../dataset/DicomElement.js";
import { DicomTranscoder as CodecDicomTranscoder } from "./codec/DicomTranscoder.js";

export class DicomTranscoder {
  static extractOverlays(dataset: DicomDataset): DicomDataset {
    if (!DicomOverlayData.hasEmbeddedOverlays(dataset)) return dataset;

    const output = cloneDataset(dataset);
    let input = output;

    if (input.internalTransferSyntax.isEncapsulated) {
      input = cloneDataset(output);
      const transcoder = new CodecDicomTranscoder(
        input.internalTransferSyntax,
        DicomTransferSyntax.ExplicitVRLittleEndian,
      );
      input = transcoder.transcode(input);
    }

    DicomTranscoder.processOverlays(input, output);
    return output;
  }

  private static processOverlays(input: DicomDataset, output: DicomDataset): void {
    const source = input.internalTransferSyntax.isEncapsulated ? output : input;
    const overlays = DicomOverlayData.fromDataset(source);

    for (const overlay of overlays) {
      const dataTag = new DicomTag(overlay.group, 0x3000);
      if (output.contains(dataTag)) continue;

      const bitsAlloc = output.getSingleValueOrDefault<number>(Tags.BitsAllocated, 0);
      output.addOrUpdateElement(DicomVR.US, new DicomTag(overlay.group, 0x0100), bitsAlloc);

      const buffer = overlay.data;
      if (output.internalTransferSyntax.isExplicitVR) {
        output.addOrUpdate(new DicomOtherByte(dataTag, buffer));
      } else {
        output.addOrUpdate(new DicomOtherWord(dataTag, buffer));
      }
    }
  }
}
