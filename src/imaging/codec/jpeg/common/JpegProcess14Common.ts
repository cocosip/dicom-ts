import { DicomTransferSyntax } from "../../../../core/DicomTransferSyntax.js";
import { MemoryByteBuffer } from "../../../../io/buffer/MemoryByteBuffer.js";
import type { IDicomCodec } from "../../IDicomCodec.js";
import type { DicomPixelData } from "../../../DicomPixelData.js";
import type { IByteBuffer } from "../../../../io/buffer/IByteBuffer.js";

/**
 * JPEG Lossless Process 14 decoder.
 *
 * Supported transfer syntaxes:
 * - 1.2.840.10008.1.2.4.57 (JPEG Lossless Process 14)
 * - 1.2.840.10008.1.2.4.70 (JPEG Lossless Process 14 SV1)
 */
export class JpegProcess14CodecCore implements IDicomCodec {
  readonly transferSyntax: DicomTransferSyntax;

  constructor(transferSyntax: DicomTransferSyntax = DicomTransferSyntax.JPEGProcess14) {
    if (
      transferSyntax.uid.uid !== DicomTransferSyntax.JPEGProcess14.uid.uid
      && transferSyntax.uid.uid !== DicomTransferSyntax.JPEGProcess14SV1.uid.uid
    ) {
      throw new Error(
        `JpegProcess14CodecCore only supports ${DicomTransferSyntax.JPEGProcess14.uid.uid} and ${DicomTransferSyntax.JPEGProcess14SV1.uid.uid}, got ${transferSyntax.uid.uid}`,
      );
    }
    this.transferSyntax = transferSyntax;
  }

  decode(pixelData: DicomPixelData, frame: number): IByteBuffer {
    const prefix = this.errorPrefix(pixelData, frame);
    const encoded = pixelData.getFrame(frame).data;
    const decoder = new JpegLosslessDecoderImpl(encoded);
    const decoded = decoder.decode();

    if (
      this.transferSyntax.uid.uid === DicomTransferSyntax.JPEGProcess14SV1.uid.uid
      && decoder.selection !== 1
    ) {
      throw new Error(`${prefix} SV1 requires predictor selection value 1, got ${decoder.selection}`);
    }

    if (decoder.numComponents !== pixelData.samplesPerPixel) {
      throw new Error(
        `${prefix} component mismatch (JPEG=${decoder.numComponents}, DICOM=${pixelData.samplesPerPixel})`,
      );
    }

    const raw = toNativeFrame(decoded, decoder, prefix);
    const expectedSize = expectedFrameSize(pixelData, prefix);
    if (raw.length !== expectedSize) {
      throw new Error(`${prefix} decoded frame size mismatch (expected ${expectedSize}, got ${raw.length})`);
    }
    return new MemoryByteBuffer(raw);
  }

  private errorPrefix(pixelData: DicomPixelData, frame: number): string {
    return `[JPEG Lossless uid=${this.transferSyntax.uid.uid} frame=${frame} bitsStored=${pixelData.bitsStored}]`;
  }
}

interface IJpegDataStream {
  get8(): number;
  get16(): number;
}

class JpegLosslessDecoderImpl implements IJpegDataStream {
  private static readonly IDCT_P = [
    0, 5, 40, 16, 45, 2, 7, 42, 21, 56, 8, 61, 18, 47, 1, 4, 41, 23, 58, 13, 32,
    24, 37, 10, 63, 17, 44, 3, 6, 43, 20, 57, 15, 34, 29, 48, 53, 26, 39, 9, 60,
    19, 46, 22, 59, 12, 33, 31, 50, 55, 25, 36, 11, 62, 14, 35, 28, 49, 52, 27,
    38, 30, 51, 54,
  ];

  private static readonly TABLE = [
    0, 1, 5, 6, 14, 15, 27, 28, 2, 4, 7, 13, 16, 26, 29, 42, 3, 8, 12, 17, 25, 30,
    41, 43, 9, 11, 18, 24, 31, 40, 44, 53, 10, 19, 23, 32, 39, 45, 52, 54, 20, 22,
    33, 38, 46, 51, 55, 60, 21, 34, 37, 47, 50, 56, 59, 61, 35, 36, 48, 49, 57, 58,
    62, 63,
  ];

