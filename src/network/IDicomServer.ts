import type { ResolvedDicomServerOptions } from "./DicomServerOptions.js";
import type { DicomServerRegistration } from "./DicomServerRegistration.js";

export interface IDicomServer {
  readonly options: Readonly<ResolvedDicomServerOptions>;
  readonly isListening: boolean;
  readonly host: string;
  readonly port: number;
  readonly connectionCount: number;
  readonly registration: DicomServerRegistration | null;
  start(): Promise<void>;
  stop(): Promise<void>;
}
