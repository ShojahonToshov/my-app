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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "New online booking",
      message: "Azamat booked a Haircut (14:30)",
      time: "5 min ago",
    },
    {
      id: 2,
      type: "cancel",
      title: "Customer cancelled appointment",
      message: "Alexey V. cancelled his appointment for today",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "warning",
      title: "System notification",
      message: "SMS package almost exhausted (110 remaining)",
      time: "Yesterday",
    },
  ]);

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
          <Tooltip content={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} position="right" className="flex">
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
              <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>Queue (Live)</span>
            </Link>
          </Tooltip>
          <Tooltip content="Schedule"  className="w-full">
            <Link
              href="/dashboard/schedule"
              className={`w-full flex items-center py-3 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] font-medium border border-transparent overflow-hidden whitespace-nowrap ${isCollapsed ? "px-[18px]" : "px-4"} ${isActive('/dashboard/schedule') ? 'bg-[#121415] text-white shadow-md' : 'text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA]'}`}
            >
              <Calendar className="w-5 h-5 shrink-0" />
              <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>Schedule</span>
            </Link>
          </Tooltip>
          <Tooltip content="Customers"  className="w-full">
            <Link
              href="/dashboard/customers"
              className={`w-full flex items-center py-3 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] font-medium border border-transparent overflow-hidden whitespace-nowrap ${isCollapsed ? "px-[18px]" : "px-4"} ${isActive('/dashboard/customers') ? 'bg-[#121415] text-white shadow-md' : 'text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA]'}`}
            >
              <Users className="w-5 h-5 shrink-0" />
              <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>Customers</span>
            </Link>
          </Tooltip>
          <Tooltip content="Analytics"  className="w-full">
            <Link
              href="/dashboard/analytics"
              className={`w-full flex items-center py-3 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] font-medium border border-transparent overflow-hidden whitespace-nowrap ${isCollapsed ? "px-[18px]" : "px-4"} ${isActive('/dashboard/analytics') ? 'bg-[#121415] text-white shadow-md' : 'text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA]'}`}
            >
              <BarChart3 className="w-5 h-5 shrink-0" />
              <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>Analytics</span>
            </Link>
          </Tooltip>
          <Tooltip content="Settings"  className="w-full">
            <Link
              href="/dashboard/settings"
              className={`w-full flex items-center py-3 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] font-medium border border-transparent overflow-hidden whitespace-nowrap ${isCollapsed ? "px-[18px]" : "px-4"} ${isActive('/dashboard/settings') ? 'bg-[#121415] text-white shadow-md' : 'text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA]'}`}
            >
              <Settings className="w-5 h-5 shrink-0" />
              <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>Settings</span>
            </Link>
          </Tooltip>
        </nav>

        {/* BOTTOM USER & NOTIFICATIONS SECTION */}
        <div className="py-4 px-4 border-t border-[#DCDCDA] flex flex-col gap-2 shrink-0 bg-[#F5F5F4] relative whitespace-nowrap">
          
          <div className="relative" ref={notifRef}>
            <Tooltip content="Notifications"  className="w-full">
              <button
                type="button"
                onClick={() => {
                  if (notifications.length > 0) {
                    setShowNotifications(!showNotifications);
                  } else {
                    toast("У вас нет новых уведомлений");
                  }
                }}
                className={`w-full flex items-center justify-between py-3 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] border border-transparent text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] overflow-hidden whitespace-nowrap ${isCollapsed ? "px-[18px]" : "px-4"}`}
              >
                <div className="flex items-center font-medium text-sm">
                  <div className="relative shrink-0">
                    <Bell className="w-5 h-5 shrink-0" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#8A2532] rounded-full border border-[#F5F5F4]"></span>
                    )}
                  </div>
                  <span className={`ml-3 transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>Notifications</span>
                </div>
                {notifications.length > 0 && (
                  <span className={`bg-[#8A2532] text-white text-xs font-medium px-2 py-0.5 rounded-md shrink-0 transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}>
                    {notifications.length}
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
                    <span className="font-medium text-[#121415] text-base tracking-tight">Notifications</span>
                    <button 
                      type="button" 
                      onClick={() => {
                        setNotifications([]);
                        setShowNotifications(false);
                        toast.success("Все уведомления прочитаны");
                      }}
                      className="text-xs font-medium text-[#4A4E51] hover:text-[#121415] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-[340px] overflow-y-auto">
                    {notifications.map((notif) => (
                      <button key={notif.id} type="button" className="w-full text-left p-4 border-b border-[#DCDCDA] last:border-0 hover:bg-[#F5F5F4] transition-colors flex items-center justify-between group outline-none focus-visible:bg-[#F5F5F4] bg-white">
                        <div className="flex items-start gap-3">
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

          <Tooltip content="Profile"  className="w-full mt-1">
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
                <span className="text-xs font-medium text-[#4A4E51] truncate mt-0.5">
                  Free
                </span>
              </div>
            </Link>
          </Tooltip>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-[#F5F5F4]/90 backdrop-blur-xl border-b border-[#DCDCDA] z-40 flex items-center justify-between px-4">
        <ElaraLogo />
        <div className="flex items-center gap-1">
          <div className="relative" ref={mobileNotifRef}>
            <button
              type="button"
              onClick={() => {
                if (notifications.length > 0) {
                  setShowMobileNotifications(!showMobileNotifications);
                } else {
                  toast("У вас нет новых уведомлений");
                }
              }}
              className="p-2 text-[#4A4E51] hover:text-[#121415] transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-xl active:scale-95"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#8A2532] rounded-full border border-[#ECECEA]"></span>
              )}
            </button>

            <AnimatePresence>
              {showMobileNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-[300px] sm:w-[340px] bg-white rounded-2xl shadow-lg border border-[#DCDCDA] overflow-hidden origin-top-right z-[99999] whitespace-normal"
                >
                  <div className="flex items-center justify-between p-4 border-b border-[#DCDCDA] bg-white">
                    <span className="font-medium text-[#121415] text-sm sm:text-base tracking-tight">Notifications</span>
                    <button 
                      type="button" 
                      onClick={() => {
                        setNotifications([]);
                        setShowMobileNotifications(false);
                        toast.success("Все уведомления прочитаны");
                      }}
                      className="text-xs font-medium text-[#4A4E51] hover:text-[#121415] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map((notif) => (
                      <button key={notif.id} type="button" className="w-full text-left p-3 sm:p-4 border-b border-[#DCDCDA] last:border-0 hover:bg-[#F5F5F4] transition-colors flex items-center justify-between group outline-none focus-visible:bg-[#F5F5F4] bg-white">
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${notif.type === 'warning' ? 'bg-[#ECECEA] border-transparent' : 'bg-[#F5F5F4] border-[#DCDCDA]'}`}>
                            {notif.type === "success" && <CheckCircle2 className="w-4 h-4 text-[#4A6B53]" />}
                            {notif.type === "cancel" && <X className="w-4 h-4 text-[#dc2626]" />}
                            {notif.type === "warning" && <AlertTriangle className="w-4 h-4 text-[#121415]" />}
                          </div>
                          <div className="flex-1 min-w-0 pr-2">
                            <p className={`text-sm truncate font-medium ${notif.type === 'warning' ? 'text-[#4A4E51]' : 'text-[#121415]'}`}>{notif.title}</p>
                            <p className="text-xs text-[#4A4E51] mt-0.5 leading-relaxed break-words line-clamp-2">{notif.message}</p>
                            <p className="text-xs font-medium text-[#8B9194] mt-1 sm:mt-2">{notif.time}</p>
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
              className="p-2 bg-[#ECECEA] text-[#4A4E51] hover:text-[#121415] rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <Link href="/dashboard" className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95 font-medium border border-transparent ${isActive('/dashboard') ? 'bg-[#121415] text-white shadow-md' : 'text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA]'}`}>
              <LayoutDashboard className="w-5 h-5" /> Queue (Live)
            </Link>
            <Link href="/dashboard/schedule" className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95 font-medium border border-transparent ${isActive('/dashboard/schedule') ? 'bg-[#121415] text-white shadow-md' : 'text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA]'}`}>
              <Calendar className="w-5 h-5" /> Schedule
            </Link>
            <Link href="/dashboard/customers" className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95 font-medium border border-transparent ${isActive('/dashboard/customers') ? 'bg-[#121415] text-white shadow-md' : 'text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA]'}`}>
              <Users className="w-5 h-5" /> Customers
            </Link>
            <Link href="/dashboard/analytics" className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95 font-medium border border-transparent ${isActive('/dashboard/analytics') ? 'bg-[#121415] text-white shadow-md' : 'text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA]'}`}>
              <BarChart3 className="w-5 h-5" /> Analytics
            </Link>
            <Link href="/dashboard/settings" className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95 font-medium border border-transparent ${isActive('/dashboard/settings') ? 'bg-[#121415] text-white shadow-md' : 'text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA]'}`}>
              <Settings className="w-5 h-5" /> Settings
            </Link>

          </nav>
          <div className="p-4 border-t border-[#DCDCDA] flex flex-col gap-2">
            <Link href="/dashboard/profile" className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] border border-transparent text-left hover:bg-[#ECECEA] group">
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
            <button type="button" className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[#4A4E51] hover:text-[#dc2626] hover:bg-white font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] active:scale-95">
              <LogOut className="w-5 h-5" /> Log out
            </button>
          </div>
        </aside>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto relative md:pt-0 pt-16 bg-[#ECECEA]">
        {children}
      </div>
    </div>
  );
}
