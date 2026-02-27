import { describe, it, expect } from "vitest";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomOtherByte } from "../../src/dataset/DicomElement.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import { DicomRleCodec } from "../../src/imaging/codec/DicomRleCodec.js";

function makeRleFrame(segment: Uint8Array): Uint8Array {
  const headerSize = 64;
  const data = new Uint8Array(headerSize + segment.length);
  const view = new DataView(data.buffer);
  view.setUint32(0, 1, true); // one segment
  view.setUint32(4, headerSize, true); // first offset
  data.set(segment, headerSize);
  return data;
}

describe("DicomRleCodec", () => {
  it("decodes a simple RLE frame", () => {
    const ds = new DicomDataset();
    ds.addOrUpdateElement(DicomVR.US, Tags.Rows, 1);
    ds.addOrUpdateElement(DicomVR.US, Tags.Columns, 4);
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 8);
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, 8);
    ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, 7);
    ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 1);

    const packBits = new Uint8Array([0x03, 1, 2, 3, 4]);
    const frame = makeRleFrame(packBits);
    ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, frame));

    const pixelData = DicomPixelData.create(ds);
    const codec = new DicomRleCodec();
    const decoded = codec.decode(pixelData, 0);
    expect([...decoded.data]).toEqual([1, 2, 3, 4]);
  });
});
