import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
      }
    }),
    {
      name: 'elara-auth-storage', // name of item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default the 'localStorage' is used
    }
  )
);

export default useAuthStore;
