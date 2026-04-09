# dicom-ts 浏览器 / Node 拆包与插件化方案

> 执行版计划与落地状态请见：`PLAN-BROWSER-NODE-SPLIT-FULL.md`

本文件是后续拆分 `dicom-ts` npm 包结构的基线设计文档。
目标不是立即改代码，而是先统一架构边界、包职责和实施顺序。

> Status note (2026-04-09):
> 本文档是浏览器 / Node 拆分、image / codec / file 插件化的基线方案。
> 后续实际实施时，如果某一阶段的目录或导出细节发生变化，应以实施阶段文档和代码为准，
> 但总体边界原则应保持不变。

## 1. 背景与问题定义

当前 `dicom-ts` 仍然是单包结构，根入口直接导出共享能力与 Node 专属能力。
这对未来 npm 拆包发布有几个直接问题：

- 主包当前不是浏览器安全的默认入口。
- `network` 明确依赖 `node:net` / `node:tls`，只能在 Node 环境运行。
- 部分文件处理能力直接依赖 Node 文件系统，而浏览器侧文件处理模型完全不同。
- imaging 层当前存在硬编码实现，后续无法自然切换到 Web / Node 各自更合适的第三方库。
- 现有手写 JPEG 编码器存在质量问题，不能作为长期方案继续保留为默认实现。

本次拆分的目标不是简单把 `network` 独立出去，而是建立一个可长期演进的运行时分层模型：

- 浏览器默认包：浏览器安全、可直接用于前端影像处理。
- Node 全功能包：覆盖网络、文件、服务端图像处理与后续高性能扩展。
- image / codec / file 均采用插件或适配器模型，避免在主包中硬编码运行时差异。

## 2. 总体设计目标

### 2.1 总目标

- 采用同一个代码仓库，多 npm 包发布。
- `dicom-ts` 成为浏览器安全的默认主包。
- `dicom-ts-node` 成为 Node 全功能包。
- Node 端能力是主包能力的超集。
- browser / Node 差异通过适配器和插件解决，不通过主包内的大量运行时分支解决。

### 2.2 约束

- 保持项目仍以 `fo-dicom` 为核心参考，但不照搬其服务端优先的运行时假设。
- 主包不能暴露 `node:` 依赖。
- `network` 不进入浏览器安全主包。
- 文件处理不能继续将 Node `fs` 能力和浏览器文件交互混在同一层。
- JPEG 编码不再使用当前手写实现，后续统一改为基于第三方库的适配器方案。

## 3. 核心设计决策

### 3.1 仓库形态：单仓多包

建议保持一个仓库，拆成多个 npm 包，而不是多个独立仓库。

原因：

- 各包会共享大量 DICOM 核心类型、数据集模型、transfer syntax、测试夹具和兼容性用例。
- image / codec / network 虽然运行时边界不同，但仍属于同一个系统。
- 拆成多个仓库会显著增加版本同步、跨包调试、兼容性回归和重构成本。

建议后续演进到如下结构：

```text
/packages
  /dicom-ts
  /dicom-ts-node
  /dicom-ts-codec-native
```

第一阶段不要求马上完成目录迁移，但所有实施都应以这个目标结构为准。

### 3.2 npm 包划分

#### 包 1：`dicom-ts`

定位：浏览器安全的默认主包。

职责：

- 提供共享核心能力。
- 提供浏览器可运行的 imaging / codec 默认能力。
- 提供浏览器侧文件输入输出适配能力。
- 不包含任何 Node 专属运行时能力。

应包含的能力：

- `core`
- `dataset`
- 浏览器安全的内存型 `io`
- 共享 `media` / `serialization` 中不依赖 Node 的部分
- imaging render core
- 通用 image surface 抽象
- image backend / image encoder 注册机制
- codec provider / transcoder 注册机制
- Web 默认 codec provider
- Web 默认 image encoder / exporter 适配器

明确不应包含：

- `network`
- 基于 `fs` / `path` / `stream` 的 Node 文件操作
- 绑定 Node 服务端库的图像处理实现
- 原生 codec 实现

#### 包 2：`dicom-ts-node`

定位：Node 全功能包。

职责：

- 在 `dicom-ts` 共享能力基础上补足 Node 专属能力。
- 提供服务端场景所需的网络、文件、服务端图像处理和后续高性能编解码接入。

应包含的能力：

- `network`
- Node 文件系统读写适配器
- Node 路径 / 流 / 本地文件工具
- Node 侧 image backend
- Node 侧 image encoder 适配器
- Node 侧默认插件注册入口
- 对主包共享 API 的再导出

要求：

- `dicom-ts-node` 在能力上是 `dicom-ts` 的超集。
- Node 业务如果只装 `dicom-ts-node`，应能获得完整服务端功能。

#### 包 3：`dicom-ts-codec-native`

定位：Node 高性能 codec 扩展包。

职责：

- 只做性能增强，不定义新的主 API 模型。
- 通过 codec provider 方式挂接到 `dicom-ts` / `dicom-ts-node`。

说明：

