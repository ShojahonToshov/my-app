"use client";
import React, { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Star,
  ShieldCheck,
  Calendar,
  ChevronDown,
  Menu,
  X,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import ElaraLogo from "@/components/ElaraLogo";
import SignupRoleModal from "@/components/SignupRoleModal";
import { Button } from "@/components/ui/Button";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
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

function FaqItem({ q, a }) {
  const [isOpen, setIsOpen] = useState(false);
  const answerId = useId();

  return (
    <div className="py-6 border-b border-[#DCDCDA] last:border-0 group">
      <h3 className="text-lg font-medium text-[#121415] m-0">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={answerId}
          className="flex justify-between items-center w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-lg group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="group-hover:text-[#8A2532] transition-colors">
            {q}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-[#4A4E51] transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </h3>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={answerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-[#4A4E51] font-medium leading-relaxed pb-2 m-0">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  useLockBodyScroll(mobileMenuOpen);

  // Кастомная функция для плавного скролла к секциям по центру экрана
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      window.history.pushState(null, "", `#${id}`);
    }
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#ECECEA] font-sans selection:bg-[#8A2532] selection:text-white overflow-x-hidden text-[#121415]">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#ECECEA]/80 backdrop-blur-xl border-b border-[#DCDCDA] px-6">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-3">
            <ElaraLogo />

          </div>

          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-[#4A4E51]">

            <Link
              href="#features"
              onClick={(e) => scrollToSection(e, "features")}
              className="hover:text-[#121415] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, "how-it-works")}
              className="hover:text-[#121415] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
            >
              How it works
            </Link>
            <Link
              href="#faq"
              onClick={(e) => scrollToSection(e, "faq")}
              className="hover:text-[#121415] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
            >
              FAQ
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0">
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm font-medium text-[#121415] border border-[#DCDCDA] bg-white hover:bg-[#F5F5F4] rounded-full transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center"
            >
              Log in
            </Link>
            <button
              onClick={() => setSignupModalOpen(true)}
              className="outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-full flex items-center justify-center"
            >
              <Button variant="secondary" size="sm" className="px-6 py-2.5 rounded-full active:scale-95 pointer-events-none">
                Sign up
              </Button>
            </button>
          </div>

          <button
            className="md:hidden p-2 text-[#121415] outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-lg active:scale-95 transition-transform"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#ECECEA] border-b border-[#DCDCDA] overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-4">

                <Link
                  href="#features"
                  onClick={(e) => scrollToSection(e, "features")}
                  className="text-lg font-medium text-[#121415] outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  onClick={(e) => scrollToSection(e, "how-it-works")}
                  className="text-lg font-medium text-[#121415] outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
                >
                  How it works
                </Link>
                <Link
                  href="#faq"
                  onClick={(e) => scrollToSection(e, "faq")}
                  className="text-lg font-medium text-[#121415] outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
                >
                  FAQ
                </Link>

                <div className="h-px bg-[#DCDCDA] my-2" />

                <Link
                  href="/login"
                  className="text-lg font-medium text-[#121415] outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <button
                  onClick={() => {
                    setSignupModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="text-lg font-medium text-[#8A2532] outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded text-left"
                >
                  Sign up
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-40 md:pt-52 pb-20 px-6 max-w-7xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] font-semibold text-[#121415] tracking-tighter mb-6"
            >
              Your time, <span className="text-[#8A2532]">elevated.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-[#4A4E51] max-w-2xl mx-auto font-medium mb-12 leading-relaxed tracking-tight"
            >
              Discover and book the city's finest salons, clinics, and premium
              services. Effortless scheduling for those who value their time.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 relative z-20"
            >
              <Link
                href="/search"
                className="w-full sm:w-auto outline-none focus-visible:ring-2 focus-visible:ring-[#8A2532] rounded-full"
              >
                <Button
                  variant="primary"
                  className="w-full !px-8 !py-3.5 !text-base active:scale-95"
                >
                  <div className="flex items-center justify-center gap-2">
                    Start your journey
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </div>
                </Button>
              </Link>

              <Link
                href="#features"
                onClick={(e) => scrollToSection(e, "features")}
                className="w-full sm:w-auto outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-full"
              >
                <button className="w-full sm:w-auto px-8 py-3.5 bg-white border border-[#DCDCDA] text-[#121415] hover:bg-[#F5F5F4] rounded-full text-base font-medium transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center">
                  Explore features
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Product Showcase UI */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-full max-w-5xl mx-auto mt-24 relative z-10"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#ECECEA] z-10 pointer-events-none" />

            <div className="bg-white rounded-t-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] p-3 md:p-4 overflow-hidden">
              <div className="bg-[#F5F5F4] rounded-[2rem] w-full h-[400px] md:h-[600px] border border-[#DCDCDA]/60 p-4 md:p-8 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-[#DCDCDA] pb-4 px-2">
                  <div className="flex gap-2 items-center">
                    <div className="w-3 h-3 rounded-full bg-[#DCDCDA]" />
                    <div className="w-3 h-3 rounded-full bg-[#DCDCDA]" />
                    <div className="w-3 h-3 rounded-full bg-[#DCDCDA]" />
                  </div>
                  <div className="flex gap-4">
                    <div className="h-4 w-16 bg-[#DCDCDA] rounded-full animate-pulse" />
                    <div className="h-4 w-16 bg-[#DCDCDA] rounded-full animate-pulse" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full mt-4">
                  <div className="col-span-1 space-y-4 hidden md:block">
                    <div className="h-8 w-3/4 bg-[#DCDCDA]/70 rounded-lg animate-pulse" />
                    <div className="h-4 w-1/2 bg-[#DCDCDA]/70 rounded-lg mb-8 animate-pulse" />
                    <div className="space-y-3 mt-8">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-14 w-full bg-white border border-[#DCDCDA] rounded-xl flex items-center px-4 gap-3 shadow-sm"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#F5F5F4] animate-pulse" />
                          <div className="space-y-2 flex-1">
                            <div className="h-2 w-1/2 bg-[#DCDCDA] rounded-full animate-pulse" />
                            <div className="h-2 w-1/3 bg-[#DCDCDA] rounded-full animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 bg-white border border-[#DCDCDA] rounded-2xl p-6 shadow-sm flex flex-col">
                    <div className="h-6 w-1/3 bg-[#DCDCDA]/70 rounded-md mb-8 animate-pulse" />
                    <div className="grid grid-cols-4 gap-3 mb-6">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-24 rounded-xl border animate-pulse ${
                            i === 2
                              ? "bg-[#8A2532]/10 border-[#8A2532]/30"
                              : "bg-[#F5F5F4] border-[#DCDCDA]"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex-1 bg-[#F5F5F4] rounded-xl border border-[#DCDCDA] p-6 flex flex-col gap-4">
                      <div className="h-4 w-1/4 bg-[#DCDCDA] rounded-full animate-pulse" />
                      <div className="h-4 w-1/2 bg-[#DCDCDA] rounded-full animate-pulse" />
                      <div className="mt-auto h-12 w-full bg-[#121415] rounded-xl opacity-95 shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 bg-[#ECECEA]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-semibold text-[#121415] tracking-tight mb-4 leading-tight">
                A new standard for premium bookings.
              </h2>
              <p className="text-[#4A4E51] text-lg font-medium leading-relaxed">
                Everything you need to manage your appointments, wrapped in a
                calm, intelligent interface.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2 bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                <Calendar className="w-8 h-8 text-[#8A2532] mb-6" />
                <h3 className="text-2xl font-semibold text-[#121415] mb-3 tracking-tight">
                  Real-time availability
                </h3>
                <p className="text-[#4A4E51] font-medium max-w-md leading-relaxed">
                  Skip the back-and-forth messaging. See exactly when your
                  favorite professionals are free and secure your spot
                  instantly.
                </p>

                <div className="absolute right-[-10%] bottom-[-20%] w-3/4 h-64 bg-[#F5F5F4] border border-[#DCDCDA] rounded-2xl shadow-lg p-6 group-hover:-translate-y-2 transition-transform duration-500 hidden md:block">
                  <div className="h-4 w-1/3 bg-[#DCDCDA] rounded-full mb-6" />
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-12 bg-white rounded-xl border border-[#DCDCDA]/50"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-span-1 bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] group">
                <Star className="w-8 h-8 text-[#8A2532] mb-6" />
                <h3 className="text-2xl font-semibold text-[#121415] mb-3 tracking-tight">
                  Verified reviews
                </h3>
                <p className="text-[#4A4E51] font-medium leading-relaxed">
                  Read authentic feedback from real clients. We only allow
                  reviews from completed appointments.
                </p>
              </div>

              <div className="col-span-1 bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] group">
                <ShieldCheck className="w-8 h-8 text-[#8A2532] mb-6" />
                <h3 className="text-2xl font-semibold text-[#121415] mb-3 tracking-tight">
                  Smart protection
                </h3>
                <p className="text-[#4A4E51] font-medium leading-relaxed">
                  Our dynamic Karma system protects businesses from no-shows,
                  ensuring a reliable ecosystem for everyone.
                </p>
              </div>

              <div className="col-span-1 md:col-span-2 bg-[#121415] rounded-[2rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] relative overflow-hidden group">
                <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
                  Effortless rescheduling
                </h3>
                <p className="text-[#8B9194] font-medium max-w-md leading-relaxed">
                  Plans change. Reschedule your appointments with a single tap,
                  directly from your dashboard—without the awkward phone calls.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <div className="px-6 py-3 rounded-full bg-white/10 text-white text-sm font-medium backdrop-blur-md select-none">
                    Modify time
                  </div>
                  <div className="px-6 py-3 rounded-full bg-white/5 text-white/50 text-sm font-medium select-none">
                    Cancel
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="py-32 px-6 bg-white border-t border-[#DCDCDA]"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-semibold text-[#121415] tracking-tight mb-12">
                  How Elara works
                </h2>

                <div className="space-y-10">
                  <div className="flex gap-6 group">
                    <div className="text-sm font-bold text-[#8A2532] mt-1 shrink-0">
                      01
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-[#121415] mb-2 tracking-tight">
                        Discover
                      </h4>
                      <p className="text-[#4A4E51] font-medium leading-relaxed">
                        Search for premium services by category, precise
                        location, or find your favorite professional.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6 group">
                    <div className="text-sm font-bold text-[#8A2532] mt-1 shrink-0">
                      02
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-[#121415] mb-2 tracking-tight">
                        Select & Book
                      </h4>
                      <p className="text-[#4A4E51] font-medium leading-relaxed">
                        Choose a time that fits your schedule from real-time
                        available slots. Confirm in one tap.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6 group">
                    <div className="text-sm font-bold text-[#8A2532] mt-1 shrink-0">
                      03
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-[#121415] mb-2 tracking-tight">
                        Experience
                      </h4>
                      <p className="text-[#4A4E51] font-medium leading-relaxed">
                        Arrive and enjoy. Your appointment is confirmed
                        instantly and synced to your schedule.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#F5F5F4] rounded-[2rem] border border-[#DCDCDA] aspect-square p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <ElaraLogo dark={false} disableLink={true} />
                </div>

                <div className="w-full space-y-4">
                  <motion.div
                    initial={{ opacity: 0.5, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="h-20 w-full bg-white rounded-2xl border border-[#DCDCDA] flex items-center px-6 gap-4"
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-[#8A2532] flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#8A2532] rounded-full" />
                    </div>
                    <div className="h-3 w-1/3 bg-[#DCDCDA] rounded-full" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0.5, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="h-20 w-11/12 bg-white rounded-2xl border border-[#DCDCDA] flex items-center px-6 gap-4"
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-[#DCDCDA]" />
                    <div className="h-3 w-1/2 bg-[#ECECEA] rounded-full" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0.5, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-20 w-full bg-white rounded-2xl border border-[#DCDCDA] flex items-center px-6 gap-4"
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-[#DCDCDA]" />
                    <div className="h-3 w-1/4 bg-[#ECECEA] rounded-full" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-24 px-6 bg-[#ECECEA] border-y border-[#DCDCDA]">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-semibold text-[#121415] tracking-tight mb-16">
              Trusted by those who know.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {[
                {
                  text: "Elara completely changed how I book my appointments. It is so clean, calm, and incredibly intuitive.",
                  author: "Sarah J.",
                  role: "Verified Client",
                },
                {
                  text: "The most beautifully designed booking platform I've ever used. Zero friction from search to confirmation.",
                  author: "Michael T.",
                  role: "Verified Client",
                },
                {
                  text: "I love being able to see my stylist's exact schedule without texting them back and forth. Pure elegance.",
                  author: "David L.",
                  role: "Verified Client",
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className="p-8 rounded-[2rem] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-[#8A2532] text-[#8A2532]"
                      />
                    ))}
                  </div>
                  <p className="text-[#121415] font-medium text-lg mb-8 leading-relaxed">
                    "{t.text}"
                  </p>
                  <div>
                    <p className="font-semibold text-[#121415]">{t.author}</p>
                    <p className="text-sm text-[#4A4E51] flex items-center gap-1 mt-1 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-[#4A6B53]" />
                      {t.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-32 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-semibold text-[#121415] tracking-tight mb-12 text-center">
              Frequently asked questions
            </h2>

            <div className="divide-y divide-[#DCDCDA]">
              {[
                {
                  q: "Is Elara free to use?",
                  a: "Yes, booking through Elara is completely free for clients. You only pay for the services you book directly at the venue.",
                },
                {
                  q: "Can I cancel or reschedule my appointment?",
                  a: "Absolutely. You can manage all your bookings directly from your account dashboard, subject to the venue's policy.",
                },
                {
                  q: "Are the reviews authentic?",
                  a: "We only allow reviews from clients who have actually completed an appointment at the venue.",
                },
                {
                  q: "How do I list my business on Elara?",
                  a: "If you own a premium salon or clinic, you can register for our Business Portal to manage operations on the Elara network.",
                },
              ].map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
      <SignupRoleModal isOpen={signupModalOpen} onClose={() => setSignupModalOpen(false)} />
    </div>
  );
}