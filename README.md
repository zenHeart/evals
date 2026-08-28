# evals.zenheart.site

> 一本面向**初级前端工程师**的大模型评估入门电子书。
> 让一个懂 JavaScript/TypeScript、不懂 AI 训练的人，只通过这本书就能完全理解：
> 1. 什么是评估、为什么需要评估、标准流程和核心原理；
> 2. 主流模型厂商每次公布模型性能时涉及哪些评估（每个评估的：实现原理 / 评估策略 / 价值作用）；
> 3. 评估的主流实践和框架；
> 4. 如何设计自己的自定义评估。

- **在线阅读**：[https://evals.zenheart.site](https://evals.zenheart.site)
- **下载 EPUB**：[https://evals.zenheart.site/evals.epub](https://evals.zenheart.site/evals.epub)
- **源码**：[https://github.com/zenHeart/evals](https://github.com/zenHeart/evals)

## 读者画像

- 1–3 年经验的前端工程师（React / Vue / TypeScript）
- 会写 Node.js，可能用过 OpenAI / Anthropic API
- 完全不懂 AI 训练/微调/RLHF
- 看过 LLM 厂商技术报告，但看不懂里面的评估表
- 想从零理解"评估"是什么，怎么自己写一个小评估

## 目录速览

共 28 章，分 6 部分：

1. **评估的世界观**（4 章）— 评估是什么、标准流程、核心原理
2. **基准与数据集家族图谱**（5 章）— 知识/数学/代码/多模态/长文+安全+Agent
3. **偏好与排行榜生态**（3 章）— MT-Bench、Arena、厂商报告解读
4. **评估工程实践**（6 章）— 框架全景、Node.js 自建、LLM-as-Judge、人类评估、RAG 评估、红队
5. **自定义评估设计**（5 章）— 业务目标→指标、测试集、CI/CD、在线评估、元的元评估
6. **实战与附录**（5 章）— 3 个真实案例 + 资源 + 术语表 + 自测

完整大纲见 [`book/outline.md`](book/outline.md)。

## 仓库结构

```
evals/
├── book/                       # 书籍源
│   ├── chapters/               # 28 个章节 Markdown
│   ├── cover/                  # 封面
│   ├── epub-content/           # EPUB 中间产物
│   ├── AGENTS.md               # 写作规范
│   ├── outline.md              # 完整大纲
│   ├── metadata.yaml           # 元信息 + 章序
│   ├── build-epub.mjs          # EPUB 构建脚本
│   ├── validate.js             # 校验脚本
│   └── ...
├── research/                   # 深度调研素材
│   ├── benchmarks.md           # 主流 LLM 基准数据集
│   ├── frameworks.md           # 评估框架与工具链
│   └── outline-design.md       # 大纲设计论证
├── docs/                       # Web 版源（VitePress）
├── deploy/                     # 部署脚本与配置
│   ├── aliyun-oss/             # 阿里云 OSS 部署
│   └── github-pages/           # GitHub Pages 部署
├── .github/workflows/          # CI：build-epub.yml
├── package.json
└── README.md
```

## 本地构建

```bash
# 1. 安装依赖
npm ci --ignore-scripts

# 2. 校验结构
npm run validate

# 3. 预处理（生成章节预处理产物）
npm run preprocess

# 4. 构建 EPUB
npm run build:epub:official
# 产物：evals.epub
```

## 部署

CI（GitHub Actions）在 `main` 分支推送时自动：

1. 运行 `book/validate.js` 校验章节
2. 预处理 + 后处理
3. 构建 `evals.epub`
4. 部署到 `gh-pages` 分支 + 阿里云 OSS（CDN）
5. 域名 `evals.zenheart.site` 指向 GitHub Pages / OSS

部署详情见 [`deploy/README.md`](deploy/README.md)。

## 引用本书

```
ZenHeart. (2026). 大模型评估入门：从前端工程师视角看 Eval (v1.0). 
https://evals.zenheart.site
```

## 许可

MIT License. 引用厂商基准数据时，请遵守各原始数据集的许可协议。
