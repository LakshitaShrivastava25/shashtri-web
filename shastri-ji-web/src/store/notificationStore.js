import { create } from 'zustand';
import { notificationsApi } from '../api/services';

export const useNotificationStore = create((set, get) => ({
  items: [],
  unreadCount: 0,
  isLoading: false,

  load: async () => {
    set({ isLoading: true });
    try {
      const [listRes, countRes] = await Promise.all([
        notificationsApi.list(false),
        notificationsApi.unreadCount(),
      ]);
      const items = Array.isArray(listRes)
        ? listRes
        : listRes?.results || listRes?.items || [];
      const unreadCount =
        typeof countRes === 'number'
          ? countRes
          : countRes?.unread_count ?? countRes?.count ?? 0;
      set({ items, unreadCount, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  markRead: async (id) => {
    try {
      await notificationsApi.markRead(id);
    } catch (err) {
      // ignore
    }
    const { items } = get();
    const updated = items.map((n) =>
      n.id === id ? { ...n, is_read: true } : n
    );
    const unread = updated.filter((n) => !n.is_read).length;
    set({ items: updated, unreadCount: unread });
  },

  markAllRead: async () => {
    try {
      await notificationsApi.markAllRead();
    } catch (err) {
      // ignore
    }
    const { items } = get();
    set({
      items: items.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    });
  },
}));
