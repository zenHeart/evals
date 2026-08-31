#!/usr/bin/env node
/**
 * migrate-data.mjs — 把单一大 JSON（data/benchmarks.json）拆成实体化数据层。
 *
 * 兼容期做法：data/benchmarks.json 是当前唯一输入（已冻结、只读、不得手改），
 * 本脚本从它一键再生成以下产物（可重复执行，幂等）：
 *   data/taxonomy.json
 *   data/vendors.json
 *   data/benchmarks/<id>.json
 *   data/model-releases/legacy/<slug>.json   （含内嵌 evidence edge）
 *   data/generated/migration-report.json
 *
 * 产物中一切未知值写 null，不编造；last_verified_at = "2026-08-28"（数据抓取基线）。
 * 注意：data/model-releases/official/ 是人工核验样本，本脚本不读写该目录。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "data");
const BASELINE_DATE = "2026-08-28";

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const writeJson = (p, obj) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf8");
};
const rmRf = (p) => fs.rmSync(p, { recursive: true, force: true });

// ---------------------------------------------------------------------------
// 1. 读取冻结源
// ---------------------------------------------------------------------------
const sourcePath = path.join(DATA, "benchmarks.json");
if (!fs.existsSync(sourcePath)) {
  // 种子已删除（迁移完成后 goal.md §11.1 的目标状态）：这是一次性迁移脚本，产物已提交。
  // 如需重跑，请先从 git 历史恢复 data/benchmarks.json（git show <rev>:data/benchmarks.json）。
  console.log("[migrate] data/benchmarks.json 已移除——迁移早已完成，无需再生成。跳过。");
  process.exit(0);
}
const source = readJson(sourcePath);
const benchmarks = source.benchmarks;
const sourceCategories = source.categories;
const sourceVendors = source.vendors;

// ---------------------------------------------------------------------------
// 2. taxonomy.json — 类别本体 + draft 枚举
// ---------------------------------------------------------------------------
const CATEGORY_DESCRIPTIONS = {
  knowledge: "学科知识与通识覆盖：学术考试、事实问答与垂直领域知识面。",
  reasoning: "数学竞赛、逻辑推理与抗污染推理能力评测。",
  coding: "代码生成、缺陷修复与工程任务能力评测。",
  agent: "工具调用与终端、浏览器、操作系统等环境中的长程任务。",
  multimodal: "图文理解、文档与图表问答、视觉推理。",
  longctx: "长文档检索、上下文有效长度与长文理解。",
  chinese: "中文知识与多语言能力，以及金融、翻译等语言向垂域评测。",
  preference: "人类偏好、LLM-as-Judge 与排行榜类主观对齐评测。",
  safety: "幻觉、拒答、grounding 与红队安全评测。",
};

const taxonomy = {
  $comment:
    "类别本体与枚举。categories.id 由 data/benchmarks.json categories[] 迁移；modalities 与 metric_types 为 draft 枚举，值尚未与 benchmark 逐条对齐，仅供后续筛选使用。",
  version: "draft-1",
  categories: sourceCategories.map((c) => ({
    id: c.id,
    name: c.name,
    description: CATEGORY_DESCRIPTIONS[c.id] ?? null,
    color: c.color,
  })),
  modalities: {
    draft: true,
    values: ["text", "image", "audio", "video", "repository", "tool", "web"],
  },
  metric_types: {
    draft: true,
    values: [
      "accuracy",
      "exact_match",
      "pass_rate",
      "pass_at_k",
      "cons_at_k",
      "execution_success",
      "f1",
      "rouge",
      "chrf",
      "bleu",
      "elo",
      "win_rate",
      "judge_score",
      "attack_success_rate",
    ],
  },
};
writeJson(path.join(DATA, "taxonomy.json"), taxonomy);
const categoryIds = new Set(taxonomy.categories.map((c) => c.id));

// ---------------------------------------------------------------------------
// 3. vendors.json — 厂商注册表（goal.md §11.3）
//    official_domains 不编造：源数据没有，全部省略，待人工核验后补充。
//    Mistral 源数据 coverageStatus: gap → coverage_tier 2 + note（保持 pending）。
//    xiaomi 属 goal.md §12.6 Tier 2（Xiaomi MiMo），其余非 gap 厂商按 Tier 1。
// ---------------------------------------------------------------------------
const VENDOR_UPGRADES = {
  openai: { display_name: "OpenAI", region: "GLOBAL", coverage_tier: 1 },
  anthropic: { display_name: "Anthropic", region: "GLOBAL", coverage_tier: 1 },
  google: { display_name: "Google DeepMind / Gemini", region: "GLOBAL", coverage_tier: 1 },
  xai: { display_name: "xAI / Grok", region: "GLOBAL", coverage_tier: 1 },
  meta: { display_name: "Meta / Llama", region: "GLOBAL", coverage_tier: 1 },
  mistral: { display_name: "Mistral AI", region: "GLOBAL", coverage_tier: 2 },
  kimi: { display_name: "Moonshot AI / Kimi", region: "CN", coverage_tier: 1 },
  deepseek: { display_name: "DeepSeek", region: "CN", coverage_tier: 1 },
  glm: { display_name: "Z.ai / 智谱 GLM", region: "CN", coverage_tier: 1 },
  minimax: { display_name: "MiniMax", region: "CN", coverage_tier: 1 },
  qwen: { display_name: "Alibaba / Qwen", region: "CN", coverage_tier: 1 },
  doubao: { display_name: "ByteDance Seed / 豆包", region: "CN", coverage_tier: 1 },
  xiaomi: { display_name: "Xiaomi / 小米", region: "CN", coverage_tier: 2 },
};

const vendors = {
  $comment:
    "厂商注册表。由 data/benchmarks.json vendors[] 升级为 goal.md §11.3 结构；official_domains 待人工核验后补充，未核验前一律省略。coverage_tier 2 表示覆盖尚不完整或未核验到官方 benchmark 发布材料（pending）。",
  vendors: sourceVendors.map((v) => {
    const up = VENDOR_UPGRADES[v.id];
    if (!up) throw new Error(`vendors.json 迁移缺少 ${v.id} 的升级映射`);
    return {
      id: v.id,
      name: v.name,
      display_name: up.display_name,
      region: up.region,
      coverage_tier: up.coverage_tier,
      active: true,
      ...(v.coverageStatus
        ? { coverage_status: v.coverageStatus, note: `pending：源数据 coverageStatus=${v.coverageStatus}，尚未核验到该厂商官方 benchmark 发布材料` }
        : {}),
    };
  }),
};
writeJson(path.join(DATA, "vendors.json"), vendors);
const vendorIds = new Set(vendors.vendors.map((v) => v.id));

// ---------------------------------------------------------------------------
// 4. benchmarks/<id>.json — 每 benchmark 一个文件
// ---------------------------------------------------------------------------
const benchmarksOutDir = path.join(DATA, "benchmarks");
rmRf(benchmarksOutDir);

const idsByCategory = new Map();
for (const b of benchmarks) {
  if (!idsByCategory.has(b.category)) idsByCategory.set(b.category, []);
  idsByCategory.get(b.category).push(b.id);
}

const officialSourcesOf = (b) => {
  const out = [];
  if (b.url && b.url !== "-") out.push({ kind: "site", url: b.url });
  if (b.paper && b.paper !== "-") out.push({ kind: "paper", url: b.paper });
  return out;
};

for (const b of benchmarks) {
  const sameCat = (idsByCategory.get(b.category) ?? []).filter((id) => id !== b.id);
  writeJson(path.join(benchmarksOutDir, `${b.id}.json`), {
    id: b.id,
    name: b.name,
    full_name: null,
    aliases: [],
    status: b.status ?? null,
    categories: [b.category],
    summary: b.tests,
    interpretation: b.meaning ?? null,
    measures: [],
    does_not_measure: [],
    dataset: {
      sample_count: null,
      splits: [],
      languages: [],
      source_type: null,
      public_sample: null,
    },
    metrics: [],
    default_protocol: b.protocol && b.protocol !== "-" ? { raw: b.protocol } : null,
    versions: [],
    limitations: [],
    notes: b.adoptionNote ?? null,
    official_sources: officialSourcesOf(b),
    related_benchmarks: sameCat.slice(0, 6),
    content_status: "beta",
    last_verified_at: BASELINE_DATE,
  });
}

// ---------------------------------------------------------------------------
// 5. adoption[] → model release 实体 + evidence edge
// ---------------------------------------------------------------------------
// 厂商识别：按 release 字段文本匹配（宽松正则，仅用于路由 vendor_id）
const VENDOR_PATTERNS = [
  ["openai", /openai|gpt[-\s\d]/i],
  ["anthropic", /anthropic|claude/i],
  ["google", /google|gemini|med-?palm/i],
  ["xai", /\bxai\b|grok/i],
  ["meta", /\bmeta\b|llama/i],
  ["mistral", /mistral/i],
  ["kimi", /kimi|moonshot|月之暗面/i],
  ["deepseek", /deepseek/i],
  ["glm", /\bglm\b|智谱|z\.ai/i],
  ["minimax", /minimax/i],
  ["qwen", /qwen|alibaba|阿里/i],
  ["doubao", /doubao|bytedance|字节|豆包/i],
  ["xiaomi", /xiaomi|小米/i],
];
const matchVendors = (text) =>
  VENDOR_PATTERNS.filter(([, re]) => re.test(text)).map(([id]) => id);

// 主厂商标签（剥离后判断 release 字段是否含模型信息）
const PRIMARY_LABELS = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
  xai: "xAI",
  meta: "Meta",
  mistral: "Mistral",
  kimi: "Moonshot",
  deepseek: "DeepSeek",
  glm: "智谱",
  minimax: "MiniMax",
  qwen: "Qwen",
  doubao: "字节豆包",
  xiaomi: "小米",
};

// URL → release slug（URL 指向具体发布页/报告时，slug 从可定位证据推导）
const SLUG_BY_URL = new Map([
  ["https://www.anthropic.com/news/claude-3-5-sonnet", "claude-3-5-sonnet"],
  ["https://blog.google/products/gemini/", "google-gemini"],
  ["https://openai.com/index/learning-to-reason-with-llms/", "openai-o1"],
  ["https://arxiv.org/abs/2506.13585", "minimax"],
  ["https://arxiv.org/abs/2505.07608", "xiaomi"],
  ["https://x.ai/news/grok-3", "xai-grok-3"],
  ["https://arxiv.org/abs/2501.12948", "deepseek-r1"],
  ["https://qwenlm.github.io/blog/qwen2.5/", "qwen2-5-72b"],
  ["https://arxiv.org/abs/2501.12599", "kimi-k1-5"],
  ["https://arxiv.org/abs/2504.13914", "doubao"],
  ["https://huggingface.co/zai-org/GLM-4.5", "glm-4-5"],
  ["https://arxiv.org/abs/2412.19437", "deepseek-v3"],
]);

// 明确人工否决的边界样例（规则之外需要单独说明理由的）
const REJECT_OVERRIDES = new Map([
  ["Claude 3.7/4", "一个条目并列两个模型版本（3.7/4），无法对应单一发布"],
]);

// 无 URL 条目的时代/泛化标记：即使含数字（如 GPT-4V 的 4）也视为模糊描述
const NO_URL_VAGUE_MARKERS = [/时代/, /常引/, /标配/, /系列/, /广泛引用/];

const VENDOR_OFFICIAL_DOMAINS = [
  "anthropic.com", "openai.com", "blog.google", "x.ai",
  "qwenlm.github.io", "huggingface.co",
];

const classifySource = (url) => {
  if (!url) return { tier: null, attribution: null, kind: null };
  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {
    return { tier: "D", attribution: "third_party_reported", kind: "unknown" };
  }
  if (host.endsWith("arxiv.org")) {
    // 保守处理：arxiv 论文按 C 级第三方归因；厂商自著报告待人工改判
    return { tier: "C", attribution: "third_party_reported", kind: "arxiv_paper" };
  }
  if (VENDOR_OFFICIAL_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`))) {
    const kind = host.endsWith("huggingface.co") ? "model_card" : "official_release_blog";
    return { tier: "A", attribution: "vendor_reported", kind };
  }
  return { tier: "D", attribution: "third_party_reported", kind: "unknown" };
};

const parseScore = (score) => {
  if (score == null) return { value: null, display: null, score_status: "not_extracted" };
  const t = String(score).trim();
  if (t === "" || t === "-") return { value: null, display: null, score_status: "not_extracted" };
  if (/^\d+(?:\.\d+)?$/.test(t)) return { value: parseFloat(t), display: t, score_status: "reported" };
  // 非纯数字（如 "99+"）：保留原文 display，不强行转数值
  return { value: null, display: t, score_status: "not_extracted" };
};

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const slugFromTitle = (title, vendorId) => {
  const s = slugify(title);
  return s || vendorId;
};

const isVendorBareName = (title, vendorId) => {
  const label = PRIMARY_LABELS[vendorId] ?? vendorId;
  return title.trim().toLowerCase() === label.toLowerCase() ||
    slugify(title) === vendorId;
};

const modelOf = (title, vendorId) => {
  // 照抄规则：剥离主厂商标签后仍有剩余 → 保留 title 原文为 model；否则 null
  const label = PRIMARY_LABELS[vendorId] ?? vendorId;
  const rest = title.replace(new RegExp(label, "gi"), "").trim();
  return rest.length > 0 ? title : null;
};

const releasesDir = path.join(DATA, "model-releases", "legacy");
rmRf(releasesDir);

/** releaseKey：URL 存在时按 URL 归并（同页 = 同一发布），否则按 vendor+title */
const releaseKeyOf = (vendorId, release, url) =>
  url ? `url:${url}` : `title:${vendorId}::${release}`;

