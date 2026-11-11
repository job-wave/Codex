import { authRequest, AUTH_URL } from './email-auth';
export const VERIFIER_COOKIE = '__Host-jobwave-pkce';
export const PROVIDERS = ['kakao', 'google'] as const;
export type Provider = typeof PROVIDERS[number];
const ORIGINS = ['https://jobwave.kr', 'https://jobwave-career-daily.heosh85.chatgpt.site'];
export const allowedOrigin = (origin: string) => ORIGINS.includes(origin);
let cached: {expires:number;providers:Provider[]} | undefined;
export async function socialProviders(): Promise<Provider[]> {
  if (cached && cached.expires > Date.now()) return cached.providers;
  try {
    const response = await authRequest('/settings');
    if (!response.ok) return [];
    const settings = await response.json() as {external?:Record<string,boolean>};
    const providers = PROVIDERS.filter(p=>settings.external?.[p] === true);
    cached = {expires:Date.now()+60000,providers};
    return providers;
  } catch { return []; }
}
export async function startSocial(provider: Provider, origin: string) {
  const verifier=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');
  const digest=new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(verifier)));
  const challenge=btoa(String.fromCharCode(...digest)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const url=new URL(AUTH_URL+'/authorize');
  url.searchParams.set('provider',provider);
  url.searchParams.set('redirect_to',origin+'/api/auth/callback');
  url.searchParams.set('code_challenge',challenge);
  url.searchParams.set('code_challenge_method','s256');
  return {url:url.toString(),verifier};
}
export function verifierCookie(response:Response,verifier='') {
  response.headers.append('Set-Cookie',`${VERIFIER_COOKIE}=${verifier}; Max-Age=${verifier?600:0}; Path=/; HttpOnly; Secure; SameSite=Lax`);
  return response;
}
