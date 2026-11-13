/**
 * fair-compare.mjs — /choose/ 两模型对照的「公平裁决」层（浏览器与 Node 共用的纯函数）。
 *
 * 旧口径的问题：把「没报告」按 0 分计入、权重按官方引用次数分配，结果衡量的是「报告了多少热门评估」，
 * 不是能力。一方在每一项共同评估上都更高，却可能因为对方多报告了几项热门评估而「综合分」大幅落后。
 *
 * 新口径（三层，互不替代）：
 *  1. 同题对照（主结论）：只用双方都有、版本与测试条件一致的评估逐项比较（配对规则沿用 model-compare.mjs）。
 *     每项差距配上题量误差（二项分布标准误，题量来自 compare-rules.json 的 sample_sizes，未登记时按保守题量）；
 *     合并多项时用加权 Stouffer z（权重 = log2(1+官方引用次数)，热门评估更重要但不会压倒一切）。
 *     结论只在合并后的把握足够高时才判领先，否则写「难分高下」；共同评估少时同时降低可信度。
 *  2. 全库能力估计（辅助）：用本领域全部模型的全部可计分分数拟合一个 Rasch 型潜变量模型
 *     logit(得分) = 能力(模型) + 难度系数(评估)，与 Epoch AI ECI 的「按难度对齐」思路一致，
 *     借其他模型的成绩推断「没报告的那项大概会考多少」，并给出区间。它不参与「谁领先」的主结论，
 *     只在没有共同评估时作为「间接估计」出现，且必须够有把握（≥90%，双方各至少 2 项可对齐的评估）。
 *     估计的不确定度额外加入「挑选误差」SELECTION_SD，用外部榜单校准，避免过度自信。
 *  3. 覆盖面（单列）：各自报告了几项、只有一方报告的有几项。没报告不等于 0 分，也不参与胜负。
 *  4. 同表对照（补充证据）：厂商发布页的对比表里常列出其他模型的分数（同一张表、同一行、同一套设置）。
 *     这些数值记在 data/competitor-columns/（来源类型 third_party_reported_by_vendor，与自报分开），规则：
 *      - 双方都有自报、能同题对照的评估：仍以自报为准，同表数值只作为「另见」列出（不一致时标出，不取平均）；
 *      - 至少一方没有可用的自报、但某篇发布页在同一行里同时列出了双方：用这一行补上对照，权重减半
 *        （SAME_TABLE_WEIGHT=0.5：数值由发布方在自己的设置下测得，发布方可能就是被比较的一方，且竞品的推理档位常未注明）；
 *        同一评估有多篇发布页的同表行时，各行平分这一半权重；
 *      - 只靠同表证据时结论最多判「略占优」（明显领先至少要有 1 项自报同题对照）；发布方就是被比较的一方时可信度为低。
 *
 * 不变式（tests/fair-compare.test.mjs 用随机数据逐条验证）：
 *  - 一方在全部共同评估上都不低于另一方（且至少一项更高），结论不可能判另一方领先；
 *  - 交换 A/B，结论对称；
 *  - 增加一项只有一方报告的评估，不改变同题对照结论；
 *  - 没报告的评估不以任何方式按 0 计入。
 */

import {rowIssue,variantOf,normalizedValue} from './model-compare.mjs';

/** 标准正态分布函数（Abramowitz–Stegun 7.1.26，误差 < 1.5e-7） */
export function phi(z){
  const s=z<0?-1:1,x=Math.abs(z)/Math.SQRT2,t=1/(1+0.3275911*x);
  const y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x);
  return 0.5*(1+s*y);
}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const logit=p=>Math.log(p/(1-p));
const sigmoid=x=>1/(1+Math.exp(-x));
/** 未登记题量时的保守假设（题越少误差越大；100 题偏保守） */
export const DEFAULT_N=100;
/** 合并把握的分档（单侧概率）：≥97.5% 明显领先，≥84%（约 1 个标准误）略占优，其余难分高下 */
export const CLEAR=0.975,LEAN=0.84;
/** 间接估计只有把握 ≥ 90% 才给方向 */
export const EST_LEAN=0.9;
/** 间接估计要求双方各自至少有几项锚定得住的评估 */
export const EST_MIN_N=2;
/**
 * 每个模型能力估计额外的不确定度（logit 尺度）。厂商倾向公布自己占优的评估，残差算出的标准误会偏小。
 * 0.5 是用外部来源校准的：取 0 时「把握 90–95%」的间接判断与 Epoch ECI 只有约 80% 一致（过度自信）；
 * 取 0.5 时各外部来源上该档的一致率都在 90% 以上（scripts/fair-compare-validate.mjs 可复现）。
 */
