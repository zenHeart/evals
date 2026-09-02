# Official Model Release Evidence — P0-EVID-002 种子数据

本目录存放按 `_docs/goal.md` §11.4（Model Release Schema）与 §11.5（Evidence Edge Schema）抽取的官方模型发布 benchmark 证据。来源等级 A（厂商官方发布页），检索/核验日期统一为 **2026-08-31**。

## 汇总

> **当前总量检查点（2026-09-01）**：92 releases = 76 official + 16 legacy · 1356 evidence edges · 819 verified。每批落地后更新此行。

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

> DOM 表机读行（heading+row 可定位）可免 quote_snippet；图片/图表行必须 pending。

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

---

## 2026-08-31 第二批：国内厂商缺口覆盖（qwen / minimax / doubao）

goal.md §12.6 Tier 1 国内缺口厂商补齐：Alibaba/Qwen 两条、MiniMax 一条、ByteDance Seed 两条（vendor_id 归 `doubao`，与 data/vendors.json 一致）。本节只追加，不改动上方第一批/国际批内容。

| 文件 | 来源 URL | 条数 | verified | pending | 抓取路径 |
|---|---|---:|---:|---:|---|
| `qwen/qwen3.json` | qwenlm.github.io/blog/qwen3/ | 18 | 0 | 18 | web reader 一次成功（正文无表格）；**两张分数图（qwen3-235a22.jpg / qwen3-30a3.jpg）内含全部数值与脚注** → 全部 pending，视觉转写只进 notes；图内脚注（AIME 64 次采样 / Aider 非 thinking / BFCL FC 格式）为视觉读出 |
| `qwen/qwen3-coder.json` | qwenlm.github.io/blog/qwen3-coder/ | 15 | 0 | 15 | web reader 成功；主分数图 qwen3-coder-main.jpg（Agentic Coding / Browser Use / Tool Use 三组 15 行）全为图片 → 全部 pending；无任何协议明示，protocol 全 null；散文 SOTA 论断并入 swebench 行 notes |
| `minimax/minimax-m3.json` | minimax.io/blog/minimax-m3 | 35 | 10 | 25 | web reader 成功但漏一图 → **无头浏览器（Playwright）DOM 扫描发现 Evaluation Methodology 前的 2584×3766 结果大表**；5 条散文分数（SWE-Bench Pro 59.0 / TB 2.1 66.0 / SWE-fficiency 34.8 / KernelBench Hard 28.8 / MCP Atlas 74.2）+ OSWorld-Verified 70.06 与 Video-MME 84.6@512f（methodology 散文）+ PostTrainBench 0.37（散文，竞品 0.42/0.39 拆 comparison_cited）共 10 条 verified；其余 25 条表格行 pending；**该页附 30 条 Evaluation Methodology 协议逐条捕获** |
| `doubao/seed-2-1.json` | seed.bytedance.com/en/blog/seed2-1-officially-released-advancing-ai-productivity | 59 | 27 | 32 | web reader 成功（正文仅论断无分数）；13 张分数图全部视觉转写 → 图内数值只进 notes；**正文点名 + 有明确论断的 benchmark 行记 verified + not_extracted**（Anthropic Opus 5 先例口径）；Code Arena: Frontend 行散文含明文 rank 8 / 1539 → verified + reported，attribution = benchmark_owner_reported（第三方榜单） |
| `doubao/seed-1-8.json` | seed.bytedance.com/en/blog/official-release-of-seed1-8-a-generalized-agentic-model | 75 | 7 | 68 | web reader 成功；**散文 5 个明文分数 verified + reported**（BrowseComp-en 67.6 / WorldTravel 多模态 47.2 best-of-5 / ZeroBench main 11.0 / VLMsAreBiased 62.0 / VideoMME 87.8 含字幕且启用 VideoCut 工具）+ FinSearchComp、XpertBench 两条散文点名行 verified + not_extracted；其余 11 张图全部 pending |

**本批小计：202 条 = 44 verified + 158 pending。** 目录截至本批完成：17 个 release 文件 / 334 条（142 verified + 192 pending），含并行国际批（google/meta/mistral）。

### 本批抓取与降级路径记录

1. 两个 qwenlm.github.io 页与 seed.bytedance.com 两个英文页：web reader 一次成功；MiniMax M3 页 web reader 内容完整但**漏掉一张关键大表图片**，由 Playwright DOM 扫描（`document.querySelectorAll('img')` + 尺寸过滤）找回 —— 后续遇到"有 Evaluation Methodology 却无对应分数"的页面应先怀疑漏图。
2. 视觉辅助（MiniMax understand_image）用于：Qwen3 ×2 图、Qwen3-Coder ×2 图、M3 大表 + hero 图 + 定价图、Seed 2.1 ×12 图、Seed 1.8 ×12 图。所有 OCR 数值仅写入 notes，未翻转任何行为 verified（goal.md §12.5）。
3. 交叉验证：M3 的 5 条散文分数与大表视觉读数一致；Seed 1.8 的 5 条散文分数与对应图读数一致；Seed 2.1 GDPVal / MobileWorld "最高分"论断与图读数一致。
4. Seed 1.8 页面不印日期 → `release_date: 2025-12` + `date_precision: month`，依据第三方聚合站（theresanaiforthat.com，2025-12-18）且与 Seed 2.0（2026-02-14）时序一致，来源等级 D 仅作日期线索，已在 release notes 声明。

### 本批关键协议字段捕获（协议明示才记录，其余 null）

- MiniMax M3（Evaluation Methodology 逐条）：SWE-bench Verified = Claude Code scaffold / 4 次取均值；Terminal-Bench 2.1 = Terminus 2 / 8C16G / 2h / max output 128K；NL2Repo = 1C2G / 4h / 防 hack 约束（禁 git clone、Bash 监控拦截）；OSWorld-Verified = 相对坐标 0–1000 / 1920×1080 / max steps 200（100→200：68.70→70.06）；VideoMMMU/Video-MME = 1 FPS / LLM-as-a-Judge / M3 temp 1.0 top_p 0.95（外部模型 0.7，非同配置）；IMO 2025 & USAMO 2026 = MathArena 对齐 / 双裁判取 min / TTS ≤10 迭代；BrowseComp = WebExplorer 框架 / 超 64K 弃史；YC-Bench metric = final assets (fund)，单位记 `usd_fund` 非百分比。
- Qwen3（图内脚注，视觉读出）：AIME 24/25 = 64 次采样取均值；Aider = 非 thinking 模式；BFCL = Qwen3 用 FC 格式、基线取 FC/prompt 最优（竞品行非同协议）。
- Seed 1.8：WorldTravel = best of five attempts（run_count 5）；VideoMME = 字幕条件（‡）+ VideoCut 工具启用；图内 `*` = 竞品分数引自公开技术报告（comparison_cited 性质，已写入 notes）。
- Seed 2.1：全页无协议明示，protocol 全 null（页面自述"prioritize model performance in live workflows over static benchmark scores"）。

### 本批新增 benchmark id（notes 均标 `new-benchmark`，待迁入主数据）

108 个：`agent-startup-bench`、`ainstein-swe-bench`、`amo-bench`、`bankertoolbench`、`beyondaime`、`biobench`、`blink`、`cgbench`、`cl-bench`、`claw-eval`、`clawbench`、`code-arena-frontend`、`codeforces`、`collie`、`countix`、`creativework`、`cv-bench`、`da-2k`、`doubao-multi-turn-bench`、`draco`、`dyna-math`、`egotempo`、`eifbench`、`embspatial-bench`、`emma`、`erqa`、`finance-agent`、`finsearchcomp`、`frontier-science-olympiad`、`frontier-science-research`、`frontiercs`、`gameworld`、`gdpval`、`gdpval-rubrics`、`hallusionbench`、`hmmt25`、`horizonmath`、`image2floorplan`、`imo-2025`、`imo-answerbench`、`inverse-ifeval`、`kina`、`kor-bench`、`livesqlbench`、`loca-bench`、`logicvista`、`longvideobench`、`lpfqa`、`lvbench`、`mars-bench`、`mathvision`、`measurebench`、`mind2web`、`mm-browsecomp`、`mmbench`、`mme-cc`、`mmlongbench`、`mmsi-bench`、`mmstar`、`mmvp`、`mobileworld`、`motionbench`、`msqa`、`muirbench`、`multi-swebench`、`multichallenge`、`multiif`、`omnidocbench`、`one-million-bench`、`online-mind2web`、`ovbench`、`ovobench`、`paperbench`、`phybench`、`present-bench`、`realbench`、`realworldqa`、`refspatialbench`、`scicode`、`sfe`、`simplevqa`、`spider2`、`supergpqa`、`svg-bench`、`swe-atlas`、`swe-atlas-codebase-qna`、`swe-atlas-test-writing`、`swe-fficiency`、`swebench-live`、`swebench-multilingual`、`swebench-pro`、`tempcompass`、`tomato`、`tvbench`、`u-artifacts`、`usamo-2026`、`vibe-v2`、`video-mme`、`vlmsarebiased`、`vlmsareblind`、`vpct`、`widesearch`、`wildclawbench`、`workspace-bench`、`worldtravel`、`xdailybench`、`xpertbench`、`yc-bench`。

映射既有 id：`arenahard`、`aime24`、`aime-25`、`lcb`、`aider`、`livebench`、`bfcl`、`gpqa`、`terminalbench`（2.0/2.1 记 variant）、`swebench`（harness/turns 记 variant）、`webarena`、`tau-bench`（retail/airline）、`osworld`、`mmmu`（Pro 记 variant）、`arc-agi`（1 记 variant）、`gaia`、`androidworld`、`mmlu`、`mmlu-pro`、`mathvista`、`korb`（Hard 记 variant）、`hlehle`（Verified / text-only / VL 记 variant）。复用前两批已引入的 `agents-last-exam`、`apex-agents`、`babyvision`、`browsecomp`、`charxiv-reasoning`、`cybergym`、`deepswe`、`mcp-atlas`、`nl2repo`、`officeqa-pro`、`posttrain-bench`、`program-bench`、`spreadsheetbench`、`toolathlon`、`zerobench`。

### 跨批 id 对齐

- AIME 2025 届：国际批已记 `aime-25`，本批 qwen3 / seed-1-8 原拟 `aime25`，**已改用 `aime-25`** 保持单一 id。
- Video-MMMU：国际批已记 `video-mmmu`，本批 minimax-m3 原拟 `videommmu`，**已改用 `video-mmmu`**。
- `swebench-pro` 两批不谋而合，无需对齐。

### 本批待人工核验清单（pending 升级路径）

1. Qwen3 两张图 18 行 + Qwen3-Coder 主图 15 行：人工读图确认视觉转写数值后逐行翻 verified。
2. MiniMax M3 大表 25 行 + hero 图：人工读图确认；两处冲突需裁定 —— (a) hero 图 OSWorld-Verified 视觉读数 75.2 vs 散文+大表双重确认的 70.06；(b) IMO/USAMO 竞品行混用 points 与 percent 单位。
3. Seed 2.1 的 13 张图 32 条 pending 行：人工读图；注意 OVOBench（流式）与 OVBench 是两个不同 benchmark，prose 只点名 OVBench。
4. MiniMax M3 VideoMME 双条件（85.4 含字幕 vs 84.6@512 帧）与 PostTrainBench 双记法（0.37 vs 37.1）已分行/已注明，合并前必须按 variant 区分。
5. Seed 1.8 的 11 张图 68 条 pending 行：人工读图；Seed 1.8 与 Seed 2.1 的 PostTrainBench 数值（16.5/18.3 vs 37.1）不可直接比较，协议不同。
6. 未转行的两个图（有意跳过，已写入 release notes）：Seed 1.8 的"高经济价值场景"无名内场景板（Education / Customer Support Q&A 等 6 行，无 benchmark 名）、Seed 2.1 的众包开发者评估图（匿名模型对比）。