  private static readonly RESTART_MARKER_BEGIN = 0xffd0;
  private static readonly RESTART_MARKER_END = 0xffd7;
  private static readonly MAX_HUFFMAN_SUBTREE = 50;
  private static readonly MSB = 0x80000000 | 0;

  private readonly data: Uint8Array;
  private offset = 0;
  private readonly frame = new FrameHeader();
  private readonly scan = new ScanHeader();
  private readonly quantTable = new QuantizationTable();
  private readonly huffmanTable = new HuffmanTable();
  private readonly huffTab = createHuffmanTab(4, 2, JpegLosslessDecoderImpl.MAX_HUFFMAN_SUBTREE * 256);
  private readonly idctSource = new Array<number>(64).fill(0);
  private readonly nBlock = new Array<number>(10).fill(0);
  private readonly acTab = new Array<number[] | null>(10).fill(null);
  private readonly dcTab = new Array<number[] | null>(10).fill(null);
  private readonly qTab = new Array<number[] | null>(10).fill(null);

  private restarting = false;
  private marker = 0;
  private markerIndex = 0;
  private restartInterval = 0;
  private xDim = 0;
  private yDim = 0;
  private xLoc = 0;
  private yLoc = 0;
  private mask = 0;
  private outputData: number[] | null = null;
  private outputRedData: number[] | null = null;
  private outputGreenData: number[] | null = null;
  private outputBlueData: number[] | null = null;

  numComponents = 0;
  selection = 1;

  get precision(): number {
    return this.frame.precision;
  }

  get dimX(): number {
    return this.frame.dimX;
  }

  get dimY(): number {
    return this.frame.dimY;
  }

  constructor(data: Uint8Array) {
    this.data = data;
  }

  decode(): number[][] {
    let current = this.get16();
    let scanNum = 0;
    const pred = new Array<number>(10).fill(0);
    this.xLoc = 0;
    this.yLoc = 0;

    if (current !== 0xffd8) {
      throw new Error("Not a JPEG file");
    }

    current = this.get16();
    while (((current >> 4) !== 0x0ffc) || current === 0xffc4) {
      this.readSegment(current);
      current = this.get16();
    }

    if (current < 0xffc0 || current > 0xffc7) {
      throw new Error("Arithmetic JPEG coding is not supported");
    }

    this.frame.read(this);
    current = this.get16();
    let outputRef: number[][] = [];

    do {
      while (current !== 0xffda) {
        this.readSegment(current);
        current = this.get16();
      }

      const precision = this.frame.precision;
      this.mask = precision === 8 ? 0xff : 0xffff;
      this.scan.read(this);
      this.numComponents = this.scan.numComponents;
      this.selection = this.scan.selection;

      for (let i = 0; i < this.numComponents; i++) {
        const scanComp = this.scan.components[i]!;
        const compN = scanComp.scanCompSel;
        const comp = this.frame.components[compN];
        if (!comp) {
          throw new Error(`Missing JPEG frame component ${compN}`);
        }
        this.qTab[i] = this.quantTable.quantTables[comp.quantTableSel]!;
        this.nBlock[i] = comp.vSamp * comp.hSamp;
        this.dcTab[i] = this.huffTab[scanComp.dcTabSel]?.[0] ?? null;
        this.acTab[i] = this.huffTab[scanComp.acTabSel]?.[1] ?? null;
        if (!this.qTab[i] || !this.dcTab[i] || !this.acTab[i]) {
          throw new Error(`Missing JPEG Huffman/quantization table for component ${compN}`);
        }
      }

      this.xDim = this.frame.dimX;
      this.yDim = this.frame.dimY;
      outputRef = new Array<number[]>(this.numComponents);

      if (this.numComponents === 1) {
        this.outputData = new Array<number>(this.xDim * this.yDim).fill(0);
        outputRef[0] = this.outputData;
      } else if (this.numComponents === 3) {
        this.outputRedData = new Array<number>(this.xDim * this.yDim).fill(0);
        this.outputGreenData = new Array<number>(this.xDim * this.yDim).fill(0);
        this.outputBlueData = new Array<number>(this.xDim * this.yDim).fill(0);
        outputRef[0] = this.outputRedData;
        outputRef[1] = this.outputGreenData;
        outputRef[2] = this.outputBlueData;
      } else {
        throw new Error(`Unsupported JPEG Lossless component count: ${this.numComponents}`);
      }

      scanNum++;

      while (true) {
        const temp: IntRef = { value: 0 };
        const index: IntRef = { value: 0 };
        for (let i = 0; i < 10; i++) {
          pred[i] = 1 << (precision - 1);
        }

        if (this.restartInterval === 0) {
          current = this.decodeScan(pred, temp, index);
          while (current === 0 && this.xLoc < this.xDim && this.yLoc < this.yDim) {
            this.output(pred);
            current = this.decodeScan(pred, temp, index);
          }
          break;
        }

        for (let mcuNum = 0; mcuNum < this.restartInterval; mcuNum++) {
          this.restarting = (mcuNum === 0);
          current = this.decodeScan(pred, temp, index);
          this.output(pred);
          if (current !== 0) {
            break;
          }
        }

        if (current === 0) {
          if (this.markerIndex !== 0) {
            current = 0xff00 | this.marker;
            this.markerIndex = 0;
          } else {
            current = this.get16();
          }
        }

        if (
          current < JpegLosslessDecoderImpl.RESTART_MARKER_BEGIN
          || current > JpegLosslessDecoderImpl.RESTART_MARKER_END
        ) {
          break;
        }
      }

      if (current === 0xffdc && scanNum === 1) {
        this.readNumber();
        current = this.get16();
      }
    } while (
      current !== 0xffd9
      && this.xLoc < this.xDim
      && this.yLoc < this.yDim
      && scanNum === 0
    );

    return outputRef;
  }

