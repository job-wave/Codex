import {memberGate} from '../../member-access';
import {detailHtml} from '../content';
import {htmlResponse} from '../../guides/content';
import {readFeed} from '../../api/jobs/feed';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{slug:string}>}){const membership=await memberGate(new URL(request.url).pathname);if(membership)return membership;const {slug}=await params;let feed;if(slug==='market'){try{feed=await readFeed(false)}catch{feed={jobs:[],mode:'error',checkedAt:null}}}const html=detailHtml(slug,feed,new URL(request.url).searchParams.get('role')||'all');return html?htmlResponse(html):htmlResponse('<h1>찾을 수 없는 정보입니다.</h1><a href="/resources">실용 정보로 돌아가기</a>',404)}
