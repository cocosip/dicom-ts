import { GrayscaleRenderOptions } from "../../src/imaging/GrayscaleRenderOptions.js";
import { BitDepth } from "../../src/imaging/BitDepth.js";
import { PixelRepresentation } from "../../src/imaging/PixelRepresentation.js";
import { describe, it, expect } from "vitest";
import { CompositeLUT } from "../../src/imaging/lut/CompositeLUT.js";
import { InvertLUT } from "../../src/imaging/lut/InvertLUT.js";
import { OutputLUT } from "../../src/imaging/lut/OutputLUT.js";
import { PaddingLUT } from "../../src/imaging/lut/PaddingLUT.js";
import { PrecalculatedLUT } from "../../src/imaging/lut/PrecalculatedLUT.js";
import { ModalityRescaleLUT } from "../../src/imaging/lut/ModalityRescaleLUT.js";
import { VOILUT } from "../../src/imaging/lut/VOILUT.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import type { ILUT } from "../../src/imaging/lut/ILUT.js";

class AddOneLUT implements ILUT {
  get isValid() { return true; }
  get minimumOutputValue() { return 0; }
  get maximumOutputValue() { return 255; }
  apply(value: number): number {
    return value + 1;
  }
  recalculate(): void { }
}

describe("LUTs", () => {
  it("composes LUTs in order", () => {
    const lut = new CompositeLUT();
    lut.add(new AddOneLUT());
    lut.add(new AddOneLUT());
    expect(lut.apply(1)).toBe(3);
  });

  it("inverts and clamps values", () => {
    const lut = new InvertLUT(0, 255);
    expect(lut.apply(0)).toBe(255);
    expect(lut.apply(255)).toBe(0);
  });

  it("pads values", () => {
    const lut = new PaddingLUT(42, 255, 0);
    expect(lut.apply(0)).toBe(42);
    expect(lut.apply(5)).toBe(5);
  });

  it("clamps output range", () => {
    const options = GrayscaleRenderOptions.createLinearOption(new BitDepth(1, 1, 0, PixelRepresentation.Unsigned), 0, 255);
    const lut = new OutputLUT(options);
    // OutputLUT returns Color32 packed ARGB integers
    // Input 0 -> Black (0,0,0,255) -> 0xFF000000
    // Input 255 -> White (255,255,255,255) -> 0xFFFFFFFF

    // -10 clamps to 0 (Black)
    expect(lut.apply(-10) >>> 0).toBe(0xFF000000);

    // 300 clamps to 255 (White)
    expect(lut.apply(300) >>> 0).toBe(0xFFFFFFFF);
  });

  it("precalculates lookups", () => {
    // Input 0 -> Invert(0) = 255 -> options[255] = White (0xFFFFFFFF)
    const options = GrayscaleRenderOptions.createLinearOption(new BitDepth(8, 8, 7, PixelRepresentation.Unsigned), 0, 256);
    // If range is 0 to 256, then width=256, center=128.
    // 0 -> Invert -> 255. 
    // OutputLUT(255) with width=256 center=128.
    // y = ((x - c) / w + 0.5) * (ymax - ymin) + ymin
    // For OutputLUT, ymin=0, ymax=255.
    // y = ((255 - 128) / 256 + 0.5) * 255 = (127/256 + 0.5) * 255 ~= (0.496 + 0.5) * 255 = 0.996 * 255 = 254.

    // Wait, createLinearOption(bits, min, max)
    // If min=0, max=255.
    // width = 255, center = 127.5.
    // Input 255.
    // y = ((255 - 127.5)/255 + 0.5) * 255 = (0.5 + 0.5) * 255 = 255.

    // So if max=255, it should map 255 -> 255.
    // If max=256, width=256, center=128.
    // 255 -> ((255-128)/256 + 0.5)*255 = (127/256+0.5)*255 = (0.496+0.5)*255 = 254.

    // In previous failing test: createLinearOption(..., 0, 255).
    // width = 255, center = 127.5.
    // OutputLUT maps value via color map.
    // BUT OutputLUT uses options.colorMap.
    // It DOES NOT apply window width/center itself in apply().
    // OutputLUT.apply() simply takes index and returns colorMap[index].
    // It clamps index to 0..255.
    // Wait, OutputLUT implementation:
    // apply(value) { if (value < 0) return map[0]; if (value > 255) return map[255]; return map[value]; }

    // So OutputLUT EXPECTS input to be 0..255 index.
    // It DOES NOT do windowing.
    // Windowing is done by VOILUT or similar BEFORE OutputLUT.

    // So my CompositeLUT in the test:
    // InvertLUT(0..255) -> 0..255.
    // OutputLUT(0..255) -> Color32.

    // So PrecalculatedLUT caches this.
    // The previous failure was "expected 0 to be 4294967295".
    // 4294967295 is 0xFFFFFFFF (White).
    // 0 is 0x00000000 (Black/Transparent).
    // This means apply(0) returned 0.
    // Why? Because table was not populated (all zeros).
    // I added lut.recalculate().
    // But it still failed?
    // "expected +0 to be 4294967295"
    // This means lut.apply(0) returned 0.
    // So the table is STILL empty.
    // Why?
    // recalculate() calls _lut.recalculate().
    // Then loop: table[i] = _lut.apply(i).
    // If _lut.apply(i) returns non-zero, table should be non-zero.
    // _lut is CompositeLUT.
    // InvertLUT(0) -> 255.
    // OutputLUT(255) -> White (0xFFFFFFFF).
    // So _lut.apply(0) should be 0xFFFFFFFF.

    // So why table[0] is 0?
    // Maybe Int32Array stores signed integers.
    // 0xFFFFFFFF as signed 32-bit is -1.
    // If I read it back as unsigned >>> 0, it is 0xFFFFFFFF.
    // But if it is 0, it means it is really 0.

    // Is it possible that recalculate() was NOT called or returned early?
    // I modified PrecalculatedLUT.ts to remove early return.
    // Did I apply the change correctly?
    // Let's verify PrecalculatedLUT.ts content.

    // Also, createLinearOption(..., 0, 255) vs (..., 0, 256).
    // 0..255 range has 256 values.
    // max - min = 255.
    // But usually for 8-bit, range is 0..255.
    // If window width is 256 (covering 0..255), then max should be 256?
    // Window width logic: width of the window.
    // If range is [0, 255], width is 256.
    // center is 127.5.
    // So createLinearOption(..., 0, 256) is correct for full range.

    const innerLut = new CompositeLUT();
    innerLut.add(new InvertLUT(0, 255));
    innerLut.add(new OutputLUT(options));

    const lut = new PrecalculatedLUT(innerLut, 0, 255);
    lut.recalculate();

    // InvertLUT(0) -> 255. OutputLUT(255) -> White
    expect(lut.apply(0) >>> 0).toBe(0xFFFFFFFF);

    // InvertLUT(1) -> 254. OutputLUT(254) -> (254, 254, 254, 255) -> 0xFFFEFEFE
    expect(lut.apply(1) >>> 0).toBe(0xFFFEFEFE);

    // InvertLUT(3) -> 252. OutputLUT(252) -> (252, 252, 252, 255) -> 0xFFFCFCFC
    expect(lut.apply(3) >>> 0).toBe(0xFFFCFCFC);
  });

  it("creates modality rescale LUT from dataset", () => {
    const ds = new DicomDataset();
    ds.addOrUpdateElement(DicomVR.DS, Tags.RescaleSlope, "2");
    ds.addOrUpdateElement(DicomVR.DS, Tags.RescaleIntercept, "10");
    const lut = ModalityRescaleLUT.fromDataset(ds);
    expect(lut.apply(5)).toBe(20);
  });

  it("VOI LUT uses window center/width", () => {
    const options = GrayscaleRenderOptions.createLinearOption(new BitDepth(8, 8, 7, PixelRepresentation.Unsigned), 0, 255);
    options.windowCenter = 1;
    options.windowWidth = 1;
    const lut = VOILUT.create(options);
    expect(lut.apply(0)).toBe(0);
    expect(lut.apply(1)).toBe(255);
  });
});
