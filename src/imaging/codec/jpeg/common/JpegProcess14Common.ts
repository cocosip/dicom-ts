/**
 * JPEG Lossless Process 14 pure-TypeScript codec core.
 *
 * Supports all 7 predictors, bit depths 2-16, 1 or 3 components.
 *
 * Reference: go-dicom-codec/jpeg/lossless/decoder.go
 *            go-dicom-codec/jpeg/lossless/encoder.go
 *            go-dicom-codec/jpeg/lossless/predictors.go
 *            go-dicom-codec/jpeg/lossless14sv1/decoder.go
 *            go-dicom-codec/jpeg/lossless14sv1/encoder.go
 */

import * as Markers from "./JpegMarkers.js";
import { HuffmanTable, BitReader, BitWriter, encodeCategory } from "./JpegHuffman.js";
import { buildLosslessTables } from "./JpegTables.js";

// ---------------------------------------------------------------------------
// Predictors (JPEG Lossless P1-P7)
// ---------------------------------------------------------------------------

function applyPredictor(predictor: number, ra: number, rb: number, rc: number): number {
  switch (predictor) {
    case 1: return ra;
    case 2: return rb;
    case 3: return rc;
    case 4: return ra + rb - rc;
    case 5: return ra + ((rb - rc) >> 1);
    case 6: return rb + ((ra - rc) >> 1);
    case 7: return (ra + rb) >> 1;
    default: return ra;
  }
}

// ---------------------------------------------------------------------------
// Low-level JPEG segment reader
// ---------------------------------------------------------------------------

class JpegStreamReader {
  private pos = 0;
  constructor(private readonly data: Uint8Array) {}

  readByte(): number {
    if (this.pos >= this.data.length) throw new Error("Unexpected end of JPEG stream");
    return this.data[this.pos++]!;
  }

  readUint16(): number {
    const hi = this.readByte();
    const lo = this.readByte();
    return (hi << 8) | lo;
  }

  /** Read full 2-byte marker, skipping any 0xFF padding bytes. */
  readMarker(): number {
    let b = this.readByte();
    while (b !== 0xff) b = this.readByte();
    while (b === 0xff) b = this.readByte(); // skip padding
    return 0xff00 | b;
  }

  /** Read length-prefixed segment data (not including the 2-byte length itself). */
  readSegment(): Uint8Array {
    const length = this.readUint16();
    if (length < 2) throw new Error("Invalid JPEG segment length");
    const n = length - 2;
    if (this.pos + n > this.data.length) throw new Error("JPEG segment extends past end of data");
    const seg = this.data.subarray(this.pos, this.pos + n);
    this.pos += n;
    return seg;
  }

  /** Read remaining scan bytes (byte stuffing preserved) until a real marker. */
  readScanData(): Uint8Array {
    const chunks: number[] = [];
    while (this.pos < this.data.length) {
      const b = this.data[this.pos++]!;
      if (b === 0xff) {
        if (this.pos >= this.data.length) {
          chunks.push(b);
          break;
        }
        const b2 = this.data[this.pos]!;
        if (b2 === 0x00) {
          // byte stuffing – keep both for BitReader
          chunks.push(b, b2);
          this.pos++;
        } else {
          // real marker – stop
          break;
        }
      } else {
        chunks.push(b);
      }
    }
    return new Uint8Array(chunks);
  }
}

// ---------------------------------------------------------------------------
// Low-level JPEG stream writer
// ---------------------------------------------------------------------------

class JpegStreamWriter {
  private buf: number[] = [];

  writeMarker(marker: number): void {
    this.buf.push((marker >>> 8) & 0xff, marker & 0xff);
  }

  writeSegment(marker: number, data: Uint8Array): void {
    this.writeMarker(marker);
    const length = data.length + 2;
    this.buf.push((length >>> 8) & 0xff, length & 0xff);
    for (const b of data) this.buf.push(b);
  }

  writeBytes(data: Uint8Array): void {
    for (const b of data) this.buf.push(b);
  }

  toUint8Array(): Uint8Array {
    return new Uint8Array(this.buf);
  }
}

