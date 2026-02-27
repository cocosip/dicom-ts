import { describe, it, expect } from "vitest";
import { TranscoderManager } from "../../src/imaging/codec/TranscoderManager.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import type { IDicomCodec } from "../../src/imaging/codec/IDicomCodec.js";
import type { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import type { IByteBuffer } from "../../src/io/buffer/IByteBuffer.js";

class DummyCodec implements IDicomCodec {
  readonly transferSyntax = DicomTransferSyntax.RLELossless;
  decode(_pixelData: DicomPixelData, _frame: number): IByteBuffer {
    throw new Error("not used");
  }
}

describe("TranscoderManager", () => {
  it("registers and retrieves codecs", () => {
    const codec = new DummyCodec();
    TranscoderManager.register(codec);
    expect(TranscoderManager.getCodec(DicomTransferSyntax.RLELossless)).toBe(codec);
    TranscoderManager.unregister(DicomTransferSyntax.RLELossless);
    expect(TranscoderManager.getCodec(DicomTransferSyntax.RLELossless)).toBeNull();
  });
});
