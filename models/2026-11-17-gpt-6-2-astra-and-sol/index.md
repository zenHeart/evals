---
vendor: openai
model: GPT-6.2 Astra, GPT-6.2 Sol
release: Introducing GPT-6.2 Astra and Sol
date: 2026-11-17
source: https://openai.com/index/introducing-gpt-6-2-astra-sol
fetched_at: 2026-11-17
---

# Introducing GPT-6.2 Astra and Sol

发布日期 2026-11-17（取自 OpenAI 官方 RSS 的 pubDate，与发布页印刷日期一致）。同批发布 GPT-6.2 Astra（旗舰）与 GPT-6.2 Sol（日常工作首选）两个模型；API 模型名 `gpt-6.2-astra` / `gpt-6.2-sol`。

## 一、官方评测数值转写

说明：下列数值取自发布文 **RSC 载荷内联的 vega-lite `data.values`**（逐值机读，非位图读图、非 OCR），按站内既有先例（GPT-5.4 对同一机制）记为可核验行。表内「分数」为官方图表口径的原始读数；成本列一并转写，便于复核性价比口径。

### Agents' Last Exam v1.1

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| agents-last-exam（v1.1（reasoning effort Low）） | 65.77% | gpt-6-2-astra effort low |
| agents-last-exam（v1.1（reasoning effort Medium）） | 72.06% | gpt-6-2-astra effort medium |
| agents-last-exam（v1.1（reasoning effort High）） | 75.96% | gpt-6-2-astra effort high |
| agents-last-exam（v1.1（reasoning effort Xhigh）） | 78.33% | gpt-6-2-astra effort xhigh |
| agents-last-exam（v1.1（reasoning effort Max）） | 77.61% | gpt-6-2-astra effort max |
| agents-last-exam（v1.1（reasoning effort Low）） | 66.65% | gpt-6-2-sol effort low |
| agents-last-exam（v1.1（reasoning effort Medium）） | 70.26% | gpt-6-2-sol effort medium |
| agents-last-exam（v1.1（reasoning effort High）） | 72.04% | gpt-6-2-sol effort high |
| agents-last-exam（v1.1（reasoning effort Xhigh）） | 72.48% | gpt-6-2-sol effort xhigh |
| agents-last-exam（v1.1（reasoning effort Max）） | 73.04% | gpt-6-2-sol effort max |

### Terminal-Bench-Science 0.1

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| terminal-bench-science（0.1（reasoning effort Low）） | 56.3% | gpt-6-2-astra effort low |
| terminal-bench-science（0.1（reasoning effort Medium）） | 72.3% | gpt-6-2-astra effort medium |
| terminal-bench-science（0.1（reasoning effort High）） | 74.9% | gpt-6-2-astra effort high |
| terminal-bench-science（0.1（reasoning effort Xhigh）） | 74% | gpt-6-2-astra effort xhigh |
| terminal-bench-science（0.1（reasoning effort Max）） | 77.1% | gpt-6-2-astra effort max |
| terminal-bench-science（0.1（reasoning effort Low）） | 43.4% | gpt-6-2-sol effort low |
| terminal-bench-science（0.1（reasoning effort Medium）） | 63.1% | gpt-6-2-sol effort medium |
| terminal-bench-science（0.1（reasoning effort High）） | 67.7% | gpt-6-2-sol effort high |
| terminal-bench-science（0.1（reasoning effort Xhigh）） | 64.3% | gpt-6-2-sol effort xhigh |
| terminal-bench-science（0.1（reasoning effort Max）） | 68% | gpt-6-2-sol effort max |

### Artificial Analysis Intelligence Index v5.0.1

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| aa-intelligence-index（v5.0.1（reasoning effort Low）） | 45.7% | gpt-6-2-astra effort low |
| aa-intelligence-index（v5.0.1（reasoning effort Medium）） | 57% | gpt-6-2-astra effort medium |
| aa-intelligence-index（v5.0.1（reasoning effort High）） | 60.1% | gpt-6-2-astra effort high |
| aa-intelligence-index（v5.0.1（reasoning effort Xhigh）） | 61.6% | gpt-6-2-astra effort xhigh |
| aa-intelligence-index（v5.0.1（reasoning effort Max）） | 62.1% | gpt-6-2-astra effort max |
| aa-intelligence-index（v5.0.1（reasoning effort Low）） | 40.6% | gpt-6-2-sol effort low |
| aa-intelligence-index（v5.0.1（reasoning effort Medium）） | 52.7% | gpt-6-2-sol effort medium |
| aa-intelligence-index（v5.0.1（reasoning effort High）） | 54.9% | gpt-6-2-sol effort high |
| aa-intelligence-index（v5.0.1（reasoning effort Xhigh）） | 55.7% | gpt-6-2-sol effort xhigh |
| aa-intelligence-index（v5.0.1（reasoning effort Max）） | 57.3% | gpt-6-2-sol effort max |

