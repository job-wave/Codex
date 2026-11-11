# JOBWAVE — 직무 한 입

Three original 15-minute fictional exercises are available publicly at `/missions` and `/missions/<slug>`: planning a library booking improvement, writing a fictional cafe's marketing messages, and reading channel conversion data. Content is in `public/career-missions.json`. No AI model, employee endorsement, assessment score or real-work achievement is implied.

Each exercise contains a brief, three timed steps, four bounded answers, a collapsible example and a self-check. The homepage links to all three using compact entries; guides and missions are connected through public navigation and the sitemap.

## Draft and account save

- Anonymous drafting uses sessionStorage in the same tab, explicitly described to the visitor. Drafts expire after 24 hours, are bounded to four 400-character fields and have whitelisted mission slugs. No company-confidential content is requested.
- The user explicitly chooses save, signs in if needed, then reviews the answers and account name before a second confirmation actually sends the record.
- The handoff survives email/social sign-in on the same origin. Personal answers are never put in a URL. Storage-unavailable browsers can still read the exercise and copy the output, but cannot use the sign-in handoff.
- `/api/missions` enforces origin, existing authentication and strict input validation. It constructs a `학습·교육` record server-side, clearly labels it as a fictional exercise, and preserves the rest of the member snapshot. It does not require a career profile before storing the learning experience.
- Records are appended using version compare-and-swap with bounded retries. UUID-based idempotency prevents duplicate saves; altered replays and the existing 20-record limit return errors. A failed save never clears the draft or falsely confirms success.
- Successful saves clear the temporary draft and reload the existing account store. New members can then complete track setup; existing members return to their experience records.

## Verification

- Desktop and 390px mobile layouts reviewed, including actual input fields.
- A fictional data exercise was filled through the browser. Character counts, checks and answers survived reload; choosing save opened the existing sign-in dialog. No credentials or production member data were used.
- `scripts/test-missions.cjs` covers real SQLite persistence, duplicate prevention, user isolation, concurrent change preservation, record limits, failures, strict input, session expiry and HTTP-preview UUID fallback.
- Homepage, guide and email/social-auth regressions pass. An actual authenticated production save still requires a real user session.
