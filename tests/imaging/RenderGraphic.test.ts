import { describe, it, expect } from "vitest";
import { RawImage } from "../../src/imaging/RawImage.js";
import { OverlayGraphic } from "../../src/imaging/render/OverlayGraphic.js";
import { CompositeGraphic } from "../../src/imaging/render/CompositeGraphic.js";
import { Color32 } from "../../src/imaging/Color32.js";
import type { IGraphic } from "../../src/imaging/render/IGraphic.js";
import type { IPipeline } from "../../src/imaging/render/IPipeline.js";

class BaseGraphic implements IGraphic {
  private readonly image: RawImage;
  constructor(image: RawImage) {
    this.image = image;
  }
  render(_pipeline: IPipeline, _frame: number): RawImage {
    return this.image;
  }
}

describe("OverlayGraphic", () => {
  it("applies overlay mask to image", () => {
    const base = new RawImage(2, 1, new Uint8Array([
      0, 0, 0, 255,
      0, 0, 0, 255,
    ]), 4);
    const overlay = new OverlayGraphic(2, 1, new Uint8Array([1, 0]), new Color32(255, 0, 0, 255));
    const out = overlay.apply(base);
    expect([...out.pixels]).toEqual([
      255, 0, 0, 255,
      0, 0, 0, 255,
    ]);
  });

  it("composes overlays with a base graphic", () => {
    const baseImage = new RawImage(2, 1, new Uint8Array([
      0, 0, 0, 255,
      0, 0, 0, 255,
    ]), 4);
    const base = new BaseGraphic(baseImage);
    const overlay = new OverlayGraphic(2, 1, new Uint8Array([0, 1]), new Color32(0, 255, 0, 255));
    const composite = new CompositeGraphic(base, [overlay]);
    const out = composite.render({ render: () => baseImage }, 0);
    expect(out).toBeInstanceOf(RawImage);
    const pixels = (out as RawImage).pixels;
    expect([...pixels]).toEqual([
      0, 0, 0, 255,
      0, 255, 0, 255,
    ]);
  });
});
