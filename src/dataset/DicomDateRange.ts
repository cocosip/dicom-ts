import { DicomRange } from "./DicomRange.js";

/**
 * Date range used by DA/TM/DT query values.
 *
 * Supports open-ended ranges by allowing null bounds.
 */
export class DicomDateRange {
  minimum: Date | null;
  maximum: Date | null;

  constructor(minimum: Date | null = null, maximum: Date | null = null) {
    this.minimum = minimum;
    this.maximum = maximum;
  }

  contains(value: Date): boolean {
    if (this.minimum && value.getTime() < this.minimum.getTime()) {
      return false;
    }
    if (this.maximum && value.getTime() > this.maximum.getTime()) {
      return false;
    }
    return true;
  }

  join(value: Date): void {
    if (!this.minimum || value.getTime() < this.minimum.getTime()) {
      this.minimum = value;
    }
    if (!this.maximum || value.getTime() > this.maximum.getTime()) {
      this.maximum = value;
    }
  }

  toString(): string {
    return this.toStringWithFormatter(formatDateTime);
  }

  toStringWithFormatter(formatter: (date: Date) => string): string {
    const min = this.minimum ? formatter(this.minimum) : "";
    const max = this.maximum ? formatter(this.maximum) : "";
    const value = `${min}-${max}`;
    return value === "-" ? "" : value;
  }

  toDicomDateString(): string {
    return this.toStringWithFormatter(formatDate);
  }

  toDicomTimeString(): string {
    return this.toStringWithFormatter(formatTime);
  }

  toDicomDateTimeString(): string {
    return this.toStringWithFormatter(formatDateTime);
  }

  toComparableRange(
    minimumFallback: Date = new Date(-8640000000000000),
    maximumFallback: Date = new Date(8640000000000000),
  ): DicomRange<Date> {
    return new DicomRange<Date>(this.minimum ?? minimumFallback, this.maximum ?? maximumFallback);
  }
}

function formatDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function formatTime(date: Date): string {
  const hour = String(date.getUTCHours()).padStart(2, "0");
  const minute = String(date.getUTCMinutes()).padStart(2, "0");
  const second = String(date.getUTCSeconds()).padStart(2, "0");
  const millisecond = date.getUTCMilliseconds();
  if (millisecond === 0) {
    return `${hour}${minute}${second}`;
  }

  let fraction = String(millisecond).padStart(3, "0").replace(/0+$/, "");
  if (fraction.length === 0) {
    fraction = "0";
  }
  return `${hour}${minute}${second}.${fraction}`;
}

function formatDateTime(date: Date): string {
  return `${formatDate(date)}${formatTime(date)}`;
}
