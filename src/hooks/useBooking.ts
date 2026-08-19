"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import VenueService from "@/services/client/VenueService";
import BookingService from "@/services/client/BookingService";
import { DATES } from "@/constants/booking";
import useUser from "@/hooks/useUser";

import { queryKeys } from "@/lib/queryKeys";
import { Booking, Business, Service } from '@/types';

interface ExtendedBooking extends Omit<Booking, "status"> {
  venueId?: string;
  isReviewed?: boolean;
  rating?: number;
  userId?: string;
  venueName?: string;
  serviceName?: string;
  servicePrice?: number | string;
  masterName?: string;
  date?: string;
  time?: string;
  clientName?: string;
  clientPhone?: string;
  status?: string;
}

interface ExtendedBusiness extends Business {
  rating?: number;
  services?: Service[];
  masters?: { id: string; name: string }[];
}

export default function useBooking() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const queryClient = useQueryClient();
  const { user: currentUser } = useUser();
  
  useEffect(() => {
    if (!id) {
      toast.error("Salon not selected", { description: "Please select a venue to continue." });
      router.push("/search");
    }
  }, [id, router]);

  const venueId = id; 
  const [activeTab, setActiveTab] = useState("booking");

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedMaster, setSelectedMaster] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(DATES[0].id);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState(currentUser?.name || "");
  const [clientPhone, setClientPhone] = useState<string>(() => {
    if (currentUser?.login && /^\+?\d+$/.test(String(currentUser.login))) {
      return String(currentUser.login);
    }
    return "";
  });
  const [policyAccepted, setPolicyAccepted] = useState(false); 
  
  const userKarma = 95;

  const { data: venueData, isLoading: isVenueLoading, isError: isVenueError, refetch: refetchVenue } = useQuery({
    queryKey: queryKeys.venues.detail(venueId!),
    queryFn: () => VenueService.getVenueById(venueId!),
    enabled: !!venueId,
  });

  const { data: realReviews = [], isLoading: isReviewsLoading, isError: isReviewsError, refetch: refetchReviews } = useQuery({
    queryKey: queryKeys.bookings.byVenue(venueId!),
    queryFn: async () => {
      const reviewsData = await BookingService.getBookings();
      return (reviewsData as ExtendedBooking[]).filter((b) => String(b.venueId) === String(venueId) && b.isReviewed);
    },
    enabled: !!venueId,
  });

  const createBookingMutation = useMutation({
    mutationFn: (newBooking: ExtendedBooking) => BookingService.createBooking(newBooking as unknown as Booking),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.byVenue(venueId!) });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.byUser(currentUser?.id || "") });
      toast.success("Appointment booked successfully!", { description: "Track your queue and specialist status on visit day." });
      router.push(`/ticket/${variables.id}`);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error creating appointment");
    }
  });

  const averageRating = realReviews.length > 0 
    ? (realReviews.reduce((acc, curr) => acc + ((curr as ExtendedBooking).rating || 0), 0) / realReviews.length).toFixed(1)
    : (venueData as ExtendedBusiness)?.rating;

  const scrollToStep = (stepId: string) => {
    setTimeout(() => {
      document.getElementById(stepId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

  const handleServiceSelect = (id: string) => {
    setSelectedService(id);
    if (!selectedMaster) scrollToStep("step-2");
  };

  const handleMasterSelect = (id: string) => {
    setSelectedMaster(id);
    if (!selectedTime) scrollToStep("step-3");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    scrollToStep("step-4");
  };

  const handleBooking = () => {
    if (!selectedService || !selectedMaster || !selectedDate || !selectedTime || !clientName || !clientPhone || !policyAccepted) return;
    
    const serviceObj = (venueData as ExtendedBusiness)?.services 
      ? (venueData as ExtendedBusiness).services?.find((s) => String(s.id) === String(selectedService))
      : null;
    const masterObj = (venueData as ExtendedBusiness)?.masters 
      ? (venueData as ExtendedBusiness).masters?.find((m) => String(m.id) === String(selectedMaster))
      : null;
    const newId = Date.now().toString();

    const newBooking = {
      id: newId,
      userId: currentUser?.id || "guest",
      venueId: String((venueData as ExtendedBusiness)?.id || venueId),
      venueName: (venueData as ExtendedBusiness)?.name,
      serviceName: serviceObj?.name || "Service",
      servicePrice: serviceObj?.price || "0 UZS",
      masterName: masterObj?.name || "Any available specialist",
      date: selectedDate,
      time: selectedTime,
      startTime: selectedTime,
      clientName: clientName,
      clientPhone: String(clientPhone),
      status: "upcoming"
    } as ExtendedBooking;

    createBookingMutation.mutate(newBooking);
  };

  let progressPercent = 0;
  if (selectedService) progressPercent += 20;
  if (selectedMaster) progressPercent += 20;
  if (selectedDate && selectedTime) progressPercent += 20;
  if (clientName.length > 2 && clientPhone.length >= 7) progressPercent += 20;
  if (policyAccepted) progressPercent += 20;
  const isFormValid = progressPercent === 100;

  const isLoading = isVenueLoading || isReviewsLoading;
  const isError = isVenueError || isReviewsError;
  const handleRefetch = () => {
    refetchVenue();
    refetchReviews();
  };

  return {
    router,
    venueData,
    isLoading,
    isError,
    handleRefetch,
    isSubmitting: createBookingMutation.isPending,
    activeTab, setActiveTab,
    selectedService, setSelectedService,
    selectedMaster, setSelectedMaster,
    selectedDate, setSelectedDate,
    selectedTime, setSelectedTime,
    clientName, setClientName,
    clientPhone, setClientPhone,
    policyAccepted, setPolicyAccepted,
    userKarma,
    averageRating,
    progressPercent,
    isFormValid,
    handleServiceSelect,
    handleMasterSelect,
    handleTimeSelect,
    handleBooking
  };
}