  get8(): number {
    if (this.offset >= this.data.length) {
      throw new Error("Unexpected end of JPEG stream");
    }
    return this.data[this.offset++]!;
  }

  get16(): number {
    const hi = this.get8();
    const lo = this.get8();
    return (hi << 8) | lo;
  }

  private readSegment(marker: number): void {
    switch (marker) {
      case 0xffc4:
        this.huffmanTable.read(this, this.huffTab);
        return;
      case 0xffcc:
        throw new Error("Arithmetic JPEG coding is not supported");
      case 0xffdb:
        this.quantTable.read(this, JpegLosslessDecoderImpl.TABLE);
        return;
      case 0xffdd:
        this.restartInterval = this.readNumber();
        return;
      case 0xffe0:
      case 0xffe1:
      case 0xffe2:
      case 0xffe3:
      case 0xffe4:
      case 0xffe5:
      case 0xffe6:
      case 0xffe7:
      case 0xffe8:
      case 0xffe9:
      case 0xffea:
      case 0xffeb:
      case 0xffec:
      case 0xffed:
      case 0xffee:
      case 0xffef:
        this.readApp();
        return;
      case 0xfffe:
        this.readComment();
        return;
      default:
        if ((marker >> 8) !== 0xff) {
          throw new Error(`Invalid JPEG marker: 0x${marker.toString(16)}`);
        }
    }
  }

  private decodeScan(prev: number[], temp: IntRef, index: IntRef): number {
    if (this.numComponents === 1) return this.decodeSingle(prev, temp, index);
    if (this.numComponents === 3) return this.decodeRgb(prev, temp, index);
    return -1;
  }

  private decodeSingle(prev: number[], temp: IntRef, index: IntRef): number {
    if (!this.outputData) throw new Error("Internal decoder state is not initialized");

    if (this.restarting) {
      this.restarting = false;
      prev[0] = 1 << (this.frame.precision - 1);
    } else {
      switch (this.selection) {
        case 2:
          prev[0] = this.getPreviousY(this.outputData);
          break;
        case 3:
          prev[0] = this.getPreviousXY(this.outputData);
          break;
        case 4:
          prev[0] = this.getPreviousX(this.outputData) + this.getPreviousY(this.outputData) - this.getPreviousXY(this.outputData);
          break;
        case 5:
          prev[0] = this.getPreviousX(this.outputData) + ((this.getPreviousY(this.outputData) - this.getPreviousXY(this.outputData)) >> 1);
          break;
        case 6:
          prev[0] = this.getPreviousY(this.outputData) + ((this.getPreviousX(this.outputData) - this.getPreviousXY(this.outputData)) >> 1);
          break;
        case 7:
          prev[0] = Math.trunc((this.getPreviousX(this.outputData) + this.getPreviousY(this.outputData)) / 2);
          break;
        default:
          prev[0] = this.getPreviousX(this.outputData);
          break;
      }
    }

    const dc = this.dcTab[0];
    if (!dc) throw new Error("Missing JPEG DC table");
    for (let i = 0; i < this.nBlock[0]!; i++) {
      const value = this.getHuffmanValue(dc, temp, index);
      if (value >= 0xff00) return value;
      const n = this.getN(prev[0] ?? 0, value, temp, index);
      const restartMarker = n >> 8;
      if (
        restartMarker >= JpegLosslessDecoderImpl.RESTART_MARKER_BEGIN
        && restartMarker <= JpegLosslessDecoderImpl.RESTART_MARKER_END
      ) {
        return restartMarker;
      }
      prev[0] += n;
    }
    return 0;
  }

