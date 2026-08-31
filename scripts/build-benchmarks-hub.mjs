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
import { fileURLToPath } from "node:url";
import { SITE, SHELL_CSS, shellHead, shellTopbar, shellFooter, SHELL_JS } from "./site-shell.mjs";
import { loadBenchData } from "./load-data.mjs";

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

/** 引用计数徽章：只统计近三年窗口（fresh）；窗口外/日期缺失归入档案降级展示（goal §12.2/§12.7） */
function citeBadge(b) {
  const parts = [];
  if (b._verified > 0) parts.push(`已核验 ${b._verified} 次近三年官方发布引用`);
  if (b._pending > 0) parts.push(`${b._pending} 条待核验`);
  if (!parts.length) {
    return b._archived > 0
      ? `暂无近三年已核验引用 · 档案 ${b._archived} 条`
      : "社区驱动 · 暂无官方发布引用";
  }
  if (b._archived > 0) parts.push(`档案 ${b._archived} 条`);
  return parts.join(" · ");
}

/** 卡片/详情页共用的引用提示行：前 3 家 + 「+N」（仅已核验优先） */
function vendorHint(b) {
  const sorted = [...(b.adoption || [])].sort((a, x) => (a.status === "verified" ? -1 : 1) - (x.status === "verified" ? -1 : 1));
  const names = sorted.map(a => a.release).filter(Boolean);
  const head = names.slice(0, 3).join(" · ");
  return names.length > 3 ? `${head} +${names.length - 3}` : head;
}

// ---------------------------------------------------------------- 页面 CSS

