import Link from 'next/link'
import { UserItem } from '@/features/userSearch/api/usersApi.types'
import { Avatar, Typography } from '@/shared/ui'
import { PATH } from '@/shared/config/routes'
import s from './UserSearch.module.scss'

export const User = ({
  user,
  handleRequestClick,
}: {
  user: UserItem
  handleRequestClick: (user: UserItem) => void
}) => {
  return (
    <div className={s.user} key={user.id}>
      <Avatar size="regular" avatar={user.avatars[0]?.url} name={user.userName} />
      <div className={s.userData}>
        <Link href={`${PATH.USER.PROFILE}/${user.id}`} onClick={() => handleRequestClick(user)}>
          {user.userName}
        </Link>
        <Typography>{`${user.firstName || ''} ${user.lastName || ''}`}</Typography>
      </div>
    </div>
  )
}
