# NestGH Security Audit — Milestone 0

**Status:** M0 audit complete. **No implementation or deployment was performed during this audit turn.**
**Scope:** Local workspace inspection only. No Supabase, Paystack, Netlify, or other external service was contacted.
**Evidence:** [reports/evidence/m0-local-baseline.txt](./reports/evidence/m0-local-baseline.txt)

## Section 0 — confirmed facts and decisions

| Item | Confirmed value |
|---|---|
| Current repository state | Static HTML/CSS/JavaScript public site plus a vanilla-JavaScript admin. Supabase migration/function code is present from prior work, but has not been deployed or validated against the project. |
| Target stack | Next.js App Router, TypeScript, Supabase (Postgres, Auth, Storage, Edge Functions), Paystack. |
| Hosting | Netlify selected. Commercial-use eligibility and the selected plan have not been verified. |
| Staging Supabase | `plbtnltcocsuekifddat` (`https://plbtnltcocsuekifddat.supabase.co`). The user identified this newly supplied URL as staging. No staging publishable key, service-role key, or database access has been provided. |
| Production Supabase | `fcsclcxvxvhzlsrolxhn` is designated production-only by the user. It must not be used for migrations, tests, or deployment under the supplied safety rules. |
| Paystack | TEST mode only. Test keys and test-account configuration are not yet available. |
| Standard listing fee | GH₵30.00 / 3,000 pesewas. The current browser integration still contains a GH₵50 value; this is an identified mismatch and is not authoritative. |
| Owner access | No owner accounts. The owner manage-link flow has not been implemented. |
| Owner notifications | WhatsApp selected; a provider and secure delivery configuration are not yet selected/provided. |
| Bot protection | Cloudflare Turnstile selected; site key and server-side secret are not yet provided. |

## Truth check and gate

The repository does **not** match the requested target stack. It has no root `package.json`, Next.js configuration, or TypeScript configuration. The current public site and admin are static browser applications. There is prior Supabase integration scaffolding, but the local browser previously received a missing-`public_listings` schema response; no migration or Edge Function deployment has been verified.

This mismatch means the Next.js application, server-side session handling, database model, owner manage links, authorization model, and deployment pipeline must be built or replaced rather than treated as existing production functionality. Per the attached truth-check instruction, work stops at this audit until the user explicitly approves proceeding with the migration/build. The selected target stack is recorded, but is not treated as permission to bypass the M0 gate.

## Findings

### F-01 — CORS allows every origin when configuration is absent

- **Severity:** LOW
- **Status:** Open; not fixed in this milestone.
- **Location:** `supabase/functions/_shared/http.ts`, line 2.
- **Evidence:** The helper uses `PUBLIC_SITE_ORIGIN ?? "*"`.
- **Risk:** A missing deployment secret silently enables wildcard browser origins rather than failing closed. The endpoint is intentionally callable by anonymous clients, so this is a configuration-hardening issue, not a confirmed authorization bypass.
- **Required remediation:** Use an explicit configured origin allowlist; emit `Access-Control-Allow-Origin` only for a matching request origin, include `Vary: Origin`, and test disallowed origins. Do not deploy until allowed origins are decided and configured.

### F-02 — Existing integration scaffolding does not meet the supplied production security specification

- **Severity:** INFORMATIONAL
- **Status:** Blocker / architectural gap; no claim of completion.
- **Evidence:** The local migration uses JSONB listing data, a single admin-membership table, direct authenticated listing updates, and a public image bucket. Required role permissions, database-enforced status transitions, immutable status history, private/public image separation, payment-event idempotency, manage-link tokens, Turnstile verification, and retention/reconciliation jobs are not established by that scaffolding.
- **Required action:** After explicit approval, implement the agreed Next.js target and validate its database and server boundaries against the remaining milestones. Do not deploy the existing scaffold as production-ready.

### F-03 — Credential and environment setup is incomplete

- **Severity:** INFORMATIONAL
- **Status:** Blocked.
- **Evidence:** Only the staging project URL/ref has been provided for the new staging project. The existing browser configuration points to the production-designated project, while the attached rules prohibit production access during implementation. The staging publishable key, staging-only server credentials, Paystack TEST keys, Turnstile keys, and selected public origin are absent. The Supabase secret shared earlier must be rotated before use.
- **Required action:** Obtain staging credentials through a secure, non-chat channel or configure them directly in the staging provider dashboard; rotate the exposed key; configure only TEST Paystack credentials in staging. Never place server credentials in browser code or reports.

## Local checks performed

- `node --check app.js`: PASS, recorded in the evidence log.
- `node --check NestGH-admin/app.js`: PASS, recorded in the evidence log.
- Root Next.js/TypeScript manifests and configurations: absent.
- Git repository metadata: unavailable; this workspace is not a Git repository, so repository history could not be inspected.
- No live credentials were tested. No external endpoint was contacted during M0.

## Requirement status index

All requirements below remain unverified. `NOT TESTED` means no qualifying security test was run; `BLOCKED` means implementation/deployment/testing cannot safely proceed until the stated gate or prerequisite is resolved. The local baseline log records only the inspected workspace and syntax-check outputs, not evidence that these security requirements pass.

