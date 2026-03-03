import { DicomTransferSyntax } from "../../../../core/DicomTransferSyntax.js";
import type { IByteBuffer } from "../../../../io/buffer/IByteBuffer.js";
import type { DicomPixelData } from "../../../DicomPixelData.js";
import { PhotometricInterpretation } from "../../../PhotometricInterpretation.js";
import { PlanarConfiguration } from "../../../PlanarConfiguration.js";
import type { DicomCodecParams } from "../../DicomCodecParams.js";
import { DicomJpeg2000Params } from "../DicomJpeg2000Params.js";
import type {
  DicomJpeg2000DecodeResult,
  DicomJpeg2000DecodedMetadata,
  DicomJpeg2000FrameContext,
} from "./DicomJpeg2000Adapter.js";

export type Jpeg2000SampleConstraint = "part1" | "multicomponent";

export function resolveJpeg2000Params(
  parameters: DicomCodecParams | null,
  defaults: DicomJpeg2000Params,
): DicomJpeg2000Params {
  const base = parameters instanceof DicomJpeg2000Params ? parameters : defaults;
  return base.cloneNormalized();
}

export function enforceLosslessParams(parameters: DicomJpeg2000Params): DicomJpeg2000Params {
  parameters.irreversible = false;
  return parameters;
}

export function buildJpeg2000FrameContext(
  transferSyntax: DicomTransferSyntax,
  pixelData: DicomPixelData,
  parameters: DicomJpeg2000Params,
  frameIndex: number,
): DicomJpeg2000FrameContext {
  return {
    transferSyntax,
    parameters,
    samplesPerPixel: pixelData.samplesPerPixel,
    columns: pixelData.columns,
    rows: pixelData.rows,
    bitsAllocated: pixelData.bitsAllocated,
    bitsStored: pixelData.bitsStored,
    pixelRepresentation: pixelData.pixelRepresentation,
    photometricInterpretation: pixelData.photometricInterpretation,
    planarConfiguration: pixelData.planarConfiguration,
    frameIndex,
  };
}

export function validateJpeg2000EncodeInput(
  pixelData: DicomPixelData,
  frameIndex: number,
  syntaxUid: string,
  sampleConstraint: Jpeg2000SampleConstraint,
): void {
  if (pixelData.bitsAllocated !== 8 && pixelData.bitsAllocated !== 16) {
    throw new Error(
      `JPEG2000 supports BitsAllocated 8 or 16; got ${pixelData.bitsAllocated} [frame=${frameIndex}, syntax=${syntaxUid}]`,
    );
  }

  if (pixelData.bitsStored < 2 || pixelData.bitsStored > 16) {
    throw new Error(
      `JPEG2000 supports BitsStored 2-16; got ${pixelData.bitsStored} [frame=${frameIndex}, syntax=${syntaxUid}]`,
    );
  }

  if (sampleConstraint === "part1") {
    if (pixelData.samplesPerPixel !== 1 && pixelData.samplesPerPixel !== 3) {
      throw new Error(
        `JPEG2000 Part 1 supports SamplesPerPixel 1 or 3; got ${pixelData.samplesPerPixel} [frame=${frameIndex}, syntax=${syntaxUid}]`,
      );
    }
    return;
  }

  if (pixelData.samplesPerPixel < 1) {
    throw new Error(
      `JPEG2000 multi-component requires SamplesPerPixel >= 1; got ${pixelData.samplesPerPixel} [frame=${frameIndex}, syntax=${syntaxUid}]`,
    );
  }
}

export function stripFramePaddingByte(data: Uint8Array, pixelData: DicomPixelData): Uint8Array {
  const bytesPerSample = Math.ceil(pixelData.bitsAllocated / 8);
  const expectedLength = pixelData.rows * pixelData.columns * pixelData.samplesPerPixel * bytesPerSample;
  return expectedLength > 0 && data.length > expectedLength ? data.subarray(0, expectedLength) : data;
}

export function normalizeDecodeResult(
  value: Uint8Array | DicomJpeg2000DecodeResult,
): { pixelData: Uint8Array; metadata?: DicomJpeg2000DecodedMetadata } {
  if (value instanceof Uint8Array) {
    return { pixelData: value };
  }
  if (value.metadata === undefined) {
    return { pixelData: value.pixelData };
  }
  return { pixelData: value.pixelData, metadata: value.metadata };
}

export function validateDecodedFrame(
  decoded: Uint8Array,
  metadata: DicomJpeg2000DecodedMetadata | undefined,
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
    throw new Error(
      `JPEG2000 decoded frame length mismatch: decoded=${normalized.length}, expected=${expectedLength} [frame=${frameIndex}, syntax=${syntaxUid}]`,
    );
  }

  if (metadata) {
    if (metadata.width !== undefined && metadata.width !== pixelData.columns) {
      throw new Error(
        `JPEG2000 decoded width mismatch: decoded=${metadata.width}, expected=${pixelData.columns} [frame=${frameIndex}, syntax=${syntaxUid}]`,
      );
    }

    if (metadata.height !== undefined && metadata.height !== pixelData.rows) {
      throw new Error(
        `JPEG2000 decoded height mismatch: decoded=${metadata.height}, expected=${pixelData.rows} [frame=${frameIndex}, syntax=${syntaxUid}]`,
      );
    }

    if (metadata.components !== undefined && metadata.components !== pixelData.samplesPerPixel) {
      throw new Error(
        `JPEG2000 decoded component mismatch: decoded=${metadata.components}, expected=${pixelData.samplesPerPixel} [frame=${frameIndex}, syntax=${syntaxUid}]`,
      );
    }

    if (metadata.bitsStored !== undefined && metadata.bitsStored !== pixelData.bitsStored) {
      throw new Error(
        `JPEG2000 decoded bitsStored mismatch: decoded=${metadata.bitsStored}, expected=${pixelData.bitsStored} [frame=${frameIndex}, syntax=${syntaxUid}]`,
      );
    }
  }

  return normalized;
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

export function readRawFrameForEncode(pixelData: DicomPixelData, frameIndex: number): IByteBuffer {
  return pixelData.getFrame(frameIndex);
}
