/**
 * DICOM character set / encoding support.
 *
 * Maps DICOM SpecificCharacterSet (0008,0005) attribute values to
 * Node.js `TextDecoder` / `TextEncoder` instances.
 *
 * Reference: fo-dicom/FO-DICOM.Core/DicomEncoding.cs
 *
 * Implementation notes:
 * - Uses Node.js built-in `TextDecoder` (WHATWG Encoding API, available in

 *   Node ≥ 11 without the `full-icu` flag for most charsets).
 * - ISO 2022 escape-sequence switching (multi-code-set strings) is handled
 *   by `decodeWithEscapes()` which walks the byte stream and switches decoder
 *   on each ESC sequence.
 * - `x-cp20949` (.NET code page for EUC-KR) maps to `euc-kr` in WHATWG.
 * - `windows-874` maps to `windows-874` (same label in WHATWG).
 */

// Import TextDecoder / TextEncoder from node:util so TypeScript recognises
// them as proper types in projects with lib: ["ES2020"] (no DOM).
import { TextDecoder, TextEncoder } from "node:util";
import * as iconv from "iconv-lite";

// Re-export so callers can type against these without depending on DOM lib.
export type { TextDecoder, TextEncoder };

// ---------------------------------------------------------------------------
// Charset name → WHATWG TextDecoder label mapping
// ---------------------------------------------------------------------------

/**
 * Map of DICOM SpecificCharacterSet values to WHATWG encoding labels.
 *
 * Keys match the exact strings that appear in the (0008,0005) attribute,
 * plus common misspellings with `-` or ` ` instead of `_`.
 */
const CHARSET_MAP: ReadonlyMap<string, string> = new Map([
  // Single-byte defined-length encodings (no escape sequences)
  ["ISO_IR 6",   "us-ascii"],   // Default repertoire
  ["ISO_IR 13",  "shift-jis"],  // JIS X 0201
  ["ISO_IR 100", "iso-8859-1"], // Latin 1
  ["ISO_IR 101", "iso-8859-2"], // Latin 2
  ["ISO_IR 109", "iso-8859-3"], // Latin 3
  ["ISO_IR 110", "iso-8859-4"], // Latin 4
  ["ISO_IR 126", "iso-8859-7"], // Greek
  ["ISO_IR 127", "iso-8859-6"], // Arabic
  ["ISO_IR 138", "iso-8859-8"], // Hebrew
  ["ISO_IR 144", "iso-8859-5"], // Cyrillic
  ["ISO_IR 148", "iso-8859-9"], // Latin 5 (Turkish)
  ["ISO_IR 149", "euc-kr"],     // KS X 1001 (Korean)
  ["ISO_IR 166", "windows-874"],// Thai
  ["ISO_IR 192", "utf-8"],      // Unicode UTF-8
  ["GB18030",    "gb18030"],    // Chinese (GB18030 supersedes GBK)
  ["GBK",        "gbk"],        // Chinese GBK

  // ISO 2022 extended (escape-sequence-switched) charsets
  ["ISO 2022 IR 6",   "us-ascii"],
  ["ISO 2022 IR 13",  "shift-jis"],
  ["ISO 2022 IR 87",  "iso-2022-jp"],
  ["ISO 2022 IR 100", "iso-8859-1"],
  ["ISO 2022 IR 101", "iso-8859-2"],
  ["ISO 2022 IR 109", "iso-8859-3"],
  ["ISO 2022 IR 110", "iso-8859-4"],
  ["ISO 2022 IR 126", "iso-8859-7"],
  ["ISO 2022 IR 127", "iso-8859-6"],
  ["ISO 2022 IR 138", "iso-8859-8"],
  ["ISO 2022 IR 144", "iso-8859-5"],
  ["ISO 2022 IR 148", "iso-8859-9"],
  ["ISO 2022 IR 149", "euc-kr"],
  ["ISO 2022 IR 159", "iso-2022-jp"],
  ["ISO 2022 IR 166", "windows-874"],
  ["ISO 2022 IR 58",  "gbk"],        // GB2312 (superseded by GBK)
  ["ISO 2022 GBK",    "gbk"],
]);

// Normalise an incoming charset string: trim, and treat "ISO IR" / "ISO-IR"
// as synonyms for "ISO_IR".
function normalise(charset: string): string {
  return charset.trim().replace(/ISO[\s-]IR/i, "ISO_IR");
}

function resolveLabel(charset: string): string {
  const norm = normalise(charset);
  return _customMap.get(norm) ?? CHARSET_MAP.get(norm) ?? norm;
}

function iconvLabel(label: string): string {
  if (label === "us-ascii") return "ascii";
  if (label === "iso-8859-1") return "latin1";
  return label;
}

// ---------------------------------------------------------------------------
// Decoder cache
// ---------------------------------------------------------------------------

const _decoderCache = new Map<string, TextDecoder>();

