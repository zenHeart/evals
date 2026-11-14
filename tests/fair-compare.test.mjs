import test from 'node:test';
import assert from 'node:assert/strict';
import {headToHead} from '../scripts/model-compare.mjs';
import {fairVerdict,fitAbility,sampleSize,gapSE,phi,DEFAULT_N,domainCtx,estimateReference,tableWeightFor,tableFitWeightFor,HOME_MIN_ROWS,domainObservations} from '../scripts/fair-compare.mjs';
import {compareHTML} from '../scripts/compare-ui.mjs';
import {spearman} from '../scripts/fair-compare-validate.mjs';
import {buildSameTables} from '../scripts/fair-compare.mjs';

// ---- 可复现的伪随机（mulberry32）
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const rule={unit:'percent',metric:'accuracy',min:0,max:100,direction:'higher',allowNullMetric:true,aliases:[]};
const bench=(id,cite)=>({id,name:id.toUpperCase(),cite,eligible:true,rule,source:'test'});
const ev=(id,value,variant='1.0')=>({id:'e-'+id+'-'+value,benchmark_id:id,value,display:value+'%',unit:'percent',metric:'accuracy',status:'verified',score_status:'reported',variant});
const M=(key,evidence)=>({key,id:key,name:key.toUpperCase(),release_id:key,vendor_label:'V',evidence});
const MV=(key,vendor,evidence)=>({key,id:key,name:key.toUpperCase(),release_id:key,vendor_id:vendor,vendor_label:vendor.toUpperCase(),evidence});
const V=(dom,A,B,ctx={})=>fairVerdict(headToHead(dom,A,B),{A,B,...ctx});
const mirror=l=>l==='a'?'b':l==='b'?'a':null;
/** 一篇发布页：宿主模型 host 在评估 b 上自报 hostValue，同一行列出 cols={模型 id: 数值} */
const doc=(rel,vendor,rows)=>({release_id:rel,reported_by_vendor:vendor,attribution_type:'third_party_reported_by_vendor',
  columns:rows.flatMap(([hostEid,cols])=>Object.entries(cols).map(([mid,v])=>({host_evidence_id:hostEid,model_id:mid,value:v,display:v+'%'})))});

function randomCase(r){
  const nb=2+Math.floor(r()*9);
  const catalog=Array.from({length:nb},(_,i)=>bench('b'+i,Math.floor(r()*80)));
  const pick=()=>catalog.filter(()=>r()<0.6).map(b=>ev(b.id,Math.round(r()*1000)/10));
  return {dom:{title:'测试',catalog},A:M('a',pick()),B:M('b',pick())};
}

test('不变式（随机 2000 组）：全部共同评估不低于对方就不会被判落后；交换对称；单方评估不改结论；没报告不按 0 计',()=>{
  const r=rng(20261113);
  let checked=0,dominated=0;
  for(let t=0;t<2000;t++){
    const {dom,A,B}=randomCase(r);
    const v=V(dom,A,B);
    // 1) 支配：A 在每项共同评估上都 ≥ B 且至少一项 >
    const ds=v.shared.map(x=>x.gap.d);
    if(ds.length&&ds.every(d=>d>=0)&&ds.some(d=>d>0)){dominated++;assert.notEqual(v.leader,'b','A 全部不输却被判落后');}
    if(ds.length&&ds.every(d=>d<=0)&&ds.some(d=>d<0))assert.notEqual(v.leader,'a');
    // 2) 对称
    const w=V(dom,B,A);
    assert.equal(w.leader,mirror(v.leader));assert.equal(w.level,v.level);assert.equal(w.k,v.k);
    if(v.k)assert.ok(Math.abs(w.pA-(1-v.pA))<1e-9);
    // 3) 加一项只有 A 报告的评估：同题对照结论不变
    const extra={...dom,catalog:[...dom.catalog,bench('solo',1000)]};
    const A2={...A,evidence:[...A.evidence,ev('solo',100)]};
    const v2=V(extra,A2,B);
    assert.equal(v2.leader,v.leader);assert.equal(v2.level,v.level);assert.equal(v2.k,v.k);
    if(v.k)assert.ok(Math.abs(v2.Z-v.Z)<1e-9);
    assert.equal(v2.onlyA.length,v.onlyA.length+1);
    // 4) 没报告不按 0：改变 A 单方评估的分数，B 的「共同评估均分」与结论都不变
    if(v.onlyA.length){
      const id=v.onlyA[0].id;
      const A3={...A,evidence:A.evidence.map(e=>e.benchmark_id===id?{...e,value:e.value>50?1:99}:e)};
      const v3=V(dom,A3,B);
      assert.equal(v3.leader,v.leader);assert.equal(v3.meanB,v.meanB);
    }
    checked++;
  }
  assert.equal(checked,2000);assert.ok(dominated>100,'随机样本里要有足够多的支配情形');
});

