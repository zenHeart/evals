import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {canonicalURL,mergeCandidates,discoverLinks,classifyTitle} from '../scripts/release-discovery.mjs';
import {buildCandidate,scanEntry} from '../.claude/skills/ingest-releases/scripts/scan.mjs';
import {computeWindow,planCommit,daysAgo,ledgerDates,ledgerFileCount,OVERLAP_DAYS,FIRST_RUN_FALLBACK_DAYS} from '../.claude/skills/ingest-releases/scripts/checkpoint.mjs';
const NOW='2026-11-24T00:00:00.000Z';
const ok=html=>({status:200,ok:true,text:async()=>html});
const hop=(status,location)=>({status,ok:false,headers:{get:()=>location}});
const readJSON=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf-8'));

test('canonicalURL 只剥噪声，保留 id 寻址与尾斜杠归一',()=>{
 assert.equal(canonicalURL('https://www.example.com/model/?utm_source=a&id=x&utm_medium=b#frag'),'https://example.com/model?id=x');
 assert.equal(canonicalURL('https://EXAMPLE.com/a/'),'https://example.com/a');
 assert.equal(canonicalURL('https://example.com/'),'https://example.com/');
});

test('候选按规范 URL 去重：不覆写回填状态、按 id 有序、可重复执行',()=>{
 const kept={id:'z',official_urls:['https://www.example.com/m?id=x'],release_id:'r',exclusion_reason:null,next_backfill_at:'2026-11-01'};
 const dupe={id:'a',official_urls:['https://example.com/m?id=x'],release_id:null,exclusion_reason:'新发现'};
 assert.deepEqual(mergeCandidates([kept],[dupe]),[kept],'同规范 URL 的第二条候选不得覆盖既有 release/排除原因');
 const two=mergeCandidates([dupe],[kept,{id:'m',official_urls:['https://example.com/n']}]);
 assert.deepEqual(two.map(c=>c.id),['a','m'],'输出按 id 排序');
 assert.deepEqual(mergeCandidates(two,[]),two,'空增量不改变账本');
});

test('标题分类四态可预期，未登记家族名不猜 general',()=>{
 assert.equal(classifyTitle('Introducing Gemini 4 Neon'),'general');
 assert.equal(classifyTitle('GPT-6.2'),'general');
 assert.equal(classifyTitle('MAI Code 2'),'vertical');
 assert.equal(classifyTitle('Claude Code desktop app'),'product','产品词优先于模型词');
 assert.equal(classifyTitle('Introducing Inkling 2 Mini'),'unknown','词表外家族名不得凭直觉升格');
 assert.equal(classifyTitle('Some unrelated page'),'unknown');
 // 已知误判：标题含 Images 的模型发布页被判 product 并自动写排除原因。
 // 矫正在 references/discovery-channels.md 有记载——分类结果不可单独作为排除依据，
 // 需回看页面是否给出新模型 id 与定价，再人工改判 vertical / 清 exclusion_reason。
 // 这里锁定现状，改动正则即等于改变全账本的自动排除口径，必须同步该文档。
 assert.equal(classifyTitle('Introducing Images 2.6'),'product');
});

test('链接发现只留关键词链接：泛标题回落 slug，非 HTTPS 与工具页剔除',()=>{
 const html='<a href="/blog/introducing-gemini-4">Introducing Gemini 4</a>'
  +'<a href="/news/introducing-inkling-2-mini">Read more</a>'
  +'<a href="http://cdn.example.com/introducing-gpt">Introducing GPT</a>'
  +'<a href="/login?next=introducing-gpt">Sign in</a>'
  +'<a href="/download/introducing-gpt">Download</a>'
  +'<a href="/about-us">About us</a>'
  +'<a href="/q?x=1&amp;y=2">Announcing Qwen</a>';
 assert.deepEqual(discoverLinks(html,'https://blog.google/'),[
  {url:'https://blog.google/blog/introducing-gemini-4',title:'Introducing Gemini 4'},
  {url:'https://blog.google/news/introducing-inkling-2-mini',title:'Introducing Inkling 2 Mini'},
  {url:'https://blog.google/q?x=1&y=2',title:'Announcing Qwen'}]);
 assert.deepEqual(discoverLinks('<a href="/x">Bad</a','https://blog.google/'),[],'残缺标签不崩');
});

