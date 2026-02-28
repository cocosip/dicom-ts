const DEFAULT_TOLERANCE = 1e-12;

/**
 * Numeric matrix for linear algebra operations.
 */
export class Matrix {
  readonly rows: number;
  readonly columns: number;
  private readonly data: Float64Array;

  constructor(rows: number, columns: number, values?: Iterable<number>) {
    if (!Number.isInteger(rows) || rows <= 0) {
      throw new RangeError("rows must be a positive integer.");
    }
    if (!Number.isInteger(columns) || columns <= 0) {
      throw new RangeError("columns must be a positive integer.");
    }
    this.rows = rows;
    this.columns = columns;
    this.data = new Float64Array(rows * columns);

    if (values) {
      let i = 0;
      for (const value of values) {
        if (i >= this.data.length) {
          throw new RangeError("Too many values for matrix dimensions.");
        }
        this.data[i++] = value;
      }
      if (i !== this.data.length) {
        throw new RangeError("Not enough values for matrix dimensions.");
      }
    }
  }

  static from2DArray(values: ReadonlyArray<ReadonlyArray<number>>): Matrix {
    if (values.length === 0) {
      throw new RangeError("Matrix must have at least one row.");
    }
    const columns = values[0]?.length ?? 0;
    if (columns === 0) {
      throw new RangeError("Matrix must have at least one column.");
    }
    const flat: number[] = [];
    for (const row of values) {
      if (row.length !== columns) {
        throw new RangeError("All rows must have the same length.");
      }
      flat.push(...row);
    }
    return new Matrix(values.length, columns, flat);
  }

  static zero(rows: number, columns: number): Matrix {
    return new Matrix(rows, columns);
  }

  static one(rows: number, columns: number): Matrix {
    const matrix = new Matrix(rows, columns);
    matrix.data.fill(1);
    return matrix;
  }

  static identity(dimensions: number): Matrix {
    const matrix = new Matrix(dimensions, dimensions);
    for (let i = 0; i < dimensions; i++) {
      matrix.set(i, i, 1);
    }
    return matrix;
  }

  get isSquare(): boolean {
    return this.rows === this.columns;
  }

