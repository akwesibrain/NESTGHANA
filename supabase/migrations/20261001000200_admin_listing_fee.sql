create or replace function public.update_listing_fee(
  p_listing_fee_pesewas integer,
  p_reason text
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  admin_id uuid := (select auth.uid());
  updated_fee integer;
begin
  if admin_id is null
    or coalesce((select auth.jwt() ->> 'aal'), '') <> 'aal2'
    or not public.has_admin_role(array['SUPER_ADMIN', 'ADMIN']::public.admin_role[])
  then
    raise exception using errcode = '42501', message = 'MFA-protected administrator access required';
  end if;

  if p_listing_fee_pesewas is null or p_listing_fee_pesewas <= 0 then
    raise exception using errcode = '22023', message = 'Listing fee must be a positive amount';
  end if;
  if char_length(trim(coalesce(p_reason, ''))) not between 3 and 1000 then
    raise exception using errcode = '22023', message = 'A reason between 3 and 1000 characters is required';
  end if;

  update public.website_settings
  set listing_fee_pesewas = p_listing_fee_pesewas,
      updated_by = admin_id
  where id = 1
  returning listing_fee_pesewas into updated_fee;

  if not found then
    raise exception 'Website settings row is missing';
  end if;

  insert into public.website_settings_history (
    setting_id,
    listing_fee_pesewas,
    currency,
    confirmation_days,
    changed_by,
    reason
  )
  select id, listing_fee_pesewas, currency, confirmation_days, admin_id, trim(p_reason)
  from public.website_settings
  where id = 1;

  return updated_fee;
end;
$$;

revoke all on function public.update_listing_fee(integer, text) from public, anon;
grant execute on function public.update_listing_fee(integer, text) to authenticated;
