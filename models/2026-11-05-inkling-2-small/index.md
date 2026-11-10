---
vendor: thinking-machines
model: Inkling 2 Small
release: inkling-2-small
date: 2026-11-05
source: https://thinkingmachines.ai/news/inkling-2-small/
fetched_at: 2026-11-10
---

# Inkling 2 Small（Thinking Machines Lab 官方发布文证据归档）

发布日期证据链：发布文 `<meta itemprop="datePublished" content="2026-11-05T00:00:00+00:00">`（`dateModified` 同值）；官方模型卡 `https://thinkingmachines.ai/model-card/inkling-2-small/` 印「Date of release: Nov 5, 2026」。两源互证，`date_precision=day`。

- 发布文：https://thinkingmachines.ai/news/inkling-2-small/（`page.html`）
- 模型卡：https://thinkingmachines.ai/model-card/inkling-2-small/（`model-card.html`，内嵌同一评测总表，50 个重叠行与发布文逐格一致）
- 发现渠道：官方 news 索引 https://thinkingmachines.ai/news/ ；站点 sitemap.xml；官方 HF 组织 huggingface.co/thinkingmachines（截至 2026-11-10 尚无 Inkling 2 Small 权重仓）

## 官方定位（原文要点）

- Thinking Machines Lab 第二代模型；Mixture-of-Experts，594B 总参、17B 激活；支持图像输入与可变推理强度（variable effort）。
- 拟在完成外部安全测试与红队后，于下周以 Apache 2.0 开放完整权重；当前在 Tinker 平台提供推理与微调。
- 模型卡：48 层 decoder-only，每 token 路由 384 专家中的 8 个；上下文最长 1M tokens；输入文本 + 图像，输出文本；许可 Tinker Terms of Use。
- 局限（Limitations 节）：表达不够简练、技能多的代码库里工具选择不总是最优；不支持音频；聊天体验优化较少（排版、斜杠过多、对心理健康等安全话题反应过度）。

## 评测协议（Benchmarking 节原文）

- All evals run at effort 0.99 (xhigh) and temperature 1.0；1M-token maximum trajectory limit（Inkling Small 为 256K）。
- 外部报告值清单：Arena（CodeArena autoeval）；Artificial Analysis（AA-3D, AA-AnalystAgent, AA-Briefcase, AA-LCR, AA-Omniscience, AutomationBench-AA, CritPt v2, EnterpriseOps-Gym-AA, FrontierCode 2.0, GDP.pdf, GDPval-AA, HLE, HLE-Diamond, MMMU-Pro, SciCode, Terminal-Bench v2.1, Terminal-Bench v4.0, TerminalBench-Science, τ³-Banking）；Datacurve（DeepSWE v1.1）；DesignArena；Scale AI（MCP Atlas, SWE-Pro v2）；Surge（ComplexConstraints v1.1, EnterpriseBench, Handbook.md v1.1, sudo L7）；Mercor（APEX Accounting 1.1, APEX Agents 1.1）；Thoughtful（DiligenceBench, PostTrainBench v1.2）；Vals（BioMysteryBench, Code Migration v1.1, CyberBench, CyberOffense, Excel Modeling Benchmark v1.1, Finance Agent v2.1, HLAB-Vals-1.1, Legal Research Bench, SAGE, SRE Bench, SWE-bench Multimodal, Tax Agent Bench, Terminal-Bench 4.0, Vibe Code Bench v1.1）。
- PMPP-Hard：外部 GPU kernel 优化基准经改编统一跑分；各模型取最大可用 reasoning、PI harness + 共享 compaction 策略；每个提交解经两次独立 LLM 审计、分歧由第三次复核；曲线为四次独立尝试均值；AUC 为 0–10 小时平均曲线下面积（满分 690 task-hours）。

## 评测数值转录（全部为页面 DOM 表格，逐格机读；`–` 未报告格不转录）

### Benchmarking Inkling 2 Small — Evaluation snapshot 总表

