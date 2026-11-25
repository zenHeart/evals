---
vendor: tencent
model: WeVisForensics（Qwen3.5-4B + 5 个 LoRA 适配器）
release: wevisforensics
date: 2026-11-16
source: https://github.com/Tencent/WeVisForensics
fetched_at: 2026-11-25
---

# WeVisForensics（腾讯官方仓库证据归档）

发布日期证据链：官方 Hugging Face papers 页对 arXiv 2611.21373 标注「Published on Nov 16」；arXiv v1 提交时间 2026-11-16T16:36:14Z；官方 GitHub 仓 README 的 News 段只印到月（`[2026-11]`）；官方模型仓与代码仓 createdAt 均为 2026-11-14（发布前预置）。四处同处窗口内互证，取 2026-11-16 为发布日，`date_precision=day`。

- 官方代码仓（README 结果表）：https://github.com/Tencent/WeVisForensics （`github-readme.md`）
- 官方模型卡：https://huggingface.co/tencent/WeVisForensics （`model-card.md`）
- 官方技术报告：https://arxiv.org/abs/2611.21373

## 官方定位（原文要点）

- 「WeVisForensics is a self-evolving agentic detector of AI-generated video. A main investigator agent coordinates forensic inspector sub-agents for visual appearance, physical consistency, common sense, on-screen text, speech content, and voice profile.」
- 模型卡记载：五个适配器均为 rank 64 / alpha 128，基于 `Qwen/Qwen3.5-4B`，BF16；主调查员适配器在仓库根目录，四个检视员适配器分别在 `visual_appearance` / `physical_consistency` / `common_sense` / `ocr_consistency` 子目录。

## 评测转录表（官方 README 真表格逐格机读）

官方「Performance at a Glance」汇总表（Best Baseline 列 vs WeVisForensics 列）：

| 场景 | 基准 | 最强基线 | WeVisForensics（DTPO 档） |
|---|---|---|---|
| 域内 | GenBuster-Bench | 94.3 | 97.7 |
| 域外 | GenBuster-Bench++ | 91.4 | 97.5 |
| 域外 | MintVid General | 82.2 | 88.0 |
| 智能体 | AgenticCue | 79.3 | 97.8 |
| — | Average | 86.2 | 95.2 |

官方完整结果表分列（单位 %）：

| 切分 | WeVisForensics-DTPO | WeVisForensics-SFT |
|---|---|---|
| GenBuster-Bench | 97.7 | 93.9 |
| GenBuster-Bench++ | 97.5 | 94.2 |
| MintVid / Hailuo | 88.9 | 83.8 |
| MintVid / Jimeng | 82.9 | 77.9 |
| MintVid / Kling | 89.6 | 82.1 |
| MintVid / Seedance | 98.6 | 95.6 |
| MintVid / Sora2 | 82.4 | 75.9 |
| MintVid / Wan2.5 | 85.6 | 82.5 |
| AgenticCue / 视觉外观 | 97.3 | 92.4 |
| AgenticCue / 物理一致性 | 98.0 | 94.2 |
| AgenticCue / 屏幕文字 | 98.0 | 93.6 |
| AgenticCue / 常识 | 98.8 | 96.0 |
| AgenticCue / 音频 | 97.0 | 95.2 |
| Average | 95.2 | 91.3 |

## 限制

- 上表为 Markdown / HTML 真表格逐格机读，非位图读图、非 OCR；竞品列（VideoVeritas 各切分值）按口径只写进 evidence 的 notes，不单列行。
- 官方 README 的 TODO 区仍列有「Model weights on Hugging Face」与「AgenticCue benchmark」未完成项，而官方模型仓与 arXiv 条目均已上线，本仓按已上线的一手来源建档并记录该差异。
- 官方未印 temperature / top_p / 运行次数，protocol 对应字段一律 null；未印上下文长度，context_window 留 null。
