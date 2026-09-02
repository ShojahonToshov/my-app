"use client";
import { useI18nStore } from "@/stores/i18nStore";
import { useI18n } from "@/hooks/useI18n";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import bookingService from "@/services/customer/BookingService";
import { Booking } from "@/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Scissors,
  CheckCircle2,
  MoreHorizontal,
  Navigation,
  PhoneCall,
  Info,
  CheckCircle,
  ArrowLeft,
  Star,
} from "lucide-react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { Button } from "@/components/ui/Button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const modalBackdrop = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalContent = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } },
};

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  isDestructive?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  isDestructive,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalBackdrop}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            variants={modalContent}
            className="bg-white w-[420px] max-w-full rounded-2xl p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col text-center outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 shrink-0 ${
                isDestructive
                  ? "bg-[#DC2626]/10 text-[#DC2626]"
                  : "bg-[#F5F5F4] text-[#121415]"
              }`}
            >
              <X className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold text-[#121415] mb-3 tracking-tight break-words">
              {title}
            </h2>
            <p className="text-sm text-[#4A4E51] font-medium mb-8 leading-relaxed break-words">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                onClick={onClose}
                variant="outline"
                shape="rounded"
                className="flex-1 h-12"
              >
                {cancelText}
              </Button>
              <Button
                onClick={onConfirm}
                variant={isDestructive ? "danger" : "secondary"}
                shape="rounded"
                className="flex-1 h-12"
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function LiveTicket() {
  const { t } = useI18n();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState<{
    venueName: string;
    venueCategory: string;
    serviceName: string;
    staffName: string;
    date: string;
    time: string;
    status: string;
    rating?: number | null;
    reviewText?: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Review states
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewInput, setReviewInput] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function fetchBooking() {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const rawData = await bookingService.getBookingById(id);
        if (rawData) {
          const data = rawData as Booking & {
            businesses?: { name?: string; category?: string };
            services?: { name?: string };
          };
          const delayMinutes = data.delay_minutes ?? data.delayMinutes ?? 0;
          let formattedTime = data.time || "";
          if (delayMinutes > 0 && formattedTime) {
            const parts = formattedTime.split(':');
            if (parts.length === 2) {
              const h = parseInt(parts[0], 10);
              const m = parseInt(parts[1], 10);
              if (!isNaN(h) && !isNaN(m)) {
                const total = h * 60 + m + delayMinutes;
                const newH = Math.floor(total / 60) % 24;
                const newM = total % 60;
                formattedTime = `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
              }
            }
          }

          setBookingData((prev) => {
             // Only update if something changed to avoid re-rendering
             return {
              venueName: data.businesses?.name || "Unknown Venue",
              venueCategory: data.businesses?.category || "Venue",
              serviceName: data.service_name || data.services?.name || data.serviceName || "Unknown Service",
              staffName: data.staff_name || data.staffName || "Any available",
              date: data.date || "",
              time: formattedTime,
              status: data.status || "pending",
              rating: data.rating,
              reviewText: data.reviewText,
             };
          });
          
          if (data.rating && reviewRating === 0) {
            setReviewRating(data.rating);
          }
          if (data.reviewText && reviewInput === "") {
            setReviewInput(data.reviewText);
          }
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
    interval = setInterval(fetchBooking, 3000); // Polling
    return () => clearInterval(interval);
  }, [id]);

  const handleReviewSubmit = async () => {
    if (!id || reviewRating === 0) return;
    setIsSubmittingReview(true);
    try {
      await bookingService.updateBooking(id, { 
        rating: reviewRating, 
        reviewText: reviewInput 
      });
      // Updating local state immediately for better UX
      setBookingData((prev) => prev ? { ...prev, rating: reviewRating, reviewText: reviewInput } : null);
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const isCompleted = bookingData?.status === t("extra.t387") || bookingData?.status === 'done';
  const hasReviewed = !!bookingData?.rating;

  useLockBodyScroll(isCancelModalOpen);

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#ECECEA]">
        <div className="w-8 h-8 rounded-full border-2 border-[#DCDCDA] border-t-[#121415] animate-spin" />
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#ECECEA] p-4 text-center">
        <h2 className="text-xl font-semibold mb-2">{t("extra.t51")}</h2>
        <Link href="/account" className="text-sm font-medium text-[#4A4E51] underline">{t("app.t29")}</Link>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans bg-[#ECECEA] text-[#121415] selection:bg-[#8A2532] selection:text-white relative overflow-hidden items-center justify-center p-4">
      {/* Navigation */}
      <Link
        href="/account"
        className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-[#4A4E51] hover:text-[#121415] font-medium text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-lg p-1 z-50"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" />
        <span className="truncate">{t("app.t29")}</span>
      </Link>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="w-full max-w-[420px] flex flex-col items-center z-10 pt-16 md:pt-0"
      >
        {/* Ticket Container */}
        <div className="bg-white rounded-[2.2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] p-2 w-full flex flex-col min-w-0">
          {/* Top Dark Card Section */}
          <div className={`text-white rounded-[1.8rem] p-8 text-center relative overflow-hidden shrink-0 transition-colors duration-500 ${
            (() => {
              const isCompleted = bookingData.status === t("extra.t387") || bookingData.status === 'done';
              const isInProgress = bookingData.status === 'in_progress';
              const today = new Date();
              const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
              const isToday = bookingData.date === todayStr;
              
              if (isCompleted) return 'bg-[#8A2532]'; // Matte red (brand) for finished
              if (isInProgress) return 'bg-[#4A6B53]'; // Matte green for in chair
              if (isToday) return 'bg-[#C89E23]'; // Premium matte sunflower yellow for waiting today
              return 'bg-[#121415]'; // Matte black for future
            })()
          }`}>
            <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[200%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none opacity-50" />

            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/70 mb-2 truncate">
                {(() => {
                  const isCompleted = bookingData.status === t("extra.t387") || bookingData.status === 'done';
                  if (isCompleted) return 'Completed at';
                  if (bookingData.status === 'in_progress') return 'Started at';
                  const today = new Date();
                  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                  if (bookingData.date === todayStr) return 'Arrive by';
                  return t("extra.t369");
                })()}
              </p>
              <h2 className="text-6xl sm:text-7xl font-semibold mb-6 tracking-tighter text-white truncate w-full">
                {bookingData.time}
              </h2>
              <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/5 backdrop-blur-md max-w-full">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white truncate">
                  {(() => {
                    const isCompleted = bookingData.status === t("extra.t387") || bookingData.status === 'done';
                    if (isCompleted) return 'All done';
                    if (bookingData.status === 'in_progress') return 'In chair';
                    const today = new Date();
                    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                    if (bookingData.date === todayStr) return 'Waiting in queue';
                    return 'Confirmed';
                  })()}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Info Section */}
          <div className="p-6 pt-8 pb-4 flex flex-col min-w-0 w-full">
            <div className="text-center mb-8 min-w-0 w-full flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A2532] bg-[#8A2532]/10 px-3 py-1 rounded-full mb-3 inline-flex">
                {bookingData.venueCategory}
              </span>
              <h1 className="text-xl font-semibold text-[#121415] tracking-tight leading-snug">
                {bookingData.venueName}
              </h1>
              <p className="text-sm font-medium text-[#4A4E51] mt-1 leading-relaxed">
                {bookingData.serviceName}
              </p>
            </div>

            {/* Info Badge */}
            <div className="p-4 rounded-2xl mb-8 text-center bg-[#F5F5F4] border border-[#DCDCDA]">
              <p className="text-xs font-medium text-[#121415] leading-relaxed flex items-center justify-center gap-2">
                <Info className="w-4 h-4 text-[#8A2532] shrink-0" />
                <span>
                  The professional will be available exactly on time. See you
                  soon!
                </span>
              </p>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-4 mb-10 px-1 shrink-0 w-full relative z-0">
              {(() => {
                const isCompleted = bookingData.status === t("extra.t387") || bookingData.status === 'done';
                const isInProgress = bookingData.status === 'in_progress';
                const today = new Date();
                const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                const isToday = bookingData.date === todayStr;
                
                const stateLevel = isCompleted ? 4 : isInProgress ? 3 : isToday ? 2 : 1;

                return (
                  <>
                    {/* Step 1: Upcoming */}
                    <div className="relative flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                        stateLevel > 1 
                          ? 'bg-[#121415] border-[#121415]' 
                          : stateLevel === 1 
                            ? 'bg-white border-[#121415] shadow-[0_0_12px_rgba(18,20,21,0.15)] animate-pulse' 
                            : 'bg-[#F5F5F4] border-[#DCDCDA]'
                      }`}>
                        {stateLevel > 1 ? <CheckCircle className="w-4 h-4 text-white" /> : <Calendar className={`w-4 h-4 ${stateLevel === 1 ? 'text-[#121415]' : 'text-[#DCDCDA]'}`} />}
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-widest truncate ${stateLevel >= 1 ? 'text-[#121415]' : 'text-[#787D80]'}`}>{t("app.t30")}</span>
                    </div>

                    {/* Step 2: Queue */}
                    <div className="relative flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                        stateLevel > 2 
                          ? 'bg-[#121415] border-[#121415]' 
                          : stateLevel === 2 
                            ? 'bg-white border-[#C89E23] shadow-[0_0_12px_rgba(200,158,35,0.15)] animate-pulse' 
                            : 'bg-[#F5F5F4] border-[#DCDCDA]'
                      }`}>
                        {stateLevel > 2 ? <CheckCircle className="w-4 h-4 text-white" /> : <MoreHorizontal className={`w-4 h-4 ${stateLevel === 2 ? 'text-[#C89E23]' : 'text-[#DCDCDA]'}`} />}
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-widest truncate ${stateLevel === 2 ? 'text-[#C89E23]' : stateLevel > 2 ? 'text-[#121415]' : 'text-[#787D80]'}`}>{t("app.t31")}</span>
                    </div>

                    {/* Step 3: In Chair */}
                    <div className="relative flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                        stateLevel > 3 
                          ? 'bg-[#121415] border-[#121415]' 
                          : stateLevel === 3 
                            ? 'bg-white border-[#4A6B53] shadow-[0_0_12px_rgba(74,107,83,0.15)] animate-pulse' 
                            : 'bg-[#F5F5F4] border-[#DCDCDA]'
                      }`}>
                        {stateLevel > 3 ? <CheckCircle className="w-4 h-4 text-white" /> : <Scissors className={`w-4 h-4 ${stateLevel === 3 ? 'text-[#4A6B53]' : 'text-[#DCDCDA]'}`} />}
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-widest truncate ${stateLevel === 3 ? 'text-[#4A6B53]' : stateLevel > 3 ? 'text-[#121415]' : 'text-[#787D80]'}`}>{t("app.t32")}</span>
                    </div>

                    {/* Step 4: Completed */}
                    <div className="relative flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                        stateLevel === 4 
                          ? 'bg-white border-[#8A2532] shadow-[0_0_12px_rgba(138,37,50,0.15)] animate-pulse' 
                          : 'bg-[#F5F5F4] border-[#DCDCDA]'
                      }`}>
                        <CheckCircle2 className={`w-4 h-4 ${stateLevel === 4 ? 'text-[#8A2532]' : 'text-[#DCDCDA]'}`} />
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-widest truncate ${stateLevel === 4 ? 'text-[#8A2532]' : 'text-[#787D80]'}`}>{t("app.t33")}</span>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Details */}
            <div className="space-y-4 mb-8 bg-[#F5F5F4] p-5 rounded-2xl border border-[#DCDCDA] flex flex-col min-w-0 w-full">
              <div className="flex items-center justify-between gap-4 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A4E51] shrink-0">{t("app.t21")}</span>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-white border border-[#DCDCDA] flex items-center justify-center text-[10px] font-bold text-[#121415] shrink-0">
                    {bookingData.staffName.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-[#121415] truncate">
                    {bookingData.staffName}
                  </span>
                </div>
              </div>

              <div className="w-full h-px bg-[#DCDCDA] shrink-0" />

              <div className="flex items-center justify-between gap-4 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A4E51] shrink-0">{t("app.t34")}</span>
                <span className="text-sm font-semibold text-[#121415] flex items-center gap-1.5 truncate">
                  <Calendar className="w-4 h-4 text-[#4A4E51] shrink-0" />
                  <span className="truncate">{bookingData.date}</span>
                </span>
              </div>
            </div>

            {/* Layout Actions or Review UI */}
            {isCompleted ? (
              <div className="flex flex-col items-center p-5 bg-[#F5F5F4] rounded-2xl border border-[#DCDCDA] w-full">
                <h3 className="text-sm font-semibold text-[#121415] mb-4 text-center">
                  {hasReviewed ? t("extra.t388") : t("extra.t389")}
                </h3>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      disabled={hasReviewed || isSubmittingReview}
                      onClick={() => setReviewRating(star)}
                      className={`p-1 transition-all ${
                        (reviewRating >= star) ? "text-[#C89E23]" : "text-[#DCDCDA]"
                      } hover:scale-110 focus:outline-none`}
                    >
                      <Star className={`w-8 h-8 ${(reviewRating >= star) ? "fill-[#C89E23]" : ""}`} />
                    </button>
                  ))}
                </div>

                {!hasReviewed ? (
                  <div className="w-full flex flex-col gap-3">
                    <textarea
                      value={reviewInput}
                      onChange={(e) => setReviewInput(e.target.value)}
                      placeholder={t("extra.t52")}
                      disabled={isSubmittingReview}
                      className="w-full min-h-[80px] p-3 text-sm rounded-xl border border-[#DCDCDA] bg-white text-[#121415] placeholder:text-[#A0A4A8] focus:outline-none focus:ring-2 focus:ring-[#121415] resize-none"
                    />
                    <Button
                      onClick={handleReviewSubmit}
                      disabled={isSubmittingReview || reviewRating === 0}
                      variant="secondary"
                      shape="rounded"
                      className="w-full h-12"
                    >
                      {isSubmittingReview ? t("extra.t390") : "Submit Review"}
                    </Button>
                  </div>
                ) : (
                  bookingData.reviewText && (
                    <div className="w-full p-4 bg-white rounded-xl border border-[#DCDCDA] mt-2">
                      <p className="text-sm text-[#4A4E51] italic text-center">
                        "{bookingData.reviewText}"
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3 shrink-0">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" shape="rounded" icon={Navigation} className="h-12 w-full text-sm">{t("app.t35")}</Button>
                  <Button variant="outline" shape="rounded" icon={PhoneCall} className="h-12 w-full text-sm">{t("app.t36")}</Button>
                </div>

                <Button
                  onClick={() => setIsCancelModalOpen(true)}
                  variant="ghost"
                  shape="rounded"
                  className="h-12 w-full text-xs font-bold uppercase tracking-widest text-[#4A4E51] hover:text-[#DC2626] hover:bg-[#DC2626]/5"
                >{t("app.t37")}</Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={() => setIsCancelModalOpen(false)}
        title={t("extra.t109")}
        description="Canceling in advance helps professionals manage their time and maintains your reliability karma."
        confirmText={t("extra.t391")}
        cancelText={t("extra.t392")}
        isDestructive={true}
      />
    </div>
  );
}