| 评测 | 分数（Inkling 2 Small） | 备注（同表其他列） |
|---|---|---|
| **Model Info** | | |
| Params (B) activated / total | 17/594 | 规格，非评测；GLM-5.3-Flash 18/320 / MiMo V2.6 Flash 15/309 / MiniMax-M3.1-Flash 23/428 / DeepSeek-V4.1-Flash-1017 16/552 / Muse Spark Open 42/816 / GLM 5.3 40/753 / MiMo V2.6 Pro 42/1020 / Mistral Large 4 49/1050 / Kimi K3 104/2800 |
| **Third Party Index** | | |
| AA Index (v5.0) | 30.6 | GLM-5.3-Flash 27.8 / MiMo V2.6 Flash 26.7 / MiniMax-M3.1-Flash 29.1 / DeepSeek-V4.1-Flash-1017 32.6 / Muse Spark Open 24.9 / GLM 5.3 31.7 / MiMo V2.6 Pro 29.9 / Mistral Large 4 26.1 / GPT-6 Luna 27.9 / Gemini 3.8 Flash 30.8 / Claude Haiku 5.5 36.5 |
| Vals Index (v2.2) | 56.1% | GLM-5.3-Flash 50.9% / MiMo V2.6 Flash 54.8% / MiniMax-M3.1-Flash 53.8% / DeepSeek-V4.1-Flash-1017 61.3% / Muse Spark Open 48.6% / GLM 5.3 59.7% / MiMo V2.6 Pro 57.8% / Mistral Large 4 56.5% / Kimi K3 53.0% / GPT-6 Luna 52.3% / Gemini 3.8 Flash 56.0% / Claude Haiku 5.5 58.7% |
| **Coding** | | |
| FrontierCode v2.0 | 25.4% | GLM-5.3-Flash 14.2% / MiMo V2.6 Flash 21.6% / MiniMax-M3.1-Flash 20.8% / DeepSeek-V4.1-Flash-1017 28.5% / Muse Spark Open 7.6% / GLM 5.3 21.6% / MiMo V2.6 Pro 24.0% / Mistral Large 4 15.0% / Kimi K3 17.3% / GPT-6 Luna 25.2% / Gemini 3.8 Flash 18.7% / Claude Haiku 5.5 34.9% |
| DeepSWE v1.1 | 72.1% | GLM-5.3-Flash 63.4% / MiMo V2.6 Flash 67.9% / MiniMax-M3.1-Flash 73.7% / DeepSeek-V4.1-Flash-1017 77.0% / Muse Spark Open 60.0% / GLM 5.3 69.0% / MiMo V2.6 Pro 71.9% / Mistral Large 4 61.7% / Kimi K3 68.5% / GPT-6 Luna 66.6% / Gemini 3.8 Flash 73.8% / Claude Haiku 5.5 59.9% |
| Terminal Bench Science v0.1 | 5.7% | GLM-5.3-Flash 4.8% / MiMo V2.6 Flash 4.3% / MiniMax-M3.1-Flash 3.3% / DeepSeek-V4.1-Flash-1017 12.9% / Muse Spark Open 1.9% / GLM 5.3 9.5% / MiMo V2.6 Pro 5.7% / Mistral Large 4 4.3% / Kimi K3 8.1% / GPT-6 Luna 8.6% / Gemini 3.8 Flash 10.0% / Claude Haiku 5.5 20.0% |
| Vibe Code Bench v1.1 | 81.6% | GLM-5.3-Flash 30.8% / MiMo V2.6 Flash 79.0% / MiniMax-M3.1-Flash 73.9% / DeepSeek-V4.1-Flash-1017 87.7% / Muse Spark Open 76.2% / GLM 5.3 78.1% / MiMo V2.6 Pro 85.2% / Mistral Large 4 81.6% / Kimi K3 85.0% / GPT-6 Luna 81.7% / Gemini 3.8 Flash 78.7% / Claude Haiku 5.5 90.4% |
| SWEBench Pro v2 (Hard) | 86.3% | MiniMax-M3.1-Flash 84.3% / Muse Spark Open 82.4% / GLM 5.3 84.3% / Kimi K3 88.2% / Gemini 3.8 Flash 58.8% / Claude Haiku 5.5 52.9% |
| **Autoresearch** | | |
| PostTrainBench v1.2 | 31.9% | GLM-5.3-Flash 36.8% / DeepSeek-V4.1-Flash-1017 30.5% / GLM 5.3 34.5% / Kimi K3 31.5% |
| PMPP-Hard AUC (task-hours, 0–10h) | 494.27 | DeepSeek-V4.1-Flash-1017 497.36 / GLM 5.3 430.96 / Mistral Large 4 478.39 / Kimi K3 453.58 |
| BioMysteryBench | 70.0% | MiMo V2.6 Flash 69.3% / Kimi K3 72.6% / GPT-6 Luna 61.5% / Gemini 3.8 Flash 62.2% / Claude Haiku 5.5 70.4% |
| **Search and Tools** | | |
| MCP Atlas Full / Public | 85.4/85.0% | GLM-5.3-Flash –/82.0% / MiMo V2.6 Flash –/62.9% / MiniMax-M3.1-Flash –/80.4% / DeepSeek-V4.1-Flash-1017 –/83.2% / Muse Spark Open 89.2/87.5% / GLM 5.3 84.2/83.6% / MiMo V2.6 Pro –/84.4% / Mistral Large 4 –/84.5% / Kimi K3 82.3/84.2% / GPT-6 Luna –/77.8% / Gemini 3.8 Flash –/87.5% / Claude Haiku 5.5 –/81.0% |
| **Knowledge Work** | | |
| AA-Briefcase v1.1 | 1527 | GLM-5.3-Flash 1451 / MiMo V2.6 Flash 1487 / MiniMax-M3.1-Flash 1476 / DeepSeek-V4.1-Flash-1017 1570 / Muse Spark Open 1279 / GLM 5.3 1503 / MiMo V2.6 Pro 1512 / Mistral Large 4 1348 / Kimi K3 1497 / GPT-6 Luna 1337 / Gemini 3.8 Flash 1203 / Claude Haiku 5.5 1574 |
| GDPVal-AA v2.1 | 1630 | GLM-5.3-Flash 1649 / MiMo V2.6 Flash 1614 / MiniMax-M3.1-Flash 1465 / DeepSeek-V4.1-Flash-1017 1746 / Muse Spark Open 1401 / GLM 5.3 1657 / MiMo V2.6 Pro 1689 / Kimi K3 1543 / GPT-6 Luna 1444 / Gemini 3.8 Flash 1445 / Claude Haiku 5.5 1631 |
| JobBench | 70.5% | GLM-5.3-Flash 60.7% / MiMo V2.6 Flash 61.2% / MiniMax-M3.1-Flash 67.5% / Muse Spark Open 61.8% / GLM 5.3 61.4% / MiMo V2.6 Pro 62.0% / Mistral Large 4 55.2% / Kimi K3 54.3% / GPT-6 Luna 49.0% / Claude Haiku 5.5 39.2% |
| **Enterprise Operations** | | |
| EnterpriseOps-Gym | 46.8% | GLM-5.3-Flash 33.2% / GLM 5.3 36.4% / Kimi K3 45.3% |
| EnterpriseBench-CoreCraft | 71.8% | GLM-5.3-Flash 46.7% / GLM 5.3 51.8% / Kimi K3 43.1% / Gemini 3.8 Flash 58.5% |
| **Finance Work** | | |
| Tau 3 Banking v1.0.1 | 40.4% | GLM-5.3-Flash 47.2% / Kimi K3 33.4% |
| Finance Agent v2.1 | 67.5% | GLM-5.3-Flash 60.6% / MiMo V2.6 Flash 63.3% / MiniMax-M3.1-Flash 58.8% / DeepSeek-V4.1-Flash-1017 62.9% / Muse Spark Open 60.7% / GLM 5.3 65.0% / MiMo V2.6 Pro 64.3% / Mistral Large 4 61.7% / Kimi K3 60.0% / GPT-6 Luna 56.8% / Gemini 3.8 Flash 65.8% / Claude Haiku 5.5 65.4% |
| Excel Modeling Benchmark v1.1 | 69.5% | GLM-5.3-Flash 66.3% / MiMo V2.6 Flash 68.9% / MiniMax-M3.1-Flash 67.8% / DeepSeek-V4.1-Flash-1017 69.2% / Muse Spark Open 62.0% / GLM 5.3 69.1% / MiMo V2.6 Pro 67.4% / Mistral Large 4 68.7% / Kimi K3 71.3% / GPT-6 Luna 70.0% / Gemini 3.8 Flash 72.9% / Claude Haiku 5.5 65.5% |
| Tax Agent Bench | 65.8% | GLM-5.3-Flash 62.0% / MiMo V2.6 Flash 59.9% / MiniMax-M3.1-Flash 62.7% / DeepSeek-V4.1-Flash-1017 74.9% / Muse Spark Open 52.1% / GLM 5.3 73.1% / MiMo V2.6 Pro 64.9% / Mistral Large 4 67.5% / Kimi K3 68.7% / GPT-6 Luna 58.9% / Gemini 3.8 Flash 66.8% / Claude Haiku 5.5 62.2% |
| DAYJOB (Finance) | 14.3% | GLM-5.3-Flash 7.3% / DeepSeek-V4.1-Flash-1017 12.5% / GLM 5.3 11.0% / Mistral Large 4 4.8% / Kimi K3 5.5% / GPT-6 Luna 6.8% / Gemini 3.8 Flash 4.5% |
| Apex-Accounting v1.1 pass@1 | 14.5% | GLM-5.3-Flash 12.3% / MiniMax-M3.1-Flash 13.5% / DeepSeek-V4.1-Flash-1017 12.5% / Muse Spark Open 13.8% / GLM 5.3 13.9% / Mistral Large 4 12.0% / Kimi K3 9.5% / GPT-6 Luna 10.8% / Gemini 3.8 Flash 15.5% / Claude Haiku 5.5 15.3% |
| Apex-Accounting v1.1 mean score | 62.0% | GLM-5.3-Flash 53.7% / MiniMax-M3.1-Flash 60.0% / DeepSeek-V4.1-Flash-1017 59.3% / Muse Spark Open 58.0% / GLM 5.3 59.5% / Mistral Large 4 56.5% / Kimi K3 56.7% / GPT-6 Luna 53.9% / Gemini 3.8 Flash 58.8% / Claude Haiku 5.5 62.2% |
| **Legal Work** | | |
| Harvey LAB v1.1 | 21.7% | GLM-5.3-Flash 10.4% / MiMo V2.6 Flash 13.3% / MiniMax-M3.1-Flash 7.5% / DeepSeek-V4.1-Flash-1017 14.2% / Muse Spark Open 25.0% / GLM 5.3 14.6% / MiMo V2.6 Pro 13.8% / Mistral Large 4 15.8% / Kimi K3 12.9% / GPT-6 Luna 4.2% / Gemini 3.8 Flash 12.1% / Claude Haiku 5.5 4.2% |
| Legal Research Bench | 46.6% | GLM-5.3-Flash 45.2% / MiMo V2.6 Flash 38.0% / MiniMax-M3.1-Flash 34.1% / DeepSeek-V4.1-Flash-1017 45.2% / Muse Spark Open 38.5% / GLM 5.3 49.0% / MiMo V2.6 Pro 47.1% / Mistral Large 4 35.6% / Kimi K3 46.2% / GPT-6 Luna 30.3% / Gemini 3.8 Flash 38.9% / Claude Haiku 5.5 43.8% |
| **Visual Creation** | | |
| DesignArena Web Apps | 1296 | MiMo V2.6 Pro 1275 / Kimi K3 1283 / GPT-6 Luna 1161 / Gemini 3.8 Flash 1221 |
| DesignArena Website | 1340 | GLM-5.3-Flash 1270 / MiniMax-M3.1-Flash 1280 / DeepSeek-V4.1-Flash-1017 1297 / Muse Spark Open 1303 / GLM 5.3 1290 / MiMo V2.6 Pro 1307 / Mistral Large 4 1256 / Kimi K3 1334 / GPT-6 Luna 1268 / Gemini 3.8 Flash 1299 / Claude Haiku 5.5 1261 |
| DesignArena Game Dev | 1428 | GLM-5.3-Flash 1276 / MiniMax-M3.1-Flash 1312 / DeepSeek-V4.1-Flash-1017 1261 / Muse Spark Open 1270 / GLM 5.3 1303 / MiMo V2.6 Pro 1315 / Mistral Large 4 1225 / Kimi K3 1351 / GPT-6 Luna 1261 / Gemini 3.8 Flash 1305 / Claude Haiku 5.5 1319 |
| DesignArena 3D Design | 1401 | GLM-5.3-Flash 1314 / MiniMax-M3.1-Flash 1332 / DeepSeek-V4.1-Flash-1017 1361 / Muse Spark Open 1261 / GLM 5.3 1324 / MiMo V2.6 Pro 1333 / Mistral Large 4 1249 / Kimi K3 1381 / GPT-6 Luna 1213 / Gemini 3.8 Flash 1291 / Claude Haiku 5.5 1334 |
| Code2Video-AA | 1020 | GLM-5.3-Flash 975 / MiMo V2.6 Flash 1052 / GLM 5.3 1034 / MiMo V2.6 Pro 1052 / Kimi K3 1041 / GPT-6 Luna 1030 / Gemini 3.8 Flash 899 / Claude Haiku 5.5 1192 |
| **Visual Perception** | | |
| PerceptionBench | 64.7% | DeepSeek-V4.1-Flash-1017 47.7% / Kimi K3 58.5% / GPT-6 Luna 56.2% |
| ScreenSpot Pro original / with Python | 83.8/91.5% | MiMo V2.6 Pro 56.6%/– / Mistral Large 4 42.3%/– / Kimi K3 73.8/83.2% / GPT-6 Luna 81.1/87.6% |
| Humanity’s Sixth Sense | 33.3% | GLM-5.3-Flash 26.8% / MiMo V2.6 Flash 25.4% / DeepSeek-V4.1-Flash-1017 30.1% / Muse Spark Open 29.6% / MiMo V2.6 Pro 25.2% / Kimi K3 25.5% / GPT-6 Luna 21.0% / Gemini 3.8 Flash 41.6% |
| BabyVision original / with Python | 68.6/93.7% | GLM-5.3-Flash 53.4/82.6% / MiniMax-M3.1-Flash –/91.0% / DeepSeek-V4.1-Flash-1017 –/92.5% / Muse Spark Open 44.3/80.2% / Mistral Large 4 42.3/71.5% / Kimi K3 53.4/85.7% |
| **Visual Reasoning** | | |
| GDP.pdf | 25.2% | GLM-5.3-Flash 15.4% / MiMo V2.6 Flash 9.0% / MiniMax-M3.1-Flash 20.8% / DeepSeek-V4.1-Flash-1017 17.2% / Muse Spark Open 18.6% / GLM 5.3 11.2% / MiMo V2.6 Pro 19.2% / Mistral Large 4 17.6% / Kimi K3 22.0% / GPT-6 Luna 22.8% / Gemini 3.8 Flash 21.0% / Claude Haiku 5.5 20.8% |
| MMMU Pro (Standard 10) | 81.6% | GLM-5.3-Flash 79.0% / MiniMax-M3.1-Flash 79.1% / DeepSeek-V4.1-Flash-1017 80.6% / Muse Spark Open 80.9% / MiMo V2.6 Pro 74.1% / Mistral Large 4 78.0% / Kimi K3 80.5% / GPT-6 Luna 79.7% / Gemini 3.8 Flash 85.6% / Claude Haiku 5.5 79.1% |
| Charxiv RQ original / with Python | 85.6/87.7% | GLM-5.3-Flash 80.2/89.4% / MiMo V2.6 Flash 66.2%/– / MiniMax-M3.1-Flash 82.5%/– / DeepSeek-V4.1-Flash-1017 77.0/85.6% / Muse Spark Open 85.4/88.7% / MiMo V2.6 Pro 74.2%/– / Mistral Large 4 83.2/87.9% / Kimi K3 84.8/91.3% / GPT-6 Luna 81.8/85.3% / Gemini 3.8 Flash 86.2/92.1% / Claude Haiku 5.5 84.4%/– |
| Chartography original / with Python | 36.7/80.4% | GLM-5.3-Flash 16.3/78.0% / MiMo V2.6 Flash 7.5%/– / MiniMax-M3.1-Flash 12.6%/– / DeepSeek-V4.1-Flash-1017 17.9/83.0% / Muse Spark Open 35.7/63.2% / MiMo V2.6 Pro 10.8%/– / Mistral Large 4 21.2/56.6% / Kimi K3 26.6/68.1% / GPT-6 Luna 32.0%/– / Gemini 3.8 Flash 40.9/82.0% / Claude Haiku 5.5 46.4%/– |
| **STEM Reasoning** | | |
| CritPt v2 Full / Hard | 55.7/35.0% | GLM-5.3-Flash –/24.5% / MiMo V2.6 Flash –/29.5% / MiniMax-M3.1-Flash 51.4/32.5% / DeepSeek-V4.1-Flash-1017 50.6/25.0% / Muse Spark Open 52.6/29.5% / GLM 5.3 57.4/33.5% / MiMo V2.6 Pro 56.9/34.0% / Mistral Large 4 50.3/27.0% / Kimi K3 –/40.5% / GPT-6 Luna 65.1/42.5% / Gemini 3.8 Flash 65.1/46.5% / Claude Haiku 5.5 64.0/43.5% |
| HLE-Diamond | 28.7% | GLM-5.3-Flash 18.2% / MiMo V2.6 Flash 13.7% / MiniMax-M3.1-Flash 28.1% / DeepSeek-V4.1-Flash-1017 25.3% / Muse Spark Open 26.3% / GLM 5.3 17.9% / MiMo V2.6 Pro 15.2% / Mistral Large 4 17.3% / Kimi K3 26.9% / GPT-6 Luna 22.2% / Gemini 3.8 Flash 33.1% / Claude Haiku 5.5 29.6% |
| Apex 2025 | 63.5% | Muse Spark Open 32.3% / Kimi K3 65.6% |
| **Long Context** | | |
| AA-LCR v1.1 | 83.3% | GLM-5.3-Flash 80.0% / Muse Spark Open 78.3% / GLM 5.3 79.7% / MiMo V2.6 Pro 86.3% / Kimi K3 88.7% / Gemini 3.8 Flash 81.3% / Claude Haiku 5.5 82.7% |
| LongBench v2 | 70.6% | GLM-5.3-Flash 68.2% / MiMo V2.6 Flash 60.7% / MiniMax-M3.1-Flash 60.9% / DeepSeek-V4.1-Flash-1017 69.0% / Muse Spark Open 68.7% / GLM 5.3 68.4% / MiMo V2.6 Pro 68.0% / Mistral Large 4 65.7% / Kimi K3 69.0% / GPT-6 Luna 65.0% / Gemini 3.8 Flash 73.7% / Claude Haiku 5.5 65.3% |
| **Factuality** | | |
| AA-Omniscience v1.1 score | 16.1 | GLM-5.3-Flash 0.7 / MiMo V2.6 Flash -10.8 / MiniMax-M3.1-Flash -6.4 / DeepSeek-V4.1-Flash-1017 0.9 / Muse Spark Open 25.8 / GLM 5.3 6.0 / MiMo V2.6 Pro -4.5 / Mistral Large 4 5.1 / GPT-6 Luna -8.3 / Gemini 3.8 Flash 23.3 / Claude Haiku 5.5 12.3 |
| AA-Omniscience v1.1 non-hallucination rate | 73.3% | MiniMax-M3.1-Flash 6.3% / DeepSeek-V4.1-Flash-1017 35.9% / Muse Spark Open 72.0% / GLM 5.3 61.1% / MiMo V2.6 Pro 39.8% / Mistral Large 4 71.8% / GPT-6 Luna 20.7% / Gemini 3.8 Flash 44.9% / Claude Haiku 5.5 65.8% |
| **Instruction Following** | | |
| ComplexConstraints v1.0 | 44.5% | GLM-5.3-Flash 27.6% / MiMo V2.6 Flash 22.1% / MiniMax-M3.1-Flash 23.2% / DeepSeek-V4.1-Flash-1017 50.4% / Muse Spark Open 41.3% / GLM 5.3 30.5% / MiMo V2.6 Pro 32.3% / Mistral Large 4 36.5% / Kimi K3 37.9% / GPT-6 Luna 27.3% / Gemini 3.8 Flash 48.4% / Claude Haiku 5.5 36.8% |
| **Safety** | | |
| DistressBench | 82.0% | GLM-5.3-Flash 72.7% / Muse Spark Open 87.7% / GLM 5.3 72.5% / Mistral Large 4 77.0% / Kimi K3 73.5% / GPT-6 Luna 66.7% / Gemini 3.8 Flash 70.7% / Claude Haiku 5.5 71.7% |
| FORTRESS (adversarial) | 83.8% | GLM-5.3-Flash 73.3% / DeepSeek-V4.1-Flash-1017 72.8% / Muse Spark Open 92.4% / GLM 5.3 71.8% / Mistral Large 4 76.0% / Kimi K3 72.8% |
| FORTRESS (benign) | 79.7% | GLM-5.3-Flash 96.4% / DeepSeek-V4.1-Flash-1017 93.1% / Muse Spark Open 84.0% / GLM 5.3 96.8% / Mistral Large 4 91.8% / Kimi K3 96.0% |
| StrongREJECT (none) | 97.1% | GLM-5.3-Flash 97.8% / MiMo V2.6 Flash 97.8% / DeepSeek-V4.1-Flash-1017 99.4% / Muse Spark Open 97.1% / GLM 5.3 97.5% / Mistral Large 4 99.0% / Kimi K3 99.0% |
| **Cybersecurity** | | |
| CyberBench v1.1 | 72.7% | GLM-5.3-Flash 67.9% / MiMo V2.6 Flash 75.4% / GLM 5.3 72.1% / MiMo V2.6 Pro 72.9% / Kimi K3 75.2% / GPT-6 Luna 76.3% / Gemini 3.8 Flash 43.8% / Claude Haiku 5.5 75.5% |
| PatchEval | 79.6% | GLM-5.3-Flash 74.8% / DeepSeek-V4.1-Flash-1017 80.4% / Muse Spark Open 77.8% / GLM 5.3 69.6% / Mistral Large 4 76.1% |

