import { useEffect, useMemo, useState } from 'react'
import type { TablePaginationConfig } from 'antd/es/table'

interface UseTablePaginationOptions {
  total: number
  pageSize: number
  showTotal?: (total: number, range: [number, number], currentPage: number) => string
}

interface UseTablePaginationResult {
  currentPage: number
  pagination: TablePaginationConfig
}

export function useTablePagination({
  total,
  pageSize,
  showTotal,
}: UseTablePaginationOptions): UseTablePaginationResult {
  const [currentPage, setCurrentPage] = useState<number>(1)

  const maxPage = useMemo<number>(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])

  useEffect(() => {
    if (currentPage > maxPage) {
      setCurrentPage(maxPage)
    }
  }, [currentPage, maxPage])

  const pagination: TablePaginationConfig = useMemo(
    () => ({
      current: currentPage,
      pageSize,
      total,
      onChange: (page: number) => setCurrentPage(page),
      showSizeChanger: false,
      showTotal: showTotal ? (itemsTotal, range) => showTotal(itemsTotal, range, currentPage) : undefined,
    }),
    [currentPage, pageSize, showTotal, total],
  )

  return {
    currentPage,
    pagination,
  }
}
