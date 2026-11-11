# Social sign-in setup

## Implementation status

Kakao and Google PKCE flow are implemented and gated by Supabase's actual `/auth/v1/settings` external-provider flags. Neither is configured as of 2026-10-24. No live provider sign-in has been completed. Naver is not implemented yet; it needs a separate custom-provider assessment after Kakao and Google setup.

Same-origin POST `/api/auth/social` creates a 256-bit random PKCE verifier in a host-only Secure/HttpOnly/Lax ten-minute cookie. Only the public challenge and a fixed allowlisted callback URI are sent to Supabase. `/api/auth/callback` exchanges the returned code with the verifier, accepts only a verified email or server-returned supported social identity, writes existing auth cookies, clears the verifier and redirects to a fixed home URL. Provider errors and codes are not reflected into the page. The browser never receives an access/refresh token in JavaScript. Legacy ChatGPT login remains intact.

For a Kakao account without email, a server-confirmed Kakao identity can authenticate by Supabase user ID. An absent or unverified email is never usable for the consultation administrator comparison. Nicknames are display-only and escaped. Refresh accepts such social identities too. Email OTP behavior and member record keys are preserved. Supabase may link its own verified identities under its identity-linking rules; no linking to a native ChatGPT account is implemented.

## Setup order

1. Create the developer app owned by the operator of JOBWAVE. Do not invent legal operator details or accept terms for the owner.
2. In Supabase Auth URL Configuration, add exact allowed redirects before enabling providers:
   - `https://jobwave.kr/api/auth/callback`
   - `https://jobwave-career-daily.heosh85.chatgpt.site/api/auth/callback`
3. Kakao app:
   - Name JOBWAVE; primary domain `https://jobwave.kr`.
   - Enable Kakao Login.
   - Register provider redirect `https://qdvqiqwxadgnramercze.supabase.co/auth/v1/callback`.
   - Obtain REST API key and the active Kakao Login client secret. Owner enters both directly into Supabase's Kakao provider form, never chat or source.
   - Choose only necessary consent items. If account_email is unavailable, omit it and enable Supabase's Allow users without an email.
4. Enable/save Kakao in Supabase. Confirm that provider discovery returns Kakao and then have the owner complete a real login. Test cancellation and account persistence too.
5. Google follows the same application callback. Configure a web OAuth client and its Supabase provider before enabling. Use only openid/email/profile scopes; no Gmail or Drive access is requested.
6. Naver remains a separate step. Do not show a working Naver button until its custom-provider integration and userinfo compatibility are verified.

## Verification

`node scripts/test-email-auth.cjs` tests secure PKCE code binding, unavailable-provider gating, origin validation, no verifier/token JSON disclosure, callback cookie cleanup, missing/invalid verifier rejection, unverified email privilege rejection, social identity without email and native compatibility. TypeScript/syntax/production build also apply. External app setup and the real consent/login roundtrip still require the owner's developer credentials and direct interaction.
