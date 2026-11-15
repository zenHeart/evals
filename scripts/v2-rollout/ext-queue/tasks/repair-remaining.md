# 任务 EXT-REPAIR：原全量升级范围内、尚未可发布页的有限修复

在 EXT-PUB 的逐页发布器已接管且不要与之抢锁的前提下执行。不要重跑已在 published.tsv / origin/main 为 v2 的合格页。不要编造证据。不要无限重试（每页最多 2 次修复尝试）。

范围（以 /workspace/ext-queue/status/destinations-389.md 为起点，执行时重算唯一 ID）：
1. 缺 out 的历史 accept（曾无法恢复的 5 页：automationbench, biobasicsbench, charxiv-reasoning, cybergym, imo-answerbench）。可再扫会话/partial，找不到合格 v2 就列入拒绝清单，保留线上旧版。
2. accept 但 out 非 v2（stub/无 template 或仍为 v1，约 18 页）：仅在已有证据目录足够时补成可过 check-one+reverify 的 v2；否则拒绝并保留旧版。
3. check-one 失败已记账的页（约 32 页，见 incremental-publish.log）：按规范修数据（缺值用 null、类别对外键以站点 taxonomy / 线上旧档案为准），修不好则隔离记因。finance-agent 为 reject，不上线。

修复合格的页交给现有逐页 publisher（不要另起一套推送，不要凑批）。写拒绝清单 `/workspace/rollout/reject-final.tsv`（id、原因、证据），以及 `/workspace/ext-queue/status/repair-remaining.md`。最后一行 STATUS: DONE 或 STATUS: BLOCKED <原因>。
作者 zenheart <zenheart_register@163.com>；FF 推送、不 force、不提交 epub；只用 glm-self。最多 3 次任务级续跑。
