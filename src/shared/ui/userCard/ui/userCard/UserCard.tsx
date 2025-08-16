import clsx from 'clsx'
import Link from 'next/link'
import { Avatar } from '@/shared/ui'
import { User } from '../../types/userCard.types'
import s from './UserCard.module.scss'

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
