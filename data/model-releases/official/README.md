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
