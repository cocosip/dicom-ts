import type { DicomNActionRequest } from "./DicomNActionRequest.js";

/**
 * Interface for synchronous N-EVENT-REPORT sending triggered by N-ACTION.
 */
export interface IDicomNEventReportRequestProvider {
  onSendNEventReportRequest(request: DicomNActionRequest): Promise<void>;
}
