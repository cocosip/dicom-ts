import { describe, expect, it } from "vitest";
import * as Tags from "../../src/core/DicomTag.generated.js";
import * as DicomUIDs from "../../src/core/DicomUID.generated.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomUniqueIdentifier } from "../../src/dataset/DicomElement.js";
import { DicomFile } from "../../src/DicomFile.js";
import {
  DicomAssociation,
  DicomCEchoRequest,
  DicomCEchoResponse,
  DicomCFindRequest,
  DicomCGetRequest,
  DicomCMoveRequest,
  DicomCommandField,
  DicomCStoreRequest,
  DicomExtendedNegotiation,
  DicomPresentationContext,
  DicomPresentationContextCollection,
  DicomPresentationContextResult,
  DicomPriority,
  DicomQueryRetrieveLevel,
  DicomServiceApplicationInfo,
  DicomUserIdentityNegotiation,
  DicomUserIdentityType,
} from "../../src/network/index.js";

describe("Network basics", () => {
  it("accepts transfer syntax in presentation context", () => {
    const context = new DicomPresentationContext(1, DicomUIDs.Verification);
    context.addTransferSyntax(DicomTransferSyntax.ExplicitVRLittleEndian);
    context.addTransferSyntax(DicomTransferSyntax.ImplicitVRLittleEndian);

    const accepted = context.acceptTransferSyntaxes([DicomTransferSyntax.ImplicitVRLittleEndian]);

    expect(accepted).toBe(true);
    expect(context.result).toBe(DicomPresentationContextResult.Accept);
    expect(context.acceptedTransferSyntax).toBe(DicomTransferSyntax.ImplicitVRLittleEndian);
  });

  it("deduplicates presentation contexts in collection", () => {
    const collection = new DicomPresentationContextCollection();
    const first = collection.addPresentationContext(
      DicomUIDs.Verification,
      [DicomTransferSyntax.ImplicitVRLittleEndian],
    );

    const duplicate = new DicomPresentationContext(3, DicomUIDs.Verification);
    duplicate.addTransferSyntax(DicomTransferSyntax.ImplicitVRLittleEndian);
    collection.add(duplicate);

    const second = collection.addPresentationContext(
      DicomUIDs.StudyRootQueryRetrieveInformationModelFind,
      [DicomTransferSyntax.ImplicitVRLittleEndian],
    );

    expect(collection.count).toBe(2);
    expect(first.id).toBe(1);
    expect(second.id).toBe(3);
  });

  it("stores and normalizes service application info fields", () => {
    const info = new DicomServiceApplicationInfo();
    info.add(1, 5);
    info.addOrUpdate(3, 9);

    expect([...info.getValues()]).toEqual([5, 0, 9]);
    expect(info.getValueAsBoolean(2, true)).toBe(false);
  });

  it("filters accepted application info by requested keys", () => {
    const requested = new DicomServiceApplicationInfo([1, 2]);
    const accepted = new DicomServiceApplicationInfo([9, 8, 7]);
    const negotiation = new DicomExtendedNegotiation(DicomUIDs.Verification, requested);

    negotiation.acceptApplicationInfo(accepted);

    expect([...negotiation.acceptedApplicationInfo?.getValues() ?? []]).toEqual([9, 8]);
  });

  it("clones association metadata and contexts", () => {
    const association = new DicomAssociation("SCU", "SCP");
    association.presentationContexts.addPresentationContext(
      DicomUIDs.Verification,
      [DicomTransferSyntax.ImplicitVRLittleEndian],
    );
    const identity = new DicomUserIdentityNegotiation();
    identity.userIdentityType = DicomUserIdentityType.Username;
    identity.primaryField = "alice";
    association.userIdentityNegotiation = identity;

    const clone = association.clone();

    expect(clone).not.toBe(association);
    expect(clone.callingAE).toBe("SCU");
    expect(clone.presentationContexts.count).toBe(1);
    expect(clone.userIdentityNegotiation?.primaryField).toBe("alice");
  });

  it("builds CECHO request/response command fields", () => {
    const request = new DicomCEchoRequest();
    request.dataset = new DicomDataset();
    const response = new DicomCEchoResponse(request, 0x0000);

    expect(request.type).toBe(DicomCommandField.CEchoRequest);
    expect(request.hasDataset).toBe(true);
    expect(response.type).toBe(DicomCommandField.CEchoResponse);
    expect(response.requestMessageID).toBe(request.messageID);
    expect(response.status).toBe(0x0000);
  });

  it("builds CSTORE request from DICOM file", () => {
    const dataset = new DicomDataset();
    dataset.addOrUpdate(new DicomUniqueIdentifier(Tags.SOPClassUID, DicomUIDs.CTImageStorage));
    dataset.addOrUpdate(new DicomUniqueIdentifier(Tags.SOPInstanceUID, "1.2.3.4"));
    const file = new DicomFile(dataset);

    const request = new DicomCStoreRequest(file, DicomPriority.High);

    expect(request.sopClassUID?.uid).toBe(DicomUIDs.CTImageStorage.uid);
    expect(request.sopInstanceUID?.uid).toBe("1.2.3.4");
    expect(request.priority).toBe(DicomPriority.High);
    expect(request.transferSyntax?.uid.uid).toBe(DicomTransferSyntax.ExplicitVRLittleEndian.uid.uid);
  });

  it("initializes query/retrieve requests", () => {
    const find = new DicomCFindRequest(DicomQueryRetrieveLevel.Series);
    const get = new DicomCGetRequest("1.2.study", "1.2.series");
    const move = new DicomCMoveRequest("DEST_AE", "1.2.study", "1.2.series", "1.2.sop");

    expect(find.level).toBe(DicomQueryRetrieveLevel.Series);
    expect(find.sopClassUID?.uid).toBe(DicomUIDs.StudyRootQueryRetrieveInformationModelFind.uid);

    expect(get.level).toBe(DicomQueryRetrieveLevel.Series);
    expect(get.dataset?.getString(Tags.SeriesInstanceUID)).toBe("1.2.series");

    expect(move.level).toBe(DicomQueryRetrieveLevel.Image);
    expect(move.destinationAE).toBe("DEST_AE");
    expect(move.dataset?.getString(Tags.SOPInstanceUID)).toBe("1.2.sop");
  });
});
