"use client";
import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BookingService from "@/services/customer/BookingService";
import { queryKeys } from "@/lib/queryKeys";
import { Booking } from "@/types";
import { format } from "date-fns";
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
  Loader2,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "@/components/ui/Skeleton";

interface Guest {
  id: string;
  name: string;
  service: string;
  time: string;
  oldTime?: string | null;
  staff: string;
  staffId?: string | null;
  delay?: string | null;
  delayMinutes: number;
  status: string;
}

const addMinutesToTimeStr = (timeStr: string, minsToAdd: number): string => {
  if (!timeStr) return timeStr;
  const parts = timeStr.split(':');
  if (parts.length !== 2) return timeStr;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return timeStr;
  const totalMins = hours * 60 + minutes + minsToAdd;
  const newH = Math.floor(totalMins / 60) % 24;
  const newM = totalMins % 60;
  return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
};

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [isMounted, setIsMounted] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  
  const [teamData, setTeamData] = useState<any[]>([]);
  const [servicesData, setServicesData] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [customerName, setClientName] = useState("");
  const [staffName, setStaffName] = useState("Ali Ahmedov");
  const [service, setService] = useState("Haircut");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    async function loadBusinessId() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: business } = await supabase
        .from('businesses')
        .select('id, team_data, policies_data')
        .eq('owner_id', user.id)
        .maybeSingle();
      if (business) {
        setBusinessId(business.id);
        
        if (business.policies_data && typeof business.policies_data === 'object' && 'is_paused' in business.policies_data) {
          setIsPaused(business.policies_data.is_paused as boolean);
        }

        if (business.team_data && Array.isArray(business.team_data)) {
          setTeamData(business.team_data);
        }
        const { data: services } = await supabase
          .from('services')
          .select('*')
          .eq('business_id', business.id);
        if (services && services.length > 0) {
          setServicesData(services);
          setService(services[0].id);
        }
      }
    }
    loadBusinessId();
  }, []);

  const adminQueryKey = queryKeys.bookings.admin(businessId);

  // TanStack React Query for Live Queue
  const { data: bookings, isLoading: isBookingsLoading } = useQuery({
    queryKey: adminQueryKey,
    queryFn: () => BookingService.getBookings(businessId || undefined),
    refetchInterval: 2000,
    enabled: !!businessId,
  });

  // Mutation: Update status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: Booking["status"] }) => {
      return BookingService.updateBookingStatus(bookingId, status);
    },
    onMutate: async ({ bookingId, status }) => {
      await queryClient.cancelQueries({ queryKey: adminQueryKey });
      const previousBookings = queryClient.getQueryData<Booking[]>(adminQueryKey);
      if (previousBookings) {
        queryClient.setQueryData<Booking[]>(adminQueryKey, old =>
          (old || []).map(b => (b.id === bookingId ? { ...b, status } : b))
        );
      }
      return { previousBookings };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousBookings) {
        queryClient.setQueryData(adminQueryKey, context.previousBookings);
      }
      toast.error("Failed to update status in DB");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKey });
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });

  // Mutation: Add Delay (Persisted in DB)
  const updateDelayMutation = useMutation({
    mutationFn: async ({ updates }: { updates: { id: string; delay_minutes: number }[] }) => {
      return Promise.all(
        updates.map(u => BookingService.updateBookingDelay(u.id, u.delay_minutes))
      );
    },
    onMutate: async ({ updates }) => {
      await queryClient.cancelQueries({ queryKey: adminQueryKey });
      const previousBookings = queryClient.getQueryData<Booking[]>(adminQueryKey);
      const updateMap = new Map(updates.map(u => [u.id, u.delay_minutes]));

      if (previousBookings) {
        queryClient.setQueryData<Booking[]>(adminQueryKey, old =>
          (old || []).map(b => {
            if (updateMap.has(b.id)) {
              const d = updateMap.get(b.id)!;
              return { ...b, delay_minutes: d, delayMinutes: d };
            }
            return b;
          })
        );
      }
      return { previousBookings };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousBookings) {
        queryClient.setQueryData(adminQueryKey, context.previousBookings);
      }
      toast.error("Failed to save delay to database");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKey });
    },
  });

  // Mutation: Complete & Call Next
  const completeAndCallNextMutation = useMutation({
    mutationFn: async ({ currentId, nextId }: { currentId: string; nextId?: string }) => {
      return BookingService.completeAndCallNext(currentId, nextId);
    },
    onMutate: async ({ currentId, nextId }) => {
      await queryClient.cancelQueries({ queryKey: adminQueryKey });
      const previousBookings = queryClient.getQueryData<Booking[]>(adminQueryKey);
      if (previousBookings) {
        queryClient.setQueryData<Booking[]>(adminQueryKey, old =>
          (old || []).map(b => {
            if (b.id === currentId) return { ...b, status: 'completed' as const };
            if (nextId && b.id === nextId) {
              return { ...b, status: 'in_progress' as const, delay_minutes: 0, delayMinutes: 0 };
            }
            return b;
          })
        );
      }
      return { previousBookings };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousBookings) {
        queryClient.setQueryData(adminQueryKey, context.previousBookings);
      }
      toast.error("Failed to complete session");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKey });
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });

  // Parse and organize guests from queries data
  const { waitingGuests, inChairGuests, completedGuests, allVenueBookings } = useMemo(() => {
    if (!bookings || !businessId) {
      return { waitingGuests: [], inChairGuests: [], completedGuests: [], allVenueBookings: [] };
    }

    const todayStr = format(new Date(), "yyyy-MM-dd");
    const venueBookings = bookings.filter((b: any) => {
      const isCorrectBusinessAndStatus = b.business_id === businessId && b.status !== "cancelled";
      const isTodayOrNoDate = !b.date || String(b.date).startsWith(todayStr);
      return isCorrectBusinessAndStatus && isTodayOrNoDate;
    });

    const waiting: Guest[] = [];
    const inChair: Guest[] = [];
    const completed: Guest[] = [];

    venueBookings.forEach((b: any) => {
      let guestNameClean = b.guest_name || b.guestName || b.customerName || "Guest";
      let actualStaffId = b.staff_id || b.staffId || "";

      // Safe legacy fallback if ||| is in guest_name
      if (typeof guestNameClean === 'string' && guestNameClean.includes("|||")) {
        const parts = guestNameClean.split("|||");
        guestNameClean = parts[0];
        if (!actualStaffId) actualStaffId = parts[1];
      }

      let actualStaffName = b.staff_name || b.staffName || "Any available";
      if (actualStaffName === "Any available" && actualStaffId && teamData.length > 0) {
        const staffObj = teamData.find((t: any) => String(t.id) === String(actualStaffId));
        if (staffObj) actualStaffName = staffObj.name;
      }

      let actualServiceName = b.service_name || b.serviceName || "Service";
      if (actualServiceName === "Service" && b.service_id && servicesData.length > 0) {
        const srv = servicesData.find((s: any) => String(s.id) === String(b.service_id));
        if (srv) actualServiceName = srv.name;
      }

      const delayMins = Number(b.delay_minutes || b.delayMinutes || 0);
      const baseTime = b.time || b.startTime || "12:00";
      const adjustedTime = delayMins > 0 ? addMinutesToTimeStr(baseTime, delayMins) : baseTime;

      const guest: Guest = {
        id: String(b.id),
        name: guestNameClean,
        service: actualServiceName,
        time: adjustedTime,
        oldTime: delayMins > 0 ? baseTime : null,
        staff: actualStaffName,
        staffId: actualStaffId,
        delay: delayMins > 0 ? `Delay +${delayMins}m` : null,
        delayMinutes: delayMins,
        status: b.status,
      };

      if (b.status === "in_progress") {
        inChair.push(guest);
      } else if (b.status === "completed" || b.status === "done") {
        completed.push(guest);
      } else {
        waiting.push(guest);
      }
    });

    return {
      waitingGuests: waiting,
      inChairGuests: inChair,
      completedGuests: completed,
      allVenueBookings: venueBookings,
    };
  }, [bookings, businessId, teamData, servicesData]);

  // Dynamic masters list for filter
  const mastersList = useMemo(() => {
    const set = new Set<string>();
    allVenueBookings.forEach((b: any) => {
      let sName = b.staff_name || b.staffName;
      if (!sName && b.staff_id && teamData.length > 0) {
        const s = teamData.find((t: any) => String(t.id) === String(b.staff_id));
        if (s) sName = s.name;
      }
      if (sName) set.add(sName);
    });

    teamData.forEach((t: any) => {
      if (t.name && t.isActive !== false) set.add(t.name);
    });

    const list = Array.from(set);
    return list.length > 0 ? list : ["Any Professional"];
  }, [allVenueBookings, teamData]);

  // KPI calculations
  const totalBookings = allVenueBookings.length;
  const inSalonNow = inChairGuests.length;

  const topService = useMemo(() => {
    const serviceCounts: Record<string, number> = {};
    allVenueBookings.forEach((b: any) => {
      let s = b.service_name || b.serviceName;
      if ((!s || s === "Service") && b.service_id && servicesData.length > 0) {
        const srv = servicesData.find((sd: any) => String(sd.id) === String(b.service_id));
        if (srv) s = srv.name;
      }
      s = s || b.service_id;

      if (s) {
        serviceCounts[s] = (serviceCounts[s] || 0) + 1;
      }
    });
    let top = "N/A";
    let max = 0;
    for (const [name, count] of Object.entries(serviceCounts)) {
      if (count > max) {
        max = count;
        top = name;
      }
    }
    return top;
  }, [allVenueBookings, servicesData]);

  const totalDelay = useMemo(() => {
    return allVenueBookings.reduce((acc: number, b: any) => {
      return acc + (Number(b.delay_minutes || b.delayMinutes || 0));
    }, 0);
  }, [allVenueBookings]);

  // Actions
  const handleAddGuest = async () => {
    if (!customerName.trim()) return;
    if (!businessId) {
      toast.error("Business not found. Cannot add guest.");
      return;
    }

    setIsAddingGuest(true);

    const foundStaff = teamData.find((t: any) => t.name === staffName);
    const chosenService = servicesData.find((s: any) => s.id === service);

    const bData = {
      guest_name: customerName.trim(),
      staff_id: foundStaff ? String(foundStaff.id) : null,
      staff_name: foundStaff ? foundStaff.name : staffName,
      service_id: service,
      service_name: chosenService ? chosenService.name : "Haircut",
      time: format(new Date(), "HH:mm"),
      date: format(new Date(), "yyyy-MM-dd"),
      status: "pending" as const,
      is_guest: true,
      client_id: null,
      business_id: businessId,
      delay_minutes: 0,
      queue_order: waitingGuests.length,
    };

    try {
      await BookingService.createBooking(bData as any);
      toast.success(`${customerName} added to the queue`);
      queryClient.invalidateQueries({ queryKey: adminQueryKey });
      
      // Delay slightly so the spinner is visible to the user, providing feedback
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (e) {
      console.error(e);
      toast.error("Failed to add guest to queue");
      setIsAddingGuest(false);
      return;
    }

    setIsAddingGuest(false);
    setIsModalOpen(false);
    setClientName("");
    setStaffName(mastersList[0] || "Ali Ahmedov");
    if (servicesData.length > 0) setService(servicesData[0].id);
  };

  const handleCallIn = async (guestId: string) => {
    const guest = waitingGuests.find(g => g.id === guestId);
    if (!guest) return;

    updateStatusMutation.mutate({ bookingId: guestId, status: "in_progress" });
    toast.success(`${guest.name} called to chair`);
  };

  const handleComplete = async (guestId: string) => {
    const guest = inChairGuests.find(g => g.id === guestId);
    if (!guest) return;

    const nextGuest = waitingGuests.find(g => g.staff === guest.staff || (guest.staffId && g.staffId === guest.staffId));
    
    completeAndCallNextMutation.mutate({
      currentId: guestId,
      nextId: nextGuest ? nextGuest.id : undefined,
    });

    toast.success(`${guest.name}\`s session completed`);
    if (nextGuest) {
      toast.info(`${nextGuest.name} was auto-called in`);
    } else {
      /* no-op */
    }
  };

  const handleAddDelay = (guestId: string) => {
    const guestInChair = inChairGuests.find(g => g.id === guestId);
    if (!guestInChair) return;

    // Apply +10m to all waiting guests for this staff
    const staffMatches = waitingGuests.filter(
      w => w.staff === guestInChair.staff || (guestInChair.staffId && w.staffId === guestInChair.staffId)
    );

    if (staffMatches.length === 0) {
      toast.info(`No customers waiting for ${guestInChair.staff}`);
      return;
    }

    const updates = staffMatches.map(w => ({
      id: w.id,
      delay_minutes: w.delayMinutes + 10,
    }));

    updateDelayMutation.mutate({ updates });
    toast.info(`+10 min delay applied to ${updates.length} customer(s)`);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const allGuests = [...waitingGuests, ...inChairGuests, ...completedGuests];
    const guest = allGuests.find(g => g.id === draggableId);
    if (!guest) return;

    if (source.droppableId !== destination.droppableId) {
      let newStatus: Booking["status"] = "pending";
      if (destination.droppableId === "inChair") newStatus = "in_progress";
      else if (destination.droppableId === "completed") newStatus = "completed";
      else newStatus = "pending";

      updateStatusMutation.mutate({ bookingId: guest.id, status: newStatus });

      if (destination.droppableId === 'inChair') {
        toast.success(`${guest.name} moved to chair`);
      } else if (destination.droppableId === 'completed') {
        toast.success(`Session with ${guest.name} completed`);
      } else {
        toast.info(`${guest.name} moved to waiting queue`);
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
              onClick={async () => {
                const newState = !isPaused;
                setIsPaused(newState);
                
                if (businessId) {
                  const supabase = createClient();
                  const { data: b } = await supabase.from('businesses').select('policies_data').eq('id', businessId).single();
                  const currentPolicies = b?.policies_data && typeof b.policies_data === 'object' ? b.policies_data : {};
                  await supabase.from('businesses').update({ policies_data: { ...currentPolicies, is_paused: newState } }).eq('id', businessId);
                }
                
                toast.success(newState ? "Queue paused temporarily" : "Queue is now open");
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
              className="bg-[#121415] text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95"
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
            <div className="flex-1 min-w-[300px] flex flex-col rounded-2xl border p-4 shadow-sm transition-colors duration-200 bg-[#F5F5F4]/80 border-[#DCDCDA]">
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
                    {isBookingsLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white border border-[#DCDCDA] rounded-xl p-3 flex flex-col justify-between min-h-[120px] mx-1 mb-2">
                          <Skeleton className="w-24 h-4 mb-2" />
                          <Skeleton className="w-16 h-3 mb-2" />
                          <Skeleton className="w-20 h-3 mb-2" />
                          <div className="mt-auto flex justify-between items-end">
                            <Skeleton className="w-24 h-3" />
                            <Skeleton className="w-16 h-6" />
                          </div>
                        </div>
                      ))
                    ) : filteredWaiting.map((guest, index) => (
                      <Draggable key={guest.id} draggableId={guest.id} index={index}>
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
                    {!isBookingsLoading && filteredWaiting.length === 0 && (
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
            <div className="flex-1 min-w-[300px] flex flex-col rounded-2xl border p-4 shadow-sm transition-colors duration-200 bg-[#e8efe9]/50 border-[#4a6b53]/20">
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
                      <Draggable key={guest.id} draggableId={guest.id} index={index}>
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
            <div className="flex-1 min-w-[300px] flex flex-col rounded-2xl border p-4 shadow-sm transition-colors duration-200 bg-[#ECECEA]/30 border-[#DCDCDA]/50 opacity-70 hover:opacity-100">
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
                      <Draggable key={guest.id} draggableId={guest.id} index={index}>
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
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
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
                  <div className={`relative ${isDropdownOpen ? 'z-[99999]' : ''}`}>
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
                        <div className="absolute z-[99999] w-full mt-2 bg-white border border-[#DCDCDA] rounded-xl shadow-lg py-1 animate-in fade-in slide-in-from-top-2 duration-200 max-h-48 overflow-y-auto">
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
                <button 
                  type="submit" 
                  disabled={isAddingGuest}
                  className="flex-1 py-3 bg-[#121415] hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-medium text-sm transition-opacity shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] flex items-center justify-center gap-2"
                >
                  {isAddingGuest && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save
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
