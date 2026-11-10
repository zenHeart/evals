/**
 * benchmark-profile-page.mjs — 按 benchmark-profile/v1 模板渲染评测详情页正文。
 * 页面骨架（shell / 时间轴卡片）由 build-benchmarks-hub.mjs 提供；本模块只负责模板章节、
 * 引用角标、本站收录成绩表、官方链接与参考来源。所有事实都带 [n] 角标指向「参考来源」。
 */
import { PROFILE_SECTIONS, PROFILE_V2_LAYOUT, profileCompleteness } from "./benchmark-profile.mjs";

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export const PROFILE_CSS = `
.pf-meta { display:flex; flex-wrap:wrap; gap:8px; margin:10px 0 4px; font:600 12px/1.6 var(--mono); color:var(--graphite); }
.pf-meta span { border:1px solid var(--rule); border-radius:999px; padding:2px 10px; }
.pf-meta .ok { border-color:color-mix(in srgb, #16a34a 45%, transparent); color:#15803d; }
.pf-toc { display:flex; flex-wrap:wrap; gap:6px; margin:14px 0 4px; }
.pf-toc a { font-size:12.5px; padding:3px 10px; border-radius:999px; background:color-mix(in srgb, var(--graphite) 9%, transparent); text-decoration:none; color:inherit; }
.pf-toc a:hover { background:color-mix(in srgb, var(--graphite) 18%, transparent); }
.pf-sec { scroll-margin-top:72px; }
.pf-sec ul { margin:8px 0; padding-left:20px; }
.pf-sec li { margin:6px 0; line-height:1.75; }
.pf-sec p { line-height:1.8; }
sup.cite { font:600 10.5px/1 var(--mono); margin-left:1px; white-space:nowrap; }
sup.cite a { text-decoration:none; color:var(--accent, #2563eb); }
.pf-missing { color:var(--graphite); border-left:3px solid var(--rule); padding:4px 12px; }
.pf-table { width:100%; border-collapse:collapse; font-size:13.5px; }
.pf-table th, .pf-table td { border-bottom:1px solid var(--rule); padding:6px 8px; text-align:left; vertical-align:top; }
.pf-table th { font:700 11.5px/1.5 var(--mono); color:var(--graphite); letter-spacing:.04em; }
.pf-table td.num { font-family:var(--mono); white-space:nowrap; }
.pf-refs { padding-left:22px; font-size:13.5px; }
.pf-refs li { margin:5px 0; word-break:break-all; }
.pf-refs .kind { font:600 11px/1 var(--mono); color:var(--graphite); margin-right:6px; text-transform:uppercase; }
.pf-notice { border:1px dashed var(--rule); border-radius:10px; padding:10px 14px; margin:14px 0; font-size:13.5px; color:var(--graphite); }
.pf-notice b { color:inherit; }
`;

const KIND_LABEL = { paper: "论文", site: "官网", repo: "代码仓库", dataset: "数据集", leaderboard: "官方榜单", announcement: "发布公告", docs: "文档", blog: "博客" };

/** 未按模板升级的页面：诚实列出缺哪些模板章节（不使用占位词） */
export function profileNotice(kind) {
  const titles = PROFILE_SECTIONS.filter(s => s.required).map(s => s.title).join("、");
  const lead = kind === "auto"
    ? "本页目前只有厂商发布中引用的分数，还没有按统一档案模板逐条核对论文与官网。"
    : "本页是早期整理的简版说明，还没有按统一档案模板逐条核对论文与官网。";
  return `<div class="pf-notice"><b>档案完整度：</b>${lead}统一模板要求的章节为：${esc(titles)}；每条事实都要附权威来源。升级前请以下方原文链接为准。</div>`;
}

