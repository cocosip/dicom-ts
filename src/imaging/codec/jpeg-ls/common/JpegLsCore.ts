import * as JpegMarkers from "../../jpeg/common/JpegMarkers.js";

const SOF55 = 0xfff7;
const LSE = 0xfff8;
const J = [
  0, 0, 0, 0, 1, 1, 1, 1,
  2, 2, 2, 2, 3, 3, 3, 3,
  4, 4, 5, 5, 6, 6, 7, 7,
  8, 9, 10, 11, 12, 13, 14, 15,
] as const;

interface ParseState {
  width: number;
  height: number;
  components: number;
  bitDepth: number;
  maxVal: number;
  near: number;
  t1: number;
  t2: number;
  t3: number;
  reset: number;
  interleaveMode: number;
}

interface CodingParameters {
  range: number;
  qbpp: number;
  limit: number;
  t1: number;
  t2: number;
  t3: number;
  reset: number;
}

class JpegLsStreamReader {
  private pos = 0;

  constructor(private readonly data: Uint8Array) {}

  readByte(): number {
    if (this.pos >= this.data.length) {
      throw new Error("Unexpected end of JPEG-LS stream");
    }
    return this.data[this.pos++]!;
  }

  readUint16(): number {
    return (this.readByte() << 8) | this.readByte();
  }

  readMarker(): number {
    let b = this.readByte();
    while (b !== 0xff) {
      b = this.readByte();
    }
    while (b === 0xff) {
      b = this.readByte();
    }
    return 0xff00 | b;
  }

  readSegment(): Uint8Array {
    const length = this.readUint16();
    if (length < 2) {
      throw new Error(`Invalid JPEG-LS segment length: ${length}`);
    }
    const size = length - 2;
    if (this.pos + size > this.data.length) {
      throw new Error("JPEG-LS segment exceeds stream length");
    }
    const segment = this.data.subarray(this.pos, this.pos + size);
    this.pos += size;
    return segment;
  }

  readScanData(): Uint8Array {
    const bytes: number[] = [];
    while (this.pos < this.data.length) {
      const b = this.data[this.pos++]!;
      if (b !== 0xff) {
        bytes.push(b);
        continue;
      }

      if (this.pos >= this.data.length) {
        bytes.push(b);
        break;
      }

      const b2 = this.data[this.pos]!;
      if (b2 < 0x80) {
        bytes.push(b, b2);
        this.pos++;
        continue;
      }

      break;
    }

    return new Uint8Array(bytes);
  }
}

class JpegLsStreamWriter {
  private readonly bytes: number[] = [];

  writeMarker(marker: number): void {
    this.bytes.push((marker >>> 8) & 0xff, marker & 0xff);
  }

  writeSegment(marker: number, data: Uint8Array): void {
    this.writeMarker(marker);
    const length = data.length + 2;
    this.bytes.push((length >>> 8) & 0xff, length & 0xff);
    for (const byte of data) {
      this.bytes.push(byte);
    }
  }

  writeBytes(data: Uint8Array): void {
    for (const byte of data) {
      this.bytes.push(byte);
    }
  }

  toUint8Array(): Uint8Array {
    return new Uint8Array(this.bytes);
  }
}

class JpegLsBitWriter {
  private readonly bytes: number[] = [];
  private current = 0;
  private bitsInCurrent = 0;
  private afterFF = false;

  writeBit(bit: number): void {
    this.current = (this.current << 1) | (bit & 1);
    this.bitsInCurrent++;

    const capacity = this.afterFF ? 7 : 8;
    if (this.bitsInCurrent === capacity) {
      this.emitByte(this.afterFF ? (this.current & 0x7f) : (this.current & 0xff));
    }
  }

  writeBits(value: number, bitCount: number): void {
    for (let i = bitCount - 1; i >= 0; i--) {
      this.writeBit((value >>> i) & 1);
    }
  }

  writeUnary(zerosBeforeOne: number): void {
    for (let i = 0; i < zerosBeforeOne; i++) {
      this.writeBit(0);
    }
    this.writeBit(1);
  }

  writeZeros(count: number): void {
    for (let i = 0; i < count; i++) {
      this.writeBit(0);
    }
  }

  encodeMappedValue(k: number, mappedError: number, limit: number, quantizedBitsPerPixel: number): void {
    const highBits = mappedError >> k;

    if (highBits < limit - (quantizedBitsPerPixel + 1)) {
      this.writeUnary(highBits);
      if (k > 0) {
        const remainderMask = (1 << k) - 1;
        this.writeBits(mappedError & remainderMask, k);
      }
      return;
    }

    const escapeBits = limit - quantizedBitsPerPixel;
    this.writeUnary(escapeBits - 1);
    const value = (mappedError - 1) & ((1 << quantizedBitsPerPixel) - 1);
    this.writeBits(value, quantizedBitsPerPixel);
  }

  flush(): Uint8Array {
    if (this.bitsInCurrent > 0) {
      const capacity = this.afterFF ? 7 : 8;
      this.writeZeros(capacity - this.bitsInCurrent);
    }

    if (this.afterFF && this.bitsInCurrent === 0) {
      this.writeZeros(7);
    }

    return new Uint8Array(this.bytes);
  }

  private emitByte(byte: number): void {
    const output = byte & 0xff;
    this.bytes.push(output);
    this.current = 0;
    this.bitsInCurrent = 0;
    this.afterFF = output === 0xff;
  }
}

class JpegLsBitReader {
  private pos = 0;
  private current = 0;
  private bitsRemaining = 0;
  private afterFF = false;

  constructor(private readonly data: Uint8Array) {}

  readBit(): number {
    if (this.bitsRemaining === 0) {
      this.loadChunk();
    }

    this.bitsRemaining--;
    return (this.current >>> this.bitsRemaining) & 1;
  }

