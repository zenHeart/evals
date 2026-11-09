#!/usr/bin/env node
import fs from 'node:fs';
import {collectReleases} from './load-data.mjs';
import {canonicalURL,mergeCandidates} from './release-discovery.mjs';
// 路径末段里这些词是「栏目页」而不是模型标识，拿它们做 slug 回填会把候选误挂到同站别的模型上。
const GENERIC_SLUGS=new Set(['blog','news','models','model','index','show','post','posts','article','articles','search','docs','guide','guides','list','page','home','en','zh','readme']);
// 从 URL 取模型 slug：优先 ?id=（qwen.ai/blog?id=<model> 这类按 id 寻址的官方站），
// 否则取路径末段；带 query 但没有 id 的（如 ?utm_source=…）退回路径末段。
function slugOf(raw){
 try{
  const u=new URL(raw);
  const id=u.searchParams.get('id');
  if(id && id.length>2) return id.toLowerCase();
  return (u.pathname.split('/').filter(Boolean).pop()||'').toLowerCase();
 }catch{return '';}
}
export function reconcileCoverage(data,releases,archives){
 const known=new Map(releases.flatMap(r=>(r.primary_sources||[]).map(s=>[canonicalURL(s.url),r])));
 const out={...data,candidates:data.candidates.map(c=>({...c}))};
 for(const r of releases){
  if(!r.primary_sources?.length)continue;
  if(!out.candidates.some(c=>c.release_id===r.id||c.official_urls.some(u=>known.get(canonicalURL(u))?.id===r.id)))out.candidates.push({id:'release-'+r.id,vendor_id:r.vendor_id,family:r.models.map(m=>m.name||m.id).join(' / ')||r.release_title,classification:'unknown',official_urls:r.primary_sources.map(s=>s.url),discovery_status:'discovered',official_source_verified:false,release_id:r.id,archive_status:'not_archived',evidence_status:'not_extracted',exclusion_reason:null,next_backfill_at:null});
 }
  for(const c of out.candidates){
   if(c.release_match === "manual") continue;
   let r=releases.find(r=>r.id===c.release_id)||c.official_urls.map(u=>known.get(canonicalURL(u))).find(Boolean);
   if(!r && c.vendor_id && c.official_urls?.[0]){
     try{
       // slug 取模型标识：优先 query 的 id 参数（如 qwen.ai/blog?id=<model>），
       // 否则取路径末段。末段过短或过于通用（如 "blog"）时不做匹配，避免误挂到别的模型。
       const candSlug=slugOf(c.official_urls[0]);
       if(candSlug && candSlug.length > 2 && !GENERIC_SLUGS.has(candSlug)){
         const hits=releases.filter(rel=>rel.vendor_id===c.vendor_id && (rel.id===candSlug || (rel.primary_sources||[]).some(s=>slugOf(s.url)===candSlug)));
         if(hits.length===1) r=hits[0];   // 唯一命中才回填；多个候选时不猜
       }
     }catch{}
   }
   if(!r)continue;
   c.release_id=r.id;c.family=r.models.map(m=>m.name||m.id).join(' / ')||r.release_title;
   c.archive_path=archives[r.id]||c.archive_path||null;c.archive_status=c.archive_path?'archived':'not_archived';
   c.evidence_status=r.benchmark_evidence.some(e=>e.status==='verified'&&e.reported_score?.score_status==='reported')?'reported':r.benchmark_evidence.length?'not_extracted':'not_reported';
   c.exclusion_reason=null;
   c.next_backfill_at=null;
  }
 out.candidates=mergeCandidates([],out.candidates);return out;
}
if(process.argv[1]?.replace(/\\/g, '/').endsWith('/reconcile-coverage.mjs')||process.argv[1]==='scripts/reconcile-coverage.mjs'){
 const file='data/model-coverage.json',data=JSON.parse(fs.readFileSync(file));
 const archives={};for(const d of fs.readdirSync('models',{withFileTypes:true})){if(!d.isDirectory())continue;const p='models/'+d.name+'/index.md';if(!fs.existsSync(p))continue;const id=fs.readFileSync(p,'utf8').match(/^release:\s*["']?([a-z0-9-]+)/m)?.[1];if(id)archives[id]='models/'+d.name;}
 fs.writeFileSync(file,JSON.stringify(reconcileCoverage(data,collectReleases(),archives),null,2)+'\n');
}
