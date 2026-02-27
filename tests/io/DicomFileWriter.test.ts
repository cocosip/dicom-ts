import { describe, it, expect } from "vitest";
import { ByteBufferByteSource } from "../../src/io/ByteBufferByteSource.js";
import { MemoryByteBuffer } from "../../src/io/buffer/MemoryByteBuffer.js";
import { MemoryByteTarget } from "../../src/io/MemoryByteTarget.js";
import { DicomFileReader } from "../../src/io/reader/DicomFileReader.js";
import { DicomFileWriter } from "../../src/io/writer/DicomFileWriter.js";
import { DicomTransferSyntax } from "../../src/core/DicomTransferSyntax.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomLongString, DicomPersonName, DicomUniqueIdentifier } from "../../src/dataset/DicomElement.js";
import * as DicomTags from "../../src/core/DicomTag.generated.js";

function writeAndRead(metaInfo: DicomDataset, dataset: DicomDataset) {
  const target = new MemoryByteTarget();
  const writer = new DicomFileWriter();
  writer.write(target, metaInfo, dataset);
  const source = new ByteBufferByteSource([new MemoryByteBuffer(target.toBuffer())]);
  return DicomFileReader.read(source);
}

describe("DicomFileWriter", () => {
  it("writes preamble, meta info, and dataset", () => {
    const metaInfo = new DicomDataset();
    metaInfo.addOrUpdate(
      new DicomUniqueIdentifier(DicomTags.TransferSyntaxUID, DicomTransferSyntax.ExplicitVRLittleEndian)
    );

    const dataset = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    dataset.addOrUpdate(new DicomPersonName(DicomTags.PatientName, "Doe^John"));
    dataset.addOrUpdate(new DicomLongString(DicomTags.PatientID, "P001"));

    const result = writeAndRead(metaInfo, dataset);

    expect(result.preamble).not.toBeNull();
    expect(result.preamble!.length).toBe(128);
    expect(result.transferSyntax).toBe(DicomTransferSyntax.ExplicitVRLittleEndian);
    expect(result.metaInfo.getString(DicomTags.TransferSyntaxUID)).toBe(
      DicomTransferSyntax.ExplicitVRLittleEndian.uid.uid
    );
    expect(result.metaInfo.getValue<number>(DicomTags.FileMetaInformationGroupLength)).toBe(28);
    expect(result.dataset.getString(DicomTags.PatientName)).toBe("Doe^John");
    expect(result.dataset.getString(DicomTags.PatientID)).toBe("P001");
  });

  it("writes dataset using implicit VR when specified in meta info", () => {
    const metaInfo = new DicomDataset();
    metaInfo.addOrUpdate(
      new DicomUniqueIdentifier(DicomTags.TransferSyntaxUID, DicomTransferSyntax.ImplicitVRLittleEndian)
    );

    const dataset = new DicomDataset(DicomTransferSyntax.ImplicitVRLittleEndian);
    dataset.addOrUpdate(new DicomPersonName(DicomTags.PatientName, "Doe^Jane"));

    const result = writeAndRead(metaInfo, dataset);

    expect(result.transferSyntax).toBe(DicomTransferSyntax.ImplicitVRLittleEndian);
    expect(result.dataset.getString(DicomTags.PatientName)).toBe("Doe^Jane");
  });
});