  readBits(count: number): number {
    let value = 0;
    for (let i = 0; i < count; i++) {
      value = (value << 1) | this.readBit();
    }
    return value;
  }

  decodeValue(k: number, limit: number, quantizedBitsPerPixel: number): number {
    let highBits = 0;
    while (true) {
      const bit = this.readBit();
      if (bit === 1) {
        break;
      }
      highBits++;
      if (highBits > 1 << 20) {
        throw new Error("Invalid JPEG-LS unary code");
      }
    }

    if (highBits >= limit - (quantizedBitsPerPixel + 1)) {
      return this.readBits(quantizedBitsPerPixel) + 1;
    }

    if (k === 0) {
      return highBits;
    }

    const remainder = this.readBits(k);
    return (highBits << k) + remainder;
  }

  private loadChunk(): void {
    if (this.pos >= this.data.length) {
      throw new Error("Unexpected end of JPEG-LS scan data");
    }

    const nextByte = this.data[this.pos++]!;
    if (this.afterFF) {
      this.current = nextByte & 0x7f;
      this.bitsRemaining = 7;
      this.afterFF = false;
      return;
    }

    this.current = nextByte;
    this.bitsRemaining = 8;
    this.afterFF = nextByte === 0xff;
  }
}

class RegularModeContext {
  A: number;
  N: number;
  B: number;
  C: number;

  constructor(range: number) {
    const aInit = max(2, Math.floor((range + 32) / 64));
    this.A = aInit;
    this.N = 1;
    this.B = 0;
    this.C = 0;
  }

  computeGolombParameter(): number {
    let k = 0;
    while ((this.N << k) < this.A && k < 16) {
      k++;
    }
    return k;
  }

  update(errorValue: number, near: number, reset: number): void {
    this.A += abs(errorValue);
    this.B += errorValue * (2 * near + 1);

    if (this.N === reset) {
      this.A >>= 1;
      this.B >>= 1;
      this.N >>= 1;
    }

    this.N++;

    if (this.B + this.N <= 0) {
      this.B += this.N;
      if (this.B <= -this.N) {
        this.B = -this.N + 1;
      }
      if (this.C > -128) {
        this.C--;
      }
      return;
    }

    if (this.B > 0) {
      this.B -= this.N;
      if (this.B > 0) {
        this.B = 0;
      }
      if (this.C < 127) {
        this.C++;
      }
    }
  }

  getErrorCorrection(k: number, near: number): number {
    if (k !== 0 || near !== 0) {
      return 0;
    }
    return (2 * this.B + this.N - 1) < 0 ? -1 : 0;
  }
}

class RunModeContext {
  readonly runInterruptionType: number;
  A: number;
  N: number;
  NN: number;

  constructor(runInterruptionType: number, range: number) {
    this.runInterruptionType = runInterruptionType;
    this.A = max(2, Math.floor((range + 32) / 64));
    this.N = 1;
    this.NN = 0;
  }

  getGolombParameter(): number {
    const temp = this.A + ((this.N >> 1) * this.runInterruptionType);
    let nTest = this.N;
    let k = 0;
    while (nTest < temp && k < 32) {
      nTest <<= 1;
      k++;
    }
    return k;
  }

  update(errorValue: number, mappedErrorValue: number, reset: number): void {
    if (errorValue < 0) {
      this.NN++;
    }

    this.A += (mappedErrorValue + 1 - this.runInterruptionType) >> 1;

    if (this.N === reset) {
      this.A >>= 1;
      this.N >>= 1;
      this.NN >>= 1;
    }

    this.N++;
  }

  computeMap(errorValue: number, k: number): boolean {
    if (k === 0 && errorValue > 0 && 2 * this.NN < this.N) {
      return true;
    }
    if (errorValue < 0 && 2 * this.NN >= this.N) {
      return true;
    }
    if (errorValue < 0 && k !== 0) {
      return true;
    }
    return false;
  }

  computeErrorValue(temp: number, k: number): number {
    const mapBit = temp & 1;
    const errorAbs = Math.floor((temp + mapBit) / 2);
    const mapCondition = k !== 0 || 2 * this.NN >= this.N;
    if (mapCondition === (mapBit !== 0)) {
      return -errorAbs;
    }
    return errorAbs;
  }
}

class RunModeScanner {
  runIndex = 0;
  readonly contexts: [RunModeContext, RunModeContext];

  constructor(private readonly traits: Traits) {
    this.contexts = [
      new RunModeContext(0, traits.range),
      new RunModeContext(1, traits.range),
    ];
  }

  incrementRunIndex(): void {
    if (this.runIndex < 31) {
      this.runIndex++;
    }
  }

  decrementRunIndex(): void {
    if (this.runIndex > 0) {
      this.runIndex--;
    }
  }

  encodeRunLength(writer: JpegLsBitWriter, runLength: number, endOfLine: boolean): void {
    while (runLength >= (1 << J[this.runIndex]!)) {
      writer.writeBit(1);
      runLength -= 1 << J[this.runIndex]!;
      this.incrementRunIndex();
    }

    if (endOfLine) {
      if (runLength !== 0) {
        writer.writeBit(1);
      }
      return;
    }

    writer.writeBits(runLength, J[this.runIndex]! + 1);
  }

  decodeRunLength(reader: JpegLsBitReader, remainingInLine: number): number {
    let runLength = 0;

    while (true) {
      const bit = reader.readBit();
      if (bit !== 1) {
        break;
      }

      const count = min(1 << J[this.runIndex]!, remainingInLine - runLength);
      runLength += count;
      if (count === (1 << J[this.runIndex]!)) {
        this.incrementRunIndex();
      }

      if (runLength >= remainingInLine) {
        return remainingInLine;
      }
    }

    if (J[this.runIndex]! > 0) {
      runLength += reader.readBits(J[this.runIndex]!);
    }

    if (runLength > remainingInLine) {
      throw new Error(`Decoded JPEG-LS run length overflow: ${runLength} > ${remainingInLine}`);
    }

    return runLength;
  }

