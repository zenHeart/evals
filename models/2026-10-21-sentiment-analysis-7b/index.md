---
vendor: microsoft
model: Sentiment-Analysis-7B
release: sentiment-analysis-7b
date: 2026-10-21
source: https://huggingface.co/microsoft/Sentiment-Analysis-7B
fetched_at: 2026-11-03
---

# Sentiment-Analysis-7B

> 官方发布载体是 HuggingFace 官方 org `microsoft` 下的 model card（`microsoft/Sentiment-Analysis-7B`），不是 blog/newsroom 文章。归档件 `page.md` 即该 model card 原文（3618 字节），`page.html` 为该模型页渲染后 HTML。

## 发布要点（转录）

- 官方定位：7B 参数自回归语言模型，在 [*mistralai/Mistral-7B-Instruct-v0.2*](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2) 之上微调，用于判断用户消息对「目标」的情感倾向——目标（the "Target"）指用户正在交互的当前服务、产品或 agent（含其网站、App、API 与支持渠道）。
- 训练方式：用强化学习微调，以 LLM 作为裁判（LLM-as-Judge），训练集是约 300 条的内部小样本；官方明确说明训练时未使用预定义标签。
- 输出格式：给定一条用户消息，模型先输出情感标签（`Negative` / `Neutral` / `Positive`），再跟一句简短解释；情感标签恒为生成的第一个 token。
- 用法：因果语言模型，用 `AutoModelForCausalLM` 加载；只要标签时设 `max_new_tokens=3`，要标签加解释时设 `max_new_tokens=64`。
- 官方在卡片中给出的判定规则：与 Target 无关的问题/陈述记 Neutral；含抱怨、挫败或指责的提问记 Negative；间接事故记 Neutral；陈述无法完成/失败记 Negative；陈述失败同时礼貌求助记 Neutral。

## 规格表（页面明示）

| 项 | 值 |
| --- | --- |
| Type | 7B-parameter autoregressive language model（causal LM） |
| Parameters | 7B |
| Base model | mistralai/Mistral-7B-Instruct-v0.2 |
| Task | sentiment classification of user messages（Negative / Neutral / Positive） |
| Training | reinforcement learning，LLM-as-Judge，~300 条内部训练样本，未用预定义标签 |
| Output | 首个 token 为情感标签，其后为简短解释 |
| Loading | `AutoModelForCausalLM`（transformers，bfloat16） |
| Licence | MIT |
| Pipeline tag | text-generation（HF 另标 sentiment-analysis / text-classification） |

页面未给出上下文窗口长度、API 定价与推理吞吐，账本 `context_window` / `pricing` 记 null。

## 评测数据（model card 明文表，逐位转写）

卡片正文以 markdown 表格给出，属 DOM 明文（非图片转写），按「DOM 表机读行」口径记 verified。

| model | accuracy |
| --- | ---: |
| mistralai/Mistral-7B-Instruct-v0.2 | 62.0% |
| **Sentiment-Analysis-7B (ours)** | **72.8%** |

- 指标：accuracy（卡片原文 "The evaluation metric used is accuracy."）。
- 官方评测集规模、构造与标注规则均未公开，只给出基座与微调后模型在同一评测集上的准确率对照。

## 竞品 / 基座对照（同表列，按口径进 notes 不另立行）

- 同表基座 `mistralai/Mistral-7B-Instruct-v0.2` accuracy 62.0%。这是本模型的基座而非对位竞品，按「一个 benchmark 行 = 一条 evidence，取自家模型列；竞品列进该行 notes」的口径记入该行 notes，不单独建行。

## 日期证据链（官方 org 仓 commit 时间线）

| UTC 时间 | commit | 仓库内容 | 说明 |
| --- | --- | --- | --- |
| 2026-10-17T00:51:18Z | `128ec138` initial commit | 仅 `.gitattributes` + 21 字节占位 README | 仓库创建，但**无权重、无评测**，不构成可用发布 |
| 2026-10-20T19:07:36Z | `02605a68` Upload folder | 15 个 safetensors 权重分片 + `config.json` + `chat_template.jinja` | 权重上架，模型自此可下载 |
| 2026-10-20T19:19:22Z | `a56b051f` Update README | 首次出现 "Evaluation metrics" 表（72.8% / 62.0%） | 官方评测随模型卡一同发布 |
| 2026-10-20T19:28:08Z | `c443f040` Update README | 评测表数值未变 | 文案微调 |
| 2026-10-26T19:09:43Z | `ac332405` Update README | 评测表数值未变（卡片末态） | 本次归档抓取的版本 |

- 本仓账本统一使用北京时间（UTC+8）记发布日期（先例：`glm/glm-4-6.json` 把 HF createdAt `2025-09-29T18:22Z` 折算为北京时间 09-30）。
- 权重与评测表同在 `2026-10-20T19:07Z~19:19Z` 落地，折算北京时间为 **2026-10-21 03:07~03:19**，故 `release_date = 2026-10-21`、`date_precision = day`。
- 不取 `2026-10-17`：该 commit 只有占位 README，模型权重尚未上传，把「仓库创建日」当发布日会把空壳算成一次发布。

## 未转录区块

- 卡片 "How to use" 一节的 Python 示例代码原样保留在 `page.md`，未在本文重复。
- HF 模型页的评论区、下载量/点赞数等社区指标未归档进账本。
