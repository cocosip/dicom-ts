import type { IPipeline } from "./IPipeline.js";
import type { ILUT } from "../lut/ILUT.js";
import type { IModalityLUT } from "../lut/IModalityLUT.js";
import { GrayscaleRenderOptions } from "../GrayscaleRenderOptions.js";
import { CompositeLUT } from "../lut/CompositeLUT.js";
import { ModalityRescaleLUT } from "../lut/ModalityRescaleLUT.js";
import { VOISequenceLUT } from "../lut/VOISequenceLUT.js";
import { VOILUT, VOILinearLUT } from "../lut/VOILUT.js";
import { OutputLUT } from "../lut/OutputLUT.js";
import { InvertLUT } from "../lut/InvertLUT.js";
import { PrecalculatedLUT } from "../lut/PrecalculatedLUT.js";

/**
 * Generic grayscale rendering pipeline.
 * Builds: [ModalityLUT?] → [VOISequenceLUT? | VOILUT] → OutputLUT → [InvertLUT?]
 * then wraps with PrecalculatedLUT for performance.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Render/GenericGrayscalePipeline.cs
 */
export class GenericGrayscalePipeline implements IPipeline {
  private readonly _options: GrayscaleRenderOptions;
  private readonly _modalityLut: IModalityLUT | null;
  private readonly _voiSequenceLut: VOISequenceLUT | null;
  private _lut: CompositeLUT | null = null;

  constructor(options: GrayscaleRenderOptions) {
    this._options = options;

    // Modality LUT
    if (options.modalityLut != null) {
      this._modalityLut = options.modalityLut;
    } else if (options.rescaleSlope !== 1.0 || options.rescaleIntercept !== 0.0) {
      this._modalityLut = new ModalityRescaleLUT(options);
    } else {
      this._modalityLut = null;
    }

    // VOI Sequence LUT
    if (options.voiLutSequence != null && options.voiLutSequence.items.length > 0) {
      this._voiSequenceLut = new VOISequenceLUT(options.voiLutSequence.items[0]!);
    } else {
      this._voiSequenceLut = null;
    }
  }

  get windowWidth(): number { return this._options.windowWidth; }
  set windowWidth(value: number) {
    if (value !== this._options.windowWidth) {
      this._options.windowWidth = value;
      this._resetLut();
    }
  }

  get windowCenter(): number { return this._options.windowCenter; }
  set windowCenter(value: number) {
    if (value !== this._options.windowCenter) {
      this._options.windowCenter = value;
      this._resetLut();
    }
  }

  get useVoiLut(): boolean { return this._options.useVoiLut; }
  set useVoiLut(value: boolean) {
    if (value !== this._options.useVoiLut) {
      this._options.useVoiLut = value;
      this._resetLut();
    }
  }

  get invert(): boolean { return this._options.invert; }
  set invert(value: boolean) {
    if (value !== this._options.invert) {
      this._options.invert = value;
      this._resetLut();
    }
  }

  get grayscaleColorMap() { return this._options.colorMap; }
  set grayscaleColorMap(value) {
    this._options.colorMap = value;
    this._resetLut();
  }

  /** Lazily built composite + precalculated LUT. */
  get lut(): ILUT {
    if (this._lut == null) {
      const composite = new CompositeLUT();

      if (this._modalityLut != null) composite.add(this._modalityLut);

      if (this._voiSequenceLut != null) {
        composite.add(this._voiSequenceLut);
        if (this._options.useVoiLut) {
          composite.add(
            new VOILinearLUT(
              GrayscaleRenderOptions.createLinearOption(
                this._options.bitDepth,
                this._voiSequenceLut.minimumOutputValue,
                this._voiSequenceLut.maximumOutputValue
              )
            )
          );
        } else {
          composite.add(VOILUT.create(this._options));
        }
      } else {
        composite.add(VOILUT.create(this._options));
      }

      const outputLut = new OutputLUT(this._options);
      composite.add(outputLut);

      if (this._options.invert) {
        composite.add(new InvertLUT(outputLut.minimumOutputValue, outputLut.maximumOutputValue));
      }

      this._lut = composite;
    }

    const precalc = new PrecalculatedLUT(
      this._lut,
      this._options.bitDepth.minimumValue,
      this._options.bitDepth.maximumValue
    );
    precalc.recalculate();
    return precalc;
  }

  clearCache(): void {
    this._resetLut();
  }

  private _resetLut(): void {
    this._lut = null;
  }
}
