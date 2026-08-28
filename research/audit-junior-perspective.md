# 初级前端工程师视角内容审查

> 审查者：1-3 年 React/Vue/TypeScript 经验的前端工程师
> 审查对象：`book/chapters/chapter-01-*.md` 至 `chapter-28-*.md`（共 28 章）
> 审查日期：2026-08-28
> 视角：本书自我定位"前端视角"，所以我严格按这个标准审查——任何让"会写 useState 但没碰过 ML 的前端"卡住的地方，都算缺陷。

---

## 总分

| 维度 | 评分 | 评语 |
|---|---|---|
| 概念清晰度 | **3.5 / 5** | 多数章节用前端类比很贴切（LLM ≈ 单元测试），但 10 个核心术语中 7 个首次出现时未定义 |
| 代码可运行性 | **2.5 / 5** | TS 代码小毛病不少；Python 占大半壁江山，但读者是前端；多个示例缺少环境前提 |
| 叙述流畅度 | **3.5 / 5** | 主体连贯，但术语跳变和"前面用、后面讲"问题明显 |
| 覆盖完整性 | **3 / 5** | 缺 streaming / rate-limit / token 计价 / 缓存策略深入；向量库零基础铺垫 |
| 深度准确性 | **4 / 5** | 数学/统计原理讲得正确，几个事实陈述有细微问题（如"LLM 评估 = 单元测试"的过度简化） |
| 章节关联性 | **2.5 / 5** | 缺显式互引；"judge/agent/rag/embedding" 在第 1 章就出现但第 15-17 章才讲 |

**加权总分：3.1 / 5** — 中等偏下。骨架扎实，但读者会在第 1 章就遇到一堆没解释的概念，会弃读。

---

## 关键问题（按严重程度排序）

### P0（必修）

#### 第 1 章 (chapter-01-what-is-eval.md)
- **问题 1**：术语"judge"、"排行榜"、"基准"在第 1.4 节集中抛出，但后续章节才分别详述。
- **原因**：读者被告知"评分器（Judge）"是"Jest runner + assertion 库"，但 runner vs assertion 的区分对前端来说不是陌生词，反而模糊。
- **修复建议**：把"judge"先简单定义为"打分的人或代码"，举例 `expect(answer).toBe(expected)` 中 `expect` 就是 judge；把"基准 = 题目集"的类比固定下来即可，不堆术语。
- **具体行号/段落**：第 60-66 行（3 个表格密集）。

#### 第 1 章 — 30 行 TypeScript 示例
- **问题 2**：用 `import OpenAI from "openai"` 但没说明 `OPENAI_API_KEY` 环境变量如何注入。
- **原因**：前端初学者可能没配过 `.env`。
- **修复建议**：加 1 行 `// 需设置 OPENAI_API_KEY 环境变量` 和 `dotenv.config()` 提示。
- **具体行号**：第 70-107 行。

#### 第 2 章 (chapter-02-eval-5w1h.md)
- **问题 3**："训练前 / 训练中 / 训练后 / 上线后"四阶段——前端工程师**没有训练模型的经验**，直接跳过。
- **原因**：第 2.3 节直接抛出"训练中（SFT/RLHF）"，SFT/RLHF 没任何解释。
- **修复建议**：要么删掉训练阶段（前端选型用不上），要么补 1 段"SFT = 用问答对继续微调，RLHF = 用人类打分强化学习"的极简说明。
- **具体行号**：第 29-43 行。

#### 第 3 章 (chapter-03-standard-pipeline.md)
- **问题 4**：第 3.4 节出现 `temperature: 0` 但**未解释 temperature 是什么**。一个不在循环里的孤立参数，前端会以为是 `tsconfig` 里的 strict。
- **原因**：写作默认读者已经知道 LLM API 参数。
- **修复建议**：在第 3.4 节首次出现时加 1 行注释："temperature 控制回答随机性：0=总是最确定的答案，1=更发散。评估必须固定 0。"
- **具体行号**：第 161 行。

