---
vendor: meta
model: Llama 3.1 405B / Llama 3.1 70B / Llama 3.1 8B
release: llama-3-1
date: 2024-07-23
source: https://ai.meta.com/blog/meta-Llama-3-1/
fetched_at: 2026-09-01
---

# Introducing Llama 3.1: Our most capable models to date

## 评测数据（转录）

> 来源：`images/02.png`、`images/03.png`（405B 与 8B/70B 基准表长图）、`images/04.png`（405B 人工评测胜率图）；备注含「(视觉转写)」的行转录自图片，其余来自页面文本。

### Llama 3.1 405B 基准表（images/02.png，视觉转写）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| MMLU (0-shot, CoT) | 88.6 | Llama 3.1 405B (视觉转写) |
| MMLU (0-shot, CoT) | 78.7 (non-CoT) | Nemotron 4 340B Instruct (视觉转写) |
| MMLU (0-shot, CoT) | 85.4 | GPT-4 (0125) (视觉转写) |
| MMLU (0-shot, CoT) | 88.7 | GPT-4 Omni (视觉转写) |
| MMLU (0-shot, CoT) | 88.3 | Claude 3.5 Sonnet (视觉转写) |
| MMLU PRO (5-shot, CoT) | 73.3 | Llama 3.1 405B (视觉转写) |
| MMLU PRO (5-shot, CoT) | 62.7 | Nemotron 4 340B Instruct (视觉转写) |
| MMLU PRO (5-shot, CoT) | 64.8 | GPT-4 (0125) (视觉转写) |
| MMLU PRO (5-shot, CoT) | 74.0 | GPT-4 Omni (视觉转写) |
| MMLU PRO (5-shot, CoT) | 77.0 | Claude 3.5 Sonnet (视觉转写) |
| IFEval | 88.6 | Llama 3.1 405B (视觉转写) |
| IFEval | 85.1 | Nemotron 4 340B Instruct (视觉转写) |
| IFEval | 84.3 | GPT-4 (0125) (视觉转写) |
| IFEval | 85.6 | GPT-4 Omni (视觉转写) |
| IFEval | 88.0 | Claude 3.5 Sonnet (视觉转写) |
| HumanEval (0-shot) | 89.0 | Llama 3.1 405B (视觉转写) |
| HumanEval (0-shot) | 73.2 | Nemotron 4 340B Instruct (视觉转写) |
| HumanEval (0-shot) | 86.6 | GPT-4 (0125) (视觉转写) |
| HumanEval (0-shot) | 90.2 | GPT-4 Omni (视觉转写) |
| HumanEval (0-shot) | 92.0 | Claude 3.5 Sonnet (视觉转写) |
| MBPP EvalPlus (base) (0-shot) | 88.6 | Llama 3.1 405B (视觉转写) |
| MBPP EvalPlus (base) (0-shot) | 72.8 | Nemotron 4 340B Instruct (视觉转写) |
| MBPP EvalPlus (base) (0-shot) | 83.6 | GPT-4 (0125) (视觉转写) |
| MBPP EvalPlus (base) (0-shot) | 87.8 | GPT-4 Omni (视觉转写) |
| MBPP EvalPlus (base) (0-shot) | 90.5 | Claude 3.5 Sonnet (视觉转写) |
| GSM8K (8-shot, CoT) | 96.8 | Llama 3.1 405B (视觉转写) |
| GSM8K (8-shot, CoT) | 92.3 (0-shot) | Nemotron 4 340B Instruct (视觉转写) |
| GSM8K (8-shot, CoT) | 94.2 | GPT-4 (0125) (视觉转写) |
| GSM8K (8-shot, CoT) | 96.1 | GPT-4 Omni (视觉转写) |
| GSM8K (8-shot, CoT) | 96.4 (0-shot) | Claude 3.5 Sonnet (视觉转写) |
| MATH (0-shot, CoT) | 73.8 | Llama 3.1 405B (视觉转写) |
| MATH (0-shot, CoT) | 41.1 | Nemotron 4 340B Instruct (视觉转写) |
| MATH (0-shot, CoT) | 64.5 | GPT-4 (0125) (视觉转写) |
| MATH (0-shot, CoT) | 76.6 | GPT-4 Omni (视觉转写) |
| MATH (0-shot, CoT) | 71.1 | Claude 3.5 Sonnet (视觉转写) |
| ARC Challenge (0-shot) | 96.9 | Llama 3.1 405B (视觉转写) |
| ARC Challenge (0-shot) | 94.6 | Nemotron 4 340B Instruct (视觉转写) |
| ARC Challenge (0-shot) | 96.4 | GPT-4 (0125) (视觉转写) |
| ARC Challenge (0-shot) | 96.7 | GPT-4 Omni (视觉转写) |
| ARC Challenge (0-shot) | 96.7 | Claude 3.5 Sonnet (视觉转写) |
| GPQA (0-shot, CoT) | 51.1 | Llama 3.1 405B (视觉转写) |
| GPQA (0-shot, CoT) | — | Nemotron 4 340B Instruct（图中无数据）(视觉转写) |
| GPQA (0-shot, CoT) | 41.4 | GPT-4 (0125) (视觉转写) |
| GPQA (0-shot, CoT) | 53.6 | GPT-4 Omni (视觉转写) |
| GPQA (0-shot, CoT) | 59.4 | Claude 3.5 Sonnet (视觉转写) |
| BFCL | 88.5 | Llama 3.1 405B (视觉转写) |
| BFCL | 86.5 | Nemotron 4 340B Instruct (视觉转写) |
| BFCL | 88.3 | GPT-4 (0125) (视觉转写) |
| BFCL | 80.5 | GPT-4 Omni (视觉转写) |
| BFCL | 90.2 | Claude 3.5 Sonnet (视觉转写) |
| Nexus | 58.7 | Llama 3.1 405B (视觉转写) |
| Nexus | — | Nemotron 4 340B Instruct（图中无数据）(视觉转写) |
| Nexus | 50.3 | GPT-4 (0125) (视觉转写) |
| Nexus | 56.1 | GPT-4 Omni (视觉转写) |
| Nexus | 45.7 | Claude 3.5 Sonnet (视觉转写) |
| ZeroSCROLLS/QuALITY | 95.2 | Llama 3.1 405B (视觉转写) |
| ZeroSCROLLS/QuALITY | — | Nemotron 4 340B Instruct（图中无数据）(视觉转写) |
| ZeroSCROLLS/QuALITY | 95.2 | GPT-4 (0125) (视觉转写) |
| ZeroSCROLLS/QuALITY | 90.5 | GPT-4 Omni (视觉转写) |
| ZeroSCROLLS/QuALITY | 90.5 | Claude 3.5 Sonnet (视觉转写) |
| InfiniteBench/En.MC | 83.4 | Llama 3.1 405B (视觉转写) |
| InfiniteBench/En.MC | — | Nemotron 4 340B Instruct（图中无数据）(视觉转写) |
| InfiniteBench/En.MC | 72.1 | GPT-4 (0125) (视觉转写) |
| InfiniteBench/En.MC | 82.5 | GPT-4 Omni (视觉转写) |
| InfiniteBench/En.MC | — | Claude 3.5 Sonnet（图中无数据）(视觉转写) |
| NIH/Multi-needle | 98.1 | Llama 3.1 405B (视觉转写) |
| NIH/Multi-needle | — | Nemotron 4 340B Instruct（图中无数据）(视觉转写) |
| NIH/Multi-needle | 100.0 | GPT-4 (0125) (视觉转写) |
| NIH/Multi-needle | 100.0 | GPT-4 Omni (视觉转写) |
| NIH/Multi-needle | 90.8 | Claude 3.5 Sonnet (视觉转写) |
| Multilingual MGSM (0-shot) | 91.6 | Llama 3.1 405B (视觉转写) |
| Multilingual MGSM (0-shot) | — | Nemotron 4 340B Instruct（图中无数据）(视觉转写) |
| Multilingual MGSM (0-shot) | 85.9 | GPT-4 (0125) (视觉转写) |
| Multilingual MGSM (0-shot) | 90.5 | GPT-4 Omni (视觉转写) |
| Multilingual MGSM (0-shot) | 91.6 | Claude 3.5 Sonnet (视觉转写) |

