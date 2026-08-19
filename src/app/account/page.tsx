import React from "react";
import Link from "next/link";
import {
  Settings, ArrowRight, Star, Heart, Calendar, MapPin, Timer, History, RefreshCw
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { createClient } from "@/utils/supabase/server";
import { AuthService } from "@/services/AuthService";
import { VenueService } from "@/services/VenueService";
import {
  NotificationsDropdown,
  KarmaTooltip,
  AccountTabs,
  BookingActions,
  ReviewAction,
  AnimatedList,
  AnimatedListItem,
  FavoritesList
} from "./components/AccountClient";

const DEFAULT_TAB = "upcoming";

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  action?: React.ReactNode;
}
const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, action }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.04)]">
    {Icon && (
      <div className="w-16 h-16 bg-[#F5F5F4] rounded-2xl flex items-center justify-center mb-6 border border-[#DCDCDA] shrink-0">
        <Icon className="w-8 h-8 text-[#4A4E51]" />
      </div>
    )}
    <h3 className="text-xl font-semibold text-[#121415] mb-2 tracking-tight">{title}</h3>
    <p className="text-[#4A4E51] font-medium mb-8 max-w-sm leading-relaxed">
      When you interact with venues or book services, they will appear right here.
    </p>
    {action && <div className="mt-2 w-full flex justify-center">{action}</div>}
  </div>
);

