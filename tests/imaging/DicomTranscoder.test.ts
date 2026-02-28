import { describe, it, expect } from "vitest";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomElement, DicomOtherByte, DicomOtherWord } from "../../src/dataset/DicomElement.js";
import { DicomOtherByteFragment } from "../../src/dataset/DicomFragmentSequence.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { DicomImagingTranscoder } from "../../src/imaging/index.js";
import { DicomTag } from "../../src/core/DicomTag.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { TranscoderManager } from "../../src/imaging/codec/TranscoderManager.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import type { IDicomCodec } from "../../src/imaging/codec/IDicomCodec.js";

function overlayTag(group: number, element: number) {
  return new DicomTag(group, element);
}

describe("DicomImagingTranscoder", () => {
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

    const out = DicomImagingTranscoder.extractOverlays(ds);
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

    const out = DicomImagingTranscoder.extractOverlays(ds);
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
      transferSyntax: DicomTransferSyntax.JPEGProcess1,
      decode: () => new MemoryByteBuffer(new Uint8Array([0x00, 0x01, 0x00, 0x00])),
    };
    TranscoderManager.register(codec);
    try {
      const out = DicomImagingTranscoder.extractOverlays(ds);
      expect(out.internalTransferSyntax).toBe(DicomTransferSyntax.JPEGProcess1);
      const item = out.getDicomItem<DicomElement>(overlayTag(group, 0x3000));
      expect(item?.valueRepresentation).toBe(DicomVR.OB);
      expect([...out.getDicomItem<DicomElement>(overlayTag(group, 0x3000))!.buffer.data]).toEqual([1]);
    } finally {
      TranscoderManager.unregister(DicomTransferSyntax.JPEGProcess1);
    }
  });
});
