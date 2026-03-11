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

- [x] P2.1 Port T2 packet header/packet decode primitives needed by baseline decode
- [x] P2.2 Port T1 block decode path and MQ arithmetic decode dependencies
- [x] P2.3 Port inverse wavelet path (5/3 and 9/7 as required)
- [x] P2.4 Port component reconstruction and output sample packing
- [x] P2.5 Build `Jpeg2000Decoder` API and wire into four JPEG2000 codec classes
- [x] P2.6 Handle multi-frame decode loops and metadata validation in DICOM bridge

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
- P2 verification update (2026-03-06):
  - Re-validated decode API wiring for all four codec classes (`.90/.91/.92/.93`) through current in-tree `decodeJpeg2000` path.
  - Added explicit multi-frame decode-loop regression test at codec level (all four syntaxes).
  - Added decode-side metadata mismatch/context regression test asserting `syntax` + `frame` in error messages.

Exit criteria:

- `.90/.91/.92/.93` decode real fixture files successfully
- Decoded frame size/shape/component checks pass

---

## Phase 3 - Encode Pipeline (P0 Priority)

- [x] P3.1 Port forward wavelet transforms and coefficient preparation
- [x] P3.2 Port T1 block encode path and MQ arithmetic encode
- [x] P3.3 Port T2 packetization and codestream writing
- [x] P3.4 Port rate/layer/progression core behavior for P0 subset
- [x] P3.5 Build `Jpeg2000Encoder` API and wire into four JPEG2000 codec classes
- [x] P3.6 Validate single-frame + multi-frame encode paths

Progress note:

- P3.1 kickoff done: forward 5/3 + 9/7 parity/multilevel transforms are now in-tree and covered by roundtrip tests.
- P3.1 kickoff done: `jpeg2000/core/encoder/Jpeg2000Encoder` now performs encode-side sample unpacking, DC-level centering, Part 1 forward MCT (RCT/ICT), and per-component forward DWT analysis scaffolding for `.90/.91` before packetization/T1/MQ integration.
- P3.2 kickoff done: in-tree `Jpeg2000MqEncoder` + `Jpeg2000T1Encoder` now cover baseline Tier-1 encode passes and MQ arithmetic encode with TS roundtrip tests; integration into T2 packetization/codestream writer is pending in P3.3.
- P3.3 kickoff done: baseline single-layer LRCP packet header/body encoding + single-tile codestream writer are now wired into `Jpeg2000Encoder.encodeFrame` and `encodeJpeg2000` for Part1 `.90/.91` staging.
- P3.4 baseline done: LRCP multi-layer packet planning is now wired with layer pass allocation, TERMALL code-block style, and per-layer pass/length header semantics (`numPasses` + pass-length vectors) in TS T1/T2 encode path.
- P3.6 kickoff done: TS encode -> Go decode compatibility matrix now covers `.90/.91` fixture corpus (single-layer + multi-layer/rate-derived scenarios) with parity checks against TS decode output.
- P3.6 follow-up done: `.90/.91` TS->Go matrix now includes multi-frame parity checks (per-frame Go hash == TS decode hash).
- P4 follow-up done (partial): lossless defaults + rate-to-targetRatio/layer derivation are now aligned with Go baseline semantics in codec normalization path.
- P3.6 follow-up done (Phase 3 completion):
  - Added PSNR-based quality assertion test for `.91` with multiple target ratio scenarios (quality 50/30/10 thresholds),
  - Parameter normalization table audit completed with strict invalid/fallback tests,
  - Metadata semantics alignment completed for `.90/.91/.92/.93` (PI + planar configuration).
- P7 kickoff update (2026-03-10):
  - Added shared JPEG2000 codec-level error wrapper helper that standardizes `JPEG2000 {encode|decode} failed` prefix and appends context (`syntax`, `frame`, `size`, `bitsAllocated`, `bitsStored`, `samples`).
  - Rewired `.90/.91/.92/.93` codec classes to wrap decode and encode exceptions through the shared error helper while retaining nested failure detail messages.
  - Added codec-level malformed-input negative matrix and encode validation negative matrix across all four syntaxes to harden error-path coverage.
- P7.2 follow-up update (2026-03-10):
  - Extended JPEG2000 operation error wrapper with failure-class classification and embedded class tag in message:
    - `marker-corruption`
    - `truncation`
    - `metadata-mismatch`
    - `validation`
    - `unknown`
  - Added assertions for class-level behavior on `.90/.91/.92/.93` codec tests:
    - malformed decode input => `class=marker-corruption`
    - truncated codestream => `class=truncation`
    - metadata mismatch => `class=metadata-mismatch`
    - encode input validation => `class=validation`
