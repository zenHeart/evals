# -*- coding: utf-8 -*-
"""Generate data/benchmarks/<id>.json for B-group auto-benchmark ids."""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "data", "benchmarks")
VERIFIED = "2026-09-01"

QWEN3_8 = "https://qwen.ai/blog?id=qwen3.8"
SEED2 = "https://seed.bytedance.com/en/seed2"
HY4 = "https://hy.tencent.com/research/hy4-preview"
GEMINI3 = "https://blog.google/products-and-platforms/products/gemini/gemini-3/"
GEMINI3F = "https://blog.google/products/gemini/gemini-3-flash"
G37F = "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/"
MUSE11 = "https://ai.meta.com/static-resource/muse-spark-1-1-evaluation-report/"


def m(id, name, unit="percent", direction="higher", lo=0, hi=100, agg="mean"):
    return {"id": id, "name": name, "range": [lo, hi], "unit": unit,
            "direction": direction, "aggregation": agg}


def src(kind, url):
    return {"kind": kind, "url": url}


def ds(sample_count=None, splits=None, languages=None, source_type=None, public_sample=None):
    return {
        "sample_count": sample_count,
        "splits": splits or [],
        "languages": languages or [],
        "source_type": source_type,
        "public_sample": public_sample,
    }


def base(bid, name, full_name, aliases, categories, summary, interpretation,
         measures, does_not_measure, dataset, metrics, default_protocol,
         versions, limitations, notes, official_sources, related):
    return {
        "id": bid,
        "name": name,
        "full_name": full_name,
        "aliases": aliases,
        "status": None,
        "categories": categories,
        "summary": summary,
        "interpretation": interpretation,
        "measures": measures,
        "does_not_measure": does_not_measure,
        "dataset": dataset,
        "metrics": metrics,
        "default_protocol": default_protocol,
        "versions": versions,
        "limitations": limitations,
        "notes": notes,
        "official_sources": official_sources,
        "related_benchmarks": related,
        "content_status": "beta",
        "last_verified_at": VERIFIED,
    }


ENTITIES = []

# --- 音视频 / 语音（Seed 2.0 页） -------------------------------------------

ENTITIES.append(base(
    "avmeme", "AVMeme Exam",
    "AVMeme Exam: A Multimodal Multilingual Multicultural Benchmark for LLMs' Contextual and Cultural Knowledge and Thinking",
    ["AV-Meme", "AVMeme"],
    ["multimodal", "knowledge"],
    "1,000+ 段标志性网络音视频（语音/歌曲/音乐/音效）多模态多语言多文化评测，考从表层内容到语境、情绪、用法的分层理解",
    "梗的含义依赖表达方式、时机与共享文化背景——模型能读字幕后仍答不对『这个梗为什么好笑』。Seed 2.0 页 AV 组 Lite 69.5 / Mini 50.7，同表 Gemini 3.1 Pro 77.3。",
    ["音频+视频联合的网络文化语境理解（音乐/音效等无文字模态）",
     "分层的梗理解：表层内容 → 语境与情绪 → 用法与世界知识"],
    ["纯文本文化问答", "ASR 转写质量", "长视频理解"],
    ds(None, ["每条梗配一题 + 元数据（年代/转写/摘要/敏感度）"], ["多语言（multilingual）"], "human_curated", True),
    [m("accuracy", "Accuracy")],
    None,
    [{"id": "v1", "label": "AVMeme Exam（2026-01）", "note": "arXiv:2601.17645；19 个 MLLM + 人类对照"}],
    ["发布时前沿模型在无文字的音乐/音效梗上表现系统性偏弱，且差于人类参与者"],
    "Seed 2.0 页 Visual-Audio Understanding 组出现（Lite 69.5 / Pro 60.6 / Mini 50.7 vs Gemini 3.1 Pro 77.3）；数据集由 naplab 发布",
    [src("paper", "https://arxiv.org/abs/2601.17645"), src("dataset", "https://huggingface.co/datasets/naplab/AVMeme-Exam")],
    ["jointavbench", "worldsense", "video-mme"],
))

ENTITIES.append(base(
    "jointavbench", "JointAVBench",
    "JointAVBench: A Benchmark for Joint Audio-Visual Reasoning Evaluation",
    ["JointAV-Bench"],
    ["multimodal"],
    "严格音视频耦合的 Omni-LLM 推理评测：5 认知维度 × 4 音频信息类型（语音/声事件/音乐/声纹）× 3 场景跨度，最强 Omni 模型均值仅 65.3%",
    "设计目标是『只看画面答不出、只听声音也答不出』——用合成管线保证每题必须视听联合推理。ICLR 2026 论文；Seed 2.0 页 AV 组 Lite 69.5 / Mini 52.7。",
    ["必须联合视听才能作答的多模态依赖题", "跨场景（cross-scene）时序推理"],
    ["单模态视觉/音频理解", "无音频关联的纯视频问答"],
    ds(None, ["single-scene / cross-scene / full-scene 三档"], ["en"], "synthetic（VLM+audio-LLM+LLM 合成管线）", True),
    [m("accuracy", "Accuracy")],
    None,
    [{"id": "v1", "label": "JointAVBench（ICLR 2026）", "note": "arXiv:2512.12772；最佳 Omni-LLM 平均 65.3%"}],
    ["问答由自动化管线合成，人工校验成本高", "跨场景推理仍是所有模型短板"],
    "Seed 2.0 页 Visual-Audio Understanding 组出现（Lite 69.5 / Pro 56.7 / Mini 52.7）；与 AV-Meme、WorldSense 同表",
    [src("paper", "https://arxiv.org/abs/2512.12772"),
     src("dataset", "https://huggingface.co/datasets/WayneZENG/JointAVBench"),
     src("site", "https://openreview.net/forum?id=Zg1YH8R5GG")],
    ["avmeme", "worldsense", "video-mme"],
))

ENTITIES.append(base(
    "worldsense", "WorldSense",
    "WorldSense: Evaluating Real-world Omnimodal Understanding for Multimodal LLMs",
    ["WorldSense-Bench"],
    ["multimodal", "knowledge"],
    "1,662 条音视频同步视频 + 3,172 道多选题（26 任务、8 大域 67 子类），80 位标注者多轮校验，考视听协同感知",
    "第一个同时覆盖视觉/音频/文本输入的视频评测：任务特意设计成声音与画面强耦合。多数多模态模型因缺同步视听训练数据而吃力；Seed 2.0 页 AV 组 Lite 67.3 / Mini 52.7 vs Gemini 3.1 Pro 65.5。",
    ["音视频协同感知（强耦合任务设计）", "26 类任务上的多选推理"],
    ["纯文字/纯视觉任务", "音视频生成"],
    ds(3172, ["1,662 条同步视频；3,172 MCQ / 26 任务"], ["en"], "human_curated", True),
    [m("accuracy", "Accuracy")],
    None,
    [{"id": "v1", "label": "WorldSense（2025-02）", "note": "arXiv:2502.04326；80 位专家标注、多轮校验"}],
    ["MCQ 形式存在选项猜测空间", "以英文为主，跨语言文化覆盖有限"],
    "Seed 2.0 页 Visual-Audio Understanding 组出现（Lite 67.3 / Pro 57.0 / Mini 52.7 vs Gemini 3.1 Pro 65.5）",
    [src("paper", "https://arxiv.org/abs/2502.04326"),
     src("github", "https://github.com/JaaackHongggg/WorldSense"),
     src("site", "https://jaaackhongggg.github.io/WorldSense/")],
    ["avmeme", "jointavbench", "video-mme", "egoschema"],
))

