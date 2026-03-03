/**
 * DCT-based JPEG codec core shared by Baseline (Process 1, SOF0) and Extended Sequential (Process 2&4, SOF1).
 *
 * Both processes use the identical 8×8 DCT algorithm.  The only differences are:
 *   - SOF marker:  SOF0 (Baseline) vs SOF1 (Extended Sequential)
 *   - Bit depth:   Baseline is 8-bit only; Extended supports 8-bit and 12-bit
 *
 * Pure TypeScript — no native dependencies.
 *
 * Reference: go-dicom-codec/jpeg/baseline/  (encoder.go, decoder.go)
 *            go-dicom-codec/jpeg/standard/   (tables.go, dct.go, idct.go, utils.go)
 *            ITU-T T.81 (JPEG specification)
 */

import { HuffmanTable, BitReader, BitWriter, buildHuffmanCodes, encodeCategory } from "./JpegHuffman.js";
import type { HuffmanCode } from "./JpegHuffman.js";
import * as Markers from "./JpegMarkers.js";

// ─────────────────────────────────────────────────────────────
// Standard JPEG quantization tables  (ITU-T T.81 Annex K.1)
// Stored in natural (row-major) order.
// ─────────────────────────────────────────────────────────────

const LUM_QUANT: Int32Array = new Int32Array([
  16, 11, 10, 16, 24, 40, 51, 61,
  12, 12, 14, 19, 26, 58, 60, 55,
  14, 13, 16, 24, 40, 57, 69, 56,
  14, 17, 22, 29, 51, 87, 80, 62,
  18, 22, 37, 56, 68, 109, 103, 77,
  24, 35, 55, 64, 81, 104, 113, 92,
  49, 64, 78, 87, 103, 121, 120, 101,
  72, 92, 95, 98, 112, 100, 103, 99,
]);

const CHR_QUANT: Int32Array = new Int32Array([
  17, 18, 24, 47, 99, 99, 99, 99,
  18, 21, 26, 66, 99, 99, 99, 99,
  24, 26, 56, 99, 99, 99, 99, 99,
  47, 66, 99, 99, 99, 99, 99, 99,
  99, 99, 99, 99, 99, 99, 99, 99,
  99, 99, 99, 99, 99, 99, 99, 99,
  99, 99, 99, 99, 99, 99, 99, 99,
  99, 99, 99, 99, 99, 99, 99, 99,
]);

/** Scale a quantization table by JPEG quality factor (1-100). */
function scaleQuantTable(base: Int32Array, quality: number): Int32Array {
  const scale = quality < 50 ? Math.floor(5000 / quality) : 200 - quality * 2;
  const out = new Int32Array(64);
  for (let i = 0; i < 64; i++) {
    const v = Math.floor((base[i]! * scale + 50) / 100);
    out[i] = Math.max(1, Math.min(255, v));
  }
  return out;
}

// ─────────────────────────────────────────────────────────────
// Standard JPEG zigzag scan order  (ITU-T T.81 Figure A.6)
// ZIGZAG_SCAN[scan_position] = natural_index (row*8 + col)
// ─────────────────────────────────────────────────────────────

const ZIGZAG_SCAN = new Uint8Array([
   0,  1,  8, 16,  9,  2,  3, 10,
  17, 24, 32, 25, 18, 11,  4,  5,
  12, 19, 26, 33, 40, 48, 41, 34,
  27, 20, 13,  6,  7, 14, 21, 28,
  35, 42, 49, 56, 57, 50, 43, 36,
  29, 22, 15, 23, 30, 37, 44, 51,
  58, 59, 52, 45, 38, 31, 39, 46,
  53, 60, 61, 54, 47, 55, 62, 63,
]);

// ─────────────────────────────────────────────────────────────
// Standard Huffman tables  (ITU-T T.81 Annex K.3)
// ─────────────────────────────────────────────────────────────

const STD_DC_LUM_BITS   = [0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
const STD_DC_LUM_VALS   = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15];

