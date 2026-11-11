import { cookies } from 'next/headers';
import { z } from 'zod';
import { AUTH_URL, PUBLIC_KEY, ACCESS_COOKIE, sessionCookies } from '../../email-auth';
import { chatGPTSignOutPath } from '../../chatgpt-auth';
import { identity, config, json, sameOrigin, body } from '../shared';
export const dynamic = 'force-dynamic';
export const CONFIRM_WORD = '탈퇴';
const schema = z.object({ confirm: z.literal(CONFIRM_WORD) }).strict();
// Runs as the signed-in member. See docs/account-withdrawal.md for the one-time database function.
const DELETE_ACCOUNT_URL = AUTH_URL.replace('/auth/v1', '/rest/v1/rpc/delete_own_account');
const hex = async (value: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))), b => b.toString(16).padStart(2, '0')).join('');

/** Removes everything this site stores for one member. Safe to repeat. */
async function eraseMemberData(userId: string, email: string) {
  const db = config().DB, prefix = userId + ':';
  const statements = [
    db.prepare('DELETE FROM member_state WHERE user_id=?').bind(userId),
    db.prepare('DELETE FROM consultation_requests WHERE user_id=?').bind(userId),
    db.prepare('DELETE FROM ai_usage WHERE substr(id,1,?)=?').bind(prefix.length, prefix),
  ];
  if (email) {
    const digest = await hex(email.toLowerCase());
    for (const action of ['send', 'verify']) { const p = 'auth:' + action + ':' + digest + ':'; statements.push(db.prepare('DELETE FROM ai_usage WHERE substr(id,1,?)=?').bind(p.length, p)); }
  }
  await db.batch(statements);
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: '잘못된 요청입니다.' }, 403);
  const user = await identity();
  if (!user) return json({ error: '로그인 후 이용해 주세요.', code: 'login_required' }, 401);
  let input: unknown;
  try { input = await body(req, 500); } catch { return json({ error: '요청 형식을 확인해 주세요.' }, 400); }
  if (!schema.safeParse(input).success) return json({ error: `확인을 위해 '${CONFIRM_WORD}'를 정확히 입력해 주세요.` }, 400);
  const emailAccount = user.userId.startsWith('supabase:');
  if (emailAccount) {
    // The sign-in account goes first: if this step is unavailable nothing is removed and the member can retry.
    const token = (await cookies()).get(ACCESS_COOKIE)?.value;
    if (!token) return json({ error: '다시 로그인한 뒤 시도해 주세요.', code: 'login_required' }, 401);
    try {
      const response = await fetch(DELETE_ACCOUNT_URL, { method: 'POST', headers: { apikey: PUBLIC_KEY, Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: '{}', signal: AbortSignal.timeout(12000), cache: 'no-store' });
      if (!response.ok) return json({ error: '탈퇴를 처리하지 못했습니다. 잠시 후 다시 시도하거나 문의해 주세요.' }, 503);
    } catch { return json({ error: '탈퇴를 처리하지 못했습니다. 잠시 후 다시 시도하거나 문의해 주세요.' }, 503); }
  }
  let erased = false;
  for (let attempt = 0; attempt < 2 && !erased; attempt++) { try { await eraseMemberData(user.userId, user.email); erased = true; } catch { /* retried once below */ } }
  if (!erased) {
    console.error('account withdrawal: stored data not erased for', await hex(user.userId));
    // A native (ChatGPT) member is still signed in and can simply retry.
    if (!emailAccount) return json({ error: '저장된 정보를 삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.' }, 503);
  }
  const done = json({ ok: true, erased, next: emailAccount ? '/' : chatGPTSignOutPath('/') });
  return emailAccount ? sessionCookies(done) : done;
}
