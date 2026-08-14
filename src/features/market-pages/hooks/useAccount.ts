"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BookingService from "../api/services/BookingService";
import VenueService from "../api/services/VenueService";
import { toast } from "sonner";
import useAuthStore from "../stores/authStore";
import { queryKeys } from "../lib/queryKeys";
import { Booking, Business } from '@superqueue/types';

interface ExtendedBooking extends Booking {
  userId?: string;
}

export default function useAccount() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState("upcoming");
  const clientKarma = 95;

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  const { data: bookings = [], isLoading: isBookingsLoading, isError: isBookingsError, refetch: refetchBookings } = useQuery({
    queryKey: queryKeys.bookings.byUser(currentUser?.id || ""),
    queryFn: async () => {
      const dataBookings = await BookingService.getBookings();
      if (!currentUser) return [];
      const userBookings = (dataBookings as Booking[]).filter((b) => String(b.userId) === String(currentUser.id));
      return userBookings.sort((a, b) => Number(b.id) - Number(a.id));
    },
    enabled: !!currentUser?.id,
  });

  const { data: favoriteVenues = [], isLoading: isFavoritesLoading, isError: isFavoritesError, refetch: refetchFavorites } = useQuery({
    queryKey: ['favorites', currentUser?.id],
    queryFn: async () => {
      if (typeof window === 'undefined') return [];
      if (!currentUser) return [];
      const savedFavs = localStorage.getItem(`favorites_${currentUser.id}`);
      if (!savedFavs) return [];
      const favIds = JSON.parse(savedFavs);
      const dataVenues = await VenueService.getVenues();
      return (dataVenues as Business[]).filter((v) => favIds.includes(v.id));
    },
    enabled: !!currentUser?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => BookingService.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.byUser(currentUser?.id || "") });
      toast.success("Р вЂ”Р В°Р С—Р С‘РЎРѓРЎРЉ РЎС“РЎРѓР С—Р ВµРЎв‚¬Р Р…Р С• Р С•РЎвЂљР С Р ВµР Р…Р ВµР Р…Р В°", { description: "Р РЋР С—Р В°РЎРѓР С‘Р В±Р С•, РЎвЂЎРЎвЂљР С• Р С—РЎР‚Р ВµР Т‘РЎС“Р С—РЎР‚Р ВµР Т‘Р С‘Р В»Р С‘ Р В·Р В°РЎР‚Р В°Р Р…Р ВµР Вµ." });
    },
    onError: () => {
      toast.error("Р С›РЎв‚¬Р С‘Р В±Р С”Р В° Р С—РЎР‚Р С‘ Р С•РЎвЂљР С Р ВµР Р…Р Вµ Р В·Р В°Р С—Р С‘РЎРѓР С‘");
    }
  });

  const confirmCancel = (bookingToCancel: Booking, callback?: () => void) => {
    if (!bookingToCancel.id) return;
    deleteMutation.mutate(String(bookingToCancel.id), {
      onSuccess: () => {
        if (callback) callback();
      }
    });
  };

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => BookingService.updateBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.byUser(currentUser?.id || "") });
    },
  });

  const handleReschedule = (bookingToReschedule: Booking, callback?: () => void) => {
    if (!bookingToReschedule.id) return;
    updateMutation.mutate({ id: String(bookingToReschedule.id), data: { date: "Р вЂ”Р В°Р Р†РЎвЂљРЎР‚Р В°", time: "14:00" } }, {
      onSuccess: () => {
        toast.success("Р вЂ”Р В°Р С—Р С‘РЎРѓРЎРЉ Р С—Р ВµРЎР‚Р ВµР Р…Р ВµРЎРѓР ВµР Р…Р В°", { description: "Р СњР С•Р Р†Р С•Р Вµ Р Р†РЎР‚Р ВµР С РЎРЏ: Р вЂ”Р В°Р Р†РЎвЂљРЎР‚Р В° Р Р† 14:00" });
        if (callback) callback();
      }
    });
  };

  const submitReview = (selectedBooking: Booking, rating: number, reviewText: string, callback?: () => void) => {
    if (rating === 0) {
      toast.error("Р СџР С•Р В¶Р В°Р В»РЎС“Р в„–РЎРѓРЎвЂљР В°, Р С—Р С•РЎРѓРЎвЂљР В°Р Р†РЎРЉРЎвЂљР Вµ Р С•РЎвЂ Р ВµР Р…Р С”РЎС“");
      return;
    }
    if (!selectedBooking.id) return;
    
    const reviewData = {
      isReviewed: true,
      rating: rating,
      reviewText: reviewText,
      reviewDate: new Date().toLocaleDateString('ru-RU')
    };

    updateMutation.mutate({ id: String(selectedBooking.id), data: reviewData }, {
      onSuccess: () => {
        toast.success("Р РЋР С—Р В°РЎРѓР С‘Р В±Р С•! Р вЂ™Р В°РЎв‚¬ Р С•РЎвЂљР В·РЎвЂ№Р Р† Р С•Р С—РЎС“Р В±Р В»Р С‘Р С”Р С•Р Р†Р В°Р Р….");
        if (callback) callback();
      },
      onError: () => {
        toast.error("Р СџРЎР‚Р С•Р С‘Р В·Р С•РЎв‚¬Р В»Р В° Р С•РЎв‚¬Р С‘Р В±Р С”Р В° Р С—РЎР‚Р С‘ Р С•РЎвЂљР С—РЎР‚Р В°Р Р†Р С”Р Вµ Р С•РЎвЂљР В·РЎвЂ№Р Р†Р В°.");
      }
    });
  };

  const upcomingBookings = (bookings as Booking[]).filter((b) => (b.status as string) === "upcoming" || b.status === "in_progress");
  const historyList = (bookings as Booking[]).filter((b) => b.status === "completed");

  const isLoading = isBookingsLoading || isFavoritesLoading;
  const isError = isBookingsError || isFavoritesError;

  const handleRefetch = () => {
    refetchBookings();
    refetchFavorites();
  };

  return {
    user: currentUser,
    isLoading,
    isError,
    handleRefetch,
    activeTab, setActiveTab,
    favoriteVenues,
    clientKarma,
    upcomingBookings,
    historyList,
    isReviewSubmitting: updateMutation.isPending,
    confirmCancel,
    handleReschedule,
    submitReview
  };
}
