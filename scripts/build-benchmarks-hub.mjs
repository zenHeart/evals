#!/usr/bin/env node
/**
 * build-benchmarks-hub.mjs — 生成"评估体系汇集站"
 *
 * 数据源: data/benchmarks.json
 * 输出:   dist/benchmarks/index.html + dist/benchmarks-data.js
 *
 * 页面能力:
 *   - 按类别筛选（chips）
 *   - 按厂商引用量倒排（默认）/ 按名称
 *   - 搜索（名称/用途/引用模型）
 *   - 每条含: 用途一句话 / 评分协议 / 官网直达 / 论文 / 厂商采用记录表
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
body { margin:0; font-family: ui-sans-serif,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif; background:#f8fafc; color:#0f172a; line-height:1.75; }
body.dark { background:#0b1224; color:#e2e8f0; }
.topbar { display:flex; align-items:center; justify-content:space-between; padding:12px 20px; border-bottom:1px solid rgba(0,0,0,.08); position:sticky; top:0; background:rgba(248,250,252,.94); backdrop-filter:blur(8px); z-index:50; }
body.dark .topbar { background:rgba(11,18,36,.94); border-bottom-color:rgba(255,255,255,.08); }
.logo { font-weight:800; font-size:17px; text-decoration:none; color:#2563eb; }
body.dark .logo { color:#60a5fa; }
.topbar nav a { margin-left:14px; color:#475569; text-decoration:none; font-size:14px; }
body.dark .topbar nav a { color:#94a3b8; }
.wrap { max-width:1080px; margin:0 auto; padding:28px 20px 80px; }
h1 { font-size: clamp(26px,4vw,36px); margin:0 0 6px; }
.sub { color:#64748b; font-size:14.5px; margin-bottom:20px; }
body.dark .sub { color:#94a3b8; }
.controls { display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin:18px 0; }
.chip { border:1.5px solid rgba(0,0,0,.12); background:transparent; color:inherit; border-radius:999px; padding:5px 14px; font-size:13.5px; cursor:pointer; font-weight:600; transition:.15s; }
body.dark .chip { border-color:rgba(255,255,255,.18); }
.chip:hover { border-color:#2563eb; }
.chip.active { background:#2563eb; border-color:#2563eb; color:#fff; }
.search { flex:1; min-width:220px; }
.search input { width:100%; padding:9px 16px; border-radius:10px; border:1.5px solid rgba(0,0,0,.12); background:transparent; color:inherit; font-size:14px; outline:none; }
.search input:focus { border-color:#2563eb; }
select { padding:8px 12px; border-radius:10px; border:1.5px solid rgba(0,0,0,.12); background:transparent; color:inherit; font-size:13.5px; cursor:pointer; }
body.dark select { border-color:rgba(255,255,255,.18); background:#16213a; }
.stats { font-size:13px; color:#64748b; margin:6px 0 16px; }
.card { border:1px solid rgba(0,0,0,.09); border-radius:14px; padding:18px 20px; margin:14px 0; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,.04); }
body.dark .card { background:#111a2e; border-color:rgba(255,255,255,.09); }
.card-head { display:flex; align-items:flex-start; gap:12px; flex-wrap:wrap; }
.rank { font-family:ui-monospace,monospace; font-size:12px; font-weight:800; color:#94a3b8; padding-top:4px; min-width:30px; }
.card-title { font-size:18px; font-weight:800; display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.card-title a { color:#2563eb; text-decoration:none; }
.card-title a:hover { text-decoration:underline; }
body.dark .card-title a { color:#60a5fa; }
.cat-tag { font-size:11.5px; font-weight:800; padding:2px 10px; border-radius:999px; color:#fff; }
.cite-badge { font-size:11.5px; font-weight:700; color:#64748b; border:1px solid rgba(0,0,0,.12); padding:2px 9px; border-radius:999px; }
body.dark .cite-badge { border-color:rgba(255,255,255,.16); }
.card p { margin:8px 0; font-size:14.5px; }
.card .field b { color:#334155; }
body.dark .card .field b { color:#cbd5e1; }
.adoption { margin-top:10px; border-top:1px dashed rgba(0,0,0,.1); padding-top:10px; }
body.dark .adoption { border-top-color:rgba(255,255,255,.1); }
.adoption-title { font-size:12.5px; font-weight:800; color:#64748b; letter-spacing:.05em; margin-bottom:6px; }
.adoption-item { display:flex; gap:10px; font-size:13.5px; padding:3px 0; flex-wrap:wrap; }
.adoption-item .model { font-weight:700; min-width:170px; }
.adoption-item .score { color:#059669; font-weight:700; font-family:ui-monospace,monospace; }
body.dark .adoption-item .score { color:#34d399; }
.adoption-item .note { color:#94a3b8; font-size:12.5px; }
.ext { font-size:12.5px; display:flex; gap:14px; margin-top:8px; flex-wrap:wrap; }
.ext a { color:#2563eb; }
body.dark .ext a { color:#60a5fa; }
.empty { text-align:center; color:#94a3b8; padding:40px 0; }
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

  writeFileSync(join(DIST, "benchmarks-data.js"),
    `window.BENCH_DB=${JSON.stringify(db)};`, "utf-8");

  const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>评估体系大全 · 按厂商引用量倒排 · 大模型评估入门</title>
<meta name="description" content="LLM 评估体系汇集站：65+ 主流评测按类别组织、按模型发布引用量倒排，每个评估直达官网与论文，附厂商采用记录。">
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
    <a href="../research/benchmarks.html">基准图谱</a>
    <a href="../research/frameworks.html">框架工具</a>
    <a href="../evals.epub">下载 EPUB</a>
    <button class="dark-toggle" id="themeToggle" type="button" title="切换暗色模式" style="border:1px solid rgba(0,0,0,.15);background:transparent;border-radius:8px;padding:4px 10px;cursor:pointer;margin-left:10px;">🌙</button>
  </nav>
</header>
<div class="wrap">
  <h1>评估体系大全</h1>
  <div class="sub">罗列主流 LLM 评测：它测什么 · 怎么评分 · <b>哪些模型发布时引用了它</b>（按引用量倒排）。点击评测名直达官网，论文入口在卡片底部。</div>
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
  <div id="list"></div>
</div>
<footer><a href="${SITE}">evals.zenheart.site</a> · 数据持续充实中 · MIT License</footer>
<script src="../benchmarks-data.js"></script>
<script>
(function(){
  var db=window.BENCH_DB;
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  var cats={}; db.categories.forEach(function(c){cats[c.id]=c;});
  var state={cat:'all', q:'', sort:'cite'};
  var all=db.benchmarks.filter(function(b){return b.tests!=='-'&&b.tests.indexOf('见 ')!==0;});
  all.forEach(function(b){ b._cite=(b.adoption||[]).filter(function(a){return a.release;}).length; });

  // chips
  var chipsEl=document.getElementById('chips');
  var chips=[{id:'all',name:'全部'}].concat(db.categories)
    .map(function(c){var n=c.id==='all'?all.length:all.filter(function(b){return b.category===c.id;}).length;
      return '<button class="chip'+(c.id==='all'?' active':'')+'" data-cat="'+c.id+'">'+c.name+' <span style="opacity:.6">'+n+'</span></button>';}).join('');
  chipsEl.innerHTML=chips;
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
      var hay=(b.name+' '+b.tests+' '+(b.adoption||[]).map(function(a){return a.release;}).join(' ')).toLowerCase();
      return hay.indexOf(state.q)>=0;
    });
    if(state.sort==='cite')list.sort(function(a,b){return b._cite-a._cite||a.name.localeCompare(b.name);});
    else if(state.sort==='name')list.sort(function(a,b){return a.name.localeCompare(b.name);});
    else list.sort(function(a,b){return a.category.localeCompare(b.category)||b._cite-a._cite;});
    return list;
  }

  function render(){
    var list=filtered();
    document.getElementById('stats').textContent='共 '+list.length+' 个评估体系 · 数据更新于 '+db.updated+' · 引用量=官方发布材料中出现的次数（持续核对充实）';
    var el=document.getElementById('list');
    if(!list.length){el.innerHTML='<div class="empty">无匹配结果</div>';return;}
    el.innerHTML=list.map(function(b,i){
      var c=cats[b.category]||{name:b.category,color:'#94a3b8'};
      var ad=b.adoption||[];
      var adHtml='<div class="adoption"><div class="adoption-title">🏢 厂商采用记录（发布时作为基准引用）</div>'+
        (b.adoptionNote?'<div class="note" style="color:#64748b;font-size:12.5px;margin-bottom:6px;">📌 '+esc(b.adoptionNote)+'</div>':'')+
        (ad.length?
        ad.map(function(a){
          return '<div class="adoption-item"><span class="model">'+esc(a.release)+'</span>'+
            (a.score&&a.score!=='-'?'<span class="score">'+esc(a.score)+'</span>':'')+
            (a.note?'<span class="note">'+esc(a.note)+'</span>':'')+'</div>';
        }).join('')
        :'<div class="note" style="color:#94a3b8;font-size:13px;">暂无官方发布引用记录（社区驱动或垂域使用）</div>')+
        '</div>';
      return '<div class="card">'+
        '<div class="card-head"><span class="rank">#'+(i+1)+'</span>'+
        '<div style="flex:1;min-width:0;">'+
        '<div class="card-title"><a href="'+esc(b.url)+'" target="_blank" rel="noopener">'+esc(b.name)+' ↗</a>'+
        '<span class="cat-tag" style="background:'+c.color+'">'+esc(c.name)+'</span>'+
        (b._cite>0?'<span class="cite-badge">'+b._cite+' 家引用</span>':'')+'</div>'+
        '<p class="field"><b>测什么：</b>'+esc(b.tests)+'</p>'+
        (b.protocol&&b.protocol!=='-'?'<p class="field"><b>评分协议：</b>'+esc(b.protocol)+'</p>':'')+
        adHtml+
        '<div class="ext">'+
        '<a href="'+esc(b.url)+'" target="_blank" rel="noopener">🏠 官网/数据集</a>'+
        (b.paper&&b.paper!=='-'?'<a href="'+esc(b.paper)+'" target="_blank" rel="noopener">📄 论文</a>':'')+
        '<a href="../index.html">← 返回全书</a>'+
        '</div></div></div>';
    }).join('');
  }
  render();
})();
</script>
</body>
</html>`;

  writeFileSync(join(DIST, "benchmarks", "index.html"), html, "utf-8");
  console.log(`[evals-hub] Built benchmarks hub (${db.benchmarks.length} benchmarks) → dist/benchmarks/index.html`);
}

main();
