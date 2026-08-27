"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ChevronRight, Play } from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";

const customFont = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function ButtonShowcasePage() {
  return (
    <div className={`min-h-screen bg-[#D8DADC] text-[#0B0C0D] ${customFont.className} p-10 md:p-20 flex flex-col gap-32`}>
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Button Interaction Sandbox</h1>
        <p className="text-[#25282B] text-lg">
          Здесь собраны 5 топовых концепций hover-анимаций для кнопок. Все они соответствуют премиальному дизайну, но предлагают разный пользовательский опыт (UX).
        </p>
      </div>

      {/* VARIANT 1: ELASTIC TACTILE */}
      <section className="flex flex-col gap-8">
        <div className="border-b border-[#8D9195]/20 pb-4">
          <h2 className="text-2xl font-bold">1. Elastic Tactile (Apple / iOS Style)</h2>
          <p className="text-[#25282B]">Максимально физические кнопки. Сильно пружинят при наведении и нажатии. Идеально для мобилок и планшетов.</p>
        </div>
        
        <div className="flex flex-wrap gap-8 items-center bg-[#F3F4F4] p-10 rounded-3xl border border-white shadow-sm">
          {/* Primary */}
          <motion.button 
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="px-8 py-3.5 bg-[#151719] text-white text-[15px] font-bold rounded-full shadow-lg shadow-[#151719]/10"
          >
            Sign up
          </motion.button>

          {/* Secondary */}
          <motion.button 
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="px-8 py-3.5 bg-white text-[#0B0C0D] border border-[#8D9195]/20 text-[15px] font-bold rounded-full shadow-sm"
          >
            Log in
          </motion.button>

          {/* Hero Ghost */}
          <div className="bg-[#151719] p-6 rounded-2xl flex gap-6 items-center">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="px-8 py-3.5 bg-white/10 border border-white/20 text-white text-[15px] font-bold rounded-full backdrop-blur-md"
            >
              View Live Demo
            </motion.button>
          </div>
        </div>
      </section>


      {/* VARIANT 2: DEEP LIFT 3D */}
      <section className="flex flex-col gap-8">
        <div className="border-b border-[#8D9195]/20 pb-4">
          <h2 className="text-2xl font-bold">2. Deep Lift 3D (Stripe / Vercel Style)</h2>
          <p className="text-[#25282B]">При наведении кнопка «взлетает» над страницей и отбрасывает мягкую, глубокую тень. При клике продавливается вниз.</p>
        </div>
        
        <div className="flex flex-wrap gap-8 items-center bg-[#F3F4F4] p-10 rounded-3xl border border-white shadow-sm">
          {/* Primary */}
          <motion.button 
            whileHover={{ y: -4, boxShadow: "0 20px 40px -10px rgba(21,23,25,0.4)" }}
            whileTap={{ y: 2, boxShadow: "0 0px 0px 0px rgba(21,23,25,0)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="px-8 py-3.5 bg-[#151719] text-white text-[15px] font-bold rounded-full"
          >
            Sign up
          </motion.button>

          {/* Secondary */}
          <motion.button 
            whileHover={{ y: -4, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
            whileTap={{ y: 2, boxShadow: "0 0px 0px 0px rgba(0,0,0,0)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="px-8 py-3.5 bg-white text-[#0B0C0D] border border-[#8D9195]/20 text-[15px] font-bold rounded-full"
          >
            Log in
          </motion.button>

          {/* Hero Ghost */}
          <div className="bg-[#151719] p-6 rounded-2xl flex gap-6 items-center">
            <motion.button 
              whileHover={{ y: -4, boxShadow: "0 20px 40px -10px rgba(255,255,255,0.15)" }}
              whileTap={{ y: 2, boxShadow: "0 0px 0px 0px rgba(255,255,255,0)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="px-8 py-3.5 bg-white/10 border border-white/20 text-white text-[15px] font-bold rounded-full backdrop-blur-md"
            >
              View Live Demo
            </motion.button>
          </div>
        </div>
      </section>


      {/* VARIANT 3: ICON REVEAL */}
      <section className="flex flex-col gap-8">
        <div className="border-b border-[#8D9195]/20 pb-4">
          <h2 className="text-2xl font-bold">3. Icon Reveal (Raycast Style)</h2>
          <p className="text-[#25282B]">Очень элегантный микро-интеракшн: при наведении текст сдвигается, и плавно выезжает иконка-стрелка. Выглядит сверхтехнологично.</p>
        </div>
        
        <div className="flex flex-wrap gap-8 items-center bg-[#F3F4F4] p-10 rounded-3xl border border-white shadow-sm">
          {/* Primary */}
          <motion.button 
            whileTap={{ scale: 0.96 }}
            className="h-12 w-32 bg-[#151719] text-white text-[15px] font-bold rounded-full overflow-hidden relative group"
          >
            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-x-3">Sign up</span>
            <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
          </motion.button>

          {/* Secondary */}
          <motion.button 
            whileTap={{ scale: 0.96 }}
            className="h-12 w-32 bg-white text-[#0B0C0D] border border-[#8D9195]/20 text-[15px] font-bold rounded-full overflow-hidden relative group"
          >
            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-x-3">Log in</span>
            <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-[#8D9195]" />
          </motion.button>

          {/* Hero Outline */}
          <div className="bg-[#151719] p-6 rounded-2xl flex gap-6 items-center">
            <motion.button 
              whileTap={{ scale: 0.96 }}
              className="h-14 px-8 bg-transparent border border-white/30 text-white text-[15px] font-bold rounded-full overflow-hidden relative group hover:bg-white hover:text-[#151719] transition-colors duration-300"
            >
              <span className="relative z-10 flex items-center gap-2 transition-transform duration-300 group-hover:-translate-x-2">
                Explore Features
              </span>
              <ArrowRight className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
            </motion.button>
          </div>
        </div>
      </section>


      {/* VARIANT 4: MAGNETIC GLOW */}
      <section className="flex flex-col gap-8">
        <div className="border-b border-[#8D9195]/20 pb-4">
          <h2 className="text-2xl font-bold">4. Magnetic Glow (Web3 / AI Style)</h2>
          <p className="text-[#25282B]">При наведении вокруг кнопки разгорается мягкое свечение. Круто привлекает внимание к CTA (Call to action).</p>
        </div>
        
        <div className="flex flex-wrap gap-8 items-center bg-[#F3F4F4] p-10 rounded-3xl border border-white shadow-sm">
          {/* Primary */}
          <div className="relative group">
            <div className="absolute inset-0 bg-[#151719] rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="relative px-8 py-3.5 bg-[#151719] text-white text-[15px] font-bold rounded-full group-hover:bg-[#25282B] transition-colors duration-300"
            >
              Create an Account
            </motion.button>
          </div>

          {/* Secondary */}
          <div className="relative group">
            <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="relative px-8 py-3.5 bg-white text-[#0B0C0D] border border-[#8D9195]/20 text-[15px] font-bold rounded-full group-hover:border-[#0B0C0D]/50 transition-colors duration-300"
            >
              Contact Sales
            </motion.button>
          </div>
        </div>
      </section>


      {/* VARIANT 5: SWIPE FILL */}
      <section className="flex flex-col gap-8">
        <div className="border-b border-[#8D9195]/20 pb-4">
          <h2 className="text-2xl font-bold">5. Swipe Fill (Editorial / High Fashion Style)</h2>
          <p className="text-[#25282B]">Стильная, резкая анимация заливки фона слева направо. Часто используется в топовых дизайн-студиях.</p>
        </div>
        
        <div className="flex flex-wrap gap-8 items-center bg-[#F3F4F4] p-10 rounded-3xl border border-white shadow-sm">
          {/* Primary */}
          <motion.button 
            whileTap={{ scale: 0.96 }}
            className="px-8 py-3.5 bg-[#151719] text-white text-[15px] font-bold rounded-full overflow-hidden relative group"
          >
            <div className="absolute inset-0 w-full h-full bg-[#393E41] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            <span className="relative z-10">Sign up</span>
          </motion.button>

          {/* Secondary */}
          <motion.button 
            whileTap={{ scale: 0.96 }}
            className="px-8 py-3.5 bg-transparent border border-[#0B0C0D] text-[#0B0C0D] text-[15px] font-bold rounded-full overflow-hidden relative group"
          >
            <div className="absolute inset-0 w-full h-full bg-[#0B0C0D] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            <span className="relative z-10 group-hover:text-white transition-colors duration-300 delay-100">Log in</span>
          </motion.button>

          {/* Hero Outline */}
          <div className="bg-[#151719] p-6 rounded-2xl flex gap-6 items-center">
            <motion.button 
              whileTap={{ scale: 0.96 }}
              className="px-8 py-3.5 bg-transparent border border-white text-white text-[15px] font-bold rounded-full overflow-hidden relative group"
            >
              <div className="absolute inset-0 w-full h-full bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              <span className="relative z-10 group-hover:text-[#151719] transition-colors duration-300 delay-100">Explore Features</span>
            </motion.button>
          </div>
        </div>
      </section>

    </div>
  );
}
