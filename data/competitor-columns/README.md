# 发布页同表竞品列（third_party_reported_by_vendor）

厂商发布页的对比表里，常常在自家模型旁边列出其他厂商模型的分数。这些数值是**发布方在自己的设置下测得或转引的**，不是被列出模型的厂商自报，所以单独记在这里，不写进 `model-releases/` 的自报记录，也不改动任何已有账本文件。

- 每个文件对应一篇官方发布：`<发布方厂商>/<release_id>.json`。
- `attribution_type` 固定为 `third_party_reported_by_vendor`（发布方转述）；`reported_by_vendor` 是发布方。
- 每格一条 `columns[]` 记录：
  - `host_evidence_id`：同一张表同一行里发布方自家模型的自报记录 id（`model-releases/` 里的 evidence）。评估 id、版本写法、指标与单位都从宿主行继承，因此同一行里的竞品数值与宿主数值口径一致。
  - `model_id`：被列出的模型（能对上本库模型时填 id，对不上的如 `GPT-4.1`、`DeepSeek-V3-0324` 记为 `null`，只存档、不参与对照）；`model_label` 为页面原文列名。
  - `value` / `display`：页面原样数值；`settings`：列名或格内注明的设置（推理档位、是否开启思考、脚注标记等），未注明为 `null`。
  - `locator`：第几张表、行名、列名（散文引用时只有行名与模型名）。
  - `verification`：2026-11-13 重新抓取原页后的复核方式：
    - `dom_table`：直接解析页面 HTML 表格，该格原文记在 `cell`；
    - `reader_markdown`：页面需要脚本渲染或拒绝直接抓取时，用网页阅读器转成 Markdown 后解析表格；
    - `page_text`：散文或页面内嵌数据里的数值，要求数值紧跟在该模型名之后、且与宿主模型的分数出现在同一段，原文片段记在 `snippet`。
- 宿主行的数值必须与账本自报值完全一致，才认定这一行就是该评估（用来把表格行对上评估 id，避免行错位）。

## 怎么用（/choose/ 两模型对照）

1. **双方都有可比的自报**：以自报为准；同表数值只在该行显示为「另见」，不一致时标「与自报不同，以自报为准」，**不取平均**。
2. **至少一方没有可比的自报、但某篇发布页在同一行里同时列出了两者**：用这一行补上对照，按自报同题对照的**一半权重**计（`SAME_TABLE_WEIGHT=0.5`）；同一评估有多张表时平分这一半；同一发布方在多篇发布页重复印出同一组数值只算一次。只靠同表数据时结论最多判「略占优」，发布方就是其中一方时可信度为低。
3. **全库能力估计**：同表数值只给「自己没有这项自报」的模型补观测，自报有值时一律用自报。

为什么是半权：同表数值来自同一发布方、同一套设置，彼此可比；但发布方可能就是被比较的一方，竞品的推理档位常未注明，且与被转述厂商的自报并不总一致（见下）。外部验证（`npm run validate:fair`）显示：加入同表数据后，全库估计与 Epoch AI ECI、Artificial Analysis、LMArena WebDev 等独立来源的相关性在同一批模型上持平或提高；只靠同表数据判出的方向与外部来源的一致率为 76%–100%。

## 汇总（2026-11-13）

- 发布文件 33 个，竞品格 2012 条，其中 1672 条能对上本库模型。
- 复核方式：`dom_table` 973 条、`reader_markdown` 842 条、`page_text` 197 条。
- 此前记在账本 `notes` 里的竞品列与本次重新抓取逐格对照 81 格，全部一致。
- 只在图片里的竞品列（Seed 1.8、MiniMax、Qwen3、DeepSeek V3.2 等页面）无法从页面文本复核，本次不入库，仍只保留在原 `notes` 里。

