"use client";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  format,
  addDays,
  subDays,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  startOfWeek,
  endOfWeek,
  startOfToday
} from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  User,
  Trash2,
  Loader2,
  X,
  Users,
  ChevronDown
} from "lucide-react";

// --- Built-in ConfirmModal component ---
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  isDestructive?: boolean;
}
const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, description, confirmText, cancelText, isDestructive }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-[400px] max-w-full rounded-[2rem] p-8 shadow-2xl flex flex-col text-center animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${isDestructive ? 'bg-[#dc2626]/10 text-[#dc2626]' : 'bg-[#F5F5F4] text-[#4A4E51]'}`}>
          <X className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-semibold text-[#121415] mb-2">{title}</h2>
        <p className="text-sm text-[#4A4E51] font-medium mb-6">{description}</p>
        <div className="flex gap-3 w-full">
          <button type="button" onClick={onClose} className="flex-1 py-3 bg-[#F5F5F4] text-[#121415] border border-[#DCDCDA] rounded-xl font-medium text-sm transition-colors hover:bg-[#ECECEA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
            {cancelText || "Cancel"}
          </button>
          <button type="button" onClick={onConfirm} className={`flex-1 py-3 rounded-xl font-medium text-sm text-white shadow-sm transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 ${isDestructive ? 'bg-[#dc2626] hover:opacity-90 focus-visible:ring-[#dc2626]' : 'bg-[#121415] hover:opacity-90 focus-visible:ring-[#121415]'}`}>
            {confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};
function CalendarPopover({ selectedDate, onSelect }: { selectedDate: Date, onSelect: (date: Date) => void }) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));
  
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 })
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  
  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={prevMonth} 
          className="p-1.5 hover:bg-[#F5F5F4] rounded-lg transition-colors text-[#4A4E51] hover:text-[#121415] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="font-semibold text-sm text-[#121415]">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <button 
          onClick={nextMonth} 
          className="p-1.5 hover:bg-[#F5F5F4] rounded-lg transition-colors text-[#4A4E51] hover:text-[#121415] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-[10px] uppercase font-bold text-[#8B9194] tracking-wider">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isCurrentDay = isToday(day);
          
          return (
            <button
              key={day.toString()}
              onClick={() => onSelect(day)}
              className={`
                h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]
                ${!isCurrentMonth ? 'text-[#DCDCDA] hover:bg-[#F5F5F4]' : ''}
                ${isCurrentMonth && !isSelected && !isCurrentDay ? 'text-[#121415] hover:bg-[#F5F5F4]' : ''}
                ${isCurrentMonth && isCurrentDay && !isSelected ? 'text-[#8A2532] bg-red-50 hover:bg-red-100' : ''}
                ${isSelected ? 'bg-[#121415] text-white shadow-sm' : ''}
              `}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-[#DCDCDA] flex justify-center">
        <button 
          onClick={() => {
            onSelect(startOfToday());
          }}
          className="text-xs font-medium text-[#4A4E51] hover:text-[#121415] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded px-2 py-1"
        >
          Go to Today
        </button>
      </div>
    </div>
  );
}
// -----------------------------------------------------------------

const TIME_OPTIONS = Array.from({ length: 36 }).map((_, i) => {
  const t = (i + 12) * 30; 
  return `${Math.floor(t / 60).toString().padStart(2, '0')}:${(t % 60).toString().padStart(2, '0')}`;
});

type Appointment = {
  id: string;
  clientName: string;
  time: string;
  service: string;
  masterId: string;
  status: "Waiting" | "In Chair";
};

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState<Date>(startOfToday());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [selectedMaster, setSelectedMaster] = useState("1");
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isMasterDropdownOpen, setIsMasterDropdownOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
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
    toast.success(`${newClientName} added to the schedule`);
  };

  const handleDeleteAppointment = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAppointmentToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (appointmentToDelete) {
      setAppointments(prev => prev.filter(a => a.id !== appointmentToDelete));
      setAppointmentToDelete(null);
      toast.success("Appointment canceled successfully");
    }
    setDeleteModalOpen(false);
  };
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    if (isCalendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen]);

  const handlePrevDay = () => setCurrentDate(prev => subDays(prev, 1));
  const handleNextDay = () => setCurrentDate(prev => addDays(prev, 1));

  const currentTimeTop = 270; // 12:15 in pixels from 10:00 (135 mins * 2px)
  const showTimeLine = true;

  const masters = [
    { id: "1", name: "Ali Ahmedov", initials: "AA" },
    { id: "2", name: "Sanjar B.", initials: "SB" },
    { id: "3", name: "Marat V.", initials: "MV" },
    { id: "4", name: "Denis K.", initials: "DK" },
    { id: "5", name: "Timur G.", initials: "TG" },
  ];

  return (
    <div className="flex h-[100dvh] bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* HEADER */}
        <header className="bg-[#ECECEA]/90 backdrop-blur-md border-b border-[#DCDCDA] px-6 md:px-10 py-4 md:py-0 h-auto md:h-20 shrink-0 sticky top-0 z-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#121415] tracking-tight">Schedule</h1>
            <p className="text-sm text-[#4A4E51] font-medium mt-0.5">Manage appointments and specialists</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-[#F5F5F4] p-1.5 rounded-xl border border-[#DCDCDA] relative" ref={calendarRef}>
              <button 
                type="button" 
                onClick={handlePrevDay}
                className="p-1.5 hover:bg-white rounded-lg transition-colors text-[#4A4E51] hover:text-[#121415] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                type="button"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="px-4 py-1.5 font-medium text-sm text-[#121415] bg-white rounded-lg shadow-sm border border-[#DCDCDA] hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
              >
                {format(currentDate, "dd.MM")} 
              </button>
              <button 
                type="button" 
                onClick={handleNextDay}
                className="p-1.5 hover:bg-white rounded-lg transition-colors text-[#4A4E51] hover:text-[#121415] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {isCalendarOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl border border-[#DCDCDA] p-4 w-[280px] z-50 origin-top"
                  >
                    <CalendarPopover 
                      selectedDate={currentDate} 
                      onSelect={(date) => {
                        setCurrentDate(date);
                        setIsCalendarOpen(false);
                      }} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button type="button" onClick={() => setIsBookingModalOpen(true)} className="bg-[#121415] text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95">
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Appointment</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-hidden flex flex-col pt-6">
          <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-[#DCDCDA] flex flex-col overflow-hidden">
            
            {/* Scrollable grid container */}
            <div className="flex-1 overflow-auto flex flex-col relative scrollbar-hide">
              
              {/* MASTER HEADERS (Sticky Top) */}
              <div className="flex border-b border-[#DCDCDA] bg-white/90 backdrop-blur-md shrink-0 sticky top-0 z-40 min-w-max">
                <div className="w-16 md:w-20 border-r border-[#DCDCDA] shrink-0 bg-white sticky left-0 z-50"></div>
                {masters.map((master) => (
                  <div key={master.id} className="min-w-[240px] flex-1 py-4 flex flex-col items-center justify-center border-r border-[#DCDCDA]">
                    <div className="w-9 h-9 rounded-full bg-[#121415] text-white flex items-center justify-center text-xs font-medium mb-1.5">
                      {master.initials}
                    </div>
                    <span className="font-semibold text-[#121415] text-sm">{master.name}</span>
                  </div>
                ))}
              </div>

              {/* TIMELINE GRID */}
              <div className="flex-1 flex relative min-w-max pb-10">
                
                {/* Current time red marker */}
                {showTimeLine && (
                  <div className="absolute left-16 md:left-20 right-0 z-20 pointer-events-none" style={{ top: `${currentTimeTop}px` }}>
                    <div className="relative border-t-2 border-[#8A2532] shadow-[0_2px_4px_rgba(138,37,50,0.3)]">
                      <div className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-[#8A2532] rounded-full"></div>
                    </div>
                  </div>
                )}

                {/* TIME AXIS (Sticky Left) */}
                <div className="w-16 md:w-20 bg-white/90 border-r border-[#DCDCDA] shrink-0 text-center select-none pt-2 z-30 sticky left-0 backdrop-blur-md shadow-[2px_0_5px_-2px_rgba(0,0,0,0.02)]">
                  {[...Array(11)].map((_, i) => (
                    <div key={i} className="h-[120px] flex justify-center text-xs font-medium text-[#8B9194]">
                      {10 + i}:00
                    </div>
                  ))}
                </div>

                {/* Background grid lines */}
                <div className="absolute inset-0 left-16 md:left-20 pointer-events-none flex flex-col z-0">
                  {[...Array(11)].map((_, i) => (
                    <div key={i} className="h-[120px] border-b border-[#F5F5F4] w-full"></div>
                  ))}
                </div>

                {/* MASTER COLUMNS WITH APPOINTMENT CARDS */}
                
                {masters.map((master) => {
                  const masterAppointments = appointments.filter(a => a.masterId === master.id);
                  return (
                    <div key={master.id} className="min-w-[240px] flex-1 border-r border-[#DCDCDA] relative group cursor-pointer hover:bg-[#F5F5F4]/50 transition-colors z-10">
                      {masterAppointments.map((appt) => {
                        const [hours, minutes] = appt.time.split(':').map(Number);
                        const topPx = ((hours - 10) * 60 + minutes) * 2;
                        const isWaiting = appt.status === "Waiting";
                        
                        return (
                          <div key={appt.id} className={`appointment-card absolute bg-white border rounded-2xl p-3 shadow-sm hover:shadow-md transition-all duration-200 z-20 overflow-hidden flex flex-col group/card ${isWaiting ? 'border-[#DCDCDA] hover:border-[#4A4E51]' : 'border-[#4a6b53]/30 hover:border-[#4a6b53]'}`} 
                               style={{ top: `${topPx}px`, height: "88px", left: "calc(0% + 6px)", width: "calc(100% - 12px)" }}>
                            <div className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${isWaiting ? (master.id === '4' ? 'bg-[#121415]' : 'bg-[#8A2532]') : 'bg-[#4a6b53]'}`}></div>
                            <div className="flex justify-between items-start mb-1 pl-2">
                              <span className="font-semibold text-[#121415] text-sm truncate pr-4">{appt.clientName}</span>
                              <span className="text-[10px] font-medium bg-[#F5F5F4] px-1.5 py-0.5 rounded-md text-[#4A4E51] border border-[#DCDCDA]">{appt.time}</span>
                            </div>
                            <p className="text-xs text-[#4A4E51] truncate pl-2 mt-0.5">{appt.service}</p>
                            <div className="mt-auto flex items-center justify-between pl-2">
                               <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${isWaiting ? 'bg-[#F5F5F4] text-[#4A4E51] border-[#DCDCDA]' : 'bg-[#e8efe9] text-[#4a6b53] border-[#4a6b53]/30'}`}>
                                 {appt.status}
                               </span>
                               <button type="button" onClick={(e) => handleDeleteAppointment(appt.id, e)} className="text-[#8B9194] hover:text-[#dc2626] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] rounded">
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
      </div>

      {/* QUICK BOOKING MODAL */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-sm" onClick={() => setIsBookingModalOpen(false)}>
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setIsBookingModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F4] text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
              <X className="w-4 h-4" />
            </button>
            <div className="p-8 pb-4 shrink-0">
              <h2 className="text-2xl font-semibold text-[#121415] tracking-tight">Quick Booking</h2>
          </div>
          <form className="px-8 pb-8 space-y-6" onSubmit={handleAddAppointment}>
            <div>
              <label className="block text-sm font-medium text-[#121415] mb-2">Client</label>
              <input autoFocus required name="clientName" type="text" value={newClientName} onChange={e => setNewClientName(e.target.value)} placeholder="Client name" className="w-full px-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                 <label className="block text-sm font-medium text-[#121415] mb-2">Time</label>
                 <div className="relative">
                   <button
                     type="button"
                     onClick={() => { setIsTimeDropdownOpen(!isTimeDropdownOpen); setIsMasterDropdownOpen(false); }}
                     className={`w-full flex items-center justify-between pl-4 pr-4 py-3 border rounded-xl text-left font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]/10 ${isTimeDropdownOpen ? 'bg-white border-[#121415] ring-2 ring-[#121415]/10' : 'bg-[#F5F5F4] border-[#DCDCDA] text-[#121415]'}`}
                   >
                     <span>{selectedTime}</span>
                     <ChevronDown className={`w-5 h-5 text-[#8B9194] transition-transform duration-200 ${isTimeDropdownOpen ? 'rotate-180' : ''}`} />
                   </button>
                   
                   {isTimeDropdownOpen && (
                     <>
                       <div className="fixed inset-0 z-40" onClick={() => setIsTimeDropdownOpen(false)}></div>
                       <div className="absolute z-50 w-full mt-2 bg-white border border-[#DCDCDA] rounded-xl shadow-lg py-1 max-h-56 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                         {TIME_OPTIONS.map((time) => (
                           <button
                             key={time}
                             type="button"
                             onClick={() => {
                               setSelectedTime(time);
                               setIsTimeDropdownOpen(false);
                             }}
                             className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#F5F5F4] ${selectedTime === time ? 'text-[#121415] bg-[#F5F5F4]/50' : 'text-[#4A4E51]'}`}
                           >
                             {time}
                           </button>
                         ))}
                       </div>
                     </>
                   )}
                 </div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-[#121415] mb-2">Master</label>
                 <div className="relative">
                   <button
                     type="button"
                     onClick={() => { setIsMasterDropdownOpen(!isMasterDropdownOpen); setIsTimeDropdownOpen(false); }}
                     className={`w-full flex items-center justify-between pl-4 pr-4 py-3 border rounded-xl text-left font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]/10 ${isMasterDropdownOpen ? 'bg-white border-[#121415] ring-2 ring-[#121415]/10' : 'bg-[#F5F5F4] border-[#DCDCDA] text-[#121415]'}`}
                   >
                     <span className="truncate">{masters.find(m => m.id === selectedMaster)?.name || 'Select'}</span>
                     <ChevronDown className={`w-5 h-5 text-[#8B9194] transition-transform duration-200 ${isMasterDropdownOpen ? 'rotate-180' : ''}`} />
                   </button>
                   
                   {isMasterDropdownOpen && (
                     <>
                       <div className="fixed inset-0 z-40" onClick={() => setIsMasterDropdownOpen(false)}></div>
                       <div className="absolute z-50 w-full mt-2 bg-white border border-[#DCDCDA] rounded-xl shadow-lg py-1 max-h-56 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                         {masters.map((master) => (
                           <button
                             key={master.id}
                             type="button"
                             onClick={() => {
                               setSelectedMaster(master.id);
                               setIsMasterDropdownOpen(false);
                             }}
                             className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#F5F5F4] ${selectedMaster === master.id ? 'text-[#121415] bg-[#F5F5F4]/50' : 'text-[#4A4E51]'}`}
                           >
                             {master.name}
                           </button>
                         ))}
                       </div>
                     </>
                   )}
                 </div>
              </div>
            </div>
            <button type="submit" className="w-full mt-6 py-3 bg-[#121415] text-white rounded-xl font-medium text-sm hover:opacity-90 transition-all flex justify-center items-center shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
              Save
            </button>
          </form>
        </div>
      </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmText="Cancel Appointment"
        cancelText="Keep it"
        isDestructive={true}
      />
    </div>
  );
}