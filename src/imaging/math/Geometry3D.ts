export const GEOMETRY_EPSILON = 1e-9;

/**
 * True when absolute value is smaller than the numeric tolerance.
 */
export function isNearlyZero(value: number, epsilon: number = GEOMETRY_EPSILON): boolean {
  return Math.abs(value) < epsilon;
}

export class Vector3D {
  static readonly ZERO = new Vector3D(0, 0, 0);
  static readonly EPSILON = new Vector3D(Number.EPSILON, Number.EPSILON, Number.EPSILON);
  static readonly MIN_VALUE = new Vector3D(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
  static readonly MAX_VALUE = new Vector3D(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
  static readonly AXIS_X = new Vector3D(1, 0, 0);
  static readonly AXIS_Y = new Vector3D(0, 1, 0);
  static readonly AXIS_Z = new Vector3D(0, 0, 1);

  x: number;
  y: number;
  z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  get isZero(): boolean {
    return isNearlyZero(this.x) && isNearlyZero(this.y) && isNearlyZero(this.z);
  }

  length(): number {
    return Math.sqrt(this.dot(this));
  }

  magnitude(): number {
    return this.length();
  }

  round(): Vector3D {
    return new Vector3D(Math.round(this.x), Math.round(this.y), Math.round(this.z));
  }

  normalize(): Vector3D {
    const magnitude = this.magnitude();
    if (isNearlyZero(magnitude)) return Vector3D.ZERO.clone();
    return this.divide(magnitude);
  }

  dot(other: Vector3D | Point3D): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  cross(other: Vector3D): Vector3D {
    return new Vector3D(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x,
    );
  }

  distance(other: Vector3D): number {
    return this.subtract(other).length();
  }

  isPerpendicular(other: Vector3D): boolean {
    return isNearlyZero(this.dot(other));
  }

  rotate(axis: Vector3D, angleRadians: number): Vector3D {
    const normalizedAxis = axis.normalize();
    const parallel = normalizedAxis.scale(this.dot(normalizedAxis));
    const perpendicular = this.subtract(parallel);
    const mutualPerpendicular = normalizedAxis.cross(perpendicular);
    const rotatedPerpendicular = perpendicular.scale(Math.cos(angleRadians))
      .add(mutualPerpendicular.scale(Math.sin(angleRadians)));
    return rotatedPerpendicular.add(parallel);
  }

  reflect(normal: Vector3D): Vector3D {
    const n = normal.normalize();
    const d = this.dot(n);
    return this.subtract(n.scale(2 * d));
  }

  nearestAxis(): Vector3D {
    const x = Math.abs(this.x);
    const y = Math.abs(this.y);
    const z = Math.abs(this.z);
    if (x >= y && x >= z) return new Vector3D(this.x >= 0 ? 1 : -1, 0, 0);
    if (y >= z) return new Vector3D(0, this.y >= 0 ? 1 : -1, 0);
    return new Vector3D(0, 0, this.z >= 0 ? 1 : -1);
  }

  add(other: Vector3D): Vector3D {
    return new Vector3D(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  subtract(other: Vector3D): Vector3D {
    return new Vector3D(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  scale(value: number): Vector3D {
    return new Vector3D(this.x * value, this.y * value, this.z * value);
  }

  divide(value: number): Vector3D {
    return new Vector3D(this.x / value, this.y / value, this.z / value);
  }

  negate(): Vector3D {
    return new Vector3D(-this.x, -this.y, -this.z);
  }

  clone(): Vector3D {
    return new Vector3D(this.x, this.y, this.z);
  }

  toPoint(): Point3D {
    return new Point3D(this.x, this.y, this.z);
  }

  toArray(): [number, number, number] {
    return [this.x, this.y, this.z];
  }

  equals(other: Vector3D | null | undefined): boolean {
    return !!other
      && isNearlyZero(this.x - other.x)
      && isNearlyZero(this.y - other.y)
      && isNearlyZero(this.z - other.z);
  }

  toString(): string {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }

  static max(a: Vector3D, b: Vector3D): Vector3D {
    return a.dot(a) >= b.dot(b) ? a.clone() : b.clone();
  }

  static min(a: Vector3D, b: Vector3D): Vector3D {
    return a.dot(a) <= b.dot(b) ? a.clone() : b.clone();
  }
}

export class Point3D {
  static readonly ZERO = new Point3D(0, 0, 0);

  x: number;
  y: number;
  z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  distance(other: Point3D): number {
    return this.minusPoint(other).length();
  }

  move(axis: Vector3D, distance: number): Point3D {
    return this.plus(axis.normalize().scale(distance));
  }

  plus(vector: Vector3D): Point3D {
    return new Point3D(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }

  minusPoint(other: Point3D): Vector3D {
    return new Vector3D(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  clone(): Point3D {
    return new Point3D(this.x, this.y, this.z);
  }

  toVector(): Vector3D {
    return new Vector3D(this.x, this.y, this.z);
  }

  toArray(): [number, number, number] {
    return [this.x, this.y, this.z];
  }

  equals(other: Point3D | null | undefined): boolean {
    return !!other
      && isNearlyZero(this.x - other.x)
      && isNearlyZero(this.y - other.y)
      && isNearlyZero(this.z - other.z);
  }

  toString(): string {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }
}

export class Line3D {
  point: Point3D;
  vector: Vector3D;

  constructor(point: Point3D = Point3D.ZERO, vector: Vector3D = Vector3D.ZERO) {
    this.point = point.clone();
    this.vector = vector.clone();
  }

  static fromPoints(a: Point3D, b: Point3D): Line3D {
    return new Line3D(a, b.minusPoint(a));
  }

  closestPoint(point: Point3D): Point3D {
    const denominator = this.vector.dot(this.vector);
    if (isNearlyZero(denominator)) return this.point.clone();
    const t = point.minusPoint(this.point).dot(this.vector) / denominator;
    return this.point.plus(this.vector.scale(t));
  }

  closestPoints(other: Line3D): { pointA: Point3D; pointB: Point3D } | null {
    const p1 = this.point.toVector();
    const p2 = other.point.toVector();
    const d1 = this.vector;
    const d2 = other.vector;

    const a = d1.dot(d1);
    const b = d1.dot(d2);
    const c = d2.dot(d2);
    const w0 = p1.subtract(p2);
    const d = d1.dot(w0);
    const e = d2.dot(w0);
    const denominator = a * c - b * b;
    if (isNearlyZero(denominator)) return null;

    const s = (b * e - c * d) / denominator;
    const t = (a * e - b * d) / denominator;
    return {
      pointA: this.point.plus(d1.scale(s)),
      pointB: other.point.plus(d2.scale(t)),
    };
  }
}

export class Segment3D {
  a: Point3D;
  b: Point3D;

  constructor(a: Point3D = Point3D.ZERO, b: Point3D = Point3D.ZERO) {
    this.a = a.clone();
    this.b = b.clone();
  }

  get length(): number {
    return this.a.distance(this.b);
  }

  get vector(): Vector3D {
    return this.b.minusPoint(this.a);
  }

  get normalVector(): Vector3D {
    return this.vector.normalize();
  }
}

export class Plane3D {
  normal: Vector3D;
  point: Point3D;

  constructor(normal: Vector3D, point: Point3D) {
    this.normal = normal.clone();
    this.point = point.clone();
  }

  static fromPoints(a: Point3D, b: Point3D, c: Point3D): Plane3D {
    const normal = b.minusPoint(a).cross(c.minusPoint(a)).normalize();
    return new Plane3D(normal, a);
  }

  get distance(): number {
    const normalized = this.normal.normalize();
    return Math.abs(normalized.dot(this.point.toVector()));
  }

  isParallelToLine(line: Line3D): boolean {
    return isNearlyZero(this.normal.dot(line.vector));
  }

  isParallelToPlane(plane: Plane3D): boolean {
    return this.normal.cross(plane.normal).isZero;
  }

  intersectLine(line: Line3D): Point3D | null {
    const denominator = this.normal.dot(line.vector);
    if (isNearlyZero(denominator)) return null;
    const numerator = this.normal.dot(this.point.minusPoint(line.point));
    const t = numerator / denominator;
    return line.point.plus(line.vector.scale(t));
  }

  intersectPlane(other: Plane3D): Line3D | null {
    const direction = this.normal.cross(other.normal);
    const denominator = direction.dot(direction);
    if (isNearlyZero(denominator)) return null;

    const d1 = this.normal.dot(this.point.toVector());
    const d2 = other.normal.dot(other.point.toVector());
    const term1 = other.normal.cross(direction).scale(d1);
    const term2 = direction.cross(this.normal).scale(d2);
    const point = term1.add(term2).divide(denominator).toPoint();
    return new Line3D(point, direction);
  }

  closestPoint(point: Point3D): Point3D {
    const normalMagnitude = this.normal.dot(this.normal);
    if (isNearlyZero(normalMagnitude)) return point.clone();
    const distanceAlongNormal = this.normal.dot(point.minusPoint(this.point)) / normalMagnitude;
    return point.toVector().subtract(this.normal.scale(distanceAlongNormal)).toPoint();
  }
}

export class Slice3D {
  readonly normal: Vector3D;
  readonly plane: Plane3D;
  readonly topLeft: Point3D;
  readonly topRight: Point3D;
  readonly bottomLeft: Point3D;
  readonly bottomRight: Point3D;
  readonly width: number;
  readonly height: number;
  private readonly right: Vector3D;
  private readonly down: Vector3D;

  constructor(normal: Vector3D, topLeft: Point3D, width: number, height: number) {
    this.normal = normal.normalize();
    this.topLeft = topLeft.clone();
    this.width = width;
    this.height = height;
    this.right = pickPerpendicular(this.normal).cross(this.normal).normalize();
    this.down = this.normal.cross(this.right).normalize();
    this.topRight = this.topLeft.plus(this.right.scale(width));
    this.bottomLeft = this.topLeft.plus(this.down.scale(height));
    this.bottomRight = this.bottomLeft.plus(this.right.scale(width));
    this.plane = new Plane3D(this.normal, this.topLeft);
  }

  project(point: Point3D): Point3D {
    return this.plane.closestPoint(point);
  }

  projectSegment(segment: Segment3D): Segment3D {
    return new Segment3D(this.project(segment.a), this.project(segment.b));
  }

  intersect(_other: Slice3D): Segment3D | null {
    return null;
  }
}

export class Orientation3D {
  private currentForward: Vector3D;
  private currentDown: Vector3D;

  constructor(forward: Vector3D = new Vector3D(1, 0, 0), down: Vector3D = new Vector3D(0, 0, 1)) {
    this.currentForward = forward.clone();
    this.currentDown = down.clone();
  }

  get forward(): Vector3D {
    return this.currentForward.clone();
  }

  get backward(): Vector3D {
    return this.currentForward.negate();
  }

  get right(): Vector3D {
    return this.currentDown.cross(this.currentForward);
  }

  get left(): Vector3D {
    return this.right.negate();
  }

  get up(): Vector3D {
    return this.currentDown.negate();
  }

  get down(): Vector3D {
    return this.currentDown.clone();
  }

  pitch(angleRadians: number): void {
    const right = this.right.normalize();
    this.currentForward = this.currentForward.rotate(right, angleRadians);
    this.currentDown = this.currentDown.rotate(right, angleRadians);
  }

  roll(angleRadians: number): void {
    this.currentDown = this.currentDown.rotate(this.currentForward.normalize(), angleRadians);
  }

  yaw(angleRadians: number): void {
    this.currentForward = this.currentForward.rotate(this.currentDown.normalize(), angleRadians);
  }
}

function pickPerpendicular(normal: Vector3D): Vector3D {
  const axis = Math.abs(normal.dot(Vector3D.AXIS_Z)) < 0.9 ? Vector3D.AXIS_Z : Vector3D.AXIS_Y;
  const candidate = axis.cross(normal).normalize();
  if (!candidate.isZero) return candidate;
  return Vector3D.AXIS_X;
}
