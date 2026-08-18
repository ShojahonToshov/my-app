"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";;
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import VenueService from "../api/services/VenueService";
import { Scissors, Store, HeartPulse, MoreHorizontal } from "lucide-react";
import useUser from "@/hooks/useUser";

import { queryKeys } from "../lib/queryKeys";

export const CATEGORIES = [
  { id: "barbershop", label: "Barbershop", icon: Scissors, defaultService: "Men's Haircut" },
  { id: "beauty", label: "Beauty Salon", icon: Store, defaultService: "Manicure" },
  { id: "medical", label: "Medical & Spa", icon: HeartPulse, defaultService: "Consultation" },
  { id: "other", label: "Other", icon: MoreHorizontal, defaultService: "Standard Service" },
];

export default function useOnboarding() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: currentUser } = useUser();
  const [step, setStep] = useState(1);
  
  const [venueName, setVenueName] = useState("");
  const [categoryId, setCategoryId] = useState("barbershop");
  
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDuration, setServiceDuration] = useState("45");

  const [masterName, setMasterName] = useState("");

  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    if (step === 1 && !venueName.trim()) return toast.error("Please enter a venue name");
    if (step === 3 && !serviceName.trim()) return toast.error("Please specify a service name");
    
    if (step === 2) {
      const defaultSvc = CATEGORIES.find(c => c.id === categoryId)?.defaultService;
      if (!serviceName) setServiceName(defaultSvc || "");
    }

    setStep((prev: number) => prev + 1);
  };

  const createVenueMutation = useMutation({
    mutationFn: (newVenue: Record<string, unknown>) => VenueService.createVenue(newVenue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.venues.all });
      toast.success("Workspace created!", {
        description: "Your business profile is ready to receive appointments.",
      });
      router.push("/admin");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error creating workspace.");
    }
  });

  const handleFinish = (e: FormEvent) => {
    e.preventDefault();
    if (!masterName.trim()) return toast.error("Please provide master name");

    const newVenue = {
      id: Date.now().toString(),
      name: venueName,
      category: CATEGORIES.find(c => c.id === categoryId)?.label || "Other",
      ownerId: currentUser?.id || "unknown",
      rating: 0,
      reviews: 0,
      address: "Not specified",
      openNow: true,
      closesAt: "20:00",
      verified: false,
      tags: [],
      imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80",
      availableSeats: 0,
      services: [{
        id: "svc_1",
        name: serviceName,
        price: servicePrice ? `${servicePrice} UZS` : "0 UZS",
        duration: `${serviceDuration} min`,
        isActive: true
      }],
      masters: [{
        id: "mst_1",
        name: masterName,
        role: "Master",
        initials: masterName.substring(0, 2).toUpperCase(),
        isActive: true
      }]
    };

    createVenueMutation.mutate(newVenue);
  };

  return {
    step, setStep,
    isLoading: createVenueMutation.isPending,
    venueName, setVenueName,
    categoryId, setCategoryId,
    serviceName, setServiceName,
    servicePrice, setServicePrice,
    serviceDuration, setServiceDuration,
    masterName, setMasterName,
    handleNext, handleFinish
  };
}
