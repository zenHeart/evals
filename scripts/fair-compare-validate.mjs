/**
 * fair-compare-validate.mjs — 用「我们之外」的证据检验对照口径（node scripts/fair-compare-validate.mjs [--out 文件]）。
 *
 *  1. 外部榜单相关性：本站全库能力估计（新）与旧口径（缺失记 0 的引用加权综合分）分别与独立来源做 Spearman 秩相关：
 *     Epoch AI ECI、Artificial Analysis Intelligence Index、LMArena WebDev（人工盲评）、Artificial Analysis 自跑评测、FrontierSWE 官方榜。
 *     快照在 data/external-validation/（含来源 URL 与抓取日期）。
 *  2. 两两方向一致率：新旧口径判出胜负的模型对，与外部来源（差距超出其区间时）方向一致的比例。
 *  3. 留一评估外推：每次拿掉一个评估项（≥5 个模型做过），用其余数据拟合，预测这些模型在被拿掉评估上的排序，
 *     与真实分数做 Spearman；对照「旧口径」与「未按难度对齐的简单平均」两个基线。
 */
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {headToHead,rowIssue,variantOf,normalizedValue} from './model-compare.mjs';
import {domainObservations,fitAbility,fairVerdict,predict} from './fair-compare.mjs';

const DIR=join(dirname(fileURLToPath(import.meta.url)),'..','data','external-validation');
export function loadExternal(dir=DIR){
  return Object.fromEntries(readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>[f.replace(/\.json$/,''),JSON.parse(readFileSync(join(dir,f),'utf8'))]));
}
export const normName=s=>String(s||'').toLowerCase().replace(/\(.*?\)/g,'').replace(/[\s_\-]+/g,' ').replace(/\s+/g,' ').trim();
function ranks(xs){
  const idx=xs.map((x,i)=>[x,i]).sort((a,b)=>a[0]-b[0]);const r=Array(xs.length);
  for(let i=0;i<idx.length;){let j=i;while(j+1<idx.length&&idx[j+1][0]===idx[i][0])j++;const avg=(i+j)/2+1;for(let k=i;k<=j;k++)r[idx[k][1]]=avg;i=j+1;}
  return r;
}
export function spearman(x,y){
  if(x.length<3)return null;
  const rx=ranks(x),ry=ranks(y),n=x.length,mx=rx.reduce((a,b)=>a+b,0)/n,my=ry.reduce((a,b)=>a+b,0)/n;
  let sxy=0,sxx=0,syy=0;for(let i=0;i<n;i++){sxy+=(rx[i]-mx)*(ry[i]-my);sxx+=(rx[i]-mx)**2;syy+=(ry[i]-my)**2;}
  return sxx&&syy?sxy/Math.sqrt(sxx*syy):null;
}
const EMPTY={key:'__none__',name:'—',evidence:[]};
/** 旧口径：单个模型的「缺失记 0 的引用加权综合分」（与对手无关，除非有整项退出） */
export function oldComposite(u,m){return headToHead(u,m,EMPTY).composite?.a??null;}

