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
import ElaraLogo from "@/components/ElaraLogo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import useSearch from "@/hooks/useSearch";
import Avatar from "@/components/ui/Avatar";
import { DynamicMap } from "@/components/map";


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

const CATEGORIES = ["All", "Barbershop", "Beauty Salon", "Manicure"];

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

export default function SearchClient({ initialVenues }: { initialVenues: any[] }) {
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
    <div className="min-h-screen flex flex-col bg-[#ECECEA] font-sans selection:bg-[#8A2532] selection:text-white overflow-x-hidden text-[#121415]">

      {/* ── Fixed Navbar ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#ECECEA]/80 backdrop-blur-xl border-b border-[#DCDCDA] h-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4 w-full">
          <ElaraLogo />

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-2xl items-center bg-white border border-[#DCDCDA] rounded-full p-1.5 transition-all duration-300 hover:border-[#121415] focus-within:border-[#121415] min-w-0">
            {/* Search Input */}
            <div className="flex-1 relative flex items-center min-w-0 group h-11">
              <SearchIcon className="absolute left-4 w-5 h-5 text-[#4A4E51] group-focus-within:text-[#121415] transition-colors shrink-0 pointer-events-none" />
              <input
                id="desktop_search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder=" "
                className="peer w-full h-full bg-transparent outline-none font-medium text-sm text-[#121415] pl-11 pr-10 py-2.5"
              />
              <label
                htmlFor="desktop_search"
                className="absolute left-11 top-1/2 -translate-y-1/2 text-[#4A4E51] text-sm font-medium pointer-events-none peer-[:not(:placeholder-shown)]:opacity-0"
              >{t("app.t2")}</label>
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 p-1 text-[#4A4E51] hover:text-[#121415] rounded-full hover:bg-[#F5F5F4] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415] z-20 active:scale-95"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-6 bg-[#DCDCDA] shrink-0" />

            {/* Location Input */}
            <div className="flex-1 relative flex items-center min-w-0 group h-11">
              <MapPin className="absolute left-4 w-5 h-5 text-[#4A4E51] group-focus-within:text-[#121415] transition-colors shrink-0 pointer-events-none" />
              <input
                id="desktop_location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder=" "
                className="peer w-full h-full bg-transparent outline-none font-medium text-sm text-[#121415] pl-11 pr-10 py-2.5"
              />
              <label
                htmlFor="desktop_location"
                className="absolute left-11 top-1/2 -translate-y-1/2 text-[#4A4E51] text-sm font-medium pointer-events-none peer-[:not(:placeholder-shown)]:opacity-0"
              >
                {t("app.t3")}</label>
              <AnimatePresence>
                {locationQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setLocationQuery("")}
                    className="absolute right-3 p-1 text-[#4A4E51] hover:text-[#121415] rounded-full hover:bg-[#F5F5F4] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415] z-20 active:scale-95"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <Button variant="primary" size="sm" shape="pill" className="px-6 py-2.5 shrink-0">{t("app.t0")}</Button>
          </div>

          {/* Desktop Auth / Account */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
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
                    // Fixed 44x44 container guarantees the navbar search input NEVER moves
                    className="relative w-11 h-11 shrink-0 flex items-center justify-end group outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-full"
                    aria-label={`Go to account — ${name}`}
                  >
                    <div className="relative flex items-center justify-end w-full h-full transition-transform duration-300 group-">
                      
                      {/* Drawer (slides out from underneath to the left) */}
                      <div className="absolute right-4 h-9 bg-white border border-[#DCDCDA] rounded-l-full flex items-center max-w-0 opacity-0 overflow-hidden group-hover:max-w-[200px] group-hover:opacity-100 transition-all duration-500 ease-in-out z-0 shadow-sm pointer-events-none">
                        {/* pr-9 ensures text clears the hidden part under the avatar */}
                        <span className="text-sm font-semibold text-[#121415] whitespace-nowrap pl-4 pr-9 block">
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

              <>
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-sm font-medium text-[#121415] border border-[#DCDCDA] bg-white hover:bg-[#F5F5F4] rounded-full transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center"
                >{t("app.t4")}</Link>
                <Link href="/signup" className="outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-full flex items-center justify-center">
                  <Button variant="secondary" size="sm" shape="pill" className="px-6 py-2.5 shrink-0">{t("app.t5")}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-[#121415] shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-full active:scale-95 transition-transform"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

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
                    className="w-full mt-1 active:scale-95"
                    onClick={() => {
                      setSearchQuery(mobileSearchQuery);
                      setLocationQuery(mobileLocationQuery);
                      setMobileMenuOpen(false);
                    }}
                  >{t("app.t0")}</Button>
                </div>

                <div className="h-px bg-[#DCDCDA] my-2" />

                {currentUser ? (
                  <Link href={accountLink} className="text-lg font-medium text-[#121415]" onClick={() => setMobileMenuOpen(false)}>
                    {t("extra.t518")}</Link>
                ) : (
                  <>
                    <Link href="/login"  className="text-lg font-medium text-[#121415]" onClick={() => setMobileMenuOpen(false)}>{t("app.t4")}</Link>
                    <Link href="/signup" className="text-lg font-medium text-[#8A2532]" onClick={() => setMobileMenuOpen(false)}>{t("app.t5")}</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <main className="flex-1 pt-20">

        {/* Filter Bar (sticky) */}
        <div className="bg-[#ECECEA] border-b border-[#DCDCDA] sticky top-20 z-40 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-3">

            {/* Left: Saved + Category filters */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar flex-1 pr-4 py-3 -my-3">

              {/* Saved button */}
              <Button
                onClick={toggleSavedFilter}
                variant={isSavedOnly ? "secondary" : "outline"}
                shape="pill"
                className="px-4 sm:px-5"
              >
                <Heart className={`w-4 h-4 transition-all ${isSavedOnly ? "fill-white" : ""}`} />
                <span>{t("app.t7")}</span>
                {savedIds.size > 0 && (
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full leading-none ${isSavedOnly ? "bg-white/20 text-white" : "bg-[#8A2532]/10 text-[#8A2532]"}`}>
                    {savedIds.size}
                  </span>
                )}
              </Button>

              <div className="w-px h-6 bg-[#DCDCDA] shrink-0 mx-1" />

              {/* Category filters */}
              {CATEGORIES.map((filter) => (
                <Button
                  key={filter}
                  onClick={() => setActiveCategory(filter)}
                  variant={activeCategory === filter ? "secondary" : "outline"}
                  shape="pill"
                  className="px-4 sm:px-5"
                >
                  {filter}
                </Button>
              ))}
            </div>

            {/* Right: count + Open Now + Sort */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 border-l border-[#DCDCDA] pl-3 sm:pl-4">
              <span className="text-[#121415] font-semibold text-sm tracking-tight px-1 hidden md:block">
                {totalCount} {totalCount === 1 ? t("extra.t519") : t("extra.t408")}
              </span>

              {/* Open Now button */}
              <Button
                onClick={toggleOpenNow}
                variant={isOpenNowOnly ? "secondary" : "outline"}
                shape="pill"
                className="px-4"
              >
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">{t("app.t8")}</span>
              </Button>

              {/* Sort dropdown */}
              <div className="relative" ref={sortRef}>
                <Button
                  onClick={() => setSortOpen(!sortOpen)}
                  variant="outline"
                  shape="pill"
                  className="px-4 sm:px-5"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#8A2532]" />
                  <span className="hidden sm:inline">
                    {t("extra.t520")}{SORT_OPTIONS.find((o) => o.id === sortBy)?.shortLabel ?? "relevance"}
                  </span>
                  <span className="sm:hidden">{t("app.t9")}</span>
                  <ChevronDown className={`w-4 h-4 text-[#4A4E51] transition-transform duration-300 ${sortOpen ? "rotate-180" : ""}`} />
                </Button>

                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#DCDCDA] overflow-hidden z-[99999] py-2"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => { setSortBy(option.id); setSortOpen(false); }}
                          className={`w-full text-left px-5 py-3 text-[15px] font-semibold transition-colors hover:bg-[#F5F5F4] ${
                            sortBy === option.id ? "text-[#8A2532]" : "text-[#4A4E51]"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>

        {/* Venues + Map Grid */}
        <div className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto py-6 w-full flex flex-col lg:flex-row gap-8 relative">

          {/* Mobile Map Toggle */}
          <div className="lg:hidden flex items-center bg-white border border-[#DCDCDA] rounded-full p-1 shadow-sm mb-2 w-max mx-auto shrink-0 z-20">
            {(["list", "map"] as const).map((v) => (
              <Button
                key={v}
                onClick={() => setMobileView(v)}
                variant={mobileView === v ? "secondary" : "ghost"}
                shape="pill"
                className="px-6 py-2 capitalize border-transparent"
              >
                {v}
              </Button>
            ))}
          </div>

          {/* Left: Venue Cards */}
          <div className={`${mobileView === "list" ? "flex" : "hidden"} lg:flex w-full lg:w-[55%] xl:w-[60%] flex-col`}>

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
                      <Card className="group hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.09)] transition-all duration-300 cursor-pointer flex flex-col sm:flex-row h-auto">
                        {/* Image */}
                        <div className="relative w-full sm:w-[280px] md:w-[320px] h-[240px] sm:h-auto shrink-0 overflow-hidden p-3 pb-0 sm:pb-3 sm:pr-0">
                          <div className="w-full h-full rounded-2xl overflow-hidden relative bg-[#DCDCDA]">
                            {venue.image && (
                              <img
                                src={venue.image}
                                alt={venue.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121415]/60 via-transparent to-transparent pointer-events-none" />

                            <div className="absolute top-3 left-3 flex flex-col gap-2 items-start max-w-[90%]">
                              {venue.badges.includes("Popular") && (
                                <Badge variant="brand" icon={Flame} className="bg-white/95 backdrop-blur-md">{t("app.t11")}</Badge>
                              )}
                              <Badge variant="dark" icon={Timer}>
                                {venue.badges.find((b) => b.includes("time")) ?? "Verified"}
                              </Badge>
                              {venue.is_paused ? (
                                <div className="relative group inline-block">
                                  <Badge variant="dark" icon={Lock} className="!bg-[#8A2532] !text-white backdrop-blur-md border-none cursor-pointer hover:!bg-[#8A2532]/90">{t("app.t12")}</Badge>
                                  <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-white rounded-xl shadow-lg border border-[#DCDCDA] z-[60] text-left opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-1 group-hover:translate-y-0 transition-all duration-200 pointer-events-none">
                                    <p className="text-xs font-semibold text-[#121415] mb-1 flex items-center gap-1.5">
                                      <AlertCircle className="w-3.5 h-3.5 text-[#8A2532]" /> {t("extra.t522")}</p>
                                    <p className="text-[11px] text-[#4A4E51] leading-relaxed">
                                      {t("extra.t523")}</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="relative group inline-block">
                                  <Badge variant="dark" icon={Unlock} className="!bg-[#4a6b53] !text-white backdrop-blur-md border-none cursor-pointer hover:!bg-[#4a6b53]/90">{t("app.t13")}</Badge>
                                  <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-white rounded-xl shadow-lg border border-[#DCDCDA] z-[60] text-left opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-1 group-hover:translate-y-0 transition-all duration-200 pointer-events-none">
                                    <p className="text-xs font-semibold text-[#121415] mb-1 flex items-center gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4a6b53]" /> {t("extra.t524")}</p>
                                    <p className="text-[11px] text-[#4A4E51] leading-relaxed">
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
                              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-300 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2"
                            >
                              <Heart
                                className={`w-4 h-4 transition-all duration-200 ${
                                  isSaved
                                    ? "fill-[#8A2532] text-[#8A2532]"
                                    : "text-[#4A4E51] hover:text-[#8A2532]"
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
                                  <h3 className="font-semibold text-[#121415] text-xl tracking-tight group-hover:text-[#8A2532] transition-colors">
                                    {venue.name}
                                  </h3>
                                  <BadgeCheck className="w-5 h-5 text-[#8A2532] shrink-0" />
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-[#4A4E51] flex-wrap">
                                  <span className="text-[#121415]">{venue.category}</span>
                                  <span className="shrink-0">·</span>
                                  <span className="text-[#121415] shrink-0">{venue.price}</span>
                                </div>
                              </div>

                                <div className={`flex flex-col justify-center shrink-0 bg-[#F5F5F4] px-3 py-2.5 rounded-xl border border-[#DCDCDA] min-w-[68px] min-h-[56px] items-center gap-1.5`}>
                                {venue.reviews > 0 ? (
                                  <>
                                      <div className="flex items-center gap-1.5 w-full justify-between">
                                        <Star className="w-4 h-4 fill-[#8A2532] text-[#8A2532] shrink-0" />
                                        <span className="font-semibold text-[#121415] text-[14px]">{venue.rating}</span>
                                      </div>
                                      <div className="w-full h-[1px] bg-[#DCDCDA]/70" />
                                      <div className="flex items-center gap-1.5 w-full justify-between">
                                        <Users className="w-4 h-4 text-[#4A4E51] shrink-0" />
                                        <span className="font-semibold text-[#4A4E51] text-[14px]">{venue.reviews}</span>
                                      </div>
                                  </>
                                ) : (
                                  <span className="font-semibold text-[#4A4E51] text-xs uppercase tracking-wide">{t("app.t14")}</span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 mt-4 text-[#4A4E51] text-sm font-medium flex-wrap">
                              <MapPin className="w-4 h-4 shrink-0 text-[#8A2532]" />
                              <span>{venue.address}</span>
                              <span className="text-[#DCDCDA] hidden sm:inline shrink-0">·</span>
                              <span className="shrink-0 text-[#121415] font-semibold hidden sm:inline">{venue.distance}</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-5 max-w-full">
                              {venue.tags.map((tag) => (
                                <Badge key={tag} variant="neutral">{tag}</Badge>
                              ))}
                            </div>
                          </div>

                          <div className="mt-6 pt-5 border-t border-[#DCDCDA] flex flex-col xl:flex-row xl:items-center justify-between gap-4 min-w-0">
                            <div className="flex flex-col min-w-0 flex-1 pr-2">
                              <span className="text-[10px] uppercase font-bold text-[#4A4E51] mb-1">{useI18nStore.getState().t("extra.t215")}</span>
                              <span className="text-sm font-semibold text-[#121415]">{venue.time}</span>
                            </div>

                            {venue.is_paused ? (
                              <Button 
                                variant="primary" 
                                icon={ChevronRight} 
                                iconPosition="right" 
                                shape="pill" 
                                className="w-full xl:w-auto px-6 py-3"
                                onClick={() => setInterceptedVenue(venue)}
                              >{t("app.t15")}</Button>
                            ) : (
                              <Link
                                href={`/booking?id=${venue.id}`}
                                className="w-full xl:w-auto shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#8A2532] focus-visible:ring-offset-2 rounded-full"
                              >
                                <Button variant="primary" icon={ChevronRight} iconPosition="right" shape="pill" className="w-full xl:w-auto px-6 py-3">{t("app.t15")}</Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Load More */}
            {hasMore && (
              <div className="mb-16 flex justify-center">
                <Button variant="outline" shape="pill" className="px-8 py-3.5" onClick={loadMore}>
                  {t("extra.t526")}</Button>
              </div>
            )}
          </div>

          {/* Right: Interactive Virtual Map */}
          <div className={`${mobileView === "map" ? "block" : "hidden"} lg:block w-full lg:w-[45%] xl:w-[40%] relative mt-2 lg:mt-0`}>
            <div className="lg:sticky lg:top-[160px] h-[500px] lg:h-[calc(100vh-180px)] min-h-[500px] w-full">
              <DynamicMap venues={filtered} />
            </div>
          </div>

        </div>
        </div>
      {/* Intercept Booking Modal */}
      <AnimatePresence>
        {interceptedVenue && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#121415]/40 backdrop-blur-sm"
              onClick={() => setInterceptedVenue(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#DCDCDA] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#8A2532]" />
              <button
                onClick={() => setInterceptedVenue(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F4] text-[#4A4E51] hover:text-[#121415] hover:bg-[#E5E9EA] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-[#8A2532]/10 flex items-center justify-center mb-5">
                <AlertCircle className="w-6 h-6 text-[#8A2532]" />
              </div>

              <h2 className="text-xl font-bold text-[#121415] mb-2 tracking-tight">
                {t("extra.t527")}</h2>
              <p className="text-sm font-medium text-[#4A4E51] leading-relaxed mb-6">
                <strong className="text-[#121415]">{interceptedVenue.name}</strong> {t("extra.t528")}</p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  shape="pill"
                  className="flex-1"
                  onClick={() => setInterceptedVenue(null)}
                >{t("app.t16")}</Button>
                <Link href={`/booking?id=${interceptedVenue.id}`} className="flex-1">
                  <Button variant="primary" shape="pill" className="w-full" onClick={() => setInterceptedVenue(null)}>{t("app.t17")}</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </main>

          </div>
  );
}




