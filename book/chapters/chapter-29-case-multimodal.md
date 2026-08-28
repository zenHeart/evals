# 29. 案例研究（三）：评估一个多模态应用

> **如果只读一节**：多模态评估 = (1) MMMU 综合 + (2) 业务子任务 + (3) OCR 准确率 + (4) 视觉幻觉检测。**OCR 和幻觉是单独的难题**。

## 29.1 业务背景

**公司**：XX 教育
**产品**：AI 拍照解题 App
**目标**：用户拍照 → 识别题目 → 解题 + 讲解

**多模态能力**：
- OCR（识别手写/印刷体）
- 公式识别
- 几何图形理解
- 多语言（中英日韩）
- 解题（数学、物理、化学）

## 29.2 评估维度

| 维度 | 指标 | 目标 |
|---|---|---|
| OCR 准确率 | 字符级 F1 | > 95% |
| 公式识别 | LaTeX 准确率 | > 90% |
| 几何识别 | 角度/面积准确率 | > 90% |
| 解题正确率 | pass@1 | > 85% |
| 视觉幻觉率 | 误识别率 | < 5% |
| 多语言 OCR | 各语言 F1 | > 90% |
| 速度 | P95 延迟 | < 3s |

## 29.3 测试集

**来源 1：公开数据**

| 基准 | 测什么 |
|---|---|
| MMMU | 综合多学科 |
| MathVista | 数学视觉 |
| ChartQA | 图表 |
| DocVQA | 文档 |
| OCRBench | OCR 综合 |

**来源 2：业务数据（10,000 道真实题）**

```jsonl
{"id": "math-001", "image": "math_001.jpg", "type": "math_equation", "expected_latex": "x^2 + 5x + 6 = 0", "expected_solution": "x = -2 or x = -3"}
{"id": "geo-001", "image": "geo_001.png", "type": "geometry", "expected_angle": "60°", "expected_explanation": "等边三角形每个角都是 60°"}
{"id": "chem-001", "image": "chem_001.jpg", "type": "chemistry_formula", "expected_formula": "H2SO4", "expected_name": "硫酸"}
```

**来源 3：合成数据**

```python
# 用 LaTeX 渲染器合成几何题
import subprocess
import random

def generate_geometry_questions(n=100):
    questions = []
    for i in range(n):
        # 1. 随机生成几何参数
        angle = random.randint(10, 170)
        side = random.randint(1, 10)
        
        # 2. 用 LaTeX 渲染图
        latex = f"\\triangle ABC with angle A = {angle}^\\circ"
        subprocess.run([
            "pdflatex", "-interaction=nonstopmode",
            f"\\input{{geometry_template.tex}}\\def\\angle{{{angle}}}\\input{{geometry_body.tex}}"
        ])
        
        # 3. 读图、转 base64
        image_b64 = image_to_base64(f"output_{angle}.png")
        
        questions.append({
            "id": f"geo-syn-{i:03d}",
            "image_b64": image_b64,
            "type": "geometry",
            "expected_angle": f"{angle}°",
        })
    
    return questions
```

## 29.4 OCR 评估

```python
# eval_ocr.py
from Levenshtein import distance
import json

def eval_ocr(model, samples):
    """评估 OCR 准确率"""
    results = []
    
    for s in samples:
        # 模型识别
        predicted = model.ocr(s["image"])
        expected = s["expected_text"]
        
        # 字符级 F1
        char_f1 = char_level_f1(predicted, expected)
        
        # 词级 F1
        word_f1 = word_level_f1(predicted, expected)
        
        results.append({
            "id": s["id"],
            "char_f1": char_f1,
            "word_f1": word_f1,
            "predicted": predicted,
            "expected": expected,
        })
    
    return aggregate(results)

def char_level_f1(predicted, expected):
    pred_chars = set(predicted)
    expected_chars = set(expected)
    
    tp = len(pred_chars & expected_chars)
    fp = len(pred_chars - expected_chars)
    fn = len(expected_chars - pred_chars)
    
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
    
    return f1

def word_level_f1(predicted, expected):
    pred_words = predicted.split()
    expected_words = expected.split()
    
    tp = len(set(pred_words) & set(expected_words))
    fp = len(set(pred_words) - set(expected_words))
    fn = len(set(expected_words) - set(pred_words))
    
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
    
    return f1
```

## 29.5 公式识别评估

```python
# eval_formula.py
def eval_formula_recognition(model, samples):
    """评估 LaTeX 公式识别准确率"""
    results = []
    
    for s in samples:
        predicted_latex = model.recognize_formula(s["image"])
        expected_latex = s["expected_latex"]
        
        # 用 sympy 比较数学等价
        is_equivalent = math_equivalent(predicted_latex, expected_latex)
        
        # 字符串相似度
        similarity = string_similarity(predicted_latex, expected_latex)
        
        results.append({
            "id": s["id"],
            "is_equivalent": is_equivalent,
            "similarity": similarity,
        })
    
    return aggregate(results)

def math_equivalent(latex1, latex2):
    """用 sympy 比较两个 LaTeX 是否数学等价"""
    from sympy import parse_latex, simplify
    try:
        expr1 = parse_latex(latex1)
        expr2 = parse_latex(latex2)
        return simplify(expr1 - expr2) == 0
    except:
        return False
```

## 29.6 视觉幻觉评估