ENTITIES.append(base(
    "wenetspeech", "WenetSpeech",
    "WenetSpeech: A 10000+ Hours Multi-domain Mandarin Corpus for Speech Recognition",
    ["WenetSpeech test-net", "WenetSpeech test-meeting"],
    ["multimodal", "chinese"],
    "10,000+ 小时高质量标注 + 2,400+ 小时弱标注的多域普通话语音语料（YouTube/播客），test-net / test-meeting 是中文 ASR 常用 WER 基线",
    "中文 ASR 的『规模基准』：多域真实场景（含网络视频与会议），WER 越低越好。Seed 2.0 页 ASR 组 Lite 版 test-net 4.47 / test-meeting 5.31，同表 Gemini-3.1-Pro 9.52 / 12.80。",
    ["多域普通话语音识别（词错率）", "真实场景（网络视频、会议）鲁棒性"],
    ["多语言（非普通话）识别", "说话人分离/语音合成"],
    ds(None, ["test-net（网络视频）", "test-meeting（会议）", "dev"], ["zh"], "corpus", True),
    [m("wer", "WER", direction="lower", agg=None)],
    {"raw": "词错率 WER（中文按字错率 CER 口径），越低越好"},
    [{"id": "v1", "label": "WenetSpeech（2021）", "note": "arXiv:2110.03370；OpenSLR SLR121"}],
    ["低 WER 需配合领域细分解读（net 与 meeting 难度不同）", "仅覆盖普通话，方言需看后续变体（如 WenetSpeech-Chuan）"],
    "Seed 2.0 页 ASR 组出现（Lite test-net 4.47 / test-meeting 5.31 vs Gemini-3.1-Pro 9.52 / 12.80；页注 ASR 行用 WER/CER，越低越好）",
    [src("paper", "https://arxiv.org/abs/2110.03370"),
     src("site", "https://www.openslr.org/121/"),
     src("github", "https://github.com/wenet-e2e/WenetSpeech")],
    ["librispeech"],
))

ENTITIES.append(base(
    "librispeech", "LibriSpeech",
    None,
    ["LibriSpeech ASR corpus", "OpenSLR SLR12"],
    ["multimodal"],
    "约 1,000 小时 16kHz 朗读英语语音语料（LibriVox 有声书），test-clean / test-other 是英文 ASR 最通用的 WER 基线",
    "英文 ASR 的『公共操场』：训练集早已被几乎所有语音模型见过，test-clean 低于 2% 属常规水位——因此它更多是回归健康检查而非区分性前沿。Seed 2.0 页 Lite test-clean 1.07 / test-other 2.17。",
    ["朗读式英语识别基线（WER）", "clean 与 other（更难）两种声学条件下的退化幅度"],
    ["多说话人即兴对话", "多语言识别", "端到端推理能力"],
    ds(None, ["dev-clean", "dev-other", "test-clean", "test-other", "train-clean-100", "train-clean-360", "train-other-500"], ["en"], "corpus", True),
    [m("wer", "WER", direction="lower", agg=None)],
    {"raw": "词错率 WER，越低越好（Seed 2.0 页 ASR 组口径）"},
    [{"id": "v1", "label": "LibriSpeech（2015，OpenSLR SLR12）", "note": "CC BY 4.0；Panayotov et al."}],
    ["训练数据高污染：对大模型已无区分度，主要作一致性回归", "朗读式语音，与真实对话场景有差距"],
    "Seed 2.0 页 ASR 组出现（Lite test-clean 1.07 / test-other 2.17 vs Gemini-3.1-Pro 1.94 / 3.60）",
    [src("site", "https://www.openslr.org/12")],
    ["wenetspeech"],
))

# --- 知识 / 事实 ------------------------------------------------------------

ENTITIES.append(base(
    "facts-suite", "FACTS Benchmark Suite",
    None,
    ["FACTS Suite"],
    ["safety"],
    "Google Gemini 3 发布表中的事实性套件聚合分（内部 held-out 的 grounding / parametric / 多模态 / search 检索评测）",
    "与公开的 factsg（FACTS Grounding 单项）不是一回事：这一行是 Google 自家 held-out 套件的合成口径，只随发布表披露。Gemini 3 Pro 70.5 / Gemini 3 Flash 61.9 / 2.5 Pro 63.4 / 2.5 Flash 50.4。",
    ["事实性四能力聚合：grounding、parametric、多模态、search 检索"],
    ["单维 grounding 细节（见 factsg）", "跨厂商可比性（held-out 内部集）"],
    ds(None, [], ["en"], "vendor_internal", None),
    [],
    {"raw": "四能力套件聚合分（Gemini 3 发布表口径）"},
    [],
    ["未公开题目与划分，无法第三方复现", "仅随发布表披露，代际对比可用、跨厂商对比不可用"],
    "厂商内部/held-out——Gemini 3 与 Gemini 3.7 Flash 发布表出现（Gemini 3 Pro 70.5% / Gemini 3 Flash 61.9%）；与 factsg 区分",
    [src("site", GEMINI3), src("site", GEMINI3F)],
    ["factsg", "simpleqa"],
))

ENTITIES.append(base(
    "olympiadbench", "OlympiadBench",
    "OlympiadBench: A Challenging Benchmark for Promoting AGI with Olympiad-Level Bilingual Multimodal Scientific Problems",
    [],
    ["reasoning", "knowledge", "multimodal"],
    "8,476 道奥赛级数学/物理题（含中国高考题），英中双语，附专家级逐步推理标注；GPT-4V 时代最佳平均仅 17.97%",
    "学科竞赛级题目的双语大集合：物理题多为图文混合，因此也是多模态推理试金石。当前旗舰已普遍 80 分段（混元 A13B 表 82.7），区分主力转向更难的专用集。",
    ["奥赛级数学与物理解题（含多模态图文题）", "长链推理 + 过程可验证（专家逐步标注）"],
    ["编程", "开放域知识问答"],
    ds(8476, ["数学 / 物理；文本题 / 图文题"], ["en", "zh"], "human_curated", True),
    [m("accuracy", "Accuracy")],
    None,
    [{"id": "v1", "label": "OlympiadBench（2024-02）", "note": "arXiv:2402.14008；GPT-4V 平均 17.97%"}],
    ["题目来自公开竞赛与高考，存在预训练污染风险", "评分依赖答案匹配规则，过程正确但答案错判为错"],
    "混元 A13B 模型卡出现（Instruct 82.7 / Int4 84）；腾讯 Hunyuan 与 Qwen 系列发布表常引用",
    [src("paper", "https://arxiv.org/abs/2402.14008")],
    ["gpqa", "math500", "mathvision", "hlehle"],
))

ENTITIES.append(base(
    "brokenarxiv", "BrokenArXiv",
    "BrokenArXiv: How Often Do LLMs Claim To Prove False Theorems?",
    ["BrokenArxiv"],
    ["reasoning", "safety"],
    "MathArena 出品的『伪定理』评测：把近期 arXiv 数学研究断言扰动成似真但可证伪的命题，测模型是否敢指出前提有问题；LLM judge 评分、月度滚动",
    "与 Final-Answer 类基准互补：它奖励『拒绝证明』。页面自述可被『永远回答题目有误』刷到 100%，因此必须与正常解题基准并读——专考批判性而非能力上限。2026-02 版 31 题。",
    ["对似真但为假的研究级数学命题的识别与拒绝", "长文档数学文本上的严谨性"],
    ["正常解题正确率（用 MathArena/FrontierMath 看）", "规则可验证性（本基准只能用 LLM judge）"],
    ds(None, ["月度滚动版本（2026-02 版 31 题）"], ["en"], "derived（真实 arXiv 断言扰动）", True),
    [m("accuracy", "指出命题问题的比例")],
    {"raw": "LLM judge（Gemini-3.1-Pro）判断模型是否指出命题不成立；月度版本滚动更新"},
    [{"id": "rolling", "label": "月度版本滚动", "note": "前作 BrokenMath（竞赛题版）；2026-03-13 发布"}],
    ["可被固定的『质疑式回答』刷分，不能单独解读", "judge 为 LLM，存在自动化评审偏差（页面已说明）"],
    "混元 Hy4 preview 附录推理组出现（54.6）；MathArena（ETH SRI Lab + INSAIT）出品",
    [src("site", "https://matharena.ai/brokenarxiv/")],
    ["frontiermath", "gpqa", "livebench"],
))