function getDecoder(label: string): TextDecoder {
  let dec = _decoderCache.get(label);
  if (!dec) {
    try {
      dec = new TextDecoder(label);
    } catch {
      // Unknown encoding label — fall back to ASCII
      dec = new TextDecoder("ascii");
    }
    _decoderCache.set(label, dec);
  }
  return dec;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Default DICOM encoding (ASCII / ISO_IR 6). */
export const Default: TextDecoder = new TextDecoder("ascii");

/**
 * Get a `TextDecoder` for the given DICOM charset name.
 *
 * Falls back to ASCII for unknown or empty charsets, matching fo-dicom
 * behaviour (`DicomEncoding.Default = Encoding.ASCII`).
 */
export function getEncoding(charset: string): TextDecoder {
  if (!charset || charset.trim().length === 0) return Default;

  const label = resolveLabel(charset);
  if (label) return getDecoder(label);

  // Fallback: try the charset string directly as a WHATWG label
  try {
    return getDecoder(label);
  } catch {
    return Default;
  }
}

/**
 * Get an array of `TextDecoder` instances for the given DICOM charset list.
 *
 * The SpecificCharacterSet attribute may have multiple values separated by
 * backslash, where:
 * - Value 1 is the default charset for code extension techniques
 * - Value 2+ are alternative code elements introduced by ESC sequences
 *
 * An empty first value means the default ASCII repertoire (ISO 2022 IR 6).
 */
export function getEncodings(charsets: readonly string[]): TextDecoder[] {
  if (charsets.length === 0) return [Default];
  return charsets.map(getEncoding);
}

/**
 * Register a custom charset mapping.
 * Useful for private or non-standard charsets.
 *
 * @param charset   DICOM charset name (as it appears in SpecificCharacterSet)
 * @param whatwgLabel  WHATWG encoding label (https://encoding.spec.whatwg.org/)
 */
export function registerEncoding(charset: string, whatwgLabel: string): void {
  // We can't mutate the const ReadonlyMap — use the mutable registry instead
  _customMap.set(normalise(charset), whatwgLabel);
}

const _customMap = new Map<string, string>();

// Override `getEncoding` to check custom map first (patch above)
const _originalGetEncoding = getEncoding;
// Re-export after patching is not possible in a clean way without a wrapper —
// users should call `getEncoding` which already handles custom map via closure.

// ---------------------------------------------------------------------------
// ISO 2022 escape sequence processing
// ---------------------------------------------------------------------------

/**
 * Map ISO 2022 escape sequences (ESC + bytes) to WHATWG labels.
 *
 * ESC sequences follow the pattern ESC byte1 [byte2 [byte3]].
 * This covers the sequences defined in DICOM PS3.5 Annex C.
 */
const ESC_SEQUENCES: ReadonlyMap<string, string> = new Map([
  // G0 designations (single-byte)
  ["\x1b\x28\x42", "us-ascii"],   // ESC ( B — ASCII
  ["\x1b\x28\x4a", "shift-jis"],  // ESC ( J — JIS X 0201 (romanji)
  ["\x1b\x28\x49", "shift-jis"],  // ESC ( I — JIS X 0201 (katakana)

  // G1 designations (single-byte)
  ["\x1b\x2d\x41", "iso-8859-1"],
  ["\x1b\x2d\x42", "iso-8859-2"],
  ["\x1b\x2d\x43", "iso-8859-3"],
  ["\x1b\x2d\x44", "iso-8859-4"],
  ["\x1b\x2d\x46", "iso-8859-7"],
  ["\x1b\x2d\x47", "iso-8859-6"],
  ["\x1b\x2d\x48", "iso-8859-8"],
  ["\x1b\x2d\x4c", "iso-8859-5"],
  ["\x1b\x2d\x4d", "iso-8859-9"],
  ["\x1b\x2d\x54", "windows-874"],

  // G0 multi-byte (double-byte sets) — 3-byte ESC sequences
  ["\x1b\x24\x42", "iso-2022-jp"],    // ESC $ B — JIS X 0208
  ["\x1b\x24\x28\x44", "iso-2022-jp"],// ESC $ ( D — JIS X 0212
  ["\x1b\x24\x29\x43", "euc-kr"],     // ESC $ ) C — KS X 1001
  ["\x1b\x24\x29\x41", "gbk"],        // ESC $ ) A — GB2312
]);

/**
 * Decode a byte buffer that may contain ISO 2022 escape sequences.
 *
 * When SpecificCharacterSet contains multiple values, the byte stream may
 * switch between encodings using ESC sequences. This function handles the
 * full ISO 2022 state machine for DICOM string elements.
 *
 * @param bytes     Raw bytes of the DICOM string element value
 * @param charsets  Parsed SpecificCharacterSet values (split on `\`)
 * @returns         Decoded string
 */
export function decodeBytes(bytes: Uint8Array, charsets: readonly string[]): string {
  // If no charsets or single UTF-8 / single-byte encoding, take the fast path
  if (charsets.length === 0) return Default.decode(bytes);

  const firstCharset = charsets[0] ?? "";
  if (charsets.length === 1 && !firstCharset.startsWith("ISO 2022")) {
    const label = resolveLabel(firstCharset);
    return decodeWithLabel(label, bytes);
  }

  // ISO 2022 multi-charset path: walk the bytes, track current encoding
  let currentLabel = resolveLabel(firstCharset);
  const parts: string[] = [];
  let i = 0;
  let segStart = 0;

  while (i < bytes.length) {
    const b = bytes[i]!;

    if (b === 0x1b) {
      // Flush current segment
      if (i > segStart) {
        parts.push(decodeWithLabel(currentLabel, bytes.slice(segStart, i)));
      }

      // Try to match ESC sequence (2, 3, or 4 bytes after ESC)
      let matched = false;
      for (const [seq, label] of ESC_SEQUENCES) {
        const seqBytes = Array.from(seq).map((c) => c.charCodeAt(0));
        const end = i + seqBytes.length;
        if (end <= bytes.length) {
          let ok = true;
          for (let k = 0; k < seqBytes.length; k++) {
            if (bytes[i + k] !== seqBytes[k]) { ok = false; break; }
          }
          if (ok) {
            currentLabel = label;
            i = end;
            segStart = i;
            matched = true;
            break;
          }
        }
      }

      if (!matched) {
        // Unknown escape sequence — skip ESC byte and continue
        i++;
        segStart = i;
      }
    } else {
      i++;
    }
  }

  // Flush remaining segment
  if (segStart < bytes.length) {
    parts.push(decodeWithLabel(currentLabel, bytes.slice(segStart)));
  }

  return parts.join("");
}

/**
 * Encode a string to bytes using the first charset in the list.
 *
 * For multi-charset strings, ISO 2022 encoding (inserting ESC sequences) is
 * not yet implemented — returns UTF-8 as a safe fallback for non-ASCII text.
 */
export function encodeString(s: string, charsets: readonly string[]): Uint8Array {
  const labels = charsets.length > 0
    ? charsets.map((c) => resolveLabel(c ?? ""))
    : ["us-ascii"];

  if (labels.length === 1) {
    return encodeWithLabel(labels[0]!, s);
  }

  return encodeWithEscapes(s, labels);
}

function decodeWithLabel(label: string, bytes: Uint8Array): string {
  if (label === "utf-8" || label === "us-ascii") {
    return new TextDecoder(label).decode(bytes);
  }
  const encLabel = iconvLabel(label);
  if (iconv.encodingExists(encLabel)) {
    return iconv.decode(Buffer.from(bytes), encLabel);
  }
  return getDecoder(label).decode(bytes);
}

function encodeWithLabel(label: string, s: string): Uint8Array {
  if (label === "utf-8" || label === "us-ascii") {
    return new TextEncoder().encode(s);
  }

  const encLabel = iconvLabel(label);
  if (iconv.encodingExists(encLabel)) {
    return new Uint8Array(iconv.encode(s, encLabel));
  }

  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) {
    bytes[i] = s.charCodeAt(i) & 0xff;
  }
  return bytes;
}

