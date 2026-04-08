import type { IDicomServer } from "./IDicomServer.js";
import { DicomServerRegistration } from "./DicomServerRegistration.js";

const DEFAULT_REGISTRY_HOST = "0.0.0.0";

export interface IDicomServerRegistry {
  isAvailable(port: number, host?: string): boolean;
  get(port: number, host?: string): DicomServerRegistration | null;
  register(dicomServer: IDicomServer, task: Promise<void>): DicomServerRegistration;
  unregister(registration: DicomServerRegistration): void;
}

export class DefaultDicomServerRegistry implements IDicomServerRegistry {
  private readonly servers = new Map<string, DicomServerRegistration>();

  isAvailable(port: number, host = DEFAULT_REGISTRY_HOST): boolean {
    return !this.servers.has(createRegistryKey(host, port));
  }

  get(port: number, host = DEFAULT_REGISTRY_HOST): DicomServerRegistration | null {
    return this.servers.get(createRegistryKey(host, port)) ?? null;
  }

  register(dicomServer: IDicomServer, task: Promise<void>): DicomServerRegistration {
    const key = createRegistryKey(dicomServer.host, dicomServer.port);
    if (this.servers.has(key)) {
      throw new Error(`There is already a DICOM server registered for ${dicomServer.host}:${dicomServer.port}.`);
    }

    const registration = new DicomServerRegistration(this, dicomServer, task);
    this.servers.set(key, registration);
    return registration;
  }

  unregister(registration: DicomServerRegistration): void {
    const key = createRegistryKey(registration.dicomServer.host, registration.dicomServer.port);
    const current = this.servers.get(key);
    if (current === registration) {
      this.servers.delete(key);
    }
  }
}

export class DicomServerRegistry {
  private static current: IDicomServerRegistry = new DefaultDicomServerRegistry();

  static setCurrent(registry: IDicomServerRegistry): void {
    DicomServerRegistry.current = registry;
  }

  static getCurrent(): IDicomServerRegistry {
    return DicomServerRegistry.current;
  }

  static reset(): void {
    DicomServerRegistry.current = new DefaultDicomServerRegistry();
  }

  static isAvailable(port: number, host = DEFAULT_REGISTRY_HOST): boolean {
    return DicomServerRegistry.current.isAvailable(port, host);
  }

  static get(port: number, host = DEFAULT_REGISTRY_HOST): DicomServerRegistration | null {
    return DicomServerRegistry.current.get(port, host);
  }

  static register(dicomServer: IDicomServer, task: Promise<void>): DicomServerRegistration {
    return DicomServerRegistry.current.register(dicomServer, task);
  }

  static unregister(registration: DicomServerRegistration): void {
    DicomServerRegistry.current.unregister(registration);
  }
}

function createRegistryKey(host: string, port: number): string {
  return `${host.trim().toLowerCase()}:${port}`;
}
