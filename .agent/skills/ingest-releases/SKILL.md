---
name: ingest-releases
description: evals 仓的模型发布增量入库流程：自动发现自上个时间结点（上次扫描检查点/账本最新发布日）以来新发布的主流模型，抓取官方发布文归档到 models/，按既有账本模板写入 data/model-releases/official/，自动更新模型发布时间轴与评估大全引用排行，过三道校验门禁后提交推送。只要用户提到"增量捞取/扫描/入库新模型、更新模型发布、时间轴更新、评估排行更新、补最新模型、跑一次入库"，都应使用本技能——即使用户没有说出"入库"两个字。
---

# 模型发布增量入库（ingest-releases）

## 你在做什么，为什么这样做

这个站点的每一处展示——时间轴结点、评测详情页的"厂商采用记录"、引用排行、卡片计数——全部是构建时从**证据账本**（`data/model-releases/` + `data/benchmarks/`）现算的派生视图。所以本技能只做一件事：**把新发布的官方评测证据写进账本**，然后让构建与门禁保证站点正确。不要手动改任何 HTML/构建产物。

账本纪律（记录模式冻结、只追加、勘误走 `revisions[]`）与抽取口径（分数怎么分级、图表行为何必须 pending）的唯一所有者是
`data/model-releases/official/README.md` 的「账本契约」「抽取口径」两节——**动手前先读这两节**，本技能不复制其内容。

**dry-run 模式**：用户说"先看看有什么新的/别写文件/dry-run"时，只执行第 0、1 步并输出候选清单，不写任何文件。

## Step 0 · 前置与增量窗口

1. `git status` 必须干净——入库是纯增量操作，脏工作区会污染"本批新增"的边界。不干净先停下向用户说明。
2. 计算扫描窗口：

```bash
node .claude/skills/ingest-releases/scripts/checkpoint.mjs status
```

输出里的 `window_since → window_until` 就是本次发现窗口（锚点回退 14 天重叠，防止发布文事后补印日期或搜索索引滞后）。

## Step 1 · 发现增量发布

对 `data/vendors.json` 中每家在册厂商（tier 1 必扫、tier 2 低频扫），按 `references/discovery-channels.md`
的渠道表检索窗口内的新模型发布。要求：

- 每条候选记录：厂商、模型名、**官方发布文 URL**、发布日期及其证据（publishedTime / 页面印刷日 / RSS / slug+HF 互证）。
- 渠道表里的旁证手段（OpenRouter created、HF createdAt）只用来**查漏**与佐证日期，不单独作为证据。
- 找不到官方一级来源的传闻/聚合站跑分 → 不入账，记入报告的「跳过清单」（先例：GLM-4）。
- 边界判定：纯权重更新、纯 API 定价调整、垂直非通用模型（翻译/语音/图像）通常不建 release 档；拿不准时列入候选并在报告里说明取舍。

dry-run 到此为止：输出候选清单后结束。

## Step 2 · 逐发布建档

对每个候选，**先归档、后写账本**（`models/` 是一切转写与复核的依据）：

1. **抓取原文**，按降级链：web reader → 备用 reader → 无头浏览器渲染后直读 DOM。
   渠道表已标明各家脾气；"正文有 Evaluations 章节却看不到分数"时先怀疑渲染漏了表格/图片，不要判定为无数据。
2. **归档**到 `models/YYYY-MM-DD-<model-slug>/`（page.html + images/ + index.md 转录表 + manifest.json），
   结构与 frontmatter 见 `references/release-schema.md` §2。
