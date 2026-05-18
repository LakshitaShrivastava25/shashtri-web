import { create } from 'zustand';
import { authApi } from '../api/services';
import { tokenStorage } from '../api/client';

export const useAuthStore = create((set, get) => ({
  isLoggedIn: false,
  user: null,
  role: null,
  registrationCompleted: false,
  isLoading: true,

  init: async () => {
    const access = tokenStorage.getAccess();
    if (!access) {
      set({ isLoading: false });
      return;
    }
    try {
      const user = await authApi.getProfile();
      set({
        isLoggedIn: true,
        user,
        role: user?.role || null,
        registrationCompleted: !!user?.registration_completed,
        isLoading: false,
      });
    } catch (err) {
      tokenStorage.clear();
      set({
        isLoggedIn: false,
        user: null,
        role: null,
        registrationCompleted: false,
        isLoading: false,
      });
    }
  },

  login: (tokens, user) => {
    tokenStorage.setTokens(tokens?.access, tokens?.refresh);
    set({
      isLoggedIn: true,
      user,
      role: user?.role || null,
      registrationCompleted: !!user?.registration_completed,
      isLoading: false,
    });
  },

  logout: () => {
    tokenStorage.clear();
    set({
      isLoggedIn: false,
      user: null,
      role: null,
      registrationCompleted: false,
      isLoading: false,
    });
  },

  markRegistrationCompleted: () => set({ registrationCompleted: true }),

  refreshAuthStatus: async () => {
    try {
      const user = await authApi.getProfile();
      set({
        isLoggedIn: true,
        user,
        role: user?.role || null,
        registrationCompleted: !!user?.registration_completed,
      });
    } catch (err) {
      // ignore
    }
  },
}));