```python
# eval_hallucination.py
def eval_visual_hallucination(model, samples):
    """评估模型是否在图中"看到"不存在的东西"""
    # POPE 风格：让模型判断图中是否有 X
    
    true_pos = 0
    false_pos = 0
    true_neg = 0
    false_neg = 0
    
    for s in samples:
        # 问"图中有 X 吗？"
        question = f"Is there a {s['object']} in the image?"
        answer = model.vqa(s["image"], question).lower()
        
        # s['has_object'] = True/False 是否真存在
        # answer = 'yes'/'no' 模型回答
        model_yes = 'yes' in answer
        actual_yes = s['has_object']
        
        if model_yes and actual_yes: true_pos += 1
        elif model_yes and not actual_yes: false_pos += 1  # 幻觉！
        elif not model_yes and not actual_yes: true_neg += 1
        elif not model_yes and actual_yes: false_neg += 1
    
    precision = true_pos / (true_pos + false_pos) if (true_pos + false_pos) > 0 else 0
    recall = true_pos / (true_pos + false_neg) if (true_pos + false_neg) > 0 else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
    accuracy = (true_pos + true_neg) / len(samples)
    
    return {
        "hallucination_rate": false_pos / len(samples),
        "precision": precision,
        "recall": recall,
        "f1": f1,
        "accuracy": accuracy,
    }
```

## 29.7 多语言 OCR

```python
# eval_multilingual_ocr.py
LANGUAGES = {
    "zh": "中文",
    "en": "English",
    "ja": "日本語",
    "ko": "한국어",
}

def eval_multilingual_ocr(model, samples):
    """按语言分组评估"""
    results = {}
    
    for lang_code, lang_name in LANGUAGES.items():
        lang_samples = [s for s in samples if s["language"] == lang_code]
        if not lang_samples:
            continue
        
        char_f1_scores = []
        for s in lang_samples:
            predicted = model.ocr(s["image"])
            char_f1_scores.append(char_level_f1(predicted, s["expected_text"]))
        
        results[lang_code] = {
            "name": lang_name,
            "count": len(lang_samples),
            "avg_char_f1": sum(char_f1_scores) / len(char_f1_scores),
        }
    
    return results
```

## 29.8 综合评估 Pipeline

```python
# full_eval.py
def run_full_evaluation(model, test_set_path):
    samples = load_samples(test_set_path)
    
    # 1. OCR
    ocr_results = eval_ocr(model, [s for s in samples if s["type"] == "text"])
    
    # 2. 公式
    formula_results = eval_formula_recognition(model, [s for s in samples if s["type"] == "formula"])
    
    # 3. 视觉幻觉
    hallucination_results = eval_visual_hallucination(model, [s for s in samples if s["type"] == "vqa"])
    
    # 4. 解题（用 MMMU/MathVista）
    mathvista_results = run_mathvista(model)
    
    # 5. 多语言 OCR
    multilingual_results = eval_multilingual_ocr(model, samples)
    
    # 6. 综合
    return {
        "ocr": ocr_results,
        "formula": formula_results,
        "hallucination": hallucination_results,
        "mathvista": mathvista_results,
        "multilingual": multilingual_results,
        "overall_score": compute_overall_score([
            ocr_results, formula_results, mathvista_results
        ]),
    }
```

## 29.9 评估结果

| 指标 | 值 | 目标 | 状态 |
|---|---|---|---|
| OCR 字符 F1 | 0.93 | > 0.95 | ⚠️ 略低 |
| 公式识别 | 0.88 | > 0.90 | ⚠️ |
| 视觉幻觉率 | 0.04 | < 0.05 | ✅ |
| 解题 pass@1 | 0.78 | > 0.85 | ❌ |
| 中文 OCR F1 | 0.91 | > 0.90 | ✅ |
| 英文 OCR F1 | 0.95 | > 0.90 | ✅ |
| 日文 OCR F1 | 0.85 | > 0.90 | ⚠️ |
| 韩文 OCR F1 | 0.80 | > 0.90 | ❌ |

**改进方向**

```
1. OCR → 切换更强 OCR 模型
2. 公式 → 专门的公式识别模型
3. 解题 → 用 Claude 3.5 Sonnet
4. 日韩 → 收集更多日韩训练数据
```

## 29.10 章节小结

- **多模态评估 = OCR + 公式 + 几何 + 解题 + 幻觉**
- **每种能力有专门指标**
- **多语言** 是隐藏难点
- **幻觉检测** 用 POPE 类问题
- **合成数据** 解决长尾场景

## 29.11 验收自测

1. **选择**：多模态评估最难的是？
   - A. OCR
   - B. 公式识别
   - C. 视觉幻觉检测
   - D. 多语言

2. **简答**：为什么"视觉幻觉"是单独的问题？

3. **实操**：用 MMMU 跑 100 道多模态题评估你的模型。

## 29.12 延伸阅读

⭐⭐⭐
- [MMMU 论文](https://arxiv.org/abs/2311.16502)
- [MathVista 论文](https://arxiv.org/abs/2310.08955)
- [POPE 论文](https://arxiv.org/abs/2305.10355)

⭐⭐
- [OCR 评估综述](https://arxiv.org/abs/2102.05258)
- [Math Formula Recognition](https://github.com/lukas-blecher/LaTeX-OCR)

⭐
- [DocVQA](https://www.docvqa.org/)
- [ChartQA](https://github.com/ahmed-masry/ChartQA)
- [OCRBench](https://github.com/Yuliang-Liu/MultimodalOCR)
