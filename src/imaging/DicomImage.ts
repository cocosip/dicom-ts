import { DicomDataset } from "../dataset/DicomDataset.js";
import * as Tags from "../core/DicomTag.generated.js";
import { DicomPixelData } from "./DicomPixelData.js";
import { ImageGraphic } from "./render/ImageGraphic.js";
import { GenericGrayscalePipeline } from "./render/GenericGrayscalePipeline.js";
import { PaletteColorPipeline } from "./render/PaletteColorPipeline.js";
import { RgbColorPipeline } from "./render/RgbColorPipeline.js";
import { ColorTable } from "./ColorTable.js";
import { PhotometricInterpretation } from "./PhotometricInterpretation.js";
import { ModalityRescaleLUT } from "./lut/ModalityRescaleLUT.js";
import { ModalitySequenceLUT } from "./lut/ModalitySequenceLUT.js";
import { VOILUT } from "./lut/VOILUT.js";
import { VOISequenceLUT } from "./lut/VOISequenceLUT.js";
import { CompositeLUT } from "./lut/CompositeLUT.js";
import { OutputLUT } from "./lut/OutputLUT.js";
import { RawImage } from "./RawImage.js";
import type { IImage } from "./IImage.js";
import { DicomOverlayDataFactory } from "./DicomOverlayDataFactory.js";
import { DicomOverlayType } from "./DicomOverlayData.js";
import { Color32 } from "./Color32.js";

/**
 * High-level DICOM image rendering API.
 */
export class DicomImage {
  readonly dataset: DicomDataset;
  readonly pixelData: DicomPixelData;

  private _windowCenter: number | null = null;
  private _windowWidth: number | null = null;
  private _scale: number = 1;
  private _showOverlays: boolean = true;
  private _overlayColor: Color32 = new Color32(255, 0, 0, 255);
  private _overlayOpacity: number = 1;
  private readonly _renderCache = new Map<number, IImage>();

  constructor(dataset: DicomDataset) {
    this.dataset = dataset;
    this.pixelData = DicomPixelData.create(dataset);
    this.pixelData.enableFrameCache();
  }

  get windowCenter(): number | null { return this._windowCenter; }
  set windowCenter(value: number | null) {
    if (this._windowCenter === value) return;
    this._windowCenter = value;
    this.clearCache();
  }

  get windowWidth(): number | null { return this._windowWidth; }
  set windowWidth(value: number | null) {
    if (this._windowWidth === value) return;
    this._windowWidth = value;
    this.clearCache();
  }

  get scale(): number { return this._scale; }
  set scale(value: number) {
    if (this._scale === value) return;
    this._scale = value;
    this.clearCache();
  }

  get showOverlays(): boolean { return this._showOverlays; }
  set showOverlays(value: boolean) {
    if (this._showOverlays === value) return;
    this._showOverlays = value;
    this.clearCache();
  }

  get overlayColor(): Color32 { return this._overlayColor; }
  set overlayColor(value: Color32) {
    this._overlayColor = value;
    this.clearCache();
  }

  get overlayOpacity(): number { return this._overlayOpacity; }
  set overlayOpacity(value: number) {
    const clamped = Math.max(0, Math.min(1, value));
    if (this._overlayOpacity === clamped) return;
    this._overlayOpacity = clamped;
    this.clearCache();
  }

  clearCache(): void {
    this._renderCache.clear();
    this.pixelData.clearFrameCache();
  }

