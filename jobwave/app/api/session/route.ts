import { identity,config,json,hasOpenAIKey } from '../shared';
import { chatGPTSignInPath,chatGPTSignOutPath } from '../../chatgpt-auth';
export const dynamic='force-dynamic';
export async function GET(){const user=await identity();const c=config();return json({user:user?{name:user.displayName,provider:user.userId.startsWith('supabase:')?'email':'chatgpt'}:null,signIn:chatGPTSignInPath('/'),signOut:chatGPTSignOutPath('/'),capabilities:{emailAuth:true,jobs:true,ai:hasOpenAIKey()&&!!c.OPENAI_MODEL,storage:!!c.DB,consultationAdmin:!!user&&!!c.CONSULTATION_ADMIN_EMAIL&&user.email.toLowerCase()===c.CONSULTATION_ADMIN_EMAIL.toLowerCase()}})}