  encodeRunInterruption(writer: JpegLsBitWriter, context: RunModeContext, errorValue: number): void {
    const k = context.getGolombParameter();
    let mappedError = 2 * abs(errorValue) - context.runInterruptionType;
    if (context.computeMap(errorValue, k)) {
      mappedError--;
    }

    writer.encodeMappedValue(k, mappedError, this.traits.limit - J[this.runIndex]! - 1, this.traits.qbpp);
    context.update(errorValue, mappedError, this.traits.reset);
  }

  decodeRunInterruption(reader: JpegLsBitReader, context: RunModeContext): number {
    const k = context.getGolombParameter();
    const mappedError = reader.decodeValue(k, this.traits.limit - J[this.runIndex]! - 1, this.traits.qbpp);
    const errorValue = context.computeErrorValue(mappedError + context.runInterruptionType, k);
    context.update(errorValue, mappedError, this.traits.reset);
    return errorValue;
  }
}

class GradientQuantizer {
  constructor(
    readonly t1: number,
    readonly t2: number,
    readonly t3: number,
    readonly near: number,
  ) {}

  computeContext(a: number, b: number, c: number, d: number): [number, number, number] {
    const d1 = d - b;
    const d2 = b - c;
    const d3 = c - a;
    return [this.quantizeGradient(d1), this.quantizeGradient(d2), this.quantizeGradient(d3)];
  }

  private quantizeGradient(value: number): number {
    if (value <= -this.t3) return -4;
    if (value <= -this.t2) return -3;
    if (value <= -this.t1) return -2;
    if (value < -this.near) return -1;
    if (value <= this.near) return 0;
    if (value < this.t1) return 1;
    if (value < this.t2) return 2;
    if (value < this.t3) return 3;
    return 4;
  }
}

class Traits {
  readonly range: number;
  readonly qbpp: number;
  readonly limit: number;
  readonly reset: number;

  constructor(
    readonly maxVal: number,
    readonly near: number,
    params: CodingParameters,
  ) {
    this.range = params.range;
    this.qbpp = params.qbpp;
    this.limit = params.limit;
    this.reset = params.reset;
  }

  correctPrediction(prediction: number): number {
    if (prediction < 0) {
      return 0;
    }
    if (prediction > this.maxVal) {
      return this.maxVal;
    }
    return prediction;
  }

  computeErrorValue(value: number): number {
    return this.moduloRange(this.quantize(value));
  }

  computeReconstructedSample(prediction: number, errorValue: number): number {
    return this.fixReconstructedValue(prediction + this.dequantize(errorValue));
  }

  private fixReconstructedValue(value: number): number {
    if (this.near === 0 && ((this.maxVal + 1) & this.maxVal) === 0) {
      return value & this.maxVal;
    }

    if (value < -this.near) {
      value += this.range * (2 * this.near + 1);
    } else if (value > this.maxVal + this.near) {
      value -= this.range * (2 * this.near + 1);
    }

    return this.correctPrediction(value);
  }

  private dequantize(errorValue: number): number {
    return errorValue * (2 * this.near + 1);
  }

  private quantize(errorValue: number): number {
    if (this.near === 0) {
      return errorValue;
    }

    if (errorValue > 0) {
      return Math.floor((errorValue + this.near) / (2 * this.near + 1));
    }

    return -Math.floor((this.near - errorValue) / (2 * this.near + 1));
  }

  private moduloRange(errorValue: number): number {
    if (errorValue < 0) {
      errorValue += this.range;
    }
    if (errorValue >= Math.floor((this.range + 1) / 2)) {
      errorValue -= this.range;
    }
    return errorValue;
  }
}

class CodecModel {
  readonly contexts: RegularModeContext[];
  readonly quantizer: GradientQuantizer;
  readonly runMode: RunModeScanner;

  constructor(
    readonly width: number,
    readonly height: number,
    readonly components: number,
    readonly bitDepth: number,
    readonly near: number,
    readonly interleaveMode: number,
    readonly traits: Traits,
    t1: number,
    t2: number,
    t3: number,
  ) {
    this.quantizer = new GradientQuantizer(t1, t2, t3, near);
    this.runMode = new RunModeScanner(traits);

    this.contexts = [];
    for (let i = 0; i < 365; i++) {
      this.contexts.push(new RegularModeContext(traits.range));
    }
  }

  encodeScanData(rawPixelData: Uint8Array): Uint8Array {
    const writer = new JpegLsBitWriter();
    const samples = toIntegerSamples(rawPixelData, this.bitDepth);

    if (this.interleaveMode === 1) {
      this.encodeLineInterleaved(writer, samples);
      return writer.flush();
    }

    for (let component = 0; component < this.components; component++) {
      this.encodeComponent(writer, samples, component);
    }

    return writer.flush();
  }

  decodeScanData(scanData: Uint8Array): Uint8Array {
    const reader = new JpegLsBitReader(scanData);
    const samples = new Array<number>(this.width * this.height * this.components).fill(0);

    if (this.interleaveMode === 1) {
      this.decodeLineInterleaved(reader, samples);
      return fromIntegerSamples(samples, this.bitDepth, this.maxVal);
    }

    for (let component = 0; component < this.components; component++) {
      this.decodeComponent(reader, samples, component);
    }

    return fromIntegerSamples(samples, this.bitDepth, this.maxVal);
  }

  private get maxVal(): number {
    return this.traits.maxVal;
  }

