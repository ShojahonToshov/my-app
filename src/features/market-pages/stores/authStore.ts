import { create } from 'zustand';

interface StoreUser {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  profile?: Record<string, unknown>;
  [key: string]: unknown;
}

interface AuthState {
  user: StoreUser | null;
  isAuthenticated: boolean;
  login: (userData: StoreUser) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<StoreUser>) => void;
  setAuth: (user: StoreUser | null) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: (userData) => {
    set({ user: userData, isAuthenticated: true });
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (updatedData) => {
    set((state) => {
      const newUser = state.user ? { ...state.user, ...updatedData } : null;
      return { user: newUser };
    });
  },

  setAuth: (user) => {
    set({ user, isAuthenticated: !!user });
  }
}));

export default useAuthStore;
