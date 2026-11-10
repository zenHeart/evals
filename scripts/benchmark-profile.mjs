/**
 * 评测档案统一模板（benchmark-profile/v1）
 *
 * 每个评测详情页都按同一套章节组织；每条事实必须指向一个权威来源（论文 / 官网 / 仓库 / 官方榜单 …）。
 * 找不到权威来源的章节，必须显式写 {"missing": "原因"}，不允许编造或留空。
 *
 * 数据位置：data/benchmarks/<id>.json 的 `profile` 字段。
 *
 * profile = {
 *   template: "benchmark-profile/v1",
 *   verified_at: "YYYY-MM-DD",               // 本档案最近一次逐条对照来源核验的日期
 *   sources: [{ id, kind, title, url, accessed }],
 *   sections: { <key>: Section }             // key 见 PROFILE_SECTIONS
 * }
 * Section =
 *   | { missing: "为什么暂时没有权威信息" }
 *   | { text?: string, facts?: [{k, v, cite?}], items?: [string | {text, cite?}],
 *       table?: { as_of, columns: [..], rows: [[..]] }, cite?: [ref] }
 * ref = "<source id>" 或 "<source id>@<定位，如 §3.2 / Table 1 / p.4>"
 * 规则：section.cite 非空时整节内容都归属这些来源；否则每个 fact / item 都必须自带 cite。
 */

export const PROFILE_TEMPLATE = "benchmark-profile/v1";

/** 模板章节（顺序即页面顺序）；required=false 的章节可以整节省略 */
export const PROFILE_SECTIONS = [
  { key: "overview", title: "一句话定位", required: true },
  { key: "origin", title: "出处：机构、作者与发布时间", required: true },
  { key: "measures", title: "测什么，不测什么", required: true },
  { key: "composition", title: "任务构成与规模", required: true },
  { key: "construction", title: "数据来源与构建方式", required: true },
  { key: "scoring", title: "评分方法与指标", required: true },
  { key: "reading", title: "怎么读这个分数", required: true },
  { key: "limitations", title: "局限、污染风险与争议", required: true },
  { key: "versions", title: "版本历史", required: true },
  { key: "official_results", title: "官方结果快照", required: false },
];

export const SOURCE_KINDS = ["paper", "site", "repo", "dataset", "leaderboard", "announcement", "docs", "blog"];
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const SRC_ID = /^[a-z0-9][a-z0-9-]*$/;

const refId = ref => String(ref).split("@")[0];

/** sources[] 的公共校验（v1 / v2 共用）；返回合法 id 集合 */
function checkSources(p, e) {
  const ids = new Set();
  if (!Array.isArray(p.sources) || p.sources.length === 0) e("sources 必须为非空数组");
  for (const s of p.sources || []) {
    const where = `sources[${s?.id ?? "?"}]`;
    if (!s || !SRC_ID.test(s.id || "")) { e(`${where}.id 缺失或非 kebab-case`); continue; }
    if (ids.has(s.id)) e(`${where}.id 重复`);
    ids.add(s.id);
    if (!SOURCE_KINDS.includes(s.kind)) e(`${where}.kind 非法（${s.kind}）`);
    if (typeof s.title !== "string" || !s.title.trim()) e(`${where}.title 必填`);
    if (typeof s.url !== "string" || !s.url.startsWith("https://")) e(`${where}.url 必须为 HTTPS`);
    if (!ISO.test(s.accessed || "")) e(`${where}.accessed 必须为 YYYY-MM-DD（本次核验时实际打开来源的日期）`);
  }
  if (!(p.sources || []).some(s => ["paper", "site", "repo", "dataset"].includes(s?.kind)))
    e("sources 至少要有一个 paper / site / repo / dataset 一手来源");
  return ids;
}

