# JPEG2000 Full Alignment Plan (dicom-ts <-> go-dicom-codec)

Status: Draft baseline plan for upcoming development sessions  
Owner: dicom-ts codec track  
Scope: JPEG2000 transfer syntaxes `.90/.91/.92/.93` (decode + encode), no adapter layer

---

## 1) Objective

Implement JPEG2000 in `dicom-ts` so runtime behavior is aligned with:

- `source-code/go-dicom-codec/jpeg2000/`
- `source-code/go-dicom-codec/jpeg2000/lossless/`
- `source-code/go-dicom-codec/jpeg2000/lossy/`

Alignment target:

- Same feature coverage for the selected phase subset
- Same parameter semantics and normalization rules
- Same DICOM-facing metadata behavior
- Compatible codestream handling (real J2K/JP2 flow, no custom pseudo codestream)

---

## 2) Hard Constraints

- Keep runtime model: pure TypeScript + Node built-ins only.
- No native codec dependency added to `dicom-ts`.
- No adapter abstraction layer for JPEG2000.
- JPEG2000 implementation must be in-tree under `src/imaging/codec/jpeg2000/`.
- Behavior alignment must be validated against real fixtures and cross-implementation tests.

---

## 3) Current Gap Summary

- Existing TS JPEG2000 path is not real J2K/JP2-compatible (custom internal marker/profile).
- Real JPEG2000 DICOM fixtures fail decode.
- Go reference has full codec pipeline (codestream parser, T1/T2, wavelet, MQ, color transform, Part 2 hooks).
- TS side currently lacks those equivalent internals.

---

## 4) Final Target Architecture

Planned TypeScript structure (mirrors Go package responsibilities):

- `src/imaging/codec/jpeg2000/core/`
  - `decoder/*`
  - `encoder/*`
  - `codestream/*`
  - `colorspace/*`
  - `wavelet/*`
  - `mqc/*`
  - `t1/*`
  - `t2/*`
  - `types/*`
- `src/imaging/codec/jpeg2000/common/`
  - DICOM bridge utilities (parameter normalization, metadata updates, validation)
- `src/imaging/codec/jpeg2000/{lossless,lossy,mc-lossless,mc-lossy}/`
  - Four concrete `IDicomCodec` classes using in-tree encoder/decoder directly

No adapter contracts exported for JPEG2000.

---

## 5) Transfer Syntax Coverage

Mandatory complete coverage:

- `1.2.840.10008.1.2.4.90` JPEG2000 Lossless
- `1.2.840.10008.1.2.4.91` JPEG2000 (lossy/lossless)
- `1.2.840.10008.1.2.4.92` JPEG2000 Part 2 Multi-component Lossless
- `1.2.840.10008.1.2.4.93` JPEG2000 Part 2 Multi-component

---

## 6) Work Breakdown (Execution Phases)

## Phase 0 - Baseline and Freeze

- [x] P0.1 Create alignment checklist from Go modules to TS modules
- [x] P0.2 Mark and remove invalid custom JPEG2000 codestream path
- [x] P0.3 Add failing regression tests for real fixtures first (red baseline)
- [x] P0.4 Document known non-aligned behaviors (start-of-project snapshot)

Exit criteria:

- Failing tests demonstrate current real JPEG2000 incompatibility
- Team agrees checklist is the single source of truth

---

## Phase 1 - Codestream + Parser Foundation

- [x] P1.1 Port marker definitions and codestream core types
- [x] P1.2 Port parser for core marker segments and stream navigation
- [x] P1.3 Add TS tests equivalent to Go parser-focused tests
- [x] P1.4 Confirm frame/tiling/component metadata extraction parity

Exit criteria:

- TS parser can parse valid codestream metadata from real fixtures
- Segment-level tests pass

---

## Phase 2 - Decode Pipeline (P0 Priority)

- [ ] P2.1 Port T2 packet header/packet decode primitives needed by baseline decode
- [ ] P2.2 Port T1 block decode path and MQ arithmetic decode dependencies
- [x] P2.3 Port inverse wavelet path (5/3 and 9/7 as required)
- [x] P2.4 Port component reconstruction and output sample packing
- [ ] P2.5 Build `Jpeg2000Decoder` API and wire into four JPEG2000 codec classes
- [ ] P2.6 Handle multi-frame decode loops and metadata validation in DICOM bridge

Progress note:

