"use client";
import React from "react";
import {
  Plus,
  Clock,
  CheckCircle2,
  Scissors,
  User,
  X,
  Play,
  AlertTriangle,
  TrendingUp,
  Users,
  Power,
  TimerReset,
  Filter,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex h-[100dvh] bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* HEADER */}
        <header className="bg-[#ECECEA]/90 backdrop-blur-md border-b border-[#DCDCDA] px-6 md:px-10 py-4 md:py-0 h-auto md:h-20 shrink-0 sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#121415] tracking-tight">Dashboard</h1>
            <p className="text-sm text-[#4A4E51] font-medium mt-0.5">Real-time client flow & queue management</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm border bg-white text-[#121415] hover:bg-[#F5F5F4] border-[#DCDCDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95"
            >
              <Power className="w-4 h-4" /> 
              <span className="hidden sm:inline">Pause Bookings</span>
            </button>

            <button
              type="button"
              className="bg-[#121415] text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Guest
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto flex flex-col pt-6">
          
          {/* KPI CARDS */}
          <div className="px-6 md:px-10 pb-6 grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
            <div className="bg-white p-5 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 text-[#4A4E51] mb-2">
                <TrendingUp className="w-4 h-4" /> 
                <span className="text-xs font-medium uppercase tracking-wider">Total Bookings</span>
              </div>
              <div className="text-3xl font-semibold text-[#121415]">12</div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 text-[#4A4E51] mb-2">
                <Users className="w-4 h-4" /> 
                <span className="text-xs font-medium uppercase tracking-wider">In Salon Now</span>
              </div>
              <div className="text-3xl font-semibold text-[#121415]">4</div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 text-[#4A4E51] mb-2">
                <Scissors className="w-4 h-4" /> 
                <span className="text-xs font-medium uppercase tracking-wider">Top Service</span>
              </div>
              <div className="text-lg font-medium text-[#121415] truncate leading-tight mt-1">
                Haircut + Beard
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col justify-between transition-colors">
              <div className="flex items-center gap-2 mb-2 text-[#8A2532]">
                <AlertTriangle className="w-4 h-4" /> 
                <span className="text-xs font-medium uppercase tracking-wider">Total Delay</span>
              </div>
              <div className="text-3xl font-semibold text-[#8A2532]">
                15 min
              </div>
            </div>
          </div>

          {/* MASTER FILTERS */}
          <div className="px-6 md:px-10 pb-4 shrink-0 flex items-center justify-between w-full overflow-hidden">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide bg-[#F5F5F4] p-1.5 rounded-xl border border-[#DCDCDA] w-full max-w-full">
              <Filter className="w-4 h-4 text-[#8B9194] shrink-0 ml-2" />
              <button type="button" className="shrink-0 px-5 py-1.5 rounded-lg text-sm font-medium transition-all bg-white text-[#121415] shadow-sm border border-[#DCDCDA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                All
              </button>
              <button type="button" className="shrink-0 px-5 py-1.5 rounded-lg text-sm font-medium transition-all text-[#4A4E51] hover:text-[#121415] border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                Ali Ahmedov
              </button>
              <button type="button" className="shrink-0 px-5 py-1.5 rounded-lg text-sm font-medium transition-all text-[#4A4E51] hover:text-[#121415] border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                Sanjar B.
              </button>
              <button type="button" className="shrink-0 px-5 py-1.5 rounded-lg text-sm font-medium transition-all text-[#4A4E51] hover:text-[#121415] border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                Timur G.
              </button>
            </div>
          </div>

          {/* KANBAN BOARD */}
          <div className="flex-1 flex gap-6 px-6 md:px-10 pb-10 overflow-x-auto items-start touch-pan-x">
            
            {/* COLUMN 1: IN CHAIR */}
            <div className="w-[340px] flex-shrink-0 flex flex-col rounded-[2rem] border p-4 shadow-sm transition-colors duration-200 bg-[#e8efe9]/50 border-[#4a6b53]/20">
              <div className="flex justify-between items-center mb-5 px-2">
                <h2 className="font-semibold text-[#121415] flex items-center gap-2 text-lg tracking-tight">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4a6b53] animate-pulse"></span>
                  In Chair
                </h2>
                <span className="text-xs font-medium text-[#4a6b53] bg-[#e8efe9] border border-[#4a6b53]/30 px-2.5 py-1 rounded-lg">2</span>
              </div>
              
              <div className="space-y-4 pb-4">
                {/* In Progress Card 1 */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#4a6b53]/30 relative group touch-pan-y cursor-grab active:cursor-grabbing">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#4a6b53] rounded-l-2xl"></div>
                  <div className="flex justify-between items-start mb-4 pl-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-[#4a6b53] uppercase tracking-wider mb-1">Master: Ali Ahmedov</span>
                      <span className="text-lg font-semibold text-[#121415] tracking-tight leading-tight">Azamat Umarov</span>
                      <span className="text-sm font-medium text-[#4A4E51] mt-0.5">Haircut + Beard</span>
                    </div>
                    <div className="bg-[#F5F5F4] px-2.5 py-1 rounded-lg border border-[#DCDCDA] text-xs font-medium text-[#4A4E51] flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> 14:00
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pl-2 border-t border-[#DCDCDA] pt-4">
                    <button type="button" className="w-full py-3 bg-[#121415] text-white rounded-xl font-medium text-sm shadow-sm hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                      <CheckCircle2 className="w-4 h-4 text-white/70" /> Complete & Call Next
                    </button>
                    <div className="flex items-center gap-2">
                      <button type="button" className="flex-1 py-2.5 bg-white text-[#121415] hover:bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                        <TimerReset className="w-3.5 h-3.5" /> +10 min delay
                      </button>
                    </div>
                  </div>
                </div>

                {/* In Progress Card 2 */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#4a6b53]/30 relative group touch-pan-y cursor-grab active:cursor-grabbing">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#4a6b53] rounded-l-2xl"></div>
                  <div className="flex justify-between items-start mb-4 pl-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-[#4a6b53] uppercase tracking-wider mb-1">Master: Sanjar B.</span>
                      <span className="text-lg font-semibold text-[#121415] tracking-tight leading-tight">Dilshod K.</span>
                      <span className="text-sm font-medium text-[#4A4E51] mt-0.5">Men's Haircut</span>
                    </div>
                    <div className="bg-[#F5F5F4] px-2.5 py-1 rounded-lg border border-[#DCDCDA] text-xs font-medium text-[#4A4E51] flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> 14:15
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pl-2 border-t border-[#DCDCDA] pt-4">
                    <button type="button" className="w-full py-3 bg-[#121415] text-white rounded-xl font-medium text-sm shadow-sm hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                      <CheckCircle2 className="w-4 h-4 text-white/70" /> Complete & Call Next
                    </button>
                    <div className="flex items-center gap-2">
                      <button type="button" className="flex-1 py-2.5 bg-white text-[#121415] hover:bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                        <TimerReset className="w-3.5 h-3.5" /> +10 min delay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: WAITING */}
            <div className="w-[340px] flex-shrink-0 flex flex-col rounded-[2rem] border p-4 shadow-sm transition-colors duration-200 bg-[#F5F5F4]/80 border-[#DCDCDA]">
              <div className="flex justify-between items-center mb-5 px-2">
                <h2 className="font-semibold text-[#121415] flex items-center gap-2 text-lg tracking-tight">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8A2532]"></span>
                  Waiting
                </h2>
                <span className="text-xs font-medium text-[#121415] bg-white border border-[#DCDCDA] shadow-sm px-2.5 py-1 rounded-lg">2</span>
              </div>
              
              <div className="space-y-4 pb-4">
                {/* Waiting Card 1 */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border transition-all duration-200 relative group touch-pan-y cursor-grab active:cursor-grabbing border-[#8A2532]/30">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#8A2532] rounded-l-2xl"></div>
                  <div className="flex justify-between items-start mb-3 pl-1">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-[#121415]">Guest 123</span>
                      <span className="text-xs font-medium text-[#4A4E51] mt-0.5">Royal Shave</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-semibold text-[#8A2532]">14:55</span>
                      <span className="text-[10px] font-medium text-[#8B9194] line-through">14:45</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F5F5F4] pl-1">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[#4A4E51] bg-[#F5F5F4] px-2 py-1 rounded-md border border-[#DCDCDA] truncate max-w-[120px]">
                      Ali Ahmedov
                    </span>
                    <span className="text-[10px] font-medium text-[#8A2532] bg-[#8A2532]/10 px-2 py-1 rounded-md">Delay +10m</span>
                  </div>
                </div>

                {/* Waiting Card 2 */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border transition-all duration-200 relative group touch-pan-y cursor-grab active:cursor-grabbing border-[#DCDCDA]">
                  <div className="flex justify-between items-start mb-3 pl-1">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-[#121415]">Malika Kh.</span>
                      <span className="text-xs font-medium text-[#4A4E51] mt-0.5">Women's Haircut</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-semibold text-[#121415]">15:00</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F5F5F4] pl-1">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[#4A4E51] bg-[#F5F5F4] px-2 py-1 rounded-md border border-[#DCDCDA] truncate max-w-[120px]">
                      Timur G.
                    </span>
                    <button type="button" className="px-4 py-2 bg-[#4a6b53]/10 text-[#4a6b53] hover:bg-[#4a6b53] hover:text-white rounded-lg text-xs font-medium transition-colors shadow-sm flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6b53]">
                      <Play className="w-3 h-3" /> Call In
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 3: COMPLETED */}
            <div className="w-[300px] flex-shrink-0 flex flex-col rounded-[2rem] border p-4 shadow-sm transition-colors duration-200 bg-[#ECECEA]/30 border-[#DCDCDA]/50 opacity-70 hover:opacity-100">
              <div className="flex justify-between items-center mb-5 px-2">
                <h2 className="font-medium text-[#8B9194] flex items-center gap-2 text-sm uppercase tracking-widest">
                  Completed
                </h2>
              </div>
              
              <div className="space-y-4 pb-4">
                {/* Completed Card 1 */}
                <div className="bg-white p-3 rounded-xl border border-[#DCDCDA] flex items-center justify-between opacity-80 group touch-pan-y cursor-grab active:cursor-grabbing">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F5F5F4] flex items-center justify-center border border-[#DCDCDA]">
                      <CheckCircle2 className="w-4 h-4 text-[#8B9194]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-[#121415] truncate max-w-[120px]">Mikhail V.</span>
                      <span className="text-[10px] font-medium text-[#8B9194]">13:00</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-[#4A4E51] bg-[#F5F5F4] px-2 py-1 rounded-lg border border-[#DCDCDA] truncate max-w-[80px]">
                    Timur G.
                  </span>
                </div>

                {/* Completed Card 2 */}
                <div className="bg-white p-3 rounded-xl border border-[#DCDCDA] flex items-center justify-between opacity-80 group touch-pan-y cursor-grab active:cursor-grabbing">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F5F5F4] flex items-center justify-center border border-[#DCDCDA]">
                      <CheckCircle2 className="w-4 h-4 text-[#8B9194]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-[#121415] truncate max-w-[120px]">Ivan M.</span>
                      <span className="text-[10px] font-medium text-[#8B9194]">12:30</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-[#4A4E51] bg-[#F5F5F4] px-2 py-1 rounded-lg border border-[#DCDCDA] truncate max-w-[80px]">
                    Ali Ahmedov
                  </span>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* NEW APPOINTMENT MODAL */}
      <div className="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-sm">
        <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
          <button type="button" className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F4] text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
            <X className="w-4 h-4" />
          </button>
          <div className="p-8 pb-6 shrink-0">
            <h2 className="text-2xl font-semibold text-[#121415] tracking-tight">New Appointment</h2>
            <p className="text-sm text-[#4A4E51] font-medium mt-1">Add guest to the daily schedule</p>
          </div>
          <form className="flex-1 overflow-y-auto px-8 py-2">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#121415] mb-2">Client Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9194]" />
                  <input type="text" name="clientName" placeholder="e.g., Azamat" className="w-full pl-12 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#121415] mb-2">Master</label>
                <div className="relative">
                  <select 
                    name="masterName" 
                    className="w-full pl-4 pr-10 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all appearance-none"
                  >
                    <option value="Ali Ahmedov">Ali Ahmedov</option>
                    <option value="Sanjar B.">Sanjar B.</option>
                    <option value="Timur G.">Timur G.</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#121415] mb-2">Service</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" className="flex flex-col items-start p-4 border border-[#DCDCDA] rounded-xl relative text-left transition-colors bg-[#F5F5F4] hover:border-[#121415] text-[#4A4E51] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                    <Scissors className="w-5 h-5 mb-2 text-[#8B9194]" />
                    <span className="font-medium text-sm">Haircut</span>
                  </button>
                  <button type="button" className="flex flex-col items-start p-4 border border-[#121415] rounded-xl relative text-left transition-colors bg-[#121415] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                    <Scissors className="w-5 h-5 mb-2 text-white" />
                    <span className="font-medium text-sm">Combo</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8 pt-6 border-t border-[#DCDCDA] pb-2">
              <button type="button" className="flex-1 py-3 bg-white hover:bg-[#F5F5F4] border border-[#DCDCDA] text-[#121415] rounded-xl font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">Cancel</button>
              <button type="button" className="flex-1 py-3 bg-[#121415] hover:opacity-90 text-white rounded-xl font-medium text-sm shadow-sm transition-all flex justify-center items-center active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                Save Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}