const STD_DC_CHR_BITS   = [0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
const STD_DC_CHR_VALS   = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const STD_AC_LUM_BITS   = [0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 125];
const STD_AC_LUM_VALS   = [
  0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12,
  0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07,
  0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08,
  0x23, 0x42, 0xb1, 0xc1, 0x15, 0x52, 0xd1, 0xf0,
  0x24, 0x33, 0x62, 0x72, 0x82, 0x09, 0x0a, 0x16,
  0x17, 0x18, 0x19, 0x1a, 0x25, 0x26, 0x27, 0x28,
  0x29, 0x2a, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39,
  0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49,
  0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
  0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69,
  0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79,
  0x7a, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
  0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98,
  0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7,
  0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6,
  0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5,
  0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4,
  0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2,
  0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea,
  0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8,
  0xf9, 0xfa,
];

const STD_AC_CHR_BITS   = [0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 119];
const STD_AC_CHR_VALS   = [
  0x00, 0x01, 0x02, 0x03, 0x11, 0x04, 0x05, 0x21,
  0x31, 0x06, 0x12, 0x41, 0x51, 0x07, 0x61, 0x71,
  0x13, 0x22, 0x32, 0x81, 0x08, 0x14, 0x42, 0x91,
  0xa1, 0xb1, 0xc1, 0x09, 0x23, 0x33, 0x52, 0xf0,
  0x15, 0x62, 0x72, 0xd1, 0x0a, 0x16, 0x24, 0x34,
  0xe1, 0x25, 0xf1, 0x17, 0x18, 0x19, 0x1a, 0x26,
  0x27, 0x28, 0x29, 0x2a, 0x35, 0x36, 0x37, 0x38,
  0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48,
  0x49, 0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58,
  0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68,
  0x69, 0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78,
  0x79, 0x7a, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87,
  0x88, 0x89, 0x8a, 0x92, 0x93, 0x94, 0x95, 0x96,
  0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5,
  0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4,
  0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3,
  0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2,
  0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda,
  0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9,
  0xea, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8,
  0xf9, 0xfa,
];

function makeHuffmanTable(bits: number[], vals: number[]): HuffmanTable {
  return new HuffmanTable({ bits, values: vals });
}

// ─────────────────────────────────────────────────────────────
// DCT  — Forward 8×8 Discrete Cosine Transform
// Input:  block[64] pixel bytes (0-255), row-major
// Output: coef[64] int32 DCT coefficients, natural order
// Reference: go-dicom-codec/jpeg/standard/dct.go
// ─────────────────────────────────────────────────────────────

function dct(block: Uint8Array, coef: Int32Array): void {
  const W1 = 2841, W3 = 2408, W5 = 1609, W6 = 1108, W7 = 565, R2 = 181;
  const tmp = new Int32Array(64);

  // Row pass
  for (let y = 0; y < 8; y++) {
    const row = y * 8;
    let x0 = block[row]! - 128,   x1 = block[row+1]! - 128;
    let x2 = block[row+2]! - 128, x3 = block[row+3]! - 128;
    let x4 = block[row+4]! - 128, x5 = block[row+5]! - 128;
    let x6 = block[row+6]! - 128, x7 = block[row+7]! - 128;

    let x8 = x0 + x7; x0 -= x7;
    x7 = x1 + x6; x1 -= x6;
    x6 = x2 + x5; x2 -= x5;
    x5 = x3 + x4; x3 -= x4;

    x4 = x8 + x5; x8 -= x5;
    x5 = x7 + x6; x7 -= x6;
    x6 = ((x0 + x3) * R2) >> 8; x0 = ((x0 - x3) * R2) >> 8;
    x3 = x1 + x2; x1 -= x2;

    x2 = x4 + x5; x4 -= x5;
    x5 = ((x7 + x8) * R2) >> 8; x7 = ((x7 - x8) * R2) >> 8;
    x8 = x1 + x6; x1 -= x6;
    x6 = x0 + x3; x0 -= x3;

    tmp[row]   = x2;
    tmp[row+1] = (W1*x8 - W7*x6) >> 11;
    tmp[row+2] = x5;
    tmp[row+3] = (W3*x1 - W5*x0) >> 11;
    tmp[row+4] = x4;
    tmp[row+5] = (W5*x1 + W3*x0) >> 11;
    tmp[row+6] = x7;
    tmp[row+7] = (W7*x8 + W1*x6) >> 11;
  }

  // Column pass
  for (let x = 0; x < 8; x++) {
    let x0 = tmp[x]!,    x1 = tmp[8+x]!;
    let x2 = tmp[16+x]!, x3 = tmp[24+x]!;
    let x4 = tmp[32+x]!, x5 = tmp[40+x]!;
    let x6 = tmp[48+x]!, x7 = tmp[56+x]!;

    let x8 = x0 + x7; x0 -= x7;
    x7 = x1 + x6; x1 -= x6;
    x6 = x2 + x5; x2 -= x5;
    x5 = x3 + x4; x3 -= x4;

    x4 = x8 + x5; x8 -= x5;
    x5 = x7 + x6; x7 -= x6;
    x6 = ((x0 + x3) * R2) >> 8; x0 = ((x0 - x3) * R2) >> 8;
    x3 = x1 + x2; x1 -= x2;

    x2 = x4 + x5; x4 -= x5;
    x5 = ((x7 + x8) * R2) >> 8; x7 = ((x7 - x8) * R2) >> 8;
    x8 = x1 + x6; x1 -= x6;
    x6 = x0 + x3; x0 -= x3;

    coef[x]    = (x2 + 4) >> 3;
    coef[8+x]  = (W1*x8 - W7*x6) >> 14;
    coef[16+x] = (x5 + 2) >> 2;
    coef[24+x] = (W3*x1 - W5*x0) >> 14;
    coef[32+x] = (x4 + 2) >> 2;
    coef[40+x] = (W5*x1 + W3*x0) >> 14;
    coef[48+x] = (x7 + 2) >> 2;
    coef[56+x] = (W7*x8 + W1*x6) >> 14;
  }
}

// ─────────────────────────────────────────────────────────────
// IDCT — Inverse 8×8 Discrete Cosine Transform
// Input:  coef[64] int32 DCT coefficients, natural order
// Output: block[64] pixel bytes (0-255), row-major
// Reference: go-dicom-codec/jpeg/standard/idct.go
// ─────────────────────────────────────────────────────────────

function idct(coef: Int32Array, block: Uint8Array): void {
  const W1 = 2841, W2 = 2676, W3 = 2408, W5 = 1609, W6 = 1108, W7 = 565, R2 = 181;
  const tmp = new Int32Array(64);

  // Row pass
  for (let y = 0; y < 8; y++) {
    const row = y * 8;
    if (coef[row+1] === 0 && coef[row+2] === 0 && coef[row+3] === 0 &&
        coef[row+4] === 0 && coef[row+5] === 0 && coef[row+6] === 0 && coef[row+7] === 0) {
      const dc = coef[row]! << 3;
      tmp.fill(dc, row, row + 8);
      continue;
    }
    let x0 = (coef[row]! << 11) + 128;
    let x1 = coef[row+4]! << 11;
    let x2 = coef[row+6]!;
    let x3 = coef[row+2]!;
    let x4 = coef[row+1]!;
    let x5 = coef[row+7]!;
    let x6 = coef[row+5]!;
    let x7 = coef[row+3]!;

    let x8 = W7 * (x4 + x5); x4 = x8 + W1*x4; x5 = x8 - W5*x5;
    x8 = W3 * (x6 + x7); x6 = x8 - W3*x6; x7 = x8 - W7*x7;

    x8 = x0 + x1; x0 -= x1;
    x1 = W6 * (x3 + x2); x2 = x1 - W2*x2; x3 = x1 + W6*x3;
    x1 = x4 + x6; x4 -= x6;
    x6 = x5 + x7; x5 -= x7;

    x7 = x8 + x3; x8 -= x3;
    x3 = x0 + x2; x0 -= x2;
    x2 = (R2 * (x4 + x5)) >> 8; x4 = (R2 * (x4 - x5)) >> 8;

    tmp[row]   = (x7 + x1) >> 8;
    tmp[row+1] = (x3 + x2) >> 8;
    tmp[row+2] = (x0 + x4) >> 8;
    tmp[row+3] = (x8 + x6) >> 8;
    tmp[row+4] = (x8 - x6) >> 8;
    tmp[row+5] = (x0 - x4) >> 8;
    tmp[row+6] = (x3 - x2) >> 8;
    tmp[row+7] = (x7 - x1) >> 8;
  }

  // Column pass
  for (let x = 0; x < 8; x++) {
    if (tmp[8+x] === 0 && tmp[16+x] === 0 && tmp[24+x] === 0 &&
        tmp[32+x] === 0 && tmp[40+x] === 0 && tmp[48+x] === 0 && tmp[56+x] === 0) {
      const dc = clamp(((tmp[x]! + 32) >> 6) + 128, 0, 255);
      for (let r = 0; r < 8; r++) block[r*8+x] = dc;
      continue;
    }
    let x0 = (tmp[x]! << 8) + 8192;
    let x1 = tmp[32+x]! << 8;
    let x2 = tmp[48+x]!;
    let x3 = tmp[16+x]!;
    let x4 = tmp[8+x]!;
    let x5 = tmp[56+x]!;
    let x6 = tmp[40+x]!;
    let x7 = tmp[24+x]!;

    let x8 = W7 * (x4 + x5); x4 = x8 + W1*x4; x5 = x8 - W5*x5;
    x8 = W3 * (x6 + x7); x6 = x8 - W3*x6; x7 = x8 - W7*x7;

    x8 = x0 + x1; x0 -= x1;
    x1 = W6 * (x3 + x2); x2 = x1 - W2*x2; x3 = x1 + W6*x3;
    x1 = x4 + x6; x4 -= x6;
    x6 = x5 + x7; x5 -= x7;

    x7 = x8 + x3; x8 -= x3;
    x3 = x0 + x2; x0 -= x2;
    x2 = (R2 * (x4 + x5)) >> 8; x4 = (R2 * (x4 - x5)) >> 8;

    block[x]    = clamp(((x7 + x1) >> 14) + 128, 0, 255);
    block[8+x]  = clamp(((x3 + x2) >> 14) + 128, 0, 255);
    block[16+x] = clamp(((x0 + x4) >> 14) + 128, 0, 255);
    block[24+x] = clamp(((x8 + x6) >> 14) + 128, 0, 255);
    block[32+x] = clamp(((x8 - x6) >> 14) + 128, 0, 255);
    block[40+x] = clamp(((x0 - x4) >> 14) + 128, 0, 255);
    block[48+x] = clamp(((x3 - x2) >> 14) + 128, 0, 255);
    block[56+x] = clamp(((x7 - x1) >> 14) + 128, 0, 255);
  }
}

// ─────────────────────────────────────────────────────────────
// Color space helpers
// ─────────────────────────────────────────────────────────────

function ycbcrToRgb(yy: number, cb: number, cr: number): [number, number, number] {
  const cbv = cb - 128, crv = cr - 128;
  return [
    clamp(yy + ((91881 * crv) >> 16), 0, 255),
    clamp(yy - (((22554 * cbv) + (46802 * crv)) >> 16), 0, 255),
    clamp(yy + ((116130 * cbv) >> 16), 0, 255),
  ];
}

function rgbToYcbcr(r: number, g: number, b: number): [number, number, number] {
  const yy  = clamp((( 19595*r + 38470*g +  7471*b + 32768) >> 16),       0, 255);
  const cb  = clamp(((-11056*r - 21712*g + 32768*b + 8421376) >> 16),      0, 255);
  const cr  = clamp((( 32768*r - 27440*g -  5328*b + 8421376) >> 16),      0, 255);
  return [yy, cb, cr];
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function divCeil(a: number, b: number): number {
  return Math.floor((a + b - 1) / b);
}

// ─────────────────────────────────────────────────────────────
// Low-level JPEG stream reader / writer
// ─────────────────────────────────────────────────────────────

class JpegReader {
  private pos = 0;
  constructor(private readonly data: Uint8Array) {}

  readByte(): number {
    if (this.pos >= this.data.length) throw new Error("Unexpected end of JPEG data");
    return this.data[this.pos++]!;
  }

  readUint16(): number {
    return (this.readByte() << 8) | this.readByte();
  }

  readMarker(): number {
    let b = this.readByte();
    while (b !== 0xff) b = this.readByte();
    while (b === 0xff) b = this.readByte();
    return 0xff00 | b;
  }

  readSegment(): Uint8Array {
    const len = this.readUint16();
    if (len < 2) throw new Error("Invalid JPEG segment length");
    const n = len - 2;
    if (this.pos + n > this.data.length) throw new Error("JPEG segment overrun");
    const seg = this.data.subarray(this.pos, this.pos + n);
    this.pos += n;
    return seg;
  }

  /** Read entropy-coded scan data until a non-stuffed marker appears. */
  readScanBytes(): Uint8Array {
    const out: number[] = [];
    while (this.pos < this.data.length) {
      const b = this.data[this.pos++]!;
      if (b === 0xff) {
        if (this.pos >= this.data.length) { out.push(b); break; }
        const b2 = this.data[this.pos]!;
        if (b2 === 0x00) {
          out.push(b, b2);
          this.pos++;
        } else if (b2 >= 0xd0 && b2 <= 0xd7) {
          // RST marker — skip
          this.pos++;
        } else {
          break; // real marker
        }
      } else {
        out.push(b);
      }
    }
    return new Uint8Array(out);
  }
}

class JpegWriter {
  private buf: number[] = [];

  writeMarker(marker: number): void {
    this.buf.push((marker >>> 8) & 0xff, marker & 0xff);
  }

  writeSegment(marker: number, data: Uint8Array): void {
    this.writeMarker(marker);
    const len = data.length + 2;
    this.buf.push((len >>> 8) & 0xff, len & 0xff);
    for (const b of data) this.buf.push(b);
  }

  writeBytes(data: Uint8Array): void {
    for (const b of data) this.buf.push(b);
  }

  toUint8Array(): Uint8Array { return new Uint8Array(this.buf); }
}

// ─────────────────────────────────────────────────────────────
// Encoder helpers
// ─────────────────────────────────────────────────────────────

function buildDQT(qtable: Int32Array, tableId: number): Uint8Array {
  const data = new Uint8Array(65);
  data[0] = tableId; // precision=0 (8-bit), table id
  for (let s = 0; s < 64; s++) {
    // Write in zigzag order: DQT data[s] = quantization value for scan position s
    data[1 + s] = qtable[ZIGZAG_SCAN[s]!]!;
  }
  return data;
}

function buildSOF(sofMarker: number, width: number, height: number, components: number): Uint8Array {
  const data = new Uint8Array(6 + components * 3);
  data[0] = 8;                      // precision (always 8-bit in the stream; 12-bit handled externally)
  data[1] = (height >> 8) & 0xff;
  data[2] = height & 0xff;
  data[3] = (width >> 8) & 0xff;
  data[4] = width & 0xff;
  data[5] = components;

  if (components === 1) {
    data[6] = 1; data[7] = 0x11; data[8] = 0; // Y: 1x1, qtable 0
  } else {
    // 4:2:0 chroma subsampling
    data[6]  = 1; data[7]  = 0x22; data[8]  = 0; // Y:  2x2, qtable 0
    data[9]  = 2; data[10] = 0x11; data[11] = 1; // Cb: 1x1, qtable 1
    data[12] = 3; data[13] = 0x11; data[14] = 1; // Cr: 1x1, qtable 1
  }
  return data;
}

function buildDHT(table: HuffmanTable, tableClass: number, tableId: number): Uint8Array {
  const totalVals = table.bits.reduce((a, b) => a + b, 0);
  const data = new Uint8Array(1 + 16 + totalVals);
  data[0] = (tableClass << 4) | tableId;
  for (let i = 0; i < 16; i++) data[1 + i] = table.bits[i]!;
  data.set(table.values, 17);
  return data;
}

function buildSOS(components: number): Uint8Array {
  const data = new Uint8Array(1 + components * 2 + 3);
  data[0] = components;
  if (components === 1) {
    data[1] = 1; data[2] = 0x00; // Y: DC=0, AC=0
  } else {
    data[1] = 1; data[2] = 0x00; // Y:  DC=0, AC=0
    data[3] = 2; data[4] = 0x11; // Cb: DC=1, AC=1
    data[5] = 3; data[6] = 0x11; // Cr: DC=1, AC=1
  }
  data[1 + components*2] = 0;   // Ss=0
  data[2 + components*2] = 63;  // Se=63
  data[3 + components*2] = 0;   // Ah=0, Al=0
  return data;
}

function encodeBlock(
  bw: BitWriter,
  block: Uint8Array,
  qtable: Int32Array,
  dcCodes: HuffmanCode[],
  acCodes: HuffmanCode[],
  dcPred: { v: number },
): void {
  const coef = new Int32Array(64);
  dct(block, coef);

  // Quantize
  for (let i = 0; i < 64; i++) {
    const q = qtable[i]!;
    coef[i] = Math.trunc((coef[i]! + (coef[i]! >= 0 ? q : -q) / 2) / q);
  }

  // DC coefficient (DPCM)
  const dcDiff = coef[0]! - dcPred.v;
  dcPred.v = coef[0]!;
  const [cat, bits] = encodeCategory(dcDiff);
  const dc = dcCodes[cat]!;
  bw.writeBits(dc.code, dc.len);
  if (cat > 0) bw.writeBits(bits, cat);

  // AC coefficients (zigzag order, run-length coding)
  let zeroRun = 0;
  for (let s = 1; s < 64; s++) {
    const val = coef[ZIGZAG_SCAN[s]!]!;
    if (val === 0) {
      zeroRun++;
      continue;
    }
    while (zeroRun >= 16) {
      const zrl = acCodes[0xf0]!;
      bw.writeBits(zrl.code, zrl.len);
      zeroRun -= 16;
    }
    const [acCat, acBits] = encodeCategory(val);
    const rs = (zeroRun << 4) | acCat;
    const ac = acCodes[rs]!;
    bw.writeBits(ac.code, ac.len);
    bw.writeBits(acBits, acCat);
    zeroRun = 0;
  }
  if (zeroRun > 0) {
    const eob = acCodes[0x00]!;
    bw.writeBits(eob.code, eob.len);
  }
}

// ─────────────────────────────────────────────────────────────
// Encoder: RGB / grayscale → JPEG baseline bitstream
// ─────────────────────────────────────────────────────────────

/**
 * Encode an 8-bit image to JPEG.
 * @param sofMarker SOF0 (0xffc0) for Baseline, SOF1 (0xffc1) for Extended.
 */
export function encodeDctJpeg(
  pixels: Uint8Array,
  width: number,
  height: number,
  samplesPerPixel: number,
  quality: number,
  sofMarker = Markers.SOF0,
): Uint8Array {
  if (width <= 0 || height <= 0) throw new Error("Invalid image dimensions");
  if (samplesPerPixel !== 1 && samplesPerPixel !== 3) throw new Error("Only 1 or 3 samples/pixel supported");
  quality = Math.max(1, Math.min(100, quality));

  const lumQ  = scaleQuantTable(LUM_QUANT, quality);
  const chrQ  = scaleQuantTable(CHR_QUANT, quality);

  const dcLumTable = makeHuffmanTable(STD_DC_LUM_BITS, STD_DC_LUM_VALS);
  const acLumTable = makeHuffmanTable(STD_AC_LUM_BITS, STD_AC_LUM_VALS);
  const dcChrTable = makeHuffmanTable(STD_DC_CHR_BITS, STD_DC_CHR_VALS);
  const acChrTable = makeHuffmanTable(STD_AC_CHR_BITS, STD_AC_CHR_VALS);

  const dcLumCodes = buildHuffmanCodes(dcLumTable);
  const acLumCodes = buildHuffmanCodes(acLumTable);
  const dcChrCodes = buildHuffmanCodes(dcChrTable);
  const acChrCodes = buildHuffmanCodes(acChrTable);

  const w = new JpegWriter();
  w.writeMarker(Markers.SOI);
  w.writeSegment(Markers.DQT, buildDQT(lumQ, 0));
  if (samplesPerPixel === 3) w.writeSegment(Markers.DQT, buildDQT(chrQ, 1));
  w.writeSegment(sofMarker, buildSOF(sofMarker, width, height, samplesPerPixel));
  w.writeSegment(Markers.DHT, buildDHT(dcLumTable, 0, 0));
  w.writeSegment(Markers.DHT, buildDHT(acLumTable, 1, 0));
  if (samplesPerPixel === 3) {
    w.writeSegment(Markers.DHT, buildDHT(dcChrTable, 0, 1));
    w.writeSegment(Markers.DHT, buildDHT(acChrTable, 1, 1));
  }
  w.writeSegment(Markers.SOS, buildSOS(samplesPerPixel));

  const bw = new BitWriter();

  if (samplesPerPixel === 1) {
    // Grayscale: simple block-by-block scan
    const blocksW = divCeil(width, 8);
    const blocksH = divCeil(height, 8);
    const dcPred = { v: 0 };
    const block = new Uint8Array(64);
    for (let by = 0; by < blocksH; by++) {
      for (let bx = 0; bx < blocksW; bx++) {
        extractBlock(pixels, width, height, 1, bx, by, 0, block);
        encodeBlock(bw, block, lumQ, dcLumCodes, acLumCodes, dcPred);
      }
    }
  } else {
    // Color 4:2:0: Y (2x2 blocks), Cb (1x1), Cr (1x1) per 16x16 MCU
    const { Y, Cb, Cr, yStride, cStride, cHeight } = rgbToYcbcr420(pixels, width, height);
    const mcuW = divCeil(width, 16);
    const mcuH = divCeil(height, 16);
    const dcY = { v: 0 }, dcCb = { v: 0 }, dcCr = { v: 0 };
    const block = new Uint8Array(64);

    for (let mcuY = 0; mcuY < mcuH; mcuY++) {
      for (let mcuX = 0; mcuX < mcuW; mcuX++) {
        // Y: 2x2 blocks
        for (let v = 0; v < 2; v++) {
          for (let h = 0; h < 2; h++) {
            extractBlock(Y, yStride, divCeil(height, 8) * 8, 1, mcuX*2+h, mcuY*2+v, 0, block);
            encodeBlock(bw, block, lumQ, dcLumCodes, acLumCodes, dcY);
          }
        }
        // Cb
        extractBlock(Cb, cStride, cHeight, 1, mcuX, mcuY, 0, block);
        encodeBlock(bw, block, chrQ, dcChrCodes, acChrCodes, dcCb);
        // Cr
        extractBlock(Cr, cStride, cHeight, 1, mcuX, mcuY, 0, block);
        encodeBlock(bw, block, chrQ, dcChrCodes, acChrCodes, dcCr);
      }
    }
  }

  bw.flush();
  w.writeBytes(bw.toUint8Array());
  w.writeMarker(Markers.EOI);
  return w.toUint8Array();
}

/** Extract an 8×8 pixel block from a planar/interleaved image. */
function extractBlock(
  data: Uint8Array,
  stride: number,
  totalHeight: number,
  _spp: number,
  blockX: number,
  blockY: number,
  _comp: number,
  out: Uint8Array,
): void {
  for (let y = 0; y < 8; y++) {
    const srcY = Math.min(blockY * 8 + y, totalHeight - 1);
    for (let x = 0; x < 8; x++) {
      const srcX = Math.min(blockX * 8 + x, stride - 1);
      out[y * 8 + x] = data[srcY * stride + srcX]!;
    }
  }
}

/** Convert RGB → YCbCr with 4:2:0 subsampling. */
function rgbToYcbcr420(rgb: Uint8Array, width: number, height: number) {
  const yStride = divCeil(width, 8) * 8;
  const yHeight = divCeil(height, 8) * 8;
  const cStride = divCeil(width / 2, 8) * 8;
  const cHeight = divCeil(height / 2, 8) * 8;

  const Y  = new Uint8Array(yStride * yHeight);
  const Cb = new Uint8Array(cStride * cHeight);
  const Cr = new Uint8Array(cStride * cHeight);

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const off = (row * width + col) * 3;
      const [yy, cb, cr] = rgbToYcbcr(rgb[off]!, rgb[off+1]!, rgb[off+2]!);
      Y[row * yStride + col] = yy;
      if (row % 2 === 0 && col % 2 === 0) {
        const ci = (row >> 1) * cStride + (col >> 1);
        Cb[ci] = cb;
        Cr[ci] = cr;
      }
    }
  }
  return { Y, Cb, Cr, yStride, cStride, cHeight };
}

