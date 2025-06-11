import { Avatar } from '@/shared/ui'

import s from './AvatarGroup.module.scss'

type User = {
  userName: string
  avatars: { url: string }[]
}

type Props = {
  users: User[]
  maxDisplay?: number
}

export const AvatarGroup = ({ users, maxDisplay = 3 }: Props) => {
  const displayUsers = users.slice(0, maxDisplay)

  return (
    <div className={s.avatarGroup}>
      {displayUsers.map((user, index) => (
        <div
          key={index}
          className={s.avatarWrapper}
          style={{
            zIndex: displayUsers.length - index,
          }}
        >
          <Avatar avatar={user.avatars?.[0]?.url} name={user.userName} size={'small'} />
        </div>
      ))}
    </div>
  )
}