  private decodeRgb(prev: number[], temp: IntRef, index: IntRef): number {
    if (!this.outputRedData || !this.outputGreenData || !this.outputBlueData) {
      throw new Error("Internal decoder state is not initialized");
    }

    switch (this.selection) {
      case 2:
        prev[0] = this.getPreviousY(this.outputRedData);
        prev[1] = this.getPreviousY(this.outputGreenData);
        prev[2] = this.getPreviousY(this.outputBlueData);
        break;
      case 3:
        prev[0] = this.getPreviousXY(this.outputRedData);
        prev[1] = this.getPreviousXY(this.outputGreenData);
        prev[2] = this.getPreviousXY(this.outputBlueData);
        break;
      case 4:
        prev[0] = this.getPreviousX(this.outputRedData) + this.getPreviousY(this.outputRedData) - this.getPreviousXY(this.outputRedData);
        prev[1] = this.getPreviousX(this.outputGreenData) + this.getPreviousY(this.outputGreenData) - this.getPreviousXY(this.outputGreenData);
        prev[2] = this.getPreviousX(this.outputBlueData) + this.getPreviousY(this.outputBlueData) - this.getPreviousXY(this.outputBlueData);
        break;
      case 5:
        prev[0] = this.getPreviousX(this.outputRedData) + ((this.getPreviousY(this.outputRedData) - this.getPreviousXY(this.outputRedData)) >> 1);
        prev[1] = this.getPreviousX(this.outputGreenData) + ((this.getPreviousY(this.outputGreenData) - this.getPreviousXY(this.outputGreenData)) >> 1);
        prev[2] = this.getPreviousX(this.outputBlueData) + ((this.getPreviousY(this.outputBlueData) - this.getPreviousXY(this.outputBlueData)) >> 1);
        break;
      case 6:
        prev[0] = this.getPreviousY(this.outputRedData) + ((this.getPreviousX(this.outputRedData) - this.getPreviousXY(this.outputRedData)) >> 1);
        prev[1] = this.getPreviousY(this.outputGreenData) + ((this.getPreviousX(this.outputGreenData) - this.getPreviousXY(this.outputGreenData)) >> 1);
        prev[2] = this.getPreviousY(this.outputBlueData) + ((this.getPreviousX(this.outputBlueData) - this.getPreviousXY(this.outputBlueData)) >> 1);
        break;
      case 7:
        prev[0] = Math.trunc((this.getPreviousX(this.outputRedData) + this.getPreviousY(this.outputRedData)) / 2);
        prev[1] = Math.trunc((this.getPreviousX(this.outputGreenData) + this.getPreviousY(this.outputGreenData)) / 2);
        prev[2] = Math.trunc((this.getPreviousX(this.outputBlueData) + this.getPreviousY(this.outputBlueData)) / 2);
        break;
      default:
        prev[0] = this.getPreviousX(this.outputRedData);
        prev[1] = this.getPreviousX(this.outputGreenData);
        prev[2] = this.getPreviousX(this.outputBlueData);
        break;
    }

    for (let c = 0; c < this.numComponents; c++) {
      const qtab = this.qTab[c];
      const actab = this.acTab[c];
      const dctab = this.dcTab[c];
      if (!qtab || !actab || !dctab) throw new Error(`Missing JPEG tables for component index ${c}`);

      for (let i = 0; i < this.nBlock[c]!; i++) {
        this.idctSource.fill(0);
        let value = this.getHuffmanValue(dctab, temp, index);
        if (value >= 0xff00) return value;

        prev[c] = this.idctSource[0] = prev[c]! + this.getN(prev[c] ?? 0, value, temp, index);
        this.idctSource[0] *= qtab[0]!;

        for (let j = 1; j < 64; j++) {
          value = this.getHuffmanValue(actab, temp, index);
          if (value >= 0xff00) return value;

          j += value >> 4;
          if ((value & 0x0f) === 0) {
            if ((value >> 4) === 0) break;
          } else {
            this.idctSource[JpegLosslessDecoderImpl.IDCT_P[j]!] = this.getN(prev[c] ?? 0, value & 0x0f, temp, index) * qtab[j]!;
          }
        }
      }
    }

    return 0;
  }

