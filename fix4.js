const fs=require('fs');
let content = fs.readFileSync('src/components/Landing.tsx', 'utf8');
const lines = content.split('\n');

const before = lines.slice(0, 748).join('\n'); // Up to line 748 (inclusive, meaning index 747 which is </div>)
const afterSlice = lines.slice(750).join('\n'); // From line 751 (index 750, empty line)

const toInsert = `
              <div className="col-span-1 md:col-span-3 bg-[#121415] rounded-[2rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] relative overflow-hidden group">
                <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
                  Effortless rescheduling
                </h3>
                <p className="text-[#8B9194] font-medium max-w-md leading-relaxed">
                  Plans change. Reschedule your appointments with a single tap,
                  directly from your dashboard—without the awkward phone calls.
                </p>`;

fs.writeFileSync('src/components/Landing.tsx', before + '\n' + toInsert + '\n' + afterSlice);
