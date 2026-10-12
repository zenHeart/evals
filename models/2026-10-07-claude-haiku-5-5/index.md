---
vendor: anthropic
model: Claude Haiku 5.5
release: claude-haiku-5-5
date: 2026-10-07
source: https://www.anthropic.com/claude-haiku-5-5
fetched_at: 2026-10-12
---

# Introducing Claude Haiku 5.5

发布日期来自官方页面印刷日 October 7, 2026。规格只写正文明示项：小提示（<=100k tokens）输入 $0.10、输出 $0.50、缓存读取 $0.01、缓存写入 $0.125（每百万 token）；大提示（>100k tokens）输入 $0.50、输出 $2.50、缓存读取 $0.05、缓存写入 $0.625。支持可调节 effort 思考档位。性能表收录 8 项主干基准，包括知识工作 GDPval-AA 1620、AA-Briefcase 1578，计算机使用 OSWorld 2.1 (Offline subset) 72.4%，跨学科推理 Humanity's Last Exam (无工具 45.9% / 有工具 57.4%)，智能体编码 Terminal-Bench 4.0 39.2%、FrontierCode 1.1 46.4%，以及视觉推理 Chartography 46.4%。

| 评测 | 分数 | 备注 |
|---|---|---|
| gdpval-aa | 1620 | claude-haiku-5-5；GDPval-AA v2.1；verified |
| aa-briefcase | 1578 | claude-haiku-5-5；AA-Briefcase v1.1；verified |
| osworld | 72.4% | claude-haiku-5-5；OSWorld 2.1 (Offline subset)；verified |
| hlehle | 45.9% | claude-haiku-5-5；Humanity's Last Exam (no tools)；verified |
| hlehle | 57.4% | claude-haiku-5-5；Humanity's Last Exam (with tools)；verified |
| terminalbench | 39.2% | claude-haiku-5-5；Terminal-Bench 4.0；verified |
| frontier-code | 46.4% | claude-haiku-5-5；FrontierCode 1.1 (Main)；verified |
| chartography | 46.4% | claude-haiku-5-5；Chartography (no tools)；verified |
