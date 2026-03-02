import type { ILUT } from "../lut/ILUT.js";
import type { IImage } from "../IImage.js";

/**
 * Graphic interface — handles transformation state and final rendering.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Render/IGraphic.cs
 */
export interface IGraphic {
  readonly originalWidth: number;
  readonly originalHeight: number;
  readonly originalOffsetX: number;
  readonly originalOffsetY: number;
  readonly scaleFactor: number;
  readonly scaledWidth: number;
  readonly scaledHeight: number;
  readonly scaledOffsetX: number;
  readonly scaledOffsetY: number;
  zOrder: number;

  reset(): void;
  scale(scale: number): void;
  bestFit(width: number, height: number): void;
  rotate(angle: number): void;
  flipX(): void;
  flipY(): void;
  transform(scale: number, rotation: number, flipX: boolean, flipY: boolean): void;
  renderImage(lut: ILUT | null): IImage;
}
