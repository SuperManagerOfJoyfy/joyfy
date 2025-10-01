'use client'

import { useState } from 'react'
import { UserItem } from '@/features/userSearch/api'
import { TextField, UserCard } from '@/shared/ui'
import { ChatList } from './ChatList'
import { BaseUserList } from '@/features/userSearch/ui'
import { useSearchUser } from '@/features/userSearch/utils/hooks'
import { PATH } from '@/shared/config/routes'
import s from './Sidebar.module.scss'
import { useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

export const Sidebar = () => {
  const { users, isFetching, handleChangeValue, handleFetchMore, hasMore, searchValue, clearSearch } = useSearchUser({
    path: PATH.USER.MESSENGER,
  })
  const [_, setPickerOpen] = useState(false)

  const router = useRouter()
  const locale = useLocale()

  const handleSelectUser = (user: UserItem) => {
    router.push(`${PATH.USER.MESSENGER}/${user.id}`, { locale })
    clearSearch()
    setPickerOpen(false)
  }

  const searching = searchValue.trim() !== ''

  return (
    <aside className={s.sidebar}>
      <div className={s.searchBox}>
        <TextField
          search
          placeholder="Search user"
          onChange={handleChangeValue}
          value={searchValue}
          isLoading={isFetching}
        />
      </div>

      <div className={s.body}>
        {searching ? (
          <BaseUserList
            className={s.usersList}
            users={users}
            searchValue={searchValue}
            isFetching={isFetching}
            onLoadMore={handleFetchMore}
            hasMore={hasMore}
            onSelect={handleSelectUser}
            renderUser={(u) => (
              <UserCard
                layout="stacked"
                className={s.userCard}
                user={{ id: u.id, userName: u.userName, avatar: u.avatars?.[0]?.url || '' }}
              >
                {`${u.firstName || ''} ${u.lastName || ''}`}
              </UserCard>
            )}
          />
        ) : (
          <ChatList />
        )}
      </div>
    </aside>
  )
}
