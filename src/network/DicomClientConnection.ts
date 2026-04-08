import type { Socket } from "node:net";
import { DicomTransferSyntax } from "../core/DicomTransferSyntax.js";
import { DicomAssociation } from "./DicomAssociation.js";
import { DicomCStoreRequest } from "./DicomCStoreRequest.js";
import { DicomCStoreResponse } from "./DicomCStoreResponse.js";
import { DicomMessage } from "./DicomMessage.js";
import { DicomRequest } from "./DicomRequest.js";
import { DicomResponse } from "./DicomResponse.js";
import { DicomService } from "./DicomService.js";
import { DicomState, DicomStatus } from "./DicomStatus.js";
import {
  AAbort,
  AAssociateAC,
  AAssociateRJ,
  AAssociateRQ,
  AReleaseRP,
  AReleaseRQ,
  DicomAbortReason,
  DicomAbortSource,
  type PDU,
} from "./PDU.js";
import type { IDicomServiceProvider } from "./IDicomServiceProvider.js";
import {
  resolveDicomClientOptions,
  type DicomClientOptions,
  type ResolvedDicomClientOptions,
} from "./DicomClientOptions.js";
import type { IDicomCStoreProvider } from "./IDicomCStoreProvider.js";
import { connectSocket } from "./nodeTransport.js";

export interface DicomClientConnectionOpenOptions {
  host: string;
  port: number;
  callingAE: string;
  calledAE: string;
  association?: DicomAssociation;
  clientOptions?: DicomClientOptions;
}

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
  settled: () => boolean;
};

export class DicomClientConnection extends DicomService implements IDicomServiceProvider, IDicomCStoreProvider {
  readonly clientOptions: Readonly<ResolvedDicomClientOptions>;
  cStoreRequestHandler: ((request: DicomCStoreRequest) => Promise<DicomCStoreResponse>) | null = null;
  cStoreRequestExceptionHandler: ((tempFileName: string | null, error: unknown) => Promise<void>) | null = null;

  private readonly closeDeferred = createDeferred<void>();
  private associationDeferred: Deferred<PDU> | null = null;
  private releaseDeferred: Deferred<void> | null = null;
  private readonly requestRejecters = new Set<(error: Error) => void>();
  private associationEstablished = false;
  private remoteAbortError: Error | null = null;

  private constructor(
    private readonly transportSocket: Socket,
    association: DicomAssociation,
    clientOptions: ResolvedDicomClientOptions,
  ) {
    super(association, {
      socket: transportSocket,
      requestTimeoutMs: clientOptions.requestTimeoutMs,
      maxPendingRequests: clientOptions.maxPendingRequests,
      autoSendAssociationAccept: false,
      autoSendReleaseResponse: false,
      closeSocketOnRelease: false,
    });
    this.clientOptions = clientOptions;
  }

  get isAssociationEstablished(): boolean {
    return this.associationEstablished;
  }

  static async connect(options: DicomClientConnectionOpenOptions): Promise<DicomClientConnection> {
    const resolvedOptions = resolveDicomClientOptions(options.clientOptions);
    const socket = await connectSocket({
      host: options.host,
      port: options.port,
      tlsInitiator: resolvedOptions.tlsInitiator,
      noDelay: true,
      timeoutMs: 0,
      connectionTimeoutMs: resolvedOptions.connectTimeoutMs,
    });
    socket.setNoDelay?.(true);
    socket.setTimeout?.(0);

    const association = options.association?.clone() ?? new DicomAssociation(options.callingAE, options.calledAE);
    association.callingAE = options.callingAE;
    association.calledAE = options.calledAE;
    association.remoteHost = options.host;
    association.remotePort = options.port;
    if (association.maximumPDULength <= 0) {
      association.maximumPDULength = resolvedOptions.maximumPDULength;
    }

    return new DicomClientConnection(socket, association, resolvedOptions);
  }

  async requestAssociation(timeoutMs = this.clientOptions.associationRequestTimeoutMs): Promise<void> {
    if (this.associationEstablished) {
      return;
    }
    if (this.associationDeferred) {
      throw new Error("Association request is already in progress.");
    }

    const deferred = createDeferred<PDU>();
    this.associationDeferred = deferred;

    const timeout = setTimeout(() => {
      deferred.reject(new Error(`Timed out waiting for A-ASSOCIATE response (${timeoutMs} ms).`));
    }, timeoutMs);

    try {
      await this.sendPDU(new AAssociateRQ(this.association));
      const responsePdu = await deferred.promise;

      if (responsePdu instanceof AAssociateAC) {
        this.associationEstablished = true;
        return;
      }

      if (responsePdu instanceof AAssociateRJ) {
        throw new Error(
          `Association rejected (result=${responsePdu.result}, source=${responsePdu.source}, reason=${responsePdu.reason}).`,
        );
      }

      throw new Error(`Unexpected PDU received while waiting for association response: ${responsePdu.constructor.name}`);
    } finally {
      clearTimeout(timeout);
      this.associationDeferred = null;
    }
  }

