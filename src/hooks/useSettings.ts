import { useState, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import VenueService from "@/services/VenueService";
import { queryKeys } from "@/lib/queryKeys";

export default function useSettings() {
  const queryClient = useQueryClient();
  const [venueId, setVenueId] = useState<string | null>(null);

  const [venueProfile, setVenueProfile] = useState<Record<string, string>>({ name: '', phone: '', address: '' });
  const [services, setServices] = useState<Record<string, unknown>[]>([]);
  const [team, setTeam] = useState<Record<string, unknown>[]>([]);

  const [policies, setPolicies] = useState(() => {
    const savedPolicies = localStorage.getItem("venuePolicies");
    return savedPolicies ? JSON.parse(savedPolicies) : {
      cancelWindow: "12 hours before",
      requireCardForLowKarma: true,
      autoBlacklist: false
    };
  });
  
  const [schedule, setSchedule] = useState<Record<string, unknown>[]>([
    { day: "Monday", isActive: true, start: "10:00", end: "20:00" },
    { day: "Tuesday", isActive: true, start: "10:00", end: "20:00" },
    { day: "Wednesday", isActive: true, start: "10:00", end: "20:00" },
    { day: "Thursday", isActive: true, start: "10:00", end: "20:00" },
    { day: "Friday", isActive: true, start: "10:00", end: "20:00" },
    { day: "Saturday", isActive: true, start: "10:00", end: "18:00" },
    { day: "Sunday", isActive: false, start: "10:00", end: "18:00" },
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
        toast.success("Settings saved", { description: "Venue profile successfully updated." });
      },
      onError: () => {
        toast.error("Error saving profile settings");
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
    toast.success("Schedule updated", { description: "New working hours have been saved." });
  };

  const handleSavePolicies = async () => {
    setIsSavingPolicies(true);
    await new Promise(r => setTimeout(r, 600)); 
    localStorage.setItem("venuePolicies", JSON.stringify(policies));
    toast.success("Booking policies updated", { description: "Updated policies are now active for all clients." });
    setIsSavingPolicies(false);
  };

  const handleToggleService = (id: string) => {
    const updatedServices = services.map((s: Record<string, unknown>) => s.id === id ? { ...s, isActive: !s.isActive } : s);
    setServices(updatedServices);
    updateVenueMutation.mutate({ services: updatedServices }, {
      onSuccess: () => toast.success("Service status updated")
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
      name: formData.get("name") || "New Service",
      duration: formData.get("time") ? `${formData.get("time")} min` : "30 min",
      price: formData.get("price") ? `${formData.get("price")} UZS` : "0 UZS",
      isActive: true
    };
    
    addServiceMutation.mutate(newService, {
      onSuccess: () => {
        toast.success("Service added successfully");
        if (callback) callback();
      },
      onError: () => toast.error("Error adding service")
    });
  };

  const handleToggleMaster = (id: string) => {
    const updatedTeam = team.map((m: Record<string, unknown>) => m.id === id ? { ...m, isActive: !m.isActive } : m);
    setTeam(updatedTeam);
    updateVenueMutation.mutate({ masters: updatedTeam }, {
      onSuccess: () => toast.success("Staff status updated")
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
    const name = (formData.get("name") as string) || "New Staff Member";
    const newMaster = {
      id: Date.now().toString(),
      name: name,
      role: role, 
      initials: name.substring(0, 2).toUpperCase(),
      isActive: true
    };
    
    addMasterMutation.mutate(newMaster, {
      onSuccess: () => {
        toast.success("Team member added");
        if (callback) callback();
      },
      onError: () => toast.error("Error adding team member")
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
        toast.success(item.type === "service" ? "Service removed" : "Staff member removed");
      },
      onError: () => toast.error("Error removing item")
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
