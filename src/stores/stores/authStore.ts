import { create } from 'zustand';

interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  [key: string]: unknown;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (userData: UserProfile) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<UserProfile>) => void;
  setAuth: (user: UserProfile | null) => void;
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