  async sendRequestAndWait(
    request: DicomRequest,
    timeoutMs = this.clientOptions.requestTimeoutMs,
  ): Promise<readonly DicomResponse[]> {
    this.prepareRequest(request);
    if (!this.associationEstablished) {
      await this.requestAssociation(this.clientOptions.associationRequestTimeoutMs);
    }

    const responses: DicomResponse[] = [];
    const originalDispatch = request.dispatchResponse.bind(request);
    const deferred = createDeferred<readonly DicomResponse[]>();
    const timeout = setTimeout(() => {
      deferred.reject(new Error(`Timed out waiting for response to request ${request.messageID}.`));
    }, timeoutMs);

    const rejecter = (error: Error): void => {
      deferred.reject(error);
    };
    this.requestRejecters.add(rejecter);

    request.dispatchResponse = ((response: DicomResponse) => {
      responses.push(response);
      originalDispatch(response);

      const state = DicomStatus.lookup(response.status).state;
      if (state !== DicomState.Pending) {
        deferred.resolve([...responses]);
      }
    }) as typeof request.dispatchResponse;

    try {
      await this.sendRequest(request);
      return await deferred.promise;
    } finally {
      clearTimeout(timeout);
      request.dispatchResponse = originalDispatch;
      this.requestRejecters.delete(rejecter);
    }
  }

  async releaseAssociation(timeoutMs = this.clientOptions.associationReleaseTimeoutMs): Promise<void> {
    if (!this.associationEstablished || this.releaseDeferred) {
      return;
    }

    const deferred = createDeferred<void>();
    this.releaseDeferred = deferred;
    const timeout = setTimeout(() => {
      deferred.reject(new Error(`Timed out waiting for A-RELEASE-RP (${timeoutMs} ms).`));
    }, timeoutMs);

    try {
      await this.sendPDU(new AReleaseRQ());
      await deferred.promise;
      this.associationEstablished = false;
    } finally {
      clearTimeout(timeout);
      this.releaseDeferred = null;
    }
  }

  async abort(
    source: DicomAbortSource = DicomAbortSource.ServiceUser,
    reason: DicomAbortReason = DicomAbortReason.NotSpecified,
  ): Promise<void> {
    if (this.isSocketOpen) {
      await this.sendPDU(new AAbort(source, reason));
      this.transportSocket.destroy();
    }
    this.associationEstablished = false;
  }

  async close(): Promise<void> {
    if (!this.transportSocket.destroyed) {
      this.transportSocket.destroy();
    }
    await this.closeDeferred.promise;
  }

  async onReceiveAssociationRequest(): Promise<void> {
    throw new Error("Client connection received unexpected A-ASSOCIATE-RQ.");
  }

  async onReceiveAssociationReleaseRequest(): Promise<void> {
    await this.sendPDU(new AReleaseRP());
    this.associationEstablished = false;
    this.transportSocket.end();
  }

  async onCStoreRequest(request: DicomCStoreRequest): Promise<DicomCStoreResponse> {
    if (!this.cStoreRequestHandler) {
      return new DicomCStoreResponse(request, DicomStatus.StorageCannotUnderstand.code);
    }

    return await this.cStoreRequestHandler(request);
  }

  async onCStoreRequestException(tempFileName: string | null, error: unknown): Promise<void> {
    await this.cStoreRequestExceptionHandler?.(tempFileName, error);
  }

  onReceiveAbort(source: unknown, reason: unknown): void {
    this.remoteAbortError = new Error(`Association aborted by remote peer (source=${String(source)}, reason=${String(reason)}).`);
    this.associationEstablished = false;
  }

  onConnectionClosed(error: Error | null): void {
    const closeError = error ?? this.remoteAbortError;
    if (closeError) {
      for (const rejecter of this.requestRejecters) {
        rejecter(closeError);
      }
      this.requestRejecters.clear();
      this.associationDeferred?.reject(closeError);
      this.releaseDeferred?.reject(closeError);
    }

    this.associationEstablished = false;
    this.closeDeferred.resolve();
  }

