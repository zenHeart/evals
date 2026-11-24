---
vendor: thinking-machines
model: TML-d24-varloop-research
release: tml-d24-varloop-research
date: 2026-11-20
source: https://huggingface.co/thinkingmachines/TML-d24-varloop-research
fetched_at: 2026-11-24
---

# TML-d24-varloop-research（Thinking Machines Lab，2026-11-20）

> 发布日证据链：HF 模型卡正文「1. General Information」节印「Date of release: Nov 20, 2026」；同卡 RSC 载荷 metadata 的 `createdAt=2026-11-18T21:23:37Z`、`lastModified=2026-11-23T08:10:31Z`，即 11-18 建卡、11-20 正式发布、11-23 有编辑，与同批发布的 Inkling 2 Mini（release_date 2026-11-20，见 `thinking-machines/inkling-2-mini`）一致，`date_precision=day`。
> 规范地址：<https://huggingface.co/thinkingmachines/TML-d24-varloop-research>（归档 HTML 的 `og:url` 与 `rel=canonical`` 均指向该地址）。
> 页面协议信息：模型卡「5. Evaluations」节是一张 7 列 HTML `<table>`，53 行评测值全部以 DOM 单元格承载，可机读；页面无图表图片、无散文句读数。协议细节（脚手架、采样参数、运行次数）只以行内小字形式零散给出，没有独立协议节。

## 发布要点（中文转述，官方原文保留）

- **这是什么**——原文：「TML-d24-varloop-research is a research model, not a production model.」「We do not intend TML-d24-varloop-research for production use.」
  中文：这是研究模型而非生产模型，官方不建议生产使用。
- **与 Inkling 2 Mini 的关系**——原文：「TML-d24-varloop-research shares its pretraining and first stage of midtraining with Inkling 2 Mini. For the rest of midtraining, it was trained with 1 to 5 passes through the looped layers, sampled in a 1:2:6:2:1 ratio, and it was then post-trained with 3 passes.」
  中文：预训练与第一阶段中期训练与 Inkling 2 Mini 完全相同；此后按 1:2:6:2:1 的比例采样 1–5 次循环，最后用 3 passes 做后训练。
- **架构**——原文：「A 24-layer decoder-only transformer with sparse Mixture-of-Experts (MoE) feed-forward layers. The middle 12 layers run a variable number of times with shared weights, chosen at inference time; the model was trained with 1 to 5 passes. In each layer, each token is routed to 8 of 128 experts. Attention is a hybrid of local and global layers.」
  中文：24 层解码器-only Transformer，MoE 前馈层，中段 12 层共享权重循环次数推理时可选（训练时 1–5 次）；每层每 token 路由到 128 个专家中的 8 个；注意力局部/全局混合。
- **参数与有效激活**——原文：「Parameters: 26.4B, 3.4B active」「each extra pass through the looped layers adds about 1.0B effective active parameters per token. This corresponds to 3.4B active parameters at 1 pass, 5.4B at 3 passes, and 7.4B at 5 passes.」
  中文：26.4B 总参、3.4B 激活（1 pass）；每多一次循环约多 1.0B 有效激活，3 passes 为 5.4B、5 passes 为 7.4B。RSC 载荷 safetensors 统计 total=26,388,646,440 参数、totalFileSize≈18.2GB（模型卡自述「a single checkpoint of about 20GB」），与 26.4B 吻合。
- **多模态与上下文**——原文：「The model is natively multimodal – images are encoded via a vision transformer – with image and text inputs projected into a shared hidden space」「supports a context window of up to 1M tokens」；输入图像「each image dimension should be between 40px to 4096px」，输出只有文本。
- **数值精度与硬件门槛**——原文：「Its expert layers are NVFP4, the last four use MXFP8, and the remaining weights are BF16.」「requires a single machine with at least 32GB of GPU or unified memory」（DGX Spark / 32GB+ 显卡 / Apple silicon 32GB+ 统一内存均可）。
- **可用性**——原文：「The model is not available through an API, including Tinker. It is distributed as open weights only.」License = `apache-2.0`（模型卡 metadata `license_link=https://www.apache.org/licenses/LICENSE-2.0`）。
- **官方对 3 passes 之外表现的自我限制**——原文：「Because 3 passes dominated training once looping was introduced, performance at other pass counts may understate what models trained specifically at those counts could achieve.」「may behave unpredictably at pass counts other than 3」。
- **官方劝阻跨模型比较**——原文：「The two models\' later training stages differ, so we caution against comparing TML-d24-varloop-research directly to Inkling 2 Mini.」

