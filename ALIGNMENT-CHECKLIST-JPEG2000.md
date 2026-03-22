# JPEG2000 Alignment Checklist (Go -> TypeScript)

This checklist tracks parity work between:

- Go reference: `source-code/go-dicom-codec/jpeg2000/`
- TS target: `src/imaging/codec/jpeg2000/`

Status legend:

- `TODO`: not started
- `WIP`: in progress
- `DONE`: aligned and verified with tests

---

## 1) Core module parity map

| Go module | TS target | Status | Notes |
| --- | --- | --- | --- |
| `jpeg2000/codestream/*` | `jpeg2000/core/codestream/*` | DONE | Marker/types/parser baseline + fixture metadata parsing (+ Part2 `MCT/MCC/MCO` segment parsing). Multi-tile-part merge now rejects conflicting tile-header `COD/QCD/COC/QCC/POC/RGN` sections like Go instead of silently overwriting/appending, `SOT` tile-part ordering/`TNsot` consistency now fail fast on invalid sequences, baseline `RGN` parsing/storage is wired in main + tile headers, main-header `COM` segments are now parsed/stored with Go-aligned `COM before SIZ` / invalid-payload handling, main-header ordering/duplicate semantics now match Go for `COD/QCD/COC/QCC/POC/RGN/MCT/MCC/MCO` (`COC before COD`, `QCC before QCD`, duplicate conflicting `COC/QCC` component records), and tile-header duplicate `COC/QCC` component semantics are now regression-locked to Go (`duplicate tile COC/QCC for component ...` on conflicting duplicates, identical duplicates accepted) |
| `jpeg2000/colorspace/*` | `jpeg2000/core/colorspace/*` | WIP | Inverse RCT/ICT landed; Part2 inverse MCT binding/fallback path wired. Forward path + parity matrix pending |
| `jpeg2000/mqc/*` | `jpeg2000/core/mqc/*` | WIP | MQ decoder + RAW bypass + baseline encoder landed; packetization integration/perf parity pending |
| `jpeg2000/t1/*` | `jpeg2000/core/t1/*` | WIP | T1 decoder + context model + baseline encoder landed; packetization integration/full parity pending |
| `jpeg2000/t2/*` | `jpeg2000/core/t2/*` | WIP | P2.1 packet header decode foundation + P3.3/P3.4 LRCP packet encoder landed; baseline non-LRCP encode traversal (`RLCP/RPCL/PCRL/CPRL`) is now wired and covered by ordering tests, but position/precinct geometry parity is still simplified |
| `jpeg2000/wavelet/*` | `jpeg2000/core/wavelet/*` | WIP | Inverse + forward 5/3 & 9/7 multilevel/parity path landed with roundtrip tests; fixture-level parity/perf validation pending |
| `jpeg2000/decoder.go` | `jpeg2000/core/decoder/*` | WIP | Header/codestream/T2+T1 -> DWT -> component assembly -> pixel packing wired; Part2 MCT binding/fallback + irreversible/isPart2 metadata landed; main-header `RGN` MaxShift inverse scaling is now applied during code-block reconstruction, `JP2ROI` COM rectangles now enable decode-side `GeneralScaling` application for intersecting code-blocks, tile-header `RGN` remains intentionally ignored to match the current Go decoder path, malformed/unknown-version `JP2ROI` COM payloads are skipped without affecting decode, decoder regression coverage now explicitly locks 12-bit signed/unsigned `SIZ` metadata plus 16-bit-packed storage semantics for empty-packet decode output, and the direct `decode()` path now fails fast on unusable tile state (`no tiles found`, unsupported progression order, tile-level decode errors) instead of silently returning zero-filled images |
| `jpeg2000/encoder.go` | `jpeg2000/core/encoder/*` | WIP | Encode-side analysis + in-tree MQ/T1 + single-tile codestream writing now support `LRCP/RLCP/RPCL/PCRL/CPRL` with COD propagation; full rate-target budget/PCRD parity and full geometry parity are still pending |
| `jpeg2000/mct_builder.go` + MCT tests | `jpeg2000/core/mct/*` | WIP | Part 2 MCT builder landed (`MCT/MCC/MCO` header construction + staged ordering + element-type encoding); `mcoRecordOrder` now honors only full valid MCC permutations like Go, but broader parity hardening/edge cases remain |
| `jpeg2000/lossless/*` | `jpeg2000/lossless/*` + `mc-lossless/*` | DONE | All four JPEG2000 codec classes are now wired directly to in-tree `Jpeg2000Encoder` API (no helper indirection) |
| `jpeg2000/lossy/*` | `jpeg2000/lossy/*` + `mc-lossy/*` | DONE | All four JPEG2000 codec classes are now wired directly to in-tree `Jpeg2000Encoder` API (no helper indirection) |

