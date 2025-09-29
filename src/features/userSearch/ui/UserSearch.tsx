'use client'

import { useSearchUser } from '@/features/userSearch/utils/hooks/useSearchUser'
import { PATH } from '@/shared/config/routes'
import { TextField } from '@/shared/ui'
import { useRecentRequests } from '../utils/hooks/useRecentRequests'
import { BaseUserList } from './BaseUserList'
import { RecentRequests } from './RecentRequests'
import { User } from './User'
import s from './UserSearch.module.scss'
import { selectCurrentUserId } from '@/features/auth/model/authSlice'
import { useSelector } from 'react-redux'

export const UserSearch = () => {
  const userId = useSelector(selectCurrentUserId)
  const { handleChangeValue, handleFetchMore, hasMore, isFetching, searchValue, users } = useSearchUser({
    path: PATH.USER.SEARCH,
  })
  const { recentRequests, addRequest } = useRecentRequests(userId)

  return (
    <div className={s.userSearch}>
      <TextField search placeholder="Search" onChange={handleChangeValue} value={searchValue} isLoading={isFetching} />

      {users.length > 0 ? (
        <BaseUserList
          className={s.usersList}
          users={users}
          isFetching={isFetching}
          hasMore={hasMore}
          onLoadMore={handleFetchMore}
          searchValue={searchValue}
          renderUser={(u) => <User user={u} handleRequestClick={addRequest} />}
        />
      ) : (
        <RecentRequests recentRequests={recentRequests} addRequest={addRequest} />
      )}
    </div>
  )
}
