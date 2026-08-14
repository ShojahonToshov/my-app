import { useState, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import VenueService from "../api/services/VenueService";
import { queryKeys } from "../lib/queryKeys";

export default function useSettings() {
  const queryClient = useQueryClient();
  const [venueId, setVenueId] = useState<string | null>(null);

  const [venueProfile, setVenueProfile] = useState<Record<string, string>>({ name: '', phone: '', address: '' });
  const [services, setServices] = useState<Record<string, unknown>[]>([]);
  const [team, setTeam] = useState<Record<string, unknown>[]>([]);

  const [policies, setPolicies] = useState(() => {
    const savedPolicies = localStorage.getItem("venuePolicies");
    return savedPolicies ? JSON.parse(savedPolicies) : {
      cancelWindow: "Р В РІР‚вЂќР В Р’В° 12 Р РЋРІР‚РЋР В Р’В°Р РЋР С“Р В РЎвЂўР В Р вЂ ",
      requireCardForLowKarma: true,
      autoBlacklist: false
    };
  });
  
  const [schedule, setSchedule] = useState<Record<string, unknown>[]>([
    { day: "Р В РЎСџР В РЎвЂўР В Р вЂ¦Р В Р’ВµР В РўвЂ Р В Р’ВµР В Р’В»Р РЋР Р‰Р В Р вЂ¦Р В РЎвЂ Р В РЎвЂќ", isActive: true, start: "10:00", end: "20:00" },
    { day: "Р В РІР‚в„ўР РЋРІР‚С™Р В РЎвЂўР РЋР вЂљР В Р вЂ¦Р В РЎвЂ Р В РЎвЂќ", isActive: true, start: "10:00", end: "20:00" },
    { day: "Р В Р Р‹Р РЋР вЂљР В Р’ВµР В РўвЂ Р В Р’В°", isActive: true, start: "10:00", end: "20:00" },
    { day: "Р В Р’В§Р В Р’ВµР РЋРІР‚С™Р В Р вЂ Р В Р’ВµР РЋР вЂљР В РЎвЂ“", isActive: true, start: "10:00", end: "20:00" },
    { day: "Р В РЎСџР РЋР РЏР РЋРІР‚С™Р В Р вЂ¦Р В РЎвЂ Р РЋРІР‚В Р В Р’В°", isActive: true, start: "10:00", end: "20:00" },
    { day: "Р В Р Р‹Р РЋРЎвЂњР В Р’В±Р В Р’В±Р В РЎвЂўР РЋРІР‚С™Р В Р’В°", isActive: true, start: "10:00", end: "18:00" },
    { day: "Р В РІР‚в„ўР В РЎвЂўР РЋР С“Р В РЎвЂќР РЋР вЂљР В Р’ВµР РЋР С“Р В Р’ВµР В Р вЂ¦Р РЋР Р‰Р В Р’Вµ", isActive: false, start: "10:00", end: "18:00" },
  ]);

  const [isSavingSchedule, setIsSavingSchedule] = useState(false);
  const [isSavingPolicies, setIsSavingPolicies] = useState(false);

  const { isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.venues.all,
    queryFn: async () => {
      const data = await VenueService.getVenues();
      if (data && data.length > 0) {
        const venue = data[0];
        setVenueId(venue.id);
        setVenueProfile({
          name: venue.name || '',
          phone: venue.phone || '',
          address: venue.address || '',
        });
        setServices((venue.services as Record<string, unknown>[] | undefined)?.map((s: Record<string, unknown>) => ({...s, isActive: s.isActive !== false})) || []);
        setTeam((venue.masters as Record<string, unknown>[] | undefined)?.map((m: Record<string, unknown>) => ({...m, isActive: m.isActive !== false})) || []);
      }
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const updateVenueMutation = useMutation({
    mutationFn: (updates: Record<string, unknown>) => VenueService.updateVenue(venueId as string, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.venues.all });
    }
  });

  const handleSaveCompany = (e: FormEvent) => {
    e.preventDefault();
    if (!venueId) return;

    updateVenueMutation.mutate({
      name: venueProfile.name,
      phone: venueProfile.phone,
      address: venueProfile.address,
    }, {
      onSuccess: () => {
        toast.success("Р В РЎСљР В Р’В°Р РЋР С“Р РЋРІР‚С™Р РЋР вЂљР В РЎвЂўР В РІвЂћвЂ“Р В РЎвЂќР В РЎвЂ  Р РЋР С“Р В РЎвЂўР РЋРІР‚В¦Р РЋР вЂљР В Р’В°Р В Р вЂ¦Р В Р’ВµР В Р вЂ¦Р РЋРІР‚в„–", { description: "Р В РЎСџР РЋР вЂљР В РЎвЂўР РЋРІР‚С›Р В РЎвЂ Р В Р’В»Р РЋР Р‰ Р В Р’В·Р В Р’В°Р В Р вЂ Р В Р’ВµР В РўвЂ Р В Р’ВµР В Р вЂ¦Р В РЎвЂ Р РЋР РЏ Р РЋРЎвЂњР РЋР С“Р В РЎвЂ”Р В Р’ВµР РЋРІвЂљВ¬Р В Р вЂ¦Р В РЎвЂў Р В РЎвЂўР В Р’В±Р В Р вЂ¦Р В РЎвЂўР В Р вЂ Р В Р’В»Р В Р’ВµР В Р вЂ¦." });
      },
      onError: () => {
        toast.error("Р В РЎвЂєР РЋРІвЂљВ¬Р В РЎвЂ Р В Р’В±Р В РЎвЂќР В Р’В° Р В РЎвЂ”Р РЋР вЂљР В РЎвЂ  Р РЋР С“Р В РЎвЂўР РЋРІР‚В¦Р РЋР вЂљР В Р’В°Р В Р вЂ¦Р В Р’ВµР В Р вЂ¦Р В РЎвЂ Р В РЎвЂ  Р В РЎвЂ”Р РЋР вЂљР В РЎвЂўР РЋРІР‚С›Р В РЎвЂ Р В Р’В»Р РЋР РЏ");
      }
    });
  };

  const toggleDay = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index].isActive = !newSchedule[index].isActive;
    setSchedule(newSchedule);
  };

  const updateScheduleTime = (index: number, field: string, value: string) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  const handleSaveSchedule = async () => {
    setIsSavingSchedule(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSavingSchedule(false);
    toast.success("Р В РІР‚СљР РЋР вЂљР В Р’В°Р РЋРІР‚С›Р В РЎвЂ Р В РЎвЂќ Р В РЎвЂўР В Р’В±Р В Р вЂ¦Р В РЎвЂўР В Р вЂ Р В Р’В»Р В Р’ВµР В Р вЂ¦", { description: "Р В РЎСљР В РЎвЂўР В Р вЂ Р РЋРІР‚в„–Р В Р’Вµ Р РЋРІР‚РЋР В Р’В°Р РЋР С“Р РЋРІР‚в„– Р РЋР вЂљР В Р’В°Р В Р’В±Р В РЎвЂўР РЋРІР‚С™Р РЋРІР‚в„– Р В РЎвЂ”Р РЋР вЂљР В РЎвЂ Р В РЎВ Р В Р’ВµР В Р вЂ¦Р В Р’ВµР В Р вЂ¦Р РЋРІР‚в„–." });
  };

  const handleSavePolicies = async () => {
    setIsSavingPolicies(true);
    await new Promise(r => setTimeout(r, 600)); 
    localStorage.setItem("venuePolicies", JSON.stringify(policies));
    toast.success("Р В РЎСџР РЋР вЂљР В Р’В°Р В Р вЂ Р В РЎвЂ Р В Р’В»Р В Р’В° Р В Р’В±Р РЋР вЂљР В РЎвЂўР В Р вЂ¦Р В РЎвЂ Р РЋР вЂљР В РЎвЂўР В Р вЂ Р В Р’В°Р В Р вЂ¦Р В РЎвЂ Р РЋР РЏ Р В РЎвЂўР В Р’В±Р В Р вЂ¦Р В РЎвЂўР В Р вЂ Р В Р’В»Р В Р’ВµР В Р вЂ¦Р РЋРІР‚в„–", { description: "Р В РЎСљР В РЎвЂўР В Р вЂ Р РЋРІР‚в„–Р В Р’Вµ Р В РЎвЂ”Р В РЎвЂўР В Р’В»Р В РЎвЂ Р РЋРІР‚С™Р В РЎвЂ Р В РЎвЂќР В РЎвЂ  Р В Р’В°Р В РЎвЂќР РЋРІР‚С™Р В РЎвЂ Р В Р вЂ Р В Р вЂ¦Р РЋРІР‚в„– Р В РўвЂ Р В Р’В»Р РЋР РЏ Р В Р вЂ Р РЋР С“Р В Р’ВµР РЋРІР‚В¦ Р В РЎвЂќР В Р’В»Р В РЎвЂ Р В Р’ВµР В Р вЂ¦Р РЋРІР‚С™Р В РЎвЂўР В Р вЂ ." });
    setIsSavingPolicies(false);
  };

  const handleToggleService = (id: string) => {
    const updatedServices = services.map((s: Record<string, unknown>) => s.id === id ? { ...s, isActive: !s.isActive } : s);
    setServices(updatedServices);
    updateVenueMutation.mutate({ services: updatedServices }, {
      onSuccess: () => toast.success("Р В Р Р‹Р РЋРІР‚С™Р В Р’В°Р РЋРІР‚С™Р РЋРЎвЂњР РЋР С“ Р РЋРЎвЂњР РЋР С“Р В Р’В»Р РЋРЎвЂњР В РЎвЂ“Р В РЎвЂ  Р В РЎвЂ Р В Р’В·Р В РЎВ Р В Р’ВµР В Р вЂ¦Р В Р’ВµР В Р вЂ¦")
    });
  };

  const addServiceMutation = useMutation({
    mutationFn: (newService: Record<string, unknown>) => {
      const updatedServices = [...services, newService];
      setServices(updatedServices);
      return VenueService.updateVenue(venueId as string, { services: updatedServices });
    }
  });

  const handleAddService = (e: FormEvent<HTMLFormElement>, callback?: () => void) => {
    e.preventDefault();
    if (!venueId) return;
    const formData = new FormData(e.currentTarget);
    const newService = {
      id: Date.now().toString(),
      name: formData.get("name") || "Р В РЎСљР В РЎвЂўР В Р вЂ Р В Р’В°Р РЋР РЏ Р РЋРЎвЂњР РЋР С“Р В Р’В»Р РЋРЎвЂњР В РЎвЂ“Р В Р’В°",
      duration: formData.get("time") ? `${formData.get("time")} Р В РЎВ Р В РЎвЂ Р В Р вЂ¦` : "30 Р В РЎВ Р В РЎвЂ Р В Р вЂ¦",
      price: formData.get("price") ? `${formData.get("price")} Р РЋР С“Р РЋРЎвЂњР В РЎВ ` : "0 Р РЋР С“Р РЋРЎвЂњР В РЎВ ",
      isActive: true
    };
    
    addServiceMutation.mutate(newService, {
      onSuccess: () => {
        toast.success("Р В Р в‚¬Р РЋР С“Р В Р’В»Р РЋРЎвЂњР В РЎвЂ“Р В Р’В° Р В РўвЂ Р В РЎвЂўР В Р’В±Р В Р’В°Р В Р вЂ Р В Р’В»Р В Р’ВµР В Р вЂ¦Р В Р’В°");
        if (callback) callback();
      },
      onError: () => toast.error("Р В РЎвЂєР РЋРІвЂљВ¬Р В РЎвЂ Р В Р’В±Р В РЎвЂќР В Р’В° Р В РЎвЂ”Р РЋР вЂљР В РЎвЂ  Р В РўвЂ Р В РЎвЂўР В Р’В±Р В Р’В°Р В Р вЂ Р В Р’В»Р В Р’ВµР В Р вЂ¦Р В РЎвЂ Р В РЎвЂ  Р РЋРЎвЂњР РЋР С“Р В Р’В»Р РЋРЎвЂњР В РЎвЂ“Р В РЎвЂ ")
    });
  };

  const handleToggleMaster = (id: string) => {
    const updatedTeam = team.map((m: Record<string, unknown>) => m.id === id ? { ...m, isActive: !m.isActive } : m);
    setTeam(updatedTeam);
    updateVenueMutation.mutate({ masters: updatedTeam }, {
      onSuccess: () => toast.success("Р В Р Р‹Р РЋРІР‚С™Р В Р’В°Р РЋРІР‚С™Р РЋРЎвЂњР РЋР С“ Р В РЎВ Р В Р’В°Р РЋР С“Р РЋРІР‚С™Р В Р’ВµР РЋР вЂљР В Р’В° Р В РЎвЂ Р В Р’В·Р В РЎВ Р В Р’ВµР В Р вЂ¦Р В Р’ВµР В Р вЂ¦")
    });
  };

  const addMasterMutation = useMutation({
    mutationFn: (newMaster: Record<string, unknown>) => {
      const updatedTeam = [...team, newMaster];
      setTeam(updatedTeam);
      return VenueService.updateVenue(venueId as string, { masters: updatedTeam });
    }
  });

  const handleAddMaster = (e: FormEvent<HTMLFormElement>, role: string, callback?: () => void) => {
    e.preventDefault();
    if (!venueId) return;
    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string) || "Новый мастер";
    const newMaster = {
      id: Date.now().toString(),
      name: name,
      role: role, 
      initials: name.substring(0, 2).toUpperCase(),
      isActive: true
    };
    
    addMasterMutation.mutate(newMaster, {
      onSuccess: () => {
        toast.success("Р В Р Р‹Р В РЎвЂўР РЋРІР‚С™Р РЋР вЂљР РЋРЎвЂњР В РўвЂ Р В Р вЂ¦Р В РЎвЂ Р В РЎвЂќ Р В РўвЂ Р В РЎвЂўР В Р’В±Р В Р’В°Р В Р вЂ Р В Р’В»Р В Р’ВµР В Р вЂ¦");
        if (callback) callback();
      },
      onError: () => toast.error("Р В РЎвЂєР РЋРІвЂљВ¬Р В РЎвЂ Р В Р’В±Р В РЎвЂќР В Р’В° Р В РЎвЂ”Р РЋР вЂљР В РЎвЂ  Р В РўвЂ Р В РЎвЂўР В Р’В±Р В Р’В°Р В Р вЂ Р В Р’В»Р В Р’ВµР В Р вЂ¦Р В РЎвЂ Р В РЎвЂ  Р В РЎВ Р В Р’В°Р РЋР С“Р РЋРІР‚С™Р В Р’ВµР РЋР вЂљР В Р’В°")
    });
  };

  const deleteItemMutation = useMutation({
    mutationFn: async (item: { type: string; id: string }) => {
      if (item.type === "service") {
        const updatedServices = services.filter((s: Record<string, unknown>) => s.id !== item.id);
        setServices(updatedServices);
        return VenueService.updateVenue(venueId as string, { services: updatedServices });
      } else if (item.type === "master") {
        const updatedTeam = team.filter((m: Record<string, unknown>) => m.id !== item.id);
        setTeam(updatedTeam);
        return VenueService.updateVenue(venueId as string, { masters: updatedTeam });
      }
    }
  });

  const handleDeleteItem = (item: { type: string; id: string }) => {
    if (!venueId || !item) return;
    deleteItemMutation.mutate(item, {
      onSuccess: () => {
        toast.success(item.type === "service" ? "Р В Р в‚¬Р РЋР С“Р В Р’В»Р РЋРЎвЂњР В РЎвЂ“Р В Р’В° Р РЋРЎвЂњР В РўвЂ Р В Р’В°Р В Р’В»Р В Р’ВµР В Р вЂ¦Р В Р’В°" : "Р В РЎС™Р В Р’В°Р РЋР С“Р РЋРІР‚С™Р В Р’ВµР РЋР вЂљ Р РЋРЎвЂњР В РўвЂ Р В Р’В°Р В Р’В»Р В Р’ВµР В Р вЂ¦");
      },
      onError: () => toast.error("Р В РЎвЂєР РЋРІвЂљВ¬Р В РЎвЂ Р В Р’В±Р В РЎвЂќР В Р’В° Р В РЎвЂ”Р РЋР вЂљР В РЎвЂ  Р РЋРЎвЂњР В РўвЂ Р В Р’В°Р В Р’В»Р В Р’ВµР В Р вЂ¦Р В РЎвЂ Р В РЎвЂ ")
    });
  };

  return {
    isLoading,
    isError,
    handleRefetch: refetch,
    venueProfile,
    setVenueProfile,
    policies,
    setPolicies,
    services,
    team,
    schedule,
    isSubmittingService: addServiceMutation.isPending,
    isSubmittingMaster: addMasterMutation.isPending,
    isSavingProfile: updateVenueMutation.isPending,
    isSavingSchedule,
    isSavingPolicies,
    handleSaveCompany,
    toggleDay,
    updateScheduleTime,
    handleSaveSchedule,
    handleSavePolicies,
    handleToggleService,
    handleAddService,
    handleToggleMaster,
    handleAddMaster,
    handleDeleteItem
  };
}
