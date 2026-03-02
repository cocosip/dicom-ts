import type { DicomCFindRequest } from "./DicomCFindRequest.js";
import type { DicomCFindResponse } from "./DicomCFindResponse.js";

/**
 * Interface for C-FIND service class providers.
 */
export interface IDicomCFindProvider {
  onCFindRequest(request: DicomCFindRequest): AsyncIterable<DicomCFindResponse>;
}