### Agentic coding and autoresearch — Coding and Autoresearch

| 评测 | 分数（Inkling 2 Small） | 备注（同表其他列） |
|---|---|---|
| FrontierCode v2.0 | 25.4% | GLM-5.3-Flash 14.2% / DeepSeek-V4.1-Flash-1017 28.5% / Muse Spark Open 7.6% / Kimi K3 17.3% |
| DeepSWE v1.1 | 72.1% | GLM-5.3-Flash 63.4% / DeepSeek-V4.1-Flash-1017 77.0% / Muse Spark Open 60.0% / Kimi K3 68.5% |
| SWEBench Pro v2 (Hard) | 86.3% | Muse Spark Open 82.4% / Kimi K3 88.2% |
| Vibe Code Bench v1.1 | 81.6% | GLM-5.3-Flash 30.8% / DeepSeek-V4.1-Flash-1017 87.7% / Muse Spark Open 76.2% / Kimi K3 85.0% |
| PostTrainBench v1.2 | 31.9% | GLM-5.3-Flash 36.8% / DeepSeek-V4.1-Flash-1017 30.5% / Kimi K3 31.5% |
| Terminal Bench Science v0.1 | 5.7% | GLM-5.3-Flash 4.8% / DeepSeek-V4.1-Flash-1017 12.9% / Muse Spark Open 1.9% / Kimi K3 8.1% |

