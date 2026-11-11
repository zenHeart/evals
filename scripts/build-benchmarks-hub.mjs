#!/usr/bin/env node
/**
 * build-benchmarks-hub.mjs — 生成"评估大全"：Explorer 索引页 + 每个 benchmark 独立详情页
 *
 * 数据源: data/benchmarks.json
 * 输出:
 *   dist/benchmarks/index.html            # Explorer：高扫描效率卡片网格（搜索/筛选/排序为渐进增强）
 *   dist/benchmarks/<id>/index.html       # 每个 benchmark 的独立可分享详情页（静态 HTML，含 SEO）
 *
 * v3 架构（依据 _docs/evals-goal.md P0 项）:
 *   - Card 退回"索引入口"：整卡一个链接直达详情页；删除 hover 引用浮层与卡片内展开
 *   - 网格响应式目标：手机 1 列 / 平板 2 列 / 普通桌面 3 列 / 宽屏 4 列
 *   - Site Shell 共享自 scripts/site-shell.mjs，不再自维护导航与主题
 *   - 详情页职责"理解"：Identity / 30秒看懂 / 协议 / 采用记录 / 复现 / 相关 / 引用
 *     数据缺失字段显式标注，不用 hover 或折叠藏信息，不虚构数字
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { SITE, SHELL_CSS, shellHead, shellTopbar, shellFooter, SHELL_JS } from "./site-shell.mjs";
import { loadBenchData } from "./load-data.mjs";
import { benchmarkScopeHTML, evidenceScoreLabel } from "./model-ui.mjs";
import { vendorMark, LOGO_EXT } from "./vendor-logos.mjs";
import { renderProfile, renderProfileV2, profileNotice, PROFILE_CSS, PROFILE_V2_CSS } from "./benchmark-profile-page.mjs";
import { PROFILE_TEMPLATE_V2 } from "./benchmark-profile.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const DIST = join(REPO_ROOT, "dist");

function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}
function truncate(s, n) {
  s = String(s || "");
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

/** 引用计数徽章：统计官方发布引用（goal §12.2/§12.7） */
function citeBadge(b) {
  const parts = [];
  if (b._verified > 0) parts.push(`官方发布引用 ${b._verified} 条`);
  if (b._pending > 0) parts.push(`图表读数 ${b._pending} 条`);
  if (!parts.length) {
    return b._archived > 0
      ? `历史记录 ${b._archived} 条`
      : "社区驱动 · 暂无官方发布引用";
  }
  if (b._archived > 0) parts.push(`另有 ${b._archived} 条历史记录`);
  return parts.join(" · ");
}

/** 卡片/详情页共用的引用提示行：前 3 家 + 「+N」（官方表格数值优先） */
function vendorHint(b) {
  const sorted = [...(b.adoption || [])].sort((a, x) => (a.status === "verified" ? -1 : 1) - (x.status === "verified" ? -1 : 1));
  const names = [...new Set(sorted.map(a => a.release).filter(Boolean))];
  const head = names.slice(0, 3).join(" · ");
  return names.length > 3 ? `${head} 等 ${names.length} 场发布` : head;
}

// ---------------------------------------------------------------- 页面 CSS

const PAGE_CSS = `
* { box-sizing:border-box; }
.bm-container { width:min(100% - 32px, 1504px); margin-inline:auto; }
h1 { font-size:clamp(26px,4vw,36px); margin:0 0 6px; }
.sub { color:var(--graphite); font-size:14.5px; margin-bottom:18px; }
.sub b { color:var(--pin); }

/* ---------- 控制区 ---------- */
.controls { display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin:16px 0 8px; }
.chip { border:1.5px solid var(--rule); background:transparent; color:inherit; border-radius:4px; padding:5px 14px; font-size:13.5px; cursor:pointer; font-weight:600; }
.chip:hover { border-color:var(--pin); }
.chip.active { background:var(--ink); border-color:var(--ink); color:var(--paper); }
.search { flex:1; min-width:220px; }
.search input { width:100%; padding:10px 16px; border-radius:6px; border:1.5px solid var(--rule); background:var(--card); color:inherit; font-size:14px; outline:none; }
.search input:focus { border-color:var(--pin); }
select { padding:9px 12px; border-radius:6px; border:1.5px solid var(--rule); background:var(--card); color:inherit; font-size:13.5px; cursor:pointer; }
.stats { font:400 12.5px/1.6 var(--mono); color:var(--graphite); margin:8px 0 16px; }
.empty { text-align:center; color:var(--graphite); padding:48px 0; }
.auto-cloud { display:flex; flex-wrap:wrap; gap:6px; margin-top:10px; }
.auto-cloud a { font:400 12.5px/1.5 var(--mono); border:1px solid var(--rule); border-radius:4px; padding:3px 10px; color:var(--graphite); text-decoration:none; }
.auto-cloud a b { color:var(--ink); }
.auto-cloud a:hover { border-color:var(--pin); color:var(--ink); text-decoration:none; }

/* ---------- Explorer 网格：goal.md §9.4 显式断点 360=1 / 640=2 / 1024=3 / 1440=4 ---------- */
.grid { display:grid; grid-template-columns:1fr; gap:1rem; align-items:stretch; }
@media (min-width:640px)  { .grid { grid-template-columns:repeat(2, minmax(0, 1fr)); } }
@media (min-width:1024px) { .grid { grid-template-columns:repeat(3, minmax(0, 1fr)); } }
@media (min-width:1440px) { .grid { grid-template-columns:repeat(4, minmax(0, 1fr)); } }

/* ---------- 卡片：纯索引入口，整卡一个链接 ---------- */
.card {
  display:flex; flex-direction:column; gap:8px; margin:0;
  border:1px solid var(--rule); border-radius:8px; background:var(--card);
  padding:16px 18px; color:inherit;
  text-decoration:none; transition:border-color .15s, transform .15s;
  overflow-wrap:anywhere;
}
.card:hover { border-color:var(--pin); transform:translateY(-1px); }
.card-head { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; }
.card-title { font-size:17px; font-weight:800; line-height:1.35; }
.cat-tag { flex:none; font-size:11px; font-weight:800; padding:2px 10px; border-radius:4px; margin-top:2px; }
.card-desc { margin:0; font-size:13.5px; color:var(--graphite); line-height:1.6; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.card-protocol { font:400 12px/1.5 var(--mono); color:var(--graphite); }
.card-cite { font:700 12px/1.5 var(--mono); color:var(--pin); }
.card-cite.zero { color:var(--graphite); font-weight:600; }
.card-vendors { font-size:12px; color:var(--graphite); }
.card-go { margin-top:auto; font-size:13px; font-weight:700; color:var(--pin); padding-top:6px; border-top:1px dashed var(--rule); }
.card[hidden] { display:none; }

/* ---------- 详情页 ---------- */
.detail-main { max-width:900px; margin:0 auto; padding:28px 0 70px; }
.breadcrumb { font-size:13px; color:var(--graphite); margin-bottom:14px; }
.breadcrumb b { color:var(--pin); }
.detail-head { display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:4px; }
.detail-head h1 { margin:0; }
.status-badge { font:700 12px/1.6 var(--mono); padding:3px 12px; border-radius:4px; }
.status-active { background:color-mix(in srgb,var(--ok) 12%,transparent); color:var(--ok); }
.status-rolling { background:var(--pin-soft); color:var(--pin); }
.status-saturation { background:color-mix(in srgb,var(--warn) 14%,transparent); color:var(--warn); }
.status-retired { background:color-mix(in srgb,var(--graphite) 14%,transparent); color:var(--graphite); }
h2.detail-sec { font-family:var(--serif); font-size:20px; margin:30px 0 10px; padding-bottom:6px; border-bottom:1px solid var(--rule); scroll-margin-top:70px; position:relative; }
h2.detail-sec::before { content:""; position:absolute; left:0; bottom:-1px; width:44px; height:2px; background:var(--pin); }
.kv { display:grid; grid-template-columns:110px 1fr; gap:6px 14px; font-size:14.5px; margin:10px 0; }
.kv .k { font:700 12px/1.6 var(--mono); color:var(--graphite); letter-spacing:.05em; padding-top:3px; }
@media (max-width:560px) { .kv { grid-template-columns:1fr; } .kv .k { padding-top:0; } }
.callout { border-left:3px solid var(--pin); background:var(--pin-soft); padding:10px 16px; border-radius:0 6px 6px 0; margin:14px 0; font-size:14px; }
.callout.warn { border-left-color:var(--warn); background:color-mix(in srgb,var(--warn) 8%,transparent); }
.gap-list { margin:8px 0; padding-left:20px; font-size:14px; color:var(--graphite); }
.gap-list li { margin:4px 0; }
.adopt-table { width:100%; border-collapse:collapse; font-size:14px; }
.adopt-table th, .adopt-table td { border-bottom:1px dashed rgba(0,0,0,.08); padding:8px 10px 8px 0; vertical-align:top; text-align:left; }
body.dark .adopt-table th, body.dark .adopt-table td { border-bottom-color:rgba(255,255,255,.08); }
.adopt-table th { font-size:12px; letter-spacing:.05em; color:var(--graphite); }
.adopt-table .score { color:var(--ok); font-weight:700; font-family:var(--mono); white-space:nowrap; }
.adopt-table .note { color:var(--graphite); font-size:13px; }
.related { display:grid; grid-template-columns:repeat(auto-fill, minmax(min(100%, 220px), 1fr)); gap:10px; margin:12px 0; }
.related a { display:block; border:1px solid var(--rule); border-radius:6px; padding:10px 14px; color:inherit; font-size:13.5px; text-decoration:none; }
.related a:hover { border-color:var(--pin); }
.related .r-name { font-weight:800; }
.ext-links { display:flex; gap:16px; flex-wrap:wrap; margin:10px 0; }
.ext-links a { font-size:14px; }
.refs { font:400 12.5px/1.7 var(--mono); color:var(--graphite); }
footer.site-foot { text-align:center; color:var(--graphite); font-size:13px; padding:26px 0 40px; }
footer.site-foot a { color:inherit; }
`;

// ---------------------------------------------------------------- Explorer 页

