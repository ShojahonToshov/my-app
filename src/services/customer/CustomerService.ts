import { createClient } from "@/utils/supabase/client";
import { CustomerService } from "../CustomerService";

export default new CustomerService(createClient());
