/**
 * DICOM Dictionary — singleton registry of standard and private tag definitions.
 *
 * Reference: fo-dicom/FO-DICOM.Core/DicomDictionary.cs
 *
 * The standard entries are loaded from `DicomDictionary.data.ts` which is
 * generated at build time from the DICOM Dictionary XML.
 */
import { DicomTag, DicomMaskedTag, DicomPrivateCreator } from "./DicomTag.js";
import { DicomVR } from "./DicomVR.js";
import { DicomVM } from "./DicomVM.js";
import { DicomDictionaryEntry } from "./DicomDictionaryEntry.js";
import { DICOM_DICT_ENTRIES, type RawDictEntry } from "./DicomDictionary.data.js";

// ---------------------------------------------------------------------------
// Sentinel entries
// ---------------------------------------------------------------------------

/** Returned for completely unknown tags. */
export const UnknownTag = new DicomDictionaryEntry(
  DicomMaskedTag.parse("(xxxx,xxxx)"),
  "Unknown",
  "Unknown",
  DicomVM.VM_1_n,
  false,
  DicomVR.UN,
  DicomVR.AE, DicomVR.AS, DicomVR.AT, DicomVR.CS, DicomVR.DA, DicomVR.DS,
  DicomVR.DT, DicomVR.FD, DicomVR.FL, DicomVR.IS, DicomVR.LO, DicomVR.LT,
  DicomVR.OB, DicomVR.OD, DicomVR.OF, DicomVR.OL, DicomVR.OV, DicomVR.OW,
  DicomVR.PN, DicomVR.SH, DicomVR.SL, DicomVR.SQ, DicomVR.SS, DicomVR.ST,
  DicomVR.SV, DicomVR.TM, DicomVR.UC, DicomVR.UI, DicomVR.UL, DicomVR.UR,
  DicomVR.US, DicomVR.UT, DicomVR.UV,
);

/** Returned for private creator elements (gggg,00xx). */
export const PrivateCreatorTag = new DicomDictionaryEntry(
  DicomMaskedTag.parse("(xxxx,00xx)"),
  "Private Creator",
  "PrivateCreator",
  DicomVM.VM_1,
  false,
  DicomVR.LO,
);

// ---------------------------------------------------------------------------
// DicomDictionary
// ---------------------------------------------------------------------------

/**
 * Singleton DICOM tag dictionary.
 *
 * - Standard entries are populated from the built-in data table.
 * - Private dictionaries can be registered with `addPrivateDictionary()`.
 * - Private creators are tracked per group.
 */
export class DicomDictionary {
  private readonly _entries = new Map<number, DicomDictionaryEntry>();
  private readonly _keywords = new Map<string, DicomTag>();
  private readonly _masked: DicomDictionaryEntry[] = [];
  private readonly _creators = new Map<string, DicomPrivateCreator>();
  private readonly _private = new Map<string, DicomDictionary>();

  private constructor() {}

  // ---------------------------------------------------------------------------
  // Default singleton
  // ---------------------------------------------------------------------------

  private static _default: DicomDictionary | null = null;

  /** The default global DICOM dictionary, lazily initialised on first access. */
  static get default(): DicomDictionary {
    if (DicomDictionary._default === null) {
      DicomDictionary._default = DicomDictionary._buildDefault();
    }
    return DicomDictionary._default;
  }

  private static _buildDefault(): DicomDictionary {
    const dict = new DicomDictionary();
    for (const raw of DICOM_DICT_ENTRIES) {
      dict._addRaw(raw);
    }
    return dict;
  }

  // ---------------------------------------------------------------------------
  // Build from raw data
  // ---------------------------------------------------------------------------

