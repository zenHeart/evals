---
vendor: anthropic
model: Claude Sonnet 5.5
release: claude-sonnet-5-5
date: 2026-09-28
source: https://www.anthropic.com/claude-sonnet-5-5
fetched_at: 2026-10-03
---

# Introducing Claude Sonnet 5.5

发布日期来自官方页面印刷日 September 28, 2026。规格只写正文明示项：输入 $2、输出 $10、缓存读取 $0.20（每百万 token），与 Sonnet 5 同价；上下文与模态未据此页确认。性能表中的 Sonnet 5.5 取自家列，Sonnet 5、Opus 5.5、GPT-6 Sol 各列进对应行 notes。页面另有 4 张“得分对成本”曲线图（Terminal-Bench 4.0、FrontierCode、CursorBench、AA-Briefcase），图中无逐点数值，未转录。客户引述不作为公开基准分数。GDPval-AA 与 AA-Briefcase 由 Artificial Analysis 在存在结构化输出缺陷的预发布部署上测得（页面脚注 3，缺陷已修复，官方预计影响很小且可能低估）；Chartography 由 Surge AI 测得。

| 评测 | 分数 | 备注 |
|---|---|---|
| terminalbench | 70.6% | claude-sonnet-5-5；Terminal-Bench 4.0；verified |
| frontier-code | 46.2% | claude-sonnet-5-5；FrontierCode 1.1 (Main), Max；verified |
| frontier-code | 52.1% | claude-sonnet-5-5；FrontierCode 1.1 (Main), Xhigh；verified |
| cursor-bench | 55.5% | claude-sonnet-5-5；CursorBench 4.0；verified |
| gdpval-aa | 1844 | claude-sonnet-5-5；GDPval-AA v2.1；verified |
| aa-briefcase | 1811 | claude-sonnet-5-5；AA-Briefcase v1.1；verified |
| hlehle | 64.5% | claude-sonnet-5-5；Humanity's Last Exam, with tools；verified |
| osworld | 80.1% | claude-sonnet-5-5；OSWorld 2.1, partial；verified |
| chartography | 61.6% | claude-sonnet-5-5；Chartography, no tools；verified |
