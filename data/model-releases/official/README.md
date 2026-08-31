# Official Model Release Evidence — P0-EVID-002 种子数据

本目录存放按 `_docs/goal.md` §11.4（Model Release Schema）与 §11.5（Evidence Edge Schema）抽取的官方模型发布 benchmark 证据。来源等级 A（厂商官方发布页），检索/核验日期统一为 **2026-08-31**。

## 汇总

| 指标 | 值 |
|---|---:|
| Release 文件 | 7 |
| benchmark_evidence 总条数 | 106 |
| status=verified | 72 |
| status=pending | 34 |

公开计数规则（goal.md §12.2/§12.3）：只有 `status=verified` 且 `source_tier=A` 且 `attribution_type=vendor_reported` 的条目可计入"官方发布引用数"。第三方转述行（`third_party_reported`）与竞品引用行（`comparison_cited`）不计入自报。

## 逐 Release 清单

| 文件 | 来源 URL | 条数 | verified | pending | 抓取路径 |
|---|---|---:|---:|---:|---|
| `kimi/kimi-k3.json` | kimi.ai/blog/kimi-k3 | 25 | 2 | 23 | 文本抓取成功（web reader + 无头浏览器双路径一致）；**"Full Benchmark Table" 区块无 DOM 表格，分数全部渲染为图片** → 表格行记 pending；脚注中两个明文分数（DeepSWE 67.3、BrowseComp 90.4）verified |
| `deepseek/deepseek-v4-flash-vision-exp.json` | api-docs.deepseek.com/zh-cn/news/news260821 | 11 | 0 | 11 | 文本抓取成功；**全部分数在单张图表图片内**（v4_260821_benchmark_cn.png）→ 全部 pending；图片已做视觉辅助转写，OCR 数值只写入 notes，未经人工确认不得转 verified |
| `glm/glm-5-3.json` | z.ai/blog/glm-5.3 | 22 | 22 | 0 | 文本抓取成功，完整 Markdown 表格 + 全部协议脚注逐行核验 |
| `glm/glm-5-3-flash.json` | z.ai/blog/glm-5.3-flash | 16 | 16 | 0 | 两个文本 reader 均失败 → **降级用无头浏览器读 DOM 成功**，完整表格 + 脚注逐行核验 |
| `openai/gpt-5-6.json` | openai.com/index/gpt-5-6/ | 14 | 14 | 0 | WebFetch 工具报错（API 400）→ 降级 web reader 抓取成功；分数在正文散文与图表区，散文数字逐条核验 |
| `anthropic/claude-opus-5.json` | anthropic.com/news/claude-opus-5 | 8 | 8 | 0 | web reader + 无头浏览器双路径成功；**该页几乎所有数值都在图表图片中**，正文只给相对性结论 → 行记 verified（论断可定位）但 `score_status: not_reported / not_extracted`，绝对分数待人工读图 |
| `xai/grok-4-6.json` | x.ai/news/grok-4-6 | 10 | 10 | 0 | 文本抓取成功，DOM 含完整数值表，逐行核验 |

### 抓取失败与降级路径记录

1. `WebFetch` 工具在本环境对所有 URL 返回 `API Error: 400 [1214][modelCode: does not exist]` — 全部改用 web-reader / 无头浏览器。
2. `z.ai/blog/glm-5.3-flash`：web-reader 与备用 reader 均返回 fetch failed → 无头浏览器（Playwright）直读 DOM，拿到完整表格与脚注。页面可读、与 GLM-5.3 关系已确认（独立模型、独立 HF repo `zai-org/GLM-5.3-Flash`、独立 docs 页），故 status=verified，**未与 glm-5-3 合并**。
3. `openai.com` 未触发反爬，直接抓取成功；`anthropic.com` 同。
4. Kimi K3 与 DeepSeek 的图片表格：按 goal.md §12.5，OCR/视觉辅助不能作为唯一证据 → 行保持 pending，图片定位写入 `locator.figure`，OCR 读数只进 `notes`。

## 抽取口径（后续 Agent 必须沿用）

- **一个 benchmark 行 = 一条 evidence**，取 release 自家模型列；同一表格行中的竞品列写进该行 `notes`，不拆成独立行。
- 竞品分数的**独立明文引用**（散文中直接印出对方分数）→ 单独一条 `attribution_type: comparison_cited`（GLM-5.3 ×5、GPT-5.6 ×3、Kimi BrowseComp ×4）。
- 厂商注明"该行由第三方评测/榜单提供"（AA 系列、DeepSWE 榜单值）→ `third_party_reported` 或 `benchmark_owner_reported`，**不算厂商自报**。
- 分数缺失一律 `null` + `score_status`；全库无 `"-"` 占位（校验脚本已断言）。
- 协议字段只记页面明示值，未写即 `null`（典型已捕获：GLM-5.3 Terminal-Bench 2.1 = Claude Code 2.1.207 / temp 1.0 / top_p 1.0 / max_new_tokens 65536 / 6h timeout；DeepSeek 文本 Agent = DeepSeek Harness 极简模式 / effort max / temp 1.0 / top_p 0.95；Kimi K3 全局 = effort max / temp 1.0 / top-p 1.0，harness 按 benchmark 取 Kimi Code / Claude Code / Codex）。
- release 日期页面上没有明文的，用 `YYYY-MM` + `date_precision: month`（kimi-k3、glm-5-3）；slug/元数据可推断到日的用 `day`（deepseek 由 `news260821` slug、其余来自页面时间戳）。

