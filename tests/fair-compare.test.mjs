import test from 'node:test';
import assert from 'node:assert/strict';
import {headToHead} from '../scripts/model-compare.mjs';
import {fairVerdict,fitAbility,sampleSize,gapSE,phi,DEFAULT_N} from '../scripts/fair-compare.mjs';
import {compareHTML} from '../scripts/compare-ui.mjs';
import {spearman} from '../scripts/fair-compare-validate.mjs';

// ---- 可复现的伪随机（mulberry32）
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const rule={unit:'percent',metric:'accuracy',min:0,max:100,direction:'higher',allowNullMetric:true,aliases:[]};
const bench=(id,cite)=>({id,name:id.toUpperCase(),cite,eligible:true,rule,source:'test'});
const ev=(id,value,variant='1.0')=>({id:'e-'+id+'-'+value,benchmark_id:id,value,display:value+'%',unit:'percent',metric:'accuracy',status:'verified',score_status:'reported',variant});
const M=(key,evidence)=>({key,id:key,name:key.toUpperCase(),release_id:key,vendor_label:'V',evidence});
const V=(dom,A,B,ctx={})=>fairVerdict(headToHead(dom,A,B),{A,B,...ctx});
const mirror=l=>l==='a'?'b':l==='b'?'a':null;

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
