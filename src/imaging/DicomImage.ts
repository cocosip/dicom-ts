import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomPixelData } from "./DicomPixelData.js";
import { ImageGraphic } from "./render/ImageGraphic.js";
import { OverlayGraphic } from "./render/OverlayGraphic.js";
import { GenericGrayscalePipeline } from "./render/GenericGrayscalePipeline.js";
import { PaletteColorPipeline } from "./render/PaletteColorPipeline.js";
import { RgbColorPipeline } from "./render/RgbColorPipeline.js";
import type { IPipeline } from "./render/IPipeline.js";
import type { ILUT } from "./lut/ILUT.js";
import { PaletteColorLUT } from "./lut/PaletteColorLUT.js";
import { PhotometricInterpretation } from "./PhotometricInterpretation.js";
import { GrayscaleRenderOptions } from "./GrayscaleRenderOptions.js";
import type { IImage } from "./IImage.js";
import { DicomOverlayDataFactory } from "./DicomOverlayDataFactory.js";
import { DicomOverlayType } from "./DicomOverlayData.js";
import { Color32 } from "./Color32.js";

/**
 * High-level DICOM image rendering API.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/DicomImage.cs
 */
export class DicomImage {
  readonly dataset: DicomDataset;
  readonly pixelData: DicomPixelData;

  private _currentFrame: number = 0;
  private _scale: number = 1;
  private _showOverlays: boolean = true;
  /** Default overlay color — magenta, matching C# default 0xffff00ff. */
  private _overlayColor: Color32 = new Color32(255, 0, 255, 255);
  private _overlayOpacity: number = 1;
  /** Pending window center for newly created pipelines (null = use dataset value). */
  private _windowCenter: number | null = null;
  /** Pending window width for newly created pipelines (null = use dataset value). */
  private _windowWidth: number | null = null;
  private readonly _renderCache = new Map<number, IImage>();
  private readonly _pipelineCache = new Map<number, IPipeline>();

  /**
   * When true (default), changing windowing/LUT properties applies to all frame pipelines.
   * When false, only the current frame is affected.
   *
   * Reference: C# DicomImage.AutoApplyLUTToAllFrames
   */
  autoApplyLUTToAllFrames: boolean = true;

  constructor(dataset: DicomDataset) {
    this.dataset = dataset;
    this.pixelData = DicomPixelData.create(dataset);
    this.pixelData.enableFrameCache();
  }

  // ---------------------------------------------------------------------------
  // Read-only metadata
  // ---------------------------------------------------------------------------

  get width(): number { return this.pixelData.columns; }
  get height(): number { return this.pixelData.rows; }
  get numberOfFrames(): number { return this.pixelData.numberOfFrames; }
  get currentFrame(): number { return this._currentFrame; }

  /** True when the photometric interpretation is MONOCHROME1 or MONOCHROME2. */
  get isGrayscale(): boolean {
    const pi = this.pixelData.photometricInterpretation;
    return pi === PhotometricInterpretation.MONOCHROME1
      || pi === PhotometricInterpretation.MONOCHROME2;
  }

  // ---------------------------------------------------------------------------
  // Windowing / LUT properties (C#-aligned: delegate to and mutate pipelines)
  // ---------------------------------------------------------------------------

  /**
   * Gets window center from the current frame pipeline; falls back to stored override or 127.
   * Setting updates all cached grayscale pipelines (respects autoApplyLUTToAllFrames).
   */
  get windowCenter(): number {
    const p = this._pipelineCache.get(this._currentFrame);
    if (p instanceof GenericGrayscalePipeline) return p.windowCenter;
    return this._windowCenter ?? 127;
  }

  set windowCenter(value: number) {
    this._windowCenter = value;
    this._applyToGrayscalePipelines((p) => {
      if (p.windowCenter !== value) { p.windowCenter = value; return true; }
      return false;
    });
  }

  /**
   * Gets window width from the current frame pipeline; falls back to stored override or 255.
   * Setting updates all cached grayscale pipelines.
   */
  get windowWidth(): number {
    const p = this._pipelineCache.get(this._currentFrame);
    if (p instanceof GenericGrayscalePipeline) return p.windowWidth;
    return this._windowWidth ?? 255;
  }

  set windowWidth(value: number) {
    this._windowWidth = value;
    this._applyToGrayscalePipelines((p) => {
      if (p.windowWidth !== value) { p.windowWidth = value; return true; }
      return false;
    });
  }

  /** Gets or sets whether to apply VOI LUT sequences from the dataset. */
  get useVoiLut(): boolean {
    const p = this._pipelineCache.get(this._currentFrame);
    if (p instanceof GenericGrayscalePipeline) return p.useVoiLut;
    return false;
  }

  set useVoiLut(value: boolean) {
    this._applyToGrayscalePipelines((p) => {
      if (p.useVoiLut !== value) { p.useVoiLut = value; return true; }
      return false;
    });
  }

  /** Gets or sets whether to invert the grayscale output. */
  get invert(): boolean {
    const p = this._pipelineCache.get(this._currentFrame);
    if (p instanceof GenericGrayscalePipeline) return p.invert;
    return false;
  }

  set invert(value: boolean) {
    this._applyToGrayscalePipelines((p) => {
      if (p.invert !== value) { p.invert = value; return true; }
      return false;
    });
  }

  /** Gets or sets the color map for grayscale rendering (null = standard grayscale). */
  get grayscaleColorMap(): Color32[] | null {
    const p = this._pipelineCache.get(this._currentFrame);
    if (p instanceof GenericGrayscalePipeline) return p.grayscaleColorMap ?? null;
    return null;
  }

