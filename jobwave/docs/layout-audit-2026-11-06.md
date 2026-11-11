# JOBWAVE layout audit — 2026-11-06

## Reported issue and fixes

- Lecture poster `<img>` elements had width responsive to the card but retained their HTML height of 540px. `object-fit: cover` then cropped the left and right of the 16:9 artwork. Preserve intrinsic ratio with `height: auto`, use `object-fit: contain`, and constrain media to its grid track. Keep the explicit HTML dimensions to reserve space while loading.
- Home service preview panels extended below their parent with negative bottom margins and a perspective transform. Display the complete panels, remove the negative margins and transform, and allow bottom space in the tiles.
- Official job titles containing long English words overflowed small mobile grid columns. Constrain and wrap titles within the middle grid column, and wrap company badges/tags.
- Add explicit minimum-width-zero grid tracks and wrapping for lecture/visitor cards. Keep mobile videos at their native ratio.

## Verification

- Local-only fixtures rendered from current production route handlers, using isolated mock membership and read-only test data. No production authentication bypass was added.
- 52 public/member content pages, article details, lecture pages, home views and practice tabs; 12 additional student/professional profile, diagnostic, assessment and input-dialog states.
- All 64 variants inspected at 360, 390, 768 and 1440 CSS px (256 combinations).
- The long title stress case reproduced a mobile overflow at 360/390px. After the fix, all 16 targeted combinations for member home, guest home, lecture listing and job listing passed again.
- Checks covered viewport overflow, unintended hidden vertical text, and artwork aspect ratio/cropping. Expected carousel viewports and 1px screen-reader live regions were distinguished from defects.
- Lecture images inspected at desktop and mobile widths: complete SVG text/icon artwork visible, native 16:9 ratio preserved.
- Additional student/professional input/dialog checks: 48 combinations, no detected clipping.
- Temporary fixture pages and copied member scripts removed before packaging. Authentication, content, video storage, APIs and membership rules unchanged.

## Limits

Authenticated UI layout used test data rather than a real visitor session. This is a layout verification, not a claim of a complete production login, saved-record or full video-playback test. Previously stored news articles not represented by the current source catalog can contain other lengths of text. No claim is made about every possible user-generated string or browser extension/zoom setting.