### Llama 3.1 8B / 70B 基准表（images/03.png，视觉转写）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| MMLU (0-shot, CoT) | 73.0 | Llama 3.1 8B (视觉转写) |
| MMLU (0-shot, CoT) | 72.3 (5-shot, non-CoT) | Gemma 2 9B IT (视觉转写) |
| MMLU (0-shot, CoT) | 60.5 | Mistral 7B Instruct (视觉转写) |
| MMLU (0-shot, CoT) | 86.0 | Llama 3.1 70B (视觉转写) |
| MMLU (0-shot, CoT) | 79.9 | Mixtral 8x22B Instruct (视觉转写) |
| MMLU (0-shot, CoT) | 69.8 | GPT 3.5 Turbo (视觉转写) |
| MMLU PRO (5-shot, CoT) | 48.3 | Llama 3.1 8B (视觉转写) |
| MMLU PRO (5-shot, CoT) | — | Gemma 2 9B IT（图中无数据）(视觉转写) |
| MMLU PRO (5-shot, CoT) | 36.9 | Mistral 7B Instruct (视觉转写) |
| MMLU PRO (5-shot, CoT) | 66.4 | Llama 3.1 70B (视觉转写) |
| MMLU PRO (5-shot, CoT) | 56.3 | Mixtral 8x22B Instruct (视觉转写) |
| MMLU PRO (5-shot, CoT) | 49.2 | GPT 3.5 Turbo (视觉转写) |
| IFEval | 80.4 | Llama 3.1 8B (视觉转写) |
| IFEval | 73.6 | Gemma 2 9B IT (视觉转写) |
| IFEval | 57.6 | Mistral 7B Instruct (视觉转写) |
| IFEval | 87.5 | Llama 3.1 70B (视觉转写) |
| IFEval | 72.7 | Mixtral 8x22B Instruct (视觉转写) |
| IFEval | 69.9 | GPT 3.5 Turbo (视觉转写) |
| HumanEval (0-shot) | 72.6 | Llama 3.1 8B (视觉转写) |
| HumanEval (0-shot) | 54.3 | Gemma 2 9B IT (视觉转写) |
| HumanEval (0-shot) | 40.2 | Mistral 7B Instruct (视觉转写) |
| HumanEval (0-shot) | 80.5 | Llama 3.1 70B (视觉转写) |
| HumanEval (0-shot) | 75.6 | Mixtral 8x22B Instruct (视觉转写) |
| HumanEval (0-shot) | 68.0 | GPT 3.5 Turbo (视觉转写) |
| MBPP EvalPlus (base) (0-shot) | 72.8 | Llama 3.1 8B (视觉转写) |
| MBPP EvalPlus (base) (0-shot) | 71.7 | Gemma 2 9B IT (视觉转写) |
| MBPP EvalPlus (base) (0-shot) | 49.5 | Mistral 7B Instruct (视觉转写) |
| MBPP EvalPlus (base) (0-shot) | 86.0 | Llama 3.1 70B (视觉转写) |
| MBPP EvalPlus (base) (0-shot) | 78.6 | Mixtral 8x22B Instruct (视觉转写) |
| MBPP EvalPlus (base) (0-shot) | 82.0 | GPT 3.5 Turbo (视觉转写) |
| GSM8K (8-shot, CoT) | 84.5 | Llama 3.1 8B (视觉转写) |
| GSM8K (8-shot, CoT) | 76.7 | Gemma 2 9B IT (视觉转写) |
| GSM8K (8-shot, CoT) | 53.2 | Mistral 7B Instruct (视觉转写) |
| GSM8K (8-shot, CoT) | 95.1 | Llama 3.1 70B (视觉转写) |
| GSM8K (8-shot, CoT) | 88.2 | Mixtral 8x22B Instruct (视觉转写) |
| GSM8K (8-shot, CoT) | 81.6 | GPT 3.5 Turbo (视觉转写) |
| MATH (0-shot, CoT) | 51.9 | Llama 3.1 8B (视觉转写) |
| MATH (0-shot, CoT) | 44.3 | Gemma 2 9B IT (视觉转写) |
| MATH (0-shot, CoT) | 13.0 | Mistral 7B Instruct (视觉转写) |
| MATH (0-shot, CoT) | 68.0 | Llama 3.1 70B (视觉转写) |
| MATH (0-shot, CoT) | 54.1 | Mixtral 8x22B Instruct (视觉转写) |
| MATH (0-shot, CoT) | 43.1 | GPT 3.5 Turbo (视觉转写) |
| ARC Challenge (0-shot) | 83.4 | Llama 3.1 8B (视觉转写) |
| ARC Challenge (0-shot) | 87.6 | Gemma 2 9B IT (视觉转写) |
| ARC Challenge (0-shot) | 74.2 | Mistral 7B Instruct (视觉转写) |
| ARC Challenge (0-shot) | 94.8 | Llama 3.1 70B (视觉转写) |
| ARC Challenge (0-shot) | 88.7 | Mixtral 8x22B Instruct (视觉转写) |
| ARC Challenge (0-shot) | 83.7 | GPT 3.5 Turbo (视觉转写) |
| GPQA (0-shot, CoT) | 32.8 | Llama 3.1 8B (视觉转写) |
| GPQA (0-shot, CoT) | — | Gemma 2 9B IT（图中无数据）(视觉转写) |
| GPQA (0-shot, CoT) | 28.8 | Mistral 7B Instruct (视觉转写) |
| GPQA (0-shot, CoT) | 46.7 | Llama 3.1 70B (视觉转写) |
| GPQA (0-shot, CoT) | 33.3 | Mixtral 8x22B Instruct (视觉转写) |
| GPQA (0-shot, CoT) | 30.8 | GPT 3.5 Turbo (视觉转写) |
| BFCL | 76.1 | Llama 3.1 8B (视觉转写) |
| BFCL | — | Gemma 2 9B IT（图中无数据）(视觉转写) |
| BFCL | 60.4 | Mistral 7B Instruct (视觉转写) |
| BFCL | 84.8 | Llama 3.1 70B (视觉转写) |
| BFCL | — | Mixtral 8x22B Instruct（图中无数据）(视觉转写) |
| BFCL | 85.9 | GPT 3.5 Turbo (视觉转写) |
| Nexus | 38.5 | Llama 3.1 8B (视觉转写) |
| Nexus | 30.0 | Gemma 2 9B IT (视觉转写) |
| Nexus | 24.7 | Mistral 7B Instruct (视觉转写) |
| Nexus | 56.7 | Llama 3.1 70B (视觉转写) |
| Nexus | 48.5 | Mixtral 8x22B Instruct (视觉转写) |
| Nexus | 37.2 | GPT 3.5 Turbo (视觉转写) |
| ZeroSCROLLS/QuALITY | 81.0 | Llama 3.1 8B (视觉转写) |
| ZeroSCROLLS/QuALITY | — | Gemma 2 9B IT（图中无数据）(视觉转写) |
| ZeroSCROLLS/QuALITY | — | Mistral 7B Instruct（图中无数据）(视觉转写) |
| ZeroSCROLLS/QuALITY | 90.5 | Llama 3.1 70B (视觉转写) |
| ZeroSCROLLS/QuALITY | — | Mixtral 8x22B Instruct（图中无数据）(视觉转写) |
| ZeroSCROLLS/QuALITY | — | GPT 3.5 Turbo（图中无数据）(视觉转写) |
| InfiniteBench/En.MC | 65.1 | Llama 3.1 8B (视觉转写) |
| InfiniteBench/En.MC | — | Gemma 2 9B IT（图中无数据）(视觉转写) |
| InfiniteBench/En.MC | — | Mistral 7B Instruct（图中无数据）(视觉转写) |
| InfiniteBench/En.MC | 78.2 | Llama 3.1 70B (视觉转写) |
| InfiniteBench/En.MC | — | Mixtral 8x22B Instruct（图中无数据）(视觉转写) |
| InfiniteBench/En.MC | — | GPT 3.5 Turbo（图中无数据）(视觉转写) |
| NIH/Multi-needle | 98.8 | Llama 3.1 8B (视觉转写) |
| NIH/Multi-needle | — | Gemma 2 9B IT（图中无数据）(视觉转写) |
| NIH/Multi-needle | — | Mistral 7B Instruct（图中无数据）(视觉转写) |
| NIH/Multi-needle | 97.5 | Llama 3.1 70B (视觉转写) |
| NIH/Multi-needle | — | Mixtral 8x22B Instruct（图中无数据）(视觉转写) |
| NIH/Multi-needle | — | GPT 3.5 Turbo（图中无数据）(视觉转写) |
| Multilingual MGSM (0-shot) | 68.9 | Llama 3.1 8B (视觉转写) |
| Multilingual MGSM (0-shot) | 53.2 | Gemma 2 9B IT (视觉转写) |
| Multilingual MGSM (0-shot) | 29.9 | Mistral 7B Instruct (视觉转写) |
| Multilingual MGSM (0-shot) | 86.9 | Llama 3.1 70B (视觉转写) |
| Multilingual MGSM (0-shot) | 71.1 | Mixtral 8x22B Instruct (视觉转写) |
| Multilingual MGSM (0-shot) | 51.4 | GPT 3.5 Turbo (视觉转写) |

