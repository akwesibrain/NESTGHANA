# NestGH Threat Model — Milestone 0

**Status:** Initial scope and abuse-case inventory. No security test is implied by this document.
**Application target:** Next.js App Router + TypeScript + Supabase + Paystack, hosted on Netlify.
**Current implementation:** Static HTML/CSS/JavaScript public site and vanilla-JavaScript admin, with undeployed Supabase scaffolding.
**Evidence baseline:** [reports/evidence/m0-local-baseline.txt](./reports/evidence/m0-local-baseline.txt)

## Assets

- Listing availability, rent, rules, photos, owner contact details, exact property directions, and map pins.
- Admin accounts, roles, private owner/listing data, moderation decisions, and security/audit history.
- Payment references, fee snapshots, transaction identifiers, webhook events, and refund records.
- Owner manage-link tokens, consent records, Turnstile challenges, rate-limit counters, and service credentials.
- Public-site integrity, site availability, and trust in listing verification.

## Trust boundaries and actors

- Anonymous room seekers and report submitters.
- Anonymous property owners submitting listings and later using scoped manage links (no owner accounts).
- Admin roles: SUPER_ADMIN, ADMIN, MODERATOR, SUPPORT.
- Next.js server routes/actions and Supabase Edge Functions.
- Supabase Postgres, Auth, private/public Storage, and public views.
- Paystack TEST integration and signed webhooks.
- Netlify hosting, proxy headers, logs, and deployment secrets.
- Browser-to-server, server-to-database, server-to-Paystack, and webhook-to-server boundaries.

## Abuse cases to test by feature

| Feature / boundary | Abuse case | Required controls and test outcome |
|---|---|---|
| Admin sign-in | Credential stuffing, account enumeration, session theft, bypassing MFA, use of an unassigned Auth user | Database-backed roles, AAL2, rate limits per IP/account, server-enforced authorization, short secure sessions; unauthorized attempts denied and logged without exposing account existence. |
| Admin authorization | SUPPORT/MODERATOR calls ADMIN/SUPER_ADMIN actions; IDOR across listing/payment/report/admin IDs; mass assignment of status, roles, or verification flags | Permission checks at server and database boundaries; allowlisted request schemas; permission matrix tests deny out-of-role and cross-resource access. |
| Owner listing submission | Spam, fake identities, fraudulent listings, forged location/price/status/role fields, repeated submissions, malicious JSON, SQL/XSS payloads | No direct anonymous table writes; strict server schema; location IDs; Turnstile verification; atomic per-IP/account/listing limits; safe output encoding. |
| Owner manage links | Guessing, replay, leakage through referrers/logs, stolen token reused to read or change another listing | At least 256-bit random token, hash-at-rest, expiry, purpose/scope, revocation, attempt limits/logs, `no-referrer`, no third-party page resources, narrowly scoped owner actions. |
| Listing photos | Executable/polyglot renamed as image, MIME spoofing, EXIF location disclosure, oversized/decompression bomb, path traversal, public access to pending/private photos | Server signature/dimension validation, server-side re-encoding and metadata stripping, random object paths, per-listing limits, private pending bucket, publish approved images only; test both allowed and denied access. |
| Public listings/search | Enumeration of drafts/private fields, hidden address/email disclosure, XSS in owner text, unbounded-query abuse, stale data after moderation | Whitelisted public view/columns, output encoding, pagination and query limits, no shared caching of private data, invalidate/revalidate public data after moderation. |
| Direct contact and reports | Scraping owner phone numbers, contact/report floods, malicious report text, report IDOR | Rate-limited contact endpoint that records counts; plain disclosure that a real visitor receives contact details; Turnstile and validation for anonymous reports; admin-only report contact details. |
| Payments | Client changes fee/reference/status; forged success redirect; amount/currency mismatch; replay; concurrent attempts; duplicate webhook; out-of-order callback/webhook; refund manipulation | Fee snapshot from server-side settings in integer pesewas; provider verification; raw-body HMAC; exact amount/currency/reference/listing checks; row-lock transaction, unique transaction/event constraints, idempotent replay; redirect never marks paid; audited refund permission. |
| CORS and HTTP headers | Malicious site invokes endpoints; framing/clickjacking; MIME sniffing; referrer leakage; CSP bypass; insecure transport | Exact origin allowlist, fail-closed behavior, `Vary: Origin`, CSP, HSTS, frame denial, referrer and permissions policies, content-type hardening; test allowed and denied origins and headers. |
| Rate limits and bot protection | Spoofed forwarding headers, distributed retries, token guessing, endpoint-specific abuse | Trust only the documented Netlify proxy header; atomic shared counters and `Retry-After`; endpoint-specific thresholds; server-verified Turnstile; controlled-volume rate-limit tests. |
| Privacy and retention | Excess collection, policy-consent mismatch, old drafts/logs/reports retained indefinitely, sensitive details in logs | Versioned consents per submission, scheduled retention jobs and tests, personal-data export/correction/deletion process, minimized structured logs without secrets or full payment payloads. |
| Operations/deployment | Accidental migration/deployment to production, secret leakage, compromised admin lockout, missing backups | Staging and production project separation; staging-only credentials and TEST payments; approval gates; rotation and incident runbooks; verified backup/PITR and recovery procedure. |

## Current blockers and known issues

- The user designated `plbtnltcocsuekifddat` as staging and `fcsclcxvxvhzlsrolxhn` as production-only. Production must not be contacted under the supplied rules.
- Staging publishable/server credentials, Paystack TEST keys, Turnstile keys, and the public origin are missing.
- Existing code does not match the selected Next.js/TypeScript architecture.
- Existing Supabase scaffolding has not been deployed or validated, and does not satisfy the controls above.
- A CORS helper currently defaults to wildcard origin when configuration is missing; this remains open for the implementation milestone.
- Netlify plan/commercial-use terms and trusted proxy header behavior have not been verified.

## M0 exit

M0 records the current state and threat inventory. No application files were modified in this audit turn. Implementation remains gated until the owner explicitly approves proceeding with the requested Next.js migration after reviewing the mismatch.

## Staging implementation update — 2026-10-01

The owner later approved the Next.js migration for staging only. The M0 threat model remains the control baseline; no database migration, payment function, or deployment has been applied. Exact-origin CORS matching and nonce-CSP changes have local tests/smoke evidence, but endpoint integration, staging credentials, Turnstile, image processing, owner flows, payment finalization, and the full abuse-case matrix remain unverified. Do not use the production project for development or testing.
