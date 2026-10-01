insert into public.locations (kind, name, slug)
values
  ('REGION', 'Greater Accra', 'greater-accra'),
  ('REGION', 'Ashanti', 'ashanti'),
  ('REGION', 'Eastern', 'eastern')
on conflict do nothing;

insert into public.locations (kind, parent_id, name, slug)
select 'TOWN', region.id, town.name, town.slug
from (values
  ('Greater Accra', 'Accra', 'accra'),
  ('Greater Accra', 'Tema', 'tema'),
  ('Ashanti', 'Kumasi', 'kumasi'),
  ('Ashanti', 'Tafo', 'tafo'),
  ('Eastern', 'Koforidua', 'koforidua'),
  ('Eastern', 'Akim Tafo', 'akim-tafo')
) as town(region_name, name, slug)
join public.locations region on region.kind = 'REGION' and lower(region.name) = lower(town.region_name)
on conflict do nothing;

insert into public.locations (kind, parent_id, name, slug)
select 'AREA', town.id, area.name, area.slug
from (values
  ('Tema', 'Adjei Kojo', 'adjei-kojo'),
  ('Tema', 'Community 18', 'community-18'),
  ('Tema', 'Community 20', 'community-20'),
  ('Tema', 'Community 25', 'community-25'),
  ('Accra', 'Madina', 'madina'),
  ('Accra', 'Kwabenya', 'kwabenya'),
  ('Kumasi', 'Ayeduase', 'ayeduase'),
  ('Kumasi', 'Bomso', 'bomso')
) as area(town_name, name, slug)
join public.locations town on town.kind = 'TOWN' and lower(town.name) = lower(area.town_name)
on conflict do nothing;