  private getHuffmanValue(table: number[], temp: IntRef, index: IntRef): number {
    const mask = 0xffff;
    if (index.value < 8) {
      temp.value = ((temp.value << 8) & 0xffff);
      const input = this.get8();
      if (input === 0xff) {
        this.marker = this.get8();
        if (this.marker !== 0) this.markerIndex = 9;
      }
      temp.value |= input;
    } else {
      index.value -= 8;
    }

    let code = table[temp.value >> index.value] ?? 0;
    if ((code & JpegLosslessDecoderImpl.MSB) !== 0) {
      if (this.markerIndex !== 0) {
        this.markerIndex = 0;
        return 0xff00 | this.marker;
      }

      temp.value &= (mask >> (16 - index.value));
      temp.value = ((temp.value << 8) & 0xffff);
      const input = this.get8();
      if (input === 0xff) {
        this.marker = this.get8();
        if (this.marker !== 0) this.markerIndex = 9;
      }

      temp.value |= input;
      code = table[((code & 0xff) * 256) + (temp.value >> index.value)] ?? 0;
      index.value += 8;
    }

    index.value += 8 - (code >> 8);
    if (index.value < 0) {
      throw new Error(`Invalid Huffman index state index=${index.value}`);
    }
    if (index.value < this.markerIndex) {
      this.markerIndex = 0;
      return 0xff00 | this.marker;
    }

    temp.value &= (mask >> (16 - index.value));
    return code & 0xff;
  }

  private getN(pred: number, n: number, temp: IntRef, index: IntRef): number {
    const one = 1;
    const nOne = -1;
    const mask = 0xffff;
    if (n === 0) return 0;
    if (n === 16) return pred >= 0 ? -32768 : 32768;

    index.value -= n;
    let result: number;

    if (index.value >= 0) {
      if (index.value < this.markerIndex && !this.isLastPixel()) {
        this.markerIndex = 0;
        return (0xff00 | this.marker) << 8;
      }
      result = temp.value >> index.value;
      temp.value &= (mask >> (16 - index.value));
    } else {
      temp.value = ((temp.value << 8) & 0xffff);
      let input = this.get8();
      if (input === 0xff) {
        this.marker = this.get8();
        if (this.marker !== 0) this.markerIndex = 9;
      }
      temp.value |= input;
      index.value += 8;

      if (index.value < 0) {
        if (this.markerIndex !== 0) {
          this.markerIndex = 0;
          return (0xff00 | this.marker) << 8;
        }

        temp.value = ((temp.value << 8) & 0xffff);
        input = this.get8();
        if (input === 0xff) {
          this.marker = this.get8();
          if (this.marker !== 0) this.markerIndex = 9;
        }
        temp.value |= input;
        index.value += 8;
      }

      if (index.value < 0) {
        throw new Error(`Invalid getN index state index=${index.value}`);
      }
      if (index.value < this.markerIndex) {
        this.markerIndex = 0;
        return (0xff00 | this.marker) << 8;
      }

      result = temp.value >> index.value;
      temp.value &= (mask >> (16 - index.value));
    }

    if (result < (one << (n - 1))) {
      result += (nOne << n) + 1;
    }
    return result;
  }

  private getPreviousX(data: number[]): number {
    if (this.xLoc > 0) return data[(this.yLoc * this.xDim) + this.xLoc - 1]!;
    if (this.yLoc > 0) return this.getPreviousY(data);
    return 1 << (this.frame.precision - 1);
  }

