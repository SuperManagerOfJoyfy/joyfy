import { Loader, Pagination } from '@/shared/ui'
import { useMockPaymentsQuery } from './useMockPaymentsQuery'
import { usePagination } from './hooks/usePaginationTable'
import { PAGINATION_CONSTANTS } from './utils/pagination'
import { PaymentsTable } from './paymentsTable'

import s from './MyPayments.module.scss'

export const MyPayments = () => {
  const { data: payments, isLoading, error } = useMockPaymentsQuery()

  const { currentPage, itemsPerPage, paginationData, handlePageChange, handleItemsPerPageChange } = usePagination({
    data: payments,
    defaultItemsPerPage: PAGINATION_CONSTANTS.DEFAULT_ITEMS_PER_PAGE,
    defaultCurrentPage: PAGINATION_CONSTANTS.DEFAULT_CURRENT_PAGE,
  })

  const LoadingState = () => (
    <div className={s.container}>
      <div className={s.loading}>
        <Loader message="Loading payments..." />
      </div>
    </div>
  )

  const ErrorState = () => (
    <div className={s.container}>
      <div className={s.error}>Error loading payments. Please try again.</div>
    </div>
  )

  const EmptyState = () => (
    <div className={s.container}>
      <div className={s.empty}>No payments found.</div>
    </div>
  )

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState />
  if (!paginationData.hasData) return <EmptyState />

  return (
    <div className={s.container}>
      <PaymentsTable payments={paginationData.currentData} />

      {paginationData.shouldShowPagination && (
        <div className={s.paginationContainer}>
          <Pagination
            currentPage={currentPage}
            totalPages={paginationData.totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}
    </div>
  )
}
