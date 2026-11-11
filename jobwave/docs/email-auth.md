# JOBWAVE email sign-in

The user explicitly requested email OTP registration instead of requiring a ChatGPT account. Native ChatGPT routes/helpers remain intact as an optional legacy sign-in. Public landing pages remain anonymous.

## Flow

`/api/auth` accepts same-origin POSTs only. `send` requests an email OTP from the configured Supabase project; `verify` verifies the eight-digit email code. Supabase access and refresh tokens are set as host-only Secure, HttpOnly, SameSite=Lax cookies and are never returned in JSON, placed in URLs, logged, or persisted in browser storage. `/api/session` and existing member/analysis/consultation APIs validate identity against Supabase `/user`. An email is accepted only when confirmed and non-anonymous. Client-editable metadata is never authorization input.

The existing D1 member store remains authoritative for plans, assessments and application records. Supabase IDs use the `supabase:` namespace. Native ChatGPT IDs remain unchanged. Matching email addresses never cause account linking or data migration. When an email session exists but is invalid, the server does not silently fall back to a simultaneous native session.

After authentication, existing members retain their profile. New members reach the inline student/professional choice at the bottom of the home page. A type chosen before sign-in is preserved via the existing non-secret sessionStorage intent. Auth cookies refresh through a same-origin POST on reconnect and every twenty minutes. Logout revokes the current provider session when possible, clears both email cookies and signs out the legacy provider.

Only the Supabase publishable key is used. No service-role key or SMTP credential belongs in this repository. SMTP credentials stay in Supabase. Auth send/verify quotas use hashed email addresses in existing D1 ai_usage counters; Supabase's provider limits also apply.

## Verification

- `node scripts/test-email-auth.cjs`: origin validation, OTP shape, quotas, failed verify, cookie flags/token secrecy, server-verified identity, account separation, unconfirmed users, native compatibility, refresh and logout.
- TypeScript, browser script syntax and production build.
- Browser QA: email login dialog and legacy sign-in disclosure. No OTP is read or filled by the agent.
- Delivery to the owner's Gmail was confirmed before integration. A real user must complete the new site's OTP flow to verify the final credential entry and post-login state. Do not claim that verification has happened until observed.