### Agentic coding and autoresearch — PMPP-Hard results

| 模型 | AUC (task-hours) | Mean solved / 69 | Pass@4 / 69 |
|---|---|---|---|
| GPT-6 Astra | 616.39 | 63 | 63 |
| Kimi K3.1 Pro | 583.86 | 60.5 | 63 |
| Claude Opus 5.5 | 499.65 | 60 | 64 |
| DeepSeek V4.1 Flash | 497.36 | 55.25 | 62 |
| **Inkling 2 Small** | **494.27** | **54.25** | **64** |
| Mistral Large 4 | 478.39 | 50.25 | 61 |
| Kimi K3 | 453.58 | 55.75 | 66 |
| GLM 5.3 | 430.96 | 52.5 | 61 |
| GLM 5.2 | 389.12 | 42 | 61 |

### Vision interpretation and creation — Visual reasoning and creation

| 评测 | 分数（Inkling 2 Small） | 备注（同表其他列） |
|---|---|---|
| GDP.pdf | 25.2% | GLM-5.3-Flash 15.4% / DeepSeek-V4.1-Flash-1017 17.2% / Muse Spark Open 18.6% / Kimi K3 22.0% |
| MMMU Pro (Standard 10) | 81.6% | GLM-5.3-Flash 79.0% / DeepSeek-V4.1-Flash-1017 80.6% / Muse Spark Open 80.9% / Kimi K3 80.5% |
| PerceptionBench | 64.7% | DeepSeek-V4.1-Flash-1017 47.7% / Kimi K3 58.5% |
| Humanity’s Sixth Sense | 33.3% | GLM-5.3-Flash 26.8% / DeepSeek-V4.1-Flash-1017 30.1% / Muse Spark Open 29.6% / Kimi K3 25.5% |
| ScreenSpot Pro original / with Python | 83.8/91.5% | Kimi K3 73.8/83.2% |
| BabyVision original / with Python | 68.6/93.7% | GLM-5.3-Flash 53.4/82.6% / DeepSeek-V4.1-Flash-1017 –/92.5% / Muse Spark Open 44.3/80.2% / Kimi K3 53.4/85.7% |
| Charxiv RQ original / with Python | 85.6/87.7% | GLM-5.3-Flash 80.2/89.4% / DeepSeek-V4.1-Flash-1017 77.0/85.6% / Muse Spark Open 85.4/88.7% / Kimi K3 84.8/91.3% |
| Chartography original / with Python | 36.7/80.4% | GLM-5.3-Flash 16.3/78.0% / DeepSeek-V4.1-Flash-1017 17.9/83.0% / Muse Spark Open 35.7/63.2% / Kimi K3 26.6/68.1% |
| Code Arena (WebDev) | 1653 | GLM-5.3-Flash 1607 / DeepSeek-V4.1-Flash-1017 1665 / Kimi K3 1656 |
| AA-3D | 1021 | GLM-5.3-Flash 937 / Kimi K3 982 |
| Code2Video-AA | 1020 | GLM-5.3-Flash 975 / Kimi K3 1041 |

