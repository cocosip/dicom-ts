import { DicomTransferSyntax } from "../../../../core/DicomTransferSyntax.js";
import type { DicomPixelData } from "../../../DicomPixelData.js";
import type { DecodeJpeg2000Result } from "./Jpeg2000Core.js";
import { PhotometricInterpretation } from "../../../PhotometricInterpretation.js";
import { PlanarConfiguration } from "../../../PlanarConfiguration.js";
import type { DicomCodecParams } from "../../DicomCodecParams.js";
import { DicomJpeg2000Params } from "../DicomJpeg2000Params.js";

interface Jpeg2000ErrorContext {
  syntaxUid?: string;
  frameIndex?: number;
  width?: number;
  height?: number;
  bitsAllocated?: number;
  bitsStored?: number;
  samplesPerPixel?: number;
}

function formatJpeg2000Error(message: string, context: Jpeg2000ErrorContext): string {
  const fields: string[] = [];

  if (typeof context.syntaxUid === "string" && context.syntaxUid.length > 0) {
    fields.push(`syntax=${context.syntaxUid}`);
  }
  if (typeof context.frameIndex === "number") {
    fields.push(`frame=${context.frameIndex}`);
  }
  if (typeof context.width === "number" && typeof context.height === "number") {
    fields.push(`size=${context.width}x${context.height}`);
  }
  if (typeof context.bitsAllocated === "number") {
    fields.push(`bitsAllocated=${context.bitsAllocated}`);
  }
  if (typeof context.bitsStored === "number") {
    fields.push(`bitsStored=${context.bitsStored}`);
  }
  if (typeof context.samplesPerPixel === "number") {
    fields.push(`samples=${context.samplesPerPixel}`);
  }

  if (fields.length === 0) {
    return message;
  }

  return `${message} [${fields.join(", ")}]`;
}

export type Jpeg2000SampleConstraint = "part1" | "multicomponent";

export interface Jpeg2000DecodedMetadata {
  width?: number;
  height?: number;
  components?: number;
  bitsAllocated?: number;
  bitsStored?: number;
}

export function resolveJpeg2000Params(
  parameters: DicomCodecParams | null,
  defaults: DicomJpeg2000Params,
): DicomJpeg2000Params {
  const base = parameters instanceof DicomJpeg2000Params ? parameters : defaults;
  return base.cloneNormalized();
}

export function resolveLosslessJpeg2000Params(
  parameters: DicomCodecParams | null,
  defaults: DicomJpeg2000Params,
): DicomJpeg2000Params {
  const source = parameters instanceof DicomJpeg2000Params ? parameters : defaults;
  const normalized = source.cloneNormalized();
  if (!(Number.isFinite(source.rate) && source.rate > 0)) {
    normalized.rate = 0;
  }
  normalized.irreversible = false;
  return normalized;
}

export function enforceLosslessParams(parameters: DicomJpeg2000Params): DicomJpeg2000Params {
  parameters.irreversible = false;
  return parameters;
}

export function normalizeLosslessRateControlParams(
  parameters: DicomJpeg2000Params,
  bitsStored: number,
  bitsAllocated: number,
): DicomJpeg2000Params {
  const normalized = parameters.cloneNormalized();
  if (!(Number.isFinite(parameters.rate) && parameters.rate > 0)) {
    normalized.rate = 0;
  }

  if (normalized.targetRatio <= 0 && normalized.rate > 0) {
    normalized.targetRatio = rateToTargetRatio(normalized.rate, bitsStored, bitsAllocated);
  }

  if (normalized.targetRatio > 0 && normalized.numLayers <= 1) {
    normalized.numLayers = layersFromRateLevels(normalized.rate, normalized.rateLevels);
  }

  if (normalized.appendLosslessLayer && normalized.targetRatio > 0 && normalized.numLayers < 2) {
    normalized.numLayers = 2;
  }

  if (normalized.targetRatio > 0) {
    normalized.usePcrdOpt = true;
  }

  return normalized;
}

