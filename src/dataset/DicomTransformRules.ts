import { DicomDictionary, UnknownTag } from "../core/DicomDictionary.js";
import { DicomMaskedTag, DicomTag } from "../core/DicomTag.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomVR } from "../core/DicomVR.js";
import { DicomDataset } from "./DicomDataset.js";
import { type IDicomMatchRule, DicomMatchRuleSet } from "./DicomMatchRules.js";

export interface IDicomTransformRule {
  transform(dataset: DicomDataset, modifiedAttributesSequenceItem?: DicomDataset): void;
}

export class DicomTransformRuleSet implements IDicomTransformRule {
  private readonly transformRules: IDicomTransformRule[];
  conditions: IDicomMatchRule | null;

  constructor();
  constructor(...rules: IDicomTransformRule[]);
  constructor(conditions: IDicomMatchRule, ...rules: IDicomTransformRule[]);
  constructor(...args: (IDicomMatchRule | IDicomTransformRule)[]) {
    if (args.length > 0 && isMatchRule(args[0]!)) {
      this.conditions = args[0] as IDicomMatchRule;
      this.transformRules = args.slice(1) as IDicomTransformRule[];
    } else {
      this.conditions = null;
      this.transformRules = args as IDicomTransformRule[];
    }
  }

  add(rule: IDicomTransformRule): void {
    this.transformRules.push(rule);
  }

  transform(dataset: DicomDataset, modifiedAttributesSequenceItem?: DicomDataset): void {
    if (this.conditions && !this.conditions.match(dataset)) {
      return;
    }

    for (const rule of this.transformRules) {
      rule.transform(dataset, modifiedAttributesSequenceItem);
    }
  }
}

export class RemoveElementDicomTransformRule implements IDicomTransformRule {
  constructor(private readonly mask: DicomMaskedTag) {}

  transform(dataset: DicomDataset, modifiedAttributesSequenceItem?: DicomDataset): void {
    const toRemove: DicomTag[] = [];
    for (const item of dataset) {
      if (this.mask.isMatch(item.tag)) {
        toRemove.push(item.tag);
      }
    }

    for (const tag of toRemove) {
      copyItemToModified(dataset, modifiedAttributesSequenceItem, tag);
      dataset.remove(tag);
    }
  }
}

export class SetValueDicomTransformRule implements IDicomTransformRule {
  constructor(private readonly tag: DicomTag, private readonly value: string) {}

  transform(dataset: DicomDataset, modifiedAttributesSequenceItem?: DicomDataset): void {
    copyItemToModified(dataset, modifiedAttributesSequenceItem, this.tag);
    upsertString(dataset, this.tag, this.value);
  }
}

export class MapValueDicomTransformRule implements IDicomTransformRule {
  constructor(private readonly tag: DicomTag, private readonly matchValue: string, private readonly value: string) {}

  transform(dataset: DicomDataset, modifiedAttributesSequenceItem?: DicomDataset): void {
    if ((dataset.tryGetString(this.tag) ?? "") !== this.matchValue) {
      return;
    }
    copyItemToModified(dataset, modifiedAttributesSequenceItem, this.tag);
    upsertString(dataset, this.tag, this.value);
  }
}

export class CopyValueDicomTransformRule implements IDicomTransformRule {
  constructor(private readonly sourceTag: DicomTag, private readonly targetTag: DicomTag) {}

  transform(dataset: DicomDataset, modifiedAttributesSequenceItem?: DicomDataset): void {
    const value = dataset.tryGetString(this.sourceTag);
    if (value === undefined) {
      return;
    }

    copyItemToModified(dataset, modifiedAttributesSequenceItem, this.targetTag);
    upsertString(dataset, this.targetTag, value);
  }
}

export class RegexDicomTransformRule implements IDicomTransformRule {
  private readonly regex: RegExp;

  constructor(
    private readonly tag: DicomTag,
    pattern: string,
    private readonly replacement: string,
  ) {
    this.regex = new RegExp(pattern);
  }

  transform(dataset: DicomDataset, modifiedAttributesSequenceItem?: DicomDataset): void {
    const value = dataset.tryGetString(this.tag);
    if (value === undefined) {
      return;
    }

    copyItemToModified(dataset, modifiedAttributesSequenceItem, this.tag);
    upsertString(dataset, this.tag, value.replace(this.regex, this.replacement));
  }
}

export class PrefixDicomTransformRule implements IDicomTransformRule {
  constructor(private readonly tag: DicomTag, private readonly prefix: string) {}