---

## 2026-08-31 第三批：国内厂商历代补齐（kimi / deepseek / glm / qwen / minimax）

近三年窗口内国内 Tier 1 厂商核心模型发布补齐，8 个 release。**发布日期全部精确到日**（来源：官方 blog 索引/页面印刷日期/publishedTime 元数据/news slug + HuggingFace 官方 org repo createdAt 双重印证，详见各文件 notes）。本节只追加，不改动既有批次内容。

| 文件 | 发布日期（来源） | 条数 | verified | pending | 抓取路径 |
|---|---|---:|---:|---:|---|
| `kimi/kimi-k2.json` | 2025-07-11（官方 blog 索引 "Kimi K2 \| 2025-07-11" + HF moonshotai/Kimi-K2-Instruct createdAt 2025-07-11T00:55Z） | 32 | 32 | 0 | web reader 拿到正文但 Benchmark 区表格缺失 → **Playwright DOM 扫描发现唯一 DOM 表格**，40 行 × 7 列全机读 → 全部 verified；聚合方式取自表内 Intro 列（Pass@1 / Avg@4/8/16/32/64 / EM / Prompt Strict） |
| `kimi/kimi-k2-thinking.json` | 2025-11-06（官方 blog 索引；HF createdAt 2025-11-04 权重先行两天） | 27 | 27 | 0 | web reader 一次成功，Full Evaluations 为 **DOM 表格**（25 benchmark 行，HLE/AIME/HMMT 各 3 种条件分行）→ 全部 verified；页脚 6 组协议脚注逐条捕获（temp 1.0/256k/INT4/预算 96k/128k/32k/avg@32/16/8/4/编码 5 次均值/o3-mini 裁判/Terminus-2/封锁 HF 披露 51.3） |
| `deepseek/deepseek-v3-1.json` | 2025-08-21（slug news250821 + HF createdAt 2025-08-21T02:37Z） | 13 | 4 | 9 | web reader 成功；**全部分数在 3 张 webp 图内**（编程/搜索/思考效率三图）→ 正文点名 + 明确论断的 4 行（SWE/Terminal-Bench/browsecomp/HLE）按 Seed 2.1 先例 verified + not_extracted；其余 9 行 pending，视觉转写只进 notes |
| `deepseek/deepseek-v3-2-exp.json` | 2025-09-29（slug news250929 + HF createdAt 2025-09-29T06:07Z） | 14 | 0 | 14 | web reader 成功；整页只有一张 benchmark 对比图（vs V3.1-Terminus）且正文只给"基本持平"总结论 → 全部 pending；发布定位是效率版（DSA 稀疏注意力 + 训练设置严格对齐），**不是前沿分数发布** |
| `glm/glm-4-6.json` | 2025-09-30（HF zai-org/GLM-4.6 createdAt 2025-09-29T18:22Z = 北京时间 09-30 凌晨；blog 不印日期） | 9 | 1 | 8 | web reader 一次成功；8 个公开 benchmark 全在 coding_benchmark.png 内（AIME25/GPQA/LCB v6/HLE 双条件 base/w-tools）→ pending；**CC-Bench 48.6% win rate vs Claude Sonnet 4 为正文明文** → verified + reported（人类评审/隔离 Docker/轨迹开源） |
| `qwen/qwen2-5.json` | 2024-09-19（article:published_time 元数据 2024-09-19T00:00:04+08:00） | 28 | 1 | 27 | web reader 成功；家族发布（LLM/Coder/Math），7 张分数图覆盖 72B-Instruct 14 行 + Coder-7B 11 行 + Math 散点 3 行 → 仅 Math-72B 正文论断 verified + not_extracted，其余 pending；legacy/qwen2-5-72b.json 无日期且只覆盖 72B，本文件补齐日期与 Coder/Math |
| `qwen/qwen3-max.json` | 2025-09-24（页面印刷 2025/09/24） | 9 | 4 | 5 | **域名迁移：qwenlm.github.io/blog/qwen3-max/ 已 404**，WebSearch 定位到 qwen.ai/blog?id=qwen3-max（中文版）→ Playwright 渲染成功；4 个正文明文分数 verified（SWE-V 69.6 / Tau2 74.8 / Thinking-Heavy AIME25 与 HMMT 满分）；图表值 pending |
| `minimax/minimax-m2.json` | 2025-10-27（页面印刷日期；免费期延至 11-07 UTC 佐证） | 9 | 1 | 8 | **旧 URL minimax.io/blog/minimax-m2 已 404**，实际 slug 为 minimax-m2-en-1748600000（URL 数字后缀不是发布时间戳，以页面日期为准）；Next.js 渲染 → web reader 只回站点壳，Playwright DOM 扫描成功；8 个 benchmark 全在 8676×3593 大表图内（无 M3 那样的 Evaluation Methodology 区）→ pending；AA 榜单 top-five 论断 third_party_reported verified |

**本批小计：141 条 = 70 verified + 71 pending。** 目录截至本批：25 个 release 文件 / 616 条 evidence（历史快照数字，与并行批交错，总量以顶部当前总量行为准）（`validate-data` PASS：official 29 个 release、47 total）。两个 Kimi 文件因 DOM 表格机读成为全库 verified 密度最高的 release。

### 本批抓取与降级路径记录

1. **旧 URL 大面积失效**：`qwenlm.github.io/blog/qwen3-max/` 与 `minimax.io/blog/minimax-m2` 均 404（Qwen 博客整体迁至 qwen.ai，MiniMax 改用带时间戳后缀的新 slug）；`api-docs.deepseek.com/news/news0821`（裸格式）重定向到文档首页，正确 slug 为 `news250821`/`news250929`（含世纪前缀）。后续 Agent 录入旧发布前应先确认 slug 存活。
2. **web reader 漏表格两例**：Kimi K2 的 benchmark 表格与 MiniMax M2 全页（JS 渲染）在 web reader 输出中缺失，均由 Playwright DOM 扫描找回——与本批 M3 的漏图教训同源：**"正文有 Evaluations 章节却无分数"先怀疑渲染遗漏**。
3. 视觉辅助（MiniMax understand_image）用于：DeepSeek V3.1 ×3 图、V3.2-Exp ×1 图、GLM-4.6 ×1 图、Qwen3-Max ×3 图、MiniMax M2 ×2 图、Qwen2.5 ×3 图。OCR 数值一律只进 notes，未翻转任何行为 verified（goal.md §12.5）。
4. 交叉验证：DeepSeek V3.2-Exp 图读数与 GLM-4.6 / Kimi K2 Thinking 两页印出的 DeepSeek-V3.2 竞品列一致（SWE-V 67.8 / Terminal-Bench 37.7 / AIME25 89.3 / BrowseComp-zh 47.9）；Kimi K2 Thinking 的 DeepSeek-V3.2 列与 DeepSeek 自报图一致。三方互证增强图读数可信度，但仍不据此翻 verified。

### 本批日期取证口径（发布日精确到日的四条路径）

1. **页面自印日期**：MiniMax M2（2025-10-27）、Qwen3-Max（2025/09/24）。
2. **元数据 publishedTime**：Qwen2.5（article:published_time，页面正文不印日期）。
3. **官方 blog 索引列表日期**：Kimi K2 / K2 Thinking（kimi.ai/blog/ 索引卡片，同页与 HF createdAt 互证）。
4. **slug + HF 官方 org createdAt 双证据**：DeepSeek V3.1（08-21）/ V3.2-Exp（09-29）/ GLM-4.6（HF createdAt UTC 09-29 18:22 = 北京 09-30 02:22，取北京日）。

### 本批关键协议字段捕获（协议明示才记录，其余 null）

- **Kimi K2**（DOM 表 Intro 列即聚合协议）：SWE-bench Verified 三行三协议（Agentless 单补丁不跑测试 51.8 / Agentic 单次 65.8 / Agentic 多次 71.6）**不可互换**；TerminalBench 双 harness（自研框架 30.0 / Terminus 25.0）；AIME Avg@64、HMMT Avg@32、CNMO Avg@16、GPQA Avg@8、Tau2 Avg@4；LiveBench 锁 2024/11/25 快照。竞品格星号（*）页面上**无脚注解释**，语义未证实 → 竞品值只进 notes。
- **Kimi K2 Thinking**：全局 temp 1.0 + 256k + INT4（QAT 后训练量化，所有成绩在 INT4 精度下报告）；思考预算分档 96k/128k/32k；编码任务全部 5 次运行取均值；HLE w/tools 裁判 o3-mini（官方提示词逐字复用）+ 步数上限 120；agentic search 步数上限 300；**封锁 HuggingFace 防污染（不封锁 HLE 51.3 vs 报告值 44.9）**；Heavy Mode = 8 轨迹并行 + 反思聚合（GPT-5 heavy 列 = 官方 GPT-5 Pro 分）。
- **GLM-4.6**：上下文 200K 但评测在 **128K** 下进行（图注明示）；CC-Bench 人类评审 + 隔离 Docker + 多轮真实任务，win rate 是对 Claude Sonnet 4 的相对值不是绝对正确率。
- **Qwen3-Max**：Thinking-Heavy 满分（AIME25/HMMT 100%）带"工具 + 并行测试时计算"协议，与 Instruct 无工具 81.6 是**不同模型不同协议**，已分行。
- **MiniMax M2**：页面无 Evaluation Methodology（与 M3 不同），protocol 全 null；temp 1.0/top_p 0.95/top_k 20 是**部署建议非评测协议**，按 Devstral 2 先例记 null。
- **Qwen2.5**：2024 年代发布帖特征——全页无任何协议脚注，shots/采样未披露。

### 本批新增 benchmark id（notes 均标 `new-benchmark`，待迁入主数据）

`ojbench`、`multipl-e`、`acebench`、`cnmo-2024`、`polymath-en`、`zebralogic`、`autologi`、`longform-writing`、`healthbench`、`browsecomp-zh`、`seal-0`、`frames`、`xbench-deepsearch`、`cc-bench`、`artifactsbench`、`math`（Hendrycks MATH 全集，与 math500 子集分立）、`mbpp`、`evalplus`、`spider`、`bird-sql`、`mceval`、`cruxeval`、`alignbench`。

复用既有 data/benchmarks/ id：`lcb`（v6/窗口记 variant）、`swebench`（Verified/Agentless/Agentic 记 variant）、`terminalbench`（harness 记 variant）、`aider`（Polyglot 记 variant）、`tau-bench`（2/域/weighted 记 variant）、`aime24`、`aime-25`、`math500`、`hmmt25`、`gpqa`（Diamond 记 variant）、`mmlu`、`mmlu-redux`、`mmlu-pro`、`ifeval`、`simpleqa`、`livebench`（日期快照记 variant）、`humaneval`、`gsm8k`、`arenahard`、`mtbench`、`bigcodebench`、`gaia`（text only 记 variant）、`arena`（LMArena text）。复用前批已引入 id：`swebench-multilingual`、`multi-swe-bench`、`scicode`、`supergpqa`、`imo-answerbench`、`finsearchcomp`（T3/global 分立）、`codeforces`（Div1，Elo 单位）、`browsecomp`、`aa-intelligence-index`。