ENTITIES.append(base(
    "labbench2", "LAB-Bench 2",
    "LABBench2: An Improved Benchmark for AI Systems Performing Biology Research",
    ["LABBench2"],
    ["knowledge", "agent"],
    "FutureHouse 生物研究任务评测第二代：近 1,900 个任务，覆盖文献推理、数据库检索、图表/表格解读与协议理解（一代为 2,400+ 道多选题）",
    "一代 LAB-Bench 的多选题形式被前沿模型打满，二代把『检索真实信息』纳入任务本身（FigQA/TableQA 也要求先查资料），朝真实科研工作流靠拢。Gemini 3.7 Flash 表口径 82.1% 居同表首位。",
    ["真实生物科研任务执行：文献/数据库/图表/表格/协议", "agentic 信息检索与整合"],
    ["教科书式生物知识记忆", "湿实验物理操作"],
    ds(None, ["文献 / 数据库 / 图表 / 表格 / 协议等五大类"], ["en"], "human_curated", False),
    [m("accuracy", "Accuracy")],
    None,
    [{"id": "v2", "label": "LABBench2（2026-04）", "note": "arXiv:2604.09554；前代 LAB-Bench arXiv:2407.10362"}],
    ["数据集 gated，第三方复现受限", "多选题痕迹仍在部分子集上，判分对扰动敏感"],
    "Gemini 3.7 Flash 发布表出现（82.1% vs Claude Sonnet 5 80.1% / GPT-5.6 Terra 81.2%，Gemini 3.6 Flash 76.1%）；混元与 Anthropic 系统卡亦引用",
    [src("paper", "https://arxiv.org/abs/2604.09554"),
     src("site", "https://www.futurehouse.org/research/lab-bench-measuring-capabilities-of-language-models-for-biology-research")],
    ["seqqa", "bio-design-tools", "bixbench", "harvey-lab"],
))

ENTITIES.append(base(
    "seqqa", "SeqQA",
    None,
    ["LAB-Bench SeqQA"],
    ["knowledge"],
    "LAB-Bench 系列的 DNA/蛋白质序列理解子集：解读与操纵核酸/蛋白序列信息",
    "考的是『读序列』这种极窄但不可造假的技能——不能靠检索网页答案，只能靠推理。厂商报告常以 agentic 方式跑（Muse Spark 1.1 Table 1：1.1 98.2 / 1.0 97.3 / GPT-5.5 98.2 / Gemini 3.1 Pro 95.4）。",
    ["DNA/蛋白质序列的解读与操作推理"],
    ["文献检索（LitQA2 负责）", "实验设计（CloningScenarios/BioDesign 负责）"],
    ds(None, ["LAB-Bench / LABBench2 子集"], ["en"], "human_curated", None),
    [m("accuracy", "Accuracy")],
    {"raw": "多选准确率；Muse Spark 1.1 报告以 agentic 方式评测（Table 1）"},
    [{"id": "v1", "label": "LAB-Bench 子集（2024-07）", "note": "arXiv:2407.10362；LABBench2 中延续"}],
    ["窄任务，接近饱和时区分度下降（这也是 LABBench2 重构的动因）"],
    "Muse Spark 1.1 评测报告 Chemical & Biological 组出现（98.2%，agentic 口径）",
    [src("paper", "https://arxiv.org/abs/2407.10362"), src("paper", "https://arxiv.org/abs/2604.09554")],
    ["labbench2", "bio-design-tools"],
))

ENTITIES.append(base(
    "bio-design-tools", "BioDesignTools",
    None,
    ["BioDesignTasks"],
    ["knowledge"],
    "LAB-Bench 系列的基因/生物设计任务子集：把设计目标落成可执行的实验方案（一代时为私下保留集）",
    "比 SeqQA 更接近真实科研决策：需要组合检索与设计推理。Muse Spark 1.1 报告按多任务平均报告（1.1 55.2 / 1.0 39.2 / GPT-5.5 67.4 / Gemini 3.1 Pro 62.4）——分数不高，说明任务仍难。",
    ["生物/基因设计的方案构造与约束满足"],
    ["纯序列解读（SeqQA 负责）", "文献问答"],
    ds(None, ["多任务平均口径"], ["en"], "human_curated", False),
    [m("accuracy", "Accuracy（多任务平均）")],
    {"raw": "多任务平均准确率（Muse Spark 1.1 报告 Table 1）"},
    [{"id": "v1", "label": "LAB-Bench 子集（2024-07）", "note": "一代中该子集私下保留以保证评测完整性"}],
    ["未公开子集使第三方难以独立复现", "设计类任务判分依赖参考方案，覆盖面有限"],
    "Muse Spark 1.1 评测报告 Chemical & Biological 组出现（55.2%，多任务均值；Claude 列因拒答率高未报告）",
    [src("paper", "https://arxiv.org/abs/2407.10362"), src("paper", "https://arxiv.org/abs/2604.09554")],
    ["labbench2", "seqqa", "biobench"],
))

ENTITIES.append(base(
    "curated-ctfs", "Curated CTFs",
    None,
    ["Curated CTF challenges"],
    ["safety"],
    "Meta 评测报告中的策展 CTF（夺旗）安全评测：198 道挑战，pass@1 / pass@5 双口径",
    "厂商安全评估框架里的能力上界探针：Muse Spark 1.1 报告 89.9% pass@1 / 95.7% pass@5（1.0 为 72.0 / 84.1）。策展集未公开，跨厂商可比性取决于各家各自选题。",
    ["网络安全攻防任务（CTF）的解决率"],
    ["真实环境渗透（非沙箱靶场）", "防御性安全策略"],
    ds(198, ["overall（198 challenges）"], ["en"], "vendor_internal", False),
    [m("pass@1", "Pass@1"), m("pass@5", "Pass@5")],
    {"raw": "pass@1 / pass@5（Muse Spark 1.1 报告 Table 4 Overall）"},
    [],
    ["策展集未公开，无法第三方复现", "CTF 靶场与真实攻击面有差距"],
    "厂商内部/策展集——Muse Spark 1.1 评测报告 Cybersecurity 组出现（pass@1 89.9% vs Spark 1.0 72.0%）",
    [src("report", MUSE11)],
    ["cybergym"],
))

# --- 多模态推理（Qwen 表 2） -------------------------------------------------

ENTITIES.append(base(
    "hle-vl", "HLE-VL",
    None,
    ["Humanity's Last Exam (VL)", "HLE VL"],
    ["multimodal", "knowledge"],
    "Humanity's Last Exam 的视觉语言变体：以图片承载题干的超难学科题，常与工具（代码解释器 + 搜索）一起作 agentic 评测",
    "HLE 文本版已近饱和（旗舰 40-50 段），视觉版 + 工具链的组合把分数重新压回 30-50 段——工具增益（约 +6 到 +10 分）是当前主要区分点。Qwen3.8-Max 表：w/ Tools 52.2，GPT-5.6-Sol 51.2。",
    ["视觉承载的专家级学科推理", "工具链（代码解释器 + 搜索）协同的 agentic 解题"],
    ["纯文本超难推理（见 hlehle）", "常规难度 VQA"],
    ds(None, ["w/ Tools（代码解释器 + 搜索）", "无工具口径"], ["en"], "human_curated", None),
    [],
    {"raw": "w/ Tools：代码解释器（CI）+ 搜索（Qwen3.8-Max 表 2 口径；对手分经其原生工具 API 端到端测得）"},
    [],
    ["视觉子集划分随论文版本变化，跨表对比需确认口径", "工具评测依赖厂商自有 harness"],
    "WebWatcher（阿里）论文将 HLE-VL 列为核心评测之一；Qwen3.8-Max 表 2 出现（52.2，w/ Tools）",
    [src("paper", "https://arxiv.org/abs/2508.05748"),
     src("site", "https://huggingface.co/Alibaba-NLP/WebWatcher-32B"),
     src("site", QWEN3_8)],
    ["hlehle", "mmmu-pro", "zerobench"],
))

ENTITIES.append(base(
    "zerobench-sub", "ZeroBench Sub-Questions",
    None,
    ["ZeroBench-Sub", "ZeroBench light"],
    ["multimodal", "reasoning"],
    "ZeroBench 主集之外的较易子题集：主集 100 题发布时全零分，区分度实际由子题集承担",
    "主集是『视觉天花板』信号（满分=被攻破），子题集才是可日常跟踪的进度条——Qwen 表把它单列一行（Qwen3.8-Max 48.5 / GPT-5.6-Sol 46.7），与主集 pass@5（49）并读。",
    ["较难视觉推理的细粒度区分（多步图形/拼图式）"],
    ["发布即零分级的极端难度（主集负责）", "OCR 与文档解析"],
    ds(None, ["light 子题集（随主集发布）"], ["en"], "human_curated", True),
    [m("accuracy", "Accuracy")],
    {"raw": "子题集准确率（Qwen3.8-Max 表 2 单值行）"},
    [{"id": "v1", "label": "随 ZeroBench 发布", "note": "ZeroBench 主集 100 题 + light 子题集"}],
    ["子题集难度低于主集，不能用来宣称『攻破 ZeroBench』"],
    "Qwen3.8-Max 表 2 出现（48.5；主集 pass@5 为 49.0）；ZeroBench 主集另立条目",
    [src("paper", "https://arxiv.org/abs/2502.09696"),
     src("site", "https://zerobench.github.io/"),
     src("github", "https://github.com/jonathan-roberts1/zerobench")],
    ["zerobench"],
))

