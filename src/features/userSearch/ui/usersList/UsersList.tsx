import { Loader, Typography } from '@/shared/ui'
import s from './UsersList.module.scss'
import { UserItem } from '@/features/userSearch/api/usersApi.types'
import { NotificationsLoader } from '@/features/notifications/ui'
import { User } from '@/features/userSearch/ui/usersList/User'
import { useRecentRequests } from '@/features/userSearch/utils/hooks/useRecentRequests'

type Props = {
  users: UserItem[]
  hasMore: boolean
  isFetching: boolean
  handleFetchMore: () => Promise<void>
}

export const UsersList = ({ users, handleFetchMore, hasMore, isFetching }: Props) => {
  const { recentRequests, addRequest } = useRecentRequests()

  return (
    <>
      {users.length > 0 ? (
        <div className={s.usersList}>
          {users.map((user) => (
            <User user={user} handleRequestClick={addRequest} key={user.id} />
          ))}
          <NotificationsLoader onLoadMore={handleFetchMore} hasMore={hasMore} />
          <div className={s.loaderContainer}> {hasMore && isFetching ? <Loader reduced /> : null}</div>
        </div>
      ) : (
        <div className={s.recentWrapper}>
          <Typography variant="h3">Recent requests</Typography>
          {recentRequests.length > 0 ? (
            <>
              {recentRequests.map((req) => (
                <User user={req} handleRequestClick={addRequest} key={req.id} />
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