export function renderProfile(b, profile, ctx) {
  const srcIndex = new Map(profile.sources.map((s, i) => [s.id, i + 1]));
  const cite = refs => (refs || []).map(r => {
    const [id, loc] = String(r).split(/@(.*)/s);
    const n = srcIndex.get(id);
    const src = profile.sources[n - 1];
    const tip = `${KIND_LABEL[src.kind] || src.kind}：${src.title}${loc ? " · " + loc : ""}`;
    return `<sup class="cite"><a href="#src-${esc(id)}" title="${esc(tip)}">[${n}${loc ? " " + esc(loc) : ""}]</a></sup>`;
  }).join("");
  const comp = profileCompleteness(profile);

  const secHtml = def => {
    const s = profile.sections[def.key];
    if (!s) return "";
    let body = "";
    if ("missing" in s) {
      body = `<p class="pf-missing">暂无权威来源可引用：${esc(s.missing)}</p>`;
    } else {
      const secCite = cite(s.cite);
      if (s.text) body += `<p>${esc(s.text)}${secCite}</p>`;
      if (s.facts?.length) body += `<div class="kv">${s.facts.map(f => `<div class="k">${esc(f.k)}</div><div>${esc(f.v)}${cite(f.cite)}</div>`).join("")}</div>`;
      if (s.items?.length) body += `<ul>${s.items.map(it => typeof it === "string" ? `<li>${esc(it)}</li>` : `<li>${esc(it.text)}${cite(it.cite)}</li>`).join("")}</ul>`;
      if (s.table) {
        const t = s.table;
        const isNum = v => /^[\d.$%,~+-]+%?$/.test(String(v));
        body += `<div class="table-wrap"><table class="pf-table"><thead><tr>${t.columns.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${t.rows.map(r => `<tr>${r.map(v => `<td${isNum(v) ? ' class="num"' : ""}>${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></div><p class="refs">快照日期 ${esc(t.as_of)}${secCite}</p>`;
      }
      if (!s.text && !s.table && secCite) body += `<p class="refs">本节来源${secCite}</p>`;
    }
    return `<section class="pf-sec" id="p-${def.key}"><h2 class="detail-sec">${esc(def.title)}</h2>${body}</section>`;
  };

  const links = profile.sources
    .map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(KIND_LABEL[s.kind] || s.kind)} ↗</a>`).join("");

  const ledger = ctx.ledgerRows.length ? `<div class="table-wrap"><table class="pf-table"><thead><tr><th>发布日期</th><th>模型</th><th>分数</th><th>口径</th><th>来源</th></tr></thead><tbody>${ctx.ledgerRows.map(r => `<tr><td class="num">${esc(r.date || "—")}</td><td><a href="${esc(r.modelHref)}">${esc(r.model)}</a><br><span class="refs">${esc(r.vendor)}</span></td><td class="num">${esc(r.score)}${r.status === "verified" ? "" : " <span class=\"refs\">（图表读数）</span>"}</td><td>${esc(r.protocol || "未写明")}</td><td>${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.attr)} ↗</a>` : esc(r.attr)}</td></tr>`).join("")}</tbody></table></div>` : `<p class="pf-missing">本站账本里还没有厂商发布引用这个评测。</p>`;

  const toc = [...PROFILE_SECTIONS.filter(d => profile.sections[d.key]).map(d => [d.key, d.title]), ["ledger", "本站收录的发布成绩"], ["adoption", "发布引用时间轴"], ["links", "官方链接"], ["refs", "参考来源"]]
    .map(([k, t]) => `<a href="#p-${k}">${esc(t)}</a>`).join("");

  return {
    head: `<div class="pf-meta" data-profile="${esc(profile.template)}"><span class="ok">统一档案模板 v1</span><span>${comp.done}/${comp.total} 章节有来源${comp.missing ? ` · ${comp.missing} 章节暂无权威信息` : ""}</span><span>${profile.sources.length} 个权威来源</span><span>核验于 ${esc(profile.verified_at)}</span></div>
  <nav class="pf-toc" aria-label="本页目录">${toc}</nav>`,
    sections: PROFILE_SECTIONS.map(secHtml).join("\n"),
    ledger: `<section class="pf-sec" id="p-ledger"><h2 class="detail-sec">本站收录的发布成绩</h2>
  <p class="refs">来自本站证据账本（厂商官方发布中的原始数值，按分数从高到低）。厂商自报与上方官方榜单的脚手架、推理档位可能不同，只有口径一致时才可横向比较。</p>${ledger}</section>`,
    links: `<section class="pf-sec" id="p-links"><h2 class="detail-sec">官方链接</h2><div class="ext-links">${links}<a href="../">← 返回评估大全</a></div></section>`,
    refs: `<section class="pf-sec" id="p-refs"><h2 class="detail-sec">参考来源</h2><ol class="pf-refs">${profile.sources.map(s => `<li id="src-${esc(s.id)}"><span class="kind">${esc(KIND_LABEL[s.kind] || s.kind)}</span>${esc(s.title)} · <a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.url)}</a> <span class="refs">（访问于 ${esc(s.accessed)}）</span></li>`).join("")}</ol></section>`,
  };
}