  private _addRaw(raw: RawDictEntry): void {
    const [group, element, keyword, vrStr, vmStr, name, retired, masked] = raw;

    // Parse VR (may be "OB or OW" → take first)
    const primaryVrCode = vrStr.split(" or ")[0]?.trim() ?? "UN";
    const vrs = vrStr
      .split(" or ")
      .map((code) => DicomVR.tryParse(code.trim()) ?? DicomVR.UN);

    const vm = DicomVM.parse(vmStr);

    if (masked) {
      // Build masked tag from group/element with placeholder values
      const groupHex = group.toString(16).padStart(4, "0").toUpperCase();
      const elementHex = element.toString(16).padStart(4, "0").toUpperCase();
      try {
        // Reconstruct mask from original XML: for simplicity treat all bits as exact
        const tag = new DicomTag(group, element);
        const entry = new DicomDictionaryEntry(tag, name, keyword, vm, retired, ...vrs);
        this._masked.push(entry);
        // Also index by keyword for keyword → tag lookup
        if (keyword) this._keywords.set(keyword, tag);
      } catch {
        // skip malformed entries
      }
    } else {
      const tag = new DicomTag(group, element);
      const entry = new DicomDictionaryEntry(tag, name, keyword, vm, retired, ...vrs);
      this._entries.set(tag.toUint32(), entry);
      if (keyword) this._keywords.set(keyword, tag);
    }
  }

  // ---------------------------------------------------------------------------
  // Add entries
  // ---------------------------------------------------------------------------

  /** Add a single dictionary entry. */
  add(entry: DicomDictionaryEntry): void {
    if (entry.isMasked) {
      this._masked.push(entry);
    } else {
      this._entries.set(entry.tag.toUint32(), entry);
    }
    if (entry.keyword) this._keywords.set(entry.keyword, entry.tag);
  }

  // ---------------------------------------------------------------------------
  // Lookup
  // ---------------------------------------------------------------------------

  /**
   * Look up the dictionary entry for a given tag.
   * Returns `UnknownTag` when no entry is found.
   */
  lookup(tag: DicomTag): DicomDictionaryEntry {
    // Exact match first
    const exact = this._entries.get(tag.toUint32());
    if (exact !== undefined) return exact;

    // If private, check registered private dictionary
    if (tag.isPrivate && tag.privateCreator) {
      const privateDict = this._private.get(tag.privateCreator.creator);
      if (privateDict) {
        const pe = privateDict.lookup(tag);
        if (pe !== UnknownTag) return pe;
      }
    }

    // Masked / range match
    for (let i = this._masked.length - 1; i >= 0; i--) {
      const entry = this._masked[i]!;
      if (entry.maskTag?.isMatch(tag)) return entry;
    }

    // Private creator element: (gggg, 00xx) where group is odd
    if (tag.isPrivate && tag.element >= 0x0010 && tag.element <= 0x00ff) {
      return PrivateCreatorTag;
    }

    return UnknownTag;
  }

  /** Look up the tag for a given keyword. Returns `null` if not found. */
  lookupKeyword(keyword: string): DicomTag | null {
    return this._keywords.get(keyword) ?? null;
  }

  // ---------------------------------------------------------------------------
  // Private creator management
  // ---------------------------------------------------------------------------

  /**
   * Return (or create) a private creator descriptor for the given string.
   * Used by DicomTag constructor and DicomDataset for private block management.
   */
  getPrivateCreator(creator: string): DicomPrivateCreator {
    let pc = this._creators.get(creator);
    if (pc === undefined) {
      pc = new DicomPrivateCreator(creator);
      this._creators.set(creator, pc);
    }
    return pc;
  }

  /**
   * Register an additional private dictionary under a creator string.
   * Private tags in datasets that carry this creator will be looked up here.
   */
  addPrivateDictionary(creator: string, dict: DicomDictionary): void {
    this._private.set(creator, dict);
  }

  // ---------------------------------------------------------------------------
  // Iteration
  // ---------------------------------------------------------------------------

  /** Iterate over all non-masked standard entries. */
  [Symbol.iterator](): IterableIterator<DicomDictionaryEntry> {
    return this._entries.values();
  }
}
