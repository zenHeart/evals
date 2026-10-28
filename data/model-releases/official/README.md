# Official Model Release Evidence — P0-EVID-002 种子数据

本目录存放按 `_docs/goal.md` §11.4（Model Release Schema）与 §11.5（Evidence Edge Schema）抽取的官方模型发布 benchmark 证据。来源等级 A（厂商官方发布页），检索/核验日期统一为 **2026-08-31**。

## 汇总

> **当前总量检查点（2026-10-23）**：200 releases = 186 official + 14 legacy · 3094 evidence edges。每批落地后更新此行。

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

---

## 2026-09-02 第八批：首次增量入库（ingest-releases 技能首次实战）+ Microsoft 新厂商接入

技能驱动批次：窗口 = 检查点锚点 2026-08-28 回退 14 天重叠 → 2026-09-02（首批检查点同步建立：`data/generated/ingest-checkpoint.json`）。5 个 release / 34 条 evidence（21 verified + 13 pending）。发布日期全部精确到日。**Microsoft（MAI 线）为新增厂商**：vendors.json 注册（Tier 2）+ 官方四色方块 logo（microsoft.com favicon 128×128）+ LOGO_EXT/DOMAINS/渠道表四登记。

| 文件 | 发布日期（来源） | 条数 | verified | pending | 要点 |
|---|---|---:|---:|---:|---|
| `anthropic/claude-fable-5-1.json` | 2026-09-01（newsroom 索引印刷 Sep 1 + Anthropic statement） | 10 | 10 | 0 | **benchmark 表为 DOM 机读（与 Fable 5 代"总表是图片"相反），全行 verified 零 OCR**；Fable 5.1（GA）+ Mythos 5.1（同模型 trusted-access 档，TB 4.0 60.9 独立边）；TBS 52.6（vs Fable 5 的 24.7）、GDPval-AA v2 1853、OSWorld 2.0 77.9/41.7 双划分、CursorBench 3.2.0 73.4、AutomationBench 31.4、HLE 双条件 65.0/60.9（no-tools 行 tools=[]）；定价 $10/$50 + 缓存读 $0.25（页明文）；platform.claude.com 区域屏蔽致 1M 上下文/128K 输出未能二次独立复核（specs_provenance 留痕） |
| `deepseek/deepseek-v4-pro.json` | 2026-08-13（slug 260813 + Change Log） | 10 | 0 | 10 | GA 正式版（与 04-24 预览 deepseek-v4.json 分立）；**benchmark 表整图 → 全 pending**，视觉转写双路径逐行一致且三处跨档互证（HLE 37.7/48.2 = 预览版 verified 值；TB2.1 Flash-0731 82.7 = 260821 表；DeepSWE Kimi-K3 67.5 = GLM-5.2 页）；表注 Code Agent 协议（Harness 极简/max/topp 0.95/temp 1.0）只写入 4 个明示行；Responses API + 思考三档 + 峰谷定价（08-17 生效，价格为图未结构化）；新实体 dsbench-fullstack |
| `qwen/qwen3-8-max-0902.json` | 2026-09-02（官方微博文章 publishedTime 11:22 + 平台别名 qwen3.8-max-2026-09-02 双 A 级互证） | 1 | 1 | 0 | Coding/Cowork 后训练更新（kimi-k2-0905 独立建档先例）；CodeArena 1691（提升 22 夺冠，benchmark_owner_reported 第三方榜单口径）；模型页 DOM 机读定价 ¥12/¥36 每百万 tokens 入结构字段（公告 $5/M 综合均价并存 notes）；公告图 3 为 17 行完整对比表 → 按红线未入账本，已标记为最高优先级人工读图补行机会 |
| `microsoft/mai-thinking-1.json` | 2026-08-12（publishedTime 16:00Z + 页头 Updated as of） | 8 | 3 | 5 | 新厂商首个 release；散文 AIME25 97.0 / AIME26 94.5 verified + SWE-Pro "toe-to-toe with Opus 4.6"（not_reported，Opus 5 先例）；Table 1 整图 → 5 行 pending（hmmt-26/gpqa Diamond/lcb v6/TB 2.0/SWE-V），转写只进 notes 且跨厂锚点命中（GPT 5.4 SWE-Pro 57.7 / TB 75.1 = OpenAI 自报值）；specs：~1T 总参 35B 激活 MoE、256K；散文/图表同事实双行已归并（3 个 -table 边并入基准行，转写保留） |
| `microsoft/mai-code-1-1-flash.json` | 2026-08-11（GitHub changelog + 发布文页头 + 卡 Release date 三证） | 5 | 5 | 0 | Model Card PDF 文本层干净（pypdf 无粘连）→ SWE-V 72.6 / TB2.1 62.9 全 verified（同 Copilot harness 自报，1.0 基线 71.6/51.7 入 notes）；内部视觉三行 text2webapp 74.1 / screenshot2webapp 42.1 → new-benchmark 候选未建实体（vendor-internal 无公开定义）；vision2web L3 映射既有实体（置信度中，notes 声明复核路径）；定价 $0.20/$1.20（docs.github.com tier A）+ 缓存 $0.02；1.0 版 09-10 退役 |

### 本批待人工核验清单（pending 升级路径）

1. **DeepSeek V4-Pro GA 表 10 行**：视觉转写已双路径一致 + 三处跨档互证，人工读图确认后逐行翻 verified——本批性价比最高的升级机会。
2. **MAI-Thinking-1 Table 1 五行**：转写在 notes（GPQA Diamond 行 MAI 84.2 垫底与页面 "leads" 表述张力最大，需优先复核）；图内脚注协议（agentic 256k 上下文 / 其余 max output 256k）确认后回填 protocol.token_budget。
3. **Qwen 0902 公告图 3（17 行完整对比表 + 12 条协议脚注）**：最高优先级补行机会（locator 已标记）；榜单名口径（CodeArena 前端总榜 vs 图题 WebDev）待裁定。
4. 跨页冲突待裁定：Fable 5 的 GDPval-AA（本页 v2 1723 vs 06-09 页 1932 未标版本）；DeepSWE Kimi-K3 列 67.5 vs Kimi 脚注 67.3（既有冲突）。
5. specs 局限：Fable 5.1 的 1M 上下文/128K 输出经 platform.claude.com 区域屏蔽未能二次独立复核（manifest.specs_provenance 留痕）。

### 本批跳过清单

GLM-5.3-Max（既有 GLM-5.3 展示名非独立发布）；GLM-5.3 开源权重（既有 release 属性事件，走 revisions[] 待补）；Kimi K3-Max（launch 变体）；Gemini 3.8 Flash（内测）；xAI Grok 4.7（未发布无一级来源）；OpenAI Astra（官宣未发布）；Qwen4 架构预览（结构预告非模型发布）；Google Omni 1.1 Flash / Gemini 3.5 Transcribe（音视频垂直）；MiniMax H3 Max / Music 3.0（视频/音乐垂直）。

### 本批新沉淀（技能回写点）

- **DOM 表会代际变化**：Anthropic 新发布页已改用 DOM 机读表格——不能凭厂商历史形态预设图片行，逐页实抓判定（本批若按旧预设全部记 pending 将错失 10 个 verified）。
- 「散文+图表同事实双行」按「一个 benchmark 行 = 一条 evidence」归并进基准行（转写保留于 notes）。
- 模型页/定价页 DOM 明示优先于 null（Qwen ¥12/¥36 定价入结构字段，综合均价口径并存 notes）。


---

## 2026-09-04 第九批：前沿模型增量入库（Google Gemini 3.8 Flash + OpenAI GPT-6 Astra）

基于 /ingest-releases 技能扫描窗口（2026-08-19 ~ 2026-09-04）及 WebSearch 深度核验，增量收录两家 Tier 1 厂商最新发布：2 个 release / 6 条 evidence（全部为 verified）。发布日期全部精确到日，官方一级来源。

| 文件 | 发布日期（来源） | 条数 | verified | pending | 要点 |
|---|---|---:|---:|---:|---|
| `google/gemini-3-8-flash.json` | 2026-09-02（blog.google 印刷 Sep 2, 2026 + AI Studio / API 发布公告） | 3 | 3 | 0 | **Gemini 3.8 Flash + 3.8 Flash Cyber 专精安全双模型发布**；Terminal-Bench 2.1 达到 90.8%（较 3.7 Flash 提升 9.2pp）、SWE-Bench Pro 61.6%、SWE-Atlas 51.9%；维持 $0.75/$3.75 促销定价平价升级；Cyber 变体面向 Fairwind 计划认证受信任防御团队受控分发。 |
| `openai/gpt-6-astra.json` | 2026-09-03（openai.com/index/gpt-6-astra/ 官方博文 + Preparedness 框架 Critical 等级披露） | 3 | 3 | 0 | **OpenAI 首款 Preparedness 评定达 Critical 级别的旗舰前沿模型**；主打原生计算机操作（GUI 像素/键鼠直接控制）、长程自主 Agent 与零日漏洞分析（Daybreak 计划受限保护）；ARC-AGI-3 报告 99.9% 饱和得分（官方注明使用带 retained reasoning 与 compaction 的 Agentic Harness，标准官方 harness 评测约为 62.7%，两者协议不可互换）；FrontierMath Tier 4 97.6%；ExploitBench 达成 16 级完整利用阶梯 100% 推进；定价 $10/$50 每百万 tokens。 |

### 本批关键判定与说明
1. **ARC-AGI-3 协议差异**：Astra 报告的 99.9% 明确绑定 OpenAI 自研带有 retained reasoning 与 compaction 的 agentic harness，标准官方 harness 值为 62.7%。根据仓库纪律，自报值如实记录，并在 notes 和 protocol 字段中详尽披露，禁止与标准 harness 直接混比。
2. **安全双刃剑评测**：Astra 在 ExploitBench 达到 100% 推进，同时 Preparedness 评级达到 Critical，相关攻击性利用能力受到严格的受限访问机制控制，反映了 2026 年下半年大模型评测从纯功能评测向安全防护双重评估演进的特征。

### 本批跳过清单
MiniMax humain-m3（阿语垂直区域合作模型）；WeatherNext 3（天气物理垂直模型）；其余在册厂商在此窗口内无新通用前沿模型发布。

---

## 2026-09-11 第十批：前沿与轻量模型增量入库（Meta Muse Spark 1.3 + DeepSeek-V4.1-Flash）

基于 /ingest-releases 技能扫描窗口（2026-08-20 ~ 2026-09-11）及全在册厂商（Tier 1 与 Tier 2）官方渠道深度核验，增量收录两家 Tier 1 厂商最新发布：2 个 release / 11 条 evidence（全部为 verified）。发布日期全部精确到日，官方一级来源。

| 文件 | 发布日期（来源） | 条数 | verified | pending | 要点 |
|---|---|---:|---:|---:|---|
| `meta/muse-spark-1-3.json` | 2026-09-02（research.meta.ai 官方博文 + Cursor / API 上线公告） | 4 | 4 | 0 | **Meta 专为长程软件工程与智能体工作流优化的多模态前沿模型**；较 1.2 版本减少 20% 工具调用与 25% 输出 token；DeepSWE v1.1 75.4%、Terminal-Bench 2.1 88.8%、SWE-Atlas Codebase QnA 59.4%、1M 上下文 MRCR v2 98.1%；首个入驻 Cursor IDE 的 Meta 模型；定价 $1.25 / $4.25 每百万 tokens。 |
| `deepseek/deepseek-v4-1-flash.json` | 2026-09-10（api-docs.deepseek.com news260910 官方文档公告 + Hugging Face 官方 Model Card） | 7 | 7 | 0 | **DeepSeek 全新因果编解码器（Causal Encoder-Decoder）架构首款 MoE 模型**；总参 552B 仅激活 8B 输入与 16B 输出，KV Cache 显存需求降至 1/4；Terminal-Bench 2.1 90.6%、GPQA Diamond 90.9%、DeepSWE v1.1 74.2%、CyberGym 88.1%、MathArena Apex 65.6%、HLE (w/ tools) 63.9%、Automation-Bench 54.8%；全面接管并下线 V4-Pro，维持峰谷减半优惠定价。 |

### 本批关键判定与说明
1. **CED 架构与长程智能体评测演进**：DeepSeek-V4.1-Flash 作为新架构首发，将重点从单纯纯文本参数竞赛转向极致端到端推理经济性与智能体长程闭环，在 Terminal-Bench 2.1（90.6%）与 DeepSWE v1.1（74.2%）上均达到同等规模顶尖水平，且直接宣布替代下线旧旗舰 V4-Pro，是业内罕见的"轻量模型逆袭旗舰"实例。
2. **Meta Muse 编码专精迭代**：Muse Spark 1.3 延续 Meta 在终端编码代理（Muse Code）领域的自研 harness 协同调优，官方披露的 20% 工具调用缩减与 25% token 节约直接反映在 SWE 评测的完成率与效率指标上。
3. **新增候选 benchmark id**：`matharena-apex` 标注 `new-benchmark`，在未正式建实体前通过候选机制参与外键校验与对账。

### 本批跳过清单
OpenAI GPT-Live-1（2026-09-10 语音垂直 API 模型）；Google Lyria 3.5（音乐模型）；xAI Grok Bot Enterprise / Haggle Bot（企业应用层无新模型发布）；MiniMax humain-m3（阿语垂直合作模型）与 H3 Max Turbo（视频预览）；字节跳动豆包手机与输入法（端侧硬件/工具更新，豆包 2.2 推迟）；小米 MiMo-X Preview（邀测无公开基准页）；Mistral Shieldstral（安全分类器）。其余在册厂商在此窗口内无新通用大模型发布。

---

## 2026-09-12 第十一批：小米全系列大模型（MiLM-6B / MiMo-7B / MiMo-V2-Flash / MiMo-V2.5-Pro）官方补齐与时间轴控制台交互重构

响应深度审查建议，彻底解决厂商覆盖盲区与时间轴 UI 冗余：
1. **小米官方大模型全生命周期补齐**：废除空占位符 `legacy/xiaomi.json`，补齐自 2023 年至 2026 年 4 款官方主力模型（MiLM-6B、MiMo-7B-RL、MiMo-V2-Flash、MiMo-V2.5-Pro），共 28 条官方核验基准证据；在 `data/vendors.json` 中将小米晋升为 Tier 1 完整覆盖厂商；更新高清矢量 SVG 原标（原研哉 2021 Kenya Hara 经典 squircle 矢量标 `assets/logos/xiaomi.svg`）。
2. **时间轴交互式控制台 UI 重构**：消除原页面顶部静态「收录的厂商与发布数」展示条与下方过滤按钮并存的视觉与信息冗余，将厂商 Logo、品牌名与发布数角标直接整合至可点击的过滤芯片（`.vchip`）中，按发布数降序排列，实现「一处兼具全景盘点与交互过滤」。

| 文件 | 发布日期（来源） | 条数 | verified | pending | 要点 |
|---|---|---:|---:|---:|---|
| `xiaomi/milm-6b.json` | 2023-08-11（GitHub XiaoMi/MiLM-6B 开源发布） | 2 | 2 | 0 | 小米首款开源自研 6.4B 轻量大模型；C-Eval 总榜第十、同参数量级第一（60.2%），CMMLU zero-shot 60.37%。 |
| `xiaomi/mimo-7b.json` | 2025-04-30（Hugging Face XiaomiMiMo/MiMo-7B-RL + arXiv:2505.07608） | 7 | 7 | 0 | 小米强化学习对齐开源模型；MMLU 70.3%、MATH-500 71.2%、GSM8K 87.8%、LiveCodeBench 32.4%、HumanEval 76.2%。 |
| `xiaomi/mimo-v2-flash.json` | 2025-12-18（GitHub XiaomiMiMo/MiMo-V2-Flash + HF） | 4 | 4 | 0 | 小米稀疏 MoE 超快大模型（总参 309B / 激活 15B）；主打极速首词响应与高吞吐；MMLU 82.6%、GSM8K 94.2%、HumanEval 82.5%。 |
| `xiaomi/mimo-v2-5-pro.json` | 2026-03-19（GitHub XiaomiMiMo/MiMo-V2.5-Pro + arXiv:2603.14201） | 15 | 15 | 0 | 小米万亿级旗舰 MoE 基础大模型（总参 1.02T / 激活 42B / 1M 上下文）；全面对标前沿：MMLU 89.4%、MMLU-Pro 68.5%、GSM8K 99.6%、MATH 86.2%、GPQA Diamond 66.7%、SWE-bench Verified 78.9%、C-Eval 91.5%、BBH 88.4%。 |


---

## 2026-09-20 第十二批：窗口扫描零入库（窗口 2026-09-11 ~ 2026-09-20）

按 `ingest-releases` 技能扫描窗口（锚点 2026-09-10 回退 14 天重叠 → 2026-09-20 today），全在册厂商（Tier 1 + Tier 2）官方渠道深度核验 + OpenRouter 目录交叉核对，结果：**本批零新增 release 文件**。下方列出已检索的渠道与结论以备主线核对。

### 扫描范围与渠道

| 厂商 | 一级来源 | 窗口内结论 |
|---|---|---|
| openai | openai.com/news/ + sitemap release | 无。09-11 ~ 09-20 期间均为企业产品 / 合作伙伴公告（Astra for Law / Australian Youth Safety Blueprint / ChatGPT for Financial Services / Scaling Storage 1B+ Users 等），无新通用前沿模型。GPT-6 Astra 已于 09-03 入账（第十批）。 |
| anthropic | anthropic.com/news + newsroom 索引 | 无。09-11 ~ 09-20 期间为 partner / program 公告（Accenture 嵌入式评测合作 Sep 18 / Life Sciences Verification Program Sep 17 / Frontier AI Development Metrics Sep 17），Fable 5.1 / Mythos 5.1 已于 09-01 入账（第八批）。 |
| google | blog.google/technology/ai/ | 无窗口内新帖；Gemini 3.8 Flash + Flash Cyber 已于 09-02 入账（第九批）。 |
| xai | x.ai/news | 09-18 Grok Voice Transcribe 2.0（语音转文本，垂直模型，跳过）；其余为 Grok Bot / Memory in Grok Build（产品功能，非模型发布）。Grok 4.7 原定 09-12 发布后被推迟，无官方 release 页。 |
| meta | research.meta.ai | 无窗口内新帖；Muse Spark 1.3 已于 09-02 入账（第十批）。 |
| kimi | kimi.ai/blog/ 索引 + HF moonshotai | 索引最近条目为 Kimi K3（2026-07-16），窗口内无新帖。 |
| deepseek | api-docs.deepseek.com/zh-cn/news/ + HF | 窗口内无新 slug（slug 含日期 `news250910` 即 V4.1-Flash 已于 09-10 入账）；官方文档首页明示 `deepseek-flash` = DeepSeek-V4.1-Flash 重命名（第八批验证：旧名 `deepseek-v4-flash` / `deepseek-v4-flash-vision-exp` 已退役，请求由 V4.1-Flash 服务）。 |
| glm | z.ai/blog/ | z.ai 主站最近为空（首页博客列表最近条目为远古占位）；HF `zai-org` 仅有 GLM-5.3 / GLM-5.3-Flash / GLM-5.3-Flash-BF16，无 FlashX 新模型仓。 |
| minimax | minimax.io/news/ | 窗口内无新 LLM 发布；最新 LLM 仍为 M3，新闻条目为 08-26 First Half 2026 Financial Results / 08-03 H3 开源（视频垂直）。 |
| qwen | qwen.ai/research + HF Qwen | 索引页抓取异常（响应过大未返具体项）；HF 列表最近条目为 MiMo 系或 Qwen3.8 系已入账；OpenRouter 旁证 `qwen/qwen3-coder-flash`（09-17）无可溯源发布页，跳过。 |
| doubao | seed.bytedance.com/en/blog/ | 窗口内为 SeedRealtime 语音多模态 / Seedance 2.5 视频 / Seed Audio 1.0 / Seedream 5.0 Pro 图像，均垂直模型，按规则跳过。 |
| xiaomi | mimo.xiaomi.com + HF XiaomiMiMo + GitHub XiaomiMiMo | 无窗口内新模型。GitHub `XiaomiMiMo/MiMo-Code`（CLI 工具，非模型）09-20 更新；HF 模型列表最近仍为 MiMo-V2.5 / V2-Flash（07-09）。README 中提及的「MiMo-X-Pro-Preview / MiMo-X-Flash-Preview」属 MiMo Desktop beta 试用，非公开通用发布。 |
| tencent | hy.tencent.com（JS SPA） | 无窗口内新发布（hy4-preview 2026-08-28 + hy3 2026-07-06 已入账）。 |
| stepfun | stepfun.ai/research（503）+ HF stepfun-ai | research 页 503 不可达；HF stepfun-ai 仓目录最近条目 step-3.7-flash 已入账。 |
| microsoft | microsoft.ai/news + GitHub microsoft | 无窗口内新 MAI 模型。已有 MAI-Thinking-1 / MAI-Code-1.1-Flash 已入账（第八批）。 |
| mistral | mistral.ai/news | 窗口内仅 Mozilla / Cloudera 合作公告（非模型），最新模型发布仍为 Devstral 2 / Mistral 3（前批入账）。 |

### OpenRouter 旁证窗口（2026-08-27 ~ 2026-09-20 全部 created 时间戳）

36 个上架条目按 vendor 分布：

- **已入账主项**（已映射到现有 release）：claude-fable-5.1 / gemini-3.8-flash / muse-spark-1.3 / muse-spark-1-3-contributor / qwen3.8-max-0902 / gpt-6-astra / gpt-6-astra-pro / deepseek-v4.1-flash / hy4-preview —— 9 条
- **变体 / alias 条目**（已并入既有 release 的 `models[]`）：`~z-ai/glm-flash-latest`、`~openai/gpt-{luna,terra,sol,astra}-latest`、`~deepseek/deepseek-{flash,pro}-latest` —— 6 条
- **新厂商但未达一级来源门槛**：ibm-granite/granite-4.2-8b（IBM Granite）、inception/mercury-2.5、sakana/fugu-max + sakana/fugu-ultra-v2、inclusionai/ling-3.0-flash-{fin,sante,vl}、nex-agi/nex-n2.5-{pro,mini}、prism-ml/ternary-bonsai-2-27b、unbiased/pareto、inference-net/schematron-v2-{small,turbo} —— 12 条
- **Tier 1 已注册但无官方页**：z-ai/glm-5.3-flashx（GLM 5.3 Flash 增量变体，无官方博客 / HF 仓）—— 1 条
- **垂直 / 非通用**：OpenAI `:batch` 系列（5 条）—— 5 条

### 跳过清单（带理由）

| 模型 / 厂商 | 跳过原因 |
|---|---|
| GLM 5.3 FlashX | OpenRouter 上架（1789744020 = 2026-09-17）但无 z.ai 官方博客 / HF zai-org 仓；属「无一级来源不建档」 |
| OpenAI GPT-6 Astra Pro | OpenRouter 上架（09-09）但 openai.com/index/gpt-6-astra-pro/ 404；视为 Astra 系列变体，已在 `openai/gpt-6-astra.json` 中以 `models[]` 形式覆盖（待主线追加 `revisions[]` 留痕） |
| xAI Grok 4.7 | 原定 09-12 发布后被推迟（Elon Musk X 帖说明 RL response-length penalty / verification rigor 不足），x.ai/news 无条目；二级数字（τ²-Bench 98% / GDPval-AA 1500 等）按 tier D 不录 |
| Grok Voice Transcribe 2.0 | xAI 09-18 发布，语音转文本垂直模型，不建 release 档 |
| ByteDance SeedRealtime / Seedance 2.5 / Seed Audio 1.0 / Seedream 5.0 Pro | 全部为音视频 / 图像垂直模型，按「非通用模型不建档」规则跳过 |
| IBM Granite 4.2-8B | 未注册厂商（需新厂商接入：vendors.json + 真实彩色 logo + DOMAINS + LOGO_EXT + Tier 2 渠道登记），留待主线排期 |
| Inception Mercury 2.5 / Sakana Fugu Max + Ultra v2 / Inclusion AI Ling 3.0 Flash 三个变体 / Nex AGI Nex-N2.5 Pro + Mini / PrismML Ternary Bonsai 2 27B / Unbiased Pareto / Inference.net Schematron V2 Small + Turbo | 全部为新厂商，无官方一级来源页 + 未在 vendors.json 注册；按「无一级来源不建档」+ 「新厂商接入需人工核验」双重规则跳过 |
| MiniMax H3 / Music 3.0 / Speech 2.8 / Code / Design | MiniMax 窗口内仅有视频 / 音乐 / 语音垂直 + 工具产品，非通用 LLM 发布 |
| OpenAI GPT Luna / Terra / Sol / Astra :latest | `:latest` 别名条目，非新模型发布；对应主模型（GPT-5.5 / GPT-5.4 / GPT-5.6 / GPT-6 Astra）已分别入账 |
| DeepSeek `deepseek-flash` 重命名 | DeepSeek 官方文档首页明示旧名 `deepseek-v4-flash` / `deepseek-v4-flash-vision-exp` 退役，请求由 V4.1-Flash 服务（第八批 deepseek-v4-1-flash.json 已覆盖）；无需新增 release |
| 小米 MiMo-X-Pro-Preview / MiMo-X-Flash-Preview | 仅 MiMo Desktop beta 试用渠道；非公开通用发布页；按「无一级来源不建档」跳过 |
| 小米 MiMo-Code CLI | GitHub 仓库（CLI 工具，非模型），按「非模型发布」跳过 |

### 动作与门禁

- **release 文件变更**：无新增、无修改、无删除；账本契约「只追加」严格执行。
- **vendor 注册变更**：无；新增厂商（IBM Granite / Inception / Sakana / Inclusion AI / Nex AGI / PrismML / Unbiased / Inference.net）待主线排期后单独批次接入（需 logo / DOMAINS / LOGO_EXT 四登记）。
- **checkpoint**：账本最大 release_date 仍为 2026-09-10（DeepSeek V4.1-Flash）。锚点不前进；下次扫描窗口仍为 2026-08-27 ~ 下次扫描日（窗口起点回退 14 天重叠）。
- **门禁**：`validate-data` PASS（143 releases / 2544 evidence edges）；`npm run build` PASS（32 章 / EPUB 484KB / 460 benchmark 实体页 / sitemap 497 URL / validate-site 全绿）；CI 待 push 后查。

### 跨批遗留观察（不改动既有文件，仅报告）

1. `gpt-6-astra.json` 当前 models[] 仅含基础 Astra；OpenRouter 上的 `gpt-6-astra-pro` 变体（09-09 上架）建议在下次 Astra 页更新时合并到该文件 models[] 并补 `revisions[]` 留痕（与 claude-opus-4-7-fast 并入 claude-opus-4-7.json 同口径）。
2. 8 家新厂商首次出现于 OpenRouter 目录但未在 vendors.json 注册——本批未触发新厂商接入流程（避免单批工作过宽），列为主线单独批次候选。
3. xAI Grok 4.7 推迟状态未知，若后续发布需重新进入窗口扫描。

---

## 2026-09-20 第十三批：窗口扫描零入库（窗口 2026-08-27 ~ 2026-09-20）

按 `ingest-releases` 技能扫描窗口（锚点 2026-09-10 回退 14 天重叠 → today 2026-09-20），全在册厂商（Tier 1 + Tier 2）官方渠道深度核验 + OpenRouter 目录交叉核对 + HuggingFace 官方 org `createdAt` 时间戳反查 + DeepSeek news slug 直探（news260831 / news260901 / news260905 / news260910 / news260915 / news260920）→ **本批零新增 release 文件**。本节只追加，不改动既有批次内容。

### 扫描范围与渠道（增量于第十二批）

| 厂商 | 一级来源 | 窗口内结论 |
|---|---|---|
| openai | openai.com/news/ + sitemap release | 无新通用前沿模型。窗口内均为企业产品/合作伙伴公告，与第十二批结论一致；GPT-6 Astra 已于 09-03 入账（第九批）。 |
| anthropic | anthropic.com/news + newsroom 索引 | 无。Fable 5.1 / Mythos 5.1 已于 09-01 入账（第八批）。 |
| google | blog.google/technology/ai/ | 无窗口内新帖；Gemini 3.8 Flash + Flash Cyber 已于 09-02 入账（第九批）。 |
| xai | x.ai/news（web reader 直读） | 09-18 **Grok Voice Transcribe 2.0**（语音转文本垂直，跳过）；其余为 Grok Bot / Memory in Grok Build（产品功能）。Grok 4.7 仍推迟，无官方 release 页。 |
| meta | research.meta.ai | 无窗口内新帖；Muse Spark 1.3 已于 09-02 入账（第十批）。 |
| kimi | kimi.ai/blog/ 索引 + HF moonshotai | 索引最近条目仍为 Kimi K3（2026-07-16），窗口内无新帖。 |
| deepseek | api-docs.deepseek.com news slug 直探 + HF deepseek-ai | news260910 (V4.1 Flash 官宣) 唯一窗口内正式发布，已入账（第十批）。news260831/news260901/news260905 均 200 但实际重定向至 API 调用文档首页（无独立内容）；news260915/news260920 同样 200 但无新发布。**`deepseek-ai/DeepSeek-V4-Flash-Vision-Exp` HF repo (2026-08-31 createdAt) 是 V4-Flash 的实验视觉变体权重，按 news260910 同步退役**（官方文档明示"旧版本模型 V4 Flash 与 V4 Flash Vision Exp 现已下线"），与第十二批 deepseek-flash 重命名同口径——不建档，HF 权重作为退役实验存档。 |
| glm | z.ai/blog/ + HF zai-org createdAt | 窗口内 HF `zai-org/GLM-5.3 / GLM-5.3-Flash / GLM-5.3-BF16` 三仓均为 2026-08-25（早于窗口起点 08-27），无新仓。z.ai 主站博客列表为空。 |
| minimax | minimax.io/news/ + HF MiniMaxAI | 窗口内无新 LLM 发布；HF 最新仍为 MiniMax-M3（2026-06-02）。MiniMax-H3（2026-07-28，视频垂直）+ MiniMax-Music3（2026-08-07，音频垂直）均为垂直模型，跳过。 |
| qwen | HF Qwen createdAt | 窗口内 HF 唯一新仓 `Qwen/Qwen-Drive-1.0-4B`（2026-08-27 createdAt）属自动驾驶垂直模型（tags: autonomous-driving / motion-planning / 3d-perception），按「非通用模型不建档」跳过。Qwen3.8-Max-0902 (09-02) 已入账（第八批）。 |
| doubao | seed.bytedance.com/en/blog/ | 窗口内为 SeedRealtime 语音多模态 / Seedance 2.5 视频 / Seed Audio 1.0 / Seedream 5.0 Pro 图像，均垂直模型，跳过（与第十二批一致）。 |
| xiaomi | mimo.xiaomi.com + HF XiaomiMiMo + GitHub XiaomiMiMo | 无窗口内新通用模型。GitHub MiMo-Code CLI 更新（09-20，非模型）。MiMo-X-Pro-Preview / MiMo-X-Flash-Preview 仍为 MiMo Desktop beta 试用。 |
| tencent | hy.tencent.com + HF tencent createdAt | 窗口内 HF 新仓 4 个：`tencent/EVIE-8B / EVIE-4.5B`（2026-09-04，ColPali-style visual document retrieval，垂直）+ `tencent/WeVisDoc-2B / WeVisDoc-4B`（2026-09-16，arxiv 2609.20423 论文产物，无腾讯官方博客）。全部按「非通用模型 / 无一级来源」跳过。Hy4-preview (08-28) 已入账（第七批）。 |
| stepfun | stepfun.ai/research + HF stepfun-ai | research 页 503 不可达；HF 最新仍为 Step-3.7-Flash（2026-05-23）。 |
| microsoft | microsoft.ai/news + GitHub microsoft | 无窗口内新 MAI 模型。已有 MAI-Thinking-1 / MAI-Code-1.1-Flash 已入账（第八批）。 |
| mistral | mistral.ai/news | 窗口内仅 Mozilla / Cloudera 合作公告（非模型）。 |

### OpenRouter / HF 反查交叉核对（本批新增的二次扫描）

- **OpenRouter**：与第十二批相比无新增窗口内可入账主项；`:latest` 别名与变体条目已映射；8 家新厂商（IBM Granite / Inception / Sakana / Inclusion AI / Nex AGI / PrismML / Unbiased / Inference.net）维持第十二批记录。
- **HF `createdAt` 反查 14 个在册厂商**（Qwen / zai-org / MiniMaxAI / moonshotai / deepseek-ai / ByteDance-Seed / stepfun-ai / tencent 等）：窗口内 `createdAt` 在 2026-08-27 ~ 2026-09-20 的新仓共 9 个（Qwen-Drive-1.0-4B / GLM-5.3 系三个 / MiniMax-Music3 / DeepSeek-V4-Flash-Vision-Exp / DeepSeek-V4.1-Flash / tencent-EVIE 8B/4.5B / tencent-WeVisDoc 2B/4B）。逐一按"通用 + 一级来源"双门禁过滤：通用垂直（如 Drive / Music3 / EVIE / WeVisDoc）按"非通用"过滤；GLM-5.3 系 createdAt 在 08-25（窗口外）；DeepSeek-V4-Flash-Vision-Exp 按退役口径过滤；最终可入账数 = 0。

### 跳过清单（带理由，与第十二批差异在本批用"补"标注）

| 模型 / 厂商 | 跳过原因 |
|---|---|
| DeepSeek-V4-Flash-Vision-Exp | **补**：HF 官方仓（2026-08-31 createdAt）作为实验性多模态权重存档存在；但 news260910 同步宣布其下线，请求路由至 V4.1-Flash——按第十二批 deepseek-flash 重命名同口径「无新增 release」处理 |
| tencent/EVIE-8B / EVIE-4.5B | ColPali-style 视觉文档检索模型（pipeline_tag=visual-document-retrieval），base=Qwen3.5，垂直 |
| tencent/WeVisDoc-2B / WeVisDoc-4B | 视觉文档理解模型（arxiv 2609.20423 论文产物），无腾讯官方博客 / newsroom 一级来源 |
| Qwen/Qwen-Drive-1.0-4B | 自动驾驶垂直模型（tags: autonomous-driving / motion-planning / 3d-perception） |
| MiniMax-Music3（2026-08-07） | 文本到音频垂直模型（pipeline_tag=text-to-audio），早于窗口但同口径 |
| zai-org/GLM-5.3 / 5.3-Flash / 5.3-BF16 | createdAt 2026-08-25 在窗口起点 08-27 之前，已被 GLM-5.3 / GLM-5.3-Flash release 覆盖 |
| xAI Grok Voice Transcribe 2.0（09-18） | 语音转文本垂直 API 模型 |
| xAI Grok 4.7 | 09-12 原定发布后被推迟，无官方 release 页 |
| ByteDance SeedRealtime / Seedance 2.5 / Seed Audio 1.0 / Seedream 5.0 Pro | 全部音视频/图像垂直模型 |
| OpenAI / Microsoft / Mistral / Stepfun / Meta / Kimi / Google | 窗口内无新通用前沿模型发布 |
| IBM Granite / Inception / Sakana / Inclusion AI / Nex AGI / PrismML / Unbiased / Inference.net（OpenRouter 新厂商） | 无官方一级来源 + 未在 vendors.json 注册，留待主线单独批次接入 |

### 动作与门禁

- **release 文件变更**：无新增、无修改、无删除；账本契约「只追加」严格执行。
- **vendor 注册变更**：无。
- **checkpoint**：账本最大 release_date 仍为 2026-09-10（DeepSeek V4.1-Flash）。锚点不前进；下次扫描窗口仍为 2026-08-27 ~ 下次扫描日（窗口起点回退 14 天重叠）。
- **门禁**：`validate-data` PASS（taxonomy 9 类 / vendors 16 / benchmarks 460 / releases 143（official 129）/ evidence edges 2544）；`npm run build` PASS（32 章 / EPUB / 460 benchmark 实体页 / sitemap / validate-site 全绿）；CI 待 push 后查。

### 跨批遗留观察（不改动既有文件，仅报告）

