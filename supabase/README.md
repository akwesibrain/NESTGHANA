# NestGH Supabase staging

## Environment boundary

- Staging project: `plbtnltcocsuekifddat`.
- Production project: `fcsclcxvxvhzlsrolxhn`; production is off-limits for development, tests, and migration work.
- The previously shared Supabase secret key must be revoked and rotated. Never put service-role or Paystack secrets in browser code, chat, or committed files.
- The staging publishable key and required server-side credentials are not configured in this workspace.

## Current deployment status

The Next.js application and database migration are still under local implementation and validation. **Do not run `supabase db push` or deploy the payment functions yet.** The schema and existing payment functions do not currently use a consistent data model; no migration or function has been deployed. Continue with local validation and resolve that mismatch before any staging change.

When the migration is reviewed and its local tests pass, link only to staging:

```powershell
supabase login
supabase link --project-ref plbtnltcocsuekifddat
```

Before applying a migration, verify the linked project reference in the CLI output. Configure staging-only values directly in the Supabase project or deployment provider—not in source control:

- Supabase URL and publishable key
- Supabase service-role key
- Paystack TEST secret and webhook secret
- Cloudflare Turnstile site and secret keys
- Exact HTTPS staging origin(s)

The application expects `PUBLIC_SITE_URL` for the canonical staging URL and `PUBLIC_SITE_ORIGINS` for the comma-separated browser-origin allowlist. Never use a wildcard origin. The configured listing fee is GH₵30 (3,000 pesewas).

## Admin provisioning

Public sign-ups should remain disabled. After the schema is validated and applied to staging, create the administrator through Supabase Auth, require a verified authenticator factor, and grant only the necessary role in `public.admin_roles`. Do not use the obsolete `public.admin_users` table from the prior static integration.

## Local development

The intended local entry point is the Next.js application (`npm run dev`). Use staging credentials only. Until staging configuration is supplied, backend-dependent pages should report a clear unavailable/configuration state; do not substitute demo data or treat a client payment return as proof of payment.
