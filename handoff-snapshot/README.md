# 快照分支说明（禁止合并进 main）

分支：`snapshot/v2-upgrade-handoff-20261116`

这是 2026-11-16 交接时的未完成档案：发布台账、EXT 队列状态、本地 `out/*.json` 成品，以及原机 evidence 的**文件名清单**。

- **不要**把本分支 merge / PR / 一次 checkout 进 `main`。那会把尚未逐页通过门禁的 JSON 灌入主干并触发部署。
- 使用方式：在独立目录检出本路径，或 `git checkout origin/snapshot/v2-upgrade-handoff-20261116 -- handoff-snapshot/20261116`，再按 `docs/handoff/v2-upgrade-20261116.md` 由发布器逐页发布。
- 完整 evidence / fresh / 日志 / 会话原文不在本快照中，见 exclusions 文档。
- 发布器在原机仍会继续更新 `/workspace/rollout`；本快照会过时，上线权威以 `origin/main` 为准。
