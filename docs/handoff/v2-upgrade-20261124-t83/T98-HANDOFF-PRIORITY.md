# t98u 交接优先指令（2026-11-25 07:59 Asia/Shanghai / 北京时间）

用户最新明确要求（授权 pt98u）：现在提交交接，让后续 agent 只依赖仓库代码就能直接完成剩余任务。优先目标由继续全量收尾转为仓库自包含交付接力，不等全项目完成。

## 如何接到本指令

- 本文件是机械投递。正在写入的原生 `/goal` 会话不会仅因为本文件出现就改目标。
- 已更新 `/workspace/sf-conductor/status/t92-goal.txt`。下一次同 SID 的 native `/goal --resume` 才会把新条件送进会话。
- t83（`fb99c75f-08a0-4919-8eb1-e601eb68ec2b`）是唯一集成写入者；t78（`89f8dfd6-a795-4529-b1d7-a09c2c40f07d`）不要并行 commit/push。
- 投递时（07:58）两会话均在有效写入，未做 stall-kill，未新开第 7 会话，并发上限 6。

## 必须优先完成

1. 仓库醒目交接入口，准确区分已完成 / 未验收 / 失败 / 未开始，23 候选逐项可复核，写明 checkpoint 边界。
2. 所有继续所需源代码、脚本、清单、必要证据安全入库；不依赖 `/workspace/rollout` 临时文件、绝对路径、聊天或未跟踪 out。
3. 一步步安装 / 运行 / 审核 / 引文抽查 / 测试 / 恢复命令、预期结果与完成标准；正式部署交给后续 agent。
4. 清楚列出所需普通依赖及环境变量名；不提交任何 secret 或会话凭据；后续 agent 不必依赖当前机器 token。
5. 用干净克隆、只含准备提交的仓库内容验证交接命令，记录实际结果，不伪称完工。
6. 提交前排除秘钥和未完成混入；无 force/rebase/reset/`--no-verify`；不另开 PR/Issue、不外发消息。

## 推送与部署（硬约束）

- `STOP_PUBLISH` 与禁止自动部署仍然有效。不要启动 publisher，不要 `workflow_dispatch` 部署。
- 已核对仓库 `.github/workflows/build-epub.yml`（与 `origin/main` 一致）：`on.push.branches: [main]`；`deploy` job 的 `if` 为 `github.ref == 'refs/heads/main' && (github.event_name == 'push' || github.event_name == 'workflow_dispatch')`。因此 **push 到 main 会自动部署 GitHub Pages**，授权范围内无法安全避免。
- **不要 `git push origin main`。** 不要为了推 main 而修改 workflow 绕过部署。
- 在工作树完成本地 commit 后，把 SHA、交接入口路径、干净克隆验证结果、剩余项，以及“未推 main / 未部署”写入交接文档和 `status/t83-progress.md`。不能声称远端交付。
- gh 已登录账号 `zenHeart`（只核状态，不读凭据）。用户已授权交接提交，但因上述部署触发，本轮只做到本地 commit。

## 不要做

- 不要新开会话、不要把并发抬过 6、不要强杀有效写入、不要 Stop 全部工人。
- 不要把旧日志包冒充 clean-clone self-contained 交接。

本文件是**指令投递记录**，不是交接正文；交接正文是 `README.md`。
文中出现的 `/workspace/...` 路径是**投递时点的机器本地事实**，不是运行依赖——
接手 agent 只依赖本仓库内容，所有命令见 `README.md` §2 / §3 的仓库相对路径。
