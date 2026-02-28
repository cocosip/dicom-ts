import { DicomUID } from "../core/DicomUID.js";

/**
 * Encapsulates SOP Class Extended Negotiation application info bytes.
 *
 * Field index starts at 1, matching the DICOM standard definition.
 */
export class DicomServiceApplicationInfo implements Iterable<[number, number]> {
  private readonly fields = new Map<number, number>();

  constructor(rawApplicationInfo?: readonly number[] | Uint8Array) {
    if (!rawApplicationInfo) {
      return;
    }

    for (let i = 0; i < rawApplicationInfo.length; i++) {
      this.fields.set(i + 1, rawApplicationInfo[i] ?? 0);
    }
    this.fillInTheGaps();
  }

  get count(): number {
    return this.fields.size;
  }

  static create(_sopClass: DicomUID, rawApplicationInfo: readonly number[] | Uint8Array): DicomServiceApplicationInfo {
    return new DicomServiceApplicationInfo(rawApplicationInfo);
  }

  add(index: number, value: number): void {
    validateIndex(index);
    if (this.fields.has(index)) {
      throw new Error(`Application info field ${index} already exists`);
    }
    this.fields.set(index, clampByte(value));
    this.fillInTheGaps();
  }

  addOrUpdate(index: number, value: number | boolean): void {
    validateIndex(index);
    this.fields.set(index, typeof value === "boolean" ? (value ? 1 : 0) : clampByte(value));
    this.fillInTheGaps();
  }

  contains(index: number): boolean {
    validateIndex(index);
    return this.fields.has(index);
  }

  getValue(index: number): number {
    validateIndex(index);
    const value = this.fields.get(index);
    if (value === undefined) {
      throw new Error(`Application info field ${index} does not exist`);
    }
    return value;
  }

  getValueAsBoolean(index: number, defaultValue: boolean): boolean {
    return this.contains(index) ? this.getValue(index) === 1 : defaultValue;
  }

  getValues(): Uint8Array {
    if (this.fields.size === 0) {
      return new Uint8Array();
    }

    const max = Math.max(...this.fields.keys());
    const values = new Uint8Array(max);
    for (let i = 1; i <= max; i++) {
      values[i - 1] = this.fields.get(i) ?? 0;
    }
    return values;
  }

  remove(index: number): boolean {
    validateIndex(index);
    const removed = this.fields.delete(index);
    this.fillInTheGaps();
    return removed;
  }

  clone(): DicomServiceApplicationInfo {
    return new DicomServiceApplicationInfo(this.getValues());
  }

  [Symbol.iterator](): Iterator<[number, number]> {
    const sorted = [...this.fields.entries()].sort((a, b) => a[0] - b[0]);
    return sorted[Symbol.iterator]();
  }

  toString(): string {
    return [...this].map(([, value]) => value.toString()).join(", ");
  }

  private fillInTheGaps(defaultValue = 0): void {
    if (this.fields.size === 0) {
      return;
    }

    const max = Math.max(...this.fields.keys());
    for (let i = 1; i < max; i++) {
      if (!this.fields.has(i)) {
        this.fields.set(i, defaultValue);
      }
    }
  }
}

function validateIndex(index: number): void {
  if (!Number.isInteger(index) || index <= 0 || index > 255) {
    throw new Error(`Invalid application info field index: ${index}`);
  }
}

function clampByte(value: number): number {
  const rounded = Math.round(value);
  if (rounded <= 0) return 0;
  if (rounded >= 255) return 255;
  return rounded;
}
