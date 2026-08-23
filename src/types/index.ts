import type { ComponentType } from "react";
import { z } from "zod";

export const BusinessSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
  address: z.string().nullish(),
  phone: z.string().nullish(),
  email: z.string().nullish(),
  avatarUrl: z.string().nullish(),
}).passthrough();
export type Business = z.infer<typeof BusinessSchema>;

export const ServiceSchema = z.object({
  id: z.string(),
  businessId: z.string().nullish(),
  name: z.string(),
  durationMinutes: z.number().nullish(),
  price: z.union([z.number(), z.string()]).nullish(),
  description: z.string().nullish(),
}).passthrough();
export type Service = z.infer<typeof ServiceSchema>;

export const BookingSchema = z.object({
  id: z.string(),
  businessId: z.string().nullish(),
  business_id: z.string().nullish(),
  serviceId: z.string().nullish(),
  service_id: z.string().nullish(),
  serviceName: z.string().nullish(),
  service_name: z.string().nullish(),
  customerId: z.string().nullish(),
  clientId: z.string().nullish(),
  client_id: z.string().nullish(),
  staffId: z.string().nullish(),
  staff_id: z.string().nullish(),
  staffName: z.string().nullish(),
  staff_name: z.string().nullish(),
  startTime: z.string().nullish(),
  endTime: z.string().nullish(),
  time: z.string().nullish(),
  date: z.string().nullish(),
  delayMinutes: z.number().nullish(),
  delay_minutes: z.number().nullish(),
  queueOrder: z.number().nullish(),
  queue_order: z.number().nullish(),
  isGuest: z.boolean().nullish(),
  is_guest: z.boolean().nullish(),
  isGuestCheckout: z.boolean().nullish(),
  guestName: z.string().nullish(),
  guest_name: z.string().nullish(),
  guestPhone: z.string().nullish(),
  guest_phone: z.string().nullish(),
  rating: z.number().nullish(),
  reviewText: z.string().nullish(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed", "in_progress", "done", "waiting", "upcoming"]).catch("pending"),
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

export const StaffSchema = z.object({
  id: z.string(),
  businessId: z.string().nullish(),
  name: z.string(),
  avatarUrl: z.string().nullish(),
  role: z.string().nullish(),
  initials: z.string().nullish(),
  isActive: z.boolean().nullish(),
}).passthrough();
export type Staff = z.infer<typeof StaffSchema>;

export const WorkingHoursSchema = z.object({
  id: z.string().nullish(),
  businessId: z.string().nullish(),
  staffId: z.string().nullish(),
  dayOfWeek: z.number().min(0).max(6).nullish(),
  startTime: z.string(),
  endTime: z.string(),
  isActive: z.boolean().default(true),
}).passthrough();
export type WorkingHours = z.infer<typeof WorkingHoursSchema>;

export interface Customer {
  id: string | number;
  name: string;
  phone: string;
  visits: number;
  lastVisit: string;
  totalSpent?: string;
  status: "active" | "inactive" | "new" | "regular";
  color?: string;
  tag?: string;
}

export interface CustomerData {
  id: string | number;
  name: string;
  phone: string;
  status: string;
  initials?: string;
  avatarColor?: string;
  statusColor?: string;
  visits?: number;
  ltv?: string;
  lastVisit?: string;
}

export interface TicketDTO {
  id: string;
  time: string;
  service: string;
  name: string;
  status: "waiting" | "in_progress" | "completed" | "upcoming";
  staff: string;
  isDelayed?: boolean;
}

export interface ApiBookingDTO {
  id: string;
  userId?: string | null;
  venueId?: string | null;
  venueName?: string | null;
  serviceName?: string | null;
  servicePrice?: string | null;
  staffName?: string | null;
  date?: string | null;
  time?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  status?: string | null;
}

export interface KpiCardProps {
  isLoading?: boolean;
  title: string;
  value: string | number;
  unit?: string;
  trend?: string;
  isUp?: boolean;
  hasTrend?: boolean;
  Icon: ComponentType<{ className?: string }>;
  colorScheme?: string;
  valueColor?: string;
}

export interface AnalyticsInsight {
  type: "positive" | "warning" | "neutral";
  title: string;
  description: string;
  action?: string;
}

export interface AnalyticsChartData {
  time: string;
  value: number;
}

export interface AnalyticsService {
  name: string;
  count: number;
  revenue: string;
}

export interface AnalyticsPeriodData {
  revenue: string;
  revTrend: string;
  revUp: boolean;
  visits: number;
  visitsTrend: string;
  visitsUp: boolean;
  cancels: number;
  cancelsTrend: string;
  wait: string;
  waitTrend: string;
  waitUp: boolean;
  insight: AnalyticsInsight;
  chartData: AnalyticsChartData[];
  services: AnalyticsService[];
}

export type AnalyticsData = Record<string, AnalyticsPeriodData>;

export interface RegisterData {
  name?: string;
  email?: string;
  password?: string;
  [key: string]: unknown;
}

export interface UpdateProfileData {
  [key: string]: unknown;
}

export interface CustomerProfileData {
  name?: string;
  phone?: string;
  [key: string]: unknown;
}

export interface VenueData {
  name?: string;
  address?: string;
  [key: string]: unknown;
}
