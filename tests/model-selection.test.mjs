import test from 'node:test';
import assert from 'node:assert/strict';
import {PROTOCOL_KEYS,normalizeScore,evidenceEligibility,selectModels,readState,stateParams,parseGoal,contextTokens} from '../scripts/model-selection.mjs';
import {canonicalURL,mergeCandidates} from '../scripts/release-discovery.mjs';
const rule={comparison:'cross_model',min:0,max:100,unit:'percent',metric:'accuracy',direction:'higher'};
const edge=(value=80)=>({id:'v-r--b',benchmark_id:'b',variant:'v1',metric:'accuracy',unit:'percent',value,status:'verified',score_status:'reported',comparison_scope:'only_same_protocol',source_tier:'A',url:'https://example.com/release',locator:{row:'b'},protocol:Object.fromEntries(PROTOCOL_KEYS.map(k=>[k,k==='tools'?[]:'fixed']))});
const useCase={dimensions:[{id:'writing',label:'写作',weight:1,keywords:['中文','长文'],benchmarks:['b']}],benchmarks:{b:rule}};
const state={weights:{writing:1},context:0,maxPrice:null};
const fixture=()=>({useCase,models:[{key:'a',evidence:[edge(80)]},{key:'b',evidence:[edge(70)]}]});
test('只在共同完整协议下比较，保留确定试用顺序',()=>{const r=selectModels(fixture(),state);assert.equal(r.winner,'a');assert.equal(r.candidates[0].total,80);});
test('关键协议逐项缺失、变更均阻断比较',()=>{for(const k of PROTOCOL_KEYS){for(const value of [null,'different','unknown','未披露']){const d=fixture();d.models[1].evidence[0].protocol[k]=value;assert.equal(selectModels(d,state).canRank,false,k);}}});
test('pending、竞品引用、内部评测不可排序',()=>{assert.ok(evidenceEligibility({...edge(),status:'pending'},rule));assert.ok(evidenceEligibility({...edge(),attribution:'comparison_cited'},rule));assert.ok(evidenceEligibility(edge(),{...rule,comparison:'descriptive_only'}));});
test('版本、单位和指标不同不合并',()=>{for(const k of ['variant','metric','unit']){const d=fixture();d.models[1].evidence[0][k]='other';assert.equal(selectModels(d,state).canRank,false);}});
test('百分数、反向错误率、Elo 归一化边界',()=>{assert.equal(normalizeScore({value:60,unit:'percent',metric:'accuracy'},rule),60);assert.equal(normalizeScore({value:20,unit:'percent',metric:'accuracy'},{...rule,direction:'lower'}),80);assert.equal(normalizeScore({value:1721.9,unit:'elo',metric:'accuracy'},rule),null);assert.equal(normalizeScore({value:101,unit:'percent',metric:'accuracy'},rule),null);});
test('缺失维度不填零，不重新分配权重',()=>{const d=fixture();d.useCase={...useCase,dimensions:[...useCase.dimensions,{id:'facts',benchmarks:[]}]};const r=selectModels(d,{...state,weights:{writing:1,facts:1}});assert.equal(r.canRank,false);assert.equal(r.candidates[0].total,null);});
test('缺失规格、货币差异不能通过已选硬约束',()=>{for(const limits of [{context:128000},{modality:'文本'},{maxPrice:1,currency:'USD'},{deployment:'local'},{region:'CN'}]){const r=selectModels(fixture(),{...state,...limits});assert.ok(r.candidates.every(c=>!c.eligible));}const d=fixture();d.models[0].pricing={output_per_m:0.5,currency:'CNY'};assert.equal(selectModels(d,{...state,maxPrice:1,currency:'USD'}).candidates[0].eligible,false);});
test('上下文严格识别，不误读营销文本',()=>{assert.equal(contextTokens('1M'),1000000);assert.equal(contextTokens('128K'),128000);assert.equal(contextTokens('up to 1M (beta)'),null);});
test('全零权重、单候选、平局不能给唯一赢家',()=>{assert.equal(selectModels(fixture(),{...state,weights:{writing:0}}).winner,null);assert.equal(selectModels(fixture(),{...state,candidates:['a']}).winner,null);const d=fixture();d.models[1].evidence=[edge(80)];assert.equal(selectModels(d,state).tied,true);});
test('重复证据不增加权重，同协议冲突阻断整个排名',()=>{const d=fixture();d.models[0].evidence.push(edge(80));assert.equal(selectModels(d,state).candidates[0].total,80);d.models[0].evidence.push(edge(95));assert.equal(selectModels(d,state).canRank,false);});
test('关键词解析透明，未知任务不编造映射',()=>{assert.deepEqual(parseGoal('中文长文',useCase).recognized,['writing']);assert.deepEqual(parseGoal('视频生成',useCase).recognized,[]);});
test('URL 状态可复现，非法数值回退，候选必须存在',()=>{const models=fixture().models;const s=readState(new URLSearchParams('goal=中文&context=128000&maxPrice=2&candidates=a'),useCase,models);assert.deepEqual(readState(stateParams(s),useCase,models),s);assert.equal(readState(new URLSearchParams('context=Infinity&w_writing=-9&candidates=missing'),useCase,models).context,0);});
test('候选按规范 URL 去重且不会覆写回填状态',()=>{const a={id:'a',official_urls:['https://www.example.com/model/?id=x'],archive_status:'archived'};assert.equal(canonicalURL('https://example.com/model?id=x&utm_source=foo#top'),canonicalURL(a.official_urls[0]));assert.deepEqual(mergeCandidates([a],[{id:'b',official_urls:['https://example.com/model?id=x']}]),[a]);});