function explorerPage(db, cards, autoIds = []) {
  const chips = [{ id: "all", name: "全部" }, ...db.categories]
    .map(c => {
      const n = c.id === "all" ? cards.filter(x => x.show).length : cards.filter(x => x.show && x.b.category === c.id).length;
      return `<button class="chip${c.id === "all" ? " active" : ""}" type="button" aria-pressed="${c.id === "all"}" data-cat="${esc(c.id)}">${esc(c.name)} <span style="opacity:.6">${n}</span></button>`;
    })
    .join("");

  const cardHtml = cards.map(({ b, show, cat, cite, badge, vendors }) => `
    <a class="card" href="${esc(b.id)}/" data-cat="${esc(b.category)}" data-cite="${cite}" data-name="${esc(b.name)}" data-hay="${esc((b.name + " " + (b.tests || "") + " " + (b.meaning || "") + " " + (b.protocol || "") + " " + vendors).toLowerCase())}"${show ? "" : " hidden"}>
      <div class="card-head">
        <span class="card-title">${esc(b.name)}</span>
        <span class="cat-tag" style="background:color-mix(in srgb, ${esc(cat.color)} 15%, transparent); color:${esc(cat.color)}">${esc(cat.name)}</span>
      </div>
      <p class="card-desc">${esc(truncate(b.tests, 120))}</p>
      ${b.protocol ? `<div class="card-protocol">${esc(truncate(b.protocol, 60))}</div>` : ""}
      <div class="card-cite${(b._verified || 0) + (b._pending || 0) ? "" : " zero"}">${esc(badge)}</div>
      ${vendors ? `<div class="card-vendors">${esc(vendors)}</div>` : ""}
      <div class="card-go">查看详情 →</div>
    </a>`).join("");

  const shownCount = cards.filter(c => c.show).length;
  const title = `评估体系大全 · ${shownCount} 个大模型评测参考`;
  const desc = "LLM 评估参考数据库：每个评测有独立详情页，讲清它测什么、分数什么含义、被哪些模型发布引用、协议如何解读。";

  return `${shellHead({ rel: "../", title, desc, path: "benchmarks/", extra: `<style>${SHELL_CSS}${PAGE_CSS}</style>` })}
</head>
<body>
${shellTopbar("../", "benchmarks")}
<div class="bm-container" id="main-content">
  <h1>评估体系大全</h1>
  <div class="sub">收录主流大模型技术报告与学术界广泛采用的评测基准体系，按测试任务、评测协议、计分标准与官方发布引用记录建立标准化档案。引用计数统计各厂商官方发布报告证据与全量评测档案。<br><a href="../releases/">🕐 模型发布时间轴：查阅主流模型发布证据与评测得分 →</a></div>
  <div class="controls">
    <div class="search"><input id="q" type="search" placeholder="搜索：名称 / 用途 / 引用厂商…" aria-label="搜索评估体系"></div>
    <select id="sort" aria-label="排序方式">
      <option value="cite">按厂商引用量从高到低</option>
      <option value="name">按名称 A-Z</option>
      <option value="cat">按类别</option>
    </select>
  </div>
  <div class="controls" id="chips" style="margin-top:0;">${chips}</div>
  <div class="stats"><span id="statsText"></span> <button id="clearFilters" type="button" class="chip" hidden>✕ 清除全部筛选</button></div>
  <div id="list" class="grid">${cardHtml}</div>
  <div id="emptyState" class="empty" hidden>没有匹配的评测——可能是筛选或搜索词太窄。<button type="button" class="chip" onclick="document.getElementById('clearFilters').click()">清除筛选恢复全部 ${cards.filter(c => c.show).length} 个</button></div>
  ${autoIds.length ? `<div class="part-group" style="margin-top:34px;">厂商发布报告引用的其他基准（${autoIds.length}）</div>
  <p class="part-goal">在官方模型发布技术报告中出现、已提取引用关联但尚未建立独立百科条目的基准列表：</p>
  <details style="margin:8px 0 4px;"><summary style="cursor:pointer;font-weight:700;font-size:13.5px;color:#64748b;">展开 ${autoIds.length} 个评测基准（按被引用次数倒序）</summary>
  <div class="auto-cloud">${autoIds.map(a => `<a href="${esc(a.id)}/" title="被 ${a.n} 次发布引用">${esc(a.id)} <b>${a.n}</b></a>`).join("")}</div>
  </details>` : ""}
</div>
<footer class="site-foot"><a href="${SITE}">evals.zenheart.site</a> · 引用数据来自厂商发布材料真实抓取 · MIT License</footer>
${SHELL_JS}
<script>
(function(){
  var cards=[].slice.call(document.querySelectorAll('#list .card'));
  var params=new URLSearchParams(location.search);
  var state={
    cat:params.get('cat')||'all',
    q:(params.get('q')||'').toLowerCase(),
    sort:params.get('sort')||'cite'
  };
  function citeOf(c){return parseInt(c.getAttribute('data-cite'),10)||0;}
  function nameOf(c){return c.getAttribute('data-name');}
  function catOf(c){return c.getAttribute('data-cat');}
  function syncUrl(){
    var p=new URLSearchParams();
    if(state.cat!=='all')p.set('cat',state.cat);
    if(state.q)p.set('q',state.q);
    if(state.sort!=='cite')p.set('sort',state.sort);
    var qs=p.toString();
    history.replaceState(null,'',qs?('?'+qs):location.pathname);
  }
  function apply(){
    var shown=0;
    cards.forEach(function(c){
      var ok=(state.cat==='all'||catOf(c)===state.cat)&&(!state.q||c.getAttribute('data-hay').indexOf(state.q)>=0);
      c.hidden=!ok; if(ok)shown++;
    });
    var sorted=cards.filter(function(c){return !c.hidden;});
    if(state.sort==='cite')sorted.sort(function(a,b){return citeOf(b)-citeOf(a)||nameOf(a).localeCompare(nameOf(b));});
    else if(state.sort==='name')sorted.sort(function(a,b){return nameOf(a).localeCompare(nameOf(b));});
    else sorted.sort(function(a,b){return catOf(a).localeCompare(catOf(b))||citeOf(b)-citeOf(a);});
    var list=document.getElementById('list');
    sorted.forEach(function(c){list.appendChild(c);});
    document.getElementById('statsText').textContent='共 '+shown+' 个评测${db.updated ? " · 数据更新于 " + esc(db.updated) : ""}';
    var filtered=state.cat!=='all'||state.q||state.sort!=='cite';
    document.getElementById('clearFilters').hidden=!filtered;
    var empty=document.getElementById('emptyState');
    if(empty)empty.hidden=shown>0;
    syncUrl();
  }
  function restoreControls(){
    document.querySelectorAll('#chips .chip').forEach(function(x){
      x.classList.toggle('active',x.getAttribute('data-cat')===state.cat);
    });
    var sort=document.getElementById('sort'); if(sort)sort.value=state.sort;
    var q=document.getElementById('q'); if(q&&state.q)q.value=state.q;
  }
  document.getElementById('chips').addEventListener('click',function(e){
    var b=e.target.closest('.chip'); if(!b)return;
    state.cat=b.getAttribute('data-cat');
    document.querySelectorAll('#chips .chip').forEach(function(x){x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b?'true':'false');});
    apply();
  });
  document.getElementById('sort').addEventListener('change',function(e){state.sort=e.target.value;apply();});
  document.getElementById('q').addEventListener('input',function(e){state.q=e.target.value.trim().toLowerCase();apply();});
  document.getElementById('clearFilters').addEventListener('click',function(){
    state={cat:'all',q:'',sort:'cite'};
    restoreControls();
    apply();
    document.getElementById('q').focus();
  });
  restoreControls();
  apply();
})();
</script>
</body>
</html>`;
}

// ---------------------------------------------------------------- 详情页

const STATUS_LABEL = {
  active: "Active · 主流在用",
  rolling: "Live / Rolling · 持续更新",
  "near-saturation": "Near saturation · 接近饱和",
  historical: "Historical classic · 历史经典",
  superseded: "Superseded · 已被替代",
  deprecated: "Deprecated · 已弃用",
};

function statusBadge(status) {
  if (!status) return "";
  const label = STATUS_LABEL[status] || status;
  const cls = status === "rolling" ? "rolling" : status === "near-saturation" ? "saturation"
    : status === "superseded" || status === "deprecated" ? "retired" : "active";
  return `<span class="status-badge status-${cls}">${esc(label)}</span>`;
}

/** 统一档案模板（benchmark-profile/v1）详情页：章节 + 角标引用 + 本站成绩表 + 时间轴 + 来源 */
function profiledDetailPage(db, b, cat, related, adoptBlock, rels, cite) {
  const ledgerRows = [];
  for (const r of db.releases) {
    for (const e of r.evidence) {
      if (e.benchmark_id !== b.id) continue;
      const m = r.model_specs.find(x => x.id === e.model_id);
      ledgerRows.push({
        date: r.release_date, vendor: r.vendor_label, model: (m?.name || r.models[0] || r.release_title) + (e.variant ? ` · ${e.variant}` : ""),
        modelName: m?.name || r.models[0] || r.release_title, variant: e.variant || null,
        modelHref: `../../models/${r.id}/`, score: evidenceScoreLabel(e), value: e.value, status: e.status, url: e.url,
        protocol: [e.harness, e.effort].filter(Boolean).join(" · "),
        attr: ({ vendor_reported: "厂商自报", third_party_reported: "第三方测得", benchmark_owner_reported: "评测方公布", site_reproduced: "本站复现", comparison_cited: "对比引用" })[e.attribution] || "发布原文",
      });
    }
  }
  ledgerRows.sort((x, y) => (y.value ?? -Infinity) - (x.value ?? -Infinity) || (y.date || "").localeCompare(x.date || ""));
  if (b.profile.template === PROFILE_TEMPLATE_V2) return profiledDetailPageV2(db, b, cat, related, adoptBlock, cite, ledgerRows);
  const p = renderProfile(b, b.profile, { ledgerRows });
  const ov = b.profile.sections.overview;
  const title = `${b.name} · 评测档案：测什么、怎么评、分数怎么读 · 评估大全`;
  const desc = truncate(`${b.name}：${ov && ov.text ? ov.text : b.tests || ""}`, 150);
  const uniq = new Set(cite.map(a => a.release_id).filter(Boolean)).size;
  return `${shellHead({ rel: "../../", title, desc, path: `benchmarks/${b.id}/`, extra: `<style>${SHELL_CSS}${PAGE_CSS}${EVT_CSS}${TIMELINE_CSS}${PROFILE_CSS}</style>` })}
</head>
<body>
${shellTopbar("../../", "benchmarks")}
<main id="main-content" class="detail-main bm-container">
  <nav class="breadcrumb"><a href="../../index.html">首页</a> / <a href="../">评估大全</a> / <b>${esc(b.name)}</b></nav>
  <div class="detail-head">
    <h1>${esc(b.name)}</h1>
    ${statusBadge(b.status)}
    <span class="cat-tag" style="background:color-mix(in srgb, ${esc(cat.color)} 15%, transparent); color:${esc(cat.color)}">${esc(cat.name)}</span>
  </div>
  ${b.fullName && b.fullName !== b.name ? `<p style="font-size:14px;color:var(--graphite);margin:4px 0 0;">${esc(b.fullName)}</p>` : ""}
  ${p.head}
  ${p.sections}
  ${p.ledger}
  <div class="callout warn"><b>可比性提示：</b>同一评测的分数是「实验配置」的产物：评测版本、执行框架（harness / 脚手架）、推理档位、工具、采样参数、运行次数或聚合方式任何一项不同，数字就不能直接横向比较。</div>
  ${benchmarkScopeHTML(b.id, db.useCase)}
  <section class="pf-sec" id="p-adoption"><h2 class="detail-sec">发布引用时间轴</h2>
  <p class="refs">共 ${uniq} 场模型发布引用（${cite.length} 项分值） · 按发布时间倒序${db.updated ? ` · 数据更新于 ${esc(db.updated)}` : ""}</p>
  ${adoptBlock}</section>
  ${p.links}
  ${related.length ? `<h2 class="detail-sec" id="related">相关评测（同类别）</h2>
  <div class="related">${related.map(r => `<a href="../${esc(r.id)}/"><span class="r-name">${esc(r.name)}</span><br><span style="color:var(--graphite)">${esc(truncate(r.tests, 40))}</span></a>`).join("")}</div>` : ""}
  ${p.refs}
  <p class="refs" style="margin-top:14px;">发现事实或来源有误？欢迎在 <a href="https://github.com/zenHeart/evals" target="_blank" rel="noopener">GitHub</a> 提 Issue。</p>
</main>
<footer class="site-foot"><a href="${SITE}">evals.zenheart.site</a> · MIT License · ZenHeart</footer>
${SHELL_JS}
</body>
</html>`;
}

