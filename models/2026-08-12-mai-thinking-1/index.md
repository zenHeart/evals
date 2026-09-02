---
vendor: microsoft
model: MAI-Thinking-1
release: mai-thinking-1
date: 2026-08-12
source: https://microsoft.ai/news/introducing-mai-thinking-1
fetched_at: 2026-09-02
---

# Introducing MAI-Thinking-1（归档转录）

Microsoft AI 推理模型发布文。页面无 DOM 表格，全部评测数值位于两张图（Table 1 / Table 2）；
散文明文分数仅 2 个（AIME 2025 / AIME 2026）+ 1 条无数字定位论断（SWE-Bench Pro）。

## 日期证据

- 页面元数据 `publishedTime: 2026-08-12T16:00:00Z`；页头印刷 "Updated as of August 12, 2026"（出现 2 处）→ 发布日 2026-08-12，day 精度。

## 评测数据转录

散文明文行（机器可读，`vendor_reported`，账本 verified）：

| 评测 | 分数 | 备注 |
|---|---|---|
| AIME 2025 | 97.0% | 散文原句 "MAI-Thinking-1 reaches 97.0% on AIME 2025"；Table 1 同名行视觉读数一致 |
| AIME 2026 | 94.5% | 散文原句 "and 94.5% on AIME 2026"；Table 1 同名行视觉读数一致 |
| SWE-Bench Pro | （无数值） | 散文定位论断 "our model is toe-to-toe with Claude Opus 4.6 on SWE-Bench Pro"，未印自家分数；Table 1 同名行（图）待人工读图 |

Table 1「MAI-Thinking-1 metrics」（图片 `images/MAI-Thinking-1-metrics.png`，无 DOM 表，**全行 (视觉转写)**，
账本行均 pending + not_extracted，转写值仅供人工复核比对）：

列：MAI-Thinking-1 / Sonnet 4.6 / Opus 4.6 / GPT 5.4 / Kimi K2.6 / DeepSeek V3.2 / DeepSeek V4 / GLM-5.1。
表注（视觉转写）："Post-trained model evaluation results on public STEM and agentic coding benchmarks. Other model numbers are taken from respective official model cards. Scores are percentages unless otherwise noted; dashes indicate unavailable model values." 协议脚注（视觉转写）："For agentic coding evaluations, we use a total context length of 256k. For all other evaluations above we use maximum output tokens of 256k."

| 评测 | 分数 | 备注 |
|---|---|---|
| AIME 2025 (STEM) | 97.0 (视觉转写) | Sonnet 4.6 95.6 / Opus 4.6 99.8 / GPT 5.4 - / Kimi K2.6 - / DeepSeek V3.2 93.1 / DeepSeek V4 - / GLM-5.1 - |
| AIME 2026 (STEM) | 94.5 (视觉转写) | Sonnet 4.6 - / Opus 4.6 - / GPT 5.4 - / Kimi K2.6 96.4 / DeepSeek V3.2 - / DeepSeek V4 - / GLM-5.1 95.3 |
| HMMT Feb 2026 (STEM) | 84.9 (视觉转写) | Kimi K2.6 92.7 / DeepSeek V4 95.2 / GLM-5.1 82.6；Sonnet 4.6 / Opus 4.6 / GPT 5.4 / DeepSeek V3.2 均 - |
| GPQA Diamond (STEM) | 84.2 (视觉转写) | Sonnet 4.6 89.9 / Opus 4.6 91.3 / GPT 5.4 92.8 / Kimi K2.6 90.5 / DeepSeek V3.2 82.4 / DeepSeek V4 90.1 / GLM-5.1 86.2 |
| LCB v6 (STEM) | 87.7 (视觉转写) | Kimi K2.6 89.6 / DeepSeek V3.2 83.3 / DeepSeek V4 93.5；Sonnet 4.6 / Opus 4.6 / GPT 5.4 / GLM-5.1 均 - |
| Terminal Bench 2.0 (Agentic Coding) | 46.0 (视觉转写) | Sonnet 4.6 59.1 / Opus 4.6 65.4 / GPT 5.4 75.1 / Kimi K2.6 66.7 / DeepSeek V3.2 46.4 / DeepSeek V4 67.9 / GLM-5.1 69.0；跨厂锚点：GPT 5.4 75.1 与 OpenAI GPT-5.5 页 Terminal-Bench 列读数一致（彼处口径为 2.1，本表自述竞品数取自各家 model card，版本口径可能不齐） |
| SWE-Bench Verified (Agentic Coding) | 73.5 (视觉转写) | Sonnet 4.6 79.6 / Opus 4.6 80.8 / Kimi K2.6 80.2 / DeepSeek V3.2 73.1 / DeepSeek V4 80.6；GPT 5.4 / GLM-5.1 均 - |
| SWE-Bench Pro (Agentic Coding) | 52.8 (视觉转写) | Opus 4.6 53.4 / GPT 5.4 57.7 / Kimi K2.6 58.6 / DeepSeek V4 55.4 / GLM-5.1 58.4；Sonnet 4.6 / DeepSeek V3.2 均 -；跨厂锚点：GPT 5.4 57.7 与 OpenAI 自报 SWE-Bench Pro 一致 |

Table 2「Pre-training metrics」（图片 `images/Thinking01.png`）——**基座模型 bits-per-byte 指标
（Held-Out Code / QA / STEM / Math 四面板，越低越好），不是发布模型（post-trained）成绩 → 不建账本行**。
视觉读数要点：MAI-Base-1 (35B/1T) Code 0.2441 / QA 0.4421 / STEM 0.3978 / Math 0.3844；
对比列 Gemma4 (31B)、DS-V3.2 (37B/685B)、MAI L66 (23B/612B)、Kimi-K2 (32B/1T)、DSv4-Pro (49B/1.6T)。
图注：23B 为同期同 30T tokens 的先前 run 对照点。

## 非评测内容转录（定性论断，不建行）

- 盲测人评：与 Surge 合作的 blind side-by-side 人类评估，专业评审池，**1,276 任务**，单轮 + 多轮，
  聚焦 helpfulness 与目标推进；结论 "users preferred MAI-Thinking-1 over Claude Sonnet 4.6"（无数值）。
- Safety：`images/Safety-vs-Helpfulness-by-Harm-Category.png` 散点图（MAI-Thinking-1 vs Sonnet 4.6 按 harm category），
  安全与有用平衡由与能力同一套 RL 奖励构造训练（unsafe compliance 与不必要拒绝按危害严重度聚合）。
- 定价：无价格数字；hero 副标题明文 "top SWE-Bench Pro results at a mid-weight price"（定性，public preview）。
- 可用性："MAI-Thinking-1 is available in public preview on Microsoft Foundry"；兼容 Chat Completions API；function calling。
- 规格：35B 激活 / ~1T 总参，稀疏 MoE；256K token 上下文窗口（"enough to fit a 600 page document"）。
- 训练理念：Hill-Climbing Machine（可爬升协同设计管线：数据 / 奖励 / 环境 / 算力持续吸收）；
  三支柱 = capabilities learned not inherited（**不经第三方模型蒸馏**）、clean data（干净可溯源企业级数据）、
  全栈自足（自研加速器协同设计 + 自有 RL 框架）。
- 愿景框架：Humanist Superintelligence（附录性表述）。
