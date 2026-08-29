"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Briefcase, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useI18n } from "@/hooks/useI18n";

export interface SignupRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupRoleModal({ isOpen, onClose }: SignupRoleModalProps) {
    const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  useLockBodyScroll(isOpen);

  const handleSelect = (role: string) => {
    onClose();
    const redirectParam = searchParams.get("redirect");
    const redirectQuery = redirectParam ? `&redirect=${encodeURIComponent(redirectParam)}` : "";
    router.push(`/signup?role=${role}${redirectQuery}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#121415]/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden p-6 md:p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-[#4A4E51] hover:text-[#121415] hover:bg-[#F5F5F4] rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8 mt-2">
              <h2 className="text-2xl font-semibold text-[#121415] tracking-tight mb-2">
                {t("extra.t402")}</h2>
              <p className="text-sm text-[#4A4E51] font-medium">
                {t("extra.t403")}</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleSelect("customer")}
                className="w-full group flex items-start gap-4 p-4 rounded-2xl border border-[#DCDCDA] hover:border-[#121415] hover:bg-[#F5F5F4] transition-all text-left outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
              >
                <div className="w-12 h-12 rounded-full bg-[#ECECEA] group-hover:bg-white flex items-center justify-center shrink-0 transition-colors">
                  <User className="w-6 h-6 text-[#121415]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[#121415] mb-1">
                    {t("extra.t404")}</h3>
                  <p className="text-sm text-[#4A4E51] font-medium leading-relaxed">
                    {t("extra.t405")}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#DCDCDA] group-hover:text-[#121415] self-center transition-colors shrink-0" />
              </button>

              <button
                onClick={() => handleSelect("business")}
                className="w-full group flex items-start gap-4 p-4 rounded-2xl border border-[#DCDCDA] hover:border-[#8A2532] hover:bg-[#8A2532]/5 transition-all text-left outline-none focus-visible:ring-2 focus-visible:ring-[#8A2532]"
              >
                <div className="w-12 h-12 rounded-full bg-[#ECECEA] group-hover:bg-white flex items-center justify-center shrink-0 transition-colors">
                  <Briefcase className="w-6 h-6 text-[#8A2532]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[#8A2532] mb-1">
                    {t("extra.t406")}</h3>
                  <p className="text-sm text-[#4A4E51] font-medium leading-relaxed">
                    {t("extra.t407")}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#DCDCDA] group-hover:text-[#8A2532] self-center transition-colors shrink-0" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
