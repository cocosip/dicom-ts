import type { DicomNActionRequest } from "./DicomNActionRequest.js";
import type { DicomNActionResponse } from "./DicomNActionResponse.js";
import type { DicomNCreateRequest } from "./DicomNCreateRequest.js";
import type { DicomNCreateResponse } from "./DicomNCreateResponse.js";
import type { DicomNDeleteRequest } from "./DicomNDeleteRequest.js";
import type { DicomNDeleteResponse } from "./DicomNDeleteResponse.js";
import type { DicomNEventReportRequest } from "./DicomNEventReportRequest.js";
import type { DicomNEventReportResponse } from "./DicomNEventReportResponse.js";
import type { DicomNGetRequest } from "./DicomNGetRequest.js";
import type { DicomNGetResponse } from "./DicomNGetResponse.js";
import type { DicomNSetRequest } from "./DicomNSetRequest.js";
import type { DicomNSetResponse } from "./DicomNSetResponse.js";

/**
 * Interface for normalized DIMSE service class providers.
 */
export interface IDicomNServiceProvider {
  onNActionRequest(request: DicomNActionRequest): Promise<DicomNActionResponse>;
  onNCreateRequest(request: DicomNCreateRequest): Promise<DicomNCreateResponse>;
  onNDeleteRequest(request: DicomNDeleteRequest): Promise<DicomNDeleteResponse>;
  onNEventReportRequest(request: DicomNEventReportRequest): Promise<DicomNEventReportResponse>;
  onNGetRequest(request: DicomNGetRequest): Promise<DicomNGetResponse>;
  onNSetRequest(request: DicomNSetRequest): Promise<DicomNSetResponse>;
}