// ---------------------------------------------------------------------------
// Decode
// ---------------------------------------------------------------------------

interface DecodedFrame {
  pixels:     Uint8Array;
  width:      number;
  height:     number;
  components: number;
  precision:  number;
}

/**
 * Decode a JPEG Lossless Process 14 frame.
 * @param sv1 When true enforces predictor === 1 (SV1 codec rule).
 */
export function decodeLosslessJpeg(frameData: Uint8Array, sv1: boolean): DecodedFrame {
  const reader = new JpegStreamReader(frameData);

  const firstMarker = reader.readMarker();
  if (firstMarker !== Markers.SOI) throw new Error("Invalid JPEG Lossless: missing SOI");

  let width = 0, height = 0, components = 0, precision = 0, predictor = 0, pointTransform = 0;
  const dcTables: (HuffmanTable | undefined)[] = [undefined, undefined];
  const compTableSel: number[] = [];

  loop: for (;;) {
    const marker = reader.readMarker();
    switch (marker) {
      case Markers.SOF3: {
        const seg = reader.readSegment();
        if (seg.length < 6) throw new Error("Invalid SOF3 segment");
        precision  = seg[0]!;
        if (precision < 2 || precision > 16) throw new Error(`Invalid SOF3 precision: ${precision}`);
        height     = (seg[1]! << 8) | seg[2]!;
        width      = (seg[3]! << 8) | seg[4]!;
        components = seg[5]!;
        if (components !== 1 && components !== 3) throw new Error(`Unsupported component count: ${components}`);
        if (width <= 0 || height <= 0) throw new Error("Invalid image dimensions");
        for (let i = 0; i < components; i++) {
          const off = 6 + i * 3;
          const hv = seg[off + 1]!;
          if (((hv >> 4) & 0xf) !== 1 || (hv & 0xf) !== 1) throw new Error("Lossless JPEG requires 1x1 sampling");
        }
        break;
      }

      case Markers.DHT: {
        const seg = reader.readSegment();
        let off = 0;
        while (off < seg.length) {
          const tcth = seg[off++]!;
          const tc   = (tcth >> 4) & 0xf;
          const th   = tcth & 0xf;
          const bits: number[] = [];
          let total = 0;
          for (let i = 0; i < 16; i++) { bits.push(seg[off++]!); total += bits[i]!; }
          const values = Array.from(seg.subarray(off, off + total));
          off += total;
          if (tc === 0 && th < 2) {
            dcTables[th] = new HuffmanTable({ bits, values });
          }
        }
        break;
      }

      case Markers.SOS: {
        const seg = reader.readSegment();
        if (seg.length < 1) throw new Error("Invalid SOS segment");
        const ns = seg[0]!;
        if (seg.length < 1 + ns * 2 + 3) throw new Error("SOS segment too short");
        for (let i = 0; i < ns; i++) {
          const td = (seg[1 + i * 2 + 1]! >> 4) & 0xf; // DC table selector
          compTableSel.push(td);
        }
        predictor      = seg[1 + ns * 2]!;
        // AhAl byte: upper nibble = Ah (successive approx high, unused in lossless)
        //            lower nibble = Al = point transform
        pointTransform = seg[3 + ns * 2]! & 0x0f;
        if (sv1 && predictor !== 1) {
          throw new Error(`SV1 requires predictor selection value 1, got ${predictor}`);
        }
        if (predictor < 1 || predictor > 7) throw new Error(`Invalid predictor: ${predictor}`);
        break loop; // next bytes are scan data
      }

      case Markers.EOI:
        throw new Error("Unexpected EOI before scan data");

      default:
        if (Markers.hasLength(marker)) reader.readSegment();
        break;
    }
  }

  const scanData = reader.readScanData();
  const bitReader = new BitReader(scanData);

  // Allocate samples
  const samples: number[][] = Array.from({ length: components }, () =>
    new Array<number>(width * height).fill(0)
  );

  // Effective precision after point transform: Pe = P - Pt
  const Pe         = precision - pointTransform;
  const defaultVal = 1 << (Pe - 1); // 2^(Pe-1)
  const modulus    = 1 << Pe;

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      for (let comp = 0; comp < components; comp++) {
        const tableIdx = compTableSel[comp] ?? (comp > 0 ? 1 : 0);
        const table = dcTables[tableIdx < 2 ? tableIdx : 0];
        if (!table) throw new Error(`Huffman table ${tableIdx} not defined`);

        const category = table.decodeFrom(bitReader);
        const diff     = bitReader.receiveExtend(category);

        // Neighbor values
        let ra: number, rb: number, rc: number;
        if (col > 0) {
          ra = samples[comp]![row * width + (col - 1)]!;
        } else if (row > 0 && predictor === 1) {
          ra = samples[comp]![(row - 1) * width + col]!;
        } else {
          ra = defaultVal;
        }
        rb = row > 0 ? samples[comp]![(row - 1) * width + col]! : defaultVal;
        rc = (row > 0 && col > 0) ? samples[comp]![(row - 1) * width + (col - 1)]! : defaultVal;

        const predicted = (col === 0 && row === 0) ? defaultVal : applyPredictor(predictor, ra, rb, rc);
        let sample = predicted + diff;
        if (sample < 0) sample += modulus;
        else if (sample >= modulus) sample -= modulus;

        samples[comp]![row * width + col] = sample;
      }
    }
  }

  // Apply inverse point transform: each sample was encoded as (original >> Pt),
  // so restore with a left shift.
  if (pointTransform > 0) {
    for (const s of samples) {
      for (let i = 0; i < s.length; i++) s[i] = s[i]! << pointTransform;
    }
  }

  return { pixels: samplesToPixels(samples, width, height, components, precision), width, height, components, precision };
}