export const SELECTION_SD=0.5;
/** 同表证据（发布页对比表里的竞品列）相对自报同题对照的权重 */
export const SAME_TABLE_WEIGHT=0.5;
/** 全库估计最少需要的残差自由度（观测数 − 模型数 − 评估项数） */
export const MIN_DOF=30;

/**
 * 题量登记：rules.sample_sizes[id] = {n, variants?:{归一化版本键:n}, source}
 * 返回 {n, known}
 */
export function sampleSize(sizes,id,variant){
  const s=sizes?.[id];
  if(s){
    const base=String(variant||'').split('|')[0];
    const v=s.variants&&(s.variants[variant]??s.variants[base]);
    if(Number.isFinite(v)&&v>0)return {n:v,known:true};
    if(Number.isFinite(s.n)&&s.n>0)return {n:s.n,known:true};
  }
  return {n:DEFAULT_N,known:false};
}
/** 一项评估上两侧得分（0–100）之差的标准误（二项近似，两侧独立——同题配对时偏保守） */
export function gapSE(na,nb,n){
  const p=x=>clamp(x/100,0.03,0.97);
  return 100*Math.sqrt((p(na)*(1-p(na))+p(nb)*(1-p(nb)))/n);
}
export const weightOf=cite=>Math.log2(2+Math.max(0,cite||0));

/**
 * 同题对照裁决。
 * @param res   headToHead() 的结果（rows 内已经按版本 / 条件配好对）
 * @param ctx   {sizes, est:{[key]:{theta,se,idx,lo,hi,n}}, A, B}
 * @returns verdict 对象，见下
 */
