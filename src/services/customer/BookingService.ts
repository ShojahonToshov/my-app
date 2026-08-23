import { createClient } from "@/utils/supabase/client";
import { BookingService } from "../BookingService";

const customerBookingService = new BookingService(createClient());
export default customerBookingService;
