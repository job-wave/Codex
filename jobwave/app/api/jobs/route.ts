import {memberGate} from '../../member-access';
import {json} from '../shared';
import {readFeed} from './feed';
export {parseJobs} from './work24';
export const dynamic='force-dynamic';
export async function GET(){const membership=await memberGate("/api/jobs");if(membership)return membership;try{return json(await readFeed(false))}catch{return json({mode:'error',jobs:[],message:'채용 데이터 저장소 연결을 확인하지 못했습니다. 다시 시도해 주세요.'},503)}}