/** 校验一个 profile；返回错误字符串数组（空 = 通过） */
export function validateProfile(p, file = "profile", entity = null) {
  const out = [];
  const e = m => out.push(`${file}: profile ${m}`);
  if (!p || typeof p !== "object") { e("必须为对象"); return out; }
  if (p.template === PROFILE_TEMPLATE_V2) return validateProfileV2(p, entity, file);
  if (p.template !== PROFILE_TEMPLATE) e(`template 必须为 "${PROFILE_TEMPLATE}"`);
  if (!ISO.test(p.verified_at || "")) e("verified_at 必须为 YYYY-MM-DD");
  const ids = checkSources(p, e);
  const used = new Set();
  const checkRefs = (refs, where) => {
    if (!Array.isArray(refs) || refs.length === 0) return false;
    for (const r of refs) {
      if (typeof r !== "string" || !ids.has(refId(r))) e(`${where} 引用了不存在的来源「${r}」`);
      else used.add(refId(r));
    }
    return true;
  };
  const secs = p.sections || {};
  const known = new Set(PROFILE_SECTIONS.map(s => s.key));
  for (const k of Object.keys(secs)) if (!known.has(k)) e(`sections.${k} 不是模板章节`);
  for (const def of PROFILE_SECTIONS) {
    const s = secs[def.key];
    const where = `sections.${def.key}`;
    if (s === undefined) { if (def.required) e(`${where} 缺失（必填章节；确无权威信息时写 {"missing":"原因"}）`); continue; }
    if (!s || typeof s !== "object") { e(`${where} 必须为对象`); continue; }
    if ("missing" in s) {
      if (typeof s.missing !== "string" || s.missing.trim().length < 6) e(`${where}.missing 需写明缺失原因`);
      if (Object.keys(s).length > 1) e(`${where} 写了 missing 就不能再有内容`);
      continue;
    }
    const hasBody = (typeof s.text === "string" && s.text.trim()) || (s.facts || []).length || (s.items || []).length || s.table;
    if (!hasBody) { e(`${where} 没有内容（text / facts / items / table 至少一项）`); continue; }
    const secCited = checkRefs(s.cite, `${where}.cite`);
    if (s.text && !secCited) e(`${where}.text 需要节级 cite`);
    (s.facts || []).forEach((f, i) => {
      if (!f || typeof f.k !== "string" || typeof f.v !== "string" || !f.k.trim() || !f.v.trim()) e(`${where}.facts[${i}] 需要 k / v 字符串`);
      const own = f && f.cite !== undefined ? checkRefs(f.cite, `${where}.facts[${i}].cite`) : false;
      if (!own && !secCited) e(`${where}.facts[${i}]「${f?.k}」没有来源`);
    });
    (s.items || []).forEach((it, i) => {
      const text = typeof it === "string" ? it : it?.text;
      if (typeof text !== "string" || !text.trim()) e(`${where}.items[${i}] 为空`);
      const own = it && typeof it === "object" && it.cite !== undefined ? checkRefs(it.cite, `${where}.items[${i}].cite`) : false;
      if (!own && !secCited) e(`${where}.items[${i}] 没有来源`);
    });
    if (s.table) {
      const t = s.table;
      if (!ISO.test(t.as_of || "")) e(`${where}.table.as_of 必须为 YYYY-MM-DD`);
      if (!Array.isArray(t.columns) || !t.columns.length) e(`${where}.table.columns 必填`);
      if (!Array.isArray(t.rows) || !t.rows.length) e(`${where}.table.rows 必填`);
      for (const [i, r] of (t.rows || []).entries())
        if (!Array.isArray(r) || r.length !== (t.columns || []).length) e(`${where}.table.rows[${i}] 列数与 columns 不一致`);
      if (!secCited) e(`${where}.table 需要节级 cite`);
    }
  }
  for (const id of ids) if (!used.has(id)) e(`sources[${id}] 未被任何章节引用（无用来源请删除）`);
  return out;
}

/** 章节完成度（供页面展示与审计） */
export function profileCompleteness(p) {
  if (p?.template === PROFILE_TEMPLATE_V2) { const n = PROFILE_V2_LAYOUT.filter(d => !d.appendix).length; return { done: n, missing: 0, total: n }; }
  const req = PROFILE_SECTIONS.filter(s => s.required);
  if (!p || !p.sections) return { done: 0, missing: 0, total: req.length };
  let done = 0, missing = 0;
  for (const s of req) {
    const v = p.sections[s.key];
    if (!v) continue;
    if ("missing" in v) missing++; else done++;
  }
  return { done, missing, total: req.length };
}

