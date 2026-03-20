import { DicomTransferSyntax } from "../../../../core/DicomTransferSyntax.js";
import type { DicomPixelData } from "../../../DicomPixelData.js";
import type { DecodeJpeg2000Result } from "./Jpeg2000Core.js";
import { PhotometricInterpretation } from "../../../PhotometricInterpretation.js";
import { PlanarConfiguration } from "../../../PlanarConfiguration.js";
import type { DicomCodecParams } from "../../DicomCodecParams.js";
import { DicomJpeg2000Params } from "../DicomJpeg2000Params.js";

export interface Jpeg2000ErrorContext {
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

type Jpeg2000Operation = "encode" | "decode";

type Jpeg2000FailureClass = "truncation" | "marker-corruption" | "metadata-mismatch" | "validation" | "unknown";

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function classifyJpeg2000Failure(error: unknown): Jpeg2000FailureClass {
  const message = describeError(error).toLowerCase();

  if (
    message.includes("decoded frame length mismatch")
    || message.includes("decoded width mismatch")
    || message.includes("decoded height mismatch")
    || message.includes("decoded component mismatch")
    || message.includes("decoded bitsstored mismatch")
    || message.includes("decoded bitsallocated mismatch")
  ) {
    return "metadata-mismatch";
  }

  if (
    message.includes("supports bitsallocated")
    || message.includes("supports bitsstored")
    || message.includes("supports samplesperpixel")
    || message.includes("requires samplesperpixel")
    || message.includes("encode produced empty frame")
  ) {
    return "validation";
  }

  if (
    message.includes("unexpected end")
    || message.includes("too short")
    || message.includes("exceeds codestream length")
    || message.includes("exceeds stream length")
    || message.includes("missing eoc marker")
    || message.includes("truncated")
  ) {
    return "truncation";
  }

  if (
    message.includes("segment length")
    || message.includes("invalid jp2 box length")
    || message.includes("invalid jp2 box header size")
    || message.includes("expected soc marker")
    || message.includes("unexpected marker")
    || message.includes("unexpected non-segment marker")
    || message.includes("duplicate siz segment in main header")
    || message.includes("duplicate cod segment in main header")
    || message.includes("duplicate qcd segment in main header")
    || message.includes("invalid jp2 codestream box")
    || message.includes("payload does not start with soc marker")
    || message.includes("jp2 stream does not contain a jp2c codestream box")
    || message.includes("unsupported jpeg2000 stream form")
    || message.includes("missing siz segment")
    || message.includes("missing required siz segment")
    || message.includes("missing cod segment")
    || message.includes("missing required cod segment")
    || message.includes("missing qcd segment")
    || message.includes("missing required qcd segment")
    || message.includes("invalid sot psot")
    || message.includes("tile-part exceeds codestream")
    || message.includes("tile-part end precedes sod data")
    || message.includes("first tile-part index is")
    || message.includes("unexpected tile-part index")
    || message.includes("mismatched tnsot")
    || message.includes("tile-part count exceeded")
    || message.includes("ended before sod marker")
    || message.includes("tile-part header ended before sod marker")
    || message.includes("unsupported mct zmct value")
    || message.includes("unsupported mct ymct value")
    || message.includes("unsupported mcc zmcc value")
    || message.includes("unsupported mcc ymcc value")
    || message.includes("invalid mct segment payload length")
    || message.includes("invalid mcc segment payload length")
    || message.includes("invalid mco segment payload length")
    || message.includes("invalid siz segment payload length")
    || message.includes("invalid cod segment payload length")
    || message.includes("invalid cod precinct payload length")
    || message.includes("invalid qcd segment payload length")
    || message.includes("invalid coc segment payload length")
    || message.includes("invalid coc precinct payload length")
    || message.includes("invalid qcc segment payload length")
    || message.includes("invalid poc segment payload length")
    || message.includes("invalid com segment payload length")
    || message.includes("invalid rgn segment payload length")
    || message.includes("rgn differs between tile-parts")
    || message.includes("com encountered before siz")
    || message.includes("invalid mcc payload")
    || message.includes("no collections")
  ) {
    return "marker-corruption";
  }

  return "unknown";
}

export function buildJpeg2000OperationError(
  operation: Jpeg2000Operation,
  error: unknown,
  context: Jpeg2000ErrorContext,
): Error {
  const failureClass = classifyJpeg2000Failure(error);
  return new Error(
    formatJpeg2000Error(
      `JPEG2000 ${operation} failed [class=${failureClass}]: ${describeError(error)}`,
      context,
    ),
  );
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
