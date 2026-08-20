"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import BookingService from "@/services/customer/BookingService";
import useAuthStore from "@/stores/authStore";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import {
  Plus,
  Clock,
  CheckCircle2,
  Scissors,
  User,
  X,
  Play,
  AlertTriangle,
  TrendingUp,
  Users,
  Power,
  TimerReset,
  Filter,
  ChevronDown,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [isMounted, setIsMounted] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  
  const [teamData, setTeamData] = useState<any[]>([]);
  const [servicesData, setServicesData] = useState<any[]>([]);
  
  useEffect(() => {
    setIsMounted(true);
    async function loadBusinessId() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: business } = await supabase.from('businesses').select('id, team_data').eq('owner_id', user.id).single();
      if (business) {
        setBusinessId(business.id);
        if (business.team_data && Array.isArray(business.team_data)) {
          setTeamData(business.team_data);
        }
      }
    }
    loadBusinessId();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
interface Guest {
  id: string | number;
  name: string;
  service?: string;
  time: string;
  oldTime?: string | null;
  staff: string;
  delay?: string | null;
}

  const [customerName, setClientName] = useState("");
  const [staffName, setStaffName] = useState("Ali Ahmedov");
  const [service, setService] = useState("Haircut");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isPaused, setIsPaused] = useState(false);

  const [waitingGuests, setWaitingGuests] = useState<Guest[]>([]);
  const [inChairGuests, setInChairGuests] = useState<Guest[]>([]);
  const [completedGuests, setCompletedGuests] = useState<Guest[]>([]);

  // Keep a ref of all guests to preserve local state like `delay` and `oldTime` during refetch
  const allGuestsRef = React.useRef<Map<string | number, Guest>>(new Map());

  // Update ref whenever lists change
  useEffect(() => {
    const map = new Map<string | number, Guest>();
    [...waitingGuests, ...inChairGuests, ...completedGuests].forEach(g => {
      map.set(g.id, g);
    });
    allGuestsRef.current = map;
  }, [waitingGuests, inChairGuests, completedGuests]);

  const { user: currentUser } = useAuthStore();

  const { data: bookings } = useQuery({
    queryKey: ['adminBookings'],
    queryFn: () => BookingService.getBookings(),
    refetchInterval: 2000,
  });

  useEffect(() => {
    if (!bookings) return;
    
    const venueBookings = bookings.filter((b: any) => {
      // Filter by current user ID acting as the business owner
      const ownerId = Array.isArray(b.businesses) ? b.businesses[0]?.owner_id : b.businesses?.owner_id;
      if (currentUser?.id && ownerId) {
        return ownerId === currentUser.id;
      }
      return false;
    });

    const waiting: Guest[] = [];
    const inChair: Guest[] = [];
    const completed: Guest[] = [];

    venueBookings.forEach((b: any) => {
      const existing = allGuestsRef.current.get(b.id);
      const guest: Guest = {
        id: b.id,
        name: b.guest_name || b.customerName || "Guest",
        service: b.service_name || b.serviceName || b.service_id || "Service",
        time: b.time || b.startTime || "12:00",
        oldTime: existing?.oldTime || null,
        staff: b.staff_name || (b.staff_name || b.staffName) || "Ali Ahmedov",
        delay: existing?.delay || null
      };
      
      if (b.status === "in_progress") inChair.push(guest);
      else if (b.status === "completed" || b.status === "done") completed.push(guest);
      else waiting.push(guest);
    });

    setWaitingGuests(waiting);
    setInChairGuests(inChair);
    setCompletedGuests(completed);
  }, [bookings, currentUser?.id]);

  // Calculate dynamic KPIs
  const venueBookings = bookings?.filter((b: any) => {
    const ownerId = Array.isArray(b.businesses) ? b.businesses[0]?.owner_id : b.businesses?.owner_id;
    if (currentUser?.id && ownerId) {
      return ownerId === currentUser.id;
    }
    return false;
  }) || [];

  const totalBookings = venueBookings.length;
  const inSalonNow = inChairGuests.length;
  
  // Calculate top service
  const serviceCounts: Record<string, number> = {};
  venueBookings.forEach((b: any) => {
    const s = b.service_name || b.serviceName || b.service_id;
    if (s) {
      serviceCounts[s] = (serviceCounts[s] || 0) + 1;
    }
  });
  let topService = "N/A";
  let maxCount = 0;
  for (const [s, count] of Object.entries(serviceCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topService = s;
    }
  }

  // Calculate total delay (mock logic for now if delay is null)
  const totalDelay = venueBookings.reduce((acc: number, b: any) => {
    const existing = allGuestsRef.current.get(b.id);
    const delayMatch = existing?.delay?.match(/(\d+)/);
    if (delayMatch) {
      return acc + parseInt(delayMatch[1], 10);
    }
    return acc;
  }, 0);

  // Calculate dynamic masters list
  const mastersSet = new Set<string>();
  venueBookings.forEach((b: any) => {
    if ((b.staff_name || b.staffName)) mastersSet.add((b.staff_name || b.staffName));
  });
  teamData.forEach((t: any) => {
    if (t.name && t.isActive !== false) mastersSet.add(t.name);
  });
  const mastersList = Array.from(mastersSet);
  if (mastersList.length === 0) {
    mastersList.push("Any Professional");
  }

  const handleAddGuest = async () => {
    if (!customerName.trim()) return;
    
    if (!businessId) {
      toast.error("Business not found. Cannot add guest.");
      return;
    }

    const bData = {
      guest_name: customerName,
      serviceName: service,
      staffName: staffName,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      is_guest: true,
      business_id: businessId
    };
    
    try {
      await BookingService.createBooking(bData as any);
      toast.success(`${customerName} added to the queue`);
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
    } catch (e) {
      console.error(e);
      toast.error("Failed to add guest to queue");
      return;
    }
    
    setIsModalOpen(false);
    setClientName("");
    setStaffName("Ali Ahmedov");
    setService("Haircut");
  };

  const addMinutesToTime = (timeStr: string, minsToAdd: number) => {
    if (!timeStr) return timeStr;
    const parts = timeStr.split(':');
    if (parts.length !== 2) return timeStr;
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    if (isNaN(hours) || isNaN(minutes)) return timeStr;
    const date = new Date();
    date.setHours(hours, minutes + minsToAdd, 0, 0);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const handleCallIn = async (guestId: string | number) => {
    const guest = waitingGuests.find(g => g.id === guestId);
    if (!guest) return;
    
    // Optimistic UI update
    setWaitingGuests(prev => prev.filter(g => g.id !== guestId));
    setInChairGuests(prev => [...prev, { ...guest, delay: null }]);
    
    try {
      await BookingService.updateBookingStatus(guestId.toString(), "in_progress");
      await queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
      toast.success(`${guest.name} called to chair`);
    } catch (err) {
      toast.error("Failed to update status");
      // Could revert here on failure
    }
  };

  const handleComplete = async (guestId: string | number) => {
    const guest = inChairGuests.find(g => g.id === guestId);
    if (!guest) return;
    
    // Optimistic UI update
    setInChairGuests(prev => prev.filter(g => g.id !== guestId));
    setCompletedGuests(prev => [...prev, { ...guest, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }]);
    
    try {
      await BookingService.updateBookingStatus(guestId.toString(), "completed");
      toast.success(`Session with ${guest.name} completed`);
      
      // Find next waiting guest for this staff and call them in
      const nextGuest = waitingGuests.find(g => g.staff === guest.staff);
      if (nextGuest) {
        setWaitingGuests(prev => prev.filter(g => g.id !== nextGuest.id));
        setInChairGuests(prev => [...prev, { ...nextGuest, delay: null }]);
        await BookingService.updateBookingStatus(nextGuest.id.toString(), "in_progress");
        toast.info(`${nextGuest.name} was automatically called in`);
      } else {
        toast.info(`No waiting customers left for ${guest.staff}`);
      }
      
      await queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
    } catch (err) {
      toast.error("Failed to complete session");
    }
  };

  const handleAddDelay = (guestId: string | number) => {
    const guestInChair = inChairGuests.find(g => g.id === guestId);
    if (!guestInChair) return;
    
    setWaitingGuests(prev => {
      let updatedCount = 0;
      const nextList = prev.map(waitingGuest => {
        if (waitingGuest.staff === guestInChair.staff) {
          updatedCount++;
          const currentDelayMatch = waitingGuest.delay ? waitingGuest.delay.match(/\+?(\d+)m/) : null;
          const currentDelay = currentDelayMatch ? parseInt(currentDelayMatch[1], 10) : 0;
          return {
            ...waitingGuest,
            oldTime: waitingGuest.oldTime || waitingGuest.time,
            time: addMinutesToTime(waitingGuest.time, 10),
            delay: `Delay +${currentDelay + 10}m`
          };
        }
        return waitingGuest;
      });
      
      if (updatedCount > 0) {
        toast.warning(`+10 min delay applied to queue for ${guestInChair.staff}`);
      } else {
        toast.info(`No customers waiting for ${guestInChair.staff}`);
      }
      return nextList;
    });
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const allGuests = [...waitingGuests, ...inChairGuests, ...completedGuests];
    const guestId = draggableId;
    const guest = allGuests.find(g => String(g.id) === guestId);
    if (!guest) return;

    // Helper to get setter
    const getSetter = (id: string) => {
      if (id === 'waiting') return setWaitingGuests;
      if (id === 'inChair') return setInChairGuests;
      return setCompletedGuests;
    };

    const sourceSetter = getSetter(source.droppableId);
    const destSetter = getSetter(destination.droppableId);

    const updatedGuest = { ...guest };
    if (destination.droppableId === 'completed' && source.droppableId !== 'completed') {
      updatedGuest.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    if (destination.droppableId === 'inChair') {
      updatedGuest.delay = null;
    }

    if (source.droppableId === destination.droppableId) {
      // Reorder within same list
      sourceSetter(prev => {
        const arr = Array.from(prev);
        // Find index of actual item in the state array (since visual index might be filtered)
        const actualSourceIndex = arr.findIndex(g => String(g.id) === guestId);
        if (actualSourceIndex === -1) return prev;
        
        arr.splice(actualSourceIndex, 1);
        
        // Find destination index in the unfiltered array
        // It's safer to just splice it at destination.index. If filtered, it might jump, but it's fine for now.
        // To be perfect, if selectedFilter !== 'All', we'd need more complex logic. 
        // For simplicity:
        arr.splice(destination.index, 0, updatedGuest);
        return arr;
      });
    } else {
      // Move between lists
      sourceSetter(prev => prev.filter(g => String(g.id) !== guestId));
      destSetter(prev => {
        const arr = Array.from(prev);
        arr.splice(destination.index, 0, updatedGuest);
        return arr;
      });

      // API Call mapping
      let newStatus: "pending" | "in_progress" | "completed" | null = null;
      if (destination.droppableId === 'waiting') newStatus = "pending";
      else if (destination.droppableId === 'inChair') newStatus = "in_progress";
      else if (destination.droppableId === 'completed') newStatus = "completed";

      if (newStatus) {
        BookingService.updateBookingStatus(String(guestId), newStatus)
          .then(() => queryClient.invalidateQueries({ queryKey: ['adminBookings'] }))
          .catch(() => {
            toast.error("Failed to update status in DB");
          });
      }

      if (destination.droppableId === 'inChair' && source.droppableId === 'waiting') {
        toast.success(`${updatedGuest.name} moved to chair`);
      } else if (destination.droppableId === 'completed' && source.droppableId === 'inChair') {
        toast.success(`Session with ${updatedGuest.name} completed`);
      } else if (destination.droppableId === 'completed') {
        toast.success(`${updatedGuest.name} moved to completed`);
      } else {
        toast.info(`${updatedGuest.name} status updated`);
      }
    }
  };

  const filteredWaiting = selectedFilter === "All" ? waitingGuests : waitingGuests.filter(g => g.staff === selectedFilter);
  const filteredInChair = selectedFilter === "All" ? inChairGuests : inChairGuests.filter(g => g.staff === selectedFilter);
  const filteredCompleted = selectedFilter === "All" ? completedGuests : completedGuests.filter(g => g.staff === selectedFilter);

  if (!isMounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-[100dvh] bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white">
        <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* HEADER */}
        <header className="bg-[#F5F5F4]/90 backdrop-blur-md border-b border-[#DCDCDA] px-6 md:px-10 py-4 md:py-0 h-auto md:h-20 shrink-0 sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#121415] tracking-tight">Queue (Live)</h1>
            <p className="text-sm text-[#4A4E51] font-medium mt-0.5">Real-time customer flow & queue management</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIsPaused(!isPaused);
                toast.success(isPaused ? "Bookings resumed" : "Bookings paused");
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 text-white ${
                isPaused 
                  ? "bg-[#8A2532] hover:bg-[#8A2532]/90 focus-visible:ring-[#8A2532]" 
                  : "bg-[#4a6b53] hover:bg-[#4a6b53]/90 focus-visible:ring-[#4a6b53]"
              }`}
            >
              <Power className="w-4 h-4" /> 
              <span className="hidden sm:inline">
                {isPaused ? "Resume Bookings" : "Pause Bookings"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-[#121415] text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Guest
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto flex flex-col pt-6">
          
          {/* KPI CARDS */}
          <div className="px-6 md:px-10 pb-6 grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
            <div className="bg-white p-5 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 text-[#4A4E51] mb-2">
                <TrendingUp className="w-4 h-4" /> 
                <span className="text-xs font-medium uppercase tracking-wider">Total Bookings</span>
              </div>
              <div className="text-3xl font-semibold text-[#121415]">{totalBookings}</div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 text-[#4A4E51] mb-2">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">In Salon Now</span>
              </div>
              <div className="text-3xl font-semibold text-[#121415]">{inSalonNow}</div>
            </div>
  
            <div className="bg-white p-5 rounded-2xl border border-[#DCDCDA] shadow-sm flex flex-col justify-between min-w-0">
              <div className="flex items-center gap-2 text-[#4A4E51] mb-2 shrink-0">
                <Scissors className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Top Service</span>
              </div>
              <div className="text-xl font-semibold text-[#121415] truncate" title={topService}>{topService}</div>
            </div>
  
            <div className="bg-[#FFF4F4] p-5 rounded-2xl border border-[#FDE8E8] shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 text-[#8A2532] mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Total Delay</span>
              </div>
              <div className="text-3xl font-semibold text-[#8A2532]">{totalDelay} min</div>
            </div>
          </div>

          {/* MASTER FILTERS */}
          <div className="px-6 md:px-10 pb-4 shrink-0 flex items-center justify-between w-full overflow-hidden">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide bg-[#F5F5F4] p-1.5 rounded-xl border border-[#DCDCDA] w-full max-w-full">
              <Filter className="w-4 h-4 text-[#8B9194] shrink-0 ml-2" />
              {["All", ...mastersList].map(filter => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedFilter(filter)}
                  className={`shrink-0 px-5 py-1.5 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] ${selectedFilter === filter ? 'bg-white text-[#121415] shadow-sm border border-[#DCDCDA]' : 'text-[#4A4E51] hover:text-[#121415] border border-transparent'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* KANBAN BOARD */}
          <div className="flex-1 flex gap-6 px-6 md:px-10 pb-10 overflow-x-auto items-start touch-pan-x">
            
            {/* COLUMN 1: WAITING */}
            <div className="flex-1 min-w-[300px] flex flex-col rounded-[2rem] border p-4 shadow-sm transition-colors duration-200 bg-[#F5F5F4]/80 border-[#DCDCDA]">
              <div className="flex justify-between items-center mb-5 px-2">
                <h2 className="font-semibold text-[#121415] flex items-center gap-2 text-lg tracking-tight">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8A2532]"></span>
                  Waiting
                </h2>
                <span className="text-xs font-medium text-[#121415] bg-white border border-[#DCDCDA] shadow-sm px-2.5 py-1 rounded-lg">{filteredWaiting.length}</span>
              </div>
              
              <Droppable droppableId="waiting">
                {(provided) => (
                  <div 
                    className="space-y-4 pb-4 min-h-[100px]" 
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                  >
                    {filteredWaiting.map((guest, index) => (
                      <Draggable key={guest.id.toString()} draggableId={guest.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-4 rounded-2xl border transition-all duration-200 relative group touch-pan-y ${guest.delay ? 'border-[#8A2532]/30' : 'border-[#DCDCDA]'} overflow-hidden ${snapshot.isDragging ? 'shadow-xl scale-[1.02] z-50 ring-2 ring-[#121415]/20' : 'shadow-sm'}`}
                          >
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#8A2532]"></div>
                            <div className="flex justify-between items-start mb-3 pl-1">
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-[#121415]">{guest.name}</span>
                                <span className="text-xs font-medium text-[#4A4E51] mt-0.5">{guest.service}</span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className={`text-sm font-semibold ${guest.delay ? 'text-[#8A2532]' : 'text-[#121415]'}`}>{guest.time}</span>
                                {guest.oldTime && <span className="text-[10px] font-medium text-[#8B9194] line-through">{guest.oldTime}</span>}
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F5F5F4] pl-1">
                              <span className="text-[10px] font-medium uppercase tracking-wider text-[#4A4E51] bg-[#F5F5F4] px-2 py-1 rounded-md border border-[#DCDCDA] truncate max-w-[120px]">
                                {guest.staff}
                              </span>
                              {guest.delay ? (
                                <span className="text-[10px] font-medium text-[#8A2532] bg-[#8A2532]/10 px-2 py-1 rounded-md">{guest.delay}</span>
                              ) : (
                                <button type="button" onClick={() => handleCallIn(guest.id)} className="px-4 py-2 bg-[#4a6b53]/10 text-[#4a6b53] hover:bg-[#4a6b53] hover:text-white rounded-lg text-xs font-medium transition-colors shadow-sm flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a6b53]">
                                  <Play className="w-3 h-3" /> Call In
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {filteredWaiting.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-32 text-center border-2 border-dashed border-[#DCDCDA] rounded-2xl mx-1 bg-[#F5F5F4]/50">
                        <span className="text-sm font-medium text-[#8B9194]">No guests waiting</span>
                        <span className="text-[10px] text-[#8B9194]/70 mt-1 uppercase tracking-wider">Queue is clear</span>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* COLUMN 2: IN CHAIR */}
            <div className="flex-1 min-w-[300px] flex flex-col rounded-[2rem] border p-4 shadow-sm transition-colors duration-200 bg-[#e8efe9]/50 border-[#4a6b53]/20">
              <div className="flex justify-between items-center mb-5 px-2">
                <h2 className="font-semibold text-[#121415] flex items-center gap-2 text-lg tracking-tight">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4a6b53] animate-pulse"></span>
                  In Chair
                </h2>
                <span className="text-xs font-medium text-[#4a6b53] bg-[#e8efe9] border border-[#4a6b53]/30 px-2.5 py-1 rounded-lg">{filteredInChair.length}</span>
              </div>
              
              <Droppable droppableId="inChair">
                {(provided) => (
                  <div 
                    className="space-y-4 pb-4 min-h-[100px]"
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                  >
                    {filteredInChair.map((guest, index) => (
                      <Draggable key={guest.id.toString()} draggableId={guest.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-5 rounded-2xl shadow-sm border border-[#4a6b53]/30 relative group touch-pan-y overflow-hidden ${snapshot.isDragging ? 'shadow-xl scale-[1.02] z-50 ring-2 ring-[#4a6b53]/30' : ''}`}
                          >
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#4a6b53]"></div>
                            <div className="flex justify-between items-start mb-4 pl-2">
                              <div className="flex flex-col">
                                <span className="text-xs font-medium text-[#4a6b53] uppercase tracking-wider mb-1">Staff: {guest.staff}</span>
                                <span className="text-lg font-semibold text-[#121415] tracking-tight leading-tight">{guest.name}</span>
                                <span className="text-sm font-medium text-[#4A4E51] mt-0.5">{guest.service}</span>
                              </div>
                              <div className="bg-[#F5F5F4] px-2.5 py-1 rounded-lg border border-[#DCDCDA] text-xs font-medium text-[#4A4E51] flex items-center gap-1.5">
                                <Clock className="w-3 h-3" /> {guest.time}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 pl-2 border-t border-[#DCDCDA] pt-4">
                              <button type="button" onClick={() => handleComplete(guest.id)} className="w-full py-3 bg-[#121415] text-white rounded-xl font-medium text-sm shadow-sm hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                                <CheckCircle2 className="w-4 h-4 text-white/70" /> Complete & Call Next
                              </button>
                              <div className="flex items-center gap-2">
                                <button type="button" onClick={() => handleAddDelay(guest.id)} className="flex-1 py-2.5 bg-white text-[#121415] hover:bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                                  <TimerReset className="w-3.5 h-3.5" /> +10 min delay
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {filteredInChair.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-32 text-center border-2 border-dashed border-[#4a6b53]/30 rounded-2xl mx-1 bg-white/50">
                        <span className="text-sm font-medium text-[#4a6b53]/70">All chairs are free</span>
                        <span className="text-[10px] text-[#4a6b53]/50 mt-1 uppercase tracking-wider">Ready for work</span>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* COLUMN 3: COMPLETED */}
            <div className="flex-1 min-w-[300px] flex flex-col rounded-[2rem] border p-4 shadow-sm transition-colors duration-200 bg-[#ECECEA]/30 border-[#DCDCDA]/50 opacity-70 hover:opacity-100">
              <div className="flex justify-between items-center mb-5 px-2">
                <h2 className="font-medium text-[#8B9194] flex items-center gap-2 text-sm uppercase tracking-widest">
                  Completed
                </h2>
              </div>
              
              <Droppable droppableId="completed">
                {(provided) => (
                  <div 
                    className="space-y-4 pb-4 min-h-[100px]"
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                  >
                    {filteredCompleted.map((guest, index) => (
                      <Draggable key={guest.id.toString()} draggableId={guest.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-3 rounded-xl border border-[#DCDCDA] flex items-center justify-between opacity-80 group touch-pan-y overflow-hidden ${snapshot.isDragging ? 'shadow-xl scale-[1.02] z-50 ring-2 ring-[#8B9194]/30 opacity-100' : ''}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#F5F5F4] flex items-center justify-center border border-[#DCDCDA]">
                                <CheckCircle2 className="w-4 h-4 text-[#8B9194]" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-medium text-[#121415] truncate max-w-[120px]">{guest.name}</span>
                                <span className="text-[10px] font-medium text-[#8B9194]">{guest.time}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-medium text-[#4A4E51] bg-[#F5F5F4] px-2 py-1 rounded-lg border border-[#DCDCDA] truncate max-w-[80px]">
                              {guest.staff}
                            </span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {filteredCompleted.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-32 text-center border-2 border-dashed border-[#DCDCDA]/50 rounded-xl mx-1">
                        <span className="text-xs font-medium text-[#8B9194]">No completed yet</span>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

          </div>
        </main>
      </div>

      {/* NEW APPOINTMENT MODAL */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F4] text-[#4A4E51] hover:text-[#121415] hover:bg-[#ECECEA] transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-8 pb-6 shrink-0">
              <h2 className="text-2xl font-semibold text-[#121415] tracking-tight">New Appointment</h2>
              <p className="text-sm text-[#4A4E51] font-medium mt-1">Add guest to the daily schedule</p>
            </div>
            <form className="px-8 py-2" onSubmit={(e) => { e.preventDefault(); handleAddGuest(); }}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#121415] mb-2">Customer Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9194]" />
                    <input 
                      type="text" 
                      name="customerName" 
                      value={customerName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g., Azamat" 
                      className="w-full pl-12 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#121415] mb-2">Staff</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`w-full flex items-center justify-between pl-4 pr-4 py-3 border rounded-xl text-left font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]/10 ${isDropdownOpen ? 'bg-white border-[#121415] ring-2 ring-[#121415]/10' : 'bg-[#F5F5F4] border-[#DCDCDA] text-[#121415]'}`}
                    >
                      <span>{staffName}</span>
                      <ChevronDown className={`w-5 h-5 text-[#8B9194] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                        <div className="absolute z-50 w-full mt-2 bg-white border border-[#DCDCDA] rounded-xl shadow-lg py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                          {mastersList.map((staff) => (
                            <button
                              key={staff}
                              type="button"
                              onClick={() => {
                                setStaffName(staff);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#F5F5F4] ${staffName === staff ? 'text-[#121415] bg-[#F5F5F4]/50' : 'text-[#4A4E51]'}`}
                            >
                              {staff}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#121415] mb-2">Service</label>
                                    <div className="grid grid-cols-2 gap-3">
                    {servicesData.length > 0 ? servicesData.map(s => (
                      <button 
                        key={s.id}
                        type="button" 
                        onClick={() => setService(s.id)}
                        className={`flex flex-col items-start p-4 border rounded-xl relative text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] ${service === s.id ? 'border-[#121415] bg-[#121415] text-white' : 'border-[#DCDCDA] bg-[#F5F5F4] hover:border-[#121415] text-[#4A4E51]'}`}
                      >
                        <Scissors className={`w-5 h-5 mb-2 ${service === s.id ? 'text-white' : 'text-[#8B9194]'}`} />
                        <span className="font-medium text-sm">{s.name}</span>
                      </button>
                    )) : (
                      <span className="text-sm text-[#8B9194]">No services added to business</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-8 pt-6 border-t border-[#DCDCDA] pb-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white hover:bg-[#F5F5F4] border border-[#DCDCDA] text-[#121415] rounded-xl font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#121415] hover:opacity-90 text-white rounded-xl font-medium text-sm shadow-sm transition-all flex justify-center items-center active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">
                  Save Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </DragDropContext>
  );
}