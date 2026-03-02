import { connect, createServer, type Server, type Socket } from "node:net";
import { afterEach, describe, expect, it } from "vitest";
import {
  DefaultTlsAcceptor,
  DicomCEchoRequest,
  DicomClient,
  DicomServerFactory,
  DicomStatus,
  type IDicomServer,
  type ITlsAcceptor,
  type ITlsInitiator,
} from "../../src/network/index.js";

class PassthroughTlsAcceptor implements ITlsAcceptor {
  called = false;

  createTlsServer(connectionListener: (socket: Socket) => void): Server {
    this.called = true;
    return createServer(connectionListener);
  }
}

class PassthroughTlsInitiator implements ITlsInitiator {
  called = false;

  async initiateTls(remoteHost: string, remotePort: number, _timeoutMs: number): Promise<Socket> {
    this.called = true;
    return await new Promise<Socket>((resolve, reject) => {
      const socket = connect({ host: remoteHost, port: remotePort });
      socket.once("connect", () => resolve(socket));
      socket.once("error", reject);
    });
  }
}

describe("TLS support plumbing", () => {
  const servers: IDicomServer[] = [];

  afterEach(async () => {
    while (servers.length > 0) {
      await servers.pop()!.stop();
    }
  });

  it("wires custom ITlsAcceptor/ITlsInitiator through server and client", async () => {
    const tlsAcceptor = new PassthroughTlsAcceptor();
    const tlsInitiator = new PassthroughTlsInitiator();

    const server = DicomServerFactory.createCEchoServer({
      host: "127.0.0.1",
      port: 0,
      tls: true,
      tlsAcceptor,
    });
    servers.push(server);
    await server.start();

    const client = new DicomClient({
      tlsInitiator,
    });

    const request = new DicomCEchoRequest();
    let responseCode = -1;
    request.onResponseReceived = (_rq, rsp) => {
      responseCode = rsp.status;
    };
    client.addRequest(request);

    await client.sendAsync("127.0.0.1", server.port, "SCU", "SCP");

    expect(responseCode).toBe(DicomStatus.Success.code);
    expect(tlsAcceptor.called).toBe(true);
    expect(tlsInitiator.called).toBe(true);
  });

  it("fails fast when tls flag is enabled without tlsAcceptor", async () => {
    const server = DicomServerFactory.createCEchoServer({
      host: "127.0.0.1",
      port: 0,
      tls: true,
    });

    await expect(server.start()).rejects.toThrow("tlsAcceptor");
  });

  it("validates certificate requirements in DefaultTlsAcceptor", () => {
    expect(() => new DefaultTlsAcceptor({ tlsOptions: {} })).toThrow("cert or pfx");
  });
});
