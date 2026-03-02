import { describe, expect, it } from "vitest";
import * as Tags from "../../src/core/DicomTag.generated.js";
import * as DicomUIDs from "../../src/core/DicomUID.generated.js";
import { DicomUID, DicomUidType } from "../../src/core/DicomUID.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomUniqueIdentifier } from "../../src/dataset/DicomElement.js";
import { DicomFile } from "../../src/DicomFile.js";
import {
  DicomAssociation,
  DicomCEchoRequest,
  DicomCEchoResponse,
  DicomCFindRequest,
  DicomCFindResponse,
  DicomCGetRequest,
  DicomCGetResponse,
  DicomCMoveRequest,
  DicomCMoveResponse,
  DicomCStoreRequest,
  DicomCStoreResponse,
  DicomNActionRequest,
  DicomNActionResponse,
  DicomNCreateRequest,
  DicomNCreateResponse,
  DicomNDeleteRequest,
  DicomNDeleteResponse,
  DicomNEventReportRequest,
  DicomNEventReportResponse,
  DicomNGetRequest,
  DicomNGetResponse,
  DicomNSetRequest,
  DicomNSetResponse,
  DicomQueryRetrieveLevel,
  DicomStatus,
  type IDicomCEchoProvider,
  type IDicomCFindProvider,
  type IDicomCGetProvider,
  type IDicomCMoveProvider,
  type IDicomCStoreProvider,
  type IDicomNEventReportRequestProvider,
  type IDicomNServiceProvider,
  type IDicomServiceProvider,
} from "../../src/network/index.js";

function instanceUid(uid: string): DicomUID {
  return DicomUID.parse(uid, "Test Instance", DicomUidType.SOPInstance);
}

describe("Network provider interfaces", () => {
  it("supports strongly typed provider contracts", async () => {
    const cEchoProvider: IDicomCEchoProvider = {
      async onCEchoRequest(request) {
        return new DicomCEchoResponse(request, DicomStatus.Success.code);
      },
    };

    const cFindProvider: IDicomCFindProvider = {
      async *onCFindRequest(request) {
        yield new DicomCFindResponse(request, DicomStatus.Pending.code);
        yield new DicomCFindResponse(request, DicomStatus.Success.code);
      },
    };

    const cGetProvider: IDicomCGetProvider = {
      async *onCGetRequest(request) {
        yield new DicomCGetResponse(request, DicomStatus.Pending.code);
      },
    };

    const cMoveProvider: IDicomCMoveProvider = {
      async *onCMoveRequest(request) {
        yield new DicomCMoveResponse(request, DicomStatus.Success.code);
      },
    };

    const cStoreProvider: IDicomCStoreProvider = {
      async onCStoreRequest(request) {
        return new DicomCStoreResponse(request, DicomStatus.Success.code);
      },
      async onCStoreRequestException() {
        // no-op for contract validation
      },
    };

    const nServiceProvider: IDicomNServiceProvider = {
      async onNActionRequest(request) { return new DicomNActionResponse(request, DicomStatus.Success.code); },
      async onNCreateRequest(request) { return new DicomNCreateResponse(request, DicomStatus.Success.code); },
      async onNDeleteRequest(request) { return new DicomNDeleteResponse(request, DicomStatus.Success.code); },
      async onNEventReportRequest(request) { return new DicomNEventReportResponse(request, DicomStatus.Success.code); },
      async onNGetRequest(request) { return new DicomNGetResponse(request, DicomStatus.Success.code); },
      async onNSetRequest(request) { return new DicomNSetResponse(request, DicomStatus.Success.code); },
    };

    const nEventReportProvider: IDicomNEventReportRequestProvider = {
      async onSendNEventReportRequest() {
        // no-op for contract validation
      },
    };

    const serviceProvider: IDicomServiceProvider = {
      async onReceiveAssociationRequest() {
        // no-op for contract validation
      },
      async onReceiveAssociationReleaseRequest() {
        // no-op for contract validation
      },
      onReceiveAbort() {
        // no-op for contract validation
      },
      onConnectionClosed() {
        // no-op for contract validation
      },
    };

    const cEcho = await cEchoProvider.onCEchoRequest(new DicomCEchoRequest());
    expect(cEcho).toBeInstanceOf(DicomCEchoResponse);

    const cFindResponses = [];
    for await (const response of cFindProvider.onCFindRequest(new DicomCFindRequest(DicomQueryRetrieveLevel.Study))) {
      cFindResponses.push(response);
    }
    expect(cFindResponses.length).toBe(2);

    const cGetResponses = [];
    for await (const response of cGetProvider.onCGetRequest(new DicomCGetRequest("1.2.3"))) {
      cGetResponses.push(response);
    }
    expect(cGetResponses.length).toBe(1);

    const cMoveResponses = [];
    for await (const response of cMoveProvider.onCMoveRequest(new DicomCMoveRequest("DEST", "1.2.3"))) {
      cMoveResponses.push(response);
    }
    expect(cMoveResponses.length).toBe(1);

    const dataset = new DicomDataset();
    dataset.addOrUpdate(new DicomUniqueIdentifier(Tags.SOPClassUID, DicomUIDs.CTImageStorage));
    dataset.addOrUpdate(new DicomUniqueIdentifier(Tags.SOPInstanceUID, "1.2.3.4"));
    const cStoreRequest = new DicomCStoreRequest(new DicomFile(dataset));
    expect(await cStoreProvider.onCStoreRequest(cStoreRequest)).toBeInstanceOf(DicomCStoreResponse);

    const nActionRequest = new DicomNActionRequest(DicomUIDs.BasicFilmSession, instanceUid("1.2.3.5"), 1);
    expect(await nServiceProvider.onNActionRequest(nActionRequest)).toBeInstanceOf(DicomNActionResponse);
    expect(await nServiceProvider.onNCreateRequest(new DicomNCreateRequest(DicomUIDs.BasicFilmSession))).toBeInstanceOf(DicomNCreateResponse);
    expect(await nServiceProvider.onNDeleteRequest(new DicomNDeleteRequest(DicomUIDs.BasicFilmSession, instanceUid("1.2.3.6")))).toBeInstanceOf(DicomNDeleteResponse);
    expect(await nServiceProvider.onNEventReportRequest(new DicomNEventReportRequest(DicomUIDs.BasicFilmSession, instanceUid("1.2.3.7"), 2))).toBeInstanceOf(DicomNEventReportResponse);
    expect(await nServiceProvider.onNGetRequest(new DicomNGetRequest(DicomUIDs.BasicFilmSession, instanceUid("1.2.3.8"), [Tags.PatientID]))).toBeInstanceOf(DicomNGetResponse);
    expect(await nServiceProvider.onNSetRequest(new DicomNSetRequest(DicomUIDs.BasicFilmSession, instanceUid("1.2.3.9")))).toBeInstanceOf(DicomNSetResponse);

    await nEventReportProvider.onSendNEventReportRequest(nActionRequest);
    await serviceProvider.onReceiveAssociationRequest(new DicomAssociation("SCU", "SCP"));
    await serviceProvider.onReceiveAssociationReleaseRequest();
    serviceProvider.onReceiveAbort("ServiceUser", "NotSpecified");
    serviceProvider.onConnectionClosed(null);
  });
});
