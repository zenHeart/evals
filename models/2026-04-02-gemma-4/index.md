---
vendor: google
model: Gemma 4 E2B
release: gemma-4
date: 2026-04-02
source: https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/
fetched_at: 2026-09-23
---

# Gemma 4: Byte for byte, the most capable open models

发布日期与四个首发变体规格来自 2026-04-02 官方公告。补充模型卡按 2026-09-23 抓取快照抽取，不能解释成首发当日评测；后增 12B Unified 不混入首发四变体。网页 Arena 第 3/6 名是排名，不是 Elo，本批不录为数值。

| 评测 | 分数 | 备注 |
|---|---|---|
| mmlu-pro | 85.2% | gemma-4-31b；MMLU Pro；verified |
| mmlu-pro | 82.6% | gemma-4-26b；MMLU Pro；verified |
| mmlu-pro | 69.4% | gemma-4-e4b；MMLU Pro；verified |
| mmlu-pro | 60.0% | gemma-4-e2b；MMLU Pro；verified |
| aime-26 | 89.2% | gemma-4-31b；AIME 2026 no tools；verified |
| aime-26 | 88.3% | gemma-4-26b；AIME 2026 no tools；verified |
| aime-26 | 42.5% | gemma-4-e4b；AIME 2026 no tools；verified |
| aime-26 | 37.5% | gemma-4-e2b；AIME 2026 no tools；verified |
| lcb | 80.0% | gemma-4-31b；LiveCodeBench v6；verified |
| lcb | 77.1% | gemma-4-26b；LiveCodeBench v6；verified |
| lcb | 52.0% | gemma-4-e4b；LiveCodeBench v6；verified |
| lcb | 44.0% | gemma-4-e2b；LiveCodeBench v6；verified |
| codeforces | 2150 | gemma-4-31b；Codeforces ELO；verified |
| codeforces | 1718 | gemma-4-26b；Codeforces ELO；verified |
| codeforces | 940 | gemma-4-e4b；Codeforces ELO；verified |
| codeforces | 633 | gemma-4-e2b；Codeforces ELO；verified |
| gpqa | 84.3% | gemma-4-31b；GPQA Diamond；verified |
| gpqa | 82.3% | gemma-4-26b；GPQA Diamond；verified |
| gpqa | 58.6% | gemma-4-e4b；GPQA Diamond；verified |
| gpqa | 43.4% | gemma-4-e2b；GPQA Diamond；verified |
| tau-bench | 76.9% | gemma-4-31b；Tau2 (average over 3)；verified |
| tau-bench | 68.2% | gemma-4-26b；Tau2 (average over 3)；verified |
| tau-bench | 42.2% | gemma-4-e4b；Tau2 (average over 3)；verified |
| tau-bench | 24.5% | gemma-4-e2b；Tau2 (average over 3)；verified |
| hlehle | 19.5% | gemma-4-31b；HLE no tools；verified |
| hlehle | 8.7% | gemma-4-26b；HLE no tools；verified |
| hlehle | 26.5% | gemma-4-31b；HLE with search；verified |
| hlehle | 17.2% | gemma-4-26b；HLE with search；verified |
| bbeh | 74.4% | gemma-4-31b；BigBench Extra Hard；verified |
| bbeh | 64.8% | gemma-4-26b；BigBench Extra Hard；verified |
| bbeh | 33.1% | gemma-4-e4b；BigBench Extra Hard；verified |
| bbeh | 21.9% | gemma-4-e2b；BigBench Extra Hard；verified |
| mmmlu | 88.4% | gemma-4-31b；MMMLU；verified |
| mmmlu | 86.3% | gemma-4-26b；MMMLU；verified |
| mmmlu | 76.6% | gemma-4-e4b；MMMLU；verified |
| mmmlu | 67.4% | gemma-4-e2b；MMMLU；verified |
| mmmu | 76.9% | gemma-4-31b；MMMU Pro；verified |
| mmmu | 73.8% | gemma-4-26b；MMMU Pro；verified |
| mmmu | 52.6% | gemma-4-e4b；MMMU Pro；verified |
| mmmu | 44.2% | gemma-4-e2b；MMMU Pro；verified |
| omnidocbench | 0.131 | gemma-4-31b；OmniDocBench 1.5 (average edit distance, lower is better)；verified |
| omnidocbench | 0.149 | gemma-4-26b；OmniDocBench 1.5 (average edit distance, lower is better)；verified |
| omnidocbench | 0.181 | gemma-4-e4b；OmniDocBench 1.5 (average edit distance, lower is better)；verified |
| omnidocbench | 0.290 | gemma-4-e2b；OmniDocBench 1.5 (average edit distance, lower is better)；verified |
| mathvision | 85.6% | gemma-4-31b；MATH-Vision；verified |
| mathvision | 82.4% | gemma-4-26b；MATH-Vision；verified |
| mathvision | 59.5% | gemma-4-e4b；MATH-Vision；verified |
| mathvision | 52.4% | gemma-4-e2b；MATH-Vision；verified |
| medxpertqa-mm | 61.3% | gemma-4-31b；MedXPertQA MM；verified |
| medxpertqa-mm | 58.1% | gemma-4-26b；MedXPertQA MM；verified |
| medxpertqa-mm | 28.7% | gemma-4-e4b；MedXPertQA MM；verified |
| medxpertqa-mm | 23.5% | gemma-4-e2b；MedXPertQA MM；verified |
| covost | 35.54 | gemma-4-e4b；CoVoST；verified |
| covost | 33.47 | gemma-4-e2b；CoVoST；verified |
| fleurs | 0.08 | gemma-4-e4b；FLEURS (lower is better)；verified |
| fleurs | 0.09 | gemma-4-e2b；FLEURS (lower is better)；verified |
| mrcr | 66.4% | gemma-4-31b；MRCR v2 8 needle 128k (average)；verified |
| mrcr | 44.1% | gemma-4-26b；MRCR v2 8 needle 128k (average)；verified |
| mrcr | 25.4% | gemma-4-e4b；MRCR v2 8 needle 128k (average)；verified |
| mrcr | 19.1% | gemma-4-e2b；MRCR v2 8 needle 128k (average)；verified |