ENTITIES.append(base(
    "phyx", "PhyX",
    "PhyX: Does Your Model Have the \"Wits\" for Physical Reasoning?",
    [],
    ["multimodal", "reasoning"],
    "3K 道物理视觉推理题：6 大物理域 × 25 子域 × 6 推理类型，MC 与开放题双版本；发布时最佳模型与人类专家差 29%+",
    "考『看图 + 物理建模』的联合能力：热学/电磁/力学/近代物理/光学/声学都要从图里读条件再推理。当前旗舰已到 80 分段（Qwen3.8-Max 83.5），论文时代的 30-45 分段已成历史。",
    ["图像条件下的物理量推理与约束满足", "多步符号推理与真实世界约束结合"],
    ["纯文本物理公式推导", "无需物理知识的图像描述"],
    ds(3000, ["6 物理域 / 25 子域 / 6 推理类型", "MC 版与 open-ended 版"], ["en"], "human_curated", True),
    [m("accuracy", "Accuracy")],
    None,
    [{"id": "v1", "label": "PhyX（2025-05）", "note": "arXiv:2505.15929；GPT-4o 32.5% / Claude3.7 42.2%"}],
    ["部分题目图文依赖度高，OCR 失败会连坐物理分", "开放题判分依赖参考答案匹配"],
    "Qwen3.8-Max 表 2 出现（83.5 vs Gemini3.1-Pro 79.4 / GPT5.6-Sol 79.1）；混元与 HiPhO 同组常被一起引用",
    [src("paper", "https://arxiv.org/abs/2505.15929"),
     src("site", "https://huggingface.co/papers/2505.15929")],
    ["olympiadbench", "mathvision", "zerobench"],
))

# --- 医学 VQA ---------------------------------------------------------------

ENTITIES.append(base(
    "slake", "SLAKE",
    "SLAKE: A Semantically-Labeled Knowledge-Enhanced Dataset for Medical Visual Question Answering",
    [],
    ["multimodal", "knowledge"],
    "双语（英/中）医学影像 VQA：医生标注的语义标签 + 结构化医学知识库，覆盖多部位多模态（ISBI 2021 oral）",
    "医学 VQA 的『小而精』代表：带知识库与语义标注，能考『部位-器官-疾病』的推理链而不只是图文匹配。旗舰已到 85-90 分段（Qwen3.8-Max 90.8），接近饱和。",
    ["医学影像问答（解剖/病灶/影像学属性）", "基于医学知识库的推理"],
    ["病历文本问答", "诊断决策的安全性评估"],
    ds(None, ["英/中双语 QA"], ["en", "zh"], "human_curated", True),
    [m("accuracy", "Accuracy")],
    None,
    [{"id": "v1", "label": "SLAKE 1.0（ISBI 2021 oral）", "note": "arXiv:2102.09542"}],
    ["规模小、接近饱和，区分度有限", "以放射影像为主，病理/超声等模态覆盖少"],
    "Qwen3.8-Max 表 2 出现（90.8 vs Fable5 86.6 / GPT5.6-Sol 85.1）；Qwen-VL 系列发布表常引用",
    [src("paper", "https://arxiv.org/abs/2102.09542"),
     src("site", "https://www.med-vqa.com/slake/")],
    ["pmc-vqa", "biobench"],
))

ENTITIES.append(base(
    "pmc-vqa", "PMC-VQA",
    "PMC-VQA: Visual Instruction Tuning for Medical Visual Question Answering",
    [],
    ["multimodal", "knowledge"],
    "22.7 万医学 VQA 对 / 14.9 万图（PubMed Central 图像经生成管线构建），用于医学视觉指令微调与评测",
    "靠规模取胜的医学 VQA：题目由管线生成而非医生逐题标注，所以分数更多反映『图文对齐 + 医学术语』掌握度。旗舰 62-66 分段（Qwen3.8-Max 66.2），提升空间仍大。",
    ["大规模医学图文问答覆盖面"],
    ["临床推理正确性（生成题不能保证）", "罕见病诊断"],
    ds(None, ["训练集 + 评测集（论文口径 227k VQA / 149k 图）"], ["en"], "synthetic（真实医学图 + 生成 QA）", True),
    [m("accuracy", "Accuracy")],
    None,
    [{"id": "v1", "label": "PMC-VQA（2023-05）", "note": "arXiv:2305.10415"}],
    ["QA 由模型生成，存在噪声与答案偏置", "分数高不一定等于临床可用"],
    "Qwen3.8-Max 表 2 出现（66.2 vs Qwen3.7-Plus 63.4 / Fable5 63.2）",
    [src("paper", "https://arxiv.org/abs/2305.10415")],
    ["slake", "biobench"],
))

# --- Agent / 编码（Hy4 与 Qwen 表） -----------------------------------------

ENTITIES.append(base(
    "swe-atlas-refactoring", "SWE Atlas — Refactoring",
    None,
    ["SWE Atlas Refactoring"],
    ["coding", "agent"],
    "Scale AI SWE Atlas 的重构子赛道（70 任务）：在真实代码库上做保持行为的重构，程序化检查 + rubric 混合评分",
    "重构是最难刷分的编码赛道：不改变功能却要求工程质量提升，rubric 评分使分数低于问答/测试赛道（混元 Hy4 preview：重构 53.3 vs QnA 64.0 / 测试编写 57.8）。",
    ["保持语义等价前提下的代码重构质量", "工程质量维度（可读性/结构）而非仅功能正确"],
    ["bug 修复（SWE-bench 负责）", "从零建库（NL2Repo 负责）"],
    ds(70, ["问答 124 / 测试编写 90 / 重构 70（套件共 284）"], ["en"], "human_curated", None),
    [m("accuracy", "Accuracy（程序化检查 + rubric）")],
    {"raw": "Claude Code harness、256-turn 预算（Hy4 preview 附录口径）"},
    [],
    ["rubric 部分含主观评分", "三赛道难度不同，不能直接横向比大小"],
    "混元 Hy4 preview 附录出现（53.3）；套件母条目见 swe-atlas（Scale AI，284 任务）",
    [src("paper", "https://arxiv.org/abs/2605.08366"), src("site", HY4)],
    ["swe-atlas", "swe-atlas-codebase-qna", "swe-atlas-test-writing", "swebench"],
))

ENTITIES.append(base(
    "harbor-index", "Harbor-Index 1.0",
    None,
    ["Harbor Index"],
    ["agent"],
    "82 个任务的高信号 agent 元基准：从 54 个已接入 Harbor 适配器的基准共 6,627 个候选中经难度/AI 审计/人工审计三轮漏斗筛出，横跨 29 个源基准",
    "『从基准里再选基准』的压缩思路：用一次 2,260 亿 token、30 万美元级的大规模试跑找出对前沿模型仍然难且稳定的任务子集，从而用 82 题替代全量评测。混元 Hy4 preview 附录列 39.6。",
    ["跨域长程 agent 任务的稳定区分", "对前沿模型仍有 headroom 的任务筛选"],
    ["单域能力细察（回溯源基准）", "成本/延迟权衡"],
    ds(82, ["v1.0：82 任务（源自 29 个基准）"], ["en"], "derived（多基准任务精选）", True),
    [],
    None,
    [{"id": "v1.0", "label": "Harbor-Index 1.0", "note": "筛选自 6,627 候选 / 54 基准；试跑消耗 226B token、超 30 万美元算力"}],
    ["任务来源与筛选管线决定其偏向（偏向 Harbor 生态内基准）", "题量小，方差需多次运行控制"],
    "混元 Hy4 preview 附录出现（39.6）；Harbor 为 Terminal-Bench 团队的评测框架，官方站 harbor-index.org",
    [src("site", "https://harbor-index.org/"), src("site", "https://www.tbench.ai/news/harbor-index")],
    ["terminalbench", "agents-last-exam", "apex-agents"],
))

