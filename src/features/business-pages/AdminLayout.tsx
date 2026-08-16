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
import useAuthStore from "@/features/market-pages/stores/authStore";
import Avatar from "@/components/ui/Avatar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user: authUser } = useAuthStore();
  const displayName: string =
    (authUser?.profile?.full_name as string) ||
    (authUser?.name as string) ||
    (authUser?.email as string)?.split("@")[0] ||
    "Owner";
  const userEmail: string = (authUser?.email as string) ?? "";
  const avatarUrl: string = (authUser?.profile?.avatar_url as string) ?? "";
  const roleLabel = "Owner";


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
            Queue (Live)
          </Link>
          <Link
            href="/admin/schedule"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent"
          >
            <Calendar className="w-5 h-5" />
            Schedule
          </Link>
          <Link
            href="/admin/customers"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent"
          >
            <Users className="w-5 h-5" />
            Clients
          </Link>
          <Link
            href="/admin/analytics"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent"
          >
            <BarChart3 className="w-5 h-5" />
            Analytics
          </Link>
          <Link
            href="/admin/billing"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent"
          >
            <CreditCard className="w-5 h-5" />
            Billing
          </Link>
          <Link
            href="/admin/settings"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent"
          >
            <Settings className="w-5 h-5" />
            Settings
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
                Notifications
              </div>
              <span className="bg-[#8A2532] text-white text-xs font-medium px-2 py-0.5 rounded-md">
                2
              </span>
            </button>

            {/* Notifications dropdown (hidden by default via 'hidden' class) */}
            <div className="hidden absolute bottom-full left-0 mb-3 w-[340px] bg-white rounded-2xl shadow-lg border border-[#DCDCDA] overflow-hidden animate-in fade-in slide-in-from-bottom-2 z-50">
              <div className="flex items-center justify-between p-5 border-b border-[#DCDCDA] bg-white">
                <span className="font-medium text-[#121415] text-base tracking-tight">Notifications</span>
                <button type="button" className="text-xs font-medium text-[#4A4E51] hover:text-[#121415] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded">
                  Mark all read
                </button>
              </div>
              <div className="max-h-[340px] overflow-y-auto">
                <button type="button" className="w-full text-left p-4 border-b border-[#DCDCDA] hover:bg-[#F5F5F4] transition-colors flex items-center justify-between group outline-none focus-visible:bg-[#F5F5F4] bg-white">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-[#F5F5F4] border-[#DCDCDA]">
                      <CheckCircle2 className="w-4 h-4 text-[#4A6B53]" />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-sm truncate font-medium text-[#121415]">New online booking</p>
                      <p className="text-xs text-[#4A4E51] mt-0.5 leading-relaxed break-words line-clamp-2">Azamat booked a Haircut (14:30)</p>
                      <p className="text-xs font-medium text-[#8B9194] mt-2">5 min ago</p>
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
                      <p className="text-sm truncate font-medium text-[#121415]">Client cancelled appointment</p>
                      <p className="text-xs text-[#4A4E51] mt-0.5 leading-relaxed break-words line-clamp-2">Alexey V. cancelled his appointment</p>
                      <p className="text-xs font-medium text-[#8B9194] mt-2">1 hour ago</p>
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
                      <p className="text-sm truncate font-medium text-[#4A4E51]">System notification</p>
                      <p className="text-xs text-[#4A4E51] mt-0.5 leading-relaxed break-words line-clamp-2">SMS package almost exhausted (110 remaining)</p>
                      <p className="text-xs font-medium text-[#8B9194] mt-2">Yesterday</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#DCDCDA] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0" />
                </button>
              </div>
            </div>
          </div>

          <Link
            href="/admin/profile"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] border border-transparent hover:bg-[#ECECEA] text-left group mt-1"
          >
            <Avatar
              name={displayName}
              src={avatarUrl || null}
              size="sm"
              className="group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium text-[#121415] truncate">{displayName}</span>
              <span className="text-xs font-medium text-[#4A4E51] truncate mt-0.5">
                Free
              </span>
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

      {/* MOBILE MENU (hidden by default via 'hidden' class) */}
      <div className="hidden md:hidden fixed inset-0 z-50 flex">
        <div className="absolute inset-0 bg-[#121415]/40 backdrop-blur-sm animate-in fade-in"></div>
        <aside className="relative w-72 max-w-[80vw] bg-[#F5F5F4] h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
          <div className="h-16 flex items-center justify-between px-6 border-b border-[#DCDCDA]">
            <span className="text-xl font-medium text-[#121415] tracking-tight">Menu</span>
            <button
              type="button"
              className="p-2 bg-[#ECECEA] text-[#4A4E51] hover:text-[#121415] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <Link href="/admin" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95 text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent">
              <LayoutDashboard className="w-5 h-5" /> Queue (Live)
            </Link>
            <Link href="/admin/schedule" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95 text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent">
              <Calendar className="w-5 h-5" /> Schedule
            </Link>
            <Link href="/admin/customers" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95 text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent">
              <Users className="w-5 h-5" /> Clients
            </Link>
            <Link href="/admin/analytics" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95 text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent">
              <BarChart3 className="w-5 h-5" /> Analytics
            </Link>
            <Link href="/admin/billing" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95 text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent">
              <CreditCard className="w-5 h-5" /> Billing
            </Link>
            <Link href="/admin/settings" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95 text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] font-medium border border-transparent">
              <Settings className="w-5 h-5" /> Settings
            </Link>
          </nav>
          <div className="p-4 border-t border-[#DCDCDA] flex flex-col gap-2">
            <Link href="/admin/profile" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] border border-transparent text-left hover:bg-[#ECECEA] group">
              <Avatar
                name={displayName}
                src={avatarUrl || null}
                size="sm"
                className="shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-sm text-[#121415] truncate">{displayName}</span>
                <span className="text-xs text-[#4A4E51] truncate mt-0.5">Free</span>
              </div>
            </Link>
            <button type="button" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#4A4E51] hover:text-[#dc2626] hover:bg-white font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] active:scale-95">
              <LogOut className="w-5 h-5" /> Log out
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
