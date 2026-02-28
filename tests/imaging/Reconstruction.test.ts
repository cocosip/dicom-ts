import { describe, it, expect } from "vitest";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomOtherByte } from "../../src/dataset/DicomElement.js";
import { DicomOtherByteFragment } from "../../src/dataset/DicomFragmentSequence.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import { DicomGenerator } from "../../src/imaging/reconstruction/DicomGenerator.js";
import { ImageData } from "../../src/imaging/reconstruction/ImageData.js";
import { Stack, StackType } from "../../src/imaging/reconstruction/Stack.js";
import { VolumeData } from "../../src/imaging/reconstruction/VolumeData.js";

function buildMultiFrameDataset(): DicomDataset {
  const ds = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
  ds.addOrUpdateElement(DicomVR.US, Tags.Rows, 2);
  ds.addOrUpdateElement(DicomVR.US, Tags.Columns, 2);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 8);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, 8);
  ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, 7);
  ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 1);
  ds.addOrUpdateElement(DicomVR.IS, Tags.NumberOfFrames, "2");
  ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, new Uint8Array([
    1, 2, 3, 4,
    10, 20, 30, 40,
  ])));
  return ds;
}

describe("reconstruction", () => {
  it("ImageData supports multi-frame access with shared uncompressed pixel data", () => {
    const ds = buildMultiFrameDataset();
    const pixelData = DicomPixelData.create(ds);
    const first = new ImageData(ds, pixelData, 0);
    const second = new ImageData(ds, pixelData, 1);

    expect(first.getPixel(0, 0)).toBe(1);
    expect(second.getPixel(0, 0)).toBe(10);
    expect(first.sortingValue).not.toBe(second.sortingValue);
  });

  it("ImageData rejects compressed shared pixel data", () => {
    const ds = new DicomDataset(DicomTransferSyntax.JPEGProcess1);
    ds.addOrUpdateElement(DicomVR.US, Tags.Rows, 1);
    ds.addOrUpdateElement(DicomVR.US, Tags.Columns, 1);
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, 8);
    ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, 8);
    ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, 7);
    ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, 1);
    ds.addOrUpdateElement(DicomVR.IS, Tags.NumberOfFrames, "1");
    const seq = new DicomOtherByteFragment(Tags.PixelData);
    seq.addRaw(new MemoryByteBuffer(new Uint8Array(0)));
    seq.addRaw(new MemoryByteBuffer(new Uint8Array([0xff])));
    ds.addOrUpdate(seq);

    const pixelData = DicomPixelData.create(ds);
    expect(() => new ImageData(ds, pixelData, 0)).toThrow();
  });

  it("VolumeData validates multi-frame dataset and computes non-trivial bounds", () => {
    const ds = buildMultiFrameDataset();
    const volume = new VolumeData(ds);
    expect(volume.slices.length).toBe(2);
    expect(volume.boundingMin.equals(volume.boundingMax)).toBe(false);
    expect(volume.sliceSpaces.max).toBeGreaterThanOrEqual(volume.sliceSpaces.min);
  });

  it("VolumeData throws for non-multi-frame dataset", () => {
    const ds = new DicomDataset();
    expect(() => new VolumeData(ds)).toThrow();
  });

  it("Stack and DicomGenerator create reconstructed datasets", () => {
    const source = buildMultiFrameDataset();
    const volume = new VolumeData(source);
    const stack = new Stack(volume, StackType.Axial, 1, 1);
    expect(stack.slices.length).toBeGreaterThan(0);

    const generator = new DicomGenerator(volume.commonData);
    const generated = generator.storeAsDicom(stack, "MPR");
    expect(generated.length).toBe(stack.slices.length);
    expect(generated[0]?.contains(Tags.PixelData)).toBe(true);
    expect(generated[0]?.getSingleValue<number>(Tags.Rows)).toBe(stack.slices[0]?.rows);
  });
});