### FrontierCode 2.0

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| frontier-code（2.0（reasoning effort Low）） | 38.1% | gpt-6-2-astra effort low |
| frontier-code（2.0（reasoning effort Medium）） | 42.2% | gpt-6-2-astra effort medium |
| frontier-code（2.0（reasoning effort High）） | 43.6% | gpt-6-2-astra effort high |
| frontier-code（2.0（reasoning effort Xhigh）） | 44.1% | gpt-6-2-astra effort xhigh |
| frontier-code（2.0（reasoning effort Max）） | 44.2% | gpt-6-2-astra effort max |
| frontier-code（2.0（reasoning effort Low）） | 33.1% | gpt-6-2-sol effort low |
| frontier-code（2.0（reasoning effort Medium）） | 38.3% | gpt-6-2-sol effort medium |
| frontier-code（2.0（reasoning effort High）） | 39.7% | gpt-6-2-sol effort high |
| frontier-code（2.0（reasoning effort Xhigh）） | 39.8% | gpt-6-2-sol effort xhigh |
| frontier-code（2.0（reasoning effort Max）） | 43.8% | gpt-6-2-sol effort max |

### LifeVal

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| lifeval（reasoning effort Low） | 46.3% | gpt-6-2-astra effort low |
| lifeval（reasoning effort Medium） | 78.9% | gpt-6-2-astra effort medium |
| lifeval（reasoning effort High） | 83.1% | gpt-6-2-astra effort high |
| lifeval（reasoning effort Xhigh） | 83.7% | gpt-6-2-astra effort xhigh |
| lifeval（reasoning effort Max） | 86.1% | gpt-6-2-astra effort max |
| lifeval（reasoning effort Low） | 25.3% | gpt-6-2-sol effort low |
| lifeval（reasoning effort Medium） | 70.3% | gpt-6-2-sol effort medium |
| lifeval（reasoning effort High） | 80.8% | gpt-6-2-sol effort high |
| lifeval（reasoning effort Xhigh） | 82.6% | gpt-6-2-sol effort xhigh |
| lifeval（reasoning effort Max） | 83.8% | gpt-6-2-sol effort max |

### Harvey-LAB-AA v1.1

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| harvey-lab（v1.1（reasoning effort Low）） | 2.2% | gpt-6-2-astra effort low |
| harvey-lab（v1.1（reasoning effort Medium）） | 8.1% | gpt-6-2-astra effort medium |
| harvey-lab（v1.1（reasoning effort High）） | 13.3% | gpt-6-2-astra effort high |
| harvey-lab（v1.1（reasoning effort Xhigh）） | 12.8% | gpt-6-2-astra effort xhigh |
| harvey-lab（v1.1（reasoning effort Max）） | 15% | gpt-6-2-astra effort max |
| harvey-lab（v1.1（reasoning effort Low）） | 3.1% | gpt-6-2-sol effort low |
| harvey-lab（v1.1（reasoning effort Medium）） | 5% | gpt-6-2-sol effort medium |
| harvey-lab（v1.1（reasoning effort High）） | 5.8% | gpt-6-2-sol effort high |
| harvey-lab（v1.1（reasoning effort Xhigh）） | 6.1% | gpt-6-2-sol effort xhigh |
| harvey-lab（v1.1（reasoning effort Max）） | 11.1% | gpt-6-2-sol effort max |

### GDPval v2 (Internal)

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| gdpval（v2 (Internal)（reasoning effort Low）） | 28.9% | gpt-6-2-astra effort low |
| gdpval（v2 (Internal)（reasoning effort Medium）） | 39.3% | gpt-6-2-astra effort medium |
| gdpval（v2 (Internal)（reasoning effort High）） | 45% | gpt-6-2-astra effort high |
| gdpval（v2 (Internal)（reasoning effort Xhigh）） | 47.8% | gpt-6-2-astra effort xhigh |
| gdpval（v2 (Internal)（reasoning effort Max）） | 50.4% | gpt-6-2-astra effort max |
| gdpval（v2 (Internal)（reasoning effort Low）） | 23.1% | gpt-6-2-sol effort low |
| gdpval（v2 (Internal)（reasoning effort Medium）） | 34.8% | gpt-6-2-sol effort medium |
| gdpval（v2 (Internal)（reasoning effort High）） | 42.7% | gpt-6-2-sol effort high |
| gdpval（v2 (Internal)（reasoning effort Xhigh）） | 45% | gpt-6-2-sol effort xhigh |
| gdpval（v2 (Internal)（reasoning effort Max）） | 46.9% | gpt-6-2-sol effort max |

