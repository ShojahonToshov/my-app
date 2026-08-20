"use client";
import { useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import BookingService from "@/services/customer/BookingService";
import { queryKeys } from "@/lib/queryKeys";
import { Booking } from '@/types';
import { createClient } from "@/utils/supabase/client";

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
    
    // Subscribe to realtime changes using Supabase
    const supabase = createClient();
    const channel = supabase
      .channel(`live-ticket-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `id=eq.${id}`
        },
        (payload) => {
          if (payload.new) {
            queryClient.setQueryData(queryKeys.bookings.detail(id), payload.new);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to realtime booking updates');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, queryClient]);

  useEffect(() => {
    if (bookingData) {
      if (prevStatusRef.current && prevStatusRef.current !== (bookingData as ExtendedBooking).status) {
        if ((bookingData as ExtendedBooking).status === "in_progress") {
          if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]);
          toast.success("It's your turn!", { description: "The specialist is ready for you.", duration: 8000 });
        } else if ((bookingData as ExtendedBooking).status === "completed") {
          toast.info("Visit completed...", { description: "We look forward to seeing you again!" });
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
      toast.success("Appointment cancelled");
      router.push("/account");
    },
    onError: () => {
      toast.error("Failed to cancel appointment");
    }
  });

  const handleCancelTicket = () => {
    cancelMutation.mutate(id || "");
  };

  const handleAction = (action: string) => {
    if (action === "route") toast.info("Route plotted...", { description: "Opening maps..." });
    if (action === "call") window.location.href = `tel:+998900000000`;
  };

  const isReady = (bookingData as ExtendedBooking)?.status === "in_progress";
  const isCompleted = (bookingData as ExtendedBooking)?.status === "completed";
  
  const simulatedDelayMins = (((bookingData as ExtendedBooking)?.status as string) === "upcoming" || ((bookingData as ExtendedBooking)?.status as string) === "pending") && id && parseInt(id.replace(/-/g, ''), 16) % 2 === 0 ? 15 : 0;
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
    if ((status as string) === "upcoming" || (status as string) === "pending") {
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
