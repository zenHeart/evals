#!/usr/bin/env node
/**
 * build-web.mjs — 构建 Web 版（dist/）供 GitHub Pages 部署。
 *
 * 输出:
 *   dist/index.html                  # 入口
 *   dist/web/chapter-NN.html         # 每章 HTML
 *   dist/research/benchmarks.html    # 调研页
 *   dist/research/frameworks.html    # 调研页
 *   dist/styles.css
 */

import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync, copyFileSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const CHAPTERS_DIR = join(REPO_ROOT, "book", "chapters");
const RESEARCH_DIR = join(REPO_ROOT, "research");
const COVER_DIR = join(REPO_ROOT, "book", "cover");
const DIST = join(REPO_ROOT, "dist");
const META = join(REPO_ROOT, "book", "metadata.yaml");

const NAV_HTML = `
<header class="topbar">
  <a class="logo" href="index.html">Eval Handbook</a>
  <nav>
    <a href="index.html">首页</a>
    <a href="research/benchmarks.html">基准图谱</a>
    <a href="research/frameworks.html">框架工具</a>
    <a href="evals.epub">下载 EPUB</a>
  </nav>
</header>
`;

const CSS = `* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: ui-sans-serif, -apple-system, "PingFang SC", "Microsoft YaHei", "Segoe UI", sans-serif;
  background: #fdfdfb;
  color: #1a1a1a;
  line-height: 1.75;
}
body.dark { background: #0b1224; color: #f1f5f9; }
.topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 24px; border-bottom: 1px solid rgba(0,0,0,.08);
  position: sticky; top: 0; background: rgba(253,253,251,.92);
  backdrop-filter: blur(8px); z-index: 10;
}
body.dark .topbar { background: rgba(11,18,36,.92); border-bottom-color: rgba(255,255,255,.08); }
.logo { font-weight: 800; font-size: 17px; text-decoration: none; color: #5b8def; }
.topbar nav a { margin-left: 16px; color: #475569; text-decoration: none; font-size: 14px; }
body.dark .topbar nav a { color: #94a3b8; }
.topbar nav a:hover { color: #5b8def; }

main { max-width: 820px; margin: 0 auto; padding: 32px 24px 80px; }
h1 { font-size: 38px; line-height: 1.15; margin: 0 0 12px; }
h2 { font-size: 26px; line-height: 1.25; margin: 32px 0 12px; color: #2563eb; border-bottom: 1px solid rgba(0,0,0,.08); padding-bottom: 6px; }
body.dark h2 { color: #60a5fa; border-bottom-color: rgba(255,255,255,.1); }
h3 { font-size: 20px; margin: 24px 0 8px; color: #1e293b; }
body.dark h3 { color: #e2e8f0; }
p { margin: 12px 0; }
code { background: #f4f4f4; padding: 0.1em 0.35em; border-radius: 3px; font-family: "SFMono-Regular", Consolas, monospace; font-size: 0.92em; }
body.dark code { background: rgba(255,255,255,.08); }
pre { background: #f8f8f8; border: 1px solid rgba(0,0,0,.08); border-left: 3px solid #5b8def; padding: 14px 16px; overflow-x: auto; line-height: 1.5; border-radius: 4px; }
body.dark pre { background: rgba(0,0,0,.3); border-color: rgba(255,255,255,.08); }
pre code { background: transparent; padding: 0; }
blockquote { border-left: 4px solid #cbd5e1; padding: 6px 16px; color: #475569; margin: 16px 0; }
body.dark blockquote { border-left-color: #475569; color: #94a3b8; }
table { border-collapse: collapse; width: 100%; margin: 16px 0; }
th, td { border: 1px solid rgba(0,0,0,.1); padding: 8px 12px; text-align: left; }
body.dark th, body.dark td { border-color: rgba(255,255,255,.1); }
th { background: #f1f5f9; }
body.dark th { background: rgba(255,255,255,.05); }
a { color: #5b8def; text-decoration: none; }
a:hover { text-decoration: underline; }
hr { border: 0; border-top: 1px solid rgba(0,0,0,.08); margin: 32px 0; }
body.dark hr { border-top-color: rgba(255,255,255,.1); }
.hero { background: linear-gradient(135deg, #0f172a, #1e293b); color: #f8fafc; padding: 60px 0; }
.hero h1 { font-size: 56px; background: linear-gradient(90deg, #22d3ee, #60a5fa, #a78bfa); -webkit-background-clip: text; background-clip: text; color: transparent; margin: 0; }
.hero p.lead { color: #cbd5e1; font-size: 20px; max-width: 680px; }
.eyebrow { color: #22d3ee; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; font-size: 12px; margin: 0 0 8px; }
.tag { display: inline-block; padding: 2px 10px; background: #e0e7ff; color: #3730a3; border-radius: 999px; font-size: 12px; font-weight: 700; margin: 0 4px 4px 0; }
body.dark .tag { background: rgba(96,165,250,.16); color: #93c5fd; }
ul, ol { padding-left: 24px; }
li { margin: 4px 0; }
.chapter-list { columns: 2; column-gap: 24px; }
@media (max-width: 720px) { .chapter-list { columns: 1; } }
nav.toc-mini { background: #f1f5f9; border-radius: 6px; padding: 14px 18px; margin: 24px 0; font-size: 14px; }
body.dark nav.toc-mini { background: rgba(255,255,255,.05); }
.kbd { font-family: monospace; background: #e2e8f0; padding: 1px 6px; border-radius: 3px; font-size: 12px; }
body.dark .kbd { background: rgba(255,255,255,.1); }
`;