### SecureSWE

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| secureswe（reasoning effort Low） | 54.5% | gpt-6-2-astra effort low |
| secureswe（reasoning effort Medium） | 57.7% | gpt-6-2-astra effort medium |
| secureswe（reasoning effort High） | 61.7% | gpt-6-2-astra effort high |
| secureswe（reasoning effort Xhigh） | 63.8% | gpt-6-2-astra effort xhigh |
| secureswe（reasoning effort Max） | 65.7% | gpt-6-2-astra effort max |
| secureswe（reasoning effort Low） | 43.1% | gpt-6-2-sol effort low |
| secureswe（reasoning effort Medium） | 47.1% | gpt-6-2-sol effort medium |
| secureswe（reasoning effort High） | 51.9% | gpt-6-2-sol effort high |
| secureswe（reasoning effort Xhigh） | 54% | gpt-6-2-sol effort xhigh |
| secureswe（reasoning effort Max） | 55.6% | gpt-6-2-sol effort max |

### Vals Science Index v1

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| vals-science-index（v1（reasoning effort Low）） | 59.5% | gpt-6-2-astra effort low |
| vals-science-index（v1（reasoning effort Medium）） | 67.6% | gpt-6-2-astra effort medium |
| vals-science-index（v1（reasoning effort High）） | 68.1% | gpt-6-2-astra effort high |
| vals-science-index（v1（reasoning effort Xhigh）） | 64.8% | gpt-6-2-astra effort xhigh |
| vals-science-index（v1（reasoning effort Max）） | 68.4% | gpt-6-2-astra effort max |
| vals-science-index（v1（reasoning effort Low）） | 46.3% | gpt-6-2-sol effort low |
| vals-science-index（v1（reasoning effort Medium）） | 56.5% | gpt-6-2-sol effort medium |
| vals-science-index（v1（reasoning effort High）） | 57.6% | gpt-6-2-sol effort high |
| vals-science-index（v1（reasoning effort Xhigh）） | 58.5% | gpt-6-2-sol effort xhigh |
| vals-science-index（v1（reasoning effort Max）） | 57.8% | gpt-6-2-sol effort max |

### BenchCAD 2.1 Core

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| benchcad（2.1 Core（reasoning effort Low）） | 0.426 | gpt-6-2-astra effort low（0–1 量纲） |
| benchcad（2.1 Core（reasoning effort Medium）） | 0.685 | gpt-6-2-astra effort medium（0–1 量纲） |
| benchcad（2.1 Core（reasoning effort High）） | 0.746 | gpt-6-2-astra effort high（0–1 量纲） |
| benchcad（2.1 Core（reasoning effort Xhigh）） | 0.776 | gpt-6-2-astra effort xhigh（0–1 量纲） |
| benchcad（2.1 Core（reasoning effort Max）） | 0.825 | gpt-6-2-astra effort max（0–1 量纲） |
| benchcad（2.1 Core（reasoning effort Low）） | 0.239 | gpt-6-2-sol effort low（0–1 量纲） |
| benchcad（2.1 Core（reasoning effort Medium）） | 0.412 | gpt-6-2-sol effort medium（0–1 量纲） |
| benchcad（2.1 Core（reasoning effort High）） | 0.64 | gpt-6-2-sol effort high（0–1 量纲） |
| benchcad（2.1 Core（reasoning effort Xhigh）） | 0.704 | gpt-6-2-sol effort xhigh（0–1 量纲） |
| benchcad（2.1 Core（reasoning effort Max）） | 0.731 | gpt-6-2-sol effort max（0–1 量纲） |

