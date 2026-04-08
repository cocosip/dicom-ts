import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import * as Tags from "../../src/core/DicomTag.generated.js";
import * as DicomUIDs from "../../src/core/DicomUID.generated.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomFile } from "../../src/DicomFile.js";
import {
  AAssociateRJ,
  AdvancedDicomClientConnection,
  DicomCEchoProvider,
  DicomCEchoRequest,
  DicomCEchoResponse,
  DicomCFindRequest,
  DicomCFindResponse,
  DicomCGetRequest,
  DicomCGetResponse,
  DicomClient,
  DicomCMoveRequest,
  DicomCMoveResponse,
  DicomCStoreRequest,
  DicomCStoreResponse,
  DicomRejectReason,
  DicomRejectResult,
  DicomRejectSource,
  DicomService,
  DicomStatus,
  DicomServerFactory,
  DefaultTlsAcceptor,
  DefaultTlsInitiator,
  DicomQueryRetrieveLevel,
  type DicomAssociation,
  type DicomServiceOptions,
  type IDicomCFindProvider,
  type IDicomCGetProvider,
  type IDicomCMoveProvider,
  type IDicomCStoreProvider,
  type IDicomServer,
  type IDicomServiceProvider,
} from "../../src/network/index.js";

class FullIntegrationProvider extends DicomCEchoProvider
implements IDicomCStoreProvider, IDicomCFindProvider, IDicomCGetProvider, IDicomCMoveProvider {
  static storedSopInstanceUid = "";

  static reset(): void {
    FullIntegrationProvider.storedSopInstanceUid = "";
  }

  constructor(association?: DicomAssociation, options: DicomServiceOptions = {}) {
    super(association, options);
  }

  async onCStoreRequest(request: DicomCStoreRequest): Promise<DicomCStoreResponse> {
    FullIntegrationProvider.storedSopInstanceUid = request.sopInstanceUID?.uid ?? "";
    return new DicomCStoreResponse(request, DicomStatus.Success.code);
  }

  async onCStoreRequestException(): Promise<void> {
    // no-op
  }

  async *onCFindRequest(request: DicomCFindRequest): AsyncIterable<DicomCFindResponse> {
    const pending = new DicomCFindResponse(request, DicomStatus.Pending.code);
    pending.dataset = new DicomDataset();
    pending.dataset.addOrUpdateValue(Tags.PatientName, "Integration^Patient");
    pending.remaining = 1;
    yield pending;

    yield new DicomCFindResponse(request, DicomStatus.Success.code);
  }

  async *onCGetRequest(request: DicomCGetRequest): AsyncIterable<DicomCGetResponse> {
    const pending = new DicomCGetResponse(request, DicomStatus.Pending.code);
    pending.remaining = 1;
    pending.completed = 0;
    yield pending;

    const success = new DicomCGetResponse(request, DicomStatus.Success.code);
    success.remaining = 0;
    success.completed = 1;
    yield success;
  }

  async *onCMoveRequest(request: DicomCMoveRequest): AsyncIterable<DicomCMoveResponse> {
    const pending = new DicomCMoveResponse(request, DicomStatus.Pending.code);
    pending.remaining = 1;
    pending.completed = 0;
    yield pending;

    const success = new DicomCMoveResponse(request, DicomStatus.Success.code);
    success.remaining = 0;
    success.completed = 1;
    yield success;
  }
}

class RejectAssociationProvider extends DicomService implements IDicomServiceProvider {
  constructor(association?: DicomAssociation, options: DicomServiceOptions = {}) {
    super(association, {
      ...options,
      autoSendAssociationAccept: false,
    });
  }

  async onReceiveAssociationRequest(): Promise<void> {
    await this.sendPDU(new AAssociateRJ(
      DicomRejectResult.Permanent,
      DicomRejectSource.ServiceUser,
      DicomRejectReason.CalledAENotRecognized,
    ));
    this.disconnect();
  }

  async onReceiveAssociationReleaseRequest(): Promise<void> {
    // no-op
  }

  onReceiveAbort(_source: unknown, _reason: unknown): void {
    // no-op
  }

  onConnectionClosed(_error: Error | null): void {
    // no-op
  }
}

class SlowEchoProvider extends DicomCEchoProvider {
  override async onCEchoRequest(request: DicomCEchoRequest): Promise<DicomCEchoResponse> {
    await delay(300);
    return await super.onCEchoRequest(request);
  }
}

