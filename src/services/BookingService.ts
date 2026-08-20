import { Booking, BookingSchema } from "@/types";
import { z } from "zod";

export class BookingService {
  constructor(private customer: any) {}

  private get supabase() {
    return this.customer;
  }

  async getBookings() {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*, businesses(owner_id)');
    if (error) throw error;
    return z.array(BookingSchema).parse(data);
  }

  async getBookingById(id: string) {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*, businesses(name)')
      .eq('id', id)
      .single();
    if (error) throw error;

    let serviceName = null;
    if (data.service_id) {
      const { data: serviceData } = await this.supabase
        .from('services')
        .select('name')
        .eq('id', data.service_id)
        .single();
      if (serviceData) {
        serviceName = serviceData.name;
      }
    }

    const resultData = { ...data, services: serviceName ? { name: serviceName } : null };
    return BookingSchema.parse(resultData);
  }

  async createBooking(bookingData: Partial<Booking>) {
    const { data, error } = await this.supabase
      .from('bookings')
      .insert([bookingData]);

    if (error) {
      console.error("Supabase insert error:", error);
      throw new Error(error.message || "Failed to create booking in database");
    }
    return data;
  }

  async updateBookingStatus(id: string, status: Booking["status"]) {
    const { data, error } = await this.supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateBooking(id: string, updateData: Partial<Booking>) {
    const { data, error } = await this.supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteBooking(id: string) {
    const { data, error } = await this.supabase
      .from('bookings')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