- P7.2 hardening update (2026-03-10):
  - Refined `marker-corruption` classifier rules to cover:
    - invalid segment length path
    - tile header marker order path (`tile-part header ended before SOD marker`)
    - unexpected non-segment marker path
  - Added `.90/.91/.92/.93` codec-level negative matrices for:
    - invalid segment length codestream => `class=marker-corruption`
    - tile header marker sequence error (missing `SOD`) => `class=marker-corruption`
- P7.2 hardening update (2026-03-10, malformed-marker/truncation corpus extension):
  - Extended `marker-corruption` classifier coverage for additional malformed-container/codestream signals:
    - `missing required SIZ segment`
    - `payload does not start with SOC marker`
    - `JP2 stream does not contain a jp2c codestream box`
    - `invalid JP2 box header size`
  - Added `.90/.91/.92/.93` codec-level negative matrices for:
    - codestream missing `SIZ` => `class=marker-corruption`
    - JP2 container without `jp2c` codestream box => `class=marker-corruption`
- P7.2 hardening update (2026-03-10, SOT/Psot structural error mapping):
  - Extended `marker-corruption` classifier coverage for invalid tile-part length semantics:
    - `Invalid SOT Psot: tile-part exceeds codestream`
    - `Invalid SOT Psot: tile-part end precedes SOD data`
  - Added `.90/.91/.92/.93` codec-level negative matrices for:
    - oversized `Psot` (`tile-part exceeds codestream`) => `class=marker-corruption`
    - undersized `Psot` (`tile-part end precedes SOD data`) => `class=marker-corruption`
- P7.2 hardening update (2026-03-10, truncation corpus extension):
  - Added truncation-oriented negative coverage for container/codestream boundary breakage:
    - JP2 `XLBox` truncation (`Invalid JP2 box header: truncated XLBox`)
    - codestream premature end before marker scan completion (`Unexpected end of codestream while peeking marker`)
  - Added `.90/.91/.92/.93` codec-level negative matrices for:
    - JP2 truncated `XLBox` => `class=truncation`
    - missing trailing codestream bytes (EOC-removed fixture) => `class=truncation`
- P7.2 hardening update (2026-03-10, duplicate main-header segment mapping):
  - Extended `marker-corruption` classifier coverage for duplicate main-header segment failures:
    - `Duplicate SIZ segment in main header`
    - `Duplicate COD segment in main header`
    - `Duplicate QCD segment in main header`
  - Added `.90/.91/.92/.93` codec-level negative matrices for:
    - duplicate `SIZ` => `class=marker-corruption`
    - duplicate `COD` => `class=marker-corruption`
    - duplicate `QCD` => `class=marker-corruption`
- P7.2 hardening update (2026-03-11, Part2 malformed-marker corpus extension):
  - Extended `marker-corruption` classifier coverage to include malformed Part2 marker signals:
    - `Unsupported MCT Zmct value`
    - `Unsupported MCT Ymct value`
    - `Unsupported MCC Zmcc value`
    - `Unsupported MCC Ymcc value`
    - `Invalid MCT segment payload length`
    - `Invalid MCC segment payload length`
    - `Invalid MCO segment payload length`
    - `Invalid MCC payload: no collections`
  - Added `.90/.91/.92/.93` codec-level negative matrices for:
    - malformed `MCT` selector fields (`Zmct`/`Ymct`) => `class=marker-corruption`
    - malformed `MCC` selector fields (`Zmcc`/`Ymcc`) => `class=marker-corruption`
    - invalid Part2 marker payload lengths (`MCT/MCC/MCO`) => `class=marker-corruption`
    - invalid `MCC` collection count (`Qmcc=0`) => `class=marker-corruption`
- P8.4 kickoff update (2026-03-11, lossless deterministic checks for `.90/.92`):
  - Added codec-level deterministic regression coverage for repeated lossless encode outputs:
    - single-frame `.90/.92`: byte equality + SHA-256 parity across repeated encodes,
    - multi-frame `.90/.92`: per-frame byte equality + SHA-256 parity across repeated encodes.
  - Added deterministic test helpers for RGB frame generation and Part2 lossless parameter setup in codec tests.
