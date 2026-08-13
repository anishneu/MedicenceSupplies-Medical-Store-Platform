import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Medication } from '../types'

interface CartState {
  items: CartItem[]
  addItem: (medication: Medication, quantity?: number) => void
  removeItem: (medicationId: number) => void
  updateQuantity: (medicationId: number, quantity: number) => void
  clear: () => void
  total: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (medication, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.medication.id === medication.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.medication.id === medication.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            }
          }
          return { items: [...state.items, { medication, quantity }] }
        }),
      removeItem: (medicationId) =>
        set((state) => ({ items: state.items.filter((i) => i.medication.id !== medicationId) })),
      updateQuantity: (medicationId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.medication.id === medicationId ? { ...i, quantity: Math.max(1, quantity) } : i,
          ),
        })),
      clear: () => set({ items: [] }),
      total: () =>
        get().items.reduce((sum, i) => sum + Number(i.medication.price) * i.quantity, 0),
    }),
    { name: 'medicence-cart' },
  ),
)