#### 第 4 章 (chapter-04-core-principles.md)
- **问题 5**：`Cohen's Kappa` 概念突然出现，前端工程师没听过。
- **原因**：第 4.5 节直接讲 κ 公式，没铺垫"为什么不是简单 % 一致率"。
- **修复建议**：先举例："2 个评审员评 100 道题，80 道看法一样，p_o = 0.80。但如果有 3 个选项、瞎猜也能猜对 33%，所以 kappa 剔除掉这个'瞎猜一致率'。"
- **具体行号**：第 130-143 行。

#### 第 5 章 (chapter-05-knowledge-reasoning.md)
- **问题 6**：列出 9 个基准（MMLU/CMMLU/HellaSwag/PIQA/WinoGrande/ARC-AGI 等），但**没有统一的"它测什么能力维度"框架**。
- **原因**：每个基准独立介绍，看不出"知识 vs / 推理 vs / 常识"的层次。
- **修复建议**：开头加一张能力维度总表（学科知识 / 常识 / 抽象推理 / 中文 / 真实考试），让读者先看地图再看景点。
- **具体行号**：第 268-280 行汇总表部分已经做了，但每个基准首次出现时仍需要指明"它属于哪个维度"。

#### 第 7 章 (chapter-07-code.md)
- **问题 7**：第 7.3 节 HumanEval 评分代码示例 TypeScript + Python 混用——`execAsync(\`python3 ${file}\`)` 在 Windows 上**默认没有 python3**。
- **原因**：本书读者大概率是 Windows / macOS 前端，`python3` 命令不一定在 PATH。
- **修复建议**：明确提示"需要 Python 3.10+ 环境"或直接改用 Node 跑 JS 题目（多文件处理麻烦，所以建议给出"无 Python 时跳过此章"的提示）。
- **具体行号**：第 45-71 行（humanevalScore 函数）。

- **问题 8**：`passAtK` 公式 `1.0 - comb(n - c, k) / comb(n, k)` 没给 `comb` 函数定义。
- **原因**：第 80-85 行直接调用 `comb`，但整个书没定义它。
- **修复建议**：补 `comb` 辅助函数或加注释"组合数公式 C(n,k) = n! / (k! (n-k)!)"。
- **具体行号**：第 80-85 行。

#### 第 14 章 (chapter-14-build-mini-evaluator.md)
- **问题 9**：第 14.2 节"30 行版本"使用了 **top-level await** 但没用 ESM 标记（`.mts` 或 `"type": "module"`），前端用 `tsx` 或 `node --experimental-strip-types` 直接复制会报错。
- **原因**：前端工程师的 package.json 默认 `type: "commonjs"`，top-level await 报错是常见坑。
- **修复建议**：第 14.2 节开头加 1 段："本节代码需要 ESM 环境（package.json 加 `type: module` 或使用 `.mts` 文件）"。
- **具体行号**：第 16-34 行。

- **问题 10**：第 14.7 节 `eval.ts` 写 React 组件代码到 `./generated/${c.name}.tsx`，但前端工程不可能让 LLM 生成的代码绕过 ESLint / Prettier 直接提交，所以"跑 TypeScript 编译"会失败。
- **原因**：作者把"代码生成评估"理想化了，没有 frontend 工程化现实约束。
- **修复建议**：明确"先 npm install 再跑"或者改成"评估生成的代码片段是否能通过类型检查"，而不是写完整文件。
- **具体行号**：第 264-315 行。

#### 第 17 章 (chapter-17-rag-agent-eval.md)
- **问题 11**：第 17.2 节直接抛出"Context Precision / Context Recall / MRR / NDCG"——这些检索指标前端没接触过。
- **原因**：跳过了"什么是 retrieval / 什么是 RAG"的概念铺垫。
- **修复建议**：第 17 章开头加 1 节"什么是 RAG"（最多 5 行），把"retrieval = 从知识库找相关文档"用 "grep + 排序" 类比。
- **具体行号**：第 15-43 行。

