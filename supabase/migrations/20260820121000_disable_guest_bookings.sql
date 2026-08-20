-- Disable guest bookings by removing the policy
DROP POLICY IF EXISTS "Guests can insert" ON public.bookings;
-- Make client_id required again
ALTER TABLE public.bookings ALTER COLUMN client_id SET NOT NULL;
