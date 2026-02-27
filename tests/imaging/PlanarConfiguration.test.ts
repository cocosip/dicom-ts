import { describe, it, expect } from "vitest";
import { PlanarConfiguration, parsePlanarConfiguration } from "../../src/imaging/PlanarConfiguration.js";

describe("PlanarConfiguration", () => {
  it("parses planar/interleaved values", () => {
    expect(parsePlanarConfiguration(0)).toBe(PlanarConfiguration.Interleaved);
    expect(parsePlanarConfiguration(1)).toBe(PlanarConfiguration.Planar);
    expect(parsePlanarConfiguration("1")).toBe(PlanarConfiguration.Planar);
  });

  it("defaults to interleaved on null/undefined", () => {
    expect(parsePlanarConfiguration(null)).toBe(PlanarConfiguration.Interleaved);
    expect(parsePlanarConfiguration(undefined)).toBe(PlanarConfiguration.Interleaved);
  });
});
