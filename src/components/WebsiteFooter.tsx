"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AdaptedLogo } from "@/components/AdaptedLogo";
import { useI18n } from "@/hooks/useI18n";

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function WebsiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="bg-[#F3F4F4] border-t border-white shadow-[0_-10px_40px_rgba(0,0,0,0.02)] pt-20 pb-10 px-6 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 lg:gap-24 mb-20">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="flex flex-col items-start max-w-sm"
        >
          <AdaptedLogo />
          <p className="text-[14px] font-medium leading-relaxed text-[#8D9195] mt-6 mb-8">
            The premium destination for discovering and booking top-tier
            services in your city. Elevating the standard of appointment
            management.
          </p>
          <div className="flex items-center gap-4">
            <motion.a 
              href="#"
              whileHover={{ scale: 1.1, backgroundColor: "#0B0C0D", color: "#ffffff", borderColor: "#0B0C0D" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#25282B] shadow-sm border border-[#8D9195]/15 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </motion.a>
            <motion.a 
              href="#"
              whileHover={{ scale: 1.1, backgroundColor: "#0B0C0D", color: "#ffffff", borderColor: "#0B0C0D" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#25282B] shadow-sm border border-[#8D9195]/15 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </motion.a>
            <motion.a 
              href="#"
              whileHover={{ scale: 1.1, backgroundColor: "#0B0C0D", color: "#ffffff", borderColor: "#0B0C0D" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#25282B] shadow-sm border border-[#8D9195]/15 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </motion.a>
          </div>
        </motion.div>

        <div className="flex flex-wrap md:flex-nowrap gap-16 lg:gap-24 md:pr-4">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
            className="pt-2 md:pt-[10px]"
          >
            <h4 className="font-bold text-[16px] tracking-tight mb-6 bg-gradient-to-b from-black to-black/40 bg-clip-text text-transparent pb-1">
              {t("extra.t426")}</h4>
            <ul className="space-y-4 text-[14px] font-bold text-[#8D9195]">
              <li>
                <Link href="/search" className="hover:text-[#0B0C0D] transition-colors duration-200 outline-none rounded">
                  {t("app.t0")}</Link>
              </li>
              <li>
                <Link href="/designlogin" className="hover:text-[#0B0C0D] transition-colors duration-200 outline-none rounded">{t("extra.t106")}</Link>
              </li>
              <li>
                <Link href="/designsignup" className="hover:text-[#0B0C0D] transition-colors duration-200 outline-none rounded text-left block">{t("extra.t130")}</Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
            className="pt-2 md:pt-[10px]"
          >
            <h4 className="font-bold text-[16px] tracking-tight mb-6 bg-gradient-to-b from-black to-black/40 bg-clip-text text-transparent pb-1">
              {t("extra.t452")}</h4>
            <ul className="space-y-4 text-[14px] font-bold text-[#8D9195]">
              <li>
                <a href="#" className="hover:text-[#0B0C0D] transition-colors duration-200 outline-none rounded">
                  {t("extra.t453")}</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0B0C0D] transition-colors duration-200 outline-none rounded">
                  {t("extra.t454")}</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0B0C0D] transition-colors duration-200 outline-none rounded">
                  {t("extra.t455")}</a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: smoothEase }}
            className="pt-2 md:pt-[10px]"
          >
            <h4 className="font-bold text-[16px] tracking-tight mb-6 bg-gradient-to-b from-black to-black/40 bg-clip-text text-transparent pb-1">
              {t("extra.t456")}</h4>
            <ul className="space-y-4 text-[14px] font-bold text-[#8D9195]">
              <li>
                <a href="#" className="hover:text-[#0B0C0D] transition-colors duration-200 outline-none rounded">{t("extra.t326")}</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0B0C0D] transition-colors duration-200 outline-none rounded">
                  {t("extra.t457")}</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0B0C0D] transition-colors duration-200 outline-none rounded">
                  {t("app.t36")}</a>
              </li>
            </ul>
          </motion.div>

        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4, ease: smoothEase }}
        className="max-w-7xl mx-auto pt-8 border-t border-[#8D9195]/20 flex flex-col md:flex-row items-center justify-between text-[13px] font-bold text-[#8D9195] gap-4"
      >
        <p>c {new Date().getFullYear()} {t("extra.t458")}</p>
        <div className="flex gap-8">
          <Link href="/privacy" className="hover:text-[#0B0C0D] transition-colors">{t("extra.t259")}</Link>
          <Link href="/terms" className="hover:text-[#0B0C0D] transition-colors">{t("extra.t192")}</Link>
        </div>
      </motion.div>
    </footer>
  );
}
