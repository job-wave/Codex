import { cookies } from 'next/headers';
import { z } from 'zod';
import { authRequest, ACCESS_COOKIE, REFRESH_COOKIE, sessionCookies, verifiedUser } from '../../email-auth';
import { config, json, sameOrigin, body } from '../shared';
export const dynamic = 'force-dynamic';
const schema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('send'), email: z.string().trim().email().max(254) }).strict(),
  z.object({ action: z.literal('verify'), email: z.string().trim().email().max(254), token: z.string().regex(/^\d{8}$/) }).strict(),
  z.object({ action: z.literal('refresh') }).strict(),
  z.object({ action: z.literal('logout') }).strict(),
]);
async function quota(email: string, action: string, max: number) {
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email)));
  const id = 'auth:' + action + ':' + Array.from(hash, b => b.toString(16).padStart(2, '0')).join('') + ':' + new Date().toISOString().slice(0, 10);
  return !!await config().DB.prepare('INSERT INTO ai_usage (id,count) VALUES (?,1) ON CONFLICT(id) DO UPDATE SET count=count+1 WHERE count<? RETURNING count').bind(id, max).first();
}
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: '잘못된 요청입니다.' }, 403);
  try {
    const parsed = schema.safeParse(await body(req, 2000));
    if (!parsed.success) return json({ error: '이메일과 8자리 인증번호를 확인해 주세요.' }, 400);
    const input = parsed.data;
    const jar = await cookies();
    if (input.action === 'logout') {
      const token = jar.get(ACCESS_COOKIE)?.value;
      if (token) { try { await authRequest('/logout?scope=local', {}, token); } catch { /* Clear local cookies even during provider outages. */ } }
      return sessionCookies(json({ ok: true }));
    }
    if (input.action === 'refresh') {
      const refresh = jar.get(REFRESH_COOKIE)?.value;
      if (!refresh) return sessionCookies(json({ error: '다시 로그인해 주세요.' }, 401));
      const result = await authRequest('/token?grant_type=refresh_token', { refresh_token: refresh });
      if (!result.ok) return result.status >= 500 ? json({ error: '로그인 연결이 지연되고 있습니다.' }, 503) : sessionCookies(json({ error: '다시 로그인해 주세요.' }, 401));
      const session = await result.json() as any;
      if (!session.access_token || !session.refresh_token || !verifiedUser(session.user)) return sessionCookies(json({ error: '로그인을 확인하지 못했습니다.' }, 401));
      return sessionCookies(json({ ok: true }), session);
    }
    const email = input.email.toLowerCase();
    if (!await quota(email, input.action, input.action === 'send' ? 10 : 30)) return json({ error: '오늘의 인증 시도 한도를 초과했습니다. 잠시 후 다시 이용해 주세요.' }, 429);
    if (input.action === 'send') {
      const result = await authRequest('/otp', { email, create_user: true });
      if (!result.ok) return json({ error: result.status === 429 ? '요청이 많습니다. 잠시 후 다시 보내주세요.' : '인증메일을 보내지 못했습니다. 잠시 후 다시 시도해 주세요.' }, result.status === 429 ? 429 : 502);
      return json({ ok: true });
    }
    const result = await authRequest('/verify', { email, token: input.token, type: 'email' });
    if (!result.ok) return json({ error: '인증번호가 올바르지 않거나 만료됐습니다. 다시 확인해 주세요.' }, 400);
    const session = await result.json() as any;
    if (!session.access_token || !session.refresh_token || !session.user?.email_confirmed_at || session.user?.is_anonymous) return json({ error: '이메일 인증을 확인하지 못했습니다.' }, 401);
    return sessionCookies(json({ ok: true }), session);
  } catch { return json({ error: '인증 서비스 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.' }, 503); }
}
