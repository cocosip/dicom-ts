import { describe, it, expect } from "vitest";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomUnsignedShort, DicomCodeString, DicomOtherByte } from "../../src/dataset/DicomElement.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { DicomTag } from "../../src/core/DicomTag.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import { DicomImage } from "../../src/imaging/DicomImage.js";
import { RawImage } from "../../src/imaging/RawImage.js";

function baseImageDataset(): DicomDataset {
  const ds = new DicomDataset();
  ds.addOrUpdate(new DicomUnsignedShort(Tags.Rows, 1));
  ds.addOrUpdate(new DicomUnsignedShort(Tags.Columns, 2));
  ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 8));
  ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsStored, 8));
  ds.addOrUpdate(new DicomUnsignedShort(Tags.HighBit, 7));
  ds.addOrUpdate(new DicomUnsignedShort(Tags.SamplesPerPixel, 1));
  return ds;
}

describe("DicomImage", () => {
  it("renders monochrome image with default window", () => {
    const ds = baseImageDataset();
    ds.addOrUpdate(new DicomCodeString(Tags.PhotometricInterpretation, "MONOCHROME2"));
    ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, new Uint8Array([0, 255])));

    const image = new DicomImage(ds).renderImage(0);
    expect(image).toBeInstanceOf(RawImage);
    const pixels = (image as RawImage).pixels;
    expect(pixels[0]).toBe(0);
    expect(pixels[4]).toBe(255);
  });

  it("renders RGB image", () => {
    const ds = new DicomDataset();
    ds.addOrUpdate(new DicomUnsignedShort(Tags.Rows, 1));
    ds.addOrUpdate(new DicomUnsignedShort(Tags.Columns, 1));
    ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 8));
    ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsStored, 8));
    ds.addOrUpdate(new DicomUnsignedShort(Tags.HighBit, 7));
    ds.addOrUpdate(new DicomUnsignedShort(Tags.SamplesPerPixel, 3));
    ds.addOrUpdate(new DicomCodeString(Tags.PhotometricInterpretation, "RGB"));
    ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, new Uint8Array([10, 20, 30])));

    const image = new DicomImage(ds).renderImage(0) as RawImage;
    expect(image.pixels[0]).toBe(10);
    expect(image.pixels[1]).toBe(20);
    expect(image.pixels[2]).toBe(30);
    expect(image.pixels[3]).toBe(255);
  });

  it("applies overlays when enabled", () => {
    const ds = new DicomDataset();
    ds.addOrUpdate(new DicomUnsignedShort(Tags.Rows, 2));
    ds.addOrUpdate(new DicomUnsignedShort(Tags.Columns, 2));
    ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 8));
    ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsStored, 8));
    ds.addOrUpdate(new DicomUnsignedShort(Tags.HighBit, 7));
    ds.addOrUpdate(new DicomUnsignedShort(Tags.SamplesPerPixel, 1));
    ds.addOrUpdate(new DicomCodeString(Tags.PhotometricInterpretation, "MONOCHROME2"));
    ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, new Uint8Array([0, 0, 0, 0])));

    const group = 0x6000;
    const tag = (element: number) => new DicomTag(group, element);
    ds.addOrUpdateElement(DicomVR.US, tag(0x0010), 2); // Overlay Rows
    ds.addOrUpdateElement(DicomVR.US, tag(0x0011), 2); // Overlay Columns
    ds.addOrUpdateElement(DicomVR.SS, tag(0x0050), 1, 1); // Overlay Origin
    ds.addOrUpdateElement(DicomVR.CS, tag(0x0040), "G"); // Overlay Type
    ds.addOrUpdateElement(DicomVR.US, tag(0x0100), 1); // BitsAllocated
    ds.addOrUpdateElement(DicomVR.US, tag(0x0102), 0); // BitPosition
    ds.addOrUpdate(new DicomOtherByte(tag(0x3000), new Uint8Array([0b00000001])));

    const image = new DicomImage(ds).renderImage(0) as RawImage;
    expect(image.pixels[0]).toBe(255); // R
    expect(image.pixels[1]).toBe(0);   // G
    expect(image.pixels[2]).toBe(0);   // B
  });
});