  private getPreviousXY(data: number[]): number {
    if (this.xLoc > 0 && this.yLoc > 0) {
      return data[((this.yLoc - 1) * this.xDim) + this.xLoc - 1]!;
    }
    return this.getPreviousY(data);
  }

  private getPreviousY(data: number[]): number {
    if (this.yLoc > 0) return data[((this.yLoc - 1) * this.xDim) + this.xLoc]!;
    return this.getPreviousX(data);
  }

  private isLastPixel(): boolean {
    return this.xLoc === (this.xDim - 1) && this.yLoc === (this.yDim - 1);
  }

  private output(pred: number[]): void {
    if (this.numComponents === 1) {
      if (!this.outputData) throw new Error("Internal decoder state is not initialized");
      if (this.xLoc < this.xDim && this.yLoc < this.yDim) {
        this.outputData[(this.yLoc * this.xDim) + this.xLoc] = this.mask & pred[0]!;
        this.xLoc++;
        if (this.xLoc >= this.xDim) {
          this.yLoc++;
          this.xLoc = 0;
        }
      }
      return;
    }

    if (!this.outputRedData || !this.outputGreenData || !this.outputBlueData) {
      throw new Error("Internal decoder state is not initialized");
    }
    if (this.xLoc < this.xDim && this.yLoc < this.yDim) {
      const idx = (this.yLoc * this.xDim) + this.xLoc;
      this.outputRedData[idx] = pred[0]!;
      this.outputGreenData[idx] = pred[1]!;
      this.outputBlueData[idx] = pred[2]!;
      this.xLoc++;
      if (this.xLoc >= this.xDim) {
        this.yLoc++;
        this.xLoc = 0;
      }
    }
  }

  private readApp(): number {
    let count = 2;
    const length = this.get16();
    while (count < length) {
      this.get8();
      count++;
    }
    return length;
  }

  private readComment(): string {
    let count = 2;
    const length = this.get16();
    let text = "";
    while (count < length) {
      text += String.fromCharCode(this.get8());
      count++;
    }
    return text;
  }

  private readNumber(): number {
    const ld = this.get16();
    if (ld !== 4) throw new Error("Invalid JPEG number segment");
    return this.get16();
  }
}

class FrameHeader {
  components = new Array<ComponentSpec | null>(256).fill(null);
  dimX = 0;
  dimY = 0;
  numComponents = 0;
  precision = 0;

  read(stream: IJpegDataStream): void {
    let count = 2;
    const length = stream.get16();
    this.precision = stream.get8();
    count++;
    this.dimY = stream.get16();
    count += 2;
    this.dimX = stream.get16();
    count += 2;
    this.numComponents = stream.get8();
    count++;

    for (let i = 1; i <= this.numComponents; i++) {
      if (count > length) throw new Error("Invalid JPEG frame header");
      const c = stream.get8();
      count++;
      if (count >= length) throw new Error("Invalid JPEG frame header");
      const temp = stream.get8();
      count++;
      const comp = this.components[c] ?? new ComponentSpec();
      comp.hSamp = temp >> 4;
      comp.vSamp = temp & 0x0f;
      comp.quantTableSel = stream.get8();
      count++;
      this.components[c] = comp;
    }

    if (count !== length) throw new Error("Invalid JPEG frame header length");
  }
}

class ComponentSpec {
  hSamp = 0;
  vSamp = 0;
  quantTableSel = 0;
}

class ScanHeader {
  components: ScanComponent[] = [];
  ah = 0;
  al = 0;
  numComponents = 0;
  selection = 1;
  spectralEnd = 0;

  read(stream: IJpegDataStream): void {
    let count = 2;
    const length = stream.get16();
    this.numComponents = stream.get8();
    count++;
    this.components = new Array<ScanComponent>(this.numComponents);

    for (let i = 0; i < this.numComponents; i++) {
      if (count > length) throw new Error("Invalid JPEG scan header");
      const comp = new ScanComponent();
      comp.scanCompSel = stream.get8();
      count++;
      const temp = stream.get8();
      count++;
      comp.dcTabSel = temp >> 4;
      comp.acTabSel = temp & 0x0f;
      this.components[i] = comp;
    }

    this.selection = stream.get8();
    count++;
    this.spectralEnd = stream.get8();
    count++;
    const temp = stream.get8();
    this.ah = temp >> 4;
    this.al = temp & 0x0f;
    count++;

    if (count !== length) throw new Error("Invalid JPEG scan header length");
  }
}

