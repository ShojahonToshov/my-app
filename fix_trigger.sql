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

  SELECT ROUND(AVG(rating)::numeric, 1) INTO v_avg_rating
  FROM public.bookings
  WHERE business_id = v_business_id AND rating IS NOT NULL;

  UPDATE public.businesses
  SET 
    rating = COALESCE(v_avg_rating, rating),
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