  private encodeComponent(writer: JpegLsBitWriter, samples: number[], component: number): void {
    const stride = this.components;
    const offset = component;

    let prevFirstPrev = 0;
    let prevNeg1 = 0;

    for (let y = 0; y < this.height; y++) {
      let x = 0;

      while (x < this.width) {
        const idx = (y * this.width + x) * stride + offset;
        if (idx >= samples.length) {
          x++;
          continue;
        }

        const currentSample = samples[idx]!;
        let ra = 0;
        let rb = 0;
        let rc = 0;
        let rd = 0;

        if (x === 0) {
          ra = prevFirstPrev;
          rb = y > 0 ? prevFirstPrev : 0;
          rc = prevNeg1;
          if (y > 0 && this.width > 1) {
            const rdIdx = ((y - 1) * this.width + (x + 1)) * stride + offset;
            rd = rdIdx < samples.length ? samples[rdIdx]! : rb;
          } else {
            rd = rb;
          }
        } else {
          [ra, rb, rc, rd] = getNeighbors(samples, this.width, this.height, this.components, x, y, component);
        }

        const [q1, q2, q3] = this.quantizer.computeContext(ra, rb, rc, rd);
        const contextId = computeContextID(q1, q2, q3);

        if (contextId !== 0) {
          const signBit = bitwiseSign(contextId);
          const contextIndex = applySign(contextId, signBit);
          const context = this.contexts[contextIndex]!;
          const k = context.computeGolombParameter();

          const prediction = predict(ra, rb, rc);
          const correctedPrediction = this.traits.correctPrediction(prediction + applySign(context.C, signBit));

          const errorValue = this.traits.computeErrorValue(applySign(currentSample - correctedPrediction, signBit));
          const correction = context.getErrorCorrection(k | this.near, this.near);
          const mappedError = mapErrorValue(correction ^ errorValue);

          writer.encodeMappedValue(k, mappedError, this.traits.limit, this.traits.qbpp);
          context.update(errorValue, this.near, this.traits.reset);

          samples[idx] = this.traits.computeReconstructedSample(
            correctedPrediction,
            applySign(errorValue, signBit),
          );

          x++;
          continue;
        }

        const processed = this.encodeRunMode(writer, samples, x, y, component, ra);
        x += processed;
      }

      const firstIdx = (y * this.width) * stride + offset;
      if (firstIdx < samples.length) {
        const nextFirst = samples[firstIdx]!;
        prevNeg1 = prevFirstPrev;
        prevFirstPrev = nextFirst;
      }
    }
  }

  private encodeLineInterleaved(writer: JpegLsBitWriter, samples: number[]): void {
    const prevFirstPrev = new Array<number>(this.components).fill(0);
    const prevNeg1 = new Array<number>(this.components).fill(0);
    const runIndex = new Array<number>(this.components).fill(0);

    for (let y = 0; y < this.height; y++) {
      for (let component = 0; component < this.components; component++) {
        this.runMode.runIndex = runIndex[component]!;
        this.encodeComponentLine(writer, samples, component, y, prevFirstPrev, prevNeg1);
        runIndex[component] = this.runMode.runIndex;
      }
    }
  }

  private decodeComponent(reader: JpegLsBitReader, samples: number[], component: number): void {
    const stride = this.components;
    const offset = component;

    let prevFirstPrev = 0;
    let prevNeg1 = 0;

    for (let y = 0; y < this.height; y++) {
      let x = 0;

      while (x < this.width) {
        const idx = (y * this.width + x) * stride + offset;
        let ra = 0;
        let rb = 0;
        let rc = 0;
        let rd = 0;

        if (x === 0) {
          ra = prevFirstPrev;
          rb = y > 0 ? prevFirstPrev : 0;
          rc = prevNeg1;
          if (y > 0 && this.width > 1) {
            const rdIdx = ((y - 1) * this.width + (x + 1)) * stride + offset;
            rd = rdIdx < samples.length ? samples[rdIdx]! : rb;
          } else {
            rd = rb;
          }
        } else {
          [ra, rb, rc, rd] = getNeighbors(samples, this.width, this.height, this.components, x, y, component);
        }

        const [q1, q2, q3] = this.quantizer.computeContext(ra, rb, rc, rd);
        const contextId = computeContextID(q1, q2, q3);

        if (contextId !== 0) {
          const signBit = bitwiseSign(contextId);
          const contextIndex = applySign(contextId, signBit);
          const context = this.contexts[contextIndex]!;
          const k = context.computeGolombParameter();

          const prediction = predict(ra, rb, rc);
          const correctedPrediction = this.traits.correctPrediction(prediction + applySign(context.C, signBit));

          const mappedError = reader.decodeValue(k, this.traits.limit, this.traits.qbpp);
          let errorValue = unmapErrorValue(mappedError);
          if (k === 0) {
            errorValue ^= context.getErrorCorrection(k, this.near);
          }

          context.update(errorValue, this.near, this.traits.reset);

          samples[idx] = this.traits.computeReconstructedSample(
            correctedPrediction,
            applySign(errorValue, signBit),
          );

          x++;
          continue;
        }

        const processed = this.decodeRunMode(reader, samples, x, y, component, ra);
        x += processed;
      }

      const firstIdx = (y * this.width) * stride + offset;
      if (firstIdx < samples.length) {
        const nextFirst = samples[firstIdx]!;
        prevNeg1 = prevFirstPrev;
        prevFirstPrev = nextFirst;
      }
    }
  }

  private decodeLineInterleaved(reader: JpegLsBitReader, samples: number[]): void {
    const prevFirstPrev = new Array<number>(this.components).fill(0);
    const prevNeg1 = new Array<number>(this.components).fill(0);
    const runIndex = new Array<number>(this.components).fill(0);

    for (let y = 0; y < this.height; y++) {
      for (let component = 0; component < this.components; component++) {
        this.runMode.runIndex = runIndex[component]!;
        this.decodeComponentLine(reader, samples, component, y, prevFirstPrev, prevNeg1);
        runIndex[component] = this.runMode.runIndex;
      }
    }
  }

