#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {canonicalURL,mergeCandidates,discoverLinks,classifyTitle} from '../../../../scripts/release-discovery.mjs';
const root=process.cwd(), file=path.join(root,'data/model-coverage.json');
const data=JSON.parse(fs.readFileSync(file));
const apply=process.argv.includes('--write');
const now=new Date().toISOString();
for(const vendor of data.vendors){
  for(const entry of vendor.entries){
    entry.last_scanned_at=now;
    try{
      let url=entry.url, response;
      for(let n=0;n<5;n++){
        if(!vendor.allowed_hosts.includes(new URL(url).hostname))throw Error('redirect host outside official allowlist');
        response=await fetch(url,{method:'GET',redirect:'manual',signal:AbortSignal.timeout(12000)});
        if(response.status>=300&&response.status<400){url=new URL(response.headers.get('location'),url).href;continue;}break;
      }
      if(!response.ok)throw Error('HTTP '+response.status);
      const html=await response.text();
      entry.content_sha256=crypto.createHash('sha256').update(html).digest('hex');
      const links=discoverLinks(html,url).filter(l=>vendor.allowed_hosts.includes(new URL(l.url).hostname));
      entry.status=links.length?'partial':'needs_render';
      entry.failure_reason=links.length?null:'静态页面未提取到模型链接，需要渲染或人工读取；不代表没有模型。';
      const candidates=links.map(l=>({id:vendor.vendor_id+'-'+crypto.createHash('sha256').update(canonicalURL(l.url)).digest('hex').slice(0,12),vendor_id:vendor.vendor_id,family:l.title,classification:classifyTitle(l.title),official_urls:[l.url],discovery_status:'discovered',official_source_verified:false,release_id:null,archive_status:'not_archived',evidence_status:'not_extracted',exclusion_reason:null,next_backfill_at:now.slice(0,10),discovered_at:now}));
      data.candidates=mergeCandidates(data.candidates,candidates);
    }catch(e){entry.status='inaccessible';entry.failure_reason=e.message;}
    console.log(vendor.vendor_id,entry.status,entry.url);
  }
}
data.last_scan_at=now;
data.note='入口扫描是候选发现，分页、动态页及历史模型仍需回填。partial 不表示完整覆盖；日期未知候选不受增量窗口排除。';
if(apply)fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
else console.log(JSON.stringify(data,null,2));
