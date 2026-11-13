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
- `comparability`（可选）：复核后判定该格与被转述模型的自报**不是同一套设置**时标注。
  - `status: not_comparable`：不计入同表两两对照，也不进全库能力估计，只在「另见」里展示；
  - `cause` 取值见 `conflicts.json` 的 `cause_labels`；来源本身不可靠的（`placeholder_widget` 页面示意组件、`reporter_misattribution` 发布方误记型号）连全库估计也不用；
  - `conflict_ids`：指向 `conflicts.json` 里对应的逐条登记（没有登记时为空，原因写在 `note` 里）。

## 怎么用（/choose/ 两模型对照）

1. **双方都有可比的自报**：以自报为准；同表数值只在该行显示为「另见」，不一致时标「与自报不同，以自报为准」，**不取平均**。
2. **至少一方没有可比的自报、但某篇发布页在同一行里同时列出了两者**：用这一行补上对照，按自报同题对照的**一半权重**计（`SAME_TABLE_WEIGHT=0.5`）；同一评估有多张表时平分这一半；同一发布方在多篇发布页重复印出同一组数值只算一次。只靠同表数据时结论最多判「略占优」，发布方就是其中一方时可信度为低。
3. **只有发布方自家的表、且独立评估不足 2 项**（`HOME_MIN_ROWS`）：不判方向，写「难分高下」，数值仅作参考展示。一张自家表的一行撑不起胜负——发布方可能就是被比较的一方。例：Claude Opus 5.5 vs GPT-6 Astra（知识与推理）只靠 Anthropic 一页的一行 HLE。
4. **全库能力估计**：同表数值只给「自己没有这项自报」的模型补观测，自报有值时一律用自报。

为什么是半权：同表数值来自同一发布方、同一套设置，彼此可比；但发布方可能就是被比较的一方，竞品的推理档位常未注明，且与被转述厂商的自报并不总一致（见下）。外部验证（`npm run validate:fair`）显示：加入同表数据后，全库估计与 Epoch AI ECI、Artificial Analysis、LMArena WebDev 等独立来源的相关性在同一批模型上持平或提高；只靠同表数据判出的方向与外部来源的一致率为 76%–100%。

### 视觉与文档：同表数据只作参考（`TABLE_WEIGHT_BY_DOMAIN`）

同表数据在各领域的可信度按领域分开设「对照」与「估计」两档（`scripts/fair-compare.mjs` 的 `TABLE_WEIGHT_BY_DOMAIN`，缺省 1）。取值由外部榜单逐档扫描决定：

```
node scripts/fair-compare-validate.mjs --sweep-table-weight vision-documents --split
```

| 档位 | Epoch ECI | AA 智能指数 | AA 方向一致率 | 留一外推（中位数/加权） |
|---|---:|---:|---:|---|
| 加入同表数据之前（基线） | 0.57 | 0.41 | 6/7 (86%) | 0.67 / 0.61 |
| ρ对照=1（同表进两两对照） | 0.86 | 0.83 | 13/18 (72%)，其中同表判方向 6/10 | 0.67 / 0.55 |
| **ρ对照=0、ρ估计=0.5（采用）** | **0.83** | **0.81** | **6/7 (86%)，同表不再判方向** | **0.79 / 0.65** |
| ρ对照=0、ρ估计=0.25 | 0.74 | 0.68 | 6/7 (86%) | 0.79 / 0.61 |
| ρ对照=0、ρ估计=0.75 | 0.85 | 0.81 | 6/7 (86%) | 0.67 / 0.59 |

两条结论：

- **对照档取 0**：只要同表数值能进两两对照（ρ对照 ≥ 0.1），AA 方向一致率就降到 83% 或更低（ρ对照=1 时 72%，其中只靠同表判方向的对子只有 6/10 与 AA 一致），错的方向集中在少数几张发布方自家表（Anthropic 的 Fable 5.2 页、Thinking Machines 的 Inkling 2 Small 页）。该领域的同表数值因此只作「另见」展示，不计入胜负。
- **估计档取 0.5**：0.5 是让留一外推加权值不低于加入同表数据之前（0.65 ≥ 0.61）的最高档；0.75 与 1.0 的秩相关略高但留一外推回落到 0.59 / 0.55。0.5 在 ECI、AA、留一外推三项上都优于 0.25 档。

编程开发、知识与推理两个领域没有外部证据表明同表数据不可靠，两档都保持 1。

## 汇总（2026-11-13）