class SlowPendingFindProvider extends DicomCEchoProvider implements IDicomCFindProvider {
  async *onCFindRequest(request: DicomCFindRequest): AsyncIterable<DicomCFindResponse> {
    for (let index = 0; index < 3; index += 1) {
      const pending = new DicomCFindResponse(request, DicomStatus.Pending.code);
      pending.dataset = new DicomDataset();
      pending.dataset.addOrUpdateValue(Tags.PatientName, `Pending^${index + 1}`);
      pending.remaining = 3 - index;
      yield pending;
      await delay(40);
    }

    yield new DicomCFindResponse(request, DicomStatus.Success.code);
  }
}

class SilentAssociationProvider extends DicomService {
  constructor(association?: DicomAssociation, options: DicomServiceOptions = {}) {
    super(association, {
      ...options,
      autoSendAssociationAccept: false,
    });
  }
}

class CGetRetrieveProvider extends DicomCEchoProvider implements IDicomCGetProvider {
  static retrievedSopInstanceUid = "";

  static reset(): void {
    CGetRetrieveProvider.retrievedSopInstanceUid = "";
  }

  async *onCGetRequest(request: DicomCGetRequest): AsyncIterable<DicomCGetResponse> {
    const pending = new DicomCGetResponse(request, DicomStatus.Pending.code);
    pending.remaining = 1;
    pending.completed = 0;
    yield pending;

    const dataset = new DicomDataset();
    dataset.addOrUpdateValue(Tags.SOPClassUID, DicomUIDs.CTImageStorage.uid);
    dataset.addOrUpdateValue(Tags.SOPInstanceUID, "1.2.826.0.1.3680043.2.1125.400.1");
    dataset.addOrUpdateValue(Tags.PatientName, "Get^Retrieved");

    const storeRequest = new DicomCStoreRequest(new DicomFile(dataset));
    const storeResponse = await waitForSubOperationResponse(this, storeRequest);
    if (storeResponse.status !== DicomStatus.Success.code) {
      const failure = new DicomCGetResponse(request, DicomStatus.QueryRetrieveUnableToPerformSuboperations.code);
      failure.remaining = 0;
      failure.completed = 0;
      failure.failures = 1;
      yield failure;
      return;
    }

    const success = new DicomCGetResponse(request, DicomStatus.Success.code);
    success.remaining = 0;
    success.completed = 1;
    yield success;
  }
}

