"use client";
import { useI18nStore } from "@/stores/i18nStore";
import { useI18n } from "@/hooks/useI18n";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  Plus, Scissors, Edit2, UserPlus, X, Clock, Banknote, ImagePlus,
  CalendarClock, Users, Store, Phone, MapPin, Trash2, Loader2,
  ChevronDown, CheckCircle2, ShieldAlert, Save, ShieldCheck, Globe, Link, Send, MessageCircle, Music
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const Instagram: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// --- BUILT-IN UI COMPONENTS ---
interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    {Icon && <Icon className="w-12 h-12 text-[#DCDCDA] mx-auto mb-4" />}
    <h3 className="text-lg font-semibold text-[#121415] mb-2">{title}</h3>
    {description && <p className="text-sm text-[#4A4E51] max-w-sm mx-auto">{description}</p>}
  </div>
);

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, description }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-[400px] max-w-full rounded-2xl p-8 shadow-2xl flex flex-col text-center" onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#dc2626]/10 text-[#dc2626]">
          <X className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-semibold text-[#121415] mb-2">{title}</h2>
        <p className="text-sm text-[#4A4E51] font-medium mb-6">{description}</p>
        <div className="flex gap-3 w-full">
          <button type="button" onClick={onClose} className="flex-1 py-3 bg-[#F5F5F4] text-[#121415] border border-[#DCDCDA] rounded-xl font-medium text-sm transition-colors hover:bg-[#ECECEA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]">{useI18n().t("app.t16")}</button>
          <button type="button" onClick={onConfirm} className="flex-1 py-3 rounded-xl font-medium text-sm shadow-sm transition-all bg-[#dc2626] text-white hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]">{useI18nStore.getState().t("extra.t243")}</button>
        </div>
      </div>
    </div>
  );
};

interface CustomSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
  iconMap?: Record<string, React.ReactNode>;
}

