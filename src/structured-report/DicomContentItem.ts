
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomDate, DicomDateTime, DicomTime, DicomUniqueIdentifier } from "../dataset/DicomElement.js";
import { DicomSequence } from "../dataset/DicomSequence.js";
import { DicomUID } from "../core/DicomUID.js";
import * as DicomTags from "../core/DicomTag.generated.js";
import { DicomCodeItem } from "./DicomCodeItem.js";
import { DicomMeasuredValue } from "./DicomMeasuredValue.js";
import { DicomReferencedSOP } from "./DicomReferencedSOP.js";
import { DicomStructuredReportException } from "./DicomStructuredReportException.js";

export enum DicomValueType {
  Container = "Container",
  Text = "Text",
  Code = "Code",
  Numeric = "Numeric",
  PersonName = "PersonName",
  Date = "Date",
  Time = "Time",
  DateTime = "DateTime",
  UIDReference = "UIDReference",
  Composite = "Composite",
  Image = "Image",
  Waveform = "Waveform",
  SpatialCoordinate = "SpatialCoordinate",
  TemporalCoordinate = "TemporalCoordinate",
}

export enum DicomContinuity {
  None = "None",
  Separate = "Separate",
  Continuous = "Continuous",
}

export enum DicomRelationship {
  Contains = "Contains",
  HasProperties = "HasProperties",
  InferredFrom = "InferredFrom",
  SelectedFrom = "SelectedFrom",
  HasObservationContext = "HasObservationContext",
  HasAcquisitionContext = "HasAcquisitionContext",
  HasConceptModifier = "HasConceptModifier",
}

const VALUE_TYPE_VALUES = new Set(Object.values(DicomValueType));
const CONTINUITY_VALUES = new Set(Object.values(DicomContinuity));

export class DicomContentItem {
  readonly dataset: DicomDataset;

  constructor(dataset: DicomDataset);
  constructor(code: DicomCodeItem, relationship: DicomRelationship, type: DicomValueType.Text | DicomValueType.PersonName, value: string);
  constructor(code: DicomCodeItem, relationship: DicomRelationship, type: DicomValueType.Date | DicomValueType.Time | DicomValueType.DateTime, value: Date);
  constructor(code: DicomCodeItem, relationship: DicomRelationship, value: DicomUID);
  constructor(code: DicomCodeItem, relationship: DicomRelationship, value: DicomCodeItem);
  constructor(code: DicomCodeItem, relationship: DicomRelationship, value: DicomMeasuredValue);
  constructor(code: DicomCodeItem, relationship: DicomRelationship, type: DicomValueType.Composite | DicomValueType.Image | DicomValueType.Waveform, value: DicomReferencedSOP);
  constructor(code: DicomCodeItem, relationship: DicomRelationship, continuity: DicomContinuity, ...items: DicomContentItem[]);
  constructor(...args: unknown[]) {
    if (args.length === 1 && args[0] instanceof DicomDataset) {
      this.dataset = args[0];
      return;
    }

    const [code, relationship, arg2, arg3, ...rest] = args;
    if (!(code instanceof DicomCodeItem)) {
      throw new DicomStructuredReportException("Content item requires a concept code.");
    }
    if (!isDicomRelationship(relationship)) {
      throw new DicomStructuredReportException("Content item requires a valid relationship type.");
    }

    this.dataset = new DicomDataset();
    this.code = code;
    this.relationship = relationship;

    if (arg2 instanceof DicomUID) {
      this.type = DicomValueType.UIDReference;
      this.dataset.addOrUpdate(new DicomUniqueIdentifier(DicomTags.UID, arg2));
      return;
    }

    if (arg2 instanceof DicomCodeItem) {
      this.type = DicomValueType.Code;
      setSingleItemSequence(this.dataset, DicomTags.ConceptCodeSequence, arg2);
      return;
    }

    if (arg2 instanceof DicomMeasuredValue) {
      this.type = DicomValueType.Numeric;
      setSingleItemSequence(this.dataset, DicomTags.MeasuredValueSequence, arg2);
      return;
    }

    if (isDicomContinuity(arg2)) {
      this.type = DicomValueType.Container;
      this.continuity = arg2;
      const firstChild = arg3 instanceof DicomContentItem ? arg3 : undefined;
      const children = firstChild ? [firstChild, ...rest.filter((item): item is DicomContentItem => item instanceof DicomContentItem)] : [];
      this.dataset.addOrUpdate(new DicomSequence(DicomTags.ContentSequence, ...children.map((item) => item.dataset)));
      return;
    }

    if (!isDicomValueType(arg2)) {
      throw new DicomStructuredReportException("Unable to infer content item value type.");
    }

    if (typeof arg3 === "string") {
      this.type = arg2;
      if (arg2 === DicomValueType.Text) {
        this.dataset.addOrUpdateValue(DicomTags.TextValue, arg3);
        return;
      }
      if (arg2 === DicomValueType.PersonName) {
        this.dataset.addOrUpdateValue(DicomTags.PersonName, arg3);
        return;
      }
      throw new DicomStructuredReportException(
        `Type of string is not the correct value type for ${arg2} content item.`,
      );
    }

    if (arg3 instanceof Date) {
      this.type = arg2;
      if (arg2 === DicomValueType.Date) {
        this.dataset.addOrUpdate(new DicomDate(DicomTags.Date, arg3));
        return;
      }
      if (arg2 === DicomValueType.Time) {
        this.dataset.addOrUpdate(new DicomTime(DicomTags.Time, arg3));
        return;
      }
      if (arg2 === DicomValueType.DateTime) {
        this.dataset.addOrUpdate(new DicomDateTime(DicomTags.DateTime, arg3));
        return;
      }
      throw new DicomStructuredReportException(
        `Type of Date is not the correct value type for ${arg2} content item.`,
      );
    }

    if (arg3 instanceof DicomReferencedSOP) {
      this.type = arg2;
      if (arg2 === DicomValueType.Composite || arg2 === DicomValueType.Image || arg2 === DicomValueType.Waveform) {
        setSingleItemSequence(this.dataset, DicomTags.ReferencedSOPSequence, arg3);
        return;
      }
      throw new DicomStructuredReportException(
        `Type of DicomReferencedSOP is not the correct value type for ${arg2} content item.`,
      );
    }

    throw new DicomStructuredReportException("Unsupported value payload for content item.");
  }

