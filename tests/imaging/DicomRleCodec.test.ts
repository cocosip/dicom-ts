import { describe, it, expect } from "vitest";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomOtherByte } from "../../src/dataset/DicomElement.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import { DicomRleCodec } from "../../src/imaging/codec/rle/DicomRleCodec.js";
import { DicomOtherByteFragment } from "../../src/dataset/DicomFragmentSequence.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";

function makeRleFrame(segment: Uint8Array): Uint8Array {
  const headerSize = 64;
  const data = new Uint8Array(headerSize + segment.length);
  const view = new DataView(data.buffer);
  view.setUint32(0, 1, true); // one segment
  view.setUint32(4, headerSize, true); // first offset
  data.set(segment, headerSize);
  return data;
}

describe("DicomRleCodec", () => {
  it("decodes a simple RLE frame", () => {
    const ds = new DicomDataset();
    ds.addOrUpdateElement(DicomVR.US, Tags.Rows, 1);
    ds.addOrUpdateElement(DicomVR.US, Tags.Columns, 4);
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 8);
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, 8);
    ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, 7);
    ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 1);

    const packBits = new Uint8Array([0x03, 1, 2, 3, 4]);

    // DicomPixelData.create for native (non-encapsulated) dataset assumes pixel data is uncompressed.
    // getFrame(0) returns the raw bytes.
    // However, if we put an RLE frame into DicomOtherByte, it's just bytes.
    // But DicomPixelData might be doing something with "uncompressedFrameSize" checking?
    // Let's check DicomPixelData logic.
    // If the test fails with "header too small", it means `data.length < 64`.
    // makeRleFrame adds 64 bytes header. So it should be > 64.
    // Why is `data.length` small?
    // Maybe `DicomPixelData` logic for native frames splits data by `rows * columns * samples * bytesPerSample`?
    // Here rows=1, cols=4, samples=1, bits=8 => 4 bytes expected frame size.
    // If we put a larger buffer (64+5 bytes) into PixelData, DicomPixelData (for native) might slice it to expected frame size?
    // Yes, `OtherBytePixelData` (likely used here) calculates frame size based on image dimensions.
    // It assumes uncompressed data.
    
    // To test RLE codec, we should probably set TransferSyntax to RLE Lossless so DicomPixelData treats it as encapsulated?
    // OR we just ignore DicomPixelData slicing logic if we can.
    
    // If we set TransferSyntax to RLE Lossless, DicomPixelData will be EncapsulatedPixelData.
    // But EncapsulatedPixelData expects PixelData to be in Fragments (DicomOtherByteFragment).
    // Here we put it in DicomOtherByte (native).
    
    // So we have a mismatch.
    // 1. If we use Explicit VR Little Endian (native), DicomPixelData assumes uncompressed and slices by calculated size (4 bytes).
    //    The RLE codec then receives 4 bytes, sees < 64 bytes, and throws "header too small".
    // 2. If we use RLE Lossless, we must use DicomOtherByteFragment.
    
    // Correct approach for this test: Use RLE Lossless syntax and Fragments.
     
     ds.internalTransferSyntax = DicomTransferSyntax.RLELossless;
    
    // DicomPixelData.create(ds) -> since TS is RLE Lossless, it returns EncapsulatedPixelData.
    // EncapsulatedPixelData.getFrame(0) should return the fragment we added.
    
    // We also need to add NumberOfFrames=1, otherwise EncapsulatedPixelData might fail?
    // Let's check DicomPixelData logic or assume 1 if missing.
    // But better safe than sorry.
    ds.addOrUpdateElement(DicomVR.IS, Tags.NumberOfFrames, "1");

    // Important: EncapsulatedPixelData needs Basic Offset Table.
    // If we add fragments directly to PixelData, DicomPixelData might expect BOT at index 0.
    // DicomOtherByteFragment: seq.addRaw(...) adds fragments.
    // Usually first item is BOT (can be empty).
    // Let's add an empty BOT.
    const seq = new DicomOtherByteFragment(Tags.PixelData);
    seq.addRaw(new MemoryByteBuffer(new Uint8Array(0))); // BOT
    seq.addRaw(new MemoryByteBuffer(makeRleFrame(packBits))); // Frame 1
    ds.addOrUpdate(seq);
    
    const pixelData = DicomPixelData.create(ds);
    const codec = new DicomRleCodec();
    
    // The previous error was "Invalid RLE frame: header too small"
    // This is because DicomPixelData.create(ds) for Native Pixel Data returns a pixel data object
    // where getFrame(0) returns the raw pixel data.
    // However, DicomRleCodec.decodeFrame expects the input buffer to be the RLE frame (header + data).
    // If the dataset has native pixel data (OB/OW), DicomPixelData treats it as uncompressed.
    // BUT here we are manually feeding it to RLE codec.
    // If the dataset transfer syntax is not encapsulated, DicomPixelData might strip things or behave differently?
    // Actually, DicomPixelData for native data returns the whole buffer or sub-buffer.
    // The problem is likely how `makeRleFrame` constructs the buffer vs how `DicomPixelData` reads it.
    // `makeRleFrame` creates a buffer with header.
    // `ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, frame))` puts it in PixelData.
    // `DicomPixelData.create(ds)` -> since TS is Explicit VR Little Endian (default), it thinks it's native.
    // So getFrame(0) returns the bytes.
    // DicomRleCodec.decode expects `oldPixelData` and `newPixelData` as arguments, NOT `pixelData` and `frame`.
    // Wait, the test calls `codec.decode(pixelData, 0)`.
    // Let's check DicomRleCodec.ts interface again.
    // It implements IDicomCodec: decode(oldPixelData: DicomPixelData, newPixelData: DicomPixelData, parameters: DicomCodecParams | null): void;
    // But the test calls `codec.decode(pixelData, 0)`.
    // This means the test is using an OLD interface or I misread the file content previously.
    // Let's check DicomRleCodec.ts again.
    
    // Checked DicomRleCodec.ts:
    // decode(oldPixelData: DicomPixelData, newPixelData: DicomPixelData, _parameters: DicomCodecParams | null): void
    // private decodeFrame(pixelData: DicomPixelData, frame: number): IByteBuffer
    
    // The test is calling `codec.decode(pixelData, 0)` which is invalid based on current `decode` signature.
    // It seems the test is trying to call `decodeFrame` but it is private? 
    // Or maybe the test was written for a different version.
    // Since I cannot call private method, I should use the public `decode` method.
    // To use `decode`, I need a destination DicomPixelData.
    
    const newDs = new DicomDataset();
    newDs.addOrUpdateElement(DicomVR.US, Tags.Rows, 1);
    newDs.addOrUpdateElement(DicomVR.US, Tags.Columns, 4);
    newDs.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 8);
    newDs.addOrUpdateElement(DicomVR.US, Tags.BitsStored, 8);
    newDs.addOrUpdateElement(DicomVR.US, Tags.HighBit, 7);
    newDs.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 1);
    const newPixelData = DicomPixelData.create(newDs, true); // create empty
    
    codec.decode(pixelData, newPixelData, null);
    
    const decodedFrame = newPixelData.getFrame(0);
    expect([...decodedFrame.data]).toEqual([1, 2, 3, 4]);
  });
});
