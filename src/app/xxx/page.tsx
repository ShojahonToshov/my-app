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
// VARIANT 1: The Original (Vercel / Linear Dark SaaS)
// ---------------------------------------------------------
function Variant1DarkSaaS() {
  return (
    <section className="min-h-screen bg-black text-white py-32 px-6 relative overflow-hidden font-sans border-b border-white/10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">Precision scheduling.<br/>Engineered for scale.</h2>
          <p className="text-neutral-400 text-lg max-w-xl">Everything you need to run your operations at lightspeed. No clutter, just pure performance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 hover:bg-[#111] transition-colors group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity"><LayoutDashboard className="w-24 h-24 text-neutral-800" /></div>
             <LayoutDashboard className="w-6 h-6 text-neutral-300 mb-6" />
             <h3 className="text-xl font-medium mb-2">Kanban Timeline</h3>
             <p className="text-neutral-500 max-w-md">Drag and drop your appointments with zero latency. Built on a custom rendering engine for unmatched speed.</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 hover:bg-[#111] transition-colors relative overflow-hidden">
             <ShieldCheck className="w-6 h-6 text-neutral-300 mb-6" />
             <h3 className="text-xl font-medium mb-2">Fraud Protection</h3>
             <p className="text-neutral-500">Automated deposits for high-risk bookings.</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 hover:bg-[#111] transition-colors relative overflow-hidden">
             <Zap className="w-6 h-6 text-neutral-300 mb-6" />
             <h3 className="text-xl font-medium mb-2">Instant Sync</h3>
             <p className="text-neutral-500">Sub-10ms latency across all your team's devices.</p>
          </div>
          <div className="md:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 hover:bg-[#111] transition-colors relative overflow-hidden flex flex-col justify-between min-h-[300px]">
             <div>
               <BarChart3 className="w-6 h-6 text-neutral-300 mb-6" />
               <h3 className="text-xl font-medium mb-2">Deep Analytics</h3>
               <p className="text-neutral-500 max-w-md">Track retention, revenue, and staff performance.</p>
             </div>
             <div className="flex items-end gap-2 h-24 mt-8 opacity-50 grayscale group-hover:grayscale-0 transition-all">
               <div className="w-full bg-white/10 rounded-t-sm h-[40%]" />
               <div className="w-full bg-white/10 rounded-t-sm h-[60%]" />
               <div className="w-full bg-indigo-500 rounded-t-sm h-[90%]" />
               <div className="w-full bg-white/10 rounded-t-sm h-[50%]" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------
// VARIANT 2: Neon Glow Borders (Subtle colorful edge highlights)
// ---------------------------------------------------------
function Variant2NeonBorders() {
  return (
    <section className="min-h-screen bg-[#030303] text-white py-32 px-6 relative font-sans border-b border-white/10">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Dark matter aesthetics.</h2>
          <p className="text-[#888] text-lg max-w-2xl mx-auto">Vibrant accents that illuminate your workflow when you need them.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Fluid Calendar", icon: <Calendar />, color: "from-blue-500 to-cyan-400" },
            { title: "Client CRM", icon: <Users />, color: "from-purple-500 to-pink-500" },
            { title: "Live Ticket", icon: <Smartphone />, color: "from-emerald-500 to-teal-400" },
            { title: "Karma Engine", icon: <ShieldCheck />, color: "from-orange-500 to-red-500" },
            { title: "Payments", icon: <CreditCard />, color: "from-indigo-500 to-purple-500" },
            { title: "Analytics", icon: <BarChart3 />, color: "from-yellow-400 to-orange-500" },
          ].map((item, idx) => (
            <div key={idx} className="relative group rounded-2xl p-[1px] bg-white/10 hover:bg-gradient-to-br transition-all duration-500 overflow-hidden" style={{ backgroundImage: `var(--tw-gradient-stops)` }}>
              {/* The glowing border effect uses tailwind gradient classes passed dynamically, but we handle it via group-hover pseudo-element in CSS ideally. Here we simulate it with a colored backdrop that reveals on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative bg-[#0A0A0A] rounded-[15px] h-full p-8 flex flex-col items-start z-10">
                 <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                   {React.cloneElement(item.icon as React.ReactElement, { className: "w-6 h-6 text-white/70 group-hover:text-white" })}
                 </div>
                 <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                 <p className="text-[#888] text-sm leading-relaxed">Advanced algorithms running in the background to ensure absolute reliability and speed.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------
// VARIANT 3: Horizontal Slabs (Editorial Dark)
// ---------------------------------------------------------
function Variant3HorizontalSlabs() {
  return (
    <section className="min-h-screen bg-[#050505] text-white py-32 px-6 relative font-sans border-b border-white/10">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-16">The complete toolkit.</h2>
        
        <div className="flex flex-col border-t border-white/10">
          {[
            { num: "01", title: "Intelligent Booking", desc: "Drag, drop, and extend appointments on a flawlessly smooth timeline. Built with native performance in mind." },
            { num: "02", title: "Automated Protection", desc: "Our Karma engine calculates client risk in milliseconds and requires deposits only when necessary." },
            { num: "03", title: "Deep Insights", desc: "Beautiful, exportable charts that give you absolute clarity over your revenue and staff performance." },
          ].map((item, idx) => (
            <div key={idx} className="group flex flex-col md:flex-row gap-8 md:gap-16 items-start md:items-center py-12 border-b border-white/10 hover:bg-white/[0.02] transition-colors px-6 -mx-6 rounded-xl cursor-pointer">
               <div className="text-5xl font-black text-white/10 group-hover:text-white/30 transition-colors font-mono">{item.num}</div>
               <div className="flex-1">
                 <h3 className="text-3xl font-semibold mb-3 group-hover:translate-x-2 transition-transform duration-300">{item.title}</h3>
                 <p className="text-neutral-500 text-lg max-w-xl group-hover:text-neutral-400 transition-colors">{item.desc}</p>
               </div>
               <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                 <ArrowRight className="w-5 h-5" />
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------
// VARIANT 4: Command Center (Tabs + Large Display)
// ---------------------------------------------------------
function Variant4CommandCenter() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { title: "Kanban Board", icon: <LayoutDashboard />, color: "bg-blue-500" },
    { title: "Karma Engine", icon: <ShieldCheck />, color: "bg-orange-500" },
    { title: "Live Ticket", icon: <Smartphone />, color: "bg-emerald-500" },
  ];

  return (
    <section className="min-h-screen bg-[#09090B] text-white py-32 px-6 relative font-sans border-b border-white/10 flex flex-col items-center justify-center">
      <div className="max-w-6xl w-full mx-auto">
        <h2 className="text-4xl font-bold tracking-tight mb-12 text-center">Centralized Control.</h2>
        
        <div className="flex flex-col lg:flex-row gap-6 bg-white/[0.03] border border-white/10 rounded-[2rem] p-4 h-[600px] overflow-hidden backdrop-blur-3xl shadow-2xl">
          
          {/* Sidebar */}
          <div className="w-full lg:w-80 flex flex-col gap-2 p-4">
            {tabs.map((tab, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 ${activeTab === idx ? 'bg-white/10 text-white' : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300'}`}
              >
                <div className={`${activeTab === idx ? 'text-white' : 'text-neutral-500'}`}>
                  {React.cloneElement(tab.icon as React.ReactElement, { className: "w-6 h-6" })}
                </div>
                <span className="font-medium text-lg">{tab.title}</span>
                {activeTab === idx && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            ))}
          </div>

          {/* Main Display Area */}
          <div className="flex-1 bg-[#000] rounded-2xl border border-white/10 relative overflow-hidden flex items-center justify-center">
             {/* Dynamic background glow based on active tab */}
             <div className={`absolute inset-0 opacity-20 blur-[100px] transition-colors duration-700 ${tabs[activeTab].color}`} />
             
             <AnimatePresence mode="wait">
               <motion.div 
                 key={activeTab}
                 initial={{ opacity: 0, y: 20, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: -20, scale: 0.95 }}
                 transition={{ duration: 0.4 }}
                 className="relative z-10 text-center flex flex-col items-center"
               >
                 <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-6 backdrop-blur-md">
                   {React.cloneElement(tabs[activeTab].icon as React.ReactElement, { className: "w-10 h-10 text-white" })}
                 </div>
                 <h3 className="text-3xl font-bold mb-4">{tabs[activeTab].title}</h3>
                 <p className="text-neutral-400 max-w-sm">Deeply integrated functionality designed specifically for high-volume modern businesses.</p>
               </motion.div>
             </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------
// VARIANT 5: Brutalist / Wireframe Grid (Sharp lines, no rounding)
// ---------------------------------------------------------
function Variant5WireframeGrid() {
  return (
    <section className="min-h-screen bg-black text-white py-32 font-sans border-b border-white/20 relative">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <h2 className="text-6xl uppercase font-black tracking-tighter mb-16 border-l-4 border-white pl-6">Core<br/>Architecture</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-white/20 bg-black/50 backdrop-blur-sm">
          {[
            { title: "TIMELINE", desc: "Hardware-accelerated rendering.", icon: <Activity /> },
            { title: "DATABASE", desc: "Encrypted at rest and in transit.", icon: <Lock /> },
            { title: "NETWORK", desc: "Real-time WebSocket syncing.", icon: <Zap /> },
            { title: "REVENUE", desc: "Stripe-powered infrastructure.", icon: <CreditCard /> },
          ].map((item, idx) => (
            <div key={idx} className="p-8 border-[0.5px] border-white/20 hover:bg-white/10 transition-colors group">
              <div className="mb-12 opacity-50 group-hover:opacity-100 transition-opacity">
                {React.cloneElement(item.icon as React.ReactElement, { className: "w-8 h-8" })}
              </div>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-4">{item.title}</h3>
              <p className="text-neutral-500 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------
// VARIANT 6: Cosmic / Deep Space (Dots, radial gradients, glass)
// ---------------------------------------------------------
function Variant6CosmicGlass() {
  return (
    <section className="min-h-screen bg-[#02040A] text-white py-32 px-6 relative font-sans">
      {/* Stars / Dots Background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10 text-center">
        <h2 className="text-5xl font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
          Infinite possibilities.
        </h2>
        <p className="text-blue-200/50 text-xl max-w-2xl mx-auto mb-20">A universe of features designed to elevate your business to the next dimension.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Stellar Sync", desc: "Your data orbits across all devices instantly." },
            { title: "Gravity Engine", desc: "Pull clients in and keep them coming back." },
            { title: "Dark Matter Security", desc: "Invisible but impenetrable data protection." },
          ].map((item, idx) => (
            <div key={idx} className="relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent overflow-hidden group">
               <div className="absolute inset-0 bg-blue-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <div className="relative bg-[#050914]/80 backdrop-blur-xl h-full rounded-[23px] p-10 flex flex-col items-center border border-white/5 group-hover:border-white/10 transition-colors">
                 <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                   <Zap className="w-6 h-6 text-blue-400" />
                 </div>
                 <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                 <p className="text-blue-100/40">{item.desc}</p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <main className="w-full bg-black">
      <div className="bg-neutral-900 text-white py-4 text-center text-sm font-bold uppercase tracking-widest sticky top-0 z-50 border-b border-white/10 shadow-xl">
        Variant 1: Original (Dark SaaS Bento)
      </div>
      <Variant1DarkSaaS />

      <div className="bg-neutral-900 text-white py-4 text-center text-sm font-bold uppercase tracking-widest sticky top-0 z-50 border-b border-white/10 shadow-xl">
        Variant 2: Neon Glow Borders
      </div>
      <Variant2NeonBorders />

      <div className="bg-neutral-900 text-white py-4 text-center text-sm font-bold uppercase tracking-widest sticky top-0 z-50 border-b border-white/10 shadow-xl">
        Variant 3: Editorial Horizontal Slabs
      </div>
      <Variant3HorizontalSlabs />

      <div className="bg-neutral-900 text-white py-4 text-center text-sm font-bold uppercase tracking-widest sticky top-0 z-50 border-b border-white/10 shadow-xl">
        Variant 4: Interactive Command Center
      </div>
      <Variant4CommandCenter />

      <div className="bg-neutral-900 text-white py-4 text-center text-sm font-bold uppercase tracking-widest sticky top-0 z-50 border-b border-white/10 shadow-xl">
        Variant 5: Wireframe Architecture
      </div>
      <Variant5WireframeGrid />

      <div className="bg-neutral-900 text-white py-4 text-center text-sm font-bold uppercase tracking-widest sticky top-0 z-50 border-b border-white/10 shadow-xl">
        Variant 6: Cosmic Deep Space Glass
      </div>
      <Variant6CosmicGlass />
    </main>
  );
}
