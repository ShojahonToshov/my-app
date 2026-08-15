"use client";
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
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import ElaraLogo from "@/components/ElaraLogo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import BookingService from "./api/services/BookingService";
import useAuthStore from "./stores/authStore";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
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



const SORT_OPTIONS = [
  { id: "relevance", label: "By relevance", shortLabel: "relevance" },
  { id: "punctual", label: "Most punctual (New)", shortLabel: "most punctual" },
  { id: "rating", label: "By rating", shortLabel: "rating" },
  { id: "distance", label: "By distance", shortLabel: "distance" },
];

function EmptyState({ query }: { query?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white border border-[#DCDCDA] rounded-[2rem]">
      <div className="w-14 h-14 rounded-2xl bg-[#8A2532]/10 text-[#8A2532] flex items-center justify-center mb-6">
        <SearchX className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-semibold text-[#121415] tracking-tight mb-2">
        Nothing found
      </h3>
      <p className="text-[#4A4E51] font-medium leading-relaxed max-w-sm">
        {query
          ? `No results found for "${query}". Try adjusting your search or clearing the filters.`
          : "No venues match the selected filters. Try choosing a different category."}
      </p>
    </div>
  );
}

export interface VenueData {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  address: string;
  image: string;
  tags: string[];
  badges: string[];
  coordinates: { x: number; y: number };
  price: string;
  distance: string;
  time: string;
}

export interface DBBusiness {
  id: string;
  name: string;
  category?: string;
  rating?: number;
  reviews_count?: number;
  address?: string;
  image_url?: string;
  tags?: string[];
  badges?: string[];
  coordinates?: { x: number; y: number };
  [key: string]: unknown;
}

export default function Search() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { isAuthenticated, user } = useAuthStore();
  const accountLink = user?.profile?.role === "business" ? "/admin" : "/account";

  const [venues, setVenues] = useState<VenueData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    BookingService.getBusinesses().then((data: unknown) => {
      const businesses = (data as DBBusiness[]) || [];
      const formatted = businesses.map((b: DBBusiness) => ({
        id: b.id,
        name: b.name,
        category: b.category || "General",
        rating: b.rating || 5,
        reviews: b.reviews_count || 0,
        coordinates: b.coordinates || { x: 0, y: 0 },
        address: b.address || "",
        distance: "1 km",
        image: b.image_url || "",
        price: "$10 - $50",
        time: "10:00 - 20:00",
        tags: b.tags || [b.category || "General"],
        priceRange: "$",
        badges: b.badges || [],
        isNew: true,
      }));
      setVenues(formatted);
      setIsLoading(false);
    });
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [mobileView, setMobileView] = useState("list");
  
  const [isSavedActive, setIsSavedActive] = useState(false);
  const [isOpenNowActive, setIsOpenNowActive] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [mobileLocationQuery, setMobileLocationQuery] = useState("");

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("relevance");
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredVenues = venues.filter((venue) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      query === "" ||
      venue.name.toLowerCase().includes(query) ||
      venue.category.toLowerCase().includes(query);

    const matchesFilter =
      activeFilter === "All" ||
      venue.category.toLowerCase().includes(activeFilter.toLowerCase()) ||
      venue.tags.some((tag: string) =>
        tag.toLowerCase().includes(activeFilter.toLowerCase()),
      );

    return matchesQuery && matchesFilter;
  });

  const [mapScale, setMapScale] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const mapPositionRef = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const mapWidth = 1400;
  const mapHeight = 1200;

  const handleZoomIn = () => setMapScale((prev) => Math.min(prev + 0.3, 3));
  const handleZoomOut = () => setMapScale((prev) => Math.max(prev - 0.3, 0.5));

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = {
      x: e.clientX - mapPositionRef.current.x,
      y: e.clientY - mapPositionRef.current.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    mapPositionRef.current = {
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    };
    if (canvasRef.current) {
      canvasRef.current.style.transform = `translate(${mapPositionRef.current.x}px, ${mapPositionRef.current.y}px) scale(${mapScale})`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  useLockBodyScroll(mobileMenuOpen);

  return (
    <div className="min-h-screen flex flex-col bg-[#ECECEA] font-sans selection:bg-[#8A2532] selection:text-white overflow-x-hidden text-[#121415]">
      {/* Fixed Navbar */}
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
                className="peer w-full h-full bg-transparent outline-none font-medium text-sm text-[#121415] pl-11 pr-10 py-2.5 transition-all duration-300"
              />
              <label
                htmlFor="desktop_search"
                className="absolute left-11 top-1/2 -translate-y-1/2 text-[#4A4E51] text-sm font-medium transition-all duration-300 pointer-events-none peer-[:not(:placeholder-shown)]:opacity-0"
              >
                Service or salon
              </label>
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
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
                className="peer w-full h-full bg-transparent outline-none font-medium text-sm text-[#121415] pl-11 pr-10 py-2.5 transition-all duration-300"
              />
              <label
                htmlFor="desktop_location"
                className="absolute left-11 top-1/2 -translate-y-1/2 text-[#4A4E51] text-sm font-medium transition-all duration-300 pointer-events-none peer-[:not(:placeholder-shown)]:opacity-0"
              >
                Where to search?
              </label>
              <AnimatePresence>
                {locationQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setLocationQuery("")}
                    className="absolute right-3 p-1 text-[#4A4E51] hover:text-[#121415] rounded-full hover:bg-[#F5F5F4] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#121415] z-20 active:scale-95"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="px-6 py-2.5 shrink-0 active:scale-95"
            >
              Search
            </Button>
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0">
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm font-medium text-[#121415] border border-[#DCDCDA] bg-white hover:bg-[#F5F5F4] rounded-full transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-full flex items-center justify-center"
            >
              <Button variant="secondary" size="sm" className="px-6 py-2.5 rounded-full active:scale-95">
                Sign up
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-[#121415] shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] rounded-lg active:scale-95 transition-transform"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#ECECEA] border-b border-[#DCDCDA] overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                <div className="flex flex-col gap-3 w-full mb-4">
                  
                  {/* Mobile Search Input */}
                  <div className="relative group w-full shrink-0">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 text-[#4A4E51] group-focus-within:text-[#121415] z-10 pointer-events-none" />
                    <input
                      id="mobile_search"
                      value={mobileSearchQuery}
                      onChange={(e) => setMobileSearchQuery(e.target.value)}
                      placeholder=" "
                      className="peer w-full pl-11 pr-10 py-3.5 bg-white border border-[#DCDCDA] rounded-2xl text-sm text-[#121415] font-medium focus:border-[#121415] outline-none transition-all duration-300"
                    />
                    <label
                      htmlFor="mobile_search"
                      className="absolute left-11 top-1/2 -translate-y-1/2 text-[#4A4E51] text-sm font-medium transition-all duration-300 pointer-events-none peer-[:not(:placeholder-shown)]:opacity-0"
                    >
                      Service or salon
                    </label>
                    <AnimatePresence>
                      {mobileSearchQuery && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setMobileSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#4A4E51] z-20 outline-none active:scale-95 transition-transform"
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Mobile Location Input */}
                  <div className="relative group w-full shrink-0">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 text-[#4A4E51] group-focus-within:text-[#121415] z-10 pointer-events-none" />
                    <input
                      id="mobile_location"
                      value={mobileLocationQuery}
                      onChange={(e) => setMobileLocationQuery(e.target.value)}
                      placeholder=" "
                      className="peer w-full pl-11 pr-10 py-3.5 bg-white border border-[#DCDCDA] rounded-2xl text-sm text-[#121415] font-medium focus:border-[#121415] outline-none transition-all duration-300"
                    />
                    <label
                      htmlFor="mobile_location"
                      className="absolute left-11 top-1/2 -translate-y-1/2 text-[#4A4E51] text-sm font-medium transition-all duration-300 pointer-events-none peer-[:not(:placeholder-shown)]:opacity-0"
                    >
                      City, district...
                    </label>
                    <AnimatePresence>
                      {mobileLocationQuery && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setMobileLocationQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#4A4E51] z-20 outline-none active:scale-95 transition-transform"
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  <Button variant="primary" className="w-full mt-1 active:scale-95">
                    Search
                  </Button>
                </div>

                <div className="h-px bg-[#DCDCDA] my-2" />

                <Link
                  href="/login"
                  className="text-lg font-medium text-[#121415]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-lg font-medium text-[#8A2532]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-20">
        {/* Filter Bar (Sticky below Header) */}
        <div className="bg-[#ECECEA] border-b border-[#DCDCDA] sticky top-20 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between py-3">
            
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar flex-1 pr-4 py-3 -my-3">
              <button 
                onClick={() => setIsSavedActive(!isSavedActive)}
                className={`shrink-0 px-4 sm:px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border outline-none focus-visible:ring-2 focus-visible:ring-[#121415] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 ${isSavedActive ? "bg-[#121415] border-[#121415] text-white" : "bg-white border-[#DCDCDA] text-[#121415] hover:bg-[#F5F5F4]"}`}
              >
                <Heart className="w-4 h-4" />
                <span>Saved</span>
              </button>

              <div className="w-px h-6 bg-[#DCDCDA] shrink-0 mx-1" />

            {["All", "Barbershop", "Beauty Salon", "Manicure"].map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`shrink-0 px-4 sm:px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border outline-none focus-visible:ring-2 focus-visible:ring-[#121415] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center ${
                    activeFilter === filter
                      ? "bg-[#121415] border-[#121415] text-white"
                      : "bg-white border-[#DCDCDA] text-[#121415] hover:bg-[#F5F5F4]"
                  }`}
                >
                  {filter}
                </button>
              ),
            )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0 border-l border-[#DCDCDA] pl-3 sm:pl-4">
              <span className="text-[#121415] font-semibold text-sm tracking-tight px-1 hidden md:block">
                24 venues
              </span>

              <button 
                onClick={() => setIsOpenNowActive(!isOpenNowActive)}
                className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border outline-none focus-visible:ring-2 focus-visible:ring-[#121415] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 ${isOpenNowActive ? "bg-[#121415] border-[#121415] text-white" : "bg-white border-[#DCDCDA] text-[#121415] hover:bg-[#F5F5F4]"}`}
              >
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Open Now</span>
              </button>

              <div className="relative" ref={sortRef}>
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className={`shrink-0 px-4 sm:px-5 py-2.5 bg-white hover:bg-[#F5F5F4] text-[#121415] border border-[#DCDCDA] rounded-full text-sm font-medium transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2`}
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#8A2532]" />
                  <span className="hidden sm:inline">Sort by {SORT_OPTIONS.find(o => o.id === sortOption)?.shortLabel || "relevance"}</span>
                  <span className="sm:hidden">Sort</span>
                  <ChevronDown className={`w-4 h-4 text-[#4A4E51] transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#DCDCDA] overflow-hidden z-50 py-2"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setSortOption(option.id);
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-5 py-3 text-[15px] font-semibold transition-colors hover:bg-[#F5F5F4] ${
                            sortOption === option.id
                              ? "text-[#8A2532]"
                              : "text-[#4A4E51]"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex flex-col lg:flex-row gap-8 relative">
          {/* Mobile Map Toggle */}
          <div className="lg:hidden flex items-center bg-white border border-[#DCDCDA] rounded-full p-1 shadow-sm mb-2 w-max mx-auto shrink-0 z-20">
            <button
              onClick={() => setMobileView("list")}
              className={`px-6 py-2 rounded-full text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#121415] transition-colors active:scale-95 ${
                mobileView === "list"
                  ? "bg-[#121415] text-white shadow-sm"
                  : "text-[#4A4E51] hover:text-[#121415]"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setMobileView("map")}
              className={`px-6 py-2 rounded-full text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#121415] transition-colors active:scale-95 ${
                mobileView === "map"
                  ? "bg-[#121415] text-white shadow-sm"
                  : "text-[#4A4E51] hover:text-[#121415]"
              }`}
            >
              Map
            </button>
          </div>

          {/* Left Column: Venue Cards */}
          <div
            className={`${mobileView === "list" ? "flex" : "hidden"} lg:flex w-full lg:w-[55%] xl:w-[60%] flex-col`}
          >
            {filteredVenues.length === 0 ? (
              <div className="mt-2 lg:mt-0 pb-10">
                <EmptyState query={searchQuery.trim()} />
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="show"
                variants={staggerContainer}
                className="flex flex-col gap-6 pb-10 mt-2 lg:mt-0"
              >
                {filteredVenues.map((venue) => (
                <motion.div key={venue.id} variants={fadeUp}>
                  <Card className="group hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.09)] transition-all duration-300 cursor-pointer flex flex-col sm:flex-row h-auto">
                    {/* Image */}
                    <div className="relative w-full sm:w-[280px] md:w-[320px] h-[240px] sm:h-auto shrink-0 overflow-hidden p-3 pb-0 sm:pb-3 sm:pr-0">
                      <div className="w-full h-full rounded-2xl overflow-hidden relative">
                        <img
                          src={venue.image}
                          alt={venue.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121415]/60 via-transparent to-transparent pointer-events-none" />

                        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start max-w-[90%]">
                          {venue.badges.includes("Popular") && (
                            <Badge
                              variant="brand"
                              icon={Flame}
                              className="bg-white/95 backdrop-blur-md"
                            >
                              Popular
                            </Badge>
                          )}

                          <Badge variant="dark" icon={Timer}>
                            {venue.badges.find((b: string) => b.includes("time")) ||
                              "Verified"}
                          </Badge>
                        </div>

                        <button className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-300 shrink-0 p-2 -m-2 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2">
                          <Heart className="w-4 h-4 text-[#4A4E51] hover:text-[#8A2532] transition-colors" />
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

                            <div className="flex items-center gap-2 text-sm font-medium text-[#4A4E51] w-full min-w-0 flex-wrap">
                              <span className="text-[#121415]">
                                {venue.category}
                              </span>
                              <span className="shrink-0">·</span>
                              <span className="text-[#121415] shrink-0">
                                {venue.price}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end shrink-0 bg-[#F5F5F4] px-3 py-2 rounded-xl border border-[#DCDCDA]">
                            <div className="flex items-center gap-1.5">
                              <Star className="w-4 h-4 fill-[#8A2532] text-[#8A2532] shrink-0" />
                              <span className="font-semibold text-[#121415] text-sm">
                                {venue.rating}
                              </span>
                            </div>
                            <span className="text-[#4A4E51] text-[10px] uppercase font-bold mt-1">
                              {venue.reviews} rev.
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 mt-4 text-[#4A4E51] text-sm font-medium w-full min-w-0 flex-wrap">
                          <MapPin className="w-4 h-4 shrink-0 text-[#8A2532]" />
                          <span>{venue.address}</span>
                          <span className="text-[#DCDCDA] hidden sm:inline shrink-0">
                            ·
                          </span>
                          <span className="shrink-0 text-[#121415] font-semibold hidden sm:inline">
                            {venue.distance}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-5 max-w-full">
                          {venue.tags.map((tag: string) => (
                            <Badge key={tag} variant="neutral">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 pt-5 border-t border-[#DCDCDA] flex flex-col xl:flex-row xl:items-center justify-between gap-4 min-w-0">
                        <div className="flex flex-col min-w-0 flex-1 pr-2">
                          <span className="text-[10px] uppercase font-bold text-[#4A4E51] mb-1 w-full">
                            Next available:
                          </span>
                          <span className="text-sm font-semibold text-[#121415] w-full">
                            {venue.time}
                          </span>
                        </div>

                        <Link
                          href="/booking"
                          className="w-full xl:w-auto shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#8A2532] focus-visible:ring-offset-2 rounded-full"
                        >
                          <Button
                            variant="primary"
                            icon={ChevronRight}
                            className="w-full xl:w-auto px-6 py-3 active:scale-95 flex-row-reverse"
                          >
                            Book now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
                ))}
              </motion.div>
            )}

            {/* Load More */}
            {/* Load More */}
{filteredVenues.length > 0 && (
  <div className="mb-16 flex justify-center">
    <button className="px-8 py-3.5 bg-white border border-[#DCDCDA] text-[#121415] hover:bg-[#F5F5F4] rounded-full text-sm font-medium transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center">
      Load more venues
    </button>
  </div>
)}
          </div>

          {/* Right Column: Interactive Virtual Map */}
          <div
            className={`${mobileView === "map" ? "block" : "hidden"} lg:block w-full lg:w-[45%] xl:w-[40%] relative mt-2 lg:mt-0`}
          >
            {/* Map window — intercepts PointerEvents (touch-none prevents page scroll on mobile while dragging the map) */}
            <div
              className="lg:sticky lg:top-[160px] h-[500px] lg:h-[calc(100vh-180px)] min-h-[500px] w-full bg-[#F5F5F4] rounded-[2rem] border border-[#DCDCDA] shadow-inner overflow-hidden relative cursor-grab active:cursor-grabbing touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {/* Zoom controls */}
              <div className="absolute top-5 right-5 flex flex-col gap-2 z-20">
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleZoomIn();
                  }}
                  className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl border border-[#DCDCDA] flex items-center justify-center text-[#121415] hover:text-[#8A2532] hover:bg-[#F5F5F4] transition-colors duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleZoomOut();
                  }}
                  className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl border border-[#DCDCDA] flex items-center justify-center text-[#121415] hover:text-[#8A2532] hover:bg-[#F5F5F4] transition-colors duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#121415]"
                >
                  <Minus className="w-5 h-5" />
                </button>
              </div>

              {/* Location badge */}
              <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl text-[10px] uppercase font-bold text-[#121415] border border-[#DCDCDA] z-20 flex items-center gap-2 shadow-sm max-w-[80%] pointer-events-none">
                <Navigation className="w-3.5 h-3.5 text-[#8A2532] fill-[#8A2532] shrink-0" />
                <span>City Center</span>
              </div>

              {/* VIRTUAL CANVAS */}
              <div
                ref={canvasRef}
                className="absolute origin-center will-change-transform"
                style={{
                  width: mapWidth,
                  height: mapHeight,
                  top: "50%",
                  left: "50%",
                  marginLeft: -mapWidth / 2,
                  marginTop: -mapHeight / 2,
                  transform: `translate(${mapPositionRef.current.x}px, ${mapPositionRef.current.y}px) scale(${mapScale})`,
                }}
              >
                {/* SVG Background */}
                <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1400 1200"
                    preserveAspectRatio="xMidYMid slice"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern
                        id="grid"
                        width="80"
                        height="80"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 80 0 L 0 0 0 80"
                          fill="none"
                          stroke="#DCDCDA"
                          strokeWidth="1"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <path
                      d="M 0 1200 Q 300 700 700 300 T 1400 100 L 1400 0 L 0 0 Z"
                      fill="#E6E6E4"
                    />
                    <path
                      d="M 800 600 Q 900 800 1100 600 T 1000 400 Z"
                      fill="#E2E2E0"
                    />
                    <path
                      d="M -100 800 Q 400 600 800 800 T 1400 400"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 200 -100 L 400 1400"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="12"
                    />
                    <path
                      d="M 400 600 L 1400 900"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="8"
                    />
                  </svg>
                </div>

                {/* Interactive Pins */}
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  className="absolute flex flex-col items-center cursor-pointer transition-transform duration-300 ease-out z-10 hover:z-20 hover:scale-110 hover:-translate-y-1 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 rounded-full"
                  style={{
                    top: "40%",
                    left: "45%",
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  <div className="px-4 py-2.5 rounded-full font-semibold text-sm transition-colors duration-300 flex items-center gap-1.5 bg-[#121415] text-white shadow-md">
                    <Star className="w-3.5 h-3.5 fill-[#8A2532] text-[#8A2532] shrink-0" />
                    4.9
                  </div>
                  <div className="w-3 h-3 rotate-45 -mt-1.5 transition-colors duration-300 bg-[#121415]" />
                </button>

                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  className="absolute flex flex-col items-center cursor-pointer transition-transform duration-300 ease-out z-10 hover:z-20 hover:scale-110 hover:-translate-y-1 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 rounded-full"
                  style={{
                    top: "60%",
                    left: "30%",
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  <div className="px-4 py-2.5 rounded-full font-semibold text-sm transition-colors duration-300 flex items-center gap-1.5 bg-white text-[#121415] border border-[#DCDCDA] shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-[#8A2532] text-[#8A2532] shrink-0" />
                    4.7
                  </div>
                  <div className="w-3 h-3 rotate-45 -mt-1.5 transition-colors duration-300 bg-white border-b border-r border-[#DCDCDA]" />
                </button>

                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  className="absolute flex flex-col items-center cursor-pointer transition-transform duration-300 ease-out z-10 hover:z-20 hover:scale-110 hover:-translate-y-1 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#121415] focus-visible:ring-offset-2 rounded-full"
                  style={{
                    top: "25%",
                    left: "70%",
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  <div className="px-4 py-2.5 rounded-full font-semibold text-sm transition-colors duration-300 flex items-center gap-1.5 bg-white text-[#121415] border border-[#DCDCDA] shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-[#8A2532] text-[#8A2532] shrink-0" />
                    4.8
                  </div>
                  <div className="w-3 h-3 rotate-45 -mt-1.5 transition-colors duration-300 bg-white border-b border-r border-[#DCDCDA]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