1. `gpt-6-astra.json` models[] 仍仅含基础 Astra；OpenRouter 上的 `gpt-6-astra-pro` 变体建议下次 Astra 页更新时合并 + 补 `revisions[]` 留痕（沿用 claude-opus-4-7-fast 并入先例）。本批维持第十二批观察。
2. 8 家新厂商（IBM Granite / Inception / Sakana / Inclusion AI / Nex AGI / PrismML / Unbiased / Inference.net）首次出现于 OpenRouter 目录但未在 vendors.json 注册——本批维持留待主线单独批次接入，建议新增批次按 `references/discovery-channels.md` 末节"新厂商接入"流程执行（vendors.json + 真实彩色 logo + DOMAINS + LOGO_EXT + 渠道表）。
3. xAI Grok 4.7 推迟状态未知；本体批 web reader 直读 x.ai/news 仅见 Grok Voice Transcribe 2.0 与产品功能，无新通用前沿发布。
4. **本批新增观察（HF `createdAt` 反查工艺）**：对全 14 家在册厂商 HF org 调用 `api/models?author=<org>&full=true&limit=N` 拉取 createdAt 倒序前 N → 筛窗口内 → 按"通用 + 一级来源"双门禁过滤，可作为窗口扫描的二次复核手段。本批应用该工艺确认无新增；建议技能脚本 `ingest-releases/scripts/checkpoint.mjs` 后续扩展 `hf-since` 子命令（仅作交叉核对、不写账本）。

---

## 2026-09-20 第十四批：Step 5 Preview 增量入库 + 历史 8 条一级源合规审计与修复

> **核心变化**：本批在第十三批零入库基础上，**新增 1 个真实发布的旗舰模型**（StepFun Step 5 Preview）；同时按用户反馈"历史数据获取逻辑只有真实有 blog 和发布说明才算"，对全 129 条官方账本做反向审计，发现 **12 条 release 在 `primary_sources` 上违反"无官方一级来源不建档"红线**，其中 4 条（grok-4-3 / grok-4-20 / qwen3-6-flash / qwen3-7-flash）已是 xAI 静默代际先例下的 pending 零行占位（合规），8 条仍带 homepage URL 或归属已不存在 — 全部按既定先例在 `revisions[]` 留痕下处置。

### 增量入库：StepFun Step 5 Preview（2026-09-19）

#### 来源与抓取

- **官方一级页**：`https://www.stepfun.com/step-5-preview`（Next.js SPA；WebFetch 仅返回站壳 "阶跃星辰"，Playwright DOM 渲染后读全文）。
- **官方开发者文档**：`https://platform.stepfun.com/docs/zh/guides/models/step-5-preview`。
- **模型规格（页面上明示）**：稀疏 MoE / 600B 总参 / 27B 激活 / 1M Token 上下文 / 文本 + 视觉输入 / 开源时间 2026-10-15。
- **AA Intelligence Index**：44。
- **归档**：`models/2026-09-20-step-5-preview/{page.html, index.md, manifest.json}`（HTML 全文 DOM 转录，4 节表格 + 8 项脚注 + 长程案例文字）。

#### evidence 收口

| 项 | 数 |
|---|---:|
| 评测行（DOM 表机读，非图表） | 40 |
| verified | 40 |
| pending | 0 |
| benchmark 个体数 | 32（其中 frontierfinance 为本批新建实体） |

> 表内 8 个对比对手列（GLM-5.3 / Kimi K3 / GPT-6 Astra / Claude Fable 5.1 / Claude Opus 5 / DeepSeek V4.1 Flash）的散文明示分数按 `comparison_cited` 单独行处理（如已存在则不重复入账）；GDPval-AA v2 与 AA-Briefcase 按厂商脚注口径"采用 Artificial Analysis 截至 2026-09-19 最新结果"记 `third_party_reported` 而非 vendor_reported。

#### 协议字段说明

- **DeepSWE v1.1** 行 page 注明用 **SWE-agent harness**、**temperature=1.0**、**top_p=0.95**，已结构化写入 `protocol.harness` / `temperature` / `top_p`，`comparison_scope:"only_same_protocol"`。
- **HLE w/ tools** 行 page 脚注明示 Step 5 Preview (High) 与 GLM-5.3 (Max) 在**纯文本子集**上评测、其余模型在完整数据集上评测——不同评测设置不直接可比，已在每行 `notes` 与 release 级 `notes` 注明，并写 `protocol.tools: ["browser", "code_execution"]` 锁定 harness 范围。

#### 新增 benchmark 候选（标记 `new-benchmark`，兜底页自动生成）

`roadmapbench`、`stepcodebench`（含 Daily / General 子集）、`finstepbench-livesearch`、`finstepbench-corporatevaluation`、`finstepbench-financedr`、`frontierfinance`（**本批同步新建 benchmark 主数据 `data/benchmarks/frontierfinance.json`**，因为页面给出 220 题 / 11,543 项评估标准的完整定义，足够写 `interpretation`）、`gdp-pdf`。其余 6 个新候选仅留 evidence 行的 `new-benchmark:` 标记，待证据充足时再升格实体。

### 历史账本反向审计（129 → 130）

> 用户在第十四批启动时反馈："你看下历史数据获取逻辑只有真实有 blog 和发布说明才算 比如 stepfun"——按此口径对全 129 条 official release 做 `primary_sources` 字段反向扫描，发现 **12 条违反"无官方一级来源不建档"红线**。

#### 12 条问题 release 分类

| 厂商 | release | 状态 | 处置 |
|---|---|---|---|
| xai | grok-4-3 | 已有 pending 零行占位（README 已说明） | 合规 |
| xai | grok-4-20 | 已有 pending 零行占位（README 已说明） | 合规 |
| qwen | qwen3-6-flash | 已有 pending 零行占位 | 合规 |
| qwen | qwen3-7-flash | 已有 pending 零行占位 | 合规 |
| glm | glm-4 (2024-01-16) | `primary_sources` 用了 `https://zhipuai.cn/`（首页） | **REPAIR-URL-NO-EVIDENCE**：URL 改为 `https://www.zhipuai.cn/zh/news/8`（首届智谱 AI 技术开放日成功举办，Playwright 确认存在），但该页是发布会回顾**未列出 MMLU/GSM8K/HumanEval/MATH/C-Eval 等具体分数**，所有 evidence 行标 `not_extracted` + `status:"pending"` |
| kimi | kimi-chat-200k (2023-10-09) | `primary_sources` 用了 `https://www.moonshot.cn/`（首页） | **REPAIR-URL-NO-EVIDENCE**：URL 改为 `https://www.moonshot.ai/blog/kimi-200k-context-release`（WebFetch 确认为官方 200k 发布文），但 evidence 行未列具体分数，全部标 `not_extracted` + `status:"pending"` |
| stepfun | step-1 (2024-03-23) | `primary_sources` 用了 `https://www.stepfun.com/`（首页） | **NO-SOURCE**（Playwright 访问 `stepfun.com/step-1` 返回 404"页面不存在"）：按 xAI 静默代际先例转为 pending 零行占位 |
| stepfun | step-2 (2024-07-04) | `primary_sources` 用了 `https://www.stepfun.com/`（首页） | **NO-SOURCE**（Playwright 访问 `stepfun.com/step-2` 返回 404"页面不存在"）：同上 |
| kimi | kimi-k0-math (2024-10-11) | `primary_sources` 用了 `https://www.moonshot.cn/`（首页） | **NO-SOURCE**（moonshot.cn/blog 与 moonshot.ai/blog 均无对应 slug）：同上 |
| minimax | minimax-abab-6 (2024-01-16) | `primary_sources` 用了 `https://www.minimaxi.com/`（首页） | **NO-SOURCE**：同上 |
| minimax | minimax-text-01 (2025-01-16) | `primary_sources` 用了 `https://www.minimaxi.com/`（首页） | **NO-SOURCE**：同上 |
| doubao | doubao-1-5-pro (2024-12-20) | `primary_sources` 用了 `https://www.volcengine.com/`（首页） | **NO-SOURCE**（seed.bytedance.com/blog 无匹配 slug）：同上 |

#### 处置语义（两种标准模式）

- **REPAIR-URL-NO-EVIDENCE**（glm-4 / kimi-chat-200k）：URL 改为官方一级发布文，但页面正文不含 evidence 行所引用的具体评测分数；所有 evidence 行的 `value` 改 `null`、`display` 改 `"—"`、`score_status` 改 `"not_extracted"`、`status` 改 `"pending"`、`source_url` 同步更新、`last_verified_at` 同步到 2026-09-20。release 级 `status` 同步转 `pending`。
- **NO-SOURCE**（6 条）：Playwright 实测 `<vendor>/<slug>` 预测 URL 返回 404 或不存在；以 xAI 静默代际先例处置：`primary_sources = []`、`benchmark_evidence = []`、`status = "pending"`、`last_verified_at = 2026-09-20`。

#### 全部变更走 `revisions[]` 留痕（账本契约「只追加」）

每条处置都在对应 release 的 `revisions[]` 追加 `{date: "2026-09-20", field, from, to, reason}`，明确记录"主页 URL → 真实发布文 / 或 pending 占位"的迁移路径与原因，未直接删除任何 release / benchmark 文件。

### 动作与门禁

- **release 文件变更**：新增 1（step-5-preview）；修改 8（审计处置，全部走 revisions[]）；删除 0。账本契约「只追加」严格执行。
- **新增 benchmark 实体**：1（`frontierfinance.json`）。
- **新 benchmark 候选（仅 `new-benchmark` 标记，未建实体）**：7（`roadmapbench` / `stepcodebench` 三变体 / `finstepbench-livesearch` / `finstepbench-corporatevaluation` / `finstepbench-financedr` / `gdp-pdf`）。
- **vendor 注册变更**：无。
- **checkpoint**：账本最大 release_date 推进至 **2026-09-19**（Step 5 Preview）；下次扫描窗口仍为 2026-08-27 ~ 下次扫描日（窗口起点回退 14 天重叠）。
- **门禁**：`validate-data` PASS（taxonomy 9 类 / vendors 16 / benchmarks 461 / releases 144（official 130）/ evidence edges 2572）；`npm run build` PASS（32 章 / EPUB / 461 benchmark 实体页 + 7 auto-evidence 页 / sitemap 498 URLs / validate-site 全绿）；CI 待 push 后查。

### 跨批遗留观察（不改动既有文件，仅报告）

1. **审计工艺沉淀**：本批发现 `primary_sources` 反向扫描是低成本高收益的合规工具（一次扫描 129 条 release 仅 12 条违规，命中率 9% 但都是高危）。建议加入 `ingest-releases/scripts/checkpoint.mjs` 作为 `audit-sources` 子命令，每次扫描自动执行。
2. **首页 URL 反查规律**：用户提示的 `<vendor-domain>/<model-slug>` URL 模式对部分厂商适用（如 stepfun.com/step-5-preview、stepfun.com/step-1/2 反例）；不适用时依赖官方 newsroom 索引或 RSS 互证。建议把"URL 预测 → 404 验证 → 切下一渠道"的失败级联逻辑沉淀进 `references/discovery-channels.md`。
3. **8 条历史 pending 占位的恢复路径**：6 条 NO-SOURCE 当前无任何可发布物，按现有结构保持；2 条 REPAIR-URL-NO-EVIDENCE（glm-4 / kimi-chat-200k）的具体评测分数可能在厂商技术报告 / 论文中可考，未来若取得真实来源，再走 `revisions[]` 翻 verified。
4. **`reference` JSON 字段统一**：本批 step-5-preview.json 在 evidence 行的 `metric` 字段做了一致化尝试（accuracy / pass_rate / partial_score / index），与既有 `mmlu` / `cybergym` 等 evidence 行的 `metric:"accuracy"` 约定一致；建议技能 schema 文档补一句"`metric` 必填且与 ENUM 对齐"。

---

## 第十五批（2026-09-22 增量入库）：前沿自主 Agentic 与全模态语音交互 — xAI / 阿里通义千问 / Google DeepMind

> 本批入库扫描窗口自 2026-09-05 至 2026-09-22，覆盖 3 家主流厂商共 3 场最新官方模型发布，共入库 18 项基准评测证据（18 项 verified，0 项 pending），将官方发布时间轴推进至 **2026-09-21**。

| 指标 | 本批值 |
|---|---:|
| 新增 release 文件 | 3 |
| benchmark_evidence 条数 | 18 |
| 行 status=verified | 18 |
| 行 status=pending | 0 |
| release status=verified | 3 |
| verified ∧ vendor_reported（计入自报） | 15 |
| third_party_reported（榜单转述） | 3（Grok AA-Briefcase / LatchBio、Gemini AA-Speech-to-Speech） |

### 逐 Release 清单

| 文件 | 来源 URL | 条数 | verified | pending | release status | 抓取路径与说明 |
|---|---|---:|---:|---:|---|---|
| `xai/grok-4-7.json` | x.ai/news/grok-4-7 | 9 | 9 | 0 | verified | 官方新闻页 DOM 表格机读，披露 2.1T 参数、500K 上下文及长程强化学习自主任务分数（CursorBench 4.0 46.3%、DeepSWE v1.1 71.0%、Terminal-Bench 4.0 38.0% 等） |
| `qwen/qwen3-8-omni-flash.json` | qwen.ai/blog?id=qwen3.8-omni-flash | 5 | 5 | 0 | verified | 官方发布文披露原生全模态与 Agentic 评测分值（UniClawBench 69.6、OmniVideoBench Agentic 67.8 / Static 63.4、WildClawBench-MM +36.5、AgenticVBench +22.3） |
| `google/gemini-3-8-live.json` | blog.google/technology/ai/gemini-3-8-live/ | 4 | 4 | 0 | verified | 官方发布文披露原生语音对话与 Extended Thinking 后台推理评测（AA Speech-to-Speech Index 82.6 #1、Tau-Voice 68.6%、Sierra Banking 35.1%、BigBench Audio 97.7%） |

### 新增 benchmark 候选（标记 `new-benchmark`，兜底页自动生成）

- `eebench`：EEBench 电气工程学科领域推理基准
- `latchbio`：LatchBio 生物安全能力基准
- `hackerbench`：HackerBench v0.3 双重用途网络攻击风险测试
- `uniclawbench`：UniClawBench 原生全模态智能体任务基准
- `wildclawbench-mm`：WildClawBench-MM 音视频交互复杂评测
- `agenticvbench`：AgenticVBench 长程视频智能体基准
- `aa-speech-to-speech`：Artificial Analysis Speech-to-Speech Quality Index 语音对话质量指数
- `tau-voice`：Tau-Voice 语音智能体任务完成率基准
- `tau-voice-banking`：Sierra 银行电话客服高合规自主任务基准
- `bigbench-audio`：Big Bench Audio 复杂音频推理与理解基准

### 动作与门禁

- **release 文件变更**：新增 3（grok-4-7、qwen3-8-omni-flash、gemini-3-8-live）；修改 0；删除 0。账本契约「只追加」严格执行。
- **vendor 注册变更**：无（三家均为既有 Tier 1 注册厂商）。
- **checkpoint**：账本最大 release_date 推进至 **2026-09-21**（Grok 4.7）；checkpoint 检查点已 commit。
- **门禁**：`validate-data` PASS（taxonomy 9 类 / vendors 16 / benchmarks 461 / releases 147（official 133）/ evidence edges 2590）；`npm run build` PASS（32 章 / EPUB / 461 benchmark 实体页 + 17 auto-evidence 页 / validate-site 225 时间轴 1843 事件全绿）。

---

## 第十六批（2026-09-22 增量入库）：小米 MiMo-V2.6 系列

> 扫描窗口 2026-09-07 ~ 2026-09-22（锚点 2026-09-21 回退 14 天）。第十五批已入库 Grok 4.7 / Qwen3.8-Omni-Flash / Gemini 3.8 Live。本批新增 1 个 release。

| 指标 | 本批值 |
|---|---:|
| 新增 release 文件 | 1 |
| benchmark_evidence 条数 | 37 |
| 行 status=verified | 37 |
| 行 status=pending | 0 |
| release status=verified | 1 |
| verified ∧ vendor_reported | 35 |
| third_party_reported | 2（AA Intelligence Index v4.3 46.32；GDPVal 2.1 AA Elo 1673） |

### 逐 Release 清单

| 文件 | 来源 URL | 条数 | verified | pending | release status | 抓取路径与说明 |
|---|---|---:|---:|---:|---|---|
| `xiaomi/mimo-v2-6.json` | mimo.xiaomi.com/mimo-v2-6 | 37 | 37 | 0 | verified | 外壳页只有 iframe。正文在 `/mimo-v2-6/article.html`。附录表由同页 `bench.js` 渲染进 DOM（脚本头注明快照 2026-09-22），按表内 Pro / Flash 两列逐行收录。发布日以页眉 `<time datetime="2026-09-22">` 为准，与开放平台更新日志同日；HF publishedTime 与 OpenRouter created 为 2026-09-21T20:36Z，对应北京时间 9 月 22 日 |

### 规格与协议

- 参数与上下文不在发布正文里，取发布页链接的官方模型卡：Pro `1.02T` 总参 / `42B` 激活，Flash `309B` 总参 / `15B` 激活，上下文都是 `1M`，模态为文本、图像、视频、音频。
- 定价取发布页表格（美元 / 百万 token，cache miss）：Flash `$0.14 / $0.28`，Pro `$0.435 / $0.87`，UltraSpeed `$4.35 / $8.7`。UltraSpeed 是 Pro 的高速输出模式（页面写同等质量、最高约 20 倍），没有单独分数。
- 评测表没有逐行协议。模型卡部署建议 `temperature=1.0`、`top_p=0.95` 不写入 protocol。
- DeepSWE v1.1 正文训练终点（Pro 72.57、Flash 65.68）与附录表（71.9、67.9）分开记行。
- MiMo Cyber Bench 的 Pro 列：附录表 81.7，Pro-RL / Flash-RL 两张模型卡都印 80.2，各记一行。Flash 两边都是 77.2，不重复。
- `bench.js` 里 GLM 5.3 列标了 `table: false`，没有渲染进附录表，不转录。

### 新增 benchmark 候选（标记 `new-benchmark`，兜底页自动生成）

- `mimo-code-bench`：页面标注 in-house 的编码集
- `mimo-visual-coding`：页面标注 in-house 的视觉编码集
- `mimo-cyber-bench`：页面标注 in-house 的安全集

三页都没有足够的题量、切分和计分定义，本批不建 benchmark 实体。

### 跳过清单

| 模型 / 厂商 | 跳过原因 |
|---|---|
| GLM-5.3-FlashX（2026-09-18） | 官方文档写成 Flash 的高速服务档（同权重、约 200 token/s），不是新模型 |
| GPT-Live-1（2026-09-10） | 语音对话模型，垂直 |
| Qwen 实时语音 / Qwen-Image-2.1 / LiveTranslate | 语音或图像垂直；Qwen3.8-Omni-Flash 已在第十五批 |
| Grok 4.7、Gemini 3.8 Live、Step 5 Preview、DeepSeek V4.1 Flash | 已在账本 |
| OpenAI / DeepSeek 的 `*-latest` 别名 | 路由别名，不是新发布 |
| Kimi | 博客索引与开放平台更新日志在窗口内只有 Web Search API 等产品变更，没有新模型发布文 |
| MiniMax | 厂商页最新模型发布仍是 2026-06 的 M3 |
| MiMo-V2.6-Distill-Qwen-9B | 同日出现在 HF collection，发布文未列，不单建档 |
| PrismML / Unbiased / Sakana / InclusionAI / Inception / Nex AGI / Inference.net / Atria / TypeSafe / Wispr / Cognition | OpenRouter 或聚合站在窗口内有条目，厂商未在 `vendors.json` 注册。沿第十三批，留待单独接入，本批不建档 |

### 动作与门禁

- **release 文件变更**：新增 1（mimo-v2-6）；修改 0；删除 0。
- **vendor 注册变更**：无（xiaomi 已是 Tier 1，徽章用既有彩色 `xiaomi.svg`）。
- **checkpoint**：账本最大 release_date 推进至 **2026-09-22**（MiMo-V2.6）。
- **门禁**：`validate-data` PASS（taxonomy 9 类 / vendors 16 / benchmarks 461 / releases 148（official 134）/ evidence edges 2627）；`npm run build` PASS（32 章 / EPUB / 461 benchmark 实体页 + 20 auto-evidence 页 / sitemap 498 URLs / validate-site 226 时间轴 1860 事件全绿）。

### 跨批遗留观察

1. 发布页柱状图替代文本把 AA Intelligence Index 写成 46，正文是 46.32。收录正文数字，图不另记。
2. 模型卡 DeepSWE 的 GPT-5.6 Sol 列为 73.0，发布页附录该列为空。竞品列写在该行备注里，不另建 evidence。


## 第十七批：需求选型与专项模型回填（2026-09-23）

关联 Issue #1 / #2。增量窗口为 2026-09-08～2026-09-23，同时独立回填历史官方链接；旧批次跳过记录保留为历史，不再作为现行排除规则。

| 发布 | 官方发布日期 | 新增 evidence | 取证说明 |
|---|---|---|---|
| Gemma 4 | 2026-04-02 | 60 verified | 公告的 E2B/E4B/26B MoE/31B Dense 四变体；分数来自本次模型卡快照，不冒充首发日数据；后增 12B Unified 独立留在回填队列 |
| Seedance 2.5 | 2026-07-31 | 0 | landing page 与官方博客互证；保留 pending 档案，不臆造基准 |
| Kimi K2.8 Preview | 2026-09-11 | 0 | Kimi Code 更新日志；版本档案与 kimi-for-coding 服务别名分开 |
| Grok Voice Transcribe 2.0 | 2026-09-18 | 1 verified | 正文短语集 WER 6.8%，自建集、越低越好；小时价格不混入 token 价格 |
| Qwen-Image-2.1 | 2026-09-20 | 1 pending | 实际浏览器读取动态正文；7B 只指视觉生成组件；评测图未转录为数值，资源抓取 9 项失败有记录 |
| Claude Opus 5.5 | 2026-09-22 | 11 verified | 官方 DOM 表及正文；max/xhigh/medium 条件分行，注明安全策略介入后的回退模型；客户轶事不作公开基准 |

本批新增 **6 releases、73 evidence = 72 verified + 1 pending**。数据总量 **154 releases（official 140）/ 2700 evidence**；既有 release 未改写。新 benchmark id：`bbeh`、`covost`、`qwen-image-bench`、`grok-short-phrases`，沿用自动证据页；AIME 2026 和 MedXPertQA MM 归入既有 `aime-26` / `medxpertqa-mm`。CoVoST 未明确版本，不能猜成 CoVoST2。

每家 active vendor 的入口、HTTP/渲染失败、发现候选、已有 release 对应和后续回填状态写入 `data/model-coverage.json`。这是可复现的入口覆盖审计，**不是“全部历史模型已经入库”**：动态索引、历史分页、官方组织页的线索和尚未核验模型仍显式列为缺口。垂直分类不再阻止建档；产品候选也不会仅凭标题自动认定为模型。

归档均在 `models/`，manifest 包含相对路径与 SHA-256；新增回归测试会检查所有本批文件哈希。四个 Gemma 变体按 `model_id` 绑定分数，Qwen pending 成绩不能进入分数筛选；未完整披露协议的证据不进入跨模型综合排序。

门禁：本地测试、数据校验、书籍校验、EPUB/站点构建及站点链接校验通过；真实浏览器完成四视角复核，修复单次清除、解析后状态同步、多变体标识与窄屏溢出。最终测试数、构建计数与远端状态见 `docs/issues-1-2-acceptance.md`，本地通过不等同远端 CI 或部署通过。

## 第十八批：厂商模型全量防遗漏审计与专项模型补齐（2026-09-23）

针对为什么对于厂商会遗漏类似 `gamma4`（Gemma 4）等开源/多模态/专项模型的根因进行深度技术复盘与技能重构，全面优化 `ingest-releases` 发现渠道、正则模式与跨域对账机制，并补齐在册厂商的 8 个官方发布档案。

### 为什么此前会遗漏类似 Gemma 4 的深度复盘

1. **增量滑动窗口机制的“历史断层”**：`checkpoint.mjs` 默认以上次最高发布日回退 14 天作为扫描窗口（如 09-08～09-23）。而 Gemma 4 发布于 2026-04-02，在日常增量扫描中已被永久排除在窗口之外。缺乏存量回填审计机制导致历史模型一旦未及时录入便永久滑脱。
2. **厂商多产品线/子系列的单一入口盲区**：此前配置常把厂商等同于单一旗舰品牌（如 Google 仅配置 Gemini，未配置开源权重体系 Gemma；字节跳动仅配置豆包主站，未覆盖 Seedance / Seedream / SeedRealtime / Seed Audio 等多模态前缀；微软未覆盖 MAI 系列落地页；Kimi 未覆盖海外与开源权重页）。
3. **客户端 SPA 动态渲染与静态抓取的“失明”断层**：`scan.mjs` 静态 GET 遇到现代前端直接标记 `needs_render` 却未自动降级触发浏览器抓取，导致部分厂商长期处于“伪扫描”状态。
4. **标题与正则过滤的硬编码误杀**：旧过滤规则强制匹配死板的模型名称正则，导致大量标准发布通告（如包含性能断言或产品线命名的标题）被直接过滤。
5. **对专项模态模型的收录偏见**：此前惯性聚焦纯文本通用 LLM，使得图像设计（Seedream）、全双工实时音视频（SeedRealtime）、语音识别转录（MAI-Transcribe）与文档解析（Mistral OCR）等专项模型容易被边缘化。
6. **一页多变体与后增变体的核查疏漏**：官方模型卡包含多个尺寸规格变体时，易出现提取疏漏或后增变体冲突。

### 本批新增入库官方发布清单

| 发布 | 官方发布日期 | 归档路径 | 取证与核心规格说明 |
|---|---|---|---|
| Seedream 5.0 Pro | 2026-07-08 | `models/2026-07-08-seedream-5-0-pro/` | 字节跳动高品质图像生成与专业设计理解大模型，支持精准图文排版与多风格创作；官方博客页面印刻日期取证 |
| Seed Audio 1.0 | 2026-07-20 | `models/2026-07-20-seed-audio-1-0/` | 字节跳动全场景音频创作与声音生成模型，覆盖高保真语音合成与音效生成；官方博客印刻日期取证 |
| SeedRealtime | 2026-08-05 | `models/2026-08-05-seedrealtime/` | 字节跳动原生音视频全双工端到端交互大模型，超低延迟统一架构；官方博客印刻日期取证 |
| Mistral Small 4 | 2026-03-16 | `models/2026-03-16-mistral-small-4/` | Mistral 官方高效轻量模型，专为高通量低成本推理优化；官方新闻 March 16, 2026 印刻日期取证 |
| Mistral OCR 4 | 2026-06-23 | `models/2026-06-23-ocr-4/` | Mistral SOTA 级文档智能与 OCR 专项模型，专为复杂版面与表格抽取优化；官方新闻 June 23, 2026 取证 |
| Muse Image and Muse Video | 2026-07-07 | `models/2026-07-07-muse-image-video/` | Meta Superintelligence Labs 打造的图像生成与长镜头视频生成模型系列；官方博客 July 7, 2026 印刻日期取证 |
| MAI-Transcribe-2 | 2026-08-20 | `models/2026-08-20-mai-transcribe-2/` | 微软端到端高精度语音识别与转录模型，具有业界顶尖的多语言辨识精度；微软新闻与模型落地页互证 |
| MAI-Image-2.6 | 2026-08-25 | `models/2026-08-25-mai-image-2-6/` | 微软旗舰图像生成与编辑模型，支持复杂排版与高保真美学渲染；微软新闻与模型落地页互证 |

### 技能重构与规则升级

1. **升级 `release-discovery.mjs`**：重构 `discoverLinks`，放宽硬编码正则，支持发布动作词、多模态专项词与 URL 路径特征双重提取；升级 `classifyTitle` 精准辨识产品、专项模态与通用模型。
2. **升级 `scan.mjs`**：添加浏览器标准 User-Agent 请求头，支持自动跟踪 301/302 重定向并维护规范 URL，自动为产品型候选注入排除原因。
3. **升级 `reconcile-coverage.mjs`**：支持跨域同名 slug 别名对齐（自动将 kimi.com 与 kimi.ai、微软模型落地页别名进行归一绑定）；修复 Windows 反斜杠路径校验。
4. **扩充 `model-coverage.json` 厂商入口矩阵**：补齐 Google Gemma 专用入口、微软 MAI 模型索引、字节跳动多模态 Landing Pages，修复陈旧失效链接。
5. **同步镜像**：执行 `npm run sync:skills`，保证 `.claude/skills/` 与 `.agent/skills/` 保持完全单向镜像对齐。

### 门禁与验证

- **release 数量**：总 release 162 个（official 148 个，本批新增 8 个），evidence 2700 条。
- **自动化测试**：`node --test tests/*.test.mjs` 19 项测试全通过。
- **数据层校验**：`node scripts/validate-data.mjs` PASS。
- **全站构建与校验**：`npm run build` PASS（32 章 / EPUB / 721 个 HTML 页面 / 32431 个内部引用无死链 / 228 个时间轴 / 1913 个事件卡片校验全部通过）。

## 第十九批（2026-09-23 增量入库）：OpenAI GPT-6 Sol 与 GPT-6 Luna 官方发布

> 本批入库扫描窗口自 2026-09-08 至 2026-09-23，聚焦 OpenAI 于 2026-09-22 发布的 GPT-6 家族核心扩展模型 GPT-6 Sol 与 GPT-6 Luna。共入库 1 个官方 release、16 项基准评测证据（16 项 verified，0 项 pending），将官方发布时间轴推进至 **2026-09-22**。

| 指标 | 本批值 |
|---|---:|
| 新增 release 文件 | 1（`openai/gpt-6-sol-and-luna.json`） |
| benchmark_evidence 条数 | 16 |
| 行 status=verified | 16 |
| 行 status=pending | 0 |
| release status=verified | 1 |
| verified ∧ vendor_reported（计入自报） | 16 |

### 逐 Release 清单

| 文件 | 来源 URL | 条数 | verified | pending | release status | 抓取路径与说明 |
|---|---|---:|---:|---:|---|---|
| `openai/gpt-6-sol-and-luna.json` | `https://openai.com/index/introducing-gpt-6-sol-and-luna/` | 16 | 16 | 0 | verified | 官方博客发布正文散文与无障碍 DOM SVG 矢量图表数据双向对账；披露 1.05M 上下文、API 降价 50%（Sol $2/$10、Luna $0.10/$0.50）与 90% 提示词缓存折扣。自动化评测覆盖企业流程（AutomationBench）、专业长程工作流（Agents' Last Exam）、真实代码合并（FrontierCode）、软件工程（DeepSWE）、真实 GUI 计算机操作（OSWorld）与内部对齐/事实性 |

### 规格与协议

- **双模型差异化定位**：GPT-6 Sol 定位为高性价比工作马模型（面向日常复杂编码、长流程自主 Agent 与专业工作流）；GPT-6 Luna 定位为超高吞吐、极致低成本轻量模型（面向路由、提取、分类与高频摘要）。两模型均支持 1.05M 上下文。
- **评测成绩亮点**：
  - **AutomationBench 1.0.6**：GPT-6 Sol (xhigh) 达到 33.2%（成本 $0.27），超越 Claude Opus 5 max effort (26.9%, $3.05) 与 Claude Fable 5.1 w/ fallback (31.4%, $2.45)，成本仅为其约 9%；GPT-6 Luna (high) 达到 14.5%（成本 $0.021），max 达到 20.7%（成本 $0.037）。
  - **Agents' Last Exam V1**：GPT-6 Sol (max) 达到 56.4%（成本 $2.93），超越 Claude Opus 5 峰值 (55.9%, $7.29)；Luna (max) 达 50.9%（成本 $0.15）。
  - **DeepSWE 1.1**：GPT-6 Sol (max) 达 68.8%（成本 $2.74），距 Claude Fable 5 峰值 (69.9% at xhigh, $13.41) 仅差 1.1 个百分点且成本降低约 80%；Luna (max) 达 66.6%（成本 $0.22），匹敌 Opus 5 与 Fable 5 的 medium effort 表现。
  - **FrontierCode 1.1 Main**：GPT-6 Sol (max) 达 49.3%（成本 $2.14），xhigh 达 48.4%（成本 $1.37），以远低于 Claude Fable 5.1 xhigh ($9.27, 48.7%) 的成本匹敌其表现；Luna 达 42.4%。
  - **OSWorld 2.0 offline**：GPT-6 Sol (xhigh) 达 60.5%（成本 $2.21），匹敌 Claude Opus 5 medium (60.3%, $12.67) 且成本降低约 80%，max 达 64.4%（成本 $3.25）；Luna (max) 达 52.7%（成本 $0.27），超前代主力 GPT-5.6 Sol medium (49.7%, $2.73) 且成本仅为其十分之一。
  - **事实性与对齐**：Internal Factuality 错误率 Sol 为 4.5%（较 GPT-5.6 Sol 8.4% 减半）、Luna 为 7.6%（低成本匹敌前代 Sol）；Internal Coding Deception 欺瞒率 Sol 为 1.3%、Luna 为 2.8%（显著低于前代 10.4% / 9.5%）。

### 新增 benchmark 候选（标记 `new-benchmark`，兜底页自动生成）

- `openai-factuality`：OpenAI 官方内部事实准确度评测（用户反馈标记错误对话集，衡量含事实错误回答比例，越低越好）
- `openai-coding-deception`：OpenAI 官方对齐评测（内部编码欺瞒率，刻意诱导不诚实任务下的欺瞒率，越低越好）

### 跳过清单

| 模型 / 厂商 | 跳过原因 |
|---|---|
| 腾讯混元图像 3.5 预览版（Hy Image 3.5 Preview，2026-09-22） | 图像垂直生图模型，官方通稿披露设计师 GSB 盲测提升 30% 与 API 定价，未披露外部公开定量基准分数 |
| Mistral | 9 月无新基础模型发布，主要为 30 亿欧元 D 轮融资与 Mozilla 合作 |
| DeepSeek | 9 月 10 日发布 V4.1 Flash 之后无新发布（V4.1 Pro 筹备中） |
| GLM / 智谱 | GLM-5.3-FlashX 为生产推理加速服务档（同权重、约 200 token/s），非新基座模型（第十六批已记跳过） |
| ByteDance | 豆包 / Seed 体系持续动态迭代，9 月无新代际发布 |
| Meta | Muse Spark 1.3（09-02）已在先前批次捕获，窗口内无新增基座 |

### 动作与门禁

- **release 文件变更**：新增 1（`openai/gpt-6-sol-and-luna.json`）；修改 0；删除 0。账本契约「只追加」严格执行。
- **vendor 注册变更**：无（OpenAI 为既有 Tier 1 注册厂商）。
- **checkpoint**：账本最大 release_date 推进至 **2026-09-22**（GPT-6 Sol / Luna）；checkpoint 检查点已 commit。
- **门禁**：`validate-data` PASS（taxonomy 9 类 / vendors 16 / benchmarks 461 / releases 163（official 149）/ evidence edges 2716）；`npm run build` PASS（32 章 / EPUB / 724 个 HTML 页面 / 32569 个内部引用无死链 / 228 个时间轴 / 1920 个事件卡片校验全部通过）。

## 第二十批（2026-10-04 增量入库）：全面增量扫描多厂商前沿模型

> 本批入库扫描窗口自 2026-09-08 至 2026-10-04（以 2026-09-22 为基准回退 14 天重叠），全面覆盖全库 16 家已注册厂商及多产品线（含通用大语言模型、流式语音识别、语音合成、实时翻译、图像生成与数字人模型）。本批共入库 8 个官方 release、34 项基准评测证据（27 verified，7 pending），将官方发布时间轴推进至 **2026-10-01**。

| 指标 | 本批值 |
|---|---:|
| 新增 release 文件 | 8（Anthropic / Google / Meta / Microsoft ×2 / OpenAI / Qwen / Tencent） |
| benchmark_evidence 条数 | 34 |
| 行 status=verified | 27 |
| 行 status=pending | 7 |
| release status=verified | 6 |
| release status=pending | 2（`openai/gpt-6-1-sol`、`microsoft/mai-voice-2-1`） |
| verified ∧ vendor_reported（计入自报） | 21 |

### 逐 Release 清单

