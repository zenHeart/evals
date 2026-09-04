/**
 * site-shell.mjs — 全站唯一 Site Shell（头部导航 / 主题 / 页脚 / SEO head）。
 *
 * 书籍构建器（build-web.mjs）与评估大全构建器（build-benchmarks-hub.mjs）
 * 都从这里取同一套导航与主题逻辑，不再各自维护副本。
 *
 * 信息架构约定（唯一来源，两处 builder 均不得私自增删一级导航）：
 *   Logo → 首页（回产品入口）
 *   内容导航只有两项：学习（书籍阅读入口）/ 评估大全（benchmark explorer）
 *   EPUB / GitHub / 主题切换属于 utility，不与内容导航同级抢位置
 *   移动端 header 保持单行，utility 收进「⋯」菜单
 */

export const SITE = "https://evals.zenheart.site";

/**
 * 主导航唯一来源（goal.md §5.2）：恰好 3 项，所有页面标签/顺序/数量一致。
 * Logo 回首页不占导航位；搜索/EPUB/GitHub/主题属工具区。
 */
export const PRIMARY_NAV = [
  { key: "book", label: "系统学习", href: "book/" },
  { key: "benchmarks", label: "评估大全", href: "benchmarks/" },
  { key: "releases", label: "模型发布", href: "releases/" },
  { key: "build", label: "动手搭建", href: "build/" },
];

// ---------------------------------------------------------------- 共享 CSS

export const SHELL_CSS = `
/* ============ 全站设计系统 · Evaluation Ledger ============
   色板：仪器纸/石墨墨/结构线 + 朱砂 pin（品牌识别色，唯一暖色）+ 核验绿/琥珀
   字体：衬线铭牌（Georgia/宋体，H1 与组标）· 系统 sans 正文 · ui-mono 读数    */
:root { color-scheme: light dark; }
body {
  --paper:#F7F8F6; --ink:#17212E; --graphite:#5C6B7C; --rule:#D9DEE3;
  --pin:#D14A24; --pin-soft:rgba(209,74,36,.08); --ok:#0E7A4E; --warn:#A16207;
  --card:#FFFFFF; --serif:Georgia,"Songti SC","STSong","SimSun",serif;
  --mono:ui-monospace,SFMono-Regular,Consolas,monospace;
}
body.dark {
  --paper:#0E1622; --ink:#E4E9EF; --graphite:#93A1B3; --rule:#263241;
  --pin:#FF7A50; --pin-soft:rgba(255,122,80,.1); --ok:#3DC98A; --warn:#D9A441;
  --card:#131E30;
}
body { background:var(--paper); color:var(--ink); -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; }
:focus-visible { outline: 2px solid var(--pin); outline-offset: 2px; }
a { color:inherit; text-decoration:underline; text-decoration-color:color-mix(in srgb,var(--graphite) 45%,transparent); text-underline-offset:3px; transition: color .15s, text-decoration-color .15s; }
a:hover { color:var(--pin); text-decoration-color:var(--pin); }
.eyebrow-mono { font:700 11.5px/1 var(--mono); letter-spacing:.18em; color:var(--pin); text-transform:uppercase; }
h1 { font-family: var(--serif); }
.reading-progress { position:fixed; top:0; left:0; height:3px; background:var(--pin); z-index:9999; width:0%; transition:width .08s ease-out; pointer-events:none; }

/* ---------- Topbar：单行，4 内容导航 + utility ---------- */
.topbar {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 0 20px; height: 56px; border-bottom: 1px solid var(--rule);
  position: sticky; top: 0; background: color-mix(in srgb, var(--paper) 92%, transparent);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 100;
  transition: background .2s, border-color .2s;
}
.skip-link { position:absolute; left:-9999px; top:8px; z-index:300; background:var(--pin,#D14A24); color:#fff; padding:8px 16px; border-radius:6px; font-size:14px; text-decoration:none; }
.skip-link:focus { left:8px; }
.logo { font-family:var(--serif); font-weight:700; font-size:17.5px; white-space:nowrap; text-decoration:none; color:var(--ink); transition:opacity .15s; }
.logo:hover { opacity:.9; }
.logo b { color:var(--pin); }
.topbar nav { display: flex; align-items: center; gap: 4px; flex-wrap: nowrap; min-width: 0; }
.topbar nav a.nav-item {
  color:var(--graphite); text-decoration:none; font-size:14px; font-weight:500; white-space:nowrap;
  padding: 6px 11px; border-radius:6px; transition: color .15s, background .15s;
}
.topbar nav a.nav-item:hover { color:var(--ink); background:color-mix(in srgb,var(--graphite) 10%,transparent); text-decoration:none; }
.topbar nav a.nav-item.active {
  color:var(--paper); font-weight:700; background:var(--ink);
}
.nav-util { display: flex; align-items: center; gap: 6px; flex: none; }
.nav-util a.nav-util-link {
  color:var(--graphite); text-decoration:none; font-size:13px; font-weight:600; white-space:nowrap;
  padding: 5px 10px; border-radius:6px; border: 1px solid var(--rule); background:var(--card);
  transition: all .15s;
}
.nav-util a.nav-util-link:hover { color:var(--pin); border-color:var(--pin); background:var(--pin-soft); text-decoration:none; }
.dark-toggle {
  border: 1px solid var(--rule); background: var(--card); border-radius: 6px;
  padding: 4px 10px; cursor: pointer; font-size: 14px; color: inherit; transition: all .15s;
}
.dark-toggle:hover { border-color:var(--pin); color:var(--pin); }
.nav-menu-btn { display: none; border: 1px solid var(--rule); background: var(--card); border-radius: 6px; padding: 4px 10px; cursor: pointer; font-size: 14px; color: inherit; }
.nav-menu-panel {
  display: none; position: absolute; top: 56px; right: 12px; z-index: 110;
  background: var(--card); border: 1px solid var(--rule); border-radius: 8px;
  box-shadow: 0 12px 32px rgba(23,33,46,.14); padding: 6px; min-width: 160px;
}
.nav-menu-panel a { display: block; padding: 9px 14px; border-radius: 6px; color:inherit; text-decoration:none; font-size: 14px; }
.nav-menu-panel a:hover { background: var(--pin-soft); text-decoration:none; color:var(--pin); }
.nav-menu-panel.open { display: block; }
@media (max-width: 720px) {
  .topbar { padding: 0 12px; }
  .nav-util a.nav-util-link { display: none; }
  .nav-menu-btn { display: inline-block; }
  .topbar nav a.nav-item { font-size: 13.5px; padding: 6px 8px; }
}
/* 超窄屏：4 内容导航收进 ⋯ 菜单（保持同序），header 只留 Logo + 主题 + 菜单 */
.nav-menu-panel a.nav-mobile-item { display: none; }
@media (max-width: 560px) {
  .topbar nav { display: none; }
  .nav-menu-panel a.nav-mobile-item { display: block; }
}
/* ---------- 页脚 ---------- */
footer.page-foot { text-align: center; color: var(--graphite); font-size: 13px; padding: 30px 0 40px; border-top:1px solid var(--rule); margin-top:40px; }
footer.page-foot a { color: inherit; }
`;