## 评测数据全量转录

> 页面「5. Evaluations」节原文：「Each row shows one benchmark score for TML-d24-varloop-research run at 1 to 5 passes through its looped layers, beside Inkling 2 Mini, which always runs 3 passes. Scores are in percent, except PMPP-Hard, an area under the curve of tasks solved over 0–10 hours.」
> 按账本约定**只建自己模型（TML-d24-varloop-research）的行**；第一列 Inkling 2 Mini 是**另一个模型**，其 53 个数值只作对照记录在 notes，不建 comparison_cited 行。
> 下表 53 个评测行 × 5 个循环档 = **265 个 evidence 行**，全部已写入 `data/model-releases/official/thinking-machines/tml-d24-varloop-research.json`。


### Agentic Coding（智能体编程）

| 行名（页面原文） | 内联协议 | benchmark_id | benchmark_variant | metric | Inkling 2 Mini (3 passes) | 1 pass | 2 passes | 3 passes | 4 passes | 5 passes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DeepSWE v1.1 | mini-swe-agent v2.4.6 | `deepswe` | v1.1 | resolve_rate | 48.2% | 0.7% | 28.3% | 47.4% | 46.9% | 48.2% |
| SWEBench Pro v2 (Hard) | mini-swe-agent v2.4.6 | `swebench-pro` | v2 (Hard) | resolve_rate | 77.9% | 39.7% | 69.1% | 78.9% | 76.0% | 78.4% |
| SWEBench Multilingual | bash only | `swebench-multilingual` | — | resolve_rate | 73.7% | 40.8% | 68.5% | 71.8% | 72.8% | 72.0% |
| SWEBench Verified | bash only | `swebench` | — | resolve_rate | 79.2% | 56.3% | 76.5% | 78.7% | 79.3% | 79.6% |
| SWEBench Multimodal v2 | mini-swe-agent (vals) | `swebench-mm` | v2 | resolve_rate | 37.9% | 23.1% | 32.9% | 34.8% | 35.4% | 36.0% |
| PMPP-Hard (AUC, 0–10h) | pi v0.83.0 | `pmpp-hard` | AUC (task-hours, 0–10h) | auc / task-hours | 455.8 | 49.5 | 315.3 | 401.8 | 437.2 | 424.0 |

### Agentic Search, Tool Use, and Knowledge Work（智能体检索、工具使用与知识工作）

| 行名（页面原文） | 内联协议 | benchmark_id | benchmark_variant | metric | Inkling 2 Mini (3 passes) | 1 pass | 2 passes | 3 passes | 4 passes | 5 passes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BrowseComp | original, no context management | `browsecomp` | original, no context management | accuracy | 76.0% | 29.4% | 53.8% | 65.7% | 69.4% | 71.0% |
| DeepSearchQA | with compaction | `deepsearchqa` | with compaction | accuracy | 85.3% | 58.5% | 74.8% | 78.9% | 83.4% | 83.0% |
| MCP Atlas | Public | `mcp-atlas` | Public | success_rate | 82.7% | 70.0% | 77.6% | 79.4% | 79.7% | 80.0% |
| JobBench | — | `jobbench` | — | accuracy | 49.6% | 22.8% | 55.1% | 63.8% | 61.8% | 63.3% |
| EnterpriseOps-Gym | LangChain ReAct loop | `enterpriseops-gym` | LangChain ReAct loop | accuracy | 36.7% | 25.7% | 34.4% | 36.6% | 36.5% | 37.6% |
| Diligence Bench | Loop | `diligencebench` | Loop | accuracy | 31.7% | 16.1% | 22.2% | 27.9% | 29.4% | 32.3% |

### Vision Interpretation and Creation（视觉理解与生成）

