import { useState } from 'react'

import { createPaginationStorageKeys, getStoredValue, PAGINATION_CONSTANTS, setStoredValue } from '../utils'

type UsePaginationProps = {
  storageKey: string
  defaultPage?: number
  defaultItemsPerPage?: number
}

type UsePaginationReturn = {
  currentPage: number
  itemsPerPage: number
  setCurrentPage: (page: number) => void
  setItemsPerPage: (items: number) => void
}

export const usePaginationTable = ({
  storageKey,
  defaultPage = PAGINATION_CONSTANTS.DEFAULT_CURRENT_PAGE,
  defaultItemsPerPage = PAGINATION_CONSTANTS.DEFAULT_ITEMS_PER_PAGE,
}: UsePaginationProps): UsePaginationReturn => {
  const STORAGE_KEYS = createPaginationStorageKeys(storageKey)

  const [currentPage, setCurrentPageState] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEYS.CURRENT_PAGE)
    return saved ? parseInt(saved, 10) : defaultPage
  })

  const [itemsPerPage, setItemsPerPageState] = useState(() =>
    getStoredValue(STORAGE_KEYS.ITEMS_PER_PAGE, defaultItemsPerPage)
  )

  const setCurrentPage = (page: number) => {
    setCurrentPageState(page)
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_PAGE, page.toString())
  }

  const setItemsPerPage = (items: number) => {
    setItemsPerPageState(items)
    setStoredValue(STORAGE_KEYS.ITEMS_PER_PAGE, items)
    setCurrentPage(1)
  }

  return {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
  }
}