  protected override async onReceivePDU(pdu: PDU): Promise<void> {
    if ((pdu instanceof AAssociateAC || pdu instanceof AAssociateRJ) && this.associationDeferred) {
      this.associationDeferred.resolve(pdu);
      return;
    }

    if (pdu instanceof AReleaseRP && this.releaseDeferred) {
      this.releaseDeferred.resolve();
    }
  }

  protected override async onSocketReadPipelineError(error: Error): Promise<void> {
    for (const rejecter of this.requestRejecters) {
      rejecter(error);
    }
    this.requestRejecters.clear();
    this.associationDeferred?.reject(error);
    this.releaseDeferred?.reject(error);
  }

  protected override async writeDIMSEMessage(message: DicomMessage): Promise<void> {
    await super.writeDIMSEMessage(message);
  }

  prepareRequest(request: DicomRequest): void {
    const sopClassUid = request.sopClassUID;
    if (!sopClassUid) {
      throw new Error(`Request ${request.toString()} does not contain SOP class UID.`);
    }

    if (request.presentationContext) {
      const existingById = this.association.presentationContexts.get(request.presentationContext.id);
      if (existingById) {
        request.presentationContext = existingById;
        return;
      }
    }

    const requestedTransferSyntaxes = getRequestedTransferSyntaxes(request);
    const matched = findCompatiblePresentationContext(
      this.association,
      sopClassUid.uid,
      requestedTransferSyntaxes,
    );
    if (matched) {
      request.presentationContext = matched;
      return;
    }

    if (this.associationEstablished) {
      throw new Error(`No negotiated presentation context found for SOP class ${sopClassUid.uid}.`);
    }

    const created = this.association.presentationContexts.addPresentationContext(
      sopClassUid,
      requestedTransferSyntaxes,
    );
    request.presentationContext = created;
  }
}

function createDeferred<T>(): Deferred<T> {
  let resolveRef: ((value: T) => void) | null = null;
  let rejectRef: ((error: Error) => void) | null = null;
  let done = false;

  const promise = new Promise<T>((resolve, reject) => {
    resolveRef = (value: T) => {
      if (done) {
        return;
      }
      done = true;
      resolve(value);
    };
    rejectRef = (error: Error) => {
      if (done) {
        return;
      }
      done = true;
      reject(error);
    };
  });

  return {
    promise,
    resolve: (value: T) => resolveRef?.(value),
    reject: (error: Error) => rejectRef?.(error),
    settled: () => done,
  };
}

function findCompatiblePresentationContext(
  association: DicomAssociation,
  sopClassUid: string,
  requestedTransferSyntaxes: readonly DicomTransferSyntax[],
) {
  for (const context of association.presentationContexts) {
    if (context.abstractSyntax.uid !== sopClassUid) {
      continue;
    }

    if (requestedTransferSyntaxes.length === 0) {
      return context;
    }

    const contextSyntaxes = context.getTransferSyntaxes();
    const hasOverlap = requestedTransferSyntaxes.some((requested) =>
      contextSyntaxes.some((candidate) => candidate.uid.uid === requested.uid.uid));
    if (hasOverlap) {
      return context;
    }
  }
  return null;
}

function getRequestedTransferSyntaxes(request: DicomRequest): DicomTransferSyntax[] {
  const fromContext = request.presentationContext?.getTransferSyntaxes() ?? [];
  if (fromContext.length > 0) {
    return [...fromContext];
  }

  if (request instanceof DicomCStoreRequest) {
    const syntaxes: DicomTransferSyntax[] = [];
    if (request.transferSyntax) {
      syntaxes.push(request.transferSyntax);
    }
    if (request.additionalTransferSyntaxes) {
      for (const syntax of request.additionalTransferSyntaxes) {
        if (!syntaxes.some((candidate) => candidate.uid.uid === syntax.uid.uid)) {
          syntaxes.push(syntax);
        }
      }
    }
    if (!request.omitImplicitVrTransferSyntaxInAssociationRequest
      && !syntaxes.some((candidate) => candidate.uid.uid === DicomTransferSyntax.ImplicitVRLittleEndian.uid.uid)) {
      syntaxes.push(DicomTransferSyntax.ImplicitVRLittleEndian);
    }
    return syntaxes;
  }

  return [
    DicomTransferSyntax.ExplicitVRLittleEndian,
    DicomTransferSyntax.ImplicitVRLittleEndian,
  ];
}