  private encodeComponentLine(
    writer: JpegLsBitWriter,
    samples: number[],
    component: number,
    y: number,
    prevFirstPrev: number[],
    prevNeg1: number[],
  ): void {
    const stride = this.components;
    const offset = component;
    const firstPrev = prevFirstPrev[component]!;
    const neg1 = prevNeg1[component]!;
    let x = 0;

    while (x < this.width) {
      const idx = (y * this.width + x) * stride + offset;
      if (idx >= samples.length) {
        x++;
        continue;
      }

      const currentSample = samples[idx]!;
      let ra = 0;
      let rb = 0;
      let rc = 0;
      let rd = 0;

      if (x === 0) {
        ra = firstPrev;
        rb = y > 0 ? firstPrev : 0;
        rc = neg1;
        if (y > 0 && this.width > 1) {
          const rdIdx = ((y - 1) * this.width + (x + 1)) * stride + offset;
          rd = rdIdx < samples.length ? samples[rdIdx]! : rb;
        } else {
          rd = rb;
        }
      } else {
        [ra, rb, rc, rd] = getNeighbors(samples, this.width, this.height, this.components, x, y, component);
      }

      const [q1, q2, q3] = this.quantizer.computeContext(ra, rb, rc, rd);
      const contextId = computeContextID(q1, q2, q3);

      if (contextId !== 0) {
        const signBit = bitwiseSign(contextId);
        const contextIndex = applySign(contextId, signBit);
        const context = this.contexts[contextIndex]!;
        const k = context.computeGolombParameter();

        const prediction = predict(ra, rb, rc);
        const correctedPrediction = this.traits.correctPrediction(prediction + applySign(context.C, signBit));

        const errorValue = this.traits.computeErrorValue(applySign(currentSample - correctedPrediction, signBit));
        const correction = context.getErrorCorrection(k | this.near, this.near);
        const mappedError = mapErrorValue(correction ^ errorValue);

        writer.encodeMappedValue(k, mappedError, this.traits.limit, this.traits.qbpp);
        context.update(errorValue, this.near, this.traits.reset);

        samples[idx] = this.traits.computeReconstructedSample(
          correctedPrediction,
          applySign(errorValue, signBit),
        );

        x++;
        continue;
      }

      const processed = this.encodeRunMode(writer, samples, x, y, component, ra);
      x += processed;
    }

    const firstIdx = (y * this.width) * stride + offset;
    if (firstIdx < samples.length) {
      const nextFirst = samples[firstIdx]!;
      prevNeg1[component] = firstPrev;
      prevFirstPrev[component] = nextFirst;
    }
  }

  private decodeComponentLine(
    reader: JpegLsBitReader,
    samples: number[],
    component: number,
    y: number,
    prevFirstPrev: number[],
    prevNeg1: number[],
  ): void {
    const stride = this.components;
    const offset = component;
    const firstPrev = prevFirstPrev[component]!;
    const neg1 = prevNeg1[component]!;
    let x = 0;

    while (x < this.width) {
      const idx = (y * this.width + x) * stride + offset;
      let ra = 0;
      let rb = 0;
      let rc = 0;
      let rd = 0;

      if (x === 0) {
        ra = firstPrev;
        rb = y > 0 ? firstPrev : 0;
        rc = neg1;
        if (y > 0 && this.width > 1) {
          const rdIdx = ((y - 1) * this.width + (x + 1)) * stride + offset;
          rd = rdIdx < samples.length ? samples[rdIdx]! : rb;
        } else {
          rd = rb;
        }
      } else {
        [ra, rb, rc, rd] = getNeighbors(samples, this.width, this.height, this.components, x, y, component);
      }

      const [q1, q2, q3] = this.quantizer.computeContext(ra, rb, rc, rd);
      const contextId = computeContextID(q1, q2, q3);

      if (contextId !== 0) {
        const signBit = bitwiseSign(contextId);
        const contextIndex = applySign(contextId, signBit);
        const context = this.contexts[contextIndex]!;
        const k = context.computeGolombParameter();

        const prediction = predict(ra, rb, rc);
        const correctedPrediction = this.traits.correctPrediction(prediction + applySign(context.C, signBit));

        const mappedError = reader.decodeValue(k, this.traits.limit, this.traits.qbpp);
        let errorValue = unmapErrorValue(mappedError);
        if (k === 0) {
          errorValue ^= context.getErrorCorrection(k, this.near);
        }

        context.update(errorValue, this.near, this.traits.reset);

        samples[idx] = this.traits.computeReconstructedSample(
          correctedPrediction,
          applySign(errorValue, signBit),
        );

        x++;
        continue;
      }

      const processed = this.decodeRunMode(reader, samples, x, y, component, ra);
      x += processed;
    }

    const firstIdx = (y * this.width) * stride + offset;
    if (firstIdx < samples.length) {
      const nextFirst = samples[firstIdx]!;
      prevNeg1[component] = firstPrev;
      prevFirstPrev[component] = nextFirst;
    }
  }

