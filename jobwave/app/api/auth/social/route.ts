import { z } from 'zod';
import { body,json,sameOrigin } from '../../shared';
import { socialProviders,startSocial,verifierCookie,allowedOrigin } from '../../../social-auth';
export const dynamic='force-dynamic';
export async function GET(){return json({providers:await socialProviders()})}
export async function POST(req:Request){
  const origin=new URL(req.url).origin;
  if(!sameOrigin(req)||!allowedOrigin(origin))return json({error:'잘못된 요청입니다.'},403);
  try{
    const input=z.object({provider:z.enum(['kakao','google'])}).strict().safeParse(await body(req,500));
    if(!input.success)return json({error:'로그인 방법을 확인해 주세요.'},400);
    if(!(await socialProviders()).includes(input.data.provider))return json({error:'아직 연결되지 않은 로그인 방법입니다. 이메일로 계속해 주세요.'},503);
    const {url,verifier}=await startSocial(input.data.provider,origin);
    return verifierCookie(json({url}),verifier);
  }catch{return json({error:'간편 로그인에 연결하지 못했습니다. 이메일로 계속해 주세요.'},503)}
}