---

## 2) DICOM codec behavior parity

| Item | Status | Notes |
| --- | --- | --- |
| `.90` decode | WIP | Go hash parity is green, but direct acceptance-fixture RGB parity still fails (`PM5644-960x540_JPEG2000-Lossless.dcm` currently shows 1458 mismatched bytes vs `PM5644-960x540_RGB.dcm`) |
| `.91` decode | WIP | Go hash parity is green for `Lossy` and `Lossy50`, but direct RGB-threshold acceptance checks still fail (`Lossy` maxAbsDiff 255; `Lossy50` MAE 7.71 > 6 threshold) |
| `.92` decode | WIP | Part2 marker parsing + decode-side MCT binding/fallback path landed; Go-generated synthetic parity is green, real fixture parity pending |
| `.93` decode | WIP | Part2 marker parsing + decode-side MCT binding/fallback path landed; Go-generated synthetic parity is green, real fixture parity pending |
| `.90` encode | DONE | LRCP single/multi-layer path landed; codec now calls in-tree encoder API directly; TS->Go single/multi-frame fixture matrix green |
| `.91` encode | DONE | LRCP single/multi-layer path landed; TS->Go single/multi-frame fixture matrix green; lossy PSNR/MAE quality thresholds validated |
| `.92` encode | DONE | Part 2 encode path landed (`Rsiz=2` + Part2 MCT + `MCT/MCC/MCO` writing); TS->Go single/multi-frame parity green |
| `.93` encode | DONE | Part 2 encode path landed (`Rsiz=2` + Part2 MCT + `MCT/MCC/MCO` writing); TS->Go single/multi-frame parity green + lossy PSNR/MAE thresholds validated |
| Photometric/Planar updates | DONE | Helper-level + end-to-end matrices now cover `.90/.91/.92/.93` encode/decode PI + planar semantics (including Part 2 `.92/.93` transcode roundtrip assertions) |
| Parameter normalization parity | WIP | Lossless defaults + rate/targetRatio/layer derivation aligned; strict regression table now covers allowMct/updatePI/encodeSigned + invalid/fallback behaviors (including `.92/.93` metadata mapping helper coverage). Part2 scalar normalization + MCC reversible semantics aligned; full-table audit still pending |
| Error model parity | WIP | Standardized `JPEG2000 {encode|decode} failed [class=...]` wrapping + `syntax/frame/size/bits/samples` context landed. Failure classes include `marker-corruption` / `truncation` / `metadata-mismatch` / `validation` with broad malformed-codestream coverage, including malformed main-header payloads for `SIZ/COD/QCD`, Go-aligned main-header ordering failures (`COD/QCD/COC/QCC/POC/RGN/MCT/MCC/MCO before required predecessors`), duplicate conflicting main-header `COC/QCC` component markers, duplicate conflicting tile-header `COC/QCC` component markers, and strict decoder tile-state failures such as `no tiles found in codestream` and `unsupported progression order`; Go-side full failure-class table audit pending |

---

## 3) Validation matrix