  private encodeRunMode(
    writer: JpegLsBitWriter,
    samples: number[],
    x: number,
    y: number,
    component: number,
    ra: number,
  ): number {
    const stride = this.components;
    const offset = component;
    const start = y * this.width + x;
    const remaining = this.width - x;

    let runLength = 0;
    while (runLength < remaining) {
      const idx = (start + runLength) * stride + offset;
      if (idx >= samples.length) {
        break;
      }
      if (abs(samples[idx]! - ra) > this.near) {
        break;
      }
      runLength++;
    }

    for (let i = 0; i < runLength; i++) {
      const idx = (start + i) * stride + offset;
      samples[idx] = ra;
    }

    const endOfLine = runLength === remaining;
    this.runMode.encodeRunLength(writer, runLength, endOfLine);
    if (endOfLine) {
      return runLength;
    }

    const interruptIdx = (start + runLength) * stride + offset;
    const interruptSample = samples[interruptIdx]!;
    const rbIdx = ((y - 1) * this.width + (x + runLength)) * stride + offset;
    const rb = rbIdx >= 0 && rbIdx < samples.length ? samples[rbIdx]! : 0;

    samples[interruptIdx] = this.encodeRunInterruption(writer, interruptSample, ra, rb);
    this.runMode.decrementRunIndex();

    return runLength + 1;
  }

  private decodeRunMode(
    reader: JpegLsBitReader,
    samples: number[],
    x: number,
    y: number,
    component: number,
    ra: number,
  ): number {
    const stride = this.components;
    const offset = component;
    const start = y * this.width + x;
    const remaining = this.width - x;

    const runLength = this.runMode.decodeRunLength(reader, remaining);

    for (let i = 0; i < runLength; i++) {
      const idx = (start + i) * stride + offset;
      if (idx < samples.length) {
        samples[idx] = ra;
      }
    }

    if (runLength >= remaining) {
      return runLength;
    }

    const interruptIdx = (start + runLength) * stride + offset;
    const rbIdx = ((y - 1) * this.width + (x + runLength)) * stride + offset;
    const rb = rbIdx >= 0 && rbIdx < samples.length ? samples[rbIdx]! : 0;

    if (interruptIdx < samples.length) {
      samples[interruptIdx] = this.decodeRunInterruption(reader, ra, rb);
    }

    this.runMode.decrementRunIndex();
    return runLength + 1;
  }

  private encodeRunInterruption(writer: JpegLsBitWriter, current: number, ra: number, rb: number): number {
    if (abs(ra - rb) <= this.near) {
      const errorValue = this.traits.computeErrorValue(current - ra);
      this.runMode.encodeRunInterruption(writer, this.runMode.contexts[1], errorValue);
      return this.traits.computeReconstructedSample(ra, errorValue);
    }

    const s = sign(rb - ra);
    const errorValue = this.traits.computeErrorValue((current - rb) * s);
    this.runMode.encodeRunInterruption(writer, this.runMode.contexts[0], errorValue);
    return this.traits.computeReconstructedSample(rb, errorValue * s);
  }

  private decodeRunInterruption(reader: JpegLsBitReader, ra: number, rb: number): number {
    if (abs(ra - rb) <= this.near) {
      const errorValue = this.runMode.decodeRunInterruption(reader, this.runMode.contexts[1]);
      return this.traits.computeReconstructedSample(ra, errorValue);
    }

    const s = sign(rb - ra);
    const errorValue = this.runMode.decodeRunInterruption(reader, this.runMode.contexts[0]);
    return this.traits.computeReconstructedSample(rb, errorValue * s);
  }
}

export interface EncodeJpegLsOptions {
  width: number;
  height: number;
  components: number;
  bitDepth: number;
  near: number;
  interleaveMode?: number;
  reset?: number;
}

export interface DecodeJpegLsResult {
  pixelData: Uint8Array;
  width: number;
  height: number;
  components: number;
  bitDepth: number;
  near: number;
  interleaveMode: number;
}

export function encodeJpegLs(pixelData: Uint8Array, options: EncodeJpegLsOptions): Uint8Array {
  validateEncodeOptions(options);

  const interleaveMode = normalizeInterleaveMode(options.interleaveMode, options.components);
  const reset = normalizeReset(options.reset);
  const params = computeCodingParameters((1 << options.bitDepth) - 1, options.near, reset);
  const traits = new Traits((1 << options.bitDepth) - 1, options.near, params);
  const model = new CodecModel(
    options.width,
    options.height,
    options.components,
    options.bitDepth,
    options.near,
    interleaveMode,
    traits,
    params.t1,
    params.t2,
    params.t3,
  );

  const writer = new JpegLsStreamWriter();
  writer.writeMarker(JpegMarkers.SOI);
  writer.writeSegment(SOF55, buildSOF55(options.width, options.height, options.components, options.bitDepth));
  writer.writeSegment(LSE, buildLSE((1 << options.bitDepth) - 1, params.t1, params.t2, params.t3, params.reset));
  writer.writeSegment(JpegMarkers.SOS, buildSOS(options.components, options.near, interleaveMode));
  writer.writeBytes(model.encodeScanData(pixelData));
  writer.writeMarker(JpegMarkers.EOI);

  return writer.toUint8Array();
}

export function decodeJpegLs(frameData: Uint8Array): DecodeJpegLsResult {
  const reader = new JpegLsStreamReader(frameData);
  const state: ParseState = {
    width: 0,
    height: 0,
    components: 0,
    bitDepth: 0,
    maxVal: 0,
    near: 0,
    t1: 0,
    t2: 0,
    t3: 0,
    reset: 64,
    interleaveMode: 0,
  };

  if (reader.readMarker() !== JpegMarkers.SOI) {
    throw new Error("Invalid JPEG-LS stream: missing SOI marker");
  }

  for (;;) {
    const marker = reader.readMarker();

    switch (marker) {
      case SOF55: {
        parseSOF55(reader.readSegment(), state);
        break;
      }
      case LSE: {
        parseLSE(reader.readSegment(), state);
        break;
      }
      case JpegMarkers.SOS: {
        parseSOS(reader.readSegment(), state);
        const params = computeCodingParameters(state.maxVal, state.near, state.reset);
        const traits = new Traits(state.maxVal, state.near, {
          ...params,
          t1: state.t1 > 0 ? state.t1 : params.t1,
          t2: state.t2 > 0 ? state.t2 : params.t2,
          t3: state.t3 > 0 ? state.t3 : params.t3,
        });

        const model = new CodecModel(
          state.width,
          state.height,
          state.components,
          state.bitDepth,
          state.near,
          state.interleaveMode,
          traits,
          state.t1 > 0 ? state.t1 : params.t1,
          state.t2 > 0 ? state.t2 : params.t2,
          state.t3 > 0 ? state.t3 : params.t3,
        );

        return {
          pixelData: model.decodeScanData(reader.readScanData()),
          width: state.width,
          height: state.height,
          components: state.components,
          bitDepth: state.bitDepth,
          near: state.near,
          interleaveMode: state.interleaveMode,
        };
      }
      case JpegMarkers.EOI:
        throw new Error("Invalid JPEG-LS stream: EOI reached before SOS");
      default: {
        if (JpegMarkers.hasLength(marker)) {
          reader.readSegment();
        }
        break;
      }
    }
  }
}