#### 第 21 章 (chapter-21-ci-cd-pipeline.md)
- **问题 12**：第 21.5 节 `detectRegression` 把基线 JSON 硬编码到路径 `baseline.json`，但前端工程师的 CI 流程里通常用 GitHub Pages / Vercel / 静态文件托管评估结果，作者没考虑这点。
- **原因**：面向前端但 CI 例子用了 Python 脚本。
- **修复建议**：补 1 个 npm 脚本 + 静态 JSON 文件的工作流例子，更贴近前端习惯。
- **具体行号**：第 117-156 行。

#### 第 24 章 (chapter-24-case-customer-rag.md)
- **问题 13**：第 24.4 节 RAGAS 评估代码**完全是 Python**，前端读者无法直接复现。RAGAS 虽有 JS 客户端但不如 Python 主流。
- **原因**：RAGAS 主流绑定 Python。
- **修复建议**：要么补 TypeScript 替代方案（如自己写 4 个指标的简化版），要么明确"本案例用 Python，前端可在第 13 章框架中找 JS 替代"。
- **具体行号**：第 65-114 行。

#### 第 27 章 (chapter-27-resources-glossary.md)
- **问题 14**：第 27.4 节"关键概念速查"列了 24 个术语，但读者在第 1 章就已经遇到 12 个，前 27 章都没彻底讲清。
- **原因**：术语表是事后补救。
- **修复建议**：每个术语首次出现时立即加粗定义（哪怕 5 个字），而不是等到 27 章汇总。

---

### P1（强烈建议）

#### 第 1 章 — "评估 = 单元测试 + E2E + 性能基准"类比
- **问题**：类比过分简化，让读者以为"评估 = 跑 jest"。
- **建议**：补 1 句"但评估的题目是非确定的自然语言，需要'另一个 AI'当裁判，所以比单测复杂"。

#### 第 5 章
- **问题**：HellaSwag/PIQA/WinoGrande 三个常识基准用 emoji 网格图（第 5.9 节 ARC-AGI），但 HellaSwag 那个例子"一个人走到厨房..."只是单句，缺少"为什么这算常识"的解释。
- **建议**：每个常识基准补 1 行"什么是常识推理"。

#### 第 6 章 (chapter-06-math-logic.md)
- **问题**：第 6.4 节 MATH 基准的"真实样例"包含 $x^2 + y^2 = z^2$ 的 LaTeX，但前端工程师**没学过 LaTeX**。
- **建议**：要么换成自然语言，要么补 1 句"LaTeX = 数学公式的标准写法，读法是 x² + y² = z²"。

#### 第 9 章 (chapter-09-long-context-safety-agent.md)
- **问题**：NIAH（Needle in a Haystack）类比用了"在 100k 字的文档中找一句话"，但"100k 字"对前端来说不直观。
- **建议**：补 "100k 字 ≈ 200 页 A4 文档 ≈ 1 本中等小说的长度"。

#### 第 10 章 (chapter-10-preference-llm-as-judge.md)
- **问题**：Elo 评分公式来自国际象棋，但前端没下过棋。
- **建议**：用"英雄联盟 / 王者荣耀排位分"或"天梯分"类比。
- **具体行号**：第 99-109 行。

#### 第 13 章 (chapter-13-frameworks-landscape.md)
- **问题**：列出 15 个框架，但没说"哪些有 TS SDK / 哪些纯 Python"。
- **建议**：每个框架加 1 列"SDK 语言"。
- **具体行号**：第 347-364 行汇总表。

#### 第 15 章 (chapter-15-llm-as-judge.md)
- **问题**：第 15.5 节"长度归一化"的代码只截断到平均长度，但没说"截断到哪"——会丢上下文。
- **建议**：补 1 行"截断的是模型的回答，不截检索内容；保留首尾关键信息"。