test('单调：提高 A 在某项共同评估上的分数，A 更强的把握不会下降',()=>{
  const r=rng(7);
  for(let t=0;t<500;t++){
    const {dom,A,B}=randomCase(r);
    const v=V(dom,A,B);if(!v.k)continue;
    const id=v.shared[0].id;
    const A2={...A,evidence:A.evidence.map(e=>e.benchmark_id===id?{...e,value:Math.min(100,e.value+10)}:e)};
    assert.ok(V(dom,A2,B).pA>=v.pA-1e-12);
  }
});

test('题量误差：小题量上的小差距算「在误差内」，大题量上同样差距算明显',()=>{
  assert.equal(sampleSize({x:{n:34}},'x','2.0').n,34);
  assert.equal(sampleSize({x:{variants:{'4.0':66,'2.0':89}}},'x','4.0').n,66);
  assert.equal(sampleSize({x:{variants:{'1.1':100}}},'x','1.1|extended').n,100,'按主版本号回退');
  assert.deepEqual(sampleSize({},'y',''),{n:DEFAULT_N,known:false});
  assert.ok(4.4/gapSE(69.9,65.5,34)<1.96,'FrontierSWE 34 题：差 4.4 分在误差内');
  assert.ok(4.4/gapSE(69.9,65.5,12032)>1.96,'同样差距放在 1.2 万题上就是明显差距');
  assert.ok(Math.abs(phi(1.96)-0.975)<1e-3&&Math.abs(phi(0))-0.5<1e-9);
});

test('全库能力估计：能从稀疏数据还原真实能力排序，且「报告得多」不会被当成「能力强」',()=>{
  const r=rng(42);
  const nM=60,nI=25;
  const ability=Array.from({length:nM},()=>r()*4-2),diff=Array.from({length:nI},()=>r()*3-1.5);
  const obs=[];
  for(let m=0;m<nM;m++){
    // 覆盖率与能力负相关：弱模型报告得更多（模拟「报告多」与能力无关甚至相反）
    const p=0.15+0.5*(1-(ability[m]+2)/4);
    for(let i=0;i<nI;i++)if(r()<p){const y=1/(1+Math.exp(-(ability[m]-diff[i]+(r()-0.5)*0.6)));obs.push({key:'m'+m,item:'i'+i,y:100*y});}
  }
  const f=fitAbility(obs);
  const keys=Object.keys(f.models);
  const rho=spearman(keys.map(k=>f.models[k].theta),keys.map(k=>ability[+k.slice(1)]));
  assert.ok(rho>0.9,'估计与真实能力的秩相关 '+rho);
  const cover=keys.map(k=>obs.filter(o=>o.key===k).length);
  assert.ok(spearman(keys.map(k=>f.models[k].theta),cover)<0,'估计不随报告项数上升');
  for(const k of keys){const m=f.models[k];assert.ok(m.lo<=m.idx&&m.idx<=m.hi);}
  // 太稀的数据：不给估计
  assert.ok(fitAbility(obs.slice(0,12)).insufficient);
});

test('渲染：主结论来自同题对照，不出现「计 0 / 记 0 / 综合分」与内部用语',()=>{
  const dom={title:'编程开发',catalog:[bench('hot',80),bench('s1',30),bench('s2',20)],est:{}};
  const A=M('a',[ev('hot',58),ev('s1',74)]),B=M('b',[ev('s1',80),ev('s2',60)]);
  const res=headToHead(dom,A,B);
  const html=compareHTML(res,A,B,dom,'../',{sizes:{s1:{n:1000}}});
  assert.ok(!/计 0|记 0|综合分|已核验|待核验|证据账本|窗口起点/.test(html));
  assert.match(html,/同题对照/);assert.match(html,/没报告不等于 0 分/);
  assert.equal(res.verdict.k,1);assert.equal(res.verdict.leader,'b','唯一共同评估 B 高 6 分（1000 题，误差外）→ B 略占优');
  assert.equal(res.verdict.level,'lean');assert.equal(res.verdict.confidence,'low');
});