test('候选形状：id 由规范 URL 派生，product 自动带排除原因且不再排回填',()=>{
 const c=buildCandidate('openai',{url:'https://www.openai.com/index/introducing-gpt-6-2/?utm_source=x',title:'GPT-6.2'},NOW);
 const want='openai-'+crypto.createHash('sha256').update(canonicalURL('https://openai.com/index/introducing-gpt-6-2')).digest('hex').slice(0,12);
 assert.equal(c.id,want,'id 只依赖规范 URL，与营销参数无关');
 assert.equal(c.classification,'general');
 assert.equal(c.exclusion_reason,null);
 assert.equal(c.next_backfill_at,'2026-11-24');
 assert.equal(c.official_source_verified,false,'发现链接不等于已核验模型');
 assert.equal(c.discovery_status,'discovered');
 assert.equal(c.release_id,null);
 const p=buildCandidate('openai',{url:'https://openai.com/index/chatgpt-search/',title:'ChatGPT search'},NOW);
 assert.equal(p.classification,'product');
 assert.ok(p.exclusion_reason.length>0);
 assert.equal(p.next_backfill_at,null,'排除项不再排回填');
});

test('扫描跟随重定向但每跳校验 allowlist，越界即判不可达且不产候选',async()=>{
 const vendor={vendor_id:'v',allowed_hosts:['www.example.com','example.com']};
 const direct={url:'https://example.com/news',status:'not_scanned'};
 const seen=[];
 const r=await scanEntry(vendor,direct,{fetchImpl:async(u,o)=>{seen.push([u,o.redirect]);return ok('<a href="/introducing-gemini-4">Introducing Gemini 4</a><a href="https://other.org/introducing-gpt">Introducing GPT</a>');},now:NOW});
 assert.deepEqual(seen,[['https://example.com/news','manual']],'默认手动跟随，不由 fetch 自动跳');
 assert.equal(direct.status,'partial');
 assert.equal(direct.canonical_url,undefined,'无重定向不写 canonical_url');
 assert.equal(direct.content_sha256,crypto.createHash('sha256').update('<a href="/introducing-gemini-4">Introducing Gemini 4</a><a href="https://other.org/introducing-gpt">Introducing GPT</a>').digest('hex'));
 assert.equal(r.candidates.length,1,'站外链接被 allowlist 滤掉');
 const jumped={url:'https://www.example.com/news',status:'not_scanned'};
 const r2=await scanEntry(vendor,jumped,{fetchImpl:async u=>u==='https://www.example.com/news'?hop(301,'https://example.com/news'):ok('<a href="/introducing-gemini-4">Introducing Gemini 4</a>'),now:NOW});
 assert.equal(jumped.canonical_url,'https://example.com/news');
 assert.equal(jumped.status,'partial');
 assert.equal(r2.candidates.length,1);
 const escape={url:'https://example.com/news',status:'not_scanned'};
 const r3=await scanEntry(vendor,escape,{fetchImpl:async()=>hop(302,'https://evil.example.org/x'),now:NOW});
 assert.equal(escape.status,'inaccessible');
 assert.equal(escape.failure_reason,'redirect host outside official allowlist');
 assert.deepEqual(r3.candidates,[]);
 const offlist={url:'https://other.org/news',status:'not_scanned'};
 const r4=await scanEntry(vendor,offlist,{fetchImpl:async()=>{throw Error('不应发起请求');},now:NOW});
 assert.equal(r4.entry.failure_reason,'redirect host outside official allowlist','入口自身越界也不请求');
});

