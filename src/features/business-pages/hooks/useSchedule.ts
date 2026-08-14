import { useState, useEffect, useCallback, useMemo, FormEvent, MouseEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import BookingService from "../api/services/BookingService";
import { START_HOUR, PIXELS_PER_MINUTE } from "../constants/schedule";
import { queryKeys } from "../lib/queryKeys";
import { ApiBookingDTO } from "../types";

const DYNAMIC_MASTERS = [
  { id: "1", name: "Р С’Р В»Р С‘ Р С’РЎвЂ¦Р С Р ВµР Т‘Р С•Р Р†", initials: "Р С’Р С’" },
  { id: "2", name: "Р РЋР В°Р Р…Р В¶Р В°РЎР‚ Р В .", initials: "Р РЋР В " },
  { id: "3", name: "Р СљР В°РЎР‚Р В°РЎвЂљ Р вЂ™.", initials: "Р СљР вЂ™" },
  { id: "4", name: "Р вЂќР ВµР Р…Р С‘РЎРѓ Р С™.", initials: "Р вЂќР С™" },
  { id: "5", name: "Р СћР С‘Р С РЎС“РЎР‚ Р вЂ .", initials: "Р СћР вЂ " },
];

export default function useSchedule() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState("24.07");
  const [prefilledTime, setPrefilledTime] = useState("12:00");
  const [prefilledMaster, setPrefilledMaster] = useState(DYNAMIC_MASTERS[0].id);
  const [currentMinutes, setCurrentMinutes] = useState(12 * 60 + 15);

  const masters = DYNAMIC_MASTERS;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentMinutes(now.getHours() * 60 + now.getMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const { data: bookings = [], isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.bookings.all,
    queryFn: async () => {
      const data = await BookingService.getBookings();
      if (data && data.length > 0) {
        return data.map((item: ApiBookingDTO, index: number) => ({
          id: item.id,
          masterId: masters[index % masters.length].id,
          client: item.clientName || "Р вЂњР С•РЎРѓРЎвЂљРЎРЉ",
          service: item.serviceName || "Р Р€РЎРѓР В»РЎС“Р С–Р В°",
          startTime: item.time || "10:00",
          duration: 45, 
          price: item.servicePrice || "80 000 РЎРѓРЎС“Р С ",
          status: item.status === "upcoming" ? "Р С›Р В¶Р С‘Р Т‘Р В°Р ВµРЎвЂљ" : "Р вЂ™ Р С”РЎР‚Р ВµРЎРѓР В»Р Вµ",
          date: item.date || "24.07"
        }));
      }
      return [];
    }
  });

  const addBookingMutation = useMutation({
    mutationFn: (newBooking: ApiBookingDTO) => BookingService.createBooking(newBooking as unknown as Parameters<typeof BookingService.createBooking>[0]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      toast.success("Р вЂ”Р В°Р С—Р С‘РЎРѓРЎРЉ РЎС“РЎРѓР С—Р ВµРЎв‚¬Р Р…Р С• Р Т‘Р С•Р В±Р В°Р Р†Р В»Р ВµР Р…Р В°");
    },
    onError: () => {
      toast.error("Р С›РЎв‚¬Р С‘Р В±Р С”Р В° РЎРѓР С•РЎвЂ¦РЎР‚Р В°Р Р…Р ВµР Р…Р С‘РЎРЏ");
    }
  });

  const handleAddBooking = useCallback((e: FormEvent<HTMLFormElement>, callback?: () => void) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selectedMasterObj = masters.find((m: { id: string; name: string }) => m.id === prefilledMaster);
    
    const newBooking: ApiBookingDTO = {
      id: Date.now().toString(),
      userId: "admin-manual",
      venueId: "1",
      venueName: "SuperQueue Business",
      serviceName: "Р СљРЎС“Р В¶РЎРѓР С”Р В°РЎРЏ РЎРѓРЎвЂљРЎР‚Р С‘Р В¶Р С”Р В°",
      servicePrice: "80 000 РЎРѓРЎС“Р С ",
      masterName: selectedMasterObj?.name || "Р СљР В°РЎРѓРЎвЂљР ВµРЎР‚",
      date: selectedDate,
      time: (formData.get("time") as string) || "12:00",
      clientName: (formData.get("clientName") as string) || "Р СњР С•Р Р†РЎвЂ№Р в„– Р С™Р В»Р С‘Р ВµР Р…РЎвЂљ",
      status: "upcoming"
    };
    
    addBookingMutation.mutate(newBooking, {
      onSuccess: () => {
        if (callback) callback();
      }
    });
  }, [masters, prefilledMaster, selectedDate, addBookingMutation]);

  const deleteBookingMutation = useMutation({
    mutationFn: (id: string) => BookingService.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      toast.success("Р вЂ”Р В°Р С—Р С‘РЎРѓРЎРЉ Р С•РЎвЂљР С Р ВµР Р…Р ВµР Р…Р В°");
    },
    onError: () => {
      toast.error("Р С›РЎв‚¬Р С‘Р В±Р С”Р В° Р С—РЎР‚Р С‘ РЎС“Р Т‘Р В°Р В»Р ВµР Р…Р С‘Р С‘");
    }
  });

  const handleDeleteBooking = useCallback((bookingToDelete: { id: string }, callback?: () => void) => {
    if (!bookingToDelete) return;
    deleteBookingMutation.mutate(bookingToDelete.id, {
      onSuccess: () => {
        if (callback) callback();
      }
    });
  }, [deleteBookingMutation]);

  const handleGridClick = useCallback((e: MouseEvent<HTMLDivElement>, masterId: string, openModalCallback?: () => void) => {
    if ((e.target as HTMLElement).closest('.appointment-card')) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const minutesFromStart = Math.floor(y / PIXELS_PER_MINUTE);
    const totalMinutes = START_HOUR * 60 + minutesFromStart;
    
    const roundedMins = Math.round(totalMinutes / 30) * 30;
    const h = Math.floor(roundedMins / 60).toString().padStart(2, '0');
    const m = (roundedMins % 60).toString().padStart(2, '0');
    
    setPrefilledTime(`${h}:${m}`);
    setPrefilledMaster(masterId);
    if (openModalCallback) openModalCallback();
  }, []);

  const dailyBookings = useMemo(() => bookings.filter(a => a.date === selectedDate), [bookings, selectedDate]);
  const currentTimeTop = (currentMinutes - START_HOUR * 60) * PIXELS_PER_MINUTE;
  const showTimeLine = currentTimeTop > 0 && currentTimeTop < 11 * 120;

  const isSubmitting = addBookingMutation.isPending || deleteBookingMutation.isPending;

  return {
    selectedDate, setSelectedDate,
    isSubmitting, isLoading, isError, handleRefetch: refetch,
    bookings, masters,
    prefilledTime, setPrefilledTime,
    prefilledMaster, setPrefilledMaster,
    dailyBookings, showTimeLine, currentTimeTop,
    handleAddBooking, handleDeleteBooking, handleGridClick
  };
}