  set grayscaleColorMap(value: Color32[] | null) {
    if (value == null) return;
    this._applyToGrayscalePipelines((p) => {
      p.grayscaleColorMap = value;
      return true;
    });
  }

  // ---------------------------------------------------------------------------
  // Display settings (only invalidate render cache, preserve pipeline cache)
  // ---------------------------------------------------------------------------

  get scale(): number { return this._scale; }
  set scale(value: number) {
    if (this._scale === value) return;
    this._scale = value;
    this._renderCache.clear();
  }

  get showOverlays(): boolean { return this._showOverlays; }
  set showOverlays(value: boolean) {
    if (this._showOverlays === value) return;
    this._showOverlays = value;
    this._renderCache.clear();
  }

  get overlayColor(): Color32 { return this._overlayColor; }
  set overlayColor(value: Color32) {
    this._overlayColor = value;
    this._renderCache.clear();
  }

  get overlayOpacity(): number { return this._overlayOpacity; }
  set overlayOpacity(value: number) {
    const clamped = Math.max(0, Math.min(1, value));
    if (this._overlayOpacity === clamped) return;
    this._overlayOpacity = clamped;
    this._renderCache.clear();
  }

  /** Clears all caches (render, pipeline, and raw pixel data). */
  clearCache(): void {
    this._renderCache.clear();
    this._pipelineCache.clear();
    this.pixelData.clearFrameCache();
  }

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------

  renderImage(frame: number = 0): IImage {
    this._currentFrame = frame;

    const cached = this._renderCache.get(frame);
    if (cached) return cached;

    const pipeline = this._getOrCreatePipeline(frame);

    // For palette color, the LUT IS the PaletteColorLUT — pass it as the palette arg
    const palette = pipeline instanceof PaletteColorPipeline
      ? (pipeline.lut instanceof PaletteColorLUT ? pipeline.lut : null)
      : null;
    const graphic = new ImageGraphic(this.pixelData, frame, palette);

    if (this._showOverlays) {
      const overlays = DicomOverlayDataFactory.fromDataset(this.dataset);
      for (const overlay of overlays) {
        try {
          if (overlay.type !== DicomOverlayType.Graphics) continue;
        } catch {
          continue;
        }
        if (!overlay.hasData) continue;
        // Frame range check: originFrame and numberOfFrames are 1-based.
        // (matches C# DicomImage.RenderImage overlay loop)
        const originFrame = overlay.originFrame;
        const overlayFrames = Math.max(1, overlay.numberOfFrames);
        if (frame + 1 < originFrame || frame + 1 > originFrame + overlayFrames - 1) continue;

        const baseColor = overlay.preferredColor ?? this._overlayColor;
        const color = applyOpacity(baseColor, this._overlayOpacity);
        // Pack ARGB (matching C# int color convention)
        const colorPacked = ((color.a & 0xff) << 24) | ((color.r & 0xff) << 16) | ((color.g & 0xff) << 8) | (color.b & 0xff);
        const mask = overlay.getMask(frame);
        graphic.addOverlay(
          new OverlayGraphic(mask, overlay.columns, overlay.rows, overlay.originX - 1, overlay.originY - 1, colorPacked),
        );
      }
    }

    if (this._scale !== 1) {
      graphic.scale(this._scale);
    }

    const image = graphic.renderImage(palette != null ? null : (pipeline.lut as ILUT | null));
    pipeline.clearCache();
    this._renderCache.set(frame, image);
    return image;
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /**
   * Applies fn to all cached grayscale pipelines in the applicable frame range.
   * Clears the render cache for each frame where the pipeline was modified.
   */
  private _applyToGrayscalePipelines(fn: (p: GenericGrayscalePipeline) => boolean): void {
    const from = this.autoApplyLUTToAllFrames ? 0 : this._currentFrame;
    const to = this.autoApplyLUTToAllFrames ? this.numberOfFrames - 1 : this._currentFrame;
    for (let f = from; f <= to; f++) {
      const pipeline = this._pipelineCache.get(f);
      if (pipeline instanceof GenericGrayscalePipeline && fn(pipeline)) {
        this._renderCache.delete(f);
      }
    }
  }

  private _getOrCreatePipeline(frame: number): IPipeline {
    const cached = this._pipelineCache.get(frame);
    if (cached) return cached;
    const pipeline = this._createPipeline(frame);
    this._pipelineCache.set(frame, pipeline);
    return pipeline;
  }

  private _createPipeline(frame: number): IPipeline {
    const pi = this.pixelData.photometricInterpretation ?? PhotometricInterpretation.MONOCHROME2;
    if (
      pi === PhotometricInterpretation.RGB
      || pi === PhotometricInterpretation.YBR_FULL
      || pi === PhotometricInterpretation.YBR_FULL_422
      || pi === PhotometricInterpretation.YBR_ICT
      || pi === PhotometricInterpretation.YBR_RCT
    ) {
      return new RgbColorPipeline();
    }
    if (pi === PhotometricInterpretation.PALETTE_COLOR) {
      return new PaletteColorPipeline(this.pixelData);
    }
    const options = GrayscaleRenderOptions.fromDataset(this.dataset, frame);
    if (this._windowCenter != null) options.windowCenter = this._windowCenter;
    if (this._windowWidth != null) options.windowWidth = this._windowWidth;
    options.invert = pi === PhotometricInterpretation.MONOCHROME1;
    return new GenericGrayscalePipeline(options);
  }
}

function applyOpacity(color: Color32, opacity: number): Color32 {
  const alpha = Math.round(color.a * opacity);
  return new Color32(color.r, color.g, color.b, alpha);
}
