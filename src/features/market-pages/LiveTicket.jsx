"use client";
import React, { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
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
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } },
};

const ConfirmModal = ({
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
            className="bg-white w-[420px] max-w-full rounded-[2rem] p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col text-center outline-none"
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
              <button
                onClick={onClose}
                className="flex-1 h-12 px-6 bg-white text-[#121415] border border-[#DCDCDA] rounded-full font-medium text-sm hover:bg-[#F5F5F4] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 shrink-0 whitespace-nowrap min-w-[120px] outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
              >
                <span className="truncate block">{cancelText}</span>
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 h-12 px-6 rounded-full font-medium text-sm text-white transition-all shadow-[0_8px_20px_rgba(0,0,0,0.08)] active:scale-95 shrink-0 whitespace-nowrap min-w-[120px] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  isDestructive
                    ? "bg-[#DC2626] hover:bg-[#B91C1C] shadow-[0_8px_20px_rgba(220,38,38,0.2)] focus-visible:ring-[#DC2626]"
                    : "bg-[#121415] hover:bg-[#1E2123] focus-visible:ring-[#121415]"
                }`}
              >
                <span className="truncate block">{confirmText}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function LiveTicket() {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const bookingData = {
    venueName: "Chop-Chop Barbershop",
    serviceName: "Haircut & Beard",
    masterName: "Ali Ahmedov",
    date: "24.07.2026",
    time: "14:30",
  };

  useLockBodyScroll(isCancelModalOpen);

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans bg-[#ECECEA] text-[#121415] selection:bg-[#8A2532] selection:text-white relative overflow-hidden items-center justify-center p-4">
      {/* Navigation */}
      <Link
        href="/account"
        className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-[#4A4E51] hover:text-[#121415] font-medium text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-lg p-1 z-50"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" />
        <span className="truncate">Back to profile</span>
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
          <div className="bg-[#121415] text-white rounded-[1.8rem] p-8 text-center relative overflow-hidden shrink-0">
            <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[200%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none opacity-50" />

            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#8B9194] mb-2 truncate">
                Arrive by
              </p>
              <h2 className="text-6xl sm:text-7xl font-semibold mb-6 tracking-tighter text-white truncate w-full">
                {bookingData.time}
              </h2>
              <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/5 backdrop-blur-md max-w-full">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white truncate">
                  On schedule
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Info Section */}
          <div className="p-6 pt-8 pb-4 flex flex-col min-w-0 w-full">
            <div className="text-center mb-8 min-w-0 w-full">
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
            <div className="grid grid-cols-3 mb-10 px-2 shrink-0 w-full relative z-0">

              <div className="relative flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#121415] shadow-sm shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-[9px] font-bold text-[#121415] uppercase tracking-widest truncate">
                  Booked
                </span>
              </div>

              <div className="relative flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white border-[#8A2532] shadow-[0_0_12px_rgba(138,37,50,0.15)] animate-pulse shrink-0">
                  <MoreHorizontal className="w-4 h-4 text-[#8A2532]" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#8A2532] truncate">
                  Waiting
                </span>
              </div>

              <div className="relative flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 bg-[#F5F5F4] border-[#DCDCDA] shrink-0">
                  <Scissors className="w-4 h-4 text-[#DCDCDA]" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#787D80] truncate">
                  In chair
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4 mb-8 bg-[#F5F5F4] p-5 rounded-2xl border border-[#DCDCDA] flex flex-col min-w-0 w-full">
              <div className="flex items-center justify-between gap-4 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A4E51] shrink-0">
                  Professional
                </span>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-white border border-[#DCDCDA] flex items-center justify-center text-[10px] font-bold text-[#121415] shrink-0">
                    {bookingData.masterName.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-[#121415] truncate">
                    {bookingData.masterName}
                  </span>
                </div>
              </div>

              <div className="w-full h-px bg-[#DCDCDA] shrink-0" />

              <div className="flex items-center justify-between gap-4 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A4E51] shrink-0">
                  Date
                </span>
                <span className="text-sm font-semibold text-[#121415] flex items-center gap-1.5 truncate">
                  <Calendar className="w-4 h-4 text-[#4A4E51] shrink-0" />
                  <span className="truncate">{bookingData.date}</span>
                </span>
              </div>
            </div>

            {/* Layout Actions */}
            <div className="flex flex-col gap-3 shrink-0">
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 h-12 bg-white border border-[#DCDCDA] rounded-full font-medium text-sm text-[#121415] hover:bg-[#F5F5F4] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 min-w-0 px-2 outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                  <Navigation className="w-4 h-4 text-[#121415] shrink-0" />
                  <span className="truncate">Directions</span>
                </button>
                <button className="flex items-center justify-center gap-2 h-12 bg-white border border-[#DCDCDA] rounded-full font-medium text-sm text-[#121415] hover:bg-[#F5F5F4] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 min-w-0 px-2 outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                  <PhoneCall className="w-4 h-4 text-[#121415] shrink-0" />
                  <span className="truncate">Contact</span>
                </button>
              </div>

              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="flex items-center justify-center w-full h-12 rounded-full text-xs font-bold uppercase tracking-widest text-[#4A4E51] hover:text-[#DC2626] hover:bg-[#DC2626]/5 transition-colors active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
              >
                Cancel booking
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={() => setIsCancelModalOpen(false)}
        title="Cancel visit?"
        description="Canceling in advance helps professionals manage their time and maintains your reliability karma."
        confirmText="Yes, cancel"
        cancelText="Keep booking"
        isDestructive={true}
      />
    </div>
  );
}