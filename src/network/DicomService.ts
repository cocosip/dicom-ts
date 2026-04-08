import { DicomAssociation } from "./DicomAssociation.js";
import { DicomCEchoRequest } from "./DicomCEchoRequest.js";
import { DicomCFindRequest } from "./DicomCFindRequest.js";
import { DicomCGetRequest } from "./DicomCGetRequest.js";
import { DicomCMoveRequest } from "./DicomCMoveRequest.js";
import { DicomCommandField } from "./DicomCommandField.js";
import { DicomCStoreRequest } from "./DicomCStoreRequest.js";
import { DicomMessage } from "./DicomMessage.js";
import { DicomNActionRequest } from "./DicomNActionRequest.js";
import { DicomNCreateRequest } from "./DicomNCreateRequest.js";
import { DicomNDeleteRequest } from "./DicomNDeleteRequest.js";
import { DicomNEventReportRequest } from "./DicomNEventReportRequest.js";
import { DicomNGetRequest } from "./DicomNGetRequest.js";
import { DicomNSetRequest } from "./DicomNSetRequest.js";
import { DicomPresentationContextResult } from "./DicomPresentationContext.js";
import { DicomRequest } from "./DicomRequest.js";
import { DicomResponse } from "./DicomResponse.js";
import { DicomState, DicomStatus } from "./DicomStatus.js";
import { createDimseDecoderState, decodePDataTF, encodeDimseMessage } from "./DimseCodec.js";
import { AAbort, AAssociateAC, AAssociateRQ, AReleaseRP, AReleaseRQ, PDataTF, type PDU, readPDU } from "./PDU.js";
import type { IDicomCEchoProvider } from "./IDicomCEchoProvider.js";
import type { IDicomCFindProvider } from "./IDicomCFindProvider.js";
import type { IDicomCGetProvider } from "./IDicomCGetProvider.js";
import type { IDicomCMoveProvider } from "./IDicomCMoveProvider.js";
import type { IDicomCStoreProvider } from "./IDicomCStoreProvider.js";
import type { IDicomNServiceProvider } from "./IDicomNServiceProvider.js";
import type { IDicomServiceProvider } from "./IDicomServiceProvider.js";
import { DicomTransferSyntax } from "../core/DicomTransferSyntax.js";
import type { Socket } from "node:net";

export interface DicomServiceOptions {
  requestTimeoutMs?: number;
  maxPendingRequests?: number;
  socket?: Socket;
  autoSendAssociationAccept?: boolean;
  autoSendReleaseResponse?: boolean;
  closeSocketOnRelease?: boolean;
}

const DEFAULT_REQUEST_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_PENDING_REQUESTS = 128;
const DEFAULT_AUTO_SEND_ASSOCIATION_ACCEPT = true;
const DEFAULT_AUTO_SEND_RELEASE_RESPONSE = true;
const DEFAULT_CLOSE_SOCKET_ON_RELEASE = true;
const PDU_HEADER_LENGTH = 6;

interface NormalizedDicomServiceOptions {
  requestTimeoutMs: number;
  maxPendingRequests: number;
  autoSendAssociationAccept: boolean;
  autoSendReleaseResponse: boolean;
  closeSocketOnRelease: boolean;
}

/**
 * Base DICOM service skeleton handling queueing, request tracking and DIMSE dispatch.
 */
export abstract class DicomService {
  readonly association: DicomAssociation;

  private readonly pduQueue: unknown[] = [];
  private readonly dimseQueue: DicomMessage[] = [];
  private readonly pendingRequests = new Map<number, DicomRequest>();
  private readonly options: NormalizedDicomServiceOptions;
  private readonly dimseDecoderState = createDimseDecoderState();

  private socket: Socket | null = null;
  private inboundPduBuffer: Uint8Array<ArrayBufferLike> = new Uint8Array(0);
  private socketCloseError: Error | null = null;
  private socketCloseNotified = false;
  private pduReadPipeline: Promise<void> = Promise.resolve();

