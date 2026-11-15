# Benchmark v2 rollout — progress log (Asia/Shanghai)

- 17:56 PR #65 (HLE v2) merged; deploy run 42794844924 started.

## 2026-11-10 18:05 (Asia/Shanghai) — Claude Code config on box
- ~/.claude/settings.json: StepFun env (base https://api.stepfun.com/step_plan, model step-5-preview, fable/opus/sonnet/haiku per providers.ini), apiKeyHelper ~/.claude/bin/stepfun-key.sh (sources workflow secrets; no token literal), bypassPermissions, public plugins only, no Mac hooks/statusLine, MCP_CONNECTION_NONBLOCKING=false (fixes web-search race in -p).
- ~/.claude.json mcpServers (user scope, ${VAR} refs): web-search, web-search-prime, web-reader, zread, context7, MiniMax, zai-mcp-server, github, chrome-devtools(headless), playwright(headless). Removed stale figma/macos.
- Verified by real claude -p calls: web-search ✔ web_search+web_fetch, web-search-prime ✔, web-reader ✔, zread ✔, context7 ✔, MiniMax ✔ web_search, github ✔, zai-mcp-server tools listed ✔, chrome-devtools/playwright connected ✔.

## 2026-11-10 18:12 (Asia/Shanghai) — 规范与编排
- 规范：evals/.claude/skills/benchmark-profile-v2/SKILL.md（本地提交 93e53a6，随第一批 PR 上线）；逐字证据门禁 /workspace/rollout/check-one.mjs。
- 编排：worker.sh（每槽一个 worktree，claude -p yolo，429 退避重试，质检不过 --resume 修复 ≤3 轮），integrate.sh（分支+backlog 移除+全部门禁）。
- 队列：remote-labor-index 置顶，其余按账本 verified 计数排序，共 506。试点：terminalbench。

## 2026-11-10 18:44 (Asia/Shanghai) — 试点结果，扩容到 10 并发
- gpqa：pass（1 轮，24 分钟）；独立复核 reverify.py：127 条摘录中 122 条在重新抓取的原文中逐字命中，5 条未命中均为 GitHub API 元数据 / HF 需同意条款页面（可解释）。
- terminalbench：check-one 通过（95 条摘录）；remote-labor-index 进行中。
- 无 429。扩到 10 个 worker，队列 504。
2026-11-10 18:47:51 — PR #65 deploy confirmed (run 42794844924 success 17:57; live hlehle data-profile v2 + #p-appendix). Workers w1–w10 all alive.
2026-11-10 18:57:28 — t15u/t16u：切到 worker2（精简 http MCP + 每 worker 3 个并行子代理）；旧 w1–w10 做完手头一个后自然退出（queue.txt 已清空，未杀进程）。t16u：不再提 PR，全量本地完成+全门禁后直接 push main。
2026-11-10 19:05:46 [auto] worker=pass 2/fail 0/skip 0 · gate=accept 2/reject 0 · queue 483 · slots x=4 old=10 · avail 2560MB · api-errors total 0
2026-11-10 19:19:27 — 发现 StepFun 并发上限：429「concurrency reached, current: 9, limit: 8」（同时在途请求 ≤8）。内存不再是瓶颈，瓶颈是 API 并发。停止扩容 supervisor；x5/x6 做完当前批次后退休；目标稳态 = 4 个 worker2 × 3 并行子代理 = 12 个 benchmark 代理（旧 w* 排空后可视 429 情况加到 5）。settings env 加 CLAUDE_CODE_MAX_RETRIES=30（429 自动重试）。
2026-11-10 19:26:58 [auto] worker=pass 5/fail 0/skip 0 · gate=accept 4/reject 1 · queue 477 · slots x=6 old=5 · avail 7594MB · api-errors total 0
2026-11-10 19:35:30 — 质检升级：reverify 独立重抓（arXiv PDF+abs、raw+去标签、r.jina.ai 兜底）；验收 = check-one 0 错 + 新抓命中≥10 + 未命中≤max(3,10%) + 可核验≥50%。当前 accept 5 / reject 1（swebench：site.txt 被重排成表格，摘录非原文连续句）。技能补充 80ebdd6：证据原文必须原样保存。被拒的在主队列跑完后进修复轮。
2026-11-10 19:44:21 [auto] worker=pass 6/fail 0/skip 0 · gate=accept 5/reject 1 · queue 477 · slots x=6 old=4 · avail 3945MB · api-errors total 0
2026-11-10 19:49:19 [auto] worker=pass 7/fail 0/skip 0 · gate=accept 6/reject 1 · queue 492 · slots x=1 old=3 · avail 11115MB · api-errors total 0
2026-11-10 19:49:26 — 修复关键缺陷：worker2 的 -p 主会话用 run_in_background 派子代理后即结束，子代理随进程被杀（18 个 id 跑了 3 轮都没写出实体）。已停 worker2/keeper，18 个 id + 2 个误弹 id 放回队首（证据原文保留可复用）。新 worker3.sh：CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1 + CLAUDE_CODE_MAX_RETRIES=30 + 提示词要求同步并行 Task。keeper2 保持 4 槽×3 子代理（旧 w* 排空后 5 槽）；monitor2 每 15 分钟 gate+记账，全部跑完自动 finalize（集成+全门禁+本地提交，不 push，写 READY）。队列 495。
2026-11-10 20:21:10 [auto] worker=pass 10/fail 0/skip 0 · gate=accept 9/reject 1 · queue 480 · slots x=5 old=0 · avail 8610MB · api-errors total 0
2026-11-10 20:56:39 [auto] worker=pass 10/fail 0/skip 0 · gate=accept 9/reject 1 · queue 480 · slots x=5 old=0 · avail 2607MB · api-errors total 0
2026-11-10 21:30:09 [auto] worker=pass 10/fail 0/skip 0 · gate=accept 9/reject 1 · queue 480 · slots x=5 old=0 · avail 2502MB · api-errors total 0
2026-11-10 22:00:57 [auto] worker=pass 10/fail 0/skip 0 · gate=accept 9/reject 1 · queue 480 · slots x=5 old=0 · avail 6561MB · api-errors total 0
2026-11-10 22:21:07 [auto] worker=pass 10/fail 0/skip 0 · gate=accept 9/reject 1 · queue 480 · slots x=5 old=0 · avail 6469MB · api-errors total 0
2026-11-10 22:53:07 [auto] worker=pass 25/fail 0/skip 0 · gate=accept 20/reject 2 · queue 465 · slots x=5 old=0 · avail 2578MB · api-errors total 0
2026-11-10 23:26:31 [auto] worker=pass 25/fail 0/skip 0 · gate=accept 23/reject 2 · queue 465 · slots x=5 old=0 · avail 2686MB · api-errors total 0
2026-11-10 23:58:26 [auto] worker=pass 25/fail 0/skip 0 · gate=accept 23/reject 2 · queue 465 · slots x=5 old=0 · avail 6497MB · api-errors total 0
2026-11-11 06:03:08 [auto] worker=pass 25/fail 0/skip 0 · gate=accept 23/reject 2 · queue 465 · slots x=5 old=0 · avail 6475MB · api-errors total 0
2026-11-11 06:06 — 诊断：并非卡死/429/配额/鉴权问题。box 在约 2026-11-11 00:00–05:59（+08）整体被挂起（所有进程和 monitor2 的 sleep 同时冻结，墙钟跳变；进程 etimes 仅约 3000s 而文件时间为 22:48 启动），05:59 恢复后 5 个 claude -p 及子代理（共 5 批 mmmu/deepswe/hyperlogic 等）已重新写 transcript，API 探测正常（无 429、无 quota/auth 错误，api-errors=0，内存 avail 约 6GB）。未杀任何进程、未改配置；仅补建缺失的 logs/429.ts（monitor2 报错）。各批在恢复后继续跑，完成时 out/ 才会出新实体文件；超时(5400s 单调时钟)后 worker3 会自动 --resume 修复。如 box 再次空闲被挂起会重现，需有会话保持唤醒。
2026-11-11 06:39:02 [auto] worker=pass 25/fail 0/skip 0 · gate=accept 23/reject 2 · queue 465 · slots x=5 old=0 · avail 2533MB · api-errors total 0
2026-11-11 07:18:49 [auto] worker=pass 31/fail 0/skip 0 · gate=accept 27/reject 4 · queue 459 · slots x=5 old=0 · avail 6458MB · api-errors total 0
2026-11-11 07:48:52 [auto] worker=pass 31/fail 0/skip 0 · gate=accept 27/reject 4 · queue 459 · slots x=5 old=0 · avail 2556MB · api-errors total 0
2026-11-11 08:04:27 [auto] worker=pass 31/fail 0/skip 0 · gate=accept 27/reject 4 · queue 459 · slots x=5 old=0 · avail 8540MB · api-errors total 0
2026-11-11 09:01:36 [auto] worker=pass 31/fail 0/skip 0 · gate=accept 27/reject 4 · queue 459 · slots x=5 old=0 · avail 2560MB · api-errors total 0
2026-11-11 09:25:56 [auto] worker=pass 31/fail 0/skip 0 · gate=accept 27/reject 4 · queue 459 · slots x=5 old=0 · avail 6576MB · api-errors total 0
2026-11-11 09:41:14 [auto] worker=pass 34/fail 0/skip 0 · gate=accept 30/reject 4 · queue 456 · slots x=5 old=0 · avail 6693MB · api-errors total 0
2026-11-11 10:09:11 [auto] worker=pass 37/fail 0/skip 0 · gate=accept 31/reject 6 · queue 453 · slots x=5 old=0 · avail 6728MB · api-errors total 0
2026-11-11 10:35:05 [auto] worker=pass 40/fail 0/skip 0 · gate=accept 33/reject 7 · queue 450 · slots x=5 old=0 · avail 8486MB · api-errors total 0
2026-11-11 10:51:52 [auto] worker=pass 40/fail 0/skip 0 · gate=accept 33/reject 7 · queue 450 · slots x=5 old=0 · avail 3997MB · api-errors total 0
2026-11-11 11:07:25 [auto] worker=pass 40/fail 0/skip 0 · gate=accept 33/reject 7 · queue 450 · slots x=5 old=0 · avail 10228MB · api-errors total 0
2026-11-11 11:23:14 [auto] worker=pass 43/fail 0/skip 0 · gate=accept 36/reject 7 · queue 447 · slots x=5 old=0 · avail 12063MB · api-errors total 0
2026-11-11 11:39:06 [auto] worker=pass 52/fail 0/skip 0 · gate=accept 44/reject 8 · queue 438 · slots x=5 old=0 · avail 12042MB · api-errors total 0
2026-11-11 11:54:07 [auto] worker=pass 55/fail 0/skip 0 · gate=accept 47/reject 8 · queue 435 · slots x=5 old=0 · avail 11709MB · api-errors total 0
2026-11-11 12:10:46 [auto] worker=pass 64/fail 0/skip 0 · gate=accept 52/reject 9 · queue 426 · slots x=5 old=0 · avail 11990MB · api-errors total 0
2026-11-11 12:26:52 [auto] worker=pass 70/fail 0/skip 0 · gate=accept 58/reject 9 · queue 420 · slots x=5 old=0 · avail 11204MB · api-errors total 0
2026-11-11 12:44:48 [auto] worker=pass 70/fail 0/skip 0 · gate=accept 60/reject 10 · queue 420 · slots x=5 old=0 · avail 11267MB · api-errors total 0
2026-11-11 19:22:56 [auto] worker=pass 70/fail 0/skip 0 · gate=accept 60/reject 10 · queue 420 · slots x=5 old=0 · avail 3462MB · api-errors total 0
2026-11-12 19:41:31 [auto] worker=pass 70/fail 0/skip 0 · gate=accept 60/reject 10 · queue 420 · slots x=5 old=0 · avail 2614MB · api-errors total 0
2026-11-12 20:11:30 [auto] worker=pass 70/fail 0/skip 0 · gate=accept 60/reject 10 · queue 420 · slots x=5 old=0 · avail 3299MB · api-errors total 0
2026-11-12 20:29:26 [auto] worker=pass 70/fail 0/skip 0 · gate=accept 60/reject 10 · queue 420 · slots x=5 old=0 · avail 8708MB · api-errors total 0
2026-11-12 20:45:14 [auto] worker=pass 76/fail 0/skip 0 · gate=accept 65/reject 11 · queue 414 · slots x=5 old=0 · avail 12113MB · api-errors total 0
2026-11-12 21:08:24 [auto] worker=pass 76/fail 0/skip 0 · gate=accept 65/reject 11 · queue 414 · slots x=5 old=0 · avail 2489MB · api-errors total 0
2026-11-12 21:31:10 [auto] worker=pass 76/fail 0/skip 0 · gate=accept 65/reject 11 · queue 414 · slots x=5 old=0 · avail 2589MB · api-errors total 0
2026-11-12 21:58:59 [auto] worker=pass 76/fail 0/skip 0 · gate=accept 65/reject 11 · queue 414 · slots x=5 old=0 · avail 2671MB · api-errors total 0
2026-11-12 22:26:27 [auto] worker=pass 76/fail 0/skip 0 · gate=accept 65/reject 11 · queue 414 · slots x=5 old=0 · avail 2645MB · api-errors total 0
2026-11-12 22:50:01 [auto] worker=pass 79/fail 0/skip 0 · gate=accept 68/reject 11 · queue 411 · slots x=5 old=0 · avail 4872MB · api-errors total 0
2026-11-12 23:08:33 [auto] worker=pass 79/fail 0/skip 0 · gate=accept 68/reject 11 · queue 411 · slots x=5 old=0 · avail 4544MB · api-errors total 0
2026-11-12 23:29:34 [auto] worker=pass 79/fail 0/skip 0 · gate=accept 68/reject 11 · queue 411 · slots x=5 old=0 · avail 2673MB · api-errors total 0
2026-11-12 23:48:57 [auto] worker=pass 79/fail 0/skip 0 · gate=accept 68/reject 11 · queue 411 · slots x=5 old=0 · avail 2656MB · api-errors total 0
2026-11-13 00:05:52 [auto] worker=pass 79/fail 0/skip 0 · gate=accept 68/reject 11 · queue 411 · slots x=5 old=0 · avail 6647MB · api-errors total 0
2026-11-13 00:20:53 [auto] worker=pass 79/fail 0/skip 0 · gate=accept 68/reject 11 · queue 411 · slots x=5 old=0 · avail 8909MB · api-errors total 0
2026-11-13 00:35:53 [auto] worker=pass 79/fail 0/skip 0 · gate=accept 68/reject 11 · queue 421 · slots x=5 old=0 · avail 12138MB · api-errors total 0
2026-11-13 00:51:06 [auto] worker=pass 80/fail 0/skip 0 · gate=accept 69/reject 11 · queue 420 · slots x=5 old=0 · avail 12265MB · api-errors total 0
2026-11-13 01:07:29 [auto] worker=pass 81/fail 0/skip 0 · gate=accept 70/reject 11 · queue 419 · slots x=5 old=0 · avail 2616MB · api-errors total 0
2026-11-13 01:22:42 [auto] worker=pass 82/fail 0/skip 0 · gate=accept 71/reject 11 · queue 418 · slots x=5 old=0 · avail 11011MB · api-errors total 0
2026-11-13 01:48:19 [auto] worker=pass 82/fail 0/skip 0 · gate=accept 71/reject 11 · queue 418 · slots x=5 old=0 · avail 2611MB · api-errors total 0
2026-11-13 02:16:38 [auto] worker=pass 82/fail 0/skip 0 · gate=accept 71/reject 11 · queue 418 · slots x=5 old=0 · avail 2765MB · api-errors total 0
2026-11-13 02:37:38 [auto] worker=pass 82/fail 0/skip 0 · gate=accept 71/reject 11 · queue 418 · slots x=5 old=0 · avail 8795MB · api-errors total 0
2026-11-13 03:05:47 [auto] worker=pass 82/fail 0/skip 0 · gate=accept 71/reject 11 · queue 418 · slots x=5 old=0 · avail 2183MB · api-errors total 0
2026-11-13 03:23:07 [auto] worker=pass 82/fail 0/skip 0 · gate=accept 71/reject 11 · queue 418 · slots x=5 old=0 · avail 2500MB · api-errors total 0
2026-11-13 03:49:05 [auto] worker=pass 83/fail 0/skip 0 · gate=accept 72/reject 11 · queue 417 · slots x=5 old=0 · avail 2123MB · api-errors total 0
2026-11-13 04:06:01 [auto] worker=pass 85/fail 0/skip 0 · gate=accept 73/reject 12 · queue 415 · slots x=5 old=0 · avail 10507MB · api-errors total 0
2026-11-13 04:21:26 [auto] worker=pass 87/fail 1/skip 0 · gate=accept 75/reject 12 · queue 412 · slots x=5 old=0 · avail 12291MB · api-errors total 0
2026-11-13 04:37:03 [auto] worker=pass 87/fail 1/skip 0 · gate=accept 75/reject 12 · queue 412 · slots x=5 old=0 · avail 4622MB · api-errors total 0
2026-11-13 04:57:35 [auto] worker=pass 88/fail 1/skip 0 · gate=accept 76/reject 12 · queue 411 · slots x=5 old=0 · avail 6488MB · api-errors total 0
2026-11-13 05:25:04 [auto] worker=pass 90/fail 1/skip 0 · gate=accept 77/reject 13 · queue 409 · slots x=5 old=0 · avail 2673MB · api-errors total 0
2026-11-13 05:45:00 [auto] worker=pass 91/fail 1/skip 0 · gate=accept 78/reject 13 · queue 408 · slots x=5 old=0 · avail 6660MB · api-errors total 0
2026-11-13 06:12:52 [auto] worker=pass 92/fail 1/skip 0 · gate=accept 79/reject 13 · queue 407 · slots x=5 old=0 · avail 2681MB · api-errors total 0
2026-11-13 06:28:17 [auto] worker=pass 95/fail 1/skip 0 · gate=accept 82/reject 13 · queue 404 · slots x=5 old=0 · avail 6526MB · api-errors total 0
2026-11-13 06:47:50 [auto] worker=pass 96/fail 1/skip 0 · gate=accept 83/reject 13 · queue 403 · slots x=5 old=0 · avail 2765MB · api-errors total 0
2026-11-13 07:13:03 [auto] worker=pass 97/fail 1/skip 0 · gate=accept 84/reject 13 · queue 402 · slots x=5 old=0 · avail 2685MB · api-errors total 0
2026-11-13 07:35:01 [auto] worker=pass 98/fail 1/skip 0 · gate=accept 84/reject 14 · queue 401 · slots x=5 old=0 · avail 10641MB · api-errors total 0
2026-11-13 07:56:36 [auto] worker=pass 98/fail 1/skip 0 · gate=accept 84/reject 14 · queue 401 · slots x=5 old=0 · avail 6421MB · api-errors total 0
2026-11-13 08:25:21 [auto] worker=pass 101/fail 1/skip 0 · gate=accept 85/reject 15 · queue 398 · slots x=5 old=0 · avail 2409MB · api-errors total 0
2026-11-13 08:54:46 [auto] worker=pass 101/fail 1/skip 0 · gate=accept 85/reject 16 · queue 398 · slots x=5 old=0 · avail 2686MB · api-errors total 0
2026-11-13 09:23:07 [auto] worker=pass 101/fail 1/skip 0 · gate=accept 85/reject 16 · queue 398 · slots x=5 old=0 · avail 2663MB · api-errors total 0
2026-11-13 09:41:50 [auto] worker=pass 101/fail 1/skip 0 · gate=accept 85/reject 16 · queue 398 · slots x=5 old=0 · avail 6565MB · api-errors total 0
2026-11-13 09:59:42 [auto] worker=pass 101/fail 1/skip 0 · gate=accept 85/reject 16 · queue 398 · slots x=5 old=0 · avail 6458MB · api-errors total 0
2026-11-13 10:27:17 [auto] worker=pass 101/fail 1/skip 0 · gate=accept 85/reject 16 · queue 398 · slots x=5 old=0 · avail 2637MB · api-errors total 0
2026-11-13 10:42:17 [auto] worker=pass 102/fail 1/skip 0 · gate=accept 86/reject 16 · queue 397 · slots x=5 old=0 · avail 11986MB · api-errors total 0
2026-11-13 10:59:13 [auto] worker=pass 103/fail 2/skip 0 · gate=accept 86/reject 17 · queue 395 · slots x=5 old=0 · avail 2863MB · api-errors total 0
2026-11-13 11:24:02 [auto] worker=pass 103/fail 2/skip 0 · gate=accept 86/reject 17 · queue 395 · slots x=5 old=0 · avail 6455MB · api-errors total 0
2026-11-13 11:40:12 [auto] worker=pass 105/fail 2/skip 0 · gate=accept 88/reject 17 · queue 391 · slots x=7 old=0 · avail 8420MB · api-errors total 0
2026-11-13 11:55:26 [auto] worker=pass 106/fail 2/skip 0 · gate=accept 89/reject 17 · queue 390 · slots x=7 old=0 · avail 12041MB · api-errors total 0
2026-11-13 12:17:42 [auto] worker=pass 110/fail 2/skip 0 · gate=accept 93/reject 17 · queue 386 · slots x=7 old=0 · avail 2295MB · api-errors total 0
2026-11-13 12:37:44 [auto] worker=pass 115/fail 2/skip 0 · gate=accept 96/reject 18 · queue 381 · slots x=7 old=0 · avail 4535MB · api-errors total 0
2026-11-13 13:00:12 [auto] worker=pass 118/fail 2/skip 0 · gate=accept 99/reject 19 · queue 378 · slots x=7 old=0 · avail 2629MB · api-errors total 0
2026-11-13 13:16:14 [auto] worker=pass 124/fail 2/skip 0 · gate=accept 105/reject 19 · queue 372 · slots x=7 old=0 · avail 10564MB · api-errors total 0
2026-11-13 13:23:29 [auto] worker=pass 124/fail 2/skip 0 · gate=accept 105/reject 19 · queue 372 · slots x=7 glm=1 old=0 · avail 11761MB · api-errors total 0
2026-11-13 13:39:30 [auto] worker=pass 131/fail 2/skip 0 · gate=accept 110/reject 21 · queue 361 · slots x=7 glm=4 old=0 · avail 11172MB · api-errors total 0
2026-11-13 13:54:32 [auto] worker=pass 137/fail 2/skip 0 · gate=accept 116/reject 21 · queue 355 · slots x=7 glm=4 old=0 · avail 11103MB · api-errors total 0
2026-11-13 14:09:33 [auto] worker=pass 144/fail 2/skip 0 · gate=accept 123/reject 21 · queue 348 · slots x=7 glm=4 old=0 · avail 11250MB · api-errors total 0
2026-11-13 14:24:44 [auto] worker=pass 152/fail 2/skip 0 · gate=accept 131/reject 21 · queue 340 · slots x=7 glm=4 old=0 · avail 10726MB · api-errors total 0
2026-11-13 14:39:45 [auto] worker=pass 158/fail 2/skip 0 · gate=accept 137/reject 21 · queue 334 · slots x=7 glm=4 old=0 · avail 10470MB · api-errors total 0
2026-11-13 15:25:20 [auto] worker=pass 161/fail 2/skip 0 · gate=accept 140/reject 21 · queue 335 · slots x=7 glm=0 old=0 · avail 6637MB · api-errors total 0
2026-11-13 17:01:16 [auto] worker=pass 164/fail 2/skip 0 · gate=accept 143/reject 21 · queue 332 · slots x=7 glm=0 old=0 · avail 6501MB · api-errors total 0
2026-11-13 17:16:17 [auto] worker=pass 168/fail 2/skip 0 · gate=accept 147/reject 21 · queue 328 · slots x=7 glm=0 old=0 · avail 10909MB · api-errors total 0
2026-11-13 17:31:18 [auto] worker=pass 172/fail 2/skip 0 · gate=accept 151/reject 21 · queue 324 · slots x=7 glm=0 old=0 · avail 11235MB · api-errors total 0
2026-11-13 17:46:19 [auto] worker=pass 177/fail 2/skip 0 · gate=accept 156/reject 21 · queue 319 · slots x=7 glm=0 old=0 · avail 11129MB · api-errors total 0
2026-11-13 18:01:19 [auto] worker=pass 178/fail 2/skip 0 · gate=accept 157/reject 21 · queue 318 · slots x=7 glm=0 old=0 · avail 11303MB · api-errors total 0
2026-11-13 18:35:01 [auto] worker=pass 182/fail 2/skip 0 · gate=accept 157/reject 21 · queue 309 · slots x=5 glm=0 old=0 · avail 2528MB · api-errors total 0
2026-11-13 18:50:02 [auto] worker=pass 183/fail 2/skip 0 · gate=accept 157/reject 21 · queue 306 · slots x=7 glm=0 old=0 · avail 12289MB · api-errors total 0
2026-11-13 19:05:02 [auto] worker=pass 187/fail 2/skip 0 · gate=accept 157/reject 21 · queue 302 · slots x=7 glm=0 old=0 · avail 12247MB · api-errors total 0
2026-11-13 19:20:03 [auto] worker=pass 191/fail 2/skip 0 · gate=accept 157/reject 21 · queue 298 · slots x=7 glm=0 old=0 · avail 12376MB · api-errors total 0
2026-11-13 19:35:04 [auto] worker=pass 194/fail 2/skip 0 · gate=accept 157/reject 21 · queue 295 · slots x=7 glm=0 old=0 · avail 12385MB · api-errors total 0
2026-11-13 19:50:04 [auto] worker=pass 198/fail 2/skip 0 · gate=accept 157/reject 21 · queue 291 · slots x=7 glm=0 old=0 · avail 12252MB · api-errors total 0
2026-11-13 20:05:05 [auto] worker=pass 202/fail 2/skip 0 · gate=accept 157/reject 21 · queue 287 · slots x=7 glm=0 old=0 · avail 12425MB · api-errors total 0
2026-11-13 20:20:05 [auto] worker=pass 203/fail 2/skip 0 · gate=accept 157/reject 21 · queue 286 · slots x=7 glm=0 old=0 · avail 12190MB · api-errors total 0
2026-11-13 20:35:06 [auto] worker=pass 207/fail 2/skip 0 · gate=accept 157/reject 21 · queue 282 · slots x=7 glm=0 old=0 · avail 12342MB · api-errors total 0
2026-11-13 20:50:07 [auto] worker=pass 212/fail 2/skip 0 · gate=accept 157/reject 21 · queue 277 · slots x=7 glm=0 old=0 · avail 12295MB · api-errors total 0
2026-11-13 21:05:08 [auto] worker=pass 217/fail 2/skip 0 · gate=accept 157/reject 21 · queue 272 · slots x=7 glm=0 old=0 · avail 12420MB · api-errors total 0
2026-11-13 21:20:08 [auto] worker=pass 219/fail 2/skip 0 · gate=accept 157/reject 21 · queue 270 · slots x=7 glm=0 old=0 · avail 12228MB · api-errors total 0
2026-11-13 21:35:09 [auto] worker=pass 222/fail 2/skip 0 · gate=accept 157/reject 21 · queue 267 · slots x=7 glm=0 old=0 · avail 12319MB · api-errors total 0
2026-11-13 21:50:10 [auto] worker=pass 227/fail 2/skip 0 · gate=accept 157/reject 21 · queue 262 · slots x=7 glm=0 old=0 · avail 12094MB · api-errors total 0
2026-11-13 22:05:10 [auto] worker=pass 228/fail 2/skip 0 · gate=accept 157/reject 21 · queue 261 · slots x=7 glm=0 old=0 · avail 12197MB · api-errors total 0
2026-11-13 22:20:11 [auto] worker=pass 233/fail 2/skip 0 · gate=accept 157/reject 21 · queue 256 · slots x=7 glm=0 old=0 · avail 12258MB · api-errors total 0
2026-11-13 22:35:12 [auto] worker=pass 236/fail 2/skip 0 · gate=accept 157/reject 21 · queue 253 · slots x=7 glm=0 old=0 · avail 12309MB · api-errors total 0
2026-11-13 22:50:12 [auto] worker=pass 238/fail 2/skip 1 · gate=accept 157/reject 21 · queue 250 · slots x=7 glm=0 old=0 · avail 12400MB · api-errors total 0
2026-11-13 23:05:13 [auto] worker=pass 241/fail 2/skip 1 · gate=accept 157/reject 21 · queue 247 · slots x=7 glm=0 old=0 · avail 12193MB · api-errors total 0
2026-11-13 23:20:14 [auto] worker=pass 247/fail 2/skip 1 · gate=accept 157/reject 21 · queue 241 · slots x=7 glm=0 old=0 · avail 12517MB · api-errors total 0
2026-11-13 23:35:15 [auto] worker=pass 251/fail 2/skip 1 · gate=accept 157/reject 21 · queue 237 · slots x=7 glm=0 old=0 · avail 12409MB · api-errors total 0
2026-11-13 23:50:15 [auto] worker=pass 254/fail 2/skip 1 · gate=accept 157/reject 21 · queue 234 · slots x=7 glm=0 old=0 · avail 12430MB · api-errors total 0
2026-11-14 00:05:16 [auto] worker=pass 258/fail 2/skip 1 · gate=accept 157/reject 21 · queue 230 · slots x=7 glm=0 old=0 · avail 12293MB · api-errors total 0
2026-11-14 00:20:17 [auto] worker=pass 263/fail 2/skip 1 · gate=accept 157/reject 21 · queue 225 · slots x=7 glm=0 old=0 · avail 12439MB · api-errors total 0
2026-11-14 00:35:18 [auto] worker=pass 268/fail 2/skip 2 · gate=accept 157/reject 21 · queue 219 · slots x=7 glm=0 old=0 · avail 12384MB · api-errors total 0
2026-11-14 00:50:19 [auto] worker=pass 270/fail 2/skip 2 · gate=accept 157/reject 21 · queue 217 · slots x=7 glm=0 old=0 · avail 12071MB · api-errors total 0
2026-11-14 01:05:20 [auto] worker=pass 277/fail 2/skip 2 · gate=accept 157/reject 21 · queue 210 · slots x=7 glm=0 old=0 · avail 12394MB · api-errors total 0
2026-11-14 01:20:21 [auto] worker=pass 282/fail 2/skip 2 · gate=accept 157/reject 21 · queue 205 · slots x=7 glm=0 old=0 · avail 12419MB · api-errors total 0
2026-11-14 01:35:21 [auto] worker=pass 285/fail 2/skip 2 · gate=accept 157/reject 21 · queue 202 · slots x=7 glm=0 old=0 · avail 12332MB · api-errors total 0
2026-11-14 01:50:22 [auto] worker=pass 292/fail 2/skip 3 · gate=accept 157/reject 21 · queue 194 · slots x=7 glm=0 old=0 · avail 12108MB · api-errors total 0
2026-11-14 02:05:23 [auto] worker=pass 296/fail 2/skip 3 · gate=accept 157/reject 21 · queue 190 · slots x=7 glm=0 old=0 · avail 12328MB · api-errors total 0
2026-11-14 02:20:24 [auto] worker=pass 302/fail 2/skip 3 · gate=accept 157/reject 21 · queue 184 · slots x=7 glm=0 old=0 · avail 12368MB · api-errors total 0
2026-11-14 02:35:25 [auto] worker=pass 308/fail 3/skip 3 · gate=accept 157/reject 21 · queue 177 · slots x=7 glm=0 old=0 · avail 12205MB · api-errors total 4
2026-11-14 02:50:25 [auto] worker=pass 310/fail 3/skip 3 · gate=accept 157/reject 21 · queue 175 · slots x=7 glm=0 old=0 · avail 12218MB · api-errors total 4
2026-11-14 03:05:26 [auto] worker=pass 316/fail 3/skip 3 · gate=accept 157/reject 21 · queue 169 · slots x=7 glm=0 old=0 · avail 12381MB · api-errors total 4
2026-11-14 03:20:27 [auto] worker=pass 321/fail 3/skip 3 · gate=accept 157/reject 21 · queue 164 · slots x=7 glm=0 old=0 · avail 12288MB · api-errors total 4
2026-11-14 03:35:28 [auto] worker=pass 326/fail 3/skip 3 · gate=accept 157/reject 21 · queue 159 · slots x=7 glm=0 old=0 · avail 12315MB · api-errors total 4
2026-11-14 03:50:29 [auto] worker=pass 332/fail 3/skip 3 · gate=accept 157/reject 21 · queue 153 · slots x=7 glm=0 old=0 · avail 12182MB · api-errors total 4
2026-11-14 04:05:30 [auto] worker=pass 335/fail 4/skip 3 · gate=accept 157/reject 21 · queue 149 · slots x=7 glm=0 old=0 · avail 12077MB · api-errors total 8
2026-11-14 04:20:31 [auto] worker=pass 342/fail 4/skip 3 · gate=accept 157/reject 21 · queue 142 · slots x=8 glm=0 old=0 · avail 12485MB · api-errors total 8
2026-11-14 04:35:32 [auto] worker=pass 346/fail 4/skip 4 · gate=accept 157/reject 21 · queue 137 · slots x=7 glm=0 old=0 · avail 12328MB · api-errors total 8
2026-11-14 04:50:33 [auto] worker=pass 350/fail 6/skip 7 · gate=accept 157/reject 21 · queue 128 · slots x=7 glm=0 old=0 · avail 12164MB · api-errors total 16
2026-11-14 05:05:33 [auto] worker=pass 353/fail 6/skip 7 · gate=accept 157/reject 21 · queue 125 · slots x=7 glm=0 old=0 · avail 12305MB · api-errors total 16
2026-11-14 05:20:35 [auto] worker=pass 360/fail 6/skip 7 · gate=accept 157/reject 21 · queue 118 · slots x=7 glm=0 old=0 · avail 12346MB · api-errors total 16
2026-11-14 05:35:36 [auto] worker=pass 365/fail 6/skip 7 · gate=accept 157/reject 21 · queue 113 · slots x=7 glm=0 old=0 · avail 12238MB · api-errors total 16
2026-11-14 05:50:37 [auto] worker=pass 371/fail 6/skip 7 · gate=accept 157/reject 21 · queue 107 · slots x=7 glm=0 old=0 · avail 12371MB · api-errors total 16
2026-11-14 06:05:38 [auto] worker=pass 377/fail 6/skip 7 · gate=accept 157/reject 21 · queue 101 · slots x=7 glm=0 old=0 · avail 12123MB · api-errors total 16
2026-11-14 06:20:39 [auto] worker=pass 381/fail 6/skip 7 · gate=accept 157/reject 21 · queue 97 · slots x=7 glm=0 old=0 · avail 12039MB · api-errors total 16
2026-11-14 06:35:40 [auto] worker=pass 386/fail 6/skip 7 · gate=accept 157/reject 21 · queue 92 · slots x=8 glm=0 old=0 · avail 12432MB · api-errors total 16
2026-11-14 06:50:41 [auto] worker=pass 391/fail 6/skip 7 · gate=accept 157/reject 21 · queue 87 · slots x=7 glm=0 old=0 · avail 12348MB · api-errors total 16
2026-11-14 07:05:41 [auto] worker=pass 396/fail 6/skip 7 · gate=accept 157/reject 21 · queue 82 · slots x=7 glm=0 old=0 · avail 12236MB · api-errors total 16
2026-11-14 07:20:42 [auto] worker=pass 400/fail 6/skip 9 · gate=accept 157/reject 21 · queue 76 · slots x=7 glm=0 old=0 · avail 12169MB · api-errors total 16
2026-11-14 07:35:43 [auto] worker=pass 407/fail 6/skip 9 · gate=accept 157/reject 21 · queue 69 · slots x=7 glm=0 old=0 · avail 12105MB · api-errors total 16
2026-11-14 07:50:44 [auto] worker=pass 412/fail 6/skip 10 · gate=accept 157/reject 21 · queue 63 · slots x=7 glm=0 old=0 · avail 12137MB · api-errors total 16
2026-11-14 08:05:45 [auto] worker=pass 417/fail 6/skip 10 · gate=accept 157/reject 21 · queue 58 · slots x=7 glm=0 old=0 · avail 12249MB · api-errors total 16
2026-11-14 08:20:47 [auto] worker=pass 422/fail 6/skip 10 · gate=accept 160/reject 21 · queue 53 · slots x=7 glm=0 old=0 · avail 12338MB · api-errors total 16
2026-11-14 08:35:48 [auto] worker=pass 426/fail 6/skip 10 · gate=accept 164/reject 21 · queue 49 · slots x=7 glm=0 old=0 · avail 12081MB · api-errors total 16
2026-11-14 08:50:50 [auto] worker=pass 431/fail 6/skip 11 · gate=accept 169/reject 21 · queue 43 · slots x=7 glm=0 old=0 · avail 12159MB · api-errors total 16
2026-11-14 09:05:52 [auto] worker=pass 436/fail 6/skip 11 · gate=accept 174/reject 21 · queue 38 · slots x=7 glm=0 old=0 · avail 12082MB · api-errors total 16
2026-11-14 09:20:53 [auto] worker=pass 441/fail 6/skip 12 · gate=accept 179/reject 21 · queue 32 · slots x=7 glm=0 old=0 · avail 12296MB · api-errors total 16
2026-11-14 09:35:56 [auto] worker=pass 448/fail 6/skip 12 · gate=accept 186/reject 21 · queue 25 · slots x=7 glm=0 old=0 · avail 12268MB · api-errors total 16
2026-11-14 10:34:33 [auto] worker=pass 449/fail 6/skip 12 · gate=accept 187/reject 21 · queue 24 · slots x=7 glm=0 old=0 · avail 2497MB · api-errors total 16
2026-11-14 11:57:25 [auto] worker=pass 449/fail 6/skip 12 · gate=accept 187/reject 21 · queue 24 · slots x=7 glm=0 old=0 · avail 2382MB · api-errors total 16
2026-11-14 13:09:19 [auto] worker=pass 450/fail 6/skip 12 · gate=accept 188/reject 21 · queue 23 · slots x=7 glm=0 old=0 · avail 2512MB · api-errors total 16
2026-11-14 14:35:21 [auto] worker=pass 451/fail 6/skip 12 · gate=accept 189/reject 21 · queue 22 · slots x=7 glm=0 old=0 · avail 2396MB · api-errors total 16
2026-11-14 15:37:57 [auto] worker=pass 452/fail 6/skip 12 · gate=accept 190/reject 21 · queue 21 · slots x=8 glm=0 old=0 · avail 7564MB · api-errors total 16
2026-11-14 16:28:33 [auto] worker=pass 453/fail 6/skip 12 · gate=accept 191/reject 21 · queue 20 · slots x=7 glm=0 old=0 · avail 12138MB · api-errors total 16
2026-11-14 16:43:34 [auto] worker=pass 457/fail 6/skip 12 · gate=accept 195/reject 21 · queue 16 · slots x=7 glm=0 old=0 · avail 11888MB · api-errors total 16
2026-11-14 16:59:30 [auto] worker=pass 462/fail 6/skip 12 · gate=accept 385/reject 75 · queue 11 · slots x=7 glm=0 old=0 · avail 11829MB · api-errors total 16
2026-11-14 17:00:26 [publish] gpqa -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/gpqa/
2026-11-14 17:00:26 [publish] lcb -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/lcb/
2026-11-14 17:00:26 [publish] openai-image-generation-safety -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/openai-image-generation-safety/
2026-11-14 17:00:26 [publish] slake -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/slake/
2026-11-14 17:00:26 [publish] spider -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/spider/
2026-11-14 17:00:26 [publish] spider2 -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/spider2/
2026-11-14 17:00:26 [publish] sre-bench -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/sre-bench/
2026-11-14 17:00:26 [publish] step-swe-bench -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/step-swe-bench/
2026-11-14 17:00:26 [publish] surds -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/surds/
2026-11-14 17:00:26 [publish] svg-bench -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/svg-bench/
2026-11-14 17:00:26 [publish] swe-atlas-refactoring -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/swe-atlas-refactoring/
2026-11-14 17:00:26 [publish] swe-dev -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/swe-dev/
2026-11-14 17:00:26 [publish] swe-fficiency -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/swe-fficiency/
2026-11-14 17:00:26 [publish] swebench-live -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/swebench-live/
2026-11-14 17:00:26 [publish] swebench-mm -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/swebench-mm/
2026-11-14 17:00:26 [publish] sysbench -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/sysbench/
2026-11-14 17:00:26 [publish] t-eval -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/t-eval/
2026-11-14 17:00:26 [publish] tempcompass -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/tempcompass/
2026-11-14 17:00:26 [publish] terminal-x -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/terminal-x/
2026-11-14 17:00:26 [publish] terminalbench -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/terminalbench/
2026-11-14 17:00:26 [publish] tob-agent -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/tob-agent/
2026-11-14 17:00:26 [publish] toolathlon-verified -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/toolathlon-verified/
2026-11-14 17:00:26 [publish] truthfulqa -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/truthfulqa/
2026-11-14 17:00:26 [publish] u-artifacts -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/u-artifacts/
2026-11-14 17:00:26 [publish] vibe-v2 -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/vibe-v2/
2026-11-14 17:00:26 [publish] videodr -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/videodr/
2026-11-14 17:00:26 [publish] visfactor -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/visfactor/
2026-11-14 17:00:26 [publish] visualprobe -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/visualprobe/
2026-11-14 17:00:26 [publish] vitabench -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/vitabench/
2026-11-14 17:00:26 [publish] vlmsareblind -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/vlmsareblind/
2026-11-14 17:00:26 [publish] vpct -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/vpct/
2026-11-14 17:00:26 [publish] web-pentesting -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/web-pentesting/
2026-11-14 17:00:26 [publish] webvoyager -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/webvoyager/
2026-11-14 17:00:26 [publish] webvoyager-static -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/webvoyager-static/
2026-11-14 17:00:26 [publish] wildspeech -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/wildspeech/
2026-11-14 17:00:26 [publish] winogrande -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/winogrande/
2026-11-14 17:00:26 [publish] word-task -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/word-task/
2026-11-14 17:00:26 [publish] wmt24 -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/wmt24/
2026-11-14 17:00:26 [publish] xdailybench -> 5de270c9ccec49d34f2d24bd61b8c7bcdc53a4d8 https://evals.zenheart.site/benchmarks/xdailybench/
2026-11-14 17:30:57 [auto] worker=pass 464/fail 6/skip 12 · gate=accept 388/reject 75 · queue 9 · slots x=7 glm=0 old=0 · avail 2562MB · api-errors total 16
2026-11-14 18:11:43 [auto] worker=pass 466/fail 6/skip 12 · gate=accept 390/reject 75 · queue 7 · slots x=7 glm=0 old=0 · avail 8286MB · api-errors total 16
2026-11-14 19:05:05 [auto] worker=pass 472/fail 6/skip 12 · gate=accept 396/reject 75 · queue 1 · slots x=8 glm=0 old=0 · avail 10774MB · api-errors total 16
2026-11-14 19:39:02 [publish] aa-cyber-index -> fc8a4f29d5b173a3054e06bc10b3b42218d900b1 https://evals.zenheart.site/benchmarks/aa-cyber-index/ https://github.com/zenHeart/evals/actions/runs/43590923806
2026-11-14 20:04:10 [auto] worker=pass 473/fail 6/skip 12 · gate=accept 397/reject 75 · queue 0 · slots x=7 glm=0 old=0 · avail 2807MB · api-errors total 16
2026-11-14 20:05:29 [publish] abcbench 重新验收 accept（check_err=0 quotes=57 fresh_found=57 fresh_missing=0 unverified=0 unfetch=0）
2026-11-14 21:02:33 [publish] aa-briefcase -> cfc4a3c8b0898f8b1f9d1d8ec69eb4a38501cd9b https://evals.zenheart.site/benchmarks/aa-briefcase/ https://github.com/zenHeart/evals/actions/runs/43593147043
2026-11-14 21:02:36 [publish] aime-25 重新验收 accept（check_err=0 quotes=76 fresh_found=59 fresh_missing=3 unverified=14 unfetch=2）
2026-11-14 21:04:55 [publish] aa-coding-agent-index -> 9c8c9b032a5e805282e90035e6c0dbfc88e7da36 https://evals.zenheart.site/benchmarks/aa-coding-agent-index/ https://github.com/zenHeart/evals/actions/runs/43597814725
2026-11-14 21:04:57 [publish] aime-26 重新验收 accept（check_err=0 quotes=41 fresh_found=37 fresh_missing=2 unverified=2 unfetch=2）
2026-11-14 21:06:49 [publish] aa-intelligence-index -> 6ef5cb56ac27486a2126340fa021d64951d07314 https://evals.zenheart.site/benchmarks/aa-intelligence-index/ https://github.com/zenHeart/evals/actions/runs/43598010694
2026-11-14 21:06:52 [publish] androidworld 重新验收 accept（check_err=0 quotes=50 fresh_found=50 fresh_missing=0 unverified=0 unfetch=0）
2026-11-14 21:08:36 [publish] aa-speech-to-speech -> 0976a5c0e3879c4a12c705e99af27f90d2aade8c https://evals.zenheart.site/benchmarks/aa-speech-to-speech/ https://github.com/zenHeart/evals/actions/runs/43598172605
2026-11-14 21:08:38 [publish] arabic-lid-f1 重新验收 accept（check_err=0 quotes=40 fresh_found=40 fresh_missing=0 unverified=0 unfetch=0）
2026-11-14 22:05:24 [publish] abcbench -> 5be8458586aca386652e9a8679754fdf42b12faf https://evals.zenheart.site/benchmarks/abcbench/ https://github.com/zenHeart/evals/actions/runs/43598318478
2026-11-14 22:05:27 [publish] arc-challenge 重新验收 accept（check_err=0 quotes=82 fresh_found=78 fresh_missing=4 unverified=0 unfetch=0）
2026-11-14 22:07:23 [publish] acl6060 -> c6c57034f39bc640d75706e37b6e46047e008e41 https://evals.zenheart.site/benchmarks/acl6060/ https://github.com/zenHeart/evals/actions/runs/43603104179
2026-11-14 22:07:26 [publish] arena 重新验收 accept（check_err=0 quotes=98 fresh_found=81 fresh_missing=3 unverified=14 unfetch=4）
2026-11-14 22:09:31 [publish] active-memory-eval -> bd9edf0d47fa515469cc1c8f74f619b8aca2d3c0 https://evals.zenheart.site/benchmarks/active-memory-eval/ https://github.com/zenHeart/evals/actions/runs/43603265040
2026-11-14 22:09:34 [publish] artificial-analysis-image-arena 重新验收 accept（check_err=0 quotes=43 fresh_found=43 fresh_missing=0 unverified=0 unfetch=0）
2026-11-14 22:10:14 [auto] worker=pass 475/fail 6/skip 12 · gate=accept 399/reject 75 · queue 0 · slots x=5 glm=0 old=0 · avail 6609MB · api-errors total 16
2026-11-14 22:11:36 [publish] ade-bench -> 22f64d6002907abf80dfc9d3649bb164621a2659 https://evals.zenheart.site/benchmarks/ade-bench/ https://github.com/zenHeart/evals/actions/runs/43603461175
2026-11-14 22:11:39 [publish] bankertoolbench 重新验收 accept（check_err=0 quotes=80 fresh_found=80 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 00:04:23 [auto] worker=pass 477/fail 6/skip 12 · gate=accept 401/reject 75 · queue 0 · slots x=3 glm=0 old=0 · avail 12546MB · api-errors total 16
2026-11-15 01:02:20 [publish] abcbench 隔离（连续 3 次发布未成功（详见 logs/incremental-publish.log）），保留线上现版，待 out 更新后自动解禁
2026-11-15 01:02:22 [publish] bbh 重新验收 accept（check_err=0 quotes=134 fresh_found=127 fresh_missing=0 unverified=7 unfetch=2）
2026-11-15 01:04:13 [publish] agentbench -> 48b75b5a617442ba9be04b9fcab70649f1eaf1f9 https://evals.zenheart.site/benchmarks/agentbench/ https://github.com/zenHeart/evals/actions/runs/43618938461
2026-11-15 01:04:14 [publish] beyondaime 重新验收 accept（check_err=0 quotes=27 fresh_found=27 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 01:05:46 [publish] ai-office-bench -> 2b0591ff3b1ecea7a580292a60ee1b4a582fe980 https://evals.zenheart.site/benchmarks/ai-office-bench/ https://github.com/zenHeart/evals/actions/runs/43619117997
2026-11-15 01:05:47 [publish] big-finance-bench 重新验收 accept（check_err=0 quotes=110 fresh_found=106 fresh_missing=4 unverified=0 unfetch=0）
2026-11-15 01:07:46 [publish] ai2d -> 85ee1c42badae6c1c61fd6b0304f4cfa04118b87 https://evals.zenheart.site/benchmarks/ai2d/ https://github.com/zenHeart/evals/actions/runs/43619276449
2026-11-15 01:08:05 [publish] bixbench 重新验收 accept（check_err=0 quotes=82 fresh_found=82 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 02:03:35 [auto] worker=pass 477/fail 6/skip 12 · gate=accept 401/reject 75 · queue 0 · slots x=3 glm=0 old=0 · avail 5216MB · api-errors total 16
2026-11-15 03:06:13 [publish] browsecomp-zh 重新验收 accept（check_err=0 quotes=108 fresh_found=91 fresh_missing=6 unverified=3 unfetch=1）
2026-11-15 03:07:55 [publish] aime-26 -> 09920f3e5b50a4276202a4f747ba2ba79c6d5631 https://evals.zenheart.site/benchmarks/aime-26/ https://github.com/zenHeart/evals/actions/runs/43630302419
2026-11-15 03:07:57 [publish] cgbench 重新验收 accept（check_err=0 quotes=90 fresh_found=90 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 03:09:46 [publish] airs-bench -> 1b084fb87d8709ec84be14dac35123020007afaa https://evals.zenheart.site/benchmarks/airs-bench/ https://github.com/zenHeart/evals/actions/runs/43630456065
2026-11-15 03:09:48 [publish] chartography 重新验收 accept（check_err=0 quotes=158 fresh_found=148 fresh_missing=0 unverified=10 unfetch=1）
2026-11-15 03:10:39 [auto] worker=pass 479/fail 6/skip 12 · gate=accept 403/reject 75 · queue 0 · slots x=1 glm=0 old=0 · avail 4567MB · api-errors total 16
2026-11-15 04:03:12 [publish] alignbench -> c1fc01bb0152582c7c34586959bc5a3dd8b0949d https://evals.zenheart.site/benchmarks/alignbench/ https://github.com/zenHeart/evals/actions/runs/43630638549
2026-11-15 04:03:13 [publish] chartqa 重新验收 accept（check_err=0 quotes=55 fresh_found=55 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 04:05:05 [publish] alpacaeval -> 683a08fe02c63d6b5bc03db029ad0042ed3db5ab https://evals.zenheart.site/benchmarks/alpacaeval/ https://github.com/zenHeart/evals/actions/runs/43635452152
2026-11-15 04:05:07 [publish] aa-lcr 重新验收 accept（check_err=0 quotes=88 fresh_found=87 fresh_missing=1 unverified=0 unfetch=0）
2026-11-15 04:06:47 [publish] amo-bench -> cb186f62ad3563d9fc1fa4eb41576ed73daa2fc5 https://evals.zenheart.site/benchmarks/amo-bench/ https://github.com/zenHeart/evals/actions/runs/43635629774
2026-11-15 04:06:48 [publish] aime24 重新验收 accept（check_err=0 quotes=107 fresh_found=93 fresh_missing=0 unverified=8 unfetch=3）
2026-11-15 04:08:29 [publish] aa-lcr -> 7fad41a674d751afb0e500332a02f0af6e763572 https://evals.zenheart.site/benchmarks/aa-lcr/ https://github.com/zenHeart/evals/actions/runs/43635784401
2026-11-15 04:08:31 [publish] appcif-bench 重新验收 accept（check_err=0 quotes=67 fresh_found=59 fresh_missing=1 unverified=7 unfetch=1）
2026-11-15 04:10:46 [publish] aime24 -> 95da90d5886ccfbcdf435a71bac08e38a329cc31 https://evals.zenheart.site/benchmarks/aime24/ https://github.com/zenHeart/evals/actions/runs/43635936507
2026-11-15 04:10:47 [publish] arc-agi 重新验收 accept（check_err=0 quotes=127 fresh_found=114 fresh_missing=7 unverified=6 unfetch=1）
2026-11-15 05:01:39 [publish] androidworld -> 492b13a4d6e3ecba1b1f6b12daadf1db7e01ab13 https://evals.zenheart.site/benchmarks/androidworld/ https://github.com/zenHeart/evals/actions/runs/43640457901
2026-11-15 05:01:42 [publish] benchcad 重新验收 accept（check_err=0 quotes=119 fresh_found=105 fresh_missing=11 unverified=3 unfetch=1）
2026-11-15 05:03:36 [publish] anthropic-behavioral-audit -> 300a39c029097ee82a52b6aa921457ad1186c375 https://evals.zenheart.site/benchmarks/anthropic-behavioral-audit/ https://github.com/zenHeart/evals/actions/runs/43640645543
2026-11-15 05:03:37 [publish] ceval 重新验收 accept（check_err=0 quotes=96 fresh_found=88 fresh_missing=3 unverified=4 unfetch=1）
2026-11-15 05:05:05 [publish] anthropic-life-sciences-internal -> 75a2821e47c7ee11a0ae41c6d5eca1bbc1d11a45 https://evals.zenheart.site/benchmarks/anthropic-life-sciences-internal/ https://github.com/zenHeart/evals/actions/runs/43640816189
2026-11-15 05:05:07 [publish] charxiv-descriptive 重新验收 accept（check_err=0 quotes=115 fresh_found=115 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 05:06:34 [auto] worker=pass 479/fail 6/skip 12 · gate=accept 403/reject 75 · queue 0 · slots x=1 glm=0 old=0 · avail 7187MB · api-errors total 16
2026-11-15 05:06:56 [publish] anthropic-structural-biology -> 4e53ca4fb58c839c37d277aeed857c6f7465c597 https://evals.zenheart.site/benchmarks/anthropic-structural-biology/ https://github.com/zenHeart/evals/actions/runs/43640956411
2026-11-15 05:06:58 [publish] chinese-simpleqa 重新验收 accept（check_err=0 quotes=53 fresh_found=53 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 06:05:49 [publish] apex-shortlist -> 5fb47ba4330b92cdccfc1cb14f90c24f161a72aa https://evals.zenheart.site/benchmarks/apex-shortlist/ https://github.com/zenHeart/evals/actions/runs/43646122914
2026-11-15 06:05:50 [publish] cl-bench 重新验收 accept（check_err=0 quotes=78 fresh_found=75 fresh_missing=0 unverified=3 unfetch=1）
2026-11-15 06:07:40 [publish] apex-swe -> 88f566e46f980f712884c004391c79cab80f891a https://evals.zenheart.site/benchmarks/apex-swe/ https://github.com/zenHeart/evals/actions/runs/43646310080
2026-11-15 06:07:41 [publish] claw-eval 重新验收 accept（check_err=0 quotes=137 fresh_found=127 fresh_missing=0 unverified=3 unfetch=1）
2026-11-15 06:09:30 [publish] appcif-bench -> 3a1f846bc7b34d6e2d5acd2fc6d57cfcb0ddf226 https://evals.zenheart.site/benchmarks/appcif-bench/ https://github.com/zenHeart/evals/actions/runs/43646475676
2026-11-15 06:09:31 [publish] cmmlu 重新验收 accept（check_err=0 quotes=116 fresh_found=112 fresh_missing=4 unverified=0 unfetch=0）
2026-11-15 06:11:09 [publish] apps -> aca2bd1692c2b741b242ca95f8eb42202deac402 https://evals.zenheart.site/benchmarks/apps/ https://github.com/zenHeart/evals/actions/runs/43646637573
2026-11-15 06:11:10 [publish] coco 重新验收 accept（check_err=0 quotes=130 fresh_found=126 fresh_missing=4 unverified=0 unfetch=0）
2026-11-15 07:02:14 [publish] arabic-asr-cer -> 90a362abbab59c981ca1346cd1ca956981b1841c https://evals.zenheart.site/benchmarks/arabic-asr-cer/ https://github.com/zenHeart/evals/actions/runs/43646838602
2026-11-15 07:02:18 [publish] codeforces 重新验收 accept（check_err=0 quotes=97 fresh_found=93 fresh_missing=3 unverified=1 unfetch=1）
2026-11-15 07:04:10 [publish] arabic-lid-f1 -> c2fd8c9fbc23cae45e687271b4537a679fc028a6 https://evals.zenheart.site/benchmarks/arabic-lid-f1/ https://github.com/zenHeart/evals/actions/runs/43651225416
2026-11-15 07:04:11 [publish] compassrank 重新验收 accept（check_err=0 quotes=39 fresh_found=39 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 07:06:00 [publish] arc-agi -> 12540ebe6dc41500cbac5db59b201c88d8f09752 https://evals.zenheart.site/benchmarks/arc-agi/ https://github.com/zenHeart/evals/actions/runs/43651385500
2026-11-15 07:06:02 [publish] countqa 重新验收 accept（check_err=0 quotes=42 fresh_found=42 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 07:07:48 [auto] worker=pass 479/fail 6/skip 12 · gate=accept 403/reject 75 · queue 0 · slots x=1 glm=0 old=0 · avail 5153MB · api-errors total 16
2026-11-15 07:08:05 [publish] arc-challenge -> a63ca5961d7ceaf66a949e4372b357ad59882cf1 https://evals.zenheart.site/benchmarks/arc-challenge/ https://github.com/zenHeart/evals/actions/runs/43651551812
2026-11-15 07:08:06 [publish] coworkbench 重新验收 accept（check_err=0 quotes=27 fresh_found=27 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 07:58:57 [publish] critpt 重新验收 accept（check_err=0 quotes=133 fresh_found=102 fresh_missing=3 unverified=22 unfetch=3）
2026-11-15 08:00:53 [publish] artificial-analysis-image-arena -> 55ca13c4e80a28ece004da0c5a070ddff9482d76 https://evals.zenheart.site/benchmarks/artificial-analysis-image-arena/ https://github.com/zenHeart/evals/actions/runs/43655941342
2026-11-15 08:00:55 [publish] cruxeval 重新验收 accept（check_err=0 quotes=56 fresh_found=56 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 08:01:39 [auto] worker=pass 480/fail 6/skip 12 · gate=accept 404/reject 75 · queue 0 · slots x=0 glm=0 old=0 · avail 3233MB · api-errors total 16
2026-11-15 08:01:39 [auto] ALL WORKERS DONE → finalize
2026-11-15 08:01:40 finalize: gate accept=404 reject=75（历史累计，不等于可发布；能否上线由发布器按 out+v2+check-one 逐页判定）
2026-11-15 08:01:40 finalize: 等发布器排空中（state=running 0s）
2026-11-15 09:06:57 finalize: 等发布器排空中（state=running 300s）
2026-11-15 09:11:57 finalize: 等发布器排空中（state=running 600s）
2026-11-15 10:10:42 finalize: 等发布器排空中（state=running 900s）
2026-11-15 11:02:16 finalize: 等发布器排空中（state=running 1200s）
2026-11-15 11:07:16 finalize: 等发布器排空中（state=running 1500s）
2026-11-15 11:20:46 finalize: 等发布器排空中（state=running 1800s）
2026-11-15 11:23:01 [publish] deepsearchqa 重新验收 accept（check_err=0 quotes=65 fresh_found=63 fresh_missing=2 unverified=0 unfetch=0）
2026-11-15 11:24:41 [publish] arxivmath -> 3484adf9fc5433b4ce859ac1dac06cba7ada7713 https://evals.zenheart.site/benchmarks/arxivmath/ https://github.com/zenHeart/evals/actions/runs/43672154686
2026-11-15 11:24:42 [publish] deepswe 重新验收 accept（check_err=0 quotes=127 fresh_found=124 fresh_missing=3 unverified=0 unfetch=0）
2026-11-15 11:25:46 finalize: 等发布器排空中（state=running 2100s）
2026-11-15 11:26:35 [publish] autologi -> 128fb870b994d3e60f802d88e6d1416adf3ffde9 https://evals.zenheart.site/benchmarks/autologi/ https://github.com/zenHeart/evals/actions/runs/43672284429
2026-11-15 11:26:36 [publish] dense200 重新验收 accept（check_err=0 quotes=38 fresh_found=30 fresh_missing=0 unverified=8 unfetch=3）
2026-11-15 11:30:46 finalize: 等发布器排空中（state=running 2400s）
2026-11-15 12:02:44 [publish] avmeme -> 673ad29ae814e75dc2cc9a4a852972f6db931a83 https://evals.zenheart.site/benchmarks/avmeme/ https://github.com/zenHeart/evals/actions/runs/43672431713
2026-11-15 12:02:45 [publish] docvqa 重新验收 accept（check_err=0 quotes=83 fresh_found=83 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 12:04:40 [publish] babe -> e9f51412217fd45f412afd70ad9e677e92a614d7 https://evals.zenheart.site/benchmarks/babe/ https://github.com/zenHeart/evals/actions/runs/43675060762
2026-11-15 12:04:41 [publish] draco 重新验收 accept（check_err=0 quotes=52 fresh_found=52 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 12:06:33 finalize: 等发布器排空中（state=running 2700s）
2026-11-15 12:06:47 [publish] bankertoolbench -> c5528c1d33a82de525fbbf3f954e5e5891cdd9e2 https://evals.zenheart.site/benchmarks/bankertoolbench/ https://github.com/zenHeart/evals/actions/runs/43675204403
2026-11-15 12:06:48 [publish] drop 重新验收 accept（check_err=0 quotes=50 fresh_found=46 fresh_missing=1 unverified=3 unfetch=1）
2026-11-15 12:08:42 [publish] bbh -> 0c276eb1f2747a696687d507970367dbd3d4f028 https://evals.zenheart.site/benchmarks/bbh/ https://github.com/zenHeart/evals/actions/runs/43675362805
2026-11-15 12:08:43 [publish] economically-important-tasks 重新验收 accept（check_err=0 quotes=27 fresh_found=27 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 12:10:17 [publish] benchcad -> 3cf89a93e9742ec268f091ebb496a66aebc34911 https://evals.zenheart.site/benchmarks/benchcad/ https://github.com/zenHeart/evals/actions/runs/43675499077
2026-11-15 12:10:18 [publish] egoschema 重新验收 accept（check_err=0 quotes=102 fresh_found=102 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 13:03:49 finalize: 等发布器排空中（state=running 3000s）
2026-11-15 13:04:38 [publish] beyondaime -> 856f92c42667a275b278cffc24eedc546319ed48 https://evals.zenheart.site/benchmarks/beyondaime/ https://github.com/zenHeart/evals/actions/runs/43679401418
2026-11-15 13:04:40 [publish] egotempo 重新验收 accept（check_err=0 quotes=59 fresh_found=59 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 13:06:29 [publish] big-finance-bench -> 39a9d5f8bcfdd30cd87801cc8822d16e7a43b19f https://evals.zenheart.site/benchmarks/big-finance-bench/ https://github.com/zenHeart/evals/actions/runs/43679545054
2026-11-15 13:06:30 [publish] emma 重新验收 accept（check_err=0 quotes=70 fresh_found=70 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 13:08:36 [publish] bigbench-audio -> 5833ace6411265ff5f4e9cbbd24546f33ef892ba https://evals.zenheart.site/benchmarks/bigbench-audio/ https://github.com/zenHeart/evals/actions/runs/43679679510
2026-11-15 13:08:37 [publish] erqa 重新验收 accept（check_err=0 quotes=36 fresh_found=34 fresh_missing=2 unverified=0 unfetch=0）
2026-11-15 13:08:49 finalize: 等发布器排空中（state=running 3300s）
2026-11-15 14:04:46 [publish] bigcodebench -> 847bb76d6cba53fe6c9a61095bdee915a006bb96 https://evals.zenheart.site/benchmarks/bigcodebench/ https://github.com/zenHeart/evals/actions/runs/43679827110
2026-11-15 14:04:48 [publish] evalplus 重新验收 accept（check_err=0 quotes=73 fresh_found=73 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 14:06:40 [publish] biglaw-bench -> abb419c70873a5a4b624305d8889f3c33fc31c45 https://evals.zenheart.site/benchmarks/biglaw-bench/ https://github.com/zenHeart/evals/actions/runs/43683857400
2026-11-15 14:06:42 [publish] expert-swe 重新验收 accept（check_err=0 quotes=13 fresh_found=13 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 14:08:03 finalize: 等发布器排空中（state=running 3600s）
2026-11-15 14:08:33 [publish] bio-design-tools -> 5db780c5bc1adccac8ea39eb80ffa7633e14ef30 https://evals.zenheart.site/benchmarks/bio-design-tools/ https://github.com/zenHeart/evals/actions/runs/43683992652
2026-11-15 14:08:34 [publish] factscore 重新验收 accept（check_err=0 quotes=94 fresh_found=87 fresh_missing=2 unverified=5 unfetch=1）
2026-11-15 14:10:36 [publish] biobench -> 977eb2911d9d3204e277819a762d12aefe62c5b0 https://evals.zenheart.site/benchmarks/biobench/ https://github.com/zenHeart/evals/actions/runs/43684128208
2026-11-15 14:10:37 [publish] finsearchcomp 重新验收 accept（check_err=0 quotes=90 fresh_found=89 fresh_missing=1 unverified=0 unfetch=0）
2026-11-15 14:37:53 [publish] bixbench -> 7be272987a5e1f47085f5bc60ce1b215bc539e96 https://evals.zenheart.site/benchmarks/bixbench/ https://github.com/zenHeart/evals/actions/runs/43684286597
2026-11-15 14:37:55 [publish] fleurs 重新验收 accept（check_err=0 quotes=83 fresh_found=78 fresh_missing=5 unverified=0 unfetch=0）
2026-11-15 14:38:07 finalize: 等发布器排空中（state=running 3900s）
2026-11-15 15:00:51 [publish] blink -> 1c8440cc0f8ddede31aaa7e2e3cb63fc99f3018e https://evals.zenheart.site/benchmarks/blink/ https://github.com/zenHeart/evals/actions/runs/43686370109
2026-11-15 15:00:53 [publish] frontier-science-olympiad 重新验收 accept（check_err=0 quotes=37 fresh_found=37 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 15:02:38 [publish] brokenarxiv -> 2999fd775e2b6652b0c7aae473789a60e881fddc https://evals.zenheart.site/benchmarks/brokenarxiv/ https://github.com/zenHeart/evals/actions/runs/43688060919
2026-11-15 15:02:38 finalize: 等发布器排空中（state=running 4200s）
2026-11-15 15:02:40 [publish] frontier-science-research 重新验收 accept（check_err=0 quotes=68 fresh_found=56 fresh_missing=0 unverified=12 unfetch=1）
2026-11-15 15:04:35 [publish] browsecomp-zh -> 73e3015cd46ae34c154c4e28ebd19314c03e6177 https://evals.zenheart.site/benchmarks/browsecomp-zh/ https://github.com/zenHeart/evals/actions/runs/43688197413
2026-11-15 15:04:37 [publish] frontiermath 重新验收 accept（check_err=0 quotes=44 fresh_found=44 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 15:06:28 [publish] c3-bench -> 047fa1860ce94901bad6d32c17c124c5fa0432cf https://evals.zenheart.site/benchmarks/c3-bench/ https://github.com/zenHeart/evals/actions/runs/43688344145
2026-11-15 15:06:29 [publish] gaia 重新验收 accept（check_err=0 quotes=69 fresh_found=69 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 16:06:47 finalize: 等发布器排空中（state=running 4500s）
2026-11-15 16:06:48 [publish] cc-bench -> ddef1578456547f1844e57f2040f35d07cf2b931 https://evals.zenheart.site/benchmarks/cc-bench/ https://github.com/zenHeart/evals/actions/runs/43688487480
2026-11-15 16:06:50 [publish] gdp-pdf 重新验收 accept（check_err=0 quotes=96 fresh_found=96 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 16:08:43 [publish] cc-ocr-bench-v2 -> da469c20a02a5894eb4b20ff74737afa5bc30a1c https://evals.zenheart.site/benchmarks/cc-ocr-bench-v2/ https://github.com/zenHeart/evals/actions/runs/43693027537
2026-11-15 16:08:45 [publish] gdpval-aa 重新验收 accept（check_err=0 quotes=98 fresh_found=98 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 16:10:26 [publish] ceval -> 102b6592ef4d1348613c309f1410d543e4b47087 https://evals.zenheart.site/benchmarks/ceval/ https://github.com/zenHeart/evals/actions/runs/43693168621
2026-11-15 16:10:28 [publish] global-piqa 重新验收 accept（check_err=0 quotes=51 fresh_found=51 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 16:11:47 finalize: 等发布器排空中（state=running 4800s）
2026-11-15 16:12:20 [publish] cfbench -> 26c061909f03fef4e6f2ed66e956879ced829b25 https://evals.zenheart.site/benchmarks/cfbench/ https://github.com/zenHeart/evals/actions/runs/43693303204
2026-11-15 16:12:22 [publish] gsm8k 重新验收 accept（check_err=0 quotes=92 fresh_found=74 fresh_missing=5 unverified=0 unfetch=0）
2026-11-15 16:13:10 [taskS] 诊断：queue2.txt 已空（07:52 mmvet 后），9 个页面从未入队/被孤儿化（browsecomp mrcr ovbench seal-0 simpleqa-verified superchem vibe-eval vision2web vlmsarebiased）；worker/keeper 已全部退出，publisher 正常。已把这 9 页重新入队。
2026-11-15 16:13:28 [taskS] 重启 keeper2.sh（N=7）与 monitor2.sh；GLM 池保持停用（STOPGLM 存在），publisher 未动。
2026-11-15 16:13:30 [auto] worker=pass 480/fail 6/skip 12 · gate=accept 404/reject 75 · queue 8 · slots x=1 glm=0 old=0 · avail 5052MB · api-errors total 16
2026-11-15 16:59:47 [publish] cgbench -> 68231e988c04558b4868d6339a9a332c74fa5053 https://evals.zenheart.site/benchmarks/cgbench/ https://github.com/zenHeart/evals/actions/runs/43693453646
2026-11-15 16:59:49 [publish] healthbench 重新验收 accept（check_err=0 quotes=139 fresh_found=125 fresh_missing=12 unverified=2 unfetch=1）
2026-11-15 17:01:45 [publish] chartography -> 209903f504d6ba6e10b9e0fe797cda4e1afe6fc6 https://evals.zenheart.site/benchmarks/chartography/ https://github.com/zenHeart/evals/actions/runs/43697119291
2026-11-15 17:01:47 [publish] hmmt25 重新验收 accept（check_err=0 quotes=86 fresh_found=78 fresh_missing=0 unverified=8 unfetch=2）
2026-11-15 17:03:36 [publish] chartqa -> 7e19fb85ee2dcc45098831d6cb0e3ded9d5db7ea https://evals.zenheart.site/benchmarks/chartqa/ https://github.com/zenHeart/evals/actions/runs/43697290005
2026-11-15 17:03:37 [publish] horizonmath 重新验收 accept（check_err=0 quotes=73 fresh_found=73 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 17:05:39 [publish] charxiv-descriptive -> 3201ddd2c44f452958d374be0c27615d951bd35e https://evals.zenheart.site/benchmarks/charxiv-descriptive/ https://github.com/zenHeart/evals/actions/runs/43697433121
2026-11-15 17:05:40 [publish] humaneval 重新验收 accept（check_err=0 quotes=62 fresh_found=62 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 18:00:22 [publish] chinese-simpleqa -> f71564c704470cb4e9a8a212abb9fa8fa62c1a04 https://evals.zenheart.site/benchmarks/chinese-simpleqa/ https://github.com/zenHeart/evals/actions/runs/43697606416
2026-11-15 18:00:23 [publish] ifbench 重新验收 accept（check_err=0 quotes=72 fresh_found=72 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 18:02:19 [publish] cl-bench -> fa25c50265a719751e05156d00d582f6e4a426f8 https://evals.zenheart.site/benchmarks/cl-bench/ https://github.com/zenHeart/evals/actions/runs/43702005436
2026-11-15 18:02:20 [publish] ifeval 重新验收 accept（check_err=0 quotes=87 fresh_found=85 fresh_missing=2 unverified=0 unfetch=0）
2026-11-15 18:04:23 [publish] claw-eval -> d0f5c91d23b0213a884f4b56992fbc1bb374ee52 https://evals.zenheart.site/benchmarks/claw-eval/ https://github.com/zenHeart/evals/actions/runs/43702160412
2026-11-15 18:04:25 [publish] imo-2025 重新验收 accept（check_err=0 quotes=47 fresh_found=47 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 18:06:16 [publish] clawbench -> 698eff30bae50e4eecb92ca149acd84bbd8e5987 https://evals.zenheart.site/benchmarks/clawbench/ https://github.com/zenHeart/evals/actions/runs/43702329473
2026-11-15 18:06:18 [publish] infinitebench-en-mc 重新验收 accept（check_err=0 quotes=66 fresh_found=66 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 18:06:55 [auto] worker=pass 481/fail 6/skip 12 · gate=accept 405/reject 75 · queue 1 · slots x=7 glm=0 old=0 · avail 8084MB · api-errors total 16
2026-11-15 19:02:44 [publish] claweval-mm -> add837b7a3ccf4908fdf8dd24c5733b3c1991aa3 https://evals.zenheart.site/benchmarks/claweval-mm/ https://github.com/zenHeart/evals/actions/runs/43702496024
2026-11-15 19:02:45 [publish] jobbench 重新验收 accept（check_err=0 quotes=136 fresh_found=133 fresh_missing=3 unverified=0 unfetch=0）
2026-11-15 19:04:40 [publish] cmmlu -> 8670b1d69ad03664e7a95a373870d4ba905b188e https://evals.zenheart.site/benchmarks/cmmlu/ https://github.com/zenHeart/evals/actions/runs/43707043630
2026-11-15 19:04:41 [publish] kernelgen 重新验收 accept（check_err=0 quotes=18 fresh_found=18 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 19:06:34 [publish] cmo-2025 -> 7d35fecd551921adba64135bfa3dae75acb0fd87 https://evals.zenheart.site/benchmarks/cmo-2025/ https://github.com/zenHeart/evals/actions/runs/43707202006
2026-11-15 19:06:35 [publish] lab-bench 重新验收 accept（check_err=0 quotes=74 fresh_found=74 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 19:08:26 [publish] cnmo-2024 -> abf523f4e1d25a4ac031b354bb2ee15be8e2fb25 https://evals.zenheart.site/benchmarks/cnmo-2024/ https://github.com/zenHeart/evals/actions/runs/43707355535
2026-11-15 19:08:28 [publish] legal-agent-benchmark 重新验收 accept（check_err=0 quotes=76 fresh_found=76 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 19:10:14 [publish] coco -> 5bc1b625251b59cadb00012020df5d552af3f8a7 https://evals.zenheart.site/benchmarks/coco/ https://github.com/zenHeart/evals/actions/runs/43707517163
2026-11-15 19:10:16 [publish] lifescibench 重新验收 accept（check_err=0 quotes=93 fresh_found=93 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 20:03:17 [publish] code-arena-frontend -> e1a4f5886ea4592c691f584e24e2fd8f631b4a24 https://evals.zenheart.site/benchmarks/code-arena-frontend/ https://github.com/zenHeart/evals/actions/runs/43711764154
2026-11-15 20:03:19 [publish] longbench 重新验收 accept（check_err=0 quotes=108 fresh_found=108 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 20:05:13 [publish] codeforces -> bdc67aa6bd943454e0bbb56497deec026279424a https://evals.zenheart.site/benchmarks/codeforces/ https://github.com/zenHeart/evals/actions/runs/43711941467
2026-11-15 20:05:14 [publish] longvideobench 重新验收 accept（check_err=0 quotes=94 fresh_found=94 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 20:07:11 [publish] compassrank -> 375842d1f351871ce55d48b2d60dfc9843ab4a54 https://evals.zenheart.site/benchmarks/compassrank/ https://github.com/zenHeart/evals/actions/runs/43712107158
2026-11-15 20:07:12 [publish] lvbench 重新验收 accept（check_err=0 quotes=73 fresh_found=38 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 20:07:22 [auto] worker=pass 484/fail 6/skip 12 · gate=accept 408/reject 75 · queue 0 · slots x=5 glm=0 old=0 · avail 2524MB · api-errors total 16
2026-11-15 20:42:29 [publish] complexfuncbench -> 875f16bb6f1ced8db99f611c2ca81f8db7ec3111 https://evals.zenheart.site/benchmarks/complexfuncbench/ https://github.com/zenHeart/evals/actions/runs/43712274065
2026-11-15 20:42:31 [publish] math 重新验收 accept（check_err=0 quotes=88 fresh_found=85 fresh_missing=0 unverified=3 unfetch=1）
2026-11-15 22:07:55 [publish] browsecomp 隔离（连续 3 次未通过：2026-11-15 21:11:43       at TestContext.<anonymous> (file:///workspace/evals-publish/tests/model-compare.test.mjs:285:53)       at async Test.run (node:internal/test_runner/test:1409:7)       at async Test.processPendingSubtests (node:internal/test_runner/test:974:7) ），保留线上现版，待 out 更新后自动解禁
2026-11-15 22:07:57 [publish] mathvision 重新验收 accept（check_err=0 quotes=103 fresh_found=99 fresh_missing=4 unverified=0 unfetch=0）
2026-11-15 22:08:32 [auto] worker=pass 487/fail 6/skip 12 · gate=accept 411/reject 75 · queue 0 · slots x=2 glm=0 old=0 · avail 4417MB · api-errors total 16
2026-11-15 22:10:00 [publish] complexnlu -> 40010a3559bec0ae18e94a2120455de6363fad4d https://evals.zenheart.site/benchmarks/complexnlu/ https://github.com/zenHeart/evals/actions/runs/43722731574
2026-11-15 22:10:02 [publish] mathvista 重新验收 accept（check_err=0 quotes=87 fresh_found=85 fresh_missing=2 unverified=0 unfetch=0）
2026-11-15 22:12:07 [publish] countix -> a876981b84474ae9c7dc03ef1f659f637df55ed4 https://evals.zenheart.site/benchmarks/countix/ https://github.com/zenHeart/evals/actions/runs/43722915132
2026-11-15 22:12:09 [publish] mbpp-evalplus 重新验收 accept（check_err=0 quotes=44 fresh_found=44 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 23:04:54 [publish] countqa -> 985e669c12fe79158864cbceecb33ad7544d98c4 https://evals.zenheart.site/benchmarks/countqa/ https://github.com/zenHeart/evals/actions/runs/43723121459
2026-11-15 23:04:56 [publish] mbpp 重新验收 accept（check_err=0 quotes=97 fresh_found=97 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 23:06:57 [publish] covost2 -> 82676bc2071705df93e1e3b570a67da9c1af87eb https://evals.zenheart.site/benchmarks/covost2/ https://github.com/zenHeart/evals/actions/runs/43727934617
2026-11-15 23:06:59 [publish] mcp-atlas 重新验收 accept（check_err=0 quotes=127 fresh_found=119 fresh_missing=2 unverified=2 unfetch=2）
2026-11-15 23:08:52 [publish] coworkbench -> 3d9490d08f3b1fec6123a03c945052b455688404 https://evals.zenheart.site/benchmarks/coworkbench/ https://github.com/zenHeart/evals/actions/runs/43728115406
2026-11-15 23:08:53 [publish] mcpmark 重新验收 accept（check_err=0 quotes=76 fresh_found=76 fresh_missing=0 unverified=0 unfetch=0）
2026-11-15 23:10:44 [publish] creative-writing-v3 -> f3c44d117b52be7c8f609c140dd6a8734c37c6d3 https://evals.zenheart.site/benchmarks/creative-writing-v3/ https://github.com/zenHeart/evals/actions/runs/43728290940
2026-11-15 23:10:46 [publish] mgsm 重新验收 accept（check_err=0 quotes=44 fresh_found=39 fresh_missing=2 unverified=3 unfetch=2）
2026-11-16 00:03:35 [publish] creativework -> 9485806a5b7ab0ec0597060605fded70508938ea https://evals.zenheart.site/benchmarks/creativework/ https://github.com/zenHeart/evals/actions/runs/43728479899
2026-11-16 00:03:37 [publish] minerva 重新验收 accept（check_err=0 quotes=81 fresh_found=81 fresh_missing=0 unverified=0 unfetch=0）
2026-11-16 00:05:34 [publish] critpt -> 5046c34f48dcea56446013dcbc8f96989b24fe38 https://evals.zenheart.site/benchmarks/critpt/ https://github.com/zenHeart/evals/actions/runs/43733394343
2026-11-16 00:05:37 [publish] mls-bench-lite 重新验收 accept（check_err=0 quotes=101 fresh_found=101 fresh_missing=0 unverified=0 unfetch=0）
2026-11-16 00:05:43 [auto] worker=pass 488/fail 6/skip 12 · gate=accept 412/reject 75 · queue 0 · slots x=1 glm=0 old=0 · avail 12770MB · api-errors total 16
2026-11-16 00:07:28 [publish] crossvid -> fa8647f67d4ea30e0533af54d1a13d45ed592e66 https://evals.zenheart.site/benchmarks/crossvid/ https://github.com/zenHeart/evals/actions/runs/43733581654
2026-11-16 00:07:30 [publish] mmlu-pro 重新验收 accept（check_err=0 quotes=70 fresh_found=59 fresh_missing=6 unverified=5 unfetch=1）
2026-11-16 00:09:24 [publish] cruxeval -> 2a376f130fbc983340be4b7d8ec881f69004d7cb https://evals.zenheart.site/benchmarks/cruxeval/ https://github.com/zenHeart/evals/actions/runs/43733765639
2026-11-16 00:09:25 [publish] mmlu 重新验收 accept（check_err=0 quotes=102 fresh_found=93 fresh_missing=0 unverified=9 unfetch=1）
2026-11-16 01:06:10 [publish] curated-ctfs -> ff71c79868b4526f0e7b2323cc1c28d9ac58f08e https://evals.zenheart.site/benchmarks/curated-ctfs/ https://github.com/zenHeart/evals/actions/runs/43733938456
2026-11-16 01:06:12 [publish] mmmlu 重新验收 accept（check_err=0 quotes=65 fresh_found=64 fresh_missing=0 unverified=1 unfetch=1）
2026-11-16 01:08:15 [publish] cv-bench -> d441d9bb890409a650d684e9a03723bf11c20dbf https://evals.zenheart.site/benchmarks/cv-bench/ https://github.com/zenHeart/evals/actions/runs/43739270786
2026-11-16 01:08:17 [publish] mmmu-pro 重新验收 accept（check_err=0 quotes=84 fresh_found=63 fresh_missing=6 unverified=15 unfetch=1）
2026-11-16 01:10:13 [publish] cwe-bench -> 3e9bfd96c9a1732f27ea3007097f0d938770f534 https://evals.zenheart.site/benchmarks/cwe-bench/ https://github.com/zenHeart/evals/actions/runs/43739457753
2026-11-16 01:10:14 [publish] mmmu 重新验收 accept（check_err=0 quotes=137 fresh_found=136 fresh_missing=1 unverified=0 unfetch=0）
2026-11-16 01:11:57 [publish] cybench -> 4dd60f7eb369defe47c9f62d45c2139dbf29982e https://evals.zenheart.site/benchmarks/cybench/ https://github.com/zenHeart/evals/actions/runs/43739647077
2026-11-16 01:11:59 [publish] mmvu 重新验收 accept（check_err=0 quotes=144 fresh_found=144 fresh_missing=0 unverified=0 unfetch=0）
2026-11-16 01:13:48 [publish] cyber-refusal-rate -> db126c8692e3dfac91ba7fa4d8f9673fb78f0949 https://evals.zenheart.site/benchmarks/cyber-refusal-rate/ https://github.com/zenHeart/evals/actions/runs/43739810053
2026-11-16 01:13:50 [publish] mobileworld 重新验收 accept（check_err=0 quotes=92 fresh_found=92 fresh_missing=0 unverified=0 unfetch=0）
2026-11-16 02:01:45 [auto] worker=pass 489/fail 6/skip 12 · gate=accept 413/reject 75 · queue 0 · slots x=0 glm=0 old=0 · avail 3025MB · api-errors total 16
2026-11-16 02:01:46 [auto] ALL WORKERS DONE → finalize
2026-11-16 02:01:47 finalize: gate accept=413 reject=75（历史累计，不等于可发布；能否上线由发布器按 out+v2+check-one 逐页判定）
2026-11-16 02:01:47 finalize: 等发布器排空中（state=running 0s）
2026-11-16 02:02:17 [publish] cyscenariobench -> 0533fb07efea9ea49dea5e7d643f31f19da165c1 https://evals.zenheart.site/benchmarks/cyscenariobench/ https://github.com/zenHeart/evals/actions/runs/43744320418
2026-11-16 02:02:19 [publish] motionbench 重新验收 accept（check_err=0 quotes=112 fresh_found=102 fresh_missing=10 unverified=0 unfetch=0）
2026-11-16 02:04:12 [publish] darija-in-the-wild -> 7768aeeaa6916acbea3f557c9538edfcea523a6b https://evals.zenheart.site/benchmarks/darija-in-the-wild/ https://github.com/zenHeart/evals/actions/runs/43744502152
2026-11-16 02:04:14 [publish] mtbench 重新验收 accept（check_err=0 quotes=65 fresh_found=65 fresh_missing=0 unverified=0 unfetch=0）
2026-11-16 02:06:05 [publish] deck-bench -> bbba789809d09a6256f72334c170b7295e145a1f https://evals.zenheart.site/benchmarks/deck-bench/ https://github.com/zenHeart/evals/actions/runs/43744685439
2026-11-16 02:06:07 [publish] mtob 重新验收 accept（check_err=0 quotes=117 fresh_found=113 fresh_missing=1 unverified=1 unfetch=1）
2026-11-16 02:06:47 finalize: 等发布器排空中（state=running 300s）
2026-11-16 02:07:48 [publish] deepsearchqa -> fdc44a3181f93f4866cfe4ba87bb10aac9af7b95 https://evals.zenheart.site/benchmarks/deepsearchqa/ https://github.com/zenHeart/evals/actions/runs/43744871507
2026-11-16 02:07:50 [publish] multi-swe-bench 重新验收 accept（check_err=0 quotes=51 fresh_found=48 fresh_missing=1 unverified=2 unfetch=1）
2026-11-16 03:04:40 [publish] deepswe -> e86dbdf028ad4ba2c206ecfb59208a65ab7b1f50 https://evals.zenheart.site/benchmarks/deepswe/ https://github.com/zenHeart/evals/actions/runs/43750171544
2026-11-16 03:04:42 [publish] multilangbench 重新验收 accept（check_err=0 quotes=44 fresh_found=44 fresh_missing=0 unverified=0 unfetch=0）
2026-11-16 03:05:52 finalize: 等发布器排空中（state=running 600s）
2026-11-16 03:06:24 [publish] dense200 -> 17c45a3706fe4ea8b18e5d741f7d3ebf1381e4c9 https://evals.zenheart.site/benchmarks/dense200/ https://github.com/zenHeart/evals/actions/runs/43750421250
2026-11-16 03:06:25 [publish] multipl-e 重新验收 accept（check_err=0 quotes=116 fresh_found=96 fresh_missing=8 unverified=12 unfetch=1）
2026-11-16 03:08:18 [publish] devstral-2-human-winrate -> 6076fc0485696486ef73dae260ae61cd0009c83b https://evals.zenheart.site/benchmarks/devstral-2-human-winrate/ https://github.com/zenHeart/evals/actions/runs/43750594347
2026-11-16 03:08:20 [publish] nexus 重新验收 accept（check_err=0 quotes=60 fresh_found=60 fresh_missing=0 unverified=0 unfetch=0）
2026-11-16 03:58:06 [publish] docvqa -> baf29f5248d09c32f95e5e9a17fc509cc9537275 https://evals.zenheart.site/benchmarks/docvqa/ https://github.com/zenHeart/evals/actions/runs/43750781646
2026-11-16 03:58:07 [publish] niah 重新验收 accept（check_err=0 quotes=51 fresh_found=51 fresh_missing=0 unverified=0 unfetch=0）
2026-11-16 03:58:53 finalize: 等发布器排空中（state=running 900s）
2026-11-16 04:00:11 [publish] draco -> 24dd97e4b86b65308a831289bac59d4c68fe2b86 https://evals.zenheart.site/benchmarks/draco/ https://github.com/zenHeart/evals/actions/runs/43755401413
2026-11-16 04:00:13 [publish] nl2repo 重新验收 accept（check_err=0 quotes=117 fresh_found=115 fresh_missing=2 unverified=0 unfetch=0）
2026-11-16 04:02:05 [publish] drop -> f1dc4afc9694360b1162913f7a941ee445873f14 https://evals.zenheart.site/benchmarks/drop/ https://github.com/zenHeart/evals/actions/runs/43755599075
2026-11-16 04:02:06 [publish] odvbench 重新验收 accept（check_err=0 quotes=58 fresh_found=58 fresh_missing=0 unverified=0 unfetch=0）
2026-11-16 04:03:53 finalize: 等发布器排空中（state=running 1200s）
2026-11-16 04:04:20 [publish] dsbench-fullstack -> f5a8f3fd717a53ce246ce70b0fc68e4d08ad357b https://evals.zenheart.site/benchmarks/dsbench-fullstack/ https://github.com/zenHeart/evals/actions/runs/43755802631
2026-11-16 04:04:21 [publish] officeqa 重新验收 accept（check_err=0 quotes=59 fresh_found=59 fresh_missing=0 unverified=0 unfetch=0）
2026-11-16 05:03:22 [publish] dsbench-hard -> d27752c7dfb8c22ce1f243a7afa98c541c4f9ac3 https://evals.zenheart.site/benchmarks/dsbench-hard/ https://github.com/zenHeart/evals/actions/runs/43756006448
2026-11-16 05:03:23 [publish] ojbench 重新验收 accept（check_err=0 quotes=93 fresh_found=85 fresh_missing=0 unverified=0 unfetch=0）
2026-11-16 05:05:29 [publish] dyna-math -> d4ba49665c8e96bf9e4a82a8c203d8ba91d54e16 https://evals.zenheart.site/benchmarks/dyna-math/ https://github.com/zenHeart/evals/actions/runs/43761562481
2026-11-16 05:05:30 [publish] omnivideobench 重新验收 accept（check_err=0 quotes=74 fresh_found=74 fresh_missing=0 unverified=0 unfetch=0）
2026-11-16 05:06:21 finalize: 等发布器排空中（state=running 1500s）
2026-11-16 05:07:21 [publish] e-bench-code -> 68fee05ebab9f0972884b898a6da70707b1b5777 https://evals.zenheart.site/benchmarks/e-bench-code/ https://github.com/zenHeart/evals/actions/runs/43761770950
2026-11-16 05:07:22 [publish] one-million-bench 重新验收 accept（check_err=0 quotes=105 fresh_found=105 fresh_missing=0 unverified=0 unfetch=0）
2026-11-16 05:09:12 [publish] e-bench -> 0436b75bd4cf1956201b92ec460a56e5f0c1d69d https://evals.zenheart.site/benchmarks/e-bench/ https://github.com/zenHeart/evals/actions/runs/43761951440
2026-11-16 05:09:14 [publish] online-mind2web 重新验收 accept（check_err=0 quotes=30 fresh_found=30 fresh_missing=0 unverified=0 unfetch=0）
2026-11-16 06:03:40 finalize: 等发布器排空中（state=running 1800s）
2026-11-16 06:08:40 finalize: 等发布器排空中（state=running 2100s）
2026-11-16 07:04:35 finalize: 等发布器排空中（state=running 2400s）
2026-11-16 07:05:13 [publish] economically-important-tasks 隔离（连续 3 次未通过：2026-11-16 06:10:17 data/benchmarks/economically-important-tasks.json: benchmarks/economically-important-tasks.json: status 非法（"内部评测，公开后继为 GDPval"）;），保留线上现版，待 out 更新后自动解禁
2026-11-16 07:05:14 [publish] openai-cobol-migration 重新验收 accept（check_err=0 quotes=32 fresh_found=32 fresh_missing=0 unverified=0 unfetch=0）
2026-11-16 07:07:07 [publish] egolife -> b7f2908ab59bf5911a78e1e115c3400bfd979e5c https://evals.zenheart.site/benchmarks/egolife/ https://github.com/zenHeart/evals/actions/runs/43772914929
2026-11-16 07:07:08 [publish] economically-important-tasks 重新验收 accept（check_err=0 quotes=27 fresh_found=27 fresh_missing=0 unverified=0 unfetch=0）
2026-11-16 07:07:50 [auto] worker=pass 489/fail 6/skip 12 · gate=accept 414/reject 75 · queue 0 · slots x=0 glm=0 old=0 · avail 5086MB · api-errors total 16
2026-11-16 07:07:50 [auto] ALL WORKERS DONE → finalize
2026-11-16 07:07:51 finalize: gate accept=414 reject=75（历史累计，不等于可发布；能否上线由发布器按 out+v2+check-one 逐页判定）
2026-11-16 07:07:51 finalize: 等发布器排空中（state=running 0s）
2026-11-16 07:10 [taskS] 诊断：worker 阶段已收尾（status.tsv 507 行 = 489 pass / 6 fail / 12 skip，queue2.txt 0 行，无 worker3.sh / keeper2.sh）。accepted=413 为终值，evidence 停写是因为没有 worker 在跑，不是故障；剩余工作全部在增量发布阶段。
2026-11-16 07:10 [taskS] 修复1：out/economically-important-tasks.json 的 status 为非法枚举值「内部评测，公开后继为 GDPval」（validate-data benchmark_status 只允许 active/rolling/near-saturation/historical/superseded/deprecated），改为 superseded——该页 summary/notes 自证「七周后 OpenAI 把这条评测线公开化成 GDPval」，full_name 仍保留「内部评测」事实。原值已致 3 次门禁失败并被隔离。
2026-11-16 07:10 [taskS] 修复2：out/jointavbench.json 的 profile.sources 是 dict 而非数组，check-one.mjs 直接抛 TypeError（非返回 errors），导致 gate.sh 自 11-13 起 30 次只写空判定行、该页永远无法过 gate 也无法发布。按 sources[] 规范（id/kind/title/url/accessed）把 5 个来源转为数组，信息无损；复跑 check-one errors=0，gate.sh 已判 accept（quotes=80 fresh_found=80）。
2026-11-16 07:10 [taskS] 修复3：终止滞留的 finalize.sh（其 MAXWAIT=5400s 相对 264 页待发布 backlog 只有 ~9 小时的量级，超时会误打 READY_FINAL，进而在 FRESH 短暂为空时让发布器提前退出、并让 conductor 提前启动 taskB）。已按 monitor2.sh 的既有链路以 FINALIZE_MAX_WAIT=172800 重启 monitor2.sh → finalize.sh，READY_FINAL 只会在发布器真正排空后出现。
2026-11-16 07:10 [taskS] 未触碰：publisher.sh（发布链健康，07:07 egolife 上线）、GLM 池（STOPGLM 仍在，未重启 keeper-glm.sh）、已上线的 145 页与全部 evidence。keeper2.sh 未重启：队列空且无 worker，按设计会立即退出，重启只会空转。
2026-11-16 07:08:59 [publish] egoschema -> dde6067172a0a5fac818474d133b3b7973c9a3f3 https://evals.zenheart.site/benchmarks/egoschema/ https://github.com/zenHeart/evals/actions/runs/43773093361
2026-11-16 07:09:00 [publish] openai-gif-moderation-recall 重新验收 accept（check_err=0 quotes=17 fresh_found=16 fresh_missing=1 unverified=0 unfetch=0）
2026-11-16 07:23:41 [publish] economically-important-tasks -> f994f7dc5a0c557657e13970f0edf8fe70dd481b https://evals.zenheart.site/benchmarks/economically-important-tasks/ https://github.com/zenHeart/evals/actions/runs/43773270205
2026-11-16 07:23:43 [publish] osworld 重新验收 accept（check_err=0 quotes=133 fresh_found=108 fresh_missing=0 unverified=25 unfetch=2）
2026-11-16 07:25:46 [publish] egotempo -> f41ee2dce14d37f15c8cbe4c2f284ce14edc4475 https://evals.zenheart.site/benchmarks/egotempo/ https://github.com/zenHeart/evals/actions/runs/43774616364
2026-11-16 07:25:47 [publish] ovobench 重新验收 accept（check_err=0 quotes=43 fresh_found=43 fresh_missing=0 unverified=0 unfetch=0）
2026-11-16 07:26:05 finalize: 等发布器排空中（state=running 300s）
2026-11-16 07:27:49 [publish] eifbench -> 1ebd36545f9833300c9196acf642ce730bd709d4 https://evals.zenheart.site/benchmarks/eifbench/ https://github.com/zenHeart/evals/actions/runs/43774805305
2026-11-16 07:27:50 [publish] paperbench 重新验收 accept（check_err=0 quotes=52 fresh_found=52 fresh_missing=0 unverified=0 unfetch=0）
2026-11-16 07:29:41 [publish] embspatial-bench -> 1a76ad07a3342db7474c7576349b79cc25c0d45f https://evals.zenheart.site/benchmarks/embspatial-bench/ https://github.com/zenHeart/evals/actions/runs/43774995014
2026-11-16 07:29:42 [publish] perception-bench 重新验收 accept（check_err=0 quotes=52 fresh_found=52 fresh_missing=0 unverified=0 unfetch=0）
2026-11-16 07:31:05 finalize: 等发布器排空中（state=running 600s）