| 文件 | 竞品格 | 对上本库模型 | 来源 |
|---|---:|---:|---|
| `anthropic/claude-fable-5-1.json` | 21 | 21 | https://www.anthropic.com/claude-fable-and-mythos-5-1 |
| `anthropic/claude-fable-5-2.json` | 40 | 39 | https://www.anthropic.com/claude-fable-and-mythos-5-2 |
| `anthropic/claude-haiku-5-5.json` | 19 | 19 | https://www.anthropic.com/claude-haiku-5-5 |
| `anthropic/claude-opus-5-5.json` | 26 | 26 | https://www.anthropic.com/claude-opus-5-5 |
| `anthropic/claude-sonnet-5-5.json` | 11 | 11 | https://www.anthropic.com/claude-sonnet-5-5 |
| `deepseek/deepseek-v4-1-flash.json` | 37 | 37 | https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash |
| `doubao/seed-2-1.json` | 1 | 0 | https://seed.bytedance.com/en/blog/seed2-1-officially-released-advancing-ai-productivity |
| `glm/glm-4-7.json` | 108 | 96 | https://z.ai/blog/glm-4.7 |
| `glm/glm-5-1.json` | 118 | 105 | https://z.ai/blog/glm-5.1 |
| `glm/glm-5-2.json` | 101 | 101 | https://z.ai/blog/glm-5.2 |
| `glm/glm-5-3.json` | 90 | 82 | https://z.ai/blog/glm-5.3 |
| `glm/glm-5.json` | 87 | 60 | https://z.ai/blog/glm-5 |
| `google/gemma-4.json` | 43 | 0 | https://ai.google.dev/gemma/docs/core/model_card_4 |
| `kimi/kimi-k2-0905.json` | 27 | 17 | https://huggingface.co/moonshotai/Kimi-K2-Instruct-0905 |
| `kimi/kimi-k2-6.json` | 48 | 36 | https://www.kimi.ai/blog/kimi-k2-6 |
| `kimi/kimi-k2-thinking.json` | 89 | 89 | https://www.kimi.ai/blog/kimi-k2-thinking |
| `kimi/kimi-k2.json` | 187 | 88 | https://www.kimi.ai/blog/kimi-k2 |
| `kimi/kimi-k3-1-pro.json` | 2 | 2 | https://www.kimi.com/en/blog/kimi-k3-1-pro |
| `kimi/kimi-k3.json` | 127 | 127 | https://www.kimi.ai/blog/kimi-k3 |
| `meta/muse-ember.json` | 14 | 14 | https://research.meta.ai/blog/muse-ember |
| `meta/muse-glimmer-30b.json` | 18 | 12 | https://huggingface.co/meta-models/Muse-Glimmer-30B |
| `microsoft/mage-vl-cowork.json` | 20 | 9 | https://huggingface.co/microsoft/Mage-VL-Cowork |
| `openai/gpt-5-5.json` | 5 | 5 | https://openai.com/index/introducing-gpt-5-5/ |
| `openai/gpt-5-6.json` | 110 | 84 | https://openai.com/index/gpt-5-6/ |
| `openai/gpt-6-1-sol.json` | 1 | 1 | https://openai.com/index/low-resource-programming-languages |
| `openai/gpt-6-astra.json` | 71 | 71 | https://openai.com/index/gpt-6-astra/ https://openai.com/index/low-resource-programming-languages |
| `openai/gpt-6-sol-and-luna.json` | 1 | 1 | https://openai.com/index/low-resource-programming-languages |
| `stepfun/step-3-5-flash.json` | 74 | 45 | https://github.com/stepfun-ai/Step-3.5-Flash |
| `stepfun/step-3-7-flash.json` | 111 | 104 | https://static.stepfun.com/blog/step-3.7-flash/ |
| `stepfun/step-5-preview.json` | 155 | 155 | https://www.stepfun.com/step-5-preview |
| `tencent/hunyuan-a13b.json` | 19 | 6 | https://github.com/Tencent-Hunyuan/Hunyuan-A13B |
| `thinking-machines/inkling-2-small.json` | 199 | 193 | https://thinkingmachines.ai/news/inkling-2-small/ |
| `xai/grok-2.json` | 32 | 16 | https://x.ai/blog/grok-2 |
