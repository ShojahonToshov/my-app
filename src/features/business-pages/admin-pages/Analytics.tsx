"use client";
import React from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Sparkles,
  Coins,
  Scissors,
  BarChart3,
  CalendarX,
  Activity,
  AlertTriangle
} from "lucide-react";

export default function Analytics() {
  const [activeTab, setActiveTab] = React.useState<"today" | "week" | "month">("today");

  // Mock data for different tabs
  const data = {
    today: {
      chart: [
        { time: "10:00", value: 20 },
        { time: "12:00", value: 60 },
        { time: "14:00", value: 90 },
        { time: "16:00", value: 40 },
        { time: "18:00", value: 100 },
        { time: "20:00", value: 30 }
      ],
      services: [
        { name: "Haircut + Beard", count: 8, revenue: "960,000 UZS" },
        { name: "Men's Haircut", count: 4, revenue: "290,000 UZS" }
      ],
      kpi: { revenue: "1,250,000", visits: 12, revTrend: "+5.2%", visitsTrend: "+2" }
    },
    week: {
      chart: [
        { time: "Mon", value: 50 },
        { time: "Tue", value: 70 },
        { time: "Wed", value: 65 },
        { time: "Thu", value: 85 },
        { time: "Fri", value: 95 },
        { time: "Sat", value: 110 },
        { time: "Sun", value: 90 }
      ],
      services: [
        { name: "Haircut + Beard", count: 42, revenue: "5,040,000 UZS" },
        { name: "Men's Haircut", count: 28, revenue: "2,030,000 UZS" },
        { name: "Kid's Haircut", count: 12, revenue: "600,000 UZS" }
      ],
      kpi: { revenue: "8,450,000", visits: 92, revTrend: "+12.5%", visitsTrend: "+14" }
    },
    month: {
      chart: [
        { time: "W1", value: 300 },
        { time: "W2", value: 350 },
        { time: "W3", value: 420 },
        { time: "W4", value: 390 }
      ],
      services: [
        { name: "Haircut + Beard", count: 185, revenue: "22,200,000 UZS" },
        { name: "Men's Haircut", count: 130, revenue: "9,425,000 UZS" },
        { name: "Hair Coloring", count: 24, revenue: "3,600,000 UZS" },
        { name: "Premium Grooming", count: 18, revenue: "3,600,000 UZS" }
      ],
      kpi: { revenue: "38,250,000", visits: 395, revTrend: "+8.4%", visitsTrend: "+25" }
    }
  };

  const currentData = data[activeTab];

  return (
    <div className="flex h-[100dvh] bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* HEADER */}
        <header className="bg-[#ECECEA]/90 backdrop-blur-md border-b border-[#DCDCDA] px-6 md:px-10 py-4 md:py-0 h-auto md:h-20 shrink-0 sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#121415] tracking-tight">Analytics</h1>
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
                onClick={() => setActiveTab(tab.id as any)}
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
              <h3 className="text-sm font-semibold tracking-tight text-[#121415] mb-1">Great start to the day</h3>
              <p className="text-xs font-medium text-[#4a6b53] leading-relaxed">
                Morning occupancy is 15% higher than usual. Primary revenue is driven by combo grooming packages.
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
                  <span className="text-xs font-medium uppercase tracking-wider">Revenue</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#e8efe9] text-[#4a6b53] border border-[#4a6b53]/30">
                  <ArrowUpRight className="w-3 h-3" /> {currentData.kpi.revTrend}
                </span>
              </div>
              <div className="text-3xl font-semibold text-[#121415] tracking-tight truncate">
                {currentData.kpi.revenue} <span className="text-sm font-medium text-[#8B9194]">UZS</span>
              </div>
            </div>

            {/* Visits */}
            <div className="bg-white p-5 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
              <div className="flex items-center justify-between gap-2 text-[#4A4E51] mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" /> 
                  <span className="text-xs font-medium uppercase tracking-wider">Visits</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#e8efe9] text-[#4a6b53] border border-[#4a6b53]/30">
                  <ArrowUpRight className="w-3 h-3" /> {currentData.kpi.visitsTrend}
                </span>
              </div>
              <div className="text-3xl font-semibold text-[#121415] tracking-tight truncate">
                {currentData.kpi.visits}
              </div>
            </div>

            {/* Cancellations */}
            <div className="bg-white p-5 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
              <div className="flex items-center justify-between gap-2 text-[#8A2532] mb-4">
                <div className="flex items-center gap-2">
                  <CalendarX className="w-4 h-4" /> 
                  <span className="text-xs font-medium uppercase tracking-wider">Cancellations</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F5F5F4] text-[#4A4E51] border border-[#DCDCDA]">
                  Normal
                </span>
              </div>
              <div className="text-3xl font-semibold text-[#8A2532] tracking-tight truncate">
                {activeTab === "today" ? "1" : activeTab === "week" ? "4" : "12"}
              </div>
            </div>

            {/* Wait Time */}
            <div className="bg-white p-5 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
              <div className="flex items-center justify-between gap-2 text-[#4A4E51] mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> 
                  <span className="text-xs font-medium uppercase tracking-wider">Queue Wait</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#e8efe9] text-[#4a6b53] border border-[#4a6b53]/30">
                  -1 min
                </span>
              </div>
              <div className="text-3xl font-semibold text-[#121415] tracking-tight truncate">
                {activeTab === "today" ? "2 min" : activeTab === "week" ? "5 min" : "6 min"}
              </div>
            </div>
          </div>

          {/* CHARTS & TOP SERVICES */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch flex-1 min-h-[400px]">
            
            {/* OCCUPANCY CHART */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-[#DCDCDA] shadow-sm p-5 md:p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-[#121415]">
                    Salon Occupancy Rate
                  </h3>
                  <p className="text-sm font-medium text-[#4A4E51] mt-0.5">
                    Helps identify peak hours and schedule additional specialists
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#4A4E51] bg-[#F5F5F4] px-3 py-1.5 rounded-xl border border-[#DCDCDA]">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Traffic Analysis</span>
                </div>
              </div>

              <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 h-52 pt-6 overflow-x-auto scrollbar-hide">
                {currentData.chart.map((col, idx) => {
                  // Normalize height percentage based on max value in current chart data
                  const maxVal = Math.max(...currentData.chart.map(c => c.value));
                  const heightPercent = Math.round((col.value / maxVal) * 100);

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group min-w-[40px]">
                      <div className="w-full bg-[#F5F5F4] rounded-t-xl flex items-end relative group-hover:bg-[#ECECEA] transition-colors border border-transparent group-hover:border-[#DCDCDA]/50">
                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#121415] text-white text-[10px] font-medium py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-sm">
                          {activeTab === "today" ? `Occupancy ${col.value}%` : `${col.value} visits`}
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
                })}
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
                {currentData.services.map((service, idx) => (
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
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}