### 本批待人工核验清单（pending 升级路径）

1. DeepSeek V3.1 三图 9 行 + V3.2-Exp 一图 14 行：人工读图确认视觉转写后翻 verified（V3.2-Exp 已有 GLM/Kimi 两页竞品列三方互证）。
2. GLM-4.6 coding_benchmark.png 8 行：人工读图；注意 AIME25/GPQA/LCB/HLE 四行各有 base 与 w/ tools 双值，升级时应**拆成 variant 两行**。
3. Qwen2.5 七图 27 行：人工读图；AlignBench/MT-bench 是 1-10 分制非百分比，勿混排。
4. Qwen3-Max 三图 5 行 + MiniMax M2 大表 8 行：人工读图。
5. Kimi K2 竞品格星号语义：页面上无脚注；如后续在 K2 HF model card 或技术报告中找到定义，回填各 verified 行 notes。

### 跨批遗留观察（不改动既有文件，仅报告）

1. 既有 `kimi/kimi-k3.json` 记 `release_date: 2026-07` + month 精度；本批从官方 blog 索引读到 "Kimi K3 | 2026-07-16"，按账本契约未改既有文件，主线可据此前置日期精度。
2. Kimi K2 页首 "Update(0905)" 指向 2025-09-05 的 K2 0905 权重更新（增强 agentic coding + 256K 上下文）；该版本作为竞品列出现在 K2 Thinking 表中，未单独立文件，如需独立 release 可后续补。
3. Kimi blog 索引还可见 K2.5（2026-01-27）/ K2.6（2026-04-20）/ PerceptionBench（2026-07-16）等发布，属近 24 个月窗口内 Kimi 主线，本批任务范围外，留待主线排期。

---

## 2026-08-31 第三批：历代补齐（OpenAI / Anthropic）

补齐两家 Tier 1 厂商近三年核心模型发布，7 个 release / 261 条 evidence（233 verified + 28 pending，其中 123 条为 comparison_cited 竞品列）。**发布日期全部精确到日**。

| 文件 | 来源页 | 条数 | verified | pending | 发布日期来源 |
|---|---|---:|---:|---:|---|
| `openai/o3-o4-mini.json` | openai.com/index/introducing-o3-and-o4-mini/ | 49 | 49 | 0 | 页面正文日期 2025-04-16 |
| `openai/gpt-5.json` | openai.com/index/introducing-gpt-5/ | 59 | 59 | 0 | 页面正文日期 2025-08-07 |
| `openai/gpt-5-5.json` | openai.com/index/introducing-gpt-5-5/ | 111 | 111 | 0 | 页面正文日期 2026-04-23 |
| `anthropic/claude-4.json` | anthropic.com/news/claude-4 | 4 | 4 | 0 | 官方 newsroom 索引 "May 22, 2025"（页面不印日期）+ snapshot `claude-opus-4-20250514` |
| `anthropic/claude-sonnet-4-5.json` | anthropic.com/news/claude-sonnet-4-5 | 10 | 3 | 7 | newsroom "Sep 29, 2025" + platform.claude.com docs "Released September 29, 2025" + snapshot `claude-sonnet-4-5-20250929` |
| `anthropic/claude-opus-4-6.json` | anthropic.com/news/claude-opus-4-6 | 17 | 7 | 10 | newsroom "Feb 5, 2026" + docs "Released February 5, 2026"（**不是** 2025-12） |
| `anthropic/claude-haiku-4-5.json` | anthropic.com/news/claude-haiku-4-5 | 11 | 0 | 11 | newsroom "Oct 15, 2025" + docs "Released October 15, 2025" + snapshot `claude-haiku-4-5-20251001` |

### 本批抓取与降级路径记录

1. **OpenAI 三页全部走降级链**：WebFetch 403 → web-reader 返回软 404（haiku 诗占位页）→ **Playwright 无头浏览器成功**。注意团队简报中的旧 slug `openai-o3-and-o4-mini` / `gpt-5` 已 404，canonical slug 以 `openai.com/sitemap.xml/release/` 为准：`introducing-o3-and-o4-mini`、`introducing-gpt-5`、`introducing-gpt-5-5`。
2. **OpenAI 分数提取方法（本批关键工艺）**：页面 benchmark 图表为 vega-lite 组件，数值以 JSON 形式嵌在 RSC payload（`self.__next_f.push` chunk）里。用平衡括号法逐个解析完整 `vegaSpec` 对象后 `JSON.parse` 取 `title + data.values`——这是**机器可读**（非 OCR、非读图）。堆叠柱状图的 `value` 是分段值、`labelValue` 是显示总值，须以 labelValue 为准并用正文数字锚定校验（锚点全中：AIME 94.6 / GPQA pro 88.4 / SWE 74.9 / HealthBench Hard 46.2；o3 系列与 o3 页面交叉全中：98.4/88.9/83.3/69.1/82.9/78.6/49.7）。**教训**：简单正则按 title 向后找最近 values 会错位一位，GPT-5 页首轮即错，重新用平衡 JSON 解析后修正。
3. **GPT-5.5 页有全文本 DOM 表**（编码/专业/计算机使用与视觉/工具/学术/网络安全/长上下文/抽象推理 8 组，列为 GPT-5.5 / GPT-5.4 / GPT-5.5 Pro / GPT-5.4 Pro / Opus 4.7 / Gemini 3.1 Pro），整表机器可读，页内 `-` 空格一律不落行。脚注四条全捕：SWE-Bench Pro 存在 memorization 证据、MCP Atlas 为 Scale AI 2026-04 更新版、Tau2-bench Telecom 用原始提示词（GPT-4.1 作用户模拟器）且刻意忽略他厂调参结果、内部 CTF 在系统卡最难集上扩展。
4. **Anthropic 四页 web-reader 一次成功**，但全部 benchmark 数值在图片里（与 OpenAI 相反）。发布日期页面不印：日期证据链 = 官方 newsroom 索引逐条日期（与既有 claude-opus-5.json 的 2026-07-24 校验一致）+ platform.claude.com 模型页 "Released" 行 + API snapshot ID，三源互证。
5. **Anthropic 图片表用视觉辅助（MiniMax understand_image）转写 4 张关键图**（sonnet-4-5 表 / opus-4-6 表 / haiku-4-5 表 / claude-4 SWE 图）：OCR 数值一律只进 notes（goal.md §12.5），图片行保持 pending。多个跨厂锚点交叉命中（GPT-5 列 94.6/99.6/85.7/84.2 与 OpenAI 自家 GPT-5 页完全一致；Opus 4.6 GDPval-AA Elo 读数 1606/1462/1416 与正文 delta +144/+190 精确吻合）。

### 本批口径要点

- **正文点名 + 有明确论断但数值在图里 → verified + not_extracted**（沿用 Opus 5 先例）：Opus 4.6 的 Terminal-Bench 2.0 / HLE / GDPval-AA / BrowseComp 四行。
- **正文无数值、名字只在图片 alt/表头 → pending**：Haiku 4.5 全部 11 行、Sonnet 4.5 表内 7 行、Opus 4.6 表内 10 行。升级路径 = 人工读图确认 notes 中的视觉转写值。
- **同 benchmark 跨页冲突不调和**：o3 的 HLE 无工具值在 o3 页为 20.32、在 GPT-5 页为 14.7（Full Set 口径）；MultiChallenge o3 在两页分别为 56.51 / 60.4。各页各记一行，notes 标注冲突待裁定。
- **mrcr 跨厂统一**：Anthropic Opus 4.6（1M 档 76/18.5）与 OpenAI GPT-5.5（8 个 token 带，512K-1M 74.0）同用 `mrcr` id + variant 区分，两家页面互为对方 benchmark 的引用源。

### 本批新增 benchmark id（notes 均标 `new-benchmark`，待迁入主数据）

10 个：`expert-swe`（OpenAI 内部长周期编程）、`genebench`（遗传/定量生物多阶段分析）、`bixbench`（真实生物信息学）、`graphwalks`（长上下文图游走，BFS/parents × 256k/1mil 四变体）、`mrcr`（OpenAI MRCR v2 8-needle，跨厂）、`tau2-bench`（t2-bench，区别于既有 `tau-bench`，Retail/Airline/Telecom 变体）、`mmmlu`（多语言 MMLU，区别于 `mmlu`）、`healthbench`（真实健康对话，OpenAI/医生定义 rubric；Hard 变体）、`mmmu-pro`（视觉研究生级；标准+视觉任务平均口径脚注）、`biglaw-bench`（Harvey 法律，third_party 行）、`deepsearchqa`（Opus 4.6 图表 alt 命名，未读数）。

复用前批 id：`codeforces`、`aime-25`、`hmmt25`、`multichallenge`、`collie`、`erqa`、`gdpval`、`finance-agent`、`swebench-pro`、`video-mmmu`、`browsecomp`、`charxiv-reasoning`、`cybergym`、`mcp-atlas`、`toolathlon`、`aa-intelligence-index`、`officeqa-pro`。映射既有 id：`swebench`（Verified 记 variant；OpenAI n=477 固定子集脚注）、`terminalbench`（2.0 记 variant；Claude 4 页未标版本记 unspecified）、`gpqa`（Diamond）、`hlehle`（Full Set / no-tools / with-tools 记 variant）、`frontiermath`（Tier 1-3 / Tier 4 记 variant）、`arc-agi`（1/2 Verified 记 variant）、`aider`（Polyglot）、`swe-lancer`（IC SWE Diamond，单位 usd）。

### 待人工核验清单（pending 升级路径）

1. Anthropic 28 条 pending 行：按 notes 内视觉转写值逐条人工读图确认后翻 verified（三张大表 + claude-4 平行计算图）。
2. GPT-5 页 o3 HLE（14.7 vs o3 页 20.32）与 o3 MultiChallenge（60.4 vs 56.51）两处跨页冲突需主线裁定口径。
3. o3/o4-mini 页 Aider Polyglot 图的 payload 分段含未解释第二序列，未落行；GPQA-Pass / AIME-with-tools 两张静态 PNG 图未读。

## 历代补齐（2026-08-31 第四批）：Google / xAI / Meta 近三年历代核心模型

补齐 goal.md §12.6 Tier 1 三家在覆盖窗口内的历代旗舰：Google Gemini 2.0 → 2.5 Pro → 2.5 Flash（3.5/3 已由前批覆盖）、xAI Grok 3 → Grok 4（4.6 已由第一批覆盖）、Meta Llama 3.1 → Llama 4。发布日期全部取自官方页面自身时间（publishedTime 元数据或页头日期），精确到日。

| 指标 | 本批值 |
|---|---:|
| 新增 release 文件 | 7 |
| benchmark_evidence 条数 | 113 |
| 行 status=verified | 41 |
| 行 status=pending | 72 |
| release status=verified | 7 |
| verified ∧ vendor_reported（可计入官方发布引用数） | 39 |
| comparison_cited（xAI 散文明文引用 Claude Opus 4） | 2 |

### 逐 Release 清单

