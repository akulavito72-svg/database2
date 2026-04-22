import { message } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useProductsStore } from '../store/productsStore'
import type { Product, ProductInput } from '../types/product'
import { toProductInput } from '../types/product'
import { useDebounce } from './useDebounce'

interface UseProductsPageResult {
  searchValue: string
  isFormOpen: boolean
  editingProduct: Product | null
  filteredProducts: Product[]
  isLoading: boolean
  formInitialValues?: ProductInput
  setSearchValue: (value: string) => void
  openCreateForm: () => void
  openEditForm: (product: Product) => void
  closeForm: () => void
  handleDelete: (product: Product) => void
  handleSubmit: (values: ProductInput) => void
  handleRefresh: () => Promise<void>
}

export function useProductsPage(): UseProductsPageResult {
  const [searchValue, setSearchValue] = useState<string>('')
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const debouncedSearch = useDebounce(searchValue, 300)

  const products = useProductsStore((state) => state.products)
  const isLoading = useProductsStore((state) => state.isLoading)
  const hasLoaded = useProductsStore((state) => state.hasLoaded)
  const addProduct = useProductsStore((state) => state.addProduct)
  const updateProduct = useProductsStore((state) => state.updateProduct)
  const refreshProducts = useProductsStore((state) => state.refreshProducts)

  useEffect(() => {
    if (!hasLoaded && !isLoading) {
      void refreshProducts().then((result) => {
        if (!result.success) {
          message.error(result.error ?? 'Не удалось загрузить товары.')
        }
      })
    }
  }, [hasLoaded, isLoading, refreshProducts])

  const filteredProducts = useMemo<Product[]>(() => {
    const query = debouncedSearch.trim().toLowerCase()
    if (!query) {
      return products
    }

    return products.filter((product) => product.name.toLowerCase().includes(query))
  }, [debouncedSearch, products])

  const openCreateForm = () => {
    setEditingProduct(null)
    setIsFormOpen(true)
  }

  const openEditForm = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingProduct(null)
  }

  const handleDelete = (product: Product) => {
    message.info(`Действия: ${product.name}`)
  }

  const handleSubmit = (values: ProductInput) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, values)
      message.success('Товар обновлен')
    } else {
      addProduct(values)
      message.success('Товар добавлен')
    }

    closeForm()
  }

  const handleRefresh = async () => {
    const result = await refreshProducts()
    if (result.success) {
      message.success('Список товаров обновлен')
      return
    }

    message.error(result.error ?? 'Не удалось обновить список товаров.')
  }

  return {
    searchValue,
    isFormOpen,
    editingProduct,
    filteredProducts,
    isLoading,
    formInitialValues: editingProduct ? toProductInput(editingProduct) : undefined,
    setSearchValue,
    openCreateForm,
    openEditForm,
    closeForm,
    handleDelete,
    handleSubmit,
    handleRefresh,
  }
}
