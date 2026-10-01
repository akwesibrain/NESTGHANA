# NestGH Performance Audit

## Scope and measurement limits

This audit reviewed the public static frontend, its Supabase listing query, shared assets, and the admin listing query. The public site is a vanilla JavaScript application served from `index.html`; Next.js redirects `/` to that static page, and `scripts/sync-public-frontend.mjs` copies the root frontend into `public/` during development and production builds.

No Lighthouse run, browser performance trace, production traffic data, or field Core Web Vitals were available for this audit. File sizes below are local repository sizes, not compressed transfer sizes. Expected benefits are qualitative and should be confirmed with production measurements.

## Prioritized findings

| Priority | Finding and evidence | Affected files | Implemented change | Expected benefit and impact |
|---|---|---|---|---|
| High | The public page previously selected every row from `public_listings`, then filtered, sorted, and rendered all returned cards in the browser. This made initial transfer, memory use, and DOM work grow with the entire inventory. | `app.js` | Fetch 24 rows per request, in deterministic creation-time/ID order, and expose a user-controlled “Load more” button. Keep filtering local, but explicitly explain when no matches exist only in the pages loaded so far. Preserve an area selection while more rows are appended. | Limits initial listing transfer and initial card rendering; users can browse further on demand. Search results are deliberately described as partial until remaining pages are loaded. |
| High | The listing region began blank while the first database request was pending. | `index.html`, `styles.css`, `app.js` | Add six dimension-stable initial skeleton cards, mark the region `aria-busy`, remove the placeholders on completion, and show visible service-unavailable and retry states on failures. Skeleton shimmer stops for users who request reduced motion. | Provides immediate visual feedback without replacing the existing card design; reduces perceived wait and avoids a blank results region. |
| Medium | The 14,013-entry Ghana town/campus catalogue was about 163 KB on disk and was loaded on every page visit, including visitors who never search by town, choose a campus, or list a room. | `app.js`, `data/ghana-locations.json` | Load the catalogue only when town search, student campus selection, or the listing flow needs it; reuse an in-flight request and expose a visible error if it fails. | Avoids an unnecessary initial data transfer for visitors who do not use location suggestions. The catalogue remains available for all existing location workflows. |
| Medium | The hero is an above-the-fold image (~136 KB on disk), while web fonts are requested from Google Fonts. The font CSS was also render-blocking. | `index.html`, `font-loader.js` | Preconnect to the font origin, preload the hero image with high fetch priority, and promote the preloaded Google Fonts stylesheet from an external same-origin deferred loader. Keep a no-script fallback. | Lets the page render using system fallbacks while the font stylesheet loads; actual LCP effect is unmeasured. The external loader works with the site's Content Security Policy. |
| Medium | The ordered Supabase config, SDK, and app scripts were parser-blocking at the end of the document. | `index.html` | Mark the ordered classic scripts `defer`, retaining their execution order while allowing document parsing and the initial paint to proceed during downloads. | Reduces competition between script download/parse and initial rendering; total script transfer and time until app functionality are unchanged. |
| Medium | Listing and detail photos are lazy-loaded, but lacked explicit intrinsic dimensions and decoding hints. | `app.js` | Add width/height attributes and asynchronous decoding hints to listing/detail images; existing fixed image containers retain their layout. | Helps browsers reserve image space and decode off the main rendering path. No image compression or responsive image pipeline was introduced because stored listing image formats/hosting were not established in this audit. |
| Medium | Shared browser dependencies remain comparatively large: `app.js` is about 66 KB and the Supabase UMD bundle is about 218 KB on disk; the stylesheet is about 26 KB. | `index.html`, `app.js`, `public/supabase.js` | No dependency-loading change made. Supabase is needed by the public listing and fee flows, so changing its loading strategy without browser/network measurements could delay required work or alter payment behavior. | Candidate for a separately measured follow-up: assess a tree-shaken ESM client or defer truly optional client features, then compare compressed transfer and interaction timings. |
| Low | Public filtering and sorting still run over every listing page fetched so far, and all fetched cards remain in the DOM. Deep offset pages can also become less efficient as the table grows. | `app.js` | Bounded initial requests reduce the immediate cost, while future requests remain explicit. | For larger inventories, measure and consider server-side filtering plus keyset/cursor pagination and DOM virtualization. Do not apply these changes until the legacy `public_listings` schema and filter semantics are verified in production. |

## Existing strengths

- The admin listing query is already bounded to its first 20 rows.
- Public listing and detail photos already use lazy loading.
- The hero image has a fixed background area, and listing photos render within fixed-height image containers.
- Production build synchronization keeps the served static frontend aligned with the root source files.

## Verification and follow-up

Completed checks:

- `node --check app.js` passed.
- `npm run test:security` passed (4 tests).
- `npm run typecheck` passed.
- `npm run build` passed, including the public asset synchronization.
- A byte comparison confirmed that the generated `public/` HTML, JavaScript, and CSS copies match their root sources.
- The production server returned HTTP 200 for `/index.html`; the response included the initial skeleton and load-more markup.
- The scripts retain font loader → config → SDK → app order with `defer`; the font loader is external so the site's Content Security Policy permits it, and Google Fonts stylesheet loading no longer blocks the system-font first render.

The integrated browser connection timed out, and no browser automation library is installed in the project. Therefore, the success/error, pagination/filter, campus/listing-flow, and reduced-motion/mobile interactions were not end-to-end browser-tested here.

Capture Lighthouse or a browser performance trace against the deployed site before making numeric claims or prioritizing additional bundle/image work. Record LCP, CLS, INP, compressed request sizes, and the number of rows/cards rendered at representative inventory sizes.
