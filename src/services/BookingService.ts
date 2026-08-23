import { Booking, BookingSchema } from "@/types";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

interface DbBookingRecord {
  id: string;
  business_id?: string | null;
  service_id?: string | null;
  service_name?: string | null;
  serviceName?: string | null;
  client_id?: string | null;
  staff_id?: string | null;
  staffId?: string | null;
  staff_name?: string | null;
  staffName?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  time?: string | null;
  date?: string | null;
  delay_minutes?: number | null;
  delayMinutes?: number | null;
  queue_order?: number | null;
  queueOrder?: number | null;
  is_guest?: boolean | null;
  isGuest?: boolean | null;
  guest_name?: string | null;
  guestName?: string | null;
  customerName?: string | null;
  guest_phone?: string | null;
  rating?: number | null;
  reviewText?: string | null;
  status?: Booking["status"];
  [key: string]: unknown;
}

export class BookingService {
  constructor(private customer: SupabaseClient | any) {}

  private get supabase(): SupabaseClient {
    return this.customer as SupabaseClient;
  }

  async getBookings(businessId?: string): Promise<Booking[]> {
    let query = this.supabase
      .from('bookings')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (businessId) {
      query = query.eq('business_id', businessId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const rawList = (data || []) as DbBookingRecord[];

    const mapped = rawList.map((b: DbBookingRecord) => {
      let guestNameRaw = b.guest_name || b.customerName || "Guest";
      let legacyStaffId = "";
      if (typeof guestNameRaw === 'string' && guestNameRaw.includes("|||")) {
        const parts = guestNameRaw.split("|||");
        guestNameRaw = parts[0];
        legacyStaffId = parts[1];
      }

      return {
        ...b,
        guest_name: guestNameRaw,
        guestName: guestNameRaw,
        staff_id: b.staff_id || legacyStaffId || null,
        staffId: b.staff_id || legacyStaffId || null,
        staff_name: b.staff_name || b.staffName || null,
        staffName: b.staff_name || b.staffName || null,
        service_name: b.service_name || b.serviceName || null,
        serviceName: b.service_name || b.serviceName || null,
        delay_minutes: b.delay_minutes ?? 0,
        delayMinutes: b.delay_minutes ?? 0,
        queue_order: b.queue_order ?? 0,
        queueOrder: b.queue_order ?? 0,
      };
    });

    return z.array(BookingSchema).parse(mapped);
  }

  async getBookingById(id: string): Promise<Booking> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*, businesses(name, team_data)')
      .eq('id', id)
      .single();
    if (error) throw error;

    const row = data as DbBookingRecord & { businesses?: { name?: string; team_data?: { id: string; name: string }[] } };

    let serviceName = row.service_name || null;
    if (!serviceName && row.service_id) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(row.service_id);
      if (isUuid) {
        const { data: serviceData } = await this.supabase
          .from('services')
          .select('name')
          .eq('id', row.service_id)
          .maybeSingle();
        if (serviceData) {
          serviceName = (serviceData as { name: string }).name;
        }
      } else {
        serviceName = row.service_id;
      }
    }

    let staffName = row.staff_name || row.staffName || null;
    let actualStaffId = row.staff_id || null;
    let guestNameClean = row.guest_name || row.customerName || "Guest";

    if (typeof guestNameClean === 'string' && guestNameClean.includes("|||")) {
      const parts = guestNameClean.split("|||");
      guestNameClean = parts[0];
      if (!actualStaffId) actualStaffId = parts[1];
    }

    if (!staffName && actualStaffId && row.businesses?.team_data) {
      const staff = row.businesses.team_data.find((t: { id: string; name: string }) => String(t.id) === String(actualStaffId));
      if (staff) staffName = staff.name;
    }

    const resultData = {
      ...row,
      guest_name: guestNameClean,
      guestName: guestNameClean,
      staff_id: actualStaffId,
      staffId: actualStaffId,
      staff_name: staffName || "Any available",
      staffName: staffName || "Any available",
      service_name: serviceName || "Service",
      services: serviceName ? { name: serviceName } : null,
      delay_minutes: row.delay_minutes ?? 0,
      delayMinutes: row.delay_minutes ?? 0,
    };

    return BookingSchema.parse(resultData);
  }

  async createBooking(bookingData: Partial<Booking>) {
    const { data, error } = await this.supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();

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

  async updateBookingDelay(id: string, delayMinutes: number) {
    const { data, error } = await this.supabase
      .from('bookings')
      .update({ delay_minutes: delayMinutes })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async completeAndCallNext(currentBookingId: string, nextBookingId?: string) {
    // 1. Complete current
    const { error: completeErr } = await this.supabase
      .from('bookings')
      .update({ status: 'completed' })
      .eq('id', currentBookingId);
    if (completeErr) throw completeErr;

    // 2. Call next if provided
    if (nextBookingId) {
      const { error: nextErr } = await this.supabase
        .from('bookings')
        .update({ status: 'in_progress', delay_minutes: 0 })
        .eq('id', nextBookingId);
      if (nextErr) throw nextErr;
    }
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
