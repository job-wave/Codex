# JOBWAVE visual refresh — 2026-11-06

## Direction
White, charcoal and deep forest green; lime retained as a restrained brand accent. Large typography, useful service demonstrations and open editorial layouts replace repeated decorative cards, uppercase slogans and pastel artwork.

## Changes
- Guest and member homes now share the same two-line Korean headline and one server-rendered service illustration component. The illustration is explicitly labelled as a service example and contains no fabricated scores, statistics or testimonials.
- Guest home introduces student/professional use cases, the two actual video lectures, and a concise directory. Content links continue through the existing membership gates.
- Member home retains its student/professional setup actions, service routes, disclosures and existing workflow. New quick links expose official jobs, practice tools and lectures.
- Shared typography, reading cards, certification listings, tool panels and company sections use consistent materials and spacing.
- Lecture covers are typographic SVGs in a consistent 16:9 layout with real titles. Intrinsic aspect ratio protection remains in place.
- Grouped reading-page header links retain guides, briefings, practical information, missions, stories and challenges. Native details disclosure supports keyboard access. Mobile dropdowns escape the older scrollable nav rail rather than being clipped.
- The company motto MAKE YOUR NEXT. remains on the company page and footer.

## Validation
- Framework build and JavaScript syntax checks.
- 52 main/content/guest/practice variants at 360, 390, 768 and 1440px: 208 checks, no detected unintended viewport, text or image clipping.
- 12 additional student/professional career, setup, assessment, diagnostic and record-dialog variants at the same widths: 48 checks, no detected clipping.
- Desktop guest home and reading-page appearance inspected visually; mobile grouped menu opened and verified within viewport after repairing inherited overflow.
- Layout fixtures use isolated test membership/data, not a production visitor session. No production authentication bypass, content entitlement or storage change was added.
- All temporary fixture HTML and copied member scripts removed before the production build.

## Restore
The prior published design is saved as version 61 (source 3020efc514402b92224a8c07531dd6383e019e2f).