| Validation | Status | Notes |
| --- | --- | --- |
| Decode fo-dicom.Codecs JPEG2000 acceptance fixtures | WIP | Go parity is green for `.90/.91`, but direct RGB-reference acceptance checks still fail; `.92/.93` acceptance-fixture coverage remains unavailable/pending |
| Go encode -> TS decode compatibility | WIP | `.90/.91` acceptance codestreams + `.92/.93` Go-generated Part2 vectors are green on hash parity; `.92/.93` now also have multi-frame DICOM-container decode-loop regression coverage using repeated Go-generated codestreams; broader corpus still pending |
| TS encode -> Go decode compatibility | DONE | `.90/.91` acceptance fixture single/multi-frame + `.92/.93` single/multi-frame matrix green |
| Lossless deterministic checks | WIP | Codec-level deterministic hash/byte checks added for repeated `.90/.92` lossless encodes (single + multi-frame); acceptance-fixture deterministic matrix pending |
| Lossy threshold checks | DONE | `.91/.93` lossy quality threshold checks are stable via PSNR/MAE assertions against Go decode output |
| Single-frame + multi-frame coverage | DONE | `.90/.91/.92/.93` single-frame and multi-frame encode->decode compatibility matrix is green |
| Invalid codestream negative tests | WIP | Truncation + marker corruption + metadata mismatch baseline matrices covered at codec level; broader malformed corpus still pending |

---

## 4) Known blockers / current reality

- Current TS JPEG2000 backend is an in-tree real J2K/JP2 implementation, but validation and hardening are still incomplete.
- Custom pseudo-codestream backend has been removed.
- Baseline non-`LRCP` encode progression support is now implemented, but TS still uses a simplified single-tile/single-precinct-oriented planner rather than full Go-equivalent position geometry.
- Remaining fixture gap includes `.90/.91` divergence from direct RGB-reference acceptance checks and the absence of broad Part2 `.92/.93` real-fixture validation.

---

## 5) Session log (compact)

- [x] Chosen sub-goal mapped to one row above
- [x] Files changed listed
- [x] Tests added/updated listed
- [x] Commands run listed
- [x] Row statuses updated (`TODO/WIP/DONE`)
- Retention policy: keep only recent key sessions here; detailed history is kept in Git.

### 2026-03-11 (Phase 8 / P8.1 Go->TS compatibility extension: Part2 `.92/.93`)

- Focus: extend Go->TS compatibility with explicit Part2 generated-vector assertions.
- Key updates:
  - Added `DicomJpeg2000TsEncodeGoDecode` case for `go-part2-lossless.j2k` / `go-part2-lossy.j2k`.
  - Asserted `Go decode hash == TS decode hash` and decoded-length parity.
- Main touched files:
  - `tests/imaging/DicomJpeg2000TsEncodeGoDecode.test.ts`
  - `PLAN-JPEG2000-GO-ALIGNMENT.md`
  - `ALIGNMENT-CHECKLIST-JPEG2000.md`
- Commands:
  - `npm test -- --run tests/imaging/DicomJpeg2000TsEncodeGoDecode.test.ts`
  - `npm run build`

### 2026-03-17 (Phase 8 / acceptance-gap expansion for `.90/.91`)

- Focus: verify whether stale red-baseline coverage could be promoted to green acceptance regression coverage.
- Key updates:
  - Verified that `.90/.91` still fail direct RGB-reference acceptance assertions despite green Go hash parity.
  - Renamed the suite to `DicomJpeg2000AcceptanceGap.test.ts` to reflect its role as an expected-failure tracker.
  - Added `PM5644-960x540_JPEG2000-Lossy50.dcm` expected-failure threshold coverage.
  - Updated checklist rows to keep `.90/.91` decode in `WIP` with the observed divergence metrics.
- Main touched files:
  - `tests/imaging/DicomJpeg2000AcceptanceGap.test.ts`
  - `PLAN-JPEG2000-GO-ALIGNMENT.md`
  - `ALIGNMENT-CHECKLIST-JPEG2000.md`
- Commands:
  - `npm test -- --run tests/imaging/DicomJpeg2000AcceptanceGap.test.ts tests/imaging/DicomJpeg2000GoParity.test.ts`

### 2026-03-20 (Phase 5 / encode progression-order support beyond LRCP)