class ScanComponent {
  acTabSel = 0;
  dcTabSel = 0;
  scanCompSel = 0;
}

class HuffmanTable {
  private static readonly MSB = 0x80000000 | 0;
  private readonly l = createHuffmanTab(4, 2, 16);
  private readonly th = new Array<number>(4).fill(0);
  private readonly v = createHuffmanMatrixTab(4, 2, 16, 200);
  private readonly tc = Array.from({ length: 4 }, () => new Array<number>(2).fill(0));

  read(stream: IJpegDataStream, huffTab: number[][][]): void {
    let count = 2;
    const length = stream.get16();

    while (count < length) {
      const temp = stream.get8();
      count++;
      const t = temp & 0x0f;
      const c = temp >> 4;
      if (t > 3) throw new Error("JPEG Huffman table ID > 3");
      if (c > 2) throw new Error("JPEG Huffman table class > 2");

      this.th[t] = 1;
      this.tc[t]![c] = 1;

      for (let i = 0; i < 16; i++) {
        this.l[t]![c]![i] = stream.get8();
        count++;
      }

      for (let i = 0; i < 16; i++) {
        for (let j = 0; j < this.l[t]![c]![i]!; j++) {
          if (count > length) throw new Error("Invalid JPEG Huffman table");
          this.v[t]![c]![i]![j] = stream.get8();
          count++;
        }
      }
    }

    if (count !== length) throw new Error("Invalid JPEG Huffman table length");

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 2; j++) {
        if (this.tc[i]![j] !== 0) {
          this.buildHuffTable(huffTab[i]![j]!, this.l[i]![j]!, this.v[i]![j]!);
        }
      }
    }
  }

  private buildHuffTable(tab: number[], lengths: number[], values: number[][]): void {
    let currentTable = 1;
    const temp = 256;
    let k = 0;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < lengths[i]!; j++) {
        for (let n = 0; n < (temp >> (i + 1)); n++) {
          tab[k] = values[i]![j]! | ((i + 1) << 8);
          k++;
        }
      }
    }

    for (let i = 1; k < 256; i++, k++) {
      tab[k] = i | HuffmanTable.MSB;
    }

    k = 0;
    for (let i = 8; i < 16; i++) {
      for (let j = 0; j < lengths[i]!; j++) {
        for (let n = 0; n < (temp >> (i - 7)); n++) {
          tab[(currentTable * 256) + k] = values[i]![j]! | ((i + 1) << 8);
          k++;
        }
        if (k >= 256) {
          if (k > 256) throw new Error("Invalid JPEG Huffman table data");
          k = 0;
          currentTable++;
        }
      }
    }
  }
}

class QuantizationTable {
  private readonly precision = new Array<number>(4).fill(0);
  private readonly tq = new Array<number>(4).fill(0);
  readonly quantTables = Array.from({ length: 4 }, () => new Array<number>(64).fill(0));

  read(stream: IJpegDataStream, table: number[]): void {
    let count = 2;
    const length = stream.get16();
    while (count < length) {
      const temp = stream.get8();
      count++;
      const t = temp & 0x0f;
      if (t > 3) throw new Error("JPEG quantization table ID > 3");

      this.precision[t] = temp >> 4;
      if (this.precision[t] === 0) this.precision[t] = 8;
      else if (this.precision[t] === 1) this.precision[t] = 16;
      else throw new Error("Invalid JPEG quantization table precision");

      this.tq[t] = 1;
      if (this.precision[t] === 8) {
        for (let i = 0; i < 64; i++) {
          if (count > length) throw new Error("Invalid JPEG quantization table");
          this.quantTables[t]![i] = stream.get8();
          count++;
        }
      } else {
        for (let i = 0; i < 64; i++) {
          if (count > length) throw new Error("Invalid JPEG quantization table");
          this.quantTables[t]![i] = stream.get16();
          count += 2;
        }
      }
      this.enhanceQuantizationTable(this.quantTables[t]!, table);
    }

    if (count !== length) throw new Error("Invalid JPEG quantization table length");
  }

