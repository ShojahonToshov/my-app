-- 1. Update the default value for the rating column
ALTER TABLE public.businesses ALTER COLUMN rating SET DEFAULT 0.0;

-- 2. Update existing businesses that have no reviews to have 0.0 rating instead of 5.0
UPDATE public.businesses 
SET rating = 0.0 
WHERE reviews_count = 0;

-- 3. Update the trigger to default to 0.0 when there are no reviews and run as SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER
SECURITY DEFINER
AS $body
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

  -- Update the business, defaulting to 0.0 if there are no ratings
  UPDATE public.businesses
  SET 
    rating = COALESCE(v_avg_rating, 0.0),
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

-- 4. Recalculate existing businesses just to fix any inconsistent state
UPDATE public.businesses b
SET 
  rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM public.bookings WHERE business_id = b.id AND rating IS NOT NULL), 0.0),
  reviews_count = (SELECT COUNT(rating) FROM public.bookings WHERE business_id = b.id AND rating IS NOT NULL);

