import { describe, expect, it } from "vitest";
import * as DicomUIDs from "../../src/core/DicomUID.generated.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { DicomAssociation } from "../../src/network/DicomAssociation.js";
import { DicomPresentationContextResult } from "../../src/network/DicomPresentationContext.js";
import { DicomServiceApplicationInfo } from "../../src/network/DicomServiceApplicationInfo.js";
import { DicomUserIdentityNegotiation, DicomUserIdentityType } from "../../src/network/DicomUserIdentityNegotiation.js";
import {
  AAbort,
  AAssociateAC,
  AAssociateRJ,
  AAssociateRQ,
  AReleaseRP,
  AReleaseRQ,
  DicomAbortReason,
  DicomAbortSource,
  DicomRejectReason,
  DicomRejectResult,
  DicomRejectSource,
  PDV,
  PDataTF,
  RawPDU,
  RawPduType,
  readPDU,
} from "../../src/network/index.js";

describe("PDU", () => {
  it("supports RawPDU length marking and common header", () => {
    const raw = new RawPDU(RawPduType.A_ABORT);
    raw.writeByte(0x01);
    raw.markLength16();
    raw.writeString("AB");
    raw.writeLength16();

    const bytes = raw.toBytes();
    expect(bytes[0]).toBe(RawPduType.A_ABORT);
    expect(bytes.length).toBe(RawPDU.CommonFieldsLength + 5);

    const { raw: decoded, bytesRead } = RawPDU.fromBytes(bytes);
    expect(bytesRead).toBe(bytes.length);
    expect(decoded.readByte("prefix")).toBe(0x01);
    expect(decoded.readUInt16("length")).toBe(2);
    expect(decoded.readString(2, "payload")).toBe("AB");
  });

  it("round-trips A-ASSOCIATE-RQ", () => {
    const association = new DicomAssociation("SCU", "SCP");
    association.maximumPDULength = 65536;
    association.maxAsyncOpsInvoked = 2;
    association.maxAsyncOpsPerformed = 3;
    association.presentationContexts.addPresentationContext(
      DicomUIDs.Verification,
      [DicomTransferSyntax.ImplicitVRLittleEndian, DicomTransferSyntax.ExplicitVRLittleEndian],
      true,
      false,
    );
    association.extendedNegotiations.add(DicomUIDs.Verification, new DicomServiceApplicationInfo([1, 7]));
    association.userIdentityNegotiation = new DicomUserIdentityNegotiation();
    association.userIdentityNegotiation.userIdentityType = DicomUserIdentityType.UsernameAndPasscode;
    association.userIdentityNegotiation.positiveResponseRequested = true;
    association.userIdentityNegotiation.primaryField = "alice";
    association.userIdentityNegotiation.secondaryField = "secret";

    const bytes = new AAssociateRQ(association).write();
    const parsedAssociation = new DicomAssociation();
    const { pdu } = readPDU(bytes, parsedAssociation);

    expect(pdu).toBeInstanceOf(AAssociateRQ);
    expect(parsedAssociation.callingAE).toBe("SCU");
    expect(parsedAssociation.calledAE).toBe("SCP");
    expect(parsedAssociation.maximumPDULength).toBe(65536);
    expect(parsedAssociation.maxAsyncOpsInvoked).toBe(2);
    expect(parsedAssociation.maxAsyncOpsPerformed).toBe(3);
    expect(parsedAssociation.presentationContexts.count).toBe(1);
    const parsedPc = parsedAssociation.presentationContexts.get(1);
    expect(parsedPc?.getTransferSyntaxes().length).toBe(2);
    expect(parsedPc?.userRole).toBe(true);
    expect(parsedPc?.providerRole).toBe(false);
    expect(parsedAssociation.extendedNegotiations.count).toBe(1);
    expect(parsedAssociation.userIdentityNegotiation?.primaryField).toBe("alice");
    expect(parsedAssociation.userIdentityNegotiation?.secondaryField).toBe("secret");
  });

  it("round-trips A-ASSOCIATE-AC", () => {
    const association = new DicomAssociation("SCU", "SCP");
    const pc = association.presentationContexts.addPresentationContext(
      DicomUIDs.Verification,
      [DicomTransferSyntax.ImplicitVRLittleEndian],
    );
    pc.setResult(DicomPresentationContextResult.Accept, DicomTransferSyntax.ImplicitVRLittleEndian);
    association.maximumPDULength = 32768;
    association.maxAsyncOpsInvoked = 4;
    association.maxAsyncOpsPerformed = 5;
    association.extendedNegotiations.add(DicomUIDs.Verification, new DicomServiceApplicationInfo([1, 2]));
    association.extendedNegotiations.acceptApplicationInfo(DicomUIDs.Verification, new DicomServiceApplicationInfo([9, 8]));
    association.userIdentityNegotiation = new DicomUserIdentityNegotiation();
    association.userIdentityNegotiation.serverResponse = "OK";

    const bytes = new AAssociateAC(association).write();
    const parsedAssociation = new DicomAssociation("SCU", "SCP");
    parsedAssociation.presentationContexts.addPresentationContext(
      DicomUIDs.Verification,
      [DicomTransferSyntax.ImplicitVRLittleEndian],
    );
    parsedAssociation.extendedNegotiations.add(DicomUIDs.Verification, new DicomServiceApplicationInfo([1, 2]));

    const { pdu } = readPDU(bytes, parsedAssociation);
    expect(pdu).toBeInstanceOf(AAssociateAC);
    expect(parsedAssociation.maximumPDULength).toBe(32768);
    expect(parsedAssociation.maxAsyncOpsInvoked).toBe(4);
    expect(parsedAssociation.maxAsyncOpsPerformed).toBe(5);
    expect(parsedAssociation.presentationContexts.get(1)?.result).toBe(DicomPresentationContextResult.Accept);
    expect(parsedAssociation.userIdentityNegotiation?.serverResponse).toBe("OK");
  });

  it("round-trips A-ASSOCIATE-RJ", () => {
    const bytes = new AAssociateRJ(
      DicomRejectResult.Transient,
      DicomRejectSource.ServiceProviderPresentation,
      DicomRejectReason.LocalLimitExceeded,
    ).write();

    const parsed = readPDU(bytes).pdu as AAssociateRJ;
    expect(parsed.result).toBe(DicomRejectResult.Transient);
    expect(parsed.source).toBe(DicomRejectSource.ServiceProviderPresentation);
    expect(parsed.reason).toBe(DicomRejectReason.LocalLimitExceeded);
  });

  it("round-trips A-RELEASE-RQ and A-RELEASE-RP", () => {
    expect(readPDU(new AReleaseRQ().write()).pdu).toBeInstanceOf(AReleaseRQ);
    expect(readPDU(new AReleaseRP().write()).pdu).toBeInstanceOf(AReleaseRP);
  });

  it("round-trips A-ABORT", () => {
    const bytes = new AAbort(DicomAbortSource.ServiceProvider, DicomAbortReason.UnexpectedPDU).write();
    const parsed = readPDU(bytes).pdu as AAbort;
    expect(parsed.source).toBe(DicomAbortSource.ServiceProvider);
    expect(parsed.reason).toBe(DicomAbortReason.UnexpectedPDU);
  });

  it("round-trips P-DATA-TF / PDV fragments", () => {
    const pdu = new PDataTF();
    pdu.addPDV(new PDV(1, new Uint8Array([1, 2, 3, 4]), true, false));
    pdu.addPDV(new PDV(1, new Uint8Array([5, 6]), false, true));

    const parsed = readPDU(pdu.write()).pdu as PDataTF;
    expect(parsed.pdvs.length).toBe(2);
    expect(parsed.pdvs[0]?.isCommand).toBe(true);
    expect(parsed.pdvs[0]?.isLastFragment).toBe(false);
    expect([...parsed.pdvs[1]?.value ?? []]).toEqual([5, 6]);
    expect(parsed.pdvs[1]?.isLastFragment).toBe(true);
  });
});