test('扫描失败三类归因：HTTP 错误、无链接需渲染、网络异常',async()=>{
 const vendor={vendor_id:'v',allowed_hosts:['example.com']};
 const http={url:'https://example.com/news',status:'not_scanned'};
 assert.equal((await scanEntry(vendor,http,{fetchImpl:async()=>({status:404,ok:false,text:async()=>''}),now:NOW})).entry.failure_reason,'HTTP 404');
 assert.equal(http.status,'inaccessible');
 const render={url:'https://example.com/news',status:'not_scanned'};
 const r=await scanEntry(vendor,render,{fetchImpl:async()=>ok('<html><body>nothing here</body></html>'),now:NOW});
 assert.equal(render.status,'needs_render');
 assert.ok(render.failure_reason.includes('渲染'),'需渲染不等于没有模型');
 assert.deepEqual(r.candidates,[]);
 const net={url:'https://example.com/news',status:'not_scanned'};
 assert.equal((await scanEntry(vendor,net,{fetchImpl:async()=>{throw Error('fetch failed');},now:NOW})).entry.failure_reason,'fetch failed');
 const loop={url:'https://example.com/a',status:'not_scanned'};
 assert.equal((await scanEntry(vendor,loop,{fetchImpl:async()=>hop(302,'https://example.com/b'),maxRedirects:2,now:NOW})).entry.failure_reason,'HTTP 302','超过跳数上限按最后一次响应报错');
 const noloc={url:'https://example.com/a',status:'not_scanned'};
 assert.equal((await scanEntry(vendor,noloc,{fetchImpl:async()=>hop(302,null),now:NOW})).entry.failure_reason,'HTTP 302','缺 location 头不无限跟随');
});

test('增量窗口：检查点锚点优先、账本兜底、首运行 90 天、重叠 14 天',()=>{
 const base=computeWindow({today:'2026-11-24',dates:['2026-11-12','2026-10-30'],count:2,checkpoint:{last_scan_at:'2026-11-15',last_max_release_date:'2026-11-12'}});
 assert.equal(base.window_since,'2026-10-29');
 assert.equal(base.window_until,'2026-11-24');
 assert.equal(base.overlap_days,OVERLAP_DAYS);
 assert.equal(base.first_run,false);
 assert.equal(base.last_scan_at,'2026-11-15');
 assert.equal(base.ledger_max_release_date,'2026-11-12');
 assert.equal(base.official_release_count,2);
 const ahead=computeWindow({today:'2026-11-24',dates:['2026-11-01'],checkpoint:{last_max_release_date:'2026-11-12'}});
 assert.equal(ahead.window_since,'2026-10-29','检查点领先账本时仍按检查点算，避免窗口回退');
 const ledgerOnly=computeWindow({today:'2026-11-24',dates:['2026-03-05']});
 assert.equal(ledgerOnly.window_since,'2026-02-19','无检查点用账本最大发布日');
 const badAnchor=computeWindow({today:'2026-11-24',dates:['2026-11-20'],checkpoint:{last_max_release_date:'2026-1-2'}});
 assert.equal(badAnchor.window_since,'2026-11-06','非法锚点回退到账本');
 const first=computeWindow({today:'2026-11-24',dates:[],count:0,checkpoint:null});
 assert.equal(first.first_run,true);
 assert.equal(first.window_since,daysAgo('2026-11-24',FIRST_RUN_FALLBACK_DAYS));
 assert.equal(first.ledger_max_release_date,null);
 assert.ok(first.note.includes(String(FIRST_RUN_FALLBACK_DAYS)));
 assert.equal(daysAgo('2026-01-10',14),'2025-12-27','跨年不退错');
 assert.equal(daysAgo('2024-03-01',1),'2024-02-29','闰日不退错');
});

