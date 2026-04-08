import type { IDicomServer } from "./IDicomServer.js";
import type { IDicomServerRegistry } from "./DicomServerRegistry.js";

export class DicomServerRegistration {
  constructor(
    private readonly registry: IDicomServerRegistry,
    readonly dicomServer: IDicomServer,
    readonly task: Promise<void>,
  ) {}

  dispose(): void {
    this.registry.unregister(this);
  }
}