| 文件 | 来源 URL | 条数 | verified | pending | release status | 抓取路径与说明 |
|---|---|---:|---:|---:|---|---|
| `qwen/qwen3-8-livetranslate.json` | `https://qwen.ai/blog?id=qwen3.8-livetranslate` | 3 | 1 | 2 | verified | 官方博客 SPA 客户端渲染提取；Interleave 端到端实时同传架构，支持 60 语向输入与 29 语向输出，字均延迟（LAAL）降至 2.3s；Omnilingua-MSpeaker 与 FLEURS 评测记为 pending |
| `tencent/hy-image3-5-preview.json` | `https://hy.tencent.com/research/hy-image35-preview` | 1 | 1 | 0 | verified | 官方研究博客 SPA 渲染提取；混元专业级图像生成预览模型，最高 2K 分辨率、排版文字渲染增强，专业设计师 GSB 盲测胜率相比上一代综合提升 30%+ |
| `meta/muse-realtime-avatar.json` | `https://research.meta.ai/blog/bringing-your-muse-to-life` | 3 | 3 | 0 | verified | 官方研究博客与 JSON-LD 结构化数据核验；音频驱动因果 Diffusion Transformer 架构，448x768 25fps 视频流式生成，870ms 交互延迟，盲测真人偏好度相对 Runway Characters 达 78%、相对 HeyGen LiveAvatar 达 88% |
| `anthropic/claude-sonnet-5-5.json` | `https://www.anthropic.com/claude-sonnet-5-5` | 9 | 9 | 0 | verified | 官方发布博客表格逐行核验；主打高效日常编码与专业知识工作，收录 Terminal-Bench 4.0 70.6%、FrontierCode 1.1 Max 46.2% / Xhigh 52.1%、CursorBench 4.0 55.5%、GDPval-AA 1844、AA-Briefcase 1811、HLE 64.5%、OSWorld 2.1 80.1%、Chartography 61.6% |
| `openai/gpt-6-1-sol.json` | `https://openai.com/index/introducing-gpt-6-1-sol/` | 7 | 2 | 5 | pending | 官方发布页面经无头浏览器渲染读取；GPT-6.1 Sol 聚焦智能体编码与电脑操作，价格仅为 Astra 五分之一；正文图表（DeepSWE、GDP.pdf、AutomationBench、OSWorld、Terminal-Bench Science）无逐点数值记 pending，正文事实错误率 4.1%、搜索故障披露率 2.1% 记 verified |
| `google/gemini-4-argon.json` | `https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/` | 7 | 7 | 0 | verified | 官方博客正文核验；Google 新一代前沿模型，面向软件工程、企业知识工作与网络安全，输出上限 1M；DeepSWE v1.1 77.9%、AutomationBench 51.3%、LVBench 91.7%、CWE-bench v1 68% 以及 Vals/Harvey 企业基准 |
| `microsoft/mai-transcribe-2-streaming.json` | `https://microsoft.ai/news/our-first-streaming-transcription-model/` | 4 | 4 | 0 | verified | 官方新闻正文与内嵌交互组件数据提取；微软首款流式转录模型，60 种语言，100ms 首部假设；Artificial Analysis 流式 Final WER 2.50%、First Partial WER 2.80% 均居第一，Time to Final 0.130s 位于帕累托前沿，4000人图灵测试 50.3% |
| `microsoft/mai-voice-2-1.json` | `https://microsoft.ai/models/mai-voice-2-1/` | 0 | 0 | 0 | pending | 官方模型落地页核验；发布 MAI-Voice-2.1（550ms, $22/M字）与 MAI-Voice-2.1-Flash（45ms, $15/M字），23 种语言多音色情感控制；页面未印独立评测数值，保持 pending 证据档 |

### 规格与协议亮点

- **代码与前沿 Agent**：
  - **Claude Sonnet 5.5**：在 Terminal-Bench 4.0 取得 70.6%（大幅超越 Sonnet 5 的 10.3% 与 Opus 5.5 的 66.4%）；FrontierCode 1.1 Xhigh 档达 52.1%（Max 档因触发多智能体拆解超范围微降至 46.2%）；GDPval-AA 1844、AA-Briefcase 1811。
  - **Gemini 4 Argon**：DeepSWE v1.1 取得 77.9%（创下该基准 SOTA）；AutomationBench 取得 51.3%（Zapier 榜单第一）；LVBench 91.7%；CWE-bench 漏洞修复率 68% 并列第一。
  - **GPT-6.1 Sol**：事实错误率降至 4.1%（低于 GPT-6 Sol 的 4.5%，逼近 Astra 的 4.0%）；搜索工具故障不披露率仅 2.1%（前代为 4.9%）。
- **语音、转录与多模态数字人**：
  - **MAI-Transcribe-2-Streaming**：在 Artificial Analysis 语音流式榜单双第一（Final WER 2.50%、First Partial 2.80%），Time to Final 仅 0.130s。
  - **Qwen3.8-LiveTranslate**：端到端交织流架构，字均同传延迟由 2.8s 压降至 2.3s，在 Omnilingua-MSpeaker 与 FLEURS 上综合领先。
  - **Muse Realtime Avatar**：通过自强迫分布匹配蒸馏将推理计算减少 60 倍，实现 448x768 25fps 与 870ms 低延迟音画驱动，盲测显著优于现有商业方案。
  - **Hy Image3.5 preview**：文生图与图生图支持最多 5 张参考图与 2K 分辨率，复杂排版中英文字渲染提升，专业设计师盲测胜率提升超 30%。

### 候选与排除处理

- 本批全面核验了扫描窗口内发现的非独立模型发布文章，在 `data/model-coverage.json` 中统一分类为 `product` 并标注精确排除原因：
  - `anthropic/features/ebola-response`：客户案例/行业实践文章，非独立模型发布
  - `anthropic/news/claude-discovers-novel-enzyme-system`：科学研究成果与论文报道，非独立模型发布
  - `anthropic/news/barclays-scales-claude`：企业商业合作与客户案例，非独立模型发布
  - `google/products/gemini-app/new-connected-apps-gemini`：产品/工具/平台/方案更新，非独立模型发布
  - `google/models-and-research/gemini-models/gemini-3-8-live-with-live-avatar`：企业级产品与数字人应用功能上线，基于已收录的 Gemini 3.8 Live 模型底座
  - `google/products/gemini-app/guided-vision-gemini-live`：Gemini Live 无障碍视觉辅助应用功能上线，非独立模型发布
  - `mistral/news/hallo-deutschland`：企业德国慕尼黑中心成立新闻，非独立模型发布
  - `openai/index/practical-guide-building-gpt-6`：GPT-6 开发者构建指南与工程实践，非独立模型发布

### 门禁与验证

- **release 文件变更**：新增 8 个（official 增至 157 个，全局 171 个），新增 34 条 evidence edges（全局 2750 条）。严格遵守账本「只追加」契约。
- **checkpoint**：账本最大 release_date 推进至 **2026-10-01**；checkpoint 检查点已 commit。
- **单元测试**：`node --test tests/*.test.mjs` 19 项测试全部通过。
- **数据层校验**：`node scripts/validate-data.mjs` PASS（0 errors）。
- **技能同步校验**：`npm run sync:skills:check` PASS（零漂移）。
- **全站构建与校验**：`npm run build` PASS（32 章 / EPUB / 745 个 HTML 页面 / 33646 个内部引用无死链 / 228 个时间轴 / 1954 个事件卡片校验全部通过）。

## 第二十一批（2026-10-04 专项补齐与防遗漏升级）：MiniMax M3.1 Flash Preview 官方入库与多产品线巡检机制升级

> 本批针对 MiniMax 混合专家（MoE）思考模型 `MiniMax-M3.1-Flash-Preview`（2026-09-28）展开专项补齐与增量入库，同时针对该模型遗漏的深层根因完成系统性防遗漏架构升级。本批共入库 1 个官方 release（`minimax/minimax-m3-1-flash-preview.json`），完成对应归档物料归档（`models/2026-09-28-minimax-m3-1-flash-preview/`），官方 release 总数推进至 **158**（全库 releases 增至 172 个）。

| 指标 | 本批值 |
|---|---:|
| 新增 release 文件 | 1（`minimax/minimax-m3-1-flash-preview.json`） |
| benchmark_evidence 条数 | 0（官方落地页以案例与规格对比为主，无公开离散基准打分表，依规记 pending） |
| release status | pending |
| 官方归档目录 | `models/2026-09-28-minimax-m3-1-flash-preview`（含 `page.html`, `index.md`, `manifest.json`） |

### 遗漏根因深度剖析与防遗漏系统优化

1. **多域名与入口隔离（Domain Fragmentation）**：
   - **根因**：`data/model-coverage.json` 之前仅将 `www.minimax.io` 列入白名单，且入口仅配置了 `https://www.minimax.io/news`。MiniMax 拥有独立子域矩阵（主站 `www.minimax.io`/`www.minimax.cn`、开放平台 `platform.minimax.io`、Agent 工具落地页 `agent.minimax.cn`/`agent.minimax.io`）。旧扫描脚本在遇到重定向或非白名单域名时会直接拦截或抛出异常。
   - **优化**：在 `data/model-coverage.json` 中将 `minimax` 的 `allowed_hosts` 完整扩充为多域白名单，同时增补 `https://agent.minimax.cn/tools/m3-1-flash-preview` 与 `https://platform.minimax.io/docs/release-notes/models` 为常驻监测入口。
2. **发布形态非传统 Blog/News 列表（Product Landing Page vs. Blog Post）**：
   - **根因**：M3.1 Flash Preview 并未作为博客文章发布在 `/news` 列表中，而是作为 Agent 产品线的模型详情与 IDE 工具专属落地页（`/tools/m3-1-flash-preview`）直接上线。
   - **优化**：在技能渠道地图（`discovery-channels.md`）与扫描逻辑中明确将工具落地页与开发者平台模型 Release Notes 纳为一级发现源。
3. **关键词正则遗漏厂商特征**：
   - **根因**：`scripts/release-discovery.mjs` 中的 `classifyTitle`（通用模型分类正则）和 `discoverLinks`（链接发现关键词正则）涵盖了主流厂商名称，却**唯独遗漏了 `minimax`**。
   - **优化**：在 `release-discovery.mjs` 的通用模型识别与链接发现正则中补齐 `minimax`，避免后续相关链接被误分类或漏抓。
4. **技能镜像同步门禁**：
   - 完成 `.claude/skills/ingest-releases/` 升级后，通过 `npm run sync:skills` 单向镜像到 `.agent/skills/`，经 `npm run sync:skills:check` 验证零漂移。

### 门禁与验证

- **release 文件变更**：新增 1 个（`minimax/minimax-m3-1-flash-preview.json`），official release 增至 158 个，全库 release 增至 172 个。严格遵守账本「只追加」契约。
- **单元测试**：`node --test tests/*.test.mjs` 19 项测试全部通过（含覆盖校验与 manifest 哈希一致性）。
- **数据层校验**：`node scripts/validate-data.mjs` PASS（0 errors）。
- **全站构建与校验**：`npm run build` PASS（32 章 / EPUB / 746 个 HTML 页面 / 33673 个内部引用无死链 / 228 个时间轴 / 1956 个事件卡片校验全部通过）。

## 第二十二批（2026-10-12 增量入库）：全面增量扫描多厂商前沿模型（Claude Haiku 5.5 / Mistral Large 4 / EmbeddingGemma 2）

> 本批入库扫描窗口自 2026-09-17 至 2026-10-12（以检查点 2026-10-01 回退 14 天重叠），全面覆盖全库 16 家在册厂商及多产品线。本批共入库 3 个官方 release、9 项已验证评测证据（9 verified，0 pending），官方 release 总数推进至 **161**（全库 releases 增至 175 个），新增代码嵌入基准实体 `mteb-code`，将官方发布时间轴推进至 **2026-10-07**。

| 指标 | 本批值 |
|---|---:|
| 新增 release 文件 | 3（Anthropic / Mistral / Google） |
| benchmark_evidence 条数 | 9 |
| 行 status=verified | 9 |
| 行 status=pending | 0 |
| release status=verified | 2（`anthropic/claude-haiku-5-5`、`google/embeddinggemma-2`） |
| release status=pending | 1（`mistral/mistral-large-4`） |
| 官方归档目录 | 3（`models/2026-10-07-claude-haiku-5-5`、`models/2026-10-06-mistral-large-4`、`models/2026-10-06-embeddinggemma-2`） |

### 逐 Release 清单

| 文件 | 来源 URL | 条数 | verified | pending | release status | 抓取路径与说明 |
|---|---|---:|---:|---:|---|---|
| `anthropic/claude-haiku-5-5.json` | `https://www.anthropic.com/claude-haiku-5-5` | 8 | 8 | 0 | verified | 官方发布博客表格逐行核验；主打高吞吐、低成本与快速子智能体协同，收录 GDPval-AA v2.1 1620、AA-Briefcase v1.1 1578、OSWorld 2.1 (Offline subset) 72.4%、HLE no tools 45.9% / with tools 57.4%、Terminal-Bench 4.0 39.2%、FrontierCode 1.1 46.4%、Chartography 46.4% |
| `mistral/mistral-large-4.json` | `https://mistral.ai/news/mistral-large-4/` | 0 | 0 | 0 | pending | 官方发布新闻核验；1 万亿参数原生多模态 MoE 旗舰开源模型（ML4 / le Chonk），激活 52B，基于欧洲 3800 张 Grace Blackwell 训练；正文图表（DeepSWE, Terminal-Bench 4.0, Cyber Index 等）全部为 WebP 图片，未印独立 DOM 离散数字，保持 pending 证据档 |
| `google/embeddinggemma-2.json` | `https://blog.google/innovation-and-ai/technology/developers-tools/embeddinggemma-2/` | 1 | 1 | 0 | verified | 官方研究博客核验；Google 基于 Gemma 4 架构开发的 740M 轻量级原生多模态嵌入模型，Apache 2.0 开源；MTEB Code 子集得分 78.68（提升 9.92 点），引入新基准 `mteb-code` |

### 规格与协议亮点

- **代码与智能体**：
  - **Claude Haiku 5.5**：在 OSWorld 2.1 (Offline subset) 取得 72.4%（远超前代 Haiku 4.5 的 15.7% 与 GPT-6 Luna 的 48.9%）；HLE with tools 达到 57.4%；小提示（<=100k）输入仅 $0.10/M tokens，成本压降约 75%。
  - **Mistral Large 4**：万亿级开源权重多模态模型，支持欧洲自主算力自部署，在网络安全、代码与专业垂直智能体领域对齐开源前沿。
- **检索与多模态嵌入**：
  - **EmbeddingGemma 2**：740M 模块化端侧嵌入模型（文本 270M，视觉 170M，音频 300M），在 MTEB Code 达到 78.68，支持 Matryoshka 表示学习（MRL）动态截断至 128 维（存储压降 6 倍）。

### 候选与排除处理

- 本批核验并清理扫描窗口内发现的非独立模型发布文章与工具更新：
  - `openai/index/gpt-6-for-everyone`：ChatGPT 应用端 Intelligent UI 上线与免费版推广，底层使用已收录的 GPT-6 Sol / Luna 模型
  - `openai/index/introducing-dots`：OpenAI Dots 常驻自主 Agent 产品上线，底层使用已收录的 GPT-6 Astra 模型
  - `openai/index/new-chatgpt-ads-format-and-measurement`：广告格式与效果度量商业功能更新，非独立模型发布
  - `anthropic/news/2026-usage-policy-update`：使用政策与合规条款更新，非独立模型发布
  - `anthropic/news/anthropic-cyber-mission`：企业网络安全计划与合作伙伴公告，非独立模型发布
  - `anthropic/news/genesis-mission-commitment`：科学研究承诺与算力资源资助公告，非独立模型发布
  - `google/blog/.../google-ai-updates-september-2026`：Google 9月 AI 动态汇总文章，非独立模型发布
  - `kimi/code/docs/.../*`：Kimi Code 客户端功能文档/工具说明，非独立模型发布

### 门禁与验证

- **release 文件变更**：新增 3 个（official 增至 161 个，全局 175 个），新增 9 条 evidence edges（全局 2759 条）。严格遵守账本「只追加」契约。
- **benchmark 实体**：新增 `data/benchmarks/mteb-code.json`（全库达 462 个）。
- **checkpoint**：账本最大 release_date 推进至 **2026-10-07**；checkpoint 检查点已 commit。
- **单元测试**：`node --test tests/*.test.mjs` 19 项测试全部通过（含覆盖校验与 10 个官方归档目录 manifest 哈希一致性）。
- **数据层校验**：`node scripts/validate-data.mjs` PASS（0 errors）。
- **技能同步校验**：`npm run sync:skills:check` PASS（零漂移）。
- **全站构建与校验**：`npm run build` PASS（32 章 / EPUB / 750 个 HTML 页面 / 33833 个内部引用无死链 / 228 个时间轴 / 1969 个事件卡片校验全部通过）。


---

## 第二十三批（2026-10-18 增量入库）：DeepSeek-V4.1-Flash-1017 官方发布

| 项目 | 内容 |
| --- | --- |
| 扫描锚点 | 检查点锚点回退 14 天重叠，窗口 2026-09-23 ~ 2026-10-18 |
| 新增 release | 1 个：`deepseek/deepseek-v4-1-flash-1017` |
| 新增 evidence | 11 条 = 0 verified + 11 pending |
| 新 benchmark id | 0（全部映射既有实体：hlehle / terminalbench / deepswe / program-bench / nl2repo / automationbench / agents-last-exam / apexbench / chartography / babyvision / zerobench） |
| 新厂商 | 无 |

### 新入库 release

| vendor | 模型 | 发布日与证据 | evidence |
| --- | --- | --- | --- |
| deepseek | DeepSeek-V4.1-Flash-1017 | 2026-10-17；api-docs.deepseek.com/news/news261017 侧栏公告清单标注 `Release 2026/10/17`，文档站 News 导航列为当前最新条目，Quick Start 示例改用本模型并把旧 `deepseek-v4-flash` 与 `deepseek-v4-flash-vision-exp` 标记退役 | 11 p⏳ |

官方定位：相对上一版在基准成绩、任务完成速度与输出长度上均更优，构成性能与成本的 Pareto 改进；采用自反馈强化学习改进端到端项目构建，并针对 DeepSeek Harness v0.2.1-rc.1 及以上、Tencent CodeBuddy、WorkBuddy 等脚手架优化。官方 Quick Start 已将 `deepseek-flash` 路由切至本模型。该迭代公告未复述参数量、上下文长度与定价，账本相应字段一律记 null，未沿用 V4.1-Flash 旧值。

### 待人工核验（图表行）

官方评测总表为公告页内嵌 PNG（`models/2026-10-17-deepseek-v4-1-flash-1017/images/benchmark_table_en.png`），11 行按图行规则记 pending，视觉转写值存于各行 `notes`，读图确认后方可翻转 verified：

| 评测基准 | 视觉转写值 | 官方脚注协议 |
| --- | --- | --- |
| HLE (w/o tools) | 42.6（另标 44.0*） | * = HLE 文本子集 |
| Terminal-Bench 4.0 | 42.3 | Claude Code 框架 |
| DeepSWE v1.1 | 77.0 | Mini-SWE-V2 框架 |
| ProgramBench | 29.1 | 未说明 |
| NL2Repo-Bench | 68.2 | 未说明 |
| Automation-Bench V1.0.6 | 60.5 | 未说明 |
| Agents' Last Exam | 35.4 | 未说明 |
| Apex Bench v1.1 | 72.1 | 未说明 |
| Chartography (w/tools) | 83.0 | 带工具 |
| BabyVision (w/tools) | 92.5 | 带工具 |
| ZeroBench-main (w/tools) | 51.0 | Pass@5 |

### 与远端账本的对账说明

本批开工时本地基线落后远端 17 个提交（远端已推进至第二十二批，账本 161 条），开工前发现的 GPT-6 Sol/Luna、Gemini 4 Argon、Gemini 3.8 Live、Mistral Large 4 四个候选均已被上游批次收录且部分条目证据更完整（GPT-6 Sol/Luna 16 条、Mistral Large 4 已入库）。为避免以陈旧条目覆盖上游成果，本批只合入真正新增的 DeepSeek-V4.1-Flash-1017，其余本地草稿保留在 `local/batch12-stale-base` 分支备查，未删除任何历史。

### 跳过清单（本窗口未入库）

| 候选 | 原因 |
| --- | --- |
| OpenAI GPT-6.1 Sol（2026-09-29） | 该页正文无发布日期，日期仅由官方 RSS pubDate 支撑；且本批 curl 与无头浏览器均被 openai.com Cloudflare managed challenge 拦截（HTTP 403），无法取得正文与基准数据做归档，不以推测填充。 |
| Gemini 3.8 TTS（09-23）/ Live Avatar（09-24）/ EmbeddingGemma 2（10-06） | 语音、具身语音与嵌入垂直模型，非通用大模型。 |
| Mistral Timestral（2026-10-15） | 时间序列垂直模型。 |
| x.ai、z.ai、Moonshot、Qwen、Seed、Meta AI、Microsoft AI、StepFun、腾讯混元 | 仅 curl 探测受阻或 JS 渲染，未完成浏览器复核，不能据此断言窗口内无发布，需后续批次补扫。 |

## 第二十四批（2026-10-19 增量入库）：Mistral Timestral 时间序列基础模型家族

| 项目 | 内容 |
| --- | --- |
| 扫描锚点 | 检查点锚点 2026-10-17 回退 14 天重叠，窗口 2026-10-03 ~ 2026-10-19 |
| 开工基线 | `origin/main` = `48de71d`（第二十三批），独立 worktree detached HEAD，账本 162 条 |
| 新增 release | 1 个：`mistral/timestral` |
| 新增 evidence | 5 条 = 0 verified + 5 pending |
| 新 benchmark id | 3（`gift-eval` / `time-forecast-benchmark` / `fev-bench`，均标 `new-benchmark`，兜底页已生成） |
| 新厂商 | 无 |
| 收口 checkpoint | `last_scan_at=2026-10-19`；`last_max_release_date` 保持 `2026-10-17` 未回退（本批最大发布日 2026-10-15 早于锚点，锚点只前进不回退） |

### 新入库 release

| vendor | 模型 | 发布日与证据 | evidence |
| --- | --- | --- | --- |
| mistral | Timestral（5M / 28M / 123M / 209M 四尺寸家族） | 2026-10-15；mistral.ai/news/timestral/ 正文印刷 `October 15, 2026`、署名 `By Mistral` | 5 p⏳ |

官方定位：Mistral 首个时间序列基础模型（TSFM）家族，做概率化多变量预测，支持仅历史与已知未来协变量。页面明示规格：上下文 32,768 time steps、输出 21 个分位数的概率预测、部署 on-prem / VPC / air-gapped、Licence Modified MIT；页面未给出 API 定价，账本 `pricing` 记 null。多变体完整性已逐个建档：5M / 28M / 123M / 209M 四个尺寸全部保留，无遗漏。

### 日期证据冲突（未跨来源调和）

同一页面的 JSON-LD 写 `"datePublished":"2026-07-15"`，与正文印刷日 `October 15, 2026` 不一致。按账本契约不跨来源调和：`release_date` 取页面印刷日 `2026-10-15`，JSON-LD 原值写入 manifest 与账本 notes 留档，待官方更正或人工核对后再决定是否走 `revisions[]` 勘误。

### 待人工核验（图表行）

5 项评测全部来自公告页内嵌柱状图（img `alt` 为空、DOM 无明文数值），按图行规则一律记 pending，视觉转写值存于各行 `notes` 与归档 `index.md`，读图确认后方可翻转 verified：

| 评测基准 | 视觉转写值 | 方向 | 图中位次 |
| --- | --- | --- | --- |
| GIFT-Eval / GMean MASE | 0.657 | 越低越好 | 1 |
| GIFT-Eval / GMean WQL | 0.446 | 越低越好 | 1 |
| TIME / GMean MASE | 0.626 | 越低越好 | 1 |
| TIME / GMean CRPS | 0.522 | 越低越好 | 1 |
| fev-bench / SQL skill score | 50.4 | 越高越好 | 1 |

协议字段：页面称结果来自单一 checkpoint、未做集成，但未给出评测协议细节，且技术报告当时尚未发布，故 `protocol` 12 键全部记 null。

### 与第二十三批口径的差异（重要）

第二十三批把 `Mistral Timestral（2026-10-15）` 列入跳过清单，原因为「时间序列垂直模型」。该口径与当前 ingest-releases 技能契约冲突：契约明确要求「翻译、语音、图像、视频、OCR 等专项模型必须允许建档；分类只影响任务适配与分数比较，不是排除条件」，并要求落实厂商全产品线监测（Mistral 必须覆盖通用、端侧 Small、OCR 文档智能与代码）。本批按现行契约建档 Timestral，第二十三批的跳过理由不再沿用。本批未改写第二十三批任何既有内容，只在其后追加本节。

### 候选与排除处理

| 候选 | 处理 |
| --- | --- |
| `google-11e9f2eebcc1`（Gemini 4 Argon 开放公告，2026-10-13） | 不建档。属面向开发者的 availability post，非独立模型发布；该模型档案已存在于 `google/gemini-4-argon`（release_date 2026-09-30，status verified，7 条 evidence），不重复建档。已写 `exclusion_reason`。 |
| `google-0fb6a7bf6fd6`（Gemini 4 Argon 模型安全文章，2026-10-13） | 不建档。属模型安全与负责任开发方法论文章，非独立模型发布；同上，已写 `exclusion_reason`。 |

### 跳过清单（本窗口未入库）

| 候选 | 原因 |
| --- | --- |
| x.ai、z.ai、StepFun | 入口扫描为 `inaccessible`（x.ai/news、z.ai/blog、stepfun.ai/research 抓取受阻），未完成浏览器复核，不能据此断言窗口内无发布，需后续批次补扫。 |
| Meta AI、OpenAI sitemap、Qwen、Seed blog、腾讯混元 | 入口扫描为 `inaccessible` 或 `needs_render`（JS 渲染未复核），同上，不得据此断言窗口内无发布。 |

### 门禁与验证

| 门禁 | 结果 |
| --- | --- |
| `node scripts/reconcile-coverage.mjs` | ✓ 通过（exit 0） |
| `node --test tests/*.test.mjs` | ✓ 19 pass / 0 fail |
| `npm run sync:skills:check` | ✓ 技能镜像无漂移 |
| `node scripts/validate-data.mjs` | ✓ PASS — taxonomy 9 类 / vendors 16 / benchmarks 462 / releases 177（official 163）/ evidence edges 2775 |
| `npm run validate` | ✓ 32 章通过（219 条 numeric-claim warning 为存量，不阻断） |
| `npm run build:epub:official` | ✓ evals.epub 484 KB / 32 章 |
| `npm run build:web` | ✓ explorer + 462 实体页 + 42 自动证据页 |
| `npm run validate:site` | ✓ 全部通过（755 个 HTML / 34034 个内部引用；229 个时间轴 / 1985 个事件卡片） |

开工时 `validate-data` 曾因 3 个 `general` 候选既无 release 也无 exclusion_reason 而失败（google 两例 + mistral 一例）；本批三条候选全部处置后转为 PASS。

## 第二十四批补充（2026-10-19 增量入库）：Meta Muse Wonder / Muse Spark Open

main 已先合入 `mistral/timestral`（第二十四批）；本补充只新增 Meta 两个官方发布，不改写既有 Timestral 条目。

| 项目 | 内容 |
| --- | --- |
| 扫描锚点 | 与第二十四批同一窗口（2026-10-03 ~ 2026-10-18） |
| 基线 | `origin/main` 已含 `mistral/timestral`；本补充新增 2 个 release |
| 新增 release | 2 个：`meta/muse-wonder`、`meta/muse-spark-open` |
| 新增 evidence | 3 条 = 0 verified + 3 pending（Muse Wonder：LAB / FocusBench / SWE-Marathon）；Muse Spark Open 正文未逐项点名基准，0 条 |
| 新 benchmark id | `focusbench`（兜底详情页自动生成） |
| 新厂商 | 无（Meta 已在册） |

### 新入库 release

| vendor | 模型 | 发布日与证据 | evidence |
| --- | --- | --- | --- |
| meta | Muse Wonder / Muse Wonder Full | 2026-10-12；正文印刷日「October 12, 2026」与页面 JSON-LD `datePublished 2026-10-12` 一致 | 3 p⏳ |
| meta | Muse Spark Open | 2026-10-15；正文印刷日「October 15, 2026」与页面 JSON-LD `datePublished 2026-10-15` 一致 | 0（正文未逐项点名基准） |

Muse Wonder 系列面向个人与专业智能体任务，把 Active Memory（跨会话携带个人上下文并主动检索）与 Active Focus（围绕困难目标持续推进）组合在一起；正文未披露参数量与上下文长度，账本 `params` / `context_window` / `pricing` 一律记 null。Muse Spark Open 为开放权重版，正文明示 816B 总参数 / 42B 激活、1M tokens 上下文、原生多模态、Muse Model License。

### 待人工核验（图表行）

| release | 评测 | 页面定位 |
| --- | --- | --- |
| muse-wonder | Harvey's Legal Agent Benchmark (LAB) | 完整对比结果图表 |
| muse-wonder | FocusBench | 完整对比结果图表 |
| muse-wonder | SWE-Marathon | 完整对比结果图表 |

Muse Spark Open 的「Key Benchmarks」小节为图表且正文未逐项点名基准名称，故本批不铸造 benchmark 实体与 evidence 行，待官方 evaluation methodology report 与 model card 公开后补录。

### 归档

Muse 页面的图表已归档到 `models/2026-10-12-muse-wonder/images/` 与
`models/2026-10-15-muse-spark-open/images/`，并登记进各自的 `manifest.json`
（逐文件记录 sha256），上游页面变更后仍可离线复核。

### 候选与排除处理

| 候选 | 处理 |
| --- | --- |
| `google-11e9f2eebcc1`（Gemini 4 Argon 开发者文章） | 归并至账本既有 `gemini-4-argon`，补 `archive_path`，不重复建档 |
| `google-0fb6a7bf6fd6`（Gemini 4 模型安全专题） | 分类改 `product`，记排除原因「模型安全与防护专题文章，非独立模型发布」 |

另新增 5 个待补扫候选，均带明确 `exclusion_reason` 与 `next_backfill_at`。

### 门禁与验证

| 门禁 | 结果 |
| --- | --- |
| `node scripts/reconcile-coverage.mjs` | ✓ exit 0 |
| `node --test tests/*.test.mjs` | ✓ 19 pass / 0 fail |
| `npm run sync:skills:check` | ✓ 技能镜像无漂移 |
| `node scripts/validate-data.mjs` | ✓ PASS — taxonomy 9 类 / vendors 16 / benchmarks 462 / releases 179（official 165）/ evidence edges 2778 |
| `npm run validate` | ✓ 32 章通过（numeric-claim warning 为存量，不阻断） |

---

## 第二十五批（2026-10-19 增量入库）：MiniMax M3.1 Flash / Grok Voice 3.0 / GLM-Legal

| 项目 | 内容 |
| --- | --- |
| 扫描锚点 | 账本 frontier 2026-10-17（`deepseek-v4-1-flash-1017`）回退 14 天 → 窗口 2026-10-03 ~ 2026-10-19 |
| 基线 | `origin/main` = 5d20181（含第二十四批 Timestral / Muse Spark Open / Muse Wonder） |
| 新增 release | 3 个：`minimax/minimax-m3-1-flash`、`xai/grok-voice-3`、`glm/glm-legal` |
| 新增 evidence | 26 条 = 16 verified + 10 pending（其中 5 条为官方未公布数值、9 条为第三方转述） |
| 新建 benchmark 实体 | 8 个（见下表） |
| 新厂商 | 无（minimax / xai / glm 均已在册） |
| 归档目录 | 3 个（`models/2026-10-19-minimax-m3-1-flash/`、`models/2026-10-14-grok-voice-3/`、`models/2026-10-12-glm-legal/`） |

### 新入库 release

| vendor | 模型 | 发布日与日期证据 | evidence |
| --- | --- | --- | --- |
| minimax | MiniMax M3.1 Flash | 2026-10-19；页面 JSON-LD `datePublished 2026-10-19T00:00:00.000Z` 与正文日期行「2026-10-19」互证 | 16（6 ✓ / 10 ⏳） |
| xai | Grok Voice 3.0 | 2026-10-14；页面 JSON-LD `datePublished 2026-10-14T00:00:00Z` 与面包屑「Oct 14, 2026」互证 | 7（7 ✓ / 0 ⏳） |
| glm | GLM-Legal | 2026-10-12；页面标题行印刷「2026-10-12 · Research」 | 3（3 ✓ / 0 ⏳） |

三条都是上一批因入口不可读而漏掉的窗口内发布：x.ai 对静态抓取返回 403（改用无头浏览器渲染）、`z.ai/blog/` 索引 404（单篇页可读）、MiniMax 博客无 RSS 日期字段（取 JSON-LD）。

### evidence 统计

| release | 条数 | verified | pending | 有数值 | 官方未公布数值 | 第三方转述 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `minimax-m3-1-flash` | 16 | 6 | 10 | 5 | 1 | 1 |
| `grok-voice-3` | 7 | 7 | 0 | 7 | 0 | 6 |
| `glm-legal` | 3 | 3 | 0 | 1 | 2 | 2 |
| 合计 | 26 | 16 | 10 | 13 | 3 | 9 |

### 新建 benchmark 实体（8 个）

| id | 名称 | 引入来源 |
| --- | --- | --- |
| `tau-voice` | τ-Voice | 端到端语音智能体任务完成率；此前只有 Google Gemini 3.8 Live 的引用行、无实体，本批补齐 |
| `aa-speech-to-speech` | AA Speech-to-Speech Quality Index | Artificial Analysis 语音综合指数；同上 |
| `bigbench-audio` | Big Bench Audio | 语音音频理解与推理；同上 |
| `speech-agent-arena` | Speech Agent Arena | 语音智能体真人盲测 Elo |
| `aa-task-success-rate` | AA Task Success Rate | AA 综合指数的任务完成分项 |
| `full-duplex-bench` | Full Duplex Bench | 全双工会话动态评测 |
| `eva-bench` | EVA-Bench | ServiceNow 开源企业语音智能体基准 |
| `swe-refactor-bench` | SWE Refactor Bench | 存量代码重构评测，官方页脚注给出 `Einsia/SWE-Refactor-Bench` |

`aa-speech-to-speech` / `bigbench-audio` 两个 id 在账本里此前已由 `google/gemini-3-8-live` 引入（标记 new-benchmark、无实体），本批复用同一 id 而非另铸，并补建实体。交叉印证：xAI 页 AA 表中 Gemini 3.8 Live 的 82.6 / 97.7 与 Google 自家发布页记录完全一致，说明两页引用的是同一份 Artificial Analysis 评测。

### 关键口径决定

1. **图表行不自动翻 verified**：MiniMax 官方评测总表是位图（`images/m31-flash-en-2.webp`，15 行基准 × 8 模型列 + 逐项协议脚注），表内 10 行自家数值只存在于图中，全部记 pending，读数仅进 `notes`。
2. **DOM 明文优先**：同一发布中 5 项分数出现在正文散文的 DOM 文本里（BankerToolBench 76.2、DeepSWE v1.1 73.7%、OSWorld V2 61.7、ALE 29.6、CyberGym 82%），按 verified 记；CyberGym 正文 82% 与图内 82.2 的四舍五入差已记入该行 notes。
3. **AA 表按第三方转述**：Grok Voice 3.0 评测主表 caption 明确标注 "per Artificial Analysis"、来源行标注 "Source: Artificial Analysis, October 13, 2026"，故该表 5 行与 τ-Voice 71.6% 均记 `third_party_reported`；EVA-Bench 74% 印在正文、基准方为 ServiceNow，按 `vendor_reported` 记。
4. **成本数值不建基准行**：Grok Voice 3.0 页内联 SVG 的 "Cost per task"（$0.025 / $0.03 / $0.055 USD）是成本对照而非基准分数，按抽取口径并入 Big Bench Audio 行 notes。
5. **垂直领域模型必须建档**：GLM-Legal 属法律垂域模型，按契约建档（第二十三批把 Timestral 当"时间序列"排除的做法已废止）。
6. **Vals 独立评测单独识别**：GLM-Legal 页明示「Harvey LAB 与 LegalBench 的结果由 Vals 独立评测」，这两行按第三方转述记；PLawBench 不在该声明覆盖范围内，按自报记。
7. **AutomationBench-AA 与 v1.0.6 分行**：前者为正文明文点名但无数值，后者只存在于图内 62.8，同一 release 同一基准拆两行（`--automationbench` / `--automationbench-v1-0-6`），edge id 沿用 `stepfun-step-5-preview--automationbench-public` 的既有加后缀写法。

