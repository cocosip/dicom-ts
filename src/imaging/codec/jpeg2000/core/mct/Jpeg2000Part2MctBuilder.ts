import type {
  DicomJpeg2000MctBinding,
  DicomJpeg2000Params,
} from "../../DicomJpeg2000Params.js";
import { Jpeg2000Marker } from "../codestream/Jpeg2000Markers.js";

export interface Jpeg2000MainHeaderSegmentWriteEntry {
  marker: number;
  payload: Uint8Array;
}

export function buildPart2MctMainHeaderSegments(
  params: DicomJpeg2000Params,
  componentCount: number,
  irreversible: boolean,
): Jpeg2000MainHeaderSegmentWriteEntry[] {
  if (componentCount <= 0 || !params.allowMct) {
    return [];
  }

  const hasExplicitBindings = Array.isArray(params.mctBindings) && params.mctBindings.length > 0;
  const requestedBindings = resolveRequestedBindings(params);
  if (requestedBindings.length === 0) {
    return [];
  }

  const mctSegments: Jpeg2000MainHeaderSegmentWriteEntry[] = [];
  const mccSegments: Jpeg2000MainHeaderSegmentWriteEntry[] = [];
  const stageIndices: number[] = [];

  let mctIndex = 1;
  let mccIndex = 1;

  for (const binding of requestedBindings) {
    const componentIds = resolveComponentIds(binding, componentCount);
    if (componentIds.length === 0 || componentIds.length > 0x7fff || componentIds.length > 0xff) {
      continue;
    }

    const matrix = resolveMatrix(binding, params, componentIds.length);
    const offsets = resolveOffsets(binding, params, componentIds.length);
    if (!matrix && !offsets) {
      continue;
    }
    if (!hasExplicitBindings && !matrix) {
      continue;
    }

    const elementType = normalizeElementType(binding, params);

    let decorrelateIndex = 0;
    if (matrix) {
      const matrixPayload = buildMctPayload(
        mctIndex,
        1,
        elementType,
        encodeMatrixData(matrix, elementType),
      );
      mctSegments.push({ marker: Jpeg2000Marker.MCT, payload: matrixPayload });
      decorrelateIndex = mctIndex;
      mctIndex++;
    }

    let offsetIndex = 0;
    if (offsets) {
      const offsetPayload = buildMctPayload(
        mctIndex,
        2,
        elementType,
        encodeOffsetsData(offsets, elementType),
      );
      mctSegments.push({ marker: Jpeg2000Marker.MCT, payload: offsetPayload });
      offsetIndex = mctIndex;
      mctIndex++;
    }

    if (decorrelateIndex === 0 && offsetIndex === 0) {
      continue;
    }

    const collectionType = normalizeCollectionType(binding.assocType ?? params.mctAssocType);
    const reversible = resolveMccReversible(binding, hasExplicitBindings, irreversible);
    const mccPayload = buildMccPayload(
      mccIndex,
      collectionType,
      componentIds,
      componentIds,
      decorrelateIndex,
      offsetIndex,
      reversible,
    );
    mccSegments.push({ marker: Jpeg2000Marker.MCC, payload: mccPayload });
    stageIndices.push(mccIndex);
    mccIndex++;
  }

  if (mctSegments.length === 0 || mccSegments.length === 0) {
    return [];
  }

  const orderedStages = resolveStageOrder(stageIndices, params.mcoRecordOrder);
  const mcoPayload = buildMcoPayload(orderedStages);

  return [
    ...mctSegments,
    ...mccSegments,
    { marker: Jpeg2000Marker.MCO, payload: mcoPayload },
  ];
}

function resolveRequestedBindings(params: DicomJpeg2000Params): DicomJpeg2000MctBinding[] {
  if (Array.isArray(params.mctBindings) && params.mctBindings.length > 0) {
    return params.mctBindings;
  }

  if (params.mctMatrix) {
    const binding: DicomJpeg2000MctBinding = {
      assocType: params.mctAssocType,
      elementType: params.mctMatrixElementType,
      matrix: params.mctMatrix,
    };
    if (params.mctOffsets) {
      binding.offsets = params.mctOffsets;
    }
    return [binding];
  }

  return [];
}

