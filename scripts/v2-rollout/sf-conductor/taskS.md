# 任务 S：evals v2 rollout 卡住了，请诊断并修复

/workspace/rollout 里的全量升级看起来停滞了：accepted 数 3 小时没涨，evidence 目录也没有新写入。先读 SPEEDUP_NOTES.md，看它描述的健康状态，再检查 progress.md、logs/、各个进程。找到原因后修复，必要时重启 worker、keeper 或 monitor，已通过的页面和证据不能丢。如果是额度用完、认证失败这类你修不了的问题，就写清楚原因。不打印密钥，只用默认 StepFun token CC_STEPFUN_TOKEN；GLM 池已按用户要求停用，不要重启。
结果写到 /workspace/sf-conductor/reportS-<时间>.md，最后一行写 `STATUS: DONE` 或 `STATUS: BLOCKED <原因>`。