### 待人工核验（图表行，10 条）

全部来自 `models/2026-10-19-minimax-m3-1-flash/images/m31-flash-en-2.webp`，读图确认后方可翻 verified：

| release | 评测 | 视觉转写值 | 协议（官方脚注） |
| --- | --- | --- | --- |
| minimax-m3-1-flash | Automation-Bench v1.0.6 | 62.8 | 600 道公开任务；harness Claude Code |
| minimax-m3-1-flash | Terminal Bench 4.0 | 38.1 | Codex 0.149.1 harness |
| minimax-m3-1-flash | GDP.pdf AA | 20.8 | 结果直接取自 Artificial Analysis |
| minimax-m3-1-flash | LOCA-Bench 256K | 60.3 | 官方实现 hkust-nlp/LOCA-bench |
| minimax-m3-1-flash | PostTrain Bench v1.1 | 39.3 | Claude Code 2.1.251，最大上下文 512K |
| minimax-m3-1-flash | NL2Repo-Bench | 61.2 | Claude Code 2.1.233，最大上下文 512K |
| minimax-m3-1-flash | SWE Refactor Bench | 23.0 | Claude Code 2.1.220，最大上下文 200K |
| minimax-m3-1-flash | BabyVision (w/tools) | 91.0 | Claude Code 2.1.285，最短图片边长 1,500 像素 |
| minimax-m3-1-flash | HLE (w/o tools) | 43.4 | 限 2,158 道纯文本提示子集 |
| minimax-m3-1-flash | CharXiv RQ | 82.5 | judge 模型 GPT-5.5 |

### 候选处置与跳过清单

| 候选 | 处理 |
| --- | --- |
| `minimax-3500d67669a4`（MiniMax M3.1 Flash） | 归并至 `minimax-m3-1-flash`，补 `archive_path` 与 evidence 状态 |
| `release-grok-voice-3`、`release-glm-legal` | 由对账脚本按官方页 URL 自动建候选并回填 release 归属 |

窗口内经官方一级来源核实后**未发现**新模型发布、故不建档的厂商：openai（RSS 逐条核日期，Aardvark 10-19 为产品私测、gpt-6-for-everyone 10-07 为产品）、anthropic（newsroom 10/01–10/18 全非模型）、google（blog `publish_date` 逐条，10-13 Argon availability 已由第二十四批处置）、mistral（RSS 最新 Timestral 10-15 已在账）、deepseek（仅 news261017，已在账）、kimi（blog 最新 2026-07-31）、doubao（Seed2.1/Seedance/Seedream 无新）、xiaomi（无 10 月日期）、microsoft（MAI-Cyber-1-Flash 官方 JSON-LD 为 2026-08-13，窗口外）、qwen（周报显示窗口内唯一新模型 10/02 上线百炼的 Qwen-Image-2.1-Pro，窗口外）。

聚合站（`llmgateway.io` / `llm-releases.com`）只作发现线索，日期与数值一律回官方页核实——由此定位到的 Microsoft-Decision-1、Qwen Image 2.1 Turbo、Grok Imagine Video 1.5 Lite、GLM 5.3 Fast、Gemini Nano Banana 2.1、Reka Edge 2603、Beam 等候选，经核实均非窗口内官方模型发布或无官方发布文，不入账。

### 覆盖缺口（如实记录，未能复核）

| 入口 | 状态 | 说明 |
| --- | --- | --- |
| `hy.tencent.com`（腾讯混元） | needs_render | 纯 SPA，静态抓取只拿到同一份 117KB 外壳、无任何日期字符串，**未能独立确认窗口内无新发布** |
| `stepfun.ai/blog`（阶跃星辰） | needs_render | 同上，**未能独立确认窗口内无新发布** |

这两条不能断言"无发布"，已保留为下次批次的复核入口；两家厂商最近一次在账发布（混元 / Step 系列）均早于本窗口。

### 门禁与验证

| 门禁 | 结果 |
| --- | --- |
| `node scripts/reconcile-coverage.mjs` | ✓ exit 0 |
| `node --test tests/*.test.mjs` | ✓ 19 pass / 0 fail |
| `npm run sync:skills:check` | ✓ 技能镜像无漂移（本批未改 `.claude/skills/`） |
| `node scripts/validate-data.mjs` | ✓ PASS — taxonomy 9 类 / vendors 16 / benchmarks 470 / releases 182（official 168）/ evidence edges 2804 |
| `npm run validate` | ✓ 32 章通过（numeric-claim warning 为存量，不阻断） |
| `npm run build:epub:official` | ✓ evals.epub / 32 章 |
| `npm run build:web` | ✓ explorer + 470 实体页 + 40 自动证据页 |
| `npm run validate:site` | ✓ 全部通过（766 个 HTML / 34510 个内部引用；234 个时间轴 / 2021 个事件卡片） |
| 本地站点抽查 | ✓ `/releases/` 出现 2026-10-19 / 2026-10-14 / 2026-10-12 三个新结点；三个详情页 200 且评测 chip 可点击；8 个新基准详情页的「模型发布采用时间轴」均出现对应新发布；厂商 logo 为真实彩色原标；公开文案无「已核验/待核验/证据账本/窗口起点」等内部流程词 |


## 第二十六批（2026-10-19 增量窗口 2026-10-05 ~ 2026-10-19）

- **新增 release：1 个**
  - `minimax-h3`（vendor=minimax，模型=MiniMax H3，发布日=2026-07-31，证据=官方研究页文章头部印刷日期行 `<time>2026-07-31</time>`，并由官方模型发布说明页 "Jul. 31, 2026" 条目交叉确认；evidence 条数 **0**（v✓ 0 / p⏳ 0））。
    - 归档：`models/2026-07-31-minimax-h3/`（page.html + images/h3-hero.png + index.md + manifest.json）。
    - 规格：通用多模态生成模型，统一理解文本/图像/视频/音频上下文，输出原生立体声视频，最长 15 秒、最高 2K；核心技术 Contextual Omni Representation、H3-VAE（4x 有效序列长度）、H3-Omni Transformer（训练吞吐 +30%）、上下文内重生成。
    - 状态 `pending`：发布页未给出任何离散基准跑分数值，页面数字仅为工程指标与价格相对口径（2K 每秒价格不到主流模型三分之一、768p 不到主流 720p 的一半），按纪律记 0 行。
    - 该发布落在增量窗口之外（2026-07-31），由厂商全产品线巡检在存量回填轨道上发现。
- **新增 evidence：0 条**（0 verified + 0 pending）。
- **新 benchmark id：无**（本批无新评测行）。
- **新厂商：无**。
- **跳过清单**
  - GPT-6 Instant（OpenAI，2026-10-07，官方页 `openai.com/index/gpt-6-for-everyone/`）——官方页已定位、页面印刷日期确认为 2026年10月7日，但本轮直连返回 **403**，未完成归档与转写，**留待下一轮以无头渲染降级链补齐**，本批不入账。
  - Anthropic「An update on independent evaluators」（10-15）、「Investing in the public benefit」（10-18）、「opens Singapore office」（10-14）——评测方法学 / 公益 / 办公室与政府备忘录公告，非独立模型发布。
  - OpenAI「Rosalind Academic Plan」（10-15）——研究计划公告，非独立模型发布。
  - Meta「Accelerating Scientific Research in Health Data Science With Muse Models」（10-14）——基于既有 Muse 模型的科研应用博客，未发布新模型。
  - Kimi「Remote Control」（10-19）、豆包「Seed Alignment & Preparedness team」（10-14）——客户端功能文档页 / 招聘公告，非独立模型发布。
- **待人工核验**：本批无图表行。
- **门禁**：`reconcile-coverage` ✓ / `validate-data` ✓（releases 183，official 169，evidence edges 2804）/ `validate-model-coverage` ✓ / `sync:skills:check` ✓ / `npm run build` 全链路 ✓（tests 19/19、book validate 32 章通过、EPUB 484 KB、web 32 章 + 693 URL sitemap、benchmarks hub 470 实体页 + 40 自动证据页、`validate-site` ✓：767 HTML / 34538 内部引用 / 234 时间轴 / 2023 事件卡片）。
- **分支**：`model-release-daily-20261019T232350Z`（自 `origin/main` = e7e6110 开出），远端分支保留，开 PR 交人工评审。

## 第二十七批（2026-10-20 增量窗口 2026-10-05 ~ 2026-10-20）

- **新增 release：2 个**
  - `gpt-6-october`（vendor=openai，模型=GPT-6 Instant / GPT-6 Sol (October) / GPT-6 Luna (October)，发布日=2026-10-07，evidence 条数 **106** = v✓ 90 / p⏳ 16）。
    - 发布日证据（一手）：官方发布页 `https://openai.com/index/gpt-6-for-everyone/` 文章头部印刷日期行「2026年10月7日」；交叉确认：部署安全中心系统卡 `https://deploymentsafety.openai.com/gpt-6-october` 印刷日期行「Published October 7, 2026」，以及官方 news RSS 同条 pubDate（07 Oct 2026）。
    - 归档：`models/2026-10-07-gpt-6-october/`（`page.html` 644,646 B + `system-card.html` 387,274 B + `images/figure-1..7.png` 七张系统卡原图 + `index.md` + `manifest.json`）。
    - 发布内容：搭载「智能界面」的 GPT-6 当天起面向全球 ChatGPT Plus / Pro / Business / Enterprise 推出，次日扩展到免费版与 Go；付费档底层为 GPT-6 Sol、免费档与 Go 为 GPT-6 Luna，两款都针对日常对话调优；本次更新只作用于「聊天」体验，不改变「工作」模式与 Codex 使用的模型。GPT-6 Instant 未出现在 API 模型列表中，属 ChatGPT 侧档位而非 API 模型。
    - 评测来源：系统卡 11 张 DOM 机读表（生产安全基准、U18 安全、图像输入安全、GPT-Red 提示注入、HealthBench 四变体、MentalHealthBench 四分档、对抗式用户模拟动态评测、生物化学 High / Critical 阈值、生物模型拒答、网络安全安全评测）+ 4 项正文明文（ExploitBench、SEC-Bench Pro、指令层级鲁棒性、Respecting Warnings）。同一表格中的 GPT-5.5 Instant / GPT-5.6 Luna / GPT-5.6 Sol 等列按契约只写进本行 notes，不拆成独立行。
    - 规格：上下文窗口 1,050,000 token、最大输出 128,000 token；GPT-6 Sol $2.00 / $10.00 每百万 token，GPT-6 Luna $0.10 / $0.50 每百万 token（取自 OpenAI API 官方模型文档页 `developers.openai.com/api/docs/models/gpt-6-sol` 与 `/gpt-6-luna`，2026-10-20 抓取）；参数量官方未明示，记 null。
    - 发布页另有两项不构成标准公开基准的内部评测结论——「高价值日常智能体任务」内部评测中 GPT-6「极高」档与 GPT-5.6「中」档同时开始回答且综合得分高于 GPT-5.6「极高」档；需要网页搜索的问题上 GPT-6「即时」档开始回答所需时间比 GPT-5.6「即时」档平均缩短 44%——官方未给基准名与绝对数值，按「不臆造数值」纪律只记入 release notes，不建 evidence 行。
  - `gemini-4-argon-ga`（vendor=google，模型=Gemini 4 Argon，发布日=2026-10-13，evidence 条数 **6** = v✓ 6 / p⏳ 0）。
    - 发布日证据（一手）：官方发布页 `https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/` 文章头部印刷日期行「Oct 13, 2026」；交叉确认：Google DeepMind 官方博客 RSS 同条 pubDate（Tue, 13 Oct 2026）。
    - 归档：`models/2026-10-13-gemini-4-argon-ga/`（`page.html` + 同日 `safety-post.html`、`robotics-post.html` + `index.md` + `manifest.json`；本页评测数值全为正文明文、无评测图表，故无 `images/`）。
    - 发布内容：Gemini 4 Argon 正式面向所有人开放（既有 `gemini-4-argon` 为 2026-09-30 限量首发，仅向 Fairwind Program 可信网络防御者开放）。官方称 1M 统一输入输出 token 上限；开放期每百万输入 $2 / 输出 $10（缓存输入 95% 折扣），2026-11-30 期后调整为 $4 / $20；官方另称在 Vals Index 排名第一（排名而非分数，不建 evidence 行）。
    - 评测（正文明文）：ERQA 87%、RareBench 57%、LabBench（wet-lab reasoning）52.2%、Gray Swan 间接提示注入（IPI）攻击成功率 0.7%、编码基准走捷径/作弊尝试率 2%；外部生物安全越狱红队解锁率官方只给上界「<1%」，记 value=null + `not_extracted`。同日的《Developing Gemini 4 Argon responsibly and safely》与《Gemini 4 Argon for Robotics》两文复述同一批数字。
    - 与既有条目的关系：两条 release 指向同一模型 `gemini-4-argon`，按「只追加、不改既有文件」的契约并存而不互相覆盖。
- **新增 evidence：112 条** = 96 verified（DOM 机读表 + 正文明文）+ 16 pending（图表行，数值在图中，视觉读数未转录）。
- **新 benchmark id：29 个**（notes 标 `new-benchmark`）：
  - OpenAI 系统卡侧 25 个：`openai-safe-completions`、`openai-u18-safety`、`openai-vision-safety`、`gpt-red-prompt-injection`、`healthbench-professional`、`healthbench-hard`、`healthbench-consensus`、`mentalhealthbench`、`openai-dynamic-safety-simulations`、`multimodal-troubleshooting-virology`、`protocolqa-open-ended`、`tacit-knowledge-troubleshooting`、`troubleshootingbench`、`shp2-protein-function-prediction`、`coronavirus-ace2-cell-entry-screen`、`phage-plasmid-co-evolution`、`openai-biology-model-refusal`、`openai-cybersecurity-safety`、`respecting-warnings`、`openai-safety-pareto`、`openai-multiturn-jailbreak`、`openai-factuality`、`openai-auto-review-compliance`、`openai-blocker-deception`、`search-tool-failure-disclosure`。
  - Google 侧 4 个：`rarebench`、`gray-swan-ipi`、`google-bio-jailbreak-redteam-unlock`、`google-agent-shortcut-attempts`。
  - 其中 27 个由账本自动生成兜底详情页（`data/generated/auto-benchmark-ids.json` 40 → 67）；`openai-factuality`、`search-tool-failure-disclosure` 为此前批次已登记的自动页，本批沿用。
  - 复用既有实体 5 个：`healthbench`、`exploitbench`、`sec-bench-pro`、`erqa`、`lab-bench`。
- **新厂商：无**。
- **跳过清单**
  - StepAudio 3 系列（TTS / ASR / Gen / Music / Realtime，StepFun）——官方文档页存在（`stepfun.ai/docs/en/guides/models/stepaudio-3-*`），但页面未印发布日期、亦无独立官方发布文，官方 GitHub 与 HuggingFace 仓也无对应模型仓；按「不拿抓取日冒充发布日期」纪律**本轮不建档**，已按 `stepfun-<sha>` 登记 5 条候选进覆盖表（`next_backfill_at = 2026-10-20`）留待存量回填轨道补齐日期证据。
  - MiniMax「Japanese IP / MiniMax H3 IP Edition」（10-13）——基于已建档 MiniMax H3 的联名活动，非独立模型发布。
  - MiniMax Music 2.6（官方页印 2026.1.23）、MiniMax Speech 2.8（2026-01-23）——发布日在增量窗口之外，留待存量回填。
  - Qwen-Drive-1.0（官方研究页标 2026/09/03）——发布日早于增量窗口，留待存量回填。
  - Anthropic（10-07 ~ 10-18 共 7 条）——Expanding the Cyber Verification Program、Building on our commitment to America、Anthropic Cyber Mission、2026 Usage Policy update、An update on independent evaluators、Anthropic opens Singapore office、Investing in the public benefit：政策 / 合作 / 办公与政府备忘录 / 公益 / 评测方法学公告，非独立模型发布。
  - xAI「The X Subscription」（10-12）——产品套餐公告。
  - Meta（10-02、10-14）——Accelerating Scientific Research in Health Data Science With Muse Models（基于既有 Muse 模型的科研应用博客）、Developing Capable Models Responsibly、Solving Open Research Problems Together：科研应用与方法学/合作公告。
  - 字节跳动「Seed Alignment & Preparedness team」（10-14）——招聘公告。
  - OpenAI「Rosalind Academic Plan / chatgpt-for-academic-researchers」（10-15）——学术研究计划公告，非独立模型发布。
  - Google「Gemini 4 Argon for Robotics」（10-13）——同一模型在机器人场景的应用与工程说明文，未发布新模型；其 ERQA 87% 已并入 `gemini-4-argon-ga`。
  - Google「build-with-gemini-4-argon」开发者开放公告——可用性公告，非独立模型发布（覆盖表已登记排除原因）。
  - z.ai / 智谱 GLM——`z.ai/blog/` 本轮直连与无头渲染均被 Cloudflare 拦截（152 字节挑战页），窗口内公告无法巡检；旁证渠道（`zai-org` HuggingFace / GitHub）最新模型仓为 2026-08-25 的 GLM-5.3 与 GLM-5.3-Flash，无窗口内新模型。
  - Qwen——`qwen.ai/blog`、`qwen.ai/research` 与 `qwen.ai/llms.txt` 渲染后无任何 2026-10 条目，窗口内无新发布。
  - 腾讯混元——`hy.tencent.com` 渲染后最新条目 2026-09-22（Hy Image3.5 preview，已建档），窗口内无新发布。
  - 小米——`mimo.xiaomi.com` 列表最新为研究论文（2026-09 / 2026-01），窗口内无新发布。
  - StepFun——除 StepAudio 3 外，`stepfun.ai/research` 与官方 GitHub / HuggingFace 仓最新为 Step-5-Preview 系（已建档），窗口内无新发布。
  - Microsoft——`microsoft.ai/models` 现有 MAI-Code-1.1-Flash、MAI-Voice-2.1、MAI-Transcribe-2、MAI-Thinking-1、MAI-Image-2.6 均已建档，窗口内无新发布。
  - Kimi——`kimi.com/en/blog` 最新为 Kimi K3 / Kimi K2.6 等已建档条目，窗口内无新发布。
  - DeepSeek——官方 news 索引最新为 `news261017`（2026-10-17），已建档。
  - GPT-Live 1（OpenAI，官方 news RSS 标 2026-09-10）——真实 API 模型（`gpt-live-1`，全双工语音，\$0.05/分钟），但发布日早于增量窗口，留待存量回填。
- **待人工核验（16 条图表行，7 张原图已归档至 `models/2026-10-07-gpt-6-october/images/`）**
  - `openai-safety-pareto`（×2 模型）→ `images/figure-1.png`（系统卡 Figure 1，安全—不过度拒答 Pareto 图）
  - `openai-multiturn-jailbreak`（×2）→ `images/figure-2.png`（Figure 2，多轮越狱鲁棒性按攻击预算）
  - `openai-factuality`（Factuality heavy / User flagged failures / High stakes，各 ×2）→ `images/figure-3.png`（Figure 3，事实性错误率）
  - `openai-auto-review-compliance`（×2）→ `images/figure-4.png`（Figure 4，Auto-Review 被禁动作完成率）
  - `respecting-warnings` 已按 Figure 5 图注明文记 verified；`images/figure-5.png`（Figure 5，Respecting Warnings 条件失败率）→ `search-tool-failure-disclosure`（×2）pending
  - `openai-blocker-deception`（×2）→ `images/figure-6.png`（Figure 6，Blocker Deception 披露失败率）
  - `images/figure-7.png`（Figure 7，Broken Search Tool 评测结果）——其数值在系统卡正文中无本模型明文，未建行
  - 人工读图确认后，按账本契约第 2 条只翻转对应 evidence 的 `status`（pending → verified）并补齐 `locator` / `reported_score`。
- **门禁**：`reconcile-coverage` ✓ / `validate-data` ✓（releases 185，official 171，evidence edges 2916）/ `node --test tests/*.test.mjs` ✓ 19 pass 0 fail / `sync:skills:check` ✓ / `npm run build` 全链路 ✓（book validate 32 章通过、EPUB 484 KB、web 32 章 + 695 URL sitemap、benchmarks hub 470 实体页 + 67 自动证据页、`validate-site` ✓）。
- **分支**：`model-release-daily-20261020T010500Z`（自 `origin/main` = 343770c 开出），远端分支保留。
- **本批勘误**：第二十六批小节末句「由厂商全产品线巡检在存□回填轨道上发现」中夹有两个 U+FFFD 替换字符（原文应为「存量」），本批按「不静默覆盖」原则一并还原为「存量」，除此之外未改动任何既有批次内容。

## 第二十八批（2026-10-21 增量窗口 2026-10-05 ~ 2026-10-21）

- **新增 release：4 个**
  - `voxtral-3`（vendor=mistral，模型=Voxtral Small Transcribe 3 / Voxtral Mini Transcribe 3 / Voxtral Mini Transcribe Realtime 3 / Voxtral Speech 3，发布日=2026-10-20，evidence 条数 **18** = v✓ 18 / p⏳ 0）。
    - 发布日证据（一手）：官方发布页 `https://mistral.ai/news/voxtral-3/` 的 JSON-LD `datePublished: 2026-10-20T12:00:22.000Z`；交叉确认：官方 RSS（`https://mistral.ai/rss.xml`）同条 pubDate `Tue, 20 Oct 2026 12:00:22 GMT`。
    - 归档：`models/2026-10-20-voxtral-3/`（`page.html` 585,235 B + `images/` 5 张官方原图 + `index.md` + `manifest.json`）。
    - 发布内容：Mistral 发布 Voxtral 3 语音模型家族——语音转文本（Small / Mini / Mini Realtime 三档）与文本转语音（Voxtral Speech 3，即 Voxtral Mini TTS 3.0），并附带 Voice Agent SDK 与 Pro Voice 音色适配（30 分钟音频复现说话人音色与情绪）；后二者为 SDK 与适配能力而非独立模型，未单列为模型条目。官方明示：转写覆盖 50+ 语种、TTS 覆盖 35+ 语种与 50+ 方言；Mini Transcribe 3 为 4B 参数；转写定价 Mini 批式 0.0035 / Mini Realtime 0.008 / Small 0.0040 USD 每分钟；Voxtral Speech 3 为 13 USD 每百万字符（批式与实时同一 API）；实时端到端轮次检测、亚 500ms 延迟、覆盖 35+ 语种。
    - 评测来源：官方发布页九张评测图表，数值以 `data-value` / `data-display` 属性内嵌于页面图表组件，DOM 机读可逐行核对（与 xAI grok-4-6 一档的处理口径一致）；图表脚注同时载明提示条数、语种清单、音色数、评委模型与单价格取来源，均已随对应行写入 `protocol` 与 `notes`。
    - 收录 18 行：FLEURS 45 指定语种 / 自动检测语种 WER（Small 4.0% / 4.1%，Mini 4.5% / 4.6%）、说话人分离 cpWER（Small 18.4%、Mini 18.6%）、Earnings 22 关键短语召回（含上下文 94.6%、不含上下文 81.4%）、Artificial Analysis WER 指数（Small 2.1%、Mini 2.2%）、FLEURS 35 实时 WER（2400 / 960 / 480 / 240ms 窗口依次 5.7% / 6.0% / 6.4% / 7.4%）、Voice Code Bench 忠实复现片段 80%、读音控制发音准确片段 87%、多语种（11 语种）评委均分 3.16、英文表现力评委均分 3.13。同图竞品列按契约只写进本行 `notes`，不拆成独立行。
  - `hy-memory-30b-a3b`（vendor=tencent，模型=Hy-Memory-30B-A3B，发布日=2026-10-15，evidence 条数 **29** = v✓ 29 / p⏳ 0）。
    - 发布日证据（一手，三处互证）：官方模型仓 `https://huggingface.co/tencent/Hy-Memory-30B-A3B` 创建日 2026-10-15；配套技术报告 arXiv:2610.22196 提交日 2026-10-15（Submitted on 15 Oct 2026）；官方 GitHub 仓 `https://github.com/Tencent-Hunyuan/Hy-Memory` 同批开源。
    - 归档：`models/2026-10-15-hy-memory-30b-a3b/`（官方模型卡原文 + `images/fig1-training-process.png` + `images/fig3-cross-harness-colm.png` + `images/hunyuan-logo.png` + `index.md` + `manifest.json`）。
    - 发布内容：腾讯混元发布 30B 总参 / 3B 激活的 MoE 记忆**写入**模型，官方模型卡定位为在记忆系统里负责「写入」一环；两阶段训练——OPD 阶段提供学生自写状态链的密集教师监督，RL 阶段按 chunk 级信用分配并把选中的记忆库跨窗口传递。
    - 评测来源：官方模型卡 Table 1（跨 harness 六项指标均值）+ Table 2–5（Mem0 / Hy-Memory / MemOS / EverMemOS 四套 harness 下六项指标明细）。官方说明评测只更换记忆写入模型，框架版本、提示词、检索配置、回答模型与评委等其余组件全部固定；主矩阵每项基准在固定 20% 子样本上评估，harness 分为 LoCoMo Judge、LongMemEval、PersonaMem-v2、Travel SPS、Shopping PS、Code Memory Bench 六项等权平均；EverMemOS 对模型完全留出。
    - 收录 29 行：跨 harness 均值 5 行（Mem0 54.02 / Hy-Memory 60.55 / MemOS 50.51 / EverMemOS 56.89 / 四框架总平均 55.49，对照 Claude Opus 5 总平均 54.62、DeepSeek V4.1 Flash 53.64、Hy3 51.63）+ 四套 harness 下六项指标明细 24 行。
  - `youtu-parsing-omni`（vendor=tencent，模型=Youtu-Parsing-Omni，发布日=2026-10，date_precision=month，evidence 条数 **6** = v✓ 6 / p⏳ 0）。
    - 发布日证据（一手）：官方模型仓 `https://huggingface.co/tencent/Youtu-Parsing-Omni` 更新日志写明「**[2026-10]** 技术报告、模型权重、vLLM 插件与推理示例一并发布」，页内未印具体日，故日期精度记到月、仓库目录用 `2026-10-01` 前缀排序，实际发布日待官方后续公告补精确；官方 GitHub 仓 `https://github.com/TencentCloudADP/youtu-parsing` 同批开源。
    - 归档：`models/2026-10-01-youtu-parsing-omni/`（官方模型卡原文 + `index.md` + `manifest.json`；评测数值在模型卡 Markdown 表格中，无独立图片）。
    - 发布内容：腾讯发布 5B 文档解析模型，把整页文档（文字、表格、公式、图表）一次性解析成带结构与层级的 JSON 封装——感知层给出版面元素包围盒、文本、LaTeX/OTSL 表格、Markdown 图表、Mermaid 流程图与阅读顺序。
    - 评测来源：官方模型卡 OmniDocBench v1.6 对照表（19 个系统）。收录 6 行：总分 96.96、文本编辑距离 0.0271、公式 CDM 96.80、表格 TEDS 96.79、表格 TEDS-S 98.20、阅读顺序编辑距离 0.1104；同表其余 18 个系统（TeleOCR 96.91、OvisOCR2 96.47、PaddleOCR-VL-1.6 96.34、MinerU2.5-Pro 95.75、GLM-OCR 95.22、HunyuanOCR-1.5 94.74、Qianfan-OCR 93.90、Youtu-Parsing 93.74、Ovis2.6-30B-A3B 93.70、Logics-Parsing-v2 93.33、FireRed-OCR 93.26、Gemini-3-Pro 92.91、dots.ocr 90.77、OpenDoc-0.1B 90.67、DeepSeek-OCR 2 90.25、Qwen3-VL-235B 89.78、Dolphin-v2 89.50、OCRVerse 88.60）按契约只写进本行 `notes`。
  - `qwen-image-2-1-turbo`（vendor=qwen，模型=Qwen-Image-2.1-Turbo，发布日=2026-10-09，evidence 条数 **0** = v✓ 0 / p⏳ 0）。
    - 发布日证据（一手）：官方 GitHub 仓 `https://github.com/QwenLM/Qwen-Image-2.1` 的 README 更新日志逐条写明「**2026.10.09**: We released Qwen-Image-2.1-Turbo for image generation and editing in just **8 denoising steps**」，同日「Qwen-Image-2.1 Pro and Turbo APIs are now officially live!」；官方模型仓 `https://huggingface.co/Qwen/Qwen-Image-2.1-Turbo` 创建日同为 2026-10-09。
    - 归档：`models/2026-10-09-qwen-image-2-1-turbo/`（官方 README + 官方模型卡原文 + `images/qwen-image-2.1-logo.png` + `index.md` + `manifest.json`）。
    - 发布内容：Qwen-Image-2.1 的加速 checkpoint，沿用同一套 7B 视觉生成架构，文生图与图像编辑压到 8 步去噪，权重自带推荐采样表，Diffusers 经 `QwenImage21Pipeline` 直接加载，默认 CFG=1、前缀 KV 缓存跨去噪步复用文本与参考图上下文，默认分辨率为 2048 档。
    - 状态 `pending`：官方 README 与模型卡只给规格、加载方式与使用示例，未印基准分数与对照表，按「不臆造数值」纪律记 0 行。
    - 与既有条目的关系：本档是已建档 `qwen-image-2-1`（2026-09-20）的后增加速 checkpoint，按变体单独建档、不与首发档案合并；覆盖表中该候选标 `release_match: "manual"`，避免按共享模型卡并入首发档案。
- **新增 evidence：53 条** = 53 verified（DOM 机读图表数值 + 模型卡 Markdown 表格）+ 0 pending。
- **新 benchmark id：14 个**（notes 标 `new-benchmark`）：
  - Mistral 侧 7 个：`cpwer-diarization`（说话人分离质量，官方口径为拼接最小置换 WER）、`keyphrase-recall`（Earnings 22 关键短语召回）、`aa-wer-index`（Artificial Analysis 语音识别综合 WER 指数）、`voice-code-bench`（BeSimple AI 出品的语音合成质量评测）、`pronunciation-control`（读音控制评测）、`tts-multilingual-judge`（11 语种语音合成评委均分）、`tts-expressive-english`（one_eval 英文表现力评委均分）。
  - 腾讯侧 7 个：`memory-writer-harness-matrix`（记忆写入模型跨框架六项指标均值矩阵）、`locomo`（长对话记忆问答）、`longmemeval`（长记忆评测）、`personamem-v2`（个性化记忆评测）、`travel-sps`（旅行规划轨迹成功率）、`shopping-ps`（购物场景轨迹成功率）、`code-memory-bench`（代码记忆问答评测）。
  - 由账本自动生成兜底详情页 14 个（`data/generated/auto-benchmark-ids.json` 67 → 81）。
  - 复用既有实体 2 个：`fleurs`（FLEURS，Voxtral 12 行）、`omnidocbench`（OmniDocBench，Youtu 6 行）。
- **新厂商：无**。
- **跳过清单**
  - OpenAI「Terminal X」（10-20）——客户案例页（Startup 分类），讲述 Terminal X 用 GPT-6.1 Sol / GPT-6 Luna 搭建投资研究工作流，含其自建 Eval Agent 的 88.6% 人工一致率等内部评测结论；非独立模型发布，其涉及的 GPT-6.1 Sol 与 GPT-6 Luna 均为已建档模型。
  - OpenAI 窗口内其余条目——`sharing-ai-progress-in-mathematics`（数学进展研究分享）、`introducing-the-rosalind-academic-plan`（GPT-Rosalind 学术研究计划）、`advancing-computer-use-with-ironclad`（合作方公告）、`the-eus-next-chapter-in-ai-is-agentic`（政策）、`disrupting-ai-enabled-false-front-operations`（安全研究）、以及 20 余条客户案例 / 合作 / 招聘 / 广告与产品公告：均非独立模型发布。
  - Mistral `LIDstral-Arabic` 与 `Voxtral-Mini-4B-Realtime-Arabic`（官方模型仓创建日均为 2026-10-08）——官方新闻 RSS 与 changelog 窗口内均无对应发布公告，模型仓创建日不能单独作为发布日，按「不拿抓取日冒充发布日期」纪律**本轮不建档**，留待存量回填轨道补齐日期证据。
  - Microsoft（tier 2）——`microsoft.ai/blog` 与 `microsoft.ai/models` 本轮直连与无头渲染均被 Cloudflare 拦截（403 / 挑战页），官方 RSS 通道窗口内为空条目；旁证渠道（官方 `microsoft` 模型仓）窗口内新增的 Sentiment-Analysis-7B、scFM-dataselection、UserRepGen-4B 均为研究产物模型而非 MAI / Phi 系列发布，无官方发布文与评测表，本轮不建档。
  - 腾讯混元 `Youtu-Parsing`（官方模型仓 2026-10-09 前既有版本，OmniDocBench 表内已作对照列收录）——非本窗口新发布。
  - 腾讯混元 `Hy-Memory-30B-A3B-GGUF` / `-FP8`（2026-10-16 / 2026-10-19）——同模型的量化权重版本，随主档收录，不另建档。
  - StepFun `Step-5-Preview-NVFP4`（官方模型仓 2026-10-14）——Step-5-Preview（2026-09-19，已建档）的量化权重版本。
  - Google（10-13 ~ 10-20）——`Gemini 4 Argon for Robotics`（同一模型的机器人场景工程说明文）、`Developing Gemini 4 Argon responsibly and safely`（安全说明）、`Accelerating the search for antimicrobial peptides with Google Antigravity`（科研应用）、`New Gemini tools for small business owners`（应用功能更新）、以及 Gemini Notebook / Android Auto / AI Mode / 商店与公益类条目：非独立模型发布。
  - Anthropic（10-05 ~ 10-20）——API 变更日志显示窗口内唯一新模型 Claude Haiku 5.5（2026-10-07）**已建档**；其余为评测方法学、政策、合作、办公与公益公告（`an-update-on-independent-evaluators`、`claude-text-watermark`、`cyber-verification-program`、`singapore-office-opening`、`expanding-support-for-scientists`、`2026-us-midterms`、`distillation-defenses` 等）：非独立模型发布。
  - xAI（10-12 ~ 10-20）——窗口内官方新闻页除已建档的 `grok-voice-3`（2026-10-14）外，仅有 Grok Bot 产品与套餐条目（`incident-sweep` 10-20、`the-x-subscription` 10-12、`team-bots` 09-28、`grok-bot-customer-support` 09-22）：非独立模型发布。
  - 字节跳动——`/en/blog` 返回 404，`/en/public_papers` 最新条目为 2026-09-28，模型页导航所列 Seed2.1 / Seedance 2.5 / Seedream 5.0 Pro / SeedRealtime / Seed Audio 1.0 均已建档，窗口内无新发布。
  - Kimi——`kimi.com/en/blog` 最新为 2026-07-31 条目，窗口内无新发布。
  - 小米——`mimo.xiaomi.com` 列表最新为 2026-06-29 研究论文，窗口内无新发布。
  - DeepSeek——官方 news 索引最新为 `news261017`（2026-10-17），已建档。
  - z.ai / 智谱 GLM——`z.ai/blog` 本轮直连返回 nginx 404（`/blog/feed`、`/rss.xml` 等均 404），无头渲染亦被 Cloudflare 拦截（152 字节挑战页），窗口内公告无法巡检；旁证渠道（官方 `zai-org` 模型仓）最新模型仓为 2026-08-25 的 GLM-5.3 与 GLM-5.3-Flash，无窗口内新模型。
  - Qwen——`qwen.ai/blog?id=qwen-image-2.1` 官方博客页正文为客户端渲染，本轮无头渲染与爬虫 UA 均未取到渲染后正文，Turbo 的官方规格改由官方 GitHub 仓 README 与官方模型仓取证；`qwen.ai/blog` 索引页渲染后亦无任何 2026-10 条目。
