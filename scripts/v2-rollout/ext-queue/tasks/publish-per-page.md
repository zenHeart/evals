# 任务 EXT-PUB：把增量发布改成「每 accept 一页就单独发布」，并验证至少再上线 1 页

用户 18:03（t56u）要求：388/389 个 accept 不能只上线 39 页；每次通过就触发一次上线，不要凑 40 页一批。18:05（t57u）授权用 MiniMax-self / glm-self 执行。你是实际执行者。

## 协调（必须先做，避免双控）
- StepFun taskI（claude 约 PID 846420，会话 a0ce0766-36a6-4180-aec1-dd498ce7dc22）可能仍在跑。不要杀它，不要对同一会话 --resume，不要开第二个 publisher。
- 发布工作树 `/workspace/evals-publish`，锁 `/workspace/rollout/publish.lock`。若锁被占用或工作树有他人未提交改动，等待（最多 10 分钟）或只读检查后暂缓 git，不要 reset 丢掉别人的合法修复。
- 刚推到 origin/main 的 `a85b703`（fix(compare): 补 17 项计分/参考决定）的 Build & Publish 可能还在跑：https://github.com/zenHeart/evals/actions/runs/43583609265 。必须等它成功后再 `git push` 任何新 commit，避免 cancel-in-progress 取消部署。
- 常驻 publisher 在 18:05:24 已退出，pidfile 已清理。你改完脚本后再启动唯一实例。
- 不要重启 GLM 页面池 keeper-glm（保留 STOPGLM，避免再加 4 个 worker 把内存打满）。不要加 StepFun 槽位。不要动 /workspace/evals 的 v2-spec 检出。不要改 routine。不要打印密钥。
- 只用你被启动时的 provider（MiniMax-self 或 glm-self）。不要用 CC_GLM_TOKEN、Z_AI_API_KEY、CC_STEP_EXPLORE_TOKEN、CC_MINIMAX_TOKEN、MINIMAX_COMPANY/HOME keys。

## 问题根因（已核实，请复检）
- 验收 389 是 **唯一 ID**，不是重复累计（gate.tsv 无重复行、无翻转）。
- origin/main 上 v2 仅 40 页（39 个本轮 + 已有试点 hlehle）。published.tsv 仍是首批 39，停在 5de270c。
- 约 193 页已过 check-one、被 publisher 列为可发布，但脚本 `MAX_BATCH=40` + `COALESCE=120` 把它们打成大包。18:04 一批 40 页因 **3 个坏页** 让全局 `validate-data` 失败，整批放弃、300s 后整批重试，好页被堵死：
  - `artificial-analysis-image-arena`：类别外键「图像编辑」「图像生成」不存在；related_benchmark `artificial-analysis-text-to-image-arena` 不存在。
  - `beyondaime`、`cgbench`：official_results 表用 "-" 表示缺失，规范要求 null。
- 更早的大包还因 compare-rules 未登记失败；a85b703 已补 17 项，但 **不能** 再为过关伪造计分决定。若全局门禁有缺陷，根据来源/规范修正并跑测试；页数据有误则修该页或隔离，不要降级门禁。

## 你要做的
1. 改 `/workspace/rollout/publisher.sh`（及必要时 `publish-batch.sh`）：
   - 默认每次只发布 **1 页**（MAX_BATCH=1；不要再为了「凑批」等 120s）。
   - 每页：持锁 → FF 最新 origin/main → 只拷该页（及该页必需的合法数据修复）→ 全部门禁（reconcile-coverage、node --test、validate-data、sync:skills:check、build、validate-site）→ 还原且不提交 evals.epub → 作者 `zenheart <zenheart_register@163.com>` 提交 → `git push origin HEAD:main` 只快进、不强推、不建 PR、不删远程分支 → 等这次 Build & Publish（含 Deploy to GitHub Pages）成功 → curl 线上 `/benchmarks/<id>/` 确认 `benchmark-profile/v2` → 写入 `published.tsv`（id、完整 commit SHA、时间、页面 URL、Actions run URL、核验结果）。
   - 序列化：必须等上一次 Actions 成功再推下一页。
   - **失败隔离**：某页让门禁失败时，把该页写入 `/workspace/rollout/publish-failed.tsv`（id、时间、失败步骤、具体错误），**继续下一页**，不要整批重试、不要把好页永久堵住。同一页最多自动重试 3 次。
   - 历史 accept 但 out 晚于 gate 的，必须重新 check-one + reverify 才发布。check-one 失败、reject、stub/非 v2、缺 out 的不上线，保留线上旧版。
2. 对已定位的坏页：按规范/来源修复（例如缺失值改 null；类别名对到站点已有类别，或只在分类表确有根据时补登记），修完回归测试。修不好就隔离记因，不要为过关编造 compare-rules 或改测试断言。
3. **必须实际完成至少 1 个首批之后的新页全流程**（建议先挑未命中上述 3 个坏页的合格页，如 `aa-cyber-index` 或 `ai2d`）：accept→检查→提交→Actions 成功→线上 v2。把完整 commit URL 和 Actions URL 写入状态文件。
4. 启动唯一常驻 `publisher.sh`（setsid + pidfile），让其余合格页按「每次 1 页」继续排。
5. 写 `/workspace/ext-queue/status/publish-per-page.md`（中文），最后一行 `STATUS: DONE` 或 `STATUS: BLOCKED <具体错误和正在采取的动作>`。不要写「无阻塞」。

完成标准：脚本已改为逐页；publish-failed.tsv 能记因；至少 1 个新页在 origin/main 且线上为 v2；publisher 在跑；状态文件已写。
失败重试上限：本任务 run-ext 最多 3 次（超时续跑）；单页发布最多 3 次。