function mdToHtml(md, baseUrl = "") {
  // simpler than the XHTML one, html5 friendly
  const lines = md.split(/\r?\n/);
  const out = [];
  let inFence = null, fenceBuf = [], paraBuf = [];
  let i = 0;

  function flushPara() {
    if (paraBuf.length === 0) return;
    const text = paraBuf.join(" ");
    out.push(`<p>${inlineMd(text)}</p>`);
    paraBuf = [];
  }
  function inlineMd(s) {
    const protectedTokens = [];
    s = s.replace(/`([^`]+)`/g, (_, c) => {
      const idx = protectedTokens.length;
      protectedTokens.push(`<code>${escapeHtml(c)}</code>`);
      return `${idx}`;
    });
    s = escapeHtml(s);
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, "$1<em>$2</em>$3");
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => `<a href="${u}">${t}</a>`);
    s = s.replace(/(\d+)/g, (_, idx) => protectedTokens[Number(idx)]);
    return s;
  }
  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  for (i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const fm = trimmed.match(/^(```|~~~)([a-zA-Z0-9_-]*)/);
    if (fm) {
      if (inFence === null) { flushPara(); inFence = fm[1][0]; fenceBuf = []; }
      else if (inFence === fm[1][0]) {
        out.push(`<pre><code class="lang-${fm[2] || ""}">${escapeHtml(fenceBuf.join("\n"))}</code></pre>`);
        inFence = null; fenceBuf = [];
      } else { fenceBuf.push(line); }
      continue;
    }
    if (inFence !== null) { fenceBuf.push(line); continue; }
    if (!trimmed) { flushPara(); continue; }
    const h = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (h) { flushPara(); out.push(`<h${h[1].length}>${inlineMd(h[2])}</h${h[1].length}>`); continue; }
    if (/^[-*]\s+/.test(trimmed)) {
      flushPara();
      const items = [];
      while (i < lines.length) {
        const l = lines[i].trim();
        if (/^[-*]\s+/.test(l)) { items.push(l.replace(/^[-*]\s+/, "")); i++; }
        else if (l === "") { i++; break; }
        else break;
      }
      i--;
      out.push("<ul>" + items.map(it => `<li>${inlineMd(it)}</li>`).join("") + "</ul>");
      continue;
    }
    if (/^\d+\.\s+/.test(trimmed)) {
      flushPara();
      const items = [];
      while (i < lines.length) {
        const l = lines[i].trim();
        if (/^\d+\.\s+/.test(l)) { items.push(l.replace(/^\d+\.\s+/, "")); i++; }
        else if (l === "") { i++; break; }
        else break;
      }
      i--;
      out.push("<ol>" + items.map(it => `<li>${inlineMd(it)}</li>`).join("") + "</ol>");
      continue;
    }
    if (/^>\s?/.test(trimmed)) {
      flushPara();
      const buf = [];
      while (i < lines.length) {
        const l = lines[i].trim();
        if (/^>\s?/.test(l)) { buf.push(l.replace(/^>\s?/, "")); i++; }
        else if (l === "") { i++; break; } else break;
      }
      i--;
      out.push(`<blockquote><p>${inlineMd(buf.join(" "))}</p></blockquote>`);
      continue;
    }
    if (/^\|.*\|$/.test(trimmed) && /^\|[\s-:|]+\|$/.test(lines[i + 1]?.trim() ?? "")) {
      flushPara();
      const header = trimmed.split("|").slice(1, -1).map(c => c.trim());
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|.*\|$/.test(lines[i].trim())) {
        rows.push(lines[i].trim().split("|").slice(1, -1).map(c => c.trim()));
        i++;
      }
      i--;
      out.push("<table><thead><tr>" + header.map(h => `<th>${inlineMd(h)}</th>`).join("") + "</tr></thead><tbody>" +
        rows.map(r => "<tr>" + r.map(c => `<td>${inlineMd(c)}</td>`).join("") + "</tr>").join("") +
        "</tbody></table>");
      continue;
    }
    if (/^---+$/.test(trimmed)) { flushPara(); out.push("<hr/>"); continue; }
    paraBuf.push(trimmed);
  }
  flushPara();
  return out.join("\n");
}

