const QE_TABLE = new Uint32Array([
  0x5601, 0x3401, 0x1801, 0x0ac1, 0x0521, 0x0221, 0x5601, 0x5401,
  0x4801, 0x3801, 0x3001, 0x2401, 0x1c01, 0x1601, 0x5601, 0x5401,
  0x5101, 0x4801, 0x3801, 0x3401, 0x3001, 0x2801, 0x2401, 0x2201,
  0x1c01, 0x1801, 0x1601, 0x1401, 0x1201, 0x1101, 0x0ac1, 0x09c1,
  0x08a1, 0x0521, 0x0441, 0x02a1, 0x0221, 0x0141, 0x0111, 0x0085,
  0x0049, 0x0025, 0x0015, 0x0009, 0x0005, 0x0001, 0x5601,
]);

const NMPS_TABLE = new Uint8Array([
  1, 2, 3, 4, 5, 38, 7, 8,
  9, 10, 11, 12, 13, 29, 15, 16,
  17, 18, 19, 20, 21, 22, 23, 24,
  25, 26, 27, 28, 29, 30, 31, 32,
  33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 45, 46,
]);

const NLPS_TABLE = new Uint8Array([
  1, 6, 9, 12, 29, 33, 6, 14,
  14, 14, 17, 18, 20, 21, 14, 14,
  15, 16, 17, 18, 19, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29,
  30, 31, 32, 33, 34, 35, 36, 37,
  38, 39, 40, 41, 42, 43, 46,
]);

const SWITCH_TABLE = new Uint8Array([
  1, 0, 0, 0, 0, 0, 1, 0,
  0, 0, 0, 0, 0, 0, 1, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0,
]);

export class Jpeg2000MqDecoder {
  private data: Uint8Array;
  private bp = 0;
  private dataLength = 0;

  private a = 0x8000;
  private c = 0;
  private ct = 0;
  private eos = 0;

  private contexts: Uint8Array;

  constructor(data: Uint8Array, numContexts: number) {
    this.contexts = new Uint8Array(Math.max(0, Math.floor(numContexts)));
    this.data = appendSentinel(data);
    this.dataLength = data.length;
    this.init();
  }

  static createRawDecoder(data: Uint8Array): Jpeg2000MqDecoder {
    const decoder = new Jpeg2000MqDecoder(new Uint8Array(0), 0);
    decoder.rawInit(data);
    return decoder;
  }

  setData(data: Uint8Array): void {
    this.data = appendSentinel(data);
    this.bp = 0;
    this.dataLength = data.length;
    this.eos = 0;
    this.a = 0x8000;
    this.c = 0;
    this.ct = 0;
    this.init();
  }

  setContextState(contextId: number, value: number): void {
    if (contextId < 0 || contextId >= this.contexts.length) {
      return;
    }
    this.contexts[contextId] = value & 0xff;
  }

  getContextState(contextId: number): number {
    if (contextId < 0 || contextId >= this.contexts.length) {
      return 0;
    }
    return this.contexts[contextId]!;
  }

  getContexts(): Uint8Array {
    return this.contexts.slice();
  }

  setContexts(contexts: Uint8Array): void {
    this.contexts = contexts.slice();
  }

  resetContexts(): void {
    this.contexts.fill(0);
  }

  resetContext(contextId: number): void {
    if (contextId < 0 || contextId >= this.contexts.length) {
      return;
    }
    this.contexts[contextId] = 0;
  }

  reinitAfterTermination(): void {
    this.a = 0x8000;
    this.c = 0;
    this.ct = 0;
  }

  decode(contextId: number): number {
    const cx = this.contexts[contextId]!;
    const state = cx & 0x7f;
    const mps = cx >>> 7;
    const qe = QE_TABLE[state]!;

    this.a -= qe;

    let decoded = 0;

    if ((this.c >>> 16) < qe) {
      if (this.a < qe) {
        this.a = qe;
        decoded = mps;
        this.contexts[contextId] = (NMPS_TABLE[state]! | (mps << 7)) & 0xff;
      } else {
        this.a = qe;
        decoded = 1 - mps;
        let newMps = mps;
        if (SWITCH_TABLE[state] === 1) {
          newMps = 1 - mps;
        }
        this.contexts[contextId] = (NLPS_TABLE[state]! | (newMps << 7)) & 0xff;
      }
      this.renormalize();
      return decoded;
    }

    this.c -= qe << 16;
    if ((this.a & 0x8000) !== 0) {
      return mps;
    }

    if (this.a < qe) {
      decoded = 1 - mps;
      let newMps = mps;
      if (SWITCH_TABLE[state] === 1) {
        newMps = 1 - mps;
      }
      this.contexts[contextId] = (NLPS_TABLE[state]! | (newMps << 7)) & 0xff;
    } else {
      decoded = mps;
      this.contexts[contextId] = (NMPS_TABLE[state]! | (mps << 7)) & 0xff;
    }

    this.renormalize();
    return decoded;
  }

  rawInit(data: Uint8Array): void {
    this.data = appendSentinel(data);
    this.bp = 0;
    this.dataLength = data.length;
    this.eos = 0;
    this.a = 0;
    this.c = 0;
    this.ct = 0;
  }

  rawDecode(): number {
    if (this.ct === 0) {
      if (this.c === 0xff) {
        const next = this.data[this.bp]!;
        if (next > 0x8f) {
          this.c = 0xff;
          this.ct = 8;
        } else {
          this.c = next;
          this.bp++;
          this.ct = 7;
        }
      } else {
        this.c = this.data[this.bp]!;
        this.bp++;
        this.ct = 8;
      }
    }

    this.ct--;
    return (this.c >>> this.ct) & 0x01;
  }

  private init(): void {
    if (this.dataLength === 0) {
      this.c = 0xff << 16;
    } else {
      this.c = this.data[0]! << 16;
    }

    this.byteIn();
    this.c <<= 7;
    this.ct -= 7;
    this.a = 0x8000;
  }

  private renormalize(): void {
    while (this.a < 0x8000) {
      if (this.ct === 0) {
        this.byteIn();
      }
      this.a <<= 1;
      this.c <<= 1;
      this.ct--;
    }
  }

  private byteIn(): void {
    const next = this.data[this.bp + 1]!;

    if (this.data[this.bp] === 0xff) {
      if (next > 0x8f) {
        this.c += 0xff00;
        this.ct = 8;
        this.eos++;
        return;
      }

      this.bp++;
      this.c += next << 9;
      this.ct = 7;
      return;
    }

    this.bp++;
    this.c += next << 8;
    this.ct = 8;
  }
}

function appendSentinel(data: Uint8Array): Uint8Array {
  const output = new Uint8Array(data.length + 2);
  output.set(data, 0);
  output[data.length] = 0xff;
  output[data.length + 1] = 0xff;
  return output;
}

export function getQeTable(): Uint32Array {
  return QE_TABLE;
}

export function getNmpsTable(): Uint8Array {
  return NMPS_TABLE;
}

export function getNlpsTable(): Uint8Array {
  return NLPS_TABLE;
}

export function getSwitchTable(): Uint8Array {
  return SWITCH_TABLE;
}