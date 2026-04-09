import { describe, expect, it } from "vitest";

describe("entry export boundaries", () => {
  it("does not export network symbols from browser entry", async () => {
    const browserEntry = await import("../../src/browser/index.js");
    expect("DicomClient" in browserEntry).toBe(false);
    expect("DicomServer" in browserEntry).toBe(false);
  });

  it("exports network symbols from node entry", async () => {
    const nodeEntry = await import("../../src/node/index.js");
    expect("DicomClient" in nodeEntry).toBe(true);
    expect("DicomServer" in nodeEntry).toBe(true);
  });
});
