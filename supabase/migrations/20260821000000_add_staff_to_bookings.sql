ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS staff_id text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS staff_name text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS service_name text;