/** benchmark-profile/v2：新手友好版式（头部卡 → 一眼看懂 → 评估内容 → 如何测量 → 怎么读 → 可信度 → 背景 → 附录） */
function profiledDetailPageV2(db, b, cat, related, adoptBlock, cite, ledgerRows) {
  const ent = b.entity;
  const title = `${b.name} · 评测档案：是什么、测什么、怎么读分数 · 评估大全`;
  const desc = truncate(`${b.name}：${ent.summary}`, 150);
  const uniq = new Set(cite.map(a => a.release_id).filter(Boolean)).size;
  const body = renderProfileV2(b, ent, {
    ledgerRows,
    comparabilityHTML: `<div class="callout warn"><b>可比性提示：</b>同一评测的分数是「实验配置」的产物：评测版本、执行框架（harness / 脚手架）、推理档位、工具、采样参数、运行次数或聚合方式任何一项不同，数字就不能直接横向比较。</div>${benchmarkScopeHTML(b.id, db.useCase)}`,
    adoptionHTML: `<p class="refs">共 ${uniq} 场模型发布引用（${cite.length} 项分值） · 按发布时间倒序${db.updated ? ` · 数据更新于 ${esc(db.updated)}` : ""}</p>${adoptBlock}`,
    relatedHTML: related.length ? `<div class="related">${related.map(r => `<a href="../${esc(r.id)}/"><span class="r-name">${esc(r.name)}</span><br><span style="color:var(--graphite)">${esc(truncate(r.tests, 40))}</span></a>`).join("")}</div>` : "",
  });
  return `${shellHead({ rel: "../../", title, desc, path: `benchmarks/${b.id}/`, extra: `<style>${SHELL_CSS}${PAGE_CSS}${EVT_CSS}${TIMELINE_CSS}${PROFILE_CSS}${PROFILE_V2_CSS}</style>` })}
</head>
<body>
${shellTopbar("../../", "benchmarks")}
<main id="main-content" class="detail-main bm-container">
  <nav class="breadcrumb"><a href="../../index.html">首页</a> / <a href="../">评估大全</a> / <b>${esc(b.name)}</b></nav>
  <div class="detail-head">
    <h1>${esc(b.name)}</h1>
    ${statusBadge(b.status)}
    <span class="cat-tag" style="background:color-mix(in srgb, ${esc(cat.color)} 15%, transparent); color:${esc(cat.color)}">${esc(cat.name)}</span>
  </div>
  ${body}
  <p class="refs" style="margin-top:14px;">发现事实或来源有误？欢迎在 <a href="https://github.com/zenHeart/evals" target="_blank" rel="noopener">GitHub</a> 提 Issue。</p>
</main>
<footer class="site-foot"><a href="${SITE}">evals.zenheart.site</a> · MIT License · ZenHeart</footer>
${SHELL_JS}
</body>
</html>`;
}

function detailPage(db, b, cat, related) {
  const cite = b.adoption || [];
  // 统一窗口语义：fresh 进主视图，archive（窗口外/日期缺失）降级为折叠历史区
  const freshV = cite.filter(a => a.status === "verified" && a.fresh);
  const freshP = cite.filter(a => a.status !== "verified" && a.fresh);
  const archived = cite.filter(a => !a.fresh);
  const title = `${b.name} · 评测是什么、分数怎么看 · 评估大全`;
  const desc = truncate(`${b.name}：${b.tests || ""}${b.meaning ? " " + b.meaning : ""}`, 150);

  const identityRows = [
    ["类别", `<span class="cat-tag" style="background:color-mix(in srgb, ${esc(cat.color)} 15%, transparent); color:${esc(cat.color)}">${esc(cat.name)}</span>`],
    b.status ? ["状态", statusBadge(b.status)] : null,
    ["官网 / 数据集", b.url ? `<a href="${esc(b.url)}" target="_blank" rel="noopener">${esc(b.url)}</a>` : "—"],
    b.paper ? ["论文", `<a href="${esc(b.paper)}" target="_blank" rel="noopener">${esc(b.paper)}</a>`] : null,
  ].filter(Boolean).map(([k, v]) => `<div class="k">${k}</div><div>${v}</div>`).join("");

  // 采用记录 = release 事件卡流（与 /releases/ 时间轴同一组件，统一单时间轴，无图表/表格割裂）
  const hasReleaseRefs = (db.releases || []).length > 0 && cite.every(a => a.release_id);
  const uniqReleasesFor = (items) => {
    const seen = new Set();
    const rels = [];
    for (const a of items) {
      if (!seen.has(a.release_id)) {
        seen.add(a.release_id);
        const rel = db.releases.find(x => x.id === a.release_id);
        if (rel) rels.push(rel);
      }
    }
    return rels.sort((a, b) => (b.release_date || "").localeCompare(a.release_date || "") || (a.id || "").localeCompare(b.id || ""));
  };
  let adoptBlock;
  const rels = uniqReleasesFor(cite);
  if (!cite.length) {
    adoptBlock = `<p style="color:var(--graphite);font-size:14px;">暂无官方模型发布引用记录——多由社区或垂直领域使用。${b.adoptionNote ? esc(b.adoptionNote) : ""}</p>`;
  } else if (hasReleaseRefs) {
    let prevYear = null;
    const parts = [];
    for (const rel of rels) {
      const y = rel.release_date ? rel.release_date.slice(0, 4) : null;
      if (y && y !== prevYear) {
        parts.push(`<div class="yrm"><b>${esc(y)}</b></div>`);
        prevYear = y;
      }
      parts.push(tlEvtHtml(db, rel, { benchId: b.id, chipBase: "../" }));
    }
    adoptBlock = `<div class="feed animate">${parts.join("")}</div>`;
  } else {
    const row = a => `<tr>
      <td>${a.url ? `<a href="${esc(a.url)}" target="_blank" rel="noopener">${esc(a.release)} ↗</a>` : esc(a.release)}${a.date ? `<br><span style="color:var(--graphite);font-size:12px;font-family:ui-monospace,monospace;">${esc(a.date)}</span>` : ""}</td>
      <td>${a.score ? `<span class="score">${esc(a.score)}</span>` : '<span style="color:var(--graphite)">未公布</span>'}</td>
      <td>${a.note ? `<span class="note">${esc(a.note)}</span>` : ""}${a.variant && !a.note ? `<span class="note">variant: ${esc(a.variant)}</span>` : ""}</td>
    </tr>`;
    const tbl = rows => `<div class="table-wrap"><table class="adopt-table"><thead><tr><th>模型发布</th><th>报告分数</th><th>备注</th></tr></thead><tbody>${rows.join("")}</tbody></table></div>`;
    adoptBlock = tbl(cite.map(row));
  }

  if (b.profile) return profiledDetailPage(db, b, cat, related, adoptBlock, rels, cite);

  return `${shellHead({ rel: "../../", title, desc, path: `benchmarks/${b.id}/`, extra: `<style>${SHELL_CSS}${PAGE_CSS}${EVT_CSS}${TIMELINE_CSS}</style>` })}
</head>
<body>
${shellTopbar("../../", "benchmarks")}
<main id="main-content" class="detail-main bm-container">
  <nav class="breadcrumb"><a href="../../index.html">首页</a> / <a href="../">评估大全</a> / <b>${esc(b.name)}</b></nav>
  <div class="detail-head">
    <h1>${esc(b.name)}</h1>
    ${statusBadge(b.status)}
  </div>
  ${b.tests ? `<p style="font-size:15.5px;color:#475569;margin:6px 0 0;">${esc(b.tests)}</p>` : ""}
  ${profileNotice("legacy")}

  <h2 class="detail-sec" id="identity">基本信息</h2>
  <div class="kv">${identityRows}</div>

  <h2 class="detail-sec" id="quick">30 秒看懂</h2>
  ${b.meaning ? `<p>${esc(b.meaning)}</p>` : `<p style="color:var(--graphite)">分数含义解读待补。</p>`}
  ${b.adoptionNote ? `<div class="callout"><b>采用格局：</b>${esc(b.adoptionNote)}</div>` : ""}

  ${benchmarkScopeHTML(b.id, db.useCase)}
  <h2 class="detail-sec" id="protocol">评分协议</h2>
  ${b.protocol ? `<p>${esc(b.protocol)}</p>` : `<p style="color:var(--graphite)">这个评测的官方统一评分协议还没收录到本页；各厂商实际使用的执行框架（harness）与推理档位（effort）已逐条写在下方引用卡里。</p>`}
  <div class="callout warn"><b>可比性提示：</b>同一评测的分数是「实验配置」的产物：只要评测版本（variant）、执行框架（harness）、推理档位（reasoning effort）、工具、采样参数、运行次数或聚合方式有任何一项不同，数字就不能直接横向比较。下方各厂商的分数如未写明协议细节，请只当作方向参考。</div>

  <h2 class="detail-sec" id="adoption">模型发布采用时间轴</h2>
  <p class="refs">共收录 ${(() => {
    const uniqRelsAll = new Set(cite.map(a => a.release_id).filter(Boolean));
    return (hasReleaseRefs && cite.length > uniqRelsAll.size)
      ? `${uniqRelsAll.size} 场模型发布（收录 ${cite.length} 项分值）`
      : `${cite.length} 场模型发布`;
  })()} · 按发布时间倒序排列${db.updated ? ` · 数据更新于 ${esc(db.updated)}` : ""}</p>
  ${adoptBlock}

  <h2 class="detail-sec" id="gaps">数据缺口（本页暂未收录）</h2>
  <ul class="gap-list">
    <li>评测版本与子集（例如部分评测有 Diamond、Verified 等官方变体）以及数据集规模</li>
    <li>各厂商使用的执行框架（harness / scaffold）与 Agent 工具配置</li>
    <li>推理档位（reasoning effort）、采样参数（temperature / top-p）、运行次数与分数聚合方式</li>
    <li>指标对应的随机猜测基线（chance baseline）与人类基线的实验条件</li>
    <li>测试集污染检测结论，以及是否已饱和的结构化标注</li>
  </ul>
  <p class="refs">以上字段暂缺时，本页<b>不虚构数字</b>；后续会依据每一次发布的证据逐条补齐并标注来源。</p>

  <h2 class="detail-sec" id="reproduce">复现入口</h2>
  <div class="ext-links">
    ${b.url && b.url !== "-" ? `<a href="${esc(b.url)}" target="_blank" rel="noopener">🏠 官网 / 数据集</a>` : ""}
    ${b.paper && b.paper !== "-" ? `<a href="${esc(b.paper)}" target="_blank" rel="noopener">📄 论文</a>` : ""}
    <a href="../">← 返回评估大全</a>
  </div>

  ${related.length ? `<h2 class="detail-sec" id="related">相关评测（同类别）</h2>
  <div class="related">${related.map(r => `<a href="../${esc(r.id)}/"><span class="r-name">${esc(r.name)}</span><br><span style="color:var(--graphite)">${esc(truncate(r.tests, 40))}</span></a>`).join("")}</div>` : ""}

  <h2 class="detail-sec" id="refs">引用</h2>
  <p class="refs">本页数据更新于 ${esc(db.updated)}，依据厂商发布材料真实抓取；发现数据问题欢迎在 <a href="https://github.com/zenHeart/evals" target="_blank" rel="noopener">GitHub</a> 提 Issue。</p>
</main>
<footer class="site-foot"><a href="${SITE}">evals.zenheart.site</a> · MIT License · ZenHeart</footer>
${SHELL_JS}
</body>
</html>`;
}