- Decoder skeleton and codestream-form resolution (J2K/JP2) are in place under `jpeg2000/core/decoder`.
- P2.1 kickoff done: `jpeg2000/core/t2` now has packet header bit-io/tag-tree/parser and packet decoder foundation with unit tests.
- P2.1 follow-up: decoder now wires per-tile packet summary parsing through T2 foundation (still throws staged not-implemented for T1/DWT/sample reconstruction).
- P2.2 kickoff done: in-tree MQ decoder + T1 decoder landed and decoder now converts packet bodies into code-block coefficients (DWT/sample reconstruction still pending).
- P2.3 + P2.4 bridge done: code-block coefficients now flow through inverse DWT (5/3 + 9/7), component reconstruction, tile assembly, and sample packing in `Jpeg2000Decoder`.
- P2 follow-up: standard Part 1 inverse MCT (RCT/ICT) + decode-side colorspace inverse path wired for `.90/.91` staging.
- P2 follow-up: max-bitplane estimation now aligned with Go `t2/bitplane.go` (`QCD` subband mapping + guard bits + zero-bitplanes), bringing `.90/.91` fixture metrics close to reference; residual sparse outliers remain.
- P2 follow-up: sparse outliers were confirmed to be identical to go-dicom-codec output for the same codestream; TS decode now byte-equal to Go decode on `.90/.91` acceptance fixtures (hash parity tests added).
- P2/P5 bridge kickoff: Part 2 marker parsing (`MCT/MCC/MCO`) + decode-side binding/fallback inverse MCT path landed, with header metadata (`irreversible/isPart2`) wired from codestream state.
- P8.1 kickoff extension: added Go-generated Part 2 parity vectors (`.92/.93`) and TS hash-parity decode tests against Go decoder output.

Exit criteria:

- `.90/.91/.92/.93` decode real fixture files successfully
- Decoded frame size/shape/component checks pass

---

## Phase 3 - Encode Pipeline (P0 Priority)

- [x] P3.1 Port forward wavelet transforms and coefficient preparation
- [x] P3.2 Port T1 block encode path and MQ arithmetic encode
- [x] P3.3 Port T2 packetization and codestream writing
- [x] P3.4 Port rate/layer/progression core behavior for P0 subset
- [ ] P3.5 Build `Jpeg2000Encoder` API and wire into four JPEG2000 codec classes
- [ ] P3.6 Validate single-frame + multi-frame encode paths

Progress note:

- P3.1 kickoff done: forward 5/3 + 9/7 parity/multilevel transforms are now in-tree and covered by roundtrip tests.
- P3.1 kickoff done: `jpeg2000/core/encoder/Jpeg2000Encoder` now performs encode-side sample unpacking, DC-level centering, Part 1 forward MCT (RCT/ICT), and per-component forward DWT analysis scaffolding for `.90/.91` before packetization/T1/MQ integration.
- P3.2 kickoff done: in-tree `Jpeg2000MqEncoder` + `Jpeg2000T1Encoder` now cover baseline Tier-1 encode passes and MQ arithmetic encode with TS roundtrip tests; integration into T2 packetization/codestream writer is pending in P3.3.
- P3.3 kickoff done: baseline single-layer LRCP packet header/body encoding + single-tile codestream writer are now wired into `Jpeg2000Encoder.encodeFrame` and `encodeJpeg2000` for Part1 `.90/.91` staging.
- P3.4 baseline done: LRCP multi-layer packet planning is now wired with layer pass allocation, TERMALL code-block style, and per-layer pass/length header semantics (`numPasses` + pass-length vectors) in TS T1/T2 encode path.
- P3.6 kickoff done: TS encode -> Go decode compatibility matrix now covers `.90/.91` fixture corpus (single-layer + multi-layer/rate-derived scenarios) with parity checks against TS decode output.
- Next sub-goal (current): P3.6/P4 hardening:
  - extend matrix to multi-frame cases and wider fixture coverage,
  - tighten irreversible (`.91`) quality/threshold assertions and metadata semantics,
  - align remaining rate/target-ratio parameter normalization edge cases.

Exit criteria:

- Encoded output can be decoded by TS decoder and Go decoder
- Lossless round-trip byte equality on designated fixtures

---

## Phase 4 - Parameter Model Full Alignment

- [ ] P4.1 Align `DicomJpeg2000Params` defaults and normalization rules with Go semantics
- [ ] P4.2 Align mapping for:
  - `irreversible`
  - `rate`, `rateLevels`, `targetRatio`
  - `numLevels`, `numLayers`
  - `progressionOrder`
  - `allowMct`, `updatePhotometricInterpretation`
  - `encodeSignedPixelValuesAsUnsigned`
- [ ] P4.3 Add strict parameter validation tests (invalid + fallback behavior)

Exit criteria:

- Parameter behavior table matches Go reference expectations