### Llama 3.1 405B 人工评测胜率（images/04.png，视觉转写）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Human Evaluation（Win/Tie/Loss） | 23.3% / 52.2% / 24.5% | Llama 3.1 405B vs GPT-4-0125-Preview (视觉转写) |
| Human Evaluation（Win/Tie/Loss） | 19.1% / 51.7% / 29.2% | Llama 3.1 405B vs GPT-4o (视觉转写) |
| Human Evaluation（Win/Tie/Loss） | 24.9% / 50.8% / 24.2% | Llama 3.1 405B vs Claude 3.5 Sonnet (视觉转写) |

### 页面文本中的定性评测描述

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| 基准覆盖范围 | — | 页面仅定性描述："we evaluated performance on over 150 benchmark datasets that span a wide range of languages"（150+ 基准数据集，多语言） |
| 旗舰模型整体对比 | — | 页面仅定性描述："competitive with leading foundation models ... including GPT-4, GPT-4o, and Claude 3.5 Sonnet" |

## 协议脚注

- 页面快照 `page.html`：2026-09-01 抓取，方式 playwright-rendered。
- 图片原始文件在 `images/`，逐张原始 URL 与像素尺寸见 `manifest.json`。
- 本节 benchmark 数值为对官方页面/图片的视觉转写，以原文为准；无法确认的数值不转录。