// ---------------------------------------------------------------------------
// Encode – Process 14 (any predictor)
// ---------------------------------------------------------------------------

/** Options for lossless JPEG encoding. */
export interface LosslessEncodeOptions {
  /** Predictor selection 1-7, or 0 for auto-select (best). */
  predictor?: number;
  /**
   * Point transform value (0-15).  Each sample is right-shifted by this many
   * bits before encoding; the decoder left-shifts them back.  Corresponds to
   * the JPEG SOS `Al` field (ITU-T T.81 §A.2.1).  Defaults to 0.
   */
  pointTransform?: number;
}

export function encodeLosslessJpeg(
  pixelData: Uint8Array,
  width: number,
  height: number,
  components: number,
  precision: number,
  opts: LosslessEncodeOptions = {},
): Uint8Array {
  if (width <= 0 || height <= 0) throw new Error("Invalid image dimensions");
  if (components !== 1 && components !== 3) throw new Error(`Unsupported component count: ${components}`);
  if (precision < 2 || precision > 16) throw new Error(`Invalid bit depth: ${precision}`);

  const Pt = Math.max(0, Math.min(15, opts.pointTransform ?? 0));
  const Pe = precision - Pt; // effective precision after point transform
  if (Pe < 2) throw new Error(`pointTransform ${Pt} too large for precision ${precision}`);

  const samples = pixelsToSamples(pixelData, width, height, components, precision);

  // Apply point transform: right-shift each sample by Pt bits.
  if (Pt > 0) {
    for (const s of samples) for (let i = 0; i < s.length; i++) s[i] = s[i]! >> Pt;
  }

  let predictor = opts.predictor ?? 0;
  if (predictor === 0) predictor = selectBestPredictor(samples, width, height);

  const maxCat   = computeMaxCategory(samples, components, width, height, Pe, predictor);
  const useExt   = Pe >= 12 && maxCat >= 9;
  const { tables, codes } = buildLosslessTables(useExt);

  const writer = new JpegStreamWriter();
  writer.writeMarker(Markers.SOI);
  writer.writeSegment(Markers.APP0, buildAPP0());
  writer.writeSegment(Markers.SOF3, buildSOF3(precision, width, height, components));
  writeDHT(writer, tables, components);
  writeSOS(writer, components, predictor, Pt);

  const scanData = encodeScan(samples, width, height, components, Pe, predictor, codes);
  writer.writeBytes(scanData);
  writer.writeMarker(Markers.EOI);

  return writer.toUint8Array();
}

