---
vendor: anthropic
model: Claude Fable 5.1 / Claude Mythos 5.1
release: claude-fable-5-1
date: 2026-09-01
source: https://www.anthropic.com/claude-fable-and-mythos-5-1
fetched_at: 2026-09-02
---

# Claude Fable 5.1 and Claude Mythos 5.1

## 评测数据（转录）

来源：页面 DOM 机读表格（Next.js BenchmarkGrid 组件，整页仅 1 个 `<table>` 元素）。**本页与上一代 Anthropic 发布不同——headline 数值不在图片里**，Fable 5 发布页的总表是图片（见 `models/2026-06-09-claude-fable-5/`），本页全部为 DOM 文本，逐行机读核验。列：Fable 5.1 | Fable 5 | Opus 5 | GPT-5.6 Sol。

| 评测 | 分数 | 备注 |
|---|---|---|
| Agentic scientific research — Terminal-Bench-Science 0.1 [1] | 52.6% | Fable 5: 24.7% · Opus 5: 29.0% · GPT-5.6 Sol: 22.4%；脚注[1]：标准误 ±3.5–4.5 pts/模型；公开榜（3 trials/task，Claude Code harness）印 Opus 5 30.0% / Fable 5 21.4%，Anthropic setup 复现 29.0% / 24.7%（within noise） |
| Agentic coding — Terminal-Bench 4.0 | 55.8%（Mythos 5.1: 60.9%） | Fable 5: 42.0% · Opus 5: 52.3% · GPT-5.6 Sol: 37.3%；同格印双值：55.8%（Fable 5.1）+ 60.9% (Mythos 5.1)；TB4.0 Accuracy-vs-Cost 图脚注：两模型同一底层模型，分差来自旧版 cyber 护栏干预的任务，护栏改进后预计差距显著缩小 |
| Knowledge work — GDPval-AA v2 | 1853 | Elo 制（实体口径，页面未印单位）；Fable 5: 1723 · Opus 5: 1824 · GPT-5.6 Sol: 1711；注意：Fable 5 在其 2026-06-09 发布页记 GDPval-AA 1932（非 v2 快照），跨页不可直接比较 |
| Computer use — OSWorld 2.0 [2]（partial） | 77.9% | Fable 5: 72.9% · Opus 5: 75.4% · GPT-5.6 Sol: —（未报告）；脚注[2]：基于基准作者 2026-08 任务版，Fable 5 / Opus 5 由 Anthropic 同条件重跑；任务文件与旧版不同，与已发表 OSWorld 2.0 数值不可直接比较（GPT 列空缺原因）；生产护栏干预任务上 Fable 5.1 与 Fable 5 均记 0 分，本值含该惩罚 |
| Computer use — OSWorld 2.0（strict） | 41.7% | Fable 5: 36.1% · Opus 5: 39.6% · GPT-5.6 Sol: —；条件同上（partial / strict 为两种判分口径，页面分行印刷） |
| Multidisciplinary reasoning — Humanity's Last Exam（no tools） | 60.9% | Fable 5: 57.8% · Opus 5: 56.6% · GPT-5.6 Sol: —；页面另有 HLE Accuracy-vs-Cost SVG 图（no tools / with tools × effort low/max），逐点值未转录 |
| Multidisciplinary reasoning — Humanity's Last Exam（with tools） | 65.0% | Fable 5: 63.8% · Opus 5: 63.6% · GPT-5.6 Sol: —；表格续行（benchmark 名留空），具体工具集页面未列 |
| Business workflows — AutomationBench | 31.4% | Fable 5: 17.1% · Opus 5: 26.9% · GPT-5.6 Sol: 19.6%；生产护栏干预任务上仅 Fable 5 记 0 分（页面未披露 Fable 5.1 在本行有护栏干预） |
| Agentic coding — CursorBench 3.2.0 | 73.4% | Fable 5: 70.5% · Opus 5: 70.0% · GPT-5.6 Sol: 67.2%；另有 CursorBench Accuracy-vs-Cost SVG 图（effort low→max），逐点值未转录 |

### 评测条件总披露（表后原文转录）

- "Fable 5.1 was evaluated with its production safeguards enabled."（生产安全护栏开启下评测）
- 护栏干预任务上的零分条款：Fable 5.1 与 Fable 5 在 OSWorld 2.0 记 0；Fable 5 在 AutomationBench 记 0。其余护栏干预场景中，cyber 任务由 Claude Opus 4.8 代完成、生物任务由 Claude Opus 5 代完成。页面明示这"可能降低 Fable 5.1 与 Fable 5 在这些基准上的表现"。
- effort 默认档（正文）：Fable 5.1 在 Claude Code 默认 High，在 Claude Cowork 与 Claude.ai 默认 Medium；表格数值未明示所用 effort 档。
- 定价图（Indexed cost of Fable usage）口径：按 default effort、2026 年 8 月四周真实用量计测。

## 协议脚注（页面编号脚注全文转录）