  private readonly onSocketData = (chunk: Buffer): void => {
    this.pduReadPipeline = this.pduReadPipeline
      .then(async () => this.consumeSocketData(chunk))
      .catch(async (error: unknown) => {
        const normalized = toError(error);
        this.socketCloseError = normalized;
        this.socket?.destroy(normalized);
        await this.onSocketReadPipelineError(normalized);
      });
  };

  private readonly onSocketError = (error: Error): void => {
    this.socketCloseError = error;
  };

  private readonly onSocketClose = (): void => {
    this.notifyConnectionClosed(this.socketCloseError);
  };

  protected constructor(association: DicomAssociation = new DicomAssociation(), options: DicomServiceOptions = {}) {
    this.association = association;
    this.options = {
      requestTimeoutMs: options.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS,
      maxPendingRequests: options.maxPendingRequests ?? DEFAULT_MAX_PENDING_REQUESTS,
      autoSendAssociationAccept: options.autoSendAssociationAccept ?? DEFAULT_AUTO_SEND_ASSOCIATION_ACCEPT,
      autoSendReleaseResponse: options.autoSendReleaseResponse ?? DEFAULT_AUTO_SEND_RELEASE_RESPONSE,
      closeSocketOnRelease: options.closeSocketOnRelease ?? DEFAULT_CLOSE_SOCKET_ON_RELEASE,
    };

    if (options.socket) {
      this.bindSocket(options.socket);
    }
  }

  get queuedPDUCount(): number {
    return this.pduQueue.length;
  }

  get queuedDIMSECount(): number {
    return this.dimseQueue.length;
  }

  get pendingRequestCount(): number {
    return this.pendingRequests.size;
  }

  get isSocketBound(): boolean {
    return this.socket !== null;
  }

  get isSocketOpen(): boolean {
    return !!this.socket && !this.socket.destroyed;
  }

  bindSocket(socket: Socket): void {
    if (this.socket === socket) {
      return;
    }

    if (this.socket) {
      this.socket.off("data", this.onSocketData);
      this.socket.off("error", this.onSocketError);
      this.socket.off("close", this.onSocketClose);
    }

    this.socket = socket;
    this.inboundPduBuffer = new Uint8Array(0);
    this.socketCloseError = null;
    this.socketCloseNotified = false;

    this.association.remoteHost = socket.remoteAddress ?? "";
    this.association.remotePort = socket.remotePort ?? 0;

    socket.on("data", this.onSocketData);
    socket.on("error", this.onSocketError);
    socket.on("close", this.onSocketClose);
  }

  disconnect(): void {
    if (!this.socket || this.socket.destroyed) {
      return;
    }
    this.socket.end();
  }

  /**
   * Enqueue + send raw PDU. The concrete transport writer is implemented by subclass.
   */
  async sendPDU(pdu: unknown): Promise<void> {
    this.enqueuePDU(pdu);
    await this.writePDU(pdu);
  }

  /**
   * Enqueue + send DIMSE request and start pending timeout tracking.
   */
  async sendRequest(request: DicomRequest): Promise<void> {
    await this.expireTimedOutRequests();
    if (this.pendingRequests.size >= this.options.maxPendingRequests) {
      throw new Error(`Pending DIMSE request queue limit reached (${this.options.maxPendingRequests})`);
    }

    request.pendingSince = request.pendingSince ?? new Date();
    request.lastPDUSent = new Date();
    this.pendingRequests.set(request.messageID, request);
    this.enqueueDIMSE(request);

    await this.writeDIMSEMessage(request);
  }

  /**
   * Enqueue + send DIMSE response.
   */
  async sendResponse(response: DicomResponse): Promise<void> {
    response.lastPDUSent = new Date();
    this.enqueueDIMSE(response);
    await this.writeDIMSEMessage(response);
  }

