import { createClient } from '@/utils/supabase/client';

class BookingService {
  private get supabase() {
    return createClient();
  }

  // Fetch upcoming bookings for user
  async getUpcomingBookings(userId: string) {
    const { data, error } = await this.supabase
      .from('bookings')
      .select(`
        id,
        date,
        time,
        status,
        services ( name ),
        businesses ( name, address )
      `)
      .eq('client_id', userId)
      .in('status', ['pending', 'confirmed'])
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      console.error("Error fetching upcoming bookings:", error);
      return [];
    }
    return data;
  }

  // Fetch booking history (completed or cancelled)
  async getHistoryBookings(userId: string) {
    const { data, error } = await this.supabase
      .from('bookings')
      .select(`
        id,
        date,
        time,
        status,
        rating,
        services ( name ),
        businesses ( name )
      `)
      .eq('client_id', userId)
      .in('status', ['completed', 'cancelled'])
      .order('date', { ascending: false });

    if (error) {
      console.error("Error fetching history bookings:", error);
      return [];
    }
    return data;
  }

  // Fetch favorite venues
  async getFavoriteVenues(userId: string) {
    // Stub for favorites table
    return [];
  }

  async getBookings() { return []; }
  async getBookingById(id: string): Promise<unknown> { return {}; }
  async createBooking(data: Record<string, unknown>) {
    const { data: result, error } = await this.supabase
      .from('bookings')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
    return result;
  }
  async updateBooking(id: string, data: Record<string, unknown>) { return { data }; }
  async deleteBooking(id: string) { return true; }

  async getBusinesses() {
    const { data, error } = await this.supabase
      .from('businesses')
      .select('*');
    if (error) {
      console.error("Error fetching businesses:", error.message, error.details, error.hint, error.code);
      return [];
    }
    return data;
  }
}
export default new BookingService();