#### 第 16 章 (chapter-16-human-evaluation.md)
- **问题**：第 16.4 节 Elo 公式写 `R_A' = R_A + K * (S_A - E_A)`，但 K=32 怎么来的没说。
- **建议**：补 1 行"K = 32 是国际象棋的经验值，意味着 1 次胜利能影响 ~32 分；评估常用 16-32"。

#### 第 18 章 (chapter-18-red-team-safety.md)
- **问题**：OWASP LLM Top 10 列了 10 项但每项只有 1 行，读者扫一眼记不住。
- **建议**：每项加 1 个真实场景例子（如 "LLM06 敏感信息泄露 = 用户问'我之前问过什么'，模型复述其他用户问题"）。

#### 第 25 章 (chapter-25-case-code-agent.md)
- **问题**：第 25.4 节"用户接受率"指标没说明怎么跟踪"接受 vs 拒绝"——前端工程师可能以为要写埋点，其实 VS Code 扩展有 telemetry API。
- **建议**：补 1 句"前端代码助手一般用 IDE 的 telemetry API（如 VS Code 的 `vscode.env.isTelemetryEnabled`）"。

---

### P2（可选优化）

#### 第 1 章
- "npm test" 类比可以补一句 "CI 跑测试 ≠ 跑评估，所以本书就是要给 AI 加 CI 评估"。

#### 第 7 章
- MBPP 和 HumanEval 的对比表可以加 1 列"哪个先饱和"，方便选型。

#### 第 8 章 (chapter-08-multimodal.md)
- 第 8.10 节 POPE 的 TP/FP/FN 表可以加 1 行"前端类比：表单提交后端校验"。

#### 第 11 章 (chapter-11-reading-vendor-reports.md)
- "few-shot 数量不报" 的猫腻可以加 1 个真实例子脚注。

#### 第 12 章 (chapter-12-third-party-leaderboards.md)
- 加 1 个对比表说明"中文选 OpenCompass，英文选 Arena，垂直行业选 SEAL"。

#### 第 14 章
- 100 行版本可以加 1 个 `AbortController` 处理用户取消。

#### 第 20 章 (chapter-20-build-test-set.md)
- 脱敏正则 `[一-龥]{2,3}(先生|女士)` 在 JS 中 `[一-龥]` 是 Chinese Unicode 范围，但很多前端不知道 `龥` 这个字就是范围结尾，可以加注释。

#### 第 22 章 (chapter-22-online-ab.md)
- "辛普森悖论"例子可以加 1 张图，前端可视化思维强。

#### 第 28 章 (chapter-28-self-test-faq.md)
- FAQ Q20"未来趋势"有点空，可以加 1 个具体预测（如"2027 年 IEEE 将发布 LLM 评估标准"）。

---

## 章节评分明细

