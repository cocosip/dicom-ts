import type { DicomAssociation } from "./DicomAssociation.js";

/**
 * Interface for DICOM service providers handling association lifecycle events.
 */
export interface IDicomServiceProvider {
  onReceiveAssociationRequest(association: DicomAssociation): Promise<void>;
  onReceiveAssociationReleaseRequest(): Promise<void>;
  onReceiveAbort(source: unknown, reason: unknown): void;
  onConnectionClosed(error: Error | null): void;
}