- **待人工核验**：本批无图表行——九张 Voxtral 3 评测图表的数值以 `data-value` / `data-display` 属性内嵌于页面图表组件，DOM 机读可逐行核对，已按 DOM 明文收录，未产生只存在于位图中的数值行。
- **门禁**：`reconcile-coverage` ✓ / `validate-data` ✓（releases 189，official 175，evidence edges 2969）/ `node --test tests/*.test.mjs` ✓ 19 pass 0 fail / `sync:skills:check` ✓ / `npm run build` 全链路 ✓（book validate 32 章通过、EPUB 484 KB、web 32 章 + 699 URL sitemap、benchmarks hub 470 实体页 + 81 自动证据页、`validate-site` ✓：814 HTML / 36124 内部引用 / 236 时间轴 / 2046 事件卡片）。
- **分支**：`model-release-daily-20261021T010000Z`（自 `origin/main` = 864a4c3 开出），远端分支保留。

## 第二十九批（2026-10-21 增量窗口 2026-10-06 ~ 2026-10-21）

- **窗口**：增量窗口 2026-10-06 ~ 2026-10-21（检查点锚点 `last_max_release_date=2026-10-20` 回退 14 天重叠）；检查点回写 `last_scan_at=2026-10-21`、`last_max_release_date=2026-10-20`（本批未引入晚于锚点的新发布日期）。
- **本批新增 release：2 个**（均为存量回填轨道，窗口内增量无新发布）
  - `minimax-music-3`（vendor=minimax，模型=MiniMax Music 3.0，发布日=2026-08-13，evidence 条数 **0** = v✓ 0 / p⏳ 0）。
    - 发布日证据（一手）：官方研究页 `https://www.minimax.io/blog/minimax-music-3-0-next-generation-open-weights-production-ready-versatile-music-model` 文章头部印刷日期行 `<time>2026-08-13</time>`；站点导航 SPEECH & MUSIC 菜单项下列出 “MiniMax Music 3.0” 并指向同一篇文章，交叉确认。
    - 归档：`models/2026-08-13-minimax-music-3/`（官方研究页原样存档 `page.html` + `images/` 8 张页面图片原样下载 + `index.md` + `manifest.json`）。
    - 发布内容：MiniMax 下一代音乐生成模型，给定创意概念与可选歌词完成作曲、编曲、演唱与混音，输出完整歌曲。技术栈三件套：多层 RVQ 分词器（首层 16,384 条目码本、第 2–8 层各 1,024 条目）+ 8B Global LLM（初始化自 Qwen3.5-8B）与 0.6B Local LLM 组成的 Hybrid-LM + 2.4B flow matching 模块与 123M Flow-VAE 的合成栈；另新增细粒度时间分辨率的 Structured Captions、歌词段落标签（intro/verse/pre-chorus/chorus/bridge/instrumental/solo/outro）与模板化 Prompt Enhancement System。开放权重，但许可证与参数档位官方未明示。
    - 状态 `pending`：页面正文未给出任何离散基准跑分数值——出现的数字均为模型规模与工程指标（16,384 / 1,024 码本条目数、8B / 0.6B / 2.4B / 123M、Qwen3.5-8B 初始化来源），不构成标准公开评测，按「不臆造数值」纪律记 0 行。页内表格为「用户 prompt / 歌词 / Demo」生成样例对照表，非评测数据，不转录为评测行。
    - 未明示项：上下文长度、绝对定价、权重许可证与参数档位均记 null。
  - `minimax-speech-28`（vendor=minimax，模型=MiniMax Speech 2.8，发布日=2026-01-23，evidence 条数 **0** = v✓ 0 / p⏳ 0）。
    - 发布日证据（一手）：官方新闻页 `https://www.minimax.io/news/minimax-speech-28` 文章头部印刷日期行 “2026.1.23”；站点导航 SPEECH & MUSIC 菜单项下列出 “MiniMax Speech 2.8” 并指向同一篇文章，交叉确认。
    - 归档：`models/2026-01-23-minimax-speech-28/`（官方新闻页原样存档 `page.html` + `images/` 6 张页面图片原样下载 + `index.md` + `manifest.json`）。
    - 发布内容：语音合成模型 Speech 2.8，用原生拟声标签（Native Sound Tags）建模 “um”“uh”“ah” 等口语填充词并保留呼吸与停顿；优化特征提取流程，10 秒样本即可完成高保真声音克隆；新增 Pure Audio 以消除背景噪声与数字伪影。
    - 状态 `pending`：页面正文未给出任何离散基准跑分数值——出现的数字仅为功能演示参数（10 秒克隆样本时长），不构成标准公开评测，按纪律记 0 行。页面里的 Original Audio / Speech-2.8 Cloned Result 为人耳试听演示对照，非客观评测分数，不转录为评测行；官方全文亦未给出 WER/CER 等可量化指标。
    - 未明示项：参数量、上下文长度、绝对定价均记 null。
- **新增 evidence：0 条**（本批两个 release 的官方发布文均未报告标准公开评测数值，按「无数值一律不记」纪律记 0 行、状态 pending）。
- **新 benchmark id：无**。
- **新厂商：无**。
- **跳过清单**
  - OpenAI「Democratic governance of frontier AI, part II: Empowering cyber defenders」（2026-10-21）——全球事务/治理类政策文章，非独立模型发布，覆盖表候选 `openai-e270f5ba4688` 已标排除理由。
  - Kimi Code CLI 文档页两则——「Tower multi-agent collaboration」与「Kimi Datasource」属 CLI 工具使用文档，非独立模型发布，覆盖表候选 `kimi-35483a7872f3`、`kimi-71080e78b742` 已标排除理由。
  - OpenAI 窗口内其余条目——客户案例与产品公告（广告业务、客户案例、招聘等）：非独立模型发布。
  - StepFun `stepaudio-3` 系列（gen / music / asr / realtime / tts）——官方文档页存在但未印发布日，候选已带排除理由，本轮不建档。
  - Anthropic（10-18 ~ 10-21）——窗口内条目为公益基金、政策与产品公告，非独立模型发布。
  - Google（10-20 ~ 10-21）——窗口内条目为应用功能与研究类文章，非独立模型发布。
  - xAI / Meta / z.ai 智谱 / StepFun 研究页——本轮直连不可达或被挑战页拦截，无窗口内新发布可确认。
- **待人工核验**：本批无图表行——两个 release 的官方页面均无标准公开评测数值，故不产生只存在于位图中的数值行；页面图片已原样归档，供人工复核。
- **门禁**：`validate-data` ✓（releases 191，official 177，evidence edges 2969）/ `node --test tests/*.test.mjs` ✓ 19 pass 0 fail / `sync:skills:check` ✓ 技能镜像无漂移；`npm run build` 全链路结果见本批 Issue 证据回执。
- **分支**：见本批 Issue 证据回执（远端分支保留，不自动合并）。


## 第三十批（2026-10-22 增量窗口 2026-10-06 ~ 2026-10-22）

- **窗口**：增量窗口 2026-10-06 ~ 2026-10-22（检查点锚点 `last_max_release_date=2026-10-20` 回退 14 天重叠）；检查点回写 `last_scan_at=2026-10-22`、`last_max_release_date=2026-10-20`（本批未引入晚于锚点的新发布日期）。
- **本批新增 release：5 个**（增量窗口内确无新发布；五个均为存量回填轨道，由官方 GitHub / 模型仓 / 官方博客与官方新闻 RSS 交叉发现）
  - `gpt-rosalind`（vendor=openai，模型=GPT‑Rosalind，发布日=2026-04-16，evidence 条数 **9** = v✓ 9 / p⏳ 0）。
    - 发布日证据（一手，两处互证）：官方发布文 `https://openai.com/index/introducing-gpt-rosalind/` 正文头部印出日期行 `April 16, 2026`；官方新闻 RSS（`openai.com/news/rss.xml`）该文条目时间为 Thu, 16 Apr 2026 01:00:00 GMT。官方 sitemap 另有两条同系列后续文（`introducing-new-capabilities-to-gpt-rosalind` 2026-06-03、`strengthening-societal-resilience-with-rosalind-biodefense` 2026-05-29）与一条学术计划文（`introducing-the-rosalind-academic-plan` 2026-10-15），均属同一模型的后续动作，不另建档。
    - 归档：`models/2026-04-16-gpt-rosalind/`（英文渲染后 DOM 存档 `page.html` + `images/fig1-life-sciences-plugin.png` + `index.md` + `manifest.json`）。
    - 发布内容：OpenAI 面向生物学、药物研发与转化医学的前沿推理模型系列，官方定位为「把更好的工具调用能力与对化学、蛋白质工程、基因组学的更深理解结合起来」，以受信访问计划（trusted access program）在 ChatGPT、Codex 与 API 开放，并随附可连接 50+ 科学工具与数据源的 Codex 生命科学研究插件；官方列出 Amgen、Moderna、Allen Institute、Thermo Fisher Scientific 等合作方。
    - 评测来源：官方「性能与评估」章节的柱状图是页面内嵌 Vega 图表，数值同时存在于渲染后 SVG 的无障碍文本与 RSC payload 的 `vegaLiteSpec.data.values`，属 DOM 机读可逐行核对；官方「行业评估」章节另有 BixBench、LABBench2 的定性结论与一段与 Dyno Therapeutics 合作的 RNA 序列评估。收录 9 行：五个能力维度得分 5 行（Chemistry 0.662 / Biochemistry and protein understanding 0.367 / Phylogenetics 0.163 / Experimental design and analysis 0.647 / Tool usage 0.578，均附 95% 置信区间）、BixBench 与 LABBench2 两行无数值结论、与 Dyno 合作的两行人类专家百分位（预测 >95%、生成约 84%）。
    - 口径提示：五个能力维度得分是官方 0–1 标度的综合能力分（每柱附置信区间），并非单一标准公开基准的绝对分；与 Dyno 合作的 RNA 序列评估使用未公开样本与未公开的 57 份人类专家历史评分，无法复现，notes 已注明。
  - `glm-ocr`（vendor=glm，模型=GLM-OCR，发布日=2026-01-30，evidence 条数 **13** = v✓ 1 / p⏳ 12）。
    - 发布日证据（一手，三处互证）：官方 Hugging Face 模型仓 `https://huggingface.co/zai-org/GLM-OCR`（权重与官方模型卡）创建日 2026-01-30；官方 GitHub 仓 `zai-org/GLM-OCR` 的 News 首条为 2026.2.12（GLM-OCR 微调教程），说明模型在 2026-02-12 之前已公开；官方技术报告 arXiv:2603.10910 提交日 2026-03-11（官方仓 News 记 2026.3.12 技术报告上线）。权重上线日早于技术报告日，本档以权重与模型卡上线日 2026-01-30 为发布日。
    - 归档：`models/2026-01-30-glm-ocr/`（官方模型卡原文 `page.html` + `images/fig1-docparse.png` + `images/fig2-realworld.png` + `images/fig3-speed.png` + `index.md` + `manifest.json`）。
    - 发布内容：0.9B 轻量多模态 OCR 模型，建在 GLM-V 编码器-解码器架构上（0.4B CogViT 视觉编码器 + 0.5B GLM 语言解码器），引入 MTP 损失与稳定全任务强化学习，配套 PP-DocLayout-V3 版面分析 + 并行区域识别两阶段流水线，MIT 许可。
    - 收录 13 行：正文明文 1 行（OmniDocBench V1.5 = 94.62，官方称整体排名第一）+ 官方位图评测表的 12 行图内读数（6 项公共基准：OCRBench 94.0、UniMERNet 96.5、PubTabNet 85.2、TEDS_TEST 86.0、Nanonets-KIE 93.7、Handwritten-Forms 86.1；6 项官方真实场景集：Code 84.7、Real-world Table 91.5、Handwriting 87.0、Multi-language 69.3、Seal 90.5、Receipt (KIE) 94.5）。位图行按纪律记无数值、图内读数写入 notes。
    - 未明示项：上下文长度与 API 定价官方未印，账本记 null；官方给出的解析吞吐（PDF 1.86 pages/s、图像 0.67 images/s）是工程指标，未立行。
  - `glm-4-6v`（vendor=glm，模型=GLM-4.6V / GLM-4.6V-Flash，发布日=2025-12-08，evidence 条数 **68** = v✓ 0 / p⏳ 68）。
    - 发布日证据（一手）：官方发布文 `https://z.ai/blog/glm-4.6v` 正文头部印出日期行 `2025-12-08`，正文以 "Today, we officially introduce and open-source the GLM-4.6V series" 宣告开源；官方 GitHub 仓 `zai-org/GLM-V` 的 Model Overview 收录该系列。
    - 归档：`models/2025-12-08-glm-4-6v/`（渲染后 DOM 存档 `page.html` + `images/fig1-benchmarks.jpg`（原图 10101×7371）+ `index.md` + `manifest.json`）。
    - 发布内容：智谱开源的 GLM-4.6V 系列多模态模型，一次放出 GLM-4.6V（106B A12B，云端与高性能集群）与 GLM-4.6V-Flash（9B，本地部署与低延迟）两个版本，训练上下文 128k，主打原生多模态工具调用（图片、截图、文档页可直接作为工具入参）、图文交错内容生成、128k 长文档理解与前端复刻。
    - 收录 68 行：官方评测位图大表共 34 项开放权重基准 × 两个自家版本 = 68 行；正文只给定性论断、未印任何明文分数，位图行按纪律记无数值、图内读数写入 notes。大表 8 个模型列中另 6 列为 GLM-4.5V、GLM-4.1V-9B-Thinking、Qwen3-VL-8B-Thinking、Qwen3-VL-235B-A22B-Thinking、Kimi-VL-A3B-Thinking-2506、Step3 321B，其中带 * 的数值为官方标注的第三方引用值。
    - 未明示项：官方大表未标单位与评测协议（账本按仓内惯例以 percent 记单位、协议字段留空），API 定价官方未明示，记 null。
  - `auk`（vendor=tencent，模型=AuK / AuK-Flash，发布日=2026-09-09，evidence 条数 **13** = v✓ 13 / p⏳ 0）。
    - 发布日证据（一手，两处互证）：官方 Hugging Face 模型卡 `https://huggingface.co/tencent/AuK` 的 News 首条印出「**[2026/09/09]** AuK is now open-source」；官方技术报告 arXiv:2609.08936（*AuK Technical Report*）提交日 2026-09-08；官方 GitHub 仓 `Tencent-Hunyuan/AuK` 同批开源。
    - 归档：`models/2026-09-09-auk/`（官方技术报告 HTML 存档 `page.html` + `images/fig1-performance.png`（官方仓 README 性能位图）+ `index.md` + `manifest.json`）。
    - 发布内容：1.5B 开放权重语音生成与编辑基础模型，用统一自然语言指令接口覆盖零样本/指令 TTS、内容与声学编辑、韵律编辑、语音增强与源分离；训练规模约 30.3 亿条指令-音频样本、195 万小时有效监督；变体 AuK（EMA 后训练，Euler 32 步）与 AuK-Flash（任务路由蒸馏，4 步推理，4.5× 墙钟加速）。
    - 评测来源：官方技术报告的 HTML 真表（可机读）——语音生成 Seed-TTS-Eval（WER / SIM）、指令 TTS InstructTTSEval（DSD-ZH / DSD-EN）、通用语音编辑 MMAE（IFR / CR / EMR）、语音增强 DNS Challenge（DNSMOS-OVRL / UTMOS / dWER / SIM）。收录 13 行：AuK 11 行 + AuK-Flash 2 行（Seed-TTS-Eval 的 WER 2.85 与 SIM 0.790）。官方报告另含 SpeechEditBench、CHiME-4、Libri2Mix、VCTKSR 与 VAE 对比表，本批未逐项收录，留作后续补档。
    - 未明示项：上下文长度与 API 定价官方未印，账本记 null；各表未披露评委模型、采样次数与音频预处理细则，协议字段相应留空。
  - `seed-gr-rl`（vendor=doubao，模型=Seed GR-RL，发布日=2025-12-02，evidence 条数 **1** = v✓ 1 / p⏳ 0）。
    - 发布日证据（一手）：字节跳动 Seed 官方模型页 `https://seed.bytedance.com/en/gr_rl` 页头在模型名旁印出日期行 `December 2, 2025`（渲染后 DOM 原文），同页提供 Tech report 链接。
    - 归档：`models/2025-12-02-seed-gr-rl/`（渲染后 DOM 存档 `page.html` + `images/fig1-hero.jpg` + `images/fig2-three-stage-pipeline.png` + `images/fig3-architecture.png` + `images/fig4-task-photo-a.jpg` + `images/fig5-task-photo-b.jpg` + `index.md` + `manifest.json`）。
    - 发布内容：机器人强化学习框架，把通用视觉-语言-动作策略训练成擅长长时程灵巧操作的专用策略；官方主张人类演示在灵巧高精度任务里可能嘈杂且次优，训练分三阶段（离线数据过滤 → 物理对称性增强 → 在线转向强化学习）。
    - 收录 1 行：官方正文明文的穿鞋带任务成功率 83.3%（消融链 45.7 → 61.6 → 72.7 → 83.3 写入该行 notes）。官方未给出任何标准公开基准成绩，该指标为厂商自建任务的真实世界自评值。
    - 未明示项：参数量、上下文长度与定价官方未印，账本记 null；官方页另有两张成功率图表的数值只存在于像素中，已归档留证、未另立行。
- **新增 evidence：104 条** = 24 verified（官方正文明文 + DOM 机读 Vega 图表数值 + 官方技术报告 HTML 真表数值）+ 80 pending（官方位图评测大表的图内读数行）。
- **新 benchmark id：29 个**（notes 标 `new-benchmark`）：
  - OpenAI 侧 2 个：`life-sciences-capability-score`（官方生命科学五个能力维度的 0–1 综合得分，附 95% 置信区间）、`rna-sequence-human-expert-percentile`（与 Dyno Therapeutics 合作的 RNA 序列评估，换算为「超过的人类专家百分位」）。
  - 智谱 GLM 侧 21 个：`wemath`、`design2code`、`flame-react-eval`、`webquest-singleqa`、`webquest-multiqa`、`chartqapro`、`chartmuseum`、`omnispatial`、`refcoco-avg`、`treebench`、`ref-l4-test`（GLM-4.6V 官方大表列名）；`unimernet`、`pubtabnet`、`teds`、`nanonets-kie`、`handwritten-forms`（GLM-OCR 官方评测表公共基准）；`glm-ocr-realworld-code`、`glm-ocr-realworld-table`、`glm-ocr-realworld-handwriting`、`glm-ocr-realworld-multi-language`、`glm-ocr-realworld-seal`、`glm-ocr-realworld-receipt-kie`（GLM-OCR 官方真实场景自建集）。
  - 腾讯混元侧 4 个：`seed-tts-eval`（字节 Seed-TTS-Eval 语音合成评测集，WER 与 SIM 两组指标）、`instruct-tts-eval`（指令式 TTS 评测集，DSD-ZH / DSD-EN 子集）、`mmae`（通用语音编辑评测集，IFR / CR / EMR 三项指标）、`dns-challenge`（语音增强评测集，DNSMOS-OVRL / UTMOS / dWER / SIM 四项指标）。
  - 字节跳动侧 1 个：`shoelace-lacing-success-rate`（官方自建的长时程灵巧操作任务「穿鞋带」成功率）。
  - 复用既有实体 23 个（`omnidocbench`、`mmbench`、`mmstar`、`blink`、`muirbench`、`mmmu`、`mmmu-pro`、`video-mmmu`、`mathvista`、`ai2d`、`dyna-math`、`zerobench-sub`、`mm-browsecomp`、`osworld`、`androidworld`、`webvoyager`、`mmlongbench`、`lvbench`、`ocrbench`、`ocr-bench-v2`、`charxiv-reasoning`、`bixbench`、`labbench2`）。
- **新厂商：无**。
- **跳过清单**
  - OpenAI 窗口内条目（10-15 ~ 10-21）——`introducing-the-rosalind-academic-plan`（10-15，学术计划公告，面向符合条件实验室的资助与使用计划，非新模型发布，其涉及的 GPT‑Rosalind 本批已按 2026-04-16 的首发文建档）、`openai-models-google-cloud`（分发合作）、`terminal-x`（客户案例，88.6% 为其自建 Eval Agent 的人工一致率，涉及的 GPT-6.1 Sol 已建档）、`att-legal` 等客户案例、以及政策/安全/广告/生物数据类研究文：非独立模型发布。
  - Mistral `Mistral Advances AI for Engineering with NVIDIA`（2026-10-21）——与 NVIDIA 的合作公告，官方说明将联合开发物理与智能体评测基准，页面未发布新模型、亦无任何评测数值；涉及的 Mistral Large 4 已建档。
  - Anthropic（10-15 ~ 10-22）——窗口内条目为人员任命、公益基金、政策与安全公告；最新模型仍是已建档的 Claude Haiku 5.5（2026-10-07）。
  - Google（10-06 ~ 10-22）——`blog.google` 三条 RSS（`/rss/`、`/technology/ai/rss/`、`deepmind.google/blog/rss.xml`）窗口内无新模型条目，`Gemini 4 Argon`（10-13）及其工程/安全说明文已建档；`Nano Banana 2`（2026-02-26）与 `Nano Banana 2 Lite`（2026-06-30）两篇官方 DeepMind 博文对应的图像模型线在账本中尚无独立档案（官方页为位图、无数值），本批未建档，留作后续补档。
  - xAI（10-12 ~ 10-20）——窗口内除已建档的 `grok-voice-3`（10-14）外为 Grok Bot 与订阅类条目；Grok 4.7（2026-08）已建档。
  - Meta——官方博客最新条目为 2026-07-27 的 Muse Spark 1.1 等，窗口内无新发布。
  - 字节跳动——`/en/blog` 返回 404，模型页导航所列 Seed2.1 / Seedance 2.5 / Seedream 5.0 Pro / SeedRealtime / Seed Audio 1.0 均已建档，窗口内无新发布；`/en/gr_rl` 为存量模型页，本批已建档。
  - 腾讯混元——`Hy-Memory-30B-A3B-GGUF`（2026-10-19）、`Hy-Memory-30B-A3B-FP8`（2026-10-16）、`Qwen3-8B-DSpine-b16`（2026-10-16）为同模型量化权重版本，不另建档；`UniRL`、`CL-bench`、`Prism`、`AuK` 仓中的框架与基准研究仓中，`AuK` 本批已建档，其余为框架/基准/训练技巧研究产物，非独立模型发布。
  - DeepSeek——官方 news 索引最新为 `news261017`（2026-10-17），已建档；官方模型仓最新仓同为该模型。
  - Kimi——`kimi.com/en/blog` 最新条目为 2026-07-31（Kimi K3），窗口内无新发布。
  - 小米——`mimo.xiaomi.com` 列表最新为 MiMo-V2-Flash（2025-12-16）与既有研究文，无窗口内新发布。
  - z.ai / 智谱 GLM——`z.ai/blog` 索引页与 `z.ai/blog/glm-ocr` 本轮直连与无头渲染均被挑战页拦截（152 字节），GLM-OCR 的官方证据改由官方 GitHub 仓、官方模型卡与官方技术报告取证；窗口内 z.ai 无可确认的新发布。
  - StepFun（tier 2）——`stepfun.ai/research` 渲染后最新为 Step 5 Preview（已建档）与 StepAudio 3 系列（官方文档页未印发布日，候选已带排除理由），无窗口内新发布。
  - Microsoft（tier 2）——`microsoft.ai/blog` 渲染后最新条目为 2026-10-15 之前的内容，窗口内无新 MAI / Phi 发布；官方 `microsoft` 模型仓窗口内新增仓均为研究产物模型。
  - Qwen——`qwen.ai/research` 渲染后最新日期为 2026-09-20，窗口内无新发布；官方模型仓最新为已建档的 Qwen-Image-2.1-Turbo（2026-10-09）。
  - OpenRouter 查漏（`created` 字段仅作线索）——窗口内上线的 `recursive/flint-v1.0`、`reflection/beam-1.0`、`inception/mercury-3`、`moondream/moondream3*`、`xingchen-agi/xing4.0`、`nvidia/nemotron-3.5-super-vl`、`liquid/lfm-2.5-24b-a2b` 等均属未注册厂商或非在册产品线，接入需人工决策（注册厂商 + 取真实彩色 logo + 登记 LOGO_EXT），本批不动。
- **待人工核验**：GLM-4.6V 官方评测大表（68 行）与 GLM-OCR 官方两张评测位图（12 行）的数值只存在于图片像素中，按纪律记无数值、图内读数已逐行转写进各行 notes 与归档 `index.md`，读图确认后方可补数值。GLM-OCR 的解析吞吐位图（`fig3-speed.png`）为工程指标，未立行。
- **门禁**：`reconcile-coverage` ✓ / `validate-data` ✓（releases 196，official 182，evidence edges 3073）/ `node --test tests/*.test.mjs` ✓ 19 pass 0 fail / `sync:skills:check` ✓ / `npm run build` 全链路 ✓（含 book validate 32 章、EPUB、web 构建与 `validate-site`）。
- **分支**：`model-release-daily-20261022T010000Z`（自 `origin/main` = 093ccfd 开出；开批前先把上一批遗留的 PR #18「第二十九批」squash 合并进 main 并确认其 CI 为绿），远端分支保留、不删除。


## 第三十一批（2026-10-22 增量窗口 2026-10-06 ~ 2026-10-22）

- **窗口**：增量窗口 2026-10-06 ~ 2026-10-22（检查点锚点 `last_max_release_date=2026-10-20` 回退 14 天重叠）；本批窗口与第三十批相同——上一批窗口内未发现新发布，锚点未前进，窗口随之保持不变。检查点回写 `last_scan_at=2026-10-22`、`last_max_release_date=2026-10-20`（本批未引入晚于锚点的新发布日期，锚点只前进不回退；本轮扫描与第三十批同处 UTC 2026-10-22，故检查点取值与上一批一致）。
- **本批新增 release：2 个 / 3 个模型**（增量窗口内确无新发布；两个均为存量回填轨道，正是第三十批跳过清单中明确「留作后续补档」的 Google 图像模型线缺口，本批结清该交接）
  - `nano-banana-2`（vendor=google，模型=Nano Banana 2 / Gemini 3.1 Flash Image，发布日=2026-02-26，evidence 条数 **0** = v✓ 0 / p⏳ 0，`status: pending`）。
    - 发布日证据（一手，机器可读）：官方发布文 `https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/` 的 HTML meta `article:published_time` 印出 `2026-02-26`，JSON-LD `datePublished` = `2026-02-26T16:00:00+00:00`（`dateModified` = `2026-03-19T17:48:15.796286+00:00`，说明官方事后编辑过正文，发布日以 `published_time` 为准）。
    - 归档：`models/2026-02-26-nano-banana-2/`（官方页原文存档 `page.html` + `images/fig1-nano-banana-2-hero.webp` + `images/fig2-nano-banana-2-subject-consistency.webp` + `images/fig3-nano-banana-2-asset-demo.webp` + `images/fig4-nano-banana-2-social-card.png` + `index.md` + `manifest.json`）。
    - 发布内容：Google 的新一代图像生成模型，官方定位「把 Nano Banana Pro 的进阶能力与 Gemini Flash 的速度结合起来」——以 Flash 速度提供 Pro 级世界知识、精确文字渲染与翻译、主体一致性（单次工作流最多保留五个角色、14 个物件的保真度）、分辨率 512px 至 4K；随 Gemini app 推出并替换 Fast / Thinking / Pro 档的 Nano Banana Pro，同步进入 Search（AI Mode 与 Lens）、Ads、Flow（成为默认图像生成模型）、AI Studio 与 Gemini API（预览）、Vertex AI（预览），沿用 SynthID + C2PA Content Credentials 的来源标记（官方称 SynthID 验证功能自 11 月上线以来已使用逾 2000 万次）。
    - 评测来源：官方发布文正文**未印出任何离散基准跑分数值**，与 Nano Banana 2 的对比表（Elo / 延迟 / 每千张成本）在官方页上以**位图**呈现；按「不臆造数值」纪律 evidence 记 0 行、`status: pending`。
    - 未明示项：参数量、上下文长度与 API 定价官方未印，账本记 null。
  - `nano-banana-2-lite`（vendor=google，模型=Nano Banana 2 Lite / Gemini 3.1 Flash Lite Image **与** Gemini Omni Flash / `gemini-omni-flash-preview`，发布日=2026-06-30，evidence 条数 **4** = v✓ 3 / p⏳ 1，`status: verified`）。
    - 发布日证据（一手，机器可读）：官方发布文 `https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-omni-flash-nano-banana-2-lite` 的 HTML meta `article:published_time` 印出 `2026-06-30`，JSON-LD `datePublished` = `2026-06-30T16:00:00+00:00`（`dateModified` = `2026-06-30T16:19:32.696637+00:00`）。
    - 归档：`models/2026-06-30-nano-banana-2-lite/`（同一篇官方发布文原文存档 `page.html` + `images/fig1-nano-banana-2-lite-omni-flash-keyart.png` + `images/fig2-nano-banana-2-lite-performance-benchmark.gif` + `images/fig3-nano-banana-family-model-table.gif` + `images/fig4-gemini-omni-flash-video-editing-benchmark.webp` + `index.md` + `manifest.json`）；一篇官方文同时发布两个模型，按 `gemini-3` 的先例合为一个 release、两行 `models[]`。
    - 发布内容（模型一）Nano Banana 2 Lite：Nano Banana 家族「最快、最省」的一档，官方称文生图**延迟 4 秒**、**每千张 1K 分辨率图片 0.034 美元**，官方建议用它替换仍在用的第一代 `gemini-2.5-flash-image`；覆盖 Google AI Studio、Gemini API、Gemini Enterprise Agent Platform，以及 AI Mode in Search、Gemini app、NotebookLM、Google Photos、Stitch、Flow、Ads 等消费端，沿用 SynthID 水印。
    - 发布内容（模型二）Gemini Omni Flash：视频生成 + 对话式编辑模型（`gemini-omni-flash-preview`），官方定价**每秒视频输出 0.10 美元**（官方称与 Veo 3.1 Fast 同价），原生支持文本 / 图像 / 视频多模态输入，当前**单次生成上限 10 秒**、音频参考与场景外延在 Gemini API 尚不支持，以公开预览形态进入 Google AI Studio 与 Gemini API，同步进入 Gemini app 与 Google Flow。
    - 收录 4 行：正文明文 3 行（文生图延迟 4 秒、每 1K 张 1K 分辨率图 0.034 美元、每秒视频输出 0.10 美元）+ 官方位图对比表 1 行（Elo / 延迟 / 每 1K 图成本三轴对比，页面只以图注命名、未印任何 Elo 数值，整表为 GIF 位图，按纪律记 `pending` + `score_status: not_extracted`、图内数值未做视觉转写）。三行明文数字均为官方性能对比表三轴在正文中的机读形态，notes 已注明「非标准公开评测集、页面未给出测试规模与统计方式」。
    - 未明示项：参数量、上下文长度官方未印，账本记 null；Omni Flash 的完整评测指向 DeepMind 的 Gemini Omni 专页，本批未取该页数值。
- **新增 evidence：4 条** = 3 verified（官方正文明文）+ 1 pending（官方位图对比表，图内数值未转写）。
- **新 benchmark id：4 个**（notes 标 `new-benchmark`，已随 `data/generated/auto-benchmark-ids.json` 入册，110 → 114）：`nano-banana-2-lite-latency`（官方正文明示的文生图延迟）、`nano-banana-2-lite-image-cost`（官方正文明示的每 1K 张 1K 分辨率图像计价）、`nano-banana-image-performance-benchmark`（官方位图对比表三轴：Elo / 延迟 / 每 1K 图成本）、`gemini-omni-flash-video-output-cost`（官方正文明示的按视频秒数计价）。
- **新厂商：无**。
- **跳过清单**
  - **增量窗口内（2026-10-06 ~ 2026-10-22）**：16 家在册厂商逐条巡检后，窗口内确无新发布——Google 三条 RSS（`/rss/`、`/technology/ai/rss/`、`deepmind.google/blog/rss.xml`）窗口内无新模型条目（`Gemini 4 Argon` 及其工程/安全说明文已建档）；OpenAI、Anthropic、xAI、Meta、DeepSeek、Kimi、Mistral、Qwen、豆包、混元、小米、StepFun、Microsoft 的窗口内条目均为合作公告、客户案例、招聘、研究仓或既有模型的量化/衍生版本，无独立新模型发布；窗口内条目明细与第三十批一致。
  - **StepFun StepAudio 3 系列**（实时交互 / ASR / TTS / 通用音频生成 / 音乐五个模型）——检索到的全部命中均来自第三方站点，官方 `stepfun.ai` 文档页未印发布日；无一手来源即不入账，候选保留在覆盖表的排除理由中。
  - **Nano Banana（Gemini 2.5 Flash Image，首代，2025-08）与 Nano Banana Pro（Gemini 3 Pro Image，2025-11）**——在 NB2 / NB2 Lite 官方文中只作为「家族回顾」被提及，本轮未定位到它们各自的首发官方文与可机读发布日，按「不臆造」纪律本批不入账，留作后续补档。
- **待人工核验**：Nano Banana 2 官方页与 Nano Banana 2 Lite 官方页的性能对比表均为**位图**，其中的 Elo、延迟与成本对比数值只存在于图片像素中（已归档 `fig2-nano-banana-2-lite-performance-benchmark.gif` 与 `fig3-nano-banana-family-model-table.gif` 留证）；本批按纪律不立行、不转写数值，如需入库可由人工读图后补 evidence 行。
- **门禁**：`reconcile-coverage` ✓ / `validate-data` ✓（releases 198，official 184，evidence edges 3077）/ `validate-model-coverage` ✓ / `node --test tests/*.test.mjs` ✓ / `sync:skills:check` ✓ / `npm run validate` ✓ / `npm run build` 全链路 ✓（含 EPUB、web 构建与 `validate-site`）。
- **分支**：`model-release-daily-20261022T231940Z`（自 `origin/main` = d798573 开出），远端分支保留、不删除；本 PR **未自动合并**，等待人工评审。

## 第三十二批（2026-10-23 增量窗口 2026-10-06 ~ 2026-10-23）

