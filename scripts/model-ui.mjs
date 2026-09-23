export const esc = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const MODEL_CSS=`
*{box-sizing:border-box}body{margin:0;font:15px/1.65 system-ui,sans-serif}.model-main{max-width:1120px;margin:auto;padding:32px 20px 64px}.model-main h1{font-size:clamp(28px,5vw,42px);line-height:1.2}.model-main h2{font-size:22px}.muted{color:var(--graphite)}.model-card,.model-controls,.notice{border:1px solid var(--rule);background:var(--card);border-radius:8px;padding:20px;margin:16px 0;overflow-wrap:anywhere}.notice{border-left:4px solid var(--pin)}.model-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr));gap:16px}.model-grid .model-card{margin:0}.model-main label{display:block}.model-main input,.model-main select,.model-main textarea,.model-main button{font:inherit;color:var(--ink);background:var(--card);border:1px solid var(--rule);border-radius:5px;padding:8px;max-width:100%}.model-main input[type=number]{width:130px}.model-main textarea{width:100%;min-height:80px}.model-main button{cursor:pointer}.model-main button:hover{border-color:var(--pin)}.model-main .primary{background:var(--ink);color:var(--paper)}.form-row{display:flex;gap:12px;flex-wrap:wrap;align-items:end}.form-row>*{min-width:0}.weights{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px}.model-main summary{cursor:pointer;font-weight:600}.model-main details{margin:10px 0}.model-table{width:100%;border-collapse:collapse;table-layout:fixed}.model-table th,.model-table td{padding:10px;text-align:left;vertical-align:top;border-bottom:1px solid var(--rule);overflow-wrap:anywhere}.model-table th{color:var(--graphite)}.tag{display:inline-block;border:1px solid var(--rule);padding:1px 7px;border-radius:4px;font-size:12px;margin:2px}.model-main pre{white-space:pre-wrap;overflow-wrap:anywhere}.model-main small{display:block}.model-main .positive{color:var(--ok)}.model-main .negative{color:var(--warn)}.model-main fieldset{border:1px solid var(--rule);border-radius:6px;min-width:0}.evidence-row{border-bottom:1px solid var(--rule);padding:12px 0}.model-main :target{outline:2px solid var(--pin);outline-offset:4px}@media(max-width:600px){.model-main{padding:20px 14px}.model-card,.model-controls,.notice{padding:14px}.model-table th,.model-table td{font-size:12px;padding:6px}.weights{grid-template-columns:1fr 1fr}}
`;
export function evidenceScoreLabel(e) {
  if(e.status === 'verified' && e.score_status === 'reported') return e.display || String(e.value);
  if(e.score_status === 'not_reported') return '官方未公布数值';
  return e.status === 'pending' ? '图表尚无可读数值' : '该来源尚无可读数值';
}
export function evidenceHTML(rows,rel='../../',asOf='') {
  if(!rows.length)return '<p class="muted">尚无对应评测记录。缺少证据不代表能力为零。</p>';
  return rows.map(e=>{
    const score=evidenceScoreLabel(e);
    const age=asOf&&e.last_verified_at?Math.floor((Date.parse(asOf)-Date.parse(e.last_verified_at))/86400000):null;
    return `<section class="evidence-row" id="${esc(e.id)}"><a href="${rel}benchmarks/${esc(e.benchmark_id)}/">${esc(e.benchmark_id)}</a> <strong>${esc(score)}</strong>
    <small>模型 ${esc(e.model_id||'未标明')} · 版本 ${esc(e.variant||'未说明')} · 指标 ${esc(e.metric||'未说明')} · 单位 ${esc(e.unit||'未说明')}</small>
    <small>来源等级 ${esc(e.source_tier||'未说明')} · ${esc(e.attribution||'归属未说明')} · 核对日期 ${esc(e.last_verified_at||'未说明')}${age!==null?' · 距快照 '+age+' 天':''}</small>
    ${e.reason?`<p class="negative">不参与排序：${esc(e.reason)}</p>`:''}
    <p>归一化读数：${e.reason||e.normalized==null?'不计算':esc(e.normalized.toFixed(2))}；样本及方差不完整，无法计算置信区间。</p>
    <details><summary>原文位置与完整协议</summary><p>${esc(Object.entries(e.locator||{}).filter(([,v])=>v).map(([k,v])=>k+': '+v).join(' · ')||'未提供原文定位')}</p><pre>${esc(JSON.stringify(e.protocol||{},null,2))}</pre><p>${esc(e.notes||'')}</p><p>${e.url?`<a href="${esc(e.url)}" target="_blank" rel="noopener">打开官方来源</a>`:'未提供来源'}</p></details></section>`;
  }).join('');
}
export function specsHTML(m){
  const p=m.pricing;
  return `<dl><dt>输入模态</dt><dd>${esc(m.modalities?.join(' / ')||'官方资料未说明')}</dd><dt>上下文</dt><dd>${esc(m.context_window||'官方资料未说明')}</dd><dt>参数</dt><dd>${esc(m.params||'官方资料未说明')}</dd><dt>价格（每百万 tokens）</dt><dd>${p?`${esc(p.currency)} 输入 ${esc(p.input_per_m??'未说明')} / 输出 ${esc(p.output_per_m??'未说明')}${p.note?' · '+esc(p.note):''}`:'无此口径报价；不等于免费'}</dd></dl>`;
}
export function benchmarkScopeHTML(id,useCase,rel='../../'){
  const b=useCase.benchmarks[id]; if(!b)return '';
  return `<section class="callout"><h2>用于写作选型时怎么看</h2><p>测什么：${esc(b.measures)}</p><p>不测什么：${esc(b.does_not_measure)}</p><p>语言与文体：${esc(b.language_scope)}</p><p>指标与单位：${esc(b.metric||'见逐条记录，未披露项不能比较')} / ${esc(b.unit||'以原始来源为准')}</p><p>可比性：${esc(b.reason)}</p><p>说明日期：${esc(b.data_date)}；具体分数的协议、来源等级和核对日期以每条发布记录为准。</p><a href="${rel}choose/">进入写作需求选型</a></section>`;
}
