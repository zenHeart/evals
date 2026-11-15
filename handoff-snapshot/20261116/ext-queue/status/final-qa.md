# EXT-QA 状态：前置条件未满足，本次为提前触发（QA 未开始、无副作用）

- 本次触发：2026-11-15 04:10:45（dispatcher 日志：`launch -QA provider=glm-self name=-qa`）
- 本文件写于：2026-11-15 05:05（本次运行退出前）；正式运行请整体覆盖本文件。

## 前置条件核验（任务要求两者同时成立，实测均为否）

| 条件 | 实测 | 证据（2026-11-15 05:01–05:05） |
|---|---|---|
| `/workspace/rollout/READY_FINAL` 存在 | ❌ 不存在 | `ls /workspace/rollout/READY_FINAL` → No such file |
| publisher 已 drained | ❌ running | `publisher.state=running`；05:01:41 起正在发布 anthropic-behavioral-audit（05:05 门禁进行中） |

## 为何会提前触发（dispatcher 读表竞态，记录备修）

dispatcher.sh 的主循环从旧 fd 逐行读 `queue.tsv`，循环体内 `update_queue_field` 却以
`open(path,'w')` 原地截断重写同一文件。04:10:45 那一轮先记 EXT-CAL done（触发重写），
内层循环继续读已截断的文件，把 EXT-QA 行读成残缺 id `-QA`——`case "$id" in EXT-QA)`
的 qa_ready 门因 id 不匹配被整体绕过，直接 launch。2026-11-14 22:05:21 的
`launch -REPAIR provider=glm-self name=-repair` 是同一竞态（那页运气好照常完成）；
04:07:30 的 `launch EXT-CAL` 恰好赶上干净读，未触发。

修复建议（下次重启 dispatcher 时做，本次不动运行中的编排进程）：
`update_queue_field` 的 python 改为写临时文件 + `os.replace` 原子替换，
读侧下一轮自然打开新 inode，竞态即消失。

## 发布器余量（本会话内不可能等到排空）

- 待发布候选 **319 页**（`helpers/publish-candidates.py` 实测，05:02；含 need=1 待复验若干）；
- 已上线记账 64 条、其中核验 ok 39（`published.tsv`，05:05）；
- 近 4 小时实测上线 11 页（01:04–05:01），单页 2–51 分钟（androidworld 的 `node --test` 门禁一次跑了 49 分钟）；
- worker3 仍在跑（monitor2 04:03 报 `slots x=1`），finalize / READY_FINAL 链路尚未启动；
- 按此节奏排空需 10 小时～数天，而本会话 timeout 至 06:10:45，原地等待无意义。

## 本次运行做过 / 没做过什么

- 只做只读核验：ls / cat / ps / 台账与候选计数 / 日志尾部；未取 publish.lock、未碰 git 与工作树、
  未 force、未回退任何线上版本、未动 keeper2 / monitor2 / worker3 / publisher / dispatcher；
- 未写 `reportB.md`：QA 未开始，无内容可报（reportA.md 为任务 A 交付，未动）；
- queue.tsv 里 EXT-QA 行仍为 `blocked / retries=0`（提前触发走的是残缺 id `-QA`，没碰正式行），
  **3 次续跑预算未消耗**；日志目录里的 `-qa.launch.out`、`-qa.dispatcher.pid` 等带杠文件名是同一竞态的副产物，可留待清理。

## 给正式运行的交接

1. 开始条件照旧：`READY_FINAL` 存在 且 `publisher.state=drained`（dispatcher `qa_ready()` 同口径）。
2. 执行内容按 `tasks/final-qa.md` + `sf-conductor/taskB.md` 第 2–4 步：全量门禁（持锁）→
   ≥10% 引文 reverify.py 复抓（覆盖多领域）→ 随机 10 页中文抽检（HLE v2 版式、无
   「已核验/待核验/证据账本/窗口起点」）→ 写 reportB.md 与本文件。
3. 注意：本文件最后一行刻意不用 `STATUS: BLOCKED` 结尾——dispatcher 对 running 行读到
   BLOCKED 会立即 retry 并二次 launch，会把本文件的陈旧状态误当新失败；故以 WAIT 行收尾
   （status_line 判为 OTHER，对 blocked/running 行均安全）。

STATUS: WAIT — 前置条件未满足（READY_FINAL 缺失、publisher running、候选 319 页待发），QA 未开始