  transform(dataset: DicomDataset, modifiedAttributesSequenceItem?: DicomDataset): void {
    const value = dataset.tryGetString(this.tag);
    if (value === undefined) {
      return;
    }
    copyItemToModified(dataset, modifiedAttributesSequenceItem, this.tag);
    upsertString(dataset, this.tag, `${this.prefix}${value}`);
  }
}

export class AppendDicomTransformRule implements IDicomTransformRule {
  constructor(private readonly tag: DicomTag, private readonly append: string) {}

  transform(dataset: DicomDataset, modifiedAttributesSequenceItem?: DicomDataset): void {
    const value = dataset.tryGetString(this.tag);
    if (value === undefined) {
      return;
    }
    copyItemToModified(dataset, modifiedAttributesSequenceItem, this.tag);
    upsertString(dataset, this.tag, `${value}${this.append}`);
  }
}

export enum DicomTrimPosition {
  Start = "start",
  End = "end",
  Both = "both",
}

export class TrimStringDicomTransformRule implements IDicomTransformRule {
  constructor(
    private readonly tag: DicomTag,
    private readonly position: DicomTrimPosition,
    private readonly trim: string,
  ) {}

  transform(dataset: DicomDataset, modifiedAttributesSequenceItem?: DicomDataset): void {
    const value = dataset.tryGetString(this.tag);
    if (value === undefined || this.trim.length === 0) {
      return;
    }

    copyItemToModified(dataset, modifiedAttributesSequenceItem, this.tag);
    upsertString(dataset, this.tag, trimByString(value, this.trim, this.position));
  }
}

export class TrimCharactersDicomTransformRule implements IDicomTransformRule {
  constructor(
    private readonly tag: DicomTag,
    private readonly position: DicomTrimPosition,
    private readonly trimCharacters: readonly string[] | null = null,
  ) {}

  transform(dataset: DicomDataset, modifiedAttributesSequenceItem?: DicomDataset): void {
    const value = dataset.tryGetString(this.tag);
    if (value === undefined) {
      return;
    }

    copyItemToModified(dataset, modifiedAttributesSequenceItem, this.tag);
    const trimmed = trimByCharacters(value, this.position, this.trimCharacters);
    upsertString(dataset, this.tag, trimmed);
  }
}

export class PadStringDicomTransformRule implements IDicomTransformRule {
  constructor(
    private readonly tag: DicomTag,
    private readonly totalLength: number,
    private readonly paddingChar: string,
  ) {}

  transform(dataset: DicomDataset, modifiedAttributesSequenceItem?: DicomDataset): void {
    const value = dataset.tryGetString(this.tag);
    if (value === undefined || this.paddingChar.length === 0) {
      return;
    }

    copyItemToModified(dataset, modifiedAttributesSequenceItem, this.tag);
    if (this.totalLength < 0) {
      upsertString(dataset, this.tag, value.padStart(Math.abs(this.totalLength), this.paddingChar[0]!));
    } else {
      upsertString(dataset, this.tag, value.padEnd(this.totalLength, this.paddingChar[0]!));
    }
  }
}

export class TruncateDicomTransformRule implements IDicomTransformRule {
  constructor(private readonly tag: DicomTag, private readonly length: number) {}

  transform(dataset: DicomDataset, modifiedAttributesSequenceItem?: DicomDataset): void {
    const value = dataset.tryGetString(this.tag);
    if (value === undefined) {
      return;
    }

    copyItemToModified(dataset, modifiedAttributesSequenceItem, this.tag);
    const maxLen = Math.max(0, this.length);
    const parts = value.split("\\").map((part) => (part.length > maxLen ? part.slice(0, maxLen) : part));
    upsertString(dataset, this.tag, parts.join("\\"));
  }
}

export class SplitFormatDicomTransformRule implements IDicomTransformRule {
  constructor(
    private readonly tag: DicomTag,
    private readonly separators: readonly string[],
    private readonly format: string,
  ) {}

  transform(dataset: DicomDataset, modifiedAttributesSequenceItem?: DicomDataset): void {
    const value = dataset.tryGetString(this.tag);
    if (value === undefined) {
      return;
    }

    copyItemToModified(dataset, modifiedAttributesSequenceItem, this.tag);
    const parts = splitBySeparators(value, this.separators);
    upsertString(dataset, this.tag, formatIndexed(this.format, parts));
  }
}

export class ToUpperDicomTransformRule implements IDicomTransformRule {
  constructor(private readonly tag: DicomTag) {}

