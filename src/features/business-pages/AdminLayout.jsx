"use client";
import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Clock,
  Calendar,
  Users,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import ElaraLogo from "@/components/ElaraLogo";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-[100dvh] bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white overflow-hidden">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-[260px] bg-[#F5F5F4] border-r border-[#DCDCDA] flex-col shrink-0 z-40 relative">
        <div className="h-20 flex items-center px-8 border-b border-[#DCDCDA] shrink-0">
          <ElaraLogo />
        </div>

        <nav className="flex-1 p-5 space-y-2 overflow-y-auto scrollbar-hide">
          <Link
            href="/admin"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent"
          >
            <LayoutDashboard className="w-5 h-5" />
            Очередь (Live)
          </Link>
          <Link
            href="/admin/schedule"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent"
          >
            <Calendar className="w-5 h-5" />
            Расписание
          </Link>
          <Link
            href="/admin/customers"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent"
          >
            <Users className="w-5 h-5" />
            Клиенты
          </Link>
          <Link
            href="/admin/analytics"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent"
          >
            <BarChart3 className="w-5 h-5" />
            Аналитика
          </Link>
          <Link
            href="/admin/billing"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent"
          >
            <CreditCard className="w-5 h-5" />
            Биллинг
          </Link>
          <Link
            href="/admin/settings"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent"
          >
            <Settings className="w-5 h-5" />
            Настройки
          </Link>
        </nav>

        {/* BOTTOM USER & NOTIFICATIONS SECTION */}
        <div className="p-4 border-t border-[#DCDCDA] flex flex-col gap-2 shrink-0 bg-[#F5F5F4] relative">
          
          <div className="relative">
            <button
              type="button"
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] border border-transparent text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA]"
            >
              <div className="flex items-center gap-3 font-medium text-sm">
                <div className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#8A2532] rounded-full border border-[#F5F5F4]"></span>
                </div>
                Уведомления
              </div>
              <span className="bg-[#8A2532] text-white text-xs font-medium px-2 py-0.5 rounded-md">
                2
              </span>
            </button>

            {/* Выпадающее окно уведомлений (скрыто по умолчанию классом hidden) */}
            <div className="hidden absolute bottom-full left-0 mb-3 w-[340px] bg-white rounded-2xl shadow-lg border border-[#DCDCDA] overflow-hidden animate-in fade-in slide-in-from-bottom-2 z-50">
              <div className="flex items-center justify-between p-5 border-b border-[#DCDCDA] bg-white">
                <span className="font-medium text-[#121415] text-base tracking-tight">Уведомления</span>
                <button type="button" className="text-xs font-medium text-[#4A4E51] hover:text-[#121415] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded">
                  Прочитать все
                </button>
              </div>
              <div className="max-h-[340px] overflow-y-auto">
                <button type="button" className="w-full text-left p-4 border-b border-[#DCDCDA] hover:bg-[#F5F5F4] transition-colors flex items-center justify-between group outline-none focus-visible:bg-[#F5F5F4] bg-white">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-[#F5F5F4] border-[#DCDCDA]">
                      <CheckCircle2 className="w-4 h-4 text-[#4A6B53]" />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-sm truncate font-medium text-[#121415]">Новая онлайн-запись</p>
                      <p className="text-xs text-[#4A4E51] mt-0.5 leading-relaxed break-words line-clamp-2">Азамат записался на Стрижку (14:30)</p>
                      <p className="text-xs font-medium text-[#8B9194] mt-2">5 мин назад</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#DCDCDA] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0" />
                </button>
                <button type="button" className="w-full text-left p-4 border-b border-[#DCDCDA] hover:bg-[#F5F5F4] transition-colors flex items-center justify-between group outline-none focus-visible:bg-[#F5F5F4] bg-white">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-[#F5F5F4] border-[#DCDCDA]">
                      <X className="w-4 h-4 text-[#dc2626]" />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-sm truncate font-medium text-[#121415]">Клиент отменил визит</p>
                      <p className="text-xs text-[#4A4E51] mt-0.5 leading-relaxed break-words line-clamp-2">Алексей В. отменил свою запись</p>
                      <p className="text-xs font-medium text-[#8B9194] mt-2">1 час назад</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#DCDCDA] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0" />
                </button>
                <button type="button" className="w-full text-left p-4 border-b border-[#DCDCDA] hover:bg-[#F5F5F4] transition-colors flex items-center justify-between group outline-none focus-visible:bg-[#F5F5F4] bg-white">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-[#ECECEA] border-transparent">
                      <AlertTriangle className="w-4 h-4 text-[#121415]" />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-sm truncate font-medium text-[#4A4E51]">Системное уведомление</p>
                      <p className="text-xs text-[#4A4E51] mt-0.5 leading-relaxed break-words line-clamp-2">Пакет SMS скоро закончится (осталось 110)</p>
                      <p className="text-xs font-medium text-[#8B9194] mt-2">Вчера</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#DCDCDA] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0" />
                </button>
              </div>
            </div>
          </div>

          <Link
            href="/admin/profile"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-[#DCDCDA] shadow-sm hover:shadow-md hover:border-[#4A4E51] transition-all duration-200 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] mt-1"
          >
            <div className="w-10 h-10 rounded-lg bg-[#F5F5F4] text-[#121415] flex items-center justify-center font-medium text-sm border border-[#DCDCDA] group-hover:scale-105 transition-transform shrink-0">
              ИИ
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium text-[#121415] truncate">Иван Иванов</span>
              <span className="text-xs font-medium text-[#4A6B53] truncate mt-0.5">Владелец</span>
            </div>
          </Link>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-[#ECECEA]/90 backdrop-blur-xl border-b border-[#DCDCDA] z-40 flex items-center justify-between px-4">
        <ElaraLogo />
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="p-2 text-[#4A4E51] hover:text-[#121415] transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-xl active:scale-95"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#8A2532] rounded-full border border-[#ECECEA]"></span>
          </button>
          <button
            type="button"
            className="p-2 bg-white text-[#121415] rounded-xl border border-[#DCDCDA] hover:bg-[#F5F5F4] transition-colors ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* MOBILE MENU (скрыто по умолчанию классом hidden) */}
      <div className="hidden md:hidden fixed inset-0 z-50 flex">
        <div className="absolute inset-0 bg-[#121415]/40 backdrop-blur-sm animate-in fade-in"></div>
        <aside className="relative w-72 max-w-[80vw] bg-[#F5F5F4] h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
          <div className="h-16 flex items-center justify-between px-6 border-b border-[#DCDCDA]">
            <span className="text-xl font-medium text-[#121415] tracking-tight">Меню</span>
            <button
              type="button"
              className="p-2 bg-[#ECECEA] text-[#4A4E51] hover:text-[#121415] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <Link href="/admin" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95 text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent">
              <LayoutDashboard className="w-5 h-5" /> Очередь (Live)
            </Link>
            <Link href="/admin/schedule" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95 text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent">
              <Calendar className="w-5 h-5" /> Расписание
            </Link>
            <Link href="/admin/customers" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95 text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent">
              <Users className="w-5 h-5" /> Клиенты
            </Link>
            <Link href="/admin/analytics" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95 text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent">
              <BarChart3 className="w-5 h-5" /> Аналитика
            </Link>
            <Link href="/admin/billing" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95 text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent">
              <CreditCard className="w-5 h-5" /> Биллинг
            </Link>
            <Link href="/admin/settings" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95 text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent">
              <Settings className="w-5 h-5" /> Настройки
            </Link>
          </nav>
          <div className="p-4 border-t border-[#DCDCDA] flex flex-col gap-2">
            <Link href="/admin/profile" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] hover:bg-[#DCDCDA] active:scale-95 transition-all bg-[#ECECEA] text-[#121415]">
              <User className={`w-5 h-5`} />
              <span className="font-medium text-sm">Профиль</span>
            </Link>
            <button type="button" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#4A4E51] hover:text-[#dc2626] hover:bg-white font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] active:scale-95">
              <LogOut className="w-5 h-5" /> Выйти
            </button>
          </div>
        </aside>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative md:pt-0 pt-16 bg-[#ECECEA]">
        {children}
      </div>
    </div>
  );
}