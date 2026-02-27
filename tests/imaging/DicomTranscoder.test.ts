import { describe, it, expect } from "vitest";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomOtherByte } from "../../src/dataset/DicomElement.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { DicomImagingTranscoder } from "../../src/imaging/index.js";
import { DicomTag } from "../../src/core/DicomTag.js";

function overlayTag(group: number, element: number) {
  return new DicomTag(group, element);
}

describe("DicomImagingTranscoder", () => {
  it("extracts embedded overlays", () => {
    const ds = new DicomDataset();
    ds.addOrUpdateElement(DicomVR.US, Tags.Rows, 2);
    ds.addOrUpdateElement(DicomVR.US, Tags.Columns, 2);
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 8);
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, 8);
    ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, 7);
    ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 1);
    ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, new Uint8Array([2, 0, 0, 0])));

    const group = 0x6000;
    ds.addOrUpdateElement(DicomVR.US, overlayTag(group, 0x0010), 2);
    ds.addOrUpdateElement(DicomVR.US, overlayTag(group, 0x0011), 2);
    ds.addOrUpdateElement(DicomVR.SS, overlayTag(group, 0x0050), 1, 1);
    ds.addOrUpdateElement(DicomVR.CS, overlayTag(group, 0x0040), "G");
    ds.addOrUpdateElement(DicomVR.US, overlayTag(group, 0x0102), 8);

    const out = DicomImagingTranscoder.extractOverlays(ds);
    expect(out.contains(overlayTag(group, 0x3000))).toBe(true);
  });
});
