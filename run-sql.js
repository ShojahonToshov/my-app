const { Client } = require('pg');

const run = async () => {
  // Let's try the direct connection URI pattern:
  // postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
  const connectionString = 'postgresql://postgres.hhlbquuxnesiuwknscyq:QQdLzR5Ldv0z6kL0@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';
  
  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();
    console.log("Connected successfully!");

    const sql = `
-- 1. Таблица заведений (businesses)
create table if not exists public.businesses (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  category text,
  address text,
  rating numeric(3,1) default 0.0,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Таблица услуг (services)
create table if not exists public.services (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references public.businesses(id) on delete cascade not null,
  name text not null,
  price numeric(10,2),
  duration_minutes int default 60,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Таблица записей (bookings)
create table if not exists public.bookings (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references auth.users(id) on delete cascade not null,
  business_id uuid references public.businesses(id) on delete cascade not null,
  service_id uuid references public.services(id) on delete cascade not null,
  date text not null,
  time text not null,
  status text default 'pending',
  rating integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Безопасность (RLS)
alter table public.businesses enable row level security;
alter table public.services enable row level security;
alter table public.bookings enable row level security;

-- Drop policies if they exist, to avoid errors
drop policy if exists "Businesses are viewable by everyone." on businesses;
drop policy if exists "Services are viewable by everyone." on services;
drop policy if exists "Clients can view own bookings." on bookings;

-- Бизнесы могут видеть все
create policy "Businesses are viewable by everyone." on businesses for select using (true);
create policy "Services are viewable by everyone." on services for select using (true);

-- Клиенты могут видеть только свои записи
create policy "Clients can view own bookings." on bookings for select using (auth.uid() = client_id);
    `;

    await client.query(sql);
    console.log("SQL executed successfully!");

  } catch (err) {
    console.error("Connection failed:", err.message);
  } finally {
    await client.end();
  }
};

run();