## Benchmark ID 映射

映射到 `data/benchmarks.json` 现有 id：`terminalbench`、`swebench`（本轮未出现）、`osworld`、`arc-agi`、`mmmu`（MMMU-Pro 记 variant）、`hlehle`（HLE w/ Tools 记 variant）。

新引入 kebab-case id（`notes` 均标 `new-benchmark`，待迁移进 benchmark 主数据）：
`deepswe`、`program-bench`、`swe-marathon`、`frontierswe`、`posttrain-bench`、`mls-bench-lite`、`kcb`、`zai-code-bench`、`officeqa-pro`、`spreadsheetbench`、`mcp-atlas`、`automationbench`、`browsecomp`、`gdpval-aa`、`aa-briefcase`、`apex-agents`、`apex-swe`、`frontier-code`、`frontier-bench`、`cursor-bench`、`zerobench`、`perception-bench`、`nl2repo`、`cybergym`、`exploitgym`、`exploitbench`、`toolathlon`、`agents-last-exam`、`sec-bench-pro`、`dsbench-hard`、`apexbench`、`chartography`、`charxiv-reasoning`、`babyvision`、`mvbench`、`mmvu`、`aa-intelligence-index`、`aa-coding-agent-index`、`harvey-lab`、`oss-fuzz`、`anthropic-behavioral-audit`、`anthropic-life-sciences-internal`。

## 待人工核验清单（pending 升级路径）

1. Kimi K3 图片表格：人工读图确认 23 行数值（其中 4 行 browsecomp 竞品列需回溯 Anthropic/OpenAI 原页）。
2. DeepSeek 图表：人工确认 11 行 OCR 数值。
3. Anthropic Opus 5 图表：人工读图补绝对分数（hero 图、OSS-Fuzz 左右两图）。
4. GPT-5.6 companion 页 `openai.com/index/previewing-gpt-5-6-sol/`（Kimi 脚注引用其 Terminal-Bench 2.1 / DeepSWE 数值）待抓取补全。
5. 跨厂商冲突未解决项：DeepSWE Kimi K3 列 GLM 记 67.5 / Kimi 脚注自记 67.3；各厂商 SWE-Marathon 使用不同分支（GLM 官方 v1.1 vs Kimi H20 重校准），比较时必须按 variant 区分。

## 本轮未覆盖（goal.md §25.2 种子中剩余）

Claude Opus 4.6、Gemini 3 / 3 Deep Think、Mistral Devstral 2 / Mistral 3、Kimi K2 Thinking、MiniMax、Qwen3 / Qwen3-Coder、ByteDance Seed2.1 / Seed1.8 — 均留待下一批抽取，本目录结构已可作为录入 fixture。

---

## 账本契约（增量更新规则）

记录模式（本目录 JSON 的 schema）冻结不变；更新只发生在时间维度上：

1. **新增发布** = 新增一个 `<vendor>/<release-id>.json`，不修改任何既有文件。
2. **核验完成** = 只翻转对应 evidence 的 `status`（pending → verified）并补齐 `locator` / `reported_score`。
3. **勘误** = 修订字段值的同时，在该 release 顶层 `revisions[]` 追加 `{ date, field, from, to, reason }`；`validate:data` 校验其完整性，禁止静默覆盖。

所有视图（时间轴、详情页采用表、引用计数）由 `scripts/load-data.mjs` 构建时现算；
公开计数只统计「状态 verified ∧ 发布日期在近三年窗口内」的 evidence（窗口见 loader 的 `FRESH_WINDOW_YEARS`）。

---

## 第二批（2026-08-31 补充）：国际缺口厂商 — Google / Mistral / Meta

> 注：上方「汇总」表与「本轮未覆盖」清单写于第一批时点，本批新增 5 个 release 后全局数字已变化（现共 12 个 release / 132 条 evidence）；「本轮未覆盖」中列出的 Gemini 3、Gemini 3 Deep Think、Mistral Devstral 2、Mistral 3 已由本批覆盖。原内容按账本契约保留不改。

| 指标 | 本批值 |
|---|---:|
| 新增 release 文件 | 5 |
| benchmark_evidence 条数 | 26 |
| 行 status=verified | 26 |
| 行 status=pending | 0 |
| release status=verified | 4 |
| release status=pending | 1（meta） |
| verified ∧ vendor_reported（可计入官方发布引用数） | 25 |

其余 1 条为 `third_party_reported`（Mistral 3 的 LMArena 榜单排名转述，Elo 未印）；Gemini 3 页散文未印竞品分数，本批 0 条 `comparison_cited`。

### 逐 Release 清单