- Focus: close the concrete encoder feature gap where `progressionOrder !== 0` still threw in TS.
- Key updates:
  - Added packet-emission ordering support for `RLCP/RPCL/PCRL/CPRL` in `jpeg2000/core/t2/Jpeg2000PacketEncoder.ts`.
  - Wired `Jpeg2000Encoder` to emit the requested COD progression-order value instead of forcing `LRCP`.
  - Added T2 ordering regression coverage plus lossless TS roundtrip tests for non-LRCP progression orders.
  - Added TS encode -> Go decode interoperability coverage for non-LRCP `.90` multi-frame encodes.
- Main touched files:
  - `src/imaging/codec/jpeg2000/core/t2/Jpeg2000PacketEncoder.ts`
  - `src/imaging/codec/jpeg2000/core/encoder/Jpeg2000Encoder.ts`
  - `tests/imaging/jpeg2000/Jpeg2000PacketEncoder.test.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Encoder.test.ts`
  - `tests/imaging/DicomJpeg2000TsEncodeGoDecode.test.ts`
- Commands:
  - `npm test -- --run tests/imaging/jpeg2000/Jpeg2000PacketEncoder.test.ts tests/imaging/jpeg2000/Jpeg2000Encoder.test.ts`
  - `npm run build`
  - `npm test -- --run tests/imaging/DicomJpeg2000TsEncodeGoDecode.test.ts`

### 2026-03-20 (Phase 7 / parser hardening coverage extension)

- Focus: expand codestream parser regression coverage to match Go-side baseline malformed/parser vectors more closely.
- Key updates:
  - Added parser regression coverage for main-header `COC/QCC/POC` marker parsing.
  - Added malformed codestream coverage for empty data, SOC-only input, missing EOC, short invalid-marker input, and truncated SIZ input.
  - Kept this as parser-level hardening coverage; runtime row statuses remain unchanged.
- Main touched files:
  - `tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts`
- Commands:
  - `npm test -- --run tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts`

### 2026-03-20 (Phase 7 / codec failure-class extension for COC/QCC/POC)

- Focus: extend codec-level malformed-marker classification to cover non-Part2 header markers already supported by the parser.
- Key updates:
  - Added codec regression coverage for malformed `COC/QCC/POC` payloads.
  - Updated JPEG2000 failure classification to map invalid `COC/QCC/POC` payload-length errors to `marker-corruption`.
- Main touched files:
  - `src/imaging/codec/jpeg2000/common/Jpeg2000CodecCommon.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
- Commands:
  - `npm test -- --run tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm run build`

### 2026-03-21 (Phase 5 / MCO record-order semantics alignment)

- Focus: align Part 2 `mcoRecordOrder` handling with Go so invalid or partial stage lists do not silently reorder MCC stages.
- Key updates:
  - Tightened TS `MCO` stage-order resolution to accept only full valid MCC permutations, matching Go `validMCOOrder`.
  - Added multi-stage Part 2 builder regression coverage for:
    - valid `mcoRecordOrder` reorder application,
    - partial/invalid `mcoRecordOrder` fallback to natural MCC order.
- Main touched files:
  - `src/imaging/codec/jpeg2000/core/mct/Jpeg2000Part2MctBuilder.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Part2MctBuilder.test.ts`
- Commands:
  - `npm test -- --run tests/imaging/jpeg2000/Jpeg2000Part2MctBuilder.test.ts`
  - `npm test -- --run tests/imaging/jpeg2000/Jpeg2000Encoder.test.ts tests/imaging/jpeg2000/Jpeg2000Part2MctBuilder.test.ts`
  - `npm run build`

### 2026-03-21 (Phase 7 / tile-part header merge consistency)

- Focus: align multi-tile-part parser merge semantics with Go so conflicting tile-header sections fail fast instead of being silently replaced.
- Key updates:
  - Tightened tile-part merge logic for `COD/QCD/COC/QCC/POC`.
  - TS parser now accepts repeated tile-header sections only when they are byte/field equivalent to the prior tile-part state.
  - Added parser regression coverage for conflicting same-tile `COD/QCD/COC/QCC/POC` sequences.
- Main touched files:
  - `src/imaging/codec/jpeg2000/core/codestream/Jpeg2000CodestreamParser.ts`
  - `tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts`
- Commands:
  - `npm test -- --run tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm run build`

### 2026-03-21 (Phase 7 / tile-part ordering and TNsot validation)

- Focus: align `SOT` tile-part sequence semantics with Go so malformed tile-part numbering is rejected during parse/decode.
- Key updates:
  - Added tile-part order validation for first-part index, sequential `TPsot`, `TNsot` consistency, and tile-part count overflow.
  - Extended codec-level failure classification so these parser errors surface as `class=marker-corruption`.
  - Added parser + codec regression coverage for the malformed tile-part sequence matrix.
- Main touched files:
  - `src/imaging/codec/jpeg2000/core/codestream/Jpeg2000CodestreamParser.ts`
  - `src/imaging/codec/jpeg2000/common/Jpeg2000CodecCommon.ts`
  - `tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
