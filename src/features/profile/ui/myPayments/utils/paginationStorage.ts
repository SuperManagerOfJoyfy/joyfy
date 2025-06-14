export type PaginationStorageKeys = {
  CURRENT_PAGE: string
  ITEMS_PER_PAGE: string
}

export const createPaginationStorageKeys = (prefix: string): PaginationStorageKeys => ({
  CURRENT_PAGE: `${prefix}_current_page`,
  ITEMS_PER_PAGE: `${prefix}_items_per_page`,
})

export const getStoredValue = (key: string, defaultValue: number): number => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? parseInt(stored, 10) : defaultValue
  } catch {
    return defaultValue
  }
}

export const setStoredValue = (key: string, value: number): void => {
  try {
    localStorage.setItem(key, value.toString())
  } catch {}
}