  get code(): DicomCodeItem | null {
    return getCodeItem(this.dataset, DicomTags.ConceptNameCodeSequence);
  }

  private set code(value: DicomCodeItem | null) {
    if (!value) return;
    setSingleItemSequence(this.dataset, DicomTags.ConceptNameCodeSequence, value);
  }

  get type(): DicomValueType {
    const raw = this.dataset.getSingleValueOrDefault<string>(DicomTags.ValueType, "UNKNOWN");
    return fromValueTypeString(raw);
  }

  private set type(value: DicomValueType) {
    this.dataset.addOrUpdateValue(DicomTags.ValueType, toValueTypeString(value));
  }

  get relationship(): DicomRelationship {
    const raw = this.dataset.getSingleValueOrDefault<string>(DicomTags.RelationshipType, "UNKNOWN");
    return fromRelationshipString(raw);
  }

  private set relationship(value: DicomRelationship) {
    this.dataset.addOrUpdateValue(DicomTags.RelationshipType, toRelationshipString(value));
  }

  get continuity(): DicomContinuity {
    const raw = this.dataset.tryGetString(DicomTags.ContinuityOfContent);
    if (!raw) return DicomContinuity.None;
    return fromContinuityString(raw);
  }

  private set continuity(value: DicomContinuity) {
    if (value === DicomContinuity.None) {
      this.dataset.remove(DicomTags.ContinuityOfContent);
      return;
    }
    this.dataset.addOrUpdateValue(DicomTags.ContinuityOfContent, toContinuityString(value));
  }

  *children(): IterableIterator<DicomContentItem> {
    const sequence = this.dataset.tryGetSequence(DicomTags.ContentSequence);
    if (!sequence) return;
    for (const item of sequence.items) {
      yield new DicomContentItem(item);
    }
  }

