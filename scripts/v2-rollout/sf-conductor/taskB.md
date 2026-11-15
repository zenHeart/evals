# 任务 B：evals v2 增量发布的最终收尾（READY_FINAL 已出现、队列已空、worker 已退出）

背景：2026-11-14 起升级策略已改为「每验收通过一页就增量部署」。发布工作树是 `/workspace/evals-publish`
（分支 `publish-incremental`，跟踪 origin/main，只快进推送）；常驻逐页发布器是
`/workspace/rollout/publisher.sh`，用 `/workspace/rollout/publish.lock` 串行化
「取最新 main → 拷页 → 门禁 → commit → push → 等 Actions」。任务 A（HLE 试点）已上线，不要重复。
主仓库 `/workspace/evals` 仍在 `v2-spec` 上给 worker3 当 BASE，**绝对不要**在里面切分支 / reset / clean。

铁律：不 force push、不改已推送历史、不删远程分支、不回退任何未完成页面的线上旧版；
只用默认 StepFun token（CC_STEPFUN_TOKEN / run-sf.sh 已配置），不使用任何 GLM 凭证或 CC_STEP_EXPLORE_TOKEN；
不打印密钥；不新增 worker 槽位；不动 keeper2 / monitor2 / worker3 进程。

## 执行步骤

1. **接管而不是重跑**：先读 `/workspace/rollout/published.tsv`、`progress.md`、`gate.tsv`、`out/` 清单、
   `logs/incremental-publish.log`。已上线页面一律不重新生成、不重复提交。
   等 `publisher.pid` 对应的进程退出（或确认它已 drained 且不再发布）后再动手；它若还在跑，
   所有 git 操作都必须先拿到 `/workspace/rollout/publish.lock`（`flock`），不要并发推 main。

2. **全量门禁（在 /workspace/evals-publish 中，持锁）**：`git fetch origin` 并快进到最新 origin/main，然后
   `node scripts/reconcile-coverage.mjs`、`node --test tests/*.test.mjs`、`node scripts/validate-data.mjs`、
   `npm run -s sync:skills:check`、`npm run -s build`、`node scripts/validate-site.mjs` 全部通过。
   `evals.epub` 被构建改写后必须 `git checkout -- evals.epub` 还原、不进暂存区。

3. **引文复抓（至少 10%，覆盖各领域）**：对已上线 v2 页面按 `reverify.py` 的方式重新抓原网页核对逐字摘录，
   抽样要覆盖代码 / 数学推理 / 多模态 / 智能体 / 安全 / 语言等不同领域，不能全抽同一类。
   复抓不匹配的：修正摘录（换成阅读版原句）或把该事实改成「未披露」，改完重新 `check-one.mjs` + 门禁，再增量推送；
   修不动的保留线上现版并在报告里列出，不要回退。

4. **中文文案抽检 10 页**：随机抽 10 个已上线 v2 页面读中文文案，确认符合 HLE v2 版式、内容准确、
   不含「已核验 / 待核验 / 证据账本 / 窗口起点」等字样，也没有把英文占位符直接当文案。

5. **补增量发布**：把此时「gate=accept + out 存在且 template=benchmark-profile/v2 + check-one 通过 +
   线上还不是 v2」但仍未上线的页面，逐批（每批 1 页或锁内短暂的几页）增量发布，流程与发布器完全一致：
   持锁 → FF 最新 main → 只拷 `data/benchmarks/<id>.json` → 从 `data/benchmark-profile-backlog.json` 移除该 id →
   全部门禁 → 还原 epub → 一次提交（作者 `zenheart <zenheart_register@163.com>`，说明写清页数和 id 列表）→
   `git push origin HEAD:main`（必须快进，失败就 fetch 后 rebase/ff 重跑门禁再推）→ 等 Actions 成功 → curl 核验。
   每次 push 后必须确认上一次「Build & Publish」已成功，避免 concurrency cancel-in-progress 互相取消。

6. **报告**：写 `/workspace/sf-conductor/reportB.md`（中文）：上线总数与清单、拒绝/未上线清单及原因、
   提交链接、每个部署 run 链接、线上核对结果、引文复抓与抽检发现、遗留问题。
   最后一行写 `STATUS: DONE` 或 `STATUS: BLOCKED <原因>`。

注意：`READY_FINAL` 只是「队列已空」的信号，不代表所有页面都已上线；缺 out 的历史 accept 页面
（见 `logs/recover-out.log`）可能仍会陆续恢复出成品，由你按同一套门禁补增量发布，恢复不是发布通行证。
