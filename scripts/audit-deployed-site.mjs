import http from 'node:https';

async function auditSite() {
  console.log('Fetching sitemap.xml from https://evals.zenheart.site/sitemap.xml ...');
  const sitemapRes = await fetch('https://evals.zenheart.site/sitemap.xml');
  if (!sitemapRes.ok) throw new Error(`Failed to fetch sitemap: ${sitemapRes.status}`);
  const sitemapXml = await sitemapRes.text();
  const urls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  console.log(`Found ${urls.length} URLs in sitemap. Auditing all pages with concurrency...`);

  const concurrency = 20;
  let index = 0;
  const badPages = [];
  const linkSet = new Set();

  async function worker() {
    while (index < urls.length) {
      const i = index++;
      const u = urls[i];
      try {
        const r = await fetch(u, { headers: { 'User-Agent': 'EvalsSiteAuditor/1.0' } });
        if (r.status !== 200) {
          badPages.push({ url: u, status: r.status });
          console.error(`BAD PAGE [${r.status}]: ${u}`);
        } else {
          const html = await r.text();
          const hrefRegex = /href=["'](.*?)["']/g;
          let match;
          while ((match = hrefRegex.exec(html)) !== null) {
            const href = match[1];
            if (href && !href.startsWith('javascript:') && !href.startsWith('mailto:') && !href.startsWith('data:')) {
              linkSet.add(href);
            }
          }
        }
      } catch (e) {
        badPages.push({ url: u, error: e.message });
      }
      if (i % 100 === 0 || i === urls.length - 1) {
        console.log(`Page scan progress: ${i + 1}/${urls.length}`);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  console.log(`Page scan complete. Bad pages: ${badPages.length}`);
  console.log(`Unique hrefs found: ${linkSet.size}`);

  const internalHrefs = [...linkSet].filter(h => h.startsWith('/') || h.startsWith('https://evals.zenheart.site'));
  console.log(`Internal hrefs to verify: ${internalHrefs.length}`);

  let badInternal = 0;
  let verified = 0;
  const hrefConcurrency = 25;
  let hrefIdx = 0;

  async function hrefWorker() {
    while (hrefIdx < internalHrefs.length) {
      const j = hrefIdx++;
      const h = internalHrefs[j];
      const full = h.startsWith('/') ? 'https://evals.zenheart.site' + h : h;
      const cleanUrl = full.split('#')[0];
      try {
        const r = await fetch(cleanUrl, { method: 'HEAD', headers: { 'User-Agent': 'EvalsSiteAuditor/1.0' } });
        if (r.status !== 200 && r.status !== 301 && r.status !== 302 && r.status !== 308) {
          console.error(`BROKEN INTERNAL LINK [${r.status}]: ${full}`);
          badInternal++;
        } else {
          verified++;
        }
      } catch (err) {
        console.error(`INTERNAL LINK ERROR: ${full} -> ${err.message}`);
        badInternal++;
      }
      if (j % 200 === 0 || j === internalHrefs.length - 1) {
        console.log(`Href check progress: ${j + 1}/${internalHrefs.length}`);
      }
    }
  }

  await Promise.all(Array.from({ length: hrefConcurrency }, () => hrefWorker()));

  console.log(`Audit finished.`);
  console.log(`- Sitemap pages scanned: ${urls.length}, Bad pages: ${badPages.length}`);
  console.log(`- Internal links checked: ${internalHrefs.length}, Verified: ${verified}, Bad: ${badInternal}`);

  if (badPages.length > 0 || badInternal > 0) {
    process.exitCode = 1;
  }
}

auditSite().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