| 文件 | 来源 URL | 发布日（页面依据） | 条数 | verified | pending | 抓取路径 |
|---|---|---:|---:|---:|---:|---|
| `google/gemini-2-0.json` | blog.google/…/google-gemini-ai-update-december-2024/ | 2024-12-11（publishedTime） | 14 | 1 | 13 | web reader；散文唯一分数是 Project Mariner 的 WebVoyager 83.5%（single agent setup）；2.0 Flash 全部分数在 GIF 图（gemini_benchmarks_narrow_light2x.gif）→ 13 行 pending，视觉读数只进 notes |
| `google/gemini-2-5-pro.json` | blog.google/…/gemini-model-thinking-updates-march-2025 | 2025-03-25（publishedTime；页内注 03-26 更新 MRCR） | 13 | 6 | 7 | web reader；HLE 18.8% 无工具 / SWE-bench Verified 63.8% custom agent setup 两处散文分数 + GPQA/AIME 2025/LMArena/MRCR 四处点名行 verified；主表为 GIF → 7 行 pending |
| `google/gemini-2-5-flash.json` | blog.google/…/gemini-2-5-model-family-expands/ | 2025-06-17（publishedTime + 页头） | 14 | 0 | 14 | web reader；**正文零 benchmark 点名零分数**，唯一评估物是 2.5 家族表 GIF（含 Flash thinking/non-thinking、Flash-Lite、Pro 五列）→ 全部 pending；表内协议脚注（pass@1 / AI Studio API 默认采样 / Aider 3 次均值 / Vibe-Eval Gemini 自评）已逐字段捕获 |
| `xai/grok-3.json` | x.ai/news/grok-3 | 2025-02-19（页头 + publishedTime） | 14 | 14 | 0 | web reader；Think 散文 4 分（AIME'25 93.3 cons@64 / GPQA 84.6 / LCB 79.4 / mini 95.8+80.4）+ Arena 1402 Elo + 非推理 DOM 数值表 8 行全部机读 verified |
| `xai/grok-4.json` | x.ai/news/grok-4 | 2025-07-09（publishedTime） | 17 | 17 | 0 | web reader + 无头浏览器双路径；web reader 漏掉 GPQA / AIME'25 两个图表区，由渲染 SVG DOM 文本找回（与第一批 grok-4-6 同一 verified 路径，非图片 OCR）；HLE 全集（44.4/38.6，w/ Python+Internet）与 text-only（Heavy 50.7）分开记 variant；2 条 comparison_cited（Claude Opus 4 ARC-AGI-2 ~8.6 / Vending-Bench $2077.41） |
| `meta/llama-3-1.json` | ai.meta.com/blog/meta-Llama-3-1/ | 2024-07-23（页头） | 15 | 0 | 15 | ai.meta.com 拒两个 web reader → Playwright 读 DOM；**正文零 benchmark 名零分数**；两张 fbcdn PNG 表格图，405B 表 15 行 pending（shots/CoT 条件写在行名里已捕获），8B/70B 表数值整表进 release notes 供后续补行 |
| `meta/llama-4.json` | ai.meta.com/blog/llama-4-multimodal-intelligence/ | 2025-04-05（页头） | 26 | 3 | 23 | 同上 Playwright 路径（注意：派单 URL /llama-4-maverick-scout/ 已 404，真实 slug 是 /llama-4-multimodal-intelligence/）；散文仅 LMArena Elo 1417（明示 experimental chat version）+ Behemoth 的 MATH-500/GPQA Diamond 点名；Maverick/Scout/Behemoth 三表全图 → 23 行 pending |

### 本批关键协议字段捕获（协议明示才记录，其余 null）

- **Grok 3**：AIME'25 Think 行明示 **cons@64（64 次采样共识）**；非推理表整表标注 reasoning off；LCB 窗口 10/1/2024-2/1/2025。
- **Grok 4**：HLE 分 **text-only（50.7）与 full set 2025-04-03（w/ Python+Internet 44.4）** 两种 variant；GPQA/LCB/HMMT/AIME'25/USAMO 图表按 **w/ Python / w/ Python+Internet / 无工具** 分条件记录；Vending-Bench 明示 **5 次运行取均值**。
- **Gemini 2.5 家族表脚注（6/17 页）**：全部 Gemini 分数为 **pass@1 单次尝试、AI Studio API 默认采样**；SWE-bench multiple attempts = Google scaffolding 多轨迹 + 模型自评重打分；Aider = 3 次均值且设置非默认；Vibe-Eval 用 Gemini 当裁判；外部数字取自 leaderboard（agi.safe.ai / scale.com / livecodebench / aider.chat / kaggle FACTS）。
- **Gemini 2.5 Pro（3/25 页）**：HLE 明示 **无工具**（tools: []）；SWE-bench 明示 **custom agent setup**；GPQA/AIME 明示**排除 majority voting**。
- **Llama 4 表格脚注**：Maverick 行 = **1-shot temp 0**，Scout 行 = **0-shot temp 0**（同家族两表协议不同！）；高方差 benchmark（GPQA Diamond / LCB）多次生成取均值；Behemoth = "current best internal runs"（预览期快照）；非 Llama 列均取"最高可复现自报值"。
- **Llama 3.1 表**：行内直接写明 shots/CoT（MMLU 5-shot CoT / GSM8K 8-shot CoT / GPQA 8-shot CoT / HumanEval 0-shot 等），已逐行进 protocol。

### 本批新增 benchmark id（notes 均标 `new-benchmark`，待迁入主数据）

`webvoyager`、`natural2code`、`bird-sql`、`math`（Hendrycks 全集，与 `math500` 分立）、`hiddenmath`、`mrcr`、`covost2`、`egoschema`、`vibe-eval`、`global-mmlu-lite`、`loft`、`usamo-2025`（对齐 `usamo-2026`/`aime-25` 命名）、`vending-bench`（与 `vending-bench-2` 分立）、`mbpp-evalplus`、`arc-challenge`（AllenAI，与 `arc-agi` 无关）、`nexus`、`zeroscrolls-quality`、`infinitebench-en-mc`、`multilingual-mmlu`、`mtob`；复用已登记候选 `aime-25`、`hmmt25`（沿用第三批无连字符拼写，未另铸新 id）。映射既有 id：`mmlu`、`mmlu-pro`、`ifeval`、`humaneval`、`gsm8k`、`gpqa`、`bfcl`、`mgsm`、`niah`（NIH/Multi-needle 记 variant）、`aime24`、`lcb`（各窗口记 variant）、`simpleqa`、`mmmu`、`chartqa`、`docvqa`、`mathvista`、`arena`、`swebench`（single/multiple attempts 记 variant）、`aider`、`factsg`、`math500`、`arc-agi`（2 记 variant）。

### 待人工核验清单（pending 升级路径）

1. Gemini 2.0 GIF 图 13 行、2.5 Pro GIF 表 7 行、2.5 Flash 家族表 14 行：人工读图确认视觉转写数值后逐行翻 verified（GIF 已在无头浏览器中稳定帧截图辅助）。
2. Llama 3.1 405B 表 15 行 + 8B/70B 表（数值在 release notes）：人工读图翻 verified / 补行。
3. Llama 4 三表 23 行：人工读图；注意 Maverick（1-shot）与 Scout（0-shot）协议不同；Behemoth 为训练中快照。
4. Gemini 2.5 Pro 页伴生技术报告（页内 "latest Gemini technical report" 链接）与 Deep Think 独立方法论页（第一批遗留）为潜在补充来源。

### 本批遗留 / 观察（不改动既有文件，仅报告）

1. **legacy `xai-grok-3.json` 与本批 `official/xai/grok-3.json` 指向同一次真实发布**：legacy 桩无日期、无分数、全 pending。按账本契约未删 legacy 文件，建议主线将其移出 legacy 或标记 superseded，避免同一发布被计两次。
2. Llama 4 的 LMArena 1417 Elo 页面自述属于 **experimental chat version**，与同期发布的开源权重不是同一提交快照 —— 跨厂商对比时须按 variant 处理（页内原文已引用，无外部信息）。
3. x.ai 页面对 web reader 与真实 DOM 的内容不一致（GPQA / AIME'25 区块只在渲染后出现）：后续抓 x.ai 图表页应默认走无头浏览器并扫 SVG text。
4. Google 三批 GIF 表格均为动画图：本批用"浏览器直开 GIF + 稳定帧截图 + 视觉转写"路径，数值只进 notes；如后续要翻 verified，仍需人工读图（§12.5）。
5. `hmmt25`（第三批）与 `usamo-2026`/`aime-25`（第二/三批）命名不一致为既有事实，本批未统一，留给主线批量裁定。

---

## 2026-08-31 第四批：OpenRouter 交叉核对补齐（OpenAI / Anthropic 旗舰缺口）

来源交叉链：**OpenRouter `/api/v1/models` created 时间戳作旁证（D 级，上架≠发布），release_date 一律以官方 blog/newsroom 为准**。本批旁证质量：o3/o4-mini、GPT-5.4、Opus 4.7、Fable 5、Sonnet 5 上架日=发布日；GPT-5.5 滞后 1 天；**Opus 4.8 上架 05-27 / 官方发布 05-28**。6 个 release / 74 条 evidence（35 verified + 39 pending）。

| 文件 | 来源页 | 条数 | verified | pending | 发布日期来源 |
|---|---|---:|---:|---:|---|
| `openai/gpt-5-4.json` | openai.com/index/introducing-gpt-5-4/ | 24 | 24 | 0 | 页面正文日期 2026-03-05（= OpenRouter 5.4/5.4-pro 上架日） |
| `openai/gpt-5-4-mini-nano.json` | 无官方发布页 | 0 | 0 | 0 | **占位 pending**：OpenRouter 上架 2026-03-17，release sitemap 无独立页，主发布页未提及 mini/nano |
| `anthropic/claude-opus-4-7.json` | anthropic.com/news/claude-opus-4-7 | 17 | 5 | 12 | newsroom "Apr 16, 2026"（= OpenRouter 04-16） |
| `anthropic/claude-opus-4-8.json` | anthropic.com/news/claude-opus-4-8 | 9 | 2 | 7 | newsroom "May 28, 2026"（OpenRouter 上架 05-27，滞后 1 天） |
| `anthropic/claude-fable-5.json` | anthropic.com/news/claude-fable-5-mythos-5 | 16 | 2 | 14 | newsroom "Jun 9, 2026"（联合发布 Fable 5 + Mythos 5；= OpenRouter 06-09） |
| `anthropic/claude-sonnet-5.json` | anthropic.com/news/claude-sonnet-5 | 8 | 2 | 6 | newsroom "Jun 30, 2026"（= OpenRouter 06-30） |

### 本批抓取与口径记录

1. **GPT-5.4 页延续第三批工艺**：顶部文本表 + RSC vega payload 双通道机器读取，全部 verified、零 pending。捕获一处**页内分数修订**：GPT-5.3-Codex OSWorld-Verified 64.7% → 74.0%（新 API 参数保留原始图像分辨率，页脚注明）；捕获 effort 曲线协议（SWE-Bench Pro / Toolathlon / OSWorld / GDPval 按 none→xhigh 全档）与 BrowseComp 搜索黑名单协议说明。
2. **Anthropic 新四页**：正文绝对分数稀缺（Opus 4.7 两句 SOTA、Sonnet 5 一句 Firefox-147 0.0%、Fable 5 两句第三方榜首），其余全在图表 → pending + 视觉转写入 notes。**跨厂锚点全部命中**：Opus 4.7 表的 GPT-5.4/5.5 列与 OpenAI 自家页完全一致（57.7/75.1/89.3/94.4 等），Fable 5 表的 Opus 4.8/GPT 5.5 列与各自官方页一致。
3. **跨页冲突（不调和，均已入 notes 待裁定）**：(a) MCP Atlas Opus 4.7 = 77.3（4.7 页）vs 79.1（GPT-5.5 页，脚注 Scale AI 2026-04 更新）——不同快照；(b) Terminal-Bench 2.1 Opus 4.8 = 74.6 / GPT-5.5 = 78.2（4.8 自家页）vs 82.7 / 83.4 Codex CLI（Fable 5 与 Sonnet 5 页）——疑似分数修订或 harness 差异；(c) GDPval-AA 版本标注不一（4.8 页无版本、Sonnet 5 页标 v2 且 Opus 4.8 值不同 1890 vs 1615）。
4. **fast 变体归属**：claude-opus-4.7-fast（上架 05-12）无独立新闻条目 → 并入 claude-opus-4-7.json 作 model + notes；4.8-fast 在 4.8 页正文有定价（2.5 倍速、比以往快档便宜 3 倍）→ 同法并入。
5. **Fable 5 部署时间线**（页顶更新，入 notes）：06-09 发布 → 06-12 按美国政府指令暂停 → 07-01 恢复；表内带星行 = Fable 受安全回退影响接近 Opus 4.8（方法学脚注已全文抄录）。
6. **Sonnet 5 协议修订记录**（6-30 changelog）：BrowseComp 成本-性能图原方法学低估 Sonnet 5，已替换为系统卡方法学（10M token 预算 + compaction + 程序化工具调用）；8-10 定价修订：$2/$10 转永久。

