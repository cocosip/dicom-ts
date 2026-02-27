# dicom-ts 开发计划

基于 fo-dicom v5.2.5 完整移植到 TypeScript 的开发路线图。

---

## 技术选型与约束

### 包管理器
- **使用 npm**，不使用 bun/pnpm/yarn

### 依赖策略：最小化第三方依赖
目标在 ARM、龙芯 等环境中编译运行，原则如下：

**运行时依赖（runtime dependencies）：零依赖**
所有功能仅依赖 Node.js 内置模块和纯 TypeScript 实现：
- Deflate/zlib：使用 Node.js 内置 `node:zlib`
- 字符集解码：使用 Node.js 内置 `TextDecoder` / `TextEncoder`（Node.js ≥ 11 自带 ICU）
- UID 生成：使用 Node.js 内置 `node:crypto`（`randomUUID` / `randomBytes`）
- 网络通信：使用 Node.js 内置 `node:net` / `node:tls`
- 文件 I/O：使用 Node.js 内置 `node:fs/promises`

**编解码器策略**（针对无法纯 TS 实现的压缩格式）：
- RLE 无损：纯 TypeScript 实现（fo-dicom 已有完整算法）
- JPEG 无损（Lossless Process 14）：纯 TypeScript 移植（fo-dicom 有纯 C# 实现）
- JPEG 有损 / JPEG2000 / HTJ2K：定义 `IDicomCodec` 插件接口，不内置实现，由用户按需注册外部编解码器
- 大端字节序：纯 TypeScript 实现，不依赖任何库

**开发依赖（devDependencies）：最少化**
| 包 | 用途 | 是否有原生绑定 |
|----|------|----------------|
| `typescript` | 编译器 | 无 |
| `vitest` | 单元测试 | 无 |
| `@types/node` | Node.js 类型声明 | 无 |

**构建工具**：直接使用 `tsc`（两份 tsconfig 分别输出 CJS 和 ESM），不引入 `tsup`/`esbuild`/`rollup`（含原生绑定，ARM 下易出问题）。

**字典解析脚本**（仅构建时运行，不作为发布依赖）：
- 解析 `DICOMDictionary.xml.gz` 使用 Node.js 内置 `node:zlib` + 手写最小 XML 解析器，或将解析脚本列为可选 devDependency（纯 JS XML 库）

---

## 阶段总览

| 阶段 | 内容 | 优先级 |
|------|------|--------|
| Phase 1 | 项目初始化 & 工具链 | P0 |
| Phase 2 | 核心数据模型 | P0 |
| Phase 3 | 字典与注册表 | P0 |
| Phase 4 | 数据元素类型系统 | P0 |
| Phase 5 | DicomDataset | P0 |
| Phase 6 | I/O 缓冲层 | P0 |
| Phase 7 | 二进制读写 | P0 |
| Phase 8 | DicomFile | P0 |
| Phase 9 | JSON 序列化 | P1 |
| Phase 10 | 影像处理 | P1 |
| Phase 11 | 网络/DIMSE | P1 |
| Phase 12 | 高级功能 | P2 |

---

## Phase 1 — 项目初始化 & 工具链

### 1.1 包管理与项目结构
- [x] `npm init` 初始化 `package.json`（name: `dicom-ts`，type: `module`）
- [x] 建立目录结构：
  ```
  src/               # TypeScript 源码
  src/core/          # DicomTag, DicomVR, DicomVM, DicomUID 等
  src/dataset/       # DicomDataset, DicomElement 体系
  src/io/            # Buffer、Reader、Writer
  src/imaging/       # 影像处理
  src/network/       # DIMSE 网络层
  src/serialization/ # JSON 序列化
  src/media/         # DICOMDIR
  src/structured-report/ # SR
  src/printing/      # 打印
  scripts/           # 构建时工具脚本（字典生成等）
  tests/             # 单元测试
  dist/              # 构建输出（cjs/ + esm/）
  ```
- [x] 添加 `.gitignore`（node_modules、dist、*.dcm 测试文件等）

### 1.2 TypeScript 配置
- [x] `tsconfig.json` — 基础配置（strict, ES2020, Node16）
- [x] `tsconfig.cjs.json` — CJS 输出配置（`module: "CommonJS"`, outDir: `dist/cjs`）
- [x] `tsconfig.esm.json` — ESM 输出配置（`module: "ESNext"`, outDir: `dist/esm`）
- [x] `tsconfig.test.json` — 测试配置

### 1.3 开发依赖安装（仅 3 个包）
- [x] `npm install -D typescript @types/node vitest`

### 1.4 构建与测试脚本（package.json scripts）
- [x] `build:cjs` — `tsc -p tsconfig.cjs.json`
- [x] `build:esm` — `tsc -p tsconfig.esm.json`
- [x] `build` — `npm run build:cjs && npm run build:esm`
- [x] `test` — `vitest run`
- [x] `test:watch` — `vitest`
- [x] `test:coverage` — `vitest run --coverage`
- [x] `generate:dict` — 运行字典生成脚本

### 1.5 测试基础设施
- [x] 配置 `vitest.config.ts`（使用内置 Node 环境，无需 jsdom）
- [x] 从 fo-dicom Tests 目录复制 DICOM 测试文件到 `tests/fixtures/`
- [x] 建立测试辅助工具 `tests/helpers/`

---

## Phase 2 — 核心数据模型

参考源文件：`FO-DICOM.Core/DicomTag.cs`, `DicomVR.cs`, `DicomVM.cs`, `DicomUID.cs`, `DicomTransferSyntax.cs`

### 2.1 DicomTag
- [x] 实现 `DicomTag` 类
  - `group: number` (uint16)
  - `element: number` (uint16)
  - 私有标签检测：`isPrivate` (group 奇数)
  - `privateCreator: DicomPrivateCreator | null`
  - `dictionaryEntry` 延迟加载
