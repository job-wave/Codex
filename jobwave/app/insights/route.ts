import {memberGate} from '../member-access';
import {listHtml,htmlResponse} from './content';
import {readCatalog} from './store';
export const dynamic='force-dynamic';
export async function GET(request:Request){const membership=await memberGate("/insights");if(membership)return membership;return htmlResponse(listHtml(new URL(request.url).searchParams.get('type')||'all',await readCatalog()))}