### 本批新增 benchmark id（notes 均标 `new-benchmark`）

7 个：`frontiercode`（Cognition，页内命名不一致 FrontierCode/FrontierBench 已注）、`hebbia-finance-benchmark`、`gdr-pdf`、`blueprint-bench-2`、`automationbench`、`biomysterybench`（hard / human-solved 两变体）、`legal-agent-benchmark`（Harvey）、`firefox-147-exploit`（Mozilla 协作，已修补于 148）。复用/映射：`omnidocbench`、`online-mind2web`、`webarena`（Verified 变体）、`cursor-bench`、`exploitbench`（注意 Anthropic 记 Cap%、OpenAI 记 pass 率，同族不同口径）、`healthbench`（Professional 变体）、`mmmu-pro`、`tau2-bench`（本批未落行，注记）。

### 交叉核对新发现的剩余缺口（未覆盖，待派单）

OpenRouter 目录里仍无 release 文件的旗舰线（均有官方页或 newsroom 条目，2025-08～2026-02 窗口）：**Anthropic** claude-opus-4.1（2025-08-05）、claude-opus-4.5（2025-11-24）、claude-sonnet-4.6（2026-02-17）；**OpenAI** gpt-5.1（sitemap 见 /index/gpt-5-1/ 及 gpt-5-1-codex-max）、gpt-5.2（2025-12-10 上架，GPT-5.5 页引用其 12 月网安护栏）、gpt-5.3 系（introducing-gpt-5-3-codex / codex-spark / gpt-5-3-instant）、gpt-5.5-instant。另 `gpt-5-4-pro` 上架日与主发布同日已并入 gpt-5-4.json，无需独立文件。
## 历代补齐第五批（2026-08-31）：OpenRouter 交叉核对缺口 — Google / xAI / Meta

来源：OpenRouter 官方模型目录交叉核对给出的缺口清单（OpenRouter created 仅作旁证，发布日期一律以官方页面自身时间为准）。本批新增 10 个 release，另把派单外发现的 `gemini-3-flash`（2025-12-17，官方 blog 有 4 个散文明文分数）一并补入（宁全勿缺）。

| 指标 | 本批值 |
|---|---:|
| 新增 release 文件 | 10 |
| benchmark_evidence 条数 | 55 |
| 行 status=verified | 52 |
| 行 status=pending | 3 |
| release status=verified | 8 |
| release status=pending（占位，无官方页） | 2（grok-4-3 / grok-4-20） |
| verified ∧ vendor_reported | 52 |

### 逐 Release 清单

| 文件 | 发布日（依据） | 条数 | v/p | 抓取路径与要点 |
|---|---|---:|---|---|
| `google/gemini-3-flash.json` | 2025-12-17（publishedTime；派单外新发现） | 5 | 5/0 | web reader；GPQA 90.4 / HLE 33.7 无工具 / MMMU Pro 81.2 / SWE-bench Verified 78 / LMArena 点名行全散文明文 |
| `google/gemini-3-1-flash-lite.json` | 2026-05-08（Google Cloud blog publishedTime；=05-07 PT，与 OpenRouter 05-07 一致） | 0 | 0/0 | **GA 页零 benchmark**，全是企业客户生产指标（Gladly p95/成功率等非 benchmark）→ 不建行不臆造；GPQA 86.9 等二级来源数字只进 notes |
| `google/gemini-3-5-flash.json` | 2026-05-19（I/O 2026，publishedTime） | 4 | 4/0 | web reader；TB 2.1 76.2 / GDPval-AA 1656 Elo / MCP Atlas 83.6 / CharXiv 84.2，基线 Gemini 3.1 Pro |
| `google/gemini-3-6-flash.json` | 2026-07-21（publishedTime） | 10 | 10/0 | 一帖三模型（3.6 Flash + 3.5 Flash-Lite + 3.5 Flash Cyber）；3.6 四分 + Flash-Lite 五分 + Cyber CyberGym 点名行（not_reported）；帖内还首发了 3.1 Flash-Lite 的官方基线值（TB 31 / MRCR 60.1 / GDPVal 642） |
| `google/gemini-3-7-flash.json` | 2026-08-13（publishedTime，与 OpenRouter 一致） | 5 | 5/0 | web reader；FrontierCode 1.1 43.6 / DeepSWE v1.1 65.3 / WebDev Arena 1588 / GDP.pdf 34.0 / AutomationBench 30.4 全散文 |
| `xai/grok-4-5.json` | 2026-07-16（官方 blog publishedTime；OpenRouter 07-08 / 部分跟踪站 07-09 应为 API 先行，官方日期为准） | 6 | 6/0 | web reader；**基准值以图表无障碍文本形式内嵌 DOM**（与 grok-4-6 同类机读路径）：DeepSWE 1.0 62.0 / 1.1 53 / SWE-Marathon 29.0 pass@1 / TB 2.1 83.3 / SWE-Bench Pro 64.7 + token 效率 15,954 avg tokens/task |
| `xai/grok-4-3.json` | 2026-04-30（OpenRouter created + 多源一致；无官方页） | 0 | 0/0 | **静默发布占位**：x.ai/news/grok-4-3 404；二级来源的 τ²-Bench 98% / GDPval-AA 1500 等一律不记（tier D） |
| `xai/grok-4-20.json` | 2026-03-31（OpenRouter created 旁证；无官方页） | 0 | 0/0 | 同上静默占位；前代 Grok 4.1（2025-11-17 二级线索）也缺，待 xAI 盘点补 |
| `meta/muse-spark-1-2.json` | 2026-08-05（research.meta.ai 页头日期） | 3 | 0/3 | web reader 挂 → Playwright；launch 帖基准值全在图片 → 3 行 pending，二级转写值（TB 2.1 82.9 / DeepSWE 1.1 59.3 / 内部 Coding Bench 70.6）只进 notes；协议细节（89 题 pass@1×5、113 题/91 仓、440 内部题、Daytona 沙箱）已捕获 |
| `meta/muse-glimmer-30b.json` | 2026-08-10（HF model card publishedTime + 官方 blog；OpenRouter 旁证 08-09 早一天） | 22 | 22/0 | HF 官方 model card **DOM 明文大表**（tier A model card）：MCP Atlas Public 75.5 / DeepSearch QA 74.6 / τ3-Banking 23.5 / WildClawBench 47.6 / GDPVal-AA v2 953 / Gaia2 43.3 / SkillsBench 44.3 / OSWorld 65.9 / SWE-Pro 51.2 / SWE-Verified 76.0 / TB 2.1(terminus2) 51.7 / SciCode 43.6 / CharXiv 78.8 / ScreenSpot Pro 75.4 / OmniDocBench v1.5 75.8 / MMMU Pro 74 / IFBench 77.0 / AIME 2026 94.7 / GPQA(AA) 83.5 / HLE Text(AA) 22.0 / AA-LCR 80.0 / Beam128K 65.1；推荐采样（temp 1.0/top_p 0.95/top_k 64）逐行入 protocol |

### 本批新增 benchmark id（notes 标 new-benchmark）

`gdp-pdf`、`tau3-banking`、`gaia2`、`skillsbench`、`screenspot-pro`、`ifbench`、`aime-26`（对齐 aime-25 拼法）、`aa-lcr`、`beam128k`、`meta-internal-coding-bench`。复用已登记候选：`deepswe`、`swe-marathon`、`frontier-code`、`webdev-arena`、`automationbench`、`mcp-atlas`、`gdpval-aa`（v2 记 variant）、`swebench-pro`、`cybergym`、`deepsearchqa`、`wildclawbench`、`omnidocbench`、`scicode`、`charxiv-reasoning`、`mrcr`（GDM-MRCR v2 记 variant）；映射既有 id：`gpqa`（AA 记 variant）、`hlehle`（Text/AA 记 variant）、`terminalbench`、`osworld`、`swebench`、`mmmu`（Pro）、`mlebench`、`aime`系。

### 跨厂商可比性提示（本批实测）

1. **DeepSWE 三家同月不同 harness**：Google 3.7 Flash 65.3%（自跑）/ xAI Grok 4.5 53%（mini-swe-agent，Datacurve 统一跑）/ Meta Spark 1.2 59.3%（Muse Code 自跑）——同名 benchmark、三种 harness，禁止直接横排。
2. **GDPval-AA 变体混用**：May 帖写 `GDPval-AA`（1656），7/8 月帖写 `GDPVal-AA v2`（1421/1525/953）——已按 variant 分开，迁移主数据时不得合并。
3. **TB 2.1 harness 信息不均**：只有 Muse Glimmer（terminus2）与 Google 3.6 model page（Terminus-2）明示 harness；xAI Grok 4.5 83.3 未明示——跨厂商比较只在该字段对齐时成立。
4. **AA 运行车道**：Muse Glimmer 卡上 GPQA/HLE/AA-LCR 带 (AA) 后缀（第三方 Artificial Analysis 跑分）——与厂商自跑车道分开记 variant。

### 本批遗留 / 待跟进

1. **Google 3.1 系列仍是盲区**：3.5 Flash 帖以 `Gemini 3.1 Pro` 为基线、7 月帖给 3.1 Flash-Lite 基线值，说明 2025-12→2026-05 间存在 3.1 Pro/Flash 发布，OpenRouter 清单未列出，需要一次 Google 3.1 系列盘点。
2. **xAI Grok 4.1（约 2025-11-17）缺**，同属静默代际；连同 grok-4-3/4-20 一起，xAI 建议按 release-inventory `checked, no benchmark page` 口径收口。
3. **未抓的 tier-A 补充源**：deepmind.google 3.7 model card 与 3.6 model page（两页均有 DOM 明文大表，含 Muse Spark 1.2 / Grok 4.5 竞品列）、Meta Spark 1.2 Evaluation Methodology 页、Gemini 2.5 家族帖引用的 technical report——均为下一批现成来源。
4. gemini-3-1-flash-lite 的 0 行不是遗漏：官方 GA 页确无 benchmark，二级数字（GPQA 86.9 等）按铁律未转录为行。

---

## 历代补齐第六批（2026-08-31，收官批）：残余盲区 — Gemini 3.1 / Grok 4.1 / Spark 1.2 方法论页

