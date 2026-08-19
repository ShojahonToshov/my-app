-- Remove the foreign key constraint on service_id in bookings table
alter table public.bookings drop constraint if exists bookings_service_id_fkey;

-- Change the type of service_id from uuid to text
alter table public.bookings alter column service_id type text using service_id::text;
