import { beforeEach, describe, expect, it } from "vitest";
import { encodeImageSurface, encodeImageSurfaceAsync, getImageEncoder } from "../../src/imaging/runtime/ImageEncoderRegistry.js";
import {
  getNodeImageOperationMode,
  registerNodeSharpImageOperations,
  registerNodeSharedImageOperations,
  setNodeImageOperationMode,
} from "../../src/node/registerNodeImaging.js";

describe("Node image operation mode", () => {
  beforeEach(() => {
    registerNodeSharedImageOperations();
  });

  it("uses shared JPEG/PNG encoders by default", () => {
    expect(getNodeImageOperationMode()).toBe("shared");
    expect(getImageEncoder("jpeg")?.id).toBe("third-party-jpeg-js-encoder");
    expect(getImageEncoder("png")?.id).toBe("third-party-upng-encoder");
  });

  it("switches to sharp encoders and supports async encoding", async () => {
    await registerNodeSharpImageOperations({
      fallbackToShared: false,
      sharpImport: async () => ({ default: createMockSharpFactory() }),
    });

    expect(getNodeImageOperationMode()).toBe("sharp");
    expect(getImageEncoder("jpeg")?.id).toBe("node-sharp-jpeg-encoder");
    expect(getImageEncoder("png")?.id).toBe("node-sharp-png-encoder");

    const surface = {
      width: 1,
      height: 1,
      pixelFormat: "rgba8" as const,
      pixels: new Uint8Array([4, 5, 6, 255]),
    };

    await expect(encodeImageSurfaceAsync(surface, "jpeg", { quality: 80 })).resolves.toEqual(
      Uint8Array.from([0xff, 0xd8, 1, 1, 4]),
    );
    await expect(encodeImageSurfaceAsync(surface, "png", { compressionLevel: 3 })).resolves.toEqual(
      Uint8Array.from([0x89, 0x50, 1, 1, 4]),
    );
    expect(() => encodeImageSurface(surface, "jpeg")).toThrow("async-only");
  });

  it("falls back to shared when sharp is unavailable", async () => {
    await registerNodeSharpImageOperations({
      fallbackToShared: true,
      sharpImport: async () => {
        throw new Error("sharp missing");
      },
    });

    expect(getNodeImageOperationMode()).toBe("shared");
    expect(getImageEncoder("jpeg")?.id).toBe("third-party-jpeg-js-encoder");
  });

  it("throws capability error when sharp is unavailable and fallback is disabled", async () => {
    await expect(registerNodeSharpImageOperations({
      fallbackToShared: false,
      sharpImport: async () => {
        throw new Error("sharp missing");
      },
    })).rejects.toMatchObject({
      name: "RuntimeCapabilityError",
      code: "NODE_SHARP_UNAVAILABLE",
    });
  });

  it("switches back to shared mode explicitly", async () => {
    await registerNodeSharpImageOperations({
      fallbackToShared: false,
      sharpImport: async () => ({ default: createMockSharpFactory() }),
    });
    expect(getNodeImageOperationMode()).toBe("sharp");

    await setNodeImageOperationMode("shared");
    expect(getNodeImageOperationMode()).toBe("shared");
    expect(getImageEncoder("jpeg")?.id).toBe("third-party-jpeg-js-encoder");
  });
});

function createMockSharpFactory() {
  return (input: Buffer, options: { raw: { width: number; height: number; channels: number } }) => {
    let format: "jpeg" | "png" = "jpeg";
    const pipeline = {
      jpeg() {
        format = "jpeg";
        return pipeline;
      },
      png() {
        format = "png";
        return pipeline;
      },
      async toBuffer(): Promise<Buffer> {
        const marker = format === "jpeg"
          ? [0xff, 0xd8]
          : [0x89, 0x50];
        return Buffer.from([
          ...marker,
          options.raw.width & 0xff,
          options.raw.height & 0xff,
          input[0] ?? 0,
        ]);
      },
    };

    return pipeline;
  };
}
