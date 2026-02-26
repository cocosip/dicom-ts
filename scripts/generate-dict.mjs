#!/usr/bin/env node
/**
 * Code generation script: reads DICOM Dictionary XML files and produces
 * TypeScript constant files.
 *
 * Outputs:
 *   src/core/DicomTag.generated.ts    — standard DicomTag constants
 *   src/core/DicomUID.generated.ts    — standard DicomUID constants
 *   src/core/DicomDictionary.data.ts  — dictionary entry data for DicomDictionary
 *
 * Usage:
 *   node scripts/generate-dict.mjs
 *
 * Requires Node.js >= 18 (built-in zlib, fs, path).
 */

import { createReadStream } from "node:fs";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createGunzip } from "node:zlib";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC_CORE = join(ROOT, "src", "core");
const DICT_DIR = join(ROOT, "source-code", "fo-dicom", "FO-DICOM.Core", "Dictionaries");

// ---------------------------------------------------------------------------
// Minimal XML parser — handles the simple attribute-based structure of the
// DICOM dictionary XML files. No external dependencies.
// ---------------------------------------------------------------------------

/**
 * Parse self-closing or content-bearing XML tags matching `tagName`.
 * Returns an array of objects with `attrs` (Map) and `content` (string).
 */
function* parseXmlElements(xml, tagName) {
  // Match both <tag ... /> and <tag ...>content</tag>
  const re = new RegExp(
    `<${tagName}((?:\\s+[^>]*?)?)(?:\\/>|>([\\s\\S]*?)<\\/${tagName}>)`,
    "g"
  );
  for (const m of xml.matchAll(re)) {
    const attrStr = m[1] ?? "";
    const content = (m[2] ?? "").trim();
    const attrs = new Map();
    // Parse key="value" pairs
    for (const a of attrStr.matchAll(/(\w+)="([^"]*)"/g)) {
      attrs.set(a[1], a[2]);
    }
    yield { attrs, content };
  }
}

/** Decode XML character references (&amp; &lt; etc.) */
function decodeXml(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"');
}

/** Convert a camelCase/PascalCase keyword to a valid TS identifier.
 *  DICOM keywords are already PascalCase and valid identifiers. */
function tsIdentifier(keyword) {
  if (!keyword) return null;
  // Sanitise: replace any chars that aren't valid JS identifier chars
  return keyword.replace(/[^A-Za-z0-9_$]/g, "_");
}

/** Read a possibly .gz-compressed file and return its string contents. */
async function readXmlFile(filePath) {
  if (filePath.endsWith(".gz")) {
    const buf = await readFile(filePath);
    const { gunzipSync } = await import("node:zlib");
    return gunzipSync(buf).toString("utf-8");
  }
  return readFile(filePath, "utf-8");
}

// ---------------------------------------------------------------------------
// Generate DicomTag.generated.ts
// ---------------------------------------------------------------------------