function parseSOF55(segment: Uint8Array, state: ParseState): void {
  if (segment.length < 6) {
    throw new Error("Invalid JPEG-LS SOF55 segment");
  }

  state.bitDepth = segment[0]!;
  state.height = (segment[1]! << 8) | segment[2]!;
  state.width = (segment[3]! << 8) | segment[4]!;
  state.components = segment[5]!;

  if (state.width <= 0 || state.height <= 0) {
    throw new Error(`Invalid JPEG-LS dimensions: ${state.width}x${state.height}`);
  }
  if (state.components !== 1 && state.components !== 3) {
    throw new Error(`Unsupported JPEG-LS component count: ${state.components}`);
  }
  if (state.bitDepth < 2 || state.bitDepth > 16) {
    throw new Error(`Unsupported JPEG-LS bit depth: ${state.bitDepth}`);
  }

  state.maxVal = (1 << state.bitDepth) - 1;
}

function parseLSE(segment: Uint8Array, state: ParseState): void {
  if (segment.length < 11 || segment[0] !== 1) {
    return;
  }

  const maxVal = (segment[1]! << 8) | segment[2]!;
  if (maxVal > 0) {
    state.maxVal = maxVal;
  }

  state.t1 = (segment[3]! << 8) | segment[4]!;
  state.t2 = (segment[5]! << 8) | segment[6]!;
  state.t3 = (segment[7]! << 8) | segment[8]!;

  const reset = (segment[9]! << 8) | segment[10]!;
  state.reset = normalizeReset(reset);
}

function parseSOS(segment: Uint8Array, state: ParseState): void {
  if (segment.length < 4) {
    throw new Error("Invalid JPEG-LS SOS segment");
  }

  const components = segment[0]!;
  if (components !== state.components) {
    throw new Error(`JPEG-LS SOS component mismatch: ${components} vs ${state.components}`);
  }

  state.near = segment[segment.length - 3]!;
  state.interleaveMode = segment[segment.length - 2]!;

  if (state.components === 1 && state.interleaveMode !== 0) {
    throw new Error(`Unsupported JPEG-LS interleave mode for single-component scan: ${state.interleaveMode}`);
  }

  if (state.interleaveMode !== 0 && state.interleaveMode !== 1) {
    throw new Error(`Unsupported JPEG-LS interleave mode: ${state.interleaveMode}`);
  }
}

function buildSOF55(width: number, height: number, components: number, bitDepth: number): Uint8Array {
  const segment = new Uint8Array(6 + components * 3);
  segment[0] = bitDepth;
  segment[1] = (height >>> 8) & 0xff;
  segment[2] = height & 0xff;
  segment[3] = (width >>> 8) & 0xff;
  segment[4] = width & 0xff;
  segment[5] = components;

  for (let i = 0; i < components; i++) {
    const offset = 6 + i * 3;
    segment[offset] = i + 1;
    segment[offset + 1] = 0x11;
    segment[offset + 2] = 0;
  }

  return segment;
}

function buildLSE(maxVal: number, t1: number, t2: number, t3: number, reset: number): Uint8Array {
  const segment = new Uint8Array(11);
  segment[0] = 1;

  segment[1] = (maxVal >>> 8) & 0xff;
  segment[2] = maxVal & 0xff;

  segment[3] = (t1 >>> 8) & 0xff;
  segment[4] = t1 & 0xff;

  segment[5] = (t2 >>> 8) & 0xff;
  segment[6] = t2 & 0xff;

  segment[7] = (t3 >>> 8) & 0xff;
  segment[8] = t3 & 0xff;

  segment[9] = (reset >>> 8) & 0xff;
  segment[10] = reset & 0xff;

  return segment;
}

function buildSOS(components: number, near: number, interleaveMode: number): Uint8Array {
  const segment = new Uint8Array(4 + components * 2);
  segment[0] = components;

  for (let i = 0; i < components; i++) {
    const offset = 1 + i * 2;
    segment[offset] = i + 1;
    segment[offset + 1] = 0;
  }

  segment[segment.length - 3] = near;
  segment[segment.length - 2] = interleaveMode;
  segment[segment.length - 1] = 0;

  return segment;
}

function validateEncodeOptions(options: EncodeJpegLsOptions): void {
  if (options.width <= 0 || options.height <= 0) {
    throw new Error(`Invalid JPEG-LS dimensions: ${options.width}x${options.height}`);
  }
  if (options.components !== 1 && options.components !== 3) {
    throw new Error(`Unsupported JPEG-LS component count: ${options.components}`);
  }
  if (options.bitDepth < 2 || options.bitDepth > 16) {
    throw new Error(`Unsupported JPEG-LS bit depth: ${options.bitDepth}`);
  }
  if (!Number.isInteger(options.near) || options.near < 0 || options.near > 255) {
    throw new Error(`Invalid JPEG-LS NEAR value: ${options.near}`);
  }

  normalizeInterleaveMode(options.interleaveMode, options.components);
}

