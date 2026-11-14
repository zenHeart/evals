/**
 * fair-compare-audit.mjs — 全部模型两两对照的体检（新旧口径对比 + 不变式）。
 *   node scripts/fair-compare-audit.mjs [--json] [--out 文件]
 *
 * 统计每个领域：
 *   pairs            两两对照组数（至少一方在本领域有可计分数值）
 *   oldDecided       旧口径（缺失记 0 的引用加权综合分）判出胜负的组数
 *   oldNoShared      其中双方没有任何共同评估、胜负完全来自「谁报告得多」的组数
 *   oldDominance     旧口径「在全部共同评估上都不低于对方却被判落后」的组数（本次要消灭的失衡）
 *   newDecided       新口径判出方向的组数（clear / lean / indirect）
 *   changed / flipped 结论变化 / 胜负翻转的组数
 *   newDominance     新口径的同类违例（必须为 0）
 *   asymmetric       交换 A/B 后结论不对称的组数（必须为 0）
 *   estConflict      同题对照「明显领先」但全库估计以 ≥90% 把握指向另一方的组数（需要人工复核的异常）
 * 同表证据（data/competitor-columns/）：
 *   tableFilled      没有自报共同评估、靠发布页同表行补上对照的组数（填补的「没有共同评估」缺口）
 *   tableDecided     其中判出方向的组数；tableHome 其中只有「发布方就是其中一方」的证据的组数
 *   tableAdded       已有自报共同评估、又多了同表行的组数
 *   altRows / altConflicts  自报同题对照之外另有别家同表数值的评估行数 / 其中与自报不一致的行数
 *   noTablesDecided  不用同表证据时判出方向的组数（对照基线）
 */
import {headToHead} from './model-compare.mjs';
import {fairVerdict,domainCtx} from './fair-compare.mjs';
import {compareData} from './build-model-pages.mjs';
import {rowIssue} from './model-compare.mjs';

const mirror=l=>l==='a'?'b':l==='b'?'a':null;
/** 一方在全部共同评估上都不低于另一方、且至少一项更高 → 返回 'a' / 'b'，否则 null */
export function dominant(v){
  const ds=[...(v.shared||[]).map(r=>r.gap.d),...(v.tabled||[]).flatMap(r=>r.table.hits.map(h=>h.d))];
  if(!ds.length)return null;
  if(ds.every(d=>d>=0)&&ds.some(d=>d>0))return 'a';
  if(ds.every(d=>d<=0)&&ds.some(d=>d<0))return 'b';
  return null;
}
export function auditFair(cmp,{examples=12,symmetry=true}={}){
  const out={domains:{},totals:{},examples:{flipped:[],oldDominance:[],estConflict:[]}};
  const T=out.totals;
  const add=(k,n=1)=>{T[k]=(T[k]||0)+n;};
  for(const [d,u] of Object.entries(cmp.useCases)){
    const elig=u.catalog.filter(c=>c.eligible);
    const ms=cmp.models.filter(m=>m.evidence.some(e=>elig.some(c=>c.id===e.benchmark_id&&!rowIssue(e,c.rule))));
    const s={tableFilled:0,tableDecided:0,tableHome:0,tableAdded:0,altRows:0,altConflicts:0,noTablesDecided:0,pairs:0,oldDecided:0,oldNoShared:0,oldDominance:0,newDecided:0,newClear:0,newLean:0,newIndirect:0,changed:0,flipped:0,newDominance:0,asymmetric:0,estConflict:0,shared0:0,shared1to2:0,shared3plus:0};
    for(let i=0;i<ms.length;i++)for(let j=i+1;j<ms.length;j++){
      const A=ms[i],B=ms[j];
      const r=headToHead(u,A,B);if(!r.composite)continue;
      const v0=fairVerdict(r,{sizes:cmp.sizes,...domainCtx(u),A,B,tables:null});
      if(v0.leader)s.noTablesDecided++;
      const v=fairVerdict(r,{sizes:cmp.sizes,...domainCtx(u),A,B,tables:cmp.tables});
      s.pairs++;
      if(!v.k&&v.kt){s.tableFilled++;if(v.leader)s.tableDecided++;if(v.homeOnly)s.tableHome++;}
      if(v.k&&v.kt)s.tableAdded++;
      for(const x of v.shared)if(x.alts){s.altRows++;if(x.alts.some(a=>a.differs))s.altConflicts++;}
      if(v.k===0)s.shared0++;else if(v.k<=2)s.shared1to2++;else s.shared3plus++;
      const old=r.composite.winner,nw=v.leader,dom=dominant(v);
      if(old){s.oldDecided++;if(!v.k)s.oldNoShared++;}
      if(dom&&old&&old!==dom){s.oldDominance++;if(out.examples.oldDominance.length<examples)out.examples.oldDominance.push({domain:d,a:A.key,b:B.key,old:{a:+r.composite.a.toFixed(1),b:+r.composite.b.toFixed(1)},shared:v.k,wins:v.wins,losses:v.losses});}
      if(nw){s.newDecided++;s[{clear:'newClear',lean:'newLean',indirect:'newIndirect'}[v.level]]++;}
      if(old!==nw)s.changed++;
      if(old&&nw&&old!==nw){s.flipped++;if(out.examples.flipped.length<examples)out.examples.flipped.push({domain:d,a:A.key,b:B.key,old:{a:+r.composite.a.toFixed(1),b:+r.composite.b.toFixed(1)},new:{leader:nw==='a'?A.key:B.key,level:v.level,k:v.k,wins:v.wins,losses:v.losses,pA:+v.pA?.toFixed(3)}});}
      if(dom&&nw&&nw!==dom)s.newDominance++;
      if(v.level==='clear'&&v.estimate?.leader&&v.estimate.leader!==nw){s.estConflict++;if(out.examples.estConflict.length<examples)out.examples.estConflict.push({domain:d,a:A.key,b:B.key,leader:nw,k:v.k,estPA:+v.estimate.pA.toFixed(3)});}
      if(symmetry){
        const r2=headToHead(u,B,A),v2=fairVerdict(r2,{sizes:cmp.sizes,...domainCtx(u),A:B,B:A,tables:cmp.tables});
        if(v2.leader!==mirror(nw)||v2.level!==v.level||v2.k!==v.k||v2.kt!==v.kt)s.asymmetric++;
      }
    }
    out.domains[d]=s;
    for(const [k,n] of Object.entries(s))add(k,n);
  }
  return out;
}

if(import.meta.url===`file://${process.argv[1]}`){
  const {loadBenchData}=await import('./load-data.mjs');
  const a=auditFair(compareData(loadBenchData()));
  const cols=['pairs','shared0','tableFilled','tableDecided','tableHome','tableAdded','altRows','altConflicts','noTablesDecided','shared3plus','oldDecided','oldNoShared','oldDominance','newDecided','newClear','newLean','newIndirect','changed','flipped','newDominance','asymmetric','estConflict'];
  console.log(['domain',...cols].join('\t'));
  for(const [d,s] of Object.entries(a.domains))console.log([d,...cols.map(c=>s[c])].join('\t'));
  console.log(['TOTAL',...cols.map(c=>a.totals[c])].join('\t'));
  const i=process.argv.indexOf('--out');
  if(i>0){const {writeFileSync}=await import('node:fs');writeFileSync(process.argv[i+1],JSON.stringify(a,null,1));}
  if(process.argv.includes('--json'))console.log(JSON.stringify(a.examples,null,1));
  if(a.totals.newDominance||a.totals.asymmetric)process.exitCode=1;
}
