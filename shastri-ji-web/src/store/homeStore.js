import { create } from 'zustand';
import { bannersApi, ritualsApi, priestsApi } from '../api/services';

const TTL_MS = 5 * 60 * 1000;

const extractList = (res) =>
  Array.isArray(res) ? res : res?.results || res?.items || [];

export const useHomeStore = create((set, get) => ({
  banners: [],
  featuredRituals: [],
  featuredPriests: [],
  isLoading: false,
  lastFetched: null,

  loadHomeData: async (force = false) => {
    const { lastFetched } = get();
    const isFresh = lastFetched && Date.now() - lastFetched < TTL_MS;
    if (!force && isFresh) return;

    set({ isLoading: true });
    try {
      const [banners, rituals, priests] = await Promise.all([
        bannersApi.list(),
        ritualsApi.featured(),
        priestsApi.featured(),
      ]);
      set({
        banners: extractList(banners),
        featuredRituals: extractList(rituals),
        featuredPriests: extractList(priests),
        isLoading: false,
        lastFetched: Date.now(),
      });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  refresh: async () => {
    await get().loadHomeData(true);
  },
}));
