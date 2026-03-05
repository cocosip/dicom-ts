import { DicomFile } from "../../DicomFile.js";
import { DicomFileMetaInformation } from "../../DicomFileMetaInformation.js";
import { DicomTransferSyntax } from "../../core/DicomTransferSyntax.js";
import { DicomDataset } from "../../dataset/DicomDataset.js";
import { cloneDataset } from "../../dataset/DicomDatasetExtensions.js";
import { DicomOtherByte, DicomOtherWord } from "../../dataset/DicomElement.js";
import { DicomTag } from "../../core/DicomTag.js";
import * as Tags from "../../core/DicomTag.generated.js";
import { DicomVR } from "../../core/DicomVR.js";
import { DicomPixelData } from "../DicomPixelData.js";
import { DicomOverlayData } from "../DicomOverlayData.js";
import { MemoryByteBuffer } from "../../io/buffer/MemoryByteBuffer.js";
import type { IByteBuffer } from "../../io/buffer/IByteBuffer.js";
import type { IDicomTranscoder } from "./IDicomTranscoder.js";
import type { DicomCodecParams } from "./DicomCodecParams.js";
import { TranscoderManager } from "./TranscoderManager.js";

export class DicomTranscoder implements IDicomTranscoder {
  readonly inputSyntax: DicomTransferSyntax;
  readonly inputCodecParams: DicomCodecParams | null;
  readonly outputSyntax: DicomTransferSyntax;
  readonly outputCodecParams: DicomCodecParams | null;

  // Backward-compatible aliases.
  readonly sourceSyntax: DicomTransferSyntax;
  readonly targetSyntax: DicomTransferSyntax;

  constructor(
    inputSyntax: DicomTransferSyntax,
    outputSyntax: DicomTransferSyntax,
    inputCodecParams: DicomCodecParams | null = null,
    outputCodecParams: DicomCodecParams | null = null,
  ) {
    this.inputSyntax = inputSyntax;
    this.outputSyntax = outputSyntax;
    this.inputCodecParams = inputCodecParams;
    this.outputCodecParams = outputCodecParams;

    this.sourceSyntax = inputSyntax;
    this.targetSyntax = outputSyntax;
  }

  static extractOverlays(dataset: DicomDataset): DicomDataset {
    if (!DicomOverlayData.hasEmbeddedOverlays(dataset)) return dataset;

    const output = cloneDataset(dataset);
    let input = output;

    if (input.internalTransferSyntax.isEncapsulated) {
      input = cloneDataset(output);
      const transcoder = new DicomTranscoder(
        input.internalTransferSyntax,
        DicomTransferSyntax.ExplicitVRLittleEndian,
      );
      input = transcoder.transcode(input);
    }

    DicomTranscoder.processOverlays(input, output);
    return output;
  }

  transcode(file: DicomFile): DicomFile;
  transcode(dataset: DicomDataset): DicomDataset;
  transcode(input: DicomFile | DicomDataset): DicomFile | DicomDataset {
    if (input instanceof DicomFile) {
      const output = new DicomFile();
      output.fileMetaInfo = new DicomFileMetaInformation(input.fileMetaInfo);
      output.fileMetaInfo.transferSyntaxUID = this.outputSyntax;
      output.dataset = this.transcode(input.dataset);
      output.dataset.internalTransferSyntax = this.outputSyntax;
      output.format = input.format;
      output.isPartial = input.isPartial;
      return output;
    }

    return this.transcodeDataset(input);
  }

  decodeFrame(dataset: DicomDataset, frame: number): IByteBuffer {
    const pixelData = DicomPixelData.create(dataset);
    if (!dataset.internalTransferSyntax.isEncapsulated) {
      return pixelData.getFrame(frame);
    }

    const sourceSyntax = this.inputSyntax ?? dataset.internalTransferSyntax;
    const codec = TranscoderManager.getCodec(sourceSyntax);

    const oldPixelData = DicomPixelData.create(cloneDataset(dataset));
    const tmp = this.makeOutputDataset(dataset, DicomTransferSyntax.ExplicitVRLittleEndian);
    const newPixelData = DicomPixelData.create(tmp, true);
    codec.decode(oldPixelData, newPixelData, this.inputCodecParams);
    return DicomPixelData.create(tmp).getFrame(frame);
  }