function resolveComponentIds(binding: DicomJpeg2000MctBinding, componentCount: number): number[] {
  if (Array.isArray(binding.componentIds) && binding.componentIds.length > 0) {
    const filtered = binding.componentIds
      .filter((id) => Number.isInteger(id) && id >= 0 && id < componentCount)
      .map((id) => Math.trunc(id));

    if (filtered.length > 0) {
      return dedupePreservingOrder(filtered);
    }
  }

  return Array.from({ length: componentCount }, (_, i) => i);
}

function resolveMatrix(
  binding: DicomJpeg2000MctBinding,
  params: DicomJpeg2000Params,
  componentCount: number,
): number[][] | undefined {
  const raw = binding.matrix ?? params.mctMatrix;
  if (!Array.isArray(raw) || raw.length !== componentCount) {
    return undefined;
  }

  const matrix: number[][] = [];
  for (let row = 0; row < componentCount; row++) {
    const sourceRow = raw[row];
    if (!Array.isArray(sourceRow) || sourceRow.length !== componentCount) {
      return undefined;
    }

    const normalizedRow = new Array<number>(componentCount);
    for (let col = 0; col < componentCount; col++) {
      const rawValue = sourceRow[col];
      const value = typeof rawValue === "number" ? rawValue : Number.NaN;
      if (!Number.isFinite(value)) {
        return undefined;
      }
      normalizedRow[col] = value;
    }
    matrix.push(normalizedRow);
  }

  return matrix;
}

function resolveOffsets(
  binding: DicomJpeg2000MctBinding,
  params: DicomJpeg2000Params,
  componentCount: number,
): number[] | undefined {
  const raw = binding.offsets ?? params.mctOffsets;
  if (!Array.isArray(raw) || raw.length !== componentCount) {
    return undefined;
  }

  const offsets = new Array<number>(componentCount);
  for (let i = 0; i < componentCount; i++) {
    const rawValue = raw[i];
    const value = typeof rawValue === "number" ? rawValue : Number.NaN;
    if (!Number.isFinite(value)) {
      return undefined;
    }
    offsets[i] = value;
  }

  return offsets;
}

function normalizeElementType(binding: DicomJpeg2000MctBinding, params: DicomJpeg2000Params): 0 | 1 | 2 | 3 {
  const raw = binding.elementType ?? params.mctMatrixElementType;
  if (raw === 0 || raw === 1 || raw === 2 || raw === 3) {
    return raw;
  }
  return 1;
}

function normalizeCollectionType(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const normalized = Math.trunc(value);
  return normalized >= 0 && normalized <= 255 ? normalized : 0;
}

function resolveMccReversible(
  binding: DicomJpeg2000MctBinding,
  hasExplicitBindings: boolean,
  irreversible: boolean,
): boolean {
  if (typeof binding.mcoPrecision === "number" && Number.isFinite(binding.mcoPrecision)) {
    return (Math.trunc(binding.mcoPrecision) & 0x1) !== 0;
  }

  if (hasExplicitBindings) {
    // Go reference: explicit bindings default MCOPrecision to 0 when omitted.
    return false;
  }

  // Fallback-matrix path mirrors Go custom-MCT behavior via codec irreversible mode.
  return !irreversible;
}

function resolveStageOrder(stageIndices: number[], requestedOrder: number[]): number[] {
  if (!Array.isArray(requestedOrder) || requestedOrder.length === 0) {
    return [...stageIndices];
  }

  if (!isValidRequestedStageOrder(stageIndices, requestedOrder)) {
    return [...stageIndices];
  }

  return requestedOrder.map((stage) => Math.trunc(stage));
}

function isValidRequestedStageOrder(stageIndices: number[], requestedOrder: number[]): boolean {
  if (requestedOrder.length !== stageIndices.length) {
    return false;
  }

  const allowed = new Set(stageIndices);
  for (const stage of requestedOrder) {
    if (!Number.isInteger(stage) || !allowed.has(stage)) {
      return false;
    }
  }

  return true;
}

function encodeMatrixData(matrix: number[][], elementType: 0 | 1 | 2 | 3): Uint8Array {
  const components = matrix.length;
  const elementSize = mctElementSize(elementType);
  const data = new Uint8Array(components * components * elementSize);
  const view = new DataView(data.buffer);

  let offset = 0;
  for (let row = 0; row < components; row++) {
    for (let col = 0; col < components; col++) {
      writeMctElement(view, offset, matrix[row]![col] ?? 0, elementType);
      offset += elementSize;
    }
  }

  return data;
}