// ---------------------------------------------------------------- 发布时间轴页（交互式 v2）

const EVT_CSS = `
/* ---- 刻度尺脊线 + 事件 ---- */
.feed { position:relative; padding-left:58px; }
.feed::before { content:""; position:absolute; left:22px; top:4px; bottom:4px; width:2px;
  background:repeating-linear-gradient(180deg, var(--rule) 0 9px, transparent 9px 13px); transform-origin:top; }
@media (prefers-reduced-motion: no-preference) {
  .feed.animate::before { animation:ruleDraw .8s ease-out both; }
  .feed.animate .evt { animation:evtIn .5s ease-out both; }
  @keyframes ruleDraw { from { transform:scaleY(0); } to { transform:scaleY(1); } }
  @keyframes evtIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
}
/* 年份刻度：跨年时浮出的衬线数字 */
.yrm { position:relative; margin:26px 0 14px; height:26px; }
.yrm::after { content:""; position:absolute; left:0; right:0; top:50%; height:1px; background:var(--rule); }
.yrm b { position:absolute; left:-58px; width:46px; text-align:center; top:50%; transform:translateY(-50%); white-space:nowrap;
  font:700 19px/1 Georgia,"Songti SC","STSong","SimSun",serif; color:var(--pin); background:var(--paper); padding:3px 0; }
/* 事件卡 */
.evt { position:relative; margin:0 0 18px; border:1px solid var(--rule); border-radius:8px; background:var(--card); padding:13px 18px 12px; }
.evt:hover { border-color:var(--graphite); }
.evt .pin-logo {
  position:absolute; left:-51px; top:12px; width:30px; height:30px; border-radius:8px;
  background:var(--card); border:1.5px solid var(--rule);
  display:inline-flex; align-items:center; justify-content:center;
}
.pin-logo .vlogo-img { display:block; margin:auto; vertical-align:middle; }
.evt[data-trust="full"] .pin-logo { border-color: var(--ok); }
.evt[data-trust="part"] .pin-logo { border-color: var(--warn); }
.evt[data-trust="none"] .pin-logo { border-color: var(--rule); }
.vlogo-img { display:inline-block; vertical-align:-3px; border-radius:4px; background:var(--card); }

@media (max-width:640px) {
  .feed { padding-left:46px; }
  .feed::before { left:29px; }
  .yrm b { left:-36px; width:36px; font-size:18px; }
  .evt .pin-logo { left:-31px; width:30px; height:30px; top:12px; }
  .pin-logo svg, .pin-logo .vlogo-img { width:15px; height:15px; }
}
.evt-head { display:flex; align-items:baseline; gap:12px; flex-wrap:wrap; }
.evt-date { font:700 13px/1 ui-monospace,monospace; color:var(--pin); }
.evt-vendor { font:700 10.5px/1 ui-monospace,monospace; letter-spacing:.14em; color:var(--graphite); text-transform:uppercase; }
.evt-vendor i { font-style:normal; color:var(--rule); margin:0 5px; }
.evt-title { font-size:16.5px; font-weight:800; margin:6px 0 2px; line-height:1.4; }
.evt-title a { color:inherit; text-decoration:none; }
.evt-title a:hover { color:var(--pin); }
.evt-specs { display:flex; flex-wrap:wrap; gap:3px 16px; font:400 12px/1.8 ui-monospace,monospace; color:var(--ink); margin:3px 0 6px; }
.evt-specs .sp-k { color:var(--graphite); font-size:11px; letter-spacing:.05em; margin-right:5px; }
.evt-specs b { font-weight:700; }
.evt-specs .sp-note { color:var(--graphite); font-weight:400; }
.evt-overview { font-size:13.5px; line-height:1.75; color:var(--ink); margin:0 0 7px; }
.evt-traits { display:flex; flex-wrap:wrap; gap:6px; margin:0 0 9px; }
.tchip { font:600 11.5px/1.6 ui-monospace,monospace; border:1px solid var(--rule); border-radius:4px; padding:1px 9px; color:var(--graphite); background:var(--pin-soft); }
.evt-blog a { color:var(--graphite); text-decoration:underline; text-underline-offset:3px; }
.evt-blog a:hover { color:var(--pin); }
.evt-chips { display:flex; flex-wrap:wrap; gap:6px; margin:0 0 8px; }
.bchip { font:400 12px/1.4 ui-monospace,monospace; padding:2px 10px; border-radius:4px; text-decoration:none; }
.bchip b { font-weight:700; }
.bchip.ok { border:1px solid color-mix(in srgb, var(--ok) 55%, transparent); color:var(--ink); background:color-mix(in srgb, var(--ok) 7%, transparent); }
.bchip.ok b { color:var(--ok); }
.bchip.pd { border:1px dashed color-mix(in srgb, var(--warn) 70%, transparent); color:var(--graphite); background:transparent; }
.bchip.pd b { color:var(--warn); }
a.bchip:hover { text-decoration:none; border-color:var(--pin); }
.bchip.focus { outline:1.5px solid var(--pin); outline-offset:1px; }
.bchip.plain { border:1px dashed var(--rule); color:var(--graphite); }
.chip-grp { flex:0 0 100%; font-size:12px; font-weight:600; line-height:1.4; color:var(--graphite); margin:6px 0 -1px; }
.chip-grp:first-child { margin-top:0; }
.evt-src { font-size:12.5px; }
.evt-src a { color:var(--graphite); text-decoration:underline; text-underline-offset:3px; }
.evt-src a:hover { color:var(--pin); }
.evt-src .kind { color:var(--graphite); font:400 11px/1 ui-monospace,monospace; margin-left:6px; }
/* 分组标头 */
.grp { margin:34px 0 14px; display:flex; align-items:baseline; gap:12px; }
.grp .g-name { font-family:Georgia,"Songti SC","STSong","SimSun",serif; font-size:23px; font-weight:700; color:var(--ink); }
.grp .g-name a { color:inherit; text-decoration:none; }
.grp .g-name a:hover { color:var(--pin); }
.grp .g-meta { font:400 12px/1.4 ui-monospace,monospace; color:var(--graphite); }
.grp .g-line { flex:1; height:1px; background:var(--rule); align-self:center; }
`;

