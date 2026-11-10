/**
 * benchmark-profile-page.mjs — 按 benchmark-profile/v1 模板渲染评测详情页正文。
 * 页面骨架（shell / 时间轴卡片）由 build-benchmarks-hub.mjs 提供；本模块只负责模板章节、
 * 引用角标、本站收录成绩表、官方链接与参考来源。所有事实都带 [n] 角标指向「参考来源」。
 */
import { PROFILE_SECTIONS, profileCompleteness } from "./benchmark-profile.mjs";

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
