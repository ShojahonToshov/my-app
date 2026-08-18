import { createClient } from "@/utils/supabase/client";
import { BusinessSchema } from "@/types";
import { z } from "zod";
import type { VenueData } from "@/types";

class VenueService {
  private get supabase() {
    return createClient();
  }

  async getVenues() {
    const { data, error } = await this.supabase
      .from('businesses')
      .select('*');
    if (error) throw error;
    return z.array(BusinessSchema).parse(data);
  }

  async getVenueById(id: string) {
    const { data, error } = await this.supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return BusinessSchema.parse(data);
  }

  async createVenue(venueData: VenueData) {
    const { data, error } = await this.supabase
      .from('businesses')
      .insert([venueData])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateVenue(id: string, updateData: Partial<VenueData>) {
    const { data, error } = await this.supabase
      .from('businesses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

export default new VenueService();