const ESC_FOR_LABEL: ReadonlyMap<string, Uint8Array> = new Map(
  Array.from(ESC_SEQUENCES.entries()).reduce<Array<[string, Uint8Array]>>((acc, [seq, label]) => {
    if (!acc.some(([lbl]) => lbl === label)) {
      acc.push([label, Uint8Array.from(seq, (ch) => ch.charCodeAt(0))]);
    }
    return acc;
  }, [])
);

function canEncodeChar(label: string, ch: string, cache: Map<string, boolean>): boolean {
  const key = `${label}\u0000${ch}`;
  const cached = cache.get(key);
  if (cached !== undefined) return cached;
  const bytes = encodeWithLabel(label, ch);
  const decoded = decodeWithLabel(label, bytes);
  const ok = decoded === ch;
  cache.set(key, ok);
  return ok;
}

function encodeWithEscapes(s: string, labels: readonly string[]): Uint8Array {
  const parts: Uint8Array[] = [];
  const cache = new Map<string, boolean>();
  let currentLabel = labels[0] ?? "us-ascii";

  const initialEscape = ESC_FOR_LABEL.get(currentLabel);
  if (initialEscape && currentLabel !== "us-ascii") {
    parts.push(initialEscape);
  }

  let segment = "";

  const flush = () => {
    if (segment.length === 0) return;
    parts.push(encodeWithLabel(currentLabel, segment));
    segment = "";
  };

  for (const ch of s) {
    let targetLabel = currentLabel;
    if (!canEncodeChar(currentLabel, ch, cache)) {
      const found = labels.find((lbl) => canEncodeChar(lbl, ch, cache));
      if (found) targetLabel = found;
    }

    if (targetLabel !== currentLabel) {
      flush();
      const esc = ESC_FOR_LABEL.get(targetLabel);
      if (esc) parts.push(esc);
      currentLabel = targetLabel;
    }

    segment += ch;
  }

  flush();
  return concatBytes(parts);
}

function concatBytes(chunks: Uint8Array[]): Uint8Array {
  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}