export function fairVerdict(res,ctx={}){
  const rows=res?.rows||[];
  const shared=[],onlyA=[],onlyB=[],tabled=[];
  const ka=ctx.A?.key,kb=ctx.B?.key;
  for(const r of rows){
    delete r.gap;delete r.table;delete r.alts;
    const va=r.status==='scored'&&r.a.state==='value',vb=r.status==='scored'&&r.b.state==='value';
    const hits=ka&&kb&&ka!==kb?sameTableHits(ctx.tables,r,ka,kb,[ctx.A?.vendor_id,ctx.B?.vendor_id]):[];
    if(va&&vb){
      const {n,known}=sampleSize(ctx.sizes,r.id,r.variant);
      const d=r.a.n-r.b.n,se=gapSE(r.a.n,r.b.n,n),w=weightOf(r.cite);
      const z=d/se;
      r.gap={d,se,n,known,z,w,clear:Math.abs(z)>=1.96,dir:Math.abs(d)<1e-9?0:d>0?1:-1};
      // 自报为准；别家发布页同表里的数值只作「另见」（不一致时标出，不取平均）
      const alts=sameTableAlts(ctx.tables,r,ka,kb);
      if(alts.length)r.alts=alts;
      shared.push(r);
      continue;
    }
    if(hits.length){
      const w=weightOf(r.cite)*SAME_TABLE_WEIGHT/hits.length;
      for(const h of hits){
        const {n,known}=sampleSize(ctx.sizes,r.id,h.variant);
        h.d=h.a.n-h.b.n;h.se=gapSE(h.a.n,h.b.n,n);h.n=n;h.known=known;h.z=h.d/h.se;h.w=w;
      }
      const d=hits.reduce((s,h)=>s+h.d,0)/hits.length;
      r.table={hits,w:w*hits.length,d,dir:Math.abs(d)<1e-9?0:d>0?1:-1,home:hits.every(h=>h.home)};
      tabled.push(r);
    }
    if(va)onlyA.push(r);else if(vb)onlyB.push(r);
  }
  const k=shared.length,kt=tabled.length;
  const wins=shared.filter(r=>r.gap.dir>0).length,losses=shared.filter(r=>r.gap.dir<0).length,ties=k-wins-losses;
  const clearWins=shared.filter(r=>r.gap.dir>0&&r.gap.clear).length,clearLosses=shared.filter(r=>r.gap.dir<0&&r.gap.clear).length;
  const W=shared.reduce((s,r)=>s+r.gap.w,0);
  const meanA=k?shared.reduce((s,r)=>s+r.gap.w*r.a.n,0)/W:null,meanB=k?shared.reduce((s,r)=>s+r.gap.w*r.b.n,0)/W:null;
  // 同表对照的均分（只在没有自报同题对照时作为主数字展示）
  const th=tabled.flatMap(r=>r.table.hits),TW=th.reduce((s,h)=>s+h.w,0);
  const tMeanA=kt?th.reduce((s,h)=>s+h.w*h.a.n,0)/TW:null,tMeanB=kt?th.reduce((s,h)=>s+h.w*h.b.n,0)/TW:null;
  const twins=tabled.filter(r=>r.table.dir>0).length,tlosses=tabled.filter(r=>r.table.dir<0).length;
  const terms=[...shared.map(r=>[r.gap.w,r.gap.z]),...th.map(h=>[h.w,h.z])];
  const Z=terms.length?terms.reduce((s,[w,z])=>s+w*z,0)/Math.sqrt(terms.reduce((s,[w])=>s+w*w,0)):0;
  const pA=terms.length?phi(Z):null;
  const tableOnly=!k&&kt>0,homeOnly=tableOnly&&tabled.every(r=>r.table.home);
  let leader=null,level='none',basis=k&&kt?'shared+table':k?'shared':kt?'table':'none';
  if(terms.length){
    const conf=Math.max(pA,1-pA);
    if(conf>=CLEAR&&k>=1&&k+kt>=3)level='clear';
    else if(conf>=LEAN)level='lean';
    else level='even';
    if(level!=='even')leader=Z>0?'a':'b';
  }
  // 可信度：共同评估越多、题量越清楚越高；同表证据按半项计；只靠同表证据时最高为中，发布方就是其中一方时为低
  const keff=k+kt*SAME_TABLE_WEIGHT;
  const knownShare=k?shared.filter(r=>r.gap.known).length/k:0;
  let confidence=keff===0?'none':keff<3?'low':keff<5?'medium':'high';
  if(confidence==='high'&&knownShare<0.5)confidence='medium';
  if(tableOnly)confidence=homeOnly?'low':confidence==='high'?'medium':confidence;
  // 间接估计（只在没有共同评估时给方向）
  const ea=ctx.est?.[ctx.A?.key],eb=ctx.est?.[ctx.B?.key];
  let estimate=null;
  if(ea&&eb){
    const d=ea.theta-eb.theta,se=Math.sqrt(ea.se**2+eb.se**2);
    const p=phi(d/se);
    // 任一方只有 1 项锚定得住的评估时，不给间接方向（一项分数撑不起跨评估推断）
    const enough=ea.n>=EST_MIN_N&&eb.n>=EST_MIN_N;
    estimate={a:ea,b:eb,pA:p,enough,leader:!enough?null:p>=EST_LEAN?'a':p<=1-EST_LEAN?'b':null};
  }
  if(!k&&!kt&&estimate?.leader){leader=estimate.leader;level='indirect';basis='estimate';confidence='low';}
  return {k,shared,onlyA,onlyB,wins,losses,ties,clearWins,clearLosses,meanA,meanB,meanGap:k?meanA-meanB:null,Z,pA,leader,level,basis,confidence,estimate,
    kt,tabled,twins,tlosses,tMeanA,tMeanB,tableOnly,homeOnly,
    hasA:shared.length+onlyA.length,hasB:shared.length+onlyB.length};
}

