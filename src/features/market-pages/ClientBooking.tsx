"use client";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, addDays, startOfToday } from "date-fns";
import { toast } from "sonner";
import BookingService from "./api/services/BookingService";
import useAuthStore from "./stores/authStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Star,
  Info,
  CalendarDays,
  ShieldCheck,
  Check,
  Clock,
  Globe,
  Map,
} from "lucide-react";
import { Input } from "@/components/ui/Input";

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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const shakeAnimation = {
  initial: { x: 0 },
  error: {
    x: [-8, 8, -8, 8, 0],
    transition: { duration: 0.4, ease: "easeInOut" as const },
  },
};

const venueData = {
  name: "Chop-Chop Barbershop",
  address: "Amir Temur St, 42",
  rating: 4.9,
  reviewsCount: 214,
  imageUrl:
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80",
  services: [
    {
      id: "1",
      name: "Haircut & Beard",
      duration: "1 h 15 min",
      price: "$45.00",
    },
    {
      id: "2",
      name: "Men's Haircut",
      duration: "45 min",
      price: "$30.00",
    },
  ],
  masters: [
    {
      id: "any",
      name: "Any available",
      initials: "AA",
      role: "First available professional",
    },
    { id: "1", name: "Ali Ahmedov", initials: "AA", role: "Top Barber" },
    { id: "2", name: "Sanjar I.", initials: "SI", role: "Barber" },
  ],
  about: {
    description:
      "Chop-Chop is more than just a barbershop. It's a place where men can get groomed, drink excellent coffee, and relax in good company. We work only with top-tier cosmetics and know everything about classic haircuts and shaves.",
    schedule: [
      { days: "Monday - Friday", time: "10:00 - 22:00" },
      { days: "Saturday - Sunday", time: "10:00 - 21:00" },
    ],
    contacts: {
      phone: "+998 90 123 45 67",
      instagram: "@chopchop.tashkent",
      website: "chopchop.uz",
    },
  },
};



