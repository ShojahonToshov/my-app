"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";;
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import VenueService from "../api/services/VenueService";
import { Scissors, Store, HeartPulse, MoreHorizontal } from "lucide-react";
import useAuthStore from "../stores/authStore";
import { queryKeys } from "../lib/queryKeys";

export const CATEGORIES = [
  { id: "barbershop", label: "Р вЂ Р В°РЎР‚Р В±Р ВµРЎР‚РЎв‚¬Р С•Р С—", icon: Scissors, defaultService: "Р СљРЎС“Р В¶РЎРѓР С”Р В°РЎРЏ РЎРѓРЎвЂљРЎР‚Р С‘Р В¶Р С”Р В°" },
  { id: "beauty", label: "Р РЋР В°Р В»Р С•Р Р… Р С”РЎР‚Р В°РЎРѓР С•РЎвЂљРЎвЂ№", icon: Store, defaultService: "Р СљР В°Р Р…Р С‘Р С”РЎР‹РЎР‚" },
  { id: "medical", label: "Р СљР ВµР Т‘Р С‘РЎвЂ Р С‘Р Р…Р В°", icon: HeartPulse, defaultService: "Р С™Р С•Р Р…РЎРѓРЎС“Р В»РЎРЉРЎвЂљР В°РЎвЂ Р С‘РЎРЏ" },
  { id: "other", label: "Р вЂќРЎР‚РЎС“Р С–Р С•Р Вµ", icon: MoreHorizontal, defaultService: "Р вЂ Р В°Р В·Р С•Р Р†Р В°РЎРЏ РЎС“РЎРѓР В»РЎС“Р С–Р В°" },
];

export default function useOnboarding() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const [step, setStep] = useState(1);
  
  const [venueName, setVenueName] = useState("");
  const [categoryId, setCategoryId] = useState("barbershop");
  
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDuration, setServiceDuration] = useState("45");

  const [masterName, setMasterName] = useState("");

  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    if (step === 1 && !venueName.trim()) return toast.error("Р вЂ™Р Р†Р ВµР Т‘Р С‘РЎвЂљР Вµ Р Р…Р В°Р В·Р Р†Р В°Р Р…Р С‘Р Вµ");
    if (step === 3 && !serviceName.trim()) return toast.error("Р Р€Р С”Р В°Р В¶Р С‘РЎвЂљР Вµ Р Р…Р В°Р В·Р Р†Р В°Р Р…Р С‘Р Вµ РЎС“РЎРѓР В»РЎС“Р С–Р С‘");
    
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
      toast.success("Р СџРЎР‚Р С•РЎРѓРЎвЂљРЎР‚Р В°Р Р…РЎРѓРЎвЂљР Р†Р С• РЎРѓР С•Р В·Р Т‘Р В°Р Р…Р С•!", {
        description: "Р вЂ Р С‘Р В·Р Р…Р ВµРЎРѓ Р С–Р С•РЎвЂљР С•Р Р† Р С” Р С—РЎР‚Р С‘Р ВµР С РЎС“ Р С”Р В»Р С‘Р ВµР Р…РЎвЂљР С•Р Р†.",
      });
      router.push("/portal");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Р С›РЎв‚¬Р С‘Р В±Р С”Р В° Р С—РЎР‚Р С‘ РЎРѓР С•Р В·Р Т‘Р В°Р Р…Р С‘Р С‘ Р С—РЎР‚Р С•РЎРѓРЎвЂљРЎР‚Р В°Р Р…РЎРѓРЎвЂљР Р†Р В°.");
    }
  });

  const handleFinish = (e: FormEvent) => {
    e.preventDefault();
    if (!masterName.trim()) return toast.error("Р Р€Р С”Р В°Р В¶Р С‘РЎвЂљР Вµ Р С‘Р С РЎРЏ Р С Р В°РЎРѓРЎвЂљР ВµРЎР‚Р В°");

    const newVenue = {
      id: Date.now().toString(),
      name: venueName,
      category: CATEGORIES.find(c => c.id === categoryId)?.label || "Р вЂќРЎР‚РЎС“Р С–Р С•Р Вµ",
      ownerId: currentUser?.id || "unknown",
      rating: 0,
      reviews: 0,
      address: "Р СњР Вµ РЎС“Р С”Р В°Р В·Р В°Р Р…",
      openNow: true,
      closesAt: "20:00",
      verified: false,
      tags: [],
      imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80",
      availableSeats: 0,
      services: [{
        id: "svc_1",
        name: serviceName,
        price: servicePrice ? `${servicePrice} РЎРѓРЎС“Р С ` : "0 РЎРѓРЎС“Р С ",
        duration: `${serviceDuration} Р С Р С‘Р Р…`,
        isActive: true
      }],
      masters: [{
        id: "mst_1",
        name: masterName,
        role: "Р СљР В°РЎРѓРЎвЂљР ВµРЎР‚",
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
