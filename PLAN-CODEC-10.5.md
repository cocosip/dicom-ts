# Phase 10.5 Codec Implementation Plan (By Encoding Family)

This document is the execution plan for codec work in Phase 10.5.
It is the baseline document for future implementation tasks.

## 1) Scope and Required Transfer Syntax Coverage

Required syntax UIDs:

- JPEG Family
  - `1.2.840.10008.1.2.4.50` JPEG Baseline (Process 1), lossy 8-bit
  - `1.2.840.10008.1.2.4.51` JPEG Extended (Process 2 & 4), lossy 8/12-bit
  - `1.2.840.10008.1.2.4.57` JPEG Lossless (Process 14), all predictors
  - `1.2.840.10008.1.2.4.70` JPEG Lossless SV1 (Process 14, predictor 1)
- JPEG-LS Family
  - `1.2.840.10008.1.2.4.80` JPEG-LS Lossless
  - `1.2.840.10008.1.2.4.81` JPEG-LS Near-Lossless
- JPEG 2000 Family
  - `1.2.840.10008.1.2.4.90` JPEG 2000 Lossless
  - `1.2.840.10008.1.2.4.91` JPEG 2000 (lossy/lossless)
  - `1.2.840.10008.1.2.4.92` JPEG 2000 Multi-component Lossless
  - `1.2.840.10008.1.2.4.93` JPEG 2000 Multi-component

## 2) Reference Sources

- Pure C# core reference:
  - `source-code/fo-dicom/FO-DICOM.Core/Imaging/Codec/`
  - `source-code/fo-dicom/FO-DICOM.Core/Imaging/Codec/JpegLossless/`
- Codec plugin/native reference:
  - `source-code/fo-dicom.Codecs/Codec/`
  - `source-code/fo-dicom.Codecs/Native/`
  - `source-code/fo-dicom.Codecs/Tests/Acceptance/`

## 3) Current State and Gaps

Current state in `dicom-ts`:
- Already available:
  - `IDicomCodec`, `IDicomTranscoder`, `TranscoderManager`
  - `DicomTranscoder` pipeline
  - `DicomRleCodec` base implementation
  - Codec family split layout initialized:
    - `src/imaging/codec/rle/`
    - `src/imaging/codec/jpeg/`
    - `src/imaging/codec/jpeg-ls/`
    - `src/imaging/codec/jpeg2000/`
    - `src/imaging/codec/common/`
- Missing or incomplete:
  - JPEG Process 14 core decode chain is implemented (`codec/jpeg/common/JpegProcess14Common.ts`), conformance matrix still in progress
  - `DicomTransferSyntax` does not fully expose `4.92` / `4.93` constants
  - No unified codec capability metadata (decode-only vs encode+decode)
  - No full acceptance matrix for all required transfer syntaxes

## 4) Architecture and Boundaries

- Keep core runtime policy unchanged:
  - Pure TypeScript + Node built-ins in the main library
- Built-in vs plugin strategy:
  - Built-in (in-tree): JPEG Lossless Process 14 family (`4.57`, `4.70`) and RLE
  - Plugin-first: JPEG Baseline/Extended, JPEG-LS, JPEG 2000 family
- Source layout strategy:
  - By family directory:
    - `codec/rle/`
    - `codec/jpeg/`
    - `codec/jpeg-ls/`
    - `codec/jpeg2000/`
    - `codec/common/`
  - JPEG transfer-syntax split (one transfer syntax => one codec entrypoint):
    - baseline (`4.50`)
    - extended (`4.51`)
    - lossless (`4.57`)
    - lossless14sv1 (`4.70`)
  - Current TS layout:
    - `codec/jpeg/baseline/DicomJpegProcess1Codec.ts`
    - `codec/jpeg/extended/DicomJpegProcess2_4Codec.ts`
    - `codec/jpeg/lossless/DicomJpegProcess14Codec.ts`
    - `codec/jpeg/lossless14sv1/DicomJpegProcess14SV1Codec.ts`
    - `codec/jpeg/common/JpegProcess14Common.ts`
    - `codec/jpeg/common/JpegBaselineExtendedCommon.ts`
  - Reference for codec family split style:
    - `source-code/go-dicom-codec/jpeg/`
  - Each family keeps its own adapter/codec/decoder/encoder files and `index.ts`
