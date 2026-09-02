# Release JSON 与 benchmark 实体模板（照抄形状，不发明字段）

本文件是**录入形状**的速查。枚举与校验规则的唯一所有者是 `scripts/validate-data.mjs`（ENUMS 常量）；
抽取口径与账本契约的唯一所有者是 `data/model-releases/official/README.md` 的「抽取口径」「账本契约」两节。
本文件与之冲突时，以上述两者为准。

## 1. Release JSON — `data/model-releases/official/<vendor_id>/<release-id>.json`

文件名 = `id` 字段（校验器强制）。精简自真实样例 `official/google/gemini-3-7-flash.json`：

```jsonc
{
  "id": "gemini-3-7-flash",                    // kebab-case，与文件名一致
  "vendor_id": "google",                       // 外键 → data/vendors.json
  "release_title": "Introducing Gemini 3.7 Flash", // 官方发布页标题原文
  "release_date": "2026-08-13",                // YYYY-MM-DD；页面只给月则 YYYY-MM + date_precision:"month"；无日期证据 → null
  "date_precision": "day",                     // day | month（仅在有日期时写）
  "models": [
    {
      "id": "gemini-3-7-flash",
      "name": "Gemini 3.7 Flash",
      "variant": null,
      "params": null,                          // 发布文明示的参数规模，如 "770B-A49B MoE"；未明示 → null
      "context_window": null,                  // 如 "1M" / "256K"；未明示 → null
      "pricing": {                             // 发布文明示的 API 定价（每百万 tokens）；未明示 → null
        "input_per_m": 0.75,
        "output_per_m": 3.75,
        "currency": "USD",                     // USD | CNY
        "note": "促销价至 2026-12-31"           // 可选：促销期/条件说明
      },
      "modalities": ["文本", "图像"],           // 中文短标签；纯文本模型写 ["文本"]；未明示 → null
      "capability_summary": null,              // 必写（1-2 句中文，口径见下节）
      "key_traits": []                         // ≤4 个中文短标签，如 "开源权重" "长上下文" "推理增强"
    }
  ],
  "capability_tags": ["coding", "agent"],      // 自由标签，低频字段
  "primary_sources": [
    { "url": "https://…", "kind": "official_release_blog", "language": "en" }
  ],
  "benchmark_evidence": [
    {
      "id": "google-gemini-3-7-flash--frontier-code",
      //        ^vendor    ^release         ^^  ^benchmark —— 双连字符分隔，校验器强制
      "benchmark_id": "frontier-code",         // 三步判定，见下节
      "benchmark_variant": "1.1 Main",         // 页面行名中的版本/条件；无则 null
      "vendor_id": "google",                   // 与 release 冗余，校验器要求一致
      "release_id": "gemini-3-7-flash",
      "model_id": "gemini-3-7-flash",          // 取自家模型列
      "model_variant": null,
      "source_url": "https://…",               // 与 primary_sources[0] 一致；无来源必须整体为 null
      "source_kind": "official_release_blog",
      "source_tier": "A",                      // 厂商官方页 = A；无 source_url 时必须为 null
      "attribution_type": "vendor_reported",   // 自报；榜单转述 third_party_reported；散文明文引竞品 comparison_cited
      "evidence_type": "text",                 // text（DOM 表/散文）| figure（图表图片）
      "locator": {
        "heading": "Better intelligence for complex workflows",
        "table": null, "row": "Terminal-bench 2.1 …", "figure": "文件名+行描述", "page": null,
        "quote_snippet": "…(43.6% vs 34.4%)"   // DOM 机读行可省；图片行必填 figure
      },
      "reported_score": {
        "value": 43.6,                         // number 或 null；禁止 "-"（校验器强制）
        "display": "43.6%",                    // 页面原样字符串
        "unit": "percent",                     // percent | elo | index | usd_fund | …
        "metric": null, "score_status": "reported"
        // score_status: reported(有值) | not_extracted(点名行无数值) | not_reported(仅提及)
        // 数值在图里、未经人工确认 → value:null + score_status:"not_extracted" + status:"pending"
      },
      "protocol": {                            // 只记页面明示值，未写即 null（全 12 键）
        "harness": null, "tools": null, "shots": null, "reasoning_effort": null,
        "temperature": null, "top_p": null, "token_budget": null, "turn_limit": null,
        "time_limit": null, "run_count": null, "aggregation": null, "judge": null
      },
      "comparison_scope": "only_same_protocol",
      "retrieved_at": "2026-08-31",            // 抓取当天
      "last_verified_at": "2026-08-31",
      "status": "verified",                    // verified | pending | …（枚举见 validate-data.mjs）
      "archive_url": null,                     // 通常写归档相对路径线索或 null
      "notes": "…"                             // 基线值、跨页冲突、new-benchmark 标记都写这里
    }
  ],
  "retrieved_at": "2026-08-31",
  "last_verified_at": "2026-08-31",
  "status": "verified",                        // release 级：有 verified 行才可 verified；占位发布= pending
  "notes": "发布日期证据链、页面修订记录、未转录区块说明……",
  "revisions": []                              // 勘误时追加 {date, field, from, to, reason}；只追加不覆盖
}
```

