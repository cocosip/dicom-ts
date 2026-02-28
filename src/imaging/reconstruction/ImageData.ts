import * as Tags from "../../core/DicomTag.generated.js";
import { DicomTransferSyntax } from "../../core/DicomTransferSyntax.js";
import { DicomDataset } from "../../dataset/DicomDataset.js";
import { cloneDataset } from "../../dataset/DicomDatasetExtensions.js";
import { DicomPixelData } from "../DicomPixelData.js";
import { DicomTranscoder as CodecDicomTranscoder } from "../codec/DicomTranscoder.js";
import { Point3D, Vector3D } from "../math/Geometry3D.js";

function parseNumberList(dataset: DicomDataset, tag: import("../../core/DicomTag.js").DicomTag): number[] {
  const raw = dataset.tryGetString(tag);
  if (!raw) return [];
  return raw
    .split("\\")
    .map((p) => parseFloat(p.trim().replace(",", ".")))
    .filter((n) => Number.isFinite(n));
}

function ensureDecompressed(dataset: DicomDataset): DicomDataset {
  const cloned = cloneDataset(dataset);
  if (!cloned.internalTransferSyntax.isEncapsulated) return cloned;

  const transcoder = new CodecDicomTranscoder(
    cloned.internalTransferSyntax,
    DicomTransferSyntax.ExplicitVRLittleEndian,
  );
  return transcoder.transcode(cloned);
}

export class ImageData {
  readonly dataset: DicomDataset;
  readonly pixelData: DicomPixelData;
  readonly frame: number;

  readonly rows: number;
  readonly columns: number;
  readonly frameOfReferenceUID: string | null;
  readonly position: Point3D;
  readonly rowDirection: Vector3D;
  readonly columnDirection: Vector3D;
  readonly normalDirection: Vector3D;
  readonly pixelSpacingRow: number;
  readonly pixelSpacingColumn: number;
  readonly sortingValue: number;
  readonly instanceNumber: number;

  private readonly values: Float64Array;

  constructor(dataset: DicomDataset, frame?: number);
  constructor(dataset: DicomDataset, pixelData: DicomPixelData, frame: number);
  constructor(dataset: DicomDataset, frameOrPixelData: number | DicomPixelData = 0, maybeFrame?: number) {
    let normalizedDataset: DicomDataset;
    let normalizedPixelData: DicomPixelData;
    let normalizedFrame: number;

    if (frameOrPixelData instanceof DicomPixelData) {
      if (frameOrPixelData.isEncapsulated) {
        throw new Error("The PixelData given to ImageData must not be compressed");
      }
      normalizedDataset = dataset;
      normalizedPixelData = frameOrPixelData;
      normalizedFrame = maybeFrame ?? 0;
    } else {
      normalizedDataset = ensureDecompressed(dataset);
      normalizedPixelData = DicomPixelData.create(normalizedDataset);
      normalizedFrame = frameOrPixelData;
    }

    if (normalizedFrame < 0 || normalizedFrame >= normalizedPixelData.numberOfFrames) {
      throw new RangeError(`Frame index ${normalizedFrame} out of range`);
    }

    this.dataset = normalizedDataset;
    this.pixelData = normalizedPixelData;
    this.frame = normalizedFrame;
    this.rows = normalizedPixelData.rows;
    this.columns = normalizedPixelData.columns;
    this.frameOfReferenceUID = this.dataset.tryGetString(Tags.FrameOfReferenceUID) ?? null;

    const spacing = parseNumberList(this.dataset, Tags.PixelSpacing);
    this.pixelSpacingRow = spacing[0] ?? 1;
    this.pixelSpacingColumn = spacing[1] ?? this.pixelSpacingRow;

    const orientation = parseNumberList(this.dataset, Tags.ImageOrientationPatient);
    this.rowDirection = new Vector3D(orientation[0] ?? 1, orientation[1] ?? 0, orientation[2] ?? 0).normalize();
    this.columnDirection = new Vector3D(orientation[3] ?? 0, orientation[4] ?? 1, orientation[5] ?? 0).normalize();
    this.normalDirection = this.rowDirection.cross(this.columnDirection).normalize();

    const position = parseNumberList(this.dataset, Tags.ImagePositionPatient);
    this.position = new Point3D(
      position[0] ?? 0,
      position[1] ?? 0,
      position[2] ?? normalizedFrame,
    );

    this.instanceNumber = this.dataset.getSingleValueOrDefault<number>(Tags.InstanceNumber, 0);
    this.sortingValue = this.normalDirection.dot(this.position.toVector());
    this.values = decodeFrame(this.pixelData, this.frame);
  }

  sampleAtImageSpace(column: number, row: number): number | null {
    if (column < 0 || row < 0 || column >= this.columns - 1 || row >= this.rows - 1) {
      return null;
    }

    const c0 = Math.floor(column);
    const r0 = Math.floor(row);
    const alphaC = column - c0;
    const alphaR = row - r0;

    const p00 = this.getPixel(c0, r0);
    const p01 = this.getPixel(c0, r0 + 1);
    const p10 = this.getPixel(c0 + 1, r0);
    const p11 = this.getPixel(c0 + 1, r0 + 1);
    return (1 - alphaC) * ((1 - alphaR) * p00 + alphaR * p01)
      + alphaC * ((1 - alphaR) * p10 + alphaR * p11);
  }

  getPixel(column: number, row: number): number {
    const idx = row * this.columns + column;
    return this.values[idx] ?? 0;
  }

  getCornerPoints(): [Point3D, Point3D, Point3D, Point3D] {
    const rowVec = this.rowDirection.scale((this.columns - 1) * this.pixelSpacingColumn);
    const colVec = this.columnDirection.scale((this.rows - 1) * this.pixelSpacingRow);
    const topLeft = this.position.clone();
    const topRight = topLeft.plus(rowVec);
    const bottomLeft = topLeft.plus(colVec);
    const bottomRight = bottomLeft.plus(rowVec);
    return [topLeft, topRight, bottomLeft, bottomRight];
  }

  transformPatientPointToImage(point: Point3D): { column: number; row: number } {
    const local = point.minusPoint(this.position);
    const column = local.dot(this.rowDirection) / this.pixelSpacingColumn;
    const row = local.dot(this.columnDirection) / this.pixelSpacingRow;
    return { column, row };
  }
}

function decodeFrame(pixelData: DicomPixelData, frame: number): Float64Array {
  const src = pixelData.getFrame(frame).data;
  const count = pixelData.rows * pixelData.columns;
  const out = new Float64Array(count);

  if (pixelData.bitsAllocated <= 8) {
    for (let i = 0; i < count && i < src.length; i++) {
      const value = src[i] ?? 0;
      out[i] = pixelData.pixelRepresentation === 1
        ? ((value << 24) >> 24)
        : value;
    }
    return out;
  }

  const view = new DataView(src.buffer, src.byteOffset, src.byteLength);
  for (let i = 0; i < count; i++) {
    const offset = i * 2;
    if (offset + 2 > src.length) break;
    out[i] = pixelData.pixelRepresentation === 1
      ? view.getInt16(offset, true)
      : view.getUint16(offset, true);
  }
  return out;
}