/* ===========================================================================
 * benchmark-profile/v2 —— 新手友好版式（试点：HLE）
 *
 * 原则：尽量复用实体顶层字段，只给它们补上 cite；profile 里只放顶层字段没有归宿的内容。
 *   顶层字段（复用）                        → 页面位置
 *   summary + profile.cites.summary         → 1 一眼看懂 · 是什么
 *   interpretation + cites.interpretation   → 1 一眼看懂 · 高分意味着什么
 *   measures[{area,focus,share,format,cite}]→ 2 评估内容表（考察方向 | 关注重点 | 占比 | 题型）
 *   dataset{sample_count,…,totals,cite}     → 2 表下合计行 + 头部卡「题量」
 *   does_not_measure[{text,cite}]           → 2 表下「不测什么」
 *   dataset.construction[{k,text,cite}]     → 3 如何测量 · 题目怎么来
 *   default_protocol{raw,cite,variants[]}   → 3 如何测量 · 怎么判 / 口径
 *   metrics[{name,direction,description,cite}] → 3 如何测量 · 指标；metrics[0] 为头部卡「主要指标」
 *   limitations[{issue,impact,severity,response,reader,cite}] → 5 可信度与局限表（按影响排序）
 *   versions[{date,label,cite}]             → 附录 A 版本历史
 *   status / full_name                      → 头部卡
 *   profile 新增（顶层无归宿）：
 *   header{publisher,first_release}         → 头部卡（各带 cite）
 *   problem{text,cite}                      → 1 一眼看懂 · 解决什么问题
 *   ladder[{label,value,note,cite} | {label,auto:"ledger-top"}] → 4 分数阶梯（auto 行取本站账本）
 *   misreadings[{text,cite}]                → 4 常见误读
 *   background[{k,v,cite}]                  → 6 来源与背景
 *   official_results{table,cite}            → 附录 B（可选）
 * 当前最高分只从本站证据账本计算，不手写。
 * ======================================================================== */
export const PROFILE_TEMPLATE_V2 = "benchmark-profile/v2";
export const SEVERITY = ["高", "中", "低"];

/** v2 页面锚点（顺序即页面顺序）；appendix=true 的在附录 */
export const PROFILE_V2_LAYOUT = [
  { key: "glance", title: "一眼看懂" },
  { key: "content", title: "评估内容" },
  { key: "method", title: "如何测量" },
  { key: "reading", title: "怎么读这个分数" },
  { key: "trust", title: "可信度与局限" },
  { key: "background", title: "来源与背景" },
  { key: "versions", title: "附录 A · 版本历史", appendix: true },
  { key: "official_results", title: "附录 B · 官方结果快照", appendix: true, optional: true },
  { key: "ledger", title: "附录 C · 本站收录的发布成绩", appendix: true },
  { key: "adoption", title: "附录 D · 发布引用时间轴", appendix: true },
  { key: "related", title: "附录 E · 相关评测", appendix: true },
  { key: "refs", title: "附录 F · 参考来源", appendix: true },
];

/** 详情页必须出现的 #p-<key> 锚点（validate-site 用） */
export function profileAnchors(p) {
  if (p?.template === PROFILE_TEMPLATE_V2)
    return [...PROFILE_V2_LAYOUT.filter(d => !(d.optional && !p[d.key])).map(d => [d.key, d.title]), ["appendix", "附录"]];
  return [...PROFILE_SECTIONS.filter(d => p?.sections?.[d.key]).map(d => [d.key, d.title]),
    ["ledger", "本站收录的发布成绩"], ["adoption", "发布引用时间轴"], ["links", "官方链接"], ["refs", "参考来源"]];
}