- **窗口**：增量窗口 2026-10-06 ~ 2026-10-23（检查点锚点 `last_max_release_date=2026-10-20` 回退 14 天重叠）。检查点回写 `last_scan_at=2026-10-23`、`last_max_release_date=2026-10-20`（本批两个 release 的发布日均为 2026-10-08，早于锚点，**锚点只前进不回退**，不因存量回填把增量窗口拉回）。
- **本批新增 release：2 个**（增量窗口内确无新发布；两个均走**存量回填轨道**，正是第二十八批跳过清单中点名「留待存量回填轨道补齐日期证据」的 Mistral 阿拉伯语模型线，本批结清该交接）
  - `lidstral-arabic`（vendor=mistral，模型=LIDstral Arabic，发布日=2026-10-08，evidence 条数 **4** = v✓ 3 / p⏳ 1，`status: verified`）。
    - 发布日证据（一手，两处互证 + 第三方官方佐证）：官方 Hugging Face 模型仓 `https://huggingface.co/mistralai/LIDstral-Arabic`（权重与官方模型卡）创建日 **2026-10-08T11:37:05Z**；同批发布的 `mistralai/Voxtral-Mini-4B-Realtime-Arabic` 创建于 2026-10-08T11:36:06Z（**相隔 61 秒**，属同一批阿拉伯语模型发布）；官方共同开发方 **Morocco-MTNRA-Labs**（摩洛哥数字化与行政改革部）组织于 2026-10-09T17:20:57Z 镜像同一模型仓，独立佐证模型在 2026-10-09 前已公开。按账本既有先例（第三十批 `zai-org/GLM-OCR` 档：以「权重与官方模型卡上线日」为发布日）取 **2026-10-08**。
    - 取证边界（已逐一核过并记入账本 notes）：Mistral 官方新闻页**全量 92 篇 slug**（含 FR 版同 92 条）、官方 RSS（92 条）、开发者 changelog（窗口内仅 2026-10-06 / 10-20 / 10-22 三条）、官方 GitHub 组织、arXiv（`all:LIDstral`、`all:"Voxtral Arabic"`、`ti:"Arabic" AND all:Mistral` 三组检索均无条目）、API 文档模型总览页——**均无**本次阿拉伯语模型的发布公告；模型仓与官方模型卡是唯一一手发布渠道。另排除一处噪声：Mistral 各新闻页的 `dateModified=2026-10-08T13:46:xx` 是**全站重新生成**的时间戳（`mixtral-8x22b`、`codestral`、`mistral-3`、`le-chat-mistral` 等页同秒同批），非发布证据，已排除。
    - 归档：`models/2026-10-08-lidstral-arabic/`（官方模型卡原文 `page.html` + `images/arabic-country-comparison.png`（2160×2140 官方逐标签 F1 热力图）+ `index.md` + `manifest.json`）。
    - 发布内容：面向阿拉伯语文字的**语种与方言识别**模型，可区分标准阿拉伯语（MSA）、各阿拉伯语方言，以及使用同一文字系统的非阿拉伯语（模型卡明确说明训练中刻意纳入这些非阿语语言，以免仅凭文字系统判成阿拉伯语）。结构为 fastText one-vs-all 分类器 + 64 单元 LayerNorm MLP stacker（144 维特征）+ 逐类 isotonic 校准，共 **51 个受支持类别**；CPU 可运行，权重 Apache-2.0。官方已知限制：模型总是输出 51 类之一，未支持语言与混合语言文本会被强行归类。
    - 收录 4 行：散文明文 3 行（自家 Moroccan Darija F1 **88.67%**；对照 LahjatBERT ALDi CL **72.65%**、GlotLID v3 **71.28%** —— 后两行按抽取口径单列为 `comparison_cited`）+ 官方位图热力图 1 行（21 个地区/语种标签行 × 4 个模型列，数值只存在于像素，按图行规则记 `pending`，逐行视觉转写值写入 notes 与归档 `index.md`）。
    - 差异留档（不跨来源调和）：散文的对照列名是 LahjatBERT **ALDi** CL（72.65%），官方热力图对照列名是 LahjatBERT **Card** CL 且 Morocco 行读作 68.48% —— 同族不同变体（72.65 > 71.28 > 68.48，与模型卡「ALDi CL 为该方言测试过的最强基线」自洽）；散文的 GlotLID v3 71.28% 与图中 Morocco 行一致。
    - 未明示项：参数量、上下文长度与 API 定价官方未印，账本记 null；模型卡未给评测协议细节（温度、样本切分、评委均未说明），protocol 12 键全部 null。
  - `voxtral-mini-4b-realtime-arabic`（vendor=mistral，模型=Voxtral Mini 4B Realtime Arabic，发布日=2026-10-08，evidence 条数 **13** = v✓ 2 / p⏳ 11，`status: verified`）。
    - 发布日证据（一手，两处互证 + 第三方官方佐证）：官方 Hugging Face 模型仓 `https://huggingface.co/mistralai/Voxtral-Mini-4B-Realtime-Arabic`（权重与官方模型卡）创建日 **2026-10-08T11:36:06Z**；同批的 `mistralai/LIDstral-Arabic` 创建于 2026-10-08T11:37:05Z（相隔 61 秒）；官方共同开发方 Morocco-MTNRA-Labs 组织于 2026-10-09T17:19:43Z 镜像同一模型仓。按 `zai-org/GLM-OCR` 档先例取 **2026-10-08**（取证边界同上一条，同样无博客 / RSS / changelog / GitHub / arXiv 公告）。
    - 归档：`models/2026-10-08-voxtral-mini-4b-realtime-arabic/`（官方模型卡原文 `page.html` + `images/benchmark_scores.png`（八面板 CER 柱状图）+ `images/avg_evals_by_delay.png`（延迟折线图）+ `images/benchmark_composition.png`（两个新基准的构成环形图）+ `index.md` + `manifest.json`）。
    - 发布内容：面向阿拉伯语方言与 MSA 的**流式语音转文本**模型，约 4.4B 参数、BF16、16 kHz 因果音频编码器 + 语言解码器，从 `Voxtral-Mini-4B-Realtime-2602` 微调而来，配置化转写延迟 80/160/320/480/720 ms 五档；与摩洛哥 MTNRA 联合开发，隶属 Mistral 与摩洛哥 2026 年 1 月签署的战略伙伴关系，官方定位为主权 AI 资产；官方另提供 WebGPU 浏览器 demo space。
    - 收录 13 行：正文明文 2 行（七基准平均 CER **8.82%** @480 ms；对照 Voxtral Transcribe Arabic **7.91%**，按口径单列 `comparison_cited`）+ 官方位图 11 行（延迟折线 4 档：80 ms 10.64 / 160 ms 9.76 / 320 ms 9.17 / 720 ms 8.80；逐基准柱状图 7 行：ISMA 6.68 / Darija in the Wild 9.69 / MGB-2 5.31 / SADA 13.75 / Casablanca 20.34 / FLEURS 2.66 / MASC clean 3.33）——全部按图行规则记 `pending`，视觉转写值与同图竞品列写入各行 notes。
    - 算术自校验：本模型七项（6.68+9.69+5.31+13.75+20.34+2.66+3.33）÷ 7 = 8.8228 ≈ **8.82**，与散文明文一致；Voxtral Transcribe Arabic（4.96+8.97+4.83+12.25+18.60+2.27+3.50）÷ 7 = 7.911 ≈ **7.91**，亦与散文明文一致——散文与图表两处互证。
    - 差异留档（不跨来源调和）：两张官方图对同一竞品存在 0.01 的四舍五入差（`benchmark_scores.png` 记 Cohere Transcribe Arabic 14.34、Meta Muse Transcribe 10.77；`avg_evals_by_delay.png` 记 Cohere 14.35、Muse 10.76）。
    - 未明示项：上下文长度与 API 定价官方未印，账本记 null；官方模型卡未给评测协议细节（样本切分、评委均未给出），protocol 仅记明示的 temperature 0.0 与转写延迟，其余键 null。
- **新增 evidence：17 条** = 5 verified（官方模型卡散文明文：LIDstral 3 行含 2 条竞品对照 + Voxtral 2 行含 1 条竞品对照）+ 12 pending（官方位图读数行：热力图 1 行 + 延迟折线 4 行 + 逐基准柱状图 7 行）。
- **新 benchmark id：8 个**（notes 标 `new-benchmark`）：`arabic-lid-f1`（阿拉伯语语种与方言识别逐标签 F1）、`arabic-asr-cer`（阿语 ASR 七基准平均 CER）、`isma`、`darija-in-the-wild`、`mgb-2`、`sada`、`casablanca`、`masc-clean`。其中 **4 个已建实体**（`arabic-lid-f1`、`arabic-asr-cer`、`isma`、`darija-in-the-wild`——口径与构成均可从官方模型卡与官方构成图完整整理，interpretation 已写成读者可懂的解读）；`mgb-2` / `sada` / `casablanca` / `masc-clean` 四个只知官方名与所在套件、无法在不臆造的前提下写出解读，按「写不出解读就不要建实体」纪律**只由兜底详情页顶着**。
- **新厂商：无**。
- **跳过清单**
  - **增量窗口内（2026-10-06 ~ 2026-10-23）**：16 家在册厂商逐条巡检后确无新发布。OpenAI 官方新闻 RSS（1315 条全量）窗口内 42 条逐条看过，除客户案例 / 合作 / 政策 / 研究 / 产品公告外，唯一可疑的 `decisions-api`（10-22）经官方开发者文档核实为 **Decisions API 的 GA 公告**，官方文档明写「Currently, only `gpt-6-luna` is supported」——用的是已建档模型，非独立模型发布；`low-resource-programming-languages`（10-19）与 `gpt-6-for-everyone`（10-07）分别是评测方法学发布与既有模型的可用性公告。Anthropic 官方 newsroom 首页内嵌 JSON 按文章对象切分后逐条核对，窗口内 16 条全部为政策 / 公告 / 合作 / 公益 / 研究 / 客户案例，**唯一新模型 Claude Haiku 5.5（2026-10-07）已建档**。Google 三条 RSS（`deepmind.google/blog/rss.xml` 100 条、`blog.google/technology/ai/rss/` 20 条、`blog.google/rss/` 20 条）窗口内无新模型条目（`Gemini 4 Argon` 及其工程 / 安全说明文已建档）。Mistral RSS（92 条）窗口内 4 条全部已建档或为合作公告。Meta 官方 research 博客 8 篇 Muse 相关文全部对应已建档模型或 API 落地页。DeepSeek（`news261017` 已建档）、Kimi（最新 2026-07-31）、小米（最新 2026-06-29 研究文）、StepFun（Step 5 Preview 已建档）、字节跳动（`/en/blog` 404，导航所列模型均已建档）、腾讯混元（`Hy-Memory-30B-A3B-GGUF` / `-FP8` 为同模型量化版本）、小米、微软（`microsoft.ai` 全站 Cloudflare 403、官方 RSS 通道返回空条目）、z.ai / 智谱（`z.ai/blog` nginx 404，官方 `zai-org` 模型仓最新为 2026-08-25 的 GLM-5.3 系）——窗口内均无可确认的新发布。
  - **OpenBMB / MiniCPM-V-4.7 与 DSpark 变体**（官方 HF 组织 `openbmb`，模型仓创建日 2026-10-06 ~ 2026-10-14，含 1B / 35B-A3B 两个尺寸与 DSpark 变体）——OpenBMB **不在在册 16 家厂商内**，接入属「新增厂商接入」，按任务边界需人工决策（注册厂商 + 取真实彩色 logo + 登记 `LOGO_EXT`），本批不动，记此备查。
  - **NVIDIA 官方 HF 组织**（`Cosmos3-*`、`Nemotron-*` 等，2026-10-15 ~ 10-19）——同样属未注册厂商的专项模型线，本批不动。
  - **微软官方 HF 组织**窗口内新增仓（Sentiment-Analysis-7B、scFM-dataselection、UserRepGen-4B）——研究产物模型，非 MAI / Phi 系列发布。
  - **StepFun `Step-5-Preview-NVFP4`**（官方模型仓 2026-10-14）——已建档 Step-5-Preview（2026-09-19）的量化权重版本，不另建档。
  - **腾讯混元 `Hy-Memory-30B-A3B-GGUF` / `-FP8`、`Qwen3-8B-DSpine-b16`**——同模型量化 / 衍生权重版本，随主档收录。
- **待人工核验**：本批 12 条 pending 全部是**官方位图读数行**——LIDstral 逐标签 F1 热力图 1 行（21 个标签 × 4 个模型列）、Voxtral 延迟折线 4 行（80 / 160 / 320 / 720 ms）、Voxtral 逐基准 CER 柱状图 7 行（ISMA / Darija in the Wild / MGB-2 / SADA / Casablanca / FLEURS / MASC clean）。视觉转写值与同图竞品列均已逐行写入各行 notes 与归档 `index.md`，**读图确认后方可翻 verified**。
- **门禁**：`reconcile-coverage` ✓ / `validate-data` ✓（releases 200，official 186，evidence edges 3094）/ `validate-model-coverage` ✓ / `node --test tests/*.test.mjs` ✓ 19 pass 0 fail / `sync:skills:check` ✓ / `npm run build` 全链路 ✓（含 book validate 32 章、EPUB、web 构建与 `validate-site`）。
- **分支**：`model-release-daily-20261023T010000Z`（自 `origin/main` = 485ff1d 开出；开批前先把上一批遗留的 PR #21「第三十一批」squash 合并进 main 并确认其 CI 为绿），远端分支保留、不删除。
## 第三十三批（2026-10-24 增量窗口 2026-10-06 ~ 2026-10-24）

- **窗口**：增量窗口 2026-10-06 ~ 2026-10-24（检查点锚点 `last_max_release_date=2026-10-20` 回退 14 天重叠）。检查点回写 `last_scan_at=2026-10-23`（UTC）、`last_max_release_date=2026-10-24`（本批新增的 Kimi K3.1 Pro 发布日，锚点**前进**）。
- **执行方式**：本批由 **MiniMax Code App（cwr / cheng）** 在隔离 worktree `model-release-daily-20261023T232138Z`（自 `origin/main` = 2c7a360 开出）内直接执行 `.claude/skills/ingest-releases` 技能合同；全程只写 `models/`、`data/model-releases/official/`、`data/benchmarks/`、`data/model-coverage.json` 与 `data/generated/ingest-checkpoint.json`。
- **本批新增 release：3 个**（窗口内新增 2 个 + 前一轮遗漏 1 个）

  - `kimi-k3-1-pro`（vendor=kimi，模型=Kimi K3.1 Pro / Kimi K3.1 Pro Highspeed，发布日=**2026-10-24**，evidence 条数 **34** = v✓ 6 / p⏳ 28，`status: verified`）。
    - 发布日证据（一手）：官方博客列表页 `https://www.kimi.com/en/blog/` 收录该文的日期为 **2026-10-24**；官方页 JSON-LD `dateModified` 同为 2026-10-24；页面配图资源路径含 `/kimi-k3-1/20261023/`（图片构建日，2026-10-23）。以官方列表页日期 2026-10-24 为发布日，`date_precision=day`。
    - 归档：`models/2026-10-24-kimi-k3-1-pro/`（官方详情页服务端渲染 HTML 原文 `page.html` + `images/kimi-figure-*.webp` 共 5 张官方配图 + `index.md` + `manifest.json`）。
    - 发布内容：K3.1 系列首个模型，也是 Kimi 迄今能力最强的 **3T 级开源权重**模型，**1 百万 token 上下文**；官方称其在编码、3D 创作、金融研究与智能体能力上大幅提升。官方说明 K3.1 Pro 是在 Kimi K3 基础上用**大规模联合 RL** 后训练得到，为支撑数百个下游领域的联合 RL 而优化了 RL 框架、长上下文推理、训练效率、沙箱基础设施与 rollout 调度。同日还发布 **Kimi K3.1 Pro Highspeed**（官方称速度为标准版 2–3 倍）。上线范围：Kimi.com / 移动端 / Kimi Work / Kimi Code / Kimi API（API 模型名 `kimi-k3.1-pro`、`kimi-k3.1-pro-highspeed`）；官方声明**完整模型权重将于 2026-11-04 前发布**，故归档时无官方权重仓可互证。
    - 收录 34 行：**正文明文 6 行**（Terminal-Bench 4.0 **65.7%**；Kimi Code Bench 3.0 Long-horizon **61.2%**；BenchCAD with tools **92.7%**；Kimi Hallu Bench Hard claim 级幻觉率 **8.3%**；xdev-bench-hard pass@3 **81.0%**；OfficeQA Pro v2 **64.4**）+ **官方图片评测表 28 行**（coding / agentic / reasoning & knowledge & multimodal / cybersecurity 四组共 29 个具名评测，官方页面只以图片给出数值，按图行纪律一律记 `pending` + `score_status: not_extracted`，**本批不做视觉转写**）。
    - 协议：官方总脚注声明「除非另有说明，全部结果取 reasoning effort = `max`、temperature = 1.0、top-p = 0.95」，逐项脚注另注明 harness（多数为 Claude-Code harness；OSWorld 用 Kimi Agent harness；ExploitGym 用 KimiCode harness；MCP Atlas 以 Gemini 3.1 Pro 担任评委；BrowseComp 最多 500 步、200K token 触发上下文压缩；ProgramBench 用 binary score，任务分 ≥95% 记 1）。protocol 已按明示值逐键记录。
    - 安全披露（官方原文，账本 notes 已记）：官方为开源版本从中训练语料与 RL 环境混合中**移除网络安全相关数据**；xdev-bench-hard 上未做该削减的同管线检查点为 90.5%，最终 K3.1 Pro 为 **81.0%**。官方称 K3.1 Pro 的进攻性网络能力按设计低于其管线可产出的水平，落后于已公开至少三个月的最强闭源模型。
    - 未明示项：Highspeed 版的参数量与上下文官方未单独印，账本记 null；API 定价明细官方未在正文印出，pricing 记 null；官方只给出相对前代的差值（+7.2 / +11.6 分、约 4.2 倍），无绝对分值，不单独建行。

  - `wevisone-vl`（vendor=tencent，模型=WeVisOne-VL-4B / WeVisOne-VL-2B，发布日=**2026-10-22**，evidence 条数 **72** = v✓ 72 / p⏳ 0，`status: verified`）。
    - 发布日证据（一手，三处互证）：官方 GitHub 仓 `Tencent/WeVisOne-VL` 的 `created_at` = **2026-10-22T08:58:16Z**；官方 Hugging Face 模型仓 `tencent/WeVisOne-VL-4B` 与 `tencent/WeVisOne-VL-2B` 的 `createdAt` 均为 **2026-10-22**；技术报告 **arXiv:2610.31329** 同属 2026-10。`date_precision=day`。
    - 归档：`models/2026-10-22-wevisone-vl/`（官方 README 原文 `page.html` + `images/` 5 张官方配图（teaser 与三张方法图）+ `index.md` + `manifest.json`）。
    - 发布内容：腾讯**微信视觉团队（WeChat Vision）**发布的统一视觉感知基础模型，把**目标级感知**（检测、指代定位、计数、指向、OCR）与**像素级感知**（指代分割、可提示 alpha 抠图）合进同一个模型：用结构化 next-token 预测（坐标 token `<0>`…`<1000>`、目标不存在输出 `None`、框后接 `<OBJ>` token）加一个 **9.6M 参数轻量像素解码器**直接输出全分辨率掩码与 alpha，**不需要外接 SAM**。官方称其知识图谱驱动的数据引擎标注了超过 1 亿张图像。权重 2B / 4B 两档，Apache-2.0。
    - 收录 72 行：官方 GitHub README 的**「Performance at a Glance」+「Full Benchmark Results」七张分表**，全部为 Markdown 表格（DOM 机读，**无一条读图**），逐行转录自家 2B / 4B 两列，竞品列写进各行 notes。覆盖：Object Detection（F1 Mean，COCO / LVIS / Dense200 / VisDrone）、Referring Object Detection（F1 Mean 与 Rejection Rate，RefCOCOg / WeRef / HumanRef / Ref-L4）、Object Counting（Exact-match Accuracy，CountQA / PixMo-Count / CLOC / KubriCount / MixCount）、Object Pointing（Accuracy，PointBench / PixMo-Points / COCO / LVIS / Dense200 / VisDrone）、OCR（F1 Mean，HierText / ICDAR2015 / TotalText / SROIE）、Referring Segmentation（cIoU，ReasonSeg 用 gIoU，RefCOCO / RefCOCO+ / RefCOCOg / ReasonSeg / Ref-ZOM）、Promptable Matting（MAD ×10³，P3M-500-NP / AM-2K / PPM-100 / WeRefMat）。
    - 协议（官方明示）：F1 取 IoU 0.5:0.95 平均；贪心解码；每图 ≤ 1,960 视觉 token。已逐键写入 protocol。
    - 未明示项：参数量以外的其他规格、上下文长度与 API 定价官方未印，账本记 null；官方未公开上述各评测的完整定义与数据集介绍。

  - `hy-nomas`（vendor=tencent，模型=Hy-Nomas，发布日=**2026-10-21**，evidence 条数 **4** = v✓ 0 / p⏳ 4，`status: pending`）。
    - 发布日证据（一手，两处互证 + 项目站）：官方 Hugging Face 模型仓 `tencent/Hy-Nomas` 的 `createdAt` = **2026-10-21**；官方 GitHub 仓 `Tencent-Hunyuan/Hy-Nomas` 的 `created_at` = **2026-10-21T03:04:54Z**；官方项目站 `hy-nomas.hy.tencent.com` 同日上线。`date_precision=day`。
    - 归档：`models/2026-10-21-hy-nomas/`（官方模型卡原文 `page.html` + `images/` 2 张官方配图 + `index.md` + `manifest.json`）。
    - 发布内容：腾讯混元发布的**自由形式交互式视频世界生成模型**——按段自回归地一段段生成世界，支持多轮文本指令与相机轨迹控制，用持久化 KV 缓存跨段保持上下文一致。官方明示规格：54 个双流 MMDiT 块、隐藏维度 2,048、16 头 × 128 维、FFN 4×（中间层 8,192）；DCAE-V `f32t4c32` 潜变量（32 通道，空间 32×、时间 4× 压缩）；文本编码器为 `Qwen/Qwen2.5-VL-7B-Instruct` 的语言模型部分（3,584 维 → 两层 token refiner → 投影到 2,048 维）；微调 PixelUMM 解码器（36 层、4,096 维、32 查询头 / 8 KV 头、1 步解码）；3D RoPE 时间/高/宽维度 `[16, 56, 56]`、theta 256；蒸馏推理 8 步去噪、Euler ODE、720×1280 @ 24 FPS；另有单张 RTX 4090 的 INT8 低内存配置（INT8 DiT + INT8 KV cache + FP8 解码器 + CPU offload，历史预算 18 个潜帧）。
    - 收录 4 行、**全部无数值**：官方随发布公开评测数据集 **Hy-Nomas-Bench**（4 个子基准、280 个测试用例、220 条参考相机轨迹），但官方数据集卡明确写明「Videos, extracted reference/revisit frames, and **evaluation scores are not included**」，技术报告标注 **Coming Soon**。因此 4 行一律 `score_status: not_reported` + `status: pending`，本 release 整体 `status: pending`，**不以任何二级来源补数**。

- **新增 evidence：110 条** = 78 verified（Kimi 正文 6 行 + WeVisOne-VL 官方 Markdown 表 72 行）+ 32 pending（Kimi 官方图片评测表 28 行 + Hy-Nomas-Bench 4 行）。
- **新 benchmark id：36 个**（notes 标 `new-benchmark`，由账本自动生成兜底详情页，不阻塞入库）：
  - WeVisOne-VL 24 个：`lvis`、`visdrone`、`refcocog`、`weref-bench`、`humanref`、`ref-l4`、`pixmo-count`、`cloc`、`kubricount`、`mixcount`、`pointbench`、`pixmo-points`、`hiertext`、`icdar2015`、`totaltext`、`sroie`、`refcoco`、`refcoco-plus`、`reasonseg`、`ref-zom`、`p3m-500-np`、`am-2k`、`ppm-100`、`werefmat`。
  - Kimi 12 个：`kimi-code-bench-3-long-horizon`、`kimi-hallu-bench-hard`、`xdev-bench-hard`、`programbench`、`kimi-code-bench-2`、`bio-mystery-bench`、`handbook-md`、`deck-arena`、`design-bench`、`hle-diamond`、`kimi-hallucination-bench`。
  - Hy-Nomas 1 个：`hy-nomas-bench`。
  - 复用既有实体 4 个：`coco`、`dense200`、`countqa`（WeVisOne-VL）、`aa-briefcase`（Kimi AA-Briefcase v1.1，仓内已有正式实体与解读）。官方只给出其余评测的名与指标口径、无完整定义，故本批**未新建 benchmark 实体**，全部由「由发布引用自动生成」的兜底详情页顶着（`data/generated/auto-benchmark-ids.json` 118 → 154）。
- **新厂商：无**。
- **跳过清单**
  - **OpenAI**：官方新闻 RSS 全量 1,318 条，窗口内 **44 条**逐条看过（`pubDate` 为 RFC-822 格式，须按日期规范化后再筛，否则会整窗口漏检）。除客户案例 / 合作 / 方法学 / 既有模型可用性公告外，唯一 `models` 属性的 `decisions-api`（2026-10-22）经官方文档核实为 Decisions API 的 GA 公告（用的是已建档模型）。
  - **Anthropic**：官方 newsroom 首页内嵌 JSON 逐条解析，窗口内 **25 条**，带 `models` 类别的**仅 Claude Haiku 5.5（2026-10-07，已建档）**，其余为公告 / 安全 / 政策 / 合作 / 研究。
  - **Meta**：官方 research 博客窗口内 **3 篇**——`/blog/muse-spark-open`（2026-10-15，Introducing Muse Spark Open, The Most Capable US Open‑Weight Model to Date，**已建档** `muse-spark-open`）、`/blog/muse-wonder`（2026-10-12，**已建档** `muse-wonder`）、`/blog/accelerating-scientific-research-in-health-data-science-with-muse-models`（2026-10-14，基于已建档 Muse 模型的研究文章）。
  - **Microsoft**：官方 `microsoft.ai/blog/` 全站 321 KB 抽取，窗口内 **0 篇**（唯一的 2026-10-22 是页面 JSON-LD 的 `datePublished`，非文章）；官方 RSS 通道返回空条目；官方 HF 组织窗口内新增 `Sentiment-Analysis-7B` / `scFM-dataselection` / `UserRepGen-4B` 三个研究产物模型，非 MAI / Phi 系列发布。
  - **Mistral**：官方 RSS 92 条，窗口内 4 条（Timestral / Voxtral 3 / Mistral Large 4 / NVIDIA 合作）全部已建档或为合作公告。官方 HF 组织窗口内命中 `Timestral-5M / 28M / 123M / 209M`（2026-10-14）——**多变体完整性校验**：既有 `timestral` 档已逐列收录全部四个尺寸，无遗漏。
  - **Google**：DeepMind RSS 100 条 + `blog.google` 两条 RSS 各 20 条，窗口内条目均为已建档模型（Gemini 4 Argon、EmbeddingGemma 2）或研究 / 生态文章。
  - **DeepSeek**：官方 news 页为客户端渲染，静态抓取仅得导航文本；经官方 HF 组织确认窗口内唯一新仓 `DeepSeek-V4.1-Flash-1017`（2026-10-17，**已建档**）。
  - **腾讯混元 / 微信视觉**：官方 `hy.tencent.com` 为 SPA 空壳，但官方 GitHub 仓与 HF 组织两条一手渠道可用——窗口内新增 `WeVisOne-VL-4B / -2B`（2026-10-22）与 `Hy-Nomas`（2026-10-21），**本批已建档**；`Hy-Memory-30B-A3B-GGUF / -FP8`、`Qwen3-8B-DSpine-b16`、`Youtu-Parsing-Omni` 为已建档模型的量化 / 衍生权重版本。
  - **Kimi**：官方博客列表页窗口内唯一新模型即 **Kimi K3.1 Pro**（本批已建档）；官方 HF 组织 `moonshotai` 窗口内**无新仓**（官方声明权重 2026-11-04 前才发布）。
  - **MiniMax**：官方 `minimax.io/news` 窗口内 0 条（唯一 2026-10-23 是站点 JSON-LD `dateModified`，全站重新生成时间戳，非发布证据）；官方 HF 组织 `MiniMaxAI/MiniMax-M3.1-Flash`（2026-10-17）**已建档**。
  - **Qwen / 豆包**：`qwen.ai/blog` 与 `seed.bytedance.com/en/blog` 均为客户端渲染空壳，静态抓取得不到条目列表；官方 HF 组织 `Qwen/Qwen-Image-2.1-Turbo`（2026-10-09）**已建档**。这两个官方渠道**本轮未能独立核验**，按 partial 记，不声称穷尽。
  - **StepFun**：官方 `stepfun.ai/research` 只暴露模型名（Step 5 Preview / StepAudio 3 TTS 等）、不暴露机读日期；已建档条目无新增。
  - **小米 MiMo**：官方 `mimo.xiaomi.com` 最新文章为 **2026-06-29**，窗口内 0 篇。
  - **xAI / 智谱**：`x.ai/news` 官方站点 **HTTP 403**、`z.ai/blog` **HTTP 404**；官方 `zai-org` HF 组织窗口内 0 新仓。本轮**无法独立核验**这两个厂商的官方博客渠道，按 partial 记。
- **待人工核验**：本批 32 条 pending 全部是**官方图片评测表 / 无分数**——Kimi 官方图片评测表 28 行（coding 6 项、agentic 13 项、reasoning & knowledge & multimodal 7 项、cybersecurity 2 项；官方图片已归档 `models/2026-10-24-kimi-k3-1-pro/images/kimi-figure-*.webp` 留证）+ Hy-Nomas-Bench 4 行（官方数据集明确不含分数）。本批按纪律**不做视觉转写**、不填数值，读图确认后方可补录并翻 verified。
- **门禁**：`reconcile-coverage` ✓ / `validate-data` ✓（releases 203，official 189，evidence edges 3204）/ `validate-model-coverage` ✓ / `node --test tests/*.test.mjs` ✓ 19 pass 0 fail / `sync:skills:check` ✓ / `npm run build` 全链路 ✓（含 book validate 32 章、EPUB、web 构建与 `validate-site`）。
- **分支**：`model-release-daily-20261023T232138Z`（自 `origin/main` = 2c7a360 开出）。

## 第三十四批（2026-10-25 增量窗口 2026-10-10 ~ 2026-10-24）

- **窗口结论**：增量窗口内**确无新发布**。第三十三批（2026-10-24 同一 07:15 定时轮次）已把窗口扫到 2026-10-24；本轮在 2026-10-24T23:30Z 起复核 2026-10-22 之后的官方通道，**未出现任何新的官方模型发布**，故不新建 release 条目、不新增官方归档页。
- **复核通道与结果**：
  - **OpenAI**：官方 `news/rss.xml` 共 1318 条，2026-10-22 之后 6 条（最新 `Fri, 23 Oct 2026 17:00:00 GMT`），均落在第三十三批已扫窗口内，未指向新模型发布。
  - **Google**：官方 `deepmind.google/blog/rss.xml` 100 条，2026-10-22 之后 1 条（`Beyond tree cover: mapping the world's forest types`，生态研究文章非模型发布）；官方 `blog.google/rss/` 20 条，2026-10-22 之后 3 条（Gemini 4 Argon 生态文 / Google Marketing Platform / Voltus 虚拟电厂，无新模型发布）。
  - **Anthropic / Mistral / Meta**：`anthropic.com/rss.xml`、`mistral.ai/news/rss.xml`、`research.meta.ai/blog/rss/` 静态 GET 均返回 **HTTP 404**，与既有「抓取障碍」记录一致，本轮**无法独立巡检**这三个厂商的公告通道，按 partial 记，不声称穷尽。
  - **MiniMax**：`minimax.io/news` 本轮请求超时（既有记录：站点 JSON-LD `dateModified` 是全站重新生成时间戳，本就不可当发布证据），按 partial 记。
  - **官方模型仓（HF 组织）**：`mistralai` / `Qwen` / `stepfun-ai` / `microsoft` / `zai-org` / `deepseek-ai` / `moonshotai` / `MiniMaxAI` / `meta-llama` 窗口内 **0 新仓**；`tencent` 窗口内 **5 个新仓**，逐个核对后确认：
  - **新增官方产物（衍生件，不另建档）**：`tencent/Hy-Nomas-Diffusers`（`createdAt` = 2026-10-24T05:45:20Z），模型卡 `base_model: tencent/Hy-Nomas`，是已建档 `hy-nomas`（2026-10-21）同一权重的 Diffusers 封装版本。按「量化 / 衍生权重版本不另建档」的纪律，本批**不新建 release 条目**，只在 `hy-nomas.json` 的 `notes` 登记该官方衍生仓。
  - **已建档 / 衍生权重（不另建档）**：`tencent/WeVisOne-VL-4B`（2026-10-22）与 `tencent/WeVisOne-VL-2B`（2026-10-22）已由第三十三批建档；`tencent/Hy-Nomas`（2026-10-21）同上；`tencent/Hy-Memory-30B-A3B-GGUF`（2026-10-19）是已建档 `hy-memory-30b-a3b` 的 GGUF 量化衍生权重。
- **待人工核验（沿用第三十三批结论，本批未动）**：第三十三批遗留的 32 条 pending 仍为官方图片评测表 / 无分数项（Kimi K3.1 Pro 官方图片评测表 28 行、Hy-Nomas-Bench 4 行），本批按纪律**不做视觉转写**、不填数值。
- **门禁**：见本批提交记录。
- **分支**：`model-release-daily-20261024T233200Z`（自 `origin/main` = 169fa11 开出）。

## 第三十五批（2026-10-25 增量窗口 2026-10-10 ~ 2026-10-25）

- **窗口**：增量窗口 2026-10-10 ~ 2026-10-25（检查点锚点 `last_max_release_date=2026-10-24` 回退 14 天重叠）。检查点回写 `last_scan_at=2026-10-25`（UTC）、`last_max_release_date` **维持 2026-10-24**（本批未新增 release 条目，锚点不前进也不回退）。
- **开工前的遗留收口**：本批开工时工作树有 **2026-10-24 09:00 轮次遗留的未提交改动**（`.claude/skills/ingest-releases/references/discovery-channels.md` + 镜像 + `data/model-coverage.json`，mtime 2026-10-24 10:27~10:28，无存活进程），且当前本地分支是已合并的 `model-release-daily-20261024T010000Z`；同时存在**更新的远端分支 `model-release-daily-20261024T233200Z` 带 OPEN PR #25**。按渠道地图里的「上一轮跑批遗留未收口」判定：**先把 PR #25（第三十四批，CI 已绿）squash 合并进 main，再从更新后的 `origin/main`（644d303）开本轮新分支**；遗留的渠道知识与 coverage 扫描结果在本批一并带入，不 stash、不丢弃。
- **窗口结论**：增量窗口内**确无新的官方模型发布**——窗口内 16 家厂商的发布（Gemini 4 Argon GA 10-13 / Hy-Memory-30B-A3B 10-15 / Mistral Timestral 10-15 / DeepSeek-V4.1-Flash-1017 10-17 / MiniMax M3.1 Flash 10-19 / Voxtral 3 10-20 / Hy-Nomas 10-21 / WeVisOne-VL 10-22 / Kimi K3.1 Pro 10-24 / Hy-Nomas-Diffusers 10-24 / GLM Legal 10-12 / Muse Wonder 10-12 / Muse Spark Open 10-15）**已由第二十八~三十四批全部建档**。本批**不新建 release 条目**，只补一条此前漏掉的**官方明文 evidence**。
- **本批新增 evidence：1 条 = 1 verified + 0 pending**
  - `openai-gpt-6-1-sol--terminal-x`（vendor=openai，release=`gpt-6-1-sol`，模型=GPT-6.1 Sol，benchmark=`terminal-x`，**88.6%**，`status: verified`，`attribution_type: third_party_reported`）。
    - 来源（一手，A 级）：OpenAI 官网客户案例文章《Terminal X matches senior investor judgment 88.6% with GPT-6.1》 `https://openai.com/index/terminal-x`，页面印刷日 **October 20, 2026**，官方新闻 RSS 对应条目 `pubDate` 同为 **2026-10-20**。
    - 归档：`models/2026-10-20-gpt-6-1-sol-terminal-x/`（文章页服务端渲染 HTML 原文 `page.html` + `images/` 3 张官方配图 + `index.md` + `manifest.json`）。
    - 数值口径：终端投资机构 Terminal X 用**自建 Eval Agent**（按 **54 条评分准则**逐条核对 agent 产出是否偏离基金章程）评自己的投资研究工作流，在 **500 次已评分判断**上，Eval Agent 判定与**资深人类评审**判定的一致率为 **88.6%**；同页竞品列「次优模型」**86.4%**，官方写明差值 220 个基点。
    - 只建一行：页面另给「章程偏离检出率较次优模型约 +25%」「单次查询成本约 −30%」，均为**相对差值、无绝对分值**，不单独建行，写进该行 notes。
    - 协议与归因：评测由客户自建自报、厂商官网转载 → 记 `third_party_reported`（不计厂商自报）；`protocol.harness` 写 `Terminal X Eval Agent`、`protocol.run_count` 写 `500 次已评分判断`、`protocol.judge` 写评分器与资深人类评审对照；属自定义 Agentic 脚手架，`comparison_scope` 标 `only_same_protocol` 并在 notes 交代与官方标准单轮基线的差距。
    - 边界：54 条准则与 500 次样本**均未公开**，外部无法复跑，跨机构自建准则不可横向比较（已写入 notes 与 benchmark 实体的 `limitations`）。
  - **对既有 release 文件的唯一改动**：`data/model-releases/official/openai/gpt-6-1-sol.json` 追加上述 1 条 evidence（7 → 8 条）＋ 1 条 `revisions[]` 记录（`field: benchmark_evidence`，写明「仅追加、未改任何既有行、数值、状态与 locator」）＋ release `notes` 末尾补一句来源说明。**未改动任何既有 evidence 行、任何数值、任何 `status`**；release 级 `status` 维持 `pending`（原有 5 条基准行仍是图表待转录）。
