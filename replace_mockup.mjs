import fs from 'fs';

const file = 'src/components/Landing.tsx';
let content = fs.readFileSync(file, 'utf8');

const startMarker = '<div className="bg-white rounded-[2.5rem] w-full max-w-[360px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-[#DCDCDA] flex flex-col overflow-hidden relative group transition-transform duration-500">';
const endMarker = '              </div>\r\n            </motion.div>\r\n          </div>\r\n        </section>';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker, startIndex);

if (startIndex === -1 || endIndex === -1) {
    console.error('Markers not found');
    process.exit(1);
}

const replacement = `<div className="bg-white rounded-[2.2rem] w-full max-w-[360px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-[#DCDCDA] p-2 flex flex-col overflow-hidden relative group transition-transform duration-500">
                {/* Top Dark Card Section */}
                <div className="text-white rounded-[1.8rem] p-6 text-center relative overflow-hidden shrink-0 bg-[#121415]">
                  <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[200%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none opacity-50" />
                  <div className="relative z-10">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-white/70 mb-2 truncate">
                      Scheduled for
                    </p>
                    <h2 className="text-6xl font-semibold mb-6 tracking-tighter text-white truncate w-full">
                      14:00
                    </h2>
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/5 backdrop-blur-md max-w-full">
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white truncate">
                        Confirmed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Info Section */}
                <div className="p-4 pt-6 pb-2 flex flex-col min-w-0 w-full">
                  <div className="text-center mb-6 min-w-0 w-full flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A2532] bg-[#8A2532]/10 px-3 py-1 rounded-full mb-3 inline-flex">
                      Hair Salon
                    </span>
                    <h1 className="text-xl font-semibold text-[#121415] tracking-tight leading-snug">
                      Alexander Studio
                    </h1>
                    <p className="text-sm font-medium text-[#4A4E51] mt-1 leading-relaxed">
                      Premium Hair Styling
                    </p>
                  </div>

                  {/* Info Badge */}
                  <div className="p-3 rounded-2xl mb-6 text-center bg-[#F5F5F4] border border-[#DCDCDA]">
                    <p className="text-xs font-medium text-[#121415] leading-relaxed flex items-center justify-center gap-2">
                      <Info className="w-4 h-4 text-[#8A2532] shrink-0" />
                      <span>
                        The professional will be available exactly on time.
                      </span>
                    </p>
                  </div>

                  {/* Stepper */}
                  <div className="grid grid-cols-4 mb-8 px-1 shrink-0 w-full relative z-0">
                    {/* Step 1: Upcoming */}
                    <div className="relative flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 bg-white border-[#121415] shadow-[0_0_12px_rgba(18,20,21,0.15)]">
                        <Calendar className="w-4 h-4 text-[#121415]" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest truncate text-[#121415]">
                        Upcoming
                      </span>
                    </div>

                    {/* Step 2: Queue */}
                    <div className="relative flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 bg-[#F5F5F4] border-[#DCDCDA]">
                        <MoreHorizontal className="w-4 h-4 text-[#DCDCDA]" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest truncate text-[#787D80]">
                        Queue
                      </span>
                    </div>

                    {/* Step 3: In Chair */}
                    <div className="relative flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 bg-[#F5F5F4] border-[#DCDCDA]">
                        <Scissors className="w-4 h-4 text-[#DCDCDA]" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest truncate text-[#787D80]">
                        In chair
                      </span>
                    </div>

                    {/* Step 4: Completed */}
                    <div className="relative flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 bg-[#F5F5F4] border-[#DCDCDA]">
                        <CheckCircle2 className="w-4 h-4 text-[#DCDCDA]" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest truncate text-[#787D80]">
                        Completed
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-6 bg-[#F5F5F4] p-4 rounded-2xl border border-[#DCDCDA] flex flex-col min-w-0 w-full">
                    <div className="flex items-center justify-between gap-4 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A4E51] shrink-0">
                        Professional
                      </span>
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-white border border-[#DCDCDA] flex items-center justify-center text-[10px] font-bold text-[#121415] shrink-0">
                          MI
                        </div>
                        <span className="text-sm font-semibold text-[#121415] truncate">
                          Michael
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-px bg-[#DCDCDA] shrink-0" />

                    <div className="flex items-center justify-between gap-4 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A4E51] shrink-0">
                        Date
                      </span>
                      <span className="text-sm font-semibold text-[#121415] flex items-center gap-1.5 truncate">
                        <Calendar className="w-4 h-4 text-[#4A4E51] shrink-0" />
                        <span className="truncate">Oct 24, 2024</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 shrink-0">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-10 w-full rounded-xl border border-[#DCDCDA] flex items-center justify-center gap-2 text-xs font-medium text-[#121415] hover:bg-[#F5F5F4] cursor-pointer">
                        <Navigation className="w-4 h-4" />
                        Directions
                      </div>
                      <div className="h-10 w-full rounded-xl border border-[#DCDCDA] flex items-center justify-center gap-2 text-xs font-medium text-[#121415] hover:bg-[#F5F5F4] cursor-pointer">
                        <PhoneCall className="w-4 h-4" />
                        Contact
                      </div>
                    </div>

                    <div className="h-10 w-full rounded-xl flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-[#4A4E51] hover:text-[#DC2626] hover:bg-[#DC2626]/5 cursor-pointer">
                      Cancel booking
                    </div>
                  </div>
                </div>
              </div>\n';

const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
fs.writeFileSync(file, newContent, 'utf8');
console.log('Replacement done.');