const releases = new Map(); // key → release record
const rejected = [];
let evidenceCount = 0;
const edgeIdSeen = new Set();

for (const b of benchmarks) {
  const adoptions = Array.isArray(b.adoption) ? b.adoption : [];
  for (const a of adoptions) {
    const release = (a.release ?? "").trim();
    const url = a.url && a.url !== "-" ? a.url : null;

    // --- 否决判定 -------------------------------------------------------
    const matched = matchVendors(release);
    let reason = null;
    if (REJECT_OVERRIDES.has(release)) {
      reason = REJECT_OVERRIDES.get(release);
    } else if (matched.length === 0) {
      reason = "无法识别具体厂商（模糊描述）";
    } else if (matched.length > 1) {
      reason = `并列多个厂商（${matched.join(", ")}），无法归一到单一发布`;
    } else if (!url) {
      const vendorId = matched[0];
      const hasConcreteModel = /\d/.test(release); // 无 URL 时须含版本/型号 token
      const vagueMarker = NO_URL_VAGUE_MARKERS.find((re) => re.test(release));
      if (!hasConcreteModel) {
        reason = "无 URL 且未指明具体模型版本（厂商名/系列/文档级描述）";
      } else if (vagueMarker) {
        reason = `含时代/系列级泛化标记（${vagueMarker}），无法对应单一发布`;
      }
    }
    if (reason) {
      rejected.push({
        benchmark_id: b.id,
        release,
        score: a.score ?? null,
        url,
        note: a.note ?? null,
        reason,
      });
      continue;
    }

    // --- 建/复用 release -------------------------------------------------
    const vendorId = matched[0];
    const key = releaseKeyOf(vendorId, release, url);
    if (!releases.has(key)) {
      const candidates = [];
      let slug = url ? SLUG_BY_URL.get(url) : undefined;
      releases.set(key, {
        slug: slug ?? null, // 首见时可能未定，收集候选后统一定名
        vendor_id: vendorId,
        titles: candidates,
        first_title: release,
        url,
        source: classifySource(url),
      });
    }
    const rec = releases.get(key);
    rec.titles.push(release);

    // --- evidence edge ---------------------------------------------------
    const score = parseScore(a.score);
    evidenceCount += 1;
    rec.edges = rec.edges ?? [];
    rec.edges.push({
      benchmark_id: b.id,
      score,
      note: a.note ?? null,
    });
  }
}