---

## Phase 5 - Part 2 Multi-component and MCT Alignment (P1)

- [ ] P5.1 Align `.92/.93` multi-component routing and validation
- [ ] P5.2 Align MCT-related parameters and bindings:
  - `mctBindings`, `mctMatrix`, `inverseMctMatrix`, `mctOffsets`
  - `mctAssocType`, `mctMatrixElementType`
  - `mcoPrecision`, `mcoRecordOrder`
- [ ] P5.3 Align fallback behavior when no MCT binding is provided

Exit criteria:

- Part 2 feature tests pass and match Go behavioral expectations

---

## Phase 6 - DICOM Metadata Semantics

- [ ] P6.1 Align encode-side `PhotometricInterpretation` update rules
- [ ] P6.2 Align decode-side normalization to RGB where expected
- [ ] P6.3 Enforce planar configuration behavior after encode/decode
- [ ] P6.4 Align lossy flags/ratio metadata updates where applicable

Exit criteria:

- Metadata assertions pass for `.90/.91/.92/.93`

---

## Phase 7 - Error Model Alignment

- [ ] P7.1 Standardize error text schema with context:
  - `syntax UID`
  - `frame index`
  - key dimensions/bit depth where relevant
- [ ] P7.2 Align key failure modes with Go logic (invalid markers, truncation, mismatched metadata)
- [ ] P7.3 Add negative tests for malformed codestream and invalid parameter combinations

Exit criteria:

- Error-path test suite is stable and actionable

---

## Phase 8 - Cross-Implementation Validation

- [ ] P8.1 Add Go->TS compatibility tests (Go encoded sample decoded by TS)
- [ ] P8.2 Add TS->Go compatibility tests (TS encoded sample decoded by Go)
- [ ] P8.3 Validate against `fo-dicom.Codecs/Tests/Acceptance` fixture set
- [ ] P8.4 Add deterministic checks:
  - lossless: byte/hash equivalence where feasible
  - lossy: pixel error thresholds

Exit criteria:

- Compatibility matrix is green for required syntaxes and scenarios

---

## Phase 9 - Performance and Stability

- [ ] P9.1 Add micro-benchmarks for encode/decode hot paths
- [ ] P9.2 Optimize allocation pressure in T1/T2/wavelet paths
- [ ] P9.3 Validate large-frame and multi-frame memory behavior

Exit criteria:

- No critical regressions versus baseline functional requirements

---

## 7) Test Matrix (Must Cover)

- Syntax: `.90`, `.91`, `.92`, `.93`
- Frame count: single, multi-frame
- Samples per pixel: 1, 3, and multi-component paths
- Bit depth: 8, 12, 16 where supported
- Pixel representation: unsigned + signed
- Photometric interpretations: MONOCHROME2, RGB, YBR variants
- Invalid inputs:
  - malformed markers
  - truncated codestream
  - mismatched metadata
  - unsupported parameter combinations

---

## 8) Session-by-Session Development Order

Order for future chat sessions:

1. Phase 0 completion and red tests
2. Phase 1 codestream foundation
3. Phase 2 decode path green for `.90/.91`
4. Extend decode to `.92/.93`
5. Phase 3 encode for `.90/.91`
6. Extend encode to `.92/.93`
7. Phases 4-7 alignment hardening
8. Phases 8-9 compatibility + performance closure

Each session rule:

- Start with one explicit sub-goal from this plan
- End with:
  - files changed
  - tests run
  - checklist items updated

---

## 9) Risks and Mitigations

Risk: Full Go parity is large in scope (T1/T2/MQ complexity)  
Mitigation: Decode-first vertical slices, strict incremental gating per phase.

Risk: Lossy byte stream non-determinism across implementations  
Mitigation: Validate semantic parity (quality/error metrics), not raw bytes.

Risk: Part 2 MCT edge behavior drift  
Mitigation: Add dedicated binding/order/precision tests mirroring Go cases.

Risk: Performance regressions in pure TS  
Mitigation: Profile-guided optimization after functional parity.

---

## 10) Definition of Done

Done means all conditions below are true:

- `.90/.91/.92/.93` encode/decode pass required matrix tests.
- Real JPEG2000 DICOM fixtures decode correctly.
- Cross-implementation compatibility tests (Go <-> TS) are passing.
- No adapter path remains for JPEG2000.
- `npm test` and `npm run build` are green.
- Plan checklist items are fully closed.

---

## 11) Tracking Notes

- This file is the baseline plan for all upcoming JPEG2000 alignment sessions.
- New tasks should be appended without removing historical completion state.
- If scope changes, update this file first, then implement.