test('commit 计划：锚点单调不回退，非 ISO 与越界日期拒绝',()=>{
 const p=planCommit({value:'2026-11-20',ledgerMax:'2026-11-20',prev:{},today:'2026-11-24'});
 assert.equal(p.checkpoint.last_scan_at,'2026-11-24');
 assert.equal(p.checkpoint.last_max_release_date,'2026-11-20');
 assert.equal(p.coverage.window_since,'2026-11-06');
 assert.equal(p.coverage.window_until,'2026-11-24');
 assert.equal(planCommit({value:'2026-11-01',ledgerMax:'2026-11-20',prev:{last_max_release_date:'2026-11-20'},today:'2026-11-24'}).checkpoint.last_max_release_date,'2026-11-20','小批量入库不得把锚点推回去漏窗口');
 assert.equal(planCommit({value:'2026-11-20',ledgerMax:'2026-11-20',prev:{last_max_release_date:'2026-11-01'},today:'2026-11-24'}).checkpoint.last_max_release_date,'2026-11-20','有新发布照常前进');
 assert.equal(planCommit({value:'2026-11-20',ledgerMax:'2026-11-20',prev:{last_max_release_date:'oops'},today:'2026-11-24'}).checkpoint.last_max_release_date,'2026-11-20','旧锚点非法时忽略');
 for(const bad of [null,'','2026-11-2','2026/11/20',undefined])assert.throws(()=>planCommit({value:bad,ledgerMax:null,prev:{},today:'2026-11-24'}),/用法: checkpoint\.mjs commit/,'拒绝 '+String(bad));
 assert.throws(()=>planCommit({value:'2026-12-01',ledgerMax:'2026-11-20',prev:{},today:'2026-11-24'}),/大于账本现有最大 release_date/,'锚点必须在账本中可兑现');
});

test('账本日期扫描排除 manifest 与非 ISO 日期，可递归',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ingest-ledger-'));
 fs.mkdirSync(path.join(dir,'2026-11'));
 fs.writeFileSync(path.join(dir,'a.json'),JSON.stringify({release_date:'2026-11-12'}));
 fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify({release_date:'1999-01-01'}));
 fs.writeFileSync(path.join(dir,'b.json'),JSON.stringify({release_date:'2026-11'}));
 fs.writeFileSync(path.join(dir,'c.json'),'{oops');
 fs.writeFileSync(path.join(dir,'note.txt'),'x');
 fs.writeFileSync(path.join(dir,'2026-11','d.json'),JSON.stringify({release_date:'2026-10-30'}));
 assert.deepEqual(ledgerDates(dir).sort(),['2026-10-30','2026-11-12'],'月精度与坏 JSON 不进窗口锚点');
 assert.equal(ledgerFileCount(dir),4,'manifest 不计入，坏 JSON 仍算在档位数里');
 assert.deepEqual(ledgerDates(path.join(dir,'missing')),[]);
 assert.equal(ledgerFileCount(path.join(dir,'missing')),0);
 fs.rmSync(dir,{recursive:true,force:true});
});

test('真实检查点锚点可在账本兑现，覆盖页窗口与检查点同口径',()=>{
 const coverage=readJSON('../data/model-coverage.json'),checkpoint=readJSON('../data/generated/ingest-checkpoint.json');
 const dates=ledgerDates();assert.ok(dates.length>0);
 const ledgerMax=dates.sort().pop();
 assert.ok(checkpoint.last_max_release_date,'检查点必须记录锚点');
 assert.ok(checkpoint.last_max_release_date<=ledgerMax,'锚点不得领先账本最大 release_date');
 assert.equal(coverage.window_since,daysAgo(checkpoint.last_max_release_date,OVERLAP_DAYS),'覆盖页窗口起点必须与锚点同口径，漏写会让页面长期显示上一批窗口');
 assert.equal(coverage.window_until,checkpoint.last_scan_at.slice(0,10),'覆盖页窗口终点必须是上次扫描日');
});

test('真实候选账本无重复规范 URL，去重可重复执行',()=>{
 const c=readJSON('../data/model-coverage.json').candidates;
 assert.equal(new Set(c.map(x=>x.id)).size,c.length,'候选 id 不得重复');
 const keys=c.map(x=>canonicalURL(x.official_urls[0]));
 assert.equal(new Set(keys).size,keys.length,'同一模型不得因噪声参数重复入账');
 assert.deepEqual(mergeCandidates(c,c),c,'重复合并不改变账本内容与顺序');
});
