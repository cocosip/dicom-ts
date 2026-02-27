import { DicomTransferSyntax } from "../../core/DicomTransferSyntax.js";
import { DicomDataset } from "../../dataset/DicomDataset.js";
import { DicomOtherByte, DicomOtherWord } from "../../dataset/DicomElement.js";
import * as Tags from "../../core/DicomTag.generated.js";
import { CompositeByteBuffer } from "../../io/buffer/CompositeByteBuffer.js";
import { MemoryByteBuffer } from "../../io/buffer/MemoryByteBuffer.js";
import { DicomPixelData } from "../DicomPixelData.js";
import type { IByteBuffer } from "../../io/buffer/IByteBuffer.js";
import type { IDicomTranscoder } from "./IDicomTranscoder.js";
import { TranscoderManager } from "./TranscoderManager.js";

export class DicomTranscoder implements IDicomTranscoder {
  readonly sourceSyntax: DicomTransferSyntax;
  readonly targetSyntax: DicomTransferSyntax;

  constructor(sourceSyntax: DicomTransferSyntax, targetSyntax: DicomTransferSyntax) {
    this.sourceSyntax = sourceSyntax;
    this.targetSyntax = targetSyntax;
  }

  transcode(dataset: DicomDataset): DicomDataset {
    const src = dataset.internalTransferSyntax;
    const source = this.sourceSyntax ?? src;
    const target = this.targetSyntax;

    if (source.isEncapsulated && !target.isEncapsulated) {
      return this.decompress(dataset, source, target);
    }

    if (!source.isEncapsulated && target.isEncapsulated) {
      return this.compress(dataset, target);
    }

    dataset.internalTransferSyntax = target;
    return dataset;
  }

  private decompress(
    dataset: DicomDataset,
    source: DicomTransferSyntax,
    target: DicomTransferSyntax
  ): DicomDataset {
    const codec = TranscoderManager.getCodec(source);
    if (!codec) throw new Error(`No codec registered for ${source.uid.uid}`);

    const pixelData = DicomPixelData.create(dataset);
    const frames: IByteBuffer[] = [];
    for (let i = 0; i < pixelData.numberOfFrames; i++) {
      frames.push(codec.decode(pixelData, i));
    }

    const merged = new CompositeByteBuffer(frames);
    const buffer = new MemoryByteBuffer(merged.data);
    const element = pixelData.bitsAllocated > 8
      ? new DicomOtherWord(Tags.PixelData, buffer)
      : new DicomOtherByte(Tags.PixelData, buffer);
    dataset.addOrUpdate(element);
    dataset.internalTransferSyntax = target;
    return dataset;
  }

  private compress(dataset: DicomDataset, target: DicomTransferSyntax): DicomDataset {
    const codec = TranscoderManager.getCodec(target);
    if (!codec || !codec.encode) {
      throw new Error(`No encoder registered for ${target.uid.uid}`);
    }
    const pixelData = DicomPixelData.create(dataset);
    const frames: IByteBuffer[] = [];
    for (let i = 0; i < pixelData.numberOfFrames; i++) {
      const raw = pixelData.getFrame(i);
      frames.push(codec.encode(pixelData, i, raw));
    }
    // Compressed frames are stored via DicomPixelData.addFrame in encapsulated form.
    dataset.internalTransferSyntax = target;
    const out = new DicomPixelData(dataset);
    for (const frame of frames) out.addFrame(frame);
    return dataset;
  }
}
