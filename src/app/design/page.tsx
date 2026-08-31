"use client";
import { useI18n } from "@/hooks/useI18n";
import { useI18nStore } from "@/stores/i18nStore";


import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
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

const customFont = Plus_Jakarta_Sans({ 
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

// Increased logo size
function AdaptedLogo() {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <svg
        width="34"
        height="34"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-700 group-hover:rotate-[360deg] will-change-transform"
      >
        <circle cx="16" cy="16" r="13" stroke="#0B0C0D" strokeWidth="1.5" opacity="0.15" />
        <circle 
          cx="16" cy="16" r="13" 
          stroke="#151719" 
          strokeWidth="2" 
          strokeDasharray="20 62" 
          strokeLinecap="round" 
          transform="rotate(-90 16 16)" 
          className="transition-all duration-700 group-hover:strokeDasharray-[30_52]" 
        />
        <path 
          d="M16 6C16 11 11 16 6 16C11 16 16 21 16 26C16 21 21 16 26 16C21 16 16 11 16 6Z" 
          fill="#151719" 
          className="transition-transform duration-500 origin-center group-hover:scale-75" 
        />
      </svg>
      <span className="font-bold tracking-[0.15em] text-[18px] uppercase text-[#0B0C0D]">
        Elara
      </span>
    </div>
  );
}

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
        <span className="text-[#0B0C0D] font-bold text-lg md:text-xl group-hover:text-[#151719]/70 transition-colors">
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
              className="pt-5 text-[#25282B] text-lg font-medium leading-relaxed max-w-3xl"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("platform");
  
  // Parallax Hooks
  const { scrollY } = useScroll();
  const rawHeroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroY = useSpring(rawHeroY, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  
  const rawMockupY = useTransform(scrollY, [0, 1000], [0, -150]);
  const mockupY = useSpring(rawMockupY, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`min-h-screen bg-[#D8DADC] text-[#0B0C0D] ${customFont.className} selection:bg-[#151719] selection:text-white flex flex-col relative`}>
      
      {/* GLOBAL NOISE */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.02]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* FLOATING NAVBAR */}
      <div className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 md:px-6 pointer-events-none">
        <nav className="bg-[#F3F4F4]/85 backdrop-blur-2xl border border-white/60 rounded-full p-2 h-[76px] flex items-center justify-between w-full max-w-[1352px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] pointer-events-auto transition-all relative">
          
          {/* LEFT: LOGO */}
          <div className="flex-1 flex justify-start pl-4">
            <Link href="/" className="outline-none rounded-full group">
              <AdaptedLogo />
            </Link>
          </div>

          {/* CENTER: INTERACTIVE SEGMENTED PILL */}
          <div className="hidden md:flex items-center bg-[#D8DADC]/60 p-1.5 rounded-full border border-white/40 shadow-[inset_0_1px_4px_rgba(0,0,0,0.04)] backdrop-blur-md relative">
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
                    transition={{ type: "spring" as const, stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-20">
                  {tab.label}
                </span>
              </a>
            ))}
          </div>

          {/* RIGHT: ACTIONS */}
          <div className="flex-1 flex justify-end pr-2">
            <div className="hidden md:flex items-center gap-3">
              <motion.a 
                href="/login" 
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
                className="px-6 py-3 text-[14px] font-bold text-[#0B0C0D] bg-white border border-[#8D9195]/20 text-center rounded-full shadow-sm cursor-pointer"
              >{useI18nStore.getState().t("extra.t106")}</motion.a>
              <motion.button 
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
                className="px-8 py-3 bg-[#151719] text-white text-[14px] font-bold rounded-full shadow-lg shadow-[#151719]/10"
              >{useI18nStore.getState().t("extra.t130")}</motion.button>
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

      <main className="flex-1 w-full">
        
        {/* PARALLAX HERO SECTION */}
        <section className="relative w-full bg-[#151719] flex flex-col items-center pt-32 md:pt-48 px-6 overflow-hidden z-10 border-b border-[#8D9195]/20">
          
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
          />
          
          <motion.div 
            style={{ y: heroY }}
            className="absolute top-[40%] left-[50%] -translate-x-[60%] -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-blue-500/15 rounded-full blur-[120px] pointer-events-none mix-blend-screen" 
          />
          <motion.div 
            style={{ y: heroY }}
            className="absolute top-[60%] left-[50%] -translate-x-[40%] -translate-y-1/2 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" 
          />
          
          <motion.div 
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center"
          >
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: smoothEase }}
              className="text-6xl md:text-8xl lg:text-[7.5rem] font-bold tracking-[-0.04em] leading-[0.95] mb-8 flex flex-col"
            >
              <span className="text-white relative z-10">
                {t("extra.t427")}
              </span>
              <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent relative z-0 pb-2 -mt-1">
                {t("extra.t428")}
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.15, ease: smoothEase }}
              className="text-lg md:text-2xl text-white/50 max-w-3xl font-medium leading-relaxed mb-14"
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
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-white blur-[120px] rounded-full pointer-events-none" 
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
          <p className="text-neutral-500 text-lg md:text-xl max-w-2xl leading-relaxed">
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
               <h3 className="text-2xl font-bold mb-3 text-black">Live Digital Ticket</h3>
               <p className="text-neutral-500 max-w-md group-hover:text-neutral-700 transition-colors">No more waiting in the dark. Clients track their exact status in real-time, eliminating uncertainty and walk-outs.</p>
             </div>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-10 hover:shadow-xl transition-all duration-300 relative overflow-hidden group shadow-sm">
             <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-6 group-hover:bg-black transition-colors duration-300">
               <ShieldCheck className="w-6 h-6 text-black group-hover:text-white transition-colors" />
             </div>
             <h3 className="text-2xl font-bold mb-3 text-black">Karma System</h3>
             <p className="text-neutral-500 group-hover:text-neutral-700 transition-colors">Stop losing money to no-shows. Smart deposits and dynamic client scoring protect your time.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-10 hover:shadow-xl transition-all duration-300 relative overflow-hidden group shadow-sm">
             <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-6 group-hover:bg-black transition-colors duration-300">
               <Calendar className="w-6 h-6 text-black group-hover:text-white transition-colors" />
             </div>
             <h3 className="text-2xl font-bold mb-3 text-black">Instant Availability</h3>
             <p className="text-neutral-500 group-hover:text-neutral-700 transition-colors">Skip the back-and-forth. Clients see exactly when you are free and secure their spot instantly.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="md:col-span-2 bg-white rounded-[2rem] p-10 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[320px] group shadow-sm">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700 ease-out"><LayoutDashboard className="w-40 h-40 text-black" /></div>
             <div className="relative z-10">
               <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-6 group-hover:bg-black transition-colors duration-300">
                 <LayoutDashboard className="w-6 h-6 text-black group-hover:text-white transition-colors" />
               </div>
               <h3 className="text-2xl font-bold mb-3 text-black">Visual Kanban Flow</h3>
               <p className="text-neutral-500 max-w-md group-hover:text-neutral-700 transition-colors">Take total control of your workspace. Drag and drop clients seamlessly through your entire service pipeline.</p>
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
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0B0C0D] mb-12 text-center">
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
            <h2 className="text-5xl md:text-7xl font-bold tracking-[-0.03em] mb-8 text-[#0B0C0D] leading-tight">
              {t("extra.t447")}<br /> {t("extra.t448")}</h2>
            <p className="text-xl text-[#25282B] font-medium mb-16 max-w-2xl">
              {t("extra.t449")}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full">
              <motion.button 
                whileHover={{ scale: 1.04, boxShadow: "0 20px 40px -15px rgba(21,23,25,0.4)" }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
                className="h-16 px-12 bg-[#151719] text-white font-bold rounded-full text-[16px] w-full sm:w-auto"
              >
                {t("extra.t450")}</motion.button>
              <motion.button 
                whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.5)" }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
                className="h-16 px-10 bg-white text-[#0B0C0D] font-bold rounded-full border border-[#8D9195]/30 w-full sm:w-auto flex items-center justify-center gap-2 text-[16px] shadow-sm"
              >
                {t("extra.t451")}</motion.button>
            </div>
          </motion.div>
        </section>

      </main>

      {/* ADAPTED FOOTER */}
      <footer className="bg-[#F3F4F4] border-t border-white shadow-[0_-10px_40px_rgba(0,0,0,0.02)] pt-20 pb-10 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16 mb-10">
          
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
                transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
                className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#25282B] shadow-sm border border-[#8D9195]/15 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </motion.a>
              <motion.a 
                href="#"
                whileHover={{ scale: 1.1, backgroundColor: "#0B0C0D", color: "#ffffff", borderColor: "#0B0C0D" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
                className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#25282B] shadow-sm border border-[#8D9195]/15 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </motion.a>
              <motion.a 
                href="#"
                whileHover={{ scale: 1.1, backgroundColor: "#0B0C0D", color: "#ffffff", borderColor: "#0B0C0D" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
                className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-[#25282B] shadow-sm border border-[#8D9195]/15 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </motion.a>
            </div>
          </motion.div>

          {/* Right: Link Columns */}
          <div className="flex flex-wrap md:flex-nowrap gap-16 lg:gap-24 md:pr-4">
            
            {/* Platform */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
              className="pt-2 md:pt-[10px]"
            >
              <h4 className="text-[#0B0C0D] font-bold text-[16px] tracking-tight mb-6">
                {t("extra.t426")}</h4>
              <ul className="space-y-4 text-[14px] font-bold text-[#8D9195]">
                <li>
                  <Link href="/search" className="hover:text-[#0B0C0D] transition-colors duration-200 outline-none rounded">
                    {t("app.t0")}</Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#0B0C0D] transition-colors duration-200 outline-none rounded">{useI18nStore.getState().t("extra.t106")}</Link>
                </li>
                <li>
                  <button className="hover:text-[#0B0C0D] transition-colors duration-200 outline-none rounded text-left">{useI18nStore.getState().t("extra.t130")}</button>
                </li>
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
              className="pt-2 md:pt-[10px]"
            >
              <h4 className="text-[#0B0C0D] font-bold text-[16px] tracking-tight mb-6">
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

            {/* Company */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: smoothEase }}
              className="pt-2 md:pt-[10px]"
            >
              <h4 className="text-[#0B0C0D] font-bold text-[16px] tracking-tight mb-6">
                {t("extra.t456")}</h4>
              <ul className="space-y-4 text-[14px] font-bold text-[#8D9195]">
                <li>
                  <a href="#" className="hover:text-[#0B0C0D] transition-colors duration-200 outline-none rounded">{useI18nStore.getState().t("extra.t326")}</a>
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
          <p>© {new Date().getFullYear()} {t("extra.t458")}</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-[#0B0C0D] transition-colors underline underline-offset-4">{useI18nStore.getState().t("extra.t259")}</Link>
            <Link href="/terms" className="hover:text-[#0B0C0D] transition-colors underline underline-offset-4">{useI18nStore.getState().t("extra.t192")}</Link>
          </div>
        </motion.div>
      </footer>

    </div>
  );
}
