create extension if not exists pgcrypto;

create type public.listing_status as enum (
  'DRAFT',
  'PAYMENT_PENDING',
  'PENDING_APPROVAL',
  'CHANGES_REQUESTED',
  'LIVE',
  'NEEDS_CONFIRMATION',
  'UNAVAILABLE',
  'REJECTED',
  'REMOVED'
);

create type public.admin_role as enum ('SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT');
create type public.actor_type as enum ('SYSTEM', 'ADMIN', 'OWNER');
create type public.payment_status as enum (
  'PENDING', 'PROCESSING', 'PAID', 'FAILED', 'ABANDONED', 'REFUNDED', 'PARTIALLY_REFUNDED'
);
create type public.report_status as enum ('OPEN', 'REVIEWING', 'RESOLVED', 'DISMISSED');
create type public.location_kind as enum ('REGION', 'TOWN', 'AREA');
create type public.rent_period as enum ('MONTH', 'THREE_MONTHS', 'SIX_MONTHS', 'YEAR', 'SEMESTER', 'OTHER');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.admin_role not null,
  granted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, role)
);
create index admin_roles_role_user_idx on public.admin_roles (role, user_id);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  kind public.location_kind not null,
  parent_id uuid references public.locations(id) on delete restrict,
  name text not null check (char_length(name) between 1 and 100),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, kind)
);
create unique index locations_region_slug_unique on public.locations (slug) where kind = 'REGION';
create unique index locations_child_slug_unique on public.locations (parent_id, slug) where parent_id is not null;
create index locations_parent_kind_idx on public.locations (parent_id, kind);

create or replace function public.validate_location_parent()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  parent_kind public.location_kind;
begin
  if new.kind = 'REGION' then
    if new.parent_id is not null then raise exception 'A region cannot have a parent'; end if;
    return new;
  end if;
  if new.parent_id is null then raise exception 'A town or area must have a parent'; end if;

  select l.kind into parent_kind from public.locations l where l.id = new.parent_id;
  if new.kind = 'TOWN' and parent_kind <> 'REGION' then
    raise exception 'A town must belong to a region';
  elsif new.kind = 'AREA' and parent_kind <> 'TOWN' then
    raise exception 'An area must belong to a town';
  end if;
  return new;
end;
$$;
create trigger locations_validate_parent
before insert or update of kind, parent_id on public.locations
for each row execute function public.validate_location_parent();

