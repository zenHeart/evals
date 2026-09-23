import {mkdirSync,writeFileSync,copyFileSync} from 'node:fs';
import {join} from 'node:path';
import {SHELL_CSS,shellHead,shellTopbar,shellFooter,SHELL_JS} from './site-shell.mjs';
import {esc,MODEL_CSS,evidenceHTML,specsHTML,taskMatrixHTML} from './model-ui.mjs';
import {readState,selectModels} from './model-selection.mjs';
export function selectionData(db){
  const models=db.releases.flatMap(r=>r.model_specs.filter(m=>m.id).map(m=>({...m,key:r.id+'--'+m.id,release_id:r.id,release_date:r.release_date,vendor_id:r.vendor_id,vendor_label:r.vendor_label,region:r.region,evidence:r.evidence.filter(e=>e.model_id===m.id)})));
  return {
    asOf:[db.coverage.window_until,...db.releases.flatMap(r=>r.evidence.map(e=>e.last_verified_at))].filter(Boolean).sort().pop()||new Date().toISOString().slice(0,10),
    useCase:db.useCase,
    useCases:db.useCases,
    models
  };
}
function page(title,path,rel,active,body,script=''){
 return `${shellHead({title,desc:title+' · 查看来源、规格与可比性边界',path,rel,extra:`<style>${SHELL_CSS}${MODEL_CSS}</style>`})}</head><body>${shellTopbar(rel,active)}<main id="main-content" class="model-main">${body}</main>${shellFooter()}${SHELL_JS}${script}</body></html>`;
}
function save(dist,path,html){const dir=join(dist,path);mkdirSync(dir,{recursive:true});writeFileSync(join(dir,'index.html'),html);}
const classificationLabels={general:'通用模型',vertical:'专项模型',product:'产品更新',unknown:'类别未确认'};
export function buildModelPages(db,dist){
 const data=selectionData(db);
 mkdirSync(join(dist,'assets'),{recursive:true});
 for(const f of ['model-selection.mjs','model-ui.mjs','choose-client.mjs','models-client.mjs'])copyFileSync(new URL(f,import.meta.url),join(dist,'assets',f));
 writeFileSync(join(dist,'assets','selection-data.json'),JSON.stringify(data));
 const candidateFor=r=>db.coverage.candidates.find(c=>c.release_id===r.id);
 for(const r of db.releases){
  const c=candidateFor(r);
  const body=`<a href="../">← 模型目录</a><h1>${esc(r.models.join(' / ')||r.release_title)}</h1><p>${esc(r.vendor_label)} · ${esc(r.release_date||'官方发布日期未说明')}${r.date_precision==='month'?'（仅精确到月）':''} · ${esc(classificationLabels[c?.classification||'unknown'])}</p>
   <p>${r.source_url?`<a href="${esc(r.source_url)}">官方发布来源</a>`:''} · <a href="../../choose/">按需求选型</a> · <a href="../../coverage/">查看覆盖缺口</a>${c?.archive_path?` · <a href="https://github.com/zenHeart/evals/tree/main/${esc(c.archive_path)}">归档与转录记录</a>`:''}</p>
   ${!r.evidence.length?'<div class="notice">所收录官方页面未披露量化评测。此模型仍可查询，但不能据此进入分数排序。</div>':''}
   ${r.model_specs.map(m=>`<section class="model-card" id="${esc(m.id)}"><h2>${esc(m.name)}</h2><p>${esc(m.capability_summary||'本发布尚无能力概述。')}</p>${specsHTML(m)}<h3>本变体的评测证据</h3>${evidenceHTML(r.evidence.filter(e=>e.model_id===m.id),'../../',data.asOf)}</section>`).join('')}
   ${r.evidence.some(e=>!r.model_specs.some(m=>m.id===e.model_id))?`<section class="model-card"><h2>未关联到本页变体的记录</h2><p>这些记录不会分配给任意模型参与选型。</p>${evidenceHTML(r.evidence.filter(e=>!r.model_specs.some(m=>m.id===e.model_id)),'../../',data.asOf)}</section>`:''}`;
  save(dist,'models/'+r.id,page(r.models.join(' / ')||r.release_title,'models/'+r.id+'/','../../','releases',body));
 }
 const cards=db.releases.map(r=>{const c=candidateFor(r);return `<article class="model-card" data-model data-search="${esc((r.models.join(' ')+' '+r.vendor_label).toLowerCase())}" data-class="${c?.classification||'unknown'}" data-modalities="${esc([...new Set(r.model_specs.flatMap(m=>m.modalities||[]))].join(','))}"><h2><a href="${r.id}/">${esc(r.models.join(' / ')||r.release_title)}</a></h2><p>${esc(r.vendor_label)} · ${esc(r.release_date||'日期未说明')}</p><p>${esc(classificationLabels[c?.classification||'unknown'])} · ${esc([...new Set(r.model_specs.flatMap(m=>m.modalities||[]))].join(' / ')||'输入模态未说明')}</p><p>${r.evidence.length?r.evidence.length+' 条评测记录；是否可比需逐条检查。':'所收录来源未披露量化评测。'}</p></article>`;}).join('');
 save(dist,'models',page('模型目录','models/','../','releases',`<h1>模型目录</h1><p>通用与专项模型都可查询；是否能比较取决于评测证据。<a href="../coverage/">覆盖与缺口</a> · <a href="../releases/">发布时间轴</a></p><form class="model-controls form-row" id="model-filters"><label>搜索模型<input name="q" type="search"></label><label>输入模态<select name="modality"><option value="">全部</option>${['文本','图像','音频','视频'].map(x=>`<option>${x}</option>`).join('')}</select></label><label>模型类别<select name="classification"><option value="">全部</option>${Object.entries(classificationLabels).map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></label><button type="reset">清除筛选</button></form><p id="model-count" role="status"></p><p id="model-empty" hidden>没有匹配模型，清除筛选可恢复全部目录。</p><div class="model-grid">${cards}</div>`,`<script type="module" src="../assets/models-client.mjs"></script>`));
 const stateLabels={not_scanned:'尚未检查',partial:'已检查入口，历史与分页未穷尽',needs_render:'动态内容尚需读取',inaccessible:'本次读取失败'};
 const coverage=db.vendors.filter(v=>v.active).map(v=>{const cov=db.coverage.vendors.find(x=>x.vendor_id===v.id);const cs=db.coverage.candidates.filter(c=>c.vendor_id===v.id);return `<section class="model-card"><h2>${esc(v.display_name)}</h2><p>已收录 ${db.releases.filter(r=>r.vendor_id===v.id).length} 场发布；发现 ${cs.length} 条线索。线索尚需逐项确认，不能代表全部模型。</p><ul>${(cov?.entries||[]).map(e=>`<li><a href="${esc(e.url)}">${esc(e.url)}</a>：${esc(stateLabels[e.status])} · ${esc(e.last_scanned_at||'无检查记录')}${e.failure_reason?' · '+esc(e.failure_reason):''}</li>`).join('')}</ul><details><summary>模型家族与回填清单</summary><ul>${cs.map(c=>`<li><a href="${esc(c.official_urls[0])}">${esc(c.family)}</a> · ${c.release_id?`<a href="../models/${esc(c.release_id)}/">模型档案</a>`:'尚未建档'} · ${esc(c.exclusion_reason|| (c.evidence_status==='not_reported'?'所收录页面没有量化评测':c.archive_status==='archived'?'来源已归档，数值以模型页为准':'需要读取详情并确认是否为模型发布'))}</li>`).join('')||'<li>尚无可确认的模型家族线索，不能据此认定厂商没有发布。</li>'}</ul></details></section>`;}).join('');
 save(dist,'coverage',page('模型覆盖与缺口','coverage/','../','releases',`<h1>模型覆盖与缺口</h1><p>最近检查：${esc(db.coverage.last_scan_at||'尚未开始')}。增量窗口 ${esc(db.coverage.window_since)} 至 ${esc(db.coverage.window_until)}。历史回填独立于此窗口。</p><p class="notice">公开模型目录仍在补全。入口读取成功、模型存在、已建档、已有可比较分数是不同状态；下面逐项显示检查范围和缺口。</p>${coverage}`));
 
 const writingCase = db.useCases['chinese-longform-writing'] || db.useCase;
 const codingCase = db.useCases['coding'];
 const writingMatrix = taskMatrixHTML(writingCase, data.models, '../');
 const codingMatrix = codingCase ? taskMatrixHTML(codingCase, data.models, '../') : '';

 const defaultState=readState(new URLSearchParams(),writingCase,data.models);
 const initial=selectModels(data,defaultState);
 const dimensionCards=writingCase.dimensions.map(d=>`<label>${esc(d.label)}<input type="number" name="w_${d.id}" min="0" max="10" step="1" value="${d.weight}" aria-label="${esc(d.label)}权重"><small>${d.benchmarks.map(id=>`<a href="../benchmarks/${id}/">${esc(writingCase.benchmarks[id]?.name||id)}</a>`).join('、')||'需要自建任务样本'}</small></label>`).join('');

 const chooseBody = `<p class="eyebrow-mono">按任务选型 · 测评对照 · 试用建议</p>
<h1>按任务直接对比与试用建议</h1>
<p>选定具体任务，直接查看该任务核心测评维度的原始记录对照表与试用建议。严格遵循协议可比性原则，绝不把不同协议和单位的分数合成虚假总分。<a href="../models/">查看全部模型</a> · <a href="../coverage/">覆盖状态</a></p>

<div class="task-tabs" role="tablist" aria-label="选择评估任务">
  <button type="button" class="task-tab active" data-task="chinese-longform-writing" id="tab-writing" role="tab" aria-selected="true" aria-controls="panel-writing">📝 文档写作</button>
  <button type="button" class="task-tab" data-task="coding" id="tab-coding" role="tab" aria-selected="false" aria-controls="panel-coding">💻 编程开发</button>
</div>

<div class="task-panel" id="panel-writing" role="tabpanel" aria-labelledby="tab-writing">
  <div class="recommendation-box">
    <h3>💡 文档写作 · 试用建议与依据</h3>
    <p>在文档写作任务下，各基准各有明确侧重点：</p>
    <ul>
      <li><strong>格式约束与指令遵循</strong>：优先参考 <a href="../benchmarks/ifeval/">IFEval</a> 严格准确率（Prompt Strict Acc）。自动化规则判分且协议统一，适合首选过滤；</li>
      <li><strong>中文表达与逻辑对齐</strong>：参考 <a href="../benchmarks/alignbench/">AlignBench</a> 与 <a href="../benchmarks/creative-writing-v3/">Creative Writing v3</a>，但厂商自报多采用不同裁判模型快照，禁止跨厂商排名；</li>
      <li><strong>长文本连贯性</strong>：各家公布多为内部评测（如 Longform Writing / InsCtrl），仅作发布参考，无法横向比较。</li>
    </ul>
    <p><strong>试用建议</strong>：优先选用在 <a href="../benchmarks/ifeval/">IFEval</a> 上具备完整自报且严格得分领先的通用模型；篇章连贯与文风必须以自建业务样本进行盲测复核。</p>
  </div>
  <h2>文档写作测评对照表</h2>
  <p class="muted">横向对比各模型在文档写作相关评测上的原始记录。标有 <span class="col-badge comp">可比协议</span> 的列可在同口径下排序；标有 <span class="col-badge desc">仅作参考</span> 的列仅作描述。</p>
  ${writingMatrix}
</div>

<div class="task-panel" id="panel-coding" role="tabpanel" aria-labelledby="tab-coding" style="display:none;">
  <div class="recommendation-box">
    <h3>💡 编程开发 · 试用建议与依据</h3>
    <p>在编程开发任务下，工程能力分层清晰且基准协议各异：</p>
    <ul>
      <li><strong>终端命令行与工程 Agent</strong>：优先参考 <a href="../benchmarks/terminalbench/">Terminal-Bench</a> 沙箱解决率，衡量 CLI 与环境动手能力；</li>
      <li><strong>复杂代码库真实 Issue 修复</strong>：优先参考 <a href="../benchmarks/swebench-pro/">SWE-bench Pro</a>，反映多文件协同与复杂 Bug 修复上限；</li>
      <li><strong>防污染竞赛算法</strong>：参考 <a href="../benchmarks/lcb/">LiveCodeBench</a> 竞赛评测；</li>
      <li><strong>多文件代码库重构</strong>：参考 <a href="../benchmarks/aider/">Aider Polyglot</a>；传统 <a href="../benchmarks/humaneval/">HumanEval</a> 已高度饱和，仅作为底线防倒退检查。</li>
    </ul>
    <p><strong>试用建议</strong>：Agent 场景优先在 <a href="../benchmarks/terminalbench/">Terminal-Bench</a> 与 <a href="../benchmarks/swebench-pro/">SWE-bench Pro</a> 领先的模型间测试；补全场景参考 <a href="../benchmarks/lcb/">LiveCodeBench</a>。禁止跨协议加权合成总分。</p>
  </div>
  <h2>编程开发测评对照表</h2>
  <p class="muted">横向对比各模型在编程评测上的原始记录。点击基准名称可查看测试对象与局限，点击分数可查看原始来源与评测协议。</p>
  ${codingMatrix}
</div>

<details class="model-card" id="refine-drawer">
  <summary>⚙️ 收窄候选与权重微调（可选进阶过滤）</summary>
  <p class="muted">有具体硬件模态、上下文窗口或成本上限时，可在下方设置硬约束过滤候选，或自定义各维度权重计算优先级。</p>
  <form id="choose-form" class="model-controls">
    <label>我想完成什么（输入目标自动识别关键词）
      <textarea name="goal" placeholder="例如：编程开发，需要大上下文且重视终端 Agent 操作"></textarea>
    </label>
    <p class="form-row"><button type="button" id="parse-goal">提取任务维度</button></p>
    <p id="parse-note" role="status">解析仅识别关键词，维度与硬约束由你确认。不会调用付费 API。</p>
    <h2>确认维度与权重</h2>
    <p>0 表示不纳入本次需求，10 表示最重视。</p>
    <div class="weights">${dimensionCards}</div>
    <h2>硬约束</h2>
    <div class="form-row">
      <label>输入模态<select name="modality"><option value="">不限</option>${['文本','图像','音频','视频'].map(x=>`<option>${x}</option>`).join('')}</select></label>
      <label>最少上下文 tokens<input name="context" type="number" min="0" value="0"></label>
      <label>最高输出单价 / 百万 tokens<input name="maxPrice" type="number" min="0" step="any" placeholder="不限"></label>
      <label>货币<select name="currency"><option>USD</option><option>CNY</option></select></label>
      <label>厂商所属区域<select name="region"><option value="">不限</option><option value="CN">中国</option><option value="GLOBAL">国际</option></select></label>
      <label>部署方式<select name="deployment"><option value="">不限</option><option value="local">本地</option><option value="api">API</option></select></label>
    </div>
    <p class="muted">厂商所属区域不代表服务可用地区。部署、服务可用性、延迟未有完整证据；选定但无法确认的约束不视为通过。</p>
    <details>
      <summary>选择候选模型（未勾选时检查全部）</summary>
      <label>候选模型<select name="candidates" multiple size="7">${data.models.map(m=>`<option value="${esc(m.key)}">${esc(m.vendor_label+' · '+m.name+' · '+(m.release_date||'日期未说明'))}</option>`).join('')}</select></label>
    </details>
    <p class="form-row">
      <button class="primary" type="submit">查看证据与试用建议</button>
      <button type="reset">清除条件</button>
      <button type="button" id="relax">放宽硬约束</button>
    </p>
  </form>
  <div id="selection-status" class="notice" role="status">${esc(initial.message)}</div>
  <div id="selection-results">
    <p>启用浏览器脚本后可计算需求结果；<a href="../models/">模型档案与原始来源</a>始终可阅读。</p>
  </div>
</details>

<section class="model-card">
  <h2>怎么读这个结果</h2>
  <p>${esc(db.useCase.normalization)}</p>
  <p>${esc(db.useCase.uncertainty)}</p>
  <p>推荐仅指下一轮试用顺序。营销标签、图中尚未转录的数值、厂商内部评测和协议缺失项不会被混成总分。缺失维度不填 0，也不自动重新分配权重。</p>
</section>

<section class="model-card" id="business-eval">
  <h2>下一步：用自己的业务任务复核</h2>
  <p>准备一组覆盖目标技术栈、文体风格、长文连贯、事实引用与格式约束的真实业务样本；固定提示词与评分标准，让异源评委或人工盲评，保留失败示例与成本。</p>
  <a href="../book/chapter-24/">建立测试集</a> · <a href="../book/chapter-05/">设计评分标准</a> · <a href="../build/">运行评估流水线</a>
</section>`;

 save(dist,'choose',page('按任务直接对比与试用建议','choose/','../','choose',chooseBody,`<script type="module" src="../assets/choose-client.mjs"></script>`));
 return ['/choose/','/models/','/coverage/',...db.releases.map(r=>'/models/'+r.id+'/')];
}

