import {identity,config} from './api/shared';
import {headers} from 'next/headers';
export const loginHref=(destination:string)=>'/login?next='+encodeURIComponent(destination);
export async function memberGate(path:string){
 // Scheduled collection may verify its result using the existing server credential.
 if(path==='/api/jobs'){
  const provided=(await headers()).get('X-Jobwave-Refresh-Token'),expected=config().JOB_REFRESH_TOKEN;
  if(provided&&expected&&provided.length<=8192){const hash=async(s:string)=>new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)));const [a,b]=await Promise.all([hash(provided),hash(expected)]);let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];if(!diff)return null;}
 }
 if(await identity())return null;
 if(path.startsWith('/api/'))return Response.json({error:'로그인 후 이용해 주세요.',code:'login_required'},{status:401,headers:{'Cache-Control':'no-store'}});
 return new Response(null,{status:303,headers:{Location:loginHref(path),'Cache-Control':'no-store'}});
}
