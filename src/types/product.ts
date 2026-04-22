export interface Product {
  id: number
  name: string
  category: string
  vendor: string
  article: string
  rating: number
  price: number
}

export type ProductInput = Omit<Product, 'id'>

export const toProductInput = (product: Product): ProductInput => ({
  name: product.name,
  category: product.category,
  vendor: product.vendor,
  article: product.article,
  rating: product.rating,
  price: product.price,
})
