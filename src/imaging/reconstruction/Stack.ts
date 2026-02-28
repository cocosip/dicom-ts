import { Point3D, Vector3D } from "../math/Geometry3D.js";
import { Slice } from "./Slice.js";
import type { VolumeData } from "./VolumeData.js";

export enum StackType {
  Axial = 1,
  Coronal = 2,
  Sagittal = 3,
}

/**
 * Represents a reconstructed stack of slices taken from a volume.
 */
export class Stack {
  readonly slices: Slice[] = [];
  readonly sliceDistance: number;

  private readonly volume: VolumeData;

  constructor(volume: VolumeData, stackType: StackType, spacing: number, sliceDistance: number) {
    this.volume = volume;
    this.sliceDistance = sliceDistance;

    switch (stackType) {
      case StackType.Axial:
        this.calculateAxial(spacing, sliceDistance);
        break;
      case StackType.Coronal:
        this.calculateCoronal(spacing, sliceDistance);
        break;
      case StackType.Sagittal:
        this.calculateSagittal(spacing, sliceDistance);
        break;
    }
  }

  private calculateSagittal(spacing: number, sliceDistance: number): void {
    const volumeVector = this.volume.boundingMax.minusPoint(this.volume.boundingMin);
    let topLeft = new Point3D(this.volume.boundingMin.x, this.volume.boundingMin.y, this.volume.boundingMax.z);
    const perSlice = new Vector3D(sliceDistance, 0, 0);
    const sliceCount = Math.max(1, Math.floor(Math.abs(volumeVector.x) / sliceDistance) + 1);
    for (let i = 0; i < sliceCount; i++) {
      const rows = Math.max(1, Math.floor(Math.abs(volumeVector.z) / spacing));
      const cols = Math.max(1, Math.floor(Math.abs(volumeVector.y) / spacing));
      this.slices.push(new Slice(this.volume, topLeft, new Vector3D(0, 1, 0), new Vector3D(0, 0, -1), rows, cols, spacing));
      topLeft = topLeft.plus(perSlice);
    }
  }

  private calculateCoronal(spacing: number, sliceDistance: number): void {
    const volumeVector = this.volume.boundingMax.minusPoint(this.volume.boundingMin);
    let topLeft = new Point3D(this.volume.boundingMin.x, this.volume.boundingMin.y, this.volume.boundingMax.z);
    const perSlice = new Vector3D(0, sliceDistance, 0);
    const sliceCount = Math.max(1, Math.floor(Math.abs(volumeVector.y) / sliceDistance) + 1);
    for (let i = 0; i < sliceCount; i++) {
      const rows = Math.max(1, Math.floor(Math.abs(volumeVector.z) / spacing));
      const cols = Math.max(1, Math.floor(Math.abs(volumeVector.x) / spacing));
      this.slices.push(new Slice(this.volume, topLeft, new Vector3D(1, 0, 0), new Vector3D(0, 0, -1), rows, cols, spacing));
      topLeft = topLeft.plus(perSlice);
    }
  }

  private calculateAxial(spacing: number, sliceDistance: number): void {
    const volumeVector = this.volume.boundingMax.minusPoint(this.volume.boundingMin);
    let topLeft = new Point3D(this.volume.boundingMin.x, this.volume.boundingMin.y, this.volume.boundingMax.z);
    const perSlice = new Vector3D(0, 0, -sliceDistance);
    const sliceCount = Math.max(1, Math.floor(Math.abs(volumeVector.z) / sliceDistance) + 1);
    for (let i = 0; i < sliceCount; i++) {
      const rows = Math.max(1, Math.floor(Math.abs(volumeVector.y) / spacing));
      const cols = Math.max(1, Math.floor(Math.abs(volumeVector.x) / spacing));
      this.slices.push(new Slice(this.volume, topLeft, new Vector3D(1, 0, 0), new Vector3D(0, 1, 0), rows, cols, spacing));
      topLeft = topLeft.plus(perSlice);
    }
  }
}
