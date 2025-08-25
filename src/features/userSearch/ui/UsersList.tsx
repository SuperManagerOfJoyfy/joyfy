import { LazyLoader, Loader, Typography } from '@/shared/ui'
import s from './UsersList.module.scss'
import { UserItem } from '@/features/userSearch/api/usersApi.types'

import { User } from '@/features/userSearch/ui/User'
import { RootState, useAppDispatch } from '@/app/store/store'
import { useSelector } from 'react-redux'
import { addRequest } from '@/features/userSearch/model/recentRequestSlice'

type Props = {
  users: UserItem[]
  hasMore: boolean
  isFetching: boolean
  handleFetchMore: () => Promise<void>
}

export const UsersList = ({ users, handleFetchMore, hasMore, isFetching }: Props) => {
  const dispatch = useAppDispatch()
  const recentRequests = useSelector((state: RootState) => state.recentRequests.users)

  const handleRequestClick = (user: UserItem) => {
    dispatch(addRequest(user))
  }

  return (
    <>
      {users.length > 0 ? (
        <div className={s.usersList}>
          {users.map((user) => (
            <User user={user} handleRequestClick={handleRequestClick} key={user.id} />
          ))}
          <LazyLoader onLoadMore={handleFetchMore} hasMore={hasMore} />
          <div className={s.loaderContainer}> {hasMore && isFetching ? <Loader reduced /> : null}</div>
        </div>
      ) : (
        <div className={s.recentWrapper}>
          <Typography variant="h3">Recent requests</Typography>
          {recentRequests.length > 0 ? (
            <>
              {recentRequests.map((req) => (
                <User user={req} handleRequestClick={handleRequestClick} key={req.id} />
              ))}
            </>
          ) : (
            <div className={s.emptyList}>
              <Typography>Oops! This place looks empty!</Typography>
              <Typography variant="caption">No recent requests</Typography>
            </div>
          )}
        </div>
      )}
    </>
  )
}