function getNeighbors(
  samples: number[],
  width: number,
  _height: number,
  components: number,
  x: number,
  y: number,
  component: number,
): [number, number, number, number] {
  const stride = components;
  const offset = component;

  let a = 0;
  let b = 0;
  let c = 0;
  let d = 0;

  if (y > 0) {
    b = samples[((y - 1) * width + x) * stride + offset]!;
  }

  if (x > 0) {
    a = samples[(y * width + (x - 1)) * stride + offset]!;
  } else if (y > 0) {
    a = b;
  }

  if (x > 0 && y > 0) {
    c = samples[((y - 1) * width + (x - 1)) * stride + offset]!;
  }

  if (y > 0) {
    if (x < width - 1) {
      d = samples[((y - 1) * width + (x + 1)) * stride + offset]!;
    } else {
      d = b;
    }
  }

  return [a, b, c, d];
}

function toIntegerSamples(pixelData: Uint8Array, bitDepth: number): number[] {
  if (bitDepth <= 8) {
    return Array.from(pixelData);
  }

  if ((pixelData.length & 1) !== 0) {
    throw new Error("Invalid JPEG-LS input: 16-bit frame data length is not even");
  }

  const samples: number[] = new Array(pixelData.length >> 1);
  for (let i = 0; i < samples.length; i++) {
    const p = i << 1;
    samples[i] = pixelData[p]! | (pixelData[p + 1]! << 8);
  }
  return samples;
}

function fromIntegerSamples(samples: number[], bitDepth: number, maxVal: number): Uint8Array {
  if (bitDepth <= 8) {
    const output = new Uint8Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
      output[i] = clamp(samples[i]!, 0, maxVal);
    }
    return output;
  }

  const output = new Uint8Array(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    const sample = clamp(samples[i]!, 0, maxVal);
    const p = i << 1;
    output[p] = sample & 0xff;
    output[p + 1] = (sample >>> 8) & 0xff;
  }
  return output;
}

function computeCodingParameters(maxVal: number, near: number, reset: number): CodingParameters {
  const range = near > 0 ? Math.floor((maxVal + 2 * near) / (2 * near + 1)) + 1 : maxVal + 1;
  const qbpp = bitsLen(range);
  const bitsPerPixel = bitsLen(maxVal);
  const limit = 2 * (bitsPerPixel + max(8, bitsPerPixel));

  const [t1, t2, t3] = computeThresholds(maxVal, near);
  return {
    range,
    qbpp,
    limit,
    t1,
    t2,
    t3,
    reset: normalizeReset(reset),
  };
}

function computeThresholds(maxVal: number, near: number): [number, number, number] {
  const t1Default = 3;
  const t2Default = 7;
  const t3Default = 21;

  if (maxVal >= 128) {
    const factor = Math.floor((min(maxVal, 4095) + 128) / 256);
    const t1 = clamp(factor * (t1Default - 2) + 2 + 3 * near, near + 1, maxVal);
    const t2 = clamp(factor * (t2Default - 3) + 3 + 5 * near, t1, maxVal);
    const t3 = clamp(factor * (t3Default - 4) + 4 + 7 * near, t2, maxVal);
    return [t1, t2, t3];
  }

  const factor = Math.floor(256 / (maxVal + 1));
  const t1 = clamp(max(2, Math.floor(t1Default / factor) + 3 * near), near + 1, maxVal);
  const t2 = clamp(max(3, Math.floor(t2Default / factor) + 5 * near), t1, maxVal);
  const t3 = clamp(max(4, Math.floor(t3Default / factor) + 7 * near), t2, maxVal);
  return [t1, t2, t3];
}

function bitsLen(value: number): number {
  if (value <= 1) {
    return 1;
  }

  let v = value - 1;
  let bits = 0;
  while (v > 0) {
    bits++;
    v >>= 1;
  }
  return bits;
}

function normalizeReset(reset: number | undefined): number {
  if (!reset || reset <= 0) {
    return 64;
  }
  return reset;
}

function normalizeInterleaveMode(interleaveMode: number | undefined, components: number): number {
  const mode = interleaveMode ?? 0;
  if (!Number.isInteger(mode) || (mode !== 0 && mode !== 1)) {
    throw new Error(`Unsupported JPEG-LS interleave mode: ${mode}`);
  }
  if (components === 1 && mode !== 0) {
    throw new Error(`JPEG-LS single-component frames require interleaveMode=0; got ${mode}`);
  }
  return mode;
}

function predict(a: number, b: number, c: number): number {
  if (c >= max(a, b)) {
    return min(a, b);
  }
  if (c <= min(a, b)) {
    return max(a, b);
  }
  return a + b - c;
}

function computeContextID(q1: number, q2: number, q3: number): number {
  return (q1 * 9 + q2) * 9 + q3;
}

function bitwiseSign(value: number): number {
  return value < 0 ? -1 : 0;
}

function applySign(value: number, signBit: number): number {
  return (signBit ^ value) - signBit;
}

function mapErrorValue(errorValue: number): number {
  return (errorValue << 1) ^ (errorValue >> 31);
}

function unmapErrorValue(mapped: number): number {
  return (mapped >> 1) ^ (-(mapped & 1));
}

function abs(value: number): number {
  return value < 0 ? -value : value;
}

function sign(value: number): number {
  return value < 0 ? -1 : 1;
}

function min(a: number, b: number): number {
  return a < b ? a : b;
}

function max(a: number, b: number): number {
  return a > b ? a : b;
}

function clamp(value: number, lower: number, upper: number): number {
  if (value < lower) {
    return lower;
  }
  if (value > upper) {
    return upper;
  }
  return value;
}