const TIMELINE_CSS = `
/* ============ 模型发布时间轴 · 独立设计（仪器纸 / 刻度尺脊线 / 可信度引脚） ============ */
.tlr {
  --paper:#F7F8F6; --ink:#17212E; --graphite:#5C6B7C; --rule:#D9DEE3;
  --pin:#D14A24; --ok:#0E7A4E; --warn:#A16207; --card:#FFFFFF;
  max-width:1120px; margin:0 auto; padding:28px clamp(16px, 4vw, 32px) 70px;
}
body.dark .tlr {
  --paper:#0E1622; --ink:#E4E9EF; --graphite:#93A1B3; --rule:#263241;
  --pin:#FF7A50; --ok:#3DC98A; --warn:#D9A441; --card:#131E30;
}
.tlr .eyebrow { font:700 11.5px/1 ui-monospace,SFMono-Regular,Consolas,monospace; letter-spacing:.18em; color:var(--pin); text-transform:uppercase; margin:0 0 10px; }
.tlr h1 { font-family:Georgia,"Songti SC","STSong","SimSun",serif; font-size:clamp(30px,5vw,44px); font-weight:700; line-height:1.15; margin:0 0 10px; letter-spacing:.01em; }
.tlr .sub { font-size:14.5px; color:var(--graphite); max-width:72ch; margin:0 0 8px; }
.tlr .sub a { color:var(--ink); text-decoration:underline; text-underline-offset:3px; }
/* 控制台与厂商过滤 */
.console { border:1px solid var(--rule); background:var(--card); border-radius:8px; padding:14px 16px; margin:16px 0 8px; display:flex; flex-direction:column; gap:12px; }
.console .row { display:flex; flex-wrap:wrap; gap:8px 12px; align-items:center; }
.console .lab { font:700 10.5px/1 ui-monospace,monospace; letter-spacing:.16em; color:var(--graphite); text-transform:uppercase; min-width:56px; }
.seg { display:inline-flex; border:1px solid var(--rule); border-radius:6px; overflow:hidden; }
.seg button { border:none; background:transparent; color:var(--graphite); padding:7px 16px; font:600 13px/1.2 inherit; cursor:pointer; }
.seg button + button { border-left:1px solid var(--rule); }
.seg button.on { background:var(--ink); color:var(--paper); }
.console select, .console input[type=search], .console input[type=number] {
  padding:7px 10px; border-radius:6px; border:1px solid var(--rule); background:var(--card); color:inherit; font:400 13px/1.4 inherit;
}
.console input[type=search] { flex:1; min-width:170px; }
.console select { max-width:100%; min-width:0; }
.console input[type=number] { width:88px; font-family:ui-monospace,monospace; }
.ghost-btn { border:1px solid var(--pin); background:transparent; color:var(--pin); border-radius:6px; padding:7px 14px; font:700 12.5px/1.2 inherit; cursor:pointer; }
.ghost-btn:hover { background:color-mix(in srgb, var(--pin) 8%, transparent); }
.vchip { display:inline-flex; align-items:center; gap:6px; border:1px solid var(--rule); background:var(--paper); color:var(--ink); border-radius:6px; padding:5px 10px; font:600 12px/1.3 inherit; cursor:pointer; transition:all .15s ease; user-select:none; }
.vchip:hover { border-color:var(--pin); background:color-mix(in srgb, var(--pin) 4%, var(--paper)); }
.vchip.on { background:var(--ink); border-color:var(--ink); color:var(--paper); }
.vchip .vmark { display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; width:15px; height:15px; }
.vchip .vmark img { width:15px; height:15px; object-fit:contain; vertical-align:middle; border-radius:2px; }
.vchip-n { font:700 11px/1.2 ui-monospace,monospace; padding:1px 6px; border-radius:10px; background:var(--rule); color:var(--graphite); }
.vchip.on .vchip-n { background:rgba(255,255,255,.22); color:var(--paper); }
.fchip { display:inline-flex; align-items:center; gap:8px; border:1px solid var(--pin); color:var(--pin); border-radius:4px; padding:5px 10px; font:700 12.5px/1.2 ui-monospace,monospace; }
.fchip button { border:none; background:transparent; color:inherit; cursor:pointer; font-size:13px; padding:0; line-height:1; }
.tl-count { font:400 12.5px/1.6 ui-monospace,monospace; color:var(--graphite); margin:10px 2px 22px; }
.tl-empty { color:var(--graphite); font-size:14px; padding:26px 0; }
@media (max-width:640px) {
  .feed { padding-left:46px; }
  .feed::before { left:29px; }
  .yrm b { left:-36px; width:36px; font-size:18px; }
  .evt .pin-logo { left:-31px; width:30px; height:30px; top:12px; }
  .pin-logo svg { width:15px; height:15px; }
}
`;

/** 规格行（参数 / 上下文 / 价格 / 模态）：取第一个带规格的模型；无规格不渲染 */
function evtSpecsHtml(r) {
  const m0 = (r.model_specs || []).find(m => m && (m.params || m.context_window || m.pricing || (m.modalities && m.modalities.length)));
  if (!m0) return "";
  const bits = [];
  if (m0.params) bits.push(`<span><span class="sp-k">参数</span><b>${esc(m0.params)}</b></span>`);
  if (m0.context_window) bits.push(`<span><span class="sp-k">上下文</span><b>${esc(m0.context_window)}</b></span>`);
  const p = m0.pricing;
  if (p && (p.input_per_m != null || p.output_per_m != null)) {
    const cur = p.currency === "CNY" ? "¥" : "$";
    const pair = `${p.input_per_m != null ? cur + p.input_per_m : "—"}/${p.output_per_m != null ? cur + p.output_per_m : "—"}`;
    bits.push(`<span><span class="sp-k">价格</span><b>${pair}</b><span class="sp-note"> 每百万 tokens${p.note ? " · " + esc(p.note) : ""}</span></span>`);
  }
  if (m0.modalities && m0.modalities.length) bits.push(`<span><span class="sp-k">模态</span><b>${esc(m0.modalities.join("·"))}</b></span>`);
  return bits.length ? `<div class="evt-specs">${bits.join("")}</div>` : "";
}

/** 能力概述 + 核心特点：优先入库撰写的 capability_summary，否则用派生评测画像兜底（零虚构） */
function evtOverviewHtml(r, benchMode = false) {
  const m0 = (r.model_specs || []).find(m => m && m.capability_summary);
  const traits = (m0?.key_traits || []).map(t => `<span class="tchip">${esc(t)}</span>`).join("");
  let overview;
  if (m0?.capability_summary) {
    overview = `<p class="evt-overview">${esc(m0.capability_summary)}</p>`;
  } else if (benchMode) {
    overview = r.release_title && r.release_title !== (r.models.length ? r.models.join(" / ") : "")
      ? `<p class="evt-overview">${esc(r.release_title)}</p>`
      : "";
  } else if (r.release_title) {
    overview = `<p class="evt-overview">${esc(r.release_title)}</p>`;
  } else {
    overview = "";
  }
  return (overview || "") + (traits ? `<div class="evt-traits">${traits}</div>` : "");
}

/** 时间轴芯片上的评测短名：与评测模式同一规则（取冒号前的短名，回退 id）；版本号已含在名称里时不重复 */
function chipBenchLabel(db, e) {
  const benchName = db.benchmarks.find(x => x.id === e.benchmark_id)?.name;
  const shortName = benchName ? (benchName.split(":")[0]?.trim() || benchName) : e.benchmark_id;
  const v = (e.variant || "").trim();
  return v && !shortName.toLowerCase().includes(v.toLowerCase()) ? shortName + " " + v : shortName;
}

/** 多变体分组后，分数文字末尾重复的变体名（如「75.3% (Mythos 5.2)」）已由小标题表达，去掉 */
function chipScoreLabel(e, owner) {
  const label = evidenceScoreLabel(e);
  if (!owner) return label;
  const names = [owner, owner.split(/\s+/).slice(1).join(" ")].filter(n => n && n.length >= 3);
  let out = label;
  for (const n of names) {
    const re = new RegExp("\\s*[（(]?\\s*" + n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*[)）]?\\s*$", "i");
    out = out.replace(re, "");
  }
  return out.trim() || label;
}

/** 多变体发布的证据按变体分组（组序 = 首次出现顺序，组内保持原顺序）；单变体原样返回 */
function groupedEvidence(r) {
  if (r.models.length <= 1) return r.evidence;
  const order = [];
  for (const e of r.evidence) if (!order.includes(e.model_id)) order.push(e.model_id);
  return order.flatMap(id => r.evidence.filter(e => e.model_id === id));
}

/** 时间轴 / 年份归档卡的评测芯片（非评测模式）。多变体发布按变体分组：变体名只出现一次作小标题，芯片只写「评测名 + 版本 + 分数」 */
function tlChipsHtml(db, r, chipBase, focusSet) {
  const multi = r.models.length > 1;
  const owner = e => r.model_specs.find(m => m.id === e.model_id)?.name || e.model_id || "模型未说明";
  const chip = e => {
    // 账本中出现的每个评测都有详情页（正式实体或证据自动建档）——chip 一律可点
    const cls = e.status === "verified" ? "ok" : "pd";
    const focus = focusSet && focusSet[e.benchmark_id] ? " focus" : "";
    const tip = [e.harness ? `执行框架（harness）：${e.harness}` : null, e.effort ? `推理档位（effort）：${e.effort}` : null]
      .filter(Boolean).join(" · ");
    return `<a class="bchip ${cls}${focus}" href="${chipBase}${esc(e.benchmark_id)}/"${tip ? ` title="${esc(tip)}"` : ""}>${esc(chipBenchLabel(db, e))} <b>${esc(multi ? chipScoreLabel(e, owner(e)) : evidenceScoreLabel(e))}</b></a>`;
  };
  if (!multi) return r.evidence.map(chip).join("");
  // 与客户端 card() 同构：按 groupedEvidence 顺序，变体名变化时插入一次小标题
  let prev = null;
  return groupedEvidence(r).map(e => {
    const k = owner(e);
    const head = k !== prev ? `<span class="chip-grp">${esc(k)}</span>` : "";
    prev = k;
    return head + chip(e);
  }).join("");
}

/** 时间轴事件卡（服务端静态与客户端渲染共用同一 HTML 结构） */
function tlEvtHtml(db, r, opts = {}) {
  const focusSet = opts.focusSet || null;
  const chipBase = opts.chipBase !== undefined ? opts.chipBase : "../benchmarks/";
  // bench 语境（评测详情页引用卡）：只讲「哪个模型、本次报告多少分与模型介绍」，不展示其他评测框架
  const benchMode = Boolean(opts.benchId);
  const benchRows = benchMode ? r.evidence.filter(e => e.benchmark_id === opts.benchId) : [];
  const trust = benchMode
    ? (benchRows.some(e => e.status === "verified") ? "full" : benchRows.some(e => e.status !== "verified") ? "part" : "none")
    : (r.verified === 0 ? "none" : r.pending === 0 ? "full" : "part");
  const region = r.region === "CN" ? "国内" : "国际";
  const chips = (benchMode && benchRows.length > 0) ? (() => {
    return benchRows.map(benchRow => {
      const cls = benchRow.status === "verified" ? "ok" : "pd";
      const tip = [benchRow.harness ? `执行框架（harness）：${benchRow.harness}` : null, benchRow.effort ? `推理档位（effort）：${benchRow.effort}` : null]
        .filter(Boolean).join(" · ");
      const benchName = db.benchmarks.find(x => x.id === benchRow.benchmark_id)?.name;
      const shortName = benchName ? (benchName.split(":")[0]?.trim() || benchName) : benchRow.benchmark_id;
      const label = (r.models.length > 1 ? esc(r.model_specs.find(m => m.id === benchRow.model_id)?.name || benchRow.model_id || "模型未说明") + " · " : "") + (benchRow.variant ? esc(benchRow.variant) : esc(shortName));
      return `<span class="bchip ${cls} focus"${tip ? ` title="${esc(tip)}"` : ""}>${label} <b>${esc(evidenceScoreLabel(benchRow))}</b></span>`;
    }).join("");
  })() : tlChipsHtml(db, r, chipBase, focusSet);
  const modelTitle = r.models.length ? r.models.join(" / ") : r.release_title;
  const titleInner = r.source_url
    ? `<a href="${esc(r.source_url)}" target="_blank" rel="noopener" title="阅读官方发布文：${esc(r.release_title)}">${esc(modelTitle)}</a>`
    : esc(modelTitle);
  return `<article class="evt" data-trust="${trust}">
    ${pinLogo(r.vendor_id, trust)}
    <div class="evt-head">
      <span class="evt-date">${r.release_date ? esc(r.release_date) : "日期不明"}</span>
      <span class="evt-vendor">${vendorMark(r.vendor_id, 14)} ${esc(r.vendor_label)}<i>·</i>${region}</span>
    </div>
    <h3 class="evt-title">${titleInner}</h3>
    ${r.model_specs.length === 1 ? evtSpecsHtml(r) : `<p class="evt-overview">本发布含 ${r.model_specs.length} 个变体，各变体规格见模型详情。</p>`}
    ${evtOverviewHtml(r, benchMode)}
    <p><a href="${(benchMode ? '../../models/' : chipBase.replace(/benchmarks\/$/, 'models/'))}${esc(r.id)}/">查看模型变体与证据</a>${!r.evidence.length?' · 所收录来源未披露量化评测':''}</p>
    ${chips ? `<div class="evt-chips">${chips}</div>` : ""}
    ${r.source_url && !r.models.length ? `<div class="evt-src"><a href="${esc(r.source_url)}" target="_blank" rel="noopener">官方发布原文 ↗</a><span class="kind">${esc(r.source_kind || "")}</span></div>` : ""}
  </article>`;
}

