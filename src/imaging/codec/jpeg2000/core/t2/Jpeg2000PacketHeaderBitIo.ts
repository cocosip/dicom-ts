const END_OF_DATA_MESSAGE = "end of data";
const INVALID_BIT_COUNT_MESSAGE = "invalid number of bits";

export class Jpeg2000PacketHeaderBitWriter {
  private readonly bytes: number[] = [];
  private out = 0;
  private ct = 8;

  writeBit(bit: number): void {
    if (this.ct === 0) {
      this.byteOut();
    }

    this.ct--;
    if (bit !== 0) {
      this.out |= 1 << this.ct;
    }
  }

  writeBits(value: number, bitCount: number): void {
    if (bitCount <= 0 || bitCount > 32) {
      throw new Error(INVALID_BIT_COUNT_MESSAGE);
    }

    for (let i = bitCount - 1; i >= 0; i--) {
      this.writeBit((value >>> i) & 1);
    }
  }

  flush(): Uint8Array {
    this.byteOut();
    if (this.ct === 7) {
      this.byteOut();
    }
    return Uint8Array.from(this.bytes);
  }

  private byteOut(): void {
    this.out = (this.out << 8) & 0xffff;
    this.ct = this.out === 0xff00 ? 7 : 8;
    this.bytes.push((this.out >>> 8) & 0xff);
  }
}

export class Jpeg2000PacketHeaderBitReader {
  private pos = 0;
  private buffer = 0;
  private ct = 0;

  constructor(private readonly data: Uint8Array) {}

  readBit(): number {
    if (this.ct === 0) {
      this.byteIn();
    }

    this.ct--;
    return (this.buffer >>> this.ct) & 1;
  }

  readBits(bitCount: number): number {
    if (bitCount <= 0 || bitCount > 32) {
      throw new Error(INVALID_BIT_COUNT_MESSAGE);
    }

    let value = 0;
    for (let i = 0; i < bitCount; i++) {
      value = (value << 1) | this.readBit();
    }
    return value;
  }

  alignToByte(): void {
    if (this.ct === 0) {
      return;
    }

    if ((this.buffer & 0xff) === 0xff) {
      this.byteIn();
    }

    this.ct = 0;
  }

  bytesRead(): number {
    return this.pos;
  }

  private byteIn(): void {
    if (this.pos >= this.data.length) {
      throw new Error(END_OF_DATA_MESSAGE);
    }

    this.buffer = (this.buffer << 8) & 0xffff;
    this.ct = this.buffer === 0xff00 ? 7 : 8;
    this.buffer |= this.data[this.pos]!;
    this.pos++;
  }
}

export function floorLog2(value: number): number {
  if (value <= 1) {
    return 0;
  }

  let current = Math.floor(value);
  let result = 0;
  while (current > 1) {
    current >>>= 1;
    result++;
  }
  return result;
}

export {
  END_OF_DATA_MESSAGE,
  INVALID_BIT_COUNT_MESSAGE,
};