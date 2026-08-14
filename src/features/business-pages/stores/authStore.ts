import { create } from 'zustand';

interface AuthState {
  user: Record<string, unknown> | null;
  isAuthenticated: boolean;
  login: (userData: Record<string, unknown>) => void;
  logout: () => void;
  updateUser: (updatedData: Record<string, unknown>) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('currentUser') || 'null') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('currentUser') : false,
  
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
      const newUser = { ...(state.user || {}), ...updatedData };
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return { user: newUser };
    });
  }
}));

export default useAuthStore;
