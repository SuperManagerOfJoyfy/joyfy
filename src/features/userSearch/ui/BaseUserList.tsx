'use client'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { LazyLoader, Scroll, Typography } from '@/shared/ui'
import { UserItem } from '../api'
import { useTranslations } from 'next-intl'
import s from './BaseUserList.module.scss'

type BaseUserListProps = {
  users: UserItem[]
  isFetching: boolean
  hasMore: boolean
  searchValue: string
  noResultsText?: string
  className?: string
  onLoadMore: () => Promise<void>
  onSelect?: (user: UserItem) => void
  renderUser: (user: UserItem) => React.ReactNode
}

export const BaseUserList = ({
  users,
  isFetching,
  hasMore,
  onLoadMore,
  searchValue,
  onSelect,
  renderUser,
  noResultsText,
  className,
}: BaseUserListProps) => {
  const t = useTranslations('userSearch')
  const trimmed = searchValue.trim()
  const [allowEmpty, setAllowEmpty] = useState(false)

  useEffect(() => {
    setAllowEmpty(false)
    const timer = setTimeout(() => setAllowEmpty(true), 300)
    return () => clearTimeout(timer)
  }, [trimmed])

  const showNoResults = allowEmpty && trimmed !== '' && !isFetching && users.length === 0
  const text = noResultsText ?? t('noResults')

  return (
    <div className={clsx(s.listContainer, className)}>
      <Scroll>
        {showNoResults ? (
          <Typography className={s.noResultsText}>{text}</Typography>
        ) : (
          users.map((u) => {
            const content = renderUser(u)
            return (
              <div key={u.id} className={s.userItem} onClick={onSelect ? () => onSelect(u) : undefined}>
                {content}
              </div>
            )
          })
        )}
        <LazyLoader onLoadMore={onLoadMore} hasMore={hasMore} isFetching={isFetching} />
      </Scroll>
    </div>
  )
}
