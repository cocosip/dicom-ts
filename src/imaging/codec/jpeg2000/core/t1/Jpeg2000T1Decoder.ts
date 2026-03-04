import { Jpeg2000MqDecoder } from "../mqc/index.js";
import {
  CBLK_STYLE_LAZY,
  CBLK_STYLE_RESET,
  CBLK_STYLE_SEGSYM,
  CBLK_STYLE_TERMALL,
  CTXRL,
  CTXUNI,
  CTXZCSTART,
  NUM_CONTEXTS,
  T1_REFINE,
  T1_SIG,
  T1_SIG_E,
  T1_SIG_N,
  T1_SIG_NE,
  T1_SIG_NEIGHBORS,
  T1_SIG_NW,
  T1_SIG_S,
  T1_SIG_SE,
  T1_SIG_SW,
  T1_SIG_W,
  T1_SIGN,
  T1_SIGN_E,
  T1_SIGN_N,
  T1_SIGN_S,
  T1_SIGN_W,
  T1_VISIT,
  getMagRefinementContext,
  getSignCodingContext,
  getSignPrediction,
  getZeroCodingContext,
} from "./Jpeg2000T1ContextModel.js";

export interface Jpeg2000DecodedCodeBlockCoefficients {
  width: number;
  height: number;
  coefficients: Int32Array;
}

export class Jpeg2000T1Decoder {
  private readonly width: number;
  private readonly height: number;
  private readonly paddedWidth: number;
  private readonly paddedHeight: number;

  private readonly data: Int32Array;
  private readonly flags: Uint32Array;

  private mqDecoder: Jpeg2000MqDecoder | undefined;

  private bitplane = 0;
  private orientation = 0;

  private readonly cblkstyle: number;
  private readonly resetContext: boolean;
  private readonly termAll: boolean;
  private readonly segmentation: boolean;

  private roiShift = 0;

  constructor(width: number, height: number, cblkstyle: number) {
    this.width = Math.max(1, Math.floor(width));
    this.height = Math.max(1, Math.floor(height));
    this.paddedWidth = this.width + 2;
    this.paddedHeight = this.height + 2;

    this.data = new Int32Array(this.paddedWidth * this.paddedHeight);
    this.flags = new Uint32Array(this.paddedWidth * this.paddedHeight);

    this.cblkstyle = cblkstyle;
    this.resetContext = (cblkstyle & CBLK_STYLE_RESET) !== 0;
    this.termAll = (cblkstyle & CBLK_STYLE_TERMALL) !== 0;
    this.segmentation = (cblkstyle & CBLK_STYLE_SEGSYM) !== 0;
  }

  setOrientation(orientation: number): void {
    this.orientation = orientation;
  }

  decodeWithBitplane(data: Uint8Array, numPasses: number, maxBitplane: number, roiShift: number): void {
    this.decodeWithOptions(data, numPasses, maxBitplane, roiShift, false);
  }

  decodeLayered(data: Uint8Array, passLengths: number[], maxBitplane: number, roiShift: number): void {
    this.decodeLayeredWithMode(data, passLengths, maxBitplane, roiShift, true, false);
  }

