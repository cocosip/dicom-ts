# DICOM Transcode Tool

A command-line tool to transcode DICOM files to one or many transfer syntaxes.

## Usage

```bash
node tools/dicom-transcode/index.mjs <input-file> [target-syntax] [options]
```

### Arguments

- `<input-file>`: Path to the input DICOM file.
- `[target-syntax]`: Target Transfer Syntax UID or alias.
  - If omitted, the tool will generate output files for all known compressed transfer syntaxes.
  - If provided, the tool will generate exactly one output file.

### Options

- `-o, --out <file>`: Output file path (single-target mode only).
- `--out-dir <dir>`: Output directory (all-target mode only). Defaults to the input file directory.
- `-version, --version`: Show version information.
- `-help, --help`: Show help message.

### Supported Syntax Aliases

- `rle`: RLE Lossless (`1.2.840.10008.1.2.5`)
- `jpeg-baseline`: JPEG Baseline (Process 1) (`1.2.840.10008.1.2.4.50`)
- `jpeg-extended`: JPEG Extended (Process 2 & 4) (`1.2.840.10008.1.2.4.51`)
- `jpeg-lossless`: JPEG Lossless (Process 14) (`1.2.840.10008.1.2.4.57`)
- `jpeg-lossless-sv1`: JPEG Lossless SV1 (Process 14 SV1) (`1.2.840.10008.1.2.4.70`)
- `jpegls`: JPEG-LS Lossless (`1.2.840.10008.1.2.4.80`)
- `jpegls-near`: JPEG-LS Near Lossless (`1.2.840.10008.1.2.4.81`)
- `jpeg2000-lossless`: JPEG 2000 Lossless (`1.2.840.10008.1.2.4.90`)
- `jpeg2000`: JPEG 2000 Lossy (`1.2.840.10008.1.2.4.91`)
- `htj2k-lossless`: HTJ2K Lossless (`1.2.840.10008.1.2.4.201`)
- `htj2k-lossless-rpcl`: HTJ2K Lossless RPCL (`1.2.840.10008.1.2.4.202`)
- `htj2k`: HTJ2K Lossy (`1.2.840.10008.1.2.4.203`)

### Examples

Generate all compressed transfer syntax outputs:
```bash
node tools/dicom-transcode/index.mjs study.dcm
```

Generate all compressed outputs into a dedicated directory:
```bash
node tools/dicom-transcode/index.mjs study.dcm --out-dir out
```

Convert to RLE Lossless:
```bash
node tools/dicom-transcode/index.mjs study.dcm rle
```

Convert to JPEG Baseline:
```bash
node tools/dicom-transcode/index.mjs study.dcm jpeg-baseline --out study.jpeg-baseline.dcm
```
