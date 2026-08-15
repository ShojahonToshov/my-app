"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";;
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AuthService from "../api/services/AuthService";
import { toast } from "sonner";
import useAuthStore from "../stores/authStore";
import { queryKeys } from "../lib/queryKeys";

export default function useAccountSettings() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: currentUser, updateUser, logout } = useAuthStore();
  
  const [name, setName] = useState(currentUser?.name || "");
  const [login, setLogin] = useState(currentUser?.login || "");
  const [password, setPassword] = useState(currentUser?.password || "");

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  const updateProfileMutation = useMutation({
    mutationFn: (updatedData: Partial<NonNullable<typeof currentUser>>) => {
      if (!currentUser) throw new Error("No user");
      return AuthService.updateProfile(currentUser.id, updatedData as Record<string, unknown>);
    },
    onSuccess: (data, variables) => {
      updateUser(variables as { id: string; name: string; login?: string; password?: string });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(currentUser?.id || "") });
      toast.success("Р вЂќР В°Р Р…Р Р…РЎвЂ№Р Вµ Р С•Р В±Р Р…Р С•Р Р†Р В»Р ВµР Р…РЎвЂ№!");
    },
    onError: () => {
      toast.error("Р С›РЎв‚¬Р С‘Р В±Р С”Р В° Р С—РЎР‚Р С‘ РЎРѓР С•РЎвЂ¦РЎР‚Р В°Р Р…Р ВµР Р…Р С‘Р С‘.");
    }
  });

  const handleSave = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!currentUser || !currentUser.id) return;

    const updatedData = { ...currentUser, name, login, password };
    updateProfileMutation.mutate(updatedData);
  };

  const handleLogout = () => {
    logout();
    toast.info("Р вЂ™РЎвЂ№ Р Р†РЎвЂ№РЎв‚¬Р В»Р С‘ Р С‘Р В· Р В°Р С”Р С”Р В°РЎС“Р Р…РЎвЂљР В°");
    router.push("/login");
  };

  return {
    router,
    user: currentUser,
    name, setName,
    login, setLogin,
    password, setPassword,
    isSubmitting: updateProfileMutation.isPending,
    handleSave,
    handleLogout
  };
}
