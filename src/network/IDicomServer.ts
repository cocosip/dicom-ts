import type { ResolvedDicomServerOptions } from "./DicomServerOptions.js";

export interface IDicomServer {
  readonly options: Readonly<ResolvedDicomServerOptions>;
  readonly isListening: boolean;
  readonly host: string;
  readonly port: number;
  readonly connectionCount: number;
  start(): Promise<void>;
  stop(): Promise<void>;
}