/**
 * 同表证据的构建期整理：把 data/competitor-columns/ 的竞品列挂到「宿主行」（发布方自家模型在该表该行的自报记录）上。
 * 宿主行给出评估 id、版本、指标与单位；同一行里的竞品数值共享这些口径。
 * @param docs   loadCompetitorColumns() 的结果
 * @param models compareData 的模型（已合并同名模型）
 * @returns {rows:{[宿主记录 id]:{b,v,metric,unit,by,byLabel,rel,cells:{[模型 key]:[数值,原文,设置,是否宿主]}}}}
 */
export function buildSameTables(docs,models){
  const evIdx=new Map(),byId=new Map(),vlabel={};
  for(const m of models){
    if(m.vendor_id&&!vlabel[m.vendor_id])vlabel[m.vendor_id]=m.vendor_label||m.vendor_id;
    for(const e of m.evidence||[])if(e.id&&!evIdx.has(e.id))evIdx.set(e.id,{m,e});
    (byId.get(m.id)||byId.set(m.id,[]).get(m.id)).push(m);
  }
  const rows={};
  for(const d of docs||[]){
    for(const c of d.columns||[]){
      if(!c.model_id||!Number.isFinite(c.value))continue;
      const h=evIdx.get(c.host_evidence_id);
      if(!h||!Number.isFinite(h.e.value)||h.e.status!=='verified'||h.e.score_status!=='reported')continue;
      const subs=byId.get(c.model_id)||[];
      if(subs.length!==1)continue; // 同一个模型 id 对应多家时不猜
      const sub=subs[0];
      if(sub.key===h.m.key)continue;
      const r=rows[c.host_evidence_id]??={b:h.e.benchmark_id,v:h.e.variant||'',metric:h.e.metric||'',unit:h.e.unit||'',
        by:d.reported_by_vendor,byLabel:vlabel[d.reported_by_vendor]||d.reported_by_vendor,rel:d.release_id,
        cells:{[h.m.key]:[h.e.value,h.e.display||String(h.e.value),h.e.effort||null,1]}};
      if(!r.cells[sub.key])r.cells[sub.key]=[c.value,c.display||String(c.value),c.settings||null,0];
    }
  }
  return {rows};
}
const tIndex=new WeakMap();
function tableIndex(T){
  let ix=tIndex.get(T);
  if(!ix){ix=new Map();for(const [id,r] of Object.entries(T.rows||{}))for(const k of Object.keys(r.cells)){const key=k+'|'+r.b;(ix.get(key)||ix.set(key,[]).get(key)).push(id);}tIndex.set(T,ix);}
  return ix;
}
/** 同表一格能否按该评估的规则计分；能则返回 0–100 分 */
function tableCell(t,key,rule){
  const c=t.cells[key];if(!c||!rule)return null;
  const e={status:'verified',score_status:'reported',value:c[0],unit:t.unit,metric:t.metric};
  if(rowIssue(e,rule))return null;
  return {value:c[0],display:c[1],settings:c[2],self:Boolean(c[3]),n:normalizedValue(e,rule)};
}
/** 某评估上同一行同时列出 A、B 的同表行（每行一个对照）；home=发布方就是其中一方（含同厂商的其他型号） */
export function sameTableHits(T,r,ka,kb,vendors=[]){
  if(!T?.rows||!r?.rule)return [];
  const ix=tableIndex(T),ids=new Set(ix.get(kb+'|'+r.id)||[]);
  const out=[],seen=new Set();
  for(const id of ix.get(ka+'|'+r.id)||[]){
    if(!ids.has(id))continue;
    const t=T.rows[id],a=tableCell(t,ka,r.rule),b=tableCell(t,kb,r.rule);
    if(!a||!b)continue;
    // 同一发布方在多篇发布页里重复印出同一组数值：只算一次
    const dup=[t.by,variantOf({variant:t.v,metric:t.metric}),a.value,b.value].join('|');
    if(seen.has(dup))continue;seen.add(dup);
    out.push({id,by:t.by,byLabel:t.byLabel,rel:t.rel,variant:variantOf({variant:t.v,metric:t.metric}),raw:t.v,a,b,home:a.self||b.self||vendors.includes(t.by)});
  }
  return out;
}
/** 双方已有自报同题对照时，别家发布页同表里对 A / B 的转述（同一版本），供「另见」展示与冲突统计 */
export function sameTableAlts(T,r,ka,kb){
  if(!T?.rows||!r?.rule)return [];
  const ix=tableIndex(T),out=[];
  for(const [who,key] of [['a',ka],['b',kb]]){
    const own=r[who]?.row?.value;
    for(const id of ix.get(key+'|'+r.id)||[]){
      const t=T.rows[id];
      if(variantOf({variant:t.v,metric:t.metric})!==r.variant)continue;
      const c=tableCell(t,key,r.rule);
      if(!c||c.self)continue;
      out.push({who,id,by:t.by,byLabel:t.byLabel,rel:t.rel,value:c.value,display:c.display,settings:c.settings,differs:Number.isFinite(own)&&Math.abs(own-c.value)>1e-9});
    }
  }
  return out;
}

