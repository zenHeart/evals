# 去向快照 2026-11-14 18:08:53 北京时间 UTC+8

验收口径：gate.tsv 唯一 ID（无重复行、无翻转）。用户说的 388 与此刻 **389 accept / 75 reject** 是同一口径的当前唯一页数，不是历史重复累计。此刻比 18:03 可能多 1 个新 accept。

非重叠去向（对 389 个 last-accept）：
- 已在 origin/main 为 v2：39 页（published.tsv 这 39 个）。全站/主干 v2 总数是 **40**（另加早已上线的试点 hlehle，它不在这 389 个 accept 里）。不要把 39 当成全站 v2 总数。
- 可发待发（17:49 publisher 候选：accept + v2 out + check-one 通过 + 尚未上线）：193 页。被 MAX_BATCH=40 捆在一起，其中部分包因少数坏页的全局门禁失败而整批未推。
- 需重新验证（accept + v2 out + 未上线 + 未进入上述 ready 列表 + 也还不是 check-one FAIL 记账）：102 页。典型原因：out 晚于历史 gate，publisher 每轮只重验 3 页（STALE_PER_CYCLE=3）。
- 发布/质量失败已见（check-one FAIL，保留线上旧版）：32 页（见 incremental-publish.log）。另有整批 validate-data 点名但尚未隔离的：artificial-analysis-image-arena、beyondaime、cgbench（若它们也在 193 可发里，则仍算可发待发直到被隔离）。
- 数据缺失（accept 但无 out，保留线上旧版）：5 页：automationbench, biobasicsbench, charxiv-reasoning, cybergym, imo-answerbench。
- 成品不是 v2（accept 但 out 为 stub/无 template 或仍为 v1，不可发布，保留旧版）：18 页（17 个无 template 小文件 + swebench-pro 仍为 v1）。

验算：39+193+102+32+5+18 = 389（应为 389）。

另：finance-agent 属于曾无法恢复的 6 个之一，但 gate 为 reject，不计入 389 accept，不上线。
reject 75 一律不发布。
