import { create } from 'zustand';
import type { StoreUser } from '@/hooks/useUser';

interface AuthState {
  user: StoreUser | null;
  isLoading: boolean;
  setUser: (user: StoreUser | null) => void;
  setLoading: (isLoading: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore;
