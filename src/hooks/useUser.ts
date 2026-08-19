import AuthService from "@/services/client/AuthService";
import type { AppUser  } from "@/services/AuthService";
import useAuthStore from "@/stores/authStore";

export type StoreUser = AppUser & Record<string, any>;

export default function useUser() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setUser = useAuthStore((state) => state.setUser);

  const updateUser = (updatedData: any) => {
    if (!user) return;
    setUser({ ...user, ...updatedData });
  };

  const login = (userData: any) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    updateUser,
    logout
  };
}
