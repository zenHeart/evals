---
vendor: qwen
model: Qwen3-235B-A22B
release: qwen3
date: 2025-04-29
source: https://qwenlm.github.io/blog/qwen3/
fetched_at: 2026-09-01
---

# Qwen3: Think Deeper, Act Faster

## 评测数据（转录）

### 表 1（页面 HTML 表格逐行转录）

| Models | Layers | Heads (Q / KV) | Tie Embedding | Context Length |
|---|---|---|---|---|
| Qwen3-0.6B | 28 | 16 / 8 | Yes | 32K |
| Qwen3-1.7B | 28 | 16 / 8 | Yes | 32K |
| Qwen3-4B | 36 | 32 / 8 | Yes | 32K |
| Qwen3-8B | 36 | 32 / 8 | No | 128K |
| Qwen3-14B | 40 | 40 / 8 | No | 128K |
| Qwen3-32B | 64 | 64 / 8 | No | 128K |

### 表 2（页面 HTML 表格逐行转录）

| Models | Layers | Heads (Q / KV) | # Experts (Total / Activated) | Context Length |
|---|---|---|---|---|
| Qwen3-30B-A3B | 48 | 32 / 4 | 128 / 8 | 128K |
| Qwen3-235B-A22B | 94 | 64 / 4 | 128 / 8 | 128K |

## 协议脚注

- 来源：https://qwenlm.github.io/blog/qwen3/（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.png | 843x835 | https://qwenlm.github.io/img/logo.png |  |
| images/02.png | 2350x1000 | https://qianwen-res.oss-accelerate-overseas.aliyuncs.com/qwen3-banner.png | Qwen3 Main Image |
| images/03.jpg | 3413x1920 | https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen3/qwen3-235a22.jpg |  |
| images/04.jpg | 3413x1920 | https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen3/qwen3-30a3.jpg |  |
| images/05.png | 3180x1970 | https://qianwen-res.oss-accelerate.aliyuncs.com/assets/blog/qwen3/thinking_budget.png |  |
| images/06.jpg | 1554x1058 | https://qianwen-res.oss-accelerate-overseas.aliyuncs.com/qwen3-base.jpg |  |
| images/07.png | 4143x1640 | https://qianwen-res.oss-accelerate.aliyuncs.com/assets/blog/qwen3/post-training.png |  |
| images/08.png | 3168x1780 | https://qianwen-res.oss-accelerate-overseas.aliyuncs.com/qwen3-logo.png |  |