- Commands:
  - `npm test -- --run tests/imaging/DicomJpeg2000Codec.test.ts tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts`

### 2026-03-21 (Phase 7 / RGN parser support)

- Focus: add Go-aligned baseline `RGN` parsing and tile-part merge validation to the TS codestream parser.
- Key updates:
  - Added `RGN` segment parsing/storage for main and tile headers.
  - Extended tile-part merge consistency checks to reject conflicting same-tile `RGN` sections.
  - Extended codec failure classification and negative coverage for invalid/conflicting `RGN` marker cases.
- Main touched files:
  - `src/imaging/codec/jpeg2000/core/codestream/Jpeg2000CodestreamTypes.ts`
  - `src/imaging/codec/jpeg2000/core/codestream/Jpeg2000CodestreamParser.ts`
  - `src/imaging/codec/jpeg2000/common/Jpeg2000CodecCommon.ts`
  - `tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
- Commands:
  - `npm test -- --run tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts tests/imaging/DicomJpeg2000Codec.test.ts`

### 2026-03-21 (Phase 7 / RGN decode-side MaxShift alignment)

- Focus: align decode-side ROI handling with the Go path now that baseline `RGN` parsing is present.
- Key updates:
  - Wired main-header `RGN` component shifts/styles into `Jpeg2000Decoder` code-block reconstruction.
  - Applied Go-aligned inverse MaxShift before Tier-1 coefficient normalization.
  - Locked current Go behavior that `GeneralScaling` remains inert when no ROI geometry/mask is present.
  - Added decoder regression coverage for `RGN` MaxShift and no-geometry `GeneralScaling`.
- Main touched files:
  - `src/imaging/codec/jpeg2000/core/decoder/Jpeg2000Decoder.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
- Commands:
  - `npm test -- --run tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`

### 2026-03-21 (Phase 7 / COM parser support)

- Focus: align codestream parser and codec failure classification with Go for main-header `COM` segments.
- Key updates:
  - Added typed `COM` segment storage (`registration` + payload data) to TS codestream metadata.
  - `Jpeg2000CodestreamParser` now parses main-header `COM` markers and rejects `COM` before `SIZ`, matching Go parser behavior.
  - Extended codec failure classification and negative coverage for invalid `COM` payloads and `COM before SIZ`.
- Main touched files:
  - `src/imaging/codec/jpeg2000/core/codestream/Jpeg2000CodestreamTypes.ts`
  - `src/imaging/codec/jpeg2000/core/codestream/Jpeg2000CodestreamParser.ts`
  - `src/imaging/codec/jpeg2000/core/codestream/index.ts`
  - `src/imaging/codec/jpeg2000/common/Jpeg2000CodecCommon.ts`
  - `tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
- Commands:
  - `npm test -- --run tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm test -- --run tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm run build`

### 2026-03-22 (Phase 7 / main-header ordering and duplicate component-marker alignment)

- Focus: align TS codestream parser and codec failure classification with Go for main-header marker ordering constraints and duplicate component marker semantics.
- Key updates:
  - `Jpeg2000CodestreamParser` now rejects `COD/QCD/COC/QCC/POC/RGN/MCT/MCC/MCO` when they appear before required predecessor markers, matching Go main-header sequencing.
  - `COC` and `QCC` now allow byte-equivalent duplicate component records but reject conflicting duplicates in the main header, matching Go.
  - Extended codec-level `marker-corruption` classification and regression coverage for these ordering/conflict failures across `.90/.91/.92/.93`.
- Main touched files:
  - `src/imaging/codec/jpeg2000/core/codestream/Jpeg2000CodestreamParser.ts`
  - `src/imaging/codec/jpeg2000/common/Jpeg2000CodecCommon.ts`
  - `tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
