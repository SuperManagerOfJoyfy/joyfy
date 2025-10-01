'use client'

import clsx from 'clsx'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useTranslations } from 'next-intl'

import s from './pagination.module.scss'

import { SelectBox, SelectItem } from '@/shared/ui/selectBox/SelectBox'
import { usePagination } from '@/shared/ui/pagination/hooks/usePagination'

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
  const t = useTranslations('pagination')
  const pages = usePagination(currentPage, totalPages)

  const handlePageClick = (page: '...' | number) => {
    if (page !== currentPage && page !== '...') {
      onPageChange(page)
    }
  }

  const options = ['10', '20', '30', '50', '100'].map((v) => ({
    value: v,
    children: (
      <div>
        <span>{v}</span>
      </div>
    ),
  }))

  return (
    <div className={clsx(s.pagination, className)}>
      <div className={s.buttons}>
        <button
          className={clsx(s.button, currentPage === 1 && s.arrowDisabled)}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          type="button"
          aria-label={t('previousPage')}
          title={t('previousPage')}
        >
          <FiChevronLeft />
        </button>

        {pages.map((page, index) => (
          <button
            className={clsx(s.button, page === currentPage && s.active)}
            disabled={page === '...'}
            key={index}
            onClick={() => handlePageClick(Number(page))}
            type="button"
          >
            {page}
          </button>
        ))}

        <button
          className={clsx(s.button, (currentPage === totalPages || totalPages === 0) && s.arrowDisabled)}
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          type="button"
          aria-label={t('nextPage')}
          title={t('nextPage')}
        >
          <FiChevronRight />
        </button>
      </div>

      <div className={s.perPage}>
        <span>{t('show')}</span>

        <SelectBox
          className={s.select}
          value={itemsPerPage.toString()}
          onValueChange={(v) => onItemsPerPageChange(Number(v))}
        >
          {options.map((o) => (
            <SelectItem className={s.item} key={o.value} value={o.value}>
              {o.children}
            </SelectItem>
          ))}
        </SelectBox>

        <span>{t('onPage')}</span>
      </div>
    </div>
  )
}