### capability_summary 撰写口径（时间轴卡片的核心文案）

事件卡把它渲染为卡片正文的概述段，目标是**用户只读这一句就知道模型是什么、擅长什么**。写法：

1. 第一句：发布文自身的定位（它怎么说这个模型，如"编码与智能体工作马"），不得改成自己的猜测；
2. 第二句：结合本 release 已收录评测给出证据画像——领域分布（如"收录的 22 项评测以编码与智能体为主"）+ 最多 2 个亮点分数（用已录入 evidence 的 display 原值，如"TB 2.1 85.8%"）；
3. 禁止：跨厂商比较断言（"最强/超过某家"）、页外信息、编造定位；无评测数值的发布写定位句 + "本次发布未报告评测数值"。

规格字段（params / context_window / pricing / modalities）与 key_traits 同理：**只写发布文明示内容**，未明示一律 null/空——部署建议、推测值不上卡。

### benchmark_id 三步判定

1. `data/benchmarks/<id>.json` 已有同名实体 → 直接用；
2. `data/generated/benchmark-aliases.json` 的 `aliases` 命中 → 用归并后的正式 id（别名表是唯一归并入口，load-data 消费时会自动归并，但新写入仍应直接写正式 id）；
3. 都没有 → 新铸 kebab-case id，`notes` 写 `new-benchmark: …`。账本会自动为其生成"由发布引用自动生成"的兜底详情页，**不阻塞入库**；只有当页面/论文足以整理出完整定义（summary + interpretation 至少非空且为读者语言）时才同步创建实体。

### 新建 benchmark 实体 — `data/benchmarks/<id>.json`

必填字段形状（validate-data.mjs 强制）：`id`（=文件名）、`name`、`full_name`（可 null）、`aliases`（数组，可空）、`categories`（非空，取值见 data/taxonomy.json）、`summary`（非空，一句话讲它测什么）、`measures` / `does_not_measure` / `metrics` / `versions` / `limitations` / `related_benchmarks`（数组，可空）、`dataset`（对象，可全 null）、`official_sources`（HTTPS URL 数组）、`content_status`（新档 `"beta"`）、`last_verified_at`（当天）。
**`interpretation` 必须写真实解读**（分数怎么读、量纲、当前水位）——站点详情页的「30 秒看懂」直接渲染它，构建门禁会拦截"待补"类占位文案；写不出解读就不要建实体，让兜底页先顶着。

## 2. 发布文归档 — `models/YYYY-MM-DD-<model-slug>/`

按发布日期组织，四件套：

```
models/2026-08-13-gemini-3-7-flash/
├── page.html    # 原始页面存档（渲染后 HTML）
├── images/      # 页面全部图片原样下载（图表转写与人工复核的依据）
├── index.md     # frontmatter + 全量评测数据转录表（唯一人读入口）
└── manifest.json
```

`index.md` frontmatter 固定六键：`vendor` / `model` / `release`（=release id）/ `date` / `source` / `fetched_at`。
转录表三列 `| 评测 | 分数 | 备注 |`：页面散文与 DOM 表逐行转录；图表行标注「(视觉转写)」；未报告单元格（原文 `-`）不转录；非评测内容（定价等）可转录但注明。
归档先行、账本后写：`models/` 是复核依据，账本行的 `locator.figure` 应指向这里的文件名。

## 3. 无官方发布文怎么办

只有媒体转述或聚合站跑分、找不到厂商官方一级来源（官方 blog / newsroom / 官方 GitHub model 仓 / 官方 model card）→ **不建档**，在批次报告「跳过清单」里记录厂商、模型名、检索过的渠道与结论。先例：GLM-4 因无可溯源发布文整条删除；xAI 静默代际（grok-4-3 / grok-4-20）以零行占位 + `status:"pending"` 收口，二级来源数字一律不记。
