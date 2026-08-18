import { create } from 'zustand';

interface AuthState {
  user: Record<string, unknown> | null;
  isAuthenticated: boolean;
  login: (userData: Record<string, unknown>) => void;
  logout: () => void;
  updateUser: (updatedData: Record<string, unknown>) => void;
  setAuth: (user: Record<string, unknown> | null) => void;
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
      const newUser = { ...(state.user || {}), ...updatedData };
      return { user: newUser };
    });
  },

  setAuth: (user) => {
    set({ user, isAuthenticated: !!user });
  }
}));

export default useAuthStore;