| ID | Status | Evidence / blocker |
|---|---|---|
| DB-1 | BLOCKED | `reports/evidence/m0-local-baseline.txt` — no staging credentials or migration authorization; empty-database migration test not run. |
| DB-2 | BLOCKED | Same — required model is not implemented or constraint-tested. |
| DB-3 | BLOCKED | Same — fee is still GH₵50 in browser code; database fee snapshot in integer pesewas is not established. |
| DB-4 | BLOCKED | Same — normalized locations and verified seed source are absent. |
| DB-5 | BLOCKED | Same — required private-table/view isolation is not established. |
| ST-1 | BLOCKED | Same — allowed status transitions are not enforced by database logic. |
| ST-2 | BLOCKED | Same — database guarantee that LIVE requires paid payment and admin approval is absent. |
| ST-3 | BLOCKED | Same — immutable status history is absent. |
| ST-4 | BLOCKED | Same — listing revisions/approval flow is absent. |
| RLS-1 | BLOCKED | Same — the required complete table/action matrix has not been implemented or tested. |
| RLS-2 | BLOCKED | Same — public/private table and storage isolation has not been verified. |
| RLS-3 | BLOCKED | Same — anonymous writes and report abuse have not been tested. |
| RLS-4 | BLOCKED | Same — storage policies and public/private image lifecycle are not tested. |
| OWN-1 | BLOCKED | Same — owner manage-link submission flow is not implemented. |
| OWN-2 | BLOCKED | Same — token hashing, expiry, scope, revocation, and abuse controls are absent. |
| PAY-1 | BLOCKED | Same — database-sourced fee and server-only amount are not implemented to spec. |
| PAY-2 | NOT TESTED | Same — raw-body webhook signature test using Paystack TEST secret not run. |
| PAY-3 | NOT TESTED | Same — server-side verification attack tests not run. |
| PAY-4 | NOT TESTED | Same — replay/idempotency test not run. |
| PAY-5 | NOT TESTED | Same — concurrent payment-attempt test not run. |
| PAY-6 | BLOCKED | Same — reconciliation job is not implemented. |
| PAY-7 | BLOCKED | Same — refund workflow is not implemented. |
| PAY-8 | NOT TESTED | Same — callback/webhook ordering and redirect trust tests not run. |
| ADM-1 | BLOCKED | Same — MFA/AAL2 and secure server-side session requirements are not implemented. |
| ADM-2 | BLOCKED | Same — role model in database is not implemented. |
| ADM-3 | BLOCKED | Same — permission matrix is not implemented or tested. |
| ADM-4 | BLOCKED | Same — append-only sensitive-action logging is not implemented. |
| RL-1 | BLOCKED | Same — per-endpoint server-side atomic limits are incomplete. |
| RL-2 | BLOCKED | Same — Turnstile server verification and credentials are absent. |
| RL-3 | BLOCKED | Same — trusted proxy configuration for Netlify is not verified. |
| VAL-1 | BLOCKED | Same — strict allowlist validation across all endpoints is not established. |
| UP-1 | BLOCKED | Same — server-side image signature/dimension validation, re-encoding, and metadata stripping are absent. |
| HDR-1 | BLOCKED | Same — production CSP and security headers are not configured or tested. |
| HDR-2 | BLOCKED | Same — explicit CORS allowlist is absent; F-01 remains open. |
| SEC-1 | NOT TESTED | `reports/evidence/m0-local-baseline.txt` — local scope inspected, but complete secret scan and Git-history scan unavailable because no Git repository is present. |
| SEC-2 | NOT TESTED | Same — production build/bundle scan cannot run before the approved target app exists. |
| PRV-1 | BLOCKED | Same — versioned policy/terms consent storage is not implemented. |
| PRV-2 | BLOCKED | Same — retention schedules are not implemented or run. |
| SYNC-1 | NOT TESTED | Same — no staged admin-to-public integration test run. |
| PERF-1 | NOT TESTED | Same — no Next.js build, Lighthouse run, API p95, query-plan, or bundle measurements exist. |
| OBS-1 | BLOCKED | Same — structured security-event and safe-error coverage is incomplete. |
| DEP-1 | BLOCKED | Same — root dependency manifest/install does not exist; dependency audit not run. |
| OPS-1 | BLOCKED | Same — production backup/PITR, incident, rotation, and lockout-recovery runbooks are not established. |

## Implementation follow-up — staging-only, 2026-10-01

The user subsequently approved the Next.js migration for staging only. The M0 findings above are a historical snapshot and are not deployment approval.

- The project now contains a Next.js/TypeScript foundation, an initial normalized-schema draft, server-side admin authentication scaffolding, and public listing-query code. The target build and TypeScript check pass locally; lint exits successfully with warnings in the legacy JavaScript and one image-rendering warning.
- The CORS helper was changed to fail closed with an exact HTTPS-origin allowlist (HTTP localhost is accepted only when explicitly allowlisted). Four unit tests pass. This is a helper-level retest only; Edge Function response behavior has not been integration-tested, so HDR-2/F-01 is not closed.
- A local production-server/browser check confirmed a nonce-based CSP, same-origin Next.js chunks loading, nonce-bearing scripts, and no `unsafe-inline`. This does not establish production headers or test the Netlify deployment.
- The public cookie banner preserves the existing `nestgh_cookie_consent_v1` key and accept/reject record shape; both choices were exercised locally in a browser.
- No Supabase project was contacted and no migration/function was applied. The normalized schema is not yet validated, and it does not match the legacy payment functions' data model. Owner submission, verified image serving, payment processing, and staging end-to-end behavior remain incomplete.
- The staging publishable/server credentials, Paystack TEST credentials, Turnstile keys, and public staging origin remain unconfigured. Production remains off-limits.

Evidence: [CORS helper tests](./reports/evidence/m7-cors-policy-tests.txt), [local CSP smoke](./reports/evidence/m7-local-csp-smoke.txt).