  add(item: DicomContentItem): DicomContentItem;
  add(code: DicomCodeItem, relationship: DicomRelationship, type: DicomValueType.Text | DicomValueType.PersonName, value: string): DicomContentItem;
  add(code: DicomCodeItem, relationship: DicomRelationship, type: DicomValueType.Date | DicomValueType.Time | DicomValueType.DateTime, value: Date): DicomContentItem;
  add(code: DicomCodeItem, relationship: DicomRelationship, value: DicomUID): DicomContentItem;
  add(code: DicomCodeItem, relationship: DicomRelationship, value: DicomCodeItem): DicomContentItem;
  add(code: DicomCodeItem, relationship: DicomRelationship, value: DicomMeasuredValue): DicomContentItem;
  add(code: DicomCodeItem, relationship: DicomRelationship, type: DicomValueType.Composite | DicomValueType.Image | DicomValueType.Waveform, value: DicomReferencedSOP): DicomContentItem;
  add(code: DicomCodeItem, relationship: DicomRelationship, continuity: DicomContinuity, ...items: DicomContentItem[]): DicomContentItem;
  add(...args: unknown[]): DicomContentItem {
    const item = args[0] instanceof DicomContentItem
      ? args[0]
      : new DicomContentItem(...args as ConstructorParameters<typeof DicomContentItem>);

    let sequence = this.dataset.tryGetSequence(DicomTags.ContentSequence);
    if (!sequence) {
      sequence = new DicomSequence(DicomTags.ContentSequence);
      this.dataset.addOrUpdate(sequence);
    }
    sequence.items.push(item.dataset);
    return item;
  }

  /**
   * Get the value of the content item.
   * If T is string, it will return the string representation of the value (including Numeric, Code, etc.)
   */
  get<T = unknown>(): T {
    // String handling (special case to match C# ToString behavior for complex types)
    // Note: TypeScript doesn't allow `typeof T` checks at runtime.
    // We can infer intent if T is implicitly expected to be string, but here we return T.
    // However, the caller expects `get<string>()` to return a string representation for all types.
    // Since we cannot check T at runtime, we must rely on the Type property.
    
    // To match C# behavior where Get<string> returns string for almost everything:
    // We'll implement a helper that returns based on Type.

    const type = this.type;

    switch (type) {
      case DicomValueType.Text:
        return this.dataset.getSingleValueOrDefault<string>(DicomTags.TextValue, "") as unknown as T;
      case DicomValueType.PersonName:
        return this.dataset.getSingleValueOrDefault<string>(DicomTags.PersonName, "") as unknown as T;
      case DicomValueType.Numeric: {
        const mv = getMeasuredValue(this.dataset, DicomTags.MeasuredValueSequence);
        // If caller expects string, return toString(). If number, return value.
        // Since we can't know T, we return the object DicomMeasuredValue if T is that, or string if T is string?
        // C# does runtime type checking of T. We can't.
        // We will return the DicomMeasuredValue object by default for object types,
        // but if the user wants the value, they should probably access it directly or we need a specific method.
        // However, to align with C# `Get<string>`, we can't fully replicate overloading on return type.
        // We will return the raw value appropriate for the type.
        return mv as unknown as T;
      }
      case DicomValueType.Date:
        return this.dataset.getSingleValueOrDefault<string>(DicomTags.Date, "") as unknown as T;
      case DicomValueType.Time:
        return this.dataset.getSingleValueOrDefault<string>(DicomTags.Time, "") as unknown as T;
      case DicomValueType.DateTime:
        return this.dataset.getSingleValueOrDefault<string>(DicomTags.DateTime, "") as unknown as T;
      case DicomValueType.UIDReference:
        return (this.dataset.getDicomItem<DicomUniqueIdentifier>(DicomTags.UID)?.uidValue ?? null) as unknown as T;
      case DicomValueType.Code:
        return getCodeItem(this.dataset, DicomTags.ConceptCodeSequence) as unknown as T;
      case DicomValueType.Composite:
      case DicomValueType.Image:
      case DicomValueType.Waveform:
        return getReferencedSOP(this.dataset, DicomTags.ReferencedSOPSequence) as unknown as T;
      default:
        throw new DicomStructuredReportException(
          `Unable to get value from ${type} content item.`,
        );
    }
  }