// ---------------------------------------------------------------------------
// Encode – SV1 (predictor 1 hard-coded)
// ---------------------------------------------------------------------------

export function encodeLosslessSV1Jpeg(
  pixelData: Uint8Array,
  width: number,
  height: number,
  components: number,
  precision: number,
  pointTransform: number = 0,
): Uint8Array {
  if (width <= 0 || height <= 0) throw new Error("Invalid image dimensions");
  if (components !== 1 && components !== 3) throw new Error(`Unsupported component count: ${components}`);
  if (precision < 2 || precision > 16) throw new Error(`Invalid bit depth: ${precision}`);

  const Pt = Math.max(0, Math.min(15, pointTransform));
  const Pe = precision - Pt;
  if (Pe < 2) throw new Error(`pointTransform ${Pt} too large for precision ${precision}`);

  const samples = pixelsToSamples(pixelData, width, height, components, precision);

  if (Pt > 0) {
    for (const s of samples) for (let i = 0; i < s.length; i++) s[i] = s[i]! >> Pt;
  }

  const maxCat   = computeMaxCategorySV1(samples, components, width, height, Pe);
  const useExt   = Pe >= 12 && maxCat >= 9;
  const { tables, codes } = buildLosslessTables(useExt);

  const writer = new JpegStreamWriter();
  writer.writeMarker(Markers.SOI);
  writer.writeSegment(Markers.APP0, buildAPP0());
  writer.writeSegment(Markers.SOF3, buildSOF3(precision, width, height, components));
  writeDHT(writer, tables, components);
  writeSOS(writer, components, 1 /* predictor 1 */, Pt);

  const scanData = encodeScanSV1(samples, width, height, components, Pe, codes);
  writer.writeBytes(scanData);
  writer.writeMarker(Markers.EOI);

  return writer.toUint8Array();
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function pixelsToSamples(
  pixelData: Uint8Array,
  width: number,
  height: number,
  components: number,
  precision: number,
): number[][] {
  const samples: number[][] = Array.from({ length: components }, () =>
    new Array<number>(width * height).fill(0)
  );
  if (precision <= 8) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        for (let c = 0; c < components; c++) {
          samples[c]![y * width + x] = pixelData[(y * width + x) * components + c]!;
        }
      }
    }
  } else {
    let off = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        for (let c = 0; c < components; c++) {
          samples[c]![y * width + x] = pixelData[off]! | (pixelData[off + 1]! << 8);
          off += 2;
        }
      }
    }
  }
  return samples;
}

function samplesToPixels(
  samples: number[][],
  width: number,
  height: number,
  components: number,
  precision: number,
): Uint8Array {
  const bytesPerSample = Math.ceil(precision / 8);
  const out = new Uint8Array(width * height * components * bytesPerSample);
  if (precision <= 8) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        for (let c = 0; c < components; c++) {
          out[(y * width + x) * components + c] = samples[c]![y * width + x]! & 0xff;
        }
      }
    }
  } else {
    let off = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        for (let c = 0; c < components; c++) {
          const v = samples[c]![y * width + x]!;
          out[off++] = v & 0xff;
          out[off++] = (v >> 8) & 0xff;
        }
      }
    }
  }
  return out;
}

function buildAPP0(): Uint8Array {
  return new Uint8Array([
    0x4a, 0x46, 0x49, 0x46, 0x00, // 'JFIF\0'
    1, 1,  // version 1.1
    0,     // density units: none
    0, 1,  // X density = 1
    0, 1,  // Y density = 1
    0, 0,  // thumbnail 0x0
  ]);
}