- 发布文件 33 个，竞品格 2012 条，其中 1672 条能对上本库模型。
- 复核方式：`dom_table` 973 条、`reader_markdown` 842 条、`page_text` 197 条。
- 此前记在账本 `notes` 里的竞品列与本次重新抓取逐格对照 81 格，全部一致。
- 只在图片里的竞品列（Seed 1.8、MiniMax、Qwen3、DeepSeek V3.2 等页面）无法从页面文本复核，本次不入库，仍只保留在原 `notes` 里。
- 162 格标为「设置不同、不可比」，其中 29 格在 `conflicts.json` 里有逐条登记。

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

## 数值冲突逐条归因（`conflicts.json`）

2026-11-13 回到各原页重读（必要时看归档原图），把两类数值不一致逐条归因：

- **自报 vs 同表**（`self_vs_table`）：同一评估、同一版本写法下，同表竞品列的数与被列出模型自报不一致，共 **82** 处。
- **表与表之间**（`cross_table`）：同一模型、同一评估同一版本，在两篇及以上发布页里印出不同数值，共 **78** 组。

每条的 `cause` 取值与条数（`summary` 可由条目重算，`tests/competitor-columns.test.mjs` 逐条校验）：

| 原因 | 自报 vs 同表 | 表与表之间 | 处置 |
|---|---:|---:|---|
| 两页均未说明原因 | 21 | 27 | 保留，以自报为准 |
| 厂商在后续页面改报数值 | 13 | 5 | 保留，以自报为准 |
| 执行框架不同 | 12 | 9 | 标「设置不同、不可比」 |
| 推理/工具设置不同 | 8 | 4 | 标「设置不同、不可比」 |
| 型号或快照不同 | 6 | 4 | 保留，以自报为准 |
| 评测版本或子集不同 | 6 | 12 | 标「设置不同、不可比」 |
| 本站转录或映射错误 | 5 | 9 | 已按原文改正，见各文件 `corrections` / `revisions` |
| 页面示意组件，来源不明 | 4 | 9 | 标不可比，且不进全库估计 |
| 榜单快照时点不同 | 3 | 5 | 保留，以自报为准 |
| 只是小数位不同 | 3 | 1 | 保留，以自报为准 |
| 发布方误记为其他型号 | 1 | 1 | 标不可比，且不进全库估计 |

处置结果：

- **已改正本站数据 5 处**（自报侧）：`claude-opus-5-5` 的 OSWorld 版本「2.0 partial」应为「2.1 partial」；`muse-ember` 的 PerceptionBench 漏记版本，补「w/ tools」；`step-5-preview` 的 AutomationBench 漏记版本，补「AutomationBench-AA」；另 2 处为竞品列的 `model_id` 误映射（DeepSeek-V3.2 → DeepSeek-V3.2-Exp）。每处都在对应账本的 `revisions` 或该竞品列记录的 `corrections` 里记了原值、新值与出处。
- **标为「设置不同、不可比」162 格**，不再计入同表两两对照与全库估计，只在「另见」里展示；其中来源不可靠的（示意组件、误记型号）连全库估计也不用。
- **保留 48 处**：厂商改报、型号快照合并、四舍五入、榜单快照、两页均未说明。一律以自报为准，同表数值只在「另见」里标出不一致，不取平均。

两个必查样例：

- Kimi K2 页 AIME 2025 表列名写作「Claude Opus 4 (w/o extended thinking)」的 33.9，与 Anthropic 自报的 75.5 差 41.6 分——自报 75.5 是开启扩展思考的口径，Anthropic 附录里另载的无扩展思考值正是 33.9。该格标不可比。
- Anthropic Fable 5.2 页记 GPT-6 Astra 的 Terminal-Bench-Science 0.1 为 68.1%，OpenAI Astra 页与 Anthropic Opus 5.5 页都是 64.6%，Fable 5.2 页脚注只说「各模型取最高可用档」、未说明差异。保留，以自报 64.6 为准。

## 全库能力估计标「仅供参考」的领域

`scripts/fair-compare.mjs` 的 `EXTERNALLY_VALIDATED` 列出有外部综合榜单可校验全库估计的领域：编程开发、知识与推理、视觉与文档。其余领域，或大多数模型只有 1 项可对齐评估的领域（`THIN_SHARE`），估计照常展示但标「仅供参考」，不产生间接结论（`estimateReference`）。当前命中：办公与商务、调研与搜索（均无外部榜单可校验）。计算机操作、中文长文写作、量化金融三个领域公开分数太稀，直接不提供估计。
