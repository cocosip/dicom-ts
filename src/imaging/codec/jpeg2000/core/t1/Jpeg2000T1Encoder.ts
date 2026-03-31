import { Jpeg2000MqEncoder } from "../mqc/index.js";
import {
  CBLK_STYLE_LAZY,
  CBLK_STYLE_PTERM,
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

export class Jpeg2000T1Encoder {
  private readonly width: number;
  private readonly height: number;
  private readonly paddedWidth: number;
  private readonly paddedHeight: number;

  private readonly data: Int32Array;
  private readonly flags: Uint32Array;

  private readonly mqEncoder: Jpeg2000MqEncoder;
  private bitplane = 0;
  private orientation = 0;

  private readonly cblkstyle: number;
  private readonly resetContext: boolean;
  private readonly segmentation: boolean;

  private roiShift = 0;
  private lastMaxBitplane = -1;

  constructor(width: number, height: number, cblkstyle: number) {
    this.width = Math.max(1, Math.floor(width));
    this.height = Math.max(1, Math.floor(height));
    this.paddedWidth = this.width + 2;
    this.paddedHeight = this.height + 2;
    this.data = new Int32Array(this.paddedWidth * this.paddedHeight);
    this.flags = new Uint32Array(this.paddedWidth * this.paddedHeight);

    this.cblkstyle = cblkstyle;
    this.resetContext = (cblkstyle & CBLK_STYLE_RESET) !== 0;
    this.segmentation = (cblkstyle & CBLK_STYLE_SEGSYM) !== 0;

    this.mqEncoder = new Jpeg2000MqEncoder(NUM_CONTEXTS);
  }

  setOrientation(orientation: number): void {
    this.orientation = orientation;
  }

  getLastMaxBitplane(): number {
    return this.lastMaxBitplane;
  }

  encode(data: Int32Array | number[], numPasses: number, roiShift: number): Uint8Array {
    return this.encodeInternal(data, numPasses, roiShift, false).data;
  }

  encodeWithPasses(
    data: Int32Array | number[],
    numPasses: number,
    roiShift: number,
  ): { data: Uint8Array; passEndOffsets: number[] } {
    return this.encodeInternal(data, numPasses, roiShift, true);
  }

  private encodeInternal(
    data: Int32Array | number[],
    numPasses: number,
    roiShift: number,
    collectPassEndOffsets: boolean,
  ): { data: Uint8Array; passEndOffsets: number[] } {
    const expected = this.width * this.height;
    if (data.length !== expected) {
      throw new Error(`data size mismatch: expected ${expected}, got ${data.length}`);
    }
    if (!Number.isFinite(numPasses) || numPasses < 0) {
      throw new Error(`invalid numPasses: ${numPasses}`);
    }

    this.roiShift = Math.max(0, Math.floor(roiShift));
    this.clearState();

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const srcIndex = y * this.width + x;
        const dstIndex = (y + 1) * this.paddedWidth + (x + 1);
        this.data[dstIndex] = data[srcIndex] ?? 0;
      }
    }

    const maxBitplane = this.findMaxBitplane();
    this.lastMaxBitplane = maxBitplane;

    this.mqEncoder.reset();
    this.initializeMqContexts(this.mqEncoder);
    const totalPasses = Math.max(0, Math.floor(numPasses));
    const passEndOffsets: number[] = [];

    if (maxBitplane < 0) {
      const encoded = this.mqEncoder.flush();
      return {
        data: encoded,
        passEndOffsets,
      };
    }

    let passIndex = 0;
    let passType = 2;
    let prevTerminated = false;

    for (this.bitplane = maxBitplane; this.bitplane >= 0 && passIndex < totalPasses;) {
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
      if (prevTerminated) {
        if (raw) {
          this.mqEncoder.bypassInitEnc();
        } else {
          this.mqEncoder.restartInitEnc();
        }
        prevTerminated = false;
      }

      switch (passType) {
        case 0:
          this.encodeSigPropPass(raw);
          break;
        case 1:
          this.encodeMagRefPass(raw);
          break;
        case 2:
        default:
          this.encodeCleanupPass();
          if (this.segmentation) {
            this.mqEncoder.segmarkEnc();
          }
          break;
      }

      const terminated = isTerminatingPass(this.bitplane, maxBitplane, passType, this.cblkstyle);
      if (terminated) {
        if (raw) {
          this.mqEncoder.bypassFlushEnc((this.cblkstyle & CBLK_STYLE_PTERM) !== 0);
        } else if ((this.cblkstyle & CBLK_STYLE_PTERM) !== 0) {
          this.mqEncoder.ertermEnc();
        } else {
          this.mqEncoder.flushToOutput();
        }
        prevTerminated = true;
      }
      if (collectPassEndOffsets && terminated) {
        passEndOffsets.push(this.mqEncoder.numBytes());
      }

      if (this.resetContext) {
        this.mqEncoder.resetContexts();
        this.initializeMqContexts(this.mqEncoder);
      }

      passIndex++;
      if (passType === 2) {
        passType = 0;
        this.bitplane--;
      } else {
        passType++;
      }
    }

    const encoded = prevTerminated
      ? this.mqEncoder.getBuffer()
      : this.mqEncoder.flush();

    if (collectPassEndOffsets) {
      if (totalPasses > 0 && passEndOffsets.length === 0) {
        passEndOffsets.push(encoded.length);
      }
      if (passEndOffsets.length > 0) {
        passEndOffsets[passEndOffsets.length - 1] = encoded.length;
      }
      while (passEndOffsets.length < totalPasses) {
        passEndOffsets.push(encoded.length);
      }
    }

    return {
      data: encoded,
      passEndOffsets,
    };
  }

  private findMaxBitplane(): number {
    let maxAbs = 0;
    for (let i = 0; i < this.data.length; i++) {
      const value = this.data[i] ?? 0;
      const absValue = value < 0 ? -value : value;
      if (absValue > maxAbs) {
        maxAbs = absValue;
      }
    }

    if (maxAbs === 0) {
      return -1;
    }

    let bitplane = 0;
    while (maxAbs > 0) {
      maxAbs = Math.floor(maxAbs / 2);
      bitplane++;
    }
    return bitplane - 1;
  }

  private encodeSigPropPass(raw: boolean): void {
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

          const coefficient = this.data[index] ?? 0;
          const absValue = coefficient < 0 ? -coefficient : coefficient;
          const isSignificant = (absValue >> this.bitplane) & 0x01;

          const context = getZeroCodingContext(flags, this.orientation);
          if (raw) {
            this.mqEncoder!.bypassEncode(isSignificant);
          } else {
            this.mqEncoder!.encode(isSignificant, context);
          }

          this.flags[index] = flags | T1_VISIT;

          if (isSignificant !== 0) {
            let signBit = 0;
            if (coefficient < 0) {
              signBit = 1;
              this.flags[index] = (this.flags[index] ?? 0) | T1_SIGN;
            }

            if (raw) {
              this.mqEncoder!.bypassEncode(signBit);
            } else {
              const signContext = getSignCodingContext(flags);
              const signPrediction = getSignPrediction(flags);
              this.mqEncoder!.encode(signBit ^ signPrediction, signContext);
            }

            this.flags[index] = (this.flags[index] ?? 0) | T1_SIG;
            this.updateNeighborFlags(x, y, index);
          }
        }
      }
    }
  }

  private encodeMagRefPass(raw: boolean): void {
    for (let stripeY = 0; stripeY < this.height; stripeY += 4) {
      for (let x = 0; x < this.width; x++) {
        for (let dy = 0; dy < 4 && stripeY + dy < this.height; dy++) {
          const y = stripeY + dy;
          const index = (y + 1) * this.paddedWidth + (x + 1);
          const flags = this.flags[index]!;

          if ((flags & T1_SIG) === 0 || (flags & T1_VISIT) !== 0) {
            continue;
          }

          const coefficient = this.data[index] ?? 0;
          const absValue = coefficient < 0 ? -coefficient : coefficient;
          const refinementBit = (absValue >> this.bitplane) & 0x01;

          const context = getMagRefinementContext(flags);
          if (raw) {
            this.mqEncoder!.bypassEncode(refinementBit);
          } else {
            this.mqEncoder!.encode(refinementBit, context);
          }

          this.flags[index] = (this.flags[index] ?? 0) | T1_REFINE;
        }
      }
    }
  }

  private encodeCleanupPass(): void {
    for (let stripeY = 0; stripeY < this.height; stripeY += 4) {
      for (let x = 0; x < this.width; x++) {
        if (stripeY + 3 < this.height) {
          let canUseRunLength = true;
          let runLengthSignificant = -1;

          for (let dy = 0; dy < 4; dy++) {
            const y = stripeY + dy;
            const index = (y + 1) * this.paddedWidth + (x + 1);
            const flags = this.flags[index]!;

            if ((flags & T1_VISIT) !== 0 || (flags & T1_SIG) !== 0 || (flags & T1_SIG_NEIGHBORS) !== 0) {
              canUseRunLength = false;
              break;
            }

            if (runLengthSignificant === -1) {
              const coefficient = this.data[index] ?? 0;
              const absValue = coefficient < 0 ? -coefficient : coefficient;
              if (((absValue >> this.bitplane) & 0x01) !== 0) {
                runLengthSignificant = dy;
              }
            }
          }

          if (canUseRunLength) {
            const runLengthBit = runLengthSignificant >= 0 ? 1 : 0;
            this.mqEncoder!.encode(runLengthBit, CTXRL);
            if (runLengthBit === 0) {
              continue;
            }

            this.mqEncoder!.encode((runLengthSignificant >> 1) & 0x01, CTXUNI);
            this.mqEncoder!.encode(runLengthSignificant & 0x01, CTXUNI);

            let firstSignificantPending = true;
            for (let dy = runLengthSignificant; dy < 4; dy++) {
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
                const coefficient = this.data[index] ?? 0;
                const absValue = coefficient < 0 ? -coefficient : coefficient;
                significant = (absValue >> this.bitplane) & 0x01;
                this.mqEncoder!.encode(significant, getZeroCodingContext(flags, this.orientation));
              }

              if (significant !== 0) {
                let signBit = 0;
                if ((this.data[index] ?? 0) < 0) {
                  signBit = 1;
                  this.flags[index] = (this.flags[index] ?? 0) | T1_SIGN;
                }

                const signContext = getSignCodingContext(flags);
                const signPrediction = getSignPrediction(flags);
                this.mqEncoder!.encode(signBit ^ signPrediction, signContext);

                this.flags[index] = (this.flags[index] ?? 0) | T1_SIG;
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

          const coefficient = this.data[index] ?? 0;
          const absValue = coefficient < 0 ? -coefficient : coefficient;
          const significant = (absValue >> this.bitplane) & 0x01;

          this.mqEncoder!.encode(significant, getZeroCodingContext(flags, this.orientation));
          if (significant !== 0) {
            let signBit = 0;
            if (coefficient < 0) {
              signBit = 1;
              this.flags[index] = (this.flags[index] ?? 0) | T1_SIGN;
            }

            const signContext = getSignCodingContext(flags);
            const signPrediction = getSignPrediction(flags);
            this.mqEncoder!.encode(signBit ^ signPrediction, signContext);

            this.flags[index] = (this.flags[index] ?? 0) | T1_SIG;
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

  private initializeMqContexts(encoder: Jpeg2000MqEncoder): void {
    encoder.setContextState(CTXUNI, 46);
    encoder.setContextState(CTXRL, 3);
    encoder.setContextState(CTXZCSTART, 4);
  }

  private clearState(): void {
    this.flags.fill(0);
    this.data.fill(0);
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

function isTerminatingPass(bitplane: number, maxBitplane: number, passType: number, cblkstyle: number): boolean {
  if (passType === 2 && bitplane === 0) {
    return true;
  }
  if ((cblkstyle & CBLK_STYLE_TERMALL) !== 0) {
    return true;
  }
  if ((cblkstyle & CBLK_STYLE_LAZY) !== 0) {
    if (bitplane === (maxBitplane - 3) && passType === 2) {
      return true;
    }
    if (bitplane < (maxBitplane - 3) && passType > 0) {
      return true;
    }
  }
  return false;
}