  decodeLayeredWithMode(
    data: Uint8Array,
    passLengths: number[],
    maxBitplane: number,
    roiShift: number,
    useTermAll: boolean,
    resetContexts: boolean,
  ): void {
    if (data.length === 0) {
      throw new Error("empty code-block data");
    }
    if (passLengths.length === 0) {
      throw new Error("no pass lengths provided");
    }

    if (!useTermAll) {
      this.decodeWithOptions(data, passLengths.length, maxBitplane, roiShift, false);
      return;
    }

    this.roiShift = Math.max(0, Math.floor(roiShift));
    this.clearState();

    const passCount = passLengths.length;
    let passIndex = 0;
    let previousEnd = 0;
    let previousContexts: Uint8Array | undefined;
    let passType = 2;

    for (this.bitplane = maxBitplane; this.bitplane >= 0 && passIndex < passCount;) {
      const startOfBitplane = passType === 0 || (passType === 2 && passIndex === 0);
      if (startOfBitplane) {
        this.clearVisitFlags();
        if (this.roiShift > 0 && this.bitplane >= this.roiShift) {
          passType = 0;
          this.bitplane--;
          continue;
        }
      }

      const currentEnd = passLengths[passIndex]!;
      if (currentEnd < previousEnd || currentEnd > data.length) {
        throw new Error(
          `invalid pass length at pass ${passIndex}: ${currentEnd} (prev=${previousEnd}, data=${data.length})`,
        );
      }

      const passData = data.slice(previousEnd, currentEnd);
      const raw = isLazyRawPass(this.bitplane, maxBitplane, passType, this.cblkstyle);
      if (raw) {
        this.mqDecoder = Jpeg2000MqDecoder.createRawDecoder(passData);
      } else if (passIndex === 0 || resetContexts || !previousContexts) {
        this.mqDecoder = this.createMqDecoder(passData);
      } else {
        this.mqDecoder = new Jpeg2000MqDecoder(passData, NUM_CONTEXTS);
        this.mqDecoder.setContexts(previousContexts);
      }

      previousEnd = currentEnd;

      this.decodeSinglePass(passType, raw);

      if (!raw && !resetContexts) {
        previousContexts = this.mqDecoder.getContexts();
      }

      passIndex++;
      if (passType === 2) {
        passType = 0;
        this.bitplane--;
      } else {
        passType++;
      }
    }
  }

