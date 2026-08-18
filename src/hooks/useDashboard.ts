import { useState, useMemo, useCallback, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BookingService from "@/services/BookingService";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import { ApiBookingDTO, TicketDTO } from "@/types";

export default function useDashboard() {
  const queryClient = useQueryClient();
  const [activeMasterFilter, setActiveMasterFilter] = useState("All");
  const [masterDelays, setMasterDelays] = useState<Record<string, number>>({});

  const { data: tickets = [], isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.bookings.all,
    queryFn: async () => {
      const res = await BookingService.getBookings();
      if (!res || res.length === 0) return [];
      
      const mapped = res.map((item: ApiBookingDTO, index: number): TicketDTO => ({
        id: item.id,
        time: item.time || "10:00",
        service: item.serviceName || "Service",
        name: item.clientName || "Guest",
        status: item.status === "upcoming" ? "waiting" : item.status === "in_progress" ? "in_progress" : "completed",
        master: item.masterName || `Master ${index % 5 + 1}`,
        isDelayed: item.status === "upcoming" && index % 3 === 0 
      }));
      
      return mapped.sort((a: TicketDTO, b: TicketDTO) => a.time.localeCompare(b.time));
    }
  });

  const uniqueMasters = useMemo(() => {
    const masters = new Set(tickets.map((t: TicketDTO) => t.master));
    return Array.from(masters);
  }, [tickets]);

  const kpis = useMemo(() => {
    const total = tickets.length;
    const waiting = tickets.filter((t: TicketDTO) => t.status === "waiting").length;
    const inProgress = tickets.filter((t: TicketDTO) => t.status === "in_progress").length;
    
    const totalDelayMins = Object.values(masterDelays).reduce((a: number, b: number) => a + b, 0);
    
    const services = tickets.map((t: TicketDTO) => t.service);
    const topService = services.sort((a: string, b: string) =>
          services.filter((v: string) => v===a).length - services.filter((v: string) => v===b).length
    ).pop() || "No data";

    return { total, inSalon: waiting + inProgress, totalDelayMins, topService };
  }, [tickets, masterDelays]);

  // Mutations
  const callClientMutation = useMutation({
    mutationFn: (ticketId: string) => BookingService.updateBookingStatus(ticketId, "in_progress"),
    onMutate: async (ticketId: string) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.bookings.all });
      const previousTickets = queryClient.getQueryData<TicketDTO[]>(queryKeys.bookings.all);
      
      queryClient.setQueryData<TicketDTO[]>(queryKeys.bookings.all, (old) => 
        old ? old.map((t: TicketDTO) => t.id === ticketId ? { ...t, status: "in_progress" } : t) : []
      );
      
      return { previousTickets };
    },
    onSuccess: () => {
      toast.success("Client invited", { description: "Push notification sent to client." });
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(queryKeys.bookings.all, context?.previousTickets);
      toast.error("Sync error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    }
  });

  const handleCallClient = useCallback((ticketId: string) => {
    callClientMutation.mutate(ticketId);
  }, [callClientMutation]);

  const completeMutation = useMutation({
    mutationFn: async ({ currentTicketId, master }: { currentTicketId: string; master: string }) => {
      await BookingService.updateBookingStatus(currentTicketId, "completed");
      const data = await BookingService.getBookings();
      const nextMapped = data.find((t: ApiBookingDTO) => t.masterName === master && t.status === "upcoming" && t.id !== currentTicketId);
      
      if (nextMapped) {
        await BookingService.updateBookingStatus(nextMapped.id, "in_progress");
        return { nextMapped };
      }
      return { nextMapped: null };
    },
    onMutate: async ({ currentTicketId, master }: { currentTicketId: string; master: string }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.bookings.all });
      const previousTickets = queryClient.getQueryData<TicketDTO[]>(queryKeys.bookings.all);
      
      queryClient.setQueryData<TicketDTO[]>(queryKeys.bookings.all, (old) => {
        if (!old) return [];
        const nextTicket = old.find((t: TicketDTO) => t.status === "waiting" && t.master === master);
        return old.map((t: TicketDTO) => {
          if (t.id === currentTicketId) return { ...t, status: "completed" };
          if (nextTicket && t.id === nextTicket.id) return { ...t, status: "in_progress" };
          return t;
        });
      });
      return { previousTickets };
    },
    onSuccess: (data, variables) => {
      if (data.nextMapped) {
        toast.success("Visit completed", { description: `${data.nextMapped.clientName || "Guest"} was automatically called to the chair.` });
      } else {
        toast.success("Visit completed", { description: `Queue for ${variables.master} is now clear.` });
      }
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(queryKeys.bookings.all, context?.previousTickets);
      toast.error("Error updating booking status");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    }
  });

  const handleCompleteAndNext = useCallback((currentTicketId: string, master: string) => {
    completeMutation.mutate({ currentTicketId, master });
  }, [completeMutation]);

  const handleAddDelay = useCallback((master: string, mins: number) => {
    setMasterDelays((prev: Record<string, number>) => ({
      ...prev,
      [master]: Math.max(0, (prev[master] || 0) + mins)
    }));
    if (mins > 0) {
      toast.warning(`Schedule shifted by +${mins} min`, { description: `Clients of ${master} have been notified.` });
    } else {
      toast.success(`Schedule caught up`, { description: `Delay for ${master} was reduced.` });
    }
  }, []);

  const addTicketMutation = useMutation({
    mutationFn: (newBooking: ApiBookingDTO) => BookingService.createBooking(newBooking as unknown as Parameters<typeof BookingService.createBooking>[0]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      toast.success("Appointment created", { description: "New guest successfully added to schedule." });
    },
    onError: () => {
      toast.error("Error creating appointment");
    }
  });

  const handleAddTicket = (e: FormEvent<HTMLFormElement>, selectedService: string, callback?: () => void) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const clientName = (formData.get("clientName") as string) || "Guest";
    const selectedMaster = (formData.get("masterName") as string) || uniqueMasters[0] || "Master";
    
    const newBooking = {
      id: Date.now().toString(),
      userId: "admin-manual",
      venueId: "1",
      venueName: "Business Profile",
      serviceName: selectedService,
      servicePrice: selectedService === "Haircut + Beard" ? "120,000 UZS" : "80,000 UZS",
      masterName: selectedMaster,
      date: new Date().toLocaleDateString('en-US'),
      time: new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}),
      clientName: clientName,
      clientPhone: "+998 90 000 00 00",
      status: "upcoming"
    };

    addTicketMutation.mutate(newBooking, {
      onSuccess: () => {
        if (callback) callback();
      }
    });
  };

  const filteredTickets = useMemo(() => tickets.filter(
    (tkt) => activeMasterFilter === "All" || tkt.master === activeMasterFilter
  ), [tickets, activeMasterFilter]);

  const isSubmitting = callClientMutation.isPending || completeMutation.isPending || addTicketMutation.isPending;

  return {
    isSubmitting, isLoading, isError, handleRefetch: refetch,
    tickets, filteredTickets,
    activeMasterFilter, setActiveMasterFilter,
    masterDelays, uniqueMasters, kpis,
    handleCallClient, handleCompleteAndNext, handleAddDelay, handleAddTicket
  };
}
