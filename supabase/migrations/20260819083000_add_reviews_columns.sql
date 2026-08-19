alter table public.businesses add column if not exists rating numeric(3, 1) default 5.0, add column if not exists reviews_count integer default 0;
