"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Briefcase, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useI18n } from "@/hooks/useI18n";
import { Outfit } from "next/font/google";

const customFont = Outfit({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

export interface SignupRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupRoleModal({ isOpen, onClose }: SignupRoleModalProps) {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  useLockBodyScroll(isOpen);

  const handleSelect = (role: string) => {
    onClose();
    const redirectParam = searchParams.get("redirect");
    const redirectQuery = redirectParam ? `&redirect=${encodeURIComponent(redirectParam)}` : "";
    
    if (pathname && pathname.startsWith('/design')) {
      router.push(`/designsignup?role=${role}${redirectQuery}`);
    } else {
      router.push(`/signup?role=${role}${redirectQuery}`);
    }
  };

  const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0B0C0D]/20 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.6, ease: smoothEase }}
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[460px] bg-white/80 backdrop-blur-3xl rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white z-[101] overflow-hidden p-8 sm:p-10 ${customFont.className}`}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-[#8D9195] hover:text-[#0B0C0D] hover:bg-[#F3F4F4] rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0B0C0D]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8 mt-2">
              <h2 className="text-3xl font-bold tracking-tight text-[#0B0C0D] mb-3">
                {t("extra.t402") || "Join Elara"}
              </h2>
              <p className="text-[15px] text-[#8D9195] font-medium">
                {t("extra.t403") || "How would you like to use our platform?"}
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleSelect("customer")}
                className="w-full group flex items-start gap-4 p-4 rounded-xl border-2 border-[#8D9195]/20 hover:border-[#0B0C0D] hover:bg-white hover:shadow-[0_4px_20px_-10px_rgba(11,12,13,0.1)] transition-all text-left outline-none focus-visible:ring-2 focus-visible:ring-[#0B0C0D] bg-[#F3F4F4]"
              >
                <div className="w-12 h-12 rounded-full bg-white group-hover:bg-[#151719] flex items-center justify-center shrink-0 transition-colors border border-[#8D9195]/10 group-hover:border-transparent">
                  <User className="w-6 h-6 text-[#0B0C0D] group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 self-center">
                  <h3 className="text-[16px] font-bold text-[#0B0C0D] mb-0.5">
                    {t("extra.t404") || "As a Customer"}
                  </h3>
                  <p className="text-[14px] text-[#8D9195] font-medium leading-snug">
                    {t("extra.t405") || "Book appointments and manage your schedule."}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#8D9195] group-hover:text-[#0B0C0D] self-center transition-colors shrink-0" />
              </button>

              <button
                onClick={() => handleSelect("business")}
                className="w-full group flex items-start gap-4 p-4 rounded-xl border-2 border-[#8D9195]/20 hover:border-[#0B0C0D] hover:bg-white hover:shadow-[0_4px_20px_-10px_rgba(11,12,13,0.1)] transition-all text-left outline-none focus-visible:ring-2 focus-visible:ring-[#0B0C0D] bg-[#F3F4F4]"
              >
                <div className="w-12 h-12 rounded-full bg-white group-hover:bg-[#151719] flex items-center justify-center shrink-0 transition-colors border border-[#8D9195]/10 group-hover:border-transparent">
                  <Briefcase className="w-6 h-6 text-[#0B0C0D] group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 self-center">
                  <h3 className="text-[16px] font-bold text-[#0B0C0D] mb-0.5">
                    {t("extra.t406") || "As a Business"}
                  </h3>
                  <p className="text-[14px] text-[#8D9195] font-medium leading-snug">
                    {t("extra.t407") || "Manage bookings, staff, and grow your presence."}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#8D9195] group-hover:text-[#0B0C0D] self-center transition-colors shrink-0" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
