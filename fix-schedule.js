const fs = require('fs');
const file = "c:/Users/user/Desktop/Elara/my-app/src/features/business-pages/admin-pages/Schedule.tsx";
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('type Appointment')) {
  content = content.replace(
    'export default function Schedule() {',
    	ype Appointment = {
  id: string;
  clientName: string;
  time: string;
  service: string;
  masterId: string;
  status: "Waiting" | "In Chair";
};

export default function Schedule() {
  );
}

if (!content.includes('const [appointments, setAppointments]')) {
  content = content.replace(
    'const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);',
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: "1", clientName: "Guest", time: "10:00", service: "Men's Haircut", masterId: "1", status: "Waiting" },
    { id: "2", clientName: "Alexey", time: "11:30", service: "Haircut + Beard", masterId: "2", status: "In Chair" },
    { id: "3", clientName: "New Client", time: "14:00", service: "Service", masterId: "4", status: "Waiting" },
  ]);

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const newAppt: Appointment = {
      id: Date.now().toString(),
      clientName: newClientName,
      time: selectedTime,
      service: "Service", 
      masterId: selectedMaster,
      status: "Waiting"
    };

    setAppointments(prev => [...prev, newAppt]);
    setIsBookingModalOpen(false);
    setNewClientName("");
  };

  const handleDeleteAppointment = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  );
}

const columnsStart = content.indexOf('{/* Column 1: Ali Ahmedov */}');
const columnsEnd = content.indexOf('</div>\\n            </div>\\n          </div>\\n        </main>');
// Note: newlines in indexOf need to match the file.
// Let's use a regex to be safer for the replace.

content = content.replace(
  /\{\/\* Column 1: Ali Ahmedov \*\/\}[\s\S]*?\{\/\* Column 5: Timur G\. \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/main>/,
  {masters.map((master) => {
                  const masterAppointments = appointments.filter(a => a.masterId === master.id);
                  return (
                    <div key={master.id} className="min-w-[240px] flex-1 border-r border-[#DCDCDA] relative group cursor-pointer hover:bg-[#F5F5F4]/50 transition-colors z-10">
                      {masterAppointments.map((appt) => {
                        const [hours, minutes] = appt.time.split(':').map(Number);
                        const topPx = ((hours - 10) * 60 + minutes) * 2;
                        const isWaiting = appt.status === "Waiting";
                        
                        return (
                          <div key={appt.id} className={\ppointment-card absolute bg-white border rounded-2xl p-3 shadow-sm hover:shadow-md transition-all duration-200 z-20 overflow-hidden flex flex-col group/card \\} 
                               style={{ top: \\px\, height: "88px", left: "calc(0% + 6px)", width: "calc(100% - 12px)" }}>
                            <div className={\bsolute top-0 left-0 w-1 h-full rounded-l-2xl \\}></div>
                            <div className="flex justify-between items-start mb-1 pl-2">
                              <span className="font-semibold text-[#121415] text-sm truncate pr-4">{appt.clientName}</span>
                              <span className="text-[10px] font-medium bg-[#F5F5F4] px-1.5 py-0.5 rounded-md text-[#4A4E51] border border-[#DCDCDA]">{appt.time}</span>
                            </div>
                            <p className="text-xs text-[#4A4E51] truncate pl-2 mt-0.5">{appt.service}</p>
                            <div className="mt-auto flex items-center justify-between pl-2">
                               <span className={\	ext-[10px] font-medium px-2 py-0.5 rounded-md border \\}>
                                 {appt.status}
                               </span>
                               <button type="button" onClick={(e) => handleDeleteAppointment(appt.id, e)} className="text-[#8B9194] hover:text-[#dc2626] transition-colors opacity-0 group-hover/card:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] rounded">
                                 <Trash2 className="w-3.5 h-3.5" />
                               </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
);

content = content.replace(
  '<form className="px-8 pb-8 space-y-6">',
  '<form className="px-8 pb-8 space-y-6" onSubmit={handleAddAppointment}>'
);

content = content.replace(
  'name="clientName" type="text"',
  'name="clientName" type="text" value={newClientName} onChange={e => setNewClientName(e.target.value)}'
);

content = content.replace(
  '<button type="button" className="w-full mt-6 py-3 bg-[#121415]',
  '<button type="submit" className="w-full mt-6 py-3 bg-[#121415]'
);

fs.writeFileSync(file, content, 'utf8');
console.log("Updated Schedule.tsx");
