import { useState, useMemo, useCallback, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BookingService from "../api/services/BookingService";
import { toast } from "sonner";
import { queryKeys } from "../lib/queryKeys";
import { ApiBookingDTO, TicketDTO } from "../types";

export default function useDashboard() {
  const queryClient = useQueryClient();
  const [activeMasterFilter, setActiveMasterFilter] = useState("Р вЂ™РЎРѓР Вµ");
  const [masterDelays, setMasterDelays] = useState<Record<string, number>>({});

  const { data: tickets = [], isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.bookings.all,
    queryFn: async () => {
      const res = await BookingService.getBookings();
      if (!res || res.length === 0) return [];
      
      const mapped = res.map((item: ApiBookingDTO, index: number): TicketDTO => ({
        id: item.id,
        time: item.time || "10:00",
        service: item.serviceName || "Р Р€РЎРѓР В»РЎС“Р С–Р В°",
        name: item.clientName || "Р вЂњР С•РЎРѓРЎвЂљРЎРЉ",
        status: item.status === "upcoming" ? "waiting" : item.status === "in_progress" ? "in_progress" : "completed",
        master: item.masterName || `Р СљР В°РЎРѓРЎвЂљР ВµРЎР‚ ${index % 5 + 1}`,
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
    ).pop() || "Р СњР ВµРЎвЂљ Р Т‘Р В°Р Р…Р Р…РЎвЂ№РЎвЂ¦";

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
      toast.success("Р С™Р В»Р С‘Р ВµР Р…РЎвЂљ Р С—РЎР‚Р С‘Р С–Р В»Р В°РЎв‚¬Р ВµР Р…", { description: "Push-РЎС“Р Р†Р ВµР Т‘Р С•Р С Р В»Р ВµР Р…Р С‘Р Вµ Р С•РЎвЂљР С—РЎР‚Р В°Р Р†Р В»Р ВµР Р…Р С• Р С”Р В»Р С‘Р ВµР Р…РЎвЂљРЎС“." });
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(queryKeys.bookings.all, context?.previousTickets);
      toast.error("Р С›РЎв‚¬Р С‘Р В±Р С”Р В° РЎРѓР С‘Р Р…РЎвЂ¦РЎР‚Р С•Р Р…Р С‘Р В·Р В°РЎвЂ Р С‘Р С‘");
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
        toast.success("Р вЂ™Р С‘Р В·Р С‘РЎвЂљ Р В·Р В°Р Р†Р ВµРЎР‚РЎв‚¬Р ВµР Р…", { description: `${data.nextMapped.clientName || "Р вЂњР С•РЎРѓРЎвЂљРЎРЉ"} Р В°Р Р†РЎвЂљР С•Р С Р В°РЎвЂљР С‘РЎвЂЎР ВµРЎРѓР С”Р С‘ Р С—РЎР‚Р С‘Р С–Р В»Р В°РЎв‚¬Р ВµР Р…(Р В°) Р Р† Р С”РЎР‚Р ВµРЎРѓР В»Р С•.` });
      } else {
        toast.success("Р вЂ™Р С‘Р В·Р С‘РЎвЂљ Р В·Р В°Р Р†Р ВµРЎР‚РЎв‚¬Р ВµР Р…", { description: `Р С›РЎвЂЎР ВµРЎР‚Р ВµР Т‘РЎРЉ Р С” Р С Р В°РЎРѓРЎвЂљР ВµРЎР‚РЎС“ ${variables.master} Р С—РЎС“РЎРѓРЎвЂљР В°.` });
      }
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(queryKeys.bookings.all, context?.previousTickets);
      toast.error("Р С›РЎв‚¬Р С‘Р В±Р С”Р В° Р С•Р В±Р Р…Р С•Р Р†Р В»Р ВµР Р…Р С‘РЎРЏ РЎРѓРЎвЂљР В°РЎвЂљРЎС“РЎРѓР С•Р Р†");
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
      toast.warning(`Р вЂњРЎР‚Р В°РЎвЂћР С‘Р С” РЎРѓР Т‘Р Р†Р С‘Р Р…РЎС“РЎвЂљ Р Р…Р В° +${mins} Р С Р С‘Р Р…`, { description: `Р С™Р В»Р С‘Р ВµР Р…РЎвЂљРЎвЂ№ Р С Р В°РЎРѓРЎвЂљР ВµРЎР‚Р В° ${master} РЎС“Р Р†Р ВµР Т‘Р С•Р С Р В»Р ВµР Р…РЎвЂ№.` });
    } else {
      toast.success(`Р СњР В°Р С–Р С•Р Р…РЎРЏР ВµР С  Р С–РЎР‚Р В°РЎвЂћР С‘Р С”`, { description: `Р вЂ”Р В°Р Т‘Р ВµРЎР‚Р В¶Р С”Р В° Р С Р В°РЎРѓРЎвЂљР ВµРЎР‚Р В° ${master} РЎС“Р С Р ВµР Р…РЎРЉРЎв‚¬Р ВµР Р…Р В°.` });
    }
  }, []);

  const addTicketMutation = useMutation({
    mutationFn: (newBooking: ApiBookingDTO) => BookingService.createBooking(newBooking as unknown as Parameters<typeof BookingService.createBooking>[0]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      toast.success("Р вЂ”Р В°Р С—Р С‘РЎРѓРЎРЉ РЎРѓР С•Р В·Р Т‘Р В°Р Р…Р В°", { description: "Р СњР С•Р Р†РЎвЂ№Р в„– Р С–Р С•РЎРѓРЎвЂљРЎРЉ РЎС“РЎРѓР С—Р ВµРЎв‚¬Р Р…Р С• Р Т‘Р С•Р В±Р В°Р Р†Р В»Р ВµР Р…." });
    },
    onError: () => {
      toast.error("Р С›РЎв‚¬Р С‘Р В±Р С”Р В° Р С—РЎР‚Р С‘ Р Т‘Р С•Р В±Р В°Р Р†Р В»Р ВµР Р…Р С‘Р С‘");
    }
  });

  const handleAddTicket = (e: FormEvent<HTMLFormElement>, selectedService: string, callback?: () => void) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const clientName = (formData.get("clientName") as string) || "Р вЂ Р ВµР В· Р С‘Р С Р ВµР Р…Р С‘";
    const selectedMaster = (formData.get("masterName") as string) || uniqueMasters[0] || "Р СљР В°РЎРѓРЎвЂљР ВµРЎР‚";
    
    const newBooking = {
      id: Date.now().toString(),
      userId: "admin-manual",
      venueId: "1",
      venueName: "Р вЂ Р С‘Р В·Р Р…Р ВµРЎРѓ Р СџРЎР‚Р С•РЎвЂћР С‘Р В»РЎРЉ",
      serviceName: selectedService,
      servicePrice: selectedService === "Р РЋРЎвЂљРЎР‚Р С‘Р В¶Р С”Р В° + Р вЂ Р С•РЎР‚Р С•Р Т‘Р В°" ? "120 000 РЎРѓРЎС“Р С " : "80 000 РЎРѓРЎС“Р С ",
      masterName: selectedMaster,
      date: new Date().toLocaleDateString('ru-RU'),
      time: new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'}),
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
    (tkt) => activeMasterFilter === "Р вЂ™РЎРѓР Вµ" || tkt.master === activeMasterFilter
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
