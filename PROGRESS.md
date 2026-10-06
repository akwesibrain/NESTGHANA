# NestGH Implementation Progress

Last updated: 2026-10-06

**Stack:** Next.js (App Router, TypeScript) · MySQL / MariaDB (XAMPP, port 3308) · Prisma ORM 7 · Paystack.
All data goes through the Next.js API (`app/api/*`) to MySQL via Prisma. There is no third-party
database or auth service.

| Step | Status | Notes |
|---|---|---|
| 1. Database | DONE | Prisma schema + migrations in `prisma/`; CHECK constraints and triggers enforce listing status rules, one PAID payment per listing, append-only audit tables. Seed: 16 regions, 14,013 towns, curated areas. |
| 2. Access control (row-level rules) | IN PROGRESS | Enforced in the API: public endpoints return only LIVE, allowlisted fields; admin pages require an MFA-verified session and role checks. The website connects as a least-privilege MySQL user. |
| 3. Owner submission + manage link | PARTLY DONE | Submission works (`/api/listings/submit`). Owner manage links (edit / mark unavailable later) are not built. |
| 4. Image storage | DONE | Private on-disk storage (`storage/listing-images`, outside `public/`); content-checked JPG/PNG/WebP; public only after approval; profile photos never public. |
| 5. Paystack TEST payments | DONE (needs key) | Checkout, return verification, retry and signed webhook; fees by type (Room/Hostel/Space) from the database. Set `PAYSTACK_SECRET_KEY` to enable. |
| 6. Admin authentication + roles | DONE | scrypt passwords, mandatory TOTP MFA, DB sessions, lockout, roles (SUPER_ADMIN / ADMIN / MODERATOR / SUPPORT); dashboard, review page, fee settings. `npm run admin:create`. |
| 7. Connect public website | DONE | Rooms, Shops & Spaces (with filters), reports, fees, submission and payment all use the API. |
| 8. Security testing | IN PROGRESS | Automated tests below; no external penetration test yet. Bot protection (Turnstile) not built. |
| 9. Staging → production | NOT STARTED | Needs hosting, HTTPS, production MySQL, real Paystack keys, webhook URL. |

## Checks

| Command | What it covers |
|---|---|
| `npm run test:db` | 29 tests on a throwaway database: schema rules, listing lifecycle, admin auth/MFA/sessions, submission, payments (fake Paystack), approval |
| `npm run test:e2e` | Whole flow over HTTP on a real Next.js server: submit → pay (webhook) → admin review → public listing with photos |
| `npm run test:security` | Cross-site request protection |
| `node --test tests/listing-pricing.test.cjs` | Fees by listing type |
| `npm run typecheck`, `npm run build` | TypeScript and production build |

## Not built yet

- Owner manage links, availability confirmation job, WhatsApp notifications, Turnstile bot protection.
- `NestGH-admin/` is a design preview with demo data; the working admin is `/admin`.
