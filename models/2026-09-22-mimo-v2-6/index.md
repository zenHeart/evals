---
vendor: xiaomi
model: MiMo-V2.6
release: mimo-v2-6
date: 2026-09-22
source: https://mimo.xiaomi.com/mimo-v2-6
fetched_at: 2026-09-22
---

# MiMo-V2.6（2026-09-22 小米 MiMo 系列）

发布页标题原文：Introducing MiMo-V2.6 series。页眉日期 September 22nd, 2026。

系列包含两款原生全模态模型 Pro 与 Flash，以及 Pro 的高速输出模式 UltraSpeed。权重与技术说明链到 Hugging Face 模型卡。附录对比表由同目录 `bench.js` 渲染，分数按该脚本写入 DOM 的值转录。

## 模型规格

| 模型 | 参数 | 上下文 | 输入 cache miss | 输出 |
|---|---|---|---:|---:|
| MiMo-V2.6-Pro | 1.02T 总参 / 42B 激活 | 1M | $0.435 | $0.87 |
| MiMo-V2.6-Flash | 309B 总参 / 15B 激活 | 1M | $0.14 | $0.28 |
| MiMo-V2.6-Pro-UltraSpeed | 发布页未单列 | 发布页未单列 | $4.35 | $8.7 |

参数与上下文来自官方模型卡。定价来自发布页，单位为美元 / 百万 token。

## 评测数据

| 评测 | 分数 | 备注 |
|---|---|---|
| DeepSWE v1.1 | MiMo-V2.6-Pro 71.9 | Coding；附录表 |
| DeepSWE v1.1 | MiMo-V2.6-Flash 67.9 | Coding；附录表 |
| ProgramBench | MiMo-V2.6-Pro 26.5 | Coding；附录表 |
| ProgramBench | MiMo-V2.6-Flash 26.0 | Coding；附录表 |
| MiMo Code Bench | MiMo-V2.6-Pro 63.2 | Coding；附录表 |
| MiMo Code Bench | MiMo-V2.6-Flash 61.2 | Coding；附录表 |
| GDPVal 2.1 (AA) | MiMo-V2.6-Pro 1673 | General；附录表 |
| Toolathlon-verified | MiMo-V2.6-Pro 76.9 | General；附录表 |
| Toolathlon-verified | MiMo-V2.6-Flash 73.6 | General；附录表 |
| Automation Bench v1.0.6 | MiMo-V2.6-Pro 53.1 | General；附录表 |
| Automation Bench v1.0.6 | MiMo-V2.6-Flash 52.3 | General；附录表 |
| Agents' Last Exam | MiMo-V2.6-Pro 31.6 | General；附录表 |
| Agents' Last Exam | MiMo-V2.6-Flash 27.6 | General；附录表 |
| Terminal Bench 4.0 | MiMo-V2.6-Pro 34.9 | General；附录表 |
| Terminal Bench 4.0 | MiMo-V2.6-Flash 28.8 | General；附录表 |
| Terminal Bench 2.1 | MiMo-V2.6-Pro 89.9 | General；附录表 |
| Terminal Bench 2.1 | MiMo-V2.6-Flash 87.6 | General；附录表 |
| OSWorld-Verified | MiMo-V2.6-Pro 82.0 | General；附录表 |
| OSWorld-Verified | MiMo-V2.6-Flash 80.8 | General；附录表 |
| JobBench | MiMo-V2.6-Pro 62.0 | General；附录表 |
| JobBench | MiMo-V2.6-Flash 61.2 | General；附录表 |
| MiMo Visual Coding | MiMo-V2.6-Pro 72.3 | Visual；附录表 |
| MiMo Visual Coding | MiMo-V2.6-Flash 71.5 | Visual；附录表 |
| CyberGym | MiMo-V2.6-Pro 94.0 | Cyber；附录表 |
| CyberGym | MiMo-V2.6-Flash 95.1 | Cyber；附录表 |
| ExploitGym | MiMo-V2.6-Pro 17.8 | Cyber；附录表 |
| ExploitGym | MiMo-V2.6-Flash 6.0 | Cyber；附录表 |
| ExploitBench | MiMo-V2.6-Pro 47.9 | Cyber；附录表 |
| ExploitBench | MiMo-V2.6-Flash 25.3 | Cyber；附录表 |
| SEC Bench Pro | MiMo-V2.6-Pro 66.3 | Cyber；附录表 |
| SEC Bench Pro | MiMo-V2.6-Flash 47.5 | Cyber；附录表 |
| MiMo Cyber Bench | MiMo-V2.6-Pro 81.7 | Cyber；附录表 |
| MiMo Cyber Bench | MiMo-V2.6-Flash 77.2 | Cyber；附录表 |
| DeepSWE v1.1 RL 终点 | MiMo-V2.6-Pro 72.57 | 正文，起点 58.4；与附录 71.9 分开 |
| DeepSWE v1.1 RL 终点 | MiMo-V2.6-Flash 65.68 | 正文，起点 48.8；与附录 67.9 分开 |
| Artificial Analysis Intelligence Index v4.3 | MiMo-V2.6-Pro 46.32 | 正文；图注四舍五入为 46 |
| MiMo Cyber Bench | MiMo-V2.6-Pro 80.2 | 模型卡；发布页附录为 81.7 |
