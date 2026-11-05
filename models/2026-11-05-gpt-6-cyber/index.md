---
vendor: openai
model: GPT‑6 Cyber
release: gpt-6-cyber
date: 2026-11-05
source: https://openai.com/index/introducing-gpt-6-cyber/
fetched_at: 2026-11-06
---

# OpenAI《GPT‑6 Cyber: Advancing the frontier of aligned cybersecurity agents》——官方图表数值全量转录

发布日期证据（三源一致）：官方发布页页眉印刷「November 5, 2026」；官方新闻 RSS（`https://openai.com/news/rss.xml`）对应条目 `pubDate` 为 `Thu, 05 Nov 2026 09:00:00 GMT`、`link` 为 `https://openai.com/index/introducing-gpt-6-cyber`；官方系统卡地址 `https://deploymentsafety.openai.com/gpt-6-cyber`。

- 发布文：https://openai.com/index/introducing-gpt-6-cyber/
- 系统卡：https://deploymentsafety.openai.com/gpt-6-cyber

## 为什么数值是「机读」而不是「读图」

发布页把 6 张评测图渲染成图表组件，数值存于页面内嵌的 `vegaLiteSpec` 图表负载（DOM 内嵌 JSON）。本批 6 条 evidence 全部逐值取自这些负载，**无一条依赖位图读图**。图表标签（`analyticsIdentifier`）与负载按页面图表 DOM 顺序一一对应。

## 评测数据转录表

| benchmark | 指标（官方原文） | GPT‑6 Cyber | 同表基线列（不计入本行） |
|---|---|---:|---|
| exploitgym | Strict supplied-vulnerability pass@1 | 48.5% | GPT-6 Astra (Daybreak Blue) 42.4%、GPT-5.6 Cyber 32.1%、GPT-5.6 (Daybreak Blue) 30.3%、GPT-6 Astra (Safeguards Enabled) 0.0%。 |
| remoteexploitbench | N-Day target success | 94.7% | GPT-6 Astra (Daybreak Blue) 0.0%、GPT-6 Astra (Safeguards Enabled) 0.0%。 |
| exploitgym-honeypot | Without deployment safety prompts | 0.07% | GPT-5.6 Cyber 5.51%。 |
| exploitbench | June–August 2026 · V8 and Chrome target success | 42.0% | GPT-6 Astra (Daybreak Blue) 39.0%、GPT-5.6 (Daybreak Blue) 5.5%、GPT-6 Astra (Safeguards Enabled) 0.0%。 |
| sre-bench | All-six-objectives pass@1 | 92.8% | GPT-6 Astra (Daybreak Blue) 88.0%、GPT-6 Astra (Safeguards Enabled) 62.5%、GPT-5.6 (Daybreak Blue) 55.9%。 |
| web-pentesting | Web Blackbox score | 40.3% | GPT-6 Astra (Daybreak Blue) 32.0%、GPT-6 Astra (Safeguards Enabled) 0.0%。 |

方向：ExploitGym、RemoteExploitBench、ExploitBench、SRE-Bench、Web Pentesting 越高越好；ExploitGym Honeypot 的越界利用率越低越好。

## 官方正文原句（DOM 可见文本，逐字）

- "GPT‑6 Cyber delivers major gains on key cybersecurity benchmarks over GPT‑5.6 Cyber, including a 51% relative improvement on ExploitGym and a step function improvement when tested on staying within scope."
- "On ExploitGym, which tests whether models can exploit a specified vulnerability, GPT‑6 Cyber scores 48.5%, up from 32.1% for GPT‑5.6 Cyber."
- "On ExploitGym, which tests whether models can exploit a specified vulnerability in a remote target, GPT‑6 Cyber scores 48.5%, about 16 percentage points higher than GPT‑5.6 Cyber’s 32.1%."
- "It also follows task boundaries more reliably: in a separate alignment evaluation, GPT‑6 Cyber avoided exploiting out-of-scope services in 99.93% of tests without its deployment prompt, and 100% with this prompt."
- "GPT‑6 Cyber achieved 40.3% recall of vulnerabilities compared with 32.0% for GPT‑6 Astra."

## 口径与限制

1. 官方未印 temperature / top_p / shots / run_count / judge / 题集分母等协议细节，账本 protocol 全 12 键为 null，comparison_scope 统一 only_same_protocol。
2. 同表基线列（GPT-5.6、GPT-5.6 Cyber、GPT-6 Astra 的各配置）按仓库口径只写进各行 notes，不另建 evidence 行。
3. ExploitGym Honeypot 是「不带部署安全提示」变体（越界利用率 0.07%，基线 GPT-5.6 Cyber 5.51%）；正文另述带部署提示时 100% 守界，属不同协议变体，不与本行混读。
4. 发布文第 7 张图（Safeguard performance on sensitive red-teaming）度量防护层的标注率（Before→After：Standard 70.8%→89.7%、Daybreak Blue 13.8%→67.0%、Daybreak Red 0.0%→61.9%、Daybreak Red for Critical Infrastructure 0.0%→0.3%），不是模型自身能力分，按 GPT-Image-2.6 的 GIF Moderation Recall 先例不建 evidence 行。
5. 客户引述中的数值（Cognition 内部基准 23% vs 13%、CodeRabbit 内部基准多发现 66%、81 个 Firefox 新漏洞、948/1,724 个 Linux 内核漏洞）属客户/第三方内部评测且无公开协议，一律不建 evidence 行。
6. 全部数值为厂商自报，外部未做独立复跑。
