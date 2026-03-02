import { DicomTransferSyntax } from "../../../../core/DicomTransferSyntax.js";
import { JpegProcess14CodecCore } from "../common/JpegProcess14Common.js";

/**
 * JPEG Lossless Process 14 SV1 (1.2.840.10008.1.2.4.70) codec.
 */
export class DicomJpegProcess14SV1Codec extends JpegProcess14CodecCore {
  constructor() {
    super(DicomTransferSyntax.JPEGProcess14SV1);
  }
}
