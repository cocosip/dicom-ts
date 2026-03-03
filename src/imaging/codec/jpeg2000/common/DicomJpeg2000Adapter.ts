import type { DicomTransferSyntax } from "../../../../core/DicomTransferSyntax.js";
import type { PhotometricInterpretation } from "../../../PhotometricInterpretation.js";
import type { PlanarConfiguration } from "../../../PlanarConfiguration.js";
import type { PixelRepresentation } from "../../../PixelRepresentation.js";
import type { DicomJpeg2000Params } from "../DicomJpeg2000Params.js";

/**
 * Per-frame context passed into JPEG2000 adapter implementations.
 */
export interface DicomJpeg2000FrameContext {
  transferSyntax: DicomTransferSyntax;
  parameters: DicomJpeg2000Params;
  samplesPerPixel: number;
  columns: number;
  rows: number;
  bitsAllocated: number;
  bitsStored: number;
  pixelRepresentation: PixelRepresentation;
  photometricInterpretation: PhotometricInterpretation | null;
  planarConfiguration: PlanarConfiguration;
  frameIndex: number;
}

/**
 * Optional decoded metadata for validation against DICOM tags.
 */
export interface DicomJpeg2000DecodedMetadata {
  width?: number;
  height?: number;
  components?: number;
  bitsStored?: number;
}

/**
 * Decode result shape accepted by JPEG2000 codecs.
 */
export interface DicomJpeg2000DecodeResult {
  pixelData: Uint8Array;
  metadata?: DicomJpeg2000DecodedMetadata;
}

/**
 * Adapter interface used by JPEG2000 codec implementations.
 */
export interface DicomJpeg2000Adapter {
  encode(frameData: Uint8Array, context: DicomJpeg2000FrameContext): Uint8Array;
  decode(frameData: Uint8Array, context: DicomJpeg2000FrameContext): Uint8Array | DicomJpeg2000DecodeResult;
}

export function createMissingJpeg2000Adapter(codecName: string): DicomJpeg2000Adapter {
  const throwMissing = (frameIndex: number, syntaxUid: string): never => {
    throw new Error(
      `${codecName} backend is not configured [frame=${frameIndex}, syntax=${syntaxUid}]`,
    );
  };

  return {
    encode(_frameData, context) {
      return throwMissing(context.frameIndex, context.transferSyntax.uid.uid);
    },
    decode(_frameData, context) {
      return throwMissing(context.frameIndex, context.transferSyntax.uid.uid);
    },
  };
}