/** 分组标头（厂商模式 / 评测模式共用） */
function tlGroupHeader(name, meta, href) {
  const nameHtml = href ? `<a href="${esc(href)}">${esc(name)} ↗</a>` : esc(name);
  return `<div class="grp"><span class="g-name">${nameHtml}</span><span class="g-line"></span><span class="g-meta">${esc(meta)}</span></div>`;
}

/** /releases/ 首屏服务端直出的卡片数（其余由虚拟列表按需渲染） */
const TL_SSR_COUNT = 16;

/** 发布时间轴瘦身数据：只保留卡片渲染与过滤所需字段（不再内联整本账本） */
function releasesSlimData(db) {
  const releases = [...db.releases].sort((a, b) => (b.release_date || "").localeCompare(a.release_date || "") || (a.id || "").localeCompare(b.id || ""));
  return {
    v: 2,
    cutoff: db.cutoff,
    logoExt: LOGO_EXT,
    benchmarks: db.benchmarks.map(b => [b.id, b.name]).sort((a, b) => a[0].localeCompare(b[0])),
    releases: releases.map(r => {
      const multi = r.models.length > 1;
      return {
        i: r.id, v: r.vendor_id, l: r.vendor_label, g: r.region === "CN" ? 1 : 0,
        t: r.release_title, d: r.release_date || null, m: r.models,
        tv: r.verified === 0 ? "none" : r.pending === 0 ? "full" : "part",
        sp: r.model_specs.length === 1 ? evtSpecsHtml(r) : `<p class="evt-overview">本发布含 ${r.model_specs.length} 个变体，各变体规格见模型详情。</p>`,
        ov: evtOverviewHtml(r, false),
        u: r.source_url || null, k: r.source_kind || null,
        // 多变体：与服务端 tlChipsHtml 同序（按变体首次出现的顺序分组），客户端才能每组只出一个小标题
        e: groupedEvidence(r).map(e => {
          const owner = multi ? (r.model_specs.find(m => m.id === e.model_id)?.name || e.model_id || "模型未说明") : "";
          const fv = e.status === "verified" && e.score_status === "reported" && e.value !== null ? e.value : null;
          return [e.benchmark_id, multi ? chipScoreLabel(e, owner) : evidenceScoreLabel(e), e.status === "verified" ? 1 : 0, owner, e.variant || "", e.harness || "", e.effort || "", fv, chipBenchLabel(db, e)];
        }),
      };
    }),
  };
}

/** 年份归档页：/releases/<year>/ 全量静态卡片（无 JS 可读、可被抓取；content-visibility 降低渲染成本） */
function releasesYearPage(db, year, list, years) {
  const rel = "../../";
  const cards = list.map(r => tlEvtHtml(db, r, { chipBase: rel + "benchmarks/" })).join("");
  const ev = list.reduce((s, r) => s + r.evidence.length, 0);
  return `${shellHead({ rel, title: `${year} 年模型发布 · 模型发布时间轴 · 评估大全`, desc: `${year} 年主流模型官方发布 ${list.length} 次、评测引用 ${ev} 条的静态归档。`, path: `releases/${year}/`, extra: `<style>${SHELL_CSS}${PAGE_CSS}${EVT_CSS}${TIMELINE_CSS}.feed .evt{content-visibility:auto;contain-intrinsic-size:auto 240px;}</style>` })}
</head>
<body class="tlr-page">
${shellTopbar(rel, "releases")}
<div class="tlr" id="main-content">
  <nav class="breadcrumb" style="margin-bottom:18px;"><a href="${rel}index.html">首页</a> / <a href="../">模型发布</a> / <b>${esc(year)}</b></nav>
  <h1>${esc(year)} 年模型发布</h1>
  <p class="sub">共 ${list.length} 次发布 · ${ev} 条评测引用 · 按发布时间倒序。交互式检索请回到 <a href="../">模型发布时间轴</a>。</p>
  <p class="tl-years">按年份：${years.map(y => y === year ? `<b>${esc(y)}</b>` : `<a href="../${esc(y)}/">${esc(y)}</a>`).join(" · ")}</p>
  <div class="feed"><div class="yrm"><b>${esc(year)}</b></div>${cards}</div>
</div>
<footer class="site-foot"><a href="${SITE}">evals.zenheart.site</a> · MIT License · ZenHeart</footer>
${SHELL_JS}
</body>
</html>`;
}

