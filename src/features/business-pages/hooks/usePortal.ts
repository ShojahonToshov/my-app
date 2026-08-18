"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAuthStore from "../stores/authStore";
import AuthService from "../api/services/AuthService";

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
    toast.success("Public booking link copied", {
      description: "Send it to your clients for online booking.",
    });
  };

  const handleLogout = async () => {
    await AuthService.logout();
    logout();
    toast.info("Session ended");
    router.push("/login");
  };

  return {
    user: currentUser,
    router,
    handleCopyLink,
    handleLogout
  };
}
