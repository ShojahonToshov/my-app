import { Booking, BookingSchema } from "@/types";
import { z } from "zod";
import { apiClient } from "../client";

class BookingService {
  async getBookings() {
    const data = await apiClient.get("/bookings");
    return z.array(BookingSchema).parse(data);
  }

  async getBookingById(id: string) {
    const data = await apiClient.get(`/bookings/${id}`);
    return BookingSchema.parse(data);
  }

  async createBooking(bookingData: Partial<Booking>) {
    return apiClient.post("/bookings", bookingData);
  }

  async updateBookingStatus(id: string, status: Booking["status"]) {
    return apiClient.patch(`/bookings/${id}`, { status });
  }

  async updateBooking(id: string, updateData: Partial<Booking>) {
    return apiClient.patch(`/bookings/${id}`, updateData);
  }

  async deleteBooking(id: string) {
    return apiClient.delete(`/bookings/${id}`);
  }
}

export default new BookingService();
