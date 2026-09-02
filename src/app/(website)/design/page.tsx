"use client";
import { useI18n } from "@/hooks/useI18n";
import { useI18nStore } from "@/stores/i18nStore";


import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Outfit } from "next/font/google";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  LayoutDashboard,
  Navigation,
  ShieldCheck,
  Play,
  Menu,
  X,
  QrCode,
  Ticket,
  ChevronDown
} from "lucide-react";
import Link from "next/link";

const customFont = Outfit({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

// Extremely smooth easing curve
const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];


const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};


// Reusable FAQ Item Component with enhanced Framer Motion
function FaqItem({ question, answer, delay }: { question: string; answer: string; delay: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "50px" }}
      transition={{ duration: 0.8, delay, ease: smoothEase }}
      className="border-b border-[#8D9195]/20 py-7 group"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left outline-none"
      >
        <span className="text-[#0B0C0D] font-bold text-lg md:text-xl tracking-tight group-hover:text-[#151719]/70 transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0, backgroundColor: isOpen ? "#E5E7E8" : "transparent" }}
          transition={{ duration: 0.4, ease: smoothEase }}
          className="shrink-0 ml-4 p-2 rounded-full"
        >
          <ChevronDown className="w-6 h-6 text-[#25282B]" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: smoothEase }}
            className="overflow-hidden will-change-[height,opacity]"
          >
            <motion.p 
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: -10 }}
              transition={{ duration: 0.4, ease: smoothEase }}
              className="pt-5 text-[#25282B] text-lg font-medium leading-normal tracking-wide max-w-3xl"
            >
              {answer}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function DesignConceptPage() {
  const { t } = useI18n();

  const [mounted, setMounted] = useState(false);
  
  // Parallax Hooks
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  
  const mockupY = useTransform(scrollY, [0, 1000], [0, -150]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`min-h-screen bg-[#D8DADC] text-[#0B0C0D] ${customFont.className} selection:bg-[#151719] selection:text-white flex flex-col relative`}>
      
      {/* GLOBAL NOISE */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.02]"
        style={{ backgroundImage: `url("data:image/png;base64,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")`, backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }}
      />

      <main className="flex-1 w-full">
        
        {/* PARALLAX HERO SECTION */}
        <section className="relative w-full bg-[#151719] flex flex-col items-center pt-32 md:pt-48 px-6 overflow-hidden z-10 border-b border-[#8D9195]/20">
          
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
          />
          
          <motion.div 
            style={{ y: heroY, background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, transparent 70%)" }}
            className="absolute top-[40%] left-[50%] -translate-x-[60%] -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] pointer-events-none will-change-transform" 
          />
          <motion.div 
            style={{ y: heroY, background: "radial-gradient(circle at center, rgba(168, 85, 247, 0.10) 0%, transparent 70%)" }}
            className="absolute top-[60%] left-[50%] -translate-x-[40%] -translate-y-1/2 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] pointer-events-none will-change-transform" 
          />
          
          <motion.div 
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center"
          >
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: smoothEase }}
              className="text-6xl md:text-8xl lg:text-[7.5rem] font-bold tracking-tight leading-[1.05] mb-8 flex flex-col"
            >
              <span className="text-white relative z-10">
                {t("extra.t427")}
              </span>
              <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent relative z-0 pb-2 mt-1 md:mt-2">
                {t("extra.t428")}
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.15, ease: smoothEase }}
              className="text-lg md:text-2xl text-white/50 max-w-3xl font-medium leading-normal tracking-wide mb-14"
            >
              {t("extra.t429")}</motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: smoothEase }}
              className="flex flex-col sm:flex-row items-center gap-5 w-full justify-center relative z-20"
            >
              <motion.a 
                href="/search"
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
                className="h-16 px-10 bg-white text-[#151719] font-bold rounded-full flex items-center justify-center w-full sm:w-auto text-[16px] cursor-pointer"
              >
                {t("extra.t430")}</motion.a>
              <motion.a 
                href="#platform"
                whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
                className="h-16 px-10 bg-white/5 text-white font-bold rounded-full flex items-center justify-center border border-white/10 w-full sm:w-auto text-[16px] backdrop-blur-sm cursor-pointer"
              >
                {t("extra.t431")}</motion.a>
            </motion.div>
          </motion.div>

          {/* Parallax Floating Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 100, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.5, delay: 0.4, ease: smoothEase }}
            style={{ y: mockupY }}
            className="relative mt-24 md:mt-32 -mb-24 md:-mb-40 perspective-[1200px] pointer-events-none z-10 w-full max-w-[800px] flex justify-center"
          >
             <div className="w-full h-32 md:h-[300px] bg-gradient-to-t from-[#151719] to-transparent absolute bottom-0 inset-x-0 z-20" />
             <div className="w-full aspect-video bg-[#0B0C0D] border border-white/10 rounded-t-[2rem] shadow-2xl p-6 flex flex-col gap-4 transform-gpu rotate-x-[15deg] scale-95 opacity-80">
                <div className="h-12 w-full bg-white/5 rounded-xl border border-white/5 flex items-center px-4 gap-4">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-white/20" />
                     <div className="w-3 h-3 rounded-full bg-white/20" />
                     <div className="w-3 h-3 rounded-full bg-white/20" />
                   </div>
                   <div className="h-4 w-48 bg-white/10 rounded-full mx-auto" />
                </div>
                <div className="flex-1 flex gap-4">
                   <div className="w-1/4 h-full bg-white/5 rounded-xl border border-white/5" />
                   <div className="w-3/4 h-full bg-white/5 rounded-xl border border-white/5" />
                </div>
             </div>
          </motion.div>
        </section>

        {/* BENTO GRID (Replaced with Variant2LightSaaS) */}
        <section id="platform" className="min-h-screen bg-[#E6E8EA] text-black py-32 px-6 relative overflow-hidden font-sans border-t border-neutral-300">
      {/* Background glow adapted for light mode */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none will-change-[transform,opacity]" 
        style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 60%)" }}
      />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-24 flex flex-col items-center text-center"
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight pb-3 mb-3 bg-gradient-to-b from-black via-black to-black/40 bg-clip-text text-transparent">
            Everything you need,<br/>elegantly arranged.
          </h2>
          <p className="text-neutral-500 text-lg md:text-xl max-w-2xl leading-normal tracking-wide">
            We stripped away the clutter to build a workspace that administrators<br className="hidden md:block"/>and professionals actually enjoy using.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={itemVariants} className="md:col-span-2 bg-white rounded-[2rem] p-10 hover:shadow-xl transition-all duration-300 group relative overflow-hidden shadow-sm">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700 ease-out"><Ticket className="w-40 h-40 text-black" /></div>
             <div className="relative z-10">
               <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-6 group-hover:bg-black transition-colors duration-300">
                 <Ticket className="w-6 h-6 text-black group-hover:text-white transition-colors" />
               </div>
               <h3 className="text-2xl font-bold tracking-tight mb-3 bg-gradient-to-b from-black to-black/40 bg-clip-text text-transparent pb-1">Live Digital Ticket</h3>
               <p className="text-neutral-500 max-w-md leading-relaxed group-hover:text-neutral-700 transition-colors">No more waiting in the dark. Clients track their exact status in real-time, eliminating uncertainty and walk-outs.</p>
             </div>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-10 hover:shadow-xl transition-all duration-300 relative overflow-hidden group shadow-sm">
             <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-6 group-hover:bg-black transition-colors duration-300">
               <ShieldCheck className="w-6 h-6 text-black group-hover:text-white transition-colors" />
             </div>
             <h3 className="text-2xl font-bold tracking-tight mb-3 bg-gradient-to-b from-black to-black/40 bg-clip-text text-transparent pb-1">Karma System</h3>
             <p className="text-neutral-500 leading-relaxed group-hover:text-neutral-700 transition-colors">Stop losing money to no-shows. Smart deposits and dynamic client scoring protect your time.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-10 hover:shadow-xl transition-all duration-300 relative overflow-hidden group shadow-sm">
             <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-6 group-hover:bg-black transition-colors duration-300">
               <Calendar className="w-6 h-6 text-black group-hover:text-white transition-colors" />
             </div>
             <h3 className="text-2xl font-bold tracking-tight mb-3 bg-gradient-to-b from-black to-black/40 bg-clip-text text-transparent pb-1">Instant Availability</h3>
             <p className="text-neutral-500 leading-relaxed group-hover:text-neutral-700 transition-colors">Skip the back-and-forth. Clients see exactly when you are free and secure their spot instantly.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="md:col-span-2 bg-white rounded-[2rem] p-10 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[320px] group shadow-sm">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700 ease-out"><LayoutDashboard className="w-40 h-40 text-black" /></div>
             <div className="relative z-10">
               <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-6 group-hover:bg-black transition-colors duration-300">
                 <LayoutDashboard className="w-6 h-6 text-black group-hover:text-white transition-colors" />
               </div>
               <h3 className="text-2xl font-bold tracking-tight mb-3 bg-gradient-to-b from-black to-black/40 bg-clip-text text-transparent pb-1">Visual Kanban Flow</h3>
               <p className="text-neutral-500 max-w-md leading-relaxed group-hover:text-neutral-700 transition-colors">Take total control of your workspace. Drag and drop clients seamlessly through your entire service pipeline.</p>
             </div>
             <div className="flex items-end gap-3 h-28 mt-8 opacity-80 group-hover:opacity-100 transition-all duration-500 relative z-10">
               <motion.div className="w-full bg-neutral-200 group-hover:bg-neutral-300 rounded-t-lg transition-colors" initial={{ height: "10%" }} whileInView={{ height: "40%" }} transition={{ delay: 0.2, duration: 0.8, type: "spring" as const }} viewport={{ once: true }} />
               <motion.div className="w-full bg-neutral-200 group-hover:bg-neutral-300 rounded-t-lg transition-colors" initial={{ height: "10%" }} whileInView={{ height: "60%" }} transition={{ delay: 0.3, duration: 0.8, type: "spring" as const }} viewport={{ once: true }} />
               <motion.div className="w-full bg-black rounded-t-lg shadow-lg group-hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-shadow" initial={{ height: "10%" }} whileInView={{ height: "90%" }} transition={{ delay: 0.4, duration: 0.8, type: "spring" as const }} viewport={{ once: true }} />
               <motion.div className="w-full bg-neutral-200 group-hover:bg-neutral-300 rounded-t-lg transition-colors" initial={{ height: "10%" }} whileInView={{ height: "50%" }} transition={{ delay: 0.5, duration: 0.8, type: "spring" as const }} viewport={{ once: true }} />
             </div>
          </motion.div>
        </motion.div>
      </div>
    </section>

        {/* ENHANCED FAQ SECTION (Full Width) */}
        <section id="faq" className="w-full bg-[#F3F4F4] border-y border-white shadow-[0_10px_40px_rgba(0,0,0,0.02)] py-32 px-6 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 1, ease: smoothEase }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12 text-center bg-gradient-to-b from-black to-black/40 bg-clip-text text-transparent pb-2">
              {t("extra.t442")}</h2>
            
            <div className="flex flex-col border-t border-[#8D9195]/20">
              <FaqItem 
                delay={0.1}
                question={t("extra.t383")} 
                answer={t("extra.t443")} 
              />
              <FaqItem 
                delay={0.2}
                question={t("extra.t384")} 
                answer={t("extra.t444")} 
              />
              <FaqItem 
                delay={0.3}
                question={t("extra.t385")} 
                answer={t("extra.t445")} 
              />
              <FaqItem 
                delay={0.4}
                question={t("extra.t386")} 
                answer={t("extra.t446")} 
              />
            </div>
          </motion.div>
        </section>

        {/* CTA SECTION */}
        <section id="cta" className="w-full py-40 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-[#D8DADC] to-[#D8DADC] pointer-events-none opacity-50" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 1, ease: smoothEase }}
            className="max-w-4xl mx-auto flex flex-col items-center relative z-10"
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight bg-gradient-to-b from-black via-black to-black/40 bg-clip-text text-transparent pb-3">
              {t("extra.t447")}<br /> {t("extra.t448")}</h2>
            <p className="text-xl text-[#25282B] font-medium mb-16 max-w-2xl leading-normal tracking-wide">
              {t("extra.t449")}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full">
              <motion.a 
                href="/designsignup"
                whileHover={{ scale: 1.04, boxShadow: "0 20px 40px -15px rgba(21,23,25,0.4)" }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
                className="h-16 px-12 bg-[#151719] text-white font-bold tracking-wide rounded-full text-[16px] w-full sm:w-auto flex items-center justify-center"
              >
                {t("extra.t450")}</motion.a>
              <motion.a 
                href="/designlogin"
                whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.5)" }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
                className="h-16 px-10 bg-white text-[#0B0C0D] font-bold tracking-wide rounded-full border border-[#8D9195]/30 w-full sm:w-auto flex items-center justify-center gap-2 text-[16px] shadow-sm"
              >
                {t("extra.t451")}</motion.a>
            </div>
          </motion.div>
        </section>

      </main>

      {/* ADAPTED FOOTER */}

    </div>
  );
}