### Agentic knowledge work — Knowledge Work and Enterprise Ops

| 评测 | 分数（Inkling 2 Small） | 备注（同表其他列） |
|---|---|---|
| AA-Briefcase v1.1 | 1527 | GLM-5.3-Flash 1451 / Muse Spark Open 1279 / DeepSeek-V4.1-Flash-1017 1570 / Kimi K3 1497 |
| GDPVal-AA v2.1 | 1630 | GLM-5.3-Flash 1649 / Muse Spark Open 1401 / DeepSeek-V4.1-Flash-1017 1746 / Kimi K3 1543 |
| JobBench | 70.5% | GLM-5.3-Flash 60.7% / Muse Spark Open 61.8% / Kimi K3 54.3% |
| Vals Legal Index | 73.9% | GLM-5.3-Flash 71.1% / Muse Spark Open 68.5% / DeepSeek-V4.1-Flash-1017 71.9% / Kimi K3 71.7% |
| EnterpriseBench-CoreCraft | 71.8% | GLM-5.3-Flash 46.7% / Kimi K3 43.1% |

### Agentic knowledge work — Finance Work

| 评测 | 分数（Inkling 2 Small） | 备注（同表其他列） |
|---|---|---|
| Vals Finance Index | 61.5% | GLM-5.3-Flash 55.8% / Muse Spark Open 53.0% / DeepSeek-V4.1-Flash-1017 60.9% / Kimi K3 58.0% |
| Diligence Bench Best harness | 58.1% | Muse Spark Open 59.0% / DeepSeek-V4.1-Flash-1017 50.4% |
| DAYJOB (Finance) | 14.3% | GLM-5.3-Flash 7.3% / DeepSeek-V4.1-Flash-1017 12.5% / Kimi K3 5.5% |
| Apex-Accounting v1.1 pass@1 | 14.5% | GLM-5.3-Flash 12.3% / Muse Spark Open 13.8% / DeepSeek-V4.1-Flash-1017 12.5% / Kimi K3 9.5% |

