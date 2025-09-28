'use client'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { LazyLoader, Scroll, Typography } from '@/shared/ui'
import { UserItem } from '../api'
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
  noResultsText = 'No users found',
  className,
}: BaseUserListProps) => {
  const trimmed = searchValue.trim()
  const [allowEmpty, setAllowEmpty] = useState(false)

  useEffect(() => {
    setAllowEmpty(false)
    const t = setTimeout(() => setAllowEmpty(true), 300)
    return () => clearTimeout(t)
  }, [trimmed])

  const showNoResults = allowEmpty && trimmed !== '' && !isFetching && users.length === 0

  return (
    <div className={clsx(s.listContainer, className)}>
      <Scroll>
        {showNoResults ? (
          <Typography className={s.noResultsText}>{noResultsText}</Typography>
        ) : (
          users.map((u) => {
            const content = renderUser(u)
            return (
              <div
                key={u.id}
                className={s.userItem}
                onClick={onSelect ? () => onSelect(u) : undefined}
                //role={onSelect ? 'button' : undefined}
              >
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
