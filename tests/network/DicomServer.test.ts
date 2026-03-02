import { connect, type Socket } from "node:net";
import { describe, expect, it } from "vitest";
import * as DicomUIDs from "../../src/core/DicomUID.generated.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import {
  AAssociateAC,
  AAssociateRQ,
  AReleaseRP,
  AReleaseRQ,
  DicomAssociation,
  DicomServerFactory,
  readPDU,
} from "../../src/network/index.js";

describe("DicomServer", () => {
  it("starts from factory and accepts basic association/release flow", async () => {
    const server = DicomServerFactory.createCEchoServer({
      host: "127.0.0.1",
      port: 0,
    });
    await server.start();
    expect(server.isListening).toBe(true);
    expect(server.port).toBeGreaterThan(0);

    const client = connect({
      host: "127.0.0.1",
      port: server.port,
    });
    await onceConnect(client);
    const collector = createPduCollector(client);

    const association = createVerificationAssociation();
    client.write(new AAssociateRQ(association).write());
    expect(readPDU(await collector.next()).pdu).toBeInstanceOf(AAssociateAC);

    client.write(new AReleaseRQ().write());
    expect(readPDU(await collector.next()).pdu).toBeInstanceOf(AReleaseRP);

    await onceClose(client);
    collector.dispose();

    await server.stop();
    expect(server.isListening).toBe(false);
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
          reject(new Error("Timed out waiting for server PDU response."));
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
