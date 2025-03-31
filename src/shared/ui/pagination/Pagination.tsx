import clsx from 'clsx'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import s from './pagination.module.scss'

import { SelectBox, SelectItem } from '@/shared/ui/selectBox/SelectBox'
import { usePagination } from '@/shared/hooks/usePagination'

type Props = {
  className?: string
  currentPage: number
  itemsPerPage: number
  onItemsPerPageChange: (items: number) => void
  onPageChange: (page: number) => void
  totalPages?: number
}

export const Pagination = ({
  className,
  currentPage,
  itemsPerPage,
  onItemsPerPageChange,
  onPageChange,
  totalPages = 1,
}: Props) => {
  const pages = usePagination(currentPage, totalPages)

  const handlePageClick = (page: '...' | number) => {
    if (page !== currentPage && page !== '...') {
      onPageChange(page)
    }
  }

  const options = [
    {
      value: '10',
      children: (
        <div>
          <span>10</span>
        </div>
      ),
    },
    {
      value: '20',
      children: (
        <div>
          <span>20</span>
        </div>
      ),
    },
    {
      value: '30',
      children: (
        <div>
          <span>30</span>
        </div>
      ),
    },
    {
      value: '50',
      children: (
        <div>
          <span>50</span>
        </div>
      ),
    },
    {
      value: '100',
      children: (
        <div>
          <span>100</span>
        </div>
      ),
    },
  ]

  return (
    <div className={clsx(s.pagination, className)}>
      <div className={s.buttons}>
        <button
          className={clsx(s.button, currentPage === 1 && s.arrowDisabled)}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          type={'button'}
          aria-label="Previous page"
        >
          <FiChevronLeft />
        </button>

        {pages.map((page, index) => (
          <button
            className={clsx(s.button, page === currentPage && s.active)}
            disabled={page === '...'}
            key={index}
            onClick={() => handlePageClick(Number(page))}
            type={'button'}
          >
            {page}
          </button>
        ))}

        <button
          className={clsx(
            s.button,
            (currentPage === totalPages || totalPages === 0) && s.arrowDisabled
          )}
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          type={'button'}
          aria-label="Next page"
        >
          <FiChevronRight />
        </button>
      </div>

      <div className={s.perPage}>
        <span>Show</span>

        <SelectBox
          className={s.select}
          value={itemsPerPage.toString()}
          onValueChange={(v) => onItemsPerPageChange(Number(v))}
        >
          {options.map((o) => {
            return (
              <SelectItem className={s.item} key={o.value} value={o.value}>
                {o.children}
              </SelectItem>
            )
          })}
        </SelectBox>

        <span>on page</span>
      </div>
    </div>
  )
}
