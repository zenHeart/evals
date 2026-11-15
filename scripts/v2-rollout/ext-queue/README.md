# 外部模型持久队列（t57u）

Grok 只编排与核验。调查/修复/验收/逐页发布/收尾由 MiniMax-self 与 glm-self 执行；StepFun 页面 worker 与仍在跑的 taskI 作为后备，不另加并发。

- 运行器：`/workspace/ext-queue/run-ext.sh <glm-self|minimax-self> <taskfile> <name>`
- 队列：`queue.tsv`（status: queued|running|blocked|done|failed）
- 各任务状态：`status/<id>.md`，最后一行 STATUS: DONE 或 BLOCKED
- 运行日志：`logs/runs.log`、`logs/<name>.<n>.json`
- 重试：每任务最多 3 次（timeout 续跑同一会话）；发布单页最多 3 次后隔离
- 禁用：CC_GLM_TOKEN、Z_AI_API_KEY、CC_STEP_EXPLORE_TOKEN、CC_MINIMAX_TOKEN、MINIMAX_COMPANY/HOME
- 不启动 keeper-glm（保留 STOPGLM），以免再开 4 个页面 worker
