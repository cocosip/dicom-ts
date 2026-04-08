import { describe, expect, it } from "vitest";
import {
  DefaultDicomServerRegistry,
  DicomServerRegistry,
  type IDicomServer,
  type ResolvedDicomServerOptions,
} from "../../src/network/index.js";

describe("DicomServerRegistry", () => {
  it("normalizes host keys when looking up registrations", () => {
    const registry = new DefaultDicomServerRegistry();
    const server = createFakeServer("  LOCALHOST  ", 11112);
    const task = Promise.resolve();

    const registration = registry.register(server, task);

    expect(registry.get(11112, "localhost")).toBe(registration);
    expect(registry.get(11112, " LOCALHOST ")).toBe(registration);
    expect(registry.isAvailable(11112, "localhost")).toBe(false);
  });

  it("allows repeated registration disposal without throwing", () => {
    const registry = new DefaultDicomServerRegistry();
    const registration = registry.register(createFakeServer("127.0.0.1", 104), Promise.resolve());

    registration.dispose();
    registration.dispose();

    expect(registry.get(104, "127.0.0.1")).toBeNull();
    expect(registry.isAvailable(104, "127.0.0.1")).toBe(true);
  });

  it("resets the global registry instance", () => {
    const customRegistry = new DefaultDicomServerRegistry();
    DicomServerRegistry.setCurrent(customRegistry);

    expect(DicomServerRegistry.getCurrent()).toBe(customRegistry);

    DicomServerRegistry.reset();

    expect(DicomServerRegistry.getCurrent()).not.toBe(customRegistry);
  });
});

function createFakeServer(host: string, port: number): IDicomServer {
  const options: ResolvedDicomServerOptions = {
    host,
    port,
    backlog: 128,
    tls: false,
    tlsAcceptor: null,
    serviceOptions: {},
  };

  return {
    options,
    isListening: true,
    host,
    port,
    connectionCount: 0,
    registration: null,
    async start(): Promise<void> {
      // not used in registry tests
    },
    async stop(): Promise<void> {
      // not used in registry tests
    },
  };
}
