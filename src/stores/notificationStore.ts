import { create } from 'zustand';

export type NotificationType = 'success' | 'cancel' | 'warning' | 'info';

export interface AppNotification {
  id: string | number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  createdAt: number;
}

interface NotificationState {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'time' | 'read' | 'createdAt'>) => void;
  removeNotification: (id: string | number) => void;
  markAsRead: (id: string | number) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  addNotification: (notif) => set((state) => {
    const newNotif: AppNotification = {
      ...notif,
      id: Date.now().toString(),
      time: "Just now",
      read: false,
      createdAt: Date.now(),
    };
    return { notifications: [newNotif, ...state.notifications] };
  }),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),
  clearAll: () => set({ notifications: [] }),
  unreadCount: () => get().notifications.filter(n => !n.read).length,
}));
