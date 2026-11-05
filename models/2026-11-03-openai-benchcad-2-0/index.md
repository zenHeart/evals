---
vendor: openai
model: GPT-6 Astra
release: gpt-6-astra
date: 2026-11-03
source: https://openai.com/index/accelerating-engineering-for-the-physical-world
fetched_at: 2026-11-04
---

# OpenAI《Accelerating engineering for the physical world》——BenchCAD 2.0 明文绝对分值

发布日期证据：页面正文页眉印刷「November 3, 2026」；官方新闻 RSS（`https://openai.com/news/rss.xml`）对应条目 `pubDate` 为 `Tue, 03 Nov 2026 08:00:00 GMT`，两者一致。来源：https://openai.com/index/accelerating-engineering-for-the-physical-world

本页是 OpenAI 官网一篇**研究文章**（非模型发布文），讲 OpenAI 硬件与基础设施团队如何用 GPT-6 / GPT-6 Astra / Codex 推进工程设计工作流。文中「Measuring progress on engineering tasks」一节给出 **BenchCAD 2.0** 的明文绝对分值，其中 **GPT-6 Astra = 0.594** 是本批新入库的 evidence 来源。

## 评测数据转录表

| 评测 | 分数 | 备注 |
|---|---|---|
| BenchCAD 2.0 | 0.594 | GPT-6 Astra，官方原文「at its highest reasoning setting」；平均分，0–1 量纲 |
| BenchCAD 2.0 | 0.875 | 官方原文「A newer internal model achieved an average score of 0.875」——**未具名内部模型**，无 model id，不建 evidence 行，只进 notes |

官方原文（DOM 散文明文，逐字）：

> We're also measuring progress on newer models on tasks that combine coding with engineering knowledge. BenchCAD 2.0 tests whether models can reconstruct 3D parts and assemblies and identify connections in circuit boards. A newer internal model achieved an average score of 0.875, compared with 0.594 for GPT‑6 Astra at its highest reasoning setting. While the engineering lifecycle includes many other elements beyond design, we view improvements in capability here as early evidence of the ability of AI models to positively impact iteration speed for professional workflows.

## 非评测内容（不进账本）

| 内容 | 数值 | 备注 |
|---|---|---|
| 硬件团队自 2 月起模型 token 用量增长 | 23 倍 | 运营指标，非模型评测分数 |
| 两人用 Astra 设计测试设备耗时 | 不足一周 | 项目流程叙述，非评测 |
| 合同制造商首批原型量产耗时 | 不足一个月 | 项目流程叙述，非评测 |
| Mazda 合作、AGI 风险测试芯片、Work Louder 合作等 | 无分值 | 案例与合作叙述 |

## 口径说明

1. **本页不是模型发布文**：不改变 `gpt-6-astra` release 的发布日期（2026-09-03），不改变任何规格字段（params / context_window / pricing / modalities），也不新建 release。先例同 Retell vCX 客户案例归档。
2. **BenchCAD 2.0 与账本既有 BenchCAD 行不是同一量纲**：既有 6 条 evidence 是百分制（GPT-5.6 Sol 70.6 / Terra 62.3 / Luna 63.1 / GPT-5.5 44.4；Kimi K3.1 Pro 92.7 且脚注为 with-tools），本页 2.0 是 0–1 平均分，跨版本不可直比。
3. **未具名内部模型的 0.875 不建行**：官方未给该模型的任何可识别名称或发布信息，无 model id 可挂，按「未发布 / 预告不建档」口径只进 notes。
4. **协议仅记页面明示项**：官方只说明 GPT-6 Astra 取「最高推理档」（highest reasoning setting），其余采样参数（temperature / top_p / shots / run_count 等）未印，一律 null。
5. **BenchCAD 2.0 的题目规模与判分细则未在本页披露**，只在本页按 2.0 版本号引用。

## 图片清单

`images/` 下为本页配图原图（OpenAI 官方图片资源），其中 `openai-prototype-device-enclosure-diagram.png` 与 `openai-accelerating-engineering-physical-world-social.png` 为本文正文配图，其余三张为站点侧栏推荐文章的封面图（非本文评测数据载体）。本页 BenchCAD 2.0 数值取自 DOM 散文，不依赖任何图片，故无视觉转写。
