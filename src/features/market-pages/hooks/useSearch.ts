"use client";
import { useState, useMemo } from "react";
import { useSearchParams, useRouter , usePathname } from "next/navigation";;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AuthService from "../api/services/AuthService";
import VenueService from "../api/services/VenueService";
import { toast } from "sonner";
import useAuthStore from "../stores/authStore";
import { queryKeys } from "../lib/queryKeys";
import { Business } from '@/types';

interface ExtendedBusiness extends Business {
  category?: string;
  tags?: string[];
  openNow?: boolean;
  rating?: number;
  reviews?: number;
  distance?: string;
}

export const CATEGORIES = ["All", "Barbershop", "Beauty Salon", "Manicure", "Spa"];

export const SORT_OPTIONS = [
  { id: "relevance", label: "By Relevance" },
  { id: "punctuality", label: "Most Punctual (Top)" }, 
  { id: "rating", label: "By Rating" },
  { id: "distance", label: "By Distance" },
];

export default function useSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const setSearchParams = (updater: (prev: URLSearchParams) => URLSearchParams) => {
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
    const newParams = updater(currentParams);
    router.push(pathname + '?' + newParams.toString());
  };
  const router = useRouter();
  const queryClient = useQueryClient();

  const [hoveredVenueId, setHoveredVenueId] = useState(null);

  const { user: currentUser } = useAuthStore();
  const userId = currentUser?.id || "guest";

  const activeCategory = searchParams.get("category") || "All";
  const isFavoritesTab = searchParams.get("favorites") === "true";
  const openNowOnly = searchParams.get("openNow") === "true";
  const sortBy = searchParams.get("sort") || "relevance";

  const [localQuery, setLocalQuery] = useState(searchParams.get("q") || "");
  const [localLocation, setLocalLocation] = useState(searchParams.get("loc") || "");

  const [sortOpen, setSortOpen] = useState(false);

  const { data: venues = [], isLoading: isVenuesLoading, isError: isVenuesError, refetch: refetchVenues } = useQuery({
    queryKey: queryKeys.venues.all,
    queryFn: () => VenueService.getVenues(),
  });

  const { data: favorites = [], isLoading: isFavsLoading, isError: isFavsError, refetch: refetchFavs } = useQuery({
    queryKey: ['favorites', userId],
    queryFn: async () => {
      if (currentUser) {
        const data = (await AuthService.getUser(userId)) as { favorites?: string[] };
        if (data.favorites) {
          localStorage.setItem(`favorites_${userId}`, JSON.stringify(data.favorites));
          return data.favorites;
        }
        return [];
      } else {
        if (typeof window !== 'undefined') {
          const savedFavs = localStorage.getItem(`favorites_guest`);
          return savedFavs ? JSON.parse(savedFavs) : [];
        }
        return [];
      }
    }
  });

  const isDataLoading = isVenuesLoading || isFavsLoading;
  const isError = isVenuesError || isFavsError;

  const handleRefetch = () => {
    refetchVenues();
    refetchFavs();
  };

  const updateSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchParams((prev: URLSearchParams) => {
      if (localQuery) prev.set("q", localQuery);
      else prev.delete("q");
      if (localLocation) prev.set("loc", localLocation);
      else prev.delete("loc");
      return prev;
    });
  };

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (venueId: string) => {
      const isFav = (favorites as string[]).includes(venueId);
      const newFavs = isFav ? (favorites as string[]).filter((id: string) => id !== venueId) : [...(favorites as string[]), venueId];
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(newFavs));

      if (userId !== "guest") {
        await AuthService.patchProfile(userId, { favorites: newFavs });
      }
      return { isFav, newFavs };
    },
    onSuccess: ({ isFav, newFavs }) => {
      queryClient.setQueryData(['favorites', userId], newFavs);
      if (isFav) toast.info("Removed from favorites");
      else toast.success("Added to favorites");
    },
    onError: (error) => {
      console.error("Error saving favorites", error);
      toast.error("Failed to update favorites");
    }
  });

  const handleToggleFavorite = (venueId: string) => {
    toggleFavoriteMutation.mutate(venueId);
  };

  const getPunctualityScore = (venueId: string | number) => {
    return Number(venueId) === 1 ? 98 : (Number(venueId) === 2 ? 94 : 88);
  };

  const filtered = useMemo(() => {
    let list = venues as ExtendedBusiness[];

    if (isFavoritesTab) {
      list = list.filter((v) => (favorites as string[]).includes(String(v.id)));
    } else {
      list = list.filter((v) =>
        activeCategory === "All"
          ? true
          : String(v.category).toLowerCase().includes(activeCategory.toLowerCase()),
      );
    }

    if (localQuery) {
      list = list.filter(
        (v) =>
          String(v.name).toLowerCase().includes(localQuery.toLowerCase()) ||
          (v.tags || []).some((t: string) =>
            t.toLowerCase().includes(localQuery.toLowerCase()),
          ),
      );
    }

    if (openNowOnly) list = list.filter((v) => v.openNow);

    const sorted = [...list];
    if (sortBy === "rating") sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === "reviews") sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    if (sortBy === "distance") sorted.sort((a, b) => parseFloat(a.distance || "0") - parseFloat(b.distance || "0"));
    if (sortBy === "punctuality") sorted.sort((a, b) => getPunctualityScore(b.id) - getPunctualityScore(a.id)); 
    return sorted;
  }, [
    activeCategory,
    sortBy,
    openNowOnly,
    localQuery,
    venues,
    isFavoritesTab,
    favorites,
  ]);

  return {
    router,
    searchParams,
    setSearchParams,
    hoveredVenueId, setHoveredVenueId,
    isDataLoading,
    isError,
    handleRefetch,
    currentUser,
    favorites,
    activeCategory,
    isFavoritesTab,
    openNowOnly,
    sortBy,
    localQuery, setLocalQuery,
    localLocation, setLocalLocation,
    sortOpen, setSortOpen,
    updateSearch,
    handleToggleFavorite,
    getPunctualityScore,
    filtered
  };
}