| 章节 | 清晰度 | 代码 | 叙述 | 覆盖 | 准确 | 关联 | 总分 | 必改 |
|---|---|---|---|---|---|---|---|---|
| 01 what-is-eval | 3.5 | 3 | 4 | 3.5 | 4 | 2.5 | 20.5/30 | 术语首次定义、API key 配置 |
| 02 eval-5w1h | 4 | — | 3.5 | 3.5 | 4 | 3 | 18/24 | SFT/RLHF 解释 |
| 03 standard-pipeline | 4 | 4 | 4 | 3.5 | 4 | 3 | 22.5/30 | temperature 注释 |
| 04 core-principles | 4 | 4 | 4 | 4 | 5 | 3.5 | 24.5/30 | Kappa 铺垫 |
| 05 knowledge-reasoning | 3 | — | 3.5 | 4 | 4.5 | 3 | 18/24 | 能力维度总图 |
| 06 math-logic | 3 | 3.5 | 3.5 | 4 | 4 | 3 | 21/30 | LaTeX 解释 |
| 07 code | 3.5 | 2.5 | 3.5 | 4 | 4 | 3 | 20.5/30 | comb 函数、python3 平台 |
| 08 multimodal | 4 | — | 4 | 4 | 4.5 | 3.5 | 20/24 | 视觉概念铺垫 |
| 09 long-context-safety-agent | 3.5 | — | 3.5 | 4 | 4 | 3 | 18/24 | "100k 字"具象化 |
| 10 preference-llm-as-judge | 4 | 4 | 4 | 4 | 4 | 3.5 | 23.5/30 | Elo 类比换 |
| 11 reading-vendor-reports | 4 | — | 4 | 4 | 4 | 3.5 | 19.5/24 | — |
| 12 third-party-leaderboards | 4 | — | 4 | 4 | 4 | 3.5 | 19.5/24 | — |
| 13 frameworks-landscape | 4 | 4 | 4 | 4 | 4 | 3.5 | 23.5/30 | SDK 语言标注 |
| 14 build-mini-evaluator | 3.5 | 3 | 4 | 3.5 | 4 | 3 | 21/30 | top-level await 环境、React 工程化现实 |
| 15 llm-as-judge | 4 | 4 | 4 | 4 | 4.5 | 3.5 | 24/30 | 长度归一化细节 |
| 16 human-evaluation | 4 | 4 | 4 | 4 | 4 | 3.5 | 23.5/30 | K=32 出处 |
| 17 rag-agent-eval | 3 | 2.5 | 3.5 | 4 | 4 | 3 | 20/30 | RAG 概念铺垫 |
| 18 red-team-safety | 3.5 | 3.5 | 4 | 3.5 | 4 | 3.5 | 22/30 | OWASP 实例 |
| 19 what-to-evaluate | 4 | 4 | 4 | 4 | 4 | 3.5 | 23.5/30 | — |
| 20 build-test-set | 4 | 3.5 | 4 | 4 | 4 | 3.5 | 23/30 | 正则注释 |
| 21 ci-cd-pipeline | 4 | 3.5 | 4 | 4 | 4 | 3.5 | 23/30 | 静态 JSON 工作流 |
| 22 online-ab | 4 | 4 | 4 | 4 | 4 | 3.5 | 23.5/30 | 辛普森悖论配图 |
| 23 meta-evaluation | 4 | 4 | 4 | 4 | 4 | 3.5 | 23.5/30 | — |
| 24 case-customer-rag | 3.5 | 2.5 | 4 | 4 | 4 | 3.5 | 21.5/30 | JS 替代 RAGAS |
| 25 case-code-agent | 4 | 3.5 | 4 | 4 | 4 | 3.5 | 23/30 | 接受率埋点说明 |
| 26 case-multimodal | 4 | 3 | 4 | 4 | 4 | 3.5 | 22.5/30 | — |
| 27 resources-glossary | 4 | — | 4 | 4 | 4 | 3 | 19/24 | 术语首次定义 |
| 28 self-test-faq | 4 | 4 | 4 | 3.5 | 4 | 4 | 23.5/30 | — |

---

## 覆盖缺口

应该讲解但缺失的内容：

