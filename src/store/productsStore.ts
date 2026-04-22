import { create } from 'zustand'
import { fetchProductsFromDummyJson } from '../api/dummyJson'
import type { Product, ProductInput } from '../types/product'
import type { ActionResult } from '../types/result'

type ProductsState = {
  products: Product[]
  isLoading: boolean
  hasLoaded: boolean
  addProduct: (product: ProductInput) => void
  updateProduct: (id: number, product: ProductInput) => void
  refreshProducts: () => Promise<ActionResult>
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  isLoading: false,
  hasLoaded: false,

  addProduct: (product: ProductInput) => {
    const nextId = get().products.length + 1
    set((state) => ({
      products: [...state.products, { id: nextId, ...product }],
    }))
  },

  updateProduct: (id: number, product: ProductInput) => {
    set((state) => ({
      products: state.products.map((item) => (item.id === id ? { ...item, ...product } : item)),
    }))
  },

  refreshProducts: async () => {
    set({ isLoading: true })

    try {
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 500)
      })

      const products = await fetchProductsFromDummyJson()
      set({
        products,
        isLoading: false,
        hasLoaded: true,
      })
      return { success: true }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Не удалось загрузить товары. Попробуйте позже.'
      set({ isLoading: false })
      return { success: false, error: errorMessage }
    }
  },
}))