function releasesTimelinePage(db, rel = "../../", dataFile = "data.json", years = []) {
  // 厂商发布数统计与排序（按发布数倒序，直接融合于控制台厂商过滤按钮）
  const covCounts = new Map();
  for (const r of db.releases) covCounts.set(r.vendor_id, (covCounts.get(r.vendor_id) || 0) + 1);
  const vendorChips = [...covCounts.entries()].sort((a, b) => b[1] - a[1])
    .map(([vid, n]) => {
      const v = db.vendors.find(x => x.id === vid);
      const label = v?.display_name || v?.name || vid;
      const mark = vendorMark(vid, 14, rel + "assets/logos/");
      return `<button type="button" class="vchip" data-v="${esc(vid)}" aria-pressed="false">${mark ? `<span class="vmark">${mark}</span>` : ""}<span>${esc(label)}</span><span class="vchip-n">${n}</span></button>`;
    }).join("");

  // 首屏直出：最新 TL_SSR_COUNT 张卡片（LCP 不等 JS），其余交给虚拟列表；无 JS 时走年份归档页
  const allReleases = [...db.releases].sort((a, b) => (b.release_date || "").localeCompare(a.release_date || "") || (a.id || "").localeCompare(b.id || ""));
  let prevYear = null;
  const staticParts = [];
  for (const r of allReleases.slice(0, TL_SSR_COUNT)) {
    const y = r.release_date ? r.release_date.slice(0, 4) : null;
    if (y && y !== prevYear) { staticParts.push(`<div class="yrm"><b>${esc(y)}</b></div>`); prevYear = y; }
    staticParts.push(tlEvtHtml(db, r, { chipBase: rel + "benchmarks/" }));
  }
  const totalEv = db.releases.reduce((s, r) => s + r.evidence.length, 0);
  const yearLinks = years.map(y => `<a href="${esc(y)}/">${esc(y)}</a>`).join(" · ");

  const desc = `收录 2022 年至今国内外主流厂商核心模型的官方发布档案与实测评测数据，逐条对账技术报告中的基准引用、实测得分与评测协议；提供官方出处与架构规格说明；覆盖范围和历史缺口可在模型目录中查看。`;
  return `${shellHead({ rel, title: "模型发布时间轴 · 评估大全", desc, path: "releases/", extra: `<link rel="preload" href="${esc(dataFile)}" as="fetch" type="application/json" crossorigin>
<style>${SHELL_CSS}${PAGE_CSS}${EVT_CSS}${TIMELINE_CSS}
.tl-blk { display:flow-root; }
.tl-years { font-size:13.5px; color:var(--graphite); }
.tl-more { margin:18px 0 0; font-size:14px; }
.chip-more { font-size:12px; padding:3px 10px; }
</style>` })}
</head>
<body class="tlr-page">
${shellTopbar(rel, "releases")}
<div class="tlr" id="main-content">
  <nav class="breadcrumb" style="margin-bottom:18px;"><a href="${rel}index.html">首页</a> / <b>模型发布</b></nav>
  <p class="eyebrow">Evaluation Ledger · 2022 — 2026</p>
  <h1>模型发布时间轴</h1><p><a href="${rel}models/">按模态浏览模型与变体</a> · <a href="${rel}coverage/">覆盖与缺口</a> · <a href="${rel}choose/">按需求选型</a></p>
  <p class="sub">${esc(desc)}<br>证据数据来源标识：<b>绿色</b> 官方表格原始数据、<b>琥珀色</b> 图表数据采点、<b>灰色</b> 未披露量化分值的评测提及。支持按厂商、基准名称与分值阈值快速检索。<a href="${rel}benchmarks/" style="margin-left:8px;">← 返回评估大全</a></p>
  <p class="tl-years">按年份浏览静态归档：${yearLinks}</p>

  <div class="console" id="tlControls" hidden>
    <div class="row">
      <span class="lab">搜索</span>
      <input type="search" id="tlQ" placeholder="搜索模型 / 发布标题 / 厂商…" aria-label="搜索时间轴" style="max-width:460px;">
    </div>
    <div class="row" id="tlVendorRow"><span class="lab">厂商</span>${vendorChips}</div>
    <div class="row">
      <span class="lab">分数过滤</span>
      <select id="tlBench" aria-label="选择评测"><option value="">选择评测…</option></select>
      <span class="lab" style="min-width:auto">≥</span>
      <input type="number" id="tlMin" step="any" placeholder="如 70" aria-label="最低分数">
      <button class="ghost-btn" id="tlAddScore" type="button">添加过滤</button>
      <span id="tlFilters" style="display:inline-flex;gap:6px;flex-wrap:wrap;"></span>
    </div>
  </div>
  <div class="tl-count" id="tlCount">共 ${db.releases.length} 次发布 · ${totalEv} 条评测引用</div>

  <div id="tlStatic"><div class="feed">${staticParts.join("") || '<div class="tl-empty">暂无数据。</div>'}</div>
  <p class="tl-more">首屏展示最新 ${Math.min(TL_SSR_COUNT, allReleases.length)} 次发布；更早的发布请启用 JavaScript，或按年份浏览：${yearLinks}</p></div>
  <div id="tlApp" class="feed" hidden></div>
</div>
<footer class="site-foot"><a href="${SITE}">evals.zenheart.site</a> · MIT License · ZenHeart</footer>
${SHELL_JS}
<script>
(function(){
  var REL=${JSON.stringify(rel)},DATA=${JSON.stringify(dataFile)};
  var app=document.getElementById('tlApp'),staticEl=document.getElementById('tlStatic');
  if(!app||!window.fetch||!window.IntersectionObserver)return;
  var D=null,state={vendors:[],bench:null,filters:[],q:''};
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function logo(vid,size,cls){var ext=D.logoExt&&D.logoExt[vid];return ext?'<img class="vlogo-img" src="'+REL+'assets/logos/'+vid+'.'+ext+'" width="'+size+'" height="'+size+'" alt="" loading="lazy" decoding="async">':'';}
  function focusSet(){var s={};if(state.bench)s[state.bench]=1;state.filters.forEach(function(f){s[f.bench]=1;});return s;}
  // 与服务端 tlEvtHtml（非评测模式）同构
  var CHIP_MAX=24,expanded={};
  function card(r,fs){
    var lim=expanded[r.i]?r.e.length:CHIP_MAX,ev=r.e,keep=ev;
    // 有评测过滤时，命中的分数 chip 一定保留，避免被折叠；展示仍按原顺序（多变体时按变体分组）
    if(ev.length>lim){var hit=ev.filter(function(e){return fs[e[0]];}),room=Math.max(0,lim-hit.length),rest=ev.filter(function(e){return !fs[e[0]];}).slice(0,room);
      keep=ev.filter(function(e){return hit.indexOf(e)>=0||rest.indexOf(e)>=0;});}
    var prevOwner=null;
    var chips=keep.map(function(e){
      var tip=[];if(e[5])tip.push('执行框架（harness）：'+esc(e[5]));if(e[6])tip.push('推理档位（effort）：'+esc(e[6]));
      // 多变体发布：变体名只作一次分组小标题，芯片不再重复模型名前缀
      var head='';if(e[3]&&e[3]!==prevOwner){head='<span class="chip-grp">'+esc(e[3])+'</span>';prevOwner=e[3];}
      return head+'<a class="bchip '+(e[2]?'ok':'pd')+(fs[e[0]]?' focus':'')+'" href="'+REL+'benchmarks/'+esc(e[0])+'/"'+(tip.length?' title="'+tip.join(' · ')+'"':'')+'>'+esc(e[8]||e[0])+' <b>'+esc(e[1])+'</b></a>';
    }).join('')+(r.e.length>keep.length?'<button type="button" class="ghost-btn chip-more" data-r="'+esc(r.i)+'">展开其余 '+(r.e.length-keep.length)+' 项评测</button>':'');
    var mt=r.m.length?r.m.join(' / '):r.t;
    var title=r.u?'<a href="'+esc(r.u)+'" target="_blank" rel="noopener" title="阅读官方发布文：'+esc(r.t)+'">'+esc(mt)+'</a>':esc(mt);
    var pin=D.logoExt[r.v]?logo(r.v,17):'<b style="color:var(--graphite)">·</b>';
    return '<article class="evt" data-trust="'+r.tv+'"><span class="pin-logo pin-'+r.tv+'" aria-hidden="true">'+pin+'</span>'+
      '<div class="evt-head"><span class="evt-date">'+(r.d?esc(r.d):'日期不明')+'</span><span class="evt-vendor">'+logo(r.v,14)+' '+esc(r.l)+'<i>·</i>'+(r.g?'国内':'国际')+'</span></div>'+
      '<h3 class="evt-title">'+title+'</h3>'+r.sp+r.ov+
      '<p><a href="'+REL+'models/'+esc(r.i)+'/">查看模型变体与证据</a>'+(r.e.length?'':' · 所收录来源未披露量化评测')+'</p>'+
      (chips?'<div class="evt-chips">'+chips+'</div>':'')+
      (r.u&&!r.m.length?'<div class="evt-src"><a href="'+esc(r.u)+'" target="_blank" rel="noopener">官方发布原文 ↗</a><span class="kind">'+esc(r.k||'')+'</span></div>':'')+
      '</article>';
  }
  function pass(r){
    if(state.vendors.length&&state.vendors.indexOf(r.v)<0)return false;
    if(state.bench&&!r.e.some(function(e){return e[0]===state.bench;}))return false;
    for(var i=0;i<state.filters.length;i++){var f=state.filters[i];
      if(!r.e.some(function(e){return e[0]===f.bench&&e[7]!==null&&e[7]>=f.min;}))return false;}
    if(state.q){var hay=(r.t+' '+r.m.join(' ')+' '+r.l).toLowerCase();if(hay.indexOf(state.q)<0)return false;}
    return true;
  }
  // ---- 分块虚拟列表：每块 BLK 项，视口 ±1.5 屏内的块才真实渲染，其余用测得高度的占位块
  var BLK=12,blocks=[],io=null,avg=230,fs0={};
  function blockHtml(b){return b.items.map(function(it){return it.y?'<div class="yrm"><b>'+esc(it.y)+'</b></div>':card(it.r,fs0);}).join('');}
  function estimate(b){return b.h!=null?b.h:Math.round(b.items.reduce(function(s,it){return s+(it.y?66:avg);},0));}
  function show(el,b){if(b.on)return;el.innerHTML=blockHtml(b);el.style.height='';b.on=true;b.h=el.offsetHeight;
    var hs=0,n=0;blocks.forEach(function(x){if(x.h!=null){hs+=x.h;n+=x.items.length;}});if(n)avg=Math.max(120,hs/n);}
  function hide(el,b){if(!b.on)return;b.h=el.offsetHeight;el.style.height=b.h+'px';el.innerHTML='';b.on=false;}
  function render(){
    var list=D.releases.filter(pass),items=[],prev=null,ev=0;
    list.forEach(function(r){var y=r.d?r.d.slice(0,4):null;if(y&&y!==prev){items.push({y:y});prev=y;}items.push({r:r});ev+=r.e.length;});
    document.getElementById('tlCount').textContent='共 '+list.length+' 次发布 · '+ev+' 条评测引用';
    if(io)io.disconnect();fs0=focusSet();blocks=[];
    for(var i=0;i<items.length;i+=BLK)blocks.push({items:items.slice(i,i+BLK),h:null,on:false});
    if(!blocks.length){app.innerHTML='<div class="tl-empty">没有匹配的发布——试试清除厂商、搜索或分数过滤。</div>';return;}
    app.innerHTML=blocks.map(function(b,i){return '<div class="tl-blk" data-b="'+i+'" style="height:'+estimate(b)+'px"></div>';}).join('');
    var els=app.children;show(els[0],blocks[0]);
    io=new IntersectionObserver(function(ents){ents.forEach(function(en){var i=+en.target.getAttribute('data-b');
      if(en.isIntersecting)show(en.target,blocks[i]);else hide(en.target,blocks[i]);});
      for(var j=0;j<blocks.length;j++)if(!blocks[j].on&&blocks[j].h==null)els[j].style.height=estimate(blocks[j])+'px';
    },{rootMargin:'150% 0px'});
    for(var k=0;k<els.length;k++)io.observe(els[k]);
  }
  function renderFilters(){document.getElementById('tlFilters').innerHTML=state.filters.map(function(f,i){
    return '<span class="fchip">'+esc(f.bench)+' ≥ '+esc(f.min)+'<button type="button" data-i="'+i+'" aria-label="移除过滤">✕</button></span>';}).join('');}
  function boot(data){
    D=data;
    document.getElementById('tlControls').hidden=false;staticEl.hidden=true;app.hidden=false;
    var vr=document.getElementById('tlVendorRow'),benchSel=document.getElementById('tlBench'),filled=false;
    function fillBench(){if(filled)return;filled=true;var h='<option value="">选择评测…</option>';
      D.benchmarks.forEach(function(b){h+='<option value="'+esc(b[0])+'">'+esc(b[0]+' · '+b[1])+'</option>';});benchSel.innerHTML=h;}
    benchSel.addEventListener('focus',fillBench);benchSel.addEventListener('pointerdown',fillBench);
    vr.addEventListener('click',function(e){var b=e.target.closest('.vchip');if(!b)return;
      var v=b.getAttribute('data-v'),i=state.vendors.indexOf(v);
      if(i<0)state.vendors.push(v);else state.vendors.splice(i,1);
      b.classList.toggle('on',i<0);b.setAttribute('aria-pressed',i<0?'true':'false');render();});
    document.getElementById('tlAddScore').addEventListener('click',function(){
      fillBench();var bid=benchSel.value,min=parseFloat(document.getElementById('tlMin').value);
      if(!bid||isNaN(min))return;
      if(!state.filters.some(function(f){return f.bench===bid&&f.min===min;})){state.filters.push({bench:bid,min:min});renderFilters();render();}});
    document.getElementById('tlFilters').addEventListener('click',function(e){var b=e.target.closest('button[data-i]');if(!b)return;
      state.filters.splice(parseInt(b.getAttribute('data-i'),10),1);renderFilters();render();});
    app.addEventListener('click',function(e){var b=e.target.closest('.chip-more');if(!b)return;
      var id=b.getAttribute('data-r'),r=null;for(var i=0;i<D.releases.length;i++)if(D.releases[i].i===id){r=D.releases[i];break;}
      if(!r)return;expanded[id]=1;var art=b.closest('article.evt');var tmp=document.createElement('div');tmp.innerHTML=card(r,fs0);art.replaceWith(tmp.firstChild);});
    var qt=null;document.getElementById('tlQ').addEventListener('input',function(e){var v=e.target.value.trim().toLowerCase();
      clearTimeout(qt);qt=setTimeout(function(){state.q=v;render();},120);});
    render();
  }
  fetch(DATA,{credentials:'same-origin'}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json();}).then(boot)
    .catch(function(){/* 数据加载失败：保留首屏直出与年份归档入口 */});
})();
</script>
</body>
</html>`;
}


