import { describe, it, expect } from "vitest";
import { Endian, LocalMachine, Network, swap } from "../../src/io/Endian.js";

describe("Endian", () => {
  it("detects local machine endian", () => {
    const little = new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;
    expect(LocalMachine).toBe(little ? Endian.Little : Endian.Big);
  });

  it("exposes network endian as big", () => {
    expect(Network).toBe(Endian.Big);
  });

  it("swaps bytes for unit size 2", () => {
    const bytes = Uint8Array.from([0x01, 0x02, 0x03, 0x04]);
    swap(2, bytes);
    expect(Array.from(bytes)).toEqual([0x02, 0x01, 0x04, 0x03]);
  });

  it("swaps bytes for unit size 4", () => {
    const bytes = Uint8Array.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]);
    swap(4, bytes);
    expect(Array.from(bytes)).toEqual([0x04, 0x03, 0x02, 0x01, 0x08, 0x07, 0x06, 0x05]);
  });
});