- Commands:
  - `npm test -- --run tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts`
  - `npm test -- --run tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm run build`

### 2026-03-22 (Phase 7 / tile-header duplicate component-marker regression lock)

- Focus: lock Go-aligned tile-header duplicate `COC/QCC` component semantics with parser and codec regression coverage.
- Key updates:
  - Added parser regression coverage for duplicate tile-header `COC/QCC` component records:
    - conflicting duplicates fail with `duplicate tile COC/QCC for component ...`,
    - byte-equivalent duplicates are accepted.
  - Added codec-level `marker-corruption` regression coverage for conflicting duplicate tile-header `COC/QCC` markers across `.90/.91/.92/.93`.
- Main touched files:
  - `tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
- Commands:
  - `npm test -- --run tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts`
  - `npm test -- --run tests/imaging/DicomJpeg2000Codec.test.ts`

### 2026-03-22 (Phase 7 / decoder precision metadata and storage semantics)

- Focus: lock decoder high-bit-depth metadata and packed-output semantics with direct unit coverage.
- Key updates:
  - Added decoder regression coverage for 12-bit unsigned and 12-bit signed `SIZ` metadata reporting.
  - Added decoder regression coverage for empty-packet 12-bit output packing:
    - unsigned samples pack to 16-bit midpoint values (`2048`),
    - signed samples pack to 16-bit zero values.
- Main touched files:
  - `tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
- Commands:
  - `npm test -- --run tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
  - `npm test -- --run tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts tests/imaging/DicomJpeg2000Codec.test.ts`

### 2026-03-22 (Phase 7 / strict decoder fail-fast for unusable tile state)

- Focus: align direct TS decoder behavior more closely with Go by failing early when tile decode state is unusable.
- Key updates:
  - `Jpeg2000Decoder.decode()` now throws instead of silently returning assembled zero data when:
    - the codestream has no tiles,
    - a tile reports an unsupported progression order,
    - a tile-level decode error or failed code-block count is present.
  - Added decoder regression coverage for:
    - `no tiles found in codestream`,
    - `failed to decode tile 0: unsupported progression order: 99`.
  - Added codec-level `marker-corruption` coverage for the new strict decoder tile-state failures across `.90/.91/.92/.93`.
- Main touched files:
  - `src/imaging/codec/jpeg2000/core/decoder/Jpeg2000Decoder.ts`
  - `src/imaging/codec/jpeg2000/common/Jpeg2000CodecCommon.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
- Commands:
  - `npm test -- --run tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
  - `npm test -- --run tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm run build`

### 2026-03-21 (Phase 7 / decode-side JP2ROI COM geometry consumption)

- Focus: continue ROI alignment by wiring `JP2ROI` COM geometry into the TS decoder so `GeneralScaling` is no longer inert when ROI rectangles are available.
- Key updates:
  - Added decoder-side parsing for `JP2ROI` COM payloads (rectangle support plus polygon/mask fallback geometry extraction).
  - Combined parsed `JP2ROI` regions with per-component `RGN` shift/style state during code-block reconstruction.
  - Applied decode-side inverse `GeneralScaling` after Tier-1 normalization for code-blocks intersecting parsed ROI geometry, while keeping the no-geometry path inert.
  - Added decoder regression coverage for `GeneralScaling + JP2ROI`.
- Main touched files:
  - `src/imaging/codec/jpeg2000/core/decoder/Jpeg2000Decoder.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