| 文件 | 来源 URL | 条数 | verified | pending | release status | 抓取路径 |
|---|---|---:|---:|---:|---|---|
| `google/gemini-3.json` | blog.google/…/gemini-3/ | 14 | 14 | 0 | verified | WebFetch 全环境报错（API 400）→ web reader 成功；发布日 2025-11-18（页面 publishedTime）；散文数字逐条核验 |
| `google/gemini-3-deep-think.json` | blog.google/…/gemini-3-deep-think/ | 2 | 2 | 0 | verified | web reader 成功；发布日 2025-12-04（页面 publishedTime）；短文无表格，2 个散文分数 |
| `mistral/mistral-3.json` | mistral.ai/news/mistral-3/ | 2 | 2 | 0 | verified | web reader 成功；页面无时间戳 → 发布日 2025-12-02 取自官方 RSS pubDate |
| `mistral/devstral-2.json` | mistral.ai/news/devstral-2-vibe-cli/ | 3 | 3 | 0 | verified | web reader 成功；同上，发布日 2025-12-09 取自官方 RSS pubDate |
| `meta/muse-spark-1-1.json` | ai.meta.com/blog/introducing-muse-spark-meta-model-api/ + /static-resource/muse-spark-1-1-evaluation-report/ | 5 | 5 | 0 | **pending** | blog + 官方 Evaluation Report 均抓取成功；发布日 2026-07-09 取自 blog 索引列表 |

### Meta release 为何记 pending（覆盖缺口说明）

- **官方 blog 无 benchmark 表**：`Evaluations` 区全部为图表图片（agent/computer-use/coding 推理时算力曲线 + Meta Internal Coding Bench 图），散文零个可机读分数 → 按 §12.2 不建行、不臆测数值。
- 5 条 verified 行来自官方伴生 **Muse Spark 1.1 Evaluation Report**（tier A 厂商署名技术报告）中可散文定位的论断：SWE-bench Verified Hard 24/42 unique tasks（resolved at least once，**是任务数不是百分比**）+ Terminal-Bench 2.1 / SWE-bench Pro / DeepSWE / DeepSearchQA 四条仅有相对结论（`not_reported`）。
- 报告的 scorecard 表（Table 1/2、Cybench Table 3-5、HLE calibration Table 11、SHADE-Arena/GDM 表）被 PDF 文本抽取打乱（列值粘连），按 §12.5「OCR/视觉辅助不能作为唯一证据」**未转录为行** → 待人工读图后补行并翻转 release status。
- 升级路径：人工读报告 PDF 表 + blog 图表 → 补行/补分数 → release status 翻 verified。

### 本批关键协议字段捕获（协议明示才记录，其余 null）

- Gemini 3：HLE 两行均为 **无工具**（`protocol.tools: []`，可比性关键字段）；Deep Think ARC-AGI-2 为 **code execution + ARC Prize Verified**；WebDev/LMArena 为 Elo 榜单快照（`aggregation: leaderboard`）。
- Devstral 2：human win-rate 行捕获 **harness = Cline + judge = 独立标注机构人类评估**；42.8% 胜 / 28.6% 负均为 Devstral 2 自身对 DeepSeek V3.2 的比率（非对方分数，不拆 comparison_cited）。页面建议 temp 0.2 绑定的是 Vibe CLI 部署实践而非评测协议 → `temperature: null`。
- Mistral 3：AIME '25 85% 明示 **14B reasoning variant**；LMArena 排名行为第三方榜单转述（`third_party_reported`，Elo 值未印）。
- Muse Spark 1.1：SWE-bench Verified Hard 行捕获 **聚合方式 = at least once 跨多次运行 + run count 未明示**；报告脚注明示沿用 Safety & Preparedness Report 的 scaffold 与算力预算（细节未随行复制）。

### 本批新增 benchmark id（notes 均标 `new-benchmark`，待迁入主数据）

`matharena-apex`、`video-mmmu`、`webdev-arena`、`vending-bench-2`、`aime-25`（AIME 2025 届，与既有 `aime24` 分立）、`devstral-2-human-winrate`、`swebench-pro`、`deepsearchqa`；复用第一批已引入仍未迁主数据的 `deepswe`。

### 本批遗留 / 观察（不改动既有文件，仅报告）

1. 本批校验脚本对全目录扫描发现**第一批既有行**存在两类与 §11.6 措辞不一致处：约 20 条 `new-benchmark` 标注写在 release 级 notes 或未写（anthropic/deepseek/glm/kimi/openai/xai 各有），以及竞品 `comparison_cited` 行的 `model_id`（如 `gpt-5-5`、`claude-fable-5`）不在本 release `models` 列表 —— 属第一批既定口径，按账本契约「不修改既有文件」未动，留给主线裁定是否批量补标。
2. Gemini 3 页的 evaluation 表格为 GIF 图片，竞品列未机读；Deep Think 另有 "evaluation methodology" 独立页未抓取，为潜在补充来源。
3. Mistral 3 页的 GPQA Diamond 图（Ministral）为图片，Ministral 系列的 GPQA 数值待人工读图。
