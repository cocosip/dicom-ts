import type { DicomCStoreRequest } from "./DicomCStoreRequest.js";
import type { DicomCStoreResponse } from "./DicomCStoreResponse.js";

/**
 * Interface for C-STORE service class providers.
 */
export interface IDicomCStoreProvider {
  onCStoreRequest(request: DicomCStoreRequest): Promise<DicomCStoreResponse>;
  onCStoreRequestException(tempFileName: string | null, error: unknown): Promise<void>;
}