function validateProfileV2(p, b, file) {
  const out = [];
  const e = m => out.push(`${file}: profile(v2) ${m}`);
  if (!b || typeof b !== "object") { e("校验 v2 需要传入实体本身（顶层字段是 v2 的正文）"); return out; }
  if (!ISO.test(p.verified_at || "")) e("verified_at 必须为 YYYY-MM-DD");
  if (p.sections !== undefined) e("v2 不使用 sections（正文在实体顶层字段）");
  const ids = checkSources(p, e);
  const used = new Set();
  const refs = (r, where) => {
    if (!Array.isArray(r) || r.length === 0) { e(`${where} 缺少 cite`); return; }
    for (const x of r) {
      if (typeof x !== "string" || !ids.has(refId(x))) e(`${where} 引用了不存在的来源「${x}」`);
      else used.add(refId(x));
    }
  };
  const str = (v, where) => { if (typeof v !== "string" || !v.trim()) e(`${where} 必须为非空字符串`); };
  const list = (arr, where, keys, min = 1) => {
    if (!Array.isArray(arr) || arr.length < min) { e(`${where} 至少 ${min} 条`); return []; }
    arr.forEach((it, i) => {
      if (!it || typeof it !== "object") { e(`${where}[${i}] 必须为对象`); return; }
      for (const k of keys) str(it[k], `${where}[${i}].${k}`);
      refs(it.cite, `${where}[${i}]`);
    });
    return arr;
  };
  // 头部卡
  for (const k of ["publisher", "first_release"]) {
    const h = p.header?.[k];
    if (!h) { e(`header.${k} 必填`); continue; }
    str(h.v, `header.${k}.v`); refs(h.cite, `header.${k}`);
  }
  // 1 一眼看懂
  str(b.summary, "summary"); refs(p.cites?.summary, "cites.summary");
  str(b.interpretation, "interpretation"); refs(p.cites?.interpretation, "cites.interpretation");
  str(p.problem?.text, "problem.text"); refs(p.problem?.cite, "problem");
  // 2 评估内容
  list(b.measures, "measures", ["area", "focus", "share", "format"]);
  list(b.does_not_measure, "does_not_measure", ["text"]);
  const d = b.dataset || {};
  if (typeof d.sample_count !== "number") e("dataset.sample_count 必须为数字");
  str(d.totals, "dataset.totals"); refs(d.cite, "dataset");
  // 3 如何测量
  list(d.construction, "dataset.construction", ["k", "text"]);
  str(b.default_protocol?.raw, "default_protocol.raw"); refs(b.default_protocol?.cite, "default_protocol");
  list(b.default_protocol?.variants, "default_protocol.variants", ["text"]);
  list(b.metrics, "metrics", ["name", "direction", "description"]);
  // 4 怎么读
  if (!Array.isArray(p.ladder) || p.ladder.length < 2) e("ladder 至少 2 级");
  (p.ladder || []).forEach((l, i) => {
    str(l?.label, `ladder[${i}].label`);
    if (l?.auto !== undefined) { if (l.auto !== "ledger-top") e(`ladder[${i}].auto 只支持 "ledger-top"`); return; }
    str(l?.value, `ladder[${i}].value`); refs(l?.cite, `ladder[${i}]`);
  });
  list(p.misreadings, "misreadings", ["text"]);
  // 5 可信度与局限
  list(b.limitations, "limitations", ["issue", "impact", "severity", "response", "reader"]).forEach((l, i) => {
    if (l && !SEVERITY.includes(l.severity)) e(`limitations[${i}].severity 必须为 ${SEVERITY.join(" / ")}`);
  });
  // 6 来源与背景 + 附录
  list(p.background, "background", ["k", "v"]);
  list(b.versions, "versions", ["date", "label"]);
  if (p.official_results !== undefined) {
    const t = p.official_results.table;
    if (!t || !ISO.test(t.as_of || "") || !Array.isArray(t.columns) || !Array.isArray(t.rows) || !t.rows.length) e("official_results.table 需要 as_of / columns / rows");
    else for (const [i, r] of t.rows.entries()) if (!Array.isArray(r) || r.length !== t.columns.length) e(`official_results.table.rows[${i}] 列数与 columns 不一致`);
    refs(p.official_results.cite, "official_results");
  }
  for (const id of ids) if (!used.has(id)) e(`sources[${id}] 未被任何内容引用（无用来源请删除）`);
  return out;
}