按第五批遗留清单收口：Google 3.1 系列、xAI Grok 4.1、Meta Spark 1.2 Evaluation Methodology 页。本批新增 2 个 release、升级 2 个既有 release，此后 Google/xAI/Meta 三家在覆盖窗口内的历代主线全部有档。

| 指标 | 本批值 |
|---|---:|
| 新增 release 文件 | 2（gemini-3-1-pro / grok-4-1） |
| 升级既有 release | 2（gemini-3-1-flash-lite 补 3 行 verified；muse-spark-1-2 三行 pending→verified + 新增 2 行第三方行） |
| 新增 evidence 行 | 29（gemini-3-1-pro 19 + grok-4-1 5 + flash-lite 3 + spark-1-2 新 2） |
| 行 status=verified | 28（spark-1-2 的 3 行由 pending 翻转，不计入新增） |
| 行 status=pending | 1（grok-4-1 的 EQ-Bench3/CreativeWriting v3/FActScore 中…实为 3 条 pending） |
| third_party_reported（不计自报总数） | 2（Spark 1.2 的 GDPVal-AA v2 @AA / MCP Atlas @Scale AI） |

> 更正上表：grok-4-1 为 2 verified + 3 pending；行级合计 29 新增中 26 verified + 3 pending。

### 逐项清单

| 项 | 发布日（依据） | 行数 | 要点 |
|---|---|---:|---|
| `google/gemini-3-1-pro.json` | 2026-02-19（blog.google 官宣 publishedTime） | 19 全 verified | 主证据源是 **deepmind.google/models/gemini/pro/ 产品页的 DOM 明文大表**（我方直读，无图片依赖）：HLE 双条件（无工具 44.4 / Search+Code 51.4）、ARC-AGI-2 ARC Prize Verified 77.1、GPQA 94.3 无工具、TB 2.0 Terminus-2 68.5、SWE-Verified 单次 80.6、SWE-Pro Public 54.2、**LCB Pro Elo 2887**（竞赛 Elo 版，与 pass 率窗口不同度量）、SciCode 59、APEX-Agents 33.5、GDPval-AA 1317、τ2 Retail 90.8/Telecom 99.3、MCP Atlas 69.2、BrowseComp 85.9（Search+Python+Browse）、MMMU-Pro 80.5、MMMLU 92.6、MRCR v2 128k 84.9/1M 26.3。竞品列（3 Pro/Sonnet 4.6/Opus 4.6/GPT-5.2/GPT-5.3-Codex，注意各列 Thinking 深度不同：High vs Max vs xhigh）照旧进 notes，不拆 comparison_cited。 |
| `google/gemini-3-1-flash-lite.json`（升级） | 2026-05-08 GA（保持不变） | +3 verified | 找到官方 **preview 宣告帖（2026-03-03，blog.google/deepmind）**：Arena.ai 1432 Elo / GPQA Diamond 86.9% / MMMU Pro 76.8% 全在散文——第五批标为"二级来源不录"的数字其实有 tier-A 载体，已补录并加 revisions[] 留痕。 |
| `xai/grok-4-1.json` | 2025-11-17（页头+publishedTime，与派单估计一致） | 2 verified + 3 pending | 风格/人格向发布：LMArena Text **Thinking 1483 Elo #1**（quasarflux）与**非思考 1465 Elo #2**（tensor）散文可证；EQ-Bench3 / Creative Writing v3 / FActScore 散文给了完整方法论（EQ-Bench3 判官=Claude Sonnet 3.7、官方仓库、默认采样；FActScore=500 传记题、越低越好、非思考+搜索工具）但分数在图 → 3 行 pending。11-01~14 静默灰度 + 64.78% 盲测偏好为内部 A/B，只进 notes。 |
| `meta/muse-spark-1-2.json`（升级） | 2026-08-05（不变） | 3 翻 verified + 2 新 third_party | **方法论页是 PDF（research.meta.ai/static/muse-spark-1-2-methodology）且全文可机读**，但只有协议没有分数：TB 2.1（89 题/5 次/pass@1/Daytona/可执行验证器）、DeepSWE 1.1（113 题 91 仓 5 语言/Harbor/Pier v0.3.0/断网）协议据此精化，3 行按"点名+协议可证"口径翻 verified（分数仍 not_extracted，82.9/59.3/70.6 留 notes）。方法论同时披露 **GDPVal-AA v2 与 MCP Atlas 的结果分别由 Artificial Analysis 与 Scale AI 产出** → 新增 2 行 third_party_reported（AA Stirrup harness/人类基线 1000；MCP Atlas 1000 题 36 服务器/覆盖度≥0.75）。 |

### 本批新增 benchmark id（notes 标 new-benchmark）

`eq-bench3`、`creative-writing-v3`、`factscore`、`mmmlu`（Multilingual MMLU——与 `global-mmlu-lite`、`multilingual-mmlu` 构成三个多语言 MMLU 姊妹 id，迁移时须分立或显式版本化）。复用已登记：`apex-agents`、`browsecomp`、`scicode`、`swebench-pro`（Public 记 variant）、`mcp-atlas`、`gdpval-aa`、`mrcr`（v2 8-needle 记 variant）；映射既有：`hlehle`（双条件分行）、`arc-agi`（2 + ARC Prize Verified）、`gpqa`、`terminalbench`、`swebench`、`lcb`（**Pro Elo 版记 variant——Elo 与 pass 率永不合并**）、`tau-bench`（τ2 Retail/Telecom）、`mmmu`（Pro）、`arena`。

### 收官状态：三家覆盖窗口内主线（2023-09 后）

- **Google**：2.0 → 2.5 Pro → 2.5 Flash → 3 Pro/Deep Think（前批）→ 3 Flash → 3.1 Pro → 3.1 Flash-Lite → 3.5 Flash → 3.6 Flash(+3.5 Flash-Lite/Cyber) → 3.7 Flash，全部有档。**已证实不存在独立 "Gemini 3.1 Flash" 文本模型**（3.1 Flash 层只出了 Flash-Lite/Live/TTS/Image 变体，Vertex 版本表佐证）——该"缺口"以 gemini-3-1-pro 的 notes 记录结论而非造文件。3.5 Pro 在 7 月帖中"still testing"，发布后补。
- **xAI**：Grok 3 → 4 → 4.1 → 4.20（pending 占位）→ 4.3（pending 占位）→ 4.5 → 4.6（第一批），全部有档；4.20/4.3 维持 `checked, no benchmark page` 口径。
- **Meta**：Llama 3.1 → Llama 4 → Muse Spark 1.1（前批）→ Spark 1.2 → Glimmer 30B，全部有档；Spark 1.2 开源权重版"coming weeks"发布后补。

### 收官遗留（供主线排期，不再扩大）

1. 三家各有"分数在图片"的 pending 行（Google GIF 表、Meta launch 图表、xAI EQ/CW/FActScore 图）——升级路径均为人工读图，非抓取问题。
2. deepmind.google 的 3.7 model card 与 evals-methodology/gemini-3-1-pro 页仍是两个未抓的 DOM 明文源（前者含 Muse Spark 1.2 / Grok 4.5 竞品列）。
3. `mmmlu` / `global-mmlu-lite` / `multilingual-mmlu` 三 id 待主线裁定合并策略；`gdpval-aa` 的 v2/非 v2 混用已按 variant 隔离，迁移时保持。

## 2026-08-31 第四批：旗舰历代全量补齐（OpenRouter 交叉核对增补）

OpenRouter 官方模型目录交叉核对发现的旗舰缺口，19 个 release 文件、286 条 evidence（212 verified + 74 pending）+ 5 个零行占位。OpenRouter created 仅作旁证，发布日期以官方页为准（本批有多处修正，见下）。本节只追加，不改动既有批次内容。