// ---------------- 真实数据回归：用户截图里的 Claude Fable 5.2 vs GPT-6 Astra（编程开发）
test('真实数据回归：Fable 5.2 在 3 项共同评估全胜，不能因为 Astra 多报告热门评估而被判大幅落后',async()=>{
  const {loadBenchData}=await import('../scripts/load-data.mjs');const {compareData}=await import('../scripts/build-model-pages.mjs');
  const d=compareData(loadBenchData());const u=d.useCases.coding;
  const k=s=>d.models.find(m=>m.key===s||(m.aliases||[]).includes(s));
  const A=k('gpt-6-astra--gpt-6-astra'),B=k('claude-fable-5-2--claude-fable-5-2');
  const res=headToHead(u,A,B);
  assert.ok(res.composite.winner==='a'&&res.composite.a-res.composite.b>15,'旧口径（缺失记 0）确实判 Astra 大幅领先——这是要修掉的失衡');
  const v=fairVerdict(res,{sizes:d.sizes,est:u.est,A,B});
  assert.equal(v.k,3);assert.equal(v.losses,3,'三项共同评估 Fable 全胜');
  assert.deepEqual(v.shared.map(r=>r.id).sort(),['frontier-code','frontierswe','terminal-bench-science']);
  assert.ok(v.onlyA.map(r=>r.id).includes('terminalbench')&&v.onlyA.map(r=>r.id).includes('deepswe'),'Terminal-Bench、DeepSWE 只有 Astra 报告，不参与胜负');
  assert.equal(v.leader,'b');assert.notEqual(v.level,'even');
  assert.ok(v.shared.every(r=>r.gap.known),'三项题量都已登记');
  assert.ok(u.est[B.key].theta>u.est[A.key].theta,'全库估计同样是 Fable 更高');
  const html=compareHTML(res,A,B,u,'../',{sizes:d.sizes});
  assert.match(html,/<b>Claude Fable 5\.2<\/b> (略占优|明显领先)/);
  assert.ok(!/计 0|记 0/.test(html));
  // 交换 A/B 结论对称
  const w=fairVerdict(headToHead(u,B,A),{sizes:d.sizes,est:u.est,A:B,B:A});
  assert.equal(w.leader,'a');assert.equal(w.level,v.level);
});

test('真实数据回归：没有共同评估、且一方只有 1 项可对齐的评估时，不给间接方向（Opus 5.5 vs Astra · 知识与推理）',async()=>{
  const {loadBenchData}=await import('../scripts/load-data.mjs');const {compareData}=await import('../scripts/build-model-pages.mjs');
  const d=compareData(loadBenchData());const u=d.useCases['knowledge-reasoning'];
  const k=s=>d.models.find(m=>m.key===s);
  const A=k('claude-opus-5-5--claude-opus-5-5'),B=k('gpt-6-astra--gpt-6-astra');
  const res=headToHead(u,A,B);
  assert.equal(res.composite.winner,'b','旧口径判 Astra 领先，依据只是两边报告了不同的评估');
  const v=fairVerdict(res,{sizes:d.sizes,est:u.est,A,B});
  assert.equal(v.k,0);assert.equal(v.leader,null);assert.equal(v.estimate.enough,false);
  assert.match(compareHTML(res,A,B,u,'../',{sizes:d.sizes}),/数据不足/);
});
test('真实数据体检：全部模型两两对照，新口径没有「全胜却被判落后」，交换对称',async()=>{
  const {loadBenchData}=await import('../scripts/load-data.mjs');const {compareData}=await import('../scripts/build-model-pages.mjs');
  const {auditFair}=await import('../scripts/fair-compare-audit.mjs');
  const a=auditFair(compareData(loadBenchData()));
  assert.ok(a.totals.pairs>10000);
  assert.equal(a.totals.newDominance,0);
  assert.equal(a.totals.asymmetric,0);
  assert.equal(a.totals.estConflict,0,'同题对照明显领先时，全库估计不应以高把握指向另一方');
});

