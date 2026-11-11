# JOBWAVE

Korean recruitment discovery and application preparation site. Existing private Site identity and editorial design are preserved.

## Runtime

- Vinext routes on Sites / Cloudflare Workers.
- Dispatch-owned ChatGPT sign-in; no client-created identity is trusted.
- D1 stores saved job IDs, preferences, application status, personal schedules and checklists, scoped to the authenticated Site user ID.
- Essay content and generated feedback are not persisted in D1.
- Member updates use versions to detect concurrent changes.

## Connections

Set secrets in the Site runtime, never in source or browser code:

- Official Greenhouse Job Board public GET feeds: Coupang, Moloco and Delight.ai (Sendbird). Only Korean work locations are included. No source credentials required. Each source is atomically replaced in D1; failures retain the last successful snapshot with a stale label. Missing dates remain null, actual first-published dates are distinct from modified dates, and talent-pool listings are excluded. Job text is plain, escaped excerpts; category and career are labeled as inferred.
- `GET /api/jobs` reads durable snapshots and refreshes on a visit if the last attempt is older than 15 minutes. `POST /api/jobs/refresh` provides unattended refresh and readback for a linked Site schedule, using owner-private Site service authorization. **Before changing the Site audience, add dedicated updater authorization.** A successful snapshot removes jobs no longer listed by that source.
- `WORK24_API_KEY`: optional approved 고용24 공채속보 API credential. Its existing adapter remains available but is not configured; it is excluded from the active feed until configured.
- `OPENAI_API_KEY` and `OPENAI_MODEL`: both required to enable AI analysis. Provision via the supported OpenAI account workflow. This deployment uses RSA-OAEP-wrapped key material in two secret runtime values (`OPENAI_KEY_CIPHERTEXT` and `OPENAI_KEY_PKCS8`) so plaintext API keys do not pass through tool output. Both values are server-only and decrypted in request memory. Analysis requires authenticated access and explicit per-request transmission consent, has a five-attempt daily limit, and calls Responses with `store:false`. Model access and inference are verified separately after provisioning;  Provider data-retention rules remain applicable.

Example jobs remain a separate, explicitly selected design preview. They are never a silent fallback for a failed actual feed.

## Validation

- `node --experimental-vm-modules scripts/check-server.mjs`: isolated handler tests with real in-memory SQLite, mock identity and no external API requests. Checks unauthorized access, origin validation, per-user persistence/isolation, conflict detection, schema checks, missing keys, XML normalization, expiration and URL validation.
- `node --check public/connected.js`
- `pnpm exec tsc --noEmit`
- Build through the Sites skill helper.

Hosted migrations live in `drizzle/`. Production sign-in is dispatch-owned; managed local preview intentionally has no mock sign-in. Current audience remains owner-private; this build does not enable public access.

Feed tests also cover source failure preservation, removed jobs, incomplete responses, unknown deadlines and actual published dates. Scheduled collection requires the linked cloud task; ordinary runs only write data and do not redeploy.

## Career workspaces

- New `career.js` / `career.css` add student and professional onboarding and a career home in the existing editorial style. ChatGPT sign-in still supplies identity; signup completion prompts for the optional career profile. Visitors see the service introduction. Personal career tools require ChatGPT sign-in; no guest career state is created.
- Profiles include grade, readiness stage, role, goal, horizon and weekly time. Grade drives the four-year overview. A three-step self-report questionnaire uses role clarity, relevant experience, years of work, skill readiness, the main obstacle, priorities and constraints to propose a reviewable 12-week plan. Weekly availability changes task scope. All tasks and dates remain editable. No inferred hiring probability is shown.
- Profile, tasks and experience records are optional fields in the existing versioned member state. Type/stage changes preserve existing tasks, saved jobs and records, and do not overwrite the accepted plan. Changes show a prompt to reassess. No new storage bindings or migrations. Limits: 60 tasks, 20 experience records.
- Incomplete task deadlines appear in the shared calendar. Experience records can populate the existing essay editor without silently overwriting an active draft, and AI transmission still requires the existing explicit consent. The career profile filters jobs on demand; no match or eligibility claim is made.
- Downloadable JSON backup is available from the signed-in account dialog. Validation covers member isolation, type switching without record loss, dates, duplicate IDs and safe HTTPS links.

## Service introduction and diagnosis

- Public-facing introduction explains four existing service areas and separate student/professional journeys; private workspace actions prompt ChatGPT sign-in. Hosting audience remains owner-private.
- `public/plan-engine.js` is an explainable, deterministic planner with no external AI calls or inference charges. It uses explicit answers and role-specific project suggestions, labels self-reported strengths, and makes no psychometric or hiring-success claims. Free-text constraints are surfaced for the member to consider, not semantically interpreted as binding schedules.
- Three month panels cover 12 weeks. Low availability yields two tasks per phase; higher availability yields three. Tasks have a reason, completion criterion, estimated hours and editable due date. First task falls within the current calendar week.
- Questionnaire results are drafts until the member explicitly applies the plan. Reassessment appends new tasks while preserving existing tasks and records. Editing the current plan updates existing task IDs and preserves completion state, without duplicating tasks. Deleted tasks are not silently restored.
- Profile changes are detected against the accepted profile snapshot. This week's view uses Monday–Sunday dates and the active plan only; overdue tasks prompt rescheduling. Plans are persisted in the existing per-user, versioned member state. Server validation covers all new fields, duplicate task IDs, dates and choice limits. No migration.