  getData(): Int32Array {
    const output = new Int32Array(this.width * this.height);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const sourceIndex = (y + 1) * this.paddedWidth + (x + 1);
        output[y * this.width + x] = this.data[sourceIndex]!;
      }
    }

    return output;
  }

  decodeToCoefficients(data: Uint8Array, numPasses: number, maxBitplane: number, roiShift: number): Jpeg2000DecodedCodeBlockCoefficients {
    this.decodeWithBitplane(data, numPasses, maxBitplane, roiShift);
    return {
      width: this.width,
      height: this.height,
      coefficients: this.getData(),
    };
  }

  private decodeWithOptions(
    data: Uint8Array,
    numPasses: number,
    maxBitplane: number,
    roiShift: number,
    useTermAll: boolean,
  ): void {
    const effectiveTermAll = useTermAll || this.termAll;

    if (data.length === 0) {
      throw new Error("empty code-block data");
    }

    this.roiShift = Math.max(0, Math.floor(roiShift));
    this.clearState();

    this.mqDecoder = this.createMqDecoder(data);

    let passIndex = 0;
    let passType = 2;

    for (this.bitplane = maxBitplane; this.bitplane >= 0 && passIndex < numPasses;) {
      const startOfBitplane = passType === 0 || (passType === 2 && passIndex === 0);
      if (startOfBitplane) {
        this.clearVisitFlags();
        if (this.roiShift > 0 && this.bitplane >= this.roiShift) {
          passType = 0;
          this.bitplane--;
          continue;
        }
      }

      const raw = isLazyRawPass(this.bitplane, maxBitplane, passType, this.cblkstyle);
      this.decodeSinglePass(passType, raw);

      passIndex++;

      if (effectiveTermAll && passIndex < numPasses && this.mqDecoder) {
        this.mqDecoder.reinitAfterTermination();
        this.mqDecoder.resetContexts();
        this.initializeMqContexts(this.mqDecoder);
      }

      if (this.resetContext && passIndex < numPasses && !raw && this.mqDecoder) {
        this.mqDecoder.resetContexts();
        this.initializeMqContexts(this.mqDecoder);
      }

      if (passType === 2) {
        passType = 0;
        this.bitplane--;
      } else {
        passType++;
      }
    }
  }

  private decodeSinglePass(passType: number, raw: boolean): void {
    switch (passType) {
      case 0:
        this.decodeSigPropPass(raw);
        return;
      case 1:
        this.decodeMagRefPass(raw);
        return;
      case 2:
      default:
        this.decodeCleanupPass();
        if (this.segmentation) {
          for (let i = 0; i < 4; i++) {
            this.mqDecoder!.decode(CTXUNI);
          }
        }
    }
  }

  private decodeSigPropPass(raw: boolean): void {
    for (let stripeY = 0; stripeY < this.height; stripeY += 4) {
      for (let x = 0; x < this.width; x++) {
        for (let dy = 0; dy < 4 && stripeY + dy < this.height; dy++) {
          const y = stripeY + dy;
          const index = (y + 1) * this.paddedWidth + (x + 1);
          const flags = this.flags[index]!;

          if ((flags & T1_SIG) !== 0) {
            continue;
          }
          if ((flags & T1_SIG_NEIGHBORS) === 0) {
            continue;
          }

          const context = getZeroCodingContext(flags, this.orientation);
          const bit = raw ? this.mqDecoder!.rawDecode() : this.mqDecoder!.decode(context);

          this.flags[index] = flags | T1_VISIT;

          if (bit === 0) {
            continue;
          }

          let sign = 0;
          if (raw) {
            sign = this.mqDecoder!.rawDecode();
          } else {
            const signContext = getSignCodingContext(flags);
            sign = this.mqDecoder!.decode(signContext) ^ getSignPrediction(flags);
          }

          const value = 1 << this.bitplane;
          this.flags[index] |= T1_SIG;

          if (sign !== 0) {
            this.flags[index] |= T1_SIGN;
            this.data[index] = -value;
          } else {
            this.data[index] = value;
          }

          this.updateNeighborFlags(x, y, index);
        }
      }
    }
  }

  private decodeMagRefPass(raw: boolean): void {
    for (let stripeY = 0; stripeY < this.height; stripeY += 4) {
      for (let x = 0; x < this.width; x++) {
        for (let dy = 0; dy < 4 && stripeY + dy < this.height; dy++) {
          const y = stripeY + dy;
          const index = (y + 1) * this.paddedWidth + (x + 1);
          const flags = this.flags[index]!;

          if ((flags & T1_SIG) === 0 || (flags & T1_VISIT) !== 0) {
            continue;
          }

          const context = getMagRefinementContext(flags);
          const bit = raw ? this.mqDecoder!.rawDecode() : this.mqDecoder!.decode(context);

          if (bit !== 0) {
            const delta = 1 << this.bitplane;
            if (this.data[index]! >= 0) {
              this.data[index]! += delta;
            } else {
              this.data[index]! -= delta;
            }
          }

          this.flags[index] = (this.flags[index] ?? 0) | T1_REFINE;
        }
      }
    }
  }

  private decodeCleanupPass(): void {
    for (let stripeY = 0; stripeY < this.height; stripeY += 4) {
      for (let x = 0; x < this.width; x++) {
        if (stripeY + 3 < this.height) {
          let canRunLengthDecode = true;
          for (let dy = 0; dy < 4; dy++) {
            const y = stripeY + dy;
            const index = (y + 1) * this.paddedWidth + (x + 1);
            const flags = this.flags[index]!;

            if ((flags & T1_VISIT) !== 0 || (flags & T1_SIG) !== 0 || (flags & T1_SIG_NEIGHBORS) !== 0) {
              canRunLengthDecode = false;
              break;
            }
          }

          if (canRunLengthDecode) {
            const runLengthBit = this.mqDecoder!.decode(CTXRL);
            if (runLengthBit === 0) {
              continue;
            }

            let runLength = 0;
            runLength |= this.mqDecoder!.decode(CTXUNI) << 1;
            runLength |= this.mqDecoder!.decode(CTXUNI);

            let firstSignificantPending = true;
            for (let dy = runLength; dy < 4; dy++) {
              const y = stripeY + dy;
              const index = (y + 1) * this.paddedWidth + (x + 1);
              const flags = this.flags[index]!;

              if ((flags & T1_VISIT) !== 0 || (flags & T1_SIG) !== 0) {
                this.flags[index] = flags & ~T1_VISIT;
                continue;
              }

              let significant = 0;
              if (firstSignificantPending) {
                significant = 1;
                firstSignificantPending = false;
              } else {
                significant = this.mqDecoder!.decode(getZeroCodingContext(flags, this.orientation));
              }

              if (significant !== 0) {
                const sign = this.mqDecoder!.decode(getSignCodingContext(flags)) ^ getSignPrediction(flags);
                const value = 1 << this.bitplane;
                this.flags[index] = flags | T1_SIG;
                if (sign !== 0) {
                  this.flags[index] |= T1_SIGN;
                  this.data[index] = -value;
                } else {
                  this.data[index] = value;
                }
                this.updateNeighborFlags(x, y, index);
              }

              this.flags[index] = (this.flags[index] ?? 0) & ~T1_VISIT;
            }
            continue;
          }
        }

        for (let dy = 0; dy < 4 && stripeY + dy < this.height; dy++) {
          const y = stripeY + dy;
          const index = (y + 1) * this.paddedWidth + (x + 1);
          const flags = this.flags[index]!;

          if ((flags & T1_VISIT) !== 0 || (flags & T1_SIG) !== 0) {
            this.flags[index] = flags & ~T1_VISIT;
            continue;
          }

          const significant = this.mqDecoder!.decode(getZeroCodingContext(flags, this.orientation));
          if (significant !== 0) {
            const sign = this.mqDecoder!.decode(getSignCodingContext(flags)) ^ getSignPrediction(flags);
            const value = 1 << this.bitplane;
            this.flags[index] = flags | T1_SIG;

            if (sign !== 0) {
              this.flags[index] |= T1_SIGN;
              this.data[index] = -value;
            } else {
              this.data[index] = value;
            }

            this.updateNeighborFlags(x, y, index);
          }

          this.flags[index] = (this.flags[index] ?? 0) & ~T1_VISIT;
        }
      }
    }
  }

  private updateNeighborFlags(x: number, y: number, index: number): void {
    const sign = this.flags[index]! & T1_SIGN;

    const north = y * this.paddedWidth + (x + 1);
    this.flags[north] = (this.flags[north] ?? 0) | T1_SIG_S;
    if (sign !== 0) {
      this.flags[north] = (this.flags[north] ?? 0) | T1_SIGN_S;
    }

    const south = (y + 2) * this.paddedWidth + (x + 1);
    this.flags[south] = (this.flags[south] ?? 0) | T1_SIG_N;
    if (sign !== 0) {
      this.flags[south] = (this.flags[south] ?? 0) | T1_SIGN_N;
    }

    const west = (y + 1) * this.paddedWidth + x;
    this.flags[west] = (this.flags[west] ?? 0) | T1_SIG_E;
    if (sign !== 0) {
      this.flags[west] = (this.flags[west] ?? 0) | T1_SIGN_E;
    }

    const east = (y + 1) * this.paddedWidth + (x + 2);
    this.flags[east] = (this.flags[east] ?? 0) | T1_SIG_W;
    if (sign !== 0) {
      this.flags[east] = (this.flags[east] ?? 0) | T1_SIGN_W;
    }

    const northWest = y * this.paddedWidth + x;
    const northEast = y * this.paddedWidth + (x + 2);
    const southWest = (y + 2) * this.paddedWidth + x;
    const southEast = (y + 2) * this.paddedWidth + (x + 2);
    this.flags[northWest] = (this.flags[northWest] ?? 0) | T1_SIG_SE;
    this.flags[northEast] = (this.flags[northEast] ?? 0) | T1_SIG_SW;
    this.flags[southWest] = (this.flags[southWest] ?? 0) | T1_SIG_NE;
    this.flags[southEast] = (this.flags[southEast] ?? 0) | T1_SIG_NW;
  }

  private createMqDecoder(data: Uint8Array): Jpeg2000MqDecoder {
    const decoder = new Jpeg2000MqDecoder(data, NUM_CONTEXTS);
    this.initializeMqContexts(decoder);
    return decoder;
  }

  private initializeMqContexts(decoder: Jpeg2000MqDecoder): void {
    decoder.setContextState(CTXUNI, 46);
    decoder.setContextState(CTXRL, 3);
    decoder.setContextState(CTXZCSTART, 4);
  }

  private clearState(): void {
    this.data.fill(0);
    this.flags.fill(0);
  }

  private clearVisitFlags(): void {
    for (let i = 0; i < this.flags.length; i++) {
      this.flags[i] = this.flags[i]! & ~T1_VISIT;
    }
  }
}

function isLazyRawPass(bitplane: number, maxBitplane: number, passType: number, cblkstyle: number): boolean {
  if ((cblkstyle & CBLK_STYLE_LAZY) === 0) {
    return false;
  }
  if (passType >= 2) {
    return false;
  }
  return bitplane < (maxBitplane - 3);
}
