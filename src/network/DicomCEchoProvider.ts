import type { DicomAssociation } from "./DicomAssociation.js";
import { DicomCEchoRequest } from "./DicomCEchoRequest.js";
import { DicomCEchoResponse } from "./DicomCEchoResponse.js";
import { DicomService, type DicomServiceOptions } from "./DicomService.js";
import { DicomStatus } from "./DicomStatus.js";
import type { IDicomCEchoProvider } from "./IDicomCEchoProvider.js";
import type { IDicomServiceProvider } from "./IDicomServiceProvider.js";

/**
 * Minimal SCP service that accepts associations and replies success to C-ECHO.
 */
export class DicomCEchoProvider extends DicomService implements IDicomServiceProvider, IDicomCEchoProvider {
  constructor(association?: DicomAssociation, options: DicomServiceOptions = {}) {
    super(association, options);
  }

  async onCEchoRequest(request: DicomCEchoRequest): Promise<DicomCEchoResponse> {
    return new DicomCEchoResponse(request, DicomStatus.Success.code);
  }

  async onReceiveAssociationRequest(_association: DicomAssociation): Promise<void> {
    // Association accept is handled by DicomService auto-send options.
  }

  async onReceiveAssociationReleaseRequest(): Promise<void> {
    // DicomService handles release response and close by default.
  }

  onReceiveAbort(_source: unknown, _reason: unknown): void {
    // no-op default
  }

  onConnectionClosed(_error: Error | null): void {
    // no-op default
  }
}