function readChapterOrder() {
  const yaml = readFileSync(META, "utf-8");
  const lines = yaml.split(/\r?\n/);
  const items = [];
  let inChapters = false;
  for (const line of lines) {
    if (line.trim() === "chapters:") { inChapters = true; continue; }
    if (inChapters && /^[a-zA-Z_]+:/.test(line)) break;
    if (inChapters) {
      const m = line.match(/^\s+- ([a-zA-Z0-9_.-]+\.md)\s*$/);
      if (m) items.push(m[1]);
    }
  }
  return items;
}

function chapterPage(chapterFile, prevFile, nextFile) {
  const md = readFileSync(join(CHAPTERS_DIR, chapterFile), "utf-8");
  const body = mdToHtml(md);
  const num = chapterFile.match(/^chapter-(\d+)/)?.[1] || "00";
  const titleMatch = md.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].replace(/^\d+\.\s+/, "") : chapterFile;
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · 大模型评估入门</title>
<link rel="stylesheet" href="../styles.css">
</head>
<body>
${NAV_HTML}
<main>
${body}
<hr>
<nav style="display:flex; justify-content: space-between; font-size: 14px;">
  <span>${prevFile ? `<a href="chapter-${prevFile.match(/^chapter-(\d+)/)[1]}.html">← 上一章</a>` : ""}</span>
  <span><a href="../index.html">目录</a></span>
  <span>${nextFile ? `<a href="chapter-${nextFile.match(/^chapter-(\d+)/)[1]}.html">下一章 →</a>` : ""}</span>
</nav>
</main>
</body>
</html>`;
}

function indexPage(chapters) {
  const items = chapters.map(f => {
    const num = f.match(/^chapter-(\d+)/)[1];
    const md = readFileSync(join(CHAPTERS_DIR, f), "utf-8");
    const t = md.match(/^#\s+(.+)$/m)?.[1] || f;
    return `<li><a href="web/chapter-${num}.html">${t}</a></li>`;
  }).join("");
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>大模型评估入门</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
${NAV_HTML}
<section class="hero">
  <div style="max-width: 820px; margin: 0 auto; padding: 0 24px;">
    <p class="eyebrow">ZenHeart · Eval Handbook</p>
    <h1>大模型评估入门</h1>
    <p class="lead">从前端工程师视角看 Eval。理解厂商报告里的每一行数字、选对合适的基准、从零搭建自己的评估流水线。</p>
  </div>
</section>
<main>
  <h2>章节列表</h2>
  <ul class="chapter-list">${items}</ul>
  <p><a href="evals.epub" download>下载 EPUB 离线版 →</a></p>
</main>
</body>
</html>`;
}

function researchPage(mdFile, title) {
  if (!existsSync(mdFile)) return null;
  const md = readFileSync(mdFile, "utf-8");
  const body = mdToHtml(md);
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · 大模型评估入门</title>
<link rel="stylesheet" href="../styles.css">
</head>
<body>
${NAV_HTML}
<main>
${body}
</main>
</body>
</html>`;
}

function main() {
  mkdirSync(join(DIST, "web"), { recursive: true });
  mkdirSync(join(DIST, "research"), { recursive: true });

  writeFileSync(join(DIST, "styles.css"), CSS, "utf-8");
  if (existsSync(join(COVER_DIR, "cover.svg"))) {
    copyFileSync(join(COVER_DIR, "cover.svg"), join(DIST, "cover.svg"));
  }

  const chapters = readChapterOrder();
  for (let idx = 0; idx < chapters.length; idx++) {
    const f = chapters[idx];
    const prev = idx > 0 ? chapters[idx - 1] : null;
    const next = idx < chapters.length - 1 ? chapters[idx + 1] : null;
    const num = f.match(/^chapter-(\d+)/)[1];
    writeFileSync(join(DIST, "web", `chapter-${num}.html`), chapterPage(f, prev, next), "utf-8");
  }
  console.log(`[evals-web] Built ${chapters.length} chapter pages`);

  writeFileSync(join(DIST, "index.html"), indexPage(chapters), "utf-8");
  console.log(`[evals-web] Built index.html`);

  // Research pages
  const benchHtml = researchPage(join(RESEARCH_DIR, "benchmarks.md"), "基准图谱");
  if (benchHtml) writeFileSync(join(DIST, "research", "benchmarks.html"), benchHtml, "utf-8");
  const frmHtml = researchPage(join(RESEARCH_DIR, "frameworks.md"), "框架工具");
  if (frmHtml) writeFileSync(join(DIST, "research", "frameworks.html"), frmHtml, "utf-8");
  console.log(`[evals-web] Built research pages`);

  console.log(`[evals-web] Web build complete → ${DIST}`);
}

main();
