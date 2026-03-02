import type { DicomServiceOptions } from "./DicomService.js";
import type { ITlsAcceptor } from "./ITlsAcceptor.js";
import { NetworkManager } from "./NetworkManager.js";
import "./DesktopNetworkManager.js";

export interface DicomServerOptions {
  host?: string;
  port?: number;
  backlog?: number;
  tls?: boolean;
  tlsAcceptor?: ITlsAcceptor | null;
  networkManager?: NetworkManager;
  serviceOptions?: DicomServiceOptions;
}

export interface ResolvedDicomServerOptions {
  host: string;
  port: number;
  backlog: number;
  tls: boolean;
  tlsAcceptor: ITlsAcceptor | null;
  networkManager: NetworkManager;
  serviceOptions: DicomServiceOptions;
}

export const DEFAULT_DICOM_SERVER_PORT = 104;
const DEFAULT_HOST = "0.0.0.0";
const DEFAULT_BACKLOG = 128;

export function resolveDicomServerOptions(options: DicomServerOptions = {}): ResolvedDicomServerOptions {
  return {
    host: options.host?.trim() || DEFAULT_HOST,
    port: options.port ?? DEFAULT_DICOM_SERVER_PORT,
    backlog: options.backlog ?? DEFAULT_BACKLOG,
    tls: options.tls ?? false,
    tlsAcceptor: options.tlsAcceptor ?? null,
    networkManager: options.networkManager ?? NetworkManager.getCurrent(),
    serviceOptions: { ...(options.serviceOptions ?? {}) },
  };
}
