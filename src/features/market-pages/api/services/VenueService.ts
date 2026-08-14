import { apiClient } from "../client";
import { BusinessSchema } from "@/types";
import { z } from "zod";

class VenueService {
  async getVenues() {
    const data = await apiClient.get("/venues");
    return z.array(BusinessSchema).parse(data);
  }

  async getVenueById(id: string) {
    const data = await apiClient.get(`/venues/${id}`);
    return BusinessSchema.parse(data);
  }

  async createVenue(venueData: unknown) {
    return apiClient.post("/venues", venueData);
  }

  async updateVenue(id: string, updateData: unknown) {
    return apiClient.put(`/venues/${id}`, updateData);
  }
}

export default new VenueService();
