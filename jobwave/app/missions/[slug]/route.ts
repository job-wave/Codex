import {memberGate} from '../../member-access';
import {missions,detailHtml,htmlResponse} from '../content';
import {documentHtml} from '../../guides/content';
export async function GET(req:Request,context:{params:Promise<{slug:string}>}){const membership=await memberGate(new URL(req.url).pathname);if(membership)return membership;const {slug}=await context.params;const m=missions.find(x=>x.slug===slug);return m?htmlResponse(detailHtml(m)):htmlResponse(documentHtml('미션을 찾을 수 없습니다','다른 직무 미션을 살펴보세요.','/missions','<div class="guide-not-found"><h1>미션을 찾을 수 없어요.</h1><a href="/missions" class="primary">직무 한 입으로 이동 ↗</a></div>'),404)}
