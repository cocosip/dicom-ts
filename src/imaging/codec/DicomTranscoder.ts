import { DicomTransferSyntax } from "../../core/DicomTransferSyntax.js";
import { DicomDataset } from "../../dataset/DicomDataset.js";
import { cloneDataset } from "../../dataset/DicomDatasetExtensions.js";
import { DicomOtherByte, DicomOtherWord } from "../../dataset/DicomElement.js";
import { DicomOtherByteFragment, DicomOtherWordFragment } from "../../dataset/DicomFragmentSequence.js";
import { DicomTag } from "../../core/DicomTag.js";
import * as Tags from "../../core/DicomTag.generated.js";
import { DicomVR } from "../../core/DicomVR.js";
import { CompositeByteBuffer } from "../../io/buffer/CompositeByteBuffer.js";
import { MemoryByteBuffer } from "../../io/buffer/MemoryByteBuffer.js";
import { DicomPixelData } from "../DicomPixelData.js";
import { DicomOverlayData } from "../DicomOverlayData.js";
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

    if (!dataset.contains(Tags.PixelData)) {
      const cloned = cloneDataset(dataset);
      cloned.internalTransferSyntax = target;
      return cloned;
    }

    if (!source.isEncapsulated && !target.isEncapsulated) {
      return this.transcodeUncompressedToUncompressed(dataset, target);
    }

    if (source.isEncapsulated && target.isEncapsulated) {
      const decoded = this.decompress(dataset, source, DicomTransferSyntax.ExplicitVRLittleEndian);
      return this.compress(decoded, target);
    }

    if (source.isEncapsulated && !target.isEncapsulated) {
      return this.decompress(dataset, source, target);
    }

    if (!source.isEncapsulated && target.isEncapsulated) {
      return this.compress(dataset, target);
    }

    throw new Error(`Unable to transcode from ${source.uid.uid} to ${target.uid.uid}`);
  }

  private transcodeUncompressedToUncompressed(
    dataset: DicomDataset,
    target: DicomTransferSyntax
  ): DicomDataset {
    const oldPixelData = DicomPixelData.create(dataset);
    const frames = this.collectFrames(oldPixelData);

    const output = cloneDataset(dataset);
    output.internalTransferSyntax = target;
    this.writeNativePixelData(output, oldPixelData.bitsAllocated, frames);
    this.processOverlays(dataset, output);
    return output;
  }

  private decompress(
    dataset: DicomDataset,
    source: DicomTransferSyntax,
    target: DicomTransferSyntax
  ): DicomDataset {
    const codec = TranscoderManager.getCodec(source);
    if (!codec) throw new Error(`No codec registered for ${source.uid.uid}`);

    const sourceDataset = cloneDataset(dataset);
    const pixelData = DicomPixelData.create(sourceDataset);
    const frames: IByteBuffer[] = [];
    for (let i = 0; i < pixelData.numberOfFrames; i++) {
      frames.push(codec.decode(pixelData, i));
    }

    const output = cloneDataset(dataset);
    output.internalTransferSyntax = target;
    this.writeNativePixelData(output, pixelData.bitsAllocated, frames);
    this.processOverlays(dataset, output);
    return output;
  }

  private compress(dataset: DicomDataset, target: DicomTransferSyntax): DicomDataset {
    const codec = TranscoderManager.getCodec(target);
    if (!codec || !codec.encode) {
      throw new Error(`No encoder registered for ${target.uid.uid}`);
    }

    const sourceDataset = cloneDataset(dataset);
    const pixelData = DicomPixelData.create(sourceDataset);
    const frames: IByteBuffer[] = [];
    for (let i = 0; i < pixelData.numberOfFrames; i++) {
      const raw = pixelData.getFrame(i);
      frames.push(codec.encode(pixelData, i, raw));
    }

    const output = cloneDataset(dataset);
    output.internalTransferSyntax = target;
    this.writeEncapsulatedPixelData(output, pixelData.bitsAllocated, frames);
    this.processOverlays(dataset, output);
    return output;
  }

  private collectFrames(pixelData: DicomPixelData): IByteBuffer[] {
    const frames: IByteBuffer[] = [];
    for (let i = 0; i < pixelData.numberOfFrames; i++) {
      frames.push(pixelData.getFrame(i));
    }
    return frames;
  }

  private writeNativePixelData(dataset: DicomDataset, bitsAllocated: number, frames: IByteBuffer[]): void {
    const merged = new CompositeByteBuffer(frames);
    const buffer = new MemoryByteBuffer(merged.data);
    const pixelData = bitsAllocated > 8
      ? new DicomOtherWord(Tags.PixelData, buffer)
      : new DicomOtherByte(Tags.PixelData, buffer);
    dataset.addOrUpdate(pixelData);
    dataset.addOrUpdateElement(DicomVR.IS, Tags.NumberOfFrames, String(Math.max(1, frames.length)));
  }

  private writeEncapsulatedPixelData(dataset: DicomDataset, bitsAllocated: number, frames: IByteBuffer[]): void {
    const sequence = bitsAllocated > 8
      ? new DicomOtherWordFragment(Tags.PixelData)
      : new DicomOtherByteFragment(Tags.PixelData);
    sequence.addRaw(new MemoryByteBuffer(new Uint8Array(0)));
    for (const frame of frames) {
      sequence.addRaw(frame);
    }
    dataset.addOrUpdate(sequence);
    dataset.addOrUpdateElement(DicomVR.IS, Tags.NumberOfFrames, String(Math.max(1, frames.length)));
  }

  private processOverlays(input: DicomDataset, output: DicomDataset): void {
    const overlays = DicomOverlayData.fromDataset(input.internalTransferSyntax.isEncapsulated ? output : input);

    for (const overlay of overlays) {
      const dataTag = new DicomTag(overlay.group, 0x3000);
      if (output.contains(dataTag)) continue;

      const bitsAlloc = output.getSingleValueOrDefault<number>(Tags.BitsAllocated, 0);
      output.addOrUpdateElement(DicomVR.US, new DicomTag(overlay.group, 0x0100), bitsAlloc);

      const data = overlay.data;
      if (output.internalTransferSyntax.isExplicitVR) {
        output.addOrUpdate(new DicomOtherByte(dataTag, data));
      } else {
        output.addOrUpdate(new DicomOtherWord(dataTag, data));
      }
    }
  }
}
