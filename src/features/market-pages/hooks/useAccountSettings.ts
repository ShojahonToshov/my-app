"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";;
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AuthService from "../api/services/AuthService";
import { toast } from "sonner";
import useUser from "@/hooks/useUser";

import { queryKeys } from "../lib/queryKeys";

export default function useAccountSettings() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: currentUser, updateUser, logout } = useUser();
  
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
      updateUser(variables as any);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(currentUser?.id || "") });
      toast.success("Profile details updated successfully!");
    },
    onError: () => {
      toast.error("Failed to save changes.");
    }
  });

  const handleSave = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!currentUser || !currentUser.id) return;

    const updatedData = { ...currentUser, name, login, password };
    updateProfileMutation.mutate(updatedData);
  };

  const handleLogout = async () => {
    await AuthService.logout();
    logout();
    toast.info("You have logged out.");
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
