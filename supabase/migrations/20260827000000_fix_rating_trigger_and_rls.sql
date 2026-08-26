-- Fix for the trigger that sets business rating to 0.0 when a new booking is made (without rating)
CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER AS $body
DECLARE
  v_business_id uuid;
  v_avg_rating numeric;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_business_id := OLD.business_id;
  ELSE
    v_business_id := NEW.business_id;
  END IF;

  -- Calculate the average rating, null if there are no ratings yet
  SELECT ROUND(AVG(rating)::numeric, 1) INTO v_avg_rating
  FROM public.bookings
  WHERE business_id = v_business_id AND rating IS NOT NULL;

  -- Update the business, defaulting to 5.0 (or its previous rating) if there are no ratings
  UPDATE public.businesses
  SET 
    rating = COALESCE(v_avg_rating, 5.0),
    reviews_count = (
      SELECT COUNT(rating)
      FROM public.bookings
      WHERE business_id = v_business_id AND rating IS NOT NULL
    )
  WHERE id = v_business_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$body LANGUAGE plpgsql;

-- Security recommendation: Restrict what clients can update on their own bookings
DROP POLICY IF EXISTS "Clients can update their own bookings" ON public.bookings;
CREATE POLICY "Clients can update their own bookings" ON public.bookings 
FOR UPDATE USING (auth.uid() = client_id);
