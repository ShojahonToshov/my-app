import type { ComponentType } from "react";
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

export interface Client {
  id: string;
  name: string;
  phone: string;
  visits: number;
  lastVisit: string;
  totalSpent: string;
  status: "active" | "inactive" | "new" | "regular";
  color?: string;
  tag?: string;
}

export interface ClientData {
  id: string;
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
  master: string;
  isDelayed?: boolean;
}

export interface ApiBookingDTO {
  id: string;
  userId?: string;
  venueId?: string;
  venueName?: string;
  serviceName?: string;
  servicePrice?: string;
  masterName?: string;
  date?: string;
  time?: string;
  clientName?: string;
  clientPhone?: string;
  status?: string;
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

export interface CustomerData {
  name?: string;
  phone?: string;
  [key: string]: unknown;
}

export interface VenueData {
  name?: string;
  address?: string;
  [key: string]: unknown;
}
