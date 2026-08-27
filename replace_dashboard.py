import re

with open('src/components/Landing.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix imports
if 'TimerReset,' not in content:
    content = content.replace(
        "} from \"lucide-react\";",
        "  Play,\n  Clock,\n  TimerReset,\n} from \"lucide-react\";"
    )

start_marker = '{/* Content - Kanban */}'
end_marker = '                  </div>\n                </div>\n              </div>\n            </motion.div>'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx == -1 or end_idx == -1:
    print("Markers not found!")
    exit(1)

replacement = """{/* Content - Kanban */}
                  <div className="flex-1 p-4 md:p-5 flex gap-4 overflow-x-auto snap-x items-start">
                     {/* Column 1: Waiting */}
                     <div className="flex-1 min-w-[240px] max-w-[280px] flex flex-col rounded-2xl border p-4 shadow-sm transition-colors duration-200 bg-[#F5F5F4]/80 border-[#DCDCDA] snap-center">
                        <div className="flex justify-between items-center mb-5 px-1">
                           <h2 className="font-semibold text-[#121415] flex items-center gap-2 text-sm tracking-tight">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#C89E23]"></span>
                              Waiting
                           </h2>
                           <span className="text-[10px] font-medium text-[#121415] bg-white border border-[#DCDCDA] shadow-sm px-2 py-0.5 rounded-md">
                              2
                           </span>
                        </div>
                        <div className="space-y-3 pb-2">
                           <div className="bg-white p-3 rounded-2xl border transition-all duration-200 relative border-[#DCDCDA] shadow-sm overflow-hidden">
                              <div className="absolute top-0 left-0 w-1 h-full bg-[#C89E23]"></div>
                              <div className="flex justify-between items-start mb-2 pl-2">
                                 <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-[#121415] leading-tight">Sarah Jenkins</span>
                                    <span className="text-[10px] font-medium text-[#4A4E51] mt-0.5">Hair Coloring</span>
                                 </div>
                                 <div className="flex flex-col items-end">
                                    <span className="text-[11px] font-semibold text-[#121415]">14:00</span>
                                 </div>
                              </div>
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F5F5F4] pl-2">
                                 <span className="text-[9px] font-medium uppercase tracking-wider text-[#4A4E51] bg-[#F5F5F4] px-1.5 py-0.5 rounded border border-[#DCDCDA]">
                                    Any Professional
                                 </span>
                                 <button type="button" className="px-2 py-1 bg-[#4a6b53]/10 text-[#4a6b53] rounded text-[9px] font-medium shadow-sm flex items-center gap-1">
                                    <Play className="w-2 h-2" /> Call In
                                 </button>
                              </div>
                           </div>

                           <div className="bg-white p-3 rounded-2xl border transition-all duration-200 relative border-[#DCDCDA] shadow-sm overflow-hidden">
                              <div className="absolute top-0 left-0 w-1 h-full bg-[#C89E23]"></div>
                              <div className="flex justify-between items-start mb-2 pl-2">
                                 <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-[#121415] leading-tight">Elena Rostova</span>
                                    <span className="text-[10px] font-medium text-[#4A4E51] mt-0.5">Consultation</span>
                                 </div>
                                 <div className="flex flex-col items-end">
                                    <span className="text-[11px] font-semibold text-[#121415]">14:30</span>
                                 </div>
                              </div>
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F5F5F4] pl-2">
                                 <span className="text-[9px] font-medium uppercase tracking-wider text-[#4A4E51] bg-[#F5F5F4] px-1.5 py-0.5 rounded border border-[#DCDCDA]">
                                    Any Professional
                                 </span>
                                 <button type="button" className="px-2 py-1 bg-[#4a6b53]/10 text-[#4a6b53] rounded text-[9px] font-medium shadow-sm flex items-center gap-1">
                                    <Play className="w-2 h-2" /> Call In
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Column 2: In Chair */}
                     <div className="flex-1 min-w-[240px] max-w-[280px] flex flex-col rounded-2xl border p-4 shadow-sm transition-colors duration-200 bg-[#e8efe9]/50 border-[#4a6b53]/20 snap-center">
                        <div className="flex justify-between items-center mb-5 px-1">
                           <h2 className="font-semibold text-[#121415] flex items-center gap-2 text-sm tracking-tight">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#4a6b53] animate-pulse"></span>
                              In Chair
                           </h2>
                           <span className="text-[10px] font-medium text-[#4a6b53] bg-[#e8efe9] border border-[#4a6b53]/30 px-2 py-0.5 rounded-md">
                              1
                           </span>
                        </div>
                        <div className="space-y-3 pb-2">
                           <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#4a6b53]/30 relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#4a6b53]"></div>
                              <div className="flex justify-between items-start mb-3 pl-2">
                                 <div className="flex flex-col">
                                    <span className="text-[9px] font-medium text-[#4a6b53] uppercase tracking-wider mb-1">Staff: Michael</span>
                                    <span className="text-sm font-semibold text-[#121415] tracking-tight leading-tight">Michael Scott</span>
                                    <span className="text-[10px] font-medium text-[#4A4E51] mt-0.5">Premium Cut & Beard</span>
                                 </div>
                                 <div className="bg-[#F5F5F4] px-1.5 py-0.5 rounded-md border border-[#DCDCDA] text-[9px] font-medium text-[#4A4E51] flex items-center gap-1">
                                    <Clock className="w-2 h-2" /> 13:00
                                 </div>
                              </div>
                              <div className="flex flex-col gap-2 pl-2 border-t border-[#DCDCDA] pt-3">
                                 <button type="button" className="w-full py-1.5 bg-[#121415] text-white rounded-lg font-medium text-[10px] shadow-sm flex items-center justify-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-white/70" /> Complete & Call Next
                                 </button>
                                 <div className="flex items-center gap-2">
                                    <button type="button" className="flex-1 py-1.5 bg-white text-[#121415] border border-[#DCDCDA] rounded-lg font-medium text-[9px] flex items-center justify-center gap-1">
                                       <TimerReset className="w-2.5 h-2.5" /> +10 min delay
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Column 3: Completed */}
                     <div className="flex-1 min-w-[200px] max-w-[240px] flex flex-col rounded-2xl border p-4 shadow-sm transition-colors duration-200 bg-[#ECECEA]/30 border-[#DCDCDA]/50 opacity-70 snap-center">
                        <div className="flex justify-between items-center mb-5 px-1">
                           <h2 className="font-medium text-[#8B9194] flex items-center gap-2 text-[11px] uppercase tracking-widest">
                              Completed
                           </h2>
                           <span className="text-[10px] font-medium text-[#8B9194] bg-[#F5F5F4] border border-[#DCDCDA] px-2 py-0.5 rounded-md">
                              1
                           </span>
                        </div>
                        <div className="space-y-3 pb-2">
                           <div className="bg-white p-2.5 rounded-xl border border-[#DCDCDA] flex flex-col gap-2 opacity-80">
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-2.5">
                                    <div className="w-6 h-6 rounded-full bg-[#F5F5F4] flex items-center justify-center border border-[#DCDCDA]">
                                       <CheckCircle2 className="w-3 h-3 text-[#8B9194]" />
                                    </div>
                                    <div className="flex flex-col">
                                       <span className="text-[11px] font-medium text-[#121415] truncate max-w-[80px]">David Lin</span>
                                       <div className="flex items-center gap-1 mt-0.5">
                                          <span className="text-[9px] font-medium text-[#8B9194]">12:00</span>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex flex-col items-end gap-1">
                                    <span className="text-[8px] font-medium text-[#4A4E51] bg-[#F5F5F4] px-1.5 py-0.5 rounded border border-[#DCDCDA] truncate max-w-[60px]">
                                       Michael
                                    </span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>\n"""

new_content = content[:start_idx] + replacement + content[end_idx:]

with open('src/components/Landing.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Done replacing dashboard mockup")
