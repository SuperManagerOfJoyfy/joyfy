import { Typography } from '@/shared/ui'
import { User } from './User'
import { UserItem } from '../api/usersApi.types'
import s from './UserSearch.module.scss'

type Props = { recentRequests: UserItem[]; addRequest: (user: UserItem) => void }

export const RecentRequests = ({ recentRequests, addRequest }: Props) => {
  return (
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
  )
}