function encodeOffsetsData(offsets: number[], elementType: 0 | 1 | 2 | 3): Uint8Array {
  const elementSize = mctElementSize(elementType);
  const data = new Uint8Array(offsets.length * elementSize);
  const view = new DataView(data.buffer);

  let offset = 0;
  for (let i = 0; i < offsets.length; i++) {
    writeMctElement(view, offset, offsets[i] ?? 0, elementType);
    offset += elementSize;
  }

  return data;
}

function buildMctPayload(
  index: number,
  arrayType: 1 | 2,
  elementType: 0 | 1 | 2 | 3,
  data: Uint8Array,
): Uint8Array {
  const payload = new Uint8Array(6 + data.length);
  writeU16At(payload, 0, 0); // Zmct

  const iMct = (index & 0xff)
    | ((arrayType & 0x03) << 8)
    | ((elementType & 0x03) << 10);
  writeU16At(payload, 2, iMct);
  writeU16At(payload, 4, 0); // Ymct

  payload.set(data, 6);
  return payload;
}

function buildMccPayload(
  index: number,
  collectionType: number,
  componentIds: number[],
  outputComponentIds: number[],
  decorrelateIndex: number,
  offsetIndex: number,
  reversible: boolean,
): Uint8Array {
  const payload = new Uint8Array(
    2 + 1 + 2 + 2 + 1
    + 2 + componentIds.length
    + 2 + outputComponentIds.length
    + 3,
  );

  let p = 0;
  writeU16At(payload, p, 0); p += 2; // Zmcc
  payload[p] = index & 0xff; p++;
  writeU16At(payload, p, 0); p += 2; // Ymcc
  writeU16At(payload, p, 1); p += 2; // Qmcc (single collection)
  payload[p] = collectionType & 0xff; p++;

  writeU16At(payload, p, componentIds.length & 0x7fff); p += 2;
  for (const id of componentIds) {
    payload[p] = id & 0xff;
    p++;
  }

  writeU16At(payload, p, outputComponentIds.length & 0x7fff); p += 2;
  for (const id of outputComponentIds) {
    payload[p] = id & 0xff;
    p++;
  }

  payload[p] = reversible ? 0x01 : 0x00; p++;
  payload[p] = offsetIndex & 0xff; p++;
  payload[p] = decorrelateIndex & 0xff;

  return payload;
}

function buildMcoPayload(stageIndices: number[]): Uint8Array {
  const count = Math.min(stageIndices.length, 255);
  const payload = new Uint8Array(1 + count);
  payload[0] = count & 0xff;
  for (let i = 0; i < count; i++) {
    payload[1 + i] = stageIndices[i]! & 0xff;
  }
  return payload;
}

function mctElementSize(elementType: 0 | 1 | 2 | 3): number {
  switch (elementType) {
    case 0:
      return 2;
    case 1:
    case 2:
      return 4;
    case 3:
      return 8;
    default:
      return 4;
  }
}

function writeMctElement(view: DataView, offset: number, value: number, elementType: 0 | 1 | 2 | 3): void {
  switch (elementType) {
    case 0:
      view.setInt16(offset, clampToInt16(Math.round(value)), false);
      return;
    case 1:
      view.setInt32(offset, clampToInt32(Math.round(value)), false);
      return;
    case 2:
      view.setFloat32(offset, value, false);
      return;
    case 3:
      view.setFloat64(offset, value, false);
      return;
    default:
      view.setInt32(offset, clampToInt32(Math.round(value)), false);
  }
}

function clampToInt16(value: number): number {
  if (value > 32767) {
    return 32767;
  }
  if (value < -32768) {
    return -32768;
  }
  return value | 0;
}

function clampToInt32(value: number): number {
  if (value > 2147483647) {
    return 2147483647;
  }
  if (value < -2147483648) {
    return -2147483648;
  }
  return value | 0;
}

function dedupePreservingOrder(values: number[]): number[] {
  const output: number[] = [];
  const seen = new Set<number>();
  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value);
      output.push(value);
    }
  }
  return output;
}

function writeU16At(target: Uint8Array, offset: number, value: number): void {
  target[offset] = (value >>> 8) & 0xff;
  target[offset + 1] = value & 0xff;
}
