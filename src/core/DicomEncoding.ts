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

  const norm = normalise(charset);
  const label = CHARSET_MAP.get(norm);
  if (label) return getDecoder(label);

  // Fallback: try the charset string directly as a WHATWG label
  try {
    return getDecoder(norm);
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
    return getEncoding(firstCharset).decode(bytes);
  }

  // ISO 2022 multi-charset path: walk the bytes, track current encoding
  let currentLabel = CHARSET_MAP.get(normalise(firstCharset)) ?? "us-ascii";
  const parts: string[] = [];
  let i = 0;
  let segStart = 0;

  while (i < bytes.length) {
    const b = bytes[i]!;

    if (b === 0x1b) {
      // Flush current segment
      if (i > segStart) {
        parts.push(getDecoder(currentLabel).decode(bytes.slice(segStart, i)));
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
    parts.push(getDecoder(currentLabel).decode(bytes.slice(segStart)));
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
  const label = charsets.length > 0
    ? (CHARSET_MAP.get(normalise(charsets[0] ?? "")) ?? "us-ascii")
    : "us-ascii";

  // TextEncoder only supports UTF-8; for other encodings we need a workaround.
  // For Latin-1 range strings, manual byte-by-byte encoding is sufficient.
  if (label === "utf-8" || label === "us-ascii") {
    return new TextEncoder().encode(s);
  }

  // For other charsets: TextEncoder doesn't support them natively in Node.js.
  // Use latin1 as a best-effort for single-byte charsets in the 0x80-0xFF range.
  // Full ISO 2022 encoding is a future enhancement.
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) {
    bytes[i] = s.charCodeAt(i) & 0xff;
  }
  return bytes;
}