- [ ] **streaming 评估**：怎么评估流式输出（chunk-by-chunk）的延迟、首 token 时间、token/s 吞吐
- [ ] **rate limit 处理**：HTTP 429 / 503 的退避策略细节（本书第 3.4 节只提了"指数退避"）
- [ ] **token 计价**：每个模型 $ / 1M tokens 的对照表，预算计算示例
- [ ] **向量数据库**：Pinecone / Chroma / pgvector 的对比——RAG 章节没铺垫
- [ ] **embedding 模型选择**：MTEB 排行榜只是 FAQ 一笔带过（第 28 章 Q15）
- [ ] **缓存策略深入**：Redis 缓存 vs 文件缓存 vs CDN 缓存的对比
- [ ] **prompt 缓存**（OpenAI prompt caching、Anthropic prompt caching）：2025 后新功能，本书没提
- [ ] **function calling schema 验证**：第 7 章 BFCL 提到工具调用，但 JSON Schema 验证细节没说
- [ ] **多模态 prompt 构造**：图片 + 文本怎么组合，第 26 章没讲 OpenAI Vision API 的图片 url vs base64 区别
- [ ] **灰度发布架构**：第 21 章说"5% → 25% → 100%"但没说怎么在 Vercel / Cloudflare Workers 实现
- [ ] **A/B 流量分桶**：第 22 章用 Python 哈希算法，前端可以用 Edge Function
- [ ] **评估的本地化**：i18n 多语言评估怎么设计
- [ ] **多 Agent 评估**：第 28 章提了一句"高级"，但全书没有
- [ ] **RLHF 评估**：和 SFT 一起没展开

---

## 跳跃式叙述清单

"读者到这里会卡住"的地方：

### 高严重（章节 X 用 Y，但 Y 在 Z 章之后才讲）
- 第 1 章第 65 行：`Judge` 用了 → 第 15 章才讲 LLM-as-Judge 完整细节
- 第 1 章第 14 行：`Likert` 出现 → 第 16 章才讲 Likert 量表
- 第 2 章第 36 行：`SFT/RLHF` 出现 → 全书从未详细讲（只在第 11 章提到）
- 第 2 章第 41 行：`RAG` 出现 → 第 17 章才讲
- 第 3 章第 161 行：`temperature` 参数首次出现，未解释 → 第 11 章第 103 行才讲温度猫腻
- 第 4 章第 130 行：`Cohen's Kappa` 突然出现 → 全书没单独讲过
- 第 4 章第 197 行：`ECE` 公式出现，未解释 → 全书再无详细解释
- 第 7 章第 80 行：`pass@k` 首次出现 → 全书首次定义
- 第 9 章第 23 行：`Agent` 首次出现 → 第 17 章第 137 行才正式展开
- 第 10 章第 4 行：`LLM-as-Judge` 出现 → 第 15 章才讲 4 大偏差
- 第 17 章第 16 行：`Context Precision/Recall` → 第 17 章第 88 行才详细说明 RAGAS 实现
- 第 17 章第 22 行：`MRR / NDCG` → 全书没有定义
- 第 19 章第 24 行：`Faithfulness` → 第 17 章已讲但第 19 章当已知
- 第 22 章第 158 行：`Z 检验` 出现 → 第 4 章 McNemar 提到过但 Z 检验没铺垫

### 中严重（术语裸用）
- `token` —— 全书用，但从未明确定义为"模型处理的最小单位（subword）"。第 1 章第 73 行出现 `messages: [{ role: "user", content: task.input }]` 用 token 计费的话需要明白是什么。
- `embedding` —— 第 14 章第 288 行隐含用，第 17 章密集出现，但首次出现无定义
- `prompt engineering` —— 全书未独立讲，全靠读者自学
- `fine-tuning` —— 全书只提 3 次，无完整章节
- `tool use` / `function calling` —— 第 7 章 BFCL 提到，第 17 章 L1 提到，但首次出现无定义
- `chunk` —— 第 17 章第 35 行出现 `top-K chunks`，但 chunk 是什么没铺垫
- `retrieval` —— 第 9 章第 24 行 `Multi-key NIAH` 提到 retrieval，NIAH 例子有检索但没解释检索是什么
- `agent` —— 第 9 章就开始用，但第 17 章才讲

### 低严重（不影响主线但建议补）
- `SFT`、`DPO`、`RLHF`、`Constitutional AI` 在第 11 章第 56 行一并出现
- `pass@1` vs `pass@k` vs `pass@N` 区分不够清楚
- `CoT`、`self-consistency`、`best-of-N` 在第 1 章第 129 行隐含用
- `grep + rerank` 这类技术词散落各处

