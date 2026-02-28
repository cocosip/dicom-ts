import { describe, it, expect } from "vitest";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomTag } from "../../src/core/DicomTag.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { DicomOtherByte, DicomElement } from "../../src/dataset/DicomElement.js";
import { DicomOtherByteFragment } from "../../src/dataset/DicomFragmentSequence.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import type { IDicomCodec } from "../../src/imaging/codec/IDicomCodec.js";
import { DicomTranscoder as CodecDicomTranscoder } from "../../src/imaging/codec/DicomTranscoder.js";
import { TranscoderManager } from "../../src/imaging/codec/TranscoderManager.js";

function overlayTag(group: number, element: number): DicomTag {
  return new DicomTag(group, element);
}

function buildImageDataset(
  syntax: DicomTransferSyntax,
  bitsAllocated: number = 8
): DicomDataset {
  const ds = new DicomDataset(syntax);
  ds.addOrUpdateElement(DicomVR.US, Tags.Rows, 1);
  ds.addOrUpdateElement(DicomVR.US, Tags.Columns, 2);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, bitsAllocated);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, 8);
  ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, 7);
  ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 1);
  ds.addOrUpdateElement(DicomVR.CS, Tags.PhotometricInterpretation, "MONOCHROME2");
  return ds;
}

describe("codec/DicomTranscoder", () => {
  it("clones dataset without pixel data and updates transfer syntax", () => {
    const ds = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    ds.addOrUpdateElement(DicomVR.LO, Tags.PatientName, "NoPixel");

    const transcoder = new CodecDicomTranscoder(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      DicomTransferSyntax.ImplicitVRLittleEndian,
    );
    const out = transcoder.transcode(ds);

    expect(out).not.toBe(ds);
    expect(out.internalTransferSyntax).toBe(DicomTransferSyntax.ImplicitVRLittleEndian);
    expect(ds.internalTransferSyntax).toBe(DicomTransferSyntax.ExplicitVRLittleEndian);
  });

  it("transcodes encapsulated to encapsulated via decode+encode codecs", () => {
    const ds = buildImageDataset(DicomTransferSyntax.JPEGProcess1, 8);
    ds.addOrUpdateElement(DicomVR.IS, Tags.NumberOfFrames, "1");
    const seq = new DicomOtherByteFragment(Tags.PixelData);
    seq.addRaw(new MemoryByteBuffer(new Uint8Array(0)));
    seq.addRaw(new MemoryByteBuffer(new Uint8Array([0xaa, 0xbb])));
    ds.addOrUpdate(seq);

    let decodeCalls = 0;
    let encodeCalls = 0;
    const sourceCodec: IDicomCodec = {
      transferSyntax: DicomTransferSyntax.JPEGProcess1,
      decode: () => {
        decodeCalls++;
        return new MemoryByteBuffer(new Uint8Array([1, 2]));
      },
    };
    const targetCodec: IDicomCodec = {
      transferSyntax: DicomTransferSyntax.RLELossless,
      decode: () => new MemoryByteBuffer(new Uint8Array(0)),
      encode: () => {
        encodeCalls++;
        return new MemoryByteBuffer(new Uint8Array([9, 8]));
      },
    };
    TranscoderManager.register(sourceCodec);
    TranscoderManager.register(targetCodec);
    try {
      const transcoder = new CodecDicomTranscoder(
        DicomTransferSyntax.JPEGProcess1,
        DicomTransferSyntax.RLELossless,
      );
      const out = transcoder.transcode(ds);

      expect(out).not.toBe(ds);
      expect(out.internalTransferSyntax).toBe(DicomTransferSyntax.RLELossless);
      expect(decodeCalls).toBe(1);
      expect(encodeCalls).toBe(1);
      expect([...DicomPixelData.create(out).getFrame(0).data]).toEqual([9, 8]);
    } finally {
      TranscoderManager.unregister(DicomTransferSyntax.JPEGProcess1);
      TranscoderManager.unregister(DicomTransferSyntax.RLELossless);
    }
  });

  it("transcodes uncompressed to uncompressed and extracts embedded overlays with output VR rules", () => {
    const ds = buildImageDataset(DicomTransferSyntax.ExplicitVRLittleEndian, 16);
    ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, new Uint8Array([0x00, 0x01, 0x00, 0x00])));

    const group = 0x6000;
    ds.addOrUpdateElement(DicomVR.US, overlayTag(group, 0x0010), 1);
    ds.addOrUpdateElement(DicomVR.US, overlayTag(group, 0x0011), 2);
    ds.addOrUpdateElement(DicomVR.SS, overlayTag(group, 0x0050), 1, 1);
    ds.addOrUpdateElement(DicomVR.CS, overlayTag(group, 0x0040), "G");
    ds.addOrUpdateElement(DicomVR.US, overlayTag(group, 0x0102), 8);

    const transcoder = new CodecDicomTranscoder(
      DicomTransferSyntax.ExplicitVRLittleEndian,
      DicomTransferSyntax.ImplicitVRLittleEndian,
    );
    const out = transcoder.transcode(ds);

    expect(out).not.toBe(ds);
    expect(out.internalTransferSyntax).toBe(DicomTransferSyntax.ImplicitVRLittleEndian);
    expect(ds.contains(overlayTag(group, 0x3000))).toBe(false);
    const overlayData = out.getDicomItem<DicomElement>(overlayTag(group, 0x3000));
    expect(overlayData?.valueRepresentation).toBe(DicomVR.OW);
  });
});