// ---------------- 只靠发布方自家表：数据不足不出结论
test('只靠发布方自家表：独立评估不足 HOME_MIN_ROWS 项不判方向（难分高下），够项才允许「略占优」',()=>{
  const cat=Array.from({length:4},(_,i)=>bench('x'+i,50));
  const dom={title:'测试',catalog:cat};
  const H=MV('h','va',cat.map((c,i)=>({...ev(c.id,50),id:'h'+i})));   // 发布方 va 就是 A 的厂商
  const A=MV('a','va',[]),B=MV('b','vb',[]);
  const row=(n)=>cat.slice(0,n).map((c,i)=>['h'+i,{a:95,b:20}]);
  // 1 项：只有自家一张表的 1 行 → 不判
  const T1=buildSameTables([doc('r1','va',row(1))],[H,A,B]);
  const v1=V(dom,A,B,{tables:T1});
  assert.equal(v1.k,0);assert.equal(v1.kt,1);assert.equal(v1.homeOnly,true);assert.equal(v1.homeThin,true);
  assert.equal(v1.leader,null,'一行自家表撑不起胜负');assert.equal(v1.level,'even');
  assert.equal(V(dom,B,A,{tables:T1}).leader,null,'交换对称');
  // 2 项：达到下限 → 可以判「略占优」（仍然只到略占优）
  const T2=buildSameTables([doc('r2','va',row(2))],[H,A,B]);
  const v2=V(dom,A,B,{tables:T2});
  assert.equal(v2.kt,2);assert.equal(v2.homeThin,false);
  assert.equal(v2.leader,'a');assert.equal(v2.level,'lean','只靠同表数据最多略占优');
  // 非自家表（发布方第三方）1 项也给方向：homeThin 只约束「发布方就是其中一方」
  const T3=buildSameTables([doc('r3','vh',row(1))],[H,A,B]);
  const v3=V(dom,A,B,{tables:T3});
  assert.equal(v3.homeOnly,false);assert.equal(v3.homeThin,false);assert.equal(v3.leader,'a');
});

test('渲染：只靠发布方自家表的 1 项数据时写「难分高下」并说明仅作参考',()=>{
  const cat=Array.from({length:3},(_,i)=>bench('x'+i,50));
  const dom={title:'测试',catalog:cat,est:{}};
  const H=MV('h','va',cat.map((c,i)=>({...ev(c.id,50),id:'h'+i})));const A=MV('a','va',[]),B=MV('b','vb',[]);
  const T=buildSameTables([doc('r','va',[['h0',{a:95,b:20}]])],[H,A,B]);
  const res=headToHead(dom,A,B);
  const html=compareHTML(res,A,B,dom,'../',{tables:T});
  assert.match(html,/难分高下<\/b>（只有发布方自家表格的 1 项数据，仅作参考）/);
  assert.match(html,/不足 2 项独立数据，不据此判高下，上面的数值仅作参考/);
  assert.match(html,/同表对照/,'数值仍然展示');
  assert.ok(!/计 0|记 0|综合分|已核验|待核验|证据账本|窗口起点/.test(html));
});

test('真实数据回归：Opus 5.5 vs Astra（知识与推理）只靠 Anthropic 一页的一行 HLE → 难分高下',async()=>{
  const {loadBenchData}=await import('../scripts/load-data.mjs');const {compareData}=await import('../scripts/build-model-pages.mjs');
  const d=compareData(loadBenchData());const u=d.useCases['knowledge-reasoning'];
  const k=s=>d.models.find(m=>m.key===s);
  const A=k('claude-opus-5-5--claude-opus-5-5'),B=k('gpt-6-astra--gpt-6-astra');
  const res=headToHead(u,A,B);
  const v=fairVerdict(res,{sizes:d.sizes,...domainCtx(u),A,B,tables:d.tables});
  assert.equal(v.k,0,'没有共同自报评估');
  assert.equal(v.kt,1,'只有 1 项靠发布页同表补上');
  assert.equal(v.homeOnly,true);assert.equal(v.homeThin,true);
  assert.equal(v.leader,null);assert.equal(v.level,'even');
  assert.equal(fairVerdict(headToHead(u,B,A),{sizes:d.sizes,...domainCtx(u),A:B,B:A,tables:d.tables}).leader,null,'交换对称');
  const html=compareHTML(res,A,B,u,'../',{sizes:d.sizes,tables:d.tables});
  assert.match(html,/难分高下<\/b>（只有发布方自家表格的 1 项数据，仅作参考）/);
});

