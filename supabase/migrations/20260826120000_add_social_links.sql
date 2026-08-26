alter table public.businesses add column if not exists social_links jsonb default '[]'::jsonb;

-- Migrate existing instagram data if we wanted to (optional but safe)
update public.businesses set social_links = jsonb_build_array(jsonb_build_object('platform', 'Instagram', 'value', instagram)) where instagram is not null and instagram != '';