const PAGE_CSS = `
* { box-sizing: border-box; }
body { margin:0; font-family: ui-sans-serif,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif; background:#f6f7fb; color:#0f172a; line-height:1.7; overflow-x:hidden; word-break:break-word; }
body.dark { background:#0b1224; color:#e2e8f0; }
a { color:#2563eb; text-decoration:none; }
body.dark a { color:#60a5fa; }
a:hover { text-decoration:underline; }
.bm-container { width:min(100% - 32px, 1504px); margin-inline:auto; }
h1 { font-size:clamp(26px,4vw,36px); margin:0 0 6px; }
.sub { color:#64748b; font-size:14.5px; margin-bottom:18px; }
body.dark .sub { color:#94a3b8; }
.sub b { color:#2563eb; }
body.dark .sub b { color:#60a5fa; }

/* ---------- 控制区 ---------- */
.controls { display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin:16px 0 8px; }
.chip { border:1.5px solid rgba(0,0,0,.12); background:transparent; color:inherit; border-radius:999px; padding:5px 14px; font-size:13.5px; cursor:pointer; font-weight:600; transition:.15s; }
body.dark .chip { border-color:rgba(255,255,255,.18); }
.chip:hover { border-color:#2563eb; }
.chip.active { background:#2563eb; border-color:#2563eb; color:#fff; }
.search { flex:1; min-width:220px; }
.search input { width:100%; padding:10px 16px; border-radius:12px; border:1.5px solid rgba(0,0,0,.12); background:#fff; color:inherit; font-size:14px; outline:none; }
body.dark .search input { background:#111a2e; border-color:rgba(255,255,255,.14); }
.search input:focus { border-color:#2563eb; }
select { padding:9px 12px; border-radius:10px; border:1.5px solid rgba(0,0,0,.12); background:#fff; color:inherit; font-size:13.5px; cursor:pointer; }
body.dark select { background:#111a2e; border-color:rgba(255,255,255,.18); }
.stats { font-size:13px; color:#64748b; margin:8px 0 16px; }
body.dark .stats { color:#94a3b8; }
.empty { text-align:center; color:#94a3b8; padding:48px 0; }

/* ---------- Explorer 网格：goal.md §9.4 显式断点 360=1 / 640=2 / 1024=3 / 1440=4 ---------- */
.grid { display:grid; grid-template-columns:1fr; gap:1rem; align-items:stretch; }
@media (min-width:640px)  { .grid { grid-template-columns:repeat(2, minmax(0, 1fr)); } }
@media (min-width:1024px) { .grid { grid-template-columns:repeat(3, minmax(0, 1fr)); } }
@media (min-width:1440px) { .grid { grid-template-columns:repeat(4, minmax(0, 1fr)); } }

/* ---------- 卡片：纯索引入口，整卡一个链接 ---------- */
.card {
  display:flex; flex-direction:column; gap:8px; margin:0;
  border:1px solid rgba(0,0,0,.09); border-radius:16px; background:#fff;
  box-shadow:0 1px 3px rgba(0,0,0,.04); padding:16px 18px; color:inherit;
  text-decoration:none; transition:box-shadow .15s, border-color .15s, transform .15s;
  overflow-wrap:anywhere;
}
body.dark .card { background:#111a2e; border-color:rgba(255,255,255,.09); }
.card:hover { box-shadow:0 6px 20px rgba(0,0,0,.08); border-color:rgba(37,99,235,.35); text-decoration:none; transform:translateY(-1px); }
.card-head { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; }
.card-title { font-size:17px; font-weight:800; line-height:1.35; }
.cat-tag { flex:none; font-size:11px; font-weight:800; padding:2px 10px; border-radius:999px; color:#fff; margin-top:2px; }
.card-desc { margin:0; font-size:13.5px; color:#475569; line-height:1.6; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
body.dark .card-desc { color:#a8b6c8; }
.card-protocol { font-size:12px; color:#94a3b8; font-family:ui-monospace,monospace; }
.card-cite { font-size:12.5px; font-weight:700; color:#2563eb; }
body.dark .card-cite { color:#60a5fa; }
.card-cite.zero { color:#94a3b8; font-weight:600; }
.card-vendors { font-size:12px; color:#94a3b8; }
.card-go { margin-top:auto; font-size:13px; font-weight:700; color:#2563eb; padding-top:6px; border-top:1px dashed rgba(0,0,0,.08); }
body.dark .card-go { color:#60a5fa; border-top-color:rgba(255,255,255,.1); }
.card[hidden] { display:none; }

/* ---------- 详情页 ---------- */
.detail-main { max-width:900px; margin:0 auto; padding:28px 0 70px; }
.breadcrumb { font-size:13px; color:#64748b; margin-bottom:14px; }
body.dark .breadcrumb { color:#94a3b8; }
.breadcrumb b { color:#2563eb; }
body.dark .breadcrumb b { color:#60a5fa; }
.detail-head { display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:4px; }
.detail-head h1 { margin:0; }
.status-badge { font-size:12px; font-weight:800; padding:3px 12px; border-radius:999px; }
.status-active { background:rgba(5,150,105,.12); color:#059669; }
.status-rolling { background:rgba(37,99,235,.12); color:#2563eb; }
.status-saturation { background:rgba(217,119,6,.14); color:#b45309; }
.status-retired { background:rgba(100,116,139,.14); color:#64748b; }
body.dark .status-saturation { color:#fbbf24; }
h2.detail-sec { font-size:20px; margin:30px 0 10px; padding-bottom:6px; border-bottom:1px solid rgba(0,0,0,.08); scroll-margin-top:70px; }
body.dark h2.detail-sec { border-bottom-color:rgba(255,255,255,.1); }
.kv { display:grid; grid-template-columns:110px 1fr; gap:6px 14px; font-size:14.5px; margin:10px 0; }
.kv .k { font-weight:800; font-size:12.5px; color:#94a3b8; letter-spacing:.05em; padding-top:3px; }
@media (max-width:560px) { .kv { grid-template-columns:1fr; } .kv .k { padding-top:0; } }
.callout { border-left:4px solid #93c5fd; background:rgba(96,165,250,.07); padding:10px 16px; border-radius:0 8px 8px 0; margin:14px 0; font-size:14px; }
body.dark .callout { border-left-color:#38537a; background:rgba(96,165,250,.06); }
.callout.warn { border-left-color:#f59e0b; background:rgba(245,158,11,.08); }
body.dark .callout.warn { border-left-color:#92600a; background:rgba(245,158,11,.07); }
.gap-list { margin:8px 0; padding-left:20px; font-size:14px; color:#64748b; }
body.dark .gap-list { color:#94a3b8; }
.gap-list li { margin:4px 0; }
.adopt-table { width:100%; border-collapse:collapse; font-size:14px; }
.adopt-table th, .adopt-table td { border-bottom:1px dashed rgba(0,0,0,.08); padding:8px 10px 8px 0; vertical-align:top; text-align:left; }
body.dark .adopt-table th, body.dark .adopt-table td { border-bottom-color:rgba(255,255,255,.08); }
.adopt-table th { font-size:12px; letter-spacing:.05em; color:#94a3b8; }
.adopt-table .score { color:#059669; font-weight:800; font-family:ui-monospace,monospace; white-space:nowrap; }
body.dark .adopt-table .score { color:#6ee7b7; }
.adopt-table .note { color:#94a3b8; font-size:13px; }
.related { display:grid; grid-template-columns:repeat(auto-fill, minmax(min(100%, 220px), 1fr)); gap:10px; margin:12px 0; }
.related a { display:block; border:1px solid rgba(0,0,0,.09); border-radius:12px; padding:10px 14px; color:inherit; font-size:13.5px; }
body.dark .related a { border-color:rgba(255,255,255,.1); }
.related a:hover { border-color:rgba(37,99,235,.4); text-decoration:none; }
.related .r-name { font-weight:800; }
.ext-links { display:flex; gap:16px; flex-wrap:wrap; margin:10px 0; }
.ext-links a { font-size:14px; }
.refs { font-size:13.5px; color:#64748b; }
body.dark .refs { color:#94a3b8; }
footer.site-foot { text-align:center; color:#94a3b8; font-size:13px; padding:26px 0 40px; }
footer.site-foot a { color:inherit; }
`;

// ---------------------------------------------------------------- Explorer 页

