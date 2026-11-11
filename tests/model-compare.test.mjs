import test from 'node:test';
import assert from 'node:assert/strict';
import {citationCounts,domainCatalog,ruleFromEntity,ruleFromUseCase,rowIssue,variantOf,metricMatches,headToHead,readCompareParams,compareParams,searchModels,domainCounts} from '../scripts/model-compare.mjs';
import {compareHTML,scoreText} from '../scripts/compare-ui.mjs';
import {chipScoreText,chipScoreTip,chipTip,chipBenchName} from '../scripts/model-ui.mjs';

const pct=(metric)=>({comparison:'cross_model',unit:'percent',metric,min:0,max:100,direction:'higher'});
const useCase={title:'编程开发',catalog:['inhouse','elo'],benchmarks:{
  hot:{...pct('resolve_rate'),name:'Hot Bench'},
  cold:{...pct('pass@1'),name:'Cold Bench'},
  desc:{comparison:'descriptive_only',unit:null,metric:null,min:null,max:null,name:'Arena'},
},dimensions:[]};
const entities={
  hot:{name:'Hot Bench',categories:['agent'],metrics:[]},
  cold:{name:'Cold Bench',categories:['coding'],metrics:[]},
  inhouse:{name:'Vendor In-house',categories:['coding'],metrics:[{id:'pass-rate',unit:'percent',range:[0,100],direction:'higher'}]},
  elo:{name:'Code Arena',categories:['coding'],metrics:[{id:'elo',unit:'elo',range:[0,4000]}]},
  uncited:{name:'Uncited',categories:['coding'],metrics:[{id:'accuracy',unit:'percent',range:[0,100]}]},
  writing:{name:'Essay Bench',categories:['preference'],metrics:[{id:'accuracy',unit:'percent',range:[0,100]}]},
};
const cites={hot:30,cold:10,desc:50,inhouse:10,elo:5,uncited:0,writing:9};
const dom={title:'编程开发',catalog:domainCatalog(useCase,entities,cites)};
let n=0;
const ev=(benchmark_id,value,extra={})=>({id:'e'+(++n),benchmark_id,value,display:String(value),variant:'2.0',unit:'percent',status:'verified',score_status:'reported',attribution:'vendor_reported',...extra});
const pend=(benchmark_id,extra={})=>({id:'p'+(++n),benchmark_id,value:null,display:null,variant:'2.0',unit:'percent',status:'pending',score_status:'not_extracted',attribution:'vendor_reported',...extra});
const M=(key,evidence)=>({key,id:key,name:key.toUpperCase(),vendor_label:'V',release_id:'r-'+key,evidence});
const close=(x,y)=>Math.abs(x-y)<1e-9;
// 可计分：hot 30、cold 10、inhouse 10 → 总权重 50
const W=50;