ENTITIES.append(base(
    "hy-lifesearch", "Hy-LifeSearch",
    None,
    ["Hunyuan LifeSearch", "LifeSearch"],
    ["agent"],
    "腾讯混元内部的生命科学检索评测：以检索工具回答生命科学问题（Hy4 preview 附录标注 Internal）",
    "厂商内部检索评测，位于 Agentic Search 组（同组 WideSearch 83.9 / OneMillionBench 65.4 / DRACO 77.2）：Hy4 preview 49.2，明显低于同组外部基准——内部集通常更难或更贴合自家业务。",
    ["生命科学领域的检索式问答（需引用与核验）"],
    ["通用网页浏览（BrowseComp 负责）", "非检索的参数化知识"],
    ds(None, [], ["zh", "en"], "vendor_internal", False),
    [m("accuracy", "Accuracy")],
    {"raw": "agentic 检索（Hy4 preview 附录，最高推理档口径）"},
    [],
    ["厂商内部/未公开，跨厂商不可比", "仅用于其模型家族纵向对比"],
    "厂商内部——Hy4 preview 附录 Agentic Search 组出现（49.2，标注 Internal）",
    [src("site", HY4)],
    ["hy-browsecomp-pro2", "widesearch", "browsecomp"],
))

ENTITIES.append(base(
    "hy-browsecomp-pro2", "Hy-BrowseComp-Pro2",
    None,
    ["Hunyuan BrowseComp Pro 2"],
    ["agent"],
    "腾讯混元内部的高难网页检索评测（BrowseComp 风格加强版；Hy4 preview 附录标注 Internal）",
    "对标 OpenAI BrowseComp 的内部加强版：Hy4 preview 56.1，同组 WideSearch 83.9——难浏览题仍显著低于宽检索题，说明多跳深检索是短板。",
    ["多跳深度网页检索与信息核验"],
    ["浅层事实问答", "生命科学垂域检索（Hy-LifeSearch 负责）"],
    ds(None, [], ["zh", "en"], "vendor_internal", False),
    [m("accuracy", "Accuracy")],
    {"raw": "agentic 浏览检索（Hy4 preview 附录，最高推理档口径）"},
    [],
    ["厂商内部/未公开，跨厂商不可比", "与公开 BrowseComp 的差异（题量/语言/难度）未披露"],
    "厂商内部——Hy4 preview 附录 Agentic Search 组出现（56.1，标注 Internal）",
    [src("site", HY4), src("site", "https://openai.com/index/browsecomp/")],
    ["hy-lifesearch", "browsecomp", "widesearch"],
))

ENTITIES.append(base(
    "e-bench-code", "E-Bench-Code (Internal)",
    None,
    ["E-Bench Code"],
    ["agent", "coding"],
    "腾讯混元内部多步工具调用 agent 评测的编码口径（Hy4 preview 附录标注 Internal，79.0）",
    "页面把 E-Bench / E-Bench-Code 都标注为 Internal：与公开论文 E-Bench（323 个跨王者荣耀/QQ 音乐/腾讯会议的合成任务）同名但关系未披露，分数只能在其家族内纵向对比（上代 64.4 → Hy4 preview 79.0）。",
    ["多步工具调用 agent 的编码任务完成率"],
    ["GUI 操作类工具调用（E-Bench 主集口径）", "纯代码生成（SWE-bench 系负责）"],
    ds(None, [], ["zh", "en"], "vendor_internal", False),
    [m("accuracy", "Accuracy")],
    {"raw": "Hy4 preview 附录口径（Claude Code harness，256-turn 预算）"},
    [],
    ["厂商内部/未公开，跨厂商不可比", "与同名公开论文 E-Bench 的关系未披露，引用时需防混淆"],
    "厂商内部——Hy4 preview 附录出现（79.0，标注 E-Bench-Code (Internal)；上代 64.4）",
    [src("site", HY4)],
    ["bankertoolbench", "automationbench"],
))

ENTITIES.append(base(
    "hy-finagentbench", "Hy-FinAgentBench",
    None,
    ["Hunyuan FinAgentBench"],
    ["agent"],
    "腾讯混元内部的金融 agent 评测（Hy4 preview 附录标注 Internal，79.7）",
    "金融垂域的 agent 化内部评测：同组 Hy-FinmodelBench v2 仅 57.0，说明『金融知识问答』与『金融 agent 任务』在内部口径下也相差 20 分以上——两者分别对应模型能力与工具执行能力。",
    ["金融场景的多步 agent 任务执行"],
    ["金融知识问答（Hy-FinmodelBench 负责）", "真实交易操作"],
    ds(None, [], ["zh", "en"], "vendor_internal", False),
    [m("accuracy", "Accuracy")],
    {"raw": "agentic 金融任务（Hy4 preview 附录，最高推理档口径）"},
    [],
    ["厂商内部/未公开，跨厂商不可比", "金融数据时效性强，版本间可能不可比"],
    "厂商内部——Hy4 preview 附录出现（79.7，标注 Internal；同组 Hy-FinmodelBench v2 57.0）",
    [src("site", HY4)],
    ["bankertoolbench"],
))

# --- 文档 / OCR / 办公（Qwen 表 2） -----------------------------------------

ENTITIES.append(base(
    "ocr-bench-v2", "OCRBench v2",
    "OCRBench v2: An Improved Benchmark for Evaluating Large Multimodal Models on Visual Text Localization and Reasoning",
    ["OCR-Bench-V2"],
    ["multimodal", "chinese"],
    "双语文本中心 OCR 评测：10,000 人工校验 QA、31 种场景、任务数约为前代 4 倍，另有 1,500 张人工标注私测图；定位/手写/逻辑推理是短板任务",
    "v1 的任务面太窄导致旗舰打满，v2 把文本定位、手写抽取、逻辑推理等硬任务纳入（NeurIPS 2025 D&B）。Qwen 表给 EN/ZH 双列：Qwen3.8-Max 74.2 / 68.3。",
    ["全页识别、场景文本 VQA、文档解析、关键信息抽取", "视觉文本定位/推理/计数等难任务"],
    ["语音识别", "无文本的纯视觉推理"],
    ds(10000, ["公开评测集（10,000 QA，31 场景）", "私测集（1,500 张人工标注图）"], ["en", "zh"], "human_curated", True),
    [],
    {"raw": "EN / ZH 双口径分别报告（Qwen3.8-Max 表 2 双列）"},
    [{"id": "v2", "label": "OCRBench v2（NeurIPS 2025 D&B）", "note": "arXiv:2501.00321；任务数约为 v1 的 4 倍"}],
    ["定位类任务对输出格式敏感", "高难度样本占比高，分数普遍低于 v1"],
    "Qwen3.8-Max 表 2 出现（EN 74.2 / ZH 68.3，双列）；GPT-5.6-Sol 69.0 / 57.3",
    [src("paper", "https://arxiv.org/abs/2501.00321"),
     src("site", "https://99franklin.github.io/ocrbench_v2/"),
     src("github", "https://github.com/yuliang-liu/MultimodalOCR")],
    ["cc-ocr-bench-v2", "omnidocbench", "chartqa"],
))