- Do not import native binaries from `source-code/fo-dicom.Codecs/Native/` into core runtime

## 5) Work Breakdown Structure (WBS)

### A. Foundation (cross-family)
- [ ] A1. Add missing transfer syntax constants and mapping
  - [ ] Add `JPEG2000MCLossless` (`4.92`) and `JPEG2000MC` (`4.93`) in `DicomTransferSyntax`
  - [ ] Add tests for syntax lookup and registration flow
- [ ] A2. Extend codec capability model
  - [ ] Add capability metadata (decode, encode, lossy/lossless flags)
  - [ ] Add strict error messages for missing capability paths
- [ ] A3. Standardize codec error model and logging context
  - [ ] Include syntax UID, frame index, and bit depth in errors

### B. JPEG Lossless family (`4.57`, `4.70`) - built-in
- [x] B1. Port Process 14 decode chain from `JpegLossless/`
  - [x] Huffman table parsing
  - [x] Frame/scan header parsing
  - [x] Predictor pipeline (all Process 14 predictors)
- [x] B2. SV1 behavior support
  - [x] Enforce predictor 1 for `4.70`
- [ ] B3. Pixel integration
  - [x] Validate 8-bit RGB fixture path with `DicomTranscoder`
  - [ ] Validate 8/12/16-bit full matrix and multi-frame handling
- [ ] B4. Conformance tests
  - [x] Added fo-dicom-compatible output hash check for `PM5644-960x540_JPEG-Lossless_RGB.dcm`
  - [ ] Expand to more fixtures (grayscale 12/16-bit, multi-frame)

### C. JPEG Baseline/Extended (`4.50`, `4.51`) - plugin path
- [x] C1. Define official adapter contract
  - [x] I/O buffer shape, color space expectations, 12-bit notes
- [x] C2. Provide one reference adapter example (no bundled binary)
  - [x] Implemented via callback adapter examples in `tests/imaging/DicomJpegBaselineExtendedCodec.test.ts`
- [x] C3. Add integration tests for registered adapter behavior

### D. JPEG-LS (`4.80`, `4.81`) - plugin path
- [ ] D1. Define parameter model (near-lossless controls, sign/precision)
- [ ] D2. Provide one reference adapter example
- [ ] D3. Add integration tests for lossless and near-lossless paths

### E. JPEG 2000 (`4.90`, `4.91`, `4.92`, `4.93`) - plugin path
- [ ] E1. Complete syntax routing and registry wiring for all 4 UIDs
- [ ] E2. Define multi-component handling expectations
- [ ] E3. Provide one reference adapter example
- [ ] E4. Add integration tests for all 4 UIDs

## 6) Test and Acceptance Plan

Test layers:
- Unit tests: parser/codec internal behavior and edge cases
- Integration tests: `DicomTranscoder` path with registered codecs
- Acceptance tests: use samples from `source-code/fo-dicom.Codecs/Tests/Acceptance/`

Minimum acceptance criteria:
- [ ] Each required UID can be decoded through standard codec routing
- [ ] `4.57` and `4.70` pass pixel-level validation against reference outputs (full fixture matrix)
- [ ] Plugin families complete "register -> decode -> transcode pipeline" validation
- [ ] Error messages are actionable and include syntax UID and frame index

## 7) Milestones

- M1 (P0): Foundation tasks (A1-A3)
- M2 (P0): JPEG Lossless Process 14 family (`4.57`, `4.70`) usable in core
- M3 (P1): JPEG Baseline/Extended + JPEG-LS plugin pipeline usable
- M4 (P1): JPEG 2000 family (`4.90`, `4.91`, `4.92`, `4.93`) plugin pipeline usable
- M5 (P1): Full regression matrix and documentation closure

## 8) Risks and Mitigation

- Risk: Color space and bit depth mismatches across codec families
  - Mitigation: Add strict pixel-level reference assertions
- Risk: Different external codec backends behave differently
  - Mitigation: Enforce adapter contract and conformance fixtures
- Risk: Multi-component JPEG 2000 complexity (`4.92`, `4.93`)
  - Mitigation: Prioritize decode path first, then encode path as follow-up
