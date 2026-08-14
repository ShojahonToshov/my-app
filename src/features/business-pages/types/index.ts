import type { ComponentType } from "react";
import type { Booking as BaseBooking } from "@/types";

export interface Master {
  id: string;
  name: string;
  specialty?: string;
  initials?: string;
}

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
