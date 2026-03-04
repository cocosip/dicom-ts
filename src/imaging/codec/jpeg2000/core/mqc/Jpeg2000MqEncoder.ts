import { getNlpsTable, getNmpsTable, getQeTable, getSwitchTable } from "./Jpeg2000MqDecoder.js";

const QE_TABLE = getQeTable();
const NMPS_TABLE = getNmpsTable();
const NLPS_TABLE = getNlpsTable();
const SWITCH_TABLE = getSwitchTable();

const BYPASS_CT_INIT = 0xdeadbeef;

export class Jpeg2000MqEncoder {
  private buffer = new Uint8Array(1);
  private start = 1;
  private bp = 0;

  private a = 0x8000;
  private c = 0;
  private ct = 12;

  private readonly contexts: Uint8Array;

  constructor(numContexts: number) {
    const safeContexts = Number.isFinite(numContexts) ? Math.max(0, Math.trunc(numContexts)) : 0;
    this.contexts = new Uint8Array(safeContexts);
  }

  encode(bit: number, contextId: number): void {
    if (contextId < 0 || contextId >= this.contexts.length) {
      throw new Error(`MQ context out of range: ${contextId}`);
    }

    const cx = this.contexts[contextId]!;
    const state = cx & 0x7f;
    const mps = cx >>> 7;
    const qe = QE_TABLE[state]!;

    if ((bit & 0x01) === mps) {
      this.a -= qe;
      if ((this.a & 0x8000) === 0) {
        if (this.a < qe) {
          this.a = qe;
        } else {
          this.c = (this.c + qe) >>> 0;
        }
        this.contexts[contextId] = (NMPS_TABLE[state]! | (mps << 7)) & 0xff;
        this.renormalizeEncoder();
      } else {
        this.c = (this.c + qe) >>> 0;
      }
      return;
    }

    this.a -= qe;
    if (this.a < qe) {
      this.c = (this.c + qe) >>> 0;
    } else {
      this.a = qe;
    }

    const newState = NLPS_TABLE[state]!;
    let newMps = mps;
    if (SWITCH_TABLE[state] === 1) {
      newMps = 1 - mps;
    }
    this.contexts[contextId] = (newState | (newMps << 7)) & 0xff;
    this.renormalizeEncoder();
  }

  flush(): Uint8Array {
    this.setBits();

    this.c = (this.c * (1 << this.ct)) >>> 0;
    this.byteOut();
    this.c = (this.c * (1 << this.ct)) >>> 0;
    this.byteOut();

    if (this.buffer[this.bp] !== 0xff) {
      this.bp++;
    }

    if (this.bp < this.start) {
      return new Uint8Array(0);
    }

    return this.buffer.slice(this.start, this.bp);
  }

  getBuffer(): Uint8Array {
    if (this.bp < this.start) {
      return new Uint8Array(0);
    }
    return this.buffer.slice(this.start, this.bp);
  }

  numBytes(): number {
    if (this.bp < this.start) {
      return 0;
    }
    return this.bp - this.start;
  }

  flushToOutput(): void {
    this.setBits();

    this.c = (this.c * (1 << this.ct)) >>> 0;
    this.byteOut();
    this.c = (this.c * (1 << this.ct)) >>> 0;
    this.byteOut();

    if (this.buffer[this.bp] !== 0xff) {
      this.bp++;
    }
  }

  ertermEnc(): void {
    let k = 11 - this.ct + 1;
    while (k > 0) {
      this.c = (this.c * (1 << this.ct)) >>> 0;
      this.ct = 0;
      this.byteOut();
      k -= this.ct;
    }
    if (this.buffer[this.bp] !== 0xff) {
      this.byteOut();
    }
  }

  bypassInitEnc(): void {
    this.c = 0;
    this.ct = BYPASS_CT_INIT;
  }

  bypassEncode(bit: number): void {
    if (this.ct === BYPASS_CT_INIT) {
      this.ct = 8;
    }
    this.ct--;
    this.c = (this.c + ((bit & 0x01) << this.ct)) >>> 0;
    if (this.ct === 0) {
      this.ensureIndex(this.bp);
      this.buffer[this.bp] = this.c & 0xff;
      this.ct = this.buffer[this.bp] === 0xff ? 7 : 8;
      this.bp++;
      this.c = 0;
    }
  }

  bypassExtraBytes(erterm: boolean): number {
    if (this.ct < 7) {
      return 1;
    }
    if (this.ct === 7 && (erterm || (this.bp > 0 && this.buffer[this.bp - 1] !== 0xff))) {
      return 1;
    }
    return 0;
  }