/**
 * 全库能力估计：Rasch 型潜变量模型（带收缩先验），交替最小二乘拟合。
 *   y(m,i) = logit(clamp(得分/100)) = θ_m + β_i + ε
 * 评估项 i = 评估 id + 归一化版本键（不同版本 / 条件是不同的题，不混在一起）。
 * θ 的先验 N(0, τ²)：报告少的模型被拉向平均，不会因一两项高分就排到最前；τ、σ 由数据估计（经验贝叶斯）。
 * 标准误只计入「至少 3 个模型做过」的评估项（锚定得住的题），近似为 √(σ²/(n_eff+λ) + SELECTION_SD²)。
 * @param obs [{key, item, y(0–100)}]
 * @returns {models:{[key]:{theta,se,idx,lo,hi,n}}, items:{[item]:{beta,count}}, sigma, tau, ref}
 */
export function fitAbility(obs,{iters=200,eps=1.5}={}){
  const E=clamp(eps,0.1,10)/100;
  const data=obs.map(o=>({m:o.key,i:o.item,y:logit(clamp(o.y/100,E,1-E))}));
  const byM=new Map(),byI=new Map();
  for(const d of data){(byM.get(d.m)||byM.set(d.m,[]).get(d.m)).push(d);(byI.get(d.i)||byI.set(d.i,[]).get(d.i)).push(d);}
  const theta=new Map([...byM.keys()].map(k=>[k,0]));
  const beta=new Map([...byI].map(([k,ds])=>[k,ds.reduce((s,d)=>s+d.y,0)/ds.length]));
  const sweep=(lam,n=iters)=>{
    for(let it=0;it<n;it++){
      for(const [m,ds] of byM)theta.set(m,ds.reduce((s,d)=>s+d.y-beta.get(d.i),0)/(ds.length+lam));
      for(const [i,ds] of byI)beta.set(i,ds.reduce((s,d)=>s+d.y-theta.get(d.m),0)/ds.length);
      // 能力以「有分模型的平均」为 0 点，难度系数随之平移（模型不可辨识的整体平移）
      const mu=[...theta.values()].reduce((s,t)=>s+t,0)/Math.max(1,theta.size);
      for(const [m,t] of theta)theta.set(m,t-mu);for(const [i,b] of beta)beta.set(i,b+mu);
    }
  };
  // 经验贝叶斯：先用很弱的先验拟合，矩估计 σ²（残差）与 τ²（能力的真实离散 = 估计离散 − 抽样噪声），再用 λ=σ²/τ² 重拟
  let lambda=0.05,sigma2=1,tau2=1;
  for(let outer=0;outer<4;outer++){
    sweep(lambda);
    const N=data.length,P=byM.size+byI.size;
    const rss=data.reduce((s,d)=>s+(d.y-theta.get(d.m)-beta.get(d.i))**2,0);
    sigma2=Math.max(0.05,rss/Math.max(1,N-P));
    if(outer===0){
      const th=[...byM].map(([m,ds])=>[theta.get(m),ds.length]);
      const v=th.reduce((s,[t])=>s+t*t,0)/th.length,noise=th.reduce((s,[,n])=>s+sigma2/n,0)/th.length;
      tau2=Math.max(0.05,v-noise);
    }
    lambda=sigma2/tau2;
  }
  sweep(lambda);
  const anchored=new Set([...byI].filter(([,ds])=>ds.length>=3).map(([i])=>i));
  // 数据太稀、重叠太少时模型不可辨识（残差自由度不足）：整个领域不给估计，页面写「数据不足」
  const dof=data.length-byM.size-byI.size;
  if(dof<MIN_DOF||anchored.size<3)return {models:{},items:{},sigma:Math.sqrt(sigma2),tau:Math.sqrt(tau2),lambda,ref:0,dof,anchored:anchored.size,insufficient:true};
  const betas=[...anchored].map(i=>beta.get(i)).sort((a,b)=>a-b);
  const ref=betas.length?betas[Math.floor(betas.length/2)]:0;
  const models={};
  for(const [m,ds] of byM){
    const neff=ds.filter(d=>anchored.has(d.i)).length;
    if(!neff)continue;
    // 抽样误差之外再加一项「挑选误差」：各家自报的评估是挑过的，单看拟合残差会过度自信（见 SELECTION_SD）
    const t=theta.get(m),se=Math.sqrt(sigma2/(neff+lambda)+SELECTION_SD**2);
    models[m]={theta:t,se,n:neff,idx:100*sigmoid(t+ref),lo:100*sigmoid(t-1.96*se+ref),hi:100*sigmoid(t+1.96*se+ref)};
  }
  const items=Object.fromEntries([...byI].map(([i,ds])=>[i,{beta:beta.get(i),count:ds.length}]));
  return {models,items,sigma:Math.sqrt(sigma2),tau:Math.sqrt(tau2),lambda,ref,dof,anchored:anchored.size,insufficient:false};
}
/** 预测某模型在某评估项上的得分（0–100），供留一法外部验证 */
export function predict(fit,key,item){
  const m=fit.models[key],b=fit.items[item];
  if(!m||!b)return null;
  return 100*sigmoid(m.theta+b.beta);
}