---

## 不可运行的代码示例

代码示例中不完整的：

### 第 1 章
- **第 70-107 行**：缺 `import OpenAI from "openai"` 的 `package.json` 依赖、缺 `dotenv.config()`、缺 `OPENAI_API_KEY` 注入说明
- **第 105 行**：顶层 `await` 在 CommonJS 项目会报错

### 第 3 章
- **第 89-116 行**：`callModelWithRetry` 用了 `openai.chat.completions.create({...})` 但示例代码里 spread 不完整，运行时 `openai` 实例化缺
- **第 99 行**：`pLimit` 和 `lru-cache` 都没列 `npm install` 命令

### 第 7 章
- **第 80-85 行**：`comb` 函数未定义，复制粘贴直接报 `ReferenceError`
- **第 45-71 行**：`execAsync(\`python3 ${file}\`)` 在 Windows 默认无 python3 命令

### 第 10 章
- **第 217-225 行**：`judgeWithLLM` 直接用 `openai` 但实例化在前面没显示

### 第 14 章
- **第 16-34 行**（30 行版本）：缺 ESM 环境说明
- **第 40-112 行**（100 行版本）：`callWithRetry` 中 `openai` 实例化放在文件里但第 47 行的 `const openai = new OpenAI()` 没出现在 30 行版本里
- **第 194-209 行**（200 行版本）：`run()` 函数接收 `Metric = (output: string, expected: string) => boolean | number`，但 `metrics.fuzzy` 返回 number 不是 boolean，第 207 行 `r.score === 1 || r.score === true` 对 fuzzy 永远是 false
- **第 264-315 行**：React 工程现实下生成的代码大概率过不了 ESLint / TS strict

### 第 15 章
- **第 272-332 行**：`JudgeService` 类用 `OpenAI()` 但没传 API key
- **第 309-314 行**：`JSON.parse` 失败时 catch 返回 0 分，但失败原因没记录

### 第 16 章
- **第 159-180 行**：`cohensKappa` 函数对浮点 scores 会算错（Cohen's Kappa 要求 categorical）

### 第 18 章
- **第 140-195 行**：用了 `openai` 但没 import、没初始化

### 第 21 章
- **第 117-156 行**：`detectRegression` 接受 baseline 但示例 baseline.json 不存在

### 第 22 章
- **第 36-65 行**：`calculateSampleSize` 简化公式有偏（实际需要连续性校正）

### 第 23 章
- **第 33-45 行**：Python 示例，没给 JS 等价
- **第 87-113 行**：`cohensKappa` 同上

### 第 24 章
- **第 65-114 行**：纯 Python，前端读者无法直接跑

### 第 25 章
- **第 50-86 行**：Python 但书是 TS 视角

### 第 26 章
- **第 51-83 行**：Python 合成数据

---

## 类比质量

每个类比是否恰当：

- **第 1 章**："LLM 评估 ≈ 单元测试 + E2E + 性能基准" — ✓ 恰当，但容易让前端以为就是 jest 套件
- **第 1 章**："MMLU = SAT + GRE + 律师 + 医生资格考试的迷你版" — ⚠️ 中国前端工程师对 SAT/律师资格考试无感
- **第 2 章**："选型 ≈ 选框架前的 demo" — ✓ 恰当
- **第 2 章**："训练中 ≈ TDD 开发" — ⚠️ 解释不够：TDD 是先写测试再写代码，训练中是先有部分模型再持续评估，方向相反
- **第 3 章**："Prompt 模板化" 类比组件 props 必传 — ❌ 没有，缺失
- **第 5 章**："HellaSwag ≈ eslint 智能补全" — ⚠️ 强行关联，eslint 不是基于 LLM 的
- **第 9 章**："NIAH = 在 100k 字找一句话" — ✓ 恰当，但"100k 字"需具体化
- **第 10 章**："Elo = 国际象棋积分" — ⚠️ 中国前端没下过棋
- **第 13 章**："DeepEval = LLM 的 pytest" — ✓ 非常恰当
- **第 17 章**："Phoenix = 生产监控" — ✓ 恰当
- **第 18 章**："红队 = 主动找漏洞" — ✓ 恰当
- **第 22 章**："A/B 实验 = 转化率实验" — ✓ 恰当，前端应该熟悉

