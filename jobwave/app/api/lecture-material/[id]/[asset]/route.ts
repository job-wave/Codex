import {env} from 'cloudflare:workers';
import {memberGate} from '../../../../member-access';
import {lectures} from '../../../../lectures/catalog';
export const dynamic='force-dynamic';
export async function GET(req:Request,{params}:{params:Promise<{id:string;asset:string}>}){
 const gate=await memberGate('/api/lecture-material');if(gate)return gate;
 const {id,asset}=await params;const lecture=lectures.find(l=>l.id===id&&l.published!==false);const material=lecture?.materials?.find(m=>m.id===asset);
 if(!material)return new Response('Not found',{status:404});
 const object=await (env as unknown as {BUCKET:R2Bucket}).BUCKET.get('lectures/'+id+'/'+asset);
 if(!object)return new Response('자료 준비 중',{status:503,headers:{'Cache-Control':'no-store'}});
 return new Response(object.body,{headers:{'Content-Type':material.contentType,'Content-Length':String(object.size),'Content-Disposition':`attachment; filename="${asset}.${material.contentType==='application/pdf'?'pdf':'zip'}"; filename*=UTF-8''${encodeURIComponent(material.filename)}`,'Cache-Control':'private,no-store','X-Content-Type-Options':'nosniff'}});
}
