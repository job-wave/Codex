import {memberGate} from '../../member-access';
import {readCatalog} from '../../insights/store';
import {json} from '../shared';
export const dynamic='force-dynamic';
export async function GET(){const membership=await memberGate("/api/insights");if(membership)return membership;const data=await readCatalog();const {revisionId,requestHash,...publicData}=data;return json({...publicData,contract:'/editorial-update-contract.json'})}
