import { z } from "zod";

export const BusinessSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  avatarUrl: z.string().optional(),
}).passthrough();
export type Business = z.infer<typeof BusinessSchema>;

export const ServiceSchema = z.object({
  id: z.string(),
  businessId: z.string(),
  name: z.string(),
  durationMinutes: z.number(),
  price: z.number(),
  description: z.string().optional(),
}).passthrough();
export type Service = z.infer<typeof ServiceSchema>;

export const BookingSchema = z.object({
  id: z.string(),
  serviceId: z.string().optional(), // Make some relations optional if mock data is weird
  customerId: z.string().optional(),
  startTime: z.string(),
  endTime: z.string().optional(),
  time: z.string().optional(),
  date: z.string().optional(),
  isGuest: z.boolean().optional(),
  isGuestCheckout: z.boolean().optional(),
  guestName: z.string().optional(),
  guestPhone: z.string().optional(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed", "in_progress", "done"]).catch("pending"), // Caught some weird statuses in useLiveTicket
}).passthrough();
export type Booking = z.infer<typeof BookingSchema>;

export const LiveTicketSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  queuePosition: z.number().catch(0),
  estimatedWaitTime: z.number().catch(0),
  status: z.enum(["waiting", "serving", "done", "no_show"]).catch("waiting"),
}).passthrough();
export type LiveTicket = z.infer<typeof LiveTicketSchema>;

export const MasterSchema = z.object({
  id: z.string(),
  businessId: z.string(),
  name: z.string(),
  avatarUrl: z.string().optional(),
  role: z.string().optional(),
}).passthrough();
export type Master = z.infer<typeof MasterSchema>;

export const WorkingHoursSchema = z.object({
  id: z.string().optional(),
  businessId: z.string().optional(),
  masterId: z.string().optional(),
  dayOfWeek: z.number().min(0).max(6).optional(),
  startTime: z.string(),
  endTime: z.string(),
  isActive: z.boolean().default(true),
}).passthrough();
export type WorkingHours = z.infer<typeof WorkingHoursSchema>;