// ---------------- 全库估计「仅供参考」
test('全库估计「仅供参考」：没有外部榜单可校验、或多数模型只有 1 项时标参考且不给间接方向',()=>{
  const est=k=>({theta:k==='a'?1:-1,se:0.2,n:2,idx:80,lo:70,hi:90});
  assert.equal(estimateReference('office-business',{a:est('a'),b:est('b')}),'unvalidated');
  assert.equal(estimateReference('research-search',{a:est('a'),b:est('b')}),'unvalidated');
  assert.equal(estimateReference('coding',{a:est('a'),b:est('b')}),null,'有外部榜单可校验');
  // 多数模型只有 1 项可对齐 → thin（2/3 才算「大多数」）
  assert.equal(estimateReference('coding',{a:{...est('a'),n:1},b:{...est('b'),n:1},c:{...est('c'),n:2}}),'thin');
  assert.equal(estimateReference('coding',{a:est('a'),b:est('b'),c:{...est('c'),n:1}}),null,'少数模型单项不算');
  assert.equal(estimateReference('coding',{}),null,'没有估计时无标记');

  // 估计仅供参考的领域：区间照常算，但不给间接方向
  const dom={title:'办公与商务',catalog:[bench('p'),bench('q')],est:{a:est('a'),b:est('b')}};
  const A=M('a',[ev('p',80)]),B=M('b',[ev('q',20)]);
  const v=V(dom,A,B,{est:dom.est,estReference:'unvalidated'});
  assert.equal(v.k,0);assert.equal(v.estimate.enough,true);
  assert.equal(v.estimate.leader,null,'仅供参考的估计不给间接方向');
  assert.equal(v.leader,null);assert.equal(v.level,'none');
  // 同一组数据在没有外部榜单的领域之外仍然可以给间接方向
  const v2=V(dom,A,B,{est:dom.est});
  assert.equal(v2.estimate.leader,'a');assert.equal(v2.level,'indirect');
});

test('渲染：没有外部榜单可校验的领域，估计行标「仅供参考」并说明不据此判断高下',()=>{
  const dom={title:'调研与搜索',catalog:[bench('p'),bench('q')],
    est:{a:{theta:1,se:0.2,n:3,idx:80,lo:70,hi:90},b:{theta:-1,se:0.2,n:3,idx:20,lo:12,hi:30}},
    estMeta:{models:2,insufficient:false,reference:'unvalidated'}};
  const A=M('a',[ev('p',80)]),B=M('b',[ev('q',20)]);
  const html=compareHTML(headToHead(dom,A,B),A,B,dom,'../',{est:dom.est});
  assert.match(html,/仅供参考<\/b>：调研与搜索没有可用来校验的外部综合榜单/);
  assert.match(html,/只作参考展示，不据此判断高下/);
  assert.match(html,/全库能力估计<small>0–100 · 95% 区间 · <b>仅供参考<\/b>/);
  assert.match(html,/数据不足/,'不判高下');
  assert.ok(!/计 0|记 0|综合分|已核验|待核验|证据账本|窗口起点/.test(html));
});

