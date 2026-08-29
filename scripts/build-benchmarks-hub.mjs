#!/usr/bin/env node
/**
 * build-benchmarks-hub.mjs — 生成"评估体系汇集站"（v2 卡片式交互）
 *
 * 数据源: data/benchmarks.json
 * 输出:   dist/benchmarks/index.html + dist/benchmarks-data.js
 *
 * v2 交互:
 *   - 每个评测 = 一张卡片：名称 + 类别 + 引用数徽章 + 测什么 + 分数含义
 *   - 悬浮引用数徽章 → 浮层列出全部引用该评测的模型发布（可点回原文）
 *   - 点击卡片 → 展开详情（评分协议 / 厂商采用记录表 / 官网与论文链接）
 *   - 类别筛选 chips + 搜索 + 排序（引用量倒排默认）
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const DATA = join(REPO_ROOT, "data", "benchmarks.json");
const DIST = join(REPO_ROOT, "dist");
const SITE = "https://evals.zenheart.site";

const PAGE_CSS = `
:root { color-scheme: light dark; }
* { box-sizing: border-box; }
body { margin:0; font-family: ui-sans-serif,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif; background:#f6f7fb; color:#0f172a; line-height:1.7; overflow-x:hidden; }
body.dark { background:#0b1224; color:#e2e8f0; }
.topbar { display:flex; align-items:center; justify-content:space-between; padding:12px 20px; border-bottom:1px solid rgba(0,0,0,.08); position:sticky; top:0; background:rgba(246,247,251,.94); backdrop-filter:blur(8px); z-index:60; }
body.dark .topbar { background:rgba(11,18,36,.94); border-bottom-color:rgba(255,255,255,.08); }
.logo { font-weight:800; font-size:17px; text-decoration:none; color:#2563eb; white-space:nowrap; }
body.dark .logo { color:#60a5fa; }
.topbar nav { display:flex; align-items:center; flex-wrap:wrap; gap:2px; }
.topbar nav a { margin-left:14px; color:#475569; text-decoration:none; font-size:14px; white-space:nowrap; }
body.dark .topbar nav a { color:#94a3b8; }
.dark-toggle { border:1px solid rgba(0,0,0,.15); background:transparent; border-radius:8px; padding:4px 10px; cursor:pointer; margin-left:10px; color:inherit; }
body.dark .dark-toggle { border-color:rgba(255,255,255,.2); }
.wrap { max-width:1100px; margin:0 auto; padding:28px 20px 90px; }
.grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(min(100%, 460px)), 1fr); gap:16px; align-items:start; }
.grid .card { margin:0; max-width:640px; width:100%; }
@media (min-width:1500px) { .grid { grid-template-columns:repeat(auto-fill, minmax(min(100%, 520px)), 1fr); } .grid .card { max-width:640px; } }
h1 { font-size:clamp(26px,4vw,36px); margin:0 0 6px; }
.sub { color:#64748b; font-size:14.5px; margin-bottom:18px; }
body.dark .sub { color:#94a3b8; }
.sub b { color:#2563eb; }
body.dark .sub b { color:#60a5fa; }
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

/* ---------- 卡片 ---------- */
.card { border:1px solid rgba(0,0,0,.09); border-radius:16px; margin:14px 0; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,.04); overflow:visible; transition: box-shadow .15s; overflow-wrap:anywhere; }
body.dark .card { background:#111a2e; border-color:rgba(255,255,255,.09); }
.card:hover { box-shadow:0 6px 20px rgba(0,0,0,.08); }
.card-main { padding:16px 20px; cursor:pointer; }
.card-main:focus-visible { outline:3px solid #2563eb; outline-offset:2px; border-radius:16px; }
.card-head { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.card-title { font-size:18.5px; font-weight:800; display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.cat-tag { font-size:11.5px; font-weight:800; padding:2px 11px; border-radius:999px; color:#fff; }
.cite-badge { position:relative; font-size:12.5px; font-weight:800; color:#2563eb; border:1.5px solid rgba(37,99,235,.35); background:rgba(37,99,235,.06); padding:3px 12px; border-radius:999px; cursor:help; user-select:none; white-space:nowrap; }
body.dark .cite-badge { color:#60a5fa; border-color:rgba(96,165,250,.4); background:rgba(96,165,250,.08); }
.cite-badge.zero { color:#94a3b8; border-color:rgba(0,0,0,.14); background:transparent; }
body.dark .cite-badge.zero { border-color:rgba(255,255,255,.16); }
.card p { margin:8px 0 0; font-size:14.5px; }
.row { display:flex; gap:8px; align-items:baseline; }
.row .k { flex:none; font-weight:800; font-size:12.5px; color:#94a3b8; letter-spacing:.06em; padding-top:2px; }
.hint { font-size:12px; color:#b0b7c3; margin-top:10px; user-select:none; }
.card.open .hint { display:none; }

/* 引用悬浮浮层 */
.cite-pop {
  position:absolute; bottom:calc(100% + 8px); left:50%; transform:translateX(-50%);
  width:min(430px, 78vw); background:#0f172a; color:#e2e8f0; border-radius:12px;
  padding:12px 14px; box-shadow:0 14px 40px rgba(0,0,0,.3); font-size:13px; line-height:1.55;
  opacity:0; pointer-events:none; transition:opacity .12s; z-index:70; text-align:left;
}
.cite-badge:hover .cite-pop, .cite-badge:focus .cite-pop { opacity:1; pointer-events:auto; }
.cite-pop h4 { margin:0 0 8px; font-size:12px; color:#94a3b8; font-weight:700; letter-spacing:.06em; }
.cite-pop .cp-item { display:flex; gap:8px; padding:4px 0; border-top:1px dashed rgba(255,255,255,.1); flex-wrap:wrap; align-items:baseline; }
.cite-pop .cp-item:first-of-type { border-top:none; }
.cite-pop a { color:#7dd3fc; text-decoration:none; }
.cite-pop a:hover { text-decoration:underline; }
.cite-pop .cp-score { color:#6ee7b7; font-family:ui-monospace,monospace; font-size:12px; }
.cite-pop .cp-note { color:#94a3b8; font-size:12px; }
.cite-pop .cp-none { color:#94a3b8; }

/* 展开详情 */
.card-detail { display:none; border-top:1px dashed rgba(0,0,0,.1); padding:14px 20px 18px; }
body.dark .card-detail { border-top-color:rgba(255,255,255,.1); }
.card.open .card-detail { display:block; }
.card.open { border-color:rgba(37,99,235,.35); }
.detail-block { margin:10px 0; }
.detail-block h4 { margin:0 0 6px; font-size:12.5px; color:#64748b; font-weight:800; letter-spacing:.06em; }
body.dark .detail-block h4 { color:#94a3b8; }
.adopt-table { width:100%; border-collapse:collapse; font-size:13.5px; }
.adopt-table td { border:none; border-bottom:1px dashed rgba(0,0,0,.08); padding:6px 8px 6px 0; vertical-align:top; }
body.dark .adopt-table td { border-bottom-color:rgba(255,255,255,.08); }
.adopt-table tr:last-child td { border-bottom:none; }
.adopt-table .m { font-weight:700; min-width:150px; display:inline-block; }
.adopt-table .s { color:#059669; font-weight:800; font-family:ui-monospace,monospace; }
body.dark .adopt-table .s { color:#6ee7b7; }
.adopt-table .nt { color:#94a3b8; font-size:12.5px; }
.adopt-table a { color:#2563eb; text-decoration:none; }
body.dark .adopt-table a { color:#60a5fa; }
.adopt-table a:hover { text-decoration:underline; }
.ext-links { display:flex; gap:16px; flex-wrap:wrap; }
.ext-links a { color:#2563eb; font-size:13.5px; text-decoration:none; }
body.dark .ext-links a { color:#60a5fa; }
.ext-links a:hover { text-decoration:underline; }
.empty { text-align:center; color:#94a3b8; padding:48px 0; }
footer { text-align:center; color:#94a3b8; font-size:13px; padding:30px 0 40px; }
`;

function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function main() {
  if (!existsSync(DATA)) {
    console.error("[hub] data/benchmarks.json not found");
    process.exit(1);
  }
  const db = JSON.parse(readFileSync(DATA, "utf-8"));
  mkdirSync(join(DIST, "benchmarks"), { recursive: true });

  writeFileSync(join(DIST, "benchmarks-data.js"), `window.BENCH_DB=${JSON.stringify(db)};`, "utf-8");

  const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>评估体系大全 · 按厂商引用量倒排 · 大模型评估入门</title>
<meta name="description" content="LLM 评估体系卡片集：65+ 主流评测，每张卡片讲清它测什么、分数什么含义、被哪些模型发布引用（悬浮看全部引用原文）。">
<link rel="canonical" href="${SITE}/benchmarks/">
<link rel="icon" type="image/svg+xml" href="../favicon.svg">
<link rel="stylesheet" href="../styles.css">
<style>${PAGE_CSS}</style>
<script>
(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.setAttribute('data-theme','dark');document.body.classList.add('dark');}}catch(e){}})();
</script>
</head>
<body>
<header class="topbar">
  <a class="logo" href="../index.html">📚 Eval Handbook</a>
  <nav>
    <a href="../index.html">首页</a>
    <a href="./index.html" style="color:#2563eb;font-weight:700;">评估大全</a>
    <a href="../web/chapter-01.html">书籍阅读</a>
    <a href="../evals.epub">下载 EPUB</a>
    <button class="dark-toggle" id="themeToggle" type="button" title="切换暗色模式">🌙</button>
  </nav>
</header>
<div class="wrap">
  <h1>评估体系大全</h1>
  <div class="sub">每张卡片 = 一个评测：<b>它测什么 · 分数什么含义 · 谁家发布引用过</b>。<br>悬浮右侧「N 家引用」徽章可看全部引用原文；点击卡片展开协议与采用详情。不懂评测？只读卡片就够。</div>
  <div class="controls">
    <div class="search"><input id="q" type="search" placeholder="搜索：名称 / 用途 / 引用模型…" aria-label="搜索评估体系"></div>
    <select id="sort" aria-label="排序方式">
      <option value="cite">按厂商引用量 ↓（倒排）</option>
      <option value="name">按名称 A-Z</option>
      <option value="cat">按类别</option>
    </select>
  </div>
  <div class="controls" id="chips" style="margin-top:0;"></div>
  <div class="stats" id="stats"></div>
  <div id="list" class="grid"></div>
</div>
<footer><a href="${SITE}">evals.zenheart.site</a> · 引用数据来自 13 家厂商发布材料真实抓取 · MIT License</footer>
<script src="../benchmarks-data.js"></script>
<script>
(function(){
  var db=window.BENCH_DB;
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  var cats={}; db.categories.forEach(function(c){cats[c.id]=c;});
  var state={cat:'all', q:'', sort:'cite'};
  var all=db.benchmarks.filter(function(b){return b.tests!=='-'&&b.tests.indexOf('见 ')!==0;});
  all.forEach(function(b){ b._cite=(b.adoption||[]).filter(function(a){return a.release&&a.release.indexOf('（')!==0;}).length; });

  var chipsEl=document.getElementById('chips');
  chipsEl.innerHTML=[{id:'all',name:'全部'}].concat(db.categories)
    .map(function(c){var n=c.id==='all'?all.length:all.filter(function(b){return b.category===c.id;}).length;
      return '<button class="chip'+(c.id==='all'?' active':'')+'" data-cat="'+c.id+'">'+c.name+' <span style="opacity:.6">'+n+'</span></button>';}).join('');
  chipsEl.addEventListener('click',function(e){
    var b=e.target.closest('.chip'); if(!b)return;
    state.cat=b.getAttribute('data-cat');
    chipsEl.querySelectorAll('.chip').forEach(function(x){x.classList.toggle('active',x===b);});
    render();
  });
  document.getElementById('sort').addEventListener('change',function(e){state.sort=e.target.value;render();});
  document.getElementById('q').addEventListener('input',function(e){state.q=e.target.value.trim().toLowerCase();render();});
  document.getElementById('themeToggle').addEventListener('click',function(){
    var dark=document.documentElement.getAttribute('data-theme')==='dark';
    document.documentElement.setAttribute('data-theme',dark?'light':'dark');
    document.body.classList.toggle('dark',!dark);
    try{localStorage.setItem('theme',dark?'light':'dark');}catch(err){}
    this.textContent=dark?'🌙':'☀️';
  });

  function filtered(){
    var list=all.filter(function(b){
      if(state.cat!=='all'&&b.category!==state.cat)return false;
      if(!state.q)return true;
      var hay=(b.name+' '+(b.tests||'')+' '+(b.meaning||'')+' '+(b.adoption||[]).map(function(a){return a.release;}).join(' ')).toLowerCase();
      return hay.indexOf(state.q)>=0;
    });
    if(state.sort==='cite')list.sort(function(a,b){return b._cite-a._cite||a.name.localeCompare(b.name);});
    else if(state.sort==='name')list.sort(function(a,b){return a.name.localeCompare(b.name);});
    else list.sort(function(a,b){return a.category.localeCompare(b.category)||b._cite-a._cite;});
    return list;
  }

  function citePop(b){
    var ad=(b.adoption||[]).filter(function(a){return a.release&&a.release.indexOf('（')!==0;});
    if(!ad.length) return '<span class="cite-pop"><h4>厂商采用记录</h4><span class="cp-none">暂无官方发布引用——社区驱动或垂域使用' + (b.adoptionNote? '。'+esc(b.adoptionNote):'') + '</span></span>';
    return '<span class="cite-pop"><h4>引用它的模型发布（'+ad.length+'）</h4>'+
      ad.map(function(a){
        var name=a.url? '<a href="'+esc(a.url)+'" target="_blank" rel="noopener">'+esc(a.release)+' ↗</a>' : esc(a.release);
        return '<span class="cp-item"><span>'+name+'</span>'+
          (a.score&&a.score!=='-'?'<span class="cp-score">'+esc(a.score)+'</span>':'')+
          (a.note?'<span class="cp-note">'+esc(a.note)+'</span>':'')+'</span>';
      }).join('')+'</span>';
  }

  function render(){
    var list=filtered();
    document.getElementById('stats').textContent='共 '+list.length+' 个评测 · 数据更新于 '+db.updated;
    var el=document.getElementById('list');
    if(!list.length){el.innerHTML='<div class="empty">无匹配结果</div>';return;}
    el.innerHTML=list.map(function(b,i){
      var c=cats[b.category]||{name:b.category,color:'#94a3b8'};
      var ad=(b.adoption||[]).filter(function(a){return a.release&&a.release.indexOf('（')!==0;});
      return '<div class="card" data-id="'+esc(b.id)+'">'+
        '<div class="card-main" tabindex="0" role="button" aria-expanded="false">'+
          '<div class="card-head">'+
            '<span class="rank" style="font-family:ui-monospace,monospace;font-size:12px;font-weight:800;color:#94a3b8;min-width:30px;">#'+(i+1)+'</span>'+
            '<span class="card-title">'+esc(b.name)+
              '<span class="cat-tag" style="background:'+c.color+'">'+esc(c.name)+'</span>'+
            '</span>'+
            (b._cite>0
              ? '<span class="cite-badge" tabindex="0">'+b._cite+' 家引用'+citePop(b)+'</span>'
              : '<span class="cite-badge zero" tabindex="0">社区驱动'+citePop(b)+'</span>')+
          '</div>'+
          '<div class="row"><span class="k">测什么</span><span>'+esc(b.tests||'-')+'</span></div>'+
          (b.meaning? '<div class="row"><span class="k">分数含义</span><span>'+esc(b.meaning)+'</span></div>':'')+
          '<div class="hint">▼ 点击卡片展开：评分协议 / 采用详情 / 原文链接</div>'+
        '</div>'+
        '<div class="card-detail">'+
          (b.protocol&&b.protocol!=='-'?'<div class="detail-block"><h4>评分协议</h4>'+esc(b.protocol)+'</div>':'')+
          (b.adoptionNote?'<div class="detail-block"><h4>采用格局</h4>'+esc(b.adoptionNote)+'</div>':'')+
          '<div class="detail-block"><h4>厂商采用记录（发布时作为基准引用）</h4>'+
            (ad.length? '<table class="adopt-table">'+ad.map(function(a){
              var name=a.url? '<a href="'+esc(a.url)+'" target="_blank" rel="noopener">'+esc(a.release)+' ↗</a>' : esc(a.release);
              return '<tr><td><span class="m">'+name+'</span></td><td>'+
                (a.score&&a.score!=='-'?'<span class="s">'+esc(a.score)+'</span> ':'')+
                (a.note?'<span class="nt">'+esc(a.note)+'</span>':'')+'</td></tr>';
            }).join('')+'</table>'
            : '<span style="color:#94a3b8;font-size:13.5px;">暂无官方发布引用记录（社区驱动或垂域使用）</span>')+
          '</div>'+
          '<div class="detail-block ext-links">'+
            '<a href="'+esc(b.url)+'" target="_blank" rel="noopener">🏠 官网 / 数据集</a>'+
            (b.paper&&b.paper!=='-'?'<a href="'+esc(b.paper)+'" target="_blank" rel="noopener">📄 论文</a>':'')+
            '<a href="../index.html">← 返回全书</a>'+
          '</div>'+
        '</div>'+
      '</div>';
    }).join('');

    // 点击卡片展开/收起（引用徽章的悬浮与链接不受影响）；支持键盘 Enter/Space
    el.querySelectorAll('.card-main').forEach(function(m){
      function toggle(){
        var card=m.closest('.card');
        card.classList.toggle('open');
        m.setAttribute('aria-expanded', card.classList.contains('open')?'true':'false');
      }
      m.addEventListener('click',function(e){
        if(e.target.closest('.cite-badge')||e.target.closest('a'))return;
        toggle();
      });
      m.addEventListener('keydown',function(e){
        if((e.key==='Enter'||e.key===' ')&&e.target===m){e.preventDefault();toggle();}
      });
    });
  }
  render();
})();
</script>
</body>
</html>`;

  writeFileSync(join(DIST, "benchmarks", "index.html"), html, "utf-8");
  console.log(`[evals-hub] Built card-based benchmarks hub (${db.benchmarks.length} benchmarks)`);
}

main();