  get isIdentity(): boolean {
    if (!this.isSquare) return false;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        const expected = r === c ? 1 : 0;
        if (Math.abs(this.get(r, c) - expected) > DEFAULT_TOLERANCE) return false;
      }
    }
    return true;
  }

  get determinant(): number {
    if (!this.isSquare) {
      throw new Error("Cannot calculate determinant of non-square matrix.");
    }

    const n = this.rows;
    if (n === 1) return this.get(0, 0);

    const work = this.to2DArray();
    let sign = 1;
    let determinant = 1;

    for (let col = 0; col < n; col++) {
      let pivot = col;
      const pivotRowData = work[col]!;
      let maxAbs = Math.abs(pivotRowData[col] ?? 0);
      for (let row = col + 1; row < n; row++) {
        const abs = Math.abs((work[row]!)[col] ?? 0);
        if (abs > maxAbs) {
          maxAbs = abs;
          pivot = row;
        }
      }

      if (maxAbs <= DEFAULT_TOLERANCE) return 0;

      if (pivot !== col) {
        const tmp = work[pivot];
        work[pivot] = work[col]!;
        work[col] = tmp!;
        sign *= -1;
      }

      const pivotRow = work[col]!;
      const pivotValue = pivotRow[col] ?? 0;
      determinant *= pivotValue;

      for (let row = col + 1; row < n; row++) {
        const rowData = work[row]!;
        const factor = (rowData[col] ?? 0) / pivotValue;
        if (Math.abs(factor) <= DEFAULT_TOLERANCE) continue;
        for (let c = col + 1; c < n; c++) {
          const current = rowData[c] ?? 0;
          const pivotRowValue = pivotRow[c] ?? 0;
          rowData[c] = current - factor * pivotRowValue;
        }
      }
    }

    return determinant * sign;
  }

  get trace(): number {
    if (!this.isSquare) {
      throw new Error("Cannot calculate trace of non-square matrix.");
    }
    let sum = 0;
    for (let i = 0; i < this.rows; i++) {
      sum += this.get(i, i);
    }
    return sum;
  }

  get(row: number, col: number): number {
    return this.data[this.indexOf(row, col)] ?? 0;
  }

  set(row: number, col: number, value: number): void {
    this.data[this.indexOf(row, col)] = value;
  }

  setRow(row: number, values: ReadonlyArray<number>): void {
    this.assertRow(row);
    if (values.length !== this.columns) {
      throw new RangeError("values length must equal matrix columns.");
    }
    for (let col = 0; col < this.columns; col++) {
      this.set(row, col, values[col] ?? 0);
    }
  }

  row(row: number): number[] {
    this.assertRow(row);
    const values: number[] = [];
    for (let col = 0; col < this.columns; col++) {
      values.push(this.get(row, col));
    }
    return values;
  }

  setColumn(col: number, values: ReadonlyArray<number>): void {
    this.assertColumn(col);
    if (values.length !== this.rows) {
      throw new RangeError("values length must equal matrix rows.");
    }
    for (let row = 0; row < this.rows; row++) {
      this.set(row, col, values[row] ?? 0);
    }
  }

  column(col: number): number[] {
    this.assertColumn(col);
    const values: number[] = [];
    for (let row = 0; row < this.rows; row++) {
      values.push(this.get(row, col));
    }
    return values;
  }

  clone(): Matrix {
    return new Matrix(this.rows, this.columns, this.data);
  }

  transpose(): Matrix {
    const transposed = new Matrix(this.columns, this.rows);
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        transposed.set(col, row, this.get(row, col));
      }
    }
    return transposed;
  }

  add(other: Matrix): Matrix {
    this.assertSameSize(other, "add");
    const out = new Matrix(this.rows, this.columns);
    for (let i = 0; i < this.data.length; i++) {
      out.data[i] = (this.data[i] ?? 0) + (other.data[i] ?? 0);
    }
    return out;
  }

  subtract(other: Matrix): Matrix {
    this.assertSameSize(other, "subtract");
    const out = new Matrix(this.rows, this.columns);
    for (let i = 0; i < this.data.length; i++) {
      out.data[i] = (this.data[i] ?? 0) - (other.data[i] ?? 0);
    }
    return out;
  }

  negate(): Matrix {
    return this.scale(-1);
  }

  multiply(other: Matrix): Matrix {
    if (this.columns !== other.rows) {
      throw new RangeError("Unable to multiply matrices of different inner dimensions.");
    }
    const out = new Matrix(this.rows, other.columns);
    for (let row = 0; row < out.rows; row++) {
      for (let col = 0; col < out.columns; col++) {
        let sum = 0;
        for (let i = 0; i < this.columns; i++) {
          sum += this.get(row, i) * other.get(i, col);
        }
        out.set(row, col, sum);
      }
    }
    return out;
  }

  multiplyVector(vector: ReadonlyArray<number>): number[] {
    if (this.columns !== vector.length) {
      throw new RangeError("Unable to multiply matrix and vector of different inner dimensions.");
    }
    const out: number[] = new Array<number>(this.rows);
    for (let row = 0; row < this.rows; row++) {
      let sum = 0;
      for (let col = 0; col < this.columns; col++) {
        sum += this.get(row, col) * (vector[col] ?? 0);
      }
      out[row] = sum;
    }
    return out;
  }

  scale(value: number): Matrix {
    const out = new Matrix(this.rows, this.columns);
    for (let i = 0; i < this.data.length; i++) {
      out.data[i] = (this.data[i] ?? 0) * value;
    }
    return out;
  }

  divide(value: number): Matrix {
    if (Math.abs(value) <= DEFAULT_TOLERANCE) {
      throw new RangeError("Cannot divide matrix by 0.");
    }
    return this.scale(1 / value);
  }

  pow(exponent: number): Matrix {
    if (!this.isSquare) {
      throw new Error("Matrix exponentiation requires a square matrix.");
    }
    if (!Number.isInteger(exponent) || exponent < 0) {
      throw new RangeError("Matrix exponent must be a non-negative integer.");
    }
    if (exponent === 0) return Matrix.identity(this.rows);
    if (exponent === 1) return this.clone();

    let base = this.clone();
    let exp = exponent;
    let result = Matrix.identity(this.rows);
    while (exp > 0) {
      if ((exp & 1) === 1) {
        result = result.multiply(base);
      }
      exp >>= 1;
      if (exp > 0) {
        base = base.multiply(base);
      }
    }
    return result;
  }

  invert(): Matrix {
    if (!this.isSquare) {
      throw new Error("Unable to invert non-square matrix.");
    }

    const n = this.rows;
    const work: number[][] = new Array<number[]>(n);
    for (let row = 0; row < n; row++) {
      const line = new Array<number>(2 * n).fill(0);
      for (let col = 0; col < n; col++) {
        line[col] = this.get(row, col);
      }
      line[n + row] = 1;
      work[row] = line;
    }

    for (let col = 0; col < n; col++) {
      let pivot = col;
      const pivotRowData = work[col]!;
      let maxAbs = Math.abs(pivotRowData[col] ?? 0);
      for (let row = col + 1; row < n; row++) {
        const abs = Math.abs((work[row]!)[col] ?? 0);
        if (abs > maxAbs) {
          maxAbs = abs;
          pivot = row;
        }
      }

      if (maxAbs <= DEFAULT_TOLERANCE) {
        throw new Error("Unable to invert matrix where determinant equals 0.");
      }

      if (pivot !== col) {
        const tmp = work[pivot];
        work[pivot] = work[col]!;
        work[col] = tmp!;
      }

      const pivotValue = work[col]![col] ?? 0;
      const pivotRow = work[col]!;
      for (let c = 0; c < 2 * n; c++) {
        const current = pivotRow[c] ?? 0;
        pivotRow[c] = current / pivotValue;
      }

      for (let row = 0; row < n; row++) {
        if (row === col) continue;
        const rowData = work[row]!;
        const factor = rowData[col] ?? 0;
        if (Math.abs(factor) <= DEFAULT_TOLERANCE) continue;
        for (let c = 0; c < 2 * n; c++) {
          const current = rowData[c] ?? 0;
          const pivotCurrent = pivotRow[c] ?? 0;
          rowData[c] = current - factor * pivotCurrent;
        }
      }
    }

    const out = new Matrix(n, n);
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        out.set(row, col, work[row]?.[n + col] ?? 0);
      }
    }
    return out;
  }

  equals(other: Matrix, tolerance: number = DEFAULT_TOLERANCE): boolean {
    if (this.rows !== other.rows || this.columns !== other.columns) return false;
    for (let i = 0; i < this.data.length; i++) {
      if (Math.abs((this.data[i] ?? 0) - (other.data[i] ?? 0)) > tolerance) return false;
    }
    return true;
  }

  to2DArray(): number[][] {
    const values: number[][] = new Array<number[]>(this.rows);
    for (let row = 0; row < this.rows; row++) {
      const line: number[] = new Array<number>(this.columns);
      for (let col = 0; col < this.columns; col++) {
        line[col] = this.get(row, col);
      }
      values[row] = line;
    }
    return values;
  }

  toString(): string {
    const rows: string[] = [];
    for (let row = 0; row < this.rows; row++) {
      rows.push(this.row(row).join(","));
    }
    return `[${rows.join("; ")}]`;
  }

  private indexOf(row: number, col: number): number {
    this.assertRow(row);
    this.assertColumn(col);
    return row * this.columns + col;
  }

  private assertRow(row: number): void {
    if (!Number.isInteger(row) || row < 0 || row >= this.rows) {
      throw new RangeError("Row index out of range.");
    }
  }

  private assertColumn(col: number): void {
    if (!Number.isInteger(col) || col < 0 || col >= this.columns) {
      throw new RangeError("Column index out of range.");
    }
  }

  private assertSameSize(other: Matrix, operation: string): void {
    if (this.rows !== other.rows || this.columns !== other.columns) {
      throw new RangeError(`Unable to ${operation} matrices of different dimensions.`);
    }
  }
}
