-- Allow guest bookings by making client_id optional
ALTER TABLE public.bookings ALTER COLUMN client_id DROP NOT NULL;

-- Add guest info columns if they don't exist
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS guest_name text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS guest_phone text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS is_guest boolean DEFAULT false;

-- Add RLS policy for anonymous guests to insert bookings
-- Note: 'anon' role is used when there is no authenticated user
CREATE POLICY "Guests can insert" ON public.bookings FOR INSERT TO anon WITH CHECK (true);

