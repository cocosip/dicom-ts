import { DicomTransferSyntax } from "../core/DicomTransferSyntax.js";
import { DicomAssociation } from "./DicomAssociation.js";
import { DicomClientConnection } from "./DicomClientConnection.js";
import {
  resolveDicomClientOptions,
  type DicomClientOptions,
  type ResolvedDicomClientOptions,
} from "./DicomClientOptions.js";
import { DicomCStoreRequest } from "./DicomCStoreRequest.js";
import { DicomPresentationContext } from "./DicomPresentationContext.js";
import { DicomRequest } from "./DicomRequest.js";

const DEFAULT_PRESENTATION_TRANSFER_SYNTAXES = [
  DicomTransferSyntax.ExplicitVRLittleEndian,
  DicomTransferSyntax.ImplicitVRLittleEndian,
];

export class DicomClient {
  private readonly queuedRequests: DicomRequest[] = [];
  readonly options: Readonly<ResolvedDicomClientOptions>;

  constructor(options: DicomClientOptions = {}) {
    this.options = resolveDicomClientOptions(options);
  }

  get queuedRequestCount(): number {
    return this.queuedRequests.length;
  }

  addRequest(request: DicomRequest): void {
    this.queuedRequests.push(request);
  }

  async sendAsync(host: string, port: number, callingAE: string, calledAE: string): Promise<void> {
    if (this.queuedRequests.length === 0) {
      return;
    }

    const allRequests = [...this.queuedRequests];
    this.queuedRequests.length = 0;

    const chunks = splitRequestsPerAssociation(allRequests, this.options.maxRequestsPerAssociation);
    for (const batch of chunks) {
      const association = createAssociationForRequests(batch, callingAE, calledAE, this.options.maximumPDULength);
      const connection = await DicomClientConnection.connect({
        host,
        port,
        callingAE,
        calledAE,
        association,
        clientOptions: toClientOptions(this.options),
      });

      try {
        await connection.requestAssociation(this.options.associationRequestTimeoutMs);
        await sendBatch(connection, batch, this.options.maxConcurrentRequests, this.options.requestTimeoutMs);

        if (this.options.associationLingerTimeoutMs > 0) {
          await delay(this.options.associationLingerTimeoutMs);
        }

        await connection.releaseAssociation(this.options.associationReleaseTimeoutMs);
      } finally {
        await connection.close();
      }
    }
  }
}

function createAssociationForRequests(
  requests: readonly DicomRequest[],
  callingAE: string,
  calledAE: string,
  maximumPduLength: number,
): DicomAssociation {
  const association = new DicomAssociation(callingAE, calledAE);
  association.maximumPDULength = maximumPduLength;

  const contextMap = new Map<string, DicomPresentationContext>();

  for (const request of requests) {
    const sopClass = request.sopClassUID;
    if (!sopClass) {
      throw new Error(`Request ${request.toString()} does not contain SOP class UID.`);
    }

    const transferSyntaxes = getRequestedTransferSyntaxes(request);
    if (transferSyntaxes.length === 0) {
      throw new Error(`Request ${request.toString()} did not provide any transfer syntax.`);
    }

    const key = `${sopClass.uid}::${transferSyntaxes.map((x) => x.uid.uid).join("|")}`;
    let context = contextMap.get(key);
    if (!context) {
      context = association.presentationContexts.addPresentationContext(sopClass, transferSyntaxes);
      contextMap.set(key, context);
    }
    request.presentationContext = context;
  }

  return association;
}

function getRequestedTransferSyntaxes(request: DicomRequest): DicomTransferSyntax[] {
  const fromRequestContext = request.presentationContext?.getTransferSyntaxes() ?? [];
  if (fromRequestContext.length > 0) {
    return [...fromRequestContext];
  }

  if (request instanceof DicomCStoreRequest) {
    const syntaxes: DicomTransferSyntax[] = [];
    const transferSyntax = request.transferSyntax;
    if (transferSyntax) {
      syntaxes.push(transferSyntax);
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

  return [...DEFAULT_PRESENTATION_TRANSFER_SYNTAXES];
}

async function sendBatch(
  connection: DicomClientConnection,
  requests: readonly DicomRequest[],
  maxConcurrent: number,
  requestTimeoutMs: number,
): Promise<void> {
  const concurrency = Math.max(1, Math.min(maxConcurrent, requests.length));
  let index = 0;

  const workers = Array.from({ length: concurrency }, async () => {
    while (index < requests.length) {
      const currentIndex = index;
      index += 1;
      await connection.sendRequestAndWait(requests[currentIndex]!, requestTimeoutMs);
    }
  });

  await Promise.all(workers);
}

function splitRequestsPerAssociation(requests: readonly DicomRequest[], maxPerAssociation: number | null): DicomRequest[][] {
  if (!maxPerAssociation || maxPerAssociation <= 0) {
    return [Array.from(requests)];
  }

  const batches: DicomRequest[][] = [];
  for (let i = 0; i < requests.length; i += maxPerAssociation) {
    batches.push(requests.slice(i, i + maxPerAssociation));
  }
  return batches;
}

async function delay(ms: number): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function toClientOptions(options: ResolvedDicomClientOptions): DicomClientOptions {
  const normalized: DicomClientOptions = {
    connectTimeoutMs: options.connectTimeoutMs,
    associationRequestTimeoutMs: options.associationRequestTimeoutMs,
    associationReleaseTimeoutMs: options.associationReleaseTimeoutMs,
    associationLingerTimeoutMs: options.associationLingerTimeoutMs,
    requestTimeoutMs: options.requestTimeoutMs,
    maxConcurrentRequests: options.maxConcurrentRequests,
    maxPendingRequests: options.maxPendingRequests,
    maximumPDULength: options.maximumPDULength,
    tlsInitiator: options.tlsInitiator,
  };
  if (options.maxRequestsPerAssociation !== null) {
    normalized.maxRequestsPerAssociation = options.maxRequestsPerAssociation;
  }
  return normalized;
}
