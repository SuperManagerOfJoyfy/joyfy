import type { Meta } from '@storybook/react'

import { useState } from 'react'

import { Pagination } from './Pagination'

const meta = {
  component: Pagination,
  tags: ['autodocs'],
  title: 'Components/Pagination',
} satisfies Meta<typeof Pagination>

export default meta

const usePaginationState = (totalItems: number, defaultItemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage)
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    handlePageChange,
    handleItemsPerPageChange,
  }
}

export const Default = {
  render: () => {
    const { currentPage, itemsPerPage, totalPages, handlePageChange, handleItemsPerPageChange } =
      usePaginationState(100)

    return (
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />
    )
  },
}