  private enhanceQuantizationTable(qtab: number[], table: number[]): void {
    for (let i = 0; i < 8; i++) {
      qtab[table[(0 * 8) + i]!]! *= 90;
      qtab[table[(4 * 8) + i]!]! *= 90;
      qtab[table[(2 * 8) + i]!]! *= 118;
      qtab[table[(6 * 8) + i]!]! *= 49;
      qtab[table[(5 * 8) + i]!]! *= 71;
      qtab[table[(1 * 8) + i]!]! *= 126;
      qtab[table[(7 * 8) + i]!]! *= 25;
      qtab[table[(3 * 8) + i]!]! *= 106;
    }

    for (let i = 0; i < 8; i++) {
      qtab[table[0 + (8 * i)]!]! *= 90;
      qtab[table[4 + (8 * i)]!]! *= 90;
      qtab[table[2 + (8 * i)]!]! *= 118;
      qtab[table[6 + (8 * i)]!]! *= 49;
      qtab[table[5 + (8 * i)]!]! *= 71;
      qtab[table[1 + (8 * i)]!]! *= 126;
      qtab[table[7 + (8 * i)]!]! *= 25;
      qtab[table[3 + (8 * i)]!]! *= 106;
    }

    for (let i = 0; i < 64; i++) {
      qtab[i] = qtab[i]! >> 6;
    }
  }
}

interface IntRef {
  value: number;
}

function createHuffmanTab(a: number, b: number, c: number): number[][][] {
  return Array.from({ length: a }, () =>
    Array.from({ length: b }, () => new Array<number>(c).fill(0)));
}

function createHuffmanMatrixTab(a: number, b: number, c: number, d: number): number[][][][] {
  return Array.from({ length: a }, () =>
    Array.from({ length: b }, () =>
      Array.from({ length: c }, () => new Array<number>(d).fill(0))));
}

function expectedFrameSize(pixelData: DicomPixelData, prefix: string): number {
  if (pixelData.rows <= 0 || pixelData.columns <= 0 || pixelData.samplesPerPixel <= 0) {
    throw new Error(
      `${prefix} invalid geometry (rows=${pixelData.rows}, columns=${pixelData.columns}, samples=${pixelData.samplesPerPixel})`,
    );
  }
  const bytesPerSample = Math.max(1, Math.ceil(pixelData.bitsAllocated / 8));
  return pixelData.rows * pixelData.columns * pixelData.samplesPerPixel * bytesPerSample;
}

function toNativeFrame(decoded: number[][], decoder: JpegLosslessDecoderImpl, prefix: string): Uint8Array {
  const width = decoder.dimX;
  const height = decoder.dimY;
  const pixelCount = width * height;

  if (decoder.numComponents === 1) {
    const component = decoded[0];
    if (!component || component.length < pixelCount) {
      throw new Error(`${prefix} decoded grayscale buffer is incomplete`);
    }

    if (decoder.precision <= 8) {
      const out = new Uint8Array(pixelCount);
      for (let i = 0; i < pixelCount; i++) out[i] = component[i]! & 0xff;
      return out;
    }

    if (decoder.precision <= 16) {
      const out = new Uint8Array(pixelCount * 2);
      for (let i = 0; i < pixelCount; i++) {
        const value = component[i]! & 0xffff;
        const p = i * 2;
        out[p] = value & 0xff;
        out[p + 1] = (value >> 8) & 0xff;
      }
      return out;
    }

    throw new Error(`${prefix} unsupported grayscale precision ${decoder.precision}`);
  }

  if (decoder.numComponents === 3) {
    if (decoder.precision !== 8 && decoder.precision !== 24) {
      throw new Error(`${prefix} unsupported RGB precision ${decoder.precision}`);
    }
    const r = decoded[0];
    const g = decoded[1];
    const b = decoded[2];
    if (!r || !g || !b || r.length < pixelCount || g.length < pixelCount || b.length < pixelCount) {
      throw new Error(`${prefix} decoded RGB buffer is incomplete`);
    }

    const out = new Uint8Array(pixelCount * 3);
    let p = 0;
    for (let i = 0; i < pixelCount; i++) {
      out[p++] = r[i]! & 0xff;
      out[p++] = g[i]! & 0xff;
      out[p++] = b[i]! & 0xff;
    }
    return out;
  }

  throw new Error(`${prefix} unsupported component count ${decoder.numComponents}`);
}
