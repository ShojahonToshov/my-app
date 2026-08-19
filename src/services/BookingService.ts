import { Booking, BookingSchema } from "@/types";
import { z } from "zod";

export class BookingService {
  constructor(private client: any) {}

  private get supabase() {
    return this.client;
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
      .select('*, businesses(name), services(name)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return BookingSchema.parse(data);
  }

  async createBooking(bookingData: Partial<Booking>) {
    const { data, error } = await this.supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116' && !bookingData.client_id) {
        return null;
      }
      throw error;
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