3. **写 release JSON** `data/model-releases/official/<vendor_id>/<release-id>.json`：
   逐字段模板、edge id 双连字符约定、protocol 12 键全列见 `references/release-schema.md` §1。
   **models[] 必须带全规格与概述字段**（params / context_window / pricing / modalities / capability_summary / key_traits）——
   时间轴卡片直接渲染它们；capability_summary 按 schema 文档的撰写口径结合评估数据写成读者能懂的一两句。
   **Release 顶层 5 大强校验门禁字段**必须全齐：`retrieved_at`、`last_verified_at`、`status`、`notes`、`revisions: []`。
   关键纪律（README 口径的执行摘要）：
   - 一个 benchmark 行 = 一条 evidence，取**自家模型列**；竞品列进该行 notes。
   - 散文/DOM 表明文 → `verified`；图表图片行 → `pending` + 视觉转写只进 notes（OCR 不翻 verified）；
     正文点名但无数值 → verified + `score_status:"not_extracted"`。
   - 缺失一律 `null` + score_status，全库禁止 `"-"` 占位（校验器强制）。
   - **Agentic Harness 与协议隔离**：自报高分若使用了自定义 Agentic 脚手架（如 retained reasoning、compaction、测试期纠错循环），必须在 `protocol.harness` 和 `protocol.tools` 明示，在 `notes` 交代与官方标准单轮基线的差距，并标 `comparison_scope:"only_same_protocol"`，严禁混淆。
   - 协议字段只记页面明示值，未写即 null；部署建议不是评测协议。
   - 同一 benchmark 不同条件/版本 → 拆 variant 行；跨页冲突不调和，各自记行 + notes 标注。
4. **benchmark id 三步判定**（既有实体 → 别名表归并 → 新铸 id 标 `new-benchmark`）见 `references/release-schema.md`；
   能整理出完整定义时同步建 benchmark 实体，`interpretation` 必须写成读者能懂的分数解读（构建门禁拦截占位文案）。
5. **发现未注册厂商** → 按 `references/discovery-channels.md` 末节接入（注册 + 真实彩色 logo + LOGO_EXT 登记）。

## Step 3 · 门禁（顺序执行，全绿才继续）

```bash
node scripts/validate-data.mjs    # 数据层：外键、枚举、edge id、对账不变量
npm run build                     # 书校验 + EPUB + 全站构建 + validate-site（含占位文案与死链）
```

> **环境提示**：在 Windows PowerShell 下调试执行脚本时，避免在命令行直接拼接含反引号或复杂 JSON 的命令，建议写入临时 `.mjs` 或通过参数文件运行；系统维护时严禁使用广谱杀进程命令。

然后本地起服务（如 `npx serve dist` 或既有预览方式）抽查：

- `/releases/` 时间轴出现新结点，徽章为**真实厂商彩色 logo**且居中于脊线；
- 新结点的评测 chip 可点击且落在正确详情页；详情页"厂商采用记录"出现新行；
- 全程无"已核验/待核验/待补"类内部术语暴露（用户红线，validate-site 已拦截大半，仍需人眼确认图例与 meta 行）。

## Step 4 · 收口

1. 记录扫描检查点（锚点 = 本批实际入库的最大官方发布日期，不是今天）：

```bash
node .claude/skills/ingest-releases/scripts/checkpoint.mjs commit --max-release-date <本批最大发布日>
```

2. 若更新或优化了 `.claude/skills/` 下的技能定义或脚本，执行：

```bash
npm run sync:skills               # 自动单向同步镜像至 .agent/skills/
```

3. 在 `data/model-releases/official/README.md` **末尾追加**本批报告节（只追加，不改既有批次内容；格式沿用既有批次）。
4. 提交并推送：commit message 沿用仓内风格（中文、`feat:`/`fix:` 前缀、一行说清本批增量），push 到 main，等 CI 绿。
5. 向用户交付报告。

## 交付报告模板

```
## 增量入库报告（window_since ~ today）
- 新增 release：N 个（逐条：vendor / 模型 / 发布日与证据 / evidence 条数 v✓ p⏳）
- 新增 evidence：X 条 = Y verified + Z pending
- 新 benchmark id：a、b、c（new-benchmark，兜底页已生成）/ 新建实体：…
- 新厂商：无 / <id>（已注册 + logo）
- 跳过清单：模型 — 原因（无一级来源 / 非通用模型 / 纯权重更新）
- 待人工核验：图表行清单（视觉转写值已在 notes，读图确认后翻 verified）
- 门禁：validate-data ✓ / build+validate-site ✓ / CI <链接或状态>
```

## 红线（违反任何一条 = 本批无效）

1. 不臆造任何数值：读不到就是 null + 状态标注，宁可留 pending。
2. 无官方一级来源不建档。
3. 只追加：不改既有 release/benchmark 文件（勘误走 `revisions[]`）；`legacy/` 目录冻结。
4. 图表图片行永不自动翻 verified。
5. 厂商图标必须真实彩色 logo，禁止字母占位。
6. 公开文案不出现内部流程词（已核验/待核验/证据账本/窗口起点等），一律读者语言。