| 行名（页面原文） | 内联协议 | benchmark_id | benchmark_variant | metric | Inkling 2 Mini (3 passes) | 1 pass | 2 passes | 3 passes | 4 passes | 5 passes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GDP.pdf | — | `gdp-pdf` | — | accuracy | 16.8% | 4.6% | 11.2% | 19.6% | 18.0% | 20.0% |
| PerceptionBench | — | `perception-bench` | — | accuracy | 57.5% | 45.5% | 51.3% | 53.9% | 53.7% | 52.7% |
| MMMU Pro | Standard 10 | `mmmu-pro` | Standard 10 | accuracy | 74.9% | 63.6% | 69.8% | 71.4% | 72.1% | 73.2% |
| OmniDocBench v1.6 | — | `omnidocbench` | v1.6 | overall_distance | 92.8% | 86.6% | 90.5% | 92.1% | 91.8% | 92.5% |
| BabyVision | original | `babyvision` | original | accuracy | 53.4% | 32.7% | 44.9% | 50.3% | 50.3% | 49.2% |
| BabyVision | with Python | `babyvision` | with Python | accuracy | 88.8% | 67.2% | 84.1% | 88.9% | 88.8% | 89.5% |
| ScreenSpot Pro | original | `screenspot-pro` | original | accuracy | 76.5% | 54.4% | 66.0% | 72.0% | 73.4% | 73.1% |
| ScreenSpot Pro | with Python | `screenspot-pro` | with Python | accuracy | 87.7% | 80.7% | 86.5% | 87.7% | 87.2% | 88.1% |
| Charxiv RQ | original | `charxiv-reasoning` | original | accuracy | 80.6% | 75.0% | 78.3% | 79.9% | 79.2% | 80.4% |
| Charxiv RQ | with Python | `charxiv-reasoning` | with Python | accuracy | 88.3% | 84.7% | 87.7% | 87.6% | 89.3% | 87.9% |
| Chartography | original | `chartography` | original | accuracy | 22.1% | 14.5% | 17.8% | 21.6% | 21.4% | 22.6% |
| Chartography | with Python | `chartography` | with Python | accuracy | 72.5% | 49.1% | 69.1% | 72.3% | 73.7% | 72.3% |
| ZeroBench (main) | original | `zerobench` | main, original | accuracy | 17.0% | 9.0% | 13.0% | 19.0% | 18.0% | 17.0% |
| ZeroBench (main) | with Python | `zerobench` | main, with Python | accuracy | 34.0% | 16.0% | 31.0% | 40.0% | 35.0% | 37.0% |
| Humanity’s Sixth Sense | — | `humanitys-sixth-sense` | — | accuracy | 23.8% | 22.4% | 24.8% | 25.5% | 26.5% | 27.0% |
| MathVision | — | `mathvision` | — | accuracy | 89.0% | 74.8% | 84.9% | 86.6% | 87.8% | 88.1% |
| MuirBench | — | `muirbench` | — | accuracy | 77.5% | 73.6% | 76.1% | 77.1% | 76.4% | 77.8% |
| BVB | — | `bvb` | — | accuracy | 68.4% | 58.1% | 64.4% | 68.5% | 69.2% | 69.5% |

### Reasoning, Knowledge, and Epistemics（推理、知识与认知论）

