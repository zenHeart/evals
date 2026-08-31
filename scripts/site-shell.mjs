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
:root { color-scheme: light dark; }
/* ---------- Topbar：稳定单行，内容导航两项 + utility ---------- */
.topbar {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 0 20px; height: 56px; border-bottom: 1px solid rgba(0,0,0,.08);
  position: sticky; top: 0; background: rgba(253,253,251,.94);
  backdrop-filter: blur(8px); z-index: 100;
}
body.dark .topbar { background: rgba(11,18,36,.94); border-bottom-color: rgba(255,255,255,.08); }
.logo { font-weight: 800; font-size: 17px; white-space: nowrap; text-decoration: none; color: inherit; }
.logo b { color: #2563eb; }
body.dark .logo b { color: #60a5fa; }
.topbar nav { display: flex; align-items: center; gap: 2px; flex-wrap: nowrap; min-width: 0; }
.topbar nav a.nav-item {
  color: #475569; text-decoration: none; font-size: 14px; white-space: nowrap;
  padding: 6px 10px; border-radius: 8px;
}
body.dark .topbar nav a.nav-item { color: #94a3b8; }
.topbar nav a.nav-item:hover { color: #2563eb; background: rgba(37,99,235,.06); text-decoration: none; }
body.dark .topbar nav a.nav-item:hover { color: #60a5fa; }
.topbar nav a.nav-item.active { color: #2563eb; font-weight: 700; background: rgba(37,99,235,.08); }
body.dark .topbar nav a.nav-item.active { color: #60a5fa; background: rgba(96,165,250,.12); }
.nav-util { display: flex; align-items: center; gap: 6px; flex: none; }
.nav-util a.nav-util-link {
  color: #475569; text-decoration: none; font-size: 13.5px; white-space: nowrap;
  padding: 5px 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,.1);
}
body.dark .nav-util a.nav-util-link { color: #94a3b8; border-color: rgba(255,255,255,.16); }
.nav-util a.nav-util-link:hover { color: #2563eb; border-color: rgba(37,99,235,.4); text-decoration: none; }
body.dark .nav-util a.nav-util-link:hover { color: #60a5fa; border-color: rgba(96,165,250,.4); }
.dark-toggle {
  border: 1px solid rgba(0,0,0,.15); background: transparent; border-radius: 8px;
  padding: 4px 10px; cursor: pointer; font-size: 14px; color: inherit;
}
body.dark .dark-toggle { border-color: rgba(255,255,255,.2); }
/* 移动端：utility 折叠进「⋯」菜单，header 保持单行 */
.nav-menu-btn { display: none; border: 1px solid rgba(0,0,0,.15); background: transparent; border-radius: 8px; padding: 4px 10px; cursor: pointer; font-size: 14px; color: inherit; }
body.dark .nav-menu-btn { border-color: rgba(255,255,255,.2); }
.nav-menu-panel {
  display: none; position: absolute; top: 56px; right: 12px; z-index: 110;
  background: #fff; border: 1px solid rgba(0,0,0,.1); border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0,0,0,.14); padding: 6px; min-width: 160px;
}
body.dark .nav-menu-panel { background: #16213a; border-color: rgba(255,255,255,.12); }
.nav-menu-panel a { display: block; padding: 9px 14px; border-radius: 8px; color: inherit; text-decoration: none; font-size: 14px; }
.nav-menu-panel a:hover { background: rgba(37,99,235,.07); text-decoration: none; }
body.dark .nav-menu-panel a:hover { background: rgba(96,165,250,.1); }
.nav-menu-panel.open { display: block; }
@media (max-width: 720px) {
  .topbar { padding: 0 12px; }
  .nav-util a.nav-util-link { display: none; }
  .nav-menu-btn { display: inline-block; }
  .topbar nav a.nav-item { font-size: 13.5px; padding: 6px 8px; }
}
/* 超窄屏：3 个内容导航收进 ⋯ 菜单（保持同序），header 只留 Logo + 主题 + 菜单 */
.nav-menu-panel a.nav-mobile-item { display: none; }
@media (max-width: 520px) {
  .topbar nav { display: none; }
  .nav-menu-panel a.nav-mobile-item { display: block; }
}
/* ---------- 页脚 ---------- */
footer.page-foot { text-align: center; color: #94a3b8; font-size: 13px; padding: 30px 0 40px; }
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
<style>html[data-theme="dark"] body{background:#0b1224;color:#e2e8f0;}</style>
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
  return `<header class="topbar">
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
