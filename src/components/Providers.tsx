"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import AuthService from "@/services/client/AuthService";
import useAuthStore from "@/stores/authStore";

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
        useAuthStore.getState().setUser(null);
        useAuthStore.getState().setLoading(false);
        return;
      }

      // Optimistic update with whatever data we have
      const tempUser = { ...user } as any;
      useAuthStore.getState().setUser(tempUser);

      // Fetch the full profile to ensure .profile exists
      const fullUser = await AuthService.getCurrentUser();
      if (fullUser) {
        useAuthStore.getState().setUser(fullUser as any);
      }
      useAuthStore.getState().setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
