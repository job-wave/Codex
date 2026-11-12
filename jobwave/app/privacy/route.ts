import {page} from '../visitor';
import {identity} from '../api/shared';
import {privacyHtml} from '../legal/content';
export const dynamic='force-dynamic';
export async function GET(){const member=Boolean(await identity());return page('개인정보처리방침',privacyHtml(),member,'/login',{href:'/?view=account',label:'내 계정'},{path:'/privacy',description:'잡웨이브가 수집하는 개인정보 항목, 이용 목적, 보유 기간과 이용자의 권리를 안내합니다.'})}