test('领域目录：use-case 声明 ∪ catalog 明确列出的评估；不按类别或关键词猜',()=>{
  const ids=dom.catalog.map(b=>b.id);
  assert.deepEqual([...ids].sort(),['cold','desc','elo','hot','inhouse']);
  assert.ok(!ids.includes('uncited'),'没列进 catalog 的评估不进目录，即使类别相同');
  assert.ok(!ids.includes('writing'),'没列进 catalog 的评估不进目录，即使名字像');
  assert.deepEqual(ids.slice(0,2),['desc','hot'],'按引用次数降序');
  const noCat=domainCatalog({...useCase,catalog:[]},entities,cites).map(b=>b.id).sort();
  assert.deepEqual(noCat,['cold','desc','hot'],'没有 catalog 的领域只用 use-case 自己的列表');
});
test('计分规则：use-case 声明优先；档案只认唯一的有界指标，Elo/胜率不换算',()=>{
  const by=Object.fromEntries(dom.catalog.map(b=>[b.id,b]));
  assert.equal(by.hot.eligible,true);assert.equal(by.desc.eligible,false);
  assert.equal(by.inhouse.eligible,true);assert.equal(by.inhouse.rule.metric,'pass_rate');assert.equal(by.inhouse.source,'catalog');
  assert.equal(by.elo.eligible,false);
  assert.ok(ruleFromEntity({metrics:[{id:'a',unit:'percent',range:[0,100]},{id:'b',unit:'score',range:[0,1]}]}).reason,'两个有界指标：无法确定');
  assert.ok(ruleFromEntity({metrics:[{id:'human_preference_win_rate',unit:'percent',range:[0,100]}]}).reason,'胜率是相对读数');
  assert.ok(ruleFromEntity({metrics:['pass_rate']}).reason,'只写了指标名没有上下界');
  assert.ok(ruleFromUseCase({comparison:'cross_model',unit:'percent',metric:'m',min:null,max:100}).reason);
  assert.equal(ruleFromEntity({metrics:[{id:'pass-rate',unit:'percent',range:[0,100]},{id:'cost',unit:'usd',range:null}]}).rule.allowNullMetric,false,'档案声明了多个指标时，未写指标名的记录不默认归入');
});
test('引用次数按不同发布计数，同一发布多个变体只算一次',()=>{
  const rel=[{id:'r1',evidence:[{benchmark_id:'hot'},{benchmark_id:'hot'},{benchmark_id:'cold'}]},{id:'r2',evidence:[{benchmark_id:'hot'}]},{id:'r3',evidence:[]}];
  assert.deepEqual(citationCounts(rel,['hot','cold','x']),{hot:2,cold:1,x:0});
});
test('全目录加权平均：缺失记 0，分母是全部可计分评估的权重',()=>{
  const A=M('a',[ev('hot',80)]),B=M('b',[ev('cold',70)]);
  const r=headToHead(dom,A,B);
  assert.ok(r.composite,'评估集合不同也能出综合分');
  assert.ok(close(r.composite.a,30*80/W));
  assert.ok(close(r.composite.b,10*70/W));
  assert.equal(r.composite.n,3);assert.equal(r.composite.of,3);assert.equal(r.composite.both,0);
  assert.equal(r.rows.find(x=>x.id==='hot').b.state,'missing');
  assert.equal(r.rows.find(x=>x.id==='hot').winner,null,'有分对缺失不画胜者');
});
test('不挪权重：报告得少不会因此占到更高权重',()=>{
  // 只报 hot 的 A 与 hot、cold、inhouse 都报同样 80 分的 B：B 综合分更高
  const A=M('a',[ev('hot',80)]),B=M('b',[ev('hot',80),ev('cold',80),ev('inhouse',80)]);
  const r=headToHead(dom,A,B);
  assert.ok(close(r.composite.a,30*80/W),'A 的分母仍是 50，不是 30');
  assert.ok(close(r.composite.b,80));
  assert.equal(r.composite.winner,'b');
  assert.ok(close(r.rows.find(x=>x.id==='hot').weight,30/W));
});
test('双方都有：引用越高影响越大；同版本配对并标胜负',()=>{
  const A=M('a',[ev('hot',80),ev('cold',40)]),B=M('b',[ev('hot',60),ev('cold',90)]);
  const r=headToHead(dom,A,B);
  assert.ok(close(r.composite.a,(30*80+10*40)/W));assert.ok(close(r.composite.b,(30*60+10*90)/W));
  assert.equal(r.rows.find(x=>x.id==='hot').winner,'a');assert.equal(r.composite.both,2);
  assert.deepEqual(r.rows.map(x=>x.id),['hot','cold','inhouse'],'可计分评估全部列出，按引用降序');
});
test('待转录不是 0：任一方只有待转录记录时，这一项整体退出这组对照',()=>{
  const A=M('a',[ev('hot',80),ev('cold',50)]),B=M('b',[pend('hot'),ev('cold',40)]);
  const r=headToHead(dom,A,B);
  const hot=r.rows.find(x=>x.id==='hot');
  assert.equal(hot.status,'excluded');assert.equal(hot.b.state,'pending');assert.equal(hot.winner,null);
  assert.match(hot.reason,/尚未转录/);
  // 分母去掉 hot：cold 10 + inhouse 10
  assert.ok(close(r.composite.a,10*50/20));assert.ok(close(r.composite.b,10*40/20));
  assert.equal(r.composite.excluded,1);
  // 对照：如果把待转录当 0，A 会多出 30×80 的优势——这里不允许
  assert.ok(r.composite.a<60);
});
test('双方都只有待转录：同样退出，不按 0',()=>{
  const r=headToHead(dom,M('a',[pend('hot'),ev('cold',10)]),M('b',[pend('hot')]));
  assert.equal(r.rows.find(x=>x.id==='hot').status,'excluded');
  assert.ok(close(r.composite.a,10*10/20));assert.equal(r.composite.b,0);
});
test('版本不同或口径不同：整项退出，不拿真实分数比假 0',()=>{
  const r=headToHead(dom,M('a',[ev('hot',50,{variant:'2.0'})]),M('b',[ev('hot',60,{variant:'4.0'})]));
  assert.equal(r.rows.find(x=>x.id==='hot').status,'excluded');
  const r2=headToHead(dom,M('a',[ev('hot',50)]),M('b',[ev('hot',1500,{unit:'elo'})]));
  assert.equal(r2.rows.find(x=>x.id==='hot').status,'excluded');assert.equal(r2.rows.find(x=>x.id==='hot').b.state,'other');
  const r3=headToHead(dom,M('a',[ev('hot',50)]),M('b',[ev('hot',55,{attribution:'comparison_cited'})]));
  assert.equal(r3.rows.find(x=>x.id==='hot').status,'excluded','竞品转述存在说明对方有分数，不能当 0');
});
test('单侧取值不要求写版本；双侧配对必须同一写明的版本',()=>{
  const r=headToHead(dom,M('a',[ev('hot',70,{variant:''})]),M('b',[]));
  assert.ok(close(r.composite.a,30*70/W));
  const r2=headToHead(dom,M('a',[ev('hot',70,{variant:''})]),M('b',[ev('hot',60,{variant:''})]));
  assert.equal(r2.rows.find(x=>x.id==='hot').status,'excluded');
});
test('单侧多档设置不择优；双侧只有唯一相同档位才配对',()=>{
  const r=headToHead(dom,M('a',[ev('hot',80,{effort:'max'}),ev('hot',70,{effort:'high'})]),M('b',[]));
  assert.equal(r.rows.find(x=>x.id==='hot').status,'excluded');
  const r2=headToHead(dom,M('a',[ev('hot',80,{effort:'max'}),ev('hot',70,{effort:'high'})]),M('b',[ev('hot',60,{effort:'high'})]));
  assert.equal(r2.rows.find(x=>x.id==='hot').a.n,70);
  assert.equal(headToHead(dom,M('a',[ev('hot',80),ev('hot',80)]),M('b',[])).rows[0].a.state,'value','同值重复只算一次');
});
test('仅作参考的评估不进综合分、不按 0 计，但有记录就列出',()=>{
  const r=headToHead(dom,M('a',[ev('desc',1500,{unit:'elo'})]),M('b',[]));
  assert.equal(r.reference.length,1);assert.equal(r.composite.a,0);assert.equal(r.composite.b,0);
  assert.equal(r.referenceEmpty,1,'elo 两边都没有记录');
});
test('指标与记录规则',()=>{
  const rule=dom.catalog.find(b=>b.id==='hot').rule;
  assert.equal(rowIssue(ev('hot',80,{metric:'pass_rate'}),rule),null,'通过率一族视为同一读数');
  assert.ok(rowIssue(ev('hot',80,{metric:'avg@3 score'}),rule));
  assert.equal(rowIssue(pend('hot'),rule),'pending');
  assert.ok(!metricMatches({metric:'accuracy'},{metric:'prompt_strict_acc',allowNullMetric:true}),'IFEval 笼统 accuracy 与 prompt strict 不同口径');
  assert.ok(!metricMatches({metric:''},{metric:'pass_rate',allowNullMetric:false}));
  assert.equal(variantOf({variant:'2'}),variantOf({variant:'2.0, Terminus-2'}));
  assert.equal(variantOf({variant:'LiveCodeBench v6'}),variantOf({variant:'V6 (25.02-25.05)'}));
  assert.notEqual(variantOf({variant:'10/01/2024-02/01/2025'}),'10.0');
});
test('没有任何分数的模型也能对比（综合分 0）；同一模型或缺一侧不出综合分',()=>{
  const r=headToHead(dom,M('a',[]),M('b',[ev('hot',50)]));
  assert.equal(r.composite.a,0);assert.ok(r.composite.b>0);assert.equal(r.composite.winner,'b');
  const A=M('a',[ev('hot',80)]);
  assert.equal(headToHead(dom,A,A).composite,null);
  assert.equal(headToHead(dom,A,null).composite,null);
});
test('URL 参数可复现，非法 key 丢弃',()=>{
  const models=[M('x--1',[]),M('y--2',[])],ucs={coding:dom,w:dom};
  const s=readCompareParams(new URLSearchParams('task=w&a=x--1&b=nope'),ucs,models);
  assert.deepEqual(s,{task:'w',a:'x--1',b:''});
  assert.deepEqual(readCompareParams(compareParams(s),ucs,models),s);
});
test('搜索：本领域有分数的优先，没有分数的仍可搜到',()=>{
  const ms=[{...M('a--1',[]),name:'Claude Opus',vendor_label:'Anthropic'},{...M('b--1',[ev('hot',3)]),name:'Claude Sonnet',vendor_label:'Anthropic'},{...M('c--1',[]),name:'Qwen',vendor_label:'Alibaba'}];
  const counts=domainCounts(dom,ms);
  assert.deepEqual(counts,{'b--1':1});
  assert.deepEqual(searchModels(ms,'anthropic',counts).map(m=>m.key),['b--1','a--1']);
});
test('渲染：缺失显示「-」并注明计 0；待转录显示「-」与「尚未转录」，不画胜者；不出现内部用语',()=>{
  const A=M('a',[ev('hot',80),ev('cold',50),ev('desc',1500,{unit:'elo'})]),B=M('b',[pend('hot')]);
  const html=compareHTML(headToHead(dom,A,B),A,B,dom,'../');
  assert.match(html,/未报告 · 计 0/);
  assert.match(html,/尚未转录/);
  assert.match(html,/title="官方配图尚未转录出数值"[^>]*>-</);
  assert.ok(!/图表尚无可读数值|已核验|待核验|证据账本|窗口起点/.test(html));
  const hotRow=html.slice(html.indexOf('Hot Bench'),html.indexOf('</li>',html.indexOf('Hot Bench')));
  assert.ok(!hotRow.includes(' win'),'待转录行不标胜负');
  assert.match(html,/不计入这组对照/);
  const ref=html.slice(html.indexOf('id="cmp-ref"'));
  assert.ok(!ref.includes('cbar')&&!ref.includes(' win'));
  assert.equal(scoreText(pend('x')),'-');
});
test('渲染：领域只有一项可计分评估时如实说明',()=>{
  const w={title:'文档写作',catalog:domainCatalog({benchmarks:{ife:{...pct('prompt_strict_acc'),name:'IFEval'},desc:useCase.benchmarks.desc}},{},{ife:5,desc:9})};
  const A=M('a',[ev('ife',84.1,{metric:'prompt_strict_acc'})]),B=M('b',[]);
  const r=headToHead(w,A,B);
  assert.equal(r.composite.a,84.1);assert.equal(r.composite.b,0);
  assert.match(compareHTML(r,A,B,w,'../'),/文档写作目前只有 <a [^>]+>IFEval<\/a> 能换算成 0–100 分，综合分就等于这一项的得分（没有这项分数记 0）/);
});
test('时间轴芯片：待转录写「-」并有安静提示，评测名不被吞掉',()=>{
  const e={benchmark_id:'frontier-code',variant:'2.0',status:'pending',score_status:'not_extracted',value:null,display:null,locator:{figure:'images/a.jpg'}};
  assert.equal(chipBenchName('FrontierCode','frontier-code','2.0')+' · '+chipScoreText(e),'FrontierCode 2.0 · -');
  assert.equal(chipScoreTip(e),'官方配图尚未转录出数值');
  assert.equal(chipScoreText({status:'verified',score_status:'not_reported',value:null}),'-');
  assert.equal(chipScoreTip({status:'verified',score_status:'not_reported',value:null}),'官方未公布数值');
  assert.equal(chipScoreText({status:'verified',score_status:'reported',value:31,display:'31.0%'}),'31.0%');
  assert.equal(chipTip({status:'verified',score_status:'reported',value:31,effort:'max'}),'推理档位（effort）：max');
  assert.equal(chipBenchName(undefined,'hy-swe-max',''),'hy-swe-max');
  assert.equal(chipBenchName('Terminal-Bench 2.0','terminalbench','2.0'),'Terminal-Bench 2.0');
});
test('版本：工具条件单独标出；单侧多种非版本写法且分数不同时不替用户挑',async()=>{
  const {pickOne}=await import('../scripts/model-compare.mjs');
  assert.equal(variantOf({variant:'with tools'}),'|有工具');
  assert.equal(variantOf({variant:'with-tools'}),'|有工具');
  assert.equal(variantOf({variant:'no tools'}),'|无工具');
  assert.notEqual(variantOf({variant:"Humanity's Last Exam, with tools"}),variantOf({variant:"Humanity's Last Exam, no tools"}),'有无工具不能配成同一版本');
  assert.equal(variantOf({variant:'2.0, w/ python'}),'2.0|有工具');
  assert.equal(variantOf({variant:'2.0'}),'2.0');
  const same=(x,y)=>variantOf({variant:x})===variantOf({variant:y});
  assert.ok(!same('with Search','with context management'),'联网与上下文管理是不同条件');
  assert.ok(!same('no context management','w/ context management'));
  assert.ok(!same('2.0 partial','2.0 strict')&&!same('2.0','2.0 partial'),'partial / strict 计分方式不同');
  assert.ok(!same('Code Generation 10/1/2024-2/1/2025','Code Generation 06/01/2024-10/05/2024'),'题目时间窗口不同');
  assert.ok(!same('Verified','Verified (fixed subset n=477)'),'子集规模不同');
  assert.ok(!same('Verified','Verified, multiple attempts'),'多次尝试不同于单次');
  assert.ok(!same('w/ tools','main, w/ python, pass@5'),'pass@5 不同于 pass@1');
  assert.ok(!same('text-only','text-only with Search'));
  assert.ok(!same('1.0.6','Pass@1'),'pass@1 里的 1 不是版本号');
  assert.ok(same('Diamond','GPQA Diamond')&&same('with tools','w/ Tools')&&same('Verified','Verified (Agentless Coding)')&&same('2.0','Terminal-Bench 2.0'));
  assert.ok(pickOne([ev('hot',40,{variant:'with tools'}),ev('hot',20,{variant:'no tools'})]).excluded,'有工具 / 无工具两个分数：不挑');
  assert.equal(pickOne([ev('hot',40,{variant:'2.0'}),ev('hot',20,{variant:'1.0'})]).row.value,40,'都是版本号：取最新版本');
  assert.equal(pickOne([ev('hot',40,{variant:'Verified'}),ev('hot',40,{variant:''})]).row.value,40,'写法不同但分数相同：照用');
});
test('真实数据：目录、可计分集合与推荐对照',async()=>{
  const {loadBenchData}=await import('../scripts/load-data.mjs');const {compareData}=await import('../scripts/build-model-pages.mjs');
  const d=compareData(loadBenchData());
  const w=d.useCases['chinese-longform-writing'],c=d.useCases.coding;
  assert.deepEqual(Object.keys(d.useCases),['coding','office-business','computer-use','research-search','knowledge-reasoning','vision-documents','chinese-longform-writing','quant-finance'],'8 个按用途划分的领域，编程开发在前（默认）');
  assert.deepEqual(Object.values(d.useCases).map(u=>u.title),['编程开发','办公与商务','电脑操作','调研与搜索','知识与推理','视觉与文档','文档写作','量化与金融']);
  assert.deepEqual(w.catalog.filter(b=>b.eligible).map(b=>b.id).sort(),['ifeval','multichallenge'],'文档写作目前只有 IFEval 与 MultiChallenge 能换算');
  assert.ok(c.catalog.length>40,'编程目录包含逐项筛出的软件工程评估');
  // 领域之间不重叠；按用户口径排除的评估不得混入
  const owner={};for(const [id,u] of Object.entries(d.useCases))for(const b of u.catalog){assert.ok(!owner[b.id],b.id+' 同时属于 '+owner[b.id]+' 与 '+id);owner[b.id]=id;}
  const ids=k=>new Set(d.useCases[k].catalog.map(b=>b.id));
  for(const x of ['toolathlon','mcp-atlas','automationbench','tau-bench','tau2-bench'])assert.ok(!ids('research-search').has(x),'调研与搜索不收 '+x);
  for(const x of ['spreadsheetbench','gdpval','finance-agent'])assert.ok(!ids('coding').has(x),'编程开发不收 '+x);
  assert.ok(!ids('office-business').has('finance-agent')&&ids('quant-finance').has('finance-agent'),'金融与办公分开');
  assert.ok(!ids('office-business').has('word-task'),'Word-Task 是词级 NLU，不是 Word 办公');
  assert.ok(!ids('vision-documents').has('osworld')&&ids('computer-use').has('osworld'),'GUI 智能体归电脑操作');
  for(const k of ['office-business','computer-use','research-search','knowledge-reasoning','vision-documents','quant-finance'])assert.ok(d.useCases[k].catalog.some(b=>b.eligible),k+' 至少有一项可计分');
  for(const id of ['osworld','screenspot-pro'])assert.ok(d.useCases['computer-use'].catalog.find(b=>b.id===id)?.eligible,id);
  for(const id of ['gpqa','hlehle','mmlu-pro'])assert.ok(d.useCases['knowledge-reasoning'].catalog.find(b=>b.id===id)?.eligible,id);
  assert.equal(d.useCases['office-business'].catalog.find(b=>b.id==='economically-important-tasks')?.eligible,false,'胜率（win-or-tie）不换算');
  for(const id of ['terminalbench','swebench-pro','lcb','humaneval','mbpp'])assert.ok(c.catalog.find(b=>b.id===id)?.eligible,id);
  assert.equal(c.catalog.find(b=>b.id==='aider')?.eligible,false,'use-case 声明仅作参考的仍是参考');
  assert.equal(c.catalog.find(b=>b.id==='frontier-code')?.eligible,false,'档案没有唯一有界指标的不换算');
  for(let i=1;i<c.catalog.length;i++)assert.ok(c.catalog[i-1].cite>=c.catalog[i].cite,'按引用降序');
  const inDomain=new Set(Object.values(d.useCases).flatMap(u=>u.catalog.map(b=>b.id)));
  assert.ok(d.models.every(m=>m.evidence.every(e=>inDomain.has(e.benchmark_id))));
  for(const [task,pairs] of Object.entries(d.suggestions))for(const p of pairs){
    const r=headToHead(d.useCases[task],d.models.find(m=>m.key===p.a),d.models.find(m=>m.key===p.b));
    assert.ok(r.composite&&r.composite.both===p.n&&p.n>0,'推荐对照必须双方都有分');
  }
  // 截图里的模型：Gemini 3.8 Flash 在文档写作没有 IFEval，仍能对比（记 0）
  const g=d.models.find(m=>/^gemini-3-8-flash--/.test(m.key));
  if(g){const k=d.models.find(m=>m.key==='kimi-k2--kimi-k2-instruct');const r=headToHead(w,g,k);assert.ok(r.composite);assert.equal(r.composite.a,0);assert.ok(r.composite.b>0);}
  // Hy4 的 FrontierCode 2.0 是待转录配图：不进任何分数
  const hy=d.models.find(m=>m.key==='hy4--hy4');
  if(hy)assert.ok(hy.evidence.filter(e=>e.benchmark_id==='frontier-code').every(e=>e.status!=='verified'||e.score_status!=='reported'));
});
test('双方都没有可计入的分数：不写「持平」',()=>{
  const A=M('a',[pend('hot')]),B=M('b',[]);
  const r=headToHead(dom,A,B);
  const html=compareHTML(r,A,B,{id:'coding',title:'编程开发'},'../');
  assert.ok(html.includes('分不出高下'));assert.ok(!html.includes('持平'));
});
const howText=html=>(html.match(/<p class="vd-how">[\s\S]*?<\/p>/)||[''])[0].replace(/<[^>]+>/g,'');
test('结论区：「本次计入」是这组实际计入的项数；不计入按真实原因分别计数',()=>{
  // hot：A 待转录 → 不计入（待转录）；cold：双方版本不同 → 不计入（版本或测试条件）；inhouse 计入
  const A=M('a',[pend('hot'),ev('cold',50,{variant:'1.0'}),ev('inhouse',40)]),B=M('b',[ev('hot',60),ev('cold',70,{variant:'2.0'})]);
  const r=headToHead(dom,A,B);
  assert.equal(r.composite.n,1);assert.equal(r.composite.of,3);
  assert.deepEqual(r.composite.excludedBy,{pending:1,condition:1});
  const t=howText(compareHTML(r,A,B,{id:'coding',title:'编程开发'},'../'));
  assert.match(t,/共 3 项可计分评估，本次计入 1 项/);
  assert.ok(!/本次计入 3 项/.test(t));
  assert.match(t,/另有 2 项这组对照里不计入（不记 0）：1 项因官方配图尚未转录出数值，1 项因双方的评测版本或测试条件不同/);
  // 只有条件不同：不得写成「尚未转录」
  const A2=M('a',[ev('cold',50,{variant:'with Search'})]),B2=M('b',[ev('cold',70,{variant:'with context management'})]);
  const t2=howText(compareHTML(headToHead(dom,A2,B2),A2,B2,{id:'coding',title:'编程开发'},'../'));
  assert.match(t2,/1 项因双方的评测版本或测试条件不同/);assert.ok(!/尚未转录/.test(t2));
  for(const w of ['已核验','待核验','证据账本','窗口起点'])assert.ok(!t.includes(w)&&!t2.includes(w));
});
test('真实数据：Hy4 vs GLM-5.3 计入 21 项（2 项待转录）；Kimi K2.6 vs GLM-5.1 的 BrowseComp 因测试条件不同',async()=>{
  const {loadBenchData}=await import('../scripts/load-data.mjs');const {compareData}=await import('../scripts/build-model-pages.mjs');
  const d=compareData(loadBenchData());const k=key=>d.models.find(m=>m.key===key);
  const pairs=[['coding','hy4--hy4','glm-5-3--glm-5.3'],['research-search','kimi-k2-6--kimi-k2-6','glm-5-1--glm-5.1']];
  const [[t1,a1,b1],[t2,a2,b2]]=pairs;
  if(k(a1)&&k(b1)){const r=headToHead(d.useCases[t1],k(a1),k(b1));const t=howText(compareHTML(r,k(a1),k(b1),d.useCases[t1],'../'));
    assert.equal(r.composite.n,r.composite.of-r.composite.excluded);assert.match(t,new RegExp('本次计入 '+r.composite.n+' 项'));
    assert.ok(r.composite.excludedBy.pending>=2);assert.match(t,/项因官方配图尚未转录出数值/);}
  if(k(a2)&&k(b2)){const r=headToHead(d.useCases[t2],k(a2),k(b2));const t=howText(compareHTML(r,k(a2),k(b2),d.useCases[t2],'../'));
    assert.equal(r.rows.find(x=>x.id==='browsecomp').kind,'condition');assert.match(t,/项因双方的评测版本或测试条件不同/);assert.ok(!/尚未转录/.test(t));}
});
