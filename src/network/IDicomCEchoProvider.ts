import type { DicomCEchoRequest } from "./DicomCEchoRequest.js";
import type { DicomCEchoResponse } from "./DicomCEchoResponse.js";

/**
 * Interface for C-ECHO service class providers.
 */
export interface IDicomCEchoProvider {
  onCEchoRequest(request: DicomCEchoRequest): Promise<DicomCEchoResponse>;
}
