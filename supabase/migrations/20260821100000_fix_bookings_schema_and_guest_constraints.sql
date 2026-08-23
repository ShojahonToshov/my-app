-- Allow guest/walk-in bookings by making client_id optional
ALTER TABLE public.bookings ALTER COLUMN client_id DROP NOT NULL;

-- Add staff, service and queue management columns if they don't exist
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS staff_id text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS staff_name text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS service_name text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS delay_minutes integer DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS queue_order integer DEFAULT 0;

-- Ensure business owners can insert bookings (e.g. walk-in guests) for their businesses
DROP POLICY IF EXISTS "Owners can insert bookings for their businesses" ON public.bookings;
CREATE POLICY "Owners can insert bookings for their businesses" ON public.bookings
  FOR INSERT WITH CHECK (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
  );

-- Update client view policy to only show authenticated client bookings (not walk-in guests)
DROP POLICY IF EXISTS "Clients can view own bookings." ON public.bookings;
CREATE POLICY "Clients can view own bookings." ON public.bookings
  FOR SELECT USING (
    auth.uid() = client_id AND (is_guest IS FALSE OR is_guest IS NULL)
  );