- P7.2 hardening update (2026-03-11, required main-header segments alignment):
  - `Jpeg2000CodestreamParser` now enforces required main-header segment presence after parse:
    - missing `COD` => `JPEG2000 codestream is missing required COD segment`
    - missing `QCD` => `JPEG2000 codestream is missing required QCD segment`
  - Extended codec failure classifier `marker-corruption` branch to include:
    - `missing COD segment` / `missing required COD segment`
    - `missing QCD segment` / `missing required QCD segment`
  - Added `.90/.91/.92/.93` codec-level negative matrices for:
    - missing `COD` => `class=marker-corruption`
    - missing `QCD` => `class=marker-corruption`
- P8.1 follow-up update (2026-03-11, Go->TS Part2 generated-vector compatibility):
  - Extended `DicomJpeg2000TsEncodeGoDecode` with explicit Go-encode -> TS-decode assertions for `.92/.93` generated vectors:
    - inputs: `tests/imaging/jpeg2000/fixtures/go-part2-lossless.j2k` / `go-part2-lossy.j2k`
    - checks: `Go decode hash == TS decode hash` + decoded byte-length parity
  - Reused existing Go decode tool path (`tools/decode_codestream`) for parity verification.
- Next sub-goal (current): continue P4/P7/P8 hardening:
  - Full parameter behavior table audit completion,
  - Broader malformed-marker/truncation corpus + Go parity table for failure-class mapping,
  - Part 2 (`.92/.93`) acceptance-corpus expansion + negative/error-path hardening.
- P3.5/P5 kickoff update:
  - Added in-tree Part2 MCT builder module (`jpeg2000/core/mct`) for encode-side `MCT/MCC/MCO` marker construction (bindings + ordering + element-type serialization).
  - `Jpeg2000Encoder` now supports Part2 encode path (no adapter):
    - encode-side Part2 forward pre-transform (inverse-matrix based) + offsets normalization,
    - codestream `Rsiz=2`,
    - main-header emission of `MCT/MCC/MCO` segments.
  - `.92/.93` codec encode gating removed (baseline path now active in `mc-lossless` / `mc-lossy`).
- P3.6 extension update:
  - Added `.92/.93` TS->Go compatibility tests (single-frame + multi-frame synthetic vectors), hash parity green against Go decoder output.
- P5.3 update:
  - Aligned no-binding fallback semantics with Go behavior for Part2 encode (`.92/.93`):
    - no `mctBindings` and no valid fallback matrix => no Part2 markers, fallback to Part1 MCT behavior;
    - no `mctBindings` with `mctMatrix/mctOffsets` => emit Part2 markers and apply Part2 custom path;
    - invalid fallback matrix dimensions => skip Part2 markers and use Part1 fallback path.
  - Added positive/negative regression tests for fallback matrix+offsets, offsets-only, and invalid matrix dimensions.
- P3.5 completion update:
  - Wired all four JPEG2000 codec classes (`.90/.91/.92/.93`) to call in-tree `Jpeg2000Encoder` directly (no `encodeJpeg2000` helper indirection).
  - Added per-codec encoder instance reuse path for single-frame and multi-frame encode loops.
- P3.6 completion update:
  - Extended lossy quality threshold validation from `.91` to `.93` on acceptance fixture flow.
  - Stabilized lossy quality assertions to PSNR/MAE parity checks against Go decode output (removed unstable compression-ratio gate).

Exit criteria:

- Encoded output can be decoded by TS decoder and Go decoder
- Lossless round-trip byte equality on designated fixtures

---

## Phase 4 - Parameter Model Full Alignment

- [x] P4.1 Align `DicomJpeg2000Params` defaults and normalization rules with Go semantics
- [x] P4.2 Align mapping for:
  - `irreversible`
  - `rate`, `rateLevels`, `targetRatio`
  - `numLevels`, `numLayers`
  - `progressionOrder`
  - `allowMct`, `updatePhotometricInterpretation`
  - `encodeSignedPixelValuesAsUnsigned`
- [x] P4.3 Add strict parameter validation tests (invalid + fallback behavior)

Progress note:

- P4.3 kickoff done: added strict invalid/fallback tests for `DicomJpeg2000Params.cloneNormalized` and lossless codec encode path fallback behavior (including out-of-range progression, invalid layer/ratio inputs).
- P4.3 follow-up done: added strict semantics matrix tests for `allowMct` + `updatePhotometricInterpretation` (PI + COD MCT flag assertions on `.90/.91`) and compatibility regression for `encodeSignedPixelValuesAsUnsigned`.
- P4.3 follow-up done: added helper-level metadata semantics matrix for `.90/.91/.92/.93` and boolean fallback normalization tests for compatibility flags in `DicomJpeg2000Params.cloneNormalized`.

