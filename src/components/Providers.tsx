"use client";

import { toast } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import AuthService from "@/services/customer/AuthService";
import useAuthStore from "@/stores/authStore";
import { useI18nStore } from "@/stores/i18nStore";

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
    useI18nStore.getState().init();
    
    // Intercept native HTML5 validation tooltips globally
    const handleInvalid = (e: Event) => {
      e.preventDefault(); // Stop browser from showing default tooltip
      toast.error("Please fill out this field.", { id: "html5-validation-error" });
    };

    document.addEventListener("invalid", handleInvalid, true);
    
    return () => {
      document.removeEventListener("invalid", handleInvalid, true);
    };
  }, []);

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
      const currentUser = useAuthStore.getState().user;
      const tempUser = { ...user, profile: currentUser?.profile } as any;
      useAuthStore.getState().setUser(tempUser);

      // Fetch the full profile to ensure .profile exists if not already present
      if (!tempUser.profile) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (profile) {
          useAuthStore.getState().setUser({ ...tempUser, profile });
        }
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
