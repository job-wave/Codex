# JOBWAVE career guides

- Six original editorial guides: three student and three professional articles. The sole content source is `public/career-guides.json`; it is intentionally public and imported by the server renderer.
- `/guides` lists all published guides. `?audience=student` and `?audience=professional` filter without client JavaScript. `/guides/<slug>` renders the complete article as server HTML, with canonical/Open Graph metadata and Article JSON-LD. Missing slugs return 404.
- Each article has a table of contents, an illustrative example, copyable writing prompts, a transient checklist, a service action and two related guides. No named consultant, HR review or hiring outcome is fabricated.
- The homepage shows the latest three by publication date, then descending editorial order. The navigation link exists in the root HTML, not only in client markup. `sitemap.xml` includes the home page, guide list and all six articles. Search-engine indexing is not guaranteed or claimed.
- Action links use whitelisted `track` and `tool` parameters, immediately removed from the address bar. A session-only intent expires after 30 minutes and survives an OAuth redirect. No secrets, article answers or personal profile content are saved in this intent. Public job browsing stays public; personal diagnosis/planning/records retain authenticated member checks.
- Existing member profile types are preserved. A new member first completes track/profile setup; it is not silently replaced with an article example.
- To add or revise a guide, edit the catalog, use a unique URL-safe slug, provide a real publication date and editorial order, and run `node scripts/test-guides.cjs`. Update the six-guide test expectations when intentionally expanding the collection. Expert-reviewed attribution may only be added after an actual review with permission to publish it.

## Validation

- Public list, professional filter, article rendering and table-of-contents navigation checked in preview.
- Desktop and 390px mobile list/article layouts reviewed. Temporary HTML fixtures removed before packaging.
- Copy prompt fallback checked on the HTTP preview; secure-context clipboard success depends on the browser's clipboard permission.
- Tests cover audience counts, full server HTML, canonical/structured data, escaping, 404, sitemap, guest sign-in intent, OAuth-return continuation, new-member setup, existing-profile preservation, public job access and invalid/expired intent rejection.
- Existing homepage-feed and email/social-auth regression tests pass. Actual signed-in production member workflows require a user session and were not simulated with production credentials.
