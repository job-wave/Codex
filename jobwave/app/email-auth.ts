import { cookies } from 'next/headers';
import type { ChatGPTUser } from './chatgpt-auth';

// Publishable client key only. Administrative credentials are never used here.
export const AUTH_URL = 'https://qdvqiqwxadgnramercze.supabase.co/auth/v1';
export const PUBLIC_KEY = 'sb_publishable_CivONFB4gj06Mxzcbkc8Ng_CAsh_UK3';
export const ACCESS_COOKIE = '__Host-jobwave-access';
export const REFRESH_COOKIE = '__Host-jobwave-refresh';
type AuthUser = { id?: string; email?: string; email_confirmed_at?: string; is_anonymous?: boolean; identities?: Array<{provider?: string}>; user_metadata?: {name?: string;full_name?: string;preferred_username?: string} };
export function verifiedUser(user?: AuthUser) {
  if (!user?.id || user.is_anonymous) return false;
  if (user.email && user.email_confirmed_at) return true;
  // Provider identities come from the authenticated Auth server, never request input.
  return !!user.identities?.some(i => ['kakao', 'google'].includes(i.provider || ''));
}

export async function authRequest(path: string, data?: unknown, token?: string) {
  return fetch(AUTH_URL + path, {
    method: data === undefined ? 'GET' : 'POST',
    headers: { apikey: PUBLIC_KEY, 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    ...(data === undefined ? {} : { body: JSON.stringify(data) }),
    signal: AbortSignal.timeout(12000), cache: 'no-store',
  });
}

// Coalesce parallel protected-asset requests; only verified identities are reused,
// for at most ten seconds. Keys are token digests, never raw credentials.
const identityCache=new Map<string,{until:number,value:Promise<ChatGPTUser|null>}>();
export async function emailIdentity(): Promise<ChatGPTUser | null> {
 const token=(await cookies()).get(ACCESS_COOKIE)?.value;
 if(!token)return null;
 const digest=new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token)));
 const key=Array.from(digest,b=>b.toString(16).padStart(2,'0')).join('');
 const now=Date.now(),cached=identityCache.get(key);if(cached&&cached.until>now)return cached.value;
 if(identityCache.size>=256){for(const [k,v] of identityCache)if(v.until<=now)identityCache.delete(k);if(identityCache.size>=256)identityCache.delete(identityCache.keys().next().value!);}
 const value=loadEmailIdentity(token);identityCache.set(key,{until:now+10000,value});
 const result=await value;if(!result)identityCache.delete(key);return result;
}
async function loadEmailIdentity(token:string): Promise<ChatGPTUser | null> {
  try {
    const response = await authRequest('/user', undefined, token);
    if (!response.ok) return null;
    const user = await response.json() as AuthUser;
    if (!verifiedUser(user)) return null;
    // Never merge accounts using an email address or editable user_metadata.
    const email = user.email_confirmed_at ? user.email || '' : '';
    const nickname = user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.preferred_username;
    return { userId: 'supabase:' + user.id, email, displayName: email || (typeof nickname === 'string' ? nickname.slice(0,80) : 'JOBWAVE 회원'), fullName: null };
  } catch { return null; }
}

export function sessionCookies(response: Response, session?: { access_token: string; refresh_token: string; expires_in: number }) {
  const settings = '; Path=/; HttpOnly; Secure; SameSite=Lax';
  response.headers.append('Set-Cookie', `${ACCESS_COOKIE}=${session?.access_token || ''}; Max-Age=${session ? Math.min(session.expires_in, 3600) : 0}${settings}`);
  response.headers.append('Set-Cookie', `${REFRESH_COOKIE}=${session?.refresh_token || ''}; Max-Age=${session ? 30 * 86400 : 0}${settings}`);
  return response;
}
