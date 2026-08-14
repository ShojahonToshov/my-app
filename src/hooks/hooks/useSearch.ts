"use client";
import { useState, useMemo } from "react";
import { useSearchParams, useRouter , usePathname } from "next/navigation";;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AuthService from "../api/services/AuthService";
import VenueService from "../api/services/VenueService";
import { toast } from "sonner";
import useAuthStore from "../stores/authStore";
import { queryKeys } from "../lib/queryKeys";
import { Business } from '@superqueue/types';

interface ExtendedBusiness extends Business {
  category?: string;
  tags?: string[];
  openNow?: boolean;
  rating?: number;
  reviews?: number;
  distance?: string;
}

export const CATEGORIES = ["Р В РІР‚в„ўР РЋР С“Р В Р’Вµ", "Р В РІР‚В Р В Р’В°Р РЋР вЂљР В Р’В±Р В Р’ВµР РЋР вЂљР РЋРІвЂљВ¬Р В РЎвЂўР В РЎвЂ”", "Р В Р Р‹Р В Р’В°Р В Р’В»Р В РЎвЂўР В Р вЂ¦ Р В РЎвЂќР РЋР вЂљР В Р’В°Р РЋР С“Р В РЎвЂўР РЋРІР‚С™Р РЋРІР‚в„–", "Р В РЎС™Р В Р’В°Р В Р вЂ¦Р В РЎвЂ Р В РЎвЂќР РЋР вЂ№Р РЋР вЂљ", "Р В Р Р‹Р В РЎвЂ”Р В Р’В°"];

export const SORT_OPTIONS = [
  { id: "relevance", label: "Р В РЎСџР В РЎвЂў Р РЋР вЂљР В Р’ВµР В Р’В»Р В Р’ВµР В Р вЂ Р В Р’В°Р В Р вЂ¦Р РЋРІР‚С™Р В Р вЂ¦Р В РЎвЂўР РЋР С“Р РЋРІР‚С™Р В РЎвЂ " },
  { id: "punctuality", label: "Р В Р Р‹Р В Р’В°Р В РЎВ Р РЋРІР‚в„–Р В Р’Вµ Р В РЎвЂ”Р РЋРЎвЂњР В Р вЂ¦Р В РЎвЂќР РЋРІР‚С™Р РЋРЎвЂњР В Р’В°Р В Р’В»Р РЋР Р‰Р В Р вЂ¦Р РЋРІР‚в„–Р В Р’Вµ (Р В РЎСљР В РЎвЂўР В Р вЂ Р В РЎвЂўР В Р’Вµ)" }, 
  { id: "rating", label: "Р В РЎСџР В РЎвЂў Р РЋР вЂљР В Р’ВµР В РІвЂћвЂ“Р РЋРІР‚С™Р В РЎвЂ Р В Р вЂ¦Р В РЎвЂ“Р РЋРЎвЂњ" },
  { id: "distance", label: "Р В РЎСџР В РЎвЂў Р РЋР вЂљР В Р’В°Р РЋР С“Р РЋР С“Р РЋРІР‚С™Р В РЎвЂўР РЋР РЏР В Р вЂ¦Р В РЎвЂ Р РЋР вЂ№" },
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

  const activeCategory = searchParams.get("category") || "Р В РІР‚в„ўР РЋР С“Р В Р’Вµ";
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
      if (isFav) toast.info("Р В Р в‚¬Р В РўвЂ Р В Р’В°Р В Р’В»Р В Р’ВµР В Р вЂ¦Р В РЎвЂў Р В РЎвЂ Р В Р’В· Р В РЎвЂ Р В Р’В·Р В Р’В±Р РЋР вЂљР В Р’В°Р В Р вЂ¦Р В Р вЂ¦Р В РЎвЂўР В РЎвЂ“Р В РЎвЂў");
      else toast.success("Р В РІР‚СњР В РЎвЂўР В Р’В±Р В Р’В°Р В Р вЂ Р В Р’В»Р В Р’ВµР В Р вЂ¦Р В РЎвЂў Р В Р вЂ  Р В РЎвЂ Р В Р’В·Р В Р’В±Р РЋР вЂљР В Р’В°Р В Р вЂ¦Р В Р вЂ¦Р В РЎвЂўР В Р’Вµ");
    },
    onError: (error) => {
      console.error("Р В РЎвЂєР РЋРІвЂљВ¬Р В РЎвЂ Р В Р’В±Р В РЎвЂќР В Р’В° Р РЋР С“Р В РЎвЂўР РЋРІР‚В¦Р РЋР вЂљР В Р’В°Р В Р вЂ¦Р В Р’ВµР В Р вЂ¦Р В РЎвЂ Р РЋР РЏ Р В Р’В·Р В Р’В°Р В РЎвЂќР В Р’В»Р В Р’В°Р В РўвЂ Р В РЎвЂўР В РЎвЂќ", error);
      toast.error("Р В РЎвЂєР РЋРІвЂљВ¬Р В РЎвЂ Р В Р’В±Р В РЎвЂќР В Р’В° Р В РЎвЂўР В Р’В±Р В Р вЂ¦Р В РЎвЂўР В Р вЂ Р В Р’В»Р В Р’ВµР В Р вЂ¦Р В РЎвЂ Р РЋР РЏ Р В Р’В·Р В Р’В°Р В РЎвЂќР В Р’В»Р В Р’В°Р В РўвЂ Р В РЎвЂўР В РЎвЂќ");
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
        activeCategory === "Р В РІР‚в„ўР РЋР С“Р В Р’Вµ"
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
