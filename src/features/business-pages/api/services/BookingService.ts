import { Booking, BookingSchema } from "@/types";
import { z } from "zod";
import { createClient } from "@/utils/supabase/client";

class BookingService {
  private getClient(client?: any) {
    return client || createClient();
  }
  
  private get supabase() {
    return this.getClient();
  }

  async getBookings(client?: any) {
    const { data, error } = await this.getClient(client)
      .from('bookings')
      .select('*');
    if (error) throw error;
    return z.array(BookingSchema).parse(data);
  }

  async getBookingById(id: string) {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*')
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
      .single();
    if (error) throw error;
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

export default new BookingService();
