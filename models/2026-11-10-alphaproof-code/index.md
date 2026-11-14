---
vendor: google
model: AlphaProof Code
release: alphaproof-code
date: 2026-11-10
source: https://deepmind.google/blog/introducing-alphaproof-code/
fetched_at: 2026-11-14
---

# Introducing AlphaProof Code: a breakthrough in verifying complex software at depth

> 归档说明：`page.html` 为官方发布页 `https://deepmind.google/blog/introducing-alphaproof-code/` 的原始存档（HTTP 200，deepmind.google 服务端渲染 HTML，154097 字节），抓取于 2026-11-14。页面**无 DOM 跑分表**（`<table>` 计数 0）、**无位图评测图表**、**无内嵌图表数据载荷**；正文里的量化陈述均为工程规模口径（Lean 代码行数、复核代码占比、耗时周数、注入缺陷数），**不是评测分数**。正文 5 张配图（Signal 协议示意图与流程图）已原样下载到 `images/`，页面导航与页脚图标未下载。

## 发布日证据链（两源互证）

| 来源 | 原文 | 说明 |
|---|---|---|
| 发布页 JSON-LD | `"datePublished":"2026-11-10T12:00:00+00:00"`，`"dateModified":"2026-11-12T10:29:05.587401+00:00"` | 页面 `<head>` 内 schema.org BlogPosting 节点 |
| Google DeepMind 官方 RSS | `Tue, 10 Nov 2026 12:02:28 +0000` / `Introducing AlphaProof Code: a breakthrough in verifying complex software at depth` | `https://deepmind.google/blog/rss.xml` 条目，与 JSON-LD 相差 2 分 28 秒，同一篇发布文 |

## 发布要点（转录）

- 副标题原文：「AlphaProof Code agents wrote over three million lines of machine-checked proof in Lean to verify the core cryptographic protections in Signal down to machine instructions.」
- 署名：Pushmeet Kohli、Swarat Chaudhuri。
- 系统定位（原文）：「AlphaProof Code is a multi-LLM agentic framework that splits the work of formal verification the way a research team would: human experts work with AI to decide what to prove, and a group of AI agents does it.」
- 证明模型（原文）：「From there, agents powered by Gemini Carbon did the proofs, generating over six million lines of Lean, a computer language that mathematically proves the accuracy of code.」
- 人工复核（原文）：「Next, the agents audited the proof and highlighted areas that needed a second look by a human – just one percent of the codebase, a massive time savings.」
- 验证层级（原文）：「Our agents went further, proving that the compiled code fulfills the key security properties – such as keeping messages protected before and after a device is temporarily compromised – down to the exact code running on devices.」
- 耗时（原文）：「Even at this complexity, our verification process took just four weeks – a task that historically takes expert teams years – proving that Signal's core cryptographic code delivers the security protections our experts specified.」
- 缺陷回归（原文）：「we reintroduced two real, previously fixed bugs into an isolated version of Signal's code. In both cases, the system produced a machine-checked proof that the buggy version was insecure.」
- 外部评价：Signal CTO Ehren Kret 与密码学家 Hugo Royden 各自撰文评价（页面内引用）。
- 开放性（原文）：「We are open-sourcing our formal verification artifacts for community use.」页面给出技术论文链接。

## 评测数据

> 说明：**本页没有任何基准跑分**——没有 DOM 跑分表、没有位图评测图表、没有可机读数值。页面上的数字全部是工程规模口径，**不构成评测分数**，因此本 release `benchmark_evidence` 为空、`status: "pending"`。按仓库红线「不臆造任何数值」，不为这些工程量指标建行。

### 量化陈述照录（工程规模口径，非评测分数）

| 项目 | 数值 | 备注 |
|---|---|---|
| 生成的 Lean 代码行数 | 600 万行以上 | 正文原文「over six million lines of Lean」；页面副标题另称「over three million lines of machine-checked proof」，两处口径不同，各自照录 |
| 需人工复核的代码占比 | 1% | 正文原文「just one percent of the codebase」 |
| 验证耗时 | 4 周 | 正文原文「took just four weeks」；对照「a task that historically takes expert teams years」 |
| 注入并被识破的真实缺陷 | 2 个 | 正文原文「reintroduced two real, previously fixed bugs」 |
| 被验证对象 | Signal 核心密码学实现（编译后代码级） | 页面原文 |