// ---------------- 同表数据的领域可信度 ρ
test('同表数据可信度 ρ：视觉与文档同表数值只作「另见」展示，不计入对照与估计',()=>{
  assert.equal(tableWeightFor('vision-documents'),0);
  assert.equal(tableFitWeightFor('vision-documents'),0.5);
  assert.equal(tableWeightFor('coding'),1,'其余领域两档都是 1');
  assert.equal(tableFitWeightFor('office-business'),1);
  const cat=Array.from({length:3},(_,i)=>bench('x'+i,50));
  const dom={title:'测试',catalog:cat};
  const H=MV('h','vh',cat.map((c,i)=>({...ev(c.id,50),id:'h'+i})));
  const A=MV('a','va',[ev('x0',90)]),B=MV('b','vb',[]);
  const T=buildSameTables([doc('r','vh',cat.map((c,i)=>['h'+i,{a:95,b:20}]))],[H,A,B]);
  const vis={...dom,tableWeight:0};   // 视觉与文档：ρ对照=0
  const res=headToHead(vis,A,B);
  const v=fairVerdict(res,{A,B,tables:T,tableWeight:0});
  assert.equal(v.k,0,'B 没有自报，仍然没有共同自报评估');
  assert.equal(v.kt,0,'ρ=0：同表行不进两两对照');
  assert.equal(v.leader,null);assert.equal(v.level,'none');
  assert.equal(res.rows.filter(r=>r.tref).length,3,'同表数值仍作为参考展示');
  const html=compareHTML(res,A,B,vis,'../',{tables:T});
  assert.match(html,/同表数据（测试的发布页同表数据只作参考，不计入胜负）/);
  assert.match(html,/数据不足/,'同表数据不计入胜负');
  const obs=w=>domainObservations(vis,[H,A,B],T,{tableWeight:w});
  assert.equal(obs(0).filter(o=>o.table).length,0,'ρ=0：同表观测不进全库估计');
  assert.equal(obs(0.5).filter(o=>o.table&&o.key==='b').length,3,'ρ=0.5：B 的三项都来自同表');
  assert.equal(obs(0.5).filter(o=>o.table&&o.key==='a').length,2,'ρ=0.5：A 只补自己没有自报的两项');
  assert.equal(obs(0.5).find(o=>o.key==='a'&&o.item==='x0#1.0').y,90,'A 自报 90 为准，不混入同表 95');
});

test('真实数据回归：视觉与文档领域，同表数据不再判出方向（AA 一致率回到加入同表数据之前的水平）',async()=>{
  const {loadBenchData}=await import('../scripts/load-data.mjs');const {compareData}=await import('../scripts/build-model-pages.mjs');
  const d=compareData(loadBenchData());const u=d.useCases['vision-documents'];
  assert.equal(u.tableWeight,0);assert.equal(u.tableFitWeight,0.5);
  const ms=d.models.filter(m=>u.est?.[m.key]);
  let tableDecided=0;
  for(let i=0;i<ms.length;i++)for(let j=i+1;j<ms.length;j++){
    const A=ms[i],B=ms[j],res=headToHead(u,A,B);if(!res.composite)continue;
    const v=fairVerdict(res,{sizes:d.sizes,...domainCtx(u),A,B,tables:d.tables});
    assert.notEqual(v.basis,'table','视觉与文档不靠同表数据判方向');
    if(v.leader&&v.basis==='table')tableDecided++;
  }
  assert.equal(tableDecided,0);
});

test('真实数据回归：没有外部榜单可校验的领域不产生间接估计结论',async()=>{
  const {loadBenchData}=await import('../scripts/load-data.mjs');const {compareData}=await import('../scripts/build-model-pages.mjs');
  const d=compareData(loadBenchData());
  const log=[];
  for(const id of Object.keys(d.useCases)){
    const u=d.useCases[id];
    const ref=u.estMeta?.reference||null;
    if(ref)assert.equal(estimateReference(id,u.est),ref,`${id} 的「仅供参考」标记与规则一致`);
    else assert.ok(!estimateReference(id,u.est)||!Object.keys(u.est||{}).length,`${id} 不应标记`);
    if(!ref)continue;
    let indirect=0,decided=0,would=0;
    for(let i=0;i<d.models.length;i++)for(let j=i+1;j<d.models.length;j++){
      const A=d.models[i],B=d.models[j],res=headToHead(u,A,B);if(!res.composite)continue;
      const v=fairVerdict(res,{sizes:d.sizes,...domainCtx(u),A,B,tables:d.tables});
      if(v.leader)decided++;
      if(v.basis==='estimate')indirect++;
      // 关掉「仅供参考」屏蔽后本来会不会给间接方向
      if(fairVerdict(res,{sizes:d.sizes,est:u.est,A,B,tables:d.tables,estReference:null}).basis==='estimate')would++;
    }
    assert.equal(indirect,0,`${id}（${ref}）不得产生间接估计结论`);
    log.push(`${id}（${ref}）：结论 ${decided} 个，其中间接 ${indirect} 个；不屏蔽则 ${would} 个`);
  }
  // 屏蔽确实在起作用：这些领域里至少有一个本来会给出间接方向
  const total=log.reduce((s,l)=>s+Number(/不屏蔽则 (\d+)/.exec(l)[1]),0);
  assert.ok(total>0,'「仅供参考」屏蔽应当挡掉至少一个间接结论');
  for(const l of log)console.log('    '+l);
});