- 第一阶段不是必须产物。
- 等 native codec 路线成熟后再单独发布。

## 4. 运行时分层模型

后续所有拆分都应遵守以下运行时分层：

### 4.1 Core 层

职责：

- DICOM 数据模型
- 解析 / 序列化
- 像素数据与 render pipeline
- 与运行时无关的抽象接口

要求：

- 只依赖 TypeScript / JavaScript 标准能力。
- 不直接依赖 Node 文件系统、Node 网络、浏览器 DOM 对象。

### 4.2 Adapter 层

职责：

- 连接 Core 与具体运行时能力。
- 封装 Node 与浏览器的环境差异。

典型适配器：

- 文件输入适配器
- 文件输出适配器
- image backend 适配器
- image encoder 适配器
- codec provider 适配器

### 4.3 Runtime 包层

职责：

- 将适配器按运行时组装为对外 npm 包。

运行时分工：

- `dicom-ts` 负责浏览器安全默认组装。
- `dicom-ts-node` 负责 Node 全功能组装。

## 5. 文件处理设计

浏览器与 Node 的文件模型不能继续混在一起设计。

### 5.1 核心原则

文件处理要基于“数据源 / 数据目标”抽象，而不是把 `fs` 逻辑直接写进共享核心。

共享层只面向通用输入输出：

- `Uint8Array`
- `ArrayBuffer`
- `Blob`
- `ReadableStream`
- 自定义 `IByteSource` / `IByteTarget` 风格抽象

### 5.2 浏览器侧文件模型

浏览器侧不是“路径文件操作”，而是“与浏览器文件对象和 UI 交互”。

浏览器侧典型能力：

- `File`
- `Blob`
- `<input type="file">`
- drag-and-drop
- 下载导出
- 内存 buffer 读写

浏览器侧应提供的适配器：

- `readDicomFromFile(file: File | Blob)`
- `readDicomFromArrayBuffer(buffer: ArrayBuffer)`
- `writeDicomToBlob(...)`
- `exportImageToBlob(...)`

浏览器侧不提供：

- path-based API
- 本地文件路径扫描
- TCP socket

### 5.3 Node 侧文件模型

Node 侧保留完整文件能力。

Node 侧典型能力：

- 文件路径读取 / 写入
- stream 读写
- 目录扫描
- 工具型命令行文件处理

Node 侧应提供的适配器：

- `readDicomFromPath(path: string)`
- `writeDicomToPath(path: string, ...)`
- `scanDicomDirectory(path: string)`
- 文件流输入输出封装

### 5.4 拆分原则

- 解析 DICOM 文件内容的核心逻辑留在共享层。
- 获取文件内容的运行时方式放到各自适配器中。
- `DicomFile` 不应继续同时承担“DICOM 数据模型”和“Node 文件系统入口”这两类职责。

## 6. Imaging 设计

image 这层必须整体插件化，而不只是最终的 JPEG 输出插件化。

### 6.1 Imaging 三层结构

#### 层 1：Render Core

职责：

- 从 DICOM dataset / pixel data 渲染出通用像素结果。
- 保持和运行时无关。

输出目标：

- 通用 `IImageSurface` 或与之等价的数据结构
- 最低要求应包含：
  - `width`
  - `height`
  - `pixelFormat`
  - `pixels`

#### 层 2：Image Backend

职责：

- 把通用像素面适配成运行时图像对象。

浏览器侧可能输出：

- `ImageData`
- `ImageBitmap`
- Canvas 可消费对象
- `Blob`

Node 侧可能输出：

- `Buffer`
- 第三方图像库输入对象
- 服务端处理库可消费对象

#### 层 3：Image Encoder / Exporter

职责：

- 把通用像素面编码成 JPEG / PNG / WebP 等格式。

### 6.2 接口建议

建议引入如下抽象：

- `IImageSurface`
- `IImageBackend`
- `IImageEncoder`
- `IImageEncoderRegistry`
- `IImageBackendRegistry`

### 6.3 JPEG 设计决策

当前手写 JPEG 编码器不能继续作为未来方案。

明确决策：

- 废弃当前手写 JPEG encoder 作为长期默认实现。
- 后续 JPEG 必须基于第三方库进行适配。
- 浏览器与 Node 使用不同实现，但接口保持统一。

后续实现方向：

- 浏览器侧：接入适合浏览器运行的第三方 JPEG 编码库，并包装为 `IImageEncoder`
- Node 侧：接入适合 Node 服务端的图像库，并包装为 `IImageEncoder`

要求：

- Core 层不直接依赖具体 JPEG 库。
- JPEG 只是一个 encoder 插件，不是 imaging core 的组成部分。
- `DicomImage` 只负责 render，不直接负责输出 JPEG 文件。

## 7. Codec 设计

codec 必须改为“默认 provider + 可扩展 provider”模型。

### 7.1 目标

- 浏览器端默认可用。
- Node 端可扩展到更高性能实现。
- 不在共享 core 中硬编码运行时差异。

### 7.2 建议模型

