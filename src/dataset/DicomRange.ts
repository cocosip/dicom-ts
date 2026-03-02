/**
 * Generic comparable range helper.
 *
 * Ported from fo-dicom/FO-DICOM.Core/DicomRange.cs
 */
export class DicomRange<T> {
  minimum: T;
  maximum: T;
  private readonly compare: (left: T, right: T) => number;

  constructor(minimum: T, maximum: T, compare?: (left: T, right: T) => number) {
    this.minimum = minimum;
    this.maximum = maximum;
    this.compare = compare ?? defaultCompare;
  }

  contains(value: T): boolean {
    return this.compare(this.minimum, value) <= 0 && this.compare(this.maximum, value) >= 0;
  }

  join(value: T): void {
    if (this.compare(this.minimum, value) > 0) {
      this.minimum = value;
    }
    if (this.compare(this.maximum, value) < 0) {
      this.maximum = value;
    }
  }
}

function defaultCompare<T>(left: T, right: T): number {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }
  if (typeof left === "bigint" && typeof right === "bigint") {
    return left === right ? 0 : left < right ? -1 : 1;
  }
  if (left instanceof Date && right instanceof Date) {
    return left.getTime() - right.getTime();
  }

  const compareTo = (left as { compareTo?: (value: unknown) => number }).compareTo;
  if (typeof compareTo === "function") {
    return compareTo.call(left, right);
  }

  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}
