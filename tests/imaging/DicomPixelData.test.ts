import { describe, it, expect } from "vitest";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomUnsignedShort, DicomIntegerString, DicomOtherByte } from "../../src/dataset/DicomElement.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import { DicomOtherByteFragment } from "../../src/dataset/DicomFragmentSequence.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";

function baseDataset(): DicomDataset {
  const ds = new DicomDataset();
  ds.addOrUpdate(new DicomUnsignedShort(Tags.Rows, 2));
  ds.addOrUpdate(new DicomUnsignedShort(Tags.Columns, 2));
  ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 8));
  ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsStored, 8));
  ds.addOrUpdate(new DicomUnsignedShort(Tags.HighBit, 7));
  ds.addOrUpdate(new DicomUnsignedShort(Tags.SamplesPerPixel, 1));
  return ds;
}

describe("DicomPixelData", () => {
  it("extracts uncompressed single frame", () => {
    const ds = baseDataset();
    ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, new Uint8Array([1, 2, 3, 4])));

    const pixel = DicomPixelData.create(ds);
    const frame = pixel.getFrame(0).data;
    expect([...frame]).toEqual([1, 2, 3, 4]);
  });

  it("extracts uncompressed multi-frame", () => {
    const ds = baseDataset();
    ds.addOrUpdate(new DicomIntegerString(Tags.NumberOfFrames, "2"));
    ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])));

    const pixel = DicomPixelData.create(ds);
    const frame1 = pixel.getFrame(1).data;
    expect([...frame1]).toEqual([5, 6, 7, 8]);
  });

  it("extracts encapsulated frames via offset table", () => {
    const ds = baseDataset();
    ds.internalTransferSyntax = DicomTransferSyntax.RLELossless;
    ds.addOrUpdate(new DicomIntegerString(Tags.NumberOfFrames, "2"));

    const seq = new DicomOtherByteFragment(Tags.PixelData);
    const offsets = new Uint8Array(8);
    const view = new DataView(offsets.buffer);
    view.setUint32(0, 0, true);
    view.setUint32(4, 4, true);
    seq.addRaw(new MemoryByteBuffer(offsets));
    seq.addRaw(new MemoryByteBuffer(new Uint8Array([1, 2, 3, 4])));
    seq.addRaw(new MemoryByteBuffer(new Uint8Array([5, 6, 7, 8])));
    ds.addOrUpdate(seq);

    const pixel = DicomPixelData.create(ds);
    expect([...pixel.getFrame(0).data]).toEqual([1, 2, 3, 4]);
    expect([...pixel.getFrame(1).data]).toEqual([5, 6, 7, 8]);
  });
});