  /**
   * Entry for decoded incoming DIMSE messages from reader pipeline.
   */
  async receiveDIMSEMessage(message: DicomMessage): Promise<void> {
    this.enqueueDIMSE(message);

    if (message instanceof DicomResponse) {
      this.handleIncomingResponse(message);
      return;
    }

    if (message instanceof DicomRequest) {
      await this.handleIncomingRequest(message);
      return;
    }

    await this.onUnsupportedMessage(message);
  }

  /**
   * Return timed out pending requests, without mutating queue.
   */
  collectTimedOutRequests(timeoutMs = this.options.requestTimeoutMs): DicomRequest[] {
    const timedOut: DicomRequest[] = [];
    for (const request of this.pendingRequests.values()) {
      if (request.isTimedOut(timeoutMs)) {
        timedOut.push(request);
      }
    }
    return timedOut;
  }

  /**
   * Remove timed out requests and invoke timeout callback for each.
   */
  async expireTimedOutRequests(timeoutMs = this.options.requestTimeoutMs): Promise<DicomRequest[]> {
    const timedOut = this.collectTimedOutRequests(timeoutMs);
    for (const request of timedOut) {
      this.pendingRequests.delete(request.messageID);
      request.pendingSince = null;
      await this.onRequestTimedOut(request);
    }
    return timedOut;
  }

  protected dequeuePDU(): unknown | undefined {
    return this.pduQueue.shift();
  }

  protected dequeueDIMSE(): DicomMessage | undefined {
    return this.dimseQueue.shift();
  }

  protected getPendingRequest(messageID: number): DicomRequest | null {
    return this.pendingRequests.get(messageID) ?? null;
  }