// 统一定名：同 URL 多条目时，标题优先取含版本 token 的，其次非纯厂商名，最后首见
const slugOwner = new Set();
for (const [, rec] of releases) {
  const vendorId = rec.vendor_id;
  let title = rec.titles.find((t) => /\d/.test(t));
  if (!title) title = rec.titles.find((t) => !isVendorBareName(t, vendorId));
  if (!title) title = rec.first_title;
  rec.title = title;
  rec.model = modelOf(title, vendorId);
  if (!rec.slug) rec.slug = slugFromTitle(title, vendorId);
  // slug 冲突兜底：追加厂商前缀
  if (slugOwner.has(rec.slug)) {
    rec.slug = `${vendorId}-${rec.slug}`;
    let n = 2;
    while (slugOwner.has(rec.slug)) rec.slug = `${vendorId}-${rec.slug}-${n++}`;
  }
  slugOwner.add(rec.slug);
}

// 写 release 文件
let withUrlCount = 0;
let noUrlCount = 0;
const releaseByVendor = {};
const tierStats = { A: 0, B: 0, C: 0, D: 0 };
const attributionStats = {};
let scoreReported = 0;
let scoreNotExtracted = 0;

for (const [, rec] of releases) {
  const { slug, vendor_id: vendorId, title, url } = rec;
  if (url) withUrlCount += 1; else noUrlCount += 1;
  releaseByVendor[vendorId] = (releaseByVendor[vendorId] ?? 0) + 1;

  const edges = (rec.edges ?? []).map((e) => {
    const edgeIdBase = `${vendorId}-${slug}--${e.benchmark_id}`;
    let edgeId = edgeIdBase;
    let n = 2;
    while (edgeIdSeen.has(edgeId)) edgeId = `${edgeIdBase}-${n++}`;
    edgeIdSeen.add(edgeId);
    tierStats[rec.source.tier] = (tierStats[rec.source.tier] ?? 0) + 1;
    attributionStats[rec.source.attribution] = (attributionStats[rec.source.attribution] ?? 0) + 1;
    if (e.score.score_status === "reported") scoreReported += 1; else scoreNotExtracted += 1;
    return {
      id: edgeId,
      benchmark_id: e.benchmark_id,
      benchmark_variant: null,
      vendor_id: vendorId,
      release_id: slug,
      model_id: null,
      model_name: rec.model,
      model_variant: null,
      source_url: url,
      source_kind: rec.source.kind,
      source_tier: rec.source.tier,
      attribution_type: rec.source.attribution,
      evidence_type: null,
      locator: { heading: null, table: null, row: null, figure: null, page: null, quote_snippet: null },
      reported_score: {
        value: e.score.value,
        display: e.score.display,
        unit: null,
        metric: null,
        score_status: e.score.score_status,
      },
      protocol: null,
      comparison_scope: "unknown",
      retrieved_at: BASELINE_DATE,
      last_verified_at: BASELINE_DATE,
      status: "pending",
      archive_url: null,
      notes: e.note ? `原文 note：${e.note}。迁移自 adoption[]，定位与协议未核验。` : "迁移自 adoption[]，定位与协议未核验。",
    };
  });

  writeJson(path.join(releasesDir, `${slug}.json`), {
    id: slug,
    vendor_id: vendorId,
    release_title: title,
    release_date: null,
    date_precision: null,
    models: rec.model ? [{ id: null, name: rec.model, variant: null }] : [],
    primary_sources: url ? [{ url, kind: rec.source.kind, language: null }] : [],
    benchmark_evidence: edges,
    retrieved_at: BASELINE_DATE,
    last_verified_at: BASELINE_DATE,
    status: "pending",
    notes:
      "迁移自 data/benchmarks.json adoption[]（legacy 兼容层）。release_title/model 为原文照抄，可能为泛化厂商名；来源定位、发布日期与协议均未核验，不得据此横向比较。",
    legacy: { migrated_from: "data/benchmarks.json", source_field: "adoption[].release" },
  });
}

