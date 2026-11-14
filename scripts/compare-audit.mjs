/**
 * compare-audit.mjs — /choose/ 对照可靠性自检（构建期与测试共用；`node scripts/compare-audit.mjs` 打印报告）。
 *
 * 要抓的是「官方明明给了数值，对照里却按 0 计 / 被悄悄丢掉」这一类机械错误：
 *   1. undecided  目录里有官方数值、但既没有 use-case 声明、也没有档案上下界、也没有登记表决定的评估（换算规则漏写）；
 *   2. stranded   可计分评估上，官方数值因单位 / 指标写法对不上而不计分，且这种写法没有在登记表里核对过（同义写法漏收）；
 *   3. orphans    记录的评估 id 既没有评估档案、也没有别名、也没有在登记表 unmapped_ids 里说明（id 对不上）；
 *   4. stalemates 两个模型在某领域都有可计分的官方数值，综合分却双双为 0（「分不出高下」）的对照组。
 * 1–3 必须为空；4 只统计并逐条给出原因（版本 / 测试条件不同等真实原因允许存在）。
 */
import {headToHead,rowIssue} from './model-compare.mjs';
import {compareData} from './build-model-pages.mjs';

const official=e=>e.status==='verified'&&e.score_status==='reported'&&Number.isFinite(e.value)&&e.attribution!=='comparison_cited';
const norm=s=>String(s||'').trim().toLowerCase().replace(/\s+/g,' ');

export function auditCompare(db,{pairs=true}={}){
  const cmp=compareData(db);
  const rules=db.compareRules||{};
  const reviewed=rules.reviewed_metric_mismatch||{};
  const entityIds=new Set(db.benchmarks.map(b=>b.id));
  const undecided=[],stranded=[],orphans=[],stalemates={},counted={},excluded={};
  for(const [d,u] of Object.entries(cmp.useCases)){
    const cat=Object.fromEntries(u.catalog.map(c=>[c.id,c]));
    const rowsOf=id=>cmp.models.flatMap(m=>m.evidence.filter(e=>e.benchmark_id===id&&official(e)).map(e=>({m,e})));
    for(const c of u.catalog){
      const rows=rowsOf(c.id);if(!rows.length)continue;
      if(!c.eligible){
        // 没有任何明确决定（只是档案没写上下界）= 换算规则漏写
        if(/没有写明固定上下界|多个可换算指标/.test(c.reason||''))undecided.push({domain:d,bench:c.id,rows:rows.length,reason:c.reason});
        continue;
      }
      for(const {m,e} of rows){
        const issue=rowIssue(e,c.rule);
        if(!issue){counted[d]=(counted[d]||0)+1;continue;}
        const ok=(reviewed[c.id]?.labels||[]).map(norm).includes(norm(e.metric))||/超出换算范围/.test(issue)&&reviewed[c.id]?.out_of_range;
        if(ok){excluded[d]=(excluded[d]||0)+1;continue;}
        stranded.push({domain:d,bench:c.id,model:m.key,variant:e.variant||null,metric:e.metric||null,unit:e.unit||null,value:e.value,issue});
      }
    }
    if(pairs){
      const ms=cmp.models.filter(m=>m.evidence.some(e=>cat[e.benchmark_id]?.eligible&&official(e)&&!rowIssue(e,cat[e.benchmark_id].rule)));
      const list=[];
      for(let i=0;i<ms.length;i++)for(let j=i+1;j<ms.length;j++){
        const r=headToHead(u,ms[i],ms[j]);
        if(r.composite&&!r.composite.hasA&&!r.composite.hasB)list.push({a:ms[i].key,b:ms[j].key,excludedBy:r.composite.excludedBy});
      }
      stalemates[d]={pairs:ms.length*(ms.length-1)/2,zeroZero:list.length,list};
    }
  }
  const aliases=db.benchmarkAliases||{};
  const unmapped=rules.unmapped_ids||{};
  const seen={};
  for(const r of db.releases)for(const e of r.evidence){
    if(!official(e)||entityIds.has(e.benchmark_id)||aliases[e.benchmark_id]||unmapped[e.benchmark_id])continue;
    (seen[e.benchmark_id]??=[]).push(r.id);
  }
  for(const [id,rs] of Object.entries(seen))orphans.push({id,rows:rs.length,releases:[...new Set(rs)]});
  return {undecided,stranded,orphans,stalemates,counted,excluded};
}

if(import.meta.url===`file://${process.argv[1]}`){
  const {loadBenchData}=await import('./load-data.mjs');
  const a=auditCompare(loadBenchData());
  console.log('undecided',a.undecided.length,'stranded',a.stranded.length,'orphans',a.orphans.length);
  for(const [d,s] of Object.entries(a.stalemates))console.log(d,'counted',a.counted[d]||0,'reviewed-excluded',a.excluded[d]||0,'pairs',s.pairs,'0–0',s.zeroZero);
  if(process.argv.includes('--json'))console.log(JSON.stringify(a,null,1));
  if(a.undecided.length||a.stranded.length||a.orphans.length){console.log(JSON.stringify({undecided:a.undecided,stranded:a.stranded,orphans:a.orphans},null,1));process.exitCode=1;}
}
