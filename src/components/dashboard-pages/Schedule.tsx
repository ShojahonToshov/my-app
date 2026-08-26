"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import {
  format,
  addDays,
  subDays,
  startOfToday,
  parse,
  addMinutes,
  parseISO,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X,
  ChevronDown,
  Clock,
  User,
  Scissors,
  CheckCircle2,
  Calendar
} from "lucide-react";
import customerBookingService from "@/services/customer/BookingService";
import { Skeleton } from "@/components/ui/Skeleton";
import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

// --- ConfirmModal ---
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
      <div className="bg-white w-[400px] max-w-full rounded-2xl p-8 shadow-2xl flex flex-col text-center animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
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

interface CustomSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
  icon?: React.ElementType;
  disabled?: boolean;
}

function CustomSelect({ value, options, onChange, className, icon: Icon, disabled = false }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className={`relative ${isOpen ? 'z-[99999]' : ''} ${className}`} ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={(e) => { e.preventDefault(); if (!disabled) setIsOpen(!isOpen); }}
        className={`w-full flex items-center justify-between px-4 py-3 bg-[#F5F5F4] border rounded-xl text-sm font-medium text-[#121415] outline-none transition-all focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-1 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
          isOpen ? "border-[#121415] bg-white ring-2 ring-[#121415]/10 shadow-sm" : "border-[#DCDCDA] hover:border-[#121415]"
        }`}
      >
        <div className="flex items-center">
          {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9194]" />}
          <span className={`truncate ${Icon ? 'pl-6' : ''}`}>{value || "Select..."}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "text-[#121415] rotate-180" : "text-[#8B9194]"}`} />
      </button>
      
      {isOpen && !disabled && (
        <div role="listbox" className="absolute z-[99999] w-full min-w-[140px] mt-2 bg-white border border-[#DCDCDA] rounded-xl shadow-lg max-h-56 overflow-y-auto py-1.5 animate-in fade-in zoom-in-95 duration-200">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              role="option"
              aria-selected={value === opt}
              onClick={(e) => {
                e.preventDefault();
                onChange(opt);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between group focus-visible:outline-none focus-visible:bg-[#F5F5F4] ${
                value === opt ? "bg-[#F5F5F4]" : "hover:bg-[#F5F5F4]"
              }`}
            >
              <span className={value === opt ? "font-medium text-[#121415]" : "font-medium text-[#4A4E51] group-hover:text-[#121415]"}>
                {opt}
              </span>
              {value === opt && <CheckCircle2 className="w-4 h-4 text-[#121415] shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface CustomDatePickerProps {
  value: string; // "yyyy-MM-dd"
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

function CustomDatePicker({ value, onChange, className, disabled = false }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(parseISO(value || format(startOfToday(), "yyyy-MM-dd")));
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 })
  });

  const nextMonth = (e: React.MouseEvent) => { e.preventDefault(); setCurrentMonth(addMonths(currentMonth, 1)); };
  const prevMonth = (e: React.MouseEvent) => { e.preventDefault(); setCurrentMonth(subMonths(currentMonth, 1)); };

  const handleSelectDate = (date: Date) => {
    onChange(format(date, "yyyy-MM-dd"));
    setIsOpen(false);
  };

  return (
    <div className={`relative ${isOpen ? 'z-[99999]' : ''} ${className}`} ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => { e.preventDefault(); if (!disabled) setIsOpen(!isOpen); }}
        className={`w-full flex items-center justify-between px-4 py-3 bg-[#F5F5F4] border rounded-xl text-sm font-medium text-[#121415] outline-none transition-all focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-1 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
          isOpen ? "border-[#121415] bg-white ring-2 ring-[#121415]/10 shadow-sm" : "border-[#DCDCDA] hover:border-[#121415]"
        }`}
      >
        <div className="flex items-center">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9194]" />
          <span className="pl-6" suppressHydrationWarning>{value ? format(parseISO(value), "MMM dd, yyyy") : "Select date"}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "text-[#121415] rotate-180" : "text-[#8B9194]"}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-[99999] left-[calc(100%+1rem)] top-0 w-[280px] bg-white border border-[#DCDCDA] rounded-xl shadow-lg p-4 animate-in fade-in slide-in-from-left-2 zoom-in-95 duration-200 origin-top-left">
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={prevMonth} className="p-1 text-[#4A4E51] hover:text-[#121415] hover:bg-[#F5F5F4] rounded-lg transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <span className="font-semibold text-[#121415] text-sm">{format(currentMonth, "MMMM yyyy")}</span>
            <button type="button" onClick={nextMonth} className="p-1 text-[#4A4E51] hover:text-[#121415] hover:bg-[#F5F5F4] rounded-lg transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2 text-center">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
              <span key={day} className="text-xs font-medium text-[#8B9194]">{day}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              const isSelected = value === format(day, "yyyy-MM-dd");
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, startOfToday());
              
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDate(day)}
                  className={`w-8 h-8 mx-auto rounded-full text-xs flex items-center justify-center transition-all ${
                    isSelected 
                      ? "bg-[#121415] text-white font-medium shadow-sm" 
                      : isToday
                        ? "bg-[#8A2532] text-white font-semibold shadow-sm hover:bg-[#8A2532]/90"
                        : isCurrentMonth
                          ? "text-[#121415] font-medium hover:bg-[#F5F5F4]"
                          : "text-[#DCDCDA] font-medium hover:text-[#8B9194]"
                  }`}
                >
                  {format(day, "d")}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Types ---
