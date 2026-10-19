---
vendor: glm
model: GLM-Legal
release: glm-legal
date: 2026-10-12
source: https://z.ai/blog/glm-legal
fetched_at: 2026-10-19
---

# GLM-Legal: Advancing Agentic Legal Intelligence

## 发布要点（转录）

- Z.ai 发布面向法律领域的 agentic 模型 GLM-Legal，定位为"专业协作（Professional Cowork）"方向的垂直领域模型：需要消化碎片化源文件、结构化专业知识、在完整执行生命周期内保持领域严谨性。
- 官方从三个轴评估 GLM-Legal：复杂任务执行、专业法律推理、真实法律工作流。
- 底座为轻量的 GLM-5.3-Flash，通过领域 mid-training + 高效率 post-training 扩展专业能力。
- 训练方法三段：① Mid-training 夯实法律基础（扩充高质量法律语料，学习法律概念、成文规则与解释框架）；② Post-training 与 Agent Harness 协同进化（在数万个真实法律环境中做强化学习，Harness 作为运行时编排框架管理任务上下文、连接工具集并路由执行反馈，与模型训练锁步迭代）；③ 生产反馈闭环（法律从业者按"关键问题与边缘case是否覆盖、论据是否有依据与引用是否合法、交付物是否严格贴合案情简报、下游团队能否直接使用"四条标准评估输出，把主观质量转成工程损失信号回灌训练与 Harness 设计）。
- 官方称 Harvey LAB 与 LegalBench 的结果由 Vals 独立评测，链接 https://www.vals.ai/models/zai_glm-legal 。
- 即将接入 AutoClaw（桌面原生 agent 平台，https://autoclaw.z.ai ），官方给出合同审查、证据分析、跨境合规研究三个示例任务及 GLM-5.3-Flash 对照输出。
- 开放内测申请：https://z.ai/consultation/legal 。
- 官方未披露参数量、上下文长度与定价，故账本记 null。

## 评测数据（DOM 明文，可直接机读）

> 说明：本节数值取自发布页正文的 DOM 文本，可精确定位，账本按 verified 记。官方对 Harvey LAB 与 LegalBench 两项明确说明由 Vals 独立评测，故这两行按第三方转述（third_party_reported）处理；PLawBench 未在 Vals 评测句中覆盖，按自报（vendor_reported）处理。

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Harvey LAB | 19.2% | all-pass rate。原句 "GLM-Legal achieved a 19.2% all-pass rate on Harvey LAB"；Benchmark Highlights 段复述 "scores 19.2% and improves on its base model by 12.5 percentage points"；由 Vals 独立评测 |
| LegalBench | 未给数值 | 官方只作定性描述："matching frontier closed-source models on LegalBench"、"parses specialized contracts, merger filings, and judicial opinions with the precision of top closed-source frontier models"；由 Vals 独立评测 |
| PLawBench | 未给数值 | 官方只作定性描述："Achieves parity with leading frontier systems on Chinese legal consultation, case analysis, and document drafting under fine-grained rubrics" |

## 图表与素材

- 页面无评测图表位图；Benchmark Highlights 三项均为正文文本 + 行内小图标。
- `images/bench-1.jpeg` — 官方页内嵌的 GLM-Legal HuggingFace 仓库二维码
- `images/bench-2.jpeg` — 官方页内嵌的通用二维码
- `images/case-image.png` / `images/case-1.jpg` / `images/case-2.png` / `images/case-3.jpg` — AutoClaw 三个法律示例任务的演示截图
- 官方页另含演示视频 `飞书20261012-232737.mp4`（非图片资源，本批未随档保存）

## 规格与定价（官方明示）

| 项 | 值 |
| --- | --- |
| 底座模型 | GLM-5.3-Flash |
| 训练 | mid-training + post-training 强化学习 + 生产反馈闭环，Harness 协同进化 |
| 参数量 | 未披露（null） |
| 上下文长度 | 未披露（null） |
| 定价 | 未披露（null） |
| 接入方式 | 内测申请（z.ai/consultation/legal）；将接入 AutoClaw |