  getValueAsString(): string {
     switch (this.type) {
      case DicomValueType.Text: return this.get<string>();
      case DicomValueType.PersonName: return this.get<string>();
      case DicomValueType.Numeric: return this.get<DicomMeasuredValue>()?.toString() ?? "";
      case DicomValueType.Date: return this.get<string>();
      case DicomValueType.Time: return this.get<string>();
      case DicomValueType.DateTime: return this.get<string>();
      case DicomValueType.UIDReference: return this.get<DicomUID>()?.toString() ?? "";
      case DicomValueType.Code: return this.get<DicomCodeItem>()?.toString() ?? "";
      case DicomValueType.Composite:
      case DicomValueType.Image:
      case DicomValueType.Waveform: return this.get<DicomReferencedSOP>()?.toString() ?? "";
      default: return "";
    }
  }

  findChild(code: DicomCodeItem): DicomContentItem | undefined {
    for (const item of this.children()) {
      if (item.code?.equals(code)) {
        return item;
      }
    }
    return undefined;
  }

  toString(): string {
    const relationship = this.dataset.tryGetString(DicomTags.RelationshipType);
    const code = this.code;
    const valueType = this.dataset.getSingleValueOrDefault<string>(DicomTags.ValueType, "UNKNOWN");
    let summary = relationship ? `${relationship} ` : "";
    summary += code ? `${code.toString()} ${valueType}` : `(no code provided) ${valueType}`;

    let value = "";
    try {
      value = this.getValueAsString();
    } catch {
      value = "";
    }
    if (value) {
      summary += ` [${value}]`;
    }
    return summary;
  }
}

function isDicomValueType(value: unknown): value is DicomValueType {
  return typeof value === "string" && VALUE_TYPE_VALUES.has(value as DicomValueType);
}

function isDicomContinuity(value: unknown): value is DicomContinuity {
  return typeof value === "string" && CONTINUITY_VALUES.has(value as DicomContinuity);
}

function isDicomRelationship(value: unknown): value is DicomRelationship {
  return typeof value === "string" && Object.values(DicomRelationship).includes(value as DicomRelationship);
}

function getCodeItem(dataset: DicomDataset, tag: typeof DicomTags.ConceptNameCodeSequence): DicomCodeItem | null;
function getCodeItem(dataset: DicomDataset, tag: typeof DicomTags.ConceptCodeSequence): DicomCodeItem | null;
function getCodeItem(dataset: DicomDataset, tag: typeof DicomTags.MeasurementUnitsCodeSequence): DicomCodeItem | null;
function getCodeItem(dataset: DicomDataset, tag: typeof DicomTags.ConceptNameCodeSequence | typeof DicomTags.ConceptCodeSequence | typeof DicomTags.MeasurementUnitsCodeSequence): DicomCodeItem | null {
  const first = dataset.tryGetSequence(tag)?.items[0];
  return first ? new DicomCodeItem(first) : null;
}

function getMeasuredValue(dataset: DicomDataset, tag: typeof DicomTags.MeasuredValueSequence): DicomMeasuredValue | null {
  const first = dataset.tryGetSequence(tag)?.items[0];
  return first ? new DicomMeasuredValue(first) : null;
}

function getReferencedSOP(dataset: DicomDataset, tag: typeof DicomTags.ReferencedSOPSequence): DicomReferencedSOP | null {
  const first = dataset.tryGetSequence(tag)?.items[0];
  return first ? new DicomReferencedSOP(first) : null;
}

function setSingleItemSequence(dataset: DicomDataset, tag: typeof DicomTags.ConceptNameCodeSequence, item: DicomDataset): void;
function setSingleItemSequence(dataset: DicomDataset, tag: typeof DicomTags.ConceptCodeSequence, item: DicomDataset): void;
function setSingleItemSequence(dataset: DicomDataset, tag: typeof DicomTags.MeasuredValueSequence, item: DicomDataset): void;
function setSingleItemSequence(dataset: DicomDataset, tag: typeof DicomTags.ReferencedSOPSequence, item: DicomDataset): void;
function setSingleItemSequence(
  dataset: DicomDataset,
  tag:
    | typeof DicomTags.ConceptNameCodeSequence
    | typeof DicomTags.ConceptCodeSequence
    | typeof DicomTags.MeasuredValueSequence
    | typeof DicomTags.ReferencedSOPSequence,
  item: DicomDataset,
): void {
  dataset.addOrUpdate(new DicomSequence(tag, item));
}

