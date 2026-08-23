"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
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
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X,
  ChevronDown,
  Clock
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

// Periods defined exactly as 1, 2, 3, 4 based on the school timetable photo.
const PERIODS = [1, 2, 3, 4];

type Appointment = {
  id: string;
  customerName: string;
  period: number;
  date: string; // YYYY-MM-DD
  timeRange: string;
  service: string;
  masterName: string;
  status: "Waiting" | "In Chair" | "Completed";
};

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState<Date>(startOfToday());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);
  const [selectedDateStr, setSelectedDateStr] = useState(format(startOfToday(), "yyyy-MM-dd"));
  
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  const [newCustomerName, setNewClientName] = useState("");
  
  // Hardcoded initial data tailored for the timetable layout
  const [appointments, setAppointments] = useState<Appointment[]>([
    { 
      id: "1", 
      customerName: "Guest", 
      period: 1, 
      date: format(startOfToday(), "yyyy-MM-dd"), 
      timeRange: "08:30 - 09:15",
      service: "Men's Haircut", 
      masterName: "Ali Ahmedov", 
      status: "Waiting" 
    },
    { 
      id: "2", 
      customerName: "Alexey", 
      period: 2, 
      date: format(startOfToday(), "yyyy-MM-dd"), 
      timeRange: "09:20 - 10:05",
      service: "Haircut + Beard", 
      masterName: "Sanjar B.", 
      status: "In Chair" 
    },
    { 
      id: "3", 
      customerName: "New Customer", 
      period: 3, 
      date: format(addDays(startOfToday(), 1), "yyyy-MM-dd"), 
      timeRange: "10:10 - 10:55",
      service: "Service", 
      masterName: "Denis K.", 
      status: "Waiting" 
    },
  ]);

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

  const handlePrevWeek = () => setCurrentDate(prev => subDays(prev, 7));
  const handleNextWeek = () => setCurrentDate(prev => addDays(prev, 7));

  // Compute the 7-day columns for the timetable grid
  const next7Days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = addDays(currentDate, i);
      return {
        id: format(d, "yyyy-MM-dd"),
        day: format(d, "EEE"),
        dateNum: format(d, "dd"),
        month: format(d, "MMM")
      };
    });
  }, [currentDate]);

  const DATE_OPTIONS = useMemo(() => {
    return next7Days.map(d => ({
        id: d.id,
        label: `${d.dateNum} ${d.month} (${d.day})`
    }));
  }, [next7Days]);

  const getTimeRangeForPeriod = (p: number) => {
    switch (p) {
      case 1: return "08:30 - 09:15";
      case 2: return "09:20 - 10:05";
      case 3: return "10:10 - 10:55";
      case 4: return "11:20 - 12:05";
      default: return "12:00 - 13:00";
    }
  };

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim()) return;

    const newAppt: Appointment = {
      id: Date.now().toString(),
      customerName: newCustomerName,
      period: selectedPeriod,
      date: selectedDateStr,
      timeRange: getTimeRangeForPeriod(selectedPeriod),
      service: "Service", 
      masterName: "Specialist", // minimal logic, hardcoded fallback
      status: "Waiting"
    };

    setAppointments(prev => [...prev, newAppt]);
    setIsBookingModalOpen(false);
    setNewClientName("");
    toast.success(`${newCustomerName} added to the schedule`);
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

  return (
    <div className="flex min-h-full bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white">
      <div className="flex-1 flex flex-col relative">
        
        {/* HEADER */}
        <header className="bg-[#F5F5F4]/90 backdrop-blur-md border-b border-[#DCDCDA] px-6 md:px-10 py-4 md:py-0 h-auto md:h-20 shrink-0 sticky top-0 z-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#121415] tracking-tight">Schedule</h1>
            <p className="text-sm text-[#4A4E51] font-medium mt-0.5">Manage appointments up to a week in advance</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-[#F5F5F4] p-1.5 rounded-xl border border-[#DCDCDA] relative" ref={calendarRef}>
              <button 
                type="button" 
                onClick={handlePrevWeek}
                className="p-1.5 hover:bg-white rounded-lg transition-colors text-[#4A4E51] hover:text-[#121415] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                type="button"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="px-4 py-1.5 font-medium text-sm text-[#121415] bg-white rounded-lg shadow-sm border border-[#DCDCDA] hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
              >
                {format(currentDate, "dd.MM")} - {format(addDays(currentDate, 6), "dd.MM")}
              </button>
              <button 
                type="button" 
                onClick={handleNextWeek}
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
            <button type="button" onClick={() => setIsBookingModalOpen(true)} className="bg-[#121415] text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95">
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Appointment</span>
            </button>
          </div>
        </header>

        {/* TIMETABLE CONTENT */}
        <main className="flex-1 p-6 md:p-10 flex flex-col pt-6">
          <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-[#DCDCDA] flex flex-col">
            <div className="w-full overflow-x-auto flex flex-col relative scrollbar-hide">
              <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead>
                  <tr>
                    {/* Empty top-left cell */}
                    <th className="p-4 border-b border-r border-[#DCDCDA] bg-[#F5F5F4] w-12 text-center text-[#4A4E51] font-semibold text-sm sticky top-0 z-30 shadow-[0_1px_0_#DCDCDA]">
                      #
                    </th>
                    {/* Day Columns */}
                    {next7Days.map(date => (
                      <th key={date.id} className="p-3 border-b border-r last:border-r-0 border-[#DCDCDA] bg-[#F5F5F4] text-center min-w-[150px] sticky top-0 z-20 shadow-[0_1px_0_#DCDCDA]">
                        <div className="flex items-baseline justify-center gap-1.5">
                          <div className="text-sm font-medium text-[#121415] capitalize">{date.day}</div>
                          <div className="text-xs font-semibold text-[#8B9194]">{date.dateNum} {date.month}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERIODS.map(period => (
                    <tr key={period} className="border-b border-[#DCDCDA] last:border-0 hover:bg-[#F5F5F4]/30 transition-colors group">
                      {/* Row Label (Period) */}
                      <td className="p-4 border-r border-[#DCDCDA] bg-[#F5F5F4] text-center font-bold text-[#121415] text-base w-12 sticky left-0 z-10 shadow-[1px_0_0_#DCDCDA]">
                        {period}
                      </td>
                      {/* Cells for each Day */}
                      {next7Days.map(date => {
                        const apptsInSlot = appointments.filter(a => a.date === date.id && a.period === period);
                        
                        return (
                          <td key={date.id} className="p-2 border-r last:border-r-0 border-[#DCDCDA] align-top min-h-[140px] w-[150px] relative group/cell">
                            {apptsInSlot.length > 0 ? (
                              apptsInSlot.map(appt => {
                                const isWaiting = appt.status === "Waiting";
                                return (
                                  <div key={appt.id} className="w-full h-full bg-white border border-[#DCDCDA] rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group/card flex flex-col justify-between min-h-[120px]">
                                    
                                    {/* Subject / Service */}
                                    <div className="flex justify-between items-start mb-2">
                                      <span className="font-semibold text-[#8A2532] text-[13px] leading-tight pr-4">{appt.service}</span>
                                      <button type="button" onClick={(e) => handleDeleteAppointment(appt.id, e)} className="text-[#8B9194] hover:text-[#dc2626] transition-colors focus-visible:outline-none rounded shrink-0 opacity-0 group-hover/card:opacity-100 absolute top-2 right-2 bg-white/80 p-0.5">
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                    
                                    {/* Teacher / Master */}
                                    <div className="text-xs font-medium text-[#121415] truncate mb-1">
                                      {appt.masterName}
                                    </div>

                                    {/* Time Range */}
                                    <div className="text-xs font-medium text-[#4A4E51] flex items-center gap-1.5 mb-2">
                                      <Clock className="w-3 h-3 shrink-0" />
                                      {appt.timeRange}
                                    </div>
                                    
                                    {/* Room / Client & Status */}
                                    <div className="mt-auto pt-2 border-t border-[#F5F5F4] flex items-center justify-between">
                                      <span className="text-xs font-medium text-[#121415] truncate pr-2">
                                        {appt.customerName}
                                      </span>
                                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${isWaiting ? 'bg-[#F5F5F4] text-[#4A4E51] border-[#DCDCDA]' : 'bg-[#e8efe9] text-[#4a6b53] border-[#4a6b53]/30'}`}>
                                        {appt.status}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              // Empty state for booking
                              <div className="w-full h-full min-h-[120px] opacity-0 group-hover/cell:opacity-100 flex items-center justify-center transition-opacity bg-white/50 border border-dashed border-[#DCDCDA] rounded-xl hover:border-[#8A2532] hover:bg-[#8A2532]/5 cursor-pointer"
                                onClick={() => {
                                  setSelectedDateStr(date.id);
                                  setSelectedPeriod(period);
                                  setIsBookingModalOpen(true);
                                }}
                              >
                                <span className="text-xs font-semibold text-[#8A2532] flex flex-col items-center gap-1.5">
                                  <Plus className="w-4 h-4" />
                                  Book Slot
                                </span>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
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
              <h2 className="text-2xl font-semibold text-[#121415] tracking-tight">Add Timetable Entry</h2>
            </div>
            <form className="px-8 pb-8 space-y-5" onSubmit={handleAddAppointment}>
              <div>
                <label className="block text-sm font-medium text-[#121415] mb-2">Client / Status Note</label>
                <input autoFocus required name="customerName" type="text" value={newCustomerName} onChange={e => setNewClientName(e.target.value)} placeholder="e.g. John Doe" className="w-full px-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                   <label className="block text-sm font-medium text-[#121415] mb-2">Date</label>
                   <div className="relative">
                     <button
                       type="button"
                       onClick={() => { setIsDateDropdownOpen(!isDateDropdownOpen); setIsPeriodDropdownOpen(false); }}
                       className={`w-full flex items-center justify-between pl-4 pr-4 py-3 border rounded-xl text-left font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]/10 ${isDateDropdownOpen ? 'bg-white border-[#121415] ring-2 ring-[#121415]/10' : 'bg-[#F5F5F4] border-[#DCDCDA] text-[#121415]'}`}
                     >
                       <span className="truncate">{DATE_OPTIONS.find(d => d.id === selectedDateStr)?.label || selectedDateStr}</span>
                       <ChevronDown className={`w-5 h-5 text-[#8B9194] transition-transform duration-200 shrink-0 ${isDateDropdownOpen ? 'rotate-180' : ''}`} />
                     </button>
                     
                     {isDateDropdownOpen && (
                       <>
                         <div className="fixed inset-0 z-40" onClick={() => setIsDateDropdownOpen(false)}></div>
                         <div className="absolute z-50 w-full mt-2 bg-white border border-[#DCDCDA] rounded-xl shadow-lg py-1 max-h-56 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                           {DATE_OPTIONS.map((dateOpt) => (
                             <button
                               key={dateOpt.id}
                               type="button"
                               onClick={() => {
                                 setSelectedDateStr(dateOpt.id);
                                 setIsDateDropdownOpen(false);
                               }}
                               className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#F5F5F4] ${selectedDateStr === dateOpt.id ? 'text-[#121415] bg-[#F5F5F4]/50' : 'text-[#4A4E51]'}`}
                             >
                               {dateOpt.label}
                             </button>
                           ))}
                         </div>
                       </>
                     )}
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-[#121415] mb-2">Period</label>
                   <div className="relative">
                     <button
                       type="button"
                       onClick={() => { setIsPeriodDropdownOpen(!isPeriodDropdownOpen); setIsDateDropdownOpen(false); }}
                       className={`w-full flex items-center justify-between pl-4 pr-4 py-3 border rounded-xl text-left font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]/10 ${isPeriodDropdownOpen ? 'bg-white border-[#121415] ring-2 ring-[#121415]/10' : 'bg-[#F5F5F4] border-[#DCDCDA] text-[#121415]'}`}
                     >
                       <span>{selectedPeriod}</span>
                       <ChevronDown className={`w-5 h-5 text-[#8B9194] transition-transform duration-200 shrink-0 ${isPeriodDropdownOpen ? 'rotate-180' : ''}`} />
                     </button>
                     
                     {isPeriodDropdownOpen && (
                       <>
                         <div className="fixed inset-0 z-40" onClick={() => setIsPeriodDropdownOpen(false)}></div>
                         <div className="absolute z-50 w-full mt-2 bg-white border border-[#DCDCDA] rounded-xl shadow-lg py-1 max-h-56 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                           {PERIODS.map((period) => (
                             <button
                               key={period}
                               type="button"
                               onClick={() => {
                                 setSelectedPeriod(period);
                                 setIsPeriodDropdownOpen(false);
                               }}
                               className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#F5F5F4] ${selectedPeriod === period ? 'text-[#121415] bg-[#F5F5F4]/50' : 'text-[#4A4E51]'}`}
                             >
                               Period {period}
                             </button>
                           ))}
                         </div>
                       </>
                     )}
                   </div>
                </div>
              </div>
              <button type="submit" className="w-full mt-6 py-3 bg-[#121415] text-white rounded-xl font-medium text-sm hover:opacity-90 transition-all flex justify-center items-center shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                Save Entry
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
        title="Remove Entry"
        description="Are you sure you want to remove this timetable entry? This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}