/* ===================== benchmark-profile/v2（新手友好版式） ===================== */
export const PROFILE_V2_CSS = `
.pf2-card { display:grid; grid-template-columns:repeat(auto-fill, minmax(min(100%, 200px), 1fr)); gap:10px; margin:14px 0 6px; }
.pf2-card > div { border:1px solid var(--rule); border-radius:10px; padding:10px 12px; }
.pf2-card .k { font:700 11px/1.4 var(--mono); color:var(--graphite); letter-spacing:.04em; margin-bottom:4px; }
.pf2-card .v { font-size:14px; line-height:1.6; }
.pf2-card .v b { font-size:18px; }
.pf2-card .wide { grid-column:1 / -1; }
.pf2-glance { list-style:none; padding:0 !important; }
.pf2-glance li { display:grid; grid-template-columns:7.5em minmax(0, 1fr); gap:10px; margin:10px 0 !important; }
.pf2-wrap, .pf2-wrap * { overflow-wrap:anywhere; }
.pf2-glance .lbl { font-weight:800; }
.pf2-ladder { list-style:none; padding:0 !important; border-left:3px solid var(--rule); margin-left:6px !important; }
.pf2-ladder li { position:relative; padding-left:16px; margin:12px 0 !important; }
.pf2-ladder li::before { content:""; position:absolute; left:-8px; top:.55em; width:12px; height:12px; border-radius:50%; background:var(--bg, #fff); border:3px solid var(--accent, #2563eb); }
.pf2-ladder .val { font:700 15px/1.4 var(--mono); }
.pf2-ladder .note { color:var(--graphite); font-size:13.5px; }
.pf2-steps { counter-reset:st; list-style:none; padding:0 !important; }
.pf2-steps > li { counter-increment:st; position:relative; padding-left:34px; }
.pf2-steps > li::before { content:counter(st); position:absolute; left:0; top:1px; width:24px; height:24px; border-radius:50%; background:color-mix(in srgb, var(--graphite) 14%, transparent); font:700 12px/24px var(--mono); text-align:center; }
.pf2-sev { font:700 11.5px/1 var(--mono); padding:3px 8px; border-radius:999px; white-space:nowrap; }
.pf2-sev.s-高 { background:color-mix(in srgb, #dc2626 16%, transparent); color:#b91c1c; }
.pf2-sev.s-中 { background:color-mix(in srgb, #d97706 18%, transparent); color:#b45309; }
.pf2-sev.s-低 { background:color-mix(in srgb, #16a34a 16%, transparent); color:#15803d; }
.pf2-appendix { margin-top:34px; border-top:2px solid var(--rule); padding-top:6px; }
.pf2-appendix > h2.pf2-apx-title { font-size:15px; color:var(--graphite); letter-spacing:.06em; }
.pf2-note { color:var(--graphite); font-size:13px; line-height:1.7; }
.pf2-apx-list { display:flex; flex-wrap:wrap; gap:6px 14px; list-style:none; padding:0 !important; margin:6px 0 10px !important; font-size:13.5px; }
.pf2-part { border:1px solid var(--rule); border-radius:10px; padding:0 14px; margin:10px 0; }
.pf2-part > summary { cursor:pointer; list-style:none; display:flex; flex-wrap:wrap; align-items:baseline; gap:4px 12px; padding:10px 0; }
.pf2-part > summary::-webkit-details-marker { display:none; }
.pf2-part > summary::before { content:"▸"; color:var(--graphite); transition:transform .15s; }
.pf2-part[open] > summary::before { transform:rotate(90deg); }
.pf2-part > summary h2.detail-sec { margin:0 !important; font-size:16px; }
.pf2-part > summary h2.detail-sec::after { display:none; }
.pf2-part-body { padding-bottom:12px; }
.pf2-meta { font:600 11.5px/1.5 var(--mono); color:var(--graphite); }
.pf2-wrap .pf-table .num { white-space:nowrap; font-family:var(--mono); }
.pf2-wrap .pf-table th { white-space:nowrap; }
.pf2-table-stack td:first-child { min-width:6.5em; }
@media (max-width: 640px) {
  .pf2-glance li { grid-template-columns:minmax(0, 1fr); gap:2px; }
  .pf2-wrap sup.cite { white-space:normal; }
  .pf2-table-stack, .pf2-table-stack tbody { display:block; width:100%; min-width:0 !important; }
  .pf2-table-stack thead { display:none; }
  .pf2-table-stack tr { display:block; border:1px solid var(--rule); border-radius:10px; padding:6px 10px; margin:10px 0; }
  .pf2-table-stack td { display:block; border:0 !important; padding:4px 0 !important; min-width:0 !important; }
  .pf2-table-stack td::before { content:attr(data-th) "："; font:700 11.5px/1.5 var(--mono); color:var(--graphite); }
}
`;