function buildSOF3(precision: number, width: number, height: number, components: number): Uint8Array {
  const data = new Uint8Array(6 + components * 3);
  data[0] = precision;
  data[1] = (height >> 8) & 0xff;
  data[2] = height & 0xff;
  data[3] = (width >> 8) & 0xff;
  data[4] = width & 0xff;
  data[5] = components;
  for (let i = 0; i < components; i++) {
    data[6 + i * 3] = i + 1;  // component ID
    data[7 + i * 3] = 0x11;   // 1x1 sampling
    data[8 + i * 3] = 0;      // Tq = 0 (not used)
  }
  return data;
}

function writeDHT(writer: JpegStreamWriter, tables: [HuffmanTable, HuffmanTable], components: number): void {
  const numTables = components === 3 ? 2 : 1;
  for (let i = 0; i < numTables; i++) {
    const table = tables[i]!;
    const totalValues = table.bits.reduce((a, b) => a + b, 0);
    const data = new Uint8Array(1 + 16 + totalValues);
    data[0] = i; // class 0 (DC/lossless), ID i
    for (let j = 0; j < 16; j++) data[1 + j] = table.bits[j]!;
    data.set(table.values, 17);
    writer.writeSegment(Markers.DHT, data);
  }
}

function writeSOS(writer: JpegStreamWriter, components: number, predictor: number, pointTransform: number = 0): void {
  const data = new Uint8Array(1 + components * 2 + 3);
  data[0] = components;
  for (let i = 0; i < components; i++) {
    data[1 + i * 2]     = i + 1;        // component ID
    data[1 + i * 2 + 1] = i === 0 ? 0 : 1; // DC table selector
  }
  data[1 + components * 2] = predictor;            // Ss = predictor
  data[2 + components * 2] = 0;                    // Se = 0
  data[3 + components * 2] = pointTransform & 0x0f; // AhAl: Ah=0, Al=Pt
  writer.writeSegment(Markers.SOS, data);
}

/** General encoder (all 7 predictors). */
function encodeScan(
  samples: number[][],
  width: number,
  height: number,
  components: number,
  precision: number,
  predictor: number,
  codes: [import("./JpegHuffman.js").HuffmanCode[], import("./JpegHuffman.js").HuffmanCode[]],
): Uint8Array {
  const writer  = new BitWriter();
  const modulus = 1 << precision;
  const half    = modulus >> 1;
  const defVal  = 1 << (precision - 1);

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      for (let comp = 0; comp < components; comp++) {
        const sample = samples[comp]![row * width + col]!;
        let ra: number, rb: number, rc: number;
        if (col > 0) {
          ra = samples[comp]![row * width + col - 1]!;
        } else if (row > 0 && predictor === 1) {
          ra = samples[comp]![(row - 1) * width + col]!;
        } else {
          ra = defVal;
        }
        rb = row > 0 ? samples[comp]![(row - 1) * width + col]! : defVal;
        rc = (row > 0 && col > 0) ? samples[comp]![(row - 1) * width + col - 1]! : defVal;

        const predicted = (col === 0 && row === 0) ? defVal : applyPredictor(predictor, ra, rb, rc);
        let diff = sample - predicted;
        if (diff >= half)    diff -= modulus;
        else if (diff < -half) diff += modulus;

        const tableIdx = comp > 0 && components > 1 ? 1 : 0;
        const [cat, bits] = encodeCategory(diff);
        const hcode = codes[tableIdx]![cat]!;
        writer.writeBits(hcode.code, hcode.len);
        if (cat > 0) writer.writeBits(bits, cat);
      }
    }
  }
  writer.flush();
  return writer.toUint8Array();
}