### Reasoning, knowledge, and epistemics — Long Context Reasoning and Factuality

| 评测 | 分数（Inkling 2 Small） | 备注（同表其他列） |
|---|---|---|
| HLE-Diamond | 28.7% | GLM-5.3-Flash 18.2% / Muse Spark Open 26.3% / Mistral Large 4 17.3% / Kimi K3 26.9% |
| CritPt v2 Full / Hard | 55.7/35.0% | GLM-5.3-Flash –/24.5% / Muse Spark Open 52.6/29.5% / Mistral Large 4 50.3/27.0% / Kimi K3 –/40.5% |
| AA-LCR v1.1 | 83.3% | GLM-5.3-Flash 80.0% / Muse Spark Open 78.3% / Kimi K3 88.7% |
| LongBench v2 | 70.6% | GLM-5.3-Flash 68.2% / Muse Spark Open 68.7% / Mistral Large 4 65.7% / Kimi K3 69.0% |
| AA-Omniscience v1.1 score / non-hallucination rate | 16.1/73.3 | GLM-5.3-Flash 0.7/– / Muse Spark Open 25.8/72.0 / Mistral Large 4 5.1/71.8 |

### Safety and alignment — Safety

| 评测 | 分数（Inkling 2 Small） | 备注（同表其他列） |
|---|---|---|
| FORTRESS (ARS) ↓ | 16.2 | GLM-5.3-Flash 26.7 / DeepSeek V4.1 Flash 1017 27.2 / Muse Spark Open 7.6 / GLM 5.3 28.2 |
| FORTRESS (ORS) ↓ | 20.4 | GLM-5.3-Flash 3.6 / DeepSeek V4.1 Flash 1017 6.9 / Muse Spark Open 16.0 / GLM 5.3 3.2 |
| DistressBench ↑ | 82.0* | GLM-5.3-Flash 72.7 / Muse Spark Open 87.7 / GLM 5.3 72.5 |
| StrongREJECT ↑ | 97.1 | GLM-5.3-Flash 97.8 / DeepSeek V4.1 Flash 1017 99.4 / Muse Spark Open 97.1 / GLM 5.3 97.5 |
| PatchEval ↑ | 79.6 | GLM-5.3-Flash 74.8 / DeepSeek V4.1 Flash 1017 80.4 / Muse Spark Open 77.8 / GLM 5.3 69.6 |
| Vals CyberBench ↑ | 72.7 | GLM-5.3-Flash 67.9 / GLM 5.3 72.1 |