// ---------------------------------------------------------------------------
// 6. 迁移报告
// ---------------------------------------------------------------------------
const tier1 = vendors.vendors.filter((v) => v.coverage_tier === 1).length;
const tier2Vendors = vendors.vendors.filter((v) => v.coverage_tier === 2).map((v) => v.id);
const releaseTotal = releases.size;
const benchmarkFiles = fs.readdirSync(benchmarksOutDir).filter((f) => f.endsWith(".json")).length;

const report = {
  $comment:
    "兼容期迁移报告：由 node scripts/migrate-data.mjs 从 data/benchmarks.json 一键再生成全部产物。兼容期做法——旧单文件 data/benchmarks.json 冻结只读，仍是迁移期唯一输入；新数据层（taxonomy/vendors/benchmarks/model-releases-legacy）为本迁移产物，待构建链路接入后切换消费路径。",
  mode: "legacy-compat",
  source_baseline: {
    file: "data/benchmarks.json",
    updated: source.updated ?? null,
    benchmark_count: benchmarks.length,
  },
  benchmarks: {
    before: benchmarks.length,
    after: benchmarkFiles,
    consistent: benchmarks.length === benchmarkFiles,
    out_dir: "data/benchmarks/",
  },
  taxonomy: {
    categories: taxonomy.categories.length,
    category_ids: taxonomy.categories.map((c) => c.id),
    modalities_draft: taxonomy.modalities.values,
    metric_types_draft: taxonomy.metric_types.values,
  },
  vendors: {
    total: vendors.vendors.length,
    tier1_count: tier1,
    tier2: tier2Vendors,
    note: "official_domains 全部省略（源数据无此字段，不编造）；mistral 依源数据 coverageStatus=gap 记为 coverage_tier 2 + pending 注记。",
  },
  adoption_entries: {
    total: benchmarks.reduce((n, b) => n + (Array.isArray(b.adoption) ? b.adoption.length : 0), 0),
    mapped_to_evidence: evidenceCount,
    rejected: rejected.length,
    check: "mapped_to_evidence + rejected === total",
  },
  releases: {
    total: releaseTotal,
    pending: releaseTotal,
    with_source_url: withUrlCount,
    without_source_url: noUrlCount,
    by_vendor: releaseByVendor,
    out_dir: "data/model-releases/legacy/",
    note: "全部 status=pending：泛化 release_title 保留原文照抄（如 MiniMax/xiaomi/字节豆包），待人工核验定位后精化，不参与公开计数。",
  },
  evidence_edges: {
    total: evidenceCount,
    pending: evidenceCount,
    by_source_tier: tierStats,
    by_attribution_type: attributionStats,
    with_score_value: scoreReported,
    not_extracted: scoreNotExtracted,
    note: "arxiv.org 一律保守记为 C 级 + third_party_reported（含 DeepSeek 等厂商自著报告，待人工改判）；source_tier=C/D 不满足公开计数条件。",
  },
  rejected,
  unmapped_fields: [
    "benchmarks[].url → benchmarks/<id>.json official_sources[kind=site]",
    "benchmarks[].paper → benchmarks/<id>.json official_sources[kind=paper]（\"-\" 记为缺失）",
    "benchmarks[].tests → summary",
    "benchmarks[].meaning → interpretation（新增字段，避免并入 summary 造成结构损失）",
    "benchmarks[].protocol → default_protocol.raw（保留原文，不强行结构化；\"-\" 记 null）",
    "benchmarks[].adoptionNote → notes（新增字段；属编辑性旁注，保留不丢）",
    "benchmarks[].status → status（仅 4 项有值，其余 null）",
    "顶层 $comment / updated / vendorsNote → 本报告 source_baseline 与 vendors.note，不落 benchmark 文件",
  ],
  decisions: [
    "release 归并键：有 URL 按 URL 归并（同一发布页 = 同一 release），无 URL 按 vendor+title；同 URL 多条目标题优先取含版本 token 者（如 Anthropic+Claude 3.5 Sonnet 同页 → 取 Claude 3.5 Sonnet）。",
    "建 release 的条件：厂商唯一可识别，且有 URL（标题可为纯厂商名）或无 URL 但含具体模型版本 token；两者都不满足进入 rejected。",
    "无 URL 但分数可用的条目（如 GPT-4o/MMMU 69.1）保留为 release+edge，source_url=null，status=pending——避免真实报告分数静默丢失。",
    "系列级名称（Qwen-VL 系列、Llama 系列、OpenAI o 系列等）一律 rejected：无法对应单一发布。",
    "model 字段照抄：剥离主厂商标签后 title 仍有剩余即保留原文为 model（如 智谱 GLM→model=智谱 GLM）；纯厂商名（MiniMax/xiaomi/xAI/字节豆包）model=null。",
    "「GPT-4 技术报告」（DROP 引用）视为具体发布保留：title 照抄，slug=gpt-4，来源 URL 缺失记 pending。",
    "slug 人工表：URL 指向可定位发布页/报告时按其内容命名（claude-3-5-sonnet、openai-o1、glm-4-5 等）；纯中文标题用厂商 id 兜底（xiaomi、doubao）。",
    "benchmark 文件新增 interpretation / notes 字段承接 meaning 与 adoptionNote，均超出任务列出的最小字段集，属于防丢失扩展，已在上面 unmapped_fields 说明。",
    "id 与 name 的既有错位（vizwiz 文件名对应 AI2D、popecv 对应 POPE、hlehle 对应 HLE、korb 对应 KernelBench、floris 对应 Flores-200）按「稳定 id 不随标题变化」原则保留原 id。",
  ],
};
fs.mkdirSync(path.join(DATA, "generated"), { recursive: true });
writeJson(path.join(DATA, "generated", "migration-report.json"), report);

// ---------------------------------------------------------------------------
// 7. 摘要输出
// ---------------------------------------------------------------------------
const adoptionTotal = benchmarks.reduce((n, b) => n + (Array.isArray(b.adoption) ? b.adoption.length : 0), 0);
console.log(`[migrate] benchmarks: ${benchmarks.length} → ${benchmarkFiles} files`);
console.log(`[migrate] taxonomy categories: ${taxonomy.categories.length}`);
console.log(`[migrate] vendors: ${vendors.vendors.length} (tier1=${tier1}, tier2=${tier2Vendors.join(",") || "-"})`);
console.log(`[migrate] adoption entries: ${adoptionTotal} = evidence ${evidenceCount} + rejected ${rejected.length} (${adoptionTotal === evidenceCount + rejected.length ? "OK" : "MISMATCH"})`);
console.log(`[migrate] releases: ${releaseTotal} (pending ${releaseTotal}, with-url ${withUrlCount}, no-url ${noUrlCount})`);
console.log(`[migrate] report: data/generated/migration-report.json`);
if (adoptionTotal !== evidenceCount + rejected.length) process.exit(1);
