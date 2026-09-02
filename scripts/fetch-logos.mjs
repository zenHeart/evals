import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

// 重新抓取厂商 logo 时运行：node scripts/fetch-logos.mjs（在仓库根目录）
// 官方 favicon 优先，被反爬的域回退 Google S2 真实品牌标（PNG 128px）
const OUT = "assets/logos";
fs.mkdirSync(OUT, { recursive: true });

// vendor_id → 候选官方域名（按优先级）
const DOMAINS = {
  openai: ["openai.com"],
  anthropic: ["www.anthropic.com", "anthropic.com"],
  google: ["gemini.google.com", "blog.google", "deepmind.google"],
  xai: ["x.ai"],
  meta: ["www.meta.com", "ai.meta.com", "meta.ai"],
  mistral: ["mistral.ai"],
  kimi: ["www.kimi.com", "kimi.moonshot.cn", "moonshot.cn"],
  deepseek: ["chat.deepseek.com", "api-docs.deepseek.com", "www.deepseek.com"],
  glm: ["z.ai", "chat.z.ai", "docs.z.ai"],
  minimax: ["www.minimax.io", "platform.minimax.io", "minimax.io"],
  qwen: ["chat.qwen.ai", "qwen.ai", "qwenlm.github.io"],
  doubao: ["www.doubao.com", "team.doubao.com"],
  xiaomi: ["www.mi.com", "hyperos.mi.com"],
  tencent: ["hy.tencent.com", "cloud.tencent.com", "www.tencent.com"],
  stepfun: ["stepfun.ai", "www.stepfun.com", "platform.stepfun.com"],
  microsoft: ["www.microsoft.com", "microsoft.ai"],
};

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

function curl(url, out, extra = "") {
  try {
    execSync(`curl -sL --max-time 20 -A "${UA}" ${extra} -o "${out}" "${url}"`, { stdio: "pipe" });
    const sz = fs.existsSync(out) ? fs.statSync(out).size : 0;
    return sz > 500 ? sz : 0;
  } catch { return 0; }
}

function headIcons(html, base) {
  const icons = [];
  for (const m of html.matchAll(/<link[^>]+rel="[^"]*(apple-touch-icon|icon|shortcut icon)[^"]*"[^>]*>/gi)) {
    const tag = m[0];
    const href = (tag.match(/href="([^"]+)"/) || [])[1];
    const size = (tag.match(/sizes="(\d+)x(\d+)"/) || [])[1];
    if (!href) continue;
    icons.push({ href: href.startsWith("http") ? href : new URL(href, base).href, size: size ? parseInt(size) : (tag.includes("apple-touch") ? 180 : 32) });
  }
  // og:image 兜底（品牌方通常用彩色 logo 图）
  const og = (html.match(/property="og:image"[^>]*content="([^"]+)"/) || html.match(/content="([^"]+)"[^>]*property="og:image"/) || [])[1];
  if (og) icons.push({ href: og.startsWith("http") ? og : new URL(og, base).href, size: 200, og: true });
  return icons.sort((a, b) => b.size - a.size);
}

const report = [];
for (const [vid, domains] of Object.entries(DOMAINS)) {
  let done = false;
  for (const dom of domains) {
    if (done) break;
    const base = `https://${dom}`;
    const tmpHtml = `${OUT}/_${vid}.html`;
    let sz = curl(base, tmpHtml, "-H 'Accept: text/html'");
    let candidates = [];
    if (sz > 0) {
      const html = fs.readFileSync(tmpHtml, "utf-8").slice(0, 200000);
      candidates = headIcons(html, base);
    }
    fs.rmSync(tmpHtml, { force: true });
    // 试 apple-touch / 大尺寸 icon
    for (const c of candidates) {
      if (c.og) continue; // og 常为长图，最后再用
      const ext = c.href.split("?")[0].endsWith(".png") ? "png" : (c.href.includes(".svg") ? "svg" : "png");
      const out = `${OUT}/${vid}.${ext}`;
      const got = curl(c.href, out);
      if (got > 300) { report.push([vid, c.href, got, ext]); done = true; break; }
    }
    if (done) break;
    // favicon.ico 兜底
    const ico = `${OUT}/${vid}.png`;
    const got = curl(`${base}/favicon.ico`, ico);
    if (got > 300) { report.push([vid, `${base}/favicon.ico`, got, "png"]); done = true; break; }
  }
  if (!done) {
    // Google favicon 服务兜底（真实品牌标，128px）
    const out = `${OUT}/${vid}.png`;
    const got = curl(`https://www.google.com/s2/favicons?domain=${domains[0]}&sz=128`, out);
    report.push([vid, got > 100 ? `google-s2(${domains[0]})` : "FAILED", got, "png"]);
  }
}
for (const [vid, src, size, ext] of report) console.log(`${vid.padEnd(10)} ${String(size).padStart(6)}B  ${ext}  ${src}`);