// ─────────────────────────────────────────────────────────────
// Decoder: JPEG baseline bitstream → pixel bytes
// ─────────────────────────────────────────────────────────────

interface CompInfo {
  id: number;
  hFactor: number;
  vFactor: number;
  qtableId: number;
  dcTableId: number;
  acTableId: number;
  dcPred: number;
  blockW: number; // width in blocks
  blockH: number; // height in blocks
  data: Uint8Array; // decoded block data (blockW * blockH * 64)
}

export interface DecodedJpeg {
  pixels: Uint8Array;
  width: number;
  height: number;
  components: number;
}

export function decodeDctJpeg(jpegData: Uint8Array): DecodedJpeg {
  const reader = new JpegReader(jpegData);

  if (reader.readMarker() !== Markers.SOI) throw new Error("Missing JPEG SOI");

  let width = 0, height = 0;
  let maxH = 1, maxV = 1;
  const comps: CompInfo[] = [];
  const qtables: Int32Array[] = [new Int32Array(64), new Int32Array(64), new Int32Array(64), new Int32Array(64)];
  const dcTables: (HuffmanTable | null)[] = [null, null, null, null];
  const acTables: (HuffmanTable | null)[] = [null, null, null, null];

  outer: for (;;) {
    const marker = reader.readMarker();
    switch (marker) {
      case Markers.SOF0:
      case Markers.SOF1: {
        const seg = reader.readSegment();
        if (seg.length < 6) throw new Error("Invalid SOF segment");
        // seg[0] = precision (8 for baseline; 12 for 12-bit extended — we decode as 8-bit stream)
        height = (seg[1]! << 8) | seg[2]!;
        width  = (seg[3]! << 8) | seg[4]!;
        const nc = seg[5]!;
        if (width <= 0 || height <= 0) throw new Error("Invalid JPEG dimensions");
        if (nc !== 1 && nc !== 3) throw new Error(`Unsupported component count: ${nc}`);
        for (let i = 0; i < nc; i++) {
          const off = 6 + i * 3;
          const h = (seg[off+1]! >> 4) & 0xf;
          const v = seg[off+1]! & 0xf;
          if (h > maxH) maxH = h;
          if (v > maxV) maxV = v;
          comps.push({ id: seg[off]!, hFactor: h, vFactor: v, qtableId: seg[off+2]!,
                       dcTableId: 0, acTableId: 0, dcPred: 0, blockW: 0, blockH: 0, data: new Uint8Array(0) });
        }
        // Compute per-component block dimensions
        for (const c of comps) {
          c.blockW = divCeil(width * c.hFactor, maxH * 8);
          c.blockH = divCeil(height * c.vFactor, maxV * 8);
          c.data = new Uint8Array(c.blockW * c.blockH * 64);
        }
        break;
      }

      case Markers.DQT: {
        const seg = reader.readSegment();
        let off = 0;
        while (off < seg.length) {
          const pqTq = seg[off++]!;
          const pq = (pqTq >> 4) & 0xf; // 0=8-bit, 1=16-bit entries
          const tq = pqTq & 0xf;
          const qt = qtables[tq]!;
          if (pq === 0) {
            for (let i = 0; i < 64; i++) qt[ZIGZAG_SCAN[i]!] = seg[off + i]!;
            off += 64;
          } else {
            for (let i = 0; i < 64; i++) qt[ZIGZAG_SCAN[i]!] = (seg[off + i*2]! << 8) | seg[off + i*2+1]!;
            off += 128;
          }
        }
        break;
      }

      case Markers.DHT: {
        const seg = reader.readSegment();
        let off = 0;
        while (off < seg.length) {
          const tcTh = seg[off++]!;
          const tc = (tcTh >> 4) & 0xf; // 0=DC, 1=AC
          const th = tcTh & 0xf;
          const bits: number[] = [];
          let total = 0;
          for (let i = 0; i < 16; i++) { bits.push(seg[off++]!); total += bits[i]!; }
          const vals = Array.from(seg.subarray(off, off + total));
          off += total;
          const table = new HuffmanTable({ bits, values: vals });
          if (tc === 0) dcTables[th] = table;
          else          acTables[th] = table;
        }
        break;
      }

      case Markers.DRI: {
        reader.readSegment(); // restart interval (ignored for now)
        break;
      }

      case Markers.SOS: {
        const seg = reader.readSegment();
        const ns = seg[0]!;
        for (let i = 0; i < ns; i++) {
          const cs   = seg[1 + i*2]!;
          const tdTa = seg[2 + i*2]!;
          const comp = comps.find(c => c.id === cs);
          if (!comp) throw new Error(`SOS references unknown component ${cs}`);
          comp.dcTableId = (tdTa >> 4) & 0xf;
          comp.acTableId = tdTa & 0xf;
        }
        break outer; // scan data follows
      }

      case Markers.EOI:
        throw new Error("Unexpected EOI before SOS");

      default:
        if (Markers.hasLength(marker)) reader.readSegment();
        break;
    }
  }

  if (comps.length === 0) throw new Error("No SOF found in JPEG stream");

  const scanBytes = reader.readScanBytes();
  const br = new BitReader(scanBytes);

  const mcuCols = divCeil(width, maxH * 8);
  const mcuRows = divCeil(height, maxV * 8);

  for (let mcuY = 0; mcuY < mcuRows; mcuY++) {
    for (let mcuX = 0; mcuX < mcuCols; mcuX++) {
      for (const comp of comps) {
        const dcTable = dcTables[comp.dcTableId];
        const acTable = acTables[comp.acTableId];
        if (!dcTable || !acTable) throw new Error("Missing Huffman table");

        for (let v = 0; v < comp.vFactor; v++) {
          for (let h = 0; h < comp.hFactor; h++) {
            const bx = mcuX * comp.hFactor + h;
            const by = mcuY * comp.vFactor + v;
            if (bx >= comp.blockW || by >= comp.blockH) continue;

            const coef = new Int32Array(64);

            // DC coefficient
            const cat = dcTable.decodeFrom(br);
            const diff = br.receiveExtend(cat);
            comp.dcPred += diff;
            coef[0] = comp.dcPred;

            // AC coefficients
            let k = 1;
            while (k < 64) {
              const rs = acTable.decodeFrom(br);
              const run = (rs >> 4) & 0xf;
              const size = rs & 0xf;
              if (size === 0) {
                if (run === 15) { k += 16; continue; } // ZRL
                break; // EOB
              }
              k += run;
              if (k >= 64) throw new Error("JPEG AC coefficient overflow");
              coef[ZIGZAG_SCAN[k]!] = br.receiveExtend(size);
              k++;
            }

            // Dequantize
            const qt = qtables[comp.qtableId]!;
            for (let i = 0; i < 64; i++) coef[i] = coef[i]! * qt[i]!;

            // IDCT → block data
            const block = new Uint8Array(64);
            idct(coef, block);
            const blockOff = (by * comp.blockW + bx) * 64;
            comp.data.set(block, blockOff);
          }
        }
      }
    }
  }

  return assemblePixels(comps, width, height, maxH, maxV);
}

