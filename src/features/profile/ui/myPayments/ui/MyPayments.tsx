import { useMemo, useEffect } from 'react'

import { Loader, Pagination } from '@/shared/ui'
import { useGetMyPaymentsQuery } from '@/features/profile/api'
import { PaymentsTable } from './paymentsTable'
import { usePaginationTable } from '../hooks'
import { PAGINATION_CONSTANTS } from '../utils'

import s from './MyPayments.module.scss'

export const MyPayments = () => {
  const { data: payments, isLoading, error } = useGetMyPaymentsQuery()

  const { currentPage, itemsPerPage, setCurrentPage, setItemsPerPage } = usePaginationTable({
    storageKey: PAGINATION_CONSTANTS.STORAGE_KEYS.PAYMENTS,
    defaultPage: PAGINATION_CONSTANTS.DEFAULT_CURRENT_PAGE,
    defaultItemsPerPage: PAGINATION_CONSTANTS.DEFAULT_ITEMS_PER_PAGE,
  })

  const paginationData = useMemo(() => {
    if (!payments) return { currentData: [], totalPages: 0, hasData: false }

    const totalPages = Math.ceil(payments.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentData = payments.slice(startIndex, startIndex + itemsPerPage)

    return {
      currentData,
      totalPages,
      hasData: payments.length > 0,
    }
  }, [payments, currentPage, itemsPerPage])

  useEffect(() => {
    if (paginationData.totalPages > 0 && currentPage > paginationData.totalPages) {
      setCurrentPage(1)
    }
  }, [paginationData.totalPages, currentPage, setCurrentPage])

  if (isLoading) {
    return (
      <div className={s.container}>
        <div className={s.loading}>
          <Loader message="Loading payments..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={s.container}>
        <div className={s.error}>Error loading payments. Please try again.</div>
      </div>
    )
  }

  if (!paginationData.hasData) {
    return (
      <div className={s.container}>
        <div className={s.empty}>No payments found.</div>
      </div>
    )
  }

  return (
    <div className={s.container}>
      <PaymentsTable payments={paginationData.currentData} />

      {paginationData.totalPages > 1 && (
        <div className={s.paginationContainer}>
          <Pagination
            currentPage={currentPage}
            totalPages={paginationData.totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      )}
    </div>
  )
}
