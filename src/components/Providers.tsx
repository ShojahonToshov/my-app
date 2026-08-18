"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import useMarketAuthStore from "@/features/market-pages/stores/authStore";
import useBusinessAuthStore from "@/features/business-pages/stores/authStore";
import useGlobalAuthStore from "@/stores/stores/authStore";
import AuthService from "@/features/market-pages/api/services/AuthService";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user;
      
      if (!user) {
        useMarketAuthStore.getState().setAuth(null);
        useBusinessAuthStore.getState().setAuth(null);
        useGlobalAuthStore.getState().setAuth(null);
        return;
      }

      // Optimistic update with whatever data we have
      const tempUser = { ...user } as any;
      useMarketAuthStore.getState().setAuth(tempUser);
      useBusinessAuthStore.getState().setAuth(tempUser);
      useGlobalAuthStore.getState().setAuth(tempUser);

      // Fetch the full profile to ensure .profile exists
      const fullUser = await AuthService.getCurrentUser();
      if (fullUser) {
        useMarketAuthStore.getState().setAuth(fullUser as any);
        useBusinessAuthStore.getState().setAuth(fullUser as any);
        useGlobalAuthStore.getState().setAuth(fullUser as any);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
