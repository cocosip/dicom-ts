import type { ITlsInitiator } from "./ITlsInitiator.js";
import { NetworkManager } from "./NetworkManager.js";
import "./DesktopNetworkManager.js";

export interface DicomClientOptions {
  connectTimeoutMs?: number;
  associationRequestTimeoutMs?: number;
  associationReleaseTimeoutMs?: number;
  associationLingerTimeoutMs?: number;
  requestTimeoutMs?: number;
  maxConcurrentRequests?: number;
  maxRequestsPerAssociation?: number;
  maxPendingRequests?: number;
  maximumPDULength?: number;
  tlsInitiator?: ITlsInitiator | null;
  networkManager?: NetworkManager;
}

export interface ResolvedDicomClientOptions {
  connectTimeoutMs: number;
  associationRequestTimeoutMs: number;
  associationReleaseTimeoutMs: number;
  associationLingerTimeoutMs: number;
  requestTimeoutMs: number;
  maxConcurrentRequests: number;
  maxRequestsPerAssociation: number | null;
  maxPendingRequests: number;
  maximumPDULength: number;
  tlsInitiator: ITlsInitiator | null;
  networkManager: NetworkManager;
}

const DEFAULT_CONNECT_TIMEOUT_MS = 10_000;
const DEFAULT_ASSOCIATION_REQUEST_TIMEOUT_MS = 5_000;
const DEFAULT_ASSOCIATION_RELEASE_TIMEOUT_MS = 10_000;
const DEFAULT_ASSOCIATION_LINGER_TIMEOUT_MS = 50;
const DEFAULT_REQUEST_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_CONCURRENT_REQUESTS = 1;
const DEFAULT_MAX_PENDING_REQUESTS = 128;
const DEFAULT_MAX_PDU_LENGTH = 16 * 1024;

export function resolveDicomClientOptions(options: DicomClientOptions = {}): ResolvedDicomClientOptions {
  return {
    connectTimeoutMs: options.connectTimeoutMs ?? DEFAULT_CONNECT_TIMEOUT_MS,
    associationRequestTimeoutMs: options.associationRequestTimeoutMs ?? DEFAULT_ASSOCIATION_REQUEST_TIMEOUT_MS,
    associationReleaseTimeoutMs: options.associationReleaseTimeoutMs ?? DEFAULT_ASSOCIATION_RELEASE_TIMEOUT_MS,
    associationLingerTimeoutMs: options.associationLingerTimeoutMs ?? DEFAULT_ASSOCIATION_LINGER_TIMEOUT_MS,
    requestTimeoutMs: options.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS,
    maxConcurrentRequests: Math.max(1, options.maxConcurrentRequests ?? DEFAULT_MAX_CONCURRENT_REQUESTS),
    maxRequestsPerAssociation: normalizeMaxRequestsPerAssociation(options.maxRequestsPerAssociation),
    maxPendingRequests: Math.max(1, options.maxPendingRequests ?? DEFAULT_MAX_PENDING_REQUESTS),
    maximumPDULength: Math.max(1024, options.maximumPDULength ?? DEFAULT_MAX_PDU_LENGTH),
    tlsInitiator: options.tlsInitiator ?? null,
    networkManager: options.networkManager ?? NetworkManager.getCurrent(),
  };
}

function normalizeMaxRequestsPerAssociation(value: number | undefined): number | null {
  if (value === undefined || value === null) {
    return null;
  }
  if (value <= 0) {
    return null;
  }
  return Math.floor(value);
}