async function generateTags(xml) {
  const lines = [
    "// AUTO-GENERATED — do not edit manually.",
    "// Run `npm run generate:dict` to regenerate.",
    "//",
    "// Source: FO-DICOM.Core/Dictionaries/DICOM Dictionary.xml",
    "",
    '/**',
    ' * Standard DICOM tag constants as named exports.',
    ' *',
    ' * Usage:',
    ' *   import { PatientName, StudyDate } from "./DicomTag.generated.js";',
    ' */',
    'import { DicomTag } from "./DicomTag.js";',
    "",
  ];

  for (const el of parseXmlElements(xml, "tag")) {
    const group = el.attrs.get("group");
    const element = el.attrs.get("element");
    const keyword = el.attrs.get("keyword");
    const vr = el.attrs.get("vr") ?? "UN";
    const vm = el.attrs.get("vm") ?? "1";
    const name = decodeXml(el.content);
    const retired = el.attrs.get("retired") === "true";

    if (!group || !element || !keyword) continue;

    // Skip masked tags — their group or element contain 'x' wildcard characters
    // (e.g. "60xx", "XXXX"). These are range entries only used by DicomDictionary.
    if (/x/i.test(group) || /x/i.test(element)) continue;

    const id = tsIdentifier(keyword);
    if (!id) continue;

    const comment = `(${group.toUpperCase()},${element.toUpperCase()}) VR=${vr} VM=${vm} ${name}${retired ? " (Retired)" : ""}`;
    lines.push(`/** ${comment} */`);
    lines.push(`export const ${id} = new DicomTag(0x${group}, 0x${element});`);
  }
  lines.push("");

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Generate DicomUID.generated.ts
// ---------------------------------------------------------------------------

async function generateUIDs(xml) {
  const lines = [
    "// AUTO-GENERATED — do not edit manually.",
    "// Run `npm run generate:dict` to regenerate.",
    "//",
    '// Source: FO-DICOM.Core/Dictionaries/DICOM Dictionary.xml',
    "",
    'import { DicomUID, DicomUidType } from "./DicomUID.js";',
    "",
  ];

  const uids = [];
  for (const el of parseXmlElements(xml, "uid")) {
    const uidStr = el.attrs.get("uid");
    const keyword = el.attrs.get("keyword");
    const typeStr = el.attrs.get("type") ?? "Unknown";
    const retired = el.attrs.get("retired") === "true";
    const name = decodeXml(el.content);

    if (!uidStr || !keyword) continue;
    const id = tsIdentifier(keyword);
    if (!id) continue;

    // Map XML type string to DicomUidType enum key
    const typeKey = mapUidType(typeStr);

    uids.push({ uid: uidStr, keyword: id, type: typeKey, retired, name });
  }

  // Emit constant declarations
  lines.push("// Standard DICOM UIDs");
  for (const u of uids) {
    const comment = `${u.uid} ${u.name}${u.retired ? " (Retired)" : ""}`;
    lines.push(`/** ${comment} */`);
    lines.push(
      `export const ${u.keyword} = new DicomUID(${JSON.stringify(u.uid)}, ${JSON.stringify(u.name)}, DicomUidType.${u.type}, ${u.retired});`
    );
    lines.push(`DicomUID.register(${u.keyword});`);
  }
  lines.push("");

  return lines.join("\n");
}

function mapUidType(typeStr) {
  switch (typeStr) {
    case "Transfer Syntax":          return "TransferSyntax";
    case "SOP Class":                return "SOPClass";
    case "Meta SOP Class":           return "MetaSOPClass";
    case "Service Class":            return "ServiceClass";
    case "SOP Instance":             return "SOPInstance";
    case "Application Context Name": return "ApplicationContextName";
    case "Application Hosting Model":return "ApplicationHostingModel";
    case "Coding Scheme":            return "CodingScheme";
    case "Frame of Reference":       return "FrameOfReference";
    case "LDAP":                     return "LDAP";
    case "Mapping Resource":         return "MappingResource";
    case "Context Group Name":       return "ContextGroupName";
    default:                         return "Unknown";
  }
}

// ---------------------------------------------------------------------------
// Generate DicomDictionary.data.ts — compact data table for DicomDictionary
// ---------------------------------------------------------------------------

async function generateDictionaryData(xml) {
  const lines = [
    "// AUTO-GENERATED — do not edit manually.",
    "// Run `npm run generate:dict` to regenerate.",
    "//",
    '// Source: FO-DICOM.Core/Dictionaries/DICOM Dictionary.xml',
    "",
    "/** Raw DICOM dictionary entry: [group, element, keyword, vr, vm, name, retired?, masked?] */",
    "export type RawDictEntry = [",
    "  group: number,",
    "  element: number,",
    "  keyword: string,",
    "  vr: string,",
    "  vm: string,",
    "  name: string,",
    "  retired: boolean,",
    "  masked: boolean,",
    "];",
    "",
    "export const DICOM_DICT_ENTRIES: RawDictEntry[] = [",
  ];

  for (const el of parseXmlElements(xml, "tag")) {
    const groupStr = el.attrs.get("group");
    const elementStr = el.attrs.get("element");
    const keyword = el.attrs.get("keyword") ?? "";
    const vr = el.attrs.get("vr") ?? "UN";
    const vm = el.attrs.get("vm") ?? "1";
    const retired = el.attrs.get("retired") === "true";
    const name = decodeXml(el.content).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

    if (!groupStr || !elementStr) continue;

    // Detect masked tags: group or element contains 'x' (e.g. 60xx, xxxxs)
    const masked = /x/i.test(groupStr) || /x/i.test(elementStr);

    // Parse hex, replacing 'x' with '0' for the numeric value
    const group = parseInt(groupStr.replace(/x/gi, "0"), 16);
    const element = parseInt(elementStr.replace(/x/gi, "0"), 16);

    lines.push(
      `  [0x${group.toString(16).padStart(4,"0").toUpperCase()}, 0x${element.toString(16).padStart(4,"0").toUpperCase()}, ${JSON.stringify(keyword)}, ${JSON.stringify(vr)}, ${JSON.stringify(vm)}, "${name}", ${retired}, ${masked}],`
    );
  }

  lines.push("];");
  lines.push("");

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  await mkdir(SRC_CORE, { recursive: true });

  // Prefer uncompressed XML (faster), fall back to .gz
  const dictXmlPath = join(DICT_DIR, "DICOM Dictionary.xml");

  console.log(`Reading dictionary: ${dictXmlPath}`);
  const dictXml = await readXmlFile(dictXmlPath);

  console.log("Generating DicomTag.generated.ts ...");
  const tagContent = await generateTags(dictXml);
  const tagPath = join(SRC_CORE, "DicomTag.generated.ts");
  await writeFile(tagPath, tagContent, "utf-8");
  console.log(`  → ${tagPath}`);

  console.log("Generating DicomUID.generated.ts ...");
  const uidContent = await generateUIDs(dictXml);
  const uidPath = join(SRC_CORE, "DicomUID.generated.ts");
  await writeFile(uidPath, uidContent, "utf-8");
  console.log(`  → ${uidPath}`);

  console.log("Generating DicomDictionary.data.ts ...");
  const dataContent = await generateDictionaryData(dictXml);
  const dataPath = join(SRC_CORE, "DicomDictionary.data.ts");
  await writeFile(dataPath, dataContent, "utf-8");
  console.log(`  → ${dataPath}`);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
