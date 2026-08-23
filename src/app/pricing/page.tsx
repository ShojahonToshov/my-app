"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import ElaraLogo from "@/components/ElaraLogo";
import Footer from "@/components/Footer";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F4] flex flex-col font-sans selection:bg-[#8A2532]/20">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-xl z-50 border-b border-[#DCDCDA]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <ElaraLogo />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm font-medium text-[#121415] hover:text-[#8A2532] transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="text-sm font-semibold text-[#121415] hover:text-[#8A2532] transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-40 pb-24 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-semibold text-[#121415] tracking-tight mb-6 leading-tight"
          >
            Simple, transparent pricing.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-[#4A4E51] font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Whether you're just starting out or scaling a premium salon, Elara aligns with your success. No subscriptions, no hidden fees.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Core (Free) Tier */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-[2rem] p-8 md:p-12 border border-[#DCDCDA] shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow"
          >
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-[#121415] mb-2">Core</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-5xl font-bold text-[#121415] tracking-tight">$0</span>
                <span className="text-[#8B9194] font-medium">/ forever</span>
              </div>
              <p className="text-[#4A4E51] font-medium leading-relaxed">
                Perfect for independent professionals building their client base. Access premium tools completely free.
              </p>
            </div>

            <div className="space-y-5 mb-12 flex-1">
              {[
                "Digital Live Ticket for customers",
                "Kanban appointment dashboard",
                "Verified authentic reviews",
                <span key="limits">Generous weekly limits on paid features <br/><span className="text-sm font-normal text-[#8B9194] mt-1 inline-block">(Resets automatically every Monday)</span></span>
              ].map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#121415] shrink-0" />
                  <span className="text-[#121415] font-medium text-base leading-tight mt-0.5">{feature}</span>
                </div>
              ))}
            </div>

            <Link href="/signup">
              <button className="w-full py-4 bg-[#F5F5F4] border border-[#DCDCDA] hover:bg-[#ECECEA] text-[#121415] rounded-xl font-semibold transition-colors shadow-sm active:scale-[0.98]">
                Get Started for Free
              </button>
            </Link>
          </motion.div>

          {/* Premium Tier */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-[#121415] rounded-[2rem] p-8 md:p-12 border border-[#121415] shadow-xl flex flex-col relative overflow-hidden group"
          >
            {/* Subtle background glow */}
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#8A2532] rounded-full blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />
            
            <div className="mb-10 relative z-10">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold text-white">Premium</h3>
                <span className="px-3 py-1 bg-[#8A2532] text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                  RevShare
                </span>
              </div>
              <div className="flex flex-col mb-4 space-y-1">
                <span className="text-3xl font-bold text-white leading-tight tracking-tight">Zero upfront costs.</span>
                <span className="text-xl font-semibold text-[#8B9194]">We earn when you earn.</span>
              </div>
              <p className="text-[#8B9194] font-medium leading-relaxed">
                For established businesses that demand total operational control and powerful no-show protection.
              </p>
            </div>

            <div className="space-y-5 mb-12 flex-1 relative z-10">
              {[
                "Everything in Core, completely unlimited",
                "Smart no-show protection (Karma System)",
                "Daily automated bank settlements",
                "Priority support and onboarding",
                "Advanced revenue insights & analytics"
              ].map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#8A2532]/20 flex items-center justify-center shrink-0 border border-[#8A2532]/30 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#8A2532]" />
                  </div>
                  <span className="text-white font-medium text-base leading-tight mt-0.5">{feature}</span>
                </div>
              ))}
            </div>

            <Link href="/signup" className="relative z-10">
              <button className="w-full py-4 bg-white hover:bg-[#F5F5F4] text-[#121415] rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]">
                Join the Network
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
