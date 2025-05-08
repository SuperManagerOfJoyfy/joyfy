export const usePagination = (currentPage: number, totalPages: number) => {
  function createRange(start: number, end: number) {
    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx)
  }

  if (totalPages <= 5) {
    return createRange(1, totalPages)
  }

  const pages: (number | string)[] = []
  const dots = '...'

  if (currentPage <= 4) {
    pages.push(...createRange(1, 5), dots, totalPages)
  } else if (currentPage >= totalPages - 3) {
    pages.push(1, dots, ...createRange(totalPages - 4, totalPages))
  } else {
    pages.push(1, dots, ...createRange(currentPage - 1, currentPage + 1), dots, totalPages)
  }

  return pages
}
