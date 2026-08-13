import { describe, expect, it } from 'vitest'
import { useCartStore } from '../store/cartStore'
import type { Medication } from '../types'

const med: Medication = {
  id: 1,
  name: 'Ibuprofen',
  category: 'Pain Relief',
  price: 6.49,
  stock: 20,
}

describe('cart store', () => {
  it('adds and totals items', () => {
    useCartStore.setState({ items: [] })
    useCartStore.getState().addItem(med, 2)
    useCartStore.getState().addItem(med, 1)
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].quantity).toBe(3)
    expect(useCartStore.getState().total()).toBeCloseTo(19.47)
  })
})