### AutomationBench 1.0.6

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| automationbench（1.0.6（reasoning effort Low）） | 37.1% | gpt-6-2-astra effort low |
| automationbench（1.0.6（reasoning effort Medium）） | 43.8% | gpt-6-2-astra effort medium |
| automationbench（1.0.6（reasoning effort High）） | 47.9% | gpt-6-2-astra effort high |
| automationbench（1.0.6（reasoning effort Xhigh）） | 47.2% | gpt-6-2-astra effort xhigh |
| automationbench（1.0.6（reasoning effort Max）） | 52.4% | gpt-6-2-astra effort max |
| automationbench（1.0.6（reasoning effort Low）） | 31.2% | gpt-6-2-sol effort low |
| automationbench（1.0.6（reasoning effort Medium）） | 40.2% | gpt-6-2-sol effort medium |
| automationbench（1.0.6（reasoning effort High）） | 41.2% | gpt-6-2-sol effort high |
| automationbench（1.0.6（reasoning effort Xhigh）） | 40.6% | gpt-6-2-sol effort xhigh |
| automationbench（1.0.6（reasoning effort Max）） | 41.1% | gpt-6-2-sol effort max |

### ExploitBench – Internal Port (June–August 2026)

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| exploitbench（Internal Port (June-August 2026)（reasoning effort Low）） | 19.5% | gpt-6-2-astra effort low |
| exploitbench（Internal Port (June-August 2026)（reasoning effort Medium）） | 46.5% | gpt-6-2-astra effort medium |
| exploitbench（Internal Port (June-August 2026)（reasoning effort High）） | 48% | gpt-6-2-astra effort high |
| exploitbench（Internal Port (June-August 2026)（reasoning effort Xhigh）） | 53% | gpt-6-2-astra effort xhigh |
| exploitbench（Internal Port (June-August 2026)（reasoning effort Max）） | 53.5% | gpt-6-2-astra effort max |
| exploitbench（Internal Port (June-August 2026)（reasoning effort Low）） | 0% | gpt-6-2-sol effort low |
| exploitbench（Internal Port (June-August 2026)（reasoning effort Medium）） | 24.5% | gpt-6-2-sol effort medium |
| exploitbench（Internal Port (June-August 2026)（reasoning effort High）） | 47% | gpt-6-2-sol effort high |
| exploitbench（Internal Port (June-August 2026)（reasoning effort Xhigh）） | 45.5% | gpt-6-2-sol effort xhigh |
| exploitbench（Internal Port (June-August 2026)（reasoning effort Max）） | 50.5% | gpt-6-2-sol effort max |

### PatchBench

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| patchbench（reasoning effort Low） | 71.1% | gpt-6-2-astra effort low |
| patchbench（reasoning effort Medium） | 75.6% | gpt-6-2-astra effort medium |
| patchbench（reasoning effort High） | 78.8% | gpt-6-2-astra effort high |
| patchbench（reasoning effort Xhigh） | 79.7% | gpt-6-2-astra effort xhigh |
| patchbench（reasoning effort Max） | 79.7% | gpt-6-2-astra effort max |
| patchbench（reasoning effort Low） | 65.6% | gpt-6-2-sol effort low |
| patchbench（reasoning effort Medium） | 70.5% | gpt-6-2-sol effort medium |
| patchbench（reasoning effort High） | 74.1% | gpt-6-2-sol effort high |
| patchbench（reasoning effort Xhigh） | 74.2% | gpt-6-2-sol effort xhigh |
| patchbench（reasoning effort Max） | 75.6% | gpt-6-2-sol effort max |

### aa-analystagent

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| aa-analystagent（all five independent attempts） | 62.5% | gpt-6-2-astra  |

## 二、未建行的官方内容

- **DeepBinary（漏洞赏金阶梯）**：图表纵轴为「累计估算赏金」、横轴为 API 成本，不是基准正确率；GPT-6.2 Astra 12 个目标的赏金/成本点、GPT-6.2 Sol 同款，均已在归档图与 `page.html` 的 vega-lite 载荷内，未建 evidence 行。
- **Blocker deception / Improper actions in workplace tasks（对齐与安全）**：属安全 / 对齐类读数（欺骗率、高危行为率，越低越好），按仓库口径不进对照，未建行；原始数值保留在 `page.html` 载荷内。
- **正文相对口径表述**：如「Terminal-Bench-Science 0.1 比 GPT-6 Astra 高 9 个百分点」「GDPval v2 比 GPT-6 Astra 高 6.2 个百分点」「Harvey LAB-AA 约为 Claude Fable 5.2 的两倍以上」「代理任务少用 62% token」等，均为相对表述，按仓库口径不建行，只在 release notes 引用。
- **脚注竞品读数**：Anthropic 报告的 Claude Fable 5.2 在 Terminal-Bench-Science 0.1 上的 74.6%（max 推理、Claude Code harness）属他方厂商口径，只写入对应行 notes，不拆独立行。