- [x] 实现比较运算符 (`equals`, `compareTo`)
- [x] 实现格式化：`(GGGG,EEEE)` / JSON 格式
- [x] 实现 `uint32` 双向转换
- [x] `DicomTag.Unknown` 静态常量 `(FFFF,FFFF)`
- [x] `DicomMaskedTag` — 带通配符掩码的标签
- [x] `DicomPrivateCreator` — 私有标签创建者
- [x] 单元测试（参考 `DicomTagTest.cs`）

### 2.2 DicomVR（值表示）
- [x] 实现 `DicomVR` 类（所有属性）
  - `code: string`
  - `name: string`
  - `isString: boolean`
  - `isStringEncoded: boolean`
  - `is16bitLength: boolean`
  - `isMultiValue: boolean`
  - `paddingValue: number` (0x00 或 0x20)
  - `maximumLength: number`
  - `unitSize: number`
  - `byteSwap: number`
  - `valueType: string` (类型标识)
- [x] 注册全部 36 种 VR 常量：
  - **无 VR**: `NONE`
  - **字符串类**: `AE`, `AS`, `CS`, `DA`, `DS`, `DT`, `IS`, `LO`, `LT`, `PN`, `SH`, `ST`, `UC`, `UI`, `UR`, `UT`
  - **数值类**: `FD`, `FL`, `SL`, `SS`, `SV`, `UL`, `US`, `UV`
  - **其他类**: `AT`, `OB`, `OD`, `OF`, `OL`, `OW`, `OV`, `SQ`, `UN`
- [x] `DicomVR.parse(code: string): DicomVR`
- [x] `DicomVR.tryParse(code: string): DicomVR | null`
- [x] 单元测试

### 2.3 DicomVM（值重复数）
- [x] 实现 `DicomVM` 类
  - `minimum: number`
  - `maximum: number` (Infinity 表示无限)
  - `multiplicity: number` (步长，如 2-2n 步长为 2)
- [x] 注册预定义 VM 常量：
  - `VM_1`, `VM_1_2`, `VM_1_3`, `VM_1_8`, `VM_1_32`, `VM_1_99`, `VM_1_n`
  - `VM_2`, `VM_2_n`, `VM_2_2n`
  - `VM_3`, `VM_3_n`, `VM_3_3n`
  - `VM_4`, `VM_6`, `VM_16`
- [x] `DicomVM.parse(s: string): DicomVM`

### 2.4 DicomUID（唯一标识符）
- [x] 实现 `DicomUID` 类
  - `uid: string`
  - `name: string`
  - `type: DicomUidType` (SOPClass / TransferSyntax / ...)
  - `isRetired: boolean`
- [x] UID 格式验证（仅数字 + 点，最长 64 字符）
- [x] `DicomUIDGenerator` — 生成唯一 UID
- [x] 从 `DicomUID.Generated.cs` 生成所有标准 UID 常量（脚本生成）
- [x] 单元测试（参考 `DicomUIDTest.cs`, `DicomUIDGeneratorTest.cs`）

### 2.5 DicomTransferSyntax（传输语法）
- [x] 实现 `DicomTransferSyntax` 类
  - `uid: DicomUID`
  - `isExplicitVR: boolean`
  - `isEncapsulated: boolean`
  - `isLossy: boolean`
  - `isDeflate: boolean`
  - `endian: Endian`
  - `swapPixelData: boolean`
- [x] 注册所有标准传输语法常量（ExplicitVRLittleEndian、JPEG 系列等）
- [x] 单元测试（参考 `DicomTransferSyntaxTest.cs`）

### 2.6 DicomEncoding（字符集）
- [x] 实现字符集映射（SpecificCharacterSet → TextDecoder/TextEncoder）
- [x] 支持多值字符集（ISO 2022 转义序列）
- [x] `DicomEncoding.getEncoding(specificCharacterSet: string): TextDecoder`
- [x] 单元测试（参考 `DicomEncodingTest.cs`）

---

## Phase 3 — 字典与注册表

参考源文件：`FO-DICOM.Core/DicomDictionary.cs`, `DicomDictionaryEntry.cs`, `DicomDictionaryReader.cs`

### 3.1 DicomDictionaryEntry
- [x] 实现 `DicomDictionaryEntry` 类
  - `tag: DicomTag`
  - `maskedTag: DicomMaskedTag`
  - `name: string`
  - `keyword: string`
  - `vr: DicomVR`
  - `vm: DicomVM`
  - `isRetired: boolean`

### 3.2 DicomDictionary（单例）
- [x] 实现 `DicomDictionary` 单例类
  - 内部使用 `Map<uint32, DicomDictionaryEntry>` 存储
  - 支持掩码标签（如范围标签 `(60xx,3000)`）
- [x] 解析 `DICOMDictionary.xml.gz` — 构建时提取为 JSON
- [x] `lookup(tag: DicomTag): DicomDictionaryEntry`
- [x] `add(entry: DicomDictionaryEntry)` — 支持私有字典注册
- [x] `DicomDictionary.default` 静态单例
- [x] 单元测试（参考 `DicomDictionaryTest.cs`）

### 3.3 字典数据构建脚本
- [x] 编写脚本解析 `DICOMDictionary.xml.gz` → `dicom-dictionary.json`
- [x] 编写脚本解析 `PrivateDictionary.xml.gz` → `private-dictionary.json`
- [x] 将生成的 JSON 嵌入库中

---

## Phase 4 — 数据元素类型系统

参考源文件：`FO-DICOM.Core/DicomElement.cs`（全文，约 2500 行）

### 4.1 基础类层次
- [x] `DicomItem` — 所有 Dataset 元素的抽象基类（含 `tag: DicomTag`）
- [x] `DicomElement extends DicomItem` — 抽象基类
  - `vr: DicomVR`
  - `buffer: IByteBuffer`
  - `length: number`
  - `count: number`（抽象）
  - `get<T>(index: number): T`（抽象）
  - `validate()` — VM/字符串验证

