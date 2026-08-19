"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import useUser from "@/hooks/useUser";
import { toast } from "sonner";

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
  /** Work hours e.g. "09:00-21:00" */
  time: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Parse "HH:MM-HH:MM" and check against current time */
function isOpenNow(timeRange: string): boolean {
  try {
    const [start, end] = timeRange.split("-").map((t) => {
      const [h, m] = t.trim().split(":").map(Number);
      return h * 60 + m; // minutes since midnight
    });
    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();
    // Handle overnight ranges (e.g. 22:00-02:00)
    if (start <= end) return current >= start && current < end;
    return current >= start || current < end;
  } catch {
    return false;
  }
}

const SAVED_KEY = (userId: string) => `elara_saved_${userId}`;

// ─── Hook ────────────────────────────────────────────────────────────────────

export default function useSearch(initialVenues: VenueData[] = []) {
  const { user: currentUser, isAuthenticated } = useUser();
  const userId = currentUser?.id ?? "guest";

  // ── Remote venues ──────────────────────────────────────────────────────────
  const [venues, setVenues] = useState<VenueData[]>(initialVenues);
  const isVenuesLoading = false;

  // ── Saved (localStorage, synced to profile column if logged-in) ────────────
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Load saved on mount / user change
  useEffect(() => {
    const raw = localStorage.getItem(SAVED_KEY(userId));
    setSavedIds(new Set(raw ? (JSON.parse(raw) as string[]) : []));
  }, [userId]);

  const persistSaved = useCallback(
    (next: Set<string>) => {
      localStorage.setItem(SAVED_KEY(userId), JSON.stringify([...next]));
      setSavedIds(next);
    },
    [userId]
  );

  const toggleSaved = useCallback(
    (venueId: string) => {
      // Read current state directly — do NOT call toast inside setState updater,
      // because React 18 Strict Mode calls updaters twice (to detect side effects),
      // which would fire the toast notification twice.
      const isSaved = savedIds.has(venueId);
      const next = new Set(savedIds);
      if (isSaved) {
        next.delete(venueId);
      } else {
        next.add(venueId);
      }
      localStorage.setItem(SAVED_KEY(userId), JSON.stringify([...next]));
      setSavedIds(next);

      // Toast is called here — outside setState — so it fires exactly once.
      if (isSaved) {
        toast.info("Removed from saved");
      } else {
        toast.success("Saved!");
      }
    },
    [savedIds, userId]
  );

  // ── Filters (all local state — fast, no URL needed for now) ────────────────
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [isSavedOnly, setIsSavedOnly] = useState(false);
  const [isOpenNowOnly, setIsOpenNowOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [sortOpen, setSortOpen] = useState(false);

  const toggleSavedFilter = useCallback(() => {
    setIsSavedOnly((v) => !v);
  }, []);

  const toggleOpenNow = useCallback(() => {
    setIsOpenNowOnly((v) => !v);
  }, []);

  // ── Derived list ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...venues];

    // 1. Saved filter
    if (isSavedOnly) {
      list = list.filter((v) => savedIds.has(v.id));
    }

    // 2. Category filter
    if (activeCategory !== "All") {
      list = list.filter((v) =>
        v.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
        v.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase()))
      );
    }

    // 3. Search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          v.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // 4. Open Now filter
    if (isOpenNowOnly) {
      list = list.filter((v) => isOpenNow(v.time));
    }

    // 5. Sort
    const sorted = [...list];
    if (sortBy === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (sortBy === "reviews") sorted.sort((a, b) => b.reviews - a.reviews);
    if (sortBy === "distance")
      sorted.sort(
        (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
      );
    if (sortBy === "punctual") {
      // Stub: use id-based mock score until real data exists
      const score = (id: string) =>
        id === "1" ? 98 : id === "2" ? 94 : 88;
      sorted.sort((a, b) => score(b.id) - score(a.id));
    }

    return sorted;
  }, [venues, isSavedOnly, savedIds, activeCategory, searchQuery, isOpenNowOnly, sortBy]);

  return {
    // data
    venues,
    filtered,
    isVenuesLoading,
    // auth
    currentUser,
    isAuthenticated,
    // saved
    savedIds,
    toggleSaved,
    isSavedOnly,
    toggleSavedFilter,
    // open now
    isOpenNowOnly,
    toggleOpenNow,
    // search
    searchQuery, setSearchQuery,
    locationQuery, setLocationQuery,
    // category
    activeCategory, setActiveCategory,
    // sort
    sortBy, setSortBy,
    sortOpen, setSortOpen,
  };
}