const NO_TOOLS = /no[ -]?tools?|without tools?|w\/o tools?|no-tool|不带工具|无工具/i;
const WITH_TOOLS = /tool|search|code|brows|带工具|联网/i;
/** 账本行按口径分组：no / with / other */
export const toolClass = v => NO_TOOLS.test(v || "") ? "no" : WITH_TOOLS.test(v || "") ? "with" : "other";

export function ledgerTops(rows) {
  const tops = {};
  for (const r of rows) {
    if (typeof r.value !== "number") continue;
    const k = toolClass(r.variant);
    if (!tops[k] || r.value > tops[k].value) tops[k] = r;
  }
  return tops;
}

export function renderProfileV2(b, ent, ctx) {
  const p = ent.profile;
  const srcIndex = new Map(p.sources.map((s, i) => [s.id, i + 1]));
  const cite = refs => (refs || []).map(r => {
    const [id, loc] = String(r).split(/@(.*)/s);
    const n = srcIndex.get(id);
    const src = p.sources[n - 1];
    const tip = `${KIND_LABEL[src.kind] || src.kind}：${src.title}${loc ? " · " + loc : ""}`;
    return `<sup class="cite"><a href="#src-${esc(id)}" title="${esc(tip)}">[${n}${loc ? " " + esc(loc) : ""}]</a></sup>`;
  }).join(" ");
  const sec = (key, title, body, cls = "") => `<section class="pf-sec${cls}" id="p-${key}"><h2 class="detail-sec">${esc(title)}</h2>${body}</section>`;
  const table = (cols, rows, stack = true) => `<div class="table-wrap"><table class="pf-table${stack ? " pf2-table-stack" : ""}"><thead><tr>${cols.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((v, i) => `<td data-th="${esc(cols[i])}">${v}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  const tops = ledgerTops(ctx.ledgerRows);
  const topLine = (r, label) => r ? `${label} <b>${esc(r.score)}</b> · ${esc(r.modelName)} · ${esc(r.date || "日期未写明")} · ${esc(r.attr)}` : "";
  const topHTML = [topLine(tops.with, "带工具"), topLine(tops.no, "无工具")].filter(Boolean).join("<br>") || "本站账本暂无分数";
  const ds = ent.dataset || {};
  const m0 = (ent.metrics || [])[0];

  // 头部卡
  const card = `<div class="pf2-card" data-profile="${esc(p.template)}">
  <div class="wide"><div class="k">全称</div><div class="v">${esc(ent.full_name || ent.name)}</div></div>
  <div><div class="k">发布方</div><div class="v">${esc(p.header.publisher.v)}${cite(p.header.publisher.cite)}</div></div>
  <div><div class="k">首次发布</div><div class="v">${esc(p.header.first_release.v)}${cite(p.header.first_release.cite)}</div></div>
  <div><div class="k">题量</div><div class="v"><b>${esc(ds.sample_count.toLocaleString("en-US"))}</b> 题（公开集）${cite(ds.cite)}</div></div>
  <div><div class="k">主要指标</div><div class="v">${esc(m0.name)}（${esc(m0.direction)}）${cite(m0.cite)}</div></div>
  <div><div class="k">状态</div><div class="v">${ctx.statusBadge}</div></div>
  <div class="wide"><div class="k">当前最高分（本站证据账本，厂商自报原值，按口径分列）</div><div class="v">${topHTML}<br><span class="pf2-note">口径不同的分数不能直接比较；完整列表见附录 C。</span></div></div>
</div>`;
  const body = PROFILE_V2_LAYOUT.filter(d => !d.appendix);
  const apx = PROFILE_V2_LAYOUT.filter(d => d.appendix && !(d.optional && !p[d.key]));
  const toc = [...body.map(d => `<a href="#p-${d.key}">${esc(d.title)}</a>`), `<a href="#p-appendix">附录</a>`].join("");
  const head = `${card}<nav class="pf-toc" aria-label="本页目录">${toc}</nav>`;

  // 1 一眼看懂
  const glance = sec("glance", "1. 一眼看懂", `<ul class="pf2-glance">
  <li><span class="lbl">是什么</span><span>${esc(ent.summary)}${cite(p.cites.summary)}</span></li>
  <li><span class="lbl">解决什么问题</span><span>${esc(p.problem.text)}${cite(p.problem.cite)}</span></li>
  <li><span class="lbl">高分意味着</span><span>${esc(ent.interpretation)}${cite(p.cites.interpretation)}</span></li></ul>`);

  // 2 评估内容
  const content = sec("content", "2. 评估内容",
    table(["考察方向", "关注重点", "占比", "题型"], ent.measures.map(r => [esc(r.area), `${esc(r.focus)}${cite(r.cite)}`, `<span class="num">${esc(r.share)}</span>`, esc(r.format)])) +
    `<p class="pf2-note">「占比」取自论文的类别分布图；各方向内部的题型比例论文未披露，「题型」列只描述论文示例题；标注「热门学科列表」的学科举例归入哪一类为本站按学科名整理。</p>
  <p><b>合计：</b>${esc(ds.totals)}${cite(ds.cite)}</p>
  <p><b>不测什么：</b>${ent.does_not_measure.map(d => `${esc(d.text)}${cite(d.cite)}`).join("；")}</p>`);

  // 3 如何测量
  const dp = ent.default_protocol;
  const method = sec("method", "3. 如何测量", `<ol class="pf2-steps">
  <li><b>题目怎么来</b><ul>${ds.construction.map(c => `<li><b>${esc(c.k)}：</b>${esc(c.text)}${cite(c.cite)}</li>`).join("")}</ul></li>
  <li><b>怎么判</b><p>${esc(dp.raw)}${cite(dp.cite)}</p></li>
  <li><b>指标</b><ul>${ent.metrics.map(m => `<li><b>${esc(m.name)}</b>（${esc(m.direction)}）：${esc(m.description)}${cite(m.cite)}</li>`).join("")}</ul></li>
  <li><b>口径</b><ul>${dp.variants.map(v => `<li>${esc(v.text)}${cite(v.cite)}</li>`).join("")}</ul></li></ol>`);

  // 4 怎么读
  const ladder = p.ladder.map(l => {
    if (l.auto === "ledger-top") {
      const t = tops.with || tops.no;
      const body = [tops.with && `带工具 ${tops.with.score}（${tops.with.modelName}，${tops.with.date || "日期未写明"}）`, tops.no && `无工具 ${tops.no.score}（${tops.no.modelName}，${tops.no.date || "日期未写明"}）`].filter(Boolean).join("；");
      return `<li><div><b>${esc(l.label)}</b> · <span class="val">${t ? esc(t.score) : "暂无"}</span></div><div class="note">${esc(body || "本站账本暂无分数")}。厂商自报，口径见附录 C。</div></li>`;
    }
    return `<li><div><b>${esc(l.label)}</b> · <span class="val">${esc(l.value)}</span>${cite(l.cite)}</div>${l.note ? `<div class="note">${esc(l.note)}</div>` : ""}</li>`;
  }).join("");
  const reading = sec("reading", "4. 怎么读这个分数", `<p class="pf2-note">分数阶梯（从低到高）：</p><ul class="pf2-ladder">${ladder}</ul>
  <p><b>常见误读：</b></p><ul>${p.misreadings.map(m => `<li>${esc(m.text)}${cite(m.cite)}</li>`).join("")}</ul>`);

  // 5 可信度与局限
  const trust = sec("trust", "5. 可信度与局限",
    `<p class="pf2-note">按对分数的影响从大到小排列；「严重度」为本站评估。</p>` +
    table(["问题", "对分数的影响", "严重度", "官方应对", "读者怎么看"], ent.limitations.map(l => [
      `<b>${esc(l.issue)}</b>`, `${esc(l.impact)}${cite(l.cite)}`, `<span class="pf2-sev s-${esc(l.severity)}">${esc(l.severity)}</span>`, esc(l.response), esc(l.reader)])));

  // 6 来源与背景
  const links = p.sources.filter(s => ["paper", "site", "repo", "dataset"].includes(s.kind))
    .map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(KIND_LABEL[s.kind] || s.kind)} ↗</a>`).join("");
  const background = sec("background", "6. 来源与背景", `<div class="kv">${p.background.map(f => `<div class="k">${esc(f.k)}</div><div>${esc(f.v)}${cite(f.cite)}</div>`).join("")}</div>
  <div class="ext-links">${links}<a href="../">← 返回评估大全</a></div>`);

  // 附录：每部分默认折叠（<details>）；锚点 id 仍在 <details> 上，深链由下方脚本展开
  const part = (key, title, inner, extra = "") => `<details class="pf-sec pf2-part" id="p-${key}"><summary><h2 class="detail-sec">${esc(title)}</h2>${extra}</summary><div class="pf2-part-body">${inner}</div></details>`;
  const vA = part("versions", "A · 版本历史", table(["日期", "变化"], ent.versions.map(v => [`<span class="num">${esc(v.date)}</span>`, `${esc(v.label)}${cite(v.cite)}`]), false));
  const or = p.official_results;
  const vB = or ? part("official_results", "B · 官方结果快照", table(or.table.columns, or.table.rows.map(r => r.map(esc)), false) + `<p class="refs">快照日期 ${esc(or.table.as_of)}${cite(or.cite)}</p>`) : "";
  const lr = ctx.ledgerRows;
  const vC = part("ledger", "C · 本站收录的发布成绩", `<p class="refs">来自本站证据账本（厂商官方发布中的原始数值，按分数从高到低）。厂商自报与官方结果的脚手架、推理档位可能不同，只有口径一致时才可横向比较。</p>` + (lr.length ? table(["发布日期", "模型", "分数", "口径", "来源"], lr.map(r => [
    `<span class="num">${esc(r.date || "—")}</span>`, `<a href="${esc(r.modelHref)}">${esc(r.model)}</a><br><span class="refs">${esc(r.vendor)}</span>`,
    `<span class="num">${esc(r.score)}</span>${r.status === "verified" ? "" : ' <span class="refs">（图表读数）</span>'}`,
    esc([r.variant, r.protocol].filter(Boolean).join(" · ") || "未写明"),
    r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.attr)} ↗</a>` : esc(r.attr)]), false) : `<p class="pf-missing">本站账本里还没有厂商发布引用这个评测。</p>`) + ctx.comparabilityHTML);
  const vD = part("adoption", "D · 发布引用时间轴", ctx.adoptionHTML);
  const vE = part("related", "E · 相关评测", ctx.relatedHTML || `<p class="pf-missing">暂无同类别评测。</p>`);
  const vF = part("refs", "F · 参考来源", `<ol class="pf-refs">${p.sources.map(s => `<li id="src-${esc(s.id)}"><span class="kind">${esc(KIND_LABEL[s.kind] || s.kind)}</span>${esc(s.title)} · <a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.url)}</a> <span class="refs">（访问于 ${esc(s.accessed)}）</span></li>`).join("")}</ol>`, `<span class="pf2-meta">${p.sources.length} 个权威来源 · 核验于 ${esc(p.verified_at)}</span>`);

  return `<div class="pf2-wrap">${head}
${glance}
${content}
${method}
${reading}
${trust}
${background}
<div class="pf2-appendix" id="p-appendix"><h2 class="pf2-apx-title">附录</h2>
<ul class="pf2-apx-list">${apx.map(d => `<li><a href="#p-${d.key}">${esc(d.title.replace(/^附录 /, ""))}</a></li>`).join("")}</ul>
${vA}
${vB}
${vC}
${vD}
${vE}
${vF}
</div></div>
<script>(function(){function o(h){h=(h||location.hash).slice(1);if(!h)return;var t=document.getElementById(decodeURIComponent(h));if(!t)return;for(var d=t.closest("details");d;d=d.parentElement&&d.parentElement.closest("details"))d.open=true;t.scrollIntoView();}addEventListener("hashchange",function(){o()});document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest('a[href^="#"]');if(a)setTimeout(function(){o(a.hash)},0);});if(document.readyState==="loading")addEventListener("DOMContentLoaded",function(){o()});else o();})();</script>`;
}
