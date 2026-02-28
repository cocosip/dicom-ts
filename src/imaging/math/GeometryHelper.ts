import { Point3D } from "./Geometry3D.js";

export interface BoundingBox3D {
  min: Point3D;
  max: Point3D;
}

export interface FrameGeometryLike {
  pointTopLeft?: Point3D;
  pointTopRight?: Point3D;
  pointBottomLeft?: Point3D;
  pointBottomRight?: Point3D;
  PointTopLeft?: Point3D;
  PointTopRight?: Point3D;
  PointBottomLeft?: Point3D;
  PointBottomRight?: Point3D;
}

/**
 * Geometry helper utilities.
 */
export class GeometryHelper {
  static min(...values: number[]): number {
    if (values.length === 0) {
      throw new RangeError("GeometryHelper.min requires at least one value.");
    }
    return Math.min(...values);
  }

  static getBoundingBox(geometry: FrameGeometryLike): BoundingBox3D;
  static getBoundingBox(points: Iterable<Point3D>): BoundingBox3D;
  static getBoundingBox(value: FrameGeometryLike | Iterable<Point3D>): BoundingBox3D {
    if (isFrameGeometryLike(value)) {
      const corners = getFrameCorners(value);
      return this.getBoundingBox(corners);
    }

    const iterator = value[Symbol.iterator]();
    const first = iterator.next();
    if (first.done || !first.value) {
      throw new RangeError("At least one point is required to compute a bounding box.");
    }

    let minX = first.value.x;
    let minY = first.value.y;
    let minZ = first.value.z;
    let maxX = first.value.x;
    let maxY = first.value.y;
    let maxZ = first.value.z;

    for (let next = iterator.next(); !next.done; next = iterator.next()) {
      const point = next.value;
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      minZ = Math.min(minZ, point.z);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
      maxZ = Math.max(maxZ, point.z);
    }

    return {
      min: new Point3D(minX, minY, minZ),
      max: new Point3D(maxX, maxY, maxZ),
    };
  }
}

function isFrameGeometryLike(value: FrameGeometryLike | Iterable<Point3D>): value is FrameGeometryLike {
  return !isIterable(value);
}

function isIterable(value: unknown): value is Iterable<unknown> {
  return !!value && typeof (value as { [Symbol.iterator]?: unknown })[Symbol.iterator] === "function";
}

function getFrameCorners(geometry: FrameGeometryLike): Point3D[] {
  const topLeft = geometry.pointTopLeft ?? geometry.PointTopLeft;
  const topRight = geometry.pointTopRight ?? geometry.PointTopRight;
  const bottomLeft = geometry.pointBottomLeft ?? geometry.PointBottomLeft;
  const bottomRight = geometry.pointBottomRight ?? geometry.PointBottomRight;
  if (!topLeft || !topRight || !bottomLeft || !bottomRight) {
    throw new RangeError("Frame geometry must provide all four corners.");
  }
  return [topLeft, topRight, bottomLeft, bottomRight];
}