  transform(dataset: DicomDataset, modifiedAttributesSequenceItem?: DicomDataset): void {
    const value = dataset.tryGetString(this.tag);
    if (value === undefined) {
      return;
    }
    copyItemToModified(dataset, modifiedAttributesSequenceItem, this.tag);
    upsertString(dataset, this.tag, value.toUpperCase());
  }
}

export class ToLowerDicomTransformRule implements IDicomTransformRule {
  constructor(private readonly tag: DicomTag) {}

  transform(dataset: DicomDataset, modifiedAttributesSequenceItem?: DicomDataset): void {
    const value = dataset.tryGetString(this.tag);
    if (value === undefined) {
      return;
    }
    copyItemToModified(dataset, modifiedAttributesSequenceItem, this.tag);
    upsertString(dataset, this.tag, value.toLowerCase());
  }
}

export class GenerateUidDicomTransformRule implements IDicomTransformRule {
  constructor(private readonly tag: DicomTag) {}

  transform(dataset: DicomDataset, modifiedAttributesSequenceItem?: DicomDataset): void {
    const value = dataset.tryGetString(this.tag);
    if (value === undefined || value.length === 0) {
      return;
    }
    copyItemToModified(dataset, modifiedAttributesSequenceItem, this.tag);
    upsertString(dataset, this.tag, DicomUID.generate().uid);
  }
}

function isMatchRule(candidate: IDicomMatchRule | IDicomTransformRule): candidate is IDicomMatchRule {
  if (candidate instanceof DicomMatchRuleSet) {
    return true;
  }
  return typeof (candidate as IDicomMatchRule).match === "function";
}

function copyItemToModified(
  dataset: DicomDataset,
  modifiedAttributesSequenceItem: DicomDataset | undefined,
  tag: DicomTag,
): void {
  if (!modifiedAttributesSequenceItem) {
    return;
  }
  const item = dataset.getDicomItem(tag);
  if (item) {
    modifiedAttributesSequenceItem.addOrUpdate(item);
  }
}

function upsertString(dataset: DicomDataset, tag: DicomTag, value: string): void {
  const existing = dataset.getDicomItem(tag);
  if (existing) {
    dataset.addOrUpdateElement(existing.valueRepresentation, tag, value);
    return;
  }

  const dictionaryEntry = DicomDictionary.default.lookup(tag);
  const vr = dictionaryEntry === UnknownTag ? DicomVR.LO : dictionaryEntry.vr;
  dataset.addOrUpdateElement(vr, tag, value);
}

function trimByString(value: string, trim: string, position: DicomTrimPosition): string {
  let output = value;
  if (position === DicomTrimPosition.Start || position === DicomTrimPosition.Both) {
    while (output.startsWith(trim)) {
      output = output.slice(trim.length);
    }
  }
  if (position === DicomTrimPosition.End || position === DicomTrimPosition.Both) {
    while (output.endsWith(trim)) {
      output = output.slice(0, output.length - trim.length);
    }
  }
  return output;
}

function trimByCharacters(
  value: string,
  position: DicomTrimPosition,
  trimCharacters: readonly string[] | null,
): string {
  if (!trimCharacters || trimCharacters.length === 0) {
    if (position === DicomTrimPosition.Start) {
      return value.trimStart();
    }
    if (position === DicomTrimPosition.End) {
      return value.trimEnd();
    }
    return value.trim();
  }

  const set = new Set(trimCharacters.map((char) => char[0] ?? ""));
  let start = 0;
  let end = value.length;

  if (position === DicomTrimPosition.Start || position === DicomTrimPosition.Both) {
    while (start < end && set.has(value[start]!)) {
      start += 1;
    }
  }
  if (position === DicomTrimPosition.End || position === DicomTrimPosition.Both) {
    while (end > start && set.has(value[end - 1]!)) {
      end -= 1;
    }
  }
  return value.slice(start, end);
}

function splitBySeparators(value: string, separators: readonly string[]): string[] {
  if (separators.length === 0) {
    return [value];
  }
  const escaped = separators.map((separator) => separator.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")).join("");
  const regex = new RegExp(`[${escaped}]`);
  return value.split(regex);
}

function formatIndexed(template: string, parts: readonly string[]): string {
  return template.replace(/\{(\d+)\}/g, (_segment, rawIndex: string) => {
    const index = Number(rawIndex);
    if (Number.isNaN(index) || index < 0 || index >= parts.length) {
      return "";
    }
    return parts[index] ?? "";
  });
}
