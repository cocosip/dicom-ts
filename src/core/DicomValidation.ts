/**
 * DICOM VR string content validators.
 *
 * Ported from fo-dicom/FO-DICOM.Core/DicomValidation.cs.
 *
 * Each `validateXX()` function receives a single component string (not a
 * multi-value string — splitting on `\` is done by the element layer).
 * They throw `DicomValidationException` on any violation.
 *
 * Global validation can be disabled via `DicomValidation.performValidation`.
 */

// ---------------------------------------------------------------------------
// Exception
// ---------------------------------------------------------------------------

export class DicomValidationException extends Error {
  readonly value: string | null;
  readonly vrCode: string;

  constructor(value: string | null, vrCode: string, message: string) {
    super(`Validation failed for VR ${vrCode}: ${message} (value: ${JSON.stringify(value)})`);
    this.name = "DicomValidationException";
    this.value = value;
    this.vrCode = vrCode;
  }
}

// ---------------------------------------------------------------------------
// Global switch
// ---------------------------------------------------------------------------

/**
 * When false, all `validate*` functions are no-ops.
 * Mirrors `DicomValidation.PerformValidation` in fo-dicom.
 */
export let performValidation = true;

export function setPerformValidation(value: boolean): void {
  performValidation = value;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Returns true for control characters other than ESC (0x1B). */
function isControlExceptESC(ch: string): boolean {
  const c = ch.charCodeAt(0);
  return c < 0x20 && c !== 0x1b; // ESC = 0x1b
}

function hasControlExceptESC(s: string): boolean {
  for (const ch of s) {
    if (isControlExceptESC(ch)) return true;
  }
  return false;
}

function fail(value: string | null, vrCode: string, message: string): never {
  throw new DicomValidationException(value, vrCode, message);
}

// ---------------------------------------------------------------------------
// Per-VR validators (signature: (content: string) => void)
// ---------------------------------------------------------------------------

/**
 * AE — Application Entity
 * - Max 16 characters
 * - No backslash, no control characters (excluding ESC)
 * - Not all spaces
 */
export function validateAE(content: string): void {
  if (!performValidation) return;
  if (content === null) fail(null, "AE", "value is null");
  if (content.length > 16) fail(content, "AE", "value exceeds maximum length of 16 characters");
  if (/^\s*$/.test(content)) fail(content, "AE", "value may not consist only of spaces");
  if (content.includes("\\") || hasControlExceptESC(content)) {
    fail(content, "AE", "value contains invalid control character or backslash");
  }
}

/**
 * AS — Age String
 * - Exactly 4 characters: `nnnD`, `nnnW`, `nnnM`, or `nnnY`
 */
export function validateAS(content: string): void {
  if (!performValidation) return;
  if (content === null) fail(null, "AS", "value is null");
  if (content.length === 0) return; // empty is allowed
  if (!/^\d\d\d[DWMY]$/.test(content)) {
    fail(content, "AS", "value does not have pattern nnn[DWMY]");
  }
}

/**
 * CS — Code String
 * - Max 16 characters
 * - Only uppercase letters, digits, space, underscore
 */
export function validateCS(content: string): void {
  if (!performValidation) return;
  if (content === null) fail(null, "CS", "value is null");
  if (content.length > 16) fail(content, "CS", "value exceeds maximum length of 16 characters");
  if (!/^[A-Z0-9_ ]*$/.test(content)) {
    fail(content, "CS", "value contains invalid character — only uppercase letters, digits, space and underscore are allowed");
  }
}

/**
 * DA — Date
 * - Format: `YYYYMMDD` (or range `YYYYMMDD-YYYYMMDD` for queries)
 * - Month 01–12, day 01–31
 */
export function validateDA(content: string): void {
  if (!performValidation) return;
  if (content === null) fail(null, "DA", "value is null");

  const dateComponents = content.split("-");
  if (dateComponents.length > 2) {
    fail(content, "DA", "value contains too many range separators '-'");
  }

  for (const comp of dateComponents) {
    const trimmed = comp.trimEnd();
    if (!trimmed) continue;

    if (!/^\d{8}$/.test(trimmed)) {
      fail(content, "DA", "date value does not match the pattern YYYYMMDD");
    }
    const month = parseInt(trimmed.slice(4, 6), 10);
    const day = parseInt(trimmed.slice(6, 8), 10);
    if (month > 12) fail(content, "DA", "month component exceeds 12");
    if (day > 31) fail(content, "DA", "day component exceeds 31");
  }
}

/**
 * DS — Decimal String
 * - Max 16 characters
 * - Decimal number format (optional sign, digits, optional decimal point, optional exponent)
 */
export function validateDS(content: string): void {
  if (!performValidation) return;
  if (content === null) fail(null, "DS", "value is null");
  if (content.length > 16) fail(content, "DS", "value exceeds maximum length of 16 characters");
  const trimmed = content.trim();
  if (trimmed.length > 0 && !/^[+-]?((\d+(\.\d*)?)|(\.\d+))([eE][-+]?\d+)?$/.test(trimmed)) {
    fail(content, "DS", "value is not a valid decimal string");
  }
}

/**
 * DT — Date Time
 * - Format: `YYYY[MM[DD[HH[MM[SS[.FFFFFF]]]]]][&ZZXX]`
 * - Optional UTC offset suffix `+ZZXX` or `-ZZXX`
 */
export function validateDT(content: string): void {
  if (!performValidation) return;
  if (content === null) fail(null, "DT", "value is null");

  if (content.includes("-0000")) {
    fail(content, "DT", "negative UTC hours component with value -0000 is not allowed");
  }
  if (content.trim() === "-") {
    fail(content, "DT", "both dateTime components in range cannot be empty");
  }

  // Handle range format (split on '-', reassemble negative UTC offsets)
  let dateTimeComponents = content.split("-");

  if (dateTimeComponents.length > 4) {
    fail(content, "DT", "value contains too many range separators '-'");
  }

  if (dateTimeComponents.length === 4) {
    dateTimeComponents = [
      (dateTimeComponents[0] ?? "") + "-" + (dateTimeComponents[1] ?? ""),
      (dateTimeComponents[2] ?? "") + "-" + (dateTimeComponents[3] ?? ""),
    ];
  } else if (dateTimeComponents.length === 3) {
    const p1 = dateTimeComponents[1] ?? "";
    const p2 = dateTimeComponents[2] ?? "";
    if (/^\d{4}$/.test(p1) && parseInt(p1, 10) <= 1200) {
      dateTimeComponents = [(dateTimeComponents[0] ?? "") + "-" + p1, p2];
    } else if (/^\d{4}$/.test(p2) && parseInt(p2, 10) <= 1200) {
      dateTimeComponents = [dateTimeComponents[0] ?? "", (dateTimeComponents[1] ?? "") + "-" + p2];
    } else {
      fail(content, "DT", "value is in invalid range format");
    }
  } else if (dateTimeComponents.length === 2) {
    const p1 = dateTimeComponents[1] ?? "";
    if (/^\d{4}$/.test(p1) && parseInt(p1, 10) <= 1200) {
      dateTimeComponents = [(dateTimeComponents[0] ?? "") + "-" + p1];
    }
  }

  for (const component of dateTimeComponents) {
    const trimmed = component.trimEnd();
    if (!trimmed) continue;

    // Split off UTC offset (+/-)
    const signIdx = trimmed.search(/[+-]/);
    let dateTimeStr = trimmed;
    let utcSuffix: string | null = null;

    if (signIdx > 0) {
      dateTimeStr = trimmed.slice(0, signIdx);
      utcSuffix = trimmed.slice(signIdx + 1);
      if (!/^\d{4}$/.test(utcSuffix)) {
        fail(content, "DT", "UTC offset does not match pattern &ZZXX");
      }
      const isPositive = trimmed[signIdx] === "+";
      const hours = parseInt(utcSuffix.slice(0, 2), 10);
      const minutes = parseInt(utcSuffix.slice(2, 2), 10);
      if (isPositive && hours > 14) fail(content, "DT", "positive UTC hours component exceeds 14");
      if (!isPositive && hours > 12) fail(content, "DT", "negative UTC hours component exceeds 12");
      if (minutes > 59) fail(content, "DT", "UTC minutes component exceeds 59");
    } else if (signIdx === 0) {
      // Leading sign not expected in this position
      fail(content, "DT", "unexpected leading sign character");
    }

    if (!_validateDTString(dateTimeStr)) {
      fail(content, "DT", "value does not match pattern YYYY[MM[DD[HH[MM[SS[.F{1-6}]]]]]]");
    }

    const len = dateTimeStr.replace(/\.\d+$/, "").length;

    if (dateTimeStr.length >= 2 && len >= 14) {
      const ss = parseInt(dateTimeStr.slice(12, 14), 10);
      if (ss > 60) fail(content, "DT", "seconds component exceeds 60");
    }
    if (len >= 12) {
      const mm = parseInt(dateTimeStr.slice(10, 12), 10);
      if (mm > 59) fail(content, "DT", "minutes component exceeds 59");
    }
    if (len >= 10) {
      const hh = parseInt(dateTimeStr.slice(8, 10), 10);
      if (hh > 23) fail(content, "DT", "hours component exceeds 23");
    }
    if (len >= 8) {
      const dd = parseInt(dateTimeStr.slice(6, 8), 10);
      if (dd > 31) fail(content, "DT", "day component exceeds 31");
      if (dd === 0) fail(content, "DT", "day component cannot be 0");
    }
    if (len >= 6) {
      const mo = parseInt(dateTimeStr.slice(4, 6), 10);
      if (mo > 12) fail(content, "DT", "month component exceeds 12");
      if (mo === 0) fail(content, "DT", "month component cannot be 0");
    }
    if (len > 0 && len < 4) {
      fail(content, "DT", "year component is too short — must be YYYY");
    }
  }
}

const _DT_RE = /^\d{4}$|^\d{6}$|^\d{8}$|^\d{10}$|^\d{12}$|^\d{14}$|^\d{14}\.\d{1,6}$/;
function _validateDTString(s: string): boolean {
  return _DT_RE.test(s) || s.length === 0;
}

/**
 * IS — Integer String
 * - Max 12 characters
 * - Digits with optional leading `+` or `-`
 * - Value must fit in a signed 32-bit integer
 */
export function validateIS(content: string): void {
  if (!performValidation) return;
  if (content === null) fail(null, "IS", "value is null");
  if (content.length === 0) return;

  const trimmed = content.trim();
  if (trimmed.length === 0) return;

  if (!/^[+-]?\d+$/.test(trimmed)) {
    fail(content, "IS", "value is not an integer string");
  }
  const n = parseInt(trimmed, 10);
  if (n < -2147483648 || n > 2147483647 || !Number.isSafeInteger(n)) {
    fail(content, "IS", "value does not fit in a signed 32-bit integer");
  }
}

/**
 * LO — Long String
 * - Max 64 characters
 * - No backslash, no control characters except ESC
 */
export function validateLO(content: string): void {
  if (!performValidation) return;
  if (content === null) fail(null, "LO", "value is null");
  if (content.length === 0) return;
  if (content.length > 64) fail(content, "LO", "value exceeds maximum length of 64 characters");
  if (content.includes("\\") || hasControlExceptESC(content)) {
    fail(content, "LO", "value contains invalid character (backslash or control character)");
  }
}

/**
 * LT — Long Text
 * - Max 10240 characters
 */
export function validateLT(content: string): void {
  if (!performValidation) return;
  if (content === null) fail(null, "LT", "value is null");
  if (content.length > 10240) fail(content, "LT", "value exceeds maximum length of 10240 characters");
}

/**
 * PN — Person Name
 * - Max 3 component groups (separated by `=`)
 * - Each group max 64 characters, max 5 components (separated by `^`)
 * - No control characters except ESC
 */
export function validatePN(content: string): void {
  if (!performValidation) return;
  if (content === null) fail(null, "PN", "value is null");
  if (content.length === 0) return;

  const groups = content.split("=");
  if (groups.length > 3) fail(content, "PN", "value contains too many component groups (max 3)");

  for (const group of groups) {
    if (group.length > 64) fail(content, "PN", "component group exceeds maximum length of 64 characters");
    if (hasControlExceptESC(group)) fail(content, "PN", "value contains invalid control character");
    if (group.split("^").length > 5) fail(content, "PN", "component group contains too many components (max 5)");
  }
}

/**
 * SH — Short String
 * - Max 16 characters
 * - No backslash, no control characters except ESC
 */
export function validateSH(content: string): void {
  if (!performValidation) return;
  if (content === null) fail(null, "SH", "value is null");
  if (content.length > 16) fail(content, "SH", "value exceeds maximum length of 16 characters");
  if (content.includes("\\") || hasControlExceptESC(content)) {
    fail(content, "SH", "value contains invalid character (backslash or control character)");
  }
}

/**
 * ST — Short Text
 * - Max 1024 characters
 */
export function validateST(content: string): void {
  if (!performValidation) return;
  if (content === null) fail(null, "ST", "value is null");
  if (content.length > 1024) fail(content, "ST", "value exceeds maximum length of 1024 characters");
}

/**
 * TM — Time
 * - Format: `HH`, `HHMM`, `HHMMSS`, or `HHMMSS.F{1-6}`
 * - Range query form: `HH-HH` etc.
 * - HH: 00–23, MM: 00–59, SS: 00–60 (60 for leap second)
 */
export function validateTM(content: string): void {
  if (!performValidation) return;
  if (content === null) fail(null, "TM", "value is null");

  const queryComponents = content.split("-");
  if (queryComponents.length > 2) {
    fail(content, "TM", "value contains too many range separators '-'");
  }

  for (const comp of queryComponents) {
    const trimmed = comp.trimEnd();
    if (!trimmed) continue;

    if (!/^\d{2}$|^\d{4}$|^\d{6}$|^\d{6}\.\d{1,6}$/.test(trimmed)) {
      fail(content, "TM", "value does not match pattern HH or HHMM or HHMMSS or HHMMSS.F{1-6}");
    }

    const hh = parseInt(trimmed.slice(0, 2), 10);
    if (hh > 23) fail(content, "TM", "hour component exceeds 23");

    if (trimmed.length >= 4) {
      const mm = parseInt(trimmed.slice(2, 4), 10);
      if (mm > 59) fail(content, "TM", "minutes component exceeds 59");
    }
    if (trimmed.length >= 6) {
      const ss = parseInt(trimmed.slice(4, 6), 10);
      if (ss > 60) fail(content, "TM", "seconds component exceeds 60");
    }
  }
}

/**
 * UI — Unique Identifier
 * - Max 64 characters
 * - Only digits and dots
 * - No leading zeros in components
 * - No empty components
 */
export function validateUI(content: string): void {
  if (!performValidation) return;
  if (content === null) fail(null, "UI", "value is null");

  // Trailing null/space padding allowed
  const trimmed = content.trimEnd().replace(/\0+$/, "");
  if (trimmed.length === 0) return;

  if (trimmed.length > 64) fail(content, "UI", "value exceeds maximum length of 64 characters");
  if (!/^[0-9.]*$/.test(trimmed)) {
    fail(content, "UI", "value contains invalid characters — only digits and '.' are allowed");
  }
  // No leading zeros in any component (component starts with '0' followed by digit)
  if (/(?:^0\d)|(?:[.]0\d)/.test(trimmed)) {
    fail(content, "UI", "UID components must not have leading zeros");
  }
  // No empty components (starts with dot, double dot, or ends with dot)
  if (trimmed.startsWith(".") || trimmed.includes("..") || trimmed.endsWith(".")) {
    fail(content, "UI", "UID must not contain empty components");
  }
}

/**
 * Validate a timezone offset string (used in specific dataset attributes).
 * Format: `+HHMM` or `-HHMM`.
 */
export function validateTimezoneOffset(content: string): void {
  if (!performValidation) return;
  if (!/^[+-]\d{4}$/.test(content)) {
    throw new DicomValidationException(content, "SH", "invalid format for TimezoneOffsetFromUTC — expected ±HHMM");
  }
}

export function isValidTimezoneOffset(content: string): boolean {
  return /^[+-]\d{4}$/.test(content);
}
