import { create } from 'zustand';

interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  [key: string]: unknown;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (userData: UserProfile) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<UserProfile>) => void;
}

const isBrowser = typeof window !== 'undefined';
const getInitialUser = (): UserProfile | null => {
  if (!isBrowser) return null;
  return JSON.parse(localStorage.getItem('currentUser') || 'null');
};

const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  isAuthenticated: isBrowser ? !!localStorage.getItem('currentUser') : false,
  
  login: (userData) => {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    set({ user: userData, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('currentUser');
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (updatedData) => {
    set((state) => {
      const newUser = state.user ? { ...state.user, ...updatedData } : null;
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return { user: newUser };
    });
  }
}));

export default useAuthStore;
