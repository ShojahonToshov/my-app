"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BookingService from "@/services/BookingService";
import VenueService from "@/services/VenueService";
import { toast } from "sonner";
import useUser from "@/hooks/useUser";

import { queryKeys } from "@/lib/queryKeys";
import { Booking, Business } from '@/types';

interface ExtendedBooking extends Booking {
  userId?: string;
}

export default function useAccount() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: currentUser } = useUser();
  
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
      toast.success("Appointment successfully cancelled", { description: "Thank you for letting us know in advance." });
    },
    onError: () => {
      toast.error("Failed to cancel appointment");
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
    updateMutation.mutate({ id: String(bookingToReschedule.id), data: { date: "Tomorrow", time: "14:00" } }, {
      onSuccess: () => {
        toast.success("Appointment rescheduled", { description: "New time: Tomorrow at 14:00" });
        if (callback) callback();
      }
    });
  };

  const submitReview = (selectedBooking: Booking, rating: number, reviewText: string, callback?: () => void) => {
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }
    if (!selectedBooking.id) return;
    
    const reviewData = {
      isReviewed: true,
      rating: rating,
      reviewText: reviewText,
      reviewDate: new Date().toLocaleDateString('en-US')
    };

    updateMutation.mutate({ id: String(selectedBooking.id), data: reviewData }, {
      onSuccess: () => {
        toast.success("Thank you! Your review has been submitted.");
        if (callback) callback();
      },
      onError: () => {
        toast.error("An error occurred while submitting your review.");
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
