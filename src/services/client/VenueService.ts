import { createClient } from "@/utils/supabase/client";
import { VenueService } from "../VenueService";

export default new VenueService(createClient());
