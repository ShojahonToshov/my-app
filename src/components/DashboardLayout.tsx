"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Clock,
  Calendar,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  PanelLeft,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import ElaraLogo from "@/components/ElaraLogo";
import useUser from "@/hooks/useUser";
import Avatar from "@/components/ui/Avatar";
import Tooltip from "@/components/ui/Tooltip";

import { usePathname } from "next/navigation";

import { useI18nStore } from "@/stores/i18nStore";
import { useI18n } from "@/hooks/useI18n";
import { useNotificationStore } from "@/stores/notificationStore";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const pathname = usePathname();
  
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileNotifications, setShowMobileNotifications] = useState(false);
  
  const { notifications, clearAll, markAsRead, unreadCount } = useNotificationStore();
  const unread = unreadCount();

  const notifRef = useRef<HTMLDivElement>(null);
  const mobileNotifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showNotifications && !showMobileNotifications) return;
    const handler = (e: MouseEvent) => {
      if (showNotifications && notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (showMobileNotifications && mobileNotifRef.current && !mobileNotifRef.current.contains(e.target as Node)) {
        setShowMobileNotifications(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotifications, showMobileNotifications]);

  const { user: authUser } = useUser();
  const displayName: string = (authUser?.profile?.full_name as string) || (authUser?.user_metadata?.full_name as string) || "Owner";
  const userEmail: string = (authUser?.email as string) ?? "";
  const avatarUrl: string = (authUser?.profile?.avatar_url as string) ?? "";
  const roleLabel = "Owner";

  return (
    <div className="flex h-[100dvh] bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white overflow-hidden">
      
      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden md:flex ${isCollapsed ? "w-[88px]" : "w-[260px]"} bg-[#F5F5F4] border-r border-[#DCDCDA] flex-col shrink-0 z-40 relative transition-all duration-300 ease-in-out`}>
        <div className="group h-20 flex items-center relative px-7 justify-between border-b border-[#DCDCDA] shrink-0 transition-all duration-300 overflow-hidden whitespace-nowrap">
          
          {/* LOGO */}
          <div className={`transition-opacity duration-300 flex items-center ${isCollapsed ? "group-hover:opacity-0" : ""}`}>
            <ElaraLogo showText={!isCollapsed} disableLink={isCollapsed} />
          </div>

          {/* TOGGLE BUTTON */}
          <Tooltip content={isCollapsed ? t("extra.t366") : t("extra.t367")} position="right" className="flex">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`flex items-center justify-center text-[#4A4E51] hover:text-[#121415] transition-all duration-300 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] shrink-0 ${
                isCollapsed 
                  ? "absolute inset-0 m-auto w-10 h-10 opacity-0 group-hover:opacity-100 hover:bg-[#DCDCDA]/50 z-10"
                  : "p-2 opacity-100 hover:bg-[#DCDCDA]/50 relative"
              }`}
            >
              <PanelLeft className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>

        <nav className="flex-1 py-5 px-4 space-y-2 overflow-y-auto scrollbar-hide overflow-x-hidden">
          <Tooltip content="Queue (Live)"  className="w-full">
            <Link
              href="/dashboard"
              className={`w-full flex items-center py-3 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] font-medium border border-transparent overflow-hidden whitespace-nowrap ${isCollapsed ? "px-[18px]" : "px-4"} ${isActive('/dashboard') ? 'bg-[#121415] text-white shadow-md' : 'text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA]'}`}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>{t("extra.t32")}</span>
            </Link>
          </Tooltip>
          <Tooltip content="Schedule"  className="w-full">
            <Link
              href="/dashboard/schedule"
              className={`w-full flex items-center py-3 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] font-medium border border-transparent overflow-hidden whitespace-nowrap ${isCollapsed ? "px-[18px]" : "px-4"} ${isActive('/dashboard/schedule') ? 'bg-[#121415] text-white shadow-md' : 'text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA]'}`}
            >
              <Calendar className="w-5 h-5 shrink-0" />
              <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>{t("extra.t125")}</span>
            </Link>
          </Tooltip>
          <Tooltip content={t("dashboard.customers")}  className="w-full">
            <Link
              href="/dashboard/customers"
              className={`w-full flex items-center py-3 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] font-medium border border-transparent overflow-hidden whitespace-nowrap ${isCollapsed ? "px-[18px]" : "px-4"} ${isActive('/dashboard/customers') ? 'bg-[#121415] text-white shadow-md' : 'text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA]'}`}
            >
              <Users className="w-5 h-5 shrink-0" />
              <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>{t("dashboard.customers")}</span>
            </Link>
          </Tooltip>
          <Tooltip content={t("dashboard.analytics")}  className="w-full">
            <Link
              href="/dashboard/analytics"
              className={`w-full flex items-center py-3 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] font-medium border border-transparent overflow-hidden whitespace-nowrap ${isCollapsed ? "px-[18px]" : "px-4"} ${isActive('/dashboard/analytics') ? 'bg-[#121415] text-white shadow-md' : 'text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA]'}`}
            >
              <BarChart3 className="w-5 h-5 shrink-0" />
              <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>{t("dashboard.analytics")}</span>
            </Link>
          </Tooltip>
          <Tooltip content={t("dashboard.settings")}  className="w-full">
            <Link
              href="/dashboard/settings"
              className={`w-full flex items-center py-3 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] font-medium border border-transparent overflow-hidden whitespace-nowrap ${isCollapsed ? "px-[18px]" : "px-4"} ${isActive('/dashboard/settings') ? 'bg-[#121415] text-white shadow-md' : 'text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA]'}`}
            >
              <Settings className="w-5 h-5 shrink-0" />
              <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>{t("dashboard.settings")}</span>
            </Link>
          </Tooltip>
        </nav>

        {/* BOTTOM USER & NOTIFICATIONS SECTION */}
        <div className="py-4 px-4 border-t border-[#DCDCDA] flex flex-col gap-2 shrink-0 bg-[#F5F5F4] relative whitespace-nowrap">
          
          <div className="relative" ref={notifRef}>
            <Tooltip content={t("dashboard.notifications")}  className="w-full">
              <button
                type="button"
                onClick={() => {
                  if (notifications.length > 0) {
                    setShowNotifications(!showNotifications);
                  } else {
                    toast("You have no new notifications");
                  }
                }}
                className={`w-full flex items-center justify-between py-3 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] border border-transparent text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] overflow-hidden whitespace-nowrap ${isCollapsed ? "px-[18px]" : "px-4"}`}
              >
                <div className="flex items-center font-medium text-sm">
                  <div className="relative shrink-0">
                    <Bell className="w-5 h-5 shrink-0" />
                    {unread > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#8A2532] rounded-full border border-[#F5F5F4]"></span>
                    )}
                  </div>
                  <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>{t("dashboard.notifications")}</span>
                </div>
                {unread > 0 && (
                  <span className={`bg-[#8A2532] text-white text-xs font-medium px-2 py-0.5 rounded-md shrink-0 transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>
                    {unread}
                  </span>
                )}
              </button>
            </Tooltip>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-0 mb-3 w-[340px] bg-white rounded-2xl shadow-lg border border-[#DCDCDA] overflow-hidden origin-bottom-left z-[99999] whitespace-normal"
                >
                  <div className="flex items-center justify-between p-5 border-b border-[#DCDCDA] bg-white">
                    <span className="font-medium text-[#121415] text-base tracking-tight">{t("dashboard.notifications")}</span>
                    <button 
                      type="button" 
                      onClick={() => {
                        clearAll();
                        setShowNotifications(false);
                        toast.success("All notifications cleared");
                      }}
                      className="text-xs font-medium text-[#4A4E51] hover:text-[#121415] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
                    >{t("extra.t256")}</button>
                  </div>
                  <div className="max-h-[340px] overflow-y-auto">
                    {notifications.map((notif) => (
                      <button 
                        key={notif.id} 
                        type="button" 
                        onClick={() => markAsRead(notif.id)}
                        className={`w-full text-left p-4 border-b border-[#DCDCDA] last:border-0 hover:bg-[#F5F5F4] transition-colors flex items-center justify-between group outline-none focus-visible:bg-[#F5F5F4] ${notif.read ? 'bg-white opacity-70' : 'bg-[#FAFAFA]'}`}
                      >
                        <div className="flex items-start gap-3">
                          {!notif.read && (
                            <div className="mt-3 w-1.5 h-1.5 bg-[#8A2532] rounded-full shrink-0 shadow-sm" />
                          )}
                          <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${notif.type === 'warning' ? 'bg-[#ECECEA] border-transparent' : 'bg-[#F5F5F4] border-[#DCDCDA]'}`}>
                            {notif.type === "success" && <CheckCircle2 className="w-4 h-4 text-[#4A6B53]" />}
                            {notif.type === "cancel" && <X className="w-4 h-4 text-[#dc2626]" />}
                            {notif.type === "warning" && <AlertTriangle className="w-4 h-4 text-[#121415]" />}
                          </div>
                          <div className="flex-1 min-w-0 pr-2">
                            <p className={`text-sm truncate font-medium ${notif.type === 'warning' ? 'text-[#4A4E51]' : 'text-[#121415]'}`}>{notif.title}</p>
                            <p className="text-xs text-[#4A4E51] mt-0.5 leading-relaxed break-words line-clamp-2">{notif.message}</p>
                            <p className="text-xs font-medium text-[#8B9194] mt-2">{notif.time}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#DCDCDA] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Tooltip content={t("extra.t368")}  className="w-full mt-1">
            <Link
              href="/dashboard/profile"
              className={`w-full flex items-center py-3 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] border border-transparent hover:bg-[#ECECEA] text-left group overflow-hidden whitespace-nowrap ${isCollapsed ? "px-3" : "px-4"}`}
            >
              <Avatar
                name={displayName}
                src={avatarUrl || null}
                size="sm"
                className="group-hover:scale-105 transition-transform shrink-0"
              />
              <div className={`ml-3 flex flex-col flex-1 min-w-0 transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>
                <span className="text-sm font-medium text-[#121415] truncate">{displayName}</span>
                <span className="text-xs font-medium text-[#4A4E51] truncate mt-0.5">{t("extra.t231")}</span>
              </div>
            </Link>
          </Tooltip>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-14 bg-[#ECECEA]/90 backdrop-blur-xl border-b border-[#DCDCDA]/50 z-40 flex items-center justify-between px-4">
        <ElaraLogo />
        <div className="flex items-center gap-3">
          <div className="relative" ref={mobileNotifRef}>
            <button
              type="button"
              onClick={() => {
                if (notifications.length > 0) {
                  setShowMobileNotifications(!showMobileNotifications);
                } else {
                  toast("You have no new notifications");
                }
              }}
              className="p-2 text-[#4A4E51] hover:text-[#121415] transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-full active:scale-95"
            >
              <Bell className="w-6 h-6" />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#8A2532] rounded-full border-2 border-[#ECECEA]"></span>
              )}
            </button>

            <AnimatePresence>
              {showMobileNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-[300px] sm:w-[340px] bg-white rounded-3xl shadow-xl border border-[#DCDCDA]/50 overflow-hidden origin-top-right z-[99999] whitespace-normal"
                >
                  <div className="flex items-center justify-between p-4 border-b border-[#DCDCDA]/50 bg-white">
                    <span className="font-medium text-[#121415] text-sm tracking-tight">{t("dashboard.notifications")}</span>
                    <button 
                      type="button" 
                      onClick={() => {
                        clearAll();
                        setShowMobileNotifications(false);
                        toast.success("All notifications cleared");
                      }}
                      className="text-xs font-medium text-[#4A4E51] hover:text-[#121415] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
                    >{t("extra.t256")}</button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map((notif) => (
                      <button 
                        key={notif.id} 
                        type="button" 
                        onClick={() => markAsRead(notif.id)}
                        className={`w-full text-left p-3 border-b border-[#DCDCDA]/50 last:border-0 hover:bg-[#F5F5F4] transition-colors flex items-center justify-between group outline-none focus-visible:bg-[#F5F5F4] ${notif.read ? 'bg-white opacity-70' : 'bg-[#FAFAFA]'}`}
                      >
                        <div className="flex items-start gap-3">
                          {!notif.read && (
                            <div className="mt-2.5 w-1.5 h-1.5 bg-[#8A2532] rounded-full shrink-0 shadow-sm" />
                          )}
                          <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${notif.type === 'warning' ? 'bg-[#ECECEA] border-transparent' : 'bg-[#F5F5F4] border-[#DCDCDA]/50'}`}>
                            {notif.type === "success" && <CheckCircle2 className="w-3.5 h-3.5 text-[#4A6B53]" />}
                            {notif.type === "cancel" && <X className="w-3.5 h-3.5 text-[#dc2626]" />}
                            {notif.type === "warning" && <AlertTriangle className="w-3.5 h-3.5 text-[#121415]" />}
                          </div>
                          <div className="flex-1 min-w-0 pr-2">
                            <p className={`text-[13px] truncate font-medium ${notif.type === 'warning' ? 'text-[#4A4E51]' : 'text-[#121415]'}`}>{notif.title}</p>
                            <p className="text-[11px] text-[#4A4E51] mt-0.5 leading-relaxed break-words line-clamp-2">{notif.message}</p>
                            <p className="text-[10px] font-medium text-[#8B9194] mt-1">{notif.time}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3 h-3 text-[#DCDCDA] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link href="/dashboard/profile" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-full active:scale-95 transition-transform">
            <Avatar
              name={displayName}
              src={avatarUrl || null}
              size="sm"
              className="w-9 h-9"
            />
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto relative md:pt-0 pt-14 md:pb-0 pb-[80px] bg-[#ECECEA]">
        {children}
      </div>

      {/* MOBILE BOTTOM NAVIGATION (TAB BAR) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#F5F5F4]/90 backdrop-blur-xl border-t border-[#DCDCDA] z-50 px-1 pb-[env(safe-area-inset-bottom)] pt-1 select-none">
        <div className="flex items-center justify-between h-[56px]">
          <Link
            href="/dashboard"
            className={`flex-1 flex flex-col items-center justify-center gap-1 h-full active:scale-95 transition-all focus-visible:outline-none rounded-2xl ${isActive('/dashboard') && pathname === '/dashboard' ? 'text-[#121415]' : 'text-[#8B9194] hover:text-[#4A4E51]'}`}
          >
            <div className={`flex items-center justify-center w-14 h-8 rounded-full transition-colors ${isActive('/dashboard') && pathname === '/dashboard' ? 'bg-[#DCDCDA]/40' : 'bg-transparent'}`}>
              <LayoutDashboard className={`w-5 h-5 ${isActive('/dashboard') && pathname === '/dashboard' ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
            </div>
            <span className={`text-[10px] font-medium tracking-tight ${isActive('/dashboard') && pathname === '/dashboard' ? 'font-semibold' : ''}`}>{t("extra.t32")}</span>
          </Link>
          
          <Link
            href="/dashboard/schedule"
            className={`flex-1 flex flex-col items-center justify-center gap-1 h-full active:scale-95 transition-all focus-visible:outline-none rounded-2xl ${isActive('/dashboard/schedule') ? 'text-[#121415]' : 'text-[#8B9194] hover:text-[#4A4E51]'}`}
          >
            <div className={`flex items-center justify-center w-14 h-8 rounded-full transition-colors ${isActive('/dashboard/schedule') ? 'bg-[#DCDCDA]/40' : 'bg-transparent'}`}>
              <Calendar className={`w-5 h-5 ${isActive('/dashboard/schedule') ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
            </div>
            <span className={`text-[10px] font-medium tracking-tight ${isActive('/dashboard/schedule') ? 'font-semibold' : ''}`}>{t("extra.t125")}</span>
          </Link>

          <Link
            href="/dashboard/customers"
            className={`flex-1 flex flex-col items-center justify-center gap-1 h-full active:scale-95 transition-all focus-visible:outline-none rounded-2xl ${isActive('/dashboard/customers') ? 'text-[#121415]' : 'text-[#8B9194] hover:text-[#4A4E51]'}`}
          >
            <div className={`flex items-center justify-center w-14 h-8 rounded-full transition-colors ${isActive('/dashboard/customers') ? 'bg-[#DCDCDA]/40' : 'bg-transparent'}`}>
              <Users className={`w-5 h-5 ${isActive('/dashboard/customers') ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
            </div>
            <span className={`text-[10px] font-medium tracking-tight ${isActive('/dashboard/customers') ? 'font-semibold' : ''}`}>{t("dashboard.customers")}</span>
          </Link>

          <Link
            href="/dashboard/analytics"
            className={`flex-1 flex flex-col items-center justify-center gap-1 h-full active:scale-95 transition-all focus-visible:outline-none rounded-2xl ${isActive('/dashboard/analytics') ? 'text-[#121415]' : 'text-[#8B9194] hover:text-[#4A4E51]'}`}
          >
            <div className={`flex items-center justify-center w-14 h-8 rounded-full transition-colors ${isActive('/dashboard/analytics') ? 'bg-[#DCDCDA]/40' : 'bg-transparent'}`}>
              <BarChart3 className={`w-5 h-5 ${isActive('/dashboard/analytics') ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
            </div>
            <span className={`text-[10px] font-medium tracking-tight ${isActive('/dashboard/analytics') ? 'font-semibold' : ''}`}>{t("dashboard.analytics")}</span>
          </Link>

          <Link
            href="/dashboard/settings"
            className={`flex-1 flex flex-col items-center justify-center gap-1 h-full active:scale-95 transition-all focus-visible:outline-none rounded-2xl ${isActive('/dashboard/settings') ? 'text-[#121415]' : 'text-[#8B9194] hover:text-[#4A4E51]'}`}
          >
            <div className={`flex items-center justify-center w-14 h-8 rounded-full transition-colors ${isActive('/dashboard/settings') ? 'bg-[#DCDCDA]/40' : 'bg-transparent'}`}>
              <Settings className={`w-5 h-5 ${isActive('/dashboard/settings') ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
            </div>
            <span className={`text-[10px] font-medium tracking-tight ${isActive('/dashboard/settings') ? 'font-semibold' : ''}`}>{t("dashboard.settings")}</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