  bypassFlushEnc(erterm: boolean): void {
    if (this.ct < 7 || (this.ct === 7 && (erterm || (this.bp > 0 && this.buffer[this.bp - 1] !== 0xff)))) {
      let bitValue = 0;
      while (this.ct > 0) {
        this.ct--;
        this.c = (this.c + (bitValue << this.ct)) >>> 0;
        bitValue = bitValue === 0 ? 1 : 0;
      }
      this.ensureIndex(this.bp);
      this.buffer[this.bp] = this.c & 0xff;
      this.bp++;
      return;
    }

    if (this.ct === 7 && this.bp > 0 && this.buffer[this.bp - 1] === 0xff) {
      if (!erterm) {
        this.bp--;
      }
      return;
    }

    if (
      this.ct === 8 &&
      !erterm &&
      this.bp > 1 &&
      this.buffer[this.bp - 1] === 0x7f &&
      this.buffer[this.bp - 2] === 0xff
    ) {
      this.bp -= 2;
    }
  }

  reset(): void {
    this.buffer = new Uint8Array(1);
    this.start = 1;
    this.bp = 0;
    this.a = 0x8000;
    this.c = 0;
    this.ct = 12;
  }

  segmarkEnc(): void {
    for (let i = 1; i < 5; i++) {
      this.encode(i % 2, 18);
    }
  }

  resetContext(contextId: number): void {
    if (contextId < 0 || contextId >= this.contexts.length) {
      return;
    }
    this.contexts[contextId] = 0;
  }

  resetContexts(): void {
    this.contexts.fill(0);
  }

  getContextState(contextId: number): number {
    if (contextId < 0 || contextId >= this.contexts.length) {
      return 0;
    }
    return this.contexts[contextId]!;
  }

  setContextState(contextId: number, state: number): void {
    if (contextId < 0 || contextId >= this.contexts.length) {
      return;
    }
    this.contexts[contextId] = state & 0xff;
  }

  restartInitEnc(): void {
    this.a = 0x8000;
    this.c = 0;
    this.ct = 12;
    if (this.bp > this.start - 1) {
      this.bp--;
    }
    if (this.bp >= 0 && this.bp < this.buffer.length && this.buffer[this.bp] === 0xff) {
      this.ct = 13;
    }
  }

  private renormalizeEncoder(): void {
    while (this.a < 0x8000) {
      this.a <<= 1;
      this.c = (this.c * 2) >>> 0;
      this.ct--;
      if (this.ct === 0) {
        this.byteOut();
      }
    }
  }

  private byteOut(): void {
    this.ensureIndex(this.bp);

    if (this.buffer[this.bp] === 0xff) {
      this.bp++;
      this.ensureIndex(this.bp);
      this.buffer[this.bp] = (this.c >>> 20) & 0xff;
      this.c &= 0xfffff;
      this.ct = 7;
      return;
    }

    if ((this.c & 0x8000000) === 0) {
      this.bp++;
      this.ensureIndex(this.bp);
      this.buffer[this.bp] = (this.c >>> 19) & 0xff;
      this.c &= 0x7ffff;
      this.ct = 8;
      return;
    }

    const currentByte = this.buffer[this.bp] ?? 0;
    this.buffer[this.bp] = (currentByte + 1) & 0xff;
    if (this.buffer[this.bp] === 0xff) {
      this.c &= 0x7ffffff;
      this.bp++;
      this.ensureIndex(this.bp);
      this.buffer[this.bp] = (this.c >>> 20) & 0xff;
      this.c &= 0xfffff;
      this.ct = 7;
      return;
    }

    this.bp++;
    this.ensureIndex(this.bp);
    this.buffer[this.bp] = (this.c >>> 19) & 0xff;
    this.c &= 0x7ffff;
    this.ct = 8;
  }

  private setBits(): void {
    const tempC = (this.c + this.a) >>> 0;
    this.c |= 0xffff;
    if (this.c >= tempC) {
      this.c -= 0x8000;
    }
  }

  private ensureIndex(index: number): void {
    if (index < this.buffer.length) {
      return;
    }

    const needed = index + 1;
    let nextLength = this.buffer.length;
    while (nextLength < needed) {
      nextLength = Math.max(needed, nextLength * 2);
    }

    const next = new Uint8Array(nextLength);
    next.set(this.buffer, 0);
    this.buffer = next;
  }
}
