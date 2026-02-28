import { DicomUID } from "../core/DicomUID.js";
import { DicomServiceApplicationInfo } from "./DicomServiceApplicationInfo.js";

/**
 * Represents one SOP Class (Common) Extended Negotiation entry.
 */
export class DicomExtendedNegotiation {
  readonly sopClassUid: DicomUID;
  requestedApplicationInfo: DicomServiceApplicationInfo | null;
  acceptedApplicationInfo: DicomServiceApplicationInfo | null;
  serviceClassUid: DicomUID | null;
  readonly relatedGeneralSopClasses: DicomUID[];

  constructor(sopClassUid: DicomUID, applicationInfo?: DicomServiceApplicationInfo | null);
  constructor(sopClassUid: DicomUID, serviceClassUid: DicomUID | null, ...relatedGeneralSopClasses: DicomUID[]);
  constructor(
    sopClassUid: DicomUID,
    applicationInfo: DicomServiceApplicationInfo | null,
    serviceClassUid: DicomUID | null,
    ...relatedGeneralSopClasses: DicomUID[]
  );
  constructor(
    sopClassUid: DicomUID,
    infoOrServiceClass: DicomServiceApplicationInfo | DicomUID | null = null,
    serviceClassUid: DicomUID | null = null,
    ...relatedGeneralSopClasses: DicomUID[]
  ) {
    this.sopClassUid = sopClassUid;
    this.requestedApplicationInfo = null;
    this.acceptedApplicationInfo = null;
    this.serviceClassUid = null;
    this.relatedGeneralSopClasses = [];

    if (infoOrServiceClass instanceof DicomServiceApplicationInfo) {
      this.requestedApplicationInfo = infoOrServiceClass;
      this.serviceClassUid = serviceClassUid;
      this.relatedGeneralSopClasses.push(...relatedGeneralSopClasses);
      return;
    }

    if (infoOrServiceClass instanceof DicomUID) {
      this.serviceClassUid = infoOrServiceClass;
      if (serviceClassUid) {
        this.relatedGeneralSopClasses.push(serviceClassUid, ...relatedGeneralSopClasses);
      } else {
        this.relatedGeneralSopClasses.push(...relatedGeneralSopClasses);
      }
    }
  }

  getApplicationInfo(): string {
    if (this.acceptedApplicationInfo) {
      return `${this.acceptedApplicationInfo.toString()} [Accept]`;
    }
    return `${this.requestedApplicationInfo?.toString() ?? ""} [Proposed]`;
  }

  acceptApplicationInfo(acceptedInfo: DicomServiceApplicationInfo): void {
    if (!this.requestedApplicationInfo) {
      return;
    }

    const filtered = acceptedInfo.clone();
    for (const [index] of filtered) {
      if (!this.requestedApplicationInfo.contains(index)) {
        filtered.remove(index);
      }
    }
    this.acceptedApplicationInfo = filtered;
  }
}