  protected async writePDU(pdu: unknown): Promise<void> {
    const socket = this.socket;
    if (!socket || socket.destroyed) {
      throw new Error("Cannot write PDU because no active socket is bound.");
    }

    const bytes = serializePDU(pdu);
    await new Promise<void>((resolve, reject) => {
      socket.write(bytes, (error?: Error | null) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  protected async writeDIMSEMessage(message: DicomMessage): Promise<void> {
    const maxPduLength = this.association.maximumPDULength > 0 ? this.association.maximumPDULength : undefined;
    const pDataPdUs = encodeDimseMessage(this.association, message, maxPduLength);
    for (const pdu of pDataPdUs) {
      await this.sendPDU(pdu);
    }
  }

  protected async onUnsupportedMessage(_message: DicomMessage): Promise<void> {
    // default no-op hook for subclasses
  }

  protected async onUnhandledRequest(_request: DicomRequest): Promise<void> {
    // default no-op hook for subclasses
  }

  protected async onOrphanResponse(_response: DicomResponse): Promise<void> {
    // default no-op hook for subclasses
  }

  protected async onRequestTimedOut(_request: DicomRequest): Promise<void> {
    // default no-op hook for subclasses
  }

  protected async onRequestCallbackError(_request: DicomRequest, _response: DicomResponse, _error: unknown): Promise<void> {
    // default no-op hook for subclasses
  }

  protected async onReceivePDU(_pdu: PDU): Promise<void> {
    // default no-op hook for subclasses
  }

  protected async onReceivePDataTF(pdu: PDataTF): Promise<void> {
    const messages = decodePDataTF(this.association, this.dimseDecoderState, pdu);
    for (const message of messages) {
      if (message instanceof DicomRequest) {
        this.enqueueDIMSE(message);
        this.dispatchIncomingRequestDetached(message);
        continue;
      }
      await this.receiveDIMSEMessage(message);
    }
  }

  protected async onSocketReadPipelineError(_error: Error): Promise<void> {
    // default no-op hook for subclasses
  }

  private enqueuePDU(pdu: unknown): void {
    this.pduQueue.push(pdu);
  }

  private enqueueDIMSE(message: DicomMessage): void {
    this.dimseQueue.push(message);
  }

  private handleIncomingResponse(response: DicomResponse): void {
    const request = this.pendingRequests.get(response.requestMessageID);
    if (!request) {
      void this.onOrphanResponse(response);
      return;
    }

    const state = DicomStatus.lookup(response.status).state;
    if (state === DicomState.Pending) {
      request.lastPendingResponseReceived = new Date();
    } else {
      this.pendingRequests.delete(response.requestMessageID);
      request.pendingSince = null;
      request.lastPendingResponseReceived = new Date();
    }

    try {
      request.dispatchResponse(response);
    } catch (error) {
      void this.onRequestCallbackError(request, response, error);
    }
  }

  private async handleIncomingRequest(request: DicomRequest): Promise<void> {
    switch (request.type) {
      case DicomCommandField.CEchoRequest:
        await this.dispatchCEcho(request);
        return;
      case DicomCommandField.CStoreRequest:
        await this.dispatchCStore(request);
        return;
      case DicomCommandField.CFindRequest:
        await this.dispatchCFind(request);
        return;
      case DicomCommandField.CGetRequest:
        await this.dispatchCGet(request);
        return;
      case DicomCommandField.CMoveRequest:
        await this.dispatchCMove(request);
        return;
      case DicomCommandField.NActionRequest:
        await this.dispatchNAction(request);
        return;
      case DicomCommandField.NCreateRequest:
        await this.dispatchNCreate(request);
        return;
      case DicomCommandField.NDeleteRequest:
        await this.dispatchNDelete(request);
        return;
      case DicomCommandField.NEventReportRequest:
        await this.dispatchNEventReport(request);
        return;
      case DicomCommandField.NGetRequest:
        await this.dispatchNGet(request);
        return;
      case DicomCommandField.NSetRequest:
        await this.dispatchNSet(request);
        return;
      default:
        await this.onUnhandledRequest(request);
    }
  }

  private dispatchIncomingRequestDetached(request: DicomRequest): void {
    void this.handleIncomingRequest(request).catch((error: unknown) => {
      const normalized = toError(error);
      this.socketCloseError = normalized;
      this.socket?.destroy(normalized);
    });
  }

  private async dispatchCEcho(request: DicomRequest): Promise<void> {
    if (!isCEchoProvider(this)) {
      await this.onUnhandledRequest(request);
      return;
    }
    const typed = request instanceof DicomCEchoRequest ? request : new DicomCEchoRequest(request.command);
    await this.sendResponse(await this.onCEchoRequest(typed));
  }

  private async dispatchCStore(request: DicomRequest): Promise<void> {
    if (!isCStoreProvider(this)) {
      await this.onUnhandledRequest(request);
      return;
    }
    const typed = request instanceof DicomCStoreRequest ? request : new DicomCStoreRequest(request.command);
    await this.sendResponse(await this.onCStoreRequest(typed));
  }

  private async dispatchCFind(request: DicomRequest): Promise<void> {
    if (!isCFindProvider(this)) {
      await this.onUnhandledRequest(request);
      return;
    }
    const typed = request instanceof DicomCFindRequest ? request : new DicomCFindRequest(request.command);
    for await (const response of this.onCFindRequest(typed)) {
      await this.sendResponse(response);
    }
  }

  private async dispatchCGet(request: DicomRequest): Promise<void> {
    if (!isCGetProvider(this)) {
      await this.onUnhandledRequest(request);
      return;
    }
    const typed = request instanceof DicomCGetRequest ? request : new DicomCGetRequest(request.command);
    for await (const response of this.onCGetRequest(typed)) {
      await this.sendResponse(response);
    }
  }

  private async dispatchCMove(request: DicomRequest): Promise<void> {
    if (!isCMoveProvider(this)) {
      await this.onUnhandledRequest(request);
      return;
    }
    const typed = request instanceof DicomCMoveRequest ? request : new DicomCMoveRequest(request.command);
    for await (const response of this.onCMoveRequest(typed)) {
      await this.sendResponse(response);
    }
  }

  private async dispatchNAction(request: DicomRequest): Promise<void> {
    if (!isNServiceProvider(this)) {
      await this.onUnhandledRequest(request);
      return;
    }
    const typed = request instanceof DicomNActionRequest ? request : new DicomNActionRequest(request.command);
    await this.sendResponse(await this.onNActionRequest(typed));
  }

  private async dispatchNCreate(request: DicomRequest): Promise<void> {
    if (!isNServiceProvider(this)) {
      await this.onUnhandledRequest(request);
      return;
    }
    const typed = request instanceof DicomNCreateRequest ? request : new DicomNCreateRequest(request.command);
    await this.sendResponse(await this.onNCreateRequest(typed));
  }

  private async dispatchNDelete(request: DicomRequest): Promise<void> {
    if (!isNServiceProvider(this)) {
      await this.onUnhandledRequest(request);
      return;
    }
    const typed = request instanceof DicomNDeleteRequest ? request : new DicomNDeleteRequest(request.command);
    await this.sendResponse(await this.onNDeleteRequest(typed));
  }

  private async dispatchNEventReport(request: DicomRequest): Promise<void> {
    if (!isNServiceProvider(this)) {
      await this.onUnhandledRequest(request);
      return;
    }
    const typed = request instanceof DicomNEventReportRequest ? request : new DicomNEventReportRequest(request.command);
    await this.sendResponse(await this.onNEventReportRequest(typed));
  }

  private async dispatchNGet(request: DicomRequest): Promise<void> {
    if (!isNServiceProvider(this)) {
      await this.onUnhandledRequest(request);
      return;
    }
    const typed = request instanceof DicomNGetRequest ? request : new DicomNGetRequest(request.command);
    await this.sendResponse(await this.onNGetRequest(typed));
  }

  private async dispatchNSet(request: DicomRequest): Promise<void> {
    if (!isNServiceProvider(this)) {
      await this.onUnhandledRequest(request);
      return;
    }
    const typed = request instanceof DicomNSetRequest ? request : new DicomNSetRequest(request.command);
    await this.sendResponse(await this.onNSetRequest(typed));
  }

  private async consumeSocketData(chunk: Buffer): Promise<void> {
    if (chunk.length === 0) {
      return;
    }

    this.inboundPduBuffer = concatBytes(this.inboundPduBuffer, Uint8Array.from(chunk));

    while (this.inboundPduBuffer.length >= PDU_HEADER_LENGTH) {
      const pduLength = readUInt32BE(this.inboundPduBuffer, 2);
      const totalLength = PDU_HEADER_LENGTH + pduLength;
      if (this.inboundPduBuffer.length < totalLength) {
        return;
      }

      const frame = Uint8Array.from(this.inboundPduBuffer.slice(0, totalLength));
      this.inboundPduBuffer = this.inboundPduBuffer.slice(totalLength);

      const { pdu } = readPDU(frame, this.association);
      await this.handleIncomingPDU(pdu);
    }
  }

  private async handleIncomingPDU(pdu: PDU): Promise<void> {
    this.enqueuePDU(pdu);
    await this.onReceivePDU(pdu);

    if (pdu instanceof AAssociateRQ) {
      if (isServiceProvider(this)) {
        await this.onReceiveAssociationRequest(this.association);
      }

      if (this.options.autoSendAssociationAccept) {
        this.acceptProposedPresentationContexts();
        await this.sendPDU(new AAssociateAC(this.association));
      }
      return;
    }

    if (pdu instanceof AReleaseRQ) {
      if (isServiceProvider(this)) {
        await this.onReceiveAssociationReleaseRequest();
      }

      if (this.options.autoSendReleaseResponse) {
        await this.sendPDU(new AReleaseRP());
      }
      if (this.options.closeSocketOnRelease) {
        this.disconnect();
      }
      return;
    }

    if (pdu instanceof AAbort) {
      if (isServiceProvider(this)) {
        this.onReceiveAbort(pdu.source, pdu.reason);
      }
      if (this.options.closeSocketOnRelease) {
        this.socket?.destroy();
      }
      return;
    }

    if (pdu instanceof PDataTF) {
      await this.onReceivePDataTF(pdu);
    }
  }

  private acceptProposedPresentationContexts(): void {
    for (const context of this.association.presentationContexts) {
      if (context.result !== DicomPresentationContextResult.Proposed) {
        continue;
      }

      const acceptedSyntax = context.getTransferSyntaxes()[0] ?? DicomTransferSyntax.ImplicitVRLittleEndian;
      context.setResult(DicomPresentationContextResult.Accept, acceptedSyntax);
    }
  }

  private notifyConnectionClosed(error: Error | null): void {
    if (this.socketCloseNotified) {
      return;
    }
    this.socketCloseNotified = true;
    if (isServiceProvider(this)) {
      this.onConnectionClosed(error);
    }
  }
}

function isCEchoProvider(service: DicomService): service is DicomService & IDicomCEchoProvider {
  return typeof (service as Partial<IDicomCEchoProvider>).onCEchoRequest === "function";
}

function isCStoreProvider(service: DicomService): service is DicomService & IDicomCStoreProvider {
  return typeof (service as Partial<IDicomCStoreProvider>).onCStoreRequest === "function";
}

function isCFindProvider(service: DicomService): service is DicomService & IDicomCFindProvider {
  return typeof (service as Partial<IDicomCFindProvider>).onCFindRequest === "function";
}

function isCGetProvider(service: DicomService): service is DicomService & IDicomCGetProvider {
  return typeof (service as Partial<IDicomCGetProvider>).onCGetRequest === "function";
}

function isCMoveProvider(service: DicomService): service is DicomService & IDicomCMoveProvider {
  return typeof (service as Partial<IDicomCMoveProvider>).onCMoveRequest === "function";
}

function isNServiceProvider(service: DicomService): service is DicomService & IDicomNServiceProvider {
  const candidate = service as Partial<IDicomNServiceProvider>;
  return typeof candidate.onNActionRequest === "function"
    && typeof candidate.onNCreateRequest === "function"
    && typeof candidate.onNDeleteRequest === "function"
    && typeof candidate.onNEventReportRequest === "function"
    && typeof candidate.onNGetRequest === "function"
    && typeof candidate.onNSetRequest === "function";
}

function isServiceProvider(service: DicomService): service is DicomService & IDicomServiceProvider {
  const candidate = service as Partial<IDicomServiceProvider>;
  return typeof candidate.onReceiveAssociationRequest === "function"
    && typeof candidate.onReceiveAssociationReleaseRequest === "function"
    && typeof candidate.onReceiveAbort === "function"
    && typeof candidate.onConnectionClosed === "function";
}

function serializePDU(pdu: unknown): Uint8Array {
  if (pdu instanceof Uint8Array) {
    return pdu;
  }

  if (hasWriteMethod(pdu)) {
    return pdu.write();
  }

  throw new Error("Unsupported PDU payload type. Expected Uint8Array or object with write(): Uint8Array.");
}

function hasWriteMethod(pdu: unknown): pdu is { write: () => Uint8Array } {
  return typeof pdu === "object"
    && pdu !== null
    && typeof (pdu as { write?: unknown }).write === "function";
}

function concatBytes(a: Uint8Array<ArrayBufferLike>, b: Uint8Array<ArrayBufferLike>): Uint8Array<ArrayBufferLike> {
  if (a.length === 0) {
    return Uint8Array.from(b);
  }
  if (b.length === 0) {
    return Uint8Array.from(a);
  }
  const merged = new Uint8Array(a.length + b.length);
  merged.set(a, 0);
  merged.set(b, a.length);
  return merged;
}

function readUInt32BE(bytes: Uint8Array<ArrayBufferLike>, offset: number): number {
  return (
    (bytes[offset]! * 0x1000000)
    + ((bytes[offset + 1]! << 16) >>> 0)
    + (bytes[offset + 2]! << 8)
    + bytes[offset + 3]!
  ) >>> 0;
}

function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(typeof error === "string" ? error : "Unknown socket read error.");
}
