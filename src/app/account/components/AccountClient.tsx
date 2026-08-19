"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, Star, MessageSquare, Bell, CalendarDays, RefreshCw, X, CheckCircle2, ChevronRight, Heart, MapPin, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

export const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } } };
export const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const modalBackdrop = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } }, exit: { opacity: 0, transition: { duration: 0.2 } } };
const modalContent = { hidden: { opacity: 0, scale: 0.95, y: 10 }, show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }, exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } } };

export function NotificationsDropdown() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Booking confirmed", message: "Your appointment at Chop-Chop Barbershop is confirmed for tomorrow 14:00.", time: "2 hours ago", type: "success" },
    { id: 2, title: "Review reminder", message: "How was your visit to Glow Beauty Studio? Leave a review!", time: "1 day ago", type: "info" }
  ]);
  return (
    <div className="relative hidden sm:block shrink-0">
      <button aria-label="Notifications" onClick={() => notifications.length > 0 ? setShowNotifications(!showNotifications) : toast("У вас нет новых уведомлений")} className="relative p-2.5 text-[#4A4E51] hover:text-[#121415] rounded-full hover:bg-white border border-transparent hover:border-[#DCDCDA] transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
        <Bell className="w-5 h-5" />
        {notifications.length > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#8A2532] rounded-full border border-[#ECECEA]"></span>}
      </button>
      <AnimatePresence>
        {showNotifications && (
          <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute top-full right-0 mt-2 w-[340px] bg-white rounded-2xl shadow-lg border border-[#DCDCDA] overflow-hidden z-50 origin-top-right">
            <div className="flex items-center justify-between p-5 border-b border-[#DCDCDA] bg-white">
              <span className="font-medium text-[#121415] text-base tracking-tight">Notifications</span>
              <button type="button" onClick={() => { setNotifications([]); setShowNotifications(false); toast.success("Все уведомления прочитаны"); }} className="text-xs font-medium text-[#4A4E51] hover:text-[#121415] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded">Mark all read</button>
            </div>
            <div className="max-h-[340px] overflow-y-auto">
              {notifications.map((notif) => (
                <button key={notif.id} type="button" className="w-full text-left p-4 border-b border-[#DCDCDA] last:border-0 hover:bg-[#F5F5F4] transition-colors flex items-center justify-between group outline-none focus-visible:bg-[#F5F5F4] bg-white">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-[#F5F5F4] border-[#DCDCDA]">
                      {notif.type === "success" ? <CheckCircle2 className="w-4 h-4 text-[#4A6B53]" /> : <Bell className="w-4 h-4 text-[#4A4E51]" />}
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-sm truncate font-medium text-[#121415]">{notif.title}</p>
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
  );
}

export function KarmaTooltip({ karma }: { karma: number }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button type="button" onClick={() => setIsOpen(!isOpen)} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)} className="group bg-[#F5F5F4] px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-[#DCDCDA] shadow-sm shrink-0 h-8 cursor-pointer hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
        <Star className="w-3.5 h-3.5 fill-[#8A2532] text-[#8A2532] shrink-0 group-hover:rotate-[72deg] group-hover:scale-110 transition-transform duration-500" />
        <span className="text-xs uppercase tracking-widest font-bold text-[#121415] whitespace-nowrap">Karma: {karma}%</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 5, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute right-0 mt-2 w-64 p-4 bg-white rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] border border-[#DCDCDA] z-50 text-left">
            <p className="text-xs font-semibold text-[#121415] mb-1">Reliability Score ({karma}%)</p>
            <p className="text-[11px] text-[#4A4E51] font-medium leading-relaxed">Your karma reflects your attendance history. Staying above 90% ensures you can book without mandatory prepayments.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TABS = ["upcoming", "favorites", "history"];
const DEFAULT_TAB = "upcoming";

export function AccountTabs({ upcomingCount }: { upcomingCount: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tabParam = searchParams.get("tab");
  const activeTab = TABS.includes(tabParam as string) ? tabParam : DEFAULT_TAB;

  const handleTabChange = (tabId: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (tabId === DEFAULT_TAB) next.delete("tab");
    else next.set("tab", tabId);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-[#ECECEA] border-b border-[#DCDCDA] sticky top-20 z-30">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-center gap-3 overflow-x-auto no-scrollbar py-4">
        {[
          { id: "upcoming", label: "My Bookings", count: upcomingCount },
          { id: "favorites", label: "Favorites" },
          { id: "history", label: "History" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`shrink-0 h-11 px-5 rounded-full text-sm font-medium transition-all duration-300 border active:scale-95 flex items-center gap-2 whitespace-nowrap min-w-[100px] justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
              activeTab === tab.id ? "bg-[#121415] text-white border-[#121415]" : "bg-white text-[#121415] border-[#DCDCDA] hover:bg-[#F5F5F4]"
            }`}
          >
            <span>{tab.label}</span>
            {(tab.count ?? 0) > 0 && (
              <span className={`w-5 h-5 flex items-center justify-center shrink-0 rounded-full text-[10px] font-bold ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-[#F5F5F4] text-[#121415]"}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function BookingActions({ bookingId }: { bookingId: string }) {
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const router = useRouter();
  useLockBodyScroll(cancelModalOpen || rescheduleModalOpen);

  return (
    <>
      <div className="flex gap-4 sm:w-1/2">
        <button onClick={() => setRescheduleModalOpen(true)} className="flex-1 h-12 px-4 bg-white border border-[#DCDCDA] text-[#121415] font-medium text-sm hover:bg-[#F5F5F4] rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
          <RefreshCw className="w-4 h-4 text-[#4A4E51] shrink-0" />
          <span>Reschedule</span>
        </button>
        <button onClick={() => setCancelModalOpen(true)} className="w-12 h-12 shrink-0 bg-white border border-[#DCDCDA] text-[#4A4E51] hover:text-[#DC2626] hover:bg-[#DC2626]/5 hover:border-[#DC2626]/30 rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]">
          <X className="w-5 h-5 shrink-0" />
        </button>
      </div>

      <AnimatePresence>
        {rescheduleModalOpen && (
          <motion.div variants={modalBackdrop} initial="hidden" animate="show" exit="exit" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-md" onClick={() => setRescheduleModalOpen(false)}>
            <motion.div variants={modalContent} className="bg-white w-[480px] max-w-full rounded-[2rem] p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col relative outline-none" onClick={(e) => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-full bg-[#F5F5F4] text-[#121415] flex items-center justify-center mb-6 border border-[#DCDCDA] shrink-0">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-semibold text-[#121415] mb-2 tracking-tight">Reschedule booking</h2>
              <p className="text-sm text-[#4A4E51] font-medium mb-8 leading-relaxed">Plans changed? Pick a new time for your visit to maintain your reliability rating.</p>
              <button className="w-full bg-[#F5F5F4] border border-[#DCDCDA] rounded-2xl p-5 mb-8 text-center cursor-pointer hover:bg-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-[0.98] group">
                <span className="font-semibold text-[#121415] block mb-1.5 group-hover:text-[#8A2532] transition-colors">Select new time</span>
                <span className="text-xs text-[#4A4E51] uppercase tracking-widest font-bold block">Available: Tomorrow, 14:00, 16:30</span>
              </button>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button onClick={() => setRescheduleModalOpen(false)} className="flex-1 h-12 px-6 bg-white text-[#121415] border border-[#DCDCDA] rounded-full font-medium text-sm hover:bg-[#F5F5F4] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 shrink-0 whitespace-nowrap min-w-[120px]"><span className="truncate block">Cancel</span></button>
                <button onClick={() => setRescheduleModalOpen(false)} className="flex-1 h-12 px-6 bg-[#121415] text-white rounded-full font-medium text-sm hover:bg-[#1E2123] shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all flex items-center justify-center active:scale-95 shrink-0 whitespace-nowrap min-w-[120px]"><span className="truncate block">Confirm</span></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cancelModalOpen && (
          <motion.div variants={modalBackdrop} initial="hidden" animate="show" exit="exit" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-md" onClick={() => setCancelModalOpen(false)}>
            <motion.div variants={modalContent} className="bg-white w-[420px] max-w-full rounded-[2rem] p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col text-center outline-none" onClick={(e) => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 shrink-0 bg-[#DC2626]/10 text-[#DC2626]">
                <X className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-semibold text-[#121415] mb-3 tracking-tight break-words">Cancel Booking</h2>
              <p className="text-sm text-[#4A4E51] font-medium mb-8 leading-relaxed break-words">Are you sure you want to cancel? This may affect your Karma score.</p>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button onClick={() => setCancelModalOpen(false)} className="flex-1 h-12 px-6 bg-white text-[#121415] border border-[#DCDCDA] rounded-full font-medium text-sm hover:bg-[#F5F5F4] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 shrink-0 whitespace-nowrap min-w-[120px]"><span className="truncate block">Keep it</span></button>
                <button disabled={isCancelling} onClick={async () => { setIsCancelling(true); const supabase = createClient(); const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId); if (error) { toast.error('Failed to cancel booking'); } else { toast.success('Booking cancelled'); setCancelModalOpen(false); router.refresh(); } setIsCancelling(false); }} className="flex-1 h-12 px-6 bg-[#DC2626] text-white rounded-full font-medium text-sm hover:bg-[#B91C1C] shadow-[0_8px_20px_rgba(220,38,38,0.2)] transition-all flex items-center justify-center active:scale-95 shrink-0 whitespace-nowrap min-w-[120px] disabled:opacity-50"> {isCancelling ? <Loader2 className="w-5 h-5 animate-spin shrink-0" /> : <span className="truncate block">Cancel Booking</span>} </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function ReviewAction({ venueName, bookingId }: { venueName: string, bookingId: string }) {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const router = useRouter();
  useLockBodyScroll(reviewModalOpen);

  return (
    <>
      <button onClick={() => setReviewModalOpen(true)} className="text-sm font-medium text-[#121415] hover:text-[#8A2532] flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:underline rounded">
        <MessageSquare className="w-4 h-4 text-[#4A4E51] shrink-0" />
        <span>Leave a review</span>
      </button>

      <AnimatePresence>
        {reviewModalOpen && (
          <motion.div variants={modalBackdrop} initial="hidden" animate="show" exit="exit" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-md" onClick={() => setReviewModalOpen(false)}>
            <motion.div variants={modalContent} className="bg-white w-[480px] max-w-full rounded-[2rem] p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col relative outline-none" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-semibold text-[#121415] mb-2 tracking-tight">Rate your visit</h2>
              <p className="text-sm text-[#4A4E51] font-medium mb-8">Venue: <strong className="text-[#121415]">{venueName}</strong></p>
              <div className="flex gap-2 justify-center mb-8 shrink-0">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-full p-1 transition-transform active:scale-90">
                    <Star className={`w-10 h-10 transition-colors duration-300 ${star <= (hoverRating || rating) ? "fill-[#8A2532] text-[#8A2532]" : "fill-[#F5F5F4] text-[#DCDCDA] hover:text-[#8A2532]/50"}`} />
                  </button>
                ))}
              </div>
              <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="What did you love? (optional)" className="w-full h-32 max-h-64 p-4 bg-[#F5F5F4] border border-[#DCDCDA] rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-[#121415] focus:ring-4 focus:ring-[#121415]/5 resize-y mb-8 transition-all duration-300 text-[#121415] placeholder:text-[#4A4E51]" />
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button disabled={isReviewSubmitting} onClick={() => setReviewModalOpen(false)} className="flex-1 h-12 px-6 bg-white text-[#121415] border border-[#DCDCDA] rounded-full font-medium text-sm hover:bg-[#F5F5F4] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 shrink-0 whitespace-nowrap min-w-[120px]"><span className="truncate block">Cancel</span></button>
                <button disabled={isReviewSubmitting} onClick={async () => { if (rating === 0) { toast.error('Please select a rating'); return; } setIsReviewSubmitting(true); const supabase = createClient(); const { error } = await supabase.from('bookings').update({ rating, reviewText }).eq('id', bookingId); if (error) { toast.error('Failed to submit review'); } else { toast.success('Review submitted successfully'); setReviewModalOpen(false); router.refresh(); } setIsReviewSubmitting(false); }} className="flex-1 h-12 px-6 bg-[#8A2532] text-white rounded-full font-medium text-sm hover:bg-[#731E29] shadow-[0_8px_20px_rgba(138,37,50,0.2)] transition-all flex items-center justify-center active:scale-95 shrink-0 whitespace-nowrap min-w-[120px] disabled:opacity-50">
                  {isReviewSubmitting ? <Loader2 className="w-5 h-5 animate-spin shrink-0" /> : <span className="truncate block">Submit Review</span>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function AnimatedList({ children, className }: { children: React.ReactNode, className?: string }) {
  return <motion.div variants={staggerContainer} initial="hidden" animate="show" exit="hidden" className={className}>{children}</motion.div>;
}

export function AnimatedListItem({ children, className }: { children: React.ReactNode, className?: string }) {
  return <motion.div variants={fadeUp} className={className}>{children}</motion.div>;
}



export function FavoritesList({ initialVenues, currentUserId }: { initialVenues: any[], currentUserId: string }) {
  const [savedIds, setSavedIds] = React.useState<Set<string>>(new Set());
  
  React.useEffect(() => {
    const SAVED_KEY = `elara_saved_${currentUserId}`;
    const raw = localStorage.getItem(SAVED_KEY);
    setSavedIds(new Set(raw ? (JSON.parse(raw) as string[]) : []));
  }, [currentUserId]);

  const favoriteVenues = initialVenues.filter(v => savedIds.has(v.id));

  return (
    <AnimatedList className="space-y-4">
      {favoriteVenues.length > 0 ? favoriteVenues.map((venue) => (
        <AnimatedListItem key={venue.id}>
          <Link href="/booking" className="w-full text-left bg-white rounded-[2rem] p-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 flex items-center gap-5 active:scale-[0.98] group block outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
              <img src={venue.imageUrl || venue.image} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#121415] text-lg tracking-tight truncate group-hover:text-[#8A2532] transition-colors">{venue.name}</h3>
              <div className="flex items-center gap-2 text-sm text-[#4A4E51] font-medium mt-1 mb-2">
                <Star className="w-3.5 h-3.5 fill-[#8A2532] text-[#8A2532] shrink-0" />
                <span className="font-semibold text-[#121415] shrink-0">{venue.rating}</span>
                <span className="shrink-0">•</span>
                <span className="truncate">{venue.category}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#4A4E51]">
                <MapPin className="w-3.5 h-3.5 text-[#8A2532] shrink-0" />
                <span className="truncate">{venue.address}</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#F5F5F4] flex items-center justify-center shrink-0 group-hover:bg-[#121415] transition-colors hidden sm:flex">
              <ArrowRight className="w-4 h-4 text-[#4A4E51] group-hover:text-white transition-colors" />
            </div>
          </Link>
        </AnimatedListItem>
      )) : (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.04)]">
          <div className="w-16 h-16 bg-[#F5F5F4] rounded-2xl flex items-center justify-center mb-6 border border-[#DCDCDA] shrink-0">
            <Heart className="w-8 h-8 text-[#4A4E51]" />
          </div>
          <h3 className="text-xl font-semibold text-[#121415] mb-2 tracking-tight">No favorites yet</h3>
          <p className="text-[#4A4E51] font-medium mb-8 max-w-sm leading-relaxed">
            When you interact with venues or book services, they will appear right here.
          </p>
          <div className="mt-2 w-full flex justify-center">
            <Link href="/search" className="h-12 px-8 bg-[#121415] text-white rounded-full font-medium text-sm shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-[#1E2123] transition-all active:scale-95 inline-flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">Explore directory</Link>
          </div>
        </div>
      )}
    </AnimatedList>
  );
}