function explorerPage(db, cards) {
  const chips = [{ id: "all", name: "全部" }, ...db.categories]
    .map(c => {
      const n = c.id === "all" ? cards.filter(x => x.show).length : cards.filter(x => x.show && x.b.category === c.id).length;
      return `<button class="chip${c.id === "all" ? " active" : ""}" type="button" data-cat="${esc(c.id)}">${esc(c.name)} <span style="opacity:.6">${n}</span></button>`;
    })
    .join("");

  const cardHtml = cards.map(({ b, show, cat, cite, badge, vendors }) => `
    <a class="card" href="${esc(b.id)}/" data-cat="${esc(b.category)}" data-cite="${cite}" data-name="${esc(b.name)}" data-hay="${esc((b.name + " " + (b.tests || "") + " " + (b.meaning || "") + " " + (b.protocol || "") + " " + vendors).toLowerCase())}"${show ? "" : " hidden"}>
      <div class="card-head">
        <span class="card-title">${esc(b.name)}</span>
        <span class="cat-tag" style="background:${esc(cat.color)}">${esc(cat.name)}</span>
      </div>
      <p class="card-desc">${esc(truncate(b.tests, 120))}</p>
      ${b.protocol ? `<div class="card-protocol">${esc(truncate(b.protocol, 60))}</div>` : ""}
      <div class="card-cite${(b._verified || 0) + (b._pending || 0) ? "" : " zero"}">${esc(badge)}</div>
      ${vendors ? `<div class="card-vendors">${esc(vendors)}</div>` : ""}
      <div class="card-go">查看详情 →</div>
    </a>`).join("");

  const title = "评估体系大全 · 65+ 主流大模型评测参考";
  const desc = "LLM 评估参考数据库：每个评测有独立详情页，讲清它测什么、分数什么含义、被哪些模型发布引用、协议如何解读。";

  return `${shellHead({ rel: "../", title, desc, path: "benchmarks/", extra: `<style>${SHELL_CSS}${PAGE_CSS}</style>` })}
</head>
<body>
${shellTopbar("../", "benchmarks")}
<div class="bm-container">
  <h1>评估体系大全</h1>
  <div class="sub">严谨、可查询、可追溯的 benchmark reference：每张卡片是一个评测的<b>索引入口</b>，点击进入独立详情页看测什么、分数怎么看、谁家发布引用过。不懂评测？只读卡片就够。<br><a href="releases/">🕐 模型发布时间轴：按厂商与版本浏览近三年官方发布证据 →</a></div>
  <div class="controls">
    <div class="search"><input id="q" type="search" placeholder="搜索：名称 / 用途 / 引用厂商…" aria-label="搜索评估体系"></div>
    <select id="sort" aria-label="排序方式">
      <option value="cite">按厂商引用量 ↓</option>
      <option value="name">按名称 A-Z</option>
      <option value="cat">按类别</option>
    </select>
  </div>
  <div class="controls" id="chips" style="margin-top:0;">${chips}</div>
  <div class="stats"><span id="statsText"></span> <button id="clearFilters" type="button" class="chip" hidden>✕ 清除全部筛选</button></div>
  <div id="list" class="grid">${cardHtml}</div>
  <div id="emptyState" class="empty" hidden>没有匹配的评测——可能是筛选或搜索词太窄。<button type="button" class="chip" onclick="document.getElementById('clearFilters').click()">清除筛选恢复全部 ${cards.filter(c => c.show).length} 个</button></div>
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
    document.querySelectorAll('#chips .chip').forEach(function(x){x.classList.toggle('active',x===b);});
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

function detailPage(db, b, cat, related) {
  const cite = b.adoption || [];
  // 统一窗口语义：fresh 进主视图，archive（窗口外/日期缺失）降级为折叠历史区
  const verified = cite.filter(a => a.status === "verified" && a.fresh);
  const pending = cite.filter(a => a.status !== "verified" && a.fresh);
  const archived = cite.filter(a => !a.fresh);
  const title = `${b.name} · 评测是什么、分数怎么看 · 评估大全`;
  const desc = truncate(`${b.name}：${b.tests || ""}${b.meaning ? " " + b.meaning : ""}`, 150);

  const identityRows = [
    ["类别", `<span class="cat-tag" style="background:${esc(cat.color)}">${esc(cat.name)}</span>`],
    b.status ? ["状态", statusBadge(b.status)] : null,
    ["官网 / 数据集", b.url ? `<a href="${esc(b.url)}" target="_blank" rel="noopener">${esc(b.url)}</a>` : "—"],
    b.paper ? ["论文", `<a href="${esc(b.paper)}" target="_blank" rel="noopener">${esc(b.paper)}</a>`] : null,
  ].filter(Boolean).map(([k, v]) => `<div class="k">${k}</div><div>${v}</div>`).join("");

  const adoptRow = a => `<tr>
      <td>${a.url ? `<a href="${esc(a.url)}" target="_blank" rel="noopener">${esc(a.release)} ↗</a>` : esc(a.release)}${a.date ? `<br><span style="color:#94a3b8;font-size:12px;font-family:ui-monospace,monospace;">${esc(a.date)}</span>` : ""}</td>
      <td>${a.score ? `<span class="score">${esc(a.score)}</span>` : '<span style="color:#94a3b8">未公布</span>'}</td>
      <td>${a.note ? `<span class="note">${esc(a.note)}</span>` : ""}</td>
    </tr>`;
  const adoptTable = rows => `<table class="adopt-table"><thead><tr><th>模型发布</th><th>报告分数</th><th>备注</th></tr></thead><tbody>${rows.join("")}</tbody></table>`;

  let adoptBlock;
  if (!cite.length) {
    adoptBlock = `<p style="color:#94a3b8;font-size:14px;">暂无官方模型发布引用记录——社区驱动或垂域使用。${b.adoptionNote ? esc(b.adoptionNote) : ""}</p>`;
  } else {
    const archivedBlock = archived.length
      ? `<details style="margin:14px 0;"><summary style="cursor:pointer;font-weight:700;font-size:14px;color:#64748b;">档案引用（${archived.length} 条 · 近三年窗口之外或发布日期待核，仅作背景参考）</summary>${adoptTable(archived.map(adoptRow))}</details>`
      : "";
    adoptBlock =
      (verified.length
        ? `<p style="font-weight:700;margin:8px 0 4px;">已核验（${verified.length}）<span style="font-weight:400;color:#94a3b8;font-size:13px;"> — 近三年窗口内，已定位到发布页原文</span></p>${adoptTable(verified.map(adoptRow))}`
        : "") +
      (pending.length
        ? `<p style="font-weight:700;margin:16px 0 4px;">待核验（${pending.length}）<span style="font-weight:400;color:#94a3b8;font-size:13px;"> — 分数在图片表格中或定位待人工确认，暂不计入公开引用数</span></p>${adoptTable(pending.map(adoptRow))}`
        : "") +
      archivedBlock;
  }

  return `${shellHead({ rel: "../../", title, desc, path: `benchmarks/${b.id}/`, extra: `<style>${SHELL_CSS}${PAGE_CSS}</style>` })}
</head>
<body>
${shellTopbar("../../", "benchmarks")}
<main class="detail-main bm-container">
  <nav class="breadcrumb"><a href="../../index.html">首页</a> / <a href="../">评估大全</a> / <b>${esc(b.name)}</b></nav>
  <div class="detail-head">
    <h1>${esc(b.name)}</h1>
    ${statusBadge(b.status)}
  </div>
  ${b.tests ? `<p style="font-size:15.5px;color:#475569;margin:6px 0 0;">${esc(b.tests)}</p>` : ""}

  <h2 class="detail-sec" id="identity">基本信息</h2>
  <div class="kv">${identityRows}</div>

  <h2 class="detail-sec" id="quick">30 秒看懂</h2>
  ${b.meaning ? `<p>${esc(b.meaning)}</p>` : `<p style="color:#94a3b8">分数含义解读待补。</p>`}
  ${b.adoptionNote ? `<div class="callout"><b>采用格局：</b>${esc(b.adoptionNote)}</div>` : ""}

  <h2 class="detail-sec" id="protocol">评分协议</h2>
  ${b.protocol ? `<p>${esc(b.protocol)}</p>` : `<p style="color:#94a3b8">协议信息待收录。</p>`}
  <div class="callout warn"><b>可比性提示：</b>同一 benchmark 的分数是「实验配置」的产物——benchmark variant、harness、reasoning effort、tools、采样参数、run 次数与聚合方式任一不同，数字都不能直接横向比较。下表各厂商分数如未披露协议细节，请只作方向性参考。</div>

  <h2 class="detail-sec" id="adoption">厂商采用记录（模型发布时作为基准引用）</h2>
  <p class="refs">共 ${cite.length} 条（近三年：已核验 ${verified.length} · 待核验 ${pending.length}${archived.length ? ` · 档案 ${archived.length}` : ""}）${db.updated ? ` · 数据更新于 ${esc(db.updated)}` : ""} · 窗口起点 ${esc(db.cutoff)}</p>
  ${adoptBlock}

  <h2 class="detail-sec" id="gaps">数据缺口（本页暂未收录）</h2>
  <ul class="gap-list">
    <li>benchmark variant / 版本（如 Diamond 子集、Verified 子集）与 dataset 规模</li>
    <li>各厂商使用的 harness / scaffold 与 agent 工具配置</li>
    <li>reasoning effort、采样参数（temperature / top-p）、run 次数与聚合方式</li>
    <li>metric 的 chance baseline 与人类 baseline 实验条件</li>
    <li>污染检测与饱和状态的结构化标注</li>
  </ul>
  <p class="refs">以上字段缺失时，本页<b>不虚构数字</b>；后续按 release 级证据逐步补齐并标注来源。</p>

  <h2 class="detail-sec" id="reproduce">复现入口</h2>
  <div class="ext-links">
    ${b.url && b.url !== "-" ? `<a href="${esc(b.url)}" target="_blank" rel="noopener">🏠 官网 / 数据集</a>` : ""}
    ${b.paper && b.paper !== "-" ? `<a href="${esc(b.paper)}" target="_blank" rel="noopener">📄 论文</a>` : ""}
    <a href="../">← 返回评估大全</a>
  </div>

  ${related.length ? `<h2 class="detail-sec" id="related">相关评测（同类别）</h2>
  <div class="related">${related.map(r => `<a href="../${esc(r.id)}/"><span class="r-name">${esc(r.name)}</span><br><span style="color:#94a3b8">${esc(truncate(r.tests, 40))}</span></a>`).join("")}</div>` : ""}

  <h2 class="detail-sec" id="refs">引用</h2>
  <p class="refs">本页数据更新于 ${esc(db.updated)}，依据厂商发布材料真实抓取；发现数据问题欢迎在 <a href="https://github.com/zenHeart/evals" target="_blank" rel="noopener">GitHub</a> 提 Issue。</p>
</main>
<footer class="site-foot"><a href="${SITE}">evals.zenheart.site</a> · MIT License · ZenHeart</footer>
${SHELL_JS}
</body>
</html>`;
}

// ---------------------------------------------------------------- 发布时间轴页（交互式 v2）

const TIMELINE_CSS = `
/* ============ 模型发布时间轴 · 独立设计（仪器纸 / 刻度尺脊线 / 可信度引脚） ============ */
body.tlr-page { background:#F7F8F6; color:#17212E; }
body.tlr-page.dark { background:#0E1622; color:#E4E9EF; }
.tlr {
  --paper:#F7F8F6; --ink:#17212E; --graphite:#5C6B7C; --rule:#D9DEE3;
  --pin:#D14A24; --ok:#0E7A4E; --warn:#A16207; --card:#FFFFFF;
  max-width:1120px; margin:0 auto; padding:28px 0 70px;
}
body.dark .tlr, body.tlr-page.dark .tlr {
  --paper:#0E1622; --ink:#E4E9EF; --graphite:#93A1B3; --rule:#263241;
  --pin:#FF7A50; --ok:#3DC98A; --warn:#D9A441; --card:#131E30;
}
.tlr .eyebrow { font:700 11.5px/1 ui-monospace,SFMono-Regular,Consolas,monospace; letter-spacing:.18em; color:var(--pin); text-transform:uppercase; margin:0 0 10px; }
.tlr h1 { font-family:Georgia,"Songti SC","STSong","SimSun",serif; font-size:clamp(30px,5vw,44px); font-weight:700; line-height:1.15; margin:0 0 10px; letter-spacing:.01em; }
.tlr .sub { font-size:14.5px; color:var(--graphite); max-width:72ch; margin:0 0 8px; }
.tlr .sub a { color:var(--ink); text-decoration:underline; text-underline-offset:3px; }
/* 覆盖条 */
.cov-strip { display:flex; flex-wrap:wrap; gap:0 18px; row-gap:6px; margin:18px 0 22px; padding:10px 0; border-top:1px solid var(--rule); border-bottom:1px solid var(--rule); }
.cov-strip .cov { font:400 12.5px/1.6 ui-monospace,monospace; color:var(--graphite); }
.cov-strip .cov b { font-weight:700; color:var(--ink); font-size:14px; }
.cov-strip .cov-label { font:700 11px/1.8 ui-monospace,monospace; letter-spacing:.14em; color:var(--pin); }
/* 控制台 */
.console { border:1px solid var(--rule); background:var(--card); border-radius:8px; padding:14px 16px; margin:0 0 8px; display:flex; flex-direction:column; gap:10px; }
.console .row { display:flex; flex-wrap:wrap; gap:8px 14px; align-items:center; }
.console .lab { font:700 10.5px/1 ui-monospace,monospace; letter-spacing:.16em; color:var(--graphite); text-transform:uppercase; min-width:56px; }
.seg { display:inline-flex; border:1px solid var(--rule); border-radius:6px; overflow:hidden; }
.seg button { border:none; background:transparent; color:var(--graphite); padding:7px 16px; font:600 13px/1.2 inherit; cursor:pointer; }
.seg button + button { border-left:1px solid var(--rule); }
.seg button.on { background:var(--ink); color:var(--paper); }
.console select, .console input[type=search], .console input[type=number] {
  padding:7px 10px; border-radius:6px; border:1px solid var(--rule); background:var(--card); color:inherit; font:400 13px/1.4 inherit;
}
.console input[type=search] { flex:1; min-width:170px; }
.console input[type=number] { width:88px; font-family:ui-monospace,monospace; }
.ghost-btn { border:1px solid var(--pin); background:transparent; color:var(--pin); border-radius:6px; padding:7px 14px; font:700 12.5px/1.2 inherit; cursor:pointer; }
.ghost-btn:hover { background:color-mix(in srgb, var(--pin) 8%, transparent); }
.vchip { border:1px solid var(--rule); background:transparent; color:var(--ink); border-radius:4px; padding:5px 12px; font:600 12.5px/1.3 inherit; cursor:pointer; }
.vchip.on { background:var(--ink); border-color:var(--ink); color:var(--paper); }
.fchip { display:inline-flex; align-items:center; gap:8px; border:1px solid var(--pin); color:var(--pin); border-radius:4px; padding:5px 10px; font:700 12.5px/1.2 ui-monospace,monospace; }
.fchip button { border:none; background:transparent; color:inherit; cursor:pointer; font-size:13px; padding:0; line-height:1; }
.tl-count { font:400 12.5px/1.6 ui-monospace,monospace; color:var(--graphite); margin:10px 2px 22px; }
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
.evt .pin-dot { position:absolute; left:-42px; top:17px; width:13px; height:13px; border-radius:50%; }
.evt[data-trust="full"] .pin-dot { background:var(--ok); box-shadow:0 0 0 1.5px var(--ok), 0 0 0 4px var(--paper); }
.evt[data-trust="part"] .pin-dot { background:conic-gradient(var(--ok) 0 50%, var(--card) 50% 100%); box-shadow:0 0 0 1.5px var(--ok), 0 0 0 4px var(--paper); }
.evt[data-trust="none"] .pin-dot { background:var(--card); box-shadow:0 0 0 1.5px var(--graphite), 0 0 0 4px var(--paper); }
.evt-head { display:flex; align-items:baseline; gap:12px; flex-wrap:wrap; }
.evt-date { font:700 13px/1 ui-monospace,monospace; color:var(--pin); }
.evt-vendor { font:700 10.5px/1 ui-monospace,monospace; letter-spacing:.14em; color:var(--graphite); text-transform:uppercase; }
.evt-vendor i { font-style:normal; color:var(--rule); margin:0 5px; }
.evt-title { font-size:16.5px; font-weight:800; margin:6px 0 2px; line-height:1.4; }
.evt-blog { font-size:12.5px; color:var(--graphite); margin:0 0 6px; }
.evt-blog a { color:var(--graphite); text-decoration:underline; text-underline-offset:3px; }
.evt-blog a:hover { color:var(--pin); }
.evt-meta { font:400 12px/1.7 ui-monospace,monospace; color:var(--graphite); margin:0 0 8px; }
.evt-meta b { color:var(--ok); font-weight:700; }
.evt-meta i { color:var(--warn); font-style:normal; }
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
.tl-empty { color:var(--graphite); font-size:14px; padding:26px 0; }
@media (max-width:640px) {
  .feed { padding-left:30px; }
  .feed::before { left:8px; }
  .yrm b { left:-40px; width:36px; font-size:18px; }
  .evt .pin-dot { left:-28px; width:11px; height:11px; }
}
`;

/** 时间轴事件卡（服务端静态与客户端渲染共用同一 HTML 结构） */
function tlEvtHtml(db, r, focusSet) {
  const trust = r.verified === 0 ? "none" : r.pending === 0 ? "full" : "part";
  const region = r.region === "CN" ? "国内" : "国际";
  const chips = r.evidence.map(e => {
    const known = db.benchmarks.some(b => b.id === e.benchmark_id);
    const score = e.display ? ` <b>${esc(e.display)}</b>` : "";
    const cls = e.status === "verified" ? "ok" : "pd";
    const focus = focusSet && focusSet.has(e.benchmark_id) ? " focus" : "";
    const inner = `${esc(e.benchmark_id)}${e.variant ? " " + esc(e.variant) : ""}${score}`;
    const tip = [e.harness ? `harness: ${e.harness}` : null, e.effort ? `effort: ${e.effort}` : null]
      .filter(Boolean).join(" · ");
    return known
      ? `<a class="bchip ${cls}${focus}" href="../${esc(e.benchmark_id)}/"${tip ? ` title="${esc(tip)}"` : ""}>${inner}</a>`
      : `<span class="bchip plain${focus}" title="新 benchmark，实体页待建">${inner}</span>`;
  }).join("");
  const proto = [];
  for (const e of r.evidence) {
    if (!proto.h && e.harness) proto.h = `harness ${esc(e.harness)}`;
    if (!proto.e && e.effort) proto.e = `effort ${esc(e.effort)}`;
  }
  const metaBits = [`证据 <b>${r.verified}</b>·<i>${r.pending}</i> / ${r.evidence.length}`, proto.h, proto.e]
    .filter(Boolean).join(" · ");
  return `<article class="evt" data-trust="${trust}">
    <span class="pin-dot" aria-hidden="true"></span>
    <div class="evt-head">
      <span class="evt-date">${r.release_date ? esc(r.release_date) : "日期待核验"}</span>
      <span class="evt-vendor">${esc(r.vendor_label)}<i>·</i>${region}</span>
    </div>
    <h3 class="evt-title">${esc(r.models.length ? r.models.join(" / ") : r.release_title)}</h3>
    ${r.models.length ? `<div class="evt-blog">发布文：${r.source_url ? `<a href="${esc(r.source_url)}" target="_blank" rel="noopener">${esc(r.release_title)}</a>` : esc(r.release_title)}</div>` : ""}
    <div class="evt-meta">${metaBits}</div>
    <div class="evt-chips">${chips}</div>
    ${r.source_url && !r.models.length ? `<div class="evt-src"><a href="${esc(r.source_url)}" target="_blank" rel="noopener">官方发布原文 ↗</a><span class="kind">${esc(r.source_kind || "")}</span></div>` : ""}
  </article>`;
}

/** 分组标头（厂商模式 / 评测模式共用） */
function tlGroupHeader(name, meta, href) {
  const nameHtml = href ? `<a href="${esc(href)}">${esc(name)} ↗</a>` : esc(name);
  return `<div class="grp"><span class="g-name">${nameHtml}</span><span class="g-line"></span><span class="g-meta">${esc(meta)}</span></div>`;
}

function releasesTimelinePage(db) {
  const cutoff = db.cutoff;

  // 覆盖条：厂商 × 发布数（数据派生）
  const covCounts = new Map();
  for (const r of db.releases) covCounts.set(r.vendor_id, (covCounts.get(r.vendor_id) || 0) + 1);
  const cov = [...covCounts.entries()].sort((a, b) => b[1] - a[1])
    .map(([vid, n]) => {
      const v = db.vendors.find(x => x.id === vid);
      return `<span class="cov">${esc(v?.display_name || v?.name || vid)} <b>${n}</b></span>`;
    }).join("");

  // noscript 静态默认视图：单一时间轴（近三年），结点=模型名称，年份刻度
  const inWindow = db.releases.filter(r => r.release_date && r.release_date >= cutoff)
    .sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""));
  let prevYear = null;
  const staticParts = [];
  for (const r of inWindow) {
    const y = r.release_date ? r.release_date.slice(0, 4) : null;
    if (y && y !== prevYear) { staticParts.push(`<div class="yrm"><b>${esc(y)}</b></div>`); prevYear = y; }
    staticParts.push(tlEvtHtml(db, r, null));
  }
  const staticFeed = `<div class="feed">${staticParts.join("") || '<div class="tl-empty">暂无数据。</div>'}</div>`;

  const tlData = {
    cutoff,
    benchmarks: db.benchmarks.map(b => ({ id: b.id, name: b.name })).sort((a, b) => a.id.localeCompare(b.id)),
    vendors: db.vendors.map(v => ({ id: v.id, label: v.display_name || v.name, region: v.region ?? "" })),
    releases: db.releases,
  };

  const desc = `按时间刻度罗列国内外主流大厂的核心模型发布：每个时间结点显示哪个模型发布、引用了哪些评测及该模型分数，点击进入对应评测介绍页；支持按厂商过滤、指定评测聚焦、分数阈值与关键字过滤。`;
  return `${shellHead({ rel: "../../", title: "模型发布时间轴 · 评估大全", desc, path: "benchmarks/releases/", extra: `<style>${SHELL_CSS}${PAGE_CSS}${TIMELINE_CSS}</style>` })}
</head>
<body class="tlr-page">
${shellTopbar("../../", "benchmarks")}
<div class="tlr">
  <nav class="breadcrumb" style="margin-bottom:18px;"><a href="../../index.html">首页</a> / <a href="../">评估大全</a> / <b>发布时间轴</b></nav>
  <p class="eyebrow">Evaluation Ledger · 2023 — 2026</p>
  <h1>模型发布时间轴</h1>
  <p class="sub">${esc(desc)}引脚形状即证据可信度：<b>●</b> 全部已核验、<b>◐</b> 部分核验、<b>○</b> 待核验。<a href="../">← 返回评估大全</a></p>
  <div class="cov-strip"><span class="cov-label">已收录覆盖</span>${cov}</div>

  <div class="console" id="tlControls" hidden>
    <div class="row">
      <span class="lab">窗口</span>
      <span class="seg" id="tlWindow"><button type="button" data-v="fresh" class="on">近三年</button><button type="button" data-v="all">全部历史</button></span>
      <input type="search" id="tlQ" placeholder="搜索模型 / 发布标题 / 厂商…" aria-label="搜索时间轴">
    </div>
    <div class="row" id="tlVendorRow"><span class="lab">厂商</span></div>
    <div class="row">
      <span class="lab">分数过滤</span>
      <select id="tlBench" aria-label="选择评测"></select>
      <span class="lab" style="min-width:auto">≥</span>
      <input type="number" id="tlMin" step="any" placeholder="如 70" aria-label="最低分数">
      <button class="ghost-btn" id="tlAddScore" type="button">添加过滤</button>
      <span id="tlFilters" style="display:inline-flex;gap:6px;flex-wrap:wrap;"></span>
    </div>
  </div>
  <div class="tl-count" id="tlCount" hidden></div>

  <noscript><div>${staticFeed || '<div class="tl-empty">暂无数据。</div>'}</div></noscript>
  <div id="tlStatic">${staticFeed || '<div class="tl-empty">暂无数据。</div>'}</div>
  <div id="tlApp" class="feed" hidden></div>
</div>
<footer class="site-foot"><a href="${SITE}">evals.zenheart.site</a> · MIT License · ZenHeart</footer>
${SHELL_JS}
<script>
window.EVALS_TL = ${JSON.stringify(tlData)};
</script>
<script>
(function(){
  var D=window.EVALS_TL;
  var app=document.getElementById('tlApp'),staticEl=document.getElementById('tlStatic');
  if(!app||!D)return;
  var state={win:'fresh',vendors:[],bench:null,filters:[],q:''};
  var benchName={}; D.benchmarks.forEach(function(b){benchName[b.id]=b.name;});
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

  function focusSet(){
    var s={};
    if(state.bench)s[state.bench]=1;
    state.filters.forEach(function(f){s[f.bench]=1;});
    return s;
  }

  function nodeHtml(r){
    var fs=focusSet();
    var trust=r.verified===0?'none':(r.pending===0?'full':'part');
    var region=r.region==='CN'?'国内':'国际';
    var chips=r.evidence.map(function(e){
      var known=D.benchmarks.some(function(b){return b.id===e.benchmark_id;});
      var score=e.display?' <b>'+esc(e.display)+'</b>':'';
      var cls=e.status==='verified'?'ok':'pd';
      var focus=fs[e.benchmark_id]?' focus':'';
      var inner=esc(e.benchmark_id)+(e.variant?' '+esc(e.variant):'')+score;
      var tip=[];if(e.harness)tip.push('harness: '+esc(e.harness));if(e.effort)tip.push('effort: '+esc(e.effort));
      return known?'<a class="bchip '+cls+focus+'" href="../'+esc(e.benchmark_id)+'/"'+(tip.length?' title="'+tip.join(' · ')+'"':'')+'>'+inner+'</a>'
                  :'<span class="bchip plain'+focus+'" title="新 benchmark，实体页待建">'+inner+'</span>';
    }).join('');
    var h='',ef='';
    for(var i=0;i<r.evidence.length;i++){var e=r.evidence[i];
      if(!h&&e.harness)h='harness '+esc(e.harness);
      if(!ef&&e.effort)ef='effort '+esc(e.effort);}
    var meta='证据 <b>'+r.verified+'</b>·<i>'+r.pending+'</i> / '+r.evidence.length;
    if(h)meta+=' · '+h; if(ef)meta+=' · '+ef;
    return '<article class="evt" data-trust="'+trust+'">'+
      '<span class="pin-dot" aria-hidden="true"></span>'+
      '<div class="evt-head"><span class="evt-date">'+(r.release_date?esc(r.release_date):'日期待核验')+'</span>'+
      '<span class="evt-vendor">'+esc(r.vendor_label)+'<i>·</i>'+region+'</span></div>'+
      '<h3 class="evt-title">'+esc(r.models.length?r.models.join(' / '):r.release_title)+'</h3>'+
      (r.models.length?'<div class="evt-blog">发布文：'+(r.source_url?'<a href="'+esc(r.source_url)+'" target="_blank" rel="noopener">'+esc(r.release_title)+'</a>':esc(r.release_title))+'</div>':'')+
      '<div class="evt-meta">'+meta+'</div>'+
      '<div class="evt-chips">'+chips+'</div>'+
      (r.source_url&&!r.models.length?'<div class="evt-src"><a href="'+esc(r.source_url)+'" target="_blank" rel="noopener">官方发布原文 ↗</a><span class="kind">'+esc(r.source_kind||'')+'</span></div>':'')+
      '</article>';
  }

  function pass(r){
    if(state.win==='fresh'){if(!(r.release_date&&r.release_date>=D.cutoff))return false;}
    if(state.vendors.length&&state.vendors.indexOf(r.vendor_id)<0)return false;
    if(state.bench&&!r.evidence.some(function(e){return e.benchmark_id===state.bench;}))return false;
    for(var i=0;i<state.filters.length;i++){var f=state.filters[i];
      var ok=r.evidence.some(function(e){return e.benchmark_id===f.bench&&e.value!==null&&e.value>=f.min;});
      if(!ok)return false;}
    if(state.q){
      var hay=(r.release_title+' '+(r.models||[]).join(' ')+' '+r.vendor_label).toLowerCase();
      if(hay.indexOf(state.q)<0)return false;
    }
    return true;
  }

  function yearMarkers(list){
    var out=[],prev=null;
    list.forEach(function(r){
      var y=r.release_date?r.release_date.slice(0,4):null;
      if(y&&y!==prev){out.push('<div class="yrm"><b>'+esc(y)+'</b></div>');prev=y;}
      out.push(nodeHtml(r));
    });
    return out;
  }

  function render(){
    var list=D.releases.filter(pass).sort(function(a,b){return (b.release_date||'').localeCompare(a.release_date||'');});
    var parts=[],prev=null;
    list.forEach(function(r){
      var y=r.release_date?r.release_date.slice(0,4):null;
      if(y&&y!==prev){parts.push('<div class="yrm"><b>'+esc(y)+'</b></div>');prev=y;}
      parts.push(nodeHtml(r));
    });
    app.innerHTML=parts.join('')||'<div class="tl-empty">没有匹配的发布——试试放宽窗口、清除厂商或分数过滤。</div>';
    var ev=0;list.forEach(function(r){ev+=r.evidence.length;});
    document.getElementById('tlCount').textContent='共 '+list.length+' 次发布 · '+ev+' 条 benchmark 证据'+
      (state.win==='fresh'?'（近三年，起点 '+D.cutoff+'）':'（全部历史）');
  }

  function renderFilters(){
    document.getElementById('tlFilters').innerHTML=state.filters.map(function(f,i){
      return '<span class="fchip">'+esc(f.bench)+' ≥ '+esc(f.min)+
        '<button type="button" data-i="'+i+'" aria-label="移除过滤">✕</button></span>';}).join('');
  }

  var controls=document.getElementById('tlControls'),count=document.getElementById('tlCount');
  controls.hidden=false;count.hidden=false;staticEl.hidden=true;app.hidden=false;app.classList.add('animate');
  var vr=document.getElementById('tlVendorRow');
  D.vendors.filter(function(v){return D.releases.some(function(r){return r.vendor_id===v.id;});})
    .forEach(function(v){
      var b=document.createElement('button');b.type='button';b.className='vchip';b.textContent=v.label;b.setAttribute('data-v',v.id);
      vr.appendChild(b);});
  var benchSel=document.getElementById('tlBench');
  benchSel.innerHTML='<option value="">选择评测…</option>'+D.benchmarks.map(function(b){return '<option value="'+esc(b.id)+'">'+esc(b.id+' · '+b.name)+'</option>';}).join('');

  document.getElementById('tlWindow').addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;state.win=b.getAttribute('data-v');
    this.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===b);});render();});
  vr.addEventListener('click',function(e){
    var b=e.target.closest('.vchip');if(!b)return;
    var v=b.getAttribute('data-v'),i=state.vendors.indexOf(v);
    if(i<0)state.vendors.push(v);else state.vendors.splice(i,1);
    b.classList.toggle('on',i<0);render();});
  document.getElementById('tlAddScore').addEventListener('click',function(){
    var bid=benchSel.value,min=parseFloat(document.getElementById('tlMin').value);
    if(!bid||isNaN(min))return;
    var dup=state.filters.some(function(f){return f.bench===bid&&f.min===min;});
    if(!dup){state.filters.push({bench:bid,min:min});renderFilters();render();}});
  document.getElementById('tlFilters').addEventListener('click',function(e){
    var b=e.target.closest('button[data-i]');if(!b)return;
    state.filters.splice(parseInt(b.getAttribute('data-i'),10),1);renderFilters();render();});
  document.getElementById('tlQ').addEventListener('input',function(e){state.q=e.target.value.trim().toLowerCase();render();});

  render();
})();
</script>
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

  writeFileSync(join(dir, "index.html"), explorerPage(db, cards), "utf-8");

  // 模型发布时间轴（厂商 → 版本 → blog 证据，近 3 年窗口）
  const relDir = join(dir, "releases");
  mkdirSync(relDir, { recursive: true });
  writeFileSync(join(relDir, "index.html"), releasesTimelinePage(db), "utf-8");

  // 每个 benchmark 的独立详情页
  for (const b of db.benchmarks) {
    const sameCat = db.benchmarks.filter(x => x.category === b.category && x.id !== b.id && x.tests && x.tests !== "-");
    const outDir = join(dir, b.id);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "index.html"), detailPage(db, b, cats[b.category] || { name: b.category, color: "#94a3b8" }, sameCat.slice(0, 6)), "utf-8");
  }

  console.log(`[evals-hub] Built explorer + ${db.benchmarks.length} detail pages → dist/benchmarks/`);
}

main();
