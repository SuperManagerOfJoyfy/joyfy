import Link from 'next/link'
import { Avatar } from '@/shared/ui'
import s from './UserCard.module.scss'
import clsx from 'clsx'

export type User = {
  id: number
  userName: string
  avatar?: string
}

type Props = {
  user: User
  className?: string
  layout?: 'standalone' | 'inline' | 'stacked' //  'standalone' for use in headers, 'inline' - inside comments/posts, 'stacked' - messages
  children?: React.ReactNode
}

export const UserCard = ({ user, className, layout = 'standalone', children }: Props) => {
  const { avatar, id, userName } = user
  return (
    <div className={clsx(s.userInfo, s[layout], className)}>
      <Avatar avatar={avatar} name={userName} />
      <div className={s.textBlock}>
        <Link href={`/profile/${id}`} className={s.userName}>
          {userName}
        </Link>
        {children}
      </div>
    </div>
  )
}

//  <UserCard user={{ id: ownerId, userName, avatar: avatarOwner }} alignment="start">
//         {description}
//       </UserCard>
