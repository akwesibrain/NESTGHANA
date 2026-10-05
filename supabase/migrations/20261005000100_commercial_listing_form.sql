alter table public.listings
  add column property_category text not null default 'ROOM'
    check (property_category in ('ROOM', 'COMMERCIAL')),
  add column commercial_details jsonb not null default '{}'::jsonb
    check (jsonb_typeof(commercial_details) = 'object'),
  add column advance_amount_pesewas integer
    check (advance_amount_pesewas is null or advance_amount_pesewas >= 0);

alter table public.listings
  drop constraint if exists listings_room_type_check,
  add constraint listings_room_type_check check (
    room_type in (
      'Single Room', 'Chamber & Hall', 'Self-Contained', '1-in-a-Room',
      '2-in-a-Room', '4-in-a-Room', 'Student Hostel', 'Shop', 'Store',
      'Office', 'Showroom', 'Warehouse', 'Salon', 'Restaurant',
      'Commercial Space', 'Other'
    )
  ),
  drop constraint if exists listings_furnished_check,
  add constraint listings_furnished_check check (
    furnished in ('Furnished', 'Unfurnished', 'Not Applicable')
  ),
  alter column bedrooms drop not null,
  drop constraint if exists listings_bedrooms_check,
  add constraint listings_bedrooms_check check (
    (property_category = 'ROOM' and bedrooms between 0 and 100)
    or (property_category = 'COMMERCIAL' and bedrooms is null)
  ),
  add constraint listings_property_category_fields_check check (
    (property_category = 'ROOM' and commercial_details = '{}'::jsonb and advance_amount_pesewas is null)
    or (
      property_category = 'COMMERCIAL'
      and advance_amount_pesewas is not null
      and commercial_details ?& array[
        'size', 'roadVisibility', 'parking', 'electricity', 'water',
        'estimatedMoveInCost'
      ]
    )
  );

alter table public.listing_images
  drop constraint if exists listing_images_category_check,
  add constraint listing_images_category_check check (
    category in (
      'Exterior', 'Bedroom', 'Bathroom', 'Kitchen', 'Compound or common area',
      'Interior', 'Frontage', 'Facilities', 'Surrounding area', 'Extra', 'Profile'
    )
  );

create or replace function public.owner_has_live_contact_consent(p_owner_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.listings l
    join public.consents c on c.listing_id = l.id
    where l.owner_id = p_owner_id
      and l.status = 'LIVE'
      and c.checkbox_values->>'profile_and_contact_display_consent' = 'true'
  );
$$;
revoke all on function public.owner_has_live_contact_consent(uuid) from public;
grant execute on function public.owner_has_live_contact_consent(uuid) to anon, authenticated;

create policy owners_public_live_contact_read on public.owners
for select to anon, authenticated
using (public.owner_has_live_contact_consent(id));
grant select (id, full_name, phone_e164, whatsapp_e164, relationship)
  on public.owners to anon, authenticated;

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
    filter (where li.id is not null and li.category <> 'Profile'), '{}') as photo_paths,
  l.property_category as category,
  case
    when l.property_category = 'COMMERCIAL' then jsonb_build_object(
      'category', 'commercial',
      'type', coalesce(l.commercial_details->>'type', l.room_type),
      'typeOther', l.commercial_details->>'typeOther',
      'title', l.title,
      'description', l.description,
      'region', region.name,
      'town', town.name,
      'area', area.name,
      'location', town.name || ', ' || area.name,
      'rent', l.rent_amount_pesewas::numeric / 100,
      'advance', l.advance_amount_pesewas::numeric / 100,
      'size', (l.commercial_details->>'size')::numeric,
      'sizeUnit', 'm²',
      'roadVisibility', (l.commercial_details->>'roadVisibility')::boolean,
      'parking', (l.commercial_details->>'parking')::boolean,
      'electricity', (l.commercial_details->>'electricity')::boolean,
      'water', (l.commercial_details->>'water')::boolean,
      'estimatedMoveInCost', (l.commercial_details->>'estimatedMoveInCost')::numeric / 100,
      'availability', l.availability_date::text,
      'images', '[]'::jsonb,
      'phone', owner.phone_e164,
      'whatsapp', owner.whatsapp_e164
    )
    else jsonb_build_object(
      'category', 'room',
      'title', l.title,
      'description', l.description,
      'type', l.room_type,
      'town', town.name,
      'region', region.name,
      'area', area.name,
      'rent', l.rent_amount_pesewas::numeric / 100,
      'period', case l.rent_period
        when 'MONTH' then 'Monthly'
        when 'THREE_MONTHS' then '3 Months'
        when 'SIX_MONTHS' then '6 Months'
        when 'YEAR' then 'Yearly'
        when 'SEMESTER' then 'Semester'
        when 'OTHER' then coalesce(l.rent_period_other, 'Other')
      end,
      'adv', l.advance_payments,
      'dep', l.deposit_pesewas::numeric / 100,
      'fee', l.agency_fee_pesewas::numeric / 100,
      'oth', l.other_charges_pesewas::numeric / 100,
      'm', coalesce(l.facilities->'selections', '{}'::jsonb),
      'facOther', l.facilities->>'other',
      'beds', l.bedrooms,
      'avail', case when l.availability_date <= current_date
        then 'Yes, available now'
        else 'No, available from a later date'
      end,
      'from', l.availability_date::text,
      'confirmed_at', l.last_confirmed_at,
      'photos', '[]'::jsonb,
      'verified', false,
      'phone', owner.phone_e164,
      'wa', owner.whatsapp_e164,
      'role', owner.relationship
    )
  end as public_data
from public.listings l
join public.locations area on area.id = l.area_id and area.kind = 'AREA'
join public.locations town on town.id = area.parent_id and town.kind = 'TOWN'
join public.locations region on region.id = town.parent_id and region.kind = 'REGION'
join public.owners owner on owner.id = l.owner_id
left join public.listing_images li on li.listing_id = l.id and li.approved_for_public
where l.status = 'LIVE'
group by l.id, area.name, town.name;

grant select (
  owner_id, property_category, commercial_details, advance_amount_pesewas,
  availability_date, bedrooms, advance_payments, deposit_pesewas,
  agency_fee_pesewas, other_charges_pesewas, rent_period_other
)
  on public.listings to anon, authenticated;
