import fs from 'node:fs';
import path from 'node:path';
import {canonicalURL} from './release-discovery.mjs';
export function validateCoverage(data,vendors,releases,root){
 const errors=[],ids=new Set(),urls=new Set();
 const byRelease=new Map(releases.map(r=>[r.id,r]));
 for(const vendor of vendors.filter(v=>v.active)){
  const entries=data.vendors.filter(v=>v.vendor_id===vendor.id);
  if(entries.length!==1||!entries[0].entries?.length)errors.push(vendor.id+': 需要唯一的覆盖入口记录');
 }
 for(const v of data.vendors){
  if(!vendors.some(x=>x.id===v.vendor_id))errors.push(v.vendor_id+': vendor 外键不存在');
  for(const e of v.entries){
   if(!['not_scanned','partial','needs_render','inaccessible'].includes(e.status))errors.push(e.url+': 扫描状态非法');
   try{const u=new URL(e.url);if(u.protocol!=='https:'||!v.allowed_hosts.includes(u.hostname))errors.push(e.url+': 不在官方入口白名单');}catch{errors.push('入口 URL 非法');}
   if(e.status!=='not_scanned'&&!e.last_scanned_at)errors.push(e.url+': 缺扫描时间');
   if(['needs_render','inaccessible'].includes(e.status)&&!e.failure_reason)errors.push(e.url+': 缺失败原因');
  }
 }
 for(const c of data.candidates){
  if(ids.has(c.id))errors.push(c.id+': 候选 id 重复');ids.add(c.id);
  if(!vendors.some(v=>v.id===c.vendor_id))errors.push(c.id+': vendor 外键不存在');
  if(!['general','vertical','product','unknown'].includes(c.classification))errors.push(c.id+': 分类非法');
  if(!['not_archived','archived'].includes(c.archive_status))errors.push(c.id+': 归档状态非法');
  if(!['reported','not_extracted','not_reported'].includes(c.evidence_status))errors.push(c.id+': 证据状态非法');
  if(!Array.isArray(c.official_urls)||!c.official_urls.length)errors.push(c.id+': 缺官方来源');
  for(const url of c.official_urls||[]){try{if(new URL(url).protocol!=='https:')errors.push(c.id+': 来源须 HTTPS');}catch{errors.push(c.id+': 来源 URL 非法');}}
  try{const key=canonicalURL(c.official_urls?.[0]);if(urls.has(key))errors.push(c.id+': 候选来源重复');urls.add(key);}catch{errors.push(c.id+': 候选主来源 URL 非法');}
  const r=byRelease.get(c.release_id);
  if(c.release_id&&!r)errors.push(c.id+': release 外键不存在');
  if(r&&r.vendor_id!==c.vendor_id)errors.push(c.id+': release 厂商不一致');
  if(c.classification==='vertical'&&c.exclusion_reason)errors.push(c.id+': 专项模型不能因分类被排除');
  if(c.archive_status==='archived'&&root){
   const p=path.resolve(root,c.archive_path||'');if(!p.startsWith(path.resolve(root,'models')+path.sep)||!fs.existsSync(path.join(p,'index.md')))errors.push(c.id+': 归档路径缺失或越界');
  }
  // 本轮独立核验的新档案必须满足变体/日期/来源契约；旧档案不伪称本轮重验。
  if(r&&c.official_source_verified){
   const modelIDs=new Set();for(const m of r.models){if(!m.id||modelIDs.has(m.id))errors.push(r.id+': 变体 id 缺失/重复');modelIDs.add(m.id);for(const k of ['params','context_window','pricing','modalities','capability_summary','key_traits'])if(!(k in m))errors.push(r.id+': 缺规格 '+k);}
   for(const e of r.benchmark_evidence){if(!modelIDs.has(e.model_id))errors.push(e.id+': model 外键不存在');if(!e.locator||!Object.values(e.locator).some(Boolean))errors.push(e.id+': 无来源定位');if(e.status==='pending'&&e.reported_score.value!==null)errors.push(e.id+': pending 不得填数值');}
   if(!r.benchmark_evidence.length&&r.status!=='pending')errors.push(r.id+': 空证据档必须 pending');
   if(r.release_date&&((r.date_precision==='day'&&!/^\d{4}-\d{2}-\d{2}$/.test(r.release_date))||(r.date_precision==='month'&&!/^\d{4}-\d{2}$/.test(r.release_date))))errors.push(r.id+': 日期精度不符');
  }
 }
 return errors;
}