/** 刻度尺结点：厂商品牌色 logo 徽章（明暗双变体，信任等级由描边色表达） */
/** 行内厂商 logo（明暗双变体，跟随主题切换） */
function pinLogo(vid, trust) {
  const ext = LOGO_EXT[vid];
  const img = ext
    ? `<img class="vlogo-img" src="/assets/logos/${vid}.${ext}" width="17" height="17" alt="" loading="lazy" decoding="async">`
    : `<b style="color:var(--graphite)">·</b>`;
  return `<span class="pin-logo pin-${trust}" aria-hidden="true">${img}</span>`;
}

function autoBenchmarkPage(db, id, rows) {
  const sources = [...new Set(rows.map(x => x.e.url).filter(Boolean))];
  const vendors = [...new Set(rows.map(x => x.r.vendor_label))];
  const rel = "../";
  const uniqInList = (list) => {
    const seen = new Set();
    const rels = [];
    for (const x of list) {
      if (!seen.has(x.r.id)) {
        seen.add(x.r.id);
        rels.push(x.r);
      }
    }
    return rels.sort((a, b) => (b.release_date || "").localeCompare(a.release_date || "") || (a.id || "").localeCompare(b.id || ""));
  };

  const rels = uniqInList(rows);
  let prevYear = null;
  const parts = [];
  for (const r of rels) {
    const y = r.release_date ? r.release_date.slice(0, 4) : null;
    if (y && y !== prevYear) {
      parts.push(`<div class="yrm"><b>${esc(y)}</b></div>`);
      prevYear = y;
    }
    parts.push(tlEvtHtml(db, r, { benchId: id, chipBase: "../" }));
  }
  const adopt = `<div class="feed animate">${parts.join("")}</div>`;

  const relCountStr = `${rels.length} 场主流模型官方发布${rows.length > rels.length ? `（共 ${rows.length} 项分值）` : ""}`;
  const title = `${id} · 评测参考（由发布引用自动生成） · 评估大全`;
  const desc = truncate(`${id}：在 ${relCountStr}中被引用（${vendors.join("、")}）。本页由这些发布引用自动生成，逐条列出分数、协议与原文；完整定义与数据集介绍补全中。`, 150);
  return `${shellHead({ rel: "../../", title, desc, path: `benchmarks/${id}/`, extra: `<style>${SHELL_CSS}${PAGE_CSS}${EVT_CSS}${TIMELINE_CSS}</style>` })}
</head>
<body>
${shellTopbar("../../", "benchmarks")}
<main id="main-content" class="detail-main bm-container">
  <nav class="breadcrumb"><a href="../../index.html">首页</a> / <a href="../">评估大全</a> / <b>${esc(id)}</b></nav>
  <div class="detail-head"><h1>${esc(id)}</h1><span class="status-badge status-saturation">由发布引用自动生成</span></div>
  <p style="font-size:15.5px;color:#475569;margin:6px 0 0;">这个评测在官方模型发布中被引用了 <b>${rels.length}</b> 场发布${rows.length > rels.length ? `（共 <b>${rows.length}</b> 项分值）` : ""}（来自${esc(vendors.join("、"))}）。本页由这些发布引用自动生成：逐条列出每次引用的分数、协议与原文链接；完整的评测定义、数据集与指标介绍仍在补全，缺失的信息不会编造。</p>
  ${profileNotice("auto")}
  <div class="callout">下面每张「发布」卡片记录了主流模型在该基准上的官方实测得分、评测协议与模型核心能力介绍。</div>

  <h2 class="detail-sec" id="adoption">模型发布引用时间轴</h2>
  <p class="refs">共收录 ${rels.length} 场模型发布${rows.length > rels.length ? `（收录 ${rows.length} 项分值）` : ""} · 按发布时间倒序排列${db.updated ? ` · 数据更新于 ${esc(db.updated)}` : ""}</p>
  ${adopt}

  <h2 class="detail-sec" id="sources">来源</h2>
  <div class="ext-links">${sources.map(u => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(u.length > 60 ? u.slice(0, 57) + "…" : u)}</a>`).join("")}</div>
  <p class="refs" style="margin-top:14px;">发现本页数据问题？欢迎在 <a href="https://github.com/zenHeart/evals" target="_blank" rel="noopener">GitHub</a> 提 Issue。</p>
</main>
<footer class="site-foot"><a href="${SITE}">evals.zenheart.site</a> · MIT License · ZenHeart</footer>
${SHELL_JS}
</body>
</html>`;
}

// ---------------------------------------------------------------- main

function main() {
  const db = loadBenchData();
  const cats = Object.fromEntries(db.categories.map(c => [c.id, c]));

  // 数据健全性：id 必须是 URL 安全 slug（详情页路径依赖它）
  for (const b of db.benchmarks) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(b.id)) {
      console.error(`[hub] 非法 benchmark id（会生成非法路径）: "${b.id}"`);
      process.exit(1);
    }
  }

  const dir = join(DIST, "benchmarks");
  mkdirSync(dir, { recursive: true });
  // 清理上一代构建的陈旧产物（旧数据 JS / 已删除 benchmark 的详情目录）
  rmSync(join(DIST, "benchmarks-data.js"), { force: true });
  const validIds = new Set(db.benchmarks.map(b => b.id));
  for (const name of readdirSync(dir)) {
    if (statSync(join(dir, name)).isDirectory() && !validIds.has(name)) {
      rmSync(join(dir, name), { recursive: true, force: true });
    }
  }

  // 证据自动建档清单（explorer 底部罗列用；先于 explorer 渲染计算）
  const entityIdsPre = new Set(db.benchmarks.map(b => b.id));
  const evidenceCountPre = new Map();
  for (const r of db.releases) {
    for (const e of r.evidence) {
      if (entityIdsPre.has(e.benchmark_id)) continue;
      evidenceCountPre.set(e.benchmark_id, (evidenceCountPre.get(e.benchmark_id) || 0) + 1);
    }
  }
  const autoIds = [...evidenceCountPre.entries()].map(([id, n]) => ({ id, n })).sort((a, b) => b.n - a.n);

  // Explorer 卡片数据（含占位过滤：tests 为空或「见 …」引用占位的不上卡片）
  const cards = db.benchmarks.map(b => {
    const cite = (b._verified || 0) * 1000 + (b._pending || 0);
    return {
      b,
      show: b.tests && b.tests !== "-" && b.tests.indexOf("见 ") !== 0,
      cat: cats[b.category] || { name: b.category, color: "#94a3b8" },
      cite,
      badge: citeBadge(b),
      vendors: vendorHint(b),
    };
  });

  writeFileSync(join(dir, "index.html"), explorerPage(db, cards, autoIds), "utf-8");

  // 模型发布时间轴：一级路由 /releases/（主导航「模型发布」）+ 旧深层路径重定向
  const relTop = join(DIST, "releases");
  mkdirSync(relTop, { recursive: true });
  // 瘦身数据外置为内容哈希文件（可长期缓存，内容变才换 URL），不再内联进 HTML
  for (const name of readdirSync(relTop)) if (/^data\.[0-9a-f]+\.json$/.test(name)) rmSync(join(relTop, name), { force: true });
  const slim = JSON.stringify(releasesSlimData(db));
  const dataFile = `data.${createHash("sha256").update(slim).digest("hex").slice(0, 10)}.json`;
  writeFileSync(join(relTop, dataFile), slim, "utf-8");
  // 年份静态归档（无 JS / 爬虫入口）
  const byYear = new Map();
  for (const r of [...db.releases].sort((a, b) => (b.release_date || "").localeCompare(a.release_date || "") || (a.id || "").localeCompare(b.id || ""))) {
    const y = r.release_date ? r.release_date.slice(0, 4) : "unknown";
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y).push(r);
  }
  const years = [...byYear.keys()];
  for (const name of readdirSync(relTop)) if (/^\d{4}$|^unknown$/.test(name) && !byYear.has(name)) rmSync(join(relTop, name), { recursive: true, force: true });
  for (const [y, list] of byYear) {
    mkdirSync(join(relTop, y), { recursive: true });
    writeFileSync(join(relTop, y, "index.html"), releasesYearPage(db, y, list, years), "utf-8");
  }
  writeFileSync(join(relTop, "index.html"), releasesTimelinePage(db, "../", dataFile, years), "utf-8");
  const relDir = join(dir, "releases");
  mkdirSync(relDir, { recursive: true });
  writeFileSync(join(relDir, "index.html"),
    `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>页面已迁移 · 模型发布时间轴</title>
<meta http-equiv="refresh" content="0; url=../../releases/">
<script>location.replace("../../releases/");</script>
</head>
<body>
<p>模型发布时间轴已迁移到 <a href="../../releases/">/releases/</a>。</p>
</body>
</html>`, "utf-8");

  // 每个 benchmark 的独立详情页
  for (const b of db.benchmarks) {
    const sameCat = db.benchmarks.filter(x => x.category === b.category && x.id !== b.id && x.tests && x.tests !== "-");
    const outDir = join(dir, b.id);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "index.html"), detailPage(db, b, cats[b.category] || { name: b.category, color: "#94a3b8" }, sameCat.slice(0, 6)), "utf-8");
  }

  // 证据自动建档页：账本中出现但无实体档的评测 100% 有可分享详情页
  const entityIds = new Set(db.benchmarks.map(b => b.id));
  const evidenceById = new Map();
  for (const r of db.releases) {
    for (const e of r.evidence) {
      if (entityIds.has(e.benchmark_id)) continue;
      if (!evidenceById.has(e.benchmark_id)) evidenceById.set(e.benchmark_id, []);
      const fresh = Boolean(r.release_date) && r.release_date >= db.cutoff;
      evidenceById.get(e.benchmark_id).push({ r, e, fresh });
    }
  }
  let autoCount = 0;
  for (const [id, rows] of evidenceById) {
    const outDir = join(dir, id);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "index.html"), autoBenchmarkPage(db, id, rows), "utf-8");
    autoCount++;
  }

  // 刷新自动建档清单（单一事实来源：构建时重算，供研究 agent 与对账使用）
  const genDir = join(REPO_ROOT, "data", "generated");
  mkdirSync(genDir, { recursive: true });
  const autoRows = [...evidenceById.entries()].map(([id, rows]) => ({ id, evidenceCount: rows.length })).sort((a, b) => b.evidenceCount - a.evidenceCount);
  writeFileSync(join(genDir, "auto-benchmark-ids.json"),
    JSON.stringify({ updated: new Date().toISOString().slice(0, 10), total: autoRows.length, ids: autoRows }, null, 1), "utf-8");

  console.log(`[evals-hub] Built explorer + ${db.benchmarks.length} entity pages + ${autoCount} auto-evidence pages → dist/benchmarks/`);
}

main();