export function validate(cmp,ext=loadExternal(),db=null){
  const out={sources:{},pairwise:{},loo:{},crossSource:null};
  const sources={
    'epoch-eci':{file:'epoch-eci',val:x=>x.score,ci:x=>[x.lo,x.hi],domains:['coding','knowledge-reasoning','vision-documents']},
    'aa-intelligence-index':{file:'aa-intelligence-index',val:x=>x.score,domains:['coding','knowledge-reasoning','vision-documents']},
    'lmarena-webdev':{file:'lmarena-webdev',val:x=>x.score,ci:x=>[x.score-x.ci,x.score+x.ci],domains:['coding']},
    'aa-evaluations-coding':{file:'aa-evaluations',val:x=>{const v=[x.terminal_bench_4_0,x.frontiercode_2_0,x.terminal_bench_science_0_1].filter(Number.isFinite);return v.length===3?v.reduce((a,b)=>a+b,0)/3:null;},domains:['coding']},
    'frontierswe-v2':{file:'frontierswe-v2',val:x=>x.score,ci:x=>[x.score-x.pm,x.score+x.pm],domains:['coding']},
  };
  for(const [sid,S] of Object.entries(sources)){
    const src=ext[S.file];if(!src)continue;
    const byName=new Map(Object.entries(src.models).map(([k,v])=>[normName(k),v]));
    out.sources[sid]={source:src.source,retrieved_at:src.retrieved_at,metric:src.metric,domains:{}};
    for(const d of S.domains){
      const u=cmp.useCases[d];if(!u?.est||!Object.keys(u.est).length)continue;
      const rows=[];
      for(const m of cmp.models){
        const x=byName.get(normName(m.name));if(!x)continue;
        const ev=S.val(x);if(!Number.isFinite(ev))continue;
        const est=u.est[m.key];const old=oldComposite(u,m);
        const cov=new Set(m.evidence.filter(e=>u.catalog.some(c=>c.eligible&&c.id===e.benchmark_id)).map(e=>e.benchmark_id)).size;
        if(!est||!cov)continue;
        rows.push({key:m.key,name:m.name,ext:ev,ci:S.ci?.(x),est:est.idx,old,cov});
      }
      // 同名多条（同一模型多个发布 key）只留一条
      const seen=new Set(),R=rows.filter(r=>!seen.has(r.name)&&seen.add(r.name));
      const ex=R.map(r=>r.ext);
      out.sources[sid].domains[d]={n:R.length,
        rho_new:spearman(R.map(r=>r.est),ex),rho_old:spearman(R.map(r=>r.old),ex),rho_coverage:spearman(R.map(r=>r.cov),ex),
        old_vs_coverage:spearman(R.map(r=>r.old),R.map(r=>r.cov)),models:R};
      // 两两方向一致率（外部差距超出其区间才算有方向）
      const pw={new:[0,0],old:[0,0],newShared:[0,0],newIndirect:[0,0]};
      for(let i=0;i<R.length;i++)for(let j=i+1;j<R.length;j++){
        const a=R[i],b=R[j];
        if(a.ci&&b.ci&&!(a.ci[0]>b.ci[1]||b.ci[0]>a.ci[1]))continue;
        if(a.ext===b.ext)continue;
        const truth=a.ext>b.ext?'a':'b';
        const A=cmp.models.find(m=>m.key===a.key),B=cmp.models.find(m=>m.key===b.key);
        const r=headToHead(cmp.useCases[d],A,B);if(!r.composite)continue;
        const v=fairVerdict(r,{sizes:cmp.sizes,est:cmp.useCases[d].est,A,B});
        if(r.composite.winner){pw.old[1]++;if(r.composite.winner===truth)pw.old[0]++;}
        if(v.leader){pw.new[1]++;if(v.leader===truth)pw.new[0]++;const k=v.basis==='shared'?'newShared':'newIndirect';pw[k][1]++;if(v.leader===truth)pw[k][0]++;}
      }
      out.pairwise[sid+'|'+d]=Object.fromEntries(Object.entries(pw).map(([k,[ok,n]])=>[k,{agree:ok,of:n,rate:n?ok/n:null}]));
    }
  }
  // 留一评估外推
  for(const d of ['coding','knowledge-reasoning','vision-documents']){
    const u=cmp.useCases[d];const obs=domainObservations(u,cmp.models);
    const cite=Object.fromEntries(u.catalog.map(c=>[c.id,c.cite]));
    const items=[...new Set(obs.map(o=>o.item))].filter(i=>obs.filter(o=>o.item===i).length>=5);
    const res=[];
    for(const it of items){
      const train=obs.filter(o=>o.item!==it),test=obs.filter(o=>o.item===it);
      const fit=fitAbility(train);
      const T=test.filter(o=>fit.models[o.key]);if(T.length<5)continue;
      const bench=it.split('#')[0];
      // 旧口径基线：其余评估的引用加权均分，缺失记 0（同一评估多版本取最高）
      const elig=[...new Set(train.map(o=>o.bench))].filter(b=>b!==bench);
      const W=elig.reduce((s,b)=>s+(cite[b]||0),0)||1;
      const best={};for(const o of train){const k=o.key+'|'+o.bench;best[k]=Math.max(best[k]??-1,o.y);}
      const oldP=k=>elig.reduce((s,b)=>s+(cite[b]||0)*(best[k+'|'+b]??0),0)/W;
      const meanP=k=>{const ys=train.filter(o=>o.key===k).map(o=>o.y);return ys.reduce((a,b)=>a+b,0)/ys.length;};
      const actual=T.map(o=>o.y);
      res.push({item:it,n:T.length,new:spearman(T.map(o=>fit.models[o.key].theta),actual),old:spearman(T.map(o=>oldP(o.key)),actual),mean:spearman(T.map(o=>meanP(o.key)),actual),
        mae:T.reduce((s,o)=>s+Math.abs((predict(fit,o.key,it)??0)-o.y),0)/T.length});
    }
    const ok=res.filter(r=>[r.new,r.old,r.mean].every(Number.isFinite));
    const med=k=>{const v=ok.map(r=>r[k]).sort((a,b)=>a-b);return v.length?v[Math.floor(v.length/2)]:null;};
    const wmean=k=>ok.reduce((s,r)=>s+r[k]*r.n,0)/Math.max(1,ok.reduce((s,r)=>s+r.n,0));
    out.loo[d]={items:ok.length,median:{new:med('new'),old:med('old'),mean:med('mean')},weighted:{new:wmean('new'),old:wmean('old'),mean:wmean('mean')},newBeatsOld:ok.filter(r=>r.new>r.old).length,detail:ok};
  }
  if(db)out.crossSource=crossSource(cmp,db);
  return out;
}
/**
 * 「别家怎么报这个模型」：厂商发布页里引用的竞品分数（comparison_cited）与竞品自报分数逐条对照；
 * 并把每张发布表里「本家模型 vs 竞品」的同表对照，与本站同题对照的结论比方向。
 */
