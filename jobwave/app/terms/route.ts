import {page} from '../visitor';
import {identity} from '../api/shared';
import {termsHtml} from '../legal/content';
export const dynamic='force-dynamic';
export async function GET(){const member=Boolean(await identity());return page('이용약관',termsHtml(),member,'/login',{href:'/?view=account',label:'내 계정'},{path:'/terms',description:'잡웨이브 서비스의 이용 조건과 이용자·운영자의 권리와 의무를 안내합니다.'})}
