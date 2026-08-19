import { createClient } from "@/utils/supabase/client";
import { BookingService } from "../BookingService";

export default new BookingService(createClient());
