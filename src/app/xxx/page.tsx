"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, ShieldCheck, Zap, BarChart3, 
  Users, Navigation, CheckCircle2, Lock, 
  CreditCard, Smartphone, Calendar, ChevronRight, Activity, ArrowRight
} from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";

const fontSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

// ---------------------------------------------------------
// VARIANT 1: The Original (Vercel / Linear Dark SaaS) -> Light Theme Reverted
// ---------------------------------------------------------
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
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function Variant1LightSaaS() {
  return (
    <section className="min-h-screen bg-[#E6E8EA] text-black py-32 px-6 relative overflow-hidden font-sans">
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
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-black">
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
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700 ease-out"><LayoutDashboard className="w-40 h-40 text-black" /></div>
             <div className="relative z-10">
               <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-6 group-hover:bg-black transition-colors duration-300">
                 <LayoutDashboard className="w-6 h-6 text-black group-hover:text-white transition-colors" />
               </div>
               <h3 className="text-2xl font-bold mb-3 text-black">Kanban Timeline</h3>
               <p className="text-neutral-500 max-w-md group-hover:text-neutral-700 transition-colors">Drag and drop your appointments with zero latency. Built on a custom rendering engine for unmatched speed.</p>
             </div>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-10 hover:shadow-xl transition-all duration-300 relative overflow-hidden group shadow-sm">
             <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-6 group-hover:bg-black transition-colors duration-300">
               <ShieldCheck className="w-6 h-6 text-black group-hover:text-white transition-colors" />
             </div>
             <h3 className="text-2xl font-bold mb-3 text-black">Fraud Protection</h3>
             <p className="text-neutral-500 group-hover:text-neutral-700 transition-colors">Automated deposits for high-risk bookings.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-10 hover:shadow-xl transition-all duration-300 relative overflow-hidden group shadow-sm">
             <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-6 group-hover:bg-black transition-colors duration-300">
               <Zap className="w-6 h-6 text-black group-hover:text-white transition-colors" />
             </div>
             <h3 className="text-2xl font-bold mb-3 text-black">Instant Sync</h3>
             <p className="text-neutral-500 group-hover:text-neutral-700 transition-colors">Sub-10ms latency across all your team's devices.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="md:col-span-2 bg-white rounded-[2rem] p-10 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[320px] group shadow-sm">
             <div className="relative z-10">
               <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mb-6 group-hover:bg-black transition-colors duration-300">
                 <BarChart3 className="w-6 h-6 text-black group-hover:text-white transition-colors" />
               </div>
               <h3 className="text-2xl font-bold mb-3 text-black">Deep Analytics</h3>
               <p className="text-neutral-500 max-w-md group-hover:text-neutral-700 transition-colors">Track retention, revenue, and staff performance.</p>
             </div>
             <div className="flex items-end gap-3 h-28 mt-8 opacity-80 group-hover:opacity-100 transition-all duration-500 relative z-10">
               <motion.div className="w-full bg-neutral-200 group-hover:bg-neutral-300 rounded-t-lg transition-colors" initial={{ height: "10%" }} whileInView={{ height: "40%" }} transition={{ delay: 0.2, duration: 0.8, type: "spring" }} viewport={{ once: true }} />
               <motion.div className="w-full bg-neutral-200 group-hover:bg-neutral-300 rounded-t-lg transition-colors" initial={{ height: "10%" }} whileInView={{ height: "60%" }} transition={{ delay: 0.3, duration: 0.8, type: "spring" }} viewport={{ once: true }} />
               <motion.div className="w-full bg-black rounded-t-lg shadow-lg group-hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-shadow" initial={{ height: "10%" }} whileInView={{ height: "90%" }} transition={{ delay: 0.4, duration: 0.8, type: "spring" }} viewport={{ once: true }} />
               <motion.div className="w-full bg-neutral-200 group-hover:bg-neutral-300 rounded-t-lg transition-colors" initial={{ height: "10%" }} whileInView={{ height: "50%" }} transition={{ delay: 0.5, duration: 0.8, type: "spring" }} viewport={{ once: true }} />
             </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <main className="w-full bg-[#E6E8EA]">
      <Variant1LightSaaS />
    </main>
  );
}
