import fs from 'node:fs';

// --- m3: YC-Bench upgrade from not_extracted to reported 2.10M USD
{
  const P = 'data/model-releases/official/minimax/minimax-m3.json';
  const j = JSON.parse(fs.readFileSync(P, 'utf8'));
  const e = j.benchmark_evidence.find(e => e.id.endsWith('--yc-bench'));
  e.reported_score = { value: 2100000, display: '2.10M', unit: 'usd', metric: 'usd_fund', score_status: 'reported' };
  e.notes += ' 2026-09-01 audit: value upgraded from not_extracted to reported (cell reads 2.10M = 2,100,000 USD final assets); unit corrected percent -> usd to match metric usd_fund.';
  fs.writeFileSync(P, JSON.stringify(j, null, 1) + '\n');
  console.log('m3 yc-bench patched');
}

// --- m2: BrowseComp display cell-exact (chart prints 44.0)
{
  const P = 'data/model-releases/official/minimax/minimax-m2.json';
  const j = JSON.parse(fs.readFileSync(P, 'utf8'));
  const e = j.benchmark_evidence.find(e => e.id.endsWith('--browsecomp'));
  e.reported_score.display = '44.0';
  e.notes = (e.notes || '') + ' 2026-09-01 audit: display aligned to chart cell text "44.0" (images/12.png).';
  j.last_verified_at = '2026-09-01';
  j.notes = (j.notes ? j.notes + ' ' : '') + '2026-09-01 audit: all 8 panels of images/12.png re-read (vision) and matched cell-by-cell; AA chart 13.png re-read (M2 61, rank 5 of 24 bars). No missing benchmark item found - page has exactly these 8 panels plus the AA prose claim.';
  fs.writeFileSync(P, JSON.stringify(j, null, 1) + '\n');
  console.log('m2 browsecomp display patched');
}
