# tool: dicom-info

Load a DICOM file and print basic information and common tag values.

## Run

```bash
npm run tool:dicom-info -- ./path/to/file.dcm
```

Or run directly:

```bash
node tools/dicom-info/index.mjs ./path/to/file.dcm
```

Output to file:

```bash
node tools/dicom-info/index.mjs ./path/to/file.dcm -o ./out/file-info.txt
```

## Output includes

- File basics (path, size, format, transfer syntax, element count)
- Patient tags (name/id/birth date/sex)
- Study tags (date/time/id/accession/description/study UID)
- Series tags (modality/number/description/series UID)
- SOP and media-storage UID values
- File meta values (implementation UID/version and AET fields)