ENTITIES.append(base(
    "cc-ocr-bench-v2", "CC-OCR v2",
    "CC-OCR V2: Fine-Grained Attribution of LMM Failures in Real-World Visual Document Understanding",
    ["CC-OCR-Bench-V2"],
    ["multimodal"],
    "真实拍摄条件下的文档处理评测：5 项核心能力 × 16 子任务 × 74 应用场景、7,093 样本，并按光照/屏幕/成像质量归因模型失败",
    "v1 考『识字面』，v2 考『真实采集条件下的稳定性』——同一文档翻拍条件一变分数就掉，能把失败归因到光照/屏摄等物理因素。Qwen3.8-Max 79.6 / Fable5 72.4。",
    ["真实世界文档获取条件下的识字与处理鲁棒性", "失败归因（按成像条件细拆）"],
    ["合成渲染文档的理想条件上限", "手写潦草体的极限难度"],
    ds(7093, ["16 子任务 / 74 场景 / 5 评估轨道"], ["en", "zh"], "human_curated", True),
    [],
    None,
    [{"id": "v2", "label": "CC-OCR v2", "note": "arXiv:2605.03903；前代 CC-OCR arXiv:2412.02210（Qwen/阿里）"}],
    ["场景覆盖再广仍是静态图评测，不含交互式文档工作流"],
    "Qwen3.8-Max 表 2 出现（79.6 vs Fable5 72.4 / Qwen3.7-Plus 72.7）；前代 CC-OCR 由阿里 Qwen 团队发布",
    [src("paper", "https://arxiv.org/abs/2605.03903"),
     src("dataset", "https://huggingface.co/datasets/Eioss/CC-OCR-V2")],
    ["ocr-bench-v2", "omnidocbench"],
))

ENTITIES.append(base(
    "mtvqa", "MTVQA",
    "MTVQA: Benchmarking Multilingual Text-Centric Visual Question Answering",
    ["MTVQA-Test"],
    ["multimodal", "chinese"],
    "9 种语言的母语者人工标注文本中心 VQA：6,778 QA / 2,116 图（ByteDance，ACL 2025 Findings）",
    "把 TEC-VQA 从英中高资源语言扩到泰语/越南语/俄语等低资源语言：翻译式扩展会有『视觉-文本错位』，所以逐条母语标注。旗舰仅 41-57 分段，远未饱和。",
    ["多语言场景文本理解与问答", "低资源语言 OCR-VQA"],
    ["无文本图像问答", "文档级解析（OCRBench v2 负责）"],
    ds(None, ["Test 划分", "9 语言（母语者标注）"], ["en", "多语言（9 语种）"], "human_curated", True),
    [m("accuracy", "Accuracy")],
    {"raw": "Test 划分准确率（Qwen3.8-Max 表 2 行 MTVQA-Test）"},
    [{"id": "v1", "label": "MTVQA（ACL 2025 Findings）", "note": "arXiv:2405.11985"}],
    ["低资源语言样本相对少，单语言分数方差大"],
    "Qwen3.8-Max 表 2 出现（56.6 vs Gemini3.1-Pro 54.3 / GPT5.6-Sol 52.7）",
    [src("paper", "https://arxiv.org/abs/2405.11985"),
     src("site", "https://bytedance.github.io/MTVQA/"),
     src("github", "https://github.com/bytedance/MTVQA")],
    ["ocr-bench-v2", "omnidocbench", "chartqa"],
))

ENTITIES.append(base(
    "madqa", "MADQA",
    "Strategic Navigation or Stochastic Search? How Agents and Humans Reason Over Document Collections",
    [],
    ["agent", "multimodal"],
    "800 份真实异构 PDF 上的 2,250 道人工出题文档 QA：考 agent 的检索-导航-推理策略，并用 accuracy-effort 权衡刻画搜索成本",
    "论文结论值得注意：最佳 agent 的准确率能追平人类检索员，但答对的题 largely 不同，且靠暴力试错弥补策略不足——与 oracle 差近 20%。Qwen3.8-Max 91.8 为其表内最高。",
    ["跨文档 agentic 检索与导航策略", "多模态（图+文）证据整合"],
    ["单页 OCR", "无需检索的参数化知识"],
    ds(2250, ["800 份异构 PDF"], ["en"], "human_curated", True),
    [m("accuracy", "Accuracy")],
    {"raw": "agentic 检索协议（论文以 accuracy-effort tradeoff 评估）"},
    [{"id": "v1", "label": "MADQA（2026-03）", "note": "arXiv:2603.12180；Oxford OxRML 与 Snowflake 合作"}],
    ["判分依赖文档集合版本，需固定语料才能复现", "主要英文文档，中文覆盖有限"],
    "Qwen3.8-Max 表 2 出现（91.8 vs GPT5.6-Sol 87.8 / Opus4.8 86.8）",
    [src("paper", "https://arxiv.org/abs/2603.12180"),
     src("dataset", "https://huggingface.co/datasets/OxRML/MADQA"),
     src("site", "https://www.snowflake.com/en/blog/engineering/madqa-multimodal-agent-reasoning-benchmark/")],
    ["officeqa-pro", "omnidocbench"],
))

ENTITIES.append(base(
    "qwen-visual-office", "QwenVisualOffice",
    None,
    ["Qwen Visual Office"],
    ["multimodal"],
    "Qwen 自研的办公文档视觉理解评测（Qwen3.8 发布表 footnote 13 口径，未公开数据集）",
    "厂商自建办公场景集：分数普遍低（Qwen3.8-Max 44.6 为同表最高，Gemini3.1-Pro 39.6），说明真实办公文档（表格/票据/混版式）仍是多模态短板；因未公开，只能当纵向信号。",
    ["办公文档（表格/表单/混版式）的视觉理解与提取"],
    ["纯文本解析（OmniDocBench 负责）", "通用自然图像"],
    ds(None, [], ["zh", "en"], "vendor_internal", False),
    [],
    None,
    [],
    ["厂商内部/未公开，跨厂商不可比", "题量与划分未披露"],
    "厂商内部——Qwen3.8-Max 表 2 Document & Office Intelligence 组出现（44.6；footnote 13 自研口径）",
    [src("site", QWEN3_8)],
    ["madqa", "ai-office-bench"],
))

# -- Qwen 自研（3D / CAD） ----------------------------------------------------

ENTITIES.append(base(
    "qwen-blender-bench", "QwenBlenderBench",
    None,
    ["Qwen Blender Bench"],
    ["multimodal", "coding"],
    "Qwen 自研的 Blender 3D 任务评测（Qwen3.8 发布表 footnote 13 口径，未公开数据集）",
    "3D 生成/操作是 2026 年新出现的前沿子域：Qwen3.8-Max 69.9 与 Fable5 69.5 接近，而 Gemini3.1-Pro 仅 23.0、Qwen3.7-Plus 41.5——代际跃迁明显。因未公开，只能当纵向信号。",
    ["Blender 3D 场景的指令理解与生成/编辑"],
    ["CAD 工程建模（Parametric CAD Bench 负责）", "2D 图像编辑"],
    ds(None, [], ["en"], "vendor_internal", False),
    [],
    None,
    [],
    ["厂商内部/未公开，跨厂商不可比", "3D 结果判分依赖渲染比对，口径未披露"],
    "厂商内部——Qwen3.8-Max 表 2 Visual Agent & Coding 组出现（69.9；footnote 13 自研口径）",
    [src("site", QWEN3_8)],
    ["parametric-cad-bench"],
))

ENTITIES.append(base(
    "parametric-cad-bench", "Parametric CAD Bench",
    "Parametric CAD Bench: Can AI agents author editable CAD?",
    ["gNucleus CAD Bench"],
    ["coding", "agent", "multimodal"],
    "gNucleus 的 CAD agent 评测：从自然语言规格生成 FreeCAD 可执行脚本，几何正确性与规格一致性双重评分，并用『可编辑性门控』（调和均值）拒绝只交付静态网格",
    "与 3D 生成类基准的本质区别：产物必须是可编辑的参数化模型（工程配方），不是一张好看的外壳。Leaderboard 在 cadbench.ai，任务以 Harbor 套件发布；Qwen3.8-Max 91.5 为其表内最高。",
    ["参数化 CAD 建模（可执行、可编辑）", "规格-几何一致性核验"],
    ["纯 3D 外形生成（无参数约束）", "真实制造可行性（公差/工艺）"],
    ds(None, ["多步 agentic loop 生成 → FreeCAD 执行 → 参考设计比对"], ["en"], "synthetic（规格 + 参考设计）", True),
    [],
    {"raw": "multi-step agentic loop + editability gate（harmonic mean 评分：几何 + 规格）"},
    [{"id": "v1", "label": "Parametric CAD Bench（2026-05-13 发布）", "note": "Harbor 任务套件 gnucleus-ai/cad-bench；月度 run 报告"}],
    ["以 FreeCAD 单一工具链为参照，迁移到其他 CAD 内核未验证", "调和均值对单维归零敏感"],
    "Qwen3.8-Max 表 2 Visual Agent & Coding 组出现（91.5 vs Fable5 87.5 / Opus4.8 85.1）",
    [src("site", "https://www.gnucleus.ai/cad-bench/news/parametric-cad-bench"),
     src("site", "https://cadbench.ai"),
     src("github", "https://github.com/gnucleus-ai/cad-bench")],
    ["qwen-blender-bench", "harbor-index", "terminalbench"],
))

