const fs = require('fs');
let content = fs.readFileSync('src/components/Landing.tsx', 'utf8');

// The Live Ticket section starts around line 338 with `<div className="bg-white rounded-[2.5rem] w-full max-w-[360px]`
// We will replace this entire div.

const newTicket = `              <div className="bg-white rounded-[2.5rem] w-full max-w-[360px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-[#DCDCDA] flex flex-col overflow-hidden relative group hover:-translate-y-2 transition-transform duration-500">
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
                        {([...Array(16)].map((_, i) => (
                          <div key={i} className={rounded-sm ${[0,1,3,4,6,7,9,11,13,14,15].includes(i) ? 'bg-[#121415]' : 'bg-transparent'}} />
                        ))}
                     </div>
                  </div>

                  <div className="space-y-3 mt-auto">
                     <button className="w-full py-3 bg-white border border-[#DCDCDA] rounded-xl text-sm font-semibold text-[#121415] shadow-sm hover:bg-[#F5F5F4] transition-colors">
                       Reschedule
                     </button>
                  </div>
                </div>
              </div>` .replace(/\\$/g, '$');

const newKanban = `              <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-[#DCDCDA] p-3 md:p-4 overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
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
                     <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#121415] text-white rounded-lg teyt-xs font-semibold shadow-sm">
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
                               VH</div>
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
                             <ChieldCheck className="w-3 h-3 text-[#4A6B53]" />
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
              </div>`  .replace(/\\$/g, '$');

// Replace Ticket
const ticketStartRegex = /<div className="bg-white rounded-\[2\.5rem\] w-full max-w-\[360px\\][^>]*>/;
const ticketEndStr = '            </motion.div>\n          </div>\n        </section>\n\n        {/* Business Dashboard Section */}';

let ticketStart = content.search(ticketStartRegex);
if (ticketStart !== -1) {
    let ticketEnd = content.indexOf(ticketEndStr, ticketStart);
    if (ticketEnd !== -1) {
        content = content.substring(0, ticketStart) + newTicket + '\n' + content.substring(ticketEnd);
        console.log("Ticket updated");
    } else {
      console.log("Couldnt find ticketEnd");
    }
} else {
  console.log("Couldnt find ticketStart");
}

// Replace Kanban
const kanbanStartRegex = /<div className="bg-white rounded-\[2\.5rem\][^>]*>/;
const kanbanEndStr = '            </motion.div>\n          </div>\n        </section>\n\n        {/* Features Section */}';

let kanbanStart = content.search(kanbanStartRegex);
// kanbanStart will find the first one (ticket), so we need to find it after Business Dashboard Section
let dashboardMarker = content.indexOf('{/* Business Dashboard Section */}');
if (dashboardMarker !== -1) {
  kanbanStart = content.indexOf('<div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_ngba(0,0,0,0.1)] border border-[#DCDCDA] p-3 md:p-4 overflow-hidden group hover:-translate-y-2 transition-transform duration-500">', dashboardMarker);
  if (kanbanStart !== -1) {
    let kanbanEnd = content.indexOf(kanbanEndStr, kanbanStart);
    if (kanbanEnd !== -1) {
        content = content.substring(0, kanbanStart) + newKanban + '\n' + content.substring(kanbanEnd);
        console.log("Kanban updated");
    } else {
      console.log("Couldnt find kanbanEnd");
    }
  } else {
    console.log("Couldnt find kanbanStart");
  }
}


fs.writeFileSync('src/components/Landing.tsx', content);