// ---------------------------------------------------------------- 共享片段

/** <head>：SEO + 主题防闪烁。extra = 追加的 <link>/<style>/<script> */
export function shellHead({ rel = "", title, desc, path = "", extra = "" }) {
  const esc = s => String(s).replace(/"/g, "&quot;");
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="大模型评估入门">
<meta property="og:image" content="${SITE}/cover.svg">
<link rel="canonical" href="${SITE}/${path}">
<link rel="icon" type="image/svg+xml" href="${rel}favicon.svg">
<link rel="stylesheet" href="${rel}styles.css">
<script>
(function(){try{var t=localStorage.getItem('theme');var dark=t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches);if(dark){document.documentElement.setAttribute('data-theme','dark');var add=function(){document.body.classList.add('dark');};document.body?add():document.addEventListener('DOMContentLoaded',add);}}catch(e){}})();
</script>
<style>html[data-theme="dark"] body{background:#0E1622;color:#E4E9EF;}</style>
${extra}`;
}

/**
 * 顶栏。active: "book" | "benchmarks" | "build" | ""
 * rel: 相对前缀（首页 ""，章节页 "../../"，/book/ 与 /build/ 页 "../"）
 */
export function shellTopbar(rel = "", active = "") {
  const nav = PRIMARY_NAV.map(item => {
    const isCur = item.key === active;
    return `<a class="nav-item${isCur ? " active" : ""}" href="${rel}${item.href}"${isCur ? ' aria-current="page"' : ""}>${item.label}</a>`;
  }).join("\n    ");
  return `<a class="skip-link" href="#main-content">跳到主内容</a>
<header class="topbar">
  <a class="logo" href="${rel}index.html">📚 <b>Eval Handbook</b></a>
  <nav aria-label="主导航">
    ${nav}
  </nav>
  <div class="nav-util">
    <a class="nav-util-link" href="${rel}evals.epub">⬇ EPUB</a>
    <a class="nav-util-link" href="https://github.com/zenHeart/evals" target="_blank" rel="noopener">GitHub</a>
    <button class="dark-toggle" id="themeToggle" type="button" title="切换暗色模式" aria-label="切换暗色模式">🌙</button>
    <button class="nav-menu-btn" id="navMenuBtn" type="button" aria-label="更多" aria-expanded="false">⋯</button>
  </div>
  <div class="nav-menu-panel" id="navMenuPanel">
    ${PRIMARY_NAV.map(item => `<a class="nav-mobile-item${item.key === active ? " active" : ""}" href="${rel}${item.href}">${item.label}</a>`).join("\n    ")}
    <a href="${rel}index.html">🏠 首页</a>
    <a href="${rel}evals.epub">⬇ 下载 EPUB</a>
    <a href="https://github.com/zenHeart/evals" target="_blank" rel="noopener">GitHub 源码</a>
  </div>
</header>`;
}

export function shellFooter() {
  return `<footer class="page-foot"><a href="${SITE}">evals.zenheart.site</a> · MIT License · ZenHeart</footer>`;
}

/** 主题切换 + 移动端 utility 菜单的运行时脚本 */
export const SHELL_JS = `
<script>
(function(){
  // 主题
  var btn=document.getElementById('themeToggle');
  function apply(){var dark=document.documentElement.getAttribute('data-theme')==='dark';btn.textContent=dark?'☀️':'🌙';}
  btn.addEventListener('click',function(){
    var dark=document.documentElement.getAttribute('data-theme')==='dark';
    document.documentElement.setAttribute('data-theme',dark?'light':'dark');
    document.body.classList.toggle('dark',!dark);
    try{localStorage.setItem('theme',dark?'light':'dark');}catch(e){}
    apply();
  });
  apply();
  // 移动端 utility 菜单
  var mb=document.getElementById('navMenuBtn'),panel=document.getElementById('navMenuPanel');
  if(mb&&panel){
    mb.addEventListener('click',function(e){
      e.stopPropagation();
      var open=panel.classList.toggle('open');
      mb.setAttribute('aria-expanded',open?'true':'false');
    });
    document.addEventListener('click',function(e){
      if(!e.target.closest('#navMenuPanel')&&!e.target.closest('#navMenuBtn'))panel.classList.remove('open');
    });
  }
})();
</script>
`;
