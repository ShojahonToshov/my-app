import { createClient } from "@/utils/supabase/client";
import { AuthService } from "../AuthService";

export default new AuthService(createClient());
