"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "@/features/market-pages/stores/authStore";
import AuthService from "@/features/market-pages/api/services/AuthService";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MapPin, Phone, Store, Briefcase } from "lucide-react";

export default function OnboardingWizard() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const supabase = createClient();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Business Data
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  
  // We need businessId if created on Step 1
  const [businessId, setBusinessId] = useState("");

  // Sync state with DB
  useEffect(() => {
    if (user?.profile?.onboarding_step !== undefined) {
      // Ensure we don't jump to a completed step if they are fully onboarded (handled by Guard, but just in case)
      const currentStep = Math.min(user.profile.onboarding_step as number, 2);
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

      // Update onboarding step
      const stepToSave = final ? 3 : nextStepIndex;
      await AuthService.updateProfile(sessionUserId, { onboarding_step: stepToSave });
      
      updateUser({
        profile: {
          ...user?.profile,
          onboarding_step: stepToSave
        }
      });

      if (final) {
        toast.success("Setup complete! Welcome to your dashboard.");
        router.push("/admin");
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
            label="Business Name"
            icon={Store}
            placeholder="e.g. Bella Salon"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>
      )
    },
    {
      title: "Location & Contact",
      subtitle: "Where can clients find you?",
      content: (
        <div className="space-y-4 w-full">
          <Input
            id="address"
            label="Address"
            icon={MapPin}
            placeholder="123 Main St, City"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Input
            id="phone"
            label="Phone Number (Optional)"
            icon={Phone}
            placeholder="+1 234 567 890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      )
    },
    {
      title: "Category",
      subtitle: "What is your main service area?",
      content: (
        <div className="space-y-4 w-full">
          <Input
            id="category"
            label="Category"
            icon={Briefcase}
            placeholder="e.g. Hair Salon, Barbershop"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <p className="text-xs text-[#4A4E51] mt-2">
             You can add more details later in the dashboard.
          </p>
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
      <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-sm p-6 sm:p-8 flex flex-col relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
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
            Back
          </Button>
          
          <Button 
            variant="primary" 
            onClick={() => handleNextStep(step + 1, step === steps.length - 1)}
            isLoading={loading}
            className="px-8"
            type="button"
          >
            {step === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
