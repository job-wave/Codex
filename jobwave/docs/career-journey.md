# JOBWAVE career journey and consultation intake

- The landing page uses a 12-second silent motion loop, with an explicit play/pause button. Reduced-motion visitors see the poster until they choose playback.
- The full film is a 60-second, 1280×720 H.264 MP4, played only after a click. Korean captions are rendered into the picture. There is no music or narration.
- `public/media/` contains the deployed assets. `scripts/render-career-film.py` renders them from code with Pillow, ffmpeg and Pretendard Regular/Bold fonts.
- Career profile setup is inline near the bottom of the landing page. Profile, assessment and plan data still require sign-in and use the existing versioned member store.
- `/api/consultations` stores authenticated requests separately. GET returns only the caller's requests; `?scope=all` requires the site owner's configured `CONSULTATION_ADMIN_EMAIL`. PATCH permits owners to cancel their own active requests and the administrator to update progress. POST atomically prevents a second active request.
- `CONSULTATION_ADMIN_EMAIL` is a server secret. Its value is never returned to the client. No email messages are automatically sent. The operator uses the consultation desk to review intake and arrange consultation manually.
- Intake records older than 90 days are deleted when the intake endpoints process a read or submission; this is described in the consent notice. Diagnostic answers are not automatically copied into consultation requests.

## Verification

- JavaScript syntax and TypeScript checks passed.
- `node --experimental-vm-modules scripts/check-server.mjs` passed, including consent/schema validation, request isolation, admin access, cancellation, duplicate prevention and expiry cleanup, plus existing feed/member/assessment regressions.
- Desktop and 390px mobile browser layouts, inline type selection, hero playback/pause and full-film playback (60-second duration) were checked in Sites preview.
- The managed preview does not serve platform-owned sign-in routes. The authenticated UI could not be exercised end-to-end in that preview; route behavior was verified with the real handlers against an isolated SQLite database.

## Motion alignment revision

- All scenes share 60px side margins, a graphic center at (970, 350), and a common footer grid.
- Circle labels are centered using rendered glyph bounds. Connector endpoints follow animated circle centers and meet the circle edges.
- The moving dot and growth line use identical coordinates; stepped bars have common widths and gutters.
- Cards share left/right edges and typography offsets. The final brand arrow scales together with its enclosing circle and shares its center.
- New v2 media paths prevent previously cached videos or posters from appearing after the update.
- Both entrance and settled frames were reviewed for all six chapters.

## Landing page simplification

- Replaced the dense landing-page card stacks with four sections: a headline and subtle SVG motion, two audience introductions, the diagnosis/plan/record/opportunity sequence, and a compact start area.
- Kept the 60-second film accessible from the secondary story button. The landing illustration is now a lightweight vector animation with pause and reduced-motion support.
- Profile fields are collapsed until setup is requested. Consultation intake and request history are inside a disclosure, with the original authenticated submission and admin APIs unchanged.
- Checked desktop and 390px mobile layouts, audience selection, consultation disclosure, animation pause across home rerenders, and film open/close. Checked signed-in presentation using a local-only synthetic UI fixture without authentication headers, credentials or real member writes; verified profile disclosure and the professional grade-field toggle. Removed the fixtures before packaging.

## Member track selection

- Email, Kakao, Google and legacy sign-ins share a first-time member selection page when no saved career profile exists. Existing profiles are preserved.
- Two accessible toggle cards select student or professional; continue stays disabled until a choice is made. Continue opens the existing inline profile form with the selected type. Selection is persisted with the profile, not separately.
- Anonymous members do not see a member-only setup screen. Consultation sign-in intent retains its original destination. A visitor can browse jobs before completing setup and return via the account menu.
- Desktop and 390px layouts and the professional selection/continue interaction were checked with a disposable UI-only fixture, then removed. Real signed-in member persistence still requires an authenticated browser session.

## Homepage editorial redesign

- Replaced repeated introduction sections with a clear value proposition, an illustrated career path, four service shortcuts and a keyboard-accessible student/professional service switcher. Roadmaps and the hero task are explicitly marked as examples.
- Added three real feed listings on the home page, excluding expired and source-less records, prioritizing fresh provider snapshots and recent publication dates. Provider text is escaped; stale listings and feed failures remain visible. Example-mode listings are never presented as live jobs.
- Signed-in members with a saved profile continue to their existing workspace. New members enter the track selector; public job browsing and consultation intake keep their existing access rules.
- Checked desktop and 390px mobile layouts, audience switching, login entry and job-list navigation in the local preview. Local preview has no production feed storage; the live-feed rendering and empty/error cases were tested independently.
- Validation: JavaScript syntax checks, `scripts/test-homepage.cjs`, email/social authentication regressions and production build.
