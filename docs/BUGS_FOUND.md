# Bugs found and fixed

Audit scope: every source file in the repo root, `app/`, `scripts/` (not the Admin Panel, Owner Dashboard, Analytics or Payment Verification, which were left alone as instructed). Real tools used: ESLint, `tsc`, the security tests, Lighthouse (mobile) and a manual check in Chrome at 360, 768 and 1280 px.

| # | File | Line (approx.) | Problem | Severity | Fix |
|---|------|------|---------|----------|-----|
| 1 | `app.js` `populateTownOptions` | 228 | Built ~14,000 `<option>` elements at page load for a disabled select. Caused ~2.4 s Total Blocking Time. | High | Only build the list once a region is chosen (placeholder otherwise). TBT 2,390 ms to 0 ms. |
| 2 | `styles.css` | 1-35, 2764 | Gold text/buttons on cream failed WCAG AA contrast. | High | Brand gold darkened to `#80601a`, hover `#6b5114`, `--muted` `#6a6358`. |
| 3 | `eslint.config.mjs` | n/a | 59 lint errors, all in generated vendor file `public/supabase.js`. | Medium | Generated/vendor folders added to the ESLint ignore list. Lint is now 0 errors. |
| 4 | `index.html` | head | No meta description; no theme colour (SEO 91). | Medium | Added both. SEO 100. |
| 5 | `index.html`, `styles.css` | footer | Footer `<h4>` skipped heading levels. | Low | Changed to `<h3>` and updated CSS selectors. |
| 6 | `index.html` | nav | `#mobile-more` aria-label did not match its visible text. | Low | aria-label set to "More menu". |
| 7 | `styles.css` | footer | Footer links, cookie-settings button and credit link smaller than 44 px tap target. | Medium | `min-height: 44px`. |
| 8 | `app.js` | various | Unused variables `total`, `reference`, `LIST` and unused catch bindings (dead code). | Low | Removed. |
| 9 | `app.js` | listing fee | Expected "Supabase not configured" state logged as `console.error`. | Low | Now `console.warn`. |
| 10 | `app.js` | max-rent filter | `max.oninput` re-filtered on every keystroke. | Medium | Debounced by 200 ms. |
| 11 | `next.config.ts` | n/a | `/` answered with a 307 redirect to `/index.html` (extra round trip, hurts LCP). | Medium | Rewrite instead of redirect. |
| 12 | `logo.png`, `hero.jpg` | n/a | Oversized logo and hero images used everywhere. | High | Generated `hero.webp`, `hero-480.webp`, `logo-80.webp`, `logo-192.png` (sharp), with `srcset`, `sizes`, width/height. |
| 13 | `public/*.js`, `styles.css` | n/a | Assets shipped unminified, no cache headers. | Medium | Minified with esbuild (app.js 103 KB to 78 KB, CSS 77 KB to 56 KB); Cache-Control headers added. |
| 14 | `index.html` / `styles.css` | n/a | Below-the-fold sections rendered at start. | Medium | `content-visibility: auto` on categories, shops, how, list, footer. |

Checked and found clean: horizontal overflow, missing alt text/labels, `undefined`/`NaN`/`null` shown to users, dead anchors, duplicate IDs, `innerHTML` use (all interpolations go through the `esc`/`htmlEsc` helpers), currency format (always `GH₵`), secrets (`.env` is git-ignored).

Not fixable here: the app depends on Supabase, which is unconfigured locally, so listing/auth flows could only be checked as empty/error states.

Total: 14 bugs found, 14 fixed. No files were deleted.
