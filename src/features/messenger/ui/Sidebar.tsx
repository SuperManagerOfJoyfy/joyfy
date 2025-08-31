'use client'
import { UserItem } from '@/features/userSearch/api/usersApi.types'
import { useSearchUser } from '@/features/userSearch/utils/hooks/useSearchUser'
import { PATH } from '@/shared/config/routes'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { UserPickerList } from '@/features/userSearch/ui/usersList/UserPickerList'
import { ChatList } from './ChatList'
import { TextField } from '@/shared/ui'
import s from './Sidebar.module.scss'

export const Sidebar = () => {
  const { users, isFetching, handleChangeValue, handleFetchMore, hasMore, searchValue, clearSearch } = useSearchUser({
    path: PATH.USER.MESSENGER,
  })
  const [_, setPickerOpen] = useState(false)

  const router = useRouter()

  const handleSelectUser = (user: UserItem) => {
    router.push(`/messenger/${user.id}`)
    clearSearch()
    setPickerOpen(false)
  }
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
      {searchValue.trim() !== '' && (
        <UserPickerList
          users={users}
          searchValue={searchValue}
          isFetching={isFetching}
          handleFetchMore={handleFetchMore}
          hasMore={hasMore}
          onUserSelect={handleSelectUser}
          className={s.usersPickerList}
        />
      )}
      <ChatList />
    </aside>
  )
}