- **[1] Terminal-Bench-Science 0.1**：The standard error is ±3.5–4.5 pts per model. The public leaderboard (3 trials/task, Claude Code harness) reports Claude Opus 5 at 30.0% and Claude Fable 5 at 21.4%; our setup reproduces them at 29.0% and 24.7%, respectively, both within noise.
- **[2] OSWorld 2.0**：Scores are on the benchmark authors' August 2026 task release; Fable 5 and Opus 5 were re-run under the same conditions. Because the task files differ from earlier releases, these numbers aren't directly comparable to previously published OSWorld 2.0 results, which is why no competitor score is shown.
- **[3]（蛋白设计，非基准）**：三个靶点为 EGFR、Nipah G、15-PGDH，来自 Adaptyv Bio 蛋白设计竞赛；Nipah G 对照为针对受体蛋白的 de novo 设计。
- **Terminal-Bench 4.0 图脚注**：Claude Fable 5.1 and Claude Mythos 5.1 are the same underlying model; the gap between them reflects the tasks on which our earlier, less precise cyber safeguards intervened. With the improvements we're making to these safeguards today, we expect the difference between the models to be much smaller.
- **HLE 图脚注**：Humanity's Last Exam scores by cost (log scale), at each effort level.
- **CursorBench 图脚注**：CursorBench 3.2.0 scores by cost (log scale), at each effort level.

## 非评测内容摘要（不转录为行）

- **定价**：$10 / 百万输入 tokens、$50 / 百万输出 tokens（与 Fable 5 持平）；缓存读 $0.25 / MTok（较此前降 75%），典型负载较 Fable 5 降约 25%，重代理负载最高约 45%。
- **双模型关系**：Claude Fable 5.1 与 Claude Mythos 5.1 是同一模型、不同安全档。Fable 5.1 全面可用（API ID `claude-fable-5-1`，AWS / Google Cloud / Azure 同步）；Mythos 5.1 仅经信任访问计划提供——Cyber Verification Program（CVP，网络防御）与 Life Sciences Verification Program（LSVP，生命科学，与美国政府合作已入组首批参与者），当前仅限美国机构。Claude Security 产品现已由 Mythos 5.1 驱动。
- **EFS（Enterprise Frontier Safeguards）**：数据存于客户自有云基础设施（非 Anthropic），人工审查默认由客户执行，等效零数据保留；今秋起分阶段上线，覆盖 Claude Code / Claude Enterprise / Claude Platform / Bedrock / Google / Microsoft Foundry 等。
- **EU AI Act 合规**：2026-08-02 后发布的模型输出带文本水印（对无检测 API 者不可见，不影响输出质量）；检测 API 私测中（监管、执法、媒体、事实核查、研究者等合格组织可申请）。
- **反蒸馏**：新 API 账户（自发布日起）不得在多轮对话中手动编辑 Claude 历史上下文同时保留其思考记录（封锁公开的蒸馏技术）；逐步铺开，存量账户暂不受影响。
- **护栏降噪**：网络安全护栏误报减少 60%（Claude Code 用户平均每 session 干预约降 60%）；允许 Fable 5.1 用于发现软件漏洞（不含开发利用）；生物护栏对基础生物/医疗良性请求的触发较 Fable 5 发布时降 85%；渗透测试、exploit 生成、二进制漏洞扫描等双用途任务仍转 Opus 模型。
- **科学研究案例**：蛋白质结合剂设计（12 靶点 hit rate 近 50%，三靶点亲和力为 Adaptyv 竞赛最佳设计的 10 倍）；金星全球高分辨率地形图（基于 Magellan 雷达数据，细节分辨率 2–3 km，高度精度提升至 25%，CC 许可发布）；为 7 个开源蛋白/基因组模型写自定义 GPU kernel，H100 上推理提速最高 2.5 倍（输出一致），预计可降 GPU 成本 30–60%。
- **合作方证言**：22 张引语轮播（Jane Street Capital、Cognition、Millennium 等），含 Millennium 内部系统罕见崩溃根因定位、Jane Street 交易直觉 SOTA 等定性陈述——未入账本。

## 图片清单（images/）

- og-card-1200x630.jpg — 1200x630 | og 分享卡 | 原 URL: https://cdn.sanity.io/images/4zrzovbb/website/932ca7d6f414ca22fd5a26dcc131410575b9b3e5-1200x630.jpg
- hero-2400x1260.jpg — 2400x1260 | 页头 hero 图（无 alt） | 原 URL: https://cdn.sanity.io/images/4zrzovbb/website/6d4a0d28992ade92d6fa63646fd9c9d318245c6c-2400x1260.jpg
- protein-binders-poster-1920x1080.jpg — 1920x1080 | 蛋白结合剂设计视频海报（12 靶点，ESMFold2 预测结构；对应视频 webm/mp4 未归档） | 原 URL: https://cdn.sanity.io/images/4zrzovbb/website/4b8acf7ac952566415849134b65025b89a197bf6-1920x1080.jpg
- venus-new-dem-300m-volcano-800x800.png — 800x800 | 金星新 DEM（300m，直径 15km 火山） | 原 URL: https://cdn.sanity.io/images/4zrzovbb/website/3dd626b47b88feb72082646cdea87944d49a3c7f-800x800.png
- venus-magellan-radar-cone-800x800.png — 800x800 | Magellan 雷达原图（明亮锥体、放射状熔岩流） | 原 URL: https://cdn.sanity.io/images/4zrzovbb/website/4d8f06a743ecfc6ec87ccde0b1964e48175a141e-800x800.png
- venus-altimetry-footprint-800x800.png — 800x800 | 旧测高数据（10–20km 足印） | 原 URL: https://cdn.sanity.io/images/4zrzovbb/website/e374c070fc1a84872dcb1343b5bb0ed540ca3770-800x800.png

**图表说明**：本页四张 Accuracy-vs-Cost 图（Terminal-Bench-Science 0.1 / Terminal-Bench 4.0 / Humanity's Last Exam / CursorBench 3.2.0）与 Inference speedup、Indexed cost of Fable usage 两张说明图为**页面内联 SVG（服务端渲染）**，无静态图片文件可存档；headline 数值以 DOM 表为准，曲线逐点值未转录（DOM 内仅轴刻度文本）。
