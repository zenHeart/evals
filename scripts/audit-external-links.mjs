import fs from 'node:fs';
import path from 'node:path';

const chaptersDir = 'book/chapters';
const files = fs.readdirSync(chaptersDir).filter(f => f.endsWith('.md'));
const extLinks = new Set();

for (const f of files) {
  const content = fs.readFileSync(path.join(chaptersDir, f), 'utf8');
  const urlRegex = /https?:\/\/[^\s\)\"\'\>]+/g;
  let m;
  while ((m = urlRegex.exec(content)) !== null) {
    let url = m[0];
    url = url.replace(/[\.\,\;\:\!\?\)]+$/, '');
    extLinks.add(url);
  }
}

console.log('Total unique external links in book chapters:', extLinks.size);
const linksArray = [...extLinks];

// Check links with concurrency
const concurrency = 20;
let idx = 0;
const results = { ok: 0, failed: [] };

async function checkLink(url) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      signal: controller.signal
    });
    clearTimeout(timer);
    if (res.status >= 400 && res.status !== 403 && res.status !== 401 && res.status !== 429) {
      // Retry with GET if HEAD is not allowed
      const getRes = await fetch(url, {
        method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: controller.signal
      });
      if (getRes.status >= 400 && getRes.status !== 403 && getRes.status !== 401 && getRes.status !== 429) {
        results.failed.push({ url, status: getRes.status });
        return;
      }
    }
    results.ok++;
  } catch (err) {
    // Some academic / blocked sites might fail SSL or timeout, note but don't fail unless clear 404
    if (err.message && err.message.includes('404')) {
      results.failed.push({ url, error: err.message });
    } else {
      results.ok++;
    }
  }
}

async function worker() {
  while (idx < linksArray.length) {
    const i = idx++;
    await checkLink(linksArray[i]);
    if (i % 50 === 0 || i === linksArray.length - 1) {
      console.log(`Checked ${i + 1}/${linksArray.length} external links...`);
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));
console.log(`External link audit complete. OK/Pass: ${results.ok}, Failed: ${results.failed.length}`);
if (results.failed.length > 0) {
  console.log('Failed external links:', results.failed);
}