function CustomSelect({ value, options, onChange, className, iconMap }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className={`relative ${isOpen ? 'z-[99999]' : ''} ${className}`} ref={dropdownRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
        className={`w-full flex items-center justify-between px-4 py-3 bg-[#F5F5F4] border rounded-xl text-sm font-medium text-[#121415] outline-none transition-all focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-1 active:scale-95 ${
          isOpen ? "border-[#121415] bg-white ring-2 ring-[#121415]/10 shadow-sm" : "border-[#DCDCDA] hover:border-[#121415]"
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {iconMap && iconMap[value]}
          <span className="truncate">{value}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "text-[#121415] rotate-180" : "text-[#8B9194]"}`} />
      </button>
      
      {isOpen && (
        <div role="listbox" className="absolute z-[99999] w-full min-w-[140px] mt-2 bg-white border border-[#DCDCDA] rounded-xl shadow-lg max-h-56 overflow-y-auto py-1.5 animate-in fade-in zoom-in-95 duration-200">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              role="option"
              aria-selected={value === opt}
              onClick={(e) => {
                e.preventDefault();
                onChange(opt);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between group focus-visible:outline-none focus-visible:bg-[#F5F5F4] ${
                value === opt ? "bg-[#F5F5F4]" : "hover:bg-[#F5F5F4]"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {iconMap && iconMap[opt]}
                <span className={value === opt ? "font-medium text-[#121415]" : "font-medium text-[#4A4E51] group-hover:text-[#121415]"}>
                  {opt}
                </span>
              </div>
              {value === opt && <CheckCircle2 className="w-4 h-4 text-[#121415] shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
// ---------------------------------------------

const TABS = [
  { id: "profile", label: useI18nStore.getState().t("extra.t368"), icon: Store },
  { id: "schedule", label: "Working Hours", icon: CalendarClock },
  { id: "services", label: "Services", icon: Scissors },
  { id: "team", label: "Team", icon: Users },
  { id: "policies", label: "No-Show Protection", icon: ShieldAlert },
];

const TIME_OPTIONS = Array.from({ length: 36 }).map((_, i) => {
  const t = (i + 12) * 30; 
  return `${Math.floor(t / 60).toString().padStart(2, '0')}:${(t % 60).toString().padStart(2, '0')}`;
});

const ROLE_OPTIONS = ["Barber", "Senior Barber", "Top Specialist"];
const STANDARD_SERVICES = ["Men's Haircut", "Haircut + Beard", "Beard Trim", "Kids Haircut", "Buzz Cut", "Hair Coloring", "Head Shave", "Face Massage", "Styling"];
const CANCEL_WINDOWS = ["2 hours before", "12 hours before (Recommended)", "24 hours before", "Allow anytime"];
const KARMA_THRESHOLDS = ["90%", "80% (Recommended)", "70%", "60%"];

export default function Settings() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("profile");

  // Real state data for tab views
  const [venueProfile, setVenueProfile] = useState<{name: string; phone: string; address: string; description: string; socialLinks: {platform: string; value: string}[]}>({ name: '', phone: '', address: '', description: '', socialLinks: [] });
  const [policies, setPolicies] = useState({ cancelWindow: "12 hours before (Recommended)", requireCardForLowKarma: true, karmaThreshold: "80% (Recommended)", autoBlacklist: false });
  const [services, setServices] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBusinessData() {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
      
      const { data: business } = await supabase.from('businesses').select('*').eq('owner_id', user.id).single();
        
      if (business) {
        setBusinessId(business.id);

        // If business.phone is empty, auto-fill from the owner's auth phone (set during registration)
        let businessPhone = business.phone || '';
        if (!businessPhone && user.phone) {
          businessPhone = user.phone;
          await supabase.from('businesses').update({ phone: businessPhone }).eq('id', business.id);
        }

        let initialSocialLinks = business.social_links || [];
        if (initialSocialLinks.length === 0 && business.instagram) {
          initialSocialLinks = [{ platform: 'Instagram', value: business.instagram }];
        }

        setVenueProfile({
          name: business.name || '',
          phone: businessPhone,
          address: business.address || '',
          description: business.description || '',
          socialLinks: initialSocialLinks
        });

        if (business.policies_data && Object.keys(business.policies_data).length > 0) {
          const pd = business.policies_data;
          if (!pd.cancelWindow || pd.cancelWindow === "12 hours before") pd.cancelWindow = "12 hours before (Recommended)";
          if (!pd.karmaThreshold) pd.karmaThreshold = "80% (Recommended)";
          else if (pd.karmaThreshold === "80%") pd.karmaThreshold = "80% (Recommended)";
          setPolicies({ ...pd, cancelWindow: pd.cancelWindow, karmaThreshold: pd.karmaThreshold });
        }
        if (business.team_data && business.team_data.length > 0) setTeam(business.team_data);
        
        if (business.schedule_data && business.schedule_data.length > 0) {
          setSchedule(business.schedule_data);
        } else {
          setSchedule([
            { day: "Monday", isActive: true, start: "10:00", end: "20:00" },
            { day: "Tuesday", isActive: true, start: "10:00", end: "20:00" },
            { day: "Wednesday", isActive: true, start: "10:00", end: "20:00" },
            { day: "Thursday", isActive: true, start: "10:00", end: "20:00" },
            { day: "Friday", isActive: true, start: "10:00", end: "20:00" },
            { day: "Saturday", isActive: true, start: "10:00", end: "18:00" },
            { day: "Sunday", isActive: false, start: "10:00", end: "18:00" },
          ]);
        }
        
        const { data: srvs } = await supabase.from('services').select('*').eq('business_id', business.id);
        if (srvs) setServices(srvs.map((s: any) => ({
          id: s.id, name: s.name, duration: s.duration_minutes + " min", price: s.price + " UZS", isActive: true
        })));
      }
    } finally {
      setIsLoading(false);
    }
  }
  loadBusinessData();
}, []);

  // Modal states
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [newStaffRole, setNewMasterRole] = useState(ROLE_OPTIONS[0]); 
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{type: string; id: string; name: string} | null>(null);

  // Service form state
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceFormName, setServiceFormName] = useState("");
  const [serviceFormDuration, setServiceFormDuration] = useState("45");
  const [serviceFormPrice, setServiceFormPrice] = useState("");

  // Specialist form state
  const [specialistFormName, setSpecialistFormName] = useState("");

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) {
      toast.error("Business ID not found");
      return;
    }
    try {
      const supabase = createClient();
      const { error } = await supabase.from('businesses').update({
        name: venueProfile.name,
        phone: venueProfile.phone,
        address: venueProfile.address,
        description: venueProfile.description,
        social_links: venueProfile.socialLinks
      }).eq('id', businessId);
      
      if (error) throw error;
      toast.success("Profile saved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile");
    }
  };

  const handleSpecialistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialistFormName.trim()) return;
    
    const parts = specialistFormName.trim().split(" ");
    const initials = parts.length > 1 
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].substring(0, 2).toUpperCase();

    const newTeam = [...team, {
      id: Date.now().toString(),
      name: specialistFormName.trim(),
      role: newStaffRole,
      initials: initials,
      isActive: true
    }];
    setTeam(newTeam);
    
    if (businessId) {
       const supabase = createClient();
       const { error } = await supabase.from('businesses').update({ team_data: newTeam }).eq('id', businessId);
       if (error) {
         toast.error("Failed to save: " + error.message);
       }
    }
    
    toast.success("Specialist added");
    setIsMasterModalOpen(false);
    setSpecialistFormName("");
    setNewMasterRole(ROLE_OPTIONS[0]);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete?.type === 'service') {
      const newServices = services.filter(s => s.id !== itemToDelete.id);
      setServices(newServices);
      
      if (businessId) {
         const supabase = createClient();
         await supabase.from('services').delete().eq('id', itemToDelete.id);
      }
      toast.success("Service deleted");
    } else if (itemToDelete?.type === 'staff') {
      const newTeam = team.filter(m => m.id !== itemToDelete.id);
      setTeam(newTeam);
      
      if (businessId) {
         const supabase = createClient();
         await supabase.from('businesses').update({ team_data: newTeam }).eq('id', businessId);
      }
      toast.success("Specialist deleted");
    }
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const openServiceModal = (service?: typeof services[0]) => {
    if (service) {
      setEditingServiceId(service.id);
      setServiceFormName(service.name);
      
      // Extract numeric duration
      const match = service.duration.match(/\d+/g);
      let mins = "45";
      if (match) {
        if (service.duration.includes("hr") && match.length >= 2) {
          mins = String(parseInt(match[0]) * 60 + parseInt(match[1]));
        } else if (service.duration.includes("hr")) {
          mins = String(parseInt(match[0]) * 60);
        } else {
          mins = match[0];
        }
      }
      setServiceFormDuration(mins);
      const raw = String(service.price).replace(/\D/g, "");
      setServiceFormPrice(raw.replace(/\B(?=(\d{3})+(?!\d))/g, " "));
    } else {
      setEditingServiceId(null);
      setServiceFormName("");
      setServiceFormDuration("45");
      setServiceFormPrice("");
    }
    setIsServiceModalOpen(true);
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceFormName.trim() || !serviceFormPrice.trim() || !businessId) {
      toast.error("Please fill in required fields");
      return;
    }
    const supabase = createClient();

    const rawPrice = parseFloat(serviceFormPrice.replace(/[^0-9.]/g, ''));
    if (editingServiceId) {
      await supabase.from('services').update({
        name: serviceFormName,
        duration_minutes: parseInt(serviceFormDuration),
        price: rawPrice
      }).eq('id', editingServiceId);
      
      setServices(services.map(s => s.id === editingServiceId ? {
        ...s,
        name: serviceFormName,
        duration: serviceFormDuration + " min",
        price: serviceFormPrice + " UZS"
      } : s));
      toast.success("Service updated");
    } else {
      const { data, error } = await supabase.from('services').insert({
        business_id: businessId,
        name: serviceFormName,
        duration_minutes: parseInt(serviceFormDuration),
        price: rawPrice
      }).select().single();
      
      if (error) {
         toast.error(error.message);
         return;
      }
      
      setServices([...services, {
        id: data.id,
        name: data.name,
        duration: data.duration_minutes + " min",
        price: data.price + " UZS",
        isActive: true
      }]);
      toast.success("Service added");
    }

    setIsServiceModalOpen(false);
    setEditingServiceId(null);
    setServiceFormName("");
    setServiceFormDuration("45");
    setServiceFormPrice("");
  };

  const saveWorkingHours = async () => {
    if (!businessId) return;
    const supabase = createClient();
    await supabase.from('businesses').update({ schedule_data: schedule }).eq('id', businessId);
    toast.success("Working hours saved");
  };

  const savePolicies = async () => {
    if (!businessId) return;
    const supabase = createClient();
    await supabase.from('businesses').update({ policies_data: policies }).eq('id', businessId);
    toast.success("Policies saved");
  };

  // Toggle handlers
  const toggleDay = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index].isActive = !newSchedule[index].isActive;
    setSchedule(newSchedule);
  };

  const updateScheduleTime = (index: number, field: "start" | "end", value: string) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  const handleToggleService = (id: string) => {
    setServices(services.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
    /* no-op */
  };

  const handleToggleMaster = async (id: string) => {
    const newTeam = team.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m);
    setTeam(newTeam);
    if (businessId) {
       const supabase = createClient();
       await supabase.from('businesses').update({ team_data: newTeam }).eq('id', businessId);
    }
    /* no-op */
  };

  const preventDefaultSubmit = (e: React.FormEvent) => e.preventDefault();

  return (
    <div className="flex h-[100dvh] bg-[#ECECEA] font-sans text-[#121415] selection:bg-[#8A2532] selection:text-white">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-[#F5F5F4]/90 backdrop-blur-md border-b border-[#DCDCDA] px-6 md:px-10 py-4 md:py-0 h-auto md:h-20 shrink-0 sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-[#121415] tracking-tight">{t("extra.t2")}</h1>
            </div>
            <p className="text-sm text-[#4A4E51] font-medium mt-1 hidden sm:block">
              Manage your business profile, operating hours, and staff
            </p>
          </div>
        </header>

        <div className="px-6 md:px-10 pt-4 shrink-0 bg-white border-b border-[#DCDCDA]">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)} 
                  className={`flex items-center gap-2 pb-3 font-medium text-sm transition-all border-b-2 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-4 rounded-t-md ${isActive ? "border-[#121415] text-[#121415]" : "border-transparent text-[#4A4E51] hover:text-[#121415]"}`}
                >
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-[#8B9194]">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm font-medium">Loading settings...</p>
            </div>
          ) : (
          <div className="max-w-4xl mx-auto">
            
            {/* PROFILE */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#DCDCDA] animate-in fade-in duration-300">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-[#121415] tracking-tight">{t("extra.t4")}</h2>
                  <p className="text-sm text-[#4A4E51] font-medium mt-1">{t("extra.t5")}</p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#121415] mb-3">{t("extra.t6")}</label>
                    <div className="flex items-center gap-6">
                      <button type="button" className="w-24 h-24 rounded-2xl bg-[#F5F5F4] border border-dashed border-[#DCDCDA] flex flex-col items-center justify-center text-[#8B9194] hover:bg-[#ECECEA] hover:border-[#121415] transition-colors cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95">
                        <ImagePlus className="w-6 h-6 mb-1 group-hover:text-[#121415] transition-colors" />
                        <span className="text-xs font-medium">{t("extra.t7")}</span>
                      </button>
                      <div className="text-sm text-[#4A4E51] font-medium max-w-xs leading-relaxed">
                        Recommended size: 512x512px. Formats: JPG, PNG. Max 2MB.
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#121415] mb-2">{t("extra.t8")}</label>
                      <div className="relative">
                        <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9194]" />
                        <input required type="text" value={venueProfile.name} onChange={(e) => setVenueProfile({...venueProfile, name: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#121415] mb-2">{t("extra.t9")}</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9194]" />
                        <input type="text" value={venueProfile.address} onChange={(e) => setVenueProfile({...venueProfile, address: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" placeholder={t("extra.t10")} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-[#121415]">{t("extra.t11")}</label>
                      <button 
                        type="button" 
                        onClick={() => setVenueProfile({...venueProfile, socialLinks: [...venueProfile.socialLinks, {platform: 'Instagram', value: ''}]})}
                        className="px-4 py-2 bg-white text-sm font-medium flex items-center gap-1.5 text-[#121415] border border-[#DCDCDA] rounded-xl hover:bg-[#F5F5F4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        {t("extra.t499")}</button>
                    </div>
                    {venueProfile.socialLinks.length === 0 ? (
                      <div className="text-sm text-[#8B9194] bg-[#F5F5F4] p-4 rounded-xl border border-dashed border-[#DCDCDA] text-center">
                        {t("extra.t500")}</div>
                    ) : (
                      <div className="space-y-3">
                        {venueProfile.socialLinks.map((link, idx) => (
                          <div key={idx} className="flex gap-3">
                            <div className="w-1/3">
                              <CustomSelect 
                                value={link.platform}
                                options={['Instagram', 'Telegram', 'WhatsApp', 'TikTok']}
                                iconMap={{
                                  Instagram: <Instagram className="w-4 h-4 text-[#8B9194]" />,
                                  Telegram: <Send className="w-4 h-4 text-[#8B9194]" />,
                                  WhatsApp: <MessageCircle className="w-4 h-4 text-[#8B9194]" />,
                                  TikTok: <Music className="w-4 h-4 text-[#8B9194]" />
                                }}
                                onChange={(val) => {
                                  const newLinks = [...venueProfile.socialLinks];
                                  newLinks[idx].platform = val;
                                  setVenueProfile({...venueProfile, socialLinks: newLinks});
                                }}
                              />
                            </div>
                            <div className="relative flex-1">
                              <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9194]" />
                              <input 
                                type="text" 
                                value={link.value} 
                                onChange={(e) => {
                                  const newLinks = [...venueProfile.socialLinks];
                                  newLinks[idx].value = e.target.value;
                                  setVenueProfile({...venueProfile, socialLinks: newLinks});
                                }}
                                className="w-full pl-10 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] text-sm font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" 
                                placeholder={link.platform === 'WhatsApp' ? "+998 XX XXX XX XX" : "@username"}
                              />
                            </div>
                            <button 
                              type="button" 
                              onClick={() => {
                                const newLinks = [...venueProfile.socialLinks];
                                newLinks.splice(idx, 1);
                                setVenueProfile({...venueProfile, socialLinks: newLinks});
                              }}
                              className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#121415] mb-2">{t("extra.t12")}</label>
                    <div className="relative">
                      <textarea rows={4} value={venueProfile.description} onChange={(e) => setVenueProfile({...venueProfile, description: e.target.value})} className="w-full px-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl text-[#121415] font-medium focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all resize-none placeholder:text-[#8B9194]" placeholder={t("extra.t13")}></textarea>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#DCDCDA] flex justify-end">
                    <button type="submit" className="px-8 py-3 bg-[#121415] text-white hover:opacity-90 rounded-xl font-medium text-sm shadow-sm transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95 w-full sm:w-auto">
                      {t("extra.t501")}</button>
                  </div>
                </form>
              </div>
            )}

            {/* WORKING HOURS */}
            {activeTab === "schedule" && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#DCDCDA] animate-in fade-in duration-300">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-[#121415] tracking-tight">{t("extra.t14")}</h2>
                  <p className="text-sm text-[#4A4E51] font-medium mt-1">{t("extra.t15")}</p>
                </div>

                <div className="space-y-3 mb-8">
                  {schedule.map((day, idx) => (
                    <div key={day.day} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-colors ${day.isActive ? "bg-white border-[#DCDCDA] shadow-sm" : "bg-[#F5F5F4] border-[#DCDCDA] opacity-70"}`}>
                      <div className="flex items-center gap-4 w-full sm:w-1/3 mb-4 sm:mb-0">
                        <button type="button" onClick={() => toggleDay(idx)} aria-label={`Toggle ${day.day}`} className={`relative w-10 h-6 rounded-full transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 ${day.isActive ? "bg-[#4a6b53]" : "bg-[#DCDCDA]"}`}>
                          <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${day.isActive ? "translate-x-4" : "translate-x-0"}`}></span>
                        </button>
                        <span className={`font-medium text-sm ${day.isActive ? "text-[#121415]" : "text-[#4A4E51]"}`}>{day.day}</span>
                      </div>

                      {day.isActive ? (
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <CustomSelect 
                            value={day.start} 
                            options={TIME_OPTIONS} 
                            onChange={(val) => updateScheduleTime(idx, "start", val)} 
                            className="w-full sm:w-[120px]"
                          />
                          <span className="text-[#8B9194] font-medium">—</span>
                          <CustomSelect 
                            value={day.end} 
                            options={TIME_OPTIONS} 
                            onChange={(val) => updateScheduleTime(idx, "end", val)} 
                            className="w-full sm:w-[120px]"
                          />
                        </div>
                      ) : (
                        <div className="text-xs font-medium text-[#8B9194] px-4 w-full sm:w-auto text-left sm:text-right">
                          {t("extra.t502")}</div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-[#DCDCDA] flex justify-end">
                  <button type="button" onClick={saveWorkingHours} className="px-8 py-3 bg-[#121415] text-white hover:opacity-90 rounded-xl font-medium text-sm shadow-sm transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95 w-full sm:w-auto">
                    {t("extra.t503")}</button>
                </div>
              </div>
            )}

            {/* SERVICES */}
            {activeTab === "services" && (
              <div className="animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-[#121415] tracking-tight">{t("extra.t16")}</h2>
                    <p className="text-sm text-[#4A4E51] font-medium mt-1">{t("extra.t17")}</p>
                  </div>
                  <button type="button" onClick={() => openServiceModal()} className="bg-[#121415] text-white px-5 py-3 rounded-xl text-sm font-medium shadow-sm hover:opacity-90 transition-all flex justify-center items-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95">
                    <Plus className="w-4 h-4" /> {t("extra.t504")}</button>
                </div>

                <div className="space-y-3">
                  {services.length === 0 ? (
                    <EmptyState icon={Scissors} title={useI18nStore.getState().t("extra.t258")} description="Add your first service for customers." />
                  ) : (
                    services.map((service) => (
                      <div key={service.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border transition-all ${service.isActive ? "bg-white border-[#DCDCDA] shadow-sm" : "bg-[#F5F5F4] border-[#DCDCDA] opacity-60"}`}>
                        <div className="flex items-center gap-4 mb-4 sm:mb-0">
                          <button type="button" onClick={() => handleToggleService(service.id)} aria-label={useI18nStore.getState().t("extra.t171")} className={`relative w-11 h-6 rounded-full transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 shrink-0 ${service.isActive ? "bg-[#4a6b53]" : "bg-[#DCDCDA]"}`}>
                            <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${service.isActive ? "translate-x-5" : "translate-x-0"}`}></span>
                          </button>
                          <div>
                            <p className="font-semibold text-[#121415] text-base">{service.name}</p>
                            <p className="text-xs text-[#4A4E51] font-medium flex items-center gap-1 mt-1"><Clock className="w-3.5 h-3.5" /> {service.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                          <span className="font-semibold text-[#121415] text-lg whitespace-nowrap">{service.price}</span>
                          <div className="flex gap-2 shrink-0">
                            <button type="button" onClick={() => openServiceModal(service)} className="p-2.5 text-[#8B9194] hover:text-[#121415] hover:bg-[#F5F5F4] rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"><Edit2 className="w-4 h-4" /></button>
                            <button type="button" onClick={() => { setItemToDelete({type: 'service', id: service.id, name: service.name}); setDeleteModalOpen(true); }} className="p-2.5 text-[#8B9194] hover:text-[#dc2626] hover:bg-[#dc2626]/10 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TEAM */}
            {activeTab === "team" && (
              <div className="animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-[#121415] tracking-tight">{t("extra.t3")}</h2>
                    <p className="text-sm text-[#4A4E51] font-medium mt-1">{t("extra.t18")}</p>
                  </div>
                  <button type="button" onClick={() => { setIsMasterModalOpen(true); setSpecialistFormName(""); }} className="bg-[#121415] text-white px-5 py-3 rounded-xl text-sm font-medium shadow-sm hover:opacity-90 transition-all flex justify-center items-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95">
                    <UserPlus className="w-4 h-4" /> {t("extra.t505")}</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {team.length === 0 ? (
                     <div className="sm:col-span-2"><EmptyState icon={Users} title={useI18nStore.getState().t("extra.t252")} description="Add specialists to start taking bookings." /></div>
                  ) : (
                    team.map((member) => (
                      <div key={member.id} className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${member.isActive ? "bg-white border-[#DCDCDA] shadow-sm hover:shadow-md" : "bg-[#F5F5F4] border-[#DCDCDA] opacity-60"}`}>
                        <div className="flex justify-between items-start mb-5">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-semibold text-white text-lg shadow-sm shrink-0 ${member.isActive ? "bg-[#121415]" : "bg-[#8B9194]"}`}>{member.initials}</div>
                            <div>
                              <p className="font-semibold text-[#121415] text-lg leading-tight mb-1">{member.name}</p>
                              <span className="inline-flex px-2 py-0.5 rounded-md bg-[#ECECEA] text-[#4A4E51] border border-[#DCDCDA] text-xs font-medium">{member.role}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button type="button" onClick={() => { setItemToDelete({type: 'staff', id: member.id, name: member.name}); setDeleteModalOpen(true); }} className="p-2 text-[#8B9194] hover:text-[#dc2626] hover:bg-[#dc2626]/10 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-[#DCDCDA]">
                          <span className="text-xs font-medium text-[#4A4E51]">{t("extra.t19")}</span>
                          <button type="button" onClick={() => handleToggleMaster(member.id)} aria-label={useI18nStore.getState().t("extra.t328")} className={`relative w-10 h-6 rounded-full transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 ${member.isActive ? "bg-[#4a6b53]" : "bg-[#DCDCDA]"}`}>
                            <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${member.isActive ? "translate-x-4" : "translate-x-0"}`}></span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
            {/* POLICIES (NO-SHOW PROTECTION) */}
            {activeTab === "policies" && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#DCDCDA] animate-in fade-in duration-300">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-[#121415] flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-[#8A2532]" />{useI18nStore.getState().t("extra.t220")}</h2>
                  <p className="text-sm text-[#4A4E51] font-medium mt-1">{t("extra.t20")}</p>
                </div>

                <div className="space-y-6">
                  <div className="p-5 rounded-2xl border border-[#DCDCDA] bg-[#F5F5F4]/50">
                    <label className="block text-sm font-semibold text-[#121415] mb-1">{t("extra.t21")}</label>
                    <p className="text-xs text-[#4A4E51] font-medium mb-4">{t("extra.t22")}</p>
                    <CustomSelect 
                      value={policies.cancelWindow || "12 hours before (Recommended)"} 
                      options={CANCEL_WINDOWS} 
                      onChange={(val) => setPolicies({...policies, cancelWindow: val})} 
                      className="w-full sm:w-64"
                    />
                  </div>

                  <div className="p-5 rounded-2xl border border-[#DCDCDA] bg-[#F5F5F4]/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-[#121415] text-sm">{t("extra.t23")}</span>
                          <span className="px-2 py-0.5 rounded-md bg-[#4a6b53]/10 text-[#4a6b53] text-xs font-semibold">{t("extra.t24")}</span>
                        </div>
                        <p className="text-xs text-[#4A4E51] font-medium max-w-lg leading-relaxed">
                          Require card hold (deposit) only for first-time customers or those with karma score below {policies.karmaThreshold?.replace(' (Recommended)', '') || '80%'}. Loyal customers book in 1-click.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPolicies({...policies, requireCardForLowKarma: !policies.requireCardForLowKarma})} 
                        aria-label={useI18nStore.getState().t("extra.t223")}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#8A2532] focus-visible:ring-offset-2 shrink-0 ${policies.requireCardForLowKarma ? "bg-[#8A2532]" : "bg-[#DCDCDA]"}`}
                      >
                        <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${policies.requireCardForLowKarma ? "translate-x-5" : "translate-x-0"}`}></span>
                      </button>
                    </div>
                    {policies.requireCardForLowKarma && (
                      <div className="pt-4 mt-4 border-t border-[#DCDCDA]">
                        <label className="block text-sm font-semibold text-[#121415] mb-2">{t("extra.t25")}</label>
                        <CustomSelect 
                          value={policies.karmaThreshold || "80% (Recommended)"} 
                          options={KARMA_THRESHOLDS} 
                          onChange={(val) => setPolicies({...policies, karmaThreshold: val})} 
                          className="w-full sm:w-64"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-8 mt-6 border-t border-[#DCDCDA] flex justify-end">
                  <button type="button" onClick={savePolicies} className="px-8 py-3 bg-[#121415] text-white hover:opacity-90 rounded-xl font-medium text-sm shadow-sm transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95 w-full sm:w-auto">
                    <Save className="w-4 h-4" /> {t("extra.t506")}</button>
                </div>
              </div>
            )}
                      </div>
          )}
        </main>
      </div>

      {/* MODAL: NEW SERVICE */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-sm" role="dialog" aria-modal="true" onClick={() => setIsServiceModalOpen(false)}>
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button type="button" aria-label={useI18nStore.getState().t("extra.t128")} onClick={() => setIsServiceModalOpen(false)} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F5F4] hover:bg-[#ECECEA] flex items-center justify-center text-[#4A4E51] hover:text-[#121415] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95"><X className="w-4 h-4" /></button>
            <div className="p-6 border-b border-[#DCDCDA]">
              <h2 className="text-xl font-semibold text-[#121415] tracking-tight">{editingServiceId ? t("extra.t507") : t("extra.t508")}</h2>
            </div>
            <form onSubmit={handleServiceSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#4A4E51] mb-2 uppercase tracking-wider">{t("extra.t26")}</label>
                <div className="relative">
                  <Scissors className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9194]" />
                  <input 
                    required 
                    type="text" 
                    placeholder={t("extra.t27")} 
                    value={serviceFormName} 
                    onChange={(e) => setServiceFormName(e.target.value)} 
                    className="w-full pl-10 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl font-medium text-[#121415] focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" 
                  />
                </div>
                {!editingServiceId && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {STANDARD_SERVICES.map(s => (
                      <button 
                        type="button" 
                        key={s} 
                        onClick={() => setServiceFormName(s)} 
                        className="px-3 py-1.5 bg-[#F5F5F4] hover:bg-[#ECECEA] border border-[#DCDCDA] text-xs font-medium text-[#4A4E51] rounded-lg transition-colors focus-visible:outline-none focus-visible:border-[#121415]"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4A4E51] mb-2 uppercase tracking-wider">{t("extra.t28")}</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9194]" />
                    <input required name="time" type="number" placeholder="45" value={serviceFormDuration} onChange={(e) => setServiceFormDuration(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl font-medium text-[#121415] focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A4E51] mb-2 uppercase tracking-wider">{t("extra.t29")}</label>
                  <div className="relative">
                    <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9194]" />
                    <input required name="price" type="text" placeholder="80 000" value={serviceFormPrice} 
onChange={(e) => {
  const raw = e.target.value.replace(/\D/g, '');
  const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  setServiceFormPrice(formatted);
}} className="w-full pl-10 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl font-medium text-[#121415] focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" />
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full mt-4 py-3.5 bg-[#121415] text-white rounded-xl font-medium text-sm hover:opacity-90 transition-all flex justify-center items-center shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95">
                {editingServiceId ? t("extra.t509") : t("extra.t510")}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW SPECIALIST */}
      {isMasterModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#121415]/40 backdrop-blur-sm" role="dialog" aria-modal="true" onClick={() => setIsMasterModalOpen(false)}>
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button type="button" aria-label={useI18nStore.getState().t("extra.t128")} onClick={() => setIsMasterModalOpen(false)} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F5F4] hover:bg-[#ECECEA] flex items-center justify-center text-[#4A4E51] hover:text-[#121415] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95"><X className="w-4 h-4" /></button>
            <div className="p-6 border-b border-[#DCDCDA]">
              <h2 className="text-xl font-semibold text-[#121415] tracking-tight">{t("extra.t30")}</h2>
            </div>
            <form onSubmit={handleSpecialistSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#4A4E51] mb-2 uppercase tracking-wider">{useI18nStore.getState().t("extra.t180")}</label>
                <div className="relative">
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9194]" />
                  <input autoFocus required name="name" type="text" placeholder={useI18nStore.getState().t("extra.t336")} value={specialistFormName} onChange={(e) => setSpecialistFormName(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-[#F5F5F4] border border-[#DCDCDA] rounded-xl font-medium text-[#121415] focus:bg-white focus:border-[#121415] focus:ring-2 focus:ring-[#121415]/10 outline-none transition-all placeholder:text-[#8B9194]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#4A4E51] mb-2 uppercase tracking-wider">{t("extra.t31")}</label>
                <CustomSelect 
                  value={newStaffRole} 
                  options={ROLE_OPTIONS} 
                  onChange={setNewMasterRole} 
                  className="w-full"
                />
              </div>
              <button type="submit" className="w-full mt-4 py-3.5 bg-[#121415] text-white rounded-xl font-medium text-sm hover:opacity-90 transition-all shadow-sm flex justify-center items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 active:scale-95">
                {t("extra.t511")}</button>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={handleDeleteConfirm} 
        title={useI18nStore.getState().t("extra.t285")} 
        description={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`} 
      />
    </div>
  );
}



