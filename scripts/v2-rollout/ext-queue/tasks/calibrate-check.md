# 任务 EXT-CAL：校准任务残留核查（官方分不能误计为 0）

不要重复改已经在 origin/main 上的代码。taskA 是公平对比收紧（#76），不是本任务。
已在 origin/main 的覆盖：#72 `a92e8d4`「官方数值不再被误计为 0」+ 全库自检；#74「没报告不按 0 分计」。
未合入 main 的本地分支 `feat/calibrate-coding-leaderboards` 还有：
- ad41a71（#72 的前身，可能已等价合入，不要重改在线逻辑）
- 6b53a8d 按官方榜单补录 L0 原值（多模型）
- 2ed27a2 FrontierSWE V2 榜 Fable 5.1 / Fable 5 复核（56.3 / 47.0）
请 diff 这两项数据提交与 origin/main：若官方原值已在后续入库中，记「已覆盖」并退出；若仍缺失，只补数据与已有防回归测试需要的最小变更，FF 推 main（作者 zenheart <zenheart_register@163.com>，不 force，还原 epub）。不要扩大到未接受的 TaskA 残留建议。
写 `/workspace/ext-queue/status/calibrate-check.md`，最后一行 `STATUS: DONE` 或 `STATUS: BLOCKED <原因>`。
本任务最多 3 次超时续跑。等 EXT-PUB 的发布锁空闲再推，避免与逐页发布竞态。
