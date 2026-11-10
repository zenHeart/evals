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

/** 校验一个 profile；返回错误字符串数组（空 = 通过） */
export function validateProfile(p, file = "profile") {
  const out = [];
  const e = m => out.push(`${file}: profile ${m}`);
  if (!p || typeof p !== "object") { e("必须为对象"); return out; }
  if (p.template !== PROFILE_TEMPLATE) e(`template 必须为 "${PROFILE_TEMPLATE}"`);
  if (!ISO.test(p.verified_at || "")) e("verified_at 必须为 YYYY-MM-DD");
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
