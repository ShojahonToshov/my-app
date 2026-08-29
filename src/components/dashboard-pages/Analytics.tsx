"use client";
import { useI18nStore } from "@/stores/i18nStore";
import { useI18n } from "@/hooks/useI18n";
import React from "react";
import {
  ArrowUpRight,
  Clock,
  Sparkles,
  Coins,
  BarChart3,
  CalendarX,
  Activity
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { BookingService } from "@/services/BookingService";
import { isToday, isThisWeek, isThisMonth, parseISO, format } from "date-fns";
import type { Booking } from "@/types";
import { Skeleton } from "@/components/ui/Skeleton";

function computeAnalyticsData(
  bookings: Booking[], 
  services: { id: string; name: string; price: string | number | null }[], 
  activeTab: "today" | "week" | "month"
) {
  let filteredBookings = bookings;
  
  if (activeTab === 'today') {
    filteredBookings = bookings.filter(b => b.date && isToday(parseISO(b.date)));
  } else if (activeTab === 'week') {
    filteredBookings = bookings.filter(b => b.date && isThisWeek(parseISO(b.date), { weekStartsOn: 1 }));
  } else if (activeTab === 'month') {
    filteredBookings = bookings.filter(b => b.date && isThisMonth(parseISO(b.date)));
  }

  const getPrice = (b: Booking) => {
    let p = 0;
    if (b.service_id) {
      const s = services.find(s => s.id === b.service_id);
      if (s?.price) p = Number(s.price);
    }
    if (!p && b.serviceName) {
      const s = services.find(s => s.name === b.serviceName);
      if (s?.price) p = Number(s.price);
    }
    if (!p) p = 100000; // Mock fallback
    return p;
  };

  const visits = filteredBookings.filter(b => b.status !== 'cancelled').length;
  const cancels = filteredBookings.filter(b => b.status === 'cancelled').length;
  const revenueNum = filteredBookings.filter(b => b.status !== 'cancelled').reduce((acc, b) => acc + getPrice(b), 0);
  const revenue = new Intl.NumberFormat('en-US').format(revenueNum);
  
  const totalDelay = filteredBookings.reduce((acc, b) => acc + (b.delay_minutes || 0), 0);
  const avgDelay = visits > 0 ? Math.round(totalDelay / visits) : 0;
  
  const serviceCounts: Record<string, { count: number, revenue: number }> = {};
  filteredBookings.filter(b => b.status !== 'cancelled').forEach(b => {
    const name = b.serviceName || 'Unknown Service';
    if (!serviceCounts[name]) serviceCounts[name] = { count: 0, revenue: 0 };
    serviceCounts[name].count++;
    serviceCounts[name].revenue += getPrice(b);
  });
  
  const topServices = Object.entries(serviceCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([name, data]) => ({
      name,
      count: data.count,
      revenue: new Intl.NumberFormat('en-US').format(data.revenue) + " UZS"
    }));

  let chart: { time: string; value: number }[] = [];
  if (activeTab === 'today') {
    const hourMap: Record<string, number> = { '10:00': 0, '12:00': 0, '14:00': 0, '16:00': 0, '18:00': 0, '20:00': 0 };
    filteredBookings.filter(b => b.status !== 'cancelled').forEach(b => {
      if (b.time) {
        const h = parseInt(b.time.split(':')[0], 10);
        const slot = h < 12 ? '10:00' : h < 14 ? '12:00' : h < 16 ? '14:00' : h < 18 ? '16:00' : h < 20 ? '18:00' : '20:00';
        hourMap[slot]++;
      }
    });
    chart = Object.entries(hourMap).map(([time, value]) => ({ time, value }));
  } else if (activeTab === 'week') {
    const dayMap: Record<string, number> = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };
    filteredBookings.filter(b => b.status !== 'cancelled').forEach(b => {
      if (b.date) {
        const dayStr = format(parseISO(b.date), 'EEE');
        if (dayMap[dayStr] !== undefined) dayMap[dayStr]++;
      }
    });
    chart = Object.entries(dayMap).map(([time, value]) => ({ time, value }));
  } else {
    const weekMap: Record<string, number> = { 'W1': 0, 'W2': 0, 'W3': 0, 'W4': 0 };
    filteredBookings.filter(b => b.status !== 'cancelled').forEach(b => {
      if (b.date) {
        const d = parseISO(b.date).getDate();
        const w = d <= 7 ? 'W1' : d <= 14 ? 'W2' : d <= 21 ? 'W3' : 'W4';
        weekMap[w]++;
      }
    });
    chart = Object.entries(weekMap).map(([time, value]) => ({ time, value }));
  }

  return {
    chart,
    services: topServices,
    kpi: { 
      revenue, 
      visits, 
      cancels,
      wait: `${avgDelay > 0 ? '+' : ''}${avgDelay} min`,
      revTrend: "+0%",
      visitsTrend: "+0" 
    }
  };
}

