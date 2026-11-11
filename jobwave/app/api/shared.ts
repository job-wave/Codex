import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../chatgpt-auth';
import { emailIdentity } from '../email-auth';
import { cookies } from 'next/headers';
import { ACCESS_COOKIE, REFRESH_COOKIE } from '../email-auth';
export const config=()=>env as unknown as {DB:D1Database;CONSULTATION_ADMIN_EMAIL?:string;JOB_REFRESH_TOKEN?:string;WORK24_API_KEY?:string;SARAMIN_ACCESS_KEY?:string;OPENAI_API_KEY?:string;OPENAI_MODEL?:string;OPENAI_KEY_CIPHERTEXT?:string;OPENAI_KEY_PKCS8?:string};
export const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export async function identity(){const jar=await cookies();if(jar.has(ACCESS_COOKIE)||jar.has(REFRESH_COOKIE))return emailIdentity();return getChatGPTUser()}
export function sameOrigin(req:Request){return req.headers.get('origin')===new URL(req.url).origin}
export async function body(req:Request,max=100000){const text=await req.text();if(text.length>max)throw new Error('too_large');return JSON.parse(text)}
export function hasOpenAIKey(){const c=config();return !!c.OPENAI_API_KEY||!!(c.OPENAI_KEY_CIPHERTEXT&&c.OPENAI_KEY_PKCS8)}
export async function openAIKey(){const c=config();if(c.OPENAI_API_KEY)return c.OPENAI_API_KEY;if(!c.OPENAI_KEY_CIPHERTEXT||!c.OPENAI_KEY_PKCS8)return null;const decode=(s:string)=>Uint8Array.from(atob(s),v=>v.charCodeAt(0));const key=await crypto.subtle.importKey('pkcs8',decode(c.OPENAI_KEY_PKCS8),{name:'RSA-OAEP',hash:'SHA-256'},false,['decrypt']);const plaintext=await crypto.subtle.decrypt({name:'RSA-OAEP'},key,decode(c.OPENAI_KEY_CIPHERTEXT));return new TextDecoder().decode(plaintext)}