| 文件 | 发布日期（来源） | 条数 | verified | pending | 抓取路径与要点 |
|---|---|---:|---:|---:|---|
| `kimi/kimi-k2-6.json` | 2026-04-20（官方 blog 索引） | 13 | 5 | 8 | web reader 拿到正文+6 组脚注；摘要 DOM 表（后被追加 K3 列）5 行机读 verified；Full Benchmark 各节值在非 DOM 组件 → 8 行 pending（节标题定位）。**编码分 = 10 次运行均值**（非早期 Kimi 的 5 次）；temp 1.0 / top-p 1.0 / 262,144 ctx |
| `kimi/kimi-k2-5.json` | 2026-01-27（官方 blog 索引；statics 资产 0126/0127 佐证） | 24 | 5 | 19 | web reader 全文+7 组脚注；附录 benchmark 表非 DOM（唯一 DOM 表是迷宫演示）→ 仅脚注明文的 4 个 HLE 值（31.5/21.3/51.8/39.8，全集 text×image×工具 四条件）verified；其余 19 行 pending。**top-p 0.95**（与 K2/K2.6 的 1.0 不同）；正文 59.3%/24.3% 与图 alt 71.2%/39.0% 冲突已记录 |
| `kimi/kimi-k2-0905.json` | 2025-09-05（官方 blog 索引；HF createdAt 09-03 权重先行；OpenRouter 09-04 近似） | 5 | 5 | 0 | 博客正文页 slug 已从索引摘链 → **以 HF 官方 model card 为 A 级源**（README 表格机读）；罕见的 **mean±std over 5 全量运行** + 仓库 Git 对象剪枝防泄漏协议 |
| `deepseek/deepseek-v3-2.json` | 2025-12-01（官方新闻侧栏 + slug + HF createdAt 三证） | 16 | 4 | 12 | web reader 成功；三张 webp 图（表1 含每格 token 消耗）→ 12 行 pending 视觉转写只进 notes；**V3.2-Speciale 四大奥赛金牌论断（IMO/CMO/ICPC WF/IOI 2025）正文 verified**。V3.2 图读数与 GLM-4.7/5/5.1、Kimi K2.5 四页竞品列互证一致 |
| `deepseek/deepseek-v4.json` | 2026-04-24（官方新闻侧栏 + slug；OpenRouter 同日） | 22 | 0 | 22 | 预览版；两图（summary + 全表含 V4-Flash 列）全 pending；图读数与 GLM-5.2 的 DeepSeek-V4-Pro 竞品列逐项一致（HLE 37.7 / GPQA 90.1 / SWE-Pro 55.4 / MCP-Atlas 73.6 / Tool-Decathlon 52.8） |
| `glm/glm-5-2.json` | 2026-06-16（HF createdAt + 页面资产时间戳 + OpenRouter 三证） | 19 | 19 | 0 | web reader 一次成功，**完整 DOM 表 + 每 benchmark 独立协议脚注**（temp/top_p/max_tokens/harness/超时逐项）→ 全 verified；FrontierSWE/PostTrainBench/SWE-Marathon 三行标 third_party（Proximal/PostTrainBench org/Abundant AI 代跑） |
| `glm/glm-5-1.json` | 2026-04-07（页面资产 20260407 + OpenRouter；HF 04-03 权重先行） | 18 | 18 | 0 | 同上全 DOM 表 verified；τ³-bench（新 benchmark）、Vending Bench 2 美元行（Andon Labs 代跑）、KernelBench L3 带防作弊审计协议（Opus 4.6 + GPT-5.4 双审计取低值 + 50x 硬帽） |
| `glm/glm-5.json` | 2026-02-11（HF createdAt + 资产时间戳） | 18 | 18 | 0 | 全列 Thinking 模式；TB 2.0 自带 dagger = 厂商自建 "verified" 修订数据集（HF: zai-org/terminal-bench-2-verified），数据集变体已披露 |
| `glm/glm-4-7.json` | 2025-12-22（HF createdAt + OpenRouter；资产 12-23 00:44 为北京深夜续作） | 17 | 17 | 0 | 全 DOM 表 verified；三组协议档（默认 / Terminal+SWE temp 0.7 / τ²-Bench temp 0 + Preserved Thinking） |
| `qwen/qwen3-8-max.json` | 2026-08-03（官方 research 索引卡 + OpenRouter） | 31 | 31 | 0 | qwen.ai（id=qwen3.8）DOM 表 1 全 verified；**表 2（61 行多模态，同为 DOM 机读）本批未转录**——已在 release notes 定位标记，留待后续补行；1M 上下文 SOTA 论断 + 长程演示带可验证数字（16 天自治仓库 265 commits / 125 小时论文复现+超越 / 24h 竞赛 0.853 胜 458 队） |
| `qwen/qwen3-8-flash.json` | 2026-08-26（官方 research 索引卡"Qwen3.8-Flash-Next"；OpenRouter qwen3.8-flash 同日） | 36 | 36 | 0 | **三张 DOM 表全 verified**（instruct 12 + 多模态 10 + base 12）；架构预览定位（Qwen4 先导）；训练成本 ≈ Qwen3.7-Plus 的 1/9 论断 |
| `qwen/qwen3-7-max.json` | 2026-05（**月精度**：正文引用块只给 month=May；OpenRouter 05-21 旁证） | 41 | 41 | 0 | id=qwen3.7 DOM 表（41 行 × 6 模型）全 verified；Kernel Bench L3 速度比/正确率双值、QwenWebDev/QwenSVG Elo 值；与 GLM-5.2 的 Qwen3.7-Max 竞品列互证一致（SWE-Pro 60.6 / NL2Repo 47.2 / MCP-Atlas 76.4 / HLE 41.4 等 7 项） |
| `qwen/qwen3-7-flash.json` | 2026-07-27（OpenRouter 旁证） | 0 | 0 | 0 | **占位 pending**：官方 blog 未定位（id 猜测空壳 / 旧域 500 / sitemap 只收 qwen3.8 / 索引分页未露出）；日期为 OpenRouter created，非官方 |
| `qwen/qwen3-6-flash.json` | 2026-04-27（OpenRouter 旁证） | 0 | 0 | 0 | **占位 pending**，同上；Qwen3.6-Plus 已作为竞品列出现在本批两个 DOM 表中可作代际参照 |
| `minimax/minimax-m2-7.json` | 2026-03-18（**页面印刷日期**；OpenRouter 同日；HF 04-09 为后上传——冲突以官方页为准） | 10 | 10 | 0 | JS 渲染 news 页，Playwright 提取；全部分数为正文论断 → verified；页面拼写 "Toolathon" 46.3 与 GLM-5.1 的 Tool-Decathlon M2.7 列完全一致（跨厂商互证映射）；MLE-Bench Lite 奖牌率 66.6%（3×24h 协议） |
| `minimax/minimax-m2-5.json` | 2026.2.12（页面印刷 + HF createdAt 同日） | 8 | 8 | 0 | 同上 Playwright；**同 benchmark 双 harness 敏感性**：SWE-V 默认 80.2 / Droid 79.7 / OpenCode 76.1（≈4 分 harness 效应）+ 每任务 3.52M tokens / 22.8 分钟经济学披露；GDPval-MM 59.0% win rate（内部结对评审） |
| `doubao/seed-1-6.json` | **2025-06-25（官方页印刷；修正任务输入的 2025-12-23**——OpenRouter 时间戳疑为后续变体上架**）** | 0 | 0 | 0 | JS 渲染 model 页；无任何机读分数（Base LLM 评测表在非 DOM 组件且竞品列注明引自 Qwen 技术报告）→ release pending 占位；三阶段续训 + AdaCoT 协议披露入 notes |
| `doubao/seed-2-0-mini.json` | 2026-02-26（OpenRouter 旁证） | 0 | 0 | 0 | **占位 pending**（变体层级）；官方页未定位，Seed 站点模型列表从 1.x 直接跳 2.1 |
| `doubao/seed-2-0-lite.json` | 2026-03-10（OpenRouter 旁证） | 0 | 0 | 0 | **占位 pending**（变体层级），同上 |

**本批小计：286 条 = 212 verified + 74 pending；另有 5 个零行占位 release（qwen3-7-flash / qwen3.6-flash / seed-1-6 / seed-2.0-mini / seed-2.0-lite，status=pending，不计入公开覆盖计数）。** `validate-data` PASS。

### 本批日期修正与冲突裁定（OpenRouter created ≠ 官方发布日的三个实例）

1. **seed-1-6**：任务输入 2025-12-23（OpenRouter）→ 官方页印刷 **2025-06-25**，取官方。
2. **minimax-m2-7**：HF createdAt 2026-04-09 vs 官方页 2026-03-18 vs OpenRouter 2026-03-18 → 取官方页（HF 为开源权重后上传）。
3. **kimi-k2-0905**：OpenRouter 09-04 vs 官方索引 09-05 vs HF 09-03 → 取官方索引（HF 权重先行、OpenRouter 居中，三者相差 ≤2 天）。
4. **glm-5-1**：HF 04-03（权重）vs 页面资产/OpenRouter 04-07（blog）→ 取 blog 日，HF 先行已注明。
5. **qwen3-7-max**：官方只给到月（引用块 month=May）→ 按规则记 YYYY-MM + month 精度，OpenRouter 05-21 写入 notes 作升级线索。

### 本批方法论新沉淀

