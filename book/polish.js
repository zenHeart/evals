#!/usr/bin/env node
/**
 * polish.js — 为 evals 书籍 32 章添加
 *   1. ⚠️ 5 个常见错误 小节
 *   2. 📋 本章 Cheat Sheet 小节
 *   3. 关键类比本地化替换 (在 prose 中,跳过代码 fence;使用词边界,避免破坏代码标识符)
 *
 * 跳过已包含两节的章节 (9, 11, 12)。22, 30 已有相似小节,新增标准模板。
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CHAPTERS_DIR = "book/chapters";

const SKIP_FILES = new Set([
  "chapter-09-hardcore-benchmarks.md",
  "chapter-11-vertical-benchmarks.md",
  "chapter-12-live-benchmarks.md",
]);

// 5 个常见错误 (每章量身定制)
const ERRORS = {
  "chapter-00-glossary.md": [
    ["把术语当口语用", "RLHF/Loss 都有精确含义,不要用'AI 训练得好'代替,区分术语和业务语言。"],
    ["只看名词不看示例", "首次出现必须配前端类比,只看定义等于没看。"],
    ["跳过术语直接看代码", "没理解 Token/Temperature 之前看代码会一直卡壳。"],
    ["中英文混用术语", "定下中文译法后在全章统一,避免一会 Token 一会标记。"],
    ["把术语当万能解释", "MMLU 是基准不是任务,'用 MMLU 评估'这种说法是病句。"],
  ],
  "chapter-01-what-is-eval.md": [
    ["把基准当评估", "基准是题库,评估是跑分动作 + 报告,两者不是一回事。"],
    ["只看分数不看指标", "accuracy 80% 可能是闭卷答题 80%,要关心指标定义本身。"],
    ["忽略样本量", "100 题里 80 分 ≈ [70%, 87%],小样本评估不可靠。"],
    ["凭一次分数选模型", "至少跑 3 个基准交叉看,单榜第一 = 单点优化。"],
    ["把刷榜当真", "训练数据可能已包含测试题,看到暴增先查 contamination。"],
  ],
  "chapter-02-eval-5w1h.md": [
    ["Why 没问清就跑", "没想清楚'为什么评估'就启动 = 100% 浪费时间。"],
    ["只评模型不评系统", "真实业务受 prompt/RAG/工具/编排 5 层影响,只评模型是片面的。"],
    ["数据集 < 500 题", "100 题的'90% 准确率'误差可能 ±5%,小样本不可靠。"],
    ["用单一指标决策", "accuracy 高 ≠ 用户满意,至少配 2-3 个指标。"],
    ["评估完不写决策", "评估报告必须含 1 个明确决策(选/不选/回滚),否则等于没评估。"],
  ],
  "chapter-03-standard-pipeline.md": [
    ["推理结果没缓存", "1000 题重跑一次浪费 $50,所有推理结果必须落本地 JSONL。"],
    ["评分时改了 prompt", "模型 A 用 prompt X、模型 B 用 prompt Y → 分数不可比。"],
    ["temperature 不固定", "温度 0.7 跑 5 次平均 ≠ 温度 0,评估必须固定 temperature=0。"],
    ["没看错误样例", "只看总分 = 错的只看数字,错误样例的信息量大 10 倍。"],
    ["代码 fence 没闭合", "四步法写报告时 markdown 没闭合 → 下游解析炸。"],
  ],
  "chapter-04-core-principles.md": [
    ["只报点估计不报区间", "必须给 95% CI + n,否则 80.5% vs 79.8% 的差异是噪声。"],
    ["用 accuracy 评估不平衡数据", "永远预测'否'就能 90% 准确率,改用 F1/AUC。"],
    ["LLM Judge 不固定 temperature", "温度变化导致分数波动,必须固定 0。"],
    ["不检查 Cohen's Kappa", "人类都不一致的题不能用,先算 Kappa 再用基准。"],
    ["忽视校准", "高 confidence 但错的 = 自信地胡说,ECE > 0.1 必须告警。"],
  ],
  "chapter-05-knowledge-reasoning.md": [
    ["以为 MMLU = 一切", "MMLU 是学科知识,不能反映推理/工程/安全等能力。"],
    ["忽视数据污染", "训练数据可能已包含 MMLU 题,看到暴涨先查 contamination。"],
    ["把 MMLU-Pro 当 MMLU", "选项 10 个 ≠ 4 个,题目也删了简单题,分数不可直接比。"],
    ["用 CMMLU 评估英文模型", "中文基准 ≠ 英文基准,跨语言跑分毫无意义。"],
    ["ARC-AGI 分数高 = AGI", "ARC-AGI 只测图形抽象,与真实 AGI 差距仍很大。"],
  ],
  "chapter-06-math-logic.md": [
    ["用 GSM8K 区分模型", "已被刷到 96%+,区分度接近 0,改用 MATH/AIME。"],
    ["数字匹配替代等价比较", "'答案是 72' ≠ '\\boxed{72}',必须用数学等价比较。"],
    ["忽视温度参数", "数学题必须 temperature=0,否则每次答案不同。"],
    ["以为 MATH 高分 = 真推理", "MATH 高分可能是模式匹配,看错误样例判断推理能力。"],
    ["GPQA 跨学科比平均", "物理/化学/生物要分开看,平均分掩盖单科弱项。"],
  ],
  "chapter-07-code.md": [
    ["只看 HumanEval pass@1", "pass@1 高 ≠ 真实工程强,SWE-bench 才是金标准。"],
    ["用字符串匹配打分", "代码必须真实执行,不是 stdout.trim() === expected。"],
    ["不记录 pass@k", "pass@10 能反映'探索能力',只看 pass@1 浪费信息。"],
    ["以为 SWE-bench Verified = 全", "SWE-bench Live 才是持续更新版,Verified 可能已污染。"],
    ["Text-to-SQL 用 exact match", "SQL 等价才算对,大小写/空格差异要用执行验证。"],
  ],
  "chapter-08-multimodal.md": [
    ["用单一基准决策", "MMMU/MMBench/ChartQA 各测不同能力,综合看才能避免偏科。"],
    ["忽视 OCR 失败的根因", "OCR 失败 ≠ 视觉失败,要拆解'读字'与'理解'。"],
    ["用 POPE 单题决策", "POPE 是是/否,复杂幻觉要用 HallusionBench。"],
    ["图像预处理不统一", "不同模型分辨率/归一化不同 → 同样图像输入实际不同。"],
    ["把视觉幻觉和事实幻觉混为一谈", "视觉幻觉是'看到不存在的',事实幻觉是'编造的',测法不同。"],
  ],
  "chapter-10-long-context-safety-agent.md": [
    ["只看 NIAH 报告长上下文", "NIAH 太简单,RULER 13 个任务才能反映真实能力。"],
    ["忽视位置偏差", "针在不同位置难度不同,跑全位置取平均才公平。"],
    ["用 TruthfulQA MC1 决策", "MC1 单选 vs MC2 多选概率,MC2 更能反映真实性。"],
    ["HarmBench 不分严重度", "化学武器 vs 骚扰同样计分 = 不合理,加权。"],
    ["WebArena 高分 = Agent 强", "WebArena 是网页 Agent,不能代表 OS/客服/工具 Agent。"],
  ],
  "chapter-13-preference-llm-as-judge.md": [
    ["LLM Judge 不去偏", "位置/长度/自偏好/格式 4 偏差不处理 = 分数虚高。"],
    ["Arena 数据只看英文", "投票者人群偏英文,中文应用直接看 Arena 会被误导。"],
    ["AlpacaEval 不控制长度", "GPT-4 偏好长答案,LC Win Rate 才是控制长度的指标。"],
    ["用单一 judge 模型", "GPT-4 评 GPT-4 = 自偏好,换 Claude/Gemini 多模型投票。"],
    ["MT-Bench 80 题不够", "样本量小方差大,MT-Bench++ 加难题才稳定。"],
  ],
  "chapter-14-reading-vendor-reports.md": [
    ["只看 MMLU 分数", "MMLU 已刷到 88%+,区分度低,看 GPQA/SWE-bench/Arena 才有信息。"],
    ["不看 few-shot 数量", "'MMLU 88.7%' 不写 5-shot/25-shot = 不可复现,警惕。"],
    ["不查温度参数", "温度不固定 = 分数波动,必须看清是否 temp=0。"],
    ["信厂商 prompt 模板", "未公开 prompt = 不可复现,警惕刷榜。"],
    ["只看被报的评估", "延迟/长上下文/成本/失败模式往往不报,这些才是选型关键。"],
  ],
  "chapter-15-third-party-leaderboards.md": [
    ["只看一个榜单", "Arena/HF/AA/SEAL/OpenCompass 各有偏差,综合 3-5 个才对账。"],
    ["跨榜单直接比分数", "不同榜单题目/评分不同,排名能比,分数不能比。"],
    ["用 HF 旧版", "Open LLM Leaderboard v1 已停更,2024 年后用 v2。"],
    ["忽略速度成本", "质量第一 ≠ 选最佳,Artificial Analysis 性价比榜要看。"],
    ["专家评估当众包", "SEAL 是专家不是众包,测的是企业任务,不是 Arena 风格。"],
  ],
  "chapter-16-frameworks-landscape.md": [
    ["一上来就用 lm-eval-harness", "中文场景先看 OpenCompass,RAG 先看 RAGAS,框架选错=重写。"],
    ["用框架 = 不要自建", "30 行自建能跑通再用框架,框架黑盒会掩盖 bug。"],
    ["以为框架支持所有模型", "OpenAI/Anthropic 容易,自定义模型/HuggingFace 需适配。"],
    ["不读框架源码", "框架有 bug,你不知道评分逻辑 = 分数不可信。"],
    ["红队评估用普通框架", "Garak/PyRIT 是专业红队,DeepEval 不能替代渗透测试。"],
  ],
  "chapter-17-build-mini-evaluator.md": [
    ["30 行版本就发布", "30 行只有单线程,加并发/缓存/重试才是工程级。"],
    ["缓存 key 设计错", "用 prompt 全文作 key 太长,改用 prompt hash 或 model+prompt。"],
    ["重试无限循环", "retries=∞ 遇持续 5xx 会卡死,设上限 + 指数退避。"],
    ["并发数无限制", "pLimit 不设上限会触发 API 限流,默认 5-10。"],
    ["不存推理结果", "内存跑完就丢,debug 时无法复盘。"],
  ],
  "chapter-18-llm-as-judge.md": [
    ["Judge 用同源模型", "GPT-4 评 GPT-4 = 自偏好偏差,换 Claude/Gemini。"],
    ["位置固定", "A/B 顺序不交换 = 位置偏差,跑两次取一致结果。"],
    ["不要求 JSON 输出", "自由文本解析脆弱,强制 response_format: json_object。"],
    ["温度不固定", "温度 = 0 是稳定评分的前提,1.0 = 每次不同。"],
    ["单题 Judge", "开放式任务一条 prompt 评一条 = 不可信,加 CoT + 多次采样投票。"],
  ],
  "chapter-19-human-evaluation.md": [
    ["1 个评估员评所有", "1 个人看法 = 个人观点,至少 3 人评 + 算 Kappa。"],
    ["不培训评估员", "评估员对题目理解不一致 → Kappa 低,先培训再评。"],
    ["不盲评", "评估员知道模型身份 = 偏见,blinding 必须严格执行。"],
    ["一次评完不抽检", "评估员前 10 题 vs 后 10 题可能漂移,定期抽检。"],
    ["Bradley-Terry 当 Elo", "BT 假设独立对战,Elo 假设动态,数据少用 BT 多用 Elo。"],
  ],
  "chapter-20-rag-agent-eval.md": [
    ["只看 RAGAS 总分", "Faithfulness/Relevance/Context Precision 分项看,总分掩盖问题。"],
    ["不评估检索", "检索召不回 = 模型再强也没用,先看 Recall@K。"],
    ["Agent 评估只看 pass/fail", "Agent 任务可拆步骤,看每步正确率才能定位失败。"],
    ["用真实 API 不限流", "Agent 跑 1000 题触发限流,失败率虚高,本地 mock 先跑通。"],
    ["LangSmith 当监控", "LangSmith 是 trace 工具不是监控,生产监控要 Prometheus/Grafana。"],
  ],
  "chapter-21-red-team-safety.md": [
    ["一次红队完事", "模型迭代 = 红队也要持续化,Garak/Cybench 跑 cron。"],
    ["只看是否拒答", "拒答 ≠ 安全,要看拒答后的引导话术是否合理。"],
    ["用单一工具", "Garak 偏静态,PyRIT 偏动态,DeepTeam 偏自动化,多工具交叉。"],
    ["Prompt injection 当单元测试", "OWASP LLM Top 10 至少 6 类要测,不是只测 prompt injection。"],
    ["忽视中文场景", "CValues/SafetyBench/ToxiCN 中文,英文安全 ≠ 中文安全。"],
  ],
  "chapter-22-what-to-evaluate.md": [
    ["只看准确率", "准确率 99% ≠ 用户满意,加 CSAT/Faithfulness/Helpfulness。"],
    ["忽略失败成本", "'拒答'OK,'编造答案'危险 → 不对称加权。"],
    ["测试集与真实分布脱节", "测试 5 分类、真实 100 意图 → 真实数据优先。"],
    ["评估高分就发布", "MMLU 90% ≠ 业务 90%,业务 hold-out 测试必做。"],
    ["能力维度没拆解", "直接写测试集是错的第一步,业务目标 → 能力 → 指标才对。"],
  ],
  "chapter-23-build-test-set.md": [
    ["只用公开数据", "公开集污染严重,必须配真实回流 + 人工编写。"],
    ["测试集一锤子买卖", "不发新题 = 永远在测过去,每月加 5% 新题。"],
    ["LLM 合成不审核", "LLM 生成题质量参差,人工审核 100% 才能用。"],
    ["不标题目难度", "没有难度标注 = 没法分层分析,必须标 easy/medium/hard。"],
    ["测试集无版本管理", "v1/v2 不分 = 历史对比不可能,Git 管理 + 改动说明。"],
  ],
  "chapter-24-ci-cd-pipeline.md": [
    ["PR 跑全量评估", "PR 跑 1w 道题 2 小时,工程师失去耐心,只跑子集。"],
    ["每日定时不查结果", "cron 跑了不看 = 评估白做,结果要推到 Slack/邮件。"],
    ["灰度评估只看分数", "灰度要看延迟/错误率/用户反馈,不只看分数。"],
    ["回归检测阈值过严", "1 分波动就告警 = 噪声淹没问题,设 2-3 分阈值。"],
    ["结果展示只给数字", "给错误样例 Top 10,工程师能直接定位问题。"],
  ],
  "chapter-25-online-ab.md": [
    ["A/B 实验只看转化率", "延迟/留存/差评也要看,综合指标才不片面。"],
    ["流量分配 50/50", "新模型 50% 风险大,先 1% 灰度再扩。"],
    ["不计算显著性", "1% 提升可能是噪声,p < 0.05 才决策。"],
    ["只看均值不看分布", "P50/P90/P99 三档都看,长尾问题才暴露。"],
    ["在线评估 = 离线放弃", "在线离线互为补充,不是替代,见 §25.10。"],
  ],
  "chapter-26-meta-evaluation.md": [
    ["Judge 与人一致率 < 80% 还敢用", "与人类一致率 < 0.7 的 Judge 不可信,先改进 Judge。"],
    ["一次元评估完事", "模型迭代 → Judge 也要迭代,每月跑一次元评估。"],
    ["只看准确率不看偏差", "Judge 准但偏好长答案 = 不可信,看相关性 + 偏差。"],
    ["Meta 的 Meta 没完", "评估 Judge 的 Judge 也会有偏差,接受'够用就好'。"],
    ["忽视边界用例", "边缘案例最容易暴露 Judge 缺陷,必须有 adversarial 测试集。"],
  ],
  "chapter-27-case-customer-rag.md": [
    ["只测准确率不测幻觉", "RAG 客服最危险是'编造政策',幻觉率 < 1% 才上线。"],
    ["用公开 CSAT 问卷", "CSAT 与业务强相关,公开问卷数字只是参考。"],
    ["灰度只看分数", "灰度期关键看'真实差评率',不只看评估分数。"],
    ["月度复盘只报数字", "只报数字工程师学不到东西,Top 5 错误样例必看。"],
    ["持续监控只告警不分析", "告警太多 = 没人看 = 监控失效,告警要分级 + 行动指南。"],
  ],
  "chapter-28-case-code-agent.md": [
    ["只看 SWE-bench pass rate", "Pass 率 30% 不等于'能修你的 bug',看子集与你业务相似度。"],
    ["不区分自动 vs 业务评估", "自动评估便宜但粗,业务评估贵但准,3 层都要有。"],
    ["人工评估不标维度", "只给 1-5 分没信息,维度化(正确性/可读性/安全/性能)。"],
    ["SWE-bench 风格评估本地跑不动", "SWE-bench Verified 需要 Docker 环境,本地要先 mock 5 题验证。"],
    ["评估完不回归", "新 prompt 上线不复盘 → 下次踩同一个坑,每次评估写 lessons learned。"],
  ],
  "chapter-29-case-multimodal.md": [
    ["只看 OCRBench 总分", "OCR 题型多样(印刷/手写/罕见字),分项看才有信息。"],
    ["公式识别只看字符", "LaTeX 结构化才算对,只看字符会有 '\\frac' 错位。"],
    ["视觉幻觉只看准确率", "幻觉要分类型(物体/属性/关系)看,误判率要单独算。"],
    ["多语言 OCR 用单一模型", "中文 OCR 强 ≠ 英文 OCR 强,多语言基准分开跑。"],
    ["Pipeline 不存中间结果", "OCR → 公式 → 推理,中间结果不存 = debug 困难。"],
  ],
  "chapter-30-resources-glossary.md": [
    ["收藏 = 用过", "收藏 100 个 GitHub repo 没用,真正跑过 1-2 个才有体感。"],
    ["只看博客不看论文", "博客快但浅,论文慢但系统,基础概念必须看论文。"],
    ["榜单分数当真理", "榜单会过时(2026 还在用 2024 数据),看发布时间 + 数据截止。"],
    ["Cheat Sheet 当 cheat", "Cheat Sheet 是速查不是替代,基础还是要读章节正文。"],
    ["资源列表不更新", "工具迭代快,资源列表每 6 个月 review 一次。"],
  ],
  "chapter-31-self-test-faq.md": [
    ["做一遍自测就过", "做完不复盘 = 没做,错题要写 lessons learned。"],
    ["FAQ 当答案", "FAQ 是常见问题不是标准答案,具体场景具体分析。"],
    ["学习路径跳章", "跳过基础看高级 = 看天书,按推荐顺序学习。"],
    ["只读中文不读英文", "LLM 评估英文资料 5x 中文,英文阅读能力必要。"],
    ["学完不实践", "学完不做 = 1 周忘光,边学边做 mini evaluator。"],
  ],
};

// Cheat Sheet 内容
const CHEAT = {
  "chapter-00-glossary.md": [
    ["LLM", "大语言模型,通识 + 文字接龙", "§0.3"],
    ["Token", "模型处理的最小文本单位", "§0.3"],
    ["Prompt", "给模型的输入", "§0.3"],
    ["Benchmark", "一组任务 + 评分规则", "§0.3"],
    ["Metric", "具体评分规则", "§0.3"],
    ["LLM-as-Judge", "用 LLM 评估 LLM", "§0.3"],
    ["RAG", "检索增强生成,开卷考试", "§0.3"],
    ["Agent", "能调工具的 LLM 系统", "§0.3"],
    ["Hallucination", "一本正经地胡说", "§0.4"],
  ],
  "chapter-01-what-is-eval.md": [
    ["评估", "可重复规则给模型打分", "§1.2"],
    ["基准 Benchmark", "题库", "§1.4"],
    ["指标 Metric", "评分规则", "§1.4"],
    ["评分器 Judge", "实际打分的程序/模型", "§1.4"],
    ["选型/回归/改进", "评估的 3 个目的", "§1.3"],
    ["数据污染", "训练数据包含测试题", "§1.6"],
  ],
  "chapter-02-eval-5w1h.md": [
    ["5W1H", "Why/What/Who/When/Where/How", "§2.2"],
    ["离线评估", "跑固定数据集,可复现", "§2.4"],
    ["在线评估", "真实用户请求,持续波动", "§2.4"],
    ["Reference-based", "有标准答案", "§2.4"],
    ["Reference-free", "无标准答案,LLM Judge/人类", "§2.4"],
    ["评估的 4 个时间点", "训练前/训练中/训练后/上线后", "§2.3"],
    ["评估对象 5 层", "模型/Prompt/上下文/工具/编排", "§2.5"],
  ],
  "chapter-03-standard-pipeline.md": [
    ["四步法", "数据集 → 推理 → 评分 → 报告", "§3.2"],
    ["JSONL", "数据集存储格式,每行一个 JSON", "§3.3"],
    ["数据泄露 leakage", "训练数据含测试题", "§3.3"],
    ["pLimit", "并发控制,避免 API 限流", "§3.4"],
    ["Wilson Score Interval", "置信区间计算方法", "§3.6"],
    ["temperature = 0", "评估必须固定", "§3.4"],
  ],
  "chapter-04-core-principles.md": [
    ["Accuracy", "(TP+TN)/总数,不平衡会骗人", "§4.2"],
    ["Precision", "TP/(TP+FP),'说是'中对的", "§4.2"],
    ["Recall", "TP/(TP+FN),'真'中找出的", "§4.2"],
    ["F1", "precision/recall 调和平均", "§4.2"],
    ["95% CI", "真值 95% 落进的区间", "§4.4"],
    ["Cohen's Kappa", "人类一致性指标,>0.7 才信", "§4.5"],
    ["ECE", "校准误差,<0.05 才信", "§4.8"],
  ],
  "chapter-05-knowledge-reasoning.md": [
    ["MMLU", "57 学科 14k 多选,学科知识", "§5.2"],
    ["MMLU-Pro", "10 选项强化版,难 12%", "§5.3"],
    ["CMMLU/C-Eval", "中文版 MMLU", "§5.4"],
    ["AGIEval", "真实考题(高考/考研)", "§5.5"],
    ["HellaSwag", "常识续写 4 选 1", "§5.6"],
    ["ARC-AGI", "图形抽象推理,AGI 试金石", "§5.9"],
  ],
  "chapter-06-math-logic.md": [
    ["GSM8K", "小学数学 8.5k,CoT 开山", "§6.3"],
    ["MATH", "高中竞赛 12.5k", "§6.4"],
    ["AIME", "美国奥赛,30 题/年", "§6.6"],
    ["FrontierMath", "研究级数学,AGI 信号", "§6.7"],
    ["GPQA", "博士级科学,人类 65%", "§6.8"],
    ["MathVista", "视觉 + 数学联合", "§6.9"],
  ],
  "chapter-07-code.md": [
    ["HumanEval", "164 道 Python 函数题", "§7.3"],
    ["MBPP", "974 道 Python 入门", "§7.4"],
    ["LiveCodeBench", "持续更新算法题", "§7.5"],
    ["SWE-bench", "真实 GitHub Issue 修复,金标准", "§7.6"],
    ["pass@k", "k 次里至少 1 次通过", "§7.3"],
    ["Spider/BIRD", "Text-to-SQL 专项", "§7.10"],
    ["BFCL", "函数调用能力", "§7.11"],
  ],
  "chapter-08-multimodal.md": [
    ["MMMU", "多学科多模态 11.5k", "§8.3"],
    ["MMBench", "综合视觉 3k,20 维度", "§8.4"],
    ["MathVista", "视觉 + 数学", "§8.5"],
    ["ChartQA", "图表理解 9.6k", "§8.6"],
    ["DocVQA", "文档理解 10k", "§8.7"],
    ["POPE", "视觉幻觉是/否", "§8.10"],
    ["HallusionBench", "高级幻觉 460", "§8.11"],
  ],
  "chapter-10-long-context-safety-agent.md": [
    ["NIAH", "长上下文探针,简单", "§10.2"],
    ["RULER", "13 任务长上下文金标准", "§10.2"],
    ["LongBench", "中文长上下文 21 数据集", "§10.2"],
    ["TruthfulQA", "事实性 817 题,人类 94%", "§10.3"],
    ["HarmBench", "安全 510 类有害行为", "§10.4"],
    ["WebArena", "网页 Agent 812 任务", "§10.5"],
    ["GAIA", "通用 AI 助手 466 题", "§10.5"],
    ["OSWorld", "OS Agent 评估", "§10.5"],
  ],
  "chapter-13-preference-llm-as-judge.md": [
    ["MT-Bench", "8 类多轮对话 80 题", "§13.3"],
    ["Chatbot Arena", "真实人类盲评,Elo 排序", "§13.4"],
    ["AlpacaEval", "自动化 Arena,805 题", "§13.5"],
    ["CompassRank", "OpenCompass 中文偏好榜", "§13.6"],
    ["Elo", "胜率排序,类似王者段位", "§13.4"],
    ["LLM Judge 4 偏差", "位置/长度/自偏好/格式", "§13.8"],
  ],
  "chapter-14-reading-vendor-reports.md": [
    ["报告结构", "摘要/训练数据/训练方法/评估表/安全/局限", "§14.2"],
    ["必看 4 类", "MMLU/GPQA/Arena/HumanEval+SWE-bench", "§14.5"],
    ["few-shot 数量", "必须看清 0/5/25-shot", "§14.6"],
    ["温度参数", "temp=0 才是稳", "§14.6"],
    ["prompt 公开", "未公开 = 不可复现", "§14.6"],
    ["Cherry-pick", "自选 100 题打分 = 自欺", "§14.6"],
  ],
  "chapter-15-third-party-leaderboards.md": [
    ["LMSYS Arena", "真实人类盲评,实时", "§15.3"],
    ["HF Open LLM v2", "开源 6 基准", "§15.4"],
    ["Artificial Analysis", "速度 + 成本 + 质量", "§15.5"],
    ["SEAL", "Scale AI 专家评估", "§15.6"],
    ["OpenCompass", "中文榜单,100+ 模型", "§15.7"],
    ["对账", "跨榜单交叉验证", "§15.8"],
  ],
  "chapter-16-frameworks-landscape.md": [
    ["lm-eval-harness", "EleutherAI 学术标准,200+ 任务", "§16.3"],
    ["OpenCompass", "中文评估最强,上海 AI Lab", "§16.4"],
    ["HELM", "Stanford 多指标综合", "§16.5"],
    ["RAGAS", "RAG 评估主流框架", "§16.8"],
    ["DeepEval", "应用层 LLM 评估", "§16.9"],
    ["Garak", "NVIDIA 红队框架", "§16.15"],
    ["PyRIT", "Microsoft 红队框架", "§16.16"],
  ],
  "chapter-17-build-mini-evaluator.md": [
    ["Mini Evaluator", "题目 → 模型 → 评分 → 汇总", "§17.2"],
    ["pLimit", "并发控制,默认 5-10", "§17.3"],
    ["LRUCache", "缓存推理结果,省钱", "§17.3"],
    ["指数退避", "重试间隔 1s/2s/4s", "§17.3"],
    ["GitHub Actions", "PR 触发评估", "§17.6"],
  ],
  "chapter-18-llm-as-judge.md": [
    ["LLM-as-Judge", "用强 LLM 评弱 LLM", "§18.2"],
    ["位置偏差", "偏好第一个/最后一个", "§18.3"],
    ["长度偏差", "偏好长答案", "§18.3"],
    ["自偏好", "GPT-4 偏好 GPT-4", "§18.3"],
    ["格式偏差", "偏好 markdown/bullet", "§18.3"],
    ["Pairwise", "A vs B 谁更好", "§18.6"],
    ["CoT 评分", "让 Judge 先思考再判", "§18.7"],
  ],
  "chapter-19-human-evaluation.md": [
    ["人类评估", "可用性测试的 LLM 版本", "§19.2"],
    ["Elo", "胜率排序", "§19.4"],
    ["Bradley-Terry", "统计化的偏好模型", "§19.5"],
    ["Cohen's Kappa", "评估员一致性,>0.7", "§19.3"],
    ["盲评", "评估员不知模型身份", "§19.6"],
    ["评估员培训", "Kappa 低 = 培训不到位", "§19.6"],
  ],
  "chapter-20-rag-agent-eval.md": [
    ["RAG 4 维度", "Faithfulness/Relevance/Context/Answer", "§20.2"],
    ["RAGAS", "RAG 评估框架", "§20.3"],
    ["TruLens", "RAG + Agent 评估", "§20.4"],
    ["Agent 评估", "拆步骤看每步正确率", "§20.5"],
    ["LangSmith", "trace 工具", "§20.7"],
    ["生产监控", "实时告警 + 抽样", "§20.6"],
  ],
  "chapter-21-red-team-safety.md": [
    ["红队评估", "渗透测试的 LLM 版本", "§21.2"],
    ["OWASP LLM Top 10", "10 类 LLM 安全风险", "§21.4"],
    ["Garak", "NVIDIA 红队框架", "§21.5"],
    ["PyRIT", "Microsoft 红队框架", "§21.6"],
    ["Prompt Injection", "提示注入攻击", "§21.7"],
    ["中文安全", "CValues/SafetyBench/ToxiCN", "§21.9"],
    ["红队持续化", "随模型迭代 cron 跑", "§21.11"],
  ],
  "chapter-22-what-to-evaluate.md": [
    ["业务目标 → 能力 → 指标 → 测试集", "核心方法论", "§22.2"],
    ["能力拆解 4 方法", "用户旅程/FMEA/KPI 反推/竞品", "§22.3"],
    ["指标 5 原则", "可测/业务/复现/对比/监控", "§22.5"],
    ["MVP → 扩展 → 自动化 → A/B", "部署路径", "§22.7"],
    ["Hold-out 评估", "20% 真实数据不参与训练", "§22.7"],
  ],
  "chapter-23-build-test-set.md": [
    ["4 来源", "公开 20% + 人工 30% + 回流 30% + 合成 20%", "§23.2"],
    ["数据污染", "测试题混进训练集", "§23.8"],
    ["难度分层", "easy/medium/hard", "§23.3"],
    ["题目 Checklist", "题目/答案/类别/难度/来源/版本", "§23.4"],
    ["版本管理", "Git + 改动说明", "§23.9"],
    ["500 题起", "小样本不可靠", "§23.10"],
  ],
  "chapter-24-ci-cd-pipeline.md": [
    ["3 时机", "PR 5 分钟 / 每日 1 小时 / 发版全量", "§24.2"],
    ["PR 回归", "200-500 题快速子集", "§24.3"],
    ["每日定时", "cron + 完整基准", "§24.4"],
    ["灰度评估", "新模型 1% → 10% → 50%", "§24.6"],
    ["回归检测", "分数波动 2-3 分告警", "§24.5"],
    ["报告结构", "总体/分类/错误 Top10", "§24.7"],
  ],
  "chapter-25-online-ab.md": [
    ["A/B 实验", "在线评估金标准", "§25.3"],
    ["流量分配", "1% 灰度起步", "§25.4"],
    ["显著性检验", "p < 0.05 才决策", "§25.6"],
    ["P50/P90/P99", "长尾问题看 P99", "§25.5"],
    ["4 大陷阱", "辛普森悖论/新奇效应/瓶中效应/存活偏差", "§25.7"],
    ["MVT", "多变量测试", "§25.9"],
  ],
  "chapter-26-meta-evaluation.md": [
    ["元评估", "评估的评估", "§26.2"],
    ["与人类一致率", "≥ 80% 才可信", "§26.4"],
    ["偏差检测", "位置/长度/自偏好", "§26.3"],
    ["Meta 失效", "Judge 也会有偏差", "§26.10"],
    ["Adversarial 测试", "边界用例暴露缺陷", "§26.3"],
  ],
  "chapter-27-case-customer-rag.md": [
    ["业务目标", "CSAT ≥ 4.5 + 幻觉率 < 1%", "§27.2"],
    ["RAG 4 指标", "Faithfulness/Relevance/Context Precision/Recall", "§27.3"],
    ["真实回流", "10% 真实对话进测试集", "§27.7"],
    ["灰度发布", "1% → 10% → 50%", "§27.6"],
    ["月度复盘", "Top 5 错误样例必看", "§27.8"],
  ],
  "chapter-28-case-code-agent.md": [
    ["3 层评估", "自动(SWE-bench)/业务/人工", "§28.2"],
    ["SWE-bench Verified", "500 题金标准", "§28.7"],
    ["业务 hold-out", "你仓库的真实 issue", "§28.4"],
    ["人工 5 维度", "正确性/可读性/安全/性能/风格", "§28.5"],
    ["Lessons learned", "每次评估必写", "§28.7"],
  ],
  "chapter-29-case-multimodal.md": [
    ["OCR 4 子任务", "印刷/手写/文档/罕见字", "§29.4"],
    ["公式识别", "LaTeX 结构化才算对", "§29.5"],
    ["视觉幻觉", "物体/属性/关系分类型", "§29.6"],
    ["多语言 OCR", "中英日韩分开测", "§29.7"],
    ["Pipeline", "OCR → 公式 → 推理,中间结果存档", "§29.8"],
  ],
  "chapter-30-resources-glossary.md": [
    ["4 步评估法", "数据集/模型/评分/报告", "§30.10"],
    ["5W1H", "Why/What/Who/When/Where/How", "§30.10"],
    ["必看 4 基准", "MMLU/GPQA/Arena/HumanEval+SWE-bench", "§30.10"],
    ["Judge 4 偏差", "位置/长度/自偏好/格式", "§30.10"],
    ["评估时机", "PR 5m / 每日 1h / 发版全量", "§30.10"],
    ["4 来源测试集", "公开 20% + 人工 30% + 回流 30% + 合成 20%", "§30.10"],
    ["黄金公式", "业务 → 能力 → 指标 → 测试集", "§30.10"],
  ],
  "chapter-31-self-test-faq.md": [
    ["8 题结课自测", "评估学习效果", "§31.2"],
    ["20 FAQ", "常见疑问速查", "§31.3"],
    ["学习路径", "按推荐顺序学习", "§31.4"],
    ["推荐资源", "10+ 必看博客/论文", "§31.5"],
    ["关键金句", "全书要点", "§31.6"],
    ["终极验收", "10 题综合题", "§31.9"],
  ],
};

// 类比本地化映射 (大小写敏感 + 词边界,避免破坏代码标识符)
const ANALOGY_MAP = [
  // 复合优先
  { from: /\bSAT\s*\+\s*GRE\b/g, to: "高考 + 考研" },
  { from: /\bSAT\b/g, to: "高考" },
  { from: /\bGRE\b/g, to: "考研" },
  { from: /国际象棋\s*\+\s*围棋/g, to: "麻将 + 围棋" },
  { from: /\bchess\b/g, to: "围棋" },
  { from: /国际象棋/g, to: "麻将" },
  { from: /\bNetflix\b/g, to: "爱奇艺" },
  { from: /维基百科/g, to: "百度百科" },
  { from: /\bMcDonald'?s?\b/g, to: "美团" },
  { from: /麦当劳/g, to: "美团" },
  { from: /\bTwitter\b/g, to: "微博" },
  { from: /推特/g, to: "微博" },
  { from: /Google\s+搜索/g, to: "百度搜索" },
  { from: /Google\s+Search/g, to: "百度搜索" },
  { from: /\bIMDb\b/g, to: "豆瓣" },
  { from: /\bUber\b/g, to: "滴滴" },
  { from: /\bAirbnb\b/g, to: "途家" },
  { from: /\bAmazon\b/g, to: "淘宝" },
  { from: /\b10-K\b/g, to: "上市公司年报" },
  { from: /\bYelp\b/g, to: "大众点评" },
  { from: /Hacker\s*News/g, to: "V2EX" },
  { from: /Stack\s*Overflow/g, to: "SegmentFault" },
  { from: /\bMedium\b/g, to: "知乎专栏" },
];

function localize(content) {
  // 按行处理,跳过 ```code``` 块
  const lines = content.split(/\r?\n/);
  let inFence = false;
  const out = [];
  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }
    let processed = line;
    for (const { from, to } of ANALOGY_MAP) {
      processed = processed.replace(from, to);
    }
    out.push(processed);
  }
  return out.join("\n");
}

function chapterNumOf(file) {
  return Number(file.match(/^chapter-(\d+)/)[1]);
}

function maxH2(lines, N) {
  let m = 0;
  const re = new RegExp(`^## ${N}\\.(\\d+)\\s`);
  for (const ln of lines) {
    const mt = ln.match(re);
    if (mt) m = Math.max(m, Number(mt[1]));
  }
  return m;
}

function findInsertPos(lines) {
  // 找最后一个 "## N.M 验收自测" 或 "## N.M 延伸阅读" 行
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/^## \d+\.\d+\s+(验收自测|延伸阅读)/.test(lines[i])) return i;
  }
  return -1;
}

function renumberAfter(lines, N, startFrom, offset) {
  const reH2 = new RegExp(`^## ${N}\\.(\\d+)\\s`);
  const out = [];
  for (const ln of lines) {
    const mt = ln.match(reH2);
    if (mt) {
      const num = Number(mt[1]);
      if (num >= startFrom) {
        out.push(ln.replace(reH2, `## ${N}.${num + offset} `));
      } else {
        out.push(ln);
      }
    } else {
      out.push(ln);
    }
  }
  return out;
}

function buildCheat(N, cheatM, rows) {
  const lines = [`## ${N}.${cheatM} 📋 本章 Cheat Sheet`, ``,
    `| 概念 | 一句话 | 详见 |`,
    `|---|---|---|`];
  for (const r of rows) lines.push(`| ${r[0]} | ${r[1]} | ${r[2]} |`);
  lines.push(``);
  return lines.join("\n");
}

function buildErrors(N, errM, rows) {
  const lines = [`## ${N}.${errM} ⚠️ 5 个常见错误`, ``];
  rows.forEach((r, i) => {
    lines.push(`${i + 1}. **${r[0]}** — ${r[1]}`);
  });
  lines.push(``);
  return lines.join("\n");
}

function processFile(file) {
  const path = join(CHAPTERS_DIR, file);
  let content = readFileSync(path, "utf-8");

  // 1. 类比本地化
  content = localize(content);

  if (SKIP_FILES.has(file)) {
    writeFileSync(path, content, "utf-8");
    return { file, status: "localized-only" };
  }

  const lines = content.split(/\r?\n/);
  const N = chapterNumOf(file);

  const insertPos = findInsertPos(lines);
  if (insertPos === -1) {
    return { file, status: "no-insert-position", error: true };
  }

  // 取 insertPos 处 H2 的编号 (要插入到这里,让原 H2 推后)
  const insertLine = lines[insertPos];
  const insertM = Number(insertLine.match(new RegExp(`^## ${N}\\.(\\d+)\\s`))[1]);

  // 新增的两个章节编号
  const cheatM = insertM;
  const errM = insertM + 1;

  // 从 insertM 开始,所有 H2 编号 +2
  let newLines = renumberAfter(lines, N, insertM, 2);

  // 构建新 sections
  const cheatBlock = buildCheat(N, cheatM, CHEAT[file] || []);
  const errBlock = buildErrors(N, errM, ERRORS[file] || []);

  // 插入到 insertPos 之前
  newLines.splice(insertPos, 0, cheatBlock, "", errBlock);

  const newContent = newLines.join("\n");
  writeFileSync(path, newContent, "utf-8");
  return { file, status: "processed" };
}

function main() {
  const files = readdirSync(CHAPTERS_DIR)
    .filter(f => f.endsWith(".md"))
    .sort();

  const results = [];
  for (const f of files) results.push(processFile(f));

  console.log("\n=== 摘要 ===");
  const counts = {};
  for (const r of results) counts[r.status] = (counts[r.status] || 0) + 1;
  console.log(counts);
  for (const r of results) {
    if (r.error) console.log(`  ✗ ${r.file}: ${r.status}`);
    else console.log(`  ✓ ${r.file}: ${r.status}`);
  }
}

main();