### 4.2 字符串元素
- [x] `DicomStringElement extends DicomElement`（抽象）
  - 延迟 buffer 创建
  - 多值反斜杠分割
- [x] `DicomMultiStringElement extends DicomStringElement`（抽象）
- [x] 具体实现（每个 VR 一个类）：
  - [x] `DicomApplicationEntity` (AE) — 最长 16 字符，仅 ASCII
  - [x] `DicomAgeString` (AS) — 格式 `nnnW|M|D|Y`
  - [x] `DicomCodeString` (CS) — 最长 16 字符，大写字母 + 数字 + 空格 + `_`
  - [x] `DicomLongString` (LO) — 最长 64 字符，支持编码
  - [x] `DicomShortString` (SH) — 最长 16 字符，支持编码
  - [x] `DicomLongText` (LT) — 最长 10240 字符
  - [x] `DicomShortText` (ST) — 最长 1024 字符
  - [x] `DicomUnlimitedCharacters` (UC) — 无长度限制
  - [x] `DicomUnlimitedText` (UT) — 无长度限制
  - [x] `DicomUniversalResource` (UR) — URI，单值
  - [x] `DicomUniqueIdentifier` (UI) — UID，仅数字 + 点，null 填充

### 4.3 个人名称元素
- [x] `DicomPersonName` (PN) — 分量解析
  - 组成：`familyName^givenName^middleName^prefix^suffix`
  - 三组：Alphabetic/Ideographic/Phonetic（`=` 分隔）

### 4.4 日期时间元素
- [x] `DicomDateElement extends DicomMultiStringElement`（抽象）
- [x] `DicomDate` (DA) — `YYYYMMDD`，支持范围
- [x] `DicomTime` (TM) — `HHMMSS.FFFFFF`
- [x] `DicomDateTime` (DT) — 带时区偏移

### 4.5 数值字符串元素
- [x] `DicomIntegerString` (IS) — 整数字符串，最长 12 字符
- [x] `DicomDecimalString` (DS) — 小数字符串，最长 16 字符

### 4.6 数值二进制元素（DicomValueElement）
- [x] 实现泛型基类 `DicomValueElement<T>` — 基于 DataView 读写
- [x] `DicomAttributeTag` (AT) — 标签对 `(GGGG,EEEE)`，4 字节
- [x] `DicomSignedShort` (SS) — int16，2 字节单位
- [x] `DicomUnsignedShort` (US) — uint16，2 字节单位
- [x] `DicomSignedLong` (SL) — int32，4 字节单位
- [x] `DicomUnsignedLong` (UL) — uint32，4 字节单位
- [x] `DicomSignedVeryLong` (SV) — int64，8 字节单位（BigInt）
- [x] `DicomUnsignedVeryLong` (UV) — uint64，8 字节单位（BigInt）
- [x] `DicomFloatingPointSingle` (FL) — float32，4 字节单位
- [x] `DicomFloatingPointDouble` (FD) — float64，8 字节单位

### 4.7 大型二进制元素
- [x] `DicomOtherByte` (OB) — 任意字节流
- [x] `DicomOtherWord` (OW) — 16-bit 字流（像素数据）
- [x] `DicomOtherLong` (OL) — 32-bit 流
- [x] `DicomOtherDouble` (OD) — 64-bit 浮点流
- [x] `DicomOtherFloat` (OF) — 32-bit 浮点流
- [x] `DicomOtherVeryLong` (OV) — 64-bit 整数流
- [x] `DicomUnknown` (UN) — 未知 VR，保留为原始字节

### 4.8 序列类型
- [x] `DicomSequence extends DicomItem` (SQ)
  - `items: DicomDataset[]`（类型为 `DicomDatasetLike` 接口，实际 DicomDataset 在 Phase 5 实现）
  - 嵌套数据集
- [x] `DicomFragmentSequence extends DicomItem` — 压缩像素数据分片序列

### 4.9 统一测试
- [x] 测试每种 VR 的 get/set/validate（参考 `DicomElementTest.cs`）
- [x] 测试个人名称分量解析（参考 `DicomPersonNameTest.cs`）
- [x] 测试日期时间（参考 `DicomDateTimeTest.cs`）

---

## Phase 5 — DicomDataset

参考源文件：`FO-DICOM.Core/DicomDataset.cs`, `DicomDatasetExtensions.cs`, `DicomDatasetWalker.cs`

### 5.1 DicomDataset 核心
- [x] 实现 `DicomDataset` 类
  - 内部 `_items: Map<number, DicomItem>` (key = uint32 tag)，迭代时按 tag 升序排序
  - `internalTransferSyntax: DicomTransferSyntax`
  - `fallbackEncodings: readonly string[]`
  - `validateItems: boolean`
- [x] 添加元素
  - `add(item: DicomItem)` / `addOrUpdate(item: DicomItem)` — 单项或可迭代集合
  - `addOrUpdateElement(vr, tag, ...values)` — 显式 VR，供 Reader 使用
  - `addOrUpdateValue(tag, ...values)` — 字典自动推断 VR
- [x] 读取元素
  - `getValue<T>` / `tryGetValue<T>` / `getValueOrDefault<T>`
  - `getValues<T>` / `tryGetValues<T>`
  - `getSingleValue<T>` / `getSingleValueOrDefault<T>`
  - `getSequence` / `tryGetSequence`
  - `getString` / `tryGetString`
  - `getDicomItem<T>` / `getValueCount` / `contains`
- [x] 检查/移除
  - `contains(tag)` / `remove(tag)` / `remove(predicate)` / `clear()`
  - `copyTo(destination)`
- [x] 传输语法变更级联到嵌套序列（setter 递归更新所有 DicomSequence 内的子 Dataset）
- [x] `equals()` / `validate()` / `toString()`

