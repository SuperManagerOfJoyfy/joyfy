'use client'

import { useSearchUser } from '@/features/userSearch/utils/hooks/useSearchUser'
import { UsersList } from '@/features/userSearch/ui/usersList/UsersList'
import { PATH } from '@/shared/config/routes'
import { TextField } from '@/shared/ui'

export const UserSearch = () => {
  const { handleChangeValue, handleFetchMore, hasMore, isFetching, searchValue, users } = useSearchUser({
    path: PATH.USER.SEARCH,
  })
  return (
    <div style={{ marginTop: '15px' }}>
      <TextField search placeholder="Search" onChange={handleChangeValue} value={searchValue} isLoading={isFetching} />
      <UsersList users={users} isFetching={isFetching} handleFetchMore={handleFetchMore} hasMore={hasMore} />
    </div>
  )
}
