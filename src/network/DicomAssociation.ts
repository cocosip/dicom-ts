import { DicomImplementation } from "../core/DicomImplementation.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomExtendedNegotiation } from "./DicomExtendedNegotiation.js";
import { DicomExtendedNegotiationCollection } from "./DicomExtendedNegotiationCollection.js";
import { DicomPresentationContextResult } from "./DicomPresentationContext.js";
import { DicomPresentationContextCollection } from "./DicomPresentationContextCollection.js";
import { DicomUserIdentityNegotiation } from "./DicomUserIdentityNegotiation.js";

/**
 * Represents one DICOM association negotiation state.
 */
export class DicomAssociation {
  callingAE = "";
  calledAE = "";

  maxAsyncOpsInvoked = 1;
  maxAsyncOpsPerformed = 1;

  remoteHost = "";
  remotePort = 0;
  remoteImplementationClassUID: DicomUID | null = null;
  remoteImplementationVersion = "";
  maximumPDULength = 0;

  readonly presentationContexts: DicomPresentationContextCollection;
  readonly extendedNegotiations: DicomExtendedNegotiationCollection;
  userIdentityNegotiation: DicomUserIdentityNegotiation | null = null;

  constructor();
  constructor(callingAE: string, calledAE: string);
  constructor(callingAE = "", calledAE = "") {
    this.callingAE = callingAE;
    this.calledAE = calledAE;
    this.presentationContexts = new DicomPresentationContextCollection();
    this.extendedNegotiations = new DicomExtendedNegotiationCollection();
  }

  clone(): DicomAssociation {
    const clone = new DicomAssociation(this.callingAE, this.calledAE);
    clone.maxAsyncOpsInvoked = this.maxAsyncOpsInvoked;
    clone.maxAsyncOpsPerformed = this.maxAsyncOpsPerformed;
    clone.remoteHost = this.remoteHost;
    clone.remotePort = this.remotePort;
    clone.remoteImplementationClassUID = this.remoteImplementationClassUID;
    clone.remoteImplementationVersion = this.remoteImplementationVersion;
    clone.maximumPDULength = this.maximumPDULength;
    clone.userIdentityNegotiation = this.userIdentityNegotiation?.clone() ?? null;

    for (const context of this.presentationContexts) {
      const contextClone = clone.presentationContexts.addPresentationContext(
        context.abstractSyntax,
        context.getTransferSyntaxes(),
        context.userRole,
        context.providerRole,
      );
      if (context.result === DicomPresentationContextResult.Accept) {
        contextClone.setResult(context.result, context.acceptedTransferSyntax ?? undefined);
      } else if (context.result !== DicomPresentationContextResult.Proposed) {
        contextClone.setResult(context.result, context.getTransferSyntaxes()[0]);
      }
    }

    for (const negotiation of this.extendedNegotiations) {
      clone.extendedNegotiations.add(
        new DicomExtendedNegotiation(
          negotiation.sopClassUid,
          negotiation.requestedApplicationInfo?.clone() ?? null,
          negotiation.serviceClassUid,
          ...negotiation.relatedGeneralSopClasses,
        ),
      );
      if (negotiation.acceptedApplicationInfo) {
        clone.extendedNegotiations.acceptApplicationInfo(
          negotiation.sopClassUid,
          negotiation.acceptedApplicationInfo,
        );
      }
    }

    return clone;
  }

  toString(): string {
    const lines: string[] = [
      `Calling AE Title:       ${this.callingAE}`,
      `Called AE Title:        ${this.calledAE}`,
      `Remote host:            ${this.remoteHost}`,
      `Remote port:            ${this.remotePort}`,
      `Implementation Class:   ${(this.remoteImplementationClassUID ?? DicomImplementation.ClassUID).uid}`,
      `Implementation Version: ${this.remoteImplementationVersion || DicomImplementation.Version}`,
      `Maximum PDU Length:     ${this.maximumPDULength}`,
      `Async Ops Invoked:      ${this.maxAsyncOpsInvoked}`,
      `Async Ops Performed:    ${this.maxAsyncOpsPerformed}`,
      `Presentation Contexts:  ${this.presentationContexts.count}`,
    ];

    const userIdentityType = this.userIdentityNegotiation?.userIdentityType ?? null;
    if (userIdentityType !== null) {
      lines.push(`User Identity:          ${DicomUserIdentityNegotiationTypeName[userIdentityType]}`);
    }

    return lines.join("\n");
  }
}

const DicomUserIdentityNegotiationTypeName: Record<number, string> = {
  1: "Username",
  2: "UsernameAndPasscode",
  3: "Kerberos",
  4: "Saml",
  5: "Jwt",
};