/**
 * 领域观测矩阵：每个模型在每个可计分评估项上的一个得分（0–100）。
 * 只收能计分的官方数值；同一项多个不同数值（多档设置）取中位数——这只用于全库估计，同题对照仍按原规则不择优。
 */
export function domainObservations(domain,models,tables=null){
  const obs=[];
  for(const c of domain.catalog||[]){
    if(!c.eligible)continue;
    // 同表竞品列：只给「自己没有这项自报」的模型补观测（自报为准，不与自报混合）
    const extra={};
    if(tables)for(const t of Object.values(tables.rows||{})){
      if(t.b!==c.id)continue;
      const v=variantOf({variant:t.v,metric:t.metric});
      for(const [key,cell] of Object.entries(t.cells)){
        if(cell[3])continue;
        const e={status:'verified',score_status:'reported',value:cell[0],unit:t.unit,metric:t.metric};
        if(rowIssue(e,c.rule))continue;
        ((extra[key]??={})[v]??=[]).push(normalizedValue(e,c.rule));
      }
    }
    for(const m of models){
      const rows=(m.evidence||[]).filter(e=>e.benchmark_id===c.id&&!rowIssue(e,c.rule));
      const g={};
      for(const e of rows)(g[variantOf(e)]??=[]).push(normalizedValue(e,c.rule));
      for(const [v,vs] of Object.entries(extra[m.key]||{}))if(!g[v])g[v]=vs.map(x=>({x,table:true}));
      for(const [v,vs] of Object.entries(g)){
        const table=vs.some(x=>x?.table);
        const s=[...new Set(vs.map(x=>x?.table?x.x:x))].sort((a,b)=>a-b);
        const y=s.length%2?s[(s.length-1)/2]:(s[s.length/2-1]+s[s.length/2])/2;
        obs.push({key:m.key,item:c.id+'#'+v,bench:c.id,y,...(table?{table:true}:{})});
      }
    }
  }
  return obs;
}
/** 把拟合结果压缩成下发给浏览器的小表（保留 3 位小数） */
export function compactEstimates(fit){
  const r=x=>Math.round(x*1000)/1000;
  return Object.fromEntries(Object.entries(fit.models).map(([k,m])=>[k,{theta:r(m.theta),se:r(m.se),n:m.n,idx:r(m.idx),lo:r(m.lo),hi:r(m.hi)}]));
}
