import {memberGate} from '../../member-access';
import {insights,detailHtml,htmlResponse,documentHtml} from '../content';
import {readCatalog,findArticle} from '../store';
export const dynamic='force-dynamic';
export async function GET(request:Request,context:{params:Promise<{slug:string}>}){const membership=await memberGate(new URL(request.url).pathname);if(membership)return membership;const {slug}=await context.params;const {article:item,unavailable}=await findArticle(slug);if(unavailable)return htmlResponse(documentHtml('콘텐츠 연결 확인 중','잠시 후 다시 확인해 주세요.','/insights','<div class="guide-not-found"><h1>콘텐츠를 불러오지 못했어요.</h1><a href="/insights">브리핑 목록으로 이동</a></div>'),503);return item?htmlResponse(detailHtml(item,(await readCatalog()).items)):htmlResponse(documentHtml('콘텐츠를 찾을 수 없습니다','커리어 브리핑과 기업 분석을 확인해 보세요.','/insights','<div class="guide-not-found"><h1>콘텐츠를 찾을 수 없어요.</h1><a class="primary" href="/insights">브리핑·기업 분석으로 이동 ↗</a></div>'),404)}
