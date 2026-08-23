const fs=require('fs');
let content = fs.readFileSync('src/components/Landing.tsx', 'utf8');

const targetStr = `              </div>

                </p>

                <div className="mt-8 flex flex-wrap gap-4">`;

const replacement = `              </div>

              <div className="col-span-1 md:col-span-3 bg-[#121415] rounded-[2rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] relative overflow-hidden group">
                <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
                  Effortless rescheduling
                </h3>
                <p className="text-[#8B9194] font-medium max-w-md leading-relaxed">
                  Plans change. Reschedule your appointments with a single tap,
                  directly from your dashboard—without the awkward phone calls.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">`;

content = content.replace(targetStr, replacement);
fs.writeFileSync('src/components/Landing.tsx', content);
