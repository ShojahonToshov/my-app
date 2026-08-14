"use client";
import { useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import BookingService from "../api/services/BookingService";
import { queryKeys } from "../lib/queryKeys";
import { Booking } from '@superqueue/types';

interface ExtendedBooking extends Booking {
  time?: string;
}

const calculateETA = (timeStr: string | undefined, delayMinutes: number) => {
  if (!timeStr) return "--:--";
  const [h, m] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m + delayMinutes);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

export default function useLiveTicket() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const queryClient = useQueryClient();
  const prevStatusRef = useRef<string | null>(null);

  useEffect(() => {
    if (!id) { router.push("/account"); }
  }, [id, router]);

  const { data: bookingData, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.bookings.detail(id || ""),
    queryFn: () => BookingService.getBookingById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (!id) return;
    const eventSource = new EventSource(`http://localhost:3001/api/liveticket/stream?id=${id}`);
    
    eventSource.onmessage = (event) => {
      try {
        const newBooking = JSON.parse(event.data);
        if (newBooking && !newBooking.error) {
          queryClient.setQueryData(queryKeys.bookings.detail(id || ""), newBooking);
        }
      } catch (err) {
        console.error("Failed to parse SSE data", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [id, queryClient]);

  useEffect(() => {
    if (bookingData) {
      if (prevStatusRef.current && prevStatusRef.current !== (bookingData as ExtendedBooking).status) {
        if ((bookingData as ExtendedBooking).status === "in_progress") {
          if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]);
          toast.success("Ваша очередь подошла!", { description: "Мастер ждет вас.", duration: 8000 });
        } else if ((bookingData as ExtendedBooking).status === "completed") {
          toast.info("Визит завершен...", { description: "Ждем вас снова!" });
          setTimeout(() => router.push("/account"), 3000);
        }
      }
      prevStatusRef.current = (bookingData as ExtendedBooking).status as string;
    }
  }, [bookingData, router]);

  const cancelMutation = useMutation({
    mutationFn: (ticketId: string) => BookingService.deleteBooking(ticketId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.bookings.detail(id || "") });
      toast.success("Запись отменена");
      router.push("/account");
    },
    onError: () => {
      toast.error("Ошибка при отмене");
    }
  });

  const handleCancelTicket = () => {
    cancelMutation.mutate(id || "");
  };

  const handleAction = (action: string) => {
    if (action === "route") toast.info("Маршрут построен...", { description: "Открываем карты..." });
    if (action === "call") window.location.href = `tel:+998900000000`;
  };

  const isReady = (bookingData as ExtendedBooking)?.status === "in_progress";
  const isCompleted = (bookingData as ExtendedBooking)?.status === "completed";
  
  const simulatedDelayMins = ((bookingData as ExtendedBooking)?.status as string) === "upcoming" && id && parseInt(id) % 2 === 0 ? 15 : 0;
  const isDelayed = simulatedDelayMins > 0;
  
  const expectedTime = calculateETA((bookingData as ExtendedBooking)?.time as string | undefined, simulatedDelayMins);

  const getStepStatus = (stepName: string) => {
    const status = (bookingData as ExtendedBooking)?.status;
    if (status === "completed") return "done";
    if (status === "in_progress") {
       if (stepName === "booked") return "done";
       if (stepName === "waiting") return "done";
       if (stepName === "in_chair") return "active";
    }
    if ((status as string) === "upcoming") {
       if (stepName === "booked") return "done";
       if (stepName === "waiting") return "active";
       if (stepName === "in_chair") return "wait";
    }
    return "wait";
  };

  return {
    router,
    bookingData,
    isLoading,
    isError,
    handleRefetch: refetch,
    isReady,
    isCompleted,
    isDelayed,
    expectedTime,
    simulatedDelayMins,
    getStepStatus,
    handleCancelTicket,
    handleAction
  };
}
