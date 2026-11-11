import assets from '../member-assets';
import {identity} from '../api/shared';
export const dynamic='force-dynamic';
export async function GET(req:Request,{params}: {params:Promise<{asset:string}>}){
 const {asset}=await params;
 const value=(assets as Record<string,string>)[asset];
 if(value===undefined)return new Response('Not found',{status:404});
 if(!await identity())return Response.json({error:'로그인 후 이용해 주세요.'},{status:401,headers:{'Cache-Control':'no-store'}});
 return new Response(value,{headers:{'Content-Type':asset.endsWith('.js')?'application/javascript; charset=utf-8':'application/json; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
}