export function validateJpeg2000EncodeInput(
  pixelData: DicomPixelData,
  frameIndex: number,
  syntaxUid: string,
  sampleConstraint: Jpeg2000SampleConstraint,
): void {
  if (pixelData.bitsAllocated !== 8 && pixelData.bitsAllocated !== 16) {
    throw new Error(formatJpeg2000Error(
      `JPEG2000 supports BitsAllocated 8 or 16; got ${pixelData.bitsAllocated}`,
      {
        syntaxUid,
        frameIndex,
        bitsAllocated: pixelData.bitsAllocated,
        bitsStored: pixelData.bitsStored,
        samplesPerPixel: pixelData.samplesPerPixel,
        width: pixelData.columns,
        height: pixelData.rows,
      },
    ));
  }

  if (pixelData.bitsStored < 2 || pixelData.bitsStored > 16) {
    throw new Error(formatJpeg2000Error(
      `JPEG2000 supports BitsStored 2-16; got ${pixelData.bitsStored}`,
      {
        syntaxUid,
        frameIndex,
        bitsAllocated: pixelData.bitsAllocated,
        bitsStored: pixelData.bitsStored,
        samplesPerPixel: pixelData.samplesPerPixel,
        width: pixelData.columns,
        height: pixelData.rows,
      },
    ));
  }

  if (sampleConstraint === "part1") {
    if (pixelData.samplesPerPixel !== 1 && pixelData.samplesPerPixel !== 3) {
      throw new Error(formatJpeg2000Error(
        `JPEG2000 Part 1 supports SamplesPerPixel 1 or 3; got ${pixelData.samplesPerPixel}`,
        {
          syntaxUid,
          frameIndex,
          bitsAllocated: pixelData.bitsAllocated,
          bitsStored: pixelData.bitsStored,
          samplesPerPixel: pixelData.samplesPerPixel,
          width: pixelData.columns,
          height: pixelData.rows,
        },
      ));
    }
    return;
  }

  if (pixelData.samplesPerPixel < 1) {
    throw new Error(formatJpeg2000Error(
      `JPEG2000 multi-component requires SamplesPerPixel >= 1; got ${pixelData.samplesPerPixel}`,
      {
        syntaxUid,
        frameIndex,
        bitsAllocated: pixelData.bitsAllocated,
        bitsStored: pixelData.bitsStored,
        samplesPerPixel: pixelData.samplesPerPixel,
        width: pixelData.columns,
        height: pixelData.rows,
      },
    ));
  }
}

export function stripFramePaddingByte(data: Uint8Array, pixelData: DicomPixelData): Uint8Array {
  const bytesPerSample = Math.ceil(pixelData.bitsAllocated / 8);
  const expectedLength = pixelData.rows * pixelData.columns * pixelData.samplesPerPixel * bytesPerSample;
  return expectedLength > 0 && data.length > expectedLength ? data.subarray(0, expectedLength) : data;
}

export function validateDecodedFrame(
  decoded: Uint8Array,
  metadata: Jpeg2000DecodedMetadata | undefined,
  pixelData: DicomPixelData,
  frameIndex: number,
  syntaxUid: string,
): Uint8Array {
  const expectedLength = pixelData.rows
    * pixelData.columns
    * pixelData.samplesPerPixel
    * Math.ceil(pixelData.bitsAllocated / 8);

  let normalized = decoded;
  if (expectedLength > 0 && normalized.length === expectedLength + 1 && expectedLength % 2 === 1) {
    normalized = normalized.subarray(0, expectedLength);
  }

  if (expectedLength > 0 && normalized.length !== expectedLength) {
    throw new Error(formatJpeg2000Error(
      `JPEG2000 decoded frame length mismatch: decoded=${normalized.length}, expected=${expectedLength}`,
      {
        syntaxUid,
        frameIndex,
        bitsAllocated: pixelData.bitsAllocated,
        bitsStored: pixelData.bitsStored,
        samplesPerPixel: pixelData.samplesPerPixel,
        width: pixelData.columns,
        height: pixelData.rows,
      },
    ));
  }

  if (metadata) {
    if (metadata.width !== undefined && metadata.width !== pixelData.columns) {
      throw new Error(formatJpeg2000Error(
        `JPEG2000 decoded width mismatch: decoded=${metadata.width}, expected=${pixelData.columns}`,
        {
          syntaxUid,
          frameIndex,
          bitsAllocated: pixelData.bitsAllocated,
          bitsStored: pixelData.bitsStored,
          samplesPerPixel: pixelData.samplesPerPixel,
          width: pixelData.columns,
          height: pixelData.rows,
        },
      ));
    }

    if (metadata.height !== undefined && metadata.height !== pixelData.rows) {
      throw new Error(formatJpeg2000Error(
        `JPEG2000 decoded height mismatch: decoded=${metadata.height}, expected=${pixelData.rows}`,
        {
          syntaxUid,
          frameIndex,
          bitsAllocated: pixelData.bitsAllocated,
          bitsStored: pixelData.bitsStored,
          samplesPerPixel: pixelData.samplesPerPixel,
          width: pixelData.columns,
          height: pixelData.rows,
        },
      ));
    }

    if (metadata.components !== undefined && metadata.components !== pixelData.samplesPerPixel) {
      throw new Error(formatJpeg2000Error(
        `JPEG2000 decoded component mismatch: decoded=${metadata.components}, expected=${pixelData.samplesPerPixel}`,
        {
          syntaxUid,
          frameIndex,
          bitsAllocated: pixelData.bitsAllocated,
          bitsStored: pixelData.bitsStored,
          samplesPerPixel: pixelData.samplesPerPixel,
          width: pixelData.columns,
          height: pixelData.rows,
        },
      ));
    }

    if (metadata.bitsStored !== undefined && metadata.bitsStored !== pixelData.bitsStored) {
      throw new Error(formatJpeg2000Error(
        `JPEG2000 decoded bitsStored mismatch: decoded=${metadata.bitsStored}, expected=${pixelData.bitsStored}`,
        {
          syntaxUid,
          frameIndex,
          bitsAllocated: pixelData.bitsAllocated,
          bitsStored: pixelData.bitsStored,
          samplesPerPixel: pixelData.samplesPerPixel,
          width: pixelData.columns,
          height: pixelData.rows,
        },
      ));
    }

    if (metadata.bitsAllocated !== undefined && metadata.bitsAllocated !== pixelData.bitsAllocated) {
      throw new Error(formatJpeg2000Error(
        `JPEG2000 decoded bitsAllocated mismatch: decoded=${metadata.bitsAllocated}, expected=${pixelData.bitsAllocated}`,
        {
          syntaxUid,
          frameIndex,
          bitsAllocated: pixelData.bitsAllocated,
          bitsStored: pixelData.bitsStored,
          samplesPerPixel: pixelData.samplesPerPixel,
          width: pixelData.columns,
          height: pixelData.rows,
        },
      ));
    }
  }

  return normalized;
}

