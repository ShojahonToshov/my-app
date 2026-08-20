create table if not exists public.otp_requests (
  phone text primary key,
  otp_hash text not null,
  data jsonb not null,
  expires_at timestamp with time zone not null,
  attempts integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.otp_requests enable row level security;