# -- 真实世界 / 空间 / 感知与 grounding（Qwen 表 2） --------------------------

ENTITIES.append(base(
    "lingoqa", "LingoQA",
    "LingoQA: Visual Question Answering for Autonomous Driving",
    [],
    ["multimodal"],
    "Wayve 的自动驾驶 VQA 基准：28K 段伦敦驾驶短视频 + 41.9 万条标注，Lingo-Judge 裁判与人类评审相关系数 0.95",
    "考『用语言解释驾驶场景』：GPT-4V 时代仅 59.6% 而人类 96.6%，差距说明感知易、解释难。旗舰已到 77-85 分段（Qwen3.8-Max 84.8），裁判模型的准确性是解读分数的前提。",
    ["驾驶场景的视频问答与解释生成"],
    ["端到端驾驶决策质量", "传感器融合与定位"],
    ds(None, ["28K 独立短视频场景 / 419K 标注"], ["en"], "human_curated", True),
    [],
    {"raw": "Lingo-Judge（真值分类器，0.95 Spearman）判定回答真实性"},
    [{"id": "v1", "label": "LingoQA（ECCV 2024）", "note": "arXiv:2312.14115"}],
    ["裁判模型本身可能带偏（论文以人工评审校准）", "只覆盖伦敦路况"],
    "Qwen3.8-Max 表 2 出现（84.8 vs Fable5 77.4 / Qwen3.7-Plus 83.4）",
    [src("paper", "https://arxiv.org/abs/2312.14115"),
     src("github", "https://github.com/wayveai/lingoqa")],
    ["surds", "realworldqa"],
))

ENTITIES.append(base(
    "surds", "SURDS",
    "SURDS: Benchmarking Spatial Understanding and Reasoning in Driving Scenarios with Vision Language Models",
    [],
    ["multimodal", "reasoning"],
    "基于 nuScenes 的驾驶空间推理评测：9,250 个评测样本（另有 41,080 训练实例），覆盖朝向/深度/定位/距离/左右序/前后关系六类",
    "空间关系是 VLM 的长期短板：SURDS 把它拆成六个可分别归因的子类（NeurIPS 2025 D&B）。Qwen3.8-Max 77.8 vs Fable5 79.4，旗舰间差距不大但距满分辨率仍有明显空间。",
    ["驾驶场景细粒度空间关系推理（六类）"],
    ["端到端规划", "地图/激光雷达融合推理"],
    ds(9250, ["评测 9,250 样本", "训练 41,080 实例"], ["en"], "derived（nuScenes 构建）", True),
    [],
    None,
    [{"id": "v1", "label": "SURDS（NeurIPS 2025 D&B）", "note": "arXiv:2411.13112"}],
    ["基于 nuScenes，场景多样性受源数据限制", "空间类别的判分对文本表述敏感"],
    "Qwen3.8-Max 表 2 Real-World & Spatial 组出现（77.8 vs Fable5 79.4 / Qwen3.7-Plus 77.2）",
    [src("paper", "https://arxiv.org/abs/2411.13112")],
    ["lingoqa"],
))

ENTITIES.append(base(
    "countqa", "CountQA",
    "CountQA: How Well Do MLLMs Count in the Wild?",
    [],
    ["multimodal"],
    "1,500+ 道高密度真实场景计数问答：杂乱、遮挡、目标密集；发布时 15 个 MLLM 最佳仅 42.9%（Google Research）",
    "计数是『最基础的认知短板』探针：不是模型不会认物体，而是数不过来。两年内旗舰从 42.9 爬到 72-82 分段（Qwen3.8-Max 82.4），进步真实可测。",
    ["真实高密度场景的物体计数"],
    ["检测框输出（COCO 负责）", "区域指代（Ref-Adv 负责）"],
    ds(None, ["1,500+ QA 对（手工拍摄真实场景）"], ["en"], "human_curated", True),
    [],
    None,
    [{"id": "v1", "label": "CountQA（2025-08）", "note": "arXiv:2508.06585；15 个 MLLM 最佳 42.9%"}],
    ["题目数中等，方差需多次运行控制"],
    "Qwen3.8-Max 表 2 Visual Perception & Grounding 组出现（82.4 vs Gemini3.1-Pro 72.8 / Opus4.8 41.3）",
    [src("paper", "https://arxiv.org/abs/2508.06585"),
     src("dataset", "https://huggingface.co/datasets/Jayant-Sravan/CountQA")],
    ["visfactor", "refadv-s"],
))

ENTITIES.append(base(
    "refadv-s", "Ref-Adv (S)",
    "Ref-Adv: Exploring MLLM Visual Reasoning in Referring Expression Tasks",
    ["RefAdv-S", "Ref-Adv"],
    ["multimodal"],
    "Ref-Adv 指代表达理解评测（Qwen 表行名 RefAdv-S）：语言上不平凡的表述 + 难干扰物 + 否定等推理要素，压制 shortcut 解法",
    "RefCOCO 系的高分主要靠短句 + 少干扰物的捷径；Ref-Adv 用真实图像 + 硬干扰物把分数重新拉开（Qwen3.8-Max 80.2 vs Opus4.8 61.7）。S 为表行后缀，公开材料未单独定义切分含义。",
    ["抗捷径的指代表达理解（含否定与推理要素）", "难干扰物下的区域定位"],
    ["检测框密度类指标（COCO 负责）", "计数（CountQA 负责）"],
    ds(None, ["真实图像 + 难干扰物 + 推理要素标注"], ["en"], "human_curated", True),
    [],
    None,
    [{"id": "v1", "label": "Ref-Adv（ICLR 2026）", "note": "arXiv:2602.23898"}],
    ["『S』切分的确切定义未在公开材料中明确，跨表对比需谨慎", "难干扰物样本构造依赖人工策展"],
    "Qwen3.8-Max 表 2 Visual Perception & Grounding 组出现（80.2 vs Gemini3.1-Pro 71.9 / Opus4.8 61.7）",
    [src("paper", "https://arxiv.org/abs/2602.23898"),
     src("github", "https://github.com/dddraxxx/Ref-Adv")],
    ["dense200", "coco"],
))

ENTITIES.append(base(
    "dense200", "Dense200",
    None,
    ["Dense-200"],
    ["multimodal"],
    "Qwen 自研的 200 题密集 grounding 评测（Qwen3.8 发布表 footnote 13 口径，未公开数据集）",
    "密集场景指代是 grounding 中最难的部分：Qwen3.8-Max 87.0 与 Gemini3.1-Pro 69.7 差 17 分，是同表 grounding 组里代际差最大的行——密集参照的进步集中在最新一代。",
    ["高密度场景下的指代与定位"],
    ["计数（CountQA 负责）", "检测 mAP（COCO 负责）"],
    ds(200, [], ["en"], "vendor_internal", False),
    [],
    None,
    [],
    ["厂商内部/未公开，跨厂商不可比", "题目构成与判分口径未披露"],
    "厂商内部——Qwen3.8-Max 表 2 Visual Perception & Grounding 组出现（87.0 vs Gemini3.1-Pro 69.7 / Opus4.8 20.8）",
    [src("site", QWEN3_8)],
    ["refadv-s", "coco"],
))