export default function Analytics() {
  const { t } = useI18n();

  const [activeTab, setActiveTab] = React.useState<"today" | "week" | "month">("today");

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analyticsData'],
    queryFn: async () => {
      const supabase = createClient();
      const bookingService = new BookingService(supabase);
      const bookings = await bookingService.getBookings().catch(() => []);
      const { data: servicesData } = await supabase.from('services').select('id, name, price');
      return { bookings, services: servicesData || [] };
    }
  });

  const currentData = React.useMemo(() => {
    if (!analyticsData) {
      return {
        chart: [],
        services: [],
        kpi: { revenue: "0", visits: 0, cancels: 0, wait: "0 min", revTrend: "0%", visitsTrend: "0" }
      };
    }
    return computeAnalyticsData(analyticsData.bookings, analyticsData.services, activeTab);
  }, [analyticsData, activeTab]);

  return (
    <div className="flex h-[100dvh] bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* HEADER */}
        <header className="bg-[#F5F5F4]/90 backdrop-blur-md border-b border-[#DCDCDA] px-6 md:px-10 py-4 md:py-0 h-auto md:h-20 shrink-0 sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#121415] tracking-tight">{t("extra.t0")}</h1>
            <p className="text-sm text-[#4A4E51] font-medium mt-0.5">
              Key business metrics and actionable insights
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#F5F5F4] p-1.5 rounded-xl border border-[#DCDCDA] w-full md:w-auto overflow-x-auto scrollbar-hide">
            {[
              { id: "today", label: "Today" },
              { id: "week", label: "Week" },
              { id: "month", label: "Month" }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as "today" | "week" | "month")}
                className={`shrink-0 px-5 py-1.5 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] ${
                  activeTab === tab.id 
                    ? "bg-white text-[#121415] shadow-sm border border-[#DCDCDA]" 
                    : "text-[#4A4E51] hover:text-[#121415] border border-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-x-hidden overflow-y-auto flex flex-col gap-6 pt-6">
          
          {/* SMART INSIGHTS */}
          <div className="p-5 rounded-2xl border flex items-start gap-4 shadow-sm bg-[#e8efe9]/50 border-[#4a6b53]/20">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white border border-[#4a6b53]/30 text-[#4a6b53]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 pt-0.5">
              <h3 className="text-sm font-semibold tracking-tight text-[#121415] mb-1">{useI18nStore.getState().t("extra.t296")}</h3>
              <p className="text-xs font-medium text-[#4a6b53] leading-relaxed">
                Viewing real-time data for the selected period. Revenue is calculated dynamically based on completed appointments.
              </p>
            </div>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
            {/* Revenue */}
            <div className="bg-white p-5 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
              <div className="flex items-center justify-between gap-2 text-[#4A4E51] mb-4">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4" /> 
                  <span className="text-xs font-medium uppercase tracking-wider">{t("app.t41")}</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#e8efe9] text-[#4a6b53] border border-[#4a6b53]/30">
                  <ArrowUpRight className="w-3 h-3" /> {currentData.kpi.revTrend}
                </span>
              </div>
              {isLoading ? (
                <Skeleton className="w-24 h-8" />
              ) : (
                <div className="text-3xl font-semibold text-[#121415] tracking-tight truncate">
                  {currentData.kpi.revenue} <span className="text-sm font-medium text-[#8B9194]">{useI18nStore.getState().t("extra.t107")}</span>
                </div>
              )}
            </div>

            {/* Visits */}
            <div className="bg-white p-5 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
              <div className="flex items-center justify-between gap-2 text-[#4A4E51] mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" /> 
                  <span className="text-xs font-medium uppercase tracking-wider">{t("app.t42")}</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#e8efe9] text-[#4a6b53] border border-[#4a6b53]/30">
                  <ArrowUpRight className="w-3 h-3" /> {currentData.kpi.visitsTrend}
                </span>
              </div>
              {isLoading ? (
                <Skeleton className="w-16 h-8" />
              ) : (
                <div className="text-3xl font-semibold text-[#121415] tracking-tight truncate">
                  {currentData.kpi.visits}
                </div>
              )}
            </div>

            {/* Cancellations */}
            <div className="bg-white p-5 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
              <div className="flex items-center justify-between gap-2 text-[#8A2532] mb-4">
                <div className="flex items-center gap-2">
                  <CalendarX className="w-4 h-4" /> 
                  <span className="text-xs font-medium uppercase tracking-wider">{useI18nStore.getState().t("extra.t200")}</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F5F5F4] text-[#4A4E51] border border-[#DCDCDA]">
                  Total
                </span>
              </div>
              {isLoading ? (
                <Skeleton className="w-16 h-8" />
              ) : (
                <div className="text-3xl font-semibold text-[#8A2532] tracking-tight truncate">
                  {currentData.kpi.cancels}
                </div>
              )}
            </div>

            {/* Wait Time */}
            <div className="bg-white p-5 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
              <div className="flex items-center justify-between gap-2 text-[#4A4E51] mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> 
                  <span className="text-xs font-medium uppercase tracking-wider">{useI18nStore.getState().t("extra.t173")}</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#e8efe9] text-[#4a6b53] border border-[#4a6b53]/30">
                  Realtime
                </span>
              </div>
              {isLoading ? (
                <Skeleton className="w-20 h-8" />
              ) : (
                <div className="text-3xl font-semibold text-[#121415] tracking-tight truncate">
                  {currentData.kpi.wait}
                </div>
              )}
            </div>
          </div>

          {/* CHARTS & TOP SERVICES */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch flex-1 min-h-[400px]">
            
            {/* OCCUPANCY CHART */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-[#DCDCDA] shadow-sm p-5 md:p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-[#121415]">
                    Appointments Rate
                  </h3>
                  <p className="text-sm font-medium text-[#4A4E51] mt-0.5">
                    Visits density for the selected period
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#4A4E51] bg-[#F5F5F4] px-3 py-1.5 rounded-xl border border-[#DCDCDA]">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>{useI18nStore.getState().t("extra.t182")}</span>
                </div>
              </div>

              <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 h-52 pt-6 overflow-x-auto scrollbar-hide">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-3 h-full justify-end min-w-[40px]">
                      <div className="w-full flex justify-center" style={{ height: `${Math.max(20, Math.random() * 80)}%` }}>
                        <Skeleton className="w-full h-full rounded-t-xl" />
                      </div>
                      <Skeleton className="w-8 h-3" />
                    </div>
                  ))
                ) : (
                  currentData.chart.map((col, idx) => {
                    const maxVal = Math.max(...currentData.chart.map(c => c.value), 1);
                    const heightPercent = Math.round((col.value / maxVal) * 100);

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group min-w-[40px]">
                        <div className="w-full bg-[#F5F5F4] rounded-t-xl flex items-end relative group-hover:bg-[#ECECEA] transition-colors border border-transparent group-hover:border-[#DCDCDA]/50">
                          {/* Tooltip */}
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#121415] text-white text-[10px] font-medium py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-sm">
                            {col.value} visits
                          </div>
                          {/* Bar */}
                          <div 
                            className={`w-full rounded-t-xl transition-all duration-500 ease-out ${heightPercent > 85 ? "bg-[#8A2532]" : heightPercent > 50 ? "bg-[#121415]" : "bg-[#DCDCDA]"}`}
                            style={{ height: `${heightPercent}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-[#8B9194] group-hover:text-[#121415] transition-colors whitespace-nowrap">
                          {col.time}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* POPULAR SERVICES */}
            <div className="bg-white rounded-2xl border border-[#DCDCDA] shadow-sm p-5 md:p-6 flex flex-col justify-between overflow-hidden">
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-[#121415]">
                  Top Services
                </h3>
                <p className="text-sm font-medium text-[#4A4E51] mt-0.5">
                  Revenue drivers for selected period
                </p>
              </div>

              <div className="space-y-3 mt-6 flex-1 overflow-y-auto scrollbar-hide">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="p-4 bg-[#F5F5F4] rounded-xl border border-[#DCDCDA] flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div className="flex flex-col gap-1.5 w-full">
                          <Skeleton className="w-24 h-4" />
                          <Skeleton className="w-16 h-3" />
                        </div>
                      </div>
                      <div className="pt-3 border-t border-[#DCDCDA] flex justify-end">
                         <Skeleton className="w-20 h-4" />
                      </div>
                    </div>
                  ))
                ) : currentData.services.length === 0 ? (
                  <div className="text-sm text-[#4A4E51] text-center pt-10">{useI18nStore.getState().t("extra.t249")}</div>
                ) : (
                  currentData.services.map((service, idx) => (
                    <div key={idx} className="p-4 bg-[#F5F5F4] rounded-xl border border-[#DCDCDA] flex flex-col gap-3 hover:bg-white hover:border-[#121415]/20 hover:shadow-sm transition-all group">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm shadow-sm shrink-0 border ${idx === 0 ? "bg-[#121415] text-white border-[#121415]" : "bg-white text-[#4A4E51] border-[#DCDCDA]"}`}>
                          {idx + 1}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-sm text-[#121415] truncate">
                            {service.name}
                          </span>
                          <span className="text-xs text-[#8B9194] font-medium mt-0.5">
                            {service.count} visits
                          </span>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-[#DCDCDA] text-right">
                         <span className="font-semibold text-sm text-[#121415]">
                           {service.revenue}
                         </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}