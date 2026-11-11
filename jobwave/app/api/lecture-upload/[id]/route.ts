import {env} from 'cloudflare:workers';
import {config,json} from '../../shared';
import {lectures} from '../../../lectures/catalog';
export const dynamic='force-dynamic';
// Restricted ingestion endpoint: browser members cannot upload or overwrite videos.
export async function PUT(req:Request,{params}:{params:Promise<{id:string}>}){
 const expected=config().JOB_REFRESH_TOKEN,provided=req.headers.get('X-Jobwave-Refresh-Token');
 if(!expected||!provided||provided.length>8192)return json({error:'Unauthorized'},401);
 const digest=async(s:string)=>new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)));const a=await digest(expected),b=await digest(provided);let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];if(diff)return json({error:'Unauthorized'},401);
 const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)return json({error:'Forbidden'},403);
 const {id}=await params;const lecture=lectures.find(l=>l.id===id);if(!lecture)return json({error:'Not found'},404);
 const size=Number(req.headers.get('content-length'));if(!req.body||size!==lecture.bytes||req.headers.get('content-type')!=='video/mp4')return json({error:'Invalid video'},400);
 const object=await (env as unknown as {BUCKET:R2Bucket}).BUCKET.put('lectures/'+id+'.mp4',req.body,{httpMetadata:{contentType:'video/mp4'}});
 return json({ok:true,id,size:object.size,etag:object.etag});
}
