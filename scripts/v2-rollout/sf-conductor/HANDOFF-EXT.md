# 发布控制权已移交 MiniMax-self（18:12 授权 t58u）

- 发布实施由 MiniMax EXT-PUB（timeout 946173 / claude 946174，会话 29452895-bcd8-4c19-b31b-a25227570b74）接管。
- 旧 StepFun taskI 只负责过发布控制，已停止其 timeout/claude（原 846418/846420）。未停 conductor、keeper2、monitor2、worker3。
- 不要再以 MAX_BATCH=40 启动 /workspace/rollout/publisher.sh。唯一发布锁：/workspace/rollout/publish.lock。所有权标记：/workspace/rollout/PUBLISH_OWNER。
- 后续 EXT-REPAIR / EXT-CAL / EXT-QA 由 /workspace/ext-queue/dispatcher.sh 在条件满足时自动接续，不必等 Grok。