test('真实加载路径按 model_id 绑定证据，不向家族复制',async()=>{
 const {loadBenchData}=await import('../scripts/load-data.mjs');const {selectionData}=await import('../scripts/build-model-pages.mjs');const db=loadBenchData(),data=selectionData(db);
 const gemma=data.models.filter(m=>m.release_id==='gemma-4');assert.equal(gemma.length,4);
 for(const m of gemma)assert.ok(m.evidence.every(e=>e.model_id===m.id));
 assert.equal(gemma.find(m=>m.id==='gemma-4-e2b').context_window,'128K');
 assert.ok(!gemma.find(m=>m.id==='gemma-4-31b').modalities.includes('音频'));
 assert.ok(data.models.find(m=>m.release_id==='qwen-image-2-1').evidence.every(e=>e.status==='pending'&&e.value===null));
 assert.ok(db.coverage.candidates.find(c=>c.id==='gemma-4-12b-unified').release_id===null);
});
test('覆盖状态校验拒绝模型外键错误、空证据假通过和坏精度',async()=>{
 const {validateCoverage}=await import('../scripts/validate-model-coverage.mjs');
 const vendors=[{id:'v',active:true}],r={id:'r',vendor_id:'v',release_date:'2026-09',date_precision:'day',models:[],benchmark_evidence:[],status:'verified'};
 const c={id:'c',vendor_id:'v',family:'f',classification:'vertical',official_urls:['https://example.com/r'],archive_status:'not_archived',evidence_status:'not_reported',release_id:'r',official_source_verified:true};
 const data={vendors:[{vendor_id:'v',allowed_hosts:['example.com'],entries:[{url:'https://example.com',status:'not_scanned'}]}],candidates:[c]};
 const errs=validateCoverage(data,vendors,[r]);assert.ok(errs.some(x=>x.includes('空证据')));assert.ok(errs.some(x=>x.includes('日期精度')));
 r.benchmark_evidence=[{id:'v-r--b',model_id:'ghost',status:'pending',reported_score:{value:4},locator:{row:'b'}}];assert.ok(validateCoverage(data,vendors,[r]).some(x=>x.includes('model 外键')));
});
test('覆盖对账幂等，后增变体不因共享模型卡并入首发',async()=>{
 const {reconcileCoverage}=await import('../scripts/reconcile-coverage.mjs');
 const r={id:'r',vendor_id:'v',models:[{id:'a'}],primary_sources:[{url:'https://example.com/card'}],benchmark_evidence:[]};
 const c={id:'new-variant',vendor_id:'v',family:'new',official_urls:['https://example.com/card'],release_id:null,release_match:'manual'};
 const d={candidates:[c]};const out=reconcileCoverage(d,[r],{});assert.equal(out.candidates[0].release_id,null);assert.deepEqual(reconcileCoverage(out,[r],{}),out);
});


test('本批官方归档文件与 manifest 哈希一致',async()=>{
 const fs=await import('node:fs'),crypto=await import('node:crypto');
 const dirs=['2026-04-02-gemma-4','2026-07-31-seedance-2-5','2026-09-11-kimi-k2-8-preview','2026-09-18-grok-voice-transcribe-2','2026-09-20-qwen-image-2-1','2026-09-22-claude-opus-5-5'];
 for(const dir of dirs){const root='models/'+dir;const manifest=JSON.parse(fs.readFileSync(root+'/manifest.json'));assert.ok(manifest.files.some(f=>f.path==='index.md'));for(const f of manifest.files){assert.ok(!f.path.startsWith('/')&&!f.path.includes('..'));assert.equal(crypto.createHash('sha256').update(fs.readFileSync(root+'/'+f.path)).digest('hex'),f.sha256,root+'/'+f.path);}}
});

test('两个候选同写 unknown 也不算完整协议',()=>{const d=fixture();for(const m of d.models)m.evidence[0].protocol.judge='unknown';assert.equal(selectModels(d,state).canRank,false);});
test('覆盖主来源缺失或损坏返回校验错误而非崩溃',async()=>{const {validateCoverage}=await import('../scripts/validate-model-coverage.mjs');for(const official_urls of [[],['broken']]){const d={vendors:[],candidates:[{id:'x',vendor_id:'v',classification:'general',archive_status:'not_archived',evidence_status:'not_extracted',official_urls}]};assert.ok(validateCoverage(d,[{id:'v',active:false}],[]).some(e=>e.includes('来源')));}});