export default async function AccountPage({ searchParams }: { searchParams: { tab?: string } }) {
  const supabase = await createClient();
  const authService = new AuthService(supabase);
  const venueService = new VenueService(supabase);
  const authUser = await authService.getCurrentUser();
  const venues = await venueService.getVenues();
  const allVenues = venues.map((b: any) => ({
    id: b.id,
    name: b.name,
    category: b.category ?? "General",
    rating: b.rating ?? 5,
    address: b.address ?? "",
    image: b.image_url ?? "",
  }));

  const displayName =
    (authUser?.profile?.full_name as string) ||
    
    (authUser?.email as string)?.split("@")[0] ||
    "Guest";
  const userEmail = (authUser?.email as string) ?? "";
  const avatarUrl = (authUser?.profile?.avatar_url as string) ?? "";
  const clientKarma = 95;

  const activeTab = searchParams.tab || DEFAULT_TAB;

  let upcomingBookings: any[] = [];
  let historyList: any[] = [];

  if (authUser?.id) {
    const { data: rawBookings } = await supabase
      .from("bookings")
      .select("*, businesses(name), services(name)")
      .eq("client_id", authUser.id)
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (rawBookings) {
      const isUpcoming = (status: string) => !["completed", "cancelled", "done"].includes(status);

      upcomingBookings = rawBookings.filter((b) => isUpcoming(b.status)).map((b) => ({
        id: b.id,
        date: b.date,
        time: b.time,
        venueName: b.businesses?.name || "Unknown Venue",
        serviceName: b.services?.name || "Unknown Service",
        masterName: "Any available",
        status: b.status,
      }));

      historyList = rawBookings.filter((b) => !isUpcoming(b.status)).map((b) => ({
        id: b.id,
        date: b.date,
        time: b.time,
        serviceName: b.services?.name || "Unknown Service",
        venueName: b.businesses?.name || "Unknown Venue",
        masterName: "Any available",
        isReviewed: b.rating !== null && b.rating > 0,
        rating: b.rating || 0,
      }));
    }
  }


  return (
    <div className="min-h-screen bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white flex flex-col">
      <header className="fixed top-0 inset-x-0 z-40 bg-[#ECECEA]/90 backdrop-blur-xl border-b border-[#DCDCDA]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-3.5 min-w-0">
            <Avatar name={displayName} src={avatarUrl || null} size="md" ring className="hover:scale-105 cursor-default shadow-sm" />
            <div className="flex-col hidden sm:flex min-w-0">
              <h1 className="text-sm font-semibold text-[#121415] tracking-tight truncate">Hello, {displayName.split(" ")[0]}</h1>
              <span className="text-xs text-[#4A4E51] font-medium truncate">{userEmail || "Manage your bookings"}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <KarmaTooltip karma={clientKarma} />
            <div className="w-px h-6 bg-[#DCDCDA] hidden sm:block mx-1 shrink-0" />
            <NotificationsDropdown />
            <Link href="/settings" aria-label="Settings" className="p-2.5 text-[#4A4E51] hover:text-[#121415] rounded-full hover:bg-white border border-transparent hover:border-[#DCDCDA] transition-all active:scale-95 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20 w-full">
        <AccountTabs upcomingCount={upcomingBookings.length} />

        <div className="max-w-4xl mx-auto px-6 py-8">
          {activeTab === "upcoming" && (
            <AnimatedList className="space-y-6">
              {upcomingBookings.length > 0 ? upcomingBookings.map((booking) => (
                <AnimatedListItem key={booking.id} className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col w-full group transition-all">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#8A2532]" />
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4 min-w-0">
                    <div className="min-w-0 flex-1 pr-4">
                      <div className="bg-[#8A2532]/10 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 w-max mb-4">
                        <div className="w-2 h-2 rounded-full bg-[#8A2532] animate-pulse shrink-0" />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-[#8A2532]">Active Booking</span>
                      </div>
                      <h2 className="text-3xl font-semibold text-[#121415] tracking-tight">{booking.date} at {booking.time}</h2>
                      <p className="text-[#4A4E51] font-medium mt-2 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#8A2532] shrink-0" />
                        <span>{booking.venueName}</span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#F5F5F4] rounded-2xl p-5 mb-8 border border-[#DCDCDA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#121415] leading-snug">{booking.serviceName}</p>
                      <p className="text-sm text-[#4A4E51] font-medium mt-1">Professional: {booking.masterName}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-[#E8EFE9] px-3 py-1.5 rounded-lg border border-[#4A6B53]/20 w-max shrink-0">
                      <Timer className="w-4 h-4 text-[#4A6B53] shrink-0" />
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[#4A6B53]">Confirmed</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/ticket" className="flex-1 h-12 px-6 bg-[#8A2532] text-white rounded-full font-medium text-sm shadow-[0_8px_20px_rgba(138,37,50,0.2)] hover:bg-[#731E29] transition-all flex items-center justify-center gap-2 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#8A2532] focus-visible:ring-offset-2">
                      <span>LiveTracker</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </Link>
                    <BookingActions bookingId={booking.id} />
                  </div>
                </AnimatedListItem>
              )) : (
                <EmptyState icon={Calendar} title="No active bookings" action={<Link href="/search" className="h-12 px-8 bg-[#121415] text-white rounded-full font-medium text-sm shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-[#1E2123] transition-all active:scale-95 inline-flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">Find a venue</Link>} />
              )}
            </AnimatedList>
          )}

          {activeTab === "favorites" && (
            <FavoritesList initialVenues={allVenues} currentUserId={authUser?.id ?? "guest"} />
          )}

          {activeTab === "history" && (
            <AnimatedList className="space-y-4">
              {historyList.length > 0 ? historyList.map((booking) => (
                <AnimatedListItem key={String(booking.id)} className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.08)] transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[#4A4E51] bg-[#F5F5F4] px-2.5 py-1 rounded-lg border border-[#DCDCDA]">{booking.date}</span>
                    </div>
                    <h3 className="font-semibold text-[#121415] text-xl tracking-tight leading-snug">{booking.serviceName}</h3>
                    <p className="text-sm text-[#4A4E51] font-medium mt-1 leading-relaxed">{booking.venueName} • Pro: {booking.masterName}</p>
                  </div>
                  <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                    {booking.isReviewed ? (
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`w-3.5 h-3.5 ${star <= booking.rating ? "fill-[#8A2532] text-[#8A2532]" : "fill-[#F5F5F4] text-[#DCDCDA]"}`} />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A4E51]">Rated {booking.rating}</span>
                      </div>
                    ) : (
                      <ReviewAction venueName={booking.venueName} bookingId={booking.id} />
                    )}
                    <Link href="/booking" className="text-sm font-medium text-[#121415] hover:text-[#8A2532] flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:underline rounded mt-0 sm:mt-2">
                      <RefreshCw className="w-4 h-4 text-[#4A4E51] shrink-0" />
                      <span>Book again</span>
                    </Link>
                  </div>
                </AnimatedListItem>
              )) : (
                <EmptyState icon={History} title="No history yet" action={<Link href="/search" className="h-12 px-8 bg-[#121415] text-white rounded-full font-medium text-sm shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-[#1E2123] transition-all active:scale-95 inline-flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">Find a venue</Link>} />
              )}
            </AnimatedList>
          )}
        </div>
      </main>
    </div>
  );
}