ENTITIES.append(base(
    "coco", "COCO",
    "Microsoft COCO: Common Objects in Context",
    ["Common Objects in Context"],
    ["multimodal"],
    "328k 图 / 250 万标注实例 / 91 目标类型（检测挑战常用 80 类）的经典视觉数据集；在厂商表中也常作 grounding/检测评测底座",
    "COCO 本身是训练与评测双用的『公共操场』：检测/分割早已高度饱和，近年主要当 grounding 的回归基线。Qwen3.8-Max 表 grounding 组 78.7，Gemini3.1-Pro 72.4。",
    ["目标检测/分割与 grounding 的基础回归"],
    ["细粒度长尾识别", "开放词汇检测（需 LVIS 等扩展）"],
    ds(None, ["train/val/test；80 类评测口径", "91 目标类型（论文口径）"], ["en"], "human_curated", True),
    [],
    {"raw": "grounding/检测口径（Qwen3.8-Max 表 2 Visual Perception & Grounding 组）"},
    [{"id": "v1", "label": "Microsoft COCO（ECCV 2014）", "note": "arXiv:1405.0312；2017 年后为常用版本"}],
    ["训练集高污染，作为前沿区分基准已失效", "80 类口径与 91 类论文口径并存，引用需注明"],
    "Qwen3.8-Max 表 2 出现（78.7 vs Qwen3.7-Plus 74.2 / Gemini3.1-Pro 72.4）；数据集由 COCO Consortium 维护",
    [src("paper", "https://arxiv.org/abs/1405.0312"), src("site", "https://cocodataset.org/")],
    ["refadv-s", "dense200", "countqa"],
))

ENTITIES.append(base(
    "visfactor", "VisFactor",
    "Human Cognitive Benchmarks Reveal Foundational Visual Gaps in MLLMs",
    ["VisFactor (FRCT digitized)"],
    ["multimodal", "reasoning"],
    "把认知心理学 FRCT 测验的 20 个视觉子测验数字化：考空间/知觉速度/图形closure等基础视觉认知；39 个前沿 MLLM 最佳仅 54.0%",
    "考『视觉底座』而非下游任务：算法可自动生成无限难度可控的新题，因此抗污染。旗舰分布极散（Qwen3.8-Max 60.8 vs Opus4.8 30.1），基础视觉认知仍是分层明显的能力。",
    ["基础视觉认知因子（空间、知觉速度、closure 等 4 域 20 子测验）"],
    ["下游任务表现（MMMU/VQA 负责）", "知识性问答"],
    ds(None, ["20 个视觉子测验（数字化 FRCT）；支持自动生成新测试用例"], ["en"], "derived（认知测验数字化）", True),
    [],
    None,
    [{"id": "v1", "label": "VisFactor（2025-02）", "note": "arXiv:2502.16435；39 个前沿 MLLM 最佳 54.0%"}],
    ["子测验计分与人类常模的对应关系仍在建立中"],
    "Qwen3.8-Max 表 2 Visual Perception & Grounding 组出现（60.8 vs GPT5.6-Sol 62.8 / Opus4.8 30.1）",
    [src("paper", "https://arxiv.org/abs/2502.16435"),
     src("github", "https://github.com/cuhk-arise/visfactor"),
     src("site", "https://cuhk-arise.github.io/VisFactor/")],
    ["countqa", "mmstar", "realworldqa"],
))

# --- 视频理解（Qwen 表 2） ---------------------------------------------------

ENTITIES.append(base(
    "mlvu", "MLVU",
    "MLVU: Benchmarking Multi-task Long Video Understanding",
    ["Multi-task Long Video Understanding Benchmark"],
    ["multimodal"],
    "多任务长视频理解评测：电影/监控/第一视角/动画/游戏等多体裁，灵活的视频长度扩展，dev 集以 M-Avg 报告、test 集含 11 个任务",
    "长视频评测的通用底座：把『变长』作为一等公民，考长度增加时的性能衰减。旗舰 85-91 分段（Qwen3.8-Max 90.8），与 VideoMME 的高分段一致，区分主力已转向更长的 LVBench/EgoLife。",
    ["长视频多任务理解（问答/排序/定位等）", "随视频长度增加的鲁棒性"],
    ["短视频即时反应", "长上下文纯文本任务"],
    ds(None, ["dev 集（M-Avg 口径）", "test 集（11 任务，含新增 SQA 等）"], ["en"], "human_curated", True),
    [],
    {"raw": "M-Avg（dev 集多任务平均，Qwen3.8-Max 表 2 口径）"},
    [{"id": "v1", "label": "MLVU（2024-06）", "note": "arXiv:2406.04264"}],
    ["dev/test 双口径并存，跨表引用需确认", "MC 类任务存在选项猜测空间"],
    "Qwen3.8-Max 表 2 出现（90.8 vs GPT5.6-Sol 87.6 / Opus4.8 53.4）",
    [src("paper", "https://arxiv.org/abs/2406.04264"),
     src("site", "https://mlvu.github.io/"),
     src("dataset", "https://huggingface.co/datasets/MLVU/MVLU")],
    ["egolife", "video-mme", "longvideobench", "tvbench", "lvbench"],
))

ENTITIES.append(base(
    "egolife", "EgoLifeQA",
    "EgoLife: Towards Egocentric Life Assistant",
    ["EgoLife"],
    ["multimodal", "longctx"],
    "6 人同住一周的第一视角生活数据集（300 小时多视图多模态）之上的长上下文生活问答套件 EgoLifeQA",
    "把长上下文推到『一整周生活流水』：问题需要跨天/跨人事件记忆（谁在什么时候说了什么）。表内常带记忆系统口径（Qwen3.8-Max w/ Mem. 80.3），裸上下文分数会低一截。",
    ["超长第一视角视频中的跨时间/跨人物事件问答"],
    ["短片段动作识别", "非第一视角的电影类长视频（MLVU 负责）"],
    ds(None, ["300 小时第一视角 + 第三人称参照；6 人 × 1 周"], ["en"], "human_curated", True),
    [],
    {"raw": "w/ Mem.（基于记忆系统，Qwen3.8-Max 表 2 口径）"},
    [{"id": "v1", "label": "EgoLife（CVPR 2025）", "note": "arXiv:2503.03803"}],
    ["带记忆系统口径引入额外工程变量，跨表可比性弱", "隐私场景数据不可公开完整复刻"],
    "Qwen3.8-Max 表 2 出现（80.3，w/ Mem.；footnote 14 记忆系统基于 Qwen-MM-Plugins；Fable5 82.3）",
    [src("paper", "https://arxiv.org/abs/2503.03803")],
    ["mlvu", "video-mme", "egoschema", "video-mmmu"],
))

ENTITIES.append(base(
    "videodr", "VideoDR",
    "Watching, Reasoning, and Searching: A Video Deep Research Benchmark on Open Web for Agentic Video Reasoning",
    ["Video Deep Research"],
    ["multimodal", "agent"],
    "首个视频 deep research 评测：视频只给局部线索，可验证答案分布在整个开放网——需跨帧锚点抽取 + 联网检索 + 多跳验证，覆盖 6 个语义域",
    "把 deep research 范式从文本扩展到视频：Qwen 表给 w/ Search 口径（Qwen3.8-Max 73.2 vs Fable5 77.1），而 Qwen3.7-Plus 仅 41.0——联网工具是这道题的分水岭。",
    ["视频线索与开放网证据的联合推理", "agentic 检索与多跳验证"],
    ["纯视频内容理解（答案在片内）", "文本 deep research（BrowseComp/GAIA 负责）"],
    ds(None, ["6 语义域"], ["en"], "human_curated", True),
    [],
    {"raw": "w/ Search（联网检索开启，Qwen3.8-Max 表 2 口径）"},
    [{"id": "v1", "label": "VideoDR（2026-01）", "note": "arXiv:2601.06943；Workflow 与 Agentic 双范式评测"}],
    ["依赖开放网检索，结果受搜索后端影响、复现需固定工具链", "视频-网页证据链的判分较复杂"],
    "Qwen3.8-Max 表 2 出现（73.2，w/ Search；footnote 15 检索工具开启）",
    [src("paper", "https://arxiv.org/abs/2601.06943"),
     src("github", "https://github.com/QuantaAlpha/VideoDR-Benchmark"),
     src("dataset", "https://huggingface.co/datasets/Yu2020/VideoDR")],
    ["mlvu", "video-mme", "browsecomp"],
))

# ---------------------------------------------------------------------------

def main():
    os.makedirs(OUT, exist_ok=True)
    for e in ENTITIES:
        p = os.path.join(OUT, e["id"] + ".json")
        with open(p, "w", encoding="utf-8", newline="\n") as f:
            json.dump(e, f, ensure_ascii=False, indent=2)
            f.write("\n")
        print("wrote", e["id"])
    print("total:", len(ENTITIES))


if __name__ == "__main__":
    main()