| 行名（页面原文） | 内联协议 | benchmark_id | benchmark_variant | metric | Inkling 2 Mini (3 passes) | 1 pass | 2 passes | 3 passes | 4 passes | 5 passes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| HLE-Diamond | — | `hle-diamond` | — | accuracy | 15.2% | 6.3% | 8.5% | 9.5% | 9.7% | 11.1% |
| HLE (text only) | — | `hlehle` | text only | accuracy | 30.7% | 10.5% | 20.0% | 24.9% | 25.4% | 25.9% |
| GPQA Diamond | — | `gpqa` | — | accuracy | 86.6% | 69.6% | 79.2% | 84.2% | 81.9% | 83.1% |
| Apex 2025 | — | `apex` | 2025 | accuracy | 34.4% | 3.1% | 10.4% | 19.8% | 15.6% | 18.8% |
| ComplexConstraints v1.1 | openhands v1.45.0 | `complexconstraints` | v1.1 | success_rate | 33.4% | 4.5% | 26.0% | 37.9% | 39.6% | 38.9% |
| SimpleQA Verified | — | `simpleqa-verified` | — | accuracy | 8.4% | 6.3% | 6.5% | 7.3% | 6.8% | 6.7% |
| AA-Omniscience v1.1 (Public) | accuracy | `aa-omniscience` | v1.1 (Public) accuracy | accuracy | 21.3% | 15.5% | 16.3% | 18.4% | 18.0% | 17.4% |
| AA-Omniscience v1.1 (Public) | non-hallucination rate | `aa-omniscience` | v1.1 (Public) non-hallucination rate | non_hallucination_rate | 64.6% | 79.3% | 85.0% | 84.0% | 85.7% | 85.9% |
| SimpleVQA | — | `simplevqa` | — | accuracy | 45.4% | 39.0% | 41.8% | 42.4% | 42.9% | 41.3% |
| WorldVQA | — | `worldvqa` | — | accuracy | 15.2% | 11.3% | 13.0% | 14.2% | 14.3% | 13.5% |
| AA-LCR v1.1 | — | `aa-lcr` | v1.1 | accuracy | 80.0% | 55.5% | 73.5% | 74.8% | 75.5% | 76.8% |
| LongBench v2 | — | `longbench` | v2 | accuracy | 66.9% | 50.6% | 61.8% | 66.5% | 66.2% | 66.4% |
| GraphWalks BFS | 256K | `graphwalks` | BFS 256K | accuracy | 69.7% | 21.1% | 54.5% | 63.2% | 64.3% | 64.9% |
| GraphWalks BFS | 1M | `graphwalks` | BFS 1M | accuracy | 50.0% | 5.7% | 39.4% | 52.1% | 56.2% | 57.8% |
| MRCR v2 | 8-needle 256K–512K | `mrcr` | v2 8-needle 256K–512K | accuracy | 46.4% | 26.2% | 65.2% | 89.2% | 93.4% | 92.1% |
| MRCR v2 | 8-needle 512K–1M | `mrcr` | v2 8-needle 512K–1M | accuracy | 37.7% | 20.6% | 49.7% | 72.3% | 81.4% | 79.9% |
| ARC-AGI-1 | Public | `arc-agi` | v1 | accuracy | 90.5% | 29.5% | 59.3% | 71.5% | 72.6% | 75.3% |
| ARC-AGI-2 | Public | `arc-agi` | v2 | accuracy | 51.3% | 0.8% | 12.2% | 22.1% | 20.3% | 27.1% |

### Safety and Alignment（安全与对齐）

| 行名（页面原文） | 内联协议 | benchmark_id | benchmark_variant | metric | Inkling 2 Mini (3 passes) | 1 pass | 2 passes | 3 passes | 4 passes | 5 passes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FORTRESS (adversarial) | Public | `fortress` | adversarial | robustness | 89.5% | 89.0% | 90.4% | 90.0% | 89.9% | 89.4% |
| FORTRESS (benign) | Public | `fortress` | benign | robustness | 96.4% | 95.0% | 95.9% | 95.3% | 95.7% | 95.0% |
| StrongREJECT (none) | — | `strongreject` | none | refusal_rate | 97.8% | 98.8% | 98.4% | 98.2% | 99.4% | 98.4% |
| PatchEval | — | `patcheval` | — | accuracy | 60.9% | 55.7% | 73.9% | 73.9% | 75.2% | 73.5% |
| Destructive actions (Internal) ↓ | — | `thinking-machines-destructive-actions` | — | destructive_action_rate ↓ | 10.2% | 26.6% | 16.4% | 7.8% | 3.1% | 7.0% |

> 表内「original / with Python」成对出现的 5 组（BabyVision、ScreenSpot Pro、Charxiv RQ、Chartography、ZeroBench (main)）是同一评测带/不带 Python 工具的两个档位，按既有口径拆成两行，用 `benchmark_variant` 区分；「with Python」行 `protocol.tools=["python"]`，「bash only」行 `protocol.tools=["bash"]`，其余一律 null。

## 单位与指标口径

- 页面原文：「Scores are in percent, except PMPP-Hard, an area under the curve of tasks solved over 0–10 hours.」因此 52 行是百分数，`PMPP-Hard` 一行不带 `%`，账本 `unit="task-hours"`、`metric="auc"`。
- `OmniDocBench v1.6` 的官方指标是编辑距离（`overall_distance`，越低越好），此处照录页面印出的百分数，不改变方向。
- `Destructive actions (Internal) ↓` 行名末尾的 `↓` 表示该指标越低越好（越低 = 越少破坏性动作），账本 `metric="destructive_action_rate"`。
- `AA-Omniscience v1.1 (Public)` 印两个值（accuracy / non-hallucination rate），是同一基准的两个不同指标，按既有口径拆成两行。
- `HLE-Diamond` 与 `HLE (text only)` 是同一基准的两个档位，拆成 `hle-diamond` / `hlehle` 两行。

