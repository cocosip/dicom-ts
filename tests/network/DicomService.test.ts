import { describe, expect, it, vi } from "vitest";
import {
  DicomCEchoRequest,
  DicomCEchoResponse,
  DicomCFindRequest,
  DicomCFindResponse,
  DicomQueryRetrieveLevel,
  DicomService,
  DicomStatus,
  type DicomMessage,
  type DicomRequest,
  type DicomResponse,
  type IDicomCEchoProvider,
  type IDicomCFindProvider,
} from "../../src/network/index.js";

class TestDicomService extends DicomService {
  readonly writtenPDUs: unknown[] = [];
  readonly writtenMessages: DicomMessage[] = [];
  readonly unhandledRequests: DicomRequest[] = [];
  readonly orphanResponses: DicomResponse[] = [];
  readonly timedOutRequests: DicomRequest[] = [];
  readonly callbackErrors: Array<{ request: DicomRequest; response: DicomResponse; error: unknown }> = [];

  constructor(options: { requestTimeoutMs?: number; maxPendingRequests?: number } = {}) {
    super(undefined, options);
  }

  protected async writePDU(pdu: unknown): Promise<void> {
    this.writtenPDUs.push(pdu);
  }

  protected async writeDIMSEMessage(message: DicomMessage): Promise<void> {
    this.writtenMessages.push(message);
  }

  protected override async onUnhandledRequest(request: DicomRequest): Promise<void> {
    this.unhandledRequests.push(request);
  }

  protected override async onOrphanResponse(response: DicomResponse): Promise<void> {
    this.orphanResponses.push(response);
  }

  protected override async onRequestTimedOut(request: DicomRequest): Promise<void> {
    this.timedOutRequests.push(request);
  }

  protected override async onRequestCallbackError(request: DicomRequest, response: DicomResponse, error: unknown): Promise<void> {
    this.callbackErrors.push({ request, response, error });
  }
}

class EchoService extends TestDicomService implements IDicomCEchoProvider {
  async onCEchoRequest(request: DicomCEchoRequest): Promise<DicomCEchoResponse> {
    return new DicomCEchoResponse(request, DicomStatus.Success.code);
  }
}

class FindService extends TestDicomService implements IDicomCFindProvider {
  async *onCFindRequest(request: DicomCFindRequest): AsyncIterable<DicomCFindResponse> {
    yield new DicomCFindResponse(request, DicomStatus.Pending.code);
    yield new DicomCFindResponse(request, DicomStatus.Success.code);
  }
}

describe("DicomService", () => {
  it("tracks pending requests and dispatches responses", async () => {
    const service = new TestDicomService();
    const request = new DicomCEchoRequest();
    const onResponseReceived = vi.fn();
    request.onResponseReceived = onResponseReceived;

    await service.sendRequest(request);
    expect(service.pendingRequestCount).toBe(1);
    expect(service.writtenMessages.length).toBe(1);

    await service.receiveDIMSEMessage(new DicomCEchoResponse(request, DicomStatus.Pending.code));
    expect(service.pendingRequestCount).toBe(1);
    expect(request.lastPendingResponseReceived).not.toBeNull();

    await service.receiveDIMSEMessage(new DicomCEchoResponse(request, DicomStatus.Success.code));
    expect(service.pendingRequestCount).toBe(0);
    expect(onResponseReceived).toHaveBeenCalledTimes(2);
  });

  it("routes incoming C-ECHO request to provider and sends response", async () => {
    const service = new EchoService();
    const request = new DicomCEchoRequest();

    await service.receiveDIMSEMessage(request);

    const response = service.writtenMessages.at(-1);
    expect(response).toBeInstanceOf(DicomCEchoResponse);
    expect((response as DicomCEchoResponse).status).toBe(DicomStatus.Success.code);
  });

  it("routes incoming C-FIND request async stream responses", async () => {
    const service = new FindService();
    const request = new DicomCFindRequest(DicomQueryRetrieveLevel.Study);

    await service.receiveDIMSEMessage(request);

    expect(service.writtenMessages.filter((x) => x instanceof DicomCFindResponse).length).toBe(2);
  });

  it("expires timed out pending requests", async () => {
    const service = new TestDicomService({ requestTimeoutMs: 5 });
    const request = new DicomCEchoRequest();

    await service.sendRequest(request);
    request.lastPDUSent = new Date(Date.now() - 200);

    const expired = await service.expireTimedOutRequests();
    expect(expired).toHaveLength(1);
    expect(expired[0]).toBe(request);
    expect(service.pendingRequestCount).toBe(0);
    expect(service.timedOutRequests[0]).toBe(request);
  });

  it("enforces max pending request limit", async () => {
    const service = new TestDicomService({ maxPendingRequests: 1 });
    await service.sendRequest(new DicomCEchoRequest());

    await expect(service.sendRequest(new DicomCEchoRequest())).rejects.toThrow("Pending DIMSE request queue limit reached");
  });

  it("captures orphan responses and callback errors", async () => {
    const service = new TestDicomService();

    const orphanRequest = new DicomCEchoRequest();
    await service.receiveDIMSEMessage(new DicomCEchoResponse(orphanRequest, DicomStatus.Success.code));
    expect(service.orphanResponses).toHaveLength(1);

    const trackedRequest = new DicomCEchoRequest();
    trackedRequest.onResponseReceived = () => {
      throw new Error("callback failure");
    };
    await service.sendRequest(trackedRequest);
    await service.receiveDIMSEMessage(new DicomCEchoResponse(trackedRequest, DicomStatus.Success.code));

    expect(service.callbackErrors).toHaveLength(1);
  });
});