function toValueTypeString(value: DicomValueType): string {
  switch (value) {
    case DicomValueType.Container: return "CONTAINER";
    case DicomValueType.Text: return "TEXT";
    case DicomValueType.Code: return "CODE";
    case DicomValueType.Numeric: return "NUM";
    case DicomValueType.PersonName: return "PNAME";
    case DicomValueType.Date: return "DATE";
    case DicomValueType.Time: return "TIME";
    case DicomValueType.DateTime: return "DATETIME";
    case DicomValueType.UIDReference: return "UIDREF";
    case DicomValueType.Composite: return "COMPOSITE";
    case DicomValueType.Image: return "IMAGE";
    case DicomValueType.Waveform: return "WAVEFORM";
    case DicomValueType.SpatialCoordinate: return "SCOORD";
    case DicomValueType.TemporalCoordinate: return "TCOORD";
  }
}

function fromValueTypeString(value: string): DicomValueType {
  switch (value) {
    case "CONTAINER": return DicomValueType.Container;
    case "TEXT": return DicomValueType.Text;
    case "CODE": return DicomValueType.Code;
    case "NUM": return DicomValueType.Numeric;
    case "PNAME": return DicomValueType.PersonName;
    case "DATE": return DicomValueType.Date;
    case "TIME": return DicomValueType.Time;
    case "DATETIME": return DicomValueType.DateTime;
    case "UIDREF": return DicomValueType.UIDReference;
    case "COMPOSITE": return DicomValueType.Composite;
    case "IMAGE": return DicomValueType.Image;
    case "WAVEFORM": return DicomValueType.Waveform;
    case "SCOORD": return DicomValueType.SpatialCoordinate;
    case "TCOORD": return DicomValueType.TemporalCoordinate;
    default:
      throw new DicomStructuredReportException(`Unknown value type: ${value}`);
  }
}

function toRelationshipString(value: DicomRelationship): string {
  switch (value) {
    case DicomRelationship.Contains: return "CONTAINS";
    case DicomRelationship.HasProperties: return "HAS PROPERTIES";
    case DicomRelationship.InferredFrom: return "INFERRED FROM";
    case DicomRelationship.SelectedFrom: return "SELECTED FROM";
    case DicomRelationship.HasObservationContext: return "HAS OBS CONTEXT";
    case DicomRelationship.HasAcquisitionContext: return "HAS ACQ CONTEXT";
    case DicomRelationship.HasConceptModifier: return "HAS CONCEPT MOD";
  }
}

function fromRelationshipString(value: string): DicomRelationship {
  switch (value) {
    case "CONTAINS": return DicomRelationship.Contains;
    case "HAS PROPERTIES": return DicomRelationship.HasProperties;
    case "INFERRED FROM": return DicomRelationship.InferredFrom;
    case "SELECTED FROM": return DicomRelationship.SelectedFrom;
    case "HAS OBS CONTEXT": return DicomRelationship.HasObservationContext;
    case "HAS ACQ CONTEXT": return DicomRelationship.HasAcquisitionContext;
    case "HAS CONCEPT MOD": return DicomRelationship.HasConceptModifier;
    default:
      throw new DicomStructuredReportException(`Unknown relationship type: ${value}`);
  }
}

function toContinuityString(value: DicomContinuity): string {
  switch (value) {
    case DicomContinuity.None: return "NONE";
    case DicomContinuity.Separate: return "SEPARATE";
    case DicomContinuity.Continuous: return "CONTINUOUS";
  }
}

function fromContinuityString(value: string): DicomContinuity {
  switch (value) {
    case "NONE": return DicomContinuity.None;
    case "SEPARATE": return DicomContinuity.Separate;
    case "CONTINUOUS": return DicomContinuity.Continuous;
    default:
      throw new DicomStructuredReportException(`Unknown continuity type: ${value}`);
  }
}