### 5.2 DicomDataset 扩展
- [x] `DicomDatasetWalker` — 深度优先遍历器（含嵌套序列和 DicomFragmentSequence）
- [x] `IDicomDatasetWalker` 接口 + `DicomDatasetWalkerBase` 无操作基类
- [x] `IDicomDatasetObserver` 接口 — 供 Phase 7 读取引擎回调构建 Dataset
- [x] `DicomDatasetExtensions` — 常用 helper（getDateTime / enumerateMasked 等，Phase 8+ 按需补充）

### 5.3 测试
- [x] Dataset CRUD 操作（add / addOrUpdate / remove / clear / copyTo）
- [x] 值读取（getValue / getValues / getSingleValue / getString 全系列）
- [x] 所有 VR 元素类型（通过 addOrUpdateElement 验证，含 bigint SV/UV）
- [x] 多值字符串元素（CS / IS / DS / PN 含私有标签）
- [x] 嵌套序列读写
- [x] 传输语法级联（单层 + 两层嵌套）
- [x] Walker 遍历（事件顺序 + 叶节点收集）
- [x] Dataset 比较（equals）
- 共 108 个测试，全部通过

---

## Phase 6 — I/O 缓冲层

参考源文件：`FO-DICOM.Core/IO/Buffer/`, `FO-DICOM.Core/IO/`

### 6.1 字节缓冲接口与实现
- [x] `IByteBuffer` 接口（在 Phase 4 中提前实现，位于 `src/io/buffer/`）
  - `size: number`
  - `data: Uint8Array`
  - `getByteRange(offset, count): Uint8Array`
- [x] `MemoryByteBuffer` — 内存中字节数组（Phase 4 中实现）
- [x] `EmptyBuffer` — 零长度缓冲单例（Phase 4 中实现）
- [x] `LazyByteBuffer` — 延迟计算（回调生成 buffer）（Phase 4 中实现）
- [x] `FileByteBuffer` — 文件偏移范围引用
- [x] `StreamByteBuffer` — 流中的字节范围
- [x] `CompositeByteBuffer` — 多 buffer 拼接
- [x] `RangeByteBuffer` — 已有 buffer 的子范围视图
- [x] `EndianByteBuffer` — 自动字节序交换包装器
- [x] `EvenLengthBuffer` — 奇数长度自动填充 0x00
- [x] `SwapByteBuffer` — 按单元大小交换字节序
- [x] `TempFileBuffer` — 大数据写入临时文件
- [x] `BulkDataUriByteBuffer` — WADO-RS 批量数据 URI 引用

### 6.2 字节源/目标接口
- [x] `IByteSource` 接口 — 顺序读取、标记/回退
  - `read(count): Uint8Array`
  - `mark()` / `rewind()` / `skip(count)`
  - `isEOF: boolean`
- [x] `IByteTarget` 接口 — 顺序写入
  - `write(data: Uint8Array)`
- [x] `StreamByteSource` — 基于 Node.js ReadableStream
- [x] `FileByteSource` / `FileByteTarget` — 文件 I/O
- [x] `StreamByteTarget` / `MemoryByteTarget`

### 6.3 工具类
- [x] `ByteConverter` — DataView 包装，读写各类型
- [x] `Endian` — 小端/大端枚举

### 6.4 测试
- [x] 各 Buffer 实现（参考 `Tests/IO/`）
- [x] 字节序转换测试

---

## Phase 7 — 二进制读写引擎

参考源文件：`FO-DICOM.Core/IO/Reader/`, `FO-DICOM.Core/IO/Writer/`

### 7.1 DicomReader（读取引擎）
- [x] `IDicomReader` 接口
- [x] `IDicomReaderObserver` 接口（观察者回调）
  - `onBeginSequence(source, tag, length)`
  - `onEndSequence()`
  - `onBeginSequenceItem(source, length)`
  - `onEndSequenceItem()`
  - `onBeginTag(source, tag, vr, length)`
  - `onEndTag()`
- [x] `DicomReaderCallbackObserver` — 函数式观察者
- [x] `DicomReaderMultiObserver` — 组合多个观察者
- [x] `DicomReader` 核心实现
  - 魔法字节检测 `DICM` (offset 128)
  - 显式/隐式 VR 切换
  - Little Endian / Big Endian 支持
  - 特殊 VR 处理（OB/OW/SQ/UN/UC/UR/UT 使用 32-bit 长度）
  - 不定长序列/数据项（`0xFFFFFFFF`）+ 分隔符标签
  - Deflate 解压（Group 0002 之后）
  - 停止条件 (`stop: (tag) => boolean`)
  - 异步读取支持
- [x] `DicomFileReader` — 文件级读取（处理 preamble + meta）
- [x] `DicomReaderEventArgs` — 事件参数
- [ ] 测试（参考 `Tests/IO/`，`DicomFileTest.cs`，`Bugs/` 下所有回归测试）

### 7.2 DicomWriter（写入引擎）
- [x] `DicomWriteOptions` — 显式长度 / 无限长序列选项
- [x] `DicomWriteLengthCalculator` — 预计算写入长度
- [x] `DicomWriter` 核心实现
  - 写 preamble + `DICM` 魔法字节
  - Group 0002 meta 信息
  - 显式/隐式 VR 写入
  - 序列 & 分片序列写入
  - 奇数长度填充
- [ ] `DicomFileWriter` — 文件级写入
- [ ] `DicomDatasetExtensions.write()` — Dataset 序列化为流
- [ ] 测试（参考 `Tests/IO/Writer/`）

---

## Phase 8 — DicomFile

参考源文件：`FO-DICOM.Core/DicomFile.cs`, `DicomFileMetaInformation.cs`, `DicomFileExtensions.cs`

### 8.1 DicomFileMetaInformation
- [ ] 实现 `DicomFileMetaInformation extends DicomDataset`
  - Group 0002 标签集合
  - `mediaStorageSOPClassUID`
  - `mediaStorageSOPInstanceUID`
  - `transferSyntaxUID`
  - `implementationClassUID`
  - `implementationVersionName`