- Commands:
  - `npm test -- --run tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
  - `npm test -- --run tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm run build`

### 2026-03-21 (Phase 7 / ROI decode parity hardening)

- Focus: lock current Go-aligned ROI edge behavior so later JPEG2000 work does not accidentally drift on `RGN`/`JP2ROI` semantics.
- Key updates:
  - Documented in decoder code that only main-header `RGN` contributes decode-side ROI state; tile-header `RGN` remains parsed but inert to match Go.
  - Added decoder regression coverage proving tile-header `RGN` does not affect reconstructed coefficients today.
  - Added decoder regression coverage proving malformed or unknown-version `JP2ROI` COM payloads are ignored rather than changing decode behavior.
- Main touched files:
  - `src/imaging/codec/jpeg2000/core/decoder/Jpeg2000Decoder.ts`
  - `tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
- Commands:
  - `npm test -- --run tests/imaging/jpeg2000/Jpeg2000Decoder.test.ts`
  - `npm test -- --run tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm run build`

### 2026-03-21 (Phase 8 / Part2 Go parity multi-frame extension)

- Focus: extend `.92/.93` Go-generated Part 2 parity coverage from single-frame decode to multi-frame DICOM container loops.
- Key updates:
  - Reused the existing Go-generated `.92/.93` codestream fixtures in repeated two-frame DICOM datasets.
  - Added multi-frame `DicomTranscoder` decode regression coverage for `.92` and `.93`.
  - Locked repeated-frame hash parity so both decoded frames match the expected Go-derived hashes.
- Main touched files:
  - `tests/imaging/DicomJpeg2000GoPart2Parity.test.ts`
- Commands:
  - `npm test -- --run tests/imaging/DicomJpeg2000GoPart2Parity.test.ts`

### 2026-03-21 (Phase 7 / malformed main-header payload classification)

- Focus: extend codec-level failure-class hardening for malformed required main-header segment payloads.
- Key updates:
  - Extended JPEG2000 failure classification so malformed `SIZ/COD/QCD` payload errors map to `class=marker-corruption`.
  - Added codec regression coverage for:
    - short/invalid `SIZ` payload,
    - short `COD` payload,
    - invalid `COD` precinct-length payload,
    - empty `QCD` payload.
- Main touched files:
  - `src/imaging/codec/jpeg2000/common/Jpeg2000CodecCommon.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
- Commands:
  - `npm test -- --run tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm test -- --run tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts`
  - `npm run build`

### 2026-03-11 (Phase 8 / P8.4 lossless deterministic checks kickoff: `.90/.92`)

- Focus: pin deterministic byte/hash behavior for repeated lossless encodes.
- Key updates:
  - Added repeated encode byte+SHA256 parity checks for `.90/.92` (single + multi-frame).
  - Updated validation row `Lossless deterministic checks` to `WIP`.
- Main touched files:
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
  - `PLAN-JPEG2000-GO-ALIGNMENT.md`
  - `ALIGNMENT-CHECKLIST-JPEG2000.md`
- Commands:
  - `npm test -- --run tests/imaging/DicomJpeg2000Codec.test.ts`
  - `npm run build`

### 2026-03-11 (Phase 7 / P7.2 required segments + Part2 malformed-marker hardening)

- Focus: extend marker-corruption mapping and parser validation.
- Key updates:
  - Added required main-header checks (`SIZ/COD/QCD`) and missing `COD/QCD` codec-level negatives.
  - Extended Part2 malformed marker coverage (`MCT/MCC/MCO`: invalid length/selector/collection cases).
- Main touched files:
  - `src/imaging/codec/jpeg2000/core/codestream/Jpeg2000CodestreamParser.ts`
  - `src/imaging/codec/jpeg2000/common/Jpeg2000CodecCommon.ts`
  - `tests/imaging/DicomJpeg2000Codec.test.ts`
- Commands:
  - `npm test -- --run tests/imaging/DicomJpeg2000Codec.test.ts tests/imaging/jpeg2000/Jpeg2000CodestreamParser.test.ts`
  - `npm run build`

### Archived history

- 2026-03-10 and earlier detailed entries have been compacted.
- Coverage includes Phase 6 metadata semantics closure, Phase 7 baseline error-model rollout, and Phase 3/5 encode-path hardening.
- For full per-session trace, use Git history for this file.
