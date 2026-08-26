CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER AS $body
DECLARE
  v_business_id uuid;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_business_id := OLD.business_id;
  ELSE
    v_business_id := NEW.business_id;
  END IF;

  UPDATE public.businesses
  SET 
    rating = (
      SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0.0)
      FROM public.bookings
      WHERE business_id = v_business_id AND rating IS NOT NULL
    ),
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

DROP TRIGGER IF EXISTS on_booking_review_updated ON public.bookings;
CREATE TRIGGER on_booking_review_updated
AFTER INSERT OR UPDATE OF rating OR DELETE
ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION update_business_rating();