### 8.2 DicomFile
- [ ] 实现 `DicomFile` 类
  - `fileMetaInfo: DicomFileMetaInformation`
  - `dataset: DicomDataset`
  - `format: DicomFileFormat` (DICOM3 / ACR_NEMA / IMPLICIT_VR)
  - `isPartial: boolean`
- [ ] 静态工厂方法
  - `DicomFile.open(path: string, options?): Promise<DicomFile>`
  - `DicomFile.open(stream: ReadableStream, options?): Promise<DicomFile>`
  - `DicomFile.openAsync(...)` (别名)
- [ ] 写入方法
  - `save(path: string): Promise<void>`
  - `save(stream: WritableStream): Promise<void>`
- [ ] `DicomFile.hasValidHeader(path): Promise<boolean>`
- [x] `FileReadOption` — 控制大标签的读取策略
  - `ReadAll` — 全量加载
  - `SkipLargeTags` — 跳过大标签（>= 某阈值）
  - `ReadLargeOnDemand` — 延迟加载像素数据
- [ ] 测试（参考 `DicomFileTest.cs`, `DicomFileMetaInformationTest.cs`）

### 8.3 媒体目录（DICOMDIR）
- [ ] `DicomDirectory` — DICOMDIR 读写
- [ ] `DicomDirectoryRecord` — 目录记录条目
- [ ] `DicomDirectoryRecordCollection`
- [ ] `DicomDirectoryRecordType` — 枚举（PATIENT / STUDY / SERIES / IMAGE ...）
- [ ] `DicomDirectoryReaderObserver`
- [ ] `DicomFileScanner` — 扫描目录，识别 DICOM 文件
- [ ] 测试（参考 `Tests/Media/`）

---

## Phase 9 — JSON 序列化

参考源文件：`Serialization/FO-DICOM.Json/JsonDicomConverter.cs`

遵循 DICOM PS3.18 Annex F DICOM JSON Model。

### 9.1 DICOM JSON 格式
- [ ] `DicomJsonConverter` — 主序列化/反序列化类
  - 序列化 `DicomDataset → JSON`
  - 反序列化 `JSON → DicomDataset`
- [ ] 各 VR 的 JSON 映射规则：
  - 字符串 VR → `{ "vr": "LO", "Value": ["..."] }`
  - 数值 VR → `{ "vr": "US", "Value": [123] }`
  - OB/OW 等 → `{ "vr": "OB", "InlineBinary": "<base64>" }` 或 BulkDataURI
  - SQ → `{ "vr": "SQ", "Value": [{ ... }] }`
  - PN → 三组分量对象格式
  - AT → `{ "vr": "AT", "Value": ["GGGGEEEE"] }`
- [ ] 处理 null/空值、未知 VR
- [ ] 单元测试（参考 `Tests/Serialization/JsonDicomConverterTest.cs`）

### 9.2 XML 序列化（可选，P2）
- [ ] DICOM XML 格式（PS3.19 Native DICOM Model）

---

## Phase 10 — 影像处理

参考源文件：`FO-DICOM.Core/Imaging/`（96 个文件）

> 注：部分功能（JPEG/JPEG2000 编解码）在浏览器环境可依赖 Web API 或第三方库。

### 10.1 像素数据基础
- [ ] `DicomPixelData` — 从 Dataset 提取像素数据
  - 支持单帧和多帧
  - 支持压缩（Encapsulated）和非压缩像素数据
  - `bitsAllocated`, `bitsStored`, `highBit`, `pixelRepresentation`
  - `samplesPerPixel`, `planarConfiguration`
  - `getFrame(index): IByteBuffer`
  - `addFrame(buffer: IByteBuffer)`
- [ ] `PhotometricInterpretation` — 色彩空间枚举
  - MONOCHROME1, MONOCHROME2, RGB, YBR_FULL, YBR_FULL_422, PALETTE COLOR 等
- [ ] `PixelRepresentation` — 有/无符号像素
- [ ] `PlanarConfiguration` — 像素数据平面排列（交错/平面）
- [ ] `BitDepth` — 位深度结构

### 10.2 颜色转换
- [ ] `Color32` — RGBA 颜色结构
- [ ] `ColorSpace` — 色彩空间转换
- [ ] `ColorTable` — 调色板颜色查找表
- [ ] `PixelDataConverter` — 格式转换（YBR → RGB 等）

### 10.3 LUT（查找表）系统
- [ ] `ILUT` 接口
- [ ] `ModalityRescaleLUT` — 模态 Rescale（斜率/截距）
- [ ] `ModalitySequenceLUT` — 模态 LUT 序列
- [ ] `VOILUT` — VOI LUT（窗宽/窗位）
- [ ] `VOISequenceLUT` — VOI LUT 序列
- [ ] `PaletteColorLUT` — 调色板颜色 LUT
- [ ] `OutputLUT` — 输出 LUT
- [ ] `PaddingLUT` — 填充值处理
- [ ] `InvertLUT` — 反色 LUT
- [ ] `CompositeLUT` — 多 LUT 级联
- [ ] `PrecalculatedLUT` — 预计算 LUT

### 10.4 渲染管线
- [ ] `IGraphic` 接口
- [ ] `IPipeline` 接口
- [ ] `ImageGraphic` — 基础图像图元
- [ ] `OverlayGraphic` — 叠加层图形
- [ ] `CompositeGraphic` — 组合图形
- [ ] `GenericGrayscalePipeline` — 灰度渲染管线
- [ ] `PaletteColorPipeline` — 调色板颜色管线
- [ ] `RgbColorPipeline` — RGB 渲染管线

