import { DicomTag } from "../core/DicomTag.js";
import { DicomDataset } from "./DicomDataset.js";

export interface IDicomMatchRule {
  match(dataset: DicomDataset): boolean;
}

export enum DicomMatchOperator {
  And = "and",
  Or = "or",
}

export class DicomMatchRuleSet implements IDicomMatchRule {
  readonly operator: DicomMatchOperator;
  private readonly rules: IDicomMatchRule[];

  constructor();
  constructor(operator: DicomMatchOperator);
  constructor(...rules: IDicomMatchRule[]);
  constructor(operator: DicomMatchOperator, ...rules: IDicomMatchRule[]);
  constructor(arg0?: DicomMatchOperator | IDicomMatchRule, ...rest: IDicomMatchRule[]) {
    if (arg0 === DicomMatchOperator.And || arg0 === DicomMatchOperator.Or) {
      this.operator = arg0;
      this.rules = [...rest];
    } else if (arg0) {
      this.operator = DicomMatchOperator.And;
      this.rules = [arg0, ...rest];
    } else {
      this.operator = DicomMatchOperator.And;
      this.rules = [];
    }
  }

  add(rule: IDicomMatchRule): void {
    this.rules.push(rule);
  }

  match(dataset: DicomDataset): boolean {
    if (this.rules.length === 0) {
      return true;
    }

    if (this.operator === DicomMatchOperator.Or) {
      return this.rules.some((rule) => rule.match(dataset));
    }
    return this.rules.every((rule) => rule.match(dataset));
  }
}

export class NegateDicomMatchRule implements IDicomMatchRule {
  constructor(private readonly rule: IDicomMatchRule) {}

  match(dataset: DicomDataset): boolean {
    return !this.rule.match(dataset);
  }
}

export class ExistsDicomMatchRule implements IDicomMatchRule {
  constructor(private readonly tag: DicomTag) {}

  match(dataset: DicomDataset): boolean {
    return dataset.contains(this.tag);
  }
}

export class IsEmptyDicomMatchRule implements IDicomMatchRule {
  constructor(private readonly tag: DicomTag) {}

  match(dataset: DicomDataset): boolean {
    const value = dataset.tryGetString(this.tag);
    return value === undefined || value.length === 0;
  }
}

export class EqualsDicomMatchRule implements IDicomMatchRule {
  readonly tag: DicomTag;
  readonly value: string;

  constructor(tag: DicomTag, value: string) {
    this.tag = tag;
    this.value = value;
  }

  match(dataset: DicomDataset): boolean {
    return getValue(dataset, this.tag) === this.value;
  }
}

export class StartsWithDicomMatchRule implements IDicomMatchRule {
  constructor(private readonly tag: DicomTag, private readonly value: string) {}

  match(dataset: DicomDataset): boolean {
    return getValue(dataset, this.tag).startsWith(this.value);
  }
}

export class EndsWithDicomMatchRule implements IDicomMatchRule {
  constructor(private readonly tag: DicomTag, private readonly value: string) {}

  match(dataset: DicomDataset): boolean {
    return getValue(dataset, this.tag).endsWith(this.value);
  }
}

export class ContainsDicomMatchRule implements IDicomMatchRule {
  constructor(private readonly tag: DicomTag, private readonly value: string) {}

  match(dataset: DicomDataset): boolean {
    return getValue(dataset, this.tag).includes(this.value);
  }
}

export class WildcardDicomMatchRule implements IDicomMatchRule {
  private readonly regex: RegExp;

  constructor(private readonly tag: DicomTag, pattern: string) {
    this.regex = wildcardToRegex(pattern);
  }

  match(dataset: DicomDataset): boolean {
    return this.regex.test(getValue(dataset, this.tag));
  }
}

export class RegexDicomMatchRule implements IDicomMatchRule {
  private readonly regex: RegExp;

  constructor(private readonly tag: DicomTag, pattern: string) {
    this.regex = compileRegex(pattern);
  }

  match(dataset: DicomDataset): boolean {
    return this.regex.test(getValue(dataset, this.tag));
  }
}

export class OneOfDicomMatchRule implements IDicomMatchRule {
  private readonly values: string[];

  constructor(private readonly tag: DicomTag, ...values: string[]) {
    this.values = values;
  }

  match(dataset: DicomDataset): boolean {
    const value = getValue(dataset, this.tag);
    return this.values.some((candidate) => candidate === value);
  }
}

export class BoolDicomMatchRule implements IDicomMatchRule {
  constructor(private readonly value: boolean) {}

  match(_dataset: DicomDataset): boolean {
    return this.value;
  }
}

function getValue(dataset: DicomDataset, tag: DicomTag): string {
  return dataset.tryGetString(tag) ?? "";
}

function wildcardToRegex(pattern: string): RegExp {
  let regex = "^";
  for (const char of pattern) {
    if (char === "*") {
      regex += ".*";
    } else if (char === "?") {
      regex += ".";
    } else {
      regex += escapeRegex(char);
    }
  }
  regex += "$";
  return new RegExp(regex, "i");
}

function escapeRegex(value: string): string {
  return value.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
}

function compileRegex(pattern: string): RegExp {
  // Compatibility with .NET inline case-insensitive marker, e.g. "^(?i)test$".
  const hasInlineIgnoreCase = pattern.includes("(?i)");
  const normalizedPattern = pattern.replace(/\(\?i\)/g, "");
  return new RegExp(normalizedPattern, hasInlineIgnoreCase ? "i" : undefined);
}
