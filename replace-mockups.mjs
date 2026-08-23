import fs from 'fs';

const file = 'c:/Users/user/Desktop/Elara/my-app/src/components/Landing.tsx';
let content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
const startIdx = lines.findIndex(l => l.includes('Product Showcase UI'));
let endIdx = -1;
if (startIdx !== -1) {
    for (let i = startIdx; i < lines.length; i++) {
        if (lines[i].includes('</section>')) {
            endIdx = i - 1; // line before </section>
            break;
        }
    }
}

if (startIdx !== -1 && endIdx !== -1) {
  const newSection = `          {/* Ecosystem Showcases */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="w-full max-w-6xl mx-auto mt-24 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 text-left"
          >
            {/* Customer Live Ticket */}
            <div className="flex flex-col group">
              <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] p-3 md:p-4 mb-6 border border-[#DCDCDA]/40 group-hover:-translate-y-1 transition-transform duration-500">
                <div className="bg-[#F5F5F4] rounded-[2rem] w-full h-[380px] md:h-[450px] border border-[#DCDCDA]/60 p-4 flex items-center justify-center relative overflow-hidden">
                   
                  <div className="bg-white rounded-[1.5rem] w-full max-w-[280px] md:max-w-[320px] mx-auto h-[90%] border border-[#DCDCDA] shadow-md flex flex-col overflow-hidden relative">
                    <div className="p-6 pb-5 border-b border-dashed border-[#DCDCDA] bg-[#FAFAFA]">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-full bg-[#ECECEA] flex items-center justify-center">
                           <div className="w-6 h-6 rounded-full bg-[#DCDCDA] animate-pulse" />
                        </div>
                        <div className="px-3 py-1.5 bg-[#8A2532]/10 rounded-full flex items-center justify-center border border-[#8A2532]/10">
                           <div className="w-12 h-2 bg-[#8A2532]/40 rounded-full animate-pulse" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-6 w-3/4 bg-[#DCDCDA] rounded-lg animate-pulse" />
                        <div className="h-3 w-1/2 bg-[#ECECEA] rounded-md animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-6 flex-1 bg-white">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="h-2 w-10 bg-[#ECECEA] rounded-full" />
                          <div className="h-5 w-20 bg-[#DCDCDA] rounded-md animate-pulse" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 w-10 bg-[#ECECEA] rounded-full" />
                          <div className="h-5 w-20 bg-[#DCDCDA] rounded-md animate-pulse" />
                        </div>
                      </div>
                      <div className="space-y-2">
                          <div className="h-2 w-16 bg-[#ECECEA] rounded-full" />
                          <div className="h-5 w-full bg-[#DCDCDA] rounded-md animate-pulse" />
                      </div>
                    </div>

                    <div className="p-5 bg-[#FAFAFA] border-t border-[#DCDCDA] flex justify-center items-center">
                       <div className="w-full h-12 rounded-xl bg-[#121415] opacity-90 animate-pulse" />
                    </div>
                    
                    <div className="absolute left-[-16px] top-[148px] w-8 h-8 rounded-full bg-[#F5F5F4] border-r border-[#DCDCDA]" />
                    <div className="absolute right-[-16px] top-[148px] w-8 h-8 rounded-full bg-[#F5F5F4] border-l border-[#DCDCDA]" />
                  </div>

                </div>
              </div>
              <div className="px-2">
                <h3 className="text-2xl font-semibold text-[#121415] mb-3 tracking-tight">
                  Your Digital Live Ticket
                </h3>
                <p className="text-[#4A4E51] font-medium leading-relaxed">
                  The ultimate customer experience. Access real-time booking updates, QR check-ins, and one-tap rescheduling—all beautifully organized in a single, interactive pass.
                </p>
              </div>
            </div>

            {/* Business Dashboard */}
            <div className="flex flex-col group">
              <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] p-3 md:p-4 mb-6 border border-[#DCDCDA]/40 group-hover:-translate-y-1 transition-transform duration-500">
                <div className="bg-[#F5F5F4] rounded-[2rem] w-full h-[380px] md:h-[450px] border border-[#DCDCDA]/60 p-4 md:p-6 flex flex-col relative overflow-hidden">
                   
                  <div className="w-full h-full flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-[#DCDCDA] pb-4">
                      <div className="flex gap-2 items-center">
                        <div className="w-3 h-3 rounded-full bg-[#DCDCDA]" />
                        <div className="w-3 h-3 rounded-full bg-[#DCDCDA]" />
                        <div className="w-3 h-3 rounded-full bg-[#DCDCDA]" />
                      </div>
                      <div className="flex gap-3 items-center">
                        <div className="h-5 w-32 bg-white border border-[#DCDCDA] rounded-full animate-pulse" />
                        <div className="w-6 h-6 rounded-full bg-[#DCDCDA] animate-pulse" />
                      </div>
                    </div>

                    <div className="flex flex-1 gap-5 overflow-hidden">
                      <div className="w-1/4 max-w-[140px] hidden sm:flex flex-col gap-3">
                        <div className="h-8 w-full bg-[#DCDCDA]/70 rounded-lg animate-pulse" />
                        <div className="h-8 w-full bg-[#8A2532]/10 rounded-lg animate-pulse border border-[#8A2532]/20" />
                        <div className="h-8 w-full bg-[#DCDCDA]/40 rounded-lg animate-pulse" />
                        <div className="h-8 w-full bg-[#DCDCDA]/40 rounded-lg animate-pulse" />
                        <div className="h-8 w-full bg-[#DCDCDA]/40 rounded-lg animate-pulse mt-auto" />
                      </div>

                      <div className="flex-1 flex flex-col gap-5">
                        <div className="grid grid-cols-3 gap-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className={\`h-24 rounded-xl border animate-pulse p-4 flex flex-col justify-between shadow-sm \${i === 2 ? 'bg-[#8A2532]/5 border-[#8A2532]/20' : 'bg-white border-[#DCDCDA]'}\`}>
                              <div className="h-2 w-1/2 bg-[#ECECEA] rounded-full" />
                              <div className="h-5 w-3/4 bg-[#DCDCDA] rounded-md" />
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex-1 bg-white border border-[#DCDCDA] rounded-xl p-5 flex flex-col gap-4 shadow-sm">
                          <div className="flex justify-between items-center mb-1">
                              <div className="h-4 w-1/3 bg-[#DCDCDA] rounded-md animate-pulse" />
                              <div className="h-4 w-16 bg-[#ECECEA] rounded-md animate-pulse" />
                          </div>
                          
                          <div className="space-y-3">
                              {[1, 2].map((i) => (
                              <div key={i} className="h-14 w-full bg-[#FAFAFA] rounded-xl border border-[#ECECEA] flex items-center px-4 gap-4">
                                  <div className="w-8 h-8 rounded-full bg-[#DCDCDA] animate-pulse" />
                                  <div className="space-y-2 flex-1">
                                  <div className="h-2 w-2/5 bg-[#DCDCDA] rounded-full animate-pulse" />
                                  <div className="h-2 w-1/4 bg-[#ECECEA] rounded-full animate-pulse" />
                                  </div>
                                  <div className="h-6 w-16 bg-[#ECECEA] rounded-md animate-pulse" />
                              </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div className="px-2">
                <h3 className="text-2xl font-semibold text-[#121415] mb-3 tracking-tight">
                  Powerful Partner Dashboard
                </h3>
                <p className="text-[#4A4E51] font-medium leading-relaxed">
                  Total operational control. Manage your team's schedules, analyze revenue insights, and track Karma metrics in a calm, distraction-free environment.
                </p>
              </div>
            </div>
          </motion.div>`;

  lines.splice(startIdx, endIdx - startIdx + 1, newSection);
  fs.writeFileSync(file, lines.join('\n'), 'utf8');
  console.log('Successfully replaced mockup section!');
} else {
  console.log('Failed to find section limits', startIdx, endIdx);
}
