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
- Missing or incomplete:
  - `DicomJpegLosslessDecoder` is still not implemented
  - `DicomTransferSyntax` does not fully expose `4.92` / `4.93` constants
  - No unified codec capability metadata (decode-only vs encode+decode)
  - No full acceptance matrix for all required transfer syntaxes

## 4) Architecture and Boundaries

- Keep core runtime policy unchanged:
  - Pure TypeScript + Node built-ins in the main library
- Built-in vs plugin strategy:
  - Built-in (in-tree): JPEG Lossless Process 14 family (`4.57`, `4.70`) and RLE
  - Plugin-first: JPEG Baseline/Extended, JPEG-LS, JPEG 2000 family
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
- [ ] B1. Port Process 14 decode chain from `JpegLossless/`
  - [ ] Huffman table parsing
  - [ ] Frame/scan header parsing
  - [ ] Predictor pipeline (all Process 14 predictors)
- [ ] B2. SV1 behavior support
  - [ ] Enforce predictor 1 for `4.70`
- [ ] B3. Pixel integration
  - [ ] Validate 8/12/16-bit cases and multi-frame handling
- [ ] B4. Conformance tests
  - [ ] Pixel-level compare with known-good decode outputs

### C. JPEG Baseline/Extended (`4.50`, `4.51`) - plugin path
- [ ] C1. Define official adapter contract
  - [ ] I/O buffer shape, color space expectations, 12-bit notes
- [ ] C2. Provide one reference adapter example (no bundled binary)
- [ ] C3. Add integration tests for registered adapter behavior

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
- [ ] `4.57` and `4.70` pass pixel-level validation against reference outputs
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
