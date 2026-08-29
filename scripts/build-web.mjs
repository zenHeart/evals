#!/usr/bin/env node
/**
 * build-web.mjs — 构建 Web 版（dist/）供 GitHub Pages 部署。
 *
 * v2 特性:
 *   - Mermaid 图表渲染（```mermaid 代码块 → mermaid.js）
 *   - 验收自测交互组件（点击展开）
 *   - 代码块一键复制
 *   - 章节页右侧 TOC 侧栏（滚动高亮）
 *   - 面包屑（第 X 部分 · 第 N 章）
 *   - SEO meta（description / og / canonical）
 *   - 首页按"部分"分组 + 封面图
 *   - 暗色模式切换（localStorage 记忆）
 *   - 站内搜索（全文索引，客户端）
 *   - 任务清单复选框交互
 *   - 移动端修复（word-break / 表格横向滚动容器）
 *
 * 输出:
 *   dist/index.html               # 入口（含搜索）
 *   dist/web/chapter-NN.html      # 每章
 *   dist/research/*.html          # 全部 research/*.md
 *   dist/styles.css  dist/search-data.js  dist/favicon.svg
 */

import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync, copyFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const CHAPTERS_DIR = join(REPO_ROOT, "book", "chapters");
const RESEARCH_DIR = join(REPO_ROOT, "research");
const COVER_DIR = join(REPO_ROOT, "book", "cover");
const DIST = join(REPO_ROOT, "dist");
const META = join(REPO_ROOT, "book", "metadata.yaml");
const SITE = "https://evals.zenheart.site";

// 全局结构（main() 内填充），供章节页渲染左侧书目录
let globalParts = [];
let globalChaptersMeta = {};

// ---------------------------------------------------------------- metadata

function readPartStructure() {
  const yaml = readFileSync(META, "utf-8");
  const lines = yaml.split(/\r?\n/);
  const parts = [];
  let inChapters = false;
  for (const line of lines) {
    if (line.trim() === "chapters:") { inChapters = true; continue; }
    if (inChapters && /^[a-zA-Z_]+:/.test(line)) break;
    if (!inChapters) continue;
    const partMatch = line.match(/^\s+- part: "(.+)"\s*$/);
    if (partMatch) parts.push({ title: partMatch[1], items: [] });
    else {
      const itemMatch = line.match(/^\s+- ([a-zA-Z0-9_.-]+\.md)\s*$/);
      if (itemMatch && parts.length > 0) parts[parts.length - 1].items.push(itemMatch[1]);
    }
  }
  return parts;
}

function readFlatChapters(parts) {
  return parts.flatMap(p => p.items);
}

// ---------------------------------------------------------------- markdown

function slugify(s) {
  return s.toLowerCase()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .trim().replace(/\s+/g, "-").replace(/-+/g, "-")
    .slice(0, 60) || "sec";
}

