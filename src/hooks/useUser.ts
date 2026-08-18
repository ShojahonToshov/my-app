import { useQuery, useQueryClient } from "@tanstack/react-query";
import AuthService, { AppUser } from "@/features/market-pages/api/services/AuthService";

export type StoreUser = AppUser & Record<string, any>;

export default function useUser() {
  const queryClient = useQueryClient();
  
  const query = useQuery<StoreUser | null>({
    queryKey: ['user'],
    queryFn: async () => {
      const user = await AuthService.getCurrentUser();
      return user as StoreUser | null;
    },
    staleTime: 60 * 1000,
  });

  const updateUser = (updatedData: any) => {
    queryClient.setQueryData(['user'], (oldData: any) => {
      if (!oldData) return null;
      return { ...oldData, ...updatedData };
    });
  };

  const login = (userData: any) => {
    queryClient.setQueryData(['user'], userData);
  };

  const logout = () => {
    queryClient.setQueryData(['user'], null);
  };

  return {
    user: query.data,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data,
    login,
    updateUser,
    logout
  };
}
