#!/usr/bin/env node
import fs from 'node:fs';
import {collectReleases} from './load-data.mjs';
import {canonicalURL,mergeCandidates} from './release-discovery.mjs';
export function reconcileCoverage(data,releases,archives){
 const known=new Map(releases.flatMap(r=>(r.primary_sources||[]).map(s=>[canonicalURL(s.url),r])));
 const out={...data,candidates:data.candidates.map(c=>({...c}))};
 for(const r of releases){
  if(!r.primary_sources?.length)continue;
  if(!out.candidates.some(c=>c.release_id===r.id||c.official_urls.some(u=>known.get(canonicalURL(u))?.id===r.id)))out.candidates.push({id:'release-'+r.id,vendor_id:r.vendor_id,family:r.models.map(m=>m.name||m.id).join(' / ')||r.release_title,classification:'unknown',official_urls:r.primary_sources.map(s=>s.url),discovery_status:'discovered',official_source_verified:false,release_id:r.id,archive_status:'not_archived',evidence_status:'not_extracted',exclusion_reason:null,next_backfill_at:null});
 }
 for(const c of out.candidates){
  if(c.release_match === "manual") continue;
  const r=releases.find(r=>r.id===c.release_id)||c.official_urls.map(u=>known.get(canonicalURL(u))).find(Boolean);
  if(!r)continue;
  c.release_id=r.id;c.family=r.models.map(m=>m.name||m.id).join(' / ')||r.release_title;
  c.archive_path=archives[r.id]||c.archive_path||null;c.archive_status=c.archive_path?'archived':'not_archived';
  c.evidence_status=r.benchmark_evidence.some(e=>e.status==='verified'&&e.reported_score?.score_status==='reported')?'reported':r.benchmark_evidence.length?'not_extracted':'not_reported';
  c.next_backfill_at=null;
 }
 out.candidates=mergeCandidates([],out.candidates);return out;
}
if(process.argv[1]?.endsWith('/reconcile-coverage.mjs')||process.argv[1]==='scripts/reconcile-coverage.mjs'){
 const file='data/model-coverage.json',data=JSON.parse(fs.readFileSync(file));
 const archives={};for(const d of fs.readdirSync('models',{withFileTypes:true})){if(!d.isDirectory())continue;const p='models/'+d.name+'/index.md';if(!fs.existsSync(p))continue;const id=fs.readFileSync(p,'utf8').match(/^release:\s*["']?([a-z0-9-]+)/m)?.[1];if(id)archives[id]='models/'+d.name;}
 fs.writeFileSync(file,JSON.stringify(reconcileCoverage(data,collectReleases(),archives),null,2)+'\n');
}
