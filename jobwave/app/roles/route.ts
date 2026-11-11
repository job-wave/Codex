import {page} from '../visitor';
import {loginHref,memberGate} from '../member-access';
import {libraryHtml} from './content';
export const dynamic='force-dynamic';
export async function GET(request:Request){const member=!(await memberGate('/roles'));return page('직무 가이드·현직자 인터뷰',libraryHtml(new URL(request.url).searchParams.get('type')||'all',member),member,loginHref('/roles'))}
