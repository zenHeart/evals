# 任务 EXT-QA：队列清空后的最终抽检（不要阻塞已合格页的增量发布）

仅在 `/workspace/rollout/READY_FINAL` 出现、且 publisher 已 drained 之后开始。
对已上线 v2：全量门禁；至少 10% 引文按 reverify.py 复抓（覆盖多领域）；随机 10 页中文抽检（HLE v2 版式、无「已核验/待核验/证据账本/窗口起点」）。不 force、不回退未完成页线上旧版。
写 `/workspace/sf-conductor/reportB.md` 与 `/workspace/ext-queue/status/final-qa.md`。最多 3 次续跑。