export function crossSource(cmp,db){
  const byId=new Map();for(const m of cmp.models){(byId.get(m.id)||byId.set(m.id,[]).get(m.id)).push(m);}
  const ruleOf={};for(const [d,u] of Object.entries(cmp.useCases))for(const c of u.catalog)if(c.eligible)ruleOf[c.id]={rule:c.rule,domain:d};
  const diffs=[],tables={};
  for(const r of db.releases){
    const own=r.evidence.filter(e=>e.attribution!=='comparison_cited');
    for(const e of r.evidence){
      if(e.attribution!=='comparison_cited')continue;
      const R=ruleOf[e.benchmark_id];if(!R||rowIssue({...e,attribution:null},R.rule))continue;
      const cited=byId.get(e.model_id);if(!cited)continue;
      const v=variantOf(e);
      const self=cited.flatMap(m=>m.evidence).filter(x=>x.benchmark_id===e.benchmark_id&&!rowIssue(x,R.rule)&&variantOf(x)===v);
      const sv=[...new Set(self.map(x=>x.value))];
      if(sv.length===1)diffs.push({bench:e.benchmark_id,variant:v,cited:e.model_id,by:r.id,citedValue:e.value,selfValue:sv[0],diff:e.value-sv[0]});
      // 同表对照：同一发布里本家模型在同一评估同一版本上的分数
      for(const o of own){
        if(o.benchmark_id!==e.benchmark_id||variantOf(o)!==v||rowIssue(o,R.rule)||!o.model_id||o.model_id===e.model_id)continue;
        const k=R.domain+'|'+r.id+'|'+o.model_id+'|'+e.model_id;
        const t=tables[k]??={domain:R.domain,release:r.id,own:o.model_id,rival:e.model_id,w:0,l:0};
        const d=normalizedValue(o,R.rule)-normalizedValue(e,R.rule);if(d>0)t.w++;else if(d<0)t.l++;
      }
    }
  }
  const abs=diffs.map(d=>Math.abs(d.diff)).sort((a,b)=>a-b);
  const agree={same:0,opposite:0,undecided:0,list:[]};
  for(const t of Object.values(tables)){
    if(t.w===t.l)continue;
    const A=(byId.get(t.own)||[])[0],B=(byId.get(t.rival)||[])[0];if(!A||!B)continue;
    const u=cmp.useCases[t.domain];const r=headToHead(u,A,B);if(!r.composite)continue;
    const v=fairVerdict(r,{sizes:cmp.sizes,est:u.est,A,B});
    const table=t.w>t.l?'a':'b';
    if(!v.leader)agree.undecided++;else if(v.leader===table)agree.same++;else{agree.opposite++;agree.list.push({...t,verdict:v.leader,k:v.k,level:v.level});}
  }
  return {pairs:diffs.length,medianAbsDiff:abs.length?abs[Math.floor(abs.length/2)]:null,over2:abs.filter(x=>x>2).length,over5:abs.filter(x=>x>5).length,
    largest:diffs.sort((a,b)=>Math.abs(b.diff)-Math.abs(a.diff)).slice(0,15),tables:Object.keys(tables).length,agree};
}