- **新 benchmark id：1 个** — `terminal-x`（notes 标 `new-benchmark`）。本批**同步建了完整实体** `data/benchmarks/terminal-x.json`（summary / interpretation / measures / metrics / versions / limitations 齐备，`content_status: beta`），因为官方页明示了准则条数、样本量、评分器与对照，可整理出完整定义；读者解读已写明「一致率怎么读 + 三条读数注意事项」。
- **新厂商：无**。
- **逐厂商巡检结果（窗口 2026-10-10 ~ 2026-10-25）**
  - **OpenAI**：官方 `news/rss.xml` 1,318 条，窗口内 31 条逐条看过，**无新模型发布文**；窗口内唯一带明文评测数值的官方页是客户案例文章 `terminal-x`（本批已入库）。官方 `sitemap.xml/release/` 84 条 slug 已取回（`lastmod` 全站批量重新生成，不可当日期）。
  - **Anthropic**：官方 newsroom 内嵌 JSON 窗口内 43 条，逐条看过，均为公告 / 政策 / 安全 / 研究 / 合作，无新模型发布；`platform.claude.com/docs/en/models/overview` 的 Specialized models（Mythos 5 / 5.1）与 Legacy models（Fable 5 / 5.1）**已建档**（Mythos 作为 `claude-fable-5` / `claude-fable-5-1` 的 `models[]` 条目收录），**不重复建档**。
  - **Google**：官方 `deepmind.google/blog/rss.xml` 100 条 + `blog.google/rss/` 20 条，窗口内条目均为已建档模型（Gemini 4 Argon / Argon GA / EmbeddingGemma 2）或研究与生态文章（如 10-20 的 AMIE 临床研究访谈，非发布文）。
  - **xAI**：官方 `/news/<slug>` 逐个直取（`grok-4-7` / `grok-voice-3` / `grok-imagine-image-2` / `grok-imagine-video-1-5` / `grok-code-fast-1` 取到 JSON-LD `datePublished`），窗口内最新为 **grok-voice-3（2026-10-14，已建档）**；`grok-4-8` / `grok-5` / `grok-imagine-image-2-0` 均 404。
  - **Meta**：官方 `research.meta.ai/blog` 窗口内 3 篇——`muse-wonder`(10-12，已建档)、`developing-capable-models-responsibly`(10-14，研究方法文章)、`accelerating-scientific-research-in-health-data-science-with-muse-models`(10-15，基于已建档 Muse 模型的研究文章)，**无新模型发布**。
  - **Mistral**：官方 RSS 92 条，窗口内 3 条（Voxtral 3 已建档 / Timestral 已建档 / NVIDIA 合作公告）；官方 changelog 窗口内 2 条（Voxtral 3、**Z.ai GLM 5.3 Flash 上架**）；官方 HF 组织窗口内 4 个仓均为已建档 `timestral` 的四个尺寸（5M / 28M / 123M / 209M，多变体已逐列核对无遗漏）。
  - **DeepSeek**：官方 `/updates` 通道取到窗口内最新 **2026-10-17**（`DeepSeek-V4.1-Flash-1017`，已建档），窗口内无更新发布。
  - **MiniMax**：官方 `platform.minimax.io/docs/release-notes/models` 窗口内唯一条目 **Oct. 19, 2026 / MiniMax M3.1 Flash**（已建档）；官方 HF 组织 `MiniMaxAI/MiniMax-M3.1-Flash`(2026-10-17) 同源。
  - **Kimi**：官方博客列表页与 `whats-new` 页窗口内唯一新模型即 **Kimi K3.1 Pro**（已建档）；官方 HF 组织 `moonshotai` 窗口内 **0 新仓**。
  - **Qwen**：官方 `Qwen` HF 组织窗口内 0 新仓（最新 `Qwen-Image-2.1-Turbo` 2026-10-09，已建档）；官方 GitHub `QwenLM/Qwen-Image-2.1` README 更新日志最新条目同为 `2026.10.09`。`qwen.ai` 为纯客户端渲染（`/sitemap.xml` 返回的是 SPA HTML），按 partial 记。
  - **豆包**：官方 `seed.bytedance.com/sitemap.xml` 35 条 URL 全量核对，窗口内唯一新 URL 是 `seed-alignment-preparedness-team-looking-for-global-talents`（**招聘贴，非模型发布**）；全部模型发布文 lastmod ≤ 2026-09-28，均已建档。
  - **小米 MiMo**：官方 `mimo.xiaomi.com` 首页卡片清单最新为 MiMo-V2.6 系列（已建档）与 MiMo-V2.5-Pro（已建档），窗口内 0 篇新发布。
  - **腾讯混元 / 微信视觉**：官方 HF 组织窗口内 8 个新仓逐个核对——`Hy-Nomas-Diffusers`(10-24，第三十四批已登记)、`WeVisOne-VL-4B` / `-2B`(10-22，已建档)、`Hy-Nomas`(10-21，已建档)、`Hy-Memory-30B-A3B`(10-15，已建档) 与其 FP8 / GGUF 量化衍生件、`Qwen3-8B-DSpine-b16`(投机解码 drafter 研究产物，非独立模型发布)。官方 GitHub `Tencent-Hunyuan` org 窗口内新建 4 仓，其中 3 个是基准/研究产物（OmniCapBench / DiagSafe / Hydra 等）。
  - **StepFun**：官方 `stepfun.ai/research` 只暴露模型名（Step 5 / Step 3.7 / Step 3.5），不暴露机读日期；官方 HF 组织窗口内唯一新仓 `Step-5-Preview-NVFP4`(2026-10-14) 是已建档 `step-5-preview` 的 NVFP4 量化衍生件，**不另建档**。
  - **Microsoft**：官方 `microsoft.ai/blog` / `/models/` / `/feed/` 全 403 Cloudflare 挑战页；官方 HF 组织窗口内 3 个新仓（`Sentiment-Analysis-7B` / `scFM-dataselection` / `UserRepGen-4B`）与 GitHub org 窗口内新建仓（`AnalyticsHub-Dashboard`）**均为研究产物 / Copilot 工具，不是 MAI / Phi 发布**。按 partial 记，不声称穷尽。
  - **智谱 GLM**：官方 `z.ai/blog` 返回 404，官方 `zai-org` HF 组织窗口内 0 新仓（最新 2026-08-25）；已建档 `glm-legal`(10-12) 为窗口内唯一 GLM 发布。按 partial 记。
- **跳过清单**
  - **OpenAI / Decisions API**（2026-10-22）——开发者 API 的 GA 公告，用的是已建档模型，非模型发布。
  - **OpenAI 客户案例 / 合作 / 方法学文章共 30 篇**（窗口内其余条目）——无模型评测数值或非发布文。
  - **Mistral × NVIDIA 工业工程合作**（2026-10-21）——合作公告。
  - **Mistral 平台上架 Z.ai GLM 5.3 Flash**（2026-10-22，`zai-glm-5-3-flash`）——**第三方模型在 Mistral 平台上的可售公告**，模型本身是 Z.ai 已建档模型（2026-08-25），按「平台可售公告不另建 release」处理。
  - **豆包 Seed 招聘贴**（2026-10-14）——招聘文章，非模型发布。
  - **腾讯 `Qwen3-8B-DSpine-b16`**（2026-10-16）——基于 Qwen3-8B 的投机解码 drafter 研究产物，非独立模型发布。
  - **StepFun `Step-5-Preview-NVFP4`**（2026-10-14）——已建档 `step-5-preview` 的量化衍生版本，量化版不另建档。
  - **Microsoft / 智谱 窗口内无新发布**——官方博客通道本轮不可巡检（403 / 404），按 partial 记，不声称穷尽。
  - **xAI `grok-imagine-image-2.0`（2026-08-07）与 `grok-imagine-video-1.5`（2026-06-16）**——官方发布文可取且已核到发布日期，但**在增量窗口之外且账本无此条目**，属存量回填缺口，留待回填批次处理，本批不越窗建档。
- **待人工核验（沿用第三十三批结论，本批未动）**：遗留 32 条 pending 仍为官方图片评测表 / 无分数项（Kimi K3.1 Pro 官方图片评测表 28 行、Hy-Nomas-Bench 4 行），按纪律**不做视觉转写**、不填数值。本批新增的 Terminal X 一行为**正文明文**，不涉及读图，不进 pending 清单。
- **门禁**：见本批提交记录。
- **分支**：`model-release-daily-20261025T010151Z`（自 `origin/main` = 644d303 开出）。

## 第三十六批（2026-10-26 增量窗口 2026-10-10 ~ 2026-10-25）

- **窗口**：增量窗口 2026-10-10 ~ 2026-10-25（检查点锚点 `last_max_release_date=2026-10-24` 回退 14 天重叠）。检查点回写 `last_scan_at=2026-10-25`（UTC）、`last_max_release_date` **维持 2026-10-24**（本批未新增 release 条目，锚点不前进也不回退）。
- **执行方式与执行器互斥**：本批由 **MiniMax Code（cwr 主机）** 在隔离 worktree `model-release-daily-20261025T231917Z`（自 `origin/main` = `a31e154` 开出）内执行。原 OpenClaw 定时声明 `workflow:daily-model-releases-and-provider-refresh`（cron id `db2e30ef-541a-49e2-af4a-bcdff12831e9`，原 cron `15 7 * * *` Asia/Shanghai，agent `walle`）已**显式 `--disable` 并原生回读确认 `enabled=false`**，避免两个执行器跑同一轮。
- **窗口结论**：增量窗口内**确无新的官方模型发布**——窗口内 16 家厂商的发布（Gemini 4 Argon GA 10-13 / Hy-Memory-30B-A3B 10-15 / Mistral Timestral 10-15 / DeepSeek-V4.1-Flash-1017 10-17 / MiniMax M3.1 Flash 10-19 / Voxtral 3 10-20 / Hy-Nomas 10-21 / WeVisOne-VL 10-22 / Kimi K3.1 Pro 10-24 / Hy-Nomas-Diffusers 10-24 / GLM Legal 10-12 / Muse Wonder 10-12 / Muse Spark Open 10-15）**已由第二十八~三十四批全部建档**。本批**不新建 release 条目**，只补**上一批漏判**的官方明文 evidence，共 **18 条**。
- **本批新增 evidence：18 条 = 18 verified + 0 pending**（全部 `attribution_type: vendor_reported`、`source_kind: official_release_blog`、`source_tier: A`、`evidence_type: text`、`comparison_scope: only_same_protocol`）
  - **唯一来源（一手，A 级）**：OpenAI 官网研究文章《Advancing coding in low-resource programming languages》 `https://openai.com/index/low-resource-programming-languages`，页面印刷日 **October 19, 2026**，官方新闻 RSS 对应条目 `pubDate` 同为 **2026-10-19**。
  - **为什么是「漏判」**：第三十五批把窗口内 OpenAI 31 条逐条看过、把该文归入「无模型评测数值或非发布文」；本批按 14 天重叠窗口复核时发现该文**确有明文绝对分值**（MultiLangBench 与 COBOL 迁移评测两套新评测），按纪律捞回并在此登记。
  - **`multilangbench`（新基准，15 条）**：OpenAI 自建评测——要求模型用指定语言从零构建 SQLite 兼容数据库引擎，测试用例改编自 SQLite 既有测试套件，20 种语言统计测试通过率；官方已开源评测环境与测试套件 `https://github.com/openai/MultiLangBench`。
    - `openai-gpt-6-astra--multilangbench-astra-avg-20-langs-max-effort` → **87.4%**（20 语言平均测试通过率，推理强度 maximum）
    - `openai-gpt-6-astra--multilangbench-astra-cobol|-ocaml|-fortran|-visual-basic-max-effort` → **72.1% / 85.8% / 83.5% / 89.4%**
    - `openai-gpt-6-sol-and-luna--multilangbench-luna-avg-20-langs-max-effort` → **40.3%**（`model_id` = `gpt-6-luna`）
    - `openai-gpt-6-sol-and-luna--multilangbench-luna-cobol|-ocaml|-fortran|-visual-basic-max-effort` → **17.1% / 34.1% / 31.4% / 41.6%**
    - `openai-gpt-5-6--multilangbench-sol-avg-20-langs` → **26.8%**，及 4 个逐语言基线 **10.9% / 25.6% / 21.4% / 27.5%**（`model_id` = `gpt-5-6-sol`；该组数字所在句**未标注推理强度**，`reasoning_effort` 记 `null` 并在 `model_variant` 注明，与 GPT-5.6 既有行同款处理）
  - **`openai-cobol-migration`（新基准，3 条）**：OpenAI 自建评测——把已有 COBOL 程序迁移到 C++ / Java / Kotlin / Python / Rust 并保持行为，用准确率衡量；官方未给正式名称，按用途铸 id。
    - `openai-gpt-6-1-sol--openai-cobol-migration-gpt-6-1-sol-low-reasoning-effort` → **86.6%**
    - `openai-gpt-6-1-sol--openai-cobol-migration-gpt-6-1-sol-higher-reasoning-effort` → **97.9%**（官方写「接近饱和」）
    - `openai-gpt-5-6--openai-cobol-migration-sol-low-reasoning-effort` → **5.4%**（同页明文印出的 GPT-5.6 Sol 基线）
  - **归档**：`models/2026-10-19-gpt-6-multilangbench-cobol-migration/`（文章页服务端渲染 HTML 原文 `page.html` + `images/` 官方封面图 + `index.md` 全文机读转录 + `manifest.json` 含逐文件 sha256）。
  - **口径边界**：① 页面 4 个图表容器（`multilangbench-average-test-pass-rate` / `sqlite-performance-by-language` / `cobol-migration-performance` / `sqlite-test-pass-rate-c`）在静态 HTML 中均为**无 `src`/`srcset` 的空 div**，图表数据由前端脚本运行时拉取、静态 HTML 内不含任何语言名或数值数组 → 本批 18 条**全部来自正文散文明文绝对值**，不涉及视觉转写、**无图表 pending 项**；② 其余 16 种语言官方只写「Astra scores above 83% in 19 of the 20 languages」，**无逐语言绝对值**，不建行、不臆造；③ `$0.77 / $3.48 / 78% / 61% / 39%` 均为 **API 成本口径、不是分值**，不单独建行，只写进相关行 notes；④ 两套评测均由 OpenAI 自建自报 → 记 `vendor_reported`，非第三方榜单；COBOL 迁移评测的评测集与评分细则**未公开、未开源**，外部无法复跑。
  - **对既有 release 文件的唯一改动**：`openai/gpt-6-astra.json`（3 → 8 条）、`openai/gpt-6-sol-and-luna.json`（16 → 21 条）、`openai/gpt-6-1-sol.json`（8 → 10 条）、`openai/gpt-5-6.json`（214 → 220 条）各追加新 evidence 行 ＋ 1 条 `revisions[]` 记录（`field: benchmark_evidence`，写明「仅追加、未改任何既有行、数值、状态与 locator」）＋ release `notes` 末尾补一句来源说明。**未改动任何既有 evidence 行、任何数值、任何 `status`**；`gpt-6-1-sol` 的 release 级 `status` 维持 `pending`（原有 5 条基准行仍是图表待转录），其余三个维持 `verified`。
- **新增 benchmark id：2 个（均已同步建实体，含 `summary` / `interpretation` / `measures` / `does_not_measure` / `metrics` / `versions` / `limitations` / `official_sources`）**
  - `multilangbench`（MultiLangBench）
  - `openai-cobol-migration`（OpenAI COBOL Migration Evaluation）
- **新厂商**：无。
- **逐厂商巡检（窗口 2026-10-10 ~ 2026-10-25）**
  - **OpenAI**：官方 `news/rss.xml` 共 1318 条，窗口内 31 条逐条复核，最新条目 2026-10-23，**无新发布文**；本批从窗口内的 2026-10-19 一文补出 18 条明文 evidence（见上）。
  - **Google**：`deepmind.google/blog/rss.xml` 100 条 + `blog.google/rss/` 20 条，窗口内条目均为已建档模型（Gemini 4 Argon / Argon GA）、生态文章或研究访谈，**无新发布**。
  - **Anthropic**：官方 newsroom 列表页窗口内最新文章 2026-10-22（捐赠 Agent Skills 给 Agentic AI Foundation，属标准/生态事项）；`platform.claude.com/docs/en/models/overview` 在架仍为 Claude Fable 5.1 / Opus 5.5 / Sonnet 5.5 / Haiku 5.5（均已建档）；`anthropic.com/rss.xml` 静态 GET 返回 404（沿用既有抓取障碍记录），按 partial 记。
  - **xAI**：`docs.x.ai/docs/models` 在架旗舰仍为 grok-4.7（已建档 2026-09-21）；`x.ai/news/grok-4-8` 探测 404，**无新发布**。
  - **Meta**：`research.meta.ai/blog` 窗口内 3 篇——`muse-wonder`（10-12，已建档）、`developing-capable-models-responsibly`（10-14，研究方法文章）、`accelerating-scientific-research-in-health-data-science-with-muse-models`（10-15，基于已建档 Muse 模型的研究文章），**无新发布**。
  - **Mistral**：官方 RSS 92 条，窗口内 3 条（Voxtral 3 10-20 已建档 / Timestral 10-15 已建档 / NVIDIA 工业工程合作公告 10-21）；官方 HF 组织 `mistralai` 窗口内 4 个新仓 `Timestral-123M / 28M / 5M / 209M`（均 2026-10-14）即已建档 `timestral` 的四个尺寸，**多变体已逐列核对无遗漏**；GitHub `mistralai/timestral`（10-15）同源。
  - **DeepSeek**：官方 `/updates` 窗口内最新 2026-10-17（DeepSeek-V4.1-Flash-1017，已建档），**无新发布**。
  - **MiniMax**：官方 `platform.minimax.io/docs/release-notes/models` 窗口内唯一条目 Oct. 19, 2026 / MiniMax M3.1 Flash（已建档）；官方 HF `MiniMaxAI/MiniMax-M3.1-Flash` 权重仓 `createdAt` 2026-10-17（官方发布文口径 10-19），**无新发布**。
  - **Kimi**：官方博客列表页窗口内唯一新模型即 Kimi K3.1 Pro（10-24，已建档）；官方 HF `moonshotai` 窗口内 0 新仓，**无新发布**。
  - **豆包**：官方 `seed.bytedance.com/sitemap.xml` 35 条 URL 逐条比对，窗口内唯一新 URL 是招聘贴 `seed-alignment-preparedness-team-looking-for-global-talents`（10-14），**非模型发布**。
  - **小米 MiMo**：官方 `mimo.xiaomi.com/blog` 窗口内 0 篇新发布（列表页最新为 2025-12-16 的 MiMo-V2-Flash）。
  - **腾讯混元 / 微信视觉**：官方 HF 组织窗口内 8 个新仓逐个核对——`Hy-Nomas-Diffusers`（10-24，第三十四批已登记为官方衍生仓）、`WeVisOne-VL-4B` / `-2B`（10-22，已建档）、`Hy-Nomas`（10-21，已建档）、`Hy-Memory-30B-A3B`（10-15，已建档）及其 FP8（10-16）/ GGUF（10-19）量化衍生件、`Qwen3-8B-DSpine-b16`（10-16，投机解码 drafter 研究产物）；GitHub `Tencent-Hunyuan` 新仓 `Hy-Nomas`(10-21) / `Hy-Memory`(10-15) 同源；**无新发布**。
  - **智谱 GLM**：官方 `z.ai/blog` 静态 GET 404；官方 `docs.z.ai` 在架 GLM-5.3 / GLM-5.3-Flash / GLM-5.2（账本已有 `glm-5-3` 2026-08、`glm-5-3-flash` 2026-08-26、`glm-5-2` 2026-06-16）；`zai-org` HF 与 GitHub 窗口内 0 新仓，`api.z.ai` 需鉴权（401）。按 partial 记。
  - **StepFun**：官方 `stepfun.ai/research` **301 跳到白名单外主机**（`platform.stepfun.ai`），扫描通道记 `inaccessible`（`redirect host outside official allowlist`）；本批改走官方 `platform.stepfun.com/docs/zh/guides/models/*.md`（`.md` 变体可静态 GET，直出模型 ID、计费与明文评测数值）复核，在架模型为 Step 5 Preview / Step 3.7 Flash / Step 3.5 Flash / StepAudio 3 系列，**窗口内无新发布**；HF `stepfun-ai` 窗口内唯一新仓 `Step-5-Preview-NVFP4`（10-14）是已建档 `step-5-preview` 的 NVFP4 量化衍生件，量化版不另建档；GitHub `stepfun-ai/Step-5-Preview`（10-12）同源。**注意 `platform.stepfun.com/docs/sitemap.xml` 的 `lastmod` 是站点重建戳（全部模型指南条目同为一天），不可当发布日**——发布日要取技术报告或公告（StepAudio 3 取 arXiv 2609.12945 = 2026-09-11）。
  - **Qwen**：官方 `Qwen` HF 组织窗口内 0 新仓；GitHub `QwenLM` 窗口内唯一新仓 `BlenderWorld`（10-14）为官方基准仓、非模型发布；`qwen.ai` 为客户端渲染单行页，按既有替代通道（HF 组织）巡检。
  - **Microsoft**：官方 `microsoft.ai/blog/` 与 `/models/` 以浏览器 UA 可读，在架模型 MAI-Code-1.1-Flash / MAI-Voice-2.1 / MAI-Transcribe-2 / MAI-Thinking-1 / MAI-Image-2.6 与账本一一对应，账本最新为 2026-10-01（`mai-transcribe-2-streaming`、`mai-voice-2.1`），**窗口内无新发布**；HF `microsoft` 窗口内 3 个新仓均为研究产物（`Sentiment-Analysis-7B` 10-17 / `scFM-dataselection` 10-16 / `UserRepGen-4B` 10-14）；GitHub `microsoft` 窗口内新仓为 Amplifier 框架与 `sdbench`（10-19，官方基准仓）。**403 命中不稳定**（第三十四批 321 KB 全文可取、第三十五批全站挑战页、本轮又可达），按 partial 记，不声称穷尽。
- **入口扫描结果**：本批 `scan.mjs --write` 的结果已落盘到 `data/model-coverage.json`（`last_scan_at=2026-10-25T23:40:47.628Z`）；`microsoft.ai/blog/` 与 `/models/` 由上一轮的 `inaccessible`（HTTP 403）升为 `partial`（本轮以浏览器 UA 可达），`stepfun.ai/research/` 仍为 `inaccessible`（301 跳白名单外主机），其余通道状态与上一轮一致。
- **跳过清单**
  - **StepAudio 3 系列（阶跃星辰：TTS / ASR / Gen / Music / Realtime）**——官方 `platform.stepfun.com/docs` 与技术报告《StepAudio 3 Gen Technical Report》（`https://arxiv.org/abs/2609.12945`，arXiv **Submitted on 11 Sep 2026**）均可取，且 ASR 文档内有明文评测数值（无语音测试准确率 99%、上下文推理错误率 0.57%（vs StepAudio 2.5 ASR 1.59%、vs 豆包 ASR 2.0 1.00%）、垂类专名平均错误率 3.81%、AISHELL-6 悄悄话 CER 3.97%、中英文通用平均错误率分别较上一代降低 9.3% / 25.0% 等），但**发布日期在增量窗口之外**且账本无此条目，属**存量回填缺口**，本批不越窗建档，留待回填批次处理。
  - **腾讯混元 `DiagSafe`（GitHub 2026-10-15，arXiv 2610.29225）、`OmniCapBench`（2026-10-12，arXiv 2610.12458）**——窗口内官方**基准仓**，非模型发布；本批账本无与其关联的 evidence 行，不建 release。
  - **Microsoft `sdbench`（2026-10-19，Science 论文）、Qwen `BlenderWorld`（2026-10-14，arXiv 2610.23986）**——同上，窗口内官方基准仓、非模型发布，不建 release。
  - **xAI `grok-imagine-image-2.0`（2026-08-07）与 `grok-imagine-video-1.5`（2026-06-16）**——沿用第三十五批结论：官方发布文可取且已核到发布日期，但在增量窗口之外且账本无此条目，属存量回填缺口，本批不越窗建档。
  - **StepFun `Step-5-Preview-NVFP4`（2026-10-14）**——已建档 `step-5-preview` 的量化衍生版本，量化版不另建档。
  - **腾讯混元 `Qwen3-8B-DSpine-b16`（2026-10-16）**——投机解码 drafter 研究产物，非独立模型发布，不建档。
  - **Anthropic RSS（404）、智谱 `z.ai/blog`（404）与 `api.z.ai`（401）**——官方发布文入口本轮不可巡检，按 partial 记，不声称穷尽。
- **待人工核验**：遗留 32 条 pending 仍为官方图片评测表 / 无分数项（Kimi K3.1 Pro 官方图片评测表 28 行、Hy-Nomas-Bench 4 行），按纪律**不做视觉转写**、不填数值。本批新增 18 条全为**正文明文**，不涉及读图，不进 pending 清单。
- **门禁**：`node scripts/reconcile-coverage.mjs` 通过；`npm test` 19/19 通过；`node scripts/validate-data.mjs` PASS（taxonomy 9 类 / vendors 16 / benchmarks 477 / releases 203（official 189）/ evidence edges 3223）；`npm run build` 全链通过（`sync:skills:check` + `validate` + `build:epub:official` 484 KB + `build:web` 720 URL / 477 实体页 + 154 auto-evidence 页 + `validate:site` 908 HTML / 39245 内部引用 / 254 时间线 / 2145 事件卡）。
- **分支**：`model-release-daily-20261025T231917Z`（自 `origin/main` = `a31e154` 开出）。

## 第三十七批（2026-10-26 增量窗口 2026-10-10 ~ 2026-10-26）

- **窗口**：增量窗口 2026-10-10 ~ 2026-10-26（检查点锚点 `last_max_release_date=2026-10-24` 回退 14 天重叠）。检查点回写 `last_scan_at=2026-10-26`（UTC）、`last_max_release_date` **维持 2026-10-24**（本批未新增 release 条目，锚点不前进也不回退）。
- **窗口结论**：增量窗口内**确无新的官方模型发布**——窗口内 16 家厂商的发布已由第二十八~三十六批全部建档（账本内最大 `release_date` 仍为 2026-10-24 的 Kimi K3.1 Pro）。本批**不新建 release 条目**，改为一处**存量漏判补录**。
- **本批新增 evidence：10 条 = 10 verified + 0 pending**（全部 `source_kind: official_release_blog`、`source_tier: A`、`evidence_type: text`、`comparison_scope: only_same_protocol`）
  - **发现方式**：本批按窗口逐条重读官方通道后，又做了一遍**「归档页 vs 账本」交叉对账**（把 `models/*/page.html` 的可见文本里带「数字 + %」的句子逐句抽出来，与该 release 账本里已有的 `reported_score.value` 比对，凡账本里查无此值者列为候选）。这条对账路径在**前 36 批从未跑过**，本批一次命中一处真实漏判。
  - **漏判本体**：`mistral/mistral-large-4`（发布日 2026-10-06）在第二十二批建档时，`benchmark_evidence` 为**空数组**、release 级 `status` 记 `pending`，归档 `index.md` 与 `manifest.json` 的结论写的是「官方发布文评测全部为 WebP 图片图表，未在正文中披露离散数字表格」。
  - **复核结论：该结论有误**。按本仓**已归档的同一篇原文**（`models/2026-10-06-mistral-large-4/page.html`，sha256 `9128cfb2…`）复核，该页把**图表图片与正文散文明文**两种呈现形式混在同一页：既有 `/_astro/*.webp` 的 2400×1582 评测大图，正文段落里又明文印着 9 个绝对分值。数值全部位于可见正文（`<p class="text-body-large">`）内，非脚本载荷、非图片读数。
  - **补录的 10 条 evidence**（release_id=`mistral-large-4`，model_id=`mistral-large-4`）：
    - `mistral-mistral-large-4--aa-cyber-index` → **82%**（`benchmark_variant` = "reproduce-and-patch 子项（指数内单项，非指数总分）"）
    - `mistral-mistral-large-4--cybench` → **93%**（pass@1, overall, 40 项挑战）
    - `mistral-mistral-large-4--deepswe` → **61.7%**（v1.1）
    - `mistral-mistral-large-4--swe-atlas-codebase-qna` → **59.4%**
    - `mistral-mistral-large-4--terminalbench` → **28.3%**（4.0）
    - `mistral-mistral-large-4--aa-coding-agent-index` → **49.8%**
    - `mistral-mistral-large-4--automationbench` → **59.9%**
    - `mistral-mistral-large-4--dense200` → **42%**
    - `mistral-mistral-large-4--dense200-gpt-6-astra` → **41%**（`attribution_type: comparison_cited`，同句印出的竞品 GPT-6-Astra 分，单列一行）
    - `mistral-mistral-large-4--lakera-b3` → **93.3%**（`metric` = `attack-resistance-rate`，**方向为「攻击抵抗率」越高越好**，勿反读成攻击成功率）
  - **口径要点**：① AA Cyber Index 的 82% 是该指数**下的一项测试**（复现真实漏洞并打补丁），**不是指数总分**——指数总分只有官方图片图表，未印明文数值，故只记该分项并在 `benchmark_variant` 与 `notes` 里写明；② 该页另说明多家闭源模型因安全护栏拒答而在同一测试上接近零分，已写进 notes 供读者判读；③ 三处竞品对照（Coding Agent Index 对 DeepSeek V4 Pro 0813 / Qwen3.8 Max；AutomationBench 对 Kimi K3 / MiMo-V2.6-Pro / DeepSeek V4 Pro）**只印名次关系未印数值**，按口径不另建 `comparison_cited` 行；④ 官方正文**未明示任何评测协议**（harness / tools / 推理强度 / 温度 / 跑次数），`protocol` 12 键一律 `null`，未做推测；⑤ Dense 200 的 41% 是同句印出的竞品分，按「竞品独立明文引用」口径单列一行而非并入自家行。
  - **对既有 release 文件的唯一改动**：`data/model-releases/official/mistral/mistral-large-4.json` 追加上述 10 条 evidence（0 → 10）＋ 1 条 `revisions[]` 记录（`field: benchmark_evidence`，写明「仅追加、未改任何既有行、数值与状态」）＋ release `notes` 末尾补一句来源说明＋ release 级 `status` 由 `pending` 改为 `verified`（已存在 verified 行）＋ `models[0].capability_summary` / `key_traits` 改写为读者语言（原文写着「官方评测均为图表图片，未披露 DOM 离散打分表」，与补录事实相反，必须改）。**未改动任何既有 evidence 行**（本批前该文件一条 evidence 都没有）。
  - **归档同步修正**：`models/2026-10-06-mistral-large-4/index.md` 增补「勘误（2026-10-26 第三十七批）」节与「正文明文绝对分值」转录表；`manifest.json` 的 `index.md` sha256 重算、`limitations` 改为如实描述（原文是「只有图片图表」→ 现为「图表与正文明文两种形式并存，已补录明文部分，其余图表项未转录」）。`page.html` 未改，sha256 不变。
- **新 benchmark id：2 个（均已同步建实体，含 `summary` / `interpretation` / `measures` / `does_not_measure` / `dataset` / `metrics` / `versions` / `limitations` / `official_sources`）**
  - `aa-cyber-index`（Artificial Analysis Cyber Index）
  - `lakera-b3`（Lakera B3 AI Security Benchmark）
  - 两个实体的 `interpretation` 都写成读者能懂的口径提醒（前者强调「分项 ≠ 指数总分」，后者强调「抵抗率越高越好，别反读」）。
- **新厂商**：无。
- **逐厂商巡检（窗口 2026-10-10 ~ 2026-10-26）**
  - **OpenAI**：官方 `news/rss.xml` 1318 条，窗口内 31 条逐条看过；其中 17 个带评测数值嫌疑的页面逐页取全文核对，**只有 `terminal-x`（10-20，第三十五批已入库）与 `low-resource-programming-languages`（10-19，第三十六批已入库）确有明文绝对分值**，其余为业务指标/客户案例效率数字（如 Block 安全团队 triage 吞吐 +50%、Decisions API 4× 提速 30% 降价），非模型评测分值，不建行。`previewing-gpt-5-6-sol` companion 页重新取到（1.98 MB）复核：只含 ExploitBench / ExploitGym 的定性对比与缓存计费条款，**无新增明文分值**，README 待核验清单第 4 项维持原状。
  - **Anthropic**：newsroom 内嵌 JSON 解析出 24 篇带 `publishedOn` 的文章，窗口内最新为 2026-10-22（`donating-agent-skills-to-the-agentic-ai-foundation` / `open-call-guest-investigators-life-sciences`），均为公告与生态事项，**无新模型发布**。`platform.claude.com/docs/en/models/overview` 的 RSC payload 机读出在架 4 个模型（Haiku 5.5 = 2026-10-07 / Sonnet 5.5 = 2026-09-28 / Opus 5.5 = 2026-09-22 / Fable 5.1 = 2026-09-01），**全部已建档**；页面顶部那个「October 26, 2026」是 featured-grid 的**页面级日期**（对应条目仍是 9 月 22 日的 Opus 5.5），不是新文章发布日期。`anthropic.com/rss.xml` 静态 GET 仍 404。
  - **Mistral**：官方 RSS 92 条，最新为 2026-10-21（NVIDIA 合作）；changelog 最新条目 2026-10-22（Z.ai GLM 5.3 Flash 上架，第三方模型可售公告，不建档）。**本批的主要产出来自此厂商**：重读 `mistral-large-4` 归档页发现正文明文分值（见上）。
  - **Google**：`deepmind.google/blog/rss.xml` 100 条 + `blog.google/innovation-and-ai/rss/` 20 条 + developers-tools RSS，窗口内条目均为已建档模型或生态/研究文章，**无新发布**；`deepmind.google/models/gemini|gemma/` 在架为 Gemini 4 Argon 与 Gemma 4 系列，已建档。
  - **xAI**：`/news/<slug>` 直取 JSON-LD `datePublished`，本轮核过 `grok-4-7`(2026-09-21)、`grok-voice-3`(2026-10-14)；探测 `grok-4-8` / `grok-5` / `grok-5-1` / `grok-voice-4` / `grok-code-fast-2` / `grok-imagine-image-2-0` / `grok-imagine-video-2` / `grok-4-6-1` / `grok-reasoning-2` **全部 404**，**无新发布**。`docs.x.ai` 模型总表仍以 grok-4.7 为旗舰（已建档）。
  - **Meta**：`research.meta.ai/blog` 窗口内 3 篇——`muse-wonder`(10-12，已建档)、`developing-capable-models-responsibly`(10-14，研究方法文章)、`accelerating-scientific-research-in-health-data-science-with-muse-models`(10-15，基于已建档 Muse 模型的研究文章)，**无新发布**；另核 `introducing-muse-spark-meta-model-api`(2026-07-09) 与 `introducing-muse-code-and-muse-spark-1-2`(2026-08-05)，**均在增量窗口之外**，属存量回填缺口，本批不越窗建档。
  - **DeepSeek**：官方 `/updates` 通道窗口内最新仍为 2026-10-17（DeepSeek-V4.1-Flash-1017，已建档），**无新发布**。
  - **MiniMax**：`platform.minimax.io/docs/release-notes/models` 窗口内唯一条目仍是 Oct. 19, 2026 / MiniMax M3.1 Flash（已建档）；`minimax.io/news` 的 JSON-LD `dateModified` = 2026-10-26T01:06:55Z 是**全站重新生成时间戳**（沿用既有记录，不可当发布日），**无新发布**。
  - **Kimi**：官方博客列表页窗口内唯一新模型仍是 Kimi K3.1 Pro（10-24，已建档）；`whats-new` 页无新条目；官方 HF 组织 `moonshotai` 窗口内 0 新仓。
  - **Qwen**：官方 `Qwen` HF 组织窗口内 0 新仓（最新 `Qwen-Image-2.1-Turbo` 2026-10-09，已建档）；GitHub `QwenLM` 窗口内新建仓仅基准仓；`qwen.ai/sitemap.xml` 仍是 SPA HTML 而非 sitemap（既有障碍记录成立），按既有替代通道巡检。
  - **豆包**：官方 `seed.bytedance.com/sitemap.xml` 35 条 URL 全量比对，窗口内唯一新 URL 仍是招聘贴，**非模型发布**；全部模型发布文 lastmod ≤ 2026-09-28，均已建档。
  - **小米 MiMo**：官方 `mimo.xiaomi.com` + `/blog` 路由窗口内 0 篇新发布。
  - **腾讯混元 / 微信视觉**：官方 HF 组织窗口内 8 个新仓逐个核对——`Hy-Nomas-Diffusers`(10-24，第三十四批已登记为官方衍生仓)、`WeVisOne-VL-4B` / `-2B`(10-22，已建档)、`Hy-Nomas`(10-21，已建档)、`Hy-Memory-30B-A3B`(10-15，已建档) 及其 FP8 / GGUF 量化衍生件、`Qwen3-8B-DSpine-b16`(10-16，投机解码 drafter 研究产物)；GitHub `Tencent-Hunyuan` 窗口内新建仓均为基准/研究产物，**无新发布**。
  - **StepFun**：官方 `platform.stepfun.com/docs/sitemap.xml` 的 `lastmod` 仍是站点重建戳（多数条目同为 2026-10-21）；`platform.stepfun.com/docs/zh/guides/models/step-5-preview.md` 直取可读，在架模型 Step 5 Preview / Step 3.7 Flash / Step 3.5 Flash / StepAudio 3 系列，**窗口内无新发布**；HF `stepfun-ai` 窗口内唯一新仓 `Step-5-Preview-NVFP4`(10-14) 是已建档 `step-5-preview` 的量化衍生件，不另建档。
  - **智谱 GLM**：官方 `z.ai/blog` 静态 GET 仍 404；官方 `zai-org` HF 组织窗口内 0 新仓（最新 2026-08-25）；`docs.z.ai` 在架 GLM-5.3 / GLM-5.3-Flash / GLM-5.2 均已建档，**无新发布**。按 partial 记。
  - **Microsoft**：`microsoft.ai/blog/` / `/models/` / `/feed/` 本轮**全部 403 Cloudflare 挑战页**（第三十六批曾恢复 200，命中不稳定，与既有记录一致），官方 HF 组织窗口内 0 新仓、GitHub org 窗口内 0 新仓，**无法独立巡检公告通道**，按 partial 记，不声称穷尽。
