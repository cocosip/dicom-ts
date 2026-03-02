import type { DicomCMoveRequest } from "./DicomCMoveRequest.js";
import type { DicomCMoveResponse } from "./DicomCMoveResponse.js";

/**
 * Interface for C-MOVE service class providers.
 */
export interface IDicomCMoveProvider {
  onCMoveRequest(request: DicomCMoveRequest): AsyncIterable<DicomCMoveResponse>;
}