`*` 脚注原文：While we handle mental distress situations well, our model sometimes overreacts with disclaimers in normal emotional support queries as mentioned in the Limitations section.

### Safety and alignment — Alignment

| 评测 | 分数（Inkling 2 Small） | 备注（同表其他列） |
|---|---|---|
| Misbehavior (Internal) ↓ | 14.9 | Inkling 66.8 / Inkling Small 75.2 / Muse Spark Open 82.4 / GLM-5.3-Flash 57.1 / DeepSeek V4.1 Flash 68.0 / GPT-6.1 Sol 0.8 |
| Covert misbehavior (Internal) ↓ | 11.8 | Inkling 59.4 / Inkling Small 59.1 / Muse Spark Open 60.8 / GLM-5.3-Flash 29.2 / DeepSeek V4.1 Flash 37.6 / GPT-6.1 Sol 0.8 |
| Destructive actions (Internal) ↓ | 4.7 | Inkling 71.9 / Inkling Small 67.2 / Muse Spark Open 7.8 / GLM-5.3-Flash 25.8 / DeepSeek V4.1 Flash 10.9 / GPT-6.1 Sol 7.0 |
| HoneyBench v0.2-alpha: Reward Hacking (Goodhart Labs) ↓ | 44 | Inkling 70 / Inkling Small 69 / GPT-6.1 Sol 59 |
| Covert Action with No Goal (Apollo Research) ↓ | 8 | Inkling 37 / Inkling Small 36 |
| Covert Action with Goal (Apollo Research) ↓ | 0 | Inkling 7 / Inkling Small 4 |