  renderImage(frame: number = 0): IImage {
    const cached = this._renderCache.get(frame);
    if (cached) return cached;
    const pi = this.pixelData.photometricInterpretation ?? PhotometricInterpretation.MONOCHROME2;
    const palette = pi === PhotometricInterpretation.PALETTE_COLOR
      ? ColorTable.fromDataset(this.dataset)
      : null;
    const graphic = new ImageGraphic(this.pixelData, palette);

    let image: IImage;
    if (pi === PhotometricInterpretation.PALETTE_COLOR) {
      if (!palette) throw new Error("Palette color LUT not found");
      image = graphic.render(new PaletteColorPipeline(palette), frame);
    } else if (pi === PhotometricInterpretation.RGB
      || pi === PhotometricInterpretation.YBR_FULL
      || pi === PhotometricInterpretation.YBR_FULL_422
      || pi === PhotometricInterpretation.YBR_ICT
      || pi === PhotometricInterpretation.YBR_RCT
    ) {
      image = graphic.render(new RgbColorPipeline(), frame);
    } else {
      const lut = this.buildGrayscaleLut(pi === PhotometricInterpretation.MONOCHROME1);
      image = graphic.render(new GenericGrayscalePipeline(lut), frame);
    }

    if (this._showOverlays && image instanceof RawImage) {
      const overlays = DicomOverlayDataFactory.fromDataset(this.dataset);
      let current = image;
      for (const overlay of overlays) {
        try {
          if (overlay.type !== DicomOverlayType.Graphics) continue;
        } catch {
          continue;
        }
        if (!overlay.hasData) continue;
        const baseColor = overlay.preferredColor ?? this._overlayColor;
        const color = applyOpacity(baseColor, this._overlayOpacity);
        current = overlay.applyTo(current, color, frame);
      }
      image = current;
    }

    if (this._scale !== 1 && image instanceof RawImage) {
      image = scaleNearest(image, this._scale);
    }

    this._renderCache.set(frame, image);
    return image;
  }

  private buildGrayscaleLut(invert: boolean): CompositeLUT {
    const modality = ModalitySequenceLUT.fromDataset(this.dataset)
      ?? ModalityRescaleLUT.fromDataset(this.dataset);
    const wc = this._windowCenter ?? parseFirstNumber(this.dataset.tryGetValue<string>(Tags.WindowCenter));
    const ww = this._windowWidth ?? parseFirstNumber(this.dataset.tryGetValue<string>(Tags.WindowWidth));
    let center = wc;
    let width = ww;

    if (center == null || width == null) {
      const min = modality.map(this.pixelData.bitDepth.minValue);
      const max = modality.map(this.pixelData.bitDepth.maxValue);
      center = (min + max) / 2;
      width = Math.max(1, max - min);
    }

    const voiSeq = VOISequenceLUT.fromDataset(this.dataset);
    const voi = voiSeq ?? new VOILUT(center, width, invert);
    return new CompositeLUT(modality, voi, new OutputLUT());
  }
}

function parseFirstNumber(raw?: string): number | null {
  if (!raw) return null;
  const part = raw.split("\\")[0]?.trim();
  if (!part) return null;
  const v = parseFloat(part);
  return Number.isFinite(v) ? v : null;
}

function scaleNearest(image: RawImage, scale: number): RawImage {
  const factor = Math.max(0.01, scale);
  const newWidth = Math.max(1, Math.round(image.width * factor));
  const newHeight = Math.max(1, Math.round(image.height * factor));
  const out = new Uint8Array(newWidth * newHeight * 4);

  for (let y = 0; y < newHeight; y++) {
    const srcY = Math.min(image.height - 1, Math.floor(y / factor));
    for (let x = 0; x < newWidth; x++) {
      const srcX = Math.min(image.width - 1, Math.floor(x / factor));
      const srcIdx = (srcY * image.width + srcX) * 4;
      const dstIdx = (y * newWidth + x) * 4;
      out[dstIdx] = image.pixels[srcIdx] ?? 0;
      out[dstIdx + 1] = image.pixels[srcIdx + 1] ?? 0;
      out[dstIdx + 2] = image.pixels[srcIdx + 2] ?? 0;
      out[dstIdx + 3] = image.pixels[srcIdx + 3] ?? 255;
    }
  }

  return new RawImage(newWidth, newHeight, out, 4);
}

function applyOpacity(color: Color32, opacity: number): Color32 {
  const alpha = Math.round(color.a * opacity);
  return new Color32(color.r, color.g, color.b, alpha);
}
