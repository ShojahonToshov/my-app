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
  punctuality: number;
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
    const loadSaved = async () => {
      const raw = localStorage.getItem(SAVED_KEY(userId));
      const localSaved = raw ? (JSON.parse(raw) as string[]) : [];

      if (isAuthenticated && userId !== "guest") {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("profiles")
          .select("saved_venues")
          .eq("id", userId)
          .single();

        if (!error && data) {
          const dbSaved = Array.isArray(data.saved_venues) ? data.saved_venues : [];
          // Avoid spreads in dependencies or effect bodies where React Compiler might trip
          const merged = new Set(dbSaved);
          localSaved.forEach(id => merged.add(id));
          
          setSavedIds(merged);
          
          const mergedArray = Array.from(merged);
          localStorage.setItem(SAVED_KEY(userId), JSON.stringify(mergedArray));
          
          if (localSaved.length > 0 && localSaved.some(id => !dbSaved.includes(id))) {
            await supabase
              .from("profiles")
              .update({ saved_venues: mergedArray })
              .eq("id", userId);
          }
        } else {
          setSavedIds(new Set(localSaved));
        }
      } else {
        setSavedIds(new Set(localSaved));
      }
    };
    loadSaved();
  }, [userId, isAuthenticated]); // Primitives only

  const persistSaved = useCallback(
    (next: Set<string>) => {
      const nextArray = Array.from(next);
      localStorage.setItem(SAVED_KEY(userId), JSON.stringify(nextArray));
      setSavedIds(next);
    },
    [userId]
  );

  const toggleSaved = useCallback(
    async (venueId: string) => {
      let isSaved = false;
      let nextArray: string[] = [];

      setSavedIds((prev) => {
        const next = new Set(prev);
        isSaved = next.has(venueId);
        
        if (isSaved) {
          next.delete(venueId);
        } else {
          next.add(venueId);
        }
        
        nextArray = Array.from(next);
        localStorage.setItem(SAVED_KEY(userId), JSON.stringify(nextArray));
        return next;
      });

      // Toast fires outside setState
      if (isSaved) {
        toast.info("Removed from saved");
      } else {
        toast.success("Saved!");
      }

      if (isAuthenticated && userId !== "guest") {
        const supabase = createClient();
        await supabase
          .from("profiles")
          .update({ saved_venues: nextArray })
          .eq("id", userId);
      }
    },
    [userId, isAuthenticated] // Primitives only, removed savedIds and currentUser
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
    const list = venues.slice();

    // 1. Saved filter
    if (isSavedOnly) {
      return list.filter((v) => savedIds.has(v.id)); // early return if no other filters for performance? No, let's keep it chained
    }
    
    let result = list;

    if (isSavedOnly) {
      result = result.filter((v) => savedIds.has(v.id));
    }

    // 2. Category filter
    if (activeCategory !== "All") {
      result = result.filter((v) =>
        v.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
        v.tags.some((t) => t.toLowerCase().includes(activeCategory.toLowerCase()))
      );
    }

    // 3. Search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          v.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // 4. Open Now filter
    if (isOpenNowOnly) {
      result = result.filter((v) => isOpenNow(v.time));
    }

    // 5. Sort
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    if (sortBy === "reviews") result.sort((a, b) => b.reviews - a.reviews);
    if (sortBy === "distance")
      result.sort(
        (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
      );
    if (sortBy === "punctual") {
      result.sort((a, b) => b.punctuality - a.punctuality);
    }

    return result;
  }, [venues, isSavedOnly, savedIds, activeCategory, searchQuery, isOpenNowOnly, sortBy]);

  const [visibleCount, setVisibleCount] = useState(10);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(10);
  }, [searchQuery, activeCategory, isSavedOnly, isOpenNowOnly, sortBy]);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 10);
  }, []);

  const paginatedVenues = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  const hasMore = visibleCount < filtered.length;

  return {
    // data
    venues,
    filtered: paginatedVenues,
    totalCount: filtered.length,
    hasMore,
    loadMore,
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




