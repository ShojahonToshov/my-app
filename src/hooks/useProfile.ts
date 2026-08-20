"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import AuthService from "@/services/customer/AuthService";
import { toast } from "sonner";
import useUser from "@/hooks/useUser";

export default function useProfile() {
  const router = useRouter();
  const { user: currentUser, updateUser, logout } = useUser();
  
  const [name, setName] = useState(currentUser?.name || "");
  const [login, setLogin] = useState(currentUser?.login || "");
  const [password, setPassword] = useState(currentUser?.password || "");
  const [isLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  const updateProfileMutation = useMutation({
    mutationFn: (updatedData: Record<string, unknown>) => AuthService.updateProfile(currentUser!.id as string, updatedData),
    onSuccess: (_, updatedData) => {
      updateUser(updatedData);
      toast.success("Profile updated successfully", {
        description: "Your administrator profile information has been saved."
      });
    },
    onError: () => {
      toast.error("Error saving profile.");
    }
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUser.id) return;
    const updatedData = { ...currentUser, name, login, password };
    updateProfileMutation.mutate(updatedData);
  };

  const handleLogout = async () => {
    await AuthService.logout();
    logout();
    toast.info("Logged out successfully");
    router.push("/login");
  };

  return {
    user: currentUser,
    name, setName,
    login, setLogin,
    password, setPassword,
    isLoading,
    isSubmitting: updateProfileMutation.isPending,
    handleSave,
    handleLogout
  };
}
