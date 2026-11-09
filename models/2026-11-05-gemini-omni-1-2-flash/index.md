---
vendor: google
model: Gemini Omni 1.2 Flash
release: gemini-omni-1-2-flash
date: 2026-11-05
source: https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-omni-1-2-flash/
fetched_at: 2026-11-06
---

# Google《Gemini Omni 1.2 Flash: Fast and cost-effective with longer clips》——官方发布文转录

发布日期证据（四源一致）：官方博客页内 JSON-LD `datePublished` = `2026-11-05T17:00:00+00:00`；页面 meta `article:published_time` = `2026-11-05`；正文上方印刷「Nov 05, 2026」；官方 Gemini API 模型文档列出 API 模型名 `gemini-omni-1.2-flash`。

- 发布文：https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-omni-1-2-flash/
- 官方模型文档：https://ai.google.dev/gemini-api/docs/models/gemini-omni-1.2-flash

## 本批没有评测数值——这是结论，不是遗漏

剥掉 `<script>` / `<style>` 后的可见文本共 13,127 字符，全文只有三处百分比，全部是**价格**描述：「This update lowers costs by 30%」「We reduced the price by 30%」「We have dropped the price 30% from Gemini Omni 1.1 making it available at $0.07 per second for 720p video」。页面内不含任何评测图表载荷（vegaLiteSpec / vegaSpec 计数均为 0）。

按仓库口径（纯价格描述不得充当评测分、不得凭空造行），本条 `benchmark_evidence` 为**空数组**，不建任何 evidence 行。

## 官方发布文要点（逐字要点）

- "We're rolling out Gemini Omni 1.2 Flash, which offers native 15-second video creation, improved reference adherence, and multi-turn conversational editing. This update lowers costs by 30%..."
- "Today, we're rolling out Gemini Omni 1.2 Flash, and making it generally available across the Gemini API and Gemini for business."
- "We have dropped the price 30% from Gemini Omni 1.1 making it available at $0.07 per second for 720p video."
- "You can now generate and edit videos natively up to 15 seconds long, up from 10 seconds with Omni 1.1."
- "You can also specify duration in one-second increments from 3 to 15 seconds."

## 口径与限制

1. 本条是**新模型版本**（API 模型 id `gemini-omni-1.2-flash`），不是既有模型的定价调整；官方同时新增了原生 15 秒视频与多轮对话式编辑两项能力，故按新 release 建档。
2. 账本此前只在 `nano-banana-2-lite`（2026-06-30）下记过「Gemini Omni Flash」，未记 Omni 1.1 / 1.2；Omni 1.1 的缺口属存量回填轨道，不在本批增量窗口内。
3. 官方未给出参数量、上下文窗口与文本 token 定价，相应字段为 null。
4. 本批全部结论来自官方博客与官方 API 模型文档，无第三方来源参与。