- Phase 4 completion update (2026-03-10):
  - Completed Part2 scalar normalization alignment in `DicomJpeg2000Params.cloneNormalized`:
    - `mctNormScale` now enforces positive-only semantics (`<=0` -> `1.0`),
    - `mctMatrixElementType` now preserves valid range `0..3` (fallback `1`).
  - Completed Part2 MCC reversible mapping alignment in in-tree builder:
    - explicit `mctBindings` with missing `mcoPrecision` default to non-reversible,
    - explicit `mcoPrecision` bit0 controls MCC reversible flag,
    - fallback matrix path derives reversible from codec irreversible mode.
  - Added strict regression coverage for above semantics:
    - `tests/imaging/DicomJpeg2000Params.test.ts`
    - `tests/imaging/jpeg2000/Jpeg2000Part2MctBuilder.test.ts`

Exit criteria:

- Parameter behavior table matches Go reference expectations

---

## Phase 5 - Part 2 Multi-component and MCT Alignment (P1)

- [x] P5.1 Align `.92/.93` multi-component routing and validation
- [x] P5.2 Align MCT-related parameters and bindings:
  - `mctBindings`, `mctMatrix`, `inverseMctMatrix`, `mctOffsets`
  - `mctAssocType`, `mctMatrixElementType`
  - `mcoPrecision`, `mcoRecordOrder`
- [x] P5.3 Align fallback behavior when no MCT binding is provided

Exit criteria:

- Part 2 feature tests pass and match Go behavioral expectations

---

## Phase 6 - DICOM Metadata Semantics

- [x] P6.1 Align encode-side `PhotometricInterpretation` update rules
- [x] P6.2 Align decode-side normalization to RGB where expected
- [x] P6.3 Enforce planar configuration behavior after encode/decode
- [x] P6.4 Align lossy flags/ratio metadata updates where applicable

Progress note:

- P6 follow-up done (partial): added strict metadata semantics test matrix for encode/decode helper paths covering `.90/.91/.92/.93` PI + planar behavior.
- P6.4 kickoff done (partial): `DicomTranscoder` now appends lossy metadata (`0028,2110/2112/2114`) on lossy encode paths with fo-dicom-aligned append semantics and ratio formatting.
- P6.4 follow-up done: unified lossy metadata assertions extended to all lossy transfer syntaxes:
  - JPEG Baseline (Process 1) — `ISO_10918_1`
  - JPEG Extended (Process 2 & 4) — `ISO_10918_1`
  - JPEG-LS Near-Lossless — `ISO_14495_1`
  - JPEG2000 Lossy — `ISO_15444_1`
  - JPEG2000 Part 2 MC — `ISO_15444_2`
  - HT-J2K Lossy — `ISO_15444_15`
  - Test coverage includes preserving existing metadata when appending new entries.
- Phase 6 completion update (2026-03-10):
  - Expanded end-to-end JPEG2000 metadata semantics matrix from `.90/.91` to `.90/.91/.92/.93` in `DicomJpeg2000ParamSemantics`:
    - encode-side PI update behavior (`allowMct` / `updatePhotometricInterpretation`) now asserted for Part 2 syntaxes as well,
    - encode/decode roundtrip now explicitly asserts decode-side PI normalization to `RGB` where expected,
    - planar configuration remains enforced as interleaved (`PlanarConfiguration=0`) after both encode and decode.
  - Added explicit JPEG2000 lossy metadata append assertions on real encode path for `.91/.93`:
    - `LossyImageCompression (0028,2110) = "01"`,
    - `LossyImageCompressionMethod (0028,2112)` appends `ISO_15444_1` / `ISO_15444_2` while preserving existing values,
    - `LossyImageCompressionRatio (0028,2114)` appends numeric ratio while preserving existing entries.

Exit criteria:

- Metadata assertions pass for `.90/.91/.92/.93`

---

## Phase 7 - Error Model Alignment

- [x] P7.1 Standardize error text schema with context:
  - `syntax UID`
  - `frame index`
  - key dimensions/bit depth where relevant
- [-] P7.2 Align key failure modes with Go logic (invalid markers, truncation, mismatched metadata)
- [x] P7.3 Add negative tests for malformed codestream and invalid parameter combinations

Exit criteria:

- Error-path test suite is stable and actionable

---

## Phase 8 - Cross-Implementation Validation

- [ ] P8.1 Add Go->TS compatibility tests (Go encoded sample decoded by TS)
- [ ] P8.2 Add TS->Go compatibility tests (TS encoded sample decoded by Go)
- [ ] P8.3 Validate against `fo-dicom.Codecs/Tests/Acceptance` fixture set
- [-] P8.4 Add deterministic checks:
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
