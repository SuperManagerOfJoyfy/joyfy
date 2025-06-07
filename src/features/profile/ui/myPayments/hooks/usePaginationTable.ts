import { useState, useCallback, useMemo } from 'react'

type UsePaginationProps<T> = {
  data: T[] | undefined
  defaultItemsPerPage?: number
  defaultCurrentPage?: number
}

type PaginationData<T> = {
  totalItems: number
  totalPages: number
  currentData: T[]
  hasData: boolean
  shouldShowPagination: boolean
}

export const usePagination = <T>({ data, defaultItemsPerPage = 10, defaultCurrentPage = 1 }: UsePaginationProps<T>) => {
  const [currentPage, setCurrentPage] = useState(defaultCurrentPage)
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage)

  const paginationData: PaginationData<T> = useMemo(() => {
    const totalItems = data?.length || 0
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = data?.slice(startIndex, endIndex) || []

    return {
      totalItems,
      totalPages,
      currentData,
      hasData: totalItems > 0,
      shouldShowPagination: totalPages > 1,
    }
  }, [data, currentPage, itemsPerPage])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleItemsPerPageChange = useCallback(
    (items: number) => {
      setItemsPerPage(items)
      const newTotalPages = Math.ceil((data?.length || 0) / items)
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages)
      } else {
        setCurrentPage(defaultCurrentPage)
      }
    },
    [data?.length, currentPage, defaultCurrentPage]
  )

  return {
    currentPage,
    itemsPerPage,
    paginationData,
    handlePageChange,
    handleItemsPerPageChange,
  }
}
