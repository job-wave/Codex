import {page} from '../visitor';
import {loginHref,memberGate} from '../member-access';
import {libraryHtml} from './content';
export const dynamic='force-dynamic';
export async function GET(request:Request){const member=!(await memberGate('/roles'));return page('직무 가이드·현직자 인터뷰',libraryHtml(new URL(request.url).searchParams.get('type')||'all',member),member,loginHref('/roles'),undefined,{path:'/roles',description:'마케팅·영업·인사·개발·데이터 등 직무가 실제로 하는 일과 직무 간 차이, 현직자 공개 인터뷰 요약을 짧게 읽어보세요.'})}
