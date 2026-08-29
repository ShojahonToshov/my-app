"use client";
import { useI18nStore } from "@/stores/i18nStore";
import { useI18n } from "@/hooks/useI18n";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import useUser from "@/hooks/useUser";
import AuthService from "@/services/customer/AuthService";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MapPin, Store, Briefcase, ChevronDown, CheckCircle2, Scissors, Users, DollarSign, Clock } from "lucide-react";

function OnboardingSuggestInput({ value, options, onChange, placeholder, icon: Icon }: { value: string, options: string[], onChange: (v: string) => void, placeholder: string, icon: any }) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const filteredOptions = options.filter(opt => opt.toLowerCase().includes(value.toLowerCase()) && opt !== value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full group ${isOpen ? 'z-[99999]' : ''}`} ref={dropdownRef}>
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B9194] group-focus-within:text-[#121415] z-10 transition-colors pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className={`w-full flex items-center justify-between pl-12 pr-4 py-4 rounded-xl outline-none transition-all duration-300 text-sm font-medium border text-[#121415] bg-[#F5F5F4] border-[#DCDCDA] focus:bg-white focus:ring-4 focus:ring-[#121415]/5 focus:border-[#121415] placeholder:text-[#8B9194]`}
      />

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-[99999] w-full mt-2 bg-white border border-[#DCDCDA] rounded-xl shadow-lg max-h-56 overflow-y-auto py-1.5 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-4 py-2 text-xs font-semibold text-[#8B9194] uppercase tracking-wider">{t("extra.t56")}</div>
          {filteredOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onChange(opt);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between group hover:bg-[#F5F5F4]"
            >
              <span className="font-medium text-[#4A4E51] group-hover:text-[#121415]">
                {opt}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OnboardingWizard() {
  const { t } = useI18n();
  const router = useRouter();
  const { user, updateUser } = useUser();
  const supabase = createClient();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Business Data
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");

  // Service Data
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDuration, setServiceDuration] = useState("60");

  // Staff Data
  const [staffName, setStaffName] = useState("");
  const [staffRole, setStaffRole] = useState("Barber");
  
  // We need businessId if created on Step 1
  const [businessId, setBusinessId] = useState("");

  // Sync state with DB
  useEffect(() => {
    if (user?.profile?.onboarding_step !== undefined) {
      // Ensure we don't jump to a completed step if they are fully onboarded (handled by Guard, but just in case)
      const currentStep = Math.min(user.profile.onboarding_step as number, 4);
      setStep(currentStep);
    }
  }, [user]);

  // Load existing business if already created
  useEffect(() => {
    if (!user?.id) return;
    const fetchBusiness = async () => {
      try {
        const { data } = await supabase.from("businesses").select("*").eq("owner_id", user.id).single();
        if (data) {
          setBusinessId(data.id);
          setBusinessName(data.name || "");
          setCategory(data.category || "");
          setAddress(data.address || "");
        }
      } catch (err) {
        // Business not found yet
      } finally {
        setIsInitializing(false);
      }
    };
    fetchBusiness();
  }, [user?.id, supabase]);

  const handleNextStep = async (nextStepIndex: number, final: boolean = false) => {
    setLoading(true);
    try {
      // Check session explicitly at the start of any step
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
         throw new Error("No active Supabase session found. Please log in again.");
      }
      const sessionUserId = sessionData.session.user.id;

      if (step === 0) {
        // Step 1: Save Business Name
        if (!businessName.trim()) throw new Error("Please enter a business name");
        
        if (businessId) {
          await supabase.from("businesses").update({ name: businessName }).eq("id", businessId);
        } else {
          const { data, error } = await supabase.from("businesses").insert({
            owner_id: sessionUserId, // Use ID directly from session
            name: businessName,
            phone: sessionData.session.user.phone || "",
          }).select().single();
          if (error) throw error;
          if (data) setBusinessId(data.id);
        }
      }

      if (step === 1) {
        // Step 2: Location and Phone
        if (!address.trim()) throw new Error("Please enter an address");
        await supabase.from("businesses").update({ address }).eq("id", businessId);
      }

      if (step === 2) {
         // Step 3: Category
         if (!category.trim()) throw new Error("Please select a category");
         await supabase.from("businesses").update({ category }).eq("id", businessId);
      }
      
      if (step === 3) {
         // Step 4: First Service
         if (!serviceName.trim()) throw new Error("Please enter a service name");
         if (!servicePrice.trim()) throw new Error("Please enter a price");
         const numericPrice = parseFloat(servicePrice.replace(/\s/g, ''));
         if (isNaN(numericPrice)) throw new Error("Price must be a valid number");
         
         // Delete existing if resuming step?
         // Safer to just check if there's any service for this business. If yes, skip or update.
         // Let's just insert one. To prevent dupes if they go back and forth:
         const { data: existingServices } = await supabase.from("services").select("id").eq("business_id", businessId);
         if (existingServices && existingServices.length > 0) {
           await supabase.from("services").update({
             name: serviceName,
             price: numericPrice,
             duration_minutes: parseInt(serviceDuration) || 60
           }).eq("id", existingServices[0].id);
         } else {
           await supabase.from("services").insert({
             business_id: businessId,
             name: serviceName,
             price: numericPrice,
             duration_minutes: parseInt(serviceDuration) || 60
           });
         }
      }
      
      if (step === 4) {
         // Step 5: First Staff Member
         if (!staffName.trim()) throw new Error("Please enter a team member name");
         
         const parts = staffName.trim().split(" ");
         const initials = parts.length > 1 
           ? (parts[0][0] + parts[1][0]).toUpperCase()
           : parts[0].substring(0, 2).toUpperCase();
           
         const newStaff = {
           id: Date.now().toString(),
           name: staffName.trim(),
           role: staffRole,
           initials: initials,
           isActive: true
         };
         
         const defaultSchedule = [
            { day: "Monday", isActive: true, start: "10:00", end: "20:00" },
            { day: "Tuesday", isActive: true, start: "10:00", end: "20:00" },
            { day: "Wednesday", isActive: true, start: "10:00", end: "20:00" },
            { day: "Thursday", isActive: true, start: "10:00", end: "20:00" },
            { day: "Friday", isActive: true, start: "10:00", end: "20:00" },
            { day: "Saturday", isActive: true, start: "10:00", end: "18:00" },
            { day: "Sunday", isActive: false, start: "10:00", end: "18:00" },
         ];
         
         await supabase.from("businesses").update({ 
           team_data: [newStaff],
           schedule_data: defaultSchedule,
           description: "Welcome to our business! We offer top quality services."
         }).eq("id", businessId);
      }

      // Update onboarding step
      const stepToSave = final ? 5 : nextStepIndex;
      await AuthService.updateProfile(sessionUserId, { onboarding_step: stepToSave });
      
      updateUser({
        profile: {
          ...user?.profile,
          onboarding_step: stepToSave
        }
      });

      if (final) {
        await supabase.auth.refreshSession();
        toast.success("Setup complete! Welcome to your dashboard.");
        router.push("/dashboard");
      } else {
        setStep(nextStepIndex);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save data");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Welcome to Elara",
      subtitle: "Let's set up your business profile.",
      content: (
        <div className="space-y-4 w-full">
          <Input
            id="businessName"
            label={useI18nStore.getState().t("extra.t306")}
            icon={Store}
            placeholder={t("extra.t57")}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>
      )
    },
    {
      title: "Location & Contact",
      subtitle: "Where can customers find you?",
      content: (
        <div className="space-y-4 w-full">
          <Input
            id="address"
            label={useI18nStore.getState().t("extra.t183")}
            icon={MapPin}
            placeholder={t("extra.t58")}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      )
    },
    {
      title: "Category",
      subtitle: "What is your main service area?",
      content: (
        <div className="space-y-4 w-full">
          <OnboardingSuggestInput
            value={category}
            onChange={(val) => setCategory(val)}
            placeholder={useI18nStore.getState().t("extra.t236")}
            icon={Briefcase}
            options={["Barbershop", "Beauty Salon", "Pet Grooming"]}
          />
          <p className="text-xs text-[#4A4E51] mt-2">
             {t("extra.t512")}</p>
        </div>
      )
    },
    {
      title: "First Service",
      subtitle: "Add a service you offer.",
      content: (
        <div className="space-y-4 w-full">
          <OnboardingSuggestInput
            value={serviceName}
            onChange={(val) => setServiceName(val)}
            placeholder={t("extra.t59")}
            icon={Scissors}
            options={["Men's Haircut", "Women's Haircut", "Beard Trim", "Manicure", "Pedicure", "Coloring", "Dog Grooming", "Cat Grooming"]}
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                id="servicePrice"
                label={useI18nStore.getState().t("extra.t307")}
                icon={DollarSign}
                placeholder="100 000"
                value={servicePrice}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                  setServicePrice(formatted);
                }}
                type="text"
              />
            </div>
            <div className="flex-1">
              <Input
                id="serviceDuration"
                label={useI18nStore.getState().t("extra.t327")}
                icon={Clock}
                placeholder="45"
                value={serviceDuration}
                onChange={(e) => setServiceDuration(e.target.value)}
                type="number"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Add a Team Member",
      subtitle: "Who provides these services?",
      content: (
        <div className="space-y-4 w-full">
          <Input
            id="staffName"
            label={useI18nStore.getState().t("extra.t157")}
            icon={Users}
            placeholder={t("extra.t60")}
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
          />
          <OnboardingSuggestInput
            value={staffRole}
            onChange={(val) => setStaffRole(val)}
            placeholder={useI18nStore.getState().t("extra.t187")}
            icon={Briefcase}
            options={["Barber", "Stylist", "Nail Technician", "Groomer"]}
          />
        </div>
      )
    }
  ];

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#ECECEA] flex items-center justify-center p-4">
         <div className="w-8 h-8 border-4 border-[#8A2532] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentStepData = steps[step] || steps[0];

  return (
    <div className="min-h-screen bg-[#ECECEA] flex items-center justify-center p-4 selection:bg-[#8A2532] selection:text-white">
      <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-sm p-6 sm:p-8 flex flex-col relative">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 rounded-t-3xl overflow-hidden">
          <motion.div 
            className="h-full bg-[#8A2532]"
            initial={{ width: `${(step / steps.length) * 100}%` }}
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="mb-8 mt-2">
           <h2 className="text-2xl font-semibold text-[#121415] tracking-tight">{currentStepData.title}</h2>
           <p className="text-[#4A4E51] mt-1.5 text-sm">{currentStepData.subtitle}</p>
        </div>

        <div className="flex-1 min-h-[180px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -15, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
               {currentStepData.content}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0 || loading}
            className="px-6"
            type="button"
          >
            {t("extra.t513")}</Button>
          
          <Button 
            variant="primary" 
            onClick={() => handleNextStep(step + 1, step === steps.length - 1)}
            isLoading={loading}
            className="px-8"
            type="button"
          >
            {step === steps.length - 1 ? t("extra.t514") : t("extra.t515")}
          </Button>
        </div>
      </div>
    </div>
  );
}

