import clsx from 'clsx'
import { LazyLoader, Typography, UserCard } from '@/shared/ui'
import { UserItem } from '../../api/usersApi.types'
import s from './UserPickerList.module.scss'

type Props = {
  users: UserItem[]
  isFetching: boolean
  hasMore: boolean
  onUserSelect: (user: UserItem) => void
  handleFetchMore: () => Promise<void>
  searchValue: string
  className?: string
}

export const UserPickerList = ({ users, onUserSelect, hasMore, handleFetchMore, searchValue, className }: Props) => {
  return (
    <div className={clsx(s.usersPickerList, className)}>
      {users.length > 0
        ? users.map((u) => {
            const user = { id: u.id, userName: u.userName, avatar: u.avatars?.[0]?.url || '' }
            return (
              <div key={u.id} className={s.userItem} onClick={() => onUserSelect(u)}>
                <UserCard user={user} />
              </div>
            )
          })
        : searchValue.trim() !== '' && <Typography>No users found</Typography>}
      <LazyLoader onLoadMore={handleFetchMore} hasMore={hasMore} isFetching />
    </div>
  )
}