  decodePixelData(dataset: DicomDataset, frame: number): DicomPixelData {
    if (!dataset.internalTransferSyntax.isEncapsulated) {
      return DicomPixelData.create(dataset);
    }

    const decodedFrame = this.decodeFrame(dataset, frame);

    const output = cloneDataset(dataset);
    output.internalTransferSyntax = DicomTransferSyntax.ExplicitVRLittleEndian;
    output.remove(Tags.PixelData);
    const sourcePixelData = DicomPixelData.create(dataset);
    this.writeNativePixelData(output, sourcePixelData.bitsAllocated, [decodedFrame]);
    return DicomPixelData.create(output);
  }

  private transcodeDataset(dataset: DicomDataset): DicomDataset {
    const src = dataset.internalTransferSyntax;
    const source = this.inputSyntax ?? src;
    const target = this.outputSyntax;

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
    const frames: IByteBuffer[] = [];
    for (let i = 0; i < oldPixelData.numberOfFrames; i++) {
      frames.push(oldPixelData.getFrame(i));
    }

    const output = cloneDataset(dataset);
    output.internalTransferSyntax = target;
    this.writeNativePixelData(output, oldPixelData.bitsAllocated, frames);
    DicomTranscoder.processOverlays(dataset, output);
    return output;
  }

  private decompress(
    dataset: DicomDataset,
    source: DicomTransferSyntax,
    target: DicomTransferSyntax
  ): DicomDataset {
    const codec = TranscoderManager.getCodec(source);

    const oldPixelData = DicomPixelData.create(cloneDataset(dataset));
    const output = this.makeOutputDataset(dataset, target);
    const newPixelData = DicomPixelData.create(output, true);

    codec.decode(oldPixelData, newPixelData, this.inputCodecParams);

    DicomTranscoder.processOverlays(dataset, output);
    return output;
  }

  private compress(dataset: DicomDataset, target: DicomTransferSyntax): DicomDataset {
    const codec = TranscoderManager.getCodec(target);

    const oldPixelData = DicomPixelData.create(cloneDataset(dataset));
    const output = this.makeOutputDataset(dataset, target);
    const newPixelData = DicomPixelData.create(output, true);

    codec.encode(oldPixelData, newPixelData, this.outputCodecParams);
    this.applyLossyCompressionMetadataIfNeeded(output, oldPixelData, newPixelData, target);

    DicomTranscoder.processOverlays(dataset, output);
    return output;
  }

  private applyLossyCompressionMetadataIfNeeded(
    output: DicomDataset,
    oldPixelData: DicomPixelData,
    newPixelData: DicomPixelData,
    target: DicomTransferSyntax,
  ): void {
    if (!target.isLossy || newPixelData.numberOfFrames <= 0) {
      return;
    }

    output.addOrUpdateElement(DicomVR.CS, Tags.LossyImageCompression, "01");

    const methods = output.tryGetValues<string>(Tags.LossyImageCompressionMethod) ?? [];
    if (target.lossyCompressionMethod.length > 0) {
      methods.push(target.lossyCompressionMethod);
      output.addOrUpdateElement(DicomVR.CS, Tags.LossyImageCompressionMethod, ...methods);
    }

    const oldFrameSize = oldPixelData.getFrame(0).size;
    const newFrameSize = newPixelData.getFrame(0).size;
    if (oldFrameSize <= 0 || newFrameSize <= 0) {
      return;
    }

    const ratios = output.tryGetValues<string>(Tags.LossyImageCompressionRatio) ?? [];
    ratios.push((oldFrameSize / newFrameSize).toFixed(3));
    output.addOrUpdateElement(DicomVR.DS, Tags.LossyImageCompressionRatio, ...ratios);
  }

  /** Clone dataset, set new transfer syntax, and remove pixel data so codec writes fresh. */
  private makeOutputDataset(dataset: DicomDataset, target: DicomTransferSyntax): DicomDataset {
    const output = cloneDataset(dataset);
    output.internalTransferSyntax = target;
    output.remove(Tags.PixelData);
    return output;
  }

  private writeNativePixelData(dataset: DicomDataset, bitsAllocated: number, frames: IByteBuffer[]): void {
    const merged = new Uint8Array(frames.reduce((n, f) => n + f.size, 0));
    let offset = 0;
    for (const f of frames) {
      merged.set(f.data, offset);
      offset += f.size;
    }
    const buffer = new MemoryByteBuffer(merged);
    const pixelData = bitsAllocated > 8
      ? new DicomOtherWord(Tags.PixelData, buffer)
      : new DicomOtherByte(Tags.PixelData, buffer);
    dataset.addOrUpdate(pixelData);
    dataset.addOrUpdateElement(DicomVR.IS, Tags.NumberOfFrames, String(Math.max(1, frames.length)));
  }

  private static processOverlays(input: DicomDataset, output: DicomDataset): void {
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