## 与 Inkling 2 Mini 的关系（第一列为何不建行）

1. 第一列「Inkling 2 Mini (3 passes)」是**另一个模型**，按「只建自己模型行、竞品列入 notes」的账本约定，53 个 Inkling 数值全部只写进对应行的 `notes`。
2. 官方原文明确劝阻直接比较：「The two models\' later training stages differ, so we caution against comparing TML-d24-varloop-research directly to Inkling 2 Mini.」因此该列与本模型的任何一档都不构成同协议对照，各行 `comparison_scope` 仍记 `only_same_protocol`。
3. Inkling 2 Mini 自己的成绩已由 `thinking-machines/inkling-2-mini`（发布文来源 `https://thinkingmachines.ai/news/inkling-2-mini/`）单独入账，本页不重复。

## 独立交叉验证（仅 1 pass 档）

页面 RSC 载荷 metadata 里的 `evalResults` 数组有 10 条，独立复现 1 pass 档的 10 个数值，与表格「1 pass」列逐一吻合：

| evalResults 数据集 | task_id | 值 | 对应表格行 |
| --- | --- | --- | --- |
| `Idavidrein/gpqa` | `diamond` | 69.6 | GPQA Diamond |
| `datacurve/deep-swe` | `deep_swe` | 0.7 | DeepSWE v1.1 |
| `MMMU/MMMU_Pro` | `mmmu_pro_standard_10_options` | 63.6 | MMMU Pro（Standard 10） |
| `ScaleAI/SWE-bench_Pro` | `SWE_Bench_Pro_hard` | 39.7 | SWEBench Pro v2 (Hard) |
| `SWE-bench/SWE-bench_Multilingual` | `swe_bench_multilingual_%_resolved` | 40.8 | SWEBench Multilingual |
| `SWE-bench/SWE-bench_Verified` | `swe_bench_%_resolved` | 56.3 | SWEBench Verified |
| `SWE-bench/SWE-bench_Multimodal` | `swe_bench_multimodal_%_resolved` | 23.1 | SWEBench Multimodal v2 |
| `likaixin/ScreenSpot-Pro` | `overall` | 54.4 | ScreenSpot Pro（original） |
| `likaixin/ScreenSpot-Pro` | `overall` + `notes: With Python tool.` | 80.7 | ScreenSpot Pro（with Python） |
| `cais/hle` | `hle` + `notes: Text-only subset.` | 10.5 | HLE (text only) |

> 该数组 10 条全部 `"verified": false`、同属 `pullRequest: 6`、来源文件 `.eval_results/TML-d24-varloop-research.yaml`，即厂商自己在 HF 侧登记的 eval-results，不是 HF 官方核验结果；本批只把它当作**第二处机读来源**用于交叉验证表格读数，不作为独立第三方证据。该数组只登记 1 pass 档，故 2–5 passes 档没有第二来源。

## 归档说明

- `page.html` = HF 模型卡原始存档（HTTP GET，浏览器 User-Agent；页面为 Next.js RSC + 服务端渲染 HTML，非纯 JS 渲染），sha256 `c02b6f20cefd1ec733c8874d3efcde3d2a475dacf0d756b3d8a894b15940330b`，348526 字节。
- `images/` = 空。页面正文无评测图表图片；评测数值全部在 DOM `<table>` 单元格里，RSC 载荷内嵌的 `evalResults` 也是文本 JSON，两种来源都不依赖图片。
- 账本 `models[].pricing` 记 null：官方明示「The model is not available through an API, including Tinker. It is distributed as open weights only.」没有 API 价格可记。
- 全部数值为厂商自报（`vendor_reported`），未经第三方独立复现；页面「6. Safety」节自述「We evaluated this model with the same pre-release process as Inkling 2 Mini」「did not present risk of material uplift beyond what\'s already available in the open-weight ecosystem」。
- 页面元数据：`likes=87`、`downloads`（last month）= 2564、`pipeline_tag=image-text-to-text`、`library_name=transformers`、`model_type=inkling2_loop`、`architectures=["Inkling2LoopForConditionalGeneration"]`、`license=apache-2.0`、tags 含 `eval-results` / `moe` / `region:us`。
- 本归档仅存 2026-11-24 当日抓取快照。