export default function ClientBooking() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const dates = useMemo(() => {
    const today = startOfToday();
    return Array.from({ length: 14 }).map((_, i) => {
      const date = addDays(today, i);
      return {
        id: format(date, "yyyy-MM-dd"),
        day: format(date, "EEE"),
        dateNum: format(date, "dd"),
      };
    });
  }, []);

  const [activeTab, setActiveTab] = useState("booking");

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedMaster, setSelectedMaster] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(dates[0].id);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const availableTimes = useMemo(() => {
    // Basic dynamic generation based on date, could be replaced with real API call
    const times = ["10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "16:00", "16:30", "17:00"];
    // Pseudo-randomly remove some slots to simulate unavailability
    return times.filter((_, i) => (selectedDate.charCodeAt(selectedDate.length - 1) + i) % 3 !== 0);
  }, [selectedDate, selectedMaster]);

  const [clientName, setClientName] = useState<string>(user?.name ? String(user.name) : "");
  const [clientPhone, setClientPhone] = useState<string>(user?.phone ? String(user.phone) : "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [hasError, setHasError] = useState(false);

  const userKarma = 95;

  const isStep2Unlocked = selectedService !== null;
  const isStep3Unlocked = isStep2Unlocked && selectedMaster !== null;
  const isStep4Unlocked = isStep3Unlocked && selectedTime !== null;
  const isStep5Unlocked =
    isStep4Unlocked && clientName.trim() !== "" && clientPhone.trim() !== "";

  const getProgress = () => {
    if (isStep5Unlocked) return 100;
    if (isStep4Unlocked) return 80;
    if (isStep3Unlocked) return 60;
    if (isStep2Unlocked) return 40;
    return 20;
  };

  const scrollToElement = (id: string) => {
    setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
  };

  const handleServiceSelect = (id: string) => {
    setSelectedService(id);
    if (!selectedMaster) scrollToElement("step-2");
  };

  const handleMasterSelect = (id: string) => {
    setSelectedMaster(id);
    if (!selectedTime) scrollToElement("step-3");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    scrollToElement("step-4");
  };

  const handleConfirm = async () => {
    if (!policyAccepted) {
      setHasError(true);
      setTimeout(() => setHasError(false), 800);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const bookingData = {
        client_id: user?.id || null,
        business_id: "1", // Typically this would be dynamic based on venue
        service_id: selectedService,
        date: selectedDate,
        time: selectedTime,
        guest_name: clientName,
        guest_phone: clientPhone,
        is_guest: !user,
        status: "pending"
      };

      await BookingService.createBooking(bookingData);
      toast.success("Booking confirmed successfully!");
      
      // Reset or navigate
      // router.push("/search");
    } catch (error) {
      toast.error("Failed to confirm booking. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#ECECEA] pb-24 md:pb-10 font-sans selection:bg-[#8A2532] selection:text-white flex flex-col items-center text-[#121415]">
      {/* Navigation */}
      <div className="w-full max-w-3xl flex items-center justify-between p-4 md:pt-6 sticky top-0 bg-[#ECECEA]/90 backdrop-blur-md z-40">
        <Link
          href="/search"
          className="w-10 h-10 bg-white rounded-full shadow-sm border border-[#DCDCDA] text-[#121415] hover:bg-[#F5F5F4] flex items-center justify-center transition-colors active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="w-full max-w-3xl px-4 flex flex-col gap-6"
      >
        {/* Hero Banner */}
        <motion.div
          variants={fadeUp}
          className="w-full h-[200px] md:h-[240px] rounded-[2rem] overflow-hidden relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)]"
        >
          <img
            src={venueData.imageUrl}
            alt={venueData.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121415]/80 via-[#121415]/30 to-transparent pointer-events-none" />

          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between min-w-0 gap-4">
            <div className="text-white min-w-0 flex-1">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2 leading-tight">
                {venueData.name}
              </h1>
              <div className="flex items-center gap-1.5 text-white/80 text-sm font-medium">
                <MapPin className="w-4 h-4 text-white shrink-0" />
                <span className="truncate">{venueData.address}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#121415] px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm shrink-0">
              <Star className="w-4 h-4 fill-[#8A2532] text-[#8A2532]" />
              {venueData.rating}
            </div>
          </div>
        </motion.div>

        {/* Tab Controls */}
        <motion.div
          variants={fadeUp}
          className="flex items-center bg-white border border-[#DCDCDA] p-1.5 rounded-full w-full shadow-sm sticky top-[72px] md:top-20 z-30"
        >
          <button
            type="button"
            onClick={() => setActiveTab("booking")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium transition-all px-2 active:scale-95 ${
              activeTab === "booking"
                ? "bg-[#121415] text-white shadow-sm"
                : "text-[#121415] hover:bg-[#F5F5F4]"
            }`}
          >
            <CalendarDays className="w-4 h-4 shrink-0" />
            <span>Booking</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("about")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium transition-all px-2 active:scale-95 ${
              activeTab === "about"
                ? "bg-[#121415] text-white shadow-sm"
                : "text-[#121415] hover:bg-[#F5F5F4]"
            }`}
          >
            <Info className="w-4 h-4 shrink-0" />
            <span>About</span>
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Tab 1: Booking Form */}
          {activeTab === "booking" && (
            <motion.div
              key="booking"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              exit="exit"
              className="bg-white p-6 md:p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] mb-8"
            >
              {/* Dynamic Progress Bar */}
              <div className="w-full bg-[#F5F5F4] h-1.5 rounded-full mb-10 overflow-hidden border border-[#DCDCDA]">
                <div
                  className="h-full bg-[#121415] transition-all duration-700 ease-out"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>

              {/* Relative container for the vertical connector line */}
              <div className="relative space-y-10 z-0">
                {/* Step 1: Services */}
                <div
                  id="step-1"
                  className="scroll-mt-32 relative"
                >
                  <h2 className="text-xl font-semibold text-[#121415] mb-5 tracking-tight flex items-center gap-3">
                    <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#121415] text-xs font-bold border border-[#DCDCDA] shrink-0">
                      1
                    </span>
                    Select service
                  </h2>
                  <div className="space-y-3">
                    {venueData.services.map((service) => {
                      const isActive = selectedService === service.id;
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => handleServiceSelect(service.id)}
                          className={`w-full p-5 rounded-2xl border transition-all text-left flex items-center justify-between active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-[#121415] ${
                            isActive
                              ? "border-[#121415] bg-[#F5F5F4]"
                              : "border-[#DCDCDA] hover:bg-[#F5F5F4] bg-white"
                          }`}
                        >
                          <div className="min-w-0 flex-1 pr-4">
                            <p className="font-semibold mb-1 text-[#121415] leading-snug">
                              {service.name}
                            </p>
                            <p className="text-sm font-medium text-[#4A4E51]">
                              {service.duration}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                            <span className="font-semibold text-[#121415] whitespace-nowrap">
                              {service.price}
                            </span>
                            {isActive ? (
                              <div className="w-5 h-5 rounded-full bg-[#121415] flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-[#DCDCDA] shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Master */}
                <div
                  id="step-2"
                  className={`scroll-mt-32 pt-2 relative transition-all duration-500 ${isStep2Unlocked ? "opacity-100" : "opacity-40 pointer-events-none grayscale-[30%]"}`}
                >
                  <h2 className="text-xl font-semibold text-[#121415] mb-5 tracking-tight flex items-center gap-3">
                    <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#121415] text-xs font-bold border border-[#DCDCDA] shrink-0">
                      2
                    </span>
                    Professional
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {venueData.masters.map((master) => {
                      const isActive = selectedMaster === master.id;
                      return (
                        <button
                          key={master.id}
                          type="button"
                          onClick={() => handleMasterSelect(master.id)}
                          className={`p-5 rounded-2xl border text-left transition-all active:scale-[0.98] flex flex-col items-start min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] ${
                            isActive
                              ? "border-[#121415] bg-[#F5F5F4]"
                              : "border-[#DCDCDA] hover:bg-[#F5F5F4] bg-white"
                          }`}
                        >
                          <div
                            className={`w-12 h-12 mb-3 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                              master.id === "any"
                                ? "bg-white border border-[#DCDCDA] text-[#121415]"
                                : isActive
                                  ? "bg-[#121415] text-white"
                                  : "bg-[#ECECEA] text-[#121415]"
                            }`}
                          >
                            {master.initials}
                          </div>
                          <p className="font-semibold text-sm text-[#121415] truncate w-full">
                            {master.name}
                          </p>
                          <p className="text-xs font-medium text-[#4A4E51] mt-0.5 truncate w-full">
                            {master.role}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Date & Time */}
                <div
                  id="step-3"
                  className={`scroll-mt-32 pt-2 relative transition-all duration-500 ${isStep3Unlocked ? "opacity-100" : "opacity-40 pointer-events-none grayscale-[30%]"}`}
                >
                  <h2 className="text-xl font-semibold text-[#121415] mb-5 tracking-tight flex items-center gap-3">
                    <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#121415] text-xs font-bold border border-[#DCDCDA] shrink-0">
                      3
                    </span>
                    Date & Time
                  </h2>

                  <div className="flex gap-2.5 overflow-x-auto pb-4 pt-1 px-1 -mx-1 no-scrollbar">
                    {dates.map((date) => (
                      <button
                        key={date.id}
                        type="button"
                        onClick={() => setSelectedDate(date.id)}
                        className={`shrink-0 flex flex-col items-center justify-center w-[72px] h-[84px] rounded-2xl border transition-all active:scale-95 px-2 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-1 ${
                          selectedDate === date.id
                            ? "border-[#121415] bg-[#121415] text-white shadow-md"
                            : "border-[#DCDCDA] bg-white text-[#121415] hover:bg-[#F5F5F4]"
                        }`}
                      >
                        <span
                          className={`text-xs font-medium mb-1 ${
                            selectedDate === date.id
                              ? "text-white/80"
                              : "text-[#4A4E51]"
                          }`}
                        >
                          {date.day}
                        </span>
                        <span className="text-xl font-semibold">
                          {date.dateNum}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleTimeSelect(time)}
                        className={`py-3.5 px-2 rounded-xl font-medium text-sm transition-all active:scale-95 border truncate w-full text-center outline-none focus-visible:ring-2 focus-visible:ring-[#121415] ${
                          selectedTime === time
                            ? "border-[#121415] bg-[#121415] text-white"
                            : "border-[#DCDCDA] bg-white text-[#121415] hover:bg-[#F5F5F4]"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 4: User Data */}
                <div
                  id="step-4"
                  className={`scroll-mt-32 pt-2 relative transition-all duration-500 ${isStep4Unlocked ? "opacity-100" : "opacity-40 pointer-events-none grayscale-[30%]"}`}
                >
                  <h2 className="text-xl font-semibold text-[#121415] mb-5 tracking-tight flex items-center gap-3">
                    <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#121415] text-xs font-bold border border-[#DCDCDA] shrink-0">
                      4
                    </span>
                    Your details
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      id="client_name"
                      label="Full Name"
                      type="text"
                      icon={User}
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                    <Input
                      id="client_phone"
                      label="Phone number"
                      type="tel"
                      icon={Phone}
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Step 5: Confirmation */}
                <div
                  id="step-5"
                  className={`scroll-mt-32 pt-2 border-t border-[#DCDCDA] transition-all duration-500 ${isStep5Unlocked ? "opacity-100" : "opacity-40 pointer-events-none grayscale-[30%]"}`}
                >
                  <h2 className="text-xl font-semibold text-[#121415] mb-5 mt-6 tracking-tight flex items-center gap-3">
                    <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#121415] text-xs font-bold border border-[#DCDCDA] shrink-0">
                      5
                    </span>
                    Confirmation
                  </h2>

                  <div
                    className={`bg-[#F5F5F4] rounded-[1.5rem] p-6 border transition-colors duration-300 ${
                      hasError
                        ? "border-[#8A2532]/50 bg-[#8A2532]/5"
                        : "border-[#DCDCDA]"
                    }`}
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <ShieldCheck className="w-6 h-6 text-[#121415] shrink-0" />
                      <div>
                        <p className="font-semibold text-[#121415] text-base mb-1">
                          Free cancellation up to 12 hours
                        </p>
                        <p className="text-sm font-medium text-[#4A4E51] leading-relaxed">
                          Please respect the professionals' time. Frequent late
                          cancellations or no-shows will lower your karma score,
                          requiring prepayments for future bookings.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-[#DCDCDA] mb-6 w-max max-w-full shadow-sm">
                      <Star className="w-4 h-4 fill-[#8A2532] text-[#8A2532] shrink-0" />
                      <span className="text-xs font-bold uppercase tracking-widest text-[#121415] truncate">
                        Karma: {userKarma}%. No prepayment needed.
                      </span>
                    </div>

                    <motion.label
                      variants={shakeAnimation}
                      initial="initial"
                      animate={hasError ? "error" : "initial"}
                      className="flex items-start sm:items-center gap-3 cursor-pointer group w-full"
                    >
                      <div className="relative flex items-center justify-center w-5 h-5 shrink-0 mt-0.5 sm:mt-0">
                        <input
                          type="checkbox"
                          checked={policyAccepted}
                          onChange={(e) => {
                            setPolicyAccepted(e.target.checked);
                            if (e.target.checked) setHasError(false);
                          }}
                          className={`peer appearance-none w-5 h-5 border rounded-md transition-colors cursor-pointer shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 bg-white ${
                            hasError
                              ? "border-[#8A2532] shadow-[0_0_8px_rgba(138,37,50,0.3)]"
                              : "border-[#DCDCDA] checked:bg-[#121415] checked:border-[#121415]"
                          }`}
                        />
                        <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200" />
                      </div>
                      <span
                        className={`text-sm font-medium transition-colors select-none ${
                          hasError
                            ? "text-[#8A2532]"
                            : "text-[#4A4E51] group-hover:text-[#121415]"
                        }`}
                      >
                        I commit to arriving on time or canceling in advance.
                      </span>
                    </motion.label>
                  </div>
                </div>
              </div>

              {/* Desktop CTA */}
              <div
                className={`hidden md:block mt-10 transition-all duration-500 ${isStep5Unlocked ? "opacity-100" : "opacity-40 pointer-events-none"}`}
              >
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!isStep5Unlocked || isSubmitting}
                  className="w-full py-4 rounded-full font-medium text-sm transition-all flex items-center justify-center gap-2 bg-[#8A2532] hover:bg-[#731E29] text-white shadow-[0_8px_20px_rgba(138,37,50,0.2)] hover:shadow-[0_12px_24px_rgba(138,37,50,0.3)] hover:-translate-y-0.5 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#8A2532] focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Confirming..." : "Confirm Booking"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Tab 2: About Venue */}
          {activeTab === "about" && (
            <motion.div
              key="about"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              exit="exit"
              className="bg-white p-6 md:p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] mb-8 space-y-10"
            >
              <section>
                <h2 className="text-xl font-semibold text-[#121415] mb-4 tracking-tight">
                  About us
                </h2>
                <p className="text-[#4A4E51] font-medium leading-relaxed text-sm md:text-base">
                  {venueData.about.description}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#121415] mb-4 tracking-tight">
                  Location
                </h2>
                <div className="flex items-start gap-3 mb-4 min-w-0">
                  <MapPin className="w-5 h-5 text-[#8A2532] shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#121415] text-sm md:text-base">
                      {venueData.address}
                    </p>
                    <p className="text-sm font-medium text-[#4A4E51] mt-1 truncate">
                      Landmark: near the business center
                    </p>
                  </div>
                </div>

                <div className="w-full h-48 md:h-64 bg-[#F5F5F4] rounded-2xl border border-[#DCDCDA] overflow-hidden relative flex items-center justify-center shadow-inner">
                  <svg
                    width="100%"
                    height="100%"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 opacity-40"
                  >
                    <defs>
                      <pattern
                        id="grid"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 40 0 L 0 0 0 40"
                          fill="none"
                          stroke="#DCDCDA"
                          strokeWidth="1"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>

                  <div className="relative z-10 flex flex-col items-center max-w-[80%]">
                    <div className="w-10 h-10 bg-[#121415] text-white rounded-full flex items-center justify-center shadow-lg mb-2 shrink-0">
                      <Map className="w-5 h-5" />
                    </div>
                    <span className="text-xs uppercase tracking-widest font-bold text-[#121415] bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-[#DCDCDA] text-center">
                      Show on map
                    </span>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#121415] mb-4 tracking-tight">
                  Opening hours
                </h2>
                <div className="bg-[#F5F5F4] rounded-2xl border border-[#DCDCDA] p-5">
                  <div className="space-y-4">
                    {venueData.about.schedule.map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-4 min-w-0"
                      >
                        <div className="flex items-center gap-3 text-[#4A4E51] min-w-0 flex-1">
                          <Clock className="w-4 h-4 shrink-0" />
                          <span className="text-sm font-medium truncate">
                            {slot.days}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-[#121415] shrink-0">
                          {slot.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#121415] mb-4 tracking-tight">
                  Contacts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={`tel:${venueData.about.contacts.phone}`}
                    className="flex items-center gap-3 p-4 rounded-2xl border border-[#DCDCDA] hover:bg-[#F5F5F4] bg-white transition-colors group min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#F5F5F4] flex items-center justify-center group-hover:bg-[#121415] transition-colors shrink-0">
                      <Phone className="w-4 h-4 text-[#4A4E51] group-hover:text-white transition-colors" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs uppercase tracking-widest font-bold text-[#4A4E51] mb-1 truncate">
                        Phone
                      </p>
                      <p className="text-sm font-semibold text-[#121415] truncate">
                        {venueData.about.contacts.phone}
                      </p>
                    </div>
                  </a>

                  <a
                    href={`https://instagram.com/${venueData.about.contacts.instagram.substring(1)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-4 rounded-2xl border border-[#DCDCDA] hover:bg-[#F5F5F4] bg-white transition-colors group min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#F5F5F4] flex items-center justify-center group-hover:bg-[#121415] transition-colors shrink-0">
                      <Instagram className="w-4 h-4 text-[#4A4E51] group-hover:text-white transition-colors" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs uppercase tracking-widest font-bold text-[#4A4E51] mb-1 truncate">
                        Instagram
                      </p>
                      <p className="text-sm font-semibold text-[#121415] truncate">
                        {venueData.about.contacts.instagram}
                      </p>
                    </div>
                  </a>

                  <a
                    href={`https://${venueData.about.contacts.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-4 rounded-2xl border border-[#DCDCDA] hover:bg-[#F5F5F4] bg-white transition-colors group sm:col-span-2 min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#F5F5F4] flex items-center justify-center group-hover:bg-[#121415] transition-colors shrink-0">
                      <Globe className="w-4 h-4 text-[#4A4E51] group-hover:text-white transition-colors" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs uppercase tracking-widest font-bold text-[#4A4E51] mb-1 truncate">
                        Website
                      </p>
                      <p className="text-sm font-semibold text-[#121415] truncate">
                        {venueData.about.contacts.website}
                      </p>
                    </div>
                  </a>
                </div>
              </section>

              <section className="border-t border-[#DCDCDA] pt-10">
                <div className="flex items-center justify-between mb-6 gap-4 min-w-0">
                  <h2 className="text-xl font-semibold text-[#121415] tracking-tight">
                    Reviews
                  </h2>
                  <div className="flex items-center gap-2 shrink-0">
                    <Star className="w-5 h-5 fill-[#8A2532] text-[#8A2532]" />
                    <span className="text-xl font-semibold text-[#121415]">
                      {venueData.rating}
                    </span>
                    <span className="text-sm font-medium text-[#4A4E51]">
                      ({venueData.reviewsCount})
                    </span>
                  </div>
                </div>

                <div className="bg-[#F5F5F4] rounded-2xl p-6 text-center border border-[#DCDCDA]">
                  <p className="text-sm font-medium text-[#4A4E51]">
                    Only clients who have successfully completed their visit can
                    leave a review.
                  </p>
                  <button className="mt-4 px-6 py-2.5 bg-white border border-[#DCDCDA] text-[#121415] rounded-full font-medium text-sm hover:bg-[#F5F5F4] transition-all duration-300 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] shadow-sm hover:shadow-md hover:-translate-y-0.5">
                    Read all reviews
                  </button>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-[#DCDCDA] z-50">
        {activeTab === "booking" ? (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isStep5Unlocked || isSubmitting}
            className={`w-full py-3.5 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              isStep5Unlocked && !isSubmitting
                ? "bg-[#8A2532] hover:bg-[#731E29] text-white shadow-[0_8px_20px_rgba(138,37,50,0.2)] active:scale-95 focus-visible:ring-[#8A2532]"
                : "bg-[#DCDCDA] text-[#787D80] cursor-not-allowed"
            }`}
          >
            <span className="truncate">{isSubmitting ? "Confirming..." : "Confirm Booking"}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setActiveTab("booking");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="w-full py-3.5 bg-[#121415] hover:bg-[#1E2123] text-white rounded-full font-medium text-sm shadow-[0_8px_20px_rgba(0,0,0,0.08)] flex items-center justify-center gap-2 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2"
          >
            <span className="truncate">Go to booking</span>
          </button>
        )}
      </div>
    </div>
  );
}
