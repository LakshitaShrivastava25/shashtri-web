import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Cart line items are keyed by the composite (variantId, vendorId) — the same
// product variant from a different vendor is a separate line.
const sameLine = (a, b) =>
  String(a.variantId) === String(b.variantId) &&
  String(a.vendorId) === String(b.vendorId);

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) =>
        set((state) => {
          const incomingQty =
            Number(item?.qty) > 0 ? Number(item.qty) : 1;
          const existing = state.items.find((i) => sameLine(i, item));
          if (existing) {
            // Bump qty, keep latest metadata (price, name, image)
            return {
              items: state.items.map((i) =>
                sameLine(i, item)
                  ? { ...i, ...item, qty: i.qty + incomingQty }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, qty: incomingQty }],
          };
        }),

      removeFromCart: (variantId, vendorId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !sameLine(i, { variantId, vendorId })
          ),
        })),

      updateQty: (variantId, vendorId, qty) => {
        const next = Number(qty);
        if (!Number.isFinite(next) || next <= 0) {
          // Treat 0 / negative / NaN as a remove
          get().removeFromCart(variantId, vendorId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            sameLine(i, { variantId, vendorId }) ? { ...i, qty: next } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      // Computed reads — call as `useCartStore.getState().getTotalItems()`
      // or via a selector hook in components.
      getTotalItems: () =>
        get().items.reduce((sum, i) => sum + (Number(i.qty) || 0), 0),

      getSubtotal: () =>
        get().items.reduce(
          (sum, i) =>
            sum + (Number(i.price) || 0) * (Number(i.qty) || 0),
          0
        ),
    }),
    {
      name: 'shastri_cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      version: 1,
    }
  )
);

// Selector helpers so components can subscribe to derived values without
// re-rendering on every unrelated cart change.
export const selectTotalItems = (state) =>
  state.items.reduce((sum, i) => sum + (Number(i.qty) || 0), 0);

export const selectSubtotal = (state) =>
  state.items.reduce(
    (sum, i) => sum + (Number(i.price) || 0) * (Number(i.qty) || 0),
    0
  );
