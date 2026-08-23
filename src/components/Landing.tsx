"use client";
import React, { useState, useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Star,
  ShieldCheck,
  Calendar,
  ChevronDown,
  Menu,
  X,
  CheckCircle2,
  Navigation,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import ElaraLogo from "@/components/ElaraLogo";
import SignupRoleModal from "@/components/SignupRoleModal";
import { Button } from "@/components/ui/Button";
import useUser from "@/hooks/useUser";

import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function FaqItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const answerId = useId();

  return (
    <div className="py-6 border-b border-[#DCDCDA] last:border-0 group">
      <h3 className="text-lg font-medium text-[#121415] m-0">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={answerId}
          className="flex justify-between items-center w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-lg group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="group-hover:text-[#8A2532] transition-colors">
            {q}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-[#4A4E51] transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </h3>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={answerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-[#4A4E51] font-medium leading-relaxed pb-2 m-0">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Landing() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { isAuthenticated, user } = useUser();
  const accountLink = user?.profile?.role === "business" ? "/dashboard" : "/account";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  useLockBodyScroll(mobileMenuOpen);

  // Custom smooth-scroll function that centers sections on screen
  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      window.history.pushState(null, "", `#${id}`);
    }
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#ECECEA] font-sans selection:bg-[#8A2532] selection:text-white overflow-x-hidden text-[#121415]">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#ECECEA]/80 backdrop-blur-xl border-b border-[#DCDCDA] px-6">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-3">
            <ElaraLogo />
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-[#4A4E51]">
            <Link
              href="/pricing"
              className="hover:text-[#121415] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
            >
              Pricing
            </Link>
            <Link
              href="#features"
              onClick={(e) => scrollToSection(e, "features")}
              className="hover:text-[#121415] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, "how-it-works")}
              className="hover:text-[#121415] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
            >
              How it works
            </Link>
            <Link
              href="#faq"
              onClick={(e) => scrollToSection(e, "faq")}
              className="hover:text-[#121415] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
            >
              FAQ
            </Link>
          </div>

          
            <div className="hidden md:flex items-center gap-4 shrink-0">
              {mounted && isAuthenticated ? (
                <Link
                  href={accountLink}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#121415] hover:bg-[#1E2123] rounded-full transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#121415] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center"
                >
                  My Account
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-5 py-2.5 text-sm font-medium text-[#121415] border border-[#DCDCDA] bg-white hover:bg-[#F5F5F4] rounded-full transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center"
                  >
                    Log in
                  </Link>
                  <Button 
                    onClick={() => setSignupModalOpen(true)}
                    variant="secondary" 
                    size="sm" 
                    className="px-5 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  >
                    Sign up
                  </Button>
                </>
              )}
            </div>


          <button
            className="md:hidden p-2 text-[#121415] outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-lg active:scale-95 transition-transform"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#ECECEA] border-b border-[#DCDCDA] overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-4">

                <Link
                  href="#features"
                  onClick={(e) => scrollToSection(e, "features")}
                  className="text-lg font-medium text-[#121415] outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  onClick={(e) => scrollToSection(e, "how-it-works")}
                  className="text-lg font-medium text-[#121415] outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
                >
                  How it works
                </Link>
                <Link
                  href="#faq"
                  onClick={(e) => scrollToSection(e, "faq")}
                  className="text-lg font-medium text-[#121415] outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
                >
                  FAQ
                </Link>

                <div className="h-px bg-[#DCDCDA] my-2" />

                <Link
                  href="/login"
                  className="text-lg font-medium text-[#121415] outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <button
                  onClick={() => {
                    setSignupModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="text-lg font-medium text-[#8A2532] outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded text-left"
                >
                  Sign up
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-40 md:pt-52 pb-20 px-6 max-w-7xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl lg:text-7xl leading-[1.1] font-semibold text-[#121415] tracking-tighter mb-6"
            >
              Premium experience for clients.<br className="hidden md:block" />
              <span className="text-[#8A2532]">Intelligent growth for business.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-[#4A4E51] max-w-2xl mx-auto font-medium mb-12 leading-relaxed tracking-tight"
            >
              Book appointments at the city&apos;s finest salons, or power your business with a platform that drives revenue and completely eliminates no-shows.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 relative z-20"
            >
              <Link
                href="/search"
                className="w-full sm:w-auto outline-none focus-visible:ring-2 focus-visible:ring-[#8A2532] rounded-full"
              >
                <Button
                  variant="primary"
                  className="w-full !px-8 !py-3.5 !text-base active:scale-95"
                >
                  <div className="flex items-center justify-center gap-2">
                    Start your journey
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </div>
                </Button>
              </Link>

              <Link
                href="#features"
                onClick={(e) => scrollToSection(e, "features")}
                className="w-full sm:w-auto outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-full"
              >
                <button className="w-full sm:w-auto px-8 py-3.5 bg-white border border-[#DCDCDA] text-[#121415] hover:bg-[#F5F5F4] rounded-full text-base font-medium transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center">
                  Explore features
                </button>
              </Link>
            </motion.div>
          </motion.div>

        </section>

        {/* Live Ticket Section */}
        <section className="py-24 px-6 bg-white border-y border-[#DCDCDA]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 space-y-6"
            >
              <h2 className="text-3xl md:text-5xl font-semibold text-[#121415] tracking-tight leading-tight">
                An experience clients love.
              </h2>
              <p className="text-[#4A4E51] text-lg font-medium leading-relaxed max-w-lg">
                Delight your customers with a Digital Live Ticket. They get real-time booking updates, seamless QR check-ins, and one-tap rescheduling—all beautifully organized in a single, interactive pass. When booking is this easy, they keep coming back.
              </p>
              
              <div className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F5F5F4] border border-[#DCDCDA] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#8A2532]" />
                  </div>
                  <span className="text-[#121415] font-medium">Real-time status tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F5F5F4] border border-[#DCDCDA] flex items-center justify-center shrink-0">
                    <Navigation className="w-4 h-4 text-[#8A2532]" />
                  </div>
                  <span className="text-[#121415] font-medium">Instant venue navigation</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 w-full flex justify-center lg:justify-end"
            >
              <div className="bg-white rounded-[2.5rem] w-full max-w-[360px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-[#DCDCDA] flex flex-col overflow-hidden relative group hover:-translate-y-2 transition-transform duration-500">
                {/* Header Map Area */}
                <div className="h-32 bg-[#E5E9EA] relative overflow-hidden flex items-center justify-center border-b border-[#DCDCDA]">
                   <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                   {/* Fake map route line */}
                   <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                     <path d="M-10,50 Q30,60 50,30 T110,40" stroke="#8A2532" strokeWidth="3" fill="none" strokeDasharray="6 4" className="opacity-60" />
                     <circle cx="50" cy="30" r="4" fill="#8A2532" />
                   </svg>
                   <div className="absolute bottom-3 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2">
                     <Navigation className="w-3 h-3 text-[#8A2532]" />
                     <span className="text-xs font-semibold text-[#121415]">8 min away</span>
                   </div>
                </div>

                <div className="p-6 flex flex-col">
                  {/* Title & Info */}
                  <div className="text-center mb-6 space-y-1">
                    <h3 className="text-xl font-bold text-[#121415]">Alexander Studio</h3>
                    <p className="text-sm font-medium text-[#4A4E51]">Premium Hair Styling</p>
                  </div>

                  {/* Time & Date */}
                  <div className="p-4 rounded-2xl mb-6 bg-[#F5F5F4] border border-[#DCDCDA] flex gap-4 items-center">
                     <div className="w-12 h-12 rounded-xl bg-white border border-[#DCDCDA] shadow-sm flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-[#8A2532] uppercase">Oct</span>
                        <span className="text-lg font-bold text-[#121415] leading-none">24</span>
                     </div>
                     <div className="space-y-1 flex-1">
                        <div className="text-base font-bold text-[#121415]">14:00 - 15:30</div>
                        <div className="text-xs font-medium text-[#4A4E51]">With Michael</div>
                     </div>
                  </div>

                  {/* Status Steps */}
                  <div className="grid grid-cols-3 mb-8 relative px-2">
                     <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className="w-8 h-8 rounded-full bg-[#121415] text-white flex items-center justify-center shadow-md">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-[#121415]">Booked</span>
                     </div>
                     <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-[#8A2532] shadow-[0_0_12px_rgba(138,37,50,0.15)] flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-[#8A2532] rounded-full" />
                        </div>
                        <span className="text-[10px] font-bold text-[#8A2532]">On the way</span>
                     </div>
                     <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className="w-8 h-8 rounded-full bg-[#F5F5F4] border-2 border-[#DCDCDA]" />
                        <span className="text-[10px] font-medium text-[#8B9194]">Check-in</span>
                     </div>
                     {/* Connector line */}
                     <div className="absolute top-4 left-[16%] right-[16%] h-[2px] bg-[#DCDCDA] -z-0">
                       <div className="h-full bg-[#121415] w-1/2" />
                     </div>
                  </div>

                  {/* QR Code Area */}
                  <div className="bg-[#F5F5F4] p-5 rounded-2xl border border-[#DCDCDA] mb-6 flex flex-col items-center justify-center gap-3">
                     <div className="text-xs font-bold text-[#4A4E51] uppercase tracking-wider">Show upon arrival</div>
                     <div className="w-24 h-24 bg-white border border-[#DCDCDA] rounded-xl p-2 shadow-sm grid grid-cols-4 grid-rows-4 gap-1">
                        {/* Fake QR pattern */}
                        <div className="bg-[#121415] rounded-sm" />
                        <div className="bg-[#121415] rounded-sm" />
                        <div className="bg-transparent rounded-sm" />
                        <div className="bg-[#121415] rounded-sm" />
                        <div className="bg-[#121415] rounded-sm" />
                        <div className="bg-transparent rounded-sm" />
                        <div className="bg-[#121415] rounded-sm" />
                        <div className="bg-[#121415] rounded-sm" />
                        <div className="bg-transparent rounded-sm" />
                        <div className="bg-[#121415] rounded-sm" />
                        <div className="bg-transparent rounded-sm" />
                        <div className="bg-[#121415] rounded-sm" />
                        <div className="bg-transparent rounded-sm" />
                        <div className="bg-[#121415] rounded-sm" />
                        <div className="bg-[#121415] rounded-sm" />
                        <div className="bg-[#121415] rounded-sm" />
                     </div>
                  </div>

                  <div className="space-y-3 mt-auto">
                     <button className="w-full py-3 bg-white border border-[#DCDCDA] rounded-xl text-sm font-semibold text-[#121415] shadow-sm hover:bg-[#F5F5F4] transition-colors">
                       Reschedule
                     </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Business Dashboard Section */}
        <section className="py-24 px-6 bg-[#ECECEA]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 space-y-6"
            >
              <h2 className="text-3xl md:text-5xl font-semibold text-[#121415] tracking-tight leading-tight">
                When clients are happy, your business thrives.
              </h2>
              <p className="text-[#4A4E51] text-lg font-medium leading-relaxed max-w-lg">
                Take total operational control. Manage your team's schedules, analyze revenue insights, and track Karma metrics in a calm, distraction-free environment. Elara saves your administrators hours of work every week.
              </p>
              
              <div className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#DCDCDA] flex items-center justify-center shrink-0 shadow-sm">
                    <Calendar className="w-4 h-4 text-[#8A2532]" />
                  </div>
                  <span className="text-[#121415] font-medium">Kanban-style appointment flow</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#DCDCDA] flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-[#8A2532]" />
                  </div>
                  <span className="text-[#121415] font-medium">Smart no-show protection</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 w-full"
            >
              <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-[#DCDCDA] p-3 md:p-4 overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                <div className="bg-[#F5F5F4] rounded-[1.5rem] w-full h-[480px] border border-[#DCDCDA]/60 flex flex-col overflow-hidden relative">
                  
                  {/* Header */}
                  <div className="bg-white p-4 md:p-5 flex justify-between items-center border-b border-[#DCDCDA]">
                     <div className="flex gap-3 md:gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl bg-[#8A2532] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                           A
                        </div>
                        <div className="space-y-0.5">
                           <div className="text-sm md:text-base font-bold text-[#121415]">Alexander Studio</div>
                           <div className="text-xs font-medium text-[#4A6B53] flex items-center gap-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-[#4A6B53]" />
                             Online & Accepting Bookings
                           </div>
                        </div>
                     </div>
                     <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#121415] text-white rounded-lg text-xs font-semibold shadow-sm">
                        <Calendar className="w-3 h-3" />
                        Today, Oct 24
                     </div>
                  </div>

                  {/* Content - Kanban */}
                  <div className="flex-1 p-4 md:p-5 flex gap-4 overflow-x-auto snap-x">
                     {/* Column 1: Waiting */}
                     <div className="flex-1 flex flex-col gap-3 min-w-[200px] snap-center">
                        <div className="flex justify-between items-center px-1">
                           <span className="text-xs font-bold text-[#4A4E51] uppercase tracking-wider">Waiting Room (2)</span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col gap-3">
                           <div className="flex justify-between items-start">
                             <div className="text-xs font-bold text-[#121415]">14:00</div>
                             <div className="px-2 py-0.5 bg-[#4A6B53]/10 text-[#4A6B53] text-[10px] font-bold rounded-full">New</div>
                           </div>
                           <div className="flex gap-3 items-center">
                              <div className="w-9 h-9 rounded-full bg-[#E5E9EA] border border-[#DCDCDA] flex items-center justify-center text-xs font-bold text-[#121415]">S</div>
                              <div>
                                 <div className="text-sm font-bold text-[#121415]">Sarah Jenkins</div>
                                 <div className="text-[11px] font-medium text-[#8B9194]">Hair Coloring</div>
                              </div>
                           </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col gap-3">
                           <div className="flex justify-between items-start">
                             <div className="text-xs font-bold text-[#121415]">14:30</div>
                             <div className="flex items-center gap-1 text-[10px] font-bold text-[#F59E0B]">
                               <Star className="w-3 h-3 fill-current" />
                               VIP
                             </div>
                           </div>
                           <div className="flex gap-3 items-center">
                              <div className="w-9 h-9 rounded-full bg-[#E5E9EA] border border-[#DCDCDA] flex items-center justify-center text-xs font-bold text-[#121415]">E</div>
                              <div>
                                 <div className="text-sm font-bold text-[#121415]">Elena Rostova</div>
                                 <div className="text-[11px] font-medium text-[#8B9194]">Consultation</div>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Column 2: In Chair */}
                     <div className="flex-1 flex flex-col gap-3 min-w-[200px] snap-center">
                        <div className="flex justify-between items-center px-1">
                           <span className="text-xs font-bold text-[#8A2532] uppercase tracking-wider flex items-center gap-1">
                             <div className="w-2 h-2 rounded-full bg-[#8A2532] animate-pulse" />
                             In Chair (1)
                           </span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border-2 border-[#8A2532] shadow-md flex flex-col gap-3 relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-16 h-16 bg-[#8A2532]/5 rounded-bl-3xl" />
                           <div className="flex justify-between items-start relative z-10">
                             <div className="text-xs font-bold text-[#8A2532]">13:00 - 15:00</div>
                             <div className="px-2 py-0.5 bg-[#121415] text-white text-[10px] font-bold rounded-full">45m left</div>
                           </div>
                           <div className="flex gap-3 items-center relative z-10 mt-1">
                              <div className="w-10 h-10 rounded-full bg-[#E5E9EA] border-2 border-[#8A2532] flex items-center justify-center text-sm font-bold text-[#121415] shadow-sm">M</div>
                              <div>
                                 <div className="text-sm font-bold text-[#121415]">Michael Scott</div>
                                 <div className="text-[11px] font-medium text-[#8B9194]">Premium Cut & Beard</div>
                              </div>
                           </div>
                           {/* Karma Badge */}
                           <div className="mt-2 flex items-center gap-1.5 px-2 py-1 bg-[#F5F5F4] rounded-lg border border-[#DCDCDA] w-fit">
                             <ShieldCheck className="w-3 h-3 text-[#4A6B53]" />
                             <span className="text-[10px] font-bold text-[#121415]">Karma: Perfect</span>
                           </div>
                        </div>
                     </div>

                     {/* Column 3: Completed */}
                     <div className="flex-1 flex flex-col gap-3 min-w-[200px] opacity-70 snap-center">
                        <div className="flex justify-between items-center px-1">
                           <span className="text-xs font-bold text-[#8B9194] uppercase tracking-wider">Completed</span>
                        </div>
                        <div className="bg-[#E5E9EA] p-4 rounded-2xl border border-[#DCDCDA] flex flex-col gap-3 mix-blend-luminosity">
                           <div className="flex justify-between items-start">
                             <div className="text-xs font-bold text-[#4A4E51]">12:00</div>
                             <div className="text-[10px] font-bold text-[#4A4E51]">Paid $120</div>
                           </div>
                           <div className="flex gap-3 items-center">
                              <div className="w-9 h-9 rounded-full bg-[#DCDCDA] border border-[#8B9194] flex items-center justify-center text-xs font-bold text-[#4A4E51]">D</div>
                              <div>
                                 <div className="text-sm font-bold text-[#4A4E51]">David Lin</div>
                                 <div className="text-[11px] font-medium text-[#8B9194]">Styling</div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </section>

        {/* Karma System Section */}
        <section className="py-24 px-6 bg-[#121415] text-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8A2532]/20 border border-[#8A2532]/30 text-[#8A2532] text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  Business Protection
                </div>
                <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
                  Stop losing money to no-shows.
                </h2>
                <p className="text-[#8B9194] text-lg font-medium leading-relaxed max-w-lg">
                  Missed appointments cost the industry billions. Our proprietary Karma System automatically identifies risky clients and requires non-refundable deposits, protecting your calendar and your revenue.
                </p>

                <div className="space-y-6 pt-4">
                  {[
                    { title: "Dynamic Scoring", desc: "Every client builds a reliability score based on their booking history." },
                    { title: "Smart Deposits", desc: "Low-Karma users must pay upfront to secure a slot. Reliable clients book freely." },
                    { title: "Revenue Recovery", desc: "Salons see up to a 90% reduction in no-shows within the first month." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-white font-bold text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                        <p className="text-[#8B9194] text-sm font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Visual Mockup */}
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#8A2532] rounded-full blur-[120px] opacity-20 pointer-events-none" />
                
                <div className="relative space-y-6">
                  {/* Perfect Karma Card */}
                  <div className="bg-[#1A1D1F] p-5 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-4 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                    <div className="w-12 h-12 rounded-full bg-[#E5E9EA] flex items-center justify-center font-bold text-[#121415] text-lg">S</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-white font-bold">Sarah Jenkins</h4>
                        <span className="text-[#4A6B53] text-xs font-bold px-2 py-1 bg-[#4A6B53]/10 rounded-full">Perfect</span>
                      </div>
                      <p className="text-[#8B9194] text-xs mt-1">12 completed visits · 0 no-shows</p>
                    </div>
                  </div>

                  {/* Warning/Deposit Card */}
                  <div className="bg-[#1A1D1F] p-5 rounded-2xl border border-[#8A2532]/30 shadow-2xl flex items-center gap-4 transform translate-x-4 rotate-1 hover:rotate-0 transition-transform duration-500 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-[#E5E9EA] flex items-center justify-center font-bold text-[#121415] text-lg">M</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-white font-bold">Michael Scott</h4>
                        <span className="text-[#8A2532] text-xs font-bold px-2 py-1 bg-[#8A2532]/10 rounded-full">Requires Deposit</span>
                      </div>
                      <p className="text-[#8B9194] text-xs mt-1">2 completed visits · 1 no-show</p>
                    </div>
                    {/* Security lock icon */}
                    <div className="absolute -right-3 -top-3 w-8 h-8 bg-[#8A2532] rounded-full flex items-center justify-center shadow-lg border-2 border-[#121415]">
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  {/* UX Mockup of payment required */}
                  <div className="bg-white p-5 rounded-2xl border border-[#DCDCDA] shadow-2xl transform -translate-x-4 -rotate-1 mt-8">
                     <div className="flex justify-between items-center mb-4">
                       <span className="text-[#121415] font-bold text-sm">Booking Confirmation</span>
                       <span className="text-[#121415] font-bold">$30.00</span>
                     </div>
                     <div className="flex gap-2 items-center mb-4 p-3 bg-[#F5F5F4] rounded-xl border border-[#DCDCDA]">
                       <ShieldCheck className="w-4 h-4 text-[#8A2532]" />
                       <span className="text-xs text-[#4A4E51] font-medium leading-tight">Your Karma score requires a non-refundable deposit to secure this booking.</span>
                     </div>
                     <button className="w-full py-2.5 bg-[#121415] text-white rounded-lg text-xs font-bold hover:bg-[#2C3135] transition-colors">
                       Pay Deposit & Book
                     </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 bg-[#ECECEA]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-semibold text-[#121415] tracking-tight mb-4 leading-tight">
                A new standard for premium bookings.
              </h2>
              <p className="text-[#4A4E51] text-lg font-medium leading-relaxed">
                Everything you need to manage your appointments, wrapped in a
                calm, intelligent interface.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2 bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                <Calendar className="w-8 h-8 text-[#8A2532] mb-6" />
                <h3 className="text-2xl font-semibold text-[#121415] mb-3 tracking-tight">
                  Real-time availability
                </h3>
                <p className="text-[#4A4E51] font-medium max-w-md leading-relaxed">
                  Skip the back-and-forth messaging. See exactly when your
                  favorite professionals are free and secure your spot
                  instantly.
                </p>

                <div className="absolute right-[-10%] bottom-[-20%] w-3/4 h-64 bg-[#F5F5F4] border border-[#DCDCDA] rounded-2xl shadow-lg p-6 group-hover:-translate-y-2 transition-transform duration-500 hidden md:block">
                  <div className="h-4 w-1/3 bg-[#DCDCDA] rounded-full mb-6" />
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-12 bg-white rounded-xl border border-[#DCDCDA]/50"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-span-1 bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] group">
                <Star className="w-8 h-8 text-[#8A2532] mb-6" />
                <h3 className="text-2xl font-semibold text-[#121415] mb-3 tracking-tight">
                  Verified reviews
                </h3>
                <p className="text-[#4A4E51] font-medium leading-relaxed">
                  Read authentic feedback from real customers. We only allow
                  reviews from completed appointments.
                </p>
              </div>


              <div className="col-span-1 md:col-span-3 bg-[#121415] rounded-[2rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] relative overflow-hidden group">
                <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
                  Effortless rescheduling
                </h3>
                <p className="text-[#8B9194] font-medium max-w-md leading-relaxed">
                  Plans change. Reschedule your appointments with a single tap,
                  directly from your dashboard—without the awkward phone calls.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <div className="px-6 py-3 rounded-full bg-white/10 text-white text-sm font-medium backdrop-blur-md select-none">
                    Modify time
                  </div>
                  <div className="px-6 py-3 rounded-full bg-white/5 text-white/50 text-sm font-medium select-none">
                    Cancel
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="py-32 px-6 bg-white border-t border-[#DCDCDA]"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-semibold text-[#121415] tracking-tight mb-12">
                  How Elara works
                </h2>

                <div className="space-y-10">
                  <div className="flex gap-6 group">
                    <div className="text-sm font-bold text-[#8A2532] mt-1 shrink-0">
                      01
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-[#121415] mb-2 tracking-tight">
                        Discover
                      </h4>
                      <p className="text-[#4A4E51] font-medium leading-relaxed">
                        Search for premium services by category, precise
                        location, or find your favorite professional.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6 group">
                    <div className="text-sm font-bold text-[#8A2532] mt-1 shrink-0">
                      02
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-[#121415] mb-2 tracking-tight">
                        Select & Book
                      </h4>
                      <p className="text-[#4A4E51] font-medium leading-relaxed">
                        Choose a time that fits your schedule from real-time
                        available slots. Confirm in one tap.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6 group">
                    <div className="text-sm font-bold text-[#8A2532] mt-1 shrink-0">
                      03
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-[#121415] mb-2 tracking-tight">
                        Experience
                      </h4>
                      <p className="text-[#4A4E51] font-medium leading-relaxed">
                        Arrive and enjoy. Your appointment is confirmed
                        instantly and synced to your schedule.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#F5F5F4] rounded-[2rem] border border-[#DCDCDA] aspect-square p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <ElaraLogo dark={false} disableLink={true} />
                </div>

                <div className="w-full space-y-4">
                  <motion.div
                    initial={{ opacity: 0.5, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="h-20 w-full bg-white rounded-2xl border border-[#DCDCDA] flex items-center px-6 gap-4"
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-[#8A2532] flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#8A2532] rounded-full" />
                    </div>
                    <div className="h-3 w-1/3 bg-[#DCDCDA] rounded-full" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0.5, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="h-20 w-11/12 bg-white rounded-2xl border border-[#DCDCDA] flex items-center px-6 gap-4"
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-[#DCDCDA]" />
                    <div className="h-3 w-1/2 bg-[#ECECEA] rounded-full" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0.5, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-20 w-full bg-white rounded-2xl border border-[#DCDCDA] flex items-center px-6 gap-4"
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-[#DCDCDA]" />
                    <div className="h-3 w-1/4 bg-[#ECECEA] rounded-full" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-24 px-6 bg-[#ECECEA] border-y border-[#DCDCDA]">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-semibold text-[#121415] tracking-tight mb-16">
              Trusted by those who know.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {[
                {
                  text: "Elara completely changed how I book my appointments. It is so clean, calm, and incredibly intuitive.",
                  author: "Sarah J.",
                  role: "Verified Customer",
                },
                {
                  text: "The most beautifully designed booking platform I've ever used. Zero friction from search to confirmation.",
                  author: "Michael T.",
                  role: "Verified Customer",
                },
                {
                  text: "I love being able to see my stylist's exact schedule without texting them back and forth. Pure elegance.",
                  author: "David L.",
                  role: "Verified Customer",
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className="p-8 rounded-[2rem] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-[#8A2532] text-[#8A2532]"
                      />
                    ))}
                  </div>
                  <p className="text-[#121415] font-medium text-lg mb-8 leading-relaxed">
                    "{t.text}"
                  </p>
                  <div>
                    <p className="font-semibold text-[#121415]">{t.author}</p>
                    <p className="text-sm text-[#4A4E51] flex items-center gap-1 mt-1 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-[#4A6B53]" />
                      {t.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-32 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-semibold text-[#121415] tracking-tight mb-12 text-center">
              Frequently asked questions
            </h2>

            <div className="divide-y divide-[#DCDCDA]">
              {[
                {
                  q: "Is Elara free to use?",
                  a: "Yes, booking through Elara is completely free for customers. You only pay for the services you book directly at the venue.",
                },
                {
                  q: "Can I cancel or reschedule my appointment?",
                  a: "Absolutely. You can manage all your bookings directly from your account dashboard, subject to the venue's policy.",
                },
                {
                  q: "Are the reviews authentic?",
                  a: "We only allow reviews from customers who have actually completed an appointment at the venue.",
                },
                {
                  q: "How do I list my business on Elara?",
                  a: "If you own a premium salon or clinic, you can register for our Business Portal to manage operations on the Elara network.",
                },
              ].map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
      <React.Suspense fallback={null}>
        <SignupRoleModal isOpen={signupModalOpen} onClose={() => setSignupModalOpen(false)} />
      </React.Suspense>
    </div>
  );
}