const fs = require('fs');
const c = `import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  profile?: any;
  [key: string]: unknown;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (userData: UserProfile) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<UserProfile>) => void;
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
`;

fs.writeFileSync('src/features/market-pages/stores/authStore.ts', c);