if(import.meta.url===`file://${process.argv[1]}`){
  const {loadBenchData}=await import('./load-data.mjs');const {compareData}=await import('./build-model-pages.mjs');
  const db=loadBenchData();const v=validate(compareData(db),loadExternal(),db);
  const f=x=>x==null?'—':x.toFixed(2);
  console.log('== 外部榜单 Spearman（新=全库估计，旧=缺失记 0 综合分，覆盖=报告项数）');
  for(const [s,o] of Object.entries(v.sources))for(const [d,r] of Object.entries(o.domains))console.log(s,d,'n='+r.n,'新',f(r.rho_new),'旧',f(r.rho_old),'覆盖',f(r.rho_coverage),'| 旧~覆盖',f(r.old_vs_coverage));
  console.log('== 两两方向一致率');
  for(const [k,o] of Object.entries(v.pairwise))console.log(k,Object.entries(o).map(([n,x])=>`${n} ${x.agree}/${x.of}${x.rate!=null?' ('+(x.rate*100).toFixed(0)+'%)':''}`).join('  '));
  console.log('== 留一评估外推 Spearman（中位数 / 按模型数加权）');
  for(const [d,o] of Object.entries(v.loo))console.log(d,'items='+o.items,'新',f(o.median.new),'/',f(o.weighted.new),'旧',f(o.median.old),'/',f(o.weighted.old),'简单平均',f(o.median.mean),'/',f(o.weighted.mean),'新优于旧',o.newBeatsOld+'/'+o.items);
  const c=v.crossSource;
  if(c){console.log('== 竞品引用 vs 自报：',c.pairs,'对，绝对差中位数',f(c.medianAbsDiff),'分，>2 分',c.over2,'，>5 分',c.over5);
    console.log('== 厂商同表对照 vs 本站结论：同向',c.agree.same,'反向',c.agree.opposite,'本站未判',c.agree.undecided);
    for(const x of c.largest.slice(0,6))console.log('   ',x.bench,x.variant,x.cited,'by',x.by,'引用',x.citedValue,'自报',x.selfValue);
    for(const x of c.agree.list.slice(0,8))console.log('   反向',JSON.stringify(x));}
  const i=process.argv.indexOf('--out');if(i>0)writeFileSync(process.argv[i+1],JSON.stringify(v,null,1));
}
