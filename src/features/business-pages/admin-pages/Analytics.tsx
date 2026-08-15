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
  // Статические мок-данные для визуализации (выбрана вкладка "Сегодня")
  const chartData = [
    { time: "10:00", value: 20 },
    { time: "12:00", value: 60 },
    { time: "14:00", value: 90 },
    { time: "16:00", value: 40 },
    { time: "18:00", value: 100 },
    { time: "20:00", value: 30 }
  ];

  const topServices = [
    { name: "Стрижка + Борода", count: 8, revenue: "960 000 сум" },
    { name: "Мужская стрижка", count: 4, revenue: "290 000 сум" }
  ];

  return (
    <div className="flex h-[100dvh] bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* HEADER */}
        <header className="bg-[#ECECEA]/90 backdrop-blur-md border-b border-[#DCDCDA] px-6 md:px-10 py-4 md:py-0 h-auto md:h-20 shrink-0 sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#121415] tracking-tight">Аналитика</h1>
            <p className="text-sm text-[#4A4E51] font-medium mt-0.5">
              Ключевые показатели и инсайты бизнеса
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#F5F5F4] p-1.5 rounded-xl border border-[#DCDCDA] w-full md:w-auto overflow-x-auto scrollbar-hide">
            <button
              type="button"
              className="shrink-0 px-5 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm border bg-white text-[#121415] border-[#DCDCDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
            >
              Сегодня
            </button>
            <button
              type="button"
              className="shrink-0 px-5 py-1.5 rounded-lg text-sm font-medium transition-all text-[#4A4E51] hover:text-[#121415] border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
            >
              Неделя
            </button>
            <button
              type="button"
              className="shrink-0 px-5 py-1.5 rounded-lg text-sm font-medium transition-all text-[#4A4E51] hover:text-[#121415] border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
            >
              Месяц
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-x-hidden overflow-y-auto flex flex-col gap-6 pt-6">
          
          {/* УМНЫЙ ИНСАЙТ (Smart Insights) */}
          <div className="p-5 rounded-2xl border flex items-start gap-4 shadow-sm bg-[#e8efe9]/50 border-[#4a6b53]/20">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white border border-[#4a6b53]/30 text-[#4a6b53]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 pt-0.5">
              <h3 className="text-sm font-semibold tracking-tight text-[#121415] mb-1">Отличное начало дня</h3>
              <p className="text-xs font-medium text-[#4a6b53] leading-relaxed">
                Утренняя загрузка выше обычного на 15%. Основную выручку приносят комплексные услуги.
              </p>
            </div>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
            {/* Выручка */}
            <div className="bg-white p-5 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
              <div className="flex items-center justify-between gap-2 text-[#4A4E51] mb-4">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4" /> 
                  <span className="text-xs font-medium uppercase tracking-wider">Выручка</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#e8efe9] text-[#4a6b53] border border-[#4a6b53]/30">
                  <ArrowUpRight className="w-3 h-3" /> +5.2%
                </span>
              </div>
              <div className="text-3xl font-semibold text-[#121415] tracking-tight truncate">
                1 250 000 <span className="text-sm font-medium text-[#8B9194]">сум</span>
              </div>
            </div>

            {/* Визиты */}
            <div className="bg-white p-5 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
              <div className="flex items-center justify-between gap-2 text-[#4A4E51] mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" /> 
                  <span className="text-xs font-medium uppercase tracking-wider">Визиты</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#e8efe9] text-[#4a6b53] border border-[#4a6b53]/30">
                  <ArrowUpRight className="w-3 h-3" /> +2
                </span>
              </div>
              <div className="text-3xl font-semibold text-[#121415] tracking-tight truncate">
                12
              </div>
            </div>

            {/* Отмены */}
            <div className="bg-white p-5 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
              <div className="flex items-center justify-between gap-2 text-[#8A2532] mb-4">
                <div className="flex items-center gap-2">
                  <CalendarX className="w-4 h-4" /> 
                  <span className="text-xs font-medium uppercase tracking-wider">Отмены</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F5F5F4] text-[#4A4E51] border border-[#DCDCDA]">
                  Норма
                </span>
              </div>
              <div className="text-3xl font-semibold text-[#8A2532] tracking-tight truncate">
                1
              </div>
            </div>

            {/* Время ожидания */}
            <div className="bg-white p-5 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
              <div className="flex items-center justify-between gap-2 text-[#4A4E51] mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> 
                  <span className="text-xs font-medium uppercase tracking-wider">В очереди</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#e8efe9] text-[#4a6b53] border border-[#4a6b53]/30">
                  -1 мин
                </span>
              </div>
              <div className="text-3xl font-semibold text-[#121415] tracking-tight truncate">
                2 мин
              </div>
            </div>
          </div>

          {/* ГРАФИКИ И УСЛУГИ */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch flex-1 min-h-[400px]">
            
            {/* ГРАФИК ЗАГРУЗКИ */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-[#DCDCDA] shadow-sm p-5 md:p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-[#121415]">
                    Загруженность зала
                  </h3>
                  <p className="text-sm font-medium text-[#4A4E51] mt-0.5">
                    Помогает определить время для вывода дополнительных мастеров
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#4A4E51] bg-[#F5F5F4] px-3 py-1.5 rounded-xl border border-[#DCDCDA]">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Анализ трафика</span>
                </div>
              </div>

              <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 h-52 pt-6 overflow-x-auto scrollbar-hide">
                {chartData.map((col, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group min-w-[40px]">
                    <div className="w-full bg-[#F5F5F4] rounded-t-xl flex items-end relative group-hover:bg-[#ECECEA] transition-colors border border-transparent group-hover:border-[#DCDCDA]/50">
                      {/* Tooltip */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#121415] text-white text-[10px] font-medium py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-sm">
                        Загрузка {col.value}%
                      </div>
                      {/* Bar */}
                      <div 
                        className={`w-full rounded-t-xl transition-all duration-1000 ease-out ${col.value > 85 ? "bg-[#8A2532]" : col.value > 50 ? "bg-[#121415]" : "bg-[#DCDCDA]"}`}
                        style={{ height: `${col.value}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-[#8B9194] group-hover:text-[#121415] transition-colors whitespace-nowrap">
                      {col.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ПОПУЛЯРНЫЕ УСЛУГИ */}
            <div className="bg-white rounded-2xl border border-[#DCDCDA] shadow-sm p-5 md:p-6 flex flex-col justify-between overflow-hidden">
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-[#121415]">
                  Топ услуг
                </h3>
                <p className="text-sm font-medium text-[#4A4E51] mt-0.5">
                  Генераторы выручки за выбранный период
                </p>
              </div>

              <div className="space-y-3 mt-6 flex-1 overflow-y-auto scrollbar-hide">
                {topServices.map((service, idx) => (
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
                          {service.count} визитов
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