function assemblePixels(
  comps: CompInfo[],
  width: number,
  height: number,
  maxH: number,
  maxV: number,
): DecodedJpeg {
  const nc = comps.length;
  const pixels = new Uint8Array(width * height * nc);

  if (nc === 1) {
    const comp = comps[0]!;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const bx = Math.floor(x / 8), by = Math.floor(y / 8);
        const px = x % 8, py = y % 8;
        pixels[y * width + x] = comp.data[(by * comp.blockW + bx) * 64 + py * 8 + px]!;
      }
    }
  } else {
    // YCbCr → RGB with per-component sampling
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let yy = 0, cb = 128, cr = 128;
        for (let ci = 0; ci < 3; ci++) {
          const comp = comps[ci]!;
          const sx = Math.floor((x * comp.hFactor) / maxH);
          const sy = Math.floor((y * comp.vFactor) / maxV);
          const bx = Math.floor(sx / 8), by = Math.floor(sy / 8);
          const px = sx % 8, py = sy % 8;
          const val = comp.data[(by * comp.blockW + bx) * 64 + py * 8 + px]!;
          if (ci === 0) yy = val;
          else if (ci === 1) cb = val;
          else cr = val;
        }
        const [r, g, b] = ycbcrToRgb(yy, cb, cr);
        const off = (y * width + x) * 3;
        pixels[off] = r; pixels[off+1] = g; pixels[off+2] = b;
      }
    }
  }

  return { pixels, width, height, components: nc };
}
