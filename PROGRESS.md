# NestGH Security Implementation Progress

Last updated: 2026-10-01

| Milestone | Status | Evidence / notes |
|---|---|---|
| M0 — Audit and threat model | PASS | `SECURITY_AUDIT.md`, `THREAT_MODEL.md`, and `reports/evidence/m0-local-baseline.txt`. The public home route now serves the restored `index.html` frontend; Next.js admin and information routes remain available. |
| M1 — Database, migrations, constraints, locations, public views | IN PROGRESS | Normalized schema and payment/submission Edge Function contracts are aligned locally, including idempotent submission IDs, payment amounts, status transitions, rate limits, and private photo storage. SQL has not been executed or validated. Staging-only credentials are incomplete; no migration was applied. |
| M2 — RLS, column privacy, storage policies | BLOCKED | Depends on approved M1 model and staging access. |
| M3 — Owner submission, manage links, uploads | BLOCKED | Owner token flow, Turnstile server verification, notification delivery, and server-side image processing are not implemented. |
| M4 — Payments and webhooks | BLOCKED | Payment initialization, verification, and webhook finalization now use the normalized schema and idempotent SQL RPC locally. Paystack TEST credentials are not configured; Edge Function and payment integration tests have not run. |
| M5 — Admin auth, roles, activity, status history | IN PROGRESS | Next.js password sign-in/AAL2 scaffolding exists; role provisioning, permissions, activity coverage, and validation remain incomplete. |
| M6 — Public site/backend sync and availability | IN PROGRESS | The restored public `index.html` is active, but its legacy listing query still needs alignment with the normalized public view and staging browser key/data is not configured. Pending photos are private, and approved-photo promotion/public serving is not implemented; end-to-end sync is untested. Cookie choice accept/reject persistence was browser-tested locally. |
| M7 — Rate limiting, bot protection, headers, CSP, CORS | IN PROGRESS | Exact-origin CORS helper tests pass (4 cases); browser check confirms nonce CSP loads same-origin Next.js chunks without `unsafe-inline`. Edge endpoint integration tests and Turnstile configuration are missing. Evidence: [CORS tests](./reports/evidence/m7-cors-policy-tests.txt), [local CSP smoke](./reports/evidence/m7-local-csp-smoke.txt), [cookie browser test](./reports/evidence/m6-cookie-consent-browser.txt). |
| M8 — Performance and bug hunt | NOT TESTED | No target build, Lighthouse profile, query-plan, or performance budgets measured. |
| M9 — Full penetration test, retest, reports | NOT TESTED | No qualifying security test suite exists or has been run. |

## Confirmed Section 0

- Current repository: static HTML/CSS/JavaScript site and vanilla admin, with prior undeployed Supabase scaffolding.
- Target: Next.js App Router + TypeScript + Supabase + Paystack.
- Hosting: Netlify selected; commercial-use plan not verified.
- Staging project: `plbtnltcocsuekifddat`.
- Production project: `fcsclcxvxvhzlsrolxhn`, production-only; do not use for implementation tests/deployments.
- Paystack: TEST mode; credentials not configured.
- Listing fee: initially GH₵30 / 3,000 pesewas. A staging migration now adds an MFA-protected, audited admin update function; the public form reads the current backend value and payment initialization remains server-authoritative. Migration not applied to Supabase.
- Owners have no accounts; WhatsApp notifications selected; provider not configured.
- Cloudflare Turnstile selected; keys not configured.

## M0 gate

M0 is complete. The user explicitly approved a Next.js migration for staging only. The staging project reference is configured locally; production remains off-limits. No Supabase migration or deployment has been performed.

## Local validation (not a staging or security-milestone pass)

- The public `/` route redirects to the restored `index.html` interface; `predev`/`prebuild` sync its source assets and the installed Supabase browser bundle into `public/`. Mobile menu and saved-room controls are functional. Supabase-backed listings/submissions still require staging configuration.
- `npm run build`: passed; Next.js routes were generated.
- `npm run typecheck`: passed.
- Changed-file lint: exited successfully with one Next.js `<img>` performance warning. Whole-project lint also reports existing warnings in legacy `app.js`.
- `npm run test:security`: 4 CORS allowlist tests passed.
- `node --check app.js`: passed after correcting the legacy payment-retry helper scope.
- Local browser/HTTP checks: consent accept/reject and persistence, homepage/privacy/list-room responses, CSP nonce, same-origin framework chunks, and no browser-console errors.
- No SQL engine validation, staging request, Supabase migration, payment test, or deployment was performed.
- The public search now loads the GeoNames-based Ghana place catalogue, filters region/town pairs, and offers prefix suggestions (including duplicate town names labeled by region); the student campus selector uses the curated campus catalogue and applies the matching region/town. The owner listing location form uses the same towns grouped under the selected region. The catalogue is copied to the public asset directory by the existing pre-dev/prebuild sync script. The generated location SQL seed remains unapplied, and the campus list is curated rather than an official exhaustive register.
- Listing-fee controls are implemented locally in the MFA-protected admin dashboard. The public form reads `public_site_settings`, and new Paystack attempts use the current `website_settings.listing_fee_pesewas`; changes are recorded in settings history. Staging Supabase credentials are not configured here, and the migration/functions have not been deployed, so the live site will not change until the migration is reviewed and applied to staging.
