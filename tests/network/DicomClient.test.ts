import { afterEach, describe, expect, it } from "vitest";
import {
  AdvancedDicomClientAssociation,
  AdvancedDicomClientConnection,
  type DicomAssociation,
  DicomCEchoProvider,
  DicomCEchoRequest,
  DicomClient,
  DicomClientFactory,
  DicomServerFactory,
  DicomStatus,
  type IDicomServer,
} from "../../src/network/index.js";

class CountingEchoProvider extends DicomCEchoProvider {
  static associationRequestCount = 0;
  static cEchoRequestCount = 0;

  static reset(): void {
    CountingEchoProvider.associationRequestCount = 0;
    CountingEchoProvider.cEchoRequestCount = 0;
  }

  override async onCEchoRequest(request: DicomCEchoRequest) {
    CountingEchoProvider.cEchoRequestCount += 1;
    return await super.onCEchoRequest(request);
  }

  override async onReceiveAssociationRequest(association: DicomAssociation): Promise<void> {
    CountingEchoProvider.associationRequestCount += 1;
    await super.onReceiveAssociationRequest(association);
  }
}

describe("DicomClient", () => {
  const servers: IDicomServer[] = [];

  afterEach(async () => {
    while (servers.length > 0) {
      const server = servers.pop()!;
      await server.stop();
    }
    CountingEchoProvider.reset();
  });

  it("sends C-ECHO request end-to-end over DICOM association", async () => {
    const server = DicomServerFactory.createCEchoServer({ host: "127.0.0.1", port: 0 });
    servers.push(server);
    await server.start();

    const client = new DicomClient();
    const request = new DicomCEchoRequest();
    let responseStatus = -1;
    request.onResponseReceived = (_req, response) => {
      responseStatus = response.status;
    };
    client.addRequest(request);

    await client.sendAsync("127.0.0.1", server.port, "SCU", "SCP");
    expect(responseStatus).toBe(DicomStatus.Success.code);
  });

  it("respects maxRequestsPerAssociation and opens multiple associations when needed", async () => {
    const server = DicomServerFactory.createForService(CountingEchoProvider, { host: "127.0.0.1", port: 0 });
    servers.push(server);
    await server.start();

    const client = new DicomClient({ maxRequestsPerAssociation: 1 });
    client.addRequest(new DicomCEchoRequest());
    client.addRequest(new DicomCEchoRequest());
    client.addRequest(new DicomCEchoRequest());

    await client.sendAsync("127.0.0.1", server.port, "SCU", "SCP");

    expect(CountingEchoProvider.cEchoRequestCount).toBe(3);
    expect(CountingEchoProvider.associationRequestCount).toBe(3);
  });

  it("supports advanced connection and advanced association workflows", async () => {
    const server = DicomServerFactory.createCEchoServer({ host: "127.0.0.1", port: 0 });
    servers.push(server);
    await server.start();

    const advancedConnection = await AdvancedDicomClientConnection.open({
      host: "127.0.0.1",
      port: server.port,
      callingAE: "SCU",
      calledAE: "SCP",
    });

    const directResponses = await advancedConnection.sendRequest(new DicomCEchoRequest());
    expect(directResponses).toHaveLength(1);
    expect(directResponses[0]?.status).toBe(DicomStatus.Success.code);
    await advancedConnection.releaseAssociation();
    await advancedConnection.close();

    const advancedAssociation = await AdvancedDicomClientAssociation.open({
      host: "127.0.0.1",
      port: server.port,
      callingAE: "SCU",
      calledAE: "SCP",
    });
    const r1 = new DicomCEchoRequest();
    const r2 = new DicomCEchoRequest();
    advancedAssociation.addRequest(r1);
    advancedAssociation.addRequest(r2);
    const results = await advancedAssociation.sendQueuedRequests();
    expect(results.get(r1.messageID)?.[0]?.status).toBe(DicomStatus.Success.code);
    expect(results.get(r2.messageID)?.[0]?.status).toBe(DicomStatus.Success.code);
    await advancedAssociation.release();
    await advancedAssociation.close();
  });

  it("creates client via factory and sends requests", async () => {
    const server = DicomServerFactory.createCEchoServer({ host: "127.0.0.1", port: 0 });
    servers.push(server);
    await server.start();

    const client = DicomClientFactory.create();
    const request = new DicomCEchoRequest();
    client.addRequest(request);
    await client.sendAsync("127.0.0.1", server.port, "SCU", "SCP");
  });
});