### 10.5 编解码器
- [ ] `IDicomCodec` 接口（插件接口，供外部注册编解码器）
- [ ] `IDicomTranscoder` 接口
- [ ] `TranscoderManager` — 编解码器注册/查找（工厂模式）
- [ ] `DicomRleCodec` — RLE 无损压缩（**纯 TypeScript 实现**，参考 `DicomRleCodec.cs`）
- [ ] `DicomJpegLosslessDecoder` — JPEG 无损 Process 14（**纯 TypeScript 移植**，参考 `JpegLossless/` 子目录）
- [ ] JPEG 有损（Process 1/2）— 仅定义接口，**不内置**；用户通过 `TranscoderManager.register()` 注册
- [ ] JPEG2000 / HTJ2K — 仅定义接口，**不内置**；用户按需注册（可对接 WASM 库）
- [ ] `DicomTranscoder` — 在传输语法间转换（使用已注册的编解码器）

### 10.6 叠加层
- [ ] `DicomOverlayData` — 从 Dataset 提取叠加层位图
- [ ] `DicomOverlayDataFactory`

### 10.7 DicomImage（主 API）
- [ ] 实现 `DicomImage` 类
  - 帧级缓存（像素 + 渲染结果）
  - `renderImage(frame?): IImage` — 执行渲染管线
  - 窗宽/窗位（`windowCenter`, `windowWidth`）
  - 缩放（`scale`）
  - 叠加层显示开关
- [ ] `IImage` 接口 — 平台中立的输出图像
- [ ] `RawImage` / `RawImageManager` — Uint8Array 原始像素输出（Node.js 用）

### 10.8 数学工具
- [ ] `Geometry3D` / `GeometryHelper` — 3D 几何运算
- [ ] `Histogram` — 像素直方图
- [ ] `Matrix` — 矩阵运算
- [ ] `Point2`, `Point2D`, `RectF` — 几何基础类型

### 10.9 3D 重建
- [ ] `DicomGenerator` — 生成合成 DICOM 数据
- [ ] `ImageData`, `Slice`, `Stack`, `VolumeData` — 体积数据结构

### 10.10 叠加层与图标图像
- [ ] `DicomIconImage` — DICOM 图标图像处理

### 10.11 测试
- [ ] 渲染管线测试（参考 `Tests/Imaging/`）
- [ ] LUT 测试
- [ ] 编解码器转码测试
- [ ] 像素数据提取测试

---

## Phase 11 — 网络 / DIMSE

参考源文件：`FO-DICOM.Core/Network/`（117 个文件）

### 11.1 PDU（协议数据单元）
- [ ] `RawPDU` — 原始 PDU 读写（`PDU.cs`）
  - Binary reader/writer 包装 (DataView)
  - Mark/rewind for length calculation
  - PDU type 字节头
- [ ] 各 PDU 类型实现（ACSE 协议）：
  - [ ] `AAssociateRQ` — 关联请求
  - [ ] `AAssociateAC` — 关联接受
  - [ ] `AAssociateRJ` — 关联拒绝
  - [ ] `AReleaseRQ` — 释放请求
  - [ ] `AReleaseRP` — 释放响应
  - [ ] `AAbort` — 中止
  - [ ] `PDataTF` — 数据传输

### 11.2 DicomAssociation
- [ ] `DicomAssociation` — 关联上下文
  - 表示上下文列表（`DicomPresentationContext[]`）
  - 扩展协商（`DicomExtendedNegotiation`）
  - 用户身份协商（`DicomUserIdentityNegotiation`）
  - CallingAE / CalledAE
- [ ] `DicomPresentationContext` — 摘要上下文（SOP 类 + 传输语法）
- [ ] `DicomPresentationContextCollection`
- [ ] `DicomExtendedNegotiation` / `DicomExtendedNegotiationCollection`
- [ ] `DicomUserIdentityNegotiation`

### 11.3 DicomMessage / DIMSE 消息
- [ ] `DicomMessage` — Command + Dataset 组合
- [ ] `DicomRequest extends DicomMessage` — 请求基类
- [ ] `DicomResponse extends DicomMessage` — 响应基类
- [ ] `DicomPriorityRequest` — 带优先级请求
- [ ] `DicomCommandField` 枚举

### 11.4 服务类请求/响应
- [ ] **C-ECHO**：`DicomCEchoRequest`, `DicomCEchoResponse`
- [ ] **C-STORE**：`DicomCStoreRequest`, `DicomCStoreResponse`
- [ ] **C-FIND**：`DicomCFindRequest`, `DicomCFindResponse`
- [ ] **C-MOVE**：`DicomCMoveRequest`, `DicomCMoveResponse`
- [ ] **C-GET**：`DicomCGetRequest`, `DicomCGetResponse`
- [ ] **N-CREATE**：`DicomNCreateRequest`, `DicomNCreateResponse`
- [ ] **N-SET**：`DicomNSetRequest`, `DicomNSetResponse`
- [ ] **N-GET**：`DicomNGetRequest`, `DicomNGetResponse`
- [ ] **N-DELETE**：`DicomNDeleteRequest`, `DicomNDeleteResponse`
- [ ] **N-ACTION**：`DicomNActionRequest`, `DicomNActionResponse`
- [ ] **N-EVENT-REPORT**：`DicomNEventReportRequest`, `DicomNEventReportResponse`

### 11.5 DicomStatus
- [ ] `DicomStatus` — 所有标准状态码常量（参考 `DicomStatus.cs`）

### 11.6 服务接口
- [ ] `IDicomCEchoProvider` 接口
- [ ] `IDicomCFindProvider` 接口
- [ ] `IDicomCGetProvider` 接口
- [ ] `IDicomCMoveProvider` 接口
- [ ] `IDicomCStoreProvider` 接口
- [ ] `IDicomNServiceProvider` 接口
- [ ] `IDicomNEventReportRequestProvider` 接口
- [ ] `IDicomServiceProvider` 接口

### 11.7 DicomService（服务基类）
- [ ] 实现 `DicomService` 抽象类
  - PDU 队列管理
  - DIMSE 消息队列
  - 异步 PDU 读写
  - 关联协商处理
  - 服务分发（根据 CommandField 路由到对应 Provider）
  - 超时管理
  - 基于 Node.js `net.Socket` / Web `WebSocket`

