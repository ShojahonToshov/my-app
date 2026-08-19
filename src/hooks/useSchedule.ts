import { useState, useEffect, useCallback, useMemo, FormEvent, MouseEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import BookingService from "@/services/client/BookingService";
import { START_HOUR, PIXELS_PER_MINUTE } from "@/constants/schedule";
import { queryKeys } from "@/lib/queryKeys";
import { ApiBookingDTO } from "@/types";

const DYNAMIC_MASTERS = [
  { id: "1", name: "Ali Ahmedov", initials: "AA" },
  { id: "2", name: "Sanjar B.", initials: "SB" },
  { id: "3", name: "Marat V.", initials: "MV" },
  { id: "4", name: "Denis K.", initials: "DK" },
  { id: "5", name: "Timur G.", initials: "TG" },
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
          client: item.clientName || "Guest",
          service: item.serviceName || "Service",
          startTime: item.time || "10:00",
          duration: 45, 
          price: item.servicePrice || "80,000 UZS",
          status: item.status === "upcoming" ? "Waiting" : "In Chair",
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
      toast.success("Appointment successfully scheduled");
    },
    onError: () => {
      toast.error("Error saving appointment");
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
      serviceName: "Men's Haircut",
      servicePrice: "80,000 UZS",
      masterName: selectedMasterObj?.name || "Master",
      date: selectedDate,
      time: (formData.get("time") as string) || "12:00",
      clientName: (formData.get("clientName") as string) || "New Client",
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
      toast.success("Appointment cancelled");
    },
    onError: () => {
      toast.error("Error cancelling appointment");
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
