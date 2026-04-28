import { create } from 'zustand';
import type { CreateOrderItemDto } from '../types';

interface CartStore {
  items: CreateOrderItemDto[];
  addItem: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartStore>(set => ({
  items: [],
  addItem: (productId, quantity) =>
    set(s => ({
      items: [...s.items.filter(i => i.productId !== productId), { productId, quantity }],
    })),
  removeItem: productId =>
    set(s => ({ items: s.items.filter(i => i.productId !== productId) })),
  updateQuantity: (productId, quantity) =>
    set(s => ({
      items: s.items.map(i => (i.productId === productId ? { ...i, quantity } : i)),
    })),
  clear: () => set({ items: [] }),
}));