function stripMd(s) {
  return s.replace(/`([^`]+)`/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
}

/**
 * 解析 markdown → { sections, description, title }
 * sections: [{ id, level(2|3), title, html, quiz:boolean }]
 */
function mdToSections(md) {
  const lines = md.split(/\r?\n/);
  const sections = [];
  let cur = null;          // 当前 H2 section
  const paraBuf = [];
  // H1 与第一个 H2 之间的内容（引言引用块/段落）→ lead 区块，不再丢弃
  const lead = { id: "lead", title: "", html: [], quiz: false, lead: true };
  let leadStarted = false;

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function inlineMd(s) {
    const toks = [];
    s = s.replace(/`([^`]+)`/g, (_, c) => {
      toks.push(`<code>${escapeHtml(c)}</code>`);
      return `\x01${toks.length - 1}\x01`;
    });
    s = escapeHtml(s);
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, "$1<em>$2</em>");
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) =>
      /^https?:/.test(u) ? `<a href="${u}" target="_blank" rel="noopener">${t}</a>` : `<a href="${u}">${t}</a>`);
    s = s.replace(/\x01(\d+)\x01/g, (_, i) => toks[Number(i)]);
    return s;
  }

  function flushPara() {
    if (!paraBuf.length || !cur) return;
    cur.html.push(`<p>${inlineMd(paraBuf.join(" "))}</p>`);
    paraBuf.length = 0;
  }

  const titleMatch = md.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : "未命名";

  let inFence = null, fenceBuf = [], fenceLang = "";
  let i = 0;

  // 收集正文（跳过 H1 与紧随的 blockquote 引言行作为 description 用）
  const bodyStart = lines.findIndex((l, idx) => /^#\s/.test(l.trim())) + 1;

  for (i = bodyStart; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const fm = trimmed.match(/^(```|~~~)([a-zA-Z0-9_-]*)/);
    if (fm) {
      if (inFence === null) {
        flushPara();
        inFence = fm[1][0]; fenceBuf = []; fenceLang = fm[2] || "";
      } else if (inFence === fm[1][0]) {
        const code = escapeHtml(fenceBuf.join("\n"));
        if (fenceLang === "mermaid") {
          cur?.html.push(`<pre class="mermaid">${code}</pre>`);
        } else {
          const cls = fenceLang ? ` class="language-${fenceLang}"` : "";
          cur?.html.push(`<div class="code-block"><button class="copy-btn" type="button" aria-label="复制代码">复制</button><pre><code${cls}>${code}</code></pre></div>`);
        }
        inFence = null; fenceBuf = [];
      } else fenceBuf.push(line);
      continue;
    }
    if (inFence !== null) { fenceBuf.push(line); continue; }

    const h2 = trimmed.match(/^##\s+(.+)$/);
    if (h2) {
      flushPara();
      cur = { id: "", title: h2[1], html: [], quiz: /验收自测|结课自测/.test(h2[1]) };
      sections.push(cur);
      continue;
    }
    const h3 = trimmed.match(/^###\s+(.+)$/);
    if (h3) {
      flushPara();
      cur?.html.push(`<h3 id="h-${slugify(h3[1])}">${inlineMd(h3[1])}</h3>`);
      continue;
    }
    if (!cur) {
      // H1 与第一个 H2 之间的引言：引用块渲染为 lead blockquote，段落正常渲染
      if (/^>\s?/.test(trimmed)) {
        if (paraBuf.length) { lead.html.push(`<p>${inlineMd(stripMd(paraBuf.join(" ")))}</p>`); paraBuf.length = 0; }
        const buf = [];
        let j = i;
        while (j < lines.length) {
          const l = lines[j].trim();
          if (/^>\s?/.test(l)) { buf.push(l.replace(/^>\s?/, "")); j++; }
          else if (l === "") { break; }
          else break;
        }
        i = j - 1;
        const content = buf.filter(Boolean).join(" ");
        if (content) { lead.html.push(`<blockquote><p>${inlineMd(content)}</p></blockquote>`); leadStarted = true; }
        continue;
      }
      if (trimmed) {
        paraBuf.push(trimmed);
        leadStarted = true;
        continue;
      }
      if (paraBuf.length && leadStarted) {
        lead.html.push(`<p>${inlineMd(stripMd(paraBuf.join(" ")))}</p>`);
        paraBuf.length = 0;
      }
      continue;
    }
    if (!trimmed) { flushPara(); continue; }

    // task list
    if (/^[-*]\s+\[[ x]\]\s+/.test(trimmed)) {
      flushPara();
      const items = [];
      while (i < lines.length) {
        const l = lines[i].trim();
        const m = l.match(/^[-*]\s+\[([ x])\]\s+(.+)$/);
        if (m) { items.push({ done: m[1] === "x", text: m[2] }); i++; }
        else if (l === "") { i++; break; }
        else break;
      }
      i--;
      cur.html.push("<ul class=\"task-list\">" + items.map(it =>
        `<li><label><input type="checkbox" ${it.done ? "checked" : ""}> ${inlineMd(it.text)}</label></li>`).join("") + "</ul>");
      continue;
    }
    if (/^[-*]\s+/.test(trimmed)) {
      flushPara();
      const items = [];
      while (i < lines.length) {
        const l = lines[i].trim();
        if (/^[-*]\s+/.test(l) && !/^\[-*\]\s+\[/.test(l)) { items.push(l.replace(/^[-*]\s+/, "")); i++; }
        else if (l === "") { i++; break; }
        else break;
      }
      i--;
      cur.html.push("<ul>" + items.map(it => `<li>${inlineMd(it)}</li>`).join("") + "</ul>");
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
      cur.html.push("<ol>" + items.map(it => `<li>${inlineMd(it)}</li>`).join("") + "</ol>");
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
      cur.html.push(`<blockquote><p>${inlineMd(buf.join(" "))}</p></blockquote>`);
      continue;
    }
    if (/^\|.*\|$/.test(trimmed) && /^\|[\s:|-]+\|$/.test(lines[i + 1]?.trim() ?? "")) {
      flushPara();
      const header = trimmed.split("|").slice(1, -1).map(c => c.trim());
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|.*\|$/.test(lines[i].trim())) {
        rows.push(lines[i].trim().split("|").slice(1, -1).map(c => c.trim()));
        i++;
      }
      i--;
      cur.html.push(`<div class="table-wrap"><table><thead><tr>${header.map(h => `<th>${inlineMd(h)}</th>`).join("")}</tr></thead><tbody>${rows.map(r => "<tr>" + r.map(c => `<td>${inlineMd(c)}</td>`).join("") + "</tr>").join("")}</tbody></table></div>`);
      continue;
    }
    if (/^---+$/.test(trimmed)) { flushPara(); cur.html.push("<hr/>"); continue; }
    // 原生 HTML 折叠块透传：整行仅为 <details>/<summary> 相关标签时原样输出，供"参考答案折叠"
    if (/^(<\/?(details|summary)(\s[^>]*)?>|<summary(\s[^>]*)?>[^<]*<\/summary>)$/.test(trimmed)) {
      flushPara();
      cur.html.push(trimmed);
      continue;
    }
    paraBuf.push(trimmed);
  }
  flushPara();

  // H2 编号 id + description
  const descSource = (md.split(/\r?\n/).find(l => l.startsWith("> ")) || "").replace(/^>\s*/, "");
  const description = stripMd(descSource || title).slice(0, 150);
  let n = 0;
  for (const s of sections) {
    const m = s.title.match(/^(\d+(?:\.\d+)*)\s/);
    s.id = m ? `sec-${m[1].replace(/\./g, "-")}` : `sec-${++n}`;
  }
  // 引言区块（若有内容）插到最前；空 lead 不加入
  if (lead.html.length) sections.unshift(lead);
  return { title, sections, description };
}

// ---------------------------------------------------------------- assets

const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="14" fill="#0f172a"/>
<rect x="12" y="34" width="8" height="14" rx="2" fill="#22d3ee"/>
<rect x="26" y="24" width="8" height="24" rx="2" fill="#60a5fa"/>
<rect x="40" y="14" width="8" height="34" rx="2" fill="#a78bfa"/>
</svg>`;

const CSS = `* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: ui-sans-serif, -apple-system, "PingFang SC", "Microsoft YaHei", "Segoe UI", sans-serif;
  background: #fdfdfb;
  color: #1a1a1a;
  line-height: 1.8;
  overflow-x: hidden;
  word-break: break-word;
}
body.dark { background: #0b1224; color: #e2e8f0; }
a { color: #2563eb; text-decoration: none; }
body.dark a { color: #60a5fa; }
a:hover { text-decoration: underline; }

.topbar {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 12px 20px; border-bottom: 1px solid rgba(0,0,0,.08);
  position: sticky; top: 0; background: rgba(253,253,251,.94);
  backdrop-filter: blur(8px); z-index: 50;
}
body.dark .topbar { background: rgba(11,18,36,.94); border-bottom-color: rgba(255,255,255,.08); }
.logo { font-weight: 800; font-size: 17px; white-space: nowrap; }
.topbar nav { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.topbar nav a { margin-left: 8px; color: #475569; font-size: 14px; white-space: nowrap; }
body.dark .topbar nav a { color: #94a3b8; }
.topbar nav a:hover { color: #2563eb; }
.dark-toggle {
  border: 1px solid rgba(0,0,0,.15); background: transparent; border-radius: 8px;
  padding: 4px 10px; cursor: pointer; font-size: 14px; color: inherit; margin-left: 10px;
}
body.dark .dark-toggle { border-color: rgba(255,255,255,.2); }

.layout { display: grid; grid-template-columns: minmax(0,1fr) 240px; gap: 32px; max-width: 1160px; margin: 0 auto; padding: 0 20px; }
@media (max-width: 1080px) { .layout { grid-template-columns: 1fr; } .toc-side { display: none !important; } }

/* —— 书籍布局：左侧全书目录 + 右侧内容 —— */
.book-layout { display: grid; grid-template-columns: 272px minmax(0,1fr); max-width: 1380px; margin: 0 auto; }
.book-side {
  position: sticky; top: 57px; height: calc(100vh - 57px); overflow-y: auto;
  border-right: 1px solid rgba(0,0,0,.07); padding: 20px 12px 40px; font-size: 13.5px;
  scrollbar-width: thin;
}
body.dark .book-side { border-right-color: rgba(255,255,255,.08); }
.book-side::-webkit-scrollbar { width: 6px; }
.book-side::-webkit-scrollbar-thumb { background: rgba(0,0,0,.15); border-radius: 3px; }
.book-side .side-home { display:block; padding: 7px 12px; margin-bottom: 8px; border-radius: 8px; font-weight: 800; color: #2563eb; }
body.dark .book-side .side-home { color: #60a5fa; }
.book-side .side-home:hover { background: rgba(37,99,235,.06); text-decoration: none; }
.side-part { margin: 14px 0 4px; padding: 0 12px; font-size: 11.5px; font-weight: 800; color: #94a3b8; letter-spacing: .05em; text-transform: uppercase; }
.side-ch { display: block; padding: 5px 12px; border-radius: 7px; color: #475569; text-decoration: none; line-height: 1.45; }
body.dark .side-ch { color: #9fb0c3; }
.side-ch:hover { background: rgba(37,99,235,.06); color: inherit; text-decoration: none; }
.side-ch.cur { background: rgba(37,99,235,.1); color: #2563eb; font-weight: 700; }
body.dark .side-ch.cur { color: #60a5fa; background: rgba(96,165,250,.12); }
.side-sec { display: block; padding: 3px 12px 3px 26px; font-size: 12.5px; color: #64748b; text-decoration: none; border-left: 2px solid rgba(0,0,0,.06); margin-left: 18px; }
body.dark .side-sec { color: #7c8aa0; border-left-color: rgba(255,255,255,.08); }
.side-sec:hover { color: #2563eb; text-decoration: none; }
body.dark .side-sec:hover { color: #60a5fa; }
.side-sec.active { color: #2563eb; border-left-color: #2563eb; font-weight: 700; }
body.dark .side-sec.active { color: #60a5fa; }
.chapter-main2 { padding: 30px 44px 90px; min-width: 0; max-width: 900px; }
@media (max-width: 960px) {
  .book-layout { grid-template-columns: 1fr; }
  .book-side {
    position: fixed; left: 0; top: 0; bottom: 0; height: 100vh; z-index: 200;
    width: min(320px, 86vw); background: #fff; transform: translateX(-102%);
    transition: transform .2s ease; box-shadow: 8px 0 30px rgba(0,0,0,.15);
  }
  body.dark .book-side { background: #0e1730; }
  .book-side.drawer-open { transform: translateX(0); }
  .drawer-mask { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 190; }
  .drawer-mask.show { display: block; }
  .toc-fab {
    position: fixed; left: 14px; bottom: 18px; z-index: 150;
    border: none; border-radius: 999px; padding: 11px 18px; cursor: pointer;
    background: #2563eb; color: #fff; font-size: 14px; font-weight: 700;
    box-shadow: 0 8px 22px rgba(37,99,235,.4);
  }
  .chapter-main2 { padding: 24px 20px 90px; }
}
@media (min-width: 961px) { .toc-fab, .drawer-mask { display: none !important; } }

main.chapter-main { max-width: 820px; width: 100%; padding: 32px 0 80px; }

.breadcrumb { font-size: 13px; color: #64748b; margin-bottom: 14px; }
body.dark .breadcrumb { color: #94a3b8; }
.breadcrumb b { color: #2563eb; font-weight: 700; }
body.dark .breadcrumb b { color: #60a5fa; }

h1 { font-size: clamp(26px, 4.5vw, 38px); line-height: 1.2; margin: 0 0 12px; overflow-wrap: anywhere; }
h2 { font-size: clamp(20px, 3vw, 26px); margin: 40px 0 12px; color: #2563eb; border-bottom: 1px solid rgba(0,0,0,.08); padding-bottom: 6px; scroll-margin-top: 70px; }
body.dark h2 { color: #60a5fa; border-bottom-color: rgba(255,255,255,.1); }
h3 { font-size: 19px; margin: 26px 0 8px; scroll-margin-top: 70px; }
p { margin: 12px 0; }
code { background: rgba(0,0,0,.05); padding: 0.12em 0.4em; border-radius: 4px; font-family: ui-monospace, "SFMono-Regular", Consolas, monospace; font-size: 0.9em; overflow-wrap: anywhere; }
body.dark code { background: rgba(255,255,255,.09); }
pre { background: #0f172a; color: #e2e8f0; padding: 16px 18px; overflow-x: auto; line-height: 1.55; border-radius: 8px; font-size: 13.5px; margin: 0; }
pre code { background: transparent; padding: 0; color: inherit; overflow-wrap: normal; }
.code-block { position: relative; margin: 16px 0; }
.copy-btn {
  position: absolute; top: 8px; right: 8px; z-index: 2;
  border: 1px solid rgba(255,255,255,.25); background: rgba(255,255,255,.08); color: #cbd5e1;
  border-radius: 6px; padding: 3px 10px; font-size: 12px; cursor: pointer; opacity: 0; transition: opacity .15s;
}
.code-block:hover .copy-btn { opacity: 1; }
.copy-btn:hover { background: rgba(255,255,255,.18); }
blockquote { border-left: 4px solid #93c5fd; background: rgba(96,165,250,.06); padding: 10px 16px; color: #475569; margin: 16px 0; border-radius: 0 8px 8px 0; }
body.dark blockquote { border-left-color: #38537a; color: #94a3b8; background: rgba(96,165,250,.05); }
.lead-block blockquote { font-size: 15.5px; background: rgba(34,211,238,.07); border-left-color: #22d3ee; }
body.dark .lead-block blockquote { background: rgba(34,211,238,.06); }
.table-wrap { overflow-x: auto; margin: 16px 0; border-radius: 8px; border: 1px solid rgba(0,0,0,.08); }
body.dark .table-wrap { border-color: rgba(255,255,255,.1); }
table { border-collapse: collapse; width: 100%; margin: 0; font-size: 14.5px; min-width: 480px; }
th, td { border: 1px solid rgba(0,0,0,.08); padding: 8px 12px; text-align: left; vertical-align: top; }
body.dark th, body.dark td { border-color: rgba(255,255,255,.1); }
th { background: #f1f5f9; font-weight: 700; }
body.dark th { background: rgba(255,255,255,.06); }
hr { border: 0; border-top: 1px solid rgba(0,0,0,.08); margin: 32px 0; }
body.dark hr { border-top-color: rgba(255,255,255,.1); }
ul, ol { padding-left: 24px; }
li { margin: 5px 0; }
.task-list { list-style: none; padding-left: 6px; }
.task-list label { display: flex; gap: 8px; align-items: flex-start; cursor: pointer; }
.task-list input[type="checkbox"] { margin-top: 6px; accent-color: #2563eb; }

.mermaid { background: #fff; border: 1px solid rgba(0,0,0,.08); border-radius: 8px; padding: 12px; margin: 16px 0; text-align: center; overflow-x: auto; }
body.dark .mermaid { background: #f8fafc; }

/* 自测交互卡片 */
.quiz-card {
  border: 1.5px dashed #93c5fd; border-radius: 12px; padding: 4px 20px 16px;
  margin: 24px 0; background: rgba(96,165,250,.04);
}
body.dark .quiz-card { border-color: #38537a; background: rgba(96,165,250,.05); }
.quiz-card h2 { border: none; margin-top: 16px; }
.quiz-reveal {
  display: block; margin: 10px 0 4px; padding: 8px 18px;
  border: none; border-radius: 8px; background: #2563eb; color: #fff;
  font-size: 14px; font-weight: 700; cursor: pointer;
}
.quiz-reveal:hover { background: #1d4ed8; }
.quiz-body { display: none; }
.quiz-card.open .quiz-body { display: block; }
.quiz-card.open .quiz-reveal { display: none; }

/* TOC 侧栏 */
.toc-side { position: sticky; top: 76px; align-self: start; max-height: calc(100vh - 100px); overflow-y: auto; padding: 18px 0; font-size: 13.5px; }
.toc-side .toc-title { font-weight: 800; margin-bottom: 10px; color: #64748b; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; }
.toc-side a { display: block; padding: 3px 10px; color: #64748b; border-left: 2px solid transparent; border-radius: 0 6px 6px 0; }
body.dark .toc-side a { color: #94a3b8; }
.toc-side a.active { color: #2563eb; border-left-color: #2563eb; background: rgba(37,99,235,.06); font-weight: 700; }
body.dark .toc-side a.active { color: #60a5fa; }

/* 首页 */
.hero { background: linear-gradient(135deg, #0f172a, #1e293b); color: #f8fafc; padding: 56px 0; }
.hero-inner { max-width: 1080px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: minmax(0,1fr) 300px; gap: 40px; align-items: center; }
@media (max-width: 800px) { .hero-inner { grid-template-columns: 1fr; } .hero-cover { max-width: 240px; margin: 0 auto; } }
.hero h1 { font-size: clamp(34px, 6vw, 56px); background: linear-gradient(90deg, #22d3ee, #60a5fa, #a78bfa); -webkit-background-clip: text; background-clip: text; color: transparent; margin: 0; }
.hero p.lead { color: #cbd5e1; font-size: 18px; max-width: 640px; }
.eyebrow { color: #22d3ee; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; font-size: 12px; margin: 0 0 8px; }
.hero-cover { width: 100%; border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,.4); }
.part-group { margin: 28px 0 8px; font-size: 17px; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 10px; }
body.dark .part-group { color: #e2e8f0; }
.part-group::after { content: ""; flex: 1; height: 1px; background: rgba(0,0,0,.08); }
body.dark .part-group::after { background: rgba(255,255,255,.1); }
.chapter-list { list-style: none; padding: 0; margin: 0 0 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 20px; }
@media (max-width: 720px) { .chapter-list { grid-template-columns: 1fr; } }
.chapter-list li a {
  display: flex; gap: 10px; padding: 9px 12px; border-radius: 8px; color: inherit;
  border: 1px solid transparent;
}
.chapter-list li a:hover { background: rgba(37,99,235,.05); border-color: rgba(37,99,235,.15); text-decoration: none; }
.chapter-num { font-family: ui-monospace, monospace; font-size: 12px; font-weight: 800; color: #2563eb; min-width: 26px; padding-top: 2px; }
body.dark .chapter-num { color: #60a5fa; }

/* 搜索 */
.search-box { position: relative; max-width: 620px; margin: 26px auto 0; }
.search-box input {
  width: 100%; padding: 12px 18px; font-size: 15px; border-radius: 12px;
  border: 1.5px solid rgba(0,0,0,.12); background: rgba(255,255,255,.06); color: inherit; outline: none;
}
.search-box input:focus { border-color: #2563eb; }
.search-results {
  position: absolute; left: 0; right: 0; top: calc(100% + 6px); z-index: 120;
  background: #fff; border: 1px solid rgba(0,0,0,.1); border-radius: 12px;
  max-height: 380px; overflow-y: auto; box-shadow: 0 12px 32px rgba(0,0,0,.12); display: none;
}
.search-results[style*="block"] { pointer-events: auto; }
body.dark .search-results { background: #16213a; border-color: rgba(255,255,255,.12); }
.search-results .sr-item { padding: 10px 16px; cursor: pointer; border-bottom: 1px solid rgba(0,0,0,.05); }
.search-results .sr-item:hover { background: rgba(37,99,235,.06); }
.search-results .sr-title { font-weight: 700; font-size: 14px; }
.search-results .sr-snip { font-size: 12.5px; color: #64748b; margin-top: 2px; }
.search-results mark { background: #fde68a; color: #78350f; border-radius: 2px; padding: 0 1px; }

.prevnext { display: flex; justify-content: space-between; gap: 12px; margin-top: 40px; padding-top: 18px; border-top: 1px solid rgba(0,0,0,.08); font-size: 14px; }
body.dark .prevnext { border-top-color: rgba(255,255,255,.1); }
.prevnext a { display: inline-block; padding: 10px 14px; border: 1px solid rgba(0,0,0,.1); border-radius: 10px; color: inherit; }
body.dark .prevnext a { border-color: rgba(255,255,255,.12); }
.prevnext a:hover { border-color: #2563eb; text-decoration: none; }
.prevnext .pn-label { font-size: 11px; color: #94a3b8; display: block; }
footer.page-foot { text-align: center; color: #94a3b8; font-size: 13px; padding: 30px 0 40px; }
@media print {
  .topbar, .toc-side, .prevnext, .copy-btn, .search-box { display: none !important; }
  body { color: #000; }
}
`;

const COMMON_HEAD = (rel, title, desc, path = "") => `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc.replace(/"/g, "&quot;")}">
<meta property="og:title" content="${title.replace(/"/g, "&quot;")}">
<meta property="og:description" content="${desc.replace(/"/g, "&quot;")}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="大模型评估入门">
<meta property="og:image" content="${SITE}/cover.svg">
<link rel="canonical" href="${SITE}/${path}">
<link rel="icon" type="image/svg+xml" href="${rel}favicon.svg">
<link rel="stylesheet" href="${rel}styles.css">
<script>
(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.setAttribute('data-theme','dark');document.addEventListener('DOMContentLoaded',function(){document.body.classList.add('dark');});}}catch(e){}})();
</script>
<style>html[data-theme="dark"] body{background:#0b1224;color:#e2e8f0;}</style>
`;

const TOPBAR = (rel) => `
<header class="topbar">
  <a class="logo" href="${rel}index.html">📚 Eval Handbook</a>
  <nav>
    <a href="${rel}index.html">首页</a>
    <a href="${rel}benchmarks/index.html">评估大全</a>
    <a href="${rel}evals.epub">下载 EPUB</a>
    <button class="dark-toggle" id="themeToggle" type="button" title="切换暗色模式">🌙</button>
  </nav>
</header>
`;

const RUNTIME_JS = `
<script>
// 主题
(function(){
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
})();
// 代码复制（clipboard API 不可用时降级 execCommand）
document.querySelectorAll('.code-block').forEach(function(b){
  var btn=b.querySelector('.copy-btn');
  btn.addEventListener('click',function(){
    var text=b.querySelector('pre').innerText;
    function done(){btn.textContent='已复制 ✓';setTimeout(function(){btn.textContent='复制';},1500);}
    if(navigator.clipboard&&window.isSecureContext){
      navigator.clipboard.writeText(text).then(done);
    }else{
      var ta=document.createElement('textarea');
      ta.value=text;ta.style.position='fixed';ta.style.opacity='0';
      document.body.appendChild(ta);ta.select();
      try{document.execCommand('copy');done();}catch(e){btn.textContent='复制失败';}
      document.body.removeChild(ta);
    }
  });
});
// 自测卡展开
document.querySelectorAll('.quiz-reveal').forEach(function(btn){
  btn.addEventListener('click',function(){btn.closest('.quiz-card').classList.add('open');});
});
// TOC scrollspy
(function(){
  var links=[].slice.call(document.querySelectorAll('.toc-side a'));
  if(!links.length)return;
  var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a;});
  var obs=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){
        links.forEach(function(a){a.classList.remove('active');});
        var a=map[e.target.id];if(a)a.classList.add('active');
      }
    });
  },{rootMargin:'-80px 0px -70% 0px'});
  Object.keys(map).forEach(function(id){var el=document.getElementById(id);if(el)obs.observe(el);});
})();
</script>
`;

const MERMAID_JS = `
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
  mermaid.initialize({ startOnLoad: true, theme: 'neutral', securityLevel: 'loose', fontFamily: 'ui-sans-serif, PingFang SC, sans-serif' });
</script>
`;

// ---------------------------------------------------------------- pages

function sectionHtml(s) {
  if (s.lead) return `<div class="lead-block">${s.html.join("\n")}</div>`;
  const head = `<h2 id="${s.id}">${s.title}</h2>`;
  if (s.quiz) {
    return `<div class="quiz-card">${head}<button class="quiz-reveal" type="button">👆 点击展开自测（先作答再对照）</button><div class="quiz-body">${s.html.join("\n")}</div></div>`;
  }
  return head + s.html.join("\n");
}

function tocSide(sections) {
  const items = sections.filter(s => !s.lead).map(s => `<a href="#${s.id}">${s.title}</a>`).join("");
  return `<aside class="toc-side"><div class="toc-title">本页目录</div>${items}</aside>`;
}

function bookTocSidebar(parts, chaptersMeta, currentFile, currentSections) {
  const out = ['<aside class="book-side" id="bookSide">'];
  out.push(`<a class="side-home" href="../index.html">📚 Eval Handbook</a>`);
  for (const p of parts) {
    out.push(`<div class="side-part">${p.title}</div>`);
    for (const f of p.items) {
      const meta = chaptersMeta[f];
      if (!meta) continue;
      const isCur = f === currentFile;
      const cleanTitle = meta.title.replace(/^\d+\.\s*/, "");
      out.push(`<a class="side-ch${isCur ? " cur" : ""}" href="chapter-${meta.num}.html">${meta.num}. ${cleanTitle}</a>`);
      if (isCur && currentSections) {
        for (const s of currentSections.filter(x => !x.lead)) {
          out.push(`<a class="side-sec" href="#${s.id}" data-sec="${s.id}">${s.title}</a>`);
        }
      }
    }
  }
  out.push("</aside>");
  return out.join("\n");
}

function chapterPage(chapterFile, prev, next, partTitle, chapterNum, searchExtra) {
  const md = readFileSync(join(CHAPTERS_DIR, chapterFile), "utf-8");
  const { title, sections, description } = mdToSections(md);
  const fullTitle = `${title} · 大模型评估入门`;
  const chapterNumPretty = String(Number(chapterNum));
  const body = sections.map(sectionHtml).join("\n");
  const hasMermaid = body.includes('class="mermaid"');
  const prevHref = prev ? `chapter-${prev.num}.html` : null;
  const nextHref = next ? `chapter-${next.num}.html` : null;
  return `${COMMON_HEAD("../", fullTitle, description, `web/chapter-${chapterNum}.html`)}
</head>
<body>
${TOPBAR("../")}
<div class="book-layout">
${bookTocSidebar(globalParts, globalChaptersMeta, chapterFile, sections)}
<div class="drawer-mask" id="drawerMask"></div>
<main class="chapter-main2">
  <div class="breadcrumb"><a href="../index.html">首页</a> / ${partTitle} / <b>第 ${chapterNumPretty} 章</b></div>
  <h1>${title}</h1>
  ${body}
  <nav class="prevnext">
    ${prevHref ? `<a href="${prevHref}"><span class="pn-label">← 上一章</span>${prev.title}</a>` : "<span></span>"}
    ${nextHref ? `<a href="${nextHref}" style="text-align:right"><span class="pn-label">下一章 →</span>${next.title}</a>` : "<span></span>"}
  </nav>
</main>
</div>
<button class="toc-fab" id="tocFab" type="button">☰ 目录</button>
<footer class="page-foot"><a href="${SITE}">evals.zenheart.site</a> · MIT License · ZenHeart</footer>
${RUNTIME_JS}
<script>
(function(){
  // 移动端目录抽屉
  var side=document.getElementById('bookSide'),mask=document.getElementById('drawerMask'),fab=document.getElementById('tocFab');
  if(fab){fab.addEventListener('click',function(){side.classList.add('drawer-open');mask.classList.add('show');});}
  if(mask){mask.addEventListener('click',function(){side.classList.remove('drawer-open');mask.classList.remove('show');});}
  // 侧栏小节滚动高亮
  var secs=[].slice.call(document.querySelectorAll('.side-sec'));
  if(secs.length){
    var map={};secs.forEach(function(a){map[a.getAttribute('data-sec')]=a;});
    var obs=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){
          secs.forEach(function(a){a.classList.remove('active');});
          var a=map[e.target.id];if(a){a.classList.add('active');a.scrollIntoView({block:'nearest'});}
        }
      });
    },{rootMargin:'-70px 0px -75% 0px'});
    Object.keys(map).forEach(function(id){var el=document.getElementById(id);if(el)obs.observe(el);});
  }
})();
</script>
${hasMermaid ? MERMAID_JS : ""}
${searchExtra || ""}
</body>
</html>`;
}

function indexPage(parts, chaptersMeta) {
  const groups = parts.map(p => {
    const items = p.items.map(f => {
      const meta = chaptersMeta[f];
      if (!meta) return "";
      return `<li><a href="web/chapter-${meta.num}.html"><span class="chapter-num">${meta.num}</span><span>${meta.title}</span></a></li>`;
    }).join("");
    return `<div class="part-group">${p.title}</div><ul class="chapter-list">${items}</ul>`;
  }).join("\n");
  const desc = "从前端工程师视角看 Eval。理解厂商报告里的每一行数字、选对合适的基准、从零搭建自己的评估流水线。";
  return `${COMMON_HEAD("", "大模型评估入门 · Eval Handbook", desc, "")}
</head>
<body>
${TOPBAR("")}
<section class="hero">
  <div class="hero-inner">
    <div>
      <p class="eyebrow">ZenHeart · Eval Handbook</p>
      <h1>大模型评估入门</h1>
      <p class="lead">${desc}</p>
      <p class="lead" style="font-size:15px;color:#94a3b8;">${chaptersMeta.__count} 章 · 学术史 → 方法论 → 厂商报告拆解 → 框架实战</p>
    </div>
    <img class="hero-cover" src="cover.svg" alt="大模型评估入门封面" loading="eager">
  </div>
</section>
<main style="max-width:1080px;margin:0 auto;padding:32px 24px 80px;">
  <div class="search-box">
    <input id="searchInput" type="search" placeholder="🔍 搜索全书：如 SWE-bench、置信区间、LLM-as-Judge…" autocomplete="off" aria-label="搜索全书">
    <div class="search-results" id="searchResults"></div>
  </div>
  ${groups}
  <p style="margin-top:32px;"><a href="evals.epub" download>⬇️ 下载 EPUB 离线版</a> · <a href="https://github.com/zenHeart/evals" target="_blank" rel="noopener">GitHub 源码</a></p>
</main>
<footer class="page-foot">由 GitHub Actions 自动构建部署 · © 2026 ZenHeart · MIT License</footer>
${RUNTIME_JS}
<script src="search-data.js"></script>
<script>
(function(){
  var input=document.getElementById('searchInput');
  var box=document.getElementById('searchResults');
  var data=window.EVALS_SEARCH||[];
  function esc(s){return s.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function hl(s,q){var i=s.toLowerCase().indexOf(q.toLowerCase());if(i<0)return esc(s);return esc(s.slice(0,60> i?0:i-40))+'<mark>'+esc(s.slice(i,i+q.length))+'</mark>'+esc(s.slice(i+q.length,i+q.length+80));}
  input.addEventListener('input',function(){
    var q=input.value.trim();
    if(q.length<1){box.style.display='none';return;}
    var ql=q.toLowerCase();
    var hits=[];
    for(var i=0;i<data.length&&hits.length<12;i++){
      var d=data[i];
      var ti=d.t.toLowerCase().indexOf(ql);
      var ci=d.c.toLowerCase().indexOf(ql);
      if(ti>=0||ci>=0){
        hits.push({t:d.t,part:d.p,num:d.n,url:d.u,snip:ci>=0?d.c.slice(Math.max(0,ci-40),ci+90):null,ti:ti});
      }
    }
    hits.sort(function(a,b){return (a.ti<0?999:a.ti)-(b.ti<0?999:b.ti);});
    if(!hits.length){box.innerHTML='<div class="sr-item"><div class="sr-snip">无匹配结果</div></div>';box.style.display='block';return;}
    box.innerHTML=hits.map(function(h){
      return '<div class="sr-item" data-u="'+h.url+'">'+
        '<div class="sr-title">'+hl(h.t,q)+' <span style="color:#94a3b8;font-weight:400">· '+h.part+' 第 '+h.num+' 章</span></div>'+
        (h.snip?'<div class="sr-snip">…'+esc(h.snip)+'…</div>':'')+'</div>';
    }).join('');
    box.style.display='block';
  });
  box.addEventListener('click',function(e){
    var it=e.target.closest('.sr-item');
    if(it&&it.getAttribute('data-u'))location.href=it.getAttribute('data-u');
  });
  document.addEventListener('click',function(e){if(!e.target.closest('.search-box'))box.style.display='none';});
})();
</script>
</body>
</html>`;
}

function researchPage(mdFile, title, rel) {
  if (!existsSync(mdFile)) return null;
  const md = readFileSync(mdFile, "utf-8");
  const { sections, description } = mdToSections(md);
  const body = sections.map(sectionHtml).join("\n");
  const hasMermaid = body.includes('class="mermaid"');
  return `${COMMON_HEAD(rel, `${title} · 大模型评估入门`, description || title, `research/${mdFile.split(/[\\/]/).pop().replace(/\.md$/, ".html")}`)}
</head>
<body>
${TOPBAR(rel)}
<div class="layout">
<main class="chapter-main">
  <div class="breadcrumb"><a href="${rel}index.html">首页</a> / <b>${title}</b></div>
  <h1>${title}</h1>
  ${body}
</main>
${tocSide(sections)}
</div>
<footer class="page-foot"><a href="${SITE}">evals.zenheart.site</a> · MIT License · ZenHeart</footer>
${RUNTIME_JS}
${hasMermaid ? MERMAID_JS : ""}
</body>
</html>`;
}

// ---------------------------------------------------------------- main

async function main() {
  mkdirSync(join(DIST, "web"), { recursive: true });
  mkdirSync(join(DIST, "research"), { recursive: true });

  writeFileSync(join(DIST, "styles.css"), CSS, "utf-8");
  writeFileSync(join(DIST, "favicon.svg"), FAVICON, "utf-8");
  if (existsSync(join(COVER_DIR, "cover.svg"))) {
    copyFileSync(join(COVER_DIR, "cover.svg"), join(DIST, "cover.svg"));
  }

  const parts = readPartStructure();
  const flat = readFlatChapters(parts);
  globalParts = parts;

  // chapters meta
  const chaptersMeta = { __count: flat.length };
  for (const f of flat) {
    const num = f.match(/^chapter-(\d+)/)?.[1] || "00";
    const md = readFileSync(join(CHAPTERS_DIR, f), "utf-8");
    const t = (md.match(/^#\s+(.+)$/m)?.[1] || f).replace(/^0\.\s*/, "");
    chaptersMeta[f] = { num, title: t };
  }
  globalChaptersMeta = chaptersMeta;

  // chapter pages (with breadcrumb part titles)
  const chapterToPart = new Map();
  for (const p of parts) for (const f of p.items) chapterToPart.set(f, p.title);

  const searchData = [];
  for (let idx = 0; idx < flat.length; idx++) {
    const f = flat[idx];
    const num = chaptersMeta[f].num;
    const prev = idx > 0 ? { file: flat[idx - 1], ...chaptersMeta[flat[idx - 1]] } : null;
    const next = idx < flat.length - 1 ? { file: flat[idx + 1], ...chaptersMeta[flat[idx + 1]] } : null;
    const html = chapterPage(f, prev, next, chapterToPart.get(f) || "", num);
    writeFileSync(join(DIST, "web", `chapter-${num}.html`), html, "utf-8");

    // search index（保留连字符：保证 "SWE-bench" 可搜；正文全量入索引）
    const md = readFileSync(join(CHAPTERS_DIR, f), "utf-8");
    const plain = stripMd(md.replace(/```[\s\S]*?```/g, " ").replace(/[#>*|`[\]]/g, " ").replace(/\s+/g, " "));
    searchData.push({
      n: num,
      t: chaptersMeta[f].title,
      p: (chapterToPart.get(f) || "").replace(/^第 \d+ 部分：/, ""),
      u: `web/chapter-${num}.html`,
      c: plain,
    });
  }
  console.log(`[evals-web] Built ${flat.length} chapter pages`);

  // index
  writeFileSync(join(DIST, "index.html"), indexPage(parts, chaptersMeta), "utf-8");
  writeFileSync(join(DIST, "search-data.js"), `window.EVALS_SEARCH=${JSON.stringify(searchData)};`, "utf-8");
  console.log("[evals-web] Built index.html + search-data.js");

  // research/*.md 仅作为书籍素材源文件保留在仓库，不再发布为站点页面
  rmSync(join(DIST, "research"), { recursive: true, force: true });

  console.log(`[evals-web] Web build complete → ${DIST}`);

  // 评估体系汇集站
  try {
    await import("./build-benchmarks-hub.mjs");
  } catch (e) {
    console.warn("[evals-web] benchmarks hub build skipped:", e.message);
  }
}

main();