1. **qwen.ai 的 id 体系不规律**：qwen3-max / qwen3.8 / qwen3.7 / qwen3.8-flash-next 各自成立，qwen3.7-max / qwen3.7-flash / qwen3.6-flash 空壳；sitemap 只索引最新一篇。旧域 qwenlm.github.io 部分旧文仍活（qwen2.5）部分 500（3.6/3.7-flash）。后续应从 research 索引分页拿 id，勿猜。
2. **MiniMax 新闻页域名从 /blog/ 迁到 /news/**，slug 不再带时间戳后缀（m27/m25 直接可用）；M2 旧 blog slug 仍带后缀。
3. **Kimi 官方索引只挂最近 9 篇的链接**，更早条目（K2-0905 及之前）卡片在列但无 href → 老发布走 HF model card（A 级）或 web.archive.org。
4. **规范生成器**：本批 19 个文件由统一 spec→JSON 生成器产出（字段默认值集中管理，杜绝手写漏字段），生成器与 spec 暂存于系统临时目录未入库；如需固化为仓库工具请主线决定。
5. **表格后挂 K3 列的 K2.6 页**：厂商会回填旧发布页做新版导流（K2.6 页的表被插入 K3 列 + 结论句），取证时以"自家列"取值、注意页面可能非发布时原文。

### 本批新增 benchmark id（notes 均标 new-benchmark，待迁主数据）

`aime-26`、`hmmt-26`、`critpt`、`tool-decathlon`、`tau3-bench`、`vstar`、`widesearch`、`worldvqa`、`aa-lcr`、`ai-office-bench`、`omnidocbench`、`longvideobench`、`swe-dev`、`vibe-pro`、`mm-claw`、`rise`、`gdpval-mm`、`mcp-universe`、`mcp-mark`、`cmo-2025`、`icpc-world-finals-2025`、`ioi-2025`、`simpleqa-verified`、`chinese-simpleqa`、`apex`、`apex-shortlist`、`mrcr-1m`、`corpusqa-1m`、`androidbench`、`qwen-swe-bench`、`qwen-qoder-bench`、`qwen-react-bench`、`qwen-svg-bench`、`qwen-claw`、`claweval`、`skillsbench`、`qwen-webdev-bench`、`qwen-world-bench`、`vitabench`、`kernelbench`、`ifbench`、`plawbench`、`prbench-legal`、`prbench-finance`、`mrcr-v2`、`bbh`、`mmmlu`、`mmlu-prox`、`nova-63`、`include`、`global-piqa`、`wmt24`、`maxife`、`claweval-mm`、`vision2web`、`erqa`、`lvbench`、`realworldqa`（部分与第三批重复引入，合并时按 id 去重）。

### 本批待人工核验清单（pending 升级路径）

1. **qwen3-8-max 表 2**（61 行多模态 DOM 表）：值与表 1 同样机读，本批未转录——最高优先级的低成本补行机会（locator: 页面"模型表现"第二张表）。
2. Kimi K2.6 非 DOM benchmark 组件 8 行 + K2.5 附录表 19 行：从技术报告（arXiv 2602.02276）或页面渲染组件补值。
3. DeepSeek V3.2 三图 12 行 + V4 两图 22 行：人工读图（两文件均有跨厂商互证背书）。
4. 三个 Kimi 5 个协议档案（K2.6 10 次均值 / K2.5 top-p 0.95 + 非思考 SWE / K2-0905 Git 剪枝）如需进 benchmark 详情页的 Protocol Fingerprint 样例，可直接引用。

---


## 2026-09-01 第七批：腾讯混元 + 阶跃星辰（Tier 2 首批入库）

两家 Tier 2 厂商首批入库，7 个 release 文件、196 条 evidence（101 verified + 95 pending）。全部为官方一级来源（GitHub 官方 model 仓 / 官方 research blog / 官方 model blog 页），发布日期全部为官方页印刷日或官方仓创建时间戳（day 精度），OpenRouter created 仅作旁证（hy3 / hy4-preview 与官方完全同日）。本节只追加，不改动既有批次内容。

| 文件 | 发布日期（来源） | 条数 | verified | pending | 抓取路径与要点 |
|---|---|---:|---:|---:|---|
| `tencent/hunyuan-t1.json` | 2025-03-21（腾讯新闻官方通稿 dated 20250321；官方仓 Tencent/llm.hunyuan.T1 创建 2025-03-20T03:33Z，页内不印日期） | 14 | 5 | 9 | README 正文散文 5 个分数机读 verified（MMLU-Pro 87.2 / GPQA-Diamond 69.3 / LCB 64.9 / MATH-500 96.2 / ArenaHard 91.9）；两张 benchmark 表为第三方镜像图床图片（ronggan123/image，官方 README 热链）→ 9 行 pending（视觉转写值进 notes）。README 协议注：竞品列来自官方评测结果、缺项来自混元内部评测平台 → 竞品行不拆。 |
| `tencent/hunyuan-a13b.json` | 2025-06-27（README "Related News" 印刷 2025.6.27；官方仓同日创建） | 44 | 44 | 0 | 全部三张 DOM 机读表 verified：base 表 14 行（TRT-LLM-backend 注明）+ Instruct 表 21 行 + FP8/Int4 量化表 9 行（量化 checkpoint 记 model_variant）。慢思考默认、`/think` `/no_think` 开关披露；竞品列（o1-1217/R1/Qwen3-A22B 等）留 notes。 |
| `tencent/hy3.json` | 2026-07-06（官方 blog 页印刷 2026年7月6日；OpenRouter hy3 同日互证） | 42 | 2 | 40 | JS 渲染 SPA，Playwright 渲染后直读：正文 MRCR 75.1%（preview 42.9% → 75.1%）verified + SWE Bench Verified 仅提及跨脚手架 std≤4pp（not_reported）verified；附录"模型得分"为整图 → 40 行 pending（视觉转写值逐行进 notes，含完整协议注：全模型最高 reasoning tier、SWE 系 swe-agent、TB2.1 Terminus-2、DeepSWE mini-swe-agent、NL2repo Claude Code 250 轮、MCP-Atlas Scale 2026-04 法 100 工具调用 Gemini 2.5 Pro 判官、ClawEval 105 题 Gemini-3.5-flash 判官）。 |
| `tencent/hy4-preview.json` | 2026-08-28（官方 blog 页印刷 2026年8月28日；OpenRouter hy4-preview 同日互证） | 46 | 0 | 46 | 770B/49B、1M 上下文、Apache 2.0。页内无任何机读分数：附录为 4960×10840 单图，46 行全部 pending（视觉转写值进 notes；裁切线上方一行无法辨认、注明未转录）。协议注同样极完整（TB2.1 Claude Code 500 轮 12h、ALE-CLI 官方评测器、SWE-Atlas 256 轮+网络白名单、BioMystery Kimi-K3 判官等）。**release 级 status=pending**（无机读分数）。正文披露：163 专家 203 任务盲测 Hy4 2.99/4 vs GLM 5.3 2.92/4 vs Kimi K3 2.94/4（内部人评，仅 notes）。 |
| `stepfun/step-3.json` | 2025-07-31（官方 research blog 印刷 "July 31th, 2025"；发布会 2025-07-25 与官方仓创建同日，arXiv 2507.19427） | 11 | 11 | 0 | stepfun.ai/research/step3 DOM 大表直读 11 行全 verified（MMMU 74.2 / MathVision 64.8 / SimpleVQA 62.2 / HallusionBench 64.2 / ZeroBench-sub 23.0 / DynaMath 50.1 / AIME25 82.9 / GPQA-D 73.0 / LCB 67.1 / HMMT25 70.0 / CNMO24 83.7）。表注：`*` = 同条件复现；竞品列（o3/Grok 4/Gemini 2.5/R1-0528 等）复现/引用语义已在 notes 区分，不拆行。GitHub README 的 Evaluation Results 是图片（blog DOM 表为同一组数的机读源）。 |
| `stepfun/step-3-5-flash.json` | 2026-01-31（官方仓创建 2026-01-31T02:57Z；OpenRouter 2026-01-29，先行 2 天已注明） | 16 | 16 | 0 | 官方 GitHub model 仓 "Detailed Benchmarks" DOM 表 16 行全 verified（τ²-Bench 88.2 / BrowseComp 51.6 与 69.0 双条件 / BC-ZH 66.9 与 73.7 / GAIA 84.5 / xbench-DeepSearch 2025.05 83.7 与 2025.10 56.3 / ResearchRubrics 65.3 / AIME25 97.3 / HMMT25 Feb 98.4 Nov 94.0 / IMOAnswerBench 85.4 / LCB-V6 86.4 / SWE-V 74.4 / TB2.0 51.0）。表注：`*` = 原始分不可得或低于复现值，按同条件复现报告；Context Manager 语义披露。 |
| `stepfun/step-3-7-flash.json` | 2026-05-29（官方 model blog 页 static.stepfun.com/blog/step-3.7-flash/ 印刷；官方仓 2026-05-27、OpenRouter 2026-05-28） | 23 | 23 | 0 | 官方 blog 三张 DOM 表 + 散文全机读：主表 12 行（HLE w.tool 47.2/text-only 49.7、BrowseComp 75.8、DeepSearchQA F1 92.8 + acc 81.7、ResearchRubrics 71.7、Toolathlon 49.5、ClawEval-v1.1 67.1、SWE-MTLG 72.4、SWE-Pro 56.3、SWE-V 76.5、TB2.1 59.6、AA-LCR avg@16 63.9）+ GDPval 双口径 2 行（Stirrup Elo 1415.8 / 内部结对 ii 45.8%）+ 视觉表 7 行（SimpleVQA 79.16、WorldVQA 58.10、BC-VL 58.96、V* 95.29、HR-Bench 4K 89.13 / 8K 86.34、VisualProbe 65.05）+ 自建 Step-SWE-Bench 六脚手架 avg 67.08 + τ² Telecom 散文">98%"（精确值缺失 → not_reported）。已记录：README 散文 TB2.1 59.5 与 blog 表 59.6 的 0.1 厂内不一致；NVFP4+MTP GPQA 消融 77.81/78.41 留 notes。 |

### 本批关键判定与坑

1. **图片附录 ≠ 不能读**：腾讯 hy.tencent.com 两篇（hy3 / hy4-preview）附录"模型得分"是整图且高达 4960×10840，按库规一律 pending + 视觉转写值进 notes（升级路径=人工读图确认）。但页面正文散文里的分数（hy3 MRCR 75.1）是 DOM 明文 → 直接 verified。JS 渲染站走 Playwright 渲染后 `innerText` 即可全文直读，web-reader 只能拿到 "Loading..."。
2. **日期三源裁定**：hy3 / hy4-preview 官方页印刷日与 OpenRouter created 完全同日（罕见互证）；A13B 官方 README 直接印刷 2025.6.27；T1 页内不印日期，取腾讯新闻官方通稿日期 2025-03-21（官方仓创建 2025-03-20 比 media 早一天，已注明）；step-3-5-flash 无 blog 页，取官方仓创建时间戳（OpenRouter 先行 2 天）。
3. **量化/变体行的归属**：A13B 的 FP8/Int4 量化表按 model_variant 记为独立行（同一 release 内的 checkpoint 变体），不与 BF16 主行合并；step-3.7-flash 的 NVFP4+MTP GPQA 消融只进 notes（是量化 checkpoint 的工程消融，非发布模型主协议成绩）。
4. **同库双证据不许互混**：hy3 页内 TB2.1=71.7 vs hy4 附录复测 Hy3=70.8——腾讯自己注明"因评测 harness/判官/anti-hacking 更新，Hy3 部分分数与此前报告不同"。两值各自留在各自 release，未合并。
5. **step-2 系（含 step-2-16k）未建档**：官方 GitHub org 无 Step-2 仓，开放平台文档已无 step-2-16k 模型页（legacy 下线），现存可查仅媒体转述（tier D，不作证据）且无 OpenRouter 现存记录 → 按库规"无一级来源不建档"，留待 wayback 人工核验后再补占位。本批 stepfun 以 step-3 + step-3.5-flash + step-3.7-flash 三个 release 达成 ≥2 覆盖。
6. **Hy-MT2 / Hy Vision 2.0 / Hyra 等垂直与研究线**：翻译（Hy-MT2，2026-05-21 blog）、视觉、音频、科学智能体（Hyra）不在本批通用 LLM 发布范围，未建档；Hy4 正式版与 Hy3 preview（2026-04-23/22）可作后续增补候选。

### 本批新增 benchmark id（notes 均标 new-benchmark，待迁主数据）

`tencent`: `cfbench`、`cello`、`t-eval`、`crux-i`、`crux-o`（疑为 CRUXEval 输入/输出预测子任务，待人工确认与 cruxeval 的关系）、`cmath`、`olympiadbench`、`fullstackbench`、`sysbench`、`lengthctrl`、`insctrl`、`complexnlu`、`word-task`、`complexfuncbench`、`c3-bench`、`matharena-apex`、`arxivmath`、`cmt-benchmark`、`superchem`、`brokenarxiv`、`harbor-index`、`swe-atlas-refactoring`，及腾讯自建内部集 `hy-backend-2-0`、`hy-swe-max`、`hy-companybench`、`e-bench`、`e-bench-code`、`hy-finagentbench`、`hy-finmodelbench`、`hy-lifesearch`、`hy-browsecomp-pro2`、`hy-euler-pro`、`hy-skillsworld`、`hy-math`；
`stepfun`: `researchrubrics`、`swe-mtlg`（页面缩写，疑同 SWE-bench Multilingual，待人工确认合并）、`bc-vl`（疑 BrowseComp-VL）、`hr-bench`、`visualprobe`、`step-swe-bench`（阶跃自建）。
复用已登记 id 映射：`tau2-bench`（τ²-Bench）、`hlehle`（HLE 双条件分行）、`lcb`（202408-202505 / V6 记 variant）、`mrcr`、`cl-bench`（life 记 variant）、`horizonmath`（pass@12 / pass@4 分 variant）、`claw-eval`（v1.1 / pass^3 记 variant）、`gdpval-aa`（V2 Elo / Stirrup / 内部结对分 variant）、`toolathlon`（Verified 记 variant）、`swe-atlas-codebase-qna` / `swe-atlas-test-writing`、`one-million-bench`、`agents-last-exam`、`critpt`、`biomysterybench`、`bankertoolbench`、`jobbench`、`workspace-bench`、`automationbench`（v1.0.6）、`cybergym`、`program-bench`、`posttrain-bench`（V1.1）、`draco`、`zerobench`（sub）、`dyna-math`、`hmmt25`（Feb / Nov）、`cnmo-2024`、`mathvision`、`hallusionbench`、`simplevqa`、`worldvqa`、`vstar`、`aa-lcr`、`skillsbench`、`wildclawbench`、`apex-agents`、`mcp-atlas`、`widesearch`、`deepsearchqa`、`browsecomp(-zh)`、`gaia`、`xbench-deepsearch`、`ifeval`、`officeqa-pro`、`usamo-2026`、`frontier-science-research` / `frontier-science-olympiad`、`phybench`、`imo-answerbench`、`supergpqa`、`mmlu-redux`、`multipl-e`、`evalplus`、`mbpp`、`bbh`、`drop`（F1）、`zebralogic`、`chinese-simpleqa`、`ceval`、`cmmlu`、`aime24` / `aime-25`、`math500`、`math`、`gsm8k`、`gpqa`、`mmlu` / `mmlu-pro`、`bfcl`（v3）、`tau-bench`、`artifactsbench`、`mmmu`、`arenahard`、`swebench(-multilingual/-pro)`、`terminalbench`、`nl2repo`、`deepswe`。

### 本批待人工核验清单（pending 升级路径）

1. **腾讯 hy3 附录图 40 行 + hy4-preview 附录图 46 行**：视觉转写值已逐行写入 notes（含每行协议），人工读图确认后即可翻 verified——两个文件均有完整协议注背书，是最高性价比的补 verified 机会。
2. **Hunyuan T1 表图 9 行**：官方 README 热链的第三方镜像图床（ronggan123/image），转写值在 notes；确认后翻 verified。
3. **`crux-i`/`crux-o`/`swe-mtlg`/`bc-vl` 四个疑似等价 id**：与 `cruxeval` / `swebench-multilingual` / BrowseComp-VL 的合并关系待主线裁定。
4. **step-2 系**：wayback 核验后决定是否建占位（当前无一级来源，未建）。

---

## 账本契约修订（2026-09-02）：models[] 规格与能力概述字段

时间轴事件卡升级为「标题直链发布文 + 规格行（参数/上下文/价格/模态）+ 能力概述 + 核心特点标签 + 评测 chips」结构。为此 `models[]` 条目新增**可选**字段：`params` / `context_window` / `pricing{input_per_m, output_per_m, currency, note}` / `modalities` / `capability_summary` / `key_traits`。

- 扩展为增量可选：不改变任何既有证据字段的语义；`validate-data` 不拒未知键，无需改校验器。
- 存量 82 个 release 允许做「**仅新增 models[] 字段**」的补全（规格与概述只写发布文/归档明示内容），不触碰 `benchmark_evidence`——此为本契约唯一的存量扩展例外。
- `capability_summary` 由入库流程结合发布文定位与已收录评测数据撰写（口径见 `.claude/skills/ingest-releases/references/release-schema.md`）；构建期对无概述的存量发布自动派生「领域分布」兜底句，保证卡片永远有可读概述。
