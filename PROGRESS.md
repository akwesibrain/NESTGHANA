# NestGH Implementation Progress

Last updated: 2026-10-06 (evening)

**Stack:** Next.js (App Router, TypeScript) · MySQL / MariaDB (XAMPP, port 3308) · Prisma ORM 7 · Paystack.
All data goes through the Next.js API (`app/api/*`) to MySQL via Prisma. There is no third-party
database or auth service.

| Step | Status | Notes |
|---|---|---|
| 1. Database | DONE | Prisma schema + migrations in `prisma/`; CHECK constraints and triggers enforce listing status rules, one PAID payment per listing, append-only audit tables. Seed: 16 regions, 14,013 towns, curated areas. |
| 2. Access control (row-level rules) | IN PROGRESS | Enforced in the API: public endpoints return only LIVE, allowlisted fields; admin pages require an MFA-verified session and role checks. The website connects as a least-privilege MySQL user. |
| 3. Owner submission + manage link | DONE | Submission, private manage links (hash-only storage, 1-year expiry, usage log): owners confirm availability, mark taken, update units, fix and resubmit after changes are requested. |
| 4. Image storage | DONE | Private on-disk storage (`storage/listing-images`, outside `public/`); content-checked JPG/PNG/WebP; public only after approval; profile photos never public. |
| 5. Paystack TEST payments | DONE (needs key) | Checkout, return verification, retry and signed webhook; fees by type (Room/Hostel/Space) from the database. Set `PAYSTACK_SECRET_KEY` to enable. |
| 6. Admin authentication + roles | DONE | scrypt passwords, mandatory TOTP MFA, DB sessions, lockout, roles (SUPER_ADMIN / ADMIN / MODERATOR / SUPPORT); dashboard, review page, fee settings. `npm run admin:create`. |
| 7. Connect public website | DONE | Rooms, Shops & Spaces (with filters), reports, fees, submission and payment all use the API. |
| 8. Security testing | IN PROGRESS | Automated tests + CI (GitHub Actions on MariaDB 10.4). Photo metadata (GPS) stripped server-side; Turnstile bot protection ready (needs keys); mariadb driver CVE fixed via override. No external penetration test yet. |
| 9. Staging → production | NOT STARTED | Needs hosting, HTTPS, production MySQL, real Paystack keys, webhook URL. |

## Checks

| Command | What it covers |
|---|---|
| `npm run test:db` | 35 tests on a throwaway database: schema rules, listing lifecycle, admin auth/MFA/sessions, submission, payments (fake Paystack), approval, owner manage links, notifications, availability job |
| `npm run test:e2e` | Whole flow over HTTP on a real Next.js server: submit → pay (webhook) → owner manage link → admin pages → public listing with photos |
| `npm run test:security` | Cross-site request protection, photo metadata (GPS) removal |
| `node --test tests/listing-pricing.test.cjs` | Fees by listing type |
| `npm run typecheck`, `npm run build` | TypeScript and production build |

## Operations

| Command | Purpose |
|---|---|
| `npm run jobs:availability` | Daily: flags listings not confirmed within the confirmation window and queues WhatsApp messages |
| `npm run db:backup` | Daily: compressed MySQL dump in `backups/` (keeps 14). Also back up `storage/` and `.env` |
| `npm run admin:create` | Create or reset an admin from the server |
| `npm run demo:add` / `demo:remove` | Demo listings for local testing |

## Not built yet

- Automatic WhatsApp/email sending (messages are queued in Admin → Messages and sent with one click).
- Shareable public page per listing; server-side room search.
- Hosting decision (photos are on local disk; Netlify cannot keep them).
- `NestGH-admin/` is a design preview with demo data; the working admin is `/admin`.
