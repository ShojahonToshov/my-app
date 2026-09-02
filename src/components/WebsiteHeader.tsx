"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AdaptedLogo } from "@/components/AdaptedLogo";
import { useI18n } from "@/hooks/useI18n";
import SignupRoleModal from "@/components/SignupRoleModal";

import { usePathname } from "next/navigation";

export function WebsiteHeader() {
  const pathname = usePathname();
  const { t } = useI18n();

  if (pathname === "/designsearch") return null;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("platform");

  return (
    <>
      <SignupRoleModal isOpen={roleModalOpen} onClose={() => setRoleModalOpen(false)} />
      <div className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 md:px-6 pointer-events-none">
      <nav className="bg-[#F3F4F4]/85 backdrop-blur-2xl border border-white/60 rounded-full p-2 h-[76px] flex items-center justify-between w-full max-w-[1352px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] pointer-events-auto transition-all relative">
        <div className="flex-1 flex justify-start pl-4">
          <Link href="/" className="outline-none rounded-full group">
            <AdaptedLogo />
          </Link>
        </div>
        <div className="hidden md:flex items-center bg-[#D8DADC]/80 p-1.5 rounded-full border border-white/40 shadow-[inset_0_1px_4px_rgba(0,0,0,0.04)] relative">
          {[
            { id: "platform", label: t("extra.t426") },
            { id: "faq", label: "FAQ" },
            { id: "cta", label: "Get Started" },
          ].map((tab) => (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              onClick={() => setActiveSection(tab.id)}
              className={`relative px-6 py-2.5 text-[14px] font-bold rounded-full transition-colors duration-300 z-10 ${
                activeSection === tab.id ? "text-[#0B0C0D]" : "text-[#25282B] hover:text-[#0B0C0D]"
              }`}
            >
              {activeSection === tab.id && (
                <motion.div
                  layoutId="activeNavPill"
                  className="absolute inset-0 bg-white rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-white/60 -z-10"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-20">{tab.label}</span>
            </a>
          ))}
        </div>
        <div className="flex-1 flex justify-end pr-2">
          <div className="hidden md:flex items-center gap-3">
            <motion.a 
              href="/designlogin" 
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="px-6 py-3 text-[14px] font-bold tracking-wide text-[#0B0C0D] bg-white border border-[#8D9195]/20 text-center rounded-full shadow-sm cursor-pointer"
            >{t("extra.t106")}</motion.a>
            <motion.button 
              onClick={() => setRoleModalOpen(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="px-8 py-3 bg-[#151719] text-white text-[14px] font-bold tracking-wide rounded-full shadow-lg shadow-[#151719]/10 block"
            >{t("extra.t130")}</motion.button>
          </div>
          <button 
            className="md:hidden p-3 rounded-full hover:bg-[#8D9195]/10 transition-colors mr-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#0B0C0D]" /> : <Menu className="w-6 h-6 text-[#0B0C0D]" />}
          </button>
        </div>
      </nav>
    </div>
    </>
  );
}
