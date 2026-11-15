---
name: benchmark-profile-v2
description: 把 data/benchmarks/<id>.json 升级为 benchmark-profile/v2 深度档案（以 hlehle.json 为黄金样例）：先用深度搜索（web-search / web-search-prime / web-reader，必要时 curl+pdftotext 读论文原文）逐条核对权威来源，再按 v2 字段写入，每条事实带 cite，查不到写「未披露」。用户提到“升级评测档案 / v2 模板 / 深度优化评估页 / 补齐评测详情 / 重写某个 benchmark 页面”时使用。
---

# 评测档案 v2 升级（benchmark-profile-v2）

一次只做 **一个** benchmark。黄金样例：`data/benchmarks/hlehle.json`（动手前完整读一遍）。
字段约束的唯一事实源：`scripts/benchmark-profile.mjs` 的 `validateProfileV2`（头部注释有字段 → 页面区块映射）。

## 铁律（违反任何一条 = 整个档案作废）

1. **不编造**。每个数字、日期、人名、机构、比例都必须来自你本次实际打开过的来源原文。来源没写的，写「未披露」（或「论文未给出」），不要推算、不要凭记忆补。
2. **每条事实带 cite**，格式 `"<source id>"` 或 `"<source id>@<定位>"`（定位用原文的 `§3.2` / `Table 1` / `Figure 3` / `附录 B` / `README` 等真实存在的位置）。定位写错和编造同罪。
3. **证据文件**：每个 cite 至少对应一条逐字摘录（英文原文照抄，30–300 字符），写进 `$EVIDENCE_DIR/<id>.evidence.json`；摘录所在的来源原文全文存到 `$EVIDENCE_DIR/<id>/<source id>.txt`。质检脚本会把摘录与原文逐字比对，对不上即驳回。
   证据文件格式：`{"id":"<id>","quotes":[{"cite":"paper@§3.2","quote":"<原文逐字摘录>"}]}`——实体里出现的**每一个不同的 cite 字符串**都要有至少一条 cite 完全相同的摘录；摘录可用 `…` 省略中间部分，但每段都必须逐字出现在 `<source id>.txt` 中。网页原文用 web-reader/web_fetch/curl 拿到的正文**原样**存为 txt（不得改写、重排、摘要或手工整理成表格；质检会重新抓取原网页逐字比对，重排过的文本会被判为不一致）；PDF 用 pdftotext 的输出。摘录必须是原网页上真实连续出现的句子，表格行不要用 `|` 自行拼接。
4. 一手来源优先：论文（arXiv abs/HTML/PDF）、官网、官方仓库 README、官方数据集卡、官方榜单。二手博客只用于「争议/局限」，且标 kind=blog。
5. **找不到一手来源**（没有论文、没有官网/仓库能说明它是什么）→ 不要硬写；只输出 `$EVIDENCE_DIR/<id>.skip.json`：`{"id":..., "reason":"..."}`，不改实体文件。
6. 只改 `data/benchmarks/<id>.json` 这一个文件；不要改 backlog、脚本、其他实体；不要 git commit / push。

## 研究流程（深度搜索）

1. 读现有实体文件，记下已有 `official_sources`、`profile.sources`（若是 v1，复用其来源，但内容要重新核对）。
2. 用 `mcp__web-search__web_search`、`mcp__web-search-prime__web_search_prime` 搜：论文标题、arXiv 编号、官网、GitHub、HF 数据集、官方 leaderboard、已知争议（污染、标签错误、饱和）。中英文都搜。
3. 用 `mcp__web-reader__webReader` 或 `mcp__web-search__web_fetch` 打开页面；论文优先 `curl -sL https://arxiv.org/pdf/<id> -o x.pdf && pdftotext -layout x.pdf x.txt` 读全文（含表格/附录），并把文本存入证据目录。
4. 确认：发布方与核心作者、首次发布日期、题量与拆分、任务类别占比（只用原文给出的数字）、构建流程、评分协议（裁判、提示词、pass@k、工具）、指标方向、原论文基线与人类表现、版本演变、已知局限与官方回应。
5. 交叉核对：同一数字若多个来源不一致，以论文最新版为准，并在 limitations 或 versions 里如实写出不一致。

## v2 字段（写在实体顶层 + profile 内）

保持不动：`id`、`name`、`aliases`、`categories`、`status`、`related_benchmarks`（可补充已存在的 id）、`official_sources`（可补充）。
顶层（正文）：
- `full_name`：全称（含中文意译）
- `summary`（1–2 句，读者是 1–3 年前端工程师，术语首次出现要解释）、`interpretation`（高分说明什么、不说明什么）
- `measures[]`：`{area, focus, share, format, cite}`——share 只写原文给出的比例或数量，没有就写「未披露」；focus 尽量给一道真实示例题的概括
- `does_not_measure[]`：`{text, cite}`
- `dataset`：`sample_count`（数字，论文/官方给出的当前主版本题量）、`splits[]`、`languages[]`、`source_type`、`public_sample`、`totals`（一句话总结规模与题型）、`cite`、`construction[]`（`{k, text, cite}`，3–6 步）
- `default_protocol`：`{raw, cite, variants:[{text, cite}]}`——variants 写会让分数不可比的口径差异（工具/子集/pass@k/推理档位/版本）
- `metrics[]`：`{id, name, direction:"越高越好"|"越低越好", description, range, unit, cite}`；metrics[0] 是主指标
- `versions[]`：`{id, date:YYYY-MM-DD, label, cite}`（日期查不到精确日就不要列这一条）
- `limitations[]`：`{issue, impact, severity:"高"|"中"|"低", response, reader, cite}`，按影响排序；response 没有官方回应就写「未见官方回应」
- `content_status:"reviewed"`、`last_verified_at:<今天>`

`profile`：
- `template:"benchmark-profile/v2"`、`verified_at:<今天>`
- `sources[]`：`{id(kebab), kind: paper|site|repo|dataset|leaderboard|announcement|docs|blog, title, url(https), accessed:<今天>}`；每个来源都必须被引用，至少一个 paper/site/repo/dataset
- `header:{publisher:{v,cite}, first_release:{v,cite}}`
- `cites:{summary:[..], interpretation:[..]}`
- `problem:{text, cite}`：它要解决什么旧基准解决不了的问题
- `ladder[]`（≥2 级）：随机/人类基线、论文发布时最好成绩、官方榜单最高、`{"label":"本站账本当前最高","auto":"ledger-top"}`、饱和/噪声参考线；每级 `{label, value, note, cite}`，值没有就 `value:"论文未给出"`
- `misreadings[]`：`{text, cite}`，2–4 条最常见误读
- `background[]`：`{k, v, cite}`（发布方、核心作者、时间线、数据与代码位置…）
- `official_results`（可选）：`{table:{as_of, columns, rows}, cite}`——只抄来源里真实存在的表格行，列数一致
- 删除 `profile.sections`（v1 的）。

写作：中文，简洁严谨；不写「显然」「请注意」「你应该」；数字带精度（约 / 原文精确值）。

## 自检（交付前必须通过）

```bash
node /workspace/rollout/check-one.mjs data/benchmarks/<id>.json   # v2 校验 + 证据逐字比对
```
不通过就修，直到通过。最后用 3–5 行文字汇报：用了哪些来源、哪些字段是「未披露」、发现的来源矛盾。
