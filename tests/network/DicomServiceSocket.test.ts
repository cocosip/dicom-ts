import { createServer, type Server, type Socket, connect } from "node:net";
import { describe, expect, it } from "vitest";
import * as DicomUIDs from "../../src/core/DicomUID.generated.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import {
  AAssociateAC,
  AAssociateRQ,
  AReleaseRP,
  AReleaseRQ,
  DicomAssociation,
  DicomMessage,
  DicomService,
  readPDU,
  type IDicomServiceProvider,
  type PDU,
} from "../../src/network/index.js";

class SocketBackedService extends DicomService implements IDicomServiceProvider {
  associationRequestCount = 0;
  releaseRequestCount = 0;
  closedErrors: Array<Error | null> = [];
  readonly receivedPduTypes: string[] = [];

  constructor(socket: Socket) {
    super(undefined, { socket });
  }

  async onReceiveAssociationRequest(_association: DicomAssociation): Promise<void> {
    this.associationRequestCount += 1;
  }

  async onReceiveAssociationReleaseRequest(): Promise<void> {
    this.releaseRequestCount += 1;
  }

  onReceiveAbort(): void {
    // no-op
  }

  onConnectionClosed(error: Error | null): void {
    this.closedErrors.push(error);
  }

  protected override async onReceivePDU(pdu: PDU): Promise<void> {
    this.receivedPduTypes.push(pdu.constructor.name);
  }

  protected override async writeDIMSEMessage(_message: DicomMessage): Promise<void> {
    // not used in this test
  }
}

describe("DicomService socket pipeline", () => {
  it("reads fragmented PDUs from TCP stream and writes association/release responses", async () => {
    let service: SocketBackedService | null = null;
    const tcpServer = createServer((socket) => {
      service = new SocketBackedService(socket);
    });

    await listen(tcpServer);
    const client = connect({
      host: "127.0.0.1",
      port: getPort(tcpServer),
    });
    await onceConnect(client);
    const collector = createPduCollector(client);

    const association = createVerificationAssociation();
    const associateRq = new AAssociateRQ(association).write();
    client.write(associateRq.subarray(0, 5));
    client.write(associateRq.subarray(5));

    const associateAc = readPDU(await collector.next()).pdu;
    expect(associateAc).toBeInstanceOf(AAssociateAC);
    expect(service?.associationRequestCount).toBe(1);
    expect(service?.receivedPduTypes).toContain("AAssociateRQ");

    const releaseRq = new AReleaseRQ().write();
    client.write(releaseRq.subarray(0, 2));
    client.write(releaseRq.subarray(2));

    const releaseRp = readPDU(await collector.next()).pdu;
    expect(releaseRp).toBeInstanceOf(AReleaseRP);
    expect(service?.releaseRequestCount).toBe(1);

    await onceClose(client);
    collector.dispose();
    tcpServer.close();
  });
});

function createVerificationAssociation(): DicomAssociation {
  const association = new DicomAssociation("SCU", "SCP");
  association.maximumPDULength = 16 * 1024;
  association.presentationContexts.addPresentationContext(
    DicomUIDs.Verification,
    [DicomTransferSyntax.ImplicitVRLittleEndian],
  );
  return association;
}

function createPduCollector(socket: Socket): { next: () => Promise<Uint8Array>; dispose: () => void } {
  let buffer = new Uint8Array(0);
  const queue: Uint8Array[] = [];
  const waiters: Array<(value: Uint8Array) => void> = [];

  const onData = (chunk: Buffer): void => {
    buffer = concatBytes(buffer, chunk);
    while (buffer.length >= 6) {
      const pduLength = readUInt32BE(buffer, 2);
      const totalLength = 6 + pduLength;
      if (buffer.length < totalLength) {
        return;
      }
      const frame = buffer.slice(0, totalLength);
      buffer = buffer.slice(totalLength);

      const waiter = waiters.shift();
      if (waiter) {
        waiter(frame);
      } else {
        queue.push(frame);
      }
    }
  };

  socket.on("data", onData);

  return {
    async next(): Promise<Uint8Array> {
      if (queue.length > 0) {
        return queue.shift()!;
      }

      return new Promise<Uint8Array>((resolve, reject) => {
        const wrappedResolve = (value: Uint8Array): void => {
          clearTimeout(timeout);
          resolve(value);
        };

        const timeout = setTimeout(() => {
          const index = waiters.indexOf(wrappedResolve);
          if (index >= 0) {
            waiters.splice(index, 1);
          }
          reject(new Error("Timed out waiting for PDU response."));
        }, 2_000);
        waiters.push(wrappedResolve);
      });
    },
    dispose(): void {
      socket.off("data", onData);
    },
  };
}

function concatBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  if (a.length === 0) {
    return b.slice();
  }
  const combined = new Uint8Array(a.length + b.length);
  combined.set(a, 0);
  combined.set(b, a.length);
  return combined;
}

function readUInt32BE(bytes: Uint8Array, offset: number): number {
  return (
    (bytes[offset]! * 0x1000000)
    + ((bytes[offset + 1]! << 16) >>> 0)
    + (bytes[offset + 2]! << 8)
    + bytes[offset + 3]!
  ) >>> 0;
}

async function listen(server: Server): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", reject);
      resolve();
    });
  });
}

function getPort(server: Server): number {
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Server is not listening on a TCP port.");
  }
  return address.port;
}

async function onceConnect(socket: Socket): Promise<void> {
  if (!socket.connecting) {
    return;
  }
  await new Promise<void>((resolve, reject) => {
    socket.once("connect", resolve);
    socket.once("error", reject);
  });
}

async function onceClose(socket: Socket): Promise<void> {
  if (socket.destroyed) {
    return;
  }
  await new Promise<void>((resolve) => {
    socket.once("close", () => resolve());
  });
}