### 11.8 DicomServer
- [ ] `IDicomServer` 接口
- [ ] `DicomServer` — TCP 监听器工厂
- [ ] `DicomServerFactory` — 创建带配置的服务端
- [ ] `DicomServerOptions` — 主机/端口/TLS 等配置
- [ ] `DicomCEchoProvider` — 默认 C-ECHO 回声实现

### 11.9 DicomClient
- [ ] `DicomClient` — 主客户端 API
  - `addRequest(request: DicomRequest)`
  - `sendAsync(host, port, callingAE, calledAE): Promise<void>`
- [ ] `DicomClientOptions` — 超时、最大并发等
- [ ] `DicomClientFactory`
- [ ] `DicomClientConnection`
- [ ] 高级客户端 API：
  - [ ] `AdvancedDicomClientAssociation` — 手动控制关联生命周期
  - [ ] `AdvancedDicomClientConnection`
- [ ] `DicomQueryRetrieveLevel` — PATIENT/STUDY/SERIES/IMAGE

### 11.10 TLS 支持
- [ ] `ITlsInitiator` / `ITlsAcceptor` 接口
- [ ] `DefaultTlsInitiator` — 基于 Node.js `tls.connect`
- [ ] `DefaultTlsAcceptor` — 基于 Node.js TLS Server

### 11.11 网络抽象
- [ ] `INetworkStream` 接口
- [ ] `INetworkListener` 接口
- [ ] `NetworkManager` 抽象类（平台注册）
- [ ] `DesktopNetworkManager` — Node.js 实现
- [ ] `NetworkStreamCreationOptions`

### 11.12 测试
- [ ] C-ECHO 回声测试（参考 `Tests/Network/`）
- [ ] C-STORE 存储测试
- [ ] C-FIND 查询测试
- [ ] C-MOVE / C-GET 检索测试
- [ ] 关联协商测试
- [ ] 超时处理测试
- [ ] TLS 测试

---

## Phase 12 — 高级功能

### 12.1 DicomAnonymizer（脱敏/匿名化）
参考：`FO-DICOM.Core/DicomAnonymizer.cs`, `DicomAnonymizerGenerated.cs`

- [ ] `SecurityProfileOptions` Flags 枚举（11 个选项）
- [ ] `DicomAnonymizer` 类
  - 基于 DICOM PS 3.15 保密配置文件
  - 按标签动作：`D`(虚假化) / `Z`(置零) / `X`(删除) / `K`(保留) / `C`(清理) / `U`(UID 替换)
  - UID 替换映射（保持内部一致性）
  - `anonymize(dataset: DicomDataset): DicomDataset`
- [ ] 测试（参考 `DicomAnonymizerTest.cs`）

### 12.2 DicomValidation（验证）
- [ ] `DicomValidation` — VR 格式验证规则
- [ ] `DicomValidationException`
- [ ] 可配置验证级别（警告/错误）

### 12.3 DicomDateRange
- [ ] `DicomDateRange` — 日期范围查询支持
- [ ] 测试（参考 `DicomDateRangeTest.cs`）

### 12.4 DicomMatchRules
- [ ] `DicomMatchRules` — 数据集匹配（C-FIND 使用）
- [ ] `DicomTransformRules`
- [ ] 测试（参考 `DicomMatchRulesTest.cs`）

### 12.5 StructuredReport（结构化报告）
- [ ] `DicomCodeItem` — 代码序列
- [ ] `DicomContentItem` — 内容项（TEXT / NUM / CODE / IMAGE / CONTAINER ...）
- [ ] `DicomMeasuredValue` — 测量值
- [ ] `DicomReferencedSOP` — 引用 SOP
- [ ] `DicomStructuredReport` — 顶层 SR 对象，继承 `DicomContentItem`
  - `open(path)` / `save(path)`
- [ ] 测试（参考 `Tests/StructuredReport/`）

### 12.6 Printing（打印）
- [ ] `FilmSession` — 胶片会话
- [ ] `FilmBox` — 胶片盒
- [ ] `ImageBox` — 图像盒
- [ ] `PresentationLut` — 表示 LUT
- [ ] 测试（参考 `Tests/Printing/`）

### 12.7 日志（已提前实现，位于 `src/logging/`）
- [x] `IDicomLogger` 接口（`LogLevel` 枚举 + `log/debug/info/warn/error/fatal` 方法）
- [x] 内置实现：`ConsoleLogger`（控制台）、`NullLogger`（无操作，默认值）
- [x] `LogManager` — 全局工厂切换（`setFactory` / `getLogger` / `enableConsole` / `disableLogging`）
- [x] `LogCategories` — 日志分类常量（Network / IO / Codec 等）
- [x] 13 个单元测试（`tests/logging/DicomLogger.test.ts`）

### 12.8 DicomImplementation
- [ ] 实现 `DicomImplementation` — 实现类/版本名称常量

---

## 任务状态跟踪

开发时在此处用 `[x]` 标记已完成的任务。

### 当前进度

- Phase 1 — 项目初始化：`✅ 已完成`
- Phase 2 — 核心数据模型：`✅ 已完成`（103 个测试全部通过）
- Phase 3 — 字典与注册表：`✅ 已完成`
- 日志模块（提前实现，源自 Phase 12.7）：`✅ 已完成`（13 个测试）
- Phase 4 — 数据元素类型系统：`✅ 已完成`（全部 VR 元素类、序列类、缓冲层基础）
- Phase 5 — DicomDataset：`✅ 已完成`（108 个测试全部通过）
- Phase 6 — I/O 缓冲层：`✅ 已完成`
- Phase 7 — 二进制读写引擎：`🔶 部分完成`
- Phase 8 — DicomFile：`⬜ 未开始`
- Phase 9 — JSON 序列化：`⬜ 未开始`
- Phase 10 — 影像处理：`⬜ 未开始`
- Phase 11 — 网络/DIMSE：`⬜ 未开始`
- Phase 12 — 高级功能：`⬜ 未开始`（日志子项已完成）