- **入口扫描结果**：本批 `scan.mjs --write` 结果已落盘 `data/model-coverage.json`（`last_scan_at=2026-10-26T01:01:54.214Z`）；`microsoft.ai/blog/` 与 `/models/` 由上一轮的 `partial` 降为 `inaccessible`（HTTP 403），其余通道状态与上一轮一致。候选数 560 未变；`mistral-large-4` 候选的 `evidence_status` 由 `not_reported` 翻为 `reported`（本批补录的直接影响）。
- **跳过清单**
  - **Mistral 官方图表项**（CyberGym-E2E、AA-Briefcase、Finance Agent v2 / FinWorkBench、Harvey's Legal Agent、ChartQA Pro、GDP.pdf、Science and Math、Surge AI 盲评 1–5 分制）——只有图片或无数值表述，**不做视觉转写、不建行、不填数值**。
  - **AA Cyber Index 总分**——只有官方图片图表，未印明文数值，**不建行**（本批只记其分项 82%）。
  - **Meta `introducing-muse-spark-meta-model-api`(2026-07-09) 与 `introducing-muse-code-and-muse-spark-1-2`(2026-08-05)**——官方发布文可取且已核到发布日期，但在增量窗口之外且账本无对应条目，属存量回填缺口，本批不越窗建档。
  - **StepAudio 3 系列**（阶跃星辰）——官方文档与技术报告（arXiv 2609.12945 = 2026-09-11）均可取且含明文评测数值，但发布日期在增量窗口之外且账本无此条目，属存量回填缺口，本批不越窗建档。
  - **xAI `grok-imagine-image-2.0`（2026-08-07）与 `grok-imagine-video-1.5`（2026-06-16）**——官方发布文可取且已核到发布日期，但在增量窗口之外且账本无此条目，属存量回填缺口，本批不越窗建档。
  - **OpenAI 业务指标类数字**（Block triage 吞吐 +50%、Decisions API 4× 提速 / 30% 降价、Third Moment 10,000 agents 36+ 小时等）——客户案例的效率/成本数字，非模型评测分值，不建行。
  - **Microsoft 窗口内无新发布**——官方博客通道本轮不可巡检（403），按 partial 记。
- **待人工核验（沿用第三十三~三十六批结论，本批未动）**：遗留 32 条 pending 仍为官方图片评测表 / 无分数项（Kimi K3.1 Pro 官方图片评测表 28 行、Hy-Nomas-Bench 4 行），按纪律**不做视觉转写**、不填数值。本批新增 10 条全为**正文明文**，不涉及读图，不进 pending 清单。
- **渠道地图回写**：本批把「图表页也可能同时含正文明文分值」这条教训写回 `.claude/skills/ingest-releases/references/discovery-channels.md`（Mistral 行 + 「已知抓取障碍」表新增一行），并执行 `npm run sync:skills` 同步镜像，`sync:skills:check` 零漂移通过。
- **门禁**：`node scripts/reconcile-coverage.mjs` 通过；`node --test tests/*.test.mjs` 19/19 通过（含「本批官方归档文件与 manifest 哈希一致」）；`node scripts/validate-data.mjs` PASS（taxonomy 9 类 / vendors 16 / benchmarks 479（+2）/ releases 203（official 189）/ evidence edges 3233（+10））；`npm run build` 全链通过（`sync:skills:check` + `validate` + `build:epub:official` 484 KB + `build:web` 722 URL / 479 实体页 + 154 auto-evidence 页 + `validate:site` 910 HTML / 39356 内部引用 / 256 时间线 / 2154 事件卡）。
- **分支**：`model-release-daily-20261026T010000Z`（自 `origin/main` = `a4363ea` 开出）。
## 第三十八批（2026-10-27 增量窗口 2026-10-10 ~ 2026-10-26）

- **窗口**：增量窗口 2026-10-10 ~ 2026-10-26（检查点锚点 `last_max_release_date=2026-10-24` 回退 14 天重叠）。检查点回写 `last_scan_at=2026-10-26`（UTC）、`last_max_release_date` 由 **2026-10-24 前进到 2026-10-26**（本批新增 2 条 release 条目，锚点随之前进）。
- **窗口结论**：增量窗口内**确有 2 个新的官方模型发布**，均在本批新建 release 条目——OpenAI **GPT-6.1 Terra**（`openai/gpt-6-1-terra`）与腾讯混元 **Hy-SimulMT-30B-A3B**（`tencent/hy-simulmt`），发布日同为 **2026-10-26**；其余 14 家厂商窗口内**无新发布**。
- **本批新增 release：2 个；新增 evidence：13 条 = 12 verified + 1 pending**
  - **OpenAI `gpt-6-1-terra`（7 条，全部 `source_kind: official_release_blog` / `source_tier: A` / `evidence_type: text` / `comparison_scope: only_same_protocol`）**
    - `openai-gpt-6-1-terra--openai-error-inducing-prompts-error-rate-low-effort` → **16.7%**（官方内部诱导性提示基准，low 努力级别；前代 GPT-5.6 Terra 53.6%）
    - `openai-gpt-6-1-terra--openai-error-inducing-prompts-error-rate-max-effort` → **4.3%**（同基准，max 努力级别）
    - `openai-gpt-6-1-terra--terminalbench-terminal-bench-4-0` → **50.3%**（前代 GPT-5.6 Terra 21.5%）
    - `openai-gpt-6-1-terra--agents-last-exam` → `not_extracted`
    - `openai-gpt-6-1-terra--mmmu-pro` → `not_extracted`
    - `openai-gpt-6-1-terra--osworld`（variant `2.1`）→ `not_extracted`
    - `openai-gpt-6-1-terra--terminal-bench-science-terminal-bench-science-0-1` → `not_extracted`
  - **腾讯混元 `hy-simulmt`（6 条，全部 `source_kind: official_model_card` / `source_tier: A`；5 条 `evidence_type: text`、1 条 `evidence_type: figure`）**
    - `tencent-hy-simulmt--fleurs` → **90.3**
    - `tencent-hy-simulmt--covost2` → **75.5**
    - `tencent-hy-simulmt--acl6060` → **81.2**
    - `tencent-hy-simulmt--realsi-realsi-sentence` → **84.7**（官方明写「全表最高」）
    - `tencent-hy-simulmt--laal-latency-streamlaal` → **≈3s**（官方原文 approximately 3 seconds）
    - `tencent-hy-simulmt--realsi-realsi-long-form-audio-gemba` → **pending / not_extracted**（GEMBA 绝对值只在官方散点图里）
  - **口径要点**：① Terra 四项（Agents' Last Exam / MMMU-Pro / OSWorld 2.1 / Terminal-Bench-Science 0.1）官方**只印相对结论与相对成本**（+15 分、约 3 倍 token 效率、约 1/9 单任务成本、「相差 5 分以内」等），无绝对分值，按口径记 `verified` + `score_status:"not_extracted"`，**不折算绝对分、不建 `comparison_cited` 行**；② Hy-SimulMT 的 GEMBA 是**位图散点图**行，按纪律视觉转写只进 `notes`、数值留 `null`；③ 两家官方发布页**均未明示评测协议**（harness / tools / 温度 / 跑次数），`protocol` 12 键一律 `null`，只在正文点名的推理努力级别处填 `reasoning_effort`；④ Hy-SimulMT 四列短音频基准的分数官方只声明「越高越好」、**未说明所用自动指标**，故 `metric` 只记 `translation quality score`，**不臆断**为 BLEU / COMET；⑤ Terra 的内部诱导性提示基准是厂商未公开题集，只能读成同代际前后对比。
- **新 benchmark id：3 个（均已同步建实体，含 `summary` / `interpretation` / `measures` / `does_not_measure` / `dataset` / `metrics` / `versions` / `limitations` / `official_sources`）**
  - `openai-error-inducing-prompts`（OpenAI 内部诱导性提示错误率基准）
  - `acl6060`（短音频语音翻译评测集 ACL6060）
  - `realsi`（RealSI 真实场景同传评测集，含 RealSI-Sentence 与长音频两个版本）
  - 三个实体的 `interpretation` 都写成读者能懂的口径提醒：`openai-error-inducing-prompts` 强调**错误率越低越好**（方向与准确率相反）且引用必须带努力级别条件；`acl6060` 强调**同一张表四列分属四个不同测试集、分数尺度不可横向比**；`realsi` 强调 **StreamLAAL 越低越好、GEMBA 越高越好、且 StreamLAAL 不等于首句语音输出时间**。
  - `laal-latency` 沿用既有候选 id（第三十二批已登记），**未**新建实体。
- **新厂商**：无。
- **逐厂商巡检（窗口 2026-10-10 ~ 2026-10-26）**
  - **OpenAI**：官方 `news/rss.xml` 1325 条，窗口内条目逐条看过；**`introducing-gpt-6-1-terra`（10-26）为本批新发布并建档**；`gpt-6-1-sol-coderabbit-code-security`（10-26）经取全文核对为**客户案例页**（正文无任何评测分值，只有案例叙述）→ 记排除原因「客户案例/行业实践文章，非独立模型发布」；`chatgpts-expanding-world-of-work`（10-26）为产品页 → 记排除；其余窗口内条目为业务指标 / 合作 / 客户 / 工程文章。
  - **Anthropic**：`platform.claude.com/docs/en/models/overview` 在架模型清单（Fable 5.1 / Opus 5.5 / Sonnet 5.5 / Haiku 5.5 / Fable 5 / Opus 5 / Opus 4.8 …）**全部已建档**，**无新发布**。注：本轮逐页探测 `Released` 字段时该页 SSR 结构已变（`<dt>Released</dt><dd>` 不再直接可匹配），改为按在架清单与既有账本比对确认无新增，**未据此声称已核到每个模型的发布日**。
  - **Google**：`deepmind.google/blog/rss.xml` 100 条 + `blog.google/rss/` 20 条，窗口内条目为已建档的 Gemini 4 Argon（10-13 GA 已在库，含 Robotics 分支）与研究 / 产品文章，**无新发布**。
  - **xAI**：`docs.x.ai/docs/release-notes` 逐条核过——窗口内 Grok Voice 2.0 弃用（10-14）、`grok-voice-transcribe-1.0` 终止（10-2）、Grok 4.7 系列**均已建档**；页面底部 `Last updated: October 15, 2026` 是**文档站整页更新时间戳**、不是发布日；**无新发布**。
  - **Meta**：`research.meta.ai/blog` 可静态 GET，链接发现得窗口内条目 `muse-wonder`(10-12，已建档)、`muse-spark-open`（已建档）与 `accelerating-scientific-research-in-health-data-science-with-muse-models`(10-14，**基于已建档 Muse 模型的研究文章**，非模型发布)，**无新发布**。
  - **Mistral**：官方 RSS 92 条，窗口内 `Voxtral 3`(10-20)、`Timestral`(10-15)、`Mistral Large 4`(10-06) **均已建档**，**无新发布**。
  - **Kimi**：官方博客列表页窗口内最新仍是 Kimi K3.1 Pro（10-24，已建档）；`kimi-code` 的 whats-new 页本轮只有 CLI 版本更新（产品，非模型发布）；HF `moonshotai` 窗口内 0 新仓；**无新发布**。
  - **DeepSeek**：官方 `/updates` 通道窗口内最新仍为 2026-10-17（DeepSeek-V4.1-Flash-1017，已建档），**无新发布**。
  - **GLM**：官方 `z.ai/blog` 静态 GET 仍 404（既有障碍记录成立）；HF `zai-org` 窗口内 0 新仓（最新 2026-08-25）；GitHub `zai-org` 窗口内 0 新模型仓；**无新发布**，按 partial 记，不声称穷尽。
  - **MiniMax**：`platform.minimax.io/docs/release-notes/models` 窗口内唯一条目仍是 Oct. 19, 2026 / MiniMax M3.1 Flash（已建档）；HF `MiniMaxAI` 窗口内 0 新仓；**无新发布**。
  - **Qwen**：`qwen.ai/research` 为纯客户端渲染（可见文本仅 6 字符，取不到）；HF `Qwen` org 窗口内 0 新仓；GitHub `QwenLM` 窗口内新建仓只有 `BabelArena`(10-22) 与 `BlenderWorld`(10-14) 两个**基准仓**、非模型发布；**无新发布**。
  - **豆包**：官方 `seed.bytedance.com/sitemap.xml` 全量比对，窗口内唯一新 URL 是招聘贴，**非模型发布**；**无新发布**。
  - **小米 MiMo**：官方 `mimo.xiaomi.com` 可见文本无窗口内新条目，**无新发布**。
  - **腾讯混元 / 微信视觉**：HF `tencent` org 窗口内新仓逐一核对——`Hy-SimulMT-30B-A3B`（**本批建档**）、`Hy-Nomas-Diffusers`(10-24，已登记官方衍生仓)、`WeVisOne-VL`(10-22，已建档)、`Hy-Nomas`(10-21，已建档)、`Hy-Memory-30B-A3B`(10-15，已建档) 及其量化衍生件、`Qwen3-8B-DSpine-b16`(10-16，投机解码 drafter 研究产物)；GitHub `Tencent-Hunyuan` 窗口内新建 `Hy-SimulMT`(10-22) 与基准仓。**本批的主要产出来自此厂商**。
  - **StepFun**：官方 `platform.stepfun.com/docs/zh/guides/models/` 在架模型 Step 5 Preview / Step 3.7 Flash / Step 3.5 Flash / StepAudio 3 系列 / Step TTS Mini 等，**全部已建档**；HF `stepfun-ai` 窗口内唯一新仓 `Step-5-Preview-NVFP4`(10-14) 是已建档模型的量化衍生件；**无新发布**。
  - **Microsoft**：官方 `microsoft.ai/blog/` 本轮**恢复 200 可取**（第三十六批曾恢复、第三十七批撞 403 Cloudflare，命中不稳定与既有记录一致），可见文本无窗口内新模型条目，在架为 MAI-Code-1.1-Flash / MAI-Voice-2.1 / MAI-Transcribe-2 / MAI-Thinking-1 等已建档模型；HF `microsoft` org 与 GitHub org 窗口内 0 新模型仓；**无新发布**。
- **入口扫描结果**：本批 `scan.mjs --write` 结果已落盘 `data/model-coverage.json`（`last_scan_at=2026-10-26T23:20:28.740Z`）；候选数 560 → **564**（+4）：`openai-35e334c19874`（GPT-6.1 Terra → 挂 `gpt-6-1-terra`，`official_source_verified: true`、`archive_status: archived`）、`release-hy-simulmt`（由 `reconcile-coverage` 按 primary_sources 自动补建 → 挂 `hy-simulmt`，`official_source_verified: true`、`archive_status: archived`）、`openai-7d972df501d0`（CodeRabbit 客户案例 → 记排除原因）、`openai-27334100e818`（ChatGPT 产品页 → 扫描器自带排除原因）。另修正 `openai-7d972df501d0` 的 `classification`：扫描器因标题含「**Code**Rabbit」被 `/coder?/` 误判为 `vertical`，实为客户案例页，改为 `product`（与既有排除先例一致）。
- **跳过清单**
  - **Terra 四项只给相对结论的评测**（Agents' Last Exam / MMMU-Pro / OSWorld 2.1 / Terminal-Bench-Science 0.1）——**不折算绝对分、不建 `comparison_cited` 行**，记 `not_extracted`。
  - **Hy-SimulMT 的人机同传对比**（18 段 2026-09 后新上线录音、各约 6 分钟、10 个领域、6 名 CATTI 持证译员）——结论在图片里、无绝对分值，且官方自述只适用于本次样本、未覆盖语音质量与音色相似度，**不建行**。
  - **Hy-SimulMT 的 GEMBA 绝对值**——只在官方散点图里，**不做视觉转写进数值字段**，记 `pending` + `not_extracted`，读图结果只进 `notes`。
  - **Hy-SimulMT 的声音克隆 / 音色定性描述**、**OpenAI Preparedness Framework「Critical」等安全结论**（无量化评测分）——**不建行**。
  - **OpenAI 业务指标类数字**——客户案例的效率 / 成本数字，非模型评测分值，不建行。
- **待人工核验**：本批新增 **1 条 pending**（`tencent-hy-simulmt--realsi-realsi-long-form-audio-gemba`，官方散点图行）。沿用第三十三~三十七批结论，遗留 32 条 pending（Kimi K3.1 Pro 官方图片评测表 28 行、Hy-Nomas-Bench 4 行）仍为官方图片 / 无分数项，按纪律**不做视觉转写**、不填数值，本批未动。
- **渠道地图回写**：本批把三条实测教训写回 `.claude/skills/ingest-releases/references/discovery-channels.md` 并执行 `npm run sync:skills` 同步镜像，`sync:skills:check` 零漂移通过：
  ① **RSS `pubDate` 必须是 RFC-822 格式**（`Mon, 26 Oct 2026 22:00:00 GMT`，日-月-年）——只认 ISO 的解析器会把整条 RSS 的窗口内条目**静默全丢**，本批的 GPT-6.1 Terra 正是在这条上差点漏检；自检手段是「窗口内条目数为 0 时先怀疑日期解析」。② `docs.x.ai/docs/release-notes` 的 `Last updated: October 15, 2026` 是**整页时间戳**、只认分组标题。③ 新增「官方模型仓 README 原文可直接取」一节——`https://huggingface.co/<org>/<repo>/raw/main/README.md` 直出 markdown（表格 = 真表格，逐格可机读）、仓内 `assets/` 图片可从 `/resolve/main/assets/<file>` 直取、**发布日优先取仓内 News 节印刷日**（Hy-SimulMT 的 HF `createdAt` = 2026-10-22，官方 News 节 = 2026.10.26，相差 4 天），并记下厂商「自家整行加粗 + 各列最高分另加粗」的读表规则。
- **门禁**：`node scripts/reconcile-coverage.mjs` 通过；`node --test tests/*.test.mjs` **19/19 通过**（含「本批官方归档文件与 manifest 哈希一致」）；`node scripts/validate-data.mjs` **PASS**（taxonomy 9 类 / vendors 16 / benchmarks 482（+3）/ releases 205（official 191，+2）/ evidence edges 3246（+13））；`npm run build` 全链通过（`sync:skills:check` + `validate` 32 章 / 219 条 numeric-claim warning 为存量不阻断 + `build:epub:official` 484 KB / `build:web` 727 URL + 482 实体页 + 154 自动证据页 + `validate:site` 915 HTML / 39562 内部引用 / 258 时间轴 / 2168 事件卡）。
- **分支**：`model-release-daily-20261026T231930Z`（自 `origin/main` = `0a9686d` 开出，隔离 worktree `C:\Users\cheng\code\github\.worktrees\evals\model-release-daily-20261026T231930Z`）。
## 第三十九批（2026-10-27 增量窗口 2026-10-10 ~ 2026-10-27）

- **窗口**：增量窗口 2026-10-10 ~ 2026-10-27（检查点锚点 `last_max_release_date=2026-10-24` 回退 14 天重叠）。检查点回写 `last_scan_at=2026-10-27`（UTC）、`last_max_release_date` 由 2026-10-24 **前进到 2026-10-27**（本批新增 release 发布日为 2026-10-27）。
- **窗口结论**：窗口内确有 **2 个新的官方模型发布**——**Google DeepMind Genie 4**（2026-10-27，官方**未发布任何评测数值**）与 **Microsoft AI MAI Image 2.7**（2026-10-27，官方只给**名次与相对差**、无绝对分值）；另从 OpenAI 官网 2026-10-27 客户案例文章中捞到 **1 套客户自建评测（Retell vCX）的明文绝对分值**，覆盖 4 个既有 release。
- **本批新增 release：2 个**
  - `google/genie-4`（Genie 4，2026-10-27）——**0 条 evidence**，release `status: pending`。日期三源互证（页面印刷日 / JSON-LD `datePublished=2026-10-27T16:13:00+00:00` / DeepMind 官方 RSS `pubDate`）；官方发布文与 Genie 4 模型页**通篇无任何评测名称与分数**（可见文本正则核对：百分比命中 0 处、`<table>` 0 处、数字+单位 0 处、图表数值 0 处），按「无数值不臆造、无评测名称不硬挂」不建任何 evidence 行。归档 `models/2026-10-27-genie-4/`。
  - `microsoft/mai-image-2-7`（MAI Image 2.7，2026-10-27）——**1 条 evidence（配图行，pending）**，release `status: pending`。官方发布通告只给名次与相对差：正文「在全部 10 个使用场景与 7 类编辑动作上优于 MAI-Image-2.6」「场景与风格类领先次优模型 **24 Elo**」；配图（两张内联 SVG）给出 Artificial Analysis Image Arena（AA-Image-Editing v2.1）总榜第 2 名与分类名次爬升（推理式编辑 7→1、场景与风格 7→1、文字或符号编辑 6→1，Evaluated 22 Oct 2026）。**页面未印任何绝对 Elo 数字或百分比**，故唯一一条 evidence 记 `evidence_type: figure`、`reported_score.value: null`、`score_status: not_extracted`、`status: pending`，视觉转写值只进 notes。归档 `models/2026-10-27-mai-image-2-7/`（含解码后的两张原始 SVG 图表）。
- **本批新增 evidence：7 条 = 3 verified + 4 pending**
  - **verified 3 条（正文明文绝对值，全部 `source_kind: official_release_blog` / `source_tier: A` / `attribution_type: third_party_reported` / `benchmark_id: retell-vcx`）**：来源为 OpenAI 官网 2026-10-27 客户案例文章《Retell uses OpenAI models to help power 100M monthly calls》，披露语音 AI 公司 Retell AI 自建 **vCX benchmark** 的成绩——
    - `openai-gpt-6-astra--retell-vcx-instruction-following` → **89.7%**（vCX 2026-10-13 批次指令遵循率，GPT-6 Astra 排名第一；配图柱状图同值互证）
    - `openai-gpt-5-5--retell-vcx-non-hallucination-rate` → **88.0%**（GPT-6 Astra 发布前评测批次，开推理）
    - `openai-gpt-5-5--retell-vcx-tool-call-correctness` → **88.3%**（同批次，开推理）
  - **pending 4 条（数值只在配图里，按纪律不自动翻 verified，视觉转写值只进 notes）**：
    - `openai-gpt-5-5--retell-vcx-instruction-following` → 视觉转写 **85.6%**
    - `openai-gpt-6-1-sol--retell-vcx-instruction-following` → 视觉转写 **88.5%**
    - `openai-gpt-6-sol-and-luna--retell-vcx-instruction-following` → 视觉转写 **86.2%**
    - `microsoft-mai-image-2-7--artificial-analysis-image-arena` → Artificial Analysis Image Arena 总榜**第 2 名**（名次非分值，值留空）
  - 覆盖既有 release：gpt-6-astra(8→9)、gpt-5-5(128→131)、gpt-6-1-sol(10→11)、gpt-6-sol-and-luna(21→22)。四个文件均只**追加** evidence 行 + 追加 1 条 `revisions[]` + release `notes` 末尾补一句来源说明，**未改动任何既有行、数值、status 与 locator**。
  - 口径要点：① Retell vCX 由客户自建自跑自报、OpenAI 官网转载，故记 `third_party_reported`（不计厂商自报）；② 竞品列只给相对结论（Gemini-3.1-Pro、Claude-4.6 在两项上均低于 GPT-5.5，无绝对值），只写进 notes，**不建 comparison_cited 行**；③ 图表 Top 5 中的 Claude-5.5 Opus 83.8% 同理只进 notes；④ 页面数字分属**不同批次**（2026-10-13 指令遵循率榜单 vs GPT-6 Astra 发布前的两批次），不可当同一张表读；⑤ 客户运营指标（100M+ 月通话、80%+ 解决率、1 万亿 tokens、每员工 160 万美元营收、Anker 80.4% 与 NPS 63）**不入账本**；⑥ 官方未明示题集、样本量与评分细则，协议字段除 `harness` / `reasoning_effort` / `judge`（页面明示）外一律 null。
- **新 benchmark id：2 个（均已同步建实体，含 `summary` / `interpretation` / `measures` / `does_not_measure` / `dataset` / `metrics` / `versions` / `limitations` / `official_sources`）**
  - `retell-vcx`（Retell vCX Benchmark，categories=[agent]）——interpretation 写明读法、当前水位与四条口径提醒（客户自建不可横向比较、批次不同不可对齐、题集未公开）。
  - `artificial-analysis-image-arena`（Artificial Analysis Image Arena，categories=[preference]）——interpretation 写明「名次是相对量、绝对 Elo 不公开、版本即口径、分类名次 ≠ 总榜名次」。
- **新厂商**：无。
- **逐厂商巡检（窗口 2026-10-10 ~ 2026-10-27）**
  - **OpenAI**：官方 `news/rss.xml` 1331 条，窗口内 10 条逐条看过 → `introducing-gpt-6-1-terra`(10-26，已在**未合并的 PR #30（第三十八批）**建档，本批不重复建档)、`gpt-6-1-sol-coderabbit-code-security`(10-26，纯定性)、`greptile-code-review-codex-astra`(10-26，纯定性)、`check-point-daybreak`(10-27，纯定性)、`fanatics-streamline-fan-experience`(10-27，仅 10% 互动率业务指标)、**`retell-ai`(10-27，含明文绝对分值 → 本批建档)**，其余为产品公告、事件报告与研究文章，**非模型发布**。
  - **Google**：`deepmind.google/blog/rss.xml` 100 条 + `blog.google` 系列 RSS → 窗口内唯一新模型发布即 **Genie 4**(10-27，已建档)；另 8 条为 Gemini 4 Argon 演示、AI Quest 脑图研究、Fitbit / 电网 / 农业 / 退伍军人等非模型内容；`deepmind.google/models/gemini|gemma/` 在架均已建档。
  - **Microsoft**：`microsoft.ai/news/` 本轮可访问（此前批次为 403），扫出 **MAI Image 2.7**(10-27，已建档)；官方 HF `microsoft` 组织窗口内唯一新仓 `CogACT-v2-RoboDojo`(10-25) 是机器人研究检查点（沿用 CogACT-v1 先例，非 MAI/Phi 产品发布）；GitHub org 窗口内新建仓均为工具/样例（FoundryX、Visio-Desktop-MCP-Server、amplifier-* 等）；官方博客列表页为客户端渲染，静态文本读不到条目 → 按 partial 记，不声称穷尽。
  - **Mistral**：官方 RSS 92 条窗口内 0 条；changelog 2026-10-22 的 Z.ai GLM 5.3 Flash 是第三方模型上架公告（该 release 已在库）、2026-10-20 的 Voxtral 3 家族已建档 → 无新发布。
  - **xAI**：`/news/<slug>` 探测 grok-4-8 / grok-5 / grok-5-1 / grok-5-2 / grok-voice-4 / grok-code-fast-2 / grok-imagine-image-2-0 / grok-imagine-video-2 / grok-4-6-1 / grok-reasoning-2 **全部 404**；`docs.x.ai/docs/models` 在架 grok-4.7 / grok-4.20 / grok-4.6 / grok-4.5 / grok-4.3 全部已建档；`grok-code-fast-1` / `grok-build` / `grok-imagine-image` 文档页最新日期为 2026-08-17 / 2026-09-21 / 2026-03-02，**在增量窗口之外**，属存量回填缺口，本批不越窗建档 → 无新发布。
  - **Anthropic**：`www.anthropic.com/news` 200 但 `publishedOn` 解析窗口内 0 篇；`anthropic.com/rss.xml` 仍 404；沿用既有结论（在架 Opus 5.5 / Sonnet 5.5 / Haiku 5.5 / Fable 5.1 均已建档）→ 按 partial 记，不声称穷尽。
  - **Meta**：`research.meta.ai/blog` 200，窗口内标题列表仍是 Muse 家族已建档条目（Muse Wonder / Muse Spark Open / Muse Spark 1.3 / Muse Voice Transcribe / Muse Glimmer / Muse Image·Video 等）→ 无新发布。
  - **DeepSeek**：`api-docs.deepseek.com/updates` 200（客户端渲染，静态文本窗口内 0 条日期）、官方 news feed 0 条 item → 沿用既有结论（最新 2026-10-17 DeepSeek-V4.1-Flash-1017 已建档），按 partial 记。
  - **MiniMax**：`platform.minimax.io/docs/release-notes/models` 200（597 KB，日期客户端渲染，静态文本 0 条）；沿用既有结论（最新条目 Oct. 19, 2026 / MiniMax M3.1 Flash 已建档），`minimax.io/news` 的 `dateModified` 是全站重生成戳，**不可当发布日** → 无新发布。
  - **Kimi**：官方博客 RSS 窗口内唯一新模型仍是 Kimi K3.1 Pro(10-24，已建档)；官方 HF `moonshotai` 窗口内 0 新仓 → 无新发布。
  - **Qwen**：官方 HF `Qwen` 组织窗口内 0 新仓；GitHub `QwenLM` 窗口内新建仓仅 `BabelArena`(10-22，**基准仓非模型发布**)；`qwen.ai/sitemap.xml` 仍是 SPA HTML，按既有替代通道巡检 → 无新发布。
  - **豆包**：官方 `seed.bytedance.com/sitemap.xml` 35 条 URL 全量比对，最大 lastmod 2026-10-14，窗口内 0 条 → 无新发布。
  - **小米 MiMo**：`mimo.xiaomi.com` 与 `/blog` 均 200，窗口内 0 条日期 → 无新发布。
  - **腾讯混元 / 微信视觉**：官方 HF `tencent` 组织窗口内唯一新仓 `Hy-Nomas-Diffusers`(10-24，第三十四批已登记为官方衍生仓)；GitHub `Tencent-Hunyuan` 窗口内新建仓 `Hy-SimulMT`(10-22，已在**未合并的 PR #30** 建档)、`Hy-Nomas`(10-21，已建档) → 无新发布。
  - **StepFun**：官方 docs sitemap 148 条 URL 的 lastmod 全为 2026-10-27T03:13 站点重建戳（与既有记录一致）；`step-5-preview.md` 直取 200，在架 Step 5 Preview / Step 3.7 Flash / Step 3.5 Flash 均已建档；HF `stepfun-ai` 窗口内 0 新仓 → 无新发布。
  - **智谱 GLM**：`z.ai/blog` 仍 404；`docs.z.ai` 在架 GLM-5.3 / GLM-5.3-Flash / GLM-5.2 均已建档；HF `zai-org` 窗口内 0 新仓 → 无新发布，按 partial 记。
- **入口扫描结果**：本批 `scan.mjs --write` 结果已落盘 `data/model-coverage.json`（`last_scan_at=2026-10-27T23:21:13.933Z`，候选 569 → 570）；`reconcile-coverage.mjs` 已把本批新增 release 补进候选（`release-genie-4`、`release-mai-image-2-7`，`evidence_status` 分别为 `not_reported` 与 `not_extracted`）。本轮新扫出的 3 个 `general/vertical` 候选已按口径归类：Terra 候选标 `excluded`（已在未合并的 PR #30 建档，避免同名 release 冲突）、CodeRabbit 候选标 `excluded`（客户案例无数值）、MAI Image 2.7 候选挂到本批 release。
- **跳过清单**
  - **OpenAI 业务指标类数字**（Fanatics 10% 互动率、Retell 100M 月通话 / 80%+ 解决率 / 1 万亿 tokens / 每员工 160 万美元营收、Anker 80.4% 解决率与 NPS 63）——客户运营指标而非模型评测分值，不建行。
  - **OpenAI 纯定性客户案例**（CodeRabbit、Greptile、Check Point Daybreak）——通篇无数值，不建行。
  - **Retell vCX 竞品列**（Gemini-3.1-Pro、Claude-4.6、Claude-5.5 Opus 83.8%）——页面只给相对结论或仅见于配图，且非自家模型列，只写进 notes，不建行。
  - **MAI Image 2.7 的绝对分值**——官方页面**未印任何 Elo 数字或百分比**，只有名次与相对差；「场景与风格领先次优 24 Elo」属相对差，不建行，只写 notes。
  - **OpenBMB MiniCPM-OCR-1.0 / MiniCPM-OCR-Jev 及其量化衍生件**（HF 2026-10-25 ~ 2026-10-26）——OpenBMB **不在在册 16 家厂商内**，接入属「新增厂商接入」（需注册 + 真实彩色 logo + LOGO_EXT 登记），按任务边界留人工决策，本批不建档。
  - **NVIDIA Metatron-v1**（HF 2026-10-27）——NVIDIA 不在在册厂商内，沿用第三十二批先例不建档。
  - **microsoft/CogACT-v2-RoboDojo**（HF 2026-10-25）——研究检查点，沿用 CogACT-v1 先例，非 MAI/Phi 产品发布。
  - **QwenLM/BabelArena**（2026-10-22）——基准仓而非模型发布；本批未建 benchmark 实体。
  - **xAI grok-code-fast-1 / grok-build / grok-imagine-image**——仅见于 docs 模型页且文档日期在增量窗口之外，属存量回填缺口，本批不越窗建档。
  - **Genie 4 的任何评测数值**——官方本轮未发布，无数值可录（不是「跳过」，是「无数值」）。
- **待人工核验**：本批新增 pending 4 条——Retell vCX 配图柱状图 3 行（GPT-5.5 85.6%、GPT-6.1 Sol 88.5%、GPT-6 Sol 86.2%）与 Artificial Analysis Image Arena 总榜名次 1 行（MAI-Image-2.7 第 2 名），视觉转写值已写入各自 `notes`，读图确认后方可翻 verified；沿用第三十三~三十七批的既有 pending 清单不变。
- **门禁**：`node scripts/reconcile-coverage.mjs` 通过；`node --test tests/*.test.mjs` 19/19 通过；`node scripts/validate-data.mjs` PASS（taxonomy 9 类 / vendors 16 / benchmarks 481（+2）/ releases 205（official 191，+2）/ evidence edges 3240（+7））；`npm run build` 全链通过（`sync:skills:check` + `validate` + `build:epub:official` 484 KB / 32 章 + `build:web` 726 URL / 481 实体页 + 154 auto-evidence 页 + `validate:site` 914 HTML / 39498 内部引用 / 257 时间轴 / 2162 事件卡）。
- **分支**：`model-release-daily-20261027T232056Z`（自 `origin/main` = `0a9686d` 开出）。
