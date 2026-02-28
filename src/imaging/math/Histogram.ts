/**
 * Integer histogram with configurable value window.
 */
export class Histogram {
  private readonly values: number[];
  private readonly offset: number;

  private totalValueCount = 0;
  private windowPercent = -1;
  private windowStartIndex = 0;
  private windowEndIndex = 0;
  private windowValueCount = 0;

  constructor(min: number, max: number) {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new TypeError("Histogram bounds must be integers.");
    }
    if (max < min) {
      throw new RangeError("Histogram max must be greater than or equal to min.");
    }
    const range = max - min + 1;
    this.values = new Array<number>(range).fill(0);
    this.offset = -min;
    this.windowStartIndex = 0;
    this.windowEndIndex = this.values.length - 1;
  }

  get windowStart(): number {
    return this.windowStartIndex - this.offset;
  }

  get windowEnd(): number {
    return this.windowEndIndex - this.offset;
  }

  get windowTotal(): number {
    if (this.windowPercent === -1) this.applyWindow(100);
    return this.windowValueCount;
  }

  count(value: number): number {
    const pos = this.positionOf(value);
    if (pos < 0 || pos >= this.values.length) return 0;
    return this.values[pos] ?? 0;
  }

  add(value: number): void {
    const pos = this.positionOf(value);
    if (pos < 0 || pos >= this.values.length) return;

    this.values[pos] = (this.values[pos] ?? 0) + 1;
    this.totalValueCount++;

    if (pos >= this.windowStartIndex && pos <= this.windowEndIndex) {
      this.windowValueCount++;
    }
  }

  clear(value: number): void {
    const pos = this.positionOf(value);
    if (pos < 0 || pos >= this.values.length) return;

    const count = this.values[pos] ?? 0;
    this.totalValueCount -= count;
    if (pos >= this.windowStartIndex && pos <= this.windowEndIndex) {
      this.windowValueCount -= count;
    }
    this.values[pos] = 0;
  }

  applyWindow(percent: number): void;
  applyWindow(start: number, end: number): void;
  applyWindow(a: number, b?: number): void {
    if (b == null) {
      this.applyWindowByPercent(a);
      return;
    }
    this.applyWindowByRange(a, b);
  }

  private applyWindowByPercent(percent: number): void {
    const boundedPercent = Math.max(0, Math.min(100, Math.trunc(percent)));
    this.windowStartIndex = 0;
    this.windowEndIndex = this.values.length - 1;
    this.windowPercent = boundedPercent;
    this.windowValueCount = this.totalValueCount;

    if (boundedPercent === 100 || this.totalValueCount === 0) return;

    const target = Math.floor(this.totalValueCount * (boundedPercent / 100));
    while (this.windowValueCount > target) {
      let next = this.windowValueCount;
      const startCount = this.values[this.windowStartIndex] ?? 0;
      const endCount = this.values[this.windowEndIndex] ?? 0;
      if (startCount >= endCount) {
        next -= startCount;
        if (next < target) break;
        this.windowStartIndex++;
      } else {
        next -= endCount;
        if (next < target) break;
        this.windowEndIndex--;
      }
      this.windowValueCount = next;
      if (this.windowStartIndex >= this.windowEndIndex) break;
    }
  }

  private applyWindowByRange(start: number, end: number): void {
    let startPos = this.positionOf(Math.trunc(start));
    let endPos = this.positionOf(Math.trunc(end));
    if (startPos > endPos) {
      const tmp = startPos;
      startPos = endPos;
      endPos = tmp;
    }

    this.windowStartIndex = Math.max(0, Math.min(this.values.length - 1, startPos));
    this.windowEndIndex = Math.max(0, Math.min(this.values.length - 1, endPos));

    if (this.windowStartIndex === 0 && this.windowEndIndex === this.values.length - 1) {
      this.windowPercent = 100;
      this.windowValueCount = this.totalValueCount;
      return;
    }

    let total = 0;
    for (let i = this.windowStartIndex; i <= this.windowEndIndex; i++) {
      total += this.values[i] ?? 0;
    }
    this.windowValueCount = total;
    this.windowPercent = this.totalValueCount === 0
      ? 0
      : Math.floor((this.windowValueCount / this.totalValueCount) * 100);
  }

  private positionOf(value: number): number {
    return Math.trunc(value) + this.offset;
  }
}