---

## 设计调整说明

以下列出相对于原始计划所做的设计变更：

### 1. 日志模块提前实现（Phase 12.7 → 独立模块）
fo-dicom 的 `Microsoft.Extensions.Logging` 适配已在 fo-dicom v5 中标记为 `[Obsolete]`。TypeScript 项目中无对应框架，因此独立设计为：
- `IDicomLogger` 接口（无框架绑定）
- 内置 `NullLogger`（默认静默）和 `ConsoleLogger`
- `LogManager` 工厂（支持运行时切换，不依赖 DI 容器）
- 在 Phase 4 开发前提前实现，以便后续读写引擎使用

### 2. I/O 缓冲层基础（Phase 6.1 → 提前在 Phase 4 内实现）
`DicomStringElement` 的延迟编码和 `DicomValueElement` 的二进制存储依赖 `IByteBuffer`，因此将以下类型提前在 Phase 4 内实现：
- `IByteBuffer` 接口（`src/io/buffer/IByteBuffer.ts`）
- `MemoryByteBuffer`、`EmptyBuffer`、`LazyByteBuffer`

Phase 6 已补齐：缓冲层全面测试与字节序转换测试。

### 3. DicomElement 构造器模式调整（fo-dicom 重载 → 静态工厂）
fo-dicom 使用 C# 构造函数重载区分"从值构造"和"从缓冲区构造"两种情况。TypeScript 的 `super()` 规则要求在有字段初始化器的类中，`super()` 必须是根级语句（不能在 `if/else` 分支中）。

解决方案：
- 引入 `BufSrc` 判别联合类型（`{ _tag: symbol, buffer, encodings }`）统一 `super()` 调用
- 具体类暴露面向用户的普通构造器 `constructor(tag, ...values)`
- 额外提供静态工厂方法 `static fromBuffer(tag, buffer, encodings?)`，供 Reader 使用，替代 fo-dicom 的第二个构造函数重载

### 4. `_fromBufVal` 泛型签名调整
原设计 `_fromBufVal<T extends number|bigint>(ctor: ValCtor<T>, ...): DicomValueElement<T>` 导致 TypeScript 无法将返回值收窄到具体类型（如 `DicomFloatingPointDouble`）。

修改为 `_fromBufVal<C extends DicomValueElement<any>>(ctor: ValCtor<C>, ...): C`，让 TypeScript 直接从构造器推断具体类型，消除所有 TS2322 错误。

### 5. DicomSequence 的 items 类型
Phase 4 实现时 `DicomDataset` 尚未完成，使用 `DicomDatasetLike` 接口占位（duck typing）。Phase 5 完成后将替换为具体的 `DicomDataset`。

---

## 关键参考文件速查

| 功能 | fo-dicom 参考文件 |
|------|-----------------|
| DicomTag | `FO-DICOM.Core/DicomTag.cs` |
| DicomVR | `FO-DICOM.Core/DicomVR.cs` |
| DicomVM | `FO-DICOM.Core/DicomVM.cs` |
| DicomUID | `FO-DICOM.Core/DicomUID.cs`, `DicomUID.Generated.cs` |
| DicomTransferSyntax | `FO-DICOM.Core/DicomTransferSyntax.cs` |
| DicomEncoding | `FO-DICOM.Core/DicomEncoding.cs` |
| DicomDictionary | `FO-DICOM.Core/DicomDictionary.cs`, `Dictionaries/` |
| 全部 VR 元素类 | `FO-DICOM.Core/DicomElement.cs` |
| DicomDataset | `FO-DICOM.Core/DicomDataset.cs`, `DicomDatasetExtensions.cs` |
| DicomSequence | `FO-DICOM.Core/DicomSequence.cs`, `DicomFragmentSequence.cs` |
| I/O 缓冲 | `FO-DICOM.Core/IO/Buffer/` |
| 读取引擎 | `FO-DICOM.Core/IO/Reader/DicomReader.cs` |
| 写入引擎 | `FO-DICOM.Core/IO/Writer/DicomWriter.cs` |
| DicomFile | `FO-DICOM.Core/DicomFile.cs` |
| DicomFileMetaInfo | `FO-DICOM.Core/DicomFileMetaInformation.cs` |
| 媒体目录 | `FO-DICOM.Core/Media/` |
| JSON 序列化 | `Serialization/FO-DICOM.Json/JsonDicomConverter.cs` |
| 像素数据 | `FO-DICOM.Core/Imaging/DicomPixelData.cs` |
| LUT 系统 | `FO-DICOM.Core/Imaging/LUT/` |
| 渲染管线 | `FO-DICOM.Core/Imaging/Render/` |
| 编解码器 | `FO-DICOM.Core/Imaging/Codec/` |
| DicomImage | `FO-DICOM.Core/Imaging/DicomImage.cs` |
| PDU 协议 | `FO-DICOM.Core/Network/PDU.cs` |
| 网络服务基类 | `FO-DICOM.Core/Network/DicomService.cs` |
| 各 DIMSE 消息 | `FO-DICOM.Core/Network/DicomC*.cs`, `DicomN*.cs` |
| 客户端 | `FO-DICOM.Core/Network/Client/DicomClient.cs` |
| 服务端 | `FO-DICOM.Core/Network/DicomServer.cs` |
| 匿名化 | `FO-DICOM.Core/DicomAnonymizer.cs` |
| 结构化报告 | `FO-DICOM.Core/StructuredReport/` |
| 标准标签常量 | `FO-DICOM.Core/DicomTag.Generated.cs` |
| 标准 UID 常量 | `FO-DICOM.Core/DicomUID.Generated.cs` |
| 回归测试 | `Tests/FO-DICOM.Tests/Bugs/GH*.cs` |
