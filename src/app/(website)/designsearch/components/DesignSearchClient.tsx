"use client";
import { useI18nStore } from "@/stores/i18nStore";
import { useI18n } from "@/hooks/useI18n";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search as SearchIcon,
  MapPin,
  Star,
  Clock,
  SlidersHorizontal,
  ChevronDown,
  BadgeCheck,
  Navigation,
  Heart,
  Plus,
  Minus,
  Flame,
  Timer,
  Menu,
  X,
  ChevronRight,
  SearchX,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { AdaptedLogo } from "@/components/AdaptedLogo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import useSearch from "@/hooks/useSearch";
import Avatar from "@/components/ui/Avatar";
import { DynamicMap } from "@/components/map";
import { Outfit } from "next/font/google";

const customFont = Outfit({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

// ─── Animations ──────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "Barbershop", "Beauty Salon", "Pet Grooming"];

const SORT_OPTIONS = [
  { id: "relevance", label: "By relevance", shortLabel: "relevance" },
  { id: "punctual",  label: "Most punctual (New)", shortLabel: "most punctual" },
  { id: "rating",    label: "By rating",    shortLabel: "rating" },
  { id: "distance",  label: "By distance",  shortLabel: "distance" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function EmptyState({ query }: { query?: string }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white border border-[#DCDCDA] rounded-2xl">
      <div className="w-14 h-14 rounded-2xl bg-[#8A2532]/10 text-[#8A2532] flex items-center justify-center mb-6">
        <SearchX className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-semibold text-[#121415] tracking-tight mb-2">{t("app.t1")}</h3>
      <p className="text-[#4A4E51] font-medium leading-relaxed max-w-sm">
        {query
          ? `No results for "${query}". Try adjusting your search or clearing the filters.`
          : t("extra.t517")}
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DesignSearchClient({ initialVenues }: { initialVenues: any[] }) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [interceptedVenue, setInterceptedVenue] = useState<any | null>(null);
  useEffect(() => setMounted(true), []);

  const {
    filtered,
    totalCount,
    hasMore,
    loadMore,
    isVenuesLoading,
    currentUser,
    savedIds,
    toggleSaved,
    isSavedOnly,
    toggleSavedFilter,
    isOpenNowOnly,
    toggleOpenNow,
    searchQuery, setSearchQuery,
    locationQuery, setLocationQuery,
    activeCategory, setActiveCategory,
    sortBy, setSortBy,
    sortOpen, setSortOpen,
  } = useSearch(initialVenues);

  const accountLink = currentUser?.profile?.role === "business" ? "/dashboard" : "/account";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileView, setMobileView]         = useState<"list" | "map">("list");
  const [mobileSearchQuery,   setMobileSearchQuery]   = useState("");
  const [mobileLocationQuery, setMobileLocationQuery] = useState("");

  // Sort dropdown — close on outside click
  const sortRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSortOpen]);


  useLockBodyScroll(mobileMenuOpen);

  // ─── Skeleton loader ───────────────────────────────────────────────────────
  if (!mounted || isVenuesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ECECEA]">
        <div className="w-8 h-8 border-4 border-[#8A2532] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen flex flex-col bg-[#D8DADC] font-sans selection:bg-[#151719] selection:text-white overflow-x-hidden text-[#0B0C0D] relative ${customFont.className}`}>

      {/* GLOBAL NOISE */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.02]"
        style={{ backgroundImage: `url("data:image/png;base64,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")`, backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }}
      />

      {/* ── Floating Navbar ─────────────────────────────────────────────────────── */}
      <div className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 md:px-6 pointer-events-none">
        <nav className="bg-[#F3F4F4]/85 backdrop-blur-2xl border border-white/60 rounded-full p-2 h-[76px] flex items-center justify-between w-full max-w-[1352px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] pointer-events-auto transition-all relative">
          <div className="flex-1 flex justify-start pl-4">
            <Link href="/design" className="outline-none rounded-full group">
              <AdaptedLogo />
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-[2] max-w-2xl items-center bg-white border border-[#8D9195]/20 rounded-full p-1.5 transition-all duration-300 hover:border-[#0B0C0D] focus-within:border-[#0B0C0D] hover:shadow-[0_4px_20px_-10px_rgba(11,12,13,0.1)] focus-within:shadow-[0_4px_20px_-10px_rgba(11,12,13,0.1)] min-w-0">
            {/* Search Input */}
            <div className="flex-1 relative flex items-center min-w-0 group h-11">
              <SearchIcon className="absolute left-4 w-5 h-5 text-[#8D9195] group-focus-within:text-[#0B0C0D] transition-colors shrink-0 pointer-events-none" />
              <input
                id="desktop_search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder=" "
                className="peer w-full h-full bg-transparent outline-none font-medium text-[15px] text-[#0B0C0D] pl-11 pr-10 py-2.5 placeholder-[#8D9195]"
              />
              <label
                htmlFor="desktop_search"
                className="absolute left-11 top-1/2 -translate-y-1/2 text-[#8D9195] text-[15px] font-medium pointer-events-none peer-[:not(:placeholder-shown)]:opacity-0"
              >{t("app.t2")}</label>
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 p-1 text-[#8D9195] hover:text-[#0B0C0D] rounded-full hover:bg-[#F3F4F4] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0B0C0D] z-20 active:scale-95"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="w-[2px] h-6 bg-[#8D9195]/20 shrink-0" />

            {/* Location Input */}
            <div className="flex-1 relative flex items-center min-w-0 group h-11">
              <MapPin className="absolute left-4 w-5 h-5 text-[#8D9195] group-focus-within:text-[#0B0C0D] transition-colors shrink-0 pointer-events-none" />
              <input
                id="desktop_location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder=" "
                className="peer w-full h-full bg-transparent outline-none font-medium text-[15px] text-[#0B0C0D] pl-11 pr-10 py-2.5 placeholder-[#8D9195]"
              />
              <label
                htmlFor="desktop_location"
                className="absolute left-11 top-1/2 -translate-y-1/2 text-[#8D9195] text-[15px] font-medium pointer-events-none peer-[:not(:placeholder-shown)]:opacity-0"
              >
                {t("app.t3")}</label>
              <AnimatePresence>
                {locationQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setLocationQuery("")}
                    className="absolute right-3 p-1 text-[#8D9195] hover:text-[#0B0C0D] rounded-full hover:bg-[#F3F4F4] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0B0C0D] z-20 active:scale-95"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <button className="px-6 py-2.5 bg-[#151719] text-white text-[14px] font-bold tracking-wide rounded-full shadow-[0_10px_30px_-10px_rgba(21,23,25,0.4)] hover:scale-105 active:scale-95 transition-all shrink-0">
              {t("app.t0")}
            </button>
          </div>

          {/* Desktop Auth / Account */}
          <div className="hidden lg:flex flex-1 items-center justify-end pr-2 gap-4 shrink-0">
            {currentUser ? (
              (() => {
                const name =
                  (currentUser?.profile?.full_name as string) ||
                  (currentUser?.name as string) ||
                  (currentUser?.email as string)?.split("@")[0] ||
                  t("extra.t518");
                const avatarSrc = (currentUser?.profile?.avatar_url as string) || null;
                return (
                  <Link
                    href={accountLink}
                    className="relative w-11 h-11 shrink-0 flex items-center justify-end group outline-none focus-visible:ring-2 focus-visible:ring-[#0B0C0D] rounded-full"
                    aria-label={`Go to account — ${name}`}
                  >
                    <div className="relative flex items-center justify-end w-full h-full transition-transform duration-300 group-">
                      
                      <div className="absolute right-4 h-9 bg-white border border-[#8D9195]/20 rounded-l-full flex items-center max-w-0 opacity-0 overflow-hidden group-hover:max-w-[200px] group-hover:opacity-100 transition-all duration-500 ease-in-out z-0 shadow-sm pointer-events-none">
                        <span className="text-[14px] font-bold text-[#0B0C0D] whitespace-nowrap pl-4 pr-9 block">
                          {name}
                        </span>
                      </div>

                      {/* Avatar (Stays on top) */}
                      <Avatar
                        name={name}
                        src={avatarSrc}
                        size="ml"
                        ring
                        className="relative z-10 shadow-sm group-hover:shadow-md transition-shadow"
                      />
                      
                    </div>
                  </Link>
                );
              })()
            ) : (

              <div className="flex items-center gap-3">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.92 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                  <Link href="/designlogin" className="px-6 py-3 text-[14px] font-bold tracking-wide text-[#0B0C0D] bg-white border border-[#8D9195]/20 text-center rounded-full shadow-sm cursor-pointer block">{t("app.t4")}</Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.92 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                  <Link href="/designsignup" className="px-8 py-3 bg-[#151719] text-white text-[14px] font-bold tracking-wide rounded-full shadow-lg shadow-[#151719]/10 block cursor-pointer block">{t("app.t5")}</Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-[#121415] shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-full active:scale-95 transition-transform"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#ECECEA] border-b border-[#DCDCDA] overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                <div className="flex flex-col gap-3 w-full mb-4">
                  {/* Mobile Search */}
                  <div className="relative group w-full shrink-0">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A4E51] group-focus-within:text-[#121415] z-10 pointer-events-none" />
                    <input
                      id="mobile_search"
                      value={mobileSearchQuery}
                      onChange={(e) => setMobileSearchQuery(e.target.value)}
                      placeholder=" "
                      className="peer w-full pl-11 pr-10 py-3.5 bg-white border border-[#DCDCDA] rounded-2xl text-sm text-[#121415] font-medium focus:border-[#121415] outline-none"
                    />
                    <label htmlFor="mobile_search" className="absolute left-11 top-1/2 -translate-y-1/2 text-[#4A4E51] text-sm font-medium pointer-events-none peer-[:not(:placeholder-shown)]:opacity-0">{t("app.t2")}</label>
                    <AnimatePresence>
                      {mobileSearchQuery && (
                        <motion.button
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          onClick={() => setMobileSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#4A4E51] z-20 outline-none active:scale-95"
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Mobile Location */}
                  <div className="relative group w-full shrink-0">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A4E51] group-focus-within:text-[#121415] z-10 pointer-events-none" />
                    <input
                      id="mobile_location"
                      value={mobileLocationQuery}
                      onChange={(e) => setMobileLocationQuery(e.target.value)}
                      placeholder=" "
                      className="peer w-full pl-11 pr-10 py-3.5 bg-white border border-[#DCDCDA] rounded-2xl text-sm text-[#121415] font-medium focus:border-[#121415] outline-none"
                    />
                    <label htmlFor="mobile_location" className="absolute left-11 top-1/2 -translate-y-1/2 text-[#4A4E51] text-sm font-medium pointer-events-none peer-[:not(:placeholder-shown)]:opacity-0">{t("app.t6")}</label>
                    <AnimatePresence>
                      {mobileLocationQuery && (
                        <motion.button
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          onClick={() => setMobileLocationQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#4A4E51] z-20 outline-none active:scale-95"
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  <Button
                    variant="primary"
                    shape="pill"
                    className="w-full mt-1 active:scale-95 bg-[#151719] text-white"
                    onClick={() => {
                      setSearchQuery(mobileSearchQuery);
                      setLocationQuery(mobileLocationQuery);
                      setMobileMenuOpen(false);
                    }}
                  >{t("app.t0")}</Button>
                </div>

                <div className="h-[1px] bg-[#DCDCDA]/40 my-2" />

                {currentUser ? (
                  <Link href={accountLink} className="text-[15px] font-bold text-[#0B0C0D]" onClick={() => setMobileMenuOpen(false)}>
                    {t("extra.t518")}</Link>
                ) : (
                  <>
                    <Link href="/designlogin"  className="text-[15px] font-bold text-[#0B0C0D]" onClick={() => setMobileMenuOpen(false)}>{t("app.t4")}</Link>
                    <Link href="/designsignup" className="text-[15px] font-bold text-[#0B0C0D]" onClick={() => setMobileMenuOpen(false)}>{t("app.t5")}</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <div className="w-full flex justify-center px-4 md:px-6"><main className="flex-1 pt-[100px] lg:pt-[120px] max-w-[1352px] w-full relative z-10 flex flex-col pb-20">

        {/* ── Sub-header (Filters & Categories) ────────────────────────────── */}
        <div className="sticky top-[80px] lg:top-[100px] z-40 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-2">
          
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar flex-1 w-full mask-linear-right pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? "All" : cat)}
                className={`whitespace-nowrap px-6 py-2.5 text-[14px] font-bold rounded-full transition-all duration-200 outline-none shadow-sm shrink-0 ${
                  activeCategory === cat
                    ? "bg-[#0B0C0D] text-white"
                    : "bg-white/60 backdrop-blur-md text-[#0B0C0D] hover:bg-white border border-white/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Actions & Sort */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Filters */}
            <div className="hidden md:flex items-center gap-2 mr-2">
              <button
                onClick={toggleSavedFilter}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[14px] font-bold transition-colors shadow-sm ${
                  isSavedOnly
                    ? "bg-[#0B0C0D] text-white"
                    : "bg-white/60 backdrop-blur-md text-[#0B0C0D] hover:bg-white border border-white/60"
                }`}
              >
                <Heart className={`w-4 h-4 ${isSavedOnly ? "fill-white" : ""}`} /> {t("app.t7")}
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-6 py-2.5 bg-white/60 backdrop-blur-md border border-white/60 rounded-full text-[#0B0C0D] text-[14px] font-bold hover:bg-white transition-colors shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">{t("app.t9")}</span>
                <span className="sm:hidden">{SORT_OPTIONS.find((o) => o.id === sortBy)?.shortLabel}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-3xl border border-white/60 rounded-2xl shadow-xl overflow-hidden py-1 z-50"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => { setSortBy(option.id as any); setSortOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors flex items-center justify-between ${
                          sortBy === option.id ? "text-[#0B0C0D] bg-[#F3F4F4]" : "text-[#8D9195] hover:bg-[#F3F4F4] hover:text-[#0B0C0D]"
                        }`}
                      >
                        {option.label}
                        {sortBy === option.id && <BadgeCheck className="w-4 h-4 text-[#0B0C0D]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Map Toggle */}
            <button
              onClick={() => setMobileView(mobileView === "list" ? "map" : "list")}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-[#0B0C0D] text-white rounded-full text-[13px] font-bold shadow-sm active:scale-95 transition-all"
            >
              {mobileView === "list" ? <MapPin className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              {mobileView === "list" ? t("extra.t520") : t("extra.t521")}
            </button>
          </div>
        </div>

        {/* Venues + Map Grid */}
        <div className="w-full flex flex-col lg:flex-row gap-8 relative flex-1">

          {/* Left: List */}
          <div className={`${mobileView === "list" ? "flex" : "hidden"} lg:flex flex-col w-full lg:w-[55%] xl:w-[60%] shrink-0 h-full`}>

            {/* Active filter hint */}
            {(isSavedOnly || isOpenNowOnly) && (
              <div className="hidden flex-wrap gap-2 mb-4">
                {isSavedOnly && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121415] text-white text-xs font-semibold rounded-full">
                    <Heart className="w-3 h-3 fill-white" /> {t("extra.t521")}<button onClick={toggleSavedFilter} className="ml-1 hover:opacity-70 active:scale-95 transition-all">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {isOpenNowOnly && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121415] text-white text-xs font-semibold rounded-full">
                    <Clock className="w-3 h-3" />{t("app.t10")}<button onClick={toggleOpenNow} className="ml-1 hover:opacity-70 active:scale-95 transition-all">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {totalCount === 0 ? (
              <div className="mt-2 lg:mt-0 pb-10">
                <EmptyState query={searchQuery.trim()} />
              </div>
            ) : (
              <motion.div
                initial="hidden" animate="show" variants={staggerContainer}
                className="flex flex-col gap-6 pb-10 mt-2 lg:mt-0"
              >
                {filtered.map((venue) => {
                  const isSaved = savedIds.has(venue.id);
                  return (
                    <motion.div key={venue.id} variants={fadeUp}>
                      <div className="group bg-white/80 backdrop-blur-3xl rounded-[32px] border border-white/60 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer flex flex-col sm:flex-row h-auto overflow-hidden p-3 relative">
                        {/* Image */}
                        <div className="relative w-full sm:w-[280px] md:w-[320px] h-[240px] sm:h-auto shrink-0 overflow-hidden">
                          <div className="w-full h-full rounded-[24px] overflow-hidden relative bg-[#D8DADC]">
                            {venue.image && (
                              <img
                                src={venue.image}
                                alt={venue.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0D]/60 via-transparent to-transparent pointer-events-none" />

                            <div className="absolute top-3 left-3 flex flex-col gap-2 items-start max-w-[90%]">
                              {venue.badges.includes("Popular") && (
                                <span className="bg-white/95 backdrop-blur-md text-[#0B0C0D] px-3 py-1.5 rounded-full text-[12px] font-bold shadow-sm flex items-center gap-1.5">
                                  <Flame className="w-3.5 h-3.5 text-[#0B0C0D]" /> {t("app.t11")}
                                </span>
                              )}
                              <span className="bg-[#151719]/90 text-white backdrop-blur-md px-3 py-1.5 rounded-full text-[12px] font-bold shadow-sm flex items-center gap-1.5">
                                <Timer className="w-3.5 h-3.5 text-white" />
                                {venue.badges.find((b) => b.includes("time")) ?? "Verified"}
                              </span>
                              
                              {venue.is_paused ? (
                                <div className="relative group/tooltip inline-block">
                                  <span className="bg-[#8A2532] text-white backdrop-blur-md px-3 py-1.5 rounded-full text-[12px] font-bold shadow-sm flex items-center gap-1.5 cursor-pointer">
                                    <Lock className="w-3.5 h-3.5 text-white" /> {t("app.t12")}
                                  </span>
                                  <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-white rounded-xl shadow-lg border border-[#DCDCDA] z-30 text-left opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible translate-y-1 group-hover/tooltip:translate-y-0 transition-all duration-200 pointer-events-none">
                                    <p className="text-xs font-bold text-[#0B0C0D] mb-1 flex items-center gap-1.5">
                                      <AlertCircle className="w-3.5 h-3.5 text-[#0B0C0D]" /> {t("extra.t522")}</p>
                                    <p className="text-[11px] text-[#8D9195] font-medium leading-relaxed">
                                      {t("extra.t523")}</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="relative group/tooltip inline-block">
                                  <span className="bg-[#059669] text-white backdrop-blur-md px-3 py-1.5 rounded-full text-[12px] font-bold shadow-sm flex items-center gap-1.5 cursor-pointer">
                                    <Unlock className="w-3.5 h-3.5 text-white" /> {t("app.t13")}
                                  </span>
                                  <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-white rounded-xl shadow-lg border border-[#DCDCDA] z-30 text-left opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible translate-y-1 group-hover/tooltip:translate-y-0 transition-all duration-200 pointer-events-none">
                                    <p className="text-xs font-bold text-[#0B0C0D] mb-1 flex items-center gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0B0C0D]" /> {t("extra.t524")}</p>
                                    <p className="text-[11px] text-[#8D9195] font-medium leading-relaxed">
                                      {t("extra.t525")}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* ── Save button ── */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleSaved(venue.id);
                              }}
                              aria-label={isSaved ? "Remove from saved" : "Save venue"}
                              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-300 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#0B0C0D] focus-visible:ring-offset-2"
                            >
                              <Heart
                                className={`w-4 h-4 transition-all duration-200 ${
                                  isSaved
                                    ? "fill-[#8A2532] text-[#8A2532]"
                                    : "text-[#8D9195] hover:text-[#8A2532]"
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between min-w-0 h-full">
                          <div className="min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1 w-full">
                                  <h3 className="font-bold text-[#0B0C0D] text-[22px] tracking-tight group-hover:text-[#151719] transition-colors">
                                    {venue.name}
                                  </h3>
                                  <BadgeCheck className="w-5 h-5 text-[#0B0C0D] shrink-0" />
                                </div>
                                <div className="flex items-center gap-2 text-[14px] font-bold text-[#8D9195] flex-wrap mt-1.5">
                                  <span className="text-[#0B0C0D]">{venue.category}</span>
                                  <span className="shrink-0 text-[#8D9195]/40">•</span>
                                  <span className="text-[#0B0C0D] shrink-0">{venue.price}</span>
                                </div>
                              </div>

                              <div className={`flex flex-col justify-center shrink-0 bg-[#F3F4F4]/80 backdrop-blur-md px-3 py-2.5 rounded-2xl border border-white/60 min-w-[68px] min-h-[56px] items-center gap-1.5 shadow-sm`}>
                                {venue.reviews > 0 ? (
                                  <>
                                      <div className="flex items-center gap-1.5 w-full justify-between">
                                        <Star className="w-4 h-4 fill-[#F5A623] text-[#F5A623] shrink-0" />
                                        <span className="font-bold text-[#0B0C0D] text-[14px]">{venue.rating}</span>
                                      </div>
                                      <div className="w-full h-[1px] bg-[#8D9195]/20" />
                                      <div className="flex items-center gap-1.5 w-full justify-between">
                                        <Users className="w-4 h-4 text-[#8D9195] shrink-0" />
                                        <span className="font-bold text-[#8D9195] text-[14px]">{venue.reviews}</span>
                                      </div>
                                  </>
                                ) : (
                                  <span className="font-bold text-[#8D9195] text-[12px] uppercase tracking-wide">{t("app.t14")}</span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 mt-4 text-[#8D9195] text-[14px] font-bold flex-wrap">
                              <MapPin className="w-4 h-4 shrink-0 text-[#0B0C0D]" />
                              <span>{venue.address}</span>
                              <span className="text-[#8D9195]/40 hidden sm:inline shrink-0">•</span>
                              <span className="shrink-0 text-[#0B0C0D] hidden sm:inline">{venue.distance}</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-5 max-w-full">
                              {venue.tags.map((tag) => (
                                <span key={tag} className="bg-[#F3F4F4]/80 backdrop-blur-md text-[#8D9195] px-4 py-1.5 rounded-full text-[13px] font-bold border border-white/60">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mt-6 pt-5 border-t border-[#8D9195]/20 flex flex-col xl:flex-row xl:items-center justify-between gap-4 min-w-0">
                            <div className="flex flex-col min-w-0 flex-1 pr-2">
                              <span className="text-[11px] uppercase font-bold text-[#8D9195] mb-1">{useI18nStore.getState().t("extra.t215")}</span>
                              <span className="text-[15px] font-bold text-[#0B0C0D]">{venue.time}</span>
                            </div>

                            {venue.is_paused ? (
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setInterceptedVenue(venue);
                                }}
                                className="w-full xl:w-auto px-6 py-4 bg-[#151719] text-white text-[14px] font-bold rounded-full shadow-[0_10px_30px_-10px_rgba(21,23,25,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                              >
                                {t("app.t15")} <ChevronRight className="w-4 h-4" />
                              </button>
                            ) : (
                              <Link
                                href={`/booking?id=${venue.id}`}
                                className="w-full xl:w-auto px-6 py-4 bg-[#151719] text-white text-[14px] font-bold rounded-full shadow-[0_10px_30px_-10px_rgba(21,23,25,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 outline-none"
                              >
                                {t("app.t15")} <ChevronRight className="w-4 h-4" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Load More */}
            {hasMore && (
              <div className="mb-16 flex justify-center">
                <button 
                  className="px-8 py-4 bg-white/80 backdrop-blur-3xl rounded-full border border-white/60 text-[#0B0C0D] font-bold text-[15px] shadow-sm hover:bg-white active:scale-95 transition-all outline-none" 
                  onClick={loadMore}
                >
                  {t("extra.t526")}
                </button>
              </div>
            )}
          </div>

          {/* Right: Interactive Virtual Map */}
          <div className={`${mobileView === "map" ? "block" : "hidden"} lg:block w-full lg:w-[45%] xl:w-[40%] relative mt-2 lg:mt-0`}>
            <div className="lg:sticky lg:top-[160px] h-[500px] lg:h-[calc(100vh-180px)] min-h-[500px] w-full rounded-[32px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white/60 bg-white/80 backdrop-blur-3xl p-1.5">
              <div className="w-full h-full rounded-[24px] overflow-hidden">
                <DynamicMap venues={filtered} />
              </div>
            </div>
          </div>

        </div>
      </main>
      </div>

      {/* Intercept Booking Modal */}
      <AnimatePresence>
        {interceptedVenue && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0B0C0D]/40 backdrop-blur-md"
              onClick={() => setInterceptedVenue(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white/90 backdrop-blur-3xl rounded-[32px] p-6 shadow-2xl border border-white/60 overflow-hidden"
            >
              <button
                onClick={() => setInterceptedVenue(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#F3F4F4] text-[#8D9195] hover:text-[#0B0C0D] hover:bg-white transition-colors border border-white/60"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-[#F3F4F4] flex items-center justify-center mb-5 border border-white/60 shadow-sm">
                <AlertCircle className="w-6 h-6 text-[#0B0C0D]" />
              </div>

              <h2 className="text-[22px] font-bold text-[#0B0C0D] mb-2 tracking-tight">
                {t("extra.t527")}</h2>
              <p className="text-[14px] font-bold text-[#8D9195] leading-relaxed mb-6">
                <strong className="text-[#0B0C0D]">{interceptedVenue.name}</strong> {t("extra.t528")}</p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="flex-1 px-6 py-4 bg-white/60 text-[#0B0C0D] text-[14px] font-bold rounded-full border border-white/60 hover:bg-white active:scale-95 transition-all outline-none"
                  onClick={() => setInterceptedVenue(null)}
                >{t("app.t16")}</button>
                <Link href={`/booking?id=${interceptedVenue.id}`} className="flex-1">
                  <button className="w-full px-6 py-4 bg-[#151719] text-white text-[14px] font-bold rounded-full shadow-[0_10px_30px_-10px_rgba(21,23,25,0.4)] hover:scale-105 active:scale-95 transition-all outline-none" onClick={() => setInterceptedVenue(null)}>{t("app.t17")}</button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}




