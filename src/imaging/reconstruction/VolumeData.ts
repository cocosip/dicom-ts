import * as Tags from "../../core/DicomTag.generated.js";
import { DicomDataset } from "../../dataset/DicomDataset.js";
import { cloneDataset } from "../../dataset/DicomDatasetExtensions.js";
import { DicomOverlayData } from "../DicomOverlayData.js";
import { GeometryHelper } from "../math/GeometryHelper.js";
import { Point3D, Vector3D } from "../math/Geometry3D.js";
import { ImageData } from "./ImageData.js";

export interface IntervalD {
  min: number;
  max: number;
}

export class VolumeData {
  readonly slices: ImageData[];
  readonly boundingMin: Point3D;
  readonly boundingMax: Point3D;
  readonly sliceSpaces: IntervalD;

  private readonly sortOrders: number[];
  private readonly slicesNormal: Vector3D;
  private commonDatasetCache: DicomDataset | null = null;

  constructor(dataset: DicomDataset);
  constructor(slices: Iterable<ImageData>);
  constructor(datasetOrSlices: DicomDataset | Iterable<ImageData>) {
    let slices: ImageData[];
    if (datasetOrSlices instanceof DicomDataset) {
      slices = constructSlicesFromMultiFrameDataset(datasetOrSlices);
    } else {
      slices = [...datasetOrSlices].filter((s): s is ImageData => !!s);
    }

    if (slices.length === 0) throw new Error("No valid slices available for reconstruction");

    const framesWithUid = slices.filter((s) => !!s.frameOfReferenceUID);
    const source = framesWithUid.length > 0 ? framesWithUid : slices;
    const uidSet = new Set(source.map((s) => s.frameOfReferenceUID));
    const selectedUid = uidSet.values().next().value ?? null;
    const selected = source.filter((s) => s.frameOfReferenceUID === selectedUid);
    this.slices = (selected.length > 0 ? selected : source)
      .slice()
      .sort((a, b) => a.sortingValue - b.sortingValue);

    this.sortOrders = this.slices.map((s) => s.sortingValue);
    this.slicesNormal = this.slices[0]?.normalDirection.clone() ?? new Vector3D(0, 0, 1);

    const corners = this.slices.flatMap((s) => s.getCornerPoints());
    const box = GeometryHelper.getBoundingBox(corners);
    this.boundingMin = box.min;
    this.boundingMax = box.max;

    const distances: number[] = [];
    for (let i = 1; i < this.sortOrders.length; i++) {
      distances.push((this.sortOrders[i] ?? 0) - (this.sortOrders[i - 1] ?? 0));
    }
    this.sliceSpaces = distances.length > 0
      ? { min: Math.min(...distances), max: Math.max(...distances) }
      : { min: 0, max: 0 };
  }

  get pixelSpacingInSource(): number {
    return this.slices[0]?.pixelSpacingColumn ?? 0;
  }

  get commonData(): DicomDataset {
    if (!this.commonDatasetCache) {
      this.commonDatasetCache = this.buildCommonData();
    }
    return this.commonDatasetCache;
  }

  getCut(
    topLeft: Point3D,
    rowDir: Vector3D,
    colDir: Vector3D,
    rows: number,
    cols: number,
    spacing: number,
  ): number[] {
    const output = new Array<number>(rows * cols).fill(0);
    const deltaX = rowDir.normalize().scale(spacing);
    const deltaY = colDir.normalize().scale(spacing);
    const orderedDeltaX = this.slicesNormal.dot(deltaX);
    const orderedDeltaY = this.slicesNormal.dot(deltaY);
    const orderedRowStart = this.slicesNormal.dot(topLeft.toVector());

    for (let x = 0; x < cols; x++) {
      let point = topLeft.plus(deltaX.scale(x));
      let ordered = orderedRowStart + x * orderedDeltaX;
      for (let y = 0; y < rows; y++) {
        const idx = this.sortingIndex(ordered);
        if (idx > 0) {
          const nextSlice = this.slices[idx]!;
          const prevSlice = this.slices[idx - 1]!;

          const nextSpace = nextSlice.transformPatientPointToImage(point);
          const prevSpace = prevSlice.transformPatientPointToImage(point);
          const nextPixel = nextSlice.sampleAtImageSpace(nextSpace.column, nextSpace.row);
          const prevPixel = prevSlice.sampleAtImageSpace(prevSpace.column, prevSpace.row);

          if (nextPixel != null && prevPixel != null) {
            const nextOrder = nextSlice.sortingValue;
            const prevOrder = prevSlice.sortingValue;
            const denom = nextOrder - prevOrder;
            const value = Math.abs(denom) < 1e-12
              ? nextPixel
              : (prevPixel * (nextOrder - ordered) + nextPixel * (ordered - prevOrder)) / denom;
            output[x + y * cols] = value;
          }
        }
        point = point.plus(deltaY);
        ordered += orderedDeltaY;
      }
    }

    return output;
  }

  private sortingIndex(value: number): number {
    let low = 0;
    let high = this.sortOrders.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      const current = this.sortOrders[mid] ?? 0;
      if (current < value) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return low < this.sortOrders.length ? low : -1;
  }

  private buildCommonData(): DicomDataset {
    const common = new DicomDataset().clear();
    if (this.slices.length === 0) return common;

    const first = this.slices[0]!.dataset;
    const datasets = this.slices.map((s) => s.dataset);
    common.validateItems = false;
    for (const item of first) {
      if (item.tag.equals(Tags.PixelData)) continue;
      if (DicomOverlayData.isOverlaySequence(item)) continue;
      const presentInAll = datasets.every((d) => {
        const other = d.getDicomItem(item.tag);
        return !!other && other.toString() === item.toString();
      });
      if (presentInAll) common.addOrUpdate(item);
    }
    common.validateItems = true;
    return common;
  }
}

function constructSlicesFromMultiFrameDataset(dataset: DicomDataset): ImageData[] {
  const numberOfFramesRaw = dataset.tryGetValue<string>(Tags.NumberOfFrames);
  const numberOfFrames = numberOfFramesRaw ? parseInt(numberOfFramesRaw, 10) : 0;
  if (!Number.isFinite(numberOfFrames) || numberOfFrames <= 1) {
    throw new Error("Given dataset must contain multiple frames");
  }

  const working = cloneDataset(dataset);
  const first = new ImageData(working, 0);
  const normalizedDataset = first.dataset;
  const pixelData = first.pixelData;
  const slices: ImageData[] = [first];
  for (let frame = 1; frame < numberOfFrames; frame++) {
    slices.push(new ImageData(normalizedDataset, pixelData, frame));
  }
  return slices;
}
