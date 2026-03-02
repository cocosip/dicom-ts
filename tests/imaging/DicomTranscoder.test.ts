import { describe, it, expect } from "vitest";
import { DicomFile } from "../../src/DicomFile.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomElement, DicomOtherByte, DicomOtherWord } from "../../src/dataset/DicomElement.js";
import { DicomOtherByteFragment } from "../../src/dataset/DicomFragmentSequence.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { DicomTranscoder } from "../../src/imaging/index.js";
import { DicomTag } from "../../src/core/DicomTag.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { TranscoderManager } from "../../src/imaging/codec/TranscoderManager.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import type { IDicomCodec } from "../../src/imaging/codec/IDicomCodec.js";

function overlayTag(group: number, element: number) {
  return new DicomTag(group, element);
}

describe("DicomTranscoder", () => {
  it("extracts embedded overlays and writes OB for explicit VR", () => {
    const ds = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    ds.addOrUpdateElement(DicomVR.US, Tags.Rows, 2);
    ds.addOrUpdateElement(DicomVR.US, Tags.Columns, 2);
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 16);
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, 8);
    ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, 7);
    ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 1);
    ds.addOrUpdate(new DicomOtherWord(Tags.PixelData, new Uint16Array([0x0100, 0, 0, 0])));

    const group = 0x6000;
    ds.addOrUpdateElement(DicomVR.US, overlayTag(group, 0x0010), 2);
    ds.addOrUpdateElement(DicomVR.US, overlayTag(group, 0x0011), 2);
    ds.addOrUpdateElement(DicomVR.SS, overlayTag(group, 0x0050), 1, 1);
    ds.addOrUpdateElement(DicomVR.CS, overlayTag(group, 0x0040), "G");
    ds.addOrUpdateElement(DicomVR.US, overlayTag(group, 0x0102), 8);
    ds.addOrUpdateElement(DicomVR.US, overlayTag(group, 0x0100), 1);

    const out = DicomTranscoder.extractOverlays(ds);
    expect(out).not.toBe(ds);
    const item = out.getDicomItem<DicomElement>(overlayTag(group, 0x3000));
    expect(item?.valueRepresentation).toBe(DicomVR.OB);
    expect(out.getSingleValue<number>(overlayTag(group, 0x0100))).toBe(16);
  });

  it("writes OW for implicit VR output", () => {
    const ds = new DicomDataset(DicomTransferSyntax.ImplicitVRLittleEndian);
    ds.addOrUpdateElement(DicomVR.US, Tags.Rows, 1);
    ds.addOrUpdateElement(DicomVR.US, Tags.Columns, 2);
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 16);
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, 8);
    ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, 7);
    ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 1);
    ds.addOrUpdate(new DicomOtherWord(Tags.PixelData, new Uint16Array([0x0100, 0x0000])));

    const group = 0x6002;
    ds.addOrUpdateElement(DicomVR.US, overlayTag(group, 0x0010), 1);
    ds.addOrUpdateElement(DicomVR.US, overlayTag(group, 0x0011), 2);
    ds.addOrUpdateElement(DicomVR.SS, overlayTag(group, 0x0050), 1, 1);
    ds.addOrUpdateElement(DicomVR.CS, overlayTag(group, 0x0040), "G");
    ds.addOrUpdateElement(DicomVR.US, overlayTag(group, 0x0102), 8);

    const out = DicomTranscoder.extractOverlays(ds);
    const item = out.getDicomItem<DicomElement>(overlayTag(group, 0x3000));
    expect(item?.valueRepresentation).toBe(DicomVR.OW);
  });

  it("keeps output syntax and extracts overlays for encapsulated input via codec decode", () => {
    const ds = new DicomDataset(DicomTransferSyntax.JPEGProcess1);
    ds.addOrUpdateElement(DicomVR.US, Tags.Rows, 1);
    ds.addOrUpdateElement(DicomVR.US, Tags.Columns, 2);
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 16);
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, 8);
    ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, 7);
    ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 1);
    ds.addOrUpdateElement(DicomVR.IS, Tags.NumberOfFrames, "1");
    const seq = new DicomOtherByteFragment(Tags.PixelData);
    seq.addRaw(new MemoryByteBuffer(new Uint8Array(0)));
    seq.addRaw(new MemoryByteBuffer(new Uint8Array([0xff])));
    ds.addOrUpdate(seq);

    const group = 0x6004;
    ds.addOrUpdateElement(DicomVR.US, overlayTag(group, 0x0010), 1);
    ds.addOrUpdateElement(DicomVR.US, overlayTag(group, 0x0011), 2);
    ds.addOrUpdateElement(DicomVR.SS, overlayTag(group, 0x0050), 1, 1);
    ds.addOrUpdateElement(DicomVR.CS, overlayTag(group, 0x0040), "G");
    ds.addOrUpdateElement(DicomVR.US, overlayTag(group, 0x0102), 8);

    const codec: IDicomCodec = {
      name: "MockJPEG",
      transferSyntax: DicomTransferSyntax.JPEGProcess1,
      getDefaultParameters: () => null,
      encode: () => { throw new Error("Not impl"); },
      decode: (_old, newPixelData) => {
        // Mock decoding: produce 1 frame of 1x2x2 bytes (4 bytes)
        newPixelData.addFrame(new MemoryByteBuffer(new Uint8Array([0x00, 0x01, 0x00, 0x00])));
      }
    };
    TranscoderManager.register(codec);
    try {
      const out = DicomTranscoder.extractOverlays(ds);
      expect(out.internalTransferSyntax).toBe(DicomTransferSyntax.JPEGProcess1);
      const item = out.getDicomItem<DicomElement>(overlayTag(group, 0x3000));
      expect(item?.valueRepresentation).toBe(DicomVR.OB);
      expect([...out.getDicomItem<DicomElement>(overlayTag(group, 0x3000))!.buffer.data]).toEqual([1]);
    } finally {
      TranscoderManager.unregister(DicomTransferSyntax.JPEGProcess1);
    }
  });

  it("transcodes DicomFile and updates file meta transfer syntax", () => {
    const ds = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    ds.addOrUpdateElement(DicomVR.LO, Tags.PatientName, "TranscodeFile");
    const file = new DicomFile(ds);

    const transcoder = new DicomTranscoder(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      DicomTransferSyntax.ImplicitVRLittleEndian,
    );
    const out = transcoder.transcode(file);

    expect(out).toBeInstanceOf(DicomFile);
    expect(out).not.toBe(file);
    expect(out.dataset.internalTransferSyntax).toBe(DicomTransferSyntax.ImplicitVRLittleEndian);
    expect(out.fileMetaInfo.transferSyntaxUID).toBe(DicomTransferSyntax.ImplicitVRLittleEndian);
  });

  it("decodes a compressed frame buffer", () => {
    const ds = new DicomDataset(DicomTransferSyntax.JPEGProcess1);
    ds.addOrUpdateElement(DicomVR.US, Tags.Rows, 1);
    ds.addOrUpdateElement(DicomVR.US, Tags.Columns, 1);
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 8);
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, 8);
    ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, 7);
    ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 1);
    ds.addOrUpdateElement(DicomVR.IS, Tags.NumberOfFrames, "1");
    const seq = new DicomOtherByteFragment(Tags.PixelData);
    seq.addRaw(new MemoryByteBuffer(new Uint8Array(0)));
    seq.addRaw(new MemoryByteBuffer(new Uint8Array([0xff])));
    ds.addOrUpdate(seq);

    const codec: IDicomCodec = {
      name: "MockJPEG",
      transferSyntax: DicomTransferSyntax.JPEGProcess1,
      getDefaultParameters: () => null,
      encode: () => { throw new Error("Not impl"); },
      decode: (_old, newPixelData) => {
        newPixelData.addFrame(new MemoryByteBuffer(new Uint8Array([7])));
      }
    };
    TranscoderManager.register(codec);
    try {
      const transcoder = new DicomTranscoder(
        DicomTransferSyntax.JPEGProcess1,
        DicomTransferSyntax.ExplicitVRLittleEndian,
      );
      const frame = transcoder.decodeFrame(ds, 0);
      expect([...frame.data]).toEqual([7]);
    } finally {
      TranscoderManager.unregister(DicomTransferSyntax.JPEGProcess1);
    }
  });

  it("decodes compressed pixel data into a single native frame", () => {
    const ds = new DicomDataset(DicomTransferSyntax.JPEGProcess1);
    ds.addOrUpdateElement(DicomVR.US, Tags.Rows, 1);
    ds.addOrUpdateElement(DicomVR.US, Tags.Columns, 1);
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 8);
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, 8);
    ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, 7);
    ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 1);
    ds.addOrUpdateElement(DicomVR.IS, Tags.NumberOfFrames, "2");
    const seq = new DicomOtherByteFragment(Tags.PixelData);
    seq.addRaw(new MemoryByteBuffer(new Uint8Array(0)));
    seq.addRaw(new MemoryByteBuffer(new Uint8Array([0xaa])));
    seq.addRaw(new MemoryByteBuffer(new Uint8Array([0xbb])));
    ds.addOrUpdate(seq);

    const codec: IDicomCodec = {
      name: "MockJPEG",
      transferSyntax: DicomTransferSyntax.JPEGProcess1,
      getDefaultParameters: () => null,
      encode: () => { throw new Error("Not impl"); },
      decode: (oldPixelData, newPixelData) => {
        // decode all frames
        for(let i=0; i<oldPixelData.numberOfFrames; i++) {
           newPixelData.addFrame(new MemoryByteBuffer(new Uint8Array([i + 1])));
        }
      }
    };
    TranscoderManager.register(codec);
    try {
      const transcoder = new DicomTranscoder(
        DicomTransferSyntax.JPEGProcess1,
        DicomTransferSyntax.ExplicitVRLittleEndian,
      );
      // decodePixelData with frame index only decodes that specific frame if supported, 
      // but here our mock codec decodes everything or we need to check how Transcoder calls it.
      // DicomTranscoder.decodeFrame calls codec.decode(oldPixelData, newPixelData).
      // If codec.decode processes all frames, then newPixelData will have all frames.
      // But DicomTranscoder.decodeFrame returns newPixelData.getFrame(frame).
      // Wait, DicomTranscoder.decodeFrame logic:
      // const tmp = this.makeOutputDataset...
      // const newPixelData = DicomPixelData.create(tmp, true);
      // codec.decode(oldPixelData, newPixelData, ...);
      // return DicomPixelData.create(tmp).getFrame(frame);
      
      // If our mock codec adds frames sequentially, and we ask for frame 1,
      // we need to make sure frame 1 is present in the output.
      
      const decoded = transcoder.decodePixelData(ds, 1);
      // decodePixelData returns a DicomPixelData wrapping a dataset that contains ONLY the requested frame (as per implementation usually? No).
      // Let's look at decodePixelData implementation again.
      // const decodedFrame = this.decodeFrame(dataset, frame);
      // const output = cloneDataset...
      // this.writeNativePixelData(output, ..., [decodedFrame]);
      // return DicomPixelData.create(output);
      
      // So decodePixelData returns a DicomPixelData with ONLY 1 frame (the decoded one).
      // So expect(decoded.numberOfFrames).toBe(1);
      // And getFrame(0) of this new dataset should be the data.
      
      expect(decoded.isEncapsulated).toBe(false);
      expect(decoded.numberOfFrames).toBe(1);
      expect([...decoded.getFrame(0).data]).toEqual([2]);
      // The original dataset should be untouched
      expect(ds.internalTransferSyntax).toBe(DicomTransferSyntax.JPEGProcess1);
    } finally {
      TranscoderManager.unregister(DicomTransferSyntax.JPEGProcess1);
    }
  });
});
