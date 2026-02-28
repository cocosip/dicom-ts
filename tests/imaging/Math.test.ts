import { describe, it, expect } from "vitest";
import { Point2 } from "../../src/imaging/math/Point2.js";
import { Point2D } from "../../src/imaging/math/Point2D.js";
import { RectF } from "../../src/imaging/math/RectF.js";
import { Histogram } from "../../src/imaging/math/Histogram.js";
import { Matrix } from "../../src/imaging/math/Matrix.js";
import { GeometryHelper } from "../../src/imaging/math/GeometryHelper.js";
import { Line3D, Plane3D, Point3D, Vector3D } from "../../src/imaging/math/Geometry3D.js";

describe("imaging math", () => {
  it("Point2 and Point2D basics", () => {
    const a = new Point2(3.9, -5.1);
    const b = new Point2(3, -5);
    expect(a.equals(b)).toBe(true);
    expect(a.compareTo(new Point2(4, -5))).toBe(-1);
    expect(a.toString()).toBe("(3,-5)");

    const p = new Point2D(2.49, 3.5);
    expect(p.round().equals(new Point2(2, 4))).toBe(true);
    expect(p.compareTo(new Point2D(2.49, 4))).toBe(-1);
  });

  it("RectF inflate matches expected behavior", () => {
    const rect0 = new RectF(0, 0, 100, 50);
    rect0.inflate(10, 20);
    expect(rect0.x).toBe(10 * -1);
    expect(rect0.y).toBe(20 * -1);
    expect(rect0.width).toBe(120);
    expect(rect0.height).toBe(90);

    const rect1 = new RectF(0, 0, 100, 50);
    rect1.inflate(-10, -30);
    expect(rect1.x).toBe(10);
    expect(rect1.y).toBe(25);
    expect(rect1.width).toBe(80);
    expect(rect1.height).toBe(0);
  });

  it("Histogram supports counting and windows", () => {
    const h = new Histogram(-2, 2);
    h.add(-2);
    h.add(-2);
    h.add(0);
    h.add(2);
    h.add(2);
    h.add(2);

    expect(h.count(-2)).toBe(2);
    expect(h.count(0)).toBe(1);
    expect(h.count(2)).toBe(3);
    expect(h.count(3)).toBe(0);

    h.applyWindow(-2, 0);
    expect(h.windowStart).toBe(-2);
    expect(h.windowEnd).toBe(0);
    expect(h.windowTotal).toBe(3);

    h.applyWindow(50);
    expect(h.windowTotal).toBeLessThanOrEqual(3);
  });

  it("Matrix supports arithmetic, determinant and inverse", () => {
    const a = Matrix.from2DArray([
      [1, 2],
      [3, 4],
    ]);
    const b = Matrix.from2DArray([
      [5, 6],
      [7, 8],
    ]);

    expect(a.add(b).to2DArray()).toEqual([
      [6, 8],
      [10, 12],
    ]);
    expect(a.multiply(b).to2DArray()).toEqual([
      [19, 22],
      [43, 50],
    ]);
    expect(a.determinant).toBe(-2);
    expect(a.trace).toBe(5);
    expect(a.multiplyVector([10, 20])).toEqual([50, 110]);

    const inv = a.invert();
    const id = a.multiply(inv);
    expect(id.isIdentity).toBe(true);
    expect(a.pow(2).to2DArray()).toEqual([
      [7, 10],
      [15, 22],
    ]);
  });

  it("3D geometry helpers return correct values", () => {
    const x = new Vector3D(1, 0, 0);
    const y = new Vector3D(0, 1, 0);
    const z = x.cross(y);
    expect(z.equals(new Vector3D(0, 0, 1))).toBe(true);

    const line = Line3D.fromPoints(new Point3D(0, 0, -1), new Point3D(0, 0, 1));
    const plane = new Plane3D(new Vector3D(0, 0, 1), new Point3D(0, 0, 0));
    const intersection = plane.intersectLine(line);
    expect(intersection?.equals(new Point3D(0, 0, 0))).toBe(true);
  });

  it("GeometryHelper computes bounding boxes", () => {
    const boxFromPoints = GeometryHelper.getBoundingBox([
      new Point3D(1, 2, 3),
      new Point3D(-1, 10, 0),
      new Point3D(5, -2, 8),
    ]);
    expect(boxFromPoints.min.equals(new Point3D(-1, -2, 0))).toBe(true);
    expect(boxFromPoints.max.equals(new Point3D(5, 10, 8))).toBe(true);

    const boxFromFrame = GeometryHelper.getBoundingBox({
      pointTopLeft: new Point3D(0, 0, 0),
      pointTopRight: new Point3D(10, 0, 0),
      pointBottomLeft: new Point3D(0, 5, 2),
      pointBottomRight: new Point3D(10, 5, 2),
    });
    expect(boxFromFrame.min.equals(new Point3D(0, 0, 0))).toBe(true);
    expect(boxFromFrame.max.equals(new Point3D(10, 5, 2))).toBe(true);
  });
});