**总结**：类比整体质量中上，但"美式考试/体育竞技"类比对中国前端工程师不友好，建议换成"王者荣耀/英雄联盟/高考"等本地化类比。

---

## 修复优先级

按"P0 必须改" → "P1 强烈建议" → "P2 可选优化"：

### P0（必须改，否则读者卡住）
1. 第 1 章：补充 OPENAI_API_KEY 环境变量说明、ESM 环境提示
2. 第 2 章：解释 SFT / RLHF（哪怕 1 行）
3. 第 3 章：temperature 参数首次出现时注释
4. 第 4 章：Cohen's Kappa 铺垫"为什么不是简单一致率"
5. 第 7 章：补 `comb` 函数定义；说明 Python 3 环境依赖
6. 第 14 章：top-level await / ESM 说明；React 工程现实约束
7. 第 17 章：RAG / Retrieval / Chunk 概念铺垫
8. 第 24 章：补 JS 替代 RAGAS 的方案
9. 第 27 章：术语首次出现时立即定义（而非事后汇总）

### P1（强烈建议，提升流畅度）
10. 第 5 章：能力维度总图
11. 第 6 章：LaTeX 解释或换自然语言
12. 第 9 章：100k 字具体化（200 页 A4 / 1 本小说）
13. 第 10 章：Elo 类比换排位分
14. 第 13 章：每个框架加 SDK 语言列
15. 第 15 章：长度归一化细节（截断位置）
16. 第 16 章：Elo K=32 出处
17. 第 18 章：OWASP 每项加实例
18. 第 25 章：VS Code telemetry 接受率埋点说明

### P2（可选优化，提升质感）
19. 第 7 章：MBPP vs HumanEval 加"哪个先饱和"列
20. 第 8 章：POPE TP/FP/FN 类比表单校验
21. 第 11 章：few-shot 猫腻加真实脚注
22. 第 14 章：100 行版本加 AbortController
23. 第 20 章：JS Unicode 范围注释
24. 第 22 章：辛普森悖论配图
25. 第 28 章：FAQ Q20 加具体预测

---

## 总评

**优点**：
- 全书骨架扎实，4 步法 / 5W1H / 4 来源 / 5 榜单对账 是**可记住的工程方法论**
- 前端类比贯穿始终（jest / 单测 / E2E / npm test），不是空喊口号
- 数学原理讲得正确（Cohen's Kappa、置信区间、显著性检验）
- 案例研究（24/25/26）写得最实用

**核心问题**：
- **术语首次出现无定义**：10 个核心术语中 7 个没立即解释，与"面向前端初学者"的定位冲突
- **代码工程化假设**：把前端当 Python 后端用（python3 命令、RAGAS、lm-eval 都是 Python）
- **类比本地化不足**：SAT / Elo / 国际象棋对中国前端不友好
- **章节间互引弱**：第 1 章抛出 12 个术语，后面才讲，读者读到第 15 章可能已经忘了第 1 章的引用

**建议**：把本书改名/定位为"全栈工程师视角"或"AI 工程化入门"会更诚实；如果坚持"前端视角"，需要：
1. 术语表前移（每章首节用 5 行解释本章术语）
2. 所有 Python 代码配 TS 等价
3. 修正 14 处 P0 代码问题
4. 把"前端类比"再下沉 1 层（中国前端熟悉的具体场景）

完成时间：约 90 分钟精读 + 30 分钟撰写。