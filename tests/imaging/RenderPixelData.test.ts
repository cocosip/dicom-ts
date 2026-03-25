import { describe, expect, it } from "vitest";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomOtherByte } from "../../src/dataset/DicomElement.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import { ColorPixelData32, PixelDataFactory } from "../../src/imaging/render/PixelData.js";

function makeArgbDataset(data: Uint8Array, planarConfiguration: number): DicomDataset {
  const ds = new DicomDataset();
  ds.addOrUpdateElement(DicomVR.US, Tags.Rows, 1);
  ds.addOrUpdateElement(DicomVR.US, Tags.Columns, 2);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 8);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, 8);
  ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, 7);
  ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 4);
  ds.addOrUpdateElement(DicomVR.US, Tags.PixelRepresentation, 0);
  ds.addOrUpdateElement(DicomVR.CS, Tags.PhotometricInterpretation, "ARGB");
  ds.addOrUpdateElement(DicomVR.US, Tags.PlanarConfiguration, planarConfiguration);
  ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, data));
  return ds;
}

describe("RenderPixelData", () => {
  it("creates and renders interleaved ARGB pixel data", () => {
    const ds = makeArgbDataset(new Uint8Array([
      64, 10, 20, 30,
      192, 40, 50, 60,
    ]), 0);

    const rendered = PixelDataFactory.create(DicomPixelData.create(ds), 0);
    expect(rendered).toBeInstanceOf(ColorPixelData32);
    expect(rendered.components).toBe(4);
    expect(rendered.getPixel(0, 0) >>> 0).toBe(0x400a141e);

    const output = new Int32Array(2);
    rendered.render(null, output);
    expect([...output].map((value) => value >>> 0)).toEqual([
      0x400a141e,
      0xc028323c,
    ]);

    const alpha = rendered.getHistogram(3);
    expect(alpha.count(64)).toBe(1);
    expect(alpha.count(192)).toBe(1);
  });

  it("creates planar ARGB pixel data and preserves alpha in rendered output", () => {
    const ds = makeArgbDataset(new Uint8Array([
      64, 192,
      10, 40,
      20, 50,
      30, 60,
    ]), 1);

    const rendered = PixelDataFactory.create(DicomPixelData.create(ds), 0);
    expect(rendered).toBeInstanceOf(ColorPixelData32);
    expect(rendered.getPixel(1, 0) >>> 0).toBe(0xc028323c);

    const output = new Int32Array(2);
    rendered.render(null, output);
    expect([...output].map((value) => value >>> 0)).toEqual([
      0x400a141e,
      0xc028323c,
    ]);
  });
});
