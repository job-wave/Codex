import {env} from 'cloudflare:workers';
import {memberGate} from '../../../member-access';
import {lectures} from '../../../lectures/catalog';
export const dynamic='force-dynamic';
export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){
 const gate=await memberGate('/api/lecture-media');if(gate)return gate;
 const {id}=await params;if(!lectures.some(l=>l.id===id&&l.published!==false))return new Response(null,{status:404});
 const bucket=(env as unknown as {BUCKET:R2Bucket}).BUCKET;
 const head=await bucket.head('lectures/'+id+'.mp4');if(!head)return new Response('영상 준비 중',{status:503,headers:{'Cache-Control':'no-store'}});
 let range:undefined|{offset:number;length:number};const raw=req.headers.get('range');
 const headers=new Headers({'Content-Type':'video/mp4','Cache-Control':'private, no-store','Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff'});
 if(raw){const m=/^bytes=(\d*)-(\d*)$/.exec(raw);if(!m||(!m[1]&&!m[2])){headers.set('Content-Range',`bytes */${head.size}`);return new Response(null,{status:416,headers})}
 const start=m[1]?Number(m[1]):Math.max(0,head.size-Number(m[2]));const end=m[1]?(m[2]?Math.min(Number(m[2]),head.size-1):head.size-1):head.size-1;
 if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=head.size||end<start){headers.set('Content-Range',`bytes */${head.size}`);return new Response(null,{status:416,headers})}range={offset:start,length:end-start+1};headers.set('Content-Range',`bytes ${start}-${end}/${head.size}`)}
 const object=await bucket.get(head.key,range?{range}:{});if(!object)return new Response(null,{status:404});headers.set('Content-Length',String(range?.length??head.size));return new Response(object.body,{status:range?206:200,headers});
}