describe("Network integration e2e", () => {
  const servers: IDicomServer[] = [];

  afterEach(async () => {
    while (servers.length > 0) {
      await servers.pop()!.stop();
    }
    FullIntegrationProvider.reset();
    CGetRetrieveProvider.reset();
  });

  it("supports C-STORE end-to-end and invokes provider", async () => {
    const server = DicomServerFactory.createForService(FullIntegrationProvider, { host: "127.0.0.1", port: 0 });
    servers.push(server);
    await server.start();

    const dataset = new DicomDataset();
    dataset.addOrUpdateValue(Tags.SOPClassUID, DicomUIDs.CTImageStorage.uid);
    dataset.addOrUpdateValue(Tags.SOPInstanceUID, "1.2.826.0.1.3680043.2.1125.99.1");
    dataset.addOrUpdateValue(Tags.PatientName, "Store^Target");

    const request = new DicomCStoreRequest(new DicomFile(dataset));
    let responseStatus = -1;
    request.onResponseReceived = (_rq, rsp) => {
      responseStatus = rsp.status;
    };

    const client = new DicomClient();
    client.addRequest(request);
    await client.sendAsync("127.0.0.1", server.port, "SCU", "SCP");

    expect(responseStatus).toBe(DicomStatus.Success.code);
    expect(FullIntegrationProvider.storedSopInstanceUid).toBe("1.2.826.0.1.3680043.2.1125.99.1");
  });

  it("supports C-FIND/C-GET/C-MOVE end-to-end with pending+success flows", async () => {
    const server = DicomServerFactory.createForService(FullIntegrationProvider, { host: "127.0.0.1", port: 0 });
    servers.push(server);
    await server.start();

    const cFindStatuses: number[] = [];
    let cFindPendingName = "";
    const cFind = new DicomCFindRequest(DicomQueryRetrieveLevel.Study);
    cFind.onResponseReceived = (_rq, rsp) => {
      cFindStatuses.push(rsp.status);
      if (rsp.status === DicomStatus.Pending.code) {
        cFindPendingName = rsp.dataset?.tryGetString(Tags.PatientName) ?? "";
      }
    };

    const cGetStatuses: number[] = [];
    let cGetCompleted = -1;
    const cGet = new DicomCGetRequest("1.2.3");
    cGet.onResponseReceived = (_rq, rsp) => {
      cGetStatuses.push(rsp.status);
      cGetCompleted = rsp.completed;
    };

    const cMoveStatuses: number[] = [];
    let cMoveCompleted = -1;
    const cMove = new DicomCMoveRequest("DEST_AE", "1.2.3");
    cMove.onResponseReceived = (_rq, rsp) => {
      cMoveStatuses.push(rsp.status);
      cMoveCompleted = rsp.completed;
    };

    const client = new DicomClient();
    client.addRequest(cFind);
    client.addRequest(cGet);
    client.addRequest(cMove);
    await client.sendAsync("127.0.0.1", server.port, "SCU", "SCP");

    expect(cFindStatuses).toEqual([DicomStatus.Pending.code, DicomStatus.Success.code]);
    expect(cFindPendingName).toBe("Integration^Patient");
    expect(cGetStatuses).toEqual([DicomStatus.Pending.code, DicomStatus.Success.code]);
    expect(cGetCompleted).toBe(1);
    expect(cMoveStatuses).toEqual([DicomStatus.Pending.code, DicomStatus.Success.code]);
    expect(cMoveCompleted).toBe(1);
  });

  it("supports C-GET with inbound C-STORE sub-operations on the client association", async () => {
    const server = DicomServerFactory.createForService(CGetRetrieveProvider, { host: "127.0.0.1", port: 0 });
    servers.push(server);
    await server.start();

    const connection = await AdvancedDicomClientConnection.open({
      host: "127.0.0.1",
      port: server.port,
      callingAE: "GET_SCU",
      calledAE: "GET_SCP",
    });

    try {
      connection.association.presentationContexts.addPresentationContext(
        DicomUIDs.CTImageStorage,
        [
          DicomTransferSyntax.ExplicitVRLittleEndian,
          DicomTransferSyntax.ImplicitVRLittleEndian,
        ],
        false,
        true,
      );

      connection.connection.cStoreRequestHandler = async (request) => {
        CGetRetrieveProvider.retrievedSopInstanceUid = request.sopInstanceUID?.uid ?? "";
        return new DicomCStoreResponse(request, DicomStatus.Success.code);
      };

      const statuses: number[] = [];
      const request = new DicomCGetRequest("1.2.3");
      request.onResponseReceived = (_rq, rsp) => {
        statuses.push(rsp.status);
      };

      connection.connection.prepareRequest(request);
      await connection.requestAssociation();
      const responses = await connection.sendRequest(request);

      expect(statuses).toEqual([DicomStatus.Pending.code, DicomStatus.Success.code]);
      expect(responses.map((response) => response.status)).toEqual([DicomStatus.Pending.code, DicomStatus.Success.code]);
      expect(CGetRetrieveProvider.retrievedSopInstanceUid).toBe("1.2.826.0.1.3680043.2.1125.400.1");
    } finally {
      await connection.close();
    }
  });

  it("fails association negotiation when server rejects A-ASSOCIATE", async () => {
    const server = DicomServerFactory.createForService(RejectAssociationProvider, { host: "127.0.0.1", port: 0 });
    servers.push(server);
    await server.start();

    const client = new DicomClient();
    client.addRequest(new DicomCEchoRequest());

    await expect(client.sendAsync("127.0.0.1", server.port, "SCU", "REJECT_AE"))
      .rejects
      .toThrow("Association rejected");
  });

  it("times out request when SCP response is too slow", async () => {
    const server = DicomServerFactory.createForService(SlowEchoProvider, { host: "127.0.0.1", port: 0 });
    servers.push(server);
    await server.start();

    const client = new DicomClient({ requestTimeoutMs: 50 });
    client.addRequest(new DicomCEchoRequest());

    await expect(client.sendAsync("127.0.0.1", server.port, "SCU", "SCP"))
      .rejects
      .toThrow("Timed out waiting for response");
  });

  it("keeps long-running requests alive while pending responses continue arriving", async () => {
    const server = DicomServerFactory.createForService(SlowPendingFindProvider, { host: "127.0.0.1", port: 0 });
    servers.push(server);
    await server.start();

    const statuses: number[] = [];
    const names: string[] = [];
    const request = new DicomCFindRequest(DicomQueryRetrieveLevel.Study);
    request.onResponseReceived = (_rq, rsp) => {
      statuses.push(rsp.status);
      const name = rsp.dataset?.tryGetString(Tags.PatientName);
      if (name) {
        names.push(name);
      }
    };

    const client = new DicomClient({ requestTimeoutMs: 60 });
    client.addRequest(request);

    await client.sendAsync("127.0.0.1", server.port, "SCU", "SCP");

    expect(statuses).toEqual([
      DicomStatus.Pending.code,
      DicomStatus.Pending.code,
      DicomStatus.Pending.code,
      DicomStatus.Success.code,
    ]);
    expect(names).toEqual(["Pending^1", "Pending^2", "Pending^3"]);
  });

  it("times out association negotiation when SCP does not reply to A-ASSOCIATE", async () => {
    const server = DicomServerFactory.createForService(SilentAssociationProvider, { host: "127.0.0.1", port: 0 });
    servers.push(server);
    await server.start();

    const client = new DicomClient({ associationRequestTimeoutMs: 80 });
    client.addRequest(new DicomCEchoRequest());

    await expect(client.sendAsync("127.0.0.1", server.port, "SCU", "SCP"))
      .rejects
      .toThrow("Timed out waiting for A-ASSOCIATE response");
  });

  it("times out association release when SCP does not send A-RELEASE-RP", async () => {
    const server = DicomServerFactory.createForService(DicomCEchoProvider, {
      host: "127.0.0.1",
      port: 0,
      serviceOptions: {
        autoSendReleaseResponse: false,
        closeSocketOnRelease: false,
      },
    });
    servers.push(server);
    await server.start();

    const request = new DicomCEchoRequest();
    let status = -1;
    request.onResponseReceived = (_rq, rsp) => {
      status = rsp.status;
    };

    const client = new DicomClient({
      associationReleaseTimeoutMs: 80,
      associationLingerTimeoutMs: 0,
    });
    client.addRequest(request);

    await expect(client.sendAsync("127.0.0.1", server.port, "SCU", "SCP"))
      .rejects
      .toThrow("Timed out waiting for A-RELEASE-RP");
    expect(status).toBe(DicomStatus.Success.code);
  });

  it("supports real TLS transport using default initiator/acceptor", async () => {
    const pfxPath = resolve("source-code/fo-dicom/Tests/FO-DICOM.Tests/Test Data/FellowOakDicom.pfx");
    const pfx = readFileSync(pfxPath);
    const tlsAcceptor = new DefaultTlsAcceptor({
      tlsOptions: {
        pfx,
        passphrase: "FellowOakDicom",
      },
    });
    const tlsInitiator = new DefaultTlsInitiator({
      ignoreCertificateErrors: true,
    });

    const server = DicomServerFactory.createForService(FullIntegrationProvider, {
      host: "127.0.0.1",
      port: 0,
      tls: true,
      tlsAcceptor,
    });
    servers.push(server);
    await server.start();

    const request = new DicomCEchoRequest();
    let status = -1;
    request.onResponseReceived = (_rq, rsp) => {
      status = rsp.status;
    };

    const client = new DicomClient({
      tlsInitiator,
    });
    client.addRequest(request);
    await client.sendAsync("127.0.0.1", server.port, "SCU", "SCP");

    expect(status).toBe(DicomStatus.Success.code);
  });

  it("rejects TLS handshake when certificate validation is enabled", async () => {
    const pfxPath = resolve("source-code/fo-dicom/Tests/FO-DICOM.Tests/Test Data/FellowOakDicom.pfx");
    const pfx = readFileSync(pfxPath);
    const tlsAcceptor = new DefaultTlsAcceptor({
      tlsOptions: {
        pfx,
        passphrase: "FellowOakDicom",
      },
    });

    const server = DicomServerFactory.createForService(FullIntegrationProvider, {
      host: "127.0.0.1",
      port: 0,
      tls: true,
      tlsAcceptor,
    });
    servers.push(server);
    await server.start();

    const client = new DicomClient({
      tlsInitiator: new DefaultTlsInitiator(),
      connectTimeoutMs: 2_000,
    });
    client.addRequest(new DicomCEchoRequest());

    await expect(client.sendAsync("127.0.0.1", server.port, "SCU", "SCP"))
      .rejects
      .toThrow(/certificate|self signed|unable to verify/i);
  });
});

async function delay(ms: number): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function waitForSubOperationResponse(service: DicomService, request: DicomCStoreRequest): Promise<DicomCStoreResponse> {
  return await new Promise<DicomCStoreResponse>((resolve, reject) => {
    let settled = false;
    request.onResponseReceived = (_rq, rsp) => {
      if (settled) {
        return;
      }
      settled = true;
      resolve(rsp);
    };

    void service.sendRequest(request).catch((error) => {
      if (settled) {
        return;
      }
      settled = true;
      reject(error instanceof Error ? error : new Error(String(error)));
    });
  });
}