## 训练披露（非评测，仅归档）

| 项 | 值 |
|---|---|
| Compute | Over 4 × 10²³ FLOPs |
| GPUs | 2,048 |
| Duration | 9 days |
| Rollouts | 17M+ |
| Tokens | 3T+ |
| Median policy staleness | 17 updates |
| Rollout batch size | 16K |
| Total tokens per rollout | Median 43K · p99 1.5M |
| Rollout duration | Median 8 minutes · p99 4 hours |
| Context window（RL 训练） | 256K tokens, with compaction for longer trajectories |

RL 任务配比（Rollouts / Tokens）：Coding 38.5% / 65.0%；Office and knowledge work 9.1% / 13.3%；STEM and reasoning 7.0% / 7.6%；Web and app building 4.7% / 7.2%；Vision 13.9% / 3.0%；Tool use and general agents 17.1% / 2.3%；Search 2.0% / 1.4%；Chat, safety and epistemics 7.8% / 0.2%。

## 未转录内容

- 正文 SVG 曲线（STEM / Vision 评测随 FLOPs 曲线、可微调性曲线、预训练 held-out log loss、kernel autoresearch 初步结果）：图表、多为相对趋势，不转录数值。
- Tinker 时间序列预测 autoresearch 演示（4 h 17 min、$426/$500 预算、最终比基座少约 15% 误差）：单任务演示，不构成基准级证据。
- 页面位图（tinkerbench-replay-poster.png、wine-tasting-three-glasses.webp、cover-social.png）均为插图、不含评测数值，本批未入库归档（原址：thinkingmachines.ai/_astro/ 与 /news/inkling-2-small/images/）。
