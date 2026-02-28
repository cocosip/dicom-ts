import { describe, it, expect } from "vitest";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomSequence } from "../../src/dataset/DicomSequence.js";
import { DicomCodeString, DicomOtherByte, DicomUnsignedShort } from "../../src/dataset/DicomElement.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { DicomIconImage } from "../../src/imaging/DicomIconImage.js";
import { RawImage } from "../../src/imaging/RawImage.js";

function createMonochromeIconItem(): DicomDataset {
  const ds = new DicomDataset();
  ds.addOrUpdate(new DicomUnsignedShort(Tags.Rows, 1));
  ds.addOrUpdate(new DicomUnsignedShort(Tags.Columns, 2));
  ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsAllocated, 8));
  ds.addOrUpdate(new DicomUnsignedShort(Tags.BitsStored, 8));
  ds.addOrUpdate(new DicomUnsignedShort(Tags.HighBit, 7));
  ds.addOrUpdate(new DicomUnsignedShort(Tags.SamplesPerPixel, 1));
  ds.addOrUpdate(new DicomCodeString(Tags.PhotometricInterpretation, "MONOCHROME2"));
  ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, new Uint8Array([0, 255])));
  return ds;
}

describe("DicomIconImage", () => {
  it("extracts and renders icon image from IconImageSequence", () => {
    const iconItem = createMonochromeIconItem();
    const outer = new DicomDataset();
    outer.addOrUpdate(new DicomSequence(Tags.IconImageSequence, iconItem));

    const icon = DicomIconImage.tryCreate(outer);
    expect(icon).not.toBeNull();
    expect(icon?.width).toBe(2);
    expect(icon?.height).toBe(1);

    const rendered = icon?.renderImage();
    expect(rendered).toBeInstanceOf(RawImage);
    const raw = rendered as RawImage;
    expect(raw.pixels[0]).toBe(0);
    expect(raw.pixels[4]).toBe(255);
  });

  it("returns null when icon sequence is invalid", () => {
    const invalidIcon = createMonochromeIconItem();
    invalidIcon.addOrUpdate(new DicomCodeString(Tags.PhotometricInterpretation, "RGB"));

    const outer = new DicomDataset();
    outer.addOrUpdate(new DicomSequence(Tags.IconImageSequence, invalidIcon));

    expect(DicomIconImage.tryCreate(outer)).toBeNull();
  });
});
