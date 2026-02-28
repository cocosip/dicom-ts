import { describe, it, expect } from "vitest";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomOtherByte } from "../../src/dataset/DicomElement.js";
import { DicomTag } from "../../src/core/DicomTag.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import { DicomOverlayDataFactory } from "../../src/imaging/DicomOverlayDataFactory.js";
import { DicomOverlayData, DicomOverlayType } from "../../src/imaging/DicomOverlayData.js";
import { RawImage } from "../../src/imaging/RawImage.js";
import { Color32 } from "../../src/imaging/Color32.js";
import * as Tags from "../../src/core/DicomTag.generated.js";

const GROUP = 0x6000;

function tag(element: number): DicomTag {
  return new DicomTag(GROUP, element);
}

describe("DicomOverlayData", () => {
  it("constructor group transfers description", () => {
    const ds = new DicomDataset();
    const overlay = new DicomOverlayData(ds, 0x6002);
    overlay.description = "Description 6002";
    expect(ds.getString(new DicomTag(0x6002, 0x0022))).toBe("Description 6002");
  });

  it("constructor group transfers subtype", () => {
    const ds = new DicomDataset();
    const overlay = new DicomOverlayData(ds, 0x6005);
    overlay.subtype = "Subtype 6005";
    expect(ds.getString(new DicomTag(0x6005, 0x0045))).toBe("Subtype 6005");
  });

  it("constructor group transfers label", () => {
    const ds = new DicomDataset();
    const overlay = new DicomOverlayData(ds, 0x6003);
    overlay.label = "Label 6003";
    expect(ds.getString(new DicomTag(0x6003, 0x1500))).toBe("Label 6003");
  });

  it("overlay type setter graphics writes G", () => {
    const ds = new DicomDataset();
    const overlay = new DicomOverlayData(ds, 0x6011);
    overlay.type = DicomOverlayType.Graphics;
    expect(ds.getString(new DicomTag(0x6011, 0x0040))).toBe("G");
  });

  it("overlay type setter ROI writes R", () => {
    const ds = new DicomDataset();
    const overlay = new DicomOverlayData(ds, 0x6011);
    overlay.type = DicomOverlayType.ROI;
    expect(ds.getString(new DicomTag(0x6011, 0x0040))).toBe("R");
  });

  it("overlay type getter throws when not set", () => {
    const ds = new DicomDataset();
    const overlay = new DicomOverlayData(ds, 0x6008);
    expect(() => overlay.type).toThrow();
  });

  it("overlay type getter returns graphics", () => {
    const ds = new DicomDataset();
    const overlay = new DicomOverlayData(ds, 0x6012);
    ds.addOrUpdateElement(DicomVR.CS, new DicomTag(0x6012, 0x0040), "G");
    expect(overlay.type).toBe(DicomOverlayType.Graphics);
  });

  it("overlay type getter returns ROI", () => {
    const ds = new DicomDataset();
    const overlay = new DicomOverlayData(ds, 0x6012);
    ds.addOrUpdateElement(DicomVR.CS, new DicomTag(0x6012, 0x0040), "R");
    expect(overlay.type).toBe(DicomOverlayType.ROI);
  });

  it("origin X/Y getters read correct index", () => {
    const ds = new DicomDataset();
    const overlay = new DicomOverlayData(ds, 0x6012);
    ds.addOrUpdateElement(DicomVR.SS, new DicomTag(0x6012, 0x0050), 42, 96);
    expect(overlay.originY).toBe(42);
    expect(overlay.originX).toBe(96);
  });

  it("origin X/Y setters write correct index", () => {
    const ds = new DicomDataset();
    const overlay = new DicomOverlayData(ds, 0x6012);
    overlay.originX = 96;
    overlay.originY = 42;
    const y = ds.getValueOrDefault<number>(new DicomTag(0x6012, 0x0050), 0, 1);
    const x = ds.getValueOrDefault<number>(new DicomTag(0x6012, 0x0050), 1, 1);
    expect(y).toBe(42);
    expect(x).toBe(96);
  });
  it("extracts overlay mask bits", () => {
    const ds = new DicomDataset();
    ds.addOrUpdateElement(DicomVR.US, tag(0x0010), 2); // Rows
    ds.addOrUpdateElement(DicomVR.US, tag(0x0011), 2); // Columns
    ds.addOrUpdateElement(DicomVR.SS, tag(0x0050), 1, 1); // Origin
    ds.addOrUpdateElement(DicomVR.CS, tag(0x0040), "G"); // OverlayType
    ds.addOrUpdateElement(DicomVR.US, tag(0x0100), 1); // BitsAllocated
    ds.addOrUpdateElement(DicomVR.US, tag(0x0102), 0); // BitPosition

    const data = new Uint8Array([0b00000101]);
    ds.addOrUpdate(new DicomOtherByte(tag(0x3000), data));

    const overlays = DicomOverlayDataFactory.fromDataset(ds);
    expect(overlays.length).toBe(1);
    const mask = overlays[0]!.getMask();
    expect([...mask]).toEqual([1, 0, 1, 0]);
  });

  it("hasEmbeddedOverlays respects even groups", () => {
    const ds = new DicomDataset();
    ds.addOrUpdateElement(DicomVR.LO, new DicomTag(0x6001, 0x0010), "Generic Data");
    expect(DicomOverlayData.hasEmbeddedOverlays(ds)).toBe(false);

    ds.addOrUpdateElement(DicomVR.LO, new DicomTag(0x6002, 0x0010), "Generic Data");
    expect(DicomOverlayData.hasEmbeddedOverlays(ds)).toBe(true);
  });

  it("extracts overlay from pixel data using bit position", () => {
    const ds = new DicomDataset();
    ds.addOrUpdateElement(DicomVR.US, Tags.Rows, 2);
    ds.addOrUpdateElement(DicomVR.US, Tags.Columns, 2);
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 8);
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, 8);
    ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, 7);
    ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 1);
    ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, new Uint8Array([2, 0, 0, 0]))); // bit1 set on first pixel

    ds.addOrUpdateElement(DicomVR.US, tag(0x0010), 2);
    ds.addOrUpdateElement(DicomVR.US, tag(0x0011), 2);
    ds.addOrUpdateElement(DicomVR.SS, tag(0x0050), 1, 1);
    ds.addOrUpdateElement(DicomVR.CS, tag(0x0040), "G");
    ds.addOrUpdateElement(DicomVR.US, tag(0x0102), 1); // OverlayBitPosition

    const overlays = DicomOverlayDataFactory.fromDataset(ds);
    expect(overlays.length).toBe(1);
    expect([...overlays[0]!.getMask()]).toEqual([0, 0, 0, 0]);
  });

  it("extracts multi-frame overlay data", () => {
    const ds = new DicomDataset();
    ds.addOrUpdateElement(DicomVR.US, tag(0x0010), 2);
    ds.addOrUpdateElement(DicomVR.US, tag(0x0011), 2);
    ds.addOrUpdateElement(DicomVR.SS, tag(0x0050), 1, 1);
    ds.addOrUpdateElement(DicomVR.CS, tag(0x0040), "G");
    ds.addOrUpdateElement(DicomVR.US, tag(0x0015), 2); // NumberOfFramesInOverlay
    ds.addOrUpdateElement(DicomVR.US, tag(0x0100), 1);
    ds.addOrUpdateElement(DicomVR.US, tag(0x0102), 0);

    const data = new Uint8Array([0b00000001, 0b00000010]); // two frames
    ds.addOrUpdate(new DicomOtherByte(tag(0x3000), data));

    const overlays = DicomOverlayDataFactory.fromDataset(ds);
    const overlay = overlays[0]!;
    expect([...overlay.getMask(0)]).toEqual([1, 0, 0, 0]);
    expect([...overlay.getMask(1)]).toEqual([0, 1, 0, 0]);
  });

  it("extracts overlay with bitsAllocated > 1", () => {
    const ds = new DicomDataset();
    ds.addOrUpdateElement(DicomVR.US, tag(0x0010), 2);
    ds.addOrUpdateElement(DicomVR.US, tag(0x0011), 2);
    ds.addOrUpdateElement(DicomVR.SS, tag(0x0050), 1, 1);
    ds.addOrUpdateElement(DicomVR.CS, tag(0x0040), "G");
    ds.addOrUpdateElement(DicomVR.US, tag(0x0100), 8);
    ds.addOrUpdateElement(DicomVR.US, tag(0x0102), 0);

    const data = new Uint8Array([0, 1, 0, 1]);
    ds.addOrUpdate(new DicomOtherByte(tag(0x3000), data));

    const overlays = DicomOverlayDataFactory.fromDataset(ds);
    const overlay = overlays[0]!;
    expect([...overlay.getMask()]).toEqual([0, 1, 0, 1]);
  });

  it("extracts overlay with bitsGrouped=16", () => {
    const ds = new DicomDataset();
    ds.addOrUpdateElement(DicomVR.US, tag(0x0010), 4);
    ds.addOrUpdateElement(DicomVR.US, tag(0x0011), 4);
    ds.addOrUpdateElement(DicomVR.SS, tag(0x0050), 1, 1);
    ds.addOrUpdateElement(DicomVR.CS, tag(0x0040), "G");
    ds.addOrUpdateElement(DicomVR.US, tag(0x0100), 1);
    ds.addOrUpdateElement(DicomVR.US, tag(0x0069), 16); // OverlayBitsGrouped

    // Set bit 8 (second byte LSB) within the 16-bit group
    ds.addOrUpdate(new DicomOtherByte(tag(0x3000), new Uint8Array([0x00, 0x01])));

    const overlays = DicomOverlayDataFactory.fromDataset(ds);
    const overlay = overlays[0]!;
    const mask = overlay.getMask();
    expect(mask.length).toBe(16);
    expect(mask[8]).toBe(1);
  });

  it("overlay type getter throws for invalid type", () => {
    const ds = new DicomDataset();
    ds.addOrUpdateElement(DicomVR.US, tag(0x0010), 2);
    ds.addOrUpdateElement(DicomVR.US, tag(0x0011), 2);
    ds.addOrUpdateElement(DicomVR.SS, tag(0x0050), 1, 1);
    ds.addOrUpdateElement(DicomVR.CS, tag(0x0040), "X");
    ds.addOrUpdate(new DicomOtherByte(tag(0x3000), new Uint8Array([0b00000001])));

    const overlays = DicomOverlayDataFactory.fromDataset(ds);
    expect(overlays.length).toBe(1);
    expect(() => overlays[0]!.type).toThrow();
  });

  it("uses overlay descriptor color", () => {
    const ds = new DicomDataset();
    ds.addOrUpdateElement(DicomVR.US, tag(0x0010), 2);
    ds.addOrUpdateElement(DicomVR.US, tag(0x0011), 2);
    ds.addOrUpdateElement(DicomVR.SS, tag(0x0050), 1, 1);
    ds.addOrUpdateElement(DicomVR.CS, tag(0x0040), "G");
    ds.addOrUpdateElement(DicomVR.US, tag(0x1101), 65535);
    ds.addOrUpdateElement(DicomVR.US, tag(0x1102), 0);
    ds.addOrUpdateElement(DicomVR.US, tag(0x1103), 0);
    ds.addOrUpdate(new DicomOtherByte(tag(0x3000), new Uint8Array([0b00000001])));

    const overlays = DicomOverlayDataFactory.fromDataset(ds);
    const color = overlays[0]!.preferredColor!;
    expect(color.r).toBe(255);
    expect(color.g).toBe(0);
    expect(color.b).toBe(0);
  });

  it("maps overlay frames with origin and repeat interval", () => {
    const ds = new DicomDataset();
    ds.addOrUpdateElement(DicomVR.US, tag(0x0010), 2);
    ds.addOrUpdateElement(DicomVR.US, tag(0x0011), 2);
    ds.addOrUpdateElement(DicomVR.SS, tag(0x0050), 1, 1);
    ds.addOrUpdateElement(DicomVR.CS, tag(0x0040), "G");
    ds.addOrUpdateElement(DicomVR.US, tag(0x0015), 2);
    ds.addOrUpdateElement(DicomVR.US, tag(0x0051), 2); // ImageFrameOrigin (frame 2)
    ds.addOrUpdateElement(DicomVR.US, tag(0x0100), 1);
    ds.addOrUpdateElement(DicomVR.US, tag(0x0102), 0);
    ds.addOrUpdate(new DicomOtherByte(tag(0x3000), new Uint8Array([0b00000001, 0b00000010])));

    const overlays = DicomOverlayDataFactory.fromDataset(ds);
    const overlay = overlays[0]!;
    expect([...overlay.getMask(0)]).toEqual([0, 0, 0, 0]); // before origin
    expect([...overlay.getMask(1)]).toEqual([1, 0, 0, 0]); // frame 2 -> overlay frame 0
    expect([...overlay.getMask(2)]).toEqual([0, 1, 0, 0]); // frame 3 -> overlay frame 1
  });

  it("getOverlayDataS32 throws for invalid packed data length", () => {
    const ds = new DicomDataset();
    ds.addOrUpdateElement(DicomVR.US, tag(0x0010), 4);
    ds.addOrUpdateElement(DicomVR.US, tag(0x0011), 4);
    ds.addOrUpdateElement(DicomVR.CS, tag(0x0040), "G");
    ds.addOrUpdate(new DicomOtherByte(tag(0x3000), new Uint8Array([0x01]))); // 8 bits < 16 pixels

    const overlay = new DicomOverlayData(ds, GROUP);
    expect(() => overlay.getOverlayDataS32(0, 1)).toThrow("Invalid overlay length");
  });

  it("factory fromBitmap writes overlay data via overlay.Data", () => {
    const ds = new DicomDataset();
    const image = new RawImage(2, 1, new Uint8Array([
      255, 0, 0, 255, // match
      0, 0, 0, 255,
    ]));

    const overlay = DicomOverlayDataFactory.fromBitmap(ds, image, new Color32(255, 0, 0, 255));
    expect(overlay.group).toBe(0x6000);
    expect(overlay.rows).toBe(1);
    expect(overlay.columns).toBe(2);
    expect([...overlay.getMask()]).toEqual([1, 0]);
    expect(ds.contains(new DicomTag(0x6000, 0x3000))).toBe(true);
  });
});
