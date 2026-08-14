"use client";
﻿import { useEffect } from "react";
import { useRouter } from "next/navigation";;
import { toast } from "sonner";
import useAuthStore from "../stores/authStore";

export default function usePortal() {
  const router = useRouter();
  const { user: currentUser, logout } = useAuthStore();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://superqueue.com/b/chop-chop");
    toast.success("Р СџРЎС“Р В±Р В»Р С‘РЎвЂЎР Р…Р В°РЎРЏ РЎРѓРЎРѓРЎвЂ№Р В»Р С”Р В° РЎРѓР С”Р С•Р С—Р С‘РЎР‚Р С•Р Р†Р В°Р Р…Р В°", {
      description: "Р С›РЎвЂљР С—РЎР‚Р В°Р Р†РЎРЉРЎвЂљР Вµ Р ВµРЎвЂ  Р С”Р В»Р С‘Р ВµР Р…РЎвЂљР В°Р С  Р Т‘Р В»РЎРЏ Р С•Р Р…Р В»Р В°Р в„–Р Р…-Р В·Р В°Р С—Р С‘РЎРѓР С‘.",
    });
  };

  const handleLogout = () => {
    logout();
    toast.info("Р РЋР ВµРЎРѓРЎРѓР С‘РЎРЏ Р В·Р В°Р Р†Р ВµРЎР‚РЎв‚¬Р ВµР Р…Р В°");
    router.push("/login");
  };

  return {
    user: currentUser,
    router,
    handleCopyLink,
    handleLogout
  };
}
