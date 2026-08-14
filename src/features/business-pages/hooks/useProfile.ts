"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";;
import { useMutation } from "@tanstack/react-query";
import AuthService from "../api/services/AuthService";
import { toast } from "sonner";
import useAuthStore from "../stores/authStore";

export default function useProfile() {
  const router = useRouter();
  const { user: currentUser, updateUser, logout } = useAuthStore();
  
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
      toast.success("Р вЂќР В°Р Р…Р Р…РЎвЂ№Р Вµ РЎС“РЎРѓР С—Р ВµРЎв‚¬Р Р…Р С• Р С•Р В±Р Р…Р С•Р Р†Р В»Р ВµР Р…РЎвЂ№", {
        description: "Р вЂ™Р В°РЎв‚¬ Р С—РЎР‚Р С•РЎвЂћР С‘Р В»РЎРЉ Р В°Р Т‘Р С Р С‘Р Р…Р С‘РЎРѓРЎвЂљРЎР‚Р В°РЎвЂљР С•РЎР‚Р В° РЎРѓР С•РЎвЂ¦РЎР‚Р В°Р Р…Р ВµР Р…."
      });
    },
    onError: () => {
      toast.error("Р С›РЎв‚¬Р С‘Р В±Р С”Р В° Р С—РЎР‚Р С‘ РЎРѓР С•РЎвЂ¦РЎР‚Р В°Р Р…Р ВµР Р…Р С‘Р С‘.");
    }
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUser.id) return;
    const updatedData = { ...currentUser, name, login, password };
    updateProfileMutation.mutate(updatedData);
  };

  const handleLogout = () => {
    logout();
    toast.info("Р вЂ™РЎвЂ№ Р Р†РЎвЂ№РЎв‚¬Р В»Р С‘ Р С‘Р В· РЎРѓР С‘РЎРѓРЎвЂљР ВµР С РЎвЂ№");
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
