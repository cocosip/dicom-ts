/**
 * JPEG Huffman table, bit-level reader, and bit-level writer.
 *
 * Reference: go-dicom-codec/jpeg/standard/huffman.go
 *            go-dicom-codec/jpeg/standard/huffman_encoder.go
 */

// ---------------------------------------------------------------------------
// Huffman table
// ---------------------------------------------------------------------------

export interface HuffmanTableDef {
  bits: readonly number[];   // 16 entries: count of codes for lengths 1-16
  values: readonly number[]; // symbol values in canonical order
}

export class HuffmanTable {
  readonly bits: number[];
  readonly values: Uint8Array;

  // Decode lookup tables
  private readonly minCode = new Int32Array(16);
  private readonly maxCode = new Int32Array(16);
  private readonly valPtr  = new Int32Array(16);
  /** Fast 8-bit lookup: (nbits << 8) | value, or -1 if not found. */
  private readonly lookup  = new Int16Array(256).fill(-1);

  constructor(def: HuffmanTableDef) {
    this.bits   = Array.from(def.bits);
    this.values = new Uint8Array(def.values);
    this.build();
  }

  private build(): void {
    // Fast lookup for codes ≤ 8 bits
    let p = 0;
    for (let l = 0; l < 8; l++) {
      for (let i = 0; i < this.bits[l]!; i++) {
        const base = p << (7 - l);
        const fill = 1 << (7 - l);
        const entry = ((l + 1) << 8) | this.values[p]!;
        for (let j = 0; j < fill; j++) {
          this.lookup[base + j] = entry;
        }
        p++;
      }
    }

    // minCode / maxCode / valPtr for codes > 8 bits
    let code = 0;
    p = 0;
    for (let l = 0; l < 16; l++) {
      if (this.bits[l] === 0) {
        this.maxCode[l] = -1;
      } else {
        this.valPtr[l]  = p;
        this.minCode[l] = code;
        p    += this.bits[l]!;
        code += this.bits[l]!;
        this.maxCode[l] = code - 1;
      }
      code <<= 1;
    }
  }

  /** Decode one symbol from the bit buffer; advances reader state. */
  decodeFrom(reader: BitReader): number {
    // Fast path: try 8-bit look-ahead
    if (reader.nBits >= 8) {
      const peek  = (reader.bits >>> (reader.nBits - 8)) & 0xff;
      const entry = this.lookup[peek]!;
      if (entry >= 0) {
        reader.nBits -= (entry >>> 8);
        return entry & 0xff;
      }
    }

    // Slow path: bit by bit
    let code = 0;
    for (let l = 0; l < 16; l++) {
      const bit = reader.readBit();
      code = (code << 1) | bit;
      if (code <= this.maxCode[l]! && this.maxCode[l]! >= 0) {
        const idx = this.valPtr[l]! + code - this.minCode[l]!;
        if (idx >= 0 && idx < this.values.length) {
          return this.values[idx]!;
        }
      }
    }
    throw new Error("Huffman decode error: invalid code");
  }
}

// ---------------------------------------------------------------------------
// Huffman code (for encoding)
// ---------------------------------------------------------------------------

export interface HuffmanCode {
  code: number;
  len:  number;
}

/** Build encode lookup: symbol → {code, len}. */
export function buildHuffmanCodes(table: HuffmanTable): HuffmanCode[] {
  const codes: HuffmanCode[] = new Array(256).fill(null).map(() => ({ code: 0, len: 0 }));
  let code = 0;
  let p    = 0;
  for (let l = 0; l < 16; l++) {
    for (let i = 0; i < table.bits[l]!; i++) {
      const val = table.values[p]!;
      codes[val] = { code, len: l + 1 };
      code++;
      p++;
    }
    code <<= 1;
  }
  return codes;
}

// ---------------------------------------------------------------------------
// Bit-level reader (with JPEG byte stuffing)
// ---------------------------------------------------------------------------

export class BitReader {
  private pos = 0;
  bits  = 0;   // bit buffer (up to 32 bits, MSB-first)
  nBits = 0;   // valid bits in buffer

  constructor(private readonly data: Uint8Array) {}

  private loadByte(): void {
    if (this.pos >= this.data.length) {
      throw new Error("Unexpected end of JPEG scan data");
    }
    const b = this.data[this.pos++]!;
    if (b === 0xff) {
      // Byte stuffing: 0xFF 0x00 → literal 0xFF in bit stream
      const b2 = this.data[this.pos++];
      if (b2 !== 0x00) {
        throw new Error("Unexpected JPEG marker in scan data");
      }
    }
    this.bits  = ((this.bits << 8) | b) >>> 0;
    this.nBits += 8;
  }

  /** Read a single bit (1 or 0). */
  readBit(): number {
    if (this.nBits === 0) this.loadByte();
    this.nBits--;
    return (this.bits >>> this.nBits) & 1;
  }

  /** Read n bits as an unsigned integer. */
  readBits(n: number): number {
    if (n === 0) return 0;
    while (this.nBits < n) this.loadByte();
    this.nBits -= n;
    return (this.bits >>> this.nBits) & ((1 << n) - 1);
  }

  /** RECEIVE + EXTEND: read ssss bits and sign-extend. */
  receiveExtend(ssss: number): number {
    if (ssss === 0) return 0;
    const bits = this.readBits(ssss);
    return bits < (1 << (ssss - 1)) ? bits + (-1 << ssss) + 1 : bits;
  }
}

// ---------------------------------------------------------------------------
// Bit-level writer (with JPEG byte stuffing)
// ---------------------------------------------------------------------------

export class BitWriter {
  private buf: number[] = [];
  private bits  = 0;
  private nBits = 0;

  writeBits(value: number, n: number): void {
    if (n === 0) return;
    this.bits  = ((this.bits << n) | (value & ((1 << n) - 1))) >>> 0;
    this.nBits += n;
    while (this.nBits >= 8) {
      const b = (this.bits >>> (this.nBits - 8)) & 0xff;
      this.buf.push(b);
      if (b === 0xff) this.buf.push(0x00); // byte stuffing
      this.nBits -= 8;
    }
  }

  flush(): void {
    if (this.nBits > 0) {
      const pad = 8 - this.nBits;
      const b   = ((this.bits << pad) | ((1 << pad) - 1)) & 0xff;
      this.buf.push(b);
      if (b === 0xff) this.buf.push(0x00);
      this.nBits = 0;
      this.bits  = 0;
    }
  }

  toUint8Array(): Uint8Array {
    return new Uint8Array(this.buf);
  }
}

// ---------------------------------------------------------------------------
// Encode category helper
// ---------------------------------------------------------------------------

/** Returns (category, magnitude bits) for a difference value. */
export function encodeCategory(val: number): [cat: number, bits: number] {
  if (val === 0) return [0, 0];
  const absVal = Math.abs(val);
  let cat = 1;
  while ((1 << cat) <= absVal) cat++;
  const bits = val > 0 ? val : (1 << cat) + val - 1;
  return [cat, bits];
}
