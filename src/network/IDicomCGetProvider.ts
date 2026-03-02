import type { DicomCGetRequest } from "./DicomCGetRequest.js";
import type { DicomCGetResponse } from "./DicomCGetResponse.js";

/**
 * Interface for C-GET service class providers.
 */
export interface IDicomCGetProvider {
  onCGetRequest(request: DicomCGetRequest): AsyncIterable<DicomCGetResponse>;
}