type AppointmentStatus = "waiting" | "in_progress" | "completed";

type Appointment = {
  id: string;
  customerName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  service: string;
  masterName: string;
  status: AppointmentStatus;
};

// Generate time slots (e.g. 08:00 to 20:00 every 30 mins)
const generateTimeSlots = (startHour = 8, endHour = 20, intervalMinutes = 30) => {
  const slots = [];
  let current = parse(`${startHour}:00`, 'H:mm', new Date());
  const end = parse(`${endHour}:00`, 'H:mm', new Date());
  
  while (current <= end) {
    slots.push(format(current, 'HH:mm'));
    current = addMinutes(current, intervalMinutes);
  }
  return slots;
};

export default function Schedule() {
  const queryClient = useQueryClient();
  const [isMounted, setIsMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDateEditable, setIsDateEditable] = useState(true);
  
  // Real business data
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [scheduleConfig, setScheduleConfig] = useState<any[]>([]);
  
  // Modal Form State
  const [selectedDateStr, setSelectedDateStr] = useState("");
  const [selectedTime, setSelectedTime] = useState<string>("09:00");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newService, setNewService] = useState("");
  const [newStaff, setNewStaff] = useState("");
  const [newStatus, setNewStatus] = useState<AppointmentStatus>("waiting");
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    setCurrentDate(startOfToday());
    setSelectedDateStr(format(startOfToday(), "yyyy-MM-dd"));

    let isSubscribed = true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const supabase = createClient();
        
        // Fetch team, services, and schedule from business settings
        const { data: { user } } = await supabase.auth.getUser();
        let currentBusinessId = null;
        if (user) {
          const { data: business } = await supabase.from('businesses').select('id, team_data, schedule_data').eq('owner_id', user.id).single();
          if (business) {
            currentBusinessId = business.id;
            setBusinessId(business.id);
            if (business.team_data && isSubscribed) {
              setTeamMembers(business.team_data);
            }
            if (business.schedule_data && isSubscribed) {
              setScheduleConfig(business.schedule_data);
            }
            const { data: srvs } = await supabase.from('services').select('id, name').eq('business_id', business.id);
            if (srvs && isSubscribed) {
              setServicesData(srvs);
            }
          }
        }

        // Fetch bookings
        const data = await customerBookingService.getBookings(currentBusinessId || undefined);
        if (isSubscribed) {
          const mappedAppointments = data.map((b) => ({
            id: b.id,
            customerName: b.guest_name || b.guestName || "Guest",
            date: b.date || "",
            time: (b.time || "09:00").substring(0, 5),
            service: b.service_name || "Haircut",
            masterName: b.staff_name || "Any available",
            status: b.status === "in_progress" ? "in_progress" : b.status === "completed" ? "completed" : "waiting",
            duration: 30
          })) as Appointment[];
          setAppointments(mappedAppointments);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to load schedule");
      } finally {
        if (isSubscribed) setIsLoading(false);
      }
    };
    fetchData();
    return () => { isSubscribed = false; };
  }, []);

  const handlePrevWeek = () => setCurrentDate(prev => subDays(prev, 7));
  const handleNextWeek = () => setCurrentDate(prev => addDays(prev, 7));

  // Compute 7 days starting from `currentDate`
  const weekDaysView = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = addDays(currentDate, i);
      return {
        id: format(d, "yyyy-MM-dd"),
        day: format(d, "EEE"),
        fullDayName: format(d, "EEEE"),
        dateNum: format(d, "dd"),
        month: format(d, "MMM")
      };
    });
  }, [currentDate]);

  // Combine fetched team/services with unique ones from bookings to be safe
  const knownServices = useMemo(() => {
    const set = new Set(servicesData.map(s => s.name));
    appointments.forEach(a => { if (a.service) set.add(a.service); });
    return Array.from(set).sort();
  }, [servicesData, appointments]);

  const knownStaff = useMemo(() => {
    const set = new Set(teamMembers.map(t => t.name));
    appointments.forEach(a => { if (a.masterName) set.add(a.masterName); });
    return Array.from(set).sort();
  }, [teamMembers, appointments]);

  // Calculate dynamic time range based on schedule_data
  const timeRange = useMemo(() => {
    if (!scheduleConfig || scheduleConfig.length === 0) return { startHour: 9, endHour: 19 }; // fallback
    
    let minMinutes = 24 * 60;
    let maxMinutes = 0;
    let anyActive = false;
    
    scheduleConfig.forEach(day => {
      if (!day.isActive) return;
      anyActive = true;
      const [startH, startM] = day.start.split(':').map(Number);
      const [endH, endM] = day.end.split(':').map(Number);
      
      const startTotal = startH * 60 + startM;
      const endTotal = endH * 60 + endM;
      
      if (startTotal < minMinutes) minMinutes = startTotal;
      if (endTotal > maxMinutes) maxMinutes = endTotal;
    });
    
    if (!anyActive) return { startHour: 9, endHour: 19 };
    
    return {
      startHour: Math.floor(minMinutes / 60),
      endHour: Math.ceil(maxMinutes / 60)
    };
  }, [scheduleConfig]);

  const TIME_SLOTS = useMemo(() => {
    return generateTimeSlots(timeRange.startHour, timeRange.endHour, 30);
  }, [timeRange]);

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim() || !newStaff.trim() || !newService.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    const selectedDateTime = new Date(`${selectedDateStr}T${selectedTime}:00`);
    if (selectedDateTime < new Date()) {
      toast.error("Cannot book appointments in the past");
      return;
    }

    try {
      const srv = servicesData.find((s: any) => s.name === newService);
      const serviceId = srv ? String(srv.id) : newService.toLowerCase().replace(/\s+/g, '-');

      const newApptData = {
        guest_name: newCustomerName,
        date: selectedDateStr,
        time: selectedTime,
        service_id: serviceId,
        service_name: newService,
        staff_name: newStaff,
        status: newStatus,
        business_id: businessId
      };
      
      const created = await customerBookingService.createBooking(newApptData);
      
      const newAppt: Appointment = {
        id: created.id,
        customerName: created.guest_name || newCustomerName,
        date: created.date || selectedDateStr,
        time: (created.time || selectedTime).substring(0, 5),
        service: created.service_name || newService, 
        masterName: created.staff_name || newStaff,
        status: (created.status as AppointmentStatus) || newStatus
      };

      setAppointments(prev => [...prev, newAppt]);
      setIsBookingModalOpen(false);
      setNewCustomerName("");
      setNewService("");
      
      if (businessId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.bookings.admin(businessId) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      
      toast.success(`${newCustomerName} booked successfully`);
    } catch (error) {
      console.error("Failed to add appointment", error);
      toast.error("Failed to create appointment");
    }
  };

  const handleDeleteAppointment = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAppointmentToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (appointmentToDelete) {
      try {
        await customerBookingService.deleteBooking(appointmentToDelete);
        setAppointments(prev => prev.filter(a => a.id !== appointmentToDelete));
        setAppointmentToDelete(null);
        
        if (businessId) {
          queryClient.invalidateQueries({ queryKey: queryKeys.bookings.admin(businessId) });
        }
        queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });

        toast.success("Appointment canceled");
      } catch (error) {
        console.error("Failed to delete appointment", error);
        toast.error("Failed to cancel appointment");
      }
    }
    setDeleteModalOpen(false);
  };

  const openModalForSlot = (date: string, time: string, isSlotActive: boolean, editable = false) => {
    const isPast = new Date(`${date}T${time}:00`) < new Date();
    if (isPast) {
      toast.error("Cannot book appointments in the past");
      return;
    }
    
    if (!isSlotActive) {
      // You could block booking here, but often admins want the ability to bypass
      // toast.info("Note: This slot is outside regular working hours.");
    }
    setSelectedDateStr(date);
    setSelectedTime(time);
    setIsDateEditable(editable);
    if (!newStaff) setNewStaff(knownStaff[0] || "");
    if (!newService) setNewService(knownServices[0] || "");
    setIsBookingModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'in_progress': return 'bg-[#e8efe9] text-[#4a6b53] border-[#4a6b53]/30';
      case 'completed': return 'bg-[#f0f0f0] text-[#8B9194] border-[#DCDCDA]';
      default: return 'bg-[#F5F5F4] text-[#4A4E51] border-[#DCDCDA]';
    }
  };
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'in_progress': return 'In Chair';
      case 'completed': return 'Done';
      default: return 'Waiting';
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex-1 flex flex-col relative h-full bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white">
        
        {/* HEADER */}
        <header className="bg-[#F5F5F4]/90 backdrop-blur-md border-b border-[#DCDCDA] px-6 md:px-10 py-4 md:py-0 md:h-20 shrink-0 sticky top-0 z-[99999] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#121415] tracking-tight">Schedule</h1>
            <p className="text-sm text-[#4A4E51] font-medium mt-0.5">Manage appointments for the next 7 days</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-[#F5F5F4] p-1.5 rounded-xl border border-[#DCDCDA]">
              <button 
                type="button" 
                onClick={handlePrevWeek}
                className="p-1.5 hover:bg-white rounded-lg transition-colors text-[#4A4E51] hover:text-[#121415]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="px-4 py-1.5 font-medium text-sm text-[#121415] bg-white rounded-lg shadow-sm border border-[#DCDCDA] cursor-default flex items-center gap-2">
                <span>{format(currentDate, "dd MMM")}</span>
                <span className="text-[#8B9194]">—</span>
                <span>{format(addDays(currentDate, 6), "dd MMM")}</span>
              </div>

              <button 
                type="button" 
                onClick={handleNextWeek}
                className="p-1.5 hover:bg-white rounded-lg transition-colors text-[#4A4E51] hover:text-[#121415]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              type="button" 
              onClick={() => {
                setSelectedDateStr(format(currentDate, "yyyy-MM-dd"));
                if (!newStaff) setNewStaff(knownStaff[0] || "");
                setIsDateEditable(true);
                setIsBookingModalOpen(true);
              }} 
              className="bg-[#121415] text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95"
            >
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Booking</span>
            </button>
          </div>
        </header>

        {/* TIMETABLE CONTENT */}
        <main className="flex-1 p-6 md:p-10 flex flex-col overflow-hidden">
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-[#DCDCDA] flex flex-col overflow-hidden">
            <div className="w-full h-full overflow-auto flex flex-col relative">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr>
                    {/* Empty corner */}
                    <th className="p-4 border-b border-r border-[#DCDCDA] bg-[#F5F5F4] w-20 text-center text-[#4A4E51] font-semibold text-sm sticky top-0 left-0 z-30 shadow-[1px_1px_0_#DCDCDA]">
                      Time
                    </th>
                    {/* Day Columns */}
                    {weekDaysView.map(date => {
                      const dayConfig = scheduleConfig.find(d => d.day === date.fullDayName);
                      const isDayActive = dayConfig ? dayConfig.isActive : true;
                      
                      return (
                        <th key={date.id} className={`p-3 border-b border-r last:border-r-0 border-[#DCDCDA] text-center min-w-[160px] sticky top-0 z-20 shadow-[0_1px_0_#DCDCDA] ${isDayActive ? 'bg-[#F5F5F4]' : 'bg-[#E5E5E5]'}`}>
                          <div className="flex items-baseline justify-center gap-1.5">
                            <div className={`text-sm font-medium capitalize ${isDayActive ? 'text-[#121415]' : 'text-[#8B9194]'}`}>{date.day}</div>
                            <div className="text-xs font-semibold text-[#8B9194]">{date.dateNum} {date.month}</div>
                          </div>
                          {!isDayActive && <div className="text-[10px] text-[#8B9194] font-medium uppercase mt-0.5">Day Off</div>}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map(time => (
                    <tr key={time} className="border-b border-[#DCDCDA] last:border-0 hover:bg-[#F5F5F4]/30 transition-colors group">
                      {/* Time Label */}
                      <td className="p-3 border-r border-[#DCDCDA] bg-[#F5F5F4] text-center font-bold text-[#121415] text-sm w-20 sticky left-0 z-10 shadow-[1px_0_0_#DCDCDA]">
                        {time}
                      </td>
                      {/* Cells for each Day */}
                      {weekDaysView.map(date => {
                        const apptsInSlot = appointments.filter(a => a.date === date.id && a.time.startsWith(time));
                        
                        // Check if this specific cell is within working hours
                        const dayConfig = scheduleConfig.find(d => d.day === date.fullDayName);
                        const isDayActive = dayConfig ? dayConfig.isActive : true;
                        let isTimeActive = true;
                        
                        if (isDayActive && dayConfig && dayConfig.start && dayConfig.end) {
                          const timeTotal = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
                          const startTotal = parseInt(dayConfig.start.split(':')[0]) * 60 + parseInt(dayConfig.start.split(':')[1]);
                          const endTotal = parseInt(dayConfig.end.split(':')[0]) * 60 + parseInt(dayConfig.end.split(':')[1]);
                          if (timeTotal < startTotal || timeTotal >= endTotal) {
                            isTimeActive = false;
                          }
                        }
                        const isPast = new Date(`${date.id}T${time}:00`) < new Date();
                        const isSlotActive = isDayActive && isTimeActive && !isPast;
                        
                        return (
                          <td 
                            key={`${time}-${date.id}`} 
                            className={`p-1.5 border-r last:border-r-0 border-[#DCDCDA] align-top min-w-[160px] relative group/cell transition-colors ${!isSlotActive ? 'bg-[#ECECEA]/60 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.02)_10px,rgba(0,0,0,0.02)_20px)]' : ''}`}
                          >
                            {isLoading ? (
                              <div className="w-full h-full min-h-[80px] bg-white/50 border border-[#DCDCDA] rounded-xl p-3">
                                <Skeleton className="w-20 h-4 mb-2" />
                                <Skeleton className="w-24 h-3 mb-1" />
                              </div>
                            ) : (
                              <div 
                                className={`w-full h-full min-h-[80px] flex flex-col gap-1.5 ${isSlotActive ? 'cursor-pointer' : ''}`}
                                onClick={() => openModalForSlot(date.id, time, isSlotActive)}
                              >
                                {apptsInSlot.map(appt => (
                                  <div 
                                    key={appt.id} 
                                    className={`w-full bg-white border border-[#DCDCDA] rounded-xl p-2 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group/card flex flex-col justify-between ${appt.status === 'completed' ? 'opacity-60' : ''}`}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="flex justify-between items-start mb-1.5">
                                      <div className="font-semibold text-[#8A2532] text-xs pr-4 flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        <span className="truncate">{appt.masterName}</span>
                                      </div>
                                      <button type="button" onClick={(e) => handleDeleteAppointment(appt.id, e)} className="text-[#8B9194] hover:text-[#dc2626] transition-colors focus-visible:outline-none rounded shrink-0 opacity-0 group-hover/card:opacity-100 absolute top-1 right-1 bg-white/90 p-1">
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                    
                                    <div className="text-xs font-medium text-[#121415] truncate mb-1">
                                      {appt.customerName}
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-auto pt-1 border-t border-[#F5F5F4]">
                                      <div className="text-[9px] font-medium text-[#4A4E51] truncate max-w-[60px]">
                                        {appt.service}
                                      </div>
                                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getStatusColor(appt.status)}`}>
                                        {getStatusLabel(appt.status)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                                
                                {/* Hover Space to Add (only if slot is active) */}
                                {isSlotActive && (
                                  <div className={`flex items-center justify-center rounded-xl border border-dashed border-[#DCDCDA] transition-colors text-[#8A2532] hover:border-[#8A2532] hover:bg-[#8A2532]/5 ${apptsInSlot.length === 0 ? 'flex-1 min-h-[80px] opacity-0 group-hover/cell:opacity-100' : 'h-8 opacity-0 group-hover/cell:opacity-100 mt-0.5'}`}>
                                    <Plus className="w-4 h-4" />
                                  </div>
                                )}
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

      {/* QUICK BOOKING MODAL */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-sm" role="dialog" aria-modal="true" onClick={() => setIsBookingModalOpen(false)}>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <button type="button" aria-label="Close" onClick={() => setIsBookingModalOpen(false)} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F5F4] hover:bg-[#ECECEA] flex items-center justify-center text-[#4A4E51] hover:text-[#121415] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95"><X className="w-4 h-4" /></button>
            
            <div className="p-6 border-b border-[#DCDCDA]">
              <h2 className="text-xl font-semibold text-[#121415] tracking-tight">New Appointment</h2>
            </div>
            
            <form className="p-6 space-y-4" onSubmit={handleAddAppointment}>
              
              {/* Row 1: Guest */}
              <div>
                <label className="block text-xs font-medium text-[#4A4E51] mb-2 uppercase tracking-wider">Client Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9194]" />
                  <input autoFocus required type="text" value={newCustomerName} onChange={e => setNewCustomerName(e.target.value)} placeholder="e.g. John Doe" className="w-full pl-10 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl font-medium text-[#121415] focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" />
                </div>
              </div>

              {/* Row 2: Service & Staff */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4A4E51] mb-2 uppercase tracking-wider">Service</label>
                  <CustomSelect 
                    icon={Scissors}
                    value={newService}
                    options={knownServices}
                    onChange={setNewService}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-[#4A4E51] mb-2 uppercase tracking-wider">Staff Member</label>
                  <CustomSelect 
                    icon={User}
                    value={newStaff}
                    options={knownStaff}
                    onChange={setNewStaff}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Row 3: Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-medium text-[#4A4E51] mb-2 uppercase tracking-wider">Date</label>
                   <CustomDatePicker 
                     value={selectedDateStr} 
                     onChange={setSelectedDateStr} 
                     disabled={!isDateEditable}
                     className="w-full"
                   />
                </div>

                <div>
                   <label className="block text-xs font-medium text-[#4A4E51] mb-2 uppercase tracking-wider">Time</label>
                   <CustomSelect 
                     icon={Clock}
                     value={selectedTime}
                     options={TIME_SLOTS}
                     onChange={setSelectedTime}
                     disabled={!isDateEditable}
                     className="w-full"
                   />
                </div>
              </div>

              {/* Row 4: Status */}
              <div>
                <label className="block text-xs font-medium text-[#4A4E51] mb-2 uppercase tracking-wider">Status</label>
                <CustomSelect 
                  value={newStatus}
                  options={["waiting", "in_progress", "completed"]}
                  onChange={(val) => setNewStatus(val as AppointmentStatus)}
                  className="w-full"
                />
              </div>

              <button type="submit" className="w-full mt-4 py-3.5 bg-[#121415] text-white rounded-xl font-medium text-sm hover:opacity-90 transition-all flex justify-center items-center shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95">
                Confirm Booking
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
        description="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Cancel Booking"
        cancelText="Keep"
        isDestructive={true}
      />
    </div>
  );
}
