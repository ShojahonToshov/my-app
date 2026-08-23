import fs from 'fs';

const file = 'c:/Users/user/Desktop/Elara/my-app/src/components/Landing.tsx';
let content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

const startIdx = lines.findIndex(l => l.includes('{/* Product Showcase UI */}'));
let endIdx = -1;
if (startIdx !== -1) {
    for (let i = startIdx; i < lines.length; i++) {
        if (lines[i].includes('</section>')) {
            endIdx = i; // Include the closing </section> of the hero
            break;
        }
    }
}

if (startIdx !== -1 && endIdx !== -1) {
  const newSections = `        </section>

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
                Your Digital Live Ticket
              </h2>
              <p className="text-[#4A4E51] text-lg font-medium leading-relaxed max-w-lg">
                The ultimate customer experience. Access real-time booking updates, QR check-ins, and one-tap rescheduling—all beautifully organized in a single, interactive pass.
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
                <div className="h-32 bg-[#ECECEA] relative overflow-hidden flex items-center justify-center">
                   <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#DCDCDA] to-transparent animate-pulse" />
                   <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center relative z-10">
                     <Star className="w-6 h-6 text-[#8A2532]" />
                   </div>
                </div>

                <div className="p-8 flex flex-col">
                  <div className="text-center mb-8 space-y-3">
                    <div className="h-6 w-3/4 bg-[#121415] rounded-md mx-auto animate-pulse" />
                    <div className="h-4 w-1/2 bg-[#8B9194] rounded-md mx-auto animate-pulse" />
                  </div>

                  <div className="p-4 rounded-xl mb-8 bg-[#F5F5F4] border border-[#DCDCDA] flex gap-3 items-center">
                     <div className="w-5 h-5 rounded-full bg-[#8A2532]/20 shrink-0" />
                     <div className="space-y-2 flex-1">
                        <div className="h-2 w-full bg-[#DCDCDA] rounded-full animate-pulse" />
                        <div className="h-2 w-2/3 bg-[#DCDCDA] rounded-full animate-pulse" />
                     </div>
                  </div>

                  <div className="grid grid-cols-3 mb-8 relative">
                     <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className="w-10 h-10 rounded-full border-2 bg-white border-[#8A2532] shadow-[0_0_12px_rgba(138,37,50,0.15)] animate-pulse" />
                        <div className="h-1.5 w-12 bg-[#8A2532]/40 rounded-full" />
                     </div>
                     <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-[#F5F5F4] border-2 border-[#DCDCDA]" />
                        <div className="h-1.5 w-12 bg-[#DCDCDA] rounded-full" />
                     </div>
                     <div className="flex flex-col items-center gap-2 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-[#F5F5F4] border-2 border-[#DCDCDA]" />
                        <div className="h-1.5 w-12 bg-[#DCDCDA] rounded-full" />
                     </div>
                     {/* Connector line */}
                     <div className="absolute top-5 left-[15%] right-[15%] h-[2px] bg-[#DCDCDA] -z-0" />
                  </div>

                  <div className="bg-[#F5F5F4] p-5 rounded-2xl border border-[#DCDCDA] mb-8 space-y-4">
                     <div className="flex justify-between items-center">
                        <div className="h-3 w-20 bg-[#8B9194] rounded-full" />
                        <div className="h-5 w-24 bg-[#121415] rounded-md animate-pulse" />
                     </div>
                     <div className="w-full h-px bg-[#DCDCDA]" />
                     <div className="flex justify-between items-center">
                        <div className="h-3 w-16 bg-[#8B9194] rounded-full" />
                        <div className="h-5 w-28 bg-[#121415] rounded-md animate-pulse" />
                     </div>
                  </div>

                  <div className="space-y-4 mt-auto">
                     <div className="grid grid-cols-2 gap-3">
                        <div className="h-12 bg-white border border-[#DCDCDA] rounded-full animate-pulse shadow-sm" />
                        <div className="h-12 bg-white border border-[#DCDCDA] rounded-full animate-pulse shadow-sm" />
                     </div>
                     <div className="h-12 bg-[#DC2626]/5 rounded-full animate-pulse border border-[#DC2626]/10" />
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
                Powerful Partner Dashboard
              </h2>
              <p className="text-[#4A4E51] text-lg font-medium leading-relaxed max-w-lg">
                Total operational control. Manage your team's schedules, analyze revenue insights, and track Karma metrics in a calm, distraction-free environment.
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
                <div className="bg-[#F5F5F4] rounded-[1.5rem] w-full h-[400px] md:h-[480px] border border-[#DCDCDA]/60 flex flex-col overflow-hidden relative">
                  
                  {/* Header */}
                  <div className="bg-white p-5 flex justify-between items-center border-b border-[#DCDCDA]">
                     <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl bg-[#121415] flex items-center justify-center">
                           <div className="w-4 h-4 bg-white/20 rounded-sm" />
                        </div>
                        <div className="space-y-2">
                           <div className="h-4 w-32 bg-[#121415] rounded-full" />
                           <div className="h-2 w-20 bg-[#8B9194] rounded-full" />
                        </div>
                     </div>
                     <div className="h-10 w-32 bg-[#121415] rounded-xl animate-pulse shadow-sm" />
                  </div>

                  {/* Content - Kanban */}
                  <div className="flex-1 p-5 flex gap-5 overflow-hidden">
                     {/* Column 1: Waiting */}
                     <div className="flex-1 flex flex-col gap-4 min-w-[140px]">
                        <div className="flex justify-between items-center mb-2 px-1">
                           <div className="h-3 w-20 bg-[#8B9194] rounded-full" />
                           <div className="h-5 w-8 bg-[#DCDCDA] rounded-full" />
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col gap-4">
                           <div className="flex gap-3 items-center">
                              <div className="w-8 h-8 rounded-full bg-[#F5F5F4] border border-[#DCDCDA]" />
                              <div className="space-y-2 flex-1">
                                 <div className="h-2 w-3/4 bg-[#121415] rounded-full animate-pulse" />
                                 <div className="h-1.5 w-1/2 bg-[#8B9194] rounded-full" />
                              </div>
                           </div>
                           <div className="h-5 w-20 bg-[#F5F5F4] border border-[#DCDCDA] rounded-md animate-pulse" />
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col gap-4 opacity-80">
                           <div className="flex gap-3 items-center">
                              <div className="w-8 h-8 rounded-full bg-[#F5F5F4] border border-[#DCDCDA]" />
                              <div className="space-y-2 flex-1">
                                 <div className="h-2 w-2/3 bg-[#121415] rounded-full animate-pulse" />
                                 <div className="h-1.5 w-1/2 bg-[#8B9194] rounded-full" />
                              </div>
                           </div>
                           <div className="h-5 w-16 bg-[#F5F5F4] border border-[#DCDCDA] rounded-md animate-pulse" />
                        </div>
                     </div>

                     {/* Column 2: In Chair */}
                     <div className="flex-1 flex flex-col gap-4 min-w-[140px]">
                        <div className="flex justify-between items-center mb-2 px-1">
                           <div className="h-3 w-20 bg-[#8A2532] rounded-full" />
                           <div className="h-5 w-8 bg-[#8A2532]/20 rounded-full" />
                        </div>
                        <div className="bg-white p-4 rounded-2xl border-2 border-[#8A2532] shadow-md flex flex-col gap-4 relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-12 h-12 bg-[#8A2532]/5 rounded-bl-2xl" />
                           <div className="flex gap-3 items-center relative z-10">
                              <div className="w-8 h-8 rounded-full bg-[#8A2532]/10 border border-[#8A2532]/20" />
                              <div className="space-y-2 flex-1">
                                 <div className="h-2 w-3/4 bg-[#121415] rounded-full animate-pulse" />
                                 <div className="h-1.5 w-1/2 bg-[#8B9194] rounded-full" />
                              </div>
                           </div>
                           <div className="h-5 w-24 bg-[#8A2532]/10 border border-[#8A2532]/20 rounded-md animate-pulse relative z-10" />
                        </div>
                     </div>

                     {/* Column 3: Completed */}
                     <div className="flex-1 flex flex-col gap-4 min-w-[140px] opacity-60">
                        <div className="flex justify-between items-center mb-2 px-1">
                           <div className="h-3 w-24 bg-[#8B9194] rounded-full" />
                           <div className="h-5 w-8 bg-[#DCDCDA] rounded-full" />
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col gap-4">
                           <div className="flex gap-3 items-center">
                              <div className="w-8 h-8 rounded-full bg-[#121415] border border-[#121415]" />
                              <div className="space-y-2 flex-1">
                                 <div className="h-2 w-full bg-[#121415] rounded-full" />
                                 <div className="h-1.5 w-1/2 bg-[#8B9194] rounded-full" />
                              </div>
                           </div>
                           <div className="h-5 w-20 bg-[#F5F5F4] border border-[#DCDCDA] rounded-md" />
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>`;

  lines.splice(startIdx, endIdx - startIdx + 1, newSections);
  fs.writeFileSync(file, lines.join('\n'), 'utf8');
  console.log('Successfully replaced mockups with separate sections!');
} else {
  console.log('Failed to find section limits', startIdx, endIdx);
}