## 图片清单

- images/01.png — 1920x1080 | 原URL: https://scontent-hkg1-1.xx.fbcdn.net/v/t39.2365-6/452380335_1646136526224716_2406884886...
- images/02.png — 3201x2217 | 原URL: https://scontent-hkg4-1.xx.fbcdn.net/v/t39.2365-6/451735590_1030734788570365_1093008500...
- images/03.png — 3201x2217 | 原URL: https://scontent-hkg4-1.xx.fbcdn.net/v/t39.2365-6/452673884_1646111879501055_1352920258...
- images/04.png — 3840x2040 | 原URL: https://scontent-hkg1-1.xx.fbcdn.net/v/t39.2365-6/452444647_1680516006017732_6134289479...
- images/05.png — 3840x1050 | 原URL: https://scontent-hkg4-1.xx.fbcdn.net/v/t39.2365-6/452342830_524225500031704_78074566705...
- images/06.png — 1977x1092 | 原URL: https://scontent-hkg4-1.xx.fbcdn.net/v/t39.2365-6/465245227_525650590344456_17705826983...
- images/07.png — 1920x1080 | 原URL: https://scontent-hkg1-2.xx.fbcdn.net/v/t39.2365-6/452200370_449648051376886_86408721185...
- images/08.png — 3840x2160 | 原URL: https://scontent-hkg4-1.xx.fbcdn.net/v/t39.2365-6/441887542_458900317075837_37683030193...
- images/09.png — 1600x900 | 原URL: https://scontent-hkg4-1.xx.fbcdn.net/v/t39.2365-6/439645618_745665614390489_27253504917...
