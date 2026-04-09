# dicom-ts 浏览器 / Node 拆分完整执行计划（A-F）

## 目标
- `dicom-ts`：浏览器安全默认包。
- `dicom-ts-node`：Node 全功能超集包。
- `dicom-ts-codec-native`：可选原生编解码扩展包。

## Phase A：边界收口与导出模型重建
- 引入 `src/browser/index.ts` 与 `src/node/index.ts` 双运行时入口。
- 新增浏览器安全检查脚本：`scripts/check-browser-safe.mjs`。
- 默认主入口保持 Node 全功能兼容；浏览器能力走 browser 入口。

## Phase B：文件处理适配层拆分
- `DicomFile` 改为运行时无关核心：
  - 支持内存源打开（`Uint8Array` / `ArrayBuffer` / `BlobLike`）。
  - 提供浏览器侧导出能力（`toUint8Array` / `toArrayBuffer` / `toBlob`）。
  - Node path/stream 读写通过 `src/node/DicomFileNodeAdapter.ts` 延迟加载。
- 新增 runtime file adapters：
  - `src/browser/fileAdapters.ts`
  - `src/node/fileAdapters.ts`

## Phase C：Imaging 三层插件化
- 新增 image surface/backend/encoder 抽象：
  - `IImageSurface`
  - `IImageBackend`
  - `IImageEncoder`
- 新增注册中心：
  - `ImageBackendRegistry`
  - `ImageEncoderRegistry`
- `DicomImage` 新增：
  - `renderSurface()`
  - `encode()`
  - `convert()`

## Phase D：JPEG 导出可插拔化
- 现有 JPEG 路径改为可注册编码器：
  - `LegacyJpegImageEncoder`
  - `registerLegacyJpegImageEncoder()`
- 保留兼容导出（`encodeJpegImage` / `encodeRgbaToJpeg`）。

## Phase E：Codec Provider 化
- 新增 codec provider/registry 抽象：
  - `IDicomCodecProvider`
  - `IDicomCodecRegistry`
  - `IDicomTranscoderFactory`
  - `ITransferSyntaxCapability`
- 新增默认注册入口：
  - `registerWebCodecProviders()`
  - `registerNodeCodecProviders()`
  - `registerNativeCodecProviders()`（占位）
- `DicomTranscoder` 接入 codec registry 解析链路。

## Phase F：Monorepo 拆包与发布骨架
- 根项目改为 npm workspaces：
  - `packages/dicom-ts`
  - `packages/dicom-ts-node`
  - `packages/dicom-ts-codec-native`
- 新增占位包 `dicom-ts-codec-native`（用于后续原生插件接入）。

## 验证标准（当前已达成）
- `npm run build` 通过。
- `npm test` 通过（103 files / 775 tests）。
- `npm run check:browser-safe` 通过（递归检查 browser 入口依赖图）。
