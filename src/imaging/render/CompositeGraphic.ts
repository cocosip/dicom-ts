import type { IGraphic } from "./IGraphic.js";
import type { ILUT } from "../lut/ILUT.js";
import type { IImage } from "../IImage.js";

/**
 * Composite graphic — layers multiple IGraphic objects, background first,
 * with additional layers sorted by Z-order.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Render/CompositeGraphic.cs
 */
export class CompositeGraphic implements IGraphic {
  private readonly _layers: IGraphic[];

  constructor(bg: IGraphic) {
    this._layers = [bg];
  }

  get backgroundLayer(): IGraphic {
    return this._layers[0]!;
  }

  /** Add a new graphic layer, keeping layers sorted ascending by Z-order. */
  addLayer(layer: IGraphic): void {
    this._layers.push(layer);
    this._layers.sort((a, b) => a.zOrder - b.zOrder);
  }

  // ---------------------------------------------------------------------------
  // IGraphic — delegate everything to all layers
  // ---------------------------------------------------------------------------

  get originalWidth(): number { return this.backgroundLayer.originalWidth; }
  get originalHeight(): number { return this.backgroundLayer.originalHeight; }
  get originalOffsetX(): number { return 0; }
  get originalOffsetY(): number { return 0; }
  get scaleFactor(): number { return this.backgroundLayer.scaleFactor; }
  get scaledWidth(): number { return this.backgroundLayer.scaledWidth; }
  get scaledHeight(): number { return this.backgroundLayer.scaledHeight; }
  get scaledOffsetX(): number { return 0; }
  get scaledOffsetY(): number { return 0; }

  get zOrder(): number { return 0; }
  set zOrder(_value: number) { /* CompositeGraphic always has z-order 0 */ }

  reset(): void { for (const g of this._layers) g.reset(); }
  scale(s: number): void { for (const g of this._layers) g.scale(s); }
  bestFit(w: number, h: number): void { for (const g of this._layers) g.bestFit(w, h); }
  rotate(angle: number): void { for (const g of this._layers) g.rotate(angle); }
  flipX(): void { for (const g of this._layers) g.flipX(); }
  flipY(): void { for (const g of this._layers) g.flipY(); }
  transform(scale: number, rotation: number, fx: boolean, fy: boolean): void {
    for (const g of this._layers) g.transform(scale, rotation, fx, fy);
  }

  renderImage(lut: ILUT | null): IImage {
    const img = this.backgroundLayer.renderImage(lut);
    if (this._layers.length > 1) {
      img.drawGraphics(this._layers.slice(1));
    }
    return img;
  }
}
