/**
 * DicomDataset helper utilities (ported from fo-dicom DicomDatasetExtensions).
 */

import { DicomTag, DicomMaskedTag } from "../core/DicomTag.js";
import * as DicomValidation from "../core/DicomValidation.js";
import { DicomValidationException } from "../core/DicomValidation.js";
import * as DicomTags from "../core/DicomTag.generated.js";
import { DicomDataset } from "./DicomDataset.js";
import { DicomItem } from "./DicomItem.js";
import { DicomSequence } from "./DicomSequence.js";
import { DicomDate, DicomShortString, DicomTime } from "./DicomElement.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DicomDateTimeOffset {
  /** Composite date/time without offset applied (UTC fields reflect DICOM values). */
  readonly date: Date;
  /** Offset in minutes from UTC (positive east). */
  readonly offsetMinutes: number;
}

// ---------------------------------------------------------------------------
// Clone
// ---------------------------------------------------------------------------

export function cloneDataset(dataset: DicomDataset): DicomDataset {
  const clone = new DicomDataset();
  clone.internalTransferSyntax = dataset.internalTransferSyntax;
  clone.fallbackEncodings = [...dataset.fallbackEncodings];

  clone.validateItems = false;

  for (const item of dataset) {
    if (item instanceof DicomSequence) {
      const seqItems = item.items.map((ds) => cloneDataset(ds));
      clone.addOrUpdate(new DicomSequence(item.tag, ...seqItems));
    } else {
      clone.addOrUpdate(item);
    }
  }

  clone.validateItems = dataset.validateItems;

  return clone;
}

// ---------------------------------------------------------------------------
// Date/Time helpers
// ---------------------------------------------------------------------------

const MIN_DATE = new Date(Date.UTC(1, 0, 1, 0, 0, 0, 0));

function isMinDate(d: Date): boolean {
  return d.getTime() === MIN_DATE.getTime();
}

function combineDateAndTime(date: Date, time: Date): Date {
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    time.getUTCHours(),
    time.getUTCMinutes(),
    time.getUTCSeconds(),
    time.getUTCMilliseconds()
  ));
}

function localOffsetMinutesFor(date: Date): number {
  const local = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  );
  return -local.getTimezoneOffset();
}

function parseTimezoneOffset(value: string): number {
  DicomValidation.validateTimezoneOffset(value);
  const sign = value[0] === "-" ? -1 : 1;
  const hh = parseInt(value.slice(1, 3), 10);
  const mm = parseInt(value.slice(3, 5), 10);
  if (Number.isNaN(hh) || Number.isNaN(mm)) {
    throw new DicomValidationException(value, "SH", "invalid numeric values for TimezoneOffsetFromUTC");
  }
  return sign * (hh * 60 + mm);
}

// ---------------------------------------------------------------------------
// Date/Time extensions
// ---------------------------------------------------------------------------

export function getDateTime(dataset: DicomDataset, date: DicomTag, time: DicomTag): Date {
  const dd = dataset.getDicomItem<DicomDate>(date);
  const dt = dataset.getDicomItem<DicomTime>(time);

  let dateValue = MIN_DATE;
  let timeValue = MIN_DATE;

  if (dd && dd.count > 0) {
    DicomValidation.validateDA(dd.getAt(0));
    const parsed = dd.dateValue;
    if (!parsed) throw new Error(`Invalid date value for ${date}`);
    dateValue = parsed;
  }

  if (dt && dt.count > 0) {
    DicomValidation.validateTM(dt.getAt(0));
    const parsed = dt.dateValue;
    if (!parsed) throw new Error(`Invalid time value for ${time}`);
    timeValue = parsed;
  }

  return combineDateAndTime(dateValue, timeValue);
}

export function tryGetDateTime(dataset: DicomDataset, date: DicomTag, time: DicomTag): Date | undefined {
  try {
    return getDateTime(dataset, date, time);
  } catch {
    return undefined;
  }
}

export function getDateTimeOffset(
  dataset: DicomDataset,
  date: DicomTag,
  time: DicomTag,
  topLevelDataset?: DicomDataset
): DicomDateTimeOffset {
  const dateTime = getDateTime(dataset, date, time);
  if (isMinDate(dateTime)) {
    return { date: MIN_DATE, offsetMinutes: 0 };
  }

  const scope = topLevelDataset ?? dataset;
  const tz = scope.getDicomItem<DicomShortString>(DicomTags.TimezoneOffsetFromUTC);
  if (tz && tz.count > 0) {
    const raw = tz.getAt(0);
    const offsetMinutes = parseTimezoneOffset(raw);
    return { date: dateTime, offsetMinutes };
  }

  return { date: dateTime, offsetMinutes: localOffsetMinutesFor(dateTime) };
}

export function tryGetDateTimeOffset(
  dataset: DicomDataset,
  date: DicomTag,
  time: DicomTag,
  topLevelDataset?: DicomDataset
): DicomDateTimeOffset | undefined {
  try {
    const value = getDateTimeOffset(dataset, date, time, topLevelDataset);
    return isMinDate(value.date) ? undefined : value;
  } catch {
    return undefined;
  }
}

// ---------------------------------------------------------------------------
// Enumeration helpers
// ---------------------------------------------------------------------------

export function* enumerateMasked(dataset: DicomDataset, mask: DicomMaskedTag): Iterable<DicomItem> {
  for (const item of dataset) {
    if (mask.isMatch(item.tag)) yield item;
  }
}

export function* enumerateGroup(dataset: DicomDataset, group: number): Iterable<DicomItem> {
  for (const item of dataset) {
    if (item.tag.group === group && item.tag.element !== 0x0000) {
      yield item;
    }
  }
}

// ---------------------------------------------------------------------------
// Validation toggles
// ---------------------------------------------------------------------------

export function notValidated(dataset: DicomDataset): DicomDataset {
  dataset.validateItems = false;
  return dataset;
}

export function validated(dataset: DicomDataset): DicomDataset {
  dataset.validateItems = true;
  return dataset;
}
