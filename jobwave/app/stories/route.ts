import {memberGate} from '../member-access';
import {listHtml,htmlResponse} from './content';
export async function GET(request:Request){const membership=await memberGate("/stories");if(membership)return membership;return htmlResponse(listHtml(new URL(request.url).searchParams.get('audience')||'all'))}