建议引入如下抽象：

- `IDicomCodecProvider`
- `IDicomCodecRegistry`
- `IDicomTranscoderFactory`
- `ITransferSyntaxCapability`

职责划分：

- shared core 只依赖 registry / provider 接口
- Web 默认 provider 提供浏览器可运行的 codec
- Node 可追加更快的 provider
- native codec 通过独立扩展包注册

### 7.3 Web 默认能力

`dicom-ts` 应内置 Web 默认 codec 能力，但只限浏览器可承受的实现路径。

原则：

- Web 默认 codec 应优先选择前端可用第三方库或纯 TS 方案。
- 浏览器中无法合理实现或成本过高的 codec，不应在主包中伪装成内置可用能力。
- 主包应清楚暴露 capability 查询，而不是假设所有 transfer syntax 都可用。

### 7.4 Node 增强能力

`dicom-ts-node` 负责提供更完整、更高性能的 codec 能力。

原则：

- Node 默认可以注册更多 provider。
- 后续原生 codec 应通过 `dicom-ts-codec-native` 注入，不直接污染主包。

## 8. Network 设计

`network` 保持 Node-only，不进入浏览器安全主包。

理由：

- 当前实现直接依赖 `node:net` / `node:tls`
- DICOM DIMSE 网络在浏览器环境没有直接可行的同等运行时能力

结论：

- `network` 全量进入 `dicom-ts-node`
- 主包 `dicom-ts` 默认不导出 `network`
- 如果未来需要浏览器侧远程通信能力，应单独设计新的高层远程接口，而不是复用现有 TCP DIMSE 层

## 9. 包导出原则

### 9.1 `dicom-ts`

默认入口必须浏览器安全。

原则：

- 不导出 `network`
- 不导出 Node 文件系统 API
- 不导出 `node:` 依赖链上的符号

### 9.2 `dicom-ts-node`

默认入口面向 Node 全功能使用。

原则：

- 可再导出共享主包能力
- 额外导出 Node 文件 / 网络 / Node image / Node codec 相关能力

### 9.3 能力注册入口

建议保留显式注册入口，避免运行时魔法过多。

例如：

- `registerWebImageEncoders()`
- `registerNodeImageEncoders()`
- `registerWebCodecProviders()`
- `registerNodeCodecProviders()`
- `registerNativeCodecProviders()`

## 10. 建议实施阶段

### Phase A：边界梳理与导出收口

目标：

- 定义浏览器安全主包边界
- 定义 Node 全功能包边界
- 明确现有源码哪些进入 shared，哪些进入 node

输出：

- 模块归属清单
- 新 package exports 方案
- 主包不再默认暴露 Node-only 入口

### Phase B：文件处理抽象拆分

目标：

- 将文件读写从共享 core 中抽离
- 建立 browser / Node 双适配器模型

输出：

- 浏览器侧 file / blob 适配器
- Node 侧 path / fs 适配器

### Phase C：Imaging 插件化

目标：

- 抽出 image surface / backend / encoder 三层
- 去掉 imaging 中对具体 JPEG 实现的硬编码

输出：

- `IImageSurface`
- `IImageBackend`
- `IImageEncoder`
- registry 机制

### Phase D：JPEG 第三方适配替换

目标：

- 替换当前手写 JPEG encoder
- 使用第三方库接入 browser / Node 双实现

输出：

- 浏览器 JPEG encoder 适配器
- Node JPEG encoder 适配器
- 移除旧默认实现

### Phase E：Codec Provider 化

目标：

- 将 transcoder / codec 选择改造成 provider 模型

输出：

- codec registry
- Web 默认 provider
- Node 扩展 provider

### Phase F：拆包发布

目标：

- 完成 monorepo 包结构
- 发布首批 npm 包

建议首批发布：

- `dicom-ts`
- `dicom-ts-node`

第二批可选发布：

- `dicom-ts-codec-native`

## 11. 非目标

以下内容不在本轮基线拆分目标内：

- 浏览器内实现完整 DIMSE TCP 网络栈
- 在主包中保留任何 Node-only 兼容分支作为长期方案
- 继续维护现有手写 JPEG encoder 作为正式默认实现
- 一开始就把所有能力拆成大量细粒度 npm 包

## 12. 最终结论

后续拆分应以以下结论为准：

- 保持一个仓库，多 npm 包发布。
- `dicom-ts` 是浏览器安全默认主包，不是空壳接口包。
- `dicom-ts-node` 是 Node 全功能包，在能力上是 `dicom-ts` 的超集。
- `network` 全部归入 `dicom-ts-node`。
- 文件处理按“数据源 / 数据目标适配器”拆分，不再把 Node `fs` 模型带进共享 core。
- imaging 必须整体插件化，包括 image surface、backend、encoder，而不只是最终 JPEG 导出。
- 当前手写 JPEG encoder 不再作为长期方案；后续统一改为第三方库适配。
- codec 采用 provider / registry 模型：Web 有默认实现，Node 可追加更强实现。

本文件是后续拆分实施的架构基线。
