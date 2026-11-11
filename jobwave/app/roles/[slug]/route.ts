import {page} from '../../visitor';
import {memberGate} from '../../member-access';
import {articles,articleHtml} from '../content';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{slug:string}>}){const {slug}=await params;const article=articles.find(a=>a.slug===slug);if(!article)return new Response('콘텐츠를 찾을 수 없습니다.',{status:404,headers:{'Cache-Control':'no-store'}});const gate=await memberGate('/roles/'+slug);if(gate)return gate;return page(article.title,articleHtml(article),true)}
