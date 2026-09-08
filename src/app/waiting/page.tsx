"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useI18nStore } from "@/stores/i18nStore";
import { CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function WaitingPage() {
  const router = useRouter();
  const [isApproved, setIsApproved] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const t = useI18nStore(state => state.t);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "business") {
        setIsApproved(true);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    };

    checkStatus();

    // Poll every 3 seconds since realtime requires specific DB configuration
    intervalRef.current = setInterval(() => {
      if (!isApproved) {
        checkStatus();
      }
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [router, isApproved]);

  const handleContinue = async () => {
    setIsRedirecting(true);
    const supabase = createClient();
    await supabase.auth.refreshSession();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[100dvh] bg-[#ECECEA] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-100 flex flex-col items-center">
        {isApproved ? (
          <>
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-[#121415] mb-2">Request Approved!</h1>
            <p className="text-gray-500 mb-6">
              Your business registration has been reviewed and approved by the administrator.
            </p>
            <Button 
              className="w-full bg-[#121415] hover:bg-[#2A2D2E] text-white py-3 rounded-xl font-medium"
              onClick={handleContinue}
              disabled={isRedirecting}
            >
              {isRedirecting ? "Loading..." : "Continue to Dashboard"}
            </Button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-6">
              <Clock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-[#121415] mb-2">Registration Pending</h1>
            <p className="text-gray-500 mb-6">
              Your business registration request has been received. Please wait for an administrator to review and approve your request.
            </p>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-yellow-500 rounded-full animate-[pulse_2s_ease-in-out_infinite]" style={{ width: "100%" }}></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