/** SV1 encoder (predictor 1, optimised neighbor tracking). */
function encodeScanSV1(
  samples: number[][],
  width: number,
  height: number,
  components: number,
  precision: number,
  codes: [import("./JpegHuffman.js").HuffmanCode[], import("./JpegHuffman.js").HuffmanCode[]],
): Uint8Array {
  const writer  = new BitWriter();
  const modulus = 1 << precision;
  const half    = modulus >> 1;

  for (let row = 0; row < height; row++) {
    const preds = new Array<number>(components).fill(0);
    for (let col = 0; col < width; col++) {
      for (let comp = 0; comp < components; comp++) {
        const sample = samples[comp]![row * width + col]!;
        let predicted: number;
        if (col === 0) {
          predicted = row === 0
            ? (1 << (precision - 1))
            : samples[comp]![(row - 1) * width]!;
        } else {
          predicted = preds[comp]!;
        }
        let diff = sample - predicted;
        if (diff >= half)    diff -= modulus;
        else if (diff < -half) diff += modulus;

        const tableIdx = comp > 0 && components > 1 ? 1 : 0;
        const [cat, bits] = encodeCategory(diff);
        const hcode = codes[tableIdx]![cat]!;
        writer.writeBits(hcode.code, hcode.len);
        if (cat > 0) writer.writeBits(bits, cat);

        preds[comp] = sample;
      }
    }
  }
  writer.flush();
  return writer.toUint8Array();
}

// ---------------------------------------------------------------------------
// Predictor selection helpers
// ---------------------------------------------------------------------------

function selectBestPredictor(samples: number[][], width: number, height: number): number {
  let best = 1;
  let minVar = Number.MAX_SAFE_INTEGER;
  for (let p = 1; p <= 7; p++) {
    const variance = calcVariance(samples, width, height, p);
    if (variance < minVar) { minVar = variance; best = p; }
  }
  return best;
}

function calcVariance(samples: number[][], width: number, height: number, predictor: number): number {
  let sum = 0;
  let count = 0;
  for (const compSamples of samples) {
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const sample = compSamples[row * width + col]!;
        const ra = col > 0 ? compSamples[row * width + col - 1]! : 0;
        const rb = row > 0 ? compSamples[(row - 1) * width + col]! : 0;
        const rc = (row > 0 && col > 0) ? compSamples[(row - 1) * width + col - 1]! : 0;
        const diff = sample - applyPredictor(predictor, ra, rb, rc);
        sum += diff * diff;
        count++;
      }
    }
  }
  return count > 0 ? sum / count : 0;
}

function computeMaxCategory(
  samples: number[][],
  components: number,
  width: number,
  height: number,
  precision: number,
  predictor: number,
): number {
  let maxCat = 0;
  const defVal  = 1 << (precision - 1);
  const modulus = 1 << precision;
  const half    = modulus >> 1;
  for (let comp = 0; comp < components; comp++) {
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const sample = samples[comp]![row * width + col]!;
        let ra = defVal, rb = defVal, rc = defVal;
        if (col > 0) ra = samples[comp]![row * width + col - 1]!;
        if (row > 0) rb = samples[comp]![(row - 1) * width + col]!;
        if (row > 0 && col > 0) rc = samples[comp]![(row - 1) * width + col - 1]!;
        const predicted = (row === 0 && col === 0) ? defVal : applyPredictor(predictor, ra, rb, rc);
        let diff = sample - predicted;
        if (diff >= half)    diff -= modulus;
        else if (diff < -half) diff += modulus;
        const cat = diffCat(diff);
        if (cat > maxCat) maxCat = cat;
      }
    }
  }
  return maxCat;
}

function computeMaxCategorySV1(
  samples: number[][],
  components: number,
  width: number,
  height: number,
  precision: number,
): number {
  let maxCat = 0;
  const defVal  = 1 << (precision - 1);
  const modulus = 1 << precision;
  const half    = modulus >> 1;
  for (let comp = 0; comp < components; comp++) {
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const sample = samples[comp]![row * width + col]!;
        let predicted: number;
        if (col === 0) {
          predicted = row === 0 ? defVal : samples[comp]![(row - 1) * width]!;
        } else {
          predicted = samples[comp]![row * width + col - 1]!;
        }
        let diff = sample - predicted;
        if (diff >= half)    diff -= modulus;
        else if (diff < -half) diff += modulus;
        const cat = diffCat(diff);
        if (cat > maxCat) maxCat = cat;
      }
    }
  }
  return maxCat;
}

function diffCat(val: number): number {
  if (val === 0) return 0;
  let cat = 0;
  let abs = Math.abs(val);
  while (abs > 0) { cat++; abs >>= 1; }
  return cat;
}
