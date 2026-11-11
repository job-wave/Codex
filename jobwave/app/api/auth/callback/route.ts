import { cookies } from 'next/headers';
import { authRequest,sessionCookies,verifiedUser } from '../../../email-auth';
import { VERIFIER_COOKIE,verifierCookie,allowedOrigin } from '../../../social-auth';
export const dynamic='force-dynamic';
export async function GET(req:Request){
  const url=new URL(req.url),origin=url.origin;
  if(!allowedOrigin(origin))return new Response('Invalid origin',{status:400});
  const finish=(ok:boolean)=>verifierCookie(new Response(null,{status:303,headers:{Location:origin+'/login?auth='+ (ok?'complete':'error'),'Cache-Control':'no-store','Referrer-Policy':'no-referrer'}}));
  const verifier=(await cookies()).get(VERIFIER_COOKIE)?.value;
  const code=url.searchParams.get('code');
  if(url.searchParams.has('error')||!code||code.length>2048||!verifier||!/^[a-f0-9]{64}$/.test(verifier))return finish(false);
  try{
    const response=await authRequest('/token?grant_type=pkce',{auth_code:code,code_verifier:verifier});
    if(!response.ok)return finish(false);
    const session=await response.json() as any;
    if(!session.access_token||!session.refresh_token||!verifiedUser(session.user))return finish(false);
    return sessionCookies(finish(true),session);
  }catch{return finish(false)}
}
