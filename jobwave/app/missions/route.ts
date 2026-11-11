import {memberGate} from '../member-access';
import {listHtml,htmlResponse} from './content';
export async function GET(){const membership=await memberGate("/missions");if(membership)return membership;return htmlResponse(listHtml())}
