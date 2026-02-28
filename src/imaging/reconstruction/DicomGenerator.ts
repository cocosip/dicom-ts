import * as Tags from "../../core/DicomTag.generated.js";
import { DicomUID } from "../../core/DicomUID.js";
import { DicomDataset } from "../../dataset/DicomDataset.js";
import { cloneDataset } from "../../dataset/DicomDatasetExtensions.js";
import { MemoryByteBuffer } from "../../io/buffer/MemoryByteBuffer.js";
import { DicomPixelData } from "../DicomPixelData.js";
import { Stack } from "./Stack.js";

/**
 * Creates DICOM datasets from generated reconstruction slices.
 */
export class DicomGenerator {
  private readonly commonDataset: DicomDataset;

  constructor(commonDataset: DicomDataset) {
    this.commonDataset = cloneDataset(commonDataset);
  }

  storeAsDicom(stackToStore: Stack, newSeriesDescription: string): DicomDataset[] {
    const datasets: DicomDataset[] = [];
    const newSeriesUID = DicomUID.generate();
    let instanceNumber = 1;

    for (const slice of stackToStore.slices) {
      const dataset = cloneDataset(this.commonDataset);
      dataset.remove(Tags.PixelData);
      dataset.remove(Tags.NumberOfFrames);

      dataset.addOrUpdateValue(Tags.SeriesDescription, newSeriesDescription);
      dataset.addOrUpdateValue(Tags.SeriesInstanceUID, newSeriesUID);
      dataset.addOrUpdateValue(Tags.SOPInstanceUID, DicomUID.generate());
      dataset.addOrUpdateValue(Tags.InstanceNumber, instanceNumber++);
      dataset.addOrUpdateValue(Tags.AcquisitionDate, new Date());
      dataset.addOrUpdateValue(Tags.AcquisitionDateTime, new Date());

      dataset.addOrUpdateValue(Tags.Rows, slice.rows);
      dataset.addOrUpdateValue(Tags.Columns, slice.columns);
      dataset.addOrUpdateValue(Tags.ImagePositionPatient, ...slice.topLeft.toArray());
      dataset.addOrUpdateValue(
        Tags.ImageOrientationPatient,
        slice.rowDirection.x,
        slice.rowDirection.y,
        slice.rowDirection.z,
        slice.columnDirection.x,
        slice.columnDirection.y,
        slice.columnDirection.z,
      );
      dataset.addOrUpdateValue(Tags.PixelSpacing, slice.spacing, slice.spacing);
      dataset.addOrUpdateValue(Tags.SliceThickness, stackToStore.sliceDistance);

      if (!dataset.contains(Tags.BitsStored)) {
        const interval = slice.getMinMaxValue();
        const bitsStored = Math.max(1, Math.ceil(Math.log2(Math.max(1, interval.max))));
        dataset.addOrUpdateValue(Tags.BitsStored, bitsStored);
        dataset.addOrUpdateValue(Tags.HighBit, bitsStored - 1);
      }

      const pixelData = DicomPixelData.create(dataset);
      const bytesPerPixel = pixelData.bitsAllocated > 8 ? 2 : 1;
      const frame = slice.renderRawData(bytesPerPixel);
      pixelData.addFrame(new MemoryByteBuffer(frame));
      datasets.push(dataset);
    }

    return datasets;
  }
}
