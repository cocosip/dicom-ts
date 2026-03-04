interface NodePosition {
  level: number;
  index: number;
}

export interface Jpeg2000TagTreeBitReader {
  readBit(): number;
}

export interface Jpeg2000TagTreeBitWriter {
  writeBit(bit: number): void;
}

export class Jpeg2000TagTree {
  private readonly width: number;
  private readonly height: number;
  private readonly levels: number;
  private readonly levelWidths: number[];
  private readonly levelHeights: number[];
  private readonly nodes: number[][];
  private readonly states: number[][];
  private readonly low: number[][];
  private readonly known: boolean[][];

  constructor(width: number, height: number) {
    this.width = width > 0 ? Math.floor(width) : 1;
    this.height = height > 0 ? Math.floor(height) : 1;

    const levelWidths: number[] = [];
    const levelHeights: number[] = [];

    let currentWidth = this.width;
    let currentHeight = this.height;
    for (;;) {
      levelWidths.push(currentWidth);
      levelHeights.push(currentHeight);

      if (currentWidth === 1 && currentHeight === 1) {
        break;
      }

      currentWidth = Math.floor((currentWidth + 1) / 2);
      currentHeight = Math.floor((currentHeight + 1) / 2);
    }

    this.levels = levelWidths.length;
    this.levelWidths = levelWidths;
    this.levelHeights = levelHeights;

    this.nodes = new Array<number[]>(this.levels);
    this.states = new Array<number[]>(this.levels);
    this.low = new Array<number[]>(this.levels);
    this.known = new Array<boolean[]>(this.levels);

    for (let level = 0; level < this.levels; level++) {
      const size = this.levelWidths[level]! * this.levelHeights[level]!;
      this.nodes[level] = new Array<number>(size).fill(999);
      this.states[level] = new Array<number>(size).fill(0);
      this.low[level] = new Array<number>(size).fill(0);
      this.known[level] = new Array<boolean>(size).fill(false);
    }
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getNumLevels(): number {
    return this.levels;
  }

  getValue(x: number, y: number): number {
    if (!this.inBounds(x, y)) {
      return 0;
    }

    const index = y * this.width + x;
    return this.nodes[0]![index] ?? 0;
  }

  setValue(x: number, y: number, value: number): void {
    if (!this.inBounds(x, y)) {
      return;
    }

    let px = x;
    let py = y;
    for (let level = 0; level < this.levels; level++) {
      const index = py * this.levelWidths[level]! + px;
      const values = this.nodes[level]!;
      if (index < 0 || index >= values.length) {
        break;
      }

      if (values[index]! <= value) {
        break;
      }

      values[index] = value;

      if (level < this.levels - 1) {
        px = Math.floor(px / 2);
        py = Math.floor(py / 2);
      }
    }
  }

  reset(): void {
    for (let level = 0; level < this.levels; level++) {
      this.nodes[level]!.fill(999);
      this.states[level]!.fill(0);
      this.low[level]!.fill(0);
      this.known[level]!.fill(false);
    }
  }

  resetEncoding(): void {
    for (let level = 0; level < this.levels; level++) {
      this.nodes[level]!.fill(999);
      this.low[level]!.fill(0);
      this.known[level]!.fill(false);
    }
  }

  decode(reader: Jpeg2000TagTreeBitReader, x: number, y: number, threshold: number): number {
    if (!this.inBounds(x, y)) {
      throw new Error(
        `tag tree position out of bounds: (${x},${y}) not in [0,${this.width})x[0,${this.height})`,
      );
    }

    const stack = this.buildNodeStack(x, y);
    let low = 0;

    for (let i = stack.length - 1; i >= 0; i--) {
      const node = stack[i]!;
      const nodeLow = this.low[node.level]!;
      const nodeValues = this.nodes[node.level]!;

      if (low > nodeLow[node.index]!) {
        nodeLow[node.index] = low;
      } else {
        low = nodeLow[node.index]!;
      }

      while (low < threshold && low < nodeValues[node.index]!) {
        if (reader.readBit() !== 0) {
          nodeValues[node.index] = low;
        } else {
          low++;
        }
      }

      nodeLow[node.index] = low;
    }

    const leaf = stack[0]!;
    return this.nodes[leaf.level]![leaf.index]!;
  }

  encode(writer: Jpeg2000TagTreeBitWriter, x: number, y: number, threshold: number): void {
    if (!this.inBounds(x, y)) {
      throw new Error(
        `tag tree position out of bounds: (${x},${y}) not in [0,${this.width})x[0,${this.height})`,
      );
    }

    const stack = this.buildNodeStack(x, y);
    let low = 0;

    for (let i = stack.length - 1; i >= 0; i--) {
      const node = stack[i]!;
      const nodeLow = this.low[node.level]!;
      const nodeKnown = this.known[node.level]!;
      const nodeValues = this.nodes[node.level]!;

      if (low > nodeLow[node.index]!) {
        nodeLow[node.index] = low;
      } else {
        low = nodeLow[node.index]!;
      }

      while (low < threshold) {
        if (low >= nodeValues[node.index]!) {
          if (!nodeKnown[node.index]) {
            writer.writeBit(1);
            nodeKnown[node.index] = true;
          }
          break;
        }

        writer.writeBit(0);
        low++;
      }

      nodeLow[node.index] = low;
    }
  }

  decodeInclusion(
    x: number,
    y: number,
    currentLayer: number,
    readBit: () => number,
  ): { included: boolean; firstLayer: number } {
    const value = this.decode({ readBit }, x, y, currentLayer + 1);
    if (value > currentLayer) {
      return { included: false, firstLayer: -1 };
    }
    return { included: true, firstLayer: value };
  }

  decodeZeroBitplanes(x: number, y: number, readBit: () => number): number {
    return this.decode({ readBit }, x, y, 32);
  }

  private inBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  private buildNodeStack(x: number, y: number): NodePosition[] {
    const stack: NodePosition[] = new Array<NodePosition>(this.levels);

    let px = x;
    let py = y;
    for (let level = 0; level < this.levels; level++) {
      const index = py * this.levelWidths[level]! + px;
      stack[level] = { level, index };

      if (level < this.levels - 1) {
        px = Math.floor(px / 2);
        py = Math.floor(py / 2);
      }
    }

    return stack;
  }
}