export function validateDecodedFrameResult(
  decoded: DecodeJpeg2000Result,
  pixelData: DicomPixelData,
  frameIndex: number,
  syntaxUid: string,
): Uint8Array {
  return validateDecodedFrame(decoded.pixelData, decoded.metadata, pixelData, frameIndex, syntaxUid);
}

export function applyJpeg2000EncodePixelMetadata(
  newPixelData: DicomPixelData,
  transferSyntax: DicomTransferSyntax,
  parameters: DicomJpeg2000Params,
): void {
  if (newPixelData.samplesPerPixel > 1) {
    newPixelData.planarConfiguration = PlanarConfiguration.Interleaved;
  }

  if (!parameters.allowMct || !parameters.updatePhotometricInterpretation) {
    return;
  }

  const pi = newPixelData.photometricInterpretation;
  if (pi === null) {
    return;
  }

  if (
    pi !== PhotometricInterpretation.RGB
    && pi !== PhotometricInterpretation.YBR_FULL
    && pi !== PhotometricInterpretation.YBR_FULL_422
    && pi !== PhotometricInterpretation.YBR_PARTIAL_422
    && pi !== PhotometricInterpretation.YBR_PARTIAL_420
  ) {
    return;
  }

  const syntaxUid = transferSyntax.uid.uid;
  const useIct = parameters.irreversible
    && (syntaxUid === DicomTransferSyntax.JPEG2000Lossy.uid.uid || syntaxUid === DicomTransferSyntax.JPEG2000MC.uid.uid);

  newPixelData.photometricInterpretation = useIct
    ? PhotometricInterpretation.YBR_ICT
    : PhotometricInterpretation.YBR_RCT;
}

export function applyJpeg2000DecodePixelMetadata(pixelData: DicomPixelData): void {
  if (pixelData.samplesPerPixel > 1) {
    pixelData.planarConfiguration = PlanarConfiguration.Interleaved;
  }

  const pi = pixelData.photometricInterpretation;
  if (
    pi === PhotometricInterpretation.YBR_ICT
    || pi === PhotometricInterpretation.YBR_RCT
    || pi === PhotometricInterpretation.YBR_FULL
    || pi === PhotometricInterpretation.YBR_FULL_422
    || pi === PhotometricInterpretation.YBR_PARTIAL_422
    || pi === PhotometricInterpretation.YBR_PARTIAL_420
  ) {
    pixelData.photometricInterpretation = PhotometricInterpretation.RGB;
  }
}

function rateToTargetRatio(rate: number, bitsStored: number, bitsAllocated: number): number {
  if (rate <= 0) {
    return 0;
  }

  const safeBitsStored = bitsStored > 0 ? bitsStored : 0;
  const safeBitsAllocated = bitsAllocated > 0 ? bitsAllocated : safeBitsStored;
  if (safeBitsStored <= 0 || safeBitsAllocated <= 0) {
    return rate;
  }

  return (rate * safeBitsStored) / safeBitsAllocated;
}

function layersFromRateLevels(rate: number, rateLevels: number[]): number {
  if (rate <= 0 || !Array.isArray(rateLevels) || rateLevels.length === 0) {
    return 1;
  }

  let layers = 1;
  for (let i = 0; i < rateLevels.length; i++) {
    const threshold = rateLevels[i]!;
    if (Number.isFinite(threshold) && threshold > rate) {
      layers++;
    }
  }

  return Math.max(1, layers);
}