create table public.location_aliases (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations(id) on delete cascade,
  alias text not null check (char_length(alias) between 1 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (location_id, alias)
);
create index location_aliases_alias_idx on public.location_aliases (lower(alias));

create table public.location_neighbors (
  location_id uuid not null references public.locations(id) on delete cascade,
  neighbor_id uuid not null references public.locations(id) on delete cascade,
  estimated_km numeric(7,2) not null check (estimated_km >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (location_id, neighbor_id),
  check (location_id <> neighbor_id)
);

create table public.owners (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone_e164 text not null check (phone_e164 ~ '^\+233[235][0-9]{8}$'),
  whatsapp_e164 text not null check (whatsapp_e164 ~ '^\+233[235][0-9]{8}$'),
  email text not null check (char_length(email) <= 254 and position('@' in email) > 1),
  relationship text not null check (char_length(relationship) between 2 and 250),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index owners_phone_idx on public.owners (phone_e164);
create index owners_email_idx on public.owners (lower(email));

create table public.website_settings (
  id smallint primary key default 1 check (id = 1),
  listing_fee_pesewas integer not null check (listing_fee_pesewas > 0),
  currency text not null default 'GHS' check (currency = 'GHS'),
  confirmation_days integer not null default 30 check (confirmation_days between 1 and 365),
  privacy_policy_version text not null check (char_length(privacy_policy_version) between 1 and 40),
  terms_version text not null check (char_length(terms_version) between 1 and 40),
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.website_settings (
  id, listing_fee_pesewas, currency, confirmation_days, privacy_policy_version, terms_version
) values (1, 3000, 'GHS', 30, '2026-10-01', '2026-10-01');

create table public.website_settings_history (
  id uuid primary key default gen_random_uuid(),
  setting_id smallint not null references public.website_settings(id) on delete restrict,
  listing_fee_pesewas integer not null check (listing_fee_pesewas > 0),
  currency text not null check (currency = 'GHS'),
  confirmation_days integer not null check (confirmation_days between 1 and 365),
  changed_by uuid references auth.users(id) on delete set null,
  reason text not null check (char_length(reason) between 3 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  status public.listing_status not null default 'DRAFT',
  owner_id uuid not null references public.owners(id) on delete restrict,
  area_id uuid not null references public.locations(id) on delete restrict,
  title text not null check (char_length(title) between 8 and 100),
  description text not null check (char_length(description) between 100 and 5000),
  room_type text not null check (room_type in ('Single Room', 'Chamber & Hall', 'Self-Contained', '1-in-a-Room', '2-in-a-Room', '4-in-a-Room', 'Student Hostel')),
  condition text not null check (condition in ('New', 'Newly Renovated', 'Good Condition', 'Fair Condition')),
  furnished text not null check (furnished in ('Furnished', 'Unfurnished')),
  units_total smallint not null check (units_total between 1 and 500),
  bedrooms smallint not null check (bedrooms between 0 and 100),
  rent_amount_pesewas integer not null check (rent_amount_pesewas > 0),
  rent_period public.rent_period not null,
  rent_period_other text check (rent_period_other is null or char_length(rent_period_other) between 2 and 80),
  advance_payments smallint not null check (advance_payments between 0 and 120),
  deposit_pesewas integer not null default 0 check (deposit_pesewas >= 0),
  agency_fee_pesewas integer not null default 0 check (agency_fee_pesewas >= 0),
  other_charges_pesewas integer not null default 0 check (other_charges_pesewas >= 0),
  facilities jsonb not null default '{}'::jsonb check (jsonb_typeof(facilities) = 'object'),
  rules jsonb not null default '{}'::jsonb check (jsonb_typeof(rules) = 'object'),
  availability_date date not null,
  units_available smallint not null check (units_available between 0 and 500),
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  last_confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (units_available <= units_total),
  check ((rent_period = 'OTHER') = (rent_period_other is not null)),
  check ((status = 'LIVE') = (approved_at is not null) or status in ('NEEDS_CONFIRMATION', 'UNAVAILABLE', 'REMOVED', 'REJECTED', 'CHANGES_REQUESTED', 'PENDING_APPROVAL', 'PAYMENT_PENDING', 'DRAFT'))
);
create index listings_public_status_created_idx on public.listings (created_at desc, id) where status = 'LIVE';
create index listings_status_created_idx on public.listings (status, created_at desc);
create index listings_area_status_idx on public.listings (area_id, status);
create index listings_owner_idx on public.listings (owner_id);

create or replace function public.guard_listing_status_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if new.status <> 'DRAFT' then raise exception 'Listings must begin in DRAFT'; end if;
  elsif new.status is distinct from old.status
    and coalesce(current_setting('nestgh.status_transition', true), 'false') <> 'true' then
    raise exception 'Listing status changes must use the approved transition function';
  end if;
  if new.status = 'LIVE' then
    if new.approved_at is null then raise exception 'A listing requires admin approval before becoming LIVE'; end if;
    if not exists (select 1 from public.payments p where p.listing_id = new.id and p.status = 'PAID') then
      raise exception 'A listing requires a PAID listing fee before becoming LIVE';
    end if;
  end if;
  return new;
end;
$$;
create trigger listings_guard_status
before insert or update of status, approved_at on public.listings
for each row execute function public.guard_listing_status_change();

create table public.listing_private (
  listing_id uuid primary key references public.listings(id) on delete cascade,
  exact_address text not null check (char_length(exact_address) between 5 and 1000),
  directions text check (directions is null or char_length(directions) <= 2000),
  exact_latitude numeric(9,6) check (exact_latitude between -90 and 90),
  exact_longitude numeric(9,6) check (exact_longitude between -180 and 180),
  map_url text check (map_url is null or char_length(map_url) <= 2048),
  moderation_notes text not null default '' check (char_length(moderation_notes) <= 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.listing_verifications (
  listing_id uuid primary key references public.listings(id) on delete cascade,
  phone_verified_at timestamptz,
  phone_verified_by uuid references auth.users(id) on delete set null,
  identity_verified_at timestamptz,
  identity_verified_by uuid references auth.users(id) on delete set null,
  property_verified_at timestamptz,
  property_verified_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  category text not null check (category in ('Exterior', 'Bedroom', 'Bathroom', 'Kitchen', 'Compound or common area', 'Extra', 'Profile')),
  storage_path text not null unique check (storage_path !~ '(^/|\\.\\.|\\\\)'),
  display_order smallint not null check (display_order between 0 and 20),
  approved_for_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (listing_id, category, display_order)
);
create index listing_images_listing_order_idx on public.listing_images (listing_id, display_order);

create table public.listing_revisions (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  proposed_public_data jsonb not null check (jsonb_typeof(proposed_public_data) = 'object'),
  reason text not null check (char_length(reason) between 3 and 1000),
  status text not null default 'PENDING' check (status in ('PENDING', 'APPROVED', 'REJECTED')),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index listing_revisions_listing_status_idx on public.listing_revisions (listing_id, status, created_at desc);

create table public.listing_status_history (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete restrict,
  previous_status public.listing_status,
  new_status public.listing_status not null,
  actor_type public.actor_type not null,
  actor_id uuid,
  reason text,
  source text not null check (char_length(source) between 1 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index listing_status_history_listing_time_idx on public.listing_status_history (listing_id, created_at desc);

create or replace function public.reject_history_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'Audit history is append-only';
end;
$$;
create trigger listing_status_history_immutable
before update or delete on public.listing_status_history
for each row execute function public.reject_history_mutation();

create table public.listing_availability (
  listing_id uuid primary key references public.listings(id) on delete cascade,
  last_confirmed_at timestamptz,
  confirmed_by public.actor_type,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete restrict,
  reference text not null unique check (reference ~ '^NGH-[A-Z0-9]{20,64}$'),
  amount_pesewas integer not null check (amount_pesewas > 0),
  currency text not null check (currency = 'GHS'),
  status public.payment_status not null default 'PENDING',
  paystack_transaction_id text unique,
  refund_amount_pesewas integer not null default 0 check (refund_amount_pesewas >= 0),
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (refund_amount_pesewas <= amount_pesewas)
);
create index payments_listing_created_idx on public.payments (listing_id, created_at desc);
create index payments_status_created_idx on public.payments (status, created_at);
create unique index payments_one_paid_per_listing_idx on public.payments (listing_id) where status = 'PAID';

create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  payment_reference text not null,
  event_type text not null check (char_length(event_type) between 1 and 100),
  body_sha256 bytea not null check (octet_length(body_sha256) = 32),
  raw_payload jsonb not null check (jsonb_typeof(raw_payload) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (payment_reference, event_type, body_sha256)
);
create index payment_events_reference_idx on public.payment_events (payment_reference, created_at desc);
create trigger payment_events_immutable
before update or delete on public.payment_events
for each row execute function public.reject_history_mutation();

create table public.admin_activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references auth.users(id) on delete set null,
  action text not null check (char_length(action) between 1 and 120),
  resource_type text not null check (char_length(resource_type) between 1 and 80),
  resource_id uuid,
  previous_state jsonb check (previous_state is null or jsonb_typeof(previous_state) = 'object'),
  new_state jsonb check (new_state is null or jsonb_typeof(new_state) = 'object'),
  reason text,
  source text not null check (char_length(source) between 1 and 100),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index admin_activity_logs_user_time_idx on public.admin_activity_logs (admin_user_id, created_at desc);
create index admin_activity_logs_resource_time_idx on public.admin_activity_logs (resource_type, resource_id, created_at desc);
create trigger admin_activity_logs_immutable
before update or delete on public.admin_activity_logs
for each row execute function public.reject_history_mutation();

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete restrict,
  reason text not null check (char_length(reason) between 3 and 1000),
  reporter_contact text check (reporter_contact is null or char_length(reporter_contact) <= 254),
  status public.report_status not null default 'OPEN',
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index reports_status_created_idx on public.reports (status, created_at desc);
create index reports_listing_idx on public.reports (listing_id, created_at desc);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  channel text not null check (channel in ('PHONE', 'WHATSAPP')),
  visitor_ip_hash bytea not null check (octet_length(visitor_ip_hash) = 32),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index inquiries_listing_time_idx on public.inquiries (listing_id, created_at desc);

create table public.consents (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  privacy_policy_version text not null,
  terms_version text not null,
  checkbox_values jsonb not null check (jsonb_typeof(checkbox_values) = 'object'),
  consented_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index consents_listing_idx on public.consents (listing_id);

create table public.manage_link_tokens (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  token_sha256 bytea not null unique check (octet_length(token_sha256) = 32),
  purpose text not null check (purpose in ('MANAGE_LISTING')),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at > created_at)
);
create index manage_link_tokens_listing_idx on public.manage_link_tokens (listing_id, expires_at desc);

create table public.manage_link_usage (
  id uuid primary key default gen_random_uuid(),
  token_id uuid references public.manage_link_tokens(id) on delete set null,
  listing_id uuid references public.listings(id) on delete set null,
  action text not null check (char_length(action) between 1 and 80),
  succeeded boolean not null,
  ip_hash bytea check (ip_hash is null or octet_length(ip_hash) = 32),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index manage_link_usage_token_time_idx on public.manage_link_usage (token_id, created_at desc);

create table public.rate_limit_counters (
  endpoint text not null check (char_length(endpoint) between 1 and 80),
  key_sha256 bytea not null check (octet_length(key_sha256) = 32),
  window_started_at timestamptz not null,
  request_count integer not null check (request_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (endpoint, key_sha256)
);
create index rate_limit_window_idx on public.rate_limit_counters (window_started_at);

create table public.security_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (char_length(event_type) between 1 and 100),
  severity text not null check (severity in ('INFO', 'WARN', 'ERROR')),
  ip_hash bytea check (ip_hash is null or octet_length(ip_hash) = 32),
  actor_id uuid,
  resource_type text,
  resource_id uuid,
  safe_metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(safe_metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index security_events_type_time_idx on public.security_events (event_type, created_at desc);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'admin_roles', 'locations', 'location_aliases', 'location_neighbors',
    'owners', 'website_settings', 'website_settings_history', 'listings', 'listing_private',
    'listing_verifications', 'listing_images', 'listing_revisions', 'listing_status_history',
    'listing_availability', 'payments', 'payment_events', 'admin_activity_logs', 'reports',
    'inquiries', 'consents', 'manage_link_tokens', 'manage_link_usage',
    'rate_limit_counters', 'security_events'
  ] loop
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', table_name || '_set_updated_at', table_name);
  end loop;
end;
$$;

create or replace function public.has_admin_role(p_roles public.admin_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and p_roles is not null
    and cardinality(p_roles) > 0
    and exists (
      select 1 from public.admin_roles ar
      where ar.user_id = (select auth.uid()) and ar.role = any(p_roles)
    );
$$;

create or replace function public.transition_listing(
  p_listing_id uuid,
  p_new_status public.listing_status,
  p_actor_type public.actor_type,
  p_actor_id uuid,
  p_reason text,
  p_source text
)
returns public.listings
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_listing public.listings;
  next_listing public.listings;
  db_role text := coalesce(current_setting('request.jwt.claim.role', true), '');
  allowed boolean := false;
  is_admin boolean := false;
  previous_status public.listing_status;
begin
  if char_length(coalesce(p_source, '')) not between 1 and 100 then
    raise exception 'Invalid transition source';
  end if;

  if p_actor_type = 'ADMIN' then
    if db_role <> 'authenticated' or p_actor_id is distinct from (select auth.uid()) then
      raise exception 'Admin identity is not authorized';
    end if;
    is_admin := public.has_admin_role(array['SUPER_ADMIN', 'ADMIN', 'MODERATOR']::public.admin_role[]);
    if not is_admin then raise exception 'Admin role required'; end if;
  elsif db_role <> 'service_role' then
    raise exception 'System and owner transitions require the trusted server';
  end if;

  select l.* into current_listing
  from public.listings l
  where l.id = p_listing_id
  for update;
  if not found then raise exception 'Listing not found'; end if;
  previous_status := current_listing.status;

  if current_listing.status = 'DRAFT' and p_new_status = 'PAYMENT_PENDING'
    and p_actor_type = 'SYSTEM' and p_source = 'validated_submission' then
    allowed := true;
  elsif current_listing.status = 'PAYMENT_PENDING' and p_new_status = 'PENDING_APPROVAL'
    and p_actor_type = 'SYSTEM' and p_source = 'verified_payment' then
    allowed := true;
  elsif current_listing.status = 'PAYMENT_PENDING' and p_new_status = 'REMOVED'
    and (
      (p_actor_type = 'SYSTEM' and p_source in ('draft_purge', 'payment_abandoned'))
      or p_actor_type = 'ADMIN'
    ) then
    allowed := true;
  elsif current_listing.status = 'PENDING_APPROVAL' and p_new_status in ('LIVE', 'CHANGES_REQUESTED', 'REJECTED')
    and p_actor_type = 'ADMIN' then
    allowed := true;
  elsif current_listing.status = 'CHANGES_REQUESTED' and p_new_status = 'PENDING_APPROVAL'
    and p_actor_type = 'OWNER' and p_source = 'owner_manage' then
    allowed := true;
  elsif current_listing.status in ('LIVE', 'NEEDS_CONFIRMATION') and p_new_status = 'UNAVAILABLE'
    and p_actor_type in ('ADMIN', 'OWNER')
    and (p_actor_type = 'ADMIN' or p_source = 'owner_manage') then
    allowed := true;
  elsif current_listing.status in ('NEEDS_CONFIRMATION', 'UNAVAILABLE') and p_new_status = 'LIVE'
    and (p_actor_type = 'ADMIN' or (p_actor_type = 'OWNER' and p_source = 'owner_manage')) then
    allowed := true;
  elsif current_listing.status = 'LIVE' and p_new_status = 'NEEDS_CONFIRMATION'
    and p_actor_type = 'SYSTEM' and p_source = 'availability_job' then
    allowed := true;
  elsif current_listing.status in ('LIVE', 'NEEDS_CONFIRMATION', 'UNAVAILABLE') and p_new_status = 'REMOVED'
    and p_actor_type = 'ADMIN' then
    allowed := true;
  elsif current_listing.status = 'REJECTED' and p_new_status = 'REMOVED'
    and p_actor_type = 'ADMIN' then
    allowed := true;
  elsif current_listing.status = 'REMOVED' and p_actor_type = 'ADMIN'
    and public.has_admin_role(array['SUPER_ADMIN']::public.admin_role[]) then
    select h.previous_status into p_new_status
    from public.listing_status_history h
    where h.listing_id = p_listing_id and h.new_status = 'REMOVED'
    order by h.created_at desc limit 1;
    allowed := p_new_status is not null;
  end if;

  if not allowed then raise exception 'Status transition is not allowed'; end if;
  if p_new_status in ('CHANGES_REQUESTED', 'REJECTED', 'REMOVED')
    and char_length(trim(coalesce(p_reason, ''))) < 3 then
    raise exception 'A reason is required for this transition';
  end if;
  if p_new_status = 'LIVE' and not exists (
    select 1 from public.payments p where p.listing_id = p_listing_id and p.status = 'PAID'
  ) then
    raise exception 'A listing needs a paid fee before going live';
  end if;
  if p_new_status = 'LIVE' and current_listing.approved_at is null and p_actor_type <> 'ADMIN' then
    raise exception 'First publication requires admin approval';
  end if;

  perform set_config('nestgh.status_transition', 'true', true);
  update public.listings
  set status = p_new_status,
      approved_by = case when p_new_status = 'LIVE' and p_actor_type = 'ADMIN' then p_actor_id else approved_by end,
      approved_at = case when p_new_status = 'LIVE' and p_actor_type = 'ADMIN' then now() else approved_at end,
      last_confirmed_at = case when p_new_status = 'LIVE' then now() else last_confirmed_at end
  where id = p_listing_id
  returning * into next_listing;
  perform set_config('nestgh.status_transition', 'false', true);

  insert into public.listing_status_history (
    listing_id, previous_status, new_status, actor_type, actor_id, reason, source
  ) values (
    p_listing_id, previous_status, p_new_status, p_actor_type, p_actor_id, nullif(trim(p_reason), ''), p_source
  );
  if p_actor_type = 'ADMIN' then
    insert into public.admin_activity_logs (
      admin_user_id, action, resource_type, resource_id, previous_state, new_state, reason, source
    ) values (
      p_actor_id, 'LISTING_STATUS_CHANGED', 'LISTING', p_listing_id,
      jsonb_build_object('status', previous_status),
      jsonb_build_object('status', p_new_status),
      nullif(trim(p_reason), ''), p_source
    );
  end if;
  return next_listing;
end;
$$;

create or replace function public.finalize_paystack_payment(
  p_reference text,
  p_transaction_id text,
  p_amount_pesewas integer,
  p_currency text,
  p_event_type text,
  p_raw_body_sha256 bytea,
  p_raw_payload jsonb
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  payment_row public.payments;
  inserted_event_id uuid;
  db_role text := coalesce(current_setting('request.jwt.claim.role', true), '');
begin
  if db_role <> 'service_role' then raise exception 'Trusted server required'; end if;
  if p_reference !~ '^NGH-[A-Z0-9]{20,64}$'
    or char_length(coalesce(p_transaction_id, '')) not between 1 and 100
    or p_amount_pesewas <= 0
    or p_currency <> 'GHS'
    or octet_length(p_raw_body_sha256) <> 32
    or jsonb_typeof(p_raw_payload) <> 'object' then
    raise exception 'Invalid verified payment data';
  end if;

  select p.* into payment_row
  from public.payments p
  where p.reference = p_reference
  for update;
  if not found then raise exception 'Payment reference not found'; end if;

  insert into public.payment_events (payment_reference, event_type, body_sha256, raw_payload)
  values (p_reference, p_event_type, p_raw_body_sha256, p_raw_payload)
  on conflict (payment_reference, event_type, body_sha256) do nothing
  returning id into inserted_event_id;

  if inserted_event_id is null or payment_row.status = 'PAID' then
    return false;
  end if;
  if payment_row.status not in ('PENDING', 'PROCESSING')
    or payment_row.amount_pesewas <> p_amount_pesewas
    or payment_row.currency <> p_currency then
    raise exception 'Verified payment does not match the stored payment';
  end if;

  update public.payments
  set status = 'PAID',
      paystack_transaction_id = p_transaction_id,
      paid_at = now()
  where id = payment_row.id;

  perform public.transition_listing(
    payment_row.listing_id, 'PENDING_APPROVAL', 'SYSTEM', null, null, 'verified_payment'
  );
  return true;
end;
$$;

create or replace function public.consume_rate_limit(
  p_endpoint text,
  p_key_sha256 bytea,
  p_max_requests integer,
  p_window_seconds integer
)
returns table (allowed boolean, retry_after_seconds integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  db_role text := coalesce(current_setting('request.jwt.claim.role', true), '');
  counter public.rate_limit_counters;
  now_time timestamptz := now();
begin
  if db_role <> 'service_role' then raise exception 'Trusted server required'; end if;
  if char_length(coalesce(p_endpoint, '')) not between 1 and 80
    or octet_length(p_key_sha256) <> 32
    or p_max_requests < 1 or p_window_seconds < 1 then
    raise exception 'Invalid rate-limit request';
  end if;

  insert into public.rate_limit_counters (endpoint, key_sha256, window_started_at, request_count)
  values (p_endpoint, p_key_sha256, now_time, 1)
  on conflict (endpoint, key_sha256) do update
    set window_started_at = case
          when public.rate_limit_counters.window_started_at <= now_time - make_interval(secs => p_window_seconds) then now_time
          else public.rate_limit_counters.window_started_at
        end,
        request_count = case
          when public.rate_limit_counters.window_started_at <= now_time - make_interval(secs => p_window_seconds) then 1
          else public.rate_limit_counters.request_count + 1
        end,
        updated_at = now_time
  returning * into counter;

  allowed := counter.request_count <= p_max_requests;
  retry_after_seconds := greatest(0, ceil(extract(epoch from (
    counter.window_started_at + make_interval(secs => p_window_seconds) - now_time
  )))::integer);
  return next;
end;
$$;

create or replace view public.public_listings
with (security_invoker = true)
as
select
  l.id,
  l.title,
  l.description,
  l.room_type,
  l.rent_amount_pesewas,
  l.rent_period,
  area.name as area,
  town.name as town,
  l.facilities,
  l.rules,
  l.last_confirmed_at,
  l.created_at,
  coalesce(array_agg(li.storage_path order by li.display_order)
    filter (where li.id is not null and li.category <> 'Profile'), '{}') as photo_paths
from public.listings l
join public.locations area on area.id = l.area_id and area.kind = 'AREA'
join public.locations town on town.id = area.parent_id and town.kind = 'TOWN'
left join public.listing_images li on li.listing_id = l.id and li.approved_for_public
where l.status = 'LIVE'
group by l.id, area.name, town.name;

create or replace view public.public_site_settings
with (security_invoker = true)
as
select listing_fee_pesewas, currency, privacy_policy_version, terms_version
from public.website_settings
where id = 1;

create policy listings_public_live_read on public.listings
for select to anon, authenticated using (status = 'LIVE');
create policy listing_images_public_read on public.listing_images
for select to anon, authenticated using (
  approved_for_public
  and category <> 'Profile'
  and exists (select 1 from public.listings l where l.id = listing_id and l.status = 'LIVE')
);
create policy website_settings_public_read on public.website_settings
for select to anon, authenticated using (id = 1);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'admin_roles', 'locations', 'location_aliases', 'location_neighbors',
    'owners', 'website_settings', 'website_settings_history', 'listings', 'listing_private',
    'listing_verifications', 'listing_images', 'listing_revisions', 'listing_status_history',
    'listing_availability', 'payments', 'payment_events', 'admin_activity_logs', 'reports',
    'inquiries', 'consents', 'manage_link_tokens', 'manage_link_usage',
    'rate_limit_counters', 'security_events'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on public.%I from anon, authenticated', table_name);
  end loop;
end;
$$;

create policy locations_public_read on public.locations
for select to anon, authenticated using (true);
create policy location_aliases_public_read on public.location_aliases
for select to anon, authenticated using (true);

create policy profiles_admin_read on public.profiles
for select to authenticated using (public.has_admin_role(array['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT']::public.admin_role[]));
create policy roles_self_or_admin_read on public.admin_roles
for select to authenticated using (
  user_id = (select auth.uid())
  or public.has_admin_role(array['SUPER_ADMIN', 'ADMIN']::public.admin_role[])
);
create policy owners_admin_read on public.owners
for select to authenticated using (public.has_admin_role(array['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT']::public.admin_role[]));
create policy website_settings_admin_read on public.website_settings
for select to authenticated using (public.has_admin_role(array['SUPER_ADMIN', 'ADMIN']::public.admin_role[]));
create policy settings_history_admin_read on public.website_settings_history
for select to authenticated using (public.has_admin_role(array['SUPER_ADMIN', 'ADMIN']::public.admin_role[]));
create policy listings_admin_read on public.listings
for select to authenticated using (public.has_admin_role(array['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT']::public.admin_role[]));
create policy listing_private_admin_read on public.listing_private
for select to authenticated using (public.has_admin_role(array['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT']::public.admin_role[]));
create policy verifications_admin_read on public.listing_verifications
for select to authenticated using (public.has_admin_role(array['SUPER_ADMIN', 'ADMIN', 'MODERATOR']::public.admin_role[]));
create policy listing_images_admin_read on public.listing_images
for select to authenticated using (public.has_admin_role(array['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT']::public.admin_role[]));
create policy revisions_admin_read on public.listing_revisions
for select to authenticated using (public.has_admin_role(array['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT']::public.admin_role[]));
create policy status_history_admin_read on public.listing_status_history
for select to authenticated using (public.has_admin_role(array['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT']::public.admin_role[]));
create policy availability_public_read on public.listing_availability
for select to anon, authenticated using (
  exists (select 1 from public.listings l where l.id = listing_id and l.status = 'LIVE')
);
create policy payments_admin_read on public.payments
for select to authenticated using (public.has_admin_role(array['SUPER_ADMIN', 'ADMIN']::public.admin_role[]));
create policy payment_events_admin_read on public.payment_events
for select to authenticated using (public.has_admin_role(array['SUPER_ADMIN', 'ADMIN']::public.admin_role[]));
create policy activity_admin_read on public.admin_activity_logs
for select to authenticated using (public.has_admin_role(array['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT']::public.admin_role[]));
create policy reports_admin_read on public.reports
for select to authenticated using (public.has_admin_role(array['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT']::public.admin_role[]));
create policy inquiries_admin_read on public.inquiries
for select to authenticated using (public.has_admin_role(array['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT']::public.admin_role[]));
create policy consents_admin_read on public.consents
for select to authenticated using (public.has_admin_role(array['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT']::public.admin_role[]));
create policy manage_tokens_admin_read on public.manage_link_tokens
for select to authenticated using (public.has_admin_role(array['SUPER_ADMIN', 'ADMIN']::public.admin_role[]));
create policy manage_usage_admin_read on public.manage_link_usage
for select to authenticated using (public.has_admin_role(array['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT']::public.admin_role[]));
create policy security_events_admin_read on public.security_events
for select to authenticated using (public.has_admin_role(array['SUPER_ADMIN', 'ADMIN']::public.admin_role[]));
create policy location_neighbors_public_read on public.location_neighbors
for select to anon, authenticated using (true);

grant select (kind, parent_id, name, slug, id) on public.locations to anon, authenticated;
grant select (location_id, alias) on public.location_aliases to anon, authenticated;
grant select (
  id, title, description, room_type, rent_amount_pesewas, rent_period,
  area_id, facilities, rules, last_confirmed_at, created_at, status
) on public.listings to anon, authenticated;
grant select (
  id, listing_id, category, storage_path, display_order, approved_for_public
) on public.listing_images to anon, authenticated;
grant select (
  id, listing_fee_pesewas, currency, privacy_policy_version, terms_version
) on public.website_settings to anon, authenticated;
grant select on public.public_listings, public.public_site_settings to anon, authenticated;
grant execute on function public.has_admin_role(public.admin_role[]) to authenticated;
grant execute on function public.transition_listing(uuid, public.listing_status, public.actor_type, uuid, text, text) to authenticated, service_role;
grant execute on function public.finalize_paystack_payment(text, text, integer, text, text, bytea, jsonb) to service_role;
grant execute on function public.consume_rate_limit(text, bytea, integer, integer) to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-pending', 'listing-pending', false, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy listing_pending_images_admin_read on storage.objects
for select to authenticated
using (
  bucket_id = 'listing-pending'
  and public.has_admin_role(array['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT']::public.admin_role[])
);

revoke all on public.public_listings, public.public_site_settings from public;
revoke all on function public.has_admin_role(public.admin_role[]) from public, anon;
revoke all on function public.transition_listing(uuid, public.listing_status, public.actor_type, uuid, text, text) from public, anon;
revoke all on function public.finalize_paystack_payment(text, text, integer, text, text, bytea, jsonb) from public, anon, authenticated;
revoke all on function public.consume_rate_limit(text, bytea, integer, integer) from public, anon, authenticated;
