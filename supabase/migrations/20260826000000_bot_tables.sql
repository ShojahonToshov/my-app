-- Telegram Bot Tables

-- 1. Create support tickets table
create table if not exists public.support_tickets (
    id uuid default gen_random_uuid() primary key,
    client_id uuid references auth.users(id) on delete cascade not null,
    subject text not null,
    description text not null,
    status text default 'open',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create ticket messages table
create table if not exists public.ticket_messages (
    id uuid default gen_random_uuid() primary key,
    ticket_id uuid references public.support_tickets(id) on delete cascade not null,
    sender_id uuid references auth.users(id) on delete cascade not null,
    message text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable RLS
alter table public.support_tickets enable row level security;
alter table public.ticket_messages enable row level security;

-- 4. RLS Policies
create policy "Clients can view own tickets."
  on public.support_tickets for select
  using (auth.uid() = client_id);

create policy "Clients can insert own tickets."
  on public.support_tickets for insert
  with check (auth.uid() = client_id);

create policy "Clients can view messages of own tickets."
  on public.ticket_messages for select
  using (
    exists (
      select 1 from public.support_tickets
      where id = ticket_id and client_id = auth.uid()
    )
  );

create policy "Clients can insert messages to own tickets."
  on public.ticket_messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.support_tickets
      where id = ticket_id and client_id = auth.uid()
    )
  );

-- Add telegram_id to profiles
alter table public.profiles add column if not exists telegram_id bigint unique;

-- RPC to get user id by phone
create or replace function public.get_user_id_by_phone(p_phone text) returns uuid language sql security definer as $$$ select id from auth.users where phone = p_phone limit 